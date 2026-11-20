// apps/web/src/components/3d/hooks/useWebGLSupport.ts
// Detects WebGL2 / WebGL1 capability cleanly and safely in SSR / client environments

'use client';

import { useState, useEffect } from 'react';

export interface WebGLSupportResult {
  isSupported: boolean;
  version: 'webgl2' | 'webgl' | null;
  rendererName: string | null;
  errorReason: string | null;
  isChecking: boolean;
}

export function useWebGLSupport(): WebGLSupportResult {
  const [result, setResult] = useState<WebGLSupportResult>({
    isSupported: false,
    version: null,
    rendererName: null,
    errorReason: null,
    isChecking: true,
  });

  useEffect(() => {
    try {
      if (typeof window === 'undefined' || typeof document === 'undefined') {
        setResult({
          isSupported: false,
          version: null,
          rendererName: null,
          errorReason: 'Server-side rendering',
          isChecking: false,
        });
        return;
      }

      const canvas = document.createElement('canvas');

      // Try WebGL 2 first
      let gl: WebGLRenderingContext | WebGL2RenderingContext | null = canvas.getContext('webgl2');
      let version: 'webgl2' | 'webgl' | null = 'webgl2';

      if (!gl) {
        // Fallback to WebGL 1
        gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
        version = gl ? 'webgl' : null;
      }

      if (!gl) {
        setResult({
          isSupported: false,
          version: null,
          rendererName: null,
          errorReason: 'WebGL context not supported by hardware or disabled in browser.',
          isChecking: false,
        });
        return;
      }

      // Query debug renderer info if permitted
      let rendererName = 'Standard GPU';
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        rendererName = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || rendererName;
      }

      // Clean up test context
      const loseContext = gl.getExtension('WEBGL_lose_context');
      if (loseContext) {
        loseContext.loseContext();
      }

      setResult({
        isSupported: true,
        version,
        rendererName,
        errorReason: null,
        isChecking: false,
      });
    } catch (err) {
      setResult({
        isSupported: false,
        version: null,
        rendererName: null,
        errorReason: err instanceof Error ? err.message : 'Unknown WebGL failure',
        isChecking: false,
      });
    }
  }, []);

  return result;
}
