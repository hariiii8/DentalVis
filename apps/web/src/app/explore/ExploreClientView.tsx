// apps/web/src/app/explore/ExploreClientView.tsx
// DentalVis 2.0 — Explore Page Interactive Client View with Bilingual Search & Discovery
// Architecture Baseline v1.9.1 — Milestone M6.5: Search & Discovery Completion

'use client';

import React, { useMemo, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Container, Badge, LiquidGlassSurface, Button } from '@dentalvis/ui';
import { DepartmentDto, ProcedureDetail } from '@dentalvis/common';
import {
  Sparkles,
  Stethoscope,
  Search,
  Info,
  X,
  ArrowUpDown,
  FilterX,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { DepartmentCard } from '@/components/DepartmentCard';
import { ProcedureCard } from '@/components/ProcedureCard';

export interface ExploreClientViewProps {
  departments: DepartmentDto[];
  procedures: ProcedureDetail[];
  departmentCounts: Record<string, number>;
}

export type SortOrder = 'canonical' | 'alpha-asc' | 'alpha-desc';

export default function ExploreClientView({
  departments,
  procedures,
  departmentCounts,
}: ExploreClientViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const isTamil = language === 'ta';

  // Read initial state from URL query parameters (or fall back to defaults)
  const initialQuery = searchParams?.get('q') || '';
  const initialDept = searchParams?.get('dept') || 'ALL';
  const initialSort = (searchParams?.get('sort') as SortOrder) || 'canonical';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedDeptCode, setSelectedDeptCode] = useState<string | 'ALL'>(initialDept);
  const [sortOrder, setSortOrder] = useState<SortOrder>(initialSort);

  // Sync state changes with URL query parameters for back/forward navigation and shareable links
  const updateUrl = useCallback(
    (q: string, dept: string, sort: SortOrder) => {
      const params = new URLSearchParams();
      if (q.trim()) params.set('q', q.trim());
      if (dept !== 'ALL') params.set('dept', dept);
      if (sort !== 'canonical') params.set('sort', sort);

      const qs = params.toString();
      const newPath = qs ? `/explore?${qs}` : '/explore';
      router.replace(newPath, { scroll: false });
    },
    [router]
  );

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    updateUrl(val, selectedDeptCode, sortOrder);
  };

  const handleDeptChange = (code: string | 'ALL') => {
    setSelectedDeptCode(code);
    updateUrl(searchQuery, code, sortOrder);
  };

  const handleSortChange = (newSort: SortOrder) => {
    setSortOrder(newSort);
    updateUrl(searchQuery, selectedDeptCode, newSort);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedDeptCode('ALL');
    setSortOrder('canonical');
    updateUrl('', 'ALL', 'canonical');
  };

  // Filter and sort procedures deterministically
  const filteredAndSortedProcedures = useMemo(() => {
    const rawQuery = searchQuery.trim().toLowerCase();
    const normalizedQuery = rawQuery.replace(/\s+/g, ' ');

    // 1. Filter
    const matched = procedures.filter((proc) => {
      // Specialty Filter
      if (selectedDeptCode !== 'ALL') {
        const matchesPrimary = proc.primaryDepartmentCode === selectedDeptCode;
        const matchesSecondary = proc.secondaryDepartmentCodes?.includes(selectedDeptCode);
        if (!matchesPrimary && !matchesSecondary) {
          return false;
        }
      }

      // Query Filter
      if (!normalizedQuery) return true;

      const titleEn = (proc.titleEn || '').toLowerCase();
      const titleTa = (proc.titleTa || '').toLowerCase();
      const summaryEn = (proc.summaryEn || '').toLowerCase();
      const summaryTa = (proc.summaryTa || '').toLowerCase();
      const deptNameEn = (proc.primaryDepartmentName || '').toLowerCase();
      const primaryCode = (proc.primaryDepartmentCode || '').toLowerCase();
      const secondaryCodes = (proc.secondaryDepartmentCodes || []).map((c) => c.toLowerCase());
      const slug = (proc.slug || '').toLowerCase();
      const code = (proc.code || '').toLowerCase();
      const exploreCategories = (proc.exploreCategorySlugs || []).map((c) => c.toLowerCase());

      return (
        titleEn.includes(normalizedQuery) ||
        titleTa.includes(normalizedQuery) ||
        summaryEn.includes(normalizedQuery) ||
        summaryTa.includes(normalizedQuery) ||
        deptNameEn.includes(normalizedQuery) ||
        primaryCode.includes(normalizedQuery) ||
        secondaryCodes.some((sc) => sc.includes(normalizedQuery)) ||
        slug.includes(normalizedQuery) ||
        code.includes(normalizedQuery) ||
        exploreCategories.some((cat) => cat.includes(normalizedQuery))
      );
    });

    // 2. Deterministic Sorting
    if (sortOrder === 'alpha-asc') {
      return [...matched].sort((a, b) => {
        const nameA = isTamil ? a.titleTa : a.titleEn;
        const nameB = isTamil ? b.titleTa : b.titleEn;
        return nameA.localeCompare(nameB, isTamil ? 'ta' : 'en');
      });
    }

    if (sortOrder === 'alpha-desc') {
      return [...matched].sort((a, b) => {
        const nameA = isTamil ? a.titleTa : a.titleEn;
        const nameB = isTamil ? b.titleTa : b.titleEn;
        return nameB.localeCompare(nameA, isTamil ? 'ta' : 'en');
      });
    }

    // Default: 'canonical' ordering as returned by repository
    return matched;
  }, [procedures, searchQuery, selectedDeptCode, sortOrder, isTamil]);

  const hasActiveFilters = searchQuery.trim().length > 0 || selectedDeptCode !== 'ALL' || sortOrder !== 'canonical';

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
        <div className="pt-8 space-y-8" id="directory">
          <LiquidGlassSurface
            variant="secondary"
            specular={false}
            refractiveRim
            className="p-6 space-y-5"
          >
            {/* Header, Search Input and Sorting Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
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
                    ? 'துறைசார்ந்த சிகிச்சை விவரங்கள், கால அளவு மற்றும் செயல்முறை விளக்கங்கள்.'
                    : 'Search and filter across our full directory of certified visual educational dental guides.'}
                </p>
              </div>

              {/* Search Field & Sort Dropdown */}
              <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                {/* Search Bar */}
                <div className="relative flex-1 sm:w-80">
                  <Search className="w-4 h-4 text-[#587477] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder={
                      isTamil
                        ? 'சிகிச்சை, துறை அல்லது முக்கிய சொல் தேடுக...'
                        : 'Search procedures, specialties, or keywords...'
                    }
                    className="w-full pl-9 pr-9 py-2.5 rounded-xl text-sm bg-white/90 border border-[#20B2AA]/30 text-[#145B59] placeholder-[#587477]/60 focus:outline-none focus:ring-2 focus:ring-[#20B2AA] transition-all"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => handleSearchChange('')}
                      aria-label={isTamil ? 'தேடலை அழி' : 'Clear search'}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-md hover:bg-slate-200/60 flex items-center justify-center text-[#587477]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Sort Order Selector */}
                <div className="relative shrink-0">
                  <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/80 border border-[#20B2AA]/30 text-xs">
                    <ArrowUpDown className="w-3.5 h-3.5 text-[#20B2AA] ml-1.5 shrink-0" />
                    <select
                      value={sortOrder}
                      onChange={(e) => handleSortChange(e.target.value as SortOrder)}
                      className="bg-transparent text-[#145B59] font-bold text-xs pr-2 py-1.5 focus:outline-none cursor-pointer"
                      aria-label={isTamil ? 'வரிசைப்படுத்து' : 'Sort order'}
                    >
                      <option value="canonical">{isTamil ? 'இயல்புநிலை' : 'Canonical Order'}</option>
                      <option value="alpha-asc">{isTamil ? 'அகராதி வரிசை (A-Z)' : 'Name (A to Z)'}</option>
                      <option value="alpha-desc">{isTamil ? 'அகராதி வரிசை (Z-A)' : 'Name (Z to A)'}</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Department Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 scrollbar-none relative z-10">
              <button
                type="button"
                onClick={() => handleDeptChange('ALL')}
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
                    onClick={() => handleDeptChange(dept.code)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#20B2AA] ${
                      selectedDeptCode === dept.code
                        ? 'bg-[#20B2AA] text-white shadow-xs font-bold'
                        : 'bg-white/70 text-[#145B59] hover:bg-[#DDF5F1] border border-[#20B2AA]/20'
                    }`}
                  >
                    {isTamil ? dept.nameTa : dept.nameEn} ({departmentCounts[dept.code] || 0})
                  </button>
                ))}
            </div>

            {/* Active Filters Summary Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#C8E7E3]/60 relative z-10 text-xs">
              <div className="flex items-center gap-2 text-[#587477]">
                <span>
                  {isTamil
                    ? `காட்டப்படும் சிகிச்சைகள்: ${filteredAndSortedProcedures.length} / ${procedures.length}`
                    : `Showing ${filteredAndSortedProcedures.length} of ${procedures.length} procedures`}
                </span>
                {selectedDeptCode !== 'ALL' && (
                  <Badge variant="mint" className="text-[11px] font-bold">
                    {departments.find((d) => d.code === selectedDeptCode)?.nameEn || selectedDeptCode}
                  </Badge>
                )}
                {searchQuery && (
                  <span className="italic text-[#145B59]">
                    &ldquo;{searchQuery}&rdquo;
                  </span>
                )}
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#20B2AA] hover:text-[#145B59] hover:underline"
                >
                  <FilterX className="w-3.5 h-3.5" />
                  <span>{isTamil ? 'அனைத்து வடிகட்டிகளையும் நீக்கு' : 'Reset All Filters'}</span>
                </button>
              )}
            </div>
          </LiquidGlassSurface>

          {/* Procedure Directory Content or Deliberate Empty State */}
          {filteredAndSortedProcedures.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedProcedures.map((proc) => (
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
                {isTamil ? 'பொருத்தமான சிகிச்சைகள் எதுவும் கிடைக்கவில்லை' : 'No Matching Procedures Found'}
              </h3>
              <p className="text-sm text-[#587477] max-w-lg mx-auto">
                {searchQuery
                  ? isTamil
                    ? `"${searchQuery}" என்ற தேடலுக்கு அல்லது தேர்ந்தெடுக்கப்பட்ட துறைக்கு சிகிச்சைகள் எதுவும் பொருந்தவில்லை.`
                    : `No clinical guides matched "${searchQuery}" with the current filters.`
                  : isTamil
                  ? 'தேர்ந்தெடுக்கப்பட்ட துறைக்கு தற்போது வெளியிடப்பட்ட வழிகாட்டிகள் எதுவும் இல்லை.'
                  : 'No published educational guides matched the selected department filter.'}
              </p>
              <div className="pt-2">
                <Button
                  size="sm"
                  variant="mint"
                  onClick={clearAllFilters}
                  className="font-bold text-[#145B59]"
                >
                  {isTamil ? 'அனைத்து சிகிச்சைகளையும் காண்க' : 'View All Procedures'}
                </Button>
              </div>
            </LiquidGlassSurface>
          )}
        </div>
      </Container>
    </div>
  );
}
