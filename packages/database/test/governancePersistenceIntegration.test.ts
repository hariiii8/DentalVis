// packages/database/test/governancePersistenceIntegration.test.ts
// DentalVis — Live PostgreSQL Integration Tests for M6.1.5-A Persistence
// Architecture Baseline v1.9.1 (FROZEN)

import { describe, it, expect, beforeAll, afterAll } from 'vitest';

// Mock server-only for node test runner
import { vi } from 'vitest';
vi.mock('server-only', () => ({}));

import { PrismaClient } from '@prisma/client';
import { PrismaCoiRepository } from '../src/governance/prismaCoiRepository';
import { PrismaAssignmentRepository } from '../src/governance/prismaAssignmentRepository';

describe('Phase M6.1.5-A — Live PostgreSQL Governance Persistence Integration', () => {
  let prisma: PrismaClient;
  let coiRepo: PrismaCoiRepository;
  let assignmentRepo: PrismaAssignmentRepository;

  let testAdminUserId: string;
  let testReviewerUserId: string;
  let testProcedureId: string;
  let testRevisionId: string;

  beforeAll(async () => {
    prisma = new PrismaClient();
    await prisma.$connect();

    coiRepo = new PrismaCoiRepository({ prisma });
    assignmentRepo = new PrismaAssignmentRepository({ prisma });

    // Find or create test users
    const adminUser = await prisma.user.upsert({
      where: { email: 'gov-admin-test@dentalvis.test' },
      update: { role: 'SYSTEM_ADMIN' },
      create: {
        email: 'gov-admin-test@dentalvis.test',
        passwordHash: 'dummy-hash',
        fullName: 'Dr. Gov Admin Test',
        role: 'SYSTEM_ADMIN',
      },
    });
    testAdminUserId = adminUser.id;

    const reviewerUser = await prisma.user.upsert({
      where: { email: 'gov-reviewer-test@dentalvis.test' },
      update: { role: 'CLINICAL_REVIEWER' },
      create: {
        email: 'gov-reviewer-test@dentalvis.test',
        passwordHash: 'dummy-hash',
        fullName: 'Dr. Clinical Reviewer Test',
        role: 'CLINICAL_REVIEWER',
        licenseNumber: 'DENT-TEST-9988',
        clinicalSpecialty: 'ENDODONTICS',
      },
    });
    testReviewerUserId = reviewerUser.id;

    // Find existing procedure & revision or create test revision
    const existingRev = await prisma.procedureRevision.findFirst({
      include: { translation: true },
    });

    if (existingRev) {
      testProcedureId = existingRev.procedureId;
      testRevisionId = existingRev.id;
    } else {
      // Create minimal procedure & revision
      const proc = await prisma.procedure.create({
        data: {
          slug: 'test-endo-proc-' + Date.now(),
          code: 'TEST-ENDO-' + Date.now(),
        },
      });
      testProcedureId = proc.id;

      const trans = await prisma.procedureTranslation.create({
        data: {
          procedureId: proc.id,
          language: 'en',
          currentStatus: 'DRAFT',
        },
      });

      const rev = await prisma.procedureRevision.create({
        data: {
          procedureId: proc.id,
          language: 'en',
          revisionNumber: 1,
          title: 'Test Root Canal',
          slug: 'test-root-canal-' + Date.now(),
          summary: 'Summary',
          overviewHtml: '<p>Overview</p>',
          snapshotData: { title: 'Test' },
          contentHash: '0000000000000000000000000000000000000000000000000000000000000000',
          authorId: testAdminUserId,
        },
      });
      testRevisionId = rev.id;
    }
  });

  afterAll(async () => {
    // Clean up test assignments and declarations created during test run
    await prisma.reviewerAssignment.deleteMany({
      where: { reviewerId: testReviewerUserId },
    });
    await prisma.conflictOfInterestDeclaration.deleteMany({
      where: { userId: testReviewerUserId },
    });
    await prisma.$disconnect();
  });

  // ====================================================================
  // 1. CRITICAL ACTIVE-ASSIGNMENT UNIQUENESS & PARTIAL UNIQUE INDEX TESTS
  // ====================================================================

  it('TEST-PG-INT-01: Successfully inserts active assignment in ASSIGNED status', async () => {
    const expiresAt = new Date(Date.now() + 86400000 * 7);
    const assignment = await assignmentRepo.createAssignment({
      revisionId: testRevisionId,
      reviewerId: testReviewerUserId,
      assignedByAdminId: testAdminUserId,
      expiresAt,
    });

    expect(assignment.id).toBeDefined();
    expect(assignment.status).toBe('ASSIGNED');
    expect(assignment.revisionId).toBe(testRevisionId);
    expect(assignment.reviewerId).toBe(testReviewerUserId);
  });

  it('TEST-PG-INT-02: Strictly rejects second ASSIGNED assignment for same revision and reviewer (Database-Enforced Partial Index)', async () => {
    const expiresAt = new Date(Date.now() + 86400000 * 7);

    // Attempting to create duplicate active assignment must trigger PostgreSQL unique constraint violation
    await expect(
      assignmentRepo.createAssignment({
        revisionId: testRevisionId,
        reviewerId: testReviewerUserId,
        assignedByAdminId: testAdminUserId,
        expiresAt,
      })
    ).rejects.toThrow(); // Prisma P2002 Unique constraint failed on idx_unique_active_reviewer_assignment
  });

  it('TEST-PG-INT-03: Strictly rejects concurrent active assignment across different active statuses (ASSIGNED vs ACCEPTED)', async () => {
    // 1. Accept the current assignment
    const current = await prisma.reviewerAssignment.findFirst({
      where: {
        revisionId: testRevisionId,
        reviewerId: testReviewerUserId,
        status: 'ASSIGNED',
      },
    });
    expect(current).not.toBeNull();

    await assignmentRepo.acceptAssignment(current!.id, testReviewerUserId);

    // Verify it is now ACCEPTED
    const accepted = await assignmentRepo.getAssignment(current!.id);
    expect(accepted?.status).toBe('ACCEPTED');

    // 2. Attempt to create another ASSIGNED assignment while ACCEPTED is active
    // Must be rejected by the partial unique index WHERE status IN ('ASSIGNED', 'ACCEPTED')
    const expiresAt = new Date(Date.now() + 86400000 * 7);
    await expect(
      assignmentRepo.createAssignment({
        revisionId: testRevisionId,
        reviewerId: testReviewerUserId,
        assignedByAdminId: testAdminUserId,
        expiresAt,
      })
    ).rejects.toThrow();
  });

  it('TEST-PG-INT-04: Allows new assignment creation after previous assignment reaches terminal status (COMPLETED)', async () => {
    // 1. Complete the current active assignment
    const active = await assignmentRepo.getActiveAcceptedAssignment(
      testRevisionId,
      testReviewerUserId
    );
    expect(active).not.toBeNull();

    await assignmentRepo.markAssignmentCompleted(active!.id);

    // 2. Now that the previous is COMPLETED (terminal), the partial unique index must permit a new ASSIGNED record
    const expiresAt = new Date(Date.now() + 86400000 * 7);
    const newAssignment = await assignmentRepo.createAssignment({
      revisionId: testRevisionId,
      reviewerId: testReviewerUserId,
      assignedByAdminId: testAdminUserId,
      expiresAt,
    });

    expect(newAssignment.id).toBeDefined();
    expect(newAssignment.status).toBe('ASSIGNED');
    expect(newAssignment.id).not.toBe(active!.id);
  });

  // ====================================================================
  // 2. COI PERSISTENCE & ASSESSMENT INTEGRITY TESTS
  // ====================================================================

  it('TEST-PG-INT-05: Creates and resolves persistent COI declaration in PostgreSQL', async () => {
    const expiresAt = new Date(Date.now() + 86400000 * 365);

    const created = await coiRepo.createDeclaration({
      userId: testReviewerUserId,
      targetProcedureId: testProcedureId,
      hasFinancialInterest: false,
      hasInstitutionalAffiliation: false,
      hasAuthorRelationship: false,
      hasCommercialSponsorship: false,
      expiresAt,
    });

    expect(created.id).toBeDefined();
    expect(created.status).toBe('SUBMITTED');

    // Retrieve via getActiveDeclaration
    const active = await coiRepo.getActiveDeclaration(testReviewerUserId, {
      procedureId: testProcedureId,
    });

    expect(active).not.toBeNull();
    expect(active?.id).toBe(created.id);
    expect(active?.status).toBe('SUBMITTED');
  });

  it('TEST-PG-INT-06: Assesses COI declaration to VERIFIED_CLEAR by admin and prevents self-clearance', async () => {
    const active = await coiRepo.getActiveDeclaration(testReviewerUserId, {
      procedureId: testProcedureId,
    });
    expect(active).not.toBeNull();

    // 1. Attempt self-clearance by reviewer -> MUST FAIL
    await expect(
      coiRepo.assessDeclaration({
        declarationId: active!.id,
        assessorAdminId: testReviewerUserId, // Declarant attempting self-assessment
        outcome: 'VERIFIED_CLEAR',
      })
    ).rejects.toThrow('SECURITY VIOLATION');

    // 2. Legitimate clearance by Admin -> MUST SUCCEED
    const assessed = await coiRepo.assessDeclaration({
      declarationId: active!.id,
      assessorAdminId: testAdminUserId,
      outcome: 'VERIFIED_CLEAR',
      assessmentNotes: 'Verified no commercial ties.',
    });

    expect(assessed.status).toBe('VERIFIED_CLEAR');
    expect(assessed.assessedByAdminId).toBe(testAdminUserId);
  });

  it('TEST-PG-INT-07: Supersession preserves original declaration with status SUPERSEDED', async () => {
    const oldDecl = await coiRepo.getActiveDeclaration(testReviewerUserId, {
      procedureId: testProcedureId,
    });
    expect(oldDecl).not.toBeNull();

    // Reviewer submits an updated declaration disclosing a new conflict
    const newDecl = await coiRepo.supersedeDeclaration(oldDecl!.id, {
      userId: testReviewerUserId,
      targetProcedureId: testProcedureId,
      hasFinancialInterest: true,
      hasInstitutionalAffiliation: false,
      hasAuthorRelationship: false,
      hasCommercialSponsorship: false,
      conflictDetails: 'Accepted speaking fee from instrument vendor',
      expiresAt: new Date(Date.now() + 86400000 * 180),
    });

    expect(newDecl.id).toBeDefined();
    expect(newDecl.status).toBe('CONFLICT_DECLARED');
    expect(newDecl.isRecused).toBe(true);

    // Check old declaration record in database directly
    const oldInDb = await prisma.conflictOfInterestDeclaration.findUnique({
      where: { id: oldDecl!.id },
    });
    expect(oldInDb?.status).toBe('SUPERSEDED');
    expect(oldInDb?.supersededById).toBe(newDecl.id);
  });
});
