import React, { useState } from 'react';
import { publicAssetUrl } from '../../utils/publicAssetUrl';
import { Menu, X, Compass, Rocket, Layers, Globe, Clock, Building2, ShieldCheck } from 'lucide-react';

export interface NavbarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onOpenSearch?: () => void;
}

const ClpsLogo: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <div className={`relative shrink-0 overflow-hidden rounded-lg border border-white/20 bg-[#030f29] shadow-sm ${className}`}>
    <img
      src={publicAssetUrl('/images/clps-logo.png')}
      alt="CLPS Explorer Insignia"
      className="w-full h-full object-cover"
    />
  </div>
);

export const Navbar: React.FC<NavbarProps> = ({
  activeTab = 'home',
  onTabChange,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home',      label: 'Mission Control', icon: Compass },
    { id: 'missions',  label: 'Missions',         icon: Rocket },
    { id: 'payloads',  label: 'Payloads',         icon: Layers },
    { id: 'map',       label: 'Lunar Map',        icon: Globe },
    { id: 'timeline',  label: 'Timeline',         icon: Clock },
    { id: 'providers', label: 'Providers',        icon: Building2 },
    { id: 'sources',   label: 'Sources',          icon: ShieldCheck },
  ];

  const handleNavClick = (id: string) => {
    onTabChange?.(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-black text-white">
      {/* ── Main bar ── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-14">

          {/* LEFT: logo + site name */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
            aria-label="CLPS Explorer Home"
          >
            <ClpsLogo className="w-9 h-9" />
            <div className="hidden sm:flex flex-col leading-none">
              <span className="text-[13px] font-extrabold tracking-widest uppercase text-white">
                CLPS Explorer
              </span>
              <span className="text-[10px] tracking-wider text-gray-400 font-normal mt-0.5">
                Commercial Lunar Payload Services
              </span>
            </div>
          </button>

          {/* CENTER spacer */}
          <div className="flex-1" />

          {/* DESKTOP NAV — right-aligned, NASA.gov style */}
          <nav className="hidden md:flex items-center" aria-label="Main Navigation">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`
                    relative px-3 py-1 text-[13px] font-medium tracking-wide whitespace-nowrap
                    transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white
                    ${isActive
                      ? 'text-white'
                      : 'text-gray-300 hover:text-white'
                    }
                  `}
                >
                  {item.label}
                  {/* NASA-style thin bottom underline on active */}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-white rounded-full" />
                  )}
                </button>
              );
            })}

            {/* Restrained edition tag */}
            <span className="ml-3 px-2 py-0.5 text-[10px] font-medium tracking-widest border border-white/15 text-zinc-400 rounded-sm uppercase">
              CLPS
            </span>
          </nav>

          {/* MOBILE hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden ml-3 p-2 rounded text-gray-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen
              ? <X className="w-5 h-5" aria-hidden="true" />
              : <Menu className="w-5 h-5" aria-hidden="true" />
            }
          </button>
        </div>
      </div>

      {/* 1-px bottom rule like NASA.gov */}
      <div className="h-px bg-white/10" />

      {/* MOBILE dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#111] border-t border-white/10">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`
                  w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium text-left
                  border-l-2 transition-colors
                  ${isActive
                    ? 'border-[#E03C31] text-white bg-white/5'
                    : 'border-transparent text-gray-300 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
