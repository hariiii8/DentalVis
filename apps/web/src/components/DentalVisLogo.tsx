import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { clsx } from 'clsx';

interface LogoProps {
  variant?: 'mark' | 'full';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  linkHref?: string | null;
  tagline?: string;
}

const sizeConfig = {
  sm: { mark: 32, fullWidth: 140, fullHeight: 38 },
  md: { mark: 42, fullWidth: 180, fullHeight: 48 },
  lg: { mark: 56, fullWidth: 230, fullHeight: 62 },
  xl: { mark: 72, fullWidth: 290, fullHeight: 78 },
};

export function DentalVisLogo({
  variant = 'full',
  size = 'md',
  className = '',
  linkHref = '/home',
  tagline,
}: LogoProps) {
  const cfg = sizeConfig[size];

  const content = (
    <div className={clsx('inline-flex items-center gap-3 select-none group', className)}>
      {variant === 'mark' ? (
        <div
          className="relative shrink-0 flex items-center justify-center rounded-2xl p-1 transition-transform duration-300 group-hover:scale-105"
          style={{ width: cfg.mark, height: cfg.mark }}
        >
          <Image
            src="/brand/logo-mark.svg"
            alt="DentalVis Logo Mark"
            fill
            priority
            className="object-contain drop-shadow-[0_4px_12px_rgba(36,127,131,0.25)]"
          />
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <div
            className="relative shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
            style={{ width: cfg.mark, height: cfg.mark }}
          >
            <Image
              src="/brand/logo-mark.svg"
              alt="DentalVis Mark"
              fill
              priority
              className="object-contain drop-shadow-[0_4px_12px_rgba(36,127,131,0.25)]"
            />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5 leading-none">
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#164B50]">
                Dental<span className="bg-gradient-to-r from-[#247F83] via-[#2DD4BF] to-[#A4E6D5] bg-clip-text text-transparent">Vis</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#D9F0ED] text-[#247F83] border border-[#A4E6D5]/50">
                2.0
              </span>
            </div>
            {tagline && (
              <p className="text-[11px] font-medium text-[#64777C] mt-1 tracking-wide">
                {tagline}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );

  if (linkHref) {
    return (
      <Link href={linkHref} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#247F83] rounded-2xl">
        {content}
      </Link>
    );
  }

  return content;
}
