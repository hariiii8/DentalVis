import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Badge, LiquidGlassSurface } from '@dentalvis/ui';
import { ProcedureDetail } from '@dentalvis/common';
import { ArrowRight, Box, Clock } from 'lucide-react';

interface ProcedureCardProps {
  procedure: ProcedureDetail;
  lang?: 'en' | 'ta';
  coverImagePath?: string;
}

export function ProcedureCard({ procedure, lang = 'en', coverImagePath }: ProcedureCardProps) {
  const isTamil = lang === 'ta';
  const title = isTamil ? procedure.titleTa : procedure.titleEn;
  const secondaryTitle = isTamil ? procedure.titleEn : procedure.titleTa;
  const summary = isTamil ? procedure.summaryTa : procedure.summaryEn;
  const imageSrc = coverImagePath || `/images/procedures/${procedure.slug}.svg`;

  return (
    <LiquidGlassSurface
      variant="secondary"
      specular
      refractiveRim
      className="hover:liquid-glass-interactive rounded-3xl flex flex-col justify-between overflow-hidden transition-all duration-300 isolate group h-full"
    >
      {/* Visual Header with Cover Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-[#F5FAF9] to-[#DDF5F1]/70 border-b border-[#C8E7E3]/60">
        <Image
          src={imageSrc}
          alt={isTamil ? `${procedure.titleTa} விளக்கம்` : `${procedure.titleEn} clinical illustration`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          <Badge variant="glass" className="text-[10px] font-bold uppercase tracking-wider liquid-glass-lens text-[#145B59] shadow-xs">
            {procedure.primaryDepartmentName}
          </Badge>
          {procedure.has3DModel && (
            <Badge variant="default" className="text-[10px] gap-1 bg-[#20B2AA] text-white shadow-xs">
              <Box className="w-3 h-3" />
              <span>3D</span>
            </Badge>
          )}
        </div>
      </div>

      <div className="p-6 sm:p-7 pb-4 pt-5 relative z-10 flex-1">
        <h3 className="text-xl font-bold tracking-tight text-[#145B59] group-hover:text-[#20B2AA] transition-colors line-clamp-1">
          {title}
        </h3>
        <p className="text-xs font-semibold text-[#20B2AA]/90 mb-2">
          {secondaryTitle}
        </p>
        <p className="line-clamp-3 text-[#587477] text-sm leading-relaxed">
          {summary}
        </p>
      </div>

      <div className="p-6 sm:p-7 pt-0 relative z-10">
        <div className="flex items-center justify-between text-xs text-[#587477] pt-4 border-t border-[#C8E7E3]/70">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#20B2AA]" />
            <span>
              {isTamil ? `~${procedure.durationMinutes} நிமிடங்கள்` : `~${procedure.durationMinutes} mins`}
            </span>
          </div>

          <Link
            href={`/procedures/${procedure.slug}`}
            className="inline-flex items-center gap-1 font-bold text-[#20B2AA] group-hover:translate-x-0.5 transition-transform"
            aria-label={isTamil ? `${title} பற்றிய விவரங்கள்` : `View details for ${title}`}
          >
            <span>{isTamil ? 'விவரங்களை காண்க' : 'View Guide'}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </LiquidGlassSurface>
  );
}
