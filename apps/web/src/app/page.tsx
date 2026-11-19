'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Badge } from '@dentalvis/ui';
import { Sparkles, ShieldCheck, Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { DentalVisLogo } from '@/components/DentalVisLogo';

export default function WelcomePage() {
  const { language, toggleLanguage } = useLanguage();
  const isTamil = language === 'ta';

  return (
    <div className="min-h-screen lg:h-[100svh] lg:max-h-[100svh] w-full overflow-x-hidden lg:overflow-hidden relative bg-gradient-to-br from-[#F5FAF9] via-[#E8F7F6] to-[#DCEFF5] text-[#164B50] flex flex-col justify-between selection:bg-[#BFE9E2] selection:text-[#145B59]">
      {/* 1. AMBIENT BACKGROUND GLOWS (Non-intrusive) */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#BFE9E2]/40 blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 -right-32 w-[30rem] h-[30rem] rounded-full bg-[#20B2AA]/15 blur-3xl pointer-events-none -z-10" />
      <div className="absolute -bottom-32 left-1/3 w-[32rem] h-[32rem] rounded-full bg-[#DCEFF5]/60 blur-3xl pointer-events-none -z-10" />

      {/* 2. TOP BRANDING BAR (Strictly NO Navigation) */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 pt-6 sm:pt-8 flex items-center justify-between shrink-0">
        <DentalVisLogo
          variant="full"
          size="md"
          linkHref={null}
          tagline={isTamil ? 'தெளிவான பல் மருத்துவக் கல்வி' : 'Visual Dental Education'}
        />

        <Button
          variant="glass"
          size="sm"
          onClick={toggleLanguage}
          aria-label={isTamil ? 'Switch to English' : 'தமிழுக்கு மாறவும்'}
          className="gap-2 font-bold px-4 py-2 rounded-xl text-xs liquid-glass-lens shadow-xs border-none"
        >
          <Globe className="w-3.5 h-3.5 text-[#20B2AA]" />
          <span>{isTamil ? 'English' : 'தமிழ்'}</span>
        </Button>
      </header>

      {/* 3. MAIN HERO COMPOSITION (Clean, spacious, uncompressed 2-column layout) */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 py-6 lg:py-8 flex-1 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* LEFT COLUMN: Clean typography and prominent Get Started CTA */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass-lens text-[#145B59] text-xs font-bold tracking-wide shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#20B2AA]" />
              <span>
                {isTamil
                  ? 'நோயாளி கல்வி தளம் (English & தமிழ்)'
                  : 'Bilingual Patient Education (English & தமிழ்)'}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black text-[#145B59] tracking-tight leading-[1.12]">
              {isTamil ? (
                <>
                  பல் மருத்துவக் கவனிப்பை <br />
                  <span className="bg-gradient-to-r from-[#20B2AA] via-[#145B59] to-[#20B2AA] bg-clip-text text-transparent">
                    தெளிவான அமைதியுடன்
                  </span>{' '}
                  புரிந்துகொள்ளுங்கள்.
                </>
              ) : (
                <>
                  Understand dental care with{' '}
                  <span className="bg-gradient-to-r from-[#20B2AA] via-[#145B59] to-[#20B2AA] bg-clip-text text-transparent">
                    crystal-clear confidence
                  </span>
                  .
                </>
              )}
            </h1>

            <p className="text-base sm:text-lg text-[#587477] leading-relaxed max-w-xl font-normal">
              {isTamil
                ? 'டென்டல்விஸ் மூலம் பல் சிகிச்சை முறைகள், வாய் உடற்கூறியல் மற்றும் சிகிச்சை வழிகாட்டல்களை அச்சமின்றி, எளிய காட்சிப் பதிவுகள் மூலம் அறிந்து கொள்ளலாம்.'
                : 'DentalVis demystifies dental procedures, oral health information, and dental anatomy through rich, accessible visual guides. No medical jargon, no intimidation—just genuine clarity before your appointment.'}
            </p>

            {/* Primary Get Started Action */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link href="/home" className="group focus:outline-none">
                <Button
                  size="xl"
                  variant="primary"
                  className="w-full sm:w-auto text-base sm:text-lg px-9 py-4 font-bold shadow-[0_12px_28px_rgba(32,178,170,0.38)]"
                >
                  {isTamil ? 'தொடங்குங்கள் →' : 'Get Started →'}
                </Button>
              </Link>
              <div className="text-xs text-[#587477] flex items-center gap-1.5 font-medium px-2">
                <ShieldCheck className="w-4 h-4 text-[#20B2AA]" />
                <span>{isTamil ? '100% இலவச பொது நோயாளி அணுகல்' : 'Open patient access • No registration'}</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Dedicated Liquid Glass Artwork Card (No conflicting overlays) */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            {/* Ambient depth glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#BFE9E2]/50 via-[#20B2AA]/20 to-[#DCEFF5]/70 rounded-3xl blur-2xl transform -rotate-2 scale-95" />

            {/* Elegant Primary Liquid Glass Presentation Panel */}
            <div className="liquid-glass-primary rounded-3xl p-6 sm:p-7 space-y-4 isolate relative shadow-md w-full max-w-md">
              <div className="liquid-refractive-rim absolute inset-0 rounded-3xl pointer-events-none" />
              <div className="liquid-specular-sheen absolute inset-0 rounded-3xl pointer-events-none" />

              {/* Card Header inside glass */}
              <div className="flex items-center justify-between pb-3 border-b border-[#C8E7E3]/60 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#20B2AA] to-[#145B59] p-1.5 flex items-center justify-center shadow-xs">
                    <Image
                      src="/brand/logo-mark.svg"
                      alt="DentalVis Mark"
                      width={28}
                      height={28}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-[#145B59]">
                      {isTamil ? 'காட்சி ஆய்வு' : 'Visual Inspection'}
                    </h3>
                    <p className="text-[11px] text-[#587477]">
                      {isTamil ? 'பல் அடுக்குகள் & நரம்பு பாதை' : 'Enamel, Dentin & Pulp Chamber'}
                    </p>
                  </div>
                </div>

                <Badge variant="mint" className="text-[11px] font-bold liquid-glass-lens">
                  {isTamil ? 'கல்வி மாதிரி' : 'Interactive'}
                </Badge>
              </div>

              {/* Medical Artwork Viewport */}
              <div className="relative aspect-[16/11] w-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#F5FAF9] to-[#DCEFF5]/60 border border-white/80 shadow-inner relative z-10">
                <Image
                  src="/images/procedures/root-canal-treatment.svg"
                  alt="Tooth Anatomy Cross Section"
                  fill
                  priority
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>

              {/* Informative Footer Banner */}
              <div className="p-3.5 rounded-2xl liquid-glass-secondary flex items-center justify-between relative z-10">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#20B2AA]">
                    {isTamil ? 'நோயாளி அமைதி' : 'Calm Preparation'}
                  </span>
                  <p className="text-xs font-semibold text-[#145B59]">
                    {isTamil ? 'சிகிச்சையை முன்கூட்டியே அறியலாம்' : 'Preview step-by-step care before you go'}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* 4. CLEAN MINIMAL FOOTER (Strictly no navigation links) */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 py-4 text-center text-xs text-[#587477] shrink-0">
        <p>© {new Date().getFullYear()} DentalVis 2.0. Visual dental guides are strictly educational.</p>
      </footer>
    </div>
  );
}
