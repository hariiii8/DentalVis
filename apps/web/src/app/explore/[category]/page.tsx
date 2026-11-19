import React from 'react';
import { notFound } from 'next/navigation';
import { CANONICAL_EXPLORE_CATEGORIES, CANONICAL_PROCEDURES } from '@dentalvis/common';
import CategoryClientView from './CategoryClientView';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;

  const category = CANONICAL_EXPLORE_CATEGORIES.find((c) => c.slug === categorySlug);
  if (!category) {
    notFound();
  }

  const relatedProcedures = CANONICAL_PROCEDURES.filter((p) =>
    p.exploreCategorySlugs.includes(category.slug)
  );

  return <CategoryClientView category={category} relatedProcedures={relatedProcedures} />;
}
