# DentalVis — M6.1.4 Governance Services Core Architecture & Implementation Plan

**Baseline Architecture:** v1.9.1 (FROZEN)  
**Accepted Milestones:** M6.1.1 (Audit Immutability), M6.1.2 (Core Governance Types & Policy Adapter), M6.1.3 (Server-Side RBAC & Governance Authorization Service)  
**M6.1.3 Audit Verdict:** `SECURITY AUDIT ACCEPTED — READY FOR M6.1.4 PLANNING` (Commit `48314ef`)  
**Reported Planning Commit:** `a9d4b27`  
**Target Milestone:** M6.1.4 — Core Governance Services (`ReviewerEligibilityService`, `ClinicalReviewService`, `GovernanceAuditService`, `PublicationPreflightService`)  
**Document Revision:** 5.0.0 (Post-Implementation Verified State)  
**Implementation Status:** **IMPLEMENTATION COMPLETE & VERIFIED** (193/193 database tests passing, 0 type errors)  
**Repository:** https://github.com/hariiii8/DentalVis  
**Branch:** `master`

---

## 1. Document Revision History & Resolution Log

| Version | Date / Trigger | Summary of Changes |
| :--- | :--- | :--- |
| **1.0.0** | 2026-11-24 (Commit `a9d4b27`) | Initial draft defining service boundaries, contracts, and threat models. Contained unratified policy assumptions and naive risk metadata assumptions. |
| **2.0.0** | 2026-11-24 (Correction Pass) | Removed hardcoded 2-reviewer quorum; removed universal Tamil sign-off; excised unratified thresholds (monetary, 90d verification, SLAs); corrected risk metadata resolution. |
| **3.0.0** | 2026-11-24 (Decision Pass) | Formulated authoritative COI and assignment models; defined 4-stage quorum lifecycle; specified multi-record row locking protocol. |
| **4.0.0** | 2026-11-24 (Final Verification Pass) | Resolved preflight audit write contradiction (strictly read-only); audited actual session revocation paths in code; distinguished service interfaces from production persistence; analyzed `ProcedureApproval` vs individual review semantics. |
| **5.0.0** | 2026-11-24 (Implementation Complete) | **Implementation Delivered:** Implemented `ReviewerEligibilityService`, `GovernanceAuditService`, `ClinicalReviewService`, `PublicationPreflightService`, and supporting interfaces in `packages/database/src/governance/`. Delivered comprehensive test suites covering all 4 services. All 13 test files (193 tests) passing with 0 type errors. Documented verified evidence, exact test counts, and production persistence boundaries. |

---

## 2. Policy-Compliance & Ratification Matrix

| Policy Key / Requirement | Origin | Formal Status | Runtime Treatment in M6.1.4 | Architectural Rule |
| :--- | :--- | :--- | :--- | :--- |
| **`governance:no_ai_signoff`** | M4 Protocol §1 | **RATIFIED** | Mandatory Enforced Invariant | Reviewers must be authenticated human practitioners with verified credentials. Automated AI sign-off is prohibited. |
| **`governance:author_separation`** | M4 Protocol §2 | **RATIFIED** | Mandatory Enforced Invariant | Revision author is strictly prohibited from reviewing or approving their own revision (`authorId !== reviewerId`). |
| **`governance:decoupled_media`** | M4 Protocol §2 | **RATIFIED** | Mandatory Enforced Invariant | Text approval proceeds independently of media assets; media rendering requires independent verification. |
| **`governance:sedation_permits`** | M4 Protocol §2 | **RATIFIED** | Mandatory Enforced Invariant | Universal 5-year tenure rule is prohibited. Evaluates verified jurisdiction permits, residency training, and specialty scope. |
| **`governance:surgical_specialty`** | M4 Protocol §2 | **RATIFIED** | Mandatory Enforced Invariant | Tier 3 surgical procedures require recognized specialty (OMFS, Periodontics). Commercial certificates rejected as standalone. |
| **`publication:fail_closed_filter`** | Baseline v1.9.1 | **RATIFIED** | Mandatory Enforced Invariant | Unapproved drafts and unverified revisions are excluded fail-closed from public view. |
| **`audit:immutability_triggers`** | M6.1.1 Migration | **RATIFIED** | Mandatory Enforced Invariant | Row-level triggers forbid `UPDATE`, `DELETE`, and `TRUNCATE` on `AdminAuditLog`. |
| **`quorum:tier:TIER_1/2/3`** | M5 Proposal | **UNRATIFIED** | **Fail-Closed Runtime Check** | **No numerical quorum may be invented.** Quorum rules are evaluated dynamically via `PolicyConfigurationAdapter`. Unratified policies block approval eligibility. |
| **`bilingual:tamil_signoff`** | M5 Proposal | **UNRATIFIED** | **Optional Capability Only** | Tamil translation sign-off is NOT a universal publication blocker for English canonical procedures. |
| **`coi:commercial_threshold`** | M5 Proposal | **UNRATIFIED** | **Unratified Proposal** | No monetary disclosure threshold is enforced by code. COI checks evaluate explicit declaration state and relationship conflicts. |
| **`credential:verification_window`**| M5 Proposal | **UNRATIFIED** | **Unratified Proposal** | Credential validity is driven strictly by statutory licensing expiration (`expiresAt`), not synthetic 90-day intervals. |
| **`reassessment:tier:*`** | M5 Proposal | **UNRATIFIED** | **Unratified Proposal** | Informative metadata only; not a blocking runtime gate for M6.1.4 core services. |
| **`sla:assignment_acceptance`** | M5 Proposal | **NON-BINDING** | **Informative Metric Only** | Turnaround targets (e.g. 5 days) are logged for monitoring; never used to invalidate reviews or block publication. |

