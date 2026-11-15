import { type ProductRow } from "./products";
import type { PrintProductRow } from "./print-products";
import { MISSING_VALUE } from "./business-info";

type SupabaseConfig = {
  url: string;
  anonKey: string;
  adminEmails: string[];
  developerEmail: string;
  bucket: string;
};

export type AdminRole = "developer" | "owner" | "editor" | "viewer";

export type ProductPayload = {
  sku: string;
  name: string;
  category: string;
  pack: string;
  description: string;
  price: number | null;
  costPrice: number | null;
  stock: number;
  barcode: string;
  minOrderPackages: number;
  lowStockThreshold: number;
  supplier: string;
  ageGroup: string;
  conformityDeclaration: string;
  productDimensions: string;
  cartonDimensions: string;
  cartonDesi: number | null;
  cartonWeightKg: number | null;
  originCountry: string;
  safetyNote: string;
  licenseNote: string;
  imageUrl: string;
  gallery: string[];
  isPriceVisible: boolean;
  isPublished: boolean;
  sortOrder: number;
};

export type PrintProductPayload = {
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
};

export function getSupabaseConfig(): SupabaseConfig | null {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const anonKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;
  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLocaleLowerCase("tr-TR"))
    .filter(Boolean);
  const developerEmail = (process.env.DEVELOPER_EMAIL || adminEmails[0] || "")
    .trim()
    .toLocaleLowerCase("tr-TR");
  if (!url || !anonKey || adminEmails.length === 0) return null;
  if ([url, anonKey, ...adminEmails].some((value) => value === MISSING_VALUE.toLocaleLowerCase("tr-TR") || value === MISSING_VALUE)) return null;
  return { url, anonKey, adminEmails, developerEmail, bucket: process.env.SUPABASE_STORAGE_BUCKET || "product-images" };
}

export function getSupabaseSetupStatus() {
  const values = {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY: process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY,
    ADMIN_EMAILS: process.env.ADMIN_EMAILS,
  };
  return Object.entries(values).map(([key, value]) => ({ key, value: value?.trim() && value.trim() !== MISSING_VALUE ? "TANIMLANDI" : "EKSİK" }));
}

export function supabaseAuthHeaders(config: SupabaseConfig, accessToken?: string) {
  return {
    apikey: config.anonKey,
    Authorization: `Bearer ${accessToken || config.anonKey}`,
  };
}

export function supabaseHeaders(config: SupabaseConfig, extra: HeadersInit = {}, accessToken?: string) {
  return {
    ...supabaseAuthHeaders(config, accessToken),
    "Content-Type": "application/json",
    ...extra,
  };
}

