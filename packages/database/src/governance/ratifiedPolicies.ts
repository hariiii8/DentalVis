// packages/database/src/governance/ratifiedPolicies.ts
// DentalVis — Server-Only Ratified Governance Policies Register
// Architecture Baseline v1.9.1 (FROZEN) — Milestone M6.1.2

import type {
  GovernancePolicyKey,
  RatifiedPolicy,
  StatutoryProceduralPermit,
  StatutorySpecialty,
} from '@dentalvis/common';

/**
 * Concrete type for sedation governance policy value.
 */
export interface SedationGovernancePolicyValue {
  rejectsUniversalTenureRule: boolean;
  requiresApplicableLicensing: boolean;
  requiresProceduralPermits: boolean;
  requiresAccreditedResidencyTraining: boolean;
  requiresRecognizedSpecialtyForDeepSedation: boolean;
  mandatorySpecialtiesForDeepSedation: StatutorySpecialty[];
  recognizedPermits: StatutoryProceduralPermit[];
  prohibitsBlanketRules: boolean;
}

/**
 * Concrete type for surgical governance policy value.
 */
export interface SurgicalGovernancePolicyValue {
  requiresRecognizedSpecialty: boolean;
  rejectsCommercialCertificatesAsStandalone: boolean;
  recognizedSurgicalSpecialties: StatutorySpecialty[];
}

/**
 * Authoritative in-memory registry of governance policies.
 * Explicitly marks previously ratified M4 policies as RATIFIED, and
 * proposed M5 rules as UNRATIFIED so the adapter fails closed.
 */
export const RATIFIED_POLICY_REGISTRY: ReadonlyMap<
  GovernancePolicyKey,
  RatifiedPolicy<unknown>
