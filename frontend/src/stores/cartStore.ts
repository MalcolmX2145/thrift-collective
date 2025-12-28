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
        // For thrift items, we only allow one of each (unique pieces)
        if (!items.some(i => i.productId === item.productId)) {
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
        return get().items.reduce((total, item) => total + item.price, 0);
      },
      
      getItemCount: () => {
        return get().items.length;
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
