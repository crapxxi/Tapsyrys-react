import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProductResponse, OrderItemRequest } from '@/types/api';

export interface CartItem {
  product: ProductResponse;
  count: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: ProductResponse) => void;
  decrementItem: (productId: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
  totalAmount: () => number;
  totalCount: () => number;
  toOrderItems: () => OrderItemRequest[];
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
  items: [],

  addItem: (product) =>
    set((state) => {
      const existing = state.items.find((i) => i.product.id === product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.id === product.id ? { ...i, count: i.count + 1 } : i,
          ),
        };
      }
      return { items: [...state.items, { product, count: 1 }] };
    }),

  decrementItem: (productId) =>
    set((state) => {
      const existing = state.items.find((i) => i.product.id === productId);
      if (existing && existing.count <= 1) {
        return { items: state.items.filter((i) => i.product.id !== productId) };
      }
      return {
        items: state.items.map((i) =>
          i.product.id === productId ? { ...i, count: i.count - 1 } : i,
        ),
      };
    }),

  removeItem: (productId) =>
    set((state) => ({ items: state.items.filter((i) => i.product.id !== productId) })),

  clearCart: () => set({ items: [] }),

  totalAmount: () =>
    get().items.reduce((sum, i) => sum + i.product.basePrice * i.count, 0),

  totalCount: () => get().items.reduce((sum, i) => sum + i.count, 0),

  toOrderItems: (): OrderItemRequest[] =>
    get().items.map((i) => ({ productId: i.product.id, count: i.count })),
    }),
    { name: 'tapsyrys-cart' },
  ),
);
