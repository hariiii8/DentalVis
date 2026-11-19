import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container, Button, Card, Badge, ClinicalDisclaimerBanner } from '@dentalvis/ui';
import { CANONICAL_PROCEDURES } from '@dentalvis/common';
import { Box, CheckCircle2, Play, Volume2 } from 'lucide-react';

interface ProcedurePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProcedureDetailPage({ params }: ProcedurePageProps) {
  const { slug } = await params;
  
  const procedure = CANONICAL_PROCEDURES.find(p => p.slug === slug);
  if (!procedure) {
    notFound();
  }

  return (
    <div className="py-12 space-y-16">
      <Container>
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/explore" className="text-[#0D9488] hover:underline font-medium">Explore</Link>
          <span>/</span>
          <span className="font-semibold text-slate-700">{procedure.titleEn}</span>
        </div>

        {/* 1. DESKTOP HERO: Two-Column Established Layout (Section 11) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* Left Column: Educational Video / Visual Shield Component */}
          <div className="lg:col-span-6 space-y-4">
            <Card className="overflow-hidden border-teal-100 shadow-md">
              <div className="relative aspect-video bg-gradient-to-br from-teal-900 to-[#134E4A] flex flex-col items-center justify-center p-6 text-white text-center">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white mb-4 hover:scale-110 transition-transform cursor-pointer">
                  <Play className="w-8 h-8 fill-white ml-1" />
                </div>
                <Badge variant="mint" className="mb-2 text-xs">Educational Clinical Animation</Badge>
                <h4 className="font-bold text-lg">{procedure.titleEn} Overview</h4>
                <p className="text-xs text-teal-100 max-w-sm mt-1">
                  Click-to-load video consent: No third-party network requests are loaded until you play.
                </p>
              </div>
              <div className="p-4 bg-teal-50/60 flex items-center justify-between text-xs text-[#134E4A]">
                <div className="flex items-center gap-1.5 font-medium">
                  <Volume2 className="w-4 h-4 text-[#0D9488]" />
                  <span>Audio explanation available</span>
                </div>
                <span className="text-slate-500">Duration: 2:45 min</span>
              </div>
            </Card>
          </div>

          {/* Right Column: Title, Description, Key Facts */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="mint" className="text-xs font-bold uppercase tracking-wider">
                {procedure.primaryDepartmentName}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Code: {procedure.code}
              </Badge>
              {procedure.has3DModel && (
                <Badge variant="default" className="text-xs gap-1">
                  <Box className="w-3.5 h-3.5" />
                  <span>3D Model Included</span>
                </Badge>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#134E4A] tracking-tight">
              {procedure.titleEn}
            </h1>
            <p className="text-lg font-semibold text-[#0D9488]">
              {procedure.titleTa}
            </p>

            <p className="text-base text-slate-600 leading-relaxed">
              {procedure.summaryEn}
            </p>

            {/* Key Facts Pill Grid */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-white border border-teal-100/80 shadow-sm">
              <div className="space-y-1">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Typical Time</span>
                <p className="text-sm font-bold text-[#134E4A]">~{procedure.durationMinutes} minutes</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Comfort / Anesthesia</span>
                <p className="text-sm font-bold text-[#134E4A]">{procedure.anesthesiaType}</p>
              </div>
            </div>

            <div className="pt-2">
              <ClinicalDisclaimerBanner />
            </div>
          </div>
        </div>

        {/* 2. BELOW THE HERO: Multi-Step Educational Breakdown (Section 11) */}
        <div className="space-y-12 max-w-4xl">
          {/* Step 1: Overview */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#134E4A]">1. Procedure Overview</h2>
            <div className="prose prose-teal text-slate-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: procedure.overviewHtmlEn }} />
          </section>

          {/* Step 2: What to Expect During Treatment */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#134E4A]">2. Step-by-Step Treatment Process</h2>
            <div className="space-y-4">
              {[
                { num: 1, title: 'Numbing & Comfort Preparation', desc: 'Gentle localized anesthetic is applied so you feel comfortable and completely relaxed throughout.' },
                { num: 2, title: 'Gentle Cleaning & Preparation', desc: 'The clinician carefully removes damaged tissue and disinfects the microscopic area thoroughly.' },
                { num: 3, title: 'Biocompatible Sealing & Restoration', desc: 'The tooth is sealed securely with protective dental materials to safeguard its long-term health.' },
              ].map((step) => (
                <Card key={step.num} className="p-5 flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#E6F7F2] text-[#0D9488] font-bold text-sm flex items-center justify-center shrink-0">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#134E4A]">{step.title}</h3>
                    <p className="text-sm text-slate-600 mt-1">{step.desc}</p>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Step 3: Interactive 3D Anatomy Module (Phase 4 Anchor) */}
          <section className="space-y-4 pt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#134E4A]">3. Interactive 3D Anatomy Module</h2>
              <Badge variant="mint">R3F / WebGL</Badge>
            </div>

            <Card className="p-8 text-center bg-gradient-to-b from-teal-50/50 to-white border-teal-100">
              <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-teal-100 flex items-center justify-center text-[#0D9488] mx-auto mb-4">
                <Box className="w-8 h-8 animate-bounce text-[#0D9488]" />
              </div>
              <h3 className="text-lg font-bold text-[#134E4A]">Interactive 3D Viewer Placeholder</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto mt-2">
                This viewport anchors the React Three Fiber anatomy viewer (scheduled for Phase 4) with StrictMode resource guards and automatic 2D fallback.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <Button variant="outline" size="sm" className="text-xs">
                  Switch to 2D Illustration Mode
                </Button>
              </div>
            </Card>
          </section>

          {/* Step 4: Aftercare & Recovery Guidance */}
          <section className="space-y-4 pt-4">
            <h2 className="text-2xl font-bold text-[#134E4A]">4. Aftercare & Recovery Guidance</h2>
            <Card className="p-6 bg-white space-y-3">
              <div className="flex items-center gap-2 text-[#0D9488] font-semibold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Simple post-treatment guidelines</span>
              </div>
              <ul className="list-disc list-inside text-sm text-slate-600 space-y-2 leading-relaxed">
                <li>Avoid hot liquids or chewing on the treated side until local numbness wears off completely.</li>
                <li>Mild tenderness can be managed comfortably with standard over-the-counter medication recommended by your doctor.</li>
                <li>Continue gentle brushing and flossing around the surrounding teeth to keep the area clean.</li>
              </ul>
            </Card>
          </section>
        </div>
      </Container>
    </div>
  );
}
