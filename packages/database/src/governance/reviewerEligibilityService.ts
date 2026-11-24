// packages/database/src/governance/reviewerEligibilityService.ts
// DentalVis — Server-Only Reviewer Eligibility Service
// Architecture Baseline v1.9.1 (FROZEN) — Milestone M6.1.4

import 'server-only';
import { PolicyConfigurationAdapter } from './policyAdapter';
import type {
  ClinicalProcedureContext,
  EligibilityDenialReason,
  ICoiRepository,
  IReviewerEligibilityService,
  ReviewerCredentialsInput,
  ReviewerEligibilityResult,
} from './interfaces';

/**
 * Evaluates whether a clinical reviewer is qualified and eligible to review
 * a specific procedure revision based on contextual scope, licensing, permits,
 * COI recusal state, and ratified policies.
 */
export class ReviewerEligibilityService implements IReviewerEligibilityService {
  private readonly policyAdapter: PolicyConfigurationAdapter;
  private readonly coiRepository: ICoiRepository;

  constructor(options: {
    coiRepository: ICoiRepository;
    policyAdapter?: PolicyConfigurationAdapter;
  }) {
    if (!options.coiRepository) {
      throw new Error('ReviewerEligibilityService requires an authoritative ICoiRepository.');
    }
    this.coiRepository = options.coiRepository;
    this.policyAdapter = options.policyAdapter ?? new PolicyConfigurationAdapter();
  }

