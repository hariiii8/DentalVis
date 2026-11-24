// packages/database/src/governance/types.ts
// DentalVis — Server-Only Governance Authorization & Policy Types
// Architecture Baseline v1.9.1 (FROZEN) — Milestone M6.1.3

import type {
  ApplicationUserRole,
  CRBRole,
  GovernancePermissionScope,
  GovernanceTier,
  JurisdictionalContext,
  ReviewerCredentialState,
  StatutorySpecialty,
} from '@dentalvis/common';

/**
 * Three-state typed authorization decision contract.
 *
 * CRITICAL INVARIANT:
 * - ALLOW: All security, session, role, scope, invariant, and clinical checks have passed.
 * - DENY: One or more authorization checks failed. Operation blocked fail-closed.
 * - REQUIRES_VERIFICATION: A mandatory verification step remains incomplete.
 *   This is STRICTLY NON-AUTHORIZING. It must never allow privileged actions,
 *   never bypass guards, and never be coerced into ALLOW.
 */
export type AuthorizationDecision =
  | 'ALLOW'
  | 'DENY'
  | 'REQUIRES_VERIFICATION';

/**
 * Explicit, sanitized denial reasons.
 * Emitted without leaking database internals, credentials, tokens, or personal data.
 */
export type AuthorizationDenialReason =
  | 'UNAUTHENTICATED'
  | 'SESSION_EXPIRED'
  | 'SESSION_REVOKED'
  | 'SESSION_SUPERSEDED'
  | 'SESSION_FAMILY_REVOKED'
  | 'USER_DEACTIVATED'
  | 'ROLE_INCOMPATIBLE'
  | 'SCOPE_NOT_GRANTED'
  | 'AUTHOR_SELF_APPROVAL_PROHIBITED'
  | 'CLINICALLY_INELIGIBLE'
  | 'MISSING_JURISDICTION_CONTEXT'
  | 'UNRATIFIED_MANDATORY_POLICY'
  | 'PROCEDURAL_PERMIT_REQUIRED'
  | 'SPECIALTY_MISMATCH'
  | 'CREDENTIAL_VERIFICATION_REQUIRED'
  | 'INTERNAL_SECURITY_ERROR';

/**
 * Authenticated actor context resolved from server-side session.
 */
export interface AuthorizationActor {
  userId: string;
  applicationRole: ApplicationUserRole;
  crbRole: CRBRole;
  sessionId: string;
  sessionFamilyId: string;
}

/**
 * Context payload for evaluating an authorization request.
 */
export interface AuthorizationRequest {
  actor?: AuthorizationActor;
  sessionTokenHash?: string;
  requestedScope: GovernancePermissionScope;
  targetProcedureId?: string;
  targetRevisionId?: string;
  targetAuthorId?: string;
  procedureTier?: GovernanceTier;
  procedureSpecialtyRequirement?: StatutorySpecialty;
  jurisdiction?: JurisdictionalContext;
  reviewerCredentials?: ReviewerCredentialState;
}

/**
 * Immutable authorization outcome.
 */
export interface AuthorizationResult {
  decision: AuthorizationDecision;
  actorUserId?: string;
  requestedScope: GovernancePermissionScope;
  denialReason?: AuthorizationDenialReason;
  diagnosticMessage?: string; // Sanitized; safe for logging
  evaluatedAt: string;        // ISO 8601
}
