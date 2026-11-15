import Link from "next/link";
import ProductCard from "../product-card";
import { getProducts } from "../lib/store";
import { EditorialHero, FeatureModule, PageCta } from "../section-modules";

export const dynamic = "force-dynamic";
export const metadata = { title: "Fırsatlar | Moneluks", description: "Moneluks saat ve aksesuar kutularındaki güncel avantajlı seçenekleri keşfedin.", alternates: { canonical: "/firsatlar" } };

export default async function OffersPage() {
  const products = await getProducts();
  const offers = products.filter((product) => product.oldPriceCents && product.oldPriceCents > product.priceCents).slice(0, 12);
  return <main className="inner-page">
    <EditorialHero eyebrow="Fırsatlar" title="İyi tasarım için doğru zaman." lead="Seçili saat ve aksesuar kutularında avantajlı fiyatları keşfedin; kapasite ve renk seçeneklerini tükenmeden karşılaştırın." primary={{ href: "#firsat-urunleri", label: "Fırsatları gör" }} secondary={{ href: "/koleksiyon", label: "Tüm koleksiyon" }} panelTitle="Seçili ürünler, sınırlı avantajlar." panelText="İhtiyacınız olan modeli daha iyi koşullarla koleksiyonunuza eklemek için güncel seçki." stats={[{ value: String(offers.length), label: "avantajlı ürün" }, { value: "5", label: "renk seçeneği" }, { value: "6–12", label: "saat kapasitesi" }]} />
    <section id="firsat-urunleri" className="product-module offer-products"><div className="module-heading"><div><p className="eyebrow">Güncel seçki</p><h2>Avantajlı modeller.</h2></div><p>Fiyat ve stok bilgileri ürün kartlarında güncel olarak gösterilir. Seçiminizi sepetten tamamlayabilirsiniz.</p></div>{offers.length > 0 ? <div className="product-grid">{offers.map((product) => <ProductCard key={product.slug} product={product}/>)}</div> : <div className="offers-empty"><span>Yeni seçki hazırlanıyor</span><h3>Fırsatlar yakında burada.</h3><p>Bu sırada tüm koleksiyonu inceleyebilir ve size uygun modeli bulabilirsiniz.</p><Link className="button dark-button" href="/koleksiyon">Koleksiyona git →</Link></div>}</section>
    <FeatureModule eyebrow="Akıllı seçim" title="Fırsatı ihtiyacınızla eşleştirin." intro="Yalnızca fiyata değil, kullanım biçiminize en çok değer katacak kapasite ve düzene odaklanın." cards={[
      { title: "Kapasiteyi düşünün", text: "Bugünkü koleksiyonunuza ek olarak büyüme payını da hesaba katın." },
      { title: "Bölmeleri karşılaştırın", text: "Sadece saat mi, gözlük ve küçük aksesuarlar da mı saklayacağınızı belirleyin." },
      { title: "Rengi mekânla eşleştirin", text: "Kutunun yer alacağı dolap, masa veya vitrinle uyumlu bir renk seçin." },
    ]} />
    <PageCta eyebrow="Karar desteği" title="Hangi fırsatın size uygun olduğundan emin değil misiniz?" text="Koleksiyon büyüklüğünüzü ve kullanım alanınızı paylaşın, doğru modele birlikte bakalım." href="/iletisim" label="Ürün danışın" secondary={{ href: "/rehber", label: "Seçim rehberi" }} />
  </main>;
}
