/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { ConceptCatalogProduct } from "./lib/product-wall-concepts";

export default function ConceptProductCard({ product }: { product: ConceptCatalogProduct }) {
  return <article className="product-card concept-product-card">
    <span className="concept-product-badge">Yeni model</span>
    <Link className="product-image-wrap" href={product.href}><img src={product.primaryImage} alt={product.name} loading="lazy" /></Link>
    <div className="product-card-body">
      <p className="product-card-meta">{product.model} · {product.color}</p>
      <Link className="product-name" href={product.href}>{product.name}</Link>
      <div className="product-card-bottom">
        <div><strong>Fiyat için iletişim</strong><small>Üretim bilgisi sayfada</small></div>
        <Link className="concept-product-link" href={product.href} aria-label={`İncele: ${product.name}`}>İncele <span aria-hidden="true">→</span></Link>
      </div>
    </div>
  </article>;
}
