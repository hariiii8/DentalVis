// packages/database/test/exploreIntegration.test.ts
// DentalVis 2.0 — Explore Routes & Repository Integration Tests
// Architecture Baseline v1.9.1 — Phase B4.4: Explore Route Integration

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock server-only for node test runner
vi.mock('server-only', () => ({}));

import { getProcedureRepository } from '../../apps/web/src/server/procedureRepository';
import { CANONICAL_DEPARTMENTS, CANONICAL_EXPLORE_CATEGORIES } from '@dentalvis/common';
import { DatabaseProcedureRepository } from '../src/repository';

describe('Phase B4.4 — Explore Routes Repository Integration', () => {
  const originalEnv = process.env.DENTALVIS_PROCEDURE_PROVIDER;

  beforeEach(() => {
    delete process.env.DENTALVIS_PROCEDURE_PROVIDER;
  });

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.DENTALVIS_PROCEDURE_PROVIDER = originalEnv;
    } else {
      delete process.env.DENTALVIS_PROCEDURE_PROVIDER;
    }
  });

  describe('Static Provider Mode (Default)', () => {
    it('returns all 48 canonical educational procedures for Explore landing page', async () => {
      const repository = getProcedureRepository();
      const visible = await repository.getVisibleProcedures();

      expect(visible.length).toBe(48);
      const slugs = visible.map((p) => p.slug);
      expect(slugs).toContain('root-canal-treatment');
      expect(slugs).toContain('dental-crowns');
      expect(slugs).toContain('deep-cleaning-scaling');
      expect(slugs).toContain('single-dental-implant');
      expect(slugs).toContain('pediatric-pulpotomy');
    });

    it('computes accurate procedure counts across all 15 clinical departments', async () => {
      const repository = getProcedureRepository();
      const counts: Record<string, number> = {};

      for (const dept of CANONICAL_DEPARTMENTS) {
        const procs = await repository.getVisibleProceduresByDepartment(dept.code);
        counts[dept.code] = procs.length;
      }

      // Check counts for departments having published baseline procedures
      expect(counts['ENDO']).toBeGreaterThanOrEqual(1);
      expect(counts['PROS']).toBeGreaterThanOrEqual(1);
      expect(counts['PERIO']).toBeGreaterThanOrEqual(1);
      expect(counts['REST']).toBeGreaterThanOrEqual(1);

      // Verify all 15 canonical departments are represented
      expect(Object.keys(counts).length).toBe(15);
    });

    it('resolves clinical departments by code or slug for /explore/[category] routes', async () => {
      const repository = getProcedureRepository();

      const endoBySlug = await repository.getDepartmentBySlugOrCode('endodontics');
      expect(endoBySlug).toBeDefined();
      expect(endoBySlug?.code).toBe('ENDO');

      const endoByCode = await repository.getDepartmentBySlugOrCode('ENDO');
      expect(endoByCode).toBeDefined();
      expect(endoByCode?.code).toBe('ENDO');

      const perio = await repository.getDepartmentBySlugOrCode('periodontics');
      expect(perio).toBeDefined();
      expect(perio?.code).toBe('PERIO');
    });

    it('resolves canonical explore categories for /explore/[category] backward compatibility', async () => {
      const repository = getProcedureRepository();

      const cat = await repository.getExploreCategoryBySlug('pain-and-sensitivity');
      expect(cat).toBeDefined();
      expect(cat?.titleEn).toBe('Pain & Sensitivity');
      expect(cat?.titleTa).toBe('பல் வலி & கூச்சம்');
    });

    it('returns undefined for non-existent department or category slugs', async () => {
      const repository = getProcedureRepository();

      const invalidDept = await repository.getDepartmentBySlugOrCode('non-existent-specialty');
      expect(invalidDept).toBeUndefined();

      const invalidCat = await repository.getExploreCategoryBySlug('non-existent-category');
      expect(invalidCat).toBeUndefined();
    });
  });

  describe('Database Provider Mode (DENTALVIS_PROCEDURE_PROVIDER=database)', () => {
    it('enforces published-only visibility and yields deliberate empty state for unapproved draft catalogue', async () => {
      process.env.DENTALVIS_PROCEDURE_PROVIDER = 'database';

      // Mock Prisma representing current database state (48 draft procedures, 0 published)
      const mockPrisma = {
        procedure: {
          findMany: vi.fn().mockResolvedValue([]),
          findFirst: vi.fn().mockResolvedValue(null),
        },
        department: {
          findFirst: vi.fn().mockImplementation(({ where }: any) => {
            const code = where?.code?.equals?.toUpperCase();
            const dept = CANONICAL_DEPARTMENTS.find((d) => d.code === code);
            return Promise.resolve(
              dept
                ? {
                    id: dept.id,
                    code: dept.code,
                    nameEn: dept.nameEn,
                    nameTa: dept.nameTa,
                    descriptionEn: dept.descriptionEn,
                    descriptionTa: dept.descriptionTa,
                    isArchived: false,
                  }
                : null
            );
          }),
        },
        exploreCategory: {
          findMany: vi.fn().mockResolvedValue([]),
          findFirst: vi.fn().mockImplementation(({ where }: any) => {
            const cat = CANONICAL_EXPLORE_CATEGORIES.find((c) => c.slug === where?.slug);
            return Promise.resolve(
              cat
                ? {
                    id: cat.id,
                    slug: cat.slug,
                    titleEn: cat.titleEn,
                    titleTa: cat.titleTa,
                    descriptionEn: cat.descriptionEn,
                    descriptionTa: cat.descriptionTa,
                    iconName: cat.iconName,
                    isArchived: false,
                    procedures: [],
                  }
                : null
            );
          }),
        },
      };

      const dbRepo = new DatabaseProcedureRepository(mockPrisma as any);

      // 1. Visible procedures list is empty (0 draft procedures exposed)
      const procs = await dbRepo.getVisibleProcedures();
      expect(procs).toEqual([]);

      // 2. Department-specific procedures list is empty
      const endoProcs = await dbRepo.getVisibleProceduresByDepartment('ENDO');
      expect(endoProcs).toEqual([]);

      // 3. Department metadata itself is accessible for canonical taxonomy rendering
      const dept = await dbRepo.getDepartmentBySlugOrCode('endodontics');
      expect(dept).toBeDefined();
      expect(dept?.code).toBe('ENDO');

      // 4. Explore category metadata is accessible
      const cat = await dbRepo.getExploreCategoryBySlug('pain-and-sensitivity');
      expect(cat).toBeDefined();
      expect(cat?.slug).toBe('pain-and-sensitivity');
    });

    it('fails closed and throws DatabaseConnectionError without static fallback on database failure', async () => {
      process.env.DENTALVIS_PROCEDURE_PROVIDER = 'database';

      const mockFailingPrisma = {
        procedure: {
          findMany: vi.fn().mockRejectedValue(new Error('connect ECONNREFUSED 127.0.0.1:5432')),
        },
        department: {
          findFirst: vi.fn().mockRejectedValue(new Error('timed out')),
        },
      };

      const dbRepo = new DatabaseProcedureRepository(mockFailingPrisma as any);

      await expect(dbRepo.getVisibleProcedures()).rejects.toThrowError(
        'The database service is temporarily unreachable.'
      );

      await expect(dbRepo.getDepartmentBySlugOrCode('ENDO')).rejects.toThrowError(
        'The database service is temporarily unreachable.'
      );
    });
  });
});
