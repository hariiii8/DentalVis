// packages/database/src/governance/authorizationService.ts
// DentalVis — Server-Only Governance Authorization Service (RBAC & Invariant Evaluator)
// Architecture Baseline v1.9.1 (FROZEN) — Milestone M6.1.3

import 'server-only';
import type { PrismaClient } from '@prisma/client';
import type {
  CRBRole,
  GovernancePermissionScope,
  StatutoryProceduralPermit,
} from '@dentalvis/common';
import { PolicyConfigurationAdapter } from './policyAdapter';
import { UnratifiedGovernancePolicyError, MissingJurisdictionContextError } from './errors';
import {
  validateAuthoritativeSession,
  SessionValidationResult,
} from './sessionValidator';
import type {
  AuthorizationActor,
  AuthorizationRequest,
  AuthorizationResult,
  AuthorizationDenialReason,
} from './types';

/**
 * Strict permission scopes assigned to each CRB governance operational role.
 * Enforces:
 * - Independent Auditor is strictly read-only.
 * - CRB Chair cannot authorize publication.
 * - Publication Admin cannot submit clinical reviews or revoke approvals.
 * - Content Author cannot review or publish.
 */
export const ROLE_PERMISSION_MATRIX: Readonly<Record<CRBRole, readonly GovernancePermissionScope[]>> = {
  CONTENT_AUTHOR: ['crb:dossier:draft', 'crb:dossier:read'],
  CLINICAL_REVIEWER: [
    'crb:dossier:read',
    'crb:review:accept',
    'crb:review:assess',
    'crb:review:submit',
    'crb:coi:audit',
  ],
  SPECIALIST_REVIEWER: [
    'crb:dossier:read',
    'crb:review:accept',
    'crb:review:assess',
    'crb:review:submit',
    'crb:coi:audit',
  ],
  CRB_CHAIR: [
    'crb:dossier:read',
    'crb:review:assign',
    'crb:approval:revoke',
    'crb:policy:read',
    'crb:audit:read',
  ],
  GOVERNANCE_ADMIN: [
    'crb:dossier:read',
    'crb:credential:verify',
    'crb:coi:audit',
    'crb:policy:read',
    'crb:audit:read',
  ],
  PUBLICATION_ADMIN: [
    'crb:dossier:read',
    'crb:publish:authorize',
    'crb:policy:read',
    'crb:audit:read',
  ],
  INDEPENDENT_AUDITOR: [
    'crb:dossier:read',
    'crb:policy:read',
    'crb:audit:read',
  ],
};

/**
 * Server-only governance authorization service.
 * Enforces zero-trust default-deny authorization based on authoritative session state,
 * role-permission matrix, author self-approval prohibition, clinical eligibility evidence,
 * and fail-closed policy integration.
 */
export class GovernanceAuthorizationService {
  private readonly prisma?: PrismaClient;
  private readonly policyAdapter: PolicyConfigurationAdapter;

  constructor(options?: {
    prisma?: PrismaClient;
    policyAdapter?: PolicyConfigurationAdapter;
  }) {
    this.prisma = options?.prisma;
    this.policyAdapter = options?.policyAdapter ?? new PolicyConfigurationAdapter();
  }

