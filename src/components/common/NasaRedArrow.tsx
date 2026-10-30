import React from 'react';
import { ArrowRight } from 'lucide-react';

export interface NasaRedArrowProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Official NASA-inspired circular red arrow call-to-action button.
 * Matches NASA.gov's signature navigational indicator and interactive card links.
 */
export const NasaRedArrow: React.FC<NasaRedArrowProps> = ({
  className = '',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-7 h-7',
    lg: 'w-8 h-8',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-[#E03C31] text-white shadow-md transition-all duration-300 group-hover:bg-[#C92A20] group-hover:scale-110 group-hover:translate-x-0.5 shrink-0 ${sizeClasses[size]} ${className}`}
      aria-hidden="true"
    >
      <ArrowRight className={iconSizes[size]} />
    </span>
  );
};
