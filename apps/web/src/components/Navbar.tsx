'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Container, Button } from '@dentalvis/ui';
import { Globe, Menu, X, Compass, AlertTriangle, ShieldCheck, Home } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { DentalVisLogo } from './DentalVisLogo';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, toggleLanguage } = useLanguage();
  const pathname = usePathname();

  // Root welcome page has strictly no navigation
  if (pathname === '/') {
    return null;
  }

  const isTamil = language === 'ta';

  const navLinks = [
    { href: '/home', labelEn: 'Home', labelTa: 'முகப்பு', icon: Home },
    { href: '/explore', labelEn: 'Explore Treatments', labelTa: 'சிகிச்சைகள்', icon: Compass },
    { href: '/symptoms', labelEn: 'Symptoms', labelTa: 'அறிகுறிகள்', icon: AlertTriangle },
    { href: '/emergency', labelEn: 'Emergency Care', labelTa: 'அவசர சிகிச்சை', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-50 glass-nav transition-all duration-300">
      <Container>
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo with supplied icon artwork */}
          <DentalVisLogo variant="full" size="md" linkHref="/home" />

          {/* Desktop Navigation Links (Floating Glass Pill Strip) */}
          <nav className="hidden md:flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/50 backdrop-blur-md border border-white/80 shadow-[0_2px_12px_rgba(22,75,80,0.04)]">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.href === '/home'
                  ? pathname === '/home'
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#247F83] to-[#164B50] text-white shadow-sm'
                      : 'text-[#164B50] hover:bg-[#D9F0ED]/70 hover:text-[#247F83]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{isTamil ? link.labelTa : link.labelEn}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action & Language Selector */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              aria-label={isTamil ? 'Switch to English' : 'தமிழுக்கு மாறவும்'}
              className="gap-2 font-bold"
            >
              <Globe className="w-4 h-4 text-[#247F83]" />
              <span>{isTamil ? 'English' : 'தமிழ்'}</span>
            </Button>

            <Link href="/explore">
              <Button size="sm" variant="primary">
                {isTamil ? 'வழிகாட்டிகள்' : 'Explore'}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="px-2.5 py-1 text-xs gap-1"
            >
              <Globe className="w-3.5 h-3.5 text-[#247F83]" />
              <span>{isTamil ? 'EN' : 'தமிழ்'}</span>
            </Button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#164B50] bg-white/70 border border-[#DCEAEC] shadow-sm hover:bg-[#D9F0ED]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#DCEAEC] space-y-2 glass-panel mt-2 rounded-2xl p-4 animate-in fade-in-50 duration-200">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.href === '/home'
                  ? pathname === '/home'
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold ${
                    isActive
                      ? 'bg-gradient-to-r from-[#247F83] to-[#164B50] text-white shadow-sm'
                      : 'text-[#164B50] hover:bg-[#D9F0ED]'
                  }`}
                >
                  <Icon className="w-5 h-5 text-[#247F83]" />
                  <span>{isTamil ? link.labelTa : link.labelEn}</span>
                </Link>
              );
            })}
            <div className="pt-2">
              <Link href="/explore" onClick={() => setMobileMenuOpen(false)} className="block">
                <Button className="w-full" variant="primary">
                  {isTamil ? 'சிகிச்சைகளை காண்க' : 'Explore Treatments'}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}
