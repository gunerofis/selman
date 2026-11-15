import { NextResponse } from "next/server";
import { isRateLimited } from "../../../../lib/rate-limit";
import { getSupabaseConfig } from "../../../../lib/supabase-server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (isRateLimited(request, "admin-recover", 3, 30 * 60_000)) return NextResponse.json({ error: "Çok fazla istek gönderildi." }, { status: 429 });
  const body = await request.json().catch(() => null) as { email?: unknown } | null;
  const email = typeof body?.email === "string" ? body.email.trim().toLocaleLowerCase("tr-TR") : "";
  const config = getSupabaseConfig();
  if (!config || !/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ ok: true });
  await fetch(`${config.url}/auth/v1/recover?redirect_to=${encodeURIComponent("https://www.bucuruktoys.com/admin")}`, {
    method: "POST",
    headers: { apikey: config.anonKey, "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
    cache: "no-store",
  }).catch(() => null);
  return NextResponse.json({ ok: true, message: "Hesap kayıtlıysa şifre bağlantısı gönderildi." });
}
