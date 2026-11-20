// apps/web/src/components/3d/ProcedureAnatomy3D.tsx
// Public entry point for procedure 3D anatomy viewer with WebGL check, loading state, and 2D fallback

'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Badge, LiquidGlassSurface } from '@dentalvis/ui';
import { ShieldAlert, Sparkles, AlertCircle, Eye } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useWebGLSupport } from './hooks/useWebGLSupport';
import { useAnatomyViewerState } from './hooks/useAnatomyViewerState';
import { getProcedure3DConfig } from './procedure3DRegistry';
import { Procedure3DConfig } from './types';
import { AnatomyControlsOverlay } from './AnatomyControlsOverlay';
import { ProcedureAnatomyViewer } from '../ProcedureAnatomyViewer';

// Dynamic browser-only import of R3F Canvas to prevent SSR hydration mismatches
const ProcedureAnatomyCanvas = dynamic(
  () => import('./ProcedureAnatomyCanvas').then((mod) => mod.ProcedureAnatomyCanvas),
  {
    ssr: false,
    loading: () => <CanvasLoadingSkeleton />,
  }
);

function CanvasLoadingSkeleton() {
  return (
    <div className="w-full h-full min-h-[460px] flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#F5FAF9] via-[#E8F7F6]/60 to-[#DCEFF5]/50 rounded-3xl animate-pulse">
      <div className="w-12 h-12 rounded-2xl liquid-glass-lens flex items-center justify-center text-[#20B2AA] mb-4 shadow-sm">
        <Sparkles className="w-6 h-6 animate-spin" />
      </div>
      <p className="text-sm font-bold text-[#145B59]">Initializing 3D Anatomy Engine...</p>
      <p className="text-xs text-[#587477] mt-1">Calibrating WebGL Shaders & Studio Lights</p>
    </div>
  );
}

interface ProcedureAnatomy3DProps {
  procedureSlug: string;
  imageSrc?: string;
}

