import rawProducts from "./print-products-data.json";
import activeProductData from "./active-print-products.json";
import viral30ProductData from "./viral-30-products.json";

export type PrintProduct = {
  id: number;
  sku: string;
  name: string;
  group: string;
  viralStrength: number;
  machineFit: "A" | "B" | "C";
  details: string;
  productionMinutesMin: number;
  productionMinutesMax: number;
  baseUnitPrice: number;
  minOrderQuantity: number;
  material: string;
  imageKey: string;
  gallery: string[];
  description: string;
  standardDimensions: string;
  approximateWeight: string;
  printMethod: string;
  layerHeightMm: number;
  infillPercent: number;
  wallCount: number;
  nozzleMm: number;
  supports: string;
  assembly: string;
  colorOptions: string;
  ageRecommendation: string;
  usageAreas: string;
  packaging: string;
  licenseNote: string;
  marketSignal: string;
  popularityRank: number | null;
  qualityNote: string;
  isFeatured: boolean;
  isPublished: boolean;
  sortOrder: number;
  updatedAt: string;
};

export type PrintProductRow = {
  id: number;
  sku: string;
  name: string;
  group_name: string;
  viral_strength: number;
  machine_fit: "A" | "B" | "C";
  details: string;
  production_minutes_min: number;
  production_minutes_max: number;
  base_unit_price: number | string;
  min_order_quantity: number;
  material: string;
  image_key: string;
  gallery?: unknown;
  description?: string;
  standard_dimensions?: string;
  approximate_weight?: string;
  print_method?: string;
  layer_height_mm?: number | string;
  infill_percent?: number;
  wall_count?: number;
  nozzle_mm?: number | string;
  supports?: string;
  assembly?: string;
  color_options?: string;
  age_recommendation?: string;
  usage_areas?: string;
  packaging?: string;
  license_note?: string;
  market_signal?: string;
  popularity_rank?: number | null;
  quality_note?: string;
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
  updated_at?: string;
};

type RawProduct = {
  no: number;
  name: string;
  group: string;
  viral: number;
  fit: "A" | "B" | "C";
  details: string;
};

const GROUP_KEYS = new Map<string, string>([
  ["Eklemli hayvanlar, flexi oyuncaklar ve masaüstü dostları", "flexi"],
  ["Aksiyon figürleri, dönüşen oyuncaklar ve araçlar", "action"],
  ["Fidget, clicker, mekanik ve duyusal ürünler", "fidget"],
  ["Anahtarlık, çanta süsü, magnet ve küçük işlevsel hediyeler", "custom"],
  ["Ev dekoru, saksı, vazo ve masaüstü düzenleyiciler", "decor"],
  ["Işıklı ve duvar dekoru ürünleri", "decor"],
  ["Koleksiyon, masa oyunu ve eğitim ürünleri", "collection"],
  ["Sezonluk ve olay bazlı viral ürünler", "collection"],
]);

type ActiveProductData = {
  id: number;
  details: string;
  description: string;
  productionMinutesMin: number;
  productionMinutesMax: number;
  baseUnitPrice: number;
  minOrderQuantity: number;
  material: string;
  imageKey: string;
  standardDimensions: string;
  approximateWeight: string;
  printMethod: string;
  layerHeightMm: number;
  infillPercent: number;
  wallCount: number;
  nozzleMm: number;
  supports: string;
  assembly: string;
  colorOptions: string;
  ageRecommendation: string;
  usageAreas: string;
  packaging: string;
  licenseNote: string;
  marketSignal: string;
  popularityRank: number;
  qualityNote: string;
};

const VIRAL_30_RANKS = new Map<number, number>([
  [1, 1],
  [46, 2],
  [14, 3],
  [207, 4],
  [87, 5],
  [82, 6],
  [96, 7],
  [208, 8],
  [18, 9],
  [209, 10],
  [101, 11],
  [66, 12],
  [210, 13],
  [125, 14],
  [148, 15],
  [33, 16],
  [72, 17],
  [13, 18],
  [6, 19],
  [2, 20],
  [7, 21],
  [73, 22],
  [84, 23],
  [206, 24],
  [15, 25],
  [68, 26],
  [67, 27],
  [91, 28],
  [158, 29],
  [164, 30],
]);

