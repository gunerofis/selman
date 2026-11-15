import type { CSSProperties } from "react";
import { productImageVariant } from "@/lib/products";
import { cn } from "@/lib/utils";

/** LCP: first image eager+high. Below-fold lazy. srcset uses existing 320/800/full WebP. */
export function CatalogImg({
  src,
  alt,
  priority = false,
  sizes = "(max-width: 640px) 50vw, 25vw",
  className,
  style,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  style?: CSSProperties;
}) {
  const responsive = /\.webp$/i.test(src);
  const v320 = productImageVariant(src, 320);
  const v800 = productImageVariant(src, 800);
  return (
    <img
      src={responsive ? (priority ? v800 : v320) : src}
      {...(responsive ? { srcSet: `${v320} 320w, ${v800} 800w, ${src} 1500w`, sizes } : {})}
      width={1500}
      height={1500}
      alt={alt}
      className={cn(className)}
      style={style}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "low"}
      decoding={priority ? "async" : "async"}
    />
  );
}
