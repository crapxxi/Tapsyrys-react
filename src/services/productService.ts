import { apiClient } from '@/lib/axios';
import type { ProductRequest, ProductResponse } from '@/types/api';

function toFormData(data: ProductRequest, image?: File): FormData {
  const fd = new FormData();
  fd.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
  if (image) fd.append('image', image);
  return fd;
}

export const productService = {
  /** GET /api/v1/products?name=... */
  searchByName: async (name: string): Promise<ProductResponse[]> => {
    const response = await apiClient.get<ProductResponse[]>('/api/v1/products/', {
      params: { name },
    });
    return response.data;
  },

  /** POST /api/v1/products  (multipart/form-data to support Cloudinary image upload) */
  create: async (data: ProductRequest, image?: File): Promise<ProductResponse> => {
    const response = await apiClient.post<ProductResponse>(
      '/api/v1/products/create',
      toFormData(data, image),
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    return response.data;
  },

  /** GET /api/v1/products/:productId */
  getById: async (productId: number): Promise<ProductResponse> => {
    const response = await apiClient.get<ProductResponse>(`/api/v1/products/${productId}`);
    return response.data;
  },

  /** PUT /api/v1/products/:productId */
  update: async (productId: number, data: ProductRequest, image?: File): Promise<ProductResponse> => {
    const response = await apiClient.put<ProductResponse>(
      `/api/v1/products/${productId}/update`,
      toFormData(data, image),
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    return response.data;
  },

  /** DELETE /api/v1/products/:productId */
  remove: async (productId: number): Promise<void> => {
    await apiClient.delete(`/api/v1/products/${productId}/delete`);
  },

  /** GET /api/v1/products/category?categoryId=...&name=... */
  searchByCategoryAndName: async (
    categoryId: number,
    name?: string,
  ): Promise<ProductResponse[]> => {
    const response = await apiClient.get<ProductResponse[]>('/api/v1/products/category', {
      params: { name, categoryId },
    });
    return response.data;
  },

  /** GET /api/v1/products/organization/:organizationId */
  getByOrganization: async (organizationId: number): Promise<ProductResponse[]> => {
    const response = await apiClient.get<ProductResponse[]>(
      `/api/v1/products/organization/${organizationId}`,
    );
    return response.data;
  },
};
