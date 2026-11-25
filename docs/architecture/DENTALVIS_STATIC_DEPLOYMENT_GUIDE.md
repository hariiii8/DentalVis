# DentalVis — Static-Only Public Deployment Guide

**Platform Version:** v1.9.1 (FROZEN ARCHITECTURAL BASELINE)  
**Target Repository:** `https://github.com/hariiii8/DentalVis`  
**Target Branch:** `master`  
**Deployment Target:** Public Educational Web Application (`apps/web`)  
**Hosting Model:** Static / Edge Next.js Hosting (Vercel / Netlify / Cloudflare Pages)

---

## 1. Architecture Overview

DentalVis has been prepared for production deployment as a purely static, public-facing dental education platform. The deployment focuses exclusively on delivering patient educational guides, bilingual dental taxonomy, interactive 3D anatomy models, and 2D clinical illustrations without requiring runtime databases, container daemons, or server-side editorial CMS services.

### 1.1 Deployed vs. Excluded Scope
```
+-----------------------------------------------------------------------------+
|                          DENTALVIS MONOREPO                                 |
+-----------------------------------------------------------------------------+
|                                                                             |
|   DEPLOYED TO PUBLIC WEB HOST:                                              |
|   ============================                                              |
|   * apps/web (Next.js 15.5.29)                                              |
|   * packages/common (Canonical Procedure & Specialty Catalogue)             |
|   * packages/ui (Liquid Glass UI Component System & Tokens)                 |
|                                                                             |
|   EXCLUDED FROM DEPLOYMENT:                                                 |
|   ========================                                                  |
|   * apps/admin (Vite Editorial Portal Prototype - Excluded)                 |
|   * packages/database (Prisma 6 & PostgreSQL Migrations - Inactive)         |
|   * Docker / PostgreSQL Daemons (Zero runtime dependency)                   |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## 2. Why Admin and Database Infrastructure Are Excluded

1. **Patient Education Focus:** The public website's mission is patient education, anxiety reduction, and procedural awareness. It reads exclusively from the canonical in-memory educational catalogue (`StaticProcedureRepository`), which provides verified, bilingual educational guides across all 48 dental procedures.
2. **Zero Runtime Database Vulnerability:** By deploying as a static/edge Next.js application, the platform requires no PostgreSQL database connection, zero connection pools, and zero database credentials. This eliminates SQL injection attack surfaces, database outage risks, and cold-start latency.
3. **Admin Isolation:** The Admin Editorial Portal is an internal prototype utilizing browser `localStorage` for drafting. Excluding it from public hosting ensures internal editorial tools and draft states cannot accidentally be accessed or exposed publicly.

---

## 3. Deployment Configuration & Compatibility

### 3.1 Recommended Host: Vercel
Vercel natively supports Next.js monorepos and provides global CDN distribution for the WebGL 3D GLB assets and SVG illustrations.

### 3.2 Monorepo Configuration (`vercel.json`)
The root configuration file dictates precise build and output targeting:
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "installCommand": "pnpm install",
  "buildCommand": "pnpm --filter @dentalvis/common build && pnpm --filter @dentalvis/ui build && pnpm --filter web build",
  "outputDirectory": "apps/web/.next"
}
```

### 3.3 Root Directory Setting (If configuring Vercel UI directly)
If importing the repository via the Vercel Dashboard without root `vercel.json`:
- **Root Directory:** Leave as `.` (or set to `apps/web` with "Include files outside the Root Directory" enabled).
- **Framework Preset:** `Next.js`
- **Build Command:** `pnpm --filter @dentalvis/common build && pnpm --filter @dentalvis/ui build && pnpm --filter web build`
- **Output Directory:** `apps/web/.next`
- **Node.js Version:** `20.x` or `22.x`

