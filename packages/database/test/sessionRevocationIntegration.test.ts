// packages/database/test/sessionRevocationIntegration.test.ts
// DentalVis — Live PostgreSQL Session Revocation & Concurrency Integration Tests (M6.1.5-B)
// Architecture Baseline v1.9.1 (FROZEN) — Milestone M6.1.5-B

import { describe, it, expect, beforeAll, afterAll } from 'vitest';

// Mock server-only for node test runner
import { vi } from 'vitest';
vi.mock('server-only', () => ({}));

import { PrismaClient } from '@prisma/client';
import {
  validateAuthoritativeSession,
  resolveRequestIdentity,
  SessionRevocationService,
} from '../src/governance';

describe('Phase M6.1.5-B — Live PostgreSQL Session Revocation & Concurrency Integration', () => {
  let prisma: PrismaClient;
  let revocationService: SessionRevocationService;

  let testUserId: string;
  let testFamilyId: string;
  let testSession1Id: string;
  let testSession1TokenHash: string;
  let testSession2Id: string;
  let testSession2TokenHash: string;

  beforeAll(async () => {
    prisma = new PrismaClient();
    await prisma.$connect();
    revocationService = new SessionRevocationService({ prisma });

    // 1. Create dedicated test user
    const user = await prisma.user.create({
      data: {
        email: `sec-user-${Date.now()}@dentalvis.test`,
        passwordHash: 'dummy-hashed-secret',
        fullName: 'Dr. Security Test Subject',
        role: 'CLINICAL_REVIEWER',
        licenseNumber: 'LIC-SEC-7788',
        clinicalSpecialty: 'PERIODONTICS',
      },
    });
    testUserId = user.id;

    // 2. Create dedicated test session family
    const family = await prisma.sessionFamily.create({
      data: {
        userId: testUserId,
        status: 'ACTIVE',
      },
    });
    testFamilyId = family.id;

    // 3. Create two active sessions within this family
    testSession1TokenHash = `hash-sess-1-${Date.now()}`;
    const sess1 = await prisma.userSession.create({
      data: {
        userId: testUserId,
        sessionFamilyId: testFamilyId,
        tokenHash: testSession1TokenHash,
        status: 'ACTIVE',
        expiresAt: new Date(Date.now() + 86400000 * 7), // 7 days in future
      },
    });
    testSession1Id = sess1.id;

    testSession2TokenHash = `hash-sess-2-${Date.now()}`;
    const sess2 = await prisma.userSession.create({
      data: {
        userId: testUserId,
        sessionFamilyId: testFamilyId,
        tokenHash: testSession2TokenHash,
        status: 'ACTIVE',
        expiresAt: new Date(Date.now() + 86400000 * 7),
      },
    });
    testSession2Id = sess2.id;
  });

  afterAll(async () => {
    // Clean up created test data in correct foreign key order
    if (testUserId) {
      await prisma.revocationEventAck.deleteMany({
        where: { consumer: { consumerId: 'test-consumer-node-1' } },
      });
      await prisma.revocationConsumer.deleteMany({
        where: { consumerId: 'test-consumer-node-1' },
      });
      // Delete revocation events for sessions, family, and user
      await prisma.revocationEvent.deleteMany({
        where: {
          OR: [
            { targetUserId: testUserId },
            { targetSession: { userId: testUserId } },
            { targetFamily: { userId: testUserId } },
          ],
        },
      });
      await prisma.userSession.deleteMany({
        where: { userId: testUserId },
      });
      await prisma.sessionFamily.deleteMany({
        where: { userId: testUserId },
      });
      await prisma.user.delete({
        where: { id: testUserId },
      });
    }
    await prisma.$disconnect();
  });

  // ====================================================================
  // 1. LIVE POSTGRESQL SESSION VALIDATION & IDENTITY RESOLUTION
  // ====================================================================
  it('TEST-PG-SEC-01: Validates active PostgreSQL session and resolves authenticated identity', async () => {
    const res = await resolveRequestIdentity(prisma, {
      sessionTokenHash: testSession1TokenHash,
    });

    expect(res.isAuthenticated).toBe(true);
    if (res.isAuthenticated) {
      expect(res.actor.userId).toBe(testUserId);
      expect(res.actor.applicationRole).toBe('CLINICAL_REVIEWER');
      expect(res.actor.crbRole).toBe('CLINICAL_REVIEWER');
      expect(res.actor.sessionId).toBe(testSession1Id);
      expect(res.actor.sessionFamilyId).toBe(testFamilyId);
    }
  });

  // ====================================================================
  // 2. ATOMIC SINGLE-SESSION REVOCATION & REJECTION INVARIANT
  // ====================================================================
  it('TEST-PG-SEC-02: Atomically revokes single session, creates RevocationEvent, and immediately fails subsequent validation', async () => {
    // 1. Revoke Session 1
    const revRes = await revocationService.revokeSession({
      sessionId: testSession1Id,
      reason: 'Suspicious device access reported',
      revocationType: 'REVOKED_MANUAL',
    });

    expect(revRes.success).toBe(true);
    expect(revRes.affectedSessionsCount).toBe(1);
    expect(revRes.revocationEventId).toBeDefined();

    // 2. Direct database inspection of UserSession
    const inDb = await prisma.userSession.findUnique({
      where: { id: testSession1Id },
    });
    expect(inDb?.status).toBe('REVOKED_MANUAL');
    expect(inDb?.revokedAt).not.toBeNull();

    // 3. Direct database inspection of RevocationEvent
    const revEvent = await prisma.revocationEvent.findUnique({
      where: { id: revRes.revocationEventId },
    });
    expect(revEvent).not.toBeNull();
    expect(revEvent?.type).toBe('REVOKE_SESSION');
    expect(revEvent?.targetType).toBe('SESSION');
    expect(revEvent?.targetId).toBe(testSession1Id);
    expect(revEvent?.targetSessionId).toBe(testSession1Id);

    // 4. Validate that Session 1 now FAILS closed
    const valRes = await validateAuthoritativeSession(prisma, testSession1TokenHash);
    expect(valRes.isValid).toBe(false);
    expect(valRes.denialReason).toBe('SESSION_REVOKED');

    // 5. Assert Session 2 (sibling in family) is still active
    const valRes2 = await validateAuthoritativeSession(prisma, testSession2TokenHash);
    expect(valRes2.isValid).toBe(true);
  });

  // ====================================================================
  // 3. ATOMIC SESSION FAMILY INVALIDATION & IMMEDIATE SIBLING DENIAL
  // ====================================================================
  it('TEST-PG-SEC-03: Atomically revokes entire SessionFamily, cascading to all sibling sessions and creating RevocationEvent', async () => {
    // Revoke the SessionFamily
    const famRev = await revocationService.revokeFamily({
      familyId: testFamilyId,
      reason: 'Refresh token rotation replay attack detected on cluster',
    });

    expect(famRev.success).toBe(true);
    expect(famRev.affectedSessionsCount).toBeGreaterThanOrEqual(1);

    // Inspect SessionFamily in DB
    const famInDb = await prisma.sessionFamily.findUnique({
      where: { id: testFamilyId },
    });
    expect(famInDb?.status).toBe('REVOKED');

    // Sibling Session 2 must now FAIL closed with SESSION_FAMILY_REVOKED or SESSION_REVOKED
    const valRes2 = await validateAuthoritativeSession(prisma, testSession2TokenHash);
    expect(valRes2.isValid).toBe(false);
    expect(['SESSION_FAMILY_REVOKED', 'SESSION_REVOKED']).toContain(valRes2.denialReason);
  });

  // ====================================================================
  // 4. DISTRIBUTED CONSUMER LEASE & EVENT ACKNOWLEDGEMENT
  // ====================================================================
  it('TEST-PG-SEC-04: Registers consumer, queries unacked events, and idempotently acknowledges processing', async () => {
    const consumerId = 'test-consumer-node-1';
    const instanceId = 'proc-instance-' + Date.now();

    // 1. Register consumer
    await revocationService.registerOrHeartbeatConsumer({
      consumerId,
      processInstanceId: instanceId,
      leaseDurationMs: 60000,
    });

    // 2. Fetch unprocessed events
    const pendingEvents = await revocationService.getUnprocessedEvents(consumerId);
    expect(pendingEvents.length).toBeGreaterThanOrEqual(1);

    const eventToAck = pendingEvents.find((e) => e.targetId === testFamilyId || e.targetId === testSession1Id);
    expect(eventToAck).toBeDefined();

    // 3. Acknowledge event
    await revocationService.acknowledgeEvent({
      consumerId,
      eventId: eventToAck!.id,
    });

    // 4. Verify event no longer appears in unacked list for this consumer
    const pendingAfter = await revocationService.getUnprocessedEvents(consumerId);
    expect(pendingAfter.some((e) => e.id === eventToAck!.id)).toBe(false);
  });

  // ====================================================================
  // 5. CONCURRENCY: SIMULTANEOUS REVOCATION TRANSACTIONS (RACE SAFETY)
  // ====================================================================
  it('TEST-PG-SEC-05: Concurrently races two simultaneous revocation transactions against the same session without deadlock or corrupt state', async () => {
    // Create a fresh new ACTIVE session family and session for concurrent racing
    const raceFamily = await prisma.sessionFamily.create({
      data: {
        userId: testUserId,
        status: 'ACTIVE',
      },
    });

    const raceTokenHash = `race-token-${Date.now()}`;
    const raceSession = await prisma.userSession.create({
      data: {
        userId: testUserId,
        sessionFamilyId: raceFamily.id,
        tokenHash: raceTokenHash,
        status: 'ACTIVE',
        expiresAt: new Date(Date.now() + 86400000),
      },
    });

    // Launch two simultaneous independent revocation transactions racing on the same session
    const [resultA, resultB] = await Promise.all([
      revocationService.revokeSession({
        sessionId: raceSession.id,
        reason: 'Concurrent race caller A',
      }),
      revocationService.revokeSession({
        sessionId: raceSession.id,
        reason: 'Concurrent race caller B',
      }),
    ]);

    // Both must safely resolve without deadlocks
    expect(resultA.success).toBe(true);
    expect(resultB.success).toBe(true);

    // The database must be in REVOKED_MANUAL state
    const finalSession = await prisma.userSession.findUnique({
      where: { id: raceSession.id },
    });
    expect(finalSession?.status).toBe('REVOKED_MANUAL');

    // Exactly one winner or idempotent return must be recorded
    const totalEvents = await prisma.revocationEvent.count({
      where: { targetSessionId: raceSession.id },
    });
    expect(totalEvents).toBe(1);
  });
});
