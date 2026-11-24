# DentalVis M6.1.5-A & M6.1.5-B Architecture & Implementation Record: Governance Persistence & Security Foundation

**Status:** IMPLEMENTED, SECURITY-TESTED & VERIFIED  
**Architecture Baseline:** v1.9.1 — FROZEN  
**Target Milestones:**  
- M6.1.5-A — Governance Persistence (Accepted)  
- M6.1.5-B — Session & Security Foundation (Implemented & Verified)  
**Date:** 2026-11-25  

---

## 1. Executive Summary

Milestone **M6.1.5-B (Session & Security Foundation)** establishes the authoritative server-side session, identity resolution, and lifecycle revocation layer for the DentalVis governance platform.

This milestone guarantees:
1. **Authoritative Session Validation:** Authentication state is strictly determined by server-side PostgreSQL records (`validateAuthoritativeSession`), verifying token validity, dynamic expiration, rotated token supersession, manual/replay-attack revocation, session-family validity, and user deactivation. Client-supplied role claims or tokens are never trusted.
2. **Request Identity Resolution Primitive (`resolveRequestIdentity`):** A server-only helper that extracts verified caller identity (`AuthorizationActor`) exclusively from validated sessions. Untrusted client headers or body assertions (`untrustedAssertedUserId`, `untrustedAssertedRole`) are strictly checked against the authoritative session; any mismatch triggers an immediate fail-closed `UNAUTHENTICATED` violation.
3. **Session Mutation & Revocation Service (`SessionRevocationService`):** Transactionally revokes individual sessions, entire session families, or all user sessions. Seamlessly adheres to database triggers (`trg_check_session_succession_integrity`) and check constraints (`chk_revocation_target_fk_match`), creating immutable `RevocationEvent` ledger rows. Supports distributed consumer registration and idempotent event acknowledgement.
4. **Concurrency & Race Condition Safety:** Proven through live concurrent transaction execution against PostgreSQL, guaranteeing that simultaneous revocation attempts execute safely without deadlocks, corrupted statuses, or duplicate events.
5. **No Scope Creep:** Strictly excludes HTTP route handlers, API endpoints, Admin UI, or provider switches (reserved for M6.1.5-C and M6.1.5-D).

---

## 2. B1 — Session Validation & Authenticated Identity

### 2.1 Authoritative Verification (`validateAuthoritativeSession`)
- **Location:** `packages/database/src/governance/sessionValidator.ts`
- **Fail-Closed Checklist:**
  - Token hash missing or empty $\rightarrow$ `UNAUTHENTICATED`
  - Session not found in PostgreSQL $\rightarrow$ `UNAUTHENTICATED`
  - Session `expiresAt <= now` $\rightarrow$ `SESSION_EXPIRED`
  - Session status `SUPERSEDED` (rotated token reuse) $\rightarrow$ `SESSION_SUPERSEDED`
  - Session status `REVOKED_MANUAL` / `REVOKED_REPLAY_ATTACK` $\rightarrow$ `SESSION_REVOKED`
  - Session family missing or `status !== 'ACTIVE'` $\rightarrow$ `SESSION_FAMILY_REVOKED`
  - User `isActive: false` or `deactivatedAt !== null` $\rightarrow$ `USER_DEACTIVATED`
  - Database exception $\rightarrow$ `INTERNAL_SECURITY_ERROR`

### 2.2 Request Identity Primitive (`resolveRequestIdentity`)
- **Location:** `packages/database/src/governance/sessionIdentityResolver.ts`
- **Interface:**
  ```ts
  export async function resolveRequestIdentity(
    prisma: PrismaClient,
    input: RequestIdentityInput,
    now: Date = new Date()
  ): Promise<IdentityResolutionResult>
  ```
- **Anti-Impersonation Protection:** If an untrusted caller passes asserted user IDs or roles (e.g. from request bodies or spoofed headers), they are cross-checked against the authoritative `actor`. Any discrepancy terminates the request immediately.

