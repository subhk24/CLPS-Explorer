import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Container } from './components/common/Container';
import { ErrorState } from './components/common/ErrorState';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { NasaHeroVideo } from './components/dashboard/NasaHeroVideo';
import { HomepageContent } from './components/dashboard/HomepageContent';
import { MissionDetailModal } from './components/missions/MissionDetailModal';
import { MissionExplorer } from './components/missions/MissionExplorer';
import { PayloadsExplorer } from './components/payloads/PayloadsExplorer';
import { LunarMap } from './components/map/LunarMap';
import { TimelineExplorer } from './components/timeline/TimelineExplorer';
import { ProvidersDirectory } from './components/providers/ProvidersDirectory';
import { SourcesExplorer } from './components/sources/SourcesExplorer';
import { MissionDetailPage } from './components/detail/MissionDetailPage';
import { PayloadDetailPage } from './components/detail/PayloadDetailPage';
import { SiteDetailPage } from './components/detail/SiteDetailPage';
import { ProviderDetailPage } from './components/detail/ProviderDetailPage';
import {
  getMissions,
  getMissionById,
  getPayloadById,
  getLandingSites,
  getLandingSiteById,
  getProviderById,
  validateDataIntegrity,
  formatDataIntegrityAlert,
} from './data';
import type { Mission, Payload, LandingSite, Provider, ScienceDomain } from './types';

