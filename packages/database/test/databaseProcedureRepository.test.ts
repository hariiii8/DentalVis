// packages/database/test/databaseProcedureRepository.test.ts
// DentalVis 2.0 — Comprehensive Regression & Unit Tests for DatabaseProcedureRepository
// Architecture Baseline v1.9.1 — Phase B3.2.2: Security Corrections

import { describe, it, expect, vi } from 'vitest';

// Mock server-only for node test runner
vi.mock('server-only', () => ({}));

import {
  DatabaseProcedureRepository,
  DatabaseConnectionError,
  DatabaseDataIntegrityError,
  mapProcedureToDetail,
  mapDepartmentToDto,
  mapExploreCategoryToDto,
  PrismaProcedurePayload,
} from '../src/repository';

describe('DatabaseProcedureRepository Mappers', () => {
  it('maps complete procedure record into ProcedureDetail DTO with bilingual separation', () => {
    const mockPayload: PrismaProcedurePayload = {
      id: '33333333-3333-4333-a333-333333333301',
      slug: 'root-canal-treatment',
      code: 'ENDO-RCT-01',
      isArchived: false,
      translations: [
        {
          procedureId: '33333333-3333-4333-a333-333333333301',
          language: 'en',
          currentStatus: 'PUBLISHED',
          publishedRevisionId: 'rev-en-1',
          publishedRevision: {
            id: 'rev-en-1',
            language: 'en',
            revisionNumber: 1,
            title: 'Root Canal Treatment',
            slug: 'root-canal-treatment',
            summary: 'Gentle endodontic care.',
            overviewHtml: '<p>English Overview</p>',
            snapshotData: {
              governanceTier: 'TIER_2',
              durationMinutes: 60,
              anesthesiaType: 'Local Anesthesia',
              coverMedia: {
                altEn: 'Molar Anatomy Diagram',
                altTa: 'பல் உடற்கூறியல் படம்',
                caption: 'Clinical Diagram',
              },
            },
            model3DMediaId: 'model-molar-3d',
            coverMedia: {
              id: 'media-cover-1',
              secureUrl: 'https://cdn.dentalvis.org/rct-cover.webp',
            },
            _count: {
              interactiveSteps: 4,
            },
          },
        },
        {
          procedureId: '33333333-3333-4333-a333-333333333301',
          language: 'ta',
          currentStatus: 'PUBLISHED',
          publishedRevisionId: 'rev-ta-1',
          publishedRevision: {
            id: 'rev-ta-1',
            language: 'ta',
            revisionNumber: 1,
            title: 'வேர் கால்வாய் சிகிச்சை',
            slug: 'root-canal-treatment-ta',
            summary: 'இயற்கை பல்லை பாதுகாக்கும் சிகிச்சை.',
            overviewHtml: '<p>தமிழ் விளக்கம்</p>',
            snapshotData: {},
            model3DMediaId: null,
          },
        },
      ],
      departments: [
        {
          isPrimary: true,
          department: {
            id: 'dept-endo',
            code: 'ENDO',
            slug: 'endodontics',
            nameEn: 'Endodontics',
            nameTa: 'வேர் கால்வாய் சிகிச்சை பிரிவு',
            descriptionEn: 'Endodontics dept',
            descriptionTa: 'பிரிவு விளக்கம்',
          },
        },
        {
          isPrimary: false,
          department: {
            id: 'dept-rest',
            code: 'REST',
            slug: 'restorative',
            nameEn: 'Restorative',
            nameTa: 'பல் மறுசீரமைப்பு',
            descriptionEn: null,
            descriptionTa: null,
          },
        },
      ],
      exploreCategories: [
        {
          exploreCategory: {
            id: 'cat-pain',
            slug: 'pain-and-sensitivity',
          },
        },
      ],
    };

    const dto = mapProcedureToDetail(mockPayload);

    expect(dto.id).toBe('33333333-3333-4333-a333-333333333301');
    expect(dto.slug).toBe('root-canal-treatment');
    expect(dto.code).toBe('ENDO-RCT-01');
    expect(dto.titleEn).toBe('Root Canal Treatment');
    expect(dto.titleTa).toBe('வேர் கால்வாய் சிகிச்சை');
    expect(dto.summaryEn).toBe('Gentle endodontic care.');
    expect(dto.summaryTa).toBe('இயற்கை பல்லை பாதுகாக்கும் சிகிச்சை.');
    expect(dto.overviewHtmlEn).toBe('<p>English Overview</p>');
    expect(dto.overviewHtmlTa).toBe('<p>தமிழ் விளக்கம்</p>');
    expect(dto.governanceTier).toBe('TIER_2');
    expect(dto.durationMinutes).toBe(60);
    expect(dto.anesthesiaType).toBe('Local Anesthesia');
    expect(dto.primaryDepartmentName).toBe('Endodontics');
    expect(dto.primaryDepartmentCode).toBe('ENDO');
    expect(dto.secondaryDepartmentCodes).toEqual(['REST']);
    expect(dto.exploreCategorySlugs).toEqual(['pain-and-sensitivity']);
    expect(dto.has3DModel).toBe(true);
    expect(dto.model3DId).toBe('model-molar-3d');
    expect(dto.interactiveStepsCount).toBe(4);
    expect(dto.coverImage).toEqual({
      url: 'https://cdn.dentalvis.org/rct-cover.webp',
      altEn: 'Molar Anatomy Diagram',
      altTa: 'பல் உடற்கூறியல் படம்',
      caption: 'Clinical Diagram',
    });
  });

  it('handles missing Tamil translation without substituting English text', () => {
    const mockPayload: PrismaProcedurePayload = {
      id: '33333333-3333-4333-a333-333333333302',
      slug: 'dental-crowns',
      code: 'PROS-CRN-01',
      isArchived: false,
      translations: [
        {
          procedureId: '33333333-3333-4333-a333-333333333302',
          language: 'en',
          currentStatus: 'PUBLISHED',
          publishedRevisionId: 'rev-en-crown',
          publishedRevision: {
            id: 'rev-en-crown',
            language: 'en',
            revisionNumber: 1,
            title: 'Dental Crowns',
            slug: 'dental-crowns',
            summary: 'Tooth protection.',
            overviewHtml: '<p>Crown overview</p>',
            snapshotData: {},
            model3DMediaId: null,
          },
        },
      ],
      departments: [],
      exploreCategories: [],
    };

    const dto = mapProcedureToDetail(mockPayload);

    expect(dto.titleEn).toBe('Dental Crowns');
    expect(dto.titleTa).toBe(''); // Strictly empty, never copied from English
    expect(dto.summaryTa).toBe('');
    expect(dto.overviewHtmlTa).toBe('');
  });

  it('fails closed when published English revision is missing (never selects fallback)', () => {
    const mockPayloadWithoutPublishedRevision: PrismaProcedurePayload = {
      id: '33333333-3333-4333-a333-333333333303',
      slug: 'unapproved-procedure',
      code: 'UNAP-01',
      isArchived: false,
      translations: [
        {
          procedureId: '33333333-3333-4333-a333-333333333303',
          language: 'en',
          currentStatus: 'DRAFT',
          publishedRevisionId: null,
          publishedRevision: null,
          revisions: [
            {
              id: 'unvetted-rev-99',
              language: 'en',
              revisionNumber: 99,
              title: 'Unvetted Dangerous Statement',
              slug: 'unvetted-procedure',
              summary: 'Unapproved draft content.',
              overviewHtml: '<p>Dangerous unvetted advice</p>',
              snapshotData: {},
              model3DMediaId: null,
            },
          ],
        },
      ],
      departments: [],
      exploreCategories: [],
    };

    expect(() => mapProcedureToDetail(mockPayloadWithoutPublishedRevision)).toThrow(
      DatabaseDataIntegrityError
    );
    expect(() => mapProcedureToDetail(mockPayloadWithoutPublishedRevision)).toThrow(
      'has no eligible published English revision'
    );
  });

  it('throws DatabaseDataIntegrityError when procedure ID or slug is missing', () => {
    expect(() =>
      mapProcedureToDetail({} as unknown as PrismaProcedurePayload)
    ).toThrow(DatabaseDataIntegrityError);
  });

  it('maps department and explore category entities properly', () => {
    const deptDto = mapDepartmentToDto({
      id: 'dept-1',
      code: 'ENDO',
      slug: 'endodontics',
      nameEn: 'Endodontics',
      nameTa: 'வேர் கால்வாய் பிரிவு',
      descriptionEn: 'Care',
      descriptionTa: 'விளக்கம்',
    });
    expect(deptDto.code).toBe('ENDO');
    expect(deptDto.slug).toBe('endodontics');
    expect(deptDto.nameTa).toBe('வேர் கால்வாய் பிரிவு');

    const catDto = mapExploreCategoryToDto({
      id: 'cat-1',
      slug: 'pain',
      titleEn: 'Pain',
      titleTa: 'வலி',
      descriptionEn: 'Pain desc',
      descriptionTa: 'வலி விளக்கம்',
      iconName: 'AlertCircle',
      procedures: [{ procedure: { slug: 'root-canal-treatment' } }],
    });
    expect(catDto.slug).toBe('pain');
    expect(catDto.featuredProcedureSlugs).toEqual(['root-canal-treatment']);
  });
});

