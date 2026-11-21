'use client';

import React from 'react';
import Link from 'next/link';
import { Container, Badge, ClinicalDisclaimerBanner, LiquidGlassSurface } from '@dentalvis/ui';
import { ProcedureDetail } from '@dentalvis/common';
import { CheckCircle2, Clock, ShieldCheck, HeartPulse, Sparkles, HelpCircle, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { YouTubeClickToLoadPlayer } from '@/components/YouTubeClickToLoadPlayer';
import { ProcedureCard } from '@/components/ProcedureCard';
import { ProcedureAnatomy3D } from '@/components/3d';

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
  const KNOWN_PROCEDURE_IMAGES = new Set([
    'root-canal-treatment',
    'dental-crowns',
    'deep-cleaning-scaling',
    'single-dental-implant',
    'composite-dental-fillings',
    'routine-dental-cleaning-polishing',
    'routine-tooth-extraction',
    'wisdom-tooth-extraction',
    'fixed-orthodontic-braces',
    'professional-teeth-whitening',
    'dental-sealants',
    'topical-fluoride-treatment',
    'custom-night-guard-bruxism',
    'sports-mouthguard-trauma-prevention',
    'inlays-and-onlays',
    'direct-composite-bonding',
    'pulp-capping',
    'endodontic-retreatment',
    'apicoectomy',
    'internal-tooth-bleaching',
    // Batch 3 procedures
    'gingival-flap-surgery',
    'gum-grafting',
    'crown-lengthening',
    'frenectomy',
    'socket-preservation-bone-graft',
    'alveolar-ridge-augmentation',
    'sinus-lift',
    'dental-abscess-management',
    'implant-supported-bridge',
    'full-arch-implant-restoration',
    // Batch 4 procedures
    'complete-removable-dentures',
    'removable-partial-dentures',
    'full-mouth-rehabilitation',
    'clear-aligners',
    'palatal-expander',
    'orthodontic-retainers',
    'pediatric-pulpotomy',
    'pediatric-stainless-steel-crowns',
    'pediatric-space-maintainers',
    // Batch 5 procedures
    'porcelain-veneers',
    'gingival-recontouring',
    'knocked-out-tooth-avulsion',
    'emergency-broken-tooth-repair',
    'recement-dislodged-crown-bridge',
    'nitrous-oxide-inhalation-sedation',
    'oral-sedation',
    'intravenous-dental-sedation',
    'recurrent-aphthous-ulcer-care',
  ]);
  const coverImageSrc = KNOWN_PROCEDURE_IMAGES.has(procedure.slug)
    ? `/images/procedures/${procedure.slug}.svg`
    : '/images/procedures/default-procedure.svg';

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

      case 'composite-dental-fillings':
        return [
          {
            num: 1,
            titleEn: 'Decay Removal & Cavity Cleansing',
            titleTa: 'சொத்தை நீக்கம் & துவார தூய்மைப்படுத்தல்',
            descEn: 'The dentist gently clears away diseased enamel and cleanses the internal cavity space to ensure an optimal bonding foundation.',
            descTa: 'பல்லில் உள்ள சொத்தை பகுதி மென்மையாக அகற்றப்பட்டு, புதிய அடைப்பு சரியாக ஒட்டுவதற்காக தூய்மைப்படுத்தப்படுகிறது.',
          },
          {
            num: 2,
            titleEn: 'Etching & Adhesive Micro-Bonding',
            titleTa: 'மைக்ரோ பிணைப்பு தயாரிப்பு (Etching & Bonding)',
            descEn: 'A safe conditioning gel creates micro-porosities in the enamel, followed by a liquid resin primer that chemically locks into the tooth.',
            descTa: 'பல்லின் எனாமல் மீது ஒரு மென்மையான ஜெல் பூசப்பட்டு, காம்போசிட் கலவை பல்லோடு உறுதியாக ஒட்டுவதற்கு பிணைப்பு திரவம் இடப்படுகிறது.',
          },
          {
            num: 3,
            titleEn: 'Layered Composite Resin Application',
            titleTa: 'அடுக்குமுறையில் காம்போசிட் கலவை இடுதல்',
            descEn: 'Shade-matched biocompatible composite is placed in delicate increments, sculpting natural ridges and chewing cusps.',
            descTa: 'பல்லின் இயற்கை நிறத்திற்கு ஏற்றவாறு மெல்லிய அடுக்குகளாக காம்போசிட் கலவை வைக்கப்பட்டு வடிவம் தரப்படுகிறது.',
          },
          {
            num: 4,
            titleEn: 'Blue Light Curing & Functional Bite Polish',
            titleTa: 'ஒளிக் கதிர் கெட்டிப்படுத்துதல் & மெருகூட்டல்',
            descEn: 'A focused blue curing light hardens each layer instantly. The surface is then polished until it feels glass-smooth against your tongue.',
            descTa: 'நீல நிற ஒளிக் கதிர் மூலம் கலவை உடனடியாக கெட்டியாக்கப்பட்டு, கடிக்கும் போது எந்த உறுத்தலும் இல்லாதவாறு மெருகூட்டப்படுகிறது.',
          },
        ];

      case 'routine-dental-cleaning-polishing':
        return [
          {
            num: 1,
            titleEn: 'Periodontal Screening & Plaque Assessment',
            titleTa: 'பல் & ஈறு ஆரம்ப நிலை பரிசோதனை',
            descEn: 'A comfortable inspection checks gum health, noting any focal points of surface plaque, tobacco stains, or calculus.',
            descTa: 'பற்கள் மற்றும் ஈறுகளின் ஆரோக்கியம் பரிசோதிக்கப்பட்டு, கறை மற்றும் படிவுகள் உள்ள இடங்கள் கண்டறியப்படுகின்றன.',
          },
          {
            num: 2,
            titleEn: 'Gentle Supragingival Ultrasonic Scaling',
            titleTa: 'அல்ட்ராசோனிக் மூலம் மேற்பரப்பு படிவு நீக்கம்',
            descEn: 'A smooth cavitron tip uses cool water vibrations to wash away hardened tartar above the gumline without scratching enamel.',
            descTa: 'குளிர்ந்த நீர் தெளிக்கும் அல்ட்ராசோனிக் கருவி மூலம் பற்களின் மேல் படிந்துள்ள காரை மற்றும் கறைகள் எளிதாக அகற்றப்படுகின்றன.',
          },
          {
            num: 3,
            titleEn: 'Prophy Paste Polishing & Floss Sweep',
            titleTa: 'மென்மையான பேஸ்ட் கொண்டு மெருகூட்டுதல்',
            descEn: 'A rotating soft rubber cup with fine-grit prophy paste buffs away residual stains, leaving teeth radiant and silky-smooth.',
            descTa: 'மென்மையான சுழலும் ரப்பர் கப் மற்றும் பிரத்யேக பேஸ்ட் மூலம் பற்கள் மெருகூட்டப்பட்டு இயற்கை பளபளப்பு மீட்டெடுக்கப்படுகிறது.',
          },
        ];

      case 'routine-tooth-extraction':
        return [
          {
            num: 1,
            titleEn: 'Profound Local Numbing & Tissue Relaxation',
            titleTa: 'முழுமையான மரத்துப்போகச் செய்தல்',
            descEn: 'Targeted local anesthetic surrounds the tooth, ensuring the entire area is completely numbed to sharp sensation before beginning.',
            descTa: 'சிகிச்சை முழுவதும் நீங்கள் எந்த வலியும் உணராத வண்ணம் பல்லின் சுற்றிலும் சிறந்த மயக்க மருந்து இடப்படுகிறது.',
          },
          {
            num: 2,
            titleEn: 'Gentle Socket Expansion & Elevation',
            titleTa: 'பல் வேரை மென்மையாக தளர்த்துதல்',
            descEn: 'A precision dental elevator applies controlled, gentle rocking pressure to gently expand the alveolar socket ligament.',
            descTa: 'சிறப்பு கருவி மூலம் பல்லின் வேர் பகுதியை எலும்பிலிருந்து விடுவிக்க மென்மையான அழுத்தம் செலுத்தப்படுகிறது.',
          },
          {
            num: 3,
            titleEn: 'Atraumatic Tooth Removal',
            titleTa: 'கவனமாக பல்லை அகற்றுதல்',
            descEn: 'Once loose, the tooth is lifted gently from its socket with dental forceps, protecting the neighboring bone ridges.',
            descTa: 'பல் முழுமையாக தளர்ந்ததும், சுற்றியுள்ள எலும்பு மற்றும் ஈறுகளுக்கு பாதிப்பின்றி கவனமாக வெளியில் எடுக்கப்படுகிறது.',
          },
          {
            num: 4,
            titleEn: 'Hemostasis & Protective Gauze Placement',
            titleTa: 'இரத்தக் கசிவை தடுத்து பஞ்சு வைத்தல்',
            descEn: 'The extraction socket is cleaned, inspected, and sterile gauze is positioned with bite pressure to initiate natural blood clot healing.',
            descTa: 'பல் எடுக்கப்பட்ட பகுதி சுத்தம் செய்யப்பட்டு, இரத்தக் கசிவு நின்று காயம் ஆறத் தொடங்குவதற்காக பஞ்சு வைக்கப்படுகிறது.',
          },
        ];

      case 'wisdom-tooth-extraction':
        return [
          {
            num: 1,
            titleEn: 'Anesthetic Numbing & Comfort Positioning',
            titleTa: 'முழுமையான மயக்க உணர்வு & தயாரிப்பு',
            descEn: 'The jaw region is deeply numbed with long-acting local anesthetic to guarantee complete patient comfort throughout.',
            descTa: 'ஞானப்பல் இருக்கும் பகுதி மற்றும் தாடை நரம்புகள் முழுமையாக மரத்துப்போகச் செய்யப்பட்டு நோயாளி வசதியாக உணர வைக்கப்படுகிறார்.',
          },
          {
            num: 2,
            titleEn: 'Mucosal Micro-Incision & Direct Visualization',
            titleTa: 'ஈறு பகுதியில் சிறிய துவாரம்',
            descEn: 'A tiny incision along the gumline exposes the underlying impacted crown trapped below the tissue margin.',
            descTa: 'ஈறுக்கு அடியில் சிக்கியுள்ள ஞானப்பல்லை தெளிவாகப் பார்க்க ஈறு வரிசையில் சிறிய இடைவெளி ஏற்படுத்தப்படுகிறது.',
          },
          {
            num: 3,
            titleEn: 'Precision Tooth Sectioning',
            titleTa: 'பல்லைப் பிரித்து பாதுகாப்பாக எடுத்தல்',
            descEn: 'To preserve surrounding jawbone, the tooth is sectioned into smaller segments and removed gently piece by piece.',
            descTa: 'தாடை எலும்பை சேதப்படுத்தாமல் இருக்க, ஞானப்பல் சிறிய துண்டுகளாகப் பிரிக்கப்பட்டு மென்மையாக அகற்றப்படுகிறது.',
          },
          {
            num: 4,
            titleEn: 'Antiseptic Irrigation & Dissolvable Suturing',
            titleTa: 'கிருமிநாசினி சுத்தம் & கரையும் தையல்',
            descEn: 'The surgical site is irrigated with sterile saline, and dissolvable micro-sutures protect the gum tissue as it heals.',
            descTa: 'சிகிச்சை செய்த பகுதி தூய்மையாக்கப்பட்டு, ஈறு வேகமாக ஆறுவதற்காக தானாகக் கரையும் நுண்ணிய தையல் போடப்படுகிறது.',
          },
        ];

      case 'fixed-orthodontic-braces':
        return [
          {
            num: 1,
            titleEn: 'Tooth Surface Preparation & Conditioning',
            titleTa: 'பல் மேற்பரப்பு தயாரிப்பு',
            descEn: 'Each tooth is gently cleaned and conditioned with a mild primer so brackets adhere with orthodontic strength.',
            descTa: 'பிராக்கெட்டுகள் பல்லின் மீது உறுதியாக ஒட்டுவதற்காக பற்கள் நன்கு சுத்தம் செய்யப்பட்டு தயார் செய்யப்படுகின்றன.',
          },
          {
            num: 2,
            titleEn: 'Precision Twin Bracket Bonding',
            titleTa: 'பிராக்கெட்டுகளை துல்லியமாகப் பொருத்துதல்',
            descEn: 'Individual ceramic or metal brackets are bonded to the facial center of each crown using light-cured composite adhesive.',
            descTa: 'ஒவ்வொரு பல்லின் மையப் பகுதியிலும் பிரத்யேக ஒட்டுப்பொருள் கொண்டு பிராக்கெட்டுகள் துல்லியமாக ஒட்டப்படுகின்றன.',
          },
          {
            num: 3,
            titleEn: 'Shape-Memory Archwire Threading',
            titleTa: 'நிக்கல்-டைட்டானியம் கம்பி அமைத்தல்',
            descEn: 'A flexible nickel-titanium archwire is seated into bracket slots to deliver light, continuous biological alignment forces.',
            descTa: 'பற்களை சரியான திசையில் நகர்த்துவதற்காக பிராக்கெட்டுகளின் ஊடே நெகிழ்வான கம்பிகள் பொருத்தப்படுகின்றன.',
          },
          {
            num: 4,
            titleEn: 'Elastic Ligature Securing & Comfort Guidance',
            titleTa: 'ரப்பர் வளையங்கள் & பராமரிப்பு ஆலோசனைகள்',
            descEn: 'Colored or clear elastomeric ties lock the wire in place, and soft orthodontic wax is provided to cushion mouth contours.',
            descTa: 'கம்பியைப் பிடித்து வைக்க ரப்பர் வளையங்கள் இடப்பட்டு, உதடுகள் மற்றும் கன்னங்கள் உறுத்தாமல் இருக்க மெழுகு வழங்கப்படுகிறது.',
          },
        ];

      case 'professional-teeth-whitening':
        return [
          {
            num: 1,
            titleEn: 'Baseline Shade Mapping & Pre-Polish',
            titleTa: 'தற்போதைய பல் நிற அளவீடு (Shade Guide)',
            descEn: 'A clinical shade guide records your starting tooth color, followed by a gentle pumice buff to clear superficial film.',
            descTa: 'பற்களின் தற்போதைய நிறம் பதிவு செய்யப்பட்டு, மேல்புற அழுக்குகள் லேசாக சுத்தம் செய்யப்படுகின்றன.',
          },
          {
            num: 2,
            titleEn: 'Light-Cured Gingival Barrier Protection',
            titleTa: 'ஈறுகளுக்கான பாதுகாப்பு அரண் (Gingival Barrier)',
            descEn: 'A protective resin dam is painted along the gumline and cured solid to shield delicate tissues from whitening gel.',
            descTa: 'வெளுப்பாக்கும் ஜெல் ஈறுகளில் படாமல் இருக்க, ஈறு வரிசையில் நீல நிற பாதுகாப்பு அரண் பூசி கெட்டியாக்கப்படுகிறது.',
          },
          {
            num: 3,
            titleEn: 'Active Oxygen Whitening Gel Application',
            titleTa: 'வெளுப்பாக்கும் ஜெல் இடுதல் & பளபளப்பு',
            descEn: 'Buffered active oxygen gel is applied across the teeth in controlled 15-minute intervals to dissolve intrinsic chromophore stains.',
            descTa: 'பற்களின் எனாமலை பாதிக்காமல் உட்புறக் கறைகளை உடைக்கக்கூடிய மருத்துவ ஜெல் தடவப்பட்டு பற்கள் பளபளப்பாக்கப்படுகின்றன.',
          },
        ];

      case 'dental-sealants':
        return [
          {
            num: 1,
            titleEn: 'Gentle Surface Cleaning & Polishing',
            titleTa: 'மேற்பரப்பு தூய்மைப்படுத்தல்',
            descEn: 'The tooth surface is thoroughly cleaned with pumice paste and dried to eliminate any microscopic bacterial biofilm.',
            descTa: 'பல்லின் மேல் உள்ள அழுக்குகள் மற்றும் நுண்கிருமிகள் முழுமையாக சுத்தம் செய்யப்பட்டு உலர்த்தப்படுகிறது.',
          },
          {
            num: 2,
            titleEn: 'Micro-Conditioning & Adhesive Application',
            titleTa: 'நுண் கண்டிஷனிங் & திரவ பூச்சு',
            descEn: 'A gentle conditioning gel micro-roughens the enamel grooves, followed by flowing liquid sealant resin into every fissure.',
            descTa: 'பூச்சு பல்லோடு உறுதியாக ஒட்ட உதவும் வகையில் பல்லின் மேற்பரப்பு தயாரிக்கப்பட்டு திரவ சீலண்ட் பள்ளங்களில் நிரப்பப்படுகிறது.',
          },
          {
            num: 3,
            titleEn: 'Blue Light Curing & Bite Check',
            titleTa: 'நீல ஒளி மூலம் கெட்டியாக்குதல் & பரிசோதனை',
            descEn: 'A focused blue curing light hardens the resin in seconds, creating a smooth protective shield tested for natural bite harmony.',
            descTa: 'சிறப்பு நீல ஒளி மூலம் சீலண்ட் சில வினாடிகளில் கெட்டியாக்கப்பட்டு, மெல்லும் போது சரியான இடைவெளி உள்ளதா என பரிசோதிக்கப்படுகிறது.',
          },
        ];

      case 'topical-fluoride-treatment':
        return [
          {
            num: 1,
            titleEn: 'Plaque Clearance & Enamel Drying',
            titleTa: 'பல் சுத்தம் & உலர்த்துதல்',
            descEn: 'Teeth are gently cleaned of gross surface debris and moisture-controlled with soft cotton rolls to facilitate intimate varnish contact.',
            descTa: 'பற்களின் மேற்பரப்பு சுத்தம் செய்யப்பட்டு உமிழ்நீர் இன்றி உலர்த்தப்படுகிறது.',
          },
          {
            num: 2,
            titleEn: '5% NaF Varnish Application',
            titleTa: '5% NaF வார்னிஷ் பூசுதல்',
            descEn: 'A thin layer of 5% sodium fluoride varnish (equivalent to 2.26% fluoride ion) is applied with a micro-applicator across vulnerable enamel surfaces.',
            descTa: '5% சோடியம் ஃப்ளூரைடு வார்னிஷ் (2.26% ஃப்ளூரைடு அயனிக்கு சமமானது) சிறிய பிரஷ் கொண்டு பற்களின் எனாமல் மீது கவனமாக பூசப்படுகிறது.',
          },
          {
            num: 3,
            titleEn: 'Salivary Setting & Extended Fluoride Uptake',
            titleTa: 'வார்னிஷ் கெட்டியாதல் & கனிம உட்கிரகிப்பு',
            descEn: 'The resin matrix sets quickly upon contact with oral fluids, adhering to enamel to provide sustained fluoride release and fluorapatite conversion.',
            descTa: 'உமிழ்நீர் பட்டவுடன் வார்னிஷ் நிலைபெற்று, எனாமல் படிகங்களுக்குள் தொடர்ந்து ஃப்ளூரைடை செலுத்தி அமில எதிர்ப்புத் திறனை கூட்டுகிறது.',
          },
        ];

      case 'custom-night-guard-bruxism':
        return [
          {
            num: 1,
            titleEn: 'Digital Arch Scanning & Bite Registration',
            titleTa: 'டிஜிட்டல் ஸ்கேன் & கடிப்பு அளவீடு',
            descEn: 'A high-precision 3D intraoral scan captures your upper and lower teeth relationship in resting bite position.',
            descTa: 'பற்களின் அமைப்பு மற்றும் மேல்-கீழ் தாடை பொருத்தம் நவீன 3D ஸ்கேனர் மூலம் துல்லியமாக அளவிடப்படுகிறது.',
          },
          {
            num: 2,
            titleEn: 'Custom Laboratory Thermo-Molding',
            titleTa: 'ஆய்வகத்தில் பிரத்யேக தயாரிப்பு',
            descEn: 'A dual-layer splint with a soft internal cushion and durable outer surface is precisely milled or thermoformed.',
            descTa: 'உட்புறம் மென்மையாகவும் வெளிப்புறம் உறுதியாகவும் இருக்கும் வகையில் பிரத்யேக அட்டை ஆய்வகத்தில் தயாரிக்கப்படுகிறது.',
          },
          {
            num: 3,
            titleEn: 'Clinical Delivery & Occlusal Calibration',
            titleTa: 'பொருத்திப் பார்த்தல் & சரிசெய்தல்',
            descEn: 'The dentist checks insertion, retention, and adjusts contact balance with articulation paper for effortless nocturnal breathing.',
            descTa: 'வாய் பகுதியில் அட்டை சரியாக அமர்கிறதா என சோதித்து மெல்லும் சமநிலை துல்லியமாக சரிசெய்யப்படுகிறது.',
          },
        ];

      case 'sports-mouthguard-trauma-prevention':
        return [
          {
            num: 1,
            titleEn: 'Intraoral Arch Morphology Mapping',
            titleTa: 'தாடை அமைப்பு அளவீடு',
            descEn: 'A high-definition 3D digital model maps the maxillary teeth, alveolar ridge, and gingival vestibule.',
            descTa: 'மேல் தாடை பற்கள் மற்றும் ஈறுகளின் அமைப்பு நவீன ஸ்கேனர் மூலம் பதிவு செய்யப்படுகிறது.',
          },
          {
            num: 2,
            titleEn: 'Pressure-Laminated EVA Thermo-Forming',
            titleTa: 'பல அடுக்கு பாதுகாப்பு அட்டை உருவாக்கம்',
            descEn: 'Multiple layers of energy-absorbing polymer are vacuum-formed under high pressure for uniform labial thickness.',
            descTa: 'அதிர்வை தாங்கும் பல அடுக்கு பாலிமர் கொண்டு ஆய்வகத்தில் கவசம் துல்லியமாக வடிவமைக்கப்படுகிறது.',
          },
          {
            num: 3,
            titleEn: 'Fit Verification & Airway Clearance',
            titleTa: 'பொருத்தம் சரிபார்த்தல் & மூச்சு வசதி உறுதி',
            descEn: 'The guard is verified in the mouth for comfortable retention, soft-tissue comfort, and unobstructed breathing.',
            descTa: 'கவசம் வாயில் நழுவாமல் இருப்பதும், விளையாடும் போது சீராக மூச்சுவிட முடிவதும் உறுதி செய்யப்படுகிறது.',
          },
        ];

      case 'inlays-and-onlays':
        return [
          {
            num: 1,
            titleEn: 'Decay Removal & Conservative Cavity Preparation',
            titleTa: 'சொத்தை நீக்கம் & பல்லின் தயாரிப்பு',
            descEn: 'Decayed enamel is carefully cleared, sculpting divergent cavity walls with smooth internal line angles.',
            descTa: 'சொத்தை அகற்றப்பட்டு, பல்லின் ஆரோக்கியமான பகுதிகள் சேதமடையாமல் அடைப்பு பொருந்துமாறு வடிவமைக்கப்படுகிறது.',
          },
          {
            num: 2,
            titleEn: 'High-Resolution 3D Optical Scan',
            titleTa: 'துல்லிய 3D டிஜிட்டல் ஸ்கேன்',
            descEn: 'An intraoral scanner captures the exact submillimeter preparation boundaries and opposing bite dynamics.',
            descTa: 'தயாரிக்கப்பட்ட பல்லின் நுணுக்கமான அளவுகள் டிஜிட்டல் கேமரா மூலம் ஸ்கேன் செய்யப்படுகிறது.',
          },
          {
            num: 3,
            titleEn: 'CAD/CAM Precision Ceramic Milling',
            titleTa: 'கணினி மூலம் பீங்கான் அடைப்பு உருவாக்கம்',
            descEn: 'A monolithic block of biocompatible lithium disilicate or zirconia ceramic is milled to micro-metric precision.',
            descTa: 'கணினி கட்டுப்பாட்டில் இயங்கும் இயந்திரம் மூலம் பீங்கான் அடைப்பு பல்லின் நிறத்திலேயே செதுக்கப்படுகிறது.',
          },
          {
            num: 4,
            titleEn: 'Adhesive Resin Cementation & Polish',
            titleTa: 'பசை கொண்டு பொருத்துதல் & மெருகூட்டல்',
            descEn: 'The restoration is bonded with dual-cure composite resin cement, checked with bite film, and polished glass-smooth.',
            descTa: 'பீங்கான் அடைப்பு பல்லோடு உறுதியாக ஒட்டப்பட்டு பல்லின் இயற்கையான தோற்றத்திற்கு ஏற்ப மெருகூட்டப்படுகிறது.',
          },
        ];

      case 'direct-composite-bonding':
        return [
          {
            num: 1,
            titleEn: 'Shade Matching & Gentle Enamel Etching',
            titleTa: 'பல் நிற தேர்வு & மேற்பரப்பு தயாரிப்பு',
            descEn: 'The doctor selects matching multi-chromatic composite shades under natural light and lightly etches the enamel surface.',
            descTa: 'பல்லின் நிறத்திற்கு ஏற்ப துல்லியமாக பிசின் நிறம் தேர்ந்தெடுக்கப்பட்டு பல்லின் மேற்பரப்பு லேசாக சுத்தம் செய்யப்படுகிறது.',
          },
          {
            num: 2,
            titleEn: 'Layered Resin Sculpting & Blue Light Curing',
            titleTa: 'அடுக்கு பிசின் வடிவமைப்பு & கெட்டியாக்குதல்',
            descEn: 'Dentist sculpts dentin and enamel-mimicking composite layers, curing each stratum with focused blue light.',
            descTa: 'பல்லின் இயற்கை வடிவத்திற்கு ஏற்ப பிசின் மென்மையாக செதுக்கப்பட்டு நீல ஒளிக் கதிர் மூலம் உறுதியாக்கப்படுகிறது.',
          },
          {
            num: 3,
            titleEn: 'Anatomical Contouring & Diamond Glaze Polish',
            titleTa: 'வடிவமைப்பு & பளபளப்பான மெருகூட்டல்',
            descEn: 'Fine carbide finishing burs contour natural developmental grooves, followed by multi-step polishing discs for a mirror gloss.',
            descTa: 'பற்கள் இயற்கை பற்களைப் போலவே கண்ணாடி போல பளபளப்பாக இருக்க பிரத்யேக மெருகூட்டும் கருவிகள் மூலம் சீரமைக்கப்படுகிறது.',
          },
        ];

      case 'pulp-capping':
        return [
          {
            num: 1,
            titleEn: 'Microscopic Caries Debridement & Pulp Exposure Assessment',
            titleTa: 'சொத்தை நீக்கம் & நரம்பு நிலை பரிசோதனை',
            descEn: 'The doctor gently removes deep infected dentin under magnification, assessing pulp vascularity and bleeding control.',
            descTa: 'நரம்புப் பகுதிக்கு அருகில் உள்ள சொத்தை கவனமாக அகற்றப்பட்டு நரம்பின் இரத்த ஓட்டம் மற்றும் ஆரோக்கியம் பரிசோதிக்கப்படுகிறது.',
          },
          {
            num: 2,
            titleEn: 'Bioactive Calcium Silicate (MTA) Placement',
            titleTa: 'பயோ ஆக்டிவ் தாது மருந்து வைத்தல்',
            descEn: 'A mineral trioxide aggregate (MTA) or calcium hydroxide dressing is gently placed directly over the vulnerable pulp tissue.',
            descTa: 'நரம்பு திசுவின் மேல் புதிய எலும்பு அடுக்கு உருவாக தூண்டும் சிறப்பு பயோ-செராமிக் மருந்து மென்மையாக வைக்கப்படுகிறது.',
          },
          {
            num: 3,
            titleEn: 'Hermetic Glass Ionomer Base & Coronal Seal',
            titleTa: 'இறுக்கமான அடைப்பு & பாதுகாப்பு பூச்சு',
            descEn: 'A glass ionomer protective liner seals the medicament hermetically against bacteria, followed by an aesthetic composite restoration.',
            descTa: 'மருந்தின் மேல் பாக்டீரியா புகாத வண்ணம் சிறப்பு சிமெண்ட் மற்றும் காம்போசிட் அடைப்பு இடப்பட்டு சீல் செய்யப்படுகிறது.',
          },
        ];

      case 'endodontic-retreatment':
        return [
          {
            num: 1,
            titleEn: 'Coronal Access & Removal of Old Restorative Core',
            titleTa: 'உட்புகுதல் & பழைய அடைப்பை அகற்றுதல்',
            descEn: 'The doctor creates access through the crown and safely dissolves previous gutta-percha filling materials.',
            descTa: 'பல்லின் மேல் பகுதி வழியாக கால்வாய்களை அடைந்ததும் பழைய சீலிங் பொருட்கள் முழுமையாக அகற்றப்படுகின்றன.',
          },
          {
            num: 2,
            titleEn: 'Microscopic Exploration for Hidden Canals',
            titleTa: 'நுண் கால்வாய்களை கண்டறிதல்',
            descEn: 'Operating microscope illumination visualizes complex canal branchings, calcifications, or previously untreated canals.',
            descTa: 'மைக்ரோஸ்கோப் வெளிச்சத்தில் பல்லின் மறைக்கப்பட்ட நுண்ணிய கால்வாய்கள் துல்லியமாக தேடிக் கண்டுபிடிக்கப்படுகின்றன.',
          },
          {
            num: 3,
            titleEn: 'Advanced Ultrasonic Irrigation & Disinfection',
            titleTa: 'அல்ட்ராசோனிக் கிருமிநாசினி சுத்தம்',
            descEn: 'Acoustic micro-streaming irrigants reach deep into microscopic canal webs to eradicate persistent resistant bacteria.',
            descTa: 'அதிநவீன அல்ட்ராசோனிக் கருவிகள் மூலம் கால்வாய்களின் அனைத்து மூலைகளிலும் உள்ள கிருமிகள் அழிக்கப்படுகின்றன.',
          },
          {
            num: 4,
            titleEn: 'Three-Dimensional Bioceramic Obturation',
            titleTa: 'முப்பரிமாண பயோ-செராமிக் சீலிங்',
            descEn: 'Canals are hermetically refilled with warm biocompatible gutta-percha and sealer, topped with a protective core.',
            descTa: 'கிருமி நீக்கம் செய்யப்பட்ட கால்வாய்கள் மீண்டும் தொற்று ஏற்படாத வண்ணம் பயோ-செராமிக் கொண்டு முழுமையாக சீல் செய்யப்படுகிறது.',
          },
        ];

      case 'apicoectomy':
        return [
          {
            num: 1,
            titleEn: 'Micro-Surgical Flap & Bone Window Opening',
            titleTa: 'ஈறு திறப்பு & சிறிய எலும்பு சாளரம் அமைத்தல்',
            descEn: 'A tiny incision in the gum tissue reveals the underlying bone, creating a small access window directly to the infected root apex.',
            descTa: 'ஈறில் சிறிய கீறல் மூலம் தொற்று உள்ள வேர் முனைப் பகுதியை நேரடியாக சென்றடையும் வழி அமைக்கப்படுகிறது.',
          },
          {
            num: 2,
            titleEn: 'Root Tip Resection (3mm Apical Removal)',
            titleTa: 'வேர் முனை வெட்டுதல் (3 மிமீ)',
            descEn: 'The doctor precisely resects the terminal 3mm of the infected root tip containing complex microscopic ramifications.',
            descTa: 'தொற்று மறைந்திருக்க வாய்ப்புள்ள வேரின் கடைசி 3 மிமீ முனை பகுதி துல்லியமாக வெட்டி அகற்றப்படுகிறது.',
          },
          {
            num: 3,
            titleEn: 'Ultrasonic Retrograde Canal Preparation',
            titleTa: 'அல்ட்ராசோனிக் மூலம் பின்னோக்கி சுத்தம் செய்தல்',
            descEn: 'A micro-angled ultrasonic tip cleans a 3mm depth cavity within the remaining root canal from the bottom upward.',
            descTa: 'சிறிய அல்ட்ராசோனிக் கருவி மூலம் வேரின் உள் பகுதி பின்னோக்கி ஆழமாக சுத்தப்படுத்தப்படுகிறது.',
          },
          {
            num: 4,
            titleEn: 'Bioceramic Retro-Fill & Micro-Suturing',
            titleTa: 'பயோ-செராமிக் சீலிங் & தையல் போடுதல்',
            descEn: 'A biocompatible mineral trioxide aggregate (MTA) retrograde filling seals the root end, followed by delicate micro-sutures.',
            descTa: 'வேர் முனை பயோ-செராமிக் கொண்டு நிரந்தரமாக மூடப்பட்டு ஈறுகள் மெல்லிய தையல்கள் மூலம் மீண்டும் இணைக்கப்படுகின்றன.',
          },
        ];

      case 'internal-tooth-bleaching':
        return [
          {
            num: 1,
            titleEn: 'Access Cavity & Cervical Barrier Placement',
            titleTa: 'உட்புற அணுகல் & பாதுகாப்பு தடுப்பு',
            descEn: 'Coronal access is re-established and an effective cervical mechanical barrier (~2 mm of glass ionomer at the CEJ level) is placed over the gutta-percha to prevent external cervical resorption.',
            descTa: 'பல்லின் பின்புறம் வழி திறக்கப்பட்டு, வேர் பகுதிக்கு மருந்து கசிந்து வெளி வேர் அரிப்பு ஏற்படாமல் தடுக்க சுமார் 2 மிமீ தடிமனில் கிளாஸ் ஐயோனோமர் தடுப்பு அமைக்கப்படுகிறது.',
          },
          {
            num: 2,
            titleEn: 'Intracoronal Oxidizing Paste Placement',
            titleTa: 'உட்புற ஆக்சிஜனேற்ற மருந்து வைத்தல்',
            descEn: 'An oxidizing whitening paste (e.g. sodium perborate mixture) is placed inside the coronal chamber and tightly sealed with a temporary restoration.',
            descTa: 'நிறமாற்றத்தை நீக்கும் ஆக்சிஜனேற்ற மருந்து பல்லின் அறையினுள் வைக்கப்பட்டு தற்காலிக அடைப்பால் கசியாமல் மூடப்படுகிறது.',
          },
          {
            num: 3,
            titleEn: 'Aesthetic Shade Assessment & Definitive Adhesive Restoration',
            titleTa: 'நிறம் சரிபார்த்தல் & நிரந்தர அடைப்பு',
            descEn: 'Upon achieving the desired shade (typically in 1–3 intervals), the agent is thoroughly rinsed and the chamber is permanently restored with adhesive composite resin.',
            descTa: 'விரும்பிய இயற்கை வெண்மை கிடைத்தவுடன் மருந்து அகற்றப்பட்டு, பல்லின் நிறத்திலான காம்போசிட் கொண்டு நிரந்தரமாக அடைக்கப்படுகிறது.',
          },
        ];

      case 'gingival-flap-surgery':
        return [
          {
            num: 1,
            titleEn: 'Profound Local Anesthesia & Sulcular Incision',
            titleTa: 'மரத்துப்போகும் மருந்து & மெல்லிய ஈறு கீறல்',
            descEn: 'The area is fully numbed and a delicate sulcular incision is made along the gingival margin to initiate flap access.',
            descTa: 'சிகிச்சை பகுதி மரத்துப்போக செய்யப்பட்டு, ஈறு விளிம்பில் மெல்லிய நுண் கீறல் போடப்படுகிறது.',
          },
          {
            num: 2,
            titleEn: 'Full-Thickness Flap Elevation',
            titleTa: 'ஈறு திசுவை மென்மையாக விலக்குதல்',
            descEn: 'The gum tissue is gently elevated back from the teeth, revealing subgingival calculus and alveolar bone defects.',
            descTa: 'பற்கள் மற்றும் எலும்பு பரப்பை தெளிவாகப் பார்க்க ஈறு திசு மென்மையாக விலக்கப்படுகிறது.',
          },
          {
            num: 3,
            titleEn: 'Ultrasonic Debridement & Root Planing',
            titleTa: 'அல்ட்ராசோனிக் மூலம் காரை மற்றும் தொற்று நீக்கம்',
            descEn: 'Micro-ultrasonic tips and specialized curettes meticulously debride bacterial biofilm and smooth contaminated root surfaces.',
            descTa: 'நுண் கருவிகள் கொண்டு வேர் பரப்புகளில் படிந்துள்ள கடினமான காரைகள் மற்றும் நச்சுக்கள் நீக்கப்பட்டு சமன் செய்யப்படுகிறது.',
          },
          {
            num: 4,
            titleEn: 'Flap Repositioning & Primary Micro-Suturing',
            titleTa: 'ஈறு மீளமைத்தல் & தையல் போடுதல்',
            descEn: 'The gum flap is repositioned snug against the teeth and secured with delicate sutures to promote rapid healing and pocket closure.',
            descTa: 'ஈறுகள் பற்களைச் சுற்றி மீண்டும் நேர்த்தியாக பொருத்தப்பட்டு நுண்ணிய தையல்களால் மூடப்படுகிறது.',
          },
        ];

      case 'gum-grafting':
        return [
          {
            num: 1,
            titleEn: 'Recipient Bed Preparation & Root Planing',
            titleTa: 'ஈறு பெறும் பகுதி தயாரிப்பு & வேர் சுத்தம்',
            descEn: 'The exposed root surface is gently planed and chemically conditioned while a tiny recipient pouch is created in the surrounding gum.',
            descTa: 'வெளிப்பட்ட வேர் பகுதி சுத்தப்படுத்தப்பட்டு, புதிய திசுவை ஏற்பதற்குரிய சிறிய அறை ஈறுகளில் உருவாக்கப்படுகிறது.',
          },
          {
            num: 2,
            titleEn: 'Subepithelial Donor Tissue Harvesting',
            titleTa: 'அண்ணப் பகுதியில் இருந்து மெல்லிய திசு எடுத்தல்',
            descEn: 'A paper-thin layer of subepithelial connective tissue is gently harvested from the roof of the mouth with minimal surface disruption.',
            descTa: 'அண்ணத்தின் உள்பகுதியில் இருந்து சிறிய அளவில் ஆரோக்கியமான இணைப்பு திசு பாதுகாப்பாக எடுக்கப்படுகிறது.',
          },
          {
            num: 3,
            titleEn: 'Graft Placement & Micro-Suturing',
            titleTa: 'திசு ஒட்டு பொருத்துதல் & தையலிடுதல்',
            descEn: 'The donor tissue is tucked securely into the recipient bed over the exposed root and stabilized with microscopic sling sutures.',
            descTa: 'எடுக்கப்பட்ட திசு வெளிப்பட்ட வேரின் மேல் சரியாக பொருத்தப்பட்டு மெல்லிய தையல்கள் மூலம் நிலைநிறுத்தப்படுகிறது.',
          },
          {
            num: 4,
            titleEn: 'Vascular Integration & Keratinized Healing',
            titleTa: 'இரத்த ஓட்ட இணைப்பு & புதிய ஈறு உருவாக்கம்',
            descEn: 'Capillaries rapidly vascularize the graft, forming a thick, healthy band of attached keratinized gum that permanently protects the tooth.',
            descTa: 'சில நாட்களில் புதிய இரத்த நாளங்கள் இணைந்து, வேரை மூடி உறுதியான புதிய ஈறு உருவாகிறது.',
          },
        ];

      case 'crown-lengthening':
        return [
          {
            num: 1,
            titleEn: 'Restorative Planning & Sounding Analysis',
            titleTa: 'மருத்துவ திட்டமிடல் & ஆழம் கணித்தல்',
            descEn: 'The doctor evaluates the biological width requirements and plans the exact millimeter clearance needed for your future crown.',
            descTa: 'பல் கேப் போடுவதற்கு தேவையான சரியான மில்லிமீட்டர் இடைவெளியை மருத்துவர் முன்கூட்டியே கணக்கிடுகிறார்.',
          },
          {
            num: 2,
            titleEn: 'Conservative Gingival Recontouring',
            titleTa: 'ஈறு விளிம்பு மறுசீரமைப்பு',
            descEn: 'Excess or uneven gum tissue is micro-surgically contoured to establish symmetrical, aesthetic gum architecture.',
            descTa: 'அதிகமாக உள்ள அல்லது சீரற்ற ஈறு திசுக்கள் மென்மையாக நீக்கப்பட்டு அழகிய வளைவு அமைக்கப்படுகிறது.',
          },
          {
            num: 3,
            titleEn: 'Minimal Alveolar Bone Ostectomy',
            titleTa: 'சிறிய அளவு எலும்பு சமன் செய்தல்',
            descEn: 'A microscopic rim of bone is gently recontoured to establish a healthy 2-3mm biologic zone between the bone and restoration margin.',
            descTa: 'கேப் மற்றும் எலும்புக்கு இடையே ஆரோக்கியமான இடைவெளி இருக்க மிகக் குறைந்த அளவு எலும்பு மறுவடிவமைக்கப்படுகிறது.',
          },
          {
            num: 4,
            titleEn: 'Flap Adaptation & Provisional Stabilization',
            titleTa: 'ஈறு பொருத்துதல் & தற்காலிக பாதுகாப்பு',
            descEn: 'Tissues are stabilized with fine sutures, allowing sound supragingival tooth structure to heal completely prior to crown fabrication.',
            descTa: 'திசுக்கள் தையல்களால் மூடப்பட்டு, புதிய கேப் தயாரிப்பதற்கு முன்பாக முழுமையாக ஆற அனுமதிக்கப்படுகிறது.',
          },
        ];

      case 'frenectomy':
        return [
          {
            num: 1,
            titleEn: 'Targeted Numbing & Tension Release',
            titleTa: 'மரத்துப்போகச் செய்தல் & தசை தளர்த்துதல்',
            descEn: 'A small dab of topical gel and minimal anesthetic renders the frenum completely numb before gentle release begins.',
            descTa: 'சிறிதளவு மரத்துப்போகும் மருந்து மூலம் இணைப்பு திசு வலி ஏதுமின்றி முழுமையாக மரத்துப்போக செய்யப்படுகிறது.',
          },
          {
            num: 2,
            titleEn: 'Precision Excision / Soft-Tissue Laser Release',
            titleTa: 'துல்லியமான இணைப்பு நீக்கம் / லேசர் சிகிச்சை',
            descEn: 'The restrictive band of connective tissue is released with micro-surgical scissors or a gentle dental laser in seconds.',
            descTa: 'இறுக்கமாக உள்ள தசை இணைப்பு சில விநாடிகளில் நுண் கருவி அல்லது லேசர் மூலம் எளிதாக தளர்த்தப்படுகிறது.',
          },
          {
            num: 3,
            titleEn: 'Immediate Mobility Check & Rapid Healing',
            titleTa: 'நாக்கு/உதடு அசைவு சோதனை & விரைவு குணம்',
            descEn: 'Full unhindered tongue or lip mobility is immediately verified, requiring only minimal self-dissolving micro-sutures or laser seal.',
            descTa: 'உதடு அல்லது நாக்கின் இயல்பான அசைவு உடனடியாக உறுதி செய்யப்பட்டு விரைவாக குணமாக வழிகாட்டப்படுகிறது.',
          },
        ];

      case 'socket-preservation-bone-graft':
        return [
          {
            num: 1,
            titleEn: 'Atraumatic Tooth Removal',
            titleTa: 'சேதமில்லா மென்மையான பல் பிடுங்குதல்',
            descEn: 'The damaged tooth is extracted with micro-luxators to preserve the delicate, thin surrounding socket bone walls intact.',
            descTa: 'எலும்பு சுவர் உடைந்துவிடாதவாறு மென்மையான நவீன கருவிகள் கொண்டு பல் பாதுகாப்பாக எடுக்கப்படுகிறது.',
          },
          {
            num: 2,
            titleEn: 'Debridement & Granulation Curettage',
            titleTa: 'குழி சுத்தம் & கிருமி நீக்கம்',
            descEn: 'The extraction socket is gently curetted of residual inflammatory tissue and rinsed with sterile antibacterial irrigant.',
            descTa: 'பல் எடுக்கப்பட்ட குழி கிருமிகள் இன்றி முழுமையாக சுரண்டப்பட்டு சுத்தப்படுத்தப்படுகிறது.',
          },
          {
            num: 3,
            titleEn: 'Osteoconductive Mineral Packing',
            titleTa: 'எலும்பு துகள்கள் நிரப்புதல்',
            descEn: 'Sterile, mineralized bone graft particles are gently condensed into the socket to scaffold new bone formation.',
            descTa: 'புதிய எலும்பு உருவாவதற்கு ஆதரவாக பிரத்யேக மருத்துவ எலும்பு துகள்கள் குழியினுள் நிரப்பப்படுகின்றன.',
          },
          {
            num: 4,
            titleEn: 'Collagen Barrier Seal & Stabilization',
            titleTa: 'கொலாஜன் படலம் வைத்தல் & தையல்',
            descEn: 'A resorbable collagen plug or membrane covers the bone graft, secured with cross-stitch sutures to protect the site during healing.',
            descTa: 'எலும்பு துகள்கள் வெளியேறாமல் இருக்க கொலாஜன் படலம் வைக்கப்பட்டு தையல்களால் பாதுகாப்பாக மூடப்படுகிறது.',
          },
        ];

      case 'alveolar-ridge-augmentation':
        return [
          {
            num: 1,
            titleEn: 'Full Exposure & Cortical Perforation',
            titleTa: 'எலும்பு வெளிப்படுத்துதல் & நுண் துளையிடல்',
            descEn: 'The atrophic jawbone ridge is surgically exposed and tiny micro-perforations are made to stimulate angiogenic healing factors.',
            descTa: 'தேய்ந்துபோன எலும்பு பகுதி அணுகப்பட்டு, இரத்த ஓட்டம் மற்றும் புதிய செல்களை ஈர்க்க சிறிய நுண் துளைகள் இடப்படுகின்றன.',
          },
          {
            num: 2,
            titleEn: 'Scaffold Graft Material Placement',
            titleTa: 'எலும்பு ஒட்டு சாரம் அமைத்தல்',
            descEn: 'A tailored blend of autogenous and mineralized biomaterials is adapted against the deficient ridge to restore natural contours.',
            descTa: 'இழக்கப்பட்ட எலும்பு உயரத்தையும் அகலத்தையும் மீளமைக்க பிரத்யேக எலும்பு ஒட்டு கலவை வைக்கப்படுகிறது.',
          },
          {
            num: 3,
            titleEn: 'Titanium-Reinforced Barrier Membrane Fixation',
            titleTa: 'டைட்டானியம் பாதுகாப்பு படலம் நிலைநிறுத்துதல்',
            descEn: 'A protective barrier membrane is securely pinned with titanium micro-tacks to prevent soft-tissue cellular infiltration.',
            descTa: 'ஈறு செல்கள் உள்ளே புகாமல் தடுக்க பாதுகாப்பு படலம் டைட்டானியம் ஊசிகளால் உறுதியாக பொருத்தப்படுகிறது.',
          },
          {
            num: 4,
            titleEn: 'Tension-Free Primary Closure',
            titleTa: 'இழுப்பின்றி சீரான தையல் மூடல்',
            descEn: 'The overlying gum is released and carefully sutured without tension to guarantee protected, undisturbed bone regeneration.',
            descTa: 'ஈறுகள் எவ்வித அழுத்தமும் இன்றி தையல்கள் மூலம் இணைக்கப்பட்டு 4 முதல் 9 மாதங்கள் எலும்பு உருவாக அனுமதிக்கப்படுகிறது.',
          },
        ];

      case 'sinus-lift':
        return [
          {
            num: 1,
            titleEn: 'Maxillary Lateral Window / Crestal Access',
            titleTa: 'மேல் தாடை சைனஸ் அணுகல் துவாரம்',
            descEn: 'A tiny, oval lateral window is prepared through the upper jaw bone using gentle piezoelectric ultrasonic instruments.',
            descTa: 'அதிநவீன அல்ட்ராசோனிக் கருவி கொண்டு மேல் தாடை எலும்பில் சிறிய துவாரம் மென்மையாக அமைக்கப்படுகிறது.',
          },
          {
            num: 2,
            titleEn: 'Schneiderian Membrane Elevation',
            titleTa: 'சைனஸ் சவ்வை சேதமின்றி உயர்த்துதல்',
            descEn: 'The delicate sinus lining (Schneiderian membrane) is carefully elevated intact from the bony sinus floor using blunt instruments.',
            descTa: 'சைனஸ் காற்றுப்பையின் மெல்லிய சவ்வு கிழியாதவாறு எலும்பின் தரைப்பகுதியில் இருந்து லேசாக மேலே உயர்த்தப்படுகிறது.',
          },
          {
            num: 3,
            titleEn: 'Biocompatible Bone Graft Packing',
            titleTa: 'எலும்பு ஒட்டுப் பொருள் நிரப்புதல்',
            descEn: 'The created compartment beneath the elevated membrane is packed with osteoconductive bone graft particulate to build vertical height.',
            descTa: 'உயர்த்தப்பட்ட சவ்வின் கீழ் உருவான புதிய வெற்றிடத்தில் எலும்பு துகள்கள் கவனமாக நிரப்பப்படுகின்றன.',
          },
          {
            num: 4,
            titleEn: 'Window Membrane Barrier & Closure',
            titleTa: 'துவாரத்தை மூடுதல் & தையல் போடுதல்',
            descEn: 'A collagen barrier covers the surgical window before the gum is sutured closed, allowing 6 months for dense bone maturation.',
            descTa: 'துவாரம் கொலாஜன் படலத்தால் மூடப்பட்டு ஈறுகள் தைக்கப்படுகின்றன; 6 மாதங்களில் புதிய எலும்பு உருவாகிறது.',
          },
        ];

      case 'dental-abscess-management':
        return [
          {
            num: 1,
            titleEn: 'Targeted Anesthesia & Diagnostic Localization',
            titleTa: 'மரத்துப்போகச் செய்தல் & சீழ்கட்டியை கணித்தல்',
            descEn: 'Targeted nerve block or perimeter anesthesia is achieved without injecting directly into acidic infected abscess fluid.',
            descTa: 'தொற்று பரவியுள்ள பகுதியில் நேரடியாக ஊசி போடாமல், சுற்றியுள்ள நரம்புகளை மருத்துவர் மரத்துப்போக செய்கிறார்.',
          },
          {
            num: 2,
            titleEn: 'Targeted Incision & Purulence Evacuation',
            titleTa: 'கீறி சீழை உடனடியாக வெளியேற்றுதல்',
            descEn: 'A small micro-incision at the point of greatest fluctuance allows immediate, pain-relieving decompression of built-up pus.',
            descTa: 'சீழ்கட்டியின் மையப்பகுதியில் சிறிய கீறல் இடப்பட்டு, கடுமையான அழுத்தமும் வலியும் நீங்கும் வகையில் சீழ் வெளியேற்றப்படுகிறது.',
          },
          {
            num: 3,
            titleEn: 'Copious Saline Irrigation & Drain Placement',
            titleTa: 'கிருமிநாசினி கழுவல் & வடிகால் குழாய் அமைத்தல்',
            descEn: 'The infected space is thoroughly flushed with sterile saline; a small rubber drain may be placed to keep the channel open.',
            descTa: 'அறை முழுமையாக சுத்தப்படுத்தப்பட்டு, மீதமுள்ள திரவங்கள் தொடர்ந்து வெளியேற சிறிய ரப்பர் வடிகால் வைக்கப்படுகிறது.',
          },
          {
            num: 4,
            titleEn: 'Definitive Etiological Treatment & Systemic Care',
            titleTa: 'மூல காரணத்தை சரிசெய்தல் & மருந்துகள்',
            descEn: 'The causative tooth undergoes emergency access or extraction, paired with antibiotic therapy when systemic spreading signs exist.',
            descTa: 'சீழ் பிடித்த பல்லுக்கு வேர் சிகிச்சை அல்லது அகற்றுதல் செய்யப்படுகிறது; தேவைப்பட்டால் ஆன்டிபயாடிக் மருந்துகள் வழங்கப்படுகின்றன.',
          },
        ];

      case 'implant-supported-bridge':
        return [
          {
            num: 1,
            titleEn: 'Strategic Implant Site Preparation',
            titleTa: 'இம்பிளான்ட் வைக்கும் இடம் தயாரிப்பு',
            descEn: 'Two or more dental implants are surgically positioned at the boundary ends of the missing tooth gap into sound bone.',
            descTa: 'பற்கள் இல்லாத இடைவெளியின் இரு முனைகளிலும் தாடை எலும்பினுள் இம்பிளான்ட்டுகள் துல்லியமாக பொருத்தப்படுகின்றன.',
          },
          {
            num: 2,
            titleEn: 'Osseointegration & Abutment Connection',
            titleTa: 'எலும்புடன் இணைதல் & இணைப்பு பகுதி பொருத்துதல்',
            descEn: 'Following healing and osseointegration, precision titanium abutments are securely screwed into each implant body.',
            descTa: 'இம்பிளான்ட் எலும்புடன் உறுதியாக இணைந்த பின், அதன் மேல் பல் பாலத்தை தாங்கும் இணைப்புகள் பொருத்தப்படுகின்றன.',
          },
          {
            num: 3,
            titleEn: 'Digital 3D Bridge Fabrication',
            titleTa: 'டிஜிட்டல் முறையில் பல் பாலம் தயாரித்தல்',
            descEn: 'An optical scan guides CAD/CAM milling of a monolithic zirconia bridge with natural tooth shades and functional cusps.',
            descTa: 'டிஜிட்டல் ஸ்கேன் அடிப்படையில் மெல்லும் ஆற்றல் கொண்ட உறுதியான ஜிர்கோனியா பல் பாலம் ஆய்வகத்தில் வடிவமைக்கப்படுகிறது.',
          },
          {
            num: 4,
            titleEn: 'Passive Fit Verification & Retention Locking',
            titleTa: 'பொருத்தம் சரிபார்த்தல் & நிரந்தர சீல்',
            descEn: 'The doctor confirms effortless passive seated fit, equilibrates chewing forces, and firmly torques the retaining screws.',
            descTa: 'பாலம் அசைவின்றி கச்சிதமாக அமர்வது உறுதி செய்யப்பட்டு திருகுகள் மூலம் நிரந்தரமாக பூட்டப்படுகிறது.',
          },
        ];

      case 'full-arch-implant-restoration':
        return [
          {
            num: 1,
            titleEn: 'Guided 3D Surgical Implant Placement',
            titleTa: 'வழிகாட்டப்பட்ட 3D இம்பிளான்ட் பொருத்துதல்',
            descEn: 'Four to six implants are strategically inserted into dense jawbone using a stereolithographic 3D surgical guide.',
            descTa: 'முழு தாடையிலும் 4 அல்லது 6 இம்பிளான்ட்டுகள் 3D டிஜிட்டல் வழிகாட்டி மூலம் மிகத்துல்லியமாக பொருத்தப்படுகின்றன.',
          },
          {
            num: 2,
            titleEn: 'Multi-Unit Abutment Equilibrations',
            titleTa: 'கோண சரிசெய்ப்பு மற்றும் இணைப்புகள்',
            descEn: 'Angled multi-unit abutments compensate for tilted posterior implants, creating a level, parallel prosthetic platform.',
            descTa: 'சாய்வாக வைக்கப்பட்ட இம்பிளான்ட்டுகளின் கோணங்களை சரிசெய்து பாலத்தை நேராகத் தாங்கும் இணைப்புகள் பொருத்தப்படுகின்றன.',
          },
          {
            num: 3,
            titleEn: 'Same-Day Provisional Immediate Loading',
            titleTa: 'அன்றைய தினமே தற்காலிக பற்கள் பொருத்துதல்',
            descEn: 'When primary stability is achieved, a rigid provisional bridge is screwed into place immediately so you never leave without teeth.',
            descTa: 'இம்பிளான்ட் உறுதியாக அமையும் பட்சத்தில், உடனடியாக தற்காலிக முழு பற்கள் பாலம் திருகப்பட்டு அன்றே மெல்ல அனுமதிக்கப்படுகிறது.',
          },
          {
            num: 4,
            titleEn: 'Definitive Zirconia Full-Arch Delivery',
            titleTa: 'நிரந்தர ஜிர்கோனியா முழு பாலம் பொருத்துதல்',
            descEn: 'After 3 to 6 months of bone integration, the definitive custom-milled monolithic zirconia prosthesis is torqued into place.',
            descTa: 'எலும்பு முழுமையாக ஆறிய பின், அழகிய மற்றும் அதிக ஆயுள் கொண்ட நிரந்தர முழு தாடை பற்கள் பாலம் பொருத்தப்படுகிறது.',
          },
        ];

      case 'complete-removable-dentures':
        return [
          {
            num: 1,
            titleEn: 'Preliminary & Border-Molded Secondary Impressions',
            titleTa: 'துல்லியமான ஆரம்ப மற்றும் இறுதி அளவீடுகள்',
            descEn: 'Custom impression trays and border molding capture dynamic muscular movements and the peripheral seal of the edentulous ridge.',
            descTa: 'தாடையின் விளிம்புகள் மற்றும் மென்மையான தசை அசைவுகளை மிகத்துல்லியமாகப் பதிவு செய்ய அளவீடுகள் எடுக்கப்படுகின்றன.',
          },
          {
            num: 2,
            titleEn: 'Jaw Relation & Vertical Dimension Registration',
            titleTa: 'தாடை இயக்கம் & முக உயரத்தை பதிவு செய்தல்',
            descEn: 'Wax bite blocks record your precise rest position, vertical face height, and harmonious jaw relation (centric relation).',
            descTa: 'இயற்கையான முக உயரம் மற்றும் தாடை மூட்டின் சரியான நிலை (Centric Relation) மெழுகு மாதிரிகள் கொண்டு பதிவு செய்யப்படுகிறது.',
          },
          {
            num: 3,
            titleEn: 'Aesthetic Wax Try-In Verification',
            titleTa: 'மாதிரி பற்கள் பொருத்திப் பார்த்தல் (Try-In)',
            descEn: 'Artificial teeth set in wax are tried in your mouth to verify perfect smile appearance, speech phonetics, and chewing bite.',
            descTa: 'மெழுகில் அமைக்கப்பட்ட செயற்கைப் பற்கள் வாயில் வைத்து பரிசோதிக்கப்பட்டு சிரிப்பு, அழகு மற்றும் உச்சரிப்பு உறுதி செய்யப்படுகிறது.',
          },
          {
            num: 4,
            titleEn: 'Definitive Delivery, Occlusal Equilibration & Tissue Care',
            titleTa: 'நிரந்தர பற்கள் வழங்குதல் & ஈறு பராமரிப்பு வழிகாட்டல்',
            descEn: 'The denture is delivered, balanced for chewing, with guidance on daily hygiene, soft-tissue rest, and periodic check-ups.',
            descTa: 'அக்ரிலிக் பற்கள் பொருத்தப்பட்டு, ஈறுகளில் அழுத்தம் இன்றி சீராக உணவு மெல்லும்படி சரிசெய்யப்பட்டு, தூய்மை மற்றும் மருத்துவப் பரிசோதனை முறைகள் விளக்கப்படுகின்றன.',
          },
        ];

      case 'removable-partial-dentures':
        return [
          {
            num: 1,
            titleEn: 'Diagnostic Surveying & Abutment Tooth Preparation',
            titleTa: 'ஆய்வு செய்தல் & தாங்கும் பற்கள் தயாரிப்பு',
            descEn: 'Natural anchor teeth receive subtle rest seats and guide planes so the appliance seats smoothly along a planned path.',
            descTa: 'செயற்கை பல் வரிசையைத் தாங்கும் இயற்கை பற்களில் சிறிய வழிகாட்டி பள்ளங்கள் மென்மையாக உருவாக்கப்படுகின்றன.',
          },
          {
            num: 2,
            titleEn: 'High-Precision Master Impression',
            titleTa: 'உயர் துல்லிய இறுதி அளவீடு எடுத்தல்',
            descEn: 'An elastomeric impression captures minute contours of remaining teeth and soft-tissue edentulous spans.',
            descTa: 'எஞ்சிய பற்கள் மற்றும் பல் இல்லாத ஈறு பகுதியின் துல்லியமான மாதிரி எடுக்கப்படுகிறது.',
          },
          {
            num: 3,
            titleEn: 'Metal Framework Fitting & Occlusal Rim Try-In',
            titleTa: 'உலோக சட்டம் பொருத்தம் பார்த்தல்',
            descEn: 'The custom cobalt-chromium cast framework is checked for passive, friction-free adaptation and secure clasping.',
            descTa: 'உறுதியான கோபால்ட்-குரோமியம் உலோக சட்டம் பற்களின் மீது கச்சிதமாக அமர்வது உறுதி செய்யப்படுகிறது.',
          },
          {
            num: 4,
            titleEn: 'Prosthetic Delivery, Retention Tuning & Care Guidance',
            titleTa: 'வழங்குதல், பிடிப்பை சரிசெய்தல் & பராமரிப்பு வழிகாட்டல்',
            descEn: 'The completed partial denture is fitted, retentive clasps adjusted for security and ease of removal, and hygiene steps reviewed.',
            descTa: 'முழு பகுதி செயற்கைப் பல் வரிசை பொருத்தப்பட்டு, கழற்றி மாட்டும் பிடிப்புகள் சரிசெய்யப்பட்டு பராமரிப்பு ஆலோசனைகள் வழங்கப்படுகின்றன.',
          },
        ];

      case 'full-mouth-rehabilitation':
        return [
          {
            num: 1,
            titleEn: 'Comprehensive Diagnostic Occlusal & TMJ Analysis',
            titleTa: 'முழுமையான கடி அமைப்பு & TMJ மூட்டு பரிசோதனை',
            descEn: 'Digital facebow records, articulated study casts, and 3D imaging map individual jaw biomechanics and tooth wear.',
            descTa: 'தாடை மூட்டுகளின் இயக்கம், தசை செயல்பாடு மற்றும் பற்கள் தேய்மானம் ஆகியவை 3D டிஜிட்டல் முறையில் விரிவாக ஆய்வு செய்யப்படுகின்றன.',
          },
          {
            num: 2,
            titleEn: 'Aesthetic & Functional Diagnostic Wax-Up',
            titleTa: 'முழு வாய் மாதிரி திட்டமிடல் (Diagnostic Wax-Up)',
            descEn: 'A personalized blueprint plans natural tooth anatomy, customized guidance, and appropriate vertical face height.',
            descTa: 'இயற்கையான பல் வடிவம் மற்றும் சரியான முக உயரத்தை மீட்டெடுக்கும் முழுமையான மாதிரி முப்பரிமாண வடிவில் திட்டமிடப்படுகிறது.',
          },
          {
            num: 3,
            titleEn: 'Fixed Provisional Trial & Adaptation Phase',
            titleTa: 'தற்காலிக பற்கள் பொருத்திப் பரிசோதிக்கும் காலம்',
            descEn: 'Precision interim restorations are evaluated over an individualized trial period to confirm joint comfort, chewing, and speech.',
            descTa: 'புதிய கடி அமைப்பில் தாடை மூட்டுகள் பழகுவதை உறுதி செய்ய நோயாளிக்கு ஏற்ற குறிப்பிட்ட காலம் தற்காலிக பற்கள் மூலம் பரிசோதிக்கப்படுகிறது.',
          },
          {
            num: 4,
            titleEn: 'Stepwise Segmental Tooth Preparation & Digital Scanning',
            titleTa: 'பற்கள் நுண் தயாரிப்பு & டிஜிட்டல் ஸ்கேன்',
            descEn: 'Teeth are conservatively refined while preserving verified bite relationships under high-resolution optical scanning.',
            descTa: 'பற்கள் கவனமாகத் தயார் செய்யப்பட்டு, உறுதி செய்யப்பட்ட கடி அமைப்பு மாறாமல் டிஜிட்டல் ஸ்கேன் மூலம் ஆய்வகத்திற்கு அனுப்பப்படுகிறது.',
          },
          {
            num: 5,
            titleEn: 'Definitive Ceramic Bonding & Occlusal Refinement',
            titleTa: 'நிரந்தர பீங்கான் மகுடங்கள் பொருத்துதல் & சமநிலைப்படுத்துதல்',
            descEn: 'Custom ceramic or zirconia crowns are bonded and fine-tuned to deliver stable, individualized functional harmony.',
            descTa: 'அழகிய மற்றும் அதீத வலிமை கொண்ட ஜிர்கோனியா அல்லது பீங்கான் பற்கள் நிரந்தரமாக ஒட்டப்பட்டு சீரான சமநிலையில் முடிக்கப்படுகிறது.',
          },
        ];

      case 'clear-aligners':
        return [
          {
            num: 1,
            titleEn: '3D Intraoral Digital Scan & Virtual Simulation',
            titleTa: '3D டிஜிட்டல் ஸ்கேன் & மெய்நிகர் திட்டமிடல்',
            descEn: 'A high-speed optical scanner maps your arches, generating a 3D digital simulation of how teeth may incrementally shift.',
            descTa: 'பற்கள் முப்பரிமாண ஸ்கேன் செய்யப்பட்டு, பற்கள் எவ்வாறு நகர்ந்து நேராகும் என்பது கணினியில் முன்கூட்டியே திட்டமிடப்படுகிறது.',
          },
          {
            num: 2,
            titleEn: 'Selective Attachments & Initial Aligner Fitting',
            titleTa: 'தேவைக்கேற்ப அட்டாச்மென்ட் & முதல் அலைனர் பொருத்துதல்',
            descEn: 'Tooth-colored composite attachments are bonded only when indicated to give trays necessary mechanical leverage.',
            descTa: 'சிக்கலான பல் அசைவுகளுக்கு தேவைப்படும் போது மட்டும் பல்லின் நிறத்திலேயே சிறிய தாங்கிகள் (Attachments) ஒட்டப்பட்டு முதல் அலைனர் வழங்கப்படுகிறது.',
          },
          {
            num: 3,
            titleEn: 'Sequential Tray Changes & Clinical Monitoring',
            titleTa: 'தொடர்ச்சியான தட்டு மாற்றங்கள் & மருத்துவக் கண்காணிப்பு',
            descEn: 'Trays are changed every 7 to 14 days according to clinician instructions, with prescribed daily wear of 20 to 22 hours.',
            descTa: 'மருத்துவர் ஆலோசனைப்படி 1 அல்லது 2 வாரங்களுக்கு ஒருமுறை புதிய தட்டுக்கு மாறி, தினமும் 20 முதல் 22 மணி நேரம் தொடர்ந்து அணிய வேண்டும்.',
          },
          {
            num: 4,
            titleEn: 'Alignment Assessment & Retention Phase',
            titleTa: 'வரிசை சரிபார்ப்பு & ரீடெய்னர் வழங்குதல்',
            descEn: 'Treatment outcomes are evaluated, attachments polished away, and personalized retainers provided to maintain alignment.',
            descTa: 'பற்களின் சீரமைப்பு பரிசோதிக்கப்பட்டு, தாங்கிகள் நீக்கப்பட்டு, பற்கள் நிலைத்திருக்க தனிப்பயனாக்கப்பட்ட ரீடெய்னர்கள் வழங்கப்படுகின்றன.',
          },
        ];

      case 'palatal-expander':
        return [
          {
            num: 1,
            titleEn: 'Diagnostic Arch Assessment & Band Fitting',
            titleTa: 'தாடை அகலம் கணிப்பு & வளையங்கள் பொருத்துதல்',
            descEn: 'Orthodontic bands are fitted to upper molars and a 3D model customizes the jackscrew appliance based on skeletal stage.',
            descTa: 'எலும்பு வளர்ச்சி நிலைக்கு ஏற்ப மேல் தாடை கடவாய்ப் பற்களுக்கு அளவீடுகள் எடுக்கப்பட்டு விரிவாக்க சாதனம் பிரத்யேகமாக வடிவமைக்கப்படுகிறது.',
          },
          {
            num: 2,
            titleEn: 'Appliance Cementation & Activation Training',
            titleTa: 'சாதனம் பொருத்துதல் & திருகும் பயிற்சி',
            descEn: 'The expander is cemented to upper molars, and patients/parents are trained on the individualized turning protocol.',
            descTa: 'சாதனம் பற்களில் உறுதியாக சிமெண்ட் கொண்டு ஒட்டப்பட்டு, மருத்துவர் குறிப்பிட்ட அளவு சாவியைக் கொண்டு எவ்வாறு திருப்புவது என்பது கற்றுத்தரப்படுகிறது.',
          },
          {
            num: 3,
            titleEn: 'Active Expansion Phase',
            titleTa: 'செயலில் உள்ள விரிவாக்கக் காலம்',
            descEn: 'Calibrated turns open the midpalatal suture in growing children, often creating a temporary midline front tooth space.',
            descTa: 'வளரும் பருவத்தில் குறிப்பிட்ட காலத்திற்கு செய்யப்படும் திருப்புதல் மூலம் மேல் தாடை விரிக்கப்படுகிறது; பற்களுக்கு இடையே தற்காலிக இடைவெளி தோன்றும்.',
          },
          {
            num: 4,
            titleEn: 'Passive Retention & Suture Consolidation',
            titleTa: 'நிலைநிறுத்தும் காலம் & புதிய எலும்பு உருவாக்கம்',
            descEn: 'The appliance remains passively in place for several months to allow new bone to mineralize and stabilize the expansion.',
            descTa: 'விரிவாக்கப்பட்ட எலும்பு இடைவெளியில் புதிய எலும்பு உருவாகி உறுதியாகும் வரை சாதனம் சில மாதங்கள் அப்படியே வைக்கப்படுகிறது.',
          },
        ];

      case 'orthodontic-retainers':
        return [
          {
            num: 1,
            titleEn: 'Appliance Removal, Polish & High-Accuracy Impression',
            titleTa: 'பல் சுத்தம், பாலீஷ் & துல்லியமான மாதிரி எடுத்தல்',
            descEn: 'Braces or attachments are removed and polished away, and an impression or scan captures completed tooth alignment.',
            descTa: 'பற்களில் உள்ள பிராக்கெட்டுகள் அல்லது தாங்கிகள் நீக்கப்பட்டு பற்கள் பாலீஷ் செய்யப்படுகின்றன; பின்னர் துல்லியமான மாதிரி எடுக்கப்படுகிறது.',
          },
          {
            num: 2,
            titleEn: 'Custom Fabrication (Clear, Hawley, or Bonded Wire)',
            titleTa: 'பிரத்யேக ரீடெய்னர் தயாரிப்பு (Clear / Wire)',
            descEn: 'An individualized retainer—clear thermoplastic tray, classic Hawley, or discreet lingual bonded wire—is fabricated.',
            descTa: 'நோயாளிக்கு உகந்த வகையில் ஒளிபுகும் அக்ரிலிக் தட்டுகள் அல்லது பற்களின் பின்னால் ஒட்டப்படும் மெல்லிய கம்பிகள் உருவாக்கப்படுகின்றன.',
          },
          {
            num: 3,
            titleEn: 'Seating Verification, Bite Tuning & Wear Regimen',
            titleTa: 'பொருத்தம் சரிபார்த்தல் & அணியும் விதிமுறைகள்',
            descEn: 'Your clinician verifies passive fit and prescribes a personalized wear schedule to support long-term alignment stability.',
            descTa: 'ரீடெய்னர் பற்களில் கச்சிதமாக பொருந்துவது உறுதி செய்யப்பட்டு, பற்கள் மீண்டும் மாறாமல் இருக்க தனிப்பயனாக்கப்பட்ட அணியும் நெறிமுறைகள் அறிவுறுத்தப்படுகின்றன.',
          },
        ];

      case 'pediatric-pulpotomy':
        return [
          {
            num: 1,
            titleEn: 'Diagnostic Pulp Evaluation & Moisture Isolation',
            titleTa: 'நரம்பு நிலை மதிப்பீடு & தனிமைப்படுத்துதல்',
            descEn: 'The tooth vitality is confirmed and isolated with a rubber dam to protect the surgical site from saliva contamination.',
            descTa: 'பல்லின் நரம்பு உயிருடன் இருப்பது உறுதி செய்யப்பட்டு, எச்சில் படாமல் இருக்க ரப்பர் டேம் கொண்டு பல் தனிமைப்படுத்தப்படுகிறது.',
          },
          {
            num: 2,
            titleEn: 'Caries Removal & Coronal Pulp Amputation',
            titleTa: 'சொத்தை அகற்றுதல் & மேற்பகுதி நரம்பு நீக்கம்',
            descEn: 'Caries is removed and coronal pulp amputated, carefully verifying that root canal pulp tissue remains healthy and vital.',
            descTa: 'சொத்தை நீக்கப்பட்டு, பல்லின் மேற்பகுதி நரம்பு மட்டும் அகற்றப்பட்டு வேர்ப்பகுதி நரம்புகள் ஆரோக்கியமாக இருப்பது உறுதி செய்யப்படுகிறது.',
          },
          {
            num: 3,
            titleEn: 'Hemostasis & Bioactive Calcium-Silicate Medicament',
            titleTa: 'இரத்தக் கசிவை நிறுத்துதல் & பயோசெராமிக் மருந்து வைத்தல்',
            descEn: 'Hemostasis is achieved with sterile pellets, followed by bioactive calcium-silicate cement (e.g., MTA or biodentine) over root orifices.',
            descTa: 'இரத்தக் கசிவு நிறுத்தப்பட்டு, வேர் நரம்பைப் பாதுகாக்க எம்.டி.ஏ (MTA) போன்ற நவீன பயோசெராமிக் கால்சியம்-சிலிகேட் மருந்து பூசப்படுகிறது.',
          },
          {
            num: 4,
            titleEn: 'Hermetic Base & Definitive Coronal Restoration',
            titleTa: 'பாதுகாப்பு பூச்சு & நிரந்தர மகுடம் பொருத்துதல்',
            descEn: 'A biocompatible base seals the chamber, followed by an indicated definitive restoration (such as an SSC) to prevent microleakage.',
            descTa: 'மருந்துக்கு மேல் சிமெண்ட் சீல் செய்யப்பட்டு, பாக்டீரியா புகாமல் தடுக்க பல்லின் தேவைக்கேற்ப எஃகு மகுடம் (Crown) போன்ற நிரந்தர மூடி பொருத்தப்படுகிறது.',
          },
        ];

      case 'pediatric-stainless-steel-crowns':
        return [
          {
            num: 1,
            titleEn: 'Comfort Preparation & Tooth Sizing Assessment',
            titleTa: 'வலி நிவாரணம் & பல்லின் அளவு கணித்தல்',
            descEn: 'The primary tooth is evaluated, with conservative reduction performed or direct placement assessed via the Hall Technique.',
            descTa: 'பல் பரிசோதிக்கப்பட்டு, வழக்கமான தயாரிப்பு முறை அல்லது பல்லில் துளையிடாமல் நேரடியாக பொருத்தும் ஹால் டெக்னிக் முறை தீர்மானிக்கப்படுகிறது.',
          },
          {
            num: 2,
            titleEn: 'Preformed Crown Selection & Marginal Contouring',
            titleTa: 'சரியான மகுட அளவு தேர்வு & விளிம்பு சரிசெய்தல்',
            descEn: 'A properly fitting preformed austenitic crown is selected and crimped at the cervical margin for a secure anatomical snap-fit.',
            descTa: 'பல்லுக்குப் பொருந்தும் சரியான எஃகு மகுடம் தேர்ந்தெடுக்கப்பட்டு, ஈறுகளை அழுத்தாதவாறு விளிம்புகள் மடக்கப்படுகின்றன.',
          },
          {
            num: 3,
            titleEn: 'Bioactive Glass Ionomer Cementation',
            titleTa: 'பயோ-ஆக்டிவ் சிமெண்ட் கொண்டு ஒட்டுதல்',
            descEn: 'The crown is filled with fluoride-releasing glass ionomer cement and seated firmly to achieve a 360-degree hermetic seal.',
            descTa: 'புளோரைடு வெளியிடும் கிளாஸ் அயோனோமர் சிமெண்ட் மூலம் மகுடம் பல்லின் மீது அழுத்தமாக ஒட்டப்பட்டு முழுமையாக சீல் செய்யப்படுகிறது.',
          },
          {
            num: 4,
            titleEn: 'Occlusal Assessment, Cement Clearing & Polish',
            titleTa: 'கடி அமைப்பை சரிபார்த்தல் & உபரி சிமெண்ட் நீக்குதல்',
            descEn: 'Excess cement is removed, chewing contacts verified, and the durable restoration polished to support comfortable eating.',
            descTa: 'வெளிவந்த உபரி சிமெண்ட் அகற்றப்பட்டு, குழந்தை இயல்பாக மெல்ல முடிகிறதா என சோதிக்கப்பட்டு பளபளப்பாக்கப்படுகிறது.',
          },
        ];

      case 'pediatric-space-maintainers':
        return [
          {
            num: 1,
            titleEn: 'Clinical Space Analysis & Radiographic Assessment',
            titleTa: 'இடைவெளி பகுப்பாய்வு & எக்ஸ்-ரே ஆய்வு',
            descEn: 'The pediatric dentist evaluates arch space, occlusion, and radiographic successor development to determine if maintenance is indicated.',
            descTa: 'பற்களின் இடைவெளி, கடி அமைப்பு மற்றும் அடியில் வளரும் நிரந்தரப் பல்லின் நிலை ஆகியவை எக்ஸ்-ரே மூலம் பரிசோதிக்கப்பட்டு சாதனம் தேவையா என தீர்மானிக்கப்படுகிறது.',
          },
          {
            num: 2,
            titleEn: 'Appliance Fitting & Laboratory Customization',
            titleTa: 'சாதனம் பொருத்துதல் & பிரத்யேக தயாரிப்பு',
            descEn: 'An anchor band or model is custom-fitted to adjacent dentition, customizing a passive loop or arch wire for the edentulous space.',
            descTa: 'பக்கத்து கடவாய்ப் பல்லுக்கு வளையம் பொருத்தப்பட்டு, இடைவெளியைப் பாதுகாக்க பிரத்யேக கம்பி வளையம் வடிவமைக்கப்படுகிறது.',
          },
          {
            num: 3,
            titleEn: 'Passive Cementation, Monitoring & Follow-Up',
            titleTa: 'சாதனம் ஒட்டுதல் & தொடர் கண்காணிப்பு',
            descEn: 'The appliance is cemented to passively maintain leeway space, with regular recall to monitor hygiene and remove it once the adult tooth erupts.',
            descTa: 'சாதனம் சிமெண்ட் கொண்டு ஒட்டப்படுகிறது; கறை சேராமல் கண்காணிக்கவும், நிரந்தரப் பல் முளைத்ததும் சரியான நேரத்தில் கழற்றவும் தொடர் பரிசோதனை அவசியம்.',
          },
        ];

      // Batch 5 Procedures
      case 'porcelain-veneers':
        return [
          {
            num: 1,
            titleEn: 'Aesthetic Analysis & Diagnostic Mockup',
            titleTa: 'புன்னகை வடிவமைப்பு & மாதிரியமைப்பு',
            descEn: 'Facial aesthetics, shade, and occlusal guidance are evaluated, accompanied by a diagnostic wax-up to preview desired contours.',
            descTa: 'முக அமைப்பு, பல்லின் நிறம் மற்றும் கடிக்கும் விசை ஆகியவை பரிசோதிக்கப்பட்டு, புன்னகை வடிவமைப்பு மாதிரி மூலம் முன்கூட்டியே திட்டமிடப்படுகிறது.',
          },
          {
            num: 2,
            titleEn: 'Conservative Tooth Preparation & Precision Impression',
            titleTa: 'பல் தயாரிப்பு & துல்லிய அளவெடுத்தல்',
            descEn: 'Individualized, conservative enamel preparation is performed as indicated, followed by digital or elastomeric impressions and provisional veneers.',
            descTa: 'பல்லின் எனாமல் அடுக்கில் தேவைக்கேற்ப குறைந்தபட்ச தயாரிப்பு செய்யப்பட்டு, நவீன டிஜிட்டல் ஸ்கேன் அல்லது அளவெடுத்து தற்காலிக வெனியர் பொருத்தப்படுகிறது.',
          },
          {
            num: 3,
            titleEn: 'Laboratory Fabrication & Custom Ceramic Glazing',
            titleTa: 'செராமிக் ஆய்வக தயாரிப்பு & மெருகூட்டல்',
            descEn: 'High-strength ceramic (such as lithium disilicate or feldspathic porcelain) is custom crafted to match natural translucency and shade gradients.',
            descTa: 'இயற்கையான பல்லின் ஒளி ஊடுருவும் தன்மையுடன் ஒத்துப்போகுமாறு அதிநவீன ஆய்வகத்தில் பீங்கான் தகடுகள் பிரத்யேகமாக உருவாக்கப்படுகின்றன.',
          },
          {
            num: 4,
            titleEn: 'Adhesive Cementation, Occlusal Refinement & Nightguard Review',
            titleTa: 'பிசின் ஒட்டுதல் & கடிக்கும் விசை பரிசோதனை',
            descEn: 'Enamel conditioning and resin bonding definitively seal the veneers, followed by precise occlusal adjustment and protective guard evaluation.',
            descTa: 'ரெசின் சிமெண்ட் கொண்டு வெனியர்கள் உறுதியாக ஒட்டப்படுகின்றன; கடிக்கும் விசை சரிசெய்யப்பட்டு, இரவில் பற்களைப் பாதுகாக்க நைட் கார்டு பரிசீலிக்கப்படுகிறது.',
          },
        ];

      case 'gingival-recontouring':
        return [
          {
            num: 1,
            titleEn: 'Aesthetic Periodontal Mapping & Biological Width Assessment',
            titleTa: 'ஈறு அமைப்பு வரைபடம் & திசு பரிசோதனை',
            descEn: 'Gingival margins, smile symmetry, and supracrestal tissue dimensions coronal to alveolar bone are measured to ensure soft-tissue-only suitability.',
            descTa: 'ஈறுகளின் சமச்சீர்மை மற்றும் தாடை எலும்புக்கு மேல் உள்ள திசு இடைவெளி பரிசோதிக்கப்பட்டு, மென்மையான திசு சீரமைப்பு மட்டும் போதுமா என மதிப்பீடு செய்யப்படுகிறது.',
          },
          {
            num: 2,
            titleEn: 'Precision Laser or Surgical Sculpting',
            titleTa: 'துல்லிய லேசர் அல்லது அறுவை சிகிச்சை சீரமைப்பு',
            descEn: 'Local anesthesia is placed, followed by meticulous soft-tissue contouring with a dental laser or scalpel to expose natural crown dimensions.',
            descTa: 'உள்ளூர் மயக்க மருந்து வழங்கப்பட்டு, அதிநவீன லேசர் அல்லது அறுவை உபகரணம் மூலம் அதிகப்படியான ஈறு திசுக்கள் மென்மையாக நீக்கப்பட்டு பற்கள் வெளிப்படுத்தப்படுகின்றன.',
          },
          {
            num: 3,
            titleEn: 'Tissue Hemostasis, Margin Polishing & Postoperative Healing',
            titleTa: 'ரத்தக் கட்டுப்பாடு & திசு ஆறும் பராமரிப்பு',
            descEn: 'Hemostasis is achieved instantly, margin contours are inspected, and postoperative oral hygiene instructions are reviewed for rapid re-epithelialization.',
            descTa: 'ரத்தக் கசிவு முழுமையாகக் கட்டுப்படுத்தப்பட்டு, ஈறுகளின் புதிய வடிவமைப்பு உறுதிசெய்யப்படுகிறது; திசுக்கள் விரைவாக ஆற மென்மையான வாய் பராமரிப்பு முறைகள் கற்பிக்கப்படுகின்றன.',
          },
        ];

      case 'knocked-out-tooth-avulsion':
        return [
          {
            num: 1,
            titleEn: 'Immediate First Aid, Handling & Transport',
            titleTa: 'அவசர முதலுதவி, பல்லினைப் பாதுகாத்தல் & கொண்டுவருதல்',
            descEn: 'Permanent tooth is handled strictly by the crown, briefly rinsed with cold saline/water if soiled, and transported in cold milk, HBSS, or saliva.',
            descTa: 'விழுந்த நிரந்தரப் பல்லின் மகுடத்தை மட்டுமே தொட வேண்டும்; வேரைத் தொடாமல் குளிர்ந்த பால் அல்லது ஹாங்க்ஸ் கரைசலில் வைத்து உடனடியாக மருத்துவமனைக்குக் கொண்டுவர வேண்டும்.',
          },
          {
            num: 2,
            titleEn: 'Socket Inspection, Gentle Debridement & Replantation',
            titleTa: 'எலும்புக்குழி பரிசோதனை & பல்லை மீண்டும் பொருத்துதல்',
            descEn: 'Under local anesthesia, the alveolar socket is gently cleared of blood clots and the tooth is repositioned into its anatomical position without force.',
            descTa: 'மயக்க மருந்து வழங்கப்பட்டு, எலும்புக்குழி மென்மையாகச் சுத்தம் செய்யப்பட்டு, பல் மீண்டும் அதன் சரியான இடத்தில் மென்மையாகப் பொருத்தப்படுகிறது.',
          },
          {
            num: 3,
            titleEn: 'Flexible Splinting & Occlusal Verification',
            titleTa: 'நெகிழ்வான கம்பி மூலம் கட்டுதல் & கடி அமைப்பு ஆய்வு',
            descEn: 'A passive, flexible splint is bonded to adjacent teeth to stabilize the replanted tooth while allowing physiological micromovement for PDL healing.',
            descTa: 'பக்கத்து பற்களுடன் சேர்த்து மெல்லிய நெகிழ்வான கம்பி (Flexible Splint) ஒட்டப்பட்டு பல் அசையாமல் நிலைநிறுத்தப்படுகிறது.',
          },
          {
            num: 4,
            titleEn: 'Tetanus Status, Antibiotic Review & Scheduled Endodontics',
            titleTa: 'தடுப்பூசி ஆய்வு & திட்டமிடப்பட்ட வேர்க்கால் சிகிச்சை',
            descEn: 'Systemic tetanus coverage and individualized medication are assessed, scheduling endodontic management within 7 to 14 days for mature teeth.',
            descTa: 'டெட்டனஸ் தடுப்பூசி நிலை ஆய்வு செய்யப்பட்டு, முழுமையாக வளர்ந்த பற்களுக்கு 7 முதல் 14 நாட்களுக்குள் வேர்க்கால் சிகிச்சை திட்டமிடப்படுகிறது.',
          },
        ];

      case 'emergency-broken-tooth-repair':
        return [
          {
            num: 1,
            titleEn: 'Emergency Triage, Radiographic & Pulpal Evaluation',
            titleTa: 'அவசரப் பரிசோதனை, எக்ஸ்-ரே & நரம்பு ஆய்வு',
            descEn: 'Clinical examination and radiographs identify fracture extent, pulpal involvement, root integrity, and surrounding alveolar bone status.',
            descTa: 'பல் உடைந்த விதம், உள்பகுதி நரம்பு வெளிப்பட்டுள்ளதா, மற்றும் வேரில் விரிசல் உள்ளதா என்பது எக்ஸ்-ரே மூலம் துல்லியமாகப் பரிசோதிக்கப்படுகிறது.',
          },
          {
            num: 2,
            titleEn: 'Pulp Protection or Vital Pulp Therapy (as Indicated)',
            titleTa: 'நரம்புப் பாதுகாப்பு அல்லது உயிருள்ள நரம்பு சிகிச்சை',
            descEn: 'Exposed dentin is sealed with biocompatible liners; if pulp is exposed, individualized pulp capping or partial pulpotomy is performed to preserve vitality.',
            descTa: 'வெளிப்பட்ட டென்டின் அடுக்கு பாதுகாக்கப்படுகிறது; நரம்பு வெளிப்பட்டிருந்தால், பல்லின் உயிரோட்டத்தைத் தக்கவைக்க நவீன பயோமெட்டீரியல் மூலம் பாதுகாப்பு அளிக்கப்படுகிறது.',
          },
          {
            num: 3,
            titleEn: 'Adhesive Fragment Reattachment or Direct Composite Restoration',
            titleTa: 'உடைந்த துண்டை மீண்டும் ஒட்டுதல் அல்லது காம்போசிட் அடைப்பு',
            descEn: 'The hydrated tooth fragment is adhesively reattached, or multi-layered aesthetic composite resin is sculpted to restore natural form and function.',
            descTa: 'பத்திரமாக எடுத்துவரப்பட்ட பல்லின் துண்டு மீண்டும் ஒட்டப்படுகிறது, அல்லது அடுக்குக் காம்போசிட் பிசின் கொண்டு பல்லின் பழைய வடிவம் முழுமையாக மீட்டமைக்கப்படுகிறது.',
          },
        ];

      case 'recement-dislodged-crown-bridge':
        return [
          {
            num: 1,
            titleEn: 'Comprehensive Abutment & Margin Inspection',
            titleTa: 'அடித்தளப் பல் & பற்காப்பு மூடி பரிசோதனை',
            descEn: 'The underlying abutment tooth and restoration intaglio are evaluated clinically and radiographically to rule out recurrent caries, fracture, or periodontal defects.',
            descTa: 'பற்காப்பு மூடி கழன்றதற்கான காரணத்தை அறிய பல்லில் மீண்டும் சொத்தை, வேர் விரிசல் அல்லது ஈறு பாதிப்பு உள்ளதா என எக்ஸ்-ரே மூலம் பரிசோதிக்கப்படுகிறது.',
          },
          {
            num: 2,
            titleEn: 'Cement Debridement, Disinfection & Try-In Verification',
            titleTa: 'பழைய சிமெண்ட் நீக்கம், கிருமிநாசினி & பொருத்திப் பார்த்தல்',
            descEn: 'Old luting cement is completely removed from restoration and abutment, surfaces are disinfected, and passive, rocking-free seatability is verified.',
            descTa: 'பழைய சிமெண்ட் எச்சங்கள் முற்றிலும் அகற்றப்பட்டு, கிருமிநாசினி கொண்டு சுத்தம் செய்யப்பட்டு, மூடி ஆட்டமின்றி சரியாகப் பொருந்துகிறதா என சரிபார்க்கப்படுகிறது.',
          },
          {
            num: 3,
            titleEn: 'Definitive Adhesive Luting & Occlusal Clearance',
            titleTa: 'நிலையான சிமெண்ட் ஒட்டுதல் & கடிக்கும் விசை சரிபார்த்தல்',
            descEn: 'Appropriate dental cement (such as resin-modified glass ionomer or adhesive resin) is placed, excess removed, and interocclusal contacts checked.',
            descTa: 'உயர்தர டென்டல் சிமெண்ட் மூலம் மூடி நிரந்தரமாக ஒட்டப்படுகிறது; அதிகப்படியான சிமெண்ட் நீக்கப்பட்டு, கடிக்கும் போது அழுத்தம் இல்லாதவாறு சரிசெய்யப்படுகிறது.',
          },
        ];

      case 'nitrous-oxide-inhalation-sedation':
        return [
          {
            num: 1,
            titleEn: 'Preoperative Medical Screening & Mask Positioning',
            titleTa: 'மருத்துவ வரலாறு பரிசோதனை & மூக்கு முகமூடி பொருத்துதல்',
            descEn: 'Patient medical history and airway patency are reviewed, followed by comfortable placement of a contoured scented nasal mask delivering pure oxygen.',
            descTa: 'உடல்நிலை மற்றும் மூச்சுப்பாதை பரிசோதிக்கப்பட்டு, நோயாளிக்கு வசதியான நறுமண மூக்கு முகமூடி பொருத்தப்பட்டு தூய பிராணவாயு வழங்கப்படுகிறது.',
          },
          {
            num: 2,
            titleEn: 'Gradual Nitrous Oxide Titration & Anxiolysis',
            titleTa: 'நைட்ரஸ் ஆக்சைடு படிப்படியாக செலுத்துதல் & பதற்றத் தணிவு',
            descEn: 'Nitrous oxide is incrementally introduced with a minimum of 30% oxygen fail-safe, achieving relaxed conscious anxiolysis with intact verbal responsiveness.',
            descTa: 'குறைந்தபட்சம் 30% ஆக்சிஜனுடன் நைட்ரஸ் ஆக்சைடு படிப்படியாக அதிகரிக்கப்பட்டு, நோயாளி முழு விழிப்புணர்வுடன் அமைதியான மனநிலையை அடைகிறார்.',
          },
          {
            num: 3,
            titleEn: 'Post-Procedure 100% Oxygen Flush & Recovery Verification',
            titleTa: 'சிகிச்சைக்குப் பின் 100% ஆக்சிஜன் வழங்குதல் & முழு விழிப்புணர்வு',
            descEn: '100% oxygen is administered for at least 5 minutes to eliminate residual nitrous oxide from the lungs and prevent diffusion hypoxia prior to discharge.',
            descTa: 'சிகிச்சை முடிந்ததும் நுரையீரலில் உள்ள வாயுவை முழுமையாக வெளியேற்றி தலைச்சுற்றலைத் தடுக்க 5 நிமிடங்களுக்கு 100% தூய ஆக்சிஜன் வழங்கப்பட்டு இயல்புநிலைக்குக் கொண்டுவரப்படுகிறது.',
          },
        ];

      case 'oral-sedation':
        return [
          {
            num: 1,
            titleEn: 'Pre-Sedation Medical Evaluation & Fasting Review',
            titleTa: 'மயக்கத்திற்கு முந்தைய மருத்துவ ஆய்வு & உணவுக்கட்டுப்பாடு',
            descEn: 'Medical history, ASA status, and strict fasting adherence are verified, establishing an individualized conscious sedation plan.',
            descTa: 'முந்தைய மருத்துவ வரலாறு, உடல் தகுதி மற்றும் உணவு உட்கொள்ளாமை விதிகள் (Fasting) ஆகியவை தீவிரமாகப் பரிசோதிக்கப்பட்டு திட்டமிடப்படுகிறது.',
          },
          {
            num: 2,
            titleEn: 'Oral Sedative Administration & Relaxed Induction',
            titleTa: 'வாய்வழி மாத்திரை உட்கொள்ளுதல் & அமைதியான மயக்கத் தொடக்கம்',
            descEn: 'Prescribed oral medication is administered in a quiet environment, allowing gradual onset of systemic relaxation and reduced anxiety.',
            descTa: 'பரிந்துரைக்கப்பட்ட மாத்திரை உட்கொள்ளப்பட்டு, அமைதியான சூழலில் பதற்றம் குறைந்து ஆழ்ந்த தளர்வான நிலையை நோயாளி அடைகிறார்.',
          },
          {
            num: 3,
            titleEn: 'Continuous Multi-Parameter Physiological Monitoring',
            titleTa: 'தொடர்ச்சியான உடல் இயக்கக் கண்காணிப்பு',
            descEn: 'Vital signs—pulse oximetry, blood pressure, heart rate, and responsiveness—are monitored continuously throughout dental treatment.',
            descTa: 'பல் சிகிச்சை முடியும் வரை ரத்த அழுத்தம், இதயத்துடிப்பு மற்றும் ஆக்சிஜன் அளவு ஆகியவை அதிநவீன மானிட்டர் மூலம் தொடர்ந்து கண்காணிக்கப்படுகின்றன.',
          },
          {
            num: 4,
            titleEn: 'Recovery Assessment & Supervised Discharge',
            titleTa: 'விழிப்புணர்வு மீட்பு ஆய்வு & பாதுகாப்பான வழியனுப்புதல்',
            descEn: 'Recovery criteria are verified, releasing the patient into the care of an adult escort with specific postoperative safety instructions.',
            descTa: 'நோயாளி இயல்புநிலைக்குத் திரும்பியதை மருத்துவர் உறுதிசெய்து, பாதுகாப்பு அறிவுரைகளுடன் பொறுப்பான துணையுடன் வீட்டிற்கு அனுப்பி வைக்கப்படுகிறார்.',
          },
        ];

      case 'intravenous-dental-sedation':
        return [
          {
            num: 1,
            titleEn: 'Specialist Anesthesia Assessment & Patient Preparation',
            titleTa: 'மயக்கவியல் நிபுணர் பரிசோதனை & நோயாளி தயாரிப்பு',
            descEn: 'A certified specialist evaluates airway anatomy, fasting adherence, and monitors baseline cardiovascular status in a fully equipped clinical facility.',
            descTa: 'மயக்கவியல் நிபுணர் அல்லது அறுவை சிகிச்சை நிபுணர் மூச்சுப்பாதை மற்றும் உடல்நிலையை முழுமையாகப் பரிசோதித்து சிகிச்சைக்குத் தயார்படுத்துகிறார்.',
          },
          {
            num: 2,
            titleEn: 'Intravenous Access & Multi-Lead Monitoring Setup',
            titleTa: 'நரம்பு வழி பாதை அமைத்தல் & கண்காணிப்புக் கருவிகள் பொருத்துதல்',
            descEn: 'Intravenous line access is established, connecting continuous capnography (ETCO2), continuous ECG, automated NIBP, and pulse oximetry.',
            descTa: 'கையில் பாதுகாப்பான நரம்பு வழி ஊசி செலுத்தப்பட்டு, இதயத்துடிப்பு (ECG), சுவாசம் (Capnography) மற்றும் ரத்த அழுத்தக் கருவிகள் இணைக்கப்படுகின்றன.',
          },
          {
            num: 3,
            titleEn: 'Specialist-Controlled Deep Sedation & Dedicated Monitoring',
            titleTa: 'நிபுணர் கட்டுப்படுத்திய மயக்க நிலை & பிரத்யேக கண்காணிப்பு',
            descEn: 'Targeted intravenous medications are carefully titrated by the dedicated anesthesia clinician, maintaining airway patency throughout complex surgical care.',
            descTa: 'அறுவை சிகிச்சை முடியும் வரை மயக்க மருந்துகள் நிபுணரால் துல்லியமாக நிர்வகிக்கப்பட்டு, நோயாளியின் சுவாசம் மற்றும் பாதுகாப்பு தொடர்ந்து உறுதிசெய்யப்படுகிறது.',
          },
          {
            num: 4,
            titleEn: 'Standardized Post-Anesthesia Recovery & Accompanied Discharge',
            titleTa: 'மயக்கத்திற்குப் பிந்தைய மீட்பு & துணையுடன் வழியனுப்புதல்',
            descEn: 'The patient recovers in a dedicated monitoring bay, meeting formal discharge scoring criteria before releasing to a responsible adult escort.',
            descTa: 'சிறப்பு கண்காணிப்பு அறையில் நோயாளி முழு நினைவாற்றல் மற்றும் வலிமையை மீட்டெடுத்த பிறகு, துணையுடன் வீட்டிற்கு அனுப்பி வைக்கப்படுகிறார்.',
          },
        ];

      case 'recurrent-aphthous-ulcer-care':
        return [
          {
            num: 1,
            titleEn: 'Clinical Examination & Differential Diagnosis',
            titleTa: 'மருத்துவப் பரிசோதனை & புண் வகையைக் கண்டறிதல்',
            descEn: 'The oral medicine clinician inspects ulcer size, duration, morphology, and mucosal location to rule out malignancy, traumatic lesions, or viral infections.',
            descTa: 'வாய் புண்ணின் அளவு, காலம் மற்றும் வடிவம் பரிசோதிக்கப்பட்டு, புற்றுநோய் அல்லது வைரஸ் தொற்று இல்லை என்பதை உறுதிசெய்ய துல்லியமாக ஆராயப்படுகிறது.',
          },
          {
            num: 2,
            titleEn: 'Topical Pain Relief & Anti-Inflammatory Barrier Application',
            titleTa: 'வலி நிவாரணம் & அழற்சி எதிர்ப்பு பாதுகாப்புப் பூச்சு',
            descEn: 'Topical mucosal anesthetics, soothing rinses, and bioadhesive anti-inflammatory barrier pastes are applied to shield exposed nerve endings.',
            descTa: 'புண்ணின் வலியை உடனடியாகக் குறைக்க மயக்கக் களிம்பு மற்றும் புண் மேலும் புண்படாமல் பாதுகாக்க ஒட்டும் பாதுகாப்புப் பசை (Barrier Paste) பூசப்படுகிறது.',
          },
          {
            num: 3,
            titleEn: 'Systemic Health Screening & Preventive Self-Care Counseling',
            titleTa: 'உடல்நலப் பரிசோதனை & தடுப்புப் பராமரிப்பு ஆலோசனைகள்',
            descEn: 'Recurrent patterns are evaluated for nutritional deficiencies (iron, B12, folate) or gastrointestinal conditions, advising on non-irritating diet and oral hygiene.',
            descTa: 'அடிக்கடி புண் வருவதைத் தவிர்க்க ஊட்டச்சத்து குறைபாடு உள்ளதா என இரத்தப் பரிசோதனை பரிந்துரைக்கப்பட்டு, காரமற்ற உணவு மற்றும் வாய் பராமரிப்பு முறைகள் கற்பிக்கப்படுகின்றன.',
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
    <div className="py-10 space-y-16 relative overflow-hidden bg-[#F5FAF9]">
      {/* Background Ambience for Liquid Refraction */}
      <div className="absolute top-10 left-10 w-[36rem] h-[36rem] bg-gradient-to-br from-[#BFE9E2]/50 via-[#20B2AA]/20 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 -right-20 w-[34rem] h-[34rem] bg-gradient-to-bl from-[#DCEFF5]/80 to-[#20B2AA]/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <Container>
        {/* Back Link */}
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 text-sm text-[#20B2AA] font-bold hover:underline mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isTamil ? 'அனைத்து சிகிச்சைகளுக்கும் திரும்பு' : 'Back to Treatment Directory'}</span>
        </Link>

        {/* 1. DESKTOP HERO: Two-Column Side-by-Side Layout with Liquid Glass Framing */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch mb-14">
          {/* LEFT COLUMN: Click-to-load Video Player with Liquid Glass Privacy Shield */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <LiquidGlassSurface
              variant="floating"
              specular
              refractiveRim
              className="p-3 sm:p-4 rounded-3xl h-full flex flex-col justify-between"
            >
              <YouTubeClickToLoadPlayer
                videoId="3D-DENTAL-RCT-DEMO"
                title={title}
                thumbnailUrl={coverImageSrc}
                durationText={isTamil ? `~${procedure.durationMinutes} நிமிடங்கள்` : `${procedure.durationMinutes} min guide`}
                lang={language}
              />
              <div className="mt-3 px-3 py-2.5 rounded-xl liquid-glass-secondary flex items-center justify-between text-xs text-[#145B59]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#20B2AA]" />
                  <span className="font-semibold">{isTamil ? 'மருத்துவக் கல்வி வீடியோ' : 'Educational Procedure Guide'}</span>
                </div>
                <span className="text-[#587477] font-medium">{isTamil ? 'நோயாளி வழிகாட்டல்' : 'Visual Overview'}</span>
              </div>
            </LiquidGlassSurface>
          </div>

          {/* RIGHT COLUMN: Procedure Name, Key Info, Department in Liquid Glass Panel */}
          <div className="lg:col-span-6 flex flex-col">
            <LiquidGlassSurface
              variant="primary"
              specular
              refractiveRim
              className="p-7 sm:p-9 space-y-5 rounded-3xl shadow-md h-full flex flex-col justify-between"
            >
              <div className="space-y-4 relative z-10">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="mint" className="text-xs font-bold uppercase tracking-wider liquid-glass-lens">
                    {procedure.primaryDepartmentName}
                  </Badge>
                  <Badge variant="outline" className="text-xs font-mono bg-[#F5FAF9]/75">
                    {procedure.code}
                  </Badge>
                  <Badge variant="alert" className="text-xs font-semibold">
                    {isTamil
                      ? 'மருத்துவ பரிசோதனைக்கு உட்படாதது · பயிற்சிக் குறிப்பு மட்டுமே'
                      : 'Not Clinically Reviewed · Educational Reference Only'}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#145B59] tracking-tight leading-tight">
                    {title}
                  </h1>
                  <p className="text-base font-semibold text-[#20B2AA]">
                    {secondaryTitle}
                  </p>
                </div>

                <p className="text-sm sm:text-base text-[#587477] leading-relaxed">
                  {summary}
                </p>

                {/* Key Facts Liquid Pill Grid */}
                <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl liquid-glass-secondary">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-[#20B2AA] uppercase tracking-wider font-bold">
                      <Clock className="w-3.5 h-3.5 text-[#20B2AA]" />
                      <span>{isTamil ? 'சிகிச்சை நேரம்' : 'Estimated Time'}</span>
                    </div>
                    <p className="text-sm font-extrabold text-[#145B59]">
                      ~{procedure.durationMinutes} {isTamil ? 'நிமிடங்கள்' : 'minutes'}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-[#20B2AA] uppercase tracking-wider font-bold">
                      <HeartPulse className="w-3.5 h-3.5 text-[#20B2AA]" />
                      <span>{isTamil ? 'மயக்க மருந்து / வசதி' : 'Comfort / Numbing'}</span>
                    </div>
                    <p className="text-sm font-extrabold text-[#145B59] line-clamp-1">
                      {procedure.anesthesiaType}
                    </p>
                  </div>
                </div>
              </div>

              {/* Clinical Disclaimer */}
              <div className="pt-2 space-y-2 relative z-10">
                <ClinicalDisclaimerBanner lang={language} />
              </div>
            </LiquidGlassSurface>
          </div>
        </div>

        {/* 2. DEDICATED ANATOMY VISUALIZATION SECTION (HIGH PRIORITY) */}
        <section className="mb-16">
          <ProcedureAnatomy3D
            procedureSlug={procedure.slug}
            imageSrc={coverImageSrc}
          />
        </section>

        {/* 2. SUPPORTING SECTIONS BELOW THE HERO IN LIQUID GLASS */}
        <div className="space-y-16 max-w-4xl">
          {/* Section 1: Detailed Overview */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#20B2AA]">
              <Sparkles className="w-4 h-4" />
              <span>{isTamil ? 'சிகிச்சை விளக்கம்' : 'Clinical Overview'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#145B59] tracking-tight">
              {isTamil ? '1. சிகிச்சை பற்றிய பொதுவான கண்ணோட்டம்' : '1. Procedure Overview'}
            </h2>
            <div
              className="prose prose-teal text-[#587477] leading-relaxed text-base liquid-glass-secondary p-8 rounded-3xl"
              dangerouslySetInnerHTML={{ __html: overviewHtml }}
            />
          </section>

          {/* Section 2: Why Recommended */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#145B59] tracking-tight">
              {isTamil ? '2. இந்த சிகிச்சை எப்போது பரிந்துரைக்கப்படுகிறது?' : '2. Why This Procedure May Be Recommended'}
            </h2>
            <div className="liquid-glass-secondary p-8 rounded-3xl space-y-4">
              <p className="text-sm text-[#587477] leading-relaxed">
                {isTamil
                  ? 'பல்லின் உள் கட்டமைப்பு அல்லது புறப்பரப்பு தீவிரமாக பாதிக்கப்படும் போது பற்களை பிடுங்காமல் காக்க இது செய்யப்படுகிறது:'
                  : 'Dental professionals recommend this treatment when natural tooth structure is compromised but can still be effectively preserved:'}
              </p>
              <ul className="space-y-3 text-sm text-[#145B59]">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#20B2AA] shrink-0 mt-0.5" />
                  <span>
                    {isTamil
                      ? 'தொடர்ச்சியான கூச்சம், சூடான அல்லது குளிர்ந்த உணவுகளை உண்ணும்போது ஏற்படும் கடுமையான வலி.'
                      : 'Severe discomfort, spontaneous throbbing, or prolonged sensitivity to hot and cold.'}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#20B2AA] shrink-0 mt-0.5" />
                  <span>
                    {isTamil
                      ? 'ஆழமான சொத்தை பல்லின் நரம்புப் பகுதி வரை சென்று வீக்கம் அல்லது சீழ் உருவாகுதல்.'
                      : 'Deep decay encroaching on vital inner tissue or visible swelling along the root.'}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#20B2AA] shrink-0 mt-0.5" />
                  <span>
                    {isTamil
                      ? 'இயற்கையான பற்களை அகற்றிவிடாமல் வாழ்நாள் முழுவதும் பாதுகாத்தல்.'
                      : 'Preserving the natural tooth root to prevent bone resorption and preserve facial structure.'}
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3: Step-by-Step Breakdown */}
          <section className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#145B59] tracking-tight">
              {isTamil ? '3. சிகிச்சை நிலைகள் (Step-by-Step)' : '3. Procedure Steps'}
            </h2>
            <div className="space-y-4">
              {steps.map((step) => (
                <div key={step.num} className="liquid-glass-secondary p-6 rounded-2xl flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl liquid-glass-lens text-[#20B2AA] font-extrabold text-sm flex items-center justify-center shrink-0 shadow-xs">
                    {step.num}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-[#145B59]">
                      {isTamil ? step.titleTa : step.titleEn}
                    </h3>
                    <p className="text-sm text-[#587477] leading-relaxed">
                      {isTamil ? step.descTa : step.descEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4: Aftercare & Recovery */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#145B59] tracking-tight">
              {isTamil ? '4. சிகிச்சைக்குப் பின் கவனிப்பு & மீட்பு' : '4. Aftercare & Home Recovery'}
            </h2>
            <div className="liquid-glass-secondary p-8 rounded-3xl space-y-4">
              <div className="flex items-center gap-2 text-[#20B2AA] font-bold text-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>{isTamil ? 'எளிய மருத்துவப் பராமரிப்பு குறிப்புகள்' : 'Key Recovery Guidelines'}</span>
              </div>
              <ul className="list-disc list-inside text-sm text-[#145B59] space-y-2 leading-relaxed">
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
            </div>
          </section>

          {/* Section 5: Frequently Asked Questions */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#20B2AA]">
              <HelpCircle className="w-4 h-4" />
              <span>{isTamil ? 'அடிக்கடி கேட்கப்படும் கேள்விகள்' : 'Patient Questions'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#145B59] tracking-tight">
              {isTamil ? '5. பொதுவான சந்தேகங்கள் & பதில்கள்' : '5. Frequently Asked Questions'}
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div key={index} className="liquid-glass-secondary p-6 rounded-2xl space-y-2">
                  <h3 className="font-bold text-base text-[#145B59] mb-1">
                    {isTamil ? faq.qTa : faq.qEn}
                  </h3>
                  <p className="text-sm text-[#587477] leading-relaxed">
                    {isTamil ? faq.aTa : faq.aEn}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 6: Related Procedures */}
          <section className="space-y-6 pt-6 border-t border-[#C8E7E3]/70">
            <div>
              <h2 className="text-2xl font-bold text-[#145B59]">
                {isTamil ? '6. தொடர்புடைய பிற சிகிச்சைகள்' : '6. Related Procedures'}
              </h2>
              <p className="text-xs text-[#587477] mt-1">
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