export function ProcedureAnatomy3D({ procedureSlug, imageSrc }: ProcedureAnatomy3DProps) {
  const { language } = useLanguage();
  const isTamil = language === 'ta';

  const resolvedImageSrc = imageSrc || `/images/procedures/${procedureSlug}.svg`;

  const webgl = useWebGLSupport();
  const config: Procedure3DConfig | null = getProcedure3DConfig(procedureSlug);
  const state = useAnatomyViewerState(config || ({} as Procedure3DConfig));

  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [runtimeError, setRuntimeError] = useState<string | null>(null);

  // If no 3D configuration exists for this procedure, render the existing 2D viewer safely
  if (!config) {
    return <ProcedureAnatomyViewer procedureSlug={procedureSlug} imageSrc={resolvedImageSrc} lang={language} />;
  }

  // If WebGL is unsupported or runtime WebGL failure occurred, fall back to 2D viewer with clear indicator
  const hasWebGLFailure = !webgl.isChecking && !webgl.isSupported;
  const isShowing2DFallback = hasWebGLFailure || runtimeError !== null || (viewMode as string) === '2d';

  if (isShowing2DFallback) {
    return (
      <div className="space-y-4">
        {hasWebGLFailure && (
          <div className="p-3.5 rounded-2xl liquid-glass-secondary border border-amber-200/80 flex items-center gap-3 text-xs text-[#587477]">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              {isTamil
                ? 'உங்கள் உலாவியில் 3D வன்பொருள் முடுக்கம் முடக்கப்பட்டுள்ளது. 2D கல்வி வரைபடம் காட்டப்படுகிறது.'
                : '3D WebGL acceleration is not available in your browser. Standard 2D educational illustration is displayed below.'}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between pb-2">
          <Badge variant="mint" className="text-xs font-semibold liquid-glass-lens">
            {isTamil ? '2D உடற்கூறியல் பார்வை (மாற்று முறை)' : '2D Educational Illustration (Active Fallback)'}
          </Badge>
          {webgl.isSupported && (
            <button
              type="button"
              onClick={() => setViewMode('3d')}
              className="text-xs font-bold text-[#20B2AA] hover:underline flex items-center gap-1"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{isTamil ? '3D பார்வைக்கு மாறு' : 'Switch to 3D View'}</span>
            </button>
          )}
        </div>

        <ProcedureAnatomyViewer procedureSlug={procedureSlug} imageSrc={resolvedImageSrc} lang={language} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* View Mode Pill Switcher (3D vs 2D Fallback) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="mint" className="gap-1.5 text-xs font-semibold liquid-glass-lens">
            <Sparkles className="w-3.5 h-3.5 text-[#20B2AA]" />
            <span>{isTamil ? 'ஊடாடும் 3D உடற்கூறியல்' : 'Interactive 3D Anatomy'}</span>
          </Badge>
          {!config.isModelReady && (
            <span className="px-2.5 py-0.5 rounded-lg liquid-glass-lens text-[11px] font-bold text-[#145B59] border border-[#20B2AA]/30">
              {isTamil ? 'கட்டமைப்பு தயார் · மாதிரி இணைப்பு நிலுவை' : '3D Engine Online · Asset Pending'}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-2xl liquid-glass-lens">
          <button
            type="button"
            onClick={() => setViewMode('3d')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              viewMode === '3d'
                ? 'bg-[#145B59] text-white shadow-xs'
                : 'text-[#145B59] hover:bg-white/60'
            }`}
          >
            3D
          </button>
          <button
            type="button"
            onClick={() => setViewMode('2d')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              (viewMode as string) === '2d'
                ? 'bg-[#145B59] text-white shadow-xs'
                : 'text-[#145B59] hover:bg-white/60'
            }`}
          >
            2D
          </button>
        </div>
      </div>

      {/* 3D Canvas Container with Liquid Glass Frame */}
      <LiquidGlassSurface
        variant="primary"
        specular
        refractiveRim
        className="relative aspect-[16/11] sm:aspect-[16/10] w-full rounded-3xl overflow-hidden shadow-lg border border-white/80 isolate min-h-[460px]"
      >
        {/* React Three Fiber Canvas */}
        <ProcedureAnatomyCanvas
          config={config}
          state={state}
          lang={language}
          onError={(err) => setRuntimeError(err.message)}
        />

        {/* Liquid Glass HUD Overlay Controls */}
        <AnatomyControlsOverlay
          config={config}
          state={state}
          lang={language}
        />

        {/* Honest Model Preparation Banner (When GLB model is being authored) */}
        {!config.isModelReady && (
          <div className="absolute inset-x-4 bottom-16 sm:bottom-14 z-20 pointer-events-none">
            <div className="max-w-md mx-auto p-3.5 rounded-2xl liquid-glass-secondary border border-[#20B2AA]/40 text-center shadow-md pointer-events-auto">
              <p className="text-xs font-bold text-[#145B59]">
                {isTamil
                  ? '3D உடற்கூறியல் கட்டமைப்பு வெற்றிகரமாக இணைக்கப்பட்டுள்ளது'
                  : '3D Anatomy Engine & Controls Online'}
              </p>
              <p className="text-[11px] text-[#587477] mt-0.5">
                {isTamil
                  ? '7 அடுக்கு வேர் கால்வாய் மாதிரி (GLB) தயாரிப்பில் உள்ளது. 2D வரைபடத்தைக் காண மேலே உள்ள "2D" பொத்தானை அழுத்தவும்.'
                  : 'Multi-layer molar GLB asset is undergoing anatomical calibration. Click "2D" above to inspect the cross-sectional illustration.'}
              </p>
            </div>
          </div>
        )}
      </LiquidGlassSurface>

      {/* Clinical Reference Disclaimer */}
      <div className="p-3.5 rounded-2xl liquid-glass-secondary border border-[#C8E7E3]/60 flex items-start gap-2.5 text-xs text-[#587477]">
        <ShieldAlert className="w-4 h-4 text-[#20B2AA] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {isTamil
            ? 'கல்வி உடற்கூறியல் மாதிரி: இந்த 3D கட்டமைப்பு பொது நோயாளி புரிதலுக்காக மட்டுமே வடிவமைக்கப்பட்டுள்ளது. இது மருத்துவ நோயறிதல் அல்லது அறுவை சிகிச்சை வழிகாட்டி அல்ல. உங்கள் மருத்துவரிடம் தனிப்பட்ட ஆலோசனை பெறவும்.'
            : 'Educational 3D Anatomical Reference: This interactive system is designed to support patient understanding of general dental anatomy and procedural concepts. It is not diagnostic. Consult a licensed dental professional for personal clinical advice.'}
        </p>
      </div>
    </div>
  );
}
