import { allowed, config, digest, equal, reply } from "@/lib/meta";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const c = config(), q = new URL(request.url).searchParams;
  if (!c.META_VERIFY_TOKEN) return reply("Unavailable", 503);
  if (q.get("hub.mode") !== "subscribe" || !await equal(q.get("hub.verify_token") || "", c.META_VERIFY_TOKEN)) return reply("Forbidden", 403);
  const challenge = q.get("hub.challenge");
  return challenge && challenge.length <= 4096 ? reply(challenge) : reply("Bad request", 400);
}
export async function POST(request: Request) {
  const c = config();
  if (!c.META_APP_SECRET || !c.DB) return reply("Unavailable", 503);
  const signature = request.headers.get("x-hub-signature-256") || "";
  if (!/^sha256=[a-fA-F0-9]{64}$/.test(signature)) return reply("Forbidden", 403);
  if (Number(request.headers.get("content-length") || 0) > 1048576) return reply("Too large", 413);
  const reader = request.body?.getReader();
  if (!reader) return reply("Bad request", 400);
  const chunks: Uint8Array[] = []; let size = 0;
  while (true) {
    const { value, done } = await reader.read(); if (done) break;
    size += value.byteLength;
    if (size > 1048576) { await reader.cancel(); return reply("Too large", 413); }
    chunks.push(value);
  }
  const raw = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { raw.set(chunk, offset); offset += chunk.length; }
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(c.META_APP_SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
  const sig = Uint8Array.from(signature.slice(7).match(/.{2}/g)!, x => parseInt(x, 16));
  if (!await crypto.subtle.verify("HMAC", key, sig, raw)) return reply("Forbidden", 403);
  let payload: any;
  try { payload = JSON.parse(new TextDecoder().decode(raw)); } catch { return reply("Bad request", 400); }
  if (!payload || typeof payload.object !== "string" || !Array.isArray(payload.entry) || payload.entry.length > 1000) return reply("Bad request", 400);
  const now = Date.now(), batch: D1PreparedStatement[] = [];
  for (const entry of payload.entry) {
    if (!entry || !allowed.has(String(entry.id))) continue;
    const fields = new Set<string>();
    for (const change of Array.isArray(entry.changes) ? entry.changes : []) {
      if (typeof change?.field === "string") fields.add(change.field.slice(0, 128));
    }
    if (Array.isArray(entry.messaging)) fields.add("messaging");
    if (Array.isArray(entry.standby)) fields.add("standby");
    const id = await digest(JSON.stringify({ object: payload.object, entry }));
    batch.push(c.DB.prepare("INSERT OR IGNORE INTO meta_notifications (digest,object,account_id,fields,event_time,received_at) VALUES (?,?,?,?,?,?)").bind(id, payload.object.slice(0, 64), String(entry.id), JSON.stringify([...fields].sort()), Number.isFinite(entry.time) ? entry.time : 0, now));
  }
  batch.push(c.DB.prepare("DELETE FROM meta_notifications WHERE received_at < ?").bind(now - 30 * 86400000));
  try {
    for (let i = 0; i < batch.length; i += 50) await c.DB.batch(batch.slice(i, i + 50));
  } catch { return reply("Temporary failure", 503); }
  return reply("EVENT_RECEIVED");
}
