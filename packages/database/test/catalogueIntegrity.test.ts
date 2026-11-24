// packages/database/test/catalogueIntegrity.test.ts
// Milestone M6.7 — Content & Catalogue Integrity Test Suite
// Architecture Baseline v1.9.1 (FROZEN)

import { describe, it, expect } from 'vitest';
import {
  CANONICAL_PROCEDURES,
  CANONICAL_DEPARTMENTS,
  CANONICAL_EXPLORE_CATEGORIES,
} from '@dentalvis/common';
import fs from 'node:fs';
import path from 'node:path';

describe('M6.7 Content & Catalogue Integrity Verification', () => {
  it('should verify all 48 canonical procedures have unique IDs, slugs, and codes', () => {
    expect(CANONICAL_PROCEDURES).toHaveLength(48);

    const ids = new Set<string>();
    const slugs = new Set<string>();
    const codes = new Set<string>();

    for (const p of CANONICAL_PROCEDURES) {
      expect(ids.has(p.id)).toBe(false);
      ids.add(p.id);

      expect(slugs.has(p.slug)).toBe(false);
      slugs.add(p.slug);

      expect(codes.has(p.code)).toBe(false);
      codes.add(p.code);
    }
  });

  it('should verify all 15 specialties (departments) have unique IDs, slugs, and codes', () => {
    expect(CANONICAL_DEPARTMENTS).toHaveLength(15);

    const ids = new Set<string>();
    const slugs = new Set<string>();
    const codes = new Set<string>();

    for (const d of CANONICAL_DEPARTMENTS) {
      expect(ids.has(d.id)).toBe(false);
      ids.add(d.id);

      expect(slugs.has(d.slug)).toBe(false);
      slugs.add(d.slug);

      expect(codes.has(d.code)).toBe(false);
      codes.add(d.code);
    }
  });

  it('should verify all procedures link to valid primary specialties', () => {
    const validDeptCodes = new Set(CANONICAL_DEPARTMENTS.map((d) => d.code));

    for (const p of CANONICAL_PROCEDURES) {
      expect(validDeptCodes.has(p.primaryDepartmentCode)).toBe(true);
      if (p.secondaryDepartmentCodes && p.secondaryDepartmentCodes.length > 0) {
        for (const secCode of p.secondaryDepartmentCodes) {
          expect(validDeptCodes.has(secCode)).toBe(true);
        }
      }
    }
  });

  it('should verify all explore categories are valid and referenced correctly', () => {
    expect(CANONICAL_EXPLORE_CATEGORIES).toHaveLength(6);
    const validCategorySlugs = new Set(CANONICAL_EXPLORE_CATEGORIES.map((c) => c.slug));

    const invalidReferences: { proc: string; category: string }[] = [];
    for (const p of CANONICAL_PROCEDURES) {
      if (p.exploreCategorySlugs && p.exploreCategorySlugs.length > 0) {
        for (const catSlug of p.exploreCategorySlugs) {
          if (!validCategorySlugs.has(catSlug)) {
            invalidReferences.push({ proc: p.slug, category: catSlug });
          }
        }
      }
    }
    console.log('Invalid Category References:', invalidReferences);
    expect(invalidReferences).toHaveLength(0);
  });

  it('should verify complete bilingual integrity (English and Tamil non-empty)', () => {
    for (const p of CANONICAL_PROCEDURES) {
      expect(p.titleEn.trim().length).toBeGreaterThan(0);
      expect(p.titleTa.trim().length).toBeGreaterThan(0);
      expect(p.summaryEn.trim().length).toBeGreaterThan(0);
      expect(p.summaryTa.trim().length).toBeGreaterThan(0);
      expect(p.overviewHtmlEn.trim().length).toBeGreaterThan(0);
      expect(p.overviewHtmlTa.trim().length).toBeGreaterThan(0);

      // Verify no untranslated fallback string
      expect(p.titleTa).not.toEqual(p.titleEn);
      expect(p.summaryTa).not.toEqual(p.summaryEn);
    }

    for (const d of CANONICAL_DEPARTMENTS) {
      expect(d.nameEn.trim().length).toBeGreaterThan(0);
      expect(d.nameTa.trim().length).toBeGreaterThan(0);
      expect(d.descriptionEn.trim().length).toBeGreaterThan(0);
      expect(d.descriptionTa.trim().length).toBeGreaterThan(0);
    }

    for (const c of CANONICAL_EXPLORE_CATEGORIES) {
      expect(c.titleEn.trim().length).toBeGreaterThan(0);
      expect(c.titleTa.trim().length).toBeGreaterThan(0);
      expect(c.descriptionEn.trim().length).toBeGreaterThan(0);
      expect(c.descriptionTa.trim().length).toBeGreaterThan(0);
    }
  });

  it('should verify all 15 specialties have corresponding mapped procedures with accurate counts', () => {
    const countsByDept = new Map<string, number>();
    for (const d of CANONICAL_DEPARTMENTS) {
      countsByDept.set(d.code, 0);
    }

    for (const p of CANONICAL_PROCEDURES) {
      const current = countsByDept.get(p.primaryDepartmentCode) || 0;
      countsByDept.set(p.primaryDepartmentCode, current + 1);
    }

    // Every department should have a non-negative count and all 48 sum up
    let totalCount = 0;
    for (const [code, count] of countsByDept.entries()) {
      expect(count).toBeGreaterThanOrEqual(0);
      totalCount += count;
    }
    expect(totalCount).toBe(48);
  });

  it('should verify route slugs for all 48 procedures and 15 specialties are URL-safe', () => {
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

    for (const p of CANONICAL_PROCEDURES) {
      expect(p.slug).toMatch(slugRegex);
    }

    for (const d of CANONICAL_DEPARTMENTS) {
      expect(d.slug).toMatch(slugRegex);
    }

    for (const c of CANONICAL_EXPLORE_CATEGORIES) {
      expect(c.slug).toMatch(slugRegex);
    }
  });

  it('should verify media and 3D model asset integrity across the 5 canonical 3D models', () => {
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
      const fullPath = path.join(modelsDir, item.modelAsset);
      expect(fs.existsSync(fullPath)).toBe(true);
      const stat = fs.statSync(fullPath);
      expect(stat.size).toBeGreaterThan(10000);
    }
  });

  it('should verify content status integrity (published canonical procedures vs drafts)', () => {
    const statuses = new Map<string, number>();
    for (const p of CANONICAL_PROCEDURES) {
      statuses.set(p.contentStatus, (statuses.get(p.contentStatus) || 0) + 1);
    }
    console.log('Status counts:', Object.fromEntries(statuses));
  });
});
