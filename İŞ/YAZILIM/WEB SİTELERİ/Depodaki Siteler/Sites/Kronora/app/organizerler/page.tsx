import { getProducts } from "../lib/store";
import ProductFamilyPage, { type ProductFamilyConfig } from "../product-family-page";

export const dynamic = "force-dynamic";
export const metadata = { title: "Organizerler | Moneluks", description: "Saat, gözlük, kulaklık, yüzük ve günlük aksesuarlar için çok bölmeli deri organizerler.", alternates: { canonical: "/organizerler" } };

const config: ProductFamilyConfig = {
  eyebrow: "Organizerler",
  title: "Gününüzü sadeleştiren kişisel düzen.",
  lead: "Saat, gözlük, kulaklık, anahtar, yüzük ve küçük aksesuarları kullanım alışkanlığınıza göre ayrılmış bölmelerde bir araya getiren deri organizerler.",
  panelTitle: "Her parçanın yeri belli, her sabah daha akıcı.",
  panelText: "Farklı boyutlardaki günlük eşyaları tek bir düzende buluşturan bölmeli, çekmeceli ve çok amaçlı çözümler.",
  stats: [{ value: "4+", label: "aksesuar türü" }, { value: "Bölmeli", label: "iç mimari" }, { value: "Esnek", label: "kullanım" }],
  match: ["organizer", "çekmeceli aksesuar", "çekmeceli duo"],
  features: [
    { title: "Bölümlendirilmiş iç yapı", text: "Farklı boyutlardaki parçaları kullanım sıklığına göre ayıran düzenli alanlar.", meta: "Saat · gözlük · küçük aksesuar" },
    { title: "Katmanlı saklama", text: "Çekmeceli seçeneklerle görünür koleksiyonun altında ek saklama kapasitesi.", meta: "Daha fazla hacim" },
    { title: "Masa üstü istasyonu", text: "Gün içinde cebe girip çıkan parçaları tek bir alışkanlık noktasında toplar.", meta: "Ev · ofis · antre" },
    { title: "Esnek kullanım", text: "Kişisel aksesuar düzeninden kurumsal hediye ve otel kullanımına kadar farklı senaryolar.", meta: "Kişisel · kurumsal" },
  ],
  steps: [
    { title: "Günlük parçaları listeleyin", text: "Her gün kullandığınız saat, gözlük, kulaklık ve küçük eşyaları belirleyin." },
    { title: "Bölme sayısını seçin", text: "Ürün adedine ve boyutlarına uygun açık, kapaklı veya çekmeceli yapıyı seçin." },
    { title: "Kullanım noktasını kurun", text: "Organizeri her gün aynı noktada kullanarak düzeni kalıcı bir rutine dönüştürün." },
  ],
  collectionTitle: "Çok amaçlı organizerler.",
  collectionText: "Farklı aksesuarları tek sistemde buluşturan mevcut ve yeni nesil organizer modelleri.",
};

export default async function OrganizersPage() { return <ProductFamilyPage products={await getProducts()} config={config}/>; }
