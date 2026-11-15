import { getProducts } from "../lib/store";
import ProductFamilyPage, { type ProductFamilyConfig } from "../product-family-page";

export const dynamic = "force-dynamic";
export const metadata = { title: "Tekli Saat Kutuları | Moneluks", description: "Tek bir saati korumak, sergilemek ve seyahatte taşımak için kompakt deri saat kutuları.", alternates: { canonical: "/tekli-saat-kutulari" } };

const config: ProductFamilyConfig = {
  eyebrow: "Tekli saat kutuları",
  title: "Tek bir saate ayrılmış özel bir alan.",
  lead: "Günlük saatinizi komodin, ofis veya seyahat çantasında düzenli tutmak için kompakt, koruyucu ve hediye vermeye uygun tekli saat kutuları.",
  panelTitle: "Favori saatiniz için küçük bir vitrin.",
  panelText: "Yumuşak iç yüzey, dengeli gövde ve az yer kaplayan form; tek parçaya odaklanan rafine bir saklama deneyimi sunar.",
  stats: [{ value: "1", label: "saat kapasitesi" }, { value: "Kompakt", label: "masa üstü form" }, { value: "Hediye", label: "sunuma uygun" }],
  match: ["tekli saat kutusu"],
  features: [
    { title: "Tek saate özel", text: "Saatin kutu içinde hareketini azaltan, tek parçaya göre kurgulanmış iç hacim.", meta: "Günlük kullanım" },
    { title: "Kompakt form", text: "Komodin, kasa, çekmece ve seyahat çantasında gereksiz yer kaplamayan ölçü.", meta: "Ev · ofis · seyahat" },
    { title: "Yumuşak temas", text: "Saat yüzeyi ve kordonun temas ettiği noktalarda daha nazik bir saklama deneyimi.", meta: "Koruyucu iç yüzey" },
    { title: "Hediye alternatifi", text: "Saat hediyesini tamamlayan veya koleksiyon sahibine kişisel bir alan sunan zarif seçenek.", meta: "Özel günler" },
  ],
  steps: [
    { title: "Saat ölçüsünü düşünün", text: "Kasa çapı ve kordon yapısına uygun iç hacmi tercih edin." },
    { title: "Kullanım yerini belirleyin", text: "Evde sergileme veya seyahatte taşıma önceliğinize göre formu seçin." },
    { title: "Rengi eşleştirin", text: "Saatin karakteri ve bulunduğu mekânla uyumlu deri rengini belirleyin." },
  ],
  collectionTitle: "Tekli saat seçkisi.",
  collectionText: "Kişisel kullanım, seyahat ve hediye için geliştirilen kompakt modeller burada listelenir.",
};

export default async function SingleWatchBoxesPage() { return <ProductFamilyPage products={await getProducts()} config={config}/>; }
