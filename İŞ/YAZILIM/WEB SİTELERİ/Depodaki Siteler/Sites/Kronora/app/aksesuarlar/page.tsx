import Link from "next/link";
import { EditorialHero, FeatureModule, PageCta, ProcessModule } from "../section-modules";

export const metadata = { title: "Aksesuarlar | Moneluks", description: "Saat, gözlük ve günlük kişisel parçalar için tamamlayıcı aksesuar düzeni ve ürün seçkisi.", alternates: { canonical: "/aksesuarlar" } };

export default function AccessoriesPage() {
  return <main className="inner-page">
    <EditorialHero eyebrow="Aksesuarlar" title="Koleksiyonunuzu tamamlayan küçük ayrıntılar." lead="Saat, gözlük, yüzük, bileklik ve kol düğmesi gibi günlük parçaları daha düzenli kullanmak için seçilmiş tamamlayıcı çözümler ve bakım önerileri." primary={{ href: "/aksesuar-kutulari", label: "Kutuları keşfet" }} secondary={{ href: "/galeri", label: "Galeride görün" }} panelTitle="Gününüzü hızlandıran, düzeni tamamlayan parçalar." panelText="Kişisel aksesuarlarınızı bir arada, görünür ve kullanıma hazır tutan sade bir sistem." stats={[{ value: "5", label: "aksesuar grubu" }, { value: "1", label: "düzen sistemi" }, { value: "Her gün", label: "kolay kullanım" }]} />
    <section className="accessory-categories"><div className="module-heading"><div><p className="eyebrow">Kişisel seçki</p><h2>Her parçaya<br/>ayrı bir alan.</h2></div><p>İyi bir aksesuar düzeni, sabah seçimini hızlandırır ve parçaların birbirine temas etmesini azaltır.</p></div><div className="category-showcase">
      <Link href="/tekli-saat-kutulari"><span>01</span><h3>Tekli saat kutuları</h3><p>Favori saatiniz, seyahat ve hediye için kompakt koruma.</p><b>Sayfayı aç →</b></Link>
      <Link href="/gozluk-airpods-kutusu"><span>02</span><h3>Gözlük & AirPods</h3><p>İki günlük parçayı ayrı bölmelerde buluşturan kombine kutu.</p><b>Sayfayı aç →</b></Link>
      <Link href="/tekli-gozluk-kutulari"><span>03</span><h3>Tekli gözlük kutuları</h3><p>Optik veya güneş gözlüğüne ayrılmış sade ve korunaklı alan.</p><b>Sayfayı aç →</b></Link>
      <Link href="/organizerler"><span>04</span><h3>Organizerler</h3><p>Saat, gözlük, kulaklık ve küçük parçalar için çok bölmeli düzen.</p><b>Sayfayı aç →</b></Link>
      <Link href="/aksesuar-kutulari"><span>05</span><h3>Çoklu aksesuar kutuları</h3><p>Büyüyen koleksiyonlar için geniş ve çekmeceli saklama çözümleri.</p><b>Koleksiyonu gör →</b></Link>
    </div></section>
    <FeatureModule eyebrow="Günlük bakım" title="Koleksiyonunuzu daha iyi koruyun." intro="Basit kullanım alışkanlıkları, aksesuarların düzenli görünümünü ve yüzeylerinin korunmasını destekler." cards={[
      { title: "Temiz saklayın", text: "Saat ve aksesuarları kutuya yerleştirmeden önce yumuşak, kuru bir bezle yüzeyini silin." },
      { title: "Ayrı bölme kullanın", text: "Metal parçaların birbirine sürtünmesini azaltmak için her ürünü kendi alanında tutun." },
      { title: "Doğrudan güneşten koruyun", text: "Kutunuzu yoğun güneş alan ve hızlı sıcaklık değişen yüzeylerden uzakta konumlandırın." },
      { title: "Düzeni güncelleyin", text: "Koleksiyon büyüdükçe kullanılmayan alanları ve kapasite ihtiyacını yeniden değerlendirin." },
    ]} />
    <ProcessModule eyebrow="Bir düzen kurun" title="Koleksiyonu üç katmanda düşünün." steps={[
      { title: "Her gün kullandıklarınız", text: "En sık taktığınız saat, gözlük ve küçük aksesuarları kolay ulaşılabilen alana yerleştirin." },
      { title: "Dönüşümlü parçalar", text: "Haftalık veya mevsimlik parçaları üst bölmelerde görünür biçimde gruplayın." },
      { title: "Özel gün seçkisi", text: "Daha seyrek kullanılan değerli parçaları çekmeceli veya ayrı bölümlerde koruyun." },
    ]} />
    <PageCta eyebrow="Kişisel düzen" title="Aksesuarlarınızı tek bir sistemde buluşturun." text="Saatten gözlüğe, küçük parçalardan özel gün seçkisine kadar ihtiyacınıza uygun kutuyu seçin." href="/aksesuar-kutulari" label="Aksesuar kutularına git" secondary={{ href: "/rehber", label: "Seçim rehberi" }} />
  </main>;
}
