// packages/database/src/governance/sessionRevocationService.ts
// DentalVis — Server-Only Session Mutation, Invalidation & Revocation Service
// Architecture Baseline v1.9.1 (FROZEN) — Milestone M6.1.5-B

import 'server-only';
import type {
  PrismaClient,
  Prisma,
  SessionStatus,
} from '@prisma/client';

export interface RevokeSessionInput {
  sessionId: string;
  reason: string;
  revocationType?: 'REVOKED_MANUAL' | 'REVOKED_REPLAY_ATTACK';
  revokedByUserId?: string;
  now?: Date;
}

export interface RevokeFamilyInput {
  familyId: string;
  reason: string;
  revokedByUserId?: string;
  now?: Date;
}

export interface RevokeUserInput {
  userId: string;
  reason: string;
  revokedByUserId?: string;
  now?: Date;
}

export interface RegisterConsumerInput {
  consumerId: string;
  processInstanceId: string;
  leaseDurationMs?: number;
  now?: Date;
}

export interface AcknowledgeEventInput {
  consumerId: string;
  eventId: string;
  now?: Date;
}

export interface RevocationOperationResult {
  success: boolean;
  targetId: string;
  revocationEventId: string;
  affectedSessionsCount: number;
  revokedAt: Date;
}

/**
 * Server-only service providing transactional, atomic session lifecycle mutations:
 * - Single-session revocation (atomically marks session status & records RevocationEvent).
 * - Session-family invalidation (atomically revokes family, all member sessions & records RevocationEvent).
 * - User-wide session invalidation (atomically revokes all families, all active sessions & records RevocationEvent).
 * - Distributed RevocationEngine consumer registration, lease heartbeating, and event acknowledgement.
 *
 * Concurrency & Locking Strategy:
 * - Uses transaction boundaries with strict constraint adherence (chk_revocation_target_fk_match).
 * - Trigger Invariant Order: Sessions must be updated to REVOKED_MANUAL *before* SessionFamily status is set to REVOKED,
 *   as trg_check_session_succession_integrity strictly enforces that SessionFamily must be ACTIVE during UserSession updates.
 * - Idempotent: Repeated revocations of already revoked entities succeed without generating duplicate events.
 * - Fails closed on any transient or serialization error.
 */
export class SessionRevocationService {
  private readonly prisma: PrismaClient;

  constructor(options: { prisma: PrismaClient }) {
    if (!options.prisma) {
      throw new Error('SessionRevocationService requires an initialized PrismaClient instance.');
    }
    this.prisma = options.prisma;
  }

  /**
   * Atomically revokes an individual UserSession and logs an immutable RevocationEvent.
   * If already revoked, operation is idempotent and returns the existing state.
   */
  public async revokeSession(
    input: RevokeSessionInput,
    tx?: Prisma.TransactionClient
  ): Promise<RevocationOperationResult> {
    const now = input.now ?? new Date();
    const status: SessionStatus = input.revocationType ?? 'REVOKED_MANUAL';

    const execute = async (client: Prisma.TransactionClient): Promise<RevocationOperationResult> => {
      // 1. Fetch current session
      const session = await client.userSession.findUnique({
        where: { id: input.sessionId },
      });

      if (!session) {
        throw new Error(`SessionRevocationService: Session '${input.sessionId}' not found.`);
      }

      // Idempotency: If already revoked with the same or higher severity, do not duplicate
      if (
        session.status === 'REVOKED_MANUAL' ||
        session.status === 'REVOKED_REPLAY_ATTACK'
      ) {
        const existingEvent = await client.revocationEvent.findFirst({
          where: { targetSessionId: input.sessionId },
          orderBy: { occurredAt: 'desc' },
        });

        return {
          success: true,
          targetId: session.id,
          revocationEventId: existingEvent?.id ?? 'already-revoked',
          affectedSessionsCount: 0,
          revokedAt: session.revokedAt ?? now,
        };
      }

      // 2. Atomically update session status
      await client.userSession.update({
        where: { id: input.sessionId },
        data: {
          status,
          revokedAt: now,
          revocationReason: input.reason,
        },
      });

      // 3. Atomically record immutable RevocationEvent complying with chk_revocation_target_fk_match
      // For SESSION target: targetSessionId is NOT NULL, targetFamilyId is NULL, targetUserId is NULL
      const revEvent = await client.revocationEvent.create({
        data: {
          type: 'REVOKE_SESSION',
          targetType: 'SESSION',
          targetId: session.id,
          targetSessionId: session.id,
          targetFamilyId: null,
          targetUserId: null,
          reason: input.reason,
          occurredAt: now,
        },
      });

      return {
        success: true,
        targetId: session.id,
        revocationEventId: revEvent.id,
        affectedSessionsCount: 1,
        revokedAt: now,
      };
    };

    return tx
      ? execute(tx)
      : this.prisma.$transaction(execute, {
          maxWait: 10000,
          timeout: 15000,
        });
  }

