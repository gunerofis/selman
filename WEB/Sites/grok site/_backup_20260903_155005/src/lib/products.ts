import { fuzzyIncludes } from "./fuzzy";
import { promoteExact } from "./search-rank";

export const COLORS = [
  { id: "espresso", name: "Espresso", swatch: "#3D2C26" },
  { id: "siyah", name: "Siyah", swatch: "#1A1816" },
  { id: "krem", name: "Krem", swatch: "#D8CFC3" },
  { id: "lacivert", name: "Orman", swatch: "#24382C" },
  { id: "gri", name: "Taş", swatch: "#6B6458" },
  { id: "beyaz", name: "Beyaz", swatch: "#F3F1ED" },
  { id: "taba", name: "Taba", swatch: "#A66B3C" },
  { id: "bordo", name: "Kestane", swatch: "#4E2A22" },
] as const;

export type ColorId = (typeof COLORS)[number]["id"];

export type ProductImageWidth = 320 | 800;

export function productImageVariant(image: string, width: ProductImageWidth) {
  return image.replace(/\.webp$/, `-${width}.webp`);
}

/** Tile wash when a leather color is selected on the wall. */
export const PASTEL: Record<ColorId, string> = {
  espresso: "#EDE2DB",
  siyah: "#E4DFD6",
  krem: "#EFE6DA",
  lacivert: "#E4EADC",
  gri: "#E6E3DC",
  beyaz: "#F7F3EC",
  taba: "#EDE2DB",
  bordo: "#E8DFD4",
};

