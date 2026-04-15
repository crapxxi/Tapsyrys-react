import { type SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export function Select({ label, error, className = '', id, children, ...rest }: SelectProps) {
  const inputId = id ?? (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={inputId}
          className={`w-full appearance-none rounded-xl border bg-white px-4 py-2.5 pr-9 text-sm text-ink
            outline-none transition-all duration-150 cursor-pointer
            ${error
              ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/15'
              : 'border-surface-border hover:border-surface-muted focus:border-primary focus:ring-2 focus:ring-primary/15'
            }
            disabled:bg-surface-elevated disabled:opacity-60 ${className}`}
          {...rest}
        >
          {children}
        </select>
        {/* Chevron icon */}
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <svg className="h-4 w-4 text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
