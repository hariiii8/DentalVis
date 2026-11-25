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

// ----------------------------------------------------------------------
// CLINICAL REVIEW BOARD (CRB) GOVERNANCE TAXONOMY & TYPES (M6.1.2)
// ----------------------------------------------------------------------
export * from './governance';
export * from './editorial';
export * from './repository';

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
  secondaryDepartmentCodes?: string[];
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
    secondaryDepartmentCodes: ["REST"],
    exploreCategorySlugs: ['pain-and-sensitivity'],
    governanceTier: 'TIER_2',
    contentStatus: 'PUBLISHED',
    overviewHtmlEn: '<p>Root canal treatment (endodontic therapy) is an established conservative procedure designed to relieve dental pain and salvage a natural tooth whose pulp tissue has become irreversibly inflamed or necrotic due to deep carious lesions, repeated restorations, or dental trauma.</p><p>During the procedure, the clinician accesses the pulp chamber under local anesthesia and dental dam isolation. Specialized endodontic instruments meticulously extirpate necrotic tissue, mechanically shape the complex root canal anatomy, and irrigate the internal chamber with antimicrobial solutions to eradicate bacterial biofilms. Following thorough disinfection and drying, the root canals are three-dimensionally obturated and hermetically sealed with a biocompatible material (gutta-percha) and an endodontic sealer to prevent microbial microleakage.</p><p>Following root canal therapy, endodontically treated posterior teeth are typically restored with a full-coverage crown to restore structural integrity, prevent coronal fracture, and ensure long-term masticatory function.</p>',
    overviewHtmlTa: '<p>வேர் கால்வாய் சிகிச்சை (Root Canal Treatment / Endodontic Therapy) என்பது ஆழமான பல் சொத்தை, விரிசல் அல்லது காயம் காரணமாக பல்லின் உள் நரம்புப் பகுதி (பல்ப்) தீவிர பாதிப்பிற்குள்ளாகும் போது, இயற்கை பல்லைப் பிடுங்காமல் பாதுகாப்பதற்காக செய்யப்படும் ஒரு மருத்துவ முறையாகும்.</p><p>இச்சிகிச்சையின் போது, வலி மரத்துப்போகும் மருந்து (Local Anesthesia) இடப்பட்டு, பல்லின் உள்ளே உள்ள பாதிக்கப்பட்ட அல்லது இறந்த நரம்புத் திசுக்கள் நுணுக்கமான கருவிகள் மூலம் முழுமையாக அகற்றப்படுகின்றன. பின்னர் வேர்க் கால்வாய்கள் கிருமிநாசினி திரவங்கள் கொண்டு தூய்மைப்படுத்தப்பட்டு, பாக்டீரியா தொற்று ஏற்படாதவாறு பாதுகாப்பான இயற்கை ரப்பர் போன்ற குட்டா-பர்ச்சா (Gutta-Percha) கலவை கொண்டு நிரப்பி சீல் செய்யப்படுகிறது.</p><p>சிகிச்சை முடிந்த பின், பலவீனமடைந்த இயற்கை பல் உடைந்துவிடாமல் பாதுகாக்கவும், வழக்கம்போல் உணவை மெல்லுவதற்கும் அப்பல்லின் மீது ஒரு பல் தொப்பி (Crown) பொருத்துவது அவசியமாகும்.</p>',
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
    secondaryDepartmentCodes: ["REST"],
    exploreCategorySlugs: ['broken-or-chipped-teeth'],
    governanceTier: 'TIER_2',
    contentStatus: 'PUBLISHED',
    overviewHtmlEn: '<p>A dental crown is an indirect full-coverage extra-coronal restoration custom-fabricated to encase the entire visible coronal portion of a compromised tooth above the gingival margin. It is indicated when a tooth has suffered extensive destruction from dental caries, trauma, large defective restorations, or following endodontic therapy where structural integrity is substantially diminished.</p><p>During treatment, the clinician circumferentially prepares and reduces the natural tooth structure with defined axial taper and smooth finish lines to provide adequate clearance and resistance form for restorative materials, such as zirconia, lithium disilicate (E-max), or porcelain-fused-to-metal (PFM). High-precision digital optical scans or elastomeric impressions capture the prepared tooth and opposing occlusion.</p><p>A temporary acrylic crown protects the prepared dentin while the dental laboratory fabricates the definitive restoration. Once fitted and evaluated for marginal fit, interproximal contacts, and harmonious occlusal balance, the permanent crown is adhesively bonded or resin-luted into place, restoring full physiological mastication and lifelike aesthetics.</p>',
    overviewHtmlTa: '<p>பல் தொப்பி (Dental Crown) என்பது அதிகப்படியான சொத்தை, விரிசல், பெரிய அடைப்புகள் அல்லது வேர் கால்வாய் சிகிச்சைக்குப் பின் பலவீனமடைந்த ஒரு பல்லை முழுமையாக மூடி பாதுகாப்பதற்காக தனிப்பயனாக்கப்பட்டு தயாரிக்கப்படும் ஒரு செயற்கை உறை ஆகும்.</p><p>சிகிச்சையின் போது, பல் மருத்துவர் இயற்கை பல்லின் வெளிப்புறத்தை ஒரு குறிப்பிட்ட அளவிற்கு மெலிதாக்கி, தொப்பி சரியாகப் பொருந்துவதற்கான இடத்தை உருவாக்குகிறார். பின்னர் பல்லின் அளவுகள் நவீன டிஜிட்டல் ஸ்கேன் அல்லது பிரத்யேக அச்சுகள் மூலம் எடுக்கப்பட்டு ஆய்வகத்திற்கு (Dental Lab) அனுப்பப்படுகின்றன. நிரந்தர தொப்பி தயாராகும் வரை பல் கூச்சம் ஏற்படாமல் இருக்க தற்காலிக தொப்பி பொருத்தப்படுகிறது.</p><p>இறுதி கட்டத்தில், பீங்கான் (Ceramic), சிர்கோனியா (Zirconia) அல்லது உலோகக் கலவையால் செய்யப்பட்ட வலிமையான நிரந்தர தொப்பி, பல்லின் இயற்கை நிறம் மற்றும் கடிக்கும் சமநிலையைச் சோதித்த பின்னர் பல்லோடு உறுதியாக ஒட்டப்படுகிறது. இது மெல்லும் திறனை மீட்டெடுப்பதுடன் இயற்கை பல்லின் ஆயுளைப் பல ஆண்டுகள் நீட்டிக்கிறது.</p>',
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
    secondaryDepartmentCodes: ["PREV"],
    exploreCategorySlugs: ['gums-and-bleeding'],
    governanceTier: 'TIER_2',
    contentStatus: 'PUBLISHED',
    overviewHtmlEn: '<p>Deep cleaning, clinically termed scaling and root planing (SRP), is the non-surgical cornerstone of periodontal therapy indicated for the treatment and management of active periodontitis and chronic gingival inflammation with pocket depths exceeding 4 mm.</p><p>Unlike routine supragingival prophylaxis, this meticulous therapeutic procedure is performed under local or topical anesthesia. The clinician systematically employs ultrasonic magnetostrictive/piezoelectric scalers alongside sharp manual periodontal curettes (such as Gracey curettes) to debride subgingival bacterial biofilm, tenacious calculus deposits, and endotoxin-laden cementum from the root surfaces beneath the gingival margin.</p><p>Root surfaces are smoothed (planed) to eliminate rough microbial niches, suppress pathogenic subgingival microflora, and facilitate physiological reattachment of healthy periodontal junctional epithelium to the root surface, effectively reducing clinical pocket depths and halting progressive periodontal bone resorption.</p>',
    overviewHtmlTa: '<p>ஆழமான பல் மற்றும் ஈறு தூய்மைப்படுத்தல் (Scaling & Root Planing) என்பது ஈறுகளின் அடியில் உள்ள ஆழமான பைகளில் (Periodontal Pockets) பாக்டீரியா கிருமிகள் மற்றும் கடினமான காரைப் படிவுகள் சேர்வதால் ஏற்படும் தீவிர ஈறு நோயைக் (Periodontitis) கட்டுப்படுத்த செய்யப்படும் மிக முக்கியமான அறுவைசிகிச்சையற்ற மருத்துவ முறையாகும்.</p><p>வழக்கமான பிரஷிங் அல்லது மேலோட்டமான கிளீனிங் மூலம் ஈறுகளின் ஆழத்தில் உள்ள காரையை அகற்ற முடியாது. இச்சிகிச்சையின் போது, மென்மையான வலி நிவாரண மருந்து இடப்பட்டு, அல்ட்ராசோனிக் அதிர்வுக் கருவிகள் மற்றும் நுணுக்கமான கியூரெட் (Curette) கருவிகள் மூலம் ஈறுகளுக்கு அடியில் வேர்ப்பகுதியில் படிந்துள்ள நச்சுப் படிவுகள் மற்றும் பாக்டீரியாக்கள் கவனமாக அகற்றப்படுகின்றன.</p><p>அதன்பின் வேரின் மேற்பரப்பு மென்மையாக்கப்படுவதால் (Root Planing), ஈறுகள் மீண்டும் வேரோடு இயற்கையாக இறுகி ஒட்டிக்கொள்ள வழிவகுக்கிறது. இது ஈறுகளில் ரத்தம் வடிதல், வீக்கம், துர்நாற்றம் மற்றும் பல்லைத் தாங்கும் எலும்பு தேய்மானத்தை தடுத்து பற்கள் ஆடுவதைத் தவிர்க்கிறது.</p>',
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
    secondaryDepartmentCodes: ["PROS","OMFS"],
    exploreCategorySlugs: ['missing-teeth'],
    governanceTier: 'TIER_2',
    contentStatus: 'PUBLISHED',
    overviewHtmlEn: '<p>A single dental implant is an advanced, biologically compatible prosthetic tooth replacement designed to restore an edentulous space without preparing or modifying adjacent healthy natural teeth. The implant system comprises three essential components: an endosseous titanium or zirconia fixture, an abutment, and a lifelike ceramic crown.</p><p>In the surgical phase, the precision osteotomy site is prepared in the alveolar bone under profound local anesthesia, and the threaded biocompatible fixture is inserted with controlled torque to achieve high primary mechanical stability. Over an uneventful healing interval typically spanning 8 to 12 weeks, vital osteoblasts deposit new bone matrix directly onto the micro-textured titanium surface in a physiological process known as osseointegration.</p><p>Following successful integration and soft-tissue maturation, a custom transmucosal abutment is secured to the fixture, upon which an aesthetic, shade-matched ceramic or zirconia crown is screw-retained or cemented. This provides permanent functional mastication, prevents neighboring teeth from tipping, and preserves local alveolar bone architecture against disuse resorption.</p>',
    overviewHtmlTa: '<p>தனிப்பல் இம்ப்ளான்ட் (Single Dental Implant) என்பது இழந்த பல்லுக்குப் பதிலாக அருகிலுள்ள ஆரோக்கியமான இயற்கை பற்களை தேய்க்கவோ மாற்றவோ தேவையின்றி, தாடை எலும்பில் பொருத்தப்படும் மிக நவீன மற்றும் நிரந்தர செயற்கைப் பல் சிகிச்சை முறையாகும். இதில் மூன்று முக்கிய பாகங்கள் உள்ளன: தாடை எலும்பினுள் பொருத்தப்படும் டைட்டானியம் திருகு (Fixture), நடு இணைப்பு பாகம் (Abutment) மற்றும் இயற்கை பல் போன்ற அழகான செராமிக் கிரவுன் (Crown).</p><p>முதல் கட்டத்தில், வலி மரத்துப்போகும் மருந்து இடப்பட்டு, பல் வேர் இருந்த தாடை எலும்பில் ஒரு சிறிய துவாரம் செய்யப்பட்டு, மருத்துவத் தரம் வாய்ந்த டைட்டானியம் திருகு மிகக் கவனமாகப் பொருத்தப்படுகிறது. அடுத்த 8 முதல் 12 வாரங்களில், தாடை எலும்பு செல்கள் இந்த டைட்டானியத்துடன் இயற்கையாக இணைந்து ஒன்றாக மாறும் ஆசியோஇன்டகிரேஷன் (Osseointegration) என்ற அற்புதம் நிகழ்கிறது.</p><p>எலும்புடன் முழுமையாக இணைந்த பிறகு, அதன் மேல் இணைப்பு பாகமும், அதனைத் தொடர்ந்து இயற்கை பல்லின் நிறம் மற்றும் வடிவில் உருவாக்கப்பட்ட பீங்கான் பல்லும் உறுதியாகப் பொருத்தப்படுகின்றன. இது மெல்லும் ஆற்றலை 100% மீட்டெடுப்பதுடன், அருகிலுள்ள பற்கள் சாய்வதைத் தடுத்து முக அமைப்பையும் தாடை எலும்பையும் தேய்மானத்திலிருந்து பாதுகாக்கிறது.</p>',
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
    secondaryDepartmentCodes: ["PREV"],
    exploreCategorySlugs: ['pain-and-sensitivity', 'broken-or-chipped-teeth'],
    governanceTier: 'TIER_2',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>Direct composite resin restorations provide a minimally invasive, tooth-colored approach to repairing tooth structure compromised by dental caries, minor traumatic fractures, or localized developmental enamel defects. Modern micro-hybrid and nano-filled composite materials combine synthetic dimethacrylate resins with silanized sub-micron glass and silica particles, mimicking the natural translucency, refractive index, and compressive strength of human enamel and dentin.</p><p>The clinical protocol begins with conservative removal of infected carious dentin while preserving all healthy, remineralizable tooth structure. Following mechanical cavity preparation, the enamel and dentin are conditioned using total-etch or self-etch adhesive protocols to create an optimal micro-mechanical hybrid zone. The composite resin is placed in incremental layers (typically 2 mm or less) to control polymerization shrinkage stresses, with each layer photo-polymerized using a calibrated high-intensity blue LED curing light.</p><p>Finally, the clinician articulates the occlusal anatomy with fine diamonds and polishing discs, restoring physiological chewing contacts and producing a high-luster, plaque-resistant surface that blends seamlessly with the natural dentition.</p>',
    overviewHtmlTa: '<p>காம்போசிட் அடைப்பு (Composite Dental Fillings) என்பது பல் சொத்தை, சிறிய விரிசல்கள் அல்லது உடைந்த எனாமல் பகுதிகளை பல்லின் இயற்கை நிறத்துடனேயே ஒன்றிணைந்து சரிசெய்யும் ஒரு நவீன மற்றும் பழமைவாத (Minimally Invasive) சிகிச்சை முறையாகும். பல்லின் ஆரோக்கியமான பகுதிகளை அதிகம் தேய்க்காமல், பாதிக்கப்பட்ட பகுதியை மட்டும் நீக்கிவிட்டு இந்த அடைப்பு செய்யப்படுகிறது.</p><p>சிகிச்சையின் போது, மருத்துவர் சொத்தையை முழுமையாகச் சுத்தம் செய்த பின்னர், பல்லின் மேற்பரப்பில் ஒரு நுண்ணிய பிணைப்பு ஜெல் (Etching & Bonding Primer) இடுகிறார். இதனைத் தொடர்ந்து, பல்லின் இயற்கை நிறத்திற்குப் பொருத்தமான நானோ-காம்போசிட் கலவை மெல்லிய அடுக்குகளாக பல்லின் குழியினுள் வைக்கப்படுகிறது. ஒவ்வொரு அடுக்கும் பிரத்யேக நீல நிற ஒளிக் கதிர் (Blue Curing Light) மூலம் சில வினாடிகளிலேயே உடனடியாகக் கெட்டியாக்கப்படுகிறது.</p><p>இறுதி கட்டத்தில், கடிக்கும் சமநிலை மற்றும் பல்லின் இயல்பான மேடு பள்ளங்கள் நுணுக்கமாகச் செதுக்கப்பட்டு, நாக்கால் தொடும் போது இயற்கை பல் போலவே வழுவழுப்பாக இருக்கும் வண்ணம் மெருகூட்டப்படுகிறது. இது நோயாளிகளுக்கு கண்ணுக்குத் தெரியாத வகையில் அழகான மற்றும் உறுதியான புன்னகையை வழங்குகிறது.</p>',
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
    secondaryDepartmentCodes: ["PERIO"],
    exploreCategorySlugs: ['gums-and-bleeding', 'dental-appearance'],
    governanceTier: 'TIER_1',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>Routine dental prophylaxis, commonly referred to as professional teeth cleaning and polishing, is a fundamental preventive periodontal procedure aimed at sustaining optimal oral health and preventing the onset or progression of plaque-induced gingivitis.</p><p>Even with conscientious daily oral hygiene, soft microbial biofilm continuously precipitates salivary minerals to form tenacious supragingival calculus (tartar), particularly on the lingual surfaces of mandibular incisors and buccal aspects of maxillary molars adjacent to major salivary duct orifices. Using gentle ultrasonic scalers with cool water lavage, the clinician removes hardened calculus deposits and biofilm from enamel surfaces above the gingival margin without damaging the underlying enamel prisms.</p><p>Following scaling, the tooth surfaces are polished using a slow-speed handpiece with a soft rubber prophylaxis cup and fine-grit fluoride paste. This smooths micro-surface roughness, eradicates extrinsic dietary chromogens (such as coffee, tea, or tobacco stains), and delays subsequent bacterial adherence, leaving the oral cavity clean, refreshed, and protected.</p>',
    overviewHtmlTa: '<p>வழக்கமான பல் சுத்தம் மற்றும் மெருகூட்டல் (Routine Prophylaxis & Polishing) என்பது ஈறு வீக்கம் (Gingivitis), பல் சொத்தை மற்றும் வாய் துர்நாற்றத்தை ஆரம்ப நிலையிலேயே தடுப்பதற்காக 6 மாதங்களுக்கு ஒருமுறை செய்யப்படும் ஒரு அடிப்படை தடுப்புச் சிகிச்சை முறையாகும்.</p><p>நாம் தினமும் பல் துலக்கினாலும், உமிழ்நீரில் உள்ள தாதுக்கள் சேர்ந்து பற்களின் மேற்பரப்பில் பிரஷிங் மூலம் நீக்க முடியாத கடினமான காரையாகவும் (Tartar/Calculus), உணவு மற்றும் டீ/காபியால் ஏற்படும் கறைகளாகவும் படியக்கூடும். இச்சிகிச்சையின் போது, குளிர்ந்த நீர் தெளிக்கும் மென்மையான அல்ட்ராசோனிக் அதிர்வுக் கருவிகள் மூலம் எனாமல் கீறப்படாமல் இந்த மேலோட்டமான படிவுகள் மிக எளிதாக அகற்றப்படுகின்றன.</p><p>அதன்பின், மென்மையான ரப்பர் கப் மற்றும் புத்துணர்ச்சியூட்டும் ஃபைன்-பாலிஷிங் பேஸ்ட் கொண்டு பற்களின் மேற்பரப்பு மெருகூட்டப்படுகிறது. இது பற்களை கண்ணாடி போல் வழவழப்பாக்கி மீண்டும் கிருமிகள் எளிதில் ஒட்டாமல் பாதுகாப்பதுடன், பற்களுக்கு புத்துணர்ச்சியூட்டும் தூய்மையைத் தருகிறது.</p>',
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
    secondaryDepartmentCodes: ["REST"],
    exploreCategorySlugs: ['missing-teeth'],
    governanceTier: 'TIER_2',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>Routine dental extraction entails the non-surgical exodontia of a natural tooth from its alveolar socket when the tooth is deemed non-restorable due to unrestorable subgingival caries, vertical root fractures, terminal periodontal attachment loss with excessive mobility, or severe impaction compromising neighboring structures.</p><p>The procedure is conducted under profound local infiltration or regional nerve block anesthesia, ensuring complete loss of pain sensation while preserving mild proprioceptive pressure awareness. The dental professional carefully severs the marginal periodontal ligament fibers using periotomes or straight dental luxators, applying controlled mechanical leverage along the long axis of the root. This gradually expands the elastic bony alveolar housing and facilitates delivery of the tooth using anatomically curved extraction forceps without fracturing the cortical plates.</p><p>Following extraction, the socket is thoroughly curetted to eliminate inflammatory granulation tissue, irrigated with sterile saline, and compressed with sterile gauze to foster a stable primary blood clot, setting the stage for physiologic socket healing or future prosthetic replacement.</p>',
    overviewHtmlTa: '<p>வழக்கமான பல் எடுத்தல் (Routine Tooth Extraction) என்பது ஆழமான சொத்தை, வேர் உடைவு, தீவிர ஈறு நோய் காரணமாக பல் அளவுக்கு அதிகமாக ஆடுதல் அல்லது வேர் கால்வாய் சிகிச்சை மூலம் காப்பாற்ற முடியாத பற்களை தாடை எலும்புக்கு சேதம் ஏற்படாமல் பாதுகாப்பாக அகற்றும் ஒரு அறுவைசிகிச்சையற்ற மருத்துவ முறையாகும்.</p><p>சிகிச்சைக்கு முன், பல் மற்றும் அதைச் சுற்றியுள்ள ஈறுகள் முழுமையாக மரத்துப்போகும் வகையில் பாதுகாப்பான அனஸ்தீசியா இடப்படுகிறது; இதனால் நோயாளிக்கு எவ்வித கூர்மையான வலியும் ஏற்படாது. மருத்துவர் பிரத்யேக மென்மையான கருவிகள் (Periotomes & Elevators) மூலம் பல்லைத் தாங்கும் வேர்ப்பகுதி நார் இழைகளைத் தளர்த்தி, தாடை எலும்பின் இயற்கை நெகிழ்வுத்தன்மையைப் பயன்படுத்தி பல்லை மிக மெதுவாக அகற்றி விடுகிறார்.</p><p>பல் எடுக்கப்பட்ட பின், அந்த இடம் தூய்மைப்படுத்தப்பட்டு, புதிய எலும்பு மற்றும் திசுக்கள் இயற்கையாக உருவாகும் பொருட்டு நிலையான ரத்தக்கட்டு (Blood Clot) உண்டாவதற்காக ஒரு பஞ்சு வைக்கப்படுகிறது. சில நாட்களில் காயம் ஆறி, எதிர்காலத்தில் அந்த இடத்தில் செயற்கைப் பல் அல்லது இம்ப்ளான்ட் பொருத்துவதற்கு தாடை தயாராகிறது.</p>',
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
    secondaryDepartmentCodes: [],
    exploreCategorySlugs: ['tooth-alignment'],
    governanceTier: 'TIER_2',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>Surgical extraction of an impacted third molar (wisdom tooth) is indicated when the tooth is prevented from erupting into functional anatomical alignment due to insufficient retromolar space, unfavorable angulation (mesioangular, horizontal, or distoangular), dense cortical bone obstruction, or aberrant root morphology. Partially erupted or impacted wisdom teeth frequently provoke localized pericoronitis, root resorption of adjacent second molars, periodontal pocketing, or dentigerous cyst formation.</p><p>The surgical intervention is carried out under profound regional nerve block anesthesia, frequently supplemented by conscious oral or intravenous sedation for patient comfort. The oral surgeon elevates a conservative mucoperiosteal flap and gently removes overlying alveolar bone using a chilled irrigation handpiece to gain direct visual access. The crown and roots are meticulously sectioned into smaller fragments using precise surgical burs, allowing conservative removal without excessive traction on the surrounding mandibular bone or risk of injury to the inferior alveolar and lingual neurovascular bundles.</p><p>After surgical debridement, the extraction socket is copiously decontaminated and reapproximated with fine resorbable sutures, promoting rapid primary wound healing and mitigating post-operative complications such as alveolar osteitis (dry socket).</p>',
    overviewHtmlTa: '<p>ஞானப்பல் அறுவை சிகிச்சை (Surgical Wisdom Tooth Extraction) என்பது தாடையின் கடைசிப் பகுதியில் போதிய இடமின்மை அல்லது சாய்வான வளர்ச்சி காரணமாக முழுமையாக முளைக்க முடியாமல் தாடை எலும்புக்குள் அல்லது ஈறுகளுக்குள் சிக்கிக்கொள்ளும் மூன்றாவது கடைவாய்ப் பற்களை அகற்றுவதற்கான அறுவை சிகிச்சை முறையாகும். இத்தகைய பற்கள் அருகிலுள்ள இரண்டாவது கடைவாய்ப் பல்லை அழுத்துவதோடு, ஈறுகளில் சீழ் பிடித்தல் (Pericoronitis), கடுமையான தாடை வலி மற்றும் தொற்றுக்கு வழிவகுக்கின்றன.</p><p>சிகிச்சையின் போது, வலி மரத்துப்போகும் மருந்து (Local Anesthesia) இடப்பட்டு, தேவைப்பட்டால் நோயாளிக்கு மன அமைதிக்கான மருந்துகளும் (Sedation) வழங்கப்படுகின்றன. தாடை எலும்பின் நரம்புகளுக்கு எவ்வித பாதிப்பும் ஏற்படாதவாறு, ஈறுகளில் ஒரு சிறிய துவாரம் செய்யப்பட்டு, சிக்கியுள்ள ஞானப்பல் நுணுக்கமான கருவிகள் மூலம் சிறு சிறு பகுதிகளாகப் பிரிக்கப்பட்டு மிகவும் பாதுகாப்பாக அகற்றப்படுகிறது.</p><p>பல் அகற்றப்பட்ட பின், கிருமிநாசினி கொண்டு தூய்மைப்படுத்தப்பட்டு, ஈறுகள் கரையக்கூடிய மெல்லிய தையல்கள் மூலம் மூடப்படுகின்றன. இது காயம் விரைவாக ஆற உதவுவதுடன், ரத்தக்கட்டு சீர்குலையாமல் (Dry Socket ஏற்படாமல்) நோயாளியை விரைவான குணமடைதலுக்கு இட்டுச் செல்கிறது.</p>',
    has3DModel: false,
    interactiveStepsCount: 4
  },

  // --------------------------------------------------------------------
  // 9. BATCH 1 ENRICHED: Fixed Metal & Ceramic Braces (ORTH) - Tier 2
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
    secondaryDepartmentCodes: ["PEDO"],
    exploreCategorySlugs: ['tooth-alignment'],
    governanceTier: 'TIER_2',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>Fixed orthodontic appliances comprise precision brackets (stainless steel or tooth-colored polycrystalline ceramic) bonded directly to the facial enamel surfaces, interconnected by sequential shape-memory archwires (nickel-titanium and beta-titanium). These appliances deliver continuous, controlled physiological forces across the periodontal ligament, inducing coupled bone remodeling (osteoclastic resorption on the pressure side and osteoblastic apposition on the tension side) to gradually translate, rotate, and level teeth into ideal arch form and balanced occlusion. Clinical management involves periodic adjustments every 4 to 8 weeks, meticulous plaque control to prevent enamel demineralization (white spot lesions), and long-term retention planning to maintain post-treatment stability.</p>',
    overviewHtmlTa: '<p>பல் கிளிப் சிகிச்சை (Fixed Braces) என்பது பற்களின் சீரற்ற வரிசை, அதிக இடைவெளி, அல்லது தவறான கடி அமைப்பை சரிசெய்ய உதவும் நவீன மருத்துவ முறையாகும். பற்களின் மேற்பரப்பில் பிராக்கெட்டுகள் பொருத்தப்பட்டு, மெல்லிய நிக்கல்-டைட்டானியம் அல்லது பீட்டா-டைட்டானியம் கம்பிகள் இணைக்கப்படுகின்றன. இக்கம்பிகள் பற்களின் வேர்ப்பகுதியைச் சுற்றியுள்ள எலும்பில் மென்மையான உயிரியல் அழுத்தத்தை ஏற்படுத்தி, பற்களை படிப்படியாக சரியான இடத்திற்கு நகர்த்துகின்றன. 4 முதல் 8 வாரங்களுக்கு ஒருமுறை கம்பிகள் சரிசெய்யப்படுகின்றன. சிகிச்சையின் போது பற்களைச் சுற்றி கறைகள் சேராமல் தூய்மையாகப் பராமரிப்பதும், சிகிச்சை முடிந்த பின் பற்கள் மீண்டும் நகராமல் இருக்க ரீடெய்னர் அணிவதும் மிக முக்கியமாகும்.</p>',
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
    summaryEn: 'Clinician-supervised oxidative bleaching treatment that lightens intrinsic and extrinsic enamel chromogens while safeguarding gingival tissues.',
    summaryTa: 'மருத்துவ மேற்பார்வையில் ஈறுகளைப் பாதுகாத்து எனாமல் கறைகளை நீக்கி பற்களை வெண்மையாக்கும் நவீன சிகிச்சை.',
    durationMinutes: 60,
    anesthesiaType: 'Gingival Barrier Protection / Non-Invasive',
    primaryDepartmentName: 'Cosmetic Dentistry – Smile Enhancement',
    primaryDepartmentCode: 'COSM',
    secondaryDepartmentCodes: [],
    exploreCategorySlugs: ['dental-appearance'],
    governanceTier: 'TIER_1',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>Professional in-office teeth whitening utilizes buffered hydrogen peroxide or carbamide peroxide formulations to oxidize organic chromophores located within enamel and dentinal tubules. Oxygen-free radicals chemically break conjugated double bonds of staining macromolecules into smaller, non-pigmented components. Prior to gel application, soft tissues are protected using light-cured resin gingival barriers or rubber dams to prevent chemical irritation. Potential post-operative pulpal sensitivity and gingival irritation are usually mild, transient, and self-limiting over several days. Whitening does not change the shade of existing resin composites, ceramic veneers, or crowns; restorative shade matching is evaluated following color stabilization.</p>',
    overviewHtmlTa: '<p>மருத்துவ மேற்பார்வையில் செய்யப்படும் தொழில்முறை பல் வெளுப்பாக்குதல் (In-Office Whitening) எனாமல் மற்றும் டென்டின் அடுக்குகளில் உள்ள ஆழ்ந்த கரிமக் கறைகளை ஆக்ஸிஜனேற்ற முறையில் நீக்குகிறது. ஹைட்ரஜன் பெராக்சைடு அல்லது கார்பமைடு பெராக்சைடு ஜெல் பயன்படுத்தப்படுவதற்கு முன்பு, ஈறுகள் பாதிக்கப்படாமல் இருக்க பிரத்யேக ஒளி-குணப்படுத்தும் ரெசின் தடுப்பு (Gingival Barrier) அல்லது ரப்பர் டேம் கொண்டு முழுமையாகப் பாதுகாக்கப்படுகின்றன. சிகிச்சைக்குப் பின் ஏற்படும் லேசான பல் கூச்சம் தற்காலிகமானது மற்றும் சில நாட்களில் சரியாகும். இந்த சிகிச்சை இயற்கையான பற்களுக்கு மட்டுமே பலனளிக்கும்; முன்பே உள்ள பற்காப்பு மூடிகள் (Crowns) அல்லது காம்போசிட் அடைப்புகளின் நிறத்தை இது மாற்றாது.</p>',
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
    secondaryDepartmentCodes: ["PEDO"],
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
    secondaryDepartmentCodes: ["PEDO"],
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
    secondaryDepartmentCodes: ["TMJD","REST","SLPA"],
    exploreCategorySlugs: ["broken-or-chipped-teeth","pain-and-sensitivity"],
    governanceTier: 'TIER_1',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>A custom night guard (occlusal splint) is an individually engineered dental orthotic prescribed to absorb, redistribute, and dissipate excessive parafunctional clenching and grinding forces during nocturnal bruxism. Fabricated from medical-grade thermoformed dual-laminate or heat-cured hard acrylic, the appliance creates a protective barrier between the maxillary and mandibular dental arches.</p><p>By discluding posterior teeth in eccentric jaw movements and establishing mutually protected occlusal contacts, the splint prevents progressive enamel attrition, abfraction lesions, and catastrophic cusp fractures. Furthermore, it decompresses the temporomandibular joints (TMJ) and reduces chronic hyperactivity in the masseter and temporalis musculature, alleviating morning jaw stiffness, facial tension, and bruxism-related tension cephalalgia.</p>',
    overviewHtmlTa: '<p>இரவு நேர பல் பாதுகாப்பு அட்டை (Custom Night Guard / Occlusal Splint) என்பது தூக்கத்தில் தங்களை அறியாமல் பற்களைக் கடிக்கும் அல்லது அரைக்கும் (Nocturnal Bruxism) பழக்கம் உள்ளவர்களுக்காக பிரத்யேகமாக வடிவமைக்கப்படும் ஒரு நவீன பல் மருத்துவ சாதனமாகும். இது மருத்துவத் தரம் வாய்ந்த கடினமான அக்ரிலிக் அல்லது மென்மையான இரட்டை அடுக்கு நெகிழிப் பொருட்களால் நோயாளியின் பற்களின் அளவுக்கு ஏற்ப துல்லியமாகத் தயாரிக்கப்படுகிறது.</p><p>மேல் மற்றும் கீழ் தாடைப் பற்களுக்கு இடையே இது ஒரு மெத்தை போன்ற பாதுகாப்புத் தடையாகச் செயல்பட்டு, பற்களின் எனாமல் தேய்மானம் அடைவதையும், விளிம்புகள் விரிசல் விழுந்து உடைவதையும் 100% தடுக்கிறது. மேலும், இது தாடை மூட்டுகளுக்கு (TMJ) ஏற்படும் அதீத அழுத்தத்தைக் குறைத்து, முகத் தசைகளை ஆசுவாசப்படுத்துகிறது. இதன் மூலம் காலையில் எழும்போது ஏற்படும் தாடை வலி, தலைவலி மற்றும் தசைப் பிடிப்புகள் பெருமளவில் நீங்குகின்றன.</p>',
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
    secondaryDepartmentCodes: ["EMRG","PEDO"],
    exploreCategorySlugs: ["broken-or-chipped-teeth"],
    governanceTier: 'TIER_1',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>A custom-fabricated athletic mouthguard provides superior impact dissipation and intraoral protection compared to over-the-counter stock or boil-and-bite alternatives. Custom-engineered from pressure-laminated layers of medical-grade ethyl vinyl acetate (EVA), the appliance is vacuum-adapted directly over an accurate stone model of the athlete\'s maxillary dentition.</p><p>This individual adaptation ensures uniform material thickness (typically 3 to 5 mm) across labial surfaces of vulnerable anterior teeth, alveolar ridges, and palatal contours. During high-velocity athletic collisions, the resilient elastomeric matrix absorbs blunt forces and disperses kinetic energy, significantly mitigating the incidence of crown fractures, root fractures, subluxations, complete tooth avulsions, and soft-tissue lacerations while maintaining an unobstructed airway for athletic performance.</p>',
    overviewHtmlTa: '<p>விளையாட்டு வீரர்களுக்கான பிரத்யேக பல் பாதுகாப்பு கவசம் (Custom Athletic Mouthguard) என்பது விளையாட்டுப் போட்டிகள் மற்றும் பயிற்சியின் போது முகத்தில் ஏற்படும் திடீர் மோதல்களிலிருந்து பற்கள், ஈறுகள் மற்றும் உதடுகளைப் பாதுகாப்பதற்காக பிரத்யேகமாக உருவாக்கப்படும் ஒரு மருத்துவக் கவசமாகும். கடைகளில் பொதுவாகக் கிடைக்கும் மலிவான வாய்க் கவசங்களை விட, இது நோயாளியின் மேல் தாடையின் சரியான அளவிற்கு ஏற்ப அழுத்தி வடிவமைக்கப்பட்ட எத்தில் வினைல் அசிட்டேட் (EVA) பல அடுக்குகளால் உருவாக்கப்படுகிறது.</p><p>இது பற்களின் மீது 3 முதல் 5 மிமீ தடிமனுடன் மிகச் சரியாகப் பொருந்துவதால், விளையாட்டின் போது மூச்சு விடுவதற்கோ அல்லது பேசுவதற்கோ எவ்வித தடையையும் ஏற்படுத்தாது. முகத்தில் பலமான அடிபடும் போது, ஏற்படும் அதிர்ச்சியை இக்கவசம் உள்வாங்கி பரவலாக்குகிறது; இதனால் முன் பற்கள் உடைவது, வேரிலிருந்து பெயர்ந்து விழுவது, தாடை எலும்பு முறிவடைவது மற்றும் உதடு அல்லது நாக்கு கிழிவது போன்ற தீவிர விளையாட்டு காயங்கள் பெருமளவில் தவிர்க்கப்படுகின்றன.</p>',
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
    secondaryDepartmentCodes: ["PROS"],
    exploreCategorySlugs: ["broken-or-chipped-teeth","pain-and-sensitivity"],
    governanceTier: 'TIER_2',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>Inlays and onlays represent precision indirect posterior restorations indicated when carious destruction, old failed restorations, or cusp fractures are too extensive for direct resin composites, yet sufficient sound peripheral enamel and axial dentin remain to render a full-coverage crown unnecessarily invasive.</p><p>An inlay restores intracoronal tooth structure situated strictly within the perimeter of the cuspal ridges, whereas an onlay caps and replaces one or more weakened functional or non-functional cusps to protect the tooth from shear and vertical cleavage forces. Fabricated from high-strength lithium disilicate glass-ceramics or composite resins using CAD/CAM milling or laboratory refractory dies, these restorations exhibit superior wear resistance and anatomical contouring.</p><p>The restorations are adhesively luted using dual-cure resin cements following strict enamel and dentin adhesive conditioning, restoring up to 90% of the tooth\'s pristine coronal stiffness while preserving vital cervical tooth structure.</p>',
    overviewHtmlTa: '<p>இன்லே மற்றும் ஆன்லே அடைப்புகள் (Inlays & Onlays) என்பது அதிகப்படியான சொத்தை அல்லது முறிவு காரணமாக வழக்கமான பல் அடைப்பால் சரிசெய்ய முடியாத, அதே சமயம் முழு பல் தொப்பி (Crown) போடுமளவிற்கு பல்லின் இயற்கை அமைப்பை அதிகம் தேய்க்க விரும்பாத நிலைகளில் செய்யப்படும் அதிநவீன மறைமுக பீங்கான் சிகிச்சை முறையாகும்.</p><p>இன்லே (Inlay) என்பது பல்லின் மையப் பகுதியில் உள்ள குழிகளை மட்டும் துல்லியமாக நிரப்புகிறது; ஆன்லே (Onlay) என்பது மெல்லும் போது அதிக அழுத்தம் தாங்க வேண்டிய பல்லின் மேடான சிகரப் பகுதிகளை (Cusps) முழுமையாக மூடி பாதுகாக்கிறது. இவை நவீன டிஜிட்டல் முறையில் ஸ்கேன் செய்யப்பட்டு, ஆய்வகத்தில் அதிவலிமை வாய்ந்த பீங்கான் கட்டிகளிலிருந்து செதுக்கப்படுகின்றன.</p><p>இறுதியில், பிரத்யேக பிசின் பசைகள் (Resin Cement) கொண்டு பல்லோடு வேதியியல் ரீதியாக உறுதியாக இணைக்கப்படுகின்றன. இது இயற்கை பல்லின் 90% வலிமையை மீட்டெடுப்பதுடன், நீண்ட காலம் நீடித்து உழைக்கும் அழகிய தீர்வாக அமைகிறது.</p>',
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
    secondaryDepartmentCodes: ["COSM"],
    exploreCategorySlugs: ["broken-or-chipped-teeth","dental-appearance"],
    governanceTier: 'TIER_1',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>Direct composite bonding is a conservative, chairside aesthetic and functional restorative procedure whereby micro-hybrid or nano-filled resin composites are meticulously layered and sculpted directly onto the prepared enamel substrate to correct anterior tooth imperfections in a single appointment.</p><p>The technique requires little to no removal of sound enamel. Instead, the superficial enamel surface is conditioned with 37% phosphoric acid gel to create microscopic microporosities, allowing unfilled liquid resin adhesive to penetrate and mechanically interlock with the enamel prisms. The clinician then layers shade-matched composite increments with varying opacities—opaque dentin shades beneath lifelike translucent enamel layers—to seamlessly recreate natural mammelons, incisal translucency, and light reflection.</p><p>Following polymerisation with a blue curing light, the restoration is sculpted and refined with fine-grit finishing diamonds, flexible aluminum-oxide discs, and diamond polishing pastes to achieve an enamel-like gloss that harmonizes perfectly with adjacent natural teeth.</p>',
    overviewHtmlTa: '<p>நேரடி காம்போசிட் பிணைப்பு சீரமைப்பு (Direct Composite Bonding) என்பது முன் பற்களில் உள்ள சிறிய இடைவெளிகள் (Diastema), உடைந்த பற்கள், தேய்மானம் அல்லது கறைகளை இயற்கை பல்லின் எனாமலைத் தேய்க்காமல், பல்லின் நிறத்திலேயே இருக்கும் நானோ-காம்போசிட் பிசின் கொண்டு ஒரே நாளில் அழகாக மாற்றியமைக்கும் ஒரு நவீன அழகியல் சிகிச்சையாகும்.</p><p>இச்சிகிச்சையில் இயற்கை பல்லின் அமைப்பிற்கு எவ்வித சேதமும் ஏற்படுவதில்லை. எனாமலின் மேற்பரப்பில் நுண்ணிய பிணைப்பு திரவம் (Bonding Agent) இடப்பட்டு, அதன்பின் பல் மருத்துவர் தனது கைவண்ணத்தால் பல அடுக்குகளாக காம்போசிட் கலவையை வைத்து பல்லின் இயற்கை வடிவம், ஒளி ஊடுருவும் தன்மை மற்றும் மேடு பள்ளங்களைச் செதுக்குகிறார்.</p><p>ஒவ்வொரு அடுக்கும் நீல நிற ஒளிக் கதிர் மூலம் நொடிகளில் கெட்டியாக்கப்பட்டு, பிரத்யேக மெருகூட்டும் கருவிகள் மூலம் இயற்கை பல்லைப் போன்ற பளபளப்பான கண்ணாடி மேற்பரப்பு உருவாக்கப்படுகிறது. இது நோயாளிகளுக்கு வலியில்லாத எளிய முறையில் ஒரே அமர்வில் வசீகரமான புன்னகையை மீட்டெடுக்கிறது.</p>',
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
    secondaryDepartmentCodes: ["ENDO"],
    exploreCategorySlugs: ["pain-and-sensitivity"],
    governanceTier: 'TIER_2',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>Direct and indirect pulp capping are biologically oriented vital pulp therapies indicated when deep carious demineralization or acute mechanical trauma encroaches upon or cleanly exposes vital dental pulp tissue, with the ultimate objective of preventing endodontic pulpectomy.</p><p>In indirect pulp capping, a micro-thin layer of affected, non-infected dentin adjacent to the pulp chamber is preserved, and a biocompatible calcium silicate or mineral trioxide aggregate (MTA) bioactive liner is placed to promote remineralization and tertiary tubular dentinogenesis while sealing off bacterial irritants. In direct pulp capping, where a pinpoint mechanical exposure of asymptomatic, vital pulp occurs in a sterile, dam-isolated field, the bioactive material is applied directly over the exposed odontoblasts and mesenchymal pulp cells.</p><p>The alkaline pH and calcium-ion release stimulate odontoblast differentiation and the secretion of a calcified reparative dentin bridge, preserving pulpal vitality, immunocompetence, and natural neurosensory feedback.</p>',
    overviewHtmlTa: '<p>நரம்பு பாதுகாப்பு சிகிச்சை (Direct & Indirect Pulp Capping) என்பது ஆழமான பல் சொத்தை அல்லது சிறிய விபத்தின் காரணமாக பல்லின் உள் நரம்புப் பகுதி (பல்ப்) பாதிக்கப்படும் விளிம்பில் இருக்கும் போது, பல்லின் உயிர்ச்சத்தை பாதுகாத்து வேர் கால்வாய் சிகிச்சை செய்ய வேண்டிய தேவையைத் தவிர்ப்பதற்காக செய்யப்படும் மிக முக்கியமான உயிரியல் சிகிச்சை முறையாகும்.</p><p>நேரடி சிகிச்சையில் (Direct Pulp Capping), நரம்பு சிறிய அளவில் வெளியில் தெரியும் போது, அதன் மீது மினரல் டிரையாக்சைடு அக்ரிகேட் (MTA) அல்லது கால்சியம் சிலிகேட் போன்ற நவீன உயிரி-தாது மருந்துகள் நேரடியாக வைக்கப்படுகின்றன. மறைமுக சிகிச்சையில் (Indirect Pulp Capping), நரம்பை சேதப்படுத்தாமல் அதன் மேல் உள்ள மெல்லிய எலும்புப் பகுதி மீது இம்மருந்து இடப்படுகிறது.</p><p>இம்மருந்து வெளியிடும் கால்சியம் தாதுக்கள் பல்லின் நரம்பு செல்களைத் தூண்டி, நரம்பின் மேல் இயற்கையான புதிய பாதுகாப்பு எலும்பு அடுக்கை (Reparative Dentin Bridge) உருவாக்கச் செய்கின்றன. இதனால் பல்லின் நரம்பு உயிருடன் பாதுகாக்கப்பட்டு, வலி நீங்கி இயற்கை பல் முழு ஆரோக்கியத்துடன் நீடிக்கிறது.</p>',
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
    secondaryDepartmentCodes: [],
    exploreCategorySlugs: ["pain-and-sensitivity"],
    governanceTier: 'TIER_2',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>Endodontic retreatment is indicated when a previously root canal-treated tooth exhibits secondary bacterial infection, persistent periapical radiolucencies, or chronic discomfort due to anatomical complexities, untreated accessory root canals, inadequate initial debridement, or delayed coronal microleakage past a compromised restoration.</p><p>Under dental operating microscope illumination and rubber dam isolation, the clinician disassembles the existing coronal restoration and removes old root-filling materials (such as gutta-percha and paste sealers) using specialized rotary nickel-titanium retreatment files and ultrasonic instruments. High-magnification visualization enables the detection of calcified canal orifices, lateral branching, and hidden root curvatures.</p><p>The root canal system is rigorously re-instrumented, chemically decontaminated using sonic or ultrasonic sodium hypochlorite irrigation, and often dressed with an interim antibacterial calcium hydroxide medication before definitive three-dimensional re-obturation with bioceramic sealer, restoring periapical bone health.</p>',
    overviewHtmlTa: '<p>மறு வேர் கால்வாய் சிகிச்சை (Endodontic Retreatment) என்பது ஏற்கனவே வேர் கால்வாய் சிகிச்சை செய்யப்பட்ட பல்லில், நுண் கால்வாய்கள் விடுபட்டதாலோ, பழைய அடைப்பில் விரிசல் ஏற்பட்டு மீண்டும் பாக்டீரியா கிருமிகள் புகுந்ததாலோ அல்லது வேர் முனையில் சீழ் மற்றும் வலி தொடரும் போதோ செய்யப்படும் இரண்டாம் கட்ட மேம்பட்ட சிகிச்சை முறையாகும்.</p><p>இச்சிகிச்சையின் போது, நவீன அறுவைசிகிச்சை மைக்ரோஸ்கோப் (Dental Operating Microscope) உதவியுடன், பல்லின் உள்ளே இருக்கும் பழைய குட்டா-பர்ச்சா அடைப்பு மற்றும் தொற்றுப் படிவுகள் அல்ட்ராசோனிக் கருவிகள் மூலம் கவனமாக அகற்றப்படுகின்றன. மிக நுண்ணிய அளவில் உள்ள மறைமுகக் கால்வாய்களும் கண்டறியப்பட்டு, சக்திவாய்ந்த கிருமிநாசினி திரவங்கள் கொண்டு முழுமையாகத் தூய்மைப்படுத்தப்படுகின்றன.</p><p>தொற்று முற்றிலும் நீக்கப்பட்ட பின்னர், மீண்டும் பாக்டீரியாக்கள் நுழையாத வண்ணம் அதிநவீன பயோ-செராமிக் சீலர் மற்றும் புதிய நிரப்பிகள் கொண்டு வேர்க் கால்வாய்கள் மறு சீல் செய்யப்படுகின்றன. இது நோயாளியின் இயற்கை பல்லைப் பிடுங்காமல் வாழ்நாள் முழுவதும் காப்பாற்ற உதவும் இறுதி மற்றும் மிகச் சிறந்த வாய்ப்பாகும்.</p>',
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
    secondaryDepartmentCodes: ["OMFS"],
    exploreCategorySlugs: ["pain-and-sensitivity"],
    governanceTier: 'TIER_2',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>An apicoectomy, or endodontic root-end microsurgery, is an advanced surgical intervention indicated when persistent or recurrent periapical inflammatory lesions and infections resist conventional orthograde root canal therapy or retreatment. Such refractory conditions frequently stem from complex apical anatomical variations, including apical deltas, lateral canal arborizations, broken instruments, or persistent extraradicular biofilms.</p><p>Under high-magnification surgical operating microscopy and illuminated field vision, the clinician reflects a conservative mucoperiosteal flap and creates a small cortical osteotomy window over the affected root apex. The infected apical 3 mm of the root tip—the anatomical reservoir housing over 90% of lateral canals and apical ramifications—is precisely resected with zero or minimal bevel to preserve root length and crown-to-root ratio.</p><p>The root canal lumen is then prepared retrograde to a depth of 3 mm using specialized ultrasonic tips, chemically decontaminated, and hermetically obturated with a bioactive hydraulic calcium silicate cement (such as MTA or bioceramic putty). This eliminates bacterial reservoirs, seals the apical portal of exit, and encourages complete osseous regeneration of the surrounding periapical alveolar bone.</p>',
    overviewHtmlTa: '<p>வேர் முனை நுண் அறுவை சிகிச்சை (Apicoectomy / Endodontic Microsurgery) என்பது வழக்கமான வேர் கால்வாய் சிகிச்சை அல்லது மறு சிகிச்சை மூலமும் குணப்படுத்த முடியாத தொடர் வேர் முனை தொற்று மற்றும் சீழ் கட்டிகளை ஈறுகளின் வழியாக அணுகி சரிசெய்யும் ஒரு நவீன நுண் அறுவை சிகிச்சை முறையாகும். வேரின் மிகக் கடைசி முனையில் உள்ள சிக்கலான நுண் கிளைகளில் பாக்டீரியாக்கள் பதுங்கியிருக்கும் போது இச்சிகிச்சை தேவைப்படுகிறது.</p><p>இச்சிகிச்சையின் போது, வலி மரத்துப்போகும் மருந்து இடப்பட்டு, அறுவைசிகிச்சை மைக்ரோஸ்கோப் (Dental Operating Microscope) வழிகாட்டலில் ஈறுகளில் ஒரு சிறிய சாளரம் போன்ற துவாரம் திறக்கப்படுகிறது. கிருமிகள் தங்கியுள்ள வேரின் கடைசி 3 மிமீ முனை கவனமாக வெட்டி அகற்றப்படுகிறது (Root-end Resection). பின்னர் அல்ட்ராசோனிக் கருவிகள் கொண்டு வேர் முனை உள்பக்கமாகத் தூய்மைப்படுத்தப்படுகிறது.</p><p>அதன்பின், உயிரியல் ரீதியாக எலும்புடன் இணையும் மினரல் டிரையாக்சைடு அக்ரிகேட் (MTA) அல்லது பயோ-செராமிக் சிமெண்ட் கொண்டு வேர் முனை கிருமி புகாத வண்ணம் பின்னோக்கி அடைக்கப்படுகிறது (Retrograde Filling). வெட்டப்பட்ட ஈறுகள் மெல்லிய தையல்கள் மூலம் மூடப்பட்டு, அடுத்த சில மாதங்களில் வேரைச் சுற்றிலும் புதிய தாடை எலும்பு இயற்கையாக வளர்ந்து பல் நிரந்தரமாகக் காப்பாற்றப்படுகிறது.</p>',
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
    secondaryDepartmentCodes: ["COSM"],
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
    secondaryDepartmentCodes: ["REST"],
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
    secondaryDepartmentCodes: ["COSM"],
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
    secondaryDepartmentCodes: ["PROS","REST"],
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
    secondaryDepartmentCodes: ["PEDO","ORTH"],
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
    secondaryDepartmentCodes: ["IMPL","PERIO"],
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
    secondaryDepartmentCodes: ["IMPL"],
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
    secondaryDepartmentCodes: ["IMPL"],
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
    secondaryDepartmentCodes: ["EMRG","ENDO"],
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
    secondaryDepartmentCodes: ["PROS"],
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
    secondaryDepartmentCodes: ["PROS","OMFS"],
    exploreCategorySlugs: ["missing-teeth"],
    governanceTier: 'TIER_3',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>Full-arch fixed implant rehabilitation is a comprehensive prosthodontic option for completely edentulous patients or those with terminal dentition. Treatment planning involves strategic distribution of endosseous implants—typically utilizing four, six, or more implants depending on arch morphology, bone volume, bone density, and opposing occlusal forces, with posterior implants occasionally angled to utilize available bone and avoid anatomical structures (such as the inferior alveolar canal or maxillary sinus). The definitive screw-retained prosthesis (fabricated from monolithic zirconia, metal-ceramic, or titanium-reinforced resin) provides fixed stability and functional restoration. Long-term success requires careful diagnostic evaluation, strict biomechanical distribution, and lifelong peri-implant hygiene maintenance.</p>',
    overviewHtmlTa: '<p>முழு தாடை இம்பிளான்ட் சீரமைப்பு (Full-Arch Implant Restoration) என்பது ஒரு தாடையில் உள்ள அனைத்து பற்களையும் இழந்தவர்களுக்கு நவீன முறையில் புதிய பற்கள் அமைக்கும் முழுமையான சிகிச்சையாகும். 3D டிஜிட்டல் திட்டமிடல் மூலம் தாடையில் 4 அல்லது 6 இம்பிளான்ட்டுகள் பொருத்தப்படுகின்றன. எலும்பு குறைவாக உள்ள இடங்களிலும் கூட சாய்வாக வைத்து உறுதியாக்க முடியும். இதன் மீது நிரந்தரமான மகுடப் பற்கள் கொண்ட முழு பாலம் திருகுகள் மூலம் அசைவின்றி பொருத்தப்படுகிறது. இது கழற்றி மாட்ட வேண்டிய அவசியமின்றி இயற்கையான பற்களைப் போன்றே மெல்லும் ஆற்றலை அளிக்கிறது.</p>',
    has3DModel: false,
    interactiveStepsCount: 4
  },

  // --------------------------------------------------------------------
  // 31. BATCH 4 NEW: Complete Removable Dentures (PROS) - Tier 1
  // --------------------------------------------------------------------
  {
    id: '33333333-3333-4333-a333-333333333331',
    slug: 'complete-removable-dentures',
    code: 'PROS-CRD-01',
    titleEn: 'Complete Removable Dentures',
    titleTa: 'முழுமையான செயற்கைப் பல் வரிசை (Complete Dentures)',
    summaryEn: 'Custom acrylic dental prostheses designed to replace an entire arch of missing teeth, restoring facial profile, speech, and mastication.',
    summaryTa: 'ஒரு தாடையில் உள்ள அனைத்து பற்களையும் இழந்தவர்களுக்கு தோற்றம், பேச்சு மற்றும் மெல்லும் திறனை மீட்டெடுக்கும் கழற்றி மாட்டும் முழு செயற்கைப் பல் வரிசை.',
    durationMinutes: 45,
    anesthesiaType: 'Non-Invasive / Impression Based',
    primaryDepartmentName: 'Prosthodontics – Dental Prosthetics',
    primaryDepartmentCode: 'PROS',
    secondaryDepartmentCodes: [],
    exploreCategorySlugs: ['missing-teeth'],
    governanceTier: 'TIER_1',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>Complete removable dentures are custom prostheses indicated for the rehabilitation of an edentulous maxillary or mandibular arch. Fabricated from biocompatible polymethyl methacrylate (PMMA) acrylic resin base and lifelike denture teeth, the prosthesis derives its support, stability, and retention from adaptation to the underlying residual alveolar ridge mucosa and palate, complemented by a peripheral mucosal seal, saliva film capillary action, and patient neuromuscular control. While masticatory efficiency is typically lower than natural dentition, properly fitted dentures restore functional mastication and smile aesthetics. Overnight removal is widely advised to allow soft-tissue rest and reduce the incidence of denture stomatitis; however, ongoing alveolar bone resorption is a multifactorial biological process influenced by general health, anatomical factors, and occlusal forces, requiring regular clinical recall, mucosal examinations, and periodic relining or adjustments.</p>',
    overviewHtmlTa: '<p>முழுமையான செயற்கைப் பல் வரிசை (Complete Removable Dentures) என்பது மேல் அல்லது கீழ் தாடையில் உள்ள அனைத்துப் பற்களையும் இழந்தவர்களுக்கு மீண்டும் பற்களை அமைக்கும் ஒரு பாரம்பரிய மருத்துவ முறையாகும். பயோகம்பேட்டிபிள் அக்ரிலிக் பிசினால் செய்யப்படும் இந்த செயற்கை பற்கள் தாடை எலும்பு மற்றும் ஈறுகளின் மீது பொருந்தி, முக அமைப்பை மேம்படுத்துவதுடன் உணவு உட்கொள்ளவும் பேசவும் உதவுகின்றன. இயற்கையான பற்களை விட மெல்லும் விசை குறைவாக இருந்தாலும், சரியான முறையில் தயாரிக்கப்பட்ட பற்கள் நல்ல பலனைத் தரும். ஈறுகளுக்கு ஓய்வளிக்கவும் பூஞ்சை தொற்று (Denture Stomatitis) வராமல் தடுக்கவும் இரவில் கழற்றி வைப்பது பொதுவான ஆலோசனையாகும். எனினும், தாடை எலும்பு தேய்மானம் என்பது பல காரணிகளைச் சார்ந்தது என்பதால், குறிப்பிட்ட கால இடைவெளியில் மருத்துவப் பரிசோதனை செய்வதும் பற்களை சரிசெய்து கொள்வதும் அவசியமாகும்.</p>',
    has3DModel: false,
    interactiveStepsCount: 4
  },

  // --------------------------------------------------------------------
  // 32. BATCH 4 NEW: Removable Partial Dentures (PROS) - Tier 1
  // --------------------------------------------------------------------
  {
    id: '33333333-3333-4333-a333-333333333332',
    slug: 'removable-partial-dentures',
    code: 'PROS-RPD-01',
    titleEn: 'Removable Partial Dentures',
    titleTa: 'பகுதி செயற்கைப் பல் வரிசை (Removable Partial Dentures)',
    summaryEn: 'Precision removable dental appliances combining a cast metal or flexible resin framework with clasps to restore one or multiple missing teeth.',
    summaryTa: 'சில பற்களை மட்டும் இழந்தவர்களுக்கு மீதமுள்ள இயற்கை பற்களின் ஆதரவுடன் கழற்றி மாட்டக்கூடிய வகையில் வடிவமைக்கப்படும் பகுதி செயற்கைப் பல் வரிசை.',
    durationMinutes: 45,
    anesthesiaType: 'Non-Invasive / Tooth Preparation',
    primaryDepartmentName: 'Prosthodontics – Dental Prosthetics',
    primaryDepartmentCode: 'PROS',
    secondaryDepartmentCodes: [],
    exploreCategorySlugs: ['missing-teeth'],
    governanceTier: 'TIER_1',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>Removable partial dentures (RPDs) replace one or more missing teeth in partially edentulous dental arches while preserving remaining natural teeth and oral structures. A conventional cast metal framework (cobalt-chromium alloy) incorporates major and minor connectors, direct retainers (clasps), and occlusal/cingulum rests that direct masticatory loads axially down the periodontal ligaments of sound abutment teeth. Acrylic saddles hold realistic prosthetic teeth over edentulous ridges. Careful surveyed design and abutment rest preparations distribute functional loads equitably between dentition and mucosal tissues while minimizing plaque trap niches.</p>',
    overviewHtmlTa: '<p>பகுதி செயற்கைப் பல் வரிசை (Removable Partial Dentures) என்பது ஒன்று அல்லது அதற்கு மேற்பட்ட பற்களை இழந்தவர்களுக்கு ஏற்ற எளிய தீர்வு ஆகும். உறுதியான கோபால்ட்-குரோமியம் உலோக சட்டம் அல்லது நெகிழ்வான பிசின் கொண்டு உருவாக்கப்படும் இந்த சாதனம், எஞ்சியிருக்கும் நல்ல பற்களின் மீது கிளிப்புகள் (clasps) மற்றும் ரெஸ்ட்கள் மூலம் தாங்கப்பட்டு நிலைநிறுத்தப்படுகிறது. இதன் மூலம் எஞ்சிய பற்கள் நகராமல் தடுக்கப்பட்டு மெல்லும் ஆற்றலும் முக அழகும் மீட்டெடுக்கப்படுகின்றன.</p>',
    has3DModel: false,
    interactiveStepsCount: 4
  },

  // --------------------------------------------------------------------
  // 33. BATCH 4 NEW: Full-Mouth Rehabilitation (PROS) - Tier 3
  // --------------------------------------------------------------------
  {
    id: '33333333-3333-4333-a333-333333333333',
    slug: 'full-mouth-rehabilitation',
    code: 'PROS-FMR-01',
    titleEn: 'Full-Mouth Rehabilitation',
    titleTa: 'முழு வாய் மறுசீரமைப்பு (Full-Mouth Rehabilitation)',
    summaryEn: 'Comprehensive multidisciplinary reconstruction of both dental arches to re-establish vertical dimension, balanced occlusion, and TMJ harmony.',
    summaryTa: 'கடுமையாக தேய்ந்த அல்லது சிதைந்த பற்களைக் கொண்டவர்களுக்கு தாடை எலும்பு மற்றும் மூட்டு இயக்கத்தை சீரமைத்து அனைத்து பற்களையும் மீளமைக்கும் முழுமையான சிகிச்சை.',
    durationMinutes: 120,
    anesthesiaType: 'Local Anesthesia as Required',
    primaryDepartmentName: 'Prosthodontics – Dental Prosthetics',
    primaryDepartmentCode: 'PROS',
    secondaryDepartmentCodes: ["TMJD","IMPL"],
    exploreCategorySlugs: ['missing-teeth', 'dental-appearance'],
    governanceTier: 'TIER_3',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>Full-mouth rehabilitation (full-mouth reconstruction) is an advanced, Tier 3 multidisciplinary prosthodontic discipline indicated for generalized, severe dental destruction arising from extensive attrition, erosion, trauma, or developmental defects. Because this procedure fundamentally alters occlusal relationships, careful diagnostic evaluation by a prosthodontic or restorative specialist is strongly indicated. Treatment sequencing is highly individualized: mounted diagnostic study casts, aesthetic-functional wax-ups, and a customized fixed provisionalization trial phase (often maintained over several weeks to months to verify patient phonetic, muscular, and temporomandibular joint tolerance) are employed before proceeding to definitive ceramic or zirconia crowns, onlays, and bridges. Reorganizing the vertical dimension and establishing stable centric contacts are tailored to the unique clinical presentation of each individual patient.</p>',
    overviewHtmlTa: '<p>முழு வாய் மறுசீரமைப்பு (Full-Mouth Rehabilitation) என்பது பற்கள் அதீதமாக தேய்ந்துவிட்டாலோ, உடைந்துவிட்டாலோ, அல்லது அமில அரிப்பால் சிதைந்துவிட்டாலோ ஒட்டுமொத்த பற்களையும் தாடை மூட்டுகளையும் (TMJ) ஒருங்கிணைத்து சீரமைக்கும் மிக உயர்தர (Tier 3) சிறப்பு மருத்துவ சிகிச்சையாகும். கடி அமைப்பை முழுமையாக மாற்றுவதால், ஒரு சிறப்பு பல் மருத்துவரின் (Prosthodontist) விரிவான பரிசோதனை மற்றும் ஆலோசனை மிகவும் அவசியமாகும். சிகிச்சையின் நிலைகளும் கால அளவும் ஒவ்வொரு நோயாளியின் தேவைக்கேற்ப தனிப்பயனாக்கப்படுகின்றன. தாடை இயக்கம் மற்றும் கடி விசை கணினியில் மாதிரி செய்யப்பட்டு, சில வாரங்கள் தற்காலிக மகுடங்கள் மூலம் பரிசோதிக்கப்படுகிறது; நோயாளிக்கு வலி அல்லது சிரமம் ஏதுமின்றி பழக்கப்பட்ட பின்னரே நிரந்தரமான பீங்கான் அல்லது ஜிர்கோனியா மகுடங்கள் பொருத்தப்படுகின்றன.</p>',
    has3DModel: false,
    interactiveStepsCount: 5
  },

  // --------------------------------------------------------------------
  // 34. BATCH 4 NEW: Clear Aligners (ORTH) - Tier 2
  // --------------------------------------------------------------------
  {
    id: '33333333-3333-4333-a333-333333333334',
    slug: 'clear-aligners',
    code: 'ORTH-ALN-01',
    titleEn: 'Clear Aligners',
    titleTa: 'கண்ணுக்குத் தெரியாத பல் கிளிப்புகள் (Clear Aligners)',
    summaryEn: 'Removable, transparent thermoformed polyurethane trays engineered with CAD/CAM precision to gradually shift teeth without metal brackets.',
    summaryTa: 'மெட்டல் பிராக்கெட்டுகள் இன்றி பற்களை நேராக்க உதவும் கழற்றி மாட்டக்கூடிய நவீன ஒளிபுகும் பிளாஸ்டிக் அலைனர்கள்.',
    durationMinutes: 30,
    anesthesiaType: 'Non-Invasive / Digital Scanning',
    primaryDepartmentName: 'Orthodontics – Braces & Teeth Alignment',
    primaryDepartmentCode: 'ORTH',
    secondaryDepartmentCodes: ["COSM"],
    exploreCategorySlugs: ['tooth-alignment', 'dental-appearance'],
    governanceTier: 'TIER_2',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>Clear aligners are custom-manufactured, transparent medical-grade thermoplastic trays that incrementally reposition teeth through a computer-planned biomechanical sequence. Based on high-resolution 3D intraoral scans and virtual treatment simulations, teeth receive calibrated orthodontic displacement forces with each consecutive tray worn for 1 to 2 weeks as prescribed by the orthodontist. Tooth-colored composite attachments and interproximal reduction (IPR) are utilized selectively when clinically indicated to facilitate complex rotational or root movements. Aligners are completely removable for eating, drinking non-water beverages, and oral hygiene; achieving intended outcomes relies heavily on following clinical wear guidance (typically 20 to 22 hours per day), with final alignment subject to individual biological response.</p>',
    overviewHtmlTa: '<p>கண்ணுக்குத் தெரியாத கிளியர் அலைனர்கள் (Clear Aligners) என்பது பற்களை நேராக்குவதற்கான நவீன டிஜிட்டல் தொழில்நுட்பமாகும். 3D ஸ்கேன் அடிப்படையில் கணினியில் திட்டமிடப்பட்டு உருவாக்கப்படும் ஒளிபுகும் பிளாஸ்டிக் தட்டுகள் ஒவ்வொரு பல்லையும் படிப்படியாக நகர்த்துகின்றன. சிக்கலான பல் அசைவுகளுக்கு தேவைப்படும் போது மட்டும் பல்லின் நிறத்திலேயே சிறிய தாங்கிகள் (Attachments) பொருத்தப்படுகின்றன. வழக்கமான உலோகக் கம்பிகள் போலல்லாமல், இவற்றை சாப்பிடும்போதும் பல் துலக்கும்போதும் எளிதாகக் கழற்றி மாட்ட முடியும். மருத்துவர் பரிந்துரைத்தபடி தினமும் 20 முதல் 22 மணி நேரம் அணிவது சிறந்தது என்றாலும், சிகிச்சையின் இறுதி முடிவு ஒவ்வொருவரின் உடல் மற்றும் எலும்பு இயல்புக்கு ஏற்ப மாறுபடலாம்.</p>',
    has3DModel: false,
    interactiveStepsCount: 4
  },

  // --------------------------------------------------------------------
  // 35. BATCH 4 NEW: Palatal Expander (ORTH) - Tier 2
  // --------------------------------------------------------------------
  {
    id: '33333333-3333-4333-a333-333333333335',
    slug: 'palatal-expander',
    code: 'ORTH-EXP-01',
    titleEn: 'Rapid Palatal Expander',
    titleTa: 'மேல்தாடை விரிவாக்கும் சாதனம் (Palatal Expander)',
    summaryEn: 'Orthodontic skeletal appliance anchored to maxillary molars that widens the narrow upper arch and corrects posterior crossbites in growing patients.',
    summaryTa: 'வளரும் குழந்தைகளுக்கு குறுகிய மேல் தாடையை விரிவுபடுத்தி பற்கள் வரிசையாக முளைக்க இடம் தரும் எலும்பு விரிவாக்க சாதனம்.',
    durationMinutes: 45,
    anesthesiaType: 'Non-Invasive / Band Fitting',
    primaryDepartmentName: 'Orthodontics – Braces & Teeth Alignment',
    primaryDepartmentCode: 'ORTH',
    secondaryDepartmentCodes: ["PEDO"],
    exploreCategorySlugs: ['tooth-alignment'],
    governanceTier: 'TIER_2',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>A rapid maxillary expander (RME/RPE) is a dentofacial orthopedic appliance designed to correct transverse maxillary deficiency and posterior crossbites. Anchored to maxillary molars via custom bands or acrylic splints, the central jackscrew delivers lateral orthopedic forces that open the midpalatal suture. Skeletal expansion is most predictable during pre-pubertal or early adolescent stages prior to suture interdigitation; as skeletal maturity advances, resistance increases, and skeletally mature adolescents or adults may require alternative or surgically assisted techniques (e.g., MARPE or SARPE). Routine protocols involve calibrated daily turn-activations over several weeks, often accompanied by a temporary central incisor space, followed by 3 to 6 months of passive retention to permit bone deposition and mineralization.</p>',
    overviewHtmlTa: '<p>மேல்தாடை விரிவாக்கும் சாதனம் (Rapid Palatal Expander) என்பது குறுகலான மேல் தாடை எலும்பை விரிவுபடுத்தும் ஒரு சிறப்பு ஆர்த்தோடான்டிக் சாதனமாகும். மேல் தாடை கடவாய்ப் பற்களின் மீது பொருத்தப்படும் இந்த சாதனத்தில் உள்ள சிறிய திருகை மருத்துவர் ஆலோசனைப்படி திருப்புவதன் மூலம் மேல் தாடையின் நடு எலும்புப் பிளவு விரிக்கப்படுகிறது. குழந்தைகளின் எலும்பு வளர்ச்சி முழுமையடையாத பருவத்தில் (Pre-pubertal) இது மிகச் சிறப்பாக செயல்படுகிறது; எலும்பு முதிர்ச்சியடைந்த பெரியவர்களுக்கு அறுவை சிகிச்சை அல்லது நுண்-இம்பிளான்ட் (MARPE/SARPE) முறைகள் தேவைப்படலாம். விரிவடைந்த எலும்பு இடைவெளியில் புதிய எலும்பு உறுதியாக உருவாக சில மாதங்கள் நிலைநிறுத்துதல் அவசியமாகும்.</p>',
    has3DModel: false,
    interactiveStepsCount: 4
  },

  // --------------------------------------------------------------------
  // 36. BATCH 4 NEW: Orthodontic Retainers (ORTH) - Tier 1
  // --------------------------------------------------------------------
  {
    id: '33333333-3333-4333-a333-333333333336',
    slug: 'orthodontic-retainers',
    code: 'ORTH-RET-01',
    titleEn: 'Orthodontic Retainers',
    titleTa: 'பல் சீரமைப்பு தக்கவைக்கும் சாதனம் (Orthodontic Retainers)',
    summaryEn: 'Custom removable or bonded fixed retention appliances that stabilize teeth in their corrected positions while periodontal fibers and bone remodel.',
    summaryTa: 'கிளிப் சிகிச்சை முடிவடைந்த பின் பற்கள் மீண்டும் பழைய நிலைக்குத் திரும்புவதைத் தடுத்து வரிசையை நிலைநிறுத்தும் ரீடெய்னர் சாதனம்.',
    durationMinutes: 30,
    anesthesiaType: 'Non-Invasive / Fitting or Bonding',
    primaryDepartmentName: 'Orthodontics – Braces & Teeth Alignment',
    primaryDepartmentCode: 'ORTH',
    secondaryDepartmentCodes: [],
    exploreCategorySlugs: ['tooth-alignment'],
    governanceTier: 'TIER_1',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>Orthodontic retainers are custom-fabricated dental appliances indicated for post-treatment stability following active orthodontic correction. Tooth movement alters periodontal and supra-alveolar gingival fibers, which undergo gradual remodeling over several months, while ongoing physiologic aging continues to exert subtle forces throughout life. Retainers are provided as removable devices (vacuum-formed clear thermoplastic trays or acrylic-and-wire Hawley retainers) or fixed bonded appliances (braided stainless steel wire bonded lingually to anterior teeth). Retention regimens are individualized based on initial malocclusion, periodontal health, and patient factors; while long-term maintenance is commonly advised to minimize relapse tendency, no retention modality provides an unconditional guarantee against minor natural positional changes.</p>',
    overviewHtmlTa: '<p>பல் சீரமைப்பு தக்கவைக்கும் சாதனம் (Orthodontic Retainers) என்பது கிளிப் சிகிச்சை முடிந்த பிறகு பற்கள் மீண்டும் பழைய நிலைக்குத் திரும்புவதைக் (Relapse) குறைக்க உதவும் சாதனமாகும். பற்களைச் சுற்றியுள்ள தசை நார்கள் புதிய நிலையில் நிலைபெற காலம் தேவைப்படுவதுடன், வயது முதிர்வு காரணமாகவும் பற்களில் லேசான மாற்றங்கள் இயற்கையாக நிகழலாம். ஒளிபுகும் கழற்றி மாட்டக்கூடிய தட்டுகள் அல்லது பற்களின் உட்புறம் ஒட்டப்படும் மெல்லிய கம்பிகள் (Fixed Retainers) மூலம் பற்கள் பாதுகாக்கப்படுகின்றன. ஒவ்வொரு நோயாளியின் பல் அமைப்புக்கேற்ப ரீடெய்னர் அணியும் முறைகள் மாறுபடும்; இது பற்களின் நிலையை பெருமளவு தக்கவைத்தாலும், வாழ்நாள் முழுவதும் சிறிய மாற்றங்கள் கூட ஏற்படாது என்பதற்கான முழு உத்தரவாதம் அல்ல.</p>',
    has3DModel: false,
    interactiveStepsCount: 3
  },

  // --------------------------------------------------------------------
  // 37. BATCH 4 NEW: Pediatric Pulpotomy (PEDO) - Tier 2
  // --------------------------------------------------------------------
  {
    id: '33333333-3333-4333-a333-333333333337',
    slug: 'pediatric-pulpotomy',
    code: 'PEDO-PUL-01',
    titleEn: 'Pediatric Pulpotomy',
    titleTa: 'குழந்தைகளுக்கான பால் பல் நரம்பு சிகிச்சை (Pediatric Pulpotomy)',
    summaryEn: 'Coronal pulp amputation in a decayed vital primary tooth to remove inflamed pulp tissue while preserving healthy root vitality and tooth longevity.',
    summaryTa: 'ஆழமான சொத்தை உள்ள பால் பல்லின் மேற்பகுதி நரம்பை மட்டும் அகற்றி, வேர்ப் பகுதியை ஆரோக்கியமாகப் பாதுகாக்கும் சிறார் பல் சிகிச்சை.',
    durationMinutes: 45,
    anesthesiaType: 'Local Anesthesia',
    primaryDepartmentName: 'Pediatric Dentistry – Milk Teeth & Children',
    primaryDepartmentCode: 'PEDO',
    secondaryDepartmentCodes: ["ENDO"],
    exploreCategorySlugs: ['pain-and-sensitivity'],
    governanceTier: 'TIER_2',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>A pediatric pulpotomy is a vital pulp therapy (VPT) procedure indicated for primary teeth with deep carious lesions exhibiting normal pulp or reversible coronal pulpitis, where the radicular pulp remains healthy and vital. Vital therapies are strictly distinguished from non-vital interventions (such as pulpectomy or extraction), which are necessary if necrosis or irreversible inflammation is present. Accurate diagnosis and careful case selection are essential; deeply decayed primary teeth without pulp exposure may alternatively be managed with indirect pulp treatment (IPT). When pulpotomy is indicated, the diseased coronal pulp is amputated under local anesthesia and moisture isolation. Radicular hemostasis is achieved with sterile moistened pellets, and a biocompatible bioactive capping material—preferentially calcium-silicate cements such as mineral trioxide aggregate (MTA) or biodentine—is placed over the root canal orifices. Following therapy, providing a durable, hermetic coronal seal is critical to prevent bacterial microleakage; while preformed stainless steel crowns (SSCs) are commonly placed for multi-surface cavities, the definitive coronal restoration is selected based on remaining tooth structure and time to natural exfoliation.</p>',
    overviewHtmlTa: '<p>குழந்தைகளுக்கான பால் பல் நரம்பு சிகிச்சை (Pediatric Pulpotomy) என்பது ஆழ்ந்த சொத்தையால் பாதிக்கப்பட்ட ஆனால் வேர்ப்பகுதி நரம்புகள் உயிருடன் உள்ள (Vital Pulp) பால் பற்களைப் பாதுகாக்கும் சிறப்பு மருத்துவ முறையாகும். நரம்பு முற்றிலும் செயலிழந்த பற்களுக்கு செய்யப்படும் வேர் சிகிச்சை (Pulpectomy) அல்லது பல் பிடுங்குதல் போன்ற முறைகளில் இருந்து இது முற்றிலும் வேறுபட்டதாகும். சரியான பரிசோதனை மற்றும் பல்லின் நிலையைத் தேர்ந்தெடுப்பது மிக முக்கியம்; நரம்பு வெளிப்படாத சில ஆழ்ந்த சொத்தைகளுக்கு மறைமுக நரம்பு சிகிச்சை (IPT) போதுமானது. பல்போட்டமி தேவைப்படும் போது, பல்லின் மேற்பகுதியில் உள்ள பாதிக்கப்பட்ட நரம்பு மட்டும் அகற்றப்பட்டு, இரத்தக் கசிவு நிறுத்தப்படுகிறது. பின்னர் எம்.டி.ஏ (MTA) போன்ற நவீன பயோசெராமிக் கால்சியம்-சிலிகேட் மருந்துகள் வைக்கப்படுகின்றன. பாக்டீரியா மீண்டும் புகாமல் தடுக்க பல்லின் மேல் உறுதியான சீல் வைக்கப்படுகிறது; பல பரப்புகளில் சொத்தை உள்ள பற்களுக்கு எஃகு மகுடம் (Crown) பொருத்தப்பட்டாலும், பல்லின் மீதமுள்ள அமைப்புக்கு ஏற்ப தகுந்த நிரந்தர மூடி தேர்வு செய்யப்படுகிறது.</p>',
    has3DModel: false,
    interactiveStepsCount: 4
  },

  // --------------------------------------------------------------------
  // 38. BATCH 4 NEW: Pediatric Stainless Steel Crowns (PEDO) - Tier 1
  // --------------------------------------------------------------------
  {
    id: '33333333-3333-4333-a333-333333333338',
    slug: 'pediatric-stainless-steel-crowns',
    code: 'PEDO-SSC-01',
    titleEn: 'Pediatric Stainless Steel Crowns',
    titleTa: 'குழந்தைகளுக்கான எஃகு மகுடம் (Stainless Steel Crowns)',
    summaryEn: 'Durable preformed metal crowns providing 360-degree coronal protection for heavily decayed or pulp-treated primary molar teeth.',
    summaryTa: 'கடுமையாக சொத்தையான அல்லது நரம்பு சிகிச்சை செய்யப்பட்ட பால் பற்களை முழுமையாக மூடிப் பாதுகாக்கும் எஃகு மகுடம்.',
    durationMinutes: 40,
    anesthesiaType: 'Local Anesthesia as Required',
    primaryDepartmentName: 'Pediatric Dentistry – Milk Teeth & Children',
    primaryDepartmentCode: 'PEDO',
    secondaryDepartmentCodes: ["REST"],
    exploreCategorySlugs: ['broken-or-chipped-teeth'],
    governanceTier: 'TIER_1',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>Pediatric stainless steel crowns (preformed metal crowns) are an established, highly durable restorative therapy for primary molars affected by extensive multi-surface carious lesions, high caries risk, developmental enamel defects, or following vital pulp therapy (pulpotomy or pulpectomy). Fabricated from ductile medical-grade austenitic stainless steel alloys, these preformed crowns offer superior clinical longevity and lower retreatment rates compared to multi-surface intracoronal restorations. Placement may be performed via conventional tooth preparation—conservative occlusal reduction and interproximal contact slicing—or, in specifically selected non-cavitated and asymptomatic cases, via the Hall Technique without local anesthesia or tooth reduction. The crown is contoured, crimped at the cervical margin, and cemented with bioactive glass ionomer cement to provide a 360-degree coronal seal protecting the tooth until natural exfoliation.</p>',
    overviewHtmlTa: '<p>குழந்தைகளுக்கான எஃகு மகுடம் (Pediatric Stainless Steel Crowns) என்பது பல பரப்புகளில் சொத்தை உள்ள அல்லது நரம்பு சிகிச்சை செய்யப்பட்ட பால் பற்களுக்கு வழங்கப்படும் நீடித்த பாதுகாப்பு கவசமாகும். மருத்துவத் தர எஃகினால் செய்யப்படும் இந்த மகுடங்கள், வழக்கமான அடைப்புகளை விட அதிக ஆயுள் கொண்டவை. பல்லின் அளவைக் குறைத்து பொருத்தும் வழமையான முறை அல்லது தேர்ந்தெடுக்கப்பட்ட சில நிலைகளில் பல்லில் ஊசி போடாமலும் துளையிடாமலும் நேரடியாக மகுடம் பொருத்தும் ஹால் டெக்னிக் (Hall Technique) மூலமும் இவை பொருத்தப்படலாம். கிளாஸ் அயோனோமர் சிமெண்ட் கொண்டு ஒட்டப்படும் இந்த மகுடம், இயற்கையாக பால் பற்கள் விழும் காலம் வரை மீண்டும் சொத்தை வராமல் பல்லிற்கு முழுப் பாதுகாப்பு அளிக்கிறது.</p>',
    has3DModel: false,
    interactiveStepsCount: 4
  },

  // --------------------------------------------------------------------
  // 39. BATCH 4 NEW: Pediatric Space Maintainers (PEDO) - Tier 1
  // --------------------------------------------------------------------
  {
    id: '33333333-3333-4333-a333-333333333339',
    slug: 'pediatric-space-maintainers',
    code: 'PEDO-SPM-01',
    titleEn: 'Pediatric Space Maintainers',
    titleTa: 'இடைவெளி பாதுகாக்கும் சாதனம் (Pediatric Space Maintainers)',
    summaryEn: 'Custom fixed or removable dental appliances that preserve the arch space of prematurely lost primary teeth so permanent teeth erupt without impaction.',
    summaryTa: 'பால் பல் முன்கூட்டியே விழுந்துவிட்டால் நிரந்தரப் பல் முளைக்கும் வரை அந்த இடைவெளியை அப்படியே தக்கவைக்கும் சிறார் பல் சாதனம்.',
    durationMinutes: 35,
    anesthesiaType: 'Non-Invasive / Band Fitting',
    primaryDepartmentName: 'Pediatric Dentistry – Milk Teeth & Children',
    primaryDepartmentCode: 'PEDO',
    secondaryDepartmentCodes: ["ORTH"],
    exploreCategorySlugs: ['tooth-alignment'],
    governanceTier: 'TIER_1',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>Pediatric space maintainers are fixed or removable appliances designed to preserve dental arch perimeter and leeway space following the premature loss of primary molars. Not every premature loss mandates an appliance; clinical decisions depend on the child’s dental development stage, specific tooth lost, radiographic root development of the permanent successor, available arch length, and existing occlusion. When indicated, appliances such as the unilateral band-and-loop, mandibular lingual holding arch, or maxillary Nance appliance passively maintain space to prevent adjacent molars from tipping mesially and blocking successor eruption. Because evidence demonstrates both benefits and clinical limitations, regular follow-up is essential to monitor for plaque accumulation, caries on anchor teeth, soft-tissue impingement, cement failure, and to ensure timely removal as the adult premolar erupts.</p>',
    overviewHtmlTa: '<p>இடைவெளி பாதுகாக்கும் சாதனம் (Pediatric Space Maintainers) என்பது பால் கடவாய்ப் பற்கள் முன்கூட்டியே விழுந்துவிட்டால் நிரந்தரப் பல் முளைப்பதற்கான இடைவெளியைப் பாதுகாக்கப் பயன்படும் சாதனமாகும். பால் பல் விழுந்த எல்லா குழந்தைகளுக்கும் இந்த சாதனம் தேவைப்படுவதில்லை; குழந்தையின் பல் வளர்ச்சி நிலை, அடியில் வளரும் நிரந்தரப் பல்லின் வேர் வளர்ச்சி, மற்றும் தாடையில் உள்ள இடம் ஆகியவற்றைப் பொறுத்தே மருத்துவர் இதைத் தீர்மானிக்கிறார். தேவைப்படும் போது வளையம் மற்றும் கம்பி சாதனம் மூலம் இடைவெளி பராமரிக்கப்படுகிறது. எனினும், பற்களில் கறை சேருதல், சொத்தை வருதல் அல்லது கம்பி உடைதல் போன்ற சிக்கல்களைத் தவிர்க்கவும், புதிய நிரந்தரப் பல் வெளிவரும் போது சரியான நேரத்தில் சாதனத்தை அகற்றவும் தொடர்ச்சியான மருத்துவப் பரிசோதனை அவசியமாகும்.</p>',
    has3DModel: false,
    interactiveStepsCount: 3
  },

  // ------------------------------
  // 42. Custom Porcelain Veneers (COSM-VEN-01) - Canonical Position #42
  // ------------------------------
  {
    id: '33333333-3333-4333-a333-333333333342',
    slug: 'porcelain-veneers',
    code: 'COSM-VEN-01',
    titleEn: 'Custom Porcelain Veneers',
    titleTa: 'பீங்கான் வெனியர்கள் (Custom Porcelain Veneers)',
    summaryEn: 'Ultra-thin, custom-fabricated ceramic facings adhesively bonded to anterior teeth to enhance morphology, alignment, and aesthetic shade.',
    summaryTa: 'பற்களின் வடிவம், சீரமைப்பு மற்றும் நிறத்தை இயற்கையாக மேம்படுத்த முன்பற்களின் மேல் பொருத்தப்படும் மெல்லிய பீங்கான் கவசங்கள்.',
    durationMinutes: 75,
    anesthesiaType: 'Local Infiltration (as indicated) / Enamel Conditioning',
    primaryDepartmentName: 'Cosmetic Dentistry – Smile Enhancement',
    primaryDepartmentCode: 'COSM',
    secondaryDepartmentCodes: ["PROS"],
    exploreCategorySlugs: ['dental-appearance'],
    governanceTier: 'TIER_2',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>Custom porcelain veneers are delicate, laboratory-fabricated ceramic laminate shells adhesively bonded to the facial surfaces of anterior teeth to correct discoloration, minor malposition, morphological variations, or localized incisal wear. Tooth preparation is individualized based on pre-existing tooth position and desired aesthetic correction; while minimally invasive preparation confined to enamel optimizes bonding reliability, preparation depth is not universal and may involve dentin when addressing significant rotations or severe intrinsic discoloration. Because enamel reduction is an irreversible clinical procedure, veneers represent a lifelong dental commitment requiring regular professional monitoring, dedicated hygiene, and potential future repair or replacement based on individual wear and oral habits. Long-term survival depends significantly on bonding substrate, ceramic selection, and occlusal dynamics. Severe bruxism or clenching elevates mechanical risk, warranting comprehensive occlusal evaluation and protective nocturnal appliances.</p>',
    overviewHtmlTa: '<p>பீங்கான் வெனியர்கள் (Porcelain Veneers) என்பது முன்பற்களின் நிறமாற்றம், சிறிய ஒழுங்கின்மை, இடைவெளிகள் அல்லது தேய்மானங்களைச் சரிசெய்ய பற்களின் முன்பகுதியில் பிரத்யேகமாக ஒட்டப்படும் மிக மெல்லிய செராமிக் தகடுகளாகும். பல்லின் எனாமல் அடுக்கில் தேவைக்கேற்ப குறைந்தபட்ச தயாரிப்பு செய்யப்பட்டு, அதிநவீன பிசின் பசை (Resin Cement) மூலம் இவை இணைக்கப்படுகின்றன. எனாமல் அடுக்கைக் குறைப்பது மாற்ற முடியாத (Irreversible) ஒரு நிரந்தர செயல்முறையாகும்; எனவே, வெனியர் பொருத்துவது வாழ்நாள் முழுவதும் தொடர் மருத்துவக் கண்காணிப்பு, முறையான பராமரிப்பு மற்றும் தேய்மானத்தைப் பொறுத்து எதிர்காலத்தில் பழுதுபார்த்தல் அல்லது மாற்றுதல் தேவைப்படக்கூடிய ஒரு சிகிச்சை முறையாகும். பல்லின் எனாமல் தரம், ஒட்டப்படும் முறை மற்றும் மெல்லும் விசை ஆகியவற்றைப் பொறுத்து இவற்றின் ஆயுட்காலம் மாறுபடும். கடுமையான பல் கடிக்கும் பழக்கம் (Bruxism) உள்ளவர்களுக்கு வெனியர் உடைவதைத் தடுக்க பாதுகாப்பான இரவுப் பற்காப்பு (Nightguard) பரிந்துரைக்கப்படுகிறது.</p>',
    has3DModel: false,
    interactiveStepsCount: 4
  },

  // ------------------------------
  // 43. Aesthetic Gingival Recontouring (COSM-GNG-01) - Canonical Position #43
  // ------------------------------
  {
    id: '33333333-3333-4333-a333-333333333343',
    slug: 'gingival-recontouring',
    code: 'COSM-GNG-01',
    titleEn: 'Aesthetic Gingival Recontouring',
    titleTa: 'ஈறு சீரமைப்பு அறுவை சிகிச்சை (Aesthetic Gingival Recontouring)',
    summaryEn: 'Precise soft-tissue reshaping to harmonize asymmetrical gingival margins, correct altered passive eruption, and refine smile aesthetics.',
    summaryTa: 'புன்னகையின் அழகை அதிகரிக்க சீரற்ற அல்லது அதிகப்படியான ஈறு திசுக்களை துல்லியமாக மறுவடிவமைக்கும் சிகிச்சை.',
    durationMinutes: 45,
    anesthesiaType: 'Local Infiltration / Topical Anesthesia',
    primaryDepartmentName: 'Cosmetic Dentistry – Smile Enhancement',
    primaryDepartmentCode: 'COSM',
    secondaryDepartmentCodes: ["PERIO"],
    exploreCategorySlugs: ['dental-appearance', 'gums-and-bleeding'],
    governanceTier: 'TIER_2',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>Aesthetic gingival recontouring (gingivoplasty) is a minimally invasive periodontal surgical procedure designed to reshape excessive, uneven, or asymmetrical gingival margins that obscure clinical crowns. Utilizing surgical scalpels, electrosurgical units, or dental soft-tissue lasers, excess gingiva is delicately sculpted to establish harmonious contours and natural scalloping. Soft-tissue recontouring alone is appropriate only when adequate supracrestal tissue attachment exists coronal to the alveolar crest. Because biological tissue dimensions vary between patients and individual teeth, an arbitrary fixed measurement cannot be assumed; if soft-tissue excision alone impinges upon the supracrestal connective tissue attachment, formal surgical crown lengthening involving osseous resection is required to prevent chronic gingival inflammation or tissue rebound.</p>',
    overviewHtmlTa: '<p>ஈறு சீரமைப்பு சிகிச்சை (Gingival Recontouring / Gingivoplasty) என்பது பற்களை அதிகமாக மூடியிருக்கும் அல்லது சமச்சீரற்ற முறையில் உள்ள அதிகப்படியான ஈறு திசுக்களைச் சீரமைத்து புன்னகையை அழகாக்கும் செயல்முறையாகும். நவீன லேசர் அல்லது அறுவை சிகிச்சை முறைகள் மூலம் அதிகப்படியான ஈறுகள் மென்மையாக அகற்றப்பட்டு பற்களின் சரியான வடிவம் வெளிக்கொணரப்படுகிறது. இந்த மென்மையான திசு சீரமைப்பு போதுமானதா அல்லது எலும்பைச் சீரமைக்கும் அறுவை சிகிச்சை (Osseous Crown Lengthening) தேவையா என்பதை ஈறுக்கும் தாடை எலும்புக்கும் இடையே உள்ள தனித்துவமான திசு இடைவெளியைப் (Supracrestal Tissue Attachment) பரிசோதித்து மருத்துவர் தீர்மானிக்கிறார். முறையான திட்டமிடல் நாள்பட்ட ஈறு வீக்கம் மற்றும் திசு மீண்டும் வளர்வதைத் தடுக்கிறது.</p>',
    has3DModel: false,
    interactiveStepsCount: 3
  },

  // ------------------------------
  // 44. Knocked-Out Permanent Tooth Emergency Management (EMRG-AVL-01) - Canonical Position #44
  // ------------------------------
  {
    id: '33333333-3333-4333-a333-333333333344',
    slug: 'knocked-out-tooth-avulsion',
    code: 'EMRG-AVL-01',
    titleEn: 'Knocked-Out Tooth Emergency Management',
    titleTa: 'முழுமையாக விழுந்த பல் அவசர சிகிச்சை (Avulsed Permanent Tooth Management)',
    summaryEn: 'EMERGENCY: Primary (baby) teeth must NEVER be replanted. Time-critical physiological preservation, replantation, and flexible stabilization of displaced permanent teeth.',
    summaryTa: 'அவசர எச்சரிக்கை: பால் பற்களை ஒருபோதும் மீண்டும் பொருத்தக் கூடாது! விபத்தினால் விழுந்த நிரந்தரப் பல்லை அவசரமாகப் பாதுகாத்து மீண்டும் பொருத்தும் சிகிச்சை.',
    durationMinutes: 60,
    anesthesiaType: 'Local Infiltration / Regional Block',
    primaryDepartmentName: 'Dental Trauma & Emergency Treatments',
    primaryDepartmentCode: 'EMRG',
    secondaryDepartmentCodes: ["ENDO","PEDO"],
    exploreCategorySlugs: ['missing-teeth', 'pain-and-sensitivity'],
    governanceTier: 'TIER_2',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>Dental avulsion represents the complete displacement of a tooth from its alveolar socket due to trauma. CRITICAL CONTRAINDICATION: Deciduous (baby) teeth must NEVER be replanted, as replantation can cause severe mechanical and inflammatory damage or developmental arrest to the underlying permanent tooth germ. For permanent teeth, immediate first aid directly determines prognosis: handle the tooth solely by its coronal surface—never scrape, rub, or sterilize root periodontal ligament (PDL) cells. Immediate replantation at the trauma site provides the highest periodontal ligament survival. When immediate replantation is impossible, store the tooth in a physiological medium (such as Hank’s Balanced Salt Solution, cold bovine milk, or tissue culture medium; saliva or saline may serve as interim media, whereas plain water or dry storage causes rapid osmotic cell lysis). Urgent dental assessment is essential for flexible splinting (commonly ~2 weeks for uncomplicated avulsions, adjusted if alveolar fractures coexist). Endodontic treatment timing is not universal: mature teeth with closed apices generally require endodontic intervention within 7 to 14 days post-replantation to prevent inflammatory root resorption, whereas immature open-apex teeth should be followed closely for potential spontaneous pulpal revascularization.</p>',
    overviewHtmlTa: '<p>விபத்தினால் பல் தாடை எலும்பிலிருந்து வேருடன் முழுமையாக வெளியேறுவது பல் அவுல்ஷன் (Avulsion) எனப்படும். அதிமுக்கிய எச்சரிக்கை: குழந்தைகளின் பால் பற்களை ஒருபோதும் மீண்டும் பொருத்தக் கூடாது! ஏனெனில் அது கீழே வளரும் நிரந்தரப் பல் முளையைக் கடுமையாகப் பாதிக்கலாம். நிரந்தரப் பற்களுக்கு, உடனடி முதலுதவியே அதன் ஆயுளைத் தீர்மானிக்கிறது: பல்லின் மகுடத்தை மட்டுமே பிடிக்க வேண்டும்; வேர்ப்பகுதியில் உள்ள செல்களைத் தொடுவதோ, சுரண்டுவதோ கூடாது. உடனடியாக அதே இடத்தில் மீண்டும் பொருத்துவது மிகச் சிறந்தது; இயலாவிட்டால், குளிர்ந்த பால் அல்லது ஹாங்க்ஸ் கரைசலில் (HBSS) வைத்து அவசரமாக மருத்துவரிடம் கொண்டு செல்ல வேண்டும் (சாதாரண நீரில் வைக்கக் கூடாது). மருத்துவர் பல்லினை நெகிழ்வான கம்பி மூலம் கட்டி நிலைநிறுத்துவார். வேர்க்கால் சிகிச்சை காலம் அனைத்துப் பற்களுக்கும் ஒன்றல்ல: முழுமையாக வேர் மூடிய முதிர்ந்த பற்களுக்கு எலும்பு உறிஞ்சுதலைத் (Resorption) தடுக்க 7-14 நாட்களுக்குள் வேர்க்கால் சிகிச்சை தேவைப்படலாம்; ஆனால் வேர் முழுமையடையாத இளம் பற்களில் நரம்பின் உயிரோட்டம் மீண்டும் துளிர்க்கிறதா என்பதை மருத்துவர் தொடர்ந்து கண்காணிப்பார்.</p>',
    has3DModel: false,
    interactiveStepsCount: 4
  },

  // ------------------------------
  // 45. Emergency Broken or Chipped Tooth Repair (EMRG-BRK-01) - Canonical Position #45
  // ------------------------------
  {
    id: '33333333-3333-4333-a333-333333333345',
    slug: 'emergency-broken-tooth-repair',
    code: 'EMRG-BRK-01',
    titleEn: 'Emergency Broken Tooth Repair',
    titleTa: 'உடைந்த பல் அவசர சிகிச்சை (Emergency Broken Tooth Repair)',
    summaryEn: 'Urgent diagnostic assessment and restorative stabilization for traumatic dental fractures, protecting pulpal vitality and coronal integrity.',
    summaryTa: 'விபத்தால் உடைந்த அல்லது சிதைந்த பல்லின் நரம்பைப் பாதுகாத்து உடனுக்குடன் சீரமைக்கும் அவசர சிகிச்சை.',
    durationMinutes: 45,
    anesthesiaType: 'Local Infiltration (as indicated) / Topical Anesthesia',
    primaryDepartmentName: 'Dental Trauma & Emergency Treatments',
    primaryDepartmentCode: 'EMRG',
    secondaryDepartmentCodes: ["REST","ENDO"],
    exploreCategorySlugs: ['broken-or-chipped-teeth', 'pain-and-sensitivity'],
    governanceTier: 'TIER_1',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>Emergency broken tooth repair addresses traumatic crown fractures resulting from impacts, falls, or masticatory trauma. Fractures are clinically categorized into uncomplicated (confined to enamel or enamel-dentin without pulpal exposure) and complicated (exposing the vital dental pulp). Immediate dental evaluation with radiographic imaging is essential to evaluate fracture margins, assess pulp vitality, and rule out concurrent root fracture, alveolar injury, or luxation. If an intact fractured coronal fragment is recovered, keeping it continuously hydrated in sterile saline or cold milk preserves its optical translucency and adhesive bond strength; however, fragment reattachment is not indicated for every fracture pattern and depends on clean margin adaptation and biological fit. Treatment is strictly individualized: uncomplicated fractures are managed with dentin sealing and direct composite restoration, while complicated fractures require vital pulp therapy (such as direct pulp capping or partial Cvek pulpotomy using hydraulic calcium-silicate cements) or complete endodontic therapy based on pulp exposure size, bacterial contamination, time elapsed, and apical maturity.</p>',
    overviewHtmlTa: '<p>விபத்து அல்லது கடினமான உணவைக் கடிப்பதால் பல் உடைந்து போகும்போது உடனடியாக செய்யப்படும் சிகிச்சை இதுவாகும். பல் உடைவு என்பது நரம்பு வெளிப்படாத சாதாரண உடைவு (Uncomplicated) அல்லது நரம்பு வெளிப்படும் தீவிர உடைவு (Complicated) என இருவகையாகப் பிரிக்கப்படுகிறது. எக்ஸ்-ரே மூலம் பல்லின் வேர் மற்றும் நரம்பின் நிலை பரிசோதிக்கப்படுகிறது. உடைந்த பல்லின் துண்டு கிடைத்தால், அதன் இயற்கை நிறமும் ஒட்டும் தன்மையும் மாறாமல் இருக்க உடனடியாக சலைன் அல்லது குளிர்ந்த பாலில் வைத்து எடுத்து வர வேண்டும்; எனினும், அனைத்து உடைவுகளுக்கும் துண்டை மீண்டும் ஒட்டுவது பொருத்தமாக இருக்காது; துண்டின் வடிவம் மற்றும் பொருத்துதலைப் பொறுத்தே மருத்துவர் இதைத் தீர்மானிக்கிறார். நரம்பு வெளிப்படாத பற்களுக்கு காம்போசிட் அடைப்பு செய்யப்படுகிறது; நரம்பு வெளிப்பட்டிருந்தால், பல்லின் நரம்பு துளையின் அளவு, விபத்து நிகழ்ந்த நேரம் மற்றும் வேர் வளர்ச்சியைப் பொறுத்து நரம்பைப் பாதுகாக்கும் உயிருள்ள நரம்பு சிகிச்சையோ அல்லது வேர்க்கால் சிகிச்சையோ மேற்கொள்ளப்படுகிறது.</p>',
    has3DModel: false,
    interactiveStepsCount: 3
  },

  // ------------------------------
  // 46. Recementation of Dislodged Crown or Bridge (EMRG-RCM-01) - Canonical Position #46
  // ------------------------------
  {
    id: '33333333-3333-4333-a333-333333333346',
    slug: 'recement-dislodged-crown-bridge',
    code: 'EMRG-RCM-01',
    titleEn: 'Recementation of Dislodged Crown or Bridge',
    titleTa: 'கழன்ற பற்காப்பு மூடியை மீண்டும் பொருத்துதல் (Crown or Bridge Recementation)',
    summaryEn: 'Diagnostic evaluation of abutment health, margin integrity, and definitive adhesive re-luting of detached fixed prosthodontic restorations.',
    summaryTa: 'கழன்று விழுந்த பற்காப்பு மூடி அல்லது பாலத்தை, பல்லின் ஆரோக்கியத்தைப் பரிசோதித்து மீண்டும் பாதுகாப்பாகப் பொருத்துதல்.',
    durationMinutes: 30,
    anesthesiaType: 'Non-Invasive / Local Infiltration (if sensitive)',
    primaryDepartmentName: 'Dental Trauma & Emergency Treatments',
    primaryDepartmentCode: 'EMRG',
    secondaryDepartmentCodes: ["PROS"],
    exploreCategorySlugs: ['broken-or-chipped-teeth'],
    governanceTier: 'TIER_1',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>Recementation of a dislodged crown or fixed partial denture is a systematic clinical procedure that requires meticulous diagnostic assessment before any re-bonding decision. Dislodgement frequently indicates underlying biomechanical or biological failure. The clinician inspects both the abutment tooth and the restoration intaglio surface clinically and radiographically to rule out recurrent caries, core or root fractures, periodontal breakdown, compromised retention form, or occlusal interference. Definitive recementation is indicated only when the underlying abutment is biologically sound, structural margins remain intact, and the restoration seats completely without rocking. The restoration and abutment are thoroughly cleaned of residual cement, disinfected, and re-luted using an appropriate definitive dental cement (such as resin-modified glass ionomer or adhesive resin cement). If active caries or abutment fracture is discovered, recementation is contraindicated until restorative reconstruction is achieved.</p>',
    overviewHtmlTa: '<p>பற்காப்பு மூடி (Crown) அல்லது பாலம் (Bridge) கழன்று வரும்போது, அதை உடனடியாக மீண்டும் ஒட்டிவிடுவது மட்டுமே சரியான தீர்வாகாது. கழன்றதற்கான அடிப்படைக் காரணத்தைக் கண்டறிவது மிக அவசியமாகும். மருத்துவர் எக்ஸ்-ரே மற்றும் நேரடிப் பரிசோதனை மூலம் பல்லில் மீண்டும் சொத்தை ஏற்பட்டுள்ளதா, பல்லின் அடித்தளம் அல்லது வேரில் விரிசல் உள்ளதா, அல்லது பற்காப்பு மூடி சேதமடைந்துள்ளதா என்பதை ஆய்வு செய்வார். பல் ஆரோக்கியமாகவும் உறுதியாகவும் இருந்தால் மட்டுமே, பழைய சிமெண்ட் எச்சங்கள் முழுமையாக அகற்றப்பட்டு, புதிய வலிமையான டென்டல் சிமெண்ட் (Resin or Glass Ionomer) மூலம் மீண்டும் பொருத்தப்படும். பல்லில் சொத்தை அல்லது விரிசல் இருந்தால், அதனைச் சரிசெய்த பிறகே புதிய மூடி பொருத்தப்பட வேண்டும்.</p>',
    has3DModel: false,
    interactiveStepsCount: 3
  },

  // ------------------------------
  // 47. Nitrous Oxide Inhalation Sedation (SEDA-N2O-01) - Canonical Position #47
  // ------------------------------
  {
    id: '33333333-3333-4333-a333-333333333347',
    slug: 'nitrous-oxide-inhalation-sedation',
    code: 'SEDA-N2O-01',
    titleEn: 'Nitrous Oxide Inhalation Sedation',
    titleTa: 'நைட்ரஸ் ஆக்சைடு உள்ளிழுக்கும் மயக்க நிலை (Nitrous Oxide Inhalation Sedation)',
    summaryEn: 'Safe, titrated inhalation anxiolysis delivering controlled nitrous oxide and oxygen to alleviate dental fear while maintaining active communication.',
    summaryTa: 'பல் மருத்துவப் பயத்தைப் போக்க மூக்கின் வழியாக பிராணவாயுவுடன் கலந்து செலுத்தப்படும் பாதுகாப்பான மயக்க வாயு சிகிச்சை.',
    durationMinutes: 45,
    anesthesiaType: 'Inhalation Anxiolysis / Nitrous Oxide & Oxygen',
    primaryDepartmentName: 'Sedation & Dental Anesthesia',
    primaryDepartmentCode: 'SEDA',
    secondaryDepartmentCodes: ["PEDO"],
    exploreCategorySlugs: ['pain-and-sensitivity'],
    governanceTier: 'TIER_1',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>Nitrous oxide inhalation sedation (conscious inhalation anxiolysis) is a pharmacological modality designed to relieve mild-to-moderate dental anxiety and raise pain reaction thresholds while keeping the patient fully conscious and responsive. Delivered continuously through a contoured nasal mask, the gas mixture is incrementally titrated to the minimal concentration required for patient relaxation. In accordance with clinical guidelines and equipment safety engineering, delivery units feature fail-safe mechanisms ensuring oxygen delivery (a minimum of 30% oxygen by design; nitrous oxide concentration is tailored individually and rarely requires maximum levels). The patient retains intact protective airway reflexes, breathes spontaneously, and communicates verbally throughout. Following discontinuation of nitrous oxide, 100% oxygen is administered for a minimum of 5 minutes to scavenge residual gas from the lungs and prevent diffusion hypoxia; however, this time interval alone does not constitute proof of recovery, and formal clinical confirmation of baseline psychomotor and physiological status is mandatory prior to discharge. Medical contraindications must be distinguished: absolute contraindications include bleomycin chemotherapy (due to severe pulmonary toxicity risk) and recent intraocular or middle ear surgery with closed gas cavities; relative contraindications and conditions requiring individualized assessment include severe COPD, acute upper airway obstruction or mouth breathing, first-trimester pregnancy, and significant psychiatric conditions.</p>',
    overviewHtmlTa: '<p>நைட்ரஸ் ஆக்சைடு உள்ளிழுக்கும் சிகிச்சை (Nitrous Oxide Sedation / Laughing Gas) என்பது பல் மருத்துவ சிகிச்சையின் போது ஏற்படும் பயம் மற்றும் பதற்றத்தைக் குறைக்க உதவும் பாதுகாப்பான முறையாகும். மூக்கு முகமூடி வழியாக நோயாளிக்குத் தேவையான குறைந்தபட்ச அளவில் நைட்ரஸ் ஆக்சைடு மற்றும் ஆக்சிஜன் கலவை படிப்படியாகச் செலுத்தப்படுகிறது. நவீன கருவிகளில் குறைந்தபட்சம் 30% பிராணவாயு எப்போதும் இருக்குமாறு தானியங்கி பாதுகாப்பு அமைப்புகள் உள்ளன. நோயாளி முழு விழிப்புணர்வுடன் இருப்பார், மருத்துவரின் கேள்விகளுக்குப் பதிலளிக்க முடியும். சிகிச்சை முடிந்தவுடன், நுரையீரலில் உள்ள எஞ்சிய வாயுவை வெளியேற்றி தலைச்சுற்றலைத் தடுக்க குறைந்தபட்சம் 5 நிமிடங்களுக்கு 100% தூய ஆக்சிஜன் வழங்கப்படுகிறது; எனினும், இந்த 5 நிமிட கால அளவு மட்டுமே முழு மீட்சிக்கான சான்றல்ல, நோயாளி தனது இயல்பான சுறுசுறுப்பை அடைந்ததை மருத்துவர் நேரடியாக உறுதிசெய்த பிறகே வழியனுப்பப்படுவார். புற்றுநோய் மருந்தான பிளியோமைசின் (Bleomycin) சிகிச்சை பெறுபவர்கள் மற்றும் சமீபத்தில் கண்/காது அறுவை சிகிச்சை செய்தவர்களுக்கு இது முற்றிலும் முரணானது (Absolute Contraindication); கடுமையான நுரையீரல் நோய் மற்றும் மூக்கடைப்பு உள்ளவர்களுக்கு மருத்துவப் பரிசீலனைக்குப் பிறகே முடிவு செய்யப்படும்.</p>',
    has3DModel: false,
    interactiveStepsCount: 3
  },

  // ------------------------------
  // 48. Moderate Oral Conscious Sedation (SEDA-ORL-01) - Canonical Position #48
  // ------------------------------
  {
    id: '33333333-3333-4333-a333-333333333348',
    slug: 'oral-sedation',
    code: 'SEDA-ORL-01',
    titleEn: 'Moderate Oral Conscious Sedation',
    titleTa: 'வாய்வழி மயக்க மாத்திரை சிகிச்சை (Moderate Oral Conscious Sedation)',
    summaryEn: 'Pharmacological conscious sedation utilizing oral sedatives to achieve relaxation and anxiolysis, supported by continuous physiological monitoring.',
    summaryTa: 'பல் மருத்துவ பதற்றத்தைப் போக்க மாத்திரை வடிவில் வழங்கப்படும் பாதுகாப்பான மிதமான மயக்க நிலை சிகிச்சை.',
    durationMinutes: 90,
    anesthesiaType: 'Oral Sedative Anxiolysis + Local Anesthesia',
    primaryDepartmentName: 'Sedation & Dental Anesthesia',
    primaryDepartmentCode: 'SEDA',
    secondaryDepartmentCodes: [],
    exploreCategorySlugs: ['pain-and-sensitivity'],
    governanceTier: 'TIER_2',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>Moderate oral conscious sedation employs orally administered sedative medications to alleviate moderate to severe dental fear and facilitate necessary clinical care. Sedation exists on a clinical continuum; because an oral route or predetermined dose cannot guarantee an unvarying depth of central nervous system depression, clinicians must possess the training, rescue capabilities, and emergency airway equipment to manage deeper levels of sedation if they occur. Thorough preoperative assessment—evaluating medical history, ASA physical status classification, and airway anatomy—and strict adherence to individualized preoperative fasting (NPO) guidelines are mandatory. Intraoperatively, the patient maintains patent airway reflexes and responds purposefully to verbal commands. Continuous multi-parameter physiological monitoring (pulse oximetry, non-invasive blood pressure, heart rate, and continuous assessment of ventilation) is maintained throughout the visit. Reversal agents and resuscitation equipment must be immediately accessible. Discharge requires documented clinical assessment meeting objective recovery scoring criteria, with release exclusively into the care of a responsible adult escort. Postoperative safety instructions strictly prohibit driving, operating machinery, making legal or financial decisions, consuming alcohol, or taking unprescribed sedatives/CNS depressants for at least 24 hours (or longer depending on specific agent half-life and clinical assessment).</p>',
    overviewHtmlTa: '<p>மிதமான வாய்வழி மயக்க சிகிச்சை (Oral Sedation) என்பது அதிகப்படியான பல் மருத்துவ பயம் உள்ளவர்களுக்கு சிகிச்சை தொடங்குவதற்கு முன் மாத்திரை வடிவில் மயக்க மருந்து வழங்கி உடலையும் மனதையும் அமைதிப்படுத்தும் முறையாகும். மயக்க நிலை என்பது தொடர்ச்சியான ஒரு அளவுகோலாகும்; வாய்வழி மாத்திரை என்பதால் மயக்கத்தின் ஆழத்தை முன்கூட்டியே முழுமையாகக் கட்டுப்படுத்த முடியாது என்பதால், எதிர்பாராத ஆழ்ந்த மயக்க நிலையைச் சமாளிக்கும் மீட்புக் கருவிகள் மற்றும் பயிற்சிகள் மருத்துவரிடம் இருப்பது கட்டாயமாகும். உடல் தகுதி மற்றும் உணவுக்கட்டுப்பாடு விதிகள் பரிசோதிக்கப்பட்டு, சிகிச்சை முழுவதும் ரத்த அழுத்தம், இதயத்துடிப்பு மற்றும் ஆக்சிஜன் அளவு தொடர்ந்து கண்காணிக்கப்படுகிறது. சிகிச்சை முடிந்த பிறகு, நோயாளி முழுமையான நினைவாற்றல் மற்றும் வலிமையை மீட்டெடுத்ததை மருத்துவ ரீதியாக உறுதிசெய்து, ஒரு பொறுப்பான துணையிடம் மட்டுமே ஒப்படைக்கப்படுவார். சிகிச்சைக்குப் பின் குறைந்தது 24 மணி நேரத்திற்கு வாகனம் ஓட்டுதல், இயந்திரங்களை இயக்குதல், மது அருந்துதல் அல்லது பிற மயக்க மருந்துகளை உட்கொள்வது முற்றிலும் தவிர்க்கப்பட வேண்டும்.</p>',
    has3DModel: false,
    interactiveStepsCount: 4
  },

  // ------------------------------
  // 49. Deep Intravenous Dental Sedation (SEDA-IVS-01) - Canonical Position #49
  // ------------------------------
  {
    id: '33333333-3333-4333-a333-333333333349',
    slug: 'intravenous-dental-sedation',
    code: 'SEDA-IVS-01',
    titleEn: 'Deep Intravenous Dental Sedation',
    titleTa: 'நரம்பு வழி மயக்க சிகிச்சை (Deep Intravenous Dental Sedation)',
    summaryEn: 'Advanced specialist-governed intravenous sedation providing controlled deep relaxation for complex maxillofacial and extensive surgical procedures.',
    summaryTa: 'சிக்கலான மற்றும் பெரிய அறுவை சிகிச்சைகளின் போது நிபுணர் மேற்பார்வையில் நரம்பு வழியாக வழங்கப்படும் உயர்நிலை மயக்க சிகிச்சை.',
    durationMinutes: 120,
    anesthesiaType: 'Specialist-Administered Intravenous Sedation + Local Anesthesia',
    primaryDepartmentName: 'Sedation & Dental Anesthesia',
    primaryDepartmentCode: 'SEDA',
    secondaryDepartmentCodes: ["OMFS"],
    exploreCategorySlugs: ['pain-and-sensitivity'],
    governanceTier: 'TIER_3',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>Deep intravenous (IV) dental sedation is an advanced, hospital-grade sedation modality governed by strict specialist clinical standards. This educational module provides a high-level conceptual overview only; in accordance with medical governance, specific drug names, dosages, infusion combinations, or operational protocols are intentionally omitted. Deep IV sedation is restricted to credentialed dentist anesthesiologists, oral and maxillofacial surgeons, or certified dental practitioners holding advanced sedation permits. Continuous real-time physiological monitoring is required, including end-tidal carbon dioxide capnography, continuous electrocardiography (ECG), non-invasive blood pressure, and pulse oximetry, supported by dedicated anesthesia personnel whose sole responsibility is patient surveillance. Because protective airway reflexes may be partially lost and ventilatory depression can occur, advanced airway rescue equipment and current advanced life support (ACLS) capabilities must be instantly deployable. Patients are discharged only after fully meeting standardized post-anesthesia scoring criteria under the escort of a responsible adult.</p>',
    overviewHtmlTa: '<p>நரம்பு வழி மயக்க சிகிச்சை (Deep IV Sedation) என்பது பெரிய வாய் மற்றும் தாடை அறுவை சிகிச்சைகள் அல்லது தீவிர பயம் உள்ளவர்களுக்கு நிபுணத்துவ மயக்கவியல் மருத்துவர்களால் (Dentist Anesthesiologists / Maxillofacial Surgeons) நரம்பு வழியாக மருந்துகள் செலுத்தப்பட்டு வழங்கப்படும் உயர்நிலை மயக்க முறையாகும். மருத்துவ நெறிமுறைகளின்படி, இந்த விளக்கம் விழிப்புணர்வுக்காக மட்டுமே வழங்கப்படுகிறது; குறிப்பிட்ட மருந்துகளின் பெயர்களோ அல்லது அளவுகளோ இதில் விவரிக்கப்படவில்லை. இந்த சிகிச்சையின் போது நோயாளியின் சுவாசம், இதயத்துடிப்பு (ECG), ரத்த அழுத்தம் மற்றும் கார்பன் டை ஆக்சைடு அளவு (Capnography) ஆகியவை சிறப்பு உபகரணங்கள் மூலம் நொடிகள் தோறும் கண்காணிக்கப்படுகின்றன. மூச்சுப்பாதையைப் பாதுகாக்கும் அனைத்து அவசரகால மீட்புக் கருவிகளும் தயார் நிலையில் இருப்பது சட்டப்பூர்வ விதியாகும். நோயாளி முழுமையான சுயநினைவு மற்றும் இயல்புநிலையை அடைந்த பிறகே துணையுடன் அனுப்பப்படுவார்.</p>',
    has3DModel: false,
    interactiveStepsCount: 4
  },

  // ------------------------------
  // 50. Recurrent Aphthous Stomatitis Management (ORAL-APU-01) - Canonical Position #50
  // ------------------------------
  {
    id: '33333333-3333-4333-a333-333333333350',
    slug: 'recurrent-aphthous-ulcer-care',
    code: 'ORAL-APU-01',
    titleEn: 'Recurrent Aphthous Stomatitis Management',
    titleTa: 'தொடர் வாய் புண் சிகிச்சை (Recurrent Aphthous Stomatitis Management)',
    summaryEn: 'Diagnostic evaluation, differentiation, and evidence-based topical palliative management of recurrent oral aphthous ulcerations (canker sores).',
    summaryTa: 'வாயில் அடிக்கடி ஏற்படும் வலி மிகுந்த புண்களைக் கண்டறிந்து, வலியைத் தணித்து விரைவாகக் குணப்படுத்தும் நவீன சிகிச்சை முறை.',
    durationMinutes: 30,
    anesthesiaType: 'Topical Mucosal Anesthesia / Protective Barrier Paste',
    primaryDepartmentName: 'Oral Medicine – Therapeutic Treatments',
    primaryDepartmentCode: 'ORAL',
    secondaryDepartmentCodes: [],
    exploreCategorySlugs: ['gums-and-bleeding', 'pain-and-sensitivity'],
    governanceTier: 'TIER_1',
    contentStatus: 'DRAFT',
    overviewHtmlEn: '<p>Recurrent aphthous stomatitis (RAS, commonly known as canker sores) is one of the most frequent non-contagious inflammatory conditions of the oral cavity. Characterized by painful, recurrent, round or ovoid necrotizing ulcerations with a grayish-yellow pseudomembranous center and an erythematous halo, lesions typically manifest on non-keratinized mobile oral mucosa (such as labial and buccal mucosa, or the floor of the mouth). Minor aphthae are generally self-limiting, healing within 7 to 14 days without scarring, whereas major aphthae are larger, penetrate deeper, and may persist for several weeks. Clinical assessment must distinguish benign aphthous ulceration from traumatic injuries, viral stomatitis, autoimmune blistering diseases, and oral premalignancy or squamous cell carcinoma. While a duration exceeding 2 to 3 weeks serves as a common clinical warning interval to rule out neoplastic lesions, it is not an arbitrary mathematical deadline: any solitary, indurated, painless, or atypical ulcer warrants prompt clinical examination, with biopsy decisions guided by expert clinical judgment and palpation findings. Management focuses on symptomatic pain relief, mucosal protection, and promoting healing using topical bioadhesive pastes, protective rinses, and localized topical corticosteroids. Severe, recalcitrant, or frequent recurrences warrant systemic screening for hematinic deficiencies (iron, ferritin, vitamin B12, folate) or underlying gastrointestinal conditions (such as celiac disease or inflammatory bowel disease).</p>',
    overviewHtmlTa: '<p>தொடர் வாய் புண் சிகிச்சை (Recurrent Aphthous Stomatitis / Canker Sores) என்பது உதட்டின் உட்பகுதி, கன்னத்தின் உட்புறம் அல்லது நாக்கின் அடியில் அடிக்கடி தோன்றும் வலி மிகுந்த வாய் புண்களுக்கான மருத்துவ பராமரிப்பு முறையாகும். இவை தொற்றும் புண்கள் அல்ல. சிறிய வாய் புண்கள் பொதுவாக 7 முதல் 14 நாட்களில் தானாகவே ஆறிவிடும்; ஆனால் பெரிய புண்கள் ஆழமாகவும் ஆற பல வாரங்கள் ஆகவும் கூடும். அனைத்து வாய் புண்களும் சாதாரணமானவை அல்ல; 2 முதல் 3 வாரங்களுக்கு மேல் ஆறாமல் இருக்கும் புண்கள் ஒரு எச்சரிக்கை கால அளவாகக் கருதப்பட்டாலும், இது ஒரு இயந்திரத்தனமான கால வரம்பு அல்ல: கடினமாக இருக்கும் (Indurated), வலியற்ற அல்லது வழக்கத்திற்கு மாறான எந்த ஒரு வாய் புண்ணையும் உடனடியாக மருத்துவரிடம் காட்டி திசுப் பரிசோதனை (Biopsy) தேவையா எனத் தீர்மானிக்க வேண்டும். சிகிச்சையில் வலியைத் தணிக்கும் களிம்புகள், அழற்சி எதிர்ப்பு மருந்துகள் மற்றும் புண்ணின் மேல் படரும் பாதுகாப்புப் பசைகள் (Barrier Pastes) பயன்படுத்தப்படுகின்றன. அடிக்கடி கடுமையான புண்கள் வருபவர்களுக்கு இரும்புச்சத்து, வைட்டமின் பி12 குறைபாடு அல்லது குடல் சார்ந்த நோய்கள் உள்ளதா எனப் பரிசோதிக்கப்பட வேண்டும்.</p>',
    has3DModel: false,
    interactiveStepsCount: 3
  }
];

