// packages/common/src/index.ts
// DentalVis — Canonical Domain Types & Clinical Taxonomy (RFC 8785 Compatible)
// Architecture Baseline v1.9.1 — Phase 2.2 Canonical Procedures & Departments

export type ContentLanguage = 'en' | 'ta';

export type ContentStatus = 
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'ARCHIVED';

export type ApprovalDecision = 'APPROVED' | 'REJECTED';

export type GovernanceTier = 'TIER_1' | 'TIER_2' | 'TIER_3';

export interface ExploreCategory {
  id: string;
  slug: string;
  titleEn: string;
  titleTa: string;
  descriptionEn: string;
  descriptionTa: string;
  iconName: string;
  featuredProcedureSlugs: string[];
}

export interface DepartmentDto {
  id: string;
  code: string;
  slug: string;
  nameEn: string;
  nameTa: string;
  descriptionEn: string;
  descriptionTa: string;
}

export interface ProcedureSummary {
  id: string;
  slug: string;
  code: string;
  titleEn: string;
  titleTa: string;
  summaryEn: string;
  summaryTa: string;
  durationMinutes?: number;
  anesthesiaType?: string;
  primaryDepartmentName: string;
  primaryDepartmentCode?: string;
  exploreCategorySlugs: string[];
  governanceTier?: GovernanceTier;
  contentStatus: ContentStatus;
}

export interface ProcedureDetail extends ProcedureSummary {
  overviewHtmlEn: string;
  overviewHtmlTa: string;
  coverImage?: {
    url: string;
    altEn: string;
    altTa: string;
    caption?: string;
  };
  has3DModel: boolean;
  model3DId?: string;
  interactiveStepsCount: number;
}

// ----------------------------------------------------------------------
// IMMUTABLE REVISION SNAPSHOT SCHEMA (RFC 8785 TARGET)
// ----------------------------------------------------------------------

export interface ProcedureRevisionSnapshot {
  procedureId: string;
  language: ContentLanguage;
  revisionNumber: number;
  title: string;
  slug: string;
  summary: string;
  overviewHtml: string;
  sanitizerVersion: string;
  coverMedia?: {
    providerAssetId: string;
    contentHash: string;
    secureUrl: string;
  };
  model3DMedia?: {
    providerAssetId: string;
    contentHash: string;
    secureUrl: string;
  };
  interactiveSteps: Array<{
    stepNumber: number;
    titleEn: string;
    titleTa: string;
    instructionEn: string;
    instructionTa: string;
    cameraPosition?: [number, number, number];
    cameraTarget?: [number, number, number];
  }>;
  disclaimer: string;
}

// ----------------------------------------------------------------------
// TAXONOMY: 6 CANONICAL EXPLORE CATEGORIES (PATIENT-FACING)
// ----------------------------------------------------------------------

export const CANONICAL_EXPLORE_CATEGORIES: ExploreCategory[] = [
  {
    id: '11111111-1111-4111-a111-111111111101',
    slug: 'pain-and-sensitivity',
    titleEn: 'Pain & Sensitivity',
    titleTa: 'பல் வலி & கூச்சம்',
    descriptionEn: 'Understand sudden aches, hot or cold sensitivity, and deep tooth discomfort.',
    descriptionTa: 'திடீர் வலி, சூடான அல்லது குளிர்ந்த உணவுகளுக்கான கூச்சம் மற்றும் பல் வலியைப் புரிந்து கொள்ளுங்கள்.',
    iconName: 'AlertCircle',
    featuredProcedureSlugs: ['root-canal-treatment', 'composite-dental-fillings']
  },
  {
    id: '11111111-1111-4111-a111-111111111102',
    slug: 'broken-or-chipped-teeth',
    titleEn: 'Broken or Chipped Teeth',
    titleTa: 'உடைந்த அல்லது விரிசல் விழுந்த பற்கள்',
    descriptionEn: 'Explore how cracked enamel, fractures, and damaged tooth crowns are restored.',
    descriptionTa: 'பல் விரிசல்கள், உடைப்புகள் மற்றும் சேதமடைந்த பற்களை சீரமைக்கும் முறைகளை அறியுங்கள்.',
    iconName: 'ShieldAlert',
    featuredProcedureSlugs: ['dental-crowns', 'composite-dental-fillings']
  },
  {
    id: '11111111-1111-4111-a111-111111111103',
    slug: 'gums-and-bleeding',
    titleEn: 'Gums & Bleeding',
    titleTa: 'ஈறுகள் & இரத்தக் கசிவு',
    descriptionEn: 'Learn about tender gums, redness during brushing, and gentle periodontal care.',
    descriptionTa: 'ஈறு வீக்கம், பல் துலக்கும் போது ஏற்படும் இரத்தக் கசிவு மற்றும் ஈறு பராமரிப்பு முறைகள்.',
    iconName: 'HeartPulse',
    featuredProcedureSlugs: ['deep-cleaning-scaling', 'routine-dental-cleaning-polishing']
  },
  {
    id: '11111111-1111-4111-a111-111111111104',
    slug: 'missing-teeth',
    titleEn: 'Missing Teeth',
    titleTa: 'இழந்த பற்கள்',
    descriptionEn: 'Visual explanations of implants, fixed bridges, and modern tooth replacement options.',
    descriptionTa: 'பல் இம்ப்ளான்ட், பிரிட்ஜ் மற்றும் நவீன பல் மாற்று சிகிச்சைகள் பற்றிய விளக்கங்கள்.',
    iconName: 'Layers',
    featuredProcedureSlugs: ['single-dental-implant', 'routine-tooth-extraction']
  },
  {
    id: '11111111-1111-4111-a111-111111111105',
    slug: 'tooth-alignment',
    titleEn: 'Tooth Alignment',
    titleTa: 'பல் சீரமைப்பு',
    descriptionEn: 'Clear guides on clear aligners, orthodontic braces, and gentle bite correction.',
    descriptionTa: 'கிளியர் அலைனர்கள் மற்றும் கிளிப் சிகிச்சைகள் மூலம் பல் வரிசை சீரமைக்கும் முறைகள்.',
    iconName: 'Compass',
    featuredProcedureSlugs: ['fixed-orthodontic-braces', 'wisdom-tooth-extraction']
  },
  {
    id: '11111111-1111-4111-a111-111111111106',
    slug: 'dental-appearance',
    titleEn: 'Dental Appearance',
    titleTa: 'பல் அழகு & பராமரிப்பு',
    descriptionEn: 'Safe, doctor-guided insight into whitening, stain removal, and smile enhancement.',
    descriptionTa: 'பல் வெளுப்பாக்குதல், கறை நீக்குதல் மற்றும் புன்னகை மேம்பாட்டு சிகிச்சைகள்.',
    iconName: 'Sparkles',
    featuredProcedureSlugs: ['professional-teeth-whitening', 'routine-dental-cleaning-polishing']
  }
];

// ----------------------------------------------------------------------
// TAXONOMY: 15 APPROVED CLINICAL DEPARTMENTS (PHASE 2.2 EXPANSION)
// ----------------------------------------------------------------------

export const CANONICAL_DEPARTMENTS: DepartmentDto[] = [
  // 1. Preventive Dental Treatments (PREV)
  {
    id: '22222222-2222-4222-a222-222222222205',
    code: 'PREV',
    slug: 'preventive-dentistry',
    nameEn: 'Preventive Dental Treatments',
    nameTa: 'தடுப்பு பல் மருத்துவ சிகிச்சை பிரிவு (Preventive)',
    descriptionEn: 'Specialized in dental disease prevention, routine cleanings, fluorides, and sealants.',
    descriptionTa: 'பல் நோய்களைத் தடுக்கும் முறைகள், வழக்கமான பல் சுத்தம் மற்றும் பராமரிப்புக்கான பிரிவு.'
  },
  // 2. Restorative Dentistry (REST)
  {
    id: '22222222-2222-4222-a222-222222222206',
    code: 'REST',
    slug: 'restorative-dentistry',
    nameEn: 'Restorative Dentistry',
    nameTa: 'பல் மறுசீரமைப்பு சிகிச்சை பிரிவு (Restorative)',
    descriptionEn: 'Specialized in direct tooth restorations, composite fillings, and bonding.',
    descriptionTa: 'சொத்தை பற்கள் மற்றும் சிதைந்த பற்களை அடைத்து சரிசெய்யும் பிரிவு.'
  },
  // 3. Endodontics – Root Canal Treatments (ENDO - Existing Canonical)
  {
    id: '22222222-2222-4222-a222-222222222201',
    code: 'ENDO',
    slug: 'endodontics',
    nameEn: 'Endodontics – Root Canal Treatments',
    nameTa: 'வேர் கால்வாய் சிகிச்சை பிரிவு (Endodontics)',
    descriptionEn: 'Specialized in dental pulp biology, root canal therapy, and retreatment.',
    descriptionTa: 'பல் நரம்பு மற்றும் வேர் கால்வாய் சிகிச்சை சார்ந்த பிரத்யேகத் துறை.'
  },
  // 4. Periodontics – Gum Treatments & Surgeries (PERIO - Existing Canonical)
  {
    id: '22222222-2222-4222-a222-222222222203',
    code: 'PERIO',
    slug: 'periodontics',
    nameEn: 'Periodontics – Gum Treatments & Surgeries',
    nameTa: 'ஈறு நோய் சிகிச்சை பிரிவு (Periodontics)',
    descriptionEn: 'Specialized in periodontal tissue health, deep scaling, and gum grafting.',
    descriptionTa: 'ஈறு ஆரோக்கியம், காரை நீக்கம் மற்றும் ஈறு தொற்றுகளைக் குணப்படுத்தும் துறை.'
  },
  // 5. Oral & Maxillofacial Surgery (OMFS - New Independent Department)
  {
    id: '22222222-2222-4222-a222-222222222207',
    code: 'OMFS',
    slug: 'oral-maxillofacial-surgery',
    nameEn: 'Oral & Maxillofacial Surgery',
    nameTa: 'வாய் மற்றும் தாடை அறுவை சிகிச்சை பிரிவு (Oral Surgery)',
    descriptionEn: 'Specialized in surgical extractions, wisdom teeth removal, and bone grafting.',
    descriptionTa: 'பல் பிரித்தெடுத்தல், ஞானப்பல் அறுவை சிகிச்சை மற்றும் தாடை அறுவை சிகிச்சைகள்.'
  },
  // 6. Dental Implantology (IMPL - Option A In-Place Narrowing of Existing Record)
  {
    id: '22222222-2222-4222-a222-222222222204',
    code: 'IMPL',
    slug: 'dental-implantology',
    nameEn: 'Dental Implantology',
    nameTa: 'பல் இம்ப்ளான்ட் சிகிச்சை பிரிவு (Implantology)',
    descriptionEn: 'Specialized in biocompatible titanium dental implants and full-arch restorations.',
    descriptionTa: 'தாடை எலும்பில் பொருத்தப்படும் நிலையான நவீன செயற்கைப் பல் இம்ப்ளான்ட் பிரிவு.'
  },
  // 7. Prosthodontics – Crowns, Bridges & Dentures (PROS - Existing Canonical)
  {
    id: '22222222-2222-4222-a222-222222222202',
    code: 'PROS',
    slug: 'prosthodontics',
    nameEn: 'Prosthodontics – Crowns, Bridges & Dentures',
    nameTa: 'செயற்கைப் பல் சீரமைப்பு பிரிவு (Prosthodontics)',
    descriptionEn: 'Specialized in restoring damaged and missing teeth with crowns, bridges, and dentures.',
    descriptionTa: 'கிரவுன், பிரிட்ஜ் மற்றும் செயற்கைப் பற்கள் மூலம் பல்லை சீரமைக்கும் பிரிவு.'
  },
  // 8. Orthodontics – Braces & Teeth Alignment (ORTH)
  {
    id: '22222222-2222-4222-a222-222222222208',
    code: 'ORTH',
    slug: 'orthodontics',
    nameEn: 'Orthodontics – Braces & Teeth Alignment',
    nameTa: 'பல் வரிசை சீரமைப்பு பிரிவு (Orthodontics)',
    descriptionEn: 'Specialized in fixed metal/ceramic braces, clear aligners, and bite correction.',
    descriptionTa: 'பல் கிளிப் மற்றும் கிளியர் அலைனர்கள் மூலம் பல் வரிசையை சீரமைக்கும் துறை.'
  },
  // 9. Pediatric Dentistry – Children\'s Dental Care (PEDO)
  {
    id: '22222222-2222-4222-a222-222222222209',
    code: 'PEDO',
    slug: 'pediatric-dentistry',
    nameEn: "Pediatric Dentistry – Children's Dental Care",
    nameTa: 'குழந்தைகள் பல் மருத்துவ பிரிவு (Pediatric)',
    descriptionEn: 'Specialized in primary teeth care, pulpotomies, space maintainers, and gentle pediatric care.',
    descriptionTa: 'குழந்தைகளுக்கான பால் பற்கள் பராமரிப்பு மற்றும் பிரத்யேக பல் சிகிச்சைகள்.'
  },
  // 10. Cosmetic Dentistry – Smile Enhancement (COSM)
  {
    id: '22222222-2222-4222-a222-222222222210',
    code: 'COSM',
    slug: 'cosmetic-dentistry',
    nameEn: 'Cosmetic Dentistry – Smile Enhancement',
    nameTa: 'புன்னகை அழகு பல் மருத்துவ பிரிவு (Cosmetic)',
    descriptionEn: 'Specialized in aesthetic smile design, professional whitening, and veneers.',
    descriptionTa: 'பல் வெளுப்பாக்குதல், பீங்கான் லேமினேட் மற்றும் புன்னகை அழகு சிகிச்சைகள்.'
  },
  // 11. Dental Trauma & Emergency Treatments (EMRG)
  {
    id: '22222222-2222-4222-a222-222222222211',
    code: 'EMRG',
    slug: 'dental-trauma-emergency',
    nameEn: 'Dental Trauma & Emergency Treatments',
    nameTa: 'அவசர பல் சிகிச்சை & காயம் மேலாண்மை பிரிவு (Emergency)',
    descriptionEn: 'Specialized in urgent management of tooth avulsion, fractures, severe infections, and acute pain.',
    descriptionTa: 'அடிபட்ட பற்கள், உடைந்த பற்கள் மற்றும் தீவிர பல் அவசர சிகிச்சைக்கான துறை.'
  },
  // 12. Sedation & Dental Anesthesia (SEDA)
  {
    id: '22222222-2222-4222-a222-222222222212',
    code: 'SEDA',
    slug: 'sedation-anesthesia',
    nameEn: 'Sedation & Dental Anesthesia',
    nameTa: 'மயக்க மருந்து & நோயாளி வசதி பிரிவு (Sedation)',
    descriptionEn: 'Specialized in nitrous oxide inhalation, oral sedation, and IV conscious sedation.',
    descriptionTa: 'பயமின்றி சிகிச்சை பெற உதவும் சிரிப்பு வாயு மற்றும் பிரத்யேக மயக்க மருந்து முறைகள்.'
  },
  // 13. Oral Medicine – Therapeutic Treatments (ORAL)
  {
    id: '22222222-2222-4222-a222-222222222213',
    code: 'ORAL',
    slug: 'oral-medicine',
    nameEn: 'Oral Medicine – Therapeutic Treatments',
    nameTa: 'வாய்வழி மருத்துவ சிகிச்சை பிரிவு (Oral Medicine)',
    descriptionEn: 'Specialized in non-surgical oral mucosal lesions, ulcers, dry mouth, and biopsies.',
    descriptionTa: 'வாய் புண்கள், வாய் வறட்சி மற்றும் வாய் மென்திசு நோய்களுக்கான மருத்துவ பிரிவு.'
  },
  // 14. TMJ & Orofacial Pain Treatments (TMJD)
  {
    id: '22222222-2222-4222-a222-222222222214',
    code: 'TMJD',
    slug: 'tmj-orofacial-pain',
    nameEn: 'TMJ & Orofacial Pain Treatments',
    nameTa: 'தாடை மூட்டு வலி & முக வலி சிகிச்சை பிரிவு (TMJ)',
    descriptionEn: 'Specialized in temporomandibular joint disorders, bruxism splints, and muscle pain relief.',
    descriptionTa: 'தாடை மூட்டு வலி, பல் கடிக்கும் பழக்கம் மற்றும் தசை வலி மேலாண்மைக்கான துறை.'
  },
  // 15. Sleep & Airway Dental Treatments (SLPA)
  {
    id: '22222222-2222-4222-a222-222222222215',
    code: 'SLPA',
    slug: 'sleep-airway-dentistry',
    nameEn: 'Sleep & Airway Dental Treatments',
    nameTa: 'தூக்க சுவாசம் & குறட்டை தடுப்பு பிரிவு (Sleep Dentistry)',
    descriptionEn: 'Specialized in mandibular advancement devices for mild-to-moderate sleep apnea and snoring.',
    descriptionTa: 'தூக்கத்தில் மூச்சுத்திணறல் மற்றும் குறட்டையைக் கட்டுப்படுத்தும் சிறப்பு வாய் உபகரணங்கள்.'
  }
];

