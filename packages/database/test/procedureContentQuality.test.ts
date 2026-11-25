// packages/database/test/procedureContentQuality.test.ts
// Milestone M7.4 — Procedure Content Quality & Bilingual Consistency Verification
// Architecture Baseline v1.9.1 (FROZEN)

import { describe, it, expect } from 'vitest';
import {
  CANONICAL_PROCEDURES,
  CANONICAL_DEPARTMENTS,
  CANONICAL_EXPLORE_CATEGORIES,
} from '@dentalvis/common';

describe('M7.4 Procedure Content Quality & Bilingual Consistency Verification', () => {
  it('should verify all 48 procedures have non-empty English and Tamil core fields', () => {
    expect(CANONICAL_PROCEDURES).toHaveLength(48);

    for (const p of CANONICAL_PROCEDURES) {
      // 1. Basic identifiers
      expect(p.id).toBeDefined();
      expect(p.slug).toMatch(/^[a-z0-9-]+$/);
      expect(p.code).toMatch(/^[A-Z0-9-]+$/);

      // 2. English titles and summaries
      expect(p.titleEn.trim().length).toBeGreaterThanOrEqual(5);
      expect(p.summaryEn.trim().length).toBeGreaterThanOrEqual(30);
      expect(p.summaryEn).not.toContain('TODO');
      expect(p.summaryEn).not.toContain('Lorem ipsum');

      // 3. Tamil titles and summaries
      expect(p.titleTa.trim().length).toBeGreaterThanOrEqual(5);
      expect(p.summaryTa.trim().length).toBeGreaterThanOrEqual(30);
      expect(p.summaryTa).not.toContain('TODO');
      expect(p.summaryTa).not.toContain('Lorem ipsum');

      // 4. Tamil script validation in Tamil fields
      const taTitleHasTamil = /[\u0B80-\u0BFF]/.test(p.titleTa);
      const taSummaryHasTamil = /[\u0B80-\u0BFF]/.test(p.summaryTa);
      expect(taTitleHasTamil).toBe(true);
      expect(taSummaryHasTamil).toBe(true);

      // 5. Overviews completeness and depth
      expect(p.overviewHtmlEn.trim().length).toBeGreaterThanOrEqual(300);
      expect(p.overviewHtmlTa.trim().length).toBeGreaterThanOrEqual(300);

      // 6. Valid HTML formatting
      expect(p.overviewHtmlEn).toContain('<p>');
      expect(p.overviewHtmlEn).toContain('</p>');
      expect(p.overviewHtmlTa).toContain('<p>');
      expect(p.overviewHtmlTa).toContain('</p>');

      // No unclosed tags or malformed markers
      expect(p.overviewHtmlEn).not.toContain('<undefined>');
      expect(p.overviewHtmlTa).not.toContain('<undefined>');
      expect(p.overviewHtmlEn).not.toContain('[object Object]');
      expect(p.overviewHtmlTa).not.toContain('[object Object]');

      // 7. Clinical metadata
      expect(p.durationMinutes).toBeGreaterThanOrEqual(15);
      expect(p.durationMinutes).toBeLessThanOrEqual(480);
      expect(p.anesthesiaType.trim().length).toBeGreaterThan(3);

      // 8. Department taxonomy linkage
      expect(p.primaryDepartmentCode).toBeDefined();
      const deptExists = CANONICAL_DEPARTMENTS.some(d => d.code === p.primaryDepartmentCode);
      expect(deptExists).toBe(true);

      // 9. Explore category linkage
      expect(p.exploreCategorySlugs.length).toBeGreaterThanOrEqual(1);
      for (const catSlug of p.exploreCategorySlugs) {
        const catExists = CANONICAL_EXPLORE_CATEGORIES.some(c => c.slug === catSlug);
        expect(catExists).toBe(true);
      }
    }
  });

  it('should verify there is no duplicate summary text across any procedures', () => {
    const enSummaries = new Set<string>();
    const taSummaries = new Set<string>();

    for (const p of CANONICAL_PROCEDURES) {
      expect(enSummaries.has(p.summaryEn)).toBe(false);
      enSummaries.add(p.summaryEn);

      expect(taSummaries.has(p.summaryTa)).toBe(false);
      taSummaries.add(p.summaryTa);
    }

    expect(enSummaries.size).toBe(48);
    expect(taSummaries.size).toBe(48);
  });

  it('should verify no silent English fallback occurs in Tamil overviews', () => {
    for (const p of CANONICAL_PROCEDURES) {
      // Strip HTML tags
      const plainTa = p.overviewHtmlTa.replace(/<[^>]+>/g, '').trim();
      const taCharCount = (plainTa.match(/[\u0B80-\u0BFF]/g) || []).length;
      const totalChars = plainTa.replace(/\s+/g, '').length;

      // Tamil text should have at least 70% Tamil Unicode script characters (allowing for English technical loan terms)
      const tamilRatio = taCharCount / totalChars;
      expect(tamilRatio).toBeGreaterThan(0.70);
    }
  });

  it('should verify clinical governance safety invariants remain uncorrupted', () => {
    const published = CANONICAL_PROCEDURES.filter(p => p.contentStatus === 'PUBLISHED');
    const drafts = CANONICAL_PROCEDURES.filter(p => p.contentStatus === 'DRAFT');

    // Exactly the original 4 procedures are PUBLISHED; 44 remain internal DRAFT
    expect(published).toHaveLength(4);
    expect(drafts).toHaveLength(44);

    const publishedSlugs = published.map(p => p.slug).sort();
    expect(publishedSlugs).toEqual([
      'deep-cleaning-scaling',
      'dental-crowns',
      'root-canal-treatment',
      'single-dental-implant',
    ]);
  });
});
