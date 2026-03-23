import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md';
}

const VARIANT_STYLES = {
  primary: 'bg-accent-blue hover:bg-accent-blue-hover text-white',
  secondary: 'bg-bg-tertiary hover:bg-border-secondary text-text-primary border border-border-primary',
  ghost: 'bg-transparent hover:bg-bg-tertiary text-text-secondary hover:text-text-primary',
};

const SIZE_STYLES = {
  sm: 'px-2.5 py-1 text-xs',
  md: 'px-4 py-2 text-sm',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-all duration-150 cursor-pointer ${VARIANT_STYLES[variant]} ${SIZE_STYLES[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
