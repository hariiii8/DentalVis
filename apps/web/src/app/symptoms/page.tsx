'use client';

import React from 'react';
import Link from 'next/link';
import { Container, Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from '@dentalvis/ui';
import { ArrowRight, Compass, ShieldAlert, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Breadcrumbs } from '@/components/Breadcrumbs';

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
    <div className="py-12 space-y-12">
      <Container>
        {/* Navigation Breadcrumb */}
        <Breadcrumbs
          items={[
            { label: isTamil ? 'அறிகுறிகள் பட்டியல்' : 'Common Symptoms' }
          ]}
          homeLabel={isTamil ? 'முகப்பு' : 'Home'}
        />

        {/* Header */}
        <div className="max-w-2xl space-y-4 mb-12">
          <Badge variant="mint" className="gap-1.5 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5 text-[#0D9488]" />
            <span>{isTamil ? 'அறிகுறி வழிகாட்டி' : 'Symptom-Based Navigation'}</span>
          </Badge>
          <h1 className="text-4xl font-extrabold text-[#134E4A] tracking-tight">
            {isTamil ? 'பொதுவான பல் அறிகுறிகள் & விளக்கங்கள்' : 'Common Symptoms & Explanations'}
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            {isTamil
              ? 'நீங்கள் உணரும் குறிப்பிட்ட அசௌகரியத்தைத் தேர்வு செய்து, அது எதனால் ஏற்படுகிறது என்பதையும் அதற்கான சிகிச்சை முறைகளையும் விரிவாக அறியுங்கள்.'
              : 'Select what you are experiencing to understand the underlying causes and explore patient-tested treatment options.'}
          </p>
        </div>

        {/* Symptoms List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {commonSymptoms.map((symp, idx) => (
            <Card key={idx} className="flex flex-col justify-between hover:translate-y-[-2px] transition-all">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-xs">
                    {isTamil ? symp.categoryNameTa : symp.categoryNameEn}
                  </Badge>
                  <Sparkles className="w-4 h-4 text-[#0D9488]" />
                </div>
                <CardTitle className="text-lg">
                  {isTamil ? symp.titleTa : symp.titleEn}
                </CardTitle>
                <CardDescription className="text-sm text-slate-600 mt-2">
                  {isTamil ? symp.descTa : symp.descEn}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <Link
                  href={`/explore/${symp.categorySlug}`}
                  className="text-xs font-bold text-[#0D9488] flex items-center gap-1 hover:underline pt-3 border-t border-slate-100"
                >
                  <span>{isTamil ? 'சிகிச்சை வழிகாட்டிகளை காண்க' : 'Explore Treatment Options'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Clinical Disclaimer Note */}
        <div className="mt-12 p-6 rounded-2xl bg-teal-50 border border-teal-200/60 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-[#0D9488] shrink-0 mt-0.5" />
          <p className="text-xs text-[#134E4A] leading-relaxed">
            {isTamil
              ? 'அறிகுறி விளக்கங்கள் கல்விப் பயன்பாட்டிற்காக மட்டுமே வழங்கப்படுகின்றன. இவை மருத்துவப் பரிசோதனை அல்ல. முறையான மருத்துவ ஆலோசனைக்கு உங்கள் பல் மருத்துவரை அணுகவும்.'
              : 'Symptom descriptions are educational overviews and do not constitute self-diagnosis or medical triage. Always consult with a licensed dental clinician for personalized diagnostic care.'}
          </p>
        </div>
      </Container>
    </div>
  );
}
