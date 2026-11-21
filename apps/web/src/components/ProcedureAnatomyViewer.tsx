'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { RotateCw, ZoomIn, ZoomOut, RefreshCw, Layers, ShieldCheck, Sparkles } from 'lucide-react';
import { Badge, LiquidGlassSurface } from '@dentalvis/ui';

interface AnatomyCallout {
  labelEn: string;
  labelTa: string;
  descEn: string;
  descTa: string;
  positionPercent: { x: number; y: number };
}

interface ProcedureAnatomyConfig {
  titleEn: string;
  titleTa: string;
  subtitleEn: string;
  subtitleTa: string;
  callouts: AnatomyCallout[];
  interactive3DReady: boolean;
}

const PROCEDURE_ANATOMY_DATA: Record<string, ProcedureAnatomyConfig> = {
  'root-canal-treatment': {
    titleEn: 'Cross-Sectional Tooth & Pulp Chamber Anatomy',
    titleTa: 'பல் குறுக்குவெட்டு & நரம்பு அறை உடற்கூறியல்',
    subtitleEn: 'Enamel, Dentin, Inflamed Pulp, and Root Canal System',
    subtitleTa: 'எனாமல், டென்டின், நரம்பு அறை மற்றும் வேர் கால்வாய் கட்டமைப்பு',
    interactive3DReady: false,
    callouts: [
      {
        labelEn: 'Crown & Outer Enamel',
        labelTa: 'பல் கிரவுன் & எனாமல்',
        descEn: 'The hard, mineralized outer layer protecting the tooth.',
        descTa: 'பல்லைப் பாதுகாக்கும் வெளிப்புறக் கடினமான எனாமல் அடுக்கு.',
        positionPercent: { x: 50, y: 22 },
      },
      {
        labelEn: 'Living Dentin Layer',
        labelTa: 'உயிருள்ள டென்டின் அடுக்கு',
        descEn: 'Microscopic tubules transmitting temperature and sensation.',
        descTa: 'வெப்பம் மற்றும் கூச்சத்தை உணர்த்தும் நுண்ணிய டென்டின் குழாய்கள்.',
        positionPercent: { x: 38, y: 44 },
      },
      {
        labelEn: 'Pulp Chamber & Canals',
        labelTa: 'நரம்பு அறை & கால்வாய்கள்',
        descEn: 'Vascular and nerve pathways safely cleaned and sealed during RCT.',
        descTa: 'வேர் கால்வாய் சிகிச்சையில் சுத்தம் செய்யப்பட்டு சீல் செய்யப்படும் நரம்புப் பகுதி.',
        positionPercent: { x: 52, y: 64 },
      },
    ],
  },
  'dental-crowns': {
    titleEn: 'Prepared Tooth Core & Custom Ceramic Restorative Anatomy',
    titleTa: 'தயாரிக்கப்பட்ட பல் & செராமிக் தொப்பி கட்டமைப்பு',
    subtitleEn: 'Tooth Abutment, Margin Chamfer, and Custom Ceramic Coping',
    subtitleTa: 'பல் கோர், விளிம்பு வடிவம் மற்றும் செராமிக் தொப்பி அமைப்பு',
    interactive3DReady: false,
    callouts: [
      {
        labelEn: 'Custom Ceramic Crown',
        labelTa: 'செராமிக் பல் தொப்பி',
        descEn: 'Milled ceramic restoring chewing anatomy and lifelike aesthetics.',
        descTa: 'மெல்லும் திறனையும் இயல்பான தோற்றத்தையும் தரும் செராமிக் உறை.',
        positionPercent: { x: 50, y: 24 },
      },
      {
        labelEn: 'Precision Margin Chamfer',
        labelTa: 'விளிம்பு சீரமைப்பு',
        descEn: 'Smooth submillimeter margin ensuring flush gumline fit.',
        descTa: 'ஈறு வரிசையில் சரியாகப் பொருந்துவதற்கான துல்லிய விளிம்பு.',
        positionPercent: { x: 58, y: 46 },
      },
      {
        labelEn: 'Preserved Natural Core',
        labelTa: 'இயற்கை பல் கோர்',
        descEn: 'Shaped vital tooth structure providing foundational retention.',
        descTa: 'தொப்பியைத் தாங்கிப் பிடிக்கும் இயற்கையான பல் பகுதி.',
        positionPercent: { x: 44, y: 68 },
      },
    ],
  },
  'single-dental-implant': {
    titleEn: 'Implant Fixture, Abutment & Bone Integration Anatomy',
    titleTa: 'இம்ப்ளான்ட் திருகு, இணைப்பு மற்றும் தாடை எலும்பு கட்டமைப்பு',
    subtitleEn: 'Porcelain Crown, Titanium Abutment, and Osseointegrated Root',
    subtitleTa: 'செயற்கைப் பல், டைட்டானியம் இணைப்பு மற்றும் தாடை எலும்பு ஒருங்கிணைப்பு',
    interactive3DReady: false,
    callouts: [
      {
        labelEn: 'Prosthetic Porcelain Crown',
        labelTa: 'செயற்கை பீங்கான் பல்',
        descEn: 'Custom-shaded ceramic crown anchored securely to the abutment.',
        descTa: 'டைட்டானியம் இணைப்பில் உறுதியாகப் பொருத்தப்படும் பீங்கான் பல்.',
        positionPercent: { x: 50, y: 24 },
      },
      {
        labelEn: 'Titanium Abutment Collar',
        labelTa: 'டைட்டானியம் இணைப்பு காலர்',
        descEn: 'The precision connector linking the artificial root to the visible tooth.',
        descTa: 'செயற்கை வேரையும் மேல் பல்லையும் இணைக்கும் துல்லிய இணைப்பு.',
        positionPercent: { x: 50, y: 46 },
      },
      {
        labelEn: 'Osseointegrated Titanium Root',
        labelTa: 'எலும்புடன் இணையும் டைட்டானியம் வேர்',
        descEn: 'Biocompatible threaded fixture bonded permanently into the jawbone.',
        descTa: 'தாடை எலும்புடன் இயற்கையாக இணையும் பிரத்யேக டைட்டானியம் திருகு.',
        positionPercent: { x: 50, y: 72 },
      },
    ],
  },
  'deep-cleaning-scaling': {
    titleEn: 'Periodontal Pocket & Subgingival Root Anatomy',
    titleTa: 'ஈறு பை & பல் வேர் ஆழமான உடற்கூறியல்',
    subtitleEn: 'Gingival Sulcus, Calculus Deposits, and Root Cementum',
    subtitleTa: 'ஈறு விளிம்பு, கடின காரை படிவுகள் மற்றும் பல் வேர் பகுதி',
    interactive3DReady: false,
    callouts: [
      {
        labelEn: 'Crown Enamel Surface',
        labelTa: 'பல் எனாமல் புறப்பரப்பு',
        descEn: 'Supragingival enamel easily maintained with routine brushing.',
        descTa: 'வழக்கமான பிரஷிங் மூலம் பராமரிக்கப்படும் வெளிப்புற எனாமல்.',
        positionPercent: { x: 46, y: 26 },
      },
      {
        labelEn: 'Subgingival Calculus Deposit',
        labelTa: 'ஈறுகளுக்கு அடியில் உள்ள காரை',
        descEn: 'Hardened plaque removed gently with ultrasonic micro-vibrations.',
        descTa: 'அல்ட்ராசோனிக் கருவிகள் மூலம் கவனமாக நீக்கப்படும் கடின காரை.',
        positionPercent: { x: 56, y: 48 },
      },
      {
        labelEn: 'Periodontal Sulcus & Root Cementum',
        labelTa: 'ஈறு பை & வேர் சிமென்டம்',
        descEn: 'Healthy gum reattaches tightly after deep cleansing.',
        descTa: 'ஆழமான சுத்திகரிப்புக்குப் பின் ஈறுகள் வேருடன் மீண்டும் இணைகிறது.',
        positionPercent: { x: 44, y: 68 },
      },
    ],
  },
  'composite-dental-fillings': {
    titleEn: 'Cavity Preparation & Composite Bonding Architecture',
    titleTa: 'பல் சொத்தை சீரமைப்பு & காம்போசிட் பிணைப்பு உடற்கூறியல்',
    subtitleEn: 'Enamel Margin, Adhesive Interface, and Sculpted Resin Cusp',
    subtitleTa: 'எனாமல் விளிம்பு, பிணைப்பு அடுக்கு மற்றும் காம்போசிட் கலவை',
    interactive3DReady: false,
    callouts: [
      {
        labelEn: 'Photopolymer Curing Ray',
        labelTa: 'நீல ஒளிக்கதிர் கெட்டிப்படுத்துதல்',
        descEn: 'Focused 450nm blue spectrum photons activating composite polymerization.',
        descTa: 'காம்போசிட் கலவையை உடனடியாக கெட்டியாக்கும் நீல நிற ஒளிக் கதிர்.',
        positionPercent: { x: 50, y: 16 },
      },
      {
        labelEn: 'Layered Composite Resin',
        labelTa: 'காம்போசிட் ரெசின் அடுக்கு',
        descEn: 'Direct biocompatible resin matched seamlessly to natural tooth shade.',
        descTa: 'பல்லின் இயற்கை நிறத்திற்கு ஏற்ப அடுக்கப்படும் நீடித்த கலவை.',
        positionPercent: { x: 50, y: 32 },
      },
      {
        labelEn: 'Preserved Vital Dentin & Pulp',
        labelTa: 'பாதுகாக்கப்பட்ட டென்டின் மற்றும் நரம்பு',
        descEn: 'Healthy pulpal tissue safeguarded beneath conservative cavity preparation.',
        descTa: 'பாதுகாக்கப்படும் ஆரோக்கியமான இயற்கை பல் நரம்பு மற்றும் உள் பகுதி.',
        positionPercent: { x: 50, y: 56 },
      },
    ],
  },
  'routine-dental-cleaning-polishing': {
    titleEn: 'Supragingival Prophylaxis & Enamel Luster Anatomy',
    titleTa: 'பல் மேற்பரப்பு சுத்தம் மற்றும் பளபளப்பு உடற்கூறியல்',
    subtitleEn: 'Smooth Enamel, Prophy Rubber Cup, and Healthy Gingival Margin',
    subtitleTa: 'மென்மையான எனாமல், சுழலும் ரப்பர் கப் மற்றும் ஆரோக்கிய ஈறு விளிம்பு',
    interactive3DReady: false,
    callouts: [
      {
        labelEn: 'Fine Grit Prophy Cup',
        labelTa: 'சுழலும் மெருகூட்டல் ரப்பர் கப்',
        descEn: 'Rotary elastomeric cup applying gentle mint-flavored polishing paste.',
        descTa: 'பற்களை மெருகூட்டும் மென்மையான சுழலும் மருத்துவ ரப்பர் கருவி.',
        positionPercent: { x: 62, y: 24 },
      },
      {
        labelEn: 'Glass-Smooth Enamel Crown',
        labelTa: 'பளபளப்பான எனாமல் புறப்பரப்பு',
        descEn: 'Stain-free mineral surface resistant to early bacterial adherence.',
        descTa: 'கறைகள் மற்றும் அழுக்குகள் நீக்கப்பட்ட பளபளப்பான பல் பரப்பு.',
        positionPercent: { x: 44, y: 36 },
      },
      {
        labelEn: 'Healthy Pink Gingival Margin',
        labelTa: 'ஆரோக்கியமான இளஞ்சிவப்பு ஈறு',
        descEn: 'Tight, stippled gum seal free from swelling or bleeding.',
        descTa: 'வீக்கமின்றி பல்லோடு இறுக்கமாக இணைந்திருக்கும் ஆரோக்கியமான ஈறு.',
        positionPercent: { x: 38, y: 58 },
      },
    ],
  },
  'routine-tooth-extraction': {
    titleEn: 'Alveolar Bone Socket & Atraumatic Elevation Anatomy',
    titleTa: 'தாடை எலும்பு குழி & பல் பிரித்தெடுத்தல் உடற்கூறியல்',
    subtitleEn: 'Intact Tooth Root, Luxating Elevator, and Alveolar Ridge Crest',
    subtitleTa: 'பல் வேர், தளர்த்தும் கருவி மற்றும் தாடை எலும்பு விளிம்பு',
    interactive3DReady: false,
    callouts: [
      {
        labelEn: 'Controlled Axial Elevation',
        labelTa: 'மென்மையான மேல்நோக்கிய அழுத்தம்',
        descEn: 'Gentle vertical lift loosening periodontal ligament fibers atraumatically.',
        descTa: 'பல்லின் வேர் நார்களை மென்மையாக விடுவித்து மேலே உயர்த்தும் முறை.',
        positionPercent: { x: 50, y: 22 },
      },
      {
        labelEn: 'Luxating Dental Instrument',
        labelTa: 'தளர்த்தும் சிறப்பு மருத்துவக் கருவி',
        descEn: 'Precision instrument expanding socket bone space with zero sharp pain.',
        descTa: 'பல்லை எலும்பிலிருந்து எளிதாக விடுவிக்க உதவும் துல்லிய கருவி.',
        positionPercent: { x: 38, y: 46 },
      },
      {
        labelEn: 'Preserved Bone Socket Architecture',
        labelTa: 'பாதுகாக்கப்படும் எலும்பு குழி',
        descEn: 'Sound alveolar walls ready for natural clot healing or future restoration.',
        descTa: 'சேதமின்றி பாதுகாக்கப்படும் தாடை எலும்பு குழி பகுதி.',
        positionPercent: { x: 50, y: 72 },
      },
    ],
  },
  'wisdom-tooth-extraction': {
    titleEn: 'Impacted Third Molar & Mandibular Nerve Anatomy',
    titleTa: 'ஞானப்பல் & தாடை நரம்பு உடற்கூறியல்',
    subtitleEn: 'Mesioangular Impaction, Adjacent Second Molar, and Inferior Alveolar Nerve',
    subtitleTa: 'சாய்ந்த ஞானப்பல், அருகிலுள்ள இரண்டாவது கடவாய்ப் பல் மற்றும் முக்கிய நரம்பு',
    interactive3DReady: false,
    callouts: [
      {
        labelEn: 'Upright Adjacent Second Molar',
        labelTa: 'அருகிலுள்ள இரண்டாவது கடவாய்ப் பல்',
        descEn: 'Healthy functional chewing tooth protected from wisdom tooth pressure resorption.',
        descTa: 'ஞானப்பல்லின் அழுத்தத்திலிருந்து பாதுகாக்கப்படும் முக்கிய மெல்லும் பல்.',
        positionPercent: { x: 44, y: 44 },
      },
      {
        labelEn: 'Mesioangular Impacted Third Molar',
        labelTa: 'சாய்வாக சிக்கியுள்ள ஞானப்பல்',
        descEn: 'Angled wisdom tooth sectioned gently to protect the alveolar bone ridge.',
        descTa: 'சாய்வாக முளைத்து எலும்புக்குள் சிக்கியுள்ள ஞானப்பல்.',
        positionPercent: { x: 62, y: 52 },
      },
      {
        labelEn: 'Inferior Alveolar Nerve Canal',
        labelTa: 'கீழ் தாடை முக்கிய நரம்பு பாதை',
        descEn: 'Vital sensory nerve mapped precisely with 3D imaging to preserve lip sensation.',
        descTa: 'உதடு மற்றும் கன்னத்திற்கு உணர்வளிக்கும் முக்கிய நரம்பு பாதை.',
        positionPercent: { x: 50, y: 76 },
      },
    ],
  },
  'fixed-orthodontic-braces': {
    titleEn: 'Orthodontic Bracket & Biomechanical Archwire Anatomy',
    titleTa: 'பல் கிளிப் பிராக்கெட் & கம்பி உடற்கூறியல்',
    subtitleEn: 'Bonded Twin Brackets, NiTi Memory Wire, and Gingival Festoon',
    subtitleTa: 'பொருத்தப்படும் பிராக்கெட்டுகள், நிக்கல்-டைட்டானியம் கம்பி மற்றும் ஈறு விளிம்பு',
    interactive3DReady: false,
    callouts: [
      {
        labelEn: 'Bonded Orthodontic Bracket',
        labelTa: 'பல்லில் பொருத்தப்படும் பிராக்கெட்',
        descEn: 'Precision ceramic or steel bracket bonded to the geometric center of the crown.',
        descTa: 'பல்லின் மையப் பகுதியில் துல்லியமாக ஒட்டப்படும் கிளிப் பிராக்கெட்.',
        positionPercent: { x: 48, y: 48 },
      },
      {
        labelEn: 'NiTi Shape-Memory Archwire',
        labelTa: 'நிக்கல்-டைட்டானியம் நினைவாற்றல் கம்பி',
        descEn: 'High-elasticity wire delivering steady, continuous biological guiding forces.',
        descTa: 'பற்களை சரியான வரிசைக்கு மெதுவாக வழிநடத்தும் பிரத்யேக கம்பி.',
        positionPercent: { x: 38, y: 48 },
      },
      {
        labelEn: 'Protective Elastomeric Ligature',
        labelTa: 'பாதுகாப்பு ரப்பர் வளையம்',
        descEn: 'Flexible ligature locking the archwire securely within the bracket slot.',
        descTa: 'கம்பியை பிராக்கெட்டுடன் உறுதியாகப் பிடித்து வைக்கும் வளையம்.',
        positionPercent: { x: 58, y: 48 },
      },
    ],
  },
  'professional-teeth-whitening': {
    titleEn: 'Enamel Chromophore & Gingival Barrier Anatomy',
    titleTa: 'பல் எனாமல் கறை & ஈறு பாதுகாப்பு அரண் உடற்கூறியல்',
    subtitleEn: 'Extrinsic Stains, Light-Cured Resin Dam, and Oxygen-Bleached Enamel',
    subtitleTa: 'வெளிப்புற கறைகள், ஈறு பாதுகாப்பு அரண் மற்றும் வெண்மையாக்கப்பட்ட எனாமல்',
    interactive3DReady: false,
    callouts: [
      {
        labelEn: 'Pre-Treatment Stained Enamel',
        labelTa: 'சிகிச்சைக்கு முந்தைய கறை படிந்த பல்',
        descEn: 'Enamel micro-prisms holding deep organic tea, coffee, or age pigments.',
        descTa: 'உணவு மற்றும் பழக்கங்களால் எனாமல் அடுக்கில் படிந்துள்ள ஆழ்ந்த கறைகள்.',
        positionPercent: { x: 46, y: 48 },
      },
      {
        labelEn: 'Active Oxygen Whitened Enamel',
        labelTa: 'வெண்மையாக்கப்பட்ட பிரகாச எனாமல்',
        descEn: 'Clean, radiant mineral surface with dissolved chromophore molecular bonds.',
        descTa: 'மருத்துவ ஆக்சிஜன் மூலம் கறைகள் நீக்கப்பட்டு பளபளப்பாக்கப்பட்ட எனாமல்.',
        positionPercent: { x: 58, y: 48 },
      },
      {
        labelEn: 'Light-Cured Gingival Barrier Dam',
        labelTa: 'ஈறுகளுக்கான நீல நிற பாதுகாப்பு அரண்',
        descEn: 'Medical resin shield isolating soft tissues entirely from whitening gel contact.',
        descTa: 'வெளுப்பாக்கும் ஜெல் ஈறுகளில் படாமல் பாதுகாக்கும் பிரத்யேக அரண்.',
        positionPercent: { x: 52, y: 28 },
      },
    ],
  },
  'dental-sealants': {
    titleEn: 'Molar Occlusal Pit & Fissure Sealant Anatomy',
    titleTa: 'மோலார் மெல்லும் பரப்பு பள்ளங்கள் & சீலண்ட் அமைப்பு',
    subtitleEn: 'Deep Developmental Fissures, Enamel Grooves, and Protective Resin Barrier',
    subtitleTa: 'ஆழமான பள்ளங்கள், எனாமல் வரிப்பள்ளங்கள் மற்றும் பாதுகாப்பு பூச்சு அடுக்கு',
    interactive3DReady: false,
    callouts: [
      {
        labelEn: 'Protective Sealant Layer',
        labelTa: 'பாதுகாப்பு சீலண்ட் அடுக்கு',
        descEn: 'Biocompatible resin shielding natural developmental pits.',
        descTa: 'பல் சொத்தை ஏற்படாமல் தடுக்கும் மெல்லிய பாதுகாப்பு பிசின் அடுக்கு.',
        positionPercent: { x: 50, y: 25 },
      },
      {
        labelEn: 'Deep Occlusal Fissures',
        labelTa: 'ஆழமான மெல்லும் பள்ளங்கள்',
        descEn: 'Microscopic crevices susceptible to bacterial plaque accumulation.',
        descTa: 'உணவு துகள்கள் மற்றும் கிருமிகள் சேர வாய்ப்புள்ள ஆழமான இடுக்குகள்.',
        positionPercent: { x: 42, y: 48 },
      },
      {
        labelEn: 'Healthy Intact Enamel',
        labelTa: 'ஆரோக்கியமான எனாமல் அடுக்கு',
        descEn: 'Preserved natural tooth structure protected against demineralization.',
        descTa: 'அமிலங்களால் அரிக்கப்படாமல் பாதுகாக்கப்படும் பல்லின் வெளிப்புற எனாமல்.',
        positionPercent: { x: 55, y: 68 },
      }
    ],
  },
  'topical-fluoride-treatment': {
    titleEn: 'Enamel Micro-Prism Remineralization Anatomy',
    titleTa: 'எனாமல் நுண் கனிம மறுசீரமைப்பு கட்டமைப்பு',
    subtitleEn: 'Hydroxyapatite Crystals, Fluorapatite Surface Shield, and Dentinal Tubules',
    subtitleTa: 'ஹைட்ராக்ஸிஅபடைட் படிகங்கள், ஃப்ளூராபடைட் கவசம் மற்றும் டென்டின் குழாய்கள்',
    interactive3DReady: false,
    callouts: [
      {
        labelEn: 'Fluorapatite Shield',
        labelTa: 'ஃப்ளூராபடைட் பாதுகாப்பு கவசம்',
        descEn: 'Acid-resistant mineralized enamel barrier.',
        descTa: 'அமில அரிப்பைத் தடுக்கும் வலிமையான கனிம அடுக்கு.',
        positionPercent: { x: 50, y: 22 },
      },
      {
        labelEn: 'Enamel Hydroxyapatite Prisms',
        labelTa: 'எனாமல் கனிம படிகங்கள்',
        descEn: 'Densely packed calcium and phosphate prism structure.',
        descTa: 'கால்சியம் மற்றும் பாஸ்பேட் நிறைந்த பல்லின் கட்டமைப்பு.',
        positionPercent: { x: 42, y: 46 },
      },
      {
        labelEn: 'Dentinal Tubule Openings',
        labelTa: 'டென்டின் நுண்குழாய்கள்',
        descEn: 'Desensitized tubules protected from temperature discomfort.',
        descTa: 'கூச்சத்தை குறைக்கும் வகையில் மூடப்படும் நுண்குழாய்கள்.',
        positionPercent: { x: 56, y: 65 },
      }
    ],
  },
  'custom-night-guard-bruxism': {
    titleEn: 'Occlusal Splint & Dental Arch Cushioning Anatomy',
    titleTa: 'பல் பாதுகாப்பு அட்டை & தாடை சமநிலை உடற்கூறியல்',
    subtitleEn: 'Dual-Laminate Polymer, Contact Guidance Surface, and Incisal Buffer',
    subtitleTa: 'இரட்டை அடுக்கு பாலிமர், தொடர்பு பரப்பு மற்றும் முன் பல் பாதுகாப்பு அடுக்கு',
    interactive3DReady: false,
    callouts: [
      {
        labelEn: 'Dual-Laminate Guard Body',
        labelTa: 'பாதுகாப்பு அட்டையின் உடல் பகுதி',
        descEn: 'Resilient medical polymer dispersing grinding load.',
        descTa: 'பல் கடிக்கும் அழுத்தத்தை உறிஞ்சி பரவலாக்கும் சிறப்பு பொருள்.',
        positionPercent: { x: 50, y: 24 },
      },
      {
        labelEn: 'Smooth Occlusal Contact Surface',
        labelTa: 'சமநிலையான கடிக்கும் பரப்பு',
        descEn: 'Prevents interlocking of cusps during involuntary sleep clenching.',
        descTa: 'தூக்கத்தில் பற்கள் ஒன்றோடு ஒன்று உரசாமல் வழுக்கிச்செல்ல உதவும் பரப்பு.',
        positionPercent: { x: 38, y: 48 },
      },
      {
        labelEn: 'Protected Natural Crown Enamel',
        labelTa: 'பாதுகாக்கப்பட்ட இயற்கை எனாமல்',
        descEn: 'Shielded against fractures, abfraction, and attrition.',
        descTa: 'தேய்மானம் மற்றும் விரிசல்களில் இருந்து பாதுகாக்கப்படும் பற்கள்.',
        positionPercent: { x: 58, y: 68 },
      }
    ],
  },
  'sports-mouthguard-trauma-prevention': {
    titleEn: 'Impact-Absorbing Sports Shield Anatomy',
    titleTa: 'தாக்கம் உறிஞ்சும் விளையாட்டு கவச உடற்கூறியல்',
    subtitleEn: 'Multi-Laminate EVA Core, Labial Shock Buffer, and Palatal Retentive Border',
    subtitleTa: 'பல அடுக்கு EVA அமைப்பு, முன் தாடை அதிர்வு உறிஞ்சி மற்றும் அண்ண விளிம்பு',
    interactive3DReady: false,
    callouts: [
      {
        labelEn: 'Shock-Absorbing Front Buffer',
        labelTa: 'முன்பக்க அதிர்வு உறிஞ்சி',
        descEn: 'Reinforced 4mm labial layer dispersing direct blunt force.',
        descTa: 'நேரடி அடிகளை தாங்கி பற்களைக் காக்கும் தடிமனான முன்பக்க அடுக்கு.',
        positionPercent: { x: 50, y: 24 },
      },
      {
        labelEn: 'Cushioned Occlusal Table',
        labelTa: 'மெல்லும் பரப்பு மெத்தை அமைப்பு',
        descEn: 'Separates maxillary and mandibular arches against concussive jaw impact.',
        descTa: 'கீழ் தாடை மேல் தாடையோடு பலமாக மோதுவதைத் தடுக்கும் மெத்தை அமைப்பு.',
        positionPercent: { x: 40, y: 50 },
      },
      {
        labelEn: 'Anterior Incisor Anatomy',
        labelTa: 'முன் பற்கள் கட்டமைப்பு',
        descEn: 'Vital front teeth safeguarded against traumatic luxation and avulsion.',
        descTa: 'விளையாட்டின் போது அடிபட்டு விழுவதிலிருந்து பாதுகாக்கப்படும் முன் பற்கள்.',
        positionPercent: { x: 56, y: 70 },
      }
    ],
  },
  'inlays-and-onlays': {
    titleEn: 'Cusp-Preserving Indirect Restoration Anatomy',
    titleTa: 'பல் உச்சி காக்கும் இன்லே/ஆன்லே உடற்கூறியல்',
    subtitleEn: 'Ceramic Inlay Margin, Preserved Cusp Wall, and Adhesive Resin Interface',
    subtitleTa: 'பீங்கான் அடைப்பு விளிம்பு, பாதுகாக்கப்பட்ட பல் உச்சி மற்றும் பசையமைப்பு',
    interactive3DReady: false,
    callouts: [
      {
        labelEn: 'Custom Ceramic Onlay Body',
        labelTa: 'பீங்கான் ஆன்லே அடைப்பு',
        descEn: 'Milled ceramic replacing missing occlusal cusps.',
        descTa: 'உடைந்த மெல்லும் பல் உச்சியை சீரமைக்கும் பீங்கான் துண்டு.',
        positionPercent: { x: 50, y: 22 },
      },
      {
        labelEn: 'Preserved Natural Cusp Enamel',
        labelTa: 'பாதுகாக்கப்பட்ட இயற்கை பல் உச்சி',
        descEn: 'Healthy tooth wall retained without unnecessary reduction.',
        descTa: 'அகற்றப்படாமல் பாதுகாக்கப்படும் ஆரோக்கியமான இயற்கை பல் பகுதி.',
        positionPercent: { x: 38, y: 46 },
      },
      {
        labelEn: 'Biocompatible Adhesive Bond Line',
        labelTa: 'நுண் ஒட்டுதல் பிசின் அடுக்கு',
        descEn: 'Micro-mechanical seal preventing recurrent margin decay.',
        descTa: 'கிருமிகள் நுழையாமல் பல்லோடு அடைப்பை இறுக்கமாக பிணைக்கும் அடுக்கு.',
        positionPercent: { x: 56, y: 66 },
      }
    ],
  },
  'direct-composite-bonding': {
    titleEn: 'Anterior Incisal Composite Bonding Anatomy',
    titleTa: 'முன் பல் காம்போசிட் பிணைப்பு உடற்கூறியல்',
    subtitleEn: 'Sculpted Resin Edge, Enamel Micro-Bevel, and Seamless Aesthetic Transition',
    subtitleTa: 'செதுக்கப்பட்ட பிசின் விளிம்பு, எனாமல் நுண் விளிம்பு மற்றும் இயற்கை இணைப்பு',
    interactive3DReady: false,
    callouts: [
      {
        labelEn: 'Sculpted Composite Resin Edge',
        labelTa: 'வடிவமைக்கப்பட்ட காம்போசிட் பிசின்',
        descEn: 'Multi-layer composite restoring fractured incisal edge.',
        descTa: 'உடைந்த முன் பல் விளிம்பை மீட்டெடுக்கும் பல அடுக்கு பிசின்.',
        positionPercent: { x: 50, y: 22 },
      },
      {
        labelEn: 'Conservative Enamel Bevel',
        labelTa: 'மெல்லிய எனாமல் சாய்வு விளிம்பு',
        descEn: 'Feathered boundary blending natural tooth enamel and restoration.',
        descTa: 'செயற்கை அடைப்புக்கும் இயற்கை பல்லுக்கும் வேறுபாடு தெரியாமல் இணைக்கும் விளிம்பு.',
        positionPercent: { x: 42, y: 46 },
      },
      {
        labelEn: 'Vital Sound Tooth Structure',
        labelTa: 'ஆரோக்கியமான இயற்கை பல்',
        descEn: 'Completely preserved natural tooth body without drilling.',
        descTa: 'தேய்க்கப்படாமல் முழுமையாக பாதுகாக்கப்படும் ஆரோக்கியமான இயற்கை பல்.',
        positionPercent: { x: 58, y: 68 },
      }
    ],
  },
  'pulp-capping': {
    titleEn: 'Vital Pulp Chamber & Bioactive Bridge Anatomy',
    titleTa: 'உயிருள்ள நரம்பு அறை & பயோ ஆக்டிவ் பாலம் உடற்கூறியல்',
    subtitleEn: 'Reparative Dentin Bridge, Bioactive Capping Liner, and Living Pulp Fibers',
    subtitleTa: 'புதிய டென்டின் பாலம், பாதுகாப்பு மருந்து அடுக்கு மற்றும் வாழும் நரம்பு திசு',
    interactive3DReady: false,
    callouts: [
      {
        labelEn: 'Bioactive Pulp Cap (MTA)',
        labelTa: 'பயோ ஆக்டிவ் மருந்து அடுக்கு',
        descEn: 'Calcium silicate stimulating tertiary dentinogenesis.',
        descTa: 'புதிய எலும்பு அடுக்கு உருவாக உதவும் பயோ-செராமிக் மருந்து.',
        positionPercent: { x: 50, y: 24 },
      },
      {
        labelEn: 'Reparative Dentin Bridge',
        labelTa: 'புதிய பாதுகாப்பு டென்டின் பாலம்',
        descEn: 'Natural calcified barrier protecting the pulp chamber.',
        descTa: 'நரம்பை சுற்றி புதிதாக உருவாகும் இயற்கை எலும்பு கவசம்.',
        positionPercent: { x: 40, y: 46 },
      },
      {
        labelEn: 'Living Vital Dental Pulp',
        labelTa: 'உயிருள்ள பல் நரம்பு திசு',
        descEn: 'Preserved nerve and blood vessels keeping tooth naturally vital.',
        descTa: 'பல்லிற்கு உயிர் கொடுக்கும் நரம்புகள் மற்றும் இரத்த நாளங்கள்.',
        positionPercent: { x: 56, y: 68 },
      }
    ],
  },
  'endodontic-retreatment': {
    titleEn: 'Complex Root Canal System Retreatment Anatomy',
    titleTa: 'சிக்கலான வேர் கால்வாய் மறுசீரமைப்பு உடற்கூறியல்',
    subtitleEn: 'Missed Accessory Canals, Dissolved Gutta-Percha, and Apical Lesion Healing',
    subtitleTa: 'விடுபட்ட நுண் கால்வாய்கள், பழைய அடைப்பு நீக்கம் மற்றும் வேர் முனை தொற்று குணமாகுதல்',
    interactive3DReady: false,
    callouts: [
      {
        labelEn: 'Cleaned Primary Canal',
        labelTa: 'சுத்தம் செய்யப்பட்ட முக்கிய கால்வாய்',
        descEn: 'Unobstructed root canal debrided of old filling material.',
        descTa: 'பழைய அடைப்பு நீக்கப்பட்டு சுத்தப்படுத்தப்பட்ட வேர் கால்வாய்.',
        positionPercent: { x: 50, y: 22 },
      },
      {
        labelEn: 'Accessory / Lateral Canal',
        labelTa: 'பக்கவாட்டு நுண் கால்வாய்',
        descEn: 'Microscopic branch newly disinfected during retreatment.',
        descTa: 'மறுசிகிச்சையின் போது கண்டறியப்பட்டு சுத்தப்படுத்தப்படும் பக்கவாட்டு கால்வாய்.',
        positionPercent: { x: 38, y: 48 },
      },
      {
        labelEn: 'Healing Periapical Bone Defect',
        labelTa: 'குணமாகும் வேர் முனை எலும்பு பகுதி',
        descEn: 'Bone regeneration occurring after bacterial clearance.',
        descTa: 'தொற்று நீக்கப்பட்ட பின் தாடை எலும்பு மீண்டும் ஆரோக்கியமாக மாறும் பகுதி.',
        positionPercent: { x: 58, y: 70 },
      }
    ],
  },
  'apicoectomy': {
    titleEn: 'Root-End Microsurgery & Retro-Seal Anatomy',
    titleTa: 'வேர் முனை நுண் அறுவை சிகிச்சை & சீலிங் உடற்கூறியல்',
    subtitleEn: 'Resected Root Apex, Retrograde Bioceramic Plug, and Alveolar Crypt',
    subtitleTa: 'வெட்டப்பட்ட வேர் முனை, பயோ-செராமிக் அடைப்பு மற்றும் தாடை எலும்பு குழி',
    interactive3DReady: false,
    callouts: [
      {
        labelEn: 'Retrograde Bioceramic Seal (MTA)',
        labelTa: 'வேர் முனை பயோ-செராமிக் அடைப்பு',
        descEn: 'Biocompatible plug sealing root canal from the apical end.',
        descTa: 'வேர் முனையை கிருமிகள் அண்டாமல் முழுமையாக அடைக்கும் சிறப்பு சீல்.',
        positionPercent: { x: 50, y: 24 },
      },
      {
        labelEn: 'Resected Root Margin (90-Degree Bevel)',
        labelTa: 'வெட்டப்பட்ட வேர் விளிம்பு',
        descEn: 'Smoothly planed root surface free of infected delta canals.',
        descTa: 'தொற்று நீக்கப்பட்ட சீரான வேர் பகுதி.',
        positionPercent: { x: 40, y: 48 },
      },
      {
        labelEn: 'Periapical Bone Socket Cavity',
        labelTa: 'தாடை எலும்பு குழி',
        descEn: 'Surgical site regenerating with healthy trabecular bone.',
        descTa: 'சிகிச்சைக்குப் பின் புதிய எலும்பு உருவாகி குணமாகும் பகுதி.',
        positionPercent: { x: 58, y: 70 },
      }
    ],
  },
  'internal-tooth-bleaching': {
    titleEn: 'Internal Coronal Bleaching & Cervical Seal Anatomy',
    titleTa: 'உட்புற வெளுப்பாக்குதல் & பாதுகாப்பு சீலிங் உடற்கூறியல்',
    subtitleEn: 'Intracoronal Bleach Pellet, Glass Ionomer Cervical Barrier, and Gutta-Percha Root Seal',
    subtitleTa: 'உட்புற மருந்து உருண்டை, கண்ணாடி ஐயோனோமர் தடுப்பு மற்றும் வேர் சீலிங்',
    interactive3DReady: false,
    callouts: [
      {
        labelEn: 'Intracoronal Bleaching Pellet',
        labelTa: 'உட்புற வெளுப்பாக்கும் மருந்து',
        descEn: 'Active oxidizing agent releasing stain-clearing oxygen radicals.',
        descTa: 'பல்லின் உட்புற கறைகளை உடைத்து அகற்றும் ஆக்ஸிஜன் மருந்து.',
        positionPercent: { x: 50, y: 22 },
      },
      {
        labelEn: 'Cervical Glass Ionomer Barrier',
        labelTa: 'கழுத்து பகுதி பாதுகாப்பு தடுப்பு',
        descEn: '2mm hermetic seal preventing whitening agent leaking into root canals.',
        descTa: 'மருந்து வேர் பகுதிக்கு பரவாமல் தடுக்கும் 2 மிமீ பாதுகாப்பு சிமெண்ட்.',
        positionPercent: { x: 42, y: 46 },
      },
      {
        labelEn: 'Obturated Root Canal (Gutta-Percha)',
        labelTa: 'சீல் செய்யப்பட்ட வேர் கால்வாய்',
        descEn: 'Intact endodontic filling preserved securely beneath barrier.',
        descTa: 'தடுப்பின் கீழே பாதுகாப்பாக இருக்கும் வேர் கால்வாய் அடைப்பு.',
        positionPercent: { x: 56, y: 68 },
      }
    ],
  }
};

