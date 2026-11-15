import { NextResponse } from "next/server";
import { isRateLimited } from "../../../lib/rate-limit";
import { getSupabaseConfig, supabaseRest } from "../../../lib/supabase-server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (isRateLimited(request, "dealer", 5, 10 * 60_000)) return NextResponse.json({ error: "Çok fazla deneme yapıldı. Lütfen biraz sonra tekrar deneyin." }, { status: 429 });
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Geçersiz başvuru." }, { status: 400 });
  if (typeof body.website === "string" && body.website.trim()) return NextResponse.json({ accepted: true }, { status: 202 });
  if (body.consent !== true) return NextResponse.json({ error: "Aydınlatma metni onayı zorunludur." }, { status: 400 });
  const text = (key: string, max: number) => typeof body[key] === "string" ? body[key].trim().slice(0, max) : "";
  const companyName = text("companyName", 160);
  const contactName = text("contactName", 120);
  const phone = text("phone", 30);
  if (!companyName || !contactName || phone.replace(/\D/g, "").length < 10) return NextResponse.json({ error: "Firma, yetkili ve geçerli telefon bilgisi zorunludur." }, { status: 400 });
  const config = getSupabaseConfig();
  if (!config) return NextResponse.json({ accepted: true, stored: false }, { status: 202 });
  try {
    await supabaseRest(config, "/rest/v1/rpc/create_dealer_application", {
      method: "POST",
      body: JSON.stringify({
        p_company_name: companyName, p_contact_name: contactName, p_phone: phone,
        p_email: text("email", 160) || null, p_city: text("city", 80) || null,
        p_district: text("district", 80) || null, p_tax_office: text("taxOffice", 120) || null,
        p_tax_number: text("taxNumber", 40) || null, p_business_type: text("businessType", 120) || null,
        p_monthly_volume: text("monthlyVolume", 120) || null, p_note: text("note", 1500) || null,
      }),
    });
    return NextResponse.json({ accepted: true, stored: true }, { status: 201 });
  } catch {
    return NextResponse.json({ accepted: true, stored: false }, { status: 202 });
  }
}
