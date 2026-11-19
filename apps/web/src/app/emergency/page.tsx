'use client';

import React from 'react';
import { Container, Card, Badge } from '@dentalvis/ui';
import { AlertTriangle, Clock, ShieldAlert } from 'lucide-react';
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
    <div className="py-10 space-y-12">
      <Container>
        {/* Warning Banner */}
        <div className="rounded-3xl bg-rose-50 border border-rose-200/80 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
          <div className="flex items-start sm:items-center gap-4">
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
          <div className="shrink-0">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-100 text-rose-900 text-xs font-bold shadow-sm">
              <Clock className="w-4 h-4 text-rose-600" />
              <span>{isTamil ? 'அவசர கவனிப்பு' : 'Urgent Care'}</span>
            </span>
          </div>
        </div>

        {/* Safe Educational Guidance Cards */}
        <div className="space-y-6">
          <div className="border-b border-teal-100 pb-3">
            <h1 className="text-3xl font-extrabold text-[#134E4A]">
              {isTamil ? 'பல் அவசர வழிகாட்டுதல்' : 'Dental Emergency Assessment Guidance'}
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              {isTamil
                ? 'பல் அவசர நிலைகளில் தொழில்முறை மருத்துவ கவனிப்பை உடனடியாக நாடுவதற்கான வழிகாட்டல்கள்.'
                : 'Safe guidance emphasizing immediate professional dental or emergency medical assessment.'}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {urgentConditions.map((cond, idx) => (
              <Card key={idx} className="p-6 bg-white space-y-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <h3 className="text-xl font-bold text-[#134E4A]">
                    {isTamil ? cond.titleTa : cond.titleEn}
                  </h3>
                  <Badge variant="alert" className="self-start sm:self-auto text-xs font-bold">
                    {isTamil ? cond.urgencyTa : cond.urgencyEn}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0D9488]">
                    {isTamil ? 'பாதுகாப்பு வழிகாட்டுதல்:' : 'Clinical Safety Guidance:'}
                  </span>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {isTamil ? cond.actionTa : cond.actionEn}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Clinical Disclaimer Note */}
        <div className="p-6 rounded-2xl bg-teal-50 border border-teal-200/60 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-[#0D9488] shrink-0 mt-0.5" />
          <p className="text-xs text-[#134E4A] leading-relaxed">
            {isTamil
              ? 'இந்த அவசர வழிகாட்டுதல்கள் நோயாளி விழிப்புணர்வுக்கான கல்வித் தகவல்களே தவிர, மருத்துவப் பரிசோதனை, சிகிச்சை பரிந்துரை அல்லது முதலுதவி சிகிச்சை அல்ல. உடனடியாக உங்கள் பல் மருத்துவரை அல்லது அவசர மருத்துவமனையை அணுகவும்.'
              : 'These guidelines provide educational awareness to help patients seek timely clinical attention. They do not constitute diagnosis, automated triage, or treatment instructions. Always seek in-person professional medical evaluation.'}
          </p>
        </div>
      </Container>
    </div>
  );
}
