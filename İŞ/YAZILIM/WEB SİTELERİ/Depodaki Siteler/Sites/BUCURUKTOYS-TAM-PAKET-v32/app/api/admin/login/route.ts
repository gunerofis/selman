import { NextResponse } from "next/server";
import { isRateLimited } from "../../../../lib/rate-limit";
import { getSupabaseConfig } from "../../../../lib/supabase-server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (isRateLimited(request, "admin-login", 8, 15 * 60_000)) {
    return NextResponse.json({ error: "Çok fazla giriş denemesi yapıldı. Lütfen daha sonra tekrar deneyin." }, { status: 429 });
  }
  const body = await request.json().catch(() => null) as { email?: unknown; username?: unknown; password?: unknown } | null;
  const email = typeof body?.email === "string" ? body.email.trim().toLocaleLowerCase("tr-TR") : typeof body?.username === "string" ? body.username.trim().toLocaleLowerCase("tr-TR") : "";
  const password = typeof body?.password === "string" ? body.password : "";
  if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 8) return NextResponse.json({ error: "Geçerli e-posta ve şifrenizi girin." }, { status: 400 });
  const config = getSupabaseConfig();
  if (!config) return NextResponse.json({ error: "Yönetim bağlantısı henüz yapılandırılmadı." }, { status: 503 });
  try {
    const response = await fetch(`${config.url}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: { apikey: config.anonKey, "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });
    const data = await response.json().catch(() => ({})) as { access_token?: string; refresh_token?: string; expires_in?: number; msg?: string; error_description?: string };
    if (!response.ok || !data.access_token) return NextResponse.json({ error: data.error_description || data.msg || "E-posta veya şifre hatalı." }, { status: 401 });
    const permission = await fetch(`${config.url}/rest/v1/admin_users?email=eq.${encodeURIComponent(email)}&is_active=eq.true&select=role&limit=1`, {
      headers: { apikey: config.anonKey, Authorization: `Bearer ${data.access_token}` }, cache: "no-store",
    });
    const admins = permission.ok ? await permission.json() as Array<{ role: string }> : [];
    if (!admins[0] && !config.adminEmails.includes(email)) return NextResponse.json({ error: "Bu hesap yönetici olarak yetkilendirilmemiş." }, { status: 403 });
    const fallbackRole = email === config.developerEmail ? "developer" : "owner";
    return NextResponse.json({ accessToken: data.access_token, refreshToken: data.refresh_token, expiresIn: data.expires_in ?? 3600, role: admins[0]?.role ?? fallbackRole }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Kimlik doğrulama servisine ulaşılamadı." }, { status: 503 });
  }
}
