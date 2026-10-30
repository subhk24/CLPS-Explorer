import React, { useState } from 'react';

export interface GalleryItem {
  id: string;
  title: string;
  countLabel: string;
  primaryImage: string;
  secondaryImage1: string;
  secondaryImage2: string;
  onClick: () => void;
}

export interface NasaAsymmetricGalleryProps {
  items: GalleryItem[];
  className?: string;
}

const AsymmetricTile: React.FC<{ item: GalleryItem }> = ({ item }) => {
  const [err1, setErr1] = useState(false);
  const [err2, setErr2] = useState(false);
  const [err3, setErr3] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      item.onClick();
    }
  };

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={item.onClick}
      onKeyDown={handleKeyDown}
      aria-label={`${item.title} - ${item.countLabel}. Click to explore gallery.`}
      className="group cursor-pointer flex flex-col space-y-3 p-3 rounded-lg border border-white/10 bg-[#0e0e11] hover:bg-[#141417] hover:border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white transition-all duration-200 select-none"
    >
      {/* Composite Image Box: 2/3 Left Large + 1/3 Right Stacked Pair */}
      <div className="relative w-full aspect-[16/10] grid grid-cols-3 gap-1 overflow-hidden rounded bg-black border border-white/10">
        {/* Left Large Photo (spans 2 columns) */}
        <div className="col-span-2 relative h-full overflow-hidden bg-zinc-950">
          {!err1 ? (
            <img
              src={item.primaryImage}
              alt={item.title}
              onError={() => setErr1(true)}
              className="w-full h-full object-cover filter contrast-[1.05] transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-zinc-950" />
          )}
        </div>

        {/* Right Stacked Pair (spans 1 column) */}
        <div className="col-span-1 grid grid-rows-2 gap-1 h-full">
          <div className="relative h-full overflow-hidden bg-zinc-950">
            {!err2 ? (
              <img
                src={item.secondaryImage1}
                alt={`${item.title} detail`}
                onError={() => setErr2(true)}
                className="w-full h-full object-cover filter contrast-[1.05] transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-zinc-950" />
            )}
          </div>
          <div className="relative h-full overflow-hidden bg-zinc-950">
            {!err3 ? (
              <img
                src={item.secondaryImage2}
                alt={`${item.title} auxiliary`}
                onError={() => setErr3(true)}
                className="w-full h-full object-cover filter contrast-[1.05] transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-zinc-950" />
            )}
          </div>
        </div>
      </div>

      {/* Title & Count Label Below Image Group */}
      <div className="space-y-1 pt-1">
        <h3 className="font-heading font-extrabold text-base sm:text-lg text-white group-hover:text-[#38BDF8] transition-colors leading-snug">
          {item.title}
        </h3>
        <p className="text-[11px] font-mono tracking-widest uppercase text-zinc-400 font-semibold">
          {item.countLabel}
        </p>
      </div>
    </article>
  );
};

export const NasaAsymmetricGallery: React.FC<NasaAsymmetricGalleryProps> = ({ items, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 ${className}`}>
      {items.map((item) => (
        <AsymmetricTile key={item.id} item={item} />
      ))}
    </div>
  );
};
