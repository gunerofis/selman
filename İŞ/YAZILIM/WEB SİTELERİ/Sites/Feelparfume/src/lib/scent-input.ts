import { z } from "zod";
import { FAMILIES } from "./perfume";

const familyIds = FAMILIES.map((family) => family.id) as [string, ...string[]];

export const scentInput = z.object({
  id: z.string().regex(/^SQ-[0-9a-f-]{36}$/i),
  email: z.string().trim().email().max(254).optional(),
  answers: z.object({
    kim: z.enum(["kadin", "erkek", "unisex", "hepsi"]),
    his: z.enum(familyIds),
    zaman: z.enum(["gunduz", "aksam", "hergun"]),
    guc: z.union([z.literal(1), z.literal(2), z.literal(3)]),
    mevsim: z.enum(["ilkbahar", "yaz", "sonbahar", "kis"]),
    nota: z.enum(["Gül", "Vanilya", "Bergamot", "Sedir", "Misk"]),
  }),
  skus: z.array(z.string().trim().min(1).max(40)).max(8),
});
