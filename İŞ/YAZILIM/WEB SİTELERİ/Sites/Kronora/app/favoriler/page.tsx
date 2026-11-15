import Link from "next/link";
import type { Metadata } from "next";
import FavoritesClient from "./favorites-client";
import { getProducts } from "../lib/store";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Favorilerim | Moneluks", description: "Moneluks koleksiyonundan kaydettiğiniz saat, gözlük ve aksesuar kutularını yeniden inceleyin.", robots: { index: false, follow: false } };

export default async function FavoritesPage() {
  const products = await getProducts();
  return <main id="main-content" className="inner-page"><section className="page-hero small"><p className="breadcrumb"><Link href="/">Ana Sayfa</Link><span>/</span>Favorilerim</p><h1>Favorilerim</h1><p>Karşılaştırmak veya daha sonra yeniden incelemek istediğiniz ürünleri tek yerde tutun.</p></section><FavoritesClient products={products} /></main>;
}
