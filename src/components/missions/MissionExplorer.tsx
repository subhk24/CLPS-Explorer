import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  Filter,
  Grid,
  List as ListIcon,
  Table as TableIcon,
  RotateCcw,
  ArrowUpDown,
} from 'lucide-react';
import type { Mission, MissionSortOption } from '../../types';
import { MissionCard } from './MissionCard';
import { EmptyState } from '../common/EmptyState';
import { StatusBadge } from '../common/StatusBadge';
import { Button } from '../common/Button';
import { getMissions, getProviders, getPayloads } from '../../data';

export interface MissionFilterState {
  search: string;
  status: string;
  provider: string;
  destination: string;
  year: string;
  sort?: MissionSortOption;
}

export interface MissionExplorerProps {
  onSelectMission: (mission: Mission) => void;
  filters?: Partial<MissionFilterState>;
  onFilterChange?: (newFilters: MissionFilterState) => void;
}

export const MissionExplorer: React.FC<MissionExplorerProps> = ({
  onSelectMission,
  filters: initialFilters,
  onFilterChange,
}) => {
  const [search, setSearch] = useState<string>(initialFilters?.search || '');
  const [status, setStatus] = useState<string>(initialFilters?.status || 'all');
  const [provider, setProvider] = useState<string>(initialFilters?.provider || 'all');
  const [destination, setDestination] = useState<string>(initialFilters?.destination || 'all');
  const [year, setYear] = useState<string>(initialFilters?.year || 'all');
  const [sort, setSort] = useState<MissionSortOption>(initialFilters?.sort || 'launch_date_desc');
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'table'>('list');

  const allMissions = useMemo(() => getMissions(), []);
  const allProviders = useMemo(() => getProviders(), []);
  const allPayloads = useMemo(() => getPayloads(), []);

  // Update parent when any filter changes
  const notifyFilterChange = (updated: MissionFilterState) => {
    onFilterChange?.(updated);
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    notifyFilterChange({ search: val, status, provider, destination, year, sort });
  };

  const handleStatusChange = (val: string) => {
    setStatus(val);
    notifyFilterChange({ search, status: val, provider, destination, year, sort });
  };

  const handleProviderChange = (val: string) => {
    setProvider(val);
    notifyFilterChange({ search, status, provider: val, destination, year, sort });
  };

  const handleDestinationChange = (val: string) => {
    setDestination(val);
    notifyFilterChange({ search, status, provider, destination: val, year, sort });
  };

  const handleYearChange = (val: string) => {
    setYear(val);
    notifyFilterChange({ search, status, provider, destination, year: val, sort });
  };

  const handleSortChange = (val: MissionSortOption) => {
    setSort(val);
    notifyFilterChange({ search, status, provider, destination, year, sort: val });
  };

  const handleClearFilters = () => {
    setSearch('');
    setStatus('all');
    setProvider('all');
    setDestination('all');
    setYear('all');
    setSort('launch_date_desc');
    notifyFilterChange({
      search: '',
      status: 'all',
      provider: 'all',
      destination: 'all',
      year: 'all',
      sort: 'launch_date_desc',
    });
  };

  // Distinct destinations and years for dropdowns
  const availableDestinations = useMemo(() => {
    const set = new Set<string>();
    allMissions.forEach((m) => {
      if (m.targetRegion) set.add(m.targetRegion);
    });
    return Array.from(set).sort();
  }, [allMissions]);

  const availableYears = useMemo(() => {
    const set = new Set<string>();
    allMissions.forEach((m) => {
      if (m.launchDate) {
        set.add(m.launchDate.substring(0, 4));
      }
    });
    return Array.from(set).sort();
  }, [allMissions]);

  // Filtered mission results
  const filteredMissions = useMemo(() => {
    return allMissions.filter((mission) => {
      // 1. Status Filter
      if (status !== 'all') {
        if (status === 'landed') {
          if (mission.status !== 'landed_anomaly' && mission.status !== 'landed_nominal' && mission.status !== 'delivered') {
            return false;
          }
        } else if (mission.status !== status) {
          return false;
        }
      }

      // 2. Provider Filter
      if (provider !== 'all' && mission.providerId !== provider) {
        return false;
      }

      // 3. Destination Filter
      if (destination !== 'all' && mission.targetRegion !== destination) {
        return false;
      }

      // 4. Launch Year Filter
      if (year !== 'all') {
        if (!mission.launchDate || !mission.launchDate.startsWith(year)) {
          return false;
        }
      }

      // 5. Keyword search: mission name, task order, lander, target region, objectives, and payload acronyms
      if (search.trim()) {
        const query = search.toLowerCase().trim();
        const matchesName = mission.name.toLowerCase().includes(query);
        const matchesOrder = mission.taskOrder.toLowerCase().includes(query);
        const matchesLander = mission.landerModel.toLowerCase().includes(query);
        const matchesDest = mission.targetRegion.toLowerCase().includes(query);
        const matchesSummary = mission.summary.toLowerCase().includes(query);
        const matchesObjectives = mission.scientificObjectives.toLowerCase().includes(query);

        // Check if query matches any Manifested Payload in this mission
        const missionPayloads = allPayloads.filter((p) => p.missionId === mission.id);
        const matchesPayload = missionPayloads.some(
          (p) =>
            p.acronym.toLowerCase().includes(query) ||
            p.name.toLowerCase().includes(query)
        );

        if (
          !matchesName &&
          !matchesOrder &&
          !matchesLander &&
          !matchesDest &&
          !matchesSummary &&
          !matchesObjectives &&
          !matchesPayload
        ) {
          return false;
        }
      }

      return true;
    });
  }, [allMissions, allPayloads, status, provider, destination, year, search]);

  // Sorted mission results
  const sortedMissions = useMemo(() => {
    return [...filteredMissions].sort((a, b) => {
      switch (sort) {
        case 'launch_date_asc': {
          const da = a.launchDate || '9999-99-99';
          const db = b.launchDate || '9999-99-99';
          return da.localeCompare(db);
        }
        case 'landing_date_desc': {
          const da = a.landingDate || '0000-00-00';
          const db = b.landingDate || '0000-00-00';
          return db.localeCompare(da);
        }
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'provider_asc':
          return a.providerId.localeCompare(b.providerId);
        case 'payloads_desc':
          return b.nasaPayloadCount - a.nasaPayloadCount;
        case 'launch_date_desc':
        default: {
          const da = a.launchDate || '0000-00-00';
          const db = b.launchDate || '0000-00-00';
          return db.localeCompare(da);
        }
      }
    });
  }, [filteredMissions, sort]);

  const hasActiveFilters =
    search.trim() !== '' ||
    status !== 'all' ||
    provider !== 'all' ||
    destination !== 'all' ||
    year !== 'all';

  return (
    <div className="space-y-6 text-white">
      {/* ── Search & Filter Suite (Professional, restrained scientific search) ── */}
      <div className="space-y-4 pb-4 border-b border-white/10">
        {/* 1. Main Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
          <input
            id="mission-search-input"
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by mission, task order (TO2-IM), lander, region, or payload acronym (TRIDENT)..."
            className="w-full pl-10 pr-10 py-2.5 rounded-md bg-[#0e0e11] border border-white/15 hover:border-white/25 focus:border-[#38BDF8] text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#38BDF8] transition-colors"
          />
          {search && (
            <button
              type="button"
              onClick={() => handleSearchChange('')}
              aria-label="Clear search query"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 2. Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5" aria-label="Mission flight status">
          {[
            { id: 'all', label: `All Deliveries (${allMissions.length})` },
            { id: 'landed', label: 'Landed / Delivered (2)' },
            { id: 'planned', label: 'Planned Windows (9)' },
            { id: 'transit_loss', label: 'Transit Loss (1)' },
            { id: 'testing', label: 'Flight Test (1)' },
          ].map((tab) => {
            const isActive = status === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleStatusChange(tab.id)}
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

        {/* 3. Understated Dropdowns & View Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* Provider Filter */}
            <div className="flex items-center gap-1.5">
              <label htmlFor="filter-provider" className="text-zinc-400 font-mono text-[11px] uppercase tracking-wider font-semibold">
                Commercial Provider
              </label>
              <select
                id="filter-provider"
                value={provider}
                onChange={(e) => handleProviderChange(e.target.value)}
                className="px-2.5 py-1.5 rounded-md bg-[#0e0e11] border border-white/15 text-xs text-white focus:outline-none focus:border-[#38BDF8]"
              >
                <option value="all">All Providers ({allProviders.length})</option>
                {allProviders.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Destination Filter */}
            <div className="flex items-center gap-1.5">
              <label htmlFor="filter-destination" className="text-zinc-400 font-mono text-[11px] uppercase tracking-wider font-semibold">
                Destination
              </label>
              <select
                id="filter-destination"
                value={destination}
                onChange={(e) => handleDestinationChange(e.target.value)}
                className="px-2.5 py-1.5 rounded-md bg-[#0e0e11] border border-white/15 text-xs text-white focus:outline-none focus:border-[#38BDF8]"
              >
                <option value="all">All Target Regions ({availableDestinations.length})</option>
                {availableDestinations.map((dest) => (
                  <option key={dest} value={dest}>
                    {dest}
                  </option>
                ))}
              </select>
            </div>

            {/* Launch Year Filter */}
            <div className="flex items-center gap-1.5">
              <label htmlFor="filter-year" className="text-zinc-400 font-mono text-[11px] uppercase tracking-wider font-semibold">
                Flight Year
              </label>
              <select
                id="filter-year"
                value={year}
                onChange={(e) => handleYearChange(e.target.value)}
                className="px-2.5 py-1.5 rounded-md bg-[#0e0e11] border border-white/15 text-xs text-white focus:outline-none focus:border-[#38BDF8]"
              >
                <option value="all">All Flight Years</option>
                {availableYears.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Control */}
            <div className="flex items-center gap-1.5">
              <label htmlFor="sort-missions" className="text-zinc-400 font-mono text-[11px] uppercase tracking-wider font-semibold flex items-center gap-1">
                <ArrowUpDown className="w-3 h-3 text-zinc-400" aria-hidden="true" />
                <span>Sort</span>
              </label>
              <select
                id="sort-missions"
                value={sort}
                onChange={(e) => handleSortChange(e.target.value as MissionSortOption)}
                className="px-2.5 py-1.5 rounded-md bg-[#0e0e11] border border-white/15 text-xs text-white focus:outline-none focus:border-[#38BDF8]"
              >
                <option value="launch_date_desc">Launch Date (Newest first)</option>
                <option value="launch_date_asc">Launch Date (Oldest first)</option>
                <option value="landing_date_desc">Touchdown (Historical first)</option>
                <option value="name_asc">Mission Name (A-Z)</option>
                <option value="provider_asc">Provider Name (A-Z)</option>
                <option value="payloads_desc">NASA Payloads (Most first)</option>
              </select>
            </div>
          </div>

          {/* View Mode Controls & Reset */}
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-white px-2 py-1 rounded transition-colors"
              >
                <RotateCcw className="w-3 h-3 text-[#E03C31]" />
                <span className="font-mono text-[11px] text-[#E03C31] hover:underline font-semibold">Reset</span>
              </button>
            )}

            <div className="inline-flex rounded-md p-0.5 bg-[#0e0e11] border border-white/10" role="group" aria-label="Layout view mode">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                aria-label="List layout"
                className={`p-1.5 rounded text-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white ${
                  viewMode === 'list' ? 'bg-white/15 text-white font-semibold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <ListIcon className="w-3.5 h-3.5" />
              </button>
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

        {/* 4. Active Filter Tags */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs font-mono">
            <span className="text-zinc-400 text-[11px] flex items-center gap-1 font-semibold">
              <Filter className="w-3 h-3 text-zinc-400" aria-hidden="true" />
              <span>Active Filters:</span>
            </span>

            {search && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 text-white border border-white/15 text-[11px]">
                Search: "{search}"
                <button
                  type="button"
                  onClick={() => handleSearchChange('')}
                  className="hover:text-[#E03C31]"
                  aria-label="Remove search filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {status !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 text-white border border-white/15 text-[11px]">
                Status: {status}
                <button
                  type="button"
                  onClick={() => handleStatusChange('all')}
                  className="hover:text-[#E03C31]"
                  aria-label="Remove status filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {provider !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 text-white border border-white/15 text-[11px]">
                Provider: {provider}
                <button
                  type="button"
                  onClick={() => handleProviderChange('all')}
                  className="hover:text-[#E03C31]"
                  aria-label="Remove provider filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {destination !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 text-white border border-white/15 text-[11px]">
                Region: {destination}
                <button
                  type="button"
                  onClick={() => handleDestinationChange('all')}
                  className="hover:text-[#E03C31]"
                  aria-label="Remove destination filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {year !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 text-white border border-white/15 text-[11px]">
                Year: {year}
                <button
                  type="button"
                  onClick={() => handleYearChange('all')}
                  className="hover:text-[#E03C31]"
                  aria-label="Remove year filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Results Header ── */}
      <div className="flex items-center justify-between text-xs font-mono text-zinc-400 px-1" aria-live="polite">
        <span>
          Showing {sortedMissions.length} of {allMissions.length} verified commercial deliveries
        </span>
      </div>

      {/* ── Results List: Vertical List (Default) / Grid / Table ── */}
      {sortedMissions.length > 0 ? (
        viewMode === 'list' ? (
          <div className="space-y-3.5">
            {sortedMissions.map((mission) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                onSelect={onSelectMission}
                variant="row"
              />
            ))}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedMissions.map((mission) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                onSelect={onSelectMission}
                variant="card"
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-white/10 bg-[#0e0e11] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-black border-b border-white/10 text-zinc-300 font-mono text-[11px]">
                  <tr>
                    <th scope="col" className="p-3 font-semibold">Task Order / Name</th>
                    <th scope="col" className="p-3 font-semibold">Provider</th>
                    <th scope="col" className="p-3 font-semibold">Lander</th>
                    <th scope="col" className="p-3 font-semibold">Destination</th>
                    <th scope="col" className="p-3 font-semibold">Launch Date</th>
                    <th scope="col" className="p-3 font-semibold">Status</th>
                    <th scope="col" className="p-3 text-center font-semibold">Payloads</th>
                    <th scope="col" className="p-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-zinc-200">
                  {sortedMissions.map((mission) => {
                    const providerObj = allProviders.find((p) => p.id === mission.providerId);
                    return (
                      <tr
                        key={mission.id}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="p-3 font-semibold text-white">
                          <div>{mission.name}</div>
                          <div className="text-[10px] font-mono text-zinc-400 font-bold">{mission.taskOrder}</div>
                        </td>
                        <td className="p-3 text-zinc-400">
                          {providerObj ? providerObj.name : mission.providerId}
                        </td>
                        <td className="p-3 font-mono text-zinc-400">
                          {mission.landerModel}
                        </td>
                        <td className="p-3 text-zinc-200">
                          {mission.targetRegion}
                        </td>
                        <td className="p-3 font-mono text-zinc-400">
                          {mission.launchDate || 'Target 2026-2028'}
                        </td>
                        <td className="p-3">
                          <StatusBadge status={mission.status} label={mission.statusLabel} size="sm" />
                        </td>
                        <td className="p-3 text-center font-mono font-bold text-white">
                          {mission.nasaPayloadCount}
                        </td>
                        <td className="p-3 text-right">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => onSelectMission(mission)}
                          >
                            Dossier
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        <EmptyState
          title="No deliveries match your active filters"
          description={`No missions found matching your current search criteria. Try removing one or more filters or searching for another keyword.`}
          onReset={handleClearFilters}
        />
      )}
    </div>
  );
};