const ACTIVE_PRODUCTS = new Map(
  [...(activeProductData as ActiveProductData[]), ...(viral30ProductData as ActiveProductData[])]
    .map((product) => [product.id, {
      ...product,
      popularityRank: VIRAL_30_RANKS.get(product.id) ?? product.popularityRank,
    }]),
);

function estimate(raw: RawProduct) {
  const value = `${raw.name} ${raw.details}`.toLocaleLowerCase("tr-TR");
  let min = 90;
  let max = 360;
  let price = 110;
  let minimum = 5;

  if (raw.no <= 45) {
    min = 90; max = 360; price = 115; minimum = 5;
  } else if (raw.no <= 65) {
    min = 150; max = 540; price = 185; minimum = 3;
  } else if (raw.no <= 95) {
    min = 30; max = 150; price = 62; minimum = 10;
  } else if (raw.no <= 122) {
    min = 20; max = 90; price = 42; minimum = 20;
  } else if (raw.no <= 147) {
    min = 90; max = 480; price = 145; minimum = 5;
  } else if (raw.no <= 163) {
    min = 180; max = 720; price = 310; minimum = 2;
  } else if (raw.no <= 186) {
    min = 75; max = 360; price = 125; minimum = 5;
  } else {
    min = 30; max = 180; price = 58; minimum = 20;
  }

  if (/dragon|ejderha|ahtapot/.test(value)) {
    min = 240; max = 720; price = 220; minimum = 3;
  }
  if (/dummy 13|lucky 13|carbon 13/.test(value)) {
    min = 360; max = 900; price = 340; minimum = 1;
  }
  if (/mini 13/.test(value)) {
    min = 180; max = 480; price = 210; minimum = 2;
  }
  if (/anahtarlık|jeton|klips|etiketi|pasta üstü/.test(value)) {
    min = Math.min(min, 20); max = Math.min(max, 60); price = Math.min(price, 42); minimum = Math.max(minimum, 20);
  }
  if (/clicker|flexi grid|gyro halkaları|infinity cube/.test(value)) {
    min = 30; max = 120; price = 68; minimum = 10;
  }
  if (/litofan|lamba|led tabela|abajur|book nook/.test(value)) {
    min = Math.max(min, 240); max = Math.max(max, 720); price = Math.max(price, 390); minimum = 1;
  }
  if (/vazo|saksı|kalemlik|standı|kutu/.test(value)) {
    min = Math.max(min, 90); max = Math.max(max, 360); price = Math.max(price, 145); minimum = Math.min(minimum, 5);
  }
  if (raw.fit === "B") {
    max = Math.round(max * 1.25); price = Math.round(price * 1.12);
  } else if (raw.fit === "C") {
    min = Math.round(min * 1.35); max = Math.round(max * 1.7); price = Math.round(price * 1.35);
  }
  if (raw.no === 207) {
    min = 60; max = 180; price = 85; minimum = 10;
  }
  if (raw.no === 46) {
    min = 360; max = 900;
  }
  if (raw.no === 96) {
    min = 20; max = 60;
  }
  return { min, max, price, minimum };
}

export const printProductGroups = Array.from(new Set(
  (rawProducts as RawProduct[])
    .filter((item) => ACTIVE_PRODUCTS.has(item.no))
    .map((item) => item.group),
));

