// packages/database/test/governanceAuditService.test.ts
// DentalVis — Unit Tests for GovernanceAuditService (M6.1.4)
// Architecture Baseline v1.9.1 (FROZEN)

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock server-only for node test runner
vi.mock('server-only', () => ({}));

import {
  GovernanceAuditService,
  canonicalizeJson,
  computePayloadHash,
} from '../src/governance/governanceAuditService';
import type { PrismaClient } from '@prisma/client';

describe('GovernanceAuditService (M6.1.4 Unit Tests)', () => {
  let mockPrisma: any;
  let service: GovernanceAuditService;

  beforeEach(() => {
    mockPrisma = {
      adminAuditLog: {
        create: vi.fn().mockImplementation(async ({ data }) => ({
          id: 'mock-audit-uuid-001',
          ...data,
          createdAt: new Date(),
        })),
        findUnique: vi.fn(),
      },
    };

    service = new GovernanceAuditService({
      prisma: mockPrisma as unknown as PrismaClient,
    });
  });

  it('TEST-GAS-01: Deterministic RFC 8785 canonical JSON sorting', () => {
    const objA = { z: 1, a: 2, m: { b: 'hello', a: 'world' } };
    const objB = { a: 2, z: 1, m: { a: 'world', b: 'hello' } };

    const canonA = canonicalizeJson(objA);
    const canonB = canonicalizeJson(objB);

    expect(canonA).toBe(canonB);
    expect(canonA).toBe('{"a":2,"m":{"a":"world","b":"hello"},"z":1}');
  });

  it('TEST-GAS-02: Cryptographic payload hashing produces identical SHA-256 for identical content regardless of key ordering', () => {
    const payload1 = { reviewerId: 'u1', decision: 'APPROVED', revisionId: 'r1' };
    const payload2 = { revisionId: 'r1', reviewerId: 'u1', decision: 'APPROVED' };

    const hash1 = computePayloadHash(payload1);
    const hash2 = computePayloadHash(payload2);

    expect(hash1).toBe(hash2);
    expect(hash1).toHaveLength(64);
  });

  it('TEST-GAS-03: Successfully emits audit event with RFC 8785 hash and metadata wrapper', async () => {
    const input = {
      action: 'REVIEW_SUBMITTED',
      actorId: 'usr-doctor-01',
      targetType: 'ProcedureApproval',
      targetId: 'app-01',
      payload: { decision: 'APPROVED', revisionId: 'rev-01' },
      ipHash: 'ip-hash-abc',
      userAgent: 'DentalVis-TestAgent/1.0',
    };

    const result = await service.emitAuditEvent(input);
    expect(result.auditId).toBe('mock-audit-uuid-001');
    expect(result.payloadHash).toHaveLength(64);

    expect(mockPrisma.adminAuditLog.create).toHaveBeenCalledTimes(1);
    const createArg = mockPrisma.adminAuditLog.create.mock.calls[0][0];
    expect(createArg.data.userId).toBe('usr-doctor-01');
    expect(createArg.data.action).toBe('REVIEW_SUBMITTED');
    expect(createArg.data.metadata._governanceAudit.payloadHash).toBe(result.payloadHash);
    expect(createArg.data.metadata._governanceAudit.algorithm).toBe('RFC8785-SHA256');
  });

  it('TEST-GAS-04: Rejects audit event creation when required fields are missing', async () => {
    await expect(
      service.emitAuditEvent({
        action: '',
        actorId: 'usr-01',
        targetType: 'ProcedureRevision',
        targetId: 'rev-01',
        payload: {},
      })
    ).rejects.toThrow('action is required');

    await expect(
      service.emitAuditEvent({
        action: 'REVIEW_SUBMITTED',
        actorId: '',
        targetType: 'ProcedureRevision',
        targetId: 'rev-01',
        payload: {},
      })
    ).rejects.toThrow('actorId is required');
  });

  it('TEST-GAS-05: Verifies audit log cryptographic integrity successfully', async () => {
    const payload = { testKey: 'testVal', count: 42 };
    const calculatedHash = computePayloadHash(payload);

    mockPrisma.adminAuditLog.findUnique.mockResolvedValue({
      id: 'mock-audit-uuid-001',
      action: 'REVIEW_SUBMITTED',
      userId: 'usr-01',
      targetType: 'ProcedureRevision',
      targetId: 'rev-01',
      createdAt: new Date(),
      metadata: {
        ...payload,
        _governanceAudit: {
          payloadHash: calculatedHash,
        },
      },
    });

    const verifyResult = await service.verifyAuditIntegrity('mock-audit-uuid-001');
    expect(verifyResult.isIntegrityVerified).toBe(true);
    expect(verifyResult.payloadHash).toBe(calculatedHash);
  });

  it('TEST-GAS-06: Detects out-of-band payload tampering during audit integrity verification', async () => {
    const originalPayload = { testKey: 'originalValue' };
    const originalHash = computePayloadHash(originalPayload);

    // Simulated tampered payload in database
    mockPrisma.adminAuditLog.findUnique.mockResolvedValue({
      id: 'mock-audit-uuid-001',
      action: 'REVIEW_SUBMITTED',
      userId: 'usr-01',
      targetType: 'ProcedureRevision',
      targetId: 'rev-01',
      createdAt: new Date(),
      metadata: {
        testKey: 'TAMPERED_VALUE',
        _governanceAudit: {
          payloadHash: originalHash,
        },
      },
    });

    const verifyResult = await service.verifyAuditIntegrity('mock-audit-uuid-001');
    expect(verifyResult.isIntegrityVerified).toBe(false);
  });
});
