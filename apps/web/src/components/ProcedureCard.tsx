import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from '@dentalvis/ui';
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
    <Card glass="glow" className="flex flex-col justify-between overflow-hidden group hover:translate-y-[-4px] transition-all duration-300">
      {/* Visual Header with Cover Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-[#EAF5F8] to-[#D9F0ED]/50 border-b border-[#DCEAEC]">
        <Image
          src={imageSrc}
          alt={isTamil ? `${procedure.titleTa} விளக்கம்` : `${procedure.titleEn} clinical illustration`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <Badge variant="glass" className="text-[10px] font-bold uppercase tracking-wider bg-white/80 backdrop-blur-md text-[#164B50] shadow-xs">
            {procedure.primaryDepartmentName}
          </Badge>
          {procedure.has3DModel && (
            <Badge variant="default" className="text-[10px] gap-1 bg-[#247F83] text-white backdrop-blur-md shadow-xs">
              <Box className="w-3 h-3" />
              <span>3D</span>
            </Badge>
          )}
        </div>
      </div>

      <CardHeader className="pt-5">
        <CardTitle className="text-xl group-hover:text-[#247F83] transition-colors line-clamp-1">
          {title}
        </CardTitle>
        <p className="text-xs font-semibold text-[#247F83]/90 mb-2">
          {secondaryTitle}
        </p>
        <CardDescription className="line-clamp-3 text-[#64777C]">
          {summary}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-xs text-[#64777C] pt-4 border-t border-[#DCEAEC]">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#247F83]" />
            <span>
              {isTamil ? `~${procedure.durationMinutes} நிமிடங்கள்` : `~${procedure.durationMinutes} mins`}
            </span>
          </div>

          <Link
            href={`/procedures/${procedure.slug}`}
            className="inline-flex items-center gap-1 font-bold text-[#247F83] group-hover:underline"
            aria-label={isTamil ? `${title} பற்றிய விவரங்கள்` : `View details for ${title}`}
          >
            <span>{isTamil ? 'விவரங்களை காண்க' : 'View Guide'}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
