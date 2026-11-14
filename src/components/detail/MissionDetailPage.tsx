import React from 'react';
import {
  MapPin,
  Layers,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import type { Mission, Payload } from '../../types';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { StatusBadge } from '../common/StatusBadge';
import { Badge } from '../common/Badge';
import { NasaRedArrow } from '../common/NasaRedArrow';
import { Container } from '../common/Container';
import {
  getProviderById,
  getPayloadsForMission,
  getLandingSites,
  getMissions,
} from '../../data';
import { getImageForEntity } from '../../data/imagery';

export interface MissionDetailPageProps {
  mission: Mission;
  onBack: () => void;
  onSelectPayload?: (payloadId: string) => void;
  onSelectSite?: (siteId: string) => void;
  onSelectMission?: (mission: Mission) => void;
  onNavigateHome?: () => void;
}

export const MissionDetailPage: React.FC<MissionDetailPageProps> = ({
  mission,
  onBack,
  onSelectPayload,
  onSelectSite,
  onSelectMission,
  onNavigateHome,
}) => {
  const provider = getProviderById(mission.providerId);
  const payloads = getPayloadsForMission(mission.id);
  const sites = getLandingSites();
  const matchedSite = sites.find(
    (s) =>
      s.missions.includes(mission.id) ||
      mission.targetRegion.toLowerCase().includes(s.name.toLowerCase())
  );
  const allMissions = getMissions();
  const relatedMissions = allMissions
    .filter((m) => m.id !== mission.id)
    .slice(0, 3);

  const heroImage = getImageForEntity(mission.id, mission.name);

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* 1. BREADCRUMBS & TOP NAV BAR */}
      <div className="bg-[#0b0b0d] border-b border-white/10 py-3.5">
        <Container size="xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Breadcrumbs
              items={[
                { label: 'Home', onClick: onNavigateHome },
                { label: 'Missions', onClick: onBack },
                { label: mission.name, active: true },
              ]}
            />
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white rounded px-2 py-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Missions</span>
            </button>
          </div>
        </Container>
      </div>

      {/* 2. EDITORIAL HERO WITH LARGE PHOTOGRAPH */}
      <section className="relative w-full bg-[#050507] border-b border-white/10 overflow-hidden">
        <div className="relative w-full h-[320px] sm:h-[440px] lg:h-[520px] overflow-hidden">
          <img
            src={heroImage.imageUrl}
            alt={heroImage.title}
            className="w-full h-full object-cover object-center filter contrast-105 brightness-90"
          />
          {/* Deep space skrims for contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />

          {/* Top image attribution tag */}
          <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded bg-black/75 backdrop-blur-md border border-white/15 text-[11px] font-mono text-zinc-300">
            <span>Credit: {heroImage.credit}</span>
          </div>

          {/* Hero Content Overlay */}
          <div className="absolute inset-x-0 bottom-0 z-10 pb-8 sm:pb-12">
            <Container size="xl">
              <div className="max-w-3xl space-y-4">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-sm bg-[#E03C31] text-white font-mono text-xs font-bold uppercase tracking-wider">
                    Task Order {mission.taskOrder}
                  </span>
                  <StatusBadge status={mission.status} label={mission.statusLabel} size="md" />
                  <span className="px-2.5 py-1 rounded-sm bg-black/60 border border-white/20 backdrop-blur-sm text-xs font-mono text-zinc-300">
                    {provider ? provider.name : mission.providerId}
                  </span>
                </div>

                <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.05]">
                  {mission.name}
                </h1>

                <p className="text-sm sm:text-base text-zinc-200 leading-relaxed font-sans max-w-2xl drop-shadow-sm">
                  {mission.summary}
                </p>
              </div>
            </Container>
          </div>
        </div>
      </section>

      {/* 3. METADATA & TELEMETRY RIBBON */}
      <section className="bg-[#111113] border-b border-white/10 py-6">
        <Container size="xl">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 text-xs">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block font-semibold">
                COMMERCIAL PROVIDER
              </span>
              <span className="font-bold text-white text-sm sm:text-base mt-0.5 block">
                {provider ? provider.name : mission.providerId}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block font-semibold">
                LANDER ARCHITECTURE
              </span>
              <span className="font-mono font-bold text-white text-sm sm:text-base mt-0.5 block">
                {mission.landerModel}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block font-semibold">
                LAUNCH VEHICLE
              </span>
              <span className="font-bold text-white text-sm sm:text-base mt-0.5 block">
                {mission.launchVehicle}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block font-semibold">
                FLIGHT EVENT
              </span>
              <span className="font-mono font-bold text-white text-sm sm:text-base mt-0.5 block">
                {mission.launchDate || 'Target Window 2026–2028'}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block font-semibold">
                SURFACE TOUCHDOWN
              </span>
              <span className="font-mono font-bold text-white text-sm sm:text-base mt-0.5 block">
                {mission.landingDate || 'Planned Surface Delivery'}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block font-semibold">
                NASA SCIENCE SUITE
              </span>
              <span className="font-bold text-[#E03C31] text-sm sm:text-base mt-0.5 block">
                {mission.nasaPayloadCount} Instruments
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. MAIN BODY CONTENT */}
      <Container size="xl" className="mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Comprehensive Narrative & Scientific Objectives (8 cols) */}
          <div className="lg:col-span-8 space-y-10">
            {/* Mission Overview & Objectives */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E03C31]" />
                <h2 className="text-xs font-mono uppercase tracking-widest text-[#38BDF8] font-bold">
                  Scientific Objectives & Program Mandate
                </h2>
              </div>
              <p className="text-base text-zinc-200 leading-relaxed font-sans">
                {mission.scientificObjectives}
              </p>
            </div>

            {/* Manifested NASA Payloads Grid */}
            <div className="space-y-6 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                    <Layers className="w-5 h-5 text-[#E03C31]" />
                    <span>Manifested NASA Science Payloads ({payloads.length})</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 font-sans">
                    Instruments, drills, and sensor packages delivered directly to the lunar surface.
                  </p>
                </div>
              </div>

              {payloads.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {payloads.map((payload: Payload) => {
                    const pImg = getImageForEntity(payload.id, payload.acronym);
                    return (
                      <article
                        key={payload.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => onSelectPayload?.(payload.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onSelectPayload?.(payload.id);
                          }
                        }}
                        className="group p-4 rounded-xl bg-[#111113] hover:bg-[#161619] border border-white/10 hover:border-white/30 transition-all flex flex-col justify-between space-y-3 cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      >
                        <div className="space-y-2.5">
                          {/* Payload Image Thumbnail */}
                          <div className="w-full h-32 rounded-lg overflow-hidden bg-black relative">
                            <img
                              src={pImg.imageUrl}
                              alt={payload.name}
                              className="w-full h-full object-cover filter contrast-105 group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                            <div className="absolute top-2 right-2">
                              <Badge size="sm" variant="accent">{payload.category}</Badge>
                            </div>
                          </div>

                          <div>
                            <div className="font-mono text-xs font-bold text-[#38BDF8]">
                              {payload.acronym}
                            </div>
                            <h4 className="font-heading font-bold text-sm text-white group-hover:text-white transition-colors line-clamp-1">
                              {payload.name}
                            </h4>
                          </div>

                          <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                            {payload.description}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                          <span>{payload.leadCenter}</span>
                          <span className="text-[#E03C31] group-hover:underline font-bold flex items-center gap-1">
                            Inspect Instrument →
                          </span>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 rounded-xl bg-[#111113] border border-white/10 text-xs text-zinc-400 italic">
                  Specific instrument manifest assignments for this task order are currently in integration review.
                </div>
              )}
            </div>

            {/* Historical Field Report & Telemetry Archive */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <h3 className="font-heading text-xl font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Verification &amp; Scientific Data Provenance</span>
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                All mission coordinates, launch dates, lander classifications, and instrument payloads are verified against official NASA Science Mission Directorate press releases and Lunar Reconnaissance Orbiter Camera (LROC) imaging records.
              </p>

              {mission.provenance && (
                <div className="p-3.5 rounded-lg bg-[#0e0e11] border border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-zinc-400 block uppercase font-semibold">Verification Authority</span>
                    <span className="text-zinc-200 font-medium">{mission.provenance.sourceAgency}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 block uppercase font-semibold">Audit Record Date</span>
                    <span className="text-zinc-200">{mission.provenance.verifiedDate}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[10px] text-zinc-400 block uppercase font-semibold">Primary Citation / Record</span>
                    <span className="text-zinc-300">{mission.provenance.primaryCitation}</span>
                  </div>
                </div>
              )}

              <a
                href={mission.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-mono font-bold text-white transition-colors"
              >
                <span>Read Official NASA Press Announcement</span>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-300" />
              </a>
            </div>
          </div>

          {/* Right Column: Landing Selenography & Telemetry Ledger (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Landing Site Card */}
            <div className="p-6 rounded-xl bg-[#111113] border border-white/10 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-mono text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#E03C31]" />
                  <span>Landing Selenography</span>
                </span>
                {mission.coordinates.confirmedByOrbiter && (
                  <span className="text-[10px] font-mono text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800">
                    LROC Verified
                  </span>
                )}
              </div>

              <div>
                <div className="text-xs text-zinc-400 font-mono">TARGET DESTINATION</div>
                <div className="font-heading font-extrabold text-xl text-white mt-0.5">
                  {mission.targetRegion}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono bg-black/60 p-3.5 rounded-lg border border-white/10">
                <div>
                  <span className="text-zinc-400 block text-[10px]">LATITUDE</span>
                  <span className="text-white font-bold">
                    {mission.coordinates.latitude > 0
                      ? `${mission.coordinates.latitude}° N`
                      : `${Math.abs(mission.coordinates.latitude)}° S`}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[10px]">LONGITUDE</span>
                  <span className="text-white font-bold">
                    {mission.coordinates.longitude > 0
                      ? `${mission.coordinates.longitude}° E`
                      : `${Math.abs(mission.coordinates.longitude)}° W`}
                  </span>
                </div>
                {typeof mission.coordinates.elevationMeters === 'number' && (
                  <div className="col-span-2 pt-2 border-t border-white/10">
                    <span className="text-zinc-400 block text-[10px]">LOLA DATUM ELEVATION</span>
                    <span className="text-white font-bold">
                      {mission.coordinates.elevationMeters.toLocaleString()} meters
                    </span>
                  </div>
                )}
              </div>

              {matchedSite && onSelectSite && (
                <button
                  type="button"
                  onClick={() => onSelectSite(matchedSite.id)}
                  className="w-full py-2.5 px-4 rounded bg-[#E03C31] hover:bg-[#c42d23] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Locate On 3D Moon Atlas</span>
                </button>
              )}
            </div>

            {/* Commercial Provider Dossier Card */}
            {provider && (
              <div className="p-6 rounded-xl bg-[#111113] border border-white/10 space-y-3 shadow-xl">
                <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">
                  PRIME CONTRACTOR
                </div>
                <h4 className="font-heading text-lg font-bold text-white">
                  {provider.name}
                </h4>
                <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                  {provider.historicalAccomplishment}
                </p>
                <div className="pt-2 text-xs font-mono text-zinc-400 flex items-center justify-between border-t border-white/10">
                  <span>Headquarters: {provider.headquarters}</span>
                  <span className="text-white font-bold">{provider.stockTicker}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 5. RELATED MISSIONS SECTION */}
        <section className="mt-20 pt-10 border-t border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 font-bold block">
                Artemis Campaign Continuum
              </span>
              <h3 className="font-heading text-2xl font-extrabold text-white mt-1">
                Explore Related Deliveries
              </h3>
            </div>
            <button
              type="button"
              onClick={onBack}
              className="text-xs font-mono text-[#E03C31] hover:underline font-bold flex items-center gap-1"
            >
              <span>View All {allMissions.length} Missions</span>
              <NasaRedArrow size="sm" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedMissions.map((m) => {
              const relImg = getImageForEntity(m.id, m.name);
              return (
                <article
                  key={m.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectMission?.(m)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectMission?.(m);
                    }
                  }}
                  className="group relative overflow-hidden rounded-xl bg-[#111113] hover:bg-[#161619] border border-white/10 hover:border-white/30 transition-all cursor-pointer flex flex-col justify-between space-y-4 p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <div className="w-full aspect-[16/9] rounded-lg overflow-hidden bg-black relative">
                    <img
                      src={relImg.imageUrl}
                      alt={m.name}
                      className="w-full h-full object-cover filter contrast-105 group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-black/80 text-white border border-white/20">
                        {m.taskOrder}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-heading font-bold text-base text-white group-hover:text-white transition-colors">
                      {m.name}
                    </h4>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                      {m.summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-zinc-300">
                    <span>{m.targetRegion}</span>
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
