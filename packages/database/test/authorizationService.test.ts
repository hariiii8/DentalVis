// packages/database/test/authorizationService.test.ts
// DentalVis 2.0 — Server-Side Governance Authorization Service Comprehensive Test Suite
// Architecture Baseline v1.9.1 (FROZEN) — Milestone M6.1.3

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock server-only for node test runner
vi.mock('server-only', () => ({}));

import {
  GovernanceAuthorizationService,
  ROLE_PERMISSION_MATRIX,
  validateAuthoritativeSession,
} from '../src/governance';
import type {
  AuthorizationActor,
  AuthorizationRequest,
} from '../src/governance/types';
import type {
  ReviewerCredentialState,
  JurisdictionalContext,
} from '@dentalvis/common';
import type { PrismaClient } from '@prisma/client';

describe('Phase M6.1.3 — Server-Side Governance Authorization Service Tests', () => {
  let authService: GovernanceAuthorizationService;
  const mockNow = new Date('2026-11-24T12:00:00.000Z');

  // Baseline verified credentials
  const validReviewerCredentials: ReviewerCredentialState = {
    reviewerUserId: 'user-reviewer-01',
    primaryLicenseNumber: 'DENT-12345',
    licensingAuthority: 'US_STATE_DENTAL_BOARD',
    jurisdiction: { country: 'US', subdivision: 'CA' },
    degree: 'DDS',
    specialty: 'GENERAL_DENTISTRY',
    verificationStatus: 'VERIFIED_ACTIVE',
    verifiedAt: '2026-11-20T10:00:00.000Z',
    expiresAt: '2027-11-20T10:00:00.000Z',
    verifiedByUserId: 'user-admin-01',
    proceduralPermits: [],
    disciplinarySanctionsActive: false,
  };

  beforeEach(() => {
    authService = new GovernanceAuthorizationService();
  });

  // ====================================================================
  // 1. IDENTITY & AUTHORITATIVE SESSION TESTS
  // ====================================================================
  describe('Identity & Authoritative Session State Evaluation', () => {
    it('TEST-AUTHZ-01: ALLOWs operation when active session and permission scope match', async () => {
      const actor: AuthorizationActor = {
        userId: 'admin-user-1',
        applicationRole: 'SYSTEM_ADMIN',
        crbRole: 'GOVERNANCE_ADMIN',
        sessionId: 'session-1',
        sessionFamilyId: 'family-1',
      };

      const result = await authService.authorize({
        actor,
        requestedScope: 'crb:credential:verify',
      });

      expect(result.decision).toBe('ALLOW');
      expect(result.actorUserId).toBe(actor.userId);
      expect(result.requestedScope).toBe('crb:credential:verify');
    });

    it('TEST-AUTHZ-02: DENYs unauthenticated request when neither actor nor tokenHash provided', async () => {
      const result = await authService.authorize({
        requestedScope: 'crb:dossier:read',
      });

      expect(result.decision).toBe('DENY');
      expect(result.denialReason).toBe('UNAUTHENTICATED');
    });

    it('TEST-AUTHZ-02b: DENYs unauthenticated request when tokenHash yields no session', async () => {
      const mockPrisma = {
        userSession: {
          findUnique: vi.fn().mockResolvedValue(null),
        },
      } as unknown as PrismaClient;

      const service = new GovernanceAuthorizationService({ prisma: mockPrisma });
      const result = await service.authorize({
        sessionTokenHash: 'invalid-token-hash',
        requestedScope: 'crb:dossier:read',
      });

      expect(result.decision).toBe('DENY');
      expect(result.denialReason).toBe('UNAUTHENTICATED');
    });

    it('TEST-AUTHZ-03: DENYs expired session', async () => {
      const mockPrisma = {
        userSession: {
          findUnique: vi.fn().mockResolvedValue({
            id: 'session-expired',
            status: 'ACTIVE',
            expiresAt: new Date('2026-11-20T00:00:00.000Z'), // expired
            sessionFamily: { status: 'ACTIVE' },
            user: { id: 'u1', role: 'SYSTEM_ADMIN', isActive: true, deactivatedAt: null },
          }),
        },
      } as unknown as PrismaClient;

      const service = new GovernanceAuthorizationService({ prisma: mockPrisma });
      const result = await service.authorize(
        {
          sessionTokenHash: 'expired-token-hash',
          requestedScope: 'crb:credential:verify',
        },
        mockNow
      );

      expect(result.decision).toBe('DENY');
      expect(result.denialReason).toBe('SESSION_EXPIRED');
    });

    it('TEST-AUTHZ-04: DENYs revoked session (REVOKED_MANUAL or REVOKED_REPLAY_ATTACK)', async () => {
      const mockPrisma = {
        userSession: {
          findUnique: vi.fn().mockResolvedValue({
            id: 'session-revoked',
            status: 'REVOKED_MANUAL',
            expiresAt: new Date('2027-01-01T00:00:00.000Z'),
            sessionFamily: { status: 'ACTIVE' },
            user: { id: 'u1', role: 'SYSTEM_ADMIN', isActive: true, deactivatedAt: null },
          }),
        },
      } as unknown as PrismaClient;

      const service = new GovernanceAuthorizationService({ prisma: mockPrisma });
      const result = await service.authorize({
        sessionTokenHash: 'revoked-token-hash',
        requestedScope: 'crb:credential:verify',
      });

      expect(result.decision).toBe('DENY');
      expect(result.denialReason).toBe('SESSION_REVOKED');
    });

    it('TEST-AUTHZ-05: DENYs superseded session (replayed rotated token)', async () => {
      const mockPrisma = {
        userSession: {
          findUnique: vi.fn().mockResolvedValue({
            id: 'session-superseded',
            status: 'SUPERSEDED',
            expiresAt: new Date('2027-01-01T00:00:00.000Z'),
            sessionFamily: { status: 'ACTIVE' },
            user: { id: 'u1', role: 'SYSTEM_ADMIN', isActive: true, deactivatedAt: null },
          }),
        },
      } as unknown as PrismaClient;

      const service = new GovernanceAuthorizationService({ prisma: mockPrisma });
      const result = await service.authorize({
        sessionTokenHash: 'superseded-token-hash',
        requestedScope: 'crb:credential:verify',
      });

      expect(result.decision).toBe('DENY');
      expect(result.denialReason).toBe('SESSION_SUPERSEDED');
    });

    it('TEST-AUTHZ-06: DENYs session when SessionFamily is revoked or missing', async () => {
      const mockPrisma = {
        userSession: {
          findUnique: vi.fn().mockResolvedValue({
            id: 'session-with-revoked-family',
            status: 'ACTIVE',
            expiresAt: new Date('2027-01-01T00:00:00.000Z'),
            sessionFamily: { status: 'REVOKED' },
            user: { id: 'u1', role: 'SYSTEM_ADMIN', isActive: true, deactivatedAt: null },
          }),
        },
      } as unknown as PrismaClient;

      const service = new GovernanceAuthorizationService({ prisma: mockPrisma });
      const result = await service.authorize({
        sessionTokenHash: 'family-revoked-token-hash',
        requestedScope: 'crb:credential:verify',
      });

      expect(result.decision).toBe('DENY');
      expect(result.denialReason).toBe('SESSION_FAMILY_REVOKED');
    });

    it('TEST-AUTHZ-07: DENYs when User account is deactivated or marked inactive', async () => {
      const mockPrisma = {
        userSession: {
          findUnique: vi.fn().mockResolvedValue({
            id: 'session-deactivated-user',
            status: 'ACTIVE',
            expiresAt: new Date('2027-01-01T00:00:00.000Z'),
            sessionFamily: { status: 'ACTIVE' },
            user: { id: 'u1', role: 'SYSTEM_ADMIN', isActive: false, deactivatedAt: new Date() },
          }),
        },
      } as unknown as PrismaClient;

      const service = new GovernanceAuthorizationService({ prisma: mockPrisma });
      const result = await service.authorize({
        sessionTokenHash: 'deactivated-user-token-hash',
        requestedScope: 'crb:credential:verify',
      });

      expect(result.decision).toBe('DENY');
      expect(result.denialReason).toBe('USER_DEACTIVATED');
    });

    it('TEST-AUTHZ-25: fails closed (DENY: INTERNAL_SECURITY_ERROR) on database query error', async () => {
      const mockPrisma = {
        userSession: {
          findUnique: vi.fn().mockRejectedValue(new Error('Connection reset by peer')),
        },
      } as unknown as PrismaClient;

      const service = new GovernanceAuthorizationService({ prisma: mockPrisma });
      const result = await service.authorize({
        sessionTokenHash: 'failing-query-token-hash',
        requestedScope: 'crb:credential:verify',
      });

      expect(result.decision).toBe('DENY');
      expect(result.denialReason).toBe('INTERNAL_SECURITY_ERROR');
    });
  });

  // ====================================================================
  // 2. AUTHORITY SEPARATION & SCOPE ISOLATION TESTS
  // ====================================================================
  describe('Authority Separation & Role Boundaries', () => {
    const createActor = (crbRole: AuthorizationActor['crbRole']): AuthorizationActor => ({
      userId: `user-${crbRole.toLowerCase()}`,
      applicationRole: 'CLINICAL_REVIEWER',
      crbRole,
      sessionId: 'session-1',
      sessionFamilyId: 'family-1',
    });

    it('TEST-AUTHZ-08: ALLOWs Independent Auditor read-only scopes', async () => {
      const auditor = createActor('INDEPENDENT_AUDITOR');

      const r1 = await authService.authorize({ actor: auditor, requestedScope: 'crb:dossier:read' });
      expect(r1.decision).toBe('ALLOW');

      const r2 = await authService.authorize({ actor: auditor, requestedScope: 'crb:policy:read' });
      expect(r2.decision).toBe('ALLOW');

      const r3 = await authService.authorize({ actor: auditor, requestedScope: 'crb:audit:read' });
      expect(r3.decision).toBe('ALLOW');
    });

    it('TEST-AUTHZ-09: DENYs Independent Auditor from submitting clinical reviews', async () => {
      const auditor = createActor('INDEPENDENT_AUDITOR');
      const result = await authService.authorize({
        actor: auditor,
        requestedScope: 'crb:review:submit',
      });

      expect(result.decision).toBe('DENY');
      expect(result.denialReason).toBe('SCOPE_NOT_GRANTED');
    });

    it('TEST-AUTHZ-10: DENYs Independent Auditor from authorizing publication', async () => {
      const auditor = createActor('INDEPENDENT_AUDITOR');
      const result = await authService.authorize({
        actor: auditor,
        requestedScope: 'crb:publish:authorize',
      });

      expect(result.decision).toBe('DENY');
      expect(result.denialReason).toBe('SCOPE_NOT_GRANTED');
    });

    it('TEST-AUTHZ-11: DENYs Independent Auditor from revoking approvals or verifying credentials', async () => {
      const auditor = createActor('INDEPENDENT_AUDITOR');

      const r1 = await authService.authorize({ actor: auditor, requestedScope: 'crb:approval:revoke' });
      expect(r1.decision).toBe('DENY');
      expect(r1.denialReason).toBe('SCOPE_NOT_GRANTED');

      const r2 = await authService.authorize({ actor: auditor, requestedScope: 'crb:credential:verify' });
      expect(r2.decision).toBe('DENY');
      expect(r2.denialReason).toBe('SCOPE_NOT_GRANTED');
    });

    it('TEST-AUTHZ-12 & 13: CRB Chair can assign reviews and revoke approvals, but CANNOT publish', async () => {
      const chair = createActor('CRB_CHAIR');

      const r1 = await authService.authorize({ actor: chair, requestedScope: 'crb:review:assign' });
      expect(r1.decision).toBe('ALLOW');

      const r2 = await authService.authorize({ actor: chair, requestedScope: 'crb:approval:revoke' });
      expect(r2.decision).toBe('ALLOW');

      const r3 = await authService.authorize({ actor: chair, requestedScope: 'crb:publish:authorize' });
      expect(r3.decision).toBe('DENY');
      expect(r3.denialReason).toBe('SCOPE_NOT_GRANTED');
    });

    it('TEST-AUTHZ-14, 15, 16: Publication Admin can authorize publication, but CANNOT submit reviews or revoke', async () => {
      const pubAdmin = createActor('PUBLICATION_ADMIN');

      const r1 = await authService.authorize({ actor: pubAdmin, requestedScope: 'crb:publish:authorize' });
      expect(r1.decision).toBe('ALLOW');

      const r2 = await authService.authorize({ actor: pubAdmin, requestedScope: 'crb:review:submit' });
      expect(r2.decision).toBe('DENY');
      expect(r2.denialReason).toBe('SCOPE_NOT_GRANTED');

      const r3 = await authService.authorize({ actor: pubAdmin, requestedScope: 'crb:approval:revoke' });
      expect(r3.decision).toBe('DENY');
      expect(r3.denialReason).toBe('SCOPE_NOT_GRANTED');
    });

    it('TEST-AUTHZ-17: DENYs Content Author from reviewing own procedure revision', async () => {
      const author = createActor('CLINICAL_REVIEWER'); // Reviewer role
      const result = await authService.authorize({
        actor: author,
        targetAuthorId: author.userId, // author is actor!
        requestedScope: 'crb:review:submit',
        reviewerCredentials: validReviewerCredentials,
      });

      expect(result.decision).toBe('DENY');
      expect(result.denialReason).toBe('AUTHOR_SELF_APPROVAL_PROHIBITED');
    });

    it('TEST-AUTHZ-18: ALLOWs Content Author to draft own procedure', async () => {
      const author = createActor('CONTENT_AUTHOR');
      const result = await authService.authorize({
        actor: author,
        requestedScope: 'crb:dossier:draft',
      });

      expect(result.decision).toBe('ALLOW');
    });
  });

  // ====================================================================
  // 3. CLINICAL ELIGIBILITY & NON-UNIVERSAL EVALUATION TESTS
  // ====================================================================
  describe('Clinical Eligibility & Non-Universal Hardcoding Safeguards', () => {
    const reviewerActor: AuthorizationActor = {
      userId: 'user-reviewer-01',
      applicationRole: 'CLINICAL_REVIEWER',
      crbRole: 'CLINICAL_REVIEWER',
      sessionId: 'sess-1',
      sessionFamilyId: 'fam-1',
    };

    it('TEST-AUTHZ-19: returns REQUIRES_VERIFICATION when reviewer credential verification is unverified', async () => {
      const unverifiedCreds: ReviewerCredentialState = {
        ...validReviewerCredentials,
        verificationStatus: 'UNVERIFIED',
      };

      const result = await authService.authorize({
        actor: reviewerActor,
        targetAuthorId: 'other-author-id',
        requestedScope: 'crb:review:submit',
        reviewerCredentials: unverifiedCreds,
      });

      expect(result.decision).toBe('REQUIRES_VERIFICATION');
      expect(result.denialReason).toBe('CREDENTIAL_VERIFICATION_REQUIRED');
    });

    it('TEST-AUTHZ-19b: returns REQUIRES_VERIFICATION when reviewer credential record is completely missing', async () => {
      const result = await authService.authorize({
        actor: reviewerActor,
        targetAuthorId: 'other-author-id',
        requestedScope: 'crb:review:submit',
      });

      expect(result.decision).toBe('REQUIRES_VERIFICATION');
      expect(result.denialReason).toBe('CREDENTIAL_VERIFICATION_REQUIRED');
    });

    it('TEST-AUTHZ-19c: DENYs when reviewer credential status is EXPIRED or SANCTIONED', async () => {
      const expiredCreds: ReviewerCredentialState = {
        ...validReviewerCredentials,
        verificationStatus: 'EXPIRED',
      };

      const result = await authService.authorize({
        actor: reviewerActor,
        targetAuthorId: 'other-author-id',
        requestedScope: 'crb:review:submit',
        reviewerCredentials: expiredCreds,
      });

      expect(result.decision).toBe('DENY');
      expect(result.denialReason).toBe('CLINICALLY_INELIGIBLE');
    });

    it('TEST-AUTHZ-20: DENYs when procedure requires statutory specialty and reviewer specialty mismatches', async () => {
      // General dentist attempting to review Tier 3 procedure requiring OMFS
      const result = await authService.authorize({
        actor: reviewerActor,
        targetAuthorId: 'other-author-id',
        requestedScope: 'crb:review:submit',
        procedureTier: 'TIER_3',
        procedureSpecialtyRequirement: 'ORAL_AND_MAXILLOFACIAL_SURGERY',
        reviewerCredentials: validReviewerCredentials, // General dentistry
      });

      expect(result.decision).toBe('DENY');
      expect(result.denialReason).toBe('SPECIALTY_MISMATCH');
    });

    it('TEST-AUTHZ-21: ALLOWs when reviewer has verified statutory specialty matching procedure requirement', async () => {
      const specialistCreds: ReviewerCredentialState = {
        ...validReviewerCredentials,
        specialty: 'ORAL_AND_MAXILLOFACIAL_SURGERY',
      };

      const specialistActor: AuthorizationActor = {
        ...reviewerActor,
        crbRole: 'SPECIALIST_REVIEWER',
      };

      const result = await authService.authorize({
        actor: specialistActor,
        targetAuthorId: 'other-author-id',
        requestedScope: 'crb:review:submit',
        procedureTier: 'TIER_3',
        procedureSpecialtyRequirement: 'ORAL_AND_MAXILLOFACIAL_SURGERY',
        reviewerCredentials: specialistCreds,
      });

      expect(result.decision).toBe('ALLOW');
    });

    it('TEST-AUTHZ-22: DENYs sedation review when clinician lacks legally mandated procedural permit', async () => {
      const context: JurisdictionalContext = { country: 'US', subdivision: 'CA' };

      const result = await authService.authorize({
        actor: reviewerActor,
        targetAuthorId: 'other-author-id',
        targetProcedureId: 'procedure-48-oral-sedation',
        procedureTier: 'TIER_2',
        jurisdiction: context,
        requestedScope: 'crb:review:submit',
        reviewerCredentials: validReviewerCredentials, // lacks permits
      });

      expect(result.decision).toBe('DENY');
      expect(result.denialReason).toBe('PROCEDURAL_PERMIT_REQUIRED');
    });

    it('TEST-AUTHZ-22b: ALLOWs sedation review when clinician possesses verified procedural permit', async () => {
      const context: JurisdictionalContext = { country: 'US', subdivision: 'CA' };
      const permittedCreds: ReviewerCredentialState = {
        ...validReviewerCredentials,
        proceduralPermits: ['ENTERAL_SEDATION_PERMIT'],
      };

      const result = await authService.authorize({
        actor: reviewerActor,
        targetAuthorId: 'other-author-id',
        targetProcedureId: 'procedure-48-oral-sedation',
        procedureTier: 'TIER_2',
        jurisdiction: context,
        requestedScope: 'crb:review:submit',
        reviewerCredentials: permittedCreds,
      });

      expect(result.decision).toBe('ALLOW');
    });

    it('TEST-AUTHZ-23: DENYs sedation review when jurisdictional context is missing', async () => {
      const result = await authService.authorize({
        actor: reviewerActor,
        targetAuthorId: 'other-author-id',
        targetProcedureId: 'procedure-48-oral-sedation',
        procedureTier: 'TIER_2',
        // jurisdiction intentionally omitted
        requestedScope: 'crb:review:submit',
        reviewerCredentials: validReviewerCredentials,
      });

      expect(result.decision).toBe('DENY');
      expect(result.denialReason).toBe('MISSING_JURISDICTION_CONTEXT');
    });

    it('TEST-AUTHZ-26: does not require inapplicable credentials or permits universally for routine procedures', async () => {
      // Routine Tier 1 procedure does not require sedation permits or surgical specialty
      const result = await authService.authorize({
        actor: reviewerActor,
        targetAuthorId: 'other-author-id',
        targetProcedureId: 'procedure-01-routine-clean',
        procedureTier: 'TIER_1',
        requestedScope: 'crb:review:submit',
        reviewerCredentials: validReviewerCredentials, // Standard general dentistry, 0 permits
      });

      expect(result.decision).toBe('ALLOW');
    });
  });

  // ====================================================================
  // 4. DECISION CONTRACT & NON-AUTHORIZING NATURE OF REQUIRES_VERIFICATION
  // ====================================================================
  describe('Decision Contract Invariants', () => {
    it('TEST-AUTHZ-27: confirms REQUIRES_VERIFICATION is strictly non-authorizing', async () => {
      const actor: AuthorizationActor = {
        userId: 'u1',
        applicationRole: 'CLINICAL_REVIEWER',
        crbRole: 'CLINICAL_REVIEWER',
        sessionId: 's1',
        sessionFamilyId: 'f1',
      };

      const result = await authService.authorize({
        actor,
        targetAuthorId: 'author-2',
        requestedScope: 'crb:review:submit',
        // Omitting credentials intentionally triggers REQUIRES_VERIFICATION
      });

      expect(result.decision).toBe('REQUIRES_VERIFICATION');
      expect(result.decision !== 'ALLOW').toBe(true);

      // Verify simulated downstream gate blocks execution
      const canProceed = result.decision === 'ALLOW';
      expect(canProceed).toBe(false);
    });
  });
});
