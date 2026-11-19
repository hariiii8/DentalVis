'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container, Badge } from '@dentalvis/ui';
import { ExploreCategory, ProcedureDetail } from '@dentalvis/common';
import { ArrowLeft, Compass, Info } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { ProcedureCard } from '@/components/ProcedureCard';

interface CategoryClientViewProps {
  category: ExploreCategory;
  relatedProcedures: ProcedureDetail[];
}

export default function CategoryClientView({ category, relatedProcedures }: CategoryClientViewProps) {
  const { language } = useLanguage();
  const isTamil = language === 'ta';

  const title = isTamil ? category.titleTa : category.titleEn;
  const secondaryTitle = isTamil ? category.titleEn : category.titleTa;
  const description = isTamil ? category.descriptionTa : category.descriptionEn;
  const imageSrc = `/images/categories/${category.slug}.svg`;

  return (
    <div className="py-10 space-y-12 relative overflow-hidden bg-[#F5FAF9]">
      {/* Background Ambience in Soft Mint & Powder Blue */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-[#BFE9E2]/50 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[30rem] h-[30rem] bg-[#20B2AA]/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <Container>
        {/* Back Link */}
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 text-sm text-[#20B2AA] font-bold hover:underline mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isTamil ? 'அனைத்து பிரிவுகளுக்கும் திரும்பு' : 'Back to All Categories'}</span>
        </Link>

        {/* Category Hero Banner: Deep Liquid Glass Composition */}
        <div className="liquid-glass-primary rounded-3xl p-8 sm:p-10 mb-12 overflow-hidden shadow-md isolate relative">
          <div className="liquid-refractive-rim absolute inset-0 rounded-3xl pointer-events-none" />
          <div className="liquid-specular-sheen absolute inset-0 rounded-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <Badge variant="mint" className="gap-1.5 text-xs font-semibold liquid-glass-lens">
                <Compass className="w-3.5 h-3.5 text-[#20B2AA]" />
                <span>{isTamil ? 'நோயாளி பிரிவு' : 'Educational Category'}</span>
              </Badge>

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
                    : 'All procedure guides below explain reasons for treatment, duration, and patient comfort.'}
                </span>
              </div>
            </div>

            {/* Category Artwork Image inside Translucent Card Frame */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-white/80 shadow-sm bg-gradient-to-br from-[#F5FAF9] to-[#DCEFF5]/60">
                <Image
                  src={imageSrc}
                  alt={isTamil ? `${category.titleTa} விளக்கம்` : `${category.titleEn} illustration`}
                  fill
                  priority
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Related Procedures Section */}
        <div className="space-y-6">
          <div className="liquid-glass-secondary rounded-2xl px-6 py-4 flex items-center justify-between isolate relative">
            <div className="liquid-refractive-rim absolute inset-0 rounded-2xl pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-[#145B59]">
                {isTamil ? 'இப்பிரிவில் உள்ள சிகிச்சைகள்' : 'Procedures in This Topic'}
              </h2>
              <p className="text-xs text-[#587477] mt-1">
                {isTamil
                  ? 'கீழே உள்ள வழிகாட்டியைத் தேர்ந்தெடுத்து சிகிச்சை பற்றிய விரிவான காட்சி விளக்கங்களைக் காணவும்.'
                  : 'Select an educational guide below to view clear procedural steps, timelines, and recovery.'}
              </p>
            </div>
            <Badge variant="mint" className="text-xs font-bold liquid-glass-lens relative z-10">
              {relatedProcedures.length} {isTamil ? 'வழிகாட்டிகள்' : 'Guides'}
            </Badge>
          </div>

          {relatedProcedures.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProcedures.map((proc) => (
                <ProcedureCard key={proc.slug} procedure={proc} lang={language} />
              ))}
            </div>
          ) : (
            <div className="liquid-glass-secondary rounded-3xl p-12 text-center">
              <p className="text-[#587477] text-sm">
                {isTamil ? 'இப்பிரிவில் கூடுதல் சிகிச்சைகள் விரைவில் இணைக்கப்படும்.' : 'Additional procedure guides for this category will be available soon.'}
              </p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
