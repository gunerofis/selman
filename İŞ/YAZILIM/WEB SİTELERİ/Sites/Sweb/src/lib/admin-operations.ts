import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const ADMIN_RECORD_MODULES = [
  "quotes",
  "custom_production",
  "customers",
  "companies",
  "inventory",
  "warehouses",
  "production",
  "shipping",
  "pricing",
  "discounts",
  "blog",
  "reviews",
  "forms",
  "newsletter",
  "finance",
  "payment_settings",
  "delivery_settings",
  "tax",
  "domain",
  "integrations",
  "pixels",
  "media",
] as const;

export type AdminRecordModule = (typeof ADMIN_RECORD_MODULES)[number];
export type AdminRecordValue = string | number | boolean | null;
export type AdminRecord = {
  id: string;
  module: AdminRecordModule;
  title: string;
  reference: string | null;
  status: string;
  data: Record<string, AdminRecordValue>;
  ownerId: string | null;
  assignedId: string | null;
  category: string | null;
  warehouse: string | null;
  brand: string | null;
  customerGroup: string | null;
  salesChannel: string | null;
  createdAt: string;
  updatedAt: string;
};

const moduleSchema = z.enum(ADMIN_RECORD_MODULES);
const scalar = z.union([z.string().max(4000), z.number().finite(), z.boolean(), z.null()]);
const recordInput = z.object({
  id: z.string().uuid().optional(),
  module: moduleSchema,
  title: z.string().trim().min(2).max(160),
  reference: z.string().trim().max(80).optional().or(z.literal("")),
  status: z.string().trim().min(2).max(40).regex(/^[a-z0-9_]+$/),
  data: z.record(z.string().max(60), scalar).refine((value) => Object.keys(value).length <= 30),
  assignedId: z.string().uuid().nullable().optional(),
  category: z.string().trim().max(100).optional().or(z.literal("")),
  warehouse: z.string().trim().max(100).optional().or(z.literal("")),
  brand: z.string().trim().max(100).optional().or(z.literal("")),
  customerGroup: z.string().trim().max(100).optional().or(z.literal("")),
  salesChannel: z.string().trim().max(100).optional().or(z.literal("")),
});

export type SaveAdminRecordInput = z.infer<typeof recordInput>;

export const getAdminOperations = createServerFn({ method: "GET" }).handler(async () => {
  const { getAdminOperationsServer } = await import("./admin-operations.server");
  return getAdminOperationsServer();
});

export const saveAdminRecord = createServerFn({ method: "POST" })
  .validator((input: unknown) => recordInput.parse(input))
  .handler(async ({ data }) => {
    const { saveAdminRecordServer } = await import("./admin-operations.server");
    return saveAdminRecordServer(data);
  });

export const deleteAdminRecord = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z.object({ id: z.string().uuid(), module: moduleSchema }).parse(input),
  )
  .handler(async ({ data }) => {
    const { deleteAdminRecordServer } = await import("./admin-operations.server");
    return deleteAdminRecordServer(data);
  });
