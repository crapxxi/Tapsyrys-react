import { useTranslation } from 'react-i18next';
import type { ProductRequest } from '@/types/api';
import type { CategoryResponse } from '@/types/api';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { ImageUpload } from '@/components/ui/ImageUpload';

export interface ProductFormProps {
  form: ProductRequest;
  imagePreview: string | null;
  categories: CategoryResponse[] | undefined;
  loading: boolean;
  err: Error | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onFile: (file: File) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ProductForm({
  form,
  imagePreview,
  categories,
  loading,
  err,
  onChange,
  onFile,
  onSubmit,
}: ProductFormProps) {
  const { t } = useTranslation();

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label={t('myProducts.form.name')}
          name="name"
          value={form.name}
          onChange={onChange}
          placeholder={t('myProducts.form.namePlaceholder')}
          required
          autoComplete="off"
        />
        <Input
          label={t('myProducts.form.sku')}
          name="sku"
          value={form.sku}
          onChange={onChange}
          placeholder="SKU-001"
          required
          autoComplete="off"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label={t('myProducts.form.price')}
          name="basePrice"
          type="number"
          min={0}
          step={0.01}
          value={form.basePrice || ''}
          onChange={onChange}
          placeholder="0"
          required
        />
        <Input
          label={t('myProducts.form.count')}
          name="count"
          type="number"
          min={0}
          value={form.count || ''}
          onChange={onChange}
          placeholder="0"
          required
        />
      </div>

      <Select
        label={t('myProducts.form.category')}
        name="categoryId"
        value={form.categoryId || ''}
        onChange={onChange}
        required
      >
        <option value="">{t('myProducts.form.selectCategory')}</option>
        {categories?.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </Select>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink">{t('myProducts.form.description')}</label>
        <textarea
          name="description"
          value={form.description}
          onChange={onChange}
          rows={3}
          placeholder={t('myProducts.form.descriptionPlaceholder')}
          className="rounded-xl border border-surface-border bg-white px-4 py-2.5 text-sm text-ink placeholder:text-faint outline-none transition-all duration-150 hover:border-surface-muted focus:border-primary focus:ring-2 focus:ring-primary/15 resize-none"
        />
      </div>

      <ImageUpload preview={imagePreview} onFile={onFile} />

      {err && <ErrorAlert message={err.message} />}

      <Button type="submit" loading={loading} className="w-full">
        {t('common.save')}
      </Button>
    </form>
  );
}
