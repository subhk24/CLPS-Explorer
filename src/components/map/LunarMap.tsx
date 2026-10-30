import React, { useState, useMemo } from 'react';
import {
  Globe,
  Compass,
  Table,
  Eye,
  Info,
  Orbit,
} from 'lucide-react';
import type { LandingSite, Mission } from '../../types';
import { Badge } from '../common/Badge';
import { NasaRedArrow } from '../common/NasaRedArrow';
import { getLandingSites, getMissions } from '../../data';
import { LunarGlobe3D } from './LunarGlobe3D';

export type ProjectionType = 'nearside' | 'farside' | 'southpole';

export interface LunarMapProps {
  onSelectMission?: (mission: Mission) => void;
  selectedSiteId?: string | null;
  onSelectSite?: (siteId: string | null) => void;
  defaultMode?: 'globe3d' | 'map' | 'table';
}

interface ProjectedPoint {
  site: LandingSite;
  x: number;
  y: number;
  visible: boolean;
  status: 'landed' | 'anomaly' | 'planned';
}

export const LunarMap: React.FC<LunarMapProps> = ({
  onSelectMission,
  selectedSiteId: controlledSiteId,
  onSelectSite,
  defaultMode = 'map',
}) => {
  const [projection, setProjection] = useState<ProjectionType>('nearside');
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>('malapert-a');
  const [viewMode, setViewMode] = useState<'globe3d' | 'map' | 'table'>(defaultMode);
  const [hoveredSiteId, setHoveredSiteId] = useState<string | null>(null);

  const activeSiteId = controlledSiteId !== undefined ? controlledSiteId : internalSelectedId;

  const sites = useMemo(() => getLandingSites(), []);
  const allMissions = useMemo(() => getMissions(), []);

  const selectedSite = useMemo(() => {
    return sites.find((s) => s.id === activeSiteId) || sites[0];
  }, [sites, activeSiteId]);

  const missionsForSelectedSite = useMemo(() => {
    if (!selectedSite) return [];
    return allMissions.filter((m) => selectedSite.missions.includes(m.id));
  }, [selectedSite, allMissions]);

  const handleSelectSite = (siteId: string) => {
    setInternalSelectedId(siteId);
    onSelectSite?.(siteId);
  };

  // SVG Geometry constants
  const SVG_SIZE = 500;
  const CENTER = SVG_SIZE / 2;
  const RADIUS = 200;

  // Project coordinates based on active projection
  const projectedPoints: ProjectedPoint[] = useMemo(() => {
    return sites.map((site) => {
      const latRad = (site.coordinates.latitude * Math.PI) / 180;
      const lonRad = (site.coordinates.longitude * Math.PI) / 180;

      // Determine site overall status based on linked missions
      const linkedMissions = allMissions.filter((m) => site.missions.includes(m.id));
      let status: 'landed' | 'anomaly' | 'planned' = 'planned';
      if (linkedMissions.some((m) => m.status === 'delivered')) {
        status = 'landed';
      } else if (linkedMissions.some((m) => m.status === 'landed_anomaly')) {
        status = 'anomaly';
      }

      let x = CENTER;
      let y = CENTER;
      let visible = false;

      if (projection === 'nearside') {
        const cosC = Math.cos(latRad) * Math.cos(lonRad);
        if (cosC >= -0.05) {
          visible = true;
          x = CENTER + RADIUS * Math.cos(latRad) * Math.sin(lonRad);
          y = CENTER - RADIUS * Math.sin(latRad);
        }
      } else if (projection === 'farside') {
        const deltaLon =
          site.coordinates.longitude >= 0
            ? (site.coordinates.longitude - 180) * (Math.PI / 180)
            : (site.coordinates.longitude + 180) * (Math.PI / 180);

        const cosC = Math.cos(latRad) * Math.cos(deltaLon);
        if (cosC >= -0.05) {
          visible = true;
          x = CENTER + RADIUS * Math.cos(latRad) * Math.sin(deltaLon);
          y = CENTER - RADIUS * Math.sin(latRad);
        }
      } else if (projection === 'southpole') {
        if (site.coordinates.latitude <= -55) {
          visible = true;
          const poleDistDeg = 90 + site.coordinates.latitude;
          const r = (poleDistDeg / 35) * RADIUS;
          x = CENTER + r * Math.sin(lonRad);
          y = CENTER + r * Math.cos(lonRad);
        }
      }

      return { site, x, y, visible, status };
    });
  }, [sites, allMissions, projection]);

  // Format destination image
  const destinationImageMap: Record<string, string> = {
    'malapert-a': '/images/destinations/malapert-a.jpg',
    'mare-crisium': '/images/destinations/mare-crisium.jpg',
    'shackleton-connecting-ridge': '/images/destinations/shackleton.jpg',
    'gruithuisen-domes': '/images/destinations/gruithuisen-domes.jpg',
    'schrodinger-basin': '/images/destinations/moon-south-pole.jpg',
    'reiner-gamma': '/images/missions/cp-11.jpg',
    'haworth-crater': '/images/destinations/moon-south-pole.jpg',
    'mons-mouton': '/images/missions/to20a.jpg',
  };

  const currentDestinationImg = destinationImageMap[selectedSite?.id || ''] || '/images/destinations/moon-south-pole.jpg';

  const renderSiteDetailPanel = () => {
    if (!selectedSite) return null;

    return (
      <div className="rounded-lg border border-white/10 bg-[#0e0e11] p-5 shadow-xl space-y-4 text-white">
        {/* Header Photo Thumbnail of the Landing Destination */}
        <div className="relative h-40 rounded overflow-hidden border border-white/10">
          <img
            src={currentDestinationImg}
            alt={selectedSite.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e11] via-transparent to-black/40" />
          <div className="absolute top-2.5 left-3">
            <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-[10px] font-mono text-[#38BDF8] border border-white/20 uppercase tracking-wider font-bold">
              {selectedSite.hemisphere}
            </span>
          </div>
          <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between">
            <div>
              <h3 className="font-heading text-xl font-bold text-white tracking-tight drop-shadow">
                {selectedSite.name}
              </h3>
              <span className="text-[11px] font-mono text-zinc-300">
                Lunar Target • {selectedSite.hemisphere}
              </span>
            </div>
            {selectedSite.confirmedByOrbiter && (
              <Badge variant="blue" size="sm">
                LROC Confirmed
              </Badge>
            )}
          </div>
        </div>

        {/* Telemetry Row */}
        <div className="grid grid-cols-2 gap-3 p-3 rounded bg-black/50 border border-white/10 text-xs font-mono">
          <div>
            <span className="text-[10px] text-zinc-400 block font-semibold">COORDINATES</span>
            <span className="text-white font-bold">
              {selectedSite.coordinates.latitude > 0 ? `${selectedSite.coordinates.latitude}°N` : `${Math.abs(selectedSite.coordinates.latitude)}°S`},{' '}
              {selectedSite.coordinates.longitude > 0 ? `${selectedSite.coordinates.longitude}°E` : `${Math.abs(selectedSite.coordinates.longitude)}°W`}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-zinc-400 block font-semibold">LOLA ELEVATION</span>
            <span className="text-white font-bold">
              {selectedSite.coordinates.elevationMeters > 0
                ? `+${selectedSite.coordinates.elevationMeters.toLocaleString()} m`
                : `${selectedSite.coordinates.elevationMeters.toLocaleString()} m`}
            </span>
          </div>
        </div>

        {/* Geological Narrative */}
        <div className="space-y-1 text-xs pt-2 border-t border-white/10">
          <h4 className="font-mono text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
            Geological Description
          </h4>
          <p className="text-zinc-300 leading-relaxed font-sans text-xs">
            {selectedSite.geologicalDescription}
          </p>
        </div>

        {/* Scientific Significance */}
        <div className="space-y-1 text-xs pt-2 border-t border-white/10">
          <h4 className="font-mono text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
            Scientific Rationale &amp; Value
          </h4>
          <p className="text-zinc-300 leading-relaxed font-sans text-xs">
            {selectedSite.scientificSignificance}
          </p>
        </div>

        {/* Linked Delivery Missions */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <h4 className="font-mono text-[11px] uppercase tracking-wider text-zinc-400 font-semibold flex items-center justify-between">
            <span>Associated CLPS Missions ({missionsForSelectedSite.length})</span>
            <span className="text-[10px] text-zinc-500 font-normal">Task Orders</span>
          </h4>

          <div className="space-y-2">
            {missionsForSelectedSite.map((mission) => (
              <div
                key={mission.id}
                className="p-2.5 rounded bg-black/50 border border-white/10 flex items-center justify-between gap-3 text-xs group"
              >
                <div>
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>{mission.name}</span>
                    <span className="text-[10px] font-mono text-zinc-300 font-bold px-1.5 py-0.5 rounded bg-white/10 border border-white/20">
                      {mission.taskOrder}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                    Lander: {mission.landerModel} • {mission.statusLabel}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectMission?.(mission)}
                  className="group/btn inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-bold text-xs font-mono uppercase tracking-wider transition-colors"
                >
                  <span>Dossier</span>
                  <NasaRedArrow size="sm" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Orbiter Verification Provenance */}
        {selectedSite.orbiterVerificationSource && (
          <div className="pt-2 text-[11px] font-mono text-zinc-400 flex items-center gap-1.5 border-t border-white/10">
            <Info className="w-3.5 h-3.5 text-zinc-400 shrink-0" aria-hidden="true" />
            <span className="truncate">Source: {selectedSite.orbiterVerificationSource}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 text-white select-none">
      {/* Top Controls Bar — Restrained Aerospace Mission Control Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <Globe className="w-5 h-5 text-white" aria-hidden="true" />
          <div>
            <h2 className="font-heading text-lg font-bold text-white tracking-tight">
              Selenographic Destination Map
            </h2>
            <p className="text-xs text-zinc-400 font-sans">
              Interactive 3D WebGL Moon globe and orthographic 2D projections with verified coordinates
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Main Visual Mode Segmented Control: 3D Globe | 2D Map | Data Table */}
          <div className="inline-flex rounded-md p-0.5 bg-[#0e0e11] border border-white/10 text-xs font-mono" role="group" aria-label="Map view mode">
            <button
              type="button"
              onClick={() => setViewMode('globe3d')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white ${
                viewMode === 'globe3d'
                  ? 'bg-white/15 text-white font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Orbit className="w-3.5 h-3.5" />
              <span>3D Globe</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white ${
                viewMode === 'map'
                  ? 'bg-white/15 text-white font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>2D Map</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              aria-label="Accessible table view"
              className={`p-1.5 px-2 rounded transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white ${
                viewMode === 'table'
                  ? 'bg-white/15 text-white font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 2D Projection Selector Segmented Control */}
          <div className="inline-flex rounded-md p-0.5 bg-[#0e0e11] border border-white/10 text-xs font-mono" role="group" aria-label="Map Projection">
            <button
              type="button"
              onClick={() => {
                setProjection('nearside');
                setViewMode('map');
              }}
              className={`px-2.5 py-1.5 rounded transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white ${
                projection === 'nearside' && viewMode === 'map'
                  ? 'bg-white/15 text-white font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Nearside (0°)
            </button>
            <button
              type="button"
              onClick={() => {
                setProjection('farside');
                setViewMode('map');
              }}
              className={`px-2.5 py-1.5 rounded transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white ${
                projection === 'farside' && viewMode === 'map'
                  ? 'bg-white/15 text-white font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Far Side (180°)
            </button>
            <button
              type="button"
              onClick={() => {
                setProjection('southpole');
                setViewMode('map');
              }}
              className={`px-2.5 py-1.5 rounded transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white ${
                projection === 'southpole' && viewMode === 'map'
                  ? 'bg-white/15 text-white font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              South Pole (&lt;-60°)
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: 3D WEBGL INTERACTIVE GLOBE */}
      {viewMode === 'globe3d' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 space-y-3">
            <LunarGlobe3D
              selectedSiteId={activeSiteId}
              onSelectSite={handleSelectSite}
              onSelectMission={onSelectMission}
            />
            <p className="text-xs text-slate-400 font-mono px-1">
              Drag to rotate 360° across nearside and far side. Scroll to zoom. Click any marker to center and inspect landing site.
            </p>
          </div>
          <div className="lg:col-span-5">
            {renderSiteDetailPanel()}
          </div>
        </div>
      )}

      {/* VIEW 2: 2D ORTHOGRAPHIC & POLAR PROJECTIONS */}
      {viewMode === 'map' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Interactive Vector Map Canvas */}
          <div className="lg:col-span-7 bg-[#111111] border border-white/10 rounded-xl p-4 sm:p-6 flex flex-col items-center shadow-2xl">
            <div className="w-full flex items-center justify-between text-xs font-mono text-zinc-300 pb-3 border-b border-white/10">
              <span className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-white" aria-hidden="true" />
                <span className="font-bold text-white">
                  {projection === 'nearside' && 'Nearside Orthographic Projection (Sub-Earth Center)'}
                  {projection === 'farside' && 'Far Side Orthographic Projection (Anti-Earth Center)'}
                  {projection === 'southpole' && 'South Polar Azimuthal Projection (80°S-90°S Artemis Zone)'}
                </span>
              </span>
              <span className="text-[11px] text-slate-400">R = 1,737.4 km</span>
            </div>

            {/* SVG Lunar Disc */}
            <div className="relative w-full max-w-[460px] aspect-square my-4 select-none">
              <svg
                viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
                className="w-full h-full drop-shadow-2xl"
                role="img"
                aria-label="Interactive lunar map showing coordinates and candidate landing sites"
              >
                <defs>
                  <radialGradient id="discGrad" cx="45%" cy="45%" r="55%">
                    <stop offset="0%" stopColor="#334155" />
                    <stop offset="70%" stopColor="#1E293B" />
                    <stop offset="100%" stopColor="#0F172A" />
                  </radialGradient>
                  <radialGradient id="limbDarkening" cx="50%" cy="50%" r="50%">
                    <stop offset="85%" stopColor="#000000" stopOpacity="0" />
                    <stop offset="100%" stopColor="#000000" stopOpacity="0.8" />
                  </radialGradient>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Lunar Disc */}
                <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="url(#discGrad)" stroke="#475569" strokeWidth="1.5" />

                {/* Simulated Maria Features for Nearside */}
                {projection === 'nearside' && (
                  <g opacity="0.45" fill="#0B1322">
                    <ellipse cx={CENTER + 80} cy={CENTER - 30} rx="45" ry="38" transform="rotate(-15)" />
                    <ellipse cx={CENTER - 60} cy={CENTER - 50} rx="65" ry="50" />
                    <ellipse cx={CENTER - 20} cy={CENTER - 20} rx="45" ry="35" />
                    <ellipse cx={CENTER + 30} cy={CENTER + 10} rx="40" ry="30" />
                    <ellipse cx={CENTER - 10} cy={CENTER + 50} rx="50" ry="40" />
                  </g>
                )}

                {/* Simulated Basins for Far Side */}
                {projection === 'farside' && (
                  <g opacity="0.35" fill="#0B1322">
                    <ellipse cx={CENTER} cy={CENTER + 70} rx="60" ry="40" />
                    <ellipse cx={CENTER - 50} cy={CENTER} rx="35" ry="35" />
                    <ellipse cx={CENTER + 60} cy={CENTER - 40} rx="30" ry="30" />
                  </g>
                )}

                {/* Coordinate Grids (Equator, Prime Meridian, Parallels) */}
                <g stroke="#64748B" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.5">
                  <line x1={CENTER - RADIUS} y1={CENTER} x2={CENTER + RADIUS} y2={CENTER} />
                  <line x1={CENTER} y1={CENTER - RADIUS} x2={CENTER} y2={CENTER + RADIUS} />
                  <ellipse cx={CENTER} cy={CENTER} rx={RADIUS} ry={RADIUS * 0.5} fill="none" />
                  <ellipse cx={CENTER} cy={CENTER} rx={RADIUS * 0.5} ry={RADIUS} fill="none" />
                </g>

                {/* Limb Darkening Shader Overlay */}
                <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="url(#limbDarkening)" />

                {/* Site Markers */}
                {projectedPoints.map(({ site, x, y, visible, status }) => {
                  if (!visible) return null;
                  const isSelected = site.id === activeSiteId;
                  const isHovered = site.id === hoveredSiteId;

                  let pinColor = '#38BDF8';
                  if (status === 'landed') pinColor = '#10B981';
                  if (status === 'anomaly') pinColor = '#F59E0B';

                  return (
                    <g
                      key={site.id}
                      role="button"
                      tabIndex={0}
                      aria-label={`${site.name} landing site`}
                      onClick={() => handleSelectSite(site.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleSelectSite(site.id);
                        }
                      }}
                      onMouseEnter={() => setHoveredSiteId(site.id)}
                      onMouseLeave={() => setHoveredSiteId(null)}
                      className="cursor-pointer focus:outline-none"
                    >
                      {/* Pulse ring for selected site */}
                      {isSelected && (
                        <circle
                          cx={x}
                          cy={y}
                          r="14"
                          fill="none"
                          stroke={pinColor}
                          strokeWidth="2"
                          opacity="0.8"
                          className="animate-ping"
                        />
                      )}

                      {/* Halo on hover or select */}
                      {(isSelected || isHovered) && (
                        <circle cx={x} cy={y} r="10" fill={pinColor} opacity="0.3" filter="url(#glow)" />
                      )}

                      {/* Main Pin */}
                      <circle
                        cx={x}
                        cy={y}
                        r={isSelected ? 6 : 4.5}
                        fill={isSelected ? '#FFFFFF' : pinColor}
                        stroke="#000000"
                        strokeWidth="1.5"
                      />

                      {/* Pin label (visible if selected or hovered) */}
                      {(isSelected || isHovered) && (
                        <g transform={`translate(${x}, ${y - 12})`}>
                          <rect
                            x="-45"
                            y="-16"
                            width="90"
                            height="18"
                            rx="3"
                            fill="#000000"
                            stroke={pinColor}
                            strokeWidth="1"
                            opacity="0.95"
                          />
                          <text
                            x="0"
                            y="-4"
                            fill="#FFFFFF"
                            fontSize="9"
                            fontFamily="monospace"
                            fontWeight="bold"
                            textAnchor="middle"
                          >
                            {site.name}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Map Legend */}
            <div className="w-full pt-3 border-t border-white/10 flex flex-wrap items-center justify-between text-xs font-mono text-slate-300 gap-2">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span>Delivered</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span>Partial Tilt</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                  <span>Manifested Planned</span>
                </span>
              </div>
              <span className="text-[11px] text-slate-400">Click marker to inspect terrain</span>
            </div>
          </div>

          {/* Right: Selected Landing Site Details */}
          <div className="lg:col-span-5">
            {renderSiteDetailPanel()}
          </div>
        </div>
      )}

      {/* VIEW 3: ACCESSIBLE DATA TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="rounded-xl border border-white/10 bg-[#111111] shadow-2xl overflow-hidden">
          <div className="p-4 bg-[#000000] border-b border-white/10 flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-300 font-semibold">
              Showing {sites.length} cataloged regions with confirmed selenographic coordinates
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#000000] border-b border-white/10 text-zinc-300 font-mono text-[11px]">
                <tr>
                  <th scope="col" className="p-3.5 font-bold uppercase tracking-wider">Landing Site</th>
                  <th scope="col" className="p-3.5 font-bold uppercase tracking-wider">Coordinates</th>
                  <th scope="col" className="p-3.5 font-bold uppercase tracking-wider">Elevation</th>
                  <th scope="col" className="p-3.5 font-bold uppercase tracking-wider">Hemisphere</th>
                  <th scope="col" className="p-3.5 font-bold uppercase tracking-wider">Primary Significance</th>
                  <th scope="col" className="p-3.5 font-bold uppercase tracking-wider">Orbiter Status</th>
                  <th scope="col" className="p-3.5 text-right font-bold uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-zinc-200">
                {sites.map((site) => (
                  <tr
                    key={site.id}
                    className={`transition-colors ${
                      site.id === activeSiteId ? 'bg-white/10 font-semibold' : 'hover:bg-white/5'
                    }`}
                  >
                    <td className="p-3.5 font-bold text-white">
                      {site.name}
                    </td>
                    <td className="p-3.5 font-mono text-zinc-300">
                      {site.coordinates.latitude > 0 ? `${site.coordinates.latitude}°N` : `${Math.abs(site.coordinates.latitude)}°S`},{' '}
                      {site.coordinates.longitude > 0 ? `${site.coordinates.longitude}°E` : `${Math.abs(site.coordinates.longitude)}°W`}
                    </td>
                    <td className="p-3.5 font-mono text-white font-bold">
                      {site.coordinates.elevationMeters > 0 ? `+${site.coordinates.elevationMeters}m` : `${site.coordinates.elevationMeters}m`}
                    </td>
                    <td className="p-3.5 capitalize text-slate-300">
                      {site.hemisphere}
                    </td>
                    <td className="p-3.5 text-xs text-slate-300 max-w-xs truncate">
                      {site.scientificSignificance}
                    </td>
                    <td className="p-3.5">
                      {site.confirmedByOrbiter ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>LROC Verified</span>
                        </span>
                      ) : (
                        <span className="text-[11px] font-mono text-slate-400">Model Derived</span>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          handleSelectSite(site.id);
                          setViewMode('globe3d');
                        }}
                        className="px-2.5 py-1 rounded bg-white/10 hover:bg-[#E03C31] text-white text-[11px] font-mono transition-colors font-bold"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
