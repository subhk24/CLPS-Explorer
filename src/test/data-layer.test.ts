import { describe, it, expect } from 'vitest';
import {
  getMissions,
  getMissionById,
  getMissionsByStatus,
  getPayloads,
  getPayloadById,
  getPayloadsForMission,
  getProviders,
  getProviderById,
  getLandingSites,
  getLandingSiteById,
  getProgramMetrics,
  validateDataIntegrity,
  formatDataIntegrityAlert,
} from '../data';
import { getImageForEntity } from '../data/imagery';

describe('CLPS Explorer Data Layer & Integrity Tests', () => {
  it('loads all 13 verified CLPS missions', () => {
    const missions = getMissions();
    expect(missions).toHaveLength(13);

    // Verify key historical missions exist
    const im1 = getMissionById('to2-im');
    expect(im1).toBeDefined();
    expect(im1?.name).toContain('Odysseus');
    expect(im1?.status).toBe('landed_anomaly');

    const peregrine = getMissionById('to2-ab');
    expect(peregrine).toBeDefined();
    expect(peregrine?.status).toBe('transit_loss');

    const blueGhost1 = getMissionById('to19d');
    expect(blueGhost1).toBeDefined();
    expect(blueGhost1?.status).toBe('delivered');
  });

  it('validates that coordinates are mathematically valid for all missions', () => {
    const missions = getMissions();
    for (const m of missions) {
      expect(m.coordinates.latitude).toBeGreaterThanOrEqual(-90);
      expect(m.coordinates.latitude).toBeLessThanOrEqual(90);
      expect(m.coordinates.longitude).toBeGreaterThanOrEqual(-180);
      expect(m.coordinates.longitude).toBeLessThanOrEqual(180);
      expect(m.coordinates.targetDescription).toBeTruthy();
    }
  });

  it('filters missions strictly by operational status', () => {
    const landedMissions = getMissionsByStatus('landed_anomaly');
    expect(landedMissions.length).toBeGreaterThan(0);
    expect(landedMissions.some((m) => m.id === 'to2-im')).toBe(true);

    const plannedMissions = getMissionsByStatus('planned');
    expect(plannedMissions.length).toBeGreaterThan(0);
    // Future missions must have planned status
    expect(plannedMissions.some((m) => m.id === 'prime-1')).toBe(true);
    expect(plannedMissions.some((m) => m.id === 'cp-11')).toBe(true);
  });

  it('loads the scientific payload catalog and cross-references missions', () => {
    const payloads = getPayloads();
    expect(payloads.length).toBeGreaterThanOrEqual(28);

    // Test specific key instruments
    const trident = getPayloadById('trident-drill');
    expect(trident).toBeDefined();
    expect(trident?.acronym).toBe('TRIDENT');
    expect(trident?.missionId).toBe('prime-1');
    expect(trident?.category).toBe('ISRU');

    const ndl = getPayloadById('ndl');
    expect(ndl).toBeDefined();
    expect(ndl?.acronym).toBe('NDL');
    expect(ndl?.missionId).toBe('to2-im');

    // Test reverse lookup for IM-1 payloads
    const im1Payloads = getPayloadsForMission('to2-im');
    expect(im1Payloads.length).toBe(6);
  });

  it('loads commercial providers with active awarded vs eligible pool distinction', () => {
    const providers = getProviders();
    expect(providers.length).toBe(13);

    const im = getProviderById('intuitive-machines');
    expect(im).toBeDefined();
    expect(im?.status).toBe('awarded');

    const firefly = getProviderById('firefly');
    expect(firefly).toBeDefined();
    expect(firefly?.status).toBe('awarded');

    const spacex = getProviderById('spacex');
    expect(spacex).toBeDefined();
    expect(spacex?.status).toBe('eligible_pool');
  });

  it('loads documented landing sites and cross-references missions', () => {
    const sites = getLandingSites();
    expect(sites.length).toBe(8);

    const malapert = getLandingSiteById('malapert-a');
    expect(malapert).toBeDefined();
    expect(malapert?.confirmedByOrbiter).toBe(true);
    expect(malapert?.missions).toContain('to2-im');

    const mareCrisium = getLandingSiteById('mare-crisium');
    expect(mareCrisium).toBeDefined();
    expect(mareCrisium?.missions).toContain('to19d');
  });

  it('returns verified program metrics matching NASA official statistics', () => {
    const metrics = getProgramMetrics();
    expect(metrics.totalDeliveriesAwarded).toBe(17);
    expect(metrics.awardedVendorsCount).toBe(5);
    expect(metrics.totalNasaPayloadsAwarded).toBe(60);
    expect(metrics.combinedContractCeiling).toContain('$2.6');
  });

  it('passes structural integrity while reporting payload count differences for review', () => {
    const report = validateDataIntegrity();
    expect(report.isValid).toBe(true);
    expect(report.unresolvedProviders).toHaveLength(0);
    expect(report.unresolvedMissionsInPayloads).toHaveLength(0);
    expect(report.unresolvedMissionsInSites).toHaveLength(0);
    expect(report.missionPayloadCountMismatches.length).toBeGreaterThan(0);
    expect(report.unresolvedPayloadsInMissionManifests.length).toBeGreaterThan(0);
    expect(formatDataIntegrityAlert(report)).toBe('Data integrity validation passed.');
  });

  it('formats all blocking integrity issues in the validation alert', () => {
    const report = validateDataIntegrity();
    report.unresolvedMissionsInPayloads = [];
    report.unresolvedMissionsInSites = [];
    report.unresolvedPayloadsInMissionManifests = [];
    report.duplicateMissionIds = [];
    report.duplicatePayloadIds = [];
    report.duplicateProviderIds = [];
    report.duplicateLandingSiteIds = [];
    report.unresolvedProviders = ['Mission demo -> Provider missing'];
    report.coordinateErrors = ['Mission demo invalid latitude: 91'];

    expect(formatDataIntegrityAlert(report)).toBe(
      'Data integrity issues detected: Mission demo -> Provider missing; Mission demo invalid latitude: 91'
    );
  });

  it('guarantees unique and authentic imagery for key payloads without identical duplicates', () => {
    // Check key payloads from the user's view (LEXI, LPV, LISTER, etc.)
    const lexiImg = getImageForEntity('lexi', 'LEXI');
    const lpvImg = getImageForEntity('lpv', 'LPV');
    const listerImg = getImageForEntity('lister', 'LISTER');
    const nssImg = getImageForEntity('nss', 'NSS');
    const nirvssImg = getImageForEntity('nirvss', 'NIRVSS');
    const fssImg = getImageForEntity('fss-seismic', 'FSS');

    expect(lexiImg.imageUrl).toContain('lexi.jpg');
    expect(lpvImg.imageUrl).toContain('lpv.jpg');
    expect(listerImg.imageUrl).toContain('lister.jpg');
    expect(nssImg.imageUrl).toContain('nss.jpg');
    expect(nirvssImg.imageUrl).toContain('nirvss.jpg');
    expect(fssImg.imageUrl).toContain('fss.jpg');

    // Ensure none of them share the same image
    const images = [lexiImg.imageUrl, lpvImg.imageUrl, listerImg.imageUrl, nssImg.imageUrl, nirvssImg.imageUrl, fssImg.imageUrl];
    const uniqueImages = new Set(images);
    expect(uniqueImages.size).toBe(images.length);
  });
});
