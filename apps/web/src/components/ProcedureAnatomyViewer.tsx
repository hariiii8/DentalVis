'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { RotateCw, ZoomIn, ZoomOut, RefreshCw, Layers, ShieldCheck, Sparkles } from 'lucide-react';
import { Badge, LiquidGlassSurface } from '@dentalvis/ui';

interface AnatomyCallout {
  labelEn: string;
  labelTa: string;
  descEn: string;
  descTa: string;
  positionPercent: { x: number; y: number };
}

interface ProcedureAnatomyConfig {
  titleEn: string;
  titleTa: string;
  subtitleEn: string;
  subtitleTa: string;
  callouts: AnatomyCallout[];
  interactive3DReady: boolean;
}

const PROCEDURE_ANATOMY_DATA: Record<string, ProcedureAnatomyConfig> = {
  'root-canal-treatment': {
    titleEn: 'Cross-Sectional Tooth & Pulp Chamber Anatomy',
    titleTa: 'பல் குறுக்குவெட்டு & நரம்பு அறை உடற்கூறியல்',
    subtitleEn: 'Enamel, Dentin, Inflamed Pulp, and Root Canal System',
    subtitleTa: 'எனாமல், டென்டின், நரம்பு அறை மற்றும் வேர் கால்வாய் கட்டமைப்பு',
    interactive3DReady: false,
    callouts: [
      {
        labelEn: 'Crown & Outer Enamel',
        labelTa: 'பல் கிரவுன் & எனாமல்',
        descEn: 'The hard, mineralized outer layer protecting the tooth.',
        descTa: 'பல்லைப் பாதுகாக்கும் வெளிப்புறக் கடினமான எனாமல் அடுக்கு.',
        positionPercent: { x: 50, y: 22 },
      },
      {
        labelEn: 'Living Dentin Layer',
        labelTa: 'உயிருள்ள டென்டின் அடுக்கு',
        descEn: 'Microscopic tubules transmitting temperature and sensation.',
        descTa: 'வெப்பம் மற்றும் கூச்சத்தை உணர்த்தும் நுண்ணிய டென்டின் குழாய்கள்.',
        positionPercent: { x: 38, y: 44 },
      },
      {
        labelEn: 'Pulp Chamber & Canals',
        labelTa: 'நரம்பு அறை & கால்வாய்கள்',
        descEn: 'Vascular and nerve pathways safely cleaned and sealed during RCT.',
        descTa: 'வேர் கால்வாய் சிகிச்சையில் சுத்தம் செய்யப்பட்டு சீல் செய்யப்படும் நரம்புப் பகுதி.',
        positionPercent: { x: 52, y: 64 },
      },
    ],
  },
  'dental-crowns': {
    titleEn: 'Prepared Tooth Core & Custom Ceramic Restorative Anatomy',
    titleTa: 'தயாரிக்கப்பட்ட பல் & செராமிக் தொப்பி கட்டமைப்பு',
    subtitleEn: 'Tooth Abutment, Margin Chamfer, and Custom Ceramic Coping',
    subtitleTa: 'பல் கோர், விளிம்பு வடிவம் மற்றும் செராமிக் தொப்பி அமைப்பு',
    interactive3DReady: false,
    callouts: [
      {
        labelEn: 'Custom Ceramic Crown',
        labelTa: 'செராமிக் பல் தொப்பி',
        descEn: 'Milled ceramic restoring chewing anatomy and lifelike aesthetics.',
        descTa: 'மெல்லும் திறனையும் இயல்பான தோற்றத்தையும் தரும் செராமிக் உறை.',
        positionPercent: { x: 50, y: 24 },
      },
      {
        labelEn: 'Precision Margin Chamfer',
        labelTa: 'விளிம்பு சீரமைப்பு',
        descEn: 'Smooth submillimeter margin ensuring flush gumline fit.',
        descTa: 'ஈறு வரிசையில் சரியாகப் பொருந்துவதற்கான துல்லிய விளிம்பு.',
        positionPercent: { x: 58, y: 46 },
      },
      {
        labelEn: 'Preserved Natural Core',
        labelTa: 'இயற்கை பல் கோர்',
        descEn: 'Shaped vital tooth structure providing foundational retention.',
        descTa: 'தொப்பியைத் தாங்கிப் பிடிக்கும் இயற்கையான பல் பகுதி.',
        positionPercent: { x: 44, y: 68 },
      },
    ],
  },
  'single-dental-implant': {
    titleEn: 'Implant Fixture, Abutment & Bone Integration Anatomy',
    titleTa: 'இம்ப்ளான்ட் திருகு, இணைப்பு மற்றும் தாடை எலும்பு கட்டமைப்பு',
    subtitleEn: 'Porcelain Crown, Titanium Abutment, and Osseointegrated Root',
    subtitleTa: 'செயற்கைப் பல், டைட்டானியம் இணைப்பு மற்றும் தாடை எலும்பு ஒருங்கிணைப்பு',
    interactive3DReady: false,
    callouts: [
      {
        labelEn: 'Prosthetic Porcelain Crown',
        labelTa: 'செயற்கை பீங்கான் பல்',
        descEn: 'Custom-shaded ceramic crown anchored securely to the abutment.',
        descTa: 'டைட்டானியம் இணைப்பில் உறுதியாகப் பொருத்தப்படும் பீங்கான் பல்.',
        positionPercent: { x: 50, y: 24 },
      },
      {
        labelEn: 'Titanium Abutment Collar',
        labelTa: 'டைட்டானியம் இணைப்பு காலர்',
        descEn: 'The precision connector linking the artificial root to the visible tooth.',
        descTa: 'செயற்கை வேரையும் மேல் பல்லையும் இணைக்கும் துல்லிய இணைப்பு.',
        positionPercent: { x: 50, y: 46 },
      },
      {
        labelEn: 'Osseointegrated Titanium Root',
        labelTa: 'எலும்புடன் இணையும் டைட்டானியம் வேர்',
        descEn: 'Biocompatible threaded fixture bonded permanently into the jawbone.',
        descTa: 'தாடை எலும்புடன் இயற்கையாக இணையும் பிரத்யேக டைட்டானியம் திருகு.',
        positionPercent: { x: 50, y: 72 },
      },
    ],
  },
  'deep-cleaning-scaling': {
    titleEn: 'Periodontal Pocket & Subgingival Root Anatomy',
    titleTa: 'ஈறு பை & பல் வேர் ஆழமான உடற்கூறியல்',
    subtitleEn: 'Gingival Sulcus, Calculus Deposits, and Root Cementum',
    subtitleTa: 'ஈறு விளிம்பு, கடின காரை படிவுகள் மற்றும் பல் வேர் பகுதி',
    interactive3DReady: false,
    callouts: [
      {
        labelEn: 'Crown Enamel Surface',
        labelTa: 'பல் எனாமல் புறப்பரப்பு',
        descEn: 'Supragingival enamel easily maintained with routine brushing.',
        descTa: 'வழக்கமான பிரஷிங் மூலம் பராமரிக்கப்படும் வெளிப்புற எனாமல்.',
        positionPercent: { x: 46, y: 26 },
      },
      {
        labelEn: 'Subgingival Calculus Deposit',
        labelTa: 'ஈறுகளுக்கு அடியில் உள்ள காரை',
        descEn: 'Hardened plaque removed gently with ultrasonic micro-vibrations.',
        descTa: 'அல்ட்ராசோனிக் கருவிகள் மூலம் கவனமாக நீக்கப்படும் கடின காரை.',
        positionPercent: { x: 56, y: 48 },
      },
      {
        labelEn: 'Periodontal Sulcus & Root Cementum',
        labelTa: 'ஈறு பை & வேர் சிமென்டம்',
        descEn: 'Healthy gum reattaches tightly after deep cleansing.',
        descTa: 'ஆழமான சுத்திகரிப்புக்குப் பின் ஈறுகள் வேருடன் மீண்டும் இணைகிறது.',
        positionPercent: { x: 44, y: 68 },
      },
    ],
  },
};

