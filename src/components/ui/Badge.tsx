interface BadgeProps {
  label: string;
  variant?: 'green' | 'sky' | 'amber' | 'red' | 'gray' | 'violet';
}

const variants: Record<NonNullable<BadgeProps['variant']>, string> = {
  green: 'bg-primary/12 text-primary-dark border border-primary/25',
  sky: 'bg-emerald-500/12 text-emerald-700 border border-emerald-500/25',
  amber: 'bg-teal-500/12 text-teal-700 border border-teal-500/25',
  red: 'bg-red-500/12 text-red-600 border border-red-500/25',
  gray: 'bg-surface-elevated text-faint border border-surface-border',
  violet: 'bg-accent/12 text-accent-dark border border-accent/25',
};

export function Badge({ label, variant = 'gray' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${variants[variant]}`}>
      {label}
    </span>
  );
}

export function orderStatusBadge(status: string): React.ReactElement {
  const map: Record<string, BadgeProps['variant']> = {
    PENDING: 'amber',
    CONFIRMED: 'sky',
    PROCESSING: 'violet',
    SHIPPING: 'sky',
    DELIVERED: 'green',
    CANCELLED: 'red',
  };
  return <Badge label={status} variant={map[status] ?? 'gray'} />;
}
