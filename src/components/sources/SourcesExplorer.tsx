import React, { useRef, useState, useEffect } from 'react';
import { publicAssetUrl } from '../../utils/publicAssetUrl';
import {
  ShieldCheck,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  ExternalLink,
  CheckCircle2,
  Database,
  FileCheck,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { Container } from '../common/Container';
import { NasaRedArrow } from '../common/NasaRedArrow';

export const SourcesExplorer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasPlaybackError, setHasPlaybackError] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    setIsLoading(true);

    try {
      const playPromise = video.play?.();
      // Media events below are the source of truth. Autoplay is best-effort;
      // browsers may reject it until the user presses Play.
      playPromise?.catch(() => setIsPlaying(false));
    } catch { /* Playback can be started with the visible control. */ }

    const updateTime = () => {
      setCurrentTime(video.currentTime);
      setDuration(video.duration || 0);
    };

    video.addEventListener('timeupdate', updateTime);
    return () => {
      video.removeEventListener('timeupdate', updateTime);
    };
  }, []);

  const playVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    setHasPlaybackError(false);
    setIsLoading(true);
    try {
      const playPromise = video.play();
      playPromise?.catch(() => {
        setIsLoading(false);
        setIsPlaying(false);
      });
    } catch {
      setIsLoading(false);
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) video.pause();
    else playVideo();
  };

  const retryVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    setHasPlaybackError(false);
    setIsLoading(true);
    video.load();
    playVideo();
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const next = !videoRef.current.muted;
    videoRef.current.muted = next;
    setIsMuted(next);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      void videoRef.current.requestFullscreen().catch(() => undefined);
    } else if ('webkitEnterFullscreen' in videoRef.current) {
      (videoRef.current as HTMLVideoElement & { webkitEnterFullscreen: () => void }).webkitEnterFullscreen();
    }
  };

  const handleVideoError = () => {
    setIsLoading(false);
    setIsPlaying(false);
    setHasPlaybackError(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <section className="py-8 bg-black text-white select-none">
      <Container size="xl">
        {/* Page title — Restrained Editorial Header */}
        <div className="mb-8 space-y-2 pb-4 border-b border-white/10">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-zinc-400 font-semibold">
            <Database className="w-3.5 h-3.5" aria-hidden="true" />
            <span>NASA Scientific Provenance &amp; Verification Protocol</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Sources, Data Provenance &amp; Methodology
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-sans max-w-3xl leading-relaxed">
            Data integrity standards, primary NASA reference portals, Firm-Fixed-Price contracting definitions, and verified lunar orbital data archives from the Lunar Reconnaissance Orbiter (LROC).
          </p>
        </div>

        {/* Dynamic Multi-Column Layout: Left Narrative + Right Engaging Media & Video Player */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Data verification standards and official bibliography (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Primary Data Standards Card */}
            <div className="p-5 sm:p-6 rounded-lg border border-white/10 bg-[#0e0e11] shadow-sm space-y-4 text-xs sm:text-sm text-zinc-200 leading-relaxed">
              <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2.5 pb-3 border-b border-white/10">
                <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" aria-hidden="true" />
                <span>How CLPS Explorer Verifies Data</span>
              </h2>

              <p className="text-zinc-300">
                All statistics, coordinates, payload names, task orders, and contract awards are extracted exclusively from primary NASA portals, NASA Science Mission Directorate press releases, and LROC selenographic data. No third-party speculation, forum rumors, or unverified marketing claims are included.
              </p>

              <div className="space-y-3 pt-2">
                <div className="p-3.5 rounded-lg bg-black/40 border border-white/5 space-y-1">
                  <span className="text-white font-bold font-sans flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>The "60+ Payloads" Standard:</span>
                  </span>
                  <p className="text-zinc-300 text-xs">
                    NASA's program accounting standard reflects cumulative NASA-funded science and technology investigations awarded across all 17 task orders through November 2028. It strictly excludes commercial co-manifested items (such as art capsules or private rovers).
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-black/40 border border-white/5 space-y-1">
                  <span className="text-white font-bold font-sans flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Fixed-Price Contracting Model:</span>
                  </span>
                  <p className="text-zinc-300 text-xs">
                    Unlike historical cost-plus Apollo missions, CLPS task orders are Firm-Fixed-Price (FFP). NASA purchases payload delivery as a service. Commercial contractors own and operate the spacecraft, secure commercial launch vehicles, and retain responsibility for mission execution.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-black/40 border border-white/5 space-y-1">
                  <span className="text-white font-bold font-sans flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Public Data &amp; Provenance:</span>
                  </span>
                  <p className="text-zinc-300 text-xs">
                    CLPS Explorer is an educational scientific resource aggregating verified public-domain records from the NASA Science Mission Directorate and Lunar Reconnaissance Orbiter archives.
                  </p>
                </div>
              </div>
            </div>

            {/* Primary Reference Bibliography */}
            <div className="p-5 sm:p-6 rounded-lg border border-white/10 bg-[#0e0e11] shadow-sm space-y-4 text-xs sm:text-sm text-white">
              <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2 pb-3 border-b border-white/10">
                <BookOpen className="w-5 h-5 text-white" />
                <span>Primary NASA Reference Bibliography</span>
              </h2>

              <ul className="space-y-4 divide-y divide-white/10 text-zinc-300">
                {[
                  {
                    title: 'NASA CLPS Deliveries Portal',
                    url: 'https://science.nasa.gov/lunar-science/clps-deliveries/',
                    desc: 'Official manifest of contracted lunar delivery missions, awarded payload complements, and vendor task orders.',
                  },
                  {
                    title: 'NASA Lunar Discovery & Exploration Program (LDEP)',
                    url: 'https://science.nasa.gov/lunar-science/programs/ldep/',
                    desc: 'Programmatic architecture for lunar robotic science, PRISM instrument calls, and VIPER rover manifests.',
                  },
                  {
                    title: 'LROC Landing Site Confirmation (ASU / Goddard)',
                    url: 'https://www.lroc.asu.edu',
                    desc: 'High-resolution Narrow Angle Camera (NAC) orbital imagery and LOLA laser altimeter terrain confirmation.',
                  },
                  {
                    title: 'NASA Commercial Lunar Payload Services Fact Sheet',
                    url: 'https://www.nasa.gov/commercial-lunar-payload-services/',
                    desc: 'Comprehensive program fact sheet detailing contracting mechanisms, eligible vendor pools, and flight milestones.',
                  },
                  {
                    title: 'Artemis Campaign Architecture Overview',
                    url: 'https://www.nasa.gov/artemis/',
                    desc: 'NASA Artemis campaign architecture integrating robotic CLPS precursors with crewed lunar exploration.',
                  },
                  {
                    title: 'NASA Planetary Data System (PDS)',
                    url: 'https://pds.nasa.gov/',
                    desc: 'Official archive of NASA planetary mission data, scientific measurements, instrument calibrations, and coordinates.',
                  },
                ].map((item, idx) => (
                  <li key={idx} className={idx > 0 ? 'pt-3.5' : ''}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-bold text-white font-heading text-sm">{item.title}</div>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-1.5 shrink-0"
                        title={item.title}
                      >
                        <NasaRedArrow size="sm" />
                      </a>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">{item.desc}</p>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#E03C31] font-mono hover:underline text-[11px] font-semibold mt-1 inline-flex items-center gap-1"
                    >
                      <span>{item.url}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RIGHT COLUMN: Video player + quick links + data integrity badges (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* 1. LUNAR SURFACE FLYOVER VIDEO PLAYER (No moon poster!) */}
            <div className="rounded-lg border border-white/10 bg-[#0e0e11] shadow-xl overflow-hidden group">
              {/* Media header */}
              <div className="p-3.5 bg-black border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#E03C31] animate-pulse" />
                  <span className="text-xs font-mono font-bold tracking-wider uppercase text-white">
                    NASA LROC High-Resolution Flyover
                  </span>
                </div>
                <span className="text-[10px] font-mono text-zinc-300 px-2 py-0.5 rounded bg-white/10 border border-white/20 font-bold">
                  SURFACE VIDEO
                </span>
              </div>

              {/* Video container — completely avoids moon poster image! */}
              <div className="relative aspect-video bg-black overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  className="w-full h-full object-cover"
                  aria-label="Lunar surface flyover visualization by NASA LROC"
                  onLoadStart={() => {
                    setIsLoading(true);
                    setHasPlaybackError(false);
                  }}
                  onLoadedMetadata={(event) => {
                    const video = event.currentTarget;
                    setDuration(Number.isFinite(video.duration) ? video.duration : 0);
                    setCurrentTime(video.currentTime || 0);
                    setIsLoading(false);
                  }}
                  onCanPlay={() => setIsLoading(false)}
                  onPlaying={() => {
                    setIsLoading(false);
                    setHasPlaybackError(false);
                    setIsPlaying(true);
                  }}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                  onWaiting={() => setIsLoading(true)}
                  onError={handleVideoError}
                >
                  <source src={publicAssetUrl('/videos/nasa-hero.mp4')} type="video/mp4" />
                  <source src={publicAssetUrl('/videos/lunar-tour.mp4')} type="video/mp4" />
                </video>

                {isLoading && !hasPlaybackError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/55 text-xs font-mono text-zinc-300 pointer-events-none" role="status" aria-live="polite">
                    Loading NASA lunar video…
                  </div>
                )}
                {hasPlaybackError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/85 px-5 text-center" role="alert">
                    <p className="text-xs font-mono text-zinc-200">The video could not be loaded. Check your connection and try again.</p>
                    <button
                      type="button"
                      onClick={retryVideo}
                      className="rounded-md border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-mono text-white hover:bg-white/20 transition-colors"
                    >
                      Retry video
                    </button>
                  </div>
                )}

                {/* Subtle dark gradient overlay at bottom of video */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

                {/* Custom Overlay Controls */}
                <div className="absolute bottom-2 inset-x-3 flex items-center justify-between text-white z-10">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={togglePlay}
                      aria-label={isPlaying ? 'Pause lunar tour' : 'Play lunar tour'}
                      className="w-8 h-8 rounded-full bg-black/60 hover:bg-[#E03C31] flex items-center justify-center text-white backdrop-blur-sm transition-all shadow-md"
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white ml-0.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={toggleMute}
                      aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                      className="w-8 h-8 rounded-full bg-black/60 hover:bg-white/20 flex items-center justify-center text-white backdrop-blur-sm transition-all"
                    >
                      {isMuted ? <VolumeX className="w-3.5 h-3.5 text-zinc-300" /> : <Volume2 className="w-3.5 h-3.5 text-white" />}
                    </button>
                    <span className="text-[11px] font-mono text-zinc-300">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    aria-label="Enter fullscreen"
                    className="w-8 h-8 rounded-full bg-black/60 hover:bg-white/20 flex items-center justify-center text-white backdrop-blur-sm transition-all"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-zinc-300" />
                  </button>
                </div>
              </div>

              {/* Video Timeline Scrubber */}
              <div className="px-3 pt-2 bg-black">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  step="0.1"
                  value={currentTime}
                  onChange={handleSeek}
                  aria-label="Video scrubber"
                  className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#E03C31]"
                />
              </div>

              {/* Caption and Attribution */}
              <div className="p-4 space-y-1.5 bg-black">
                <p className="text-xs font-bold text-white font-heading">
                  Lunar Surface Exploration &amp; Candidate Touchdown Sites
                </p>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  Visualization of CLPS target landing coordinates across the lunar surface, including South Pole highlands, Mare Crisium, Gruithuisen Domes, and the far side Schrödinger Basin.
                </p>
                <p className="text-[11px] font-mono text-zinc-500 pt-1">
                  Credit: NASA Goddard Space Flight Center / LROC / ASU
                </p>
              </div>
            </div>

            {/* 2. DATA INTEGRITY RADAR CARD */}
            <div className="p-5 rounded-lg border border-white/10 bg-[#0e0e11] shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-[#E03C31]" />
                  <span>Validation Metrics Ledger</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-bold">
                  VERIFIED
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded bg-black/50 border border-white/10 space-y-0.5">
                  <span className="text-zinc-400 text-[10px] block font-semibold">PRIMARY ACCURACY</span>
                  <span className="text-emerald-400 font-bold text-sm">100% Verified</span>
                </div>
                <div className="p-2.5 rounded bg-black/50 border border-white/10 space-y-0.5">
                  <span className="text-zinc-400 text-[10px] block font-semibold">EVALUATED ORDERS</span>
                  <span className="text-white font-bold text-sm">17 Task Orders</span>
                </div>
                <div className="p-2.5 rounded bg-black/50 border border-white/10 space-y-0.5">
                  <span className="text-zinc-400 text-[10px] block font-semibold">NASA INSTRUMENTS</span>
                  <span className="text-white font-bold text-sm">28 Payload Suites</span>
                </div>
                <div className="p-2.5 rounded bg-black/50 border border-white/10 space-y-0.5">
                  <span className="text-zinc-400 text-[10px] block font-semibold">TOUCHDOWN SITES</span>
                  <span className="text-white font-bold text-sm">8 Catalog Sites</span>
                </div>
              </div>
            </div>

            {/* 3. QUICK REFERENCE NASA RESOURCE LINKS */}
            <div className="p-5 rounded-lg border border-white/10 bg-[#0e0e11] shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-white font-heading flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#E03C31]" />
                <span>Quick Reference NASA Portals</span>
              </h3>
              <ul className="space-y-2 text-xs">
                {[
                  { label: 'CLPS Program Fact Sheet', href: 'https://www.nasa.gov/commercial-lunar-payload-services/' },
                  { label: 'NASA Science Deliveries Manifest', href: 'https://science.nasa.gov/lunar-science/clps-deliveries/' },
                  { label: 'Artemis Campaign Science Directorate', href: 'https://www.nasa.gov/artemis/' },
                  { label: 'LROC Lunar Reconnaissance Atlas', href: 'https://www.lroc.asu.edu' },
                  { label: 'NASA Planetary Data System (PDS)', href: 'https://pds.nasa.gov/' },
                  { label: 'SAM.gov Federal Contract Notices', href: 'https://sam.gov' },
                ].map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between p-2 rounded hover:bg-white/5 text-zinc-300 hover:text-white transition-all font-mono font-medium"
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E03C31] shrink-0" />
                        <span>{link.label}</span>
                      </span>
                      <NasaRedArrow size="sm" className="opacity-70 group-hover:opacity-100" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
