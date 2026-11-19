'use client';

import React from 'react';
import { Container, Badge, LiquidGlassSurface } from '@dentalvis/ui';
import { CANONICAL_EXPLORE_CATEGORIES, CANONICAL_PROCEDURES } from '@dentalvis/common';
import { Compass, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { CategoryCard } from '@/components/CategoryCard';
import { ProcedureCard } from '@/components/ProcedureCard';

export default function ExplorePage() {
  const { language } = useLanguage();
  const isTamil = language === 'ta';

  return (
    <div className="py-10 space-y-16 relative overflow-hidden bg-[#F5FAF9]">
      {/* Soft Ambient Background Fields for Glass Depth in Mint, Powder Blue and Aqua */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-[#BFE9E2]/50 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 -right-20 w-[32rem] h-[32rem] bg-[#20B2AA]/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-1/4 w-[36rem] h-[36rem] bg-[#DCEFF5]/80 rounded-full blur-3xl pointer-events-none -z-10" />

      <Container>
        {/* Page Header: Liquid Glass Hero Introduction Panel */}
        <LiquidGlassSurface
          variant="primary"
          specular
          refractiveRim
          className="p-8 sm:p-10 mb-12 space-y-4 shadow-md"
        >
          <div className="relative z-10 space-y-3">
            <Badge variant="mint" className="gap-1.5 text-xs font-semibold liquid-glass-lens">
              <Compass className="w-3.5 h-3.5 text-[#20B2AA]" />
              <span>{isTamil ? 'பொது நோயாளி வழிகாட்டி' : 'Patient-Facing Exploration'}</span>
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-black text-[#145B59] tracking-tight">
              {isTamil ? 'பல் மருத்துவ சிகிச்சை வழிகாட்டிகள்' : 'Explore Dental Treatments'}
            </h1>
            <p className="text-base sm:text-lg text-[#587477] leading-relaxed max-w-3xl">
              {isTamil
                ? 'உங்கள் பல் பிரச்சினைகளுக்கு நவீன மருத்துவத்தில் உள்ள எளிய, பாதுகாப்பான மற்றும் வலி குறைவான சிகிச்சைகளை இங்கு கண்டுணருங்கள். ஒவ்வொரு பிரிவும் வரைபடங்களுடன் தெளிவாக விளக்கப்பட்டுள்ளது.'
                : 'Select a clinical topic below to discover how specific dental concerns are addressed through modern, comfortable treatment procedures. Each section provides clear, patient-tested visual explanations.'}
            </p>
          </div>
        </LiquidGlassSurface>

        {/* 6 Patient-Facing Categories Grid */}
        <div className="space-y-6 mb-20">
          <LiquidGlassSurface
            variant="secondary"
            specular={false}
            refractiveRim
            className="px-6 py-4 flex items-center justify-between"
          >
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-[#145B59]">
                {isTamil ? 'சிகிச்சைப் பிரிவுகள் (6 Categories)' : 'Explore Categories (6 Topics)'}
              </h2>
              <p className="text-xs text-[#587477] mt-1">
                {isTamil
                  ? 'வலி, உடைந்த பற்கள், ஈறுகள் மற்றும் அழகு சிகிச்சைகளுக்கான பிரிவுகள்.'
                  : 'Structured patient topics designed around symptoms, conditions, and treatment goals.'}
              </p>
            </div>
          </LiquidGlassSurface>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CANONICAL_EXPLORE_CATEGORIES.map((category) => (
              <CategoryCard key={category.id} category={category} lang={language} />
            ))}
          </div>
        </div>

        {/* Complete Available Procedures Directory */}
        <div className="pt-8 space-y-8">
          <LiquidGlassSurface
            variant="secondary"
            specular={false}
            refractiveRim
            className="px-6 py-4"
          >
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#20B2AA] mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isTamil ? 'அனைத்து நடைமுறைகள்' : 'All Clinical Guides'}</span>
              </div>
              <h2 className="text-2xl font-bold text-[#145B59]">
                {isTamil ? 'சிகிச்சை வழிகாட்டி அட்டவணை' : 'Complete Treatment Directory'}
              </h2>
              <p className="text-xs text-[#587477] mt-1">
                {isTamil
                  ? 'அனைத்து துறைசார்ந்த சிகிச்சை விவரங்கள், கால அளவு மற்றும் வீட்டு பராமரிப்பு குறிப்புகள்.'
                  : 'Browse our full library of interactive educational guides detailing dental restorations, periodontics, and surgery.'}
              </p>
            </div>
          </LiquidGlassSurface>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CANONICAL_PROCEDURES.map((proc) => (
              <ProcedureCard key={proc.slug} procedure={proc} lang={language} />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
