import React, { useState } from 'react';
import { NasaRedArrow } from './NasaRedArrow';

export interface NasaFeatureCardProps {
  title: string;
  category?: string;
  summary: string;
  imageUrl?: string;
  metadata?: string;
  onClick: () => void;
  className?: string;
}

export const NasaFeatureCard: React.FC<NasaFeatureCardProps> = ({
  title,
  category,
  summary,
  imageUrl,
  metadata,
  onClick,
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label={`${title} - Click to open dossier details`}
      className={`group relative overflow-hidden bg-[#111111] hover:bg-[#161616] border border-white/10 hover:border-white/25 rounded-xl cursor-pointer transition-all duration-300 shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${className}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
        {/* Left / Top Photography (7 cols on desktop) */}
        <div className="lg:col-span-7 relative min-h-[260px] sm:min-h-[320px] lg:min-h-[380px] overflow-hidden bg-black">
          {imageUrl && !imgError ? (
            <img
              src={imageUrl}
              alt={title}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover object-center filter contrast-105 transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-black to-zinc-900 text-zinc-600 font-mono text-xs">
              NASA CLPS EXPLORATION
            </div>
          )}

          {/* Side vignette to blend with content */}
          <div className="hidden lg:block absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#111111] to-transparent pointer-events-none" />
          <div className="lg:hidden absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#111111] to-transparent pointer-events-none" />
        </div>

        {/* Right / Bottom Content (5 cols on desktop) */}
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            {category && (
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E03C31]" />
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#38BDF8] font-bold">
                  {category}
                </span>
              </div>
            )}

            <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight leading-tight group-hover:text-white transition-colors">
              {title}
            </h3>

            {metadata && (
              <p className="text-xs font-mono text-zinc-400">
                {metadata}
              </p>
            )}

            <p className="text-sm text-zinc-300 leading-relaxed font-sans line-clamp-3">
              {summary}
            </p>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-white font-bold group-hover:underline">
              Inspect Mission Dossier
            </span>
            <NasaRedArrow size="md" className="transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </article>
  );
};
