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
        labelEn: 'Resilient Splint Polymer Barrier',
        labelTa: 'பாதுகாப்பு அட்டையின் உடல் பகுதி',
        descEn: 'Durable barrier cushioning tooth enamel from wear and micro-fractures.',
        descTa: 'பல் எனாமல் தேய்மானம் மற்றும் உடைவதைத் தடுக்கும் சிறப்பு பாலிமர் பரப்பு.',
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
        labelEn: 'Resected Root Apex (~3mm)',
        labelTa: 'வெட்டப்பட்ட வேர் விளிம்பு',
        descEn: 'Targeted root resection eliminating apical ramification delta.',
        descTa: 'நுண் கிளை தொற்று பகுதிகளை நீக்க வெட்டப்பட்ட வேர் முனை.',
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
        labelEn: 'Cervical Glass Ionomer Barrier (~2mm)',
        labelTa: 'கழுத்து பகுதி பாதுகாப்பு தடுப்பு',
        descEn: 'Mechanical barrier at the CEJ preventing radicular leakage and cervical resorption.',
        descTa: 'வேர் பகுதிக்கு மருந்து கசிந்து வெளி வேர் அரிப்பு ஏற்படுவதைத் தடுக்கும் பாதுகாப்பு சிமெண்ட்.',
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
  },
  'gingival-flap-surgery': {
    titleEn: 'Periodontal Flap & Deep Pocket Anatomy',
    titleTa: 'ஈறு மடல் மற்றும் ஆழமான பாக்கெட் உடற்கூறியல்',
    subtitleEn: 'Elevated Mucoperiosteal Flap, Subgingival Calculus, and Alveolar Bone Defect',
    subtitleTa: 'விலக்கப்பட்ட ஈறு மடல், வேர் காரை மற்றும் தாடை எலும்பு குறைபாடு',
    interactive3DReady: false,
    callouts: [
      {
        labelEn: 'Reflected Mucoperiosteal Flap',
        labelTa: 'விலக்கப்பட்ட ஈறு திசு மடல்',
        descEn: 'Full-thickness flap granting direct optical visualization to root.',
        descTa: 'வேர் பகுதியை நேரடியாகப் பார்க்க விலக்கப்பட்ட ஈறு மடல்.',
        positionPercent: { x: 50, y: 22 },
      },
      {
        labelEn: 'Subgingival Calculus & Granulation',
        labelTa: 'வேர் காரை மற்றும் தொற்று திசு',
        descEn: 'Diseased bacterial biofilm adhering to root cementum.',
        descTa: 'வேர் மீது படிந்துள்ள கிருமி நச்சுக்கள் மற்றும் காரை.',
        positionPercent: { x: 40, y: 46 },
      },
      {
        labelEn: 'Infrabony Alveolar Pocket Defect',
        labelTa: 'எலும்பு பாக்கெட் குழி',
        descEn: 'Bone resorptive zone targeted for debridement and recontouring.',
        descTa: 'சுத்தம் செய்யப்பட்டு சீரமைக்கப்படும் எலும்பு குறைபாடு.',
        positionPercent: { x: 58, y: 68 },
      }
    ],
  },
  'gum-grafting': {
    titleEn: 'Soft Tissue Root Coverage & Graft Anatomy',
    titleTa: 'ஈறு ஒட்டு மற்றும் வேர் பாதுகாப்பு உடற்கூறியல்',
    subtitleEn: 'Subepithelial Connective Tissue Graft, Marginal Recession, and Recipient Vascular Bed',
    subtitleTa: 'இணைப்பு திசு ஒட்டு, இறங்கிய ஈறு விளிம்பு மற்றும் இரத்த ஓட்ட படுக்கை',
    interactive3DReady: false,
    callouts: [
      {
        labelEn: 'Subepithelial Connective Tissue Graft',
        labelTa: 'இணைப்பு திசு ஒட்டு',
        descEn: 'Donor tissue secured over exposed root to restore attached gingiva.',
        descTa: 'வெளிப்பட்ட வேரை மூட பொருத்தப்படும் ஆரோக்கியமான திசு.',
        positionPercent: { x: 50, y: 24 },
      },
      {
        labelEn: 'Exposed Avascular Root Surface',
        labelTa: 'வெளிப்பட்ட வேர் பரப்பு',
        descEn: 'Recessed cementum conditioned for new tissue attachment.',
        descTa: 'பற்கூச்சத்தை ஏற்படுத்தி திசு இழந்து நிற்கும் வேர் பகுதி.',
        positionPercent: { x: 38, y: 48 },
      },
      {
        labelEn: 'Vascularized Recipient Gingival Bed',
        labelTa: 'இரத்த ஓட்டம் கொண்ட ஈறு படுக்கை',
        descEn: 'Surrounding gum flaps providing capillary nourishment to graft.',
        descTa: 'ஒட்டு திசுவுக்கு இரத்த ஊட்டத்தை வழங்கும் சுற்றியுள்ள ஈறுகள்.',
        positionPercent: { x: 56, y: 66 },
      }
    ],
  },
  'crown-lengthening': {
    titleEn: 'Supracrestal Biologic Width & Ostectomy Anatomy',
    titleTa: 'பல் நீட்டிப்பு மற்றும் எலும்பு இடைவெளி உடற்கூறியல்',
    subtitleEn: 'Supracrestal Tissue Attachment, Sound Ferrule Zone, and Recontoured Bone Margin',
    subtitleTa: 'இயற்கை திசு இணைப்பு, கேப் தாங்கும் பல் பகுதி மற்றும் சீரமைக்கப்பட்ட எலும்பு',
    interactive3DReady: false,
    callouts: [
      {
        labelEn: 'Sound Supragingival Ferrule Structure',
        labelTa: 'கேப் தாங்கும் ஆரோக்கியமான பல் பகுதி',
        descEn: 'At least 1.5-2.0mm exposed tooth collar to retain future crown.',
        descTa: 'புதிய கேப் உறுதியாக நிற்க வெளிப்படுத்தப்பட்ட பல் பகுதி.',
        positionPercent: { x: 50, y: 22 },
      },
      {
        labelEn: 'Preserved Supracrestal Biologic Width',
        labelTa: 'பாதுகாக்கப்பட்ட இயற்கை திசு இடைவெளி',
        descEn: 'Essential 2-3mm soft tissue biological attachment space.',
        descTa: 'ஈறு வீக்கம் ஏற்படாமல் தடுக்க தேவையான ஆரோக்கிய இடைவெளி.',
        positionPercent: { x: 42, y: 46 },
      },
      {
        labelEn: 'Recontoured Crestal Alveolar Bone',
        labelTa: 'சீரமைக்கப்பட்ட தாடை எலும்பு விளிம்பு',
        descEn: 'Micro-sculpted bone edge providing harmonious anatomical contour.',
        descTa: 'பல் கேப்புக்கு போதிய இடைவெளி அளிக்க சீரமைக்கப்பட்ட எலும்பு.',
        positionPercent: { x: 58, y: 68 },
      }
    ],
  },
  'frenectomy': {
    titleEn: 'Frenulum Attachment & Mucosal Tension Anatomy',
    titleTa: 'இணைப்பு தசை மற்றும் ஈறு இழுவிசை உடற்கூறியல்',
    subtitleEn: 'Restrictive Fibrous Frenum, Interdental Diastema Site, and Free Gingival Margin',
    subtitleTa: 'இறுக்கமான தசை நார், பல் இடைவெளி பகுதி மற்றும் ஈறு விளிம்பு',
    interactive3DReady: false,
    callouts: [
      {
        labelEn: 'Restrictive Mucosal Frenum Band',
        labelTa: 'இறுக்கமான தசை இணைப்பு',
        descEn: 'Fibrous cord creating muscular tethering or tissue tension.',
        descTa: 'நாக்கு அல்லது உதட்டின் அசைவை கட்டுப்படுத்தும் தசை மடிப்பு.',
        positionPercent: { x: 50, y: 24 },
      },
      {
        labelEn: 'Interdental Diastema / Tension Zone',
        labelTa: 'பல் இடைவெளி மற்றும் இழுவிசை பகுதி',
        descEn: 'Gingival zone prone to gap opening or tissue blanching on pull.',
        descTa: 'தசை இழுப்பால் பற்களுக்கு இடையே இடைவெளி தோன்றும் பகுதி.',
        positionPercent: { x: 38, y: 48 },
      },
      {
        labelEn: 'Unrestricted Mucogingival Junction',
        labelTa: 'இயல்பான ஈறு இணைப்பு பகுதி',
        descEn: 'Healthy mucosal transition after targeted tension release.',
        descTa: 'தசை தளர்த்தப்பட்ட பின் இயல்பாக இயங்கும் ஈறு பகுதி.',
        positionPercent: { x: 56, y: 68 },
      }
    ],
  },
  'socket-preservation-bone-graft': {
    titleEn: 'Extraction Socket & Osteoconductive Graft Anatomy',
    titleTa: 'பல் குழி மற்றும் எலும்பு பாதுகாப்பு ஒட்டு உடற்கூறியல்',
    subtitleEn: 'Particulate Bone Scaffold, Intact Alveolar Socket Walls, and Collagen Seal Matrix',
    subtitleTa: 'எலும்பு ஒட்டு துகள்கள், சேதமடையாத எலும்பு சுவர்கள் மற்றும் கொலாஜன் மூடி',
    interactive3DReady: false,
    callouts: [
      {
        labelEn: 'Particulate Osteoconductive Graft',
        labelTa: 'எலும்பு ஒட்டு துகள்கள்',
        descEn: 'Mineral matrix guiding vascular invasion and new bone deposition.',
        descTa: 'புதிய எலும்பு உருவாவதற்கு சாரமாக விளங்கும் கனிம துகள்கள்.',
        positionPercent: { x: 50, y: 24 },
      },
      {
        labelEn: 'Intact Thin Labial / Buccal Bone Wall',
        labelTa: 'சேதமில்லா முன் எலும்பு சுவர்',
        descEn: 'Preserved cortical plate shielded against dimensional collapse.',
        descTa: 'சுருங்கிவிடாமல் பாதுகாக்கப்படும் மெல்லிய தாடை எலும்பு சுவர்.',
        positionPercent: { x: 40, y: 48 },
      },
      {
        labelEn: 'Resorbable Collagen Protective Seal',
        labelTa: 'கரையக்கூடிய கொலாஜன் பாதுகாப்பு மூடி',
        descEn: 'Biocompatible plug containing graft granules during soft-tissue healing.',
        descTa: 'எலும்பு துகள்கள் வெளியேறாமல் பாதுகாக்கும் கொலாஜன் படலம்.',
        positionPercent: { x: 58, y: 70 },
      }
    ],
  },
  'alveolar-ridge-augmentation': {
    titleEn: 'Guided Bone Regeneration & Ridge Reconstruction Anatomy',
    titleTa: 'வழிகாட்டப்பட்ட எலும்பு மீளுருவாக்கம் உடற்கூறியல்',
    subtitleEn: 'Augmented Bone Scaffold, Titanium Barrier Membrane, and Host Cortical Perforations',
    subtitleTa: 'எலும்பு ஒட்டு சாரம், டைட்டானியம் பாதுகாப்பு படலம் மற்றும் இரத்த நுண் துளைகள்',
    interactive3DReady: false,
    callouts: [
      {
        labelEn: 'Titanium-Reinforced Barrier Membrane',
        labelTa: 'டைட்டானியம் பாதுகாப்பு படலம்',
        descEn: 'Rigid space-maintaining shield blocking soft-tissue down-growth.',
        descTa: 'ஈறு செல்கள் உள்ளே புகாமல் தடுக்கும் உறுதியான படலம்.',
        positionPercent: { x: 50, y: 22 },
      },
      {
        labelEn: 'Regenerating Particulate/Block Bone Graft',
        labelTa: 'மீளுருவாகும் எலும்பு ஒட்டு',
        descEn: 'Scaffold rebuilding vital horizontal width and vertical height.',
        descTa: 'தாடையின் உயரம் மற்றும் அகலத்தை மீளமைக்கும் எலும்பு சாரம்.',
        positionPercent: { x: 42, y: 46 },
      },
      {
        labelEn: 'Perforated Host Cortical Alveolus',
        labelTa: 'நுண் துளையிடப்பட்ட தாடை எலும்பு',
        descEn: 'Decorticated vascular access supplying osteoblasts and blood vessels.',
        descTa: 'இரத்த ஓட்டத்தையும் எலும்பு செல்களையும் வழங்கும் நுண் துளைகள்.',
        positionPercent: { x: 58, y: 68 },
      }
    ],
  },
  'sinus-lift': {
    titleEn: 'Subantral Sinus Cavity & Floor Elevation Anatomy',
    titleTa: 'சைனஸ் அறை மற்றும் சவ்வு ஏற்ற உடற்கூறியல்',
    subtitleEn: 'Elevated Schneiderian Membrane, Maxillary Sinus Air Space, and Subantral Bone Graft',
    subtitleTa: 'உயர்த்தப்பட்ட சைனஸ் சவ்வு, காற்று அறை மற்றும் அடியில் உள்ள எலும்பு ஒட்டு',
    interactive3DReady: false,
    callouts: [
      {
        labelEn: 'Elevated Schneiderian Sinus Membrane',
        labelTa: 'உயர்த்தப்பட்ட சைனஸ் சவ்வு',
        descEn: 'Intact respiratory mucosa elevated to create grafting space.',
        descTa: 'எலும்பு வைக்க இடம் உருவாக்க சேதமின்றி உயர்த்தப்பட்ட சைனஸ் சவ்வு.',
        positionPercent: { x: 50, y: 22 },
      },
      {
        labelEn: 'Subantral Particulate Bone Graft',
        labelTa: 'சைனஸ் கீழ் எலும்பு ஒட்டு',
        descEn: 'Densely packed biomaterial creating vertical depth for implants.',
        descTa: 'இம்பிளான்ட் வைப்பதற்கு தேவையான உயரத்தை உருவாக்கும் எலும்பு துகள்கள்.',
        positionPercent: { x: 40, y: 46 },
      },
      {
        labelEn: 'Native Residual Maxillary Ridge Bone',
        labelTa: 'மீதமுள்ள தாடை எலும்பு',
        descEn: 'Pre-existing crestal bone providing primary implant fixation.',
        descTa: 'இம்பிளான்ட்டை ஆரம்பத்தில் நிலைநிறுத்தும் இயல்பான தாடை எலும்பு.',
        positionPercent: { x: 58, y: 68 },
      }
    ],
  },
  'dental-abscess-management': {
    titleEn: 'Acute Odontogenic Abscess & Drainage Anatomy',
    titleTa: 'தீவிர பல் சீழ்கட்டி மற்றும் வடிகால் உடற்கூறியல்',
    subtitleEn: 'Fluctuant Purulent Pocket, Etiological Canal Source, and Periapical Bone Cavity',
    subtitleTa: 'சீழ் நிறைந்த அறை, தொற்றின் மூல வேர் கால்வாய் மற்றும் தாடை எலும்பு குழி',
    interactive3DReady: false,
    callouts: [
      {
        labelEn: 'Fluctuant Purulent Abscess Pocket',
        labelTa: 'சீழ் நிறைந்த கட்டி பகுதி',
        descEn: 'Localized accumulation of purulent exudate requiring decompression.',
        descTa: 'அழுத்தம் குறைத்து வெளியேற்றப்பட வேண்டிய சீழ் தேக்கம்.',
        positionPercent: { x: 50, y: 24 },
      },
      {
        labelEn: 'Infected Pulpal / Periodontal Origin',
        labelTa: 'தொற்றின் மூல காரணம் (பல் வேர்)',
        descEn: 'Necrotic root canal system harboring anaerobic bacteria.',
        descTa: 'பாக்டீரியா தொற்றை உண்டாக்கிய பல்லின் இறந்த வேர் பகுதி.',
        positionPercent: { x: 38, y: 48 },
      },
      {
        labelEn: 'Decompressed Fascial Tissue Plane',
        labelTa: 'அழுத்தம் விடுவிக்கப்பட்ட தசை தளம்',
        descEn: 'Surgically drained space flushed to halt deep facial spread.',
        descTa: 'தொற்று பரவாமல் தடுக்க கழுவி சுத்தப்படுத்தப்பட்ட பகுதி.',
        positionPercent: { x: 56, y: 68 },
      }
    ],
  },
  'implant-supported-bridge': {
    titleEn: 'Implant-Supported Multi-Unit Prosthetic Anatomy',
    titleTa: 'இம்பிளான்ட் தாங்கும் பல் பாலம் உடற்கூறியல்',
    subtitleEn: 'Fixed Monolithic Zirconia Bridge, Titanium Abutments, and Osseointegrated Implants',
    subtitleTa: 'ஜிர்கோனியா பல் பாலம், டைட்டானியம் இணைப்புகள் மற்றும் எலும்புடன் இணைந்த இம்பிளான்ட்டுகள்',
    interactive3DReady: false,
    callouts: [
      {
        labelEn: 'Monolithic Zirconia Fixed Bridge',
        labelTa: 'நிரந்தர ஜிர்கோனியா பல் பாலம்',
        descEn: 'Rigid continuous prosthesis spanning missing tooth spaces.',
        descTa: 'பற்கள் இல்லாத இடைவெளியை நிரப்பும் உறுதியான பல் பாலம்.',
        positionPercent: { x: 50, y: 22 },
      },
      {
        labelEn: 'Precision Titanium Implant Abutment',
        labelTa: 'டைட்டானியம் இணைப்பு பகுதி',
        descEn: 'Custom-milled intermediate collar transferring occlusal force.',
        descTa: 'கடிக்கும் விசையை இம்பிளான்ட்டுக்கு மாற்றும் இணைப்பு சாதனம்.',
        positionPercent: { x: 42, y: 46 },
      },
      {
        labelEn: 'Osseointegrated Endosseous Implants',
        labelTa: 'எலும்புடன் இணைந்த டைட்டானியம் இம்பிளான்ட்',
        descEn: 'Anchored artificial roots integrated into dense alveolar bone.',
        descTa: 'தாடை எலும்புடன் உறுதியாகப் பிணைந்துள்ள செயற்கை வேர்கள்.',
        positionPercent: { x: 58, y: 68 },
      }
    ],
  },
  'full-arch-implant-restoration': {
    titleEn: 'Full-Arch Fixed Prosthesis & All-on-X Anatomy',
    titleTa: 'முழு தாடை நிரந்தர இம்பிளான்ட் சீரமைப்பு உடற்கூறியல்',
    subtitleEn: 'Full-Arch Monolithic Prosthesis, Angled Multi-Unit Abutments, and Strategic Implants',
    subtitleTa: 'முழு தாடை பாலம், கோண இணைப்புகள் மற்றும் திட்டமிட்டு வைக்கப்பட்ட இம்பிளான்ட்டுகள்',
    interactive3DReady: false,
    callouts: [
      {
        labelEn: 'Full-Arch Screw-Retained Prosthesis',
        labelTa: 'முழு தாடை திருகு பாலம்',
        descEn: 'Non-removable prosthetic arch restoring full bite and smile aesthetics.',
        descTa: 'முழு பற்கள் வரிசையையும் அசைவின்றி நிரந்தரமாக மீளமைக்கும் பாலம்.',
        positionPercent: { x: 50, y: 22 },
      },
      {
        labelEn: 'Tilted Posterior Multi-Unit Abutment',
        labelTa: 'சாய்வான கோண இணைப்பு பகுதி',
        descEn: 'Angled collar aligning tilted implants to parallel draw path.',
        descTa: 'சாய்வான இம்பிளான்ட்டுகளை நேராக இணைக்க உதவும் சிறப்பு இணைப்பு.',
        positionPercent: { x: 40, y: 46 },
      },
      {
        labelEn: 'Strategically Angled Endosseous Implants',
        labelTa: 'திட்டமிட்டு வைக்கப்பட்ட இம்பிளான்ட்டுகள்',
        descEn: 'Four to six implants maximizing bone contact while bypassing nerves.',
        descTa: 'நரம்பு மற்றும் சைனஸ் பகுதிகளைத் தவிர்த்து பொருத்தப்பட்ட 4 முதல் 6 இம்பிளான்ட்டுகள்.',
        positionPercent: { x: 58, y: 68 },
      }
    ],
  },
  'complete-removable-dentures': {
    titleEn: 'Complete Removable Denture & Edentulous Ridge Anatomy',
    titleTa: 'முழுமையான செயற்கைப் பல் வரிசை & தாடை எலும்பு உடற்கூறியல்',
    subtitleEn: 'Acrylic Baseplate, Peripheral Seal, Denture Teeth, and Residual Ridge Mucosa',
    subtitleTa: 'அக்ரிலிக் தளம், ஓரப்பகுதி சீல், செயற்கை பற்கள் மற்றும் தாடை எலும்பு சவ்வு',
    interactive3DReady: false,
    callouts: [
      {
        labelEn: 'Anatomical Acrylic Denture Teeth',
        labelTa: 'செயற்கை பல் வரிசை',
        descEn: 'Cross-linked polymer teeth arranged to support chewing comfort and smile aesthetics.',
        descTa: 'இயற்கையான தோற்றமும் சீரான மெல்லும் வசதியும் கொண்ட பாலிமர் பற்கள்.',
        positionPercent: { x: 50, y: 25 },
      },
      {
        labelEn: 'Pink Acrylic Flange & Denture Base',
        labelTa: 'அக்ரிலிக் தளம் & ஈறு பகுதி',
        descEn: 'Contoured PMMA acrylic simulating oral mucosa, supporting facial lips and cheeks.',
        descTa: 'முக உதடு மற்றும் கன்னங்களை தாங்கி நிற்கும் இளஞ்சிவப்பு அக்ரிலிக் பிசின் தளம்.',
        positionPercent: { x: 38, y: 48 },
      },
      {
        labelEn: 'Residual Alveolar Ridge & Mucosal Adaptation',
        labelTa: 'தாடை எலும்பு மேடு & மென்சவ்வு பொருத்தம்',
        descEn: 'Tissue contact provides support, with retention aided by peripheral seal and saliva film.',
        descTa: 'தாடை எலும்பின் மேல் பொருந்தி உறிஞ்சு விசை மற்றும் எச்சில் படலம் மூலம் நிலைநிறுத்தும் பகுதி.',
        positionPercent: { x: 62, y: 72 },
      },
    ],
  },
  'removable-partial-dentures': {
    titleEn: 'Removable Partial Denture (RPD) Structural Anatomy',
    titleTa: 'பகுதி செயற்கைப் பல் வரிசை கட்டமைப்பு உடற்கூறியல்',
    subtitleEn: 'Cast Metal Framework, Direct Retainers (Clasps), Rest Seats, and Saddle Base',
    subtitleTa: 'உலோக சட்டம், கிளிப்புகள், பல்லின் தாங்கு பள்ளங்கள் மற்றும் செயற்கை பல் தளம்',
    interactive3DReady: false,
    callouts: [
      {
        labelEn: 'Direct Retainer Clasp Assembly',
        labelTa: 'தாங்கும் கிளிப் இணைப்பு (Clasp)',
        descEn: 'Cobalt-chromium clasp arm engaging the undercut of natural abutment teeth for retention.',
        descTa: 'இயற்கை பல்லின் கீழ் விளிம்பைப் பிடித்துக் கொண்டு சாதனம் கழன்று விழாமல் தடுக்கும் கிளிப்.',
        positionPercent: { x: 32, y: 30 },
      },
      {
        labelEn: 'Cast Occlusal Rest & Guide Plane',
        labelTa: 'தாங்கு பள்ளம் (Rest Seat)',
        descEn: 'Precision cast rest channeling chewing forces vertically down the long axis of the root.',
        descTa: 'மெல்லும் அழுத்தத்தை இயற்கை பல்லின் வேர் வழியாக சீராக கடத்தும் உலோக தாங்கு பகுதி.',
        positionPercent: { x: 52, y: 42 },
      },
      {
        labelEn: 'Rigid Major Connector & Acrylic Saddle',
        labelTa: 'முதன்மை இணைப்பு & பல் தளம்',
        descEn: 'Biocompatible framework bridging the arch to unite teeth with acrylic missing tooth saddles.',
        descTa: 'தாடையின் இருபுறங்களையும் இணைக்கும் உறுதியான உலோகச் சட்டம் மற்றும் செயற்கைப் பற்கள் தளம்.',
        positionPercent: { x: 65, y: 68 },
      },
    ],
  },
  'full-mouth-rehabilitation': {
    titleEn: 'Full-Mouth Comprehensive Reconstruction Anatomy',
    titleTa: 'முழு வாய் மறுசீரமைப்பு உடற்கூறியல்',
    subtitleEn: 'Reconstructed Occlusal Plane, Vertical Dimension of Occlusion (VDO), and Ceramic Restorations',
    subtitleTa: 'மீளமைக்கப்பட்ட கடி தளம், முக உயரம் (VDO) மற்றும் செராமிக் மகுடங்கள்',
    interactive3DReady: false,
    callouts: [
      {
        labelEn: 'Maxillary Aesthetic Ceramic Architecture',
        labelTa: 'மேல் தாடை பீங்கான் மகுட வரிசை',
        descEn: 'Individually sculpted zirconia or ceramic crowns restoring smile line and functional guidance.',
        descTa: 'இயற்கையான சிரிப்பு மற்றும் முன் பற்களின் வழிகாட்டலை மீட்டெடுக்கும் அழகிய ஜிர்கோனியா மகுடங்கள்.',
        positionPercent: { x: 50, y: 22 },
      },
      {
        labelEn: 'Individually Restored Vertical Dimension',
        labelTa: 'தனிப்பயனாக்கப்பட்ட முக உயரம் & கடி சமநிலை',
        descEn: 'Carefully planned interocclusal space addressing severe wear and supporting TMJ comfort.',
        descTa: 'தாடை மூட்டுகளுக்கு சிரமமின்றி மெல்லும் விசையை சீரமைக்கும் சரியான முக உயரம்.',
        positionPercent: { x: 42, y: 50 },
      },
      {
        labelEn: 'Mandibular Posterior Occlusal Table',
        labelTa: 'கீழ் தாடை மெல்லும் தளம்',
        descEn: 'Milled cusps providing stable bilateral posterior chewing contacts tailored to patient biomechanics.',
        descTa: 'இருபுறமும் சமமான மெல்லும் விசையை உறுதி செய்யும் துல்லியமான பின் பற்கள் கடி தளம்.',
        positionPercent: { x: 58, y: 72 },
      },
    ],
  },
  'clear-aligners': {
    titleEn: 'Clear Aligner & Biomechanical Tooth Movement Anatomy',
    titleTa: 'கிளியர் அலைனர் & உயிரியல் பல் அசைவு உடற்கூறியல்',
    subtitleEn: 'Thermoformed Polymer Tray, Composite Attachments, and Periodontal Remodeling',
    subtitleTa: 'ஒளிபுகும் பாலிமர் தட்டு, காம்போசிட் தாங்கிகள் மற்றும் வேர் எலும்பு மாற்றம்',
    interactive3DReady: false,
    callouts: [
      {
        labelEn: 'Transparent Polyurethane Shell',
        labelTa: 'ஒளிபுகும் பாலிமர் உறை',
        descEn: 'Multilayer polymer tray applying prescribed biological forces to guide sequential tooth positions.',
        descTa: 'பற்களின் மேல் கச்சிதமாகப் பொருந்தி மருத்துவர் திட்டமிட்டபடி தொடர் அழுத்தம் தரும் ஒளிபுகும் பிளாஸ்டிக் உறை.',
        positionPercent: { x: 50, y: 24 },
      },
      {
        labelEn: 'Selective Composite Attachment',
        labelTa: 'தேர்ந்தெடுக்கப்பட்ட தாங்கி (Attachment)',
        descEn: 'Tooth-colored resin bonded when clinically indicated to provide mechanical grip for complex movement.',
        descTa: 'சிக்கலான பல் அசைவுகளுக்கு தேவைப்படும் போது மட்டும் பல்லின் நிறத்திலேயே வைக்கப்படும் சிறிய பிடிமானம்.',
        positionPercent: { x: 36, y: 45 },
      },
      {
        labelEn: 'Periodontal Ligament Remodeling Zones',
        labelTa: 'வேர் தசைநார் & எலும்பு மாற்ற மண்டலம்',
        descEn: 'Orthodontic force induces bone remodeling, with individual biological response determining movement pace.',
        descTa: 'பல் நகரும் திசையில் எலும்பு கரைதலும், பின்னால் புதிய எலும்பு உருவாதலும் நிகழும் மண்டலம்.',
        positionPercent: { x: 62, y: 70 },
      },
    ],
  },
  'palatal-expander': {
    titleEn: 'Rapid Palatal Expander (RPE) & Skeletal Suture Anatomy',
    titleTa: 'மேல்தாடை விரிவாக்க சாதனம் & நடு எலும்புப் பிளவு உடற்கூறியல்',
    subtitleEn: 'Midpalatal Suture, Stainless Steel Bands, Jacksrew Mechanism, and Maxillary Vault',
    subtitleTa: 'நடு எலும்பு தையல் பிளவு, கடவாய்ப் பல் வளையங்கள், திருகு அமைப்பு மற்றும் அண்ணக் குழி',
    interactive3DReady: false,
    callouts: [
      {
        labelEn: 'Central Expansion Jackscrew Mechanism',
        labelTa: 'மத்திய விரிவாக்க திருகு அமைப்பு',
        descEn: 'Threaded screw activated incrementally to deliver lateral orthopedic widening forces.',
        descTa: 'சாவியைக் கொண்டு மருத்துவர் ஆலோசனைப்படி திருப்புவதன் மூலம் பக்கவாட்டில் எலும்பை விரிக்கும் மையத் திருகு.',
        positionPercent: { x: 50, y: 40 },
      },
      {
        labelEn: 'Molar Anchorage Bands & Connecting Arms',
        labelTa: 'தாங்கும் பல் வளையங்கள் & இணைப்பு கம்பிகள்',
        descEn: 'Custom stainless steel bands cemented to upper molars anchoring the appliance securely.',
        descTa: 'மேல் கடவாய்ப் பற்களில் சிமெண்ட் கொண்டு உறுதியாக ஒட்டப்படும் எஃகு வளையங்கள்.',
        positionPercent: { x: 26, y: 55 },
      },
      {
        labelEn: 'Midpalatal Suture Expansion Zone',
        labelTa: 'நடு அண்ண எலும்புப் பிளவு மண்டலம்',
        descEn: 'Separation of the unfused suture in growing children allows new bone to form and consolidate.',
        descTa: 'வளரும் பருவத்தில் எலும்பு இடைவெளியில் புதிய எலும்பு செல்கள் தோன்றி தாடையை அகலப்படுத்தும் பகுதி.',
        positionPercent: { x: 50, y: 72 },
      },
    ],
  },
  'orthodontic-retainers': {
    titleEn: 'Orthodontic Retention Appliance Anatomy',
    titleTa: 'பல் சீரமைப்பு தக்கவைக்கும் சாதனம் உடற்கூறியல்',
    subtitleEn: 'Removable Clear/Hawley Retainer, Fixed Bonded Wire, and Periodontal Memory Fibers',
    subtitleTa: 'கழற்றி மாட்டும் ரீடெய்னர், உட்புற ஒட்டு கம்பி மற்றும் வேர் தசைநார்கள்',
    interactive3DReady: false,
    callouts: [
      {
        labelEn: 'Clear Vacuum-Formed Retentive Shell',
        labelTa: 'ஒளிபுகும் ரீடெய்னர் உறை',
        descEn: 'Snug-fitting thermoplastic shell worn per clinician advice to support tooth position stability.',
        descTa: 'பற்கள் நிலைத்திருக்க மருத்துவர் அறிவுரைப்படி அணியப்படும் மெல்லிய பிளாஸ்டிக் உறை.',
        positionPercent: { x: 48, y: 24 },
      },
      {
        labelEn: 'Lingual Bonded Multistrand Wire (Fixed)',
        labelTa: 'பற்களின் உட்புறம் ஒட்டப்படும் கம்பி (Fixed Retainer)',
        descEn: 'Flexible stainless steel wire bonded along anterior teeth to resist rotational relapse.',
        descTa: 'முன் பற்களின் உள்பகுதியில் வெளியில் தெரியாதவாறு ஒட்டப்படும் மெல்லிய நீடித்த கம்பி.',
        positionPercent: { x: 36, y: 52 },
      },
      {
        labelEn: 'Adapting Periodontal & Gingival Fibers',
        labelTa: 'மறுசீரமைக்கப்படும் ஈறு தசைநார்கள்',
        descEn: 'Collagen fibers gradually reorganize to support alignment, though natural minor shifts may occur over time.',
        descTa: 'பற்கள் புதிய நிலையில் நிலைபெற உதவும் தசைநார்கள்; எனினும் வயதுக்கு ஏற்ப சிறிய மாற்றங்கள் நிகழலாம்.',
        positionPercent: { x: 62, y: 74 },
      },
    ],
  },
  'pediatric-pulpotomy': {
    titleEn: 'Pediatric Pulpotomy & Coronal Pulp Chamber Anatomy',
    titleTa: 'பால் பல் நரம்பு சிகிச்சை உடற்கூறியல்',
    subtitleEn: 'Amputated Coronal Pulp, Bioactive Calcium-Silicate Barrier, Vital Radicular Pulp, and Primary Crown',
    subtitleTa: 'அகற்றப்பட்ட மேற்பகுதி நரம்பு, பயோசெராமிக் பூச்சு, வேர் நரம்பு மற்றும் பால் பல் மகுடம்',
    interactive3DReady: false,
    callouts: [
      {
        labelEn: 'Bioactive Calcium-Silicate (MTA) Barrier',
        labelTa: 'பயோசெராமிக் (MTA) பாதுகாப்பு அடுக்கு',
        descEn: 'Bioactive capping material placed over canal orifices to promote healing and preserve root pulp.',
        descTa: 'வேர் நரம்பு துவாரம் மீது வைக்கப்பட்டு நரம்பைப் பாதுகாக்கும் மருத்துவ பயோசெராமிக் பூச்சு.',
        positionPercent: { x: 50, y: 38 },
      },
      {
        labelEn: 'Healthy Vital Radicular Pulp Stumps',
        labelTa: 'ஆரோக்கியமான வேர் நரம்பு',
        descEn: 'Living radicular pulp preserved in primary roots to support natural physiological root resorption.',
        descTa: 'பால் பல் தானாக விழும் வரை உயிருடன் பாதுகாக்கப்படும் வேர் நரம்பு மற்றும் இரத்தக் குழாய்கள்.',
        positionPercent: { x: 38, y: 62 },
      },
      {
        labelEn: 'Hermetic Coronal Seal & Definitive Crown',
        labelTa: 'முழுமையான மகுட பாதுகாப்பு (Crown)',
        descEn: 'Definitive restoration (e.g., stainless steel crown) isolating the chamber against bacterial microleakage.',
        descTa: 'எச்சில் மற்றும் பாக்டீரியா உள்ளே நுழையாமல் பல்லிற்கு முழு வலிமை தரும் மகுட மூடி.',
        positionPercent: { x: 62, y: 22 },
      },
    ],
  },
  'pediatric-stainless-steel-crowns': {
    titleEn: 'Pediatric Stainless Steel Crown (SSC) Restorative Anatomy',
    titleTa: 'குழந்தைகளுக்கான எஃகு மகுடம் உடற்கூறியல்',
    subtitleEn: 'Preformed Austenitic Alloy, Crimped Cervical Margin, and Bioactive Glass Ionomer Seal',
    subtitleTa: 'முன்வடிவமைக்கப்பட்ட எஃகு மகுடம், வளைந்த விளிம்பு மற்றும் கிளாஸ் அயோனோமர் சிமெண்ட்',
    interactive3DReady: false,
    callouts: [
      {
        labelEn: 'Preformed Metal Occlusal Table',
        labelTa: 'முன்வடிவமைக்கப்பட்ட எஃகு மெல்லும் பரப்பு',
        descEn: 'Durable anatomical alloy surface engineered to endure heavy pediatric chewing forces.',
        descTa: 'குழந்தைகளின் தீவிர மெல்லும் விசையைத் தாங்கக்கூடிய உறுதியான எஃகு கடி பரப்பு.',
        positionPercent: { x: 50, y: 24 },
      },
      {
        labelEn: 'Crimped Cervical Margin & Snap Fit',
        labelTa: 'மடக்கப்பட்டு கச்சிதமாகப் பொருந்திய விளிம்பு',
        descEn: 'Contoured crown edge snapping subgingivally to prevent plaque accumulation and food traps.',
        descTa: 'ஈறுகளின் கீழ் உணவுத்துகள்கள் மாட்டாதவாறு கச்சிதமாகப் பொருந்திய வளைந்த மகுட விளிம்பு.',
        positionPercent: { x: 35, y: 52 },
      },
      {
        labelEn: 'Bioactive Glass Ionomer Luting Cement',
        labelTa: 'கிளாஸ் அயோனோமர் சிமெண்ட் அடுக்கு',
        descEn: 'Fluoride-releasing cement creating a durable seal against bacterial entry until exfoliation.',
        descTa: 'புளோரைடை வெளியிட்டு பல்லிற்குள் மீண்டும் சொத்தை வராமல் நிரந்தரமாகப் பிணைக்கும் சிமெண்ட்.',
        positionPercent: { x: 65, y: 44 },
      },
    ],
  },
  'pediatric-space-maintainers': {
    titleEn: 'Pediatric Space Maintainer Appliance Anatomy',
    titleTa: 'இடைவெளி பாதுகாக்கும் சாதனம் உடற்கூறியல்',
    subtitleEn: 'Anchor Molar Band, Cantilever Loop Wire, Edentulous Space, and Erupting Premolar',
    subtitleTa: 'கடவாய்ப் பல் வளையம், கம்பி வளையம், இடைவெளி பகுதி மற்றும் வளரும் நிரந்தரப் பல்',
    interactive3DReady: false,
    callouts: [
      {
        labelEn: 'Cemented Molar Anchor Band',
        labelTa: 'கடவாய்ப் பல் தாங்கும் வளையம் (Band)',
        descEn: 'Custom metal ring cemented around the adjacent molar, requiring careful plaque control.',
        descTa: 'பக்கத்து கடவாய்ப் பல்லில் உறுதியாகப் பொருத்தப்படும் எஃகு வளையம்; சுத்தமாகப் பராமரிப்பது அவசியம்.',
        positionPercent: { x: 30, y: 38 },
      },
      {
        labelEn: 'Passive Cantilever Wire Loop',
        labelTa: 'இடைவெளி தாங்கும் கம்பி வளையம் (Loop)',
        descEn: 'Rigid loop holding leeway space when indicated, requiring regular checks to avoid distortion.',
        descTa: 'முன் பல்லின் மீது லேசாகப் பொருந்தி இடைவெளி குறையாமல் பாதுகாக்கும் உறுதியான கம்பி.',
        positionPercent: { x: 55, y: 42 },
      },
      {
        labelEn: 'Developing Succedaneous Premolar Monitoring',
        labelTa: 'வளரும் நிரந்தரப் பல் கண்காணிப்பு',
        descEn: 'Radiographic follow-up tracks eruption progress to ensure timely appliance removal.',
        descTa: 'எலும்புக்குள் வளரும் நிரந்தரப் பல் வெளிவரும் போது சாதனத்தை சரியான நேரத்தில் கழற்ற தொடர் எக்ஸ்-ரே அவசியம்.',
        positionPercent: { x: 60, y: 72 },
      },
    ],
  },

  // Batch 5 Procedures
  'porcelain-veneers': {
    titleEn: 'Porcelain Laminate Veneer Anatomy',
    titleTa: 'பீங்கான் வெனியர் உடற்கூறியல்',
    subtitleEn: 'Facial Enamel Substrate, Custom Ceramic Shell, and Resin Luting Interface',
    subtitleTa: 'எனாமல் அடுக்கு, செராமிக் கவசம் மற்றும் பிசின் பசை இணைப்பு',
    interactive3DReady: false,
    callouts: [
      {
        labelEn: 'Labial Enamel Preparation Boundary',
        labelTa: 'முன்புற எனாமல் தயாரிப்பு எல்லை',
        descEn: 'Conservative preparation preserves maximal enamel thickness for optimal adhesive bond strength.',
        descTa: 'பிசின் பசை வலிமையாக ஒட்டுவதற்கு எனாமல் அடுக்கு அதிகபட்சமாகப் பாதுகாக்கப்பட்டு லேசாக செதுக்கப்படுகிறது.',
        positionPercent: { x: 38, y: 35 },
      },
      {
        labelEn: 'Custom Ceramic Veneer Facing',
        labelTa: 'பீங்கான் வெனியர் கவசம்',
        descEn: 'Ultra-thin aesthetic porcelain matching natural translucency, tooth shape, and shade gradients.',
        descTa: 'இயற்கையான பல்லின் ஒளி ஊடுருவல் மற்றும் நிறத்திற்கு ஏற்ப தயாரிக்கப்படும் மெல்லிய பீங்கான் தகடு.',
        positionPercent: { x: 65, y: 32 },
      },
      {
        labelEn: 'Subgingival or Equigingival Margin Interface',
        labelTa: 'ஈறு ஓர இணைப்புப் பகுதி',
        descEn: 'Precisely polished margins blend smoothly with periodontal tissues, preventing plaque accumulation.',
        descTa: 'ஈறுகளுக்கு எந்த பாதிப்பும் இன்றி, கறை படியாமல் வழவழப்பாக இணைக்கப்படும் மெல்லிய விளிம்பு.',
        positionPercent: { x: 50, y: 68 },
      },
    ],
  },

  'gingival-recontouring': {
    titleEn: 'Aesthetic Gingival Recontouring Anatomy',
    titleTa: 'ஈறு சீரமைப்பு உடற்கூறியல்',
    subtitleEn: 'Hyperplastic Margin, Scalled Gingival Zenith, and Supracrestal Biological Width',
    subtitleTa: 'அதிகப்படியான ஈறு விளிம்பு, சீரான ஈறு உச்சி மற்றும் திசு இடைவெளி',
    interactive3DReady: false,
    callouts: [
      {
        labelEn: 'Reshaped Gingival Zenith & Scallop',
        labelTa: 'சீரமைக்கப்பட்ட ஈறு உச்சி (Zenith)',
        descEn: 'Sculpted soft-tissue curve harmonizes tooth proportions and balances smile symmetry.',
        descTa: 'பற்கள் அழகாகவும் சமச்சீராகவும் தெரியுமாறு சீரமைக்கப்பட்ட ஈற்றின் உச்சி வளைவு.',
        positionPercent: { x: 48, y: 30 },
      },
      {
        labelEn: 'Soft-Tissue Excision Zone',
        labelTa: 'ஈறு திசு அகற்றும் பகுதி',
        descEn: 'Targeted laser or surgical reduction removing excess tissue obscuring anatomical crowns.',
        descTa: 'பல்லை அதிகமாக மூடியிருக்கும் அதிகப்படியான ஈறு லேசர் மூலம் மென்மையாக நீக்கப்படும் பகுதி.',
        positionPercent: { x: 32, y: 48 },
      },
      {
        labelEn: 'Supracrestal Tissue Attachment Space',
        labelTa: 'தாடை எலும்புக்கு மேலான திசு இடைவெளி',
        descEn: 'Sufficient biological distance between new margin and alveolar crest prevents tissue rebound.',
        descTa: 'ஈறு மீண்டும் வளராமல் தடுக்க தாடை எலும்பிற்கும் புதிய ஈறு விளிம்பிற்கும் இடையே விடப்படும் இடைவெளி.',
        positionPercent: { x: 62, y: 70 },
      },
    ],
  },

  'knocked-out-tooth-avulsion': {
    titleEn: 'Avulsed Permanent Tooth Emergency Anatomy',
    titleTa: 'முழுமையாக விழுந்த நிரந்தரப் பல் அவசர உடற்கூறியல்',
    subtitleEn: 'Intact Coronal Enamel, Periodontal Ligament (PDL) Fibers, and Alveolar Socket',
    subtitleTa: 'பல் மகுடம், இணைப்புத் திசு நார்கள் (PDL) மற்றும் தாடை எலும்புக்குழி',
    interactive3DReady: false,
    callouts: [
      {
        labelEn: 'Crown Handling Zone (Untouched Root)',
        labelTa: 'மகுடப் பகுதி (வேரைத் தொடக்கூடாது)',
        descEn: 'Handle only by the coronal surface; avoid touching or scraping the vulnerable root surface.',
        descTa: 'கழன்ற பல்லின் மகுடத்தை மட்டுமே தொட வேண்டும்; வேர்ப்பகுதியில் உள்ள செல்களை ஒருபோதும் தொடக்கூடாது.',
        positionPercent: { x: 50, y: 25 },
      },
      {
        labelEn: 'Vital Periodontal Ligament (PDL) Cells',
        labelTa: 'உயிருள்ள இணைப்புத் திசு செல்கள் (PDL)',
        descEn: 'Preserved in cold milk or HBSS; cellular survival is critical for successful reattachment.',
        descTa: 'குளிர்ந்த பாலில் பாதுகாக்கப்பட்ட உயிருள்ள செல்கள்; பல் மீண்டும் தாடையில் இணைய இவை மிக அவசியம்.',
        positionPercent: { x: 35, y: 55 },
      },
      {
        labelEn: 'Alveolar Socket & Flexible Splint Line',
        labelTa: 'எலும்புக்குழி & நிலைநிறுத்தும் கம்பி அமைப்பு',
        descEn: 'Socket is gently irrigated and the tooth stabilized with a flexible splint for periodontal healing.',
        descTa: 'எலும்புக்குழியில் பல் மீண்டும் வைக்கப்பட்டு, நெகிழ்வான கம்பி மூலம் பக்கத்து பற்களுடன் நிலைநிறுத்தப்படுகிறது.',
        positionPercent: { x: 68, y: 75 },
      },
    ],
  },

  'emergency-broken-tooth-repair': {
    titleEn: 'Traumatic Tooth Fracture Repair Anatomy',
    titleTa: 'உடைந்த பல் அவசர சீரமைப்பு உடற்கூறியல்',
    subtitleEn: 'Enamel/Dentin Fracture Edge, Pulp Chamber Status, and Composite Resin Restoration',
    subtitleTa: 'எனாமல்/டென்டின் உடைந்த விளிம்பு, நரம்பு அறை மற்றும் காம்போசிட் மறுசீரமைப்பு',
    interactive3DReady: false,
    callouts: [
      {
        labelEn: 'Fractured Enamel & Dentin Edge',
        labelTa: 'உடைந்த எனாமல் & டென்டின் விளிம்பு',
        descEn: 'Beveled or smoothed to seal exposed dentinal tubules and maximize composite bonding area.',
        descTa: 'பல் கூச்சத்தைத் தடுக்கவும் காம்போசிட் நன்றாக ஒட்டவும் உடைந்த விளிம்பு நுணுக்கமாக சீரமைக்கப்படுகிறது.',
        positionPercent: { x: 42, y: 35 },
      },
      {
        labelEn: 'Dental Pulp Chamber & Biocompatible Liner',
        labelTa: 'பல் நரம்பு அறை & பாதுகாப்பு அடுக்கு',
        descEn: 'Evaluated for vitality; biocompatible silicate cement protects pulp from thermal/bacterial irritation.',
        descTa: 'நரம்பு அறை பரிசோதிக்கப்பட்டு, கிருமி மற்றும் கூச்சத்திலிருந்து பாதுகாக்க பயோமெட்டீரியல் பூசப்படுகிறது.',
        positionPercent: { x: 52, y: 58 },
      },
      {
        labelEn: 'Multi-Shade Composite Resin Restoration',
        labelTa: 'பல வண்ண காம்போசிட் பிசின் மறுசீரமைப்பு',
        descEn: 'Layered resin sculpted to match original incisal translucency, anatomy, and chewing dynamics.',
        descTa: 'பல்லின் அசல் வடிவம், ஒளி ஊடுருவல் மற்றும் வண்ணத்திற்கு ஏற்ப அடுக்கடுக்காக வடிவமைக்கப்படும் ரெசின்.',
        positionPercent: { x: 65, y: 28 },
      },
    ],
  },

  'recement-dislodged-crown-bridge': {
    titleEn: 'Dislodged Crown & Abutment Assessment Anatomy',
    titleTa: 'கழன்ற பற்காப்பு மூடி & அடித்தளப் பல் உடற்கூறியல்',
    subtitleEn: 'Intaglio Prosthetic Surface, Cleaned Abutment Core, and Luting Cement Layer',
    subtitleTa: 'மூடியின் உள்பகுதி, சுத்தப்படுத்தப்பட்ட பல்லின் தளம் மற்றும் சிமெண்ட் அடுக்கு',
    interactive3DReady: false,
    callouts: [
      {
        labelEn: 'Crown Internal Intaglio Surface',
        labelTa: 'பற்காப்பு மூடியின் உள்பகுதி (Intaglio)',
        descEn: 'Cleared of old cement debris, grit-blasted or disinfected to ensure complete passive seating.',
        descTa: 'பழைய சிமெண்ட் நீக்கப்பட்டு, கிருமிநாசினி கொண்டு முழுமையாக சுத்தப்படுத்தப்படும் மூடியின் உட்புறம்.',
        positionPercent: { x: 52, y: 25 },
      },
      {
        labelEn: 'Sound Abutment Preparation Core',
        labelTa: 'ஆரோக்கியமான அடித்தளப் பல்',
        descEn: 'Inspected for recurrent decay, cracks, or margin breakdown before approving recementation.',
        descTa: 'மூடி கழன்றதற்கான காரணத்தை அறிய சொத்தை அல்லது விரிசல் இல்லை என உறுதிசெய்யப்படும் பல்லின் தளம்.',
        positionPercent: { x: 46, y: 55 },
      },
      {
        labelEn: 'Definitive Luting Cement Layer',
        labelTa: 'நிரந்தர டென்டல் சிமெண்ட் அடுக்கு',
        descEn: 'Resin-modified glass ionomer or adhesive cement creates a durable marginal seal.',
        descTa: 'மூடிக்கும் பல்லிற்கும் இடையே இடைவெளியின்றி உறுதியாக ஒட்டும் உயர்தர டென்டல் சிமெண்ட்.',
        positionPercent: { x: 60, y: 72 },
      },
    ],
  },

  'nitrous-oxide-inhalation-sedation': {
    titleEn: 'Nitrous Oxide Inhalation Sedation Delivery Anatomy',
    titleTa: 'நைட்ரஸ் ஆக்சைடு மயக்க வாயு உடற்கூறியல்',
    subtitleEn: 'Contoured Nasal Hood, Continuous Gas Blending, and Preserved Spontaneous Airway',
    subtitleTa: 'மூக்கு முகமூடி, பாதுகாப்பான வாயுக்கலவை மற்றும் இயல்பான மூச்சுப்பாதை',
    interactive3DReady: false,
    callouts: [
      {
        labelEn: 'Contoured Nasal Delivery Mask',
        labelTa: 'வசதியான மூக்கு முகமூடி (Nasal Mask)',
        descEn: 'Lightweight scavenging nasal mask delivering controlled nitrous oxide/oxygen mixture.',
        descTa: 'நோயாளி வசதியாக சுவாசிக்க மூக்கின் மேல் பொருத்தப்படும் நவீன முகமூடி அமைப்பு.',
        positionPercent: { x: 50, y: 32 },
      },
      {
        labelEn: 'Continuous Fail-Safe Gas Proportioning',
        labelTa: 'தானியங்கி வாயு விகித பாதுகாப்பு அமைப்பு',
        descEn: 'Mechanical fail-safes guarantee a minimum of 30% oxygen, preventing hypoxic mixtures.',
        descTa: 'குறைந்தபட்சம் 30% பிராணவாயு எப்போதும் இருப்பதை உறுதிசெய்யும் தானியங்கி பாதுகாப்பு கருவி.',
        positionPercent: { x: 68, y: 52 },
      },
      {
        labelEn: 'Preserved Pharyngeal & Laryngeal Reflexes',
        labelTa: 'பாதுகாக்கப்பட்ட இயல்பான தொண்டை அனிச்சை செயல்கள்',
        descEn: 'Patient maintains active airway reflexes, independent breathing, and verbal responsiveness.',
        descTa: 'நோயாளி இயல்பாக சுவாசிக்கிறார், விழுங்கும் திறன் மற்றும் சுயநினைவு முழுமையாகப் பாதுகாக்கப்படுகிறது.',
        positionPercent: { x: 38, y: 68 },
      },
    ],
  },

  'oral-sedation': {
    titleEn: 'Moderate Oral Conscious Sedation Monitoring Anatomy',
    titleTa: 'மிதமான வாய்வழி மயக்க கண்காணிப்பு உடற்கூறியல்',
    subtitleEn: 'Oral Anxiolytic Absorption, Continuous Pulse Oximetry, and Airway Patency',
    subtitleTa: 'மாத்திரை உட்கிரகிப்பு, ஆக்சிஜன் மானிட்டர் மற்றும் மூச்சுப்பாதை பாதுகாப்பு',
    interactive3DReady: false,
    callouts: [
      {
        labelEn: 'Oral Pharmacological Sedative Uptake',
        labelTa: 'வாய்வழி மயக்க மருந்து உட்கிரகிப்பு',
        descEn: 'Pre-procedure oral sedative provides systemic relaxation while patient remains responsive to prompts.',
        descTa: 'சிகிச்சைக்கு முன் கொடுக்கப்படும் மாத்திரை நரம்பு மண்டலத்தை அமைதிப்படுத்தி பதற்றத்தைக் குறைக்கிறது.',
        positionPercent: { x: 36, y: 40 },
      },
      {
        labelEn: 'Multi-Parameter Vital Signs Monitor',
        labelTa: 'உடல் இயக்க கண்காணிப்பு மானிட்டர்',
        descEn: 'Continuous tracking of pulse oximetry, blood pressure, heart rate, and respiratory status.',
        descTa: 'ரத்த அழுத்தம், இதயத்துடிப்பு மற்றும் ஆக்சிஜன் அளவை நொடிகள் தோறும் பதிவு செய்யும் கருவி.',
        positionPercent: { x: 66, y: 35 },
      },
      {
        labelEn: 'Unobstructed Airway & Verbal Response Path',
        labelTa: 'தடையில்லா மூச்சுப்பாதை & பதிலளிக்கும் விழிப்புணர்வு',
        descEn: 'Airway remains patent with active protective reflexes and purposeful verbal interaction.',
        descTa: 'சுவாசம் தடையின்றி இயங்குகிறது; மருத்துவரின் கேள்விகளுக்கு நோயாளி எளிதாக பதிலளிக்க முடிகிறது.',
        positionPercent: { x: 50, y: 72 },
      },
    ],
  },

  'intravenous-dental-sedation': {
    titleEn: 'Specialist Intravenous Sedation Monitoring Anatomy',
    titleTa: 'நிபுணர் நரம்பு வழி மயக்க கண்காணிப்பு உடற்கூறியல்',
    subtitleEn: 'Continuous Capnography Line, Multi-Lead ECG, and Controlled Vascular Infusion',
    subtitleTa: 'சுவாசக் கண்காணிப்பு (Capnography), இதய மானிட்டர் (ECG) மற்றும் நரம்பு வழி செலுத்துகை',
    interactive3DReady: false,
    callouts: [
      {
        labelEn: 'Intravenous Vascular Access Line',
        labelTa: 'நரம்பு வழி பாதை (IV Access)',
        descEn: 'Provides smooth, titrated administration of sedative agents by credentialed anesthesia specialists.',
        descTa: 'மயக்கவியல் நிபுணரால் மருந்துகள் துல்லியமாக செலுத்தப்படும் நரம்பு வழி ஊசிப் பாதை.',
        positionPercent: { x: 35, y: 62 },
      },
      {
        labelEn: 'Continuous End-Tidal CO2 Capnography',
        labelTa: 'தொடர் மூச்சுக்காற்று கண்காணிப்பு (Capnography)',
        descEn: 'Real-time breath-by-breath ventilation monitoring to immediately detect respiratory depression.',
        descTa: 'ஒவ்வொரு மூச்சிலும் வெளியேறும் கார்பன் டை ஆக்சைடை அளந்து சுவாசத்தை உறுதிசெய்யும் அதிநவீன அமைப்பு.',
        positionPercent: { x: 50, y: 32 },
      },
      {
        labelEn: 'Continuous Multi-Lead ECG & Hemodynamic Bay',
        labelTa: 'தொடர் இதய மின் வரைபடம் (ECG) & ரத்த அழுத்த மானிட்டர்',
        descEn: 'Continuous cardiac rhythm and arterial pressure monitoring overseen by dedicated staff.',
        descTa: 'இதயத் துடிப்பின் சீரான இயக்கம் மற்றும் ரத்த அழுத்தத்தை இடைவிடாது கண்காணிக்கும் மருத்துவ அமைப்பு.',
        positionPercent: { x: 68, y: 45 },
      },
    ],
  },

  'recurrent-aphthous-ulcer-care': {
    titleEn: 'Recurrent Aphthous Stomatitis Anatomy',
    titleTa: 'தொடர் வாய் புண் உடற்கூறியல்',
    subtitleEn: 'Pseudomembranous Fibrin Slough, Erythematous Inflammatory Halo, and Mobile Mucosa',
    subtitleTa: 'மஞ்சள்-சாம்பல் புண் நடுப்பகுதி, சிவந்த அழற்சி வளையம் மற்றும் மென்மையான வாய் சவ்வு',
    interactive3DReady: false,
    callouts: [
      {
        labelEn: 'Necrotizing Central Fibrinous Slough',
        labelTa: 'புண்ணின் மத்திய பகுதி (Fibrinous Slough)',
        descEn: 'Shallow central crater covered with grayish-yellow fibrinous exudate exposing nerve endings.',
        descTa: 'நரம்பு முனைகள் வெளிப்பட்டு வலியை உண்டாக்கும் மஞ்சள்-சாம்பல் நிறத்திலான புண்ணின் மையப்பகுதி.',
        positionPercent: { x: 50, y: 42 },
      },
      {
        labelEn: 'Erythematous Peripheral Inflammatory Halo',
        labelTa: 'சுற்றியுள்ள சிவந்த அழற்சி வளையம் (Erythematous Halo)',
        descEn: 'Prominent hyperemic border reflecting acute localized cell-mediated immune activation.',
        descTa: 'திசுக்களின் நோய் எதிர்ப்பு அழற்சியைக் குறிக்கும் புண்ணைச் சுற்றியுள்ள அடர் சிவப்பு வளையம்.',
        positionPercent: { x: 36, y: 55 },
      },
      {
        labelEn: 'Protective Bioadhesive Barrier Coating Zone',
        labelTa: 'பாதுகாப்புப் பசை பூசப்படும் பரப்பு',
        descEn: 'Topical paste adheres to non-keratinized mucosa, shielding lesion from acidic foods and saliva.',
        descTa: 'கார உணவுகள் மற்றும் உமிழ்நீரால் வலி ஏற்படாமல் தடுக்க ஒட்டும் பாதுகாப்புப் பசை பூசப்படும் பகுதி.',
        positionPercent: { x: 65, y: 65 },
      },
    ],
  },
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
