import { getProducts } from "../lib/store";
import ProductFamilyPage, { type ProductFamilyConfig } from "../product-family-page";

export const dynamic = "force-dynamic";
export const metadata = { title: "Tekli Gözlük Kutuları | Moneluks", description: "Tek bir gözlüğü masa üstünde veya seyahatte saklamak için deri kaplamalı gözlük kutuları.", alternates: { canonical: "/tekli-gozluk-kutulari" } };

const config: ProductFamilyConfig = {
  eyebrow: "Tekli gözlük kutuları",
  title: "Gözlüğünüz için sade ve korunaklı bir yer.",
  lead: "Optik veya güneş gözlüğünü günlük kullanımda kolay erişilir tutan; çerçeveyi ve camları ayrı bir alanda korumaya yardımcı olan tekli deri gözlük kutuları.",
  panelTitle: "Günlük çerçeveniz, düzenin bir parçası.",
  panelText: "Uzun iç hacim, yumuşak yüzey ve masa üstüne uyum sağlayan dengeli form tek bir gözlüğe odaklanır.",
  stats: [{ value: "1", label: "gözlük kapasitesi" }, { value: "Yumuşak", label: "iç yüzey" }, { value: "İnce", label: "yerleşim" }],
  match: ["tekli gözlük kutusu"],
  features: [
    { title: "Çerçeveye özel alan", text: "Gözlüğün başka aksesuarlarla temas etmesini azaltan ayrı ve uzun iç hacim.", meta: "Optik · güneş gözlüğü" },
    { title: "Camları koruyan düzen", text: "Yumuşak iç yüzeyle çizilme riskini azaltmaya yardımcı olan günlük saklama alanı.", meta: "Nazik temas" },
    { title: "Kolay erişim", text: "Antre, komodin veya çalışma masasında gözlüğün sabit bir yerde bulunmasını sağlar.", meta: "Günlük rutin" },
    { title: "Dekoratif form", text: "Deri yüzey ve sade çizgilerle bulunduğu alana düzenli bir görünüm kazandırır.", meta: "Ev · ofis" },
  ],
  steps: [
    { title: "Çerçeve genişliğini ölçün", text: "Gözlüğün kutu içinde sıkışmadan yerleşeceği iç ölçüyü seçin." },
    { title: "Kullanım biçimini belirleyin", text: "Sabit masa üstü kullanım veya seyahat için önceliğinizi belirleyin." },
    { title: "Deri rengini seçin", text: "Mekânınıza ve diğer aksesuarlarınıza uyum sağlayan tonu tercih edin." },
  ],
  collectionTitle: "Tekli gözlük seçkisi.",
  collectionText: "Günlük çerçeveleri tek başına saklamak ve kolayca erişmek için tasarlanan modeller.",
};

export default async function SingleGlassesBoxesPage() { return <ProductFamilyPage products={await getProducts()} config={config}/>; }
