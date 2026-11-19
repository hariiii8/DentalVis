'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container, Button, Card, Badge } from '@dentalvis/ui';
import { CANONICAL_EXPLORE_CATEGORIES, CANONICAL_PROCEDURES } from '@dentalvis/common';
import { Sparkles, ArrowRight, Compass, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { ProcedureCard } from '@/components/ProcedureCard';
import { CategoryCard } from '@/components/CategoryCard';

export default function WelcomePage() {
  const { language } = useLanguage();
  const isTamil = language === 'ta';

  // Select 2 top featured procedures for the welcome showcase
  const featuredProcedures = CANONICAL_PROCEDURES.slice(0, 2);

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
                <span>
                  {isTamil
                    ? 'இருமொழி பல் மருத்துவக் கல்வி (English & தமிழ்)'
                    : 'Bilingual Dental Education (English & தமிழ்)'}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#134E4A] tracking-tight leading-[1.15]">
                {isTamil ? (
                  <>
                    பல் மருத்துவ சிகிச்சைகளை <span className="text-[#0D9488]">தெளிவாக</span> உணருங்கள்.
                  </>
                ) : (
                  <>
                    Understand your dental care with <span className="text-[#0D9488]">calm confidence</span>.
                  </>
                )}
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
                {isTamil
                  ? 'பல் சிகிச்சைகள், வாய் உடற்கூறியல் மற்றும் சிகிச்சை முறைகளை எளிய காட்சி வழிகாட்டிகள் மூலம் அறிந்துகொள்ளுங்கள். மருத்துவக் குழப்பங்கள் இல்லை, பயம் இல்லை — நேரடியான தெளிவு மட்டுமே.'
                  : 'Demystifying dental procedures, oral anatomy, and treatments through crystal-clear visual guides. No medical jargon, no anxiety — just straightforward clarity.'}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link href="/explore">
                  <Button size="lg" className="bg-[#0D9488] hover:bg-[#0f766e] text-white shadow-md shadow-teal-700/15 gap-2">
                    <span>{isTamil ? 'பல் சிகிச்சைகளை காண்க' : 'Explore Dental Procedures'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>

                <Link href="/symptoms">
                  <Button variant="outline" size="lg" className="gap-2 border-teal-200 text-[#134E4A] hover:bg-teal-50">
                    <Compass className="w-4 h-4 text-[#0D9488]" />
                    <span>{isTamil ? 'பல் ஆரோக்கியத்தை அறிக' : 'Learn About Dental Health'}</span>
                  </Button>
                </Link>
              </div>

              {/* Patient Trust Indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-teal-100/80">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-[#0D9488] shrink-0" />
                  <span>{isTamil ? 'தெளிவான காட்சி வழிகாட்டிகள்' : 'Clear Visual Guides'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-[#0D9488] shrink-0" />
                  <span>{isTamil ? 'ஊடாடும் 3D உடற்கூறியல்' : 'Interactive 3D Anatomy'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-[#0D9488] shrink-0" />
                  <span>{isTamil ? '100% இலவச பொது அணுகல்' : '100% Free & Open Access'}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Showcase */}
            <div className="lg:col-span-5">
              <Card className="p-2 border-teal-100 bg-white/95 shadow-xl relative overflow-hidden group">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-50 border border-teal-50">
                  <Image
                    src="/images/procedures/root-canal-treatment.svg"
                    alt={isTamil ? 'வேர் கால்வாய் சிகிச்சை மாதிரி' : 'Root canal treatment illustration'}
                    fill
                    priority
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#134E4A]/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                    <Badge variant="mint" className="self-start mb-2 text-xs font-semibold">
                      {isTamil ? 'சிறப்பு வழிகாட்டி' : 'Featured Visual Guide'}
                    </Badge>
                    <h3 className="text-xl font-bold">
                      {isTamil ? 'வேர் கால்வாய் சிகிச்சை (Root Canal)' : 'Root Canal Treatment (RCT)'}
                    </h3>
                    <p className="text-xs text-teal-100 mt-1 max-w-sm line-clamp-2">
                      {isTamil
                        ? 'பல்லின் உட்புற நரம்பு மற்றும் தொற்றை நீக்கி இயற்கை பல்லை பாதுகாக்கும் சிகிச்சை.'
                        : 'Gentle step-by-step restoration of inflamed pulp chambers and inner root anatomy.'}
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                      <Link href="/procedures/root-canal-treatment">
                        <Button size="sm" className="bg-white text-[#134E4A] hover:bg-teal-50 font-bold text-xs gap-1.5 shadow-sm">
                          <span>{isTamil ? 'முழு விளக்கத்தை காண்க' : 'Inspect Guide'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. EXPLORE BY CATEGORY PREVIEW */}
      <section className="py-6">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0D9488] mb-2">
                <Compass className="w-3.5 h-3.5" />
                <span>{isTamil ? 'பிரிவு வாரியாக அறிக' : 'Explore by Topic'}</span>
              </div>
              <h2 className="text-3xl font-extrabold text-[#134E4A] tracking-tight">
                {isTamil ? 'அனைத்து முக்கிய பல் சிகிச்சைப் பிரிவுகள்' : 'Patient-Facing Treatment Categories'}
              </h2>
              <p className="text-base text-slate-600 mt-2 max-w-2xl">
                {isTamil
                  ? 'உங்கள் குறிப்பிட்ட பல் தேவைகளுக்கான சரியான காட்சி விளக்கங்களைத் தேர்ந்தெடுங்கள்.'
                  : 'Navigate through structured guides addressing sudden discomfort, missing teeth, tooth alignment, and cosmetic dental care.'}
              </p>
            </div>

            <Link href="/explore">
              <Button variant="outline" className="gap-2 border-teal-200 text-[#134E4A] hover:bg-teal-50 font-semibold">
                <span>{isTamil ? 'அனைத்து 6 பிரிவுகளையும் காண்க' : 'View All 6 Categories'}</span>
                <ArrowRight className="w-4 h-4 text-[#0D9488]" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CANONICAL_EXPLORE_CATEGORIES.map((category) => (
              <CategoryCard key={category.id} category={category} lang={language} />
            ))}
          </div>
        </Container>
      </section>

      {/* 3. FEATURED PROCEDURES SHOWCASE */}
      <section className="py-6 bg-gradient-to-b from-[#F8FBFA] via-white to-[#F8FBFA] py-16 border-y border-teal-900/5">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <Badge variant="mint" className="text-xs font-semibold">
              {isTamil ? 'முக்கிய வழிகாட்டிகள்' : 'Clinical Depth'}
            </Badge>
            <h2 className="text-3xl font-extrabold text-[#134E4A] tracking-tight">
              {isTamil ? 'பிரபலமான சிகிச்சைக் காட்சி வழிகாட்டிகள்' : 'Featured Procedure Guides'}
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              {isTamil
                ? 'அதிகம் கேட்கப்படும் பொதுவான பல் சிகிச்சைகள் பற்றிய துல்லியமான காட்சிப் பதிவுகள்.'
                : 'Every guide includes duration estimates, comfort descriptions, clear visual stages, and post-treatment home care.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {featuredProcedures.map((proc) => (
              <ProcedureCard key={proc.id} procedure={proc} lang={language} />
            ))}
          </div>
        </Container>
      </section>

      {/* 4. EDUCATIONAL BENEFITS SECTION */}
      <section className="py-6">
        <Container>
          <div className="rounded-3xl bg-gradient-to-br from-[#134E4A] to-[#0D9488] text-white p-8 sm:p-12 shadow-xl relative overflow-hidden">
            {/* Ambient Background Circles */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-3xl space-y-6 relative z-10">
              <Badge variant="outline" className="text-white border-white/20 bg-white/10 text-xs font-bold uppercase tracking-wider">
                {isTamil ? 'எங்கள் உறுதிப்பாடு' : 'Why DentalVis Exists'}
              </Badge>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-snug">
                {isTamil
                  ? 'பல் மருத்துவ நாற்காலியில் அமர்வதற்கு முன், சிகிச்சையைப் பற்றிய முழு தெளிவு பெறுங்கள்.'
                  : 'Confidence begins before you ever sit in the dental chair.'}
              </h2>

              <p className="text-teal-50 text-base leading-relaxed">
                {isTamil
                  ? 'பல் மருத்துவ சிகிச்சைகள் பற்றிய தெரியாமை மற்றும் பயத்தை அகற்றுவதே எங்கள் நோக்கம். நோயாளிக்கும் மருத்துவருக்கும் இடையேயான கலந்துரையாடலை வெளிப்படையாகவும் சுலபமாகவும் மாற்றுவதற்காக இந்த வழிகாட்டிகள் வடிவமைக்கப்பட்டுள்ளன.'
                  : 'Dental anxiety often comes from the unknown. When you can see the cross-section of a tooth, understand why an instrument is used, and know what sensation to expect, treatment feels manageable, transparent, and calm.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-teal-500/30">
                <div className="space-y-1">
                  <h4 className="font-bold text-lg text-white">0% Jargon</h4>
                  <p className="text-xs text-teal-100">
                    {isTamil ? 'எளிய மனித மொழியில் விளக்கம்' : 'Explained in plain, everyday language'}
                  </p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-lg text-white">100% Visual</h4>
                  <p className="text-xs text-teal-100">
                    {isTamil ? 'வரைபடங்கள் மற்றும் வீடியோ காட்சி' : 'Rich medical diagrams and step illustrations'}
                  </p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-lg text-white">Bilingual First</h4>
                  <p className="text-xs text-teal-100">
                    {isTamil ? 'ஆங்கிலம் மற்றும் தமிழில் முழு ஆதரவு' : 'True parallel English and Tamil content'}
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <Link href="/explore">
                  <Button size="lg" className="bg-white text-[#134E4A] hover:bg-teal-50 font-bold shadow-lg">
                    {isTamil ? 'இப்போதே சிகிச்சைகளை அறியுங்கள்' : 'Start Exploring Guides Now'}
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
