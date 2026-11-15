import { MISSING_VALUE, fillMissing, hasPublicValue, publicValue } from "./business-info";
import { PUBLIC_PRICE_VISIBLE } from "./features";
import productImageDimensionsJson from "./product-image-dimensions.json";
import whatsappCatalogJson from "./whatsapp-catalog-20260807.json";

export const productCategories = ["outdoor", "fun", "skill", "sensory", "stationery", "accessory", "3d"] as const;

export type ProductCategory = string;

export type CatalogProduct = {
  id: number;
  sku: string;
  name: string;
  image: string;
  gallery: string[];
  category: ProductCategory;
  pack: string;
  note?: string;
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
  isPriceVisible: boolean;
  isPublished: boolean;
  sortOrder: number;
  updatedAt: string;
};

export type ProductRow = {
  id: number;
  sku: string;
  name: string;
  category: ProductCategory;
  pack: string;
  description: string | null;
  price: number | string | null;
  cost_price: number | string | null;
  stock: number;
  barcode: string | null;
  min_order_packages: number;
  low_stock_threshold: number;
  supplier: string | null;
  age_group: string | null;
  conformity_declaration: string | null;
  product_dimensions: string | null;
  carton_dimensions: string | null;
  carton_desi: number | string | null;
  carton_weight_kg: number | string | null;
  origin_country: string | null;
  safety_note: string | null;
  license_note: string | null;
  image_url: string | null;
  gallery: unknown;
  is_price_visible: boolean;
  is_published: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

function technicalDefaultsForSku(sku: string) {
  const laserProducts = new Set(["BT-033", "BT-050"]);
  const capsuleProducts = new Set(["BT-026", "BT-062", "BT-069"]);
  const licensedVisualProducts = new Set(["BT-001", "BT-002", "BT-053", "BT-061", "BT-063", "BT-064", "BT-065"]);
  const safetyNote = laserProducts.has(sku)
    ? "Lazer sınıfı, çıkış gücü, dalga boyu, yaş grubu ve uygunluk belgeleri DOLDURULACAK. Bu bilgiler doğrulanmadan satışa sunulmamalı; ışın göze veya cilde yöneltilmemelidir."
    : capsuleProducts.has(sku)
      ? "Kapsül uyumluluğu, yaş sınıfı, ses seviyesi ve oyuncak güvenliği belgeleri DOLDURULACAK. Siparişten önce alıcıya yazılı olarak teyit edilmelidir."
      : MISSING_VALUE;
  const licenseNote = licensedVisualProducts.has(sku)
    ? "Görseldeki marka/karakter/tasarım için ticari satış ve dağıtım yetkisi DOLDURULACAK. Hak sahipliği doğrulanmadan seri satış önerilmez."
    : MISSING_VALUE;
  return {
    ageGroup: MISSING_VALUE,
    conformityDeclaration: "Ürün sınıfı, CE/uygunluk beyanı ve destekleyici belgeler DOLDURULACAK.",
    productDimensions: MISSING_VALUE,
    cartonDimensions: MISSING_VALUE,
    cartonDesi: null,
    cartonWeightKg: null,
    originCountry: MISSING_VALUE,
    safetyNote,
    licenseNote,
  };
}

const baseSeedProducts: CatalogProduct[] = [
  [1, "Manifest Orijinal Kart Seti", "IMG-20260718-WA0004.webp", "skill", "60 paketlik seri", "Koleksiyon kartı"],
  [2, "Manifest Kart Setleri", "IMG-20260718-WA0005.webp", "skill", "24'lü kutu", "Karışık seri"],
  [3, "Küçük Su Tabancası", "IMG-20260718-WA0006.webp", "outdoor", "Toptan paket", "Karışık renk"],
  [4, "Borazan Köpük", "IMG-20260718-WA0011.webp", "outdoor", "24'lü kutu", "Köpük baloncuk"],
  [5, "Çin Mantısı Clicker Anahtarlık", "IMG-20260718-WA0012.webp", "accessory", "Sürpriz renkli kutu", "Sesli clicker"],
  [6, "Cıvcıv Compression Toy", "IMG-20260718-WA0018.webp", "sensory", "12 adetli", "Sık-bırak oyuncak"],
  [7, "Taş Kağıt Makas Oyunu", "IMG-20260718-WA0019.webp", "skill", "40 adetli", "Cep oyunu"],
  [8, "UFO Pervane", "IMG-20260718-WA0020.webp", "outdoor", "24 adetli", "Karışık renk"],
  [9, "Maç Kornası", "IMG-20260718-WA0021.webp", "fun", "24 adetli", "Üflemeli korna"],
  [10, "Oyuncak Kapsülü", "IMG-20260718-WA0022.webp", "fun", "10 sayfa × 18 kapsül", "8'li kapsül"],
  [11, "Renkli Stres Yayı", "IMG-20260718-WA0028.webp", "sensory", "24 adetli", "6 farklı çeşit"],
  [12, "Işıklı Büyüteç", "IMG-20260718-WA0029.webp", "fun", "12 adetli", "Işıklı model"],
  [13, "Beyincik Stres Topu", "IMG-20260718-WA0035.webp", "sensory", "15 adetli", "Sıkıştırılabilir"],
  [14, "Şaka Bıçağı", "IMG-20260718-WA0036.webp", "fun", "24 adetli", "İçe geçen uç"],
  [15, "Büyük Boy Blok Not Defteri", "IMG-20260718-WA0037.webp", "stationery", "36 adetli", "Şekilli sticker ve cımbız"],
  [16, "Cımbızlı Sticker Seti", "IMG-20260718-WA0038.webp", "stationery", "48 adetli", "Karışık desen"],
  [17, "Labirent Küp Anahtarlık", "IMG-20260718-WA0040.webp", "skill", "24'lü kutu", "3D mini labirent"],
  [18, "El Fenerli Deprem Düdüğü", "IMG-20260718-WA0045.webp", "accessory", "30 adetli", "Işıklı düdük"],
  [19, "Ruj Şeklinde Silgi", "IMG-20260718-WA0046.webp", "stationery", "36 adetli", "Kurmalı model"],
  [20, "Renkli Büyüteç", "IMG-20260718-WA0047.webp", "fun", "20 adetli", "Karışık renk"],
  [21, "Yüz Süs Stickeri", "IMG-20260718-WA0048.webp", "stationery", "12 adetli", "Karışık desen"],
  [22, "Sweet Girl Bileklik Seti", "IMG-20260718-WA0049.webp", "accessory", "20 adetli", "Birleştirilebilir parçalar"],
  [23, "Astronot Işıklı Anahtarlık", "IMG-20260718-WA0052.webp", "accessory", "48 adetli", "Karışık pastel renk"],
  [24, "Kazımalı Kart", "IMG-20260718-WA0053.webp", "stationery", "60 adetli", "2'li çizim kartı"],
  [25, "Mini Yapboz Tırtıl Anahtarlık", "IMG-20260718-WA0054.webp", "accessory", "12 paket × 6 adet", "Sök-tak parçalı"],
  [26, "Büyük Boy Kapsül Tabanca", "IMG-20260718-WA0055.webp", "fun", "Toptan paket", "Ürün No: 4"],
  [27, "Ok Yay Seti", "IMG-20260718-WA0060.webp", "outdoor", "24 adetli", "Karışık renk"],
  [28, "Mini Defter", "IMG-20260718-WA0061.webp", "stationery", "100 adetli", "Karışık kapak"],
  [29, "Su Maymunu", "IMG-20260718-WA0062.webp", "sensory", "60 adetli", "Renkli su boncuğu"],
  [30, "Atmaca", "IMG-20260718-WA0063.webp", "outdoor", "72 adetli", "Asetat kutuda"],
  [31, "Stres Halkası", "IMG-20260718-WA0064.webp", "sensory", "30 adetli", "Karışık renk"],
  [32, "İthal Yılan Zekâ Küpü", "IMG-20260718-WA0065.webp", "skill", "20 adetli", "Şekillendirilebilir"],
  [33, "3 Fonksiyonlu Lazer", "IMG-20260718-WA0066.webp", "accessory", "24 adetli", "Lazer ve LED ışık"],
  [34, "Emoji Yay", "IMG-20260718-WA0070.webp", "sensory", "12 adetli", "Bükülebilir yay"],
  [35, "Takma Saç Toka", "IMG-20260718-WA0071.webp", "accessory", "30 adetli", "Renkli örgülü"],
].map(([id, name, image, category, pack, note]) => ({
  id: id as number,
  sku: `BT-${String(id).padStart(3, "0")}`,
  name: name as string,
  image: image as string,
  gallery: [],
  category: category as ProductCategory,
  pack: pack as string,
  note: note as string,
  price: null,
  costPrice: null,
  stock: 0,
  barcode: "",
  minOrderPackages: 1,
  lowStockThreshold: 5,
  supplier: "",
  ...technicalDefaultsForSku(`BT-${String(id).padStart(3, "0")}`),
  isPriceVisible: false,
  isPublished: true,
  sortOrder: id as number,
  updatedAt: "2026-07-23T00:00:00+03:00",
}));

type ImportedProduct = {
  id: number;
  sku: string;
  name: string;
  image: string;
  category: ProductCategory;
  pack: string;
  note: string;
};

type ExistingProductUpdate = Partial<Pick<CatalogProduct, "name" | "category" | "pack" | "note">> & {
  id: number;
  sku: string;
  galleryImage: string;
};

const whatsappCatalog = whatsappCatalogJson as {
  newProducts: ImportedProduct[];
  existingProductUpdates: ExistingProductUpdate[];
};

const existingUpdates = new Map(whatsappCatalog.existingProductUpdates.map((item) => [item.id, item]));

export const seedProducts: CatalogProduct[] = [
  ...baseSeedProducts.map((product) => {
    const update = existingUpdates.get(product.id);
    if (!update) return product;
    return {
      ...product,
      ...(update.name ? { name: update.name } : {}),
      ...(update.category ? { category: update.category } : {}),
      ...(update.pack ? { pack: update.pack } : {}),
      ...(update.note ? { note: update.note } : {}),
      gallery: Array.from(new Set([...product.gallery, update.galleryImage])),
      updatedAt: "2026-08-07T00:00:00+03:00",
    };
  }),
  ...whatsappCatalog.newProducts.map((product) => ({
    id: product.id,
    sku: product.sku,
    name: product.name,
    image: product.image,
    gallery: [],
    category: product.category,
    pack: product.pack,
    note: product.note,
    price: null,
    costPrice: null,
    stock: 0,
    barcode: MISSING_VALUE,
    minOrderPackages: 1,
    lowStockThreshold: 5,
    supplier: MISSING_VALUE,
    ...technicalDefaultsForSku(product.sku),
    isPriceVisible: false,
    isPublished: true,
    sortOrder: product.id,
    updatedAt: "2026-08-07T00:00:00+03:00",
  })),
].sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);

