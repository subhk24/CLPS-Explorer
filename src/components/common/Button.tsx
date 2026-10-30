import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
}

const variantClasses = {
  primary:
    'bg-[#E03C31] hover:bg-[#c42d23] text-white font-semibold active:translate-y-px border border-transparent shadow-sm',
  secondary:
    'bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold active:translate-y-px shadow-sm',
  outline:
    'bg-transparent hover:bg-white/10 text-white border border-white/30 hover:border-white active:translate-y-px',
  ghost:
    'bg-transparent hover:bg-white/10 text-neutral-200 hover:text-white border border-transparent font-medium',
};

const sizeClasses = {
  sm: 'text-xs px-3 py-2 min-h-[36px]',
  md: 'text-sm px-4 py-2.5 min-h-[44px]',
  lg: 'text-base px-6 py-3 min-h-[48px]',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      children,
      icon,
      iconPosition = 'left',
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`inline-flex items-center justify-center gap-2 rounded-md transition-colors duration-150 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lunar-sky focus-visible:ring-offset-2 focus-visible:ring-offset-space-deep select-none ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {icon && iconPosition === 'left' && <span className="inline-flex shrink-0">{icon}</span>}
        <span>{children}</span>
        {icon && iconPosition === 'right' && <span className="inline-flex shrink-0">{icon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
