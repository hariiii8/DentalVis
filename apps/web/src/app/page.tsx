'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Badge, GlassSurface, GlassFloatingElement } from '@dentalvis/ui';
import { Sparkles, Compass, ShieldCheck, HeartPulse, Layers, Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { DentalVisLogo } from '@/components/DentalVisLogo';

export default function WelcomePage() {
  const { language, toggleLanguage } = useLanguage();
  const isTamil = language === 'ta';

  return (
    <div className="h-[100svh] max-h-[100svh] w-full overflow-hidden relative bg-gradient-to-br from-[#F5FAF9] via-[#E8F7F6] to-[#DCEFF5] text-[#164B50] flex flex-col justify-between selection:bg-[#BFE9E2] selection:text-[#145B59] box-border">
      {/* 1. LAYERED AMBIENT BACKGROUND FIELDS */}
      <div className="absolute -top-24 -left-24 w-[28rem] h-[28rem] rounded-full bg-[#BFE9E2]/50 blur-3xl pointer-events-none -z-10 animate-float-slow" />
      <div className="absolute top-1/4 -right-24 w-[30rem] h-[30rem] rounded-full bg-[#20B2AA]/20 blur-3xl pointer-events-none -z-10 animate-float-gentle" />
      <div className="absolute -bottom-24 left-1/3 w-[34rem] h-[34rem] rounded-full bg-[#DCEFF5]/70 blur-3xl pointer-events-none -z-10" />

      {/* 2. COMPACT TOP BRANDING BAR (Strictly NO Navigation) */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-8 pt-4 sm:pt-6 flex items-center justify-between shrink-0">
        <GlassSurface intensity="subtle" className="px-4 py-2 rounded-2xl flex items-center shadow-xs">
          <DentalVisLogo variant="full" size="sm" linkHref={null} tagline={isTamil ? 'தெளிவான பல் மருத்துவக் கல்வி' : 'Visual Dental Education'} />
        </GlassSurface>

        <Button
          variant="glass"
          size="sm"
          onClick={toggleLanguage}
          aria-label={isTamil ? 'Switch to English' : 'தமிழுக்கு மாறவும்'}
          className="gap-2 font-bold px-3.5 py-1.5 rounded-xl text-xs shadow-xs"
        >
          <Globe className="w-3.5 h-3.5 text-[#20B2AA]" />
          <span>{isTamil ? 'English' : 'தமிழ்'}</span>
        </Button>
      </header>

      {/* 3. HERO & VISUAL STORYTELLING: Two-Column Layout Fitted in Viewport */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 py-2 sm:py-4 flex-1 flex items-center overflow-hidden">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
          {/* Left Column: Purpose & Distinct "Get Started →" (Exactly ONE arrow) */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full liquid-glass-lens text-[#145B59] text-[11px] sm:text-xs font-bold tracking-wide shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#20B2AA]" />
              <span>
                {isTamil
                  ? 'இருமொழி நோயாளி கல்வித் தளம் (English & தமிழ்)'
                  : 'Bilingual Patient Education Platform (English & தமிழ்)'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-black text-[#145B59] tracking-tight leading-[1.12]">
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

            <p className="text-sm sm:text-base text-[#587477] leading-relaxed max-w-xl font-normal">
              {isTamil
                ? 'டென்டல்விஸ் மூலம் பல் சிகிச்சை முறைகள், வாய் உடற்கூறியல் மற்றும் சிகிச்சை வழிகாட்டல்களை அச்சமின்றி, எளிய காட்சிப் பதிவுகள் மூலம் அறிந்து கொள்ளலாம்.'
                : 'DentalVis demystifies dental procedures, oral health information, and dental anatomy through rich, accessible visual guides. No medical jargon, no intimidation—just genuine clarity before your appointment.'}
            </p>

            {/* Primary Get Started CTA Button with exactly ONE right-facing arrow */}
            <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link href="/home" className="group focus:outline-none">
                <Button
                  size="lg"
                  variant="primary"
                  className="w-full sm:w-auto text-base sm:text-lg px-8 py-3.5 font-bold shadow-[0_10px_28px_rgba(32,178,170,0.38)]"
                >
                  {isTamil ? 'தொடங்குங்கள் →' : 'Get Started →'}
                </Button>
              </Link>
              <div className="text-xs text-[#587477] flex items-center gap-1.5 font-medium px-2">
                <ShieldCheck className="w-4 h-4 text-[#20B2AA]" />
                <span>{isTamil ? '100% இலவச பொது அணுகல்' : 'No sign-up or registration needed'}</span>
              </div>
            </div>

            {/* Platform Highlights in Compact Translucent Liquid Glass Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              <div className="liquid-glass-secondary p-2.5 sm:p-3 rounded-2xl text-center hover:translate-y-[-2px] transition-all">
                <ShieldCheck className="w-4 h-4 text-[#20B2AA] mx-auto mb-1" />
                <span className="text-[11px] font-bold text-[#145B59] block">
                  {isTamil ? 'சிகிச்சை விளக்கம்' : 'Dental Guides'}
                </span>
                <span className="text-[10px] text-[#587477]">
                  {isTamil ? 'துல்லிய அறிவு' : 'Plain language'}
                </span>
              </div>

              <div className="liquid-glass-secondary p-2.5 sm:p-3 rounded-2xl text-center hover:translate-y-[-2px] transition-all">
                <Layers className="w-4 h-4 text-[#20B2AA] mx-auto mb-1" />
                <span className="text-[11px] font-bold text-[#145B59] block">
                  {isTamil ? '3D உடற்கூறியல்' : 'Oral Anatomy'}
                </span>
                <span className="text-[10px] text-[#587477]">
                  {isTamil ? 'உள் கட்டமைப்பு' : 'Cross-sections'}
                </span>
              </div>

              <div className="liquid-glass-secondary p-2.5 sm:p-3 rounded-2xl text-center hover:translate-y-[-2px] transition-all">
                <HeartPulse className="w-4 h-4 text-[#20B2AA] mx-auto mb-1" />
                <span className="text-[11px] font-bold text-[#145B59] block">
                  {isTamil ? 'அறிகுறிகள்' : 'Oral Health'}
                </span>
                <span className="text-[10px] text-[#587477]">
                  {isTamil ? 'விழிப்புணர்வு' : 'Patient comfort'}
                </span>
              </div>

              <div className="liquid-glass-secondary p-2.5 sm:p-3 rounded-2xl text-center hover:translate-y-[-2px] transition-all">
                <Globe className="w-4 h-4 text-[#20B2AA] mx-auto mb-1" />
                <span className="text-[11px] font-bold text-[#145B59] block">
                  {isTamil ? 'இருமொழி' : 'Bilingual'}
                </span>
                <span className="text-[10px] text-[#587477]">English & தமிழ்</span>
              </div>
            </div>
          </div>

          {/* Right Column: Layered Apple-Style Liquid Glass Composition */}
          <div className="lg:col-span-5 relative hidden sm:block">
            {/* Ambient Optical Depth Field */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#BFE9E2]/60 via-[#20B2AA]/25 to-[#DCEFF5]/80 rounded-3xl blur-2xl transform -rotate-3 scale-95" />

            {/* Main Central Liquid Glass Panel */}
            <div className="liquid-glass-primary rounded-3xl p-5 sm:p-6 space-y-4 isolate relative shadow-md">
              <div className="liquid-refractive-rim absolute inset-0 rounded-3xl pointer-events-none" />
              <div className="liquid-specular-sheen absolute inset-0 rounded-3xl pointer-events-none" />

              {/* Header inside glass */}
              <div className="flex items-center justify-between pb-3 border-b border-[#C8E7E3]/60 relative z-10">
                <div className="flex items-center gap-2.5">
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
                    <p className="text-[10px] text-[#587477]">
                      {isTamil ? 'பல் அடுக்குகள் & நரம்பு பாதை' : 'Enamel, Dentin & Pulp Chamber'}
                    </p>
                  </div>
                </div>

                <Badge variant="mint" className="text-[10px] font-bold liquid-glass-lens">
                  {isTamil ? 'கல்வி மாதிரி' : 'Interactive'}
                </Badge>
              </div>

              {/* Medical Artwork in Powder-Blue & Seafoam Optical Frame */}
              <div className="relative aspect-[16/10] max-h-56 rounded-2xl overflow-hidden bg-gradient-to-br from-[#F5FAF9] to-[#DCEFF5]/60 border border-white/80 shadow-inner relative z-10">
                <Image
                  src="/images/procedures/root-canal-treatment.svg"
                  alt="Tooth Anatomy Cross Section"
                  fill
                  priority
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>

              {/* Floating Mini Glass Overlay */}
              <div className="p-3 rounded-2xl liquid-glass-secondary flex items-center justify-between relative z-10">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#20B2AA]">
                    {isTamil ? 'நோயாளி அமைதி' : 'Calm Preparation'}
                  </span>
                  <p className="text-[11px] font-semibold text-[#145B59]">
                    {isTamil ? 'சிகிச்சையை முன்கூட்டியே அறியலாம்' : 'Preview step-by-step care before your visit'}
                  </p>
                </div>
                <Link href="/home">
                  <Button size="sm" variant="mint" className="text-xs font-bold px-3 py-1.5 shadow-xs">
                    {isTamil ? 'தொடங்குக →' : 'Enter →'}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Floating Decorative Liquid Glass Elements */}
            <GlassFloatingElement animation="slow" className="hidden xl:flex absolute -top-4 -right-4 shadow-md text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-[#20B2AA]" />
              <span>{isTamil ? 'இலவச பொது அணுகல்' : 'Open Patient Access'}</span>
            </GlassFloatingElement>

            <GlassFloatingElement animation="gentle" className="hidden xl:flex absolute -bottom-4 -left-4 shadow-md text-[11px]">
              <Compass className="w-3.5 h-3.5 text-[#20B2AA]" />
              <span>{isTamil ? '6 முக்கிய பிரிவுகள்' : '6 Treatment Categories'}</span>
            </GlassFloatingElement>
          </div>
        </div>
      </main>

      {/* 4. CLEAN MINIMAL FOOTER (Strictly no navigation links) */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 py-3 text-center text-[11px] text-[#587477] shrink-0">
        <GlassSurface intensity="subtle" className="py-1.5 px-4 inline-block rounded-xl mx-auto shadow-xs">
          <p>© {new Date().getFullYear()} DentalVis 2.0. Visual dental guides are strictly educational.</p>
        </GlassSurface>
      </footer>
    </div>
  );
}
