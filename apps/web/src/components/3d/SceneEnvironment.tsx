// apps/web/src/components/3d/SceneEnvironment.tsx
// Studio lighting, neutral ground shadows, and clean clinical ambience

'use client';

import React from 'react';
import { ContactShadows } from '@react-three/drei';

export function SceneEnvironment() {
  return (
    <>
      {/* Background Soft Color within Canvas */}
      <color attach="background" args={['#F5FAF9']} />

      {/* Ambient Lighting for base tissue visibility */}
      <ambientLight intensity={0.75} color="#F5FAF9" />

      {/* Main Studio Key Light (5000K Soft Daylight) */}
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
        color="#FFFFFF"
      />

      {/* Secondary Fill Light in soft Mint/Cyan to illuminate undercut margins */}
      <directionalLight
        position={[-5, 3, -2]}
        intensity={0.65}
        color="#DCEFF5"
      />

      {/* Rim/Backlight to highlight fine enamel edges */}
      <directionalLight
        position={[0, -4, -5]}
        intensity={0.4}
        color="#BFE9E2"
      />

      {/* Subtle Ground Ambient Soft Shadows */}
      <ContactShadows
        position={[0, -1.8, 0]}
        opacity={0.35}
        scale={8}
        blur={2.4}
        far={4.0}
        color="#145B59"
      />
    </>
  );
}