export const productImageDimensions = productImageDimensionsJson as unknown as Record<string, [number, number]>;

export function rowToProduct(row: ProductRow): CatalogProduct {
  const technicalDefaults = technicalDefaultsForSku(row.sku);
  return {
    id: Number(row.id),
    sku: row.sku,
    name: fillMissing(row.name),
    image: row.image_url ?? "",
    gallery: Array.isArray(row.gallery) ? row.gallery.filter((item): item is string => typeof item === "string") : [],
    category: row.category,
    pack: fillMissing(row.pack),
    note: fillMissing(row.description),
    price: row.price === null ? null : Number(row.price),
    costPrice: row.cost_price === null ? null : Number(row.cost_price),
    stock: Number(row.stock ?? 0),
    barcode: row.barcode ?? MISSING_VALUE,
    minOrderPackages: Math.max(1, Number(row.min_order_packages ?? 1)),
    lowStockThreshold: Math.max(0, Number(row.low_stock_threshold ?? 5)),
    supplier: row.supplier ?? MISSING_VALUE,
    ageGroup: row.age_group ? fillMissing(row.age_group) : technicalDefaults.ageGroup,
    conformityDeclaration: row.conformity_declaration ? fillMissing(row.conformity_declaration) : technicalDefaults.conformityDeclaration,
    productDimensions: row.product_dimensions ? fillMissing(row.product_dimensions) : technicalDefaults.productDimensions,
    cartonDimensions: row.carton_dimensions ? fillMissing(row.carton_dimensions) : technicalDefaults.cartonDimensions,
    cartonDesi: row.carton_desi === null || row.carton_desi === undefined ? null : Number(row.carton_desi),
    cartonWeightKg: row.carton_weight_kg === null || row.carton_weight_kg === undefined ? null : Number(row.carton_weight_kg),
    originCountry: row.origin_country ? fillMissing(row.origin_country) : technicalDefaults.originCountry,
    safetyNote: row.safety_note ? fillMissing(row.safety_note) : technicalDefaults.safetyNote,
    licenseNote: row.license_note ? fillMissing(row.license_note) : technicalDefaults.licenseNote,
    isPriceVisible: Boolean(row.is_price_visible),
    isPublished: Boolean(row.is_published),
    sortOrder: Number(row.sort_order ?? 0),
    updatedAt: row.updated_at ?? row.created_at ?? "2026-07-23T00:00:00+03:00",
  };
}