  /**
   * Atomically revokes an entire SessionFamily, all associated active sessions,
   * and records an immutable RevocationEvent.
   *
   * Database Trigger Ordering Invariant:
   * trg_check_session_succession_integrity requires SessionFamily.status === 'ACTIVE'
   * whenever a UserSession row is updated. Therefore, sessions must be updated first
   * before transitioning SessionFamily to REVOKED.
   */
  public async revokeFamily(
    input: RevokeFamilyInput,
    tx?: Prisma.TransactionClient
  ): Promise<RevocationOperationResult> {
    const now = input.now ?? new Date();

    const execute = async (client: Prisma.TransactionClient): Promise<RevocationOperationResult> => {
      const family = await client.sessionFamily.findUnique({
        where: { id: input.familyId },
      });

      if (!family) {
        throw new Error(`SessionRevocationService: SessionFamily '${input.familyId}' not found.`);
      }

      if (family.status === 'REVOKED') {
        const existingEvent = await client.revocationEvent.findFirst({
          where: { targetFamilyId: input.familyId, type: 'REVOKE_FAMILY' },
          orderBy: { occurredAt: 'desc' },
        });

        return {
          success: true,
          targetId: family.id,
          revocationEventId: existingEvent?.id ?? 'already-revoked',
          affectedSessionsCount: 0,
          revokedAt: family.revokedAt ?? now,
        };
      }

      // 1. First revoke all ACTIVE or SUPERSEDED sessions while family is still ACTIVE
      const updatedSessions = await client.userSession.updateMany({
        where: {
          sessionFamilyId: input.familyId,
          status: { in: ['ACTIVE', 'SUPERSEDED'] },
        },
        data: {
          status: 'REVOKED_MANUAL',
          revokedAt: now,
          revocationReason: `Family revoked: ${input.reason}`,
        },
      });

      // 2. Invalidate SessionFamily
      await client.sessionFamily.update({
        where: { id: input.familyId },
        data: {
          status: 'REVOKED',
          revokedAt: now,
          revocationReason: input.reason,
        },
      });

      // 3. Atomically record RevocationEvent complying with chk_revocation_target_fk_match
      // For FAMILY target: targetFamilyId is NOT NULL, targetSessionId is NULL, targetUserId is NULL
      const revEvent = await client.revocationEvent.create({
        data: {
          type: 'REVOKE_FAMILY',
          targetType: 'FAMILY',
          targetId: family.id,
          targetSessionId: null,
          targetFamilyId: family.id,
          targetUserId: null,
          reason: input.reason,
          occurredAt: now,
        },
      });

      return {
        success: true,
        targetId: family.id,
        revocationEventId: revEvent.id,
        affectedSessionsCount: updatedSessions.count,
        revokedAt: now,
      };
    };

    return tx
      ? execute(tx)
      : this.prisma.$transaction(execute, {
          maxWait: 10000,
          timeout: 15000,
        });
  }

