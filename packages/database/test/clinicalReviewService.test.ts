// packages/database/test/clinicalReviewService.test.ts
// DentalVis — Unit Tests for ClinicalReviewService (M6.1.4)
// Architecture Baseline v1.9.1 (FROZEN)

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock server-only for node test runner
vi.mock('server-only', () => ({}));

import { ClinicalReviewService } from '../src/governance/clinicalReviewService';
import { PolicyConfigurationAdapter } from '../src/governance/policyAdapter';
import type { PrismaClient } from '@prisma/client';
import type {
  IAssignmentRepository,
  ICoiRepository,
  AuthoritativeAssignmentRecord,
  AuthoritativeCoiRecord,
  SubmitClinicalReviewInput,
} from '../src/governance/interfaces';

describe('ClinicalReviewService (M6.1.4 Unit Tests)', () => {
  let mockPrisma: any;
  let mockAssignmentRepo: IAssignmentRepository;
  let mockCoiRepo: ICoiRepository;
  let mockAuthzService: any;
  let mockAuditService: any;
  let mockEligibilityService: any;
  let policyAdapter: PolicyConfigurationAdapter;
  let service: ClinicalReviewService;

  const validAssignment: AuthoritativeAssignmentRecord = {
    id: 'asg-01',
    revisionId: 'rev-01',
    reviewerId: 'usr-rev-01',
    assignedByAdminId: 'usr-chair-01',
    status: 'ACCEPTED',
    assignedAt: new Date(),
    expiresAt: new Date(Date.now() + 86400000 * 7),
  };

  const validCoi: AuthoritativeCoiRecord = {
    id: 'coi-01',
    userId: 'usr-rev-01',
    status: 'VERIFIED_CLEAR',
    hasFinancialInterest: false,
    hasInstitutionalAffiliation: false,
    hasAuthorRelationship: false,
    hasCommercialSponsorship: false,
    isRecused: false,
    declaredAt: new Date(),
    expiresAt: new Date(Date.now() + 86400000 * 180),
  };

  const defaultInput: SubmitClinicalReviewInput = {
    revisionId: 'rev-01',
    assignmentId: 'asg-01',
    reviewerId: 'usr-rev-01',
    sessionTokenHash: 'valid-session-hash-token',
    decision: 'APPROVED',
    clinicalNotes: 'Procedure content is clinically accurate and follows guidelines.',
    reviewerCredentials: {
      reviewerUserId: 'usr-rev-01',
      licenseNumber: 'DENT-LIC-9988',
      clinicalSpecialty: 'ENDODONTICS',
      isStatutoryLicenseVerified: true,
      hasActiveSanctions: false,
    },
    ipHash: 'ip-hash-123',
    userAgent: 'DentalVis-TestAgent/1.0',
  };

  beforeEach(() => {
    policyAdapter = new PolicyConfigurationAdapter();

    mockAssignmentRepo = {
      getAssignment: vi.fn().mockResolvedValue(validAssignment),
      getActiveAcceptedAssignment: vi.fn().mockResolvedValue(validAssignment),
      markAssignmentCompleted: vi.fn().mockResolvedValue(undefined),
      isPersistenceHealthy: vi.fn().mockResolvedValue(true),
    };

    mockCoiRepo = {
      getActiveDeclaration: vi.fn().mockResolvedValue(validCoi),
      isPersistenceHealthy: vi.fn().mockResolvedValue(true),
    };

    mockAuthzService = {
      authorize: vi.fn().mockResolvedValue({
        decision: 'ALLOW',
        requestedScope: 'crb:review:submit',
      }),
    };

    mockAuditService = {
      emitAuditEvent: vi.fn().mockResolvedValue({
        auditId: 'audit-log-uuid-123',
        payloadHash: 'hash-abc-123',
      }),
    };

    mockEligibilityService = {
      evaluateEligibility: vi.fn().mockResolvedValue({
        isEligible: true,
        denialReasons: [],
      }),
    };

    // Prisma Transaction & Model Mocks
    mockPrisma = {
      $transaction: vi.fn().mockImplementation(async (callback) => {
        return callback(mockPrisma);
      }),
      procedureRevision: {
        findUnique: vi.fn().mockResolvedValue({
          id: 'rev-01',
          procedureId: 'proc-root-canal',
          authorId: 'usr-author-99', // Different from reviewer
          language: 'en',
          snapshotData: {
            clinicalMetadata: { riskTier: 'TIER_1' },
          },
          translation: {
            currentStatus: 'PENDING_APPROVAL',
          },
        }),
      },
      procedureApproval: {
        findUnique: vi.fn().mockResolvedValue(null), // No duplicate
        upsert: vi.fn().mockResolvedValue({
          id: 'approval-uuid-001',
          revisionId: 'rev-01',
          reviewerId: 'usr-rev-01',
          decision: 'APPROVED',
          isRevoked: false,
          signedAt: new Date(),
        }),
        update: vi.fn().mockResolvedValue({ id: 'app-01', isRevoked: true }),
      },
      procedureTranslation: {
        update: vi.fn().mockResolvedValue({}),
      },
      procedureApprovalRevocation: {
        create: vi.fn().mockResolvedValue({ id: 'revoc-01' }),
      },
    };

    service = new ClinicalReviewService({
      prisma: mockPrisma as unknown as PrismaClient,
      assignmentRepository: mockAssignmentRepo,
      coiRepository: mockCoiRepo,
      policyAdapter,
      authzService: mockAuthzService,
      auditService: mockAuditService,
      eligibilityService: mockEligibilityService,
    });
  });

  it('TEST-CRS-01: Successfully submits review when authorized, assigned, and eligible', async () => {
    const result = await service.submitReview(defaultInput);
    expect(result.success).toBe(true);
    expect(result.approvalId).toBe('approval-uuid-001');
    expect(result.decision).toBe('APPROVED');
    expect(mockAssignmentRepo.markAssignmentCompleted).toHaveBeenCalledWith(
      'asg-01',
      expect.any(Date),
      expect.anything()
    );
    expect(mockAuditService.emitAuditEvent).toHaveBeenCalledTimes(1);
  });

  it('TEST-CRS-02: Strictly rejects review submission when authorization returns DENY', async () => {
    mockAuthzService.authorize.mockResolvedValueOnce({
      decision: 'DENY',
      denialReason: 'ROLE_INCOMPATIBLE',
      diagnosticMessage: 'Actor lacks required CRB reviewer role.',
    });

    const result = await service.submitReview(defaultInput);
    expect(result.success).toBe(false);
    expect(result.denialReason).toBe('AUTHORIZATION_DENIED');
    expect(mockPrisma.$transaction).not.toHaveBeenCalled();
  });

  it('TEST-CRS-03: Strictly rejects submission when authorization returns REQUIRES_VERIFICATION', async () => {
    mockAuthzService.authorize.mockResolvedValueOnce({
      decision: 'REQUIRES_VERIFICATION',
      diagnosticMessage: 'Practitioner credential verification is pending.',
    });

    const result = await service.submitReview(defaultInput);
    expect(result.success).toBe(false);
    expect(result.denialReason).toBe('AUTHORIZATION_REQUIRES_VERIFICATION');
  });

  it('TEST-CRS-04: Prevents revision author from submitting review on own revision', async () => {
    mockPrisma.procedureRevision.findUnique.mockResolvedValueOnce({
      id: 'rev-01',
      authorId: 'usr-rev-01', // Author is reviewer
      translation: { currentStatus: 'PENDING_APPROVAL' },
    });

    const result = await service.submitReview(defaultInput);
    expect(result.success).toBe(false);
    expect(result.denialReason).toBe('AUTHOR_SELF_APPROVAL_PROHIBITED');
  });

  it('TEST-CRS-05: Rejects review submission when assignment is missing or unaccepted', async () => {
    mockAssignmentRepo.getActiveAcceptedAssignment = vi.fn().mockResolvedValue(null);
    mockAssignmentRepo.getAssignment = vi.fn().mockResolvedValue({
      ...validAssignment,
      status: 'ASSIGNED', // Not accepted yet
    });

    const result = await service.submitReview(defaultInput);
    expect(result.success).toBe(false);
    expect(result.denialReason).toBe('ASSIGNMENT_NOT_ACCEPTED');
  });

  it('TEST-CRS-06: Rejects submission when reviewer is ineligible at submission time', async () => {
    mockEligibilityService.evaluateEligibility.mockResolvedValueOnce({
      isEligible: false,
      denialReasons: ['COI_REVIEWER_RECUSED'],
    });

    const result = await service.submitReview(defaultInput);
    expect(result.success).toBe(false);
    expect(result.denialReason).toBe('REVIEWER_INELIGIBLE');
  });

  it('TEST-CRS-07: Prevents duplicate review submissions by same reviewer for same revision', async () => {
    mockPrisma.procedureApproval.findUnique.mockResolvedValueOnce({
      id: 'existing-app-01',
      isRevoked: false,
    });

    const result = await service.submitReview(defaultInput);
    expect(result.success).toBe(false);
    expect(result.denialReason).toBe('DUPLICATE_REVIEW_SUBMISSION');
  });

  it('TEST-CRS-08: Quorum policy fails closed when unratified; revision remains unapproved', async () => {
    // Under unratified quorum, quorumSatisfied remains false
    const result = await service.submitReview(defaultInput);
    expect(result.success).toBe(true);
    expect(result.quorumSatisfied).toBe(false);
    expect(result.revisionStatus).toBe('PENDING_APPROVAL');
  });

  it('TEST-CRS-09: Successfully revokes approval and demotes translation status', async () => {
    mockAuthzService.authorize.mockResolvedValueOnce({
      decision: 'ALLOW',
      requestedScope: 'crb:approval:revoke',
    });

    mockPrisma.procedureApproval.findUnique.mockResolvedValueOnce({
      id: 'app-01',
      isRevoked: false,
      revisionId: 'rev-01',
      revision: {
        procedureId: 'proc-01',
        language: 'en',
        translation: { currentStatus: 'APPROVED' },
      },
    });

    const revokeResult = await service.revokeApproval({
      approvalId: 'app-01',
      revokingAdminId: 'usr-admin-01',
      adminSessionTokenHash: 'admin-token',
      reason: 'Reviewer license expired retroactively',
    });

    expect(revokeResult.success).toBe(true);
    expect(revokeResult.updatedRevisionStatus).toBe('PENDING_APPROVAL');
    expect(mockPrisma.procedureApproval.update).toHaveBeenCalledWith({
      where: { id: 'app-01' },
      data: { isRevoked: true },
    });
    expect(mockAuditService.emitAuditEvent).toHaveBeenCalledTimes(1);
  });
});
