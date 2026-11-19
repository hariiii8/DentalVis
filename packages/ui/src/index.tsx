import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ----------------------------------------------------------------------
// BUTTON COMPONENT (Enhanced with Apple-like gradients & spring states)
// ----------------------------------------------------------------------
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'mint' | 'glass';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97] cursor-pointer';

    const variants = {
      primary:
        'bg-gradient-to-r from-[#20B2AA] to-[#145B59] text-white hover:from-[#1ca099] hover:to-[#104a48] focus-visible:ring-[#20B2AA] shadow-[0_6px_20px_-4px_rgba(32,178,170,0.38)] hover:shadow-[0_10px_24px_-4px_rgba(32,178,170,0.48)] hover:translate-y-[-1px]',
      secondary:
        'bg-[#145B59] text-white hover:bg-[#0f4442] focus-visible:ring-[#145B59] shadow-sm',
      outline:
        'border border-[#C8E7E3] bg-[#E8F7F6]/80 backdrop-blur-md text-[#164B50] hover:bg-[#DDF5F1] hover:border-[#20B2AA]/50 focus-visible:ring-[#20B2AA] shadow-sm',
      ghost:
        'text-[#164B50] hover:bg-[#DDF5F1]/70 focus-visible:ring-[#20B2AA]',
      mint:
        'bg-gradient-to-r from-[#BFE9E2] to-[#DDF5F1] text-[#145B59] hover:brightness-95 focus-visible:ring-[#20B2AA] border border-[#BFE9E2]/70 shadow-sm font-bold',
      glass:
        'bg-[#F5FAF9]/75 backdrop-blur-xl border border-white/90 text-[#164B50] hover:bg-white/90 shadow-[0_8px_24px_rgba(20,91,89,0.08)] hover:shadow-[0_12px_32px_rgba(20,91,89,0.14)]',
    };

    const sizes = {
      sm: 'text-xs px-3.5 py-1.5 gap-1.5 rounded-xl',
      md: 'text-sm px-5 py-2.5 gap-2 rounded-2xl',
      lg: 'text-base px-7 py-3.5 gap-2.5 rounded-2xl shadow-md',
      xl: 'text-lg px-8 py-4 gap-3 rounded-2xl font-bold shadow-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

// ----------------------------------------------------------------------
// CARD COMPONENT ("Liquid Glass" & Translucent Layering)
// ----------------------------------------------------------------------
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean | 'subtle' | 'glow';
}

export function Card({ className, glass = true, children, ...props }: CardProps) {
  let glassStyle = 'bg-white border-[#DCEAEC] shadow-sm';
  if (glass === true) {
    glassStyle =
      'glass-panel hover:shadow-[0_20px_48px_-8px_rgba(36,127,131,0.18)] hover:border-white transition-all duration-300';
  } else if (glass === 'subtle') {
    glassStyle =
      'glass-panel-subtle hover:shadow-[0_14px_32px_-6px_rgba(22,75,80,0.1)] transition-all duration-300';
  } else if (glass === 'glow') {
    glassStyle =
      'glass-panel-glow hover:shadow-[0_24px_56px_-12px_rgba(36,127,131,0.22)] hover:border-white transition-all duration-300';
  }

  return (
    <div
      className={cn('rounded-3xl border transition-all duration-300', glassStyle, className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6 sm:p-7 pb-4', className)} {...props}>{children}</div>;
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-xl font-bold tracking-tight text-[#164B50]', className)} {...props}>{children}</h3>;
}

export function CardDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-[#64777C] mt-2 leading-relaxed', className)} {...props}>{children}</p>;
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6 sm:p-7 pt-0', className)} {...props}>{children}</div>;
}

export function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6 sm:p-7 pt-0 flex items-center gap-3', className)} {...props}>{children}</div>;
}

// ----------------------------------------------------------------------
// BADGE COMPONENT
// ----------------------------------------------------------------------
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'mint' | 'outline' | 'alert' | 'glass';
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-[#DDF5F1] text-[#20B2AA] border border-[#20B2AA]/30 font-semibold',
    mint: 'bg-[#BFE9E2]/60 text-[#145B59] border border-[#BFE9E2] font-semibold',
    outline: 'border border-[#C8E7E3] text-[#164B50] bg-[#F5FAF9]/85 backdrop-blur-sm',
    alert: 'bg-amber-50 text-amber-900 border border-amber-200 font-semibold',
    glass: 'bg-[#F5FAF9]/70 backdrop-blur-md text-[#164B50] border border-white/90 font-medium shadow-xs',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium tracking-wide',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

// ----------------------------------------------------------------------
// CONTAINER COMPONENT
// ----------------------------------------------------------------------
export function Container({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8', className)} {...props}>
      {children}
    </div>
  );
}

// ----------------------------------------------------------------------
// CLINICAL DISCLAIMER BANNER COMPONENT
// ----------------------------------------------------------------------
export * from './GlassSurface';
export * from './LiquidGlass';

export function ClinicalDisclaimerBanner({ lang = 'en', className }: { lang?: 'en' | 'ta'; className?: string }) {
  const text =
    lang === 'ta'
      ? 'கல்வி வழிகாட்டி மட்டுமே: டென்டல்விஸ் தளத்தில் உள்ள தகவல்கள் நோயாளிகளுக்கும் பல் மருத்துவ நிபுணர்களுக்கும் இடையேயான கலந்துரையாடலை எளிதாக்குவதற்காக மட்டுமே உருவாக்கப்பட்டுள்ளது. இது மருத்துவப் பரிசோதனை அல்லது சிகிச்சை பரிந்துரை அல்ல.'
      : 'Educational Visual Guide Only: The information provided on DentalVis is designed to facilitate informed discussions between patients and certified dental professionals. It does not constitute medical diagnosis, clinical treatment advice, or formal care recommendations.';

  return (
    <div
      className={cn(
        'bg-white/60 backdrop-blur-md border border-[#DCEAEC] border-l-4 border-l-[#247F83] p-4 rounded-2xl text-xs text-[#164B50] leading-relaxed shadow-sm',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <span className="font-extrabold uppercase tracking-wider text-[10px] bg-[#D9F0ED] text-[#247F83] px-2 py-0.5 rounded-md shrink-0 mt-0.5">
          {lang === 'ta' ? 'அறிவிப்பு' : 'Notice'}
        </span>
        <p className="flex-1 text-[#64777C]">{text}</p>
      </div>
    </div>
  );
}
