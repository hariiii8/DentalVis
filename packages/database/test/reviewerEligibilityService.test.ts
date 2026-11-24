// packages/database/test/reviewerEligibilityService.test.ts
// DentalVis — Unit Tests for ReviewerEligibilityService (M6.1.4)
// Architecture Baseline v1.9.1 (FROZEN)

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock server-only for node test runner
vi.mock('server-only', () => ({}));

import { ReviewerEligibilityService } from '../src/governance/reviewerEligibilityService';
import { PolicyConfigurationAdapter } from '../src/governance/policyAdapter';
import type {
  ICoiRepository,
  AuthoritativeCoiRecord,
  ReviewerCredentialsInput,
  ClinicalProcedureContext,
} from '../src/governance/interfaces';

describe('ReviewerEligibilityService (M6.1.4 Unit Tests)', () => {
  let mockCoiRepo: ICoiRepository;
  let service: ReviewerEligibilityService;
  let policyAdapter: PolicyConfigurationAdapter;

  const validReviewer: ReviewerCredentialsInput = {
    reviewerUserId: 'user-rev-01',
    licenseNumber: 'DENT-LIC-12345',
    clinicalSpecialty: 'ENDODONTICS',
    isStatutoryLicenseVerified: true,
    hasActiveSanctions: false,
    licenseExpiresAt: new Date(Date.now() + 86400000 * 365), // 1 year future
    proceduralPermits: ['ENTERAL_SEDATION_PERMIT'],
  };

  const validProcedure: ClinicalProcedureContext = {
    procedureId: 'proc-root-canal',
    revisionId: 'rev-01',
    authorId: 'user-author-01',
    primarySpecialty: 'ENDODONTICS',
    involvesSedation: false,
  };

  const validCoiRecord: AuthoritativeCoiRecord = {
    id: 'coi-01',
    userId: 'user-rev-01',
    targetProcedureId: 'proc-root-canal',
    targetRevisionId: 'rev-01',
    status: 'VERIFIED_CLEAR',
    hasFinancialInterest: false,
    hasInstitutionalAffiliation: false,
    hasAuthorRelationship: false,
    hasCommercialSponsorship: false,
    isRecused: false,
    declaredAt: new Date(),
    expiresAt: new Date(Date.now() + 86400000 * 180),
  };

  beforeEach(() => {
    policyAdapter = new PolicyConfigurationAdapter();
    mockCoiRepo = {
      getActiveDeclaration: vi.fn().mockResolvedValue(validCoiRecord),
      isPersistenceHealthy: vi.fn().mockResolvedValue(true),
    };
    service = new ReviewerEligibilityService({
      coiRepository: mockCoiRepo,
      policyAdapter,
    });
  });

  it('TEST-RES-01: Successfully validates an eligible reviewer with valid credentials and clear COI', async () => {
    const result = await service.evaluateEligibility(validReviewer, validProcedure);
    expect(result.isEligible).toBe(true);
    expect(result.hasValidLicense).toBe(true);
    expect(result.coiState).toBe('CLEAR');
    expect(result.denialReasons).toHaveLength(0);
  });

  it('TEST-RES-02: Strictly rejects author reviewing own procedure revision (Author Separation Invariant)', async () => {
    const selfReviewProcedure: ClinicalProcedureContext = {
      ...validProcedure,
      authorId: 'user-rev-01', // Same as reviewerUserId
    };
    const result = await service.evaluateEligibility(validReviewer, selfReviewProcedure);
    expect(result.isEligible).toBe(false);
    expect(result.denialReasons).toContain('AUTHOR_SELF_REVIEW_PROHIBITED');
  });

  it('TEST-RES-03: Fails closed when COI declaration is missing', async () => {
    mockCoiRepo.getActiveDeclaration = vi.fn().mockResolvedValue(null);
    const result = await service.evaluateEligibility(validReviewer, validProcedure);
    expect(result.isEligible).toBe(false);
    expect(result.coiState).toBe('MISSING');
    expect(result.denialReasons).toContain('COI_DECLARATION_MISSING');
  });

  it('TEST-RES-04: Fails closed when COI declaration has expired', async () => {
    mockCoiRepo.getActiveDeclaration = vi.fn().mockResolvedValue({
      ...validCoiRecord,
      expiresAt: new Date(Date.now() - 10000), // Past
    });
    const result = await service.evaluateEligibility(validReviewer, validProcedure);
    expect(result.isEligible).toBe(false);
    expect(result.coiState).toBe('EXPIRED');
    expect(result.denialReasons).toContain('COI_DECLARATION_EXPIRED');
  });

  it('TEST-RES-05: Fails closed when reviewer is recused or has conflict declared', async () => {
    mockCoiRepo.getActiveDeclaration = vi.fn().mockResolvedValue({
      ...validCoiRecord,
      isRecused: true,
      status: 'RECUSED',
      recusalReason: 'Consulting relationship with device manufacturer',
    });
    const result = await service.evaluateEligibility(validReviewer, validProcedure);
    expect(result.isEligible).toBe(false);
    expect(result.coiState).toBe('RECUSED');
    expect(result.denialReasons).toContain('COI_REVIEWER_RECUSED');
  });

  it('TEST-RES-06: Fails closed when COI repository is unreachable or unhealthy', async () => {
    mockCoiRepo.isPersistenceHealthy = vi.fn().mockResolvedValue(false);
    const result = await service.evaluateEligibility(validReviewer, validProcedure);
    expect(result.isEligible).toBe(false);
    expect(result.coiState).toBe('UNVERIFIED');
    expect(result.denialReasons).toContain('COI_REPOSITORY_UNAVAILABLE');
  });

  it('TEST-RES-07: Fails closed when reviewer license is expired or sanctioned', async () => {
    const sanctionedReviewer: ReviewerCredentialsInput = {
      ...validReviewer,
      hasActiveSanctions: true,
    };
    const result = await service.evaluateEligibility(sanctionedReviewer, validProcedure);
    expect(result.isEligible).toBe(false);
    expect(result.denialReasons).toContain('CREDENTIALS_SANCTIONED');
  });

  it('TEST-RES-08: Enforces sedation procedural permits when procedure involves sedation', async () => {
    const sedationProc: ClinicalProcedureContext = {
      ...validProcedure,
      involvesSedation: true,
      sedationLevel: 'MODERATE',
      jurisdiction: { country: 'US', subdivision: 'CA' },
    };

    const reviewerWithoutPermits: ReviewerCredentialsInput = {
      ...validReviewer,
      proceduralPermits: [],
    };

    const result = await service.evaluateEligibility(reviewerWithoutPermits, sedationProc);
    expect(result.isEligible).toBe(false);
    expect(result.denialReasons).toContain('PROCEDURAL_PERMIT_MISSING');
  });

  it('TEST-RES-09: Enforces surgical specialty matching for Tier 3 surgical procedures', async () => {
    const surgicalProc: ClinicalProcedureContext = {
      ...validProcedure,
      surgicalInvasiveness: 'SURGICAL',
    };

    const generalReviewer: ReviewerCredentialsInput = {
      ...validReviewer,
      clinicalSpecialty: 'GENERAL_DENTISTRY',
    };

    const result = await service.evaluateEligibility(generalReviewer, surgicalProc);
    expect(result.isEligible).toBe(false);
    expect(result.denialReasons).toContain('SPECIALTY_MISMATCH');
  });
});
