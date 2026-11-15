import { BRAND } from "./brand.ts";
import type { Product } from "./products.ts";

export const SITE_ORIGIN = "https://www.feelparfume.com";
// Varsayılan paylaşım görseli.
export const DEFAULT_SOCIAL_IMAGE = "/favicon.svg";

function naturalDescription(value: string, maxLength = 160) {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  const shortened = normalized.slice(0, maxLength + 1);
  const boundary = shortened.lastIndexOf(" ");
  return `${shortened.slice(0, boundary > 110 ? boundary : maxLength).replace(/[\s,;:.-]+$/, "")}…`;
}

export function pageTitle(page?: string) {
  return page ? `${page} — ${BRAND.name}` : BRAND.name;
}

export function pageHead({
  title,
  description,
  path,
  image = DEFAULT_SOCIAL_IMAGE,
  noindex = false,
}: {
  title: string;
  description?: string;
  path: string;
  image?: string;
  noindex?: boolean;
}) {
  const fullTitle = pageTitle(title);
  const rawDescription = description ?? BRAND.tagline;
  const suffix =
    ` ${BRAND.name} ürünlerini, özellikleri, sipariş ve teslimat seçeneklerini bu sayfada inceleyin.`;
  const fullDescription = naturalDescription(
    rawDescription.length >= 120
      ? rawDescription
      : `${rawDescription}${suffix}`,
  );
  const canonical = new URL(path, SITE_ORIGIN).href;
  const socialImage = new URL(image, SITE_ORIGIN).href;

  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: fullDescription },
      { name: "robots", content: noindex ? "noindex, nofollow" : "index, follow" },
      { property: "og:locale", content: "tr_TR" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: BRAND.name },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: fullDescription },
      { property: "og:url", content: canonical },
      { property: "og:image", content: socialImage },
      { property: "og:image:alt", content: `${BRAND.name} düzen ürünleri` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: fullTitle },
      { name: "twitter:description", content: fullDescription },
      { name: "twitter:image", content: socialImage },
    ],
    links: [{ rel: "canonical", href: canonical }],
  };
}

/** Ürün sayfası için tam SEO meta */
export function productPageHead(product: Product) {
  const canonical = `${SITE_ORIGIN}/urun/${product.sku.toLowerCase()}`;
  const image = product.image.replace(/\.webp$/, "-800.webp");
  return pageHead({
    title: `${product.name} — ${product.shortName}`,
    description: product.description.slice(0, 155),
    path: `/urun/${product.sku.toLowerCase()}`,
    image,
  });
}

/** Kategori sayfası için SEO meta */
export function categoryPageHead(categoryId: string, categoryName: string, blurb: string) {
  const categoryImages: Record<string, string> = {};
  return pageHead({
    title: categoryName,
    description: blurb.slice(0, 155),
    path: `/kategori/${categoryId}`,
    image: categoryImages[categoryId] ?? DEFAULT_SOCIAL_IMAGE,
  });
}

/** Product structured data (JSON-LD) */
export function generateProductJsonLd(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.sku,
    brand: { "@type": "Brand", name: BRAND.name },
    image: product.image.replace(/\.webp$/, "-800.webp"),
    offers: {
      "@type": "Offer",
      url: `${SITE_ORIGIN}/urun/${product.sku.toLowerCase()}`,
      priceCurrency: "TRY",
      price: product.price / 100, // kuruş -> lira
      availability: product.stockStatus === "stokta"
        ? "https://schema.org/InStock"
        : product.stockStatus === "tukendi"
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/PreOrder",
    },
  };
}

/** Breadcrumb structured data */
export function generateBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_ORIGIN}${item.url}`,
    })),
  };
}

/** Organization structured data (NAP) */
export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    name: BRAND.name,
    url: SITE_ORIGIN,
    logo: `${SITE_ORIGIN}/logo.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: BRAND.legalAddress,
      addressLocality: BRAND.district,
      addressRegion: BRAND.city,
      addressCountry: "TR",
    },
    telephone: BRAND.phone,
    email: BRAND.email,
    sameAs: [],
  };
}
