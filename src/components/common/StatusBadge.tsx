import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Radio,
  Clock,
  Activity,
  HelpCircle,
} from 'lucide-react';
import type { MissionStatus } from '../../types';

export interface StatusBadgeProps {
  status: MissionStatus | string;
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}

interface StatusConfig {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeClass: string;
}

const statusConfigs: Record<MissionStatus, StatusConfig> = {
  landed_nominal: {
    label: 'Landed (Nominal)',
    icon: CheckCircle2,
    badgeClass: 'bg-emerald-950/60 text-emerald-300 border border-emerald-600/40',
  },
  landed_anomaly: {
    label: 'Landed (Partial Tilt)',
    icon: AlertTriangle,
    badgeClass: 'bg-amber-950/60 text-amber-300 border border-amber-600/40',
  },
  transit_loss: {
    label: 'Transit Loss',
    icon: XCircle,
    badgeClass: 'bg-red-950/60 text-red-300 border border-red-600/40',
  },
  delivered: {
    label: 'Delivered / Surface Active',
    icon: Radio,
    badgeClass: 'bg-emerald-950/60 text-emerald-300 border border-emerald-600/40',
  },
  planned: {
    label: 'Planned (Target Window)',
    icon: Clock,
    badgeClass: 'bg-neutral-800 text-neutral-200 border border-neutral-700',
  },
  testing: {
    label: 'Flight Test Demo',
    icon: Activity,
    badgeClass: 'bg-purple-950/60 text-purple-300 border border-purple-600/40',
  },
};

const unknownConfig: StatusConfig = {
  label: 'Status Unverified',
  icon: HelpCircle,
  badgeClass: 'bg-neutral-800 text-neutral-300 border border-neutral-700',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = 'md',
  className = '',
}) => {
  const config =
    status in statusConfigs
      ? statusConfigs[status as MissionStatus]
      : unknownConfig;

  const displayLabel = label || config.label;
  const Icon = config.icon;

  const sizeClasses =
    size === 'sm'
      ? 'text-[11px] px-2 py-0.5 gap-1.5'
      : 'text-xs px-2.5 py-1 gap-1.5';

  const iconSizes = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5';

  return (
    <span
      className={`inline-flex items-center font-sans font-medium rounded border select-none ${config.badgeClass} ${sizeClasses} ${className}`}
    >
      <span className="sr-only">Mission Status: </span>
      <Icon className={`${iconSizes} shrink-0 opacity-90`} aria-hidden="true" />
      <span>{displayLabel}</span>
    </span>
  );
};