export const CATEGORIES = [
  { id: "ofis", name: "Ofis", blurb: "Masa, evrak, şarj, imza." },
  { id: "banyo", name: "Banyo", blurb: "Lavabo, tıraş, ıslak hacim." },
  { id: "makyaj", name: "Makyaj", blurb: "Ayna, ruj, fırça." },
  { id: "mutfak", name: "Mutfak", blurb: "Tezgâh ve çekmece." },
  { id: "gardrop", name: "Gardırop", blurb: "Saat, kemer, günlük eşya." },
  { id: "giris", name: "Giriş", blurb: "Kapı, oturak, anahtar." },
  { id: "yasam", name: "Yaşam", blurb: "Sehpa, vitrin, koltuk." },
  { id: "arac", name: "Araç", blurb: "Koltuk arkası düzen." },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

/** Hub tiles skip Araç (tek parça); kategori filtresi ve alt bilgi durur. */
export const HUB_CATEGORIES = CATEGORIES.filter((c) => c.id !== "arac");

export const SERIES = [
  {
    id: "kompakt",
    name: "Kompakt masa",
    blurb: "Sümen, stand, tepsi, kulaklık.",
    image: "/products/set-kompakt.webp",
  },
  {
    id: "aksesuar",
    name: "Masa aksesuar",
    blurb: "A4, evraklık, monitör, şarj.",
    image: "/products/set-aksesuar.webp",
  },
  {
    id: "yonetici",
    name: "Yönetici masa",
    blurb: "Sümen, arşiv, imza, kaşe.",
    image: "/products/set-yonetici.webp",
  },
] as const;

export type SeriesId = (typeof SERIES)[number]["id"];

export type Spec = { label: string; value: string };

export type Product = {
  sku: string;
  name: string;
  shortName: string;
  category: CategoryId;
  series?: SeriesId;
  price: number;
  image: string;
  tagline: string;
  description: string;
  features: string[];
  specs: Spec[];
  featured?: boolean;
};

const TR_SLUG: Record<string, string> = {
  ç: "c",
  ğ: "g",
  ı: "i",
  i: "i",
  ö: "o",
  ş: "s",
  ü: "u",
  â: "a",
  î: "i",
  û: "u",
};

export function slugify(input: string) {
  return input
    .split("")
    .map((ch) => TR_SLUG[ch] ?? TR_SLUG[ch.toLocaleLowerCase("tr")] ?? ch)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function productSlug(p: Product) {
  return slugify(p.name);
}

export const CATEGORY_ALIASES: Record<string, CategoryId> = {
  calisma: "ofis",
  "yatak-odasi": "gardrop",
  ev: "yasam",
};

export function resolveCategory(id: string | undefined): CategoryId | undefined {
  if (!id) return undefined;
  if (CATEGORIES.some((c) => c.id === id)) return id as CategoryId;
  return CATEGORY_ALIASES[id];
}

export const PRODUCTS: Product[] = [
  {
    sku: "7002",
    name: "Komodin organizeri",
    shortName: "Komodin",
    category: "gardrop",
    price: 3890,
    image: "/products/7002.webp",
    tagline: "Telefon, gözlük, saat — çekmece altta.",
    description:
      "Yatak başı için üç bölmeli valet. Telefon yuvası, gözlük yatağı, saat yastığı; altta günlük eşya çekmecesi.",
    features: ["Eğimli telefon yuvası", "Gözlük ve saat bölmesi", "Alt çekmece", "Kaymaz taban"],
    specs: [
      { label: "Dış ölçü", value: "240 × 160 × 90 mm" },
      { label: "Ağırlık", value: "380 g" },
      { label: "Renk", value: "8 seçenek" },
    ],
    featured: true,
  },
  {
    sku: "7003",
    name: "Koltuk arkası organizeri",
    shortName: "Koltuk arkası",
    category: "arac",
    price: 4490,
    image: "/products/7003.webp",
    tagline: "Koltuk arkasına asılır, tabla açılır.",
    description:
      "Başlık kayışlı koltuk arkası panel. Üst cep, açılır tabla, alt dergi cebi. Arka koltuk için sabit durak.",
    features: [
      "Başlık kayışı",
      "Açılır orta tabla",
      "Üst ve alt cep",
      "Koltuk kumaşına sürtünmeyen astar",
    ],
    specs: [
      { label: "Dış ölçü", value: "420 × 580 mm" },
      { label: "Ağırlık", value: "680 g" },
      { label: "Montaj", value: "Başlık kayışı" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7004",
    name: "Mama standı",
    shortName: "Mama",
    category: "yasam",
    price: 5290,
    image: "/products/7004.webp",
    tagline: "İki çelik kap, mama ve fırça yeri.",
    description:
      "Yükseltilmiş mama ve su kabı. Arkada mama poşeti, fırça ve poşet rulosu; yanda tasma kancası.",
    features: ["İki paslanmaz kap", "Mama ve fırça bölmesi", "Tasma kancası", "Yükseltilmiş taban"],
    specs: [
      { label: "Dış ölçü", value: "420 × 280 × 260 mm" },
      { label: "Ağırlık", value: "2100 g" },
      { label: "Kap", value: "2 × çelik" },
      { label: "Renk", value: "8 seçenek" },
    ],
    featured: true,
  },
  {
    sku: "7005",
    name: "Tıraş istasyonu",
    shortName: "Tıraş",
    category: "banyo",
    price: 4790,
    image: "/products/7005.webp",
    tagline: "Fırça, tarak, makine, iki pompa.",
    description:
      "Lavabo kenarı tıraş durağı. Fırça ve tarak yuvaları, makine yatağı, iki pompa deliği, altta çekmeceli tepsi.",
    features: ["Fırça ve tarak yuvası", "İki pompa deliği", "Makine yatağı", "Çekmeceli alt tepsi"],
    specs: [
      { label: "Dış ölçü", value: "280 × 180 × 220 mm" },
      { label: "Ağırlık", value: "620 g" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7006",
    name: "Piknik çantası",
    shortName: "Piknik",
    category: "yasam",
    price: 5690,
    image: "/products/7006.webp",
    tagline: "İki bardak yuvası, bölmeli gövde.",
    description:
      "Kulplu, kapaklı piknik kutusu. Yan kanatlarda iki bardak yuvası, içte iki bölme. Kapak açık durur.",
    features: ["İki yan bardak yuvası", "İç bölme", "Taşıma kulpu", "Menteşeli kapak"],
    specs: [
      { label: "Dış ölçü", value: "320 × 180 × 120 mm" },
      { label: "Ağırlık", value: "740 g" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7006B",
    name: "Evcil hayvan seyahat istasyonu",
    shortName: "Seyahat mama",
    category: "yasam",
    price: 5890,
    image: "/products/7006B.webp",
    tagline: "Mama, tasma ve iki kap yolculukta.",
    description:
      "Evcil hayvanla yolculuk için kapaklı bakım istasyonu. Orta hazne mama ve küçük bakım araçlarını, yan yuvalar iki katlanır kabı, arka cepler tasma ve havluyu toplar.",
    features: [
      "Kapaklı orta hazne",
      "İki katlanır kap yuvası",
      "Tasma ve havlu cepleri",
      "Bölmeli iç düzen",
    ],
    specs: [
      { label: "Dış ölçü", value: "420 × 210 × 180 mm" },
      { label: "Ağırlık", value: "980 g" },
      { label: "Kapasite", value: "2 kap + bakım seti" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7007",
    name: "Askılı konsol",
    shortName: "Konsol",
    category: "giris",
    price: 8990,
    image: "/products/7007.webp",
    tagline: "İki kanca, çekmece, alt raf.",
    description:
      "Giriş holü için dikey oturak. Üstte iki kanca, oturma altında çekmece, tabanda ayakkabı rafı.",
    features: ["İki üst kanca", "Yastıklı oturma", "Çekmece", "Alt ayakkabı rafı"],
    specs: [
      { label: "Dış ölçü", value: "380 × 1100 × 320 mm" },
      { label: "Ağırlık", value: "4200 g" },
      { label: "Yük", value: "110 kg" },
      { label: "Renk", value: "8 seçenek" },
    ],
    featured: true,
  },
  {
    sku: "7008",
    name: "Yatak cebi",
    shortName: "Yatak cebi",
    category: "yasam",
    price: 2490,
    image: "/products/7008.webp",
    tagline: "Telefon üstte, gözlük ve kablo altta.",
    description:
      "Yatak veya kanepe kenarına asılan cep. Üst raf telefona, orta cep gözlüğe, alt cep kabloya.",
    features: ["Kenara asılır", "Telefon rafı", "Gözlük cebi", "Kablo cebi"],
    specs: [
      { label: "Dış ölçü", value: "180 × 320 mm" },
      { label: "Ağırlık", value: "220 g" },
      { label: "Montaj", value: "Kenar kancası" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7009",
    name: "Kolçak organizeri",
    shortName: "Kolçak",
    category: "yasam",
    price: 2790,
    image: "/products/7009.webp",
    tagline: "Bardak yuvası, iki kumanda cebi.",
    description: "Kanepe koluna geçen tepsi. Bardak yuvası, iki kumanda cebi, düz üst yüzey.",
    features: ["Kolçağa geçer", "Bardak yuvası", "İki kumanda cebi", "Düz tepsi yüzeyi"],
    specs: [
      { label: "Dış ölçü", value: "320 × 180 mm" },
      { label: "Ağırlık", value: "260 g" },
      { label: "Uyum", value: "Geniş kolçak" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7010",
    name: "Koltuk yan sehpası",
    shortName: "Sehpa",
    category: "yasam",
    price: 6490,
    image: "/products/7010.webp",
    tagline: "Bardak, telefon, yan cepte kitap.",
    description: "Kanepe altına giren C form. Üstte bardak ve telefon yuvası, gövdede dergi cebi.",
    features: ["C form taban", "Bardak yuvası", "Telefon yuvası", "Yan kitap cebi"],
    specs: [
      { label: "Dış ölçü", value: "280 × 560 × 320 mm" },
      { label: "Ağırlık", value: "2100 g" },
      { label: "Renk", value: "8 seçenek" },
    ],
    featured: true,
  },
  {
    sku: "7011",
    name: "Saat standı",
    shortName: "Saat standı",
    category: "giris",
    price: 4290,
    image: "/products/7011.webp",
    tagline: "Kanca, saat yastığı, gözlük tepsisi.",
    description: "Dikey valet. İki kanca, yanda saat yastığı, ortada kart cebi, altta iki tepsi.",
    features: ["İki pirinç kanca", "Saat yastığı", "Kart cebi", "İki kademeli tepsi"],
    specs: [
      { label: "Dış ölçü", value: "160 × 280 × 140 mm" },
      { label: "Ağırlık", value: "410 g" },
      { label: "Renk", value: "8 seçenek" },
    ],
    featured: true,
  },
  {
    sku: "7012",
    name: "Ayakkabı bankı",
    shortName: "Ayakkabı bankı",
    category: "giris",
    price: 9890,
    image: "/products/7012.webp",
    tagline: "Otur, çekmeceyi aç, alt rafa koy.",
    description:
      "Giriş bankı. Yastıklı oturma, iç çekmece, altta iki çift ayakkabı rafı, yanda çekecek cebi.",
    features: ["Yastıklı oturma", "İç çekmece", "Alt ayakkabı rafı", "Çekecek cebi"],
    specs: [
      { label: "Dış ölçü", value: "900 × 480 × 360 mm" },
      { label: "Ağırlık", value: "6400 g" },
      { label: "Yük", value: "120 kg" },
      { label: "Renk", value: "8 seçenek" },
    ],
    featured: true,
  },
  {
    sku: "7013",
    name: "Masa altı çiftli çanta askısı",
    shortName: "Çanta askısı",
    category: "ofis",
    price: 2990,
    image: "/products/7013.webp",
    tagline: "İki çanta, masanın altında.",
    description:
      "Masa tablasının altına sabitlenen çift yönlü askı. Çanta ve kulaklıkları çalışma yüzeyinden uzak, kolay erişilen bir noktada tutar.",
    features: ["Çift yönlü kanca", "Masa altı montaj", "Yuvarlatılmış uçlar", "Kompakt gövde"],
    specs: [
      { label: "Dış ölçü", value: "160 × 55 × 50 mm" },
      { label: "Ağırlık", value: "180 g" },
      { label: "Taşıma", value: "Toplam 8 kg" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7013B",
    name: "Masa kenarı tekli çanta askısı",
    shortName: "Tekli askı",
    category: "ofis",
    price: 2290,
    image: "/products/7013B.webp",
    tagline: "Tek çanta, masa kenarında hazır.",
    description:
      "Masa tablasının kenarına oturan tekli askı. Çanta, kulaklık veya kablo çantasını zeminden ve çalışma yüzeyinden uzak tutar.",
    features: ["Tek geniş kanca", "Masa kenarı bağlantısı", "Yumuşak temas yüzeyi", "Kompakt form"],
    specs: [
      { label: "Dış ölçü", value: "80 × 55 × 120 mm" },
      { label: "Ağırlık", value: "140 g" },
      { label: "Taşıma", value: "6 kg" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7015",
    name: "Anahtarlık panosu",
    shortName: "Anahtar",
    category: "giris",
    price: 3290,
    image: "/products/7015.webp",
    tagline: "Altı kanca, altta tepsi.",
    description:
      "Duvar veya tezgâh panosu. Altı pirinç kanca, üstte isim plakası, altta ince tepsi.",
    features: ["6 pirinç kanca", "İsim plakası", "Alt tepsi", "Duvar veya masa"],
    specs: [
      { label: "Dış ölçü", value: "280 × 240 × 40 mm" },
      { label: "Ağırlık", value: "380 g" },
      { label: "Kanca", value: "6 adet" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7016",
    name: "Çöp kutusu",
    shortName: "Çöp kutusu",
    category: "ofis",
    series: "yonetici",
    price: 4590,
    image: "/products/7016.webp",
    tagline: "Eğik kapak, ön kapak, poşet içinde.",
    description: "Kapaklı atık kutusu. Eğik üst kapak, önde servis kapağı, iç poşet yuvası.",
    features: ["Eğik üst kapak", "Ön servis kapağı", "İç poşet yuvası", "Kaymaz taban"],
    specs: [
      { label: "Dış ölçü", value: "220 × 380 × 220 mm" },
      { label: "Ağırlık", value: "980 g" },
      { label: "Hacim", value: "12 L" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7016B",
    name: "Kapaklı saklama küpü",
    shortName: "Saklama küpü",
    category: "yasam",
    price: 6990,
    image: "/products/7016B.webp",
    tagline: "Battaniye ve oyuncaklar kapak altında.",
    description:
      "Yaşam alanı için geniş, kapaklı saklama küpü. Tek hacimli iç bölüm battaniye, oyuncak ve mevsimlik eşyaları görünmeden toplar.",
    features: [
      "Menteşeli geniş kapak",
      "Tek hacimli iç bölüm",
      "Ön etiket alanı",
      "Kaymaz ayaklar",
    ],
    specs: [
      { label: "Dış ölçü", value: "420 × 420 × 420 mm" },
      { label: "Ağırlık", value: "4500 g" },
      { label: "Hacim", value: "55 L" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7017",
    name: "Masaüstü istasyonu",
    shortName: "Masaüstü",
    category: "ofis",
    series: "kompakt",
    price: 3690,
    image: "/products/7017.webp",
    tagline: "Kalem, kart, kâğıt, telefon.",
    description:
      "Çalışma masası için yatay istasyon. Kalem kadehi, iki kart yuvası, kâğıt tepsisi, eğimli telefon yatağı.",
    features: ["Kalem kadehi", "İki kart yuvası", "Kâğıt tepsisi", "Telefon yatağı"],
    specs: [
      { label: "Dış ölçü", value: "320 × 120 × 80 mm" },
      { label: "Ağırlık", value: "290 g" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7018",
    name: "Valet kutusu",
    shortName: "Valet",
    category: "gardrop",
    price: 4490,
    image: "/products/7018.webp",
    tagline: "Saat, yüzük, anahtar, nakit.",
    description:
      "Kapak içi cepli valet kutusu. Saat yastığı, yüzük yuvaları, anahtar ve nakit bölmesi, pasaport tepsisi.",
    features: [
      "Saat yastığı ve yüzük rulosu",
      "Anahtar, nakit ve pasaport bölmeleri",
      "Kapak içi cep",
      "Süet astar",
    ],
    specs: [
      { label: "Dış ölçü", value: "320 × 180 × 80 mm" },
      { label: "Ağırlık", value: "420 g" },
      { label: "Malzeme", value: "Deri, süet astar" },
      { label: "Renk", value: "8 seçenek" },
    ],
    featured: true,
  },
  {
    sku: "7020",
    name: "Dizüstü tepsi",
    shortName: "Dizüstü",
    category: "yasam",
    price: 5490,
    image: "/products/7020.webp",
    tagline: "Kucakta laptop, yanda şarj cebi.",
    description:
      "Diz üstü çalışma tepsisi. Düz deri yüzey, kalem kanalı, yan cepte adaptör yuvası.",
    features: ["Düz çalışma yüzeyi", "Kalem kanalı", "Adaptör cebi", "Kavisli bacaklar"],
    specs: [
      { label: "Dış ölçü", value: "560 × 320 × 80 mm" },
      { label: "Ağırlık", value: "740 g" },
      { label: "Uyum", value: "13–16 inç" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7023",
    name: "Çocuk kitaplığı",
    shortName: "Kitaplık",
    category: "yasam",
    price: 6890,
    image: "/products/7023.webp",
    tagline: "Kapaklar önde, üç raf.",
    description:
      "Duvara asılan üç raflı resimli kitap standı. Kapaklar görünür kalır. Yumuşak köşe, sığ profil.",
    features: ["Üç kademeli ön kapak rafı", "Duvara asılır", "Yumuşak köşe", "Oyuncak nişi"],
    specs: [
      { label: "Dış ölçü", value: "920 × 520 × 140 mm" },
      { label: "Ağırlık", value: "3800 g" },
      { label: "Kapasite", value: "12–16 kitap" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7025",
    name: "Model araba rafı",
    shortName: "Raf",
    category: "yasam",
    price: 5990,
    image: "/products/7025.webp",
    tagline: "Dokuz göz, üç kademe.",
    description:
      "1:64 ölçek model arabalar için üç katlı, dokuz gözlü masaüstü vitrin. Eğimli cephe, deri taban.",
    features: ["9 göz, 3 kademe", "Eğimli sergi cephesi", "Deri kaplı taban", "Masaüstü veya raf"],
    specs: [
      { label: "Dış ölçü", value: "380 × 280 × 180 mm" },
      { label: "Ağırlık", value: "620 g" },
      { label: "Ölçek", value: "1:64" },
      { label: "Renk", value: "8 seçenek" },
    ],
    featured: true,
  },
  {
    sku: "7027",
    name: "Katlanır oturak",
    shortName: "Katlanır",
    category: "giris",
    price: 7490,
    image: "/products/7027.webp",
    tagline: "Açılır, oturulur, kapanır.",
    description: "Duvara menteşeli katlanır oturak. Açıkken oturma yüzeyi, kapalıyken ince panel.",
    features: ["Duvara menteşeli", "Kapalıyken 80 mm", "Yastıklı oturma", "Gizli bağlantı"],
    specs: [
      { label: "Dış ölçü", value: "Açık 620 × 480 × 360 mm" },
      { label: "Ağırlık", value: "2900 g" },
      { label: "Yük", value: "120 kg" },
      { label: "Renk", value: "8 seçenek" },
    ],
    featured: true,
  },
  {
    sku: "7028",
    name: "Makyaj organizeri",
    shortName: "Makyaj",
    category: "makyaj",
    price: 10990,
    image: "/products/7028.webp",
    tagline: "Ayna, ruj ızgarası, iki çekmece.",
    description:
      "Masaüstü makyaj istasyonu. Kaldırılır ayna, ruj ızgarası, fırça kadehleri, iki alt çekmece.",
    features: ["Kaldırılır ayna", "Ruj ızgarası", "Fırça kadehleri", "İki çekmece"],
    specs: [
      { label: "Dış ölçü", value: "360 × 280 × 220 mm" },
      { label: "Ağırlık", value: "540 g" },
      { label: "Kapasite", value: "40+ ürün" },
      { label: "Renk", value: "8 seçenek" },
    ],
    featured: true,
  },
  {
    sku: "7029",
    name: "Baharat istasyonu",
    shortName: "Baharat",
    category: "mutfak",
    price: 7890,
    image: "/products/7029.webp",
    tagline: "Kavanoz, kaşık, peçete, yağlık.",
    description:
      "Tezgâh baharat ünitesi. İki kavanoz rafı, kaşık kadehi, peçete mili, yağlık yuvası, alt çekmece.",
    features: ["İki kavanoz rafı", "Kaşık kadehi", "Peçete mili", "Yağlık ve çekmece"],
    specs: [
      { label: "Dış ölçü", value: "420 × 280 × 260 mm" },
      { label: "Ağırlık", value: "860 g" },
      { label: "Kapasite", value: "10 kavanoz" },
      { label: "Renk", value: "8 seçenek" },
    ],
    featured: true,
  },
  {
    sku: "7030",
    name: "Banyo lavabo istasyonu",
    shortName: "Banyo lavabo",
    category: "banyo",
    price: 6190,
    image: "/products/7030.webp",
    tagline: "Pompa, fırça, havlu, çekmece.",
    description:
      "Lavabo üstü bakım durağı. Pompa rafı, iki fırça kadehi, orta tepsi, havlu rafı, alt çekmece.",
    features: ["Pompa rafı", "İki fırça kadehi", "Havlu rafı", "Alt çekmece"],
    specs: [
      { label: "Dış ölçü", value: "360 × 200 × 180 mm" },
      { label: "Ağırlık", value: "710 g" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7031",
    name: "Şarap standı",
    shortName: "Şarap",
    category: "yasam",
    price: 9890,
    image: "/products/7031.webp",
    tagline: "Üç şişe, dört kadeh, bir karaf.",
    description: "Asılı kadeh rayı, karaf platformu, üç şişelik eğimli yatak ve alt çekmece.",
    features: ["4 kadeh asma rayı", "3 şişelik eğimli yuva", "Karaf sehpası", "Açacak çekmecesi"],
    specs: [
      { label: "Dış ölçü", value: "420 × 380 × 280 mm" },
      { label: "Ağırlık", value: "920 g" },
      { label: "Kapasite", value: "3 şişe + 4 kadeh" },
      { label: "Renk", value: "8 seçenek" },
    ],
    featured: true,
  },
  {
    sku: "7032",
    name: "Şemsiyelik",
    shortName: "Şemsiye",
    category: "giris",
    price: 5490,
    image: "/products/7032.webp",
    tagline: "Uzun tüp, yan cep, damlama tepsisi.",
    description:
      "Çift tüp: uzun şemsiye ve baston. Yan cepte katlanır şemsiye, altta damlama çekmecesi.",
    features: [
      "Uzun şemsiye tüpü",
      "Katlanır şemsiye cebi",
      "Damlama tepsisi",
      "Havalandırma dilimleri",
    ],
    specs: [
      { label: "Dış ölçü", value: "280 × 520 × 180 mm" },
      { label: "Ağırlık", value: "1100 g" },
      { label: "Kapasite", value: "2 uzun + 1 kompakt" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7033",
    name: "Şarj istasyonu",
    shortName: "Şarj",
    category: "ofis",
    series: "aksesuar",
    price: 6990,
    image: "/products/7033.webp",
    tagline: "Tablet, kablo, adaptör, çekmece.",
    description:
      "Masaüstü cihaz durağı. Üç kademeli tablet yuvası, kablo kadehleri, adaptör tepsisi, alt çekmece.",
    features: ["Üç kademeli cihaz yuvası", "Kablo kadehleri", "Adaptör tepsisi", "Alt çekmece"],
    specs: [
      { label: "Dış ölçü", value: "320 × 220 × 180 mm" },
      { label: "Ağırlık", value: "640 g" },
      { label: "Uyum", value: "Telefon ve tablet" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7034",
    name: "Saat ve kemer tepsisi",
    shortName: "Saat-kemer",
    category: "gardrop",
    price: 8490,
    image: "/products/7034.webp",
    tagline: "Kemer, saat, bileklik, kol düğmesi.",
    description:
      "Gardırop çekmecesine oturan organizer. Dört kemer yuvası, dört saat yastığı, bileklik kanalları.",
    features: ["4 kemer bölmesi", "4 saat yastığı", "Bileklik kanalları", "Kol düğmesi tepsisi"],
    specs: [
      { label: "Dış ölçü", value: "800 × 400 × 80 mm" },
      { label: "Ağırlık", value: "780 g" },
      { label: "Uyum", value: "Standart çekmece" },
      { label: "Renk", value: "8 seçenek" },
    ],
    featured: true,
  },
  {
    sku: "7035",
    name: "Makyaj rafı",
    shortName: "Makyaj rafı",
    category: "makyaj",
    price: 12490,
    image: "/products/7035.webp",
    tagline: "Ayna, raf, on ruj yuvası.",
    description:
      "Ortada kemer ayna, iki yanda kavisli raflar, altta on ruj yuvası ve fırça kadehleri.",
    features: ["Merkezi ayna", "Kademeli krem rafları", "10 ruj yuvası", "İki fırça kadehi"],
    specs: [
      { label: "Dış ölçü", value: "580 × 420 × 180 mm" },
      { label: "Ağırlık", value: "960 g" },
      { label: "Kapasite", value: "30+ ürün" },
      { label: "Renk", value: "8 seçenek" },
    ],
    featured: true,
  },
  {
    sku: "7036",
    name: "Ruj kulesi",
    shortName: "Ruj kulesi",
    category: "makyaj",
    price: 8990,
    image: "/products/7036.webp",
    tagline: "360 derece, ruj ızgarası.",
    description:
      "Dönen silindirik makyaj kulesi. Izgaralı ruj cepheleri, fırça nişi, palet rafı, tepede ayna.",
    features: [
      "360° döner taban",
      "Izgara ruj yuvaları",
      "Fırça ve palet nişi",
      "Çıkarılabilir ayna",
    ],
    specs: [
      { label: "Dış ölçü", value: "Ø 240 × 320 mm" },
      { label: "Ağırlık", value: "480 g" },
      { label: "Kapasite", value: "40+ ruj" },
      { label: "Renk", value: "8 seçenek" },
    ],
    featured: true,
  },
  {
    sku: "7037",
    name: "Makyaj kutusu",
    shortName: "Kutu",
    category: "makyaj",
    price: 11890,
    image: "/products/7037.webp",
    tagline: "Kapak ayna, iki çekmece.",
    description:
      "İki çekmeceli, menteşeli ayna kapaklı makyaj sandığı. Üst tepside ruj, pudra ve fırça bölmeleri.",
    features: ["Tam boy ayna kapak", "Bölmeli üst tepsi", "İki çekmece", "Süet astar"],
    specs: [
      { label: "Dış ölçü", value: "420 × 180 × 160 mm" },
      { label: "Ağırlık", value: "520 g" },
      { label: "Çekmece", value: "2 adet" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7038",
    name: "Duvar makyaj aynası",
    shortName: "Duvar ayna",
    category: "makyaj",
    price: 9490,
    image: "/products/7038.webp",
    tagline: "Kapak açılır, ayna çıkar.",
    description:
      "Aşağı katlanan kapaklı duvar makyaj istasyonu. Kapak açılınca ayna, ruj sırası, fırça kadehi.",
    features: ["Gaz pistonlu kapak", "Merkezi ayna", "Yan tüp cepleri", "Kapak içi ruj yuvası"],
    specs: [
      { label: "Dış ölçü", value: "Kapalı 420 × 480 × 100 mm" },
      { label: "Ağırlık", value: "1400 g" },
      { label: "Montaj", value: "Duvar askısı" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7040",
    name: "Kesme tahtası standı",
    shortName: "Tahta standı",
    category: "mutfak",
    price: 5590,
    image: "/products/7040.webp",
    tagline: "Tahta, tepsi, merdane, havlu.",
    description:
      "Dikey kesme tahtası ve tepsi standı. Üç kanal, merdane kadehi, önde havlu çubuğu.",
    features: ["Üç dikey kanal", "Merdane kadehi", "Havlu çubuğu", "Kaymaz taban"],
    specs: [
      { label: "Dış ölçü", value: "360 × 280 × 220 mm" },
      { label: "Ağırlık", value: "720 g" },
      { label: "Kapasite", value: "4–6 tahta" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7041",
    name: "Evye organizeri",
    shortName: "Evye",
    category: "mutfak",
    price: 4890,
    image: "/products/7041.webp",
    tagline: "Sabun, sünger, fırça, havlu.",
    description:
      "İki pompa yuvası, fırça kadehi, sünger rafı, havlu çubuğu ve önde damlama tepsisi.",
    features: [
      "İki sabun pompası yuvası",
      "Fırça ve sünger bölmesi",
      "Havlu çubuğu",
      "Çıkarılabilir damlama tepsisi",
    ],
    specs: [
      { label: "Dış ölçü", value: "280 × 160 × 180 mm" },
      { label: "Ağırlık", value: "380 g" },
      { label: "Bakım", value: "Tepsi çıkarılır" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7042",
    name: "Baharatlık",
    shortName: "Baharatlık",
    category: "mutfak",
    price: 5790,
    image: "/products/7042.webp",
    tagline: "Döner taban, iki raf, poşet cebi.",
    description:
      "Kare döner baharat kulesi. İki rafta kavanozlar, yanda poşet cebi, tepede ölçü kapları.",
    features: ["360° döner taban", "İki kavanoz rafı", "Poşet baharat cebi", "Tepede 4 ölçü kabı"],
    specs: [
      { label: "Dış ölçü", value: "240 × 240 × 320 mm" },
      { label: "Ağırlık", value: "540 g" },
      { label: "Kapasite", value: "6 kavanoz" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7043",
    name: "Ekmek kutusu",
    shortName: "Ekmek",
    category: "mutfak",
    price: 7890,
    image: "/products/7043.webp",
    tagline: "Ekmek, meyve, üç kavanoz.",
    description:
      "Havalandırmalı rulo kapaklı ekmek bölmesi, kırıntı tepsisi, iki meyve yuvası ve üç kavanoz yuvası.",
    features: ["Rulo kapak", "Kırıntı tepsisi", "Meyve yuvaları", "Üç kavanoz bölmesi"],
    specs: [
      { label: "Dış ölçü", value: "520 × 280 × 240 mm" },
      { label: "Ağırlık", value: "1100 g" },
      { label: "Kapasite", value: "1 somun + 3 kavanoz" },
      { label: "Renk", value: "8 seçenek" },
    ],
    featured: true,
  },
  {
    sku: "7044",
    name: "Mutfak folyo kutusu",
    shortName: "Mutfak folyo",
    category: "mutfak",
    price: 4290,
    image: "/products/7044.webp",
    tagline: "Dört rulo, mandal tepsisi.",
    description:
      "Çekmece içi rulo organizer. Folyo, pişirme kâğıdı, streç ve peçete için dört kanal.",
    features: ["4 rulo kanalı", "Deri stoperler", "Mandal bölmesi", "Yedek rulo tepsisi"],
    specs: [
      { label: "Dış ölçü", value: "420 × 320 × 80 mm" },
      { label: "Ağırlık", value: "320 g" },
      { label: "Uyum", value: "Standart çekmece" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7045",
    name: "Saç aleti standı",
    shortName: "Saç",
    category: "banyo",
    price: 5490,
    image: "/products/7045.webp",
    tagline: "Fön, maşa, tarak, kablo.",
    description:
      "Eğimli fön yuvası, üç silindir ve önde pens tepsisi. Isıya dayanıklı iç kılıf, kablo kanalları.",
    features: [
      "Eğimli fön yuvası",
      "Üç ısı kalkanlı silindir",
      "Pens tepsisi",
      "Kablo yönlendirme",
    ],
    specs: [
      { label: "Dış ölçü", value: "320 × 220 × 180 mm" },
      { label: "Ağırlık", value: "460 g" },
      { label: "Uyarı", value: "Alet soğuduktan sonra" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7046",
    name: "Çekmece düzenleyici",
    shortName: "Çekmece",
    category: "banyo",
    price: 3890,
    image: "/products/7046.webp",
    tagline: "Tüp, jilet, fırça — dar çekmece.",
    description:
      "Dar çekmece için uzun, bölmeli organizer. Tüp ve şişe kanalları, jilet ve diş fırçası yuvaları.",
    features: ["Dar profil", "Tüp ve şişe kanalları", "Jilet / fırça yuvaları", "Uç tepsi"],
    specs: [
      { label: "Dış ölçü", value: "380 × 100 × 60 mm" },
      { label: "Ağırlık", value: "180 g" },
      { label: "Uyum", value: "Dar çekmece" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7047",
    name: "Banyo duvar rafı",
    shortName: "Duvar banyo",
    category: "banyo",
    price: 6490,
    image: "/products/7047.webp",
    tagline: "Pompa, rulo, fırça, havlu barı.",
    description:
      "İki katlı duvar organizer. Üstte pompa şişeleri, altta havlu ruloları ve diş fırçası yuvaları.",
    features: ["İki katlı açık raf", "Diş fırçası yuvaları", "Havlu barı", "Duvar montaj plakası"],
    specs: [
      { label: "Dış ölçü", value: "380 × 420 × 140 mm" },
      { label: "Ağırlık", value: "640 g" },
      { label: "Montaj", value: "Askı seti" },
      { label: "Renk", value: "8 seçenek" },
    ],
    featured: true,
  },
  {
    sku: "7048",
    name: "Banyo organizeri",
    shortName: "Banyo",
    category: "banyo",
    price: 7290,
    image: "/products/7048.webp",
    tagline: "İki raf, orta kadeh, döner taban.",
    description:
      "Silindirik, açık cepheli döner organizer. Üst ve alt raflarda şişeler, ortada tarak ve jilet kadehi.",
    features: ["360° döner taban", "Açık cephe, iki kat", "Orta kadeh", "Kaymaz taban"],
    specs: [
      { label: "Dış ölçü", value: "Ø 260 × 280 mm" },
      { label: "Ağırlık", value: "520 g" },
      { label: "Kapasite", value: "10–14 şişe" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7049",
    name: "Tuvalet kâğıtlığı",
    shortName: "Kâğıtlık",
    category: "banyo",
    price: 5990,
    image: "/products/7049.webp",
    tagline: "Aktif rulo, yedek istif, mendil cebi.",
    description:
      "Dikey kule: yanda aktif rulo, içeride yedek istif, önde ıslak mendil cebi, tepede kutu mendil.",
    features: ["Aktif rulo mili", "İç yedek kulesi", "Islak mendil cebi", "Tepede kutu mendil"],
    specs: [
      { label: "Dış ölçü", value: "220 × 480 × 180 mm" },
      { label: "Ağırlık", value: "480 g" },
      { label: "Kapasite", value: "1 + 4 rulo" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7014",
    name: "Mektupluk",
    shortName: "Mektupluk",
    category: "giris",
    price: 3490,
    image: "/products/7014.webp",
    tagline: "Evrak cebi, kalemlik, anahtar askısı.",
    description:
      "Duvara asılan giriş panosu. Üstte evrak cebi, yanda kalemlik, altta üç anahtar kancası.",
    features: ["Duvara asılır", "Evrak cebi", "Kalem yuvası", "Üç anahtar kancası"],
    specs: [
      { label: "Dış ölçü", value: "280 × 360 × 80 mm" },
      { label: "Ağırlık", value: "280 g" },
      { label: "Montaj", value: "Askı seti" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7024",
    name: "Ütü masası dolabı",
    shortName: "Ütü dolabı",
    category: "yasam",
    price: 9890,
    image: "/products/7024.webp",
    tagline: "Ütü tahtası içeride, kumaş üstte.",
    description:
      "Kapaklı dikey dolap. İçeride katlanır ütü tahtası, üstte kumaş rulosu ve askı çubuğu.",
    features: ["İç ütü tahtası", "Üst kumaş rulosu", "Askı çubuğu", "Kapaklı gövde"],
    specs: [
      { label: "Dış ölçü", value: "420 × 1600 × 280 mm" },
      { label: "Ağırlık", value: "8500 g" },
      { label: "Tahta", value: "Katlanır" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7026",
    name: "Robot süpürge altlığı",
    shortName: "Süpürge",
    category: "yasam",
    price: 4590,
    image: "/products/7026.webp",
    tagline: "Süpürge üstte, fırça çekmecesi altta.",
    description:
      "Yuvarlak durak. Robot süpürge üstte şarj olur, alt çekmecede yedek fırça ve bez durur.",
    features: ["Üst durak tepsisi", "Alt çekmece", "Fırça ve bez bölmesi", "Kaymaz taban"],
    specs: [
      { label: "Dış ölçü", value: "Ø 380 × 120 mm" },
      { label: "Ağırlık", value: "720 g" },
      { label: "Uyum", value: "Yuvarlak robot" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7050",
    name: "Çekmece içi kemer organizeri",
    shortName: "Kemer",
    category: "gardrop",
    price: 3990,
    image: "/products/7050.webp",
    tagline: "Kemerler ayrı gözlerde, tokalar görünür.",
    description:
      "Gardırop çekmecesi için bölmeli kemer tepsisi. Sarılı kemerleri birbirine değmeden, tokaları görünür biçimde sıralar.",
    features: [
      "Sekiz ayrı göz",
      "Alçak çekmece profili",
      "Yumuşak iç yüzey",
      "Çıkarılabilir tepsi",
    ],
    specs: [
      { label: "Dış ölçü", value: "380 × 260 × 60 mm" },
      { label: "Ağırlık", value: "320 g" },
      { label: "Kapasite", value: "8 kemer" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7051",
    name: "Giriş panosu",
    shortName: "Pano",
    category: "giris",
    price: 4290,
    image: "/products/7051.webp",
    tagline: "Anahtar, evrak, kalem — duvarda.",
    description:
      "Duvar panosu. Üstte açık raf, ortada evrak cepleri, altta kanca sırası ve kalem yuvası.",
    features: ["Üst açık raf", "Evrak cepleri", "Kanca sırası", "Kalem yuvası"],
    specs: [
      { label: "Dış ölçü", value: "480 × 620 × 90 mm" },
      { label: "Ağırlık", value: "680 g" },
      { label: "Montaj", value: "Askı seti" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7052",
    name: "Giriş dolabı",
    shortName: "Dolap",
    category: "giris",
    price: 14990,
    image: "/products/7052.webp",
    tagline: "Askı, oturak, ayakkabı, çekmece.",
    description:
      "Giriş holü dolabı. Üstte askı çubuğu, ortada oturma, altta ayakkabı rafları ve yan çekmece.",
    features: ["Askı çubuğu", "Yastıklı oturma", "Ayakkabı rafları", "Yan çekmece"],
    specs: [
      { label: "Dış ölçü", value: "900 × 1800 × 380 mm" },
      { label: "Ağırlık", value: "9800 g" },
      { label: "Yük", value: "110 kg" },
      { label: "Renk", value: "8 seçenek" },
    ],
    featured: true,
  },
  {
    sku: "7053",
    name: "Duvar tipi antre istasyonu",
    shortName: "Antre",
    category: "giris",
    price: 6290,
    image: "/products/7053.webp",
    tagline: "Posta, anahtar ve günlük eşya duvarda.",
    description:
      "Antre için duvara asılan düzen istasyonu. Üst raf, posta cebi, günlük eşya tepsisi ve anahtar kancalarını tek gövdede toplar.",
    features: ["Üst açık raf", "Posta cebi", "Alt eşya tepsisi", "Anahtar kancaları"],
    specs: [
      { label: "Dış ölçü", value: "420 × 360 × 100 mm" },
      { label: "Ağırlık", value: "820 g" },
      { label: "Montaj", value: "Duvar askı seti" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7054",
    name: "Kahve istasyonu",
    shortName: "Kahve",
    category: "mutfak",
    price: 8690,
    image: "/products/7054.webp",
    tagline: "Makine, fincan, çekirdek, tepsi.",
    description:
      "Tezgâh kahve ünitesi. Üstte makine durak, asılı fincanlar, çekirdek kavanozları ve damlama tepsisi.",
    features: ["Makine durak", "Fincan askısı", "Kavanoz yuvaları", "Damlama tepsisi"],
    specs: [
      { label: "Dış ölçü", value: "520 × 380 × 420 mm" },
      { label: "Ağırlık", value: "1600 g" },
      { label: "Kapasite", value: "6 fincan" },
      { label: "Renk", value: "8 seçenek" },
    ],
    featured: true,
  },
  {
    sku: "7055",
    name: "Kahve karuseli",
    shortName: "Karusel",
    category: "mutfak",
    price: 4290,
    image: "/products/7055.webp",
    tagline: "Döner gövde, kapsül ve fincan.",
    description:
      "Döner kahve karuseli. Kapsül yuvaları, fincan kadehi, üstte küçük kavanoz tepsisi.",
    features: ["360° döner taban", "Kapsül yuvaları", "Fincan kadehi", "Üst tepsi"],
    specs: [
      { label: "Dış ölçü", value: "Ø 240 × 280 mm" },
      { label: "Ağırlık", value: "540 g" },
      { label: "Kapasite", value: "24 kapsül" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7056",
    name: "Duvar tipi kahve dolabı",
    shortName: "Kahve dolabı",
    category: "mutfak",
    price: 11990,
    image: "/products/7056.webp",
    tagline: "Fincan, kapsül ve ekipman tek dolapta.",
    description:
      "Kahve köşesi için duvara asılan kapaklı dolap. Fincan rafları, kapsül bölmeleri ve hazırlık ekipmanlarını tezgâhtan kaldırır.",
    features: ["Kapaklı duvar gövdesi", "Fincan rafları", "Kapsül bölmeleri", "Alt servis rafı"],
    specs: [
      { label: "Dış ölçü", value: "600 × 700 × 220 mm" },
      { label: "Ağırlık", value: "5200 g" },
      { label: "Montaj", value: "Duvar rayı" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7057",
    name: "Çamaşır ayırmalı ütü istasyonu",
    shortName: "Ütü-ayırma",
    category: "yasam",
    price: 13990,
    image: "/products/7057.webp",
    tagline: "Ayır, katla ve ütüle — tek istasyonda.",
    description:
      "Çamaşır bakımı için ayırma hazneli dikey istasyon. Ütü yüzeyi, sepet bölmeleri ve bakım malzemesi rafı aynı gövdede çalışır.",
    features: [
      "Katlanır ütü yüzeyi",
      "Üç ayırma haznesi",
      "Bakım malzemesi rafı",
      "Dikey yerleşim",
    ],
    specs: [
      { label: "Dış ölçü", value: "720 × 1100 × 420 mm" },
      { label: "Ağırlık", value: "9200 g" },
      { label: "Hazne", value: "3 bölme" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7058",
    name: "Katlanır duvar ütü istasyonu",
    shortName: "Duvar ütü",
    category: "yasam",
    price: 10990,
    image: "/products/7058.webp",
    tagline: "Ütü yüzeyi açılır, kapandığında yer kazandırır.",
    description:
      "Dar alanlar için duvara asılan ütü ünitesi. Kapak açıldığında çalışma yüzeyine dönüşür; raflarda ütü ve bakım ürünleri durur.",
    features: ["Katlanır çalışma yüzeyi", "İç malzeme rafları", "Kapaklı gövde", "Duvar montajı"],
    specs: [
      { label: "Kapalı ölçü", value: "480 × 820 × 180 mm" },
      { label: "Ağırlık", value: "6400 g" },
      { label: "Montaj", value: "Duvar rayı" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7059",
    name: "Çocuk kitap rafı",
    shortName: "Kitap rafı",
    category: "yasam",
    price: 7490,
    image: "/products/7059.webp",
    tagline: "Kapaklar öne bakar, kitaplar erişimde kalır.",
    description:
      "Çocuk odası için öne bakan kademeli kitap rafı. Alçak gövde, kitap seçimini kolaylaştırır ve büyük-küçük boyları birlikte toplar.",
    features: [
      "Öne bakan raflar",
      "Çocuk erişimine uygun yükseklik",
      "Yuvarlatılmış köşeler",
      "Devrilme önleyici bağlantı",
    ],
    specs: [
      { label: "Dış ölçü", value: "720 × 760 × 300 mm" },
      { label: "Ağırlık", value: "4800 g" },
      { label: "Raf", value: "4 kademe" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7060",
    name: "Figür rafı",
    shortName: "Figür rafı",
    category: "yasam",
    price: 8990,
    image: "/products/7060.webp",
    tagline: "Beş kat, duvara asılır.",
    description:
      "Duvar figür rafı. Beş açık raf, yan yan menteşe plakası. Minyatür, araba ve küçük obje için.",
    features: ["Beş açık raf", "Duvar montaj plakası", "Alçak ön dudak", "Sıralı dizilim"],
    specs: [
      { label: "Dış ölçü", value: "900 × 420 × 80 mm" },
      { label: "Ağırlık", value: "820 g" },
      { label: "Raf", value: "5 kat" },
      { label: "Renk", value: "8 seçenek" },
    ],
    featured: true,
  },
  {
    sku: "7061",
    name: "Büyük figür vitrini",
    shortName: "Figür vitrini",
    category: "yasam",
    price: 12990,
    image: "/products/7061.webp",
    tagline: "Geniş koleksiyon, kat kat görünür.",
    description:
      "Figür ve model koleksiyonları için geniş vitrin gövdesi. Kademeli raflar farklı boydaki parçaları aynı görüş hattında sergiler.",
    features: [
      "Kademeli sergileme rafları",
      "Geniş ön görünüm",
      "Alçak raf dudakları",
      "Duvar sabitleme bağlantısı",
    ],
    specs: [
      { label: "Dış ölçü", value: "1200 × 900 × 180 mm" },
      { label: "Ağırlık", value: "7800 g" },
      { label: "Raf", value: "6 kademe" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7062",
    name: "Başucu şarj istasyonu",
    shortName: "Başucu şarj",
    category: "gardrop",
    price: 4290,
    image: "/products/7062.webp",
    tagline: "Gözlük, telefon, kulaklık, kalem.",
    description:
      "Yatak başı valet. Gözlük tepsisi, dik telefon yuvası, kulaklık yatağı, kalem gözü; arkada kablo çıkışı.",
    features: ["Gözlük tepsisi", "Dik telefon yuvası", "Kulaklık yatağı", "Kablo çıkışı"],
    specs: [
      { label: "Dış ölçü", value: "280 × 160 × 90 mm" },
      { label: "Ağırlık", value: "360 g" },
      { label: "Kablo", value: "Arka kanal" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7062B",
    name: "Kitap desteği seti",
    shortName: "Kitap desteği",
    category: "ofis",
    price: 2790,
    image: "/products/7062B.webp",
    tagline: "Kitaplar rafta dik ve hizalı.",
    description:
      "Kitap ve dosyaları iki yandan destekleyen masaüstü seti. Geniş tabanlar ağır kitaplarda denge sağlar, eğimli yüzeyler sırayı sıkı tutar.",
    features: ["İkili destek seti", "Eğimli yan yüzey", "Geniş dengeli taban", "Kaymaz alt yüzey"],
    specs: [
      { label: "Tek parça", value: "140 × 100 × 170 mm" },
      { label: "Ağırlık", value: "2 × 320 g" },
      { label: "Paket", value: "2 adet" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7063",
    name: "Duvar hol panosu",
    shortName: "Hol panosu",
    category: "giris",
    price: 3890,
    image: "/products/7063.webp",
    tagline: "Cüzdan, posta, üç kanca.",
    description:
      "Kapı içi duvar panosu. Üst cep cüzdan, yan cep posta, alt rafta kulaklık; üç kanca anahtar için.",
    features: ["Cüzdan cebi", "Posta cebi", "Üç anahtar kancası", "Duvar montaj"],
    specs: [
      { label: "Dış ölçü", value: "320 × 220 × 70 mm" },
      { label: "Ağırlık", value: "420 g" },
      { label: "Montaj", value: "Askı seti" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7063B",
    name: "Masaüstü dergi dosyalığı",
    shortName: "Dergi dosyalığı",
    category: "ofis",
    price: 3990,
    image: "/products/7063B.webp",
    tagline: "Dergi, katalog ve dosyalar yan yana.",
    description:
      "Dergi ve katalogları masa üzerinde dik tutan bölmeli dosyalık. Alçak ön yüz kapakları görünür bırakır, iç bölücüler grupları ayırır.",
    features: ["Üç geniş bölme", "Alçak ön erişim", "Dik dosya desteği", "Etiket alanı"],
    specs: [
      { label: "Dış ölçü", value: "360 × 180 × 190 mm" },
      { label: "Ağırlık", value: "640 g" },
      { label: "Bölme", value: "3 adet" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7064",
    name: "Makyaj ve fırça organizeri",
    shortName: "Makyaj-fırça",
    category: "makyaj",
    price: 4490,
    image: "/products/7064.webp",
    tagline: "Fırça, palet ve şişeler ayrı bölmelerde.",
    description:
      "Makyaj masası için çok bölmeli organizer. Uzun fırçalar dik, paletler sıralı, günlük şişeler ise öndeki kolay erişim gözlerinde durur.",
    features: ["Dik fırça bölmeleri", "Palet sıraları", "Şişe gözleri", "Ön hızlı erişim tepsisi"],
    specs: [
      { label: "Dış ölçü", value: "300 × 210 × 150 mm" },
      { label: "Ağırlık", value: "420 g" },
      { label: "Bölme", value: "12 göz" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7064B",
    name: "Kutu mendil kılıfı",
    shortName: "Kutu mendil",
    category: "yasam",
    price: 2990,
    image: "/products/7064B.webp",
    tagline: "Kutu mendil sade bir yüzeye dönüşür.",
    description:
      "Standart kutu mendili dışarıdan saran yatay kılıf. Geniş üst açıklık mendili rahat verir, alt erişim kutunun hızlı değiştirilmesini sağlar.",
    features: ["Geniş üst açıklık", "Alt kutu erişimi", "Yatay kompakt form", "Silinebilir yüzey"],
    specs: [
      { label: "Dış ölçü", value: "260 × 140 × 100 mm" },
      { label: "Ağırlık", value: "280 g" },
      { label: "Uyum", value: "Standart kutu mendil" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7065",
    name: "Lavabo tepsisi",
    shortName: "Lavabo tepsisi",
    category: "banyo",
    price: 4490,
    image: "/products/7065.webp",
    tagline: "Pompa, fırça, havlu, pamuk.",
    description:
      "Lavabo kenarı organizer. İki pompa yuvası, fırça kadehi, pamuk kavanozu ve katlı havlu yeri.",
    features: ["İki pompa yuvası", "Fırça kadehi", "Pamuk kavanozu yeri", "Havlu bölmesi"],
    specs: [
      { label: "Dış ölçü", value: "320 × 220 × 90 mm" },
      { label: "Ağırlık", value: "280 g" },
      { label: "Bakım", value: "Nemli bez" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7065B",
    name: "Bardak altlığı servisi",
    shortName: "Altlık servisi",
    category: "yasam",
    price: 3490,
    image: "/products/7065B.webp",
    tagline: "Altlıklar sıralı, bardak yeri ayrı.",
    description:
      "Bardak altlıklarını dik sıralayan ve servis sırasında bardağa ayrı bir alan açan masa seti. Ev, toplantı ve karşılama masalarında düzenli bir sunum sağlar.",
    features: [
      "Dik altlık haznesi",
      "Ayrı bardak alanı",
      "Kaymaz servis tabanı",
      "Kolay silinen yüzey",
    ],
    specs: [
      { label: "Dış ölçü", value: "230 × 130 × 110 mm" },
      { label: "Ağırlık", value: "360 g" },
      { label: "Kapasite", value: "8 altlık" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7066",
    name: "Yağ ve baharatlık",
    shortName: "Yağ-baharat",
    category: "mutfak",
    price: 5290,
    image: "/products/7066.webp",
    tagline: "İki şişe, altı kavanoz.",
    description:
      "Tezgâh baharat ve yağ ünitesi. Solda iki yağ şişesi yuvası, sağda iki katlı altı kavanoz rafı.",
    features: ["İki şişe yuvası", "İki kat kavanoz rafı", "Kaymaz taban", "Tezgâha oturur"],
    specs: [
      { label: "Dış ölçü", value: "320 × 180 × 140 mm" },
      { label: "Ağırlık", value: "480 g" },
      { label: "Kapasite", value: "2 şişe + 6 kavanoz" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7066B",
    name: "Yatay evrak sıralayıcı",
    shortName: "Evrak sıralayıcı",
    category: "ofis",
    price: 3990,
    image: "/products/7066B.webp",
    tagline: "Aktif evraklar tek hatta sıralanır.",
    description:
      "Zarf, dosya ve ince cihazları yatay bir gövdede dik tutan masaüstü sıralayıcı. Kademeli kanallar her grubun üst kenarını görünür bırakır.",
    features: [
      "Dört dik kanal",
      "Kademeli görünürlük",
      "Uzun dengeli taban",
      "Zarf ve dosya uyumu",
    ],
    specs: [
      { label: "Dış ölçü", value: "420 × 100 × 120 mm" },
      { label: "Ağırlık", value: "520 g" },
      { label: "Bölme", value: "4 kanal" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7067",
    name: "Saat ve gözlük tepsisi",
    shortName: "Saat-gözlük",
    category: "gardrop",
    price: 6490,
    image: "/products/7067.webp",
    tagline: "Üç saat, iki gözlük, takı.",
    description:
      "Çekmece veya komodin tepsisi. Üç saat yastığı, iki gözlük yatağı, zincir ve küpe gözleri.",
    features: ["Üç saat yastığı", "İki gözlük yatağı", "Takı bölmeleri", "Süet iç"],
    specs: [
      { label: "Dış ölçü", value: "380 × 260 × 40 mm" },
      { label: "Ağırlık", value: "220 g" },
      { label: "Kapasite", value: "3 saat + 2 gözlük" },
      { label: "Renk", value: "8 seçenek" },
    ],
    featured: true,
  },
  {
    sku: "7067B",
    name: "Çay poşeti organizeri",
    shortName: "Çay poşeti",
    category: "mutfak",
    price: 3290,
    image: "/products/7067B.webp",
    tagline: "Çay çeşitleri açık ve ayrı gözlerde.",
    description:
      "Çay poşetlerini türüne göre ayıran tezgâh organizeri. Alçak bölmeler etiketleri görünür tutar; kapaklı üst yüzey gerektiğinde servis tepsisi olur.",
    features: [
      "Üç ayrı çay gözü",
      "Etiketi görünür düzen",
      "Kapaklı üst yüzey",
      "Tezgâh ve çekmece uyumu",
    ],
    specs: [
      { label: "Dış ölçü", value: "280 × 170 × 75 mm" },
      { label: "Ağırlık", value: "340 g" },
      { label: "Kapasite", value: "45 poşet" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7068",
    name: "Oyun kolu tepsisi",
    shortName: "Oyun tepsisi",
    category: "yasam",
    price: 3990,
    image: "/products/7068.webp",
    tagline: "İki kol, kablo, kutu oyun.",
    description: "Sehpa üstü oyun tepsisi. İki kol yuvası, kablo gözü, arkada kutu oyun dayanağı.",
    features: ["İki kol yuvası", "Kablo gözü", "Oyun dayanağı", "Kaymaz taban"],
    specs: [
      { label: "Dış ölçü", value: "420 × 220 × 80 mm" },
      { label: "Ağırlık", value: "340 g" },
      { label: "Kapasite", value: "2 kol + 4 kutu" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7069",
    name: "Fotoğraf tepsisi",
    shortName: "Foto tepsi",
    category: "yasam",
    price: 5490,
    image: "/products/7069.webp",
    tagline: "Gövde, iki objektif, kart.",
    description:
      "Çekmece fotoğraf tepsisi. Gövde yuvası, iki objektif kapağı gözü, pil ve hafıza kartı bölmesi.",
    features: ["Gövde yuvası", "İki objektif gözü", "Pil bölmesi", "Kart yuvası"],
    specs: [
      { label: "Dış ölçü", value: "360 × 260 × 70 mm" },
      { label: "Ağırlık", value: "260 g" },
      { label: "Uyum", value: "Aynasız gövde" },
      { label: "Renk", value: "8 seçenek" },
    ],
    featured: true,
  },
  {
    sku: "7070",
    name: "Dikiş istasyonu",
    shortName: "Dikiş",
    category: "yasam",
    price: 4290,
    image: "/products/7070.webp",
    tagline: "Makas, iplik, iğnelik.",
    description:
      "Masa dikiş organizeri. Makas kadehi, altı iplik yuvası, iğnelik ve şerit metre gözü.",
    features: ["Makas kadehi", "İplik yuvaları", "İğnelik gözü", "Şerit metre bölmesi"],
    specs: [
      { label: "Dış ölçü", value: "280 × 180 × 120 mm" },
      { label: "Ağırlık", value: "380 g" },
      { label: "Kapasite", value: "6 iplik + makas" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7071",
    name: "Resim ve hobi istasyonu",
    shortName: "Hobi",
    category: "yasam",
    price: 6990,
    image: "/products/7071.webp",
    tagline: "Kâğıt, boya ve fırçalar çalışmaya hazır.",
    description:
      "Resim ve el işi malzemeleri için masaüstü istasyon. Kâğıt dayanağı, boya gözleri ve uzun araç yuvaları çalışma alanını tek yerde kurar.",
    features: [
      "Kâğıt ve blok dayanağı",
      "Boya şişesi gözleri",
      "Dik fırça yuvaları",
      "Alt malzeme tepsisi",
    ],
    specs: [
      { label: "Dış ölçü", value: "420 × 260 × 300 mm" },
      { label: "Ağırlık", value: "980 g" },
      { label: "Bölme", value: "14 göz" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7072",
    name: "Hediye paketleme istasyonu",
    shortName: "Paketleme",
    category: "yasam",
    price: 4990,
    image: "/products/7072.webp",
    tagline: "Rulo, poşet, makas, bant.",
    description:
      "Masa paketleme ünitesi. Üç rulo yuvası, poşet ve kâğıt rafı, makas kadehi, altta bant ve kurdela.",
    features: ["Üç rulo yuvası", "Poşet rafı", "Makas kadehi", "Bant ve kurdela gözü"],
    specs: [
      { label: "Dış ölçü", value: "260 × 220 × 280 mm" },
      { label: "Ağırlık", value: "440 g" },
      { label: "Rulo", value: "3 adet" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7073",
    name: "Bere ve eldiven tepsisi",
    shortName: "Bere-eldiven",
    category: "gardrop",
    price: 4690,
    image: "/products/7073.webp",
    tagline: "İki eldiven, bere, atkı.",
    description: "Çekmece kış tepsisi. İki eldiven gözü, orta bere yuvası, üstte iki atkı kanalı.",
    features: ["İki eldiven gözü", "Bere yuvası", "İki atkı kanalı", "Çekmeceye oturur"],
    specs: [
      { label: "Dış ölçü", value: "380 × 260 × 80 mm" },
      { label: "Ağırlık", value: "240 g" },
      { label: "Uyum", value: "Standart çekmece" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7074",
    name: "Saç aksesuarı organizeri",
    shortName: "Saç aksesuarı",
    category: "makyaj",
    price: 4290,
    image: "/products/7074.webp",
    tagline: "Toka, taç ve lastikler kendi yerinde.",
    description:
      "Saç aksesuarlarını görünür tutan masaüstü organizer. Taç ve bantlar üst askıda, tokalar bölmeli tepside, lastikler küçük gözlerde durur.",
    features: ["Taç ve bant askısı", "Bölmeli toka tepsisi", "Lastik gözleri", "Taşıma tutamağı"],
    specs: [
      { label: "Dış ölçü", value: "320 × 180 × 260 mm" },
      { label: "Ağırlık", value: "460 g" },
      { label: "Bölme", value: "10 göz" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7075",
    name: "Oje tepsisi",
    shortName: "Oje",
    category: "makyaj",
    price: 3890,
    image: "/products/7075.webp",
    tagline: "Sekiz oje, pamuk, törpü.",
    description:
      "Makyaj oje tepsisi. Sekiz şişe yuvası, pamuk kavanozu yeri, ön olukta törpü ve makas.",
    features: ["8 oje yuvası", "Pamuk kavanozu yeri", "Törpü oluğu", "Makas yatağı"],
    specs: [
      { label: "Dış ölçü", value: "280 × 180 × 50 mm" },
      { label: "Ağırlık", value: "160 g" },
      { label: "Kapasite", value: "8 şişe" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7076",
    name: "Sofra organizeri",
    shortName: "Sofra",
    category: "mutfak",
    price: 4790,
    image: "/products/7076.webp",
    tagline: "Peçete, çatal, bıçak, değirmen.",
    description:
      "Masa sofra caddysi. Peçete rafı, kaşık-çatal-bıçak gözleri, yanda tuz ve karabiber değirmeni.",
    features: ["Peçete rafı", "Üç çatal-bıçak gözü", "Değirmen yuvası", "Keçe astar"],
    specs: [
      { label: "Dış ölçü", value: "280 × 180 × 160 mm" },
      { label: "Ağırlık", value: "320 g" },
      { label: "Kapasite", value: "4 kişilik takım" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7077",
    name: "Atıştırmalık standı",
    shortName: "Atıştırmalık",
    category: "mutfak",
    price: 5590,
    image: "/products/7077.webp",
    tagline: "Üç kat poşet rafı.",
    description:
      "Tezgâh atıştırmalık standı. Üç kademeli açık raf; kuruyemiş ve kurabiye poşetleri dik durur.",
    features: ["Üç kademeli raf", "Açık ön", "Kaymaz taban", "Poşet dayanağı"],
    specs: [
      { label: "Dış ölçü", value: "320 × 240 × 180 mm" },
      { label: "Ağırlık", value: "480 g" },
      { label: "Kapasite", value: "12 poşet" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7078",
    name: "Giysi bakım istasyonu",
    shortName: "Giysi bakım",
    category: "gardrop",
    price: 4290,
    image: "/products/7078.webp",
    tagline: "Fırça, tüy rulo, koku topu.",
    description:
      "Gardırop bakım tepsisi. Fırça ve tüy rulo yuvaları, koku topu gözü, sprey kadehi, bez bölmesi.",
    features: ["Fırça yuvası", "Tüy rulo yuvası", "Koku topu gözü", "Sprey kadehi"],
    specs: [
      { label: "Dış ölçü", value: "320 × 180 × 120 mm" },
      { label: "Ağırlık", value: "360 g" },
      { label: "Uyum", value: "Raf veya çekmece" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7079",
    name: "Ayakkabı boya tepsisi",
    shortName: "Boya tepsisi",
    category: "giris",
    price: 4490,
    image: "/products/7079.webp",
    tagline: "İki fırça, iki kutu, bez.",
    description:
      "Ayakkabı bakımı tepsisi. İki fırça yatağı, iki kutu boya gözü, bez rulosu, bağcık ve kıl fırça kadehi.",
    features: ["İki fırça yatağı", "İki kutu gözü", "Bez rulosu", "Bağcık bölmesi"],
    specs: [
      { label: "Dış ölçü", value: "380 × 220 × 70 mm" },
      { label: "Ağırlık", value: "280 g" },
      { label: "Uyum", value: "Çekmece veya raf" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7080",
    name: "Dizüstü folyo",
    shortName: "Dizüstü folyo",
    category: "ofis",
    series: "aksesuar",
    price: 6990,
    image: "/products/7080.webp",
    tagline: "15,6 inç, evrak, kart.",
    description:
      "Fermuarlı dizüstü folyo. Sol göz 15,6 inç dizüstü, sağda evrak cebi, dört kart yuvası ve kalem lastiği.",
    features: ["Çevre fermuar", "15,6 inç yuva", "4 kart yuvası", "Evrak cebi"],
    specs: [
      { label: "Dış ölçü", value: "360 × 275 × 25 mm" },
      { label: "Ağırlık", value: "420 g" },
      { label: "Uyum", value: "13–16 inç" },
      { label: "Renk", value: "8 seçenek" },
    ],
    featured: true,
  },
  {
    sku: "7081",
    name: "Cüzdan istasyonu",
    shortName: "Cüzdan",
    category: "giris",
    price: 4290,
    image: "/products/7081.webp",
    tagline: "Dört cüzdan, anahtar, kartlık.",
    description:
      "Giriş cüzdan ünitesi. Arkada evrak dayanağı, dört dik cüzdan gözü, önde kartlık ve anahtar tepsisi.",
    features: ["Dört dik cüzdan gözü", "Evrak dayanağı", "Kartlık tepsisi", "Anahtar gözü"],
    specs: [
      { label: "Dış ölçü", value: "280 × 180 × 120 mm" },
      { label: "Ağırlık", value: "380 g" },
      { label: "Kapasite", value: "4 cüzdan" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7083",
    name: "Çanta rafı",
    shortName: "Çanta rafı",
    category: "gardrop",
    price: 6490,
    image: "/products/7083.webp",
    tagline: "Üç göz, çanta dik durur.",
    description:
      "Gardırop çanta rafı. Üç açık göz; el çantası, omuz çantası ve cüzdan dik durur. Raf veya duvar.",
    features: ["Üç açık göz", "Alçak ön dudak", "Raf veya duvar", "Kaymaz taban"],
    specs: [
      { label: "Dış ölçü", value: "520 × 220 × 180 mm" },
      { label: "Ağırlık", value: "720 g" },
      { label: "Kapasite", value: "3 çanta" },
      { label: "Renk", value: "8 seçenek" },
    ],
    featured: true,
  },
  {
    sku: "7084",
    name: "Klavye raflı monitör yükseltici",
    shortName: "Monitör rafı",
    category: "ofis",
    price: 5490,
    image: "/products/7084.webp",
    tagline: "Ekran yükselir, klavye altta toplanır.",
    description:
      "Monitörü göz hizasına taşıyan masaüstü yükseltici. Alt açıklık klavyeyi, yan bölmeler küçük masa araçlarını toplar.",
    features: [
      "Geniş monitör yüzeyi",
      "Alt klavye rafı",
      "Yan aksesuar bölmeleri",
      "Kaymaz ayaklar",
    ],
    specs: [
      { label: "Dış ölçü", value: "560 × 230 × 120 mm" },
      { label: "Ağırlık", value: "1600 g" },
      { label: "Taşıma", value: "20 kg" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7085",
    name: "Dizüstü bilgisayar standı",
    shortName: "Dizüstü standı",
    category: "ofis",
    price: 4490,
    image: "/products/7085.webp",
    tagline: "Ekranı yükseltir, hava akışını açık bırakır.",
    description:
      "Dizüstü bilgisayarı eğimli ve yükseltilmiş konumda tutan masa standı. Açık alt yapı hava dolaşımını ve kablo geçişini korur.",
    features: [
      "Eğimli taşıma yüzeyi",
      "Açık hava kanalı",
      "Alt cihaz dudağı",
      "Kaymaz temas noktaları",
    ],
    specs: [
      { label: "Dış ölçü", value: "260 × 240 × 150 mm" },
      { label: "Ağırlık", value: "620 g" },
      { label: "Uyum", value: "11–16 inç" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7086",
    name: "Tablet standı",
    shortName: "Tablet standı",
    category: "ofis",
    price: 2790,
    image: "/products/7086.webp",
    tagline: "Tablet dik durur, şarj kablosu geçer.",
    description:
      "Tablet ve büyük telefonlar için eğimli masa standı. Ön dudak cihazı sabitler, alt kanal şarj kablosuna alan bırakır.",
    features: ["Eğimli yaslanma yüzeyi", "Geniş ön dudak", "Şarj kablosu kanalı", "Kaymaz taban"],
    specs: [
      { label: "Dış ölçü", value: "170 × 130 × 150 mm" },
      { label: "Ağırlık", value: "280 g" },
      { label: "Uyum", value: "7–13 inç" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7087",
    name: "Kavisli kulaklık standı",
    shortName: "Kulaklık standı",
    category: "ofis",
    price: 3290,
    image: "/products/7087.webp",
    tagline: "Baş bandı kavisli yüzeyde dinlenir.",
    description:
      "Kulak üstü kulaklıklar için kavisli masa standı. Geniş üst yüzey baş bandındaki basıncı dağıtır, ağır taban denge sağlar.",
    features: [
      "Kavisli üst taşıyıcı",
      "Geniş dengeli taban",
      "Kablo toplama oluğu",
      "Yumuşak temas yüzeyi",
    ],
    specs: [
      { label: "Dış ölçü", value: "180 × 120 × 260 mm" },
      { label: "Ağırlık", value: "480 g" },
      { label: "Uyum", value: "Kulak üstü modeller" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7088",
    name: "İkili evrak tepsisi",
    shortName: "İkili evrak",
    category: "ofis",
    price: 4490,
    image: "/products/7088.webp",
    tagline: "Gelen ve bekleyen evrak iki katta.",
    description:
      "A4 evraklar için üst üste iki açık tepsi. Katlar belgeleri iş akışına göre ayırır ve önden hızlı erişim sağlar.",
    features: ["İki bağımsız kat", "Önden açık erişim", "A4 uyumlu yüzey", "Kaymaz ayaklar"],
    specs: [
      { label: "Dış ölçü", value: "340 × 250 × 160 mm" },
      { label: "Ağırlık", value: "820 g" },
      { label: "Kapasite", value: "2 × 250 sayfa" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7089",
    name: "Dikey dosyalık",
    shortName: "Dikey dosyalık",
    category: "ofis",
    price: 3890,
    image: "/products/7089.webp",
    tagline: "Dosya ve kataloglar dik, görünür durur.",
    description:
      "Masa ve raf için dikey dosya organizeri. Bölücüler klasör, katalog ve defterleri yana devrilmeden ayrı tutar.",
    features: ["Üç dikey bölme", "Açık ön erişim", "Etiket alanı", "Geniş taban"],
    specs: [
      { label: "Dış ölçü", value: "260 × 250 × 310 mm" },
      { label: "Ağırlık", value: "760 g" },
      { label: "Bölme", value: "3 adet" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7090",
    name: "Masaüstü kırtasiye organizeri",
    shortName: "Kırtasiye",
    category: "ofis",
    price: 4290,
    image: "/products/7090.webp",
    tagline: "Kalem, not ve küçük araçlar aynı düzende.",
    description:
      "Günlük kırtasiye malzemeleri için çok bölmeli masaüstü organizer. Uzun araçları dik, notları ve küçük parçaları yatay toplar.",
    features: [
      "Dik kalem gözleri",
      "Not kâğıdı bölmesi",
      "Küçük parça tepsisi",
      "Basamaklı erişim",
    ],
    specs: [
      { label: "Dış ölçü", value: "280 × 170 × 150 mm" },
      { label: "Ağırlık", value: "440 g" },
      { label: "Bölme", value: "9 göz" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7091",
    name: "Bloknot ve kalem tepsisi",
    shortName: "Bloknot",
    category: "ofis",
    price: 2990,
    image: "/products/7091.webp",
    tagline: "Not kâğıdı ve kalem yan yana hazır.",
    description:
      "Masa üstünde bloknot ve yazı araçlarını bir arada tutan alçak tepsi. Ön açıklık yaprak almayı, yan oluk kaleme erişmeyi kolaylaştırır.",
    features: ["Bloknot haznesi", "Yan kalem oluğu", "Ön parmak açıklığı", "Kaymaz taban"],
    specs: [
      { label: "Dış ölçü", value: "190 × 130 × 35 mm" },
      { label: "Ağırlık", value: "180 g" },
      { label: "Uyum", value: "100 × 100 mm bloknot" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7092",
    name: "Kademeli evraklık",
    shortName: "Kademeli evrak",
    category: "ofis",
    price: 4790,
    image: "/products/7092.webp",
    tagline: "Dosyalar kademeli sıralanır, başlıklar görünür.",
    description:
      "Aktif evrak ve dosyaları geriden öne kademeli sıralayan masa organizeri. Her bölümün üst kenarı görünür kaldığı için aranan belge hızlı bulunur.",
    features: [
      "Dört kademeli bölme",
      "A4 uyumlu genişlik",
      "Başlıkları açıkta tutar",
      "Dengeli arka destek",
    ],
    specs: [
      { label: "Dış ölçü", value: "340 × 260 × 240 mm" },
      { label: "Ağırlık", value: "920 g" },
      { label: "Bölme", value: "4 kademe" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7094",
    name: "Yaka kartı organizeri",
    shortName: "Yaka kartı",
    category: "ofis",
    price: 3490,
    image: "/products/7094.webp",
    tagline: "Kartlar ve askı ipleri düzenli sıralanır.",
    description:
      "Ofis ve etkinlik ekipleri için yaka kartı düzenleyici. Kartlar dik bölmelerde, askı ipleri ayrı kanalda karışmadan saklanır.",
    features: ["Dik kart bölmeleri", "Askı ipi kanalı", "Ön etiket alanı", "Taşıma tutamağı"],
    specs: [
      { label: "Dış ölçü", value: "280 × 160 × 140 mm" },
      { label: "Ağırlık", value: "380 g" },
      { label: "Kapasite", value: "30 kart" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7100",
    name: "Masaüstü çekmeceli yükseltici",
    shortName: "Çekmeceli yükseltici",
    category: "ofis",
    price: 4990,
    image: "/products/7100.webp",
    tagline: "Ekran yükselir, küçük araçlar çekmeceye girer.",
    description:
      "Monitör veya dizüstü bilgisayar için alçak masaüstü yükseltici. Tam genişlikte ön çekmece kalem, kablo ve küçük ofis araçlarını gözden kaldırır.",
    features: [
      "Geniş üst platform",
      "Tam genişlikte çekmece",
      "Alçak dengeli gövde",
      "Kaymaz ayaklar",
    ],
    specs: [
      { label: "Dış ölçü", value: "420 × 220 × 100 mm" },
      { label: "Ağırlık", value: "1400 g" },
      { label: "Taşıma", value: "15 kg" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7101",
    name: "Sümen",
    shortName: "Sümen",
    category: "ofis",
    series: "kompakt",
    price: 5490,
    image: "/products/7101.webp",
    tagline: "Masa yüzeyi, tek parça.",
    description: "Dikdörtgen deri sümen. Dizüstü, defter ve fare için düz çalışma yüzeyi.",
    features: ["Kaymaz taban", "Yuvarlak köşe", "Deri üst, sert taban"],
    specs: [
      { label: "Dış ölçü", value: "600 × 300 × 8 mm" },
      { label: "Ağırlık", value: "620 g" },
      { label: "Renk", value: "8 seçenek" },
    ],
    featured: true,
  },
  {
    sku: "7102",
    name: "Telefon standı",
    shortName: "Telefon",
    category: "ofis",
    series: "kompakt",
    price: 2490,
    image: "/products/7102.webp",
    tagline: "Ekranı dik tutar.",
    description: "Eğimli telefon ve küçük tablet standı. Altta kablo kanalı.",
    features: ["Eğimli yaslanma", "Alt dudak", "Kablo geçişi"],
    specs: [
      { label: "Dış ölçü", value: "90 × 140 × 110 mm" },
      { label: "Ağırlık", value: "180 g" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7103",
    name: "El desteği",
    shortName: "El desteği",
    category: "ofis",
    series: "kompakt",
    price: 2290,
    image: "/products/7103.webp",
    tagline: "Klavye önünde yaslanır.",
    description: "Uzun, yastıklı el desteği. Yazarken bileği yükseltir.",
    features: ["Yastıklı üst", "Sert taban", "Dar profil"],
    specs: [
      { label: "Dış ölçü", value: "360 × 70 × 18 mm" },
      { label: "Ağırlık", value: "210 g" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7104",
    name: "Kalem tepsisi",
    shortName: "Kalem tepsisi",
    category: "ofis",
    series: "kompakt",
    price: 1690,
    image: "/products/7104.webp",
    tagline: "Kalem ve cetvel yan yana.",
    description: "Uzun, sığ tepsi. Kalem, kurşun ve küçük araçlar.",
    features: ["Tek göz", "Yuvarlak uç", "Sığ derinlik"],
    specs: [
      { label: "Dış ölçü", value: "260 × 50 × 18 mm" },
      { label: "Ağırlık", value: "90 g" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7105",
    name: "Fare altlığı",
    shortName: "Fare altlığı",
    category: "ofis",
    series: "kompakt",
    price: 1490,
    image: "/products/7105.webp",
    tagline: "Kare, düz yüzey.",
    description: "Kare deri altlık. Fare veya fincan için.",
    features: ["Düz üst", "Sert kenar", "Kaymaz taban"],
    specs: [
      { label: "Dış ölçü", value: "110 × 110 × 8 mm" },
      { label: "Ağırlık", value: "70 g" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7106",
    name: "Kart tutucu",
    shortName: "Kart tutucu",
    category: "ofis",
    series: "kompakt",
    price: 1290,
    image: "/products/7106.webp",
    tagline: "Kartvizit dik durur.",
    description: "Yarımküre form, ortada yarık. Kartvizit veya küçük not.",
    features: ["Merkez yarığı", "Ağır taban"],
    specs: [
      { label: "Dış ölçü", value: "Ø 45 × 35 mm" },
      { label: "Ağırlık", value: "40 g" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7107",
    name: "Saat yastığı",
    shortName: "Saat yastığı",
    category: "ofis",
    series: "kompakt",
    price: 2490,
    image: "/products/7107.webp",
    tagline: "Saat yastıkta, tepside.",
    description: "Kare tepsi içinde silindir yastık. Kol saati için.",
    features: ["Silindir yastık", "Kare tepsi"],
    specs: [
      { label: "Dış ölçü", value: "90 × 90 × 55 mm" },
      { label: "Ağırlık", value: "120 g" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7108",
    name: "Küçük tepsi",
    shortName: "Küçük tepsi",
    category: "ofis",
    series: "kompakt",
    price: 1690,
    image: "/products/7108.webp",
    tagline: "Bozuk para, yüzük, klips.",
    description: "Kare, sığ yakalama tepsisi.",
    features: ["Tek göz", "Yükseltilmiş kenar"],
    specs: [
      { label: "Dış ölçü", value: "90 × 90 × 20 mm" },
      { label: "Ağırlık", value: "80 g" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7109",
    name: "Kartvizit tepsisi",
    shortName: "Kartvizit",
    category: "ofis",
    series: "kompakt",
    price: 1890,
    image: "/products/7109.webp",
    tagline: "Önde parmak boşluğu.",
    description: "Dikdörtgen kartvizit yatağı. Önde alma boşluğu.",
    features: ["Ön oyuk", "Sığ gövde", "20–30 kart"],
    specs: [
      { label: "Dış ölçü", value: "100 × 70 × 22 mm" },
      { label: "Ağırlık", value: "70 g" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7110",
    name: "Kare tepsi",
    shortName: "Kare tepsi",
    category: "ofis",
    series: "kompakt",
    price: 2190,
    image: "/products/7110.webp",
    tagline: "Anahtar, kulaklık, klips.",
    description: "Orta boy kare tepsi. Günlük küçük eşya.",
    features: ["Tek göz", "Yüksek kenar"],
    specs: [
      { label: "Dış ölçü", value: "130 × 130 × 25 mm" },
      { label: "Ağırlık", value: "140 g" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7111",
    name: "Üç bölmeli tepsi",
    shortName: "Üç bölme",
    category: "ofis",
    series: "kompakt",
    price: 2890,
    image: "/products/7111.webp",
    tagline: "Telefon, kulaklık, kablo.",
    description: "Bir uzun, iki kare göz. Şarj ve küçük eşya için.",
    features: ["3 göz", "Uzun + iki kare", "Yüksek kenar"],
    specs: [
      { label: "Dış ölçü", value: "140 × 140 × 30 mm" },
      { label: "Ağırlık", value: "180 g" },
      { label: "Renk", value: "8 seçenek" },
    ],
  },
  {
    sku: "7112",
    name: "Kulaklık standı",
    shortName: "Kulaklık",
    category: "ofis",
    series: "kompakt",
    price: 3990,
    image: "/products/7112.webp",
    tagline: "Kulaklık askıda durur.",
    description: "Kavisli üst yastık, dik gövde, kare taban.",
    features: ["Kavisli askı", "Dik mil", "Kare taban"],
    specs: [
      { label: "Dış ölçü", value: "110 × 110 × 220 mm" },
      { label: "Ağırlık", value: "310 g" },
      { label: "Renk", value: "8 seçenek" },
    ],
    featured: true,
  },
];

export const PRODUCT_COUNT = PRODUCTS.length;

/** Homepage wall: 21 SKUs (center first). Extra tiles hide below 768 / 1440. */
export const WALL_SKUS = [
  "7043",
  "7069",
  "7060",
  "7083",
  "7067",
  "7054",
  "7036",
  "7068",
  "7080",
  "7012",
  "7048",
  "7007",
  "7065",
  "7075",
  "7015",
  "7076",
  "7052",
  "7073",
  "7047",
  "7062",
] as const;

export { FREE_SHIPPING_FROM, SHIPPING_FEE } from "./commerce";

const SLUG_TO_SKU: Record<string, string> = {
  "sarj-standi": "7033",
  "sarj-istasyonu": "7033",
  "basucu-sarj-istasyonu": "7062",
  "tezgaah-organizeri": "7029",
  "tezgah-organizeri": "7029",
  "masa-organizeri": "7017",
  "tablet-ve-saat-standi": "7011",
  "basucu-valesi": "7062",
  "duvar-telefon-cebi": "7063",
  "saat-kutusu": "7034",
  "folyo-duzenleyici": "7044",
  "lavabo-istasyonu": "7030",
  "lavabo-tepsisi": "7065",
  "dizustu-folyo": "7080",
};

export function getProduct(id: string) {
  const key = decodeURIComponent(id).trim();
  const aliased = SLUG_TO_SKU[key.toLowerCase()];
  if (aliased) return PRODUCTS.find((p) => p.sku === aliased);
  return (
    PRODUCTS.find((p) => p.sku === key) ??
    PRODUCTS.find((p) => productSlug(p) === key.toLowerCase())
  );
}

export function getColor(id: ColorId) {
  return COLORS.find((c) => c.id === id);
}

export function getCategory(id: CategoryId) {
  return CATEGORIES.find((c) => c.id === id);
}

export const COLOR_WASH_HINT = "Seçilen renk zemini boyar, deri fotoğrafını değil.";

export function productsByCategory(id: CategoryId) {
  return PRODUCTS.filter((p) => p.category === id);
}

export function featuredProducts() {
  return PRODUCTS.filter((p) => p.featured);
}

export function productsBySeries(id: SeriesId) {
  return PRODUCTS.filter((p) => p.series === id);
}

export function seriesTotal(id: SeriesId) {
  return productsBySeries(id).reduce((sum, p) => sum + p.price, 0);
}

export function getSeries(id: SeriesId | undefined) {
  return SERIES.find((s) => s.id === id);
}

export function foldTr(s: string) {
  return s
    .toLocaleLowerCase("tr")
    .replace(/ı/g, "i")
    .replace(/ş/g, "s")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/â/g, "a");
}

const JOB_EXPAND: Record<string, string[]> = {
  sarj: ["sarj", "kablo"],
  kablo: ["kablo", "sarj"],
  charger: ["sarj", "kablo"],
  baharat: ["baharat", "baharatlik"],
  spice: ["baharat", "baharatlik"],
  gozluk: ["gozluk"],
  glasses: ["gozluk"],
  dizustu: ["dizustu", "laptop"],
  laptop: ["dizustu", "laptop"],
  notebook: ["dizustu", "laptop"],
  macbook: ["dizustu", "laptop"],
  folyo: ["folyo", "rulo"],
  lavabo: ["lavabo"],
  kulaklik: ["kulaklik"],
  mouse: ["mouse"],
  tepsi: ["tepsi"],
  tray: ["tepsi"],
  sumen: ["sumen"],
  kalem: ["kalem"],
  ruj: ["ruj", "makyaj"],
  oje: ["oje", "makyaj"],
  makyaj: ["makyaj"],
  makeup: ["makyaj"],
  anahtar: ["anahtar"],
  key: ["anahtar"],
  saat: ["saat"],
  watch: ["saat"],
  kahve: ["kahve"],
  coffee: ["kahve"],
  organizer: ["organizer"],
  duzenleyici: ["organizer"],
  semsiye: ["semsiye"],
  ayakkabi: ["ayakkabi"],
  cuzdan: ["cuzdan"],
};

export function matchesQuery(p: Product, q: string) {
  const raw = foldTr(q.trim());
  if (!raw) return true;
  const words = raw.split(/\s+/).filter(Boolean);
  const hay = foldTr(
    [
      p.name,
      p.shortName,
      p.sku,
      p.tagline,
      p.description,
      p.features.join(" "),
      p.category,
      p.series ?? "",
    ].join(" "),
  );
  return words.every((w) => {
    const expanded = JOB_EXPAND[w] ?? [w];
    return expanded.some((term) => hay.includes(term) || fuzzyIncludes(hay, term));
  });
}

export function searchProducts(q: string, limit = 8) {
  const needle = q.trim();
  if (!needle) return PRODUCTS.slice(0, limit);
  return promoteExact(
    PRODUCTS.filter((p) => matchesQuery(p, needle)),
    needle,
    foldTr,
  ).slice(0, limit);
}

export function neighborsInCategory(sku: string) {
  const current = getProduct(sku);
  if (!current) return { prev: null as Product | null, next: null as Product | null };
  const list = PRODUCTS.filter((p) => p.category === current.category);
  const i = list.findIndex((p) => p.sku === current.sku);
  return {
    prev: i > 0 ? list[i - 1] : null,
    next: i >= 0 && i < list.length - 1 ? list[i + 1] : null,
  };
}

export function productPath(p: Product) {
  return `/urun/${productSlug(p)}`;
}

export function specGrams(p: Product) {
  const row = p.specs.find((s) => s.label === "Ağırlık");
  if (!row) return "—";
  if (/kg/i.test(row.value)) {
    const n = Number(row.value.replace(",", ".").replace(/[^\d.]/g, ""));
    if (Number.isFinite(n)) return `${Math.round(n * 1000)} g`;
  }
  return row.value;
}

export function relatedProducts(sku: string, limit = 4) {
  const current = getProduct(sku);
  if (!current) return PRODUCTS.slice(0, limit);
  const tokens = foldTr(`${current.name} ${current.tagline}`)
    .split(/\s+/)
    .filter((w) => w.length > 3);
  const scored = PRODUCTS.filter((p) => p.sku !== current.sku).map((p) => {
    let score = 0;
    if (p.category === current.category) score += 6;
    if (current.series && p.series === current.series) score += 5;
    const hay = foldTr(`${p.name} ${p.tagline} ${p.features.join(" ")}`);
    for (const t of tokens) if (hay.includes(t)) score += 2;
    return { p, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((x) => x.p);
}
