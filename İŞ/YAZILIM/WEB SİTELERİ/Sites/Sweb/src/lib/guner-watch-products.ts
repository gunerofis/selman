import type { LineItem } from "./line-items";

type Color = {
  id: "bordo" | "kahve" | "krem" | "siyah" | "taba";
  label: "Bordo" | "Kahve" | "Krem" | "Siyah" | "Taba";
  tone: string;
};

type Family = {
  code: "GNRS01" | "GNRS03" | "GNRS04" | "GNRS05" | "GNRS06" | "GNRS07";
  title: (color: string) => string;
  price: number;
  oldPrice: number;
  tags: string[];
  filterTags: string[];
  size: string;
  description: (color: Color) => string;
  seoDescription: (color: Color) => string;
  details: Array<{ label: string; value: string }>;
};

const COLORS: Color[] = [
  { id: "bordo", label: "Bordo", tone: "Klasik ve seçkin" },
  { id: "kahve", label: "Kahve", tone: "Sıcak ve dengeli" },
  { id: "krem", label: "Krem", tone: "Aydınlık ve sade" },
  { id: "siyah", label: "Siyah", tone: "Net ve modern" },
  { id: "taba", label: "Taba", tone: "Doğal ve zamansız" },
];

const COMMON_DETAILS = [
  { label: "Gövde", value: "MDF üzeri suni deri kaplama" },
  { label: "İç yüzey", value: "Kadife kaplama ve yumuşak saat yastıkları" },
  { label: "Kapak", value: "Şeffaf cam kapak" },
  { label: "Stok ve üretim", value: "Satış öncesi teyit edilir" },
];

const FAMILIES: Family[] = [
  {
    code: "GNRS06",
    title: (color) => `Cam Kapaklı Saat, Gözlük ve Yüzük Kutusu ${color}`,
    price: 1850,
    oldPrice: 2500,
    tags: ["6 saat", "3 gözlük", "1 yüzük", "Cam kapak"],
    filterTags: ["kap-orta"],
    size: "37 × 19 × 8 cm",
    description: (color) =>
      `${color.tone} ${color.label.toLocaleLowerCase("tr-TR")} dış yüzeyiyle altı kol saati, üç gözlük ve bir yüzük için ayrı alanlar sunar. Saat yastıkları ve uzun gözlük bölmeleri aksesuarların birbirine temasını azaltır. Suni deri kaplamalı MDF gövde, kadife iç yüzey ve şeffaf cam kapak ev, ofis veya vitrin kullanımında düzenli bir sunum sağlar.`,
    seoDescription: (color) =>
      `${color.label} cam kapaklı saat, gözlük ve yüzük kutusu; 6 saat, 3 gözlük ve 1 yüzük için kadife kaplı ayrı saklama alanları sunar.`,
    details: [{ label: "Kapasite", value: "6 saat, 3 gözlük ve 1 yüzük" }, ...COMMON_DETAILS],
  },
  {
    code: "GNRS04",
    title: (color) => `Cam Kapaklı Saat ve Gözlük Kutusu ${color}`,
    price: 1850,
    oldPrice: 2500,
    tags: ["6 saat", "3 gözlük", "Cam kapak", "Kadife iç yüzey"],
    filterTags: ["kap-orta"],
    size: "37 × 19 × 8 cm",
    description: (color) =>
      `${color.tone} ${color.label.toLocaleLowerCase("tr-TR")} dış yüzeyiyle altı kol saati ve üç gözlüğü aynı gövdede düzenler. Yumuşak saat yastıkları ile uzun gözlük bölmeleri aksesuarları ayrı tutar. Suni deri kaplamalı MDF gövde, kadife iç yüzey ve şeffaf cam kapak koleksiyonu korumaya ve görünür biçimde sergilemeye yardımcı olur.`,
    seoDescription: (color) =>
      `${color.label} cam kapaklı saat ve gözlük kutusu; 6 saat ve 3 gözlük için kadife kaplı ayrı bölmelerle düzenli saklama sağlar.`,
    details: [{ label: "Kapasite", value: "6 saat ve 3 gözlük" }, ...COMMON_DETAILS],
  },
  {
    code: "GNRS05",
    title: (color) => `Çekmeceli 12'li Saat ve 6'lı Gözlük Kutusu ${color}`,
    price: 2650,
    oldPrice: 3500,
    tags: ["12 saat", "6 gözlük", "Çekmeceli", "Cam kapak"],
    filterTags: ["kap-buyuk"],
    size: "37 × 19 × 14 cm",
    description: (color) =>
      `${color.tone} ${color.label.toLocaleLowerCase("tr-TR")} dış yüzeyiyle saat ve gözlük koleksiyonlarını tek gövdede düzenler. Üst bölümde on iki yastıklı saat alanı, alt çekmecede altı gözlük için ayrılmış bölmeler bulunur. Suni deri kaplama, MDF gövde, kadife iç yüzey ve şeffaf cam kapak düzenli ve dekoratif bir sergileme alanı oluşturur.`,
    seoDescription: (color) =>
      `${color.label} çekmeceli saat ve gözlük kutusu; 12 saat ve 6 gözlük için kadife bölmeler, cam kapak ve iki katlı düzen sunar.`,
    details: [{ label: "Kapasite", value: "12 saat ve 6 gözlük" }, ...COMMON_DETAILS],
  },
  {
    code: "GNRS03",
    title: (color) => `12'li Cam Kapaklı Saat Kutusu ${color}`,
    price: 1850,
    oldPrice: 2700,
    tags: ["12 saat", "Cam kapak", "Kadife iç yüzey", "Koleksiyon düzeni"],
    filterTags: ["kap-buyuk"],
    size: "37 × 19 × 8 cm",
    description: (color) =>
      `${color.tone} ${color.label.toLocaleLowerCase("tr-TR")} dış yüzeyiyle on iki kol saatini düzenli biçimde saklamak ve sergilemek için tasarlanmıştır. Yumuşak yastıklı bölmeler saat kasalarının birbirine temasını azaltır. Suni deri kaplama, MDF gövde, kadife iç yüzey ve şeffaf cam kapak ev, ofis ve vitrinlerde düzenli bir koleksiyon sunumu sağlar.`,
    seoDescription: (color) =>
      `${color.label} 12'li saat kutusu; yastıklı bölmeler, kadife iç yüzey ve şeffaf cam kapakla saat koleksiyonunu düzenler ve sergiler.`,
    details: [{ label: "Kapasite", value: "12 kol saati" }, ...COMMON_DETAILS],
  },
  {
    code: "GNRS07",
    title: (color) => `12'li Çekmeceli Saat ve Aksesuar Kutusu ${color}`,
    price: 2650,
    oldPrice: 3500,
    tags: ["12 saat", "Aksesuar çekmecesi", "Cam kapak", "Kadife iç yüzey"],
    filterTags: ["kap-buyuk"],
    size: "Satış öncesi teyit edilir",
    description: (color) =>
      `${color.tone} ${color.label.toLocaleLowerCase("tr-TR")} dış yüzeyiyle saat koleksiyonunu ve küçük kişisel aksesuarları tek gövdede düzenler. Üst bölümde on iki yastıklı saat alanı; alt çekmecede tesbih, bileklik, kolye, yüzük ve anahtarlık için geniş bir bölüm bulunur. Şeffaf cam kapak, suni deri kaplamalı MDF gövde ve kadife iç yüzey düzenli saklamayı destekler.`,
    seoDescription: (color) =>
      `${color.label} 12'li çekmeceli saat ve aksesuar kutusu; cam kapak, kadife iç yüzey ve geniş alt çekmeceyle düzenli saklama sunar.`,
    details: [
      { label: "Kapasite", value: "12 saat ve küçük aksesuarlar" },
      { label: "Alt çekmece", value: "Tesbih, bileklik, kolye, yüzük ve anahtarlık için" },
      ...COMMON_DETAILS,
    ],
  },
  {
    code: "GNRS01",
    title: (color) => `6'lı Cam Kapaklı Saat Kutusu ${color}`,
    price: 1485,
    oldPrice: 2000,
    tags: ["6 saat", "Cam kapak", "Kompakt gövde"],
    filterTags: ["kap-orta"],
    size: "Satış öncesi teyit edilir",
    description: (color) =>
      `${color.tone} ${color.label.toLocaleLowerCase("tr-TR")} dış yüzeyiyle altı kol saatini az yer kaplayan bir düzende muhafaza eder. Yumuşak yastıklar saatleri ayrı tutar; kadife iç kaplama çizilmelere karşı korumayı destekler. Suni deri kaplamalı MDF gövde ve şeffaf cam kapak düzenli saklama ile kolay sergilemeyi bir araya getirir.`,
    seoDescription: (color) =>
      `${color.label} 6'lı saat kutusu; yumuşak saat yastıkları, kadife iç yüzey ve şeffaf cam kapakla kompakt saklama sunar.`,
    details: [
      { label: "Kapasite", value: "6 kol saati" },
      ...COMMON_DETAILS,
    ],
  },
];

