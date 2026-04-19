import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useSupplierOrders, useUpdateOrderStatus, useCancelOrder } from '@/hooks/useOrders';
import type { OrderResponse, OrderStatus } from '@/types/api';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { orderStatusBadge } from '@/components/ui/Badge';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { SkeletonRow } from '@/components/ui/Skeleton';

// ─── Queue config ─────────────────────────────────────────────────────────────

const STATUS_ORDER: OrderStatus[] = ['PENDING', 'CONFIRMED', 'SHIPPING', 'DELIVERED', 'CANCELLED'];

const STATUS_CONFIG: Record<OrderStatus, { accent: string; dot: string; textColor: string }> = {
  PENDING:   { accent: 'border-l-amber-400',  dot: 'bg-amber-400',  textColor: 'text-amber-700'    },
  CONFIRMED: { accent: 'border-l-sky-400',    dot: 'bg-sky-400',    textColor: 'text-sky-700'      },
  SHIPPING:  { accent: 'border-l-violet-400', dot: 'bg-violet-400', textColor: 'text-violet-700'   },
  DELIVERED: { accent: 'border-l-primary',    dot: 'bg-primary',    textColor: 'text-primary-dark'  },
  CANCELLED: { accent: 'border-l-red-400',    dot: 'bg-red-400',    textColor: 'text-red-600'      },
};

const ADVANCE_TO: Partial<Record<OrderStatus, OrderStatus>> = {
  PENDING:   'CONFIRMED',
  CONFIRMED: 'SHIPPING',
  SHIPPING:  'DELIVERED',
};

const CANCELLABLE: Set<OrderStatus> = new Set(['PENDING', 'CONFIRMED']);

// ─── Order detail modal (items view) ─────────────────────────────────────────

function ItemsModal({ order, onClose }: { order: OrderResponse; onClose: () => void }) {
  const { t } = useTranslation();

  return (
    <Modal open onClose={onClose} title={t('orders.orderDetails', { id: order.id })} maxWidth="max-w-lg">
      <div className="space-y-4">
        {order.shopAddress && (
          <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
            <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div>
              <p className="text-xs font-medium text-primary">{t('orders.deliveryAddress')}</p>
              <p className="mt-0.5 text-sm font-semibold text-ink">{order.shopAddress}</p>
            </div>
          </div>
        )}

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

        <div className="flex items-center justify-between rounded-xl bg-surface-elevated px-4 py-3">
          <span className="text-sm text-faint">{t('orders.table.amount')}</span>
          <span className="text-base font-extrabold text-primary">{order.totalAmount.toLocaleString()} ₸</span>
        </div>
      </div>
    </Modal>
  );
}

// ─── Order card ───────────────────────────────────────────────────────────────

interface OrderCardProps {
  order: OrderResponse;
  processingId: number | null;
  onAdvance: (id: number) => void;
  onCancel: (id: number) => void;
  onViewItems: (o: OrderResponse) => void;
}

