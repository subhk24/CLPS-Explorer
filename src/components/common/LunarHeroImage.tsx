import React from 'react';

export interface LunarHeroImageProps {
  className?: string;
  onExploreDossier?: () => void;
}

/**
 * Authentic Lunar Surface Photographic & Cartographic Hero
 * Features high-contrast low-angle solar illumination of the lunar South Pole
 * (Malapert A crater rim), regolith relief, Earth in space, and landing coordinates.
 * Credit: NASA / LROC / Intuitive Machines / GSFC / ASU.
 */
export const LunarHeroImage: React.FC<LunarHeroImageProps> = ({
  className = '',
  onExploreDossier,
}) => {
  return (
    <div
      className={`relative w-full rounded-xl overflow-hidden border border-white/10 shadow-lg bg-black ${className}`}
    >
      {/* Plate Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-[#161616] border-b border-white/10 text-[11px] font-mono text-zinc-300">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" aria-hidden="true" />
          <span className="font-bold tracking-wider text-white">LROC NAC M1463385732R</span>
          <span className="hidden sm:inline text-zinc-400">• MALAPERT A CRATER RIM</span>
        </div>
        <span className="text-zinc-400 text-[10px] uppercase tracking-wider">
          LAT -80.1221° // LON +1.4395°
        </span>
      </div>

      {/* Lunar Surface Photographic SVG Plate */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden flex items-center justify-center">
        <svg
          viewBox="0 0 800 450"
          className="w-full h-full object-cover"
          role="img"
          aria-label="Photographic view of the lunar South Pole surface at Malapert A crater rim with low-angle sunlight, regolith textures, and Earth visible in the black lunar sky"
        >
          <defs>
            {/* Deep Space Gradient */}
            <linearGradient id="spaceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#020409" />
              <stop offset="55%" stopColor="#070C18" />
              <stop offset="65%" stopColor="#0B1322" />
            </linearGradient>

            {/* Solar Horizon Glow */}
            <radialGradient id="solarGlare" cx="85%" cy="58%" r="45%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="15%" stopColor="#FFE8B0" stopOpacity="0.6" />
              <stop offset="40%" stopColor="#93C5FD" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#070C18" stopOpacity="0" />
            </radialGradient>

            {/* Earth Atmosphere Gradient */}
            <radialGradient id="earthDisc" cx="40%" cy="40%" r="55%">
              <stop offset="0%" stopColor="#BAE6FD" />
              <stop offset="35%" stopColor="#0284C7" />
              <stop offset="70%" stopColor="#0369A1" />
              <stop offset="100%" stopColor="#082F49" />
            </radialGradient>

            {/* Crater High-Contrast Sunlit Rock Facets */}
            <linearGradient id="sunlitRim" x1="100%" y1="50%" x2="0%" y2="50%">
              <stop offset="0%" stopColor="#F1F5F9" />
              <stop offset="30%" stopColor="#CBD5E1" />
              <stop offset="60%" stopColor="#64748B" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>

            {/* Foreground Regolith Texture */}
            <linearGradient id="regolithGround" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#222B3D" />
              <stop offset="25%" stopColor="#171F2E" />
              <stop offset="60%" stopColor="#0F1522" />
              <stop offset="100%" stopColor="#080C14" />
            </linearGradient>

            {/* Subtle Star Pattern */}
            <pattern id="starDots" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="12" cy="18" r="0.8" fill="#FFFFFF" opacity="0.6" />
              <circle cx="78" cy="24" r="0.6" fill="#BAE6FD" opacity="0.5" />
              <circle cx="45" cy="62" r="0.7" fill="#FFFFFF" opacity="0.7" />
              <circle cx="92" cy="85" r="0.5" fill="#FFFFFF" opacity="0.4" />
              <circle cx="28" cy="91" r="0.6" fill="#FDE047" opacity="0.5" />
            </pattern>
          </defs>

          {/* 1. Deep Space Sky with Stars */}
          <rect width="800" height="280" fill="url(#spaceGradient)" />
          <rect width="800" height="280" fill="url(#starDots)" opacity="0.75" />

          {/* 2. Earth Hanging in Lunar Sky */}
          <g transform="translate(140, 75)">
            {/* Earth Glow */}
            <circle cx="0" cy="0" r="28" fill="#38BDF8" opacity="0.15" />
            <circle cx="0" cy="0" r="22" fill="#0284C7" opacity="0.25" />
            {/* Earth Body */}
            <circle cx="0" cy="0" r="18" fill="url(#earthDisc)" />
            {/* Cloud swirls on Earth */}
            <path
              d="M -12 -6 Q -4 -12 6 -8 Q 14 -4 16 2 Q 10 10 -2 8 Q -10 6 -12 -6 Z"
              fill="#FFFFFF"
              opacity="0.75"
            />
            <path
              d="M -6 4 Q 4 2 10 10 Q 4 14 -4 12 Z"
              fill="#FFFFFF"
              opacity="0.6"
            />
            {/* Earth Shadow (Crescent phase) */}
            <path
              d="M 0 -18 A 18 18 0 0 1 0 18 A 14 18 0 0 0 0 -18 Z"
              fill="#030712"
              opacity="0.85"
            />
            <text x="24" y="4" fill="#94A3B8" fontSize="9" fontFamily="monospace" letterSpacing="1">
              EARTH (384,400 KM)
            </text>
          </g>

          {/* 3. Solar Horizon Low-Angle Sun Flare */}
          <circle cx="680" cy="235" r="160" fill="url(#solarGlare)" />
          <circle cx="680" cy="235" r="8" fill="#FFFFFF" opacity="0.95" />
          <line x1="640" y1="235" x2="720" y2="235" stroke="#FFFFFF" strokeWidth="1" opacity="0.8" />
          <line x1="680" y1="195" x2="680" y2="275" stroke="#FFFFFF" strokeWidth="1" opacity="0.8" />

          {/* 4. Distant Lunar South Pole Mountain Ridge (Malapert Massif) */}
          <polygon
            points="0,250 80,242 160,230 240,238 340,225 450,235 560,215 640,228 720,220 800,240 800,270 0,270"
            fill="#1E293B"
          />
          {/* Sunlit peak facets */}
          <polygon
            points="335,225 380,232 450,235 480,245 420,248 340,242"
            fill="url(#sunlitRim)"
            opacity="0.7"
          />
          <polygon
            points="555,215 600,222 640,228 660,238 590,240 550,225"
            fill="url(#sunlitRim)"
            opacity="0.9"
          />

          {/* 5. Midground Crater Rim Complex (Malapert A Wall) */}
          <polygon
            points="0,265 110,255 220,268 360,252 500,260 620,248 740,258 800,250 800,320 0,320"
            fill="#141C2B"
          />
          {/* Razor-sharp solar rim crest */}
          <path
            d="M 0 265 Q 110 255 220 268 T 500 260 T 800 250"
            stroke="#94A3B8"
            strokeWidth="1.5"
            fill="none"
            opacity="0.85"
          />
          {/* Deep Long Shadows Cast by Low Polar Sun */}
          <polygon
            points="180,268 280,310 160,315 110,275"
            fill="#090D15"
          />
          <polygon
            points="460,262 580,315 420,320 380,270"
            fill="#090D15"
          />

          {/* 6. Foreground Polar Regolith Basin with Micro-Craters */}
          <polygon
            points="0,315 800,310 800,450 0,450"
            fill="url(#regolithGround)"
          />

          {/* Small Craters in Foreground */}
          <ellipse cx="260" cy="380" rx="42" ry="14" fill="#0A0E17" stroke="#334155" strokeWidth="1" />
          <path d="M 220 380 Q 260 394 300 380" stroke="#64748B" strokeWidth="1" fill="none" opacity="0.6" />

          <ellipse cx="610" cy="405" rx="55" ry="18" fill="#080C14" stroke="#334155" strokeWidth="1" />
          <path d="M 560 405 Q 610 422 662 405" stroke="#94A3B8" strokeWidth="1.2" fill="none" opacity="0.7" />

          {/* 7. Commercial Lander Silhouette (Nova-C / IM-1 Odysseus) */}
          <g transform="translate(460, 275)">
            {/* Touchdown coordinate crosshair */}
            <circle cx="0" cy="0" r="14" fill="none" stroke="#F59E0B" strokeWidth="1.2" strokeDasharray="2 2" />
            <circle cx="0" cy="0" r="3" fill="#F59E0B" />
            {/* Hexagonal Lander Body */}
            <polygon points="-8,-28 8,-28 12,-8 -12,-8" fill="#E2E8F0" stroke="#0F172A" strokeWidth="0.8" />
            {/* Solar Panel & High-Gain Antenna */}
            <line x1="0" y1="-28" x2="0" y2="-42" stroke="#94A3B8" strokeWidth="1.5" />
            <circle cx="0" cy="-42" r="3.5" fill="#38BDF8" />
            {/* Landing Legs */}
            <line x1="-10" y1="-10" x2="-22" y2="2" stroke="#CBD5E1" strokeWidth="1.8" />
            <line x1="10" y1="-10" x2="22" y2="2" stroke="#CBD5E1" strokeWidth="1.8" />
            <line x1="-22" y1="2" x2="-26" y2="2" stroke="#94A3B8" strokeWidth="2.5" />
            <line x1="22" y1="2" x2="26" y2="2" stroke="#94A3B8" strokeWidth="2.5" />
            {/* Sun Glint on Lander Multi-Layer Insulation (MLI) */}
            <circle cx="4" cy="-20" r="2.5" fill="#FFFFFF" />

            {/* Lander HUD Annotation */}
            <g transform="translate(28, -25)">
              <rect x="0" y="-12" width="135" height="26" fill="#161616" rx="3" stroke="#333333" strokeWidth="1" />
              <text x="6" y="0" fill="#FFFFFF" fontSize="9" fontFamily="monospace" fontWeight="bold">
                IM-1 TOUCHDOWN
              </text>
              <text x="6" y="9" fill="#A1A1AA" fontSize="7.5" fontFamily="monospace">
                80.1221°S, 1.4395°E
              </text>
            </g>
          </g>

          {/* Compass / Coordinate HUD Frame */}
          <g transform="translate(24, 420)">
            <text fill="#64748B" fontSize="9" fontFamily="JetBrains Mono, monospace">
              ELEVATION: -3,607 M • SOUTH POLE CORRIDOR
            </text>
          </g>
          <g transform="translate(680, 420)">
            <text fill="#64748B" fontSize="9" fontFamily="JetBrains Mono, monospace" textAnchor="end">
              NORTH ↑ 12.4°
            </text>
          </g>
        </svg>

        {/* Hover / Click Overlay to Explore Dossier */}
        {onExploreDossier && (
          <button
            type="button"
            onClick={onExploreDossier}
            className="absolute bottom-3 right-3 px-3 py-1.5 rounded-md bg-[#E03C31] hover:bg-[#c42d23] text-white text-xs font-semibold shadow-md backdrop-blur-sm transition-all flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <span>Open TO2-IM Dossier</span>
            <span aria-hidden="true">→</span>
          </button>
        )}
      </div>

      {/* Plate Footer Attribution */}
      <div className="px-3.5 py-2 bg-[#161616] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-zinc-300 gap-1">
        <span className="font-sans">
          <strong>Imagery & Selenography:</strong> NASA Lunar Reconnaissance Orbiter Camera (LROC) / ASU / GSFC / Intuitive Machines
        </span>
        <span className="font-mono text-[10px] text-zinc-400">
          Public Domain • NASA Science Mission Directorate
        </span>
      </div>
    </div>
  );
};
