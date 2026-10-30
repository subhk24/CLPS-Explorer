import React from 'react';
import {
  ArrowLeft,
  Compass,
  Rocket,
  ShieldCheck,
  Globe,
} from 'lucide-react';
import type { LandingSite, Mission } from '../../types';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { NasaRedArrow } from '../common/NasaRedArrow';
import { Container } from '../common/Container';
import { getMissions, getLandingSites } from '../../data';
import { getImageForEntity } from '../../data/imagery';

export interface SiteDetailPageProps {
  site: LandingSite;
  onBack: () => void;
  onSelectMission?: (mission: Mission) => void;
  onSelectSite?: (siteId: string) => void;
  onOpenGlobeView?: (siteId: string) => void;
  onNavigateHome?: () => void;
}

export const SiteDetailPage: React.FC<SiteDetailPageProps> = ({
  site,
  onBack,
  onSelectMission,
  onSelectSite,
  onOpenGlobeView,
  onNavigateHome,
}) => {
  const allMissions = getMissions();
  const manifestedMissions = allMissions.filter(
    (m) =>
      site.missions.includes(m.id) ||
      m.targetRegion.toLowerCase().includes(site.name.toLowerCase())
  );

  const allSites = getLandingSites();
  const relatedSites = allSites.filter((s) => s.id !== site.id).slice(0, 3);
  const heroImage = getImageForEntity(site.id, site.name);

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* 1. BREADCRUMBS & TOP NAV */}
      <div className="bg-[#0b0b0d] border-b border-white/10 py-3.5">
        <Container size="xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Breadcrumbs
              items={[
                { label: 'Home', onClick: onNavigateHome },
                { label: 'Lunar Cartographic Atlas', onClick: onBack },
                { label: site.name, active: true },
              ]}
            />
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white rounded px-2 py-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Lunar Map</span>
            </button>
          </div>
        </Container>
      </div>

      {/* 2. EDITORIAL HERO WITH LARGE TOPOGRAPHY PHOTOGRAPH */}
      <section className="relative w-full bg-[#050507] border-b border-white/10 overflow-hidden">
        <div className="relative w-full h-[320px] sm:h-[440px] lg:h-[500px] overflow-hidden">
          <img
            src={heroImage.imageUrl}
            alt={heroImage.title}
            className="w-full h-full object-cover object-center filter contrast-110 brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />

          {/* Top image attribution */}
          <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded bg-black/75 backdrop-blur-md border border-white/15 text-[11px] font-mono text-zinc-300">
            <span>Credit: {heroImage.credit}</span>
          </div>

          {/* Hero Content Overlay */}
          <div className="absolute inset-x-0 bottom-0 z-10 pb-8 sm:pb-12">
            <Container size="xl">
              <div className="max-w-3xl space-y-4">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-sm bg-[#E03C31] text-white font-mono text-xs font-bold uppercase tracking-wider">
                    {site.hemisphere}
                  </span>
                  {site.confirmedByOrbiter && (
                    <span className="px-2.5 py-1 rounded-sm bg-emerald-950/80 border border-emerald-600 text-emerald-300 font-mono text-xs font-bold">
                      LROC Orbiter Confirmed
                    </span>
                  )}
                  <span className="px-2.5 py-1 rounded-sm bg-black/60 border border-white/20 backdrop-blur-sm text-xs font-mono text-zinc-300">
                    Elevation: {site.coordinates.elevationMeters}m LOLA Datum
                  </span>
                </div>

                <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.05]">
                  {site.name}
                </h1>

                <p className="text-sm sm:text-base text-zinc-200 leading-relaxed font-sans max-w-2xl drop-shadow-sm">
                  {site.geologicalDescription}
                </p>
              </div>
            </Container>
          </div>
        </div>
      </section>

      {/* 3. SELENOGRAPHIC TELEMETRY STRIP */}
      <section className="bg-[#111113] border-b border-white/10 py-6">
        <Container size="xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs font-mono">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-zinc-400 block font-semibold">
                LATITUDE COORDINATE
              </span>
              <span className="font-bold text-white text-base sm:text-lg mt-0.5 block">
                {site.coordinates.latitude > 0
                  ? `${site.coordinates.latitude}° N`
                  : `${Math.abs(site.coordinates.latitude)}° S`}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider text-zinc-400 block font-semibold">
                LONGITUDE COORDINATE
              </span>
              <span className="font-bold text-white text-base sm:text-lg mt-0.5 block">
                {site.coordinates.longitude > 0
                  ? `${site.coordinates.longitude}° E`
                  : `${Math.abs(site.coordinates.longitude)}° W`}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider text-zinc-400 block font-semibold">
                LOLA ELEVATION
              </span>
              <span className="font-bold text-white text-base sm:text-lg mt-0.5 block">
                {site.coordinates.elevationMeters.toLocaleString()} m
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider text-zinc-400 block font-semibold">
                TARGET MISSIONS
              </span>
              <span className="font-bold text-[#E03C31] text-base sm:text-lg mt-0.5 block font-sans">
                {manifestedMissions.length} Commercial Flights
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. MAIN BODY */}
      <Container size="xl" className="mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column (8 cols) */}
          <div className="lg:col-span-8 space-y-10">
            {/* Scientific Significance */}
            <div className="space-y-4">
              <h3 className="font-heading text-2xl font-bold text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#E03C31]" />
                <span>Scientific Significance & Exploration Value</span>
              </h3>
              <p className="text-sm sm:text-base text-zinc-200 leading-relaxed font-sans">
                {site.scientificSignificance}
              </p>
            </div>

            {/* Geological Context */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <h4 className="font-heading text-xl font-bold text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#38BDF8]" />
                <span>Geological & Selenological Context</span>
              </h4>
              <p className="text-sm text-zinc-300 leading-relaxed font-sans">
                {site.geologicalDescription}
              </p>
            </div>

            {/* Orbiter Verification Archive */}
            {site.orbiterVerificationSource && (
              <div className="pt-4 border-t border-white/10 space-y-3">
                <h4 className="font-heading font-bold text-base text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Orbiter Photometric & Topographic Verification</span>
                </h4>
                <p className="text-xs text-zinc-400 font-mono">
                  Primary Observation Anchor: {site.orbiterVerificationSource}
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Interactive 3D Action & Manifested Missions (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* 3D Globe Action Card */}
            <div className="p-6 rounded-xl bg-[#111113] border border-white/10 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-300 uppercase tracking-wider font-bold">
                <Globe className="w-4 h-4 text-[#38BDF8]" />
                <span>3D Selenography Navigation</span>
              </div>
              <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                Inspect this landing site on our interactive 3D WebGL Moon globe with verified elevation models and illumination data.
              </p>
              {onOpenGlobeView && (
                <button
                  type="button"
                  onClick={() => onOpenGlobeView(site.id)}
                  className="w-full py-2.5 px-4 rounded bg-[#E03C31] hover:bg-[#c42d23] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Open 3D Selenography Atlas</span>
                </button>
              )}
            </div>

            {/* Manifested Flights */}
            <div className="p-6 rounded-xl bg-[#111113] border border-white/10 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-mono text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Rocket className="w-4 h-4 text-[#E03C31]" />
                  <span>Assigned Deliveries</span>
                </span>
                <span className="text-[10px] font-mono text-zinc-400">
                  {manifestedMissions.length} Active
                </span>
              </div>

              {manifestedMissions.length > 0 ? (
                <div className="space-y-3">
                  {manifestedMissions.map((m) => (
                    <div
                      key={m.id}
                      className="p-3 rounded-lg bg-black/60 border border-white/10 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{m.name}</span>
                        <span className="font-mono text-[10px] text-zinc-400">{m.taskOrder}</span>
                      </div>
                      <p className="text-zinc-400 text-[11px] line-clamp-1">{m.summary}</p>
                      {onSelectMission && (
                        <button
                          type="button"
                          onClick={() => onSelectMission(m)}
                          className="text-[#E03C31] hover:underline font-mono text-[11px] font-bold"
                        >
                          Examine Mission Dossier →
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-zinc-400 italic">
                  Additional CLPS missions will be competitively competed for this geological site in subsequent RFP rounds.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 5. RELATED LANDING SITES */}
        <section className="mt-20 pt-10 border-t border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 font-bold block">
                Lunar Surface Geography
              </span>
              <h3 className="font-heading text-2xl font-extrabold text-white mt-1">
                Explore Other Verified Touchdown Sites
              </h3>
            </div>
            <button
              type="button"
              onClick={onBack}
              className="text-xs font-mono text-[#E03C31] hover:underline font-bold flex items-center gap-1"
            >
              <span>View All 8 Sites</span>
              <NasaRedArrow size="sm" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedSites.map((s) => {
              const relImg = getImageForEntity(s.id, s.name);
              return (
                <article
                  key={s.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectSite?.(s.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectSite?.(s.id);
                    }
                  }}
                  className="group relative overflow-hidden rounded-xl bg-[#111113] hover:bg-[#161619] border border-white/10 hover:border-white/30 transition-all cursor-pointer flex flex-col justify-between space-y-4 p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <div className="w-full aspect-[16/9] rounded-lg overflow-hidden bg-black relative">
                    <img
                      src={relImg.imageUrl}
                      alt={s.name}
                      className="w-full h-full object-cover filter contrast-105 group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-black/80 text-white border border-white/20">
                        {s.hemisphere}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-heading font-bold text-base text-white group-hover:text-white transition-colors">
                      {s.name}
                    </h4>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                      {s.geologicalDescription}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-zinc-300">
                    <span>{s.coordinates.elevationMeters}m Elevation</span>
                    <NasaRedArrow size="sm" />
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </Container>
    </div>
  );
};
