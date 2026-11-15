import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const rawProducts = JSON.parse(readFileSync(resolve(root, "lib/print-products-data.json"), "utf8"));
const originalActive = JSON.parse(readFileSync(resolve(root, "lib/active-print-products.json"), "utf8"));
const viral30Active = JSON.parse(readFileSync(resolve(root, "lib/viral-30-products.json"), "utf8"));

const ranks = new Map([
  [1, 1], [46, 2], [14, 3], [207, 4], [87, 5], [82, 6], [96, 7], [208, 8],
  [18, 9], [209, 10], [101, 11], [66, 12], [210, 13], [125, 14], [148, 15],
  [33, 16], [72, 17], [13, 18], [6, 19], [2, 20], [7, 21], [73, 22],
  [84, 23], [206, 24], [15, 25], [68, 26], [67, 27], [91, 28], [158, 29],
  [164, 30],
]);

const rawById = new Map(rawProducts.map((product) => [product.no, product]));
const activeById = new Map([...originalActive, ...viral30Active].map((product) => [product.id, product]));

function sqlText(value) {
  return `'${String(value).replaceAll("'", "''")}'`;
}

function row(id) {
  const raw = rawById.get(id);
  const active = activeById.get(id);
  const rank = ranks.get(id);
  if (!raw || !active || !rank) throw new Error(`Eksik Viral 30 kaydı: ${id}`);
  return `  (${[
    id,
    sqlText(`3D-${String(id).padStart(3, "0")}`),
    sqlText(raw.name),
    sqlText(raw.group),
    raw.viral,
    sqlText(raw.fit),
    sqlText(active.details),
    active.productionMinutesMin,
    active.productionMinutesMax,
    active.baseUnitPrice,
    active.minOrderQuantity,
    sqlText(active.material),
    sqlText(active.imageKey),
    sqlText(active.description),
    sqlText(active.standardDimensions),
    sqlText(active.approximateWeight),
    sqlText(active.printMethod),
    active.layerHeightMm,
    active.infillPercent,
    active.wallCount,
    active.nozzleMm,
    sqlText(active.supports),
    sqlText(active.assembly),
    sqlText(active.colorOptions),
    sqlText(active.ageRecommendation),
    sqlText(active.usageAreas),
    sqlText(active.packaging),
    sqlText(active.licenseNote),
    sqlText(active.marketSignal),
    rank,
    sqlText(active.qualityNote),
    rank <= 6,
    true,
    rank,
  ].join(",")})`;
}

const rows = [...ranks.entries()]
  .sort((a, b) => a[1] - b[1])
  .map(([id]) => row(id))
  .join(",\n");

const updateColumns = [
  "name", "group_name", "viral_strength", "machine_fit", "details",
  "production_minutes_min", "production_minutes_max", "base_unit_price",
  "min_order_quantity", "material", "image_key", "description",
  "standard_dimensions", "approximate_weight", "print_method", "layer_height_mm",
  "infill_percent", "wall_count", "nozzle_mm", "supports", "assembly",
  "color_options", "age_recommendation", "usage_areas", "packaging",
  "license_note", "market_signal", "popularity_rank", "quality_note",
  "is_featured", "is_published", "sort_order",
];

const sql = `-- BÜCÜRÜKTOYS Viral 30 katalog veri güncellemesi.
-- Kaynak: lib/active-print-products.json + lib/viral-30-products.json
begin;

update public.print_products
set
  popularity_rank = null,
  is_featured = false,
  is_published = false,
  sort_order = 1000 + id,
  updated_at = now();

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
${rows}
on conflict (sku) do update set
${updateColumns.map((column) => `  ${column} = excluded.${column}`).join(",\n")},
  updated_at = now();

select setval(
  pg_get_serial_sequence('public.print_products', 'id'),
  greatest((select max(id) from public.print_products), 1),
  true
);

commit;

select
  count(*) as total_products,
  count(*) filter (where is_published) as active_products,
  count(*) filter (where not is_published) as research_products,
  count(*) filter (where is_featured) as featured_products,
  min(popularity_rank) filter (where is_published) as first_rank,
  max(popularity_rank) filter (where is_published) as last_rank
from public.print_products;

select popularity_rank, sku, name
from public.print_products
where is_published
order by popularity_rank;
`;

const output = resolve(root, "supabase/viral_30_catalog.sql");
writeFileSync(output, sql, "utf8");

const marker = "-- VIRAL_30_CATALOG_BEGIN";
for (const filename of ["schema.sql", "3d_module.sql"]) {
  const target = resolve(root, "supabase", filename);
  const current = readFileSync(target, "utf8");
  const baseline = current.includes(marker) ? current.slice(0, current.indexOf(marker)).trimEnd() : current.trimEnd();
  writeFileSync(target, `${baseline}\n\n\n${marker}\n${sql}`, "utf8");
}

console.log(output);
