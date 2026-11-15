import fs from "node:fs";

const rawProducts = JSON.parse(fs.readFileSync(new URL("../lib/print-products-data.json", import.meta.url), "utf8"));
const activeProducts = JSON.parse(fs.readFileSync(new URL("../lib/active-print-products.json", import.meta.url), "utf8"));
const activeById = new Map(activeProducts.map((product) => [product.id, product]));
const modulePath = new URL("../supabase/3d_module.sql", import.meta.url);
const source = fs.readFileSync(modulePath, "utf8").split("-- PRINT_PRODUCTS_SEED")[0];
const groupKeys = new Map([
  ["Eklemli hayvanlar, flexi oyuncaklar ve masaüstü dostları", "flexi"],
  ["Aksiyon figürleri, dönüşen oyuncaklar ve araçlar", "action"],
  ["Fidget, clicker, mekanik ve duyusal ürünler", "fidget"],
  ["Anahtarlık, çanta süsü, magnet ve küçük işlevsel hediyeler", "custom"],
  ["Ev dekoru, saksı, vazo ve masaüstü düzenleyiciler", "decor"],
  ["Işıklı ve duvar dekoru ürünleri", "decor"],
  ["Koleksiyon, masa oyunu ve eğitim ürünleri", "collection"],
  ["Sezonluk ve olay bazlı viral ürünler", "collection"],
]);
function estimate(raw) {
  const value = `${raw.name} ${raw.details}`.toLocaleLowerCase("tr-TR");
  let min = 90, max = 360, price = 110, minimum = 5;
  if (raw.no <= 45) { min = 90; max = 360; price = 115; minimum = 5; }
  else if (raw.no <= 65) { min = 150; max = 540; price = 185; minimum = 3; }
  else if (raw.no <= 95) { min = 30; max = 150; price = 62; minimum = 10; }
  else if (raw.no <= 122) { min = 20; max = 90; price = 42; minimum = 20; }
  else if (raw.no <= 147) { min = 90; max = 480; price = 145; minimum = 5; }
  else if (raw.no <= 163) { min = 180; max = 720; price = 310; minimum = 2; }
  else if (raw.no <= 186) { min = 75; max = 360; price = 125; minimum = 5; }
  else { min = 30; max = 180; price = 58; minimum = 20; }
  if (/dragon|ejderha|ahtapot/.test(value)) { min = 240; max = 720; price = 220; minimum = 3; }
  if (/dummy 13|lucky 13|carbon 13/.test(value)) { min = 360; max = 900; price = 340; minimum = 1; }
  if (/mini 13/.test(value)) { min = 180; max = 480; price = 210; minimum = 2; }
  if (/anahtarlık|jeton|klips|etiketi|pasta üstü/.test(value)) { min = Math.min(min, 20); max = Math.min(max, 60); price = Math.min(price, 42); minimum = Math.max(minimum, 20); }
  if (/clicker|flexi grid|gyro halkaları|infinity cube/.test(value)) { min = 30; max = 120; price = 68; minimum = 10; }
  if (/litofan|lamba|led tabela|abajur|book nook/.test(value)) { min = Math.max(min, 240); max = Math.max(max, 720); price = Math.max(price, 390); minimum = 1; }
  if (/vazo|saksı|kalemlik|standı|kutu/.test(value)) { min = Math.max(min, 90); max = Math.max(max, 360); price = Math.max(price, 145); minimum = Math.min(minimum, 5); }
  if (raw.fit === "B") { max = Math.round(max * 1.25); price = Math.round(price * 1.12); }
  else if (raw.fit === "C") { min = Math.round(min * 1.35); max = Math.round(max * 1.7); price = Math.round(price * 1.35); }
  if (raw.no === 207) { min = 60; max = 180; price = 85; minimum = 10; }
  return { min, max, price, minimum };
}

