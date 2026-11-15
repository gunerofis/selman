import { z } from "zod";
import type { Config } from "../config.js";
import type { Db } from "../db.js";
import { validateOutboundMessage } from "../domain/guardrails.js";
import { loadConversationContext } from "./context.js";
import { notifyOwner } from "./owner-notify.js";
import { sendWhatsAppText } from "./whatsapp.js";

export const toolDefinitions = [
  {
    type: "function",
    name: "search_products",
    description: "Yerel ürün kataloğunda müşterinin gerçek ölçütlerine göre ürün ara. Sonuç yoksa boş liste döner.",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string", description: "Ürün türü ve ayırt edici kelimeler" },
        customer_need: { type: "string", description: "Renk, stil, parça/ölçü ve bütçe dahil doğrulanmış ihtiyaç" },
        max_price: { type: "number", description: "Varsa azami fiyat" },
      },
      required: ["query", "customer_need"],
      additionalProperties: false,
    },
  },
  {
    type: "function",
    name: "create_commitment",
    description: "Müşteriye gelecekte sonuç gönderme sözü vermeden önce zorunlu açık iş oluşturur.",
    parameters: {
      type: "object",
      properties: {
        kind: { type: "string", enum: ["product_search", "follow_up", "other"] },
        description: { type: "string" },
        due_minutes: { type: "integer", minimum: 1, maximum: 5 },
      },
      required: ["kind", "description", "due_minutes"],
      additionalProperties: false,
    },
  },
  {
    type: "function",
    name: "resolve_commitment",
    description: "Açık işi sonuçla kapatır. Sonuç bulunamadığında failed kullan.",
    parameters: {
      type: "object",
      properties: {
        commitment_id: { type: "string" },
        status: { type: "string", enum: ["fulfilled", "failed"] },
        outcome: { type: "string" },
      },
      required: ["commitment_id", "status", "outcome"],
      additionalProperties: false,
    },
  },
  {
    type: "function",
    name: "request_human",
    description: "Yetkili talebi için kalıcı devir kaydı oluşturur ve işletme sahibine bildirim yollar.",
    parameters: {
      type: "object",
      properties: {
        reason: { type: "string" },
        urgency: { type: "string", enum: ["normal", "urgent"] },
      },
      required: ["reason", "urgency"],
      additionalProperties: false,
    },
  },
  {
    type: "function",
    name: "send_whatsapp_message",
    description: "Müşteriye WhatsApp mesajı gönderir. Geleceğe dönük söz varsa açık commitment_id zorunludur.",
    parameters: {
      type: "object",
      properties: {
        text: { type: "string" },
        commitment_id: { type: "string", description: "Mesaj bir söz içeriyorsa ilişkili açık iş kimliği" },
      },
      required: ["text"],
      additionalProperties: false,
    },
  },
  {
    type: "function",
    name: "close_conversation",
    description: "Yalnız açık iş ve bekleyen yetkili devri kalmadığında konuşmayı kapatır.",
    parameters: {
      type: "object",
      properties: { reason: { type: "string" } },
      required: ["reason"],
      additionalProperties: false,
    },
  },
] as const;

const searchSchema = z.object({
  query: z.string().min(1),
  customer_need: z.string().min(1),
  max_price: z.number().positive().optional(),
});
const commitmentSchema = z.object({
  kind: z.enum(["product_search", "follow_up", "other"]),
  description: z.string().min(3),
  due_minutes: z.number().int().min(1).max(5),
});
const resolveSchema = z.object({
  commitment_id: z.string().uuid(),
  status: z.enum(["fulfilled", "failed"]),
  outcome: z.string().min(1),
});
const handoffSchema = z.object({
  reason: z.string().min(3),
  urgency: z.enum(["normal", "urgent"]),
});
const sendSchema = z.object({
  text: z.string().min(1).max(4096),
  commitment_id: z.string().uuid().optional(),
});
const closeSchema = z.object({ reason: z.string().min(1) });

export interface ToolExecutionResult {
  output: Record<string, unknown>;
  sentMessage: boolean;
}

