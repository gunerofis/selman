export type GalleryKind = "image" | "video";

export type GallerySlide = {
  src: string;
  alt: string;
  kind: GalleryKind;
  /** Küçük resim ve ekran okuyucu adı. Anlatım metni değil. */
  label: string;
};

const SAMPLE_SVG = /^\/samples\/(fp-\d+)\.svg$/i;

const VIEWS: Record<string, string> = {
  sise: "şişe",
  kutu: "kutu",
  yakin: "yakın plan",
};

export function sampleStillSet(id: string) {
  const digits = id.toLowerCase().match(/(\d+)/)?.[1];
  if (!digits) throw new Error(`sample id: ${id}`);
  const code = `fp-${digits.padStart(3, "0")}`;
  return {
    image: `/samples/${code}-sise.webp`,
    images: [`/samples/${code}-kutu.webp`, `/samples/${code}-yakin.webp`],
  };
}

/** Eski örnek SVG yolunu üç sabit kareye çevirir. Gerçek dosya yollarına dokunmaz. */
export function normalizeCatalogMedia(image: string, images?: string[]) {
  const list = (images ?? []).filter((src) => src.trim());
  const match = image.match(SAMPLE_SVG);
  if (!match) return { image, images: list };
  const stills = sampleStillSet(match[1]);
  const extras = list.filter((src) => src !== image && !SAMPLE_SVG.test(src) && !stills.images.includes(src));
  return { image: stills.image, images: [...stills.images, ...extras] };
}

export function isVideoSrc(src: string) {
  return /\.(mp4|webm)(?:$|\?)/i.test(src);
}

export function videoMime(src: string) {
  return /\.webm(?:$|\?)/i.test(src) ? "video/webm" : "video/mp4";
}

function viewLabel(src: string) {
  if (isVideoSrc(src)) return "video";
  const view = src.match(/-(sise|kutu|yakin)\.webp(?:$|\?)/i)?.[1]?.toLowerCase();
  return view ? VIEWS[view] : null;
}

export function gallerySlides(product: {
  image: string;
  images?: string[];
  brand?: string;
  name: string;
}): GallerySlide[] {
  const media = normalizeCatalogMedia(product.image, product.images);
  const sources = [media.image, ...media.images].filter((src) => src.trim());
  const prefix = [product.brand, product.name].filter(Boolean).join(" ");
  return sources.map((src) => {
    const label = viewLabel(src);
    return {
      src,
      kind: label === "video" ? "video" : "image",
      label: label ?? "görsel",
      alt: label ? `${prefix}, ${label}` : prefix,
    };
  });
}
