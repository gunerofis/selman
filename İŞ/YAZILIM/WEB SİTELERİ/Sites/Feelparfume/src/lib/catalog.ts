import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { CONCENTRATIONS, FAMILIES, GENDERS, SEASONS } from "./perfume";

export const getCatalog = createServerFn({ method: "GET" }).handler(async () => {
  const { getPublicCatalogServer } = await import("./catalog-db.server");
  return getPublicCatalogServer();
});

const ids = <T extends readonly { id: string }[]>(xs: T) => xs.map((x) => x.id) as [string, ...string[]];

const sizeSchema = z.object({
  ml: z.number().positive().max(5000),
  price: z.number().min(0).max(10_000_000),
  stock: z.number().int().min(0).max(1_000_000),
  sample: z.boolean().optional(),
  gtin: z.string().trim().max(20).optional(),
  batch: z.string().trim().max(40).optional(),
  expiry: z.string().trim().max(20).optional(),
});

export const productSchema = z.object({
  sku: z.string().trim().min(1).max(40).regex(/^[\w.-]+$/, "SKU yalnız harf, rakam, - _ . içerir"),
  slug: z.string().trim().max(120).optional(),
  name: z.string().trim().min(2).max(120),
  brand: z.string().trim().max(80).optional(),
  category: z.string().trim().min(1).max(40),
  gender: z.enum(ids(GENDERS)).optional(),
  concentration: z.enum(ids(CONCENTRATIONS)).optional(),
  families: z.array(z.enum(ids(FAMILIES))).max(8).default([]),
  notes: z
    .object({
      top: z.array(z.string().trim().min(1).max(60)).max(20),
      heart: z.array(z.string().trim().min(1).max(60)).max(20),
      base: z.array(z.string().trim().min(1).max(60)).max(20),
    })
    .optional(),
  longevity: z.number().int().min(1).max(5).optional(),
  sillage: z.number().int().min(1).max(5).optional(),
  seasons: z.array(z.enum(ids(SEASONS))).max(4).default([]),
  year: z.number().int().min(1800).max(2100).optional(),
  perfumer: z.string().trim().max(120).optional(),
  origin: z.string().trim().max(60).optional(),
  ingredients: z.string().trim().max(4000).optional(),
  tagline: z.string().trim().max(200).default(""),
  description: z.string().trim().max(5000).default(""),
  features: z.array(z.string().trim().max(120)).max(20).default([]),
  image: z.string().trim().max(500).default(""),
  images: z.array(z.string().trim().max(500)).max(12).default([]),
  featured: z.boolean().optional(),
  status: z.enum(["active", "draft", "archived"]).default("active"),
  sample: z.boolean().optional(),
  sizes: z.array(sizeSchema).min(1, "En az bir hacim girin").max(12),
});

export type ProductForm = z.input<typeof productSchema>;

export const getAdminProducts = createServerFn({ method: "POST" }).handler(async () => {
  const { requirePermission } = await import("./admin-access.server");
  await requirePermission("products.view");
  const { getAdminProductsServer } = await import("./catalog-db.server");
  return getAdminProductsServer();
});

export const saveProduct = createServerFn({ method: "POST" })
  .validator((input: unknown) => productSchema.parse(input))
  .handler(async ({ data }) => {
    const { requirePermission, logAdminActivity } = await import("./admin-access.server");
    const identity = await requirePermission("products.edit");
    const { upsertProductServer } = await import("./catalog-db.server");
    await upsertProductServer({
      ...data,
      sizes: data.sizes.map((s) => ({ ...s, id: `${s.ml}ml` })),
    } as import("./catalog-db.server").ProductInput);
    await logAdminActivity(identity, {
      permission: "products.edit",
      action: "Ürün kaydedildi",
      resourceType: "product",
      resourceId: data.sku,
      after: { name: data.name, sizes: data.sizes.length },
    });
    return { ok: true as const };
  });

export const setProductStatus = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z.object({ sku: z.string().min(1).max(40), status: z.enum(["active", "draft", "archived"]) }).parse(input),
  )
  .handler(async ({ data }) => {
    const { requirePermission } = await import("./admin-access.server");
    await requirePermission("products.publish");
    const { setProductStatusServer } = await import("./catalog-db.server");
    await setProductStatusServer(data.sku, data.status);
    return { ok: true as const };
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ sku: z.string().min(1).max(40) }).parse(input))
  .handler(async ({ data }) => {
    const { requirePermission } = await import("./admin-access.server");
    await requirePermission("products.delete");
    const { deleteProductServer } = await import("./catalog-db.server");
    await deleteProductServer(data.sku);
    return { ok: true as const };
  });

export const importProductsCsv = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ csv: z.string().min(1).max(5_000_000), dryRun: z.boolean() }).parse(input))
  .handler(async ({ data }) => {
    const { requirePermission } = await import("./admin-access.server");
    await requirePermission("products.import");
    const { csvToProducts } = await import("./catalog-csv");
    const { products, errors } = csvToProducts(data.csv);
    const valid: typeof products = [];
    for (const p of products) {
      const r = productSchema.safeParse(p);
      if (r.success) valid.push(p);
      else errors.push(`${p.sku}: ${r.error.issues.map((i) => `${i.path.join(".")} ${i.message}`).join("; ")}`);
    }
    if (!data.dryRun && errors.length === 0) {
      const { upsertProductServer } = await import("./catalog-db.server");
      for (const p of valid) await upsertProductServer(p);
    }
    return { count: valid.length, variants: valid.reduce((n, p) => n + p.sizes.length, 0), errors, applied: !data.dryRun && errors.length === 0 };
  });

export const exportProductsCsv = createServerFn({ method: "POST" }).handler(async () => {
  const { requirePermission } = await import("./admin-access.server");
  await requirePermission("products.export");
  const { getAdminProductsServer } = await import("./catalog-db.server");
  const { productsToCsv } = await import("./catalog-csv");
  const products = await getAdminProductsServer();
  return productsToCsv(products.map((p) => ({ ...p, sizes: [] })));
});