export function toPublicProduct(product: CatalogProduct): CatalogProduct {
  const isPriceVisible = PUBLIC_PRICE_VISIBLE && product.isPriceVisible && product.price !== null;
  return {
    ...product,
    name: publicValue(product.name, "Ürün"),
    pack: publicValue(product.pack, "Paket bilgisi teklif aşamasında paylaşılır"),
    note: publicValue(product.note, "Güncel ürün bilgisi teklif aşamasında paylaşılır."),
    price: isPriceVisible ? product.price : null,
    costPrice: null,
    stock: 0,
    barcode: publicValue(product.barcode),
    supplier: "",
    ageGroup: publicValue(product.ageGroup),
    conformityDeclaration: publicValue(product.conformityDeclaration),
    productDimensions: publicValue(product.productDimensions),
    cartonDimensions: publicValue(product.cartonDimensions),
    originCountry: publicValue(product.originCountry),
    safetyNote: publicValue(product.safetyNote),
    licenseNote: publicValue(product.licenseNote),
    isPriceVisible,
  };
}

export function toPublicCatalog(products: CatalogProduct[]) {
  return products
    .filter((product) => product.isPublished && product.category !== "3d" && hasPublicValue(product.name))
    .map(toPublicProduct);
}

export const publicSeedProducts = toPublicCatalog(seedProducts);

export function publicImageUrl(image: string, size?: 160 | 320 | 540) {
  if (!image) return "/media/assets/bucuruktoys-avatar.svg";
  if (/^https?:\/\//i.test(image)) return image;
  if (image.startsWith("/media/")) return image;
  if (image.startsWith("/products/") || image.startsWith("/assets/")) return `/media${image}`;
  if (image.startsWith("/")) return image;
  return size ? `/media/products/${size}/${image}` : `/media/products/${image}`;
}
