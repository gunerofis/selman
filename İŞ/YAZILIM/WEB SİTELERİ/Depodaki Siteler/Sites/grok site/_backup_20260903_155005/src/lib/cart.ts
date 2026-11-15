import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getProduct, type ColorId } from "./products";
import { shippingForSubtotal } from "./commerce";
import { recolorLines, restoreLine } from "./cart-lines";

export { recolorLines, restoreLine } from "./cart-lines";

export type CartLine = {
  sku: string;
  color: ColorId;
  qty: number;
};

type CartState = {
  lines: CartLine[];
  drawerOpen: boolean;
  lastAdded: { sku: string; color: ColorId } | null;
  lastRemoved: CartLine | null;
  add: (sku: string, color: ColorId, qty?: number, shouldOpen?: boolean) => void;
  addMany: (skus: string[], color: ColorId, shouldOpen?: boolean) => void;
  setQty: (sku: string, color: ColorId, qty: number) => void;
  remove: (sku: string, color: ColorId) => void;
  restoreLast: () => void;
  setColor: (sku: string, from: ColorId, to: ColorId) => void;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      drawerOpen: false,
      lastAdded: null,
      lastRemoved: null,
      add: (sku, color, qty = 1, shouldOpen = true) => {
        const lines = [...get().lines];
        const i = lines.findIndex((l) => l.sku === sku && l.color === color);
        if (i >= 0) lines[i] = { ...lines[i], qty: lines[i].qty + qty };
        else lines.push({ sku, color, qty });
        set({
          lines,
          lastAdded: { sku, color },
          drawerOpen: shouldOpen ? true : get().drawerOpen,
        });
      },
      addMany: (skus, color, shouldOpen = true) => {
        const lines = [...get().lines];
        for (const sku of skus) {
          const i = lines.findIndex((l) => l.sku === sku && l.color === color);
          if (i >= 0) lines[i] = { ...lines[i], qty: lines[i].qty + 1 };
          else lines.push({ sku, color, qty: 1 });
        }
        const last = skus.at(-1);
        set({
          lines,
          lastAdded: last ? { sku: last, color } : get().lastAdded,
          drawerOpen: shouldOpen ? true : get().drawerOpen,
        });
      },
      setQty: (sku, color, qty) => {
        if (qty < 1) {
          set({ lines: get().lines.filter((l) => !(l.sku === sku && l.color === color)) });
          return;
        }
        set({
          lines: get().lines.map((l) => (l.sku === sku && l.color === color ? { ...l, qty } : l)),
        });
      },
      remove: (sku, color) => {
        const line = get().lines.find((l) => l.sku === sku && l.color === color) ?? null;
        set({
          lines: get().lines.filter((l) => !(l.sku === sku && l.color === color)),
          lastRemoved: line,
        });
      },
      restoreLast: () => {
        const line = get().lastRemoved;
        if (!line) return;
        set({ lines: restoreLine(get().lines, line), lastRemoved: null });
      },
      setColor: (sku, from, to) => set({ lines: recolorLines(get().lines, sku, from, to) }),
      clear: () => set({ lines: [], drawerOpen: false, lastAdded: null, lastRemoved: null }),
      openDrawer: () => set({ drawerOpen: true }),
      closeDrawer: () => set({ drawerOpen: false }),
    }),
    {
      name: "sweb-cart",
      partialize: (s) => ({ lines: s.lines }),
    },
  ),
);

export function cartCount(lines: CartLine[]) {
  return lines.reduce((n, l) => n + l.qty, 0);
}

export function cartSubtotal(lines: CartLine[]) {
  return lines.reduce((sum, l) => {
    const p = getProduct(l.sku);
    return sum + (p ? p.price * l.qty : 0);
  }, 0);
}

export function shippingFor(subtotal: number) {
  return shippingForSubtotal(subtotal);
}
