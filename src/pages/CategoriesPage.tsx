import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useCategories, useCreateCategory } from '@/hooks/useCategories';
import { useMyOrganization } from '@/hooks/useOrganization';
import { useCreateProduct } from '@/hooks/useProducts';
import { useAuth } from '@/contexts/AuthContext';
import type { ProductRequest } from '@/types/api';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { ProductForm } from '@/components/ui/ProductForm';

const ICONS = ['📦', '🛒', '🏭', '🥦', '🖥️', '👗', '🚗', '🏠', '💊', '🎮', '🔧', '🍕'];

const emptyProduct: ProductRequest = {
  name: '', sku: '', basePrice: 0, count: 0, description: '', categoryId: 0, minOrderCount: 1,
};

export function CategoriesPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: categories, isLoading } = useCategories();

  // Category creation
  const { createCategory, isLoading: creating, isError: catErr, error: catError } = useCreateCategory();
  const [catOpen, setCatOpen] = useState(false);
  const [catName, setCatName] = useState('');

  // Product creation
  const { data: org } = useMyOrganization();
  const { createProduct, isLoading: productCreating, error: productErr } = useCreateProduct();
  const [productOpen, setProductOpen] = useState(false);
  const [productForm, setProductForm] = useState<ProductRequest>(emptyProduct);
  const [imageFile, setImageFile] = useState<File | undefined>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const canAddCategory = user?.role === 'ADMIN';
  const canAddProduct = !!org;

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCategory(catName, {
      onSuccess: () => {
        setCatOpen(false);
        setCatName('');
        toast.success(t('categories.createSuccess'));
      },
    });
  };

  const handleProductChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setProductForm((prev) => ({
      ...prev,
      [name]:
        name === 'basePrice' || name === 'count' || name === 'categoryId' || name === 'minOrderCount'
          ? Number(value)
          : value,
    }));
  };

  const handleProductFile = (file: File) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const openProductModal = () => {
    setProductForm(emptyProduct);
    setImageFile(undefined);
    setImagePreview(null);
    setProductOpen(true);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProduct({ data: productForm, image: imageFile }, {
      onSuccess: () => {
        setProductOpen(false);
        toast.success(t('myProducts.createSuccess'));
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">{t('categories.title')}</h1>
          <p className="text-sm text-faint">{t('categories.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          {canAddProduct && (
            <Button variant="secondary" onClick={openProductModal}>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              {t('myProducts.add')}
            </Button>
          )}
          {canAddCategory && (
            <Button onClick={() => setCatOpen(true)}>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {t('categories.add')}
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : !categories?.length ? (
        <div className="flex flex-col items-center rounded-2xl border border-surface-border bg-surface-card py-20">
          <svg className="h-16 w-16 text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="mt-4 text-faint">{t('categories.noCategories')}</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((c, i) => (
            <div
              key={c.id}
              className="flex items-center gap-4 rounded-2xl border border-surface-border bg-surface-card p-5 transition hover:border-primary/30 hover:shadow-neon-sm"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-surface-elevated text-2xl">
                {ICONS[i % ICONS.length]}
              </div>
              <div>
                <p className="font-semibold text-ink">{c.name}</p>
                <p className="text-xs text-sub">{t('categories.id', { id: c.id })}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Category modal */}
      {canAddCategory && (
        <Modal open={catOpen} onClose={() => setCatOpen(false)} title={t('categories.add')}>
          <form onSubmit={handleCategorySubmit} className="space-y-4">
            <Input
              label={t('categories.nameLabel')}
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              placeholder={t('categories.namePlaceholder')}
              required
            />
            {catErr && <ErrorAlert message={catError?.message} />}
            <Button type="submit" loading={creating} className="w-full">
              {t('common.create')}
            </Button>
          </form>
        </Modal>
      )}

      {/* Add Product modal */}
      {canAddProduct && (
        <Modal open={productOpen} onClose={() => setProductOpen(false)} title={t('myProducts.createTitle')}>
          <ProductForm
            form={productForm}
            imagePreview={imagePreview}
            categories={categories}
            loading={productCreating}
            err={productErr}
            onChange={handleProductChange}
            onFile={handleProductFile}
            onSubmit={handleProductSubmit}
          />
        </Modal>
      )}
    </div>
  );
}
