import React from 'react';
import Link from 'next/link';
import { Container, Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from '@dentalvis/ui';
import { CANONICAL_EXPLORE_CATEGORIES, CANONICAL_PROCEDURES } from '@dentalvis/common';
import { Sparkles, ArrowRight, ShieldCheck, Box, Compass, Clock, CheckCircle2 } from 'lucide-react';

export default function WelcomePage() {
  return (
    <div className="space-y-24 py-8">
      {/* 1. HERO SECTION (Welcoming Liquid Glass Healthcare Style) */}
      <section className="relative overflow-hidden pt-8 pb-16">
        {/* Soft Radial Ambient Lighting */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-teal-100/40 via-mint-50/20 to-transparent -z-10 blur-3xl pointer-events-none" />

        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Reassurance & Introduction */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200/60 text-[#0D9488] text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Bilingual Dental Education (English & தமிழ்)</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#134E4A] tracking-tight leading-[1.15]">
                Understand your dental care with <span className="text-[#0D9488]">calm confidence</span>.
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
                Demystifying dental procedures, oral anatomy, and treatments through crystal-clear visual guides. No medical jargon, no anxiety — just straightforward clarity.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link href="/explore">
                  <Button size="lg" className="bg-[#0D9488] hover:bg-[#0f766e] text-white shadow-md shadow-teal-700/15 gap-2">
                    <span>Explore Dental Treatments</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>

                <Link href="/symptoms">
                  <Button variant="outline" size="lg" className="gap-2 border-teal-200 text-[#134E4A] hover:bg-teal-50">
                    <Compass className="w-4 h-4 text-[#0D9488]" />
                    <span>Browse by Symptom</span>
                  </Button>
                </Link>
              </div>

              {/* Patient Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-teal-100/80">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-[#0D9488] shrink-0" />
                  <span>Doctor-Reviewed Guides</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-[#0D9488] shrink-0" />
                  <span>Interactive 3D Anatomy</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-[#0D9488] shrink-0" />
                  <span>100% Free & Open Access</span>
                </div>
              </div>
            </div>

            {/* Right Column: 3D Education Preview Placeholder Card */}
            <div className="lg:col-span-5">
              <Card className="p-2 border-teal-100 bg-white/90 shadow-xl relative overflow-hidden group">
                <div className="relative aspect-[4/3] rounded-xl bg-gradient-to-br from-teal-50 via-slate-50 to-[#E6F7F2] flex flex-col items-center justify-center p-8 text-center border border-teal-50">
                  <div className="w-16 h-16 rounded-2xl bg-white/90 shadow-sm border border-teal-100 flex items-center justify-center text-[#0D9488] mb-4 group-hover:scale-105 transition-transform duration-300">
                    <Box className="w-8 h-8 animate-pulse text-[#0D9488]" />
                  </div>
                  
                  <Badge variant="mint" className="mb-2">Interactive 3D Module</Badge>
                  <h3 className="text-lg font-bold text-[#134E4A]">Molar Tooth Cross-Section</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs">
                    Inspect enamel, dentin, and inner pulp chambers interactively to see how treatments work.
                  </p>

                  <div className="mt-6 flex items-center gap-3">
                    <Link href="/procedures/root-canal-treatment">
                      <Button size="sm" variant="outline" className="text-xs bg-white text-[#134E4A] hover:bg-teal-50">
                        Preview 3D Anatomy
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="p-4 bg-teal-50/50 rounded-b-xl flex items-center justify-between text-xs text-teal-800">
                  <span className="font-medium">Phase 4 3D Experience Ready</span>
                  <span className="font-semibold text-[#0D9488]">R3F / WebGL Canvas</span>
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. EXPLORE CATEGORIES PREVIEW SECTION */}
      <section>
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <Badge variant="default" className="mb-2">Patient-Facing Exploration</Badge>
              <h2 className="text-3xl font-bold text-[#134E4A] tracking-tight">How can we help you understand today?</h2>
              <p className="text-sm text-slate-600 mt-1">Browse educational guides organized by what you or a family member might be experiencing.</p>
            </div>

            <Link href="/explore">
              <Button variant="ghost" className="gap-2 text-[#0D9488] font-semibold">
                <span>View all categories</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CANONICAL_EXPLORE_CATEGORIES.map((category) => (
              <Link key={category.id} href={`/explore/${category.slug}`} className="group block">
                <Card className="h-full hover:translate-y-[-2px] transition-all">
                  <CardHeader>
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0D9488] flex items-center justify-center mb-3 group-hover:bg-[#0D9488] group-hover:text-white transition-colors">
                      <Compass className="w-5 h-5" />
                    </div>
                    <CardTitle className="group-hover:text-[#0D9488] transition-colors">{category.titleEn}</CardTitle>
                    <p className="text-xs font-semibold text-[#0D9488]/80">{category.titleTa}</p>
                    <CardDescription>{category.descriptionEn}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs font-medium text-[#0D9488] flex items-center gap-1 group-hover:underline">
                      <span>Explore treatments</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* 3. FEATURED EDUCATIONAL PROCEDURES SECTION */}
      <section className="bg-teal-50/40 py-16 border-y border-teal-900/5">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="mint" className="mb-2">Clinical Guides</Badge>
            <h2 className="text-3xl font-bold text-[#134E4A] tracking-tight">Common Dental Treatments Explained</h2>
            <p className="text-sm text-slate-600 mt-2">
              Visual, multi-step breakdowns designed to relieve apprehension before your dental appointment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CANONICAL_PROCEDURES.map((proc) => (
              <Card key={proc.id} className="flex flex-col justify-between">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-[10px] uppercase font-bold text-slate-500">
                      {proc.primaryDepartmentName}
                    </Badge>
                    {proc.has3DModel && (
                      <Badge variant="default" className="text-[10px] gap-1">
                        <Box className="w-3 h-3" />
                        <span>3D View</span>
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg">{proc.titleEn}</CardTitle>
                  <p className="text-xs font-medium text-teal-700/80">{proc.titleTa}</p>
                  <CardDescription className="line-clamp-3">{proc.summaryEn}</CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 pt-4 border-t border-slate-100">
                    <Clock className="w-3.5 h-3.5 text-[#0D9488]" />
                    <span>~{proc.durationMinutes} minutes duration</span>
                  </div>

                  <Link href={`/procedures/${proc.slug}`} className="block w-full">
                    <Button variant="mint" size="sm" className="w-full text-xs font-semibold justify-between">
                      <span>Read Treatment Guide</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. CLINICAL SAFETY & REASSURANCE BANNER */}
      <section>
        <Container>
          <div className="rounded-3xl bg-gradient-to-r from-[#134E4A] to-[#0D9488] p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-teal-200 text-xs font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>Doctor-Reviewed Standards</span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight">Built to replace uncertainty with knowledge</h2>
              <p className="text-sm text-teal-100 leading-relaxed">
                Dental treatments are routine, gentle, and highly effective when understood. DentalVis provides open educational access to help you feel completely comfortable chairside.
              </p>
              <div className="pt-2">
                <Link href="/explore">
                  <Button className="bg-white text-[#134E4A] hover:bg-teal-50 font-semibold shadow-md">
                    Start Exploring Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
