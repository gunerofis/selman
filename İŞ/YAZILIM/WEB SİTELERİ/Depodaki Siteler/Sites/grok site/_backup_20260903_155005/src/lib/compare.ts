import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getProduct, type Product } from "./products";

export const COMPARE_MAX = 4;

type CompareState = {
  skus: string[];
  toggle: (sku: string) => boolean;
  remove: (sku: string) => void;
  replace: (skus: string[]) => void;
  clear: () => void;
};

export const useCompare = create<CompareState>()(
  persist(
    (set, get) => ({
      skus: [],
      toggle: (sku) => {
        const cur = get().skus;
        if (cur.includes(sku)) {
          set({ skus: cur.filter((s) => s !== sku) });
          return true;
        }
        if (cur.length >= COMPARE_MAX) return false;
        set({ skus: [...cur, sku] });
        return true;
      },
      remove: (sku) => set({ skus: get().skus.filter((s) => s !== sku) }),
      replace: (skus) => {
        const unique = [...new Set(skus.filter(Boolean))].slice(0, COMPARE_MAX);
        set({ skus: unique });
      },
      clear: () => set({ skus: [] }),
    }),
    { name: "sweb-compare" },
  ),
);

export function comparedProducts(skus: string[]): Product[] {
  return skus.map(getProduct).filter((p): p is Product => p != null);
}
