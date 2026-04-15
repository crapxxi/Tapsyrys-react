import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { useMyOrganization } from '@/hooks/useOrganization';
import { useShopOrders, useSupplierOrders } from '@/hooks/useOrders';
import { useProductsByOrganization } from '@/hooks/useProducts';
import { orderStatusBadge } from '@/components/ui/Badge';
import { SkeletonRow } from '@/components/ui/Skeleton';

import type { OrderResponse } from '@/types/api';

function RecentOrdersCard({
  title, to, orders, loading, nameCol,
}: {
  title: string;
  to: string;
  orders: OrderResponse[];
  loading: boolean;
  nameCol: 'supplier' | 'shop';
}) {
  const { t } = useTranslation();
  return (
    <div className="rounded-2xl border border-surface-border bg-surface-card p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-ink">{title}</h2>
        <Link to={to} className="text-sm font-medium text-primary hover:text-primary-dark">
          {t('dashboard.viewAll')}
        </Link>
      </div>
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)}
        </div>
      ) : orders.length === 0 ? (
        <p className="text-sm text-sub">{t('dashboard.noOrders')}</p>
      ) : (
        <div className="space-y-2">
          {orders.map((o) => (
            <div key={o.id} className="flex items-center justify-between rounded-xl bg-surface-elevated px-4 py-3">
              <div>
                <p className="text-sm font-medium text-ink">
                  #{o.id} · {nameCol === 'supplier' ? o.supplierName : o.shopName}
                </p>
                <p className="text-xs text-faint">
                  {new Date(o.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-primary">
                  {o.totalAmount.toLocaleString()} ₸
                </span>
                {orderStatusBadge(o.status)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon, label, value, to, color, borderColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  to: string;
  color: string;
  borderColor?: string;
}) {
  return (
    <Link
      to={to}
      className={`group relative overflow-hidden flex items-center gap-4 rounded-2xl border bg-white p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover ${borderColor ?? 'border-surface-border hover:border-primary/40'}`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gradient-to-br from-primary/[0.04] to-transparent" />
      <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="stat-number text-2xl font-extrabold text-ink">{value}</p>
        <p className="text-sm text-faint">{label}</p>
      </div>
    </Link>
  );
}

export function DashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: org } = useMyOrganization();
  const orgType = org?.type;
  const { data: shopOrders, isLoading: shopLoading } = useShopOrders();
  const { data: supplierOrders, isLoading: supplierLoading } = useSupplierOrders();
  const { data: products } = useProductsByOrganization(org?.id ?? 0);

  const recentShop = shopOrders?.slice(0, 5) ?? [];
  const recentSupplier = supplierOrders?.slice(0, 5) ?? [];

  const isSupplier = orgType === 'SUPPLIER';
  const isShop = orgType === 'SHOP';

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-3xl border border-surface-border bg-surface-card p-8">
        {/* Background gradient */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/6 via-transparent to-teal-400/4" />
        <div className="pointer-events-none absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/8 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/4 h-40 w-40 rounded-full bg-teal-400/6 blur-3xl" />

        <div className="relative">
          <p className="text-sm font-semibold text-primary tracking-wide uppercase">{t('dashboard.welcome')}</p>
          <h1 className="mt-1 text-2xl font-extrabold text-ink sm:text-3xl">{user?.email}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-xs font-semibold text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {user?.role}
            </span>
            {org && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-surface-border bg-surface-elevated px-3 py-1 text-xs font-semibold text-sub">
                <span className={`h-1.5 w-1.5 rounded-full ${orgType === 'SUPPLIER' ? 'bg-teal-400' : 'bg-emerald-400'}`} />
                {org.name}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isSupplier && (
          <StatCard
            to="/my-products"
            icon={<svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
            label={t('dashboard.myProducts')}
            value={products?.length ?? 0}
            color="bg-primary/10"
          />
        )}
        {isShop && (
          <StatCard
            to="/orders/shop"
            icon={<svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4" /></svg>}
            label={t('dashboard.shopOrders')}
            value={shopOrders?.length ?? 0}
            color="bg-emerald-500/10"
          />
        )}
        {isSupplier && (
          <StatCard
            to="/orders/supplier"
            icon={<svg className="h-6 w-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
            label={t('dashboard.supplierOrders')}
            value={supplierOrders?.length ?? 0}
            color="bg-teal-500/10"
          />
        )}
      </div>

      {/* Recent orders */}
      {(isShop || isSupplier) && (
        <div className="grid gap-6 lg:grid-cols-2">
          {isShop && (
            <RecentOrdersCard
              title={t('dashboard.recentShop')}
              to="/orders/shop"
              orders={recentShop}
              loading={shopLoading}
              nameCol="supplier"
            />
          )}
          {isSupplier && (
            <RecentOrdersCard
              title={t('dashboard.recentSupplier')}
              to="/orders/supplier"
              orders={recentSupplier}
              loading={supplierLoading}
              nameCol="shop"
            />
          )}
        </div>
      )}
    </div>
  );
}
