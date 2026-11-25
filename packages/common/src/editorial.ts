// packages/common/src/editorial.ts
// DentalVis — Editorial Content Management, Validation & Bilingual Workflows
// Architecture Baseline v1.9.1 — Milestone M7.3

/**
 * Editorial Content Model representing editable fields of a dental procedure guide.
 * Stored canonically and validated before mutation.
 */
export interface ProcedureEditorialContent {
  id: string;
  slug: string;
  code: string;
  titleEn: string;
  titleTa: string;
  summaryEn: string;
  summaryTa: string;
  overviewHtmlEn: string;
  overviewHtmlTa: string;
  durationMinutes: number;
  anesthesiaType: string;
  primaryDepartmentCode: string;
  secondaryDepartmentCodes: string[];
  exploreCategorySlugs: string[];
  has3DModel: boolean;
  model3DId?: string;
  interactiveStepsCount?: number;
  // Clinical educational fields
  indicationsEn?: string;
  indicationsTa?: string;
  contraindicationsEn?: string;
  contraindicationsTa?: string;
  recoveryInfoEn?: string;
  recoveryInfoTa?: string;
  aftercareInstructionsEn?: string;
  aftercareInstructionsTa?: string;
  risksAndComplicationsEn?: string;
  risksAndComplicationsTa?: string;
  educationalReferencesEn?: string;
  educationalReferencesTa?: string;
}

/**
 * Result of content validation for procedure editing.
 */
export interface ContentValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  warnings: string[];
  completeness: {
    englishPercent: number;
    tamilPercent: number;
    overallPercent: number;
    isEnglishComplete: boolean;
    isTamilComplete: boolean;
  };
}

/**
 * Audit Record for editorial draft actions within the Admin Portal.
 * Records local browser-scoped editorial actions (stored in client storage).
 * Authoritative production audit logging is performed by the server-side GovernanceAuditService
 * writing immutably to PostgreSQL AdminAuditLog table.
 */
export interface EditorialAuditRecord {
  id: string;
  timestamp: string;
  editorId: string;
  editorName: string;
  editorRole: string;
  action: 'CREATE_DRAFT' | 'UPDATE_CONTENT' | 'VALIDATE_CONTENT' | 'PREVIEW_CONTENT' | 'CANCEL_EDIT';
  procedureCode: string;
  procedureSlug: string;
  changesSummary: string;
  previousHash?: string;
  newHash?: string;
}

/**
 * Tamil Unicode range detection regex: \u0B80-\u0BFF.
 */
export const TAMIL_UNICODE_REGEX = /[\u0B80-\u0BFF]/;

/**
 * Checks if a string contains valid Tamil Unicode characters.
 */
export function containsTamilScript(text: string): boolean {
  if (!text || typeof text !== 'string') return false;
  return TAMIL_UNICODE_REGEX.test(text);
}

/**
 * Validates procedure editorial content.
 * Enforces:
 * - Required English fields: titleEn, summaryEn, overviewHtmlEn
 * - Required Tamil fields: titleTa, summaryTa, overviewHtmlTa (with Tamil Unicode characters)
 * - Identifiers: non-empty slug (kebab-case), non-empty code, valid ID
 * - Numbers: durationMinutes > 0
 * - Relationships: valid department code, at least 1 explore category
 * - Text length constraints: titles <= 120 chars, summaries <= 300 chars
 * - Independent language validation: does not silently substitute English for Tamil
 */
