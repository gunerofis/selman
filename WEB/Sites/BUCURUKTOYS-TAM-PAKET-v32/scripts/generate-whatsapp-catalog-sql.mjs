import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const catalog = JSON.parse(await readFile(resolve(repoRoot, "lib/whatsapp-catalog-20260807.json"), "utf8"));
const sqlString = (value) => `'${String(value).replaceAll("'", "''")}'`;

const newRows = catalog.newProducts.map((item) =>
  `  (${item.id},${sqlString(item.sku)},${sqlString(item.name)},${sqlString(item.category)},${sqlString(item.pack)},${sqlString(item.note)},${sqlString(item.image)},${sqlString("DOLDURULACAK")},${sqlString("DOLDURULACAK")},${item.id})`,
).join(",\n");

const existingUpdates = catalog.existingProductUpdates.map((item) => {
  const assignments = [
    `gallery = case when gallery @> jsonb_build_array(${sqlString(item.galleryImage)}) then gallery else gallery || jsonb_build_array(${sqlString(item.galleryImage)}) end`,
  ];
  if (item.name) assignments.push(`name = ${sqlString(item.name)}`);
  if (item.category) assignments.push(`category = ${sqlString(item.category)}`);
  if (item.pack) assignments.push(`pack = ${sqlString(item.pack)}`);
  if (item.note) assignments.push(`description = ${sqlString(item.note)}`);
  assignments.push("updated_at = now()");
  return `update public.products\nset ${assignments.join(",\n    ")}\nwhere sku = ${sqlString(item.sku)};`;
}).join("\n\n");

const sql = `-- BÜCÜRÜKTOYS WhatsApp katalog aktarımı — 7 Ağustos 2026
-- 44 yeni SKU ekler, 18 mevcut ürüne mükerrer SKU oluşturmadan galeri görseli bağlar.
-- Yönetimde girilmiş fiyat, maliyet, stok, barkod, tedarikçi ve görünürlük değerlerini korur.

begin;

insert into public.products (
  id, sku, name, category, pack, description, image_url, barcode, supplier, sort_order
)
values
${newRows}
on conflict (sku) do update set
  name = excluded.name,
  category = excluded.category,
  pack = excluded.pack,
  description = excluded.description,
  image_url = excluded.image_url,
  sort_order = excluded.sort_order,
  updated_at = now();

${existingUpdates}

select setval(
  pg_get_serial_sequence('public.products','id'),
  greatest((select coalesce(max(id), 1) from public.products), 1)
);

notify pgrst, 'reload schema';
commit;
`;

if (process.argv[2]) {
  const outputPath = resolve(repoRoot, process.argv[2]);
  await writeFile(outputPath, sql);
  console.log(`SQL yazıldı: ${outputPath}`);
} else {
  process.stdout.write(sql);
}
