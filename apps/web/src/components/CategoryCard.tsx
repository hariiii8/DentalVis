import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
      className="group block h-full focus:outline-none focus:ring-2 focus:ring-[#20B2AA] rounded-3xl"
      aria-label={isTamil ? `${title} பிரிவு` : `${title} category`}
    >
      <div className="liquid-glass-secondary group-hover:liquid-glass-interactive rounded-3xl h-full flex flex-col justify-between overflow-hidden transition-all duration-300 isolate relative">
        <div className="liquid-refractive-rim absolute inset-0 rounded-3xl pointer-events-none" />
        <div className="liquid-specular-sheen absolute inset-0 rounded-3xl pointer-events-none" />

        {/* Category Illustrated Cover with Refractive Mask in Seafoam and Powder Blue */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-[#F5FAF9] via-[#DDF5F1]/70 to-[#DCEFF5]/60 border-b border-[#C8E7E3]/60">
          <Image
            src={imageSrc}
            alt={isTamil ? `${category.titleTa} பிரிவு ஓவியம்` : `${category.titleEn} category artwork`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-3 left-3 w-9 h-9 rounded-xl liquid-glass-lens text-[#20B2AA] flex items-center justify-center shadow-xs">
            <Compass className="w-5 h-5" />
          </div>
        </div>

        <div className="p-6 sm:p-7 pb-4 pt-5 flex-1 relative z-10">
          <h3 className="text-xl font-bold tracking-tight text-[#145B59] group-hover:text-[#20B2AA] transition-colors">
            {title}
          </h3>
          <p className="text-xs font-semibold text-[#20B2AA]/90 mb-2">
            {secondaryTitle}
          </p>
          <p className="line-clamp-3 text-[#587477] text-sm leading-relaxed">
            {description}
          </p>
        </div>

        <div className="p-6 sm:p-7 pt-0 relative z-10">
          <div className="text-xs font-bold text-[#20B2AA] flex items-center gap-1.5 pt-3 border-t border-[#C8E7E3]/70 group-hover:translate-x-0.5 transition-transform">
            <span>{isTamil ? 'பிரிவு சிகிச்சைகளைக் காண்க' : 'Explore Category Procedures'}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}
