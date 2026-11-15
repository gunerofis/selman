import fs from "node:fs";

const activeProducts = JSON.parse(
  fs.readFileSync(new URL("../lib/active-print-products.json", import.meta.url), "utf8"),
);

const quote = (value) => `'${String(value).replaceAll("'", "''")}'`;
const values = activeProducts.map((product) => `  (
    ${product.id}, ${quote(product.details)}, ${product.productionMinutesMin}, ${product.productionMinutesMax},
    ${product.baseUnitPrice}, ${product.minOrderQuantity}, ${quote(product.material)}, ${quote(product.imageKey)},
    ${quote(product.description)}, ${quote(product.standardDimensions)}, ${quote(product.approximateWeight)},
    ${quote(product.printMethod)}, ${product.layerHeightMm}, ${product.infillPercent}, ${product.wallCount},
    ${product.nozzleMm}, ${quote(product.supports)}, ${quote(product.assembly)}, ${quote(product.colorOptions)},
    ${quote(product.ageRecommendation)}, ${quote(product.usageAreas)}, ${quote(product.packaging)},
    ${quote(product.licenseNote)}, ${quote(product.marketSignal)}, ${product.popularityRank}, ${quote(product.qualityNote)}
  )`).join(",\n");

process.stdout.write(`
alter table public.print_products add column if not exists description text not null default 'DOLDURULACAK';
alter table public.print_products add column if not exists standard_dimensions text not null default 'DOLDURULACAK';
alter table public.print_products add column if not exists approximate_weight text not null default 'DOLDURULACAK';
alter table public.print_products add column if not exists print_method text not null default 'FDM · DOLDURULACAK';
alter table public.print_products add column if not exists layer_height_mm numeric(4,2) not null default 0.20 check (layer_height_mm between 0.05 and 2);
alter table public.print_products add column if not exists infill_percent smallint not null default 15 check (infill_percent between 0 and 100);
alter table public.print_products add column if not exists wall_count smallint not null default 3 check (wall_count between 1 and 20);
alter table public.print_products add column if not exists nozzle_mm numeric(4,2) not null default 0.40 check (nozzle_mm between 0.10 and 2);
alter table public.print_products add column if not exists supports text not null default 'DOLDURULACAK';
alter table public.print_products add column if not exists assembly text not null default 'DOLDURULACAK';
alter table public.print_products add column if not exists color_options text not null default 'DOLDURULACAK';
alter table public.print_products add column if not exists age_recommendation text not null default 'DOLDURULACAK';
alter table public.print_products add column if not exists usage_areas text not null default 'DOLDURULACAK';
alter table public.print_products add column if not exists packaging text not null default 'DOLDURULACAK';
alter table public.print_products add column if not exists license_note text not null default 'Ticari üretim öncesi model lisansı doğrulanır.';
alter table public.print_products add column if not exists market_signal text not null default 'DOLDURULACAK';
alter table public.print_products add column if not exists popularity_rank integer check (popularity_rank is null or popularity_rank > 0);
alter table public.print_products add column if not exists quality_note text not null default 'DOLDURULACAK';

update public.print_products
set is_published = false,
    is_featured = false,
    popularity_rank = null,
    sort_order = 1000 + id,
    updated_at = now();

update public.print_products as product
set details = curated.details,
    production_minutes_min = curated.production_minutes_min,
    production_minutes_max = curated.production_minutes_max,
    base_unit_price = curated.base_unit_price,
    min_order_quantity = curated.min_order_quantity,
    material = curated.material,
    image_key = curated.image_key,
    description = curated.description,
    standard_dimensions = curated.standard_dimensions,
    approximate_weight = curated.approximate_weight,
    print_method = curated.print_method,
    layer_height_mm = curated.layer_height_mm,
    infill_percent = curated.infill_percent,
    wall_count = curated.wall_count,
    nozzle_mm = curated.nozzle_mm,
    supports = curated.supports,
    assembly = curated.assembly,
    color_options = curated.color_options,
    age_recommendation = curated.age_recommendation,
    usage_areas = curated.usage_areas,
    packaging = curated.packaging,
    license_note = curated.license_note,
    market_signal = curated.market_signal,
    popularity_rank = curated.popularity_rank,
    quality_note = curated.quality_note,
    is_featured = curated.popularity_rank <= 6,
    is_published = true,
    sort_order = curated.popularity_rank,
    updated_at = now()
from (
  values
${values}
) as curated (
  id, details, production_minutes_min, production_minutes_max, base_unit_price,
  min_order_quantity, material, image_key, description, standard_dimensions,
  approximate_weight, print_method, layer_height_mm, infill_percent, wall_count,
  nozzle_mm, supports, assembly, color_options, age_recommendation, usage_areas,
  packaging, license_note, market_signal, popularity_rank, quality_note
)
where product.id = curated.id;

create unique index if not exists print_products_popularity_rank_idx
  on public.print_products (popularity_rank)
  where popularity_rank is not null;

notify pgrst, 'reload schema';
`);