// ----------------------------------------------------------------------
// CANONICAL PROCEDURES: 20 PROCEDURES (4 EXISTING + 6 BATCH 1 + 10 BATCH 2 NEW)
// ----------------------------------------------------------------------

export const CANONICAL_PROCEDURES: ProcedureDetail[] = [
  // --------------------------------------------------------------------
  // 1. EXISTING CANONICAL: Root Canal Treatment (ENDO)
  // --------------------------------------------------------------------
  {
    id: '33333333-3333-4333-a333-333333333301',
    slug: 'root-canal-treatment',
    code: 'ENDO-RCT-01',
    titleEn: 'Root Canal Treatment',
    titleTa: 'வேர் கால்வாய் சிகிச்சை (Root Canal)',
    summaryEn: 'A gentle procedure to clear infected pulp from inside the tooth and seal it safely to relieve pain and preserve your natural tooth.',
    summaryTa: 'பல்லின் உள் பகுதியில் ஏற்பட்ட தொற்றை அகற்றி, இயற்கை பல்லை பாதுகாக்கும் மென்மையான சிகிச்சை.',
    durationMinutes: 60,
    anesthesiaType: 'Local Anesthesia',
    primaryDepartmentName: 'Endodontics – Root Canal Treatments',
    primaryDepartmentCode: 'ENDO',
    exploreCategorySlugs: ['pain-and-sensitivity'],
    governanceTier: 'TIER_2',
    contentStatus: 'PUBLISHED',
    overviewHtmlEn: '<p>Root canal treatment is designed to relieve tooth pain and save your natural tooth. During the procedure, the dentist gently cleans the inflamed pulp inside the root canals, disinfects the inner chamber, and fills it with a biocompatible material.</p>',
    overviewHtmlTa: '<p>வேர் கால்வாய் சிகிச்சை என்பது பல் வலியைப் போக்கி உங்கள் இயற்கை பல்லை பாதுகாப்பதற்காக செய்யப்படும் ஒரு சிகிச்சையாகும்.</p>',
    has3DModel: true,
    model3DId: 'model-molar-cross-section',
    interactiveStepsCount: 4
  },

  // --------------------------------------------------------------------
  // 2. EXISTING CANONICAL: Dental Crowns (PROS)
  // --------------------------------------------------------------------
  {
    id: '33333333-3333-4333-a333-333333333302',
    slug: 'dental-crowns',
    code: 'PROS-CRW-01',
    titleEn: 'Dental Crowns',
    titleTa: 'பல் தொப்பி (Dental Crown)',
    summaryEn: 'A custom-fitted cap placed over a damaged or treated tooth to restore its natural strength, chewing function, and lifelike appearance.',
    summaryTa: 'சேதமடைந்த பல்லை பலப்படுத்தவும் அதன் இயல்பான தோற்றத்தை மீட்டெடுக்கவும் பொருத்தப்படும் உறை.',
    durationMinutes: 45,
    anesthesiaType: 'Local Anesthesia',
    primaryDepartmentName: 'Prosthodontics – Crowns, Bridges & Dentures',
    primaryDepartmentCode: 'PROS',
    exploreCategorySlugs: ['broken-or-chipped-teeth'],
    governanceTier: 'TIER_2',
    contentStatus: 'PUBLISHED',
    overviewHtmlEn: '<p>A dental crown is a tooth-shaped "cap" that is placed over a prepared tooth to restore its size, shape, strength, and improve its appearance.</p>',
    overviewHtmlTa: '<p>பல் தொப்பி என்பது சேதமடைந்த அல்லது பலவீனமான பல்லின் மீது பொருத்தப்பட்டு அதன் வலிமையையும் வடிவத்தையும் மீட்டெடுக்கிறது.</p>',
    has3DModel: true,
    model3DId: 'model-dental-crown',
    interactiveStepsCount: 3
  },

  // --------------------------------------------------------------------
  // 3. EXISTING CANONICAL: Deep Cleaning & Scaling (PERIO)
  // --------------------------------------------------------------------
  {
    id: '33333333-3333-4333-a333-333333333303',
    slug: 'deep-cleaning-scaling',
    code: 'PERIO-SCL-01',
    titleEn: 'Deep Cleaning & Scaling',
    titleTa: 'ஆழமான பல் மற்றும் ஈறு தூய்மைப்படுத்தல்',
    summaryEn: 'Careful removal of hardened tartar beneath the gumline to soothe inflamed gums and stop the progression of gum disease.',
    summaryTa: 'ஈறுகளுக்கு அடியில் படிந்துள்ள கடினமான காரையை அகற்றி, ஈறு ஆரோக்கியத்தை மீட்டெடுக்கும் சிகிச்சை.',
    durationMinutes: 45,
    anesthesiaType: 'Topical or Local Numbing',
    primaryDepartmentName: 'Periodontics – Gum Treatments & Surgeries',
    primaryDepartmentCode: 'PERIO',
    exploreCategorySlugs: ['gums-and-bleeding'],
    governanceTier: 'TIER_2',
    contentStatus: 'PUBLISHED',
    overviewHtmlEn: '<p>Dental scaling and root planing clean deep below the gum line to remove plaque and tartar deposits that regular brushing cannot reach.</p>',
    overviewHtmlTa: '<p>வழக்கமான பிரஷிங் மூலம் நீக்க முடியாத காரையை ஈறுகளின் அடியில் இருந்து ஆழமாக சுத்தம் செய்யும் மருத்துவ முறை.</p>',
    has3DModel: false,
    interactiveStepsCount: 3
  },

  // --------------------------------------------------------------------
  // 4. EXISTING CANONICAL: Single Dental Implant (IMPL)
  // --------------------------------------------------------------------
  {
    id: '33333333-3333-4333-a333-333333333304',
    slug: 'single-dental-implant',
    code: 'IMPL-SNGL-01',
    titleEn: 'Single Dental Implant',
    titleTa: 'தனிப்பல் இம்ப்ளான்ட் (Dental Implant)',
    summaryEn: 'A durable titanium root placed securely into the jawbone, topped with a lifelike ceramic crown to permanently replace a lost tooth.',
    summaryTa: 'இழந்த பல்லுக்குப் பதிலாக தாடை எலும்பில் பொருத்தப்படும் நிலையான நவீன செயற்கைப் பல்.',
    durationMinutes: 75,
    anesthesiaType: 'Local Anesthesia with Sedation Options',
    primaryDepartmentName: 'Dental Implantology',
    primaryDepartmentCode: 'IMPL',
    exploreCategorySlugs: ['missing-teeth'],
    governanceTier: 'TIER_2',
    contentStatus: 'PUBLISHED',
    overviewHtmlEn: '<p>A dental implant provides a permanent replacement for a missing tooth, behaving just like a natural tooth root.</p>',
    overviewHtmlTa: '<p>பல் இம்ப்ளான்ட் என்பது இழந்த பல்லின் வேரைப் போலவே தாடை எலும்பில் பொருத்தப்படும் ஒரு நிலையான தீர்வாகும்.</p>',
    has3DModel: true,
    model3DId: 'model-dental-implant',
    interactiveStepsCount: 5
  },

  // --------------------------------------------------------------------
  // 5. BATCH 1 NEW: Composite Dental Fillings (REST) - Tier 2
  // --------------------------------------------------------------------
  {
    id: '33333333-3333-4333-a333-333333333305',
    slug: 'composite-dental-fillings',
    code: 'REST-FIL-01',
    titleEn: 'Composite Dental Fillings',
    titleTa: 'பல் நிற காம்போசிட் அடைப்பு (Dental Fillings)',
    summaryEn: 'Tooth-colored biocompatible resin placed in gentle layers to repair decayed enamel and restore natural chewing function.',
    summaryTa: 'பல் சொத்தையை நீக்கி, பல்லின் இயற்கை நிறத்திலேயே அடைத்து பலப்படுத்தும் நவீன சிகிச்சை.',
    durationMinutes: 30,
    anesthesiaType: 'Localized Numbing as Needed',
    primaryDepartmentName: 'Restorative Dentistry',
    primaryDepartmentCode: 'REST',
    exploreCategorySlugs: ['pain-and-sensitivity', 'broken-or-chipped-teeth'],
    governanceTier: 'TIER_2',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>Composite dental fillings bond directly to the remaining natural tooth structure using a specialized adhesive and curing blue light. This allows conservative removal of diseased enamel while restoring strength and invisible aesthetic appeal.</p>',
    overviewHtmlTa: '<p>காம்போசிட் அடைப்பு என்பது பல்லின் இயற்கையான நிறத்துடனேயே ஒன்றிணைந்து பல்லின் உறுதியை மீட்டெடுக்கும் ஒரு நவீன முறையாகும். சொத்தை அகற்றப்பட்ட பிறகு நீல நிற ஒளிக் கதிர் மூலம் இந்த கலவை பல்லோடு கெட்டியாக இணைக்கப்படுகிறது.</p>',
    has3DModel: false,
    interactiveStepsCount: 4
  },

  // --------------------------------------------------------------------
  // 6. BATCH 1 NEW: Routine Dental Cleaning & Polishing (PREV) - Tier 1
  // --------------------------------------------------------------------
  {
    id: '33333333-3333-4333-a333-333333333306',
    slug: 'routine-dental-cleaning-polishing',
    code: 'PREV-CLN-01',
    titleEn: 'Routine Dental Cleaning & Polishing',
    titleTa: 'வழக்கமான பல் சுத்தம் மற்றும் மெருகூட்டல் (Prophylaxis)',
    summaryEn: 'Gentle supragingival cleaning and polishing to eliminate everyday plaque, food stains, and early tartar for healthy gums.',
    summaryTa: 'பற்களின் மேற்பரப்பில் உள்ள அழுக்கு, கறை மற்றும் படிவுகளை அகற்றி ஈறுகளை ஆரோக்கியமாக வைக்கும் எளிய சிகிச்சை.',
    durationMinutes: 35,
    anesthesiaType: 'Non-Invasive / Topical Polish',
    primaryDepartmentName: 'Preventive Dental Treatments',
    primaryDepartmentCode: 'PREV',
    exploreCategorySlugs: ['gums-and-bleeding', 'dental-appearance'],
    governanceTier: 'TIER_1',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>Routine dental cleaning (dental prophylaxis) removes soft bacterial plaque, light surface stains, and calculus from above the gumline. A smooth, mint-flavored polishing paste leaves teeth feeling glass-smooth and refreshed.</p>',
    overviewHtmlTa: '<p>வழக்கமான பல் சுத்தம் என்பது பிரஷிங் மூலம் நீக்க முடியாத லேசான கறைகள் மற்றும் பற்களின் மேற்பரப்பு படிவுகளை அகற்றி ஈறுகளில் வீக்கம் ஏற்படுவதைத் தடுக்கும் மிக முக்கியமான தடுப்பு சிகிச்சையாகும்.</p>',
    has3DModel: false,
    interactiveStepsCount: 3
  },

  // --------------------------------------------------------------------
  // 7. BATCH 1 NEW: Routine Tooth Extraction (OMFS) - Tier 2
  // --------------------------------------------------------------------
  {
    id: '33333333-3333-4333-a333-333333333307',
    slug: 'routine-tooth-extraction',
    code: 'OMFS-EXT-01',
    titleEn: 'Routine Tooth Extraction',
    titleTa: 'வழக்கமான பல் எடுத்தல் (Tooth Extraction)',
    summaryEn: 'Safe, pain-free removal of an unrestorable or severely fractured tooth under comfortable local anesthesia to protect adjacent oral health.',
    summaryTa: 'மீட்டெடுக்க முடியாத அளவு சேதமடைந்த அல்லது உடைந்த பல்லை வலியின்றி பாதுகாப்பாக அகற்றும் சிகிச்சை.',
    durationMinutes: 40,
    anesthesiaType: 'Profound Local Anesthesia',
    primaryDepartmentName: 'Oral & Maxillofacial Surgery',
    primaryDepartmentCode: 'OMFS',
    exploreCategorySlugs: ['missing-teeth'],
    governanceTier: 'TIER_2',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>When a tooth cannot be saved through root canal therapy or coronal restoration, gentle extraction prevents spreading bone infection. Modern dental elevators gently loosen the tooth within its socket with comfortable pressure and zero sharp pain.</p>',
    overviewHtmlTa: '<p>வேர் கால்வாய் சிகிச்சையாலோ அல்லது தொப்பியாலோ காப்பாற்ற முடியாத அளவிற்கு சேதமடைந்த பற்களை சுற்றியுள்ள எலும்புக்கு சேதம் ஏற்படாமல் மென்மையாக அகற்றும் மருத்துவ முறை இதுவாகும்.</p>',
    has3DModel: false,
    interactiveStepsCount: 4
  },

  // --------------------------------------------------------------------
  // 8. BATCH 1 NEW: Surgical Wisdom Tooth Extraction (OMFS) - Tier 2
  // --------------------------------------------------------------------
  {
    id: '33333333-3333-4333-a333-333333333308',
    slug: 'wisdom-tooth-extraction',
    code: 'OMFS-WIS-01',
    titleEn: 'Surgical Wisdom Tooth Extraction',
    titleTa: 'ஞானப்பல் அறுவை சிகிச்சை (Wisdom Tooth Surgery)',
    summaryEn: 'Careful surgical removal of impacted third molars trapped under the gums or bone to relieve jaw pain and protect neighboring teeth.',
    summaryTa: 'தாடை எலும்புக்குள் சிக்கியுள்ள அல்லது தவறான திசையில் முளைக்கும் ஞானப்பல்லை பாதுகாப்பாக அகற்றும் அறுவை சிகிச்சை.',
    durationMinutes: 50,
    anesthesiaType: 'Profound Local Numbing with Sedation Options',
    primaryDepartmentName: 'Oral & Maxillofacial Surgery',
    primaryDepartmentCode: 'OMFS',
    exploreCategorySlugs: ['tooth-alignment'],
    governanceTier: 'TIER_2',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>Impacted wisdom teeth often lack sufficient arch room to erupt vertically, exerting pressure on neighboring second molars or triggering recurrent pericoronitis infections. A micro-incision allows direct visualization and gentle sectioned removal.</p>',
    overviewHtmlTa: '<p>தாடையில் போதிய இடம் இல்லாததால் சாய்வாக முளைத்து அருகிலுள்ள பற்களை அழுத்தும் ஞானப்பற்களை சிறிய அறுவை சிகிச்சை மூலம் துல்லியமாகப் பிரித்து அகற்றும் சிகிச்சை முறை இதுவாகும்.</p>',
    has3DModel: false,
    interactiveStepsCount: 4
  },

  // --------------------------------------------------------------------
  // 9. BATCH 1 NEW: Fixed Metal & Ceramic Braces (ORTH) - Tier 2
  // --------------------------------------------------------------------
  {
    id: '33333333-3333-4333-a333-333333333309',
    slug: 'fixed-orthodontic-braces',
    code: 'ORTH-BRC-01',
    titleEn: 'Fixed Metal & Ceramic Braces',
    titleTa: 'பல் கிளிப் சிகிச்சை (Fixed Braces)',
    summaryEn: 'Precision brackets and gentle archwires that guide crowded, crooked, or spaced teeth into healthy, harmonious alignment.',
    summaryTa: 'வரிசை மாறிய அல்லது இடைவெளி உள்ள பற்களை சீரான வரிசைக்கு கொண்டு வரும் நவீன கிளிப் சிகிச்சை.',
    durationMinutes: 60,
    anesthesiaType: 'Non-Invasive / Painless Placement',
    primaryDepartmentName: 'Orthodontics – Braces & Teeth Alignment',
    primaryDepartmentCode: 'ORTH',
    exploreCategorySlugs: ['tooth-alignment'],
    governanceTier: 'TIER_2',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>Fixed orthodontic brackets bonded securely to the tooth surfaces connect via high-tech nickel-titanium shape-memory archwires. Over time, gentle biological forces encourage alveolar bone remodeling, guiding teeth smoothly into ideal alignment.</p>',
    overviewHtmlTa: '<p>பற்களின் மீது பொருத்தப்படும் பிராக்கெட்டுகள் மற்றும் மெல்லிய கம்பிகள் மூலம் மென்மையான தொடர் அழுத்தம் செலுத்தப்பட்டு, பற்கள் எலும்புக்குள் மெதுவாக நகர்ந்து சரியான வரிசைக்கு கொண்டு வரப்படுகின்றன.</p>',
    has3DModel: false,
    interactiveStepsCount: 4
  },

  // --------------------------------------------------------------------
  // 10. BATCH 1 NEW: Professional Teeth Whitening (COSM) - Tier 1
  // --------------------------------------------------------------------
  {
    id: '33333333-3333-4333-a333-333333333310',
    slug: 'professional-teeth-whitening',
    code: 'COSM-WHT-01',
    titleEn: 'Professional Teeth Whitening',
    titleTa: 'பல் வெளுப்பாக்குதல் (Professional Teeth Whitening)',
    summaryEn: 'Clinician-supervised active oxygen gel treatment that gently dissolves deep intrinsic enamel stains without stripping natural tooth minerals.',
    summaryTa: 'பற்களின் எனாமலுக்கு பாதிப்பின்றி உட்புறக் கறைகளை நீக்கி பற்களை வெண்மையாக்கும் நவீன சிகிச்சை.',
    durationMinutes: 45,
    anesthesiaType: 'Gingival Barrier Protection / Non-Invasive',
    primaryDepartmentName: 'Cosmetic Dentistry – Smile Enhancement',
    primaryDepartmentCode: 'COSM',
    exploreCategorySlugs: ['dental-appearance'],
    governanceTier: 'TIER_1',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>Professional teeth whitening uses hydrogen or carbamide peroxide formulations buffered to neutral pH. Guided oxygen molecules penetrate microscopic enamel prisms to break apart chromophore stain bonds from tea, coffee, or aging while gingival gums remain shielded.</p>',
    overviewHtmlTa: '<p>மருத்துவ மேற்பார்வையில் ஈறுகளை பாதுகாப்பான ஜெல் கொண்டு மூடிவிட்டு, பற்களின் எனாமல் அடுக்கில் உள்ள ஆழ்ந்த கறைகளை ஆக்ஸிஜன் மூலக்கூறுகள் மூலம் நீக்கும் பாதுகாப்பான அழகு சிகிச்சை இதுவாகும்.</p>',
    has3DModel: false,
    interactiveStepsCount: 3
  },

  // --------------------------------------------------------------------
  // 11. BATCH 2 NEW: Dental Sealants (PREV) - Tier 1
  // --------------------------------------------------------------------
  {
    id: '33333333-3333-4333-a333-333333333311',
    slug: 'dental-sealants',
    code: 'PREV-SLT-01',
    titleEn: 'Dental Sealants',
    titleTa: 'பல் சீலண்ட் பாதுகாப்பு பூச்சு (Dental Sealants)',
    summaryEn: 'A clear or tooth-colored protective resin shield painted onto the deep grooves of molars to seal out cavity-causing bacteria and food particles.',
    summaryTa: 'பற்களின் ஆழமான இடுக்குகளில் உணவு மற்றும் கிருமிகள் தங்கி சொத்தை உண்டாகாமல் தடுக்கும் மெல்லிய பாதுகாப்பு பூச்சு.',
    durationMinutes: 25,
    anesthesiaType: 'Non-Invasive / Completely Painless',
    primaryDepartmentName: 'Preventive Dental Treatments',
    primaryDepartmentCode: 'PREV',
    exploreCategorySlugs: ["pain-and-sensitivity"],
    governanceTier: 'TIER_1',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>Dental sealants are thin, biocompatible protective coatings applied to the chewing surfaces of permanent back teeth (molars and premolars). These teeth naturally feature deep pits and fissures that toothbrush bristles cannot effectively clean. By flowing into and sealing these microscopic grooves, sealants form a physical barrier against acid, plaque bacteria, and food accumulation.</p>',
    overviewHtmlTa: '<p>பல் சீலண்ட் என்பது பின்புற மெல்லும் பற்களின் ஆழமான வரிப்பள்ளங்களில் பூசப்படும் மெல்லிய பாதுகாப்பு பூச்சாகும். இந்த பள்ளங்களில் பல்துலக்கும் பிரஷின் முடிகள் சென்று அடைய முடியாததால் எளிதில் சொத்தை உருவாகிறது. சீலண்ட் பூச்சு இந்த இடுக்குகளை மூடி பாக்டீரியா அமிலங்களால் பல் சொத்தை ஏற்படுவதை தடுக்கிறது.</p>',
    has3DModel: false,
    interactiveStepsCount: 3
  },

  // --------------------------------------------------------------------
  // 12. BATCH 2 NEW: Topical Fluoride Treatment (PREV) - Tier 1
  // --------------------------------------------------------------------
  {
    id: '33333333-3333-4333-a333-333333333312',
    slug: 'topical-fluoride-treatment',
    code: 'PREV-FLU-01',
    titleEn: 'Topical Fluoride Treatment',
    titleTa: 'மேற்பரப்பு ஃப்ளூரைடு சிகிச்சை (Topical Fluoride)',
    summaryEn: 'Professional application of 5% sodium fluoride (NaF) varnish (equivalent to 2.26% fluoride ion) to tooth surfaces to accelerate remineralization and enhance acid resistance.',
    summaryTa: 'பற்களின் எனாமல் அடுக்கை பலப்படுத்த 5% சோடியம் ஃப்ளூரைடு வார்னிஷ் (2.26% ஃப்ளூரைடு அயனிக்கு சமமானது) பூசப்படும் தொழில்முறை பாதுகாப்பு சிகிச்சை.',
    durationMinutes: 20,
    anesthesiaType: 'Non-Invasive / Topical Application',
    primaryDepartmentName: 'Preventive Dental Treatments',
    primaryDepartmentCode: 'PREV',
    exploreCategorySlugs: ["pain-and-sensitivity"],
    governanceTier: 'TIER_1',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>Professional topical fluoride therapy delivers concentrated fluoride ions directly to tooth enamel, most commonly formulated as a 5% sodium fluoride (NaF) varnish (which delivers an equivalent concentration of 2.26% fluoride ion, or 22,600 ppm F⁻). When applied in the dental office, the fluoride reacts with hydroxyapatite crystals in the enamel to form fluorapatite, a mineral structure significantly more resistant to demineralization by bacterial acids and everyday acidic dietary challenges.</p>',
    overviewHtmlTa: '<p>தொழில்முறை ஃப்ளூரைடு சிகிச்சை என்பது பல்லின் எனாமல் மீது நேரடியாக செறிவூட்டப்பட்ட ஃப்ளூரைடு அயனிகளை சேர்க்கும் மருத்துவ முறையாகும். இது பொதுவாக 5% சோடியம் ஃப்ளூரைடு (NaF) வார்னிஷ் வடிவில் பூசப்படுகிறது (இது 2.26% ஃப்ளூரைடு அயனி செறிவுக்கு சமமானது). இது எனாமலின் ஹைட்ராக்ஸிஅபடைட் படிகங்களுடன் இணைந்து அமில அரிப்புகளுக்கு எதிராக அதிக எதிர்ப்புத்திறன் கொண்ட ஃப்ளூராபடைட்டாக மாற்றுகிறது.</p>',
    has3DModel: false,
    interactiveStepsCount: 3
  },

  // --------------------------------------------------------------------
  // 13. BATCH 2 NEW: Custom Night Guard for Bruxism (PREV) - Tier 1
  // --------------------------------------------------------------------
  {
    id: '33333333-3333-4333-a333-333333333313',
    slug: 'custom-night-guard-bruxism',
    code: 'PREV-BRX-01',
    titleEn: 'Custom Night Guard for Bruxism',
    titleTa: 'இரவு நேர பல் பாதுகாப்பு அட்டை (Night Guard)',
    summaryEn: 'Precision-molded transparent dental orthotic worn during sleep to cushion chewing forces, prevent enamel attrition, and relieve jaw muscle strain.',
    summaryTa: 'தூக்கத்தில் பல் கடிக்கும் பழக்கத்தால் ஏற்படும் எனாமல் தேய்மானம் மற்றும் தாடை வலியைத் தடுக்கும் பிரத்யேக கண்ணாடி போன்ற பாதுகாப்பு அட்டை.',
    durationMinutes: 30,
    anesthesiaType: 'Non-Invasive / Impression Based',
    primaryDepartmentName: 'Preventive Dental Treatments',
    primaryDepartmentCode: 'PREV',
    exploreCategorySlugs: ["broken-or-chipped-teeth","pain-and-sensitivity"],
    governanceTier: 'TIER_1',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>A custom night guard (occlusal splint) is an individually fabricated dental appliance designed to absorb and redistribute excessive clenching and grinding forces during nocturnal bruxism. Engineered from medical-grade dual-laminate or hard acrylic, it prevents severe tooth wear, chipped margins, and temporomandibular joint (TMJ) strain.</p>',
    overviewHtmlTa: '<p>இரவு நேர பல் பாதுகாப்பு அட்டை என்பது தூக்கத்தில் அறியாமல் பல் கடிப்பவர்களுக்கு பற்களின் தேய்மானத்தை தடுத்து தாடை மூட்டுகளுக்கு ஓய்வளிக்க பிரத்யேகமாக வடிவமைக்கப்படும் மருத்துவ சாதனமாகும்.</p>',
    has3DModel: false,
    interactiveStepsCount: 3
  },

  // --------------------------------------------------------------------
  // 14. BATCH 2 NEW: Custom Sports Mouthguard (PREV) - Tier 1
  // --------------------------------------------------------------------
  {
    id: '33333333-3333-4333-a333-333333333314',
    slug: 'sports-mouthguard-trauma-prevention',
    code: 'PREV-SPT-01',
    titleEn: 'Custom Sports Mouthguard',
    titleTa: 'விளையாட்டு வீரர்களுக்கான பல் பாதுகாப்பு கவசம் (Sports Mouthguard)',
    summaryEn: 'Multi-laminated athletic oral shield custom-fitted to cushion blunt impact, protect teeth from fractures and avulsions, and safeguard lips and tongue.',
    summaryTa: 'விளையாட்டுகளின் போது அடிபடுவதால் பற்கள் உடைவதையோ அல்லது விழுவதையோ தடுக்கும் தனிப்பயன் பாதுகாப்பு கவசம்.',
    durationMinutes: 30,
    anesthesiaType: 'Non-Invasive / Comfortable Impression',
    primaryDepartmentName: 'Preventive Dental Treatments',
    primaryDepartmentCode: 'PREV',
    exploreCategorySlugs: ["broken-or-chipped-teeth"],
    governanceTier: 'TIER_1',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>A custom-fabricated athletic mouthguard provides superior shock absorption compared to over-the-counter boil-and-bite alternatives. Built from vacuum-formed layers of ethyl vinyl acetate (EVA), it provides uniform thickness over vulnerable anterior teeth while maintaining clear airways and natural speech during sports.</p>',
    overviewHtmlTa: '<p>விளையாட்டு வீரர்களுக்கான பிரத்யேக மௌத்கார்ட் என்பது விளையாடும் போது முகத்தில் ஏற்படும் தாக்கங்களை உறிஞ்சி பற்கள் உடைவதைத் தடுக்கும் மிக முக்கியமான பாதுகாப்பு உபகரணமாகும்.</p>',
    has3DModel: false,
    interactiveStepsCount: 3
  },

  // --------------------------------------------------------------------
  // 15. BATCH 2 NEW: Inlays & Onlays (REST) - Tier 2
  // --------------------------------------------------------------------
  {
    id: '33333333-3333-4333-a333-333333333315',
    slug: 'inlays-and-onlays',
    code: 'REST-INO-01',
    titleEn: 'Inlays & Onlays',
    titleTa: 'பீங்கான் இன்லே மற்றும் ஆன்லே அடைப்புகள் (Inlays & Onlays)',
    summaryEn: 'Custom laboratory-milled ceramic or composite indirect restorations that restore moderate-to-large tooth damage while conserving healthy natural tooth structure.',
    summaryTa: 'பல் தொப்பி தேவையில்லாத பெரிய சொத்தைகளை பல்லின் பெரும்பகுதியை சேதப்படுத்தாமல் சீரமைக்கும் பீங்கான் துல்லிய அடைப்பு.',
    durationMinutes: 45,
    anesthesiaType: 'Profound Local Anesthesia',
    primaryDepartmentName: 'Restorative Dentistry',
    primaryDepartmentCode: 'REST',
    exploreCategorySlugs: ["broken-or-chipped-teeth","pain-and-sensitivity"],
    governanceTier: 'TIER_2',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>Inlays and onlays are indirect restorations used when decayed or fractured tooth structure is too extensive for a standard filling but sufficient healthy enamel remains to avoid a full-coverage crown. An inlay fits within the tooth cusps, while an onlay extends over one or more damaged cusps to reinforce chewing integrity.</p>',
    overviewHtmlTa: '<p>இன்லே மற்றும் ஆன்லே என்பது பெரிய அளவில் சேதமடைந்த பற்களுக்கு முழு தொப்பி போடாமல் பல்லின் ஆரோக்கியமான பகுதிகளை பாதுகாத்து பீங்கான் மூலம் துல்லியமாக வடிவமைக்கப்படும் நவீன அடைப்பு முறையாகும்.</p>',
    has3DModel: false,
    interactiveStepsCount: 4
  },

  // --------------------------------------------------------------------
  // 16. BATCH 2 NEW: Direct Composite Bonding (REST) - Tier 1
  // --------------------------------------------------------------------
  {
    id: '33333333-3333-4333-a333-333333333316',
    slug: 'direct-composite-bonding',
    code: 'REST-BND-01',
    titleEn: 'Direct Composite Bonding',
    titleTa: 'பல் நிற காம்போசிட் பிணைப்பு சீரமைப்பு (Composite Bonding)',
    summaryEn: 'Artistic sculpting of tooth-colored composite resin directly onto chipped, spaced, or discolored teeth to enhance smile harmony in a single visit.',
    summaryTa: 'உடைந்த அல்லது இடைவெளி உள்ள பற்களை ஒரே நாளில் பல்லின் நிறத்திலேயே சீரமைக்கும் அழகியல் சிகிச்சை.',
    durationMinutes: 45,
    anesthesiaType: 'Non-Invasive / Rare Numbing Required',
    primaryDepartmentName: 'Restorative Dentistry',
    primaryDepartmentCode: 'REST',
    exploreCategorySlugs: ["broken-or-chipped-teeth","dental-appearance"],
    governanceTier: 'TIER_1',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>Direct composite bonding is a conservative aesthetic and restorative technique where pliable dental resin is sculpted directly onto enamel surfaces. Without requiring significant tooth reduction, it restores chipped incisal edges, closes small interdental gaps (diastemas), and covers stubborn localized discolorations in a single comfortable appointment.</p>',
    overviewHtmlTa: '<p>காம்போசிட் பிணைப்பு என்பது பல்லின் இயற்கையான எனாமலை தேய்க்காமல், உடைந்த பகுதிகள் மற்றும் பற்களுக்கு இடையே உள்ள இடைவெளிகளை பல்லின் நிறத்திலேயே இருக்கும் பிசின் கொண்டு ஒரே நாளில் அழகாக மாற்றும் சிகிச்சை முறையாகும்.</p>',
    has3DModel: false,
    interactiveStepsCount: 3
  },

  // --------------------------------------------------------------------
  // 17. BATCH 2 NEW: Direct & Indirect Pulp Capping (REST) - Tier 2
  // --------------------------------------------------------------------
  {
    id: '33333333-3333-4333-a333-333333333317',
    slug: 'pulp-capping',
    code: 'REST-PCP-01',
    titleEn: 'Direct & Indirect Pulp Capping',
    titleTa: 'நரம்பு பாதுகாப்பு சிகிச்சை (Direct & Indirect Pulp Capping)',
    summaryEn: 'Application of bioactive medicaments over near or pinpoint pulp exposures to stimulate reparative dentin bridge formation and save the tooth from root canal therapy.',
    summaryTa: 'ஆழமான சொத்தையில் நரம்பு வெளிப்படும் சூழலில், சிறப்பு மருந்து வைத்து நரம்பை பாதுகாத்து வேர் கால்வாய் சிகிச்சையை தவிர்க்கும் முறை.',
    durationMinutes: 40,
    anesthesiaType: 'Profound Local Anesthesia',
    primaryDepartmentName: 'Restorative Dentistry',
    primaryDepartmentCode: 'REST',
    exploreCategorySlugs: ["pain-and-sensitivity"],
    governanceTier: 'TIER_2',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>Pulp capping is a vital pulp therapy designed to prevent dental pulp death when deep caries or accidental mechanical exposure threatens the inner tooth nerve. By applying biocompatible mineralizing agents (such as MTA or calcium silicate bioceramics), the procedure encourages pulp cells to lay down a protective calcified dentin bridge, preserving tooth vitality and avoiding endodontic intervention.</p>',
    overviewHtmlTa: '<p>பல்ப் கேப்பிங் என்பது பல்லின் நரம்பை காப்பாற்ற செய்யப்படும் மிக முக்கியமான சிகிச்சை முறையாகும். ஆழமான சொத்தையை சுத்தம் செய்யும் போது நரம்பு தெரிய நேர்ந்தால், அதன் மேல் சிறப்பு தாது மருந்துகளை வைத்து புதிய பல் எலும்பு அடுக்கு உருவாக தூண்டப்படுகிறது.</p>',
    has3DModel: false,
    interactiveStepsCount: 3
  },

  // --------------------------------------------------------------------
  // 18. BATCH 2 NEW: Endodontic Retreatment (ENDO) - Tier 2
  // --------------------------------------------------------------------
  {
    id: '33333333-3333-4333-a333-333333333318',
    slug: 'endodontic-retreatment',
    code: 'ENDO-RET-01',
    titleEn: 'Endodontic Retreatment',
    titleTa: 'மறு வேர் கால்வாய் சிகிச்சை (Root Canal Retreatment)',
    summaryEn: 'Careful removal of prior root canal filling material, microscopic exploration for hidden canals, and re-disinfection to resolve persistent apical infection.',
    summaryTa: 'முன்பு செய்த வேர் கால்வாய் சிகிச்சையில் மீண்டும் தொற்று ஏற்பட்டால், பழைய அடைப்பை நீக்கி மீண்டும் சுத்தம் செய்து சீல் செய்யும் முறை.',
    durationMinutes: 75,
    anesthesiaType: 'Profound Local Anesthesia',
    primaryDepartmentName: 'Endodontics – Root Canal Treatments',
    primaryDepartmentCode: 'ENDO',
    exploreCategorySlugs: ["pain-and-sensitivity"],
    governanceTier: 'TIER_2',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>Endodontic retreatment is performed when a previously root-treated tooth fails to heal or develops persistent pain due to complicated anatomy, missed extra canals, or delayed crown leakage. The specialist removes the existing gutta-percha filling, searches with microscopic illumination for uncleaned anatomy, thoroughly disinfects, and reseals the canals.</p>',
    overviewHtmlTa: '<p>மறு வேர் கால்வாய் சிகிச்சை என்பது ஏற்கனவே சிகிச்சை செய்யப்பட்ட பல்லில் நுண் கால்வாய்கள் விடுபட்டதாலோ அல்லது மீண்டும் தொற்று ஏற்பட்டதாலோ செய்யப்படும் இரண்டாம் கட்ட சிகிச்சையாகும். பழைய அடைப்புகள் அகற்றப்பட்டு நவீன மைக்ரோஸ்கோப் மூலம் ஆழமாக சுத்தம் செய்யப்படுகிறது.</p>',
    has3DModel: false,
    interactiveStepsCount: 4
  },

  // --------------------------------------------------------------------
  // 19. BATCH 2 NEW: Apicoectomy (Root-End Microsurgery) (ENDO) - Tier 2
  // --------------------------------------------------------------------
  {
    id: '33333333-3333-4333-a333-333333333319',
    slug: 'apicoectomy',
    code: 'ENDO-API-01',
    titleEn: 'Apicoectomy (Root-End Microsurgery)',
    titleTa: 'வேர் முனை நுண் அறுவை சிகிச்சை (Apicoectomy)',
    summaryEn: 'Surgical excision of the infected root tip and placement of a biocompatible retrograde root-end filling to save a tooth when conventional root canal therapy cannot resolve apical infection.',
    summaryTa: 'சாதாரண வேர் கால்வாய் சிகிச்சையால் குணப்படுத்த முடியாத வேர் முனை தொற்றை சிறிய அறுவை சிகிச்சை மூலம் அகற்றி சீல் செய்யும் முறை.',
    durationMinutes: 60,
    anesthesiaType: 'Profound Local Anesthesia with Vasoconstrictor',
    primaryDepartmentName: 'Endodontics – Root Canal Treatments',
    primaryDepartmentCode: 'ENDO',
    exploreCategorySlugs: ["pain-and-sensitivity"],
    governanceTier: 'TIER_2',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>An apicoectomy (root-end resection) is a minor microsurgical procedure used to save a natural tooth when persistent infection in the surrounding jawbone cannot be cured through conventional root canal therapy. The specialist gently reflects a small gum window, removes the inflamed tip (last 3mm) of the root, cleans the root canal retrograde with ultrasonics, and seals it with a biocompatible filling.</p>',
    overviewHtmlTa: '<p>அபிகோக்டமி என்பது பல்லின் வேர் முனையில் உள்ள தீவிர தொற்றை ஈறுகளின் வழியாக சிறிய துவாரம் மூலம் அகற்றி பற்களை பிடுங்காமல் காக்கும் நுண் அறுவை சிகிச்சையாகும். வேரின் கடைசி 3 மிமீ வெட்டப்பட்டு கிருமி புகாத வண்ணம் சீல் செய்யப்படுகிறது.</p>',
    has3DModel: false,
    interactiveStepsCount: 4
  },

  // --------------------------------------------------------------------
  // 20. BATCH 2 NEW: Internal Tooth Bleaching (ENDO) - Tier 1
  // --------------------------------------------------------------------
  {
    id: '33333333-3333-4333-a333-333333333320',
    slug: 'internal-tooth-bleaching',
    code: 'ENDO-IBL-01',
    titleEn: 'Internal Tooth Bleaching',
    titleTa: 'உட்புற பல் வெளுப்பாக்குதல் (Internal Bleaching)',
    summaryEn: 'Application of professional oxidizing whitening agents inside the coronal chamber of an endodontically treated tooth, incorporating a protective cervical barrier to safeguard against external cervical resorption.',
    summaryTa: 'வேர் சிகிச்சை செய்யப்பட்ட பற்களில் ஏற்படும் நிறமாற்றத்தை, வேர் பகுதிக்கு பாதிப்பு ஏற்படாதவாறு பாதுகாப்பு தடுப்பு அமைத்து பல்லின் உள்ளே மருந்து வைத்து வெண்மையாக்கும் சிகிச்சை.',
    durationMinutes: 30,
    anesthesiaType: 'Non-Invasive / Pain-Free (Non-Vital Tooth)',
    primaryDepartmentName: 'Endodontics – Root Canal Treatments',
    primaryDepartmentCode: 'ENDO',
    exploreCategorySlugs: ["dental-appearance"],
    governanceTier: 'TIER_1',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>Internal tooth bleaching (walking bleach technique) is a conservative aesthetic procedure indicated for non-vital, endodontically treated teeth discolored by necrotic pulp breakdown products or previous materials. A critical clinical safety step is the placement of an effective mechanical cervical barrier—typically approximately 2 mm of glass ionomer cement or intermediate restorative material positioned at the level of the cementoenamel junction (CEJ) coronal to the root canal filling. This barrier seals dentinal pathways, preventing diffusion of the oxidizing bleaching agent into the periodontal ligament space and substantially reducing the risk of external cervical root resorption (ECR).</p>',
    overviewHtmlTa: '<p>உட்புற பல் வெளுப்பாக்குதல் (walking bleach technique) என்பது வேர் சிகிச்சை செய்யப்பட்ட பற்கள் உள் நிறமாற்றம் அடைந்திருக்கும்போது செய்யப்படும் பாதுகாப்பான அழகியல் சிகிச்சையாகும். இதில் மிக முக்கிய பாதுகாப்பு நடவடிக்கை என்னவென்றால், பல்லின் கழுத்து பகுதியில் (CEJ) வேர் அடைப்பின் மேல் சுமார் 2 மிமீ தடிமனில் கிளாஸ் ஐயோனோமர் போன்ற பாதுகாப்பு தடுப்பு அமைக்கப்படுவதாகும். இது ஆக்சிஜனேற்ற மருந்து வேரின் வெளிப்புற திசுக்களுக்குள் கசிவதைத் தடுத்து, வெளிப்புற வேர் அரிப்பு (external cervical resorption) ஏற்படும் அபாயத்திலிருந்து பாதுகாக்கிறது.</p>',
    has3DModel: false,
    interactiveStepsCount: 3
  }
,
  // --------------------------------------------------------------------
  // 21. BATCH 3 NEW: Gingival Flap Surgery (PERIO) - Tier 2
  // --------------------------------------------------------------------
  {
    id: '33333333-3333-4333-a333-333333333321',
    slug: 'gingival-flap-surgery',
    code: 'PERIO-FLP-01',
    titleEn: 'Gingival Flap Surgery',
    titleTa: 'ஈறு மடல் அறுவை சிகிச்சை (Flap Surgery)',
    summaryEn: 'Surgical elevation of the gum tissue to allow direct visualization and thorough debridement of deep bacterial pockets and diseased root surfaces.',
    summaryTa: 'ஆழமான ஈறு பாக்கெட்டுகளில் உள்ள பாக்டீரியா தொற்று மற்றும் படிவுகளை நேரடியாக நீக்க ஈறு திசுவை மென்மையாக விலக்கி செய்யப்படும் அறுவை சிகிச்சை.',
    durationMinutes: 60,
    anesthesiaType: 'Local Anesthesia',
    primaryDepartmentName: 'Periodontics – Gum Treatments',
    primaryDepartmentCode: 'PERIO',
    exploreCategorySlugs: ["gums-and-bleeding","pain-and-sensitivity"],
    governanceTier: 'TIER_2',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>Gingival flap surgery is an advanced periodontal procedure indicated when chronic gum disease has created deep pockets (typically 6 mm or greater) that cannot be adequately reached or cleaned by non-surgical scaling and root planing alone. The periodontist gently separates and folds back a section of gum tissue, providing direct optical access to the root surfaces and alveolar bone. After meticulously cleaning away persistent subgingival calculus, diseased granulation tissue, and microbial toxins, the bone may be reshaped and the gums are repositioned and sutured tightly around the teeth, creating a biological environment that is much easier to maintain through daily oral hygiene.</p>',
    overviewHtmlTa: '<p>ஈறு மடல் அறுவை சிகிச்சை (Gingival Flap Surgery) என்பது தீவிர ஈறு நோயினால் (Periodontitis) பற்களைச் சுற்றி ஏற்படும் ஆழமான ஈறு பாக்கெட்டுகளை சுத்தம் செய்ய உதவும் சிகிச்சையாகும். சாதாரண பற்கூச்சம் மற்றும் சுத்தம் செய்தல் மூலம் எட்ட முடியாத ஆழமான பகுதிகளை, ஈறு திசுக்களை மென்மையாகப் பிரித்து மருத்துவர் நேரடியாகப் பார்வையிட்டு சுத்தம் செய்கிறார். வேர் பரப்புகளில் படிந்துள்ள கடினமான காரைகள் மற்றும் பாதிக்கப்பட்ட திசுக்கள் முழுமையாக அகற்றப்பட்ட பின், ஈறுகள் மீண்டும் நேர்த்தியாக தைக்கப்படுகின்றன.</p>',
    has3DModel: false,
    interactiveStepsCount: 4
  },

  // --------------------------------------------------------------------
  // 22. BATCH 3 NEW: Gum Grafting (PERIO) - Tier 2
  // --------------------------------------------------------------------
  {
    id: '33333333-3333-4333-a333-333333333322',
    slug: 'gum-grafting',
    code: 'PERIO-GFT-01',
    titleEn: 'Gum Grafting (Soft Tissue Augmentation)',
    titleTa: 'ஈறு ஒட்டு சிகிச்சை (Gum Grafting)',
    summaryEn: 'Micro-surgical transfer of donor soft tissue or biologic matrix to cover exposed tooth roots, arrest receding gum margins, and relieve severe sensitivity.',
    summaryTa: 'கீழிறங்கிய ஈறுகளால் வெளிப்படும் வேர் பகுதியை மூடி, பல் கூச்சத்தைப் போக்கி மேலும் தேய்மானம் அடையாமல் காக்கும் ஈறு ஒட்டு சிகிச்சை.',
    durationMinutes: 75,
    anesthesiaType: 'Local Anesthesia',
    primaryDepartmentName: 'Periodontics – Gum Treatments',
    primaryDepartmentCode: 'PERIO',
    exploreCategorySlugs: ["gums-and-bleeding","pain-and-sensitivity","dental-appearance"],
    governanceTier: 'TIER_2',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>Gum grafting (soft tissue augmentation) is a microsurgical procedure designed to treat gingival recession, where gum tissue has pulled away from the tooth, exposing the sensitive root surface to decay, abrasion, and thermal sensitivity. The periodontist gently obtains a thin layer of healthy connective tissue (most commonly from the patient\'s palate or utilizing an acellular dermal matrix) and carefully sutures it over the recessed area. This procedure restores protective keratinized tissue, halts progressive bone and gum loss, significantly diminishes root sensitivity, and restores a balanced, natural smile line.</p>',
    overviewHtmlTa: '<p>ஈறு ஒட்டு சிகிச்சை (Gum Grafting) என்பது ஈறுகள் சுருங்கி அல்லது தேய்ந்து பல்லின் வேர் பகுதி வெளியே தெரியும் நிலையை சரிசெய்யும் ஒரு நுண் அறுவை சிகிச்சையாகும். அண்ணத்தின் உள்பகுதியில் இருந்து எடுக்கப்படும் மெல்லிய திசு அல்லது மருத்துவ ஒட்டு பொருள், வேர் வெளிப்பட்ட பகுதியில் கவனமாக தைக்கப்படுகிறது. இது பற்கூச்சத்தை உடனடியாகக் குறைத்து, வேர் சொத்தையாவதைத் தடுத்து, ஈறுகளின் இயல்பான அழகிய அமைப்பை மீட்டெடுக்கிறது.</p>',
    has3DModel: false,
    interactiveStepsCount: 4
  },

  // --------------------------------------------------------------------
  // 23. BATCH 3 NEW: Crown Lengthening (PERIO) - Tier 2
  // --------------------------------------------------------------------
  {
    id: '33333333-3333-4333-a333-333333333323',
    slug: 'crown-lengthening',
    code: 'PERIO-CRW-01',
    titleEn: 'Crown Lengthening',
    titleTa: 'பல் நீட்டிப்பு சிகிச்சை (Crown Lengthening)',
    summaryEn: 'Surgical reshaping of gum and bone contours to expose sufficient sound tooth structure for crown restoration or to correct an uneven gummy smile.',
    summaryTa: 'பல்லில் கேப் (crown) பொருத்துவதற்கு போதிய பல் பகுதியை வெளிப்படுத்த அல்லது ஈறு சிரிப்பை சரிசெய்ய ஈறு மற்றும் எலும்பை சீரமைக்கும் சிகிச்சை.',
    durationMinutes: 60,
    anesthesiaType: 'Local Anesthesia',
    primaryDepartmentName: 'Periodontics – Gum Treatments',
    primaryDepartmentCode: 'PERIO',
    exploreCategorySlugs: ["broken-or-chipped-teeth","dental-appearance"],
    governanceTier: 'TIER_2',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>Crown lengthening is a specialized periodontal surgical procedure that adjusts the level of the gingival margin and underlying crestal bone around one or more teeth. It is primarily indicated when subgingival caries, traumatic fracture, or severe structural loss compromises retention and ferrule access for a planned indirect restoration. Guided by restorative and periodontal planning principles, surgery aims to expose sufficient sound supragingival tooth structure to facilitate clinical crown retention while re-establishing a harmonious supracrestal tissue attachment space to mitigate post-restorative gingival inflammation. Individual restorative planning considerations (such as ferrule dimensions, supracrestal soft-tissue accommodation, aesthetic crown-to-root ratios, and furcation proximity) are evaluated on a case-specific basis rather than applying a single universal numerical formula. Crown lengthening may also be utilized selectively for aesthetic management of excessive gingival display in carefully evaluated clinical presentations.</p>',
    overviewHtmlTa: '<p>பல் நீட்டிப்பு சிகிச்சை (Crown Lengthening) என்பது பல்லின் மகுட பகுதியை வெளிப்படுத்த ஈறு மற்றும் தாடை எலும்பை மறுவடிவமைக்கும் ஒரு சிறப்பு அறுவை சிகிச்சையாகும். ஈறுக்கு கீழே உடைந்த அல்லது சொத்தையான பற்களுக்கு கேப் (crown) பொருத்துவதற்கு போதுமான இயற்கை பல் பகுதி தேவைப்படும் போது, பல்லின் அமைப்பு மற்றும் ஈறு இடைவெளியைக் கணக்கில் கொண்டு தனிப்பயனாக்கப்பட்ட முறையில் இது திட்டமிடப்படுகிறது. சிரிக்கும் போது ஈறுகள் அதிகமாகத் தெரியும் குறைபாட்டை அழகியல் ரீதியாக சரிசெய்யவும் இச்சிகிச்சை பயன்படுகிறது.</p>',
    has3DModel: false,
    interactiveStepsCount: 4
  },

  // --------------------------------------------------------------------
  // 24. BATCH 3 NEW: Frenectomy (PERIO) - Tier 2
  // --------------------------------------------------------------------
  {
    id: '33333333-3333-4333-a333-333333333324',
    slug: 'frenectomy',
    code: 'PERIO-FRN-01',
    titleEn: 'Frenectomy (Labial & Lingual)',
    titleTa: 'ஃபிரனெக்டமி (ஈறு/நாக்கு இணைப்பு திசு நீக்கம்)',
    summaryEn: 'A minor surgical release or excision of a restrictive mucosal tissue fold to alleviate tongue-tie, prevent gum recession, or resolve tooth spacing.',
    summaryTa: 'நாக்கு அல்லது உதட்டுப் பகுதியில் உள்ள இறுக்கமான இணைப்பு திசுவை அகற்றி, பேச்சு குறைபாடு, பல் இடைவெளி மற்றும் ஈறு தேய்மானத்தை சரிசெய்யும் சிகிச்சை.',
    durationMinutes: 30,
    anesthesiaType: 'Local Anesthesia or Topical Numbing',
    primaryDepartmentName: 'Periodontics – Gum Treatments',
    primaryDepartmentCode: 'PERIO',
    exploreCategorySlugs: ["tooth-alignment","gums-and-bleeding"],
    governanceTier: 'TIER_2',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>A frenectomy is an outpatient surgical procedure designed to release or excise a mucosal tissue fold (frenum)—most commonly addressing the lingual frenum beneath the tongue or the maxillary labial frenum connecting the upper lip to the alveolar mucosa. In accordance with the American Academy of Pediatric Dentistry (AAPD) policy on the management of oral frenula, surgical release is considered an individualized intervention indicated for demonstrable functional limitations rather than anatomical appearance alone. For the lingual frenum (ankyloglossia), surgical release is considered when objective functional impairment is present; in infants experiencing breastfeeding difficulties or maternal nipple pain, a multidisciplinary assessment is recommended to evaluate and rule out other contributing maternal or infant factors before proceeding with surgical intervention. For children presenting with speech concerns, the AAPD recommends formal evaluation by a qualified speech-language pathologist skilled in assessing ankyloglossia prior to considering surgical tongue-tie release. For the maxillary labial frenum, management depends strictly on the clinical indication: when evaluated for a maxillary midline diastema in the primary or mixed dentition, most diastemas are developmental and may close spontaneously with growth; consequently, surgical labial frenectomy is generally deferred until after the eruption of the permanent maxillary canines and, where indicated, coordinated with orthodontic space closure. This canine-eruption timing guideline applies specifically to maxillary midline diastema management; earlier labial intervention may be considered when a heavy, tense frenulum produces localized traumatic gingival effects, such as papillary blanching under tension or progressive gingival recession.</p>',
    overviewHtmlTa: '<p>ஃபிரனெக்டமி (Frenectomy) என்பது உதடு அல்லது நாக்கை இணைக்கும் தசை மடிப்பை (frenum) தளர்த்தும் அறுவை சிகிச்சையாகும். அமெரிக்க குழந்தைகள் பல் மருத்துவ சங்கத்தின் (AAPD 2022) கொள்கையின்படி, புறத்தோற்றத்தை மட்டும் வைத்து அறுவை சிகிச்சை செய்யாமல், செயல்பாட்டுக் குறைபாடுகள் நிரூபிக்கப்பட்டால் மட்டுமே தனிப்பட்ட முறையில் இது செய்யப்படுகிறது. நாக்கு இணைப்பைப் பொருத்தவரை, குழந்தைகளுக்கு தாய்ப்பால் அருந்துவதில் சிக்கல் இருந்தால் பிற மருத்துவக் காரணங்களை பலதுறை வல்லுநர்கள் ஆராய்ந்த பின்னரே அறுவை சிகிச்சை பரிசீலிக்கப்படுகிறது; பேச்சு குறைபாடுகள் இருந்தால் தகுதிவாய்ந்த பேச்சுப் பயிற்சி நிபுணரின் (Speech-Language Pathologist) மதிப்பீடு அவசியமாகும். மேல் உதட்டு இணைப்பைப் பொருத்தவரை, முன் பல் இடைவெளிகள் வளர்ச்சியில் இயற்கையாக மூடக்கூடும் என்பதால், நிரந்தர கோரைப் பற்கள் (canines) முளைத்த பின்னரே பொதுவாக அறுவை சிகிச்சை ஒத்திவைக்கப்படுகிறது. அதேநேரம், உதட்டு இணைப்பு ஈறுகளை இழுத்து வெளிரச் செய்தாலோ (blanching) அல்லது ஈறு தேய்மானத்தை உண்டாக்கினாலோ மட்டுமே ஆரம்ப கட்டத்தில் அறுவை சிகிச்சை பரிசீலிக்கப்படுகிறது.</p>',
    has3DModel: false,
    interactiveStepsCount: 3
  },

  // --------------------------------------------------------------------
  // 25. BATCH 3 NEW: Socket Preservation & Bone Grafting (OMFS) - Tier 2
  // --------------------------------------------------------------------
  {
    id: '33333333-3333-4333-a333-333333333325',
    slug: 'socket-preservation-bone-graft',
    code: 'OMFS-SCK-01',
    titleEn: 'Socket Preservation & Bone Grafting',
    titleTa: 'பல் எடுத்த பின் எலும்பு பாதுகாப்பு ஒட்டு (Socket Preservation)',
    summaryEn: 'Placement of bone biomaterials and protective membranes in fresh extraction sockets to limit post-extraction dimensional bone loss and facilitate future site development.',
    summaryTa: 'பல் பிடுங்கப்பட்ட உடனேயே அந்த எலும்பு குழியில் சிறப்பு ஒட்டு பொருளை வைத்து, எலும்பு தேய்ந்து சுருங்குவதைத் தடுத்து வருங்கால இம்பிளான்ட்டுக்கு தயார்படுத்தும் சிகிச்சை.',
    durationMinutes: 45,
    anesthesiaType: 'Local Anesthesia',
    primaryDepartmentName: 'Oral & Maxillofacial Surgery',
    primaryDepartmentCode: 'OMFS',
    exploreCategorySlugs: ["missing-teeth"],
    governanceTier: 'TIER_2',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>Socket preservation (alveolar ridge preservation) is a clinical technique performed at the time of tooth extraction to manage the physiological bone resorption that follows tooth removal. Systematic reviews, including the 2021 Cochrane update (Atieh et al.), demonstrate that placing bone biomaterials or barrier membranes into fresh extraction sockets may limit dimensional horizontal and vertical bone reduction in certain clinical comparisons relative to unassisted healing. However, current evidence does not demonstrate complete preservation of alveolar ridge dimensions, nor does it establish proven improvements in long-term dental implant survival, failure rates, or aesthetic success. The primary established benefit remains a potential reduction in the need for subsequent major bone augmentation procedures at the time of delayed implant placement.</p>',
    overviewHtmlTa: '<p>சாக்கெட் பாதுகாப்பு (Socket Preservation) என்பது பல் பிடுங்கப்பட்ட உடனேயே அக்குழியில் எலும்பு ஒட்டுப் பொருள் வைக்கப்படும் நவீன முறையாகும். பல் எடுக்கப்பட்ட பிறகு தாடை எலும்பு வேகமாக சுருங்கி தேய்ந்து போவது இயற்கை. இதனைத் தவிர்க்க, பிரத்யேக எலும்பு துகள்கள் அக்குழியில் நிரப்பப்பட்டு ஒரு பாதுகாப்பு மென்படலத்தால் மூடப்படுகிறது. இது தாடை எலும்பின் உயரம் மற்றும் அகலத்தை அப்படியே பாதுகாத்து, பிற்காலத்தில் பல் இம்பிளான்ட் உறுதியாகப் பொருந்துவதை உறுதி செய்கிறது.</p>',
    has3DModel: false,
    interactiveStepsCount: 4
  },

  // --------------------------------------------------------------------
  // 26. BATCH 3 NEW: Alveolar Ridge Augmentation (OMFS) - Tier 3
  // --------------------------------------------------------------------
  {
    id: '33333333-3333-4333-a333-333333333326',
    slug: 'alveolar-ridge-augmentation',
    code: 'OMFS-RDG-01',
    titleEn: 'Alveolar Ridge Augmentation',
    titleTa: 'தாடை எலும்பு கட்டமைப்பு மறுசீரமைப்பு (Ridge Augmentation)',
    summaryEn: 'Advanced surgical reconstruction of deficient or resorbed jawbone dimensions using particulate or block bone grafts and barrier membranes.',
    summaryTa: 'நீண்ட காலம் பல் இல்லாமல் சுருங்கிப்போன தாடை எலும்பின் தடிமன் மற்றும் உயரத்தை பிரத்யேக எலும்பு ஒட்டுகள் மூலம் மீளமைக்கும் உயர்நிலை அறுவை சிகிச்சை.',
    durationMinutes: 90,
    anesthesiaType: 'Local Anesthesia with Optional Oral/IV Sedation',
    primaryDepartmentName: 'Oral & Maxillofacial Surgery',
    primaryDepartmentCode: 'OMFS',
    exploreCategorySlugs: ["missing-teeth"],
    governanceTier: 'TIER_3',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>Alveolar ridge augmentation is an advanced reconstructive surgical procedure indicated when localized or extensive jawbone deficiency precludes standard dental implant placement or compromise prosthodontic stability. Applying principles of guided bone regeneration (GBR) or autogenous/allogeneic block grafting, the specialist places osteoconductive particulate or structured bone grafts over the deficient cortical ridge, frequently stabilizing the graft with resorbable or titanium-reinforced barrier membranes to exclude rapidly proliferating soft tissue cells. Healing intervals typically range from 4 to 9 months depending on defect morphology, vascularity, and graft composition before implant osteotomy can be safely performed. Given the surgical complexity and potential complications (such as membrane exposure or graft resorption), comprehensive diagnostic CBCT planning and specialist surgical expertise are paramount.</p>',
    overviewHtmlTa: '<p>தாடை எலும்பு கட்டமைப்பு மறுசீரமைப்பு (Alveolar Ridge Augmentation) என்பது சுருங்கிய அல்லது சேதமடைந்த தாடை எலும்பை மீண்டும் உருவாக்கும் ஒரு மேம்பட்ட அறுவை சிகிச்சையாகும். பல் இழந்து பல வருடங்கள் ஆவதால் தாடை எலும்பு மிகவும் மெலிந்து போயிருக்கும் நிலைகளில், இம்பிளான்ட் வைக்க போதுமான எலும்பு இருக்காது. அத்தகைய சூழலில், எலும்பு ஒட்டு துகள்கள் மற்றும் டைட்டானியம் அல்லது கொலாஜன் மென்படலங்களைப் பயன்படுத்தி தாடையின் தடிமன் மற்றும் உயரம் மீண்டும் கட்டமைக்கப்படுகிறது.</p>',
    has3DModel: false,
    interactiveStepsCount: 4
  },

  // --------------------------------------------------------------------
  // 27. BATCH 3 NEW: Sinus Lift (OMFS) - Tier 3
  // --------------------------------------------------------------------
  {
    id: '33333333-3333-4333-a333-333333333327',
    slug: 'sinus-lift',
    code: 'OMFS-SNS-01',
    titleEn: 'Sinus Lift (Sinus Augmentation)',
    titleTa: 'மேல் தாடை சைனஸ் எலும்பு ஏற்ற சிகிச்சை (Sinus Lift)',
    summaryEn: 'Surgical elevation of the Schneiderian sinus membrane and grafting of bone into the sinus cavity to create adequate vertical height for upper back implants.',
    summaryTa: 'மேல் தாடை சைனஸ் சவ்வை மென்மையாக மேலே உயர்த்தி, கீழே எலும்பு ஒட்டு வைத்து மேல் பின் பற்களுக்கு இம்பிளான்ட் வைக்க வழி செய்யும் அறுவை சிகிச்சை.',
    durationMinutes: 75,
    anesthesiaType: 'Local Anesthesia with Optional Sedation',
    primaryDepartmentName: 'Oral & Maxillofacial Surgery',
    primaryDepartmentCode: 'OMFS',
    exploreCategorySlugs: ["missing-teeth"],
    governanceTier: 'TIER_3',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>Maxillary sinus floor elevation (sinus augmentation) is a surgical technique designed to augment vertical bone dimensions in the edentulous posterior maxilla when alveolar crest resorption or sinus pneumatization limits native bone height. Two primary approaches are recognized in clinical guidelines: the transcrestal approach (typically utilized for localized, moderate vertical deficiencies) and the lateral window technique (indicated for substantial vertical bone loss). Under careful surgical technique, the Schneiderian respiratory membrane lining the sinus floor is gently elevated, creating a subantral compartment into which particulate bone graft material is packed. Potential procedural risks include intraoperative Schneiderian membrane tearing, postoperative sinusitis, or graft displacement, requiring thorough pre-operative radiographic assessment and anatomical clearance.</p>',
    overviewHtmlTa: '<p>மேல் தாடை சைனஸ் ஏற்ற சிகிச்சை (Sinus Lift) என்பது மேல் கடைவாய்ப் பற்கள் உள்ள பகுதியில் எலும்பின் உயரத்தை அதிகரிக்கச் செய்யப்படும் ஒரு சிறப்பு அறுவை சிகிச்சையாகும். மேல் தாடையில் பற்கள் இழந்த பிறகு, சைனஸ் காற்றுப்பை விரிவடைந்து எலும்பின் தடிமன் குறைந்துவிடும். இதனால் இம்பிளான்ட் வைக்க போதிய எலும்பு இருப்பதில்லை. மருத்துவர் சைனஸ் சவ்வை சேதமடையாமல் லேசாக உயர்த்தி, அதன் அடியில் புதிய எலும்பு ஒட்டுப் பொருளை நிரப்புவார். இது சில மாதங்களில் உறுதியான எலும்பாக மாறி இம்பிளான்ட்டுக்கு சிறந்த அடித்தளத்தை அளிக்கிறது.</p>',
    has3DModel: false,
    interactiveStepsCount: 4
  },

  // --------------------------------------------------------------------
  // 28. BATCH 3 NEW: Dental Abscess Management (OMFS) - Tier 3
  // --------------------------------------------------------------------
  {
    id: '33333333-3333-4333-a333-333333333328',
    slug: 'dental-abscess-management',
    code: 'OMFS-ABS-01',
    titleEn: 'Dental Abscess Management',
    titleTa: 'பல் சீழ்கட்டி மற்றும் அவசர தொற்று சிகிச்சை (Abscess Management)',
    summaryEn: 'Urgent surgical incision, drainage, and source eradication to relieve severe swelling, eliminate active bacterial infection, and prevent facial spread.',
    summaryTa: 'தீவிர பல் சீழ்கட்டியை உடனடியாக அறுவை சிகிச்சை மூலம் கீறி வடிகட்டி, தொற்று முகப்பகுதிக்கு பரவாமல் தடுக்கும் அவசர சிகிச்சை.',
    durationMinutes: 45,
    anesthesiaType: 'Local Anesthesia (Targeted Ring / Nerve Block)',
    primaryDepartmentName: 'Oral & Maxillofacial Surgery',
    primaryDepartmentCode: 'OMFS',
    exploreCategorySlugs: ["pain-and-sensitivity","gums-and-bleeding"],
    governanceTier: 'TIER_3',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>Dental abscess management requires structured, urgent clinical intervention to manage acute purulent collections originating from necrotic pulp, periapical pathology, or periodontal infection. Clinical recommendations from the 2019 American Dental Association (ADA) guideline stratify antibiotic use according to specific diagnostic presentation and the immediate availability of definitive conservative dental treatment (DCDT—formally defined as pulpotomy, pulpectomy, non-surgical root canal therapy, or incision and drainage): (1) When DCDT is immediately available for localized pulpal and periapical conditions in immunocompetent patients, operative treatment alone is the definitive therapy, and adjunctive systemic antibiotics are generally not recommended; (2) When DCDT is not immediately available for pulp necrosis with symptomatic apical periodontitis, the ADA suggests providing a delayed antibiotic prescription with specific instructions on when it should be filled; (3) When DCDT is not immediately available for pulp necrosis with localized acute apical abscess, the ADA conditionally recommends prescribing systemic antibiotics alongside urgent referral for definitive treatment; (4) When clinical signs indicate systemic involvement (such as fever, malaise, lymphadenopathy, or rapid progression), systemic antibiotics are indicated in conjunction with urgent definitive dental therapy. Beyond conservative tooth-preserving procedures, surgical tooth extraction represents an appropriate definitive clinical alternative when a tooth is non-restorable. Crucially, the ADA guideline addresses localized pulpal and periapical conditions; spreading odontogenic infections presenting with deep-space emergency red flags—such as difficulty swallowing (dysphagia), labored breathing (dyspnea), elevation of the floor of the mouth, severe trismus, or suspected Ludwig&#39;s angina—fall beyond standard outpatient dental protocols and mandate immediate emergency hospital escalation for specialized airway management and surgical decompression (Flynn et al.).</p>',
    overviewHtmlTa: '<p>பல் சீழ்கட்டி சிகிச்சை (Dental Abscess Management) என்பது பல்லின் வேர் அல்லது ஈறுகளில் சேரும் சீழை உடனடியாக வெளியேற்றி தொற்றை அழிக்கும் அவசர சிகிச்சையாகும். அமெரிக்க பல் மருத்துவ சங்கத்தின் (ADA 2019) வழிகாட்டுதலின்படி, உடனடி பழமைவாத பல் சிகிச்சை (DCDT—சீழ் வடிகட்டுதல், வேர் சிகிச்சை) உடனடியாகக் கிடைக்கும் போது அதுவே முதன்மை சிகிச்சையாகும்; மருந்துகள் தேவைப்படுவதில்லை. பல் நசிவுற்று வலி இருக்கும் போது உடனடி சிகிச்சை கிடைக்கவில்லை எனில், குறிப்பிட்ட நிபந்தனைகளுடன் தாமதமான ஆன்டிபயாடிக் சீட்டு பரிந்துரைக்கப்படுகிறது; உள்ளூர் கடுமையான சீழ்கட்டிக்கு உடனடி சிகிச்சை கிடைக்காத போது, உடனடி பரிந்துரையுடன் ஆன்டிபயாடிக் பரிந்துரைக்கப்படுகிறது. காய்ச்சல், நிணநீர் வீக்கம் போன்ற உடல் அளவிலான தொற்று அறிகுறிகள் இருந்தால் உடனடி பல் சிகிச்சையுடன் ஆன்டிபயாடிக் அவசியமாகும். பற்களைக் காப்பாற்ற முடியாத போது பல் அகற்றுதல் ஒரு உறுதியான சிகிச்சையாகும். அதேவேளை, விழுங்குவதில் சிரமம், மூச்சுத்திணறல், வாயின் அடிப்பகுதி வீங்குதல் (Ludwig&#39;s angina) போன்ற ஆபத்தான எச்சரிக்கை அறிகுறிகள் தென்பட்டால், உடனடியாக அவசர சிகிச்சை மருத்துவமனைக்குச் சென்று சுவாசப் பாதையைப் பாதுகாத்து அறுவை சிகிச்சை பெறுவது அவசியமாகும்.</p>',
    has3DModel: false,
    interactiveStepsCount: 4
  },

  // --------------------------------------------------------------------
  // 29. BATCH 3 NEW: Implant-Supported Bridge (IMPL) - Tier 2
  // --------------------------------------------------------------------
  {
    id: '33333333-3333-4333-a333-333333333329',
    slug: 'implant-supported-bridge',
    code: 'IMPL-BRG-01',
    titleEn: 'Implant-Supported Bridge',
    titleTa: 'இம்பிளான்ட் தாங்கும் பல் பாலம் (Implant Bridge)',
    summaryEn: 'A fixed multi-unit dental prosthesis anchored securely onto two or more osseointegrated dental implants to replace multiple consecutive missing teeth.',
    summaryTa: 'அடுத்தடுத்து இல்லாத பல பற்களுக்குப் பதிலாக இரண்டு அல்லது அதற்கு மேற்பட்ட இம்பிளான்ட்டுகள் மீது உறுதியாக பொருத்தப்படும் நிரந்தர பல் பாலம்.',
    durationMinutes: 60,
    anesthesiaType: 'Local Anesthesia (Prosthetic Phase: Painless)',
    primaryDepartmentName: 'Dental Implantology',
    primaryDepartmentCode: 'IMPL',
    exploreCategorySlugs: ["missing-teeth"],
    governanceTier: 'TIER_2',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>An implant-supported fixed dental prosthesis (bridge) is an established therapeutic modality to rehabilitate multi-tooth edentulous spans without requiring preparation of adjacent natural teeth. Typically supported by two or more osseointegrated endosseous dental implants, the restoration may be configured with either screw-retained or cement-retained prosthetic connections based on interocclusal space, aesthetic parameters, and retrievability considerations. Systematic reviews demonstrate high long-term survival rates for implant-supported fixed partial dentures exceeding 5 and 10 years, though technical complications (such as ceramic chipping or screw loosening) and biological considerations (such as peri-implant mucositis or peri-implantitis) necessitate dedicated home care and regular professional peri-implant maintenance.</p>',
    overviewHtmlTa: '<p>இம்பிளான்ட் தாங்கும் பல் பாலம் (Implant-Supported Bridge) என்பது அடுத்தடுத்து மூன்று அல்லது அதற்கு மேற்பட்ட பற்களை இழந்தவர்களுக்கு நிரந்தர தீர்வளிக்கும் சிறந்த முறையாகும். ஒவ்வொரு பல்லுக்கும் தனித்தனி இம்பிளான்ட் வைக்கத் தேவையின்றி, இரு முனைகளிலும் இம்பிளான்ட்டுகள் பொருத்தப்பட்டு அதன் மீது இணைக்கப்பட்ட பற்கள் கொண்ட பாலம் உறுதியாக பொருத்தப்படுகிறது. சாதாரண பாலங்களைப் போல பக்கத்து நல்ல பற்களைத் தேய்க்க வேண்டிய அவசியமில்லை என்பது இதன் கூடுதல் சிறப்பாகும்.</p>',
    has3DModel: false,
    interactiveStepsCount: 4
  },

  // --------------------------------------------------------------------
  // 30. BATCH 3 NEW: Full-Arch Implant Restoration (IMPL) - Tier 3
  // --------------------------------------------------------------------
  {
    id: '33333333-3333-4333-a333-333333333330',
    slug: 'full-arch-implant-restoration',
    code: 'IMPL-FLA-01',
    titleEn: 'Full-Arch Implant Restoration (Fixed All-on-X)',
    titleTa: 'முழு தாடை இம்பிளான்ட் பல் சீரமைப்பு (Full-Arch All-on-4/6)',
    summaryEn: 'Comprehensive rehabilitation of an entirely edentulous arch with a rigid screw-retained full-arch zirconia prosthesis anchored onto 4 to 6 implants.',
    summaryTa: 'முழு தாடையில் உள்ள அனைத்து பற்களையும் இழந்தவர்களுக்கு 4 முதல் 6 இம்பிளான்ட்டுகள் மூலம் நிரந்தர பற்கள் வரிசையை அமைக்கும் முழு தாடை சீரமைப்பு.',
    durationMinutes: 120,
    anesthesiaType: 'Local Anesthesia with Conscious Sedation',
    primaryDepartmentName: 'Dental Implantology',
    primaryDepartmentCode: 'IMPL',
    exploreCategorySlugs: ["missing-teeth"],
    governanceTier: 'TIER_3',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>Full-arch fixed implant rehabilitation is a comprehensive prosthodontic option for completely edentulous patients or those with terminal dentition. Treatment planning involves strategic distribution of endosseous implants—typically utilizing four, six, or more implants depending on arch morphology, bone volume, bone density, and opposing occlusal forces, with posterior implants occasionally angled to utilize available bone and avoid anatomical structures (such as the inferior alveolar canal or maxillary sinus). The definitive screw-retained prosthesis (fabricated from monolithic zirconia, metal-ceramic, or titanium-reinforced resin) provides fixed stability and functional restoration. Long-term success requires careful diagnostic evaluation, strict biomechanical distribution, and lifelong peri-implant hygiene maintenance.</p>',
    overviewHtmlTa: '<p>முழு தாடை இம்பிளான்ட் சீரமைப்பு (Full-Arch Implant Restoration) என்பது ஒரு தாடையில் உள்ள அனைத்து பற்களையும் இழந்தவர்களுக்கு நவீன முறையில் புதிய பற்கள் அமைக்கும் முழுமையான சிகிச்சையாகும். 3D டிஜிட்டல் திட்டமிடல் மூலம் தாடையில் 4 அல்லது 6 இம்பிளான்ட்டுகள் பொருத்தப்படுகின்றன. எலும்பு குறைவாக உள்ள இடங்களிலும் கூட சாய்வாக வைத்து உறுதியாக்க முடியும். இதன் மீது நிரந்தரமான மகுடப் பற்கள் கொண்ட முழு பாலம் திருகுகள் மூலம் அசைவின்றி பொருத்தப்படுகிறது. இது கழற்றி மாட்ட வேண்டிய அவசியமின்றி இயற்கையான பற்களைப் போன்றே மெல்லும் ஆற்றலை அளிக்கிறது.</p>',
    has3DModel: false,
    interactiveStepsCount: 4
  }
];

export const CLINICAL_DISCLAIMER_EN = 
  "Educational Visual Guide Only: The information provided on DentalVis is designed to facilitate informed discussions between patients and certified dental professionals. It does not constitute medical diagnosis, clinical treatment advice, or formal care recommendations.";

export const CLINICAL_DISCLAIMER_TA = 
  "கல்வி வழிகாட்டி மட்டுமே: டென்டல்விஸ் தளத்தில் உள்ள தகவல்கள் நோயாளிகளுக்கும் பல் மருத்துவ நிபுணர்களுக்கும் இடையேயான கலந்துரையாடலை எளிதாக்குவதற்காக மட்டுமே உருவாக்கப்பட்டுள்ளது. இது மருத்துவப் பரிசோதனை அல்லது சிகிச்சை பரிந்துரை அல்ல.";

// ----------------------------------------------------------------------
// PUBLICATION POLICY UTILITIES
// ----------------------------------------------------------------------

/**
 * Reusable publication policy predicate.
 * - In production: strictly enforces `contentStatus === 'PUBLISHED'`.
 * - In controlled non-production preview (DENTALVIS_PREVIEW_MODE === 'true' and NODE_ENV !== 'production'):
 *   permits previewing unapproved 'DRAFT' and 'PENDING_APPROVAL' content with visible notices.
 * - Rejects/withdrawn/unknown statuses always default to hidden.
 */
declare const process: { env?: Record<string, string | undefined> } | undefined;

export function isProcedureVisibleInEnvironment(
  proc: ProcedureSummary,
  env: { nodeEnv?: string; previewMode?: string } = {}
): boolean {
  if (!proc || !proc.contentStatus) {
    return false;
  }

  const nodeEnv = env.nodeEnv ?? (typeof process !== 'undefined' ? process.env?.NODE_ENV : undefined);
  const previewMode = env.previewMode ?? (typeof process !== 'undefined' ? process.env?.DENTALVIS_PREVIEW_MODE : undefined);

  const isProduction = nodeEnv === 'production';
  const isPreviewAuthorized = !isProduction && previewMode === 'true';

  if (isProduction || !isPreviewAuthorized) {
    return proc.contentStatus === 'PUBLISHED';
  }

  // In non-production authorized preview:
  // Allow PUBLISHED, DRAFT, and PENDING_APPROVAL with transparent notices.
  // Never expose ARCHIVED, REJECTED, or unknown statuses.
  return (
    proc.contentStatus === 'PUBLISHED' ||
    proc.contentStatus === 'DRAFT' ||
    proc.contentStatus === 'PENDING_APPROVAL'
  );
}

/**
 * Returns canonical procedures filtered by the active environment's publication policy.
 */
export function getVisibleProcedures(
  env: { nodeEnv?: string; previewMode?: string } = {}
): ProcedureDetail[] {
  return CANONICAL_PROCEDURES.filter((proc) => isProcedureVisibleInEnvironment(proc, env));
}

/**
 * Returns a specific canonical procedure by slug only if visible under the current publication policy.
 */
export function getVisibleProcedureBySlug(
  slug: string,
  env: { nodeEnv?: string; previewMode?: string } = {}
): ProcedureDetail | undefined {
  const proc = CANONICAL_PROCEDURES.find((p) => p.slug === slug);
  if (!proc) {
    return undefined;
  }
  return isProcedureVisibleInEnvironment(proc, env) ? proc : undefined;
}

/**
 * Returns canonical department by slug or code.
 */
export function getDepartmentBySlugOrCode(slugOrCode: string): DepartmentDto | undefined {
  return CANONICAL_DEPARTMENTS.find(
    (dept) => dept.slug === slugOrCode || dept.code.toLowerCase() === slugOrCode.toLowerCase()
  );
}

/**
 * Returns visible procedures belonging to a department by its code or slug.
 */
export function getVisibleProceduresByDepartment(
  deptSlugOrCode: string,
  env: { nodeEnv?: string; previewMode?: string } = {}
): ProcedureDetail[] {
  const dept = getDepartmentBySlugOrCode(deptSlugOrCode);
  if (!dept) {
    return [];
  }
  return getVisibleProcedures(env).filter((proc) => {
    if (proc.primaryDepartmentCode) {
      return proc.primaryDepartmentCode === dept.code;
    }
    return (
      proc.primaryDepartmentName.toLowerCase().includes(`(${dept.code.toLowerCase()})`) ||
      proc.primaryDepartmentName.toLowerCase() === dept.nameEn.toLowerCase()
    );
  });
}


