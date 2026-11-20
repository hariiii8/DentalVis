// apps/web/src/components/3d/hooks/useAnatomyViewerState.ts
// Reusable state management for 3D camera presets, layer visibility, and structure selection

'use client';

import { useState, useCallback, useMemo } from 'react';
import { Procedure3DConfig, CameraPresetType } from '../types';

export interface AnatomyViewerState {
  activeCameraPreset: CameraPresetType;
  visibleLayers: Record<string, boolean>;
  selectedStructureId: string | null;
  activeHotspotId: string | null;
  explodedAmount: number; // 0 to 1
  isAutoRotating: boolean;
  activeSequenceStep: number | null;
  // Actions
  setCameraPreset: (preset: CameraPresetType) => void;
  toggleLayer: (layerId: string) => void;
  setLayerVisibility: (layerId: string, visible: boolean) => void;
  selectStructure: (structureId: string | null) => void;
  selectHotspot: (hotspotId: string | null) => void;
  setExplodedAmount: (amount: number) => void;
  toggleAutoRotate: () => void;
  setSequenceStep: (step: number | null) => void;
  resetAll: () => void;
}

export function useAnatomyViewerState(config: Procedure3DConfig): AnatomyViewerState {
  // Initial layer visibility dictionary
  const initialLayers = useMemo(() => {
    const layers: Record<string, boolean> = {};
    for (const group of config.layerGroups) {
      layers[group.id] = group.defaultVisible;
    }
    return layers;
  }, [config.layerGroups]);

  const [activeCameraPreset, setActiveCameraPreset] = useState<CameraPresetType>('front');
  const [visibleLayers, setVisibleLayers] = useState<Record<string, boolean>>(initialLayers);
  const [selectedStructureId, setSelectedStructureId] = useState<string | null>(null);
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const [explodedAmount, setExplodedAmount] = useState<number>(0);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(false);
  const [activeSequenceStep, setActiveSequenceStep] = useState<number | null>(null);

  const setCameraPreset = useCallback((preset: CameraPresetType) => {
    setActiveCameraPreset(preset);
  }, []);

  const toggleLayer = useCallback((layerId: string) => {
    setVisibleLayers((prev) => ({
      ...prev,
      [layerId]: !prev[layerId],
    }));
  }, []);

  const setLayerVisibility = useCallback((layerId: string, visible: boolean) => {
    setVisibleLayers((prev) => ({
      ...prev,
      [layerId]: visible,
    }));
  }, []);

  const selectStructure = useCallback((structureId: string | null) => {
    setSelectedStructureId(structureId);
  }, []);

  const selectHotspot = useCallback((hotspotId: string | null) => {
    setActiveHotspotId(hotspotId);
    if (hotspotId) {
      const hp = config.hotspots.find((h) => h.id === hotspotId);
      if (hp) {
        setSelectedStructureId(hp.structureId);
      }
    }
  }, [config.hotspots]);

  const toggleAutoRotate = useCallback(() => {
    setIsAutoRotating((prev) => !prev);
  }, []);

  const setSequenceStep = useCallback((step: number | null) => {
    setActiveSequenceStep(step);
    if (step !== null) {
      const seq = config.educationalSequences.find((s) => s.stepNumber === step);
      if (seq?.cameraPreset) {
        setActiveCameraPreset(seq.cameraPreset);
      }
      if (seq?.activeLayers) {
        setVisibleLayers((prev) => {
          const next = { ...prev };
          for (const key of Object.keys(next)) {
            next[key] = seq.activeLayers?.includes(key) ?? false;
          }
          return next;
        });
      }
    }
  }, [config.educationalSequences]);

  const resetAll = useCallback(() => {
    setActiveCameraPreset('front');
    setVisibleLayers(initialLayers);
    setSelectedStructureId(null);
    setActiveHotspotId(null);
    setExplodedAmount(0);
    setIsAutoRotating(false);
    setActiveSequenceStep(null);
  }, [initialLayers]);

  return {
    activeCameraPreset,
    visibleLayers,
    selectedStructureId,
    activeHotspotId,
    explodedAmount,
    isAutoRotating,
    activeSequenceStep,
    setCameraPreset,
    toggleLayer,
    setLayerVisibility,
    selectStructure,
    selectHotspot,
    setExplodedAmount,
    toggleAutoRotate,
    setSequenceStep,
    resetAll,
  };
}
