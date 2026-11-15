import { NextResponse } from "next/server";
import { canAdminWrite, logAdminAction, requireAdmin, queryData } from "../../../../lib/data-server";

export const dynamic = "force-dynamic";
const statuses = new Set(["new", "reviewing", "approved", "rejected"]);

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });
  try {
    const applications = await queryData(auth.config, "/rest/v1/dealer_applications?select=*&order=created_at.desc&limit=250", {}, auth.accessToken);
    return NextResponse.json({ applications }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Bayilik başvuruları alınamadı. Güncel şemayı çalıştırın." }, { status: 502 });
  }
}

export async function PATCH(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });
  if (!canAdminWrite(auth.user.role)) return NextResponse.json({ error: "Bu hesap yalnızca görüntüleyebilir." }, { status: 403 });
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const id = Number(body?.id); const status = typeof body?.status === "string" ? body.status : undefined; const internalNote=typeof body?.internalNote==="string"?body.internalNote.trim().slice(0,5000):undefined;
  if (!Number.isInteger(id) || id < 1 || (status===undefined&&internalNote===undefined) || (status!==undefined&&!statuses.has(status))) return NextResponse.json({ error: "Geçersiz başvuru güncellemesi." }, { status: 400 });
  try {
    const rows = await queryData(auth.config, `/rest/v1/dealer_applications?id=eq.${id}`, { method: "PATCH", headers: { Prefer: "return=representation" }, body: JSON.stringify({ ...(status!==undefined?{status}:{}), ...(internalNote!==undefined?{internal_note:internalNote||null}:{}), updated_at: new Date().toISOString() }) }, auth.accessToken);
    await logAdminAction(auth.config,auth.accessToken,auth.user.email,"update","dealer",String(id),status?`Durum: ${status}`:"İç not güncellendi");
    return NextResponse.json({ application: Array.isArray(rows) ? rows[0] : null });
  } catch { return NextResponse.json({ error: "Başvuru güncellenemedi." }, { status: 502 }); }
}
export async function DELETE(request:Request){const auth=await requireAdmin(request);if(!auth.ok)return NextResponse.json({error:auth.message},{status:auth.status});if(!canAdminWrite(auth.user.role))return NextResponse.json({error:"Bu hesap yalnızca görüntüleyebilir."},{status:403});const id=Number(new URL(request.url).searchParams.get("id"));if(!Number.isInteger(id)||id<1)return NextResponse.json({error:"Geçersiz başvuru."},{status:400});const rows=await queryData<unknown[]>(auth.config,`/rest/v1/dealer_applications?id=eq.${id}`,{method:"DELETE",headers:{Prefer:"return=representation"}},auth.accessToken);if(!Array.isArray(rows)||rows.length===0)return NextResponse.json({error:"Başvuru bulunamadı veya silme yetkisi yok."},{status:404,headers:{"Cache-Control":"no-store"}});await logAdminAction(auth.config,auth.accessToken,auth.user.email,"delete","dealer",String(id));return NextResponse.json({ok:true},{headers:{"Cache-Control":"no-store"}});}
