import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '@/services/categoryService';
import type { CategoryResponse } from '@/types/api';

export const categoryKeys = {
  all: ['categories'] as const,
};

export function useCategories() {
  const { data, isLoading, isError, error } = useQuery<CategoryResponse[], Error>({
    queryKey: categoryKeys.all,
    queryFn: categoryService.getAll,
  });
  return { data, isLoading, isError, error };
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  const mutation = useMutation<CategoryResponse, Error, string>({
    mutationFn: (name) => categoryService.create(name),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
  return {
    createCategory: mutation.mutate,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  };
}
