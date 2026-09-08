"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { readCart, writeCart, type CartItem } from "../cart-store";
import { addFavorite } from "../favorites-store";
import type { StoreProduct } from "../lib/store";

export default function CartClient({ products, shippingNote }: { products: StoreProduct[]; shippingNote: string }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [savedSlug, setSavedSlug] = useState("");

  useEffect(() => {
    const frame = requestAnimationFrame(() => setCart(readCart()));
    return () => cancelAnimationFrame(frame);
  }, []);

  const rows = useMemo(() => cart
    .map((item) => ({ item, product: products.find((product) => product.slug === item.slug) }))
    .filter((row): row is { item: CartItem; product: StoreProduct } => Boolean(row.product)), [cart, products]);
  const subtotal = rows.reduce((sum, row) => sum + row.product.priceCents * row.item.quantity, 0);

  const update = (slug: string, quantity: number) => {
    const next = quantity < 1
      ? cart.filter((item) => item.slug !== slug)
      : cart.map((item) => {
        const product = products.find((entry) => entry.slug === slug);
        const max = product?.trackStock ? Math.max(1, Math.min(20, product.stockQuantity)) : 20;
        return item.slug === slug ? { ...item, quantity: Math.min(max, quantity) } : item;
      });
    setCart(next);
    writeCart(next);
  };

  if (!rows.length) {
    return <section className="cart-empty"><h2>Sepetiniz henüz boş.</h2><p>Koleksiyondan bir saat kutusu seçerek başlayın.</p><Link className="button primary" href="/koleksiyon">Koleksiyona git →</Link></section>;
  }

  return <section className="cart-layout">
    <div className="cart-items">{rows.map(({ item, product }) => <article key={product.slug}>
      <img src={product.primaryImage} width="220" height="220" alt={product.name} />
      <div><p>{product.model} · {product.color}</p><Link href={`/urun/${product.slug}`}>{product.name}</Link><strong>{(product.priceCents / 100).toLocaleString("tr-TR")} TL</strong><div className="cart-item-actions"><button type="button" onClick={() => { addFavorite(product.slug); setSavedSlug(product.slug); }}>♡ {savedSlug === product.slug ? "Favorilere kaydedildi" : "Favorilere kaydet"}</button><button type="button" onClick={() => update(product.slug, 0)}>Kaldır</button></div></div>
      <div className="quantity-control" aria-label={`${product.name} adedi`}><button type="button" aria-label="Adedi azalt" onClick={() => update(product.slug, item.quantity - 1)}>−</button><span aria-live="polite">{item.quantity}</span><button type="button" aria-label="Adedi artır" disabled={item.quantity >= (product.trackStock ? Math.min(20, product.stockQuantity) : 20)} onClick={() => update(product.slug, item.quantity + 1)}>+</button></div>
    </article>)}</div>
    <aside className="cart-summary"><h2>Sipariş özeti</h2><div><span>Ara toplam</span><b>{(subtotal / 100).toLocaleString("tr-TR")} TL</b></div><p>{shippingNote}</p><div className="summary-total"><span>Toplam</span><b>{(subtotal / 100).toLocaleString("tr-TR")} TL</b></div><Link className="button primary" href="/odeme">Siparişi tamamla</Link><Link className="text-link" href="/koleksiyon">Alışverişe devam et</Link><p className="checkout-fact">Ödeme kartı bilgisi bu sitede alınmaz veya saklanmaz.</p></aside>
  </section>;
}
