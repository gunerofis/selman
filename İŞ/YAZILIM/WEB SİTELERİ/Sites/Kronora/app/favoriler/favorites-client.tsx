"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "../product-card";
import { getFavorites } from "../favorites-store";
import type { StoreProduct } from "../lib/store";

export default function FavoritesClient({ products }: { products: StoreProduct[] }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  useEffect(() => {
    const update = () => setSlugs(getFavorites());
    update();
    window.addEventListener("favorites-updated", update);
    window.addEventListener("storage", update);
    return () => { window.removeEventListener("favorites-updated", update); window.removeEventListener("storage", update); };
  }, []);
  const favorites = products.filter((product) => slugs.includes(product.slug));
  return favorites.length ? <section className="favorites-results"><div className="section-heading"><div><h2>Kaydettiğiniz parçalar</h2><p>{favorites.length} ürün bu cihazdaki listenizde.</p></div><Link className="text-link" href="/koleksiyon">Koleksiyona dön</Link></div><div className="product-grid">{favorites.map((product) => <ProductCard key={product.slug} product={product} />)}</div></section> : <section className="favorites-empty"><span aria-hidden="true">♡</span><h2>Listeniz henüz boş.</h2><p>Beğendiğiniz ürünlerdeki kalp simgesine dokunarak burada bir seçki oluşturabilirsiniz.</p><Link className="button dark-button" href="/koleksiyon">Koleksiyonu keşfet</Link></section>;
}
