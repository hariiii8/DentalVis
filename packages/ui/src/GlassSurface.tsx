'use client';

import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ----------------------------------------------------------------------
// GLASS DESIGN SYSTEM PRIMITIVES
// ----------------------------------------------------------------------

export interface GlassSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  intensity?: 'subtle' | 'standard' | 'glow' | 'floating';
  interactive?: boolean;
}

/**
 * Reusable GlassSurface component establishing the Apple-inspired translucent
 * layer with reflective highlights, backdrop blurs, and soft ambient shadows.
 */
export function GlassSurface({
  className,
  intensity = 'standard',
  interactive = false,
  children,
  ...props
}: GlassSurfaceProps) {
  const intensityStyles = {
    subtle: 'glass-panel-subtle',
    standard: 'glass-panel',
    glow: 'glass-panel-glow',
    floating: 'glass-panel shadow-[0_16px_40px_-10px_rgba(22,75,80,0.14)]',
  };

  const interactiveStyles = interactive
    ? 'hover:translate-y-[-3px] hover:shadow-[0_20px_48px_-10px_rgba(36,127,131,0.2)] hover:border-white transition-all duration-300 cursor-pointer'
    : '';

  return (
    <div
      className={cn('rounded-3xl', intensityStyles[intensity], interactiveStyles, className)}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Reusable ambient background container providing the rich visual depths
 * (soft ice blue, pale mint, medical teal ambient orbs) required for glass to reflect against.
 */
export function AmbientBackground({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('relative overflow-hidden', className)} {...props}>
      {/* Decorative ambient color orbs behind glass */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#A4E6D5]/40 blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/4 -right-24 w-[32rem] h-[32rem] rounded-full bg-[#247F83]/15 blur-3xl pointer-events-none -z-10" />
      <div className="absolute -bottom-24 left-1/3 w-[36rem] h-[36rem] rounded-full bg-[#D9F0ED]/60 blur-3xl pointer-events-none -z-10" />
      {children}
    </div>
  );
}

/**
 * Floating decorative glass badge or pill with soft motion
 */
export function GlassFloatingElement({
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
        'glass-panel py-2 px-4 rounded-full text-xs font-bold text-[#164B50] flex items-center gap-2 select-none',
        animStyles[animation],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
