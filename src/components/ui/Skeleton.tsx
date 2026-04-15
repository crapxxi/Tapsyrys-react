interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-surface-elevated ${className}`}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-surface-border bg-surface-card p-5 space-y-3">
      <Skeleton className="h-36 w-full rounded-xl" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-9 w-24 rounded-xl" />
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 border-b border-surface-border px-5 py-4">
      <Skeleton className="h-4 w-8" />
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-20 ml-auto" />
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
  );
}

export function SkeletonStatCard() {
  return (
    <div className="rounded-2xl border border-surface-border bg-surface-card p-5 flex items-center gap-4">
      <Skeleton className="h-12 w-12 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-3 w-28" />
      </div>
    </div>
  );
}