  /**
   * Main authorization evaluator.
   */
  public async authorize(
    request: AuthorizationRequest,
    evaluationTime: Date = new Date()
  ): Promise<AuthorizationResult> {
    const evaluatedAt = evaluationTime.toISOString();
    const { requestedScope } = request;

    // ------------------------------------------------------------------
    // 1. Identity & Authoritative Session Validation
    // ------------------------------------------------------------------
    let actor: AuthorizationActor;

    if (request.sessionTokenHash) {
      if (!this.prisma) {
        return this.deny(
          'INTERNAL_SECURITY_ERROR',
          requestedScope,
          evaluatedAt,
          'Prisma client not configured for session token lookup.'
        );
      }

      const sessionResult: SessionValidationResult = await validateAuthoritativeSession(
        this.prisma,
        request.sessionTokenHash,
        evaluationTime
      );

      if (!sessionResult.isValid) {
        return this.deny(
          sessionResult.denialReason,
          requestedScope,
          evaluatedAt,
          sessionResult.diagnosticMessage
        );
      }

      actor = sessionResult.actor;
    } else if (request.actor) {
      // Actor provided directly (e.g. from upstream authenticated gateway)
      actor = request.actor;
    } else {
      return this.deny(
        'UNAUTHENTICATED',
        requestedScope,
        evaluatedAt,
        'No session token hash or actor context provided.'
      );
    }

    // Explicit check on actor user ID
    if (!actor.userId || actor.userId.trim() === '') {
      return this.deny(
        'UNAUTHENTICATED',
        requestedScope,
        evaluatedAt,
        'Actor userId is missing or empty.'
      );
    }

    // ------------------------------------------------------------------
    // 2. Role-Permission Matrix & Scope Authorization
    // ------------------------------------------------------------------
    const permittedScopes = ROLE_PERMISSION_MATRIX[actor.crbRole];
    if (!permittedScopes || !permittedScopes.includes(requestedScope)) {
      return this.deny(
        'SCOPE_NOT_GRANTED',
        requestedScope,
        evaluatedAt,
        `Role '${actor.crbRole}' does not hold scope '${requestedScope}'.`,
        actor.userId
      );
    }

    // ------------------------------------------------------------------
    // 3. Ethical & Architectural Invariants: Author / Reviewer Separation
    // ------------------------------------------------------------------
    if (
      requestedScope === 'crb:review:submit' ||
      requestedScope === 'crb:review:assess' ||
      requestedScope === 'crb:review:accept'
    ) {
      if (request.targetAuthorId && request.targetAuthorId === actor.userId) {
        return this.deny(
          'AUTHOR_SELF_APPROVAL_PROHIBITED',
          requestedScope,
          evaluatedAt,
          'Clinical authors are strictly prohibited from reviewing or approving their own content revisions.',
          actor.userId
        );
      }
    }

    // ------------------------------------------------------------------
    // 4. Clinical Eligibility & Scope-Specific Evidence Evaluation
    // ------------------------------------------------------------------
    if (
      requestedScope === 'crb:review:submit' ||
      requestedScope === 'crb:review:assess'
    ) {
      const eligibilityResult = this.evaluateClinicalEligibility(
        request,
        actor,
        evaluatedAt
      );

      if (eligibilityResult.decision !== 'ALLOW') {
        return eligibilityResult;
      }
    }

    // ------------------------------------------------------------------
    // 5. Policy Adapter Invariant Gating
    // ------------------------------------------------------------------
    if (requestedScope === 'crb:publish:authorize') {
      try {
        const publicationPolicy = this.policyAdapter.getPublicationFilterPolicy();
        if (!publicationPolicy.value.requiresPublishedStatus) {
          return this.deny(
            'UNRATIFIED_MANDATORY_POLICY',
            requestedScope,
            evaluatedAt,
            'Publication filter invariant check failed.',
            actor.userId
          );
        }
      } catch (err) {
        return this.handlePolicyError(err, requestedScope, evaluatedAt, actor.userId);
      }
    }

    // All mandatory checks passed cleanly
    return {
      decision: 'ALLOW',
      actorUserId: actor.userId,
      requestedScope,
      evaluatedAt,
    };
  }

