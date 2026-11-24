// packages/database/test/serverProcedureRepository.test.ts
// DentalVis 2.0 — Server-Only Procedure Repository Provider Unit Tests
// Architecture Baseline v1.9.1 — Phase B4.3: Server-Side Database Wiring

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock 'server-only' so that Node/Vitest test environment can execute server module tests
vi.mock('server-only', () => ({}));

import {
  resolveProcedureProvider,
  InvalidProviderConfigurationError,
  getProcedureRepository,
} from '../../apps/web/src/server/procedureRepository';
import { StaticProcedureRepository } from '@dentalvis/common';
import { DatabaseProcedureRepository } from '../src/repository';

describe('Phase B4.3 — Server Procedure Repository Provider', () => {
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

  describe('Provider Resolution Rules', () => {
    it('defaults to "static" when environment variable is unset', () => {
      expect(resolveProcedureProvider()).toBe('static');
      expect(resolveProcedureProvider(undefined)).toBe('static');
      expect(resolveProcedureProvider('')).toBe('static');
      expect(resolveProcedureProvider('   ')).toBe('static');
    });

    it('resolves explicit "static" mode correctly (case-insensitive and trimmed)', () => {
      expect(resolveProcedureProvider('static')).toBe('static');
      expect(resolveProcedureProvider('STATIC')).toBe('static');
      expect(resolveProcedureProvider('  static  ')).toBe('static');

      process.env.DENTALVIS_PROCEDURE_PROVIDER = 'static';
      expect(resolveProcedureProvider()).toBe('static');
    });

    it('resolves explicit "database" mode correctly (case-insensitive and trimmed)', () => {
      expect(resolveProcedureProvider('database')).toBe('database');
      expect(resolveProcedureProvider('DATABASE')).toBe('database');
      expect(resolveProcedureProvider('  Database  ')).toBe('database');

      process.env.DENTALVIS_PROCEDURE_PROVIDER = 'database';
      expect(resolveProcedureProvider()).toBe('database');
    });

    it('fails closed when an unsupported provider configuration is supplied', () => {
      const invalidValues = ['db', 'mongo', 'postgres', 'true', 'false', '123', 'preview'];

      for (const val of invalidValues) {
        expect(() => resolveProcedureProvider(val)).toThrowError(InvalidProviderConfigurationError);
        expect(() => resolveProcedureProvider(val)).toThrowError(
          /Unsupported DENTALVIS_PROCEDURE_PROVIDER/
        );
      }
    });

    it('never silently switches to static when an invalid value is explicitly set in process.env', () => {
      process.env.DENTALVIS_PROCEDURE_PROVIDER = 'invalid-provider-xyz';
      expect(() => resolveProcedureProvider()).toThrowError(InvalidProviderConfigurationError);
    });

    it('getProcedureRepository() returns StaticProcedureRepository by default and when explicitly selected', () => {
      const repoDefault = getProcedureRepository();
      expect(repoDefault).toBeInstanceOf(StaticProcedureRepository);

      process.env.DENTALVIS_PROCEDURE_PROVIDER = 'static';
      const repoStatic = getProcedureRepository();
      expect(repoStatic).toBeInstanceOf(StaticProcedureRepository);
    });

    it('getProcedureRepository() returns DatabaseProcedureRepository when explicitly configured to "database"', () => {
      process.env.DENTALVIS_PROCEDURE_PROVIDER = 'database';
      const repoDb = getProcedureRepository();
      expect(repoDb).toBeInstanceOf(DatabaseProcedureRepository);
    });

    it('getProcedureRepository() fails closed and throws InvalidProviderConfigurationError when env is invalid', () => {
      process.env.DENTALVIS_PROCEDURE_PROVIDER = 'unsupported_mode';
      expect(() => getProcedureRepository()).toThrowError(InvalidProviderConfigurationError);
    });
  });

  describe('Repository Implementation Instantiation & Contract Parity', () => {
    it('StaticProcedureRepository satisfies IProcedureRepository contract and returns 48 public educational procedures', async () => {
      const staticRepo = new StaticProcedureRepository();
      const visible = await staticRepo.getVisibleProcedures();

      expect(Array.isArray(visible)).toBe(true);
      expect(visible.length).toBe(48);

      const slugs = visible.map((p) => p.slug);
      expect(slugs).toContain('root-canal-treatment');
      expect(slugs).toContain('dental-crowns');
      expect(slugs).toContain('deep-cleaning-scaling');
      expect(slugs).toContain('single-dental-implant');
      expect(slugs).toContain('pediatric-pulpotomy');
    });

    it('StaticProcedureRepository respects strictClinicalOnly and returns exactly 4 CRB approved procedures', async () => {
      const staticRepo = new StaticProcedureRepository();
      const visible = await staticRepo.getVisibleProcedures({ strictClinicalOnly: true });

      expect(Array.isArray(visible)).toBe(true);
      expect(visible.length).toBe(4);

      const slugs = visible.map((p) => p.slug);
      expect(slugs).toContain('root-canal-treatment');
      expect(slugs).toContain('dental-crowns');
      expect(slugs).toContain('deep-cleaning-scaling');
      expect(slugs).toContain('single-dental-implant');
    });

    it('DatabaseProcedureRepository satisfies IProcedureRepository contract and enforces strict clinical filter when strictClinicalOnly is set', async () => {
      // Mock Prisma with the current database state: 48 draft procedures, 0 published
      const mockPrisma = {
        procedure: {
          findMany: vi.fn().mockResolvedValue([]), // No records match publication filter
          findFirst: vi.fn().mockResolvedValue(null),
        },
        department: {
          findFirst: vi.fn().mockResolvedValue(null),
        },
        exploreCategory: {
          findMany: vi.fn().mockResolvedValue([]),
          findFirst: vi.fn().mockResolvedValue(null),
        },
      };

      const dbRepo = new DatabaseProcedureRepository(mockPrisma as any);

      // In database mode with current draft state, returns empty list
      const visible = await dbRepo.getVisibleProcedures({ strictClinicalOnly: true });
      expect(visible).toEqual([]);

      // In database mode with current draft state, slug lookup returns undefined (not-found)
      const proc = await dbRepo.getVisibleProcedureBySlug('root-canal-treatment', { strictClinicalOnly: true });
      expect(proc).toBeUndefined();

      // Verify Prisma findMany was called with strict publication filter
      expect(mockPrisma.procedure.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            isArchived: false,
            translations: expect.objectContaining({
              some: expect.objectContaining({
                language: 'en',
                currentStatus: 'PUBLISHED',
                publishedRevisionId: { not: null },
              }),
            }),
          }),
        })
      );
    });

    it('Database failures in DatabaseProcedureRepository throw sanitized DatabaseConnectionError and NEVER fall back to static data', async () => {
      const mockPrismaFailing = {
        procedure: {
          findMany: vi.fn().mockRejectedValue(new Error('connect ECONNREFUSED 127.0.0.1:5432')),
        },
      };

      const dbRepo = new DatabaseProcedureRepository(mockPrismaFailing as any);

      await expect(dbRepo.getVisibleProcedures()).rejects.toThrowError(
        'The database service is temporarily unreachable.'
      );
    });
  });
});
