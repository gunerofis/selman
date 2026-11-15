import { config, equal, reply } from "@/lib/meta";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const c = config();
  if (!c.META_READER_TOKEN || !c.DB) return reply("Unavailable", 503);
  if (!await equal(request.headers.get("authorization") || "", `Bearer ${c.META_READER_TOKEN}`)) return reply("Forbidden", 403);
  const after = Number(new URL(request.url).searchParams.get("after") || 0);
  if (!Number.isSafeInteger(after) || after < 0) return reply("Bad cursor", 400);
  const result = await c.DB.prepare("SELECT id,object,account_id,fields,event_time,received_at FROM meta_notifications WHERE id > ? AND received_at >= ? ORDER BY id LIMIT 100").bind(after, Date.now() - 30 * 86400000).all();
  return Response.json({ notifications: result.results, next_cursor: result.results.length ? result.results[result.results.length - 1].id : after }, { headers: { "Cache-Control": "no-store" } });
}
