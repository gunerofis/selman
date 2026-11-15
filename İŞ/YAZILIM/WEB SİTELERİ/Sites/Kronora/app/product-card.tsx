/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import AddToCart from "./add-to-cart";
import FavoriteButton from "./favorite-button";
import type { StoreProduct } from "./lib/store";

export default function ProductCard({ product }: { product: StoreProduct }) {
  const unavailable = product.trackStock && product.stockQuantity < 1;
  return <article className="product-card"><FavoriteButton slug={product.slug} compact/><Link className="product-image-wrap" href={`/urun/${product.slug}`}><img src={product.primaryImage} alt={product.name} loading="lazy"/></Link><div className="product-card-body"><p className="product-card-meta">{product.model} · {product.color}</p><Link className="product-name" href={`/urun/${product.slug}`}>{product.name}</Link><div className="product-card-bottom"><div><strong>{(product.priceCents / 100).toLocaleString("tr-TR")} TL</strong>{product.oldPriceCents && <del>{(product.oldPriceCents / 100).toLocaleString("tr-TR")} TL</del>}</div><AddToCart slug={product.slug} disabled={unavailable} compact/></div></div></article>;
}
