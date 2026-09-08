import { getProducts } from "../lib/store";
import ProductFamilyPage, { type ProductFamilyConfig } from "../product-family-page";

export const dynamic = "force-dynamic";
export const metadata = { title: "Gözlük ve AirPods Kutusu | Moneluks", description: "Gözlük ve AirPods için ayrı bölmeler sunan kompakt kombine deri kutular.", alternates: { canonical: "/gozluk-airpods-kutusu" } };

const config: ProductFamilyConfig = {
  eyebrow: "Gözlük & AirPods",
  title: "İki günlük parça, tek düzenli kutu.",
  lead: "Gözlüğünüzü ve kablosuz kulaklığınızı aynı yerde, birbirinden ayrılmış bölmelerde saklamak için tasarlanan kompakt kombine kutu ailesi.",
  panelTitle: "Çıkarken aradığınız iki parça bir arada.",
  panelText: "Gözlük için uzun koruyucu alan, AirPods kutusu için kolay erişilen ayrı bölüm ve masa üstünde sade bir görünüm.",
  stats: [{ value: "2", label: "ayrı bölüm" }, { value: "1", label: "kompakt gövde" }, { value: "Günlük", label: "hızlı erişim" }],
  match: ["airpods"],
  features: [
    { title: "Ayrı bölmeler", text: "Gözlük ve kulaklık kutusunun birbirine temas etmeden aynı düzende saklanması.", meta: "Daha düzenli kullanım" },
    { title: "Hızlı erişim", text: "Evden veya ofisten çıkarken iki sık kullanılan parçayı tek noktadan alma kolaylığı.", meta: "Günlük rutin" },
    { title: "Masa üstü düzeni", text: "Komodin ve çalışma masasında kablo, kılıf ve gözlük dağınıklığını azaltan kompakt yapı.", meta: "Sade görünüm" },
    { title: "Koruyucu iç yüzey", text: "Gözlük camı ve aksesuar yüzeyleri için yumuşak dokulu temas alanları.", meta: "Nazik saklama" },
  ],
  steps: [
    { title: "Gözlük formunu kontrol edin", text: "Çerçevenizin genişliğine uygun uzun bölmeyi tercih edin." },
    { title: "Kulaklık neslini belirleyin", text: "Şarj kutusunun ölçüsünü ve kullandığınız koruyucu kılıfı hesaba katın." },
    { title: "Kullanım noktasını seçin", text: "Komodin, antre veya çalışma masasına uygun rengi belirleyin." },
  ],
  collectionTitle: "Gözlük ve AirPods kombinleri.",
  collectionText: "Günlük kullanılan iki aksesuarı tek gövdede düzenleyen modeller burada yer alır.",
};

export default async function GlassesAirpodsPage() { return <ProductFamilyPage products={await getProducts()} config={config}/>; }
