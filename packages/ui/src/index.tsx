import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ----------------------------------------------------------------------
// BUTTON COMPONENT
// ----------------------------------------------------------------------
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'mint';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";
    
    const variants = {
      primary: "bg-[#0D9488] text-white hover:bg-[#0f766e] focus-visible:ring-[#0D9488] shadow-sm hover:shadow",
      secondary: "bg-[#134E4A] text-white hover:bg-[#0c312e] focus-visible:ring-[#134E4A]",
      outline: "border border-teal-200/80 bg-white/80 backdrop-blur-sm text-[#134E4A] hover:bg-teal-50/50 hover:border-teal-300 focus-visible:ring-teal-400",
      ghost: "text-[#134E4A] hover:bg-teal-50/70 focus-visible:ring-teal-400",
      mint: "bg-[#E6F7F2] text-[#134E4A] hover:bg-[#d0f0e7] focus-visible:ring-teal-400 border border-teal-100"
    };

    const sizes = {
      sm: "text-xs px-3 py-1.5 gap-1.5",
      md: "text-sm px-4 py-2.5 gap-2",
      lg: "text-base px-6 py-3.5 gap-2.5 rounded-2xl"
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
// CARD COMPONENT ("Liquid Glass" Styling)
// ----------------------------------------------------------------------
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export function Card({ className, glass = true, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border transition-all duration-300",
        glass
          ? "bg-white/85 backdrop-blur-md border-teal-900/10 shadow-[0_4px_24px_-4px_rgba(13,148,136,0.06)] hover:shadow-[0_8px_30px_-6px_rgba(13,148,136,0.12)] hover:border-teal-600/30"
          : "bg-white border-slate-200 shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pb-4", className)} {...props}>{children}</div>;
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-xl font-semibold tracking-tight text-[#173F3B]", className)} {...props}>{children}</h3>;
}

export function CardDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-slate-600 mt-1.5 leading-relaxed", className)} {...props}>{children}</p>;
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pt-0", className)} {...props}>{children}</div>;
}

export function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pt-0 flex items-center gap-3", className)} {...props}>{children}</div>;
}

// ----------------------------------------------------------------------
// BADGE COMPONENT
// ----------------------------------------------------------------------
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'mint' | 'outline' | 'alert';
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  const variants = {
    default: "bg-teal-50 text-[#0D9488] border border-teal-200/60",
    mint: "bg-[#E6F7F2] text-[#134E4A] border border-teal-100",
    outline: "border border-slate-200 text-slate-700 bg-white",
    alert: "bg-amber-50 text-amber-800 border border-amber-200"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide",
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
    <div className={cn("w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", className)} {...props}>
      {children}
    </div>
  );
}

// ----------------------------------------------------------------------
// CLINICAL DISCLAIMER BANNER COMPONENT
// ----------------------------------------------------------------------
export function ClinicalDisclaimerBanner({ lang = 'en', className }: { lang?: 'en' | 'ta'; className?: string }) {
  const text = lang === 'ta'
    ? "கல்வி வழிகாட்டி மட்டுமே: டென்டல்விஸ் தளத்தில் உள்ள தகவல்கள் நோயாளிகளுக்கும் பல் மருத்துவ நிபுணர்களுக்கும் இடையேயான கலந்துரையாடலை எளிதாக்குவதற்காக மட்டுமே உருவாக்கப்பட்டுள்ளது. இது மருத்துவப் பரிசோதனை அல்லது சிகிச்சை பரிந்துரை அல்ல."
    : "Educational Visual Guide Only: The information provided on DentalVis is designed to facilitate informed discussions between patients and certified dental professionals. It does not constitute medical diagnosis, clinical treatment advice, or formal care recommendations.";

  return (
    <div className={cn("bg-teal-50/70 border-l-4 border-[#0D9488] p-4 rounded-r-xl text-xs text-[#134E4A] leading-relaxed shadow-sm", className)}>
      <div className="flex items-start gap-2.5">
        <span className="font-bold uppercase tracking-wider text-[10px] bg-teal-100 text-[#0D9488] px-1.5 py-0.5 rounded">
          {lang === 'ta' ? 'அறிவிப்பு' : 'Disclaimer'}
        </span>
        <p className="flex-1">{text}</p>
      </div>
    </div>
  );
}
