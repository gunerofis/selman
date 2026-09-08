"use client";

import { useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import ProductCard from "./product-card";
import type { StoreProduct } from "./lib/store";

const colors = [
  { name: "Tümü", hex: "#a9824c", swatch: "linear-gradient(135deg,#191a1c 0 20%,#742f3c 20% 40%,#5a4033 40% 60%,#e8ddc7 60% 80%,#b8794f 80%)", text: "Tüm renkler" },
  { name: "Siyah", hex: "#191a1c", swatch: "#191a1c", text: "Net ve modern" },
  { name: "Bordo", hex: "#742f3c", swatch: "#742f3c", text: "Derin ve seçkin" },
  { name: "Kahve", hex: "#5a4033", swatch: "#5a4033", text: "Sıcak ve dengeli" },
  { name: "Krem", hex: "#e8ddc7", swatch: "#e8ddc7", text: "Aydınlık ve sade" },
  { name: "Taba", hex: "#b8794f", swatch: "#b8794f", text: "Doğal ve zamansız" },
] as const;

export default function FamilyColorSelector({ products, title, intro }: { products: StoreProduct[]; title: string; intro: string }) {
  const [selected, setSelected] = useState<(typeof colors)[number]["name"]>("Tümü");
  const selectedColor = colors.find((color) => color.name === selected) || colors[0];
  const filtered = useMemo(() => selected === "Tümü" ? products : products.filter((product) => product.color === selected), [products, selected]);
  const counts = useMemo(() => Object.fromEntries(colors.map((color) => [color.name, color.name === "Tümü" ? products.length : products.filter((product) => product.color === color.name).length])), [products]);
  const style = { "--selected-color": selectedColor.hex } as CSSProperties;

  return <section id="urunler" className="color-studio product-module">
    <div className="module-heading"><div><p className="eyebrow">Renk seçimi</p><h2>{title}</h2></div><p>{intro}</p></div>
    <div className="color-studio-panel">
      <div className="color-choice-list" role="group" aria-label="Ürün rengini seçin">{colors.map((color) => <button key={color.name} className={selected === color.name ? "active" : ""} onClick={() => setSelected(color.name)} aria-pressed={selected === color.name}><i style={{ background: color.swatch }}></i><span><b>{color.name}</b><small>{color.text}</small></span><em>{counts[color.name] || 0}</em></button>)}</div>
      <div className="color-stage" style={style}><div className="color-stage-object"><span></span><i></i></div><div className="color-stage-copy"><small>Seçili renk</small><strong>{selectedColor.name}</strong><p>{selectedColor.text}</p></div></div>
    </div>
    {filtered.length > 0 ? <><div className="filtered-result-head"><span>{selected === "Tümü" ? "Tüm renkler" : selected}</span><b>{filtered.length} ürün</b></div><div className="product-grid">{filtered.map((product) => <ProductCard key={product.slug} product={product}/>)}</div><Link className="button dark-button centered-button" href="/koleksiyon">Tüm koleksiyonu görün →</Link></> : <div className="family-coming"><span>{selected === "Tümü" ? "Yeni koleksiyon" : `${selected} seçkisi`}</span><h3>Ürünler hazırlanıyor.</h3><p>Gerçek ürün görselleri ve satış bilgileri tamamlanan modeller burada seçtiğiniz renge göre otomatik olarak görünecek.</p><div><Link className="button dark-button" href="/iletisim">Ürün bilgisi iste →</Link><Link className="text-link" href="/toplu-siparis">Toplu sipariş</Link></div></div>}
  </section>;
}
