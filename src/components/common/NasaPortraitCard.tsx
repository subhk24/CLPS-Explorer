import React, { useState } from 'react';
import { NasaRedArrow } from './NasaRedArrow';

export interface NasaPortraitCardProps {
  title: string;
  subtitle?: string;
  category?: string;
  imageUrl?: string;
  aspectRatio?: 'portrait' | 'tall' | 'square';
  onClick: () => void;
  className?: string;
  ariaLabel?: string;
}

export const NasaPortraitCard: React.FC<NasaPortraitCardProps> = ({
  title,
  subtitle,
  category,
  imageUrl,
  aspectRatio = 'portrait',
  onClick,
  className = '',
  ariaLabel,
}) => {
  const [imgError, setImgError] = useState(false);

  const aspectClasses = {
    portrait: 'aspect-[3/4]',
    tall: 'aspect-[4/5]',
    square: 'aspect-square',
  };

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
      aria-label={ariaLabel || `${title} - Click to open dossier details`}
      className={`group relative overflow-hidden rounded-none sm:rounded-sm cursor-pointer select-none border border-white/5 bg-[#0a0a0a] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${aspectClasses[aspectRatio]} ${className}`}
    >
      {/* Background Photography with subtle zoom on hover */}
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-black">
        {imageUrl && !imgError ? (
          <img
            src={imageUrl}
            alt={title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center filter contrast-[1.05] brightness-95 transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1c1c1e] to-[#050505]">
            <div className="text-zinc-600 font-mono text-xs uppercase tracking-widest">
              NASA CLPS
            </div>
          </div>
        )}

        {/* Cinematic NASA Skrim Overlays */}
        {/* Dark vignette from bottom to top for maximum text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-95" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black to-transparent" />
      </div>

      {/* Optional Top Category Tag */}
      {category && (
        <div className="absolute top-4 left-4 z-10">
          <span className="inline-block px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest font-bold text-white/90 bg-black/60 border border-white/20 backdrop-blur-sm rounded-sm">
            {category}
          </span>
        </div>
      )}

      {/* Content Positioned Near Bottom (NASA.gov Official Style) */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-6 flex flex-col justify-end space-y-1.5">
        {subtitle && (
          <span className="text-[11px] font-mono text-[#38BDF8] uppercase tracking-wider font-semibold line-clamp-1">
            {subtitle}
          </span>
        )}

        <div className="flex items-center justify-between gap-3 pt-0.5">
          <h3 className="font-heading font-bold text-xl sm:text-2xl text-white tracking-tight leading-tight group-hover:text-white transition-colors">
            {title}
          </h3>
          <NasaRedArrow size="md" className="shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </article>
  );
};
