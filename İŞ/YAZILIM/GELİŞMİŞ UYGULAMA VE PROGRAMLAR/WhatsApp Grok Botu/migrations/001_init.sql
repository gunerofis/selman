CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wa_id text NOT NULL UNIQUE,
  profile_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id uuid NOT NULL REFERENCES contacts(id),
  status text NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'waiting_human', 'closed')),
  opened_at timestamptz NOT NULL DEFAULT now(),
  closed_at timestamptz,
  last_inbound_at timestamptz,
  last_outbound_at timestamptz
);

CREATE UNIQUE INDEX IF NOT EXISTS one_open_conversation_per_contact
  ON conversations(contact_id)
  WHERE status <> 'closed';

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id),
  whatsapp_message_id text NOT NULL UNIQUE,
  direction text NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  message_type text NOT NULL DEFAULT 'text',
  body text,
  delivery_status text,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS messages_conversation_created_idx
  ON messages(conversation_id, created_at DESC);

CREATE TABLE IF NOT EXISTS commitments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id),
  source_message_id uuid REFERENCES messages(id),
  kind text NOT NULL CHECK (kind IN ('product_search', 'follow_up', 'human_handoff', 'other')),
  description text NOT NULL,
  due_at timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'fulfilled', 'failed', 'cancelled')),
  outcome text,
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz
);

CREATE INDEX IF NOT EXISTS commitments_open_due_idx
  ON commitments(due_at)
  WHERE status = 'open';

CREATE TABLE IF NOT EXISTS handoffs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id),
  reason text NOT NULL,
  urgency text NOT NULL DEFAULT 'normal'
    CHECK (urgency IN ('normal', 'urgent')),
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'acknowledged', 'resolved')),
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz
);

CREATE INDEX IF NOT EXISTS handoffs_pending_idx
  ON handoffs(created_at)
  WHERE status IN ('pending', 'acknowledged');

CREATE TABLE IF NOT EXISTS jobs (
  id bigserial PRIMARY KEY,
  kind text NOT NULL CHECK (kind IN ('inbound_message', 'commitment_due')),
  dedupe_key text NOT NULL UNIQUE,
  conversation_id uuid NOT NULL REFERENCES conversations(id),
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'queued'
    CHECK (status IN ('queued', 'processing', 'done', 'failed')),
  run_after timestamptz NOT NULL DEFAULT now(),
  attempts integer NOT NULL DEFAULT 0,
  locked_at timestamptz,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

CREATE INDEX IF NOT EXISTS jobs_claim_idx
  ON jobs(run_after, id)
  WHERE status = 'queued';

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sku text UNIQUE,
  title text NOT NULL,
  description text,
  price numeric(12, 2),
  currency text NOT NULL DEFAULT 'TRY',
  url text,
  attributes jsonb NOT NULL DEFAULT '{}'::jsonb,
  active boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS products_search_idx
  ON products USING gin(to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(description, '')));

CREATE TABLE IF NOT EXISTS audit_events (
  id bigserial PRIMARY KEY,
  conversation_id uuid REFERENCES conversations(id),
  event_type text NOT NULL,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