---

## 3. Implemented Service Architecture & Contracts

### 3.1 Service A: `ReviewerEligibilityService`
- **Location:** `packages/database/src/governance/reviewerEligibilityService.ts`
- **Responsibilities:**
  - Evaluates contextual reviewer qualifications against procedure scope, recognized specialty, statutory licensing, jurisdiction, procedural permits (`M4-POL-002`, `M4-POL-005`), and active COI recusal state.
  - Prohibits author self-review fail-closed (`AUTHOR_SELF_REVIEW_PROHIBITED`).
  - Queries `ICoiRepository` for active declarations. Fails closed if COI is recused, expired, conflicted, missing, or repository is unreachable.
  - Enforces context-sensitive qualifications without universal dental degree mandates (e.g., BDS/DDS) for non-doctor scopes.

### 3.2 Service B: `GovernanceAuditService`
- **Location:** `packages/database/src/governance/governanceAuditService.ts`
- **Responsibilities:**
  - Implements deterministic RFC 8785 canonical JSON sorting (`canonicalizeJson`) and SHA-256 payload hashing (`computePayloadHash`).
  - Emits immutable audit records to `AdminAuditLog` table protected by PostgreSQL trigger `trg_admin_audit_log_immutable`.
  - Supports participation in atomic interactive transactions (`Prisma.TransactionClient`).
  - Exposes `verifyAuditIntegrity()` to detect out-of-band tampering.
  - Strictly append-only: exposes no update, delete, or truncate methods.

### 3.3 Service C: `ClinicalReviewService`
- **Location:** `packages/database/src/governance/clinicalReviewService.ts`
- **Responsibilities:**
  - Accepts individual review decisions (`ApprovalDecision`: `APPROVED` | `REJECTED`).
  - Verifies authorization via `GovernanceAuthorizationService.authorize()` (requires explicit `ALLOW`).
  - Enforces author-reviewer separation and authoritative assignment validation via `IAssignmentRepository`.
  - Re-evaluates contextual eligibility at submission time via `ReviewerEligibilityService`.
  - Executes mutations inside an atomic transaction with `REPEATABLE READ` isolation and bounded retry handling (max 3 attempts with exponential backoff on `40001` serialization failure).
  - Evaluates quorum dynamically via `PolicyConfigurationAdapter`. If quorum policy is unratified or missing, revision remains `PENDING_APPROVAL` (fail-closed) without inventing numerical thresholds.
  - Inserts immutable audit records in the same transaction; failure rolls back the review mutation.
  - Handles approval revocation (`revokeApproval`), demoting revision status and recording immutable revocation events.

### 3.4 Service D: `PublicationPreflightService`
- **Location:** `packages/database/src/governance/publicationPreflightService.ts`
- **Responsibilities:**
  - Performs strict, read-only evaluation of publication prerequisites without mutating any state.
  - Recalculates canonical RFC 8785 SHA-256 digest of `snapshotData` and compares to `contentHash`.
  - Validates that approvals are active, unrevoked, and author-separated.
  - Evaluates category specialist alignment (`governance:surgical_specialty`).
  - Evaluates media asset inspection status (`governance:decoupled_media`).
  - Decoupled language validation: checks Tamil translation only if Tamil is targeted.
  - **Zero Write Call Guarantee:** Executes only `findUnique` queries. Zero audit log insertion, zero status updates.

