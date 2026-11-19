import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@dentalvis/ui';
import { ExploreCategory } from '@dentalvis/common';
import { ArrowRight, Compass } from 'lucide-react';

interface CategoryCardProps {
  category: ExploreCategory;
  lang?: 'en' | 'ta';
}

export function CategoryCard({ category, lang = 'en' }: CategoryCardProps) {
  const isTamil = lang === 'ta';
  const title = isTamil ? category.titleTa : category.titleEn;
  const secondaryTitle = isTamil ? category.titleEn : category.titleTa;
  const description = isTamil ? category.descriptionTa : category.descriptionEn;
  const imageSrc = `/images/categories/${category.slug}.svg`;

  return (
    <Link
      href={`/explore/${category.slug}`}
      className="group block h-full focus:outline-none focus:ring-2 focus:ring-[#247F83] rounded-3xl"
      aria-label={isTamil ? `${title} பிரிவு` : `${title} category`}
    >
      <Card glass="glow" className="h-full flex flex-col justify-between overflow-hidden group-hover:translate-y-[-4px] transition-all duration-300">
        {/* Category Illustrated Cover */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-[#EAF5F8] via-[#D9F0ED]/60 to-[#EAF5F8] border-b border-[#DCEAEC]">
          <Image
            src={imageSrc}
            alt={isTamil ? `${category.titleTa} பிரிவு ஓவியம்` : `${category.titleEn} category artwork`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-3 left-3 w-9 h-9 rounded-xl bg-white/80 backdrop-blur-md text-[#247F83] flex items-center justify-center shadow-xs border border-white">
            <Compass className="w-5 h-5" />
          </div>
        </div>

        <CardHeader className="pt-5 flex-1">
          <CardTitle className="text-xl group-hover:text-[#247F83] transition-colors">
            {title}
          </CardTitle>
          <p className="text-xs font-semibold text-[#247F83]/90 mb-2">
            {secondaryTitle}
          </p>
          <CardDescription className="line-clamp-3 text-[#64777C]">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="text-xs font-bold text-[#247F83] flex items-center gap-1.5 pt-3 border-t border-[#DCEAEC] group-hover:underline">
            <span>{isTamil ? 'பிரிவு சிகிச்சைகளைக் காண்க' : 'Explore Category Procedures'}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
