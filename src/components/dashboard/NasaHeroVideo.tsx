import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Play, Pause, ArrowRight, Globe, Rocket, AlertCircle } from 'lucide-react';
import { Container } from '../common/Container';
import { NasaRedArrow } from '../common/NasaRedArrow';
import type { Mission } from '../../types';

export interface NasaHeroVideoProps {
  onExploreMissions: () => void;
  onExploreMap: () => void;
  onOpenMissionDetail: (mission: Mission) => void;
  featuredMissions: Mission[];
  isActive?: boolean;
}

export const NasaHeroVideo: React.FC<NasaHeroVideoProps> = ({
  onExploreMissions,
  onExploreMap,
  onOpenMissionDetail,
  featuredMissions,
  isActive = true,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isAutoplayBlocked, setIsAutoplayBlocked] = useState<boolean>(false);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [hasLoadedData, setHasLoadedData] = useState<boolean>(false);

  // Attempt to play with browser autoplay policy handling
  const safePlay = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = true;
    const playPromise = videoRef.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setIsAutoplayBlocked(false);
        })
        .catch(() => {
          // Browser prevented autoplay without user interaction.
          // CRITICAL: DO NOT replace the video with any image! Keep video element ready.
          setIsPlaying(false);
          setIsAutoplayBlocked(true);
        });
    }
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        setIsAutoplayBlocked(false);
      }).catch(() => {
        setIsPlaying(false);
      });
    }
  };

  // Enforce autoplay on mount, page reload, and tab activation
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Hard-set muted & inline flags required by iOS Safari / Chrome autoplay policies
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    if (isActive) {
      safePlay();
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, [isActive, safePlay]);

  // Global user-gesture unlock for autoplay-restricted browsers
  useEffect(() => {
    const handleFirstGesture = () => {
      if (videoRef.current && (videoRef.current.paused || isAutoplayBlocked)) {
        safePlay();
      }
    };

    window.addEventListener('click', handleFirstGesture, { once: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
    };
  }, [isAutoplayBlocked, safePlay]);

  // Handle visibility change (tab switching in browser) and back/forward browser navigation
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isActive) {
        safePlay();
      }
    };

    const handlePopState = () => {
      if (isActive) {
        safePlay();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isActive, safePlay]);

  // Featured 3 missions for ticker
  const topFeatured = featuredMissions.slice(0, 3);

  return (
    <section
      className="relative w-full min-h-[620px] sm:min-h-[700px] lg:min-h-[780px] bg-[#020409] text-white overflow-hidden flex flex-col justify-between select-none"
      aria-label="NASA Commercial Lunar Payload Services Hero"
    >
      {/* 1. CINEMATIC OFFICIAL NASA VIDEO BACKGROUND */}
      {/* Deep space base layer to prevent any white flash or unrelated static image */}
      <div className="absolute inset-0 w-full h-full bg-[#020409] overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onLoadedData={() => setHasLoadedData(true)}
          onCanPlay={() => {
            setHasLoadedData(true);
            setIsBuffering(false);
          }}
          onWaiting={() => setIsBuffering(true)}
          onPlaying={() => {
            setIsBuffering(false);
            setIsPlaying(true);
            setIsAutoplayBlocked(false);
          }}
          onPause={() => setIsPlaying(false)}
          className={`w-full h-full object-cover object-center scale-[1.02] filter contrast-105 transition-opacity duration-700 ${
            hasLoadedData ? 'opacity-100' : 'opacity-80'
          }`}
          aria-label="NASA Lunar Exploration flight trajectory video background"
        >
          <source src="/videos/nasa-hero.mp4" type="video/mp4" />
        </video>

        {/* 2. NASA.GOV VIGNETTE & SKRIM OVERLAYS */}
        {/* Left Dark Skrim for Razor-Sharp Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-black/30 pointer-events-none" />
        {/* Bottom Fade to blend seamlessly with subsequent sections */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />
        {/* Top Fade from Navbar */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#000000]/80 to-transparent pointer-events-none" />
      </div>

      {/* TOP BADGE & TELEMETRY HUD INSIDE HERO */}
      <div className="relative z-10 pt-6">
        <Container size="xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/70 border border-white/20 backdrop-blur-md text-xs font-mono text-white shadow-lg">
              <span className="w-2 h-2 rounded-full bg-[#E03C31] animate-pulse" />
              <span className="font-bold tracking-wider uppercase">CLPS Lunar Exploration • Flight Video Stream</span>
            </div>

            {/* Video HUD status indicator */}
            <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded bg-black/60 border border-white/10 text-[11px] font-mono text-slate-300 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>NASA GSFC TELEMETRY // 1080P ACTIVE</span>
            </div>
          </div>
        </Container>
      </div>

      {/* 3. HERO CONTENT: NASA.GOV TYPOGRAPHY & CALL-TO-ACTIONS */}
      <div className="relative z-10 py-12 sm:py-16 my-auto">
        <Container size="xl">
          <div className="max-w-2xl lg:max-w-3xl space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2">
                <span className="h-[2px] w-6 bg-[#E03C31]" />
                <span className="text-xs sm:text-sm font-mono uppercase tracking-[0.25em] text-[#38BDF8] font-bold block">
                  Artemis Lunar Exploration Campaign
                </span>
              </div>
              <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.02]">
                Commercial Missions.
                <span className="block text-slate-100 font-black">Lunar Science.</span>
              </h1>
            </div>

            <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-xl font-sans drop-shadow-sm">
              NASA’s Commercial Lunar Payload Services initiative contracts American aerospace providers to deliver science instruments and technology directly to the Moon, preparing for sustained human exploration.
            </p>

            {/* Autoplay Blocked Banner with Immediate Resume Button */}
            {isAutoplayBlocked && (
              <div className="p-3 rounded-lg bg-black/80 border border-[#E03C31]/60 backdrop-blur-md max-w-lg flex items-center justify-between gap-3 shadow-2xl">
                <div className="flex items-center gap-2 text-xs text-slate-200 font-mono">
                  <AlertCircle className="w-4 h-4 text-[#E03C31] shrink-0" />
                  <span>Browser media paused. Click to resume flight stream:</span>
                </div>
                <button
                  type="button"
                  onClick={safePlay}
                  className="px-3 py-1 rounded bg-[#E03C31] hover:bg-[#c42d23] text-white text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-all hover:scale-105"
                >
                  <Play className="w-3 h-3 fill-white" />
                  <span>Play Stream</span>
                </button>
              </div>
            )}

            {/* Buffering Indicator */}
            {isBuffering && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-black/70 border border-white/20 text-xs font-mono text-zinc-300">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span>Buffering Flight Feed...</span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4 pt-2">
              {/* NASA Red Action Button */}
              <button
                type="button"
                onClick={onExploreMissions}
                className="group px-7 py-3.5 rounded bg-[#E03C31] hover:bg-[#c42d23] text-white font-bold text-sm sm:text-base flex items-center gap-3 shadow-2xl transition-all hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <Rocket className="w-5 h-5" aria-hidden="true" />
                <span>Explore NASA Missions</span>
                <span className="w-6 h-6 rounded-full bg-white/20 group-hover:bg-white/30 flex items-center justify-center text-white transition-all">
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </button>

              {/* Frosted Glass Secondary Button */}
              <button
                type="button"
                onClick={onExploreMap}
                className="group px-6 py-3.5 rounded bg-black/50 hover:bg-white/10 text-white border border-white/40 hover:border-white font-bold text-sm sm:text-base flex items-center gap-3 backdrop-blur-md transition-all hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <Globe className="w-5 h-5 text-[#38BDF8]" aria-hidden="true" />
                <span>Interactive 3D Moon</span>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>
          </div>
        </Container>
      </div>

      {/* 4. NASA.GOV BOTTOM TICKER / FEATURED MISSIONS BAR */}
      <div className="relative z-10 w-full bg-black/75 backdrop-blur-md border-t border-white/15 py-4">
        <Container size="xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Ticker Items (9 cols) */}
            <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-8">
              {topFeatured.map((m, idx) => {
                const subtitles = [
                  'HISTORIC SOUTH POLE TOUCHDOWN',
                  'MARE CRISIUM 10-PAYLOAD DRILL',
                  'POLAR WATER ICE PROSPECTOR',
                ];
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => onOpenMissionDetail(m)}
                    className="text-left group transition-all focus-visible:outline-none"
                  >
                    {/* Top Progress / Highlight Indicator Line */}
                    <div className="w-full h-[2px] bg-white/20 group-hover:bg-[#E03C31] transition-colors mb-2" />
                    <span className="text-[10px] font-mono tracking-widest text-[#38BDF8] uppercase block font-semibold">
                      {subtitles[idx] || m.targetRegion.slice(0, 24).toUpperCase()}
                    </span>
                    <div className="font-heading font-bold text-sm sm:text-base text-white group-hover:text-white flex items-center justify-between gap-1.5 transition-colors mt-0.5">
                      <span className="truncate">{m.name}</span>
                      <NasaRedArrow size="sm" className="opacity-80 group-hover:opacity-100" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Video Play/Pause Controller (Far Right) */}
            <div className="md:col-span-3 flex items-center justify-end gap-3">
              <div className="hidden lg:block text-right mr-1">
                <span className="text-[10px] font-mono uppercase text-slate-400 block tracking-wider font-semibold">
                  FLIGHT VIDEO
                </span>
                <span className="text-[11px] font-bold text-white font-mono">
                  {isPlaying ? 'ACTIVE STREAM' : 'PAUSED'}
                </span>
              </div>

              {/* NASA-style circular pause/play button */}
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause background video' : 'Play background video'}
                className="w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 border border-white/50 flex items-center justify-center text-white backdrop-blur-md transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white shadow-xl"
                title={isPlaying ? 'Pause flight video' : 'Play flight video'}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-white" />
                ) : (
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                )}
              </button>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
};