---

## 4. Verification Evidence & Test Results

All unit and integration tests across `@dentalvis/database` were executed against the local environment:

| Test Suite File | Test Count | Status | Key Invariants Verified |
| :--- | :--- | :--- | :--- |
| `test/reviewerEligibilityService.test.ts` | 9 passed | **PASSED** | Author separation, COI states (missing, expired, recused, unreachable), statutory credentials, sanctions, sedation permits (`M4-POL-002`), surgical specialty (`M4-POL-005`). |
| `test/governanceAuditService.test.ts` | 6 passed | **PASSED** | Deterministic RFC 8785 canonical JSON sorting, SHA-256 digest consistency, immutable log emission, input validation, audit integrity verification, tamper detection. |
| `test/clinicalReviewService.test.ts` | 9 passed | **PASSED** | Explicit `ALLOW` authorization, rejection of `DENY` & `REQUIRES_VERIFICATION`, author self-approval rejection, assignment status validation, eligibility re-check, duplicate prevention, unratified quorum fail-closed, approval revocation & status demotion. |
| `test/publicationPreflightService.test.ts` | 8 passed | **PASSED** | Content-hash verification via RFC 8785, tampering detection, unapproved status blocking, revoked approval blocking, unratified quorum fail-closed, specialist matching, unverified media blocking, strictly read-only guarantee (zero writes). |
| `test/authorizationService.test.ts` | 27 passed | **PASSED** | Authoritative session checks, role-permission matrix, CRB identity scopes, contextual clinical eligibility. |
| `test/auditLogImmutability.test.ts` | 6 passed | **PASSED** | Database-level triggers: rejects UPDATE, rejects DELETE, rejects TRUNCATE, prevents cascading deletion. |
| `test/policyAdapter.test.ts` | 22 passed | **PASSED** | Fail-closed unratified policy adapter, version provenance, jurisdiction sensitivity. |
| `test/seedPlanner.test.ts` | 44 passed | **PASSED** | Advisory transaction locks, atomic execution, rollback on failure. |
| `test/databaseProcedureRepository.test.ts` | 14 passed | **PASSED** | Dynamic procedure repository and query filters. |
| `test/serverProcedureRepository.test.ts` | 11 passed | **PASSED** | Server repository isolation and static fallback. |
| `test/domainInvariants.test.ts` | 22 passed | **PASSED** | Category isolation, slug formats, revision numbering. |
| `test/exploreIntegration.test.ts` | 7 passed | **PASSED** | Exploration taxonomy and procedure associations. |
| `test/procedureDetailIntegration.test.ts` | 8 passed | **PASSED** | Procedure detail and snapshot rendering. |

**Total Database Test Results:** **13/13 test files passed, 193/193 tests passed (100% pass rate).**  
**TypeScript Typecheck:** `tsc --noEmit` exited with code 0 across `@dentalvis/database` and `@dentalvis/common`.

---

## 5. Production Persistence & Activation Boundaries

The milestone establishes strict boundaries regarding repository persistence:

1. **Service Abstractions Implemented:**
   - Services interact cleanly with `ICoiRepository` and `IAssignmentRepository`.
   - Unit tests use deterministic mock implementations to rigorously verify business logic without database coupling.
2. **Production Safeguards:**
   - In-memory or mock repositories are **strictly forbidden** from being used in production composition.
   - If persistent COI or assignment data is unreachable or uninitialized, services fail closed with `COI_REPOSITORY_UNAVAILABLE` or `ASSIGNMENT_REPOSITORY_UNAVAILABLE`.
3. **Remaining Persistence Blockers for Operational Workflows:**
   - Creating PostgreSQL tables and Prisma models for `ConflictOfInterestDeclaration` and `ReviewerAssignment` is scheduled for **Milestone M6.1.5** alongside HTTP API route integration.
   - Formal Clinical Review Board ratification of numerical quorum thresholds (`quorum:tier:*`) is required before procedure revisions can automatically transition to `APPROVED`.
   - Session revocation mutation endpoints (with symmetric multi-record locking) must be constructed before full operational review cutover.
