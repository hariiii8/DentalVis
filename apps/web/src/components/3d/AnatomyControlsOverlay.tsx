// apps/web/src/components/3d/AnatomyControlsOverlay.tsx
// Responsive Liquid Glass overlay HUD with Camera presets, layer toggles, reset, and structure inspection

'use client';

import React, { useState } from 'react';
import { Badge } from '@dentalvis/ui';
import {
  RotateCcw,
  Play,
  Pause,
  Layers,
  Eye,
  EyeOff,
  Crosshair,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react';
import { Procedure3DConfig, SpatialHotspot } from './types';
import { AnatomyViewerState } from './hooks/useAnatomyViewerState';

interface AnatomyControlsOverlayProps {
  config: Procedure3DConfig;
  state: AnatomyViewerState;
  lang?: 'en' | 'ta';
  hoveredHotspot?: SpatialHotspot | null;
  projectedPositions?: Record<string, { x: number; y: number; visible: boolean }>;
}

export function AnatomyControlsOverlay({
  config,
  state,
  lang = 'en',
  hoveredHotspot,
  projectedPositions,
}: AnatomyControlsOverlayProps) {
  const isTamil = lang === 'ta';
  const [layersMenuOpen, setLayersMenuOpen] = useState(false);

  const selectedStructure = config.structures.find((s) => s.id === state.selectedStructureId);
  const activeHotspot = config.hotspots.find((h) => h.id === state.activeHotspotId);

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-4 sm:p-5">
      {/* Top Bar: Camera Presets & Reset */}
      <div className="flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
        {/* Preset View Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl liquid-glass-lens backdrop-blur-md shadow-xs overflow-x-auto max-w-full">
          <span className="text-[11px] font-bold text-[#145B59] px-2 hidden sm:inline">
            {isTamil ? 'பார்வை:' : 'View:'}
          </span>
          {config.cameraPresets.map((preset) => {
            const isActive = state.activeCameraPreset === preset.id;
            const label = isTamil ? preset.labelTa : preset.labelEn;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => state.setCameraPreset(preset.id)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#145B59] text-white shadow-xs'
                    : 'text-[#145B59] hover:bg-white/60'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Global Controls: Auto-Rotate & Reset */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl liquid-glass-lens backdrop-blur-md shadow-xs">
          <button
            type="button"
            onClick={state.toggleAutoRotate}
            className={`p-2 rounded-xl transition-all ${
              state.isAutoRotating
                ? 'bg-[#20B2AA] text-white'
                : 'text-[#145B59] hover:bg-white/60'
            }`}
            title={
              state.isAutoRotating
                ? isTamil ? 'சுழற்சியை நிறுத்து' : 'Pause Auto-Rotation'
                : isTamil ? 'சுழற்சியைத் தொடங்கு' : 'Start Auto-Rotation'
            }
            aria-label={state.isAutoRotating ? 'Pause Rotation' : 'Auto Rotate'}
          >
            {state.isAutoRotating ? (
              <Pause className="w-3.5 h-3.5" />
            ) : (
              <Play className="w-3.5 h-3.5" />
            )}
          </button>

          <button
            type="button"
            onClick={state.resetAll}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold text-[#145B59] hover:bg-white/60 transition-all"
            title={isTamil ? 'தொடக்க நிலைக்குத் திரும்பு' : 'Reset Camera & Layers'}
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#20B2AA]" />
            <span className="hidden sm:inline">{isTamil ? 'மீட்டமை' : 'Reset'}</span>
          </button>
        </div>
      </div>

      {/* Middle Floating Inspector: When a structure or hotspot is selected */}
      {(selectedStructure || activeHotspot) && (
        <div className="self-start max-w-sm w-full pointer-events-auto mt-auto mb-3 sm:mb-4">
          <div className="liquid-glass-primary rounded-2xl p-4 shadow-lg border border-white/80 relative isolate">
            <button
              type="button"
              onClick={() => {
                state.selectStructure(null);
                state.selectHotspot(null);
              }}
              className="absolute top-3 right-3 w-6 h-6 rounded-lg liquid-glass-lens flex items-center justify-center text-[#587477] hover:text-[#145B59]"
              aria-label="Close details"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <Badge variant="mint" className="text-[10px] font-bold liquid-glass-lens">
                {activeHotspot
                  ? isTamil ? 'அவதானிப்பு புள்ளி' : 'Anatomy Hotspot'
                  : isTamil ? 'தேர்ந்தெடுக்கப்பட்ட பகுதி' : 'Selected Structure'}
              </Badge>
              {selectedStructure?.colorHint && (
                <div
                  className="w-3 h-3 rounded-full border border-white shadow-xs"
                  style={{ backgroundColor: selectedStructure.colorHint }}
                />
              )}
            </div>

            <h4 className="text-base font-bold text-[#145B59] mb-1">
              {activeHotspot
                ? isTamil ? activeHotspot.titleTa : activeHotspot.titleEn
                : isTamil ? selectedStructure?.labelTa : selectedStructure?.labelEn}
            </h4>

            <p className="text-xs text-[#587477] leading-relaxed">
              {activeHotspot
                ? isTamil ? activeHotspot.contentTa : activeHotspot.contentEn
                : isTamil ? selectedStructure?.descriptionTa : selectedStructure?.descriptionEn}
            </p>
          </div>
        </div>
      )}

      {/* Floating 2D Tooltip for Hovered Hotspot (Rendered safely on Single Overlay Root) */}
      {hoveredHotspot && projectedPositions?.[hoveredHotspot.id]?.visible && (
        <div
          className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-full transition-transform duration-75 z-20"
          style={{
            left: `${projectedPositions[hoveredHotspot.id].x}px`,
            top: `${projectedPositions[hoveredHotspot.id].y - 12}px`,
          }}
        >
          <div className="px-2.5 py-1 rounded-lg liquid-glass-lens text-[11px] font-bold text-[#145B59] shadow-md whitespace-nowrap border border-[#20B2AA]/40 bg-white/90">
            {isTamil ? hoveredHotspot.titleTa : hoveredHotspot.titleEn}
          </div>
        </div>
      )}

      {/* Bottom Bar: Layer Visibility Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pointer-events-auto">
        {/* Layer Groups Popover/Bar */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setLayersMenuOpen((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl liquid-glass-lens text-xs font-bold text-[#145B59] shadow-xs hover:bg-white/70 transition-all"
          >
            <Layers className="w-3.5 h-3.5 text-[#20B2AA]" />
            <span>{isTamil ? 'உடற்கூறு அடுக்குகள்' : 'Anatomy Layers'}</span>
            {layersMenuOpen ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronUp className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Expanded Layers Drawer */}
          {layersMenuOpen && (
            <div className="absolute left-0 bottom-full mb-2 w-64 liquid-glass-primary rounded-2xl p-3 shadow-xl border border-white/80 space-y-2 z-20">
              <div className="text-[11px] font-black uppercase tracking-wider text-[#145B59] mb-1">
                {isTamil ? 'அடுக்கு பார்வை கட்டுப்பாடு' : 'Layer Visibility'}
              </div>

              {config.layerGroups.map((layer) => {
                const isVisible = state.visibleLayers[layer.id] ?? true;
                const label = isTamil ? layer.labelTa : layer.labelEn;
                return (
                  <button
                    key={layer.id}
                    type="button"
                    onClick={() => state.toggleLayer(layer.id)}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-white/60 transition-all text-[#145B59]"
                  >
                    <span>{label}</span>
                    {isVisible ? (
                      <Eye className="w-4 h-4 text-[#20B2AA]" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-[#587477]/50" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Gesture Orientation Guide Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl liquid-glass-lens text-[11px] font-medium text-[#587477] shadow-xs">
          <Crosshair className="w-3 h-3 text-[#20B2AA]" />
          <span>
            {isTamil
              ? 'சுழற்ற இழுக்கவும் · ஆய்வு செய்ய பின்களை அழுத்தவும்'
              : 'Drag to rotate · Click aspect pills or pins to inspect'}
          </span>
        </div>
      </div>
    </div>
  );
}