  /**
   * Atomically invalidates all sessions and session families for a given user.
   */
  public async revokeAllUserSessions(
    input: RevokeUserInput,
    tx?: Prisma.TransactionClient
  ): Promise<RevocationOperationResult> {
    const now = input.now ?? new Date();

    const execute = async (client: Prisma.TransactionClient): Promise<RevocationOperationResult> => {
      const user = await client.user.findUnique({
        where: { id: input.userId },
      });

      if (!user) {
        throw new Error(`SessionRevocationService: User '${input.userId}' not found.`);
      }

      // 1. Revoke all sessions first while families are ACTIVE
      const updatedSessions = await client.userSession.updateMany({
        where: {
          userId: input.userId,
          status: { in: ['ACTIVE', 'SUPERSEDED'] },
        },
        data: {
          status: 'REVOKED_MANUAL',
          revokedAt: now,
          revocationReason: `User revoked: ${input.reason}`,
        },
      });

      // 2. Revoke all active session families for user
      await client.sessionFamily.updateMany({
        where: {
          userId: input.userId,
          status: 'ACTIVE',
        },
        data: {
          status: 'REVOKED',
          revokedAt: now,
          revocationReason: input.reason,
        },
      });

      // 3. Record RevocationEvent complying with chk_revocation_target_fk_match
      // For USER target: targetUserId is NOT NULL, targetSessionId is NULL, targetFamilyId is NULL
      const revEvent = await client.revocationEvent.create({
        data: {
          type: 'REVOKE_USER',
          targetType: 'USER',
          targetId: user.id,
          targetSessionId: null,
          targetFamilyId: null,
          targetUserId: user.id,
          reason: input.reason,
          occurredAt: now,
        },
      });

      return {
        success: true,
        targetId: user.id,
        revocationEventId: revEvent.id,
        affectedSessionsCount: updatedSessions.count,
        revokedAt: now,
      };
    };

    return tx
      ? execute(tx)
      : this.prisma.$transaction(execute, {
          maxWait: 10000,
          timeout: 15000,
        });
  }

  /**
   * Registers or updates a RevocationConsumer with a fencing lease.
   */
  public async registerOrHeartbeatConsumer(
    input: RegisterConsumerInput,
    tx?: Prisma.TransactionClient
  ): Promise<void> {
    const client = tx ?? this.prisma;
    const now = input.now ?? new Date();
    const leaseDuration = input.leaseDurationMs ?? 30000;
    const leaseExpiresAt = new Date(now.getTime() + leaseDuration);

    await client.revocationConsumer.upsert({
      where: { consumerId: input.consumerId },
      create: {
        consumerId: input.consumerId,
        processInstanceId: input.processInstanceId,
        leaseOwner: input.processInstanceId,
        leaseExpiresAt,
        fencingGeneration: 1n,
        lastHeartbeatAt: now,
        registeredAt: now,
      },
      update: {
        processInstanceId: input.processInstanceId,
        leaseOwner: input.processInstanceId,
        leaseExpiresAt,
        fencingGeneration: { increment: 1n },
        lastHeartbeatAt: now,
      },
    });
  }

  /**
   * Acknowledges that a RevocationConsumer has observed and processed a RevocationEvent.
   * Idempotent: Duplicate acknowledgements do not fail.
   */
  public async acknowledgeEvent(
    input: AcknowledgeEventInput,
    tx?: Prisma.TransactionClient
  ): Promise<void> {
    const client = tx ?? this.prisma;
    const now = input.now ?? new Date();

    const consumer = await client.revocationConsumer.findUnique({
      where: { consumerId: input.consumerId },
    });
    if (!consumer) {
      throw new Error(`Consumer '${input.consumerId}' is not registered.`);
    }

    const event = await client.revocationEvent.findUnique({
      where: { id: input.eventId },
    });
    if (!event) {
      throw new Error(`RevocationEvent '${input.eventId}' not found.`);
    }

    await client.revocationEventAck.upsert({
      where: {
        consumerId_eventId: {
          consumerId: input.consumerId,
          eventId: input.eventId,
        },
      },
      create: {
        consumerId: input.consumerId,
        eventId: input.eventId,
        ackedAt: now,
      },
      update: {
        ackedAt: now,
      },
    });
  }

  /**
   * Retrieves pending revocation events since a given cursor timestamp.
   */
  public async getUnprocessedEvents(
    consumerId: string,
    since?: Date,
    limit: number = 100,
    tx?: Prisma.TransactionClient
  ) {
    const client = tx ?? this.prisma;

    return client.revocationEvent.findMany({
      where: {
        occurredAt: since ? { gt: since } : undefined,
        acks: {
          none: {
            consumerId,
          },
        },
      },
      orderBy: { occurredAt: 'asc' },
      take: limit,
    });
  }
}
