import { z } from "zod";
import { isPostalCode, isTurkishPhone } from "./commerce";
import { isTurkeyCity } from "./shipping";

const sku = z.string().trim().regex(/^[A-Za-z0-9-]{3,40}$/);

export const registerInput = z.object({
  email: z.string().trim().email("E-posta geçersiz").max(254),
  password: z.string().min(8, "Şifre en az 8 karakter.").max(72, "Şifre en fazla 72 karakter."),
  birthMonth: z.number().int().min(1).max(12).nullable().optional(),
  birthDay: z.number().int().min(1).max(31).nullable().optional(),
  skus: z.array(sku).max(40).optional(),
});

export const loginInput = z.object({
  email: z.string().trim().email("E-posta geçersiz").max(254),
  password: z.string().min(1).max(72),
});

export const profileInput = z.object({
  birthMonth: z.number().int().min(1).max(12).nullable().optional(),
  birthDay: z.number().int().min(1).max(31).nullable().optional(),
  consentStock: z.boolean().optional(),
  consentPrice: z.boolean().optional(),
  consentBottle: z.boolean().optional(),
  skus: z.array(sku).max(40).optional(),
});

export const addressInput = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().max(30).refine(isTurkishPhone),
  city: z.string().trim().refine(isTurkeyCity),
  district: z.string().trim().min(2).max(80),
  postal: z.string().trim().refine(isPostalCode),
  address: z.string().trim().min(10).max(600),
});

export const addressIdInput = z.object({
  id: z.string().trim().min(3).max(80),
});

export const wishInput = z.object({
  sku,
});

export type RegisterInput = z.infer<typeof registerInput>;
export type LoginInput = z.infer<typeof loginInput>;
export type ProfileInput = z.infer<typeof profileInput>;
export type AddressInput = z.infer<typeof addressInput>;
