// packages/database/prisma/seed.ts
// DentalVis 2.0 — Development Seed Script
// Architecture Baseline v1.9.1 & Phase 2.2 Specification
//
// Rules enforced:
// 1. Never invent doctor approvals.
// 2. Never mark unverified placeholder revisions as clinically approved.
// 3. Reconciles with canonical Explore Categories and Procedures.
// 4. Establishes primary department assignments and unapproved DRAFT revisions.

import { PrismaClient, UserRole, ContentLanguage, ContentStatus } from '@prisma/client';
import { 
  CANONICAL_EXPLORE_CATEGORIES, 
  CANONICAL_DEPARTMENTS, 
  CANONICAL_PROCEDURES,
  CLINICAL_DISCLAIMER_EN 
} from '@dentalvis/common';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting DentalVis 2.0 database seeding...');

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

  // 2. Seed Clinical Departments
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
  console.log(`✓ Seeded ${CANONICAL_DEPARTMENTS.length} clinical departments.`);

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
    // 4a. Procedure Root Entity
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
    const matchingDept = deptMap.find(d => proc.primaryDepartmentName.includes(d.nameEn) || d.code === 'ENDO');
    if (matchingDept) {
      await prisma.procedureDepartment.upsert({
        where: {
          procedureId_departmentId: {
            procedureId: createdProc.id,
            departmentId: matchingDept.id,
          },
        },
        update: {
          isPrimary: true,
        },
        create: {
          procedureId: createdProc.id,
          departmentId: matchingDept.id,
          isPrimary: true,
        },
      });
    }

    // 4c. Explore Category Relationships
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

    // 4d. Seed English Translation Anchor (Status: DRAFT - No fake approvals)
    const enTrans = await prisma.procedureTranslation.upsert({
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

    // 4e. Seed Draft Revision 1 (Unapproved Editorial Snapshot)
    const enRevision = await prisma.procedureRevision.upsert({
      where: {
        procedureId_language_revisionNumber: {
          procedureId: createdProc.id,
          language: ContentLanguage.en,
          revisionNumber: 1,
        },
      },
      update: {},
      create: {
        procedureId: createdProc.id,
        language: ContentLanguage.en,
        revisionNumber: 1,
        title: proc.titleEn,
        slug: proc.slug,
        summary: proc.summaryEn,
        overviewHtml: proc.overviewHtmlEn,
        sanitizerVersion: 'DOMPurify-3.2',
        contentHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', // Initial hash placeholder
        authorId: systemAuthor.id,
        snapshotData: {
          procedureId: createdProc.id,
          language: 'en',
          revisionNumber: 1,
          title: proc.titleEn,
          slug: proc.slug,
          summary: proc.summaryEn,
          overviewHtml: proc.overviewHtmlEn,
          disclaimer: CLINICAL_DISCLAIMER_EN,
        },
      },
    });

    // 4f. Seed Tamil Translation Anchor (Status: DRAFT)
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
      update: {},
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
          disclaimer: CLINICAL_DISCLAIMER_EN,
        },
      },
    });
  }
  console.log(`✓ Seeded ${CANONICAL_PROCEDURES.length} procedures with DRAFT bilingual revisions.`);
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
