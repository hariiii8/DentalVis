'use client';

import React from 'react';
import Link from 'next/link';
import { Container, Card, Badge, ClinicalDisclaimerBanner } from '@dentalvis/ui';
import { ProcedureDetail } from '@dentalvis/common';
import { Box, CheckCircle2, Clock, ShieldCheck, HeartPulse, Sparkles, HelpCircle, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { YouTubeClickToLoadPlayer } from '@/components/YouTubeClickToLoadPlayer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ProcedureCard } from '@/components/ProcedureCard';

interface ProcedureDetailClientViewProps {
  procedure: ProcedureDetail;
  relatedProcedures: ProcedureDetail[];
}

export default function ProcedureDetailClientView({
  procedure,
  relatedProcedures,
}: ProcedureDetailClientViewProps) {
  const { language } = useLanguage();
  const isTamil = language === 'ta';

  const title = isTamil ? procedure.titleTa : procedure.titleEn;
  const secondaryTitle = isTamil ? procedure.titleEn : procedure.titleTa;
  const summary = isTamil ? procedure.summaryTa : procedure.summaryEn;
  const overviewHtml = isTamil ? procedure.overviewHtmlTa : procedure.overviewHtmlEn;
  const coverImageSrc = `/images/procedures/${procedure.slug}.svg`;

  // Curated clinical step breakdowns per procedure
  const getSteps = () => {
    switch (procedure.slug) {
      case 'root-canal-treatment':
        return [
          {
            num: 1,
            titleEn: 'Comfort Preparation & Numbing',
            titleTa: 'வலி நிவாரணம் & மரத்துப்போகச் செய்தல்',
            descEn: 'A localized anesthetic is applied gently around the affected tooth to ensure you feel entirely relaxed and pain-free.',
            descTa: 'சிகிச்சை முழுவதும் நீங்கள் எந்த வலியும் இன்றி நிம்மதியாக இருக்க பல்லின் சுற்றிலும் மென்மையான மயக்க மருந்து இடப்படுகிறது.',
          },
          {
            num: 2,
            titleEn: 'Cleaning Infected Pulp & Microscopic Disinfection',
            titleTa: 'தொற்று நரம்பை அகற்றுதல் & கிருமிநாசினி சுத்தம்',
            descEn: 'The doctor creates a tiny access point in the crown, gently removes the inflamed pulp from each canal, and disinfects the inner chamber.',
            descTa: 'பல்லின் மேல் பகுதியில் சிறிய துவாரம் மூலம், கால்வாய்களில் உள்ள தொற்று நரம்புகள் மெதுவாக அகற்றப்பட்டு சுத்தப்படுத்தப்படுகிறது.',
          },
          {
            num: 3,
            titleEn: 'Biocompatible Canal Sealing (Gutta-Percha)',
            titleTa: 'கால்வாய் அடைத்தல் (Gutta-Percha)',
            descEn: 'Each sterile canal is filled with an elastic, natural biocompatible material called gutta-percha and adhesive cement to prevent future bacterial entry.',
            descTa: 'சுத்தம் செய்யப்பட்ட கால்வாய்கள் குட்டா-பெர்க்கா எனும் இயற்கை மருத்துவப் பொருள் கொண்டு நிரந்தரமாக சீல் செய்யப்படுகிறது.',
          },
          {
            num: 4,
            titleEn: 'Crown Restoration for Chewing Strength',
            titleTa: 'பல் தொப்பி (Crown) பொருத்துதல்',
            descEn: 'A custom ceramic or zirconia crown is placed over the tooth to restore full biting strength and prevent fracture.',
            descTa: 'பல் மீண்டும் உறுதியாக மெல்லும் திறனைப் பெறவும் விரிசல் ஏற்படாமல் பாதுகாக்கவும் மேல் பகுதியில் தொப்பி பொருத்தப்படுகிறது.',
          },
        ];

      case 'dental-crowns':
        return [
          {
            num: 1,
            titleEn: 'Tooth Assessment & Gentle Shaping',
            titleTa: 'பல் பரிசோதனை & வடிவமைப்பு',
            descEn: 'The tooth is gently reshaped by removing a thin outer layer of enamel so the crown can fit flush and natural.',
            descTa: 'தொப்பி இயற்கையாகவும் சரியாகவும் பொருந்தும் வகையில் பல்லின் வெளிப்புற அடுக்கு லேசாக வடிவமைக்கப்படுகிறது.',
          },
          {
            num: 2,
            titleEn: 'Optical 3D Digital Impression',
            titleTa: 'டிஜிட்டல் அளவீடு (3D Impression)',
            descEn: 'A high-precision optical wand captures a 3D digital model of your teeth without messy putty trays.',
            descTa: 'அளவெடுக்கும் மெழுகு ட்ரேக்கள் இன்றி நவீன டிஜிட்டல் ஸ்கேனர் மூலம் பற்களின் அளவுகள் துல்லியமாகப் பதிவு செய்யப்படுகிறது.',
          },
          {
            num: 3,
            titleEn: 'Secure Bonding of Lifelike Ceramic Crown',
            titleTa: 'செராமிக் பல் தொப்பி பொருத்துதல்',
            descEn: 'The custom-milled ceramic crown is bonded securely using dental adhesive resin, checked for optimal bite alignment.',
            descTa: 'தயாரிக்கப்பட்ட செராமிக் தொப்பி மருத்துவ பசை மூலம் பொருத்தப்பட்டு, கடிக்கும் சீரமைப்பு சரிபார்க்கப்படுகிறது.',
          },
        ];

      case 'deep-cleaning-scaling':
        return [
          {
            num: 1,
            titleEn: 'Periodontal Pocket Measurement & Topical Numbing',
            titleTa: 'ஈறு ஆழம் அளவீடு & மரத்துப்போகச் செய்தல்',
            descEn: 'A periodontal probe checks pocket depths around the teeth, and a soothing numbing gel is applied along the gumline.',
            descTa: 'ஈறு பைகளின் ஆழம் அளவிடப்பட்டு, நோயாளிக்கு உறுத்தல் ஏற்படாத வண்ணம் மென்மையான ஜெல் பூசப்படுகிறது.',
          },
          {
            num: 2,
            titleEn: 'Ultrasonic Calculus & Plaque Removal',
            titleTa: 'அல்ட்ராசோனிக் முறை மூலம் காரை நீக்குதல்',
            descEn: 'An ultrasonic cavitron tip vibrates at micro-frequencies with cool water to dislodge hardened tartar above and below the gumline.',
            descTa: 'நீரினால் குளிர்ந்த அல்ட்ராசோனிக் கருவி ஈறுகளுக்கு அடியில் படிந்துள்ள கடினமான காரையை எளிதாக உடைத்து நீக்குகிறது.',
          },
          {
            num: 3,
            titleEn: 'Root Planing & Gum Attachment Healing',
            titleTa: 'வேர் மேற்பரப்பை வழவழப்பாக்குதல்',
            descEn: 'The tooth root surface is gently smoothed to discourage future bacterial colonization and help gums reattach snugly.',
            descTa: 'பல்லின் வேர்ப் பகுதி சீராக்கப்பட்டு, ஈறுகள் மீண்டும் பல்லோடு இறுக்கமாக ஒட்டிக்கொள்ள வழிவகை செய்யப்படுகிறது.',
          },
        ];

      case 'single-dental-implant':
        return [
          {
            num: 1,
            titleEn: 'Cone-Beam 3D Bone Mapping & Planning',
            titleTa: '3D எலும்பு ஸ்கேன் மற்றும் திட்டம்',
            descEn: 'A specialized 3D dental scan analyzes jawbone density, width, and nerve positions with sub-millimeter precision.',
            descTa: 'தாடை எலும்பின் அடர்த்தி மற்றும் நரம்புகளின் அமைப்பை முப்பரிமாண ஸ்கேன் மூலம் துல்லியமாக ஆய்வு செய்யப்படுகிறது.',
          },
          {
            num: 2,
            titleEn: 'Gentle Titanium Fixture Placement',
            titleTa: 'டைட்டானியம் வேர் பொருத்துதல்',
            descEn: 'Under local numbing, a medical-grade titanium screw is gently positioned into the jawbone where the natural root once was.',
            descTa: 'இழந்த பல்லின் வேர் இருந்த தாடை எலும்புப் பகுதியில் டைட்டானியம் ஸ்க்ரூ கவனமாகப் பொருத்தப்படுகிறது.',
          },
          {
            num: 3,
            titleEn: 'Natural Osseointegration Healing Period',
            titleTa: 'எலும்புடன் ஒருங்கிணைதல் (Osseointegration)',
            descEn: 'Over 8-12 weeks, living bone cells naturally fuse with the titanium surface to create an immovable foundation.',
            descTa: 'எலும்பு செல்கள் டைட்டானியத்துடன் இயற்கையாக இணைந்து அதனை ஒரு உண்மையான பல் வேர் போல உறுதியாக்குகிறது.',
          },
          {
            num: 4,
            titleEn: 'Abutment Connection & Final Porcelain Crown',
            titleTa: 'அபட்மென்ட் & செராமிக் பல் பொருத்துதல்',
            descEn: 'A custom ceramic connector (abutment) and lifelike porcelain crown are attached to give you a strong, indistinguishable natural tooth.',
            descTa: 'இணைப்பு பகுதி மற்றும் அழகிய பீங்கான் பல் பொருத்தப்பட்டு, இயற்கையான பல்லை போன்ற வடிவம் தரப்படுகிறது.',
          },
        ];

      default:
        return [
          {
            num: 1,
            titleEn: 'Clinical Assessment & Preparation',
            titleTa: 'மருத்துவ பரிசோதனை & தயாரிப்பு',
            descEn: 'The dentist assesses the treatment area and ensures full patient comfort.',
            descTa: 'சிகிச்சைக்கான பகுதி பரிசோதிக்கப்பட்டு நோயாளிக்கு ஏற்றவாறு தயார் செய்யப்படுகிறது.',
          },
          {
            num: 2,
            titleEn: 'Gentle Precision Care',
            titleTa: 'துல்லியமான சிகிச்சை முறை',
            descEn: 'The treatment is carried out with modern dental instruments.',
            descTa: 'நவீன கருவிகள் கொண்டு சிகிச்சை கவனமாக செய்யப்படுகிறது.',
          },
          {
            num: 3,
            titleEn: 'Inspection & Home Care Advice',
            titleTa: 'சரிபார்த்தல் & வழிகாட்டுதல்',
            descEn: 'Final check of the treated area with clear recovery guidance.',
            descTa: 'சிகிச்சை நிறைவடைந்ததும் நோயாளிக்கான தொடர் பராமரிப்பு ஆலோசனைகள் வழங்கப்படுகின்றன.',
          },
        ];
    }
  };

  const steps = getSteps();

  // FAQs
  const faqs = [
    {
      qEn: 'Will I feel any pain during this procedure?',
      qTa: 'சிகிச்சையின் போது எனக்கு வலி தெரியுமா?',
      aEn: `With modern local anesthesia (${procedure.anesthesiaType}), the treatment area is thoroughly numbed. Most patients report feeling only mild pressure, comparable to having a routine filling.`,
      aTa: `நவீன மயக்க மருந்து முறைகள் (${procedure.anesthesiaType}) மூலம் சிகிச்சை பெறும் பகுதி மரத்துப்போவதால், நீங்கள் வலியை உணர மாட்டீர்கள். வெறும் லேசான அழுத்தம் மட்டுமே உணரக்கூடும்.`,
    },
    {
      qEn: 'How long does recovery typically take?',
      qTa: 'சிகிச்சைக்குப் பின் எத்தனை நாட்களில் இயல்பு நிலைக்குத் திரும்பலாம்?',
      aEn: `Most patients resume everyday activities the next day. Any mild local sensitivity can be comfortably addressed with standard over-the-counter pain relievers.`,
      aTa: `பெரும்பாலான நோயாளிகள் மறுநாளே தங்கள் வழக்கமான பணிகளைத் தொடரலாம். லேசான கூச்சம் அல்லது அசௌகரியம் ஓரிரு நாட்களில் தானாகவே சரியாகிவிடும்.`,
    },
    {
      qEn: 'How should I prepare before my appointment?',
      qTa: 'மருத்துவரிடம் செல்வதற்கு முன் எவ்வாறு தயாராக வேண்டும்?',
      aEn: 'Have a light meal before your visit unless instructed otherwise, brush normally, and write down any questions you want to ask your dental team.',
      aTa: 'மருத்துவர் வேறுவிதமாகக் கூறாத வரையில் லேசான உணவை உட்கொண்டு, வழக்கம்போல பல் துலக்கி செல்லலாம். உங்கள் சந்தேகங்களை குறித்து வைத்துக்கொள்ளுங்கள்.',
    },
  ];

  return (
    <div className="py-12 space-y-16">
      <Container>
        {/* Navigation Breadcrumb */}
        <Breadcrumbs
          items={[
            { label: isTamil ? 'பல் சிகிச்சைகள்' : 'Explore Treatments', href: '/explore' },
            { label: title },
          ]}
          homeLabel={isTamil ? 'முகப்பு' : 'Home'}
        />

        {/* Back Link */}
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 text-sm text-[#0D9488] font-bold hover:underline mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isTamil ? 'அனைத்து சிகிச்சைகளுக்கும் திரும்பு' : 'Back to Treatment Directory'}</span>
        </Link>

        {/* 1. DESKTOP HERO: Two-Column Side-by-Side Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16">
          {/* LEFT COLUMN: Click-to-load Video Player with Privacy Shield */}
          <div className="lg:col-span-6 space-y-4">
            <YouTubeClickToLoadPlayer
              videoId="3D-DENTAL-RCT-DEMO"
              title={title}
              thumbnailUrl={coverImageSrc}
              durationText={isTamil ? `~${procedure.durationMinutes} நிமிடங்கள்` : `${procedure.durationMinutes} min guide`}
              lang={language}
            />
          </div>

          {/* RIGHT COLUMN: Procedure Name, Key Info, Department */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="mint" className="text-xs font-bold uppercase tracking-wider">
                {procedure.primaryDepartmentName}
              </Badge>
              <Badge variant="outline" className="text-xs font-mono">
                {procedure.code}
              </Badge>
              <Badge variant="alert" className="text-xs font-semibold">
                {isTamil ? 'மருத்துவ ஆய்வு நிலுவையில் உள்ளது (வரைவு)' : 'Clinical Review Pending (Draft)'}
              </Badge>
              {procedure.has3DModel && (
                <Badge variant="default" className="text-xs gap-1">
                  <Box className="w-3.5 h-3.5" />
                  <span>{isTamil ? '3D மாதிரி சேர்க்கப்பட்டுள்ளது' : '3D Model Ready'}</span>
                </Badge>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#134E4A] tracking-tight leading-tight">
              {title}
            </h1>
            <p className="text-lg font-semibold text-[#0D9488]">
              {secondaryTitle}
            </p>

            <p className="text-base text-slate-600 leading-relaxed">
              {summary}
            </p>

            {/* Key Facts Pill Grid */}
            <div className="grid grid-cols-2 gap-4 p-5 rounded-2xl bg-white border border-teal-100 shadow-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 uppercase tracking-wider font-bold">
                  <Clock className="w-3.5 h-3.5 text-[#0D9488]" />
                  <span>{isTamil ? 'சிகிச்சை நேரம்' : 'Estimated Time'}</span>
                </div>
                <p className="text-sm font-extrabold text-[#134E4A]">
                  ~{procedure.durationMinutes} {isTamil ? 'நிமிடங்கள்' : 'minutes'}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 uppercase tracking-wider font-bold">
                  <HeartPulse className="w-3.5 h-3.5 text-[#0D9488]" />
                  <span>{isTamil ? 'மயக்க மருந்து / வசதி' : 'Comfort / Numbing'}</span>
                </div>
                <p className="text-sm font-extrabold text-[#134E4A] line-clamp-1">
                  {procedure.anesthesiaType}
                </p>
              </div>
            </div>

            {/* Clinical Disclaimer */}
            <div className="pt-2 space-y-2">
              <ClinicalDisclaimerBanner lang={language} />
              <div className="px-3.5 py-2 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed">
                <span className="font-bold">
                  {isTamil ? 'மருத்துவ மேலாண்மை அறிவிப்பு: ' : 'Content Review Status: '}
                </span>
                <span>
                  {isTamil
                    ? 'இப்பக்கத்தில் உள்ள செயல்முறைப் படிகள், தயாரிப்பு மற்றும் கவனிப்பு தகவல்கள் வரைவு நிலையில் (Draft) உள்ளன. இவை இன்னும் இறுதி மருத்துவக் குழு ஒப்புதல் பெறவில்லை. தகவல் அறியும் கல்வி நோக்கத்திற்காக மட்டுமே இது காட்சிப்படுத்தப்பட்டுள்ளது.'
                    : 'The procedure steps, preparation, and home recovery points displayed below are educational draft content pending formal clinical governance review. They do not constitute approved institutional clinical protocols.'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. SUPPORTING SECTIONS BELOW THE HERO */}
        <div className="space-y-16 max-w-4xl">
          {/* Section 1: Detailed Overview */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0D9488]">
              <Sparkles className="w-4 h-4" />
              <span>{isTamil ? 'சிகிச்சை விளக்கம்' : 'Clinical Overview'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#134E4A] tracking-tight">
              {isTamil ? '1. சிகிச்சை பற்றிய பொதுவான கண்ணோட்டம்' : '1. Procedure Overview'}
            </h2>
            <div
              className="prose prose-teal text-slate-600 leading-relaxed text-base bg-white p-6 rounded-2xl border border-teal-100/80 shadow-sm"
              dangerouslySetInnerHTML={{ __html: overviewHtml }}
            />
          </section>

          {/* Section 2: Why Recommended */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#134E4A] tracking-tight">
              {isTamil ? '2. இந்த சிகிச்சை எப்போது பரிந்துரைக்கப்படுகிறது?' : '2. Why This Procedure May Be Recommended'}
            </h2>
            <Card className="p-6 bg-white space-y-4">
              <p className="text-sm text-slate-600 leading-relaxed">
                {isTamil
                  ? 'பல்லின் உள் கட்டமைப்பு அல்லது புறப்பரப்பு தீவிரமாக பாதிக்கப்படும் போது பற்களை பிடுங்காமல் காக்க இது செய்யப்படுகிறது:'
                  : 'Dental professionals recommend this treatment when natural tooth structure is compromised but can still be effectively preserved:'}
              </p>
              <ul className="space-y-2.5 text-sm text-slate-600">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0D9488] shrink-0 mt-0.5" />
                  <span>
                    {isTamil
                      ? 'தொடர்ச்சியான கூச்சம், சூடான அல்லது குளிர்ந்த உணவுகளை உண்ணும்போது ஏற்படும் கடுமையான வலி.'
                      : 'Severe discomfort, spontaneous throbbing, or prolonged sensitivity to hot and cold.'}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0D9488] shrink-0 mt-0.5" />
                  <span>
                    {isTamil
                      ? 'ஆழமான சொத்தை பல்லின் நரம்புப் பகுதி வரை சென்று வீக்கம் அல்லது சீழ் உருவாகுதல்.'
                      : 'Deep decay encroaching on vital inner tissue or visible swelling along the root.'}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0D9488] shrink-0 mt-0.5" />
                  <span>
                    {isTamil
                      ? 'இயற்கையான பற்களை அகற்றிவிடாமல் வாழ்நாள் முழுவதும் பாதுகாத்தல்.'
                      : 'Preserving the natural tooth root to prevent bone resorption and preserve facial structure.'}
                  </span>
                </li>
              </ul>
            </Card>
          </section>

          {/* Section 3: Step-by-Step Breakdown */}
          <section className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#134E4A] tracking-tight">
              {isTamil ? '3. சிகிச்சை நிலைகள் (Step-by-Step)' : '3. Procedure Steps'}
            </h2>
            <div className="space-y-4">
              {steps.map((step) => (
                <Card key={step.num} className="p-5 flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-[#E6F7F2] text-[#0D9488] font-extrabold text-sm flex items-center justify-center shrink-0 shadow-sm border border-teal-100">
                    {step.num}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-[#134E4A]">
                      {isTamil ? step.titleTa : step.titleEn}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {isTamil ? step.descTa : step.descEn}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Section 4: 3D Anatomy Module Viewport Anchor */}
          <section className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#134E4A] tracking-tight">
                {isTamil ? '4. முப்பரிமாண (3D) உடற்கூறியல் ஆய்வு' : '4. Interactive 3D Anatomy View'}
              </h2>
              <Badge variant="mint" className="text-xs">
                {isTamil ? 'Phase 4 முன்னோட்டம்' : 'Interactive Anchor'}
              </Badge>
            </div>

            <Card className="p-8 text-center bg-gradient-to-b from-teal-50/60 to-white border-teal-100">
              <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-teal-100 flex items-center justify-center text-[#0D9488] mx-auto mb-4">
                <Box className="w-8 h-8 animate-pulse text-[#0D9488]" />
              </div>
              <h3 className="text-lg font-bold text-[#134E4A]">
                {isTamil ? 'பல் உட்புற உடற்கூறியல் மாதிரி (3D View)' : 'Cross-Sectional Dental Anatomy Model'}
              </h3>
              <p className="text-sm text-slate-500 max-w-lg mx-auto mt-2 leading-relaxed">
                {isTamil
                  ? 'பல்லின் எனாமல், டென்டின் மற்றும் நரம்பு கால்வாய்களின் முப்பரிமாண தோற்றம். முழுமையான 3D சுழலும் மாதிரி Phase 4-ல் நேரடியாக இயக்கப்படும்.'
                  : 'Structured viewport reserved for WebGL/Three.js interactive inspection. Provides clean 2D medical illustration fallbacks across all mobile browsers.'}
              </p>
            </Card>
          </section>

          {/* Section 5: Aftercare & Recovery */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#134E4A] tracking-tight">
              {isTamil ? '5. சிகிச்சைக்குப் பின் கவனிப்பு & மீட்பு' : '5. Aftercare & Home Recovery'}
            </h2>
            <Card className="p-6 bg-white space-y-3">
              <div className="flex items-center gap-2 text-[#0D9488] font-bold text-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>{isTamil ? 'எளிய மருத்துவப் பராமரிப்பு குறிப்புகள்' : 'Key Recovery Guidelines'}</span>
              </div>
              <ul className="list-disc list-inside text-sm text-slate-600 space-y-2 leading-relaxed">
                <li>
                  {isTamil
                    ? 'மயக்க மருந்து முழுமையாகக் குறையும் வரை சூடான பானங்கள் அருந்துவதையோ அல்லது சிகிச்சை பெற்ற பக்கத்தில் மெல்லுவதையோ தவிர்க்கவும்.'
                    : 'Avoid chewing on the treated side or consuming hot liquids until numbness wears off completely.'}
                </li>
                <li>
                  {isTamil
                    ? 'லேசான வலி அல்லது அசௌகரியம் இருந்தால், மருத்துவர் பரிந்துரைத்த சாதாரண வலி நிவாரணிகளைப் பயன்படுத்தலாம்.'
                    : 'Mild soreness is normal for 24-48 hours and is readily managed with standard medications.'}
                </li>
                <li>
                  {isTamil
                    ? 'சுற்றியுள்ள பற்களை வழக்கம்போல மென்மையாகத் துலக்கி வாயை தூய்மையாக வைத்திருங்கள்.'
                    : 'Continue brushing and flossing other teeth gently to maintain complete oral hygiene.'}
                </li>
              </ul>
            </Card>
          </section>

          {/* Section 6: Frequently Asked Questions */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0D9488]">
              <HelpCircle className="w-4 h-4" />
              <span>{isTamil ? 'அடிக்கடி கேட்கப்படும் கேள்விகள்' : 'Patient Questions'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#134E4A] tracking-tight">
              {isTamil ? '6. பொதுவான சந்தேகங்கள் & பதில்கள்' : '6. Frequently Asked Questions'}
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <Card key={index} className="p-5 bg-white">
                  <h3 className="font-bold text-base text-[#134E4A] mb-2">
                    {isTamil ? faq.qTa : faq.qEn}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {isTamil ? faq.aTa : faq.aEn}
                  </p>
                </Card>
              ))}
            </div>
          </section>

          {/* Section 7: Related Procedures */}
          <section className="space-y-6 pt-6 border-t border-teal-100">
            <div>
              <h2 className="text-2xl font-bold text-[#134E4A]">
                {isTamil ? '7. தொடர்புடைய பிற சிகிச்சைகள்' : '7. Related Procedures'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {isTamil
                  ? 'நோயாளிகள் தொடர்ந்து பார்வையிடும் இதர பல் சிகிச்சை வழிகாட்டிகள்.'
                  : 'Patients exploring this procedure frequently read these related clinical guides.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProcedures.map((related) => (
                <ProcedureCard key={related.id} procedure={related} lang={language} />
              ))}
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
}
