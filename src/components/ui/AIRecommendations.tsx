import { useTranslation } from 'react-i18next';
import { useRecommendations } from '@/hooks/useRecommendations';
import { useProduct } from '@/hooks/useProducts';
import { useCartStore } from '@/store/cartStore';
import type { Recommendation } from '@/types/api';

// ─── Single recommendation card ───────────────────────────────────────────────

interface RecommendationCardProps {
  rec: Recommendation;
}

function RecommendationCard({ rec }: RecommendationCardProps) {
  const { t } = useTranslation();
  const { data: product, isLoading, isError } = useProduct(rec.id);
  const { addItem, items } = useCartStore();

  if (isLoading) {
    return (
      <div className="animate-pulse rounded-2xl border border-surface-border bg-surface-card p-5">
        <div className="flex gap-4">
          <div className="h-16 w-16 flex-shrink-0 rounded-xl bg-surface-elevated" />
          <div className="flex-1 space-y-2.5 pt-1">
            <div className="h-3.5 w-3/4 rounded-lg bg-surface-elevated" />
            <div className="h-3 w-1/2 rounded-lg bg-surface-elevated" />
            <div className="h-3 w-full rounded-lg bg-surface-elevated" />
          </div>
        </div>
      </div>
    );
  }

  // If product fetch failed (404, etc.) skip silently
  if (isError || !product) return null;

  const inCart = items.some((i) => i.product.id === product.id);
  const outOfStock = product.count === 0;

  const handleAdd = () => {
    if (!outOfStock && !inCart) addItem(product);
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-surface-border bg-surface-card p-5 transition hover:border-primary/30 hover:shadow-neon-sm">
      {/* AI badge */}
      <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5">
        <svg className="h-3 w-3 text-primary" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a1 1 0 01.894.553l2.447 4.958 5.47.795a1 1 0 01.555 1.705l-3.958 3.857.935 5.446a1 1 0 01-1.451 1.054L12 17.772l-4.892 2.596a1 1 0 01-1.451-1.054l.935-5.446L2.634 10.01a1 1 0 01.555-1.705l5.47-.795L11.106 2.553A1 1 0 0112 2z" />
        </svg>
        <span className="text-[10px] font-semibold text-primary">AI</span>
      </div>

      <div className="flex gap-4">
        {/* Product image */}
        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-surface-border bg-surface-elevated">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <svg className="h-7 w-7 text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1 pr-10">
          <p className="truncate font-semibold text-ink">{product.name}</p>

          {/* Hashtag */}
          <span className="mt-0.5 inline-block rounded-full border border-primary/25 bg-primary/8 px-2 py-0.5 text-[10px] font-medium text-primary">
            {rec.hashtag}
          </span>

          {/* Reason */}
          <p className="mt-1.5 line-clamp-2 text-xs text-sub leading-relaxed">{rec.reason}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-lg font-extrabold text-primary">{product.basePrice.toLocaleString()} ₸</p>
          <p className="text-[11px] text-faint">{product.category.name}</p>
        </div>

        <button
          onClick={handleAdd}
          disabled={outOfStock || inCart}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition
            ${inCart
              ? 'border border-primary/30 bg-primary/8 text-primary cursor-default'
              : outOfStock
                ? 'border border-surface-border bg-surface-elevated text-faint cursor-not-allowed opacity-60'
                : 'border border-primary bg-primary text-white hover:bg-primary/90 active:scale-95'
            }`}
        >
          {inCart ? (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              {t('recommendations.inCart')}
            </>
          ) : outOfStock ? (
            t('recommendations.outOfStock')
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {t('recommendations.addToCart')}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Section ─────────────────────────────────────────────────────────────────

export function AIRecommendations() {
  const { t } = useTranslation();
  const { data: recommendations, isLoading, isError } = useRecommendations();

  // Don't render the section header at all while loading if there's nothing to show
  const hasRecs = recommendations && recommendations.length > 0;

  return (
    <div className="space-y-4">
      {/* Section header */}
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
          <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a1 1 0 01.894.553l2.447 4.958 5.47.795a1 1 0 01.555 1.705l-3.958 3.857.935 5.446a1 1 0 01-1.451 1.054L12 17.772l-4.892 2.596a1 1 0 01-1.451-1.054l.935-5.446L2.634 10.01a1 1 0 01.555-1.705l5.47-.795L11.106 2.553A1 1 0 0112 2z" />
          </svg>
        </div>
        <div>
          <h2 className="text-base font-bold text-ink">{t('recommendations.title')}</h2>
          <p className="text-xs text-faint">{t('recommendations.subtitle')}</p>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-surface-border bg-surface-card p-5">
              <div className="flex gap-4">
                <div className="h-16 w-16 flex-shrink-0 rounded-xl bg-surface-elevated" />
                <div className="flex-1 space-y-2.5 pt-1">
                  <div className="h-3.5 w-3/4 rounded-lg bg-surface-elevated" />
                  <div className="h-3 w-1/2 rounded-lg bg-surface-elevated" />
                  <div className="h-3 w-full rounded-lg bg-surface-elevated" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="h-6 w-24 rounded-lg bg-surface-elevated" />
                <div className="h-9 w-32 rounded-xl bg-surface-elevated" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <p className="rounded-xl border border-surface-border bg-surface-card px-4 py-3 text-sm text-faint">
          {t('recommendations.errorHint')}
        </p>
      ) : !hasRecs ? (
        <p className="rounded-xl border border-surface-border bg-surface-card px-4 py-3 text-sm text-faint">
          {t('recommendations.empty')}
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {recommendations.map((rec) => (
            <RecommendationCard key={rec.id} rec={rec} />
          ))}
        </div>
      )}
    </div>
  );
}
