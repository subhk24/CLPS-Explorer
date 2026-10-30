import React from 'react';
import {
  ExternalLink,
  MapPin,
  Calendar,
  Layers,
  FileText,
} from 'lucide-react';
import type { Mission } from '../../types';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/StatusBadge';
import { Badge } from '../common/Badge';
import { getProviderById, getPayloadsForMission, getLandingSites } from '../../data';

export interface MissionDetailModalProps {
  mission: Mission | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectPayload?: (payloadId: string) => void;
  onSelectSite?: (siteId: string) => void;
}

export const MissionDetailModal: React.FC<MissionDetailModalProps> = ({
  mission,
  isOpen,
  onClose,
  onSelectPayload,
  onSelectSite,
}) => {
  if (!mission) return null;

  const provider = getProviderById(mission.providerId);
  const payloads = getPayloadsForMission(mission.id);
  const sites = getLandingSites();
  const matchedSite = sites.find(
    (s) => s.missions.includes(mission.id) || mission.targetRegion.toLowerCase().includes(s.name.toLowerCase())
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mission.name}
      subtitle={`Task Order ${mission.taskOrder} • ${provider ? provider.name : mission.providerId}`}
      size="xl"
    >
      <div className="space-y-6 text-white">
        {/* Top Status & Key Meta */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-[#181818] border border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-400">Operational Status:</span>
            <StatusBadge status={mission.status} label={mission.statusLabel} size="md" />
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
            <span>Lander: <strong className="text-white">{mission.landerModel}</strong></span>
            <span>•</span>
            <span>Vehicle: <strong className="text-white">{mission.launchVehicle}</strong></span>
          </div>
        </div>

        {/* Flight Telemetry & Coordinates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#181818] border border-white/10 space-y-2 shadow-sm">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <Calendar className="w-4 h-4 text-zinc-300" aria-hidden="true" />
              <span>Flight Timeline</span>
            </div>
            <p className="text-zinc-400">
              <strong className="text-white">Launch Date:</strong>{' '}
              {mission.launchDate || 'To be determined (Subject to window)'}
            </p>
            <p className="text-zinc-400">
              <strong className="text-white">Landing Event:</strong>{' '}
              {mission.landingDate || 'Planned surface touchdown'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#181818] border border-white/10 space-y-2 shadow-sm">
            <div className="flex items-center justify-between font-bold text-white">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#EF4444]" aria-hidden="true" />
                <span>Landing Selenography</span>
              </div>
              {matchedSite && onSelectSite && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onSelectSite(matchedSite.id);
                  }}
                  className="text-[11px] font-mono text-zinc-300 hover:text-white hover:underline font-bold focus-visible:outline-none"
                >
                  View on 2D Map →
                </button>
              )}
            </div>
            <p className="text-zinc-400">
              <strong className="text-white">Target Region:</strong> {mission.targetRegion}
            </p>
            <p className="text-zinc-400 font-mono">
              <strong className="text-white font-sans">Coordinates:</strong>{' '}
              {mission.coordinates.latitude > 0 ? `${mission.coordinates.latitude}°N` : `${Math.abs(mission.coordinates.latitude)}°S`},{' '}
              {mission.coordinates.longitude > 0 ? `${mission.coordinates.longitude}°E` : `${Math.abs(mission.coordinates.longitude)}°W`}
            </p>
          </div>
        </div>

        {/* Historical Narrative / Summary */}
        <div className="space-y-2 text-xs leading-relaxed text-white p-4 rounded-xl bg-[#181818] border border-white/10 shadow-sm">
          <h4 className="font-heading font-bold text-base text-white flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-zinc-300" aria-hidden="true" />
            <span>Mission Summary & Outcome</span>
          </h4>
          <p className="text-zinc-300 leading-relaxed">{mission.summary}</p>
          <div className="pt-2 border-t border-white/10">
            <strong className="text-white">Scientific Objectives:</strong>{' '}
            <span className="text-zinc-300">{mission.scientificObjectives}</span>
          </div>
        </div>

        {/* Manifested NASA Payloads */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-heading font-bold text-base text-white flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-zinc-300" aria-hidden="true" />
              <span>Manifested NASA Science Payloads ({mission.nasaPayloadCount})</span>
            </h4>
            <span className="text-[11px] font-mono text-zinc-400">
              {payloads.length} Cataloged in Dataset
            </span>
          </div>

          {payloads.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {payloads.map((payload) => (
                <div
                  key={payload.id}
                  className="p-3.5 rounded-xl bg-[#181818] border border-white/10 space-y-1.5 text-xs hover:border-white/30 transition-colors"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-mono font-bold text-white text-sm">{payload.acronym}</span>
                    <Badge size="sm" variant="accent">{payload.category}</Badge>
                  </div>
                  <h5 className="font-semibold text-white line-clamp-1">{payload.name}</h5>
                  <p className="text-zinc-400 text-[11px] line-clamp-2">{payload.description}</p>
                  <div className="pt-2 flex items-center justify-between border-t border-white/10">
                    <span className="text-[10px] font-mono text-zinc-400">{payload.leadCenter}</span>
                    {onSelectPayload && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onSelectPayload(payload.id);
                        }}
                        className="text-[11px] font-semibold text-[#E03C31] hover:underline"
                      >
                        Inspect Science →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-[#181818] border border-white/10 text-xs text-zinc-400 italic">
              NASA payload manifest details are currently pending formal assignment for this task order window.
            </div>
          )}
        </div>

        {/* Source Reference Footer */}
        <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-zinc-400">
          <span>Verified NASA SMAC announcement data</span>
          <a
            href={mission.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-[#E03C31] hover:underline"
          >
            <span>Primary NASA Press Release</span>
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </Modal>
  );
};
