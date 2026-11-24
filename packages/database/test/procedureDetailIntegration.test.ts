// packages/database/test/procedureDetailIntegration.test.ts
// DentalVis 2.0 — Procedure Detail Route & Repository Integration Tests
// Architecture Baseline v1.9.1 — Phase B4.5: Procedure Detail Route Integration

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock server-only and react for node test runner
vi.mock('server-only', () => ({}));
vi.mock('react', () => ({ default: {} }));
vi.mock('next/navigation', () => ({ notFound: vi.fn() }));
vi.mock('C:/Users/Admin/OneDrive/Desktop/DentalViz/apps/web/src/app/procedures/[slug]/ProcedureDetailClientView.tsx', () => ({ default: () => null }));
vi.mock('../../apps/web/src/app/procedures/[slug]/ProcedureDetailClientView', () => ({ default: () => null }));

import { getProcedureRepository } from '../../apps/web/src/server/procedureRepository';
import { generateMetadata, generateStaticParams } from '../../apps/web/src/app/procedures/[slug]/page';
import { getProcedure3DConfig } from '../../apps/web/src/components/3d/procedure3DRegistry';
import { DatabaseProcedureRepository } from '../src/repository';

describe('Phase B4.5 — Procedure Detail Route Integration', () => {
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
    const publishedBaselineSlugs = [
      'root-canal-treatment',
      'dental-crowns',
      'deep-cleaning-scaling',
      'single-dental-implant',
    ];

    it('resolves all 4 published baseline procedures individually with complete DTOs', async () => {
      const repository = getProcedureRepository();

      for (const slug of publishedBaselineSlugs) {
        const procedure = await repository.getVisibleProcedureBySlug(slug);
        expect(procedure).toBeDefined();
        expect(procedure?.slug).toBe(slug);
        expect(procedure?.titleEn).toBeTruthy();
        expect(procedure?.titleTa).toBeTruthy();
        expect(procedure?.summaryEn).toBeTruthy();
        expect(procedure?.summaryTa).toBeTruthy();
        expect(procedure?.primaryDepartmentCode).toBeTruthy();
      }
    });

    it('returns undefined (404) for non-existent procedure slugs while resolving educational procedures', async () => {
      const repository = getProcedureRepository();

      const notFoundSlug = await repository.getVisibleProcedureBySlug('non-existent-procedure');
      expect(notFoundSlug).toBeUndefined();

      // Educational procedures resolve with complete DTOs
      const draftSlug = await repository.getVisibleProcedureBySlug('wisdom-tooth-extraction');
      expect(draftSlug).toBeDefined();
      expect(draftSlug?.slug).toBe('wisdom-tooth-extraction');
    });

    it('generateStaticParams returns all 48 canonical educational procedure slugs', async () => {
      const params = await generateStaticParams();
      expect(params.length).toBe(48);
      const slugs = params.map((p) => p.slug);
      for (const baseSlug of publishedBaselineSlugs) {
        expect(slugs).toContain(baseSlug);
      }
    });

    it('generateMetadata produces rich SEO metadata for published procedures and safe fallback for invalid slugs', async () => {
      // 1. Published Procedure Metadata
      const meta = await generateMetadata({
        params: Promise.resolve({ slug: 'root-canal-treatment' }),
      });
      expect(meta.title).toContain('Root Canal Treatment');
      expect(meta.description).toBeTruthy();
      expect(meta.alternates?.canonical).toBe('/procedures/root-canal-treatment');

      // 2. Invalid Slug Fallback Metadata (zero draft leak)
      const invalidMeta = await generateMetadata({
        params: Promise.resolve({ slug: 'non-existent-or-draft' }),
      });
      expect(invalidMeta.title).toBe('Procedure Not Found | DentalVis');
      expect(invalidMeta.description).toContain('not available');
    });

    it('retrieves related procedures exclusively from published content', async () => {
      const repository = getProcedureRepository();
      const currentProc = await repository.getVisibleProcedureBySlug('root-canal-treatment');
      expect(currentProc).toBeDefined();

      const allVisible = await repository.getVisibleProcedures();
      const related = allVisible.filter((p) => p.id !== currentProc?.id).slice(0, 3);

      expect(related.length).toBe(3);
      for (const r of related) {
        expect(r.id).not.toBe(currentProc?.id);
        expect(publishedBaselineSlugs).toContain(r.slug);
      }
    });

    it('preserves 3D anatomy registry compatibility for all canonical procedures', async () => {
      const repository = getProcedureRepository();

      for (const slug of publishedBaselineSlugs) {
        const proc = await repository.getVisibleProcedureBySlug(slug);
        expect(proc).toBeDefined();

        // Check that 3D registry recognizes the procedure slug
        const config3D = getProcedure3DConfig(proc!.slug);
        expect(config3D).toBeDefined();
        expect(config3D?.procedureSlug).toBe(proc!.slug);
        expect(config3D?.modelPath || config3D?.procedureSlug).toBeTruthy();
        expect(Array.isArray(config3D?.hotspots)).toBe(true);
      }
    });
  });

  describe('Database Provider Mode (DENTALVIS_PROCEDURE_PROVIDER=database)', () => {
    it('returns 404 (undefined) for all currently seeded procedures because they remain DRAFT with zero approvals', async () => {
      process.env.DENTALVIS_PROCEDURE_PROVIDER = 'database';

      // Mock Prisma representing current database state (48 draft procedures, 0 published)
      const mockPrisma = {
        procedure: {
          findMany: vi.fn().mockResolvedValue([]),
          findFirst: vi.fn().mockResolvedValue(null),
        },
      };

      const dbRepo = new DatabaseProcedureRepository(mockPrisma as any);

      // 1. Slug lookup returns undefined (404)
      const result = await dbRepo.getVisibleProcedureBySlug('root-canal-treatment');
      expect(result).toBeUndefined();

      // 2. Visible procedures list is empty
      const all = await dbRepo.getVisibleProcedures();
      expect(all).toEqual([]);

      // 3. Related procedures evaluation results in empty array (no draft leaks)
      const related = all.filter((p) => p.id !== 'any-id');
      expect(related).toEqual([]);
    });

    it('fails closed and throws DatabaseConnectionError without static fallback on database failure', async () => {
      process.env.DENTALVIS_PROCEDURE_PROVIDER = 'database';

      const mockFailingPrisma = {
        procedure: {
          findFirst: vi.fn().mockRejectedValue(new Error('connect ECONNREFUSED 127.0.0.1:5432')),
        },
      };

      const dbRepo = new DatabaseProcedureRepository(mockFailingPrisma as any);

      await expect(
        dbRepo.getVisibleProcedureBySlug('root-canal-treatment')
      ).rejects.toThrowError('The database service is temporarily unreachable.');
    });
  });
});
