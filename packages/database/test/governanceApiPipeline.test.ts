// packages/database/test/governanceApiPipeline.test.ts
// DentalVis — Server-Side Governance API Pipeline Unit & Security Tests (M6.1.5-C)
// Architecture Baseline v1.9.1 (FROZEN) — Milestone M6.1.5-C

import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';

// Mock server-only for node test runner
vi.mock('server-only', () => ({}));

import { PrismaClient } from '@prisma/client';
import {
  guardGovernanceApi,
  createGovernanceErrorResponse,
  createGovernanceSuccessResponse,
} from '../src/governance';

describe('Phase M6.1.5-C — Server-Side Governance API Pipeline Guard Tests', () => {
  let prisma: PrismaClient;
  let adminUserId: string;
  let adminTokenHash: string;
  let reviewerUserId: string;
  let reviewerTokenHash: string;
  let authorUserId: string;
  let authorTokenHash: string;

  let testProcedureId: string;
  let testRevisionId: string;
  let testAuthorId: string;

  beforeAll(async () => {
    prisma = new PrismaClient();
    await prisma.$connect();

    const timestamp = Date.now();

    // 1. Create Admin User (CHIEF_EDITOR maps to CRB_CHAIR which has crb:review:assign)
    const adminUser = await prisma.user.create({
      data: {
        email: `admin-guard-${timestamp}@dentalvis.test`,
        passwordHash: 'dummy-hash',
        fullName: 'Dr. Admin Guard Test',
        role: 'CHIEF_EDITOR',
      },
    });
    adminUserId = adminUser.id;

    const adminFamily = await prisma.sessionFamily.create({
      data: { userId: adminUserId, status: 'ACTIVE' },
    });

    adminTokenHash = `admin-guard-token-${timestamp}`;
    await prisma.userSession.create({
      data: {
        userId: adminUserId,
        sessionFamilyId: adminFamily.id,
        tokenHash: adminTokenHash,
        status: 'ACTIVE',
        expiresAt: new Date(Date.now() + 86400000),
      },
    });

    // 2. Create Reviewer User & Session
    const reviewerUser = await prisma.user.create({
      data: {
        email: `reviewer-guard-${timestamp}@dentalvis.test`,
        passwordHash: 'dummy-hash',
        fullName: 'Dr. Reviewer Guard Test',
        role: 'CLINICAL_REVIEWER',
        licenseNumber: 'LIC-GUARD-REVIEWER-1',
        clinicalSpecialty: 'PERIODONTICS',
      },
    });
    reviewerUserId = reviewerUser.id;

    const reviewerFamily = await prisma.sessionFamily.create({
      data: { userId: reviewerUserId, status: 'ACTIVE' },
    });

    reviewerTokenHash = `reviewer-guard-token-${timestamp}`;
    await prisma.userSession.create({
      data: {
        userId: reviewerUserId,
        sessionFamilyId: reviewerFamily.id,
        tokenHash: reviewerTokenHash,
        status: 'ACTIVE',
        expiresAt: new Date(Date.now() + 86400000),
      },
    });

    // 3. Create Author User & Session
    const authorUser = await prisma.user.create({
      data: {
        email: `author-guard-${timestamp}@dentalvis.test`,
        passwordHash: 'dummy-hash',
        fullName: 'Dr. Author Guard Test',
        role: 'CLINICAL_AUTHOR',
      },
    });
    authorUserId = authorUser.id;

    const authorFamily = await prisma.sessionFamily.create({
      data: { userId: authorUserId, status: 'ACTIVE' },
    });

    authorTokenHash = `author-guard-token-${timestamp}`;
    await prisma.userSession.create({
      data: {
        userId: authorUserId,
        sessionFamilyId: authorFamily.id,
        tokenHash: authorTokenHash,
        status: 'ACTIVE',
        expiresAt: new Date(Date.now() + 86400000),
      },
    });

    // 4. Query existing procedure & revision (strictly append-only / immutable table)
    const existingRev = await prisma.procedureRevision.findFirst({
      include: { translation: true },
    });

    if (existingRev) {
      testProcedureId = existingRev.procedureId;
      testRevisionId = existingRev.id;
      testAuthorId = existingRev.authorId;
    } else {
      testProcedureId = '00000000-0000-0000-0000-000000000001';
      testRevisionId = '00000000-0000-0000-0000-000000000002';
      testAuthorId = authorUserId;
    }
  }, 30000);

  afterAll(async () => {
    // Clean up test sessions and users only (never touch append-only ProcedureRevision)
    const userIds = [adminUserId, reviewerUserId, authorUserId].filter(Boolean);
    if (userIds.length > 0) {
      await prisma.userSession.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.sessionFamily.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
    await prisma.$disconnect();
  });

  // ====================================================================
  // 1. AUTHENTICATION & IDENTITY TESTS
  // ====================================================================
  it('TEST-PIPELINE-01: Rejects missing session credential with 401 UNAUTHENTICATED', async () => {
    const res = await guardGovernanceApi({
      prisma,
      identityInput: {},
      requiredScope: 'crb:review:assign',
    });

    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.httpStatus).toBe(401);
      expect(res.errorCode).toBe('UNAUTHENTICATED');
      const formatted = createGovernanceErrorResponse(res);
      expect(formatted.status).toBe(401);
      expect(formatted.body.error.code).toBe('UNAUTHENTICATED');
    }
  });

  it('TEST-PIPELINE-02: Rejects invalid or nonexistent session token with 401 UNAUTHENTICATED', async () => {
    const res = await guardGovernanceApi({
      prisma,
      identityInput: { sessionTokenHash: 'totally-invalid-hash' },
      requiredScope: 'crb:review:assign',
    });

    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.httpStatus).toBe(401);
      expect(res.errorCode).toBe('UNAUTHENTICATED');
    }
  });

  it('TEST-PIPELINE-03: Rejects asserted userId mismatch (Anti-Impersonation Check)', async () => {
    const res = await guardGovernanceApi({
      prisma,
      identityInput: {
        sessionTokenHash: reviewerTokenHash,
        untrustedAssertedUserId: adminUserId, // Reviewer attempting to impersonate Admin
      },
      requiredScope: 'crb:review:assign',
    });

    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.httpStatus).toBe(401);
      expect(res.errorCode).toBe('UNAUTHENTICATED');
      expect(res.message).toContain('Asserted user identity does not match');
    }
  });

  // ====================================================================
  // 2. AUTHORIZATION & SCOPE TESTS
  // ====================================================================
  it('TEST-PIPELINE-04: Rejects unauthorized role when actor lacks required scope (403 SCOPE_NOT_GRANTED)', async () => {
    // Reviewer attempting admin-only reviewer assignment scope
    const res = await guardGovernanceApi({
      prisma,
      identityInput: { sessionTokenHash: reviewerTokenHash },
      requiredScope: 'crb:review:assign',
    });

    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.httpStatus).toBe(403);
      expect(res.errorCode).toBe('SCOPE_NOT_GRANTED');
    }
  });

  it('TEST-PIPELINE-05: Rejects content author reviewing own procedure (Author Self-Approval Defense)', async () => {
    const res = await guardGovernanceApi({
      prisma,
      identityInput: { sessionTokenHash: authorTokenHash },
      requiredScope: 'crb:review:submit',
      targetProcedureId: testProcedureId,
      targetRevisionId: testRevisionId,
      targetAuthorId: authorUserId, // Asserting author is self
    });

    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.httpStatus).toBe(403);
      expect(['AUTHOR_SELF_APPROVAL_PROHIBITED', 'SCOPE_NOT_GRANTED']).toContain(res.errorCode);
    }
  });

  it('TEST-PIPELINE-06: Successfully allows authorized actor with required scope (200 ALLOW)', async () => {
    const res = await guardGovernanceApi({
      prisma,
      identityInput: { sessionTokenHash: adminTokenHash },
      requiredScope: 'crb:review:assign',
      targetRevisionId: testRevisionId,
    });

    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.context.actor.userId).toBe(adminUserId);
      expect(res.context.actor.applicationRole).toBe('CHIEF_EDITOR');
      expect(res.context.authorization.decision).toBe('ALLOW');

      const successResponse = createGovernanceSuccessResponse({ id: 'ok-test' }, 200);
      expect(successResponse.status).toBe(200);
      expect(successResponse.body.data.id).toBe('ok-test');
    }
  });
});
