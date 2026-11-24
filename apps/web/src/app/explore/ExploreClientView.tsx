// apps/web/src/app/explore/ExploreClientView.tsx
// DentalVis 2.0 — Explore Page Interactive Client View
// Architecture Baseline v1.9.1 — Phase B4.4: Explore Route Integration

'use client';

import React, { useMemo, useState } from 'react';
import { Container, Badge, LiquidGlassSurface } from '@dentalvis/ui';
import { DepartmentDto, ProcedureDetail } from '@dentalvis/common';
import { Sparkles, Stethoscope, Search, Info } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { DepartmentCard } from '@/components/DepartmentCard';
import { ProcedureCard } from '@/components/ProcedureCard';

export interface ExploreClientViewProps {
  departments: DepartmentDto[];
  procedures: ProcedureDetail[];
  departmentCounts: Record<string, number>;
}

export default function ExploreClientView({
  departments,
  procedures,
  departmentCounts,
}: ExploreClientViewProps) {
  const { language } = useLanguage();
  const isTamil = language === 'ta';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptCode, setSelectedDeptCode] = useState<string | 'ALL'>('ALL');

  // Filter procedures by search query and optional department filter
  const filteredProcedures = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return procedures.filter((proc) => {
      // 1. Department Filter
      if (selectedDeptCode !== 'ALL') {
        const matchesPrimary = proc.primaryDepartmentCode === selectedDeptCode;
        const matchesSecondary = proc.secondaryDepartmentCodes?.includes(selectedDeptCode);
        if (!matchesPrimary && !matchesSecondary) {
          return false;
        }
      }

      // 2. Search Query Filter
      if (!q) return true;

      const titleEn = proc.titleEn.toLowerCase();
      const titleTa = proc.titleTa.toLowerCase();
      const summaryEn = proc.summaryEn.toLowerCase();
      const summaryTa = proc.summaryTa.toLowerCase();
      const slug = proc.slug.toLowerCase();

      return (
        titleEn.includes(q) ||
        titleTa.includes(q) ||
        summaryEn.includes(q) ||
        summaryTa.includes(q) ||
        slug.includes(q)
      );
    });
  }, [procedures, searchQuery, selectedDeptCode]);

  return (
    <div className="py-10 space-y-16 relative overflow-hidden">
      {/* Soft Ambient Background Fields for Glass Depth in Mint, Powder Blue and Aqua */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-[#BFE9E2]/60 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 -right-20 w-[32rem] h-[32rem] bg-[#20B2AA]/25 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-1/4 w-[36rem] h-[36rem] bg-[#DCEFF5]/85 rounded-full blur-3xl pointer-events-none -z-10" />

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
              {departments.length} {isTamil ? 'துறைகள்' : 'Specialties'}
            </Badge>
          </LiquidGlassSurface>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept) => (
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
            className="p-6 space-y-4"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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

              {/* Search Input Control */}
              <div className="relative z-10 w-full md:w-72">
                <div className="relative">
                  <Search className="w-4 h-4 text-[#587477] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isTamil ? 'சிகிச்சையைத் தேடுக...' : 'Search clinical treatments...'}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm bg-white/80 border border-[#20B2AA]/30 text-[#145B59] placeholder-[#587477]/60 focus:outline-none focus:ring-2 focus:ring-[#20B2AA] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Department Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 scrollbar-none relative z-10">
              <button
                type="button"
                onClick={() => setSelectedDeptCode('ALL')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#20B2AA] ${
                  selectedDeptCode === 'ALL'
                    ? 'bg-[#145B59] text-white shadow-xs'
                    : 'bg-white/70 text-[#145B59] hover:bg-[#DDF5F1] border border-[#20B2AA]/20'
                }`}
              >
                {isTamil ? 'அனைத்தும்' : 'All Departments'} ({procedures.length})
              </button>
              {departments
                .filter((d) => (departmentCounts[d.code] || 0) > 0)
                .map((dept) => (
                  <button
                    key={dept.code}
                    type="button"
                    onClick={() => setSelectedDeptCode(dept.code)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#20B2AA] ${
                      selectedDeptCode === dept.code
                        ? 'bg-[#20B2AA] text-white shadow-xs'
                        : 'bg-white/70 text-[#145B59] hover:bg-[#DDF5F1] border border-[#20B2AA]/20'
                    }`}
                  >
                    {isTamil ? dept.nameTa : dept.nameEn} ({departmentCounts[dept.code] || 0})
                  </button>
                ))}
            </div>
          </LiquidGlassSurface>

          {/* Procedure Directory Content or Deliberate Empty State */}
          {filteredProcedures.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProcedures.map((proc) => (
                <ProcedureCard key={proc.slug} procedure={proc} lang={language} />
              ))}
            </div>
          ) : (
            <LiquidGlassSurface
              variant="primary"
              specular={false}
              refractiveRim
              className="p-12 text-center space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-[#20B2AA]/10 text-[#20B2AA] flex items-center justify-center mx-auto">
                <Info className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#145B59]">
                {isTamil ? 'வெளியிடப்பட்ட சிகிச்சை வழிகாட்டிகள் இல்லை' : 'No Published Clinical Guides Available'}
              </h3>
              <p className="text-sm text-[#587477] max-w-lg mx-auto">
                {searchQuery
                  ? isTamil
                    ? `"${searchQuery}" என்ற தேடலுக்கு பொருத்தமான சிகிச்சைகள் எதுவும் கிடைக்கவில்லை.`
                    : `No published treatments matched your search for "${searchQuery}".`
                  : isTamil
                  ? 'மருத்துவ உள்ளடக்கங்கள் தற்போது மதிப்பாய்வில் உள்ளன. அங்கீகரிக்கப்பட்ட சிகிச்சை வழிகாட்டிகள் விரைவில் இங்கு தோன்றும்.'
                  : 'Clinical content is currently undergoing governance review. Published visual educational guides will appear here once approved.'}
              </p>
            </LiquidGlassSurface>
          )}
        </div>
      </Container>
    </div>
  );
}