---

## 3. B2 — Session Mutation & Revocation Architecture

### 3.1 Service Implementation (`SessionRevocationService`)
- **Location:** `packages/database/src/governance/sessionRevocationService.ts`
- **Operations:**
  - `revokeSession(input, tx?)`: Atomically marks session as `REVOKED_MANUAL` (or `REVOKED_REPLAY_ATTACK`) and creates a `RevocationEvent` (`targetType: 'SESSION'`).
  - `revokeFamily(input, tx?)`: In compliance with database trigger `trg_check_session_succession_integrity`, revokes all active sibling sessions *before* transitioning the `SessionFamily` status to `REVOKED`. Emits `RevocationEvent` (`targetType: 'FAMILY'`).
  - `revokeAllUserSessions(input, tx?)`: Revokes all sessions and families across a user account. Emits `RevocationEvent` (`targetType: 'USER'`).
  - `registerOrHeartbeatConsumer(input, tx?)`: Upserts a consumer lease in `RevocationConsumer` with fencing generation tracking.
  - `acknowledgeEvent(input, tx?)`: Idempotently registers an ack in `RevocationEventAck`.

### 3.2 Database Constraint & Trigger Compliance
- **Check Constraint `chk_revocation_target_fk_match`:**
  Enforces polymorphic foreign key exclusivity at the database level:
  - When `targetType = 'SESSION'`: `targetSessionId = targetId`, while `targetFamilyId` and `targetUserId` must be `NULL`.
  - When `targetType = 'FAMILY'`: `targetFamilyId = targetId`, while `targetSessionId` and `targetUserId` must be `NULL`.
  - When `targetType = 'USER'`: `targetUserId = targetId`, while `targetSessionId` and `targetFamilyId` must be `NULL`.
- **Trigger `trg_check_session_succession_integrity`:**
  Enforces that no `UserSession` row can be updated if its parent `SessionFamily` is inactive. The revocation service strictly cascades child session revocations prior to invalidating the family row.

---

## 4. B3 — Verification & Regression Results

### 4.1 Unit Test Coverage (`test/sessionSecurity.test.ts`)
- 13/13 tests passing:
  - 8 fail-closed session validation tests (empty tokens, missing sessions, expiry, supersession, manual revocation, family revocation, user deactivation, database error).
  - 3 identity resolution tests (valid resolution, anti-impersonation mismatch rejection, anti-privilege-elevation role rejection).
  - 2 revocation service unit tests (idempotency, unknown session error).

### 4.2 Live PostgreSQL Integration & Concurrency (`test/sessionRevocationIntegration.test.ts`)
- 5/5 tests passing against live Docker PostgreSQL `dentalvis_dev`:
  - `TEST-PG-SEC-01`: Validates live PostgreSQL session and resolves actor.
  - `TEST-PG-SEC-02`: Single session revocation creates `RevocationEvent` and immediately denies subsequent session validation while preserving sibling session.
  - `TEST-PG-SEC-03`: Family revocation cascades to all sibling sessions.
  - `TEST-PG-SEC-04`: Consumer registration, unacked event polling, and idempotent acknowledgement.
  - `TEST-PG-SEC-05`: **Live Concurrency Test** executing two simultaneous revocation transactions (`Promise.all`) racing against the same session without deadlocks or corrupted state.

### 4.3 Full Test Suite Status
- **Total Test Files:** 18 passed (100%).
- **Total Tests:** 232 passed (100%).
- **TypeScript Typecheck:** 0 errors across `@dentalvis/common` and `@dentalvis/database`.

---

## 5. Scope Compliance & Follow-Up Tracking

- **M6.1.5-B Scope:** Strictly adhered to session validation, identity resolution primitives, revocation engine services, concurrency safety, and security tests. Zero API routes or UI components were created.
- **M6.1.5-C Transition:** Future API routes in milestone C will directly consume `resolveRequestIdentity` and `SessionRevocationService`.
