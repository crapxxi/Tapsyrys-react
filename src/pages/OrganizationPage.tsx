import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useMyOrganization, useAddUserToOrg } from '@/hooks/useOrganization';
import { useProductsByOrganization } from '@/hooks/useProducts';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { SkeletonStatCard } from '@/components/ui/Skeleton';

function InfoRow({ label, value }: { label: string; value: string | number | boolean }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-xl bg-surface-elevated px-4 py-3">
      <span className="text-xs text-faint">{label}</span>
      <span className="text-sm font-medium text-ink">{String(value)}</span>
    </div>
  );
}

// ─── Admin view ──────────────────────────────────────────────────────────────
function AdminOrgView() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-ink">{t('organization.adminTitle')}</h1>
        <p className="text-sm text-faint">{t('organization.adminSubtitle')}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          to="/organization/create"
          className="flex flex-col gap-3 rounded-2xl border border-surface-border bg-surface-card p-6 shadow-card transition hover:border-primary/40 hover:shadow-neon-sm"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-ink">{t('organization.create')}</p>
            <p className="mt-0.5 text-sm text-faint">{t('organization.createSubtitle')}</p>
          </div>
        </Link>
        <Link
          to="/admin/assign-user"
          className="flex flex-col gap-3 rounded-2xl border border-surface-border bg-surface-card p-6 shadow-card transition hover:border-emerald-500/40 hover:shadow-neon-sm"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
            <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-ink">{t('assignUser.title')}</p>
            <p className="mt-0.5 text-sm text-faint">{t('assignUser.subtitle')}</p>
          </div>
        </Link>
        <Link
          to="/admin/organizations"
          className="flex flex-col gap-3 rounded-2xl border border-surface-border bg-surface-card p-6 shadow-card transition hover:border-teal-500/40 hover:shadow-neon-sm"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10">
            <svg className="h-6 w-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-ink">{t('allOrgs.title')}</p>
            <p className="mt-0.5 text-sm text-faint">{t('allOrgs.subtitle')}</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

// ─── Shop / Supplier view ─────────────────────────────────────────────────────
function MemberOrgView() {
  const { t } = useTranslation();
  const { data: org, isLoading, isError } = useMyOrganization();
  const { data: products } = useProductsByOrganization(org?.id ?? 0);
  const { addUser, isLoading: addingUser, isError: addUserErr, error: addUserError } = useAddUserToOrg();
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [addUserOpen, setAddUserOpen] = useState(false);
  const [phone, setPhone] = useState('');

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!org) return;
    addUser(
      { organizationId: org.id, phone },
      {
        onSuccess: () => {
          setAddUserOpen(false);
          setPhone('');
          toast.success(t('organization.addUserSuccess'));
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-48 w-full animate-pulse rounded-3xl bg-surface-elevated" />
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="col-span-2 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonStatCard key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !org) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-surface-border bg-surface-card py-24">
        <svg className="h-16 w-16 text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <p className="mt-4 text-faint">{t('organization.notFound')}</p>
        <p className="text-sm text-sub">{t('organization.notFoundHint')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div className="relative overflow-hidden rounded-3xl bg-surface-card p-8 neon-border">
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-primary/10 blur-2xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10 neon-border">
            {org.logoUrl ? (
              <img src={org.logoUrl} alt={org.name} className="h-16 w-16 rounded-xl object-contain" />
            ) : (
              <svg className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm text-primary">{org.type} · {org.category}</p>
            <h1 className="text-3xl font-extrabold text-ink">{org.name}</h1>
            <p className="mt-1 text-sm text-faint">{org.city}, {org.address}</p>
          </div>
          <span className={`rounded-full border px-3 py-1 text-sm font-semibold ${
            org.hasProduct
              ? 'border-primary/40 bg-primary/10 text-primary'
              : 'border-surface-border bg-surface-elevated text-faint'
          }`}>
            {org.hasProduct ? t('organization.fields.hasProduct') : '—'}
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Details */}
        <div className="col-span-2 rounded-2xl border border-surface-border bg-surface-card p-6">
          <h2 className="mb-4 font-semibold text-ink">{t('organization.info')}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <InfoRow label={t('organization.fields.bin')} value={org.bin} />
            <InfoRow label={t('organization.fields.type')} value={org.type} />
            <InfoRow label={t('organization.fields.category')} value={org.category} />
            <InfoRow label={t('organization.fields.city')} value={org.city} />
            <InfoRow label={t('organization.fields.address')} value={org.address} />
            <InfoRow label={t('organization.fields.orgId')} value={org.id} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {org.type === 'SUPPLIER' && (
            <div className="rounded-2xl border border-surface-border bg-surface-card p-5">
              <p className="text-xs text-faint mb-1">{t('organization.productsCount')}</p>
              <p className="text-3xl font-extrabold text-primary">{products?.length ?? 0}</p>
              <Link to="/my-products" className="mt-2 block text-xs font-medium text-primary hover:text-primary-dark">
                {t('organization.manageProducts')}
              </Link>
            </div>
          )}

          {isAdmin && (
            <div className="rounded-2xl border border-surface-border bg-surface-card p-5">
              <h3 className="mb-3 text-sm font-semibold text-sub">{t('organization.management')}</h3>
              <Button className="w-full" size="sm" onClick={() => setAddUserOpen(true)}>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                {t('organization.addUser')}
              </Button>
            </div>
          )}
        </div>
      </div>

      {isAdmin && (
        <Modal open={addUserOpen} onClose={() => setAddUserOpen(false)} title={t('organization.addUser')}>
          <form onSubmit={handleAddUser} className="space-y-4">
            <Input
              label={t('organization.addUserId')}
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+7 777 123 45 67"
              required
            />
            {addUserErr && <ErrorAlert message={addUserError?.message} />}
            <Button type="submit" loading={addingUser} className="w-full">{t('common.add')}</Button>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ─── Root component ───────────────────────────────────────────────────────────
export function OrganizationPage() {
  const { user } = useAuth();

  if (user?.role === 'ADMIN') return <AdminOrgView />;
  return <MemberOrgView />;
}
