'use client';

import React from 'react';
import Link from 'next/link';
import { Container, Button, Badge, LiquidGlassSurface } from '@dentalvis/ui';
import {
  Compass,
  Sparkles,
  ShieldCheck,
  HeartPulse,
  Layers,
  Clock,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function MainHomePage() {
  const { language } = useLanguage();
  const isTamil = language === 'ta';

  return (
    <div className="py-8 sm:py-12 space-y-16 selection:bg-[#BFE9E2] selection:text-[#145B59] relative overflow-hidden bg-[#F5FAF9]">
      {/* Dynamic Ambient Background Glows in Powder Blue, Misty Aqua & Sea Green */}
      <div className="absolute top-0 left-1/4 w-[38rem] h-[38rem] bg-gradient-to-br from-[#BFE9E2]/50 via-[#20B2AA]/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 -right-24 w-[36rem] h-[36rem] bg-gradient-to-bl from-[#DCEFF5]/80 via-[#20B2AA]/20 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-1/3 w-[32rem] h-[32rem] bg-[#DDF5F1]/60 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* 1. HERO SECTION: Welcoming Liquid Glass Portal Introduction */}
      <section className="relative pt-2 pb-6">
        <Container>
          <LiquidGlassSurface
            variant="primary"
            specular
            refractiveRim
            className="max-w-4xl mx-auto p-8 sm:p-12 text-center space-y-6 shadow-md"
          >
            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass-lens text-[#145B59] text-xs font-bold tracking-wide shadow-xs mx-auto">
                <Sparkles className="w-3.5 h-3.5 text-[#20B2AA]" />
                <span>{isTamil ? 'நோயாளி கல்வி தளம்' : 'Patient Visual Education Portal'}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#145B59] tracking-tight leading-[1.15]">
                {isTamil ? (
                  <>
                    பல் சிகிச்சைகள் & ஆரோக்கியம் பற்றிய{' '}
                    <span className="bg-gradient-to-r from-[#20B2AA] via-[#145B59] to-[#20B2AA] bg-clip-text text-transparent">
                      முழுமையான வழிகாட்டி
                    </span>
                  </>
                ) : (
                  <>
                    Explore dental treatments & health with{' '}
                    <span className="bg-gradient-to-r from-[#20B2AA] via-[#145B59] to-[#20B2AA] bg-clip-text text-transparent">
                      clarity and ease
                    </span>
                  </>
                )}
              </h1>

              <p className="text-base sm:text-lg text-[#587477] leading-relaxed max-w-2xl mx-auto">
                {isTamil
                  ? 'டென்டல்விஸ் உங்கள் பல் பிரச்சினைகளை எளிதில் புரிந்து கொள்ள உதவுகிறது. நடைமுறைகள் பற்றிய சந்தேகங்களை தீர்த்துக்கொள்ளுங்கள் அல்லது உங்கள் அறிகுறிகளைப் பற்றி அறிந்து கொள்ளுங்கள்.'
                  : 'Welcome to your patient learning hub. Choose whether you want to explore specific dental procedures in detail, or identify what common symptoms might indicate.'}
              </p>

              {/* TWO PRIMARY NAVIGATION ACTIONS */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                <Link href="/explore" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="primary"
                    className="w-full sm:w-auto min-w-[240px] px-8 py-4 gap-3 text-base font-bold shadow-md justify-center"
                  >
                    <Compass className="w-5 h-5 text-teal-100 shrink-0" />
                    <span>{isTamil ? 'சிகிச்சைகளை காண்க →' : 'Explore Procedures →'}</span>
                  </Button>
                </Link>

                <Link href="/symptoms" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="glass"
                    className="w-full sm:w-auto min-w-[240px] px-8 py-4 gap-3 text-base font-bold liquid-glass-lens justify-center"
                  >
                    <HeartPulse className="w-5 h-5 text-[#20B2AA] shrink-0" />
                    <span>{isTamil ? 'அறிகுறிகளை காண்க →' : 'Explore Symptoms →'}</span>
                  </Button>
                </Link>
              </div>
            </div>
          </LiquidGlassSurface>
        </Container>
      </section>

      {/* 2. DUAL PORTAL CARDS: EXPLORE vs SYMPTOMS in Seafoam & Powder-Blue Liquid Glass */}
      <section className="py-2">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* PORTAL CARD 1: EXPLORE PROCEDURES */}
            <LiquidGlassSurface
              variant="secondary"
              specular
              refractiveRim
              className="hover:liquid-glass-interactive rounded-3xl p-8 sm:p-10 flex flex-col justify-between group transition-all duration-300 isolate"
            >
              <div className="space-y-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#20B2AA] to-[#145B59] text-white flex items-center justify-center shadow-md">
                    <Compass className="w-7 h-7 text-[#DDF5F1]" />
                  </div>
                  <Badge variant="mint" className="text-xs font-bold uppercase tracking-wider liquid-glass-lens">
                    {isTamil ? 'சிகிச்சைகள்' : 'Procedures Hub'}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#145B59] tracking-tight group-hover:text-[#20B2AA] transition-colors">
                    {isTamil ? 'பல் மருத்துவ சிகிச்சைகள்' : 'Dental Treatment Guides'}
                  </h2>
                  <p className="text-sm sm:text-base text-[#587477] leading-relaxed">
                    {isTamil
                      ? 'வேர் கால்வாய் சிகிச்சை, பல் தொப்பிகள், ஆழமான ஈறு சுத்தம் மற்றும் நவீன இம்ப்ளான்ட் சிகிச்சைகள் எவ்வாறு செய்யப்படுகின்றன என்பதை காட்சி வரைபடங்களுடன் அறிந்து கொள்ளுங்கள்.'
                      : 'Step-by-step educational visual guides across Endodontics, Prosthodontics, Periodontics, and Oral Surgery. Understand what to expect, duration estimates, and home aftercare.'}
                  </p>
                </div>

                <div className="liquid-glass-lens p-5 rounded-2xl space-y-2.5">
                  <span className="text-xs font-bold text-[#145B59] uppercase tracking-wider block">
                    {isTamil ? 'இதில் அடங்குபவை:' : 'What you will discover:'}
                  </span>
                  <ul className="text-xs text-[#587477] space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#20B2AA]" />
                      <span>{isTamil ? 'சிகிச்சை நிலைகள் மற்றும் பயன்படும் கருவிகள்' : 'Procedural steps & anesthetic comfort options'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#20B2AA]" />
                      <span>{isTamil ? 'சிகிச்சைக்குப் பின் செய்ய வேண்டிய வீட்டுப் பராமரிப்பு' : 'Practical home recovery and hygiene guidance'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#20B2AA]" />
                      <span>{isTamil ? 'நோயாளிக்கான பொதுவான கேள்விகள் & பதில்கள்' : 'Frequently asked clinical questions answered'}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-8 relative z-10">
                <Link href="/explore">
                  <Button variant="primary" className="w-full py-4 text-base font-bold shadow-sm justify-center">
                    <span>{isTamil ? 'சிகிச்சை வழிகாட்டிகளை காண்க →' : 'Open Treatment Directory →'}</span>
                  </Button>
                </Link>
              </div>
            </LiquidGlassSurface>

            {/* PORTAL CARD 2: SYMPTOMS DIRECTORY */}
            <LiquidGlassSurface
              variant="secondary"
              specular
              refractiveRim
              className="hover:liquid-glass-interactive rounded-3xl p-8 sm:p-10 flex flex-col justify-between group transition-all duration-300 isolate"
            >
              <div className="space-y-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#145B59] to-[#20B2AA] text-white flex items-center justify-center shadow-md">
                    <HeartPulse className="w-7 h-7 text-[#DDF5F1]" />
                  </div>
                  <Badge variant="default" className="text-xs font-bold uppercase tracking-wider liquid-glass-lens">
                    {isTamil ? 'அறிகுறிகள்' : 'Symptom Guide'}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#145B59] tracking-tight group-hover:text-[#20B2AA] transition-colors">
                    {isTamil ? 'பொதுவான பல் அறிகுறிகள்' : 'Common Oral Symptoms'}
                  </h2>
                  <p className="text-sm sm:text-base text-[#587477] leading-relaxed">
                    {isTamil
                      ? 'பல் வலி, உணவு மெல்லும்போது கூச்சம், ஈறுகளில் இரத்தம் அல்லது பல் இடைவெளிகள் போன்ற அறிகுறிகளை அறிந்து மருத்துவரிடம் பேச தயாராகுங்கள்.'
                      : 'Not sure which procedure applies to you? Review everyday symptoms—such as biting discomfort, temperature sensitivity, or bleeding gums—and learn when to see a dentist.'}
                  </p>
                </div>

                <div className="liquid-glass-lens p-5 rounded-2xl space-y-2.5">
                  <span className="text-xs font-bold text-[#145B59] uppercase tracking-wider block">
                    {isTamil ? 'இதில் அடங்குபவை:' : 'What you will discover:'}
                  </span>
                  <ul className="text-xs text-[#587477] space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#20B2AA]" />
                      <span>{isTamil ? 'வலி மற்றும் உணர்திறன் அறிகுறிகள்' : 'Pain & temperature sensitivity signals'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#20B2AA]" />
                      <span>{isTamil ? 'ஈறு ஆரோக்கியம் மற்றும் இரத்தக்கசிவு காரணங்கள்' : 'Gum inflammation & bleeding triggers'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#20B2AA]" />
                      <span>{isTamil ? 'பரிந்துரைக்கப்படும் தொடர் மருத்துவ கவனிப்பு' : 'Recommended professional discussion topics'}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-8 relative z-10">
                <Link href="/symptoms">
                  <Button variant="outline" className="w-full py-4 text-base font-bold liquid-glass-lens hover:liquid-glass-floating justify-center">
                    <span>{isTamil ? 'அறிகுறிகள் வழிகாட்டியை காண்க →' : 'Open Symptom Guide →'}</span>
                  </Button>
                </Link>
              </div>
            </LiquidGlassSurface>
          </div>
        </Container>
      </section>

      {/* 3. FLOATING EDUCATIONAL HIGHLIGHT FEATURE PANELS IN LIQUID GLASS */}
      <section className="py-6">
        <Container>
          <LiquidGlassSurface
            variant="primary"
            specular
            refractiveRim
            className="p-8 sm:p-10 space-y-8 shadow-md"
          >
            <div className="max-w-2xl relative z-10">
              <Badge variant="mint" className="text-xs font-bold uppercase tracking-wider mb-2 liquid-glass-lens">
                {isTamil ? 'கல்வி உத்தரவாதம்' : 'Patient-Centric Standards'}
              </Badge>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#145B59] tracking-tight">
                {isTamil ? 'மருத்துவத் தெளிவுக்கான எங்கள் கோட்பாடுகள்' : 'Designed for True Healthcare Clarity'}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
              <div className="liquid-glass-secondary rounded-2xl p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl liquid-glass-lens text-[#20B2AA] flex items-center justify-center shadow-xs">
                  <Layers className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-[#145B59]">
                  {isTamil ? 'அடுக்கு உடற்கூறியல்' : 'Layered Anatomy'}
                </h4>
                <p className="text-xs text-[#587477] leading-relaxed">
                  {isTamil
                    ? 'எனாமல், டென்டின் மற்றும் நரம்பு அடுக்குகளை காட்சிப் படங்களுடன் தெளிவாக விளக்குகிறோம்.'
                    : 'Visual breakdowns showing where tooth structure ends and living tissue begins.'}
                </p>
              </div>

              <div className="liquid-glass-secondary rounded-2xl p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl liquid-glass-lens text-[#20B2AA] flex items-center justify-center shadow-xs">
                  <Clock className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-[#145B59]">
                  {isTamil ? 'நேர எதிர்பார்ப்புகள்' : 'Clear Timelines'}
                </h4>
                <p className="text-xs text-[#587477] leading-relaxed">
                  {isTamil
                    ? 'சிகிச்சைக்கு தேவையான தோராயமான கால அளவு மற்றும் மீட்சி நாட்களை முன்பே அறியலாம்.'
                    : 'Understand exact visit counts, expected chair time, and comfortable healing periods.'}
                </p>
              </div>

              <div className="liquid-glass-secondary rounded-2xl p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl liquid-glass-lens text-[#20B2AA] flex items-center justify-center shadow-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-[#145B59]">
                  {isTamil ? 'மருத்துவ நம்பிக்கை' : 'Clinical Reassurance'}
                </h4>
                <p className="text-xs text-[#587477] leading-relaxed">
                  {isTamil
                    ? 'பயத்தை நீக்கும் நவீன மயக்க மருந்து முறைகள் மற்றும் அமைதியான வழிகாட்டுதல்கள்.'
                    : 'Focus on gentle modern anesthesia, pain management, and calm patient comfort.'}
                </p>
              </div>
            </div>
          </LiquidGlassSurface>
        </Container>
      </section>
    </div>
  );
}
