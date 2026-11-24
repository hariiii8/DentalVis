// packages/database/src/repository/DatabaseProcedureRepository.ts
// DentalVis 2.0 — Database Procedure Repository Implementation (Prisma 6)
// Architecture Baseline v1.9.1 — Phase B3.2: Database Repository Implementation

import {
  IProcedureRepository,
  ProcedureDetail,
  DepartmentDto,
  ExploreCategory,
  ProcedureVisibilityEnv,
  CANONICAL_DEPARTMENTS,
} from '@dentalvis/common';
import { PrismaClient } from '@prisma/client';
import { prisma as defaultPrisma } from '../index';
import {
  mapProcedureToDetail,
  mapDepartmentToDto,
  mapExploreCategoryToDto,
  PrismaProcedurePayload,
  PrismaDepartmentPayload,
  PrismaExploreCategoryPayload,
} from './mappers';
import { DatabaseConnectionError, DatabaseRepositoryError } from './errors';

export class DatabaseProcedureRepository implements IProcedureRepository {
  private readonly db: PrismaClient;

  constructor(prismaClient?: PrismaClient) {
    this.db = prismaClient ?? defaultPrisma;
  }

  /**
   * Helper that builds the Prisma publication where-clause (M7.2).
   *
   * Distinguishes between:
   * 1. Educational Catalogue Content Availability:
   *    All 48 canonical procedures are accessible unless explicitly archived.
   * 2. Strict Clinical Governance Approval:
   *    If strictClinicalOnly is requested, strictly checks for unrevoked APPROVED review quorum records.
   */
  private buildPublicationFilter(env?: ProcedureVisibilityEnv) {
    if (env?.strictClinicalOnly) {
      return {
        isArchived: false,
        translations: {
          some: {
            language: 'en' as const,
            currentStatus: 'PUBLISHED' as const,
            isArchived: false,
            publishedRevisionId: { not: null },
            publishedRevision: {
              approvals: {
                some: {
                  decision: 'APPROVED' as const,
                  isRevoked: false,
                },
              },
            },
          },
        },
      };
    }

    return {
      isArchived: false,
    };
  }

  /**
   * Reusable composite include options for Procedure queries to avoid N+1 queries.
   * Strictly includes publishedRevision; never includes or falls back to arbitrary unapproved revisions.
   */
  private getProcedureInclude() {
    return {
      translations: {
        where: { isArchived: false },
        include: {
          publishedRevision: {
            include: {
              coverMedia: true,
              _count: { select: { interactiveSteps: true } },
            },
          },
        },
      },
      departments: {
        include: {
          department: true,
        },
      },
      exploreCategories: {
        include: {
          exploreCategory: true,
        },
      },
    };
  }

