// apps/web/src/app/not-found.tsx
// DentalVis — Accessible, Responsive 404 Not Found Page with Liquid Glass Theme
// Architecture Baseline v1.9.1 — Sprint 4 Polish

'use client';

import React from 'react';
import Link from 'next/link';
import { Container, Button, LiquidGlassSurface } from '@dentalvis/ui';
import { Compass, Home, HelpCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function NotFound() {
  const { language } = useLanguage();
  const isTamil = language === 'ta';

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 relative overflow-hidden">
      {/* Background Soft Optical Ambience */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#BFE9E2]/50 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#20B2AA]/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <Container>
        <LiquidGlassSurface
          variant="primary"
          specular
          refractiveRim
          className="max-w-xl mx-auto p-8 sm:p-12 text-center space-y-6 shadow-md"
        >
          <div className="w-16 h-16 rounded-3xl bg-[#20B2AA]/15 text-[#20B2AA] flex items-center justify-center mx-auto shadow-xs">
            <HelpCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold text-[#145B59] bg-[#DDF5F1]">
              404 • {isTamil ? 'பக்கம் கிடைக்கவில்லை' : 'Page Not Found'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#145B59] tracking-tight">
              {isTamil ? 'தேடப்பட்ட பக்கம் கிடைக்கவில்லை' : 'Requested Page Not Found'}
            </h1>
            <p className="text-sm sm:text-base text-[#587477] leading-relaxed max-w-md mx-auto">
              {isTamil
                ? 'நீங்கள் தேடும் சிகிச்சை வழிகாட்டி அல்லது பக்கம் மாற்றப்பட்டிருக்கலாம் அல்லது கிடைக்காமல் இருக்கலாம்.'
                : 'The educational dental guide or URL you requested does not exist or may have been moved.'}
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/explore" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="md"
                className="w-full sm:w-auto gap-2 font-bold justify-center"
              >
                <Compass className="w-4 h-4" />
                <span>{isTamil ? 'சிகிச்சைகளை காண்க' : 'Explore Treatments'}</span>
              </Button>
            </Link>
            <Link href="/home" className="w-full sm:w-auto">
              <Button
                variant="glass"
                size="md"
                className="w-full sm:w-auto gap-2 font-bold justify-center text-[#145B59]"
              >
                <Home className="w-4 h-4 text-[#20B2AA]" />
                <span>{isTamil ? 'முகப்புக்குச் செல்' : 'Return Home'}</span>
              </Button>
            </Link>
          </div>
        </LiquidGlassSurface>
      </Container>
    </div>
  );
}
