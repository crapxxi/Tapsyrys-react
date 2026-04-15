import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/services/orderService';
import type { OrderRequest, OrderResponse } from '@/types/api';

export const orderKeys = {
  shop: ['orders', 'shop'] as const,
  supplier: ['orders', 'supplier'] as const,
};

// ─── Queries ─────────────────────────────────────────────────────────────────

export function useShopOrders() {
  const { data, isLoading, isError, error } = useQuery<OrderResponse[], Error>({
    queryKey: orderKeys.shop,
    queryFn: orderService.getShopOrders,
  });

  return { data, isLoading, isError, error };
}

export function useSupplierOrders() {
  const { data, isLoading, isError, error } = useQuery<OrderResponse[], Error>({
    queryKey: orderKeys.supplier,
    queryFn: orderService.getSupplierOrders,
  });

  return { data, isLoading, isError, error };
}

// ─── Mutations ───────────────────────────────────────────────────────────────

export function useCreateOrder() {
  const queryClient = useQueryClient();

  const mutation = useMutation<OrderResponse, Error, OrderRequest>({
    mutationFn: orderService.create,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: orderKeys.shop });
    },
  });

  return {
    createOrder: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
  };
}

/**
 * Advances an order to its next status via PATCH /orders/:orderId/status.
 * The backend determines the next state — no body is sent.
 */
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  const mutation = useMutation<OrderResponse, Error, number>({
    mutationFn: (orderId) => orderService.updateStatus(orderId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: orderKeys.supplier });
    },
  });

  return {
    updateStatus: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}

export function useCancelOrder() {
  const queryClient = useQueryClient();

  const mutation = useMutation<OrderResponse, Error, number>({
    mutationFn: orderService.cancel,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: orderKeys.shop });
      void queryClient.invalidateQueries({ queryKey: orderKeys.supplier });
    },
  });

  return {
    cancelOrder: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}