export const CLINICAL_DISCLAIMER_EN = 
  "Educational Visual Guide Only: The information provided on DentalVis is designed to facilitate informed discussions between patients and certified dental professionals. It does not constitute medical diagnosis, clinical treatment advice, or formal care recommendations.";

export const CLINICAL_DISCLAIMER_TA = 
  "கல்வி வழிகாட்டி மட்டுமே: டென்டல்விஸ் தளத்தில் உள்ள தகவல்கள் நோயாளிகளுக்கும் பல் மருத்துவ நிபுணர்களுக்கும் இடையேயான கலந்துரையாடலை எளிதாக்குவதற்காக மட்டுமே உருவாக்கப்பட்டுள்ளது. இது மருத்துவப் பரிசோதனை அல்லது சிகிச்சை பரிந்துரை அல்ல.";

// ----------------------------------------------------------------------
// PUBLICATION & EDUCATIONAL ACCESS POLICY UTILITIES
// ----------------------------------------------------------------------

/**
 * Reusable publication and educational access policy predicate (M7.2).
 *
 * In DentalVis, we strictly distinguish between:
 * 1. Educational Catalogue Content Availability:
 *    All 48 canonical dental educational procedure guides are accessible to the public,
 *    enabling patient education across all 15 clinical dental specialties and 6 explore categories.
 * 2. Formal Clinical Approval and Governance State:
 *    Clinical approval (CRB review quorum, COI disclosure, deterministic RFC 8785 hash verification)
 *    is an authoritative governance state. The 4 reference procedures (Root Canal, Crowns, Scaling,
 *    Implant) possess formal clinical approval, while remaining procedures are designated as
 *    educational reference guides ('Not Clinically Reviewed · Educational Reference Only').
 *
 * - Archived, rejected, or invalid procedures remain strictly invisible (fail-closed).
 * - All valid educational canonical procedures ('PUBLISHED', 'DRAFT', 'PENDING_APPROVAL') are
 *   publicly accessible for patient education without fabricating fake clinical approvals.
 */
