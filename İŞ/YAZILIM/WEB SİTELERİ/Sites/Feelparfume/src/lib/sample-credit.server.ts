import { getSql } from "./db";
import { isSampleVariant } from "./discovery";
import { openSampleCredits, type SampleHistory } from "./sample-credit";

type StoredItem = { sku?: string; color?: string; unitPrice?: number; qty?: number };

export async function loadSampleCredits(email: string, exceptId: string) {
  const normalized = email.trim().toLowerCase();
  if (!normalized.includes("@")) return {};
  const sql = await getSql();
  const rows = await sql<{ items: StoredItem[] | null; at: string }>`
    select items, created_at::text as at
    from storefront_order_requests
    where lower(customer->>'email') = ${normalized}
      and payment_status = 'paid'
      and created_at >= now() - interval '30 days'
      and id <> ${exceptId}
  `;
  const history: SampleHistory[] = [];
  for (const row of rows) {
    const at = Date.parse(row.at);
    const stored = Array.isArray(row.items) ? row.items : [];
    for (const item of stored) {
      const sku = item.sku ?? "";
      const color = item.color ?? "";
      if (!sku || !color) continue;
      const sample = isSampleVariant(sku, color);
      const cents = Math.round(Number(item.unitPrice) * Number(item.qty));
      history.push({
        sku,
        sampleCents: sample && Number.isInteger(cents) ? cents : 0,
        bottle: !sample,
        at,
      });
    }
  }
  return openSampleCredits(history, Date.now());
}
