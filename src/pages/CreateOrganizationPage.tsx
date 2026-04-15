import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useCreateOrganization } from '@/hooks/useOrganization';
import type { RegOrgRequest } from '@/types/api';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { ImageUpload } from '@/components/ui/ImageUpload';

const emptyForm: RegOrgRequest = { name: '', address: '', type: 'SUPPLIER', city: '', bin: '', category: '' };

export function CreateOrganizationPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { createOrganization, isLoading, isError, error } = useCreateOrganization();
  const [form, setForm] = useState<RegOrgRequest>(emptyForm);
  const [logoFile, setLogoFile] = useState<File | undefined>();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const orgTypes = [
    { value: 'SUPPLIER', label: t('organization.typeLabels.SUPPLIER') },
    { value: 'SHOP', label: t('organization.typeLabels.SHOP') },
  ];
  const orgCategories: string[] = t('organization.categories', { returnObjects: true }) as string[];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogo = (file: File) => {
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createOrganization({ data: form, logo: logoFile }, {
      onSuccess: () => {
        toast.success(t('organization.createSuccess'));
        navigate('/organization');
      },
    });
  };

  return (
    <div className="mx-auto max-w-2xl">
      {/* Page header */}
      <div className="mb-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-sub transition hover:text-ink"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('common.back')}
        </button>
        <h1 className="text-2xl font-extrabold text-ink">{t('organization.createTitle')}</h1>
        <p className="mt-1 text-sm text-faint">{t('organization.createSubtitle')}</p>
      </div>

      <div className="rounded-2xl border border-surface-border bg-surface-card p-8 shadow-card">
        <form onSubmit={handleSubmit} className="space-y-5">

          <Input
            label={t('organization.fields.name')}
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="ТОО «Название»"
            required
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label={t('organization.fields.type')}
              name="type"
              value={form.type}
              onChange={handleChange}
              required
            >
              {orgTypes.map((tp) => (
                <option key={tp.value} value={tp.value}>{tp.label}</option>
              ))}
            </Select>

            <Select
              label={t('organization.fields.category')}
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option value="">{t('common.all')}…</option>
              {orgCategories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label={t('organization.fields.city')}
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="Алматы"
              required
            />
            <Input
              label={t('organization.fields.bin')}
              name="bin"
              type="text"
              inputMode="numeric"
              value={form.bin}
              onChange={handleChange}
              placeholder="123456789012"
              required
            />
          </div>

          <Input
            label={t('organization.fields.address')}
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="ул. Абая, 1"
            required
          />

          <ImageUpload preview={logoPreview} onFile={handleLogo} labelKey="organization.fields.logo" />

          {isError && <ErrorAlert message={error?.message} />}

          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={isLoading} size="lg" className="flex-1">
              {t('organization.create')}
            </Button>
            <Button type="button" variant="secondary" size="lg" onClick={() => navigate(-1)}>
              {t('common.cancel')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
