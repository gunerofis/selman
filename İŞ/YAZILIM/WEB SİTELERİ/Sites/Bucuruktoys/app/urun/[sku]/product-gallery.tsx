"use client";

import { useEffect, useState } from "react";

export type ProductGalleryImage = {
  src: string;
  thumbnail: string;
  srcSet?: string;
  width: number;
  height: number;
  alt: string;
};

export default function ProductGallery({ images }: { images: ProductGalleryImage[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const active = images[activeIndex] ?? images[0];

  useEffect(() => {
    if (!expanded) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && setExpanded(false);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [expanded]);

  if (!active) return null;

  return <div className="product-gallery">
    <button className="product-gallery-main" type="button" onClick={() => setExpanded(true)} aria-label={`${active.alt} büyüt`}>
      <img src={active.src} srcSet={active.srcSet} sizes="(max-width: 760px) 100vw, 50vw" alt={active.alt} width={active.width} height={active.height} fetchPriority="high" />
      <span>Görseli büyüt</span>
    </button>
    {images.length > 1 && <div className="product-thumbs" aria-label="Ürün görselleri">
      {images.map((image, index) => <button type="button" className={index === activeIndex ? "active" : ""} onClick={() => setActiveIndex(index)} aria-label={`${index + 1}. görseli göster`} aria-pressed={index === activeIndex} key={image.src}>
        <img src={image.thumbnail} alt="" width="180" height="180" loading="lazy" />
      </button>)}
    </div>}
    {expanded && <div className="product-lightbox" role="dialog" aria-modal="true" aria-label="Büyütülmüş ürün görseli" onClick={() => setExpanded(false)}>
      <button type="button" className="product-lightbox-close" onClick={() => setExpanded(false)} aria-label="Görseli kapat">×</button>
      <img src={active.src} alt={active.alt} width={active.width} height={active.height} onClick={(event) => event.stopPropagation()} />
    </div>}
  </div>;
}
