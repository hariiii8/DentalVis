'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Badge } from '@dentalvis/ui';
import { ArrowRight, Sparkles, Compass, ShieldCheck, HeartPulse, Layers, Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { DentalVisLogo } from '@/components/DentalVisLogo';

export default function WelcomePage() {
  const { language, toggleLanguage } = useLanguage();
  const isTamil = language === 'ta';

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#EAF5F8] via-[#D9F0ED]/40 to-[#EAF5F8] text-[#164B50] flex flex-col justify-between selection:bg-[#A4E6D5] selection:text-[#164B50]">
      {/* 1. AMBIENT BACKGROUND GLOWS & FLOATING SHAPES */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#A4E6D5]/40 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-[32rem] h-[32rem] rounded-full bg-[#247F83]/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 left-1/3 w-[36rem] h-[36rem] rounded-full bg-[#D9F0ED]/60 blur-3xl pointer-events-none" />

      {/* 2. TOP WELCOME BAR (Brand & Language Selector only, zero regular navigation) */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-8 pt-8 flex items-center justify-between">
        <DentalVisLogo variant="full" size="md" linkHref={null} tagline={isTamil ? 'தெளிவான பல் மருத்துவக் கல்வி' : 'Visual Dental Education'} />

        <Button
          variant="glass"
          size="sm"
          onClick={toggleLanguage}
          aria-label={isTamil ? 'Switch to English' : 'தமிழுக்கு மாறவும்'}
          className="gap-2 font-bold px-4 py-2"
        >
          <Globe className="w-4 h-4 text-[#247F83]" />
          <span>{isTamil ? 'English' : 'தமிழ்'}</span>
        </Button>
      </header>

      {/* 3. HERO & VISUAL STORYTELLING COMPOSITION */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 py-12 lg:py-16 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Purpose & Get Started CTA */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel-subtle text-[#247F83] text-xs font-bold tracking-wide shadow-xs">
              <Sparkles className="w-4 h-4 text-[#247F83]" />
              <span>
                {isTamil
                  ? 'இருமொழி நோயாளி கல்வித் தளம் (English & தமிழ்)'
                  : 'Bilingual Patient Education Platform (English & தமிழ்)'}
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-[#164B50] tracking-tight leading-[1.12]">
              {isTamil ? (
                <>
                  பல் மருத்துவக் கவனிப்பை <br />
                  <span className="bg-gradient-to-r from-[#247F83] via-[#2DD4BF] to-[#164B50] bg-clip-text text-transparent">
                    தெளிவான அமைதியுடன்
                  </span>{' '}
                  புரிந்துகொள்ளுங்கள்.
                </>
              ) : (
                <>
                  Understand dental care with{' '}
                  <span className="bg-gradient-to-r from-[#247F83] via-[#2DD4BF] to-[#164B50] bg-clip-text text-transparent">
                    crystal-clear confidence
                  </span>
                  .
                </>
              )}
            </h1>

            <p className="text-lg sm:text-xl text-[#64777C] leading-relaxed max-w-2xl font-normal">
              {isTamil
                ? 'டென்டல்விஸ் மூலம் பல் சிகிச்சை முறைகள், வாய் உடற்கூறியல் மற்றும் சிகிச்சை வழிகாட்டல்களை அச்சமின்றி, எளிய காட்சிப் பதிவுகள் மூலம் அறிந்து கொள்ளலாம்.'
                : 'DentalVis demystifies dental procedures, oral health information, and dental anatomy through rich, accessible visual guides. No medical jargon, no intimidation—just genuine clarity before your appointment.'}
            </p>

            {/* Primary Get Started CTA Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link href="/home" className="group">
                <Button size="xl" variant="primary" className="w-full sm:w-auto gap-3 text-lg px-8 py-4 shadow-[0_12px_28px_rgba(36,127,131,0.35)]">
                  <span>{isTamil ? 'தொடங்குங்கள் →' : 'Get Started →'}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Platform Highlights Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-[#DCEAEC]">
              <div className="p-3 rounded-2xl glass-panel-subtle text-center">
                <ShieldCheck className="w-5 h-5 text-[#247F83] mx-auto mb-1.5" />
                <span className="text-xs font-bold text-[#164B50] block">
                  {isTamil ? 'சிகிச்சை விளக்கம்' : 'Dental Guides'}
                </span>
                <span className="text-[10px] text-[#64777C]">
                  {isTamil ? 'துல்லிய அறிவு' : 'Plain language'}
                </span>
              </div>

              <div className="p-3 rounded-2xl glass-panel-subtle text-center">
                <Layers className="w-5 h-5 text-[#247F83] mx-auto mb-1.5" />
                <span className="text-xs font-bold text-[#164B50] block">
                  {isTamil ? '3D உடற்கூறியல்' : 'Oral Anatomy'}
                </span>
                <span className="text-[10px] text-[#64777C]">
                  {isTamil ? 'உள் கட்டமைப்பு' : 'Cross-sections'}
                </span>
              </div>

              <div className="p-3 rounded-2xl glass-panel-subtle text-center">
                <HeartPulse className="w-5 h-5 text-[#247F83] mx-auto mb-1.5" />
                <span className="text-xs font-bold text-[#164B50] block">
                  {isTamil ? 'அறிகுறிகள்' : 'Oral Health'}
                </span>
                <span className="text-[10px] text-[#64777C]">
                  {isTamil ? 'விழிப்புணர்வு' : 'Patient comfort'}
                </span>
              </div>

              <div className="p-3 rounded-2xl glass-panel-subtle text-center">
                <Globe className="w-5 h-5 text-[#247F83] mx-auto mb-1.5" />
                <span className="text-xs font-bold text-[#164B50] block">
                  {isTamil ? 'இருமொழி' : 'Bilingual'}
                </span>
                <span className="text-[10px] text-[#64777C]">English & தமிழ்</span>
              </div>
            </div>
          </div>

          {/* Right Column: Layered Apple-Style Glass Composition */}
          <div className="lg:col-span-5 relative">
            {/* Ambient Background Behind Cards */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#A4E6D5]/50 to-[#247F83]/20 rounded-3xl blur-2xl transform -rotate-2 scale-95" />

            {/* Main Central Glass Panel */}
            <div className="relative glass-panel-glow p-6 sm:p-8 rounded-3xl space-y-6">
              {/* Header inside glass */}
              <div className="flex items-center justify-between pb-4 border-b border-white/60">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#247F83] to-[#164B50] p-2 flex items-center justify-center shadow-md">
                    <Image
                      src="/brand/logo-mark.svg"
                      alt="DentalVis Mark"
                      width={36}
                      height={36}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#164B50]">
                      {isTamil ? 'காட்சி ஆய்வு' : 'Visual Inspection'}
                    </h3>
                    <p className="text-xs text-[#64777C]">
                      {isTamil ? 'பல் அடுக்குகள் & நரம்பு பாதை' : 'Enamel, Dentin & Pulp Chamber'}
                    </p>
                  </div>
                </div>

                <Badge variant="mint" className="text-[11px] font-bold">
                  {isTamil ? 'கல்வி மாதிரி' : 'Interactive'}
                </Badge>
              </div>

              {/* Central Medical Artwork Presentation */}
              <div className="relative aspect-[16/11] rounded-2xl overflow-hidden bg-gradient-to-br from-[#EAF5F8] to-[#D9F0ED]/70 border border-white shadow-inner">
                <Image
                  src="/images/procedures/root-canal-treatment.svg"
                  alt="Tooth Anatomy Cross Section"
                  fill
                  priority
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>

              {/* Floating Mini Glass Card Overlay */}
              <div className="p-4 rounded-2xl bg-white/75 backdrop-blur-xl border border-white shadow-sm flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#247F83]">
                    {isTamil ? 'நோயாளி பயம் நீக்குதல்' : 'Calm Preparation'}
                  </span>
                  <p className="text-xs font-semibold text-[#164B50]">
                    {isTamil ? 'ஒவ்வொரு சிகிச்சையையும் முன்கூட்டியே காண்க' : 'Preview step-by-step care before you go'}
                  </p>
                </div>
                <Link href="/home">
                  <Button size="sm" variant="mint" className="text-xs gap-1">
                    <span>{isTamil ? 'தொடங்குக' : 'Enter'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Floating Decorative Glass Pill 1 */}
            <div className="hidden sm:flex items-center gap-2 absolute -top-5 -right-5 glass-panel py-2 px-4 rounded-full text-xs font-bold text-[#164B50] shadow-md animate-float-slow">
              <Sparkles className="w-4 h-4 text-[#247F83]" />
              <span>{isTamil ? '100% இலவச பொது அணுகல்' : 'Open Patient Access'}</span>
            </div>

            {/* Floating Decorative Glass Pill 2 */}
            <div className="hidden sm:flex items-center gap-2 absolute -bottom-5 -left-5 glass-panel py-2 px-4 rounded-full text-xs font-bold text-[#164B50] shadow-md animate-float-gentle">
              <Compass className="w-4 h-4 text-[#247F83]" />
              <span>{isTamil ? '6 முக்கிய சிகிச்சை பிரிவுகள்' : '6 Treatment Categories'}</span>
            </div>
          </div>
        </div>
      </main>

      {/* 4. CLEAN MINIMAL BOTTOM BAR (Zero navigation links) */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 py-6 text-center text-xs text-[#64777C] border-t border-[#DCEAEC]/70">
        <p>© {new Date().getFullYear()} DentalVis 2.0. Visual dental guides are strictly educational.</p>
      </footer>
    </div>
  );
}
