// apps/admin/src/features/editorial/ProcedurePreviewModal.tsx
// DentalVis Admin — True-to-Life Public Educational Procedure Preview
// Architecture Baseline v1.9.1 — Milestone M7.3

import { useState } from 'react';
import { Badge } from '@dentalvis/ui';
import {
  X,
  Clock,
  HeartPulse,
  Sparkles,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { ProcedureEditorialContent, CANONICAL_DEPARTMENTS, CANONICAL_EXPLORE_CATEGORIES } from '@dentalvis/common';

interface ProcedurePreviewModalProps {
  procedure: ProcedureEditorialContent;
  onClose: () => void;
}

export function ProcedurePreviewModal({ procedure, onClose }: ProcedurePreviewModalProps) {
  const [lang, setLang] = useState<'en' | 'ta'>('en');
  const isTa = lang === 'ta';

  const title = isTa ? procedure.titleTa : procedure.titleEn;
  const secondaryTitle = isTa ? procedure.titleEn : procedure.titleTa;
  const summary = isTa ? procedure.summaryTa : procedure.summaryEn;
  const overviewHtml = isTa ? procedure.overviewHtmlTa : procedure.overviewHtmlEn;
  const indications = isTa ? procedure.indicationsTa : procedure.indicationsEn;
  const contraindications = isTa ? procedure.contraindicationsTa : procedure.contraindicationsEn;
  const recoveryInfo = isTa ? procedure.recoveryInfoTa : procedure.recoveryInfoEn;
  const aftercare = isTa ? procedure.aftercareInstructionsTa : procedure.aftercareInstructionsEn;

  const dept = CANONICAL_DEPARTMENTS.find((d) => d.code === procedure.primaryDepartmentCode);
  const deptName = dept ? (isTa ? dept.nameTa : dept.nameEn) : procedure.primaryDepartmentCode;

  const categories = CANONICAL_EXPLORE_CATEGORIES.filter((c) =>
    procedure.exploreCategorySlugs.includes(c.slug)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-b from-[#F5FAF9] to-[#E8F7F6] rounded-3xl shadow-2xl border border-white/80 flex flex-col overflow-hidden text-[#164B50]">
        {/* Modal Header */}
        <div className="px-6 py-4 glass-nav border-b border-[#C8E7E3]/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#20B2AA] to-[#145B59] flex items-center justify-center text-white font-bold text-xs">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[#145B59]">Public Presentation Preview</span>
                <span className="px-2 py-0.5 rounded-lg liquid-glass-lens text-[11px] font-mono text-[#145B59]">
                  {procedure.code}
                </span>
              </div>
              <p className="text-[11px] text-[#587477]">
                Live preview reflects the exact public patient educational experience (0 warning badges)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <div className="flex items-center p-1 rounded-xl liquid-glass-secondary border border-[#C8E7E3]">
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  !isTa ? 'bg-[#20B2AA] text-white shadow-xs' : 'text-[#145B59] hover:bg-white/60'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLang('ta')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  isTa ? 'bg-[#20B2AA] text-white shadow-xs' : 'text-[#145B59] hover:bg-white/60'
                }`}
              >
                தமிழ்
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-white/60 text-[#587477] hover:text-[#145B59] transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {/* Header Section */}
          <div className="liquid-glass-primary p-6 md:p-8 rounded-3xl space-y-4 border border-white/80">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="mint" className="text-xs font-bold">
                {deptName}
              </Badge>
              {categories.map((c) => (
                <span
                  key={c.id}
                  className="px-2.5 py-0.5 rounded-xl liquid-glass-secondary text-[11px] font-medium text-[#145B59]"
                >
                  {isTa ? c.titleTa : c.titleEn}
                </span>
              ))}
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-[#145B59] tracking-tight">
              {title}
            </h1>
            <p className="text-xs font-medium text-[#20B2AA]">{secondaryTitle}</p>

            <p className="text-sm text-[#587477] leading-relaxed max-w-3xl">{summary}</p>

            {/* Treatment Metadata Quick-Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-2xl liquid-glass-secondary flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#20B2AA] shrink-0" />
                <div>
                  <div className="text-[10px] text-[#587477] uppercase font-bold">
                    {isTa ? 'கால அளவு' : 'Duration'}
                  </div>
                  <div className="text-xs font-bold text-[#145B59]">~{procedure.durationMinutes} min</div>
                </div>
              </div>

              <div className="p-3 rounded-2xl liquid-glass-secondary flex items-center gap-3">
                <HeartPulse className="w-4 h-4 text-[#20B2AA] shrink-0" />
                <div>
                  <div className="text-[10px] text-[#587477] uppercase font-bold">
                    {isTa ? 'மயக்க மருந்து' : 'Comfort / Numbing'}
                  </div>
                  <div className="text-xs font-bold text-[#145B59] truncate max-w-[130px]">
                    {procedure.anesthesiaType}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-2xl liquid-glass-secondary flex items-center gap-3 col-span-2 sm:col-span-1">
                <Sparkles className="w-4 h-4 text-[#20B2AA] shrink-0" />
                <div>
                  <div className="text-[10px] text-[#587477] uppercase font-bold">
                    {isTa ? 'காட்சி மாதிரி' : 'Visualization'}
                  </div>
                  <div className="text-xs font-bold text-[#145B59]">
                    {procedure.has3DModel ? '3D WebGL Canvas' : '2D Schematic Guide'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Clinical Overview HTML */}
          <div className="liquid-glass-secondary p-6 rounded-3xl space-y-3">
            <h3 className="font-extrabold text-base text-[#145B59]">
              {isTa ? 'சிகிச்சை பற்றிய விரிவான விளக்கம்' : 'Clinical Overview & Procedure Details'}
            </h3>
            <div
              className="text-xs text-[#587477] leading-relaxed space-y-2 [&_p]:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: overviewHtml }}
            />
          </div>

          {/* Clinical Indications & Contraindications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl liquid-glass-secondary space-y-2">
              <span className="text-xs font-bold text-[#145B59] block">
                {isTa ? 'பரிந்துரைக்கப்படும் காரணங்கள்' : 'Clinical Indications'}
              </span>
              <p className="text-xs text-[#587477] leading-relaxed">{indications}</p>
            </div>

            <div className="p-5 rounded-2xl liquid-glass-secondary space-y-2">
              <span className="text-xs font-bold text-[#145B59] block">
                {isTa ? 'தவிர்க்க வேண்டிய நிலைகள்' : 'Contraindications & Precautions'}
              </span>
              <p className="text-xs text-[#587477] leading-relaxed">{contraindications}</p>
            </div>
          </div>

          {/* Recovery and Aftercare */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl liquid-glass-secondary space-y-2">
              <span className="text-xs font-bold text-[#145B59] block">
                {isTa ? 'குணமடைதல் வழிகாட்டுதல்' : 'Recovery Information'}
              </span>
              <p className="text-xs text-[#587477] leading-relaxed">{recoveryInfo}</p>
            </div>

            <div className="p-5 rounded-2xl liquid-glass-secondary space-y-2">
              <span className="text-xs font-bold text-[#145B59] block">
                {isTa ? 'பராமரிப்பு ஆலோசனைகள்' : 'Aftercare Instructions'}
              </span>
              <p className="text-xs text-[#587477] leading-relaxed">{aftercare}</p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 glass-nav border-t border-[#C8E7E3]/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-[#587477]">
            <CheckCircle2 className="w-4 h-4 text-[#20B2AA]" />
            <span>Verified educational presentation parity</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#20B2AA] text-white font-bold text-xs hover:bg-[#145B59] transition-all cursor-pointer shadow-xs"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
