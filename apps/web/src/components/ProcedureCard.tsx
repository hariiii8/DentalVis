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
    <Card className="flex flex-col justify-between overflow-hidden group hover:translate-y-[-2px] transition-all duration-300">
      {/* Visual Header with Cover Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 border-b border-teal-900/5">
        <Image
          src={imageSrc}
          alt={isTamil ? `${procedure.titleTa} விளக்கம்` : `${procedure.titleEn} clinical illustration`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-sm text-[#134E4A] shadow-sm">
            {procedure.primaryDepartmentName}
          </Badge>
          {procedure.has3DModel && (
            <Badge variant="default" className="text-[10px] gap-1 bg-teal-500/90 text-white backdrop-blur-sm shadow-sm">
              <Box className="w-3 h-3" />
              <span>3D</span>
            </Badge>
          )}
        </div>
      </div>

      <CardHeader className="pt-5">
        <CardTitle className="text-xl group-hover:text-[#0D9488] transition-colors line-clamp-1">
          {title}
        </CardTitle>
        <p className="text-xs font-semibold text-teal-700/80 mb-2">
          {secondaryTitle}
        </p>
        <CardDescription className="line-clamp-3 text-slate-600">
          {summary}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#0D9488]" />
            <span>
              {isTamil ? `~${procedure.durationMinutes} நிமிடங்கள்` : `~${procedure.durationMinutes} mins`}
            </span>
          </div>

          <Link
            href={`/procedures/${procedure.slug}`}
            className="inline-flex items-center gap-1 font-bold text-[#0D9488] group-hover:underline"
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
