import React, { useState, useMemo } from 'react';
import {
  ExternalLink,
  Table as TableIcon,
  Grid,
} from 'lucide-react';
import type { Mission, Provider } from '../../types';
import { Badge } from '../common/Badge';
import { NasaRedArrow } from '../common/NasaRedArrow';
import { getProviders, getMissions } from '../../data';
import { getImageForEntity } from '../../data/imagery';

export interface ProvidersDirectoryProps {
  onSelectMission?: (mission: Mission) => void;
  onSelectProvider?: (provider: Provider) => void;
}

export const ProvidersDirectory: React.FC<ProvidersDirectoryProps> = ({
  onSelectMission,
  onSelectProvider,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const allProviders = useMemo(() => getProviders(), []);
  const allMissions = useMemo(() => getMissions(), []);

  const filteredProviders = useMemo(() => {
    return allProviders.filter((provider) => {
      if (selectedStatus === 'all') return true;
      if (selectedStatus === 'awarded') return provider.status === 'awarded';
      if (selectedStatus === 'eligible') return provider.status === 'eligible_pool';
      if (selectedStatus === 'defunct') return provider.status === 'acquired_defunct';
      return true;
    });
  }, [allProviders, selectedStatus]);

  const awardedCount = allProviders.filter((p) => p.status === 'awarded').length;
  const eligibleCount = allProviders.filter((p) => p.status === 'eligible_pool').length;
  const defunctCount = allProviders.filter((p) => p.status === 'acquired_defunct').length;

  return (
    <div className="space-y-6 text-white">
      {/* ── Directory Header & Understated Filter Bar ── */}
      <div className="space-y-4 pb-4 border-b border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
          <div>
            <h2 className="font-heading font-bold text-xl sm:text-2xl text-white tracking-tight">
              Commercial Vendor Directory &amp; Lander Matrix
            </h2>
            <p className="text-xs text-zinc-400 mt-1 font-sans">
              American aerospace contractors and lander development teams participating in the CLPS initiative
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="inline-flex rounded-md p-0.5 bg-[#0e0e11] border border-white/10" role="group" aria-label="Directory layout">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                aria-label="Grid layout"
                className={`p-1.5 rounded text-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white ${
                  viewMode === 'grid' ? 'bg-white/15 text-white font-semibold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                aria-label="Table layout"
                className={`p-1.5 rounded text-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white ${
                  viewMode === 'table' ? 'bg-white/15 text-white font-semibold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Status Filter Tabs (Understated segmented control) */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1" aria-label="Contractor Status Filters">
          {[
            { id: 'all', label: `All Companies (${allProviders.length})` },
            { id: 'awarded', label: `Awarded Contractors (${awardedCount})` },
            { id: 'eligible', label: `Eligible Pool (${eligibleCount})` },
            { id: 'defunct', label: `Historical / Defunct (${defunctCount})` },
          ].map((tab) => {
            const isActive = selectedStatus === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedStatus(tab.id)}
                className={`text-xs px-3 py-1.5 rounded-md font-mono transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                  isActive
                    ? 'bg-white/15 text-white font-bold border border-white/30 shadow-sm'
                    : 'bg-transparent text-zinc-400 hover:text-white hover:bg-white/5 border border-white/10'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count */}
      <div className="text-xs font-mono text-zinc-400 px-1">
        Showing {filteredProviders.length} of {allProviders.length} evaluated aerospace entities
      </div>

      {/* Grid or Table Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredProviders.map((provider) => {
            const providerMissions = allMissions.filter((m) => m.providerId === provider.id);
            const isAwarded = provider.status === 'awarded';
            const imageRecord = getImageForEntity(provider.id, provider.name);

            return (
              <article
                key={provider.id}
                className="rounded-lg border border-white/10 bg-[#0e0e11] hover:border-white/25 flex flex-col justify-between overflow-hidden transition-all duration-200 shadow-sm group"
              >
                {/* 1. TOP CINEMATIC LUNAR SPACECRAFT IMAGE FRAME */}
                <div className="relative aspect-[16/9] w-full bg-black overflow-hidden border-b border-white/10">
                  <img
                    src={imageRecord.imageUrl}
                    alt={`${provider.name} lunar lander`}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter contrast-[1.05]"
                  />

                  {/* Dark gradient scrims for contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                  {/* Top Badges Overlay */}
                  <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-black/80 text-white border border-white/20 backdrop-blur-sm">
                      {imageRecord.imageType === 'photograph' ? 'Flight Hardware' : 'Lander Architecture'}
                    </span>

                    <Badge
                      variant={isAwarded ? 'blue' : provider.status === 'acquired_defunct' ? 'amber' : 'neutral'}
                      size="sm"
                    >
                      {isAwarded ? 'Awarded Prime' : provider.status === 'acquired_defunct' ? 'Defunct (Acquired)' : 'Eligible Catalog'}
                    </Badge>
                  </div>

                  {/* Bottom Credit Tag */}
                  <div className="absolute bottom-2 inset-x-2.5 text-[10px] font-mono text-zinc-400 drop-shadow">
                    Credit: {imageRecord.credit}
                  </div>
                </div>

                {/* 2. CARD BODY & ESSENTIAL DISCOVERY METRICS */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    {/* Header: Name and Location */}
                    <div>
                      <h3 className="font-heading font-bold text-lg text-white group-hover:text-[#38BDF8] transition-colors tracking-tight">
                        {provider.name}
                      </h3>
                      <p className="text-xs text-zinc-400 font-mono mt-0.5">
                        {provider.headquarters} • Founded {provider.foundedYear} • {provider.stockTicker}
                      </p>
                    </div>

                    {/* Short Editorial Overview */}
                    <p className="text-xs text-zinc-300 leading-relaxed font-sans line-clamp-2">
                      {provider.historicalAccomplishment}
                    </p>

                    {/* Essential Fleet & Delivery Context */}
                    <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-2 text-xs font-mono">
                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-semibold">
                          Lander Fleet
                        </span>
                        <span className="text-zinc-200 truncate block mt-0.5">
                          {provider.landers.map((l) => l.name).join(', ')}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-semibold">
                          Task Orders
                        </span>
                        <div className="text-zinc-200 mt-0.5 font-bold">
                          {provider.awardedTaskOrders.length > 0 ? (
                            <div className="flex flex-col gap-0.5">
                              <span>{provider.awardedTaskOrders.length} Deliveries</span>
                              {providerMissions.length > 0 && onSelectMission && (
                                <div className="flex flex-wrap gap-1">
                                  {providerMissions.map((m) => (
                                    <button
                                      key={m.id}
                                      type="button"
                                      onClick={() => onSelectMission(m)}
                                      className="text-[10px] text-zinc-400 hover:text-white underline decoration-white/20 transition-colors"
                                      title={`Inspect mission: ${m.name}`}
                                    >
                                      {m.taskOrder}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span>Eligible Pool</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Corporate Link & Dossier Action */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                    <a
                      href={provider.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-zinc-400 hover:text-white transition-colors"
                    >
                      <span>Website</span>
                      <ExternalLink className="w-3 h-3 text-zinc-400" aria-hidden="true" />
                    </a>

                    {onSelectProvider && (
                      <button
                        type="button"
                        onClick={() => onSelectProvider(provider)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold font-mono uppercase text-white hover:text-[#38BDF8] transition-colors py-1 px-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white rounded group-hover:text-[#38BDF8]"
                      >
                        <span>Explore Provider</span>
                        <span className="sr-only">Dossier</span>
                        <NasaRedArrow size="sm" />
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* Comparative Specifications Matrix Table */
        <div className="rounded-lg border border-white/10 bg-[#0e0e11] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-black border-b border-white/10 text-zinc-300 font-mono text-[11px]">
                <tr>
                  <th scope="col" className="p-3 font-semibold">Vendor</th>
                  <th scope="col" className="p-3 font-semibold">Status</th>
                  <th scope="col" className="p-3 font-semibold">Lander Models</th>
                  <th scope="col" className="p-3 font-semibold">Payload Capacity</th>
                  <th scope="col" className="p-3 font-semibold">Propulsion Chemistry</th>
                  <th scope="col" className="p-3 font-semibold">Awarded Orders</th>
                  <th scope="col" className="p-3 font-semibold">Total Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-zinc-200">
                {filteredProviders.map((provider) => {
                  const landerNames = provider.landers.map((l) => l.name).join(', ');
                  const maxCap = Math.max(...provider.landers.map((l) => l.payloadCapacityKg));
                  const propTypes = Array.from(new Set(provider.landers.map((l) => l.propulsionType))).join(' / ');

                  return (
                    <tr key={provider.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-3 font-semibold text-white">
                        <div>{provider.name}</div>
                        <div className="text-[10px] font-mono text-zinc-400">{provider.headquarters}</div>
                      </td>
                      <td className="p-3">
                        <Badge
                          variant={provider.status === 'awarded' ? 'blue' : provider.status === 'acquired_defunct' ? 'amber' : 'neutral'}
                          size="sm"
                        >
                          {provider.statusLabel}
                        </Badge>
                      </td>
                      <td className="p-3 font-mono text-zinc-300">
                        {landerNames}
                      </td>
                      <td className="p-3 font-mono text-white font-bold">
                        {maxCap >= 1000 ? `${(maxCap / 1000).toLocaleString()} t` : `${maxCap.toLocaleString()} kg`}
                      </td>
                      <td className="p-3 text-[11px] text-zinc-400">
                        {propTypes}
                      </td>
                      <td className="p-3 font-mono text-xs text-zinc-300">
                        {provider.awardedTaskOrders.join(', ') || 'Eligible Pool'}
                      </td>
                      <td className="p-3 font-mono text-white font-bold text-xs">
                        {provider.totalAwardValue}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
