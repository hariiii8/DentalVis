'use client';

import React, { useRef, useState, useCallback } from 'react';
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
}

/**
 * LiquidGlassSurface: Optical-grade translucent material with physical specular
 * light-catching edges, internal refractive gradients, and dynamic pointer tracking.
 */
export function LiquidGlassSurface({
  className,
  variant = 'primary',
  glowColor = 'teal',
  specular = true,
  children,
  onMouseMove,
  onMouseLeave,
  ...props
}: LiquidGlassProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number; active: boolean }>({
    x: 50,
    y: 50,
    active: false,
  });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (variant === 'interactive' || specular) {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setMousePos({ x, y, active: true });
      }
      onMouseMove?.(e);
    },
    [variant, specular, onMouseMove]
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setMousePos((prev) => ({ ...prev, active: false }));
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
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'relative rounded-3xl transition-all duration-300 isolate group',
        variantClasses[variant],
        glowClasses[glowColor],
        className
      )}
      style={
        mousePos.active
          ? ({
              '--liquid-mouse-x': `${mousePos.x}%`,
              '--liquid-mouse-y': `${mousePos.y}%`,
            } as React.CSSProperties)
          : undefined
      }
      {...props}
    >
      {/* Specular Light Reflection Sheen (Dynamic or Static Refraction) */}
      {specular && (
        <div
          className="liquid-specular-sheen absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-300"
          style={
            mousePos.active
              ? {
                  background: `radial-gradient(circle 280px at ${mousePos.x}% ${mousePos.y}%, rgba(255, 255, 255, 0.42), rgba(255, 255, 255, 0.08) 50%, transparent 80%)`,
                  opacity: 1,
                }
              : undefined
          }
        />
      )}

      {/* Internal Optical Prism / Caustic Border Layer */}
      <div className="liquid-refractive-rim absolute inset-0 rounded-3xl pointer-events-none" />

      {/* Surface Content */}
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
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
      <div className="absolute -top-32 -left-20 w-[38rem] h-[38rem] rounded-full bg-gradient-to-br from-[#A4E6D5]/50 via-[#D9F0ED]/70 to-[#247F83]/25 blur-3xl pointer-events-none -z-10 animate-float-slow" />
      <div className="absolute top-1/4 -right-24 w-[40rem] h-[40rem] rounded-full bg-gradient-to-bl from-[#247F83]/20 via-[#A4E6D5]/35 to-transparent blur-3xl pointer-events-none -z-10 animate-float-gentle" />
      <div className="absolute -bottom-28 left-1/4 w-[45rem] h-[45rem] rounded-full bg-gradient-to-tr from-[#D9F0ED]/80 via-[#EAF5F8] to-[#247F83]/15 blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-2/3 right-1/4 w-80 h-80 rounded-full bg-[#A4E6D5]/30 blur-2xl pointer-events-none -z-10" />
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
      <div className="liquid-refractive-rim absolute inset-0 rounded-full pointer-events-none" />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </div>
  );
}
