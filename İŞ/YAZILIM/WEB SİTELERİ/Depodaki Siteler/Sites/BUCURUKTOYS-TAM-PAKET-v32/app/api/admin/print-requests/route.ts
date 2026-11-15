import { NextResponse } from "next/server";
import { canAdminWrite, logAdminAction, requireAdmin, supabaseAuthHeaders, supabaseRest } from "../../../../lib/supabase-server";

export const dynamic = "force-dynamic";
const statuses = new Set(["new", "reviewing", "quoted", "approved", "production", "completed", "rejected"]);

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });
  try {
    const requests = await supabaseRest<Array<Record<string, unknown>>>(auth.config, "/rest/v1/print_requests?select=*&order=created_at.desc&limit=250", {}, auth.accessToken);
    const withFiles = await Promise.all((requests ?? []).map(async (item) => {
      const paths = Array.isArray(item.file_paths) ? item.file_paths.filter((path): path is string => typeof path === "string") : [];
      const fileUrls = await Promise.all(paths.map(async (path) => {
        try {
          const response = await fetch(`${auth.config.url}/storage/v1/object/sign/print-request-files/${path}`, {
            method: "POST",
            headers: { ...supabaseAuthHeaders(auth.config, auth.accessToken), "Content-Type": "application/json" },
            body: JSON.stringify({ expiresIn: 3600 }),
          });
          if (!response.ok) return null;
          const data = await response.json() as { signedURL?: string; signedUrl?: string };
          const signedPath = data.signedURL || data.signedUrl;
          return signedPath ? { name: path.split("/").pop() || "Dosya", url: `${auth.config.url}/storage/v1${signedPath}` } : null;
        } catch { return null; }
      }));
      return { ...item, file_urls: fileUrls.filter(Boolean) };
    }));
    return NextResponse.json({ requests: withFiles }, { headers: { "Cache-Control": "no-store" } });
  } catch { return NextResponse.json({ error: "3D üretim talepleri alınamadı. Güncel şemayı çalıştırın." }, { status: 502 }); }
}

export async function PATCH(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });
  if (!canAdminWrite(auth.user.role)) return NextResponse.json({ error: "Bu hesap yalnızca görüntüleyebilir." }, { status: 403 });
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const id = Number(body?.id); const status = typeof body?.status === "string" ? body.status : undefined; const internalNote=typeof body?.internalNote==="string"?body.internalNote.trim().slice(0,5000):undefined;
  if (!Number.isInteger(id) || id < 1 || (status===undefined&&internalNote===undefined) || (status!==undefined&&!statuses.has(status))) return NextResponse.json({ error: "Geçersiz talep güncellemesi." }, { status: 400 });
  try {
    const rows = await supabaseRest(auth.config, `/rest/v1/print_requests?id=eq.${id}`, { method: "PATCH", headers: { Prefer: "return=representation" }, body: JSON.stringify({ ...(status!==undefined?{status}:{}), ...(internalNote!==undefined?{internal_note:internalNote||null}:{}), updated_at: new Date().toISOString() }) }, auth.accessToken);
    await logAdminAction(auth.config,auth.accessToken,auth.user.email,"update","print_request",String(id),status?`Durum: ${status}`:"İç not güncellendi");
    return NextResponse.json({ request: Array.isArray(rows) ? rows[0] : null });
  } catch { return NextResponse.json({ error: "Talep güncellenemedi." }, { status: 502 }); }
}
export async function DELETE(request:Request){const auth=await requireAdmin(request);if(!auth.ok)return NextResponse.json({error:auth.message},{status:auth.status});if(!canAdminWrite(auth.user.role))return NextResponse.json({error:"Bu hesap yalnızca görüntüleyebilir."},{status:403});const id=Number(new URL(request.url).searchParams.get("id"));if(!Number.isInteger(id)||id<1)return NextResponse.json({error:"Geçersiz talep."},{status:400});await supabaseRest(auth.config,`/rest/v1/print_requests?id=eq.${id}`,{method:"DELETE",headers:{Prefer:"return=minimal"}},auth.accessToken);await logAdminAction(auth.config,auth.accessToken,auth.user.email,"delete","print_request",String(id));return NextResponse.json({ok:true});}
