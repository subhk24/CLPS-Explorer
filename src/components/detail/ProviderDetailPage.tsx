import React from 'react';
import {
  ArrowLeft,
  ExternalLink,
  Rocket,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import type { Provider, Mission } from '../../types';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { NasaRedArrow } from '../common/NasaRedArrow';
import { Container } from '../common/Container';
import { getMissions, getProviders } from '../../data';
import { getImageForEntity } from '../../data/imagery';

export interface ProviderDetailPageProps {
  provider: Provider;
  onBack: () => void;
  onSelectMission?: (mission: Mission) => void;
  onSelectProvider?: (providerId: string) => void;
  onNavigateHome?: () => void;
}

export const ProviderDetailPage: React.FC<ProviderDetailPageProps> = ({
  provider,
  onBack,
  onSelectMission,
  onSelectProvider,
  onNavigateHome,
}) => {
  const allMissions = getMissions();
  const awardedMissions = allMissions.filter((m) => m.providerId === provider.id);
  const allProviders = getProviders();
  const relatedProviders = allProviders.filter((p) => p.id !== provider.id).slice(0, 3);
  const heroImage = getImageForEntity(provider.id, provider.name);

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* 1. BREADCRUMBS & TOP NAV */}
      <div className="bg-[#0b0b0d] border-b border-white/10 py-3.5">
        <Container size="xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Breadcrumbs
              items={[
                { label: 'Home', onClick: onNavigateHome },
                { label: 'Commercial Providers', onClick: onBack },
                { label: provider.name, active: true },
              ]}
            />
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white rounded px-2 py-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Providers</span>
            </button>
          </div>
        </Container>
      </div>

      {/* 2. EDITORIAL HERO WITH LARGE PHOTOGRAPH */}
      <section className="relative w-full bg-[#050507] border-b border-white/10 overflow-hidden">
        <div className="relative w-full h-[320px] sm:h-[440px] lg:h-[500px] overflow-hidden">
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
                    {provider.statusLabel}
                  </span>
                  <span className="px-2.5 py-1 rounded-sm bg-black/60 border border-white/20 backdrop-blur-sm text-xs font-mono text-zinc-300">
                    HQ: {provider.headquarters}
                  </span>
                  <span className="px-2.5 py-1 rounded-sm bg-black/60 border border-white/20 backdrop-blur-sm text-xs font-mono text-zinc-300">
                    Founded: {provider.foundedYear}
                  </span>
                </div>

                <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.05]">
                  {provider.name}
                </h1>

                <p className="text-sm sm:text-base text-zinc-200 leading-relaxed font-sans max-w-2xl drop-shadow-sm">
                  {provider.historicalAccomplishment}
                </p>
              </div>
            </Container>
          </div>
        </div>
      </section>

      {/* 3. METADATA STRIP */}
      <section className="bg-[#111113] border-b border-white/10 py-6">
        <Container size="xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block font-semibold">
                HEADQUARTERS
              </span>
              <span className="font-bold text-white text-base mt-0.5 block">
                {provider.headquarters}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block font-semibold">
                STOCK TICKER / SYMBOL
              </span>
              <span className="font-mono font-bold text-white text-base mt-0.5 block">
                {provider.stockTicker}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block font-semibold">
                TOTAL AWARD VALUATION
              </span>
              <span className="font-mono font-bold text-emerald-400 text-base mt-0.5 block">
                {provider.totalAwardValue}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block font-semibold">
                AWARDED TASK ORDERS
              </span>
              <span className="font-bold text-[#E03C31] text-base mt-0.5 block">
                {provider.awardedTaskOrders.length} Fixed-Price Contracts
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. MAIN BODY */}
      <Container size="xl" className="mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Lander Matrix & Accomplishments (8 cols) */}
          <div className="lg:col-span-8 space-y-10">
            {/* Historical Accomplishment */}
            <div className="space-y-4">
              <h3 className="font-heading text-2xl font-bold text-white flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>Commercial Accomplishment & Aerospace Heritage</span>
              </h3>
              <p className="text-sm sm:text-base text-zinc-200 leading-relaxed font-sans">
                {provider.historicalAccomplishment}
              </p>
            </div>

            {/* Lander Fleet Matrix */}
            <div className="space-y-6 pt-4 border-t border-white/10">
              <h3 className="font-heading text-2xl font-bold text-white flex items-center gap-2">
                <Rocket className="w-5 h-5 text-[#E03C31]" />
                <span>Lander Architecture & Propulsion Matrix</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {provider.landers.map((lander, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl bg-[#111113] border border-white/10 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-heading font-bold text-lg text-white">
                        {lander.name}
                      </h4>
                      <span className="px-2 py-0.5 rounded bg-white/10 text-white font-mono text-[11px] font-bold">
                        {lander.payloadCapacityKg} kg Capacity
                      </span>
                    </div>

                    <div className="space-y-2 text-xs font-mono text-zinc-300 pt-2 border-t border-white/10">
                      <div>
                        <span className="text-zinc-500 block text-[10px]">PROPULSION CHEMISTRY</span>
                        <span className="text-white font-bold">{lander.propulsionType}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[10px]">HERITAGE</span>
                        <span className="text-zinc-300 font-sans">{lander.heritage}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification Link */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <h4 className="font-heading font-bold text-base text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Official Commercial Website</span>
              </h4>
              <p className="text-xs text-zinc-400">
                Direct access to public technical specifications and flight hardware integration updates.
              </p>
              <a
                href={provider.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-mono font-bold text-white transition-colors"
              >
                <span>Visit {provider.name} Portal</span>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-300" />
              </a>
            </div>
          </div>

          {/* Right Column: Awarded Task Orders (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-xl bg-[#111113] border border-white/10 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-mono text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Rocket className="w-4 h-4 text-[#E03C31]" />
                  <span>Awarded Deliveries</span>
                </span>
                <span className="text-[10px] font-mono text-zinc-400">
                  {awardedMissions.length} Missions
                </span>
              </div>

              {awardedMissions.length > 0 ? (
                <div className="space-y-3">
                  {awardedMissions.map((m) => (
                    <div
                      key={m.id}
                      className="p-3.5 rounded-lg bg-black/60 border border-white/10 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{m.name}</span>
                        <span className="font-mono text-[10px] text-zinc-400 font-bold">{m.taskOrder}</span>
                      </div>
                      <p className="text-zinc-400 text-[11px] line-clamp-2">{m.summary}</p>
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
                  This contractor is eligible to bid on upcoming task order competitions under the master CLPS IDIQ contract.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 5. RELATED PROVIDERS */}
        <section className="mt-20 pt-10 border-t border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 font-bold block">
                Commercial Aerospace Fleet
              </span>
              <h3 className="font-heading text-2xl font-extrabold text-white mt-1">
                Explore Other Commercial Providers
              </h3>
            </div>
            <button
              type="button"
              onClick={onBack}
              className="text-xs font-mono text-[#E03C31] hover:underline font-bold flex items-center gap-1"
            >
              <span>View All 13 Contractors</span>
              <NasaRedArrow size="sm" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProviders.map((p) => {
              const relImg = getImageForEntity(p.id, p.name);
              return (
                <article
                  key={p.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectProvider?.(p.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectProvider?.(p.id);
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
                        {p.statusLabel}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-heading font-bold text-base text-white group-hover:text-white transition-colors">
                      {p.name}
                    </h4>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                      {p.historicalAccomplishment}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-zinc-300">
                    <span>{p.headquarters}</span>
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
