import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAllOrganizations } from '@/hooks/useOrganization';
import { SkeletonRow } from '@/components/ui/Skeleton';

export function AllOrganizationsPage() {
  const { t } = useTranslation();
  const { data: orgs, isLoading, isError } = useAllOrganizations();
  const [search, setSearch] = useState('');

  const filtered = orgs?.filter((o) =>
    o.name.toLowerCase().includes(search.toLowerCase()) ||
    o.city.toLowerCase().includes(search.toLowerCase()) ||
    o.type.toLowerCase().includes(search.toLowerCase()),
  ) ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold text-ink">{t('allOrgs.title')}</h1>
        <p className="text-sm text-faint">{t('allOrgs.subtitle')}</p>
      </div>

      {/* Search */}
      <div className="relative">
        <svg className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-faint"
          fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('allOrgs.searchPlaceholder')}
          className="w-full rounded-xl border border-surface-border bg-surface-elevated py-2.5 pl-10 pr-4 text-sm text-sub placeholder:text-sub outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="overflow-hidden rounded-2xl border border-surface-border bg-surface-card">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-surface-border bg-surface-card py-16 text-center">
          <p className="text-sm text-red-600">{t('errors.generic')}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-surface-border bg-surface-card py-16 text-center">
          <p className="text-sm text-faint">{t('allOrgs.noResults')}</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-surface-border bg-surface-card">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-surface-border bg-surface-elevated">
                  {[
                    t('allOrgs.table.logo'),
                    t('allOrgs.table.name'),
                    t('allOrgs.table.type'),
                    t('allOrgs.table.city'),
                    t('allOrgs.table.bin'),
                    t('allOrgs.table.category'),
                    t('allOrgs.table.hasProduct'),
                  ].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-sub">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {filtered.map((org) => (
                  <tr key={org.id} className="transition hover:bg-surface-elevated/40">
                    <td className="px-5 py-4">
                      {org.logoUrl ? (
                        <img src={org.logoUrl} alt={org.name} className="h-10 w-10 rounded-xl object-contain" />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-elevated">
                          <svg className="h-5 w-5 text-sub" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
                          </svg>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-ink">{org.name}</p>
                      <p className="text-xs text-faint">{org.address}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                        {org.type}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-faint">{org.city}</td>
                    <td className="px-5 py-4 text-sm font-mono text-faint">{org.bin}</td>
                    <td className="px-5 py-4 text-sm text-faint">{org.category}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        org.hasProduct
                          ? 'bg-primary/10 text-primary'
                          : 'bg-surface-elevated text-faint'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${org.hasProduct ? 'bg-primary' : 'bg-gray-600'}`} />
                        {org.hasProduct ? t('common.yes') : t('common.no')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-surface-border px-5 py-3">
            <p className="text-xs text-sub">
              {t('allOrgs.total', { count: filtered.length })}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
