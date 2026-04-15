import { apiClient } from '@/lib/axios';
import type { OrderRequest, OrderResponse } from '@/types/api';

export const orderService = {
  /** POST /api/v1/orders */
  create: async (data: OrderRequest): Promise<OrderResponse> => {
    const response = await apiClient.post<OrderResponse>('/api/v1/orders', data);
    return response.data;
  },

  /**
   * PATCH /api/v1/orders/:orderId/status
   * Advances order to the next logical status — no request body required.
   */
  updateStatus: async (orderId: number): Promise<OrderResponse> => {
    const response = await apiClient.patch<OrderResponse>(
      `/api/v1/orders/${orderId}/status`,
    );
    return response.data;
  },

  /** PATCH /api/v1/orders/:orderId/cancel */
  cancel: async (orderId: number): Promise<OrderResponse> => {
    const response = await apiClient.patch<OrderResponse>(`/api/v1/orders/${orderId}/cancel`);
    return response.data;
  },

  /** GET /api/v1/orders/shop */
  getShopOrders: async (): Promise<OrderResponse[]> => {
    const response = await apiClient.get<OrderResponse[]>('/api/v1/orders/shop');
    return response.data;
  },

  /** GET /api/v1/orders/supplier */
  getSupplierOrders: async (): Promise<OrderResponse[]> => {
    const response = await apiClient.get<OrderResponse[]>('/api/v1/orders/supplier');
    return response.data;
  },
};
