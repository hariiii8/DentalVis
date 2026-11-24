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
  /**
   * Request context for CSRF and Origin validation (SEC-C-01 hardening).
   */
  requestContext?: {
    method?: string;
    authScheme?: 'bearer' | 'cookie' | null;
    origin?: string | null;
    referer?: string | null;
    host?: string | null;
    trustedOrigins?: string[];
  };
}

/**
 * Standardized server-side authentication and authorization guard for all governance endpoints.
 * Pipeline:
 * 1. CSRF Origin Verification: If a state-changing mutation (POST/PUT/PATCH/DELETE) uses ambient
 *    cookie authentication, verifies the Origin/Referer against trusted origins and Host header.
 *    Fails closed (403 CSRF_ORIGIN_DENIED) on missing, mismatched, or untrusted cross-origin requests.
 * 2. Resolves request identity authoritatively via resolveRequestIdentity (rejects missing, expired, revoked, superseded sessions).
 * 3. Cross-checks client-asserted identity or roles against verified session actor (fails closed on mismatch).
 * 4. Evaluates GovernanceAuthorizationService against the verified actor and requested scope.
 * 5. Strictly requires explicit decision === 'ALLOW'. Rejects DENY and REQUIRES_VERIFICATION.
 * 6. Returns clean typed context or standardized HTTP error response.
 */
export async function guardGovernanceApi(
  options: GovernanceGuardOptions
): Promise<GovernancePipelineGuardResult> {
  const now = options.now ?? new Date();

  // 1. CSRF & Cross-Origin Verification for State-Changing Mutations (SEC-C-01)
  if (options.requestContext) {
    const { method = 'GET', authScheme, origin, referer, host, trustedOrigins = [] } = options.requestContext;
    const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase());

    // If request uses cookie authentication for a mutation, strictly enforce Origin/Referer check
    if (isMutation && authScheme === 'cookie') {
      const allowedOrigins = new Set<string>();

      // Host-based origin
      if (host) {
        allowedOrigins.add(`http://${host}`);
        allowedOrigins.add(`https://${host}`);
      }

      // Explicit trusted origins from environment or config
      for (const to of trustedOrigins) {
        if (to) allowedOrigins.add(to.trim().replace(/\/$/, ''));
      }

      // Fallback default local origins for dev/test
      if (process.env.NODE_ENV !== 'production') {
        allowedOrigins.add('http://localhost:3000');
        allowedOrigins.add('http://127.0.0.1:3000');
        allowedOrigins.add('http://localhost:3001');
        allowedOrigins.add('http://127.0.0.1:3001');
      }

      let requestOrigin = origin ? origin.trim().replace(/\/$/, '') : null;
      if (!requestOrigin && referer) {
        try {
          const u = new URL(referer);
          requestOrigin = `${u.protocol}//${u.host}`;
        } catch {
          requestOrigin = null;
        }
      }

      if (!requestOrigin || !allowedOrigins.has(requestOrigin)) {
        return {
          success: false,
          httpStatus: 403,
          errorCode: 'CSRF_ORIGIN_DENIED',
          message: 'Cross-site request forgery protection: Origin or Referer missing, invalid, or untrusted.',
          details: {
            reason: !requestOrigin ? 'MISSING_ORIGIN_AND_REFERER' : 'UNTRUSTED_CROSS_ORIGIN',
            origin: requestOrigin,
          },
        };
      }
    }
  }

  // 2. Authenticate & Resolve Request Identity
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

export function extractGovernanceSessionCredentials(req: {
  headers: { get: (name: string) => string | null };
  cookies: { get: (name: string) => { value: string } | undefined };
}): {
  tokenHash: string | null;
  authScheme: 'bearer' | 'cookie' | null;
} {
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
    return {
      tokenHash: authHeader.substring(7).trim(),
      authScheme: 'bearer',
    };
  }
  const cookie = req.cookies.get('dentalvis_session_token');
  if (cookie && cookie.value.trim() !== '') {
    return {
      tokenHash: cookie.value.trim(),
      authScheme: 'cookie',
    };
  }
  return {
    tokenHash: null,
    authScheme: null,
  };
}

export function extractGovernanceRequestContext(req: {
  method?: string;
  headers: { get: (name: string) => string | null };
  cookies: { get: (name: string) => { value: string } | undefined };
}): {
  method: string;
  authScheme: 'bearer' | 'cookie' | null;
  origin: string | null;
  referer: string | null;
  host: string | null;
} {
  const { authScheme } = extractGovernanceSessionCredentials(req);
  return {
    method: req.method || 'GET',
    authScheme,
    origin: req.headers.get('origin'),
    referer: req.headers.get('referer'),
    host: req.headers.get('host'),
  };
}
