'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Container, Button, LiquidGlassSurface } from '@dentalvis/ui';
import { Globe, Menu, X, Compass, AlertTriangle, Home } from 'lucide-react';
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
  ];

  return (
    <header className="sticky top-0 z-50 glass-nav transition-all duration-300">
      <Container>
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo with supplied icon artwork */}
          <DentalVisLogo variant="full" size="md" linkHref="/home" />

          {/* Desktop Navigation Links (Floating Liquid Glass Lens Strip) */}
          <nav className="hidden md:flex items-center gap-1.5 p-1.5 rounded-2xl liquid-glass-lens isolate">
            <div aria-hidden="true" className="liquid-refractive-rim absolute inset-0 rounded-2xl pointer-events-none" />
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
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 relative z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#20B2AA] ${
                    isActive
                      ? 'bg-gradient-to-r from-[#20B2AA] to-[#145B59] text-white shadow-sm'
                      : 'text-[#145B59] hover:bg-[#DDF5F1]/80 hover:text-[#20B2AA]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{isTamil ? link.labelTa : link.labelEn}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action & Language Selector */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="glass"
              size="sm"
              onClick={toggleLanguage}
              aria-label={isTamil ? 'Switch to English' : 'தமிழுக்கு மாறவும்'}
              className="gap-2 font-bold liquid-glass-lens"
            >
              <Globe className="w-4 h-4 text-[#20B2AA]" />
              <span>{isTamil ? 'English' : 'தமிழ்'}</span>
            </Button>

            <Link href="/explore">
              <Button size="sm" variant="mint" className="font-bold text-[#145B59]">
                {isTamil ? 'வழிகாட்டிகள்' : 'Explore'}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="glass"
              size="sm"
              onClick={toggleLanguage}
              className="px-2.5 py-1 text-xs gap-1 liquid-glass-lens"
            >
              <Globe className="w-3.5 h-3.5 text-[#20B2AA]" />
              <span>{isTamil ? 'EN' : 'தமிழ்'}</span>
            </Button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#164B50] liquid-glass-lens border border-[#C8E7E3] shadow-xs hover:bg-[#DDF5F1] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#20B2AA]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown in Cohesive Liquid Glass */}
        {mobileMenuOpen && (
          <LiquidGlassSurface
            variant="primary"
            specular
            refractiveRim
            className="md:hidden mt-2 p-4 space-y-2 rounded-2xl animate-in fade-in-50 duration-200 border border-white/90 shadow-lg"
          >
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
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#20B2AA] ${
                    isActive
                      ? 'bg-gradient-to-r from-[#20B2AA] to-[#145B59] text-white shadow-sm'
                      : 'text-[#145B59] hover:bg-[#DDF5F1]/80'
                  }`}
                >
                  <Icon className="w-5 h-5 text-[#20B2AA]" />
                  <span>{isTamil ? link.labelTa : link.labelEn}</span>
                </Link>
              );
            })}
            <div className="pt-2">
              <Link href="/explore" onClick={() => setMobileMenuOpen(false)} className="block">
                <Button className="w-full font-bold shadow-sm" variant="primary">
                  {isTamil ? 'சிகிச்சைகளை காண்க' : 'Explore Treatments'}
                </Button>
              </Link>
            </div>
          </LiquidGlassSurface>
        )}
      </Container>
    </header>
  );
}
