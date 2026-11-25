// packages/database/test/searchAndDiscovery.test.ts
// M6.5 — Search & Discovery Experience Verification Suite
// Validates search matching across English & Tamil, case-insensitivity, partial matching,
// specialty filtering, deterministic sorting, and empty/no-result queries.

import { describe, it, expect } from 'vitest';
import { CANONICAL_PROCEDURES, CANONICAL_DEPARTMENTS } from '@dentalvis/common';

describe('M6.5 Search & Discovery Experience Engine', () => {
  it('has all 48 canonical procedures available for search and discovery', () => {
    expect(CANONICAL_PROCEDURES.length).toBe(48);
  });

  it('performs case-insensitive English title search matching', () => {
    const query = 'rOoT cAnAl';
    const normalized = query.trim().toLowerCase();
    const results = CANONICAL_PROCEDURES.filter((p) =>
      p.titleEn.toLowerCase().includes(normalized) || p.slug.toLowerCase().includes(normalized)
    );
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results.some((p) => p.slug === 'root-canal-treatment')).toBe(true);
  });

  it('performs partial-word English search matching', () => {
    const query = 'impl';
    const normalized = query.trim().toLowerCase();
    const results = CANONICAL_PROCEDURES.filter((p) =>
      p.titleEn.toLowerCase().includes(normalized) ||
      p.summaryEn.toLowerCase().includes(normalized) ||
      p.slug.toLowerCase().includes(normalized)
    );
    expect(results.length).toBeGreaterThanOrEqual(3); // single implant, implant bridge, full arch implant
    expect(results.some((p) => p.slug === 'single-dental-implant')).toBe(true);
    expect(results.some((p) => p.slug === 'implant-supported-bridge')).toBe(true);
    expect(results.some((p) => p.slug === 'full-arch-implant-restoration')).toBe(true);
  });

  it('performs accurate Tamil script search matching', () => {
    const query = 'சிகிச்சை'; // treatment
    const results = CANONICAL_PROCEDURES.filter((p) =>
      p.titleTa.includes(query) || p.summaryTa.includes(query)
    );
    expect(results.length).toBeGreaterThanOrEqual(5);

    // Specific Tamil term: பல் தொப்பி (dental crown)
    const crownQuery = 'பல் தொப்பி';
    const crownResults = CANONICAL_PROCEDURES.filter((p) =>
      p.titleTa.includes(crownQuery) || p.summaryTa.includes(crownQuery)
    );
    expect(crownResults.some((p) => p.slug === 'dental-crowns')).toBe(true);
  });

  it('handles whitespace normalization and trimmed queries safely', () => {
    const queryWithWhitespace = '   dental    crowns   ';
    const normalized = queryWithWhitespace.trim().replace(/\s+/g, ' ').toLowerCase();
    expect(normalized).toBe('dental crowns');
    const results = CANONICAL_PROCEDURES.filter((p) =>
      p.titleEn.toLowerCase().includes(normalized)
    );
    expect(results.length).toBe(1);
    expect(results[0].slug).toBe('dental-crowns');
  });

  it('correctly filters procedures by clinical specialty department code', () => {
    // Endodontics (ENDO)
    const endoProcedures = CANONICAL_PROCEDURES.filter(
      (p) => p.primaryDepartmentCode === 'ENDO' || p.secondaryDepartmentCodes?.includes('ENDO')
    );
    expect(endoProcedures.length).toBeGreaterThanOrEqual(4);
    expect(endoProcedures.some((p) => p.slug === 'root-canal-treatment')).toBe(true);
    expect(endoProcedures.some((p) => p.slug === 'pulp-capping')).toBe(true);
    expect(endoProcedures.some((p) => p.slug === 'apicoectomy')).toBe(true);

    // Periodontics (PERIO)
    const perioProcedures = CANONICAL_PROCEDURES.filter(
      (p) => p.primaryDepartmentCode === 'PERIO' || p.secondaryDepartmentCodes?.includes('PERIO')
    );
    expect(perioProcedures.length).toBeGreaterThanOrEqual(4);
    expect(perioProcedures.some((p) => p.slug === 'deep-cleaning-scaling')).toBe(true);
    expect(perioProcedures.some((p) => p.slug === 'gingival-flap-surgery')).toBe(true);
  });

  it('combines text search with specialty department filter accurately', () => {
    const selectedDept = 'IMPL';
    const query = 'bridge';

    const results = CANONICAL_PROCEDURES.filter((p) => {
      const matchesDept =
        p.primaryDepartmentCode === selectedDept ||
        p.secondaryDepartmentCodes?.includes(selectedDept);
      if (!matchesDept) return false;

      return (
        p.titleEn.toLowerCase().includes(query) ||
        p.summaryEn.toLowerCase().includes(query) ||
        p.slug.toLowerCase().includes(query)
      );
    });

    expect(results.length).toBe(1);
    expect(results[0].slug).toBe('implant-supported-bridge');
  });

  it('returns empty array cleanly for non-matching search queries', () => {
    const nonExistentQuery = 'xyznonexistenttreatment12345';
    const results = CANONICAL_PROCEDURES.filter((p) =>
      p.titleEn.toLowerCase().includes(nonExistentQuery) ||
      p.titleTa.includes(nonExistentQuery)
    );
    expect(results.length).toBe(0);
  });

  it('sorts procedures deterministically alphabetically (A-Z and Z-A)', () => {
    // A-Z Sort
    const sortedAsc = [...CANONICAL_PROCEDURES].sort((a, b) =>
      a.titleEn.localeCompare(b.titleEn)
    );
    expect(sortedAsc.length).toBe(48);
    expect(sortedAsc[0].titleEn.toLowerCase() <= sortedAsc[1].titleEn.toLowerCase()).toBe(true);
    expect(
      sortedAsc[sortedAsc.length - 2].titleEn.toLowerCase() <=
        sortedAsc[sortedAsc.length - 1].titleEn.toLowerCase()
    ).toBe(true);

    // Z-A Sort
    const sortedDesc = [...CANONICAL_PROCEDURES].sort((a, b) =>
      b.titleEn.localeCompare(a.titleEn)
    );
    expect(sortedDesc[0].titleEn).toBe(sortedAsc[sortedAsc.length - 1].titleEn);
    expect(sortedDesc[sortedDesc.length - 1].titleEn).toBe(sortedAsc[0].titleEn);
  });

  it('matches procedures by primary or secondary department code search', () => {
    const query = 'endo';
    const results = CANONICAL_PROCEDURES.filter((p) => {
      const primary = (p.primaryDepartmentCode || '').toLowerCase();
      const secondary = (p.secondaryDepartmentCodes || []).map((c) => c.toLowerCase());
      return primary.includes(query) || secondary.some((sc) => sc.includes(query));
    });
    expect(results.length).toBeGreaterThanOrEqual(4);
    expect(results.some((p) => p.slug === 'root-canal-treatment')).toBe(true);
  });

  it('matches procedures by explore category slug search', () => {
    const query = 'pain-and-sensitivity';
    const results = CANONICAL_PROCEDURES.filter((p) =>
      p.exploreCategorySlugs.some((cat) => cat.toLowerCase().includes(query))
    );
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results.some((p) => p.slug === 'root-canal-treatment')).toBe(true);
  });

  it('matches procedures by procedure clinical code', () => {
    const query = 'endo-rct';
    const results = CANONICAL_PROCEDURES.filter((p) =>
      p.code.toLowerCase().includes(query)
    );
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results.some((p) => p.slug === 'root-canal-treatment')).toBe(true);
  });
});
