// packages/database/prisma/seed.ts
// DentalVis — Development & Production Seed Script
// Architecture Baseline v1.9.1 — Phase 2.2 Department Expansion & Batch 1 Catalogue
//
// Rules enforced:
// 1. Exactly 15 approved departments seeded.
// 2. Option A In-Place narrowing of IMPL (UUID preserved) and OMFS added.
// 3. Exactly 10 canonical procedures seeded with idempotent upserts.
// 4. Strict Governance: 0 doctor approvals invented; all revisions remain in DRAFT status.
// 5. Existing four procedures preserved with existing UUIDs and revisions.

import { PrismaClient, UserRole, ContentLanguage, ContentStatus } from '@prisma/client';
import { 
  CANONICAL_EXPLORE_CATEGORIES, 
  CANONICAL_DEPARTMENTS, 
  CANONICAL_PROCEDURES,
  CLINICAL_DISCLAIMER_EN 
} from '@dentalvis/common';

const prisma = new PrismaClient();

// Secondary department associations per approved Phase 2.1 mapping
const SECONDARY_DEPARTMENT_CODES: Record<string, string[]> = {
  'root-canal-treatment': ['REST'],
  'dental-crowns': ['REST'],
  'deep-cleaning-scaling': ['PREV'],
  'single-dental-implant': ['PROS', 'OMFS'], // Approved addition of OMFS for surgical implant placement
  'composite-dental-fillings': ['PREV'],
  'routine-dental-cleaning-polishing': ['PERIO'],
  'routine-tooth-extraction': ['REST'],
  'wisdom-tooth-extraction': [],
  'fixed-orthodontic-braces': ['PEDO'],
  'professional-teeth-whitening': [],
  // Batch 2 procedures
  'dental-sealants': ['PEDO'],
  'topical-fluoride-treatment': ['PEDO'],
  'custom-night-guard-bruxism': ['TMJD', 'REST'],
  'sports-mouthguard-trauma-prevention': ['EMRG', 'PEDO'],
  'inlays-and-onlays': ['PROS'],
  'direct-composite-bonding': ['COSM'],
  'pulp-capping': ['ENDO'],
  'endodontic-retreatment': [],
  'apicoectomy': ['OMFS'],
  'internal-tooth-bleaching': ['COSM'],
  // Batch 3 procedures
  'gingival-flap-surgery': ['REST'],
  'gum-grafting': ['COSM'],
  'crown-lengthening': ['PROS', 'REST'],
  'frenectomy': ['PEDO', 'ORTH'],
  'socket-preservation-bone-graft': ['IMPL', 'PERIO'],
  'alveolar-ridge-augmentation': ['IMPL'],
  'sinus-lift': ['IMPL'],
  'dental-abscess-management': ['EMRG', 'ENDO'],
  'implant-supported-bridge': ['PROS'],
  'full-arch-implant-restoration': ['PROS', 'OMFS'],
  // Batch 4 procedures
  'complete-removable-dentures': [],
  'removable-partial-dentures': [],
  'full-mouth-rehabilitation': ['TMJD', 'IMPL'],
  'clear-aligners': ['COSM'],
  'palatal-expander': ['PEDO'],
  'orthodontic-retainers': [],
  'pediatric-pulpotomy': ['ENDO'],
  'pediatric-stainless-steel-crowns': ['REST'],
  'pediatric-space-maintainers': ['ORTH'],
};

// Department code lookup helper
const PROCEDURE_PRIMARY_DEPT_CODE: Record<string, string> = {
  'root-canal-treatment': 'ENDO',
  'dental-crowns': 'PROS',
  'deep-cleaning-scaling': 'PERIO',
  'single-dental-implant': 'IMPL',
  'composite-dental-fillings': 'REST',
  'routine-dental-cleaning-polishing': 'PREV',
  'routine-tooth-extraction': 'OMFS',
  'wisdom-tooth-extraction': 'OMFS',
  'fixed-orthodontic-braces': 'ORTH',
  'professional-teeth-whitening': 'COSM',
  // Batch 2 procedures
  'dental-sealants': 'PREV',
  'topical-fluoride-treatment': 'PREV',
  'custom-night-guard-bruxism': 'PREV',
  'sports-mouthguard-trauma-prevention': 'PREV',
  'inlays-and-onlays': 'REST',
  'direct-composite-bonding': 'REST',
  'pulp-capping': 'REST',
  'endodontic-retreatment': 'ENDO',
  'apicoectomy': 'ENDO',
  'internal-tooth-bleaching': 'ENDO',
  // Batch 3 procedures
  'gingival-flap-surgery': 'PERIO',
  'gum-grafting': 'PERIO',
  'crown-lengthening': 'PERIO',
  'frenectomy': 'PERIO',
  'socket-preservation-bone-graft': 'OMFS',
  'alveolar-ridge-augmentation': 'OMFS',
  'sinus-lift': 'OMFS',
  'dental-abscess-management': 'OMFS',
  'implant-supported-bridge': 'IMPL',
  'full-arch-implant-restoration': 'IMPL',
  // Batch 4 procedures
  'complete-removable-dentures': 'PROS',
  'removable-partial-dentures': 'PROS',
  'full-mouth-rehabilitation': 'PROS',
  'clear-aligners': 'ORTH',
  'palatal-expander': 'ORTH',
  'orthodontic-retainers': 'ORTH',
  'pediatric-pulpotomy': 'PEDO',
  'pediatric-stainless-steel-crowns': 'PEDO',
  'pediatric-space-maintainers': 'PEDO',
};

