import React, { useState } from 'react';
import type { ImageRecord, ImageType } from '../../data/imagery';
import { ExternalLink, Camera, Sparkles, Orbit, Compass } from 'lucide-react';

export interface ScientificImageCardProps {
  image: ImageRecord;
  className?: string;
  aspectRatio?: 'video' | 'square' | 'wide';
  showCaption?: boolean;
}

const typeLabels: Record<ImageType, { label: string; icon: React.FC<{ className?: string }> }> = {
  photograph: { label: 'NASA Photograph', icon: Camera },
  artists_concept: { label: "Artist's Concept", icon: Sparkles },
  rendering: { label: '3D Technical Model', icon: Orbit },
  scientific_visualization: { label: 'Scientific Visualization', icon: Compass },
};

export const ScientificImageCard: React.FC<ScientificImageCardProps> = ({
  image,
  className = '',
  aspectRatio = 'video',
  showCaption = true,
}) => {
  const [imgError, setImgError] = useState(false);
  const TypeIcon = typeLabels[image.imageType]?.icon || Camera;
  const typeText = typeLabels[image.imageType]?.label || 'NASA Imagery';

  const aspectClasses = {
    video: 'aspect-[16/9]',
    square: 'aspect-square',
    wide: 'aspect-[21/9]',
  };

  return (
    <div className={`overflow-hidden rounded-xl border border-white/10 bg-[#111111] shadow-sm flex flex-col ${className}`}>
      {/* Top Media Container */}
      <div className={`relative w-full ${aspectClasses[aspectRatio]} bg-[#070B14] overflow-hidden flex items-center justify-center`}>
        {/* Render real image if URL exists and has not errored */}
        {image.imageUrl && !imgError ? (
          <img
            src={image.imageUrl}
            alt={image.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        ) : (
          /* Resilient, authentic vector technical illustration fallback */
          <div className="w-full h-full relative flex items-center justify-center p-4 bg-gradient-to-b from-[#181818] to-black">
            <svg
              viewBox="0 0 400 225"
              className="w-full h-full text-slate-600"
              role="img"
              aria-label={image.title}
            >
              <defs>
                <pattern id="cardGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1E293B" strokeWidth="0.5" strokeOpacity="0.4" />
                </pattern>
                <radialGradient id="cardGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#333333" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#070B14" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect width="400" height="225" fill="url(#cardGrid)" />
              <circle cx="200" cy="112" r="90" fill="url(#cardGlow)" />

              {image.fallbackSvgType === 'lander' && (
                <g transform="translate(200, 120)">
                  {/* Lander profile */}
                  <polygon points="-30,10 30,10 20,-30 -20,-30" fill="#CBD5E1" stroke="#334155" strokeWidth="1.5" />
                  <line x1="-30" y1="10" x2="-45" y2="35" stroke="#94A3B8" strokeWidth="2.5" />
                  <line x1="30" y1="10" x2="45" y2="35" stroke="#94A3B8" strokeWidth="2.5" />
                  <line x1="-45" y1="35" x2="-52" y2="35" stroke="#64748B" strokeWidth="3" />
                  <line x1="45" y1="35" x2="52" y2="35" stroke="#64748B" strokeWidth="3" />
                  <line x1="0" y1="-30" x2="0" y2="-48" stroke="#FFFFFF" strokeWidth="2" />
                  <circle cx="0" cy="-48" r="4" fill="#E03C31" />
                  <circle cx="0" cy="0" r="14" fill="#181818" stroke="#FFFFFF" strokeWidth="1" />
                  <text x="0" y="3" fill="#FFFFFF" fontSize="7" fontFamily="monospace" textAnchor="middle">NASA</text>
                  <line x1="-120" y1="35" x2="120" y2="35" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />
                </g>
              )}

              {image.fallbackSvgType === 'crater' && (
                <g transform="translate(200, 115)">
                  <ellipse cx="0" cy="0" rx="110" ry="50" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
                  <ellipse cx="0" cy="0" rx="80" ry="36" fill="#0A0E17" stroke="#475569" strokeWidth="1.5" />
                  <ellipse cx="0" cy="2" rx="40" ry="18" fill="#070B14" stroke="#64748B" strokeWidth="1" />
                  <circle cx="0" cy="0" r="3" fill="#F59E0B" />
                  <line x1="0" y1="-8" x2="0" y2="-22" stroke="#F59E0B" strokeWidth="1.2" />
                  <text x="0" y="-26" fill="#F8FAFC" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">TOUCHDOWN TARGET</text>
                </g>
              )}

              {image.fallbackSvgType === 'payload' && (
                <g transform="translate(200, 112)">
                  <rect x="-40" y="-30" width="80" height="60" rx="6" fill="#0F172A" stroke="#334155" strokeWidth="2" />
                  <circle cx="0" cy="0" r="18" fill="#1E293B" stroke="#FFFFFF" strokeWidth="1.5" />
                  <line x1="-18" y1="0" x2="18" y2="0" stroke="#FFFFFF" strokeWidth="1" />
                  <line x1="0" y1="-18" x2="0" y2="18" stroke="#FFFFFF" strokeWidth="1" />
                  <circle cx="0" cy="0" r="3" fill="#10B981" />
                  <rect x="-32" y="-24" width="8" height="8" rx="1" fill="#FFFFFF" />
                  <rect x="24" y="-24" width="8" height="8" rx="1" fill="#F59E0B" />
                </g>
              )}

              {image.fallbackSvgType === 'rover' && (
                <g transform="translate(200, 120)">
                  <rect x="-35" y="-20" width="70" height="30" rx="4" fill="#CBD5E1" stroke="#334155" strokeWidth="1.5" />
                  <circle cx="-25" cy="18" r="10" fill="#334155" stroke="#94A3B8" strokeWidth="2" />
                  <circle cx="0" cy="18" r="10" fill="#334155" stroke="#94A3B8" strokeWidth="2" />
                  <circle cx="25" cy="18" r="10" fill="#334155" stroke="#94A3B8" strokeWidth="2" />
                  <line x1="-20" y1="-20" x2="-20" y2="-38" stroke="#334155" strokeWidth="2" />
                  <circle cx="-20" cy="-38" r="4" fill="#E03C31" />
                  <line x1="-120" y1="28" x2="120" y2="28" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />
                </g>
              )}
            </svg>
          </div>
        )}

        {/* Type Badge Floating on Top Left */}
        <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-sm border border-white/20 text-white text-[10px] font-mono font-semibold flex items-center gap-1 shadow-sm">
          <TypeIcon className="w-3 h-3 text-zinc-300" />
          <span>{typeText}</span>
        </div>

        {/* Source Link Floating on Top Right */}
        {image.sourceUrl && (
          <a
            href={image.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`NASA source for ${image.title}`}
            className="absolute top-2.5 right-2.5 p-1 rounded-md bg-black/80 hover:bg-[#E03C31] backdrop-blur-sm border border-white/20 text-white transition-colors shadow-sm"
          >
            <ExternalLink className="w-3 h-3" aria-hidden="true" />
          </a>
        )}
      </div>

      {/* Caption & Attribution Body */}
      {showCaption && (
        <div className="p-3.5 space-y-1.5 text-xs text-white bg-[#111111]">
          <h4 className="font-heading font-bold text-sm text-white">{image.title}</h4>
          <p className="text-zinc-300 text-xs leading-relaxed font-sans line-clamp-2">
            {image.caption}
          </p>
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span className="truncate">Credit: <strong className="text-white font-medium">{image.credit}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
};
