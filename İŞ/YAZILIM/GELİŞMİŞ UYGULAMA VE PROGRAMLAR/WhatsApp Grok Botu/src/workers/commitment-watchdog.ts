import type { Db } from "../db.js";

export function startCommitmentWatchdog(db: Db, signal: AbortSignal): Promise<void> {
  return (async () => {
    while (!signal.aborted) {
      await db.query(
        `INSERT INTO jobs (kind, dedupe_key, conversation_id, payload)
         SELECT 'commitment_due', 'commitment_due:' || c.id, c.conversation_id,
                jsonb_build_object('commitment_id', c.id)
         FROM commitments c
         WHERE c.status = 'open' AND c.due_at <= now()
         ON CONFLICT (dedupe_key) DO NOTHING`,
      );
      await new Promise((resolve) => setTimeout(resolve, 5_000));
    }
  })();
}
