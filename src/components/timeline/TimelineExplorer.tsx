import React, { useState, useMemo } from 'react';
import {
  Calendar,
  MapPin,
  Layers,
  ChevronRight,
  BarChart2,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react';
import type { Mission } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Button } from '../common/Button';
import { getMissions, getProviders, getPayloads } from '../../data';
import { getImageForEntity } from '../../data/imagery';

export interface TimelineExplorerProps {
  onSelectMission: (mission: Mission) => void;
}

export const TimelineExplorer: React.FC<TimelineExplorerProps> = ({
  onSelectMission,
}) => {
  const [selectedEra, setSelectedEra] = useState<string>('all');
  const [showAnalytics, setShowAnalytics] = useState<boolean>(false);

  const allMissions = useMemo(() => {
    // Sort chronologically by launchDate (null/future dates at end)
    return [...getMissions()].sort((a, b) => {
      if (!a.launchDate && !b.launchDate) return 0;
      if (!a.launchDate) return 1;
      if (!b.launchDate) return -1;
      return a.launchDate.localeCompare(b.launchDate);
    });
  }, []);

  const allProviders = useMemo(() => getProviders(), []);
  const allPayloads = useMemo(() => getPayloads(), []);

  // Compute analytics data
  const yearlyDistribution = useMemo(() => {
    const counts: Record<string, { total: number; flown: number; planned: number }> = {
      '2024': { total: 0, flown: 0, planned: 0 },
      '2025': { total: 0, flown: 0, planned: 0 },
      '2026': { total: 0, flown: 0, planned: 0 },
      '2027': { total: 0, flown: 0, planned: 0 },
      '2028': { total: 0, flown: 0, planned: 0 },
    };

    allMissions.forEach((m) => {
      const yr = m.launchDate ? m.launchDate.substring(0, 4) : '2028';
      if (!counts[yr]) {
        counts[yr] = { total: 0, flown: 0, planned: 0 };
      }
      counts[yr].total += 1;
      if (m.status === 'delivered' || m.status === 'landed_anomaly' || m.status === 'transit_loss') {
        counts[yr].flown += 1;
      } else {
        counts[yr].planned += 1;
      }
    });

    return Object.entries(counts).sort(([a], [b]) => a.localeCompare(b));
  }, [allMissions]);

  const providerDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    allMissions.forEach((m) => {
      counts[m.providerId] = (counts[m.providerId] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([id, count]) => {
        const prov = allProviders.find((p) => p.id === id);
        return { id, name: prov ? prov.name : id, count };
      })
      .sort((a, b) => b.count - a.count);
  }, [allMissions, allProviders]);

  const domainDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    allPayloads.forEach((p) => {
      counts[p.categoryLabel] = (counts[p.categoryLabel] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);
  }, [allPayloads]);

  // Filter missions by era
  const filteredMissions = useMemo(() => {
    return allMissions.filter((mission) => {
      if (selectedEra === 'all') return true;
      if (selectedEra === 'flown') {
        return mission.status === 'landed_anomaly' || mission.status === 'delivered' || mission.status === 'transit_loss';
      }
      if (selectedEra === 'near_term') {
        return mission.launchDate?.startsWith('2025') || mission.launchDate?.startsWith('2026');
      }
      if (selectedEra === 'future') {
        return mission.launchDate?.startsWith('2027') || mission.launchDate?.startsWith('2028') || !mission.launchDate;
      }
      return true;
    });
  }, [allMissions, selectedEra]);

  return (
    <div className="space-y-6 text-white">
      {/* Top Filter and Timeline Header */}
      <div className="space-y-4 pb-4 border-b border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
          <div>
            <h2 className="font-heading font-bold text-xl sm:text-2xl text-white tracking-tight">
              Flight Continuum &amp; Chronological Schedule
            </h2>
            <p className="text-xs text-zinc-400 mt-1 font-sans max-w-2xl">
              Chronological flight progression from inaugural 2024 test flights through 2028 heavy logistics deliveries
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowAnalytics((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#0e0e11] hover:bg-white/10 border border-white/15 text-xs font-mono text-zinc-300 hover:text-white transition-colors"
            >
              <BarChart2 className="w-3.5 h-3.5 text-[#38BDF8]" aria-hidden="true" />
              <span>{showAnalytics ? 'Hide Analytics' : 'Flight Analytics'}</span>
              {showAnalytics ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            <div className="text-xs font-mono text-zinc-400 shrink-0">
              {allMissions.length} Verified Flight Manifests
            </div>
          </div>
        </div>

        {/* Expandable Analytical Charts Panel */}
        {showAnalytics && (
          <div className="p-5 rounded-xl bg-[#0e0e11] border border-white/15 space-y-6 transition-all">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="font-mono text-xs uppercase tracking-wider text-[#38BDF8] font-bold">
                  Program Analytical Breakdown
                </h3>
                <p className="text-[11px] text-zinc-400 font-sans mt-0.5">
                  Verified distribution across annual flight manifests, prime contractors, and science payload domains.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
              {/* Chart 1: Missions by Year */}
              <div className="space-y-3">
                <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-300 font-bold block">
                  Deliveries by Year (2024–2028)
                </span>
                <div className="space-y-2">
                  {yearlyDistribution.map(([year, data]) => {
                    const maxCount = 5;
                    return (
                      <div key={year} className="space-y-1">
                        <div className="flex justify-between font-mono text-[11px]">
                          <span className="text-zinc-300 font-semibold">{year}</span>
                          <span className="text-zinc-400">
                            {data.total} flight{data.total === 1 ? '' : 's'} {data.flown > 0 && `(${data.flown} flown)`}
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden flex">
                          {data.flown > 0 && (
                            <div
                              style={{ width: `${(data.flown / maxCount) * 100}%` }}
                              className="bg-emerald-500 h-full"
                              title={`${data.flown} completed`}
                            />
                          )}
                          {data.planned > 0 && (
                            <div
                              style={{ width: `${(data.planned / maxCount) * 100}%` }}
                              className="bg-[#38BDF8] h-full"
                              title={`${data.planned} planned`}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-3 pt-1 text-[10px] font-mono text-zinc-400">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Flown/Delivered</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
                    <span>Planned Target Window</span>
                  </span>
                </div>
              </div>

              {/* Chart 2: Contractor Deliveries */}
              <div className="space-y-3">
                <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-300 font-bold block">
                  Task Orders Awarded by Provider
                </span>
                <div className="space-y-2">
                  {providerDistribution.map((prov) => {
                    const maxProv = 4;
                    const widthPercent = Math.round((prov.count / maxProv) * 100);
                    return (
                      <div key={prov.id} className="space-y-1">
                        <div className="flex justify-between font-mono text-[11px]">
                          <span className="text-zinc-300 truncate max-w-[160px]">{prov.name}</span>
                          <span className="text-white font-bold">{prov.count} orders</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                          <div
                            style={{ width: `${widthPercent}%` }}
                            className="bg-[#E03C31] h-full rounded-full"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Chart 3: Payloads by Science Domain */}
              <div className="space-y-3">
                <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-300 font-bold block">
                  Manifested NASA Payload Domains
                </span>
                <div className="space-y-2">
                  {domainDistribution.slice(0, 5).map((domain) => {
                    const maxDomain = 8;
                    const widthPercent = Math.round((domain.count / maxDomain) * 100);
                    return (
                      <div key={domain.label} className="space-y-1">
                        <div className="flex justify-between font-mono text-[11px]">
                          <span className="text-zinc-300 truncate max-w-[160px]">{domain.label}</span>
                          <span className="text-white font-bold">{domain.count} instruments</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                          <div
                            style={{ width: `${widthPercent}%` }}
                            className="bg-indigo-400 h-full rounded-full"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-start gap-2 text-[11px] text-zinc-400 font-sans">
              <Info className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                <strong>Methodology & Limitations:</strong> Flight years for 2025–2028 represent NASA target flight windows subject to launch vehicle readiness and monthly synodic illumination windows at landing sites. Excludes commercial co-manifested instruments.
              </span>
            </div>
          </div>
        )}

        {/* Era Filter Selector — Understated segmented control */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {[
            { id: 'all', label: `All Flights (${allMissions.length})` },
            { id: 'flown', label: 'Flown & Completed (3)' },
            { id: 'near_term', label: 'Near-Term (2025–2026)' },
            { id: 'future', label: 'Future Horizons (2027–2028+)' },
          ].map((era) => (
            <button
              key={era.id}
              type="button"
              onClick={() => setSelectedEra(era.id)}
              className={`text-xs px-3 py-1.5 rounded-md font-mono transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                selectedEra === era.id
                  ? 'bg-white/15 text-white font-bold border border-white/30 shadow-sm'
                  : 'bg-transparent text-zinc-400 hover:text-white hover:bg-white/5 border border-white/10'
              }`}
            >
              {era.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chronological Continuum Vertical Timeline */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-[11px] sm:before:left-[15px] before:top-4 before:bottom-4 before:w-[1px] before:bg-white/20">
        {filteredMissions.map((mission, idx) => {
          const providerObj = allProviders.find((p) => p.id === mission.providerId);
          const imageRecord = getImageForEntity(mission.id, mission.name);

          return (
            <div key={mission.id} className="relative group">
              {/* Timeline Sequence Indicator */}
              <div className="absolute -left-[24px] sm:-left-[32px] top-4 w-6 h-6 rounded-full bg-black border border-white/30 flex items-center justify-center group-hover:border-[#E03C31] group-hover:bg-[#E03C31]/20 transition-all z-10">
                <span className="font-mono text-[10px] font-bold text-white">
                  {idx + 1}
                </span>
              </div>

              {/* Main Mission Card */}
              <article className="p-5 sm:p-6 rounded-xl bg-[#0e0e11] border border-white/10 hover:border-white/25 transition-all text-white">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                  {/* Photo Column */}
                  <div className="md:col-span-4 lg:col-span-3 rounded-lg overflow-hidden bg-black/60 aspect-[16/9] md:aspect-[4/3] relative border border-white/10">
                    <img
                      src={imageRecord.imageUrl}
                      alt={`${mission.name} flight article`}
                      className="w-full h-full object-cover filter contrast-105 group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/75 text-[9px] font-mono text-zinc-400">
                      Credit: {imageRecord.credit}
                    </div>
                  </div>

                  {/* Details Column */}
                  <div className="md:col-span-8 lg:col-span-9 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white px-2 py-0.5 rounded bg-white/10 border border-white/20">
                          {mission.taskOrder}
                        </span>
                        <StatusBadge status={mission.status} label={mission.statusLabel} size="sm" />
                      </div>

                      <div className="flex items-center gap-1.5 font-mono text-xs text-zinc-400">
                        <Calendar className="w-3.5 h-3.5 text-zinc-500" aria-hidden="true" />
                        <span>{mission.launchDate || 'Target Window 2026–2028'}</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-heading text-lg sm:text-xl font-bold text-white tracking-tight">
                        {mission.name}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2">
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
                            Commercial Contractor
                          </span>
                          <span className="font-semibold text-white mt-0.5 block">
                            {providerObj ? providerObj.name : mission.providerId} ({mission.landerModel})
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block sm:text-right">
                            Target Destination
                          </span>
                          <span className="text-xs font-mono font-medium text-white flex items-center sm:justify-end gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-[#E03C31]" aria-hidden="true" />
                            <span>{mission.targetRegion}</span>
                          </span>
                        </div>
                      </div>

                      {/* Narrative Summary */}
                      <p className="text-xs text-zinc-400 leading-relaxed font-sans pt-2 line-clamp-3">
                        {mission.summary}
                      </p>
                    </div>

                    {/* Footer Manifest Summary & CTA */}
                    <div className="pt-3 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-white/10">
                      <div className="flex items-center gap-1.5 font-mono text-xs text-zinc-400">
                        <Layers className="w-3.5 h-3.5 text-zinc-500" aria-hidden="true" />
                        <span><strong className="text-white font-bold">{mission.nasaPayloadCount}</strong> NASA Payloads</span>
                      </div>

                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onSelectMission(mission)}
                        icon={<ChevronRight className="w-3.5 h-3.5" />}
                        iconPosition="right"
                      >
                        Inspect Dossier
                      </Button>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          );
        })}
      </div>
    </div>
  );
};
