import type { Config } from "../config.js";
import type { Db } from "../db.js";
import type { Job } from "../types.js";
import { runGrokForJob } from "../services/grok.js";
import { notifyOwner } from "../services/owner-notify.js";

async function claimJob(db: Db): Promise<Job | null> {
  const result = await db.query<Job>(
    `WITH candidate AS (
       SELECT j.id
       FROM jobs j
       WHERE j.status = 'queued'
         AND j.run_after <= now()
         AND NOT EXISTS (
           SELECT 1 FROM jobs active
           WHERE active.conversation_id = j.conversation_id
             AND active.status = 'processing'
         )
       ORDER BY j.run_after ASC, j.id ASC
       FOR UPDATE SKIP LOCKED
       LIMIT 1
     )
     UPDATE jobs j
     SET status = 'processing', locked_at = now(), attempts = attempts + 1
     FROM candidate
     WHERE j.id = candidate.id
     RETURNING j.id::text, j.kind, j.conversation_id, j.payload, j.attempts`,
  );
  return result.rows[0] ?? null;
}

async function completeJob(db: Db, jobId: string): Promise<void> {
  await db.query(
    `UPDATE jobs SET status = 'done', completed_at = now(), locked_at = NULL WHERE id = $1`,
    [jobId],
  );
}

async function failJob(config: Config, db: Db, job: Job, error: unknown): Promise<void> {
  const message = error instanceof Error ? error.message : String(error);
  if (job.attempts < 5) {
    const delaySeconds = Math.min(60, 2 ** job.attempts);
    await db.query(
      `UPDATE jobs
       SET status = 'queued', run_after = now() + ($2 * interval '1 second'),
           locked_at = NULL, last_error = $3
       WHERE id = $1`,
      [job.id, delaySeconds, message],
    );
    return;
  }

  await db.query(
    `UPDATE jobs SET status = 'failed', locked_at = NULL, last_error = $2 WHERE id = $1`,
    [job.id, message],
  );
  try {
    await notifyOwner(config, {
      event: "bot.job_failed",
      conversation_id: job.conversation_id,
      job_id: job.id,
      error: message,
    });
  } catch (notificationError) {
    console.error("Failed to notify owner about a terminal job failure", notificationError);
  }
}

async function workerLoop(config: Config, db: Db, signal: AbortSignal): Promise<void> {
  while (!signal.aborted) {
    const job = await claimJob(db);
    if (!job) {
      await new Promise((resolve) => setTimeout(resolve, 350));
      continue;
    }

    try {
      await runGrokForJob({ config, db, job });
      await completeJob(db, job.id);
    } catch (error) {
      console.error("Job failed", { jobId: job.id, error });
      await failJob(config, db, job, error);
    }
  }
}

export async function recoverStaleJobs(db: Db): Promise<void> {
  await db.query(
    `UPDATE jobs
     SET status = 'queued', locked_at = NULL, run_after = now(),
         last_error = COALESCE(last_error || E'\n', '') || 'Stale processing job recovered.'
     WHERE status = 'processing' AND locked_at < now() - interval '5 minutes'`,
  );
}

export function startJobWorkers(config: Config, db: Db, signal: AbortSignal): Promise<void>[] {
  return Array.from({ length: config.WORKER_CONCURRENCY }, () => workerLoop(config, db, signal));
}
