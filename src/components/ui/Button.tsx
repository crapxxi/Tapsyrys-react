import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Spinner } from './Spinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
}

const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-primary text-white font-bold hover:bg-primary-dark shadow-sm hover:shadow-neon-sm disabled:bg-primary/40 disabled:shadow-none',
  secondary:
    'bg-white text-sub border border-surface-border hover:bg-surface-elevated hover:text-ink hover:border-surface-muted shadow-sm',
  danger:
    'bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300',
  ghost:
    'bg-transparent text-primary-dark hover:bg-primary/10',
  outline:
    'bg-white text-primary-dark border border-primary/50 hover:border-primary hover:bg-primary/8 shadow-sm',
};

const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-xl',
  md: 'px-4 py-2.5 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-2xl',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  disabled,
  className = '',
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={loading || disabled}
      className={`inline-flex items-center justify-center gap-2 font-semibold
        transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40
        disabled:cursor-not-allowed disabled:opacity-50
        ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
}