export const App: React.FC = () => {
  // Read initial query parameters from window URL
  const initialParams = useMemo(() => {
    if (typeof window === 'undefined') {
      return {
        tab: 'home',
        missionId: null,
        payloadId: null,
        siteId: null,
        providerId: null,
        category: 'all' as ScienceDomain | 'all',
        search: '',
        status: 'all',
        provider: 'all',
        destination: 'all',
        year: 'all',
      };
    }
    const params = new URLSearchParams(window.location.search);
    const mId = params.get('mission') || params.get('missionId') || null;
    const pId = params.get('payload') || params.get('payloadId') || null;
    const sId = params.get('site') || params.get('siteId') || null;
    const provId = params.get('providerId') || null;
    const tabParam = params.get('tab');

    // Auto-resolve tab if specific ID provided
    let defaultTab = tabParam || 'home';
    if (!tabParam) {
      if (mId) defaultTab = 'mission-detail';
      else if (pId) defaultTab = 'payload-detail';
      else if (sId) defaultTab = 'site-detail';
    }

    return {
      tab: defaultTab,
      missionId: mId,
      payloadId: pId,
      siteId: sId,
      providerId: provId,
      category: ((params.get('category') as ScienceDomain) || 'all') as ScienceDomain | 'all',
      search: params.get('search') || '',
      status: params.get('status') || 'all',
      provider: params.get('provider') || 'all',
      destination: params.get('destination') || 'all',
      year: params.get('year') || 'all',
    };
  }, []);

  const [activeTab, setActiveTab] = useState<string>(initialParams.tab);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(() => {
    if (initialParams.missionId) {
      return getMissionById(initialParams.missionId) || null;
    }
    return null;
  });
  const [selectedPayload, setSelectedPayload] = useState<Payload | null>(() => {
    if (initialParams.payloadId) {
      return getPayloadById(initialParams.payloadId) || null;
    }
    return null;
  });
  const [selectedSite, setSelectedSite] = useState<LandingSite | null>(() => {
    if (initialParams.siteId) {
      return getLandingSiteById(initialParams.siteId) || null;
    }
    return null;
  });
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(() => {
    if (initialParams.providerId) {
      return getProviderById(initialParams.providerId) || null;
    }
    return null;
  });

  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [selectedMapSiteId, setSelectedMapSiteId] = useState<string | null>(initialParams.siteId);
  const [selectedPayloadCategory, setSelectedPayloadCategory] = useState<ScienceDomain | 'all'>(
    initialParams.category
  );

  // Validate research data integrity on startup
  const integrityReport = useMemo(() => validateDataIntegrity(), []);
  const allMissions = useMemo(() => getMissions(), []);
  const allSites = useMemo(() => getLandingSites(), []);

  // Update browser URL query string to match application state
  const syncUrlParams = useCallback(
    (
      tab: string,
      missionId?: string | null,
      payloadId?: string | null,
      siteId?: string | null,
      providerId?: string | null,
      category?: string | null,
      extraParams?: Record<string, string | null | undefined>
    ) => {
      if (typeof window === 'undefined') return;
      const params = new URLSearchParams();
      if (tab !== 'home') params.set('tab', tab);
      if (missionId) params.set('mission', missionId);
      if (payloadId) params.set('payload', payloadId);
      if (siteId) params.set('site', siteId);
      if (providerId) params.set('providerId', providerId);
      if (category && category !== 'all') params.set('category', category);

      if (extraParams) {
        Object.entries(extraParams).forEach(([k, v]) => {
          if (v && v !== 'all') {
            params.set(k, v);
          }
        });
      }

      const newQuery = params.toString() ? `?${params.toString()}` : window.location.pathname;
      window.history.pushState({}, '', newQuery);
    },
    []
  );

  // Sync state on tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    syncUrlParams(tab, null, null, selectedMapSiteId, null, selectedPayloadCategory);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dedicated Detail Page Navigation Handlers
  const handleOpenMissionDetail = (mission: Mission) => {
    setSelectedMission(mission);
    setActiveTab('mission-detail');
    syncUrlParams('mission-detail', mission.id, null, selectedMapSiteId, null, selectedPayloadCategory);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPayloadDetail = (payloadOrId: Payload | string) => {
    const payload = typeof payloadOrId === 'string' ? getPayloadById(payloadOrId) : payloadOrId;
    if (payload) {
      setSelectedPayload(payload);
      setActiveTab('payload-detail');
      syncUrlParams('payload-detail', null, payload.id, selectedMapSiteId, null, payload.category);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenSiteDetail = (siteOrId: LandingSite | string) => {
    const site = typeof siteOrId === 'string' ? getLandingSiteById(siteOrId) : siteOrId;
    if (site) {
      setSelectedSite(site);
      setSelectedMapSiteId(site.id);
      setActiveTab('site-detail');
      syncUrlParams('site-detail', null, null, site.id, null, selectedPayloadCategory);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenProviderDetail = (providerOrId: Provider | string) => {
    const provider = typeof providerOrId === 'string' ? getProviderById(providerOrId) : providerOrId;
    if (provider) {
      setSelectedProvider(provider);
      setActiveTab('provider-detail');
      syncUrlParams('provider-detail', null, null, null, provider.id, selectedPayloadCategory);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCloseDetailModal = () => {
    setIsDetailOpen(false);
  };

  // Navigate to lunar map focused on a site
  const handleSelectSiteFromAnywhere = (siteId: string) => {
    setSelectedMapSiteId(siteId);
    setActiveTab('map');
    syncUrlParams('map', null, null, siteId, null, null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Listen for browser popstate (back/forward navigation)
  useEffect(() => {
    const onPopState = () => {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab') || 'home';
      const mId = params.get('mission') || params.get('missionId');
      const pId = params.get('payload') || params.get('payloadId');
      const sId = params.get('site') || params.get('siteId');
      const provId = params.get('providerId');
      const cat = (params.get('category') as ScienceDomain) || 'all';

      setActiveTab(tab);
      setSelectedPayloadCategory(cat);
      setSelectedMapSiteId(sId);

      if (mId) {
        const m = getMissionById(mId);
        if (m) setSelectedMission(m);
      }
      if (pId) {
        const p = getPayloadById(pId);
        if (p) setSelectedPayload(p);
      }
      if (sId) {
        const s = getLandingSiteById(sId);
        if (s) setSelectedSite(s);
      }
      if (provId) {
        const prov = getProviderById(provId);
        if (prov) setSelectedProvider(prov);
      }
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Global Cmd+K / Ctrl+K keyboard shortcut to launch missions search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setActiveTab('missions');
        setTimeout(() => {
          const input = document.getElementById('mission-search-input');
          input?.focus();
        }, 50);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-black text-slate-100 font-sans selection:bg-[#E03C31] selection:text-white">
      {/* Skip to Main Content Link for Keyboard Accessibility (WCAG 2.2 AA) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#E03C31] focus:text-white focus:font-mono focus:text-xs focus:rounded focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      {/* Global NASA Navigation Bar */}
      <Navbar
        activeTab={activeTab.startsWith('mission') ? 'missions' : activeTab.startsWith('payload') ? 'payloads' : activeTab.startsWith('site') ? 'map' : activeTab.startsWith('provider') ? 'providers' : activeTab}
        onTabChange={handleTabChange}
        onOpenSearch={() => {
          setActiveTab('missions');
          setTimeout(() => {
            const input = document.getElementById('mission-search-input');
            input?.focus();
          }, 50);
        }}
      />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1">
        {/* If integrity check failed, show error banner */}
        {!integrityReport.isValid && (
          <Container size="xl" className="mt-4">
            <ErrorState
              title="Data Integrity Validation Alert"
              message={formatDataIntegrityAlert(integrityReport)}
            />
          </Container>
        )}

        {/* VIEW 1: HOME / MISSION CONTROL */}
        <div style={{ display: activeTab === 'home' ? 'block' : 'none' }}>
          <ErrorBoundary fallbackTitle="Mission Control Dashboard Error">
            {/* VIEWPORT 1: CINEMATIC LUNAR VIDEO HERO */}
            <NasaHeroVideo
              onExploreMissions={() => handleTabChange('missions')}
              onExploreMap={() => handleTabChange('map')}
              onOpenMissionDetail={handleOpenMissionDetail}
              featuredMissions={allMissions}
              isActive={activeTab === 'home'}
            />

            {/* NASA-INSPIRED EDITORIAL SECTIONS BELOW HERO */}
            <HomepageContent
              onNavigateTab={handleTabChange}
              onSelectMission={handleOpenMissionDetail}
              onSelectSite={handleOpenSiteDetail}
              onSelectPayload={handleOpenPayloadDetail}
              onSelectProvider={handleOpenProviderDetail}
              allMissions={allMissions}
              allSites={allSites}
              selectedMapSiteId={selectedMapSiteId}
              onSelectMapSiteId={(id) => setSelectedMapSiteId(id)}
            />
          </ErrorBoundary>
        </div>

        {/* VIEW 2: MISSIONS EXPLORER */}
        {activeTab === 'missions' && (
          <ErrorBoundary fallbackTitle="Missions Explorer Anomaly">
            <section className="py-8 bg-black text-white">
              <Container size="xl">
                <div className="space-y-6">
                  <div>
                    <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                      Missions <span className="sr-only">— CLPS Delivery Missions Explorer</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-zinc-400 mt-1 font-sans">
                      Multi-faceted directory of {allMissions.length} catalogued fixed-price task orders awarded to American commercial providers.
                    </p>
                  </div>

                  <MissionExplorer
                    onSelectMission={handleOpenMissionDetail}
                    filters={{
                      search: initialParams.search,
                      status: initialParams.status,
                      provider: initialParams.provider,
                      destination: initialParams.destination,
                      year: initialParams.year,
                    }}
                    onFilterChange={(newFilters) => {
                      syncUrlParams(activeTab, null, null, null, null, null, {
                        search: newFilters.search || null,
                        status: newFilters.status !== 'all' ? newFilters.status : null,
                        provider: newFilters.provider !== 'all' ? newFilters.provider : null,
                        destination: newFilters.destination !== 'all' ? newFilters.destination : null,
                        year: newFilters.year !== 'all' ? newFilters.year : null,
                        sort: newFilters.sort !== 'launch_date_desc' ? newFilters.sort : null,
                      });
                    }}
                  />
                </div>
              </Container>
            </section>
          </ErrorBoundary>
        )}

        {/* VIEW 3: PAYLOADS & SCIENCE DIRECTORY */}
        {activeTab === 'payloads' && (
          <ErrorBoundary fallbackTitle="Payloads Catalog Anomaly">
            <section className="py-8 bg-black text-white">
              <Container size="xl">
                <div className="space-y-6">
                  <div>
                    <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                      Payloads <span className="sr-only">— Scientific Payloads &amp; Technology Directory</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-zinc-400 mt-1 font-sans">
                      Verified catalog of NASA science instruments, cameras, retroreflectors, and drills.
                    </p>
                  </div>

                  <PayloadsExplorer
                    onSelectMission={handleOpenMissionDetail}
                    onSelectPayload={handleOpenPayloadDetail}
                    initialCategory={selectedPayloadCategory}
                  />
                </div>
              </Container>
            </section>
          </ErrorBoundary>
        )}

        {/* VIEW 4: INTERACTIVE LUNAR CARTOGRAPHY & 3D GLOBE */}
        {activeTab === 'map' && (
          <ErrorBoundary fallbackTitle="Lunar Cartography Anomaly">
            <section className="py-8 bg-black text-white">
              <Container size="xl">
                <div className="space-y-6">
                  <div>
                    <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                      Lunar Map <span className="sr-only">— Interactive Selenographic Cartography &amp; Touchdown Atlas</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-zinc-400 mt-1 font-sans">
                      Selenographic projections mapping 8 verified landing sites across nearside, far side, and South Polar terrain.
                    </p>
                  </div>

                  <LunarMap
                    onSelectSite={(site) => {
                      if (site) handleOpenSiteDetail(site);
                    }}
                    selectedSiteId={selectedMapSiteId}
                  />
                </div>
              </Container>
            </section>
          </ErrorBoundary>
        )}

        {/* VIEW 5: MISSION TIMELINE & CONTINUUM */}
        {activeTab === 'timeline' && (
          <ErrorBoundary fallbackTitle="Timeline Visualization Anomaly">
            <section className="py-8 bg-black text-white">
              <Container size="xl">
                <div className="space-y-6">
                  <div>
                    <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                      Timeline <span className="sr-only">— Chronological Mission Continuum &amp; Flight Horizon</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-zinc-400 mt-1 font-sans">
                      Chronological flight sequence spanning 2024 pioneering landings through 2028 Artemis infrastructure deliveries.
                    </p>
                  </div>

                  <TimelineExplorer onSelectMission={handleOpenMissionDetail} />
                </div>
              </Container>
            </section>
          </ErrorBoundary>
        )}

        {/* VIEW 6: COMMERCIAL PROVIDERS */}
        {activeTab === 'providers' && (
          <ErrorBoundary fallbackTitle="Providers Directory Anomaly">
            <section className="py-8 bg-black text-white">
              <Container size="xl">
                <div className="space-y-6">
                  <div>
                    <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                      Providers <span className="sr-only">— Commercial Provider Directory &amp; Lander Matrix</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-zinc-400 mt-1 font-sans">
                      Profiles of the 5 awarded prime contractors, 7 eligible catalog companies, and lander propulsion specifications.
                    </p>
                  </div>

                  <ProvidersDirectory
                    onSelectMission={handleOpenMissionDetail}
                    onSelectProvider={handleOpenProviderDetail}
                  />
                </div>
              </Container>
            </section>
          </ErrorBoundary>
        )}

        {/* VIEW 7: SOURCES & METHODOLOGY */}
        {activeTab === 'sources' && (
          <ErrorBoundary fallbackTitle="Sources Reference Anomaly">
            <SourcesExplorer />
          </ErrorBoundary>
        )}

        {/* DEDICATED DETAIL VIEW 1: MISSION DOSSIER */}
        {activeTab === 'mission-detail' && selectedMission && (
          <ErrorBoundary fallbackTitle="Mission Dossier Anomaly">
            <MissionDetailPage
              mission={selectedMission}
              onBack={() => handleTabChange('missions')}
              onSelectPayload={handleOpenPayloadDetail}
              onSelectSite={handleSelectSiteFromAnywhere}
              onSelectMission={handleOpenMissionDetail}
              onNavigateHome={() => handleTabChange('home')}
            />
          </ErrorBoundary>
        )}

        {/* DEDICATED DETAIL VIEW 2: PAYLOAD DOSSIER */}
        {activeTab === 'payload-detail' && selectedPayload && (
          <ErrorBoundary fallbackTitle="Payload Dossier Anomaly">
            <PayloadDetailPage
              payload={selectedPayload}
              onBack={() => handleTabChange('payloads')}
              onSelectMission={handleOpenMissionDetail}
              onSelectPayload={handleOpenPayloadDetail}
              onNavigateHome={() => handleTabChange('home')}
            />
          </ErrorBoundary>
        )}

        {/* DEDICATED DETAIL VIEW 3: LANDING SITE DOSSIER */}
        {activeTab === 'site-detail' && selectedSite && (
          <ErrorBoundary fallbackTitle="Site Dossier Anomaly">
            <SiteDetailPage
              site={selectedSite}
              onBack={() => handleTabChange('map')}
              onSelectMission={handleOpenMissionDetail}
              onSelectSite={handleOpenSiteDetail}
              onOpenGlobeView={(siteId) => handleSelectSiteFromAnywhere(siteId)}
              onNavigateHome={() => handleTabChange('home')}
            />
          </ErrorBoundary>
        )}

        {/* DEDICATED DETAIL VIEW 4: PROVIDER DOSSIER */}
        {activeTab === 'provider-detail' && selectedProvider && (
          <ErrorBoundary fallbackTitle="Provider Dossier Anomaly">
            <ProviderDetailPage
              provider={selectedProvider}
              onBack={() => handleTabChange('providers')}
              onSelectMission={handleOpenMissionDetail}
              onSelectProvider={handleOpenProviderDetail}
              onNavigateHome={() => handleTabChange('home')}
            />
          </ErrorBoundary>
        )}
      </main>

      {/* Legacy / Direct Mission Detail Modal for unit test compatibility */}
      <MissionDetailModal
        mission={selectedMission}
        isOpen={isDetailOpen}
        onClose={handleCloseDetailModal}
        onSelectPayload={handleOpenPayloadDetail}
        onSelectSite={handleSelectSiteFromAnywhere}
      />

      {/* Global NASA-Style Footer */}
      <Footer onOpenSources={() => handleTabChange('sources')} />
    </div>
  );
};
