# DentalVis M6.1.5-A, B & C Architecture & Implementation Record: Governance Persistence, Security Foundation & Server-Side API Layer

**Status:** IMPLEMENTED, SECURITY-TESTED & VERIFIED  
**Architecture Baseline:** v1.9.1 — FROZEN  
**Target Milestones:**  
- M6.1.5-A — Governance Persistence (Accepted)  
- M6.1.5-B — Session & Security Foundation (Accepted)  
- M6.1.5-C — Governance Server-Side API Layer (Implemented & Verified)  
**Date:** 2026-11-25  

---

## 1. Executive Summary

Milestone **M6.1.5-C (Governance Server-Side API Layer)** connects authenticated HTTP clients directly to backend governance services, authorization logic, and persistent repositories using a fail-closed server-side API pipeline.

This milestone establishes:
1. **Unified Governance API Request Pipeline (`guardGovernanceApi`):**
   - Automatically extracts session credentials (from `Bearer` header or `dentalvis_session_token` cookie).
   - Validates session state authoritatively against PostgreSQL (`validateAuthoritativeSession`).
   - Resolves caller identity (`resolveRequestIdentity`) and verifies that client-asserted `userId` or `role` claims strictly match the verified session actor.
   - Evaluates `GovernanceAuthorizationService` for the required scope and target context (`procedureId`, `revisionId`, `authorId`).
   - Requires explicit `decision === 'ALLOW'`. Any `DENY`, `REQUIRES_VERIFICATION`, or invalid token terminates immediately with `401` or `403`.
2. **Server-Side Next.js Route Handlers (`apps/web/src/app/api/governance/...`):**
   - `POST /api/governance/coi`: Submits COI declarations (Scope: `crb:review:accept`).
   - `GET /api/governance/coi`: Retrieves active COI declarations for the authenticated reviewer.
   - `POST /api/governance/coi/assess`: Admin assessment to `VERIFIED_CLEAR` or `RECUSED` with anti-self-clearance invariant (Scope: `crb:coi:audit`).
   - `POST /api/governance/assignments`: Admin reviewer assignment creation enforcing single-active-assignment partial unique index (Scope: `crb:review:assign`).
   - `GET /api/governance/assignments`: Lists assignments by revision/reviewer (Scope: `crb:review:assign`).
   - `POST /api/governance/assignments/[id]/transition`: Reviewer acceptance (`ACCEPT`), decline (`DECLINE`), or admin revocation (`REVOKE`).
   - `POST /api/governance/reviews`: Submits clinical review via `ClinicalReviewService`, enforcing reviewer eligibility, author/reviewer separation, active accepted assignment, and automatic assignment completion transition (Scope: `crb:review:submit`).
3. **Zero Scope Creep:** Admin UI frontend screens, static-to-database cutover, provider switches, and publication cutovers remain strictly untouched.

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