> = new Map<GovernancePolicyKey, RatifiedPolicy<unknown>>([
  // 1. No AI Clinical Sign-off (Ratified in M4)
  [
    'governance:no_ai_signoff',
    {
      provenance: {
        policyKey: 'governance:no_ai_signoff',
        version: '1.0.0',
        classification: 'PREVIOUSLY_RATIFIED_POLICY',
        ratificationStatus: 'RATIFIED',
        ratifiedAt: '2026-11-22T12:00:00.000Z',
        ratifyingAuthority: 'Clinical Review Board / Legal Counsel',
        ratificationDocumentRef: 'docs/governance/CLINICAL_GOVERNANCE_PROTOCOL.md §1',
        isJurisdictionSensitive: false,
        notes:
          'AI agents serve strictly as drafting aids; AI cannot provide clinical sign-off. ' +
          'A human account alone does not confer eligibility; practitioner credentials must be verified.',
      },
      value: {
        prohibitsAiClinicalSignOff: true,
        mandatesAuthenticatedHumanReviewer: true,
        mandatesVerifiedProfessionalQualifications: true,
        mandatesVerifiedStatutoryLicensing: true,
        mandatesScopeSpecificEvaluation: true,
        prohibitsAutomaticEligibility: true,
      },
    },
  ],

  // 2. Author / Reviewer Separation (Ratified in M4 & Physical Invariant)
  [
    'governance:author_separation',
    {
      provenance: {
        policyKey: 'governance:author_separation',
        version: '1.0.0',
        classification: 'PREVIOUSLY_RATIFIED_POLICY',
        ratificationStatus: 'RATIFIED',
        ratifiedAt: '2026-11-22T12:00:00.000Z',
        ratifyingAuthority: 'Clinical Review Board',
        ratificationDocumentRef: 'docs/governance/CLINICAL_GOVERNANCE_PROTOCOL.md §2',
        isJurisdictionSensitive: false,
        notes: 'Clinical author is strictly prohibited from approving own revision.',
      },
      value: {
        prohibitsAuthorSelfApproval: true,
        enforceAtServiceLayer: true,
        enforceAtDatabaseLayer: true,
      },
    },
  ],

  // 3. Decoupled Video & Media Review (Ratified in M4)
  [
    'governance:decoupled_media',
    {
      provenance: {
        policyKey: 'governance:decoupled_media',
        version: '1.0.0',
        classification: 'PREVIOUSLY_RATIFIED_POLICY',
        ratificationStatus: 'RATIFIED',
        ratifiedAt: '2026-11-22T12:00:00.000Z',
        ratifyingAuthority: 'Media Governance Panel',
        ratificationDocumentRef: 'docs/governance/CLINICAL_GOVERNANCE_PROTOCOL.md §2',
        isJurisdictionSensitive: false,
        notes: 'Text approval proceeds independently of media, but media rendering requires dedicated check.',
      },
      value: {
        textApprovalDecoupledFromMedia: true,
        mediaRequiresIndependentVerification: true,
      },
    },
  ],

  // 4. Sedation Governance Policy (Ratified in M4 — Jurisdiction-Sensitive)
  [
    'governance:sedation_permits',
    {
      provenance: {
        policyKey: 'governance:sedation_permits',
        version: '1.0.0',
        classification: 'PREVIOUSLY_RATIFIED_POLICY',
        ratificationStatus: 'RATIFIED',
        ratifiedAt: '2026-11-22T12:00:00.000Z',
        ratifyingAuthority: 'Sedation & Anesthesia Panel',
        ratificationDocumentRef: 'docs/governance/CLINICAL_GOVERNANCE_PROTOCOL.md §2',
        isJurisdictionSensitive: true,
        notes:
          'Universal 5-year tenure rule is rejected. Evaluates jurisdiction-specific licensing, permits, ' +
          'residency training, and specialty qualifications. Blanket rules prohibited.',
      },
      value: {
        rejectsUniversalTenureRule: true,
        requiresApplicableLicensing: true,
        requiresProceduralPermits: true,
        requiresAccreditedResidencyTraining: true,
        requiresRecognizedSpecialtyForDeepSedation: true,
        mandatorySpecialtiesForDeepSedation: [
          'DENTAL_ANESTHESIOLOGY',
          'ORAL_AND_MAXILLOFACIAL_SURGERY',
        ],
        recognizedPermits: [
          'ENTERAL_SEDATION_PERMIT',
          'PARENTERAL_MODERATE_IV_SEDATION_PERMIT',
          'DEEP_SEDATION_GENERAL_ANESTHESIA_PERMIT',
          'CONSCIOUS_SEDATION_ENDORSEMENT',
        ],
        prohibitsBlanketRules: true,
      } as SedationGovernancePolicyValue,
    },
  ],

  // 5. Surgical Specialty Priority (Ratified in M4)
  [
    'governance:surgical_specialty',
    {
      provenance: {
        policyKey: 'governance:surgical_specialty',
        version: '1.0.0',
        classification: 'PREVIOUSLY_RATIFIED_POLICY',
        ratificationStatus: 'RATIFIED',
        ratifiedAt: '2026-11-22T12:00:00.000Z',
        ratifyingAuthority: 'Surgical & Implant Panel',
        ratificationDocumentRef: 'docs/governance/CLINICAL_GOVERNANCE_PROTOCOL.md §2',
        isJurisdictionSensitive: false,
        notes:
          'Mandates recognized dental specialty (OMFS, Periodontics) for Tier 3 surgical. ' +
          'Commercial certificates rejected as standalone specialty.',
      },
      value: {
        requiresRecognizedSpecialty: true,
        rejectsCommercialCertificatesAsStandalone: true,
        recognizedSurgicalSpecialties: [
          'ORAL_AND_MAXILLOFACIAL_SURGERY',
          'PERIODONTICS',
        ],
      } as SurgicalGovernancePolicyValue,
    },
  ],

  // 6. Fail-Closed Publication Filter (Existing Technical Invariant)
  [
    'publication:fail_closed_filter',
    {
      provenance: {
        policyKey: 'publication:fail_closed_filter',
        version: '1.0.0',
        classification: 'EXISTING_TECHNICAL_INVARIANT',
        ratificationStatus: 'RATIFIED',
        ratifiedAt: '2026-11-19T00:00:00.000Z',
        ratifyingAuthority: 'Architecture Baseline (v1.9.1)',
        ratificationDocumentRef: 'packages/database/src/repository/DatabaseProcedureRepository.ts',
        isJurisdictionSensitive: false,
      },
      value: {
        requiresPublishedStatus: true,
        requiresActiveUnrevokedApproval: true,
        excludesDraftsFailClosed: true,
      },
    },
  ],

  // 7. Audit Immutability Triggers (Existing Technical Invariant M6.1.1)
  [
    'audit:immutability_triggers',
    {
      provenance: {
        policyKey: 'audit:immutability_triggers',
        version: '1.0.0',
        classification: 'EXISTING_TECHNICAL_INVARIANT',
        ratificationStatus: 'RATIFIED',
        ratifiedAt: '2026-11-24T01:00:00.000Z',
        ratifyingAuthority: 'Architecture Baseline (v1.9.1 M6.1.1)',
        ratificationDocumentRef: 'packages/database/prisma/migrations/20261125000000_m6_1_1_audit_immutability',
        isJurisdictionSensitive: false,
      },
      value: {
        enforceRowLevelAppendOnly: true,
        enforceStatementLevelAntiTruncate: true,
        forbidUpdateDeleteTruncate: true,
      },
    },
  ],

  // --------------------------------------------------------------------
  // UNRATIFIED PROPOSED M5 POLICIES (FAIL-CLOSED TARGETS)
  // --------------------------------------------------------------------

  // Quorum Tier 1 (Proposed in M5 — Unratified)
  [
    'quorum:tier:TIER_1',
    {
      provenance: {
        policyKey: 'quorum:tier:TIER_1',
        version: '0.1.0-proposed',
        classification: 'PROPOSED_POLICY_REQUIRING_RATIFICATION',
        ratificationStatus: 'UNRATIFIED',
        isJurisdictionSensitive: false,
        notes: 'Proposed 1 Licensed General Dentist quorum for Tier 1. Awaiting formal CRB ratification.',
      },
      value: null,
    },
  ],

  // Quorum Tier 2 (Proposed in M5 — Unratified)
  [
    'quorum:tier:TIER_2',
    {
      provenance: {
        policyKey: 'quorum:tier:TIER_2',
        version: '0.1.0-proposed',
        classification: 'PROPOSED_POLICY_REQUIRING_RATIFICATION',
        ratificationStatus: 'UNRATIFIED',
        isJurisdictionSensitive: false,
        notes: 'Proposed 1 Dentist with verified competency / specialist for Tier 2. Awaiting formal CRB ratification.',
      },
      value: null,
    },
  ],

  // Quorum Tier 3 (Proposed in M5 — Unratified)
  [
    'quorum:tier:TIER_3',
    {
      provenance: {
        policyKey: 'quorum:tier:TIER_3',
        version: '0.1.0-proposed',
        classification: 'PROPOSED_POLICY_REQUIRING_RATIFICATION',
        ratificationStatus: 'UNRATIFIED',
        isJurisdictionSensitive: false,
        notes: 'Proposed 2 Independent Reviewers (at least 1 specialist) for Tier 3. Awaiting formal CRB ratification.',
      },
      value: null,
    },
  ],

  // Credential Verification Window (Proposed in M5 — Unratified)
  [
    'credential:verification_window',
    {
      provenance: {
        policyKey: 'credential:verification_window',
        version: '0.1.0-proposed',
        classification: 'PROPOSED_POLICY_REQUIRING_RATIFICATION',
        ratificationStatus: 'UNRATIFIED',
        isJurisdictionSensitive: true,
        notes: 'Proposed 90-day verification validity window. Awaiting formal CRB ratification.',
      },
      value: null,
    },
  ],

  // COI Commercial Threshold (Proposed in M5 — Unratified)
  [
    'coi:commercial_threshold',
    {
      provenance: {
        policyKey: 'coi:commercial_threshold',
        version: '0.1.0-proposed',
        classification: 'PROPOSED_POLICY_REQUIRING_RATIFICATION',
        ratificationStatus: 'UNRATIFIED',
        isJurisdictionSensitive: false,
        notes: 'Proposed $1,000 threshold for financial relationship disclosure. Awaiting formal CRB ratification.',
      },
      value: null,
    },
  ],

  // Reassessment Tier 1 (Proposed in M5 — Unratified)
  [
    'reassessment:tier:TIER_1',
    {
      provenance: {
        policyKey: 'reassessment:tier:TIER_1',
        version: '0.1.0-proposed',
        classification: 'PROPOSED_POLICY_REQUIRING_RATIFICATION',
        ratificationStatus: 'UNRATIFIED',
        isJurisdictionSensitive: false,
        notes: 'Proposed 24-month periodic review interval. Awaiting formal CRB ratification.',
      },
      value: null,
    },
  ],

  // Reassessment Tier 2/3 (Proposed in M5 — Unratified)
  [
    'reassessment:tier:TIER_2_3',
    {
      provenance: {
        policyKey: 'reassessment:tier:TIER_2_3',
        version: '0.1.0-proposed',
        classification: 'PROPOSED_POLICY_REQUIRING_RATIFICATION',
        ratificationStatus: 'UNRATIFIED',
        isJurisdictionSensitive: false,
        notes: 'Proposed 12-month periodic review interval. Awaiting formal CRB ratification.',
      },
      value: null,
    },
  ],

  // Bilingual Tamil Sign-Off (Proposed in M5 — Unratified)
  [
    'bilingual:tamil_signoff',
    {
      provenance: {
        policyKey: 'bilingual:tamil_signoff',
        version: '0.1.0-proposed',
        classification: 'PROPOSED_POLICY_REQUIRING_RATIFICATION',
        ratificationStatus: 'UNRATIFIED',
        isJurisdictionSensitive: false,
        notes: 'Proposed mandatory bilingual clinical practitioner sign-off. Awaiting formal CRB ratification.',
      },
      value: null,
    },
  ],

  // SLA Assignment Acceptance (Technical Recommendation — Non-Binding)
  [
    'sla:assignment_acceptance',
    {
      provenance: {
        policyKey: 'sla:assignment_acceptance',
        version: '1.0.0-recommendation',
        classification: 'TECHNICAL_RECOMMENDATION',
        ratificationStatus: 'NON_BINDING_RECOMMENDATION',
        isJurisdictionSensitive: false,
        notes: '5-business-day assignment turnaround target. Informative guideline only; non-blocking.',
      },
      value: {
        targetBusinessDays: 5,
        isBindingEnforcement: false,
      },
    },
  ],
]);
