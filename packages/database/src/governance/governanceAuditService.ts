// packages/database/src/governance/governanceAuditService.ts
// DentalVis — Server-Only Governance Audit Service (Immutable Logging & Hashing)
// Architecture Baseline v1.9.1 (FROZEN) — Milestone M6.1.4

import 'server-only';
import { createHash } from 'crypto';
import type { PrismaClient, Prisma } from '@prisma/client';
import type {
  AuditVerificationRecord,
  EmitAuditEventInput,
  IGovernanceAuditService,
} from './interfaces';

/**
 * Computes an RFC 8785 canonical JSON string for deterministic cryptographic hashing.
 * Sorts object keys recursively and formats primitives deterministically.
 */
export function canonicalizeJson(value: unknown): string {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => canonicalizeJson(item)).join(',')}]`;
  }

  const obj = value as Record<string, unknown>;
  const sortedKeys = Object.keys(obj).sort();
  const pairs = sortedKeys
    .filter((k) => obj[k] !== undefined)
    .map((k) => `${JSON.stringify(k)}:${canonicalizeJson(obj[k])}`);

  return `{${pairs.join(',')}}`;
}

/**
 * Computes the SHA-256 digest of the canonicalized JSON representation.
 */
export function computePayloadHash(payload: Record<string, unknown>): string {
  const canonicalString = canonicalizeJson(payload);
  return createHash('sha256').update(canonicalString, 'utf8').digest('hex');
}

/**
 * Server-only governance audit service.
 * Inserts immutable audit records into PostgreSQL `AdminAuditLog` table.
 * Strictly append-only: does not expose update, delete, or truncate methods.
 */
export class GovernanceAuditService implements IGovernanceAuditService {
  private readonly prisma: PrismaClient;

  constructor(options: { prisma: PrismaClient }) {
    if (!options.prisma) {
      throw new Error('GovernanceAuditService requires an initialized PrismaClient instance.');
    }
    this.prisma = options.prisma;
  }

  /**
   * Emits an immutable governance audit event.
   * Can participate in an existing interactive transaction (`tx`).
   */
  public async emitAuditEvent(
    input: EmitAuditEventInput,
    tx?: Prisma.TransactionClient
  ): Promise<{ auditId: string; payloadHash: string }> {
    const client = tx ?? this.prisma;

    if (!input.actorId || input.actorId.trim() === '') {
      throw new Error('GovernanceAuditService: actorId is required.');
    }
    if (!input.action || input.action.trim() === '') {
      throw new Error('GovernanceAuditService: action is required.');
    }
    if (!input.targetId || input.targetId.trim() === '') {
      throw new Error('GovernanceAuditService: targetId is required.');
    }
    if (!input.targetType || input.targetType.trim() === '') {
      throw new Error('GovernanceAuditService: targetType is required.');
    }

    const payload = input.payload ?? {};
    const payloadHash = computePayloadHash(payload);

    // Metadata payload stored in AdminAuditLog.metadata JSONB column
    const metadataToStore: Prisma.InputJsonValue = {
      ...payload,
      _governanceAudit: {
        payloadHash,
        sessionId: input.sessionId ?? null,
        schemaVersion: '1.0.0',
        algorithm: 'RFC8785-SHA256',
        recordedAt: new Date().toISOString(),
      },
    };

    const record = await client.adminAuditLog.create({
      data: {
        userId: input.actorId,
        action: input.action,
        targetType: input.targetType,
        targetId: input.targetId,
        metadata: metadataToStore,
        ipHash: input.ipHash ?? null,
        userAgent: input.userAgent ?? null,
      },
      select: {
        id: true,
      },
    });

    return {
      auditId: record.id,
      payloadHash,
    };
  }

  /**
   * Verifies the cryptographic integrity of an existing audit log record.
   */
  public async verifyAuditIntegrity(auditId: string): Promise<AuditVerificationRecord> {
    const log = await this.prisma.adminAuditLog.findUnique({
      where: { id: auditId },
    });

    if (!log) {
      throw new Error(`GovernanceAuditService: Audit log not found for id '${auditId}'.`);
    }

    const meta = (log.metadata as Record<string, unknown>) ?? {};
    const govMeta = (meta._governanceAudit as Record<string, unknown>) ?? {};
    const storedHash = (govMeta.payloadHash as string) ?? '';

    // Reconstruct the original payload by excluding _governanceAudit
    const originalPayload: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(meta)) {
      if (key !== '_governanceAudit') {
        originalPayload[key] = val;
      }
    }

    const recalculatedHash = computePayloadHash(originalPayload);
    const isIntegrityVerified = Boolean(storedHash && storedHash === recalculatedHash);

    return {
      id: log.id,
      action: log.action,
      createdAt: log.createdAt,
      actorId: log.userId,
      targetType: log.targetType,
      targetId: log.targetId,
      payloadHash: storedHash || recalculatedHash,
      isIntegrityVerified,
    };
  }
}
