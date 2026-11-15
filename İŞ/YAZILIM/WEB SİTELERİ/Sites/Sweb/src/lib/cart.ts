import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getProduct, productSlug, type ColorId } from "./products";
import { LINES } from "./line-items";
import { shippingForSubtotal } from "./commerce";
import { recolorLines, restoreLine } from "./cart-lines";

export { recolorLines, restoreLine } from "./cart-lines";

export type CartLine = {
  sku: string;
  color: ColorId;
  qty: number;
  catalog?: CartCatalogItem;
};

export type CartCatalogItem = {
  lineKey: "sweb" | "slac" | "clik" | "desq";
  itemId: string;
  path: string;
  name: string;
  image: string;
  price: number | null;
  code?: string;
  kind?: string;
};

export type CartLineDisplay = {
  name: string;
  shortName: string;
  image: string;
  price: number | null;
  href: string;
  code: string;
  catalog: boolean;
};

type CartState = {
  lines: CartLine[];
  drawerOpen: boolean;
  lastAdded: { sku: string; color: ColorId } | null;
  lastRemoved: CartLine | null;
  add: (sku: string, color: ColorId, qty?: number, shouldOpen?: boolean) => void;
  addCatalog: (item: CartCatalogItem, qty?: number, shouldOpen?: boolean) => void;
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
      addCatalog: (catalog, qty = 1, shouldOpen = true) => {
        if (catalog.lineKey !== "clik" || !LINES.some((line) => line.items.some((item) => item.id === catalog.itemId))) return;
        const sku = `catalog:${catalog.lineKey}:${catalog.itemId}`;
        const color: ColorId = "espresso";
        const lines = [...get().lines];
        const i = lines.findIndex((line) => line.sku === sku);
        if (i >= 0) lines[i] = { ...lines[i], catalog, qty: lines[i].qty + qty };
        else lines.push({ sku, color, qty, catalog });
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
      merge: (persisted, current) => ({
        ...current,
        lines: ((persisted as { lines?: CartLine[] } | undefined)?.lines ?? []).filter((line) =>
          line.catalog?.lineKey === "clik" && LINES.some((family) => family.items.some((item) => item.id === line.catalog?.itemId)),
        ),
      }),
      partialize: (s) => ({ lines: s.lines }),
    },
  ),
);

export function cartCount(lines: CartLine[]) {
  return lines.reduce((n, l) => n + l.qty, 0);
}

export function cartSubtotal(lines: CartLine[]) {
  return lines.reduce((sum, l) => {
    const price = l.catalog?.price ?? getProduct(l.sku)?.price;
    return sum + (price == null ? 0 : price * l.qty);
  }, 0);
}

export function cartHasPendingPrice(lines: CartLine[]) {
  return lines.some((line) => line.catalog?.price == null);
}

export function cartLineDisplay(line: CartLine | undefined): CartLineDisplay | null {
  if (!line) return null;
  if (line.catalog) {
    return {
      name: line.catalog.name,
      shortName: line.catalog.name,
      image: line.catalog.image,
      price: line.catalog.price,
      href: `${line.catalog.path}/${encodeURIComponent(line.catalog.itemId)}`,
      code: line.catalog.code ?? line.catalog.itemId,
      catalog: true,
    };
  }
  const product = getProduct(line.sku);
  if (!product) return null;
  return {
    name: product.name,
    shortName: product.shortName,
    image: product.image,
    price: product.price,
    href: `/urun/${productSlug(product)}`,
    code: product.sku,
    catalog: false,
  };
}

export function shippingFor(subtotal: number) {
  return shippingForSubtotal(subtotal);
}
