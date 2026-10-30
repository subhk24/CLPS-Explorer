import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'default' | 'neutral' | 'accent' | 'outline' | 'amber' | 'blue';
  size?: 'sm' | 'md';
  className?: string;
}

const variantClasses = {
  default: 'bg-white/10 text-white border-white/20',
  neutral: 'bg-white/5 text-neutral-300 border-white/10',
  accent: 'bg-[#E03C31]/20 text-[#FF6B61] border-[#E03C31]/40 font-semibold',
  outline: 'bg-transparent text-white border-white/20',
  amber: 'bg-amber-950/60 text-amber-300 border-amber-600/40 font-semibold',
  blue: 'bg-white/10 text-white border-white/20 font-semibold',
};

const sizeClasses = {
  sm: 'text-[11px] px-2 py-0.5',
  md: 'text-xs px-2.5 py-1',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-sans font-medium rounded-md border ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
