import React, { useState } from 'react';
import { Info, ExternalLink, ArrowRight } from 'lucide-react';
import { getProgramMetrics } from '../../data';
import { Modal } from '../common/Modal';

interface MetricDetailModal {
  title: string;
  count: string | number;
  definition: string;
  sourceText: string;
  sourceUrl: string;
  targetTab?: string;
  actionLabel?: string;
}

export interface MetricRibbonProps {
  onNavigateTab?: (tab: string) => void;
}

export const MetricRibbon: React.FC<MetricRibbonProps> = ({ onNavigateTab }) => {
  const metrics = getProgramMetrics();
  const [activeModal, setActiveModal] = useState<MetricDetailModal | null>(null);

  const metricCards: MetricDetailModal[] = [
    {
      title: 'Lunar Deliveries Awarded',
      count: metrics.totalDeliveriesAwarded,
      definition:
        'NASA baseline count of Firm-Fixed-Price (FFP) delivery task orders competitively awarded to commercial vendors under the CLPS IDIQ contract vehicle (13 distinct delivery expeditions catalogued).',
      sourceText: 'NASA CLPS Deliveries Database (July 2026)',
      sourceUrl: 'https://science.nasa.gov/lunar-discovery/deliveries/',
      targetTab: 'missions',
      actionLabel: 'View Missions Directory',
    },
    {
      title: 'Awarded Commercial Vendors',
      count: metrics.awardedVendorsCount,
      definition:
        'The five commercial aerospace contractors awarded active delivery task orders: Intuitive Machines, Firefly Aerospace, Astrobotic Technology, Team Draper, and Blue Origin.',
      sourceText: 'NASA CLPS Providers Directory',
      sourceUrl: 'https://www.nasa.gov/commercial-lunar-payload-services/clps-providers/',
      targetTab: 'providers',
      actionLabel: 'View Awarded Providers',
    },
    {
      title: 'Eligible Contractor Pool',
      count: metrics.eligiblePoolCount,
      definition:
        'American aerospace companies selected across the Nov 2018 and Nov 2019 solicitations eligible to compete for upcoming task orders under the master IDIQ vehicle.',
      sourceText: 'NASA CLPS Master Contract Notice',
      sourceUrl: 'https://www.nasa.gov/commercial-lunar-payload-services/clps-providers/',
      targetTab: 'providers',
      actionLabel: 'Explore All 13 Contractors',
    },
    {
      title: 'NASA Science & Tech Payloads',
      count: `${metrics.totalNasaPayloadsAwarded}+`,
      definition:
        'Cumulative total of NASA-provided instruments and technology demonstrations awarded across the 17 task orders through 2028. Excludes private commercial co-manifests.',
      sourceText: 'NASA CLPS Program Overview',
      sourceUrl: 'https://www.nasa.gov/commercial-lunar-payload-services/',
      targetTab: 'payloads',
      actionLabel: 'Explore Instruments Catalog',
    },
    {
      title: 'IDIQ Contract Ceiling',
      count: metrics.combinedContractCeiling,
      definition:
        'Total cumulative financial ceiling across all multiple-award task orders through November 2028 established by NASA Science Mission Directorate.',
      sourceText: 'NASA Solicitation 80JSC019R0005',
      sourceUrl: 'https://sam.gov',
      targetTab: 'sources',
      actionLabel: 'Review Contract Documents',
    },
  ];

  return (
    <section aria-labelledby="metrics-heading" className="w-full my-8 p-6 rounded-xl border border-white/10 bg-[#0e0e11] shadow-xl text-white">
      <h2 id="metrics-heading" className="sr-only">
        Verified Program Metrics
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-white/10 gap-6 md:gap-0">
        {metricCards.map((card, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between px-3 first:pl-0 last:pr-0 pt-4 md:pt-0"
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className="text-[11px] font-mono tracking-wider text-zinc-400 font-semibold uppercase">
                  {card.title}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveModal(card)}
                  aria-label={`Show program definition for ${card.title}`}
                  className="p-1 rounded text-zinc-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
                >
                  <Info className="w-3.5 h-3.5 opacity-80 hover:opacity-100" aria-hidden="true" />
                </button>
              </div>

              <div className="font-heading text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-sm">
                {card.count}
              </div>
            </div>

            <div className="mt-3 flex flex-col gap-1">
              {card.targetTab && onNavigateTab && (
                <button
                  type="button"
                  onClick={() => onNavigateTab(card.targetTab!)}
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-[#38BDF8] hover:text-white hover:underline transition-colors focus-visible:outline-none"
                >
                  <span>{card.actionLabel}</span>
                  <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setActiveModal(card)}
                className="text-[10px] text-left text-zinc-400 hover:text-white hover:underline font-mono transition-colors focus-visible:outline-none"
              >
                Methodology & Sources →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Methodology Detail Modal */}
      {activeModal && (
        <Modal
          isOpen={Boolean(activeModal)}
          onClose={() => setActiveModal(null)}
          title={activeModal.title}
          subtitle="NASA Program Counting Standard & Governance"
          size="md"
        >
          <div className="space-y-4 text-xs text-white">
            <div className="p-4 rounded-lg bg-[#161619] border border-white/10">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block font-semibold mb-1">
                Verified Value
              </span>
              <span className="font-heading text-2xl font-bold text-white">
                {activeModal.count}
              </span>
            </div>

            <div>
              <h4 className="font-semibold text-xs text-white mb-1">
                NASA Program Definition & Methodology
              </h4>
              <p className="text-zinc-300 leading-relaxed font-sans">
                {activeModal.definition}
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] font-mono text-zinc-400">
                {activeModal.sourceText}
              </span>
              <a
                href={activeModal.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-[#E03C31] hover:underline"
              >
                <span>Primary Portal</span>
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
};
