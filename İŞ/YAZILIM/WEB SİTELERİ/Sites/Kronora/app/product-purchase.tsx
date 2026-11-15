"use client";

import Link from "next/link";
import { useState } from "react";
import AddToCart from "./add-to-cart";
import FavoriteButton from "./favorite-button";

type Variant = { slug: string; color: string; active: boolean };

const COLOR_VALUES: Record<string, string> = {
  Siyah: "#211d1b",
  Bordo: "#6d1928",
  Kahve: "#67412f",
  Krem: "#e8dcc8",
  Taba: "#b87546",
};

export default function ProductPurchase({ slug, color, variants, unavailable, maxQuantity }: { slug: string; color: string; variants: Variant[]; unavailable: boolean; maxQuantity: number }) {
  const safeMax = Math.max(1, Math.min(20, maxQuantity || 20));
  const [quantity, setQuantity] = useState(1);

  return <>
    {variants.length > 1 && <section className="variant-picker" aria-labelledby="variant-title">
      <div><span id="variant-title">Renk</span><b>{color}</b></div>
      <div className="variant-swatches">
        {variants.map((variant) => <Link key={variant.slug} href={`/urun/${variant.slug}`} aria-current={variant.active ? "page" : undefined} aria-label={`${variant.color}${variant.active ? ", seçili" : ""}`} title={variant.color}>
          <i style={{ background: COLOR_VALUES[variant.color] || "#927b6c" }} aria-hidden="true" />
          <span>{variant.color}</span>
        </Link>)}
      </div>
    </section>}
    <div className="purchase-row">
      <div className="purchase-quantity" aria-label="Ürün adedi">
        <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} disabled={quantity <= 1} aria-label="Adedi azalt">−</button>
        <output aria-live="polite" aria-label={`${quantity} adet`}>{quantity}</output>
        <button type="button" onClick={() => setQuantity((value) => Math.min(safeMax, value + 1))} disabled={quantity >= safeMax || unavailable} aria-label="Adedi artır">+</button>
      </div>
      <AddToCart slug={slug} quantity={quantity} disabled={unavailable} />
    </div>
    <div className="drawer-secondary-actions"><FavoriteButton slug={slug} /><Link className="text-link" href={unavailable ? "/koleksiyon" : "/sepet"}>{unavailable ? "Benzer ürünleri incele" : "Sepeti görüntüle"}</Link></div>
  </>;
}
