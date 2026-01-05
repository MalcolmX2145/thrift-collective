import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/types';

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  isInCart: (productId: string) => boolean;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item: CartItem) => {
        const { items } = get();
        const existingItem = items.find(i => i.productId === item.productId && i.size === item.size);

        if (existingItem) {
          // Update quantity if item exists
          set({
            items: items.map(i =>
              (i.productId === item.productId && i.size === item.size)
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            )
          });
        } else {
          // Add new item
          set({ items: [...items, item] });
        }
      },

      removeItem: (productId: string) => {
        set({ items: get().items.filter(item => item.productId !== productId) });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotal: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },

      isInCart: (productId: string) => {
        return get().items.some(item => item.productId === productId);
      },
    }),
    {
      name: 'thrift-collective-cart',
    }
  )
);
