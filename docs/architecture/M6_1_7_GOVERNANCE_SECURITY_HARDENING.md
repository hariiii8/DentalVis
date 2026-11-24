# DentalVis M6.1.7 Architecture & Hardening Record: Governance Security Hardening

**Status:** IMPLEMENTED, SECURITY-TESTED & VERIFIED  
**Architecture Baseline:** v1.9.1 — FROZEN  
**Target Milestone:** M6.1.7 — Governance Security Hardening  
**Date:** 2026-11-25  

---

## 1. Executive Summary

Milestone **M6.1.7 (Governance Security Hardening)** hardens the existing governance security architecture without altering clinical policies, publication rules, or the frozen v1.9.1 baseline.

Key achievements:
1. **SEC-C-01 Remediated (CSRF & Origin Validation):**
   - Implemented strict Origin and Referer validation inside `guardGovernanceApi` in `packages/database/src/governance/apiPipeline.ts`.
   - Any state-changing HTTP mutation (`POST`, `PUT`, `PATCH`, `DELETE`) authenticated via ambient session cookies must provide an `Origin` or `Referer` matching trusted origins (Host header or explicitly configured origins). Missing, untrusted, or mismatched origins fail closed with `403 Forbidden` (`CSRF_ORIGIN_DENIED`).
   - Legitimate `Authorization: Bearer <token>` requests remain unaffected and immune to ambient CSRF.
2. **Direct Route-Handler CSRF Tests Added:**
   - Expanded `packages/database/test/governanceRouteHandlers.test.ts` to include dedicated CSRF test scenarios (`CSRF-01` through `CSRF-04`).
   - Verified that ambient cookie mutations without Origin or with untrusted cross-origin domains are rejected, while matching origins and Bearer-token requests pass.
3. **Session & Authorization Boundary Audit:**
   - Re-verified authoritative session validation, user deactivation checks, anti-impersonation guards, and author self-approval defense across all governance routes.
4. **Zero Scope Creep:**
   - No clinical approvals, publication rules, database migrations, or credentials were changed.

---

## 2. Threat Scenarios & Hardening Details

### 2.1 Cross-Site Request Forgery (CSRF / SEC-C-01)
- **Threat:** A malicious site lures an authenticated dental clinical reviewer into executing an unauthorized governance mutation (e.g. submitting an invalid review or declaring a false COI) using ambient browser session cookies (`dentalvis_session_token`).
- **Defense Implemented:**
  - Route handlers extract request context (`extractGovernanceRequestContext`) and forward it to `guardGovernanceApi`.
  - When `authScheme === 'cookie'` on a mutation method, the guard checks `requestOrigin` against `allowedOrigins`.
  - Missing origin and referer headers terminate with:
    `{ error: { code: 'CSRF_ORIGIN_DENIED', message: 'Cross-site request forgery protection: Origin or Referer missing, invalid, or untrusted.' } }` (HTTP 403).
  - Untrusted cross-origin requests terminate with HTTP 403.
  - Bearer-token requests bypass the ambient cookie origin check because custom HTTP headers cannot be attached cross-origin without CORS preflight clearance.

### 2.2 Author Self-Approval Defense
- **Threat:** A procedure author attempts to approve their own revision.
- **Defense:** Enforced at both the Next.js API route layer (`targetAuthorId: revision.authorId`) and deep in `ClinicalReviewService.submitReview()`.

### 2.3 Identity Spoofing & Role Tampering
- **Threat:** A client sends a mismatched `userId` or asserts elevated roles in request JSON.
- **Defense:** `resolveRequestIdentity` rejects assertions that do not match the database session actor with `ASSERTED_USER_ID_MISMATCH` or `ASSERTED_ROLE_MISMATCH` (HTTP 401).

---

## 3. Test Verification Matrix

| Test Suite / Security Scenario | Target | Status | Result |
| :--- | :--- | :--- | :--- |
| **CSRF Missing Origin (Cookie)** | Route handler | **PASS** | Returns `403 CSRF_ORIGIN_DENIED` |
| **CSRF Untrusted Origin (Cookie)** | Route handler | **PASS** | Returns `403 CSRF_ORIGIN_DENIED` |
| **CSRF Bearer Exemption** | Route handler | **PASS** | Allowed (immune to ambient CSRF) |
| **CSRF Trusted Host Origin (Cookie)**| Route handler | **PASS** | Allowed (201 Created) |
| **Direct Route Handlers Suite** | `governanceRouteHandlers.test.ts` | **PASS** | 24/24 passed |
| **Clinical Review Service Tests** | `clinicalReviewService.test.ts` | **PASS** | 9/9 passed |
| **Policy Adapter Tests** | `policyAdapter.test.ts` | **PASS** | 22/22 passed |
| **Reviewer Eligibility Tests** | `reviewerEligibilityService.test.ts` | **PASS** | 9/9 passed |
| **Publication Preflight Tests** | `publicationPreflightService.test.ts` | **PASS** | 8/8 passed |
| **Governance Audit Tests** | `governanceAuditService.test.ts` | **PASS** | 6/6 passed |
| **Prisma Assignment Repo Tests** | `prismaAssignmentRepository.test.ts` | **PASS** | 7/7 passed |
| **Prisma COI Repo Tests** | `prismaCoiRepository.test.ts` | **PASS** | 7/7 passed |
| **Authorization Service Tests** | `authorizationService.test.ts` | **PASS** | 27/27 passed |
| **Session Security Tests** | `sessionSecurity.test.ts` | **PASS** | 13/13 passed |
| **Total Test Count** | Database test suite | **PASS** | **132/132 tests passed (100%)** |
| **Typechecks** | `common`, `database`, `admin`, `web` | **PASS** | 0 errors across all packages |
| **Admin Production Build** | Vite production bundle | **PASS** | Built in 8.87s |

---

## 4. Remaining Limitations

1. **Local Database Credential Synchronization (ENV-01):** Local development container data volume password must be synchronized with `.env` before live PostgreSQL integration tests can run synchronously.
2. **Quorum Ratification:** Proposed M5 numerical quorum policies remain unratified and fail closed.
