import React, { useState, useMemo } from 'react';
import {
  Rocket,
  Layers,
  MapPin,
  Building2,
  ExternalLink,
  X,
  Sparkles,
  ArrowRight,
  Compass,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { getMissions, getPayloads, getProviders, getLandingSites } from '../../data';
import { getImageForEntity } from '../../data/imagery';
import { ScientificImageCard } from '../common/ScientificImageCard';
import { Button } from '../common/Button';
import type { Mission } from '../../types';

export interface MissionRelationshipGraphProps {
  onSelectMission?: (mission: Mission) => void;
  onSelectSite?: (siteId: string) => void;
  className?: string;
}

export type EntityType =
  | 'objective'
  | 'mission'
  | 'provider'
  | 'lander'
  | 'payload'
  | 'destination'
  | 'outcome';

export interface SelectedEntity {
  type: EntityType;
  id: string;
  title: string;
  subtitle: string;
  description: string;
  details: Record<string, string>;
  relatedMissionId?: string;
  relatedSiteId?: string;
  sourceUrl: string;
}

export const MissionRelationshipGraph: React.FC<MissionRelationshipGraphProps> = ({
  onSelectMission,
  onSelectSite,
  className = '',
}) => {
  const allMissions = useMemo(() => getMissions(), []);
  const allPayloads = useMemo(() => getPayloads(), []);
  const allProviders = useMemo(() => getProviders(), []);
  const allSites = useMemo(() => getLandingSites(), []);

  // Pre-configured rich verified pathways for immediate exploration
  const PRESET_PATHWAYS = [
    {
      id: 'to2-im',
      label: 'TO2-IM (IM-1 Odysseus)',
      objective: 'Plume Scour & Real-Time Lidar Navigation',
      missionId: 'to2-im',
      providerId: 'intuitive-machines',
      lander: 'Nova-C Class',
      payloadId: 'ndl',
      siteId: 'malapert-a',
      outcome: 'First commercial lunar soft landing (Feb 2024); descent lidar patch verified in-flight.',
    },
    {
      id: 'to19d',
      label: 'TO19D (Blue Ghost 1)',
      objective: 'Basaltic Geophysics & Solar Wind Interaction',
      missionId: 'to19d',
      providerId: 'firefly',
      lander: 'Blue Ghost 1',
      payloadId: 'lister',
      siteId: 'mare-crisium',
      outcome: 'First subsurface heat flow & regolith thermal conductivity profile in Mare Crisium.',
    },
    {
      id: 'prime-1',
      label: 'PRIME-1 (IM-2)',
      objective: 'Volatiles & Deep Ice Prospecting',
      missionId: 'prime-1',
      providerId: 'intuitive-machines',
      lander: 'Nova-C Class',
      payloadId: 'trident-drill',
      siteId: 'shackleton-connecting-ridge',
      outcome: 'First 1-meter sub-surface drilling for lunar volatiles & mass spectrometer analysis.',
    },
    {
      id: 'cp-21',
      label: 'CP-21 (Gruithuisen Domes)',
      objective: 'Silicic Volcanism & Magmatic Differentiation',
      missionId: 'cp-21',
      providerId: 'firefly',
      lander: 'Blue Ghost 2',
      payloadId: 'lunar-vulkan-suite',
      siteId: 'gruithuisen-domes',
      outcome: 'Unravels volcanic crustal evolution that created rare silicic domes without water plate tectonics.',
    },
    {
      id: 'cs-34',
      label: 'CS-3/4 (Far Side FSS)',
      objective: 'Deep Far Side Geophysics & Seismic Suite',
      missionId: 'cs-34',
      providerId: 'firefly',
      lander: 'Blue Ghost Derivative',
      payloadId: 'fss',
      siteId: 'schrodinger-basin',
      outcome: 'First long-duration seismic monitoring station operating on the radio-quiet far side.',
    },
  ];

  const [activePathwayId, setActivePathwayId] = useState<string>('to2-im');
  const [selectedEntity, setSelectedEntity] = useState<SelectedEntity | null>(null);

  // Active pathway resolution
  const activePathway = useMemo(() => {
    return PRESET_PATHWAYS.find((p) => p.id === activePathwayId) || PRESET_PATHWAYS[0];
  }, [activePathwayId]);

  const activeMission = useMemo(() => {
    return allMissions.find((m) => m.id === activePathway.missionId) || allMissions[0];
  }, [allMissions, activePathway]);

  const activeProvider = useMemo(() => {
    return allProviders.find((p) => p.id === activePathway.providerId);
  }, [allProviders, activePathway]);

  const activePayload = useMemo(() => {
    return allPayloads.find((p) => p.id === activePathway.payloadId) || allPayloads[0];
  }, [allPayloads, activePathway]);

  const activeSite = useMemo(() => {
    return allSites.find((s) => s.id === activePathway.siteId) || allSites[0];
  }, [allSites, activePathway]);

  // Click handler to open entity details
  const handleEntityClick = (type: EntityType) => {
    switch (type) {
      case 'objective':
        setSelectedEntity({
          type: 'objective',
          id: activePathway.id,
          title: activePathway.objective,
          subtitle: 'NASA Science Mission Directorate Priority',
          description:
            activeMission.scientificObjectives ||
            'Core NASA science inquiry conducted under the Commercial Lunar Payload Services IDIQ delivery contract.',
          details: {
            'Domain Category': activePayload.category,
            'Host Mission': activeMission.name,
            'Contract Model': 'Firm-Fixed-Price (FFP)',
          },
          relatedMissionId: activeMission.id,
          sourceUrl: activeMission.sourceUrl,
        });
        break;

      case 'mission':
        setSelectedEntity({
          type: 'mission',
          id: activeMission.id,
          title: `${activeMission.name} (${activeMission.taskOrder})`,
          subtitle: `Commercial Delivery • ${activeMission.statusLabel}`,
          description: activeMission.summary,
          details: {
            'Task Order': activeMission.taskOrder,
            'Launch Vehicle': activeMission.launchVehicle,
            'Target Destination': activeMission.targetRegion,
            'NASA Instruments': `${activeMission.nasaPayloadCount} manifested`,
          },
          relatedMissionId: activeMission.id,
          relatedSiteId: activeSite.id,
          sourceUrl: activeMission.sourceUrl,
        });
        break;

      case 'provider':
        if (activeProvider) {
          setSelectedEntity({
            type: 'provider',
            id: activeProvider.id,
            title: activeProvider.name,
            subtitle: `CLPS Prime Contractor • Founded ${activeProvider.foundedYear}`,
            description: activeProvider.historicalAccomplishment,
            details: {
              'Headquarters': activeProvider.headquarters,
              'Stock / Corporate': activeProvider.stockTicker,
              'Total Award Value': activeProvider.totalAwardValue,
              'Awarded Deliveries': activeProvider.awardedTaskOrders.join(', '),
            },
            relatedMissionId: activeMission.id,
            sourceUrl: activeProvider.websiteUrl,
          });
        }
        break;

      case 'lander':
        setSelectedEntity({
          type: 'lander',
          id: activeMission.landerModel,
          title: `${activeMission.landerModel} Spacecraft`,
          subtitle: `Commercial Lunar Surface Access Architecture`,
          description: `Contracted autonomous robotic lander delivering scientific payloads to the lunar surface. Features cryogenic propulsion, autonomous precision hazard avoidance, and surface power distribution.`,
          details: {
            'Provider': activeProvider ? activeProvider.name : activeMission.providerId,
            'Host Flight': activeMission.name,
            'Payload Target': activeMission.targetRegion,
          },
          relatedMissionId: activeMission.id,
          sourceUrl: activeMission.sourceUrl,
        });
        break;

      case 'payload':
        setSelectedEntity({
          type: 'payload',
          id: activePayload.id,
          title: `${activePayload.acronym}: ${activePayload.name}`,
          subtitle: `Science Capability Domain: ${activePayload.category}`,
          description: activePayload.description,
          details: {
            'Lead Center': activePayload.leadCenter,
            'Principal Investigator': activePayload.leadPi || 'NASA SMD Investigation Team',
            'Primary Question': `"${activePayload.scientificQuestion}"`,
            'Manifest Flight': activeMission.name,
          },
          relatedMissionId: activeMission.id,
          sourceUrl: activePayload.sourceUrl || activeMission.sourceUrl,
        });
        break;

      case 'destination':
        setSelectedEntity({
          type: 'destination',
          id: activeSite.id,
          title: `${activeSite.name} (${activeSite.hemisphere})`,
          subtitle: `Selenographic Touchdown Coordinates`,
          description: activeSite.scientificSignificance,
          details: {
            'Latitude': `${activeSite.coordinates.latitude}°`,
            'Longitude': `${activeSite.coordinates.longitude}°`,
            'LOLA Elevation': `${activeSite.coordinates.elevationMeters} m`,
            'Geological Terrain': activeSite.geologicalDescription,
          },
          relatedMissionId: activeMission.id,
          relatedSiteId: activeSite.id,
          sourceUrl: activeMission.sourceUrl,
        });
        break;

      case 'outcome':
        setSelectedEntity({
          type: 'outcome',
          id: 'outcome',
          title: 'Expected Scientific Outcome',
          subtitle: 'Artemis Science Architecture Deliverable',
          description: activePathway.outcome,
          details: {
            'Associated Payload': activePayload.acronym,
            'Target Basin / Highland': activeSite.name,
            'Programmatic Impact': 'Directly establishes operational ground truth for Artemis crewed landings.',
          },
          relatedMissionId: activeMission.id,
          relatedSiteId: activeSite.id,
          sourceUrl: activeMission.sourceUrl,
        });
        break;
    }
  };

  return (
    <div className={`rounded-xl border border-white/10 bg-[#111111] shadow-2xl p-6 sm:p-8 space-y-6 text-white ${className}`}>
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-black/60 border border-white/15 text-xs font-mono font-bold text-zinc-300 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#E03C31]" />
            <span>Interactive Mission Architecture Flow</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white">
            From Science Objective to Lunar Touchdown
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 font-sans mt-0.5 max-w-2xl">
            Trace the verified relationship pipeline connecting NASA science objectives, commercial contractors, landers, science instruments, and selenographic destinations.
          </p>
        </div>

        {/* Pathway Preset Selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="pipeline-selector" className="text-xs font-mono font-bold text-zinc-400 shrink-0">
            Select Flight:
          </label>
          <select
            id="pipeline-selector"
            value={activePathwayId}
            onChange={(e) => setActivePathwayId(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-black/60 border border-white/15 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#E03C31]"
          >
            {PRESET_PATHWAYS.map((p) => (
              <option key={p.id} value={p.id} className="bg-[#161616] text-white">
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Preset Pathway Chips */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-[11px] font-mono text-zinc-400 font-semibold mr-1">
          Explore Delivery Chains:
        </span>
        {PRESET_PATHWAYS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setActivePathwayId(p.id)}
            className={`text-xs px-3 py-1.5 rounded-md font-mono transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
              activePathwayId === p.id
                ? 'bg-[#E03C31] text-white font-bold shadow-sm border border-transparent'
                : 'bg-black/60 text-zinc-300 hover:bg-white/10 hover:text-white border border-white/10'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Interactive Horizontal Pipeline Visualizer */}
      <div className="relative overflow-x-auto py-4">
        <div className="min-w-[960px] grid grid-cols-7 gap-3 items-stretch relative">
          {/* STAGE 1: SCIENCE OBJECTIVE */}
          <button
            type="button"
            onClick={() => handleEntityClick('objective')}
            className="group relative flex flex-col justify-between rounded-xl border border-white/10 bg-[#181818] hover:bg-[#202020] hover:border-white/30 transition-all text-left overflow-hidden shadow-lg hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <div className="relative h-20 w-full overflow-hidden bg-black/40">
              <img
                src="/images/destinations/moon-south-pole.jpg"
                alt="NASA Science Objective"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-70 group-hover:opacity-90"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-black/30 to-transparent" />
              <div className="absolute top-2 left-2.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-white font-bold bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded border border-white/10">
                  01 // Objective
                </span>
              </div>
            </div>
            <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-heading font-bold text-xs text-white leading-tight line-clamp-3">
                  {activePathway.objective}
                </h3>
              </div>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                <span className="truncate">SMD Priority</span>
                <span className="w-5 h-5 rounded-full bg-white/10 group-hover:bg-[#E03C31] text-white flex items-center justify-center transition-colors">
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>
          </button>

          {/* STAGE 2: CLPS DELIVERY MISSION */}
          <button
            type="button"
            onClick={() => handleEntityClick('mission')}
            className="group relative flex flex-col justify-between rounded-xl border-2 border-[#E03C31] bg-[#1a1a1a] hover:border-white transition-all text-left overflow-hidden shadow-lg hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E03C31]"
          >
            <div className="relative h-20 w-full overflow-hidden bg-black/40">
              <img
                src={getImageForEntity(activeMission.id).imageUrl}
                alt={activeMission.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-black/30 to-transparent" />
              <div className="absolute top-2 left-2.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-white font-bold bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded border border-white/20">
                  02 // Mission
                </span>
              </div>
              <div className="absolute top-2 right-2.5">
                <Rocket className="w-3.5 h-3.5 text-zinc-300 drop-shadow" />
              </div>
            </div>
            <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-heading font-bold text-xs text-white leading-tight">
                  {activeMission.name}
                </h3>
                <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono text-white font-bold border border-white/20">
                  {activeMission.taskOrder}
                </span>
              </div>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                <span className="truncate">{activeMission.statusLabel}</span>
                <span className="w-5 h-5 rounded-full bg-white/10 group-hover:bg-[#E03C31] text-white flex items-center justify-center transition-colors">
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>
          </button>

          {/* STAGE 3: COMMERCIAL PROVIDER */}
          <button
            type="button"
            onClick={() => handleEntityClick('provider')}
            className="group relative flex flex-col justify-between rounded-xl border border-white/10 bg-[#181818] hover:bg-[#202020] hover:border-white/30 transition-all text-left overflow-hidden shadow-lg hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <div className="relative h-20 w-full overflow-hidden bg-black/40">
              <img
                src={getImageForEntity(activePathway.providerId).imageUrl}
                alt={activeProvider ? activeProvider.name : activeMission.providerId}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-70 group-hover:opacity-90"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-black/30 to-transparent" />
              <div className="absolute top-2 left-2.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-300 font-bold bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded border border-white/10">
                  03 // Provider
                </span>
              </div>
              <div className="absolute top-2 right-2.5">
                <Building2 className="w-3.5 h-3.5 text-zinc-400 drop-shadow" />
              </div>
            </div>
            <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-heading font-bold text-xs text-white leading-tight">
                  {activeProvider ? activeProvider.name : activeMission.providerId}
                </h3>
              </div>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                <span>Prime FFP</span>
                <span className="w-5 h-5 rounded-full bg-white/10 group-hover:bg-[#E03C31] text-white flex items-center justify-center transition-colors">
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>
          </button>

          {/* STAGE 4: LANDER VEHICLE */}
          <button
            type="button"
            onClick={() => handleEntityClick('lander')}
            className="group relative flex flex-col justify-between rounded-xl border border-white/10 bg-[#181818] hover:bg-[#202020] hover:border-white/30 transition-all text-left overflow-hidden shadow-lg hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <div className="relative h-20 w-full overflow-hidden bg-black/40">
              <img
                src={getImageForEntity(activeMission.id).imageUrl}
                alt={activePathway.lander}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-70 group-hover:opacity-90"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-black/30 to-transparent" />
              <div className="absolute top-2 left-2.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-300 font-bold bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded border border-white/10">
                  04 // Lander
                </span>
              </div>
            </div>
            <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-heading font-bold text-xs text-white leading-tight">
                  {activePathway.lander}
                </h3>
              </div>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                <span>Autonomous</span>
                <span className="w-5 h-5 rounded-full bg-white/10 group-hover:bg-[#E03C31] text-white flex items-center justify-center transition-colors">
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>
          </button>

          {/* STAGE 5: SCIENTIFIC PAYLOAD */}
          <button
            type="button"
            onClick={() => handleEntityClick('payload')}
            className="group relative flex flex-col justify-between rounded-xl border-2 border-[#E03C31] bg-[#1a1a1a] hover:border-white transition-all text-left overflow-hidden shadow-lg hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E03C31]"
          >
            <div className="relative h-20 w-full overflow-hidden bg-black/40">
              <img
                src={getImageForEntity(activePayload.id).imageUrl}
                alt={activePayload.acronym}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-black/30 to-transparent" />
              <div className="absolute top-2 left-2.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-white font-bold bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded border border-white/20">
                  05 // Payload
                </span>
              </div>
              <div className="absolute top-2 right-2.5">
                <Layers className="w-3.5 h-3.5 text-zinc-300 drop-shadow" />
              </div>
            </div>
            <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-heading font-bold text-xs text-white leading-tight">
                  {activePayload.acronym}
                </h3>
                <p className="text-[10px] text-zinc-300 line-clamp-1 font-sans mt-0.5">
                  {activePayload.name}
                </p>
              </div>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                <span className="truncate">{activePayload.leadCenter}</span>
                <span className="w-5 h-5 rounded-full bg-white/10 group-hover:bg-[#E03C31] text-white flex items-center justify-center transition-colors">
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>
          </button>

          {/* STAGE 6: LUNAR DESTINATION */}
          <button
            type="button"
            onClick={() => handleEntityClick('destination')}
            className="group relative flex flex-col justify-between rounded-xl border border-white/10 bg-[#181818] hover:bg-[#202020] hover:border-white/30 transition-all text-left overflow-hidden shadow-lg hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <div className="relative h-20 w-full overflow-hidden bg-black/40">
              <img
                src={getImageForEntity(activeSite.id).imageUrl}
                alt={activeSite.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-70 group-hover:opacity-90"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-black/30 to-transparent" />
              <div className="absolute top-2 left-2.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-rose-300 font-bold bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded border border-rose-500/30">
                  06 // Site
                </span>
              </div>
              <div className="absolute top-2 right-2.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400 drop-shadow" />
              </div>
            </div>
            <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-heading font-bold text-xs text-white leading-tight">
                  {activeSite.name}
                </h3>
              </div>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                <span>{activeSite.coordinates.latitude > 0 ? `${activeSite.coordinates.latitude}°N` : `${Math.abs(activeSite.coordinates.latitude)}°S`}</span>
                <span className="w-5 h-5 rounded-full bg-white/10 group-hover:bg-[#E03C31] text-white flex items-center justify-center transition-colors">
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>
          </button>

          {/* STAGE 7: SCIENTIFIC OUTCOME */}
          <button
            type="button"
            onClick={() => handleEntityClick('outcome')}
            className="group relative flex flex-col justify-between rounded-xl border border-white/10 bg-[#181818] hover:bg-[#202020] hover:border-emerald-500/60 transition-all text-left overflow-hidden shadow-lg hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <div className="relative h-20 w-full overflow-hidden bg-black/40">
              <img
                src="/images/destinations/malapert-a.jpg"
                alt="Scientific Outcome"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-70 group-hover:opacity-90"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-black/30 to-transparent" />
              <div className="absolute top-2 left-2.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 font-bold bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded border border-emerald-500/30">
                  07 // Outcome
                </span>
              </div>
              <div className="absolute top-2 right-2.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 drop-shadow" />
              </div>
            </div>
            <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-heading font-bold text-[11px] text-white leading-snug line-clamp-3">
                  {activePathway.outcome}
                </h3>
              </div>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-emerald-400 font-mono font-bold">
                <span>Artemis Result</span>
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 group-hover:bg-[#E03C31] text-white flex items-center justify-center transition-colors">
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Sub-label instruction */}
      <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-1">
        <span>Click any stage card above to inspect its verified technical illustration, entity profile, and NASA sources.</span>
        <span className="hidden sm:inline">100% Traceable to NASA SMD Records</span>
      </div>

      {/* Interactive Entity Detail Slide-Over / Modal Panel */}
      {selectedEntity && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="entity-detail-title"
          className="relative mt-6 rounded-xl border border-white/20 bg-[#161616] p-6 shadow-2xl animate-subtle-reveal space-y-5 text-white"
        >
          <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-bold">
                Entity Architecture Inspection // Stage: {selectedEntity.type.toUpperCase()}
              </span>
              <h3 id="entity-detail-title" className="font-heading text-2xl font-bold text-white mt-0.5">
                {selectedEntity.title}
              </h3>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                {selectedEntity.subtitle}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedEntity(null)}
              aria-label="Close entity detail panel"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Visual Media Card */}
            <div className="md:col-span-5">
              <ScientificImageCard
                image={getImageForEntity(selectedEntity.id, selectedEntity.title)}
                aspectRatio="video"
                showCaption={true}
              />
            </div>

            {/* Entity Description & Details */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-400 font-mono mb-1">
                  Scientific Role & Function
                </h4>
                <p className="text-sm text-zinc-200 leading-relaxed font-sans">
                  {selectedEntity.description}
                </p>
              </div>

              {/* Technical Attributes Table */}
              <div className="rounded-lg bg-[#000000] border border-white/10 p-3 space-y-1.5 text-xs font-mono">
                {Object.entries(selectedEntity.details).map(([key, value]) => (
                  <div key={key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-0.5 border-b border-white/10 last:border-0">
                    <span className="text-zinc-400 font-semibold">{key}:</span>
                    <span className="text-white font-bold text-left sm:text-right">{value}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {selectedEntity.relatedMissionId && onSelectMission && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      const m = allMissions.find((item) => item.id === selectedEntity.relatedMissionId);
                      if (m) onSelectMission(m);
                    }}
                    icon={<FileText className="w-3.5 h-3.5" />}
                  >
                    Examine Flight Dossier
                  </Button>
                )}

                {selectedEntity.relatedSiteId && onSelectSite && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onSelectSite(selectedEntity.relatedSiteId!)}
                    icon={<Compass className="w-3.5 h-3.5" />}
                  >
                    Locate on 3D Moon
                  </Button>
                )}

                <a
                  href={selectedEntity.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#E03C31] hover:underline px-2 py-1.5"
                >
                  <span>Primary NASA Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
