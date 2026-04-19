import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useProductsByOrganization, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/useProducts';
import { useMyOrganization } from '@/hooks/useOrganization';
import { useCategories } from '@/hooks/useCategories';
import type { ProductRequest, ProductResponse } from '@/types/api';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { SkeletonRow } from '@/components/ui/Skeleton';
import { ProductForm } from '@/components/ui/ProductForm';

const emptyForm: ProductRequest = {
  name: '', sku: '', basePrice: 0, count: 0, description: '', categoryId: 0, minOrderCount: 1,
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export function MyProductsPage() {
  const { t } = useTranslation();
  const { data: org, isLoading: orgLoading } = useMyOrganization();
  const { data: products, isLoading } = useProductsByOrganization(org?.id ?? 0);
  const { data: categories } = useCategories();
  const { createProduct, isLoading: creating, error: createErr } = useCreateProduct();
  const { updateProduct, isLoading: updating, error: updateErr } = useUpdateProduct();
  const { deleteProduct } = useDeleteProduct();

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ProductResponse | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductRequest>(emptyForm);
  const [imageFile, setImageFile] = useState<File | undefined>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'basePrice' || name === 'count' || name === 'categoryId' || name === 'minOrderCount'
        ? Number(value)
        : value,
    }));
  };

  const handleFile = (file: File) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const openCreate = () => {
    setForm(emptyForm);
    setImageFile(undefined);
    setImagePreview(null);
    setCreateOpen(true);
  };

  const openEdit = (p: ProductResponse) => {
    setForm({
      name: p.name,
      sku: p.sku,
      basePrice: p.basePrice,
      count: p.count,
      description: p.description,
      categoryId: p.category.id,
      minOrderCount: p.minOrderCount ?? 1,
    });
    setImageFile(undefined);
    setImagePreview(p.imageUrl || null);
    setEditTarget(p);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createProduct({ data: form, image: imageFile }, {
      onSuccess: () => {
        setCreateOpen(false);
        toast.success(t('myProducts.createSuccess'));
      },
    });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    updateProduct({ id: editTarget.id, data: form, image: imageFile }, {
      onSuccess: () => {
        setEditTarget(null);
        toast.success(t('myProducts.updateSuccess'));
      },
    });
  };

  const confirmDelete = () => {
    if (deleteId === null) return;
    deleteProduct(deleteId, {
      onSuccess: () => {
        setDeleteId(null);
        toast.success(t('myProducts.deleteSuccess'));
      },
    });
  };

  if (orgLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-surface-elevated" />
        <div className="rounded-2xl border border-surface-border bg-surface-card overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
        </div>
      </div>
    );
  }

  if (!org) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-surface-border bg-surface-card py-24">
        <svg className="h-16 w-16 text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
        </svg>
        <p className="mt-4 text-faint">{t('myProducts.createOrgFirst')}</p>
        <Link to="/organization/create" className="mt-4">
          <Button>{t('myProducts.createOrg')}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">{t('myProducts.title')}</h1>
          <p className="text-sm text-faint">{org.name}</p>
        </div>
        <Button onClick={openCreate}>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t('myProducts.add')}
        </Button>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-surface-border bg-surface-card overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
        </div>
      ) : !products?.length ? (
        <div className="flex flex-col items-center rounded-2xl border border-surface-border bg-surface-card py-20">
          <svg className="h-16 w-16 text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <p className="mt-4 text-faint">{t('myProducts.noProducts')}</p>
          <Button className="mt-3" onClick={openCreate}>{t('myProducts.createFirst')}</Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-surface-border bg-surface-card">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-surface-border bg-surface-elevated">
                  {[
                    t('myProducts.table.product'),
                    t('myProducts.table.sku'),
                    t('myProducts.table.category'),
                    t('myProducts.table.price'),
                    t('myProducts.table.qty'),
                    '',
                  ].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-sub">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {products.map((p) => (
                  <tr key={p.id} className="transition hover:bg-surface-elevated/40">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {p.imageUrl ? (
                          <img src={p.imageUrl} alt={p.name} className="h-10 w-10 rounded-lg object-cover flex-shrink-0" />
                        ) : (
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-surface-elevated">
                            <svg className="h-5 w-5 text-sub" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-ink">{p.name}</p>
                          {p.description && (
                            <p className="mt-0.5 max-w-xs truncate text-xs text-faint">{p.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-faint">{p.sku}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary-dark">
                        {p.category.name}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-primary">
                      {p.basePrice.toLocaleString()} ₸
                    </td>
                    <td className="px-5 py-4 text-sm text-sub">{p.count}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEdit(p)}
                          className="rounded-lg p-1.5 text-faint transition hover:bg-primary/10 hover:text-primary"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleteId(p.id)}
                          className="rounded-lg p-1.5 text-faint transition hover:bg-red-500/10 hover:text-red-600"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title={t('myProducts.createTitle')}>
        <ProductForm
          form={form}
          imagePreview={imagePreview}
          categories={categories}
          loading={creating}
          err={createErr}
          onChange={handleChange}
          onFile={handleFile}
          onSubmit={handleCreate}
        />
      </Modal>

      {/* Edit modal */}
      <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title={t('myProducts.editTitle')}>
        <ProductForm
          form={form}
          imagePreview={imagePreview}
          categories={categories}
          loading={updating}
          err={updateErr}
          onChange={handleChange}
          onFile={handleFile}
          onSubmit={handleUpdate}
        />
      </Modal>

      {/* Delete confirm modal */}
      <Modal open={deleteId !== null} onClose={() => setDeleteId(null)} title={t('myProducts.deleteTitle')}>
        <p className="text-sm text-sub">{t('myProducts.deleteWarning')}</p>
        <div className="mt-5 flex gap-3">
          <Button variant="danger" onClick={confirmDelete} className="flex-1">{t('common.delete')}</Button>
          <Button variant="secondary" onClick={() => setDeleteId(null)} className="flex-1">{t('common.cancel')}</Button>
        </div>
      </Modal>
    </div>
  );
}
