import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { LineDef } from "./line-items";

export type ProductStatus = "active" | "inactive" | "archived";

export type AdminCatalogItem = {
  productKey: string;
  lineKey: LineDef["key"];
  lineTitle: string;
  id: string;
  image: string;
  baseName: string;
  basePrice: number | null;
  name: string;
  price: number | null;
  status: ProductStatus;
  updatedAt: string | null;
  seoTitle: string;
  seoDescription: string;
  imageAlt: string;
};

export type AdminAuditEntry = {
  id: string;
  productKey: string;
  action: string;
  beforeState: Record<string, string | number | boolean | null> | null;
  afterState: Record<string, string | number | boolean | null> | null;
  actor: string;
  createdAt: string;
};

export const getPublicLines = createServerFn({ method: "GET" }).handler(async () => {
  const { getPublicLinesServer } = await import("./catalog-admin.server");
  return getPublicLinesServer();
});

export const getAdminSession = createServerFn({ method: "GET" }).handler(async () => {
  const { getAdminSessionServer } = await import("./catalog-admin.server");
  return getAdminSessionServer();
});

const loginSchema = z.object({
  username: z.string().trim().max(60).optional(),
  password: z.string().min(1).max(256),
  otp: z.string().trim().max(12).optional(),
});

export const adminLogin = createServerFn({ method: "POST" })
  .validator((input: unknown) => loginSchema.parse(input))
  .handler(async ({ data }) => {
    const { adminLoginServer } = await import("./catalog-admin.server");
    return adminLoginServer(data);
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const { adminLogoutServer } = await import("./catalog-admin.server");
  return adminLogoutServer();
});

export const getAdminCatalog = createServerFn({ method: "GET" }).handler(
  async (): Promise<AdminCatalogItem[]> => {
    const { getAdminCatalogServer } = await import("./catalog-admin.server");
    return getAdminCatalogServer();
  },
);

export const getAdminAudit = createServerFn({ method: "GET" }).handler(
  async (): Promise<AdminAuditEntry[]> => {
    const { getAdminAuditServer } = await import("./catalog-admin.server");
    return getAdminAuditServer();
  },
);

const updateSchema = z.object({
  productKey: z.string().min(3).max(180),
  name: z.string().trim().min(2).max(120),
  price: z.number().min(0).max(99_999_999).nullable(),
  status: z.enum(["active", "inactive", "archived"]),
  seoTitle: z.string().trim().max(70),
  seoDescription: z.string().trim().max(170),
  imageAlt: z.string().trim().min(2).max(160),
});

export type UpdateAdminProductInput = z.infer<typeof updateSchema>;

export const updateAdminProduct = createServerFn({ method: "POST" })
  .validator((input: unknown) => updateSchema.parse(input))
  .handler(async ({ data }) => {
    const { updateAdminProductServer } = await import("./catalog-admin.server");
    return updateAdminProductServer(data);
  });

const bulkStatusSchema = z.object({
  productKeys: z.array(z.string().min(3).max(180)).min(1).max(100),
  status: z.enum(["active", "inactive", "archived"]),
});

export type BulkStatusInput = z.infer<typeof bulkStatusSchema>;

export const bulkUpdateAdminProducts = createServerFn({ method: "POST" })
  .validator((input: unknown) => bulkStatusSchema.parse(input))
  .handler(async ({ data }) => {
    const { bulkUpdateAdminProductsServer } = await import("./catalog-admin.server");
    return bulkUpdateAdminProductsServer(data);
  });
