import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { NasaPortraitCard } from '../components/common/NasaPortraitCard';
import { NasaFeatureCard } from '../components/common/NasaFeatureCard';
import { NasaAsymmetricGallery } from '../components/common/NasaAsymmetricGallery';
import { NasaPhotoBanner } from '../components/common/NasaPhotoBanner';
import { NasaHeroVideo } from '../components/dashboard/NasaHeroVideo';
import { MissionDetailPage } from '../components/detail/MissionDetailPage';
import { PayloadDetailPage } from '../components/detail/PayloadDetailPage';
import { SiteDetailPage } from '../components/detail/SiteDetailPage';
import { ProviderDetailPage } from '../components/detail/ProviderDetailPage';
import {
  getMissions,
  getMissionById,
  getPayloadById,
  getLandingSiteById,
  getProviderById,
} from '../data';

describe('NASA Visual Redesign & Dedicated Detail Pages Test Suite', () => {
  describe('NasaHeroVideo Redundant Audio Button Removal', () => {
    it('renders flight video and play/pause button, but NO mute or volume toggle button', () => {
      const missions = getMissions();
      render(
        <NasaHeroVideo
          onExploreMissions={() => {}}
          onExploreMap={() => {}}
          onOpenMissionDetail={() => {}}
          featuredMissions={missions}
        />
      );

      // Play/Pause button exists
      expect(screen.getByRole('button', { name: /pause background video|play background video/i })).toBeInTheDocument();

      // Mute / Unmute / Volume control must NOT exist
      expect(screen.queryByRole('button', { name: /unmute video audio|mute video audio|unmute|mute/i })).not.toBeInTheDocument();
      expect(screen.queryByTitle(/unmute|mute/i)).not.toBeInTheDocument();
    });
  });

  describe('Breadcrumbs Component', () => {
    it('renders hierarchical navigation path and responds to clicks', () => {
      const handleHome = vi.fn();
      const handleMissions = vi.fn();
      render(
        <Breadcrumbs
          items={[
            { label: 'Home', onClick: handleHome },
            { label: 'Missions', onClick: handleMissions },
            { label: 'IM-1 Odysseus', active: true },
          ]}
        />
      );

      expect(screen.getByText('IM-1 Odysseus')).toBeInTheDocument();
      const missionsBtn = screen.getByRole('button', { name: 'Missions' });
      fireEvent.click(missionsBtn);
      expect(handleMissions).toHaveBeenCalledTimes(1);

      const homeBtn = screen.getByRole('button', { name: /return to mission control home/i });
      fireEvent.click(homeBtn);
      expect(handleHome).toHaveBeenCalledTimes(1);
    });
  });

  describe('NasaPortraitCard Component (Screenshot 1 & 3)', () => {
    it('renders title, subtitle, category tag, and handles click and Enter key events', () => {
      const handleClick = vi.fn();
      render(
        <NasaPortraitCard
          title="Moon Base"
          subtitle="ARTEMIS SURFACE ARCHITECTURE"
          category="Human Return"
          imageUrl="/images/destinations/malapert-a.jpg"
          onClick={handleClick}
        />
      );

      expect(screen.getByRole('button', { name: /moon base/i })).toBeInTheDocument();
      expect(screen.getByText('Moon Base')).toBeInTheDocument();
      expect(screen.getByText('ARTEMIS SURFACE ARCHITECTURE')).toBeInTheDocument();
      expect(screen.getByText('Human Return')).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: /moon base/i }));
      expect(handleClick).toHaveBeenCalledTimes(1);

      fireEvent.keyDown(screen.getByRole('button', { name: /moon base/i }), { key: 'Enter', code: 'Enter' });
      expect(handleClick).toHaveBeenCalledTimes(2);
    });
  });

  describe('NasaFeatureCard Component (Layout A)', () => {
    it('renders horizontal card with category, title, summary, and triggers onClick', () => {
      const handleClick = vi.fn();
      render(
        <NasaFeatureCard
          title="Historic Touchdown at Malapert A"
          category="Archival Field Report"
          metadata="Intuitive Machines Nova-C"
          summary="First commercial lunar soft landing in human history."
          imageUrl="/images/missions/to2-im.jpg"
          onClick={handleClick}
        />
      );

      expect(screen.getByRole('heading', { name: /historic touchdown at malapert a/i })).toBeInTheDocument();
      expect(screen.getByText(/archival field report/i)).toBeInTheDocument();
      expect(screen.getByText(/first commercial lunar soft landing/i)).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: /historic touchdown at malapert a/i }));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('NasaAsymmetricGallery Component (Screenshot 2 Observatory Gallery)', () => {
    it('renders composite cards with title, image count label, and click handler', () => {
      const handleClick = vi.fn();
      render(
        <NasaAsymmetricGallery
          items={[
            {
              id: 'gal-1',
              title: 'Great Observatories: LuSEE-Night Gallery',
              countLabel: '28 IMAGES',
              primaryImage: '/images/payloads/lusee-night.jpg',
              secondaryImage1: '/images/payloads/ndl.jpg',
              secondaryImage2: '/images/payloads/scalpss.jpg',
              onClick: handleClick,
            },
          ]}
        />
      );

      expect(screen.getByRole('heading', { name: /great observatories: lusee-night gallery/i })).toBeInTheDocument();
      expect(screen.getByText('28 IMAGES')).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: /great observatories: lusee-night gallery/i }));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('NasaPhotoBanner Component (Screenshot 2 bottom)', () => {
    it('renders full-width photographic banner with headline and triggers action', () => {
      const handleAction = vi.fn();
      render(
        <NasaPhotoBanner
          title="Explore the Universe from your Inbox"
          subtitle="Artemis Campaign"
          description="Stay up-to-date on commercial lunar deliveries."
          imageUrl="/images/destinations/moon-south-pole.jpg"
          actionText="Open 3D Selenography Atlas"
          onAction={handleAction}
        />
      );

      expect(screen.getByRole('heading', { name: /explore the universe from your inbox/i })).toBeInTheDocument();
      expect(screen.getByText(/stay up-to-date on commercial lunar deliveries/i)).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: /open 3d selenography atlas/i }));
      expect(handleAction).toHaveBeenCalledTimes(1);
    });
  });

  describe('MissionDetailPage Component (Requirement 5)', () => {
    it('renders complete editorial mission detail dossier with breadcrumbs and payloads', () => {
      const im1 = getMissionById('to2-im')!;
      const handleBack = vi.fn();
      render(
        <MissionDetailPage
          mission={im1}
          onBack={handleBack}
        />
      );

      expect(screen.getByRole('heading', { name: /im-1 \(odysseus\)/i, level: 1 })).toBeInTheDocument();
      expect(screen.getByText(/commercial provider/i)).toBeInTheDocument();
      expect(screen.getAllByText('Intuitive Machines')[0]).toBeInTheDocument();
      expect(screen.getByText('Nova-C')).toBeInTheDocument();
      expect(screen.getByText(/manifested nasa science payloads/i)).toBeInTheDocument();

      // Back button functions
      const backBtn = screen.getByRole('button', { name: /back to missions/i });
      fireEvent.click(backBtn);
      expect(handleBack).toHaveBeenCalledTimes(1);
    });
  });

  describe('PayloadDetailPage Component (Requirement 5)', () => {
    it('renders complete scientific payload dossier with research question and host flight', () => {
      const ndl = getPayloadById('ndl')!;
      const handleBack = vi.fn();
      render(
        <PayloadDetailPage
          payload={ndl}
          onBack={handleBack}
        />
      );

      expect(screen.getByRole('heading', { name: /navigation doppler lidar/i, level: 1 })).toBeInTheDocument();
      expect(screen.getByText(new RegExp(ndl.scientificQuestion, 'i'))).toBeInTheDocument();
      expect(screen.getByText(/lead nasa center/i)).toBeInTheDocument();
      expect(screen.getAllByText('NASA Langley Research Center')[0]).toBeInTheDocument();

      const backBtn = screen.getByRole('button', { name: /back to payloads/i });
      fireEvent.click(backBtn);
      expect(handleBack).toHaveBeenCalledTimes(1);
    });
  });

  describe('SiteDetailPage Component (Requirement 5)', () => {
    it('renders landing selenography site dossier with verified coordinates', () => {
      const site = getLandingSiteById('malapert-a')!;
      const handleBack = vi.fn();
      render(
        <SiteDetailPage
          site={site}
          onBack={handleBack}
        />
      );

      expect(screen.getByRole('heading', { name: /malapert a/i, level: 1 })).toBeInTheDocument();
      expect(screen.getByText(/scientific significance & exploration value/i)).toBeInTheDocument();
      expect(screen.getByText(/latitude coordinate/i)).toBeInTheDocument();
      expect(screen.getByText(/80.1221° S/i)).toBeInTheDocument();

      const backBtn = screen.getByRole('button', { name: /back to lunar map/i });
      fireEvent.click(backBtn);
      expect(handleBack).toHaveBeenCalledTimes(1);
    });
  });

  describe('ProviderDetailPage Component (Requirement 5)', () => {
    it('renders commercial provider dossier with lander matrix and awarded contracts', () => {
      const firefly = getProviderById('firefly')!;
      const handleBack = vi.fn();
      render(
        <ProviderDetailPage
          provider={firefly}
          onBack={handleBack}
        />
      );

      expect(screen.getByRole('heading', { name: /firefly aerospace/i, level: 1 })).toBeInTheDocument();
      expect(screen.getByText(/lander architecture & propulsion matrix/i)).toBeInTheDocument();
      expect(screen.getByText('Blue Ghost 1')).toBeInTheDocument();
      expect(screen.getByText(/total award valuation/i)).toBeInTheDocument();

      const backBtn = screen.getByRole('button', { name: /back to providers/i });
      fireEvent.click(backBtn);
      expect(handleBack).toHaveBeenCalledTimes(1);
    });
  });
});