describe('DatabaseProcedureRepository Security, Visibility & Filtering', () => {
  it('enforces published-only visibility with active approval when strictClinicalOnly is requested', async () => {
    const mockFindMany = vi.fn().mockResolvedValue([]);
    const mockPrisma = {
      procedure: {
        findMany: mockFindMany,
      },
    } as unknown as any;

    const repo = new DatabaseProcedureRepository(mockPrisma);
    const results = await repo.getVisibleProcedures({ strictClinicalOnly: true });

    expect(results).toEqual([]);
    expect(mockFindMany).toHaveBeenCalledTimes(1);

    const callArgs = mockFindMany.mock.calls[0][0];
    expect(callArgs.where.isArchived).toBe(false);
    expect(callArgs.where.translations.some.language).toBe('en');
    expect(callArgs.where.translations.some.currentStatus).toBe('PUBLISHED');
    expect(callArgs.where.translations.some.isArchived).toBe(false);
    expect(callArgs.where.translations.some.publishedRevisionId).toEqual({ not: null });
    expect(callArgs.where.translations.some.publishedRevision.approvals.some.decision).toBe('APPROVED');
    expect(callArgs.where.translations.some.publishedRevision.approvals.some.isRevoked).toBe(false);
  });

  it('educational access policy: default visibility query returns all unarchived procedures', async () => {
    const mockFindMany = vi.fn().mockResolvedValue([]);
    const mockPrisma = {
      procedure: {
        findMany: mockFindMany,
      },
    } as unknown as any;

    const repo = new DatabaseProcedureRepository(mockPrisma);
    await repo.getVisibleProcedures();

    const callArgs = mockFindMany.mock.calls[0][0];
    expect(callArgs.where.isArchived).toBe(false);
    expect(callArgs.where.translations).toBeUndefined();
  });

  it('strictClinicalOnly enforces published-only filter regardless of environment', async () => {
    const mockFindMany = vi.fn().mockResolvedValue([]);
    const mockPrisma = {
      procedure: {
        findMany: mockFindMany,
      },
    } as unknown as any;

    const repo = new DatabaseProcedureRepository(mockPrisma);
    await repo.getVisibleProcedures({ nodeEnv: 'development', previewMode: 'true', strictClinicalOnly: true });

    const callArgs = mockFindMany.mock.calls[0][0];
    expect(callArgs.where.translations.some.currentStatus).toBe('PUBLISHED');
    expect(callArgs.where.translations.some.publishedRevisionId).toEqual({ not: null });
  });

  it('returns undefined when procedure slug does not exist', async () => {
    const mockFindFirst = vi.fn().mockResolvedValue(null);
    const mockPrisma = {
      procedure: {
        findFirst: mockFindFirst,
      },
    } as unknown as any;

    const repo = new DatabaseProcedureRepository(mockPrisma);
    const result = await repo.getVisibleProcedureBySlug('non-existent-slug');

    expect(result).toBeUndefined();
  });

  it('masks database connection errors with sanitized DatabaseConnectionError', async () => {
    const mockFindMany = vi.fn().mockRejectedValue(new Error('connect ECONNREFUSED 127.0.0.1:5432'));
    const mockPrisma = {
      procedure: {
        findMany: mockFindMany,
      },
    } as unknown as any;

    const repo = new DatabaseProcedureRepository(mockPrisma);

    await expect(repo.getVisibleProcedures()).rejects.toThrow(DatabaseConnectionError);
    await expect(repo.getVisibleProcedures()).rejects.toThrow(
      'The database service is temporarily unreachable.'
    );
  });

  it('resolves department query using canonical department code (e.g. ENDO)', async () => {
    const mockFindDept = vi.fn().mockResolvedValue({ id: 'dept-endo-id', code: 'ENDO' });
    const mockFindProcs = vi.fn().mockResolvedValue([]);
    const mockPrisma = {
      department: {
        findFirst: mockFindDept,
      },
      procedure: {
        findMany: mockFindProcs,
      },
    } as unknown as any;

    const repo = new DatabaseProcedureRepository(mockPrisma);
    const res = await repo.getVisibleProceduresByDepartment('ENDO');

    expect(res).toEqual([]);
    expect(mockFindDept).toHaveBeenCalled();
    const deptArgs = mockFindDept.mock.calls[0][0];
    expect(deptArgs.where.code.equals).toBe('ENDO');
  });

  it('resolves department query using canonical department slug (e.g. endodontics -> ENDO)', async () => {
    const mockFindDept = vi.fn().mockResolvedValue({ id: 'dept-endo-id', code: 'ENDO' });
    const mockFindProcs = vi.fn().mockResolvedValue([]);
    const mockPrisma = {
      department: {
        findFirst: mockFindDept,
      },
      procedure: {
        findMany: mockFindProcs,
      },
    } as unknown as any;

    const repo = new DatabaseProcedureRepository(mockPrisma);
    const res = await repo.getVisibleProceduresByDepartment('endodontics');

    expect(res).toEqual([]);
    expect(mockFindDept).toHaveBeenCalled();
    const deptArgs = mockFindDept.mock.calls[0][0];
    // Automatically mapped slug 'endodontics' into authoritative code 'ENDO'
    expect(deptArgs.where.code.equals).toBe('ENDO');
  });

  it('resolves getDepartmentBySlugOrCode using slug (e.g. periodontics -> PERIO)', async () => {
    const mockFindDept = vi.fn().mockResolvedValue({
      id: 'dept-perio-id',
      code: 'PERIO',
      nameEn: 'Periodontics',
      nameTa: 'ஈறு நோய் பிரிவு',
      descriptionEn: 'Perio care',
      descriptionTa: null,
    });
    const mockPrisma = {
      department: {
        findFirst: mockFindDept,
      },
    } as unknown as any;

    const repo = new DatabaseProcedureRepository(mockPrisma);
    const deptDto = await repo.getDepartmentBySlugOrCode('periodontics');

    expect(deptDto).toBeDefined();
    expect(deptDto?.code).toBe('PERIO');
    expect(deptDto?.slug).toBe('periodontics');
    expect(deptDto?.nameEn).toBe('Periodontics');
  });

  it('returns empty array / undefined when querying procedures or department for an unknown value', async () => {
    const mockFindDept = vi.fn().mockResolvedValue(null);
    const mockPrisma = {
      department: {
        findFirst: mockFindDept,
      },
    } as unknown as any;

    const repo = new DatabaseProcedureRepository(mockPrisma);
    const resProcs = await repo.getVisibleProceduresByDepartment('non-existent-dept-12345');
    const resDept = await repo.getDepartmentBySlugOrCode('non-existent-dept-12345');

    expect(resProcs).toEqual([]);
    expect(resDept).toBeUndefined();
  });
});
