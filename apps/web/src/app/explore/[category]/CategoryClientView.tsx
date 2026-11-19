'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container, Button, Card, Badge } from '@dentalvis/ui';
import { ExploreCategory, ProcedureDetail } from '@dentalvis/common';
import { ArrowLeft, Compass, Info } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { ProcedureCard } from '@/components/ProcedureCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';

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
    <div className="py-12 space-y-12">
      <Container>
        {/* Navigation Breadcrumb */}
        <Breadcrumbs
          items={[
            { label: isTamil ? 'பல் சிகிச்சைகள்' : 'Explore Treatments', href: '/explore' },
            { label: title },
          ]}
          homeLabel={isTamil ? 'முகப்பு' : 'Home'}
        />

        {/* Back Link */}
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 text-sm text-[#0D9488] font-bold hover:underline mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isTamil ? 'அனைத்து பிரிவுகளுக்கும் திரும்பு' : 'Back to All Categories'}</span>
        </Link>

        {/* Category Hero Banner with Illustrated Artwork */}
        <div className="rounded-3xl bg-white border border-teal-100/90 shadow-sm overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10">
            <div className="lg:col-span-7 space-y-4">
              <Badge variant="mint" className="gap-1.5 text-xs font-semibold">
                <Compass className="w-3.5 h-3.5 text-[#0D9488]" />
                <span>{isTamil ? 'நோயாளி பிரிவு' : 'Educational Category'}</span>
              </Badge>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#134E4A] tracking-tight">
                {title}
              </h1>
              <p className="text-sm font-semibold text-[#0D9488]">
                {secondaryTitle}
              </p>

              <p className="text-base text-slate-600 leading-relaxed max-w-xl">
                {description}
              </p>

              <div className="pt-2 flex items-center gap-2 text-xs text-slate-500">
                <Info className="w-4 h-4 text-[#0D9488] shrink-0" />
                <span>
                  {isTamil
                    ? 'இப்பிரிவில் உள்ள அனைத்து வழிகாட்டிகளும் மருத்துவ அறிவியலின் அடிப்படையில் எளிமைப்படுத்தப்பட்டவை.'
                    : 'All procedure guides below explain reasons for treatment, duration, and patient comfort.'}
                </span>
              </div>
            </div>

            {/* Category Artwork Image */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-teal-100 shadow-sm">
                <Image
                  src={imageSrc}
                  alt={title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Associated Procedures Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-teal-100 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-[#134E4A]">
                {isTamil ? 'தொடர்புடைய சிகிச்சைகள் & வழிகாட்டிகள்' : 'Associated Treatments & Visual Guides'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {isTamil
                  ? `இப்பிரிவின் கீழ் ${relatedProcedures.length} சிகிச்சைகள் உள்ளன.`
                  : `Displaying ${relatedProcedures.length} procedures categorized under ${category.titleEn}.`}
              </p>
            </div>
          </div>

          {relatedProcedures.length === 0 ? (
            <Card className="p-12 text-center bg-teal-50/50 border-teal-100">
              <Compass className="w-10 h-10 text-teal-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-[#134E4A] mb-1">
                {isTamil ? 'வழிகாட்டிகள் தயாரிப்பில் உள்ளன' : 'Additional Guides in Preparation'}
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                {isTamil
                  ? 'இப்பிரிவிற்கான கூடுதல் காட்சி விளக்கங்கள் மருத்துவர் ஆய்வில் உள்ளன. விரைவில் சேர்க்கப்படும்.'
                  : 'Detailed visual guides for this category are currently undergoing clinical content review and translation.'}
              </p>
              <div className="mt-6">
                <Link href="/explore">
                  <Button variant="outline" size="sm" className="border-teal-200">
                    {isTamil ? 'மற்ற பிரிவுகளைக் காண்க' : 'Explore Other Categories'}
                  </Button>
                </Link>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProcedures.map((proc) => (
                <ProcedureCard key={proc.id} procedure={proc} lang={language} />
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
