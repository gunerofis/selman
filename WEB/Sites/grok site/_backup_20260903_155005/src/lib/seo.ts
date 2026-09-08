import { BRAND } from "./brand";

export const SITE_ORIGIN = "https://sweb.co";
export const DEFAULT_SOCIAL_IMAGE = "/products/7002.webp";

export function pageTitle(page?: string) {
  return page ? `${page} — ${BRAND.name}` : `${BRAND.name} — düzen ürünleri`;
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
  const fullDescription = description ?? BRAND.tagline;
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
