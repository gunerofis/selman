import type { WallColor, WallProductModel, WallVariant } from "./product-wall";

const colors: Array<{ slug: WallColor; name: string }> = [
  { slug: "krem", name: "Krem" }, { slug: "kahve", name: "Kahve" }, { slug: "bordo", name: "Bordo" }, { slug: "taba", name: "Taba" }, { slug: "siyah", name: "Siyah" },
];
const concepts = [
  ["tekli-saat-seyahat-kupu", "Tekli Saat Seyahat Küpü", "Bir saati kompakt biçimde taşır."],
  ["ikili-saat-seyahat-kutusu", "İkili Saat Seyahat Kutusu", "İki saati yolculukta ayrı bölmelerde korur."],
  ["dortlu-saat-kutusu", "Dörtlü Saat Kutusu", "Dört saati dengeli bir düzende saklar."],
  ["sekizli-cam-kapakli-saat-kutusu", "Sekizli Cam Kapaklı Saat Kutusu", "Sekiz saati görünür ve düzenli tutar."],
  ["on-ikili-cekmeceli-saat-kutusu", "On İkili Çekmeceli Saat Kutusu", "Saatleri ve küçük parçaları iki katta düzenler."],
  ["saat-ve-yuzuk-organizeri", "Saat ve Yüzük Organizeri", "Saatlerle yüzükleri ortak düzende toplar."],
  ["saat-ve-kol-dugmesi-organizeri", "Saat ve Kol Düğmesi Organizeri", "Saat ve kol düğmelerini ayrı bölmelerde saklar."],
  ["uclu-gozluk-kutusu", "Üçlü Gözlük Kutusu", "Üç gözlüğü çizilmeye karşı ayrı tutar."],
  ["altili-gozluk-kutusu", "Altılı Gözlük Kutusu", "Altı gözlüğü tek yüzeyde düzenler."],
  ["airpods-anahtar-valesi", "AirPods ve Anahtar Valesi", "Günlük küçük parçaları girişte toplar."],
  ["komodin-saat-valesi", "Komodin Saat Valesi", "Gece çıkarılan saat ve aksesuarları düzenler."],
  ["iki-katli-taki-saat-kutusu", "İki Katlı Takı ve Saat Kutusu", "Takı ve saatleri iki ayrı katta saklar."],
  ["dikey-saat-kulesi", "Dikey Saat Kulesi", "Saatleri dar bir yüzeyde dikey olarak toplar."],
  ["evrak-aksesuar-portfoyu", "Evrak ve Aksesuar Portföyü", "Evraklarla günlük aksesuarları birlikte taşır."],
] as const;

export type ConceptCatalogProduct = {
  kind: "new-model";
  slug: string;
  name: string;
  model: string;
  color: string;
  sku: string;
  shortDescription: string;
  description: string;
  primaryImage: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  href: string;
};

const colorCodes: Record<WallColor, string> = { krem: "KRM", kahve: "KHV", bordo: "BRD", taba: "TBA", siyah: "SYH" };

export const conceptCatalogProducts: ConceptCatalogProduct[] = concepts.flatMap(([key, model, description], modelIndex) =>
  colors.map(({ slug: colorSlug, name: color }) => {
    const slug = `${key}-${colorSlug}`;
    const name = `${model} ${color}`;
    return {
      kind: "new-model" as const,
      slug,
      name,
      model,
      color,
      sku: `MLX-${String(modelIndex + 7).padStart(2, "0")}-${colorCodes[colorSlug]}`,
      shortDescription: description,
      description: `${description} ${color} renk varyantı, deri dokulu dış yüzey ve yumuşak iç temas alanıyla Moneluks koleksiyonu için hazırlanmıştır. Üretim ölçüsü, fiyat ve stok bilgisi siparişe açılmadan önce kesinleştirilir.`,
      primaryImage: `/product-concepts/${slug}.webp`,
      metaTitle: `${name} | Moneluks`,
      metaDescription: `${description} ${color} renk seçeneğini ve ürün tasarımını inceleyin.`,
      keywords: [model.toLocaleLowerCase("tr-TR"), `${color.toLocaleLowerCase("tr-TR")} deri kutu`, "Moneluks yeni model"],
      href: `/urun/${slug}`,
    };
  }),
);

export function getConceptCatalogProduct(slug: string) {
  return conceptCatalogProducts.find((product) => product.slug === slug) || null;
}

export const conceptWallModels: WallProductModel[] = concepts.map(([key, name, description]) => {
  const variants = Object.fromEntries(colors.map(({ slug, name: color }) => [slug, {
    slug: `${key}-${slug}`, name, color, primaryImage: `/product-concepts/${key}-${slug}.webp`, priceCents: null, href: `/urun/${key}-${slug}`,
  } satisfies WallVariant])) as Record<WallColor, WallVariant>;
  return { key, name, description, concept: true, featured: false, variants };
});

export const CONCEPT_WALL_MODEL_KEYS = conceptWallModels.map((model) => model.key);
