// apps/web/src/components/3d/ProcedureAnatomyCanvas.tsx
// Pure browser-only React Three Fiber Canvas with graceful WebGL error handling

'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { SceneEnvironment } from './SceneEnvironment';
import { CameraManager } from './CameraManager';
import { AnatomyHotspots } from './AnatomyHotspots';
import { ModelHost } from './ModelHost';
import { Procedure3DConfig, SpatialHotspot } from './types';
import { AnatomyViewerState } from './hooks/useAnatomyViewerState';

interface ProcedureAnatomyCanvasProps {
  config: Procedure3DConfig;
  state: AnatomyViewerState;
  lang?: 'en' | 'ta';
  onError?: (err: Error) => void;
  onHoverHotspot?: (hotspot: SpatialHotspot | null) => void;
  onProjectedPositionsChange?: (positions: Record<string, { x: number; y: number; visible: boolean }>) => void;
}

export function ProcedureAnatomyCanvas({
  config,
  state,
  lang = 'en',
  onError,
  onHoverHotspot,
  onProjectedPositionsChange,
}: ProcedureAnatomyCanvasProps) {
  return (
    <Canvas
      camera={{
        position: config.defaultCameraPosition,
        fov: 42,
        near: 0.1,
        far: 50,
      }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      }}
      dpr={[1, 2]} // High-DPI support on retina/mobile
      onCreated={({ gl }) => {
        // Enforce sRGB color mapping and clean pixel ratio
        try {
          gl.setClearColor('#F5FAF9', 1);
        } catch (e) {
          if (onError && e instanceof Error) onError(e);
        }
      }}
      className="w-full h-full touch-none select-none"
    >
      <Suspense fallback={null}>
        {/* Studio Lighting & Ambience */}
        <SceneEnvironment />

        {/* Camera Orchestration */}
        <CameraManager
          activePreset={state.activeCameraPreset}
          presets={config.cameraPresets}
          isAutoRotating={state.isAutoRotating}
        />

        {/* Anatomy Hotspots Spatial Callout Markers */}
        <AnatomyHotspots
          hotspots={config.hotspots}
          activeHotspotId={state.activeHotspotId}
          onSelectHotspot={state.selectHotspot}
          lang={lang}
          onHoverHotspot={onHoverHotspot}
          onProjectedPositionsChange={onProjectedPositionsChange}
        />

        {/* Model Host Slot: Mounts genuine GLB model when assetPath is ready */}
        {config.modelAssetPath && config.isModelReady && (
          <ModelHost
            modelAssetPath={config.modelAssetPath}
            config={config}
            state={state}
          />
        )}
      </Suspense>
    </Canvas>
  );
}
