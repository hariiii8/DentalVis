'use client';

import React from 'react';
import Link from 'next/link';
import { Container, ClinicalDisclaimerBanner } from '@dentalvis/ui';
import { Sparkles, Heart } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export function Footer() {
  const { language } = useLanguage();
  const isTamil = language === 'ta';

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
              {isTamil
                ? 'பல் மருத்துவ பயங்களை நீக்கி, தெளிவான காட்சி வழிகாட்டிகள் மூலம் அறிவை மேம்படுத்துதல். வாய் உடற்கூறியல், பல் பிரச்சினைகள் மற்றும் சிகிச்சை முறைகளை விளக்கும் இருமொழி கல்வித் தளம்.'
                : 'Dismantling dental anxiety through crystal-clear visual clarity. Bilingual, interactive education explaining oral anatomy, dental conditions, and treatment procedures.'}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium pt-2">
              <span>{isTamil ? 'நோயாளி நல்வாழ்வு மற்றும் மருத்துவப் புரிதலுக்காக உருவாக்கப்பட்டது' : 'Crafted for patient comfort & medical understanding'}</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            </div>
          </div>

          {/* Patient Exploration */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#134E4A] mb-3">
              {isTamil ? 'சிகிச்சைப் பிரிவுகள்' : 'Explore Treatments'}
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/explore/pain-and-sensitivity" className="hover:text-[#0D9488] transition-colors">
                  {isTamil ? 'பல் வலி & கூச்சம்' : 'Pain & Sensitivity'}
                </Link>
              </li>
              <li>
                <Link href="/explore/broken-or-chipped-teeth" className="hover:text-[#0D9488] transition-colors">
                  {isTamil ? 'உடைந்த & விரிசல் பற்கள்' : 'Broken or Chipped Teeth'}
                </Link>
              </li>
              <li>
                <Link href="/explore/missing-teeth" className="hover:text-[#0D9488] transition-colors">
                  {isTamil ? 'இழந்த பற்கள் & இம்ப்ளான்ட்' : 'Missing Teeth & Implants'}
                </Link>
              </li>
              <li>
                <Link href="/explore/gums-and-bleeding" className="hover:text-[#0D9488] transition-colors">
                  {isTamil ? 'ஈறுகள் & இரத்தக் கசிவு' : 'Gums & Periodontal Care'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Transparency */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#134E4A] mb-3">
              {isTamil ? 'வழிசெலுத்தல்' : 'Navigation'}
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/explore" className="hover:text-[#0D9488] transition-colors">
                  {isTamil ? 'அனைத்து சிகிச்சைகளும்' : 'All Treatment Guides'}
                </Link>
              </li>
              <li>
                <Link href="/symptoms" className="hover:text-[#0D9488] transition-colors">
                  {isTamil ? 'அறிகுறிகள் பட்டியல்' : 'Symptom Directory'}
                </Link>
              </li>
              <li>
                <Link href="/emergency" className="hover:text-[#0D9488] transition-colors">
                  {isTamil ? 'அவசர சிகிச்சை வழிகாட்டி' : 'Emergency Guidance'}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Clinical Disclaimer Requirement */}
        <div className="py-6 border-t border-slate-100">
          <ClinicalDisclaimerBanner lang={language} />
        </div>

        <div className="text-center text-xs text-slate-400 pt-4 border-t border-slate-100">
          <p>© {new Date().getFullYear()} DentalVis 2.0. All visual guides are strictly for non-diagnostic educational use.</p>
        </div>
      </Container>
    </footer>
  );
}
