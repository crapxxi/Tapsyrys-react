import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/services/productService';
import type { ProductRequest, ProductResponse } from '@/types/api';

export const productKeys = {
  all: ['products'] as const,
  byOrg: (orgId: number) => ['products', 'org', orgId] as const,
  byId: (id: number) => ['products', id] as const,
  search: (name: string) => ['products', 'search', name] as const,
};

/** GET /api/v1/products/?name= — search by name (empty string = all) */
export function useProductSearch(name: string) {
  return useQuery<ProductResponse[], Error>({
    queryKey: ['products', 'search', name],
    queryFn: () => productService.searchByName(name),
  });
}

/** GET /api/v1/products/category?categoryId=&name= */
export function useProductsByCategory(categoryId: number, name?: string) {
  return useQuery<ProductResponse[], Error>({
    queryKey: ['products', 'category', categoryId, name ?? ''],
    queryFn: () => productService.searchByCategoryAndName(categoryId, name),
    enabled: categoryId > 0,
  });
}

export function useProductsByOrganization(organizationId: number) {
  return useQuery<ProductResponse[], Error>({
    queryKey: productKeys.byOrg(organizationId),
    queryFn: () => productService.getByOrganization(organizationId),
    enabled: organizationId > 0,
  });
}

export function useProduct(productId: number) {
  return useQuery<ProductResponse, Error>({
    queryKey: productKeys.byId(productId),
    queryFn: () => productService.getById(productId),
    enabled: productId > 0,
  });
}

// ─── Mutations ───────────────────────────────────────────────────────────────

interface CreateProductVars {
  data: ProductRequest;
  image?: File;
}

interface UpdateProductVars {
  id: number;
  data: ProductRequest;
  image?: File;
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const mutation = useMutation<ProductResponse, Error, CreateProductVars>({
    mutationFn: ({ data, image }) => productService.create(data, image),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
  return {
    createProduct: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
  };
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const mutation = useMutation<ProductResponse, Error, UpdateProductVars>({
    mutationFn: ({ id, data, image }) => productService.update(id, data, image),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
  return {
    updateProduct: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const mutation = useMutation<void, Error, number>({
    mutationFn: productService.remove,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
  return {
    deleteProduct: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}
