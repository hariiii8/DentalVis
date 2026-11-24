// packages/database/test/sessionSecurity.test.ts
// DentalVis — Session Validation & Identity Resolution Unit Tests (M6.1.5-B)
// Architecture Baseline v1.9.1 (FROZEN) — Milestone M6.1.5-B

import { describe, it, expect, vi } from 'vitest';

// Mock server-only for node test runner
vi.mock('server-only', () => ({}));

import {
  validateAuthoritativeSession,
  resolveRequestIdentity,
  SessionRevocationService,
} from '../src/governance';
import type { PrismaClient } from '@prisma/client';

describe('Phase M6.1.5-B — Session Security & Identity Foundation Tests', () => {
  const mockNow = new Date('2026-11-24T12:00:00.000Z');

  // ====================================================================
  // 1. SESSION VALIDATION FAIL-CLOSED TESTS
  // ====================================================================
  describe('Authoritative Session Validation (validateAuthoritativeSession)', () => {
    it('TEST-SESS-01: Fails closed on empty or whitespace token hash', async () => {
      const mockPrisma = {} as PrismaClient;
      const res1 = await validateAuthoritativeSession(mockPrisma, '', mockNow);
      expect(res1.isValid).toBe(false);
      expect(res1.denialReason).toBe('UNAUTHENTICATED');

      const res2 = await validateAuthoritativeSession(mockPrisma, '   ', mockNow);
      expect(res2.isValid).toBe(false);
      expect(res2.denialReason).toBe('UNAUTHENTICATED');
    });

    it('TEST-SESS-02: Fails closed when session not found in database', async () => {
      const mockPrisma = {
        userSession: {
          findUnique: vi.fn().mockResolvedValue(null),
        },
      } as unknown as PrismaClient;

      const res = await validateAuthoritativeSession(mockPrisma, 'non-existent-hash', mockNow);
      expect(res.isValid).toBe(false);
      expect(res.denialReason).toBe('UNAUTHENTICATED');
    });

    it('TEST-SESS-03: Fails closed on expired session', async () => {
      const mockPrisma = {
        userSession: {
          findUnique: vi.fn().mockResolvedValue({
            id: 'sess-1',
            tokenHash: 'hash-1',
            status: 'ACTIVE',
            expiresAt: new Date('2026-11-24T11:59:59.000Z'), // 1s in past
            sessionFamily: { id: 'fam-1', status: 'ACTIVE' },
            user: { id: 'user-1', role: 'CLINICAL_REVIEWER', isActive: true, deactivatedAt: null },
          }),
        },
      } as unknown as PrismaClient;

      const res = await validateAuthoritativeSession(mockPrisma, 'hash-1', mockNow);
      expect(res.isValid).toBe(false);
      expect(res.denialReason).toBe('SESSION_EXPIRED');
    });

    it('TEST-SESS-04: Fails closed on SUPERSEDED session (replay of rotated token)', async () => {
      const mockPrisma = {
        userSession: {
          findUnique: vi.fn().mockResolvedValue({
            id: 'sess-old',
            tokenHash: 'hash-old',
            status: 'SUPERSEDED',
            expiresAt: new Date('2026-11-24T13:00:00.000Z'),
            sessionFamily: { id: 'fam-1', status: 'ACTIVE' },
            user: { id: 'user-1', role: 'CLINICAL_REVIEWER', isActive: true, deactivatedAt: null },
          }),
        },
      } as unknown as PrismaClient;

      const res = await validateAuthoritativeSession(mockPrisma, 'hash-old', mockNow);
      expect(res.isValid).toBe(false);
      expect(res.denialReason).toBe('SESSION_SUPERSEDED');
    });

    it('TEST-SESS-05: Fails closed on REVOKED_MANUAL or REVOKED_REPLAY_ATTACK session', async () => {
      const mockPrisma = {
        userSession: {
          findUnique: vi.fn().mockResolvedValue({
            id: 'sess-rev',
            tokenHash: 'hash-rev',
            status: 'REVOKED_MANUAL',
            expiresAt: new Date('2026-11-24T13:00:00.000Z'),
            sessionFamily: { id: 'fam-1', status: 'ACTIVE' },
            user: { id: 'user-1', role: 'CLINICAL_REVIEWER', isActive: true, deactivatedAt: null },
          }),
        },
      } as unknown as PrismaClient;

      const res = await validateAuthoritativeSession(mockPrisma, 'hash-rev', mockNow);
      expect(res.isValid).toBe(false);
      expect(res.denialReason).toBe('SESSION_REVOKED');
    });

    it('TEST-SESS-06: Fails closed on invalidated or revoked SessionFamily', async () => {
      const mockPrisma = {
        userSession: {
          findUnique: vi.fn().mockResolvedValue({
            id: 'sess-fam-rev',
            tokenHash: 'hash-fam-rev',
            status: 'ACTIVE',
            expiresAt: new Date('2026-11-24T13:00:00.000Z'),
            sessionFamily: { id: 'fam-1', status: 'REVOKED' },
            user: { id: 'user-1', role: 'CLINICAL_REVIEWER', isActive: true, deactivatedAt: null },
          }),
        },
      } as unknown as PrismaClient;

      const res = await validateAuthoritativeSession(mockPrisma, 'hash-fam-rev', mockNow);
      expect(res.isValid).toBe(false);
      expect(res.denialReason).toBe('SESSION_FAMILY_REVOKED');
    });

    it('TEST-SESS-07: Fails closed on deactivated user (isActive: false or deactivatedAt != null)', async () => {
      const mockPrisma = {
        userSession: {
          findUnique: vi.fn().mockResolvedValue({
            id: 'sess-deact',
            tokenHash: 'hash-deact',
            status: 'ACTIVE',
            expiresAt: new Date('2026-11-24T13:00:00.000Z'),
            sessionFamily: { id: 'fam-1', status: 'ACTIVE' },
            user: { id: 'user-1', role: 'CLINICAL_REVIEWER', isActive: false, deactivatedAt: mockNow },
          }),
        },
      } as unknown as PrismaClient;

      const res = await validateAuthoritativeSession(mockPrisma, 'hash-deact', mockNow);
      expect(res.isValid).toBe(false);
      expect(res.denialReason).toBe('USER_DEACTIVATED');
    });

    it('TEST-SESS-08: Fails closed on database exception or network failure', async () => {
      const mockPrisma = {
        userSession: {
          findUnique: vi.fn().mockRejectedValue(new Error('PostgreSQL connection timeout')),
        },
      } as unknown as PrismaClient;

      const res = await validateAuthoritativeSession(mockPrisma, 'hash-err', mockNow);
      expect(res.isValid).toBe(false);
      expect(res.denialReason).toBe('INTERNAL_SECURITY_ERROR');
    });
  });

  // ====================================================================
  // 2. REQUEST IDENTITY RESOLUTION PRIMITIVE TESTS
  // ====================================================================
  describe('Request Identity Resolution (resolveRequestIdentity)', () => {
    it('TEST-IDENT-01: Successfully resolves actor from valid active session', async () => {
      const mockPrisma = {
        userSession: {
          findUnique: vi.fn().mockResolvedValue({
            id: 'sess-valid',
            tokenHash: 'valid-hash',
            status: 'ACTIVE',
            expiresAt: new Date('2026-11-24T14:00:00.000Z'),
            sessionFamilyId: 'fam-123',
            sessionFamily: { id: 'fam-123', status: 'ACTIVE' },
            user: {
              id: 'user-valid',
              role: 'CLINICAL_REVIEWER',
              isActive: true,
              deactivatedAt: null,
            },
          }),
        },
      } as unknown as PrismaClient;

      const res = await resolveRequestIdentity(
        mockPrisma,
        { sessionTokenHash: 'valid-hash' },
        mockNow
      );

      expect(res.isAuthenticated).toBe(true);
      if (res.isAuthenticated) {
        expect(res.actor.userId).toBe('user-valid');
        expect(res.actor.applicationRole).toBe('CLINICAL_REVIEWER');
        expect(res.actor.crbRole).toBe('CLINICAL_REVIEWER');
        expect(res.actor.sessionId).toBe('sess-valid');
        expect(res.actor.sessionFamilyId).toBe('fam-123');
      }
    });

    it('TEST-IDENT-02: Rejects client-asserted userId mismatch (Anti-Impersonation Check)', async () => {
      const mockPrisma = {
        userSession: {
          findUnique: vi.fn().mockResolvedValue({
            id: 'sess-valid',
            tokenHash: 'valid-hash',
            status: 'ACTIVE',
            expiresAt: new Date('2026-11-24T14:00:00.000Z'),
            sessionFamilyId: 'fam-123',
            sessionFamily: { id: 'fam-123', status: 'ACTIVE' },
            user: {
              id: 'user-actual-author',
              role: 'CLINICAL_AUTHOR',
              isActive: true,
              deactivatedAt: null,
            },
          }),
        },
      } as unknown as PrismaClient;

      // Caller sends a valid token for user-actual-author, but asserts header/body userId = user-victim-admin
      const res = await resolveRequestIdentity(
        mockPrisma,
        {
          sessionTokenHash: 'valid-hash',
          untrustedAssertedUserId: 'user-victim-admin',
        },
        mockNow
      );

      expect(res.isAuthenticated).toBe(false);
      expect(res.denialReason).toBe('UNAUTHENTICATED');
      expect(res.diagnosticMessage).toContain('Asserted user identity does not match');
    });

    it('TEST-IDENT-03: Rejects client-asserted role mismatch (Anti-Privilege-Elevation Check)', async () => {
      const mockPrisma = {
        userSession: {
          findUnique: vi.fn().mockResolvedValue({
            id: 'sess-valid',
            tokenHash: 'valid-hash',
            status: 'ACTIVE',
            expiresAt: new Date('2026-11-24T14:00:00.000Z'),
            sessionFamilyId: 'fam-123',
            sessionFamily: { id: 'fam-123', status: 'ACTIVE' },
            user: {
              id: 'user-patient',
              role: 'PATIENT_VIEWER',
              isActive: true,
              deactivatedAt: null,
            },
          }),
        },
      } as unknown as PrismaClient;

      // Caller asserts they are SYSTEM_ADMIN in request body/headers
      const res = await resolveRequestIdentity(
        mockPrisma,
        {
          sessionTokenHash: 'valid-hash',
          untrustedAssertedRole: 'SYSTEM_ADMIN',
        },
        mockNow
      );

      expect(res.isAuthenticated).toBe(false);
      expect(res.denialReason).toBe('UNAUTHENTICATED');
      expect(res.diagnosticMessage).toContain('Asserted role claim does not match');
    });
  });

  // ====================================================================
  // 3. SESSION REVOCATION SERVICE TESTS
  // ====================================================================
  describe('Session Revocation Service (SessionRevocationService)', () => {
    it('TEST-REV-01: Idempotently revokes already-revoked session without duplicate errors', async () => {
      const mockPrisma = {
        $transaction: vi.fn().mockImplementation((cb) => cb(mockPrisma)),
        userSession: {
          findUnique: vi.fn().mockResolvedValue({
            id: 'sess-already-rev',
            status: 'REVOKED_MANUAL',
            revokedAt: new Date('2026-11-20T10:00:00.000Z'),
          }),
        },
        revocationEvent: {
          findFirst: vi.fn().mockResolvedValue({
            id: 'existing-event-1',
          }),
        },
      } as unknown as PrismaClient;

      const service = new SessionRevocationService({ prisma: mockPrisma });
      const res = await service.revokeSession({
        sessionId: 'sess-already-rev',
        reason: 'Duplicate call test',
      });

      expect(res.success).toBe(true);
      expect(res.revocationEventId).toBe('existing-event-1');
      expect(res.affectedSessionsCount).toBe(0);
    });

    it('TEST-REV-02: Throws if target session to revoke does not exist', async () => {
      const mockPrisma = {
        $transaction: vi.fn().mockImplementation((cb) => cb(mockPrisma)),
        userSession: {
          findUnique: vi.fn().mockResolvedValue(null),
        },
      } as unknown as PrismaClient;

      const service = new SessionRevocationService({ prisma: mockPrisma });
      await expect(
        service.revokeSession({
          sessionId: 'unknown-session-id',
          reason: 'Test non-existent',
        })
      ).rejects.toThrow("Session 'unknown-session-id' not found");
    });
  });
});
