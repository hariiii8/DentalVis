// packages/database/src/governance/interfaces.ts
// DentalVis — M6.1.4 Core Governance Service Contracts & Repository Interfaces
// Architecture Baseline v1.9.1 (FROZEN) — Milestone M6.1.4

import 'server-only';
import type {
  JurisdictionalContext,
  StatutoryProceduralPermit,
  StatutorySpecialty,
} from '@dentalvis/common';
import type { Prisma, ApprovalDecision } from '@prisma/client';

// ----------------------------------------------------------------------
// 1. REASON CODES & ERROR IDENTIFIERS
// ----------------------------------------------------------------------

export type EligibilityDenialReason =
  | 'REVIEWER_NOT_FOUND'
  | 'REVIEWER_INACTIVE'
  | 'REVISION_NOT_FOUND'
  | 'AUTHOR_SELF_REVIEW_PROHIBITED'
  | 'INSUFFICIENT_ROLE_CAPABILITY'
  | 'CREDENTIALS_MISSING'
  | 'CREDENTIALS_EXPIRED'
  | 'CREDENTIALS_UNVERIFIED'
  | 'CREDENTIALS_SANCTIONED'
  | 'SPECIALTY_MISMATCH'
  | 'PROCEDURAL_PERMIT_MISSING'
  | 'COI_DECLARATION_MISSING'
  | 'COI_DECLARATION_EXPIRED'
  | 'COI_CONFLICT_DECLARED'
  | 'COI_REVIEWER_RECUSED'
  | 'COI_REPOSITORY_UNAVAILABLE'
  | 'UNRESOLVED_PROCEDURE_METADATA'
  | 'POLICY_UNRATIFIED'
  | 'POLICY_MISSING'
  | 'POLICY_MALFORMED'
  | 'INTERNAL_ELIGIBILITY_ERROR';

export type ReviewSubmissionDenialReason =
  | 'AUTHORIZATION_DENIED'
  | 'AUTHORIZATION_REQUIRES_VERIFICATION'
  | 'AUTHORIZATION_CONTEXT_INVALID'
  | 'AUTHOR_SELF_APPROVAL_PROHIBITED'
  | 'REVISION_NOT_FOUND'
  | 'REVISION_STATE_INVALID'
  | 'CONTENT_INTEGRITY_MISMATCH'
  | 'ASSIGNMENT_MISSING'
  | 'ASSIGNMENT_WRONG_REVIEWER'
  | 'ASSIGNMENT_WRONG_REVISION'
  | 'ASSIGNMENT_NOT_ACCEPTED'
  | 'ASSIGNMENT_EXPIRED'
  | 'ASSIGNMENT_REVOKED'
  | 'ASSIGNMENT_WITHDRAWN'
  | 'ASSIGNMENT_ALREADY_COMPLETED'
  | 'ASSIGNMENT_REPOSITORY_UNAVAILABLE'
  | 'REVIEWER_INELIGIBLE'
  | 'DUPLICATE_REVIEW_SUBMISSION'
  | 'AUDIT_RECORDING_FAILED'
  | 'TRANSACTION_CONCURRENCY_EXHAUSTED'
  | 'INTERNAL_REVIEW_ERROR';

export type PreflightBlockingReason =
  | 'REVISION_NOT_FOUND'
  | 'REVISION_STATUS_INVALID'
  | 'CONTENT_HASH_MISMATCH'
  | 'MISSING_AUTHOR_METADATA'
  | 'QUORUM_NOT_MET'
  | 'QUORUM_POLICY_UNRATIFIED'
  | 'QUORUM_POLICY_MISSING'
  | 'APPROVAL_REVOKED'
  | 'INSUFFICIENT_VALID_APPROVALS'
  | 'AUTHOR_REVIEWER_OVERLAP'
  | 'SPECIALIST_REQUIREMENT_UNMET'
  | 'TARGET_LANGUAGE_TRANSLATION_MISSING'
  | 'TARGET_LANGUAGE_INCOMPLETE'
  | 'MEDIA_ASSET_UNVERIFIED'
  | 'MEDIA_ASSET_CHECKSUM_MISMATCH'
  | 'AI_CLINICAL_SIGNOFF_DETECTED'
  | 'GOVERNANCE_POLICY_VIOLATION';

// ----------------------------------------------------------------------
// 2. CONFLICT OF INTEREST (COI) CONTRACTS
// ----------------------------------------------------------------------

