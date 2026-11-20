// apps/web/src/components/3d/types.ts
// DentalVis — Reusable Interactive 3D Anatomy Types & Schema

export type CameraPresetType = 'front' | 'cross-section' | 'occlusal' | 'apical' | 'exploded';

export interface CameraPresetConfig {
  id: CameraPresetType;
  labelEn: string;
  labelTa: string;
  position: [number, number, number];
  target: [number, number, number];
  fov?: number;
}

export interface AnatomicalStructure {
  id: string;
  meshName: string;
  labelEn: string;
  labelTa: string;
  descriptionEn: string;
  descriptionTa: string;
  layerGroup: string;
  defaultVisible: boolean;
  colorHint?: string;
}

export interface LayerGroupConfig {
  id: string;
  labelEn: string;
  labelTa: string;
  defaultVisible: boolean;
}

export interface SpatialHotspot {
  id: string;
  structureId: string;
  position: [number, number, number];
  titleEn: string;
  titleTa: string;
  contentEn: string;
  contentTa: string;
}

export interface EducationalSequenceStep {
  stepNumber: number;
  titleEn: string;
  titleTa: string;
  explanationEn: string;
  explanationTa: string;
  activeLayers?: string[];
  cameraPreset?: CameraPresetType;
}

export type ModelLifecycleState = 
  | 'AVAILABLE_AND_FUNCTIONAL'
  | 'IN_DEVELOPMENT'
  | 'AWAITING_CLINICAL_REVIEW'
  | 'TECHNICAL_FAILURE';

export type AnatomicalModelFamily =
  | 'POSTERIOR_MOLAR'
  | 'ANTERIOR_INCISOR'
  | 'IMPLANT_BONE_SOCKET'
  | 'PERIODONTAL_QUADRANT'
  | 'FULL_DENTAL_ARCH'
  | 'SURGICAL_WISDOM_MANDIBULAR_NERVE'
  | 'PEDIATRIC_PRIMARY_DENTITION'
  | 'ORAL_MUCOSA_PATHOLOGY'
  | 'TMJ_OROFACIAL_CRANIOFACIAL'
  | 'AIRWAY_SYSTEMIC_SPECIALIZED';

export interface Procedure3DConfig {
  procedureSlug: string;
  modelAssetPath: string | null; // null if asset not yet authored/available
  modelFamily: AnatomicalModelFamily;
  modelState: ModelLifecycleState;
  isModelReady: boolean;
  clinicalReviewStatus: 'NOT_REVIEWED' | 'EDUCATIONAL_DRAFT' | 'CLINICALLY_REVIEWED';
  provenance: {
    author: string;
    license: string;
    sourceUrl?: string;
  };
  defaultCameraPosition: [number, number, number];
  defaultCameraTarget: [number, number, number];
  cameraPresets: CameraPresetConfig[];
  layerGroups: LayerGroupConfig[];
  structures: AnatomicalStructure[];
  hotspots: SpatialHotspot[];
  educationalSequences: EducationalSequenceStep[];
}
