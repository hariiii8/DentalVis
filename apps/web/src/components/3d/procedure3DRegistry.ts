// apps/web/src/components/3d/procedure3DRegistry.ts
// DentalVis — Canonical 56-Procedure 3D Configuration Registry
// Validated against Canonical Architecture Baseline v1.9.1

import { Procedure3DConfig } from './types';

export const CANONICAL_56_3D_CONFIGS: Record<string, Procedure3DConfig> = {
  'routine-dental-cleaning-polishing': {
    procedureSlug: 'routine-dental-cleaning-polishing',
    modelAssetPath: null,
    modelFamily: 'PERIODONTAL_QUADRANT',
    modelState: 'IN_DEVELOPMENT',
    isModelReady: false,
    clinicalReviewStatus: 'EDUCATIONAL_DRAFT',
    provenance: {
      author: 'DentalVis Clinical Anatomy Team',
      license: 'Proprietary / Educational Visual Reference',
      sourceUrl: 'https://dentalvis.org/procedures/routine-dental-cleaning-polishing',
    },
    defaultCameraPosition: [0, 1.5, 6.2],
    defaultCameraTarget: [0, 0, 0],
    cameraPresets: [
      { id: 'front', labelEn: 'Frontal Aspect', labelTa: 'முன்பக்க பார்வை', position: [0, 0.8, 5.8], target: [0, 0, 0] },
      { id: 'cross-section', labelEn: 'Internal Cross-Section', labelTa: 'உட்புற குறுக்குவெட்டு', position: [3.4, 1.6, 4.6], target: [0, 0, 0] },
      { id: 'occlusal', labelEn: 'Occlusal Top View', labelTa: 'மேல் மெல்லும் பரப்பு', position: [0, 6.0, 0.8], target: [0, 0, 0] },
      { id: 'apical', labelEn: 'Apical Root View', labelTa: 'வேர் முனை பார்வை', position: [0, -5.2, 2.0], target: [0, -0.5, 0] },
      { id: 'exploded', labelEn: 'Exploded Component View', labelTa: 'பிரிக்கப்பட்ட அடுக்குகள்', position: [4.4, 2.6, 5.2], target: [0, 0, 0] },
    ],
    layerGroups: [
      {
            "id": "primary",
            "labelEn": "Primary Anatomy",
            "labelTa": "முதன்மை உடற்கூறியல்",
            "defaultVisible": true
      },
      {
            "id": "supporting",
            "labelEn": "Supporting Structures",
            "labelTa": "துணை கட்டமைப்புகள்",
            "defaultVisible": true
      }
],
    structures: [
      {
            "id": "struct-primary",
            "meshName": "Mesh_Primary_Anatomy",
            "labelEn": "${p.name} Anatomical Zone",
            "labelTa": "${p.name} மருத்துவ உடற்கூறு பகுதி",
            "descriptionEn": "Educational anatomical reference area for ${p.name}. Detailed procedure-specific GLB geometry is currently undergoing clinical calibration.",
            "descriptionTa": "${p.name} சிகிச்சைக்குரிய கல்வி உடற்கூறியல் பகுதி. இதற்குரிய 3D மாதிரி தற்போது மருத்துவ அளவுத்திருத்தத்தில் உள்ளது.",
            "layerGroup": "primary",
            "defaultVisible": true,
            "colorHint": "#20B2AA"
      }
],
    hotspots: [
      {
            "id": "hp-primary",
            "structureId": "struct-primary",
            "position": [
                  0,
                  0.5,
                  0.4
            ],
            "titleEn": "${p.name} Clinical Target",
            "titleTa": "${p.name} சிகிச்சை இலக்கு",
            "contentEn": "Procedural focus zone under clinical department ${p.dept}. Inspect 2D illustration for verified details.",
            "contentTa": "${p.dept} துறைக்குரிய சிகிச்சை பகுதி. சரிபார்க்கப்பட்ட வரைபடத்தைக் காண 2D தேர்வை பயன்படுத்தவும்."
      }
],
    educationalSequences: [
      { stepNumber: 1, titleEn: 'Baseline Anatomy', titleTa: 'அடிப்படை உடற்கூறியல்', explanationEn: 'Natural anatomical condition prior to procedural intervention.', explanationTa: 'சிகிச்சைக்கு முந்தைய இயல்பான உடற்கூறியல் நிலை.', cameraPreset: 'front' },
      { stepNumber: 2, titleEn: 'Procedural Intervention', titleTa: 'சிகிச்சை செயல்முறை', explanationEn: 'Key treatment phase demonstrating gentle clinical technique.', explanationTa: 'பாதுகாப்பான முறையில் சிகிச்சை மேற்கொள்ளப்படும் முக்கிய கட்டம்.', cameraPreset: 'cross-section' }
    ]
  },
  'dental-sealants': {
    procedureSlug: 'dental-sealants',
    modelAssetPath: null,
    modelFamily: 'POSTERIOR_MOLAR',
    modelState: 'IN_DEVELOPMENT',
    isModelReady: false,
    clinicalReviewStatus: 'EDUCATIONAL_DRAFT',
    provenance: {
      author: 'DentalVis Clinical Anatomy Team',
      license: 'Proprietary / Educational Visual Reference',
      sourceUrl: 'https://dentalvis.org/procedures/dental-sealants',
    },
    defaultCameraPosition: [0, 1.5, 6.2],
    defaultCameraTarget: [0, 0, 0],
    cameraPresets: [
      { id: 'front', labelEn: 'Frontal Aspect', labelTa: 'முன்பக்க பார்வை', position: [0, 0.8, 5.8], target: [0, 0, 0] },
      { id: 'cross-section', labelEn: 'Internal Cross-Section', labelTa: 'உட்புற குறுக்குவெட்டு', position: [3.4, 1.6, 4.6], target: [0, 0, 0] },
      { id: 'occlusal', labelEn: 'Occlusal Top View', labelTa: 'மேல் மெல்லும் பரப்பு', position: [0, 6.0, 0.8], target: [0, 0, 0] },
      { id: 'apical', labelEn: 'Apical Root View', labelTa: 'வேர் முனை பார்வை', position: [0, -5.2, 2.0], target: [0, -0.5, 0] },
      { id: 'exploded', labelEn: 'Exploded Component View', labelTa: 'பிரிக்கப்பட்ட அடுக்குகள்', position: [4.4, 2.6, 5.2], target: [0, 0, 0] },
    ],
    layerGroups: [
      {
            "id": "primary",
            "labelEn": "Primary Anatomy",
            "labelTa": "முதன்மை உடற்கூறியல்",
            "defaultVisible": true
      },
      {
            "id": "supporting",
            "labelEn": "Supporting Structures",
            "labelTa": "துணை கட்டமைப்புகள்",
            "defaultVisible": true
      }
],
    structures: [
      {
            "id": "struct-primary",
            "meshName": "Mesh_Primary_Anatomy",
            "labelEn": "${p.name} Anatomical Zone",
            "labelTa": "${p.name} மருத்துவ உடற்கூறு பகுதி",
            "descriptionEn": "Educational anatomical reference area for ${p.name}. Detailed procedure-specific GLB geometry is currently undergoing clinical calibration.",
            "descriptionTa": "${p.name} சிகிச்சைக்குரிய கல்வி உடற்கூறியல் பகுதி. இதற்குரிய 3D மாதிரி தற்போது மருத்துவ அளவுத்திருத்தத்தில் உள்ளது.",
            "layerGroup": "primary",
            "defaultVisible": true,
            "colorHint": "#20B2AA"
      }
],
    hotspots: [
      {
            "id": "hp-primary",
            "structureId": "struct-primary",
            "position": [
                  0,
                  0.5,
                  0.4
            ],
            "titleEn": "${p.name} Clinical Target",
            "titleTa": "${p.name} சிகிச்சை இலக்கு",
            "contentEn": "Procedural focus zone under clinical department ${p.dept}. Inspect 2D illustration for verified details.",
            "contentTa": "${p.dept} துறைக்குரிய சிகிச்சை பகுதி. சரிபார்க்கப்பட்ட வரைபடத்தைக் காண 2D தேர்வை பயன்படுத்தவும்."
      }
],
    educationalSequences: [
      { stepNumber: 1, titleEn: 'Baseline Anatomy', titleTa: 'அடிப்படை உடற்கூறியல்', explanationEn: 'Natural anatomical condition prior to procedural intervention.', explanationTa: 'சிகிச்சைக்கு முந்தைய இயல்பான உடற்கூறியல் நிலை.', cameraPreset: 'front' },
      { stepNumber: 2, titleEn: 'Procedural Intervention', titleTa: 'சிகிச்சை செயல்முறை', explanationEn: 'Key treatment phase demonstrating gentle clinical technique.', explanationTa: 'பாதுகாப்பான முறையில் சிகிச்சை மேற்கொள்ளப்படும் முக்கிய கட்டம்.', cameraPreset: 'cross-section' }
    ]
  },
  'topical-fluoride-treatment': {
    procedureSlug: 'topical-fluoride-treatment',
    modelAssetPath: null,
    modelFamily: 'FULL_DENTAL_ARCH',
    modelState: 'IN_DEVELOPMENT',
    isModelReady: false,
    clinicalReviewStatus: 'EDUCATIONAL_DRAFT',
    provenance: {
      author: 'DentalVis Clinical Anatomy Team',
      license: 'Proprietary / Educational Visual Reference',
      sourceUrl: 'https://dentalvis.org/procedures/topical-fluoride-treatment',
    },
    defaultCameraPosition: [0, 1.5, 6.2],
    defaultCameraTarget: [0, 0, 0],
    cameraPresets: [
      { id: 'front', labelEn: 'Frontal Aspect', labelTa: 'முன்பக்க பார்வை', position: [0, 0.8, 5.8], target: [0, 0, 0] },
      { id: 'cross-section', labelEn: 'Internal Cross-Section', labelTa: 'உட்புற குறுக்குவெட்டு', position: [3.4, 1.6, 4.6], target: [0, 0, 0] },
      { id: 'occlusal', labelEn: 'Occlusal Top View', labelTa: 'மேல் மெல்லும் பரப்பு', position: [0, 6.0, 0.8], target: [0, 0, 0] },
      { id: 'apical', labelEn: 'Apical Root View', labelTa: 'வேர் முனை பார்வை', position: [0, -5.2, 2.0], target: [0, -0.5, 0] },
      { id: 'exploded', labelEn: 'Exploded Component View', labelTa: 'பிரிக்கப்பட்ட அடுக்குகள்', position: [4.4, 2.6, 5.2], target: [0, 0, 0] },
    ],
    layerGroups: [
      {
            "id": "primary",
            "labelEn": "Primary Anatomy",
            "labelTa": "முதன்மை உடற்கூறியல்",
            "defaultVisible": true
      },
      {
            "id": "supporting",
            "labelEn": "Supporting Structures",
            "labelTa": "துணை கட்டமைப்புகள்",
            "defaultVisible": true
      }
],
    structures: [
      {
            "id": "struct-primary",
            "meshName": "Mesh_Primary_Anatomy",
            "labelEn": "${p.name} Anatomical Zone",
            "labelTa": "${p.name} மருத்துவ உடற்கூறு பகுதி",
            "descriptionEn": "Educational anatomical reference area for ${p.name}. Detailed procedure-specific GLB geometry is currently undergoing clinical calibration.",
            "descriptionTa": "${p.name} சிகிச்சைக்குரிய கல்வி உடற்கூறியல் பகுதி. இதற்குரிய 3D மாதிரி தற்போது மருத்துவ அளவுத்திருத்தத்தில் உள்ளது.",
            "layerGroup": "primary",
            "defaultVisible": true,
            "colorHint": "#20B2AA"
      }
],
    hotspots: [
      {
            "id": "hp-primary",
            "structureId": "struct-primary",
            "position": [
                  0,
                  0.5,
                  0.4
            ],
            "titleEn": "${p.name} Clinical Target",
            "titleTa": "${p.name} சிகிச்சை இலக்கு",
            "contentEn": "Procedural focus zone under clinical department ${p.dept}. Inspect 2D illustration for verified details.",
            "contentTa": "${p.dept} துறைக்குரிய சிகிச்சை பகுதி. சரிபார்க்கப்பட்ட வரைபடத்தைக் காண 2D தேர்வை பயன்படுத்தவும்."
      }
],
    educationalSequences: [
      { stepNumber: 1, titleEn: 'Baseline Anatomy', titleTa: 'அடிப்படை உடற்கூறியல்', explanationEn: 'Natural anatomical condition prior to procedural intervention.', explanationTa: 'சிகிச்சைக்கு முந்தைய இயல்பான உடற்கூறியல் நிலை.', cameraPreset: 'front' },
      { stepNumber: 2, titleEn: 'Procedural Intervention', titleTa: 'சிகிச்சை செயல்முறை', explanationEn: 'Key treatment phase demonstrating gentle clinical technique.', explanationTa: 'பாதுகாப்பான முறையில் சிகிச்சை மேற்கொள்ளப்படும் முக்கிய கட்டம்.', cameraPreset: 'cross-section' }
    ]
  },
  'custom-night-guard-bruxism': {
    procedureSlug: 'custom-night-guard-bruxism',
    modelAssetPath: null,
    modelFamily: 'FULL_DENTAL_ARCH',
    modelState: 'IN_DEVELOPMENT',
    isModelReady: false,
    clinicalReviewStatus: 'EDUCATIONAL_DRAFT',
    provenance: {
      author: 'DentalVis Clinical Anatomy Team',
      license: 'Proprietary / Educational Visual Reference',
      sourceUrl: 'https://dentalvis.org/procedures/custom-night-guard-bruxism',
    },
    defaultCameraPosition: [0, 1.5, 6.2],
    defaultCameraTarget: [0, 0, 0],
    cameraPresets: [
      { id: 'front', labelEn: 'Frontal Aspect', labelTa: 'முன்பக்க பார்வை', position: [0, 0.8, 5.8], target: [0, 0, 0] },
      { id: 'cross-section', labelEn: 'Internal Cross-Section', labelTa: 'உட்புற குறுக்குவெட்டு', position: [3.4, 1.6, 4.6], target: [0, 0, 0] },
      { id: 'occlusal', labelEn: 'Occlusal Top View', labelTa: 'மேல் மெல்லும் பரப்பு', position: [0, 6.0, 0.8], target: [0, 0, 0] },
      { id: 'apical', labelEn: 'Apical Root View', labelTa: 'வேர் முனை பார்வை', position: [0, -5.2, 2.0], target: [0, -0.5, 0] },
      { id: 'exploded', labelEn: 'Exploded Component View', labelTa: 'பிரிக்கப்பட்ட அடுக்குகள்', position: [4.4, 2.6, 5.2], target: [0, 0, 0] },
    ],
    layerGroups: [
      {
            "id": "primary",
            "labelEn": "Primary Anatomy",
            "labelTa": "முதன்மை உடற்கூறியல்",
            "defaultVisible": true
      },
      {
            "id": "supporting",
            "labelEn": "Supporting Structures",
            "labelTa": "துணை கட்டமைப்புகள்",
            "defaultVisible": true
      }
],
    structures: [
      {
            "id": "struct-primary",
            "meshName": "Mesh_Primary_Anatomy",
            "labelEn": "${p.name} Anatomical Zone",
            "labelTa": "${p.name} மருத்துவ உடற்கூறு பகுதி",
            "descriptionEn": "Educational anatomical reference area for ${p.name}. Detailed procedure-specific GLB geometry is currently undergoing clinical calibration.",
            "descriptionTa": "${p.name} சிகிச்சைக்குரிய கல்வி உடற்கூறியல் பகுதி. இதற்குரிய 3D மாதிரி தற்போது மருத்துவ அளவுத்திருத்தத்தில் உள்ளது.",
            "layerGroup": "primary",
            "defaultVisible": true,
            "colorHint": "#20B2AA"
      }
],
    hotspots: [
      {
            "id": "hp-primary",
            "structureId": "struct-primary",
            "position": [
                  0,
                  0.5,
                  0.4
            ],
            "titleEn": "${p.name} Clinical Target",
            "titleTa": "${p.name} சிகிச்சை இலக்கு",
            "contentEn": "Procedural focus zone under clinical department ${p.dept}. Inspect 2D illustration for verified details.",
            "contentTa": "${p.dept} துறைக்குரிய சிகிச்சை பகுதி. சரிபார்க்கப்பட்ட வரைபடத்தைக் காண 2D தேர்வை பயன்படுத்தவும்."
      }
],
    educationalSequences: [
      { stepNumber: 1, titleEn: 'Baseline Anatomy', titleTa: 'அடிப்படை உடற்கூறியல்', explanationEn: 'Natural anatomical condition prior to procedural intervention.', explanationTa: 'சிகிச்சைக்கு முந்தைய இயல்பான உடற்கூறியல் நிலை.', cameraPreset: 'front' },
      { stepNumber: 2, titleEn: 'Procedural Intervention', titleTa: 'சிகிச்சை செயல்முறை', explanationEn: 'Key treatment phase demonstrating gentle clinical technique.', explanationTa: 'பாதுகாப்பான முறையில் சிகிச்சை மேற்கொள்ளப்படும் முக்கிய கட்டம்.', cameraPreset: 'cross-section' }
    ]
  },
  'sports-mouthguard-trauma-prevention': {
    procedureSlug: 'sports-mouthguard-trauma-prevention',
    modelAssetPath: null,
    modelFamily: 'FULL_DENTAL_ARCH',
    modelState: 'IN_DEVELOPMENT',
    isModelReady: false,
    clinicalReviewStatus: 'EDUCATIONAL_DRAFT',
    provenance: {
      author: 'DentalVis Clinical Anatomy Team',
      license: 'Proprietary / Educational Visual Reference',
      sourceUrl: 'https://dentalvis.org/procedures/sports-mouthguard-trauma-prevention',
    },
    defaultCameraPosition: [0, 1.5, 6.2],
    defaultCameraTarget: [0, 0, 0],
    cameraPresets: [
      { id: 'front', labelEn: 'Frontal Aspect', labelTa: 'முன்பக்க பார்வை', position: [0, 0.8, 5.8], target: [0, 0, 0] },
      { id: 'cross-section', labelEn: 'Internal Cross-Section', labelTa: 'உட்புற குறுக்குவெட்டு', position: [3.4, 1.6, 4.6], target: [0, 0, 0] },
      { id: 'occlusal', labelEn: 'Occlusal Top View', labelTa: 'மேல் மெல்லும் பரப்பு', position: [0, 6.0, 0.8], target: [0, 0, 0] },
      { id: 'apical', labelEn: 'Apical Root View', labelTa: 'வேர் முனை பார்வை', position: [0, -5.2, 2.0], target: [0, -0.5, 0] },
      { id: 'exploded', labelEn: 'Exploded Component View', labelTa: 'பிரிக்கப்பட்ட அடுக்குகள்', position: [4.4, 2.6, 5.2], target: [0, 0, 0] },
    ],
    layerGroups: [
      {
            "id": "primary",
            "labelEn": "Primary Anatomy",
            "labelTa": "முதன்மை உடற்கூறியல்",
            "defaultVisible": true
      },
      {
            "id": "supporting",
            "labelEn": "Supporting Structures",
            "labelTa": "துணை கட்டமைப்புகள்",
            "defaultVisible": true
      }
],
    structures: [
      {
            "id": "struct-primary",
            "meshName": "Mesh_Primary_Anatomy",
            "labelEn": "${p.name} Anatomical Zone",
            "labelTa": "${p.name} மருத்துவ உடற்கூறு பகுதி",
            "descriptionEn": "Educational anatomical reference area for ${p.name}. Detailed procedure-specific GLB geometry is currently undergoing clinical calibration.",
            "descriptionTa": "${p.name} சிகிச்சைக்குரிய கல்வி உடற்கூறியல் பகுதி. இதற்குரிய 3D மாதிரி தற்போது மருத்துவ அளவுத்திருத்தத்தில் உள்ளது.",
            "layerGroup": "primary",
            "defaultVisible": true,
            "colorHint": "#20B2AA"
      }
],
    hotspots: [
      {
            "id": "hp-primary",
            "structureId": "struct-primary",
            "position": [
                  0,
                  0.5,
                  0.4
            ],
            "titleEn": "${p.name} Clinical Target",
            "titleTa": "${p.name} சிகிச்சை இலக்கு",
            "contentEn": "Procedural focus zone under clinical department ${p.dept}. Inspect 2D illustration for verified details.",
            "contentTa": "${p.dept} துறைக்குரிய சிகிச்சை பகுதி. சரிபார்க்கப்பட்ட வரைபடத்தைக் காண 2D தேர்வை பயன்படுத்தவும்."
      }
],
    educationalSequences: [
      { stepNumber: 1, titleEn: 'Baseline Anatomy', titleTa: 'அடிப்படை உடற்கூறியல்', explanationEn: 'Natural anatomical condition prior to procedural intervention.', explanationTa: 'சிகிச்சைக்கு முந்தைய இயல்பான உடற்கூறியல் நிலை.', cameraPreset: 'front' },
      { stepNumber: 2, titleEn: 'Procedural Intervention', titleTa: 'சிகிச்சை செயல்முறை', explanationEn: 'Key treatment phase demonstrating gentle clinical technique.', explanationTa: 'பாதுகாப்பான முறையில் சிகிச்சை மேற்கொள்ளப்படும் முக்கிய கட்டம்.', cameraPreset: 'cross-section' }
    ]
  },
  'composite-dental-fillings': {
    procedureSlug: 'composite-dental-fillings',
    modelAssetPath: null,
    modelFamily: 'POSTERIOR_MOLAR',
    modelState: 'IN_DEVELOPMENT',
    isModelReady: false,
    clinicalReviewStatus: 'EDUCATIONAL_DRAFT',
    provenance: {
      author: 'DentalVis Clinical Anatomy Team',
      license: 'Proprietary / Educational Visual Reference',
      sourceUrl: 'https://dentalvis.org/procedures/composite-dental-fillings',
    },
    defaultCameraPosition: [0, 1.5, 6.2],
    defaultCameraTarget: [0, 0, 0],
    cameraPresets: [
      { id: 'front', labelEn: 'Frontal Aspect', labelTa: 'முன்பக்க பார்வை', position: [0, 0.8, 5.8], target: [0, 0, 0] },
      { id: 'cross-section', labelEn: 'Internal Cross-Section', labelTa: 'உட்புற குறுக்குவெட்டு', position: [3.4, 1.6, 4.6], target: [0, 0, 0] },
      { id: 'occlusal', labelEn: 'Occlusal Top View', labelTa: 'மேல் மெல்லும் பரப்பு', position: [0, 6.0, 0.8], target: [0, 0, 0] },
      { id: 'apical', labelEn: 'Apical Root View', labelTa: 'வேர் முனை பார்வை', position: [0, -5.2, 2.0], target: [0, -0.5, 0] },
      { id: 'exploded', labelEn: 'Exploded Component View', labelTa: 'பிரிக்கப்பட்ட அடுக்குகள்', position: [4.4, 2.6, 5.2], target: [0, 0, 0] },
    ],
    layerGroups: [
      {
            "id": "primary",
            "labelEn": "Primary Anatomy",
            "labelTa": "முதன்மை உடற்கூறியல்",
            "defaultVisible": true
      },
      {
            "id": "supporting",
            "labelEn": "Supporting Structures",
            "labelTa": "துணை கட்டமைப்புகள்",
            "defaultVisible": true
      }
],
    structures: [
      {
            "id": "struct-primary",
            "meshName": "Mesh_Primary_Anatomy",
            "labelEn": "${p.name} Anatomical Zone",
            "labelTa": "${p.name} மருத்துவ உடற்கூறு பகுதி",
            "descriptionEn": "Educational anatomical reference area for ${p.name}. Detailed procedure-specific GLB geometry is currently undergoing clinical calibration.",
            "descriptionTa": "${p.name} சிகிச்சைக்குரிய கல்வி உடற்கூறியல் பகுதி. இதற்குரிய 3D மாதிரி தற்போது மருத்துவ அளவுத்திருத்தத்தில் உள்ளது.",
            "layerGroup": "primary",
            "defaultVisible": true,
            "colorHint": "#20B2AA"
      }
],
    hotspots: [
      {
            "id": "hp-primary",
            "structureId": "struct-primary",
            "position": [
                  0,
                  0.5,
                  0.4
            ],
            "titleEn": "${p.name} Clinical Target",
            "titleTa": "${p.name} சிகிச்சை இலக்கு",
            "contentEn": "Procedural focus zone under clinical department ${p.dept}. Inspect 2D illustration for verified details.",
            "contentTa": "${p.dept} துறைக்குரிய சிகிச்சை பகுதி. சரிபார்க்கப்பட்ட வரைபடத்தைக் காண 2D தேர்வை பயன்படுத்தவும்."
      }
],
    educationalSequences: [
      { stepNumber: 1, titleEn: 'Baseline Anatomy', titleTa: 'அடிப்படை உடற்கூறியல்', explanationEn: 'Natural anatomical condition prior to procedural intervention.', explanationTa: 'சிகிச்சைக்கு முந்தைய இயல்பான உடற்கூறியல் நிலை.', cameraPreset: 'front' },
      { stepNumber: 2, titleEn: 'Procedural Intervention', titleTa: 'சிகிச்சை செயல்முறை', explanationEn: 'Key treatment phase demonstrating gentle clinical technique.', explanationTa: 'பாதுகாப்பான முறையில் சிகிச்சை மேற்கொள்ளப்படும் முக்கிய கட்டம்.', cameraPreset: 'cross-section' }
    ]
  },
  'inlays-and-onlays': {
    procedureSlug: 'inlays-and-onlays',
    modelAssetPath: null,
    modelFamily: 'POSTERIOR_MOLAR',
    modelState: 'IN_DEVELOPMENT',
    isModelReady: false,
    clinicalReviewStatus: 'EDUCATIONAL_DRAFT',
    provenance: {
      author: 'DentalVis Clinical Anatomy Team',
      license: 'Proprietary / Educational Visual Reference',
      sourceUrl: 'https://dentalvis.org/procedures/inlays-and-onlays',
    },
    defaultCameraPosition: [0, 1.5, 6.2],
    defaultCameraTarget: [0, 0, 0],
    cameraPresets: [
      { id: 'front', labelEn: 'Frontal Aspect', labelTa: 'முன்பக்க பார்வை', position: [0, 0.8, 5.8], target: [0, 0, 0] },
      { id: 'cross-section', labelEn: 'Internal Cross-Section', labelTa: 'உட்புற குறுக்குவெட்டு', position: [3.4, 1.6, 4.6], target: [0, 0, 0] },
      { id: 'occlusal', labelEn: 'Occlusal Top View', labelTa: 'மேல் மெல்லும் பரப்பு', position: [0, 6.0, 0.8], target: [0, 0, 0] },
      { id: 'apical', labelEn: 'Apical Root View', labelTa: 'வேர் முனை பார்வை', position: [0, -5.2, 2.0], target: [0, -0.5, 0] },
      { id: 'exploded', labelEn: 'Exploded Component View', labelTa: 'பிரிக்கப்பட்ட அடுக்குகள்', position: [4.4, 2.6, 5.2], target: [0, 0, 0] },
    ],
    layerGroups: [
      {
            "id": "primary",
            "labelEn": "Primary Anatomy",
            "labelTa": "முதன்மை உடற்கூறியல்",
            "defaultVisible": true
      },
      {
            "id": "supporting",
            "labelEn": "Supporting Structures",
            "labelTa": "துணை கட்டமைப்புகள்",
            "defaultVisible": true
      }
],
    structures: [
      {
            "id": "struct-primary",
            "meshName": "Mesh_Primary_Anatomy",
            "labelEn": "${p.name} Anatomical Zone",
            "labelTa": "${p.name} மருத்துவ உடற்கூறு பகுதி",
            "descriptionEn": "Educational anatomical reference area for ${p.name}. Detailed procedure-specific GLB geometry is currently undergoing clinical calibration.",
            "descriptionTa": "${p.name} சிகிச்சைக்குரிய கல்வி உடற்கூறியல் பகுதி. இதற்குரிய 3D மாதிரி தற்போது மருத்துவ அளவுத்திருத்தத்தில் உள்ளது.",
            "layerGroup": "primary",
            "defaultVisible": true,
            "colorHint": "#20B2AA"
      }
],
    hotspots: [
      {
            "id": "hp-primary",
            "structureId": "struct-primary",
            "position": [
                  0,
                  0.5,
                  0.4
            ],
            "titleEn": "${p.name} Clinical Target",
            "titleTa": "${p.name} சிகிச்சை இலக்கு",
            "contentEn": "Procedural focus zone under clinical department ${p.dept}. Inspect 2D illustration for verified details.",
            "contentTa": "${p.dept} துறைக்குரிய சிகிச்சை பகுதி. சரிபார்க்கப்பட்ட வரைபடத்தைக் காண 2D தேர்வை பயன்படுத்தவும்."
      }
],
    educationalSequences: [
      { stepNumber: 1, titleEn: 'Baseline Anatomy', titleTa: 'அடிப்படை உடற்கூறியல்', explanationEn: 'Natural anatomical condition prior to procedural intervention.', explanationTa: 'சிகிச்சைக்கு முந்தைய இயல்பான உடற்கூறியல் நிலை.', cameraPreset: 'front' },
      { stepNumber: 2, titleEn: 'Procedural Intervention', titleTa: 'சிகிச்சை செயல்முறை', explanationEn: 'Key treatment phase demonstrating gentle clinical technique.', explanationTa: 'பாதுகாப்பான முறையில் சிகிச்சை மேற்கொள்ளப்படும் முக்கிய கட்டம்.', cameraPreset: 'cross-section' }
    ]
  },
  'direct-composite-bonding': {
    procedureSlug: 'direct-composite-bonding',
    modelAssetPath: null,
    modelFamily: 'ANTERIOR_INCISOR',
    modelState: 'IN_DEVELOPMENT',
    isModelReady: false,
    clinicalReviewStatus: 'EDUCATIONAL_DRAFT',
    provenance: {
      author: 'DentalVis Clinical Anatomy Team',
      license: 'Proprietary / Educational Visual Reference',
      sourceUrl: 'https://dentalvis.org/procedures/direct-composite-bonding',
    },
    defaultCameraPosition: [0, 1.5, 6.2],
    defaultCameraTarget: [0, 0, 0],
    cameraPresets: [
      { id: 'front', labelEn: 'Frontal Aspect', labelTa: 'முன்பக்க பார்வை', position: [0, 0.8, 5.8], target: [0, 0, 0] },
      { id: 'cross-section', labelEn: 'Internal Cross-Section', labelTa: 'உட்புற குறுக்குவெட்டு', position: [3.4, 1.6, 4.6], target: [0, 0, 0] },
      { id: 'occlusal', labelEn: 'Occlusal Top View', labelTa: 'மேல் மெல்லும் பரப்பு', position: [0, 6.0, 0.8], target: [0, 0, 0] },
      { id: 'apical', labelEn: 'Apical Root View', labelTa: 'வேர் முனை பார்வை', position: [0, -5.2, 2.0], target: [0, -0.5, 0] },
      { id: 'exploded', labelEn: 'Exploded Component View', labelTa: 'பிரிக்கப்பட்ட அடுக்குகள்', position: [4.4, 2.6, 5.2], target: [0, 0, 0] },
    ],
    layerGroups: [
      {
            "id": "primary",
            "labelEn": "Primary Anatomy",
            "labelTa": "முதன்மை உடற்கூறியல்",
            "defaultVisible": true
      },
      {
            "id": "supporting",
            "labelEn": "Supporting Structures",
            "labelTa": "துணை கட்டமைப்புகள்",
            "defaultVisible": true
      }
],
    structures: [
      {
            "id": "struct-primary",
            "meshName": "Mesh_Primary_Anatomy",
            "labelEn": "${p.name} Anatomical Zone",
            "labelTa": "${p.name} மருத்துவ உடற்கூறு பகுதி",
            "descriptionEn": "Educational anatomical reference area for ${p.name}. Detailed procedure-specific GLB geometry is currently undergoing clinical calibration.",
            "descriptionTa": "${p.name} சிகிச்சைக்குரிய கல்வி உடற்கூறியல் பகுதி. இதற்குரிய 3D மாதிரி தற்போது மருத்துவ அளவுத்திருத்தத்தில் உள்ளது.",
            "layerGroup": "primary",
            "defaultVisible": true,
            "colorHint": "#20B2AA"
      }
],
    hotspots: [
      {
            "id": "hp-primary",
            "structureId": "struct-primary",
            "position": [
                  0,
                  0.5,
                  0.4
            ],
            "titleEn": "${p.name} Clinical Target",
            "titleTa": "${p.name} சிகிச்சை இலக்கு",
            "contentEn": "Procedural focus zone under clinical department ${p.dept}. Inspect 2D illustration for verified details.",
            "contentTa": "${p.dept} துறைக்குரிய சிகிச்சை பகுதி. சரிபார்க்கப்பட்ட வரைபடத்தைக் காண 2D தேர்வை பயன்படுத்தவும்."
      }
],
    educationalSequences: [
      { stepNumber: 1, titleEn: 'Baseline Anatomy', titleTa: 'அடிப்படை உடற்கூறியல்', explanationEn: 'Natural anatomical condition prior to procedural intervention.', explanationTa: 'சிகிச்சைக்கு முந்தைய இயல்பான உடற்கூறியல் நிலை.', cameraPreset: 'front' },
      { stepNumber: 2, titleEn: 'Procedural Intervention', titleTa: 'சிகிச்சை செயல்முறை', explanationEn: 'Key treatment phase demonstrating gentle clinical technique.', explanationTa: 'பாதுகாப்பான முறையில் சிகிச்சை மேற்கொள்ளப்படும் முக்கிய கட்டம்.', cameraPreset: 'cross-section' }
    ]
  },
  'pulp-capping': {
    procedureSlug: 'pulp-capping',
    modelAssetPath: null,
    modelFamily: 'POSTERIOR_MOLAR',
    modelState: 'IN_DEVELOPMENT',
    isModelReady: false,
    clinicalReviewStatus: 'EDUCATIONAL_DRAFT',
    provenance: {
      author: 'DentalVis Clinical Anatomy Team',
      license: 'Proprietary / Educational Visual Reference',
      sourceUrl: 'https://dentalvis.org/procedures/pulp-capping',
    },
    defaultCameraPosition: [0, 1.5, 6.2],
    defaultCameraTarget: [0, 0, 0],
    cameraPresets: [
      { id: 'front', labelEn: 'Frontal Aspect', labelTa: 'முன்பக்க பார்வை', position: [0, 0.8, 5.8], target: [0, 0, 0] },
      { id: 'cross-section', labelEn: 'Internal Cross-Section', labelTa: 'உட்புற குறுக்குவெட்டு', position: [3.4, 1.6, 4.6], target: [0, 0, 0] },
      { id: 'occlusal', labelEn: 'Occlusal Top View', labelTa: 'மேல் மெல்லும் பரப்பு', position: [0, 6.0, 0.8], target: [0, 0, 0] },
      { id: 'apical', labelEn: 'Apical Root View', labelTa: 'வேர் முனை பார்வை', position: [0, -5.2, 2.0], target: [0, -0.5, 0] },
      { id: 'exploded', labelEn: 'Exploded Component View', labelTa: 'பிரிக்கப்பட்ட அடுக்குகள்', position: [4.4, 2.6, 5.2], target: [0, 0, 0] },
    ],
    layerGroups: [
      {
            "id": "primary",
            "labelEn": "Primary Anatomy",
            "labelTa": "முதன்மை உடற்கூறியல்",
            "defaultVisible": true
      },
      {
            "id": "supporting",
            "labelEn": "Supporting Structures",
            "labelTa": "துணை கட்டமைப்புகள்",
            "defaultVisible": true
      }
],
    structures: [
      {
            "id": "struct-primary",
            "meshName": "Mesh_Primary_Anatomy",
            "labelEn": "${p.name} Anatomical Zone",
            "labelTa": "${p.name} மருத்துவ உடற்கூறு பகுதி",
            "descriptionEn": "Educational anatomical reference area for ${p.name}. Detailed procedure-specific GLB geometry is currently undergoing clinical calibration.",
            "descriptionTa": "${p.name} சிகிச்சைக்குரிய கல்வி உடற்கூறியல் பகுதி. இதற்குரிய 3D மாதிரி தற்போது மருத்துவ அளவுத்திருத்தத்தில் உள்ளது.",
            "layerGroup": "primary",
            "defaultVisible": true,
            "colorHint": "#20B2AA"
      }
],
    hotspots: [
      {
            "id": "hp-primary",
            "structureId": "struct-primary",
            "position": [
                  0,
                  0.5,
                  0.4
            ],
            "titleEn": "${p.name} Clinical Target",
            "titleTa": "${p.name} சிகிச்சை இலக்கு",
            "contentEn": "Procedural focus zone under clinical department ${p.dept}. Inspect 2D illustration for verified details.",
            "contentTa": "${p.dept} துறைக்குரிய சிகிச்சை பகுதி. சரிபார்க்கப்பட்ட வரைபடத்தைக் காண 2D தேர்வை பயன்படுத்தவும்."
      }
],
    educationalSequences: [
      { stepNumber: 1, titleEn: 'Baseline Anatomy', titleTa: 'அடிப்படை உடற்கூறியல்', explanationEn: 'Natural anatomical condition prior to procedural intervention.', explanationTa: 'சிகிச்சைக்கு முந்தைய இயல்பான உடற்கூறியல் நிலை.', cameraPreset: 'front' },
      { stepNumber: 2, titleEn: 'Procedural Intervention', titleTa: 'சிகிச்சை செயல்முறை', explanationEn: 'Key treatment phase demonstrating gentle clinical technique.', explanationTa: 'பாதுகாப்பான முறையில் சிகிச்சை மேற்கொள்ளப்படும் முக்கிய கட்டம்.', cameraPreset: 'cross-section' }
    ]
  },
  'root-canal-treatment': {
    procedureSlug: 'root-canal-treatment',
    modelAssetPath: '/models/molar-endodontic-anatomy.glb',
    modelFamily: 'POSTERIOR_MOLAR',
    modelState: 'AVAILABLE_AND_FUNCTIONAL',
    isModelReady: true,
    clinicalReviewStatus: 'EDUCATIONAL_DRAFT',
    provenance: {
      author: 'DentalVis Clinical Anatomy Team',
      license: 'Proprietary / Educational Visual Reference',
      sourceUrl: 'https://dentalvis.org/procedures/root-canal-treatment',
    },
    defaultCameraPosition: [0, 1.5, 6.2],
    defaultCameraTarget: [0, 0, 0],
    cameraPresets: [
      { id: 'front', labelEn: 'Frontal Aspect', labelTa: 'முன்பக்க பார்வை', position: [0, 0.8, 5.8], target: [0, 0, 0] },
      { id: 'cross-section', labelEn: 'Internal Cross-Section', labelTa: 'உட்புற குறுக்குவெட்டு', position: [3.4, 1.6, 4.6], target: [0, 0, 0] },
      { id: 'occlusal', labelEn: 'Occlusal Top View', labelTa: 'மேல் மெல்லும் பரப்பு', position: [0, 6.0, 0.8], target: [0, 0, 0] },
      { id: 'apical', labelEn: 'Apical Root View', labelTa: 'வேர் முனை பார்வை', position: [0, -5.2, 2.0], target: [0, -0.5, 0] },
      { id: 'exploded', labelEn: 'Exploded Component View', labelTa: 'பிரிக்கப்பட்ட அடுக்குகள்', position: [4.4, 2.6, 5.2], target: [0, 0, 0] },
    ],
    layerGroups: [
      {
            "id": "enamel",
            "labelEn": "Outer Enamel",
            "labelTa": "வெளிப்புற எனாமல்",
            "defaultVisible": true
      },
      {
            "id": "dentin",
            "labelEn": "Dentin Core",
            "labelTa": "டென்டின் உடல்",
            "defaultVisible": true
      },
      {
            "id": "pulp",
            "labelEn": "Pulp & Canals",
            "labelTa": "நரம்பு & கால்வாய்கள்",
            "defaultVisible": true
      },
      {
            "id": "bone",
            "labelEn": "Alveolar Bone",
            "labelTa": "தாடை எலும்பு",
            "defaultVisible": true
      },
      {
            "id": "gingiva",
            "labelEn": "Gingiva (Gums)",
            "labelTa": "ஈறு திசு",
            "defaultVisible": true
      }
],
    structures: [
      {
            "id": "enamel-shell",
            "meshName": "Mesh_Enamel_Outer",
            "labelEn": "Translucent Enamel Shell",
            "labelTa": "ஒளிரும் எனாமல் வெளி அடுக்கு",
            "descriptionEn": "The hard outer mineralized crown surface protecting the inner tooth structures.",
            "descriptionTa": "பல்லைப் பாதுகாக்கும் கடினமான வெளிப்புற எனாமல் அடுக்கு.",
            "layerGroup": "enamel",
            "defaultVisible": true,
            "colorHint": "#E8F7F6"
      },
      {
            "id": "dentin-body",
            "meshName": "Mesh_Dentin_Body",
            "labelEn": "Living Dentin Core",
            "labelTa": "உயிருள்ள டென்டின் அடுக்கு",
            "descriptionEn": "Microscopic tubules transmitting temperature sensations to the pulp nerve.",
            "descriptionTa": "வெப்பம் மற்றும் கூச்சத்தை உணர்த்தும் நுண்ணிய டென்டின் குழாய்கள்.",
            "layerGroup": "dentin",
            "defaultVisible": true,
            "colorHint": "#F9EEC8"
      },
      {
            "id": "pulp-chamber",
            "meshName": "Mesh_Pulp_Chamber",
            "labelEn": "Coronal Pulp Chamber",
            "labelTa": "கிரவுன் நரம்பு அறை",
            "descriptionEn": "Soft vascular tissue chamber safely debrided and disinfected during RCT.",
            "descriptionTa": "வேர் கால்வாய் சிகிச்சையில் சுத்தம் செய்யப்படும் நரம்பு மற்றும் இரத்த நாளப் பகுதி.",
            "layerGroup": "pulp",
            "defaultVisible": true,
            "colorHint": "#DC3545"
      },
      {
            "id": "root-canals",
            "meshName": "Mesh_Canal_Mesial",
            "labelEn": "Mesial & Distal Root Canals",
            "labelTa": "வேர் கால்வாய்கள்",
            "descriptionEn": "Microscopic radicular canals sealed permanently with biocompatible gutta-percha.",
            "descriptionTa": "கிருமிநாசினி ரப்பர் கொண்டு நிரந்தரமாக சீல் செய்யப்படும் வேர் கால்வாய்கள்.",
            "layerGroup": "pulp",
            "defaultVisible": true,
            "colorHint": "#C82333"
      },
      {
            "id": "alveolar-bone",
            "meshName": "Mesh_Alveolar_Housing",
            "labelEn": "Alveolar Bone Socket",
            "labelTa": "தாடை எலும்பு கூண்டு",
            "descriptionEn": "Dense supportive jawbone housing holding the tooth roots in position.",
            "descriptionTa": "பல் வேர்களை தாடையோடு உறுதியாக பிணைத்து நிலைநிறுத்தும் எலும்புப் பகுதி.",
            "layerGroup": "bone",
            "defaultVisible": true,
            "colorHint": "#D9E5E7"
      },
      {
            "id": "gingiva-tissue",
            "meshName": "Mesh_Gingiva_Tissue",
            "labelEn": "Attached Gingiva",
            "labelTa": "இணைக்கப்பட்ட ஈறு திசு",
            "descriptionEn": "Protective oral mucosal seal around the tooth neck.",
            "descriptionTa": "பல்லின் கழுத்துப் பகுதியை மூடி பாதுகாக்கும் ஈறு திசு.",
            "layerGroup": "gingiva",
            "defaultVisible": true,
            "colorHint": "#F49DA3"
      }
],
    hotspots: [
      {
            "id": "hp-crown",
            "structureId": "enamel-shell",
            "position": [
                  0,
                  0.9,
                  0.4
            ],
            "titleEn": "Coronal Enamel Surface",
            "titleTa": "பல் மகுட எனாமல் பகுதி",
            "contentEn": "Outer mineralized layer susceptible to dietary acid erosion and cavity formation.",
            "contentTa": "உணவு சர்க்கரையினால் ஏற்படும் அமில அரிப்பு தொடங்கும் எனாமல் பகுதி."
      },
      {
            "id": "hp-pulp",
            "structureId": "pulp-chamber",
            "position": [
                  0,
                  0.6,
                  0.25
            ],
            "titleEn": "Infected Dental Pulp",
            "titleTa": "தொற்றுக்குள்ளான பல் நரம்பு",
            "contentEn": "Pulp chamber debrided with micro-instruments to relieve pain.",
            "contentTa": "வலியைப் போக்க மென்மையாக அகற்றப்படும் நரம்புப் பகுதி."
      },
      {
            "id": "hp-apex",
            "structureId": "root-canals",
            "position": [
                  0,
                  -0.4,
                  0.1
            ],
            "titleEn": "Apical Foramen Sealing",
            "titleTa": "வேர் முனை சீல் செய்தல்",
            "contentEn": "Hermetically sealed root tip preventing reinfection of surrounding bone.",
            "contentTa": "தாடை எலும்பில் தொற்று பரவாமல் தடுக்க நிரந்தரமாக மூடப்படும் வேர் முனை."
      }
],
    educationalSequences: [
      { stepNumber: 1, titleEn: 'Baseline Anatomy', titleTa: 'அடிப்படை உடற்கூறியல்', explanationEn: 'Natural anatomical condition prior to procedural intervention.', explanationTa: 'சிகிச்சைக்கு முந்தைய இயல்பான உடற்கூறியல் நிலை.', cameraPreset: 'front' },
      { stepNumber: 2, titleEn: 'Procedural Intervention', titleTa: 'சிகிச்சை செயல்முறை', explanationEn: 'Key treatment phase demonstrating gentle clinical technique.', explanationTa: 'பாதுகாப்பான முறையில் சிகிச்சை மேற்கொள்ளப்படும் முக்கிய கட்டம்.', cameraPreset: 'cross-section' }
    ]
  },
  'endodontic-retreatment': {
    procedureSlug: 'endodontic-retreatment',
    modelAssetPath: null,
    modelFamily: 'POSTERIOR_MOLAR',
    modelState: 'IN_DEVELOPMENT',
    isModelReady: false,
    clinicalReviewStatus: 'EDUCATIONAL_DRAFT',
    provenance: {
      author: 'DentalVis Clinical Anatomy Team',
      license: 'Proprietary / Educational Visual Reference',
      sourceUrl: 'https://dentalvis.org/procedures/endodontic-retreatment',
    },
    defaultCameraPosition: [0, 1.5, 6.2],
    defaultCameraTarget: [0, 0, 0],
    cameraPresets: [
      { id: 'front', labelEn: 'Frontal Aspect', labelTa: 'முன்பக்க பார்வை', position: [0, 0.8, 5.8], target: [0, 0, 0] },
      { id: 'cross-section', labelEn: 'Internal Cross-Section', labelTa: 'உட்புற குறுக்குவெட்டு', position: [3.4, 1.6, 4.6], target: [0, 0, 0] },
      { id: 'occlusal', labelEn: 'Occlusal Top View', labelTa: 'மேல் மெல்லும் பரப்பு', position: [0, 6.0, 0.8], target: [0, 0, 0] },
      { id: 'apical', labelEn: 'Apical Root View', labelTa: 'வேர் முனை பார்வை', position: [0, -5.2, 2.0], target: [0, -0.5, 0] },
      { id: 'exploded', labelEn: 'Exploded Component View', labelTa: 'பிரிக்கப்பட்ட அடுக்குகள்', position: [4.4, 2.6, 5.2], target: [0, 0, 0] },
    ],
    layerGroups: [
      {
            "id": "primary",
            "labelEn": "Primary Anatomy",
            "labelTa": "முதன்மை உடற்கூறியல்",
            "defaultVisible": true
      },
      {
            "id": "supporting",
            "labelEn": "Supporting Structures",
            "labelTa": "துணை கட்டமைப்புகள்",
            "defaultVisible": true
      }
],
    structures: [
      {
            "id": "struct-primary",
            "meshName": "Mesh_Primary_Anatomy",
            "labelEn": "${p.name} Anatomical Zone",
            "labelTa": "${p.name} மருத்துவ உடற்கூறு பகுதி",
            "descriptionEn": "Educational anatomical reference area for ${p.name}. Detailed procedure-specific GLB geometry is currently undergoing clinical calibration.",
            "descriptionTa": "${p.name} சிகிச்சைக்குரிய கல்வி உடற்கூறியல் பகுதி. இதற்குரிய 3D மாதிரி தற்போது மருத்துவ அளவுத்திருத்தத்தில் உள்ளது.",
            "layerGroup": "primary",
            "defaultVisible": true,
            "colorHint": "#20B2AA"
      }
],
    hotspots: [
      {
            "id": "hp-primary",
            "structureId": "struct-primary",
            "position": [
                  0,
                  0.5,
                  0.4
            ],
            "titleEn": "${p.name} Clinical Target",
            "titleTa": "${p.name} சிகிச்சை இலக்கு",
            "contentEn": "Procedural focus zone under clinical department ${p.dept}. Inspect 2D illustration for verified details.",
            "contentTa": "${p.dept} துறைக்குரிய சிகிச்சை பகுதி. சரிபார்க்கப்பட்ட வரைபடத்தைக் காண 2D தேர்வை பயன்படுத்தவும்."
      }
],
    educationalSequences: [
      { stepNumber: 1, titleEn: 'Baseline Anatomy', titleTa: 'அடிப்படை உடற்கூறியல்', explanationEn: 'Natural anatomical condition prior to procedural intervention.', explanationTa: 'சிகிச்சைக்கு முந்தைய இயல்பான உடற்கூறியல் நிலை.', cameraPreset: 'front' },
      { stepNumber: 2, titleEn: 'Procedural Intervention', titleTa: 'சிகிச்சை செயல்முறை', explanationEn: 'Key treatment phase demonstrating gentle clinical technique.', explanationTa: 'பாதுகாப்பான முறையில் சிகிச்சை மேற்கொள்ளப்படும் முக்கிய கட்டம்.', cameraPreset: 'cross-section' }
    ]
  },
  'apicoectomy': {
    procedureSlug: 'apicoectomy',
    modelAssetPath: null,
    modelFamily: 'POSTERIOR_MOLAR',
    modelState: 'IN_DEVELOPMENT',
    isModelReady: false,
    clinicalReviewStatus: 'EDUCATIONAL_DRAFT',
    provenance: {
      author: 'DentalVis Clinical Anatomy Team',
      license: 'Proprietary / Educational Visual Reference',
      sourceUrl: 'https://dentalvis.org/procedures/apicoectomy',
    },
    defaultCameraPosition: [0, 1.5, 6.2],
    defaultCameraTarget: [0, 0, 0],
    cameraPresets: [
      { id: 'front', labelEn: 'Frontal Aspect', labelTa: 'முன்பக்க பார்வை', position: [0, 0.8, 5.8], target: [0, 0, 0] },
      { id: 'cross-section', labelEn: 'Internal Cross-Section', labelTa: 'உட்புற குறுக்குவெட்டு', position: [3.4, 1.6, 4.6], target: [0, 0, 0] },
      { id: 'occlusal', labelEn: 'Occlusal Top View', labelTa: 'மேல் மெல்லும் பரப்பு', position: [0, 6.0, 0.8], target: [0, 0, 0] },
      { id: 'apical', labelEn: 'Apical Root View', labelTa: 'வேர் முனை பார்வை', position: [0, -5.2, 2.0], target: [0, -0.5, 0] },
      { id: 'exploded', labelEn: 'Exploded Component View', labelTa: 'பிரிக்கப்பட்ட அடுக்குகள்', position: [4.4, 2.6, 5.2], target: [0, 0, 0] },
    ],
    layerGroups: [
      {
            "id": "primary",
            "labelEn": "Primary Anatomy",
            "labelTa": "முதன்மை உடற்கூறியல்",
            "defaultVisible": true
      },
      {
            "id": "supporting",
            "labelEn": "Supporting Structures",
            "labelTa": "துணை கட்டமைப்புகள்",
            "defaultVisible": true
      }
],
    structures: [
      {
            "id": "struct-primary",
            "meshName": "Mesh_Primary_Anatomy",
            "labelEn": "${p.name} Anatomical Zone",
            "labelTa": "${p.name} மருத்துவ உடற்கூறு பகுதி",
            "descriptionEn": "Educational anatomical reference area for ${p.name}. Detailed procedure-specific GLB geometry is currently undergoing clinical calibration.",
            "descriptionTa": "${p.name} சிகிச்சைக்குரிய கல்வி உடற்கூறியல் பகுதி. இதற்குரிய 3D மாதிரி தற்போது மருத்துவ அளவுத்திருத்தத்தில் உள்ளது.",
            "layerGroup": "primary",
            "defaultVisible": true,
            "colorHint": "#20B2AA"
      }
],
    hotspots: [
      {
            "id": "hp-primary",
            "structureId": "struct-primary",
            "position": [
                  0,
                  0.5,
                  0.4
            ],
            "titleEn": "${p.name} Clinical Target",
            "titleTa": "${p.name} சிகிச்சை இலக்கு",
            "contentEn": "Procedural focus zone under clinical department ${p.dept}. Inspect 2D illustration for verified details.",
            "contentTa": "${p.dept} துறைக்குரிய சிகிச்சை பகுதி. சரிபார்க்கப்பட்ட வரைபடத்தைக் காண 2D தேர்வை பயன்படுத்தவும்."
      }
],
    educationalSequences: [
      { stepNumber: 1, titleEn: 'Baseline Anatomy', titleTa: 'அடிப்படை உடற்கூறியல்', explanationEn: 'Natural anatomical condition prior to procedural intervention.', explanationTa: 'சிகிச்சைக்கு முந்தைய இயல்பான உடற்கூறியல் நிலை.', cameraPreset: 'front' },
      { stepNumber: 2, titleEn: 'Procedural Intervention', titleTa: 'சிகிச்சை செயல்முறை', explanationEn: 'Key treatment phase demonstrating gentle clinical technique.', explanationTa: 'பாதுகாப்பான முறையில் சிகிச்சை மேற்கொள்ளப்படும் முக்கிய கட்டம்.', cameraPreset: 'cross-section' }
    ]
  },
  'internal-tooth-bleaching': {
    procedureSlug: 'internal-tooth-bleaching',
    modelAssetPath: null,
    modelFamily: 'ANTERIOR_INCISOR',
    modelState: 'IN_DEVELOPMENT',
    isModelReady: false,
    clinicalReviewStatus: 'EDUCATIONAL_DRAFT',
    provenance: {
      author: 'DentalVis Clinical Anatomy Team',
      license: 'Proprietary / Educational Visual Reference',
      sourceUrl: 'https://dentalvis.org/procedures/internal-tooth-bleaching',
    },
    defaultCameraPosition: [0, 1.5, 6.2],
    defaultCameraTarget: [0, 0, 0],
    cameraPresets: [
      { id: 'front', labelEn: 'Frontal Aspect', labelTa: 'முன்பக்க பார்வை', position: [0, 0.8, 5.8], target: [0, 0, 0] },
      { id: 'cross-section', labelEn: 'Internal Cross-Section', labelTa: 'உட்புற குறுக்குவெட்டு', position: [3.4, 1.6, 4.6], target: [0, 0, 0] },
      { id: 'occlusal', labelEn: 'Occlusal Top View', labelTa: 'மேல் மெல்லும் பரப்பு', position: [0, 6.0, 0.8], target: [0, 0, 0] },
      { id: 'apical', labelEn: 'Apical Root View', labelTa: 'வேர் முனை பார்வை', position: [0, -5.2, 2.0], target: [0, -0.5, 0] },
      { id: 'exploded', labelEn: 'Exploded Component View', labelTa: 'பிரிக்கப்பட்ட அடுக்குகள்', position: [4.4, 2.6, 5.2], target: [0, 0, 0] },
    ],
    layerGroups: [
      {
            "id": "primary",
            "labelEn": "Primary Anatomy",
            "labelTa": "முதன்மை உடற்கூறியல்",
            "defaultVisible": true
      },
      {
            "id": "supporting",
            "labelEn": "Supporting Structures",
            "labelTa": "துணை கட்டமைப்புகள்",
            "defaultVisible": true
      }
],
    structures: [
      {
            "id": "struct-primary",
            "meshName": "Mesh_Primary_Anatomy",
            "labelEn": "${p.name} Anatomical Zone",
            "labelTa": "${p.name} மருத்துவ உடற்கூறு பகுதி",
            "descriptionEn": "Educational anatomical reference area for ${p.name}. Detailed procedure-specific GLB geometry is currently undergoing clinical calibration.",
            "descriptionTa": "${p.name} சிகிச்சைக்குரிய கல்வி உடற்கூறியல் பகுதி. இதற்குரிய 3D மாதிரி தற்போது மருத்துவ அளவுத்திருத்தத்தில் உள்ளது.",
            "layerGroup": "primary",
            "defaultVisible": true,
            "colorHint": "#20B2AA"
      }
],
    hotspots: [
      {
            "id": "hp-primary",
            "structureId": "struct-primary",
            "position": [
                  0,
                  0.5,
                  0.4
            ],
            "titleEn": "${p.name} Clinical Target",
            "titleTa": "${p.name} சிகிச்சை இலக்கு",
            "contentEn": "Procedural focus zone under clinical department ${p.dept}. Inspect 2D illustration for verified details.",
            "contentTa": "${p.dept} துறைக்குரிய சிகிச்சை பகுதி. சரிபார்க்கப்பட்ட வரைபடத்தைக் காண 2D தேர்வை பயன்படுத்தவும்."
      }
],
    educationalSequences: [
      { stepNumber: 1, titleEn: 'Baseline Anatomy', titleTa: 'அடிப்படை உடற்கூறியல்', explanationEn: 'Natural anatomical condition prior to procedural intervention.', explanationTa: 'சிகிச்சைக்கு முந்தைய இயல்பான உடற்கூறியல் நிலை.', cameraPreset: 'front' },
      { stepNumber: 2, titleEn: 'Procedural Intervention', titleTa: 'சிகிச்சை செயல்முறை', explanationEn: 'Key treatment phase demonstrating gentle clinical technique.', explanationTa: 'பாதுகாப்பான முறையில் சிகிச்சை மேற்கொள்ளப்படும் முக்கிய கட்டம்.', cameraPreset: 'cross-section' }
    ]
  },
  'deep-cleaning-scaling': {
    procedureSlug: 'deep-cleaning-scaling',
    modelAssetPath: '/models/deep-cleaning-periodontics.glb',
    modelFamily: 'PERIODONTAL_QUADRANT',
    modelState: 'AVAILABLE_AND_FUNCTIONAL',
    isModelReady: true,
    clinicalReviewStatus: 'EDUCATIONAL_DRAFT',
    provenance: {
      author: 'DentalVis Clinical Anatomy Team',
      license: 'Proprietary / Educational Visual Reference',
      sourceUrl: 'https://dentalvis.org/procedures/deep-cleaning-scaling',
    },
    defaultCameraPosition: [0, 1.5, 6.2],
    defaultCameraTarget: [0, 0, 0],
    cameraPresets: [
      { id: 'front', labelEn: 'Frontal Aspect', labelTa: 'முன்பக்க பார்வை', position: [0, 0.8, 5.8], target: [0, 0, 0] },
      { id: 'cross-section', labelEn: 'Internal Cross-Section', labelTa: 'உட்புற குறுக்குவெட்டு', position: [3.4, 1.6, 4.6], target: [0, 0, 0] },
      { id: 'occlusal', labelEn: 'Occlusal Top View', labelTa: 'மேல் மெல்லும் பரப்பு', position: [0, 6.0, 0.8], target: [0, 0, 0] },
      { id: 'apical', labelEn: 'Apical Root View', labelTa: 'வேர் முனை பார்வை', position: [0, -5.2, 2.0], target: [0, -0.5, 0] },
      { id: 'exploded', labelEn: 'Exploded Component View', labelTa: 'பிரிக்கப்பட்ட அடுக்குகள்', position: [4.4, 2.6, 5.2], target: [0, 0, 0] },
    ],
    layerGroups: [
      {
            "id": "calculus",
            "labelEn": "Calculus Deposits",
            "labelTa": "காரை படிவுகள்",
            "defaultVisible": true
      },
      {
            "id": "gingiva",
            "labelEn": "Gingival Pocket",
            "labelTa": "ஈறு பாக்கெட்",
            "defaultVisible": true
      },
      {
            "id": "teeth",
            "labelEn": "Teeth Structure",
            "labelTa": "பற்கள் கட்டமைப்பு",
            "defaultVisible": true
      },
      {
            "id": "bone",
            "labelEn": "Alveolar Bone",
            "labelTa": "தாடை எலும்பு",
            "defaultVisible": true
      }
],
    structures: [
      {
            "id": "subgingival-calculus",
            "meshName": "Mesh_Subgingival_Calculus",
            "labelEn": "Hardened Subgingival Calculus",
            "labelTa": "ஈறுகளுக்கு அடியில் உள்ள கடின காரை",
            "descriptionEn": "Mineralized bacterial plaque deposits beneath the gumline causing tissue inflammation and bone loss.",
            "descriptionTa": "ஈறுகளுக்கு அடியில் படிந்து ஈறு நோய் மற்றும் எலும்பு தேய்மானத்தை உண்டாக்கும் காரை.",
            "layerGroup": "calculus",
            "defaultVisible": true,
            "colorHint": "#7A6953"
      },
      {
            "id": "periodontal-pocket",
            "meshName": "Mesh_Periodontal_Pocket",
            "labelEn": "Inflamed Periodontal Pocket",
            "labelTa": "வீக்கமடைந்த ஈறு பாக்கெட்",
            "descriptionEn": "Deepened pocket (>4mm) harboring anaerobic bacteria requiring ultrasonic debridement.",
            "descriptionTa": "காரை படிவதால் ஆழமாக விரிவடையும் ஈறு இடைவெளி; இதை சுத்தம் செய்வது அவசியம்.",
            "layerGroup": "gingiva",
            "defaultVisible": true,
            "colorHint": "#E87A84"
      },
      {
            "id": "tooth-premolar",
            "meshName": "Mesh_Tooth_Premolar_Crown",
            "labelEn": "Premolar Tooth & Root",
            "labelTa": "முன் கடவாய்ப் பல் & வேர்",
            "descriptionEn": "Natural tooth showing root surfaces being planned and smoothed.",
            "descriptionTa": "சுத்தம் செய்யப்பட்டு மெருகூட்டப்படும் பல்லின் வேர் பகுதி.",
            "layerGroup": "teeth",
            "defaultVisible": true,
            "colorHint": "#F5EBD0"
      },
      {
            "id": "tooth-molar",
            "meshName": "Mesh_Tooth_Molar_Crown",
            "labelEn": "Molar Tooth & Root Trunk",
            "labelTa": "முக்கிய கடவாய்ப் பல் & வேர்",
            "descriptionEn": "Multi-rooted posterior tooth requiring thorough furcation cleaning.",
            "descriptionTa": "வேர்கள் பிரியும் பகுதி வரை ஆழமாக சுத்தம் செய்யப்படும் கடவாய்ப் பல்.",
            "layerGroup": "teeth",
            "defaultVisible": true,
            "colorHint": "#F5EBD0"
      },
      {
            "id": "alveolar-crest",
            "meshName": "Mesh_Alveolar_Bone_Crest",
            "labelEn": "Alveolar Crest Bone",
            "labelTa": "தாடை எலும்பு விளிம்பு",
            "descriptionEn": "Bone crest preserved and protected from further resorption by calculus removal.",
            "descriptionTa": "காரையை அகற்றுவதன் மூலம் மேலும் தேய்மானம் அடையாமல் பாதுகாக்கப்படும் எலும்பு.",
            "layerGroup": "bone",
            "defaultVisible": true,
            "colorHint": "#D9E5E7"
      }
],
    hotspots: [
      {
            "id": "hp-tartar-site",
            "structureId": "subgingival-calculus",
            "position": [
                  -0.7,
                  -0.15,
                  0.4
            ],
            "titleEn": "Subgingival Tartar Accumulation",
            "titleTa": "ஈறுகளுக்கு அடியில் உள்ள காரை",
            "contentEn": "Ultrasonic scaler uses cool water vibrations to shatter hardened deposits.",
            "contentTa": "அல்ட்ராசோனிக் கருவி மூலம் மென்மையாக உடைத்து அகற்றப்படும் காரை."
      },
      {
            "id": "hp-pocket-depth",
            "structureId": "periodontal-pocket",
            "position": [
                  0.7,
                  -0.15,
                  0.45
            ],
            "titleEn": "Pocket Measurement Site",
            "titleTa": "ஈறு பாக்கெட் ஆழம்",
            "contentEn": "Scaling allows healthy gum tissue to re-adhere closely to clean root dentin.",
            "contentTa": "சுத்தம் செய்த பிறகு ஈறுகள் மீண்டும் வேரோடு இறுக்கமாக ஒட்டிக்கொள்கின்றன."
      }
],
    educationalSequences: [
      { stepNumber: 1, titleEn: 'Baseline Anatomy', titleTa: 'அடிப்படை உடற்கூறியல்', explanationEn: 'Natural anatomical condition prior to procedural intervention.', explanationTa: 'சிகிச்சைக்கு முந்தைய இயல்பான உடற்கூறியல் நிலை.', cameraPreset: 'front' },
      { stepNumber: 2, titleEn: 'Procedural Intervention', titleTa: 'சிகிச்சை செயல்முறை', explanationEn: 'Key treatment phase demonstrating gentle clinical technique.', explanationTa: 'பாதுகாப்பான முறையில் சிகிச்சை மேற்கொள்ளப்படும் முக்கிய கட்டம்.', cameraPreset: 'cross-section' }
    ]
  },
  'gingival-flap-surgery': {
    procedureSlug: 'gingival-flap-surgery',
    modelAssetPath: null,
    modelFamily: 'PERIODONTAL_QUADRANT',
    modelState: 'IN_DEVELOPMENT',
    isModelReady: false,
    clinicalReviewStatus: 'EDUCATIONAL_DRAFT',
    provenance: {
      author: 'DentalVis Clinical Anatomy Team',
      license: 'Proprietary / Educational Visual Reference',
      sourceUrl: 'https://dentalvis.org/procedures/gingival-flap-surgery',
    },
    defaultCameraPosition: [0, 1.5, 6.2],
    defaultCameraTarget: [0, 0, 0],
    cameraPresets: [
      { id: 'front', labelEn: 'Frontal Aspect', labelTa: 'முன்பக்க பார்வை', position: [0, 0.8, 5.8], target: [0, 0, 0] },
      { id: 'cross-section', labelEn: 'Internal Cross-Section', labelTa: 'உட்புற குறுக்குவெட்டு', position: [3.4, 1.6, 4.6], target: [0, 0, 0] },
      { id: 'occlusal', labelEn: 'Occlusal Top View', labelTa: 'மேல் மெல்லும் பரப்பு', position: [0, 6.0, 0.8], target: [0, 0, 0] },
      { id: 'apical', labelEn: 'Apical Root View', labelTa: 'வேர் முனை பார்வை', position: [0, -5.2, 2.0], target: [0, -0.5, 0] },
      { id: 'exploded', labelEn: 'Exploded Component View', labelTa: 'பிரிக்கப்பட்ட அடுக்குகள்', position: [4.4, 2.6, 5.2], target: [0, 0, 0] },
    ],
    layerGroups: [
      {
            "id": "primary",
            "labelEn": "Primary Anatomy",
            "labelTa": "முதன்மை உடற்கூறியல்",
            "defaultVisible": true
      },
      {
            "id": "supporting",
            "labelEn": "Supporting Structures",
            "labelTa": "துணை கட்டமைப்புகள்",
            "defaultVisible": true
      }
],
    structures: [
      {
            "id": "struct-primary",
            "meshName": "Mesh_Primary_Anatomy",
            "labelEn": "${p.name} Anatomical Zone",
            "labelTa": "${p.name} மருத்துவ உடற்கூறு பகுதி",
            "descriptionEn": "Educational anatomical reference area for ${p.name}. Detailed procedure-specific GLB geometry is currently undergoing clinical calibration.",
            "descriptionTa": "${p.name} சிகிச்சைக்குரிய கல்வி உடற்கூறியல் பகுதி. இதற்குரிய 3D மாதிரி தற்போது மருத்துவ அளவுத்திருத்தத்தில் உள்ளது.",
            "layerGroup": "primary",
            "defaultVisible": true,
            "colorHint": "#20B2AA"
      }
],
    hotspots: [
      {
            "id": "hp-primary",
            "structureId": "struct-primary",
            "position": [
                  0,
                  0.5,
                  0.4
            ],
            "titleEn": "${p.name} Clinical Target",
            "titleTa": "${p.name} சிகிச்சை இலக்கு",
            "contentEn": "Procedural focus zone under clinical department ${p.dept}. Inspect 2D illustration for verified details.",
            "contentTa": "${p.dept} துறைக்குரிய சிகிச்சை பகுதி. சரிபார்க்கப்பட்ட வரைபடத்தைக் காண 2D தேர்வை பயன்படுத்தவும்."
      }
],
    educationalSequences: [
      { stepNumber: 1, titleEn: 'Baseline Anatomy', titleTa: 'அடிப்படை உடற்கூறியல்', explanationEn: 'Natural anatomical condition prior to procedural intervention.', explanationTa: 'சிகிச்சைக்கு முந்தைய இயல்பான உடற்கூறியல் நிலை.', cameraPreset: 'front' },
      { stepNumber: 2, titleEn: 'Procedural Intervention', titleTa: 'சிகிச்சை செயல்முறை', explanationEn: 'Key treatment phase demonstrating gentle clinical technique.', explanationTa: 'பாதுகாப்பான முறையில் சிகிச்சை மேற்கொள்ளப்படும் முக்கிய கட்டம்.', cameraPreset: 'cross-section' }
    ]
  },
  'gum-grafting': {
    procedureSlug: 'gum-grafting',
    modelAssetPath: null,
    modelFamily: 'PERIODONTAL_QUADRANT',
    modelState: 'IN_DEVELOPMENT',
    isModelReady: false,
    clinicalReviewStatus: 'EDUCATIONAL_DRAFT',
    provenance: {
      author: 'DentalVis Clinical Anatomy Team',
      license: 'Proprietary / Educational Visual Reference',
      sourceUrl: 'https://dentalvis.org/procedures/gum-grafting',
    },
    defaultCameraPosition: [0, 1.5, 6.2],
    defaultCameraTarget: [0, 0, 0],
    cameraPresets: [
      { id: 'front', labelEn: 'Frontal Aspect', labelTa: 'முன்பக்க பார்வை', position: [0, 0.8, 5.8], target: [0, 0, 0] },
      { id: 'cross-section', labelEn: 'Internal Cross-Section', labelTa: 'உட்புற குறுக்குவெட்டு', position: [3.4, 1.6, 4.6], target: [0, 0, 0] },
      { id: 'occlusal', labelEn: 'Occlusal Top View', labelTa: 'மேல் மெல்லும் பரப்பு', position: [0, 6.0, 0.8], target: [0, 0, 0] },
      { id: 'apical', labelEn: 'Apical Root View', labelTa: 'வேர் முனை பார்வை', position: [0, -5.2, 2.0], target: [0, -0.5, 0] },
      { id: 'exploded', labelEn: 'Exploded Component View', labelTa: 'பிரிக்கப்பட்ட அடுக்குகள்', position: [4.4, 2.6, 5.2], target: [0, 0, 0] },
    ],
    layerGroups: [
      {
            "id": "primary",
            "labelEn": "Primary Anatomy",
            "labelTa": "முதன்மை உடற்கூறியல்",
            "defaultVisible": true
      },
      {
            "id": "supporting",
            "labelEn": "Supporting Structures",
            "labelTa": "துணை கட்டமைப்புகள்",
            "defaultVisible": true
      }
],
    structures: [
      {
            "id": "struct-primary",
            "meshName": "Mesh_Primary_Anatomy",
            "labelEn": "${p.name} Anatomical Zone",
            "labelTa": "${p.name} மருத்துவ உடற்கூறு பகுதி",
            "descriptionEn": "Educational anatomical reference area for ${p.name}. Detailed procedure-specific GLB geometry is currently undergoing clinical calibration.",
            "descriptionTa": "${p.name} சிகிச்சைக்குரிய கல்வி உடற்கூறியல் பகுதி. இதற்குரிய 3D மாதிரி தற்போது மருத்துவ அளவுத்திருத்தத்தில் உள்ளது.",
            "layerGroup": "primary",
            "defaultVisible": true,
            "colorHint": "#20B2AA"
      }
],
    hotspots: [
      {
            "id": "hp-primary",
            "structureId": "struct-primary",
            "position": [
                  0,
                  0.5,
                  0.4
            ],
            "titleEn": "${p.name} Clinical Target",
            "titleTa": "${p.name} சிகிச்சை இலக்கு",
            "contentEn": "Procedural focus zone under clinical department ${p.dept}. Inspect 2D illustration for verified details.",
            "contentTa": "${p.dept} துறைக்குரிய சிகிச்சை பகுதி. சரிபார்க்கப்பட்ட வரைபடத்தைக் காண 2D தேர்வை பயன்படுத்தவும்."
      }
],
    educationalSequences: [
      { stepNumber: 1, titleEn: 'Baseline Anatomy', titleTa: 'அடிப்படை உடற்கூறியல்', explanationEn: 'Natural anatomical condition prior to procedural intervention.', explanationTa: 'சிகிச்சைக்கு முந்தைய இயல்பான உடற்கூறியல் நிலை.', cameraPreset: 'front' },
      { stepNumber: 2, titleEn: 'Procedural Intervention', titleTa: 'சிகிச்சை செயல்முறை', explanationEn: 'Key treatment phase demonstrating gentle clinical technique.', explanationTa: 'பாதுகாப்பான முறையில் சிகிச்சை மேற்கொள்ளப்படும் முக்கிய கட்டம்.', cameraPreset: 'cross-section' }
    ]
  },
  'crown-lengthening': {
    procedureSlug: 'crown-lengthening',
    modelAssetPath: null,
    modelFamily: 'PERIODONTAL_QUADRANT',
    modelState: 'IN_DEVELOPMENT',
    isModelReady: false,
    clinicalReviewStatus: 'EDUCATIONAL_DRAFT',
    provenance: {
      author: 'DentalVis Clinical Anatomy Team',
      license: 'Proprietary / Educational Visual Reference',
      sourceUrl: 'https://dentalvis.org/procedures/crown-lengthening',
    },
    defaultCameraPosition: [0, 1.5, 6.2],
    defaultCameraTarget: [0, 0, 0],
    cameraPresets: [
      { id: 'front', labelEn: 'Frontal Aspect', labelTa: 'முன்பக்க பார்வை', position: [0, 0.8, 5.8], target: [0, 0, 0] },
      { id: 'cross-section', labelEn: 'Internal Cross-Section', labelTa: 'உட்புற குறுக்குவெட்டு', position: [3.4, 1.6, 4.6], target: [0, 0, 0] },
      { id: 'occlusal', labelEn: 'Occlusal Top View', labelTa: 'மேல் மெல்லும் பரப்பு', position: [0, 6.0, 0.8], target: [0, 0, 0] },
      { id: 'apical', labelEn: 'Apical Root View', labelTa: 'வேர் முனை பார்வை', position: [0, -5.2, 2.0], target: [0, -0.5, 0] },
      { id: 'exploded', labelEn: 'Exploded Component View', labelTa: 'பிரிக்கப்பட்ட அடுக்குகள்', position: [4.4, 2.6, 5.2], target: [0, 0, 0] },
    ],
    layerGroups: [
      {
            "id": "primary",
            "labelEn": "Primary Anatomy",
            "labelTa": "முதன்மை உடற்கூறியல்",
            "defaultVisible": true
      },
      {
            "id": "supporting",
            "labelEn": "Supporting Structures",
            "labelTa": "துணை கட்டமைப்புகள்",
            "defaultVisible": true
      }
],
    structures: [
      {
            "id": "struct-primary",
            "meshName": "Mesh_Primary_Anatomy",
            "labelEn": "${p.name} Anatomical Zone",
            "labelTa": "${p.name} மருத்துவ உடற்கூறு பகுதி",
            "descriptionEn": "Educational anatomical reference area for ${p.name}. Detailed procedure-specific GLB geometry is currently undergoing clinical calibration.",
            "descriptionTa": "${p.name} சிகிச்சைக்குரிய கல்வி உடற்கூறியல் பகுதி. இதற்குரிய 3D மாதிரி தற்போது மருத்துவ அளவுத்திருத்தத்தில் உள்ளது.",
            "layerGroup": "primary",
            "defaultVisible": true,
            "colorHint": "#20B2AA"
      }
],
    hotspots: [
      {
            "id": "hp-primary",
            "structureId": "struct-primary",
            "position": [
                  0,
                  0.5,
                  0.4
            ],
            "titleEn": "${p.name} Clinical Target",
            "titleTa": "${p.name} சிகிச்சை இலக்கு",
            "contentEn": "Procedural focus zone under clinical department ${p.dept}. Inspect 2D illustration for verified details.",
            "contentTa": "${p.dept} துறைக்குரிய சிகிச்சை பகுதி. சரிபார்க்கப்பட்ட வரைபடத்தைக் காண 2D தேர்வை பயன்படுத்தவும்."
      }
],
    educationalSequences: [
      { stepNumber: 1, titleEn: 'Baseline Anatomy', titleTa: 'அடிப்படை உடற்கூறியல்', explanationEn: 'Natural anatomical condition prior to procedural intervention.', explanationTa: 'சிகிச்சைக்கு முந்தைய இயல்பான உடற்கூறியல் நிலை.', cameraPreset: 'front' },
      { stepNumber: 2, titleEn: 'Procedural Intervention', titleTa: 'சிகிச்சை செயல்முறை', explanationEn: 'Key treatment phase demonstrating gentle clinical technique.', explanationTa: 'பாதுகாப்பான முறையில் சிகிச்சை மேற்கொள்ளப்படும் முக்கிய கட்டம்.', cameraPreset: 'cross-section' }
    ]
  },
  'frenectomy': {
    procedureSlug: 'frenectomy',
    modelAssetPath: null,
    modelFamily: 'ANTERIOR_INCISOR',
    modelState: 'IN_DEVELOPMENT',
    isModelReady: false,
    clinicalReviewStatus: 'EDUCATIONAL_DRAFT',
    provenance: {
      author: 'DentalVis Clinical Anatomy Team',
      license: 'Proprietary / Educational Visual Reference',
      sourceUrl: 'https://dentalvis.org/procedures/frenectomy',
    },
    defaultCameraPosition: [0, 1.5, 6.2],
    defaultCameraTarget: [0, 0, 0],
    cameraPresets: [
      { id: 'front', labelEn: 'Frontal Aspect', labelTa: 'முன்பக்க பார்வை', position: [0, 0.8, 5.8], target: [0, 0, 0] },
      { id: 'cross-section', labelEn: 'Internal Cross-Section', labelTa: 'உட்புற குறுக்குவெட்டு', position: [3.4, 1.6, 4.6], target: [0, 0, 0] },
      { id: 'occlusal', labelEn: 'Occlusal Top View', labelTa: 'மேல் மெல்லும் பரப்பு', position: [0, 6.0, 0.8], target: [0, 0, 0] },
      { id: 'apical', labelEn: 'Apical Root View', labelTa: 'வேர் முனை பார்வை', position: [0, -5.2, 2.0], target: [0, -0.5, 0] },
      { id: 'exploded', labelEn: 'Exploded Component View', labelTa: 'பிரிக்கப்பட்ட அடுக்குகள்', position: [4.4, 2.6, 5.2], target: [0, 0, 0] },
    ],
    layerGroups: [
      {
            "id": "primary",
            "labelEn": "Primary Anatomy",
            "labelTa": "முதன்மை உடற்கூறியல்",
            "defaultVisible": true
      },
      {
            "id": "supporting",
            "labelEn": "Supporting Structures",
            "labelTa": "துணை கட்டமைப்புகள்",
            "defaultVisible": true
      }
],
    structures: [
      {
            "id": "struct-primary",
            "meshName": "Mesh_Primary_Anatomy",
            "labelEn": "${p.name} Anatomical Zone",
            "labelTa": "${p.name} மருத்துவ உடற்கூறு பகுதி",
            "descriptionEn": "Educational anatomical reference area for ${p.name}. Detailed procedure-specific GLB geometry is currently undergoing clinical calibration.",
            "descriptionTa": "${p.name} சிகிச்சைக்குரிய கல்வி உடற்கூறியல் பகுதி. இதற்குரிய 3D மாதிரி தற்போது மருத்துவ அளவுத்திருத்தத்தில் உள்ளது.",
            "layerGroup": "primary",
            "defaultVisible": true,
            "colorHint": "#20B2AA"
      }
],
    hotspots: [
      {
            "id": "hp-primary",
            "structureId": "struct-primary",
            "position": [
                  0,
                  0.5,
                  0.4
            ],
            "titleEn": "${p.name} Clinical Target",
            "titleTa": "${p.name} சிகிச்சை இலக்கு",
            "contentEn": "Procedural focus zone under clinical department ${p.dept}. Inspect 2D illustration for verified details.",
            "contentTa": "${p.dept} துறைக்குரிய சிகிச்சை பகுதி. சரிபார்க்கப்பட்ட வரைபடத்தைக் காண 2D தேர்வை பயன்படுத்தவும்."
      }
],
    educationalSequences: [
      { stepNumber: 1, titleEn: 'Baseline Anatomy', titleTa: 'அடிப்படை உடற்கூறியல்', explanationEn: 'Natural anatomical condition prior to procedural intervention.', explanationTa: 'சிகிச்சைக்கு முந்தைய இயல்பான உடற்கூறியல் நிலை.', cameraPreset: 'front' },
      { stepNumber: 2, titleEn: 'Procedural Intervention', titleTa: 'சிகிச்சை செயல்முறை', explanationEn: 'Key treatment phase demonstrating gentle clinical technique.', explanationTa: 'பாதுகாப்பான முறையில் சிகிச்சை மேற்கொள்ளப்படும் முக்கிய கட்டம்.', cameraPreset: 'cross-section' }
    ]
  },
  'routine-tooth-extraction': {
    procedureSlug: 'routine-tooth-extraction',
    modelAssetPath: null,
    modelFamily: 'SURGICAL_WISDOM_MANDIBULAR_NERVE',
    modelState: 'IN_DEVELOPMENT',
    isModelReady: false,
    clinicalReviewStatus: 'EDUCATIONAL_DRAFT',
    provenance: {
      author: 'DentalVis Clinical Anatomy Team',
      license: 'Proprietary / Educational Visual Reference',
      sourceUrl: 'https://dentalvis.org/procedures/routine-tooth-extraction',
    },
    defaultCameraPosition: [0, 1.5, 6.2],
    defaultCameraTarget: [0, 0, 0],
    cameraPresets: [
      { id: 'front', labelEn: 'Frontal Aspect', labelTa: 'முன்பக்க பார்வை', position: [0, 0.8, 5.8], target: [0, 0, 0] },
      { id: 'cross-section', labelEn: 'Internal Cross-Section', labelTa: 'உட்புற குறுக்குவெட்டு', position: [3.4, 1.6, 4.6], target: [0, 0, 0] },
      { id: 'occlusal', labelEn: 'Occlusal Top View', labelTa: 'மேல் மெல்லும் பரப்பு', position: [0, 6.0, 0.8], target: [0, 0, 0] },
      { id: 'apical', labelEn: 'Apical Root View', labelTa: 'வேர் முனை பார்வை', position: [0, -5.2, 2.0], target: [0, -0.5, 0] },
      { id: 'exploded', labelEn: 'Exploded Component View', labelTa: 'பிரிக்கப்பட்ட அடுக்குகள்', position: [4.4, 2.6, 5.2], target: [0, 0, 0] },
    ],
    layerGroups: [
      {
            "id": "primary",
            "labelEn": "Primary Anatomy",
            "labelTa": "முதன்மை உடற்கூறியல்",
            "defaultVisible": true
      },
      {
            "id": "supporting",
            "labelEn": "Supporting Structures",
            "labelTa": "துணை கட்டமைப்புகள்",
            "defaultVisible": true
      }
],
    structures: [
      {
            "id": "struct-primary",
            "meshName": "Mesh_Primary_Anatomy",
            "labelEn": "${p.name} Anatomical Zone",
            "labelTa": "${p.name} மருத்துவ உடற்கூறு பகுதி",
            "descriptionEn": "Educational anatomical reference area for ${p.name}. Detailed procedure-specific GLB geometry is currently undergoing clinical calibration.",
            "descriptionTa": "${p.name} சிகிச்சைக்குரிய கல்வி உடற்கூறியல் பகுதி. இதற்குரிய 3D மாதிரி தற்போது மருத்துவ அளவுத்திருத்தத்தில் உள்ளது.",
            "layerGroup": "primary",
            "defaultVisible": true,
            "colorHint": "#20B2AA"
      }
],
    hotspots: [
      {
            "id": "hp-primary",
            "structureId": "struct-primary",
            "position": [
                  0,
                  0.5,
                  0.4
            ],
            "titleEn": "${p.name} Clinical Target",
            "titleTa": "${p.name} சிகிச்சை இலக்கு",
            "contentEn": "Procedural focus zone under clinical department ${p.dept}. Inspect 2D illustration for verified details.",
            "contentTa": "${p.dept} துறைக்குரிய சிகிச்சை பகுதி. சரிபார்க்கப்பட்ட வரைபடத்தைக் காண 2D தேர்வை பயன்படுத்தவும்."
      }
],
    educationalSequences: [
      { stepNumber: 1, titleEn: 'Baseline Anatomy', titleTa: 'அடிப்படை உடற்கூறியல்', explanationEn: 'Natural anatomical condition prior to procedural intervention.', explanationTa: 'சிகிச்சைக்கு முந்தைய இயல்பான உடற்கூறியல் நிலை.', cameraPreset: 'front' },
      { stepNumber: 2, titleEn: 'Procedural Intervention', titleTa: 'சிகிச்சை செயல்முறை', explanationEn: 'Key treatment phase demonstrating gentle clinical technique.', explanationTa: 'பாதுகாப்பான முறையில் சிகிச்சை மேற்கொள்ளப்படும் முக்கிய கட்டம்.', cameraPreset: 'cross-section' }
    ]
  },
  'wisdom-tooth-extraction': {
    procedureSlug: 'wisdom-tooth-extraction',
    modelAssetPath: null,
    modelFamily: 'SURGICAL_WISDOM_MANDIBULAR_NERVE',
    modelState: 'IN_DEVELOPMENT',
    isModelReady: false,
    clinicalReviewStatus: 'EDUCATIONAL_DRAFT',
    provenance: {
      author: 'DentalVis Clinical Anatomy Team',
      license: 'Proprietary / Educational Visual Reference',
      sourceUrl: 'https://dentalvis.org/procedures/wisdom-tooth-extraction',
    },
    defaultCameraPosition: [0, 1.5, 6.2],
    defaultCameraTarget: [0, 0, 0],
    cameraPresets: [
      { id: 'front', labelEn: 'Frontal Aspect', labelTa: 'முன்பக்க பார்வை', position: [0, 0.8, 5.8], target: [0, 0, 0] },
      { id: 'cross-section', labelEn: 'Internal Cross-Section', labelTa: 'உட்புற குறுக்குவெட்டு', position: [3.4, 1.6, 4.6], target: [0, 0, 0] },
      { id: 'occlusal', labelEn: 'Occlusal Top View', labelTa: 'மேல் மெல்லும் பரப்பு', position: [0, 6.0, 0.8], target: [0, 0, 0] },
      { id: 'apical', labelEn: 'Apical Root View', labelTa: 'வேர் முனை பார்வை', position: [0, -5.2, 2.0], target: [0, -0.5, 0] },
      { id: 'exploded', labelEn: 'Exploded Component View', labelTa: 'பிரிக்கப்பட்ட அடுக்குகள்', position: [4.4, 2.6, 5.2], target: [0, 0, 0] },
    ],
    layerGroups: [
      {
            "id": "primary",
            "labelEn": "Primary Anatomy",
            "labelTa": "முதன்மை உடற்கூறியல்",
            "defaultVisible": true
      },
      {
            "id": "supporting",
            "labelEn": "Supporting Structures",
            "labelTa": "துணை கட்டமைப்புகள்",
            "defaultVisible": true
      }
],
    structures: [
      {
            "id": "struct-primary",
            "meshName": "Mesh_Primary_Anatomy",
            "labelEn": "${p.name} Anatomical Zone",
            "labelTa": "${p.name} மருத்துவ உடற்கூறு பகுதி",
            "descriptionEn": "Educational anatomical reference area for ${p.name}. Detailed procedure-specific GLB geometry is currently undergoing clinical calibration.",
            "descriptionTa": "${p.name} சிகிச்சைக்குரிய கல்வி உடற்கூறியல் பகுதி. இதற்குரிய 3D மாதிரி தற்போது மருத்துவ அளவுத்திருத்தத்தில் உள்ளது.",
            "layerGroup": "primary",
            "defaultVisible": true,
            "colorHint": "#20B2AA"
      }
],
    hotspots: [
      {
            "id": "hp-primary",
            "structureId": "struct-primary",
            "position": [
                  0,
                  0.5,
                  0.4
            ],
            "titleEn": "${p.name} Clinical Target",
            "titleTa": "${p.name} சிகிச்சை இலக்கு",
            "contentEn": "Procedural focus zone under clinical department ${p.dept}. Inspect 2D illustration for verified details.",
            "contentTa": "${p.dept} துறைக்குரிய சிகிச்சை பகுதி. சரிபார்க்கப்பட்ட வரைபடத்தைக் காண 2D தேர்வை பயன்படுத்தவும்."
      }
],
    educationalSequences: [
      { stepNumber: 1, titleEn: 'Baseline Anatomy', titleTa: 'அடிப்படை உடற்கூறியல்', explanationEn: 'Natural anatomical condition prior to procedural intervention.', explanationTa: 'சிகிச்சைக்கு முந்தைய இயல்பான உடற்கூறியல் நிலை.', cameraPreset: 'front' },
      { stepNumber: 2, titleEn: 'Procedural Intervention', titleTa: 'சிகிச்சை செயல்முறை', explanationEn: 'Key treatment phase demonstrating gentle clinical technique.', explanationTa: 'பாதுகாப்பான முறையில் சிகிச்சை மேற்கொள்ளப்படும் முக்கிய கட்டம்.', cameraPreset: 'cross-section' }
    ]
  },
  'socket-preservation-bone-graft': {
    procedureSlug: 'socket-preservation-bone-graft',
    modelAssetPath: null,
    modelFamily: 'IMPLANT_BONE_SOCKET',
    modelState: 'IN_DEVELOPMENT',
    isModelReady: false,
    clinicalReviewStatus: 'EDUCATIONAL_DRAFT',
    provenance: {
      author: 'DentalVis Clinical Anatomy Team',
      license: 'Proprietary / Educational Visual Reference',
      sourceUrl: 'https://dentalvis.org/procedures/socket-preservation-bone-graft',
    },
    defaultCameraPosition: [0, 1.5, 6.2],
    defaultCameraTarget: [0, 0, 0],
    cameraPresets: [
      { id: 'front', labelEn: 'Frontal Aspect', labelTa: 'முன்பக்க பார்வை', position: [0, 0.8, 5.8], target: [0, 0, 0] },
      { id: 'cross-section', labelEn: 'Internal Cross-Section', labelTa: 'உட்புற குறுக்குவெட்டு', position: [3.4, 1.6, 4.6], target: [0, 0, 0] },
      { id: 'occlusal', labelEn: 'Occlusal Top View', labelTa: 'மேல் மெல்லும் பரப்பு', position: [0, 6.0, 0.8], target: [0, 0, 0] },
      { id: 'apical', labelEn: 'Apical Root View', labelTa: 'வேர் முனை பார்வை', position: [0, -5.2, 2.0], target: [0, -0.5, 0] },
      { id: 'exploded', labelEn: 'Exploded Component View', labelTa: 'பிரிக்கப்பட்ட அடுக்குகள்', position: [4.4, 2.6, 5.2], target: [0, 0, 0] },
    ],
    layerGroups: [
      {
            "id": "primary",
            "labelEn": "Primary Anatomy",
            "labelTa": "முதன்மை உடற்கூறியல்",
            "defaultVisible": true
      },
      {
            "id": "supporting",
            "labelEn": "Supporting Structures",
            "labelTa": "துணை கட்டமைப்புகள்",
            "defaultVisible": true
      }
],
    structures: [
      {
            "id": "struct-primary",
            "meshName": "Mesh_Primary_Anatomy",
            "labelEn": "${p.name} Anatomical Zone",
            "labelTa": "${p.name} மருத்துவ உடற்கூறு பகுதி",
            "descriptionEn": "Educational anatomical reference area for ${p.name}. Detailed procedure-specific GLB geometry is currently undergoing clinical calibration.",
            "descriptionTa": "${p.name} சிகிச்சைக்குரிய கல்வி உடற்கூறியல் பகுதி. இதற்குரிய 3D மாதிரி தற்போது மருத்துவ அளவுத்திருத்தத்தில் உள்ளது.",
            "layerGroup": "primary",
            "defaultVisible": true,
            "colorHint": "#20B2AA"
      }
],
    hotspots: [
      {
            "id": "hp-primary",
            "structureId": "struct-primary",
            "position": [
                  0,
                  0.5,
                  0.4
            ],
            "titleEn": "${p.name} Clinical Target",
            "titleTa": "${p.name} சிகிச்சை இலக்கு",
            "contentEn": "Procedural focus zone under clinical department ${p.dept}. Inspect 2D illustration for verified details.",
            "contentTa": "${p.dept} துறைக்குரிய சிகிச்சை பகுதி. சரிபார்க்கப்பட்ட வரைபடத்தைக் காண 2D தேர்வை பயன்படுத்தவும்."
      }
],
    educationalSequences: [
      { stepNumber: 1, titleEn: 'Baseline Anatomy', titleTa: 'அடிப்படை உடற்கூறியல்', explanationEn: 'Natural anatomical condition prior to procedural intervention.', explanationTa: 'சிகிச்சைக்கு முந்தைய இயல்பான உடற்கூறியல் நிலை.', cameraPreset: 'front' },
      { stepNumber: 2, titleEn: 'Procedural Intervention', titleTa: 'சிகிச்சை செயல்முறை', explanationEn: 'Key treatment phase demonstrating gentle clinical technique.', explanationTa: 'பாதுகாப்பான முறையில் சிகிச்சை மேற்கொள்ளப்படும் முக்கிய கட்டம்.', cameraPreset: 'cross-section' }
    ]
  },
  'alveolar-ridge-augmentation': {
    procedureSlug: 'alveolar-ridge-augmentation',
    modelAssetPath: null,
    modelFamily: 'IMPLANT_BONE_SOCKET',
    modelState: 'IN_DEVELOPMENT',
    isModelReady: false,
    clinicalReviewStatus: 'EDUCATIONAL_DRAFT',
    provenance: {
      author: 'DentalVis Clinical Anatomy Team',
      license: 'Proprietary / Educational Visual Reference',
      sourceUrl: 'https://dentalvis.org/procedures/alveolar-ridge-augmentation',
    },
    defaultCameraPosition: [0, 1.5, 6.2],
    defaultCameraTarget: [0, 0, 0],
    cameraPresets: [
      { id: 'front', labelEn: 'Frontal Aspect', labelTa: 'முன்பக்க பார்வை', position: [0, 0.8, 5.8], target: [0, 0, 0] },
      { id: 'cross-section', labelEn: 'Internal Cross-Section', labelTa: 'உட்புற குறுக்குவெட்டு', position: [3.4, 1.6, 4.6], target: [0, 0, 0] },
      { id: 'occlusal', labelEn: 'Occlusal Top View', labelTa: 'மேல் மெல்லும் பரப்பு', position: [0, 6.0, 0.8], target: [0, 0, 0] },
      { id: 'apical', labelEn: 'Apical Root View', labelTa: 'வேர் முனை பார்வை', position: [0, -5.2, 2.0], target: [0, -0.5, 0] },
      { id: 'exploded', labelEn: 'Exploded Component View', labelTa: 'பிரிக்கப்பட்ட அடுக்குகள்', position: [4.4, 2.6, 5.2], target: [0, 0, 0] },
    ],
    layerGroups: [
      {
            "id": "primary",
            "labelEn": "Primary Anatomy",
            "labelTa": "முதன்மை உடற்கூறியல்",
            "defaultVisible": true
      },
      {
            "id": "supporting",
            "labelEn": "Supporting Structures",
            "labelTa": "துணை கட்டமைப்புகள்",
            "defaultVisible": true
      }
],
    structures: [
      {
            "id": "struct-primary",
            "meshName": "Mesh_Primary_Anatomy",
            "labelEn": "${p.name} Anatomical Zone",
            "labelTa": "${p.name} மருத்துவ உடற்கூறு பகுதி",
            "descriptionEn": "Educational anatomical reference area for ${p.name}. Detailed procedure-specific GLB geometry is currently undergoing clinical calibration.",
            "descriptionTa": "${p.name} சிகிச்சைக்குரிய கல்வி உடற்கூறியல் பகுதி. இதற்குரிய 3D மாதிரி தற்போது மருத்துவ அளவுத்திருத்தத்தில் உள்ளது.",
            "layerGroup": "primary",
            "defaultVisible": true,
            "colorHint": "#20B2AA"
      }
],
    hotspots: [
      {
            "id": "hp-primary",
            "structureId": "struct-primary",
            "position": [
                  0,
                  0.5,
                  0.4
            ],
            "titleEn": "${p.name} Clinical Target",
            "titleTa": "${p.name} சிகிச்சை இலக்கு",
            "contentEn": "Procedural focus zone under clinical department ${p.dept}. Inspect 2D illustration for verified details.",
            "contentTa": "${p.dept} துறைக்குரிய சிகிச்சை பகுதி. சரிபார்க்கப்பட்ட வரைபடத்தைக் காண 2D தேர்வை பயன்படுத்தவும்."
      }
],
    educationalSequences: [
      { stepNumber: 1, titleEn: 'Baseline Anatomy', titleTa: 'அடிப்படை உடற்கூறியல்', explanationEn: 'Natural anatomical condition prior to procedural intervention.', explanationTa: 'சிகிச்சைக்கு முந்தைய இயல்பான உடற்கூறியல் நிலை.', cameraPreset: 'front' },
      { stepNumber: 2, titleEn: 'Procedural Intervention', titleTa: 'சிகிச்சை செயல்முறை', explanationEn: 'Key treatment phase demonstrating gentle clinical technique.', explanationTa: 'பாதுகாப்பான முறையில் சிகிச்சை மேற்கொள்ளப்படும் முக்கிய கட்டம்.', cameraPreset: 'cross-section' }
    ]
  },
  'sinus-lift': {
    procedureSlug: 'sinus-lift',
    modelAssetPath: null,
    modelFamily: 'IMPLANT_BONE_SOCKET',
    modelState: 'IN_DEVELOPMENT',
    isModelReady: false,
    clinicalReviewStatus: 'EDUCATIONAL_DRAFT',
    provenance: {
      author: 'DentalVis Clinical Anatomy Team',
      license: 'Proprietary / Educational Visual Reference',
      sourceUrl: 'https://dentalvis.org/procedures/sinus-lift',
    },
    defaultCameraPosition: [0, 1.5, 6.2],
    defaultCameraTarget: [0, 0, 0],
    cameraPresets: [
      { id: 'front', labelEn: 'Frontal Aspect', labelTa: 'முன்பக்க பார்வை', position: [0, 0.8, 5.8], target: [0, 0, 0] },
      { id: 'cross-section', labelEn: 'Internal Cross-Section', labelTa: 'உட்புற குறுக்குவெட்டு', position: [3.4, 1.6, 4.6], target: [0, 0, 0] },
      { id: 'occlusal', labelEn: 'Occlusal Top View', labelTa: 'மேல் மெல்லும் பரப்பு', position: [0, 6.0, 0.8], target: [0, 0, 0] },
      { id: 'apical', labelEn: 'Apical Root View', labelTa: 'வேர் முனை பார்வை', position: [0, -5.2, 2.0], target: [0, -0.5, 0] },
      { id: 'exploded', labelEn: 'Exploded Component View', labelTa: 'பிரிக்கப்பட்ட அடுக்குகள்', position: [4.4, 2.6, 5.2], target: [0, 0, 0] },
    ],
    layerGroups: [
      {
            "id": "primary",
            "labelEn": "Primary Anatomy",
            "labelTa": "முதன்மை உடற்கூறியல்",
            "defaultVisible": true
      },
      {
            "id": "supporting",
            "labelEn": "Supporting Structures",
            "labelTa": "துணை கட்டமைப்புகள்",
            "defaultVisible": true
      }
],
    structures: [
      {
            "id": "struct-primary",
            "meshName": "Mesh_Primary_Anatomy",
            "labelEn": "${p.name} Anatomical Zone",
            "labelTa": "${p.name} மருத்துவ உடற்கூறு பகுதி",
            "descriptionEn": "Educational anatomical reference area for ${p.name}. Detailed procedure-specific GLB geometry is currently undergoing clinical calibration.",
            "descriptionTa": "${p.name} சிகிச்சைக்குரிய கல்வி உடற்கூறியல் பகுதி. இதற்குரிய 3D மாதிரி தற்போது மருத்துவ அளவுத்திருத்தத்தில் உள்ளது.",
            "layerGroup": "primary",
            "defaultVisible": true,
            "colorHint": "#20B2AA"
      }
],
    hotspots: [
      {
            "id": "hp-primary",
            "structureId": "struct-primary",
            "position": [
                  0,
                  0.5,
                  0.4
            ],
            "titleEn": "${p.name} Clinical Target",
            "titleTa": "${p.name} சிகிச்சை இலக்கு",
            "contentEn": "Procedural focus zone under clinical department ${p.dept}. Inspect 2D illustration for verified details.",
            "contentTa": "${p.dept} துறைக்குரிய சிகிச்சை பகுதி. சரிபார்க்கப்பட்ட வரைபடத்தைக் காண 2D தேர்வை பயன்படுத்தவும்."
      }
],
    educationalSequences: [
      { stepNumber: 1, titleEn: 'Baseline Anatomy', titleTa: 'அடிப்படை உடற்கூறியல்', explanationEn: 'Natural anatomical condition prior to procedural intervention.', explanationTa: 'சிகிச்சைக்கு முந்தைய இயல்பான உடற்கூறியல் நிலை.', cameraPreset: 'front' },
      { stepNumber: 2, titleEn: 'Procedural Intervention', titleTa: 'சிகிச்சை செயல்முறை', explanationEn: 'Key treatment phase demonstrating gentle clinical technique.', explanationTa: 'பாதுகாப்பான முறையில் சிகிச்சை மேற்கொள்ளப்படும் முக்கிய கட்டம்.', cameraPreset: 'cross-section' }
    ]
  },
  'dental-abscess-management': {
    procedureSlug: 'dental-abscess-management',
    modelAssetPath: null,
    modelFamily: 'POSTERIOR_MOLAR',
    modelState: 'IN_DEVELOPMENT',
    isModelReady: false,
    clinicalReviewStatus: 'EDUCATIONAL_DRAFT',
    provenance: {
      author: 'DentalVis Clinical Anatomy Team',
      license: 'Proprietary / Educational Visual Reference',
      sourceUrl: 'https://dentalvis.org/procedures/dental-abscess-management',
    },
    defaultCameraPosition: [0, 1.5, 6.2],
    defaultCameraTarget: [0, 0, 0],
    cameraPresets: [
      { id: 'front', labelEn: 'Frontal Aspect', labelTa: 'முன்பக்க பார்வை', position: [0, 0.8, 5.8], target: [0, 0, 0] },
      { id: 'cross-section', labelEn: 'Internal Cross-Section', labelTa: 'உட்புற குறுக்குவெட்டு', position: [3.4, 1.6, 4.6], target: [0, 0, 0] },
      { id: 'occlusal', labelEn: 'Occlusal Top View', labelTa: 'மேல் மெல்லும் பரப்பு', position: [0, 6.0, 0.8], target: [0, 0, 0] },
      { id: 'apical', labelEn: 'Apical Root View', labelTa: 'வேர் முனை பார்வை', position: [0, -5.2, 2.0], target: [0, -0.5, 0] },
      { id: 'exploded', labelEn: 'Exploded Component View', labelTa: 'பிரிக்கப்பட்ட அடுக்குகள்', position: [4.4, 2.6, 5.2], target: [0, 0, 0] },
    ],
    layerGroups: [
      {
            "id": "primary",
            "labelEn": "Primary Anatomy",
            "labelTa": "முதன்மை உடற்கூறியல்",
            "defaultVisible": true
      },
      {
            "id": "supporting",
            "labelEn": "Supporting Structures",
            "labelTa": "துணை கட்டமைப்புகள்",
            "defaultVisible": true
      }
],
    structures: [
      {
            "id": "struct-primary",
            "meshName": "Mesh_Primary_Anatomy",
            "labelEn": "${p.name} Anatomical Zone",
            "labelTa": "${p.name} மருத்துவ உடற்கூறு பகுதி",
            "descriptionEn": "Educational anatomical reference area for ${p.name}. Detailed procedure-specific GLB geometry is currently undergoing clinical calibration.",
            "descriptionTa": "${p.name} சிகிச்சைக்குரிய கல்வி உடற்கூறியல் பகுதி. இதற்குரிய 3D மாதிரி தற்போது மருத்துவ அளவுத்திருத்தத்தில் உள்ளது.",
            "layerGroup": "primary",
            "defaultVisible": true,
            "colorHint": "#20B2AA"
      }
],
    hotspots: [
      {
            "id": "hp-primary",
            "structureId": "struct-primary",
            "position": [
                  0,
                  0.5,
                  0.4
            ],
            "titleEn": "${p.name} Clinical Target",
            "titleTa": "${p.name} சிகிச்சை இலக்கு",
            "contentEn": "Procedural focus zone under clinical department ${p.dept}. Inspect 2D illustration for verified details.",
            "contentTa": "${p.dept} துறைக்குரிய சிகிச்சை பகுதி. சரிபார்க்கப்பட்ட வரைபடத்தைக் காண 2D தேர்வை பயன்படுத்தவும்."
      }
],
    educationalSequences: [
      { stepNumber: 1, titleEn: 'Baseline Anatomy', titleTa: 'அடிப்படை உடற்கூறியல்', explanationEn: 'Natural anatomical condition prior to procedural intervention.', explanationTa: 'சிகிச்சைக்கு முந்தைய இயல்பான உடற்கூறியல் நிலை.', cameraPreset: 'front' },
      { stepNumber: 2, titleEn: 'Procedural Intervention', titleTa: 'சிகிச்சை செயல்முறை', explanationEn: 'Key treatment phase demonstrating gentle clinical technique.', explanationTa: 'பாதுகாப்பான முறையில் சிகிச்சை மேற்கொள்ளப்படும் முக்கிய கட்டம்.', cameraPreset: 'cross-section' }
    ]
  },
  'single-dental-implant': {
    procedureSlug: 'single-dental-implant',
    modelAssetPath: '/models/single-dental-implant.glb',
    modelFamily: 'IMPLANT_BONE_SOCKET',
    modelState: 'AVAILABLE_AND_FUNCTIONAL',
    isModelReady: true,
    clinicalReviewStatus: 'EDUCATIONAL_DRAFT',
    provenance: {
      author: 'DentalVis Clinical Anatomy Team',
      license: 'Proprietary / Educational Visual Reference',
      sourceUrl: 'https://dentalvis.org/procedures/single-dental-implant',
    },
    defaultCameraPosition: [0, 1.5, 6.2],
    defaultCameraTarget: [0, 0, 0],
    cameraPresets: [
      { id: 'front', labelEn: 'Frontal Aspect', labelTa: 'முன்பக்க பார்வை', position: [0, 0.8, 5.8], target: [0, 0, 0] },
      { id: 'cross-section', labelEn: 'Internal Cross-Section', labelTa: 'உட்புற குறுக்குவெட்டு', position: [3.4, 1.6, 4.6], target: [0, 0, 0] },
      { id: 'occlusal', labelEn: 'Occlusal Top View', labelTa: 'மேல் மெல்லும் பரப்பு', position: [0, 6.0, 0.8], target: [0, 0, 0] },
      { id: 'apical', labelEn: 'Apical Root View', labelTa: 'வேர் முனை பார்வை', position: [0, -5.2, 2.0], target: [0, -0.5, 0] },
      { id: 'exploded', labelEn: 'Exploded Component View', labelTa: 'பிரிக்கப்பட்ட அடுக்குகள்', position: [4.4, 2.6, 5.2], target: [0, 0, 0] },
    ],
    layerGroups: [
      {
            "id": "crown",
            "labelEn": "Ceramic Crown",
            "labelTa": "செயற்கை பல் தொப்பி",
            "defaultVisible": true
      },
      {
            "id": "abutment",
            "labelEn": "Abutment Component",
            "labelTa": "இணைப்பு அபுட்மென்ட்",
            "defaultVisible": true
      },
      {
            "id": "fixture",
            "labelEn": "Titanium Fixture",
            "labelTa": "டைட்டானியம் திருகு",
            "defaultVisible": true
      },
      {
            "id": "bone",
            "labelEn": "Jawbone Section",
            "labelTa": "தாடை எலும்பு",
            "defaultVisible": true
      },
      {
            "id": "gingiva",
            "labelEn": "Gums Collar",
            "labelTa": "ஈறு வளையம்",
            "defaultVisible": true
      }
],
    structures: [
      {
            "id": "implant-fixture",
            "meshName": "Mesh_Implant_Fixture",
            "labelEn": "Titanium Implant Fixture",
            "labelTa": "டைட்டானியம் இம்ப்ளான்ட் திருகு",
            "descriptionEn": "Biocompatible grade-4 titanium root with micro-threads designed for direct bone osseointegration.",
            "descriptionTa": "தாடை எலும்போடு இயற்கையாக ஒன்றிணையும் நவீன டைட்டானியம் செயற்கை வேர்.",
            "layerGroup": "fixture",
            "defaultVisible": true,
            "colorHint": "#8E9AA0"
      },
      {
            "id": "abutment",
            "meshName": "Mesh_Abutment",
            "labelEn": "Prosthetic Abutment",
            "labelTa": "இணைப்பு பகுதி (Abutment)",
            "descriptionEn": "Precision connecting element linking the subgingival implant fixture to the visible crown.",
            "descriptionTa": "இம்ப்ளான்ட் திருகையும் செயற்கை பல்லையும் இணைக்கும் உறுதியான பகுதி.",
            "layerGroup": "abutment",
            "defaultVisible": true,
            "colorHint": "#A8B6BC"
      },
      {
            "id": "implant-crown",
            "meshName": "Mesh_Implant_Crown",
            "labelEn": "Ceramic Implant Crown",
            "labelTa": "செராமிக் இம்ப்ளான்ட் தொப்பி",
            "descriptionEn": "Zirconia/porcelain aesthetic crown restoring natural chewing power and appearance.",
            "descriptionTa": "இயற்கையான பல் போன்ற தோற்றத்தையும் மெல்லும் வலிமையையும் தரும் தொப்பி.",
            "layerGroup": "crown",
            "defaultVisible": true,
            "colorHint": "#F8FCFA"
      },
      {
            "id": "jawbone-section",
            "meshName": "Mesh_Jawbone_Section",
            "labelEn": "Alveolar Jawbone",
            "labelTa": "தாடை எலும்பு பகுதி",
            "descriptionEn": "Trabecular and cortical bone providing rigid anchorage for the implant fixture.",
            "descriptionTa": "இம்ப்ளான்ட் திருகை உறுதியாக தாங்கிப் பிடிக்கும் தாடை எலும்பு.",
            "layerGroup": "bone",
            "defaultVisible": true,
            "colorHint": "#D9E5E7"
      },
      {
            "id": "gingiva-collar",
            "meshName": "Mesh_Gingiva_Collar",
            "labelEn": "Peri-Implant Mucosa",
            "labelTa": "ஈறு பாதுகாப்பு வளையம்",
            "descriptionEn": "Healthy mucosal seal around the implant neck preventing bacterial migration.",
            "descriptionTa": "பாக்டீரியா எலும்புக்குள் நுழைவதைத் தடுக்கும் ஈறு பாதுகாப்பு வளையம்.",
            "layerGroup": "gingiva",
            "defaultVisible": true,
            "colorHint": "#F49DA3"
      }
],
    hotspots: [
      {
            "id": "hp-fixture-threads",
            "structureId": "implant-fixture",
            "position": [
                  0,
                  -0.6,
                  0.45
            ],
            "titleEn": "Osseointegrated Threads",
            "titleTa": "எலும்போடு இணையும் திருகுகள்",
            "contentEn": "Bone cells anchor directly into micro-textured titanium surfaces.",
            "contentTa": "டைட்டானியம் மேற்பரப்பில் எலும்பு செல்கள் இயற்கையாக வளர்ந்து உறுதியாகின்றன."
      },
      {
            "id": "hp-abutment-junction",
            "structureId": "abutment",
            "position": [
                  0,
                  0.4,
                  0.35
            ],
            "titleEn": "Internal Hex Connection",
            "titleTa": "உட்புற இணைப்பு பகுதி",
            "contentEn": "Torque-tightened mechanical lock preventing prosthetic loosening.",
            "contentTa": "பல் தளர்ந்து விடாமல் உறுதியாகப் பிடித்து வைக்கும் இயந்திர இணைப்பு."
      }
],
    educationalSequences: [
      { stepNumber: 1, titleEn: 'Baseline Anatomy', titleTa: 'அடிப்படை உடற்கூறியல்', explanationEn: 'Natural anatomical condition prior to procedural intervention.', explanationTa: 'சிகிச்சைக்கு முந்தைய இயல்பான உடற்கூறியல் நிலை.', cameraPreset: 'front' },
      { stepNumber: 2, titleEn: 'Procedural Intervention', titleTa: 'சிகிச்சை செயல்முறை', explanationEn: 'Key treatment phase demonstrating gentle clinical technique.', explanationTa: 'பாதுகாப்பான முறையில் சிகிச்சை மேற்கொள்ளப்படும் முக்கிய கட்டம்.', cameraPreset: 'cross-section' }
    ]
  },
  'implant-supported-bridge': {
    procedureSlug: 'implant-supported-bridge',
    modelAssetPath: null,
    modelFamily: 'IMPLANT_BONE_SOCKET',
    modelState: 'IN_DEVELOPMENT',
    isModelReady: false,
    clinicalReviewStatus: 'EDUCATIONAL_DRAFT',
    provenance: {
      author: 'DentalVis Clinical Anatomy Team',
      license: 'Proprietary / Educational Visual Reference',
      sourceUrl: 'https://dentalvis.org/procedures/implant-supported-bridge',
    },
    defaultCameraPosition: [0, 1.5, 6.2],
    defaultCameraTarget: [0, 0, 0],
    cameraPresets: [
      { id: 'front', labelEn: 'Frontal Aspect', labelTa: 'முன்பக்க பார்வை', position: [0, 0.8, 5.8], target: [0, 0, 0] },
      { id: 'cross-section', labelEn: 'Internal Cross-Section', labelTa: 'உட்புற குறுக்குவெட்டு', position: [3.4, 1.6, 4.6], target: [0, 0, 0] },
      { id: 'occlusal', labelEn: 'Occlusal Top View', labelTa: 'மேல் மெல்லும் பரப்பு', position: [0, 6.0, 0.8], target: [0, 0, 0] },
      { id: 'apical', labelEn: 'Apical Root View', labelTa: 'வேர் முனை பார்வை', position: [0, -5.2, 2.0], target: [0, -0.5, 0] },
      { id: 'exploded', labelEn: 'Exploded Component View', labelTa: 'பிரிக்கப்பட்ட அடுக்குகள்', position: [4.4, 2.6, 5.2], target: [0, 0, 0] },
    ],
    layerGroups: [
      {
            "id": "primary",
            "labelEn": "Primary Anatomy",
            "labelTa": "முதன்மை உடற்கூறியல்",
            "defaultVisible": true
      },
      {
            "id": "supporting",
            "labelEn": "Supporting Structures",
            "labelTa": "துணை கட்டமைப்புகள்",
            "defaultVisible": true
      }
],
    structures: [
      {
            "id": "struct-primary",
            "meshName": "Mesh_Primary_Anatomy",
            "labelEn": "${p.name} Anatomical Zone",
            "labelTa": "${p.name} மருத்துவ உடற்கூறு பகுதி",
            "descriptionEn": "Educational anatomical reference area for ${p.name}. Detailed procedure-specific GLB geometry is currently undergoing clinical calibration.",
            "descriptionTa": "${p.name} சிகிச்சைக்குரிய கல்வி உடற்கூறியல் பகுதி. இதற்குரிய 3D மாதிரி தற்போது மருத்துவ அளவுத்திருத்தத்தில் உள்ளது.",
            "layerGroup": "primary",
            "defaultVisible": true,
            "colorHint": "#20B2AA"
      }
],
    hotspots: [
      {
            "id": "hp-primary",
            "structureId": "struct-primary",
            "position": [
                  0,
                  0.5,
                  0.4
            ],
            "titleEn": "${p.name} Clinical Target",
            "titleTa": "${p.name} சிகிச்சை இலக்கு",
            "contentEn": "Procedural focus zone under clinical department ${p.dept}. Inspect 2D illustration for verified details.",
            "contentTa": "${p.dept} துறைக்குரிய சிகிச்சை பகுதி. சரிபார்க்கப்பட்ட வரைபடத்தைக் காண 2D தேர்வை பயன்படுத்தவும்."
      }
],
    educationalSequences: [
      { stepNumber: 1, titleEn: 'Baseline Anatomy', titleTa: 'அடிப்படை உடற்கூறியல்', explanationEn: 'Natural anatomical condition prior to procedural intervention.', explanationTa: 'சிகிச்சைக்கு முந்தைய இயல்பான உடற்கூறியல் நிலை.', cameraPreset: 'front' },
      { stepNumber: 2, titleEn: 'Procedural Intervention', titleTa: 'சிகிச்சை செயல்முறை', explanationEn: 'Key treatment phase demonstrating gentle clinical technique.', explanationTa: 'பாதுகாப்பான முறையில் சிகிச்சை மேற்கொள்ளப்படும் முக்கிய கட்டம்.', cameraPreset: 'cross-section' }
    ]
  },
  'full-arch-implant-restoration': {
    procedureSlug: 'full-arch-implant-restoration',
    modelAssetPath: null,
    modelFamily: 'FULL_DENTAL_ARCH',
    modelState: 'IN_DEVELOPMENT',
    isModelReady: false,
    clinicalReviewStatus: 'EDUCATIONAL_DRAFT',
    provenance: {
      author: 'DentalVis Clinical Anatomy Team',
      license: 'Proprietary / Educational Visual Reference',
      sourceUrl: 'https://dentalvis.org/procedures/full-arch-implant-restoration',
    },
    defaultCameraPosition: [0, 1.5, 6.2],
    defaultCameraTarget: [0, 0, 0],
    cameraPresets: [
      { id: 'front', labelEn: 'Frontal Aspect', labelTa: 'முன்பக்க பார்வை', position: [0, 0.8, 5.8], target: [0, 0, 0] },
      { id: 'cross-section', labelEn: 'Internal Cross-Section', labelTa: 'உட்புற குறுக்குவெட்டு', position: [3.4, 1.6, 4.6], target: [0, 0, 0] },
      { id: 'occlusal', labelEn: 'Occlusal Top View', labelTa: 'மேல் மெல்லும் பரப்பு', position: [0, 6.0, 0.8], target: [0, 0, 0] },
      { id: 'apical', labelEn: 'Apical Root View', labelTa: 'வேர் முனை பார்வை', position: [0, -5.2, 2.0], target: [0, -0.5, 0] },
      { id: 'exploded', labelEn: 'Exploded Component View', labelTa: 'பிரிக்கப்பட்ட அடுக்குகள்', position: [4.4, 2.6, 5.2], target: [0, 0, 0] },
    ],
    layerGroups: [
      {
            "id": "primary",
            "labelEn": "Primary Anatomy",
            "labelTa": "முதன்மை உடற்கூறியல்",
            "defaultVisible": true
      },
      {
            "id": "supporting",
            "labelEn": "Supporting Structures",
            "labelTa": "துணை கட்டமைப்புகள்",
            "defaultVisible": true
      }
],
    structures: [
      {
            "id": "struct-primary",
            "meshName": "Mesh_Primary_Anatomy",
            "labelEn": "${p.name} Anatomical Zone",
            "labelTa": "${p.name} மருத்துவ உடற்கூறு பகுதி",
            "descriptionEn": "Educational anatomical reference area for ${p.name}. Detailed procedure-specific GLB geometry is currently undergoing clinical calibration.",
            "descriptionTa": "${p.name} சிகிச்சைக்குரிய கல்வி உடற்கூறியல் பகுதி. இதற்குரிய 3D மாதிரி தற்போது மருத்துவ அளவுத்திருத்தத்தில் உள்ளது.",
            "layerGroup": "primary",
            "defaultVisible": true,
            "colorHint": "#20B2AA"
      }
],
    hotspots: [
      {
            "id": "hp-primary",
            "structureId": "struct-primary",
            "position": [
                  0,
                  0.5,
                  0.4
            ],
            "titleEn": "${p.name} Clinical Target",
            "titleTa": "${p.name} சிகிச்சை இலக்கு",
            "contentEn": "Procedural focus zone under clinical department ${p.dept}. Inspect 2D illustration for verified details.",
            "contentTa": "${p.dept} துறைக்குரிய சிகிச்சை பகுதி. சரிபார்க்கப்பட்ட வரைபடத்தைக் காண 2D தேர்வை பயன்படுத்தவும்."
      }
],
    educationalSequences: [
      { stepNumber: 1, titleEn: 'Baseline Anatomy', titleTa: 'அடிப்படை உடற்கூறியல்', explanationEn: 'Natural anatomical condition prior to procedural intervention.', explanationTa: 'சிகிச்சைக்கு முந்தைய இயல்பான உடற்கூறியல் நிலை.', cameraPreset: 'front' },
      { stepNumber: 2, titleEn: 'Procedural Intervention', titleTa: 'சிகிச்சை செயல்முறை', explanationEn: 'Key treatment phase demonstrating gentle clinical technique.', explanationTa: 'பாதுகாப்பான முறையில் சிகிச்சை மேற்கொள்ளப்படும் முக்கிய கட்டம்.', cameraPreset: 'cross-section' }
    ]
  },
  'implant-overdenture': {
    procedureSlug: 'implant-overdenture',
    modelAssetPath: null,
    modelFamily: 'FULL_DENTAL_ARCH',
    modelState: 'IN_DEVELOPMENT',
    isModelReady: false,
    clinicalReviewStatus: 'EDUCATIONAL_DRAFT',
    provenance: {
      author: 'DentalVis Clinical Anatomy Team',
      license: 'Proprietary / Educational Visual Reference',
      sourceUrl: 'https://dentalvis.org/procedures/implant-overdenture',
    },
    defaultCameraPosition: [0, 1.5, 6.2],
    defaultCameraTarget: [0, 0, 0],
    cameraPresets: [
      { id: 'front', labelEn: 'Frontal Aspect', labelTa: 'முன்பக்க பார்வை', position: [0, 0.8, 5.8], target: [0, 0, 0] },
      { id: 'cross-section', labelEn: 'Internal Cross-Section', labelTa: 'உட்புற குறுக்குவெட்டு', position: [3.4, 1.6, 4.6], target: [0, 0, 0] },
      { id: 'occlusal', labelEn: 'Occlusal Top View', labelTa: 'மேல் மெல்லும் பரப்பு', position: [0, 6.0, 0.8], target: [0, 0, 0] },
      { id: 'apical', labelEn: 'Apical Root View', labelTa: 'வேர் முனை பார்வை', position: [0, -5.2, 2.0], target: [0, -0.5, 0] },
      { id: 'exploded', labelEn: 'Exploded Component View', labelTa: 'பிரிக்கப்பட்ட அடுக்குகள்', position: [4.4, 2.6, 5.2], target: [0, 0, 0] },
    ],
    layerGroups: [
      {
            "id": "primary",
            "labelEn": "Primary Anatomy",
            "labelTa": "முதன்மை உடற்கூறியல்",
            "defaultVisible": true
      },
      {
            "id": "supporting",
            "labelEn": "Supporting Structures",
            "labelTa": "துணை கட்டமைப்புகள்",
            "defaultVisible": true
      }
],
    structures: [
      {
            "id": "struct-primary",
            "meshName": "Mesh_Primary_Anatomy",
            "labelEn": "${p.name} Anatomical Zone",
            "labelTa": "${p.name} மருத்துவ உடற்கூறு பகுதி",
            "descriptionEn": "Educational anatomical reference area for ${p.name}. Detailed procedure-specific GLB geometry is currently undergoing clinical calibration.",
            "descriptionTa": "${p.name} சிகிச்சைக்குரிய கல்வி உடற்கூறியல் பகுதி. இதற்குரிய 3D மாதிரி தற்போது மருத்துவ அளவுத்திருத்தத்தில் உள்ளது.",
            "layerGroup": "primary",
            "defaultVisible": true,
            "colorHint": "#20B2AA"
      }
],
    hotspots: [
      {
            "id": "hp-primary",
            "structureId": "struct-primary",
            "position": [
                  0,
                  0.5,
                  0.4
            ],
            "titleEn": "${p.name} Clinical Target",
            "titleTa": "${p.name} சிகிச்சை இலக்கு",
            "contentEn": "Procedural focus zone under clinical department ${p.dept}. Inspect 2D illustration for verified details.",
            "contentTa": "${p.dept} துறைக்குரிய சிகிச்சை பகுதி. சரிபார்க்கப்பட்ட வரைபடத்தைக் காண 2D தேர்வை பயன்படுத்தவும்."
      }
],
    educationalSequences: [
      { stepNumber: 1, titleEn: 'Baseline Anatomy', titleTa: 'அடிப்படை உடற்கூறியல்', explanationEn: 'Natural anatomical condition prior to procedural intervention.', explanationTa: 'சிகிச்சைக்கு முந்தைய இயல்பான உடற்கூறியல் நிலை.', cameraPreset: 'front' },
      { stepNumber: 2, titleEn: 'Procedural Intervention', titleTa: 'சிகிச்சை செயல்முறை', explanationEn: 'Key treatment phase demonstrating gentle clinical technique.', explanationTa: 'பாதுகாப்பான முறையில் சிகிச்சை மேற்கொள்ளப்படும் முக்கிய கட்டம்.', cameraPreset: 'cross-section' }
    ]
  },
  'dental-crowns': {
    procedureSlug: 'dental-crowns',
    modelAssetPath: '/models/dental-crowns-prosthodontics.glb',
    modelFamily: 'POSTERIOR_MOLAR',
    modelState: 'AVAILABLE_AND_FUNCTIONAL',
    isModelReady: true,
    clinicalReviewStatus: 'EDUCATIONAL_DRAFT',
    provenance: {
      author: 'DentalVis Clinical Anatomy Team',
      license: 'Proprietary / Educational Visual Reference',
      sourceUrl: 'https://dentalvis.org/procedures/dental-crowns',
    },
    defaultCameraPosition: [0, 1.5, 6.2],
    defaultCameraTarget: [0, 0, 0],
    cameraPresets: [
      { id: 'front', labelEn: 'Frontal Aspect', labelTa: 'முன்பக்க பார்வை', position: [0, 0.8, 5.8], target: [0, 0, 0] },
      { id: 'cross-section', labelEn: 'Internal Cross-Section', labelTa: 'உட்புற குறுக்குவெட்டு', position: [3.4, 1.6, 4.6], target: [0, 0, 0] },
      { id: 'occlusal', labelEn: 'Occlusal Top View', labelTa: 'மேல் மெல்லும் பரப்பு', position: [0, 6.0, 0.8], target: [0, 0, 0] },
      { id: 'apical', labelEn: 'Apical Root View', labelTa: 'வேர் முனை பார்வை', position: [0, -5.2, 2.0], target: [0, -0.5, 0] },
      { id: 'exploded', labelEn: 'Exploded Component View', labelTa: 'பிரிக்கப்பட்ட அடுக்குகள்', position: [4.4, 2.6, 5.2], target: [0, 0, 0] },
    ],
    layerGroups: [
      {
            "id": "crown",
            "labelEn": "Ceramic Crown",
            "labelTa": "செராமிக் தொப்பி",
            "defaultVisible": true
      },
      {
            "id": "tooth",
            "labelEn": "Prepared Core",
            "labelTa": "தயாரிக்கப்பட்ட பல்",
            "defaultVisible": true
      },
      {
            "id": "root",
            "labelEn": "Tooth Root",
            "labelTa": "பல் வேர்",
            "defaultVisible": true
      },
      {
            "id": "bone",
            "labelEn": "Alveolar Bone",
            "labelTa": "தாடை எலும்பு",
            "defaultVisible": true
      },
      {
            "id": "gingiva",
            "labelEn": "Gingiva",
            "labelTa": "ஈறு திசு",
            "defaultVisible": true
      }
],
    structures: [
      {
            "id": "ceramic-crown",
            "meshName": "Mesh_Ceramic_Crown",
            "labelEn": "Custom Ceramic Crown",
            "labelTa": "செராமிக் பல் தொப்பி",
            "descriptionEn": "Precision-milled ceramic crown restoring tooth form, chewing strength, and lifelike aesthetics.",
            "descriptionTa": "மெல்லும் திறனையும் இயல்பான தோற்றத்தையும் மீட்டெடுக்கும் செராமிக் பல் தொப்பி.",
            "layerGroup": "crown",
            "defaultVisible": true,
            "colorHint": "#F8FCFA"
      },
      {
            "id": "prepared-core",
            "meshName": "Mesh_Prepared_Core",
            "labelEn": "Prepared Tooth Core",
            "labelTa": "தயாரிக்கப்பட்ட பல் கோர்",
            "descriptionEn": "Conservative circumferential reduction creating a solid foundation for crown retention.",
            "descriptionTa": "தொப்பியை உறுதியாக தாங்குவதற்காக வடிவமைக்கப்பட்ட பல் பகுதி.",
            "layerGroup": "tooth",
            "defaultVisible": true,
            "colorHint": "#F9EEC8"
      },
      {
            "id": "supporting-root",
            "meshName": "Mesh_Supporting_Root",
            "labelEn": "Supporting Natural Root",
            "labelTa": "ஆதரிக்கும் இயற்கை வேர்",
            "descriptionEn": "Natural tooth roots securely anchored in the jawbone socket.",
            "descriptionTa": "தாடை எலும்பில் உறுதியாக நிலைநிறுத்தப்பட்டுள்ள பல்லின் இயற்கை வேர்.",
            "layerGroup": "root",
            "defaultVisible": true,
            "colorHint": "#F5EBD0"
      },
      {
            "id": "bone-socket",
            "meshName": "Mesh_Bone_Socket",
            "labelEn": "Supporting Alveolar Bone",
            "labelTa": "தாடை எலும்பு குழி",
            "descriptionEn": "Alveolar bone socket distributing chewing forces.",
            "descriptionTa": "மெல்லும் அழுத்தத்தை தாங்கிக்கொள்ளும் தாடை எலும்பு.",
            "layerGroup": "bone",
            "defaultVisible": true,
            "colorHint": "#D9E5E7"
      },
      {
            "id": "gingival-margin",
            "meshName": "Mesh_Gingival_Margin",
            "labelEn": "Gingival Margin",
            "labelTa": "ஈறு விளிம்பு",
            "descriptionEn": "Healthy mucosal margin aligned with the crown chamfer line.",
            "descriptionTa": "கிரவுன் விளிம்போடு துல்லியமாக பொருந்தும் ஆரோக்கியமான ஈறு பகுதி.",
            "layerGroup": "gingiva",
            "defaultVisible": true,
            "colorHint": "#F49DA3"
      }
],
    hotspots: [
      {
            "id": "hp-crown-cusp",
            "structureId": "ceramic-crown",
            "position": [
                  0,
                  0.9,
                  0.4
            ],
            "titleEn": "Milled Ceramic Occlusal Surface",
            "titleTa": "செராமிக் மெல்லும் பரப்பு",
            "contentEn": "Recreates natural cusp contours for optimal chewing efficiency.",
            "contentTa": "இயற்கையான முறையில் மெல்ல உதவும் வகையில் செதுக்கப்பட்ட செராமிக் மேற்பரப்பு."
      },
      {
            "id": "hp-chamfer-margin",
            "structureId": "prepared-core",
            "position": [
                  0,
                  0.35,
                  0.4
            ],
            "titleEn": "Precision Chamfer Margin",
            "titleTa": "துல்லியமான விளிம்பு அமைப்பு",
            "contentEn": "Smooth margin allowing seamless crown transition without biological irritation.",
            "contentTa": "ஈறுகளுக்கு உறுத்தல் இல்லாதவாறு தொப்பி கச்சிதமாக பொருந்தும் விளிம்பு."
      }
],
    educationalSequences: [
      { stepNumber: 1, titleEn: 'Baseline Anatomy', titleTa: 'அடிப்படை உடற்கூறியல்', explanationEn: 'Natural anatomical condition prior to procedural intervention.', explanationTa: 'சிகிச்சைக்கு முந்தைய இயல்பான உடற்கூறியல் நிலை.', cameraPreset: 'front' },
      { stepNumber: 2, titleEn: 'Procedural Intervention', titleTa: 'சிகிச்சை செயல்முறை', explanationEn: 'Key treatment phase demonstrating gentle clinical technique.', explanationTa: 'பாதுகாப்பான முறையில் சிகிச்சை மேற்கொள்ளப்படும் முக்கிய கட்டம்.', cameraPreset: 'cross-section' }
    ]
  },
  'fixed-dental-bridge': {
    procedureSlug: 'fixed-dental-bridge',
    modelAssetPath: null,
    modelFamily: 'FULL_DENTAL_ARCH',
    modelState: 'IN_DEVELOPMENT',
    isModelReady: false,
    clinicalReviewStatus: 'EDUCATIONAL_DRAFT',
    provenance: {
      author: 'DentalVis Clinical Anatomy Team',
      license: 'Proprietary / Educational Visual Reference',
      sourceUrl: 'https://dentalvis.org/procedures/fixed-dental-bridge',
    },
    defaultCameraPosition: [0, 1.5, 6.2],
    defaultCameraTarget: [0, 0, 0],
    cameraPresets: [
      { id: 'front', labelEn: 'Frontal Aspect', labelTa: 'முன்பக்க பார்வை', position: [0, 0.8, 5.8], target: [0, 0, 0] },
      { id: 'cross-section', labelEn: 'Internal Cross-Section', labelTa: 'உட்புற குறுக்குவெட்டு', position: [3.4, 1.6, 4.6], target: [0, 0, 0] },
      { id: 'occlusal', labelEn: 'Occlusal Top View', labelTa: 'மேல் மெல்லும் பரப்பு', position: [0, 6.0, 0.8], target: [0, 0, 0] },
      { id: 'apical', labelEn: 'Apical Root View', labelTa: 'வேர் முனை பார்வை', position: [0, -5.2, 2.0], target: [0, -0.5, 0] },
      { id: 'exploded', labelEn: 'Exploded Component View', labelTa: 'பிரிக்கப்பட்ட அடுக்குகள்', position: [4.4, 2.6, 5.2], target: [0, 0, 0] },
    ],
    layerGroups: [
      {
            "id": "primary",
            "labelEn": "Primary Anatomy",
            "labelTa": "முதன்மை உடற்கூறியல்",
            "defaultVisible": true
      },
      {
            "id": "supporting",
            "labelEn": "Supporting Structures",
            "labelTa": "துணை கட்டமைப்புகள்",
            "defaultVisible": true
      }
],
    structures: [
      {
            "id": "struct-primary",
            "meshName": "Mesh_Primary_Anatomy",
            "labelEn": "${p.name} Anatomical Zone",
            "labelTa": "${p.name} மருத்துவ உடற்கூறு பகுதி",
            "descriptionEn": "Educational anatomical reference area for ${p.name}. Detailed procedure-specific GLB geometry is currently undergoing clinical calibration.",
            "descriptionTa": "${p.name} சிகிச்சைக்குரிய கல்வி உடற்கூறியல் பகுதி. இதற்குரிய 3D மாதிரி தற்போது மருத்துவ அளவுத்திருத்தத்தில் உள்ளது.",
            "layerGroup": "primary",
            "defaultVisible": true,
            "colorHint": "#20B2AA"
      }
],
    hotspots: [
      {
            "id": "hp-primary",
            "structureId": "struct-primary",
            "position": [
                  0,
                  0.5,
                  0.4
            ],
            "titleEn": "${p.name} Clinical Target",
            "titleTa": "${p.name} சிகிச்சை இலக்கு",
            "contentEn": "Procedural focus zone under clinical department ${p.dept}. Inspect 2D illustration for verified details.",
            "contentTa": "${p.dept} துறைக்குரிய சிகிச்சை பகுதி. சரிபார்க்கப்பட்ட வரைபடத்தைக் காண 2D தேர்வை பயன்படுத்தவும்."
      }
],
    educationalSequences: [
      { stepNumber: 1, titleEn: 'Baseline Anatomy', titleTa: 'அடிப்படை உடற்கூறியல்', explanationEn: 'Natural anatomical condition prior to procedural intervention.', explanationTa: 'சிகிச்சைக்கு முந்தைய இயல்பான உடற்கூறியல் நிலை.', cameraPreset: 'front' },
      { stepNumber: 2, titleEn: 'Procedural Intervention', titleTa: 'சிகிச்சை செயல்முறை', explanationEn: 'Key treatment phase demonstrating gentle clinical technique.', explanationTa: 'பாதுகாப்பான முறையில் சிகிச்சை மேற்கொள்ளப்படும் முக்கிய கட்டம்.', cameraPreset: 'cross-section' }
    ]
  },
  'complete-removable-dentures': {
    procedureSlug: 'complete-removable-dentures',
    modelAssetPath: null,
    modelFamily: 'FULL_DENTAL_ARCH',
    modelState: 'IN_DEVELOPMENT',
    isModelReady: false,
    clinicalReviewStatus: 'EDUCATIONAL_DRAFT',
    provenance: {
      author: 'DentalVis Clinical Anatomy Team',
      license: 'Proprietary / Educational Visual Reference',
      sourceUrl: 'https://dentalvis.org/procedures/complete-removable-dentures',
    },
    defaultCameraPosition: [0, 1.5, 6.2],
    defaultCameraTarget: [0, 0, 0],
    cameraPresets: [
      { id: 'front', labelEn: 'Frontal Aspect', labelTa: 'முன்பக்க பார்வை', position: [0, 0.8, 5.8], target: [0, 0, 0] },
      { id: 'cross-section', labelEn: 'Internal Cross-Section', labelTa: 'உட்புற குறுக்குவெட்டு', position: [3.4, 1.6, 4.6], target: [0, 0, 0] },
      { id: 'occlusal', labelEn: 'Occlusal Top View', labelTa: 'மேல் மெல்லும் பரப்பு', position: [0, 6.0, 0.8], target: [0, 0, 0] },
      { id: 'apical', labelEn: 'Apical Root View', labelTa: 'வேர் முனை பார்வை', position: [0, -5.2, 2.0], target: [0, -0.5, 0] },
      { id: 'exploded', labelEn: 'Exploded Component View', labelTa: 'பிரிக்கப்பட்ட அடுக்குகள்', position: [4.4, 2.6, 5.2], target: [0, 0, 0] },
    ],
    layerGroups: [
      {
            "id": "primary",
            "labelEn": "Primary Anatomy",
            "labelTa": "முதன்மை உடற்கூறியல்",
            "defaultVisible": true
      },
      {
            "id": "supporting",
            "labelEn": "Supporting Structures",
            "labelTa": "துணை கட்டமைப்புகள்",
            "defaultVisible": true
      }
],
    structures: [
      {
            "id": "struct-primary",
            "meshName": "Mesh_Primary_Anatomy",
            "labelEn": "${p.name} Anatomical Zone",
            "labelTa": "${p.name} மருத்துவ உடற்கூறு பகுதி",
            "descriptionEn": "Educational anatomical reference area for ${p.name}. Detailed procedure-specific GLB geometry is currently undergoing clinical calibration.",
            "descriptionTa": "${p.name} சிகிச்சைக்குரிய கல்வி உடற்கூறியல் பகுதி. இதற்குரிய 3D மாதிரி தற்போது மருத்துவ அளவுத்திருத்தத்தில் உள்ளது.",
            "layerGroup": "primary",
            "defaultVisible": true,
            "colorHint": "#20B2AA"
      }
],
    hotspots: [
      {
            "id": "hp-primary",
            "structureId": "struct-primary",
            "position": [
                  0,
                  0.5,
                  0.4
            ],
            "titleEn": "${p.name} Clinical Target",
            "titleTa": "${p.name} சிகிச்சை இலக்கு",
            "contentEn": "Procedural focus zone under clinical department ${p.dept}. Inspect 2D illustration for verified details.",
            "contentTa": "${p.dept} துறைக்குரிய சிகிச்சை பகுதி. சரிபார்க்கப்பட்ட வரைபடத்தைக் காண 2D தேர்வை பயன்படுத்தவும்."
      }
],
    educationalSequences: [
      { stepNumber: 1, titleEn: 'Baseline Anatomy', titleTa: 'அடிப்படை உடற்கூறியல்', explanationEn: 'Natural anatomical condition prior to procedural intervention.', explanationTa: 'சிகிச்சைக்கு முந்தைய இயல்பான உடற்கூறியல் நிலை.', cameraPreset: 'front' },
      { stepNumber: 2, titleEn: 'Procedural Intervention', titleTa: 'சிகிச்சை செயல்முறை', explanationEn: 'Key treatment phase demonstrating gentle clinical technique.', explanationTa: 'பாதுகாப்பான முறையில் சிகிச்சை மேற்கொள்ளப்படும் முக்கிய கட்டம்.', cameraPreset: 'cross-section' }
    ]
  },
  'removable-partial-dentures': {
    procedureSlug: 'removable-partial-dentures',
    modelAssetPath: null,
    modelFamily: 'FULL_DENTAL_ARCH',
    modelState: 'IN_DEVELOPMENT',
    isModelReady: false,
    clinicalReviewStatus: 'EDUCATIONAL_DRAFT',
    provenance: {
      author: 'DentalVis Clinical Anatomy Team',
      license: 'Proprietary / Educational Visual Reference',
      sourceUrl: 'https://dentalvis.org/procedures/removable-partial-dentures',
    },
    defaultCameraPosition: [0, 1.5, 6.2],
    defaultCameraTarget: [0, 0, 0],
    cameraPresets: [
      { id: 'front', labelEn: 'Frontal Aspect', labelTa: 'முன்பக்க பார்வை', position: [0, 0.8, 5.8], target: [0, 0, 0] },
      { id: 'cross-section', labelEn: 'Internal Cross-Section', labelTa: 'உட்புற குறுக்குவெட்டு', position: [3.4, 1.6, 4.6], target: [0, 0, 0] },
      { id: 'occlusal', labelEn: 'Occlusal Top View', labelTa: 'மேல் மெல்லும் பரப்பு', position: [0, 6.0, 0.8], target: [0, 0, 0] },
      { id: 'apical', labelEn: 'Apical Root View', labelTa: 'வேர் முனை பார்வை', position: [0, -5.2, 2.0], target: [0, -0.5, 0] },
      { id: 'exploded', labelEn: 'Exploded Component View', labelTa: 'பிரிக்கப்பட்ட அடுக்குகள்', position: [4.4, 2.6, 5.2], target: [0, 0, 0] },
    ],
    layerGroups: [
      {
            "id": "primary",
            "labelEn": "Primary Anatomy",
            "labelTa": "முதன்மை உடற்கூறியல்",
            "defaultVisible": true
      },
      {
            "id": "supporting",
            "labelEn": "Supporting Structures",
            "labelTa": "துணை கட்டமைப்புகள்",
            "defaultVisible": true
      }
],
    structures: [
      {
            "id": "struct-primary",
            "meshName": "Mesh_Primary_Anatomy",
            "labelEn": "${p.name} Anatomical Zone",
            "labelTa": "${p.name} மருத்துவ உடற்கூறு பகுதி",
            "descriptionEn": "Educational anatomical reference area for ${p.name}. Detailed procedure-specific GLB geometry is currently undergoing clinical calibration.",
            "descriptionTa": "${p.name} சிகிச்சைக்குரிய கல்வி உடற்கூறியல் பகுதி. இதற்குரிய 3D மாதிரி தற்போது மருத்துவ அளவுத்திருத்தத்தில் உள்ளது.",
            "layerGroup": "primary",
            "defaultVisible": true,
            "colorHint": "#20B2AA"
      }
],
    hotspots: [
      {
            "id": "hp-primary",
            "structureId": "struct-primary",
            "position": [
                  0,
                  0.5,
                  0.4
            ],
            "titleEn": "${p.name} Clinical Target",
            "titleTa": "${p.name} சிகிச்சை இலக்கு",
            "contentEn": "Procedural focus zone under clinical department ${p.dept}. Inspect 2D illustration for verified details.",
            "contentTa": "${p.dept} துறைக்குரிய சிகிச்சை பகுதி. சரிபார்க்கப்பட்ட வரைபடத்தைக் காண 2D தேர்வை பயன்படுத்தவும்."
      }
],
    educationalSequences: [
      { stepNumber: 1, titleEn: 'Baseline Anatomy', titleTa: 'அடிப்படை உடற்கூறியல்', explanationEn: 'Natural anatomical condition prior to procedural intervention.', explanationTa: 'சிகிச்சைக்கு முந்தைய இயல்பான உடற்கூறியல் நிலை.', cameraPreset: 'front' },
      { stepNumber: 2, titleEn: 'Procedural Intervention', titleTa: 'சிகிச்சை செயல்முறை', explanationEn: 'Key treatment phase demonstrating gentle clinical technique.', explanationTa: 'பாதுகாப்பான முறையில் சிகிச்சை மேற்கொள்ளப்படும் முக்கிய கட்டம்.', cameraPreset: 'cross-section' }
    ]
  },
  'full-mouth-rehabilitation': {
    procedureSlug: 'full-mouth-rehabilitation',
    modelAssetPath: null,
    modelFamily: 'FULL_DENTAL_ARCH',
    modelState: 'IN_DEVELOPMENT',
    isModelReady: false,
    clinicalReviewStatus: 'EDUCATIONAL_DRAFT',
    provenance: {
      author: 'DentalVis Clinical Anatomy Team',
      license: 'Proprietary / Educational Visual Reference',
      sourceUrl: 'https://dentalvis.org/procedures/full-mouth-rehabilitation',
    },
    defaultCameraPosition: [0, 1.5, 6.2],
    defaultCameraTarget: [0, 0, 0],
    cameraPresets: [
      { id: 'front', labelEn: 'Frontal Aspect', labelTa: 'முன்பக்க பார்வை', position: [0, 0.8, 5.8], target: [0, 0, 0] },
      { id: 'cross-section', labelEn: 'Internal Cross-Section', labelTa: 'உட்புற குறுக்குவெட்டு', position: [3.4, 1.6, 4.6], target: [0, 0, 0] },
      { id: 'occlusal', labelEn: 'Occlusal Top View', labelTa: 'மேல் மெல்லும் பரப்பு', position: [0, 6.0, 0.8], target: [0, 0, 0] },
      { id: 'apical', labelEn: 'Apical Root View', labelTa: 'வேர் முனை பார்வை', position: [0, -5.2, 2.0], target: [0, -0.5, 0] },
      { id: 'exploded', labelEn: 'Exploded Component View', labelTa: 'பிரிக்கப்பட்ட அடுக்குகள்', position: [4.4, 2.6, 5.2], target: [0, 0, 0] },
    ],
    layerGroups: [
      {
            "id": "primary",
            "labelEn": "Primary Anatomy",
            "labelTa": "முதன்மை உடற்கூறியல்",
            "defaultVisible": true
      },
      {
            "id": "supporting",
            "labelEn": "Supporting Structures",
            "labelTa": "துணை கட்டமைப்புகள்",
            "defaultVisible": true
      }
],
    structures: [
      {
            "id": "struct-primary",
            "meshName": "Mesh_Primary_Anatomy",
            "labelEn": "${p.name} Anatomical Zone",
            "labelTa": "${p.name} மருத்துவ உடற்கூறு பகுதி",
            "descriptionEn": "Educational anatomical reference area for ${p.name}. Detailed procedure-specific GLB geometry is currently undergoing clinical calibration.",
            "descriptionTa": "${p.name} சிகிச்சைக்குரிய கல்வி உடற்கூறியல் பகுதி. இதற்குரிய 3D மாதிரி தற்போது மருத்துவ அளவுத்திருத்தத்தில் உள்ளது.",
            "layerGroup": "primary",
            "defaultVisible": true,
            "colorHint": "#20B2AA"
      }
],
    hotspots: [
      {
            "id": "hp-primary",
            "structureId": "struct-primary",
            "position": [
                  0,
                  0.5,
                  0.4
            ],
            "titleEn": "${p.name} Clinical Target",
            "titleTa": "${p.name} சிகிச்சை இலக்கு",
            "contentEn": "Procedural focus zone under clinical department ${p.dept}. Inspect 2D illustration for verified details.",
            "contentTa": "${p.dept} துறைக்குரிய சிகிச்சை பகுதி. சரிபார்க்கப்பட்ட வரைபடத்தைக் காண 2D தேர்வை பயன்படுத்தவும்."
      }
],
    educationalSequences: [
      { stepNumber: 1, titleEn: 'Baseline Anatomy', titleTa: 'அடிப்படை உடற்கூறியல்', explanationEn: 'Natural anatomical condition prior to procedural intervention.', explanationTa: 'சிகிச்சைக்கு முந்தைய இயல்பான உடற்கூறியல் நிலை.', cameraPreset: 'front' },
      { stepNumber: 2, titleEn: 'Procedural Intervention', titleTa: 'சிகிச்சை செயல்முறை', explanationEn: 'Key treatment phase demonstrating gentle clinical technique.', explanationTa: 'பாதுகாப்பான முறையில் சிகிச்சை மேற்கொள்ளப்படும் முக்கிய கட்டம்.', cameraPreset: 'cross-section' }
    ]
  },
  'fixed-orthodontic-braces': {
    procedureSlug: 'fixed-orthodontic-braces',
    modelAssetPath: '/models/orthodontic-braces-arch.glb',
    modelFamily: 'FULL_DENTAL_ARCH',
    modelState: 'AVAILABLE_AND_FUNCTIONAL',
    isModelReady: true,
    clinicalReviewStatus: 'EDUCATIONAL_DRAFT',
    provenance: {
      author: 'DentalVis Clinical Anatomy Team',
      license: 'Proprietary / Educational Visual Reference',
      sourceUrl: 'https://dentalvis.org/procedures/fixed-orthodontic-braces',
    },
    defaultCameraPosition: [0, 1.5, 6.2],
    defaultCameraTarget: [0, 0, 0],
    cameraPresets: [
      { id: 'front', labelEn: 'Frontal Aspect', labelTa: 'முன்பக்க பார்வை', position: [0, 0.8, 5.8], target: [0, 0, 0] },
      { id: 'cross-section', labelEn: 'Internal Cross-Section', labelTa: 'உட்புற குறுக்குவெட்டு', position: [3.4, 1.6, 4.6], target: [0, 0, 0] },
      { id: 'occlusal', labelEn: 'Occlusal Top View', labelTa: 'மேல் மெல்லும் பரப்பு', position: [0, 6.0, 0.8], target: [0, 0, 0] },
      { id: 'apical', labelEn: 'Apical Root View', labelTa: 'வேர் முனை பார்வை', position: [0, -5.2, 2.0], target: [0, -0.5, 0] },
      { id: 'exploded', labelEn: 'Exploded Component View', labelTa: 'பிரிக்கப்பட்ட அடுக்குகள்', position: [4.4, 2.6, 5.2], target: [0, 0, 0] },
    ],
    layerGroups: [
      {
            "id": "wire",
            "labelEn": "NiTi Archwire",
            "labelTa": "நினைவாற்றல் கம்பி",
            "defaultVisible": true
      },
      {
            "id": "brackets",
            "labelEn": "Brackets System",
            "labelTa": "பிராக்கெட் தொகுப்பு",
            "defaultVisible": true
      },
      {
            "id": "teeth",
            "labelEn": "Dental Arch Teeth",
            "labelTa": "பற்கள் வளைவு",
            "defaultVisible": true
      },
      {
            "id": "bone",
            "labelEn": "Alveolar Bone",
            "labelTa": "தாடை எலும்பு",
            "defaultVisible": true
      }
],
    structures: [
      {
            "id": "arch-brackets",
            "meshName": "Mesh_Bracket_4",
            "labelEn": "Bonded Orthodontic Brackets",
            "labelTa": "பல் கிளிப் பிராக்கெட்டுகள்",
            "descriptionEn": "Precision metallic/ceramic brackets bonded to the facial surface of each tooth.",
            "descriptionTa": "பற்களின் மையப் பகுதியில் உறுதியாக ஒட்டப்படும் கிளிப் பிராக்கெட்டுகள்.",
            "layerGroup": "brackets",
            "defaultVisible": true,
            "colorHint": "#C4CDD2"
      },
      {
            "id": "niti-wire",
            "meshName": "Mesh_NiTi_Archwire",
            "labelEn": "NiTi Shape-Memory Archwire",
            "labelTa": "நிக்கல்-டைட்டானியம் நினைவாற்றல் கம்பி",
            "descriptionEn": "High-elasticity nickel-titanium wire delivering steady continuous biological forces.",
            "descriptionTa": "பற்களை சரியான வரிசைக்கு மெதுவாக வழிநடத்தும் நினைவாற்றல் கம்பி.",
            "layerGroup": "wire",
            "defaultVisible": true,
            "colorHint": "#DDE4E8"
      },
      {
            "id": "arch-teeth",
            "meshName": "Mesh_Arch_Tooth_4",
            "labelEn": "Anatomical Dental Arch Teeth",
            "labelTa": "பல் வரிசை பற்கள்",
            "descriptionEn": "Crowded or spaced dental arch teeth being gently guided into healthy alignment.",
            "descriptionTa": "சீரான புன்னகைக்காக சரியான வரிசைக்கு நகர்த்தப்படும் பற்கள்.",
            "layerGroup": "teeth",
            "defaultVisible": true,
            "colorHint": "#F5FBF9"
      },
      {
            "id": "arch-bone",
            "meshName": "Mesh_Alveolar_Arch_Bone",
            "labelEn": "Alveolar Arch Bone Housing",
            "labelTa": "தாடை எலும்பு வளைவு",
            "descriptionEn": "Alveolar bone undergoing healthy biological remodeling around moving roots.",
            "descriptionTa": "பற்கள் நகரும் போது அதற்கேற்ப மறுசீரமைக்கப்படும் தாடை எலும்பு.",
            "layerGroup": "bone",
            "defaultVisible": true,
            "colorHint": "#D9E5E7"
      }
],
    hotspots: [
      {
            "id": "hp-bracket-slot",
            "structureId": "arch-brackets",
            "position": [
                  0,
                  0.3,
                  0.55
            ],
            "titleEn": "Bracket Torque Slot",
            "titleTa": "பிராக்கெட் கம்பி பள்ளம்",
            "contentEn": "Transmits 3D rotational and leveling forces directly into the tooth center of resistance.",
            "contentTa": "பல்லை சரியான திசையில் சுழற்றி வரிசைப்படுத்த விசையை கடத்தும் பள்ளம்."
      },
      {
            "id": "hp-wire-curve",
            "structureId": "niti-wire",
            "position": [
                  0.5,
                  0.3,
                  0.45
            ],
            "titleEn": "Pre-Programmed Archform",
            "titleTa": "முன்வடிவமைக்கப்பட்ட வளைவு",
            "contentEn": "Superelastic alloy returns to its ideal parabolic archform, aligning teeth.",
            "contentTa": "இயற்கையான பல் வரிசை வளைவை நோக்கி பற்களை மெதுவாக இழுக்கும் கம்பி."
      }
],
    educationalSequences: [
      { stepNumber: 1, titleEn: 'Baseline Anatomy', titleTa: 'அடிப்படை உடற்கூறியல்', explanationEn: 'Natural anatomical condition prior to procedural intervention.', explanationTa: 'சிகிச்சைக்கு முந்தைய இயல்பான உடற்கூறியல் நிலை.', cameraPreset: 'front' },
      { stepNumber: 2, titleEn: 'Procedural Intervention', titleTa: 'சிகிச்சை செயல்முறை', explanationEn: 'Key treatment phase demonstrating gentle clinical technique.', explanationTa: 'பாதுகாப்பான முறையில் சிகிச்சை மேற்கொள்ளப்படும் முக்கிய கட்டம்.', cameraPreset: 'cross-section' }
    ]
  },
  'clear-aligners': {
    procedureSlug: 'clear-aligners',
    modelAssetPath: null,
    modelFamily: 'FULL_DENTAL_ARCH',
    modelState: 'IN_DEVELOPMENT',
    isModelReady: false,
    clinicalReviewStatus: 'EDUCATIONAL_DRAFT',
    provenance: {
      author: 'DentalVis Clinical Anatomy Team',
      license: 'Proprietary / Educational Visual Reference',
      sourceUrl: 'https://dentalvis.org/procedures/clear-aligners',
    },
    defaultCameraPosition: [0, 1.5, 6.2],
    defaultCameraTarget: [0, 0, 0],
    cameraPresets: [
      { id: 'front', labelEn: 'Frontal Aspect', labelTa: 'முன்பக்க பார்வை', position: [0, 0.8, 5.8], target: [0, 0, 0] },
      { id: 'cross-section', labelEn: 'Internal Cross-Section', labelTa: 'உட்புற குறுக்குவெட்டு', position: [3.4, 1.6, 4.6], target: [0, 0, 0] },
      { id: 'occlusal', labelEn: 'Occlusal Top View', labelTa: 'மேல் மெல்லும் பரப்பு', position: [0, 6.0, 0.8], target: [0, 0, 0] },
      { id: 'apical', labelEn: 'Apical Root View', labelTa: 'வேர் முனை பார்வை', position: [0, -5.2, 2.0], target: [0, -0.5, 0] },
      { id: 'exploded', labelEn: 'Exploded Component View', labelTa: 'பிரிக்கப்பட்ட அடுக்குகள்', position: [4.4, 2.6, 5.2], target: [0, 0, 0] },
    ],
    layerGroups: [
      {
            "id": "primary",
            "labelEn": "Primary Anatomy",
            "labelTa": "முதன்மை உடற்கூறியல்",
            "defaultVisible": true
      },
      {
            "id": "supporting",
            "labelEn": "Supporting Structures",
            "labelTa": "துணை கட்டமைப்புகள்",
            "defaultVisible": true
      }
],
    structures: [
      {
            "id": "struct-primary",
            "meshName": "Mesh_Primary_Anatomy",
            "labelEn": "${p.name} Anatomical Zone",
            "labelTa": "${p.name} மருத்துவ உடற்கூறு பகுதி",
            "descriptionEn": "Educational anatomical reference area for ${p.name}. Detailed procedure-specific GLB geometry is currently undergoing clinical calibration.",
            "descriptionTa": "${p.name} சிகிச்சைக்குரிய கல்வி உடற்கூறியல் பகுதி. இதற்குரிய 3D மாதிரி தற்போது மருத்துவ அளவுத்திருத்தத்தில் உள்ளது.",
            "layerGroup": "primary",
            "defaultVisible": true,
            "colorHint": "#20B2AA"
      }
],
    hotspots: [
      {
            "id": "hp-primary",
            "structureId": "struct-primary",
            "position": [
                  0,
                  0.5,
                  0.4
            ],
            "titleEn": "${p.name} Clinical Target",
            "titleTa": "${p.name} சிகிச்சை இலக்கு",
            "contentEn": "Procedural focus zone under clinical department ${p.dept}. Inspect 2D illustration for verified details.",
            "contentTa": "${p.dept} துறைக்குரிய சிகிச்சை பகுதி. சரிபார்க்கப்பட்ட வரைபடத்தைக் காண 2D தேர்வை பயன்படுத்தவும்."
      }
],
    educationalSequences: [
      { stepNumber: 1, titleEn: 'Baseline Anatomy', titleTa: 'அடிப்படை உடற்கூறியல்', explanationEn: 'Natural anatomical condition prior to procedural intervention.', explanationTa: 'சிகிச்சைக்கு முந்தைய இயல்பான உடற்கூறியல் நிலை.', cameraPreset: 'front' },
      { stepNumber: 2, titleEn: 'Procedural Intervention', titleTa: 'சிகிச்சை செயல்முறை', explanationEn: 'Key treatment phase demonstrating gentle clinical technique.', explanationTa: 'பாதுகாப்பான முறையில் சிகிச்சை மேற்கொள்ளப்படும் முக்கிய கட்டம்.', cameraPreset: 'cross-section' }
    ]
  },
  'palatal-expander': {
    procedureSlug: 'palatal-expander',
    modelAssetPath: null,
    modelFamily: 'FULL_DENTAL_ARCH',
    modelState: 'IN_DEVELOPMENT',
    isModelReady: false,
    clinicalReviewStatus: 'EDUCATIONAL_DRAFT',
    provenance: {
      author: 'DentalVis Clinical Anatomy Team',
      license: 'Proprietary / Educational Visual Reference',
      sourceUrl: 'https://dentalvis.org/procedures/palatal-expander',
    },
    defaultCameraPosition: [0, 1.5, 6.2],
    defaultCameraTarget: [0, 0, 0],
    cameraPresets: [
      { id: 'front', labelEn: 'Frontal Aspect', labelTa: 'முன்பக்க பார்வை', position: [0, 0.8, 5.8], target: [0, 0, 0] },
      { id: 'cross-section', labelEn: 'Internal Cross-Section', labelTa: 'உட்புற குறுக்குவெட்டு', position: [3.4, 1.6, 4.6], target: [0, 0, 0] },
      { id: 'occlusal', labelEn: 'Occlusal Top View', labelTa: 'மேல் மெல்லும் பரப்பு', position: [0, 6.0, 0.8], target: [0, 0, 0] },
      { id: 'apical', labelEn: 'Apical Root View', labelTa: 'வேர் முனை பார்வை', position: [0, -5.2, 2.0], target: [0, -0.5, 0] },
      { id: 'exploded', labelEn: 'Exploded Component View', labelTa: 'பிரிக்கப்பட்ட அடுக்குகள்', position: [4.4, 2.6, 5.2], target: [0, 0, 0] },
    ],
    layerGroups: [
      {
            "id": "primary",
            "labelEn": "Primary Anatomy",
            "labelTa": "முதன்மை உடற்கூறியல்",
            "defaultVisible": true
      },
      {
            "id": "supporting",
            "labelEn": "Supporting Structures",
            "labelTa": "துணை கட்டமைப்புகள்",
            "defaultVisible": true
      }
],
    structures: [
      {
            "id": "struct-primary",
            "meshName": "Mesh_Primary_Anatomy",
            "labelEn": "${p.name} Anatomical Zone",
            "labelTa": "${p.name} மருத்துவ உடற்கூறு பகுதி",
            "descriptionEn": "Educational anatomical reference area for ${p.name}. Detailed procedure-specific GLB geometry is currently undergoing clinical calibration.",
            "descriptionTa": "${p.name} சிகிச்சைக்குரிய கல்வி உடற்கூறியல் பகுதி. இதற்குரிய 3D மாதிரி தற்போது மருத்துவ அளவுத்திருத்தத்தில் உள்ளது.",
            "layerGroup": "primary",
            "defaultVisible": true,
            "colorHint": "#20B2AA"
      }
],
    hotspots: [
      {
            "id": "hp-primary",
            "structureId": "struct-primary",
            "position": [
                  0,
                  0.5,
                  0.4
            ],
            "titleEn": "${p.name} Clinical Target",
            "titleTa": "${p.name} சிகிச்சை இலக்கு",
            "contentEn": "Procedural focus zone under clinical department ${p.dept}. Inspect 2D illustration for verified details.",
            "contentTa": "${p.dept} துறைக்குரிய சிகிச்சை பகுதி. சரிபார்க்கப்பட்ட வரைபடத்தைக் காண 2D தேர்வை பயன்படுத்தவும்."
      }
],
    educationalSequences: [
      { stepNumber: 1, titleEn: 'Baseline Anatomy', titleTa: 'அடிப்படை உடற்கூறியல்', explanationEn: 'Natural anatomical condition prior to procedural intervention.', explanationTa: 'சிகிச்சைக்கு முந்தைய இயல்பான உடற்கூறியல் நிலை.', cameraPreset: 'front' },
      { stepNumber: 2, titleEn: 'Procedural Intervention', titleTa: 'சிகிச்சை செயல்முறை', explanationEn: 'Key treatment phase demonstrating gentle clinical technique.', explanationTa: 'பாதுகாப்பான முறையில் சிகிச்சை மேற்கொள்ளப்படும் முக்கிய கட்டம்.', cameraPreset: 'cross-section' }
    ]
  },
  'orthodontic-retainers': {
    procedureSlug: 'orthodontic-retainers',
    modelAssetPath: null,
    modelFamily: 'FULL_DENTAL_ARCH',
    modelState: 'IN_DEVELOPMENT',
    isModelReady: false,
    clinicalReviewStatus: 'EDUCATIONAL_DRAFT',
    provenance: {
      author: 'DentalVis Clinical Anatomy Team',
      license: 'Proprietary / Educational Visual Reference',
      sourceUrl: 'https://dentalvis.org/procedures/orthodontic-retainers',
    },
    defaultCameraPosition: [0, 1.5, 6.2],
    defaultCameraTarget: [0, 0, 0],
    cameraPresets: [
      { id: 'front', labelEn: 'Frontal Aspect', labelTa: 'முன்பக்க பார்வை', position: [0, 0.8, 5.8], target: [0, 0, 0] },
      { id: 'cross-section', labelEn: 'Internal Cross-Section', labelTa: 'உட்புற குறுக்குவெட்டு', position: [3.4, 1.6, 4.6], target: [0, 0, 0] },
      { id: 'occlusal', labelEn: 'Occlusal Top View', labelTa: 'மேல் மெல்லும் பரப்பு', position: [0, 6.0, 0.8], target: [0, 0, 0] },
      { id: 'apical', labelEn: 'Apical Root View', labelTa: 'வேர் முனை பார்வை', position: [0, -5.2, 2.0], target: [0, -0.5, 0] },
      { id: 'exploded', labelEn: 'Exploded Component View', labelTa: 'பிரிக்கப்பட்ட அடுக்குகள்', position: [4.4, 2.6, 5.2], target: [0, 0, 0] },
    ],
    layerGroups: [
      {
            "id": "primary",
            "labelEn": "Primary Anatomy",
            "labelTa": "முதன்மை உடற்கூறியல்",
            "defaultVisible": true
      },
      {
            "id": "supporting",
            "labelEn": "Supporting Structures",
            "labelTa": "துணை கட்டமைப்புகள்",
            "defaultVisible": true
      }
],
    structures: [
      {
            "id": "struct-primary",
            "meshName": "Mesh_Primary_Anatomy",
            "labelEn": "${p.name} Anatomical Zone",
            "labelTa": "${p.name} மருத்துவ உடற்கூறு பகுதி",
            "descriptionEn": "Educational anatomical reference area for ${p.name}. Detailed procedure-specific GLB geometry is currently undergoing clinical calibration.",
            "descriptionTa": "${p.name} சிகிச்சைக்குரிய கல்வி உடற்கூறியல் பகுதி. இதற்குரிய 3D மாதிரி தற்போது மருத்துவ அளவுத்திருத்தத்தில் உள்ளது.",
            "layerGroup": "primary",
            "defaultVisible": true,
            "colorHint": "#20B2AA"
      }
],
    hotspots: [
      {
            "id": "hp-primary",
            "structureId": "struct-primary",
            "position": [
                  0,
                  0.5,
                  0.4
            ],
            "titleEn": "${p.name} Clinical Target",
            "titleTa": "${p.name} சிகிச்சை இலக்கு",
            "contentEn": "Procedural focus zone under clinical department ${p.dept}. Inspect 2D illustration for verified details.",
            "contentTa": "${p.dept} துறைக்குரிய சிகிச்சை பகுதி. சரிபார்க்கப்பட்ட வரைபடத்தைக் காண 2D தேர்வை பயன்படுத்தவும்."
      }
],
    educationalSequences: [
      { stepNumber: 1, titleEn: 'Baseline Anatomy', titleTa: 'அடிப்படை உடற்கூறியல்', explanationEn: 'Natural anatomical condition prior to procedural intervention.', explanationTa: 'சிகிச்சைக்கு முந்தைய இயல்பான உடற்கூறியல் நிலை.', cameraPreset: 'front' },
      { stepNumber: 2, titleEn: 'Procedural Intervention', titleTa: 'சிகிச்சை செயல்முறை', explanationEn: 'Key treatment phase demonstrating gentle clinical technique.', explanationTa: 'பாதுகாப்பான முறையில் சிகிச்சை மேற்கொள்ளப்படும் முக்கிய கட்டம்.', cameraPreset: 'cross-section' }
    ]
  },
  'pediatric-pulpotomy': {
    procedureSlug: 'pediatric-pulpotomy',
    modelAssetPath: null,
    modelFamily: 'PEDIATRIC_PRIMARY_DENTITION',
    modelState: 'IN_DEVELOPMENT',
    isModelReady: false,
    clinicalReviewStatus: 'EDUCATIONAL_DRAFT',
    provenance: {
      author: 'DentalVis Clinical Anatomy Team',
      license: 'Proprietary / Educational Visual Reference',
      sourceUrl: 'https://dentalvis.org/procedures/pediatric-pulpotomy',
    },
    defaultCameraPosition: [0, 1.5, 6.2],
    defaultCameraTarget: [0, 0, 0],
    cameraPresets: [
      { id: 'front', labelEn: 'Frontal Aspect', labelTa: 'முன்பக்க பார்வை', position: [0, 0.8, 5.8], target: [0, 0, 0] },
      { id: 'cross-section', labelEn: 'Internal Cross-Section', labelTa: 'உட்புற குறுக்குவெட்டு', position: [3.4, 1.6, 4.6], target: [0, 0, 0] },
      { id: 'occlusal', labelEn: 'Occlusal Top View', labelTa: 'மேல் மெல்லும் பரப்பு', position: [0, 6.0, 0.8], target: [0, 0, 0] },
      { id: 'apical', labelEn: 'Apical Root View', labelTa: 'வேர் முனை பார்வை', position: [0, -5.2, 2.0], target: [0, -0.5, 0] },
      { id: 'exploded', labelEn: 'Exploded Component View', labelTa: 'பிரிக்கப்பட்ட அடுக்குகள்', position: [4.4, 2.6, 5.2], target: [0, 0, 0] },
    ],
    layerGroups: [
      {
            "id": "primary",
            "labelEn": "Primary Anatomy",
            "labelTa": "முதன்மை உடற்கூறியல்",
            "defaultVisible": true
      },
      {
            "id": "supporting",
            "labelEn": "Supporting Structures",
            "labelTa": "துணை கட்டமைப்புகள்",
            "defaultVisible": true
      }
],
    structures: [
      {
            "id": "struct-primary",
            "meshName": "Mesh_Primary_Anatomy",
            "labelEn": "${p.name} Anatomical Zone",
            "labelTa": "${p.name} மருத்துவ உடற்கூறு பகுதி",
            "descriptionEn": "Educational anatomical reference area for ${p.name}. Detailed procedure-specific GLB geometry is currently undergoing clinical calibration.",
            "descriptionTa": "${p.name} சிகிச்சைக்குரிய கல்வி உடற்கூறியல் பகுதி. இதற்குரிய 3D மாதிரி தற்போது மருத்துவ அளவுத்திருத்தத்தில் உள்ளது.",
            "layerGroup": "primary",
            "defaultVisible": true,
            "colorHint": "#20B2AA"
      }
],
    hotspots: [
      {
            "id": "hp-primary",
            "structureId": "struct-primary",
            "position": [
                  0,
                  0.5,
                  0.4
            ],
            "titleEn": "${p.name} Clinical Target",
            "titleTa": "${p.name} சிகிச்சை இலக்கு",
            "contentEn": "Procedural focus zone under clinical department ${p.dept}. Inspect 2D illustration for verified details.",
            "contentTa": "${p.dept} துறைக்குரிய சிகிச்சை பகுதி. சரிபார்க்கப்பட்ட வரைபடத்தைக் காண 2D தேர்வை பயன்படுத்தவும்."
      }
],
    educationalSequences: [
      { stepNumber: 1, titleEn: 'Baseline Anatomy', titleTa: 'அடிப்படை உடற்கூறியல்', explanationEn: 'Natural anatomical condition prior to procedural intervention.', explanationTa: 'சிகிச்சைக்கு முந்தைய இயல்பான உடற்கூறியல் நிலை.', cameraPreset: 'front' },
      { stepNumber: 2, titleEn: 'Procedural Intervention', titleTa: 'சிகிச்சை செயல்முறை', explanationEn: 'Key treatment phase demonstrating gentle clinical technique.', explanationTa: 'பாதுகாப்பான முறையில் சிகிச்சை மேற்கொள்ளப்படும் முக்கிய கட்டம்.', cameraPreset: 'cross-section' }
    ]
  },
  'pediatric-stainless-steel-crowns': {
    procedureSlug: 'pediatric-stainless-steel-crowns',
    modelAssetPath: null,
    modelFamily: 'PEDIATRIC_PRIMARY_DENTITION',
    modelState: 'IN_DEVELOPMENT',
    isModelReady: false,
    clinicalReviewStatus: 'EDUCATIONAL_DRAFT',
    provenance: {
      author: 'DentalVis Clinical Anatomy Team',
      license: 'Proprietary / Educational Visual Reference',
      sourceUrl: 'https://dentalvis.org/procedures/pediatric-stainless-steel-crowns',
    },
    defaultCameraPosition: [0, 1.5, 6.2],
    defaultCameraTarget: [0, 0, 0],
    cameraPresets: [
      { id: 'front', labelEn: 'Frontal Aspect', labelTa: 'முன்பக்க பார்வை', position: [0, 0.8, 5.8], target: [0, 0, 0] },
      { id: 'cross-section', labelEn: 'Internal Cross-Section', labelTa: 'உட்புற குறுக்குவெட்டு', position: [3.4, 1.6, 4.6], target: [0, 0, 0] },
      { id: 'occlusal', labelEn: 'Occlusal Top View', labelTa: 'மேல் மெல்லும் பரப்பு', position: [0, 6.0, 0.8], target: [0, 0, 0] },
      { id: 'apical', labelEn: 'Apical Root View', labelTa: 'வேர் முனை பார்வை', position: [0, -5.2, 2.0], target: [0, -0.5, 0] },
      { id: 'exploded', labelEn: 'Exploded Component View', labelTa: 'பிரிக்கப்பட்ட அடுக்குகள்', position: [4.4, 2.6, 5.2], target: [0, 0, 0] },
    ],
    layerGroups: [
      {
            "id": "primary",
            "labelEn": "Primary Anatomy",
            "labelTa": "முதன்மை உடற்கூறியல்",
            "defaultVisible": true
      },
      {
            "id": "supporting",
            "labelEn": "Supporting Structures",
            "labelTa": "துணை கட்டமைப்புகள்",
            "defaultVisible": true
      }
],
    structures: [
      {
            "id": "struct-primary",
            "meshName": "Mesh_Primary_Anatomy",
            "labelEn": "${p.name} Anatomical Zone",
            "labelTa": "${p.name} மருத்துவ உடற்கூறு பகுதி",
            "descriptionEn": "Educational anatomical reference area for ${p.name}. Detailed procedure-specific GLB geometry is currently undergoing clinical calibration.",
            "descriptionTa": "${p.name} சிகிச்சைக்குரிய கல்வி உடற்கூறியல் பகுதி. இதற்குரிய 3D மாதிரி தற்போது மருத்துவ அளவுத்திருத்தத்தில் உள்ளது.",
            "layerGroup": "primary",
            "defaultVisible": true,
            "colorHint": "#20B2AA"
      }
],
    hotspots: [
      {
            "id": "hp-primary",
            "structureId": "struct-primary",
            "position": [
                  0,
                  0.5,
                  0.4
            ],
            "titleEn": "${p.name} Clinical Target",
            "titleTa": "${p.name} சிகிச்சை இலக்கு",
            "contentEn": "Procedural focus zone under clinical department ${p.dept}. Inspect 2D illustration for verified details.",
            "contentTa": "${p.dept} துறைக்குரிய சிகிச்சை பகுதி. சரிபார்க்கப்பட்ட வரைபடத்தைக் காண 2D தேர்வை பயன்படுத்தவும்."
      }
],
    educationalSequences: [
      { stepNumber: 1, titleEn: 'Baseline Anatomy', titleTa: 'அடிப்படை உடற்கூறியல்', explanationEn: 'Natural anatomical condition prior to procedural intervention.', explanationTa: 'சிகிச்சைக்கு முந்தைய இயல்பான உடற்கூறியல் நிலை.', cameraPreset: 'front' },
      { stepNumber: 2, titleEn: 'Procedural Intervention', titleTa: 'சிகிச்சை செயல்முறை', explanationEn: 'Key treatment phase demonstrating gentle clinical technique.', explanationTa: 'பாதுகாப்பான முறையில் சிகிச்சை மேற்கொள்ளப்படும் முக்கிய கட்டம்.', cameraPreset: 'cross-section' }
    ]
  },
  'pediatric-space-maintainers': {
    procedureSlug: 'pediatric-space-maintainers',
    modelAssetPath: null,
    modelFamily: 'PEDIATRIC_PRIMARY_DENTITION',
    modelState: 'IN_DEVELOPMENT',
    isModelReady: false,
    clinicalReviewStatus: 'EDUCATIONAL_DRAFT',
    provenance: {
      author: 'DentalVis Clinical Anatomy Team',
      license: 'Proprietary / Educational Visual Reference',
      sourceUrl: 'https://dentalvis.org/procedures/pediatric-space-maintainers',
    },
    defaultCameraPosition: [0, 1.5, 6.2],
    defaultCameraTarget: [0, 0, 0],
    cameraPresets: [
      { id: 'front', labelEn: 'Frontal Aspect', labelTa: 'முன்பக்க பார்வை', position: [0, 0.8, 5.8], target: [0, 0, 0] },
      { id: 'cross-section', labelEn: 'Internal Cross-Section', labelTa: 'உட்புற குறுக்குவெட்டு', position: [3.4, 1.6, 4.6], target: [0, 0, 0] },
      { id: 'occlusal', labelEn: 'Occlusal Top View', labelTa: 'மேல் மெல்லும் பரப்பு', position: [0, 6.0, 0.8], target: [0, 0, 0] },
      { id: 'apical', labelEn: 'Apical Root View', labelTa: 'வேர் முனை பார்வை', position: [0, -5.2, 2.0], target: [0, -0.5, 0] },
      { id: 'exploded', labelEn: 'Exploded Component View', labelTa: 'பிரிக்கப்பட்ட அடுக்குகள்', position: [4.4, 2.6, 5.2], target: [0, 0, 0] },
    ],
    layerGroups: [
      {
            "id": "primary",
            "labelEn": "Primary Anatomy",
            "labelTa": "முதன்மை உடற்கூறியல்",
            "defaultVisible": true
      },
      {
            "id": "supporting",
            "labelEn": "Supporting Structures",
            "labelTa": "துணை கட்டமைப்புகள்",
            "defaultVisible": true
      }
],
    structures: [
      {
            "id": "struct-primary",
            "meshName": "Mesh_Primary_Anatomy",
            "labelEn": "${p.name} Anatomical Zone",
            "labelTa": "${p.name} மருத்துவ உடற்கூறு பகுதி",
            "descriptionEn": "Educational anatomical reference area for ${p.name}. Detailed procedure-specific GLB geometry is currently undergoing clinical calibration.",
            "descriptionTa": "${p.name} சிகிச்சைக்குரிய கல்வி உடற்கூறியல் பகுதி. இதற்குரிய 3D மாதிரி தற்போது மருத்துவ அளவுத்திருத்தத்தில் உள்ளது.",
            "layerGroup": "primary",
            "defaultVisible": true,
            "colorHint": "#20B2AA"
      }
],
    hotspots: [
      {
            "id": "hp-primary",
            "structureId": "struct-primary",
            "position": [
                  0,
                  0.5,
                  0.4
            ],
            "titleEn": "${p.name} Clinical Target",
            "titleTa": "${p.name} சிகிச்சை இலக்கு",
            "contentEn": "Procedural focus zone under clinical department ${p.dept}. Inspect 2D illustration for verified details.",
            "contentTa": "${p.dept} துறைக்குரிய சிகிச்சை பகுதி. சரிபார்க்கப்பட்ட வரைபடத்தைக் காண 2D தேர்வை பயன்படுத்தவும்."
      }
],
    educationalSequences: [
      { stepNumber: 1, titleEn: 'Baseline Anatomy', titleTa: 'அடிப்படை உடற்கூறியல்', explanationEn: 'Natural anatomical condition prior to procedural intervention.', explanationTa: 'சிகிச்சைக்கு முந்தைய இயல்பான உடற்கூறியல் நிலை.', cameraPreset: 'front' },
      { stepNumber: 2, titleEn: 'Procedural Intervention', titleTa: 'சிகிச்சை செயல்முறை', explanationEn: 'Key treatment phase demonstrating gentle clinical technique.', explanationTa: 'பாதுகாப்பான முறையில் சிகிச்சை மேற்கொள்ளப்படும் முக்கிய கட்டம்.', cameraPreset: 'cross-section' }
    ]
  },
  'professional-teeth-whitening': {
    procedureSlug: 'professional-teeth-whitening',
    modelAssetPath: null,
    modelFamily: 'POSTERIOR_MOLAR',
    modelState: 'IN_DEVELOPMENT',
    isModelReady: false,
    clinicalReviewStatus: 'EDUCATIONAL_DRAFT',
    provenance: {
      author: 'DentalVis Clinical Anatomy Team',
      license: 'Proprietary / Educational Visual Reference',
      sourceUrl: 'https://dentalvis.org/procedures/professional-teeth-whitening',
    },
    defaultCameraPosition: [0, 1.5, 6.2],
    defaultCameraTarget: [0, 0, 0],
    cameraPresets: [
      { id: 'front', labelEn: 'Frontal Aspect', labelTa: 'முன்பக்க பார்வை', position: [0, 0.8, 5.8], target: [0, 0, 0] },
      { id: 'cross-section', labelEn: 'Internal Cross-Section', labelTa: 'உட்புற குறுக்குவெட்டு', position: [3.4, 1.6, 4.6], target: [0, 0, 0] },
      { id: 'occlusal', labelEn: 'Occlusal Top View', labelTa: 'மேல் மெல்லும் பரப்பு', position: [0, 6.0, 0.8], target: [0, 0, 0] },
      { id: 'apical', labelEn: 'Apical Root View', labelTa: 'வேர் முனை பார்வை', position: [0, -5.2, 2.0], target: [0, -0.5, 0] },
      { id: 'exploded', labelEn: 'Exploded Component View', labelTa: 'பிரிக்கப்பட்ட அடுக்குகள்', position: [4.4, 2.6, 5.2], target: [0, 0, 0] },
    ],
    layerGroups: [
      {
            "id": "primary",
            "labelEn": "Primary Anatomy",
            "labelTa": "முதன்மை உடற்கூறியல்",
            "defaultVisible": true
      },
      {
            "id": "supporting",
            "labelEn": "Supporting Structures",
            "labelTa": "துணை கட்டமைப்புகள்",
            "defaultVisible": true
      }
],
    structures: [
      {
            "id": "struct-primary",
            "meshName": "Mesh_Primary_Anatomy",
            "labelEn": "${p.name} Anatomical Zone",
            "labelTa": "${p.name} மருத்துவ உடற்கூறு பகுதி",
            "descriptionEn": "Educational anatomical reference area for ${p.name}. Detailed procedure-specific GLB geometry is currently undergoing clinical calibration.",
            "descriptionTa": "${p.name} சிகிச்சைக்குரிய கல்வி உடற்கூறியல் பகுதி. இதற்குரிய 3D மாதிரி தற்போது மருத்துவ அளவுத்திருத்தத்தில் உள்ளது.",
            "layerGroup": "primary",
            "defaultVisible": true,
            "colorHint": "#20B2AA"
      }
],
    hotspots: [
      {
            "id": "hp-primary",
            "structureId": "struct-primary",
            "position": [
                  0,
                  0.5,
                  0.4
            ],
            "titleEn": "${p.name} Clinical Target",
            "titleTa": "${p.name} சிகிச்சை இலக்கு",
            "contentEn": "Procedural focus zone under clinical department ${p.dept}. Inspect 2D illustration for verified details.",
            "contentTa": "${p.dept} துறைக்குரிய சிகிச்சை பகுதி. சரிபார்க்கப்பட்ட வரைபடத்தைக் காண 2D தேர்வை பயன்படுத்தவும்."
      }
],
    educationalSequences: [
      { stepNumber: 1, titleEn: 'Baseline Anatomy', titleTa: 'அடிப்படை உடற்கூறியல்', explanationEn: 'Natural anatomical condition prior to procedural intervention.', explanationTa: 'சிகிச்சைக்கு முந்தைய இயல்பான உடற்கூறியல் நிலை.', cameraPreset: 'front' },
      { stepNumber: 2, titleEn: 'Procedural Intervention', titleTa: 'சிகிச்சை செயல்முறை', explanationEn: 'Key treatment phase demonstrating gentle clinical technique.', explanationTa: 'பாதுகாப்பான முறையில் சிகிச்சை மேற்கொள்ளப்படும் முக்கிய கட்டம்.', cameraPreset: 'cross-section' }
    ]
  },
  'porcelain-veneers': {
    procedureSlug: 'porcelain-veneers',
    modelAssetPath: null,
    modelFamily: 'ANTERIOR_INCISOR',
    modelState: 'IN_DEVELOPMENT',
    isModelReady: false,
    clinicalReviewStatus: 'EDUCATIONAL_DRAFT',
    provenance: {
      author: 'DentalVis Clinical Anatomy Team',
      license: 'Proprietary / Educational Visual Reference',
      sourceUrl: 'https://dentalvis.org/procedures/porcelain-veneers',
    },
    defaultCameraPosition: [0, 1.5, 6.2],
    defaultCameraTarget: [0, 0, 0],
    cameraPresets: [
      { id: 'front', labelEn: 'Frontal Aspect', labelTa: 'முன்பக்க பார்வை', position: [0, 0.8, 5.8], target: [0, 0, 0] },
      { id: 'cross-section', labelEn: 'Internal Cross-Section', labelTa: 'உட்புற குறுக்குவெட்டு', position: [3.4, 1.6, 4.6], target: [0, 0, 0] },
      { id: 'occlusal', labelEn: 'Occlusal Top View', labelTa: 'மேல் மெல்லும் பரப்பு', position: [0, 6.0, 0.8], target: [0, 0, 0] },
      { id: 'apical', labelEn: 'Apical Root View', labelTa: 'வேர் முனை பார்வை', position: [0, -5.2, 2.0], target: [0, -0.5, 0] },
      { id: 'exploded', labelEn: 'Exploded Component View', labelTa: 'பிரிக்கப்பட்ட அடுக்குகள்', position: [4.4, 2.6, 5.2], target: [0, 0, 0] },
    ],
    layerGroups: [
      {
            "id": "primary",
            "labelEn": "Primary Anatomy",
            "labelTa": "முதன்மை உடற்கூறியல்",
            "defaultVisible": true
      },
      {
            "id": "supporting",
            "labelEn": "Supporting Structures",
            "labelTa": "துணை கட்டமைப்புகள்",
            "defaultVisible": true
      }
],
    structures: [
      {
            "id": "struct-primary",
            "meshName": "Mesh_Primary_Anatomy",
            "labelEn": "${p.name} Anatomical Zone",
            "labelTa": "${p.name} மருத்துவ உடற்கூறு பகுதி",
            "descriptionEn": "Educational anatomical reference area for ${p.name}. Detailed procedure-specific GLB geometry is currently undergoing clinical calibration.",
            "descriptionTa": "${p.name} சிகிச்சைக்குரிய கல்வி உடற்கூறியல் பகுதி. இதற்குரிய 3D மாதிரி தற்போது மருத்துவ அளவுத்திருத்தத்தில் உள்ளது.",
            "layerGroup": "primary",
            "defaultVisible": true,
            "colorHint": "#20B2AA"
      }
],
    hotspots: [
      {
            "id": "hp-primary",
            "structureId": "struct-primary",
            "position": [
                  0,
                  0.5,
                  0.4
            ],
            "titleEn": "${p.name} Clinical Target",
            "titleTa": "${p.name} சிகிச்சை இலக்கு",
            "contentEn": "Procedural focus zone under clinical department ${p.dept}. Inspect 2D illustration for verified details.",
            "contentTa": "${p.dept} துறைக்குரிய சிகிச்சை பகுதி. சரிபார்க்கப்பட்ட வரைபடத்தைக் காண 2D தேர்வை பயன்படுத்தவும்."
      }
],
    educationalSequences: [
      { stepNumber: 1, titleEn: 'Baseline Anatomy', titleTa: 'அடிப்படை உடற்கூறியல்', explanationEn: 'Natural anatomical condition prior to procedural intervention.', explanationTa: 'சிகிச்சைக்கு முந்தைய இயல்பான உடற்கூறியல் நிலை.', cameraPreset: 'front' },
      { stepNumber: 2, titleEn: 'Procedural Intervention', titleTa: 'சிகிச்சை செயல்முறை', explanationEn: 'Key treatment phase demonstrating gentle clinical technique.', explanationTa: 'பாதுகாப்பான முறையில் சிகிச்சை மேற்கொள்ளப்படும் முக்கிய கட்டம்.', cameraPreset: 'cross-section' }
    ]
  },
  'gingival-recontouring': {
    procedureSlug: 'gingival-recontouring',
    modelAssetPath: null,
    modelFamily: 'ANTERIOR_INCISOR',
    modelState: 'IN_DEVELOPMENT',
    isModelReady: false,
    clinicalReviewStatus: 'EDUCATIONAL_DRAFT',
    provenance: {
      author: 'DentalVis Clinical Anatomy Team',
      license: 'Proprietary / Educational Visual Reference',
      sourceUrl: 'https://dentalvis.org/procedures/gingival-recontouring',
    },
    defaultCameraPosition: [0, 1.5, 6.2],
    defaultCameraTarget: [0, 0, 0],
    cameraPresets: [
      { id: 'front', labelEn: 'Frontal Aspect', labelTa: 'முன்பக்க பார்வை', position: [0, 0.8, 5.8], target: [0, 0, 0] },
      { id: 'cross-section', labelEn: 'Internal Cross-Section', labelTa: 'உட்புற குறுக்குவெட்டு', position: [3.4, 1.6, 4.6], target: [0, 0, 0] },
      { id: 'occlusal', labelEn: 'Occlusal Top View', labelTa: 'மேல் மெல்லும் பரப்பு', position: [0, 6.0, 0.8], target: [0, 0, 0] },
      { id: 'apical', labelEn: 'Apical Root View', labelTa: 'வேர் முனை பார்வை', position: [0, -5.2, 2.0], target: [0, -0.5, 0] },
      { id: 'exploded', labelEn: 'Exploded Component View', labelTa: 'பிரிக்கப்பட்ட அடுக்குகள்', position: [4.4, 2.6, 5.2], target: [0, 0, 0] },
    ],
    layerGroups: [
      {
            "id": "primary",
            "labelEn": "Primary Anatomy",
            "labelTa": "முதன்மை உடற்கூறியல்",
            "defaultVisible": true
      },
      {
            "id": "supporting",
            "labelEn": "Supporting Structures",
            "labelTa": "துணை கட்டமைப்புகள்",
            "defaultVisible": true
      }
],
    structures: [
      {
            "id": "struct-primary",
            "meshName": "Mesh_Primary_Anatomy",
            "labelEn": "${p.name} Anatomical Zone",
            "labelTa": "${p.name} மருத்துவ உடற்கூறு பகுதி",
            "descriptionEn": "Educational anatomical reference area for ${p.name}. Detailed procedure-specific GLB geometry is currently undergoing clinical calibration.",
            "descriptionTa": "${p.name} சிகிச்சைக்குரிய கல்வி உடற்கூறியல் பகுதி. இதற்குரிய 3D மாதிரி தற்போது மருத்துவ அளவுத்திருத்தத்தில் உள்ளது.",
            "layerGroup": "primary",
            "defaultVisible": true,
            "colorHint": "#20B2AA"
      }
],
    hotspots: [
      {
            "id": "hp-primary",
            "structureId": "struct-primary",
            "position": [
                  0,
                  0.5,
                  0.4
            ],
            "titleEn": "${p.name} Clinical Target",
            "titleTa": "${p.name} சிகிச்சை இலக்கு",
            "contentEn": "Procedural focus zone under clinical department ${p.dept}. Inspect 2D illustration for verified details.",
            "contentTa": "${p.dept} துறைக்குரிய சிகிச்சை பகுதி. சரிபார்க்கப்பட்ட வரைபடத்தைக் காண 2D தேர்வை பயன்படுத்தவும்."
      }
],
    educationalSequences: [
      { stepNumber: 1, titleEn: 'Baseline Anatomy', titleTa: 'அடிப்படை உடற்கூறியல்', explanationEn: 'Natural anatomical condition prior to procedural intervention.', explanationTa: 'சிகிச்சைக்கு முந்தைய இயல்பான உடற்கூறியல் நிலை.', cameraPreset: 'front' },
      { stepNumber: 2, titleEn: 'Procedural Intervention', titleTa: 'சிகிச்சை செயல்முறை', explanationEn: 'Key treatment phase demonstrating gentle clinical technique.', explanationTa: 'பாதுகாப்பான முறையில் சிகிச்சை மேற்கொள்ளப்படும் முக்கிய கட்டம்.', cameraPreset: 'cross-section' }
    ]
  },
  'knocked-out-tooth-avulsion': {
    procedureSlug: 'knocked-out-tooth-avulsion',
    modelAssetPath: null,
    modelFamily: 'ANTERIOR_INCISOR',
    modelState: 'IN_DEVELOPMENT',
    isModelReady: false,
    clinicalReviewStatus: 'EDUCATIONAL_DRAFT',
    provenance: {
      author: 'DentalVis Clinical Anatomy Team',
      license: 'Proprietary / Educational Visual Reference',
      sourceUrl: 'https://dentalvis.org/procedures/knocked-out-tooth-avulsion',
    },
    defaultCameraPosition: [0, 1.5, 6.2],
    defaultCameraTarget: [0, 0, 0],
    cameraPresets: [
      { id: 'front', labelEn: 'Frontal Aspect', labelTa: 'முன்பக்க பார்வை', position: [0, 0.8, 5.8], target: [0, 0, 0] },
      { id: 'cross-section', labelEn: 'Internal Cross-Section', labelTa: 'உட்புற குறுக்குவெட்டு', position: [3.4, 1.6, 4.6], target: [0, 0, 0] },
      { id: 'occlusal', labelEn: 'Occlusal Top View', labelTa: 'மேல் மெல்லும் பரப்பு', position: [0, 6.0, 0.8], target: [0, 0, 0] },
      { id: 'apical', labelEn: 'Apical Root View', labelTa: 'வேர் முனை பார்வை', position: [0, -5.2, 2.0], target: [0, -0.5, 0] },
      { id: 'exploded', labelEn: 'Exploded Component View', labelTa: 'பிரிக்கப்பட்ட அடுக்குகள்', position: [4.4, 2.6, 5.2], target: [0, 0, 0] },
    ],
    layerGroups: [
      {
            "id": "primary",
            "labelEn": "Primary Anatomy",
            "labelTa": "முதன்மை உடற்கூறியல்",
            "defaultVisible": true
      },
      {
            "id": "supporting",
            "labelEn": "Supporting Structures",
            "labelTa": "துணை கட்டமைப்புகள்",
            "defaultVisible": true
      }
],
    structures: [
      {
            "id": "struct-primary",
            "meshName": "Mesh_Primary_Anatomy",
            "labelEn": "${p.name} Anatomical Zone",
            "labelTa": "${p.name} மருத்துவ உடற்கூறு பகுதி",
            "descriptionEn": "Educational anatomical reference area for ${p.name}. Detailed procedure-specific GLB geometry is currently undergoing clinical calibration.",
            "descriptionTa": "${p.name} சிகிச்சைக்குரிய கல்வி உடற்கூறியல் பகுதி. இதற்குரிய 3D மாதிரி தற்போது மருத்துவ அளவுத்திருத்தத்தில் உள்ளது.",
            "layerGroup": "primary",
            "defaultVisible": true,
            "colorHint": "#20B2AA"
      }
],
    hotspots: [
      {
            "id": "hp-primary",
            "structureId": "struct-primary",
            "position": [
                  0,
                  0.5,
                  0.4
            ],
            "titleEn": "${p.name} Clinical Target",
            "titleTa": "${p.name} சிகிச்சை இலக்கு",
            "contentEn": "Procedural focus zone under clinical department ${p.dept}. Inspect 2D illustration for verified details.",
            "contentTa": "${p.dept} துறைக்குரிய சிகிச்சை பகுதி. சரிபார்க்கப்பட்ட வரைபடத்தைக் காண 2D தேர்வை பயன்படுத்தவும்."
      }
],
    educationalSequences: [
      { stepNumber: 1, titleEn: 'Baseline Anatomy', titleTa: 'அடிப்படை உடற்கூறியல்', explanationEn: 'Natural anatomical condition prior to procedural intervention.', explanationTa: 'சிகிச்சைக்கு முந்தைய இயல்பான உடற்கூறியல் நிலை.', cameraPreset: 'front' },
      { stepNumber: 2, titleEn: 'Procedural Intervention', titleTa: 'சிகிச்சை செயல்முறை', explanationEn: 'Key treatment phase demonstrating gentle clinical technique.', explanationTa: 'பாதுகாப்பான முறையில் சிகிச்சை மேற்கொள்ளப்படும் முக்கிய கட்டம்.', cameraPreset: 'cross-section' }
    ]
  },
  'emergency-broken-tooth-repair': {
    procedureSlug: 'emergency-broken-tooth-repair',
    modelAssetPath: null,
    modelFamily: 'ANTERIOR_INCISOR',
    modelState: 'IN_DEVELOPMENT',
    isModelReady: false,
    clinicalReviewStatus: 'EDUCATIONAL_DRAFT',
    provenance: {
      author: 'DentalVis Clinical Anatomy Team',
      license: 'Proprietary / Educational Visual Reference',
      sourceUrl: 'https://dentalvis.org/procedures/emergency-broken-tooth-repair',
    },
    defaultCameraPosition: [0, 1.5, 6.2],
    defaultCameraTarget: [0, 0, 0],
    cameraPresets: [
      { id: 'front', labelEn: 'Frontal Aspect', labelTa: 'முன்பக்க பார்வை', position: [0, 0.8, 5.8], target: [0, 0, 0] },
      { id: 'cross-section', labelEn: 'Internal Cross-Section', labelTa: 'உட்புற குறுக்குவெட்டு', position: [3.4, 1.6, 4.6], target: [0, 0, 0] },
      { id: 'occlusal', labelEn: 'Occlusal Top View', labelTa: 'மேல் மெல்லும் பரப்பு', position: [0, 6.0, 0.8], target: [0, 0, 0] },
      { id: 'apical', labelEn: 'Apical Root View', labelTa: 'வேர் முனை பார்வை', position: [0, -5.2, 2.0], target: [0, -0.5, 0] },
      { id: 'exploded', labelEn: 'Exploded Component View', labelTa: 'பிரிக்கப்பட்ட அடுக்குகள்', position: [4.4, 2.6, 5.2], target: [0, 0, 0] },
    ],
    layerGroups: [
      {
            "id": "primary",
            "labelEn": "Primary Anatomy",
            "labelTa": "முதன்மை உடற்கூறியல்",
            "defaultVisible": true
      },
      {
            "id": "supporting",
            "labelEn": "Supporting Structures",
            "labelTa": "துணை கட்டமைப்புகள்",
            "defaultVisible": true
      }
],
    structures: [
      {
            "id": "struct-primary",
            "meshName": "Mesh_Primary_Anatomy",
            "labelEn": "${p.name} Anatomical Zone",
            "labelTa": "${p.name} மருத்துவ உடற்கூறு பகுதி",
            "descriptionEn": "Educational anatomical reference area for ${p.name}. Detailed procedure-specific GLB geometry is currently undergoing clinical calibration.",
            "descriptionTa": "${p.name} சிகிச்சைக்குரிய கல்வி உடற்கூறியல் பகுதி. இதற்குரிய 3D மாதிரி தற்போது மருத்துவ அளவுத்திருத்தத்தில் உள்ளது.",
            "layerGroup": "primary",
            "defaultVisible": true,
            "colorHint": "#20B2AA"
      }
],
    hotspots: [
      {
            "id": "hp-primary",
            "structureId": "struct-primary",
            "position": [
                  0,
                  0.5,
                  0.4
            ],
            "titleEn": "${p.name} Clinical Target",
            "titleTa": "${p.name} சிகிச்சை இலக்கு",
            "contentEn": "Procedural focus zone under clinical department ${p.dept}. Inspect 2D illustration for verified details.",
            "contentTa": "${p.dept} துறைக்குரிய சிகிச்சை பகுதி. சரிபார்க்கப்பட்ட வரைபடத்தைக் காண 2D தேர்வை பயன்படுத்தவும்."
      }
],
    educationalSequences: [
      { stepNumber: 1, titleEn: 'Baseline Anatomy', titleTa: 'அடிப்படை உடற்கூறியல்', explanationEn: 'Natural anatomical condition prior to procedural intervention.', explanationTa: 'சிகிச்சைக்கு முந்தைய இயல்பான உடற்கூறியல் நிலை.', cameraPreset: 'front' },
      { stepNumber: 2, titleEn: 'Procedural Intervention', titleTa: 'சிகிச்சை செயல்முறை', explanationEn: 'Key treatment phase demonstrating gentle clinical technique.', explanationTa: 'பாதுகாப்பான முறையில் சிகிச்சை மேற்கொள்ளப்படும் முக்கிய கட்டம்.', cameraPreset: 'cross-section' }
    ]
  },
  'recement-dislodged-crown-bridge': {
    procedureSlug: 'recement-dislodged-crown-bridge',
    modelAssetPath: null,
    modelFamily: 'POSTERIOR_MOLAR',
    modelState: 'IN_DEVELOPMENT',
    isModelReady: false,
    clinicalReviewStatus: 'EDUCATIONAL_DRAFT',
    provenance: {
      author: 'DentalVis Clinical Anatomy Team',
      license: 'Proprietary / Educational Visual Reference',
      sourceUrl: 'https://dentalvis.org/procedures/recement-dislodged-crown-bridge',
    },
    defaultCameraPosition: [0, 1.5, 6.2],
    defaultCameraTarget: [0, 0, 0],
    cameraPresets: [
      { id: 'front', labelEn: 'Frontal Aspect', labelTa: 'முன்பக்க பார்வை', position: [0, 0.8, 5.8], target: [0, 0, 0] },
      { id: 'cross-section', labelEn: 'Internal Cross-Section', labelTa: 'உட்புற குறுக்குவெட்டு', position: [3.4, 1.6, 4.6], target: [0, 0, 0] },
      { id: 'occlusal', labelEn: 'Occlusal Top View', labelTa: 'மேல் மெல்லும் பரப்பு', position: [0, 6.0, 0.8], target: [0, 0, 0] },
      { id: 'apical', labelEn: 'Apical Root View', labelTa: 'வேர் முனை பார்வை', position: [0, -5.2, 2.0], target: [0, -0.5, 0] },
      { id: 'exploded', labelEn: 'Exploded Component View', labelTa: 'பிரிக்கப்பட்ட அடுக்குகள்', position: [4.4, 2.6, 5.2], target: [0, 0, 0] },
    ],
    layerGroups: [
      {
            "id": "primary",
            "labelEn": "Primary Anatomy",
            "labelTa": "முதன்மை உடற்கூறியல்",
            "defaultVisible": true
      },
      {
            "id": "supporting",
            "labelEn": "Supporting Structures",
            "labelTa": "துணை கட்டமைப்புகள்",
            "defaultVisible": true
      }
],
    structures: [
      {
            "id": "struct-primary",
            "meshName": "Mesh_Primary_Anatomy",
            "labelEn": "${p.name} Anatomical Zone",
            "labelTa": "${p.name} மருத்துவ உடற்கூறு பகுதி",
            "descriptionEn": "Educational anatomical reference area for ${p.name}. Detailed procedure-specific GLB geometry is currently undergoing clinical calibration.",
            "descriptionTa": "${p.name} சிகிச்சைக்குரிய கல்வி உடற்கூறியல் பகுதி. இதற்குரிய 3D மாதிரி தற்போது மருத்துவ அளவுத்திருத்தத்தில் உள்ளது.",
            "layerGroup": "primary",
            "defaultVisible": true,
            "colorHint": "#20B2AA"
      }
],
    hotspots: [
      {
            "id": "hp-primary",
            "structureId": "struct-primary",
            "position": [
                  0,
                  0.5,
                  0.4
            ],
            "titleEn": "${p.name} Clinical Target",
            "titleTa": "${p.name} சிகிச்சை இலக்கு",
            "contentEn": "Procedural focus zone under clinical department ${p.dept}. Inspect 2D illustration for verified details.",
            "contentTa": "${p.dept} துறைக்குரிய சிகிச்சை பகுதி. சரிபார்க்கப்பட்ட வரைபடத்தைக் காண 2D தேர்வை பயன்படுத்தவும்."
      }
],
    educationalSequences: [
      { stepNumber: 1, titleEn: 'Baseline Anatomy', titleTa: 'அடிப்படை உடற்கூறியல்', explanationEn: 'Natural anatomical condition prior to procedural intervention.', explanationTa: 'சிகிச்சைக்கு முந்தைய இயல்பான உடற்கூறியல் நிலை.', cameraPreset: 'front' },
      { stepNumber: 2, titleEn: 'Procedural Intervention', titleTa: 'சிகிச்சை செயல்முறை', explanationEn: 'Key treatment phase demonstrating gentle clinical technique.', explanationTa: 'பாதுகாப்பான முறையில் சிகிச்சை மேற்கொள்ளப்படும் முக்கிய கட்டம்.', cameraPreset: 'cross-section' }
    ]
  },
  'nitrous-oxide-inhalation-sedation': {
    procedureSlug: 'nitrous-oxide-inhalation-sedation',
    modelAssetPath: null,
    modelFamily: 'AIRWAY_SYSTEMIC_SPECIALIZED',
    modelState: 'IN_DEVELOPMENT',
    isModelReady: false,
    clinicalReviewStatus: 'EDUCATIONAL_DRAFT',
    provenance: {
      author: 'DentalVis Clinical Anatomy Team',
      license: 'Proprietary / Educational Visual Reference',
      sourceUrl: 'https://dentalvis.org/procedures/nitrous-oxide-inhalation-sedation',
    },
    defaultCameraPosition: [0, 1.5, 6.2],
    defaultCameraTarget: [0, 0, 0],
    cameraPresets: [
      { id: 'front', labelEn: 'Frontal Aspect', labelTa: 'முன்பக்க பார்வை', position: [0, 0.8, 5.8], target: [0, 0, 0] },
      { id: 'cross-section', labelEn: 'Internal Cross-Section', labelTa: 'உட்புற குறுக்குவெட்டு', position: [3.4, 1.6, 4.6], target: [0, 0, 0] },
      { id: 'occlusal', labelEn: 'Occlusal Top View', labelTa: 'மேல் மெல்லும் பரப்பு', position: [0, 6.0, 0.8], target: [0, 0, 0] },
      { id: 'apical', labelEn: 'Apical Root View', labelTa: 'வேர் முனை பார்வை', position: [0, -5.2, 2.0], target: [0, -0.5, 0] },
      { id: 'exploded', labelEn: 'Exploded Component View', labelTa: 'பிரிக்கப்பட்ட அடுக்குகள்', position: [4.4, 2.6, 5.2], target: [0, 0, 0] },
    ],
    layerGroups: [
      {
            "id": "primary",
            "labelEn": "Primary Anatomy",
            "labelTa": "முதன்மை உடற்கூறியல்",
            "defaultVisible": true
      },
      {
            "id": "supporting",
            "labelEn": "Supporting Structures",
            "labelTa": "துணை கட்டமைப்புகள்",
            "defaultVisible": true
      }
],
    structures: [
      {
            "id": "struct-primary",
            "meshName": "Mesh_Primary_Anatomy",
            "labelEn": "${p.name} Anatomical Zone",
            "labelTa": "${p.name} மருத்துவ உடற்கூறு பகுதி",
            "descriptionEn": "Educational anatomical reference area for ${p.name}. Detailed procedure-specific GLB geometry is currently undergoing clinical calibration.",
            "descriptionTa": "${p.name} சிகிச்சைக்குரிய கல்வி உடற்கூறியல் பகுதி. இதற்குரிய 3D மாதிரி தற்போது மருத்துவ அளவுத்திருத்தத்தில் உள்ளது.",
            "layerGroup": "primary",
            "defaultVisible": true,
            "colorHint": "#20B2AA"
      }
],
    hotspots: [
      {
            "id": "hp-primary",
            "structureId": "struct-primary",
            "position": [
                  0,
                  0.5,
                  0.4
            ],
            "titleEn": "${p.name} Clinical Target",
            "titleTa": "${p.name} சிகிச்சை இலக்கு",
            "contentEn": "Procedural focus zone under clinical department ${p.dept}. Inspect 2D illustration for verified details.",
            "contentTa": "${p.dept} துறைக்குரிய சிகிச்சை பகுதி. சரிபார்க்கப்பட்ட வரைபடத்தைக் காண 2D தேர்வை பயன்படுத்தவும்."
      }
],
    educationalSequences: [
      { stepNumber: 1, titleEn: 'Baseline Anatomy', titleTa: 'அடிப்படை உடற்கூறியல்', explanationEn: 'Natural anatomical condition prior to procedural intervention.', explanationTa: 'சிகிச்சைக்கு முந்தைய இயல்பான உடற்கூறியல் நிலை.', cameraPreset: 'front' },
      { stepNumber: 2, titleEn: 'Procedural Intervention', titleTa: 'சிகிச்சை செயல்முறை', explanationEn: 'Key treatment phase demonstrating gentle clinical technique.', explanationTa: 'பாதுகாப்பான முறையில் சிகிச்சை மேற்கொள்ளப்படும் முக்கிய கட்டம்.', cameraPreset: 'cross-section' }
    ]
  },
  'oral-sedation': {
    procedureSlug: 'oral-sedation',
    modelAssetPath: null,
    modelFamily: 'AIRWAY_SYSTEMIC_SPECIALIZED',
    modelState: 'IN_DEVELOPMENT',
    isModelReady: false,
    clinicalReviewStatus: 'EDUCATIONAL_DRAFT',
    provenance: {
      author: 'DentalVis Clinical Anatomy Team',
      license: 'Proprietary / Educational Visual Reference',
      sourceUrl: 'https://dentalvis.org/procedures/oral-sedation',
    },
    defaultCameraPosition: [0, 1.5, 6.2],
    defaultCameraTarget: [0, 0, 0],
    cameraPresets: [
      { id: 'front', labelEn: 'Frontal Aspect', labelTa: 'முன்பக்க பார்வை', position: [0, 0.8, 5.8], target: [0, 0, 0] },
      { id: 'cross-section', labelEn: 'Internal Cross-Section', labelTa: 'உட்புற குறுக்குவெட்டு', position: [3.4, 1.6, 4.6], target: [0, 0, 0] },
      { id: 'occlusal', labelEn: 'Occlusal Top View', labelTa: 'மேல் மெல்லும் பரப்பு', position: [0, 6.0, 0.8], target: [0, 0, 0] },
      { id: 'apical', labelEn: 'Apical Root View', labelTa: 'வேர் முனை பார்வை', position: [0, -5.2, 2.0], target: [0, -0.5, 0] },
      { id: 'exploded', labelEn: 'Exploded Component View', labelTa: 'பிரிக்கப்பட்ட அடுக்குகள்', position: [4.4, 2.6, 5.2], target: [0, 0, 0] },
    ],
    layerGroups: [
      {
            "id": "primary",
            "labelEn": "Primary Anatomy",
            "labelTa": "முதன்மை உடற்கூறியல்",
            "defaultVisible": true
      },
      {
            "id": "supporting",
            "labelEn": "Supporting Structures",
            "labelTa": "துணை கட்டமைப்புகள்",
            "defaultVisible": true
      }
],
    structures: [
      {
            "id": "struct-primary",
            "meshName": "Mesh_Primary_Anatomy",
            "labelEn": "${p.name} Anatomical Zone",
            "labelTa": "${p.name} மருத்துவ உடற்கூறு பகுதி",
            "descriptionEn": "Educational anatomical reference area for ${p.name}. Detailed procedure-specific GLB geometry is currently undergoing clinical calibration.",
            "descriptionTa": "${p.name} சிகிச்சைக்குரிய கல்வி உடற்கூறியல் பகுதி. இதற்குரிய 3D மாதிரி தற்போது மருத்துவ அளவுத்திருத்தத்தில் உள்ளது.",
            "layerGroup": "primary",
            "defaultVisible": true,
            "colorHint": "#20B2AA"
      }
],
    hotspots: [
      {
            "id": "hp-primary",
            "structureId": "struct-primary",
            "position": [
                  0,
                  0.5,
                  0.4
            ],
            "titleEn": "${p.name} Clinical Target",
            "titleTa": "${p.name} சிகிச்சை இலக்கு",
            "contentEn": "Procedural focus zone under clinical department ${p.dept}. Inspect 2D illustration for verified details.",
            "contentTa": "${p.dept} துறைக்குரிய சிகிச்சை பகுதி. சரிபார்க்கப்பட்ட வரைபடத்தைக் காண 2D தேர்வை பயன்படுத்தவும்."
      }
],
    educationalSequences: [
      { stepNumber: 1, titleEn: 'Baseline Anatomy', titleTa: 'அடிப்படை உடற்கூறியல்', explanationEn: 'Natural anatomical condition prior to procedural intervention.', explanationTa: 'சிகிச்சைக்கு முந்தைய இயல்பான உடற்கூறியல் நிலை.', cameraPreset: 'front' },
      { stepNumber: 2, titleEn: 'Procedural Intervention', titleTa: 'சிகிச்சை செயல்முறை', explanationEn: 'Key treatment phase demonstrating gentle clinical technique.', explanationTa: 'பாதுகாப்பான முறையில் சிகிச்சை மேற்கொள்ளப்படும் முக்கிய கட்டம்.', cameraPreset: 'cross-section' }
    ]
  },
  'intravenous-dental-sedation': {
    procedureSlug: 'intravenous-dental-sedation',
    modelAssetPath: null,
    modelFamily: 'AIRWAY_SYSTEMIC_SPECIALIZED',
    modelState: 'IN_DEVELOPMENT',
    isModelReady: false,
    clinicalReviewStatus: 'EDUCATIONAL_DRAFT',
    provenance: {
      author: 'DentalVis Clinical Anatomy Team',
      license: 'Proprietary / Educational Visual Reference',
      sourceUrl: 'https://dentalvis.org/procedures/intravenous-dental-sedation',
    },
    defaultCameraPosition: [0, 1.5, 6.2],
    defaultCameraTarget: [0, 0, 0],
    cameraPresets: [
      { id: 'front', labelEn: 'Frontal Aspect', labelTa: 'முன்பக்க பார்வை', position: [0, 0.8, 5.8], target: [0, 0, 0] },
      { id: 'cross-section', labelEn: 'Internal Cross-Section', labelTa: 'உட்புற குறுக்குவெட்டு', position: [3.4, 1.6, 4.6], target: [0, 0, 0] },
      { id: 'occlusal', labelEn: 'Occlusal Top View', labelTa: 'மேல் மெல்லும் பரப்பு', position: [0, 6.0, 0.8], target: [0, 0, 0] },
      { id: 'apical', labelEn: 'Apical Root View', labelTa: 'வேர் முனை பார்வை', position: [0, -5.2, 2.0], target: [0, -0.5, 0] },
      { id: 'exploded', labelEn: 'Exploded Component View', labelTa: 'பிரிக்கப்பட்ட அடுக்குகள்', position: [4.4, 2.6, 5.2], target: [0, 0, 0] },
    ],
    layerGroups: [
      {
            "id": "primary",
            "labelEn": "Primary Anatomy",
            "labelTa": "முதன்மை உடற்கூறியல்",
            "defaultVisible": true
      },
      {
            "id": "supporting",
            "labelEn": "Supporting Structures",
            "labelTa": "துணை கட்டமைப்புகள்",
            "defaultVisible": true
      }
],
    structures: [
      {
            "id": "struct-primary",
            "meshName": "Mesh_Primary_Anatomy",
            "labelEn": "${p.name} Anatomical Zone",
            "labelTa": "${p.name} மருத்துவ உடற்கூறு பகுதி",
            "descriptionEn": "Educational anatomical reference area for ${p.name}. Detailed procedure-specific GLB geometry is currently undergoing clinical calibration.",
            "descriptionTa": "${p.name} சிகிச்சைக்குரிய கல்வி உடற்கூறியல் பகுதி. இதற்குரிய 3D மாதிரி தற்போது மருத்துவ அளவுத்திருத்தத்தில் உள்ளது.",
            "layerGroup": "primary",
            "defaultVisible": true,
            "colorHint": "#20B2AA"
      }
],
    hotspots: [
      {
            "id": "hp-primary",
            "structureId": "struct-primary",
            "position": [
                  0,
                  0.5,
                  0.4
            ],
            "titleEn": "${p.name} Clinical Target",
            "titleTa": "${p.name} சிகிச்சை இலக்கு",
            "contentEn": "Procedural focus zone under clinical department ${p.dept}. Inspect 2D illustration for verified details.",
            "contentTa": "${p.dept} துறைக்குரிய சிகிச்சை பகுதி. சரிபார்க்கப்பட்ட வரைபடத்தைக் காண 2D தேர்வை பயன்படுத்தவும்."
      }
],
    educationalSequences: [
      { stepNumber: 1, titleEn: 'Baseline Anatomy', titleTa: 'அடிப்படை உடற்கூறியல்', explanationEn: 'Natural anatomical condition prior to procedural intervention.', explanationTa: 'சிகிச்சைக்கு முந்தைய இயல்பான உடற்கூறியல் நிலை.', cameraPreset: 'front' },
      { stepNumber: 2, titleEn: 'Procedural Intervention', titleTa: 'சிகிச்சை செயல்முறை', explanationEn: 'Key treatment phase demonstrating gentle clinical technique.', explanationTa: 'பாதுகாப்பான முறையில் சிகிச்சை மேற்கொள்ளப்படும் முக்கிய கட்டம்.', cameraPreset: 'cross-section' }
    ]
  },
  'recurrent-aphthous-ulcer-care': {
    procedureSlug: 'recurrent-aphthous-ulcer-care',
    modelAssetPath: null,
    modelFamily: 'ORAL_MUCOSA_PATHOLOGY',
    modelState: 'IN_DEVELOPMENT',
    isModelReady: false,
    clinicalReviewStatus: 'EDUCATIONAL_DRAFT',
    provenance: {
      author: 'DentalVis Clinical Anatomy Team',
      license: 'Proprietary / Educational Visual Reference',
      sourceUrl: 'https://dentalvis.org/procedures/recurrent-aphthous-ulcer-care',
    },
    defaultCameraPosition: [0, 1.5, 6.2],
    defaultCameraTarget: [0, 0, 0],
    cameraPresets: [
      { id: 'front', labelEn: 'Frontal Aspect', labelTa: 'முன்பக்க பார்வை', position: [0, 0.8, 5.8], target: [0, 0, 0] },
      { id: 'cross-section', labelEn: 'Internal Cross-Section', labelTa: 'உட்புற குறுக்குவெட்டு', position: [3.4, 1.6, 4.6], target: [0, 0, 0] },
      { id: 'occlusal', labelEn: 'Occlusal Top View', labelTa: 'மேல் மெல்லும் பரப்பு', position: [0, 6.0, 0.8], target: [0, 0, 0] },
      { id: 'apical', labelEn: 'Apical Root View', labelTa: 'வேர் முனை பார்வை', position: [0, -5.2, 2.0], target: [0, -0.5, 0] },
      { id: 'exploded', labelEn: 'Exploded Component View', labelTa: 'பிரிக்கப்பட்ட அடுக்குகள்', position: [4.4, 2.6, 5.2], target: [0, 0, 0] },
    ],
    layerGroups: [
      {
            "id": "primary",
            "labelEn": "Primary Anatomy",
            "labelTa": "முதன்மை உடற்கூறியல்",
            "defaultVisible": true
      },
      {
            "id": "supporting",
            "labelEn": "Supporting Structures",
            "labelTa": "துணை கட்டமைப்புகள்",
            "defaultVisible": true
      }
],
    structures: [
      {
            "id": "struct-primary",
            "meshName": "Mesh_Primary_Anatomy",
            "labelEn": "${p.name} Anatomical Zone",
            "labelTa": "${p.name} மருத்துவ உடற்கூறு பகுதி",
            "descriptionEn": "Educational anatomical reference area for ${p.name}. Detailed procedure-specific GLB geometry is currently undergoing clinical calibration.",
            "descriptionTa": "${p.name} சிகிச்சைக்குரிய கல்வி உடற்கூறியல் பகுதி. இதற்குரிய 3D மாதிரி தற்போது மருத்துவ அளவுத்திருத்தத்தில் உள்ளது.",
            "layerGroup": "primary",
            "defaultVisible": true,
            "colorHint": "#20B2AA"
      }
],
    hotspots: [
      {
            "id": "hp-primary",
            "structureId": "struct-primary",
            "position": [
                  0,
                  0.5,
                  0.4
            ],
            "titleEn": "${p.name} Clinical Target",
            "titleTa": "${p.name} சிகிச்சை இலக்கு",
            "contentEn": "Procedural focus zone under clinical department ${p.dept}. Inspect 2D illustration for verified details.",
            "contentTa": "${p.dept} துறைக்குரிய சிகிச்சை பகுதி. சரிபார்க்கப்பட்ட வரைபடத்தைக் காண 2D தேர்வை பயன்படுத்தவும்."
      }
],
    educationalSequences: [
      { stepNumber: 1, titleEn: 'Baseline Anatomy', titleTa: 'அடிப்படை உடற்கூறியல்', explanationEn: 'Natural anatomical condition prior to procedural intervention.', explanationTa: 'சிகிச்சைக்கு முந்தைய இயல்பான உடற்கூறியல் நிலை.', cameraPreset: 'front' },
      { stepNumber: 2, titleEn: 'Procedural Intervention', titleTa: 'சிகிச்சை செயல்முறை', explanationEn: 'Key treatment phase demonstrating gentle clinical technique.', explanationTa: 'பாதுகாப்பான முறையில் சிகிச்சை மேற்கொள்ளப்படும் முக்கிய கட்டம்.', cameraPreset: 'cross-section' }
    ]
  },
  'dry-mouth-xerostomia-care': {
    procedureSlug: 'dry-mouth-xerostomia-care',
    modelAssetPath: null,
    modelFamily: 'ORAL_MUCOSA_PATHOLOGY',
    modelState: 'IN_DEVELOPMENT',
    isModelReady: false,
    clinicalReviewStatus: 'EDUCATIONAL_DRAFT',
    provenance: {
      author: 'DentalVis Clinical Anatomy Team',
      license: 'Proprietary / Educational Visual Reference',
      sourceUrl: 'https://dentalvis.org/procedures/dry-mouth-xerostomia-care',
    },
    defaultCameraPosition: [0, 1.5, 6.2],
    defaultCameraTarget: [0, 0, 0],
    cameraPresets: [
      { id: 'front', labelEn: 'Frontal Aspect', labelTa: 'முன்பக்க பார்வை', position: [0, 0.8, 5.8], target: [0, 0, 0] },
      { id: 'cross-section', labelEn: 'Internal Cross-Section', labelTa: 'உட்புற குறுக்குவெட்டு', position: [3.4, 1.6, 4.6], target: [0, 0, 0] },
      { id: 'occlusal', labelEn: 'Occlusal Top View', labelTa: 'மேல் மெல்லும் பரப்பு', position: [0, 6.0, 0.8], target: [0, 0, 0] },
      { id: 'apical', labelEn: 'Apical Root View', labelTa: 'வேர் முனை பார்வை', position: [0, -5.2, 2.0], target: [0, -0.5, 0] },
      { id: 'exploded', labelEn: 'Exploded Component View', labelTa: 'பிரிக்கப்பட்ட அடுக்குகள்', position: [4.4, 2.6, 5.2], target: [0, 0, 0] },
    ],
    layerGroups: [
      {
            "id": "primary",
            "labelEn": "Primary Anatomy",
            "labelTa": "முதன்மை உடற்கூறியல்",
            "defaultVisible": true
      },
      {
            "id": "supporting",
            "labelEn": "Supporting Structures",
            "labelTa": "துணை கட்டமைப்புகள்",
            "defaultVisible": true
      }
],
    structures: [
      {
            "id": "struct-primary",
            "meshName": "Mesh_Primary_Anatomy",
            "labelEn": "${p.name} Anatomical Zone",
            "labelTa": "${p.name} மருத்துவ உடற்கூறு பகுதி",
            "descriptionEn": "Educational anatomical reference area for ${p.name}. Detailed procedure-specific GLB geometry is currently undergoing clinical calibration.",
            "descriptionTa": "${p.name} சிகிச்சைக்குரிய கல்வி உடற்கூறியல் பகுதி. இதற்குரிய 3D மாதிரி தற்போது மருத்துவ அளவுத்திருத்தத்தில் உள்ளது.",
            "layerGroup": "primary",
            "defaultVisible": true,
            "colorHint": "#20B2AA"
      }
],
    hotspots: [
      {
            "id": "hp-primary",
            "structureId": "struct-primary",
            "position": [
                  0,
                  0.5,
                  0.4
            ],
            "titleEn": "${p.name} Clinical Target",
            "titleTa": "${p.name} சிகிச்சை இலக்கு",
            "contentEn": "Procedural focus zone under clinical department ${p.dept}. Inspect 2D illustration for verified details.",
            "contentTa": "${p.dept} துறைக்குரிய சிகிச்சை பகுதி. சரிபார்க்கப்பட்ட வரைபடத்தைக் காண 2D தேர்வை பயன்படுத்தவும்."
      }
],
    educationalSequences: [
      { stepNumber: 1, titleEn: 'Baseline Anatomy', titleTa: 'அடிப்படை உடற்கூறியல்', explanationEn: 'Natural anatomical condition prior to procedural intervention.', explanationTa: 'சிகிச்சைக்கு முந்தைய இயல்பான உடற்கூறியல் நிலை.', cameraPreset: 'front' },
      { stepNumber: 2, titleEn: 'Procedural Intervention', titleTa: 'சிகிச்சை செயல்முறை', explanationEn: 'Key treatment phase demonstrating gentle clinical technique.', explanationTa: 'பாதுகாப்பான முறையில் சிகிச்சை மேற்கொள்ளப்படும் முக்கிய கட்டம்.', cameraPreset: 'cross-section' }
    ]
  },
  'oral-soft-tissue-biopsy': {
    procedureSlug: 'oral-soft-tissue-biopsy',
    modelAssetPath: null,
    modelFamily: 'ORAL_MUCOSA_PATHOLOGY',
    modelState: 'IN_DEVELOPMENT',
    isModelReady: false,
    clinicalReviewStatus: 'EDUCATIONAL_DRAFT',
    provenance: {
      author: 'DentalVis Clinical Anatomy Team',
      license: 'Proprietary / Educational Visual Reference',
      sourceUrl: 'https://dentalvis.org/procedures/oral-soft-tissue-biopsy',
    },
    defaultCameraPosition: [0, 1.5, 6.2],
    defaultCameraTarget: [0, 0, 0],
    cameraPresets: [
      { id: 'front', labelEn: 'Frontal Aspect', labelTa: 'முன்பக்க பார்வை', position: [0, 0.8, 5.8], target: [0, 0, 0] },
      { id: 'cross-section', labelEn: 'Internal Cross-Section', labelTa: 'உட்புற குறுக்குவெட்டு', position: [3.4, 1.6, 4.6], target: [0, 0, 0] },
      { id: 'occlusal', labelEn: 'Occlusal Top View', labelTa: 'மேல் மெல்லும் பரப்பு', position: [0, 6.0, 0.8], target: [0, 0, 0] },
      { id: 'apical', labelEn: 'Apical Root View', labelTa: 'வேர் முனை பார்வை', position: [0, -5.2, 2.0], target: [0, -0.5, 0] },
      { id: 'exploded', labelEn: 'Exploded Component View', labelTa: 'பிரிக்கப்பட்ட அடுக்குகள்', position: [4.4, 2.6, 5.2], target: [0, 0, 0] },
    ],
    layerGroups: [
      {
            "id": "primary",
            "labelEn": "Primary Anatomy",
            "labelTa": "முதன்மை உடற்கூறியல்",
            "defaultVisible": true
      },
      {
            "id": "supporting",
            "labelEn": "Supporting Structures",
            "labelTa": "துணை கட்டமைப்புகள்",
            "defaultVisible": true
      }
],
    structures: [
      {
            "id": "struct-primary",
            "meshName": "Mesh_Primary_Anatomy",
            "labelEn": "${p.name} Anatomical Zone",
            "labelTa": "${p.name} மருத்துவ உடற்கூறு பகுதி",
            "descriptionEn": "Educational anatomical reference area for ${p.name}. Detailed procedure-specific GLB geometry is currently undergoing clinical calibration.",
            "descriptionTa": "${p.name} சிகிச்சைக்குரிய கல்வி உடற்கூறியல் பகுதி. இதற்குரிய 3D மாதிரி தற்போது மருத்துவ அளவுத்திருத்தத்தில் உள்ளது.",
            "layerGroup": "primary",
            "defaultVisible": true,
            "colorHint": "#20B2AA"
      }
],
    hotspots: [
      {
            "id": "hp-primary",
            "structureId": "struct-primary",
            "position": [
                  0,
                  0.5,
                  0.4
            ],
            "titleEn": "${p.name} Clinical Target",
            "titleTa": "${p.name} சிகிச்சை இலக்கு",
            "contentEn": "Procedural focus zone under clinical department ${p.dept}. Inspect 2D illustration for verified details.",
            "contentTa": "${p.dept} துறைக்குரிய சிகிச்சை பகுதி. சரிபார்க்கப்பட்ட வரைபடத்தைக் காண 2D தேர்வை பயன்படுத்தவும்."
      }
],
    educationalSequences: [
      { stepNumber: 1, titleEn: 'Baseline Anatomy', titleTa: 'அடிப்படை உடற்கூறியல்', explanationEn: 'Natural anatomical condition prior to procedural intervention.', explanationTa: 'சிகிச்சைக்கு முந்தைய இயல்பான உடற்கூறியல் நிலை.', cameraPreset: 'front' },
      { stepNumber: 2, titleEn: 'Procedural Intervention', titleTa: 'சிகிச்சை செயல்முறை', explanationEn: 'Key treatment phase demonstrating gentle clinical technique.', explanationTa: 'பாதுகாப்பான முறையில் சிகிச்சை மேற்கொள்ளப்படும் முக்கிய கட்டம்.', cameraPreset: 'cross-section' }
    ]
  },
  'tmj-splint-therapy': {
    procedureSlug: 'tmj-splint-therapy',
    modelAssetPath: null,
    modelFamily: 'TMJ_OROFACIAL_CRANIOFACIAL',
    modelState: 'IN_DEVELOPMENT',
    isModelReady: false,
    clinicalReviewStatus: 'EDUCATIONAL_DRAFT',
    provenance: {
      author: 'DentalVis Clinical Anatomy Team',
      license: 'Proprietary / Educational Visual Reference',
      sourceUrl: 'https://dentalvis.org/procedures/tmj-splint-therapy',
    },
    defaultCameraPosition: [0, 1.5, 6.2],
    defaultCameraTarget: [0, 0, 0],
    cameraPresets: [
      { id: 'front', labelEn: 'Frontal Aspect', labelTa: 'முன்பக்க பார்வை', position: [0, 0.8, 5.8], target: [0, 0, 0] },
      { id: 'cross-section', labelEn: 'Internal Cross-Section', labelTa: 'உட்புற குறுக்குவெட்டு', position: [3.4, 1.6, 4.6], target: [0, 0, 0] },
      { id: 'occlusal', labelEn: 'Occlusal Top View', labelTa: 'மேல் மெல்லும் பரப்பு', position: [0, 6.0, 0.8], target: [0, 0, 0] },
      { id: 'apical', labelEn: 'Apical Root View', labelTa: 'வேர் முனை பார்வை', position: [0, -5.2, 2.0], target: [0, -0.5, 0] },
      { id: 'exploded', labelEn: 'Exploded Component View', labelTa: 'பிரிக்கப்பட்ட அடுக்குகள்', position: [4.4, 2.6, 5.2], target: [0, 0, 0] },
    ],
    layerGroups: [
      {
            "id": "primary",
            "labelEn": "Primary Anatomy",
            "labelTa": "முதன்மை உடற்கூறியல்",
            "defaultVisible": true
      },
      {
            "id": "supporting",
            "labelEn": "Supporting Structures",
            "labelTa": "துணை கட்டமைப்புகள்",
            "defaultVisible": true
      }
],
    structures: [
      {
            "id": "struct-primary",
            "meshName": "Mesh_Primary_Anatomy",
            "labelEn": "${p.name} Anatomical Zone",
            "labelTa": "${p.name} மருத்துவ உடற்கூறு பகுதி",
            "descriptionEn": "Educational anatomical reference area for ${p.name}. Detailed procedure-specific GLB geometry is currently undergoing clinical calibration.",
            "descriptionTa": "${p.name} சிகிச்சைக்குரிய கல்வி உடற்கூறியல் பகுதி. இதற்குரிய 3D மாதிரி தற்போது மருத்துவ அளவுத்திருத்தத்தில் உள்ளது.",
            "layerGroup": "primary",
            "defaultVisible": true,
            "colorHint": "#20B2AA"
      }
],
    hotspots: [
      {
            "id": "hp-primary",
            "structureId": "struct-primary",
            "position": [
                  0,
                  0.5,
                  0.4
            ],
            "titleEn": "${p.name} Clinical Target",
            "titleTa": "${p.name} சிகிச்சை இலக்கு",
            "contentEn": "Procedural focus zone under clinical department ${p.dept}. Inspect 2D illustration for verified details.",
            "contentTa": "${p.dept} துறைக்குரிய சிகிச்சை பகுதி. சரிபார்க்கப்பட்ட வரைபடத்தைக் காண 2D தேர்வை பயன்படுத்தவும்."
      }
],
    educationalSequences: [
      { stepNumber: 1, titleEn: 'Baseline Anatomy', titleTa: 'அடிப்படை உடற்கூறியல்', explanationEn: 'Natural anatomical condition prior to procedural intervention.', explanationTa: 'சிகிச்சைக்கு முந்தைய இயல்பான உடற்கூறியல் நிலை.', cameraPreset: 'front' },
      { stepNumber: 2, titleEn: 'Procedural Intervention', titleTa: 'சிகிச்சை செயல்முறை', explanationEn: 'Key treatment phase demonstrating gentle clinical technique.', explanationTa: 'பாதுகாப்பான முறையில் சிகிச்சை மேற்கொள்ளப்படும் முக்கிய கட்டம்.', cameraPreset: 'cross-section' }
    ]
  },
  'masticatory-muscle-physical-therapy': {
    procedureSlug: 'masticatory-muscle-physical-therapy',
    modelAssetPath: null,
    modelFamily: 'TMJ_OROFACIAL_CRANIOFACIAL',
    modelState: 'IN_DEVELOPMENT',
    isModelReady: false,
    clinicalReviewStatus: 'EDUCATIONAL_DRAFT',
    provenance: {
      author: 'DentalVis Clinical Anatomy Team',
      license: 'Proprietary / Educational Visual Reference',
      sourceUrl: 'https://dentalvis.org/procedures/masticatory-muscle-physical-therapy',
    },
    defaultCameraPosition: [0, 1.5, 6.2],
    defaultCameraTarget: [0, 0, 0],
    cameraPresets: [
      { id: 'front', labelEn: 'Frontal Aspect', labelTa: 'முன்பக்க பார்வை', position: [0, 0.8, 5.8], target: [0, 0, 0] },
      { id: 'cross-section', labelEn: 'Internal Cross-Section', labelTa: 'உட்புற குறுக்குவெட்டு', position: [3.4, 1.6, 4.6], target: [0, 0, 0] },
      { id: 'occlusal', labelEn: 'Occlusal Top View', labelTa: 'மேல் மெல்லும் பரப்பு', position: [0, 6.0, 0.8], target: [0, 0, 0] },
      { id: 'apical', labelEn: 'Apical Root View', labelTa: 'வேர் முனை பார்வை', position: [0, -5.2, 2.0], target: [0, -0.5, 0] },
      { id: 'exploded', labelEn: 'Exploded Component View', labelTa: 'பிரிக்கப்பட்ட அடுக்குகள்', position: [4.4, 2.6, 5.2], target: [0, 0, 0] },
    ],
    layerGroups: [
      {
            "id": "primary",
            "labelEn": "Primary Anatomy",
            "labelTa": "முதன்மை உடற்கூறியல்",
            "defaultVisible": true
      },
      {
            "id": "supporting",
            "labelEn": "Supporting Structures",
            "labelTa": "துணை கட்டமைப்புகள்",
            "defaultVisible": true
      }
],
    structures: [
      {
            "id": "struct-primary",
            "meshName": "Mesh_Primary_Anatomy",
            "labelEn": "${p.name} Anatomical Zone",
            "labelTa": "${p.name} மருத்துவ உடற்கூறு பகுதி",
            "descriptionEn": "Educational anatomical reference area for ${p.name}. Detailed procedure-specific GLB geometry is currently undergoing clinical calibration.",
            "descriptionTa": "${p.name} சிகிச்சைக்குரிய கல்வி உடற்கூறியல் பகுதி. இதற்குரிய 3D மாதிரி தற்போது மருத்துவ அளவுத்திருத்தத்தில் உள்ளது.",
            "layerGroup": "primary",
            "defaultVisible": true,
            "colorHint": "#20B2AA"
      }
],
    hotspots: [
      {
            "id": "hp-primary",
            "structureId": "struct-primary",
            "position": [
                  0,
                  0.5,
                  0.4
            ],
            "titleEn": "${p.name} Clinical Target",
            "titleTa": "${p.name} சிகிச்சை இலக்கு",
            "contentEn": "Procedural focus zone under clinical department ${p.dept}. Inspect 2D illustration for verified details.",
            "contentTa": "${p.dept} துறைக்குரிய சிகிச்சை பகுதி. சரிபார்க்கப்பட்ட வரைபடத்தைக் காண 2D தேர்வை பயன்படுத்தவும்."
      }
],
    educationalSequences: [
      { stepNumber: 1, titleEn: 'Baseline Anatomy', titleTa: 'அடிப்படை உடற்கூறியல்', explanationEn: 'Natural anatomical condition prior to procedural intervention.', explanationTa: 'சிகிச்சைக்கு முந்தைய இயல்பான உடற்கூறியல் நிலை.', cameraPreset: 'front' },
      { stepNumber: 2, titleEn: 'Procedural Intervention', titleTa: 'சிகிச்சை செயல்முறை', explanationEn: 'Key treatment phase demonstrating gentle clinical technique.', explanationTa: 'பாதுகாப்பான முறையில் சிகிச்சை மேற்கொள்ளப்படும் முக்கிய கட்டம்.', cameraPreset: 'cross-section' }
    ]
  },
  'botulinum-toxin-jaw-therapy': {
    procedureSlug: 'botulinum-toxin-jaw-therapy',
    modelAssetPath: null,
    modelFamily: 'TMJ_OROFACIAL_CRANIOFACIAL',
    modelState: 'IN_DEVELOPMENT',
    isModelReady: false,
    clinicalReviewStatus: 'EDUCATIONAL_DRAFT',
    provenance: {
      author: 'DentalVis Clinical Anatomy Team',
      license: 'Proprietary / Educational Visual Reference',
      sourceUrl: 'https://dentalvis.org/procedures/botulinum-toxin-jaw-therapy',
    },
    defaultCameraPosition: [0, 1.5, 6.2],
    defaultCameraTarget: [0, 0, 0],
    cameraPresets: [
      { id: 'front', labelEn: 'Frontal Aspect', labelTa: 'முன்பக்க பார்வை', position: [0, 0.8, 5.8], target: [0, 0, 0] },
      { id: 'cross-section', labelEn: 'Internal Cross-Section', labelTa: 'உட்புற குறுக்குவெட்டு', position: [3.4, 1.6, 4.6], target: [0, 0, 0] },
      { id: 'occlusal', labelEn: 'Occlusal Top View', labelTa: 'மேல் மெல்லும் பரப்பு', position: [0, 6.0, 0.8], target: [0, 0, 0] },
      { id: 'apical', labelEn: 'Apical Root View', labelTa: 'வேர் முனை பார்வை', position: [0, -5.2, 2.0], target: [0, -0.5, 0] },
      { id: 'exploded', labelEn: 'Exploded Component View', labelTa: 'பிரிக்கப்பட்ட அடுக்குகள்', position: [4.4, 2.6, 5.2], target: [0, 0, 0] },
    ],
    layerGroups: [
      {
            "id": "primary",
            "labelEn": "Primary Anatomy",
            "labelTa": "முதன்மை உடற்கூறியல்",
            "defaultVisible": true
      },
      {
            "id": "supporting",
            "labelEn": "Supporting Structures",
            "labelTa": "துணை கட்டமைப்புகள்",
            "defaultVisible": true
      }
],
    structures: [
      {
            "id": "struct-primary",
            "meshName": "Mesh_Primary_Anatomy",
            "labelEn": "${p.name} Anatomical Zone",
            "labelTa": "${p.name} மருத்துவ உடற்கூறு பகுதி",
            "descriptionEn": "Educational anatomical reference area for ${p.name}. Detailed procedure-specific GLB geometry is currently undergoing clinical calibration.",
            "descriptionTa": "${p.name} சிகிச்சைக்குரிய கல்வி உடற்கூறியல் பகுதி. இதற்குரிய 3D மாதிரி தற்போது மருத்துவ அளவுத்திருத்தத்தில் உள்ளது.",
            "layerGroup": "primary",
            "defaultVisible": true,
            "colorHint": "#20B2AA"
      }
],
    hotspots: [
      {
            "id": "hp-primary",
            "structureId": "struct-primary",
            "position": [
                  0,
                  0.5,
                  0.4
            ],
            "titleEn": "${p.name} Clinical Target",
            "titleTa": "${p.name} சிகிச்சை இலக்கு",
            "contentEn": "Procedural focus zone under clinical department ${p.dept}. Inspect 2D illustration for verified details.",
            "contentTa": "${p.dept} துறைக்குரிய சிகிச்சை பகுதி. சரிபார்க்கப்பட்ட வரைபடத்தைக் காண 2D தேர்வை பயன்படுத்தவும்."
      }
],
    educationalSequences: [
      { stepNumber: 1, titleEn: 'Baseline Anatomy', titleTa: 'அடிப்படை உடற்கூறியல்', explanationEn: 'Natural anatomical condition prior to procedural intervention.', explanationTa: 'சிகிச்சைக்கு முந்தைய இயல்பான உடற்கூறியல் நிலை.', cameraPreset: 'front' },
      { stepNumber: 2, titleEn: 'Procedural Intervention', titleTa: 'சிகிச்சை செயல்முறை', explanationEn: 'Key treatment phase demonstrating gentle clinical technique.', explanationTa: 'பாதுகாப்பான முறையில் சிகிச்சை மேற்கொள்ளப்படும் முக்கிய கட்டம்.', cameraPreset: 'cross-section' }
    ]
  },
  'mandibular-advancement-splint-sleep-apnea': {
    procedureSlug: 'mandibular-advancement-splint-sleep-apnea',
    modelAssetPath: null,
    modelFamily: 'AIRWAY_SYSTEMIC_SPECIALIZED',
    modelState: 'IN_DEVELOPMENT',
    isModelReady: false,
    clinicalReviewStatus: 'EDUCATIONAL_DRAFT',
    provenance: {
      author: 'DentalVis Clinical Anatomy Team',
      license: 'Proprietary / Educational Visual Reference',
      sourceUrl: 'https://dentalvis.org/procedures/mandibular-advancement-splint-sleep-apnea',
    },
    defaultCameraPosition: [0, 1.5, 6.2],
    defaultCameraTarget: [0, 0, 0],
    cameraPresets: [
      { id: 'front', labelEn: 'Frontal Aspect', labelTa: 'முன்பக்க பார்வை', position: [0, 0.8, 5.8], target: [0, 0, 0] },
      { id: 'cross-section', labelEn: 'Internal Cross-Section', labelTa: 'உட்புற குறுக்குவெட்டு', position: [3.4, 1.6, 4.6], target: [0, 0, 0] },
      { id: 'occlusal', labelEn: 'Occlusal Top View', labelTa: 'மேல் மெல்லும் பரப்பு', position: [0, 6.0, 0.8], target: [0, 0, 0] },
      { id: 'apical', labelEn: 'Apical Root View', labelTa: 'வேர் முனை பார்வை', position: [0, -5.2, 2.0], target: [0, -0.5, 0] },
      { id: 'exploded', labelEn: 'Exploded Component View', labelTa: 'பிரிக்கப்பட்ட அடுக்குகள்', position: [4.4, 2.6, 5.2], target: [0, 0, 0] },
    ],
    layerGroups: [
      {
            "id": "primary",
            "labelEn": "Primary Anatomy",
            "labelTa": "முதன்மை உடற்கூறியல்",
            "defaultVisible": true
      },
      {
            "id": "supporting",
            "labelEn": "Supporting Structures",
            "labelTa": "துணை கட்டமைப்புகள்",
            "defaultVisible": true
      }
],
    structures: [
      {
            "id": "struct-primary",
            "meshName": "Mesh_Primary_Anatomy",
            "labelEn": "${p.name} Anatomical Zone",
            "labelTa": "${p.name} மருத்துவ உடற்கூறு பகுதி",
            "descriptionEn": "Educational anatomical reference area for ${p.name}. Detailed procedure-specific GLB geometry is currently undergoing clinical calibration.",
            "descriptionTa": "${p.name} சிகிச்சைக்குரிய கல்வி உடற்கூறியல் பகுதி. இதற்குரிய 3D மாதிரி தற்போது மருத்துவ அளவுத்திருத்தத்தில் உள்ளது.",
            "layerGroup": "primary",
            "defaultVisible": true,
            "colorHint": "#20B2AA"
      }
],
    hotspots: [
      {
            "id": "hp-primary",
            "structureId": "struct-primary",
            "position": [
                  0,
                  0.5,
                  0.4
            ],
            "titleEn": "${p.name} Clinical Target",
            "titleTa": "${p.name} சிகிச்சை இலக்கு",
            "contentEn": "Procedural focus zone under clinical department ${p.dept}. Inspect 2D illustration for verified details.",
            "contentTa": "${p.dept} துறைக்குரிய சிகிச்சை பகுதி. சரிபார்க்கப்பட்ட வரைபடத்தைக் காண 2D தேர்வை பயன்படுத்தவும்."
      }
],
    educationalSequences: [
      { stepNumber: 1, titleEn: 'Baseline Anatomy', titleTa: 'அடிப்படை உடற்கூறியல்', explanationEn: 'Natural anatomical condition prior to procedural intervention.', explanationTa: 'சிகிச்சைக்கு முந்தைய இயல்பான உடற்கூறியல் நிலை.', cameraPreset: 'front' },
      { stepNumber: 2, titleEn: 'Procedural Intervention', titleTa: 'சிகிச்சை செயல்முறை', explanationEn: 'Key treatment phase demonstrating gentle clinical technique.', explanationTa: 'பாதுகாப்பான முறையில் சிகிச்சை மேற்கொள்ளப்படும் முக்கிய கட்டம்.', cameraPreset: 'cross-section' }
    ]
  },
};

export function getProcedure3DConfig(slug: string): Procedure3DConfig | null {
  return CANONICAL_56_3D_CONFIGS[slug] || null;
}

export function getAllCanonical3DConfigs(): Procedure3DConfig[] {
  return Object.values(CANONICAL_56_3D_CONFIGS);
}
