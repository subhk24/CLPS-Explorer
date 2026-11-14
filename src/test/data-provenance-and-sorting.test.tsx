import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  getMissions,
  getMissionById,
  getPayloads,
  getProviders,
  getLandingSites,
  getProgramMetrics,
  validateDataIntegrity,
} from '../data';
import { MissionExplorer } from '../components/missions/MissionExplorer';
import { ErrorBoundary } from '../components/common/ErrorBoundary';

describe('Phase 12 Rigorous Quality & Provenance Test Suite', () => {
  describe('Dataset Provenance and Verification Metadata', () => {
    it('verifies that all catalogued missions carry structured provenance', () => {
      const missions = getMissions();
      expect(missions.length).toBe(13);

      for (const m of missions) {
        expect(m.provenance).toBeDefined();
        expect(m.provenance?.verifiedDate).toBeTruthy();
        expect(m.provenance?.sourceAgency).toBeTruthy();
        expect(m.provenance?.primaryCitation).toBeTruthy();
        expect([
          'confirmed_historical',
          'scheduled_target_window',
          'development_target',
        ]).toContain(m.provenance?.outcomeConfidence);
      }
    });

    it('verifies historical missions have confirmed_historical confidence', () => {
      const im1 = getMissionById('to2-im');
      expect(im1?.provenance?.outcomeConfidence).toBe('confirmed_historical');
      expect(im1?.provenance?.sourceAgency).toContain('NASA');

      const bg1 = getMissionById('to19d');
      expect(bg1?.provenance?.outcomeConfidence).toBe('confirmed_historical');

      const pereg = getMissionById('to2-ab');
      expect(pereg?.provenance?.outcomeConfidence).toBe('confirmed_historical');
    });

    it('verifies planned missions are strictly tagged as target windows or development targets', () => {
      const prime1 = getMissionById('prime-1');
      expect(prime1?.provenance?.outcomeConfidence).toBe('scheduled_target_window');

      const ct3 = getMissionById('ct-3');
      expect(ct3?.provenance?.outcomeConfidence).toBe('development_target');
    });

    it('verifies that landing sites and providers carry provenance metadata', () => {
      const sites = getLandingSites();
      for (const site of sites) {
        expect(site.provenance).toBeDefined();
        expect(site.provenance?.sourceAgency).toContain('NASA');
      }

      const providers = getProviders();
      for (const prov of providers) {
        expect(prov.provenance).toBeDefined();
        expect(prov.provenance?.sourceAgency).toContain('NASA');
      }
    });

    it('validates comprehensive data integrity with zero unresolved foreign keys or duplicate IDs', () => {
      const report = validateDataIntegrity();
      expect(report.isValid).toBe(true);
      expect(report.duplicateMissionIds).toHaveLength(0);
      expect(report.duplicatePayloadIds).toHaveLength(0);
      expect(report.unresolvedProviders).toHaveLength(0);
      expect(report.unresolvedMissionsInPayloads).toHaveLength(0);
      expect(report.unresolvedMissionsInSites).toHaveLength(0);
      expect(report.coordinateErrors).toHaveLength(0);
    });

    it('reconciles dashboard metrics against underlying datasets', () => {
      const metrics = getProgramMetrics();
      expect(metrics.totalDeliveriesAwarded).toBe(getMissions().length);
      expect(metrics.totalDeliveriesAwarded).toBe(13);
      expect(metrics.awardedVendorsCount).toBe(5);
      expect(metrics.eligiblePoolCount).toBe(12);
      expect(metrics.totalNasaPayloadsAwarded).toBe(59);

      const providers = getProviders();
      const awarded = providers.filter((p) => p.status === 'awarded');
      expect(awarded).toHaveLength(5);

      const payloads = getPayloads();
      expect(payloads.length).toBeGreaterThanOrEqual(28);
    });
  });

  describe('MissionExplorer Sorting & Advanced Filtering', () => {
    it('supports sorting missions by name, launch date, and payload count', () => {
      render(<MissionExplorer onSelectMission={() => {}} />);

      const sortSelect = screen.getByLabelText(/sort/i);
      expect(sortSelect).toBeInTheDocument();

      // Sort by Name (A-Z)
      fireEvent.change(sortSelect, { target: { value: 'name_asc' } });
      const cards = screen.getAllByRole('button', { name: /click to inspect flight dossier/i });
      expect(cards.length).toBe(13);
      // Blue Ghost Mission 1 should be the first alphabetical item
      expect(cards[0].textContent).toContain('Blue Ghost Mission 1');

      // Sort by Payload Count (High to low)
      fireEvent.change(sortSelect, { target: { value: 'payloads_desc' } });
      const sortedByPayloads = screen.getAllByRole('button', { name: /click to inspect flight dossier/i });
      // Blue Ghost Mission 1 has 10 NASA payloads, highest in catalog
      expect(sortedByPayloads[0].textContent).toContain('10 NASA Payloads');
    });

    it('notifies parent component with complete filter state on change', () => {
      const handleFilterChange = vi.fn();
      render(<MissionExplorer onSelectMission={() => {}} onFilterChange={handleFilterChange} />);

      const searchInput = screen.getByPlaceholderText(/search by mission/i);
      fireEvent.change(searchInput, { target: { value: 'Odysseus' } });

      expect(handleFilterChange).toHaveBeenCalled();
      const lastCall = handleFilterChange.mock.calls[handleFilterChange.mock.calls.length - 1][0];
      expect(lastCall.search).toBe('Odysseus');
    });
  });

  describe('ErrorBoundary Component', () => {
    it('catches runtime child anomalies and displays recovery error UI', () => {
      const ThrowingChild = () => {
        throw new Error('Test selenographic render exception');
      };

      // Suppress console.error during expected boundary catch
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <ErrorBoundary fallbackTitle="Subsystem Fault">
          <ThrowingChild />
        </ErrorBoundary>
      );

      expect(screen.getByText('Subsystem Fault')).toBeInTheDocument();
      expect(screen.getByText(/Test selenographic render exception/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /retry operation/i })).toBeInTheDocument();

      spy.mockRestore();
    });
  });
});
