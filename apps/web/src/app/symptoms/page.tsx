'use client';

import React from 'react';
import Link from 'next/link';
import { Container, Badge, LiquidGlassSurface } from '@dentalvis/ui';
import { ArrowRight, Sparkles, HeartPulse, ShieldAlert, Video } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { YouTubeClickToLoadPlayer } from '@/components/YouTubeClickToLoadPlayer';

export default function SymptomsPage() {
  const { language } = useLanguage();
  const isTamil = language === 'ta';

  const commonSymptoms = [
    {
      titleEn: 'Sudden Sharp Pain While Chewing',
      titleTa: 'மெல்லும்போது ஏற்படும் தீவிர பல் வலி',
      categorySlug: 'pain-and-sensitivity',
      categoryNameEn: 'Pain & Sensitivity',
      categoryNameTa: 'பல் வலி & கூச்சம்',
      descEn: 'May indicate a cracked tooth, deep decay reaching the pulp, or a loose filling requiring structural sealing.',
      descTa: 'பல்லில் ஏற்பட்ட விரிசல், நரம்பை எட்டிய ஆழமான சொத்தை அல்லது பழைய அடைப்பு தளர்ந்துள்ளதைக் குறிக்கலாம்.',
    },
    {
      titleEn: 'Persistent Sensitivity to Cold or Heat',
      titleTa: 'சூடு அல்லது குளிருக்கு நீடிக்கும் கூச்சம்',
      categorySlug: 'pain-and-sensitivity',
      categoryNameEn: 'Pain & Sensitivity',
      categoryNameTa: 'பல் வலி & கூச்சம்',
      descEn: 'Often points to exposed dentin, enamel micro-wear, or inflammation within the root pulp chamber.',
      descTa: 'வெளிப்படும் எனாமல் தேய்மானம், டென்டின் அல்லது பல்லின் உள்பகுதியில் நரம்பு அழற்சியினால் ஏற்படலாம்.',
    },
    {
      titleEn: 'Bleeding While Brushing or Flossing',
      titleTa: 'பல் துலக்கும்போது ஈறுகளில் இரத்தம்',
      categorySlug: 'gums-and-bleeding',
      categoryNameEn: 'Gums & Bleeding',
      categoryNameTa: 'ஈறுகள் & இரத்தக் கசிவு',
      descEn: 'An early sign of gingivitis or hardened tartar accumulation beneath the gumline requiring gentle scaling.',
      descTa: 'ஈறு வீக்கம் அல்லது ஈறுகளுக்கு அடியில் படிந்துள்ள காரையின் அறிகுறி; இதற்கு ஆழமான சுத்தம் தேவைப்படுகிறது.',
    },
    {
      titleEn: 'Visible Chip or Rough Edge on Enamel',
      titleTa: 'பல்லில் தெரியும் விரிசல் அல்லது உடைந்த பகுதி',
      categorySlug: 'broken-or-chipped-teeth',
      categoryNameEn: 'Broken or Chipped Teeth',
      categoryNameTa: 'உடைந்த & விரிசல் பற்கள்',
      descEn: 'Can be smoothed, bonded with aesthetic composite resin, or protected with a custom ceramic dental crown.',
      descTa: 'காஸ்மெட்டிக் பிணைப்பு அல்லது வலுவான செராமிக் பல் தொப்பி மூலம் எளிதில் சீரமைக்க முடியும்.',
    },
    {
      titleEn: 'Gaps from a Lost or Extracted Tooth',
      titleTa: 'இழந்த பல்லினால் ஏற்பட்ட இடைவெளி',
      categorySlug: 'missing-teeth',
      categoryNameEn: 'Missing Teeth',
      categoryNameTa: 'இழந்த பற்கள் & இம்ப்ளான்ட்',
      descEn: 'Understanding modern implants, fixed bridges, and how tooth replacement preserves healthy jawbone density.',
      descTa: 'நவீன டைட்டானியம் இம்ப்ளான்ட் அல்லது பிரிட்ஜ் மூலம் தாடை எலும்பைப் பாதுகாத்து பற்களை நிரப்புதல்.',
    },
  ];

  return (
    <div className="py-10 space-y-16 relative overflow-hidden">
      {/* Background Optical Ambience in Powder Blue and Soft Mint */}
      <div className="absolute top-10 left-10 w-[38rem] h-[38rem] bg-gradient-to-br from-[#BFE9E2]/55 via-[#20B2AA]/22 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 -right-20 w-[32rem] h-[32rem] bg-gradient-to-bl from-[#DCEFF5]/80 via-[#20B2AA]/20 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <Container>
        {/* Page Header: Liquid Glass Introduction */}
        <LiquidGlassSurface
          variant="primary"
          specular
          refractiveRim
          className="p-8 sm:p-10 mb-12 space-y-4 shadow-md"
        >
          <div className="relative z-10 space-y-4">
            <Badge variant="mint" className="gap-1.5 text-xs font-semibold liquid-glass-lens">
              <HeartPulse className="w-3.5 h-3.5 text-[#20B2AA]" />
              <span>{isTamil ? 'நோயாளி அறிகுறி வழிகாட்டி' : 'Symptom Explorer'}</span>
            </Badge>

            <h1 className="text-4xl sm:text-5xl font-black text-[#145B59] tracking-tight">
              {isTamil ? 'பொதுவான பல் அறிகுறிகள் & வழிகாட்டல்' : 'Common Oral Symptoms'}
            </h1>

            <p className="text-base sm:text-lg text-[#587477] leading-relaxed max-w-2xl">
              {isTamil
                ? 'பல் வலி, கூச்சம் அல்லது ஈறு இரத்தக்கசிவு போன்ற அன்றாட அறிகுறிகளுக்கான காரணங்களை அறிந்து கொள்ளுங்கள். மருத்துவரிடம் விவாதிக்க வேண்டிய தகவல்கள் இங்கே தொகுக்கப்பட்டுள்ளன.'
                : 'Identify everyday dental discomforts, understand what underlying clinical factors might be involved, and learn which visual procedure guides can clarify your options.'}
            </p>
          </div>
        </LiquidGlassSurface>

        {/* Video Feature Section: Recognizing Dental Emergencies vs. Routine Discomfort */}
        <div className="mb-12">
          <LiquidGlassSurface
            variant="primary"
            specular
            refractiveRim
            className="p-6 sm:p-8 rounded-3xl overflow-hidden shadow-md"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4">
                <Badge variant="mint" className="gap-1.5 text-xs font-semibold liquid-glass-lens">
                  <Video className="w-3.5 h-3.5 text-[#20B2AA]" />
                  <span>{isTamil ? 'அவசர சிகிச்சை வழிகாட்டி' : 'Emergency Triage Video'}</span>
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-black text-[#145B59] tracking-tight">
                  {isTamil ? 'பல் அவசரநிலைகள் vs சாதாரண அசௌகரியம்' : 'Recognizing Dental Emergencies vs. Routine Discomfort'}
                </h2>
                <p className="text-sm sm:text-base text-[#587477] leading-relaxed">
                  {isTamil
                    ? 'தீவிர பல் வலி, முக வீக்கம் அல்லது பல் உடைந்தால் எப்போது உடனடியாக மருத்துவமனைக்குச் செல்ல வேண்டும் என்பதையும், சாதாரண கூச்சத்தை எவ்வாறு கையாள்வது என்பதையும் விளக்கும் கல்வி வீடியோ.'
                    : 'Learn how to identify urgent oral symptoms requiring immediate same-day attention—such as acute swelling, trauma, or severe pain—versus routine discomfort manageable through planned clinical visits.'}
                </p>
                <div className="p-3 rounded-xl liquid-glass-secondary text-xs text-[#145B59] flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-[#20B2AA] shrink-0" />
                  <span>
                    {isTamil
                      ? 'அங்கீகரிக்கப்பட்ட மருத்துவ வழிகாட்டுதல் வீடியோ விளக்கம்'
                      : 'Accredited clinical education video on dental triage'}
                  </span>
                </div>
              </div>

              <div className="lg:col-span-7">
                <YouTubeClickToLoadPlayer
                  videoId="gU8WbOqQf8Y"
                  title={
                    isTamil
                      ? 'பல் அவசரநிலைகள் மற்றும் பொதுவான அறிகுறிகள்'
                      : 'Recognizing Dental Emergencies vs. Routine Discomfort'
                  }
                  thumbnailUrl="/images/categories/pain-and-sensitivity.svg"
                  durationText="3:30 min"
                  lang={language}
                />
              </div>
            </div>
          </LiquidGlassSurface>
        </div>

        {/* Symptoms Interactive Grid with Liquid Glass Secondary Surfaces */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {commonSymptoms.map((sym, idx) => (
            <LiquidGlassSurface
              key={idx}
              variant="secondary"
              specular
              refractiveRim
              className="hover:liquid-glass-interactive rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 isolate group"
            >
              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <Badge variant="mint" className="text-[11px] font-bold liquid-glass-lens">
                    {isTamil ? sym.categoryNameTa : sym.categoryNameEn}
                  </Badge>
                  <Sparkles className="w-4 h-4 text-[#20B2AA] opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-[#145B59] group-hover:text-[#20B2AA] transition-colors">
                    {isTamil ? sym.titleTa : sym.titleEn}
                  </h3>
                  <p className="text-xs font-semibold text-[#20B2AA]/90">
                    {isTamil ? sym.titleEn : sym.titleTa}
                  </p>
                  <p className="text-sm text-[#587477] leading-relaxed">
                    {isTamil ? sym.descTa : sym.descEn}
                  </p>
                </div>
              </div>

              <div className="pt-6 relative z-10">
                <Link
                  href={`/explore/${sym.categorySlug}`}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#20B2AA] group-hover:translate-x-1 transition-transform"
                >
                  <span>{isTamil ? 'தொடர்புடைய பிரிவைக் காண்க' : 'Explore Related Topic'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </LiquidGlassSurface>
          ))}
        </div>

        {/* Clinical Disclaimer Note */}
        <LiquidGlassSurface
          variant="secondary"
          specular={false}
          refractiveRim
          className="p-5 rounded-2xl flex items-start gap-3 border border-[#C8E7E3]/70"
        >
          <ShieldAlert className="w-5 h-5 text-[#20B2AA] shrink-0 mt-0.5" />
          <p className="text-xs text-[#587477] leading-relaxed">
            {isTamil
              ? 'அறிகுறி வழிகாட்டி குறிப்பு: இப்பக்கத்திலுள்ள தகவல்கள் கல்வி வழிகாட்டல் மட்டுமே. இது மருத்துவ நோயறிதல் அல்லது சிகிச்சை பரிந்துரை அல்ல. உங்கள் மருத்துவரிடம் நேரடி பரிசோதனை பெறவும்.'
              : 'Educational Navigation Notice: Symptom Explorer is designed for patient educational orientation and clinical discussion. It does not provide diagnosis, risk scoring, or automated treatment recommendations.'}
          </p>
        </LiquidGlassSurface>
      </Container>
    </div>
  );
}
