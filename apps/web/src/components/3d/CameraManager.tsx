// apps/web/src/components/3d/CameraManager.tsx
// OrbitControls with camera tweening, touch dampening, and preset orientation support

'use client';

import React, { useEffect, useRef, ComponentRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { CameraPresetType, CameraPresetConfig } from './types';

type OrbitControlsRef = ComponentRef<typeof OrbitControls>;

interface CameraManagerProps {
  activePreset: CameraPresetType;
  presets: CameraPresetConfig[];
  isAutoRotating?: boolean;
}

export function CameraManager({ activePreset, presets, isAutoRotating = false }: CameraManagerProps) {
  const controlsRef = useRef<OrbitControlsRef>(null);
  const { camera } = useThree();

  const targetPosition = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.2, 4.5));
  const targetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const isTransitioning = useRef<boolean>(false);

  // Update target coordinates when activePreset changes
  useEffect(() => {
    const preset = presets.find((p) => p.id === activePreset);
    if (preset) {
      targetPosition.current.set(...preset.position);
      targetLookAt.current.set(...preset.target);
      isTransitioning.current = true;
    }
  }, [activePreset, presets]);

  // Smooth lerp camera movement
  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    if (isTransitioning.current) {
      // Smooth damp factor
      const step = Math.min(delta * 4.5, 1.0);
      camera.position.lerp(targetPosition.current, step);
      controlsRef.current.target.lerp(targetLookAt.current, step);
      controlsRef.current.update();

      if (camera.position.distanceTo(targetPosition.current) < 0.02) {
        camera.position.copy(targetPosition.current);
        controlsRef.current.target.copy(targetLookAt.current);
        isTransitioning.current = false;
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.06}
      rotateSpeed={0.7}
      panSpeed={0.7}
      zoomSpeed={0.8}
      minDistance={2.5}
      maxDistance={12.0}
      enableZoom={false}
      autoRotate={isAutoRotating}
      autoRotateSpeed={1.0}
      maxPolarAngle={Math.PI * 0.95}
      minPolarAngle={0.05}
    />
  );
}
