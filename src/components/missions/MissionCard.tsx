import React from 'react';
import { ExternalLink, ArrowRight } from 'lucide-react';
import type { Mission } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { getProviderById } from '../../data';
import { getImageForEntity } from '../../data/imagery';

export interface MissionCardProps {
  mission: Mission;
  onSelect: (mission: Mission) => void;
  className?: string;
  variant?: 'card' | 'row';
}

export const MissionCard: React.FC<MissionCardProps> = ({
  mission,
  onSelect,
  className = '',
  variant = 'row',
}) => {
  const provider = getProviderById(mission.providerId);
  const image = getImageForEntity(mission.id, mission.name);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(mission);
    }
  };

  // ── ROW VARIANT: Editorial List Entry (User Preferred Structure) ──
  if (variant === 'row') {
    return (
      <article
        role="button"
        tabIndex={0}
        onClick={() => onSelect(mission)}
        onKeyDown={handleKeyDown}
        aria-label={`${mission.name} (${mission.taskOrder}) - Click to inspect flight dossier`}
        className={`group relative flex flex-col md:flex-row items-start gap-6 py-6 border-b border-white/10 hover:border-white/20 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white text-white ${className}`}
      >
        {/* 1. Large High-Quality Mission Image */}
        <div className="w-full md:w-64 lg:w-72 shrink-0 aspect-[16/10] overflow-hidden rounded bg-[#0d0d11] relative">
          <img
            src={image.imageUrl}
            alt={image.title}
            className="w-full h-full object-cover filter contrast-[1.03] transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute bottom-1.5 left-2 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-sm text-[10px] font-mono text-zinc-300">
            {mission.taskOrder}
          </div>
        </div>

        {/* 2. Editorial Content Flow */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Mission Name */}
          <h3 className="font-heading text-xl sm:text-2xl font-bold text-white group-hover:text-[#38BDF8] transition-colors tracking-tight leading-snug">
            {mission.name}
          </h3>

          {/* Provider · Identifier */}
          <div className="text-xs sm:text-sm text-zinc-400 font-sans flex items-center gap-2">
            <span className="text-zinc-200 font-medium">{provider ? provider.name : mission.providerId}</span>
            <span>·</span>
            <span>Task Order {mission.taskOrder}</span>
            <span>·</span>
            <span>{mission.landerModel}</span>
          </div>

          {/* One or Two Lines Describing the Mission */}
          <p className="text-sm text-zinc-300 leading-relaxed font-sans line-clamp-2 max-w-3xl">
            {mission.summary}
          </p>

          {/* Target Date · Payload Count · Mission Status */}
          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-zinc-400 font-sans">
            <span className="font-medium text-zinc-300">
              {mission.launchDate || 'Target Window 2026–2028'}
            </span>
            <span>·</span>
            <span className="text-zinc-300 font-mono">{mission.nasaPayloadCount} NASA Payloads</span>
            <span>·</span>
            <StatusBadge status={mission.status} label={mission.statusLabel} size="sm" />
            <span>·</span>
            <span className="text-zinc-400">
              {mission.targetRegion}
            </span>
          </div>

          {/* Explore Mission Action */}
          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(mission);
              }}
              aria-label={`Dossier for ${mission.name}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white group-hover:text-[#38BDF8] transition-colors"
            >
              <span>Explore Mission</span>
              <span className="sr-only">Dossier</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </button>

            <a
              href={mission.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`NASA source for ${mission.name}`}
              className="p-1 rounded text-zinc-500 hover:text-zinc-300 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </article>
    );
  }

  // ── CARD VARIANT: Grid Entry ──
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onSelect(mission)}
      onKeyDown={handleKeyDown}
      aria-label={`${mission.name} (${mission.taskOrder}) - Click to inspect flight dossier`}
      className={`group flex flex-col justify-between p-4 rounded-lg bg-[#0d0d11] hover:bg-[#121217] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white select-none text-white ${className}`}
    >
      <div className="space-y-3">
        {/* Large Mission Image */}
        <div className="w-full aspect-[16/10] overflow-hidden rounded bg-black relative">
          <img
            src={image.imageUrl}
            alt={image.title}
            className="w-full h-full object-cover filter contrast-[1.03] transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute bottom-1.5 left-2 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-sm text-[10px] font-mono text-zinc-300">
            {mission.taskOrder}
          </div>
        </div>

        {/* Mission Name */}
        <h3 className="font-heading text-lg font-bold text-white group-hover:text-[#38BDF8] transition-colors tracking-tight line-clamp-1">
          {mission.name}
        </h3>

        {/* Provider · Identifier */}
        <div className="text-xs text-zinc-400 font-sans truncate">
          <span className="text-zinc-200 font-medium">{provider ? provider.name : mission.providerId}</span>
          <span> · </span>
          <span>{mission.taskOrder}</span>
        </div>

        {/* 1-2 Lines Summary */}
        <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed font-sans">
          {mission.summary}
        </p>

        {/* Target Date · Payload Count · Status */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 pt-1">
          <span>{mission.launchDate || 'Target Window'}</span>
          <span>·</span>
          <span className="text-zinc-300 font-mono">{mission.nasaPayloadCount} NASA Payloads</span>
          <span>·</span>
          <StatusBadge status={mission.status} label={mission.statusLabel} size="sm" />
        </div>
      </div>

      {/* Explore Mission Action */}
      <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(mission);
          }}
          aria-label={`Dossier for ${mission.name}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-white group-hover:text-[#38BDF8] transition-colors"
        >
          <span>Explore Mission</span>
          <span className="sr-only">Dossier</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </button>

        <a
          href={mission.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`NASA source for ${mission.name}`}
          className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
};