function sku(family: Family, color: Color) {
  return `${family.code}-${color.label.toLocaleUpperCase("tr-TR")}`;
}

const STANDARD_CODE_START: Partial<Record<Family["code"], number>> = {
  GNRS05: 7040,
  GNRS07: 7045,
  GNRS01: 7050,
};

function productCode(family: Family, color: Color) {
  const start = STANDARD_CODE_START[family.code];
  if (!start) return sku(family, color);
  return `ST-${start + COLORS.findIndex((item) => item.id === color.id)}`;
}

export const GUNER_WATCH_PRODUCTS: LineItem[] = FAMILIES.flatMap((family) =>
  COLORS.map((color) => {
    const sourceId = `${family.code.toLocaleLowerCase("tr-TR")}-${color.id}`;
    const code = productCode(family, color);
    const id = family.price === 1850 ? sourceId : code.toLocaleLowerCase("tr-TR");
    const name = family.title(color.label);
    return {
      id,
      name,
      image:
        family.price === 1850
          ? `/gunerofis-watch-boxes/${sourceId}-studio-960.webp`
          : `/catalog-standard/${code.toLocaleLowerCase("tr-TR")}.png`,
      imageSrcSet:
        family.price === 1850
          ? `/gunerofis-watch-boxes/${sourceId}-studio-480.webp 480w, /gunerofis-watch-boxes/${sourceId}-studio-960.webp 960w`
          : undefined,
      alt: `${name}, ${color.label.toLocaleLowerCase("tr-TR")} renk`,
      price: family.price,
      oldPrice: family.oldPrice,
      availability: "out-of-stock",
      color: color.label,
      code,
      kind: "Saat kutusu",
      tags: family.tags,
      note: "Stok ve üretim süresi satış öncesi teyit edilir",
      filter: "saat",
      filterTags: family.filterTags,
      teklifNot: `CLIK · ${code} · ${name} · stok ve üretim bilgisi`,
      seoTitle: name,
      seoDescription: family.seoDescription(color),
      description: family.description(color),
      details: [
        ...family.details,
        { label: "Dış ölçü", value: family.size },
        { label: "Renk", value: color.label },
      ],
    };
  }),
);
