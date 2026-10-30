import React from 'react';
import {
  Layers,
  ArrowLeft,
  ExternalLink,
  HelpCircle,
  Rocket,
  ShieldCheck,
} from 'lucide-react';
import type { Payload, Mission } from '../../types';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { Badge } from '../common/Badge';
import { NasaRedArrow } from '../common/NasaRedArrow';
import { Container } from '../common/Container';
import { getMissionById, getPayloads } from '../../data';
import { getImageForEntity } from '../../data/imagery';

export interface PayloadDetailPageProps {
  payload: Payload;
  onBack: () => void;
  onSelectMission?: (mission: Mission) => void;
  onSelectPayload?: (payloadId: string) => void;
  onNavigateHome?: () => void;
}

export const PayloadDetailPage: React.FC<PayloadDetailPageProps> = ({
  payload,
  onBack,
  onSelectMission,
  onSelectPayload,
  onNavigateHome,
}) => {
  const hostMission = getMissionById(payload.missionId);
  const allPayloads = getPayloads();
  const relatedPayloads = allPayloads
    .filter((p) => p.id !== payload.id && (p.category === payload.category || p.missionId === payload.missionId))
    .slice(0, 3);

  const heroImage = getImageForEntity(payload.id, payload.acronym);

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* 1. BREADCRUMBS & TOP NAV */}
      <div className="bg-[#0b0b0d] border-b border-white/10 py-3.5">
        <Container size="xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Breadcrumbs
              items={[
                { label: 'Home', onClick: onNavigateHome },
                { label: 'Science Payloads', onClick: onBack },
                { label: payload.acronym, active: true },
              ]}
            />
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white rounded px-2 py-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Payloads</span>
            </button>
          </div>
        </Container>
      </div>

      {/* 2. EDITORIAL HERO WITH LARGE PHOTOGRAPH */}
      <section className="relative w-full bg-[#050507] border-b border-white/10 overflow-hidden">
        <div className="relative w-full h-[320px] sm:h-[420px] lg:h-[480px] overflow-hidden">
          <img
            src={heroImage.imageUrl}
            alt={heroImage.title}
            className="w-full h-full object-cover object-center filter contrast-105 brightness-90"
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
                    {payload.acronym}
                  </span>
                  <Badge size="md" variant="accent">{payload.categoryLabel}</Badge>
                  <span className="px-2.5 py-1 rounded-sm bg-black/60 border border-white/20 backdrop-blur-sm text-xs font-mono text-zinc-300">
                    Lead: {payload.leadCenter}
                  </span>
                </div>

                <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.05]">
                  {payload.name}
                </h1>

                <p className="text-sm sm:text-base text-zinc-200 leading-relaxed font-sans max-w-2xl drop-shadow-sm">
                  {payload.description}
                </p>
              </div>
            </Container>
          </div>
        </div>
      </section>

      {/* 3. SCIENTIFIC METADATA STRIP */}
      <section className="bg-[#111113] border-b border-white/10 py-6">
        <Container size="xl">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 text-xs">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block font-semibold">
                SCIENTIFIC DOMAIN
              </span>
              <span className="font-bold text-white text-sm mt-0.5 block">
                {payload.categoryLabel} ({payload.category})
              </span>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block font-semibold">
                LEAD NASA CENTER
              </span>
              <span className="font-mono font-bold text-white text-sm mt-0.5 block">
                {payload.leadCenter}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block font-semibold">
                PRINCIPAL INVESTIGATOR
              </span>
              <span className="font-bold text-white text-sm mt-0.5 block">
                {payload.leadPi || 'NASA Mission Directorate Team'}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block font-semibold">
                OPERATIONAL STATUS
              </span>
              <span className="font-mono font-bold text-emerald-400 text-sm mt-0.5 block">
                {payload.statusLabel}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block font-semibold">
                HOST TASK ORDER
              </span>
              <span className="font-bold text-[#E03C31] text-sm mt-0.5 block">
                {hostMission ? hostMission.taskOrder : payload.missionId}
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. MAIN BODY */}
      <Container size="xl" className="mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Scientific Research & Questions (8 cols) */}
          <div className="lg:col-span-8 space-y-10">
            {/* Primary Scientific Question */}
            <div className="p-6 rounded-xl bg-[#111113] border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-[#38BDF8] uppercase font-bold tracking-wider">
                <HelpCircle className="w-4 h-4 text-[#38BDF8]" />
                <span>Primary Scientific Investigation</span>
              </div>
              <h3 className="font-heading font-bold text-xl text-white">
                "{payload.scientificQuestion}"
              </h3>
            </div>

            {/* Instrument Specifications & Narrative */}
            <div className="space-y-4">
              <h3 className="font-heading text-2xl font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#E03C31]" />
                <span>Technical Specifications & Science Objectives</span>
              </h3>
              <p className="text-sm sm:text-base text-zinc-200 leading-relaxed font-sans">
                {payload.description}
              </p>
              <p className="text-sm text-zinc-300 leading-relaxed font-sans pt-2">
                Operating under NASA’s Science Mission Directorate (SMD), this payload addresses critical decadal survey priorities for lunar selenology, volatiles prospecting, space weather, or high-precision lunar geodetic navigation.
              </p>
            </div>

            {/* Verification Sources */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <h4 className="font-heading font-bold text-base text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>NASA Planetary Data Archiving &amp; Provenance</span>
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Raw instrument telemetry, engineering calibration sets, and lunar surface observations are deposited into the NASA Planetary Data System (PDS) for open public science.
              </p>

              {payload.provenance && (
                <div className="p-3.5 rounded-lg bg-[#0e0e11] border border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-zinc-400 block uppercase font-semibold">Lead Center / Agency</span>
                    <span className="text-zinc-200 font-medium">{payload.provenance.sourceAgency}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 block uppercase font-semibold">Verification Audit Date</span>
                    <span className="text-zinc-200">{payload.provenance.verifiedDate}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[10px] text-zinc-400 block uppercase font-semibold">Primary Specification / Record</span>
                    <span className="text-zinc-300">{payload.provenance.primaryCitation}</span>
                  </div>
                </div>
              )}

              <a
                href={payload.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-mono font-bold text-white transition-colors"
              >
                <span>NASA Instrument Press Announcement</span>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-300" />
              </a>
            </div>
          </div>

          {/* Right Column: Host Mission Card (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {hostMission && (
              <div className="p-6 rounded-xl bg-[#111113] border border-white/10 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="font-mono text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Rocket className="w-4 h-4 text-[#E03C31]" />
                    <span>Host Commercial Flight</span>
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    Task Order {hostMission.taskOrder}
                  </span>
                </div>

                <div className="w-full h-36 rounded-lg overflow-hidden bg-black relative">
                  <img
                    src={getImageForEntity(hostMission.id, hostMission.name).imageUrl}
                    alt={hostMission.name}
                    className="w-full h-full object-cover filter contrast-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase">Target Destination</span>
                    <div className="font-bold text-white text-xs truncate">{hostMission.targetRegion}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-heading font-bold text-lg text-white">
                    {hostMission.name}
                  </h4>
                  <p className="text-xs text-zinc-300 mt-1 line-clamp-2">
                    {hostMission.summary}
                  </p>
                </div>

                {onSelectMission && (
                  <button
                    type="button"
                    onClick={() => onSelectMission(hostMission)}
                    className="w-full py-2.5 px-4 rounded bg-[#E03C31] hover:bg-[#c42d23] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>Examine Flight Dossier</span>
                    <NasaRedArrow size="sm" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 5. RELATED INSTRUMENTS */}
        <section className="mt-20 pt-10 border-t border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 font-bold block">
                NASA Lunar Science Directory
              </span>
              <h3 className="font-heading text-2xl font-extrabold text-white mt-1">
                Related Instruments & Payloads
              </h3>
            </div>
            <button
              type="button"
              onClick={onBack}
              className="text-xs font-mono text-[#E03C31] hover:underline font-bold flex items-center gap-1"
            >
              <span>View All 28 Payloads</span>
              <NasaRedArrow size="sm" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPayloads.map((p) => {
              const relImg = getImageForEntity(p.id, p.acronym);
              return (
                <article
                  key={p.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectPayload?.(p.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectPayload?.(p.id);
                    }
                  }}
                  className="group relative overflow-hidden rounded-xl bg-[#111113] hover:bg-[#161619] border border-white/10 hover:border-white/30 transition-all cursor-pointer flex flex-col justify-between space-y-4 p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <div className="w-full aspect-[16/9] rounded-lg overflow-hidden bg-black relative">
                    <img
                      src={relImg.imageUrl}
                      alt={p.name}
                      className="w-full h-full object-cover filter contrast-105 group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-black/80 text-white border border-white/20">
                        {p.acronym}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-heading font-bold text-base text-white group-hover:text-white transition-colors line-clamp-1">
                      {p.name}
                    </h4>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                      {p.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-zinc-300">
                    <span>{p.leadCenter}</span>
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
