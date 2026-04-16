import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useCartStore } from '@/store/cartStore';
import { useCreateOrder } from '@/hooks/useOrders';
import { useOrganizationById } from '@/hooks/useOrganization';
import type { CartItem } from '@/store/cartStore';
import { Button } from '@/components/ui/Button';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { AIRecommendations } from '@/components/ui/AIRecommendations';

// ─── Supplier group ───────────────────────────────────────────────────────────

interface SupplierGroupProps {
  supplierId: number;
  items: CartItem[];
  onDecrement: (id: number) => void;
  onIncrement: (item: CartItem) => void;
  onRemove: (id: number) => void;
  onPlaceOrder: (supplierId: number, items: CartItem[]) => void;
  isLoading: boolean;
}

function SupplierGroup({
  supplierId, items, onDecrement, onIncrement, onRemove, onPlaceOrder, isLoading,
}: SupplierGroupProps) {
  const { t } = useTranslation();
  const { data: supplier } = useOrganizationById(supplierId);
  const supplierName = supplier?.name ?? `Supplier #${supplierId}`;
  const subtotal = items.reduce((sum, i) => sum + i.product.basePrice * i.count, 0);

  return (
    <div className="overflow-hidden rounded-2xl border border-surface-border bg-surface-card shadow-card">
      {/* Supplier header */}
      <div className="flex items-center gap-3 border-b border-surface-border bg-surface-elevated px-6 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15">
          <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
          </svg>
        </div>
        <p className="font-semibold text-ink">{supplierName}</p>
        <span className="ml-auto rounded-full border border-surface-border bg-surface-card px-2.5 py-0.5 text-xs text-faint">
          {items.length} {t('cart.items')}
        </span>
      </div>

      {/* Items */}
      <div className="divide-y divide-surface-border">
        {items.map((item) => (
          <div key={item.product.id} className="flex items-center gap-4 px-6 py-4">
            {/* Image */}
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-surface-border bg-surface-elevated">
              {item.product.imageUrl ? (
                <img src={item.product.imageUrl} alt={item.product.name}
                  className="h-full w-full object-cover" />
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
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-ink">{item.product.name}</p>
              <p className="mt-0.5 text-xs text-faint">
                {t('products.sku')}: {item.product.sku}
                <span className="mx-2 text-faint">·</span>
                <span className="rounded-full border border-primary/25 bg-primary/8 px-2 py-0.5 text-primary">
                  {item.product.category.name}
                </span>
              </p>
              {item.product.description && (
                <p className="mt-1 line-clamp-1 text-xs text-sub">{item.product.description}</p>
              )}
            </div>

            {/* Unit price */}
            <p className="hidden w-28 text-right text-sm text-faint sm:block">
              {item.product.basePrice.toLocaleString()} ₸
            </p>

            {/* Qty controls */}
            <div className="flex items-center gap-1 rounded-xl border border-surface-border bg-surface-elevated p-1">
              <button
                onClick={() => onDecrement(item.product.id)}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-faint transition hover:bg-surface-card hover:text-ink"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                </svg>
              </button>
              <span className="w-8 text-center text-sm font-bold text-ink">{item.count}</span>
              <button
                onClick={() => onIncrement(item)}
                disabled={item.count >= item.product.count}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-faint transition hover:bg-primary/15 hover:text-primary disabled:opacity-30"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>

            {/* Line total */}
            <p className="w-28 text-right text-sm font-bold text-primary">
              {(item.product.basePrice * item.count).toLocaleString()} ₸
            </p>

            {/* Remove */}
            <button
              onClick={() => onRemove(item.product.id)}
              className="rounded-lg p-1.5 text-sub transition hover:bg-red-500/10 hover:text-red-600"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Subtotal + order */}
      <div className="flex items-center justify-between border-t border-surface-border bg-surface-elevated/40 px-6 py-4">
        <div>
          <p className="text-xs text-faint">{t('products.total')}</p>
          <p className="text-2xl font-extrabold text-primary">{subtotal.toLocaleString()} ₸</p>
        </div>
        <Button
          loading={isLoading}
          onClick={() => onPlaceOrder(supplierId, items)}
          className="min-w-[160px]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M5 13l4 4L19 7" />
          </svg>
          {t('products.placeOrder')}
        </Button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function CartPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items, addItem, decrementItem, removeItem, clearCart, totalAmount } = useCartStore();
  const { createOrder, isLoading, error } = useCreateOrder();

  // Group cart items by organizationId (= supplierId)
  const groups = items.reduce<Record<number, CartItem[]>>((acc, item) => {
    const key = item.product.organizationId;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const placeOrder = (supplierId: number, groupItems: CartItem[]) => {
    createOrder(
      {
        supplierId,
        orderItems: groupItems.map((i) => ({ productId: i.product.id, count: i.count })),
      },
      {
        onSuccess: () => {
          groupItems.forEach((i) => removeItem(i.product.id));
          toast.success(t('products.orderSuccess'));
          // If cart is now empty, redirect to shop orders
          const remaining = items.length - groupItems.length;
          if (remaining === 0) navigate('/orders/shop');
        },
      },
    );
  };

  if (items.length === 0) {
    return (
      <div className="space-y-10">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-surface-border bg-surface-card py-20">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-surface-elevated">
            <svg className="h-10 w-10 text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="mt-4 text-lg font-semibold text-ink">{t('cart.emptyTitle')}</p>
          <p className="mt-1 text-sm text-faint">{t('cart.emptySubtitle')}</p>
          <Button className="mt-6" onClick={() => navigate('/products')}>
            {t('cart.browseCatalog')}
          </Button>
        </div>

        <AIRecommendations />
      </div>
    );
  }

  const groupEntries = Object.entries(groups) as [string, CartItem[]][];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">{t('products.cart')}</h1>
          <p className="text-sm text-faint">
            {items.reduce((s, i) => s + i.count, 0)} {t('cart.itemsTotal')}
            {groupEntries.length > 1 && ` · ${groupEntries.length} ${t('cart.suppliers')}`}
          </p>
        </div>
        <button
          onClick={clearCart}
          className="rounded-xl border border-surface-border px-4 py-2 text-sm text-faint transition hover:border-red-500/30 hover:text-red-600"
        >
          {t('cart.clearAll')}
        </button>
      </div>

      {/* Supplier groups */}
      {groupEntries.map(([supplierId, groupItems]) => (
        <SupplierGroup
          key={supplierId}
          supplierId={Number(supplierId)}
          items={groupItems}
          onDecrement={decrementItem}
          onIncrement={(item) => addItem(item.product)}
          onRemove={removeItem}
          onPlaceOrder={placeOrder}
          isLoading={isLoading}
        />
      ))}

      {/* Grand total (only when multiple suppliers) */}
      {groupEntries.length > 1 && (
        <div className="flex items-center justify-between rounded-2xl border border-primary/20 bg-surface-card px-6 py-5">
          <div>
            <p className="text-sm text-faint">{t('cart.grandTotal')}</p>
            <p className="text-3xl font-extrabold text-primary">{totalAmount().toLocaleString()} ₸</p>
          </div>
          <p className="text-xs text-faint">{groupEntries.length} {t('cart.orders')}</p>
        </div>
      )}

      {error && <ErrorAlert message={error.message} />}

      {/* AI Recommendations */}
      <div className="pt-4 border-t border-surface-border">
        <AIRecommendations />
      </div>
    </div>
  );
}