  public async evaluateEligibility(
    reviewer: ReviewerCredentialsInput,
    procedure: ClinicalProcedureContext,
    options?: { evaluationTime?: Date }
  ): Promise<ReviewerEligibilityResult> {
    const now = options?.evaluationTime ?? new Date();
    const evaluatedAt = now.toISOString();
    const denialReasons: EligibilityDenialReason[] = [];
    const evaluatedPolicies: Record<string, string> = {};

    let hasValidLicense = false;
    let hasRequiredPermits = true;
    let coiState: ReviewerEligibilityResult['coiState'] = 'UNVERIFIED';

    // ------------------------------------------------------------------
    // 1. Basic Identity & Author Separation
    // ------------------------------------------------------------------
    if (!reviewer.reviewerUserId || reviewer.reviewerUserId.trim() === '') {
      denialReasons.push('REVIEWER_NOT_FOUND');
    }

    if (!procedure.revisionId || procedure.revisionId.trim() === '') {
      denialReasons.push('REVISION_NOT_FOUND');
    }

    // Author/Reviewer Separation Invariant (M4-POL-001)
    if (
      reviewer.reviewerUserId &&
      procedure.authorId &&
      reviewer.reviewerUserId === procedure.authorId
    ) {
      denialReasons.push('AUTHOR_SELF_REVIEW_PROHIBITED');
      try {
        const sepPolicy = this.policyAdapter.getAuthorSeparationPolicy();
        evaluatedPolicies[sepPolicy.provenance.policyKey] = sepPolicy.provenance.version;
      } catch {
        // Log provenance if available
      }
    }

    // ------------------------------------------------------------------
    // 2. Statutory Credentials & Disciplinary Status
    // ------------------------------------------------------------------
    if (!reviewer.licenseNumber || reviewer.licenseNumber.trim() === '') {
      denialReasons.push('CREDENTIALS_MISSING');
    }

    if (reviewer.hasActiveSanctions) {
      denialReasons.push('CREDENTIALS_SANCTIONED');
    }

    if (reviewer.licenseExpiresAt && reviewer.licenseExpiresAt.getTime() <= now.getTime()) {
      denialReasons.push('CREDENTIALS_EXPIRED');
    }

    if (reviewer.isStatutoryLicenseVerified === false) {
      denialReasons.push('CREDENTIALS_UNVERIFIED');
    } else if (reviewer.licenseNumber && !reviewer.hasActiveSanctions) {
      hasValidLicense = true;
    }

    // ------------------------------------------------------------------
    // 3. Conflict of Interest (COI) Verification via ICoiRepository
    // ------------------------------------------------------------------
    let coiHealthy = false;
    try {
      coiHealthy = await this.coiRepository.isPersistenceHealthy();
    } catch {
      coiHealthy = false;
    }

    if (!coiHealthy) {
      coiState = 'UNVERIFIED';
      denialReasons.push('COI_REPOSITORY_UNAVAILABLE');
    } else {
      try {
        const coiRecord = await this.coiRepository.getActiveDeclaration(
          reviewer.reviewerUserId,
          {
            procedureId: procedure.procedureId,
            revisionId: procedure.revisionId,
          },
          now
        );

        if (!coiRecord) {
          coiState = 'MISSING';
          denialReasons.push('COI_DECLARATION_MISSING');
        } else if (coiRecord.expiresAt.getTime() <= now.getTime()) {
          coiState = 'EXPIRED';
          denialReasons.push('COI_DECLARATION_EXPIRED');
        } else if (coiRecord.isRecused || coiRecord.status === 'RECUSED') {
          coiState = 'RECUSED';
          denialReasons.push('COI_REVIEWER_RECUSED');
        } else if (
          coiRecord.hasFinancialInterest ||
          coiRecord.hasAuthorRelationship ||
          coiRecord.hasInstitutionalAffiliation ||
          coiRecord.hasCommercialSponsorship ||
          coiRecord.status === 'CONFLICT_DECLARED'
        ) {
          coiState = 'CONFLICT_DECLARED';
          denialReasons.push('COI_CONFLICT_DECLARED');
        } else if (coiRecord.status === 'VERIFIED_CLEAR' || coiRecord.status === 'SUBMITTED') {
          coiState = 'CLEAR';
        } else {
          coiState = 'UNVERIFIED';
          denialReasons.push('COI_DECLARATION_MISSING');
        }
      } catch {
        coiState = 'UNVERIFIED';
        denialReasons.push('COI_REPOSITORY_UNAVAILABLE');
      }
    }

    // ------------------------------------------------------------------
    // 4. Scope-Specific Policy Checks (Sedation, Surgical, Specialty)
    // ------------------------------------------------------------------

    // A. Sedation Policy (M4-POL-002)
    if (procedure.involvesSedation) {
      try {
        const sedationPolicy = this.policyAdapter.getSedationPolicy(
          procedure.jurisdiction ?? { country: 'US', subdivision: 'CA' }
        );
        evaluatedPolicies[sedationPolicy.provenance.policyKey] = sedationPolicy.provenance.version;

        const val = sedationPolicy.value;
        const requiredSpecialties = val.mandatorySpecialtiesForDeepSedation ?? [];
        const recognizedPermits = val.recognizedPermits ?? [];

        // Check if deep sedation requires recognized specialty
        if (
          procedure.sedationLevel === 'DEEP' ||
          procedure.sedationLevel === 'GENERAL_ANESTHESIA'
        ) {
          const hasSedationSpecialty = requiredSpecialties.includes(
            reviewer.clinicalSpecialty as any
          );
          if (!hasSedationSpecialty) {
            denialReasons.push('SPECIALTY_MISMATCH');
          }
        }

        // Check procedural permits if sedation requires permits
        if (val.requiresProceduralPermits) {
          const reviewerPermits = reviewer.proceduralPermits ?? [];
          const hasMatchingPermit = reviewerPermits.some((p) => recognizedPermits.includes(p));
          if (!hasMatchingPermit) {
            hasRequiredPermits = false;
            denialReasons.push('PROCEDURAL_PERMIT_MISSING');
          }
        }
      } catch (err: any) {
        if (err.name === 'UnratifiedGovernancePolicyError') {
          denialReasons.push('POLICY_UNRATIFIED');
        } else if (err.name === 'MissingJurisdictionContextError') {
          denialReasons.push('UNRESOLVED_PROCEDURE_METADATA');
        } else {
          denialReasons.push('POLICY_MISSING');
        }
      }
    }

    // B. Surgical Specialty Policy (M4-POL-005)
    if (procedure.surgicalInvasiveness === 'SURGICAL') {
      try {
        const surgicalPolicy = this.policyAdapter.getSurgicalPolicy();
        evaluatedPolicies[surgicalPolicy.provenance.policyKey] = surgicalPolicy.provenance.version;

        const surgicalSpecs = surgicalPolicy.value.recognizedSurgicalSpecialties ?? [];
        const isSurgicalSpec = surgicalSpecs.includes(reviewer.clinicalSpecialty as any);
        if (!isSurgicalSpec) {
          denialReasons.push('SPECIALTY_MISMATCH');
        }
      } catch (err: any) {
        if (err.name === 'UnratifiedGovernancePolicyError') {
          denialReasons.push('POLICY_UNRATIFIED');
        } else {
          denialReasons.push('POLICY_MISSING');
        }
      }
    }

    // C. Primary Specialty Matching (when procedure explicitly designates a specialty requirement)
    if (
      procedure.primarySpecialty &&
      procedure.primarySpecialty !== 'GENERAL_DENTISTRY' &&
      reviewer.clinicalSpecialty !== procedure.primarySpecialty
    ) {
      if (!denialReasons.includes('SPECIALTY_MISMATCH')) {
        denialReasons.push('SPECIALTY_MISMATCH');
      }
    }

    const isEligible = denialReasons.length === 0;

    return {
      isEligible,
      reviewerId: reviewer.reviewerUserId,
      procedureId: procedure.procedureId,
      revisionId: procedure.revisionId,
      matchedSpecialty: reviewer.clinicalSpecialty,
      hasValidLicense,
      hasRequiredPermits,
      coiState,
      denialReasons,
      evaluatedPolicies,
      evaluatedAt,
    };
  }
}
