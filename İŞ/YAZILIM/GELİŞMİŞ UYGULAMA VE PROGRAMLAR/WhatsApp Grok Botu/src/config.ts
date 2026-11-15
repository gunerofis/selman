import { z } from "zod";

const booleanFromString = z
  .enum(["true", "false"])
  .default("false")
  .transform((value) => value === "true");

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  LOG_LEVEL: z.string().default("info"),
  DATABASE_URL: z.string().min(1),
  META_GRAPH_VERSION: z.string().default("v23.0"),
  META_VERIFY_TOKEN: z.string().min(1),
  META_APP_SECRET: z.string().default(""),
  META_ACCESS_TOKEN: z.string().default(""),
  META_PHONE_NUMBER_ID: z.string().default(""),
  XAI_API_KEY: z.string().default(""),
  XAI_MODEL: z.string().default("grok-4.7"),
  XAI_BASE_URL: z.string().url().default("https://api.x.ai/v1"),
  ADMIN_TOKEN: z.string().min(16),
  OWNER_WEBHOOK_URL: z.union([z.literal(""), z.string().url()]).default(""),
  PROMISE_DEADLINE_MINUTES: z.coerce.number().int().min(1).max(5).default(5),
  WORKER_CONCURRENCY: z.coerce.number().int().min(1).max(20).default(4),
  DRY_RUN: booleanFromString,
});

export type Config = z.infer<typeof schema>;

export function loadConfig(environment: NodeJS.ProcessEnv = process.env): Config {
  return schema.parse(environment);
}
