import { env } from "cloudflare:workers";
import legacyProducts from "../products.json";

export type StoreProduct = {
  id: number;
  slug: string;
  name: string;
  model: string;
  color: string;
  sku: string;
  priceCents: number;
  oldPriceCents: number | null;
  stockQuantity: number;
  trackStock: boolean;
  active: boolean;
  featured: boolean;
  shortDescription: string;
  description: string;
  primaryImage: string;
  images: string[];
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
};

export type StoreSettings = Record<string, string>;

export const defaultSettings: StoreSettings = {
  brandName: "Moneluks",
  tagline: "Saat ve Aksesuar Kutuları",
  heroTitle: "Değer verdiklerinize iyi bakın.",
  heroDescription: "Saatler, gözlükler ve kişisel parçalar için düzenli, korunaklı ve zamansız saklama çözümleri.",
  contactEmail: "info@gunerofis.com",
  contactPhone: "+90 555 897 3874",
  seoTitle: "Moneluks | Deri Saat ve Aksesuar Kutuları",
  seoDescription: "Saat, gözlük ve kişisel aksesuarlar için cam kapaklı, çekmeceli ve bölmeli deri kutu koleksiyonu.",
  shippingNote: "Kargo tutarı sipariş onayında netleşir.",
};

const modelNames: Record<string, string> = {
  GNRS01: "6'lı Klasik",
  GNRS03: "12'li Koleksiyon",
  GNRS04: "Saat & Gözlük",
  GNRS05: "Çekmeceli Duo",
  GNRS06: "Saat, Gözlük & Yüzük",
  GNRS07: "Çekmeceli Aksesuar",
};
const colors = ["Siyah", "Kahve", "Taba", "Bordo", "Krem"];

function priceTextToCents(value: string) {
  if (!value) return null;
  const normalized = value.replace(/\./g, "").replace(",", ".").replace(/[^0-9.]/g, "");
  const amount = Number(normalized);
  return Number.isFinite(amount) ? Math.round(amount * 100) : null;
}

export const fallbackProducts: StoreProduct[] = (legacyProducts as Array<Record<string, unknown>>).map((item, index) => {
  const sku = String(item.sku || "");
  const code = sku.split("-")[0].toLocaleUpperCase("tr-TR");
  const identity = `${sku} ${String(item.name || "")}`.toLocaleLowerCase("tr-TR");
  const color = colors.find((value) => identity.includes(value.toLocaleLowerCase("tr-TR"))) || "Diğer";
  const images = Array.isArray(item.images) ? item.images.map(String) : [];
  const primaryImage = String(item.image || images[0] || "");
  return {
    id: index + 1,
    slug: String(item.slug),
    name: String(item.name),
    model: modelNames[code] || "Saat Kutusu",
    color,
    sku,
    priceCents: Math.round(Number(item.price || 0) * 100),
    oldPriceCents: priceTextToCents(String(item.oldPrice || "")),
    stockQuantity: 0,
    trackStock: false,
    active: true,
    featured: code === "GNRS07" && color === "Siyah",
    shortDescription: String(item.shortDescription || ""),
    description: String(item.description || ""),
    primaryImage,
    images: primaryImage ? [primaryImage, ...images.filter((image) => image !== primaryImage)] : images,
    metaTitle: String(item.metaTitle || `${String(item.name)} | Moneluks`).replace(/\|\s*Kronora$/i, "| Moneluks"),
    metaDescription: String(item.metaDescription || item.shortDescription || ""),
    keywords: Array.isArray(item.keywords) ? item.keywords.map(String).filter((value) => !value.toLocaleLowerCase("tr-TR").includes("güner")).map((value) => value === "Kronora" ? "Moneluks" : value) : [],
  };
});

const productColors = [
  { name: "Siyah", slug: "siyah", sku: "SYH" },
  { name: "Bordo", slug: "bordo", sku: "BRD" },
  { name: "Kahve", slug: "kahve", sku: "KHV" },
  { name: "Krem", slug: "krem", sku: "KRM" },
  { name: "Taba", slug: "taba", sku: "TBA" },
] as const;

