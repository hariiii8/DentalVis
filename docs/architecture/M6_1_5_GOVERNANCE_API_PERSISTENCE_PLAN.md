# DentalVis M6.1.5-A, B, C & D Architecture & Implementation Record: Governance Persistence, Security Foundation, Server-Side API Layer & Admin UI Integration

**Status:** IMPLEMENTED, SECURITY-TESTED & VERIFIED  
**Architecture Baseline:** v1.9.1 — FROZEN  
**Target Milestones:**  
- M6.1.5-A — Governance Persistence (Accepted)  
- M6.1.5-B — Session & Security Foundation (Accepted)  
- M6.1.5-C — Governance Server-Side API Layer (Accepted)  
- M6.1.5-D — Admin UI Governance Integration (Implemented & Verified)  
**Date:** 2026-11-25  

---

## 1. Executive Summary

Milestone **M6.1.5-D (Admin UI Governance Integration)** completes the frontend administrative integration with the secure governance server-side API layer without violating frozen architecture baseline v1.9.1.

This milestone establishes:
1. **Centralized Admin API Client (`apps/admin/src/lib/governanceApi.ts`):**
   - Strictly typed requests and responses (`CoiDeclarationDto`, `ReviewerAssignmentDto`, `ClinicalReviewResultDto`, `ApiErrorResponse`).
   - Token-injected HTTP client sending `Authorization: Bearer <sessionToken>`.
   - Client-side error mapping preserving normalized backend error messages.
2. **Dedicated Governance Workflow UI Components (`apps/admin/src/features/governance/`):**
   - `ReviewerAssignmentsPanel`: Lists active and historical assignments, assigns reviewers with expiration dates, and executes status transitions (`ACCEPT`, `DECLINE`, `REVOKE`).
   - `CoiManagementPanel`: Visualizes active COI declarations, provides multi-question disclosure inputs, and renders admin verification/recusal evaluation controls.
   - `ClinicalReviewOversightPanel`: Provides qualified reviewers with structured rubric scoring, clinical notes, and approval/rejection submission, displaying revision quorum metrics.
3. **Admin Shell Integration (`apps/admin/src/App.tsx`):**
   - New "CRB Governance Workflows" tab added to the administrative portal.
   - Session authentication bar allows administrators and clinical reviewers to supply their session token for authenticated operations.
4. **Authoritative Enforcement Preservation:**
   - No clinical approval or governance logic is evaluated client-side; all lifecycle validation and access controls remain authoritative on the server.

---

## 2. API Pipeline Architecture & Route Inventory

| Route | HTTP Method | Required Scope | Primary Operation | Error Codes |
| :--- | :--- | :--- | :--- | :--- |
| `/api/governance/coi` | `POST` | `crb:review:accept` | Create COI Declaration | `400`, `401`, `403`, `500` |
| `/api/governance/coi` | `GET` | `crb:review:accept` | Get Active COI Declaration | `401`, `403`, `404`, `500` |
| `/api/governance/coi/assess` | `POST` | `crb:coi:audit` | Admin Assess COI (Clear/Recuse) | `400`, `401`, `403`, `404`, `500` |
| `/api/governance/assignments` | `POST` | `crb:review:assign` | Create Reviewer Assignment | `400`, `401`, `403`, `409`, `500` |
| `/api/governance/assignments` | `GET` | `crb:review:assign` | List Reviewer Assignments | `401`, `403`, `500` |
| `/api/governance/assignments/[id]/transition` | `POST` | `crb:review:accept` / `crb:review:assign` | Accept / Decline / Revoke | `400`, `401`, `403`, `404`, `409`, `500` |
| `/api/governance/reviews` | `POST` | `crb:review:submit` | Submit Clinical Review | `400`, `401`, `403`, `404`, `409`, `500` |

---

## 3. Security Controls & Fail-Closed Behavior

1. **Anti-Impersonation Protection:**
   The API guard cross-checks any client-asserted `userId` against the database session actor. If a compromised or malicious client transmits a mismatched ID, the request is immediately rejected with `401 UNAUTHENTICATED`.
2. **Author Self-Approval Defense:**
   The `/api/governance/reviews` endpoint fetches the procedure revision and passes `targetAuthorId: revision.authorId` to `guardGovernanceApi`. The authorization service enforces `AUTHOR_SELF_APPROVAL_PROHIBITED`, returning `403 FORBIDDEN` if the author attempts to review their own work.
3. **Partial Unique Index Conflict Mapping:**
   Assignment creation catches PostgreSQL unique violation code `P2002` (and index `idx_unique_active_reviewer_assignment`), returning a sanitized `409 CONFLICT` without leaking query details.
4. **Anti-Self-Assessment:**
   The COI assessment endpoint catches self-assessment attempts (`assessorAdminId === declarantUserId`) and responds with `403 FORBIDDEN`.

---

## 4. Verification & Regression Evidence

- **Unit & Security Guard Tests (`test/governanceApiPipeline.test.ts`):**
  - 6/6 tests passing: missing tokens, invalid tokens, anti-impersonation mismatch rejection, scope-not-granted rejection, author self-approval defense, and successful authorization grant.
- **Full Database Package Test Suite:**
  - **19/19 test files passed, 238/238 tests passed (100%)**.
- **Typechecks:**
  - `@dentalvis/common`: 0 errors.
  - `@dentalvis/database`: 0 errors.
  - `web` (`apps/web`): 0 errors.
