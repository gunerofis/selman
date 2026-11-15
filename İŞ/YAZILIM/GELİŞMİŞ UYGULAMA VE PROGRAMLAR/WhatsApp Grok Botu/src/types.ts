export type ConversationStatus = "active" | "waiting_human" | "closed";
export type CommitmentStatus = "open" | "fulfilled" | "failed" | "cancelled";

export interface MetaMessage {
  id?: string;
  from?: string;
  timestamp?: string;
  type?: string;
  text?: { body?: string };
  button?: { text?: string };
  interactive?: {
    button_reply?: { title?: string };
    list_reply?: { title?: string };
  };
  [key: string]: unknown;
}

export interface MetaWebhookPayload {
  object?: string;
  entry?: Array<{
    changes?: Array<{
      field?: string;
      value?: {
        contacts?: Array<{
          wa_id?: string;
          profile?: { name?: string };
        }>;
        messages?: MetaMessage[];
        statuses?: Array<{
          id?: string;
          status?: string;
          timestamp?: string;
          errors?: unknown[];
        }>;
      };
    }>;
  }>;
}

export interface Job {
  id: string;
  kind: "inbound_message" | "commitment_due";
  conversation_id: string;
  payload: Record<string, unknown>;
  attempts: number;
}

export interface ConversationContext {
  conversationId: string;
  contactWaId: string;
  contactName: string | null;
  status: ConversationStatus;
  messages: Array<{
    direction: "inbound" | "outbound";
    body: string | null;
    createdAt: string;
  }>;
  commitments: Array<{
    id: string;
    kind: string;
    description: string;
    dueAt: string;
    status: CommitmentStatus;
  }>;
  pendingHandoffs: Array<{
    id: string;
    reason: string;
    urgency: "normal" | "urgent";
    status: "pending" | "acknowledged";
  }>;
}
