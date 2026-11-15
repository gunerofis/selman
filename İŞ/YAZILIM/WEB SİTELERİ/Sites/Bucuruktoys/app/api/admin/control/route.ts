import { NextResponse } from "next/server";
import { hashSecret, validPanelKey } from "../../../../lib/admin-auth";
import { canAdminManageUsers, canAdminWrite, logAdminAction, requireAdmin, queryData } from "../../../../lib/data-server";

export const dynamic = "force-dynamic";

const entityConfig = {
  category: { table: "categories", id: "id" },
  page: { table: "content_pages", id: "slug" },
  setting: { table: "site_settings", id: "key" },
  user: { table: "admin_users", id: "email" },
} as const;
type Entity = keyof typeof entityConfig;
type AdminRole = "developer" | "owner" | "editor" | "viewer";

function cleanText(value: unknown, max = 5000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function canAssignRole(actorRole: AdminRole, targetRole: AdminRole) {
  return actorRole === "developer" || (actorRole === "owner" && targetRole !== "developer");
}


function prepare(entity: Entity, source: Record<string, unknown>, actorEmail: string, developerEmail: string) {
  if (entity === "category") {
    const id = cleanText(source.id, 40).toLocaleLowerCase("tr-TR");
    const slug = cleanText(source.slug, 80).toLocaleLowerCase("tr-TR");
    if (!/^[a-z0-9-]{2,40}$/.test(id) || !/^[a-z0-9-]{2,80}$/.test(slug) || !cleanText(source.name, 160)) throw new Error("Kategori kimliği, adresi ve adı zorunludur.");
    return { id, slug, name: cleanText(source.name, 160), short_description: cleanText(source.short_description, 500), description: cleanText(source.description, 2000), guides: Array.isArray(source.guides) ? source.guides.slice(0, 10) : [], is_visible: source.is_visible !== false, sort_order: Math.max(0, Math.floor(Number(source.sort_order ?? 0))), updated_at: new Date().toISOString() };
  }
  if (entity === "page") {
    const slug = cleanText(source.slug, 100).toLocaleLowerCase("tr-TR");
    if (!/^[a-z0-9-]{2,100}$/.test(slug) || !cleanText(source.title, 200)) throw new Error("Sayfa adresi ve başlığı zorunludur.");
    return { slug, title: cleanText(source.title, 200), kicker: cleanText(source.kicker, 200), summary: cleanText(source.summary, 2000), sections: Array.isArray(source.sections) ? source.sections.slice(0, 30) : [], seo_title: cleanText(source.seo_title, 200) || null, seo_description: cleanText(source.seo_description, 500) || null, is_published: source.is_published !== false, updated_by: actorEmail, updated_at: new Date().toISOString() };
  }
  if (entity === "setting") {
    const key = cleanText(source.key, 100).toLocaleLowerCase("tr-TR");
    if (!/^[a-z0-9_]{2,100}$/.test(key) || !cleanText(source.label, 160)) throw new Error("Ayar anahtarı ve etiketi zorunludur.");
    return { key, label: cleanText(source.label, 160), group_name: cleanText(source.group_name, 80) || "general", value: source.value ?? null, is_public: Boolean(source.is_public), updated_by: actorEmail, updated_at: new Date().toISOString() };
  }
  const email = cleanText(source.email, 320).toLocaleLowerCase("tr-TR");
  const role = source.role === "developer" || source.role === "owner" || source.role === "viewer" ? source.role : "editor";
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("Geçerli bir e-posta girin.");
  if (role === "developer" && email !== developerEmail) throw new Error("Geliştirici rolü yalnızca yapılandırılmış Selman Korkmaz hesabına atanabilir.");
  return { email, display_name: role === "developer" ? "Selman Korkmaz" : cleanText(source.display_name, 160) || null, role, is_active: source.is_active !== false, created_by: actorEmail, updated_at: new Date().toISOString() };
}

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });
  try {
    const url = new URL(request.url);
    if (url.searchParams.get("compact") === "categories") {
      const categories = await queryData(auth.config, "/rest/v1/categories?select=id,name,slug,is_visible,sort_order&order=sort_order.asc", {}, auth.accessToken);
      return NextResponse.json({ categories, user: auth.user });
    }
    const [categories, pages, settings, users, audit] = await Promise.all([
      queryData(auth.config, "/rest/v1/categories?select=*&order=sort_order.asc", {}, auth.accessToken),
      queryData(auth.config, "/rest/v1/content_pages?select=*&order=slug.asc", {}, auth.accessToken),
      queryData(auth.config, "/rest/v1/site_settings?select=*&order=group_name.asc,key.asc", {}, auth.accessToken),
      queryData(auth.config, "/rest/v1/admin_users?select=email,display_name,role,is_active,created_at,updated_at&order=role.asc,email.asc", {}, auth.accessToken),
      queryData(auth.config, "/rest/v1/admin_audit_logs?select=*&order=created_at.desc&limit=300", {}, auth.accessToken),
    ]);
    if (url.searchParams.get("mode") === "backup") {
      if(!canAdminManageUsers(auth.user.role))return NextResponse.json({error:"Yedek indirme yetkiniz yok."},{status:403});
      const [products, printProducts, quotes, dealers, printRequests, inventory] = await Promise.all([
        queryData(auth.config, "/rest/v1/products?select=*&order=id.asc", {}, auth.accessToken),
        queryData(auth.config, "/rest/v1/print_products?select=*&order=id.asc", {}, auth.accessToken),
        queryData(auth.config, "/rest/v1/quotes?select=*,quote_items(*)&order=id.asc", {}, auth.accessToken),
        queryData(auth.config, "/rest/v1/dealer_applications?select=*&order=id.asc", {}, auth.accessToken),
        queryData(auth.config, "/rest/v1/print_requests?select=*&order=id.asc", {}, auth.accessToken),
        queryData(auth.config, "/rest/v1/inventory_movements?select=*&order=id.asc", {}, auth.accessToken),
      ]);
      await logAdminAction(auth.config, auth.accessToken, auth.user.email, "export", "backup", undefined, "Tam yönetim yedeği indirildi");
      return NextResponse.json({ exportedAt: new Date().toISOString(), categories, pages, settings, users, products, printProducts, quotes, dealers, printRequests, inventory, audit }, { headers: { "Content-Disposition": `attachment; filename="bucuruktoys-backup-${new Date().toISOString().slice(0, 10)}.json"` } });
    }
    return NextResponse.json({ categories, pages, settings, users, audit, user: auth.user, policy: { developerEmail: auth.config.developerEmail } }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Yönetim verileri alınamadı." }, { status: 502 });
  }
}

