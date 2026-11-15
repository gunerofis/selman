"use client";

import { useEffect, useState } from "react";

type PrintGalleryImage = { src: string; alt: string; srcSet?: string };

export default function PrintProductGallery({ images, sku, popularityRank }: { images: PrintGalleryImage[]; sku: string; popularityRank: number | null }) {
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

  return <div className="print-detail-gallery">
    <div className="print-detail-media">
      <button type="button" className="print-detail-media-button" onClick={() => setExpanded(true)} aria-label={`${active.alt} büyüt`}>
        <img src={active.src} srcSet={active.srcSet} sizes="(max-width: 820px) calc(100vw - 32px), 55vw" alt={active.alt} width="1536" height="1024" fetchPriority="high" />
        <em>Görseli büyüt</em>
      </button>
      <span>{sku}</span>
      {popularityRank && <b>Viral 30 · #{popularityRank}</b>}
    </div>
    {images.length > 1 && <div className="print-detail-thumbs" aria-label="3D ürün görselleri">
      {images.map((image, index) => <button type="button" className={index === activeIndex ? "active" : ""} onClick={() => setActiveIndex(index)} aria-label={`${index + 1}. görseli göster`} aria-pressed={index === activeIndex} key={image.src}>
        <img src={image.src} alt="" width="180" height="120" loading="lazy" />
      </button>)}
    </div>}
    {expanded && <div className="print-lightbox" role="dialog" aria-modal="true" aria-label="Büyütülmüş 3D ürün görseli" onClick={() => setExpanded(false)}>
      <button type="button" className="print-lightbox-close" onClick={() => setExpanded(false)} aria-label="Görseli kapat">×</button>
      <img src={active.src} alt={active.alt} width="1536" height="1024" onClick={(event) => event.stopPropagation()} />
    </div>}
  </div>;
}