function OrderCard({ order, processingId, onAdvance, onCancel, onViewItems }: OrderCardProps) {
  const { t } = useTranslation();
  const cfg = STATUS_CONFIG[order.status];
  const nextStatus = ADVANCE_TO[order.status];
  const canAdvance = !!nextStatus;
  const canCancel = CANCELLABLE.has(order.status);
  const isProcessing = processingId === order.id;

  return (
    <div
      className={`rounded-2xl border border-surface-border border-l-4 ${cfg.accent} bg-surface-card p-5 shadow-card transition hover:shadow-card-hover`}
    >
      {/* Header: id + date + status badge */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-sm font-bold text-primary">#{order.id}</span>
          <span className="mx-2 text-faint">·</span>
          <span className="text-xs text-faint">
            {new Date(order.createdAt).toLocaleDateString()}
          </span>
        </div>
        {orderStatusBadge(order.status)}
      </div>

      {/* Shop name */}
      <p className="mt-2.5 font-semibold text-ink">{order.shopName}</p>

      {/* Delivery address */}
      {order.shopAddress && (
        <p className="mt-1 flex items-center gap-1.5 text-xs text-faint">
          <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {order.shopAddress}
        </p>
      )}

      {/* Amount + item count */}
      <div className="mt-3 flex items-center gap-3">
        <span className="text-lg font-extrabold text-primary">
          {order.totalAmount.toLocaleString()} ₸
        </span>
        <button
          onClick={() => onViewItems(order)}
          className="rounded-full border border-surface-border bg-surface-elevated px-2 py-0.5 text-xs text-faint transition hover:border-primary/30 hover:text-primary"
        >
          {order.orderItems.length} {t('orders.items')}
        </button>
      </div>

      {/* Action buttons */}
      {(canAdvance || canCancel) && (
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-surface-border pt-4">
          {canAdvance && nextStatus && (
            <Button
              size="sm"
              loading={isProcessing}
              disabled={processingId !== null}
              onClick={() => onAdvance(order.id)}
              className="flex-1"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              → {t(`status.${nextStatus}`)}
            </Button>
          )}
          {canCancel && (
            <Button
              size="sm"
              variant="danger"
              loading={isProcessing}
              disabled={processingId !== null}
              onClick={() => onCancel(order.id)}
            >
              {t('orders.cancel')}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Status group ─────────────────────────────────────────────────────────────

interface StatusGroupProps {
  status: OrderStatus;
  orders: OrderResponse[];
  defaultCollapsed: boolean;
  processingId: number | null;
  onAdvance: (id: number) => void;
  onCancel: (id: number) => void;
  onViewItems: (o: OrderResponse) => void;
}

function StatusGroup({
  status, orders, defaultCollapsed, processingId, onAdvance, onCancel, onViewItems,
}: StatusGroupProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(!defaultCollapsed);
  const cfg = STATUS_CONFIG[status];

  if (orders.length === 0) return null;

  return (
    <div>
      {/* Group header */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex w-full items-center gap-2.5 py-2 text-left"
      >
        <span className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${cfg.dot}`} />
        <span className={`text-sm font-semibold ${cfg.textColor}`}>
          {t(`status.${status}`)}
        </span>
        <span className="rounded-full border border-surface-border bg-surface-elevated px-2 py-0.5 text-xs font-medium text-faint">
          {orders.length}
        </span>
        <svg
          className={`ml-auto h-4 w-4 flex-shrink-0 text-faint transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="mt-2 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {orders.map((o) => (
            <OrderCard
              key={o.id}
              order={o}
              processingId={processingId}
              onAdvance={onAdvance}
              onCancel={onCancel}
              onViewItems={onViewItems}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function SupplierOrdersPage() {
  const { t } = useTranslation();
  const { data: orders, isLoading } = useSupplierOrders();
  const { updateStatus, isError: advanceErr, error: advanceError } = useUpdateOrderStatus();
  const { cancelOrder, isError: cancelErr, error: cancelError } = useCancelOrder();

  const [processingId, setProcessingId] = useState<number | null>(null);
  const [itemsOrder, setItemsOrder] = useState<OrderResponse | null>(null);

  const grouped = STATUS_ORDER.reduce<Record<OrderStatus, OrderResponse[]>>(
    (acc, s) => { acc[s] = (orders ?? []).filter((o) => o.status === s); return acc; },
    {} as Record<OrderStatus, OrderResponse[]>,
  );

  const totalActive = (orders ?? []).filter(
    (o) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED',
  ).length;

  const handleAdvance = (orderId: number) => {
    setProcessingId(orderId);
    updateStatus(orderId, {
      onSuccess: () => { toast.success(t('orders.statusUpdated')); setProcessingId(null); },
      onError: () => setProcessingId(null),
    });
  };

  const handleCancel = (orderId: number) => {
    setProcessingId(orderId);
    cancelOrder(orderId, {
      onSuccess: () => { toast.success(t('orders.cancelSuccess')); setProcessingId(null); },
      onError: () => setProcessingId(null),
    });
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">{t('orders.supplierTitle')}</h1>
          <p className="text-sm text-faint">{t('orders.supplierSubtitle')}</p>
        </div>
        {totalActive > 0 && (
          <span className="rounded-xl border border-primary/25 bg-primary/8 px-3 py-1 text-sm font-semibold text-primary-dark">
            {totalActive} {t('orders.active')}
          </span>
        )}
      </div>

      {(advanceErr || cancelErr) && (
        <ErrorAlert message={advanceError?.message ?? cancelError?.message} />
      )}

      {isLoading ? (
        <div className="rounded-2xl border border-surface-border bg-surface-card overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
        </div>
      ) : !orders?.length ? (
        <div className="flex flex-col items-center rounded-2xl border border-surface-border bg-surface-card py-20">
          <svg className="h-16 w-16 text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <p className="mt-4 text-faint">{t('orders.noOrders')}</p>
        </div>
      ) : (
        <div className="space-y-5">
          {STATUS_ORDER.map((status) => (
            <StatusGroup
              key={status}
              status={status}
              orders={grouped[status]}
              defaultCollapsed={status === 'DELIVERED' || status === 'CANCELLED'}
              processingId={processingId}
              onAdvance={handleAdvance}
              onCancel={handleCancel}
              onViewItems={setItemsOrder}
            />
          ))}
        </div>
      )}

      {itemsOrder && (
        <ItemsModal order={itemsOrder} onClose={() => setItemsOrder(null)} />
      )}
    </div>
  );
}