const quote = (value) => `'${String(value).replaceAll("'", "''")}'`;
const values = rawProducts.map((raw) => {
  const item = estimate(raw);
  const active = activeById.get(raw.no);
  const material = active?.material || (raw.fit === "C" ? "PLA / PETG — ürüne göre" : "PLA");
  const published = Boolean(active);
  const featured = Boolean(active && active.popularityRank <= 6);
  const popularityRank = active?.popularityRank ?? null;
  const fallback = "DOLDURULACAK";
  return `  (${raw.no},${quote(`3D-${String(raw.no).padStart(3, "0")}`)},${quote(raw.name)},${quote(raw.group)},${raw.viral},${quote(raw.fit)},${quote(active?.details || raw.details)},${active?.productionMinutesMin ?? item.min},${active?.productionMinutesMax ?? item.max},${active?.baseUnitPrice ?? item.price},${active?.minOrderQuantity ?? item.minimum},${quote(material)},${quote(active?.imageKey || groupKeys.get(raw.group) || "flexi")},${quote(active?.description || fallback)},${quote(active?.standardDimensions || fallback)},${quote(active?.approximateWeight || fallback)},${quote(active?.printMethod || `FDM · ${fallback}`)},${active?.layerHeightMm ?? 0.2},${active?.infillPercent ?? 15},${active?.wallCount ?? 3},${active?.nozzleMm ?? 0.4},${quote(active?.supports || fallback)},${quote(active?.assembly || fallback)},${quote(active?.colorOptions || fallback)},${quote(active?.ageRecommendation || fallback)},${quote(active?.usageAreas || fallback)},${quote(active?.packaging || fallback)},${quote(active?.licenseNote || "Ticari üretim öncesi model lisansı doğrulanır.")},${quote(active?.marketSignal || fallback)},${popularityRank ?? "null"},${quote(active?.qualityNote || fallback)},${featured},${published},${popularityRank ?? 1000 + raw.no})`;
}).join(",\n");

const seed = `
-- PRINT_PRODUCTS_SEED
insert into public.print_products (
  id, sku, name, group_name, viral_strength, machine_fit, details,
  production_minutes_min, production_minutes_max, base_unit_price,
  min_order_quantity, material, image_key, description, standard_dimensions,
  approximate_weight, print_method, layer_height_mm, infill_percent, wall_count,
  nozzle_mm, supports, assembly, color_options, age_recommendation, usage_areas,
  packaging, license_note, market_signal, popularity_rank, quality_note,
  is_featured, is_published, sort_order
)
values
${values}
on conflict (sku) do update set
  name = excluded.name,
  group_name = excluded.group_name,
  viral_strength = excluded.viral_strength,
  machine_fit = excluded.machine_fit,
  details = excluded.details,
  production_minutes_min = excluded.production_minutes_min,
  production_minutes_max = excluded.production_minutes_max,
  base_unit_price = excluded.base_unit_price,
  min_order_quantity = excluded.min_order_quantity,
  material = excluded.material,
  image_key = excluded.image_key,
  description = excluded.description,
  standard_dimensions = excluded.standard_dimensions,
  approximate_weight = excluded.approximate_weight,
  print_method = excluded.print_method,
  layer_height_mm = excluded.layer_height_mm,
  infill_percent = excluded.infill_percent,
  wall_count = excluded.wall_count,
  nozzle_mm = excluded.nozzle_mm,
  supports = excluded.supports,
  assembly = excluded.assembly,
  color_options = excluded.color_options,
  age_recommendation = excluded.age_recommendation,
  usage_areas = excluded.usage_areas,
  packaging = excluded.packaging,
  license_note = excluded.license_note,
  market_signal = excluded.market_signal,
  popularity_rank = excluded.popularity_rank,
  quality_note = excluded.quality_note,
  is_featured = excluded.is_featured,
  is_published = excluded.is_published,
  sort_order = excluded.sort_order,
  updated_at = now();

select setval(pg_get_serial_sequence('public.print_products','id'), greatest((select coalesce(max(id), 1) from public.print_products), 1));

-- Yönetim kontrol fonksiyonu anonim çağrıya kapalıdır; otomatik RLS yardımcı fonksiyonu API'den çağrılamaz.
revoke execute on function public.is_admin() from anon;
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
`;
fs.writeFileSync(modulePath, `${source}${seed}`);
const schemaPath = new URL("../supabase/schema.sql", import.meta.url);
const schemaSource = fs.readFileSync(schemaPath, "utf8").split("-- 3D_MODULE_EMBEDDED")[0].trimEnd();
fs.writeFileSync(schemaPath, `${schemaSource}\n\n-- 3D_MODULE_EMBEDDED\n${source}${seed}`);
