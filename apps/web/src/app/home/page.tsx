'use client';

import React from 'react';
import Link from 'next/link';
import { Container, Button, Card, Badge } from '@dentalvis/ui';
import {
  ArrowRight,
  Compass,
  Sparkles,
  ShieldCheck,
  HeartPulse,
  Layers,
  Stethoscope,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function MainHomePage() {
  const { language } = useLanguage();
  const isTamil = language === 'ta';

  return (
    <div className="py-8 sm:py-12 space-y-20 selection:bg-[#A4E6D5] selection:text-[#164B50]">
      {/* 1. HERO SECTION: Welcoming Glass Portal Introduction */}
      <section className="relative overflow-hidden pt-4 pb-12">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#D9F0ED]/70 via-[#A4E6D5]/25 to-transparent -z-10 blur-3xl pointer-events-none" />

        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel-subtle text-[#247F83] text-xs font-bold tracking-wide shadow-xs mx-auto">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isTamil ? 'நோயாளி கல்வி தளம்' : 'Patient Visual Education Portal'}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#164B50] tracking-tight leading-[1.15]">
              {isTamil ? (
                <>
                  பல் சிகிச்சைகள் & ஆரோக்கியம் பற்றிய{' '}
                  <span className="bg-gradient-to-r from-[#247F83] via-[#2DD4BF] to-[#164B50] bg-clip-text text-transparent">
                    முழுமையான வழிகாட்டி
                  </span>
                </>
              ) : (
                <>
                  Explore dental treatments & health with{' '}
                  <span className="bg-gradient-to-r from-[#247F83] via-[#2DD4BF] to-[#164B50] bg-clip-text text-transparent">
                    clarity and ease
                  </span>
                </>
              )}
            </h1>

            <p className="text-base sm:text-lg text-[#64777C] leading-relaxed max-w-2xl mx-auto">
              {isTamil
                ? 'டென்டல்விஸ் உங்கள் பல் பிரச்சினைகளை எளிதில் புரிந்து கொள்ள உதவுகிறது. நடைமுறைகள் பற்றிய சந்தேகங்களை தீர்த்துக்கொள்ளுங்கள் அல்லது உங்கள் அறிகுறிகளைப் பற்றி அறிந்து கொள்ளுங்கள்.'
                : 'Welcome to your patient learning hub. Choose whether you want to explore specific dental procedures in detail, or identify what common symptoms might indicate.'}
            </p>

            {/* TWO PRIMARY NAVIGATION ACTIONS */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/explore" className="w-full sm:w-auto">
                <Button size="lg" variant="primary" className="w-full sm:w-auto gap-2.5 font-bold shadow-md">
                  <Compass className="w-5 h-5 text-teal-100" />
                  <span>{isTamil ? 'சிகிச்சைகளை காண்க →' : 'Explore Procedures →'}</span>
                </Button>
              </Link>

              <Link href="/symptoms" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2.5 font-bold">
                  <HeartPulse className="w-5 h-5 text-[#247F83]" />
                  <span>{isTamil ? 'அறிகுறிகளை காண்க →' : 'Explore Symptoms →'}</span>
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. DUAL PORTAL CARDS: EXPLORE vs SYMPTOMS (Introductions only, no item duplication) */}
      <section className="py-2">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* PORTAL CARD 1: EXPLORE PROCEDURES */}
            <Card glass="glow" className="p-8 sm:p-10 flex flex-col justify-between group hover:translate-y-[-4px] transition-all duration-300">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#247F83] to-[#164B50] text-white flex items-center justify-center shadow-md">
                    <Compass className="w-7 h-7 text-[#A4E6D5]" />
                  </div>
                  <Badge variant="mint" className="text-xs font-bold uppercase tracking-wider">
                    {isTamil ? 'சிகிச்சைகள்' : 'Procedures Hub'}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#164B50] tracking-tight group-hover:text-[#247F83] transition-colors">
                    {isTamil ? 'பல் மருத்துவ சிகிச்சைகள்' : 'Dental Treatment Guides'}
                  </h2>
                  <p className="text-sm sm:text-base text-[#64777C] leading-relaxed">
                    {isTamil
                      ? 'வேர் கால்வாய் சிகிச்சை, பல் தொப்பிகள், ஆழமான ஈறு சுத்தம் மற்றும் நவீன இம்ப்ளான்ட் சிகிச்சைகள் எவ்வாறு செய்யப்படுகின்றன என்பதை காட்சி வரைபடங்களுடன் அறிந்து கொள்ளுங்கள்.'
                      : 'Step-by-step educational visual guides across Endodontics, Prosthodontics, Periodontics, and Oral Surgery. Understand what to expect, duration estimates, and home aftercare.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/70 border border-[#DCEAEC] space-y-2">
                  <span className="text-xs font-bold text-[#164B50] uppercase tracking-wider block">
                    {isTamil ? 'இதில் அடங்குபவை:' : 'What you will discover:'}
                  </span>
                  <ul className="text-xs text-[#64777C] space-y-1.5 list-disc list-inside">
                    <li>{isTamil ? 'சிகிச்சை நிலைகள் மற்றும் பயன்படும் கருவிகள்' : 'Procedural steps & anesthetic comfort options'}</li>
                    <li>{isTamil ? 'சிகிச்சைக்குப் பின் செய்ய வேண்டிய வீட்டுப் பராமரிப்பு' : 'Practical home recovery and hygiene guidance'}</li>
                    <li>{isTamil ? 'நோயாளிக்கான பொதுவான கேள்விகள் & பதில்கள்' : 'Frequently asked clinical questions answered'}</li>
                  </ul>
                </div>
              </div>

              <div className="pt-8">
                <Link href="/explore">
                  <Button variant="primary" className="w-full gap-2 py-3.5">
                    <span>{isTamil ? 'சிகிச்சை வழிகாட்டிகளை காண்க' : 'Open Treatment Directory'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </Card>

            {/* PORTAL CARD 2: SYMPTOMS DIRECTORY */}
            <Card glass="glow" className="p-8 sm:p-10 flex flex-col justify-between group hover:translate-y-[-4px] transition-all duration-300">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#164B50] to-[#247F83] text-white flex items-center justify-center shadow-md">
                    <HeartPulse className="w-7 h-7 text-[#A4E6D5]" />
                  </div>
                  <Badge variant="default" className="text-xs font-bold uppercase tracking-wider">
                    {isTamil ? 'அறிகுறிகள்' : 'Symptom Guide'}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#164B50] tracking-tight group-hover:text-[#247F83] transition-colors">
                    {isTamil ? 'பொதுவான பல் அறிகுறிகள்' : 'Common Dental Symptoms'}
                  </h2>
                  <p className="text-sm sm:text-base text-[#64777C] leading-relaxed">
                    {isTamil
                      ? 'திடீர் வலி, சூடான/குளிர்ந்த உணவுகளுக்கான கூச்சம், பல் துலக்கும் போது இரத்தம் கசிதல் அல்லது பல் விரிசல் போன்றவற்றின் காரணங்களை அறிந்து சரியான மருத்துவரை அணுகுங்கள்.'
                      : 'Structured educational navigation connecting what you feel—such as chewing pain, thermal sensitivity, bleeding gums, or chipped enamel—with relevant clinical education.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/70 border border-[#DCEAEC] space-y-2">
                  <span className="text-xs font-bold text-[#164B50] uppercase tracking-wider block">
                    {isTamil ? 'இதில் அடங்குபவை:' : 'What you will discover:'}
                  </span>
                  <ul className="text-xs text-[#64777C] space-y-1.5 list-disc list-inside">
                    <li>{isTamil ? 'அறிகுறிகளுக்கான பொதுவான உடலியல் காரணங்கள்' : 'Understand underlying anatomical triggers'}</li>
                    <li>{isTamil ? 'மருத்துவரிடம் கலந்துரையாட வேண்டிய முக்கிய தகவல்கள்' : 'Questions to prepare for your dental consultation'}</li>
                    <li>{isTamil ? 'தற்காலிக பாதுகாப்பு மற்றும் விழிப்புணர்வு' : 'Safe awareness without self-diagnosis'}</li>
                  </ul>
                </div>
              </div>

              <div className="pt-8">
                <Link href="/symptoms">
                  <Button variant="outline" className="w-full gap-2 py-3.5 border-[#247F83]/30 hover:bg-[#D9F0ED]/70 font-bold">
                    <span>{isTamil ? 'அறிகுறிகள் பட்டியலை காண்க' : 'Open Symptom Directory'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </Container>
      </section>

      {/* 3. PLATFORM CAPABILITY HIGHLIGHTS */}
      <section className="py-6">
        <Container>
          <div className="rounded-3xl glass-panel p-8 sm:p-12 shadow-md">
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
              <Badge variant="mint" className="text-xs font-bold">
                {isTamil ? 'கல்வி நன்மைகள்' : 'Platform Pillars'}
              </Badge>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#164B50] tracking-tight">
                {isTamil ? 'டென்டல்விஸ் வழங்கும் நன்மைகள்' : 'Designed for Patient Clarity'}
              </h3>
              <p className="text-sm text-[#64777C]">
                {isTamil
                  ? 'பல் மருத்துவ பயங்களை நீக்கி, அமைதியான புரிதலை உருவாக்குதல்.'
                  : 'Everything in DentalVis is crafted to facilitate informed, anxiety-free discussions between patients and certified clinicians.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-white/70 border border-[#DCEAEC] space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#D9F0ED] text-[#247F83] flex items-center justify-center font-bold">
                  <Layers className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-base text-[#164B50]">
                  {isTamil ? 'காட்சி உடற்கூறியல்' : 'Visual Anatomy'}
                </h4>
                <p className="text-xs text-[#64777C] leading-relaxed">
                  {isTamil
                    ? 'பல்லின் எனாமல், டென்டின் மற்றும் நரம்பு பகுதிகளை எளிதில் புரிந்துகொள்ளும் வரைபடங்கள்.'
                    : 'Clear cross-sections illustrating why treatments happen beneath the surface.'}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/70 border border-[#DCEAEC] space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#D9F0ED] text-[#247F83] flex items-center justify-center font-bold">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-base text-[#164B50]">
                  {isTamil ? 'எளிய விளக்கம்' : 'Zero Jargon'}
                </h4>
                <p className="text-xs text-[#64777C] leading-relaxed">
                  {isTamil
                    ? 'மருத்துவக் குழப்பங்கள் இன்றி அன்றாட மனித மொழியில் அமைந்த விவரங்கள்.'
                    : 'Explaining root canals, scaling, crowns, and implants in calm, straightforward language.'}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/70 border border-[#DCEAEC] space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#D9F0ED] text-[#247F83] flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-base text-[#164B50]">
                  {isTamil ? 'அவசர விழிப்புணர்வு' : 'Urgent Awareness'}
                </h4>
                <p className="text-xs text-[#64777C] leading-relaxed">
                  {isTamil
                    ? 'அவசர சிகிச்சை தேவைப்படும் நிலைகளில் உடனடி மருத்துவ உதவியை நாட வழிகாட்டல்.'
                    : 'Promoting timely medical evaluation when red-flag symptoms or oral trauma occur.'}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