export const seedPrintProducts: PrintProduct[] = (rawProducts as RawProduct[]).map((raw) => {
  const estimateResult = estimate(raw);
  const active = ACTIVE_PRODUCTS.get(raw.no);
  return {
    id: raw.no,
    sku: `3D-${String(raw.no).padStart(3, "0")}`,
    name: raw.name,
    group: raw.group,
    viralStrength: raw.viral,
    machineFit: raw.fit,
    details: active?.details ?? raw.details,
    productionMinutesMin: active?.productionMinutesMin ?? estimateResult.min,
    productionMinutesMax: active?.productionMinutesMax ?? estimateResult.max,
    baseUnitPrice: active?.baseUnitPrice ?? estimateResult.price,
    minOrderQuantity: active?.minOrderQuantity ?? estimateResult.minimum,
    material: active?.material ?? (raw.fit === "C" ? "PLA / PETG — ürüne göre" : "PLA"),
    imageKey: active?.imageKey ?? GROUP_KEYS.get(raw.group) ?? "flexi",
    gallery: [],
    description: active?.description ?? "DOLDURULACAK",
    standardDimensions: active?.standardDimensions ?? "DOLDURULACAK",
    approximateWeight: active?.approximateWeight ?? "DOLDURULACAK",
    printMethod: active?.printMethod ?? "FDM · DOLDURULACAK",
    layerHeightMm: active?.layerHeightMm ?? 0.2,
    infillPercent: active?.infillPercent ?? 15,
    wallCount: active?.wallCount ?? 3,
    nozzleMm: active?.nozzleMm ?? 0.4,
    supports: active?.supports ?? "DOLDURULACAK",
    assembly: active?.assembly ?? "DOLDURULACAK",
    colorOptions: active?.colorOptions ?? "DOLDURULACAK",
    ageRecommendation: active?.ageRecommendation ?? "DOLDURULACAK",
    usageAreas: active?.usageAreas ?? "DOLDURULACAK",
    packaging: active?.packaging ?? "DOLDURULACAK",
    licenseNote: active?.licenseNote ?? "Ticari üretim öncesi model lisansı doğrulanır.",
    marketSignal: active?.marketSignal ?? "DOLDURULACAK",
    popularityRank: active?.popularityRank ?? null,
    qualityNote: active?.qualityNote ?? "DOLDURULACAK",
    isFeatured: Boolean(active && active.popularityRank <= 6),
    isPublished: Boolean(active),
    sortOrder: active?.popularityRank ?? 1000 + raw.no,
    updatedAt: "2026-07-24T00:00:00+03:00",
  };
}).sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);

export function rowToPrintProduct(row: PrintProductRow): PrintProduct {
  return {
    id: Number(row.id),
    sku: row.sku,
    name: row.name,
    group: row.group_name,
    viralStrength: Number(row.viral_strength),
    machineFit: row.machine_fit,
    details: row.details,
    productionMinutesMin: Number(row.production_minutes_min),
    productionMinutesMax: Number(row.production_minutes_max),
    baseUnitPrice: Number(row.base_unit_price),
    minOrderQuantity: Number(row.min_order_quantity),
    material: row.material,
    imageKey: row.image_key,
    gallery: Array.isArray(row.gallery) ? row.gallery.filter((item): item is string => typeof item === "string") : [],
    description: row.description || "DOLDURULACAK",
    standardDimensions: row.standard_dimensions || "DOLDURULACAK",
    approximateWeight: row.approximate_weight || "DOLDURULACAK",
    printMethod: row.print_method || "FDM · DOLDURULACAK",
    layerHeightMm: Number(row.layer_height_mm ?? 0.2),
    infillPercent: Number(row.infill_percent ?? 15),
    wallCount: Number(row.wall_count ?? 3),
    nozzleMm: Number(row.nozzle_mm ?? 0.4),
    supports: row.supports || "DOLDURULACAK",
    assembly: row.assembly || "DOLDURULACAK",
    colorOptions: row.color_options || "DOLDURULACAK",
    ageRecommendation: row.age_recommendation || "DOLDURULACAK",
    usageAreas: row.usage_areas || "DOLDURULACAK",
    packaging: row.packaging || "DOLDURULACAK",
    licenseNote: row.license_note || "Ticari üretim öncesi model lisansı doğrulanır.",
    marketSignal: row.market_signal || "DOLDURULACAK",
    popularityRank: row.popularity_rank == null ? null : Number(row.popularity_rank),
    qualityNote: row.quality_note || "DOLDURULACAK",
    isFeatured: Boolean(row.is_featured),
    isPublished: Boolean(row.is_published),
    sortOrder: Number(row.sort_order),
    updatedAt: row.updated_at ?? "2026-07-24T00:00:00+03:00",
  };
}

