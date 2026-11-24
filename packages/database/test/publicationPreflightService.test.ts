// packages/database/test/publicationPreflightService.test.ts
// DentalVis — Unit Tests for PublicationPreflightService (M6.1.4)
// Architecture Baseline v1.9.1 (FROZEN)

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock server-only for node test runner
vi.mock('server-only', () => ({}));

import { PublicationPreflightService } from '../src/governance/publicationPreflightService';
import { PolicyConfigurationAdapter } from '../src/governance/policyAdapter';
import { canonicalizeJson } from '../src/governance/governanceAuditService';
import { createHash } from 'crypto';
import type { PrismaClient } from '@prisma/client';

describe('PublicationPreflightService (M6.1.4 Unit Tests)', () => {
  let mockPrisma: any;
  let service: PublicationPreflightService;
  let policyAdapter: PolicyConfigurationAdapter;

  const sampleSnapshot = {
    title: 'Root Canal Treatment',
    steps: ['Access Opening', 'Cleaning and Shaping', 'Obturation'],
    clinicalMetadata: {
      riskTier: 'TIER_1',
      primarySpecialty: 'ENDODONTICS',
    },
  };

  const validCanonicalString = canonicalizeJson(sampleSnapshot);
  const validContentHash = createHash('sha256').update(validCanonicalString, 'utf8').digest('hex');

  const validRevision = {
    id: 'rev-preflight-01',
    procedureId: 'proc-root-canal',
    language: 'en',
    authorId: 'usr-author-01',
    contentHash: validContentHash,
    snapshotData: sampleSnapshot,
    author: { id: 'usr-author-01', fullName: 'Dr. Content Author' },
    translation: {
      currentStatus: 'APPROVED',
      language: 'en',
    },
    coverMedia: {
      id: 'media-cover-01',
      validationStatus: 'VERIFIED',
    },
    model3DMedia: null,
    approvals: [
      {
        id: 'app-01',
        reviewerId: 'usr-rev-01',
        licenseNumber: 'DENT-LIC-1122',
        clinicalSpecialty: 'ENDODONTICS',
        decision: 'APPROVED',
        isRevoked: false,
        signedAt: new Date(),
        reviewer: { id: 'usr-rev-01', isActive: true, role: 'CLINICAL_REVIEWER' },
      },
    ],
  };

  beforeEach(() => {
    policyAdapter = new PolicyConfigurationAdapter();
    mockPrisma = {
      procedureRevision: {
        findUnique: vi.fn().mockResolvedValue(validRevision),
      },
      procedureTranslation: {
        findUnique: vi.fn(),
      },
      // Note: Verify zero write methods are called
      adminAuditLog: { create: vi.fn() },
      procedureApproval: { update: vi.fn(), create: vi.fn() },
    };

    service = new PublicationPreflightService({
      prisma: mockPrisma as unknown as PrismaClient,
      policyAdapter,
    });
  });

  it('TEST-PPS-01: Verifies content-hash matches canonical RFC 8785 snapshot digest', async () => {
    const result = await service.runPreflight({ revisionId: 'rev-preflight-01' });
    expect(result.contentHashVerified).toBe(true);
    expect(result.calculatedContentHash).toBe(validContentHash);
    expect(result.storedContentHash).toBe(validContentHash);
    expect(result.blockingReasons).not.toContain('CONTENT_HASH_MISMATCH');
  });

  it('TEST-PPS-02: Strictly blocks preflight when content hash does not match (tampering / corruption)', async () => {
    mockPrisma.procedureRevision.findUnique.mockResolvedValueOnce({
      ...validRevision,
      contentHash: 'corrupted-tampered-hash-value-0000000000000000000000000000000000',
    });

    const result = await service.runPreflight({ revisionId: 'rev-preflight-01' });
    expect(result.passed).toBe(false);
    expect(result.contentHashVerified).toBe(false);
    expect(result.blockingReasons).toContain('CONTENT_HASH_MISMATCH');
  });

  it('TEST-PPS-03: Blocks preflight when procedure translation status is not APPROVED', async () => {
    mockPrisma.procedureRevision.findUnique.mockResolvedValueOnce({
      ...validRevision,
      translation: { currentStatus: 'PENDING_APPROVAL' },
    });

    const result = await service.runPreflight({ revisionId: 'rev-preflight-01' });
    expect(result.passed).toBe(false);
    expect(result.blockingReasons).toContain('REVISION_STATUS_INVALID');
  });

  it('TEST-PPS-04: Blocks preflight when approvals contain revoked approval', async () => {
    mockPrisma.procedureRevision.findUnique.mockResolvedValueOnce({
      ...validRevision,
      approvals: [
        {
          ...validRevision.approvals[0],
          isRevoked: true,
        },
      ],
    });

    const result = await service.runPreflight({ revisionId: 'rev-preflight-01' });
    expect(result.passed).toBe(false);
    expect(result.blockingReasons).toContain('APPROVAL_REVOKED');
  });

  it('TEST-PPS-05: Fails closed when quorum policy is unratified in policy adapter', async () => {
    const result = await service.runPreflight({ revisionId: 'rev-preflight-01' });
    // In unratified M5 state, quorum policy throws UnratifiedGovernancePolicyError
    expect(result.passed).toBe(false);
    expect(result.blockingReasons).toContain('QUORUM_POLICY_UNRATIFIED');
    expect(result.unresolvedPolicies).toContain('quorum:tier:TIER_1');
  });

  it('TEST-PPS-06: Evaluates specialist requirement alignment', async () => {
    // Reviewer specialty is ENDODONTICS, matches procedure primarySpecialty
    const result = await service.runPreflight({ revisionId: 'rev-preflight-01' });
    expect(result.specialistMatch.matched).toBe(true);
    expect(result.specialistMatch.specialistReviewerId).toBe('usr-rev-01');
  });

  it('TEST-PPS-07: Blocks preflight when cover or 3D media assets are unverified', async () => {
    mockPrisma.procedureRevision.findUnique.mockResolvedValueOnce({
      ...validRevision,
      coverMedia: {
        id: 'media-unverified-01',
        validationStatus: 'PENDING_INSPECTION',
      },
    });

    const result = await service.runPreflight({ revisionId: 'rev-preflight-01' });
    expect(result.passed).toBe(false);
    expect(result.blockingReasons).toContain('MEDIA_ASSET_UNVERIFIED');
    expect(result.mediaVerification.allAssetsValid).toBe(false);
  });

  it('TEST-PPS-08: Strictly read-only guarantee: preflight executes zero database writes and zero audit logs', async () => {
    await service.runPreflight({ revisionId: 'rev-preflight-01' });
    expect(mockPrisma.adminAuditLog.create).not.toHaveBeenCalled();
    expect(mockPrisma.procedureApproval.update).not.toHaveBeenCalled();
    expect(mockPrisma.procedureApproval.create).not.toHaveBeenCalled();
  });
});
