import type { Metadata } from 'next';
import { Inter, Noto_Sans_Tamil } from 'next/font/google';
import '../styles/globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const notoSansTamil = Noto_Sans_Tamil({
  subsets: ['tamil'],
  display: 'swap',
  variable: '--font-noto-tamil',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'DentalVis 2.0 — Visual Dental Education Platform',
  description: 'Understand dental treatments, conditions, and oral anatomy clearly through interactive visual guides in English and Tamil.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${notoSansTamil.variable}`}>
      <body className="font-sans min-h-screen flex flex-col bg-[#F8FBFA] text-[#173F3B]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
