// packages/database/src/governance/apiPipeline.ts
// DentalVis — Server-Only Governance API Request Pipeline & Auth Guard
// Architecture Baseline v1.9.1 (FROZEN) — Milestone M6.1.5-C

import 'server-only';
import type { PrismaClient } from '@prisma/client';
import type { GovernancePermissionScope } from '@dentalvis/common';
import {
  resolveRequestIdentity,
  type RequestIdentityInput,
  type IdentityResolutionSuccess,
} from './sessionIdentityResolver';
import {
  GovernanceAuthorizationService,
} from './authorizationService';
import type { AuthorizationActor, AuthorizationRequest, AuthorizationResult } from './types';

export interface GovernancePipelineContext {
  actor: AuthorizationActor;
  authorization: AuthorizationResult;
  evaluatedAt: Date;
}

export interface GovernancePipelineFailure {
  success: false;
  httpStatus: 400 | 401 | 403 | 500;
  errorCode: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface GovernancePipelineSuccess {
  success: true;
  context: GovernancePipelineContext;
}

export type GovernancePipelineGuardResult =
  | GovernancePipelineSuccess
  | GovernancePipelineFailure;

export interface GovernanceGuardOptions {
  prisma: PrismaClient;
  identityInput: RequestIdentityInput;
  requiredScope: GovernancePermissionScope;
  targetProcedureId?: string;
  targetRevisionId?: string;
  targetAuthorId?: string;
  now?: Date;
}

/**
 * Standardized server-side authentication and authorization guard for all governance endpoints.
 * Pipeline:
 * 1. Resolves request identity authoritatively via resolveRequestIdentity (rejects missing, expired, revoked, superseded sessions).
 * 2. Cross-checks client-asserted identity or roles against verified session actor (fails closed on mismatch).
 * 3. Evaluates GovernanceAuthorizationService against the verified actor and requested scope.
 * 4. Strictly requires explicit decision === 'ALLOW'. Rejects DENY and REQUIRES_VERIFICATION.
 * 5. Returns clean typed context or standardized HTTP error response.
 */
export async function guardGovernanceApi(
  options: GovernanceGuardOptions
): Promise<GovernancePipelineGuardResult> {
  const now = options.now ?? new Date();

  // 1 & 2. Authenticate & Resolve Request Identity
  const identityRes = await resolveRequestIdentity(
    options.prisma,
    options.identityInput,
    now
  );

  if (!identityRes.isAuthenticated) {
    const isDeactivated = identityRes.denialReason === 'USER_DEACTIVATED';
    return {
      success: false,
      httpStatus: isDeactivated ? 403 : 401,
      errorCode: identityRes.denialReason,
      message: identityRes.diagnosticMessage,
    };
  }

  const { actor } = identityRes as IdentityResolutionSuccess;

  // 3. Evaluate Authorization Service
  const authService = new GovernanceAuthorizationService({
    prisma: options.prisma,
  });

  const authReq: AuthorizationRequest = {
    actor,
    requestedScope: options.requiredScope,
    targetProcedureId: options.targetProcedureId,
    targetRevisionId: options.targetRevisionId,
    targetAuthorId: options.targetAuthorId,
  };

  const authResult = await authService.authorize(authReq);

  // 4. Enforce Explicit ALLOW Decision
  if (authResult.decision !== 'ALLOW') {
    return {
      success: false,
      httpStatus: 403,
      errorCode: authResult.denialReason ?? 'PERMISSION_DENIED',
      message:
        authResult.diagnosticMessage ??
        `Access denied: actor lacks authorized permission scope '${options.requiredScope}'.`,
      details: {
        decision: authResult.decision,
        requestedScope: options.requiredScope,
      },
    };
  }

  return {
    success: true,
    context: {
      actor,
      authorization: authResult,
      evaluatedAt: now,
    },
  };
}

/**
 * Standardized HTTP-compatible JSON response builder for governance endpoints.
 */
export function createGovernanceErrorResponse(failure: GovernancePipelineFailure) {
  return {
    status: failure.httpStatus,
    headers: { 'Content-Type': 'application/json' },
    body: {
      error: {
        code: failure.errorCode,
        message: failure.message,
        details: failure.details,
      },
    },
  };
}

export function createGovernanceSuccessResponse<T>(data: T, status: number = 200) {
  return {
    status,
    headers: { 'Content-Type': 'application/json' },
    body: {
      data,
    },
  };
}