const draftFamilies = [
  { baseSlug: "tekli-deri-saat-kutusu", name: "Tekli Deri Saat Kutusu", model: "Tekli Saat Kutusu", sku: "KR-TSAAT", shortDescription: "Tek bir kol saatini evde, ofiste veya seyahatte düzenli tutmak için kompakt deri saat kutusu.", description: "Favori saatiniz için tek parçaya göre kurgulanan kompakt saklama alanı.", metaDescription: "Tek bir kol saatini korumak, düzenlemek ve seyahatte taşımak için kompakt deri saat kutusu.", keywords: ["tekli saat kutusu", "deri saat kutusu", "seyahat saat kutusu"] },
  { baseSlug: "gozluk-ve-airpods-kombine-kutu", name: "Gözlük ve AirPods Kombine Kutu", model: "Gözlük & AirPods", sku: "KR-GA", shortDescription: "Gözlük ve AirPods şarj kutusunu birbirinden ayrılmış bölmelerde bir arada tutan kombine deri kutu.", description: "Günlük kullanılan gözlük ve kablosuz kulaklığı tek noktada düzenlemek için iki ayrı bölmeli kompakt kutu.", metaDescription: "Gözlük ve AirPods için ayrı bölmeler sunan kompakt kombine deri kutu.", keywords: ["gözlük airpods kutusu", "airpods organizer", "kombine aksesuar kutusu"] },
  { baseSlug: "tekli-deri-gozluk-kutusu", name: "Tekli Deri Gözlük Kutusu", model: "Tekli Gözlük Kutusu", sku: "KR-TGOZ", shortDescription: "Optik veya güneş gözlüğünü günlük kullanımda ayrı ve kolay erişilir tutan tekli deri gözlük kutusu.", description: "Tek bir gözlük için uzun iç hacim ve yumuşak temas yüzeyi sunan masa üstü saklama çözümü.", metaDescription: "Tek bir optik veya güneş gözlüğünü düzenli saklamak için deri kaplamalı gözlük kutusu.", keywords: ["tekli gözlük kutusu", "deri gözlük kutusu", "güneş gözlüğü kutusu"] },
  { baseSlug: "cok-bolmeli-deri-organizer", name: "Çok Bölmeli Deri Organizer", model: "Organizer", sku: "KR-ORG", shortDescription: "Saat, gözlük, kulaklık, anahtar ve küçük aksesuarları tek düzende toplayan çok bölmeli deri organizer.", description: "Farklı boyutlardaki günlük parçalar için ayrılmış bölmeler sunan masa üstü organizer.", metaDescription: "Saat, gözlük, kulaklık ve küçük aksesuarlar için çok bölmeli deri organizer.", keywords: ["deri organizer", "çok bölmeli organizer", "aksesuar organizeri"] },
] as const;

const categoryDraftProducts: StoreProduct[] = draftFamilies.flatMap((family) => productColors.map((color) => ({
  id: 0,
  slug: `${family.baseSlug}-${color.slug}`,
  name: `${family.name} ${color.name}`,
  model: family.model,
  color: color.name,
  sku: `${family.sku}-${color.sku}`,
  priceCents: 0,
  oldPriceCents: null,
  stockQuantity: 0,
  trackStock: true,
  active: false,
  featured: false,
  shortDescription: `${color.name} renkli ${family.shortDescription.charAt(0).toLocaleLowerCase("tr-TR")}${family.shortDescription.slice(1)}`,
  description: `${family.description} ${color.name} renk varyantıdır. Ürünü satışa açmadan önce gerçek görselleri, ölçüleri, fiyatı ve stok bilgisini yönetim panelinden tamamlayın.`,
  primaryImage: "",
  images: [],
  metaTitle: `${family.name} ${color.name} | Moneluks`,
  metaDescription: `${family.metaDescription} ${color.name} renk seçeneği.`,
  keywords: [...family.keywords, color.name.toLocaleLowerCase("tr-TR")],
})));

export function getD1OrNull(): D1Database | null {
  try {
    return (env as unknown as { DB?: D1Database }).DB || null;
  } catch {
    return null;
  }
}

