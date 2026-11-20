import React from 'react';
import { notFound } from 'next/navigation';
import {
  CANONICAL_EXPLORE_CATEGORIES,
  getDepartmentBySlugOrCode,
  getVisibleProceduresByDepartment,
  getVisibleProcedures
} from '@dentalvis/common';
import DepartmentOrCategoryClientView from './CategoryClientView';

interface ExploreDetailPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function ExploreDetailPage({ params }: ExploreDetailPageProps) {
  const { category: slug } = await params;

  // 1. Check if the slug corresponds to one of the 15 canonical clinical departments
  const department = getDepartmentBySlugOrCode(slug);
  if (department) {
    const relatedProcedures = getVisibleProceduresByDepartment(department.code);
    return (
      <DepartmentOrCategoryClientView
        itemType="department"
        department={department}
        relatedProcedures={relatedProcedures}
      />
    );
  }

  // 2. Backward compatibility: check if the slug corresponds to a legacy symptom explore category
  const legacyCategory = CANONICAL_EXPLORE_CATEGORIES.find((c) => c.slug === slug);
  if (legacyCategory) {
    const visibleProcedures = getVisibleProcedures();
    const relatedProcedures = visibleProcedures.filter((p) =>
      p.exploreCategorySlugs.includes(legacyCategory.slug)
    );
    return (
      <DepartmentOrCategoryClientView
        itemType="category"
        category={legacyCategory}
        relatedProcedures={relatedProcedures}
      />
    );
  }

  // 3. If neither department nor category exists
  notFound();
}
