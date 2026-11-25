// packages/database/src/repository/mappers.ts
// DentalVis 2.0 — Relational Prisma Entity to Canonical DTO Mappers
// Architecture Baseline v1.9.1 — Phase B3.2: Database Repository Implementation

import {
  ProcedureDetail,
  DepartmentDto,
  ExploreCategory,
  GovernanceTier,
  ContentStatus,
} from '@dentalvis/common';
import { DatabaseDataIntegrityError } from './errors';

export interface PrismaRevisionPayload {
  id: string;
  language: string;
  revisionNumber: number;
  title: string;
  slug: string;
  summary: string;
  overviewHtml: string;
  snapshotData: unknown;
  model3DMediaId: string | null;
  coverMedia?: {
    id: string;
    secureUrl: string;
  } | null;
  _count?: {
    interactiveSteps: number;
  };
}

export interface PrismaTranslationPayload {
  procedureId: string;
  language: string;
  currentStatus: string;
  publishedRevisionId: string | null;
  publishedRevision?: PrismaRevisionPayload | null;
  revisions?: PrismaRevisionPayload[];
}

export interface PrismaProcedureDepartmentPayload {
  isPrimary: boolean;
  department: {
    id: string;
    code: string;
    slug?: string;
    nameEn: string;
    nameTa: string;
    descriptionEn: string | null;
    descriptionTa: string | null;
  };
}

export interface PrismaProcedureExploreCategoryPayload {
  exploreCategory: {
    id: string;
    slug: string;
  };
}

export interface PrismaProcedurePayload {
  id: string;
  slug: string;
  code: string;
  isArchived: boolean;
  translations: PrismaTranslationPayload[];
  departments: PrismaProcedureDepartmentPayload[];
  exploreCategories: PrismaProcedureExploreCategoryPayload[];
}

export interface PrismaDepartmentPayload {
  id: string;
  code: string;
  slug?: string;
  nameEn: string;
  nameTa: string;
  descriptionEn: string | null;
  descriptionTa: string | null;
}

export interface PrismaExploreCategoryPayload {
  id: string;
  slug: string;
  titleEn: string;
  titleTa: string;
  descriptionEn: string;
  descriptionTa: string;
  iconName: string;
  procedures?: Array<{
    procedure: {
      slug: string;
    };
  }>;
}

/**
 * Validates and extracts optional clinical snapshot fields from the revision JSONB payload.
 */
function extractSnapshotMetadata(snapshot: unknown): {
  governanceTier?: GovernanceTier;
  durationMinutes?: number;
  anesthesiaType?: string;
  coverAltEn?: string;
  coverAltTa?: string;
  coverCaption?: string;
} {
  if (typeof snapshot !== 'object' || snapshot === null) {
    return {};
  }

  const s = snapshot as Record<string, unknown>;

  let governanceTier: GovernanceTier | undefined;
  if (s.governanceTier === 'TIER_1' || s.governanceTier === 'TIER_2' || s.governanceTier === 'TIER_3') {
    governanceTier = s.governanceTier;
  }

  const durationMinutes = typeof s.durationMinutes === 'number' ? s.durationMinutes : undefined;
  const anesthesiaType = typeof s.anesthesiaType === 'string' ? s.anesthesiaType : undefined;

  let coverAltEn: string | undefined;
  let coverAltTa: string | undefined;
  let coverCaption: string | undefined;

  if (typeof s.coverMedia === 'object' && s.coverMedia !== null) {
    const cm = s.coverMedia as Record<string, unknown>;
    coverAltEn = typeof cm.altEn === 'string' ? cm.altEn : undefined;
    coverAltTa = typeof cm.altTa === 'string' ? cm.altTa : undefined;
    coverCaption = typeof cm.caption === 'string' ? cm.caption : undefined;
  }

  return {
    governanceTier,
    durationMinutes,
    anesthesiaType,
    coverAltEn,
    coverAltTa,
    coverCaption,
  };
}

/**
 * Maps a relational Procedure record into the canonical ProcedureDetail DTO.
 * Enforces strict bilingual separation: never substitutes English content for missing Tamil fields.
 */
