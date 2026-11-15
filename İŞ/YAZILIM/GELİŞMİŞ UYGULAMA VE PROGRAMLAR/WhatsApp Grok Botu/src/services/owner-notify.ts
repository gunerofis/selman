import type { Config } from "../config.js";

export async function notifyOwner(config: Config, payload: Record<string, unknown>): Promise<boolean> {
  if (!config.OWNER_WEBHOOK_URL) return false;

  const response = await fetch(config.OWNER_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`Yetkili bildirimi başarısız: ${response.status} ${response.statusText}`);
  }
  return true;
}
