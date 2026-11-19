'use client';

import React from 'react';
import { Container, Badge } from '@dentalvis/ui';
import { AlertTriangle, Clock, ShieldAlert, PhoneCall } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function EmergencyPage() {
  const { language } = useLanguage();
  const isTamil = language === 'ta';

  const urgentConditions = [
    {
      titleEn: 'Knocked-Out or Displaced Tooth',
      titleTa: 'வெளியே விழுந்த அல்லது இடம் மாறிய பல்',
      actionEn: 'Avoid touching or disturbing the tooth. Do not apply pressure or attempt home treatment. Contact an emergency dental clinic or hospital immediately for urgent clinical evaluation.',
      actionTa: 'பல்லினைத் தொடவோ அல்லது அசைக்கவோ வேண்டாம். எந்தவித அழுத்தமும் கொடுக்காமல், உடனடி மருத்துவ பரிசோதனைக்கு அவசர பல் மருத்துவரை அல்லது மருத்துவமனையை அணுகவும்.',
      urgencyEn: 'Urgent Professional Assessment Needed',
      urgencyTa: 'உடனடி மருத்துவ பரிசோதனை தேவை',
    },
    {
      titleEn: 'Severe Persistent Pain or Significant Facial Swelling',
      titleTa: 'கடுமையான நீடிக்கும் வலி அல்லது முக வீக்கம்',
      actionEn: 'Severe dental pain or noticeable facial swelling requires urgent in-person clinical assessment. Do not attempt unverified home remedies or apply pain medications directly to oral tissues.',
      actionTa: 'கடுமையான வலி அல்லது முக வீக்கம் இருந்தால் உடனடியாக தகுந்த மருத்துவரிடம் நேரடி பரிசோதனை பெறவும். வாய் திசுக்களில் சுயமாக மருந்துகளை வைக்கவோ அல்லது சோதிக்கப்படாத வீட்டு வைத்தியங்களையோ செய்ய வேண்டாம்.',
      urgencyEn: 'Same-Day Clinical Care',
      urgencyTa: 'அன்றைய தினமே மருத்துவர் கவனிப்பு',
    },
    {
      titleEn: 'Extensive Dental Fracture or Acute Oral Trauma',
      titleTa: 'கடுமையான பல் முறிவு அல்லது வாய்வழி காயம்',
      actionEn: 'Avoid chewing with or applying pressure to the injured area. Protect the mouth from further trauma and seek prompt emergency professional dental assessment.',
      actionTa: 'பாதிக்கப்பட்ட பகுதியில் அழுத்தம் கொடுப்பதையோ அல்லது எதையும் மெல்லுவதையோ தவிர்க்கவும். மேலதிக காயம் ஏற்படாமல் பாதுகாத்து, உடனடியாக தொழில்முறை பல் மருத்துவ பரிசோதனையை நாடவும்.',
      urgencyEn: 'Prompt Clinical Evaluation',
      urgencyTa: 'விரைவான மருத்துவ பரிசோதனை',
    },
  ];

  return (
    <div className="py-10 space-y-12 relative overflow-hidden bg-[#F5FAF9]">
      {/* Background Ambience */}
      <div className="absolute top-10 left-10 w-[36rem] h-[36rem] bg-rose-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[32rem] h-[32rem] bg-[#BFE9E2]/35 rounded-full blur-3xl pointer-events-none -z-10" />

      <Container>
        {/* Warning Banner in Translucent Liquid Warning Glass */}
        <div className="rounded-3xl bg-rose-50/80 backdrop-blur-2xl border border-rose-200/90 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-md mb-12 isolate relative">
          <div className="liquid-refractive-rim absolute inset-0 rounded-3xl pointer-events-none" />
          <div className="flex items-start sm:items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-200">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-rose-950">
                {isTamil ? 'அவசர மருத்துவ அறிவிப்பு' : 'Immediate Healthcare Notice'}
              </h2>
              <p className="text-sm text-rose-800 leading-relaxed max-w-2xl">
                {isTamil
                  ? 'சுவாசிப்பதில் சிரமம், விழுங்குவதில் தடை, அதிக இரத்தப்போக்கு அல்லது தீவிர முகக் காயம் ஏற்பட்டால் உடனடியாக அருகிலுள்ள மருத்துவமனை அவசர சிகிச்சைப் பிரிவை அணுகவும்.'
                  : 'If you experience difficulty breathing, swallowing, high fever with facial swelling, or severe head/facial trauma, proceed immediately to the nearest hospital emergency department.'}
              </p>
            </div>
          </div>
          <div className="shrink-0 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-100 text-rose-900 text-xs font-bold shadow-xs">
              <Clock className="w-3.5 h-3.5" />
              <span>{isTamil ? 'அவசர சிகிச்சை' : 'Emergency Priority'}</span>
            </span>
          </div>
        </div>

        {/* Page Header in Liquid Glass */}
        <div className="liquid-glass-primary rounded-3xl p-8 sm:p-10 mb-12 space-y-4 isolate relative shadow-md">
          <div className="liquid-refractive-rim absolute inset-0 rounded-3xl pointer-events-none" />
          <div className="liquid-specular-sheen absolute inset-0 rounded-3xl pointer-events-none" />

          <div className="relative z-10 space-y-3">
            <Badge variant="alert" className="gap-1.5 text-xs font-bold liquid-glass-lens">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-800" />
              <span>{isTamil ? 'அவசர வழிகாட்டல்' : 'Urgent Care Guidelines'}</span>
            </Badge>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#145B59] tracking-tight">
              {isTamil ? 'பல் மருத்துவ அவசர வழிகாட்டி' : 'Dental Emergency Assessment'}
            </h1>

            <p className="text-base text-[#587477] leading-relaxed max-w-2xl">
              {isTamil
                ? 'தீவிர பல் விபத்துகள் மற்றும் திடீர் வலிகளுக்கு முதற்கட்டமாக தொழில்முறை மருத்துவரிடம் உடனடி பரிசோதனை பெறுவது அவசியம். சோதிக்கப்படாத வீட்டு வைத்தியங்களைத் தவிர்க்கவும்.'
                : 'Recognize dental conditions requiring urgent clinical intervention. Always obtain qualified professional assessment rather than attempting unreviewed self-care.'}
            </p>
          </div>
        </div>

        {/* Urgent Conditions Cards in Liquid Glass */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {urgentConditions.map((cond, idx) => (
            <div
              key={idx}
              className="liquid-glass-secondary rounded-3xl p-7 flex flex-col justify-between space-y-6 isolate relative group transition-all duration-300 hover:liquid-glass-interactive"
            >
              <div className="liquid-refractive-rim absolute inset-0 rounded-3xl pointer-events-none" />
              <div className="liquid-specular-sheen absolute inset-0 rounded-3xl pointer-events-none" />

              <div className="space-y-4 relative z-10">
                <Badge variant="alert" className="text-[11px] font-bold liquid-glass-lens">
                  {isTamil ? cond.urgencyTa : cond.urgencyEn}
                </Badge>

                <h3 className="text-lg font-bold text-[#145B59] group-hover:text-[#20B2AA] transition-colors">
                  {isTamil ? cond.titleTa : cond.titleEn}
                </h3>

                <p className="text-sm text-[#587477] leading-relaxed">
                  {isTamil ? cond.actionTa : cond.actionEn}
                </p>
              </div>

              <div className="pt-4 border-t border-[#C8E7E3]/70 text-xs font-bold text-[#20B2AA] flex items-center gap-1.5 relative z-10">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{isTamil ? 'உடனடி மருத்துவ ஆலோசனை தேவை' : 'Seek Immediate Professional Help'}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Clinical Disclaimer Note */}
        <div className="p-6 rounded-2xl liquid-glass-secondary flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-[#20B2AA] shrink-0 mt-0.5" />
          <p className="text-xs text-[#145B59] leading-relaxed">
            {isTamil
              ? 'இந்த அவசர வழிகாட்டுதல்கள் நோயாளி விழிப்புணர்வுக்கான கல்வித் தகவல்களே தவிர, மருத்துவப் பரிசோதனை, சிகிச்சை பரிந்துரை அல்லது முதலுதவி சிகிச்சை அல்ல. உடனடியாக உங்கள் பல் மருத்துவரை அல்லது அவசர மருத்துவமனையை அணுகவும்.'
              : 'These guidelines provide educational awareness to help patients seek timely clinical attention. They do not constitute diagnosis, automated triage, or treatment instructions. Always seek in-person professional medical evaluation.'}
          </p>
        </div>
      </Container>
    </div>
  );
}
