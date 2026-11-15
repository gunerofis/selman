import type { CategoryId, Product } from "./products";

/** Tipik ev/ofis yüzeyi — ürün iddiası değil, yer ölçeği. */
export const ROOM_SURFACE: Partial<Record<CategoryId, { mm: number; label: string }>> = {
  ofis: { mm: 1400, label: "tipik 140 cm ofis masası" },
  giris: { mm: 900, label: "tipik 90 cm giriş konsolu" },
  mutfak: { mm: 1800, label: "tipik 180 cm tezgâh sırası" },
  banyo: { mm: 600, label: "tipik 60 cm lavabo tezgâhı" },
  makyaj: { mm: 800, label: "tipik 80 cm makyaj masası" },
  gardrop: { mm: 500, label: "tipik 50 cm komodin" },
  yasam: { mm: 500, label: "tipik 50 cm sehpa" },
};

const SHARE_WORD: Record<number, string> = {
  2: "yarısı",
  3: "üçte biri",
  4: "dörtte biri",
  5: "beşte biri",
  6: "altıda biri",
  8: "sekizde biri",
};

export function parseOuterDims(product: Product) {
  const spec = product.specs.find((s) => s.label === "Dış ölçü");
  if (!spec) return null;
  const nums = (spec.value.match(/\d+/g) ?? []).map(Number).filter((n) => Number.isFinite(n) && n > 0);
  if (nums.length === 0) return null;
  return { w: nums[0], d: nums[1], h: nums[2] };
}

export function outerMm(product: Product) {
  return parseOuterDims(product)?.w ?? null;
}

export function scaleShare(product: Product) {
  const w = outerMm(product);
  const surface = ROOM_SURFACE[product.category];
  if (!w || !surface) return null;
  const ratio = w / surface.mm;
  if (ratio >= 1) {
    return {
      ratio,
      text: `${w} mm — ${surface.label} genişliğinde veya daha geniş. Yerinizi ölçün.`,
    };
  }
  const inv = surface.mm / w;
  const rounded = Math.round(inv);
  const word = SHARE_WORD[rounded];
  if (word && Math.abs(inv - rounded) < 0.28) {
    return {
      ratio,
      text: `${w} mm — ${surface.label} ön kenarının yaklaşık ${word}.`,
    };
  }
  return {
    ratio,
    text: `${w} mm genişlik, ${surface.label} üzerinde.`,
  };
}