const CURATED_PRODUCT_IMAGES = new Map<number, string>([
  [1, "/assets/3d/products/crystal-dragon.webp"],
  [2, "/assets/3d/products/baby-dragon-egg.webp"],
  [6, "/assets/3d/products/mini-dragon-keychain.webp"],
  [7, "/assets/3d/products/flexi-rex.webp"],
  [13, "/assets/3d/products/flexi-axolotl.webp"],
  [14, "/assets/3d/products/flexi-octopus.webp"],
  [33, "/assets/3d/products/capybara.webp"],
  [46, "/assets/3d/products/dummy-13.webp"],
  [66, "/assets/3d/products/infinity-cube.webp"],
  [72, "/assets/3d/products/mechanical-switch-clicker.webp"],
  [73, "/assets/3d/products/clicker-cube.webp"],
  [84, "/assets/3d/products/flexi-grid.webp"],
  [96, "/assets/3d/products/name-keychain.webp"],
  [206, "/assets/3d/products/party-fidget-pack.webp"],
  [207, "/assets/3d/products/fruit-turtle-clicker.webp"],
  [15, "/assets/3d/products/articulated-slug.webp"],
  [18, "/assets/3d/products/flexi-snake-spider.webp"],
  [67, "/assets/3d/products/gyro-rings.webp"],
  [68, "/assets/3d/products/gear-cube.webp"],
  [82, "/assets/3d/products/bolt-action-clicker.webp"],
  [87, "/assets/3d/products/press-spin-helix-ball.webp"],
  [91, "/assets/3d/products/impossible-passthrough.webp"],
  [101, "/assets/3d/products/mini-animal-keychains.webp"],
  [125, "/assets/3d/products/geometric-mini-planter.webp"],
  [148, "/assets/3d/products/lithophane-photo-panel.webp"],
  [158, "/assets/3d/products/hueforge-art-panel.webp"],
  [164, "/assets/3d/products/blind-box-mini-animals.webp"],
  [208, "/assets/3d/products/expanding-iris-fidget.webp"],
  [209, "/assets/3d/products/retractable-saber-keychain.webp"],
  [210, "/assets/3d/products/slide-action-keychain.webp"],
]);

export function printProductImage(productOrKey: Pick<PrintProduct, "id" | "imageKey"> | string, size?: 320 | 640) {
  if (typeof productOrKey !== "string") {
    if (/^https?:\/\//i.test(productOrKey.imageKey)) return productOrKey.imageKey;
    const curatedImage = CURATED_PRODUCT_IMAGES.get(productOrKey.id);
    if (curatedImage) {
      const sizedImage = size ? curatedImage.replace("/assets/3d/products/", `/assets/3d/products/${size}/`) : curatedImage;
      return `/media${sizedImage}`;
    }
  }
  const imageKey = typeof productOrKey === "string" ? productOrKey : productOrKey.imageKey;
  if (/^https?:\/\//i.test(imageKey)) return imageKey;
  const supported = new Set(["flexi", "action", "fidget", "custom", "decor", "collection"]);
  const key = supported.has(imageKey) ? imageKey : "flexi";
  return `/media/assets/3d/${key}-family.webp`;
}

export function printProductGalleryImage(source: string) {
  if (/^https?:\/\//i.test(source) || source.startsWith("/")) return source;
  return printProductImage(source);
}

export function printProductSrcSet(product: Pick<PrintProduct, "id" | "imageKey">) {
  const image = printProductImage(product);
  if (!image.startsWith("/media/assets/3d/products/")) return undefined;
  return `${printProductImage(product, 320)} 320w, ${printProductImage(product, 640)} 640w, ${image} 1536w`;
}

export function quantityDiscount(quantity: number) {
  if (quantity >= 250) return 0.3;
  if (quantity >= 100) return 0.24;
  if (quantity >= 50) return 0.18;
  if (quantity >= 25) return 0.12;
  if (quantity >= 10) return 0.07;
  return 0;
}

export function calculatePrintPrice(baseUnitPrice: number, quantity: number) {
  const safeQuantity = Math.max(1, Math.min(100000, Math.floor(quantity || 1)));
  const discount = quantityDiscount(safeQuantity);
  const unitPrice = Math.round(baseUnitPrice * (1 - discount) * 100) / 100;
  return {
    quantity: safeQuantity,
    discount,
    unitPrice,
    total: Math.round(unitPrice * safeQuantity * 100) / 100,
  };
}

export function formatPrintTime(minutes: number) {
  if (minutes < 60) return `${minutes} dk`;
  const hours = minutes / 60;
  return Number.isInteger(hours) ? `${hours} sa` : `${hours.toLocaleString("tr-TR", { maximumFractionDigits: 1 })} sa`;
}
