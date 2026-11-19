# DentalVis 2.0

> A bilingual (English & Tamil) dental education platform designed to dismantle patient anxiety through crystal-clear visual clarity on dental conditions, anatomical structures, and clinical treatments.

## Architecture & Technology Stack
- **Monorepo:** pnpm workspaces + Turborepo
- **Patient Website:** Next.js 15 (App Router, React Server Components)
- **Clinical Editorial Portal:** Vite 6 + React 19 SPA
- **Shared Packages:** `@dentalvis/ui`, `@dentalvis/common`, `@dentalvis/tsconfig`, `@dentalvis/database`
- **Styling:** Tailwind CSS v4 ("Liquid Glass" light healthcare palette)
- **Database Layer:** PostgreSQL 16 + Prisma ORM (Phase 2.2)

## Getting Started

### 1. Prerequisites
- Node.js >= 22.0.0
- pnpm >= 9.0.0

### 2. Installation
```bash
pnpm install
```

### 3. Development
```bash
# Run all workspaces in parallel
pnpm dev

# Or run specific applications:
pnpm --filter web dev    # Patient website on http://localhost:3000
pnpm --filter admin dev  # Clinical portal on http://localhost:3001
```

### 4. Quality Checks & Verification
```bash
pnpm typecheck
pnpm build
```

## Structure
```
dentalvis/
├── apps/
│   ├── web/      # Next.js 15 Patient-facing application
│   └── admin/    # Vite 6 Clinical editorial portal
├── packages/
│   ├── ui/       # Shared Liquid Glass React component library
│   ├── common/   # Shared TypeScript types, taxonomy & mock models
│   ├── tsconfig/ # Monorepo strict TypeScript configurations
│   └── database/ # Prisma ORM schema & client package
└── docs/
    └── architecture/ # Architecture Baseline v1.9.1 specifications
```
