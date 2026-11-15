import type { Db } from "../db.js";
import type { ConversationContext } from "../types.js";

export async function loadConversationContext(db: Db, conversationId: string): Promise<ConversationContext> {
  const conversation = await db.query<{
    id: string;
    status: ConversationContext["status"];
    wa_id: string;
    profile_name: string | null;
  }>(
    `SELECT c.id, c.status, ct.wa_id, ct.profile_name
     FROM conversations c
     JOIN contacts ct ON ct.id = c.contact_id
     WHERE c.id = $1`,
    [conversationId],
  );
  if (conversation.rowCount !== 1) throw new Error(`Conversation not found: ${conversationId}`);

  const [messages, commitments, handoffs] = await Promise.all([
    db.query<{ direction: "inbound" | "outbound"; body: string | null; created_at: Date }>(
      `SELECT direction, body, created_at
       FROM (
         SELECT direction, body, created_at
         FROM messages WHERE conversation_id = $1
         ORDER BY created_at DESC LIMIT 30
       ) recent ORDER BY created_at ASC`,
      [conversationId],
    ),
    db.query<{
      id: string;
      kind: string;
      description: string;
      due_at: Date;
      status: ConversationContext["commitments"][number]["status"];
    }>(
      `SELECT id, kind, description, due_at, status
       FROM commitments
       WHERE conversation_id = $1 AND status = 'open'
       ORDER BY due_at ASC`,
      [conversationId],
    ),
    db.query<{
      id: string;
      reason: string;
      urgency: "normal" | "urgent";
      status: "pending" | "acknowledged";
    }>(
      `SELECT id, reason, urgency, status
       FROM handoffs
       WHERE conversation_id = $1 AND status IN ('pending', 'acknowledged')
       ORDER BY created_at ASC`,
      [conversationId],
    ),
  ]);

  const row = conversation.rows[0]!;
  return {
    conversationId: row.id,
    contactWaId: row.wa_id,
    contactName: row.profile_name,
    status: row.status,
    messages: messages.rows.map((message) => ({
      direction: message.direction,
      body: message.body,
      createdAt: message.created_at.toISOString(),
    })),
    commitments: commitments.rows.map((commitment) => ({
      id: commitment.id,
      kind: commitment.kind,
      description: commitment.description,
      dueAt: commitment.due_at.toISOString(),
      status: commitment.status,
    })),
    pendingHandoffs: handoffs.rows,
  };
}
