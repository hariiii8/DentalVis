'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Container, ClinicalDisclaimerBanner } from '@dentalvis/ui';
import { Heart } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { DentalVisLogo } from './DentalVisLogo';

export function Footer() {
  const pathname = usePathname();
  const { language } = useLanguage();

  // Root welcome page has strictly no footer
  if (pathname === '/') {
    return null;
  }

  const isTamil = language === 'ta';

  return (
    <footer className="bg-gradient-to-b from-[#EAF5F8] to-[#D9F0ED]/60 border-t border-[#DCEAEC] pt-14 pb-10 mt-24">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-2">
            <DentalVisLogo variant="full" size="md" linkHref="/home" />
            <p className="text-sm text-[#64777C] max-w-md leading-relaxed mt-2">
              {isTamil
                ? 'பல் மருத்துவ பயங்களை நீக்கி, தெளிவான காட்சி வழிகாட்டிகள் மூலம் அறிவை மேம்படுத்துதல். வாய் உடற்கூறியல், பல் பிரச்சினைகள் மற்றும் சிகிச்சை முறைகளை விளக்கும் இருமொழி கல்வித் தளம்.'
                : 'Dismantling dental anxiety through crystal-clear visual clarity. Bilingual, interactive education explaining oral anatomy, dental conditions, and treatment procedures.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-[#64777C] font-semibold pt-2">
              <span>{isTamil ? 'நோயாளி நல்வாழ்வு மற்றும் மருத்துவப் புரிதலுக்காக உருவாக்கப்பட்டது' : 'Crafted for patient comfort & medical understanding'}</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            </div>
          </div>

          {/* Patient Exploration */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#164B50] mb-3">
              {isTamil ? 'சிகிச்சைப் பிரிவுகள்' : 'Explore Treatments'}
            </h4>
            <ul className="space-y-2 text-sm text-[#64777C]">
              <li>
                <Link href="/explore/pain-and-sensitivity" className="hover:text-[#247F83] transition-colors font-medium">
                  {isTamil ? 'பல் வலி & கூச்சம்' : 'Pain & Sensitivity'}
                </Link>
              </li>
              <li>
                <Link href="/explore/broken-or-chipped-teeth" className="hover:text-[#247F83] transition-colors font-medium">
                  {isTamil ? 'உடைந்த & விரிசல் பற்கள்' : 'Broken or Chipped Teeth'}
                </Link>
              </li>
              <li>
                <Link href="/explore/missing-teeth" className="hover:text-[#247F83] transition-colors font-medium">
                  {isTamil ? 'இழந்த பற்கள் & இம்ப்ளான்ட்' : 'Missing Teeth & Implants'}
                </Link>
              </li>
              <li>
                <Link href="/explore/gums-and-bleeding" className="hover:text-[#247F83] transition-colors font-medium">
                  {isTamil ? 'ஈறுகள் & இரத்தக் கசிவு' : 'Gums & Periodontal Care'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#164B50] mb-3">
              {isTamil ? 'வழிசெலுத்தல்' : 'Navigation'}
            </h4>
            <ul className="space-y-2 text-sm text-[#64777C]">
              <li>
                <Link href="/home" className="hover:text-[#247F83] transition-colors font-medium">
                  {isTamil ? 'முகப்பு பக்கம்' : 'Home Portal'}
                </Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-[#247F83] transition-colors font-medium">
                  {isTamil ? 'அனைத்து சிகிச்சைகளும்' : 'All Treatment Guides'}
                </Link>
              </li>
              <li>
                <Link href="/symptoms" className="hover:text-[#247F83] transition-colors font-medium">
                  {isTamil ? 'அறிகுறிகள் பட்டியல்' : 'Symptom Directory'}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Clinical Disclaimer Banner */}
        <div className="py-6 border-t border-[#DCEAEC]">
          <ClinicalDisclaimerBanner lang={language} />
        </div>

        <div className="text-center text-xs text-[#64777C] pt-4 border-t border-[#DCEAEC]">
          <p>© {new Date().getFullYear()} DentalVis. Visual dental guides are strictly educational.</p>
        </div>
      </Container>
    </footer>
  );
}