interface ProcedureAnatomyViewerProps {
  procedureSlug: string;
  imageSrc: string;
  lang?: 'en' | 'ta';
}

export function ProcedureAnatomyViewer({
  procedureSlug,
  imageSrc,
  lang = 'en',
}: ProcedureAnatomyViewerProps) {
  const isTamil = lang === 'ta';
  const anatomyData = PROCEDURE_ANATOMY_DATA[procedureSlug] || {
    titleEn: 'Clinical Dental Anatomy Guide',
    titleTa: 'மருத்துவ பல் உடற்கூறியல் வழிகாட்டி',
    subtitleEn: 'Tooth Structure and Tissue Relationships',
    subtitleTa: 'பல் கட்டமைப்பு மற்றும் திசு அமைப்புகள்',
    interactive3DReady: false,
    callouts: [],
  };

  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [activeCallout, setActiveCallout] = useState<number | null>(null);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.0));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  const handleRotate = () => setRotationAngle((prev) => (prev + 90) % 360);
  const handleReset = () => {
    setZoomLevel(1);
    setRotationAngle(0);
    setActiveCallout(null);
  };

  return (
    <LiquidGlassSurface
      variant="primary"
      specular
      refractiveRim
      className="rounded-3xl p-6 sm:p-8 space-y-6 shadow-md isolate"
    >
      {/* 1. Header Bar: Title, Clinical Integrity Status, and Honest Visualization Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#C8E7E3]/70 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#20B2AA] animate-pulse" />
            <h2 className="text-xl sm:text-2xl font-black text-[#145B59] tracking-tight">
              {isTamil ? anatomyData.titleTa : anatomyData.titleEn}
            </h2>
          </div>
          <p className="text-xs font-semibold text-[#587477]">
            {isTamil ? anatomyData.subtitleTa : anatomyData.subtitleEn}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="mint" className="gap-1.5 text-xs font-bold liquid-glass-lens">
            <Layers className="w-3.5 h-3.5 text-[#20B2AA]" />
            <span>
              {isTamil
                ? 'கல்விக்கான உடற்கூறியல் விளக்கப்படம்'
                : 'Educational Anatomical Illustration'}
            </span>
          </Badge>
          <Badge variant="outline" className="text-[11px] font-mono text-[#587477] bg-[#F5FAF9]/80">
            {isTamil
              ? 'மருத்துவ பரிசோதனைக்கு உட்படாதது · பயிற்சிக் குறிப்பு மட்டுமே'
              : 'Not Clinically Reviewed · Educational Reference Only'}
          </Badge>
        </div>
      </div>

      {/* 2. Interactive Optical Viewport with Zoom, Rotate, and Reset Controls */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-gradient-to-br from-[#F5FAF9] via-[#E8F7F6]/60 to-[#DCEFF5]/50 border border-white/90 shadow-inner relative z-10 group">
        {/* Subtle Measurement Grid Lines */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_right,#C8E7E3_1px,transparent_1px),linear-gradient(to_bottom,#C8E7E3_1px,transparent_1px)] bg-[size:40px_40px] opacity-25 pointer-events-none"
        />

        {/* Viewport Floating Controls Toolbar */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 p-1.5 rounded-xl liquid-glass-lens shadow-xs border border-white/80">
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-1.5 rounded-lg text-[#145B59] hover:bg-[#DDF5F1] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#20B2AA]"
            aria-label={isTamil ? 'பெரிதாக்கவும் (Zoom in)' : 'Zoom In'}
            title={isTamil ? 'பெரிதாக்கவும்' : 'Zoom In'}
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-1.5 rounded-lg text-[#145B59] hover:bg-[#DDF5F1] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#20B2AA]"
            aria-label={isTamil ? 'சிறிதாக்கவும் (Zoom out)' : 'Zoom Out'}
            title={isTamil ? 'சிறிதாக்கவும்' : 'Zoom Out'}
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleRotate}
            className="p-1.5 rounded-lg text-[#145B59] hover:bg-[#DDF5F1] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#20B2AA]"
            aria-label={isTamil ? 'சுழற்றவும் (Rotate 90°)' : 'Rotate 90°'}
            title={isTamil ? 'சுழற்றவும்' : 'Rotate'}
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 rounded-lg text-[#145B59] hover:bg-[#DDF5F1] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#20B2AA]"
            aria-label={isTamil ? 'இயல்பு நிலைக்கு மீட்டமைக்கவும்' : 'Reset View'}
            title={isTamil ? 'மீட்டமைக்கவும்' : 'Reset'}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Anatomical Illustration Canvas with CSS Transforms */}
        <div
          className="relative w-full h-full transition-transform duration-500 ease-out flex items-center justify-center"
          style={{
            transform: `scale(${zoomLevel}) rotate(${rotationAngle}deg)`,
          }}
        >
          <Image
            src={imageSrc}
            alt={isTamil ? anatomyData.titleTa : anatomyData.titleEn}
            fill
            priority
            className="object-contain p-4 sm:p-8"
            sizes="(max-width: 1024px) 100vw, 80vw"
          />

          {/* Interactive Anatomical Pins / Callouts */}
          {anatomyData.callouts.map((pin, index) => (
            <div
              key={index}
              style={{
                left: `${pin.positionPercent.x}%`,
                top: `${pin.positionPercent.y}%`,
                transform: `translate(-50%, -50%) rotate(${-rotationAngle}deg)`,
              }}
              className="absolute z-20"
            >
              <button
                type="button"
                onClick={() => setActiveCallout(activeCallout === index ? null : index)}
                aria-label={isTamil ? pin.labelTa : pin.labelEn}
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#20B2AA] ${
                  activeCallout === index
                    ? 'bg-[#145B59] text-white scale-125 ring-4 ring-[#20B2AA]/40'
                    : 'bg-[#20B2AA] text-white hover:scale-115'
                }`}
              >
                {index + 1}
              </button>
            </div>
          ))}
        </div>

        {/* Status Chip (Honest statement: 2D Educational Diagram) */}
        <div className="absolute bottom-3 left-3 z-20">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl liquid-glass-lens text-[11px] font-bold text-[#145B59] shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#20B2AA]" />
            <span>
              {isTamil
                ? '2D கல்வி விளக்க வரைபடம்'
                : '2D Educational Diagram'}
            </span>
          </span>
        </div>
      </div>

      {/* 3. Anatomical Breakdown Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 relative z-10">
        {anatomyData.callouts.map((item, index) => {
          const isActive = activeCallout === index;
          return (
            <div
              key={index}
              onClick={() => setActiveCallout(isActive ? null : index)}
              className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 border ${
                isActive
                  ? 'liquid-glass-primary border-[#20B2AA] shadow-sm scale-[1.02]'
                  : 'liquid-glass-secondary border-[#C8E7E3]/70 hover:border-[#20B2AA]/50'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-black ${
                    isActive ? 'bg-[#145B59] text-white' : 'bg-[#20B2AA] text-white'
                  }`}
                >
                  {index + 1}
                </span>
                <h4 className="text-sm font-bold text-[#145B59]">
                  {isTamil ? item.labelTa : item.labelEn}
                </h4>
              </div>
              <p className="text-xs text-[#587477] leading-relaxed">
                {isTamil ? item.descTa : item.descEn}
              </p>
            </div>
          );
        })}
      </div>

      {/* 4. Transparency & Clinical Provenance Notice */}
      <div className="p-4 rounded-2xl liquid-glass-secondary flex items-start gap-3 text-xs text-[#587477] relative z-10 border border-[#C8E7E3]/60">
        <ShieldCheck className="w-4 h-4 text-[#20B2AA] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {isTamil
            ? 'இது பொதுவான புரிதலை ஆதரிப்பதற்காக உருவாக்கப்பட்ட எளிமைப்படுத்தப்பட்ட 2D கல்வி விளக்கப்படமாகும். இது முறையான மருத்துவ அல்லது நிறுவன ஆய்வுக்கு உட்படவில்லை, மேலும் இது நோயறிதல் படமும் அல்ல. தனிப்பட்ட மருத்துவ ஆலோசனைக்கு தகுதியான பல் மருத்துவ நிபுணரை அணுகவும்.'
            : 'This is a simplified 2D educational illustration intended to support general understanding. It has not undergone formal clinical or institutional review and is not a diagnostic image. Consult a qualified dental professional for individual clinical advice.'}
        </p>
      </div>
    </LiquidGlassSurface>
  );
}
