import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecommendationsTiktok, useRecommendationsOsm } from '@/hooks/useRecommendations';
import { useProduct } from '@/hooks/useProducts';
import { useCartStore } from '@/store/cartStore';
import type { Recommendation } from '@/types/api';

// ─── Single recommendation card ───────────────────────────────────────────────

function RecommendationCard({ rec, sourceBadge }: { rec: Recommendation; sourceBadge?: React.ReactNode }) {
  const { t } = useTranslation();
  const { data: product, isLoading, isError } = useProduct(rec.id);
  const { addItem, items } = useCartStore();
  const [expanded, setExpanded] = useState(false);

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

  if (isError || !product) return null;

  const inCart = items.some((i) => i.product.id === product.id);
  const outOfStock = product.count === 0;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-surface-border bg-surface-card p-5 transition hover:border-primary/30 hover:shadow-neon-sm">
      {/* Source badge (AI / TikTok / OSM) */}
      {sourceBadge && (
        <div className="absolute right-3 top-3">{sourceBadge}</div>
      )}

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
          <span className="mt-0.5 inline-block rounded-full border border-primary/25 bg-primary/8 px-2 py-0.5 text-[10px] font-medium text-primary">
            {rec.hashtag}
          </span>
          <p className={`mt-1.5 text-xs leading-relaxed text-sub ${expanded ? '' : 'line-clamp-2'}`}>
            {rec.reason}
          </p>
          {rec.reason.length > 80 && (
            <button
              onClick={() => setExpanded((p) => !p)}
              className="mt-0.5 text-[10px] font-medium text-primary hover:underline"
            >
              {expanded ? t('common.less') : t('common.more')}
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-lg font-extrabold text-primary">{product.basePrice.toLocaleString()} ₸</p>
          <p className="text-[11px] text-faint">{product.category.name}</p>
        </div>

        <button
          onClick={() => { if (!outOfStock && !inCart) addItem(product); }}
          disabled={outOfStock || inCart}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition
            ${inCart
              ? 'cursor-default border border-primary/30 bg-primary/8 text-primary'
              : outOfStock
                ? 'cursor-not-allowed border border-surface-border bg-surface-elevated text-faint opacity-60'
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

// ─── Card skeleton ────────────────────────────────────────────────────────────

function CardSkeleton() {
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
      <div className="mt-4 flex items-center justify-between">
        <div className="h-6 w-24 rounded-lg bg-surface-elevated" />
        <div className="h-9 w-32 rounded-xl bg-surface-elevated" />
      </div>
    </div>
  );
}

// ─── Rec grid (shared) ────────────────────────────────────────────────────────

function RecGrid({
  recs,
  isLoading,
  isError,
  sourceBadge,
}: {
  recs: Recommendation[] | undefined;
  isLoading: boolean;
  isError: boolean;
  sourceBadge?: React.ReactNode;
}) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    );
  }
  if (isError) {
    return (
      <p className="rounded-xl border border-surface-border bg-surface-card px-4 py-3 text-sm text-faint">
        {t('recommendations.errorHint')}
      </p>
    );
  }
  if (!recs?.length) {
    return (
      <p className="rounded-xl border border-surface-border bg-surface-card px-4 py-3 text-sm text-faint">
        {t('recommendations.empty')}
      </p>
    );
  }
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {recs.map((rec) => (
        <RecommendationCard key={rec.id} rec={rec} sourceBadge={sourceBadge} />
      ))}
    </div>
  );
}

// ─── Source badge variants ────────────────────────────────────────────────────

const TiktokBadge = () => (
  <div className="flex items-center gap-1 rounded-full bg-[#010101]/8 px-2 py-0.5">
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/>
    </svg>
    <span className="text-[10px] font-semibold text-[#010101]">TikTok</span>
  </div>
);

const OsmBadge = () => (
  <div className="flex items-center gap-1 rounded-full bg-sky-500/10 px-2 py-0.5">
    <svg className="h-3 w-3 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
    <span className="text-[10px] font-semibold text-sky-700">OSM</span>
  </div>
);

// ─── Tab types ────────────────────────────────────────────────────────────────

type Tab = 'tiktok' | 'osm';

// ─── Main section ─────────────────────────────────────────────────────────────

export function AIRecommendations() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>('tiktok');

  const tiktok = useRecommendationsTiktok();
  const osm = useRecommendationsOsm();

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'tiktok',
      label: t('recommendations.tabTiktok'),
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/>
        </svg>
      ),
    },
    {
      id: 'osm',
      label: t('recommendations.tabOsm'),
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6-10l6-3m0 13l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 10m0 10V10" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Section header */}
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-primary/20 bg-gradient-to-br from-primary/20 to-primary/5">
          <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a1 1 0 01.894.553l2.447 4.958 5.47.795a1 1 0 01.555 1.705l-3.958 3.857.935 5.446a1 1 0 01-1.451 1.054L12 17.772l-4.892 2.596a1 1 0 01-1.451-1.054l.935-5.446L2.634 10.01a1 1 0 01.555-1.705l5.47-.795L11.106 2.553A1 1 0 0112 2z" />
          </svg>
        </div>
        <div>
          <h2 className="text-base font-bold text-ink">{t('recommendations.title')}</h2>
          <p className="text-xs text-faint">{t('recommendations.subtitle')}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-surface-border bg-surface-elevated p-1">
        {tabs.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition
              ${tab === id
                ? 'bg-white text-ink shadow-sm'
                : 'text-faint hover:text-sub'
              }`}
          >
            {icon}
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'tiktok' && (
        <RecGrid
          recs={tiktok.data}
          isLoading={tiktok.isLoading}
          isError={tiktok.isError}
          sourceBadge={<TiktokBadge />}
        />
      )}

      {tab === 'osm' && (
        <RecGrid
          recs={osm.data}
          isLoading={osm.isLoading}
          isError={osm.isError}
          sourceBadge={<OsmBadge />}
        />
      )}
    </div>
  );
}
