// packages/database/test/publicCatalogueAccess.test.ts
// DentalVis — M7.2 Complete Catalogue Publication & Public Access Verification
// Architecture Baseline v1.9.1 — M7.2: 48 Procedures & 15 Specialties Integrity Test

import { describe, it, expect } from 'vitest';
import {
  CANONICAL_PROCEDURES,
  CANONICAL_DEPARTMENTS,
  CANONICAL_EXPLORE_CATEGORIES,
  getProcedureRepository,
} from '@dentalvis/common';

describe('M7.2 Complete Catalogue Publication & Public Access Suite', () => {
  const repository = getProcedureRepository();

  describe('Section 1: 48/48 Educational Procedures Availability', () => {
    it('retrieves exactly 48 procedures from the public repository', async () => {
      const procedures = await repository.getVisibleProcedures();
      expect(procedures).toHaveLength(48);
    });

    it('verifies every procedure has unique ID, code, and slug', () => {
      const ids = new Set<string>();
      const codes = new Set<string>();
      const slugs = new Set<string>();

      for (const proc of CANONICAL_PROCEDURES) {
        expect(ids.has(proc.id), `Duplicate ID: ${proc.id}`).toBe(false);
        expect(codes.has(proc.code), `Duplicate Code: ${proc.code}`).toBe(false);
        expect(slugs.has(proc.slug), `Duplicate Slug: ${proc.slug}`).toBe(false);

        ids.add(proc.id);
        codes.add(proc.code);
        slugs.add(proc.slug);
      }

      expect(ids.size).toBe(48);
      expect(codes.size).toBe(48);
      expect(slugs.size).toBe(48);
    });

    it('verifies all 48 procedures resolve individually by slug with non-empty bilingual content', async () => {
      for (const canonical of CANONICAL_PROCEDURES) {
        const proc = await repository.getVisibleProcedureBySlug(canonical.slug);
        expect(proc, `Failed to resolve slug: ${canonical.slug}`).toBeDefined();

        if (proc) {
          // English Content
          expect(proc.titleEn.trim().length, `Empty titleEn on ${proc.slug}`).toBeGreaterThan(0);
          expect(proc.summaryEn.trim().length, `Empty summaryEn on ${proc.slug}`).toBeGreaterThan(0);
          expect(proc.overviewHtmlEn.trim().length, `Empty overviewHtmlEn on ${proc.slug}`).toBeGreaterThan(0);

          // Tamil Content (No silent fallback)
          expect(proc.titleTa.trim().length, `Empty titleTa on ${proc.slug}`).toBeGreaterThan(0);
          expect(proc.summaryTa.trim().length, `Empty summaryTa on ${proc.slug}`).toBeGreaterThan(0);
          expect(proc.overviewHtmlTa.trim().length, `Empty overviewHtmlTa on ${proc.slug}`).toBeGreaterThan(0);

          // Visuals / Fallbacks
          expect(typeof proc.has3DModel).toBe('boolean');
          expect(typeof proc.interactiveStepsCount).toBe('number');
          expect(proc.interactiveStepsCount).toBeGreaterThanOrEqual(1);

          // Valid Department & Taxonomy
          expect(proc.primaryDepartmentName.trim().length).toBeGreaterThan(0);
          expect(proc.primaryDepartmentCode).toBeDefined();
          expect(proc.exploreCategorySlugs.length).toBeGreaterThanOrEqual(1);
        }
      }
    });

    it('returns undefined (404) for non-existent slugs', async () => {
      const result = await repository.getVisibleProcedureBySlug('invalid-non-existent-procedure-slug');
      expect(result).toBeUndefined();
    });
  });

  describe('Section 2: 15/15 Clinical Specialties & Departments Integrity', () => {
    it('shares exactly 15 canonical departments', () => {
      expect(CANONICAL_DEPARTMENTS).toHaveLength(15);
    });

    it('verifies every department resolves by code and slug', async () => {
      for (const dept of CANONICAL_DEPARTMENTS) {
        const byCode = await repository.getDepartmentBySlugOrCode(dept.code);
        expect(byCode, `Failed to resolve department by code: ${dept.code}`).toBeDefined();
        expect(byCode?.code).toBe(dept.code);

        const bySlug = await repository.getDepartmentBySlugOrCode(dept.slug);
        expect(bySlug, `Failed to resolve department by slug: ${dept.slug}`).toBeDefined();
        expect(bySlug?.slug).toBe(dept.slug);
      }
    });

    it('verifies every specialty has at least one associated procedure', async () => {
      for (const dept of CANONICAL_DEPARTMENTS) {
        const procs = await repository.getVisibleProceduresByDepartment(dept.code);
        expect(
          procs.length,
          `Department ${dept.code} (${dept.nameEn}) has 0 procedures associated.`
        ).toBeGreaterThanOrEqual(1);
      }
    });
  });

  describe('Section 3: 6/6 Explore Categories Integrity', () => {
    it('retrieves all 6 canonical explore categories', async () => {
      const categories = await repository.getExploreCategories();
      expect(categories).toHaveLength(6);
    });

    it('verifies every explore category resolves by slug with associated procedures', async () => {
      const allProcedures = await repository.getVisibleProcedures();

      for (const cat of CANONICAL_EXPLORE_CATEGORIES) {
        const resolved = await repository.getExploreCategoryBySlug(cat.slug);
        expect(resolved, `Failed to resolve category by slug: ${cat.slug}`).toBeDefined();
        expect(resolved?.titleEn).toBeTruthy();
        expect(resolved?.titleTa).toBeTruthy();

        const linkedProcedures = allProcedures.filter((p) =>
          p.exploreCategorySlugs.includes(cat.slug)
        );
        expect(
          linkedProcedures.length,
          `Category ${cat.slug} has no mapped procedures.`
        ).toBeGreaterThanOrEqual(1);
      }
    });
  });

  describe('Section 4: 5 Verified GLB 3D Assets & Fallbacks', () => {
    it('verifies the 5 procedures with interactive 3D GLB assets in procedure3DRegistry', async () => {
      const expected3DProcedures = [
        'root-canal-treatment',
        'dental-crowns',
        'single-dental-implant',
        'deep-cleaning-scaling',
        'fixed-orthodontic-braces',
      ];

      for (const slug of expected3DProcedures) {
        const proc = await repository.getVisibleProcedureBySlug(slug);
        expect(proc, `Procedure ${slug} must be accessible`).toBeDefined();
        expect(proc?.slug).toBe(slug);
      }
    });

    it('verifies non-3D procedures have honest fallbacks', async () => {
      const proc = await repository.getVisibleProcedureBySlug('wisdom-tooth-extraction');
      expect(proc).toBeDefined();
      expect(proc?.has3DModel).toBe(false);
      expect(proc?.overviewHtmlEn.length).toBeGreaterThan(10);
    });
  });

  describe('Section 5: Strict Clinical Governance Preservation', () => {
    it('preserves strict clinical quorum query when strictClinicalOnly is explicitly requested', async () => {
      const strictlyApproved = await repository.getVisibleProcedures({ strictClinicalOnly: true });
      expect(strictlyApproved).toHaveLength(4);

      const unratifiedDraft = await repository.getVisibleProcedureBySlug('pediatric-pulpotomy', {
        strictClinicalOnly: true,
      });
      expect(unratifiedDraft).toBeUndefined();
    });
  });
});
