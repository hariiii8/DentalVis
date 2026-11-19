/**
 * DentalVis 2.0 — Canonical Domain Types & Contracts
 * Reconciled for Architecture Baseline v1.9.1 & Phase 2.2
 */

// ----------------------------------------------------------------------
// ENUMS
// ----------------------------------------------------------------------

export type ContentLanguage = 'en' | 'ta';

export type ContentStatus = 
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'ARCHIVED';

export type UserRole =
  | 'PATIENT_VIEWER'
  | 'CLINICAL_AUTHOR'
  | 'CLINICAL_REVIEWER'
  | 'CHIEF_EDITOR'
  | 'SYSTEM_ADMIN';

export type SessionStatus =
  | 'ACTIVE'
  | 'SUPERSEDED'
  | 'REVOKED_MANUAL'
  | 'REVOKED_REPLAY_ATTACK'
  | 'EXPIRED';

export type FamilyStatus =
  | 'ACTIVE'
  | 'REVOKED'
  | 'EXPIRED';

export type RevocationType =
  | 'REVOKE_SESSION'
  | 'REVOKE_FAMILY'
  | 'REVOKE_USER';

export type RevocationTargetType =
  | 'SESSION'
  | 'FAMILY'
  | 'USER';

export type ApprovalDecision =
  | 'APPROVED'
  | 'REJECTED';

export type MediaAssetProvider =
  | 'CLOUDINARY'
  | 'S3_COMPATIBLE'
  | 'LOCAL_MOCK';

export type MediaValidationStatus =
  | 'PENDING_INSPECTION'
  | 'VERIFIED'
  | 'REJECTED';

export type OutboxStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'RETRY_SCHEDULED'
  | 'DEAD_LETTER';

// ----------------------------------------------------------------------
// SAFE PUBLIC DTOs (No Secrets or Hashes Exposed)
// ----------------------------------------------------------------------

export interface UserPublicDto {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  clinicalSpecialty?: string;
  isActive: boolean;
}

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
  nameEn: string;
  nameTa: string;
  descriptionEn?: string;
  descriptionTa?: string;
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
  exploreCategorySlugs: string[];
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
    highlightNode?: string;
  }>;
  disclaimer: string;
}

// ----------------------------------------------------------------------
// CANONICAL REFERENCE SEED LISTS
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
    featuredProcedureSlugs: ['root-canal-treatment', 'dental-fillings']
  },
  {
    id: '11111111-1111-4111-a111-111111111102',
    slug: 'broken-or-chipped-teeth',
    titleEn: 'Broken or Chipped Teeth',
    titleTa: 'உடைந்த அல்லது விரிசல் விழுந்த பற்கள்',
    descriptionEn: 'Explore how cracked enamel, fractures, and damaged tooth crowns are restored.',
    descriptionTa: 'பல் விரிசல்கள், உடைப்புகள் மற்றும் சேதமடைந்த பற்களை சீரமைக்கும் முறைகளை அறியுங்கள்.',
    iconName: 'ShieldAlert',
    featuredProcedureSlugs: ['dental-crowns', 'dental-bonding']
  },
  {
    id: '11111111-1111-4111-a111-111111111103',
    slug: 'gums-and-bleeding',
    titleEn: 'Gums & Bleeding',
    titleTa: 'ஈறுகள் & இரத்தக் கசிவு',
    descriptionEn: 'Learn about tender gums, redness during brushing, and gentle periodontal care.',
    descriptionTa: 'ஈறு வீக்கம், பல் துலக்கும் போது ஏற்படும் இரத்தக் கசிவு மற்றும் ஈறு பராமரிப்பு முறைகள்.',
    iconName: 'HeartPulse',
    featuredProcedureSlugs: ['deep-cleaning-scaling', 'gingivitis-care']
  },
  {
    id: '11111111-1111-4111-a111-111111111104',
    slug: 'missing-teeth',
    titleEn: 'Missing Teeth',
    titleTa: 'இழந்த பற்கள்',
    descriptionEn: 'Visual explanations of implants, fixed bridges, and modern tooth replacement options.',
    descriptionTa: 'பல் இம்ப்ளான்ட், பிரிட்ஜ் மற்றும் நவீன பல் மாற்று சிகிச்சைகள் பற்றிய விளக்கங்கள்.',
    iconName: 'Layers',
    featuredProcedureSlugs: ['single-dental-implant', 'fixed-dental-bridge']
  },
  {
    id: '11111111-1111-4111-a111-111111111105',
    slug: 'tooth-alignment',
    titleEn: 'Tooth Alignment',
    titleTa: 'பல் சீரமைப்பு',
    descriptionEn: 'Clear guides on clear aligners, orthodontic braces, and gentle bite correction.',
    descriptionTa: 'கிளியர் அலைனர்கள் மற்றும் கிளிப் சிகிச்சைகள் மூலம் பல் வரிசை சீரமைக்கும் முறைகள்.',
    iconName: 'Compass',
    featuredProcedureSlugs: ['clear-aligners', 'orthodontic-braces']
  },
  {
    id: '11111111-1111-4111-a111-111111111106',
    slug: 'dental-appearance',
    titleEn: 'Dental Appearance',
    titleTa: 'பல் அழகு & பராமரிப்பு',
    descriptionEn: 'Safe, doctor-guided insight into whitening, stain removal, and smile enhancement.',
    descriptionTa: 'பல் வெளுப்பாக்குதல், கறை நீக்குதல் மற்றும் புன்னகை மேம்பாட்டு சிகிச்சைகள்.',
    iconName: 'Sparkles',
    featuredProcedureSlugs: ['professional-teeth-whitening', 'porcelain-veneers']
  }
];

