import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import type { Config } from "../config.js";
import type { Db } from "../db.js";
import { sendWhatsAppText } from "../services/whatsapp.js";

function authorize(config: Config, request: FastifyRequest, reply: FastifyReply): boolean {
  if (request.headers.authorization !== `Bearer ${config.ADMIN_TOKEN}`) {
    void reply.code(401).send({ error: "Yetkisiz." });
    return false;
  }
  return true;
}

export function registerInternalRoutes(app: FastifyInstance, config: Config, db: Db): void {
  app.get("/internal/open-work", async (request, reply) => {
    if (!authorize(config, request, reply)) return;

    const [commitments, handoffs] = await Promise.all([
      db.query(
        `SELECT c.id, c.conversation_id, c.kind, c.description, c.due_at, c.status,
                ct.wa_id, ct.profile_name
         FROM commitments c
         JOIN conversations conv ON conv.id = c.conversation_id
         JOIN contacts ct ON ct.id = conv.contact_id
         WHERE c.status = 'open'
         ORDER BY c.due_at ASC`,
      ),
      db.query(
        `SELECT h.id, h.conversation_id, h.reason, h.urgency, h.status, h.created_at,
                ct.wa_id, ct.profile_name
         FROM handoffs h
         JOIN conversations conv ON conv.id = h.conversation_id
         JOIN contacts ct ON ct.id = conv.contact_id
         WHERE h.status IN ('pending', 'acknowledged')
         ORDER BY h.created_at ASC`,
      ),
    ]);
    return { commitments: commitments.rows, handoffs: handoffs.rows };
  });

  app.post<{
    Params: { id: string };
    Body: { response_text: string; outcome?: string };
  }>("/internal/handoffs/:id/resolve", async (request, reply) => {
    if (!authorize(config, request, reply)) return;
    if (!request.body?.response_text?.trim()) {
      return reply.code(400).send({ error: "response_text zorunludur." });
    }

    const handoff = await db.query<{
      conversation_id: string;
      wa_id: string;
      status: string;
    }>(
      `SELECT h.conversation_id, ct.wa_id, h.status
       FROM handoffs h
       JOIN conversations conv ON conv.id = h.conversation_id
       JOIN contacts ct ON ct.id = conv.contact_id
       WHERE h.id = $1`,
      [request.params.id],
    );
    const row = handoff.rows[0];
    if (!row) return reply.code(404).send({ error: "Yetkili devri bulunamadı." });
    if (row.status === "resolved") return reply.code(409).send({ error: "Yetkili devri zaten kapatılmış." });

    const sent = await sendWhatsAppText({
      config,
      db,
      conversationId: row.conversation_id,
      to: row.wa_id,
      text: request.body.response_text.trim(),
    });

    const client = await db.connect();
    try {
      await client.query("BEGIN");
      await client.query(
        `UPDATE handoffs SET status = 'resolved', resolved_at = now() WHERE id = $1`,
        [request.params.id],
      );
      await client.query(
        `UPDATE commitments
         SET status = 'fulfilled', outcome = $2, resolved_at = now()
         WHERE conversation_id = $1 AND kind = 'human_handoff' AND status = 'open'`,
        [row.conversation_id, request.body.outcome ?? "Yetkili müşteriye yanıt verdi."],
      );
      await client.query(
        `UPDATE conversations SET status = 'active' WHERE id = $1 AND status = 'waiting_human'`,
        [row.conversation_id],
      );
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }

    return { ok: true, whatsapp_message_id: sent.whatsappMessageId };
  });
}
