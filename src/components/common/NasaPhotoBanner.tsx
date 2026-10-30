import React from 'react';
import { Container } from './Container';
import { NasaRedArrow } from './NasaRedArrow';

export interface NasaPhotoBannerProps {
  title: string;
  subtitle?: string;
  description: string;
  imageUrl: string;
  actionText: string;
  onAction: () => void;
  className?: string;
}

export const NasaPhotoBanner: React.FC<NasaPhotoBannerProps> = ({
  title,
  subtitle,
  description,
  imageUrl,
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <section
      aria-label={title}
      className={`relative w-full overflow-hidden bg-black py-20 sm:py-28 select-none ${className}`}
    >
      {/* Background Photography with subtle dark skrim */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <img
          src={imageUrl}
          alt=""
          className="w-full h-full object-cover object-center filter contrast-110 brightness-[0.65]"
          loading="lazy"
        />
        {/* Gradients to guarantee high text contrast across any screen */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-black/40" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent" />
      </div>

      <Container size="xl" className="relative z-10">
        <div className="max-w-2xl space-y-5">
          {subtitle && (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E03C31]" />
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#38BDF8] font-bold">
                {subtitle}
              </span>
            </div>
          )}

          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.05]">
            {title}
          </h2>

          <p className="text-sm sm:text-base text-zinc-200 leading-relaxed font-sans max-w-xl">
            {description}
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={onAction}
              className="group inline-flex items-center gap-3 px-6 py-3.5 rounded bg-white text-black hover:bg-zinc-200 font-bold text-sm sm:text-base transition-all hover:scale-[1.02] shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span>{actionText}</span>
              <NasaRedArrow size="sm" />
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
};