function parseArray(value: unknown): string[] {
  try {
    const parsed = JSON.parse(String(value || "[]"));
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function rowToProduct(row: Record<string, unknown>): StoreProduct {
  return {
    id: Number(row.id),
    slug: String(row.slug),
    name: String(row.name),
    model: String(row.model),
    color: String(row.color),
    sku: String(row.sku || ""),
    priceCents: Number(row.price_cents || 0),
    oldPriceCents: row.old_price_cents === null || row.old_price_cents === undefined ? null : Number(row.old_price_cents),
    stockQuantity: Number(row.stock_quantity || 0),
    trackStock: Boolean(row.track_stock),
    active: Boolean(row.active),
    featured: Boolean(row.featured),
    shortDescription: String(row.short_description || ""),
    description: String(row.description || ""),
    primaryImage: String(row.primary_image || ""),
    images: parseArray(row.images_json),
    metaTitle: String(row.meta_title || "").replace(/\|\s*Kronora$/i, "| Moneluks"),
    metaDescription: String(row.meta_description || ""),
    keywords: parseArray(row.keywords_json).map((value) => value === "Kronora" ? "Moneluks" : value),
  };
}

async function ensureCategoryDraftProducts(db: D1Database) {
  const marker = await db.prepare("SELECT value FROM settings WHERE key = ? LIMIT 1").bind("catalog_color_variants_v1").first<{ value: string }>();
  if (marker?.value === "ready") return;
  const now = Math.floor(Date.now() / 1000);
  const legacyDraftSlugs = ["tekli-deri-saat-kutusu", "gozluk-ve-airpods-kombine-kutu", "tekli-deri-gozluk-kutusu", "cok-bolmeli-deri-organizer"];
  const statements = legacyDraftSlugs.map((slug) => db.prepare("DELETE FROM products WHERE slug = ? AND active = 0 AND price_cents = 0 AND primary_image = ''").bind(slug));
  statements.push(...categoryDraftProducts.map((product) => db.prepare(`
    INSERT OR IGNORE INTO products (
      slug, name, model, color, sku, price_cents, old_price_cents, stock_quantity,
      track_stock, active, featured, short_description, description, primary_image,
      images_json, meta_title, meta_description, keywords_json, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    product.slug, product.name, product.model, product.color, product.sku, product.priceCents,
    product.oldPriceCents, product.stockQuantity, product.trackStock ? 1 : 0, 0, 0,
    product.shortDescription, product.description, product.primaryImage, JSON.stringify(product.images),
    product.metaTitle, product.metaDescription, JSON.stringify(product.keywords), now, now,
  )));
  statements.push(db.prepare("INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at").bind("catalog_color_variants_v1", "ready", now));
  await db.batch(statements);
}

export async function ensureCatalogSeeded(db: D1Database) {
  const count = await db.prepare("SELECT COUNT(*) AS count FROM products").first<{ count: number }>();
  if (Number(count?.count || 0) === 0) {
    const now = Math.floor(Date.now() / 1000);
    const statements = fallbackProducts.map((product) => db.prepare(`
      INSERT INTO products (
        slug, name, model, color, sku, price_cents, old_price_cents, stock_quantity,
        track_stock, active, featured, short_description, description, primary_image,
        images_json, meta_title, meta_description, keywords_json, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      product.slug, product.name, product.model, product.color, product.sku, product.priceCents,
      product.oldPriceCents, product.stockQuantity, product.trackStock ? 1 : 0, product.active ? 1 : 0,
      product.featured ? 1 : 0, product.shortDescription, product.description, product.primaryImage,
      JSON.stringify(product.images), product.metaTitle, product.metaDescription, JSON.stringify(product.keywords), now, now,
    ));
    await db.batch(statements);
  }
  await ensureCategoryDraftProducts(db);
}

export async function getProducts(options: { includeInactive?: boolean; seed?: boolean } = {}): Promise<StoreProduct[]> {
  const db = getD1OrNull();
  if (!db) return fallbackProducts.filter((product) => options.includeInactive || product.active);
  try {
    await ensureCatalogSeeded(db);
    const sql = `SELECT * FROM products ${options.includeInactive ? "" : "WHERE active = 1"} ORDER BY featured DESC, id ASC`;
    const result = await db.prepare(sql).all<Record<string, unknown>>();
    if (!result.results.length) return fallbackProducts.filter((product) => options.includeInactive || product.active);
    return result.results.map(rowToProduct);
  } catch {
    return fallbackProducts.filter((product) => options.includeInactive || product.active);
  }
}

export async function getProductBySlug(slug: string): Promise<StoreProduct | null> {
  const db = getD1OrNull();
  if (db) {
    try {
      const row = await db.prepare("SELECT * FROM products WHERE slug = ? AND active = 1 LIMIT 1").bind(slug).first<Record<string, unknown>>();
      if (row) return rowToProduct(row);
    } catch { /* fallback below */ }
  }
  return fallbackProducts.find((product) => product.slug === slug && product.active) || null;
}

export async function getSettings(): Promise<StoreSettings> {
  const db = getD1OrNull();
  if (!db) return { ...defaultSettings };
  try {
    const result = await db.prepare("SELECT key, value FROM settings").all<{ key: string; value: string }>();
    const settings = { ...defaultSettings, ...Object.fromEntries(result.results.map((row) => [row.key, row.value])) };
    if (!settings.brandName || settings.brandName === "Kronora") settings.brandName = defaultSettings.brandName;
    if (!settings.heroTitle || settings.heroTitle === "Zamanınıza yakışan bir yer.") settings.heroTitle = defaultSettings.heroTitle;
    if (!settings.heroDescription || settings.heroDescription.includes("Saat koleksiyonları için")) settings.heroDescription = defaultSettings.heroDescription;
    if (!settings.contactEmail) settings.contactEmail = defaultSettings.contactEmail;
    if (!settings.contactPhone) settings.contactPhone = defaultSettings.contactPhone;
    if (!settings.seoTitle || settings.seoTitle.includes("Kronora")) settings.seoTitle = defaultSettings.seoTitle;
    if (!settings.seoDescription) settings.seoDescription = defaultSettings.seoDescription;
    return settings;
  } catch {
    return { ...defaultSettings };
  }
}

export async function getActiveScripts(placement: "head" | "body") {
  const db = getD1OrNull();
  if (!db) return [] as Array<{ id: number; code: string }>;
  try {
    const result = await db.prepare("SELECT id, code FROM custom_scripts WHERE active = 1 AND placement = ? ORDER BY id ASC").bind(placement).all<{ id: number; code: string }>();
    return result.results;
  } catch {
    return [] as Array<{ id: number; code: string }>;
  }
}

export { rowToProduct };
