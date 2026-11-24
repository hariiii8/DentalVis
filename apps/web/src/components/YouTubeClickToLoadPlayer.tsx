'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Play, Volume2, ShieldAlert } from 'lucide-react';
import { Badge } from '@dentalvis/ui';

interface YouTubeClickToLoadPlayerProps {
  videoId: string;
  title: string;
  thumbnailUrl: string;
  durationText?: string;
  disclaimerEn?: string;
  disclaimerTa?: string;
  lang?: 'en' | 'ta';
}

export function YouTubeClickToLoadPlayer({
  videoId,
  title,
  thumbnailUrl,
  durationText = '2:45 min',
  lang = 'en',
}: YouTubeClickToLoadPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleStartPlay = () => {
    setIsPlaying(true);
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-teal-100 bg-white shadow-md transition-all">
      <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
        {isPlaying ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(
              videoId
            )}?autoplay=1&rel=0&modestbranding=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        ) : (
          <div className="relative w-full h-full group">
            {/* Thumbnail Image */}
            <Image
              src={thumbnailUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-90"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />

            {/* Dark Healthcare Scrim Overlay */}
            <div className="absolute inset-0 bg-[#134E4A]/80 backdrop-blur-[2px] flex flex-col justify-between p-6">
              <div className="flex items-center justify-between">
                <Badge variant="mint" className="text-xs">
                  {lang === 'ta' ? 'மருத்துவக் கல்வி வீடியோ' : 'Educational Clinical Video'}
                </Badge>
                <span className="text-xs font-medium text-white/80 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                  {durationText}
                </span>
              </div>

              {/* Play Button & Consent Trigger */}
              <div className="flex flex-col items-center justify-center my-auto text-center">
                <button
                  type="button"
                  onClick={handleStartPlay}
                  aria-label={lang === 'ta' ? `${title} வீடியோவை இயக்கவும்` : `Play video for ${title}`}
                  className="w-16 h-16 rounded-full bg-white text-[#0D9488] flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-4 focus:ring-teal-400"
                >
                  <Play className="w-8 h-8 fill-[#0D9488] ml-1" />
                </button>
                <p className="text-sm font-bold text-white mt-3 drop-shadow">
                  {lang === 'ta' ? 'வீடியோவை இயக்க கிளிக் செய்யவும்' : 'Click to Load & Watch Video'}
                </p>
                <p className="text-[11px] text-teal-100/90 max-w-xs mt-1">
                  {lang === 'ta'
                    ? 'தனியுரிமை அறிவிப்பு: நீங்கள் கிளிக் செய்யும் போது மட்டுமே யூடியூப் மீடியா ஸ்கிரிப்ட்டுகள் இயக்கப்படும். யூடியூப் தனது சேவையின் கீழ் குக்கீகளைப் பயன்படுத்தக்கூடும்.'
                    : 'Third-party media notice: Video player scripts are loaded only after clicking. YouTube may set cookies and collect usage data according to its privacy policy.'}
                </p>
              </div>

              <div className="flex items-center gap-2 text-white/70 text-xs">
                <Volume2 className="w-3.5 h-3.5 text-teal-200" />
                <span>{lang === 'ta' ? 'ஆடியோ விளக்கம் சேர்க்கப்பட்டுள்ளது' : 'Audio commentary included'}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer bar */}
      <div className="p-3.5 bg-teal-50/70 border-t border-teal-100 flex items-center justify-between text-xs text-[#134E4A]">
        <div className="flex items-center gap-2 font-medium">
          <ShieldAlert className="w-3.5 h-3.5 text-[#0D9488]" />
          <span>{lang === 'ta' ? 'கல்வி நோக்கம் மட்டுமே' : 'Patient Education Only'}</span>
        </div>
        <span className="text-slate-500">
          {isPlaying
            ? (lang === 'ta' ? 'வீடியோ இயக்கப்படுகிறது' : 'Playing YouTube embed')
            : (lang === 'ta' ? 'கிளிக் செய்ய காத்திருக்கிறது' : 'Click-to-load active')}
        </span>
      </div>
    </div>
  );
}
