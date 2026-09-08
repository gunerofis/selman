import { NextResponse } from "next/server";
import { requireAdmin, supabaseRest } from "../../../../lib/supabase-server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });
  try {
    const events = await supabaseRest<Array<{ event_type: string; product_id: number | null; sku: string | null; created_at: string }>>(auth.config, "/rest/v1/analytics_events?select=event_type,product_id,sku,created_at&created_at=gte." + encodeURIComponent(new Date(Date.now() - 30 * 86400000).toISOString()) + "&order=created_at.desc&limit=5000", {}, auth.accessToken);
    const counts = Object.fromEntries(["product_view","offer_add","product_share","whatsapp_click","catalog_search","category_filter","catalog_print","catalog_pdf_download"].map((type) => [type, events.filter((event) => event.event_type === type).length]));
    const products = new Map<string, { sku: string; views: number; adds: number }>();
    events.forEach((event) => {
      if (!event.sku) return;
      const item = products.get(event.sku) ?? { sku: event.sku, views: 0, adds: 0 };
      if (event.event_type === "product_view") item.views += 1;
      if (event.event_type === "offer_add") item.adds += 1;
      products.set(event.sku, item);
    });
    return NextResponse.json({ counts, topProducts: [...products.values()].sort((a, b) => (b.adds * 3 + b.views) - (a.adds * 3 + a.views)).slice(0, 10) });
  } catch {
    return NextResponse.json({ error: "Analitik verileri alınamadı. Güncel veritabanı şemasını çalıştırın." }, { status: 502 });
  }
}
