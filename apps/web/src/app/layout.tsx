import type { Metadata } from 'next';
import '../styles/globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LanguageProvider } from '@/context/LanguageContext';

export const metadata: Metadata = {
  title: 'DentalVis — Visual Dental Education Platform',
  description: 'Understand dental treatments, conditions, and oral anatomy clearly through interactive visual guides in English and Tamil.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans min-h-screen flex flex-col bg-gradient-to-b from-[#F5FAF9] via-[#E8F7F6]/60 to-[#F5FAF9] text-[#164B50] relative selection:bg-[#BFE9E2] selection:text-[#145B59]">
        {/* Global Ambient Luminance Canvas Behind Glass */}
        <div aria-hidden="true" className="fixed inset-0 pointer-events-none overflow-hidden -z-20">
          <div className="absolute -top-32 left-1/4 w-[42rem] h-[42rem] bg-gradient-to-br from-[#BFE9E2]/45 via-[#20B2AA]/15 to-transparent rounded-full blur-3xl opacity-80" />
          <div className="absolute top-1/3 -right-32 w-[38rem] h-[38rem] bg-gradient-to-bl from-[#DCEFF5]/70 via-[#20B2AA]/15 to-transparent rounded-full blur-3xl opacity-75" />
          <div className="absolute bottom-10 left-1/5 w-[36rem] h-[36rem] bg-[#DDF5F1]/55 rounded-full blur-3xl opacity-70" />
        </div>

        <LanguageProvider>
          {/* Accessible Skip Link for Keyboard Navigation */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#145B59] focus:text-white focus:rounded-xl focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#20B2AA] text-sm font-bold"
          >
            Skip to main content
          </a>
          <Navbar />
          <main id="main-content" className="flex-1 relative z-10">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
