import Link from "next/link";
import ProductCard from "../product-card";
import { getProducts } from "../lib/store";
import { EditorialHero, FeatureModule, PageCta, ProcessModule } from "../section-modules";

export const dynamic = "force-dynamic";
export const metadata = { title: "Aksesuar Kutuları | Moneluks", description: "Saat, gözlük, yüzük ve kişisel aksesuarlar için çok bölmeli deri kutular.", alternates: { canonical: "/aksesuar-kutulari" } };

export default async function AccessoryBoxesPage() {
  const products = await getProducts();
  const selected = products.filter((product) => /gözlük|yüzük|aksesuar|çekmeceli/i.test(`${product.name} ${product.model}`)).slice(0, 8);
  return <main className="inner-page">
    <EditorialHero eyebrow="Aksesuar kutuları" title="Saatten fazlasını düzenleyen kutular." lead="Gözlük, yüzük, kol düğmesi, bileklik ve günlük parçalar için ayrılmış alanları tek, rafine bir düzende birleştiren çok amaçlı koleksiyon." primary={{ href: "#aksesuar-koleksiyonu", label: "Modelleri keşfet" }} secondary={{ href: "/rehber", label: "Seçim rehberini aç" }} panelTitle="Her parçanın kendine ait bir yeri olsun." panelText="Yumuşak iç yüzey, görünür cam kapak ve çekmeceli seçeneklerle daha düzenli bir kişisel alan." stats={[{ value: "3+", label: "aksesuar türü" }, { value: "5", label: "renk" }, { value: "2", label: "kat seçeneği" }]} />
    <FeatureModule eyebrow="Düzen mimarisi" title="Bir kutu, farklı kullanım biçimleri." intro="Koleksiyon büyüdükçe farklı aksesuarları tek bakışta görebilmek ve ayrı yüzeylerde saklamak günlük kullanımı kolaylaştırır." cards={[
      { title: "Saat bölmeleri", text: "Yumuşak yastıklar saatlerin birbirine temas etmeden düzenli durmasına yardımcı olur." },
      { title: "Gözlük alanları", text: "Uzun ve ayrı bölmeler günlük gözlükleri, güneş gözlüklerini ve çerçeveleri bir arada tutar." },
      { title: "Yüzük ve küçük parçalar", text: "Küçük aksesuarlar için ayrılmış alanlar sabah rutininde aradığınızı hızla bulmanızı sağlar." },
      { title: "Çekmeceli katman", text: "Daha geniş koleksiyonlarda ikinci kat, görünür alanı bozmadan ek saklama hacmi sunar." },
    ]} />
    <section id="aksesuar-koleksiyonu" className="product-module"><div className="module-heading"><div><p className="eyebrow">Seçili modeller</p><h2>Çok amaçlı koleksiyon.</h2></div><p>Saat, gözlük ve küçük aksesuarları aynı gövdede düzenleyen öne çıkan ürünler.</p></div><div className="product-grid">{selected.map((product) => <ProductCard key={product.slug} product={product}/>)}</div><Link className="button dark-button centered-button" href="/koleksiyon">Tüm ürünleri görün →</Link></section>
    <ProcessModule eyebrow="Doğru modeli seçin" title="Üç soruyla karar verin." steps={[
      { title: "Neleri saklayacaksınız?", text: "Saat, gözlük ve küçük parçaların yaklaşık sayısını not edin." },
      { title: "Nerede kullanacaksınız?", text: "Dolap, masa veya vitrine göre tek katlı ya da çekmeceli modeli belirleyin." },
      { title: "Nasıl görünmesini istersiniz?", text: "Bulunduğu mekâna uyum sağlayan deri rengini ve kapasiteyi seçin." },
    ]} />
    <PageCta eyebrow="Düzen şimdi başlar" title="Günlük aksesuarlarınızı tek bakışta görün." text="İhtiyacınıza uygun bölme yapısını seçin, kişisel alanınızı sadeleştirin." href="/koleksiyon" label="Koleksiyona git" secondary={{ href: "/iletisim", label: "Ürün danışın" }} />
  </main>;
}
