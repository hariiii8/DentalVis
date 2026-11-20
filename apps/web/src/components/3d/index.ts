// apps/web/src/components/3d/index.ts
// Export public 3D anatomy modules

export { ProcedureAnatomy3D } from './ProcedureAnatomy3D';
export { ProcedureAnatomyCanvas } from './ProcedureAnatomyCanvas';
export { AnatomyControlsOverlay } from './AnatomyControlsOverlay';
export { AnatomyHotspots } from './AnatomyHotspots';
export { CameraManager } from './CameraManager';
export { SceneEnvironment } from './SceneEnvironment';
export { getProcedure3DConfig, getAllCanonical3DConfigs, CANONICAL_56_3D_CONFIGS } from './procedure3DRegistry';
export * from './types';
