/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { getProducts } from "../lib/store";
import { EditorialHero, PageCta } from "../section-modules";

export const dynamic = "force-dynamic";
export const metadata = { title: "Galeri | Moneluks", description: "Moneluks deri saat ve aksesuar kutularını farklı renk, kapasite ve detaylarla keşfedin.", alternates: { canonical: "/galeri" } };

export default async function GalleryPage() {
  const products = await getProducts();
  const gallery = products.flatMap((product) => product.images.slice(0, 2).map((image, index) => ({ image, name: product.name, slug: product.slug, detail: index === 0 ? product.model : product.color }))).filter((item) => item.image).slice(0, 15);
  return <main className="inner-page gallery-page">
    <EditorialHero eyebrow="Galeri" title="Koleksiyona yakından bakın." lead="Deri yüzeyleri, cam kapakları, iç bölmeleri ve farklı renklerin karakterini ürün detayları üzerinden keşfedin." primary={{ href: "#galeri", label: "Galeriyi aç" }} secondary={{ href: "/koleksiyon", label: "Alışverişe geç" }} panelTitle="Detay, malzemeyi görünür kılar." panelText="Her açı; kapasite, yüzey ve kullanım biçimi hakkında yeni bir fikir verir." stats={[{ value: String(gallery.length), label: "seçili kare" }, { value: "5", label: "renk dünyası" }, { value: "360°", label: "ürün hissi" }]} />
    <section id="galeri" className="gallery-grid">{gallery.map((item, index) => <Link className={index % 7 === 0 ? "gallery-item gallery-wide" : "gallery-item"} href={`/urun/${item.slug}`} key={`${item.slug}-${index}`}><img src={item.image} alt={item.name}/><span><small>{item.detail}</small><b>{item.name}</b><em>Detayı gör →</em></span></Link>)}</section>
    <section className="gallery-note"><p className="eyebrow">Moneluks seçkisi</p><h2>Görünür düzen,<br/>yalın bir bütünlük.</h2><p>Cam kapağın altında düzenlenen koleksiyon; hem günlük seçimi kolaylaştırır hem de yaşam alanının bir parçasına dönüşür.</p><Link className="text-link" href="/aksesuar-kutulari">Aksesuar kutularını keşfet →</Link></section>
    <PageCta eyebrow="Sıradaki parça" title="Galeride beğendiğiniz modeli koleksiyonda bulun." text="Renk ve kapasite seçeneklerini karşılaştırın, size uygun kutuyu seçin." href="/koleksiyon" label="Koleksiyonu incele" secondary={{ href: "/rehber", label: "Seçim desteği" }} />
  </main>;
}
