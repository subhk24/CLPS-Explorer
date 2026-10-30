import React from 'react';
import { ExternalLink, ShieldCheck, Database, Info, Globe, Rocket } from 'lucide-react';
import { Container } from '../common/Container';

export interface FooterProps {
  onOpenSources?: () => void;
}

const ClpsLogo: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <div className={`relative shrink-0 overflow-hidden rounded-lg border border-white/20 bg-[#030f29] shadow-sm ${className}`}>
    <img
      src="/images/clps-logo.png"
      alt="CLPS Explorer Insignia"
      className="w-full h-full object-cover"
    />
  </div>
);

export const Footer: React.FC<FooterProps> = ({ onOpenSources }) => {
  return (
    <footer className="w-full bg-black text-zinc-300 border-t border-white/10 mt-20 pt-14 pb-8">
      <Container size="xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-white/10 text-xs">
          {/* Col 1: Project Identity */}
          <div className="space-y-4 md:col-span-5">
            <div className="flex items-center gap-3">
              <ClpsLogo className="w-12 h-12" />
              <div>
                <span className="font-heading font-extrabold text-xl text-white tracking-tight block">
                  CLPS Explorer
                </span>
                <span className="text-[11px] font-mono text-zinc-400">
                  Commercial Lunar Payload Services Intelligence
                </span>
              </div>
            </div>

            <p className="text-zinc-400 leading-relaxed max-w-md font-sans text-xs">
              An interactive research platform cataloguing NASA’s commercial lunar delivery manifests, scientific instruments, landing selenography, and flight continuum.
            </p>
          </div>

          {/* Col 2: NASA Reference Portals */}
          <div className="space-y-3 md:col-span-3">
            <h4 className="font-mono text-xs uppercase tracking-wider text-white font-bold flex items-center gap-1.5 border-b border-white/10 pb-1.5">
              <Rocket className="w-3.5 h-3.5 text-[#E03C31]" aria-hidden="true" />
              <span>NASA Reference Portals</span>
            </h4>
            <ul className="space-y-2 text-zinc-400">
              <li>
                <a
                  href="https://www.nasa.gov/commercial-lunar-payload-services/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white hover:underline transition-colors flex items-center gap-1"
                >
                  NASA CLPS Program Overview
                  <ExternalLink className="w-3 h-3 text-zinc-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://science.nasa.gov/lunar-discovery/deliveries/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white hover:underline transition-colors flex items-center gap-1"
                >
                  NASA Science Mission Deliveries
                  <ExternalLink className="w-3 h-3 text-zinc-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.nasa.gov/artemis/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white hover:underline transition-colors flex items-center gap-1"
                >
                  Artemis Campaign Architecture
                  <ExternalLink className="w-3 h-3 text-zinc-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.lroc.asu.edu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white hover:underline transition-colors flex items-center gap-1"
                >
                  LROC Landing Sites &amp; Cartography
                  <ExternalLink className="w-3 h-3 text-zinc-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Data Governance & Provenance */}
          <div className="space-y-3 md:col-span-4">
            <h4 className="font-mono text-xs uppercase tracking-wider text-white font-bold flex items-center gap-1.5 border-b border-white/10 pb-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
              <span>Data Governance &amp; References</span>
            </h4>
            <ul className="space-y-2 text-zinc-400">
              <li>
                <button
                  type="button"
                  onClick={onOpenSources}
                  className="hover:text-white hover:underline transition-colors text-left flex items-center gap-1"
                >
                  <Database className="w-3 h-3 text-zinc-400" aria-hidden="true" />
                  Sources, Methodology &amp; Flight Bibliography
                </button>
              </li>
              <li>
                <a
                  href="https://pds.nasa.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white hover:underline transition-colors flex items-center gap-1"
                >
                  <Globe className="w-3 h-3 text-zinc-400" aria-hidden="true" />
                  NASA Planetary Data System (PDS)
                </a>
              </li>
              <li className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-mono pt-1">
                <Info className="w-3 h-3 text-zinc-400" aria-hidden="true" />
                <span>Catalog Verified: October 2026 SMD Manifest</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Academic & Non-Affiliation Disclaimer */}
        <div className="py-6 space-y-2.5 text-xs text-zinc-400 font-sans leading-relaxed border-b border-white/10">
          <p>
            CLPS Explorer is an independent student-developed project created for educational and research purposes in connection with the NASA 2026 Challenge.
          </p>
          <p>
            This project is not an official NASA website, application, or product. It is not affiliated with, endorsed by, sponsored by, or operated by NASA.
          </p>
          <p>
            NASA and its Commercial Lunar Payload Services (CLPS) program are referenced for informational purposes. Mission information and other third-party materials are attributed to their respective sources.
          </p>
        </div>

        {/* Bottom attribution and notice */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500 gap-4">
          <p className="font-sans">
            CLPS Explorer • Student Challenge Entry • NASA 2026 Challenge
          </p>
          <p className="font-mono text-[10px] text-zinc-500">
            Source Material Attribution: NASA Science Mission Directorate / Public Domain
          </p>
        </div>
      </Container>
    </footer>
  );
};
