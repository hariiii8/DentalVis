// packages/common/src/repository/types.ts
// DentalVis 2.0 — Canonical Procedure Repository Contract
// Architecture Baseline v1.9.1 — Phase B2: Repository Abstraction Foundation

import {
  ProcedureDetail,
  DepartmentDto,
  ExploreCategory,
} from '../index';

export interface ProcedureVisibilityEnv {
  nodeEnv?: string;
  previewMode?: string;
  strictClinicalOnly?: boolean;
}

/**
 * Authoritative procedure repository contract covering all public read data-access patterns.
 * Designed to support the static catalogue implementation initially, while enabling
 * future database-backed implementations without altering the public data contract.
 */
export interface IProcedureRepository {
  /**
   * Retrieves all procedures visible under the provided or active environment publication policy.
   * In production, strictly returns procedures with contentStatus === 'PUBLISHED'.
   */
  getVisibleProcedures(env?: ProcedureVisibilityEnv): Promise<ProcedureDetail[]>;

  /**
   * Retrieves a single procedure by slug if visible under the provided or active environment publication policy.
   * Returns undefined if the procedure does not exist or is not visible under current publication rules.
   */
  getVisibleProcedureBySlug(slug: string, env?: ProcedureVisibilityEnv): Promise<ProcedureDetail | undefined>;

  /**
   * Retrieves visible procedures associated with a clinical department by its slug or code (e.g. 'ENDO', 'PERIO').
   */
  getVisibleProceduresByDepartment(deptSlugOrCode: string, env?: ProcedureVisibilityEnv): Promise<ProcedureDetail[]>;

  /**
   * Retrieves clinical department metadata by its slug or code.
   */
  getDepartmentBySlugOrCode(slugOrCode: string): Promise<DepartmentDto | undefined>;

  /**
   * Retrieves all canonical patient-facing explore categories.
   */
  getExploreCategories(): Promise<ExploreCategory[]>;

  /**
   * Retrieves a single explore category by its slug.
   */
  getExploreCategoryBySlug(slug: string): Promise<ExploreCategory | undefined>;
}
