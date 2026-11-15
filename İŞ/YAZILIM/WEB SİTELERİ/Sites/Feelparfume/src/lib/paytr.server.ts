import { getRequest } from "@tanstack/react-start/server";
import { getSql } from "./db";
import { parseRatePayload, type InstallmentRate } from "./installments";
import { applyPaidStock } from "./commerce.server";
import {
  amountMatches,
  basketRows,
  callbackToken,
  decideCallback,
  iframeToken,
  merchantOid,
  ratesToken,
  refundToken,
  sameToken,
  tlAmount,
  userBasket,
} from "./paytr";

const TOKEN_URL = "https://www.paytr.com/odeme/api/get-token";
const REFUND_URL = "https://www.paytr.com/odeme/iade";
const RATES_URL = "https://www.paytr.com/odeme/taksit-oranlari";
const STALE_MS = 12 * 60 * 60 * 1000;

export function paytrConfig() {
  const merchantId = process.env.PAYTR_MERCHANT_ID?.trim() ?? "";
  const merchantKey = process.env.PAYTR_MERCHANT_KEY?.trim() ?? "";
  const merchantSalt = process.env.PAYTR_MERCHANT_SALT?.trim() ?? "";
  if (!merchantId || !merchantKey || !merchantSalt) return null;
  return {
    merchantId,
    merchantKey,
    merchantSalt,
    testMode: process.env.PAYTR_TEST_MODE === "0" ? "0" : "1",
  };
}

export function paytrConfigured() {
  return paytrConfig() !== null;
}

function clientIp() {
  try {
    const request = getRequest();
    const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    if (forwarded) return forwarded;
  } catch {
    /* token is requested during a server function */
  }
  return "127.0.0.1";
}

export async function requestPaytrToken(input: {
  orderId: string;
  email: string;
  name: string;
  address: string;
  phone: string;
  totalCents: number;
  items: { name: string; unitCents: number; qty: number }[];
  shippingCents: number;
  giftWrapCents: number;
  discountCents: number;
}) {
  const cfg = paytrConfig();
  if (!cfg) throw new Error("Kart ödemesi kapalı.");
  const oid = merchantOid(input.orderId);
  const paymentAmount = String(input.totalCents);
  const basket = userBasket(
    basketRows({
      items: input.items,
      shippingCents: input.shippingCents,
      giftWrapCents: input.giftWrapCents,
      discountCents: input.discountCents,
      totalCents: input.totalCents,
    }),
  );
  const userIp = clientIp();
  const token = iframeToken({
    merchantId: cfg.merchantId,
    merchantKey: cfg.merchantKey,
    merchantSalt: cfg.merchantSalt,
    userIp,
    merchantOid: oid,
    email: input.email,
    paymentAmount,
    userBasket: basket,
    testMode: cfg.testMode,
  });
  let origin = "http://127.0.0.1:8080";
  try {
    origin = new URL(getRequest().url).origin;
  } catch {
    /* keep the local origin */
  }
  const body = new URLSearchParams({
    merchant_id: cfg.merchantId,
    user_ip: userIp,
    merchant_oid: oid,
    email: input.email,
    payment_amount: paymentAmount,
    paytr_token: token,
    user_basket: basket,
    debug_on: "0",
    no_installment: "0",
    max_installment: "0",
    user_name: input.name,
    user_address: input.address,
    user_phone: input.phone,
    merchant_ok_url: `${origin}/siparis/${input.orderId}`,
    merchant_fail_url: `${origin}/odeme`,
    timeout_limit: "30",
    currency: "TL",
    test_mode: cfg.testMode,
    lang: "tr",
  });
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    body,
    signal: AbortSignal.timeout(15000),
  });
  const json = (await res.json()) as { status?: string; token?: string };
  if (json.status !== "success" || !json.token) throw new Error("Kart ödemesi başlatılamadı.");
  return json.token;
}

export async function handlePaytrCallback(request: Request) {
  const cfg = paytrConfig();
  if (!cfg) return "ERR";
  const form = await request.formData();
  const oid = String(form.get("merchant_oid") ?? "");
  const status = String(form.get("status") ?? "");
  const totalAmount = String(form.get("total_amount") ?? "");
  const hash = String(form.get("hash") ?? "");
  const expected = callbackToken({
    merchantOid: oid,
    merchantSalt: cfg.merchantSalt,
    status,
    totalAmount,
    merchantKey: cfg.merchantKey,
  });
  const hashOk = Boolean(oid) && Boolean(hash) && sameToken(hash, expected);
  if (!hashOk) return decideCallback({ hashOk: false, status, amountOk: false, alreadyPaid: false, stockApplied: false }).response;
  const sql = await getSql();
  const rows = await sql<{
    id: string;
    total_cents: number;
    payment_status: string;
    stock_applied: boolean;
  }>`
    select id, total_cents, payment_status, stock_applied
    from storefront_order_requests
    where paytr_oid = ${oid}
  `;
  const row = rows[0];
  if (!row) return "OK";
  const decision = decideCallback({
    hashOk: true,
    status,
    amountOk: amountMatches(totalAmount, Number(row.total_cents)),
    alreadyPaid: row.payment_status === "paid",
    stockApplied: row.stock_applied,
  });
  if (decision.markPaid) {
    await sql`
      update storefront_order_requests
      set payment_status = 'paid', updated_at = now()
      where id = ${row.id} and payment_status <> 'paid'
    `;
  }
  if (decision.markFailed) {
    await sql`
      update storefront_order_requests
      set payment_status = 'failed', updated_at = now()
      where id = ${row.id} and payment_status = 'pending'
    `;
  }
  if (decision.applyStock) await applyPaidStock(row.id);
  return decision.response;
}

