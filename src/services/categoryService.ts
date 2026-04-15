import { apiClient } from '@/lib/axios';
import type { CategoryResponse } from '@/types/api';

export const categoryService = {
  /** GET /api/v1/categories/ */
  getAll: async (): Promise<CategoryResponse[]> => {
    const response = await apiClient.get<CategoryResponse[]>('/api/v1/categories/');
    return response.data;
  },

  /** POST /api/v1/categories/?name=... */
  create: async (name: string): Promise<CategoryResponse> => {
    const response = await apiClient.post<CategoryResponse>('/api/v1/categories/', null, {
      params: { name },
    });
    return response.data;
  },
};
