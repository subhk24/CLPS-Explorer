import React from 'react';
import { Orbit, ArrowRight } from 'lucide-react';
import { Container } from '../common/Container';
import { NasaPortraitCard } from '../common/NasaPortraitCard';
import { NasaFeatureCard } from '../common/NasaFeatureCard';
import { NasaAsymmetricGallery, type GalleryItem } from '../common/NasaAsymmetricGallery';
import { NasaPhotoBanner } from '../common/NasaPhotoBanner';
import { NasaRedArrow } from '../common/NasaRedArrow';
import { LunarGlobe3D } from '../map/LunarGlobe3D';
import { MetricRibbon } from './MetricRibbon';
import { Button } from '../common/Button';
import type { Mission, LandingSite } from '../../types';
import { getImageForEntity } from '../../data/imagery';

export interface HomepageContentProps {
  onNavigateTab: (tab: string) => void;
  onSelectMission: (mission: Mission) => void;
  onSelectSite: (siteId: string) => void;
  onSelectPayload: (payloadId: string) => void;
  onSelectProvider: (providerId: string) => void;
  allMissions: Mission[];
  allSites: LandingSite[];
  selectedMapSiteId: string | null;
  onSelectMapSiteId: (siteId: string) => void;
}

export const HomepageContent: React.FC<HomepageContentProps> = ({
  onNavigateTab,
  onSelectMission,
  onSelectSite,
  onSelectPayload,
  allMissions,
  allSites,
  selectedMapSiteId,
  onSelectMapSiteId,
}) => {
  // Key featured missions for the "Humans in Space"-inspired portrait row (Section 1)
  const im1 = allMissions.find((m) => m.id === 'to2-im');
  const blueGhost = allMissions.find((m) => m.id === 'to19d');
  const prime1 = allMissions.find((m) => m.id === 'prime-1');
  const viper = allMissions.find((m) => m.id === 'to20a');

  // Asymmetric Observatory Gallery items (Section 3, inspired by Screenshot 2)
  const galleryItems: GalleryItem[] = [
    {
      id: 'gallery-payloads',
      title: 'NASA Scientific Payloads Gallery',
      countLabel: '28 Flight Instruments',
      primaryImage: '/images/payloads/ndl.jpg',
      secondaryImage1: '/images/payloads/scalpss.jpg',
      secondaryImage2: '/images/payloads/trident.jpg',
      onClick: () => onNavigateTab('payloads'),
    },
    {
      id: 'gallery-sites',
      title: 'Lunar Touchdown Sites Selenography',
      countLabel: '8 Verified Regions',
      primaryImage: '/images/destinations/malapert-a.jpg',
      secondaryImage1: '/images/destinations/mare-crisium.jpg',
      secondaryImage2: '/images/destinations/gruithuisen-domes.jpg',
      onClick: () => onNavigateTab('map'),
    },
    {
      id: 'gallery-providers',
      title: 'Commercial Lunar Lander Fleet',
      countLabel: '13 Aerospace Contractors',
      primaryImage: '/images/providers/firefly.jpg',
      secondaryImage1: '/images/providers/intuitive-machines.jpg',
      secondaryImage2: '/images/providers/astrobotic.jpg',
      onClick: () => onNavigateTab('providers'),
    },
  ];

  return (
    <div className="space-y-0 text-white">
      {/* ── SECTION 1: FEATURED CONTENT CARDS (Screenshot 1: "Humans in Space" row) ── */}
      <section className="py-14 sm:py-20 bg-black text-white" aria-labelledby="featured-missions-heading">
        <Container size="xl">
          <div className="space-y-8">
            {/* Section Header with "Discover More ->" */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#38BDF8] font-bold block mb-1.5">
                  Artemis Delivery Manifest
                </span>
                <h2
                  id="featured-missions-heading"
                  className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight"
                >
                  Featured Deliveries
                </h2>
              </div>

              <button
                type="button"
                onClick={() => onNavigateTab('missions')}
                className="group inline-flex items-center gap-2.5 text-sm sm:text-base font-bold text-white hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white rounded py-1 px-1"
              >
                <span>Discover More Deliveries</span>
                <NasaRedArrow size="sm" />
              </button>
            </div>

            {/* Horizontal Row of 4 Prominent Tall Portrait Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {im1 && (
                <NasaPortraitCard
                  title="IM-1 Odysseus"
                  subtitle="HISTORIC SOUTH POLE TOUCHDOWN"
                  category="Landed"
                  imageUrl={getImageForEntity(im1.id).imageUrl}
                  aspectRatio="portrait"
                  onClick={() => onSelectMission(im1)}
                />
              )}

              {blueGhost && (
                <NasaPortraitCard
                  title="Blue Ghost 1"
                  subtitle="MARE CRISIUM DRILL BASIN"
                  category="Mare Crisium"
                  imageUrl={getImageForEntity(blueGhost.id).imageUrl}
                  aspectRatio="portrait"
                  onClick={() => onSelectMission(blueGhost)}
                />
              )}

              {prime1 && (
                <NasaPortraitCard
                  title="PRIME-1"
                  subtitle="POLAR WATER ICE PROSPECTOR"
                  category="South Pole"
                  imageUrl={getImageForEntity(prime1.id).imageUrl}
                  aspectRatio="portrait"
                  onClick={() => onSelectMission(prime1)}
                />
              )}

              {viper && (
                <NasaPortraitCard
                  title="Griffin 1 & VIPER"
                  subtitle="NOBILE CRATER ROVER DELIVERY"
                  category="Heavy Rover"
                  imageUrl={getImageForEntity(viper.id).imageUrl}
                  aspectRatio="portrait"
                  onClick={() => onSelectMission(viper)}
                />
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* ── SECTION 2: LARGE HORIZONTAL FEATURE CARD (Layout A) ── */}
      <section className="py-12 sm:py-16 bg-[#0a0a0c] border-y border-white/10" aria-label="Historic Expedition Feature">
        <Container size="xl">
          {im1 && (
            <NasaFeatureCard
              title="IM-1 Odysseus: Historic Touchdown at Malapert A"
              category="Archival Field Report // Task Order 2-IM"
              metadata="Intuitive Machines • Nova-C Class • Landed Feb 22, 2024 at 80.12° S"
              summary="On February 22, 2024, Intuitive Machines completed the first commercial lunar soft landing in human history and the first American lunar touchdown since Apollo 17. Live velocity telemetry from NASA's Navigation Doppler Lidar (NDL) guided Odysseus to the South Polar highlands."
              imageUrl="/images/missions/to2-im.jpg"
              onClick={() => onSelectMission(im1)}
            />
          )}
        </Container>
      </section>

      {/* ── SECTION 3: ASYMMETRIC IMAGE GALLERY (Screenshot 2: Observatory Gallery) ── */}
      <section className="py-16 sm:py-24 bg-black text-white border-y border-white/10" aria-labelledby="science-gallery-heading">
        <Container size="xl">
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#38BDF8] font-bold block mb-1">
                  Scientific Documentation
                </span>
                <h2
                  id="science-gallery-heading"
                  className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
                >
                  Lunar Science &amp; Exploration Catalogs
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 font-sans max-w-md">
                Verified high-resolution imagery capturing authentic flight articles, drill assemblies, and orbital selenography.
              </p>
            </div>

            {/* 3 Composite Asymmetric Cards */}
            <NasaAsymmetricGallery items={galleryItems} />
          </div>
        </Container>
      </section>

      {/* ── SECTION 4: FULL-WIDTH PHOTOGRAPHIC BANNER (Screenshot 2 bottom) ── */}
      <NasaPhotoBanner
        title="Explore the Universe from the Lunar Surface"
        subtitle="Artemis Lunar Architecture"
        description="NASA's Commercial Lunar Payload Services initiative contracts American aerospace providers to deliver science instruments and technology directly to the Moon, preparing for sustained human exploration."
        imageUrl="/images/destinations/moon-south-pole.jpg"
        actionText="Open 3D Selenography Atlas"
        onAction={() => onNavigateTab('map')}
      />

      {/* ── SECTION 5: 8-CARD PORTRAIT GRID (Screenshot 3: NASA Explore Grid) ── */}
      <section className="py-16 sm:py-24 bg-black text-white" aria-labelledby="campaign-grid-heading">
        <Container size="xl">
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#38BDF8] font-bold block mb-1.5">
                  Core Architecture
                </span>
                <h2
                  id="campaign-grid-heading"
                  className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight"
                >
                  Explore the Campaign
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 font-sans max-w-md">
                Navigate the multi-faceted pillars of NASA's commercial lunar exploration program.
              </p>
            </div>

            {/* 4x2 Grid of Tall Portrait Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <NasaPortraitCard
                title="Missions"
                subtitle="13 FIXED-PRICE DELIVERIES"
                imageUrl="/images/missions/to19d.jpg"
                aspectRatio="tall"
                onClick={() => onNavigateTab('missions')}
              />

              <NasaPortraitCard
                title="Landing Sites"
                subtitle="8 VERIFIED SURFACE SITES"
                imageUrl="/images/destinations/malapert-a.jpg"
                aspectRatio="tall"
                onClick={() => onNavigateTab('map')}
              />

              <NasaPortraitCard
                title="Science Payloads"
                subtitle="28 NASA INSTRUMENTS"
                imageUrl="/images/payloads/ndl.jpg"
                aspectRatio="tall"
                onClick={() => onNavigateTab('payloads')}
              />

              <NasaPortraitCard
                title="Commercial Providers"
                subtitle="13 AEROSPACE CONTRACTORS"
                imageUrl="/images/providers/intuitive-machines.jpg"
                aspectRatio="tall"
                onClick={() => onNavigateTab('providers')}
              />

              <NasaPortraitCard
                title="CADRE Rover Swarm"
                subtitle="AUTONOMOUS COOPERATIVE ROBOTICS"
                imageUrl="/images/payloads/cadre.jpg"
                aspectRatio="tall"
                onClick={() => onSelectPayload('cadre')}
              />

              <NasaPortraitCard
                title="LuSEE-Night"
                subtitle="FAR SIDE DARK AGES TELESCOPE"
                imageUrl="/images/payloads/lusee-night.jpg"
                aspectRatio="tall"
                onClick={() => onSelectPayload('lusee-night')}
              />

              <NasaPortraitCard
                title="TRIDENT Ice Drill"
                subtitle="CRYOGENIC PERMAFROST DRILL"
                imageUrl="/images/payloads/trident.jpg"
                aspectRatio="tall"
                onClick={() => onSelectPayload('trident')}
              />

              <NasaPortraitCard
                title="Flight Continuum"
                subtitle="2024–2028 CHRONOLOGY"
                imageUrl="/images/missions/cs-3.jpg"
                aspectRatio="tall"
                onClick={() => onNavigateTab('timeline')}
              />
            </div>
          </div>
        </Container>
      </section>

      {/* ── SECTION 6: INTERACTIVE 3D MOON & VERIFIED METRICS (Preserved & Polished) ── */}
      <section className="py-16 sm:py-20 bg-[#0d0d0f] border-t border-white/10 text-white" aria-labelledby="interactive-selenography-heading">
        <Container size="xl">
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 border border-white/20 text-xs font-mono font-bold text-white mb-2">
                  <Orbit className="w-3.5 h-3.5 text-white" />
                  <span>Interactive 3D Selenography</span>
                </div>
                <h2
                  id="interactive-selenography-heading"
                  className="font-heading text-2xl sm:text-4xl font-extrabold text-white tracking-tight"
                >
                  Explore CLPS Touchdown Sites in 3D Space
                </h2>
                <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl mt-1 font-sans">
                  Rotate the Moon 360° manually. Zoom and click any marker to inspect verified landing coordinates, from the Apollo highlands to the permanently shadowed South Pole.
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => onNavigateTab('map')}
                icon={<ArrowRight className="w-3.5 h-3.5" />}
                iconPosition="right"
              >
                Open Full Cartographic Atlas
              </Button>
            </div>

            {/* Embedded 3D Moon Globe with Site Quick-Select */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-8">
                <LunarGlobe3D
                  selectedSiteId={selectedMapSiteId}
                  onSelectSite={(id) => onSelectMapSiteId(id)}
                  onSelectMission={onSelectMission}
                />
              </div>

              {/* Quick Site Directory & Telemetry Summary */}
              <div className="lg:col-span-4 rounded-xl border border-white/10 bg-[#161616] p-5 flex flex-col justify-between shadow-xl space-y-4 text-white">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="font-mono text-xs font-bold text-zinc-300 uppercase tracking-wider">
                      Surface Coordinates Directory
                    </span>
                    <span className="text-[11px] font-mono text-zinc-400">
                      8 Verified Sites
                    </span>
                  </div>

                  <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
                    {allSites.map((site) => {
                      const isSelected = site.id === selectedMapSiteId;
                      return (
                        <button
                          key={site.id}
                          type="button"
                          onClick={() => {
                            onSelectMapSiteId(site.id);
                            onSelectSite(site.id);
                          }}
                          className={`w-full p-2.5 rounded-lg text-left transition-all border flex items-center justify-between text-xs ${
                            isSelected
                              ? 'bg-[#E03C31] text-white border-[#E03C31] shadow-md font-semibold'
                              : 'bg-black/60 text-zinc-200 hover:bg-white/10 border-white/10'
                          }`}
                        >
                          <div>
                            <div className="font-bold text-white">{site.name}</div>
                            <div className={`text-[10px] font-mono ${isSelected ? 'text-white' : 'text-zinc-400'}`}>
                              {site.coordinates.latitude > 0 ? `${site.coordinates.latitude}°N` : `${Math.abs(site.coordinates.latitude)}°S`},{' '}
                              {site.coordinates.longitude > 0 ? `${site.coordinates.longitude}°E` : `${Math.abs(site.coordinates.longitude)}°W`}
                            </div>
                          </div>
                          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${isSelected ? 'bg-black/30 text-white' : 'bg-white/10 text-white border border-white/10'}`}>
                            {site.coordinates.elevationMeters}m
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full justify-center"
                    onClick={() => onNavigateTab('map')}
                  >
                    Inspect Selected Site Details
                  </Button>
                </div>
              </div>
            </div>

            {/* Verified Program Metrics Ribbon */}
            <div className="pt-8">
              <MetricRibbon onNavigateTab={onNavigateTab} />
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};
