import { requirePermission } from "./admin-access.server";
import { getSql } from "./db";
import { DEFAULT_SHIPPING, type ShippingRule } from "./shipping";

function wholeLira(cents: number) {
  return Number.isInteger(cents) && cents >= 0 && cents % 100 === 0;
}

export async function readShippingRule(): Promise<ShippingRule> {
  try {
    const sql = await getSql();
    const rows = await sql<{ fee_cents: number; free_from_cents: number }>`
      select fee_cents, free_from_cents from shipping_settings where id = 1
    `;
    const row = rows[0];
    if (!row) return DEFAULT_SHIPPING;
    const feeCents = Number(row.fee_cents);
    const freeCents = Number(row.free_from_cents);
    if (!wholeLira(feeCents) || !wholeLira(freeCents)) return DEFAULT_SHIPPING;
    return { fee: feeCents / 100, freeFrom: freeCents / 100 };
  } catch (error) {
    if (String(error).includes("shipping_settings")) return DEFAULT_SHIPPING;
    throw error;
  }
}

export async function saveShippingRule(rule: ShippingRule) {
  if (!Number.isInteger(rule.fee) || rule.fee < 0 || rule.fee > 100_000)
    throw new Error("Kargo ücreti geçersiz.");
  if (!Number.isInteger(rule.freeFrom) || rule.freeFrom < 0 || rule.freeFrom > 1_000_000)
    throw new Error("Ücretsiz kargo eşiği geçersiz.");
  await requirePermission("delivery_settings.change_fee", {
    resourceType: "shipping",
    resourceId: "rule",
    payload: rule,
  });
  const sql = await getSql();
  await sql`
    insert into shipping_settings (id, fee_cents, free_from_cents)
    values (1, ${rule.fee * 100}, ${rule.freeFrom * 100})
    on conflict (id) do update
    set fee_cents = excluded.fee_cents, free_from_cents = excluded.free_from_cents
  `;
  return rule;
}
