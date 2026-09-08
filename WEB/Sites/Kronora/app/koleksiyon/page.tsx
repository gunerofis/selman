import Link from "next/link";
import CollectionClient from "./collection-client";
import { conceptCatalogProducts } from "../lib/product-wall-concepts";
import { getProducts } from "../lib/store";
export const metadata = { title: "Koleksiyon | Moneluks", description: "Moneluks saat, gözlük ve aksesuar kutularını model, renk ve fiyata göre inceleyin.", alternates: { canonical: "/koleksiyon" } };
export const dynamic = "force-dynamic";
export default async function CollectionPage() { const products = await getProducts(); const total = products.length + conceptCatalogProducts.length; return <main id="main-content" className="inner-page"><section className="page-hero collection-hero"><div><p className="breadcrumb"><Link href="/">Ana Sayfa</Link><span>/</span>Koleksiyon</p><h1>Koleksiyon</h1><p>20 modeli beş sabit renkte karşılaştırın; satışa açık ürünleri sepete ekleyin, yeni modeller için üretim bilgisi alın.</p></div><strong>{total} varyant</strong></section><CollectionClient products={products} newModels={conceptCatalogProducts}/></main>; }
