import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCategories } from '@/hooks/useCategories';
import { useProductSearch, useProductsByCategory } from '@/hooks/useProducts';
import { useCartStore } from '@/store/cartStore';
import { useMyOrganization } from '@/hooks/useOrganization';
import type { ProductResponse } from '@/types/api';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { SkeletonCard } from '@/components/ui/Skeleton';

function ProductCard({ product, isSupplier }: { product: ProductResponse; isSupplier: boolean }) {
  const { t } = useTranslation();
  const { addItem, decrementItem, items } = useCartStore();
  const cartItem = items.find((i) => i.product.id === product.id);
  const cartCount = cartItem?.count ?? 0;
  const minOrder = Math.max(product.minOrderCount ?? 1, 1);
  const outOfStock = product.count === 0;
  const atMin = cartCount <= minOrder;

  return (
    <div className="group flex flex-col rounded-2xl border border-surface-border bg-surface-card shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-card-hover">
      {/* Image */}
      <div className="relative overflow-hidden rounded-t-2xl bg-surface-elevated p-6">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name}
            className="mx-auto h-32 w-32 object-contain" />
        ) : (
          <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-xl bg-surface-card">
            <svg className="h-12 w-12 text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        )}
        <span className="absolute right-3 top-3 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          {product.category.name}
        </span>
        {!isSupplier && cartCount > 0 && (
          <span className="absolute left-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-extrabold text-white shadow-neon-sm">
            {cartCount}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-5">
        <h3 className="font-semibold text-ink line-clamp-2">{product.name}</h3>
        <p className="text-xs text-sub">{t('products.sku')}: {product.sku}</p>
        {product.description && (
          <p className="text-xs text-faint line-clamp-2">{product.description}</p>
        )}

        <div className="mt-auto pt-3">
          <div className="flex items-end justify-between gap-2">
            <div>
              <p className="text-lg font-extrabold text-primary">{product.basePrice.toLocaleString()} ₸</p>
              <p className="text-xs text-sub">{t('products.inStock', { count: product.count })}</p>
              {minOrder > 1 && (
                <p className="text-xs text-faint">{t('products.minOrder', { count: minOrder })}</p>
              )}
            </div>

            {!isSupplier && (
              cartCount === 0 ? (
                <Button
                  size="sm"
                  onClick={() => addItem(product)}
                  disabled={outOfStock}
                >
                  {outOfStock ? t('products.outOfStock') : t('products.addToCart')}
                </Button>
              ) : (
                <div className="flex items-center gap-1 rounded-xl border border-surface-border bg-surface-elevated p-1">
                  <button
                    onClick={() => decrementItem(product.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-faint transition hover:bg-surface-card hover:text-ink"
                    title={atMin ? t('common.delete') : undefined}
                  >
                    {atMin ? (
                      <svg className="h-3.5 w-3.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    ) : (
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                      </svg>
                    )}
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-ink">{cartCount}</span>
                  <button
                    onClick={() => addItem(product)}
                    disabled={cartCount >= product.count}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-faint transition hover:bg-primary/15 hover:text-primary disabled:opacity-30"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState(0);

  const { data: categories } = useCategories();
  const { data: org } = useMyOrganization();
  const isSupplier = org?.type === 'SUPPLIER';
  const cartCount = useCartStore((s) => s.totalCount());

  const searchQuery = useProductSearch(search.trim() || '');
  const categoryQuery = useProductsByCategory(categoryId, search || undefined);

  const activeQuery = categoryId > 0 ? categoryQuery : searchQuery;
  const products = activeQuery.data ?? [];
  const isLoading = activeQuery.isLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">{t('products.title')}</h1>
          <p className="text-sm text-faint">{t('products.subtitle')}</p>
        </div>
        {!isSupplier && cartCount > 0 && (
          <button
            onClick={() => navigate('/cart')}
            className="relative flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-light px-5 py-2.5 text-sm font-bold text-white shadow-neon-sm transition hover:shadow-neon"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {t('products.cart')}
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-extrabold text-ink">
              {cartCount}
            </span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-2xl border border-surface-border bg-surface-card p-4 sm:flex-row">
        <input
          type="text"
          placeholder={t('products.searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-xl border border-surface-border bg-white px-4 py-2.5 text-sm text-ink placeholder:text-faint outline-none transition-all duration-150 hover:border-surface-muted focus:border-primary focus:ring-2 focus:ring-primary/15"
        />
        <Select
          value={categoryId}
          onChange={(e) => setCategoryId(Number(e.target.value))}
          className="sm:w-48"
        >
          <option value={0}>{t('products.allCategories')}</option>
          {categories?.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </Select>
        {(search || categoryId > 0) && (
          <button
            onClick={() => { setSearch(''); setCategoryId(0); }}
            className="rounded-xl border border-surface-border bg-surface-elevated px-4 py-2.5 text-sm text-faint transition hover:text-ink"
          >
            {t('common.reset')}
          </button>
        )}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-surface-border bg-surface-card py-20">
          <svg className="h-16 w-16 text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <p className="mt-4 text-faint">{t('products.noProducts')}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => <ProductCard key={p.id} product={p} isSupplier={isSupplier} />)}
        </div>
      )}
    </div>
  );
}
