"use client";
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const available = images.filter(Boolean).slice(0, 8);
  const [active, setActive] = useState(available[0] || "");
  if (!active) return <div className="product-gallery-empty">Ürün görseli hazırlanıyor.</div>;

  return (
    <div className="product-gallery-viewer">
      <div className="product-thumbnails" aria-label="Ürün görselleri">
        {available.map((image, index) => <button type="button" key={`${image}-${index}`} className={image === active ? "active" : ""} onClick={() => setActive(image)} aria-label={`${index + 1}. görseli göster`} aria-pressed={image === active}><img src={image} alt="" /></button>)}
      </div>
      <figure className="product-gallery-main"><img src={active} alt={name} /></figure>
    </div>
  );
}
