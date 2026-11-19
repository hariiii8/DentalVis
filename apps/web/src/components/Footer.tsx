import React from 'react';
import Link from 'next/link';
import { Container, ClinicalDisclaimerBanner } from '@dentalvis/ui';
import { Sparkles, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-teal-900/10 pt-12 pb-8 mt-20">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#0D9488] flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-[#134E4A]">DentalVis 2.0</span>
            </div>
            <p className="text-sm text-slate-600 max-w-md leading-relaxed">
              Dismantling dental anxiety through crystal-clear visual clarity. Bilingual, interactive education explaining oral anatomy, dental conditions, and treatment procedures.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium pt-2">
              <span>Crafted for patient comfort & medical understanding</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            </div>
          </div>

          {/* Patient Exploration */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#134E4A] mb-3">Explore Treatments</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/explore/pain-and-sensitivity" className="hover:text-[#0D9488] transition-colors">
                  Pain & Sensitivity
                </Link>
              </li>
              <li>
                <Link href="/explore/broken-or-chipped-teeth" className="hover:text-[#0D9488] transition-colors">
                  Broken or Chipped Teeth
                </Link>
              </li>
              <li>
                <Link href="/explore/missing-teeth" className="hover:text-[#0D9488] transition-colors">
                  Missing Teeth & Implants
                </Link>
              </li>
              <li>
                <Link href="/explore/gums-and-bleeding" className="hover:text-[#0D9488] transition-colors">
                  Gums & Periodontal Care
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Clinical Transparency */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#134E4A] mb-3">Navigation</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/explore" className="hover:text-[#0D9488] transition-colors">
                  All Visual Guides
                </Link>
              </li>
              <li>
                <Link href="/symptoms" className="hover:text-[#0D9488] transition-colors">
                  Symptom Directory
                </Link>
              </li>
              <li>
                <Link href="/emergency" className="hover:text-[#0D9488] transition-colors">
                  Emergency Guidance
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Clinical Disclaimer Requirement */}
        <div className="py-6 border-t border-slate-100">
          <ClinicalDisclaimerBanner />
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} DentalVis Educational Platform. All rights reserved.</p>
          <p>Tamil (தமிழ்) & English Patient Education</p>
        </div>
      </Container>
    </footer>
  );
}
