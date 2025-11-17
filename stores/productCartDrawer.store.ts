import { create } from "zustand";

interface ProductCartDrawerStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useProductCartDrawer = create<ProductCartDrawerStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
