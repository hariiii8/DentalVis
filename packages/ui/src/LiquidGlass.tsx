'use client';

import React, { useRef, useCallback, useEffect } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ----------------------------------------------------------------------
// LIQUID GLASS DESIGN SYSTEM PRIMITIVES
// ----------------------------------------------------------------------

export interface LiquidGlassProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary' | 'floating' | 'interactive' | 'lens';
  glowColor?: 'teal' | 'mint' | 'ice' | 'none';
  specular?: boolean;
  refractiveRim?: boolean;
  as?: React.ElementType;
}

/**
 * LiquidGlassSurface: Optical-grade translucent material with physical specular
 * light-catching edges, internal refractive gradients, and GPU-composited dynamic pointer tracking.
 *
 * Performance note: Pointer coordinates are pushed directly to CSS custom properties
 * on the surface DOM element via requestAnimationFrame, completely bypassing React
 * render cycles. Touch-only devices gracefully default to elegant static 35° lighting.
 */
export function LiquidGlassSurface({
  className,
  variant = 'primary',
  glowColor = 'none',
  specular = true,
  refractiveRim = true,
  as: Component = 'div',
  children,
  onMouseMove,
  onMouseLeave,
  style,
  ...props
}: LiquidGlassProps) {
  const surfaceRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  // Clean up any pending animation frames on unmount
  useEffect(() => {
    return () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Avoid tracking on touch or if neither interactive nor specular is needed
      if (window.matchMedia && window.matchMedia('(hover: none)').matches) {
        onMouseMove?.(e);
        return;
      }

      const currentTarget = e.currentTarget;
      const clientX = e.clientX;
      const clientY = e.clientY;

      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }

      rafId.current = requestAnimationFrame(() => {
        if (!currentTarget) return;
        const rect = currentTarget.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
          const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));

          currentTarget.style.setProperty('--liquid-mouse-x', `${x.toFixed(1)}%`);
          currentTarget.style.setProperty('--liquid-mouse-y', `${y.toFixed(1)}%`);
        }
      });

      onMouseMove?.(e);
    },
    [onMouseMove]
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const currentTarget = e.currentTarget;
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }

      rafId.current = requestAnimationFrame(() => {
        if (!currentTarget) return;
        // Gracefully reset to natural 35° top-left clinical lighting position
        currentTarget.style.setProperty('--liquid-mouse-x', '35%');
        currentTarget.style.setProperty('--liquid-mouse-y', '25%');
      });

      onMouseLeave?.(e);
    },
    [onMouseLeave]
  );

  // Variant class mapping
  const variantClasses = {
    primary: 'liquid-glass-primary',
    secondary: 'liquid-glass-secondary',
    floating: 'liquid-glass-floating',
    interactive: 'liquid-glass-interactive',
    lens: 'liquid-glass-lens',
  };

  const glowClasses = {
    teal: 'liquid-glow-teal',
    mint: 'liquid-glow-mint',
    ice: 'liquid-glow-ice',
    none: '',
  };

  return (
    <Component
      ref={surfaceRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'relative rounded-3xl transition-all duration-300 isolate group',
        variantClasses[variant],
        glowClasses[glowColor],
        className
      )}
      style={style}
      {...props}
    >
      {/* Specular Light Reflection Sheen */}
      {specular && (
        <div
          aria-hidden="true"
          className="liquid-specular-sheen absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-300"
        />
      )}

      {/* Internal Optical Prism / Caustic Border Layer */}
      {refractiveRim && (
        <div
          aria-hidden="true"
          className="liquid-refractive-rim absolute inset-0 rounded-3xl pointer-events-none"
        />
      )}

      {/* Surface Content */}
      <div className="relative z-10 w-full h-full">{children}</div>
    </Component>
  );
}

/**
 * Ambient Optical Background Canvas:
 * Provides the rich, layered fluid colour fields (ice blue, medical teal, soft mint)
 * that liquid glass refracts and magnifies.
 */
export function LiquidAmbientBackground({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('relative overflow-hidden', className)} {...props}>
      {/* Dynamic Fluid Plasma Orbs */}
      <div className="absolute -top-32 -left-20 w-[38rem] h-[38rem] rounded-full bg-gradient-to-br from-[#BFE9E2]/50 via-[#E8F7F6]/70 to-[#20B2AA]/20 blur-3xl pointer-events-none -z-10 animate-float-slow" />
      <div className="absolute top-1/4 -right-24 w-[40rem] h-[40rem] rounded-full bg-gradient-to-bl from-[#20B2AA]/20 via-[#BFE9E2]/35 to-transparent blur-3xl pointer-events-none -z-10 animate-float-gentle" />
      <div className="absolute -bottom-28 left-1/4 w-[45rem] h-[45rem] rounded-full bg-gradient-to-tr from-[#DDF5F1]/80 via-[#F5FAF9] to-[#20B2AA]/15 blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-2/3 right-1/4 w-80 h-80 rounded-full bg-[#BFE9E2]/30 blur-2xl pointer-events-none -z-10" />
      {children}
    </div>
  );
}

/**
 * Floating Liquid Glass Pill or Lens
 */
export function LiquidFloatingPill({
  className,
  animation = 'slow',
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { animation?: 'slow' | 'gentle' | 'none' }) {
  const animStyles = {
    slow: 'animate-float-slow',
    gentle: 'animate-float-gentle',
    none: '',
  };

  return (
    <div
      className={cn(
        'liquid-glass-lens py-2.5 px-5 rounded-full text-xs font-bold text-[#164B50] flex items-center gap-2 select-none isolate',
        animStyles[animation],
        className
      )}
      {...props}
    >
      <div aria-hidden="true" className="liquid-refractive-rim absolute inset-0 rounded-full pointer-events-none" />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </div>
  );
}
