/**
 * CLPS Explorer TypeScript Data Models
 * Authoritative types matching verified research datasets.
 */

export type MissionStatus =
  | 'landed_nominal'    // Soft touchdown upright, full surface duration
  | 'landed_anomaly'    // Soft touchdown, operational payloads, vehicle tilt
  | 'transit_loss'      // Anomaly in transit, Earth atmospheric re-entry
  | 'delivered'         // Active surface operations
  | 'planned'           // Future delivery on contract
  | 'testing';          // Lander flight test demonstration

export interface SelenographicCoordinate {
  latitude: number;           // Degrees (-90.0 to +90.0, negative is South)
  longitude: number;          // Degrees (-180.0 to +180.0, negative is West)
  elevationMeters?: number;   // LOLA elevation relative to lunar datum
  targetDescription: string;  // Plain language geological location
  confirmedByOrbiter?: boolean;
}

export interface DataProvenance {
  verifiedDate: string;        // ISO date of factual verification e.g. "2026-07-15"
  sourceAgency: string;        // Primary authority e.g. "NASA SMD / CLPS Program Office"
  primaryCitation: string;     // Official document or mission page
  outcomeConfidence: 'confirmed_historical' | 'scheduled_target_window' | 'development_target';
}

export interface Mission {
  id: string;
  name: string;
  taskOrder: string;
  providerId: string;
  landerModel: string;
  targetRegion: string;
  coordinates: SelenographicCoordinate;
  launchDate: string | null;  // ISO YYYY-MM-DD
  launchVehicle: string;
  landingDate: string | null; // ISO YYYY-MM-DD or null
  status: MissionStatus;
  statusLabel: string;
  nasaPayloadCount: number;
  payloadIds: string[];
  summary: string;
  scientificObjectives: string;
  sourceUrl: string;
  provenance?: DataProvenance;
}

export type ScienceDomain =
  | 'VG'    // Volatiles & Geochemistry
  | 'GP'    // Geophysics & Interior Structure
  | 'PSI'   // Plume-Surface Interactions & Dust
  | 'SWP'   // Space Weather & Plasma Environment
  | 'AC'    // Astrophysics & Cosmology
  | 'PNT'   // Precision Navigation, Timing & Geodesy
  | 'ISRU'  // In-Situ Resource Utilization & Drilling
  | 'TECH'; // Extreme Environment Technology & Computing

export interface Payload {
  id: string;
  name: string;
  acronym: string;
  missionId: string;
  category: ScienceDomain;
  categoryLabel: string;
  leadCenter: string;
  leadPi?: string;
  description: string;
  scientificQuestion: string;
  status: string;
  statusLabel: string;
  sourceUrl: string;
  provenance?: DataProvenance;
}

export interface LanderModel {
  name: string;
  payloadCapacityKg: number;
  propulsionType: string;
  heritage: string;
}

export type ProviderStatus = 'awarded' | 'eligible_pool' | 'acquired_defunct';

export interface Provider {
  id: string;
  name: string;
  headquarters: string;
  foundedYear: number;
  status: ProviderStatus;
  statusLabel: string;
  stockTicker: string;
  landers: LanderModel[];
  awardedTaskOrders: string[];
  totalAwardValue: string;
  historicalAccomplishment: string;
  websiteUrl: string;
  provenance?: DataProvenance;
}

export interface LandingSite {
  id: string;
  name: string;
  hemisphere: string;
  coordinates: {
    latitude: number;
    longitude: number;
    elevationMeters: number;
  };
  missions: string[];
  geologicalDescription: string;
  scientificSignificance: string;
  confirmedByOrbiter: boolean;
  orbiterVerificationSource: string | null;
  provenance?: DataProvenance;
}

export interface ProgramMetrics {
  totalDeliveriesAwarded: number;
  awardedVendorsCount: number;
  eligiblePoolCount: number;
  totalNasaPayloadsAwarded: number;
  combinedContractCeiling: string;
  contractCeilingThruDate: string;
}

export type MissionSortOption =
  | 'launch_date_desc'
  | 'launch_date_asc'
  | 'landing_date_desc'
  | 'name_asc'
  | 'provider_asc'
  | 'payloads_desc';
