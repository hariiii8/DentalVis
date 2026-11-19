'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Container, Button } from '@dentalvis/ui';
import { Sparkles, Globe, Menu, X, Compass, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, toggleLanguage } = useLanguage();
  const pathname = usePathname();

  const isTamil = language === 'ta';

  const navLinks = [
    { href: '/explore', labelEn: 'Explore Treatments', labelTa: 'சிகிச்சைகள்', icon: Compass },
    { href: '/symptoms', labelEn: 'Common Symptoms', labelTa: 'அறிகுறிகள்', icon: AlertTriangle },
    { href: '/emergency', labelEn: 'Emergency Care', labelTa: 'அவசர சிகிச்சை', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#F8FBFA]/90 backdrop-blur-md border-b border-teal-900/10 transition-all">
      <Container>
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0D9488] to-[#134E4A] flex items-center justify-center text-white shadow-md shadow-teal-700/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-teal-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-[#134E4A]">DentalVis</span>
                <span className="text-xs bg-teal-100/80 text-[#0D9488] px-1.5 py-0.5 rounded-full font-semibold">2.0</span>
              </div>
              <p className="text-[11px] text-teal-800/70 font-medium">
                {isTamil ? 'தெளிவான பல் மருத்துவக் கல்வி' : 'Visual Dental Education'}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-teal-100/60 text-[#0D9488] font-bold'
                      : 'text-[#173F3B] hover:bg-teal-50/80 hover:text-[#0D9488]'
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
              className="gap-2 border-teal-200/80 hover:bg-teal-50 text-[#134E4A] font-semibold"
            >
              <Globe className="w-4 h-4 text-[#0D9488]" />
              <span>{isTamil ? 'English' : 'தமிழ்'}</span>
            </Button>

            <Link href="/explore">
              <Button size="sm" className="bg-[#0D9488] hover:bg-[#0f766e] text-white shadow-sm">
                {isTamil ? 'ஆரம்பிக்கலாம்' : 'Start Exploring'}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="px-2.5 py-1 text-xs gap-1 border-teal-200"
            >
              <Globe className="w-3.5 h-3.5 text-[#0D9488]" />
              <span>{isTamil ? 'EN' : 'தமிழ்'}</span>
            </Button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#134E4A] hover:bg-teal-50"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-teal-900/10 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium ${
                    isActive
                      ? 'bg-teal-100/60 text-[#0D9488] font-bold'
                      : 'text-[#173F3B] hover:bg-teal-50'
                  }`}
                >
                  <Icon className="w-5 h-5 text-[#0D9488]" />
                  <span>{isTamil ? link.labelTa : link.labelEn}</span>
                </Link>
              );
            })}
            <div className="pt-2 px-2">
              <Link href="/explore" onClick={() => setMobileMenuOpen(false)} className="block">
                <Button className="w-full bg-[#0D9488] text-white">
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
