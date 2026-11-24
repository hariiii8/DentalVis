// packages/database/test/prismaCoiRepository.test.ts
// DentalVis — Unit Tests for PrismaCoiRepository (M6.1.5-A)
// Architecture Baseline v1.9.1 (FROZEN)

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock server-only for node test runner
vi.mock('server-only', () => ({}));

import { PrismaCoiRepository } from '../src/governance/prismaCoiRepository';
import type { PrismaClient } from '@prisma/client';

describe('PrismaCoiRepository (M6.1.5-A Unit Tests)', () => {
  let mockPrisma: any;
  let repository: PrismaCoiRepository;

  const mockDate = new Date('2026-11-24T12:00:00Z');

  beforeEach(() => {
    mockPrisma = {
      $queryRaw: vi.fn().mockResolvedValue([{ 1: 1 }]),
      conflictOfInterestDeclaration: {
        findFirst: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
      },
    };

    repository = new PrismaCoiRepository({
      prisma: mockPrisma as unknown as PrismaClient,
    });
  });

  it('TEST-COI-01: Verifies persistence health check', async () => {
    const isHealthy = await repository.isPersistenceHealthy();
    expect(isHealthy).toBe(true);
    expect(mockPrisma.$queryRaw).toHaveBeenCalled();
  });

  it('TEST-COI-02: Returns null when user ID is missing or empty', async () => {
    const result = await repository.getActiveDeclaration('');
    expect(result).toBeNull();
    expect(mockPrisma.conflictOfInterestDeclaration.findFirst).not.toHaveBeenCalled();
  });

  it('TEST-COI-03: Resolves revision-specific declaration with priority over procedure and user-wide', async () => {
    const revDecl = {
      id: 'coi-rev-1',
      userId: 'user-1',
      targetProcedureId: 'proc-1',
      targetRevisionId: 'rev-1',
      status: 'VERIFIED_CLEAR',
      hasFinancialInterest: false,
      hasInstitutionalAffiliation: false,
      hasAuthorRelationship: false,
      hasCommercialSponsorship: false,
      isRecused: false,
      declaredAt: mockDate,
      expiresAt: new Date(mockDate.getTime() + 86400000 * 30),
    };

    mockPrisma.conflictOfInterestDeclaration.findFirst.mockResolvedValueOnce(revDecl);

    const result = await repository.getActiveDeclaration('user-1', {
      procedureId: 'proc-1',
      revisionId: 'rev-1',
    }, mockDate);

    expect(result).not.toBeNull();
    expect(result?.id).toBe('coi-rev-1');
    expect(result?.targetRevisionId).toBe('rev-1');
    expect(mockPrisma.conflictOfInterestDeclaration.findFirst).toHaveBeenCalledTimes(1);
  });

  it('TEST-COI-04: Falls back to procedure-specific declaration when revision-specific is absent', async () => {
    const procDecl = {
      id: 'coi-proc-1',
      userId: 'user-1',
      targetProcedureId: 'proc-1',
      targetRevisionId: null,
      status: 'VERIFIED_CLEAR',
      hasFinancialInterest: false,
      hasInstitutionalAffiliation: false,
      hasAuthorRelationship: false,
      hasCommercialSponsorship: false,
      isRecused: false,
      declaredAt: mockDate,
      expiresAt: new Date(mockDate.getTime() + 86400000 * 30),
    };

    // First call (revision-specific) returns null, second call (procedure-specific) returns procDecl
    mockPrisma.conflictOfInterestDeclaration.findFirst
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(procDecl);

    const result = await repository.getActiveDeclaration('user-1', {
      procedureId: 'proc-1',
      revisionId: 'rev-1',
    }, mockDate);

    expect(result).not.toBeNull();
    expect(result?.id).toBe('coi-proc-1');
    expect(result?.targetProcedureId).toBe('proc-1');
    expect(result?.targetRevisionId).toBeNull();
  });

  it('TEST-COI-05: Dynamically computes EXPIRED status when expiration date has passed', async () => {
    const expiredDecl = {
      id: 'coi-user-1',
      userId: 'user-1',
      targetProcedureId: null,
      targetRevisionId: null,
      status: 'VERIFIED_CLEAR',
      hasFinancialInterest: false,
      hasInstitutionalAffiliation: false,
      hasAuthorRelationship: false,
      hasCommercialSponsorship: false,
      isRecused: false,
      declaredAt: new Date('2025-01-01T00:00:00Z'),
      expiresAt: new Date('2025-12-31T23:59:59Z'), // In the past relative to mockDate (Nov 2026)
    };

    mockPrisma.conflictOfInterestDeclaration.findFirst.mockResolvedValueOnce(expiredDecl);

    const result = await repository.getActiveDeclaration('user-1', undefined, mockDate);
    expect(result).not.toBeNull();
    expect(result?.status).toBe('EXPIRED');
  });

  it('TEST-COI-06: Automatically sets status to CONFLICT_DECLARED and isRecused to true when financial interest disclosed', async () => {
    mockPrisma.conflictOfInterestDeclaration.create.mockImplementation(async ({ data }) => ({
      id: 'coi-new-1',
      ...data,
      declaredAt: mockDate,
    }));

    const result = await repository.createDeclaration({
      userId: 'user-1',
      hasFinancialInterest: true,
      hasInstitutionalAffiliation: false,
      hasAuthorRelationship: false,
      hasCommercialSponsorship: false,
      conflictDetails: 'Owns shares in dental implant manufacturer',
      expiresAt: new Date(mockDate.getTime() + 86400000 * 365),
    });

    expect(result.status).toBe('CONFLICT_DECLARED');
    expect(result.isRecused).toBe(true);
  });

  it('TEST-COI-07: Strictly rejects self-clearance when declarant attempts to assess their own declaration', async () => {
    mockPrisma.conflictOfInterestDeclaration.findUnique.mockResolvedValueOnce({
      id: 'coi-target-1',
      userId: 'user-reviewer-99',
    });

    await expect(
      repository.assessDeclaration({
        declarationId: 'coi-target-1',
        assessorAdminId: 'user-reviewer-99', // Same as declarant!
        outcome: 'VERIFIED_CLEAR',
      })
    ).rejects.toThrow('SECURITY VIOLATION: Reviewer cannot assess or clear their own conflict of interest declaration.');
  });
});