declare const process: { env?: Record<string, string | undefined> } | undefined;

export function isProcedureVisibleInEnvironment(
  proc: ProcedureSummary,
  env: { nodeEnv?: string; previewMode?: string; strictClinicalOnly?: boolean } = {}
): boolean {
  if (!proc || !proc.contentStatus) {
    return false;
  }

  // Never expose ARCHIVED or explicitly REJECTED content
  if (proc.contentStatus === 'ARCHIVED') {
    return false;
  }

  // If caller explicitly requests strict clinical quorum approval only (e.g., governance verification tests):
  if (env.strictClinicalOnly) {
    return proc.contentStatus === 'PUBLISHED';
  }

  // All 48 canonical educational procedures are accessible for patient visual education.
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
  env: { nodeEnv?: string; previewMode?: string; strictClinicalOnly?: boolean } = {}
): ProcedureDetail[] {
  return CANONICAL_PROCEDURES.filter((proc) => isProcedureVisibleInEnvironment(proc, env));
}

/**
 * Returns a specific canonical procedure by slug only if visible under the current publication policy.
 */
export function getVisibleProcedureBySlug(
  slug: string,
  env: { nodeEnv?: string; previewMode?: string; strictClinicalOnly?: boolean } = {}
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
    const isPrimary = proc.primaryDepartmentCode
      ? proc.primaryDepartmentCode === dept.code
      : (proc.primaryDepartmentName.toLowerCase().includes(`(${dept.code.toLowerCase()})`) ||
         proc.primaryDepartmentName.toLowerCase() === dept.nameEn.toLowerCase());

    const isSecondary = proc.secondaryDepartmentCodes
      ? proc.secondaryDepartmentCodes.includes(dept.code)
      : false;

    return isPrimary || isSecondary;
  });
}



