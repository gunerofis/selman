import { z } from "zod";

export const reviewInput = z.object({
  orderId: z.string().regex(/^SW-[0-9a-f-]{36}$/i, "Sipariş no geçersiz"),
  email: z.string().trim().email("E-posta geçersiz").max(254),
  sku: z.string().trim().regex(/^[A-Za-z0-9-]{3,40}$/, "Ürün geçersiz"),
  rating: z.number().int().min(1).max(5),
  longevity: z.number().int().min(1).max(5),
  sillage: z.number().int().min(1).max(5),
  season: z.enum(["ilkbahar", "yaz", "sonbahar", "kis"]),
  body: z.string().trim().max(280).default(""),
});

export const batchInput = z.object({
  batch: z.string().trim().min(4, "Parti no geçersiz").max(40),
});

export const skuInput = z.object({
  sku: z.string().trim().regex(/^[A-Za-z0-9-]{3,40}$/),
});
