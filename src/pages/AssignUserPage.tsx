import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useAllOrganizations, useAddUserToOrg } from '@/hooks/useOrganization';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ErrorAlert } from '@/components/ui/ErrorAlert';

export function AssignUserPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: orgs, isLoading: orgsLoading } = useAllOrganizations();
  const { addUser, isLoading: submitting, isError, error } = useAddUserToOrg();

  const [organizationId, setOrganizationId] = useState('');
  const [phone, setPhone] = useState('');

  const selectedOrg = orgs?.find((o) => o.id === Number(organizationId));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!organizationId || !phone) return;
    addUser(
      { organizationId: Number(organizationId), phone },
      {
        onSuccess: () => {
          toast.success(t('assignUser.success'));
          setPhone('');
        },
      },
    );
  };

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-8">
        <button
          onClick={() => navigate('/organization')}
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-sub transition hover:text-ink"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('common.back')}
        </button>
        <h1 className="text-2xl font-extrabold text-ink">{t('assignUser.title')}</h1>
        <p className="mt-1 text-sm text-faint">{t('assignUser.subtitle')}</p>
      </div>

      <div className="rounded-2xl border border-surface-border bg-surface-card p-8 shadow-card">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Organization selector */}
          {orgsLoading ? (
            <div className="flex flex-col gap-1.5">
              <div className="h-4 w-24 animate-pulse rounded bg-surface-elevated" />
              <div className="h-10 animate-pulse rounded-xl bg-surface-elevated" />
            </div>
          ) : (
            <Select
              label={t('assignUser.orgLabel')}
              value={organizationId}
              onChange={(e) => setOrganizationId(e.target.value)}
              required
            >
              <option value="">{t('assignUser.selectOrg')}</option>
              {orgs?.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name} ({o.type} · {o.city})
                </option>
              ))}
            </Select>
          )}

          {/* Selected org preview */}
          {selectedOrg && (
            <div className="flex items-center gap-3 rounded-xl border border-primary/25 bg-primary/5 px-4 py-3">
              {selectedOrg.logoUrl ? (
                <img src={selectedOrg.logoUrl} alt={selectedOrg.name} className="h-10 w-10 rounded-lg object-contain" />
              ) : (
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white border border-surface-border">
                  <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
                  </svg>
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-ink">{selectedOrg.name}</p>
                <p className="text-xs text-faint">{selectedOrg.type} · {selectedOrg.city} · BIN: {selectedOrg.bin}</p>
              </div>
            </div>
          )}

          <Input
            label={t('assignUser.userIdLabel')}
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+7 777 123 45 67"
            required
          />

          {isError && <ErrorAlert message={error?.message} />}

          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={submitting} size="lg" className="flex-1">
              {t('assignUser.submit')}
            </Button>
            <Button type="button" variant="secondary" size="lg" onClick={() => navigate('/organization')}>
              {t('common.cancel')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
