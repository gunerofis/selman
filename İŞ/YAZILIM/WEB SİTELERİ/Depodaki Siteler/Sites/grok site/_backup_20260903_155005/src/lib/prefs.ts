import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getProduct, type ColorId, type Product } from "./products";

export type GridCols = 2 | 3 | 4;

type PrefsState = {
  wishlist: string[];
  recent: string[];
  lastColor: ColorId;
  gridCols: GridCols;
  toggleWish: (sku: string) => void;
  pushRecent: (sku: string) => void;
  rememberColor: (id: ColorId) => void;
  setGridCols: (n: GridCols) => void;
};

export const usePrefs = create<PrefsState>()(
  persist(
    (set, get) => ({
      wishlist: [],
      recent: [],
      lastColor: "espresso",
      gridCols: 4,
      toggleWish: (sku) => {
        const cur = get().wishlist;
        set({
          wishlist: cur.includes(sku) ? cur.filter((s) => s !== sku) : [sku, ...cur],
        });
      },
      pushRecent: (sku) => {
        set({
          recent: [sku, ...get().recent.filter((s) => s !== sku)].slice(0, 8),
        });
      },
      rememberColor: (id) => set({ lastColor: id }),
      setGridCols: (n) => set({ gridCols: n }),
    }),
    { name: "sweb-prefs" },
  ),
);

export function wishedProducts(skus: string[]) {
  return skus.map(getProduct).filter((p): p is Product => p != null);
}
