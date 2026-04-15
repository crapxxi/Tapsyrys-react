import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useShopOrders, useCancelOrder } from '@/hooks/useOrders';
import type { OrderResponse } from '@/types/api';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { orderStatusBadge } from '@/components/ui/Badge';
import { SkeletonRow } from '@/components/ui/Skeleton';

function OrderDetailModal({ order, onClose }: { order: OrderResponse; onClose: () => void }) {
  const { t } = useTranslation();
  const { cancelOrder, isLoading } = useCancelOrder();

  return (
    <Modal open onClose={onClose} title={t('orders.orderDetails', { id: order.id })} maxWidth="max-w-xl">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: t('orders.table.supplier'), value: order.supplierName },
            { label: t('orders.table.date'), value: new Date(order.createdAt).toLocaleDateString() },
            { label: t('orders.table.amount'), value: `${order.totalAmount.toLocaleString()} ₸`, green: true },
            { label: t('orders.table.status'), badge: true, status: order.status },
          ].map((row, i) => (
            <div key={i} className="rounded-xl bg-surface-elevated px-4 py-3">
              <p className="text-xs text-faint">{row.label}</p>
              {row.badge ? (
                <div className="mt-1">{orderStatusBadge(row.status ?? '')}</div>
              ) : (
                <p className={`mt-0.5 text-sm font-semibold ${row.green ? 'text-primary' : 'text-ink'}`}>
                  {row.value}
                </p>
              )}
            </div>
          ))}
        </div>

        <div>
          <h4 className="mb-2 text-sm font-semibold text-sub">{t('orders.orderItems')}</h4>
          <div className="divide-y divide-surface-border rounded-xl border border-surface-border">
            {order.orderItems.map((item, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-ink">{item.productName}</p>
                  <p className="text-xs text-faint">{item.price.toLocaleString()} ₸ × {item.count}</p>
                </div>
                <p className="font-bold text-primary">{(item.price * item.count).toLocaleString()} ₸</p>
              </div>
            ))}
          </div>
        </div>

        {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
          <Button
            variant="danger"
            loading={isLoading}
            onClick={() => cancelOrder(order.id, {
              onSuccess: () => { toast.success(t('orders.cancelSuccess')); onClose(); },
            })}
            className="w-full"
          >
            {t('orders.cancel')}
          </Button>
        )}
      </div>
    </Modal>
  );
}

export function ShopOrdersPage() {
  const { t } = useTranslation();
  const { data: orders, isLoading } = useShopOrders();
  const [selected, setSelected] = useState<OrderResponse | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-ink">{t('orders.shopTitle')}</h1>
        <p className="text-sm text-faint">{t('orders.shopSubtitle')}</p>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-surface-border bg-surface-card overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}
        </div>
      ) : !orders?.length ? (
        <div className="flex flex-col items-center rounded-2xl border border-surface-border bg-surface-card py-20">
          <svg className="h-16 w-16 text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="mt-4 text-faint">{t('orders.noOrders')}</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-surface-border bg-surface-card">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-surface-border bg-surface-elevated">
                  {[t('orders.table.id'), t('orders.table.supplier'), t('orders.table.date'), t('orders.table.amount'), t('orders.table.status'), ''].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-sub">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {orders.map((o) => (
                  <tr key={o.id} className="transition hover:bg-surface-elevated/40">
                    <td className="px-5 py-4 text-sm font-bold text-primary">#{o.id}</td>
                    <td className="px-5 py-4 text-sm text-sub">{o.supplierName}</td>
                    <td className="px-5 py-4 text-sm text-faint">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-4 text-sm font-bold text-primary">{o.totalAmount.toLocaleString()} ₸</td>
                    <td className="px-5 py-4">{orderStatusBadge(o.status)}</td>
                    <td className="px-5 py-4">
                      <Button variant="ghost" size="sm" onClick={() => setSelected(o)}>{t('orders.details')}</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selected && <OrderDetailModal order={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
