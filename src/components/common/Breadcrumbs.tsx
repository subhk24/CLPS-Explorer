import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  active?: boolean;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  return (
    <nav aria-label="Breadcrumbs" className={`flex items-center text-xs font-mono text-zinc-400 ${className}`}>
      <button
        type="button"
        onClick={items[0]?.onClick}
        className="flex items-center gap-1 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white rounded px-1"
        aria-label="Return to Mission Control Home"
      >
        <Home className="w-3.5 h-3.5" aria-hidden="true" />
        <span className="sr-only">Home</span>
      </button>

      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="w-3 h-3 text-zinc-600 mx-1 shrink-0" aria-hidden="true" />
          {item.active || !item.onClick ? (
            <span
              className="text-white font-semibold truncate max-w-[200px] sm:max-w-md"
              aria-current={item.active ? 'page' : undefined}
            >
              {item.label}
            </span>
          ) : (
            <button
              type="button"
              onClick={item.onClick}
              className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white rounded px-1 truncate max-w-[150px] sm:max-w-xs"
            >
              {item.label}
            </button>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
