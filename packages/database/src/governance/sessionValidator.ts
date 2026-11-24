// packages/database/src/governance/sessionValidator.ts
// DentalVis — Server-Only Authoritative Session & Invalidation Validator
// Architecture Baseline v1.9.1 (FROZEN) — Milestone M6.1.3

import 'server-only';
import type { PrismaClient } from '@prisma/client';
import type { ApplicationUserRole, CRBRole } from '@dentalvis/common';
import type { AuthorizationActor, AuthorizationDenialReason } from './types';

export interface SessionValidationSuccess {
  isValid: true;
  actor: AuthorizationActor;
}

export interface SessionValidationFailure {
  isValid: false;
  denialReason: AuthorizationDenialReason;
  diagnosticMessage: string;
}

export type SessionValidationResult = SessionValidationSuccess | SessionValidationFailure;

/**
 * Validates session state authoritatively against PostgreSQL using Prisma.
 * Strictly checks:
 * 1. Session record existence.
 * 2. Session expiration.
 * 3. Session status (rejects SUPERSEDED, REVOKED_MANUAL, REVOKED_REPLAY_ATTACK, EXPIRED).
 * 4. Session family existence and status (rejects REVOKED, EXPIRED).
 * 5. User existence and active status (rejects isActive: false or deactivatedAt != null).
 * 6. Fails closed on any unexpected database error.
 */
export async function validateAuthoritativeSession(
  prisma: PrismaClient,
  tokenHash: string,
  now: Date = new Date()
): Promise<SessionValidationResult> {
  if (!tokenHash || tokenHash.trim() === '') {
    return {
      isValid: false,
      denialReason: 'UNAUTHENTICATED',
      diagnosticMessage: 'Authentication required: session token hash is missing or empty.',
    };
  }

  try {
    const session = await prisma.userSession.findUnique({
      where: { tokenHash },
      include: {
        sessionFamily: true,
        user: true,
      },
    });

    if (!session) {
      return {
        isValid: false,
        denialReason: 'UNAUTHENTICATED',
        diagnosticMessage: 'Session record not found for provided token hash.',
      };
    }

    // 1. Session Expiration
    if (session.expiresAt.getTime() <= now.getTime()) {
      return {
        isValid: false,
        denialReason: 'SESSION_EXPIRED',
        diagnosticMessage: 'User session has expired.',
      };
    }

    // 2. Session Revocation / Supersession
    if (session.status === 'SUPERSEDED') {
      return {
        isValid: false,
        denialReason: 'SESSION_SUPERSEDED',
        diagnosticMessage: 'Session has been superseded by a rotated token successor.',
      };
    }

    if (
      session.status === 'REVOKED_MANUAL' ||
      session.status === 'REVOKED_REPLAY_ATTACK'
    ) {
      return {
        isValid: false,
        denialReason: 'SESSION_REVOKED',
        diagnosticMessage: `Session is revoked (${session.status}).`,
      };
    }

    if (session.status !== 'ACTIVE') {
      return {
        isValid: false,
        denialReason: 'SESSION_REVOKED',
        diagnosticMessage: `Session status '${session.status}' is not ACTIVE.`,
      };
    }

    // 3. Session Family Invalidation
    if (!session.sessionFamily) {
      return {
        isValid: false,
        denialReason: 'SESSION_FAMILY_REVOKED',
        diagnosticMessage: 'Session family association is missing or corrupted.',
      };
    }

    if (session.sessionFamily.status !== 'ACTIVE') {
      return {
        isValid: false,
        denialReason: 'SESSION_FAMILY_REVOKED',
        diagnosticMessage: `Session family status '${session.sessionFamily.status}' is not ACTIVE.`,
      };
    }

    // 4. User Deactivation
    if (!session.user || !session.user.isActive || session.user.deactivatedAt !== null) {
      return {
        isValid: false,
        denialReason: 'USER_DEACTIVATED',
        diagnosticMessage: 'User account is deactivated or marked inactive.',
      };
    }

    const applicationRole = session.user.role as ApplicationUserRole;
    const crbRole = mapApplicationRoleToCRBRole(applicationRole);

    return {
      isValid: true,
      actor: {
        userId: session.user.id,
        applicationRole,
        crbRole,
        sessionId: session.id,
        sessionFamilyId: session.sessionFamilyId,
      },
    };
  } catch (_err) {
    // Database or connection error strictly fails closed
    return {
      isValid: false,
      denialReason: 'INTERNAL_SECURITY_ERROR',
      diagnosticMessage: 'Database error occurred during authoritative session validation.',
    };
  }
}

/**
 * Maps the 5-value application UserRole to baseline operational CRBRole.
 */
export function mapApplicationRoleToCRBRole(role: ApplicationUserRole): CRBRole {
  switch (role) {
    case 'CLINICAL_AUTHOR':
      return 'CONTENT_AUTHOR';
    case 'CLINICAL_REVIEWER':
      return 'CLINICAL_REVIEWER';
    case 'CHIEF_EDITOR':
      return 'CRB_CHAIR';
    case 'SYSTEM_ADMIN':
      return 'GOVERNANCE_ADMIN';
    case 'PATIENT_VIEWER':
    default:
      return 'CONTENT_AUTHOR';
  }
}