export type CoiDeclarationStatus =
  | 'SUBMITTED'
  | 'VERIFIED_CLEAR'
  | 'CONFLICT_DECLARED'
  | 'RECUSED'
  | 'EXPIRED'
  | 'SUPERSEDED';

export interface AuthoritativeCoiRecord {
  id: string;
  userId: string;
  targetProcedureId?: string | null;
  targetRevisionId?: string | null;
  status: CoiDeclarationStatus;
  hasFinancialInterest: boolean;
  hasInstitutionalAffiliation: boolean;
  hasAuthorRelationship: boolean;
  hasCommercialSponsorship: boolean;
  conflictDetails?: string | null;
  isRecused: boolean;
  recusalReason?: string | null;
  declaredAt: Date;
  expiresAt: Date;
  supersededById?: string | null;
  assessedByAdminId?: string | null;
  assessedAt?: Date | null;
}

export interface ICoiRepository {
  getActiveDeclaration(
    userId: string,
    context?: { procedureId?: string; revisionId?: string },
    asOf?: Date
  ): Promise<AuthoritativeCoiRecord | null>;
  isPersistenceHealthy(): Promise<boolean>;
}

// ----------------------------------------------------------------------
// 3. REVIEWER ASSIGNMENT CONTRACTS
// ----------------------------------------------------------------------

export type AssignmentLifecycleStatus =
  | 'ASSIGNED'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'WITHDRAWN'
  | 'REVOKED'
  | 'EXPIRED'
  | 'COMPLETED';

export interface AuthoritativeAssignmentRecord {
  id: string;
  revisionId: string;
  reviewerId: string;
  assignedByAdminId: string;
  status: AssignmentLifecycleStatus;
  assignedAt: Date;
  acceptedAt?: Date | null;
  completedAt?: Date | null;
  revokedAt?: Date | null;
  revocationReason?: string | null;
  withdrawnAt?: Date | null;
  withdrawalReason?: string | null;
  expiresAt: Date;
}

export interface IAssignmentRepository {
  getAssignment(
    assignmentId: string,
    tx?: Prisma.TransactionClient
  ): Promise<AuthoritativeAssignmentRecord | null>;
  getActiveAcceptedAssignment(
    revisionId: string,
    reviewerId: string,
    asOf?: Date,
    tx?: Prisma.TransactionClient
  ): Promise<AuthoritativeAssignmentRecord | null>;
  markAssignmentCompleted(
    assignmentId: string,
    completedAt: Date,
    tx?: Prisma.TransactionClient
  ): Promise<void>;
  isPersistenceHealthy(): Promise<boolean>;
}

// ----------------------------------------------------------------------
// 4. REVIEWER ELIGIBILITY TYPES
// ----------------------------------------------------------------------

export interface ClinicalProcedureContext {
  procedureId: string;
  revisionId: string;
  authorId: string;
  category?: string;
  involvesSedation?: boolean;
  sedationLevel?: 'MINIMAL' | 'MODERATE' | 'DEEP' | 'GENERAL_ANESTHESIA';
  surgicalInvasiveness?: 'NON_INVASIVE' | 'MINIMALLY_INVASIVE' | 'SURGICAL';
  primarySpecialty?: StatutorySpecialty;
  jurisdiction?: JurisdictionalContext;
}

export interface ReviewerCredentialsInput {
  reviewerUserId: string;
  licenseNumber: string;
  clinicalSpecialty: StatutorySpecialty | string;
  jurisdiction?: JurisdictionalContext;
  proceduralPermits?: StatutoryProceduralPermit[];
  isStatutoryLicenseVerified?: boolean;
  licenseExpiresAt?: Date;
  hasActiveSanctions?: boolean;
}

export interface ReviewerEligibilityResult {
  isEligible: boolean;
  reviewerId: string;
  procedureId: string;
  revisionId: string;
  matchedSpecialty?: string;
  hasValidLicense: boolean;
  hasRequiredPermits: boolean;
  coiState: 'CLEAR' | 'RECUSED' | 'CONFLICT_DECLARED' | 'EXPIRED' | 'MISSING' | 'UNVERIFIED';
  denialReasons: EligibilityDenialReason[];
  evaluatedPolicies: Record<string, string>;
  evaluatedAt: string; // ISO 8601
}

export interface IReviewerEligibilityService {
  evaluateEligibility(
    reviewer: ReviewerCredentialsInput,
    procedure: ClinicalProcedureContext,
    options?: { evaluationTime?: Date }
  ): Promise<ReviewerEligibilityResult>;
}

