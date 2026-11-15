import { NextResponse } from "next/server";
import { canAdminWrite, requireAdmin } from "../../../../lib/data-server";

import { saveFile } from "../../../../lib/file-store";

export const dynamic = "force-dynamic";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });
  if(!canAdminWrite(auth.user.role))return NextResponse.json({error:"Bu hesap yalnızca görüntüleyebilir."},{status:403});
  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Görsel seçilmedi." }, { status: 400 });
  if (!allowedTypes.has(file.type)) return NextResponse.json({ error: "Yalnızca JPG, PNG, WebP veya AVIF yükleyebilirsiniz." }, { status: 400 });
  if (file.size > 8 * 1024 * 1024) return NextResponse.json({ error: "Görsel boyutu en fazla 8 MB olabilir." }, { status: 400 });
  const extension = ({ "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" } as Record<string, string>)[file.type];
  const objectName = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${extension}`;
  const path=await saveFile(auth.config,"product-images",objectName,await file.arrayBuffer(),file.type);
  return NextResponse.json({url:new URL(path,request.url).href});
}
