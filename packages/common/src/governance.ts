// packages/common/src/governance.ts
// DentalVis — Clinical Review Board (CRB) Core Governance Types & Taxonomies
// Architecture Baseline v1.9.1 (FROZEN) — Milestone M6.1.2

import type { ContentStatus, GovernanceTier } from './index';

// ----------------------------------------------------------------------
// 1. APPLICATION USER ROLES VS GOVERNANCE IDENTITIES
// ----------------------------------------------------------------------

/**
 * Mirror of the 5-value technical application role defined in Prisma schema (`UserRole`).
 * Strictly represents application-level RBAC, NOT PostgreSQL database credentials or engine roles.
 */
export type ApplicationUserRole =
  | 'PATIENT_VIEWER'
  | 'CLINICAL_AUTHOR'
  | 'CLINICAL_REVIEWER'
  | 'CHIEF_EDITOR'
  | 'SYSTEM_ADMIN';

/**
 * Operational Governance Roles within the Clinical Review Board (CRB).
 * Having a governance identity does NOT automatically establish professional clinical qualifications.
 */
export type CRBRole =
  | 'CONTENT_AUTHOR'
  | 'CLINICAL_REVIEWER'
  | 'SPECIALIST_REVIEWER'
  | 'CRB_CHAIR'
  | 'GOVERNANCE_ADMIN'
  | 'PUBLICATION_ADMIN'
  | 'INDEPENDENT_AUDITOR';

/**
 * Granular Permission Scopes for server-side authorization enforcement.
 * Enforces strict separation: Independent Auditor is read-only; CRB Chair cannot publish;
 * Publication Admin cannot approve or revoke clinical reviews.
 */
export type GovernancePermissionScope =
  | 'crb:dossier:read'
  | 'crb:dossier:draft'
  | 'crb:review:assign'
  | 'crb:review:accept'
  | 'crb:review:assess'
  | 'crb:review:submit'
  | 'crb:credential:verify'
  | 'crb:coi:audit'
  | 'crb:publish:authorize'
  | 'crb:approval:revoke'
  | 'crb:policy:read'
  | 'crb:audit:read';

// ----------------------------------------------------------------------
// 2. PROFESSIONAL QUALIFICATIONS & JURISDICTIONAL LICENSURE
// ----------------------------------------------------------------------

/**
 * Verified statutory clinical degree/qualification.
 * A human account or user role alone NEVER establishes clinical eligibility.
 */
export type ClinicalQualificationDegree =
  | 'BDS'   // Bachelor of Dental Surgery
  | 'DDS'   // Doctor of Dental Surgery
  | 'DMD'   // Doctor of Medicine in Dentistry / Dental Medicine
  | 'MBBS'  // Bachelor of Medicine, Bachelor of Surgery
  | 'MD'    // Doctor of Medicine
  | 'MDS'   // Master of Dental Surgery
  | 'MS'    // Master of Science in Dentistry
  | 'DNB';  // Diplomate of National Board

/**
 * Recognized statutory dental and medical specialties.
 * Mandatory for Tier 3 procedure evaluations and discipline-specific reviews.
 */
export type StatutorySpecialty =
  | 'ORAL_AND_MAXILLOFACIAL_SURGERY'
  | 'PERIODONTICS'
  | 'ENDODONTICS'
  | 'PROSTHODONTICS'
  | 'ORTHODONTICS'
  | 'PEDIATRIC_DENTISTRY'
  | 'DENTAL_ANESTHESIOLOGY'
  | 'ORAL_MEDICINE_AND_RADIOLOGY'
  | 'GENERAL_DENTISTRY';

/**
 * Statutory licensing authorities recognized for primary practitioner verification.
 */
export type StatutoryLicensingAuthority =
  | 'DENTAL_COUNCIL_OF_INDIA'
  | 'US_STATE_DENTAL_BOARD'
  | 'UK_GENERAL_DENTAL_COUNCIL'
  | 'AUSTRALIAN_HEALTH_PRACTITIONER_REGULATION_AGENCY'
  | 'ROYAL_COLLEGE_OF_DENTAL_SURGEONS_OF_ONTARIO'
  | 'OTHER_STATUTORY_AUTHORITY';

/**
 * Status of statutory practitioner credential verification.
 */
