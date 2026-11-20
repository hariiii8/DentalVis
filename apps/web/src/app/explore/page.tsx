'use client';

import React, { useMemo } from 'react';
import { Container, Badge, LiquidGlassSurface } from '@dentalvis/ui';
import { CANONICAL_DEPARTMENTS, getVisibleProcedures, getVisibleProceduresByDepartment } from '@dentalvis/common';
import { Sparkles, Stethoscope } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { DepartmentCard } from '@/components/DepartmentCard';
import { ProcedureCard } from '@/components/ProcedureCard';

export default function ExplorePage() {
  const { language } = useLanguage();
  const isTamil = language === 'ta';

  // Strict publication gating: only published procedures in production
  const visibleProcedures = useMemo(() => getVisibleProcedures(), []);

  // Compute published procedure counts per department
  const departmentCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const dept of CANONICAL_DEPARTMENTS) {
      counts[dept.code] = getVisibleProceduresByDepartment(dept.code).length;
    }
    return counts;
  }, []);

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
              <Stethoscope className="w-3.5 h-3.5 text-[#20B2AA]" />
              <span>{isTamil ? 'மருத்துவத் துறைசார் வழிகாட்டி' : 'Clinical Specialties & Departments'}</span>
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-black text-[#145B59] tracking-tight">
              {isTamil ? 'பல் மருத்துவ சிகிச்சை துறைகள்' : 'Explore Dental Departments'}
            </h1>
            <p className="text-base sm:text-lg text-[#587477] leading-relaxed max-w-3xl">
              {isTamil
                ? 'பல் மருத்துவத்தின் 15 அங்கீகரிக்கப்பட்ட சிறப்பு சிகிச்சை துறைகள் மூலம் உங்கள் தேவைகளுக்கான சிகிச்சைகளை அறிந்து கொள்ளுங்கள். ஒவ்வொரு துறையிலும் உள்ள நவீன முறைகள், வரைபடங்கள் மற்றும் வழிகாட்டிகள் விரிவாக வழங்கப்பட்டுள்ளன.'
                : 'Browse through our 15 canonical clinical dental specialties and hospital departments to discover modern, comfortable dental treatments. Each department provides clear, certified visual educational guides.'}
            </p>
          </div>
        </LiquidGlassSurface>

        {/* 15 Clinical Dental Departments Grid */}
        <div className="space-y-6 mb-20">
          <LiquidGlassSurface
            variant="secondary"
            specular={false}
            refractiveRim
            className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
          >
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-[#145B59]">
                {isTamil ? 'மருத்துவ சிகிச்சை துறைகள் (15 சிறப்பு பிரிவுகள்)' : 'Clinical Specialties (15 Departments)'}
              </h2>
              <p className="text-xs text-[#587477] mt-1">
                {isTamil
                  ? 'வேர் கால்வாய், ஈறு சிகிச்சை, பல் சீரமைப்பு, இம்ப்ளான்ட் மற்றும் அறுவை சிகிச்சை துறைகள்.'
                  : 'Organized by formal dental specialty: Endodontics, Periodontics, Implantology, Orthodontics, and Surgery.'}
              </p>
            </div>
            <Badge variant="mint" className="text-xs font-bold liquid-glass-lens relative z-10 self-start sm:self-auto">
              15 {isTamil ? 'துறைகள்' : 'Specialties'}
            </Badge>
          </LiquidGlassSurface>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CANONICAL_DEPARTMENTS.map((dept) => (
              <DepartmentCard
                key={dept.id}
                department={dept}
                procedureCount={departmentCounts[dept.code] || 0}
                lang={language}
              />
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
                <span>{isTamil ? 'அனைத்து நடைமுறைகள்' : 'All Published Clinical Guides'}</span>
              </div>
              <h2 className="text-2xl font-bold text-[#145B59]">
                {isTamil ? 'சிகிச்சை வழிகாட்டி அட்டவணை' : 'Complete Treatment Directory'}
              </h2>
              <p className="text-xs text-[#587477] mt-1">
                {isTamil
                  ? 'அனைத்து துறைசார்ந்த சிகிச்சை விவரங்கள், கால அளவு மற்றும் செயல்முறை விளக்கங்கள்.'
                  : 'Browse our full library of interactive educational guides detailing dental restorations, periodontics, and surgery.'}
              </p>
            </div>
          </LiquidGlassSurface>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleProcedures.map((proc) => (
              <ProcedureCard key={proc.slug} procedure={proc} lang={language} />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
