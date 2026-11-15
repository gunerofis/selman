const LEGACY_DESIGN_SKUS = [

] as const;

/** Existing product renders that had assets but no catalog record. */
export const LEGACY_DESIGNS = LEGACY_DESIGN_SKUS.map((sku) => ({
  id: `arsiv-${sku}`,
  name: `SWEB Organizer Tasarımı ${sku}`,
  image: `/products/${sku}.webp`,
  imageSrcSet: `/products/${sku}-320.webp 320w, /products/${sku}-800.webp 800w`,
  code: sku,
}));
