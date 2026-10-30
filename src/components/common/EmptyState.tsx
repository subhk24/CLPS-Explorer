import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  onReset?: () => void;
  resetLabel?: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No missions or payloads found',
  description = 'Try adjusting your search query, clearing active filters, or selecting a different status.',
  onReset,
  resetLabel = 'Reset All Filters',
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-xl border border-dashed border-white/15 bg-[#0e0e11] shadow-sm my-6 ${className}`}
      role="status"
    >
      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 mb-4 border border-white/10">
        <SearchX className="w-6 h-6 text-zinc-400" aria-hidden="true" />
      </div>
      <h3 className="font-heading text-lg font-bold text-white mb-1">
        {title}
      </h3>
      <p className="text-sm text-zinc-400 max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      {onReset && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onReset}
          icon={<RotateCcw className="w-3.5 h-3.5" />}
        >
          {resetLabel}
        </Button>
      )}
    </div>
  );
};
