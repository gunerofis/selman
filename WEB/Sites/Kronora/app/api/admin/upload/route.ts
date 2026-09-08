import { env } from "cloudflare:workers";
import { NextResponse } from "next/server";
import { getAdminApiContext, writeAudit } from "../../../lib/admin-auth";
import { isSameOriginMutation } from "../../../lib/request-security";

const MAX_FILE_SIZE = 8 * 1024 * 1024;
const MAX_FILES = 10;
const imageExtensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

export async function POST(request: Request) {
  if (!isSameOriginMutation(request)) return NextResponse.json({ error: "Geçersiz istek kaynağı." }, { status: 403 });
  const admin = await getAdminApiContext();
  if (!admin) return NextResponse.json({ error: "Yönetici erişimi gerekli." }, { status: 403 });

  const form = await request.formData();
  const entries = [...form.getAll("files"), ...form.getAll("file")];
  const files = entries.filter((entry): entry is File => entry instanceof File && entry.size > 0);
  if (!files.length) return NextResponse.json({ error: "En az bir görsel seçin." }, { status: 400 });
  if (files.length > MAX_FILES) return NextResponse.json({ error: `Tek seferde en fazla ${MAX_FILES} görsel yükleyebilirsiniz.` }, { status: 400 });

  const validated: Array<{ file: File; bytes: ArrayBuffer; extension: string }> = [];
  for (const file of files) {
    if (!imageExtensions[file.type]) return NextResponse.json({ error: "Yalnızca JPG, PNG, WEBP veya AVIF görselleri yükleyebilirsiniz." }, { status: 400 });
    if (file.size > MAX_FILE_SIZE) return NextResponse.json({ error: `${file.name} 8 MB sınırını aşıyor.` }, { status: 400 });
    const bytes = await file.arrayBuffer();
    const data = new Uint8Array(bytes);
    const ascii = (start: number, end: number) => String.fromCharCode(...data.slice(start, end));
    const valid = file.type === "image/jpeg" ? data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff
      : file.type === "image/png" ? [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((value, index) => data[index] === value)
        : file.type === "image/webp" ? ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP"
          : data.length >= 16 && ascii(4, 8) === "ftyp" && /avif|avis/.test(ascii(8, 16));
    if (!valid) return NextResponse.json({ error: `${file.name} içeriği geçerli bir ${file.type.replace("image/", "").toUpperCase()} görsel değil.` }, { status: 400 });
    validated.push({ file, bytes, extension: imageExtensions[file.type] });
  }

  const bucket = (env as unknown as { BUCKET?: R2Bucket }).BUCKET;
  if (!bucket) return NextResponse.json({ error: "Görsel depolama alanı hazır değil." }, { status: 503 });

  const urls: string[] = [];
  for (const { file, bytes, extension } of validated) {
    const key = `products/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${extension}`;
    await bucket.put(key, bytes, {
      httpMetadata: { contentType: file.type },
      customMetadata: { uploadedBy: admin.email, originalName: file.name.slice(0, 180) },
    });
    await writeAudit(admin, "media.upload", "media", key, { originalName: file.name, size: file.size, type: file.type });
    urls.push(`/api/media/${key}`);
  }

  return NextResponse.json({ url: urls[0], urls });
}