  /**
   * Evaluates clinical review eligibility without universal hardcoding.
   * Strictly non-authorizing REQUIRES_VERIFICATION if verification is incomplete.
   */
  private evaluateClinicalEligibility(
    request: AuthorizationRequest,
    actor: AuthorizationActor,
    evaluatedAt: string
  ): AuthorizationResult {
    const { reviewerCredentials, requestedScope, jurisdiction } = request;

    // AI Check: verify policy that AI cannot sign off and human practitioner must be authenticated
    try {
      const aiPolicy = this.policyAdapter.getAiSignOffPolicy();
      if (!aiPolicy.value.mandatesAuthenticatedHumanReviewer) {
        return this.deny(
          'UNRATIFIED_MANDATORY_POLICY',
          requestedScope,
          evaluatedAt,
          'AI clinical sign-off policy is corrupted.',
          actor.userId
        );
      }
    } catch (err) {
      return this.handlePolicyError(err, requestedScope, evaluatedAt, actor.userId);
    }

    // Missing reviewer credentials entirely
    if (!reviewerCredentials) {
      return this.requiresVerification(
        requestedScope,
        evaluatedAt,
        'Reviewer credential verification record is missing.',
        actor.userId
      );
    }

    // Check verification status
    if (reviewerCredentials.verificationStatus === 'UNVERIFIED') {
      return this.requiresVerification(
        requestedScope,
        evaluatedAt,
        'Reviewer credentials are not yet verified.',
        actor.userId
      );
    }

    if (
      reviewerCredentials.verificationStatus === 'EXPIRED' ||
      reviewerCredentials.verificationStatus === 'REVOKED_OR_SUSPENDED' ||
      reviewerCredentials.verificationStatus === 'SANCTIONED'
    ) {
      return this.deny(
        'CLINICALLY_INELIGIBLE',
        requestedScope,
        evaluatedAt,
        `Reviewer credentials are ${reviewerCredentials.verificationStatus.toLowerCase()}.`,
        actor.userId
      );
    }

    if (reviewerCredentials.disciplinarySanctionsActive) {
      return this.deny(
        'CLINICALLY_INELIGIBLE',
        requestedScope,
        evaluatedAt,
        'Reviewer has active disciplinary sanctions.',
        actor.userId
      );
    }

    // Context-sensitive procedure scope check: Surgical Specialty
    if (request.procedureSpecialtyRequirement) {
      if (reviewerCredentials.specialty !== request.procedureSpecialtyRequirement) {
        return this.deny(
          'SPECIALTY_MISMATCH',
          requestedScope,
          evaluatedAt,
          `Procedure requires specialty '${request.procedureSpecialtyRequirement}' but reviewer possesses '${reviewerCredentials.specialty}'.`,
          actor.userId
        );
      }
    }

    // Sedation Procedures: requires jurisdiction-sensitive permit evaluation
    if (request.procedureTier === 'TIER_2' || request.procedureTier === 'TIER_3') {
      const isSedationProcedure =
        request.targetProcedureId?.includes('sedation') ||
        request.targetProcedureId?.includes('48') ||
        request.targetProcedureId?.includes('49');

      if (isSedationProcedure) {
        if (!jurisdiction || !jurisdiction.country) {
          return this.deny(
            'MISSING_JURISDICTION_CONTEXT',
            requestedScope,
            evaluatedAt,
            'Sedation procedure review requires explicit jurisdictional context.',
            actor.userId
          );
        }

        try {
          const sedationPolicy = this.policyAdapter.getSedationPolicy(jurisdiction);
          if (sedationPolicy.value.requiresProceduralPermits) {
            const hasRequiredPermit = reviewerCredentials.proceduralPermits.some((permit: StatutoryProceduralPermit) =>
              sedationPolicy.value.recognizedPermits.includes(permit)
            );

            if (!hasRequiredPermit) {
              return this.deny(
                'PROCEDURAL_PERMIT_REQUIRED',
                requestedScope,
                evaluatedAt,
                'Reviewer lacks required statutory procedural permit for sedation procedure.',
                actor.userId
              );
            }
          }
        } catch (err) {
          return this.handlePolicyError(err, requestedScope, evaluatedAt, actor.userId);
        }
      }
    }

    return {
      decision: 'ALLOW',
      actorUserId: actor.userId,
      requestedScope,
      evaluatedAt,
    };
  }

  private deny(
    denialReason: AuthorizationDenialReason,
    requestedScope: GovernancePermissionScope,
    evaluatedAt: string,
    diagnosticMessage?: string,
    actorUserId?: string
  ): AuthorizationResult {
    return {
      decision: 'DENY',
      actorUserId,
      requestedScope,
      denialReason,
      diagnosticMessage,
      evaluatedAt,
    };
  }

  private requiresVerification(
    requestedScope: GovernancePermissionScope,
    evaluatedAt: string,
    diagnosticMessage: string,
    actorUserId?: string
  ): AuthorizationResult {
    return {
      decision: 'REQUIRES_VERIFICATION',
      actorUserId,
      requestedScope,
      denialReason: 'CREDENTIAL_VERIFICATION_REQUIRED',
      diagnosticMessage,
      evaluatedAt,
    };
  }

  private handlePolicyError(
    err: unknown,
    requestedScope: GovernancePermissionScope,
    evaluatedAt: string,
    actorUserId?: string
  ): AuthorizationResult {
    if (err instanceof UnratifiedGovernancePolicyError) {
      return this.deny(
        'UNRATIFIED_MANDATORY_POLICY',
        requestedScope,
        evaluatedAt,
        err.message,
        actorUserId
      );
    }
    if (err instanceof MissingJurisdictionContextError) {
      return this.deny(
        'MISSING_JURISDICTION_CONTEXT',
        requestedScope,
        evaluatedAt,
        err.message,
        actorUserId
      );
    }
    return this.deny(
      'INTERNAL_SECURITY_ERROR',
      requestedScope,
      evaluatedAt,
      'Internal policy configuration error during authorization.',
      actorUserId
    );
  }
}