export type CredentialVerificationStatus =
  | 'UNVERIFIED'
  | 'VERIFIED_ACTIVE'
  | 'EXPIRED'
  | 'REVOKED_OR_SUSPENDED'
  | 'SANCTIONED';

/**
 * Procedural permits (e.g. Sedation & Anesthesia permits).
 * Evaluated strictly per jurisdiction and procedure scope.
 */
export type StatutoryProceduralPermit =
  | 'ENTERAL_SEDATION_PERMIT'
  | 'PARENTERAL_MODERATE_IV_SEDATION_PERMIT'
  | 'DEEP_SEDATION_GENERAL_ANESTHESIA_PERMIT'
  | 'HOSPITAL_SURGICAL_PRIVILEGES'
  | 'CONSCIOUS_SEDATION_ENDORSEMENT';

/**
 * Explicit jurisdictional context required for jurisdiction-sensitive policy evaluation.
 */
export interface JurisdictionalContext {
  country: string;              // ISO 3166-1 alpha-2 (e.g. 'US', 'IN', 'GB', 'AU', 'CA')
  subdivision?: string;        // State, Province, or Territory (e.g. 'CA', 'TN', 'NY', 'ON')
  municipality?: string;
}

/**
 * Complete verified practitioner credential profile.
 */
export interface ReviewerCredentialState {
  reviewerUserId: string;
  primaryLicenseNumber: string;
  licensingAuthority: StatutoryLicensingAuthority;
  jurisdiction: JurisdictionalContext;
  degree: ClinicalQualificationDegree;
  specialty: StatutorySpecialty;
  verificationStatus: CredentialVerificationStatus;
  verifiedAt: string;          // ISO 8601
  expiresAt: string;           // ISO 8601
  verifiedByUserId: string;
  proceduralPermits: StatutoryProceduralPermit[];
  disciplinarySanctionsActive: boolean;
}

// ----------------------------------------------------------------------
// 3. CLINICAL REVIEW LIFECYCLE & OUTCOMES
// ----------------------------------------------------------------------

/**
 * 15-stage lifecycle stages established in M5 workflow design.
 */
export type ClinicalReviewLifecycleStage =
  | 'STAGE_01_CONTENT_PREPARED'
  | 'STAGE_02_ELIGIBILITY_VALIDATION'
  | 'STAGE_03_CREDENTIAL_VERIFICATION'
  | 'STAGE_04_REVIEWER_ASSIGNMENT'
  | 'STAGE_05_COI_DECLARATION'
  | 'STAGE_06_INVITATION_ACCEPTANCE'
  | 'STAGE_07_CLINICAL_ASSESSMENT'
  | 'STAGE_08_FEEDBACK_REVISIONS'
  | 'STAGE_09_AUTHOR_RESUBMISSION'
  | 'STAGE_10_FINAL_DECISION'
  | 'STAGE_11_EVIDENCE_RECORDING'
  | 'STAGE_12_PUBLICATION_PREFLIGHT'
  | 'STAGE_13_PUBLICATION_AUTHORIZATION'
  | 'STAGE_14_PERIODIC_REASSESSMENT'
  | 'STAGE_15_APPROVAL_REVOCATION';

/**
 * Professional clinical decision outcomes submitted by assigned reviewers.
 */
export type ReviewOutcome =
  | 'APPROVED'
  | 'REVISION_REQUIRED'
  | 'REJECTED'
  | 'WITHDRAWN'
  | 'CONFLICT_OF_INTEREST'
  | 'REVIEWER_UNAVAILABLE';

/**
 * Standardized conflict-of-interest declaration.
 */
export interface ConflictOfInterestDeclaration {
  declarationId: string;
  reviewerUserId: string;
  procedureRevisionId: string;
  hasCommercialRelationship: boolean;
  commercialEntityNames?: string[];
  financialCompensationAmountUsd?: number;
  hasPersonalFinancialStake: boolean;
  agreesToConfidentiality: boolean;
  declaredAt: string;          // ISO 8601
  declarationSignatureHash: string; // SHA-256 digest
}

/**
 * Immutable clinical approval evidence record.
 */
export interface ClinicalApprovalEvidence {
  approvalId: string;
  procedureRevisionId: string;
  contentRevisionHash: string; // RFC 8785 canonical JSON hash
  reviewerUserId: string;
  reviewerLicenseNumber: string;
  reviewerSpecialty: StatutorySpecialty;
  decision: 'APPROVED';
  clinicalRationale: string;
  signedAt: string;            // ISO 8601
  isRevoked: boolean;
}

