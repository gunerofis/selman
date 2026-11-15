import type { LineDef } from "./line-items";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { defaultSizeId, getProduct, productSlug, unitPrice, type ColorId } from "./products";

/** Geçersiz varyantı ürünün varsayılan hacmine çevirir. */
function variantFor(sku: string, color: ColorId): ColorId {
  if (unitPrice(sku, color) != null) return color;
  const p = getProduct(sku);
  return p ? defaultSizeId(p) : color;
}
import { shippingForSubtotal } from "./commerce";
import { catalogDiscoveryPrice, isSampleVariant } from "./discovery";
import type { ShippingRule } from "./shipping";
import { recolorLines, restoreLine } from "./cart-lines";

export { recolorLines, restoreLine } from "./cart-lines";

export type CartLine = {
  sku: string;
  color: ColorId;
  qty: number;
  catalog?: CartCatalogItem;
};

export type CartCatalogItem = {
  lineKey: LineDef["key"];
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
  discovery: boolean;
  add: (sku: string, color: ColorId, qty?: number, shouldOpen?: boolean) => void;
  setBundle: (lines: CartLine[]) => void;
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
      discovery: false,
      setBundle: (lines) =>
        set({
          lines,
          discovery: true,
          drawerOpen: true,
          lastAdded: lines.at(-1) ? { sku: lines.at(-1)!.sku, color: lines.at(-1)!.color } : null,
          lastRemoved: null,
        }),
      add: (sku, rawColor, qty = 1, shouldOpen = true) => {
        const color = variantFor(sku, rawColor);
        const lines = [...get().lines];
        const i = lines.findIndex((l) => l.sku === sku && l.color === color);
        if (i >= 0) lines[i] = { ...lines[i], qty: lines[i].qty + qty };
        else lines.push({ sku, color, qty });
        set({
          lines,
          discovery: false,
          lastAdded: { sku, color },
          drawerOpen: shouldOpen ? true : get().drawerOpen,
        });
      },
      addCatalog: (catalog, qty = 1, shouldOpen = true) => {
        const sku = `catalog:${catalog.lineKey}:${catalog.itemId}`;
        const color: ColorId = "espresso";
        const lines = [...get().lines];
        const i = lines.findIndex((line) => line.sku === sku);
        if (i >= 0) lines[i] = { ...lines[i], catalog, qty: lines[i].qty + qty };
        else lines.push({ sku, color, qty, catalog });
        set({
          lines,
          discovery: false,
          lastAdded: { sku, color },
          drawerOpen: shouldOpen ? true : get().drawerOpen,
        });
      },
      addMany: (skus, rawColor, shouldOpen = true) => {
        const lines = [...get().lines];
        for (const sku of skus) {
          const color = variantFor(sku, rawColor);
          const i = lines.findIndex((l) => l.sku === sku && l.color === color);
          if (i >= 0) lines[i] = { ...lines[i], qty: lines[i].qty + 1 };
          else lines.push({ sku, color, qty: 1 });
        }
        const last = skus.at(-1);
        set({
          lines,
          discovery: false,
          lastAdded: last ? { sku: last, color: variantFor(last, rawColor) } : get().lastAdded,
          drawerOpen: shouldOpen ? true : get().drawerOpen,
        });
      },
      setQty: (sku, color, qty) => {
        if (qty < 1) {
          set({
            lines: get().lines.filter((l) => !(l.sku === sku && l.color === color)),
            discovery: false,
          });
          return;
        }
        set({
          lines: get().lines.map((l) => (l.sku === sku && l.color === color ? { ...l, qty } : l)),
          discovery: false,
        });
      },
      remove: (sku, color) => {
        const line = get().lines.find((l) => l.sku === sku && l.color === color) ?? null;
        set({
          lines: get().lines.filter((l) => !(l.sku === sku && l.color === color)),
          discovery: false,
          lastRemoved: line,
        });
      },
      restoreLast: () => {
        const line = get().lastRemoved;
        if (!line) return;
        set({ lines: restoreLine(get().lines, line), discovery: false, lastRemoved: null });
      },
      setColor: (sku, from, to) =>
        set({ lines: recolorLines(get().lines, sku, from, to), discovery: false }),
      clear: () => set({ lines: [], discovery: false, drawerOpen: false, lastAdded: null, lastRemoved: null }),
      openDrawer: () => set({ drawerOpen: true }),
      closeDrawer: () => set({ drawerOpen: false }),
    }),
    {
      name: "sweb-cart",
      partialize: (s) => ({ lines: s.lines, discovery: s.discovery }),
    },
  ),
);

export function cartCount(lines: CartLine[]) {
  return lines.reduce((n, l) => n + l.qty, 0);
}

export function cartSubtotal(lines: CartLine[]) {
  return lines.reduce((sum, l) => {
    const price = l.catalog ? l.catalog.price : unitPrice(l.sku, l.color);
    return sum + (price == null ? 0 : price * l.qty);
  }, 0);
}

export function discoveryCart(lines: CartLine[], discovery: boolean) {
  if (!discovery || lines.length !== 5 || catalogDiscoveryPrice() == null) return false;
  if (lines.some((line) => line.qty !== 1 || line.catalog)) return false;
  const seen = new Set<string>();
  for (const line of lines) {
    if (seen.has(line.sku) || !isSampleVariant(line.sku, line.color)) return false;
    seen.add(line.sku);
  }
  return true;
}

export function chargedSubtotal(lines: CartLine[], discovery: boolean) {
  if (!discoveryCart(lines, discovery)) return cartSubtotal(lines);
  return catalogDiscoveryPrice() ?? cartSubtotal(lines);
}

export function cartHasPendingPrice(lines: CartLine[]) {
  return lines.some((line) =>
    line.catalog ? line.catalog.price == null : unitPrice(line.sku, line.color) == null,
  );
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
    price: unitPrice(line.sku, line.color) ?? null,
    href: `/urun/${productSlug(product)}`,
    code: product.sku,
    catalog: false,
  };
}

export function shippingFor(subtotal: number, rule?: ShippingRule) {
  return shippingForSubtotal(subtotal, rule);
}