  /**
   * Wraps Prisma calls in sanitized error handling.
   */
  private async executeQuery<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (err) {
      if (err instanceof DatabaseRepositoryError) {
        throw err;
      }
      // Mask Prisma/SQL details and throw sanitized DatabaseConnectionError
      const message = err instanceof Error ? err.message : String(err);
      if (
        message.includes('Can\'t reach database server') ||
        message.includes('connect ECONNREFUSED') ||
        message.includes('timed out')
      ) {
        throw new DatabaseConnectionError('The database service is temporarily unreachable.');
      }
      throw new DatabaseConnectionError('An error occurred while executing the database query.');
    }
  }

  async getVisibleProcedures(env?: ProcedureVisibilityEnv): Promise<ProcedureDetail[]> {
    return this.executeQuery(async () => {
      const records = (await this.db.procedure.findMany({
        where: this.buildPublicationFilter(env),
        include: this.getProcedureInclude(),
        orderBy: { code: 'asc' },
      })) as unknown as PrismaProcedurePayload[];

      return records.map(mapProcedureToDetail);
    });
  }

  async getVisibleProcedureBySlug(
    slug: string,
    env?: ProcedureVisibilityEnv
  ): Promise<ProcedureDetail | undefined> {
    return this.executeQuery(async () => {
      const record = (await this.db.procedure.findFirst({
        where: {
          slug,
          ...this.buildPublicationFilter(env),
        },
        include: this.getProcedureInclude(),
      })) as unknown as PrismaProcedurePayload | null;

      if (!record) {
        return undefined;
      }

      return mapProcedureToDetail(record);
    });
  }

  /**
   * Helper that resolves a department code from an input that might be either
   * a canonical department code (e.g. 'ENDO') or a canonical department slug (e.g. 'endodontics').
   */
  private resolveDepartmentCode(deptSlugOrCode: string): string | undefined {
    const trimmed = deptSlugOrCode.trim();
    if (!trimmed) return undefined;

    // Direct match against known canonical department codes (case-insensitive)
    const matchedByCode = CANONICAL_DEPARTMENTS.find(
      (d) => d.code.toLowerCase() === trimmed.toLowerCase()
    );
    if (matchedByCode) return matchedByCode.code;

    // Match against known canonical department slugs (case-insensitive)
    const matchedBySlug = CANONICAL_DEPARTMENTS.find(
      (d) => d.slug.toLowerCase() === trimmed.toLowerCase()
    );
    if (matchedBySlug) return matchedBySlug.code;

    // If input matches pattern of raw uppercase code, allow direct query fallback
    return /^[A-Z]{3,5}$/i.test(trimmed) ? trimmed.toUpperCase() : undefined;
  }

  async getVisibleProceduresByDepartment(
    deptSlugOrCode: string,
    env?: ProcedureVisibilityEnv
  ): Promise<ProcedureDetail[]> {
    return this.executeQuery(async () => {
      const resolvedCode = this.resolveDepartmentCode(deptSlugOrCode);
      if (!resolvedCode) {
        return [];
      }

      // 1. Resolve department entity by authoritative code
      const dept = await this.db.department.findFirst({
        where: {
          isArchived: false,
          code: { equals: resolvedCode, mode: 'insensitive' },
        },
      });

      if (!dept) {
        return [];
      }

      // 2. Query visible procedures linked to this department
      const records = (await this.db.procedure.findMany({
        where: {
          ...this.buildPublicationFilter(env),
          departments: {
            some: {
              departmentId: dept.id,
            },
          },
        },
        include: this.getProcedureInclude(),
        orderBy: { code: 'asc' },
      })) as unknown as PrismaProcedurePayload[];

      return records.map(mapProcedureToDetail);
    });
  }

  async getDepartmentBySlugOrCode(slugOrCode: string): Promise<DepartmentDto | undefined> {
    return this.executeQuery(async () => {
      const resolvedCode = this.resolveDepartmentCode(slugOrCode);
      if (!resolvedCode) {
        return undefined;
      }

      const record = (await this.db.department.findFirst({
        where: {
          isArchived: false,
          code: { equals: resolvedCode, mode: 'insensitive' },
        },
      })) as unknown as PrismaDepartmentPayload | null;

      if (!record) {
        return undefined;
      }

      // Attach canonical slug if present in CANONICAL_DEPARTMENTS
      const canonical = CANONICAL_DEPARTMENTS.find(
        (d) => d.code.toUpperCase() === record.code.toUpperCase()
      );
      if (canonical) {
        record.slug = canonical.slug;
      }

      return mapDepartmentToDto(record);
    });
  }

  async getExploreCategories(): Promise<ExploreCategory[]> {
    return this.executeQuery(async () => {
      const records = (await this.db.exploreCategory.findMany({
        where: { isArchived: false },
        include: {
          procedures: {
            include: {
              procedure: { select: { slug: true } },
            },
          },
        },
        orderBy: { displayOrder: 'asc' },
      })) as unknown as PrismaExploreCategoryPayload[];

      return records.map(mapExploreCategoryToDto);
    });
  }

  async getExploreCategoryBySlug(slug: string): Promise<ExploreCategory | undefined> {
    return this.executeQuery(async () => {
      const record = (await this.db.exploreCategory.findFirst({
        where: {
          slug,
          isArchived: false,
        },
        include: {
          procedures: {
            include: {
              procedure: { select: { slug: true } },
            },
          },
        },
      })) as unknown as PrismaExploreCategoryPayload | null;

      if (!record) {
        return undefined;
      }

      return mapExploreCategoryToDto(record);
    });
  }
}
