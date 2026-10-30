import React from 'react';
import { AlertOctagon, RotateCw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Data Verification Anomaly',
  message,
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`p-6 sm:p-8 rounded-xl border border-[#E03C31]/40 bg-[#160a0a] shadow-lg my-6 text-white ${className}`}
      role="alert"
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-black/60 border border-[#E03C31]/40 flex items-center justify-center shrink-0 text-[#E03C31] shadow-sm">
          <AlertOctagon className="w-5 h-5" aria-hidden="true" />
        </div>
        <div className="flex-1">
          <h3 className="font-heading text-base font-bold text-[#fca5a5] mb-1">
            {title}
          </h3>
          <p className="text-sm text-zinc-300 leading-relaxed font-mono">
            {message}
          </p>
          {onRetry && (
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                icon={<RotateCw className="w-3.5 h-3.5" />}
                className="border-[#E03C31] text-[#fca5a5] hover:bg-[#E03C31]/20 hover:text-white"
              >
                Retry Operation
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
