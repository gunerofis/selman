import type { FastifyInstance } from "fastify";
import type { Config } from "../config.js";
import type { Db } from "../db.js";
import { verifyMetaSignature } from "../security/meta-signature.js";
import { ingestMetaWebhook } from "../services/webhook-ingest.js";
import type { MetaWebhookPayload } from "../types.js";

interface VerifyQuery {
  "hub.mode"?: string;
  "hub.verify_token"?: string;
  "hub.challenge"?: string;
}

export function registerWebhookRoutes(app: FastifyInstance, config: Config, db: Db): void {
  app.get<{ Querystring: VerifyQuery }>("/webhooks/whatsapp", async (request, reply) => {
    const query = request.query;
    if (query["hub.mode"] === "subscribe" && query["hub.verify_token"] === config.META_VERIFY_TOKEN) {
      return reply.type("text/plain").send(query["hub.challenge"] ?? "");
    }
    return reply.code(403).send({ error: "Webhook doğrulaması başarısız." });
  });

  app.post<{ Body: MetaWebhookPayload }>("/webhooks/whatsapp", async (request, reply) => {
    const rawBody = (request as typeof request & { rawBody?: Buffer }).rawBody;
    const signature = request.headers["x-hub-signature-256"];
    const signatureValue = Array.isArray(signature) ? signature[0] : signature;

    if (!rawBody || !verifyMetaSignature(rawBody, signatureValue, config.META_APP_SECRET)) {
      return reply.code(401).send({ error: "Geçersiz webhook imzası." });
    }

    await ingestMetaWebhook(db, request.body);
    return reply.code(200).send({ received: true });
  });
}
