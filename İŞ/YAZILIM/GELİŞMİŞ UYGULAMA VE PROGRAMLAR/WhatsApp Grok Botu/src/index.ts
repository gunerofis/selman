import Fastify from "fastify";
import rawBody from "fastify-raw-body";
import { loadConfig } from "./config.js";
import { createDb } from "./db.js";
import { registerInternalRoutes } from "./routes/internal.js";
import { registerWebhookRoutes } from "./routes/webhook.js";
import { startCommitmentWatchdog } from "./workers/commitment-watchdog.js";
import { recoverStaleJobs, startJobWorkers } from "./workers/job-worker.js";

const config = loadConfig();

if (config.NODE_ENV === "production") {
  const missing = [
    ["META_APP_SECRET", config.META_APP_SECRET],
    ["META_ACCESS_TOKEN", config.META_ACCESS_TOKEN],
    ["META_PHONE_NUMBER_ID", config.META_PHONE_NUMBER_ID],
    ["XAI_API_KEY", config.XAI_API_KEY],
  ].filter(([, value]) => !value).map(([name]) => name);
  if (config.DRY_RUN || missing.length > 0) {
    throw new Error(`Production yapılandırması eksik: ${[...missing, ...(config.DRY_RUN ? ["DRY_RUN=false"] : [])].join(", ")}`);
  }
}

const db = createDb(config.DATABASE_URL);
const app = Fastify({ logger: { level: config.LOG_LEVEL } });
await app.register(rawBody, {
  field: "rawBody",
  global: true,
  encoding: false,
  runFirst: true,
});

app.get("/health", async (_request, reply) => {
  try {
    await db.query("SELECT 1");
    return { ok: true };
  } catch {
    return reply.code(503).send({ ok: false });
  }
});

registerWebhookRoutes(app, config, db);
registerInternalRoutes(app, config, db);

await recoverStaleJobs(db);
const controller = new AbortController();
const backgroundTasks = [
  ...startJobWorkers(config, db, controller.signal),
  startCommitmentWatchdog(db, controller.signal),
];

async function shutdown(): Promise<void> {
  controller.abort();
  await app.close();
  await Promise.allSettled(backgroundTasks);
  await db.end();
}

process.once("SIGINT", () => void shutdown());
process.once("SIGTERM", () => void shutdown());

await app.listen({ host: "0.0.0.0", port: config.PORT });
