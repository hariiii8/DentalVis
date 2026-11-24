# DentalVis M6.1.5-A Architecture & Implementation Record: Governance Persistence

**Status:** IMPLEMENTED & VERIFIED  
**Architecture Baseline:** v1.9.1 — FROZEN  
**Target Milestone:** M6.1.5-A — Governance Persistence  
**Date:** 2026-11-25  

---

## 1. Executive Summary

Milestone **M6.1.5-A (Governance Persistence)** replaces mock-only persistence for the DentalVis clinical review and governance subsystem with robust, persistent PostgreSQL-backed Prisma repositories.

This milestone implements:
1. **Prisma Schema Models & Enums:** `ConflictOfInterestDeclaration`, `ReviewerAssignment`, `CoiDeclarationStatus`, and `AssignmentLifecycleStatus`.
2. **Additive PostgreSQL Migration:** `20261125000001_m6_1_5_a_governance_persistence` creating tables, foreign keys with `ON DELETE RESTRICT`, compound indexes, and an engine-level partial unique index.
3. **Partial Unique Index Invariant:** `idx_unique_active_reviewer_assignment` enforces at the PostgreSQL level that no reviewer can have more than one active (`ASSIGNED` or `ACCEPTED`) assignment for the same procedure revision concurrently.
4. **Concrete Repositories:**
   - `PrismaCoiRepository` implementing `ICoiRepository` with hierarchical scope resolution (`REVISION` -> `PROCEDURE` -> `USER_WIDE`), expiration handling, conflict recusal, and self-assessment prevention.
   - `PrismaAssignmentRepository` implementing `IAssignmentRepository` with strict state-machine lifecycle enforcement, reviewer identity checks, and completion verification.
5. **Testing Verification:** Comprehensive unit and live PostgreSQL integration tests validating all constraints, partial unique indexing, lifecycle transitions, and conflict declarations.

---

## 2. Database Schema & Architecture

### 2.1 Enums

```prisma
enum CoiDeclarationStatus {
  SUBMITTED
  VERIFIED_CLEAR
  CONFLICT_DECLARED
  RECUSED
  EXPIRED
  SUPERSEDED
}

enum AssignmentLifecycleStatus {
  ASSIGNED
  ACCEPTED
  DECLINED
  WITHDRAWN
  REVOKED
  EXPIRED
  COMPLETED
}
```

### 2.2 Models and Relationships

- **`ConflictOfInterestDeclaration`**:
  - Bound to `User` (declarant), optional `Procedure`, and optional `ProcedureRevision`.
  - Self-referencing relation `supersededBy` / `supersedes` for historical supersession audit trails.
  - Linked to `User` (assessor admin) with `assessedAt` and `assessmentNotes`.
  - Foreign keys configured with `onDelete: Restrict` to prevent cascade deletions.
- **`ReviewerAssignment`**:
  - Bound to `ProcedureRevision` (target revision) and `User` (assigned reviewer).
  - Linked to `User` (assigning admin) and optional revoking admin.
  - Tracks complete lifecycle timestamps: `assignedAt`, `acceptedAt`, `declinedAt`, `revokedAt`, `completedAt`, and `expiresAt`.

### 2.3 PostgreSQL Partial Unique Index

A standard unique constraint across `(revisionId, reviewerId, status)` would allow a reviewer to simultaneously hold an `ASSIGNED` record and an `ACCEPTED` record for the same revision. To strictly enforce single-active-assignment integrity, an additive migration created:

```sql
CREATE UNIQUE INDEX "idx_unique_active_reviewer_assignment"
ON "ReviewerAssignment" ("revisionId", "reviewerId")
WHERE "status" IN ('ASSIGNED', 'ACCEPTED');
```

Terminal statuses (`DECLINED`, `WITHDRAWN`, `REVOKED`, `EXPIRED`, `COMPLETED`) are excluded from this index, permitting legitimate reassignment after terminal outcomes.

---

## 3. Repositories Implementation

### 3.1 `PrismaCoiRepository`
- **Path:** `packages/database/src/governance/prismaCoiRepository.ts`
- **Scope Hierarchy:** Resolves COI declarations in strict priority order:
  1. Revision-specific (`revisionId`)
  2. Procedure-specific (`procedureId`, `revisionId IS NULL`)
  3. User-wide (`procedureId IS NULL`, `revisionId IS NULL`)
- **Self-Assessment Prevention:** Rejects clearance attempts if `assessorAdminId === userId` (`GOVERNANCE_COI_SELF_ASSESSMENT_PROHIBITED`).
- **Supersession:** Automatically marks older active declarations for the same scope as `SUPERSEDED` when a new declaration is recorded.
- **Fail-Closed:** Missing or unverified declarations return `hasConflict: true` or `isClear: false`.

### 3.2 `PrismaAssignmentRepository`
- **Path:** `packages/database/src/governance/prismaAssignmentRepository.ts`
- **Lifecycle Invariants:**
  - `ASSIGNED` -> `ACCEPTED` (only by the assigned reviewer)
  - `ASSIGNED` / `ACCEPTED` -> `DECLINED` (reviewer recusal/decline)
  - `ASSIGNED` / `ACCEPTED` -> `REVOKED` (by administrator)
  - `ACCEPTED` -> `COMPLETED` (on review submission)
- **Active Assignment Verification:** Rejects new assignment creation if an active assignment already exists for the given revision and reviewer.
- **Expiration:** Validates against `expiresAt` before accepting transitions.

---

## 4. Verification Evidence

### 4.1 Unit Tests
- `packages/database/test/prismaCoiRepository.test.ts`: 7 tests passing.
- `packages/database/test/prismaAssignmentRepository.test.ts`: 7 tests passing.

### 4.2 Live PostgreSQL Integration Tests
- `packages/database/test/governancePersistenceIntegration.test.ts`: 7 tests passing against live Docker PostgreSQL `dentalvis_dev`.
  - Confirms engine-level partial unique index blocks duplicate active assignments (`ASSIGNED` + `ASSIGNED` and `ASSIGNED` + `ACCEPTED`).
  - Confirms terminal status `COMPLETED` allows subsequent reassignment.
  - Confirms full declaration, supersession, clearance, and self-assessment rejection.

### 4.3 Test Suite Summary
- **Database Test Suite:** 16 test files passed, 214 tests passed (100% pass rate).
- **TypeScript Typecheck:** Zero errors in `@dentalvis/database` and `@dentalvis/common`.
