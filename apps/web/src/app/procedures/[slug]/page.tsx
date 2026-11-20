import React from 'react';
import { notFound } from 'next/navigation';
import { getVisibleProcedureBySlug, getVisibleProcedures } from '@dentalvis/common';
import ProcedureDetailClientView from './ProcedureDetailClientView';

interface ProcedurePageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params strictly for published procedures
export async function generateStaticParams() {
  const publishedProcedures = getVisibleProcedures();
  return publishedProcedures.map((p) => ({
    slug: p.slug,
  }));
}

export default async function ProcedureDetailPage({ params }: ProcedurePageProps) {
  const { slug } = await params;

  // Strict publication gating: returns 404 for unapproved draft / non-published procedures in production
  const procedure = getVisibleProcedureBySlug(slug);
  if (!procedure) {
    notFound();
  }

  // Find other published procedures for the related recommendations (never recommend unpublished drafts)
  const relatedProcedures = getVisibleProcedures()
    .filter((p) => p.id !== procedure.id)
    .slice(0, 3);

  return <ProcedureDetailClientView procedure={procedure} relatedProcedures={relatedProcedures} />;
}
