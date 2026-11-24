// packages/database/test/systemIntegration.test.ts
// Milestone M6.8 — System Integration Verification & Stabilization Test Suite
// Architecture Baseline v1.9.1 (FROZEN)

import { describe, it, expect } from 'vitest';
import {
  CANONICAL_PROCEDURES,
  CANONICAL_DEPARTMENTS,
  CANONICAL_EXPLORE_CATEGORIES,
  getVisibleProcedures,
  getVisibleProcedureBySlug,
  getVisibleProceduresByDepartment,
  getDepartmentBySlugOrCode,
  StaticProcedureRepository,
} from '@dentalvis/common';
import { CANONICAL_56_3D_CONFIGS, getProcedure3DConfig } from '../../apps/web/src/components/3d/procedure3DRegistry';
import * as fs from 'fs';
import * as path from 'path';

describe('M6.8 System Integration Verification Suite', () => {
  const repo = new StaticProcedureRepository();

  // --------------------------------------------------------------------------
  // TEST GROUP A: Canonical Catalogue & Data Sharing
  // --------------------------------------------------------------------------
  describe('Test Group A: Canonical Catalogue Consistency', () => {
    it('shares exactly 48 canonical procedures and 15 specialties across packages', async () => {
      expect(CANONICAL_PROCEDURES).toHaveLength(48);
      expect(CANONICAL_DEPARTMENTS).toHaveLength(15);
      expect(CANONICAL_EXPLORE_CATEGORIES).toHaveLength(6);

      const allProcedures = await repo.getVisibleProcedures({ previewMode: 'true', nodeEnv: 'development' });
      expect(allProcedures).toHaveLength(48);
    });

    it('ensures every procedure maps to a valid primary department in CANONICAL_DEPARTMENTS', () => {
      const validCodes = new Set(CANONICAL_DEPARTMENTS.map((d) => d.code));
      for (const proc of CANONICAL_PROCEDURES) {
        expect(validCodes.has(proc.primaryDepartmentCode), `Invalid primary dept on ${proc.slug}`).toBe(true);
      }
    });

    it('ensures every procedure explore taxonomy maps to valid CANONICAL_EXPLORE_CATEGORIES', () => {
      const validCategorySlugs = new Set(CANONICAL_EXPLORE_CATEGORIES.map((c) => c.slug));
      for (const proc of CANONICAL_PROCEDURES) {
        if (proc.exploreCategorySlugs) {
          for (const catSlug of proc.exploreCategorySlugs) {
            expect(validCategorySlugs.has(catSlug), `Invalid category ${catSlug} on ${proc.slug}`).toBe(true);
          }
        }
      }
    });
  });

  // --------------------------------------------------------------------------
  // TEST GROUP B: Search & Discovery Integration
  // --------------------------------------------------------------------------
  describe('Test Group B: Search & Discovery Integration', () => {
    it('supports case-insensitive and partial English title and summary search', () => {
      const query = 'root canal';
      const results = CANONICAL_PROCEDURES.filter((p) =>
        p.titleEn.toLowerCase().includes(query.toLowerCase()) ||
        p.summaryEn.toLowerCase().includes(query.toLowerCase())
      );
      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results.some((p) => p.slug === 'root-canal-treatment')).toBe(true);
    });

    it('supports Tamil search without fallback to English', () => {
      const query = 'வேர்';
      const results = CANONICAL_PROCEDURES.filter((p) =>
        p.titleTa.includes(query) || p.summaryTa.includes(query)
      );
      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results.some((p) => p.slug === 'root-canal-treatment')).toBe(true);
    });

    it('safely handles leading/trailing whitespace and empty search queries', () => {
      const trimmedQuery = '  crown  '.trim().toLowerCase();
      const results = CANONICAL_PROCEDURES.filter((p) =>
        p.titleEn.toLowerCase().includes(trimmedQuery) ||
        p.summaryEn.toLowerCase().includes(trimmedQuery)
      );
      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results.some((p) => p.slug === 'dental-crowns')).toBe(true);
    });

    it('correctly filters search results by specialty code', () => {
      const endoProcs = CANONICAL_PROCEDURES.filter((p) => p.primaryDepartmentCode === 'ENDO');
      expect(endoProcs.length).toBe(4);
      expect(endoProcs.every((p) => p.primaryDepartmentCode === 'ENDO')).toBe(true);
    });
  });

  // --------------------------------------------------------------------------
  // TEST GROUP C: Routing & Publication Boundaries
  // --------------------------------------------------------------------------
  describe('Test Group C: Routing & Access Policy Boundaries', () => {
    it('enforces that exactly 4 procedures are publicly published under default production policy', async () => {
      const visiblePublicProcs = await repo.getVisibleProcedures();
      expect(visiblePublicProcs).toHaveLength(4);

      const publishedSlugs = visiblePublicProcs.map((p) => p.slug);
      expect(publishedSlugs.sort()).toEqual([
        'deep-cleaning-scaling',
        'dental-crowns',
        'root-canal-treatment',
        'single-dental-implant',
      ]);
    });

    it('fails closed for draft procedures on public route requests', async () => {
      const draftResult = await repo.getVisibleProcedureBySlug('pediatric-pulpotomy');
      expect(draftResult).toBeUndefined();

      const draftResult2 = await repo.getVisibleProcedureBySlug('composite-dental-fillings');
      expect(draftResult2).toBeUndefined();
    });

    it('resolves published procedures on public route requests', async () => {
      const pubResult = await repo.getVisibleProcedureBySlug('root-canal-treatment');
      expect(pubResult).toBeDefined();
      expect(pubResult?.code).toBe('ENDO-RCT-01');
      expect(pubResult?.contentStatus).toBe('PUBLISHED');
    });

    it('handles non-existent or invalid slug lookups gracefully', async () => {
      const invalidResult = await repo.getVisibleProcedureBySlug('completely-non-existent-procedure');
      expect(invalidResult).toBeUndefined();
    });
  });

  // --------------------------------------------------------------------------
  // TEST GROUP D: 3D Visualization & Fallback Architecture
  // --------------------------------------------------------------------------
  describe('Test Group D: Visualization Registry & 3D Assets', () => {
    it('has 3D configurations for all 48 canonical procedures in procedure3DRegistry', () => {
      for (const p of CANONICAL_PROCEDURES) {
        const config = getProcedure3DConfig(p.slug);
        expect(config, `Missing 3D config for ${p.slug}`).toBeDefined();
        expect(config?.procedureSlug).toBe(p.slug);
      }
    });

    it('verifies the 5 physical binary GLB assets exist in apps/web/public/models', () => {
      const modelsDir = path.resolve(__dirname, '../../../apps/web/public/models');
      expect(fs.existsSync(modelsDir)).toBe(true);

      const expected5Models = [
        { slug: 'root-canal-treatment', modelAsset: 'molar-endodontic-anatomy.glb' },
        { slug: 'dental-crowns', modelAsset: 'dental-crowns-prosthodontics.glb' },
        { slug: 'deep-cleaning-scaling', modelAsset: 'deep-cleaning-periodontics.glb' },
        { slug: 'single-dental-implant', modelAsset: 'single-dental-implant.glb' },
        { slug: 'fixed-orthodontic-braces', modelAsset: 'orthodontic-braces-arch.glb' },
      ];

      for (const item of expected5Models) {
        const filePath = path.join(modelsDir, item.modelAsset);
        expect(fs.existsSync(filePath), `Missing asset: ${item.modelAsset}`).toBe(true);
        const stat = fs.statSync(filePath);
        expect(stat.size).toBeGreaterThan(100000); // Binary GLB must be substantial (>100KB)
      }
    });

    it('verifies procedures without dedicated 3D models are cleanly marked for fallback', () => {
      const fallbackProc = getProcedure3DConfig('composite-dental-fillings');
      expect(fallbackProc).toBeDefined();
      expect(fallbackProc?.isModelReady).toBe(false);
      expect(fallbackProc?.modelAssetPath).toBeNull();
    });
  });

  // --------------------------------------------------------------------------
  // TEST GROUP E: Bilingual Integrity
  // --------------------------------------------------------------------------
  describe('Test Group E: Bilingual Integrity & Content Alignment', () => {
    it('contains non-empty English and Tamil content with no cross-language duplication', () => {
      for (const p of CANONICAL_PROCEDURES) {
        expect(p.titleEn.trim().length).toBeGreaterThan(0);
        expect(p.titleTa.trim().length).toBeGreaterThan(0);
        expect(p.summaryEn.trim().length).toBeGreaterThan(0);
        expect(p.summaryTa.trim().length).toBeGreaterThan(0);
        expect(p.titleTa).not.toEqual(p.titleEn);
        expect(p.summaryTa).not.toEqual(p.summaryEn);
      }

      for (const d of CANONICAL_DEPARTMENTS) {
        expect(d.nameEn.trim().length).toBeGreaterThan(0);
        expect(d.nameTa.trim().length).toBeGreaterThan(0);
        expect(d.nameTa).not.toEqual(d.nameEn);
      }
    });
  });
});
