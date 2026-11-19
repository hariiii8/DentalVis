'use client';

import React from 'react';
import { Container, Badge } from '@dentalvis/ui';
import { CANONICAL_EXPLORE_CATEGORIES, CANONICAL_PROCEDURES } from '@dentalvis/common';
import { Compass, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { CategoryCard } from '@/components/CategoryCard';
import { ProcedureCard } from '@/components/ProcedureCard';

export default function ExplorePage() {
  const { language } = useLanguage();
  const isTamil = language === 'ta';

  return (
    <div className="py-10 space-y-16">
      <Container>
        {/* Page Header */}
        <div className="max-w-3xl space-y-4 mb-12">
          <Badge variant="mint" className="gap-1.5 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5 text-[#0D9488]" />
            <span>{isTamil ? 'பொது நோயாளி வழிகாட்டி' : 'Patient-Facing Exploration'}</span>
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#134E4A] tracking-tight">
            {isTamil ? 'பல் மருத்துவ சிகிச்சை வழிகாட்டிகள்' : 'Explore Dental Treatments'}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            {isTamil
              ? 'உங்கள் பல் பிரச்சினைகளுக்கு நவீன மருத்துவத்தில் உள்ள எளிய, பாதுகாப்பான மற்றும் வலி குறைவான சிகிச்சைகளை இங்கு கண்டுணருங்கள். ஒவ்வொரு பிரிவும் வரைபடங்களுடன் தெளிவாக விளக்கப்பட்டுள்ளது.'
              : 'Select a clinical topic below to discover how specific dental concerns are addressed through modern, comfortable treatment procedures. Each section provides clear, patient-tested visual explanations.'}
          </p>
        </div>

        {/* 6 Patient-Facing Categories Grid */}
        <div className="space-y-6 mb-20">
          <div className="flex items-center justify-between border-b border-teal-100 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-[#134E4A]">
                {isTamil ? 'சிகிச்சைப் பிரிவுகள் (6 Categories)' : 'Explore Categories (6 Topics)'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {isTamil
                  ? 'வலி, உடைந்த பற்கள், ஈறுகள் மற்றும் அழகு சிகிச்சைகளுக்கான பிரிவுகள்.'
                  : 'Structured patient topics designed around symptoms, conditions, and treatment goals.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CANONICAL_EXPLORE_CATEGORIES.map((category) => (
              <CategoryCard key={category.id} category={category} lang={language} />
            ))}
          </div>
        </div>

        {/* Complete Available Procedures Directory */}
        <div className="pt-8 border-t border-teal-100/80 space-y-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0D9488] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isTamil ? 'அனைத்து நடைமுறைகள்' : 'Validated Directory'}</span>
            </div>
            <h2 className="text-3xl font-extrabold text-[#134E4A] tracking-tight">
              {isTamil ? 'முழுமையான சிகிச்சை வழிகாட்டி அட்டவணை' : 'Complete Treatment Directory'}
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              {isTamil
                ? 'அனைத்து மருத்துவத் துறைகளின் கீழ் அங்கீகரிக்கப்பட்ட நடைமுறை வழிகாட்டிகள்.'
                : 'Browse verified educational visual guides across Endodontics, Prosthodontics, Periodontics, and Oral Surgery.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CANONICAL_PROCEDURES.map((proc) => (
              <ProcedureCard key={proc.id} procedure={proc} lang={language} />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
