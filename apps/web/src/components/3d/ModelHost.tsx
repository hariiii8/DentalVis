// apps/web/src/components/3d/ModelHost.tsx
// Pure client GLB model loader with selective layer visibility and mesh selection highlighting

'use client';

import React, { useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { Procedure3DConfig } from './types';
import { AnatomyViewerState } from './hooks/useAnatomyViewerState';

interface ModelHostProps {
  modelAssetPath: string;
  config: Procedure3DConfig;
  state: AnatomyViewerState;
}

export function ModelHost({ modelAssetPath, config, state }: ModelHostProps) {
  // Load genuine glTF/GLB asset
  const { scene } = useGLTF(modelAssetPath);

  // Clone scene instance to avoid mutating cached primitives
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  // Map of structure meshNames to their parent layerGroup
  const structureMap = useMemo(() => {
    const map: Record<string, { layerGroup: string; id: string }> = {};
    for (const struct of config.structures) {
      map[struct.meshName] = { layerGroup: struct.layerGroup, id: struct.id };
    }
    return map;
  }, [config.structures]);

  // Synchronize layer visibility & selected structure highlighting
  useEffect(() => {
    clonedScene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        const struct = structureMap[mesh.name];

        // 1. Layer visibility control
        if (struct && state.visibleLayers[struct.layerGroup] !== undefined) {
          mesh.visible = state.visibleLayers[struct.layerGroup];
        }

        // 2. Selection highlighting
        const isSelected = struct && state.selectedStructureId === struct.id;
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((mat) => {
            if ((mat as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
              const stdMat = mat as THREE.MeshStandardMaterial;
              stdMat.emissive = isSelected ? new THREE.Color(0x20b2aa) : new THREE.Color(0x000000);
              stdMat.emissiveIntensity = isSelected ? 0.35 : 0.0;
            }
          });
        } else if ((mesh.material as THREE.MeshStandardMaterial)?.isMeshStandardMaterial) {
          const stdMat = mesh.material as THREE.MeshStandardMaterial;
          stdMat.emissive = isSelected ? new THREE.Color(0x20b2aa) : new THREE.Color(0x000000);
          stdMat.emissiveIntensity = isSelected ? 0.35 : 0.0;
        }
      }
    });
  }, [clonedScene, structureMap, state.visibleLayers, state.selectedStructureId]);

  return (
    <primitive
      object={clonedScene}
      onClick={(e: { stopPropagation: () => void; object: THREE.Object3D }) => {
        e.stopPropagation();
        const meshName = e.object.name;
        const struct = structureMap[meshName];
        if (struct) {
          state.selectStructure(struct.id);
        }
      }}
    />
  );
}