export function mapProcedureToDetail(proc: PrismaProcedurePayload): ProcedureDetail {
  if (!proc || !proc.id || !proc.slug) {
    throw new DatabaseDataIntegrityError('Invalid Procedure entity: missing id or slug.');
  }

  // 1. Resolve Translations & Revisions: strictly use publishedRevision (fail-closed)
  const enTranslation = proc.translations.find((t) => t.language === 'en');
  const taTranslation = proc.translations.find((t) => t.language === 'ta');

  // Strict Fail-Closed Safeguard: Never fall back to arbitrary revisions via revisionNumber
  const enRevision = enTranslation?.publishedRevision;
  const taRevision = taTranslation?.publishedRevision;

  if (!enRevision) {
    throw new DatabaseDataIntegrityError(
      `Procedure (${proc.slug}) has no eligible published English revision.`
    );
  }

  // Primary content status follows English translation or defaults to DRAFT
  const contentStatus: ContentStatus = (enTranslation?.currentStatus as ContentStatus) ?? 'DRAFT';

  // Extract metadata from English revision snapshotData
  const enSnapshot = extractSnapshotMetadata(enRevision?.snapshotData);
  const taSnapshot = extractSnapshotMetadata(taRevision?.snapshotData);

  // 2. Department Resolution
  const primaryDeptRel = proc.departments.find((d) => d.isPrimary);
  const secondaryDepts = proc.departments
    .filter((d) => !d.isPrimary)
    .map((d) => d.department.code);

  const primaryDepartmentName = primaryDeptRel?.department.nameEn ?? '';
  const primaryDepartmentCode = primaryDeptRel?.department.code;

  // 3. Explore Category Slugs
  const exploreCategorySlugs = proc.exploreCategories.map((c) => c.exploreCategory.slug);

  // 4. Media & 3D Model
  const has3DModel = Boolean(enRevision?.model3DMediaId);
  const model3DId = enRevision?.model3DMediaId ?? undefined;

  let coverImage: ProcedureDetail['coverImage'] = undefined;
  if (enRevision?.coverMedia?.secureUrl) {
    coverImage = {
      url: enRevision.coverMedia.secureUrl,
      altEn: enSnapshot.coverAltEn ?? enRevision.title,
      altTa: taSnapshot.coverAltTa ?? enSnapshot.coverAltTa ?? taRevision?.title ?? '',
      caption: enSnapshot.coverCaption,
    };
  }

  // 5. Interactive Steps Count
  const interactiveStepsCount = enRevision?._count?.interactiveSteps ?? 0;

  return {
    id: proc.id,
    slug: proc.slug,
    code: proc.code,
    titleEn: enRevision?.title ?? '',
    titleTa: taRevision?.title ?? '',
    summaryEn: enRevision?.summary ?? '',
    summaryTa: taRevision?.summary ?? '',
    durationMinutes: enSnapshot.durationMinutes,
    anesthesiaType: enSnapshot.anesthesiaType,
    primaryDepartmentName,
    primaryDepartmentCode,
    secondaryDepartmentCodes: secondaryDepts.length > 0 ? secondaryDepts : undefined,
    exploreCategorySlugs,
    governanceTier: enSnapshot.governanceTier,
    contentStatus,
    overviewHtmlEn: enRevision?.overviewHtml ?? '',
    overviewHtmlTa: taRevision?.overviewHtml ?? '',
    coverImage,
    has3DModel,
    model3DId,
    interactiveStepsCount,
  };
}

/**
 * Maps a relational Department record into the canonical DepartmentDto.
 */
export function mapDepartmentToDto(dept: PrismaDepartmentPayload): DepartmentDto {
  if (!dept || !dept.id || !dept.code) {
    throw new DatabaseDataIntegrityError('Invalid Department entity: missing id or code.');
  }

  // Derive slug from code or name if slug is not a database column
  const slug = dept.slug ?? dept.code.toLowerCase();

  return {
    id: dept.id,
    code: dept.code,
    slug,
    nameEn: dept.nameEn,
    nameTa: dept.nameTa,
    descriptionEn: dept.descriptionEn ?? '',
    descriptionTa: dept.descriptionTa ?? '',
  };
}

/**
 * Maps a relational ExploreCategory record into the canonical ExploreCategory DTO.
 */
export function mapExploreCategoryToDto(cat: PrismaExploreCategoryPayload): ExploreCategory {
  if (!cat || !cat.id || !cat.slug) {
    throw new DatabaseDataIntegrityError('Invalid ExploreCategory entity: missing id or slug.');
  }

  const featuredProcedureSlugs = cat.procedures?.map((p) => p.procedure.slug) ?? [];

  return {
    id: cat.id,
    slug: cat.slug,
    titleEn: cat.titleEn,
    titleTa: cat.titleTa,
    descriptionEn: cat.descriptionEn,
    descriptionTa: cat.descriptionTa,
    iconName: cat.iconName,
    featuredProcedureSlugs,
  };
}
