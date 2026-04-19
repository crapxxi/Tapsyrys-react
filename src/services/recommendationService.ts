import { apiClient } from '@/lib/axios';
import type { Recommendation } from '@/types/api';

export const recommendationService = {
  /** GET /api/v1/recommendations/tiktok */
  getTiktok: async (): Promise<Recommendation[]> => {
    const response = await apiClient.get<Recommendation[]>('/api/v1/recommendations/tiktok');
    return response.data;
  },

  /** GET /api/v1/recommendations/osm — uses org location stored on backend */
  getOsm: async (): Promise<Recommendation[]> => {
    const response = await apiClient.get<Recommendation[]>('/api/v1/recommendations/osm');
    return response.data;
  },
};
