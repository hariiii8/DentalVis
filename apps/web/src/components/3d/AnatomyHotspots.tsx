// apps/web/src/components/3d/AnatomyHotspots.tsx
// 3D Spatial interactive markers rendered via Drei HTML overlays with bilingual support

'use client';

import React from 'react';
import { Html } from '@react-three/drei';
import { SpatialHotspot } from './types';
import { Sparkles } from 'lucide-react';

interface AnatomyHotspotsProps {
  hotspots: SpatialHotspot[];
  activeHotspotId: string | null;
  onSelectHotspot: (hotspotId: string | null) => void;
  lang?: 'en' | 'ta';
}

export function AnatomyHotspots({
  hotspots,
  activeHotspotId,
  onSelectHotspot,
  lang = 'en',
}: AnatomyHotspotsProps) {
  const isTamil = lang === 'ta';

  return (
    <group>
      {hotspots.map((spot) => {
        const isActive = activeHotspotId === spot.id;
        const title = isTamil ? spot.titleTa : spot.titleEn;

        return (
          <group key={spot.id} position={spot.position}>
            <Html
              center
              distanceFactor={8}
              zIndexRange={[100, 0]}
              className="pointer-events-auto select-none"
            >
              <div className="relative group">
                {/* 3D Pulse Pin Marker */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectHotspot(isActive ? null : spot.id);
                  }}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
                    isActive
                      ? 'bg-[#145B59] text-white ring-4 ring-[#20B2AA]/50 scale-110'
                      : 'bg-white/90 text-[#20B2AA] hover:bg-[#20B2AA] hover:text-white border border-[#20B2AA]/40 hover:scale-105'
                  }`}
                  aria-label={`${title} hotspot marker`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                </button>

                {/* Mini Title Tooltip */}
                {!isActive && (
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block whitespace-nowrap px-2.5 py-1 rounded-lg liquid-glass-lens text-[11px] font-bold text-[#145B59] shadow-sm pointer-events-none">
                    {title}
                  </div>
                )}
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}