export async function supabaseRest<T>(config: SupabaseConfig, path: string, init: RequestInit = {}, accessToken?: string) {
  const response = await fetch(`${config.url}${path}`, {
    ...init,
    headers: supabaseHeaders(config, init.headers, accessToken),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(await response.text());
  const text = await response.text();
  if (!text) return null as T;
  return JSON.parse(text) as T;
}

export async function requireAdmin(request: Request) {
  const config = getSupabaseConfig();
  if (!config) return { ok: false as const, status: 503, message: "Yönetim bağlantısı henüz yapılandırılmadı." };
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return { ok: false as const, status: 401, message: "Oturum açmanız gerekiyor." };
  try {
    const response = await fetch(`${config.url}/auth/v1/user`, {
      headers: { apikey: config.anonKey, Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!response.ok) return { ok: false as const, status: 401, message: "Oturum geçersiz veya süresi dolmuş." };
    const user = (await response.json()) as { id?: string; email?: string };
    const email = user.email?.toLocaleLowerCase("tr-TR");
    if (!email) return { ok: false as const, status: 403, message: "Bu hesap yönetici olarak yetkilendirilmemiş." };
    const rows = await supabaseRest<Array<{ email: string; role: AdminRole; display_name: string | null }>>(
      config,
      `/rest/v1/admin_users?email=eq.${encodeURIComponent(email)}&is_active=eq.true&select=email,role,display_name&limit=1`,
      {},
      token,
    ).catch(() => []);
    const admin = rows[0];
    if (!admin) return { ok: false as const, status: 403, message: "Bu hesap yönetici olarak yetkilendirilmemiş veya oturumu güvenlik nedeniyle kapatılmış." };
    return { ok: true as const, config, accessToken: token, user: { id: user.id ?? "", email, role: admin.role, displayName: admin.display_name ?? email } };
  } catch {
    return { ok: false as const, status: 503, message: "Kimlik doğrulama servisine ulaşılamadı." };
  }
}

export function canAdminWrite(role: string) {
  return role === "developer" || role === "owner" || role === "editor";
}

export function canAdminManageUsers(role: string) {
  return role === "developer" || role === "owner";
}

export async function logAdminAction(
  config: SupabaseConfig,
  accessToken: string,
  actorEmail: string,
  action: string,
  entityType: string,
  entityId?: string | number,
  summary?: string,
  metadata: Record<string, unknown> = {},
) {
  await supabaseRest(config, "/rest/v1/admin_audit_logs", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({ actor_email: actorEmail, action, entity_type: entityType, entity_id: entityId == null ? null : String(entityId), summary: summary || null, metadata }),
  }, accessToken).catch(() => null);
}

export async function fetchProductRows(config: SupabaseConfig, includeDrafts = false, accessToken?: string) {
  const filter = includeDrafts ? "" : "&is_published=eq.true";
  const response = await fetch(`${config.url}/rest/v1/products?select=*&order=sort_order.asc,id.asc${filter}`, {
    headers: supabaseHeaders(config, {}, accessToken),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(await response.text());
  return (await response.json()) as ProductRow[];
}

export async function fetchPrintProductRows(config: SupabaseConfig, includeDrafts = false, accessToken?: string) {
  const filter = includeDrafts ? "" : "&is_published=eq.true";
  const response = await fetch(`${config.url}/rest/v1/print_products?select=*&order=sort_order.asc,id.asc${filter}`, {
    headers: supabaseHeaders(config, {}, accessToken),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(await response.text());
  return (await response.json()) as PrintProductRow[];
}

export function printPayloadToRow(value: PrintProductPayload) {
  return {
      id: value.id,
      sku: value.sku,
      name: value.name,
      group_name: value.group,
      viral_strength: value.viralStrength,
      machine_fit: value.machineFit,
      details: value.details,
      production_minutes_min: value.productionMinutesMin,
      production_minutes_max: value.productionMinutesMax,
      base_unit_price: value.baseUnitPrice,
      min_order_quantity: value.minOrderQuantity,
      material: value.material,
      image_key: value.imageKey,
      description: value.description,
      standard_dimensions: value.standardDimensions,
      approximate_weight: value.approximateWeight,
      print_method: value.printMethod,
      layer_height_mm: value.layerHeightMm,
      infill_percent: value.infillPercent,
      wall_count: value.wallCount,
      nozzle_mm: value.nozzleMm,
      supports: value.supports,
      assembly: value.assembly,
      color_options: value.colorOptions,
      age_recommendation: value.ageRecommendation,
      usage_areas: value.usageAreas,
      packaging: value.packaging,
      license_note: value.licenseNote,
      market_signal: value.marketSignal,
      popularity_rank: value.popularityRank,
      quality_note: value.qualityNote,
      is_featured: value.isFeatured,
      is_published: value.isPublished,
      sort_order: value.sortOrder,
      updated_at: new Date().toISOString(),
  };
}

export async function writePrintProduct(config: SupabaseConfig, method: "POST" | "PATCH" | "DELETE", value: PrintProductPayload | null, id: number, accessToken: string) {
  const response = await fetch(`${config.url}/rest/v1/print_products${method === "POST" ? "" : `?id=eq.${id}`}`, {
    method,
    headers: supabaseHeaders(config, { Prefer: method === "DELETE" ? "return=minimal" : "return=representation" }, accessToken),
    body: value ? JSON.stringify(printPayloadToRow(value)) : undefined,
  });
  if (!response.ok) throw new Error(await response.text());
  if (method === "DELETE") return null;
  const rows = (await response.json()) as PrintProductRow[];
  return rows[0] ?? null;
}

export function validatePrintProductPayload(value: unknown): { ok: true; value: PrintProductPayload } | { ok: false; message: string } {
  if (!value || typeof value !== "object") return { ok: false, message: "Geçersiz 3D ürün verisi." };
  const input = value as Record<string, unknown>;
  const text = (key: string, max: number) => typeof input[key] === "string" ? input[key].trim().slice(0, max) : "";
  const id = Math.floor(Number(input.id));
  const sku = text("sku", 40).toUpperCase();
  const name = text("name", 180);
  const group = text("group", 180);
  const viralStrength = Math.floor(Number(input.viralStrength));
  const machineFit: "A" | "B" | "C" = input.machineFit === "B" || input.machineFit === "C" ? input.machineFit : "A";
  const details = text("details", 1000);
  const productionMinutesMin = Math.floor(Number(input.productionMinutesMin));
  const productionMinutesMax = Math.floor(Number(input.productionMinutesMax));
  const baseUnitPrice = Number(input.baseUnitPrice);
  const minOrderQuantity = Math.floor(Number(input.minOrderQuantity));
  const material = text("material", 120);
  const imageKey = text("imageKey", 40);
  const sortOrder = Math.max(0, Math.floor(Number(input.sortOrder ?? id)));
  const layerHeightMm = Number(input.layerHeightMm);
  const infillPercent = Math.floor(Number(input.infillPercent));
  const wallCount = Math.floor(Number(input.wallCount));
  const nozzleMm = Number(input.nozzleMm);
  const rawPopularityRank = input.popularityRank;
  const popularityRank = rawPopularityRank === null || rawPopularityRank === "" || rawPopularityRank === undefined
    ? null
    : Math.floor(Number(rawPopularityRank));
  if (!Number.isInteger(id) || id < 1 || !/^3D-[0-9]{3,6}$/.test(sku) || !name || !group || !details) return { ok: false, message: "Ürün kodu, adı, grubu ve açıklaması zorunludur." };
  if (!Number.isInteger(viralStrength) || viralStrength < 1 || viralStrength > 5) return { ok: false, message: "Viral güç 1–5 arasında olmalıdır." };
  if (!Number.isInteger(productionMinutesMin) || productionMinutesMin < 1 || productionMinutesMin > 100000) return { ok: false, message: "Minimum üretim süresi geçerli değil." };
  if (!Number.isInteger(productionMinutesMax) || productionMinutesMax < productionMinutesMin || productionMinutesMax > 100000) return { ok: false, message: "Maksimum üretim süresi geçerli değil." };
  if (!Number.isFinite(baseUnitPrice) || baseUnitPrice < 0 || baseUnitPrice > 9999999) return { ok: false, message: "Birim fiyat geçerli değil." };
  if (!Number.isInteger(minOrderQuantity) || minOrderQuantity < 1 || minOrderQuantity > 100000) return { ok: false, message: "Minimum sipariş adedi geçerli değil." };
  if (!Number.isFinite(layerHeightMm) || layerHeightMm < 0.05 || layerHeightMm > 2) return { ok: false, message: "Katman yüksekliği geçerli değil." };
  if (!Number.isInteger(infillPercent) || infillPercent < 0 || infillPercent > 100) return { ok: false, message: "Doluluk oranı geçerli değil." };
  if (!Number.isInteger(wallCount) || wallCount < 1 || wallCount > 20) return { ok: false, message: "Duvar sayısı geçerli değil." };
  if (!Number.isFinite(nozzleMm) || nozzleMm < 0.1 || nozzleMm > 2) return { ok: false, message: "Nozzle çapı geçerli değil." };
  if (popularityRank !== null && (!Number.isInteger(popularityRank) || popularityRank < 1 || popularityRank > 999)) return { ok: false, message: "Popülerlik sırası geçerli değil." };
  return {
    ok: true,
    value: {
      id,
      sku,
      name,
      group,
      viralStrength,
      machineFit,
      details,
      productionMinutesMin,
      productionMinutesMax,
      baseUnitPrice: Math.round(baseUnitPrice * 100) / 100,
      minOrderQuantity,
      material: material || "PLA",
      imageKey: imageKey || "flexi",
      description: text("description", 3000) || MISSING_VALUE,
      standardDimensions: text("standardDimensions", 240) || MISSING_VALUE,
      approximateWeight: text("approximateWeight", 160) || MISSING_VALUE,
      printMethod: text("printMethod", 180) || MISSING_VALUE,
      layerHeightMm: Math.round(layerHeightMm * 100) / 100,
      infillPercent,
      wallCount,
      nozzleMm: Math.round(nozzleMm * 100) / 100,
      supports: text("supports", 1000) || MISSING_VALUE,
      assembly: text("assembly", 1000) || MISSING_VALUE,
      colorOptions: text("colorOptions", 1000) || MISSING_VALUE,
      ageRecommendation: text("ageRecommendation", 500) || MISSING_VALUE,
      usageAreas: text("usageAreas", 1000) || MISSING_VALUE,
      packaging: text("packaging", 1000) || MISSING_VALUE,
      licenseNote: text("licenseNote", 1000) || "Ticari üretim öncesi model lisansı doğrulanır.",
      marketSignal: text("marketSignal", 1500) || MISSING_VALUE,
      popularityRank,
      qualityNote: text("qualityNote", 1000) || MISSING_VALUE,
      isFeatured: Boolean(input.isFeatured),
      isPublished: input.isPublished !== false,
      sortOrder,
    },
  };
}

export async function writeProduct(config: SupabaseConfig, method: "POST" | "PATCH" | "DELETE", body: Record<string, unknown> | null, id: number | undefined, accessToken: string) {
  const suffix = id ? `?id=eq.${id}` : "";
  const response = await fetch(`${config.url}/rest/v1/products${suffix}`, {
    method,
    headers: supabaseHeaders(config, { Prefer: method === "DELETE" ? "return=minimal" : "return=representation" }, accessToken),
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) throw new Error(await response.text());
  if (method === "DELETE") return null;
  const rows = (await response.json()) as ProductRow[];
  return rows[0] ?? null;
}

export function validateProductPayload(value: unknown): { ok: true; value: ProductPayload } | { ok: false; message: string } {
  if (!value || typeof value !== "object") return { ok: false, message: "Geçersiz ürün verisi." };
  const input = value as Record<string, unknown>;
  const text = (key: string, max: number) => typeof input[key] === "string" ? input[key].trim().slice(0, max) : "";
  const sku = text("sku", 40).toUpperCase();
  const name = text("name", 160) || MISSING_VALUE;
  const category = text("category", 30);
  const pack = text("pack", 120) || MISSING_VALUE;
  if (!sku || !/^[A-Z0-9ÇĞİÖŞÜ_-]+$/u.test(sku)) return { ok: false, message: "Geçerli bir ürün kodu girin." };
  if (!/^[a-z0-9-]{2,40}$/.test(category)) return { ok: false, message: "Geçerli bir kategori seçin." };
  const rawPrice = input.price;
  const price = rawPrice === null || rawPrice === "" || rawPrice === undefined ? null : Number(rawPrice);
  const rawCostPrice = input.costPrice;
  const costPrice = rawCostPrice === null || rawCostPrice === "" || rawCostPrice === undefined ? null : Number(rawCostPrice);
  const stock = Math.max(0, Math.floor(Number(input.stock ?? 0)));
  const minOrderPackages = Math.max(1, Math.floor(Number(input.minOrderPackages ?? 1)));
  const lowStockThreshold = Math.max(0, Math.floor(Number(input.lowStockThreshold ?? 5)));
  const sortOrder = Math.max(0, Math.floor(Number(input.sortOrder ?? 0)));
  const rawCartonDesi = input.cartonDesi;
  const cartonDesi = rawCartonDesi === null || rawCartonDesi === "" || rawCartonDesi === undefined ? null : Number(rawCartonDesi);
  const rawCartonWeightKg = input.cartonWeightKg;
  const cartonWeightKg = rawCartonWeightKg === null || rawCartonWeightKg === "" || rawCartonWeightKg === undefined ? null : Number(rawCartonWeightKg);
  if (price !== null && (!Number.isFinite(price) || price < 0 || price > 99999999)) return { ok: false, message: "Fiyat geçerli değil." };
  if (costPrice !== null && (!Number.isFinite(costPrice) || costPrice < 0 || costPrice > 99999999)) return { ok: false, message: "Maliyet fiyatı geçerli değil." };
  if (!Number.isFinite(stock) || stock > 99999999) return { ok: false, message: "Stok değeri geçerli değil." };
  if (!Number.isFinite(minOrderPackages) || minOrderPackages > 9999) return { ok: false, message: "Minimum sipariş miktarı geçerli değil." };
  if (!Number.isFinite(lowStockThreshold) || lowStockThreshold > 99999999) return { ok: false, message: "Kritik stok eşiği geçerli değil." };
  if (cartonDesi !== null && (!Number.isFinite(cartonDesi) || cartonDesi < 0 || cartonDesi > 99999)) return { ok: false, message: "Koli desisi geçerli değil." };
  if (cartonWeightKg !== null && (!Number.isFinite(cartonWeightKg) || cartonWeightKg < 0 || cartonWeightKg > 99999)) return { ok: false, message: "Koli ağırlığı geçerli değil." };
  const gallery = Array.isArray(input.gallery)
    ? input.gallery.filter((item): item is string => typeof item === "string" && /^https?:\/\//i.test(item)).slice(0, 12)
    : [];
  const imageUrl = text("imageUrl", 1000);
  if (imageUrl && !/^https?:\/\//i.test(imageUrl) && !/^[\w.-]+$/u.test(imageUrl)) return { ok: false, message: "Ana görsel adresi geçerli değil." };
  return {
    ok: true,
    value: {
      sku,
      name,
      category,
      pack,
      description: text("description", 2000) || MISSING_VALUE,
      price: price === null ? null : Math.round(price * 100) / 100,
      costPrice: costPrice === null ? null : Math.round(costPrice * 100) / 100,
      stock,
      barcode: text("barcode", 80) || MISSING_VALUE,
      minOrderPackages,
      lowStockThreshold,
      supplier: text("supplier", 160) || MISSING_VALUE,
      ageGroup: text("ageGroup", 120) || MISSING_VALUE,
      conformityDeclaration: text("conformityDeclaration", 1000) || MISSING_VALUE,
      productDimensions: text("productDimensions", 180) || MISSING_VALUE,
      cartonDimensions: text("cartonDimensions", 180) || MISSING_VALUE,
      cartonDesi: cartonDesi === null ? null : Math.round(cartonDesi * 100) / 100,
      cartonWeightKg: cartonWeightKg === null ? null : Math.round(cartonWeightKg * 1000) / 1000,
      originCountry: text("originCountry", 120) || MISSING_VALUE,
      safetyNote: text("safetyNote", 1500) || MISSING_VALUE,
      licenseNote: text("licenseNote", 1500) || MISSING_VALUE,
      imageUrl,
      gallery,
      isPriceVisible: Boolean(input.isPriceVisible),
      isPublished: input.isPublished !== false,
      sortOrder,
    },
  };
}

export function payloadToRow(value: ProductPayload) {
  return {
    sku: value.sku,
    name: value.name,
    category: value.category,
    pack: value.pack,
    description: value.description || null,
    price: value.price,
    cost_price: value.costPrice,
    stock: value.stock,
    barcode: value.barcode || null,
    min_order_packages: value.minOrderPackages,
    low_stock_threshold: value.lowStockThreshold,
    supplier: value.supplier || null,
    age_group: value.ageGroup || null,
    conformity_declaration: value.conformityDeclaration || null,
    product_dimensions: value.productDimensions || null,
    carton_dimensions: value.cartonDimensions || null,
    carton_desi: value.cartonDesi,
    carton_weight_kg: value.cartonWeightKg,
    origin_country: value.originCountry || null,
    safety_note: value.safetyNote || null,
    license_note: value.licenseNote || null,
    image_url: value.imageUrl || null,
    gallery: value.gallery,
    is_price_visible: value.isPriceVisible,
    is_published: value.isPublished,
    sort_order: value.sortOrder,
    updated_at: new Date().toISOString(),
  };
}
