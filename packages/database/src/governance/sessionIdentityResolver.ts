// packages/database/src/governance/sessionIdentityResolver.ts
// DentalVis — Server-Only Request Identity Resolution Primitive
// Architecture Baseline v1.9.1 (FROZEN) — Milestone M6.1.5-B

import 'server-only';
import type { PrismaClient } from '@prisma/client';
import {
  validateAuthoritativeSession,
  type SessionValidationResult,
} from './sessionValidator';
import type { AuthorizationActor } from './types';

export interface IdentityResolutionSuccess {
  isAuthenticated: true;
  actor: AuthorizationActor;
  evaluatedAt: Date;
}

export interface IdentityResolutionFailure {
  isAuthenticated: false;
  denialReason:
    | 'UNAUTHENTICATED'
    | 'SESSION_EXPIRED'
    | 'SESSION_REVOKED'
    | 'SESSION_SUPERSEDED'
    | 'SESSION_FAMILY_REVOKED'
    | 'USER_DEACTIVATED'
    | 'INTERNAL_SECURITY_ERROR';
  diagnosticMessage: string;
  evaluatedAt: Date;
}

export type IdentityResolutionResult =
  | IdentityResolutionSuccess
  | IdentityResolutionFailure;

export interface RequestIdentityInput {
  sessionTokenHash?: string | null;
  /**
   * Optional untrusted client context passed from HTTP headers or request bodies.
   * STRICT SECURITY INVARIANT:
   * Any client-provided userId, role, or claim is NEVER trusted or accepted as identity.
   * If provided, it is strictly validated against the authoritative session actor.
   * Any mismatch is flagged as an IDENTITY_MISMATCH security violation.
   */
  untrustedAssertedUserId?: string | null;
  untrustedAssertedRole?: string | null;
}

/**
 * Server-side identity resolution primitive for governance endpoints and services.
 * Enforces:
 * 1. Identity must strictly originate from an authoritative database-backed session token hash.
 * 2. Client-supplied userIds, roles, or claims are NEVER trusted.
 * 3. If client context asserts a specific userId or role, a mismatch with the authoritative
 *    session strictly fails closed (preventing ID/role substitution or confused-deputy attacks).
 * 4. Fails closed on missing, malformed, expired, revoked, or superseded sessions.
 */
export async function resolveRequestIdentity(
  prisma: PrismaClient,
  input: RequestIdentityInput,
  now: Date = new Date()
): Promise<IdentityResolutionResult> {
  const tokenHash = input.sessionTokenHash?.trim();

  if (!tokenHash) {
    return {
      isAuthenticated: false,
      denialReason: 'UNAUTHENTICATED',
      diagnosticMessage: 'Authentication required: session token hash is missing or empty.',
      evaluatedAt: now,
    };
  }

  const validationResult: SessionValidationResult = await validateAuthoritativeSession(
    prisma,
    tokenHash,
    now
  );

  if (!validationResult.isValid) {
    return {
      isAuthenticated: false,
      denialReason: validationResult.denialReason as IdentityResolutionFailure['denialReason'],
      diagnosticMessage: validationResult.diagnosticMessage,
      evaluatedAt: now,
    };
  }

  const { actor } = validationResult;

  // Anti-Spoofing Check: If the caller explicitly supplied an asserted userId, verify match
  if (
    input.untrustedAssertedUserId &&
    input.untrustedAssertedUserId.trim() !== '' &&
    input.untrustedAssertedUserId.trim() !== actor.userId
  ) {
    return {
      isAuthenticated: false,
      denialReason: 'UNAUTHENTICATED',
      diagnosticMessage:
        'SECURITY VIOLATION: Asserted user identity does not match authoritative session user.',
      evaluatedAt: now,
    };
  }

  // Anti-Spoofing Check: If caller asserted a role, verify against authoritative session
  if (
    input.untrustedAssertedRole &&
    input.untrustedAssertedRole.trim() !== '' &&
    input.untrustedAssertedRole.trim() !== actor.applicationRole
  ) {
    return {
      isAuthenticated: false,
      denialReason: 'UNAUTHENTICATED',
      diagnosticMessage:
        'SECURITY VIOLATION: Asserted role claim does not match authoritative session role.',
      evaluatedAt: now,
    };
  }

  return {
    isAuthenticated: true,
    actor,
    evaluatedAt: now,
  };
}