export async function refundPaytrOrder(
  orderId: string,
  oid: string,
  deltaCents: number,
  targetCents: number,
) {
  const cfg = paytrConfig();
  if (!cfg) throw new Error("PayTR iadesi yapılandırılmadı.");
  const sql = await getSql();
  const inserted = await sql<{ order_id: string }>`
    insert into paytr_refunds (order_id, refunded_cents, status)
    values (${orderId}, ${targetCents}, 'pending')
    on conflict (order_id, refunded_cents) do nothing
    returning order_id
  `;
  if (!inserted[0]) {
    const existing = await sql<{ status: string }>`
      select status from paytr_refunds
      where order_id = ${orderId} and refunded_cents = ${targetCents}
    `;
    if (existing[0]?.status === "done") return;
    throw new Error("İade sürüyor.");
  }
  const returnAmount = tlAmount(deltaCents);
  const token = refundToken({
    merchantId: cfg.merchantId,
    merchantOid: oid,
    returnAmount,
    merchantSalt: cfg.merchantSalt,
    merchantKey: cfg.merchantKey,
  });
  try {
    const res = await fetch(REFUND_URL, {
      method: "POST",
      body: new URLSearchParams({
        merchant_id: cfg.merchantId,
        merchant_oid: oid,
        return_amount: returnAmount,
        paytr_token: token,
      }),
      signal: AbortSignal.timeout(15000),
    });
    const json = (await res.json()) as { status?: string };
    if (json.status !== "success") throw new Error("İade tamamlanamadı.");
    await sql`
      update paytr_refunds set status = 'done'
      where order_id = ${orderId} and refunded_cents = ${targetCents}
    `;
  } catch (error) {
    await sql`
      delete from paytr_refunds
      where order_id = ${orderId} and refunded_cents = ${targetCents} and status = 'pending'
    `;
    throw error instanceof Error ? error : new Error("İade tamamlanamadı.");
  }
}

async function refreshRates() {
  const cfg = paytrConfig();
  if (!cfg) return;
  const requestId = String(Date.now());
  const token = ratesToken({
    merchantId: cfg.merchantId,
    requestId,
    merchantSalt: cfg.merchantSalt,
    merchantKey: cfg.merchantKey,
  });
  const res = await fetch(RATES_URL, {
    method: "POST",
    body: new URLSearchParams({
      merchant_id: cfg.merchantId,
      request_id: requestId,
      paytr_token: token,
    }),
    signal: AbortSignal.timeout(12000),
  });
  const json = (await res.json()) as unknown;
  const parsed = parseRatePayload(json);
  const sql = await getSql();
  if (parsed.length) {
    await sql`delete from paytr_rates`;
    for (const row of parsed) {
      await sql`
        insert into paytr_rates (bank, months, ratio_bps)
        values (${row.bank}, ${row.months}, ${row.ratioBps})
      `;
    }
  }
  await sql`
    insert into paytr_rate_sync (id, fetched_at) values (1, now())
    on conflict (id) do update set fetched_at = now()
  `;
}

export async function publicInstallments(): Promise<InstallmentRate[]> {
  try {
    const sql = await getSql();
    const sync = await sql<{ at: string }>`select fetched_at::text as at from paytr_rate_sync where id = 1`;
    const fetched = sync[0]?.at ? Date.parse(sync[0].at) : 0;
    const stale = !fetched || Date.now() - fetched > STALE_MS;
    if (stale && paytrConfig()) {
      try {
        await refreshRates();
      } catch {
        /* keep the stored table */
      }
    }
    const rows = await sql<{ bank: string; months: number; ratio_bps: number }>`
      select bank, months, ratio_bps from paytr_rates order by bank, months
    `;
    return rows.map((row) => ({
      bank: row.bank,
      months: Number(row.months),
      ratioBps: Number(row.ratio_bps),
    }));
  } catch {
    return [];
  }
}
