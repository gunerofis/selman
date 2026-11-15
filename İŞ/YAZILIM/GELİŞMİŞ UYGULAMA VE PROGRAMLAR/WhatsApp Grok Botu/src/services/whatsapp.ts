import { randomUUID } from "node:crypto";
import type { Config } from "../config.js";
import type { Db } from "../db.js";

interface MetaSendResponse {
  messages?: Array<{ id?: string }>;
  error?: { message?: string; code?: number };
}

export async function sendWhatsAppText(input: {
  config: Config;
  db: Db;
  conversationId: string;
  to: string;
  text: string;
}): Promise<{ whatsappMessageId: string }> {
  let whatsappMessageId: string;
  let rawResponse: unknown;

  if (input.config.DRY_RUN) {
    whatsappMessageId = `dryrun:${randomUUID()}`;
    rawResponse = { dry_run: true };
  } else {
    if (!input.config.META_ACCESS_TOKEN || !input.config.META_PHONE_NUMBER_ID) {
      throw new Error("META_ACCESS_TOKEN ve META_PHONE_NUMBER_ID zorunludur.");
    }

    const response = await fetch(
      `https://graph.facebook.com/${input.config.META_GRAPH_VERSION}/${input.config.META_PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${input.config.META_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: input.to,
          type: "text",
          text: { preview_url: false, body: input.text },
        }),
        signal: AbortSignal.timeout(15_000),
      },
    );

    const result = (await response.json()) as MetaSendResponse;
    if (!response.ok || !result.messages?.[0]?.id) {
      throw new Error(`WhatsApp gönderimi başarısız: ${result.error?.message ?? response.statusText}`);
    }
    whatsappMessageId = result.messages[0].id;
    rawResponse = result;
  }

  await input.db.query(
    `INSERT INTO messages
       (conversation_id, whatsapp_message_id, direction, message_type, body, delivery_status, payload)
     VALUES ($1, $2, 'outbound', 'text', $3, 'sent', $4::jsonb)`,
    [input.conversationId, whatsappMessageId, input.text, JSON.stringify(rawResponse)],
  );
  await input.db.query(
    `UPDATE conversations SET last_outbound_at = now() WHERE id = $1`,
    [input.conversationId],
  );
  await input.db.query(
    `INSERT INTO audit_events (conversation_id, event_type, data)
     VALUES ($1, 'message.sent', $2::jsonb)`,
    [input.conversationId, JSON.stringify({ whatsapp_message_id: whatsappMessageId, text: input.text })],
  );

  return { whatsappMessageId };
}
