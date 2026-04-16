import { useQuery } from '@tanstack/react-query';
import { recommendationService } from '@/services/recommendationService';
import type { Recommendation } from '@/types/api';

export function useRecommendations() {
  return useQuery<Recommendation[], Error>({
    queryKey: ['recommendations'],
    queryFn: recommendationService.getAll,
  });
}
