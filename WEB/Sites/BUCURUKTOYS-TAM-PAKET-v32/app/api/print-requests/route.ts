import { NextResponse } from "next/server";
import { isRateLimited } from "../../../lib/rate-limit";
import { getSupabaseConfig, supabaseAuthHeaders, supabaseRest } from "../../../lib/supabase-server";
import { THREE_D_PUBLIC_ENABLED } from "../../../lib/features";

export const dynamic = "force-dynamic";

const fileTypes = new Map([
  ["model/stl", "stl"], ["application/sla", "stl"], ["application/vnd.ms-pki.stl", "stl"],
  ["model/3mf", "3mf"], ["application/vnd.ms-package.3dmanufacturing-3dmodel+xml", "3mf"],
  ["model/obj", "obj"], ["text/plain", "obj"], ["application/zip", "zip"],
  ["application/pdf", "pdf"], ["image/jpeg", "jpg"], ["image/png", "png"], ["image/webp", "webp"],
]);

export async function POST(request: Request) {
  if (!THREE_D_PUBLIC_ENABLED) return NextResponse.json({ error: "Bu bölüm geçici olarak kapalı." }, { status: 404, headers: { "Cache-Control": "no-store" } });
  if (isRateLimited(request, "3d-print", 6, 10 * 60_000)) {
    return NextResponse.json({ error: "Çok fazla deneme yapıldı. Lütfen biraz sonra tekrar deneyin." }, { status: 429 });
  }
  const form = await request.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Geçersiz talep." }, { status: 400 });
  if (String(form.get("website") ?? "").trim()) return NextResponse.json({ accepted: true }, { status: 202 });
  if (String(form.get("consent")) !== "true") return NextResponse.json({ error: "Aydınlatma metni onayı zorunludur." }, { status: 400 });
  const text = (key: string, max: number) => String(form.get(key) ?? "").trim().slice(0, max);
  const customerName = text("customerName", 120);
  const phone = text("phone", 30);
  const modelName = text("modelName", 180);
  const quantity = Math.floor(Number(form.get("quantity")));
  if (!customerName || phone.replace(/\D/g, "").length < 10 || !modelName || !Number.isInteger(quantity) || quantity < 1 || quantity > 100000) {
    return NextResponse.json({ error: "Ad, telefon, model ve geçerli adet zorunludur." }, { status: 400 });
  }
  const files = form.getAll("files").filter((value): value is File => value instanceof File && value.size > 0);
  if (files.length > 3) return NextResponse.json({ error: "En fazla 3 dosya yükleyebilirsiniz." }, { status: 400 });
  if (files.some((file) => file.size > 12 * 1024 * 1024) || files.reduce((sum, file) => sum + file.size, 0) > 25 * 1024 * 1024) {
    return NextResponse.json({ error: "Dosyalar toplam 25 MB, tek dosya 12 MB sınırını aşamaz." }, { status: 400 });
  }
  if (files.some((file) => !fileTypes.has(file.type) && !/\.(stl|3mf|obj|zip|pdf|jpe?g|png|webp)$/i.test(file.name))) {
    return NextResponse.json({ error: "Yalnızca STL, 3MF, OBJ, ZIP, PDF, JPG, PNG veya WebP yükleyebilirsiniz." }, { status: 400 });
  }

  const config = getSupabaseConfig();
  if (!config) return NextResponse.json({ accepted: true, stored: false }, { status: 202 });
  const filePaths: string[] = [];
  let uploadWarning = false;
  for (const file of files) {
    const fallbackExtension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
    const extension = fileTypes.get(file.type) || fallbackExtension;
    const objectName = `requests/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${extension}`;
    try {
      const response = await fetch(`${config.url}/storage/v1/object/print-request-files/${objectName}`, {
        method: "POST",
        headers: { ...supabaseAuthHeaders(config), "Content-Type": file.type || "application/octet-stream", "x-upsert": "false" },
        body: await file.arrayBuffer(),
      });
      if (!response.ok) throw new Error("upload_failed");
      filePaths.push(objectName);
    } catch {
      uploadWarning = true;
    }
  }

  try {
    const result = await supabaseRest<Array<{ id: number; reference: string }> | { id: number; reference: string }>(
      config,
      "/rest/v1/rpc/create_print_request",
      {
        method: "POST",
        body: JSON.stringify({
          p_customer_name: customerName,
          p_company_name: text("companyName", 160) || null,
          p_phone: phone,
          p_email: text("email", 160) || null,
          p_model_name: modelName,
          p_quantity: quantity,
          p_material: text("material", 120) || null,
          p_color: text("color", 120) || null,
          p_dimensions: text("dimensions", 160) || null,
          p_model_url: text("modelUrl", 1000) || null,
          p_note: text("note", 2500) || null,
          p_selected_product_sku: text("selectedSku", 40) || null,
          p_selected_product_name: text("selectedProductName", 180) || null,
          p_estimated_price: Number(form.get("estimatedPrice")) || null,
          p_file_paths: filePaths,
        }),
      },
    );
    const row = Array.isArray(result) ? result[0] : result;
    return NextResponse.json({ accepted: true, stored: true, reference: row?.reference, uploadWarning }, { status: 201 });
  } catch {
    return NextResponse.json({ accepted: true, stored: false }, { status: 202 });
  }
}