// ----------------------------------------------------------------------
// 5. GOVERNANCE AUDIT TYPES
// ----------------------------------------------------------------------

export type GovernanceAuditEventAction =
  | 'REVIEWER_ELIGIBILITY_EVALUATED'
  | 'REVIEW_SUBMITTED'
  | 'APPROVAL_REVOKED'
  | 'AUTHORIZATION_DENIED'
  | 'COI_DECLARATION_RECORDED'
  | 'ASSIGNMENT_STATUS_CHANGED'
  | 'PREFLIGHT_VERIFICATION_CHECKED';

export interface EmitAuditEventInput {
  action: GovernanceAuditEventAction | string;
  actorId: string;
  sessionId?: string;
  targetType: string;
  targetId: string;
  payload: Record<string, unknown>;
  ipHash?: string;
  userAgent?: string;
}

export interface AuditVerificationRecord {
  id: string;
  action: string;
  createdAt: Date;
  actorId: string;
  targetType: string;
  targetId: string;
  payloadHash: string;
  isIntegrityVerified: boolean;
}

export interface IGovernanceAuditService {
  emitAuditEvent(
    input: EmitAuditEventInput,
    tx?: Prisma.TransactionClient
  ): Promise<{ auditId: string; payloadHash: string }>;
  verifyAuditIntegrity(auditId: string): Promise<AuditVerificationRecord>;
}

// ----------------------------------------------------------------------
// 6. CLINICAL REVIEW SERVICE TYPES
// ----------------------------------------------------------------------

export interface SubmitClinicalReviewInput {
  revisionId: string;
  assignmentId: string;
  reviewerId: string;
  sessionTokenHash: string;
  decision: ApprovalDecision; // 'APPROVED' | 'REJECTED'
  clinicalNotes?: string;
  reviewerCredentials: ReviewerCredentialsInput;
  ipHash?: string;
  userAgent?: string;
}

export interface SubmitClinicalReviewResult {
  success: boolean;
  approvalId?: string;
  revisionId: string;
  decision: ApprovalDecision;
  revisionStatus: string;
  quorumSatisfied: boolean;
  auditLogId?: string;
  denialReason?: ReviewSubmissionDenialReason;
  diagnosticMessage?: string;
  submittedAt: string;
}

export interface RevokeClinicalApprovalInput {
  approvalId: string;
  revokingAdminId: string;
  adminSessionTokenHash: string;
  reason: string;
  ipHash?: string;
  userAgent?: string;
}

export interface RevokeClinicalApprovalResult {
  success: boolean;
  revocationId?: string;
  approvalId: string;
  revisionId?: string;
  previousRevisionStatus?: string;
  updatedRevisionStatus?: string;
  auditLogId?: string;
  denialReason?: string;
}

export interface IClinicalReviewService {
  submitReview(input: SubmitClinicalReviewInput): Promise<SubmitClinicalReviewResult>;
  revokeApproval(input: RevokeClinicalApprovalInput): Promise<RevokeClinicalApprovalResult>;
}

// ----------------------------------------------------------------------
// 7. PUBLICATION PREFLIGHT SERVICE TYPES
// ----------------------------------------------------------------------

export interface PublicationPreflightCriteria {
  revisionId: string;
  targetLanguage?: 'en' | 'ta';
  requireMediaChecksumVerification?: boolean;
}

export interface PublicationPreflightResult {
  passed: boolean;
  revisionId: string;
  procedureId: string;
  contentHashVerified: boolean;
  calculatedContentHash: string;
  storedContentHash: string;
  approvalsSummary: {
    totalValidApprovals: number;
    quorumSatisfied: boolean;
    quorumPolicyKey?: string;
    approvers: Array<{
      reviewerId: string;
      clinicalSpecialty: string;
      licenseNumber: string;
      decision: ApprovalDecision;
      signedAt: Date;
    }>;
  };
  specialistMatch: {
    matched: boolean;
    requiredSpecialty?: string;
    specialistReviewerId?: string;
  };
  translationSummary?: {
    language: 'en' | 'ta';
    isComplete: boolean;
    currentStatus: string;
  };
  mediaVerification: {
    totalAssets: number;
    allAssetsValid: boolean;
    unverifiedAssets: string[];
  };
  blockingReasons: PreflightBlockingReason[];
  unresolvedPolicies: string[];
  missingPrerequisites: string[];
  verifiedAt: string;
}

export interface IPublicationPreflightService {
  runPreflight(criteria: PublicationPreflightCriteria): Promise<PublicationPreflightResult>;
}