### 3.4 Environment Variables
No runtime secrets or database credentials are required. Optional environment flags:
| Variable | Value | Purpose |
|---|---|---|
| `DENTALVIS_PROCEDURE_PROVIDER` | `static` | Enforces canonical static repository (Default). |
| `NODE_ENV` | `production` | Standard production optimization flag. |

---

## 4. Public Web Capabilities in Static Mode

All public-facing features operate seamlessly without external backend dependencies:
1. **48 Canonical Procedures:** All 48 dental procedures are pre-rendered statically (SSG).
2. **15 Clinical Dental Specialties:** Full department listings with dynamic counts computed from canonical data.
3. **6 Explore Categories:** Complete symptom-based discovery taxonomies.
4. **Bilingual Support:** 100% synchronized English and authentic Tamil Unicode script (`ta`).
5. **Multi-Field Instant Search:** Fast client-side search indexed across 10 distinct fields (titles, summaries, departments, slugs, clinical codes, categories).
6. **3D WebGL Visualization:** 5 genuine GLB models (`deep-cleaning-periodontics.glb`, `dental-crowns-prosthodontics.glb`, `molar-endodontic-anatomy.glb`, `orthodontic-braces-arch.glb`, `single-dental-implant.glb`) served directly from public CDN assets with camera presets, auto-rotate, and 3D/2D switching.
7. **2D Educational Schematics:** 48 dedicated SVGs with interactive, bounded zoom callouts (0.8x to 2.0x).
8. **Responsive Layouts:** Verified across Mobile (375x812, 430x932), Tablet (768x1024), and Desktop (1366x768).
9. **Accessibility & Recovery:** Keyboard skip links, visible focus indicators, and custom bilingual 404 page (`/_not-found`).

---

## 5. Build Verification Evidence

```bash
$ pnpm --filter web build
▲ Next.js 15.5.29
Creating an optimized production build ...
✓ Compiled successfully in 11.0s
Linting and checking validity of types ...
Collecting page data ...
✓ Generating static pages (58/58)
Finalizing page optimization ...
Collecting build traces ...

Route (app)                                         Size  First Load JS
┌ ○ /                                             6.5 kB         127 kB
├ ○ /_not-found                                    141 B         103 kB
├ ƒ /explore                                     8.72 kB         129 kB
├ ƒ /explore/[category]                          3.72 kB         127 kB
├ ○ /home                                        4.35 kB         123 kB
├ ● /procedures/[slug]                            352 kB         472 kB
├   ├ /procedures/root-canal-treatment
├   ├ /procedures/dental-crowns
├   ├ /procedures/deep-cleaning-scaling
├   └ [+45 more paths]
└ ○ /symptoms                                    6.42 kB         121 kB
+ First Load JS shared by all                     102 kB
```

---

## 6. Pre-Deployment Step-by-Step Instructions

When ready to trigger deployment:

1. **Connect Repository to Vercel:**
   - Log into [Vercel](https://vercel.com).
   - Click **Add New Project** and select `hariiii8/DentalVis`.
2. **Confirm Settings:**
   - Framework preset automatically detects `Next.js`.
   - Build Command: `pnpm --filter @dentalvis/common build && pnpm --filter @dentalvis/ui build && pnpm --filter web build`
   - Output Directory: `apps/web/.next`
3. **Deploy:**
   - Click **Deploy**. Build will complete in ~60-90 seconds.
4. **Post-Deployment Verification:**
   - Visit deployed URL (e.g. `https://dentalvis.vercel.app/home`).
   - Check language switch to Tamil.
   - Test search for "root canal" and "impl".
   - Open `/procedures/root-canal-treatment` and verify the 3D tooth model loads and rotates.
   - Open `/explore` and verify all 15 specialties and 48 procedure cards render.

---

## 7. Rollback & Maintenance
- **Instant Rollback:** In the Vercel dashboard, any previous successful deployment can be restored instantly with zero downtime.
- **Git Continuous Integration:** Any commit pushed to `master` will trigger an automated preview/production build.