export async function executeAgentTool(input: {
  config: Config;
  db: Db;
  conversationId: string;
  triggerKind: "inbound_message" | "commitment_due";
  name: string;
  argumentsJson: string;
}): Promise<ToolExecutionResult> {
  const parsed = JSON.parse(input.argumentsJson) as unknown;

  switch (input.name) {
    case "search_products": {
      const args = searchSchema.parse(parsed);
      const result = await input.db.query<{
        id: string;
        sku: string | null;
        title: string;
        description: string | null;
        price: string | null;
        currency: string;
        url: string | null;
        attributes: Record<string, unknown>;
      }>(
        `SELECT id, sku, title, description, price, currency, url, attributes
         FROM products
         WHERE active = true
           AND to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(description, ''))
               @@ plainto_tsquery('simple', $1)
           AND ($2::numeric IS NULL OR price <= $2::numeric)
         ORDER BY ts_rank(
           to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(description, '')),
           plainto_tsquery('simple', $1)
         ) DESC, price ASC NULLS LAST
         LIMIT 8`,
        [args.query, args.max_price ?? null],
      );
      await input.db.query(
        `INSERT INTO audit_events (conversation_id, event_type, data)
         VALUES ($1, 'products.searched', $2::jsonb)`,
        [input.conversationId, JSON.stringify({ ...args, result_count: result.rowCount })],
      );
      return { output: { products: result.rows, customer_need: args.customer_need }, sentMessage: false };
    }

    case "create_commitment": {
      if (input.triggerKind === "commitment_due") {
        return {
          output: { ok: false, error: "Son tarihi gelen bir iş için yeni süre sözü oluşturulamaz." },
          sentMessage: false,
        };
      }
      const args = commitmentSchema.parse(parsed);
      const dueMinutes = Math.min(args.due_minutes, input.config.PROMISE_DEADLINE_MINUTES);
      const result = await input.db.query<{ id: string; due_at: Date }>(
        `INSERT INTO commitments (conversation_id, kind, description, due_at)
         VALUES ($1, $2, $3, now() + ($4 * interval '1 minute'))
         RETURNING id, due_at`,
        [input.conversationId, args.kind, args.description, dueMinutes],
      );
      const row = result.rows[0]!;
      return {
        output: { commitment_id: row.id, due_at: row.due_at.toISOString(), status: "open" },
        sentMessage: false,
      };
    }

    case "resolve_commitment": {
      const args = resolveSchema.parse(parsed);
      const result = await input.db.query(
        `UPDATE commitments
         SET status = $3, outcome = $4, resolved_at = now()
         WHERE id = $1 AND conversation_id = $2 AND status = 'open'`,
        [args.commitment_id, input.conversationId, args.status, args.outcome],
      );
      return {
        output: result.rowCount === 1 ? { ok: true } : { ok: false, error: "Açık iş bulunamadı." },
        sentMessage: false,
      };
    }

    case "request_human": {
      const args = handoffSchema.parse(parsed);
      const existing = await input.db.query<{ id: string }>(
        `SELECT id FROM handoffs
         WHERE conversation_id = $1 AND status IN ('pending', 'acknowledged')
         ORDER BY created_at DESC LIMIT 1`,
        [input.conversationId],
      );
      let handoffId = existing.rows[0]?.id;
      if (!handoffId) {
        const handoff = await input.db.query<{ id: string }>(
          `INSERT INTO handoffs (conversation_id, reason, urgency)
           VALUES ($1, $2, $3) RETURNING id`,
          [input.conversationId, args.reason, args.urgency],
        );
        handoffId = handoff.rows[0]!.id;
        await input.db.query(
          `UPDATE conversations SET status = 'waiting_human' WHERE id = $1`,
          [input.conversationId],
        );
        await input.db.query(
          `INSERT INTO commitments (conversation_id, kind, description, due_at)
           VALUES ($1, 'human_handoff', $2, now() + ($3 * interval '1 minute'))`,
          [input.conversationId, args.reason, input.config.PROMISE_DEADLINE_MINUTES],
        );
      }

      const context = await loadConversationContext(input.db, input.conversationId);
      const ownerNotified = await notifyOwner(input.config, {
        event: "human_handoff.requested",
        handoff_id: handoffId,
        conversation_id: input.conversationId,
        customer: { wa_id: context.contactWaId, name: context.contactName },
        reason: args.reason,
        urgency: args.urgency,
      });
      return {
        output: { handoff_id: handoffId, status: "pending", owner_notified: ownerNotified },
        sentMessage: false,
      };
    }

    case "send_whatsapp_message": {
      const args = sendSchema.parse(parsed);
      const context = await loadConversationContext(input.db, input.conversationId);
      const validation = validateOutboundMessage({
        text: args.text,
        commitmentId: args.commitment_id,
        openCommitmentIds: context.commitments.map((item) => item.id),
        hasPendingHandoff: context.pendingHandoffs.length > 0,
      });
      if (!validation.ok) return { output: { ok: false, error: validation.reason }, sentMessage: false };

      const sent = await sendWhatsAppText({
        config: input.config,
        db: input.db,
        conversationId: input.conversationId,
        to: context.contactWaId,
        text: args.text,
      });
      return { output: { ok: true, whatsapp_message_id: sent.whatsappMessageId }, sentMessage: true };
    }

    case "close_conversation": {
      const args = closeSchema.parse(parsed);
      const context = await loadConversationContext(input.db, input.conversationId);
      if (context.commitments.length > 0 || context.pendingHandoffs.length > 0) {
        return {
          output: { ok: false, error: "Açık iş veya bekleyen yetkili devri varken konuşma kapatılamaz." },
          sentMessage: false,
        };
      }
      await input.db.query(
        `UPDATE conversations SET status = 'closed', closed_at = now() WHERE id = $1`,
        [input.conversationId],
      );
      await input.db.query(
        `INSERT INTO audit_events (conversation_id, event_type, data)
         VALUES ($1, 'conversation.closed', $2::jsonb)`,
        [input.conversationId, JSON.stringify({ reason: args.reason })],
      );
      return { output: { ok: true }, sentMessage: false };
    }

    default:
      return { output: { ok: false, error: `Bilinmeyen araç: ${input.name}` }, sentMessage: false };
  }
}
