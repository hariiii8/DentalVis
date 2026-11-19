'use client';

import React from 'react';
import { Container, Card, Badge } from '@dentalvis/ui';
import { AlertTriangle, Clock, ShieldAlert } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export default function EmergencyPage() {
  const { language } = useLanguage();
  const isTamil = language === 'ta';

  const emergencies = [
    {
      titleEn: 'Knocked-Out Permanent Tooth (Avulsion)',
      titleTa: 'முழுமையாக வெளியே விழுந்த நிலையான பல்',
      actionEn: 'Handle only by the smooth chewing crown—never touch the delicate root. If lightly soiled, rinse gently in cold milk or saline for 10 seconds. Place back into socket if possible, or store in a container of cold milk. See a dentist within 60 minutes for the highest re-implantation success.',
      actionTa: 'பல்லின் கிரவுன் பகுதியை மட்டுமே பிடிக்கவும்; வேர்ப் பகுதியைத் தொடவேண்டாம். அழுக்கு இருந்தால் பால் அல்லது உப்புக் கரைசலில் 10 வினாடிகள் மெதுவாகக் கழுவவும். மீண்டும் துவாரத்தில் பொருத்த முயற்சிக்கவும் அல்லது பாலில் போட்டு வைக்கவும். 60 நிமிடங்களுக்குள் பல் மருத்துவரை அணுகவும்.',
      urgencyEn: 'Critical: Within 60 Minutes',
      urgencyTa: 'அவசரம்: 60 நிமிடங்களுக்குள்',
    },
    {
      titleEn: 'Severe Uncontrollable Toothache or Facial Swelling',
      titleTa: 'கடுமையான கட்டுப்படுத்த முடியாத பல் வலி அல்லது முக வீக்கம்',
      actionEn: 'Rinse with warm saltwater to cleanse the area. Apply a cold gel pack to the outside cheek in 15-minute intervals. Do not apply aspirin directly to gums (causes chemical burns). Seek urgent clinical care to evaluate potential deep abscess or spreading infection.',
      actionTa: 'வெதுவெதுப்பான உப்பு நீரில் வாய் கொப்பளிக்கவும். கன்னத்தின் வெளிப்புறத்தில் ஐஸ் ஒத்தடம் கொடுக்கவும். ஆஸ்பிரின் மாத்திரையை நேரடியாக ஈறுகளில் வைக்கக் கூடாது. நோய்த்தொற்று பரவுவதைத் தடுக்க அன்றே மருத்துவரை அணுகவும்.',
      urgencyEn: 'Same-Day Clinical Care',
      urgencyTa: 'அன்றைய தினமே மருத்துவர் கவனிப்பு',
    },
    {
      titleEn: 'Broken or Fractured Tooth with Exposed Pulp',
      titleTa: 'நரம்பு தெரியும் அளவுக்கு உடைந்த பல்',
      actionEn: 'Rinse mouth gently with warm water. Save any broken tooth fragments in sterile milk or saline. Apply clean gauze with gentle biting pressure if bleeding. Seek same-day assessment to seal exposed nerve canals and protect against infection.',
      actionTa: 'வெதுவெதுப்பான நீரில் வாயைக் கழுவவும். உடைந்த பல் துண்டுகளை பாலில் சேமிக்கவும். இரத்தம் வந்தால் சுத்தமான துணியால் மென்மையாக அழுத்தவும். நரம்பைப் பாதுகாக்க உடனடியாக பல் மருத்துவரை அணுகவும்.',
      urgencyEn: 'Prompt Clinical Care',
      urgencyTa: 'உடனடி மருத்துவ கவனிப்பு',
    },
  ];

  return (
    <div className="py-12 space-y-12">
      <Container>
        {/* Navigation Breadcrumb */}
        <Breadcrumbs
          items={[
            { label: isTamil ? 'அவசர சிகிச்சை வழிகாட்டி' : 'Emergency Care' }
          ]}
          homeLabel={isTamil ? 'முகப்பு' : 'Home'}
        />

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
                  ? 'சுவாசிப்பதில் சிரமம், விழுங்குவதில் தடை, அதிக இரத்தப்போக்கு அல்லது முகத்தில் தீவிர காயம் ஏற்பட்டால் உடனடியாக அருகிலுள்ள அவசர சிகிச்சை மருத்துவமனைக்குச் செல்லவும்.'
                  : 'If you experience difficulty breathing, swallowing, high fever with swelling, or severe facial trauma, proceed immediately to the nearest hospital emergency department.'}
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-100 text-rose-900 text-xs font-bold shadow-sm">
              <Clock className="w-4 h-4 text-rose-600" />
              <span>{isTamil ? 'நேரக் கட்டுப்பாடு உடையது' : 'Time-Critical Advice'}</span>
            </span>
          </div>
        </div>

        {/* Educational Emergency Guidance Cards */}
        <div className="space-y-6">
          <div className="border-b border-teal-100 pb-3">
            <h1 className="text-3xl font-extrabold text-[#134E4A]">
              {isTamil ? 'பல் அவசர முதலுதவி வழிகாட்டல்கள்' : 'Dental Emergency First-Action Guidance'}
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              {isTamil
                ? 'மருத்துவரை அணுகும் முன் நோயாளிகள் செய்யக்கூடிய அறிவியல் அடிப்படையிலான எளிய முதலுதவி வழிமுறைகள்.'
                : 'Evidence-based initial guidance before reaching an emergency dental clinic.'}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {emergencies.map((em, idx) => (
              <Card key={idx} className="p-6 bg-white space-y-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <h3 className="text-xl font-bold text-[#134E4A]">
                    {isTamil ? em.titleTa : em.titleEn}
                  </h3>
                  <Badge variant="alert" className="self-start sm:self-auto text-xs font-bold">
                    {isTamil ? em.urgencyTa : em.urgencyEn}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0D9488]">
                    {isTamil ? 'உடனடி நடவடிக்கை:' : 'Immediate Action Steps:'}
                  </span>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {isTamil ? em.actionTa : em.actionEn}
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
              ? 'இந்த அவசர வழிகாட்டுதல்கள் தற்காலிக முதலுதவிக்கான பொதுவான கல்வித் தகவல்களே தவிர, முறையான மருத்துவ சிகிச்சைக்கு மாற்றாகாது. உடனடியாக உங்கள் பல் மருத்துவரைத் தொடர்பு கொள்ளவும்.'
              : 'Emergency guidelines are educational first-action steps to preserve tooth vitality and do not substitute for in-person clinical diagnosis or surgical intervention.'}
          </p>
        </div>
      </Container>
    </div>
  );
}
