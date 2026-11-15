import type { Db } from "../db.js";
import type { MetaMessage, MetaWebhookPayload } from "../types.js";

function extractText(message: MetaMessage): string {
  if (message.text?.body) return message.text.body;
  if (message.button?.text) return message.button.text;
  if (message.interactive?.button_reply?.title) return message.interactive.button_reply.title;
  if (message.interactive?.list_reply?.title) return message.interactive.list_reply.title;
  return `[${message.type ?? "unknown"} mesajı]`;
}

export async function ingestMetaWebhook(db: Db, payload: MetaWebhookPayload): Promise<void> {
  for (const entry of payload.entry ?? []) {
    for (const change of entry.changes ?? []) {
      const value = change.value;
      if (!value) continue;

      for (const status of value.statuses ?? []) {
        if (!status.id || !status.status) continue;
        await db.query(
          `UPDATE messages
             SET delivery_status = $2,
                 payload = payload || $3::jsonb
           WHERE whatsapp_message_id = $1`,
          [status.id, status.status, JSON.stringify({ latest_status: status })],
        );
      }

      const profileName = value.contacts?.[0]?.profile?.name ?? null;
      const contactWaId = value.contacts?.[0]?.wa_id;

      for (const message of value.messages ?? []) {
        const waId = message.from ?? contactWaId;
        if (!message.id || !waId) continue;

        const client = await db.connect();
        try {
          await client.query("BEGIN");
          const contactResult = await client.query<{ id: string }>(
            `INSERT INTO contacts (wa_id, profile_name)
             VALUES ($1, $2)
             ON CONFLICT (wa_id) DO UPDATE
               SET profile_name = COALESCE(EXCLUDED.profile_name, contacts.profile_name),
                   updated_at = now()
             RETURNING id`,
            [waId, profileName],
          );
          const contactId = contactResult.rows[0]!.id;

          await client.query("SELECT id FROM contacts WHERE id = $1 FOR UPDATE", [contactId]);
          let conversationResult = await client.query<{ id: string }>(
            `SELECT id FROM conversations
             WHERE contact_id = $1 AND status <> 'closed'
             ORDER BY opened_at DESC LIMIT 1`,
            [contactId],
          );

          if (conversationResult.rowCount === 0) {
            conversationResult = await client.query<{ id: string }>(
              `INSERT INTO conversations (contact_id, status, last_inbound_at)
               VALUES ($1, 'active', now()) RETURNING id`,
              [contactId],
            );
          }

          const conversationId = conversationResult.rows[0]!.id;
          const messageResult = await client.query<{ id: string }>(
            `INSERT INTO messages
               (conversation_id, whatsapp_message_id, direction, message_type, body, payload)
             VALUES ($1, $2, 'inbound', $3, $4, $5::jsonb)
             ON CONFLICT (whatsapp_message_id) DO NOTHING
             RETURNING id`,
            [conversationId, message.id, message.type ?? "unknown", extractText(message), JSON.stringify(message)],
          );

          if (messageResult.rowCount === 1) {
            await client.query(
              `UPDATE conversations
               SET status = CASE WHEN status = 'waiting_human' THEN status ELSE 'active' END,
                   last_inbound_at = now()
               WHERE id = $1`,
              [conversationId],
            );
            await client.query(
              `INSERT INTO jobs (kind, dedupe_key, conversation_id, payload)
               VALUES ('inbound_message', $1, $2, $3::jsonb)
               ON CONFLICT (dedupe_key) DO NOTHING`,
              [`inbound:${message.id}`, conversationId, JSON.stringify({ message_id: messageResult.rows[0]!.id })],
            );
            await client.query(
              `INSERT INTO audit_events (conversation_id, event_type, data)
               VALUES ($1, 'message.received', $2::jsonb)`,
              [conversationId, JSON.stringify({ whatsapp_message_id: message.id })],
            );
          }

          await client.query("COMMIT");
        } catch (error) {
          await client.query("ROLLBACK");
          throw error;
        } finally {
          client.release();
        }
      }
    }
  }
}
