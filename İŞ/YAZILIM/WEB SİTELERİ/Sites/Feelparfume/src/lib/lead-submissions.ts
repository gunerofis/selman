import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const LEAD_TYPES = [
  "contact",
  "quote",
  "complaint",
  "visit",
  "newsletter",
  "withdrawal",
  "design",
] as const;

const leadInput = z.object({
  type: z.enum(LEAD_TYPES),
  title: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(254),
  trap: z.string().max(200).optional(),
  data: z
    .record(z.string().max(60), z.union([z.string().max(4000), z.number().finite(), z.boolean()]))
    .refine((value) => Object.keys(value).length <= 30),
});

export const submitLead = createServerFn({ method: "POST" })
  .validator((input: unknown) => leadInput.parse(input))
  .handler(async ({ data }) => {
    const { submitLeadServer } = await import("./lead-submissions.server");
    return submitLeadServer(data);
  });
