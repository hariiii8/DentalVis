// packages/database/test/visualizationCoverage.test.ts
// Milestone M7.5 — Visualization & Interactive Learning Coverage Verification Suite
// Architecture Baseline v1.9.1 (FROZEN)

import { describe, it, expect } from 'vitest';
import { CANONICAL_PROCEDURES } from '@dentalvis/common';
import {
  CANONICAL_56_3D_CONFIGS,
  getProcedure3DConfig,
} from '../../apps/web/src/components/3d/procedure3DRegistry';
import * as fs from 'fs';
import * as path from 'path';

describe('M7.5 Visualization & Interactive Learning Verification', () => {
  const modelsDir = path.resolve(process.cwd(), '../../apps/web/public/models');
  const resolvedModelsDir = fs.existsSync(modelsDir)
    ? modelsDir
    : path.resolve(process.cwd(), 'apps/web/public/models');

  const imagesDir = path.resolve(process.cwd(), '../../apps/web/public/images/procedures');
  const resolvedImagesDir = fs.existsSync(imagesDir)
    ? imagesDir
    : path.resolve(process.cwd(), 'apps/web/public/images/procedures');

  it('verifies all 5 physical GLB assets exist with substantial binary size', () => {
    const expectedGlbs = [
      'deep-cleaning-periodontics.glb',
      'dental-crowns-prosthodontics.glb',
      'molar-endodontic-anatomy.glb',
      'orthodontic-braces-arch.glb',
      'single-dental-implant.glb',
    ];

    expect(fs.existsSync(resolvedModelsDir)).toBe(true);

    for (const glb of expectedGlbs) {
      const fullPath = path.resolve(resolvedModelsDir, glb);
      expect(fs.existsSync(fullPath), `Missing physical GLB model: ${glb}`).toBe(true);
      const stat = fs.statSync(fullPath);
      expect(stat.size).toBeGreaterThan(150000); // 150KB+ genuine binary meshes
    }
  });

  it('verifies exactly 5 procedures are actively mapped to verified 3D assets', () => {
    const active3DProcedures = CANONICAL_PROCEDURES.filter((p) => {
      const cfg = getProcedure3DConfig(p.slug);
      return cfg && cfg.isModelReady && cfg.modelAssetPath;
    });

    expect(active3DProcedures).toHaveLength(5);
    const activeSlugs = active3DProcedures.map((p) => p.slug).sort();
    expect(activeSlugs).toEqual([
      'deep-cleaning-scaling',
      'dental-crowns',
      'fixed-orthodontic-braces',
      'root-canal-treatment',
      'single-dental-implant',
    ]);

    for (const p of active3DProcedures) {
      const cfg = getProcedure3DConfig(p.slug)!;
      expect(cfg.modelState).toBe('AVAILABLE_AND_FUNCTIONAL');
      expect(cfg.cameraPresets.length).toBeGreaterThanOrEqual(5);
      expect(cfg.hotspots.length).toBeGreaterThanOrEqual(1);
      expect(cfg.structures.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('verifies all 48 procedures possess a dedicated 2D SVG educational schematic', () => {
    expect(fs.existsSync(resolvedImagesDir)).toBe(true);

    for (const p of CANONICAL_PROCEDURES) {
      const svgName = `${p.slug}.svg`;
      const fullPath = path.resolve(resolvedImagesDir, svgName);
      expect(fs.existsSync(fullPath), `Missing 2D SVG for procedure ${p.slug}`).toBe(true);
      const content = fs.readFileSync(fullPath, 'utf8');
      expect(content).toContain('<svg');
      expect(content).toContain('</svg>');
    }
  });

  it('verifies remaining 43 procedures possess honest IN_DEVELOPMENT 3D configuration with safe 2D fallbacks', () => {
    const inDevelopmentProcedures = CANONICAL_PROCEDURES.filter((p) => {
      const cfg = getProcedure3DConfig(p.slug);
      return cfg && !cfg.isModelReady;
    });

    expect(inDevelopmentProcedures).toHaveLength(43);

    for (const p of inDevelopmentProcedures) {
      const cfg = getProcedure3DConfig(p.slug)!;
      expect(cfg.modelState).toBe('IN_DEVELOPMENT');
      expect(cfg.modelAssetPath).toBeNull();
      expect(cfg.cameraPresets.length).toBeGreaterThanOrEqual(4);
      expect(cfg.structures.length).toBeGreaterThanOrEqual(1);
      expect(cfg.hotspots.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('verifies 3D camera presets are ergonomically calibrated across all registered configurations', () => {
    for (const p of CANONICAL_PROCEDURES) {
      const cfg = getProcedure3DConfig(p.slug)!;
      for (const preset of cfg.cameraPresets) {
        expect(preset.id).toBeDefined();
        expect(preset.labelEn.length).toBeGreaterThan(3);
        expect(preset.labelTa.length).toBeGreaterThan(3);
        expect(preset.position).toHaveLength(3);
        expect(preset.target).toHaveLength(3);

        // Distance check: ensure camera does not clip inside geometry
        const dist = Math.hypot(
          preset.position[0] - preset.target[0],
          preset.position[1] - preset.target[1],
          preset.position[2] - preset.target[2]
        );
        expect(dist).toBeGreaterThanOrEqual(2.5);
      }
    }
  });
});