export const CANONICAL_DEPARTMENTS: DepartmentDto[] = [
  {
    id: '22222222-2222-4222-a222-222222222201',
    code: 'ENDO',
    nameEn: 'Endodontics',
    nameTa: 'வேர் கால்வாய் சிகிச்சை பிரிவு (Endodontics)',
    descriptionEn: 'Specialized in dental pulp biology and root canal therapy.',
    descriptionTa: 'பல் நரம்பு மற்றும் வேர் கால்வாய் சிகிச்சை சார்ந்த துறை.'
  },
  {
    id: '22222222-2222-4222-a222-222222222202',
    code: 'PROS',
    nameEn: 'Prosthodontics',
    nameTa: 'செயற்கைப் பல் சீரமைப்பு பிரிவு (Prosthodontics)',
    descriptionEn: 'Specialized in restoring damaged and missing teeth with crowns, bridges, and dentures.',
    descriptionTa: 'கிரவுன், பிரிட்ஜ் மற்றும் செயற்கைப் பற்கள் மூலம் பல்லை சீரமைக்கும் பிரிவு.'
  },
  {
    id: '22222222-2222-4222-a222-222222222203',
    code: 'PERIO',
    nameEn: 'Periodontics',
    nameTa: 'ஈறு நோய் சிகிச்சை பிரிவு (Periodontics)',
    descriptionEn: 'Specialized in periodontal tissue care and gum inflammation management.',
    descriptionTa: 'ஈறு ஆரோக்கியம் மற்றும் ஈறு தொற்றுகளைக் குணப்படுத்தும் துறை.'
  },
  {
    id: '22222222-2222-4222-a222-222222222204',
    code: 'IMPL',
    nameEn: 'Implantology & Oral Surgery',
    nameTa: 'பல் இம்ப்ளான்ட் மற்றும் வாய் அறுவை சிகிச்சை',
    descriptionEn: 'Specialized in dental implants and surgical oral procedures.',
    descriptionTa: 'பல் இம்ப்ளான்ட் மற்றும் அறுவை சிகிச்சைகளுக்கான பிரத்யேகத் துறை.'
  }
];

export const CANONICAL_PROCEDURES: ProcedureDetail[] = [
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
    primaryDepartmentName: 'Endodontics',
    exploreCategorySlugs: ['pain-and-sensitivity'],
    overviewHtmlEn: '<p>Root canal treatment is designed to relieve tooth pain and save your natural tooth. During the procedure, the dentist gently cleans the inflamed pulp inside the root canals, disinfects the inner chamber, and fills it with a biocompatible material.</p>',
    overviewHtmlTa: '<p>வேர் கால்வாய் சிகிச்சை என்பது பல் வலியைப் போக்கி உங்கள் இயற்கை பல்லை பாதுகாப்பதற்காக செய்யப்படும் ஒரு சிகிச்சையாகும்.</p>',
    has3DModel: true,
    model3DId: 'model-molar-cross-section',
    interactiveStepsCount: 4
  },
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
    primaryDepartmentName: 'Prosthodontics',
    exploreCategorySlugs: ['broken-or-chipped-teeth'],
    overviewHtmlEn: '<p>A dental crown is a tooth-shaped "cap" that is placed over a prepared tooth to restore its size, shape, strength, and improve its appearance.</p>',
    overviewHtmlTa: '<p>பல் தொப்பி என்பது சேதமடைந்த அல்லது பலவீனமான பல்லின் மீது பொருத்தப்பட்டு அதன் வலிமையையும் வடிவத்தையும் மீட்டெடுக்கிறது.</p>',
    has3DModel: true,
    model3DId: 'model-dental-crown',
    interactiveStepsCount: 3
  },
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
    primaryDepartmentName: 'Periodontics',
    exploreCategorySlugs: ['gums-and-bleeding'],
    overviewHtmlEn: '<p>Dental scaling and root planing clean deep below the gum line to remove plaque and tartar deposits that regular brushing cannot reach.</p>',
    overviewHtmlTa: '<p>வழக்கமான பிரஷிங் மூலம் நீக்க முடியாத காரையை ஈறுகளின் அடியில் இருந்து ஆழமாக சுத்தம் செய்யும் மருத்துவ முறை.</p>',
    has3DModel: false,
    interactiveStepsCount: 3
  },
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
    primaryDepartmentName: 'Implantology & Oral Surgery',
    exploreCategorySlugs: ['missing-teeth'],
    overviewHtmlEn: '<p>A dental implant provides a permanent replacement for a missing tooth, behaving just like a natural tooth root.</p>',
    overviewHtmlTa: '<p>பல் இம்ப்ளான்ட் என்பது இழந்த பல்லின் வேரைப் போலவே தாடை எலும்பில் பொருத்தப்படும் ஒரு நிலையான தீர்வாகும்.</p>',
    has3DModel: true,
    model3DId: 'model-dental-implant',
    interactiveStepsCount: 5
  }
];

export const CLINICAL_DISCLAIMER_EN = 
  "Educational Visual Guide Only: The information provided on DentalVis is designed to facilitate informed discussions between patients and certified dental professionals. It does not constitute medical diagnosis, clinical treatment advice, or formal care recommendations.";

export const CLINICAL_DISCLAIMER_TA = 
  "கல்வி வழிகாட்டி மட்டுமே: டென்டல்விஸ் தளத்தில் உள்ள தகவல்கள் நோயாளிகளுக்கும் பல் மருத்துவ நிபுணர்களுக்கும் இடையேயான கலந்துரையாடலை எளிதாக்குவதற்காக மட்டுமே உருவாக்கப்பட்டுள்ளது. இது மருத்துவப் பரிசோதனை அல்லது சிகிச்சை பரிந்துரை அல்ல.";
