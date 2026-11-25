'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container, Badge } from '@dentalvis/ui';
import { DepartmentDto, ExploreCategory, ProcedureDetail } from '@dentalvis/common';
import { ArrowLeft, Stethoscope, Compass, Info, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { ProcedureCard } from '@/components/ProcedureCard';

interface DepartmentViewProps {
  itemType: 'department';
  department: DepartmentDto;
  category?: never;
  relatedProcedures: ProcedureDetail[];
}

interface CategoryViewProps {
  itemType: 'category';
  category: ExploreCategory;
  department?: never;
  relatedProcedures: ProcedureDetail[];
}

type DepartmentOrCategoryClientViewProps = DepartmentViewProps | CategoryViewProps;

export default function DepartmentOrCategoryClientView(props: DepartmentOrCategoryClientViewProps) {
  const { language } = useLanguage();
  const isTamil = language === 'ta';

  let title = '';
  let secondaryTitle = '';
  let description = '';
  let imageSrc = '';
  let code: string | null = null;

  if (props.itemType === 'department') {
    const { department } = props;
    title = isTamil ? department.nameTa : department.nameEn;
    secondaryTitle = isTamil ? department.nameEn : department.nameTa;
    description = isTamil ? department.descriptionTa : department.descriptionEn;
    imageSrc = `/images/departments/${department.slug}.svg`;
    code = department.code;
  } else {
    const { category } = props;
    title = isTamil ? category.titleTa : category.titleEn;
    secondaryTitle = isTamil ? category.titleEn : category.titleTa;
    description = isTamil ? category.descriptionTa : category.descriptionEn;
    imageSrc = `/images/categories/${category.slug}.svg`;
  }

  const isDepartment = props.itemType === 'department';

  return (
    <div className="py-10 space-y-12 relative overflow-hidden">
      {/* Background Ambience in Soft Mint & Powder Blue */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-[#BFE9E2]/55 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[30rem] h-[30rem] bg-[#20B2AA]/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <Container>
        {/* Breadcrumb Navigation Strip */}
        <nav aria-label={isTamil ? 'வழிசெலுத்தல் பாதை' : 'Breadcrumb'} className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#587477] mb-6">
          <Link
            href="/home"
            className="hover:text-[#20B2AA] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#20B2AA] rounded"
          >
            {isTamil ? 'முகப்பு' : 'Home'}
          </Link>
          <span aria-hidden="true" className="text-[#C8E7E3] font-bold">/</span>
          <Link
            href="/explore"
            className="hover:text-[#20B2AA] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#20B2AA] rounded"
          >
            {isTamil ? 'சிகிச்சைகள்' : 'Explore'}
          </Link>
          <span aria-hidden="true" className="text-[#C8E7E3] font-bold">/</span>
          <span aria-current="page" className="text-[#145B59] font-bold line-clamp-1 max-w-[200px] sm:max-w-none">
            {title}
          </span>
        </nav>

        {/* Back Link */}
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 text-sm text-[#20B2AA] font-bold hover:underline mb-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#20B2AA] rounded"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>
            {isTamil ? 'அனைத்து மருத்துவத் துறைகளுக்கும் திரும்பு' : 'Back to All Clinical Departments'}
          </span>
        </Link>

        {/* Hero Banner: Deep Liquid Glass Composition */}
        <div className="liquid-glass-primary rounded-3xl p-8 sm:p-10 mb-12 overflow-hidden shadow-md isolate relative">
          <div className="liquid-refractive-rim absolute inset-0 rounded-3xl pointer-events-none" />
          <div className="liquid-specular-sheen absolute inset-0 rounded-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="mint" className="gap-1.5 text-xs font-semibold liquid-glass-lens">
                  {isDepartment ? (
                    <>
                      <Stethoscope className="w-3.5 h-3.5 text-[#20B2AA]" />
                      <span>{isTamil ? 'மருத்துவத் துறை' : 'Clinical Specialty'}</span>
                    </>
                  ) : (
                    <>
                      <Compass className="w-3.5 h-3.5 text-[#20B2AA]" />
                      <span>{isTamil ? 'அறிகுறி பிரிவு' : 'Symptom Topic'}</span>
                    </>
                  )}
                </Badge>
                {code && (
                  <span className="px-2 py-0.5 rounded-lg liquid-glass-lens text-xs font-black tracking-wider text-[#145B59] uppercase shadow-xs">
                    {code}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-[#145B59] tracking-tight">
                {title}
              </h1>
              <p className="text-sm font-semibold text-[#20B2AA]">
                {secondaryTitle}
              </p>

              <p className="text-base sm:text-lg text-[#587477] leading-relaxed max-w-xl">
                {description}
              </p>

              <div className="liquid-glass-secondary p-3.5 rounded-2xl flex items-center gap-2 text-xs text-[#145B59]">
                <Info className="w-4 h-4 text-[#20B2AA] shrink-0" />
                <span>
                  {isTamil
                    ? 'இப்பிரிவில் உள்ள அனைத்து வழிகாட்டிகளும் மருத்துவ அறிவியலின் அடிப்படையில் எளிமைப்படுத்தப்பட்டவை.'
                    : 'All procedure guides below explain clinical indications, procedural steps, and patient comfort.'}
                </span>
              </div>
            </div>

            {/* Department / Category Artwork Image */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-white/80 shadow-sm bg-gradient-to-br from-[#F5FAF9] to-[#DCEFF5]/60">
                <Image
                  src={imageSrc}
                  alt={isTamil ? `${title} விளக்கப்படம்` : `${title} illustration`}
                  fill
                  priority
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Procedures Section */}
        <div className="space-y-6">
          <div className="liquid-glass-secondary rounded-2xl px-6 py-4 flex items-center justify-between isolate relative">
            <div className="liquid-refractive-rim absolute inset-0 rounded-2xl pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-[#145B59]">
                {isTamil ? 'இப்பிரிவில் உள்ள சிகிச்சைகள்' : 'Procedures in This Department'}
              </h2>
              <p className="text-xs text-[#587477] mt-1">
                {isTamil
                  ? 'கீழே உள்ள வழிகாட்டியைத் தேர்ந்தெடுத்து சிகிச்சை பற்றிய விரிவான காட்சி விளக்கங்களைக் காணவும்.'
                  : 'Select an educational guide below to view clear procedural steps, timelines, and recovery.'}
              </p>
            </div>
            <Badge variant="mint" className="text-xs font-bold liquid-glass-lens relative z-10">
              {props.relatedProcedures.length}{' '}
              {isTamil
                ? props.relatedProcedures.length === 1 ? 'வழிகாட்டி' : 'வழிகாட்டிகள்'
                : props.relatedProcedures.length === 1 ? 'Guide' : 'Guides'}
            </Badge>
          </div>

          {props.relatedProcedures.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {props.relatedProcedures.map((proc) => (
                <ProcedureCard key={proc.slug} procedure={proc} lang={language} />
              ))}
            </div>
          ) : (
            <div className="liquid-glass-secondary rounded-3xl p-12 text-center border border-[#C8E7E3]/60">
              <div className="w-12 h-12 rounded-2xl liquid-glass-lens text-[#20B2AA] mx-auto mb-4 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#145B59] mb-1">
                {isTamil ? 'சிகிச்சைகள் தயாரிப்பில் உள்ளன' : 'Curated Guides in Preparation'}
              </h3>
              <p className="text-[#587477] text-sm max-w-md mx-auto">
                {isTamil
                  ? 'இப்பிரிவில் கூடுதல் சிகிச்சைகள் விரைவில் இணைக்கப்படும்.'
                  : 'More educational procedures are coming soon.'}
              </p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
