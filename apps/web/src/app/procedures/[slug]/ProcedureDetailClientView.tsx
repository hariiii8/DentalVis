'use client';

import React from 'react';
import Link from 'next/link';
import { Container, Badge, ClinicalDisclaimerBanner, LiquidGlassSurface } from '@dentalvis/ui';
import { ProcedureDetail } from '@dentalvis/common';
import { CheckCircle2, Clock, ShieldCheck, HeartPulse, Sparkles, HelpCircle, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { YouTubeClickToLoadPlayer } from '@/components/YouTubeClickToLoadPlayer';
import { ProcedureCard } from '@/components/ProcedureCard';
import { ProcedureAnatomyViewer } from '@/components/ProcedureAnatomyViewer';

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
          <ProcedureAnatomyViewer
            procedureSlug={procedure.slug}
            imageSrc={coverImageSrc}
            lang={language}
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
