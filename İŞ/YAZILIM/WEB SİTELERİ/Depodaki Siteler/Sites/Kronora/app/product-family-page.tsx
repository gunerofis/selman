import type { StoreProduct } from "./lib/store";
import FamilyColorSelector from "./family-color-selector";
import { EditorialHero, FeatureModule, PageCta, ProcessModule } from "./section-modules";

export type ProductFamilyConfig = {
  eyebrow: string;
  title: string;
  lead: string;
  panelTitle: string;
  panelText: string;
  stats: Array<{ value: string; label: string }>;
  match: string[];
  features: Array<{ title: string; text: string; meta?: string }>;
  steps: Array<{ title: string; text: string }>;
  collectionTitle: string;
  collectionText: string;
};

export default function ProductFamilyPage({ products, config }: { products: StoreProduct[]; config: ProductFamilyConfig }) {
  const terms = config.match.map((term) => term.toLocaleLowerCase("tr-TR"));
  const matching = products.filter((product) => {
    const identity = `${product.name} ${product.model} ${product.sku}`.toLocaleLowerCase("tr-TR");
    return terms.some((term) => identity.includes(term));
  });

  return <main className="inner-page product-family-page">
    <EditorialHero eyebrow={config.eyebrow} title={config.title} lead={config.lead} primary={{ href: "#urunler", label: "Ürünleri gör" }} secondary={{ href: "/iletisim", label: "Bilgi alın" }} panelTitle={config.panelTitle} panelText={config.panelText} stats={config.stats}/>
    <FeatureModule eyebrow="Tasarım yaklaşımı" title="Küçük ölçekte, yüksek işlev." intro="Günlük kullanılan parçalar için doğru ölçü, yumuşak temas yüzeyi ve sade erişim bir araya geliyor." cards={config.features}/>
    <FamilyColorSelector products={matching} title={config.collectionTitle} intro={config.collectionText}/>
    <ProcessModule eyebrow="Kullanım rehberi" title="Doğru ürünü üç adımda seçin." steps={config.steps}/>
    <PageCta eyebrow="Moneluks koleksiyonu" title="Aradığınız ölçü veya renk henüz listede yok mu?" text="Kullanım amacınızı paylaşın; uygun ürün ailesini, renkleri ve toplu üretim seçeneklerini birlikte değerlendirelim." href="/iletisim" label="Bize ulaşın" secondary={{ href: "/aksesuarlar", label: "Tüm aksesuarlar" }}/>
  </main>;
}
