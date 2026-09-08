import type { StoreProduct } from "./store";
import { conceptWallModels } from "./product-wall-concepts";

export const PRODUCT_WALL_SETTING_KEY = "productWallModelOrder";
export const WALL_COLORS = [
  { name: "Krem", slug: "krem", hex: "#e8dccb" },
  { name: "Kahve", slug: "kahve", hex: "#76513d" },
  { name: "Bordo", slug: "bordo", hex: "#6f2634" },
  { name: "Taba", slug: "taba", hex: "#b87842" },
  { name: "Siyah", slug: "siyah", hex: "#211b18" },
] as const;
export type WallColor = (typeof WALL_COLORS)[number]["slug"];
export type WallVariant = { slug: string; name: string; color: string; primaryImage: string; priceCents: number | null; href: string };
export type WallProductModel = { key: string; name: string; description: string; concept: boolean; featured: boolean; variants: Record<WallColor, WallVariant> };

export function wallModelKey(value: string) {
  return value.toLocaleLowerCase("tr-TR").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ı/g, "i").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function parseProductWallOrder(value: string | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function colorSlug(value: string): WallColor | null {
  const normalized = wallModelKey(value);
  return WALL_COLORS.find((color) => color.slug === normalized)?.slug || null;
}

export function buildProductWallModels(products: StoreProduct[]): WallProductModel[] {
  const groups = new Map<string, StoreProduct[]>();
  for (const product of products.filter((item) => item.active && item.primaryImage)) {
    const key = wallModelKey(product.model);
    groups.set(key, [...(groups.get(key) || []), product]);
  }
  const realModels: WallProductModel[] = [];
  for (const [key, productsInModel] of groups) {
    const variants = {} as Record<WallColor, WallVariant>;
    for (const product of productsInModel) {
      const slug = colorSlug(product.color);
      if (slug) variants[slug] = { slug: product.slug, name: product.name, color: product.color, primaryImage: product.primaryImage, priceCents: product.priceCents, href: `/urun/${product.slug}` };
    }
    if (!WALL_COLORS.every((color) => variants[color.slug])) continue;
    const first = productsInModel[0];
    realModels.push({ key, name: first.model, description: first.shortDescription, concept: false, featured: productsInModel.some((product) => product.featured), variants });
  }
  return [...realModels, ...conceptWallModels].slice(0, 20);
}

export function applyProductWallOrder(models: WallProductModel[], value: string | undefined): WallProductModel[] {
  const byKey = new Map(models.map((model) => [model.key, model]));
  const used = new Set<string>();
  const ordered: WallProductModel[] = [];

  for (const key of parseProductWallOrder(value)) {
    const model = byKey.get(key);
    if (model && !used.has(key)) {
      ordered.push(model);
      used.add(key);
    }
  }
  for (const model of models) if (!used.has(model.key)) ordered.push(model);
  return ordered;
}

export function randomizeProductWall(models: WallProductModel[]): WallProductModel[] {
  const featured = models.find((model) => model.featured) || models[0];
  const rest = models.filter((model) => model.key !== featured?.key);
  for (let index = rest.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [rest[index], rest[target]] = [rest[target], rest[index]];
  }
  return featured ? [featured, ...rest] : rest;
}
