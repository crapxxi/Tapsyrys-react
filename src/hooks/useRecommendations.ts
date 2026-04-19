import { useQuery } from '@tanstack/react-query';
import { recommendationService } from '@/services/recommendationService';
import type { Recommendation } from '@/types/api';

export function useRecommendationsTiktok() {
  return useQuery<Recommendation[], Error>({
    queryKey: ['recommendations', 'tiktok'],
    queryFn: recommendationService.getTiktok,
  });
}

export function useRecommendationsOsm() {
  return useQuery<Recommendation[], Error>({
    queryKey: ['recommendations', 'osm'],
    queryFn: recommendationService.getOsm,
  });
}
