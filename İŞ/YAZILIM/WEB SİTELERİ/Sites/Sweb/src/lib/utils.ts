import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function normalizeTurkishText(text: string) {
  return text
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/C/g, "c")
    .replace(/Ş/g, "S")
    .replace(/(martı|şah|şöhret)/gi, "şehir")
    .trim();
}

/** SKU prefix standartları kategori/seri bazlı */
export const SKU_PREFIXES: Record<string, string> = {
  "saat-mucevher": "S-",
  "mucevher": "MJ-",
  "organizer": "ORG-",
  "ofis": "OF-",
  "hediye-setleri": "SL-",
  "sumen": "SM-",
  "baby": "BB-",
};

/** SKU'ya kategori prefix'i ekle / doğrula */
export function normalizeSku(sku: string, categoryId: string): string {
  const prefix = SKU_PREFIXES[categoryId] ?? "";
  const clean = sku.toUpperCase().replace(/[^A-Z0-9-]/g, "");
  return clean.startsWith(prefix) ? clean : `${prefix}${clean}`;
}

/** Ürün adı normalize: "kahve/kahverengi", "masaüstü/masa üstü" vb. düzelt */
export function normalizeProductName(name: string): string {
  return name
    .replace(/\bkahve\b/gi, "Kahve")
    .replace(/\bkahverengi\b/gi, "Kahve")
    .replace(/\bmasa\s*üstü\b/gi, "Masaüstü")
    .replace(/\bmasa\s*ustu\b/gi, "Masaüstü")
    .replace(/\bmasa\s*ustu\b/gi, "Masaüstü")
    .replace(/\bdondurucu\b/gi, "Buzdolabı")
    .replace(/\bcocuk\b/gi, "Çocuk")
    .replace(/\bcocuk\b/gi, "Çocuk")
    .replace(/\s+/g, " ")
    .trim();
}

/** Filtre/seo için slug-safe normalize */
export function normalizeForSlug(text: string): string {
  return normalizeTurkishText(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Para formatı: TL, nokta ayraç, 2 ondalık */
export function formatPriceTRY(amount: number, opts?: { showDecimals?: boolean }): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: opts?.showDecimals ? 2 : 0,
  }).format(amount);
}

/** Stok durumu etiketi */
export function getStockStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    "stokta": "Stokta",
    "siparisle-uretilir": "Siparişle üretilir",
    "uretimde": "Üretimde",
    "tukendi": "Tükendi",
  };
  return labels[status] ?? status;
}
