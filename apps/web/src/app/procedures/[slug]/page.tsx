import React from 'react';
import { notFound } from 'next/navigation';
import { CANONICAL_PROCEDURES } from '@dentalvis/common';
import ProcedureDetailClientView from './ProcedureDetailClientView';

interface ProcedurePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProcedureDetailPage({ params }: ProcedurePageProps) {
  const { slug } = await params;

  const procedure = CANONICAL_PROCEDURES.find((p) => p.slug === slug);
  if (!procedure) {
    notFound();
  }

  // Find other procedures for the related recommendations
  const relatedProcedures = CANONICAL_PROCEDURES.filter((p) => p.id !== procedure.id).slice(0, 3);

  return <ProcedureDetailClientView procedure={procedure} relatedProcedures={relatedProcedures} />;
}