async function write(request: Request, method: "POST" | "PATCH") {
  const auth = await requireAdmin(request);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });
  if (!canAdminWrite(auth.user.role)) return NextResponse.json({ error: "Bu hesap yalnızca görüntüleyebilir." }, { status: 403 });
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const entity = cleanText(body?.entity, 20) as Entity;
  if (!entityConfig[entity]) return NextResponse.json({ error: "Geçersiz yönetim kaydı." }, { status: 400 });
  if (entity === "user" && !canAdminManageUsers(auth.user.role)) return NextResponse.json({ error: "Yönetici hesaplarını yalnızca geliştirici veya sahip yönetebilir." }, { status: 403 });
  try {
    const source = (body?.record ?? {}) as Record<string, unknown>;
    const record = prepare(entity, source, auth.user.email, auth.config.developerEmail);
    const requestedPassword = entity === "user" && typeof source.initial_password === "string" ? source.initial_password.slice(0, 128) : "";
    if (entity === "user" && String((record as Record<string, unknown>).email) === auth.user.email && ((record as Record<string, unknown>).role !== auth.user.role || (record as Record<string, unknown>).is_active === false)) throw new Error("Kendi yönetici rolünüzü değiştiremez veya hesabınızı kapatamazsınız.");
    if (entity === "user") {
      const targetRole = String((record as Record<string, unknown>).role) as AdminRole;
      if (!canAssignRole(auth.user.role, targetRole)) throw new Error("Sahip rolü geliştirici atayamaz; sahip, editör veya görüntüleyici atayabilir.");
      if ((method === "POST" || requestedPassword) && !validPanelKey(requestedPassword)) throw new Error("Geçerli bir panel anahtarı oluşturun.");
      if (method === "PATCH" && auth.user.role === "owner") {
        const email = String((record as Record<string, unknown>).email);
        const current = await queryData<Array<{ role: AdminRole }>>(auth.config, `/rest/v1/admin_users?email=eq.${encodeURIComponent(email)}&select=role&limit=1`, {}, auth.accessToken);
        if (current?.[0]?.role === "developer") throw new Error("Geliştirici hesabını yalnızca geliştirici yönetebilir.");
      }
    }
    const config = entityConfig[entity];
    const id = String(record[config.id as keyof typeof record]);
    const path = method === "PATCH" ? `/rest/v1/${config.table}?${config.id}=eq.${encodeURIComponent(id)}` : `/rest/v1/${config.table}`;
    const rows = await queryData<Array<Record<string, unknown>>>(auth.config, path, { method, headers: { Prefer: "return=representation" }, body: JSON.stringify(record), ...(entity === "user" && requestedPassword ? {credentialHash:await hashSecret(requestedPassword)} : {}) }, auth.accessToken);
    await logAdminAction(auth.config, auth.accessToken, auth.user.email, method === "POST" ? "create" : "update", entity, id, cleanText((record as Record<string, unknown>).name || (record as Record<string, unknown>).title || (record as Record<string, unknown>).label || id, 200));
    return NextResponse.json({ record: rows?.[0] ?? record, message: entity === "user" && method === "POST" ? "Yönetici hesabı oluşturuldu." : "Değişiklikler kaydedildi." }, { status: method === "POST" ? 201 : 200 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Kayıt tamamlanamadı." }, { status: 400 });
  }
}

export async function POST(request: Request) { return write(request, "POST"); }
export async function PATCH(request: Request) { return write(request, "PATCH"); }

export async function DELETE(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });
  if (!canAdminWrite(auth.user.role)) return NextResponse.json({ error: "Bu hesap yalnızca görüntüleyebilir." }, { status: 403 });
  const url = new URL(request.url);
  const entity = (url.searchParams.get("entity") ?? "") as Entity;
  const id = url.searchParams.get("id") ?? "";
  if (!entityConfig[entity] || !id) return NextResponse.json({ error: "Geçersiz silme isteği." }, { status: 400 });
  if (entity === "user" && !canAdminManageUsers(auth.user.role)) return NextResponse.json({ error: "Yönetici hesaplarını yalnızca geliştirici veya sahip yönetebilir." }, { status: 403 });
  if (entity === "user" && id.toLocaleLowerCase("tr-TR") === auth.user.email) return NextResponse.json({ error: "Kendi yönetici hesabınızı silemezsiniz." }, { status: 400 });
  try {
    if (entity === "user" && auth.user.role === "owner") {
      const current = await queryData<Array<{ role: AdminRole }>>(auth.config, `/rest/v1/admin_users?email=eq.${encodeURIComponent(id)}&select=role&limit=1`, {}, auth.accessToken);
      if (current?.[0]?.role === "developer") throw new Error("Geliştirici hesabını yalnızca geliştirici yönetebilir.");
    }
    const config = entityConfig[entity];
    const rows = await queryData<unknown[]>(auth.config, `/rest/v1/${config.table}?${config.id}=eq.${encodeURIComponent(id)}`, { method: "DELETE", headers: { Prefer: "return=representation" } }, auth.accessToken);
    if (!Array.isArray(rows) || rows.length === 0) return NextResponse.json({ error: "Kayıt bulunamadı veya silme yetkisi yok." }, { status: 404, headers: { "Cache-Control": "no-store" } });
    await logAdminAction(auth.config, auth.accessToken, auth.user.email, "delete", entity, id);
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Geliştirici hesabını")) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json({ error: entity === "category" ? "Kullanılan kategori silinemez; önce ürünleri başka kategoriye taşıyın." : "Kayıt silinemedi." }, { status: 409 });
  }
}
