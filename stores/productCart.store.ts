"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartProduct {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  weight: string;
}

interface ProductCartState {
  items: CartProduct[];
  addProduct: (product: CartProduct) => void;
  removeProduct: (productId: number) => void;
  clearCart: () => void;
}

export const useProductCartStore = create<ProductCartState>()(
  persist(
    (set, get) => ({
      items: [],

      addProduct: (newItem) => {
        const items = get().items;
        const index = items.findIndex(
          (item) => item.productId === newItem.productId
        );

        if (index !== -1) {
          const updated = [...items];
          updated[index].quantity += newItem.quantity;
          updated[index].weight = newItem.weight;
          return set({ items: updated });
        }

        set({ items: [...items, newItem] });
      },

      removeProduct: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        })),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "product-cart-storage",
    }
  )
);
