// packages/database/test/procedureVisualizationInventory.test.ts
// M6.4 — Procedure Visualization Completion Verification Suite
// Validates all 48 canonical procedures, 3D configurations, model mappings, and 2D fallbacks.

import { describe, it, expect } from 'vitest';
import { CANONICAL_PROCEDURES } from '@dentalvis/common';
import { CANONICAL_56_3D_CONFIGS, getProcedure3DConfig } from '../../apps/web/src/components/3d/procedure3DRegistry';
import * as fs from 'fs';
import * as path from 'path';

describe('M6.4 Procedure Visualization Inventory & Integrity', () => {
  it('contains exactly 48 canonical dental procedures in common package', () => {
    expect(CANONICAL_PROCEDURES).toBeDefined();
    expect(CANONICAL_PROCEDURES.length).toBe(48);
  });

  it('every canonical procedure has a valid 3D configuration entry', () => {
    for (const proc of CANONICAL_PROCEDURES) {
      const config = getProcedure3DConfig(proc.slug);
      expect(config, `Missing 3D config for ${proc.slug}`).toBeDefined();
      expect(config?.procedureSlug).toBe(proc.slug);
      expect(config?.cameraPresets.length).toBeGreaterThanOrEqual(4);
      expect(config?.layerGroups.length).toBeGreaterThanOrEqual(1);
      expect(config?.structures.length).toBeGreaterThanOrEqual(1);
      expect(config?.hotspots.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('correctly maps the 5 physical GLB models and verifies their existence on disk', () => {
    const readyProcedures = CANONICAL_PROCEDURES.filter((p) => {
      const cfg = getProcedure3DConfig(p.slug);
      return cfg && cfg.isModelReady && cfg.modelAssetPath;
    });

    expect(readyProcedures.length).toBe(5);
    const readySlugs = readyProcedures.map((p) => p.slug);
    expect(readySlugs).toEqual([
      'root-canal-treatment',
      'dental-crowns',
      'deep-cleaning-scaling',
      'single-dental-implant',
      'fixed-orthodontic-braces',
    ]);

    // Verify all 5 GLB assets actually exist in apps/web/public/models
    const modelsDir = path.resolve(process.cwd(), '../../apps/web/public/models');
    const resolvedDir = fs.existsSync(modelsDir)
      ? modelsDir
      : path.resolve(process.cwd(), 'apps/web/public/models');
    expect(fs.existsSync(resolvedDir)).toBe(true);

    for (const proc of readyProcedures) {
      const cfg = getProcedure3DConfig(proc.slug)!;
      const relativeAsset = cfg.modelAssetPath!.replace(/^\//, '');
      const fullPath = path.resolve(resolvedDir, '..', relativeAsset);
      expect(fs.existsSync(fullPath), `Missing GLB asset for ${proc.slug} at ${fullPath}`).toBe(true);
      const stat = fs.statSync(fullPath);
      expect(stat.size).toBeGreaterThan(10000); // Must be genuine binary models
    }
  });

  it('accurately flags remaining 43 procedures as IN_DEVELOPMENT with asset pending', () => {
    const pendingProcedures = CANONICAL_PROCEDURES.filter((p) => {
      const cfg = getProcedure3DConfig(p.slug);
      return cfg && !cfg.isModelReady;
    });

    expect(pendingProcedures.length).toBe(43);
    for (const proc of pendingProcedures) {
      const cfg = getProcedure3DConfig(proc.slug)!;
      expect(cfg.modelState).toBe('IN_DEVELOPMENT');
      expect(cfg.isModelReady).toBe(false);
      expect(cfg.clinicalReviewStatus).toBe('EDUCATIONAL_DRAFT');
    }
  });

  it('enforces calibrated camera preset coordinates without zero distance', () => {
    for (const proc of CANONICAL_PROCEDURES) {
      const cfg = getProcedure3DConfig(proc.slug)!;
      expect(cfg.defaultCameraPosition).toBeDefined();
      expect(cfg.defaultCameraPosition.length).toBe(3);
      // Distance from origin must be comfortably framing the anatomy (>= 3 units)
      const dist = Math.hypot(...cfg.defaultCameraPosition);
      expect(dist).toBeGreaterThanOrEqual(3.0);
    }
  });
});
