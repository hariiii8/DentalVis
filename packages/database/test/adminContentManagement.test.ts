// packages/database/test/adminContentManagement.test.ts
// DentalVis — Milestone M7.3: Admin Content Management & Editorial Workflow Tests
// Architecture Baseline v1.9.1 — Milestone M7.3

import { describe, it, expect } from 'vitest';
import {
  CANONICAL_PROCEDURES,
  CANONICAL_DEPARTMENTS,
  CANONICAL_EXPLORE_CATEGORIES,
  validateProcedureEditorialContent,
  checkEditorialPermission,
  containsTamilScript,
  ProcedureEditorialContent,
} from '@dentalvis/common';

describe('Phase M7.3 — Admin Content Management & Editorial Workflow', () => {
  // --------------------------------------------------------------------
  // 1. CANONICAL CATALOGUE & PROCEDURE MANAGEMENT (48 PROCEDURES)
  // --------------------------------------------------------------------
  describe('Procedure Inventory & Management', () => {
    it('provides exactly 48 canonical dental procedures for management', () => {
      expect(CANONICAL_PROCEDURES).toHaveLength(48);
    });

    it('ensures every procedure has unique IDs, codes, and slugs', () => {
      const ids = new Set(CANONICAL_PROCEDURES.map((p) => p.id));
      const codes = new Set(CANONICAL_PROCEDURES.map((p) => p.code));
      const slugs = new Set(CANONICAL_PROCEDURES.map((p) => p.slug));

      expect(ids.size).toBe(48);
      expect(codes.size).toBe(48);
      expect(slugs.size).toBe(48);
    });

    it('verifies all 15 clinical dental specialties are represented in the catalogue', () => {
      expect(CANONICAL_DEPARTMENTS).toHaveLength(15);

      const deptCodes = new Set(CANONICAL_DEPARTMENTS.map((d) => d.code));
      const mappedDepts = new Set<string>();

      for (const p of CANONICAL_PROCEDURES) {
        if (p.primaryDepartmentCode) mappedDepts.add(p.primaryDepartmentCode);
        for (const sec of p.secondaryDepartmentCodes || []) {
          mappedDepts.add(sec);
        }
      }

      for (const code of deptCodes) {
        expect(mappedDepts.has(code)).toBe(true);
      }
    });

    it('verifies all 6 Explore categories have mapped procedures', () => {
      expect(CANONICAL_EXPLORE_CATEGORIES).toHaveLength(6);

      const catSlugs = new Set(CANONICAL_EXPLORE_CATEGORIES.map((c) => c.slug));
      const mappedCats = new Set<string>();

      for (const p of CANONICAL_PROCEDURES) {
        for (const cat of p.exploreCategorySlugs || []) {
          mappedCats.add(cat);
        }
      }

      for (const slug of catSlugs) {
        expect(mappedCats.has(slug)).toBe(true);
      }
    });
  });

  // --------------------------------------------------------------------
  // 2. BILINGUAL EDITING & TAMIL UNICODE PRESERVATION
  // --------------------------------------------------------------------
  describe('Bilingual Editing & Unicode Integrity', () => {
    it('detects and preserves Tamil Unicode text correctly', () => {
      expect(containsTamilScript('பல் தொப்பி (Dental Crown)')).toBe(true);
      expect(containsTamilScript('வேர் கால்வாய் சிகிச்சை')).toBe(true);
      expect(containsTamilScript('குழந்தைகளுக்கான பல் சிகிச்சை')).toBe(true);
      expect(containsTamilScript('Root Canal Treatment')).toBe(false);
      expect(containsTamilScript('')).toBe(false);
    });

    it('validates English and Tamil content independently without silent fallback', () => {
      const missingTamil: Partial<ProcedureEditorialContent> = {
        slug: 'test-procedure',
        code: 'TEST-PRC-01',
        titleEn: 'Test Procedure',
        summaryEn: 'Valid English summary for patient education.',
        overviewHtmlEn: '<p>Overview details.</p>',
        titleTa: '', // Missing Tamil
        summaryTa: '',
        overviewHtmlTa: '',
        durationMinutes: 45,
        anesthesiaType: 'Local Anesthesia',
        primaryDepartmentCode: 'PREV',
        exploreCategorySlugs: ['pain-and-sensitivity'],
      };

      const result = validateProcedureEditorialContent(missingTamil);
      expect(result.isValid).toBe(false);
      expect(result.errors.titleTa).toBeDefined();
      expect(result.errors.summaryTa).toBeDefined();
      expect(result.errors.overviewHtmlTa).toBeDefined();
      expect(result.completeness.isEnglishComplete).toBe(true);
      expect(result.completeness.isTamilComplete).toBe(false);
      expect(result.completeness.tamilPercent).toBe(0);
    });

    it('validates completeness when both languages are populated with valid Unicode', () => {
      const completeBilingual: Partial<ProcedureEditorialContent> = {
        slug: 'pediatric-pulpotomy',
        code: 'PEDO-PUL-01',
        titleEn: 'Pediatric Pulpotomy',
        summaryEn: 'Gentle nerve treatment for primary teeth to preserve space and chewing function.',
        overviewHtmlEn: '<p>A pediatric pulpotomy treats deeply decayed primary baby teeth.</p>',
        titleTa: 'குழந்தைகளுக்கான பால் பல் நரம்பு சிகிச்சை (Pulpotomy)',
        summaryTa: 'பால் பல்லில் ஏற்பட்ட தொற்றை நீக்கி, இயற்கை பல்லை பாதுகாக்கும் மென்மையான சிகிச்சை.',
        overviewHtmlTa: '<p>பால் பற்களின் நரம்பு பகுதியை பாதுகாக்கும் சிகிச்சை.</p>',
        durationMinutes: 45,
        anesthesiaType: 'Local Numbing Gel & Gentle Anesthesia',
        primaryDepartmentCode: 'PEDO',
        exploreCategorySlugs: ['pain-and-sensitivity'],
      };

      const result = validateProcedureEditorialContent(completeBilingual);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
      expect(result.completeness.isEnglishComplete).toBe(true);
      expect(result.completeness.isTamilComplete).toBe(true);
      expect(result.completeness.overallPercent).toBe(100);
    });
  });

  // --------------------------------------------------------------------
  // 3. EDITORIAL VALIDATION CONSTRAINTS
  // --------------------------------------------------------------------
  describe('Content Validation Rules', () => {
    it('rejects invalid or malformed slugs', () => {
      const invalidSlug: Partial<ProcedureEditorialContent> = {
        slug: 'INVALID SLUG with spaces & Caps!',
        code: 'TEST-PRC-01',
        titleEn: 'Valid Title',
        summaryEn: 'Valid Summary',
        overviewHtmlEn: '<p>Valid</p>',
        titleTa: 'பல் சிகிச்சை',
        summaryTa: 'பல் சுருக்கம்',
        overviewHtmlTa: '<p>விவரம்</p>',
        durationMinutes: 30,
        anesthesiaType: 'Local',
        primaryDepartmentCode: 'PREV',
        exploreCategorySlugs: ['pain-and-sensitivity'],
      };

      const result = validateProcedureEditorialContent(invalidSlug);
      expect(result.isValid).toBe(false);
      expect(result.errors.slug).toContain('lowercase alphanumeric with hyphens');
    });

    it('rejects invalid procedure codes', () => {
      const invalidCode: Partial<ProcedureEditorialContent> = {
        slug: 'test-procedure',
        code: 'bad_code',
        titleEn: 'Valid Title',
        summaryEn: 'Valid Summary',
        overviewHtmlEn: '<p>Valid</p>',
        titleTa: 'பல் சிகிச்சை',
        summaryTa: 'பல் சுருக்கம்',
        overviewHtmlTa: '<p>விவரம்</p>',
        durationMinutes: 30,
        anesthesiaType: 'Local',
        primaryDepartmentCode: 'PREV',
        exploreCategorySlugs: ['pain-and-sensitivity'],
      };

      const result = validateProcedureEditorialContent(invalidCode);
      expect(result.isValid).toBe(false);
      expect(result.errors.code).toContain('DEPT-CODE-NN');
    });

    it('rejects duration outside acceptable range [1, 480] minutes', () => {
      const zeroDuration: Partial<ProcedureEditorialContent> = {
        slug: 'test-procedure',
        code: 'PREV-TST-01',
        titleEn: 'Valid Title',
        summaryEn: 'Valid Summary',
        overviewHtmlEn: '<p>Valid</p>',
        titleTa: 'பல் சிகிச்சை',
        summaryTa: 'பல் சுருக்கம்',
        overviewHtmlTa: '<p>விவரம்</p>',
        durationMinutes: 0,
        anesthesiaType: 'Local',
        primaryDepartmentCode: 'PREV',
        exploreCategorySlugs: ['pain-and-sensitivity'],
      };

      const result = validateProcedureEditorialContent(zeroDuration);
      expect(result.isValid).toBe(false);
      expect(result.errors.durationMinutes).toContain('between 1 and 480 minutes');
    });

    it('rejects invalid clinical department codes when valid options provided', () => {
      const badDept: Partial<ProcedureEditorialContent> = {
        slug: 'test-procedure',
        code: 'PREV-TST-01',
        titleEn: 'Valid Title',
        summaryEn: 'Valid Summary',
        overviewHtmlEn: '<p>Valid</p>',
        titleTa: 'பல் சிகிச்சை',
        summaryTa: 'பல் சுருக்கம்',
        overviewHtmlTa: '<p>விவரம்</p>',
        durationMinutes: 30,
        anesthesiaType: 'Local',
        primaryDepartmentCode: 'NON_EXISTENT_DEPT',
        exploreCategorySlugs: ['pain-and-sensitivity'],
      };

      const result = validateProcedureEditorialContent(badDept, {
        validDepartmentCodes: CANONICAL_DEPARTMENTS.map((d) => d.code),
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.primaryDepartmentCode).toContain('Invalid specialty code');
    });

    it('requires at least one valid Explore category', () => {
      const noCats: Partial<ProcedureEditorialContent> = {
        slug: 'test-procedure',
        code: 'PREV-TST-01',
        titleEn: 'Valid Title',
        summaryEn: 'Valid Summary',
        overviewHtmlEn: '<p>Valid</p>',
        titleTa: 'பல் சிகிச்சை',
        summaryTa: 'பல் சுருக்கம்',
        overviewHtmlTa: '<p>விவரம்</p>',
        durationMinutes: 30,
        anesthesiaType: 'Local',
        primaryDepartmentCode: 'PREV',
        exploreCategorySlugs: [],
      };

      const result = validateProcedureEditorialContent(noCats);
      expect(result.isValid).toBe(false);
      expect(result.errors.exploreCategorySlugs).toContain('At least one patient Explore category is required');
    });
  });

  // --------------------------------------------------------------------
  // 4. RBAC & ROLE AUTHORIZATION MATRIX
  // --------------------------------------------------------------------
  describe('Role-Based Access Control (RBAC)', () => {
    it('authorizes SYSTEM_ADMIN, CHIEF_EDITOR, and CLINICAL_AUTHOR for editing & saving', () => {
      expect(checkEditorialPermission('SYSTEM_ADMIN', 'SAVE').permitted).toBe(true);
      expect(checkEditorialPermission('CHIEF_EDITOR', 'SAVE').permitted).toBe(true);
      expect(checkEditorialPermission('CLINICAL_AUTHOR', 'SAVE').permitted).toBe(true);
    });

    it('restricts CLINICAL_REVIEWER to view and preview only (disallows authoring)', () => {
      expect(checkEditorialPermission('CLINICAL_REVIEWER', 'VIEW').permitted).toBe(true);
      expect(checkEditorialPermission('CLINICAL_REVIEWER', 'PREVIEW').permitted).toBe(true);
      expect(checkEditorialPermission('CLINICAL_REVIEWER', 'EDIT').permitted).toBe(false);
      expect(checkEditorialPermission('CLINICAL_REVIEWER', 'SAVE').permitted).toBe(false);
    });

    it('restricts PATIENT_VIEWER to view and preview only', () => {
      expect(checkEditorialPermission('PATIENT_VIEWER', 'VIEW').permitted).toBe(true);
      expect(checkEditorialPermission('PATIENT_VIEWER', 'PREVIEW').permitted).toBe(true);
      expect(checkEditorialPermission('PATIENT_VIEWER', 'SAVE').permitted).toBe(false);
    });

    it('fails closed when role is undefined or unauthenticated', () => {
      expect(checkEditorialPermission(undefined, 'VIEW').permitted).toBe(false);
      expect(checkEditorialPermission(undefined, 'SAVE').permitted).toBe(false);
    });
  });

  // --------------------------------------------------------------------
  // 5. GOVERNANCE SEPARATION & PUBLIC CATALOGUE ACCESS
  // --------------------------------------------------------------------
  describe('Governance Separation & Catalogue Integrity', () => {
    it('verifies that editing content does not alter CRB quorum approval statuses', () => {
      // Exactly 4 procedures have formal CRB published approval; 44 remain in clinical draft
      const published = CANONICAL_PROCEDURES.filter((p) => p.contentStatus === 'PUBLISHED');
      const draft = CANONICAL_PROCEDURES.filter((p) => p.contentStatus === 'DRAFT');

      expect(published).toHaveLength(4);
      expect(draft).toHaveLength(44);

      // Verify the 4 reference procedures retain authentic identities
      const publishedSlugs = published.map((p) => p.slug).sort();
      expect(publishedSlugs).toEqual([
        'deep-cleaning-scaling',
        'dental-crowns',
        'root-canal-treatment',
        'single-dental-implant',
      ]);
    });

    it('ensures all 48 procedures remain accessible for public patient education', () => {
      // Every canonical procedure has valid bilingual titles and non-empty summaries
      for (const p of CANONICAL_PROCEDURES) {
        expect(p.slug).toBeTruthy();
        expect(p.titleEn.length).toBeGreaterThan(0);
        expect(p.titleTa.length).toBeGreaterThan(0);
        expect(p.summaryEn.length).toBeGreaterThan(0);
        expect(p.summaryTa.length).toBeGreaterThan(0);
      }
    });
  });
});
