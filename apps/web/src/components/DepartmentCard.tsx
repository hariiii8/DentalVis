import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { DepartmentDto } from '@dentalvis/common';
import { LiquidGlassSurface, Badge } from '@dentalvis/ui';
import { ArrowRight, Stethoscope } from 'lucide-react';

interface DepartmentCardProps {
  department: DepartmentDto;
  procedureCount: number;
  lang?: 'en' | 'ta';
}

export function DepartmentCard({ department, procedureCount, lang = 'en' }: DepartmentCardProps) {
  const isTamil = lang === 'ta';
  const title = isTamil ? department.nameTa : department.nameEn;
  const secondaryTitle = isTamil ? department.nameEn : department.nameTa;
  const description = isTamil ? department.descriptionTa : department.descriptionEn;
  const imageSrc = `/images/departments/${department.slug}.svg`;

  return (
    <Link
      href={`/explore/${department.slug}`}
      className="group block h-full focus:outline-none focus:ring-2 focus:ring-[#20B2AA] rounded-3xl"
      aria-label={isTamil ? `${title} மருத்துவப் பிரிவு` : `${title} clinical department`}
    >
      <LiquidGlassSurface
        variant="secondary"
        specular
        refractiveRim
        className="group-hover:liquid-glass-interactive rounded-3xl h-full flex flex-col justify-between overflow-hidden transition-all duration-300 isolate"
      >
        {/* Department Illustrated Vector Art with Refractive Mask in Seafoam & Powder Blue */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-[#F5FAF9] via-[#DDF5F1]/70 to-[#DCEFF5]/60 border-b border-[#C8E7E3]/60">
          <Image
            src={imageSrc}
            alt={isTamil ? `${department.nameTa} விளக்கப்படம்` : `${department.nameEn} department illustration`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Clinical Badge Tag & Department Code */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl liquid-glass-lens text-[#20B2AA] flex items-center justify-center shadow-xs">
              <Stethoscope className="w-4 h-4" />
            </div>
            <span className="px-2 py-0.5 rounded-lg liquid-glass-lens text-[11px] font-black tracking-wider text-[#145B59] uppercase shadow-xs">
              {department.code}
            </span>
          </div>

          {/* Procedure Count Badge */}
          <div className="absolute top-3 right-3">
            <Badge variant="mint" className="text-[11px] font-bold liquid-glass-lens shadow-xs">
              {procedureCount}{' '}
              {isTamil
                ? procedureCount === 1 ? 'சிகிச்சை' : 'சிகிச்சைகள்'
                : procedureCount === 1 ? 'Procedure' : 'Procedures'}
            </Badge>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 sm:p-7 pb-4 pt-5 flex-1 relative z-10">
          <h3 className="text-xl font-bold tracking-tight text-[#145B59] group-hover:text-[#20B2AA] transition-colors leading-snug">
            {title}
          </h3>
          <p className="text-xs font-semibold text-[#20B2AA]/90 mb-2 mt-0.5 line-clamp-1">
            {secondaryTitle}
          </p>
          <p className="line-clamp-3 text-[#587477] text-sm leading-relaxed">
            {description}
          </p>
        </div>

        {/* Action Link Footer */}
        <div className="p-6 sm:p-7 pt-0 relative z-10">
          <div className="text-xs font-bold text-[#20B2AA] flex items-center justify-between pt-3 border-t border-[#C8E7E3]/70 group-hover:translate-x-0.5 transition-transform">
            <span>
              {isTamil ? 'பிரிவு சிகிச்சைகளைக் காண்க' : 'Explore Clinical Department'}
            </span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </LiquidGlassSurface>
    </Link>
  );
}