interface ProcedureAnatomyViewerProps {
  procedureSlug: string;
  imageSrc: string;
  lang?: 'en' | 'ta';
}

export function ProcedureAnatomyViewer({
  procedureSlug,
  imageSrc,
  lang = 'en',
}: ProcedureAnatomyViewerProps) {
  const isTamil = lang === 'ta';
  const anatomyData = PROCEDURE_ANATOMY_DATA[procedureSlug] || {
    titleEn: 'Clinical Dental Anatomy Guide',
    titleTa: 'மருத்துவ பல் உடற்கூறியல் வழிகாட்டி',
    subtitleEn: 'Tooth Structure and Tissue Relationships',
    subtitleTa: 'பல் கட்டமைப்பு மற்றும் திசு அமைப்புகள்',
    interactive3DReady: false,
    callouts: [],
  };

  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [activeCallout, setActiveCallout] = useState<number | null>(null);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.0));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  const handleRotate = () => setRotationAngle((prev) => (prev + 90) % 360);
  const handleReset = () => {
    setZoomLevel(1);
    setRotationAngle(0);
    setActiveCallout(null);
  };

  return (
    <LiquidGlassSurface
      variant="primary"
      specular
      refractiveRim
      className="rounded-3xl p-6 sm:p-8 space-y-6 shadow-md isolate"
    >
      {/* 1. Header Bar: Title, Clinical Integrity Status, and Honest Visualization Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#C8E7E3]/70 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#20B2AA] animate-pulse" />
            <h2 className="text-xl sm:text-2xl font-black text-[#145B59] tracking-tight">
              {isTamil ? anatomyData.titleTa : anatomyData.titleEn}
            </h2>
          </div>
          <p className="text-xs font-semibold text-[#587477]">
            {isTamil ? anatomyData.subtitleTa : anatomyData.subtitleEn}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="mint" className="gap-1.5 text-xs font-bold liquid-glass-lens">
            <Layers className="w-3.5 h-3.5 text-[#20B2AA]" />
            <span>
              {isTamil
                ? 'உயர் தெளிவு மருத்துவ விளக்கப்படம்'
                : 'High-Fidelity Medical Cross-Section'}
            </span>
          </Badge>
          <Badge variant="outline" className="text-[11px] font-mono text-[#587477] bg-[#F5FAF9]/80">
            {isTamil ? 'மருத்துவ ஆய்வு நிலுவையில் உள்ளது' : 'Clinical Draft Review'}
          </Badge>
        </div>
      </div>

      {/* 2. Interactive Optical Viewport with Zoom, Rotate, and Reset Controls */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-gradient-to-br from-[#F5FAF9] via-[#E8F7F6]/60 to-[#DCEFF5]/50 border border-white/90 shadow-inner relative z-10 group">
        {/* Subtle Measurement Grid Lines */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_right,#C8E7E3_1px,transparent_1px),linear-gradient(to_bottom,#C8E7E3_1px,transparent_1px)] bg-[size:40px_40px] opacity-25 pointer-events-none"
        />

        {/* Viewport Floating Controls Toolbar */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 p-1.5 rounded-xl liquid-glass-lens shadow-xs border border-white/80">
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-1.5 rounded-lg text-[#145B59] hover:bg-[#DDF5F1] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#20B2AA]"
            aria-label={isTamil ? 'பெரிதாக்கவும் (Zoom in)' : 'Zoom In'}
            title={isTamil ? 'பெரிதாக்கவும்' : 'Zoom In'}
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-1.5 rounded-lg text-[#145B59] hover:bg-[#DDF5F1] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#20B2AA]"
            aria-label={isTamil ? 'சிறிதாக்கவும் (Zoom out)' : 'Zoom Out'}
            title={isTamil ? 'சிறிதாக்கவும்' : 'Zoom Out'}
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleRotate}
            className="p-1.5 rounded-lg text-[#145B59] hover:bg-[#DDF5F1] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#20B2AA]"
            aria-label={isTamil ? 'சுழற்றவும் (Rotate 90°)' : 'Rotate 90°'}
            title={isTamil ? 'சுழற்றவும்' : 'Rotate'}
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 rounded-lg text-[#145B59] hover:bg-[#DDF5F1] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#20B2AA]"
            aria-label={isTamil ? 'இயல்பு நிலைக்கு மீட்டமைக்கவும்' : 'Reset View'}
            title={isTamil ? 'மீட்டமைக்கவும்' : 'Reset'}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Anatomical Illustration Canvas with CSS Transforms */}
        <div
          className="relative w-full h-full transition-transform duration-500 ease-out flex items-center justify-center"
          style={{
            transform: `scale(${zoomLevel}) rotate(${rotationAngle}deg)`,
          }}
        >
          <Image
            src={imageSrc}
            alt={isTamil ? anatomyData.titleTa : anatomyData.titleEn}
            fill
            priority
            className="object-contain p-4 sm:p-8"
            sizes="(max-width: 1024px) 100vw, 80vw"
          />

          {/* Interactive Anatomical Pins / Callouts */}
          {anatomyData.callouts.map((pin, index) => (
            <div
              key={index}
              style={{
                left: `${pin.positionPercent.x}%`,
                top: `${pin.positionPercent.y}%`,
                transform: `translate(-50%, -50%) rotate(${-rotationAngle}deg)`,
              }}
              className="absolute z-20"
            >
              <button
                type="button"
                onClick={() => setActiveCallout(activeCallout === index ? null : index)}
                aria-label={isTamil ? pin.labelTa : pin.labelEn}
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#20B2AA] ${
                  activeCallout === index
                    ? 'bg-[#145B59] text-white scale-125 ring-4 ring-[#20B2AA]/40'
                    : 'bg-[#20B2AA] text-white hover:scale-115'
                }`}
              >
                {index + 1}
              </button>
            </div>
          ))}
        </div>

        {/* Status Chip (Honest statement about 3D vs High-Res 2D Cross Section) */}
        <div className="absolute bottom-3 left-3 z-20">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl liquid-glass-lens text-[11px] font-bold text-[#145B59] shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#20B2AA]" />
            <span>
              {isTamil
                ? 'துல்லிய மருத்துவ உடற்கூறியல் ஆய்வு'
                : 'Medical Anatomical Cross-Section'}
            </span>
          </span>
        </div>
      </div>

      {/* 3. Anatomical Breakdown Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 relative z-10">
        {anatomyData.callouts.map((item, index) => {
          const isActive = activeCallout === index;
          return (
            <div
              key={index}
              onClick={() => setActiveCallout(isActive ? null : index)}
              className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 border ${
                isActive
                  ? 'liquid-glass-primary border-[#20B2AA] shadow-sm scale-[1.02]'
                  : 'liquid-glass-secondary border-[#C8E7E3]/70 hover:border-[#20B2AA]/50'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-black ${
                    isActive ? 'bg-[#145B59] text-white' : 'bg-[#20B2AA] text-white'
                  }`}
                >
                  {index + 1}
                </span>
                <h4 className="text-sm font-bold text-[#145B59]">
                  {isTamil ? item.labelTa : item.labelEn}
                </h4>
              </div>
              <p className="text-xs text-[#587477] leading-relaxed">
                {isTamil ? item.descTa : item.descEn}
              </p>
            </div>
          );
        })}
      </div>

      {/* 4. Transparency & Clinical Provenance Notice */}
      <div className="p-4 rounded-2xl liquid-glass-secondary flex items-start gap-3 text-xs text-[#587477] relative z-10 border border-[#C8E7E3]/60">
        <ShieldCheck className="w-4 h-4 text-[#20B2AA] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {isTamil
            ? 'உடற்கூறியல் விளக்கக் குறிப்பு: இப்பக்கத்தில் உள்ள வரைபடங்கள் நோயாளிகளின் புரிதலுக்கான வரைவு நிலையிலுள்ள கல்வி மாதிரிகளாகும் (Draft). இது தனிநபர் மருத்துவ சிகிச்சைக்கு மாற்றாகாது.'
            : 'Anatomical Guidance Notice: These cross-sectional visualizations represent educational clinical drafts designed to support patient understanding. Interactive WebGL three-dimensional mesh models remain subject to institutional medical review.'}
        </p>
      </div>
    </LiquidGlassSurface>
  );
}
