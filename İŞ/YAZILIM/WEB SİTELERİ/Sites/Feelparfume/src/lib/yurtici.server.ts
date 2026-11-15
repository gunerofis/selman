import { requirePermission } from "./admin-access.server";
import { getSql } from "./db";
import { trackingUrl } from "./shipping";
import { shipmentKeys, createShipmentXml, parseCreateShipment, parseQueryShipment, queryShipmentXml, YURTICI_TEST_URL, YURTICI_URL } from "./yurtici";

type Config = { user: string; password: string; url: string };

export function yurticiConfig(): Config | null {
  const user = process.env.YURTICI_WS_USER?.trim() ?? "";
  const password = process.env.YURTICI_WS_PASSWORD?.trim() ?? "";
  if (!user || !password) return null;
  return {
    user,
    password,
    url: process.env.YURTICI_TEST_MODE === "0" ? YURTICI_URL : YURTICI_TEST_URL,
  };
}

export function yurticiConfigured() {
  return yurticiConfig() != null;
}

async function postSoap(url: string, body: string) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "text/xml; charset=utf-8" },
    body,
    signal: AbortSignal.timeout(12000),
  });
  return response.text();
}

export async function openYurticiShipment(input: {
  orderId: string;
  name: string;
  address: string;
  phone: string;
  city: string;
  town: string;
  email: string;
}) {
  const config = yurticiConfig();
  if (!config) throw new Error("Yurtiçi yapılandırılmadı.");
  const sql = await getSql();
  const rows = await sql<{ cargo_key: string | null; cargo_job_id: string | null }>`
    select cargo_key, cargo_job_id from storefront_order_requests where id = ${input.orderId}
  `;
  const row = rows[0];
  if (!row) throw new Error("Sipariş bulunamadı.");
  const keys = shipmentKeys(input.orderId);
  let cargoKey = row.cargo_key || keys.cargoKey;
  let jobId = row.cargo_job_id ?? "";
  if (!jobId) {
    const created = parseCreateShipment(
      await postSoap(
        config.url,
        createShipmentXml(config, {
          cargoKey,
          invoiceKey: keys.invoiceKey,
          name: input.name,
          address: input.address,
          phone: input.phone,
          city: input.city,
          town: input.town,
          email: input.email,
        }),
      ),
    );
    if (!created.ok) throw new Error("Kargo kaydı açılamadı.");
    jobId = created.jobId;
    await sql`
      update storefront_order_requests
      set cargo_key = ${cargoKey}, cargo_job_id = ${jobId}
      where id = ${input.orderId} and cargo_job_id is null
    `;
  }
  let docId = "";
  try {
    docId = parseQueryShipment(await postSoap(config.url, queryShipmentXml(config, cargoKey)));
  } catch {
    docId = "";
  }
  return { cargoKey, jobId, docId };
}

export async function pullCargoTracking(orderId: string) {
  await requirePermission("orders.add_tracking", {
    resourceType: "order",
    resourceId: orderId,
  });
  const config = yurticiConfig();
  if (!config) throw new Error("Yurtiçi yapılandırılmadı.");
  const sql = await getSql();
  const rows = await sql<{ cargo_key: string | null }>`
    select cargo_key from storefront_order_requests where id = ${orderId}
  `;
  const cargoKey = rows[0]?.cargo_key ?? "";
  if (!cargoKey) throw new Error("Barkod yok.");
  const docId = parseQueryShipment(await postSoap(config.url, queryShipmentXml(config, cargoKey)));
  if (!docId) throw new Error("Takip no yok.");
  await sql`
    update storefront_order_requests
    set tracking_code = ${docId}, carrier = 'Yurtiçi', updated_at = now()
    where id = ${orderId}
  `;
  return { trackingCode: docId, trackingUrl: trackingUrl(docId) };
}