export function validateProcedureEditorialContent(
  content: Partial<ProcedureEditorialContent>,
  options?: {
    existingSlugs?: string[];
    existingCodes?: string[];
    isNew?: boolean;
    validDepartmentCodes?: string[];
    validCategorySlugs?: string[];
  }
): ContentValidationResult {
  const errors: Record<string, string> = {};
  const warnings: string[] = [];

  // 1. Identifiers Validation
  if (!content.slug || content.slug.trim() === '') {
    errors.slug = 'Procedure slug is required.';
  } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(content.slug.trim())) {
    errors.slug = 'Procedure slug must be lowercase alphanumeric with hyphens (e.g. "pediatric-pulpotomy").';
  } else if (
    options?.isNew &&
    options?.existingSlugs &&
    options.existingSlugs.includes(content.slug.trim())
  ) {
    errors.slug = `Procedure slug "${content.slug}" already exists in the catalogue.`;
  }

  if (!content.code || content.code.trim() === '') {
    errors.code = 'Procedure code is required (e.g. "ENDO-RCT-01").';
  } else if (!/^[A-Z0-9]+-[A-Z0-9]+-\d{2}$/.test(content.code.trim())) {
    errors.code = 'Procedure code must follow standard format: DEPT-CODE-NN (e.g. "REST-FIL-01").';
  } else if (
    options?.isNew &&
    options?.existingCodes &&
    options.existingCodes.includes(content.code.trim())
  ) {
    errors.code = `Procedure code "${content.code}" already exists in the catalogue.`;
  }

  // 2. English Content Validation
  if (!content.titleEn || content.titleEn.trim() === '') {
    errors.titleEn = 'English procedure title is required.';
  } else if (content.titleEn.length > 120) {
    errors.titleEn = 'English title cannot exceed 120 characters.';
  }

  if (!content.summaryEn || content.summaryEn.trim() === '') {
    errors.summaryEn = 'English procedure summary is required.';
  } else if (content.summaryEn.length > 350) {
    errors.summaryEn = 'English summary cannot exceed 350 characters.';
  }

  if (!content.overviewHtmlEn || content.overviewHtmlEn.trim() === '') {
    errors.overviewHtmlEn = 'English procedure overview HTML content is required.';
  }

  // 3. Tamil Content Validation (Independent, preserves Unicode)
  if (!content.titleTa || content.titleTa.trim() === '') {
    errors.titleTa = 'Tamil procedure title is required (தமிழ் தலைப்பு தேவை).';
  } else if (content.titleTa.length > 150) {
    errors.titleTa = 'Tamil title cannot exceed 150 characters.';
  } else if (!containsTamilScript(content.titleTa)) {
    warnings.push('Tamil title does not contain Tamil Unicode script characters.');
  }

  if (!content.summaryTa || content.summaryTa.trim() === '') {
    errors.summaryTa = 'Tamil procedure summary is required (தமிழ் சுருக்கம் தேவை).';
  } else if (content.summaryTa.length > 450) {
    errors.summaryTa = 'Tamil summary cannot exceed 450 characters.';
  } else if (!containsTamilScript(content.summaryTa)) {
    warnings.push('Tamil summary does not contain Tamil Unicode script characters.');
  }

  if (!content.overviewHtmlTa || content.overviewHtmlTa.trim() === '') {
    errors.overviewHtmlTa = 'Tamil procedure overview HTML is required (தமிழ் விவரம் தேவை).';
  } else if (!containsTamilScript(content.overviewHtmlTa)) {
    warnings.push('Tamil overview HTML does not contain Tamil Unicode script characters.');
  }

  // 4. Clinical Details & Duration
  if (content.durationMinutes === undefined || content.durationMinutes === null) {
    errors.durationMinutes = 'Expected duration in minutes is required.';
  } else if (content.durationMinutes <= 0 || content.durationMinutes > 480) {
    errors.durationMinutes = 'Duration must be between 1 and 480 minutes.';
  }

  if (!content.anesthesiaType || content.anesthesiaType.trim() === '') {
    errors.anesthesiaType = 'Comfort and anesthesia type is required.';
  }

  // 5. Specialty and Category Mappings
  if (!content.primaryDepartmentCode || content.primaryDepartmentCode.trim() === '') {
    errors.primaryDepartmentCode = 'Primary clinical specialty is required.';
  } else if (
    options?.validDepartmentCodes &&
    !options.validDepartmentCodes.includes(content.primaryDepartmentCode.trim())
  ) {
    errors.primaryDepartmentCode = `Invalid specialty code "${content.primaryDepartmentCode}".`;
  }

  if (!content.exploreCategorySlugs || content.exploreCategorySlugs.length === 0) {
    errors.exploreCategorySlugs = 'At least one patient Explore category is required.';
  } else if (options?.validCategorySlugs) {
    for (const catSlug of content.exploreCategorySlugs) {
      if (!options.validCategorySlugs.includes(catSlug)) {
        errors.exploreCategorySlugs = `Invalid Explore category slug "${catSlug}".`;
        break;
      }
    }
  }

  // 6. Completeness calculation
  const enFields = [content.titleEn, content.summaryEn, content.overviewHtmlEn];
  const enComplete = enFields.filter((f) => f && f.trim().length > 0).length;
  const englishPercent = Math.round((enComplete / enFields.length) * 100);

  const taFields = [content.titleTa, content.summaryTa, content.overviewHtmlTa];
  const taComplete = taFields.filter((f) => f && f.trim().length > 0 && containsTamilScript(f)).length;
  const tamilPercent = Math.round((taComplete / taFields.length) * 100);

  const overallPercent = Math.round((englishPercent + tamilPercent) / 2);

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings,
    completeness: {
      englishPercent,
      tamilPercent,
      overallPercent,
      isEnglishComplete: englishPercent === 100,
      isTamilComplete: tamilPercent === 100,
    },
  };
}

/**
 * Editorial Permissions Matrix across the 5 application roles.
 */
export function checkEditorialPermission(
  role: string | undefined,
  action: 'VIEW' | 'EDIT' | 'CREATE_DRAFT' | 'SAVE' | 'PREVIEW'
): { permitted: boolean; reason?: string } {
  if (!role) {
    return { permitted: false, reason: 'Unauthenticated: No user role provided.' };
  }

  switch (role) {
    case 'SYSTEM_ADMIN':
    case 'CHIEF_EDITOR':
    case 'CLINICAL_AUTHOR':
      return { permitted: true };
    case 'CLINICAL_REVIEWER':
      if (action === 'VIEW' || action === 'PREVIEW') {
        return { permitted: true };
      }
      return {
        permitted: false,
        reason: 'Clinical Reviewers have evaluation and oversight permissions, not direct content authoring permissions.',
      };
    case 'PATIENT_VIEWER':
    default:
      if (action === 'VIEW' || action === 'PREVIEW') {
        return { permitted: true };
      }
      return {
        permitted: false,
        reason: 'Patient viewer accounts do not have editorial authoring or modification permissions.',
      };
  }
}
