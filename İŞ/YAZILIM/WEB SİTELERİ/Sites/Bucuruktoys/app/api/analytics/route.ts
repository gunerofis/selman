import { NextResponse } from "next/server";
import { getDataConfig, queryData } from "../../../lib/data-server";

export const dynamic = "force-dynamic";
const eventTypes = new Set(["product_view","offer_add","product_share","whatsapp_click","catalog_search","category_filter","catalog_print","catalog_pdf_download"]);

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const eventType = typeof body?.eventType === "string" ? body.eventType : "";
  if (!eventTypes.has(eventType)) return NextResponse.json({ error: "Geçersiz olay." }, { status: 400 });
  const config = getDataConfig();
  if (!config) return new NextResponse(null, { status: 204 });
  const metadata = body?.metadata && typeof body.metadata === "object" && !Array.isArray(body.metadata)
    ? Object.fromEntries(Object.entries(body.metadata as Record<string, unknown>).slice(0, 8).map(([key, value]) => [key.slice(0, 40), String(value).slice(0, 160)]))
    : {};
  try {
    await queryData(config, "/rest/v1/rpc/record_catalog_event", {
      method: "POST",
      body: JSON.stringify({
        p_event_type: eventType,
        p_product_id: Number.isInteger(Number(body?.productId)) ? Number(body?.productId) : null,
        p_sku: typeof body?.sku === "string" ? body.sku.slice(0, 40) : null,
        p_session_id: typeof body?.sessionId === "string" ? body.sessionId.slice(0, 80) : null,
        p_metadata: metadata,
      }),
    });
  } catch {
    // Analitik, müşteri akışını hiçbir zaman engellemez.
  }
  return new NextResponse(null, { status: 204 });
}
