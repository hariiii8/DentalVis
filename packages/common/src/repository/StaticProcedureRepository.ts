// packages/common/src/repository/StaticProcedureRepository.ts
// DentalVis 2.0 — In-Memory Static Procedure Repository Implementation
// Architecture Baseline v1.9.1 — Phase B2: Repository Abstraction Foundation

import {
  ProcedureDetail,
  DepartmentDto,
  ExploreCategory,
  CANONICAL_EXPLORE_CATEGORIES,
  getVisibleProcedures,
  getVisibleProcedureBySlug,
  getVisibleProceduresByDepartment,
  getDepartmentBySlugOrCode,
} from '../index';
import { IProcedureRepository, ProcedureVisibilityEnv } from './types';

/**
 * Static in-memory repository implementing IProcedureRepository.
 * Delegates strictly to the authoritative canonical catalogue functions and constants
 * in packages/common/src/index.ts, ensuring zero data duplication, identical publication
 * filtering, and zero database or network side effects.
 */
export class StaticProcedureRepository implements IProcedureRepository {
  async getVisibleProcedures(env?: ProcedureVisibilityEnv): Promise<ProcedureDetail[]> {
    return getVisibleProcedures(env);
  }

  async getVisibleProcedureBySlug(
    slug: string,
    env?: ProcedureVisibilityEnv
  ): Promise<ProcedureDetail | undefined> {
    return getVisibleProcedureBySlug(slug, env);
  }

  async getVisibleProceduresByDepartment(
    deptSlugOrCode: string,
    env?: ProcedureVisibilityEnv
  ): Promise<ProcedureDetail[]> {
    return getVisibleProceduresByDepartment(deptSlugOrCode, env);
  }

  async getDepartmentBySlugOrCode(slugOrCode: string): Promise<DepartmentDto | undefined> {
    return getDepartmentBySlugOrCode(slugOrCode);
  }

  async getExploreCategories(): Promise<ExploreCategory[]> {
    return CANONICAL_EXPLORE_CATEGORIES;
  }

  async getExploreCategoryBySlug(slug: string): Promise<ExploreCategory | undefined> {
    return CANONICAL_EXPLORE_CATEGORIES.find((cat) => cat.slug === slug);
  }
}

// Thread-safe / runtime singleton instance of the static repository
let staticRepoInstance: StaticProcedureRepository | null = null;

/**
 * Authoritative factory function returning the static-backed procedure repository.
 * Contains no database detection, no environment-driven database switching, and no Prisma dependencies.
 */
export function getProcedureRepository(): IProcedureRepository {
  if (!staticRepoInstance) {
    staticRepoInstance = new StaticProcedureRepository();
  }
  return staticRepoInstance;
}
