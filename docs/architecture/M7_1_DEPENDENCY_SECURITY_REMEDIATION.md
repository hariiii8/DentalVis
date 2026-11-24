# DentalVis — M7.1 Framework & Dependency Security Remediation

**Document:** M7_1_DEPENDENCY_SECURITY_REMEDIATION.md  
**Date:** 2026-11-25  
**Auditor / Engineer:** DentalVis Platform Engineering  
**Milestone:** M7.1 — Framework & Dependency Security Remediation  
**Phase:** 7 — Operational Readiness & Post-Release Hardening  
**Target Git Branch:** `master`  
**Prior Baseline Commit:** `a563d23 chore(release): complete final readiness audit`  

---

## 1. Executive Summary

During the M6.9 Final Release Readiness Audit, vulnerability scanning via `pnpm audit --prod` identified **6 production vulnerabilities** (2 moderate, 4 high) originating from a transitive PostCSS dependency (`postcss@8.4.31`) bundled by `next@15.5.29` in `apps/web`.

In accordance with Milestone M7.1 objectives, a controlled, evidence-based, minimal dependency remediation was conducted across the DentalVis monorepo without altering clinical content, database schemas, governance authorization, or application runtime behavior.

### Remediation Outcome
- **Production Vulnerabilities Before:** 6 (2 moderate, 4 high)
- **Production Vulnerabilities After:** **0 (No known vulnerabilities found)**
- **Typecheck Result:** **0 Errors** across all monorepo packages (`@dentalvis/common`, `@dentalvis/database`, `apps/web`, `apps/admin`)
- **Automated Tests:** **93 / 93 tests passing (100%)**
- **Production Builds:** Both Web (Next.js) and Admin (Vite) built cleanly for production
- **Live Browser Verification:** Verified across public web (`http://localhost:3000`) and admin portal (`http://localhost:3001`) with **zero unhandled console errors**, functional 3D WebGL anatomical rendering, active bilingual switching, and fail-closed draft protection.

---

## 2. Initial Vulnerability Investigation

A deep inspection of the dependency tree via `pnpm audit --prod`, `pnpm why next`, and `pnpm why postcss` revealed the following:

### Production Vulnerability Details

| ID / Advisory | Package | Installed Version | Severity | Vulnerability Description | Patched Version |
| :--- | :---: | :---: | :---: | :--- | :---: |
| **GHSA-6g55-p6wh-862q** | `postcss` | `8.4.31` | High | Arbitrary file read & info disclosure via `sourceMappingURL` in CSS comments | `>=8.5.12` |
| **GHSA-r28c-9q8g-f849** | `postcss` | `8.4.31` | High | Path traversal in previous source map auto-loading leads to `.map` file disclosure | `>=8.5.18` |
| **GHSA-772p-x543-3wv9** | `postcss` | `8.4.31` | High | Regular expression denial of service (ReDoS) during comment parsing | `>=8.4.35` |
| **GHSA-6342-x57f-4428** | `postcss` | `8.4.31` | High | Arbitrary code execution via line break injection in custom parser | `>=8.5.15` |
| **GHSA-qx2v-qp2m-jg93** | `postcss` | `8.4.31` | Moderate | XSS via unescaped `</style>` in CSS stringify output | `>=8.5.10` |
| **GHSA-fxqj-rqcc-2cmp** | `postcss` | `8.4.31` | Moderate | Incomplete fix of GHSA-6g55-p6wh-862q when `from` option is unset | `>=8.5.23` |

### Dependency Chain
```
apps/web (web@2.0.0)
└─┬ next@15.5.29
  └── postcss@8.4.31 (transitive production dependency)
```

At the same time, `apps/web` devDependencies and `apps/admin` Vite tooling utilized `@tailwindcss/postcss@4.3.5` and `@tailwindcss/vite@4.3.5`, which correctly pulled `postcss@8.5.33`. The vulnerability was isolated strictly to the pinned older version bundled under `next@15.5.29`.

In addition, `@prisma/client` pulled `@prisma/config` which brought:
- `deepmerge-ts@7.1.5` (GHSA-ggr8-5vv4-36mx: high stack exhaustion on recursive objects)
- `effect@3.21.0` (GHSA-7589-6fvf-x4pw: high ReDoS in schema regex)

---

## 3. Remediation Strategy & Compatibility Assessment

### Strategy Evaluation
1. **Upgrading Next.js to Next 16:** Incompatible with current stable Next.js 15 App Router architecture, requires major migration across canary packages.
2. **Broad Update (`pnpm update --latest`):** High risk of breaking React 19 / Three.js / Drei bindings and Tailwind CSS v4.
3. **Workspace Override (`pnpm-workspace.yaml`):** The safest, surgical, minimal approach. By declaring workspace overrides:
   - `postcss: "^8.5.33"`
   - `effect: "^3.22.1"`
   - `deepmerge-ts: "^8.0.0"`
   the package manager forces Next.js and Prisma config to consume the patched, backward-compatible versions without altering any parent library constraints or application code.

### Compatibility Review
- **Next.js:** Version remained at `15.5.29`. Full App Router, SSR, and dynamic API route compilation validated.
- **Tailwind CSS v4:** Uses `@tailwindcss/postcss@4.3.5`, which was already verified against `postcss@8.5.33`.
- **Three.js / React Three Fiber:** Untouched; Three.js `^0.187.0` and R3F `^9.8.2` remain pinned and functional.
- **Vite Admin Application:** Vite v6.4.6 bundle transforms and builds without friction.
- **Prisma & Database:** Prisma v6.19.3 validated cleanly with patched effect and deepmerge-ts.

---

## 4. Applied Modifications

