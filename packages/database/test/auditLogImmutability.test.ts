// packages/database/test/auditLogImmutability.test.ts
// DentalVis 2.0 — Audit Log Immutability & Anti-Truncate Test Suite
// Architecture Baseline v1.9.1 — Milestone M6.1.1: Database-Level Immutability

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma, Prisma } from '../src';
import crypto from 'crypto';

describe('Phase M6.1.1 — AdminAuditLog Database-Level Immutability', () => {
  let testUserId: string;
  let testLogId: string;
  const targetId = crypto.randomUUID();

  beforeAll(async () => {
    // Ensure test user exists with UserRole.SYSTEM_ADMIN
    const user = await prisma.user.findFirst({
      where: { role: 'SYSTEM_ADMIN' },
    });

    if (user) {
      testUserId = user.id;
    } else {
      const createdUser = await prisma.user.create({
        data: {
          email: `audit-test-${Date.now()}@dentalvis.org`,
          passwordHash: '$2b$12$e8Yk1m9Vq4Wn0jH5Fz7sUeX4G9d2K0L8M6O4R2T0V8X6Z4B2D0F2H',
          fullName: 'Audit Test Admin',
          role: 'SYSTEM_ADMIN',
        },
      });
      testUserId = createdUser.id;
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('allows INSERT operations on AdminAuditLog', async () => {
    const ipHash = crypto.createHash('sha256').update('127.0.0.1').digest('hex');

    const created = await prisma.adminAuditLog.create({
      data: {
        userId: testUserId,
        action: 'M6_1_1_IMMUTABILITY_TEST',
        targetType: 'ProcedureRevision',
        targetId,
        metadata: { test: 'm6_1_1' },
        ipHash,
        userAgent: 'Vitest-M6.1.1',
      },
    });

    expect(created).toBeDefined();
    expect(created.id).toBeDefined();
    expect(created.action).toBe('M6_1_1_IMMUTABILITY_TEST');
    expect(created.targetId).toBe(targetId);
    testLogId = created.id;
  });

  it('allows SELECT queries on AdminAuditLog', async () => {
    expect(testLogId).toBeDefined();

    const retrieved = await prisma.adminAuditLog.findUnique({
      where: { id: testLogId },
    });

    expect(retrieved).not.toBeNull();
    expect(retrieved?.id).toBe(testLogId);
    expect(retrieved?.action).toBe('M6_1_1_IMMUTABILITY_TEST');
    expect(retrieved?.targetId).toBe(targetId);
  });

  it('strictly rejects UPDATE operations via trg_admin_audit_log_immutable (P0001)', async () => {
    expect(testLogId).toBeDefined();
    let thrownError: unknown;

    try {
      await prisma.$executeRaw`
        UPDATE "AdminAuditLog"
        SET "action" = 'MALICIOUS_TAMPER'
        WHERE "id" = ${testLogId}::uuid
      `;
    } catch (err) {
      thrownError = err;
    }

    expect(thrownError).toBeDefined();
    expect(thrownError).toBeInstanceOf(Prisma.PrismaClientKnownRequestError);
    const prismaErr = thrownError as Prisma.PrismaClientKnownRequestError;
    expect(prismaErr.message).toMatch(/DATABASE INTEGRITY VIOLATION: Records in table "AdminAuditLog" are strictly immutable/);
  });

  it('strictly rejects DELETE operations via trg_admin_audit_log_immutable (P0001)', async () => {
    expect(testLogId).toBeDefined();
    let thrownError: unknown;

    try {
      await prisma.$executeRaw`
        DELETE FROM "AdminAuditLog"
        WHERE "id" = ${testLogId}::uuid
      `;
    } catch (err) {
      thrownError = err;
    }

    expect(thrownError).toBeDefined();
    expect(thrownError).toBeInstanceOf(Prisma.PrismaClientKnownRequestError);
    const prismaErr = thrownError as Prisma.PrismaClientKnownRequestError;
    expect(prismaErr.message).toMatch(/DATABASE INTEGRITY VIOLATION: Records in table "AdminAuditLog" are strictly immutable/);
  });

  it('strictly rejects TRUNCATE operations via trg_admin_audit_log_truncate (P0001)', async () => {
    let thrownError: unknown;

    try {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE "AdminAuditLog" CASCADE;`);
    } catch (err) {
      thrownError = err;
    }

    expect(thrownError).toBeDefined();
    expect(thrownError).toBeInstanceOf(Prisma.PrismaClientKnownRequestError);
    const prismaErr = thrownError as Prisma.PrismaClientKnownRequestError;
    expect(prismaErr.message).toMatch(/DATABASE INTEGRITY VIOLATION: Truncating table "AdminAuditLog" is strictly forbidden/);
  });

  it('prevents cascading deletion of referenced User due to ON DELETE RESTRICT', async () => {
    let thrownError: unknown;

    try {
      await prisma.user.delete({
        where: { id: testUserId },
      });
    } catch (err) {
      thrownError = err;
    }

    expect(thrownError).toBeDefined();
    expect(thrownError).toBeInstanceOf(Prisma.PrismaClientKnownRequestError);
    const prismaErr = thrownError as Prisma.PrismaClientKnownRequestError;
    // Foreign key violation code in Prisma is P2003
    expect(prismaErr.code).toBe('P2003');
  });
});