/**
 * Publication preflight gate validation result.
 */
export interface PublicationPreflightResult {
  procedureId: string;
  targetRevisionId: string;
  contentHashMatches: boolean;
  englishStatus: ContentStatus;
  tamilStatus: ContentStatus;
  activeApprovalsCount: number;
  quorumSatisfied: boolean;
  specialistRequirementSatisfied: boolean;
  bilingualSignOffSatisfied: boolean;
  mediaVerificationPassed: boolean;
  isEligibleForPublication: boolean;
  rejectionReasons: string[];
}

/**
 * Reviewer eligibility evaluation outcome.
 */
export interface ReviewerEligibilityResult {
  reviewerUserId: string;
  procedureTier: GovernanceTier;
  isEligible: boolean;
  credentialVerified: boolean;
  permitsVerified: boolean;
  coiCleared: boolean;
  isAuthorSelfApprovalBlocked: boolean;
  rejectionReasons: string[];
}

// ----------------------------------------------------------------------
// 4. POLICY PROVENANCE, RATIFICATION & ADAPTER TYPES
// ----------------------------------------------------------------------

/**
 * Classification of governance policies.
 */
export type PolicyClassification =
  | 'PREVIOUSLY_RATIFIED_POLICY'
  | 'EXISTING_TECHNICAL_INVARIANT'
  | 'PROPOSED_POLICY_REQUIRING_RATIFICATION'
  | 'JURISDICTION_DEPENDENT_REQUIREMENT'
  | 'TECHNICAL_RECOMMENDATION';

/**
 * Ratification status of a governance rule.
 */
export type PolicyRatificationStatus =
  | 'RATIFIED'
  | 'UNRATIFIED'
  | 'NON_BINDING_RECOMMENDATION';

/**
 * Complete provenance and version information for a policy rule.
 */
export interface PolicyProvenance {
  policyKey: string;
  version: string;
  classification: PolicyClassification;
  ratificationStatus: PolicyRatificationStatus;
  ratifiedAt?: string;             // ISO 8601
  ratifyingAuthority?: string;
  ratificationDocumentRef?: string;
  isJurisdictionSensitive: boolean;
  notes?: string;
}

/**
 * Typed policy container bundling evaluated value with its provenance.
 */
export interface RatifiedPolicy<T> {
  provenance: PolicyProvenance;
  value: T;
}

/**
 * Canonical policy keys evaluated by the PolicyConfigurationAdapter.
 */
export type GovernancePolicyKey =
  | 'governance:no_ai_signoff'
  | 'governance:author_separation'
  | 'governance:decoupled_media'
  | 'governance:sedation_permits'
  | 'governance:surgical_specialty'
  | 'publication:fail_closed_filter'
  | 'audit:immutability_triggers'
  | 'quorum:tier:TIER_1'
  | 'quorum:tier:TIER_2'
  | 'quorum:tier:TIER_3'
  | 'credential:verification_window'
  | 'sla:assignment_acceptance'
  | 'coi:commercial_threshold'
  | 'reassessment:tier:TIER_1'
  | 'reassessment:tier:TIER_2_3'
  | 'bilingual:tamil_signoff';

// ----------------------------------------------------------------------
// 5. GOVERNANCE AUDIT EVENT CLASSIFICATIONS
// ----------------------------------------------------------------------

export type GovernanceAuditEventType =
  | 'CRB_POLICY_EVALUATION'
  | 'CRB_REVIEWER_ELIGIBILITY_CHECK'
  | 'CRB_REVIEW_ASSIGNED'
  | 'CRB_REVIEW_ACCEPTED'
  | 'CRB_REVIEW_SUBMITTED'
  | 'CRB_CREDENTIAL_VERIFIED'
  | 'CRB_COI_DECLARED'
  | 'CRB_PREFLIGHT_EXECUTED'
  | 'CRB_PUBLICATION_AUTHORIZED'
  | 'CRB_APPROVAL_REVOKED'
  | 'CRB_UNAUTHORIZED_ACCESS_BLOCKED'
  | 'CRB_UNRATIFIED_POLICY_REJECTED';
