import { apiClient } from '@/lib/axios';
import type { Recommendation } from '@/types/api';

export const recommendationService = {
  /** GET /api/v1/recommendations */
  getAll: async (): Promise<Recommendation[]> => {
    const response = await apiClient.get<Recommendation[]>('/api/v1/recommendations');
    return response.data;
  },
};