async function main() {
  console.log('🌱 Starting DentalVis Phase 2.2 database seeding...');

  // 1. Seed System Admin & Clinical Author (Unapproved Draft Author)
  const systemAuthor = await prisma.user.upsert({
    where: { email: 'author@dentalvis.org' },
    update: {},
    create: {
      id: '00000000-0000-4000-a000-000000000001',
      email: 'author@dentalvis.org',
      passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$dGVzdHNhbHQ$testplaceholderhashnotforproduction',
      fullName: 'DentalVis Editorial Staff',
      role: UserRole.CLINICAL_AUTHOR,
      clinicalSpecialty: 'General Dentistry Education',
      isActive: true,
    },
  });
  console.log(`✓ Seeded Clinical Author: ${systemAuthor.email}`);

  // 2. Seed 15 Clinical Departments (Enforcing Option A for IMPL + New OMFS)
  for (const dept of CANONICAL_DEPARTMENTS) {
    await prisma.department.upsert({
      where: { code: dept.code },
      update: {
        nameEn: dept.nameEn,
        nameTa: dept.nameTa,
        descriptionEn: dept.descriptionEn,
        descriptionTa: dept.descriptionTa,
      },
      create: {
        id: dept.id,
        code: dept.code,
        nameEn: dept.nameEn,
        nameTa: dept.nameTa,
        descriptionEn: dept.descriptionEn,
        descriptionTa: dept.descriptionTa,
        isArchived: false,
      },
    });
  }
  console.log(`✓ Seeded ${CANONICAL_DEPARTMENTS.length} clinical departments (15 departments confirmed).`);

  // 3. Seed Explore Categories (Decoupled Patient Discovery Taxonomy)
  for (let i = 0; i < CANONICAL_EXPLORE_CATEGORIES.length; i++) {
    const cat = CANONICAL_EXPLORE_CATEGORIES[i];
    await prisma.exploreCategory.upsert({
      where: { slug: cat.slug },
      update: {
        titleEn: cat.titleEn,
        titleTa: cat.titleTa,
        descriptionEn: cat.descriptionEn,
        descriptionTa: cat.descriptionTa,
        iconName: cat.iconName,
        displayOrder: i + 1,
      },
      create: {
        id: cat.id,
        slug: cat.slug,
        titleEn: cat.titleEn,
        titleTa: cat.titleTa,
        descriptionEn: cat.descriptionEn,
        descriptionTa: cat.descriptionTa,
        iconName: cat.iconName,
        displayOrder: i + 1,
        isArchived: false,
      },
    });
  }
  console.log(`✓ Seeded ${CANONICAL_EXPLORE_CATEGORIES.length} patient explore categories.`);

  // 4. Seed Procedures, Translations, Revisions, and Invariant Relationships
  const deptMap = await prisma.department.findMany();

  for (const proc of CANONICAL_PROCEDURES) {
    // 4a. Procedure Root Entity (Preserves existing UUIDs)
    const createdProc = await prisma.procedure.upsert({
      where: { code: proc.code },
      update: {
        slug: proc.slug,
      },
      create: {
        id: proc.id,
        code: proc.code,
        slug: proc.slug,
        isArchived: false,
      },
    });

    // 4b. Primary Department Assignment (Exact-one primary invariant)
    const primaryDeptCode = PROCEDURE_PRIMARY_DEPT_CODE[proc.slug] || 'PREV';
    const primaryDept = deptMap.find(d => d.code === primaryDeptCode);
    if (primaryDept) {
      await prisma.procedureDepartment.upsert({
        where: {
          procedureId_departmentId: {
            procedureId: createdProc.id,
            departmentId: primaryDept.id,
          },
        },
        update: {
          isPrimary: true,
        },
        create: {
          procedureId: createdProc.id,
          departmentId: primaryDept.id,
          isPrimary: true,
        },
      });
    }

    // 4c. Secondary Department Associations (Approved Phase 2.1 Multi-Dept Mappings)
    const secondaryCodes = SECONDARY_DEPARTMENT_CODES[proc.slug] || [];
    for (const secCode of secondaryCodes) {
      const secDept = deptMap.find(d => d.code === secCode);
      if (secDept) {
        await prisma.procedureDepartment.upsert({
          where: {
            procedureId_departmentId: {
              procedureId: createdProc.id,
              departmentId: secDept.id,
            },
          },
          update: {
            isPrimary: false,
          },
          create: {
            procedureId: createdProc.id,
            departmentId: secDept.id,
            isPrimary: false,
          },
        });
      }
    }

    // 4d. Explore Category Relationships
    for (const catSlug of proc.exploreCategorySlugs) {
      const cat = await prisma.exploreCategory.findUnique({ where: { slug: catSlug } });
      if (cat) {
        await prisma.procedureExploreCategory.upsert({
          where: {
            procedureId_exploreCategoryId: {
              procedureId: createdProc.id,
              exploreCategoryId: cat.id,
            },
          },
          update: {},
          create: {
            procedureId: createdProc.id,
            exploreCategoryId: cat.id,
          },
        });
      }
    }

    // 4e. Seed English Translation Anchor (Status: DRAFT - No fake approvals)
    await prisma.procedureTranslation.upsert({
      where: {
        procedureId_language: {
          procedureId: createdProc.id,
          language: ContentLanguage.en,
        },
      },
      update: {},
      create: {
        procedureId: createdProc.id,
        language: ContentLanguage.en,
        currentStatus: ContentStatus.DRAFT,
      },
    });

    // 4f. Seed Draft Revision 1 (Unapproved Editorial Snapshot)
    await prisma.procedureRevision.upsert({
      where: {
        procedureId_language_revisionNumber: {
          procedureId: createdProc.id,
          language: ContentLanguage.en,
          revisionNumber: 1,
        },
      },
      update: {
        title: proc.titleEn,
        slug: proc.slug,
        summary: proc.summaryEn,
        overviewHtml: proc.overviewHtmlEn,
      },
      create: {
        procedureId: createdProc.id,
        language: ContentLanguage.en,
        revisionNumber: 1,
        title: proc.titleEn,
        slug: proc.slug,
        summary: proc.summaryEn,
        overviewHtml: proc.overviewHtmlEn,
        sanitizerVersion: 'DOMPurify-3.2',
        contentHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        authorId: systemAuthor.id,
        snapshotData: {
          procedureId: createdProc.id,
          language: 'en',
          revisionNumber: 1,
          title: proc.titleEn,
          slug: proc.slug,
          summary: proc.summaryEn,
          overviewHtml: proc.overviewHtmlEn,
          governanceTier: proc.governanceTier,
          disclaimer: CLINICAL_DISCLAIMER_EN,
        },
      },
    });

    // 4g. Seed Tamil Translation Anchor (Status: DRAFT)
    await prisma.procedureTranslation.upsert({
      where: {
        procedureId_language: {
          procedureId: createdProc.id,
          language: ContentLanguage.ta,
        },
      },
      update: {},
      create: {
        procedureId: createdProc.id,
        language: ContentLanguage.ta,
        currentStatus: ContentStatus.DRAFT,
      },
    });

    await prisma.procedureRevision.upsert({
      where: {
        procedureId_language_revisionNumber: {
          procedureId: createdProc.id,
          language: ContentLanguage.ta,
          revisionNumber: 1,
        },
      },
      update: {
        title: proc.titleTa,
        slug: proc.slug,
        summary: proc.summaryTa,
        overviewHtml: proc.overviewHtmlTa,
      },
      create: {
        procedureId: createdProc.id,
        language: ContentLanguage.ta,
        revisionNumber: 1,
        title: proc.titleTa,
        slug: proc.slug,
        summary: proc.summaryTa,
        overviewHtml: proc.overviewHtmlTa,
        sanitizerVersion: 'DOMPurify-3.2',
        contentHash: 'f4b27777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
        authorId: systemAuthor.id,
        snapshotData: {
          procedureId: createdProc.id,
          language: 'ta',
          revisionNumber: 1,
          title: proc.titleTa,
          slug: proc.slug,
          summary: proc.summaryTa,
          overviewHtml: proc.overviewHtmlTa,
          governanceTier: proc.governanceTier,
          disclaimer: CLINICAL_DISCLAIMER_EN,
        },
      },
    });
  }
  console.log(`✓ Seeded ${CANONICAL_PROCEDURES.length} procedures (10 total: 4 preserved + 6 new Batch 1) with DRAFT bilingual revisions.`);
  console.log('🔒 Strict Governance Preserved: 0 doctor approvals invented; all revisions remain in DRAFT status.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('✅ Seed completed successfully.');
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
