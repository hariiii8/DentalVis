// apps/web/src/components/3d/AnatomyHotspots.tsx
// Pure Three.js spatial hotspot markers with interactive pointer hit tests.
// Zero Drei <Html> instances are used to eliminate React root unmounting lifecycle race conditions.

'use client';

import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { SpatialHotspot } from './types';

interface AnatomyHotspotsProps {
  hotspots: SpatialHotspot[];
  activeHotspotId: string | null;
  onSelectHotspot: (hotspotId: string | null) => void;
  lang?: 'en' | 'ta';
  onHoverHotspot?: (hotspot: SpatialHotspot | null) => void;
  onProjectedPositionsChange?: (positions: Record<string, { x: number; y: number; visible: boolean }>) => void;
}

interface SingleHotspotPinProps {
  spot: SpatialHotspot;
  isActive: boolean;
  onSelect: () => void;
  onHover: (hovered: boolean) => void;
}

function SingleHotspotPin({ spot, isActive, onSelect, onHover }: SingleHotspotPinProps) {
  const outerRingRef = useRef<THREE.Mesh>(null);
  const coreSphereRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Pulse animation on the outer ring
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (outerRingRef.current) {
      const scale = isActive
        ? 1.3 + Math.sin(time * 4) * 0.2
        : 1.0 + Math.sin(time * 2.5 + spot.position[0]) * 0.12;
      outerRingRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group position={spot.position}>
      {/* Outer pulsing ring / halo */}
      <mesh ref={outerRingRef}>
        <ringGeometry args={[0.07, 0.09, 32]} />
        <meshBasicMaterial
          color={isActive ? '#145B59' : '#20B2AA'}
          transparent
          opacity={isActive ? 0.9 : 0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Core glowing jewel sphere */}
      <mesh
        ref={coreSphereRef}
        scale={isActive ? 1.3 : hovered ? 1.15 : 1.0}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          onHover(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          onHover(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[0.05, 24, 24]} />
        <meshStandardMaterial
          color={isActive ? '#145B59' : hovered ? '#20B2AA' : '#FFFFFF'}
          emissive={isActive ? '#20B2AA' : hovered ? '#145B59' : '#20B2AA'}
          emissiveIntensity={isActive ? 0.8 : hovered ? 0.5 : 0.3}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>

      {/* Invisible enlarged hit target for easy clicking and touch */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          onHover(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          onHover(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshBasicMaterial visible={false} />
      </mesh>
    </group>
  );
}

export function AnatomyHotspots({
  hotspots,
  activeHotspotId,
  onSelectHotspot,
  lang: _lang = 'en',
  onHoverHotspot,
  onProjectedPositionsChange,
}: AnatomyHotspotsProps) {
  const projectedPosRef = useRef<Record<string, { x: number; y: number; visible: boolean }>>({});
  const tempVec = useRef(new THREE.Vector3());

  // Reset body cursor on unmount safely
  useEffect(() => {
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, []);

  // Compute 2D projected screen coordinates inside R3F frame loop if listener registered
  useFrame(({ camera, size }) => {
    if (!onProjectedPositionsChange) return;

    let changed = false;
    const current = projectedPosRef.current;

    for (const spot of hotspots) {
      tempVec.current.set(spot.position[0], spot.position[1], spot.position[2]);
      tempVec.current.project(camera);

      // Check if within camera frustum (behind near/far or facing away)
      const isVisible = tempVec.current.z < 1.0;
      const x = ((tempVec.current.x + 1) * size.width) / 2;
      const y = ((-tempVec.current.y + 1) * size.height) / 2;

      const prev = current[spot.id];
      if (!prev || Math.abs(prev.x - x) > 0.5 || Math.abs(prev.y - y) > 0.5 || prev.visible !== isVisible) {
        current[spot.id] = { x, y, visible: isVisible };
        changed = true;
      }
    }

    if (changed) {
      onProjectedPositionsChange({ ...current });
    }
  });

  return (
    <group>
      {hotspots.map((spot) => {
        const isActive = activeHotspotId === spot.id;
        return (
          <SingleHotspotPin
            key={spot.id}
            spot={spot}
            isActive={isActive}
            onSelect={() => onSelectHotspot(isActive ? null : spot.id)}
            onHover={(isHovered) => onHoverHotspot && onHoverHotspot(isHovered ? spot : null)}
          />
        );
      })}
    </group>
  );
}
