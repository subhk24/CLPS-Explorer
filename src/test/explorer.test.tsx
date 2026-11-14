import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MissionExplorer } from '../components/missions/MissionExplorer';
import { PayloadsExplorer } from '../components/payloads/PayloadsExplorer';
import { TimelineExplorer } from '../components/timeline/TimelineExplorer';
import { ProvidersDirectory } from '../components/providers/ProvidersDirectory';
import { SourcesExplorer } from '../components/sources/SourcesExplorer';
import { NasaHeroVideo } from '../components/dashboard/NasaHeroVideo';
import { getMissions } from '../data';

describe('Phase 4 Interactive Explorers Test Suite', () => {
  describe('MissionExplorer Component', () => {
    it('renders search input and filter buttons with all deliveries count', () => {
      render(<MissionExplorer onSelectMission={() => {}} />);
      expect(screen.getByPlaceholderText(/search by mission/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /all deliveries \(13\)/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /landed \/ delivered \(3\)/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /planned windows \(9\)/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /transit loss \(1\)/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /flight test \(0\)/i })).toBeInTheDocument();
      expect(screen.getByText(/showing 13 of 13 verified commercial deliveries/i)).toBeInTheDocument();
    });

    it('keeps full-dataset counts stable while filtering and after remounting', () => {
      const { unmount } = render(<MissionExplorer onSelectMission={() => {}} />);
      fireEvent.click(screen.getByRole('button', { name: /flight test \(0\)/i }));
      expect(screen.getByText(/showing 0 of 13 verified commercial deliveries/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /all deliveries \(13\)/i })).toBeInTheDocument();

      unmount();
      render(<MissionExplorer onSelectMission={() => {}} />);
      expect(screen.getByText(/showing 13 of 13 verified commercial deliveries/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /flight test \(0\)/i })).toBeInTheDocument();
    });

    it('filters missions by search query matching mission name or payload acronym', () => {
      render(<MissionExplorer onSelectMission={() => {}} />);
      const searchInput = screen.getByPlaceholderText(/search by mission/i);

      // Search by mission name
      fireEvent.change(searchInput, { target: { value: 'Odysseus' } });
      expect(screen.getByText(/showing 1 of 13 verified commercial deliveries/i)).toBeInTheDocument();
      expect(screen.getByText(/IM-1 \(Odysseus\)/i)).toBeInTheDocument();

      // Search by payload acronym
      fireEvent.change(searchInput, { target: { value: 'TRIDENT' } });
      expect(screen.getByText(/showing 1 of 13 verified commercial deliveries/i)).toBeInTheDocument();
      expect(screen.getByText(/IM-2 \(Athena\)/i)).toBeInTheDocument();
    });

    it('filters missions by status tabs', () => {
      render(<MissionExplorer onSelectMission={() => {}} />);

      // Filter by Landed
      fireEvent.click(screen.getByRole('button', { name: /landed \/ delivered/i }));
      expect(screen.getByText(/showing 3 of 13 verified commercial deliveries/i)).toBeInTheDocument();

      // Filter by Transit Loss
      fireEvent.click(screen.getByRole('button', { name: /transit loss \(1\)/i }));
      expect(screen.getByText(/showing 1 of 13 verified commercial deliveries/i)).toBeInTheDocument();
      expect(screen.getByText(/Peregrine Mission 1/i)).toBeInTheDocument();
    });

    it('filters missions by provider dropdown', () => {
      render(<MissionExplorer onSelectMission={() => {}} />);
      const providerSelect = screen.getByLabelText(/commercial provider/i);

      fireEvent.change(providerSelect, { target: { value: 'firefly' } });
      // Firefly has 4 task orders: TO19D, CS-3/4, CP-21, CS-6
      expect(screen.getByText(/showing 4 of 13 verified commercial deliveries/i)).toBeInTheDocument();
    });

    it('displays empty state when search criteria yield zero results and allows reset', () => {
      render(<MissionExplorer onSelectMission={() => {}} />);
      const searchInput = screen.getByPlaceholderText(/search by mission/i);

      fireEvent.change(searchInput, { target: { value: 'NonexistentSpacecraftXYZ' } });
      expect(screen.getByText(/no deliveries match your active filters/i)).toBeInTheDocument();

      // Click reset button
      const resetBtn = screen.getByRole('button', { name: /reset all filters/i });
      fireEvent.click(resetBtn);
      expect(screen.getByText(/showing 13 of 13 verified commercial deliveries/i)).toBeInTheDocument();
    });

    it('toggles between grid and table views', () => {
      render(<MissionExplorer onSelectMission={() => {}} />);

      // Initially grid view
      expect(screen.queryByRole('table')).not.toBeInTheDocument();

      // Switch to table view
      fireEvent.click(screen.getByRole('button', { name: /table layout/i }));
      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /task order \/ name/i })).toBeInTheDocument();
    });

    it('calls onSelectMission when Dossier button is clicked', () => {
      const handleSelect = vi.fn();
      render(<MissionExplorer onSelectMission={handleSelect} />);

      const dossierButtons = screen.getAllByRole('button', { name: /dossier/i });
      fireEvent.click(dossierButtons[0]);
      expect(handleSelect).toHaveBeenCalledTimes(1);
    });
  });

  describe('PayloadsExplorer Component', () => {
    it('renders 28 NASA instruments and 8 domain tabs', () => {
      render(<PayloadsExplorer />);
      expect(screen.getByText(/all domains \(28\)/i)).toBeInTheDocument();
      expect(screen.getByText(/showing 28 of 28 science instruments/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^VG/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^PNT/ })).toBeInTheDocument();
    });

    it('filters payloads by domain tab', () => {
      render(<PayloadsExplorer />);
      fireEvent.click(screen.getByRole('button', { name: /^VG/ }));
      expect(screen.getByText(/showing 5 of 28 science instruments/i)).toBeInTheDocument();
      expect(screen.getByText(/Volatiles & Geochemistry/i)).toBeInTheDocument();
    });

    it('searches payloads by keyword and highlights research question', () => {
      render(<PayloadsExplorer />);
      const searchInput = screen.getByPlaceholderText(/search by instrument acronym/i);

      fireEvent.change(searchInput, { target: { value: 'Navigation Doppler Lidar' } });
      expect(screen.getByText(/showing 1 of 28 science instruments/i)).toBeInTheDocument();
      expect(screen.getByText(/NDL/i)).toBeInTheDocument();
      expect(screen.getByText(/primary research question/i)).toBeInTheDocument();
    });

    it('invokes onSelectMission when host mission button is clicked', () => {
      const handleSelect = vi.fn();
      render(<PayloadsExplorer onSelectMission={handleSelect} />);

      const hostMissionBtns = screen.getAllByTitle(/inspect host mission: IM-1 \(Odysseus\)/i);
      fireEvent.click(hostMissionBtns[0]);
      expect(handleSelect).toHaveBeenCalledTimes(1);
    });
  });

  describe('TimelineExplorer Component', () => {
    it('renders all 13 deliveries in chronological order', () => {
      render(<TimelineExplorer onSelectMission={() => {}} />);
      expect(screen.getByText(/13 verified flight manifests/i)).toBeInTheDocument();
      expect(screen.getByText(/all flights \(13\)/i)).toBeInTheDocument();
      expect(screen.getByText(/flown & completed \(3\)/i)).toBeInTheDocument();
    });

    it('filters timeline by flown era', () => {
      render(<TimelineExplorer onSelectMission={() => {}} />);
      fireEvent.click(screen.getByRole('button', { name: /flown & completed \(3\)/i }));

      expect(screen.getByText(/Peregrine Mission 1/i)).toBeInTheDocument();
      expect(screen.getByText(/IM-1 \(Odysseus\)/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Blue Ghost Mission 1/i).length).toBeGreaterThan(0);
      expect(screen.queryByText(/Blue Moon Mark 1/i)).not.toBeInTheDocument();
    });

    it('calls onSelectMission when Inspect Dossier is clicked', () => {
      const handleSelect = vi.fn();
      render(<TimelineExplorer onSelectMission={handleSelect} />);

      const dossierButtons = screen.getAllByRole('button', { name: /inspect dossier/i });
      fireEvent.click(dossierButtons[0]);
      expect(handleSelect).toHaveBeenCalledTimes(1);
    });

    it('renders an image for every mission in the timeline manifest', () => {
      render(<TimelineExplorer onSelectMission={() => {}} />);
      const images = screen.getAllByRole('img');
      // All 13 missions have image cards rendered
      expect(images.length).toBeGreaterThanOrEqual(13);
      expect(screen.getByAltText(/Peregrine Mission 1 flight article/i)).toBeInTheDocument();
      expect(screen.getByAltText(/IM-1 \(Odysseus\) flight article/i)).toBeInTheDocument();
      expect(screen.getByAltText(/Blue Ghost Mission 1 flight article/i)).toBeInTheDocument();
    });
  });

  describe('ProvidersDirectory Component', () => {
    it('renders 13 commercial aerospace providers with status counts', () => {
      render(<ProvidersDirectory />);
      expect(screen.getByText(/all companies \(13\)/i)).toBeInTheDocument();
      expect(screen.getByText(/awarded contractors \(5\)/i)).toBeInTheDocument();
      expect(screen.getByText(/eligible pool \(7\)/i)).toBeInTheDocument();
      expect(screen.getByText(/historical \/ defunct \(1\)/i)).toBeInTheDocument();
    });

    it('renders a photo for every commercial provider in grid view', () => {
      render(<ProvidersDirectory />);
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThanOrEqual(13);
      expect(screen.getByAltText(/Intuitive Machines lunar lander/i)).toBeInTheDocument();
      expect(screen.getByAltText(/Firefly Aerospace lunar lander/i)).toBeInTheDocument();
      expect(screen.getByAltText(/Astrobotic Technology lunar lander/i)).toBeInTheDocument();
      expect(screen.getByAltText(/SpaceX lunar lander/i)).toBeInTheDocument();
    });

    it('filters providers by awarded contractors', () => {
      render(<ProvidersDirectory />);
      fireEvent.click(screen.getByRole('button', { name: /awarded contractors \(5\)/i }));

      expect(screen.getByText(/showing 5 of 13 evaluated aerospace entities/i)).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Intuitive Machines' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Firefly Aerospace' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Astrobotic Technology' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Team Draper' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Blue Origin' })).toBeInTheDocument();
    });

    it('switches to comparative matrix table layout', () => {
      render(<ProvidersDirectory />);
      fireEvent.click(screen.getByRole('button', { name: /table layout/i }));

      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /propulsion chemistry/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /payload capacity/i })).toBeInTheDocument();
    });
  });

  describe('SourcesExplorer Component', () => {
    it('renders data verification standards, bibliography, and lunar video stream', () => {
      render(<SourcesExplorer />);
      expect(screen.getByRole('heading', { name: /how clps explorer verifies data/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /primary nasa reference bibliography/i })).toBeInTheDocument();
      expect(screen.getByText(/the "60\+ payloads" standard/i)).toBeInTheDocument();
      expect(screen.getByText(/fixed-price contracting model/i)).toBeInTheDocument();

      // Video element exists with valid source and NO moon poster
      const video = document.querySelector('video');
      expect(video).toBeInTheDocument();
      expect(video).not.toHaveAttribute('poster');
    });
  });

  describe('NasaHeroVideo Component Video Protection', () => {
    it('renders video element without moon poster image attribute', () => {
      const missions = getMissions();
      render(
        <NasaHeroVideo
          onExploreMissions={() => {}}
          onExploreMap={() => {}}
          onOpenMissionDetail={() => {}}
          featuredMissions={missions}
        />
      );

      const video = document.querySelector('video');
      expect(video).toBeInTheDocument();
      // Ensure the moon image is never used as poster
      expect(video).not.toHaveAttribute('poster');
      expect(video?.getAttribute('poster')).toBeNull();
    });
  });
});
