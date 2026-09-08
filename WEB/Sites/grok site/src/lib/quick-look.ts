import { create } from "zustand";
import type { ColorId, Product } from "./products";

type QuickLookState = {
  product: Product | null;
  color?: ColorId;
  open: (product: Product, color?: ColorId) => void;
  close: () => void;
};

export const useQuickLook = create<QuickLookState>((set) => ({
  product: null,
  color: undefined,
  open: (product, color) => set({ product, color }),
  close: () => set({ product: null, color: undefined }),
}));