### Files Modified

1. **`pnpm-workspace.yaml`**  
   Added the `overrides` configuration block:
   ```yaml
   packages:
     - 'apps/*'
     - 'packages/*'
   allowBuilds:
     '@prisma/client': true
     '@prisma/engines': true
     esbuild: true
     prisma: true
   overrides:
     postcss: "^8.5.33"
     effect: "^3.22.1"
     deepmerge-ts: "^8.0.0"
   ```

2. **`pnpm-lock.yaml`**  
   Lockfile updated deterministically via `pnpm install`.
   - `postcss@8.4.31` completely removed. All packages now resolve strictly to `postcss@8.5.33`.
   - `deepmerge-ts` updated from `7.1.5` to `8.0.0`.
   - `effect` updated from `3.21.0` to `3.22.1`.

---

## 5. Post-Remediation Verification

### 5.1 Vulnerability Audit
- **Command:** `pnpm audit --prod`
- **Result:**
  ```
  No known vulnerabilities found
  ```
- **Resolution:** 100% of production vulnerabilities resolved (from 6 to 0).

### 5.2 TypeScript Compilation
- `@dentalvis/common`: `tsc --noEmit` — **Exit 0 (No errors)**
- `@dentalvis/database`: `tsc --noEmit` — **Exit 0 (No errors)**
- `apps/web`: `tsc --noEmit` — **Exit 0 (No errors)**
- `apps/admin`: `tsc --noEmit` — **Exit 0 (No errors)**

### 5.3 Automated Regression Tests
- **Command:** `vitest run` on complete test suite (7 test files)
- **Result:** **93 / 93 passed (100%)**
  - `systemIntegration.test.ts` (15/15)
  - `catalogueIntegrity.test.ts` (9/9)
  - `searchAndDiscovery.test.ts` (9/9)
  - `governanceRouteHandlers.test.ts` (24/24)
  - `clinicalReviewService.test.ts` (9/9)
  - `policyAdapter.test.ts` (22/22)
  - `procedureVisualizationInventory.test.ts` (5/5)

### 5.4 Production Build Verification
- **Admin App (`apps/admin`):**
  - Tool: `tsc && vite build`
  - Output: `dist/index.html` (0.53 kB), `dist/assets/index-*.css` (35.20 kB), `dist/assets/index-*.js` (459.77 kB)
  - Status: **Exit 0 (Built in 8.16s)**
- **Web App (`apps/web`):**
  - Tool: `next build`
  - Output: Compiled 15/15 static and dynamic pages with zero syntax or bundling errors.
  - Status: **Exit 0 (Compiled in 25.2s)**

### 5.5 Live Browser Smoke Test Verification
Audited via autonomous browser subagent on active instances:

| Endpoint | Port | Test Performed | Console Errors | Visual / Runtime Result |
| :--- | :---: | :--- | :---: | :---: |
| `/home` | 3000 | Branding, hero, language switcher, footer disclaimer | 0 | **PASS** (Mint/teal glassmorphism clean, toggled Tamil ↔ English) |
| `/explore` | 3000 | 15 clinical specialties, 4 procedures, search query | 0 | **PASS** (Filtered to "Implant" 1 of 4, reset to 4 of 4) |
| `/procedures/root-canal-treatment` | 3000 | 3D WebGL anatomy canvas, layer controls, 6 content sections | 0 | **PASS** (Canvas `1199x749px`, 5 anatomical layer controls active) |
| `/procedures/pediatric-pulpotomy` | 3000 | Unreviewed procedure access | 0 | **PASS** (HTTP 404 fail-closed draft protection verified) |
| `/` (Admin Dashboard) | 3001 | 3 summary cards, Phase 5 pipeline grid | 0 | **PASS** (48 procedures, 6 taxonomies, 5 roles, 4 pipeline stages) |
| `Procedures (48)` | 3001 | Full catalogue register display | 0 | **PASS** (All 48 canonical bilingual procedures rendered) |
| `CRB Governance Workflows` | 3001 | Auth state & governance review forms | 0 | **PASS** (Unauthenticated badge, disabled actions, review forms) |

---

## 6. Remaining Development Dependencies Audit

When running `pnpm audit` (including all devDependencies), 5 dev-only vulnerabilities remain inside `vitest`'s test harness worker dependencies:
- `tinypool` (GHSA-5gmw-xhrv-c9v3, GHSA-85c8-ppgw-ccpr: prototype pollution in dev worker runner)
- `@vitest/mocker` (GHSA-82fw-gwwq-j7x9, GHSA-qxg6-89mg-rqv8: mock registration in test execution)

**Disposition:**  
These dependencies are strictly dev-time test runners in `packages/database`, never bundled into client or server production builds. Upgrading Vitest to v4.x will be addressed in a dedicated test-tooling milestone to prevent disruption to existing mock configurations.

---

## 7. Security Hardening Confirmation

Verified that the dependency override:
- Did **not** disable or alter any Content Security Policy (CSP) or security headers.
- Did **not** weaken Origin/Referer mutation guards in `apiPipeline.ts`.
- Did **not** alter authentication token hashing or session revocation routines.
- Did **not** bypass RBAC or clinical review board authorization requirements.
- Maintained exact 100% frozen baseline alignment (`v1.9.1`).

---

## 8. Milestone Sign-Off

```
========================================================================================
MILESTONE M7.1 CONCLUSION:
PostCSS and associated framework production vulnerabilities successfully remediated.
pnpm audit --prod reports 0 known vulnerabilities.
100% test pass rate (93/93), clean builds, and zero browser regressions.
STATUS: COMPLETE — VERIFIED
========================================================================================
```
