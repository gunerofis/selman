import type { LineItem } from "./line-items";

type ArchiveProduct = {
  code: string;
  name: string;
  tags: string[];
  filterTags?: string[];
  description: string;
};

const PRODUCTS: ArchiveProduct[] = [
  {
    code: "G039",
    name: "Tekli Gerçek Deri Saat Kutusu · Watch Roll",
    tags: ["1 saat", "Gerçek deri", "Çıtçıtlı kapak"],
    filterTags: ["kap-tekli"],
    description: "Tek kol saatini taşımak ve saklamak için hazırlanan gerçek deri, çıtçıtlı saat rulosu tasarımıdır.",
  },
  {
    code: "G040",
    name: "İkili Gerçek Deri Saat Kutusu · Watch Roll",
    tags: ["2 saat", "Gerçek deri", "Çıtçıtlı kapak"],
    filterTags: ["kap-kucuk"],
    description: "İki kol saati için ayrı yastıklı alan sunan gerçek deri, çıtçıtlı saat rulosu tasarımıdır.",
  },
  {
    code: "G041",
    name: "Üçlü Gerçek Deri Saat Kutusu · Watch Roll",
    tags: ["3 saat", "Gerçek deri", "Çıtçıtlı kapak"],
    filterTags: ["kap-kucuk"],
    description: "Üç kol saatini düzenli biçimde taşımaya uygun gerçek deri saat rulosu tasarımıdır.",
  },
  {
    code: "G044",
    name: "Dörtlü Gerçek Deri Saat Kutusu · Watch Roll",
    tags: ["4 saat", "Gerçek deri", "Rulo form"],
    filterTags: ["kap-kucuk"],
    description: "Dört kol saati için yastıklı bölmeler içeren gerçek deri saat rulosu tasarımıdır.",
  },
  {
    code: "G045",
    name: "6'lı Gerçek Deri Saat Kutusu · Watch Roll",
    tags: ["6 saat", "Gerçek deri", "Rulo form"],
    filterTags: ["kap-orta"],
    description: "Altı kol saatini tek gövdede düzenleyen gerçek deri saat rulosu tasarımıdır.",
  },
  {
    code: "G046",
    name: "8'li Gerçek Deri Saat Kutusu · Watch Roll",
    tags: ["8 saat", "Gerçek deri", "Rulo form"],
    filterTags: ["kap-orta"],
    description: "Sekiz kol saatine kadar düzenli saklama alanı sunan gerçek deri saat rulosu tasarımıdır.",
  },
  {
    code: "G049",
    name: "Koruyucu Gerçek Deri Saat Kılıfı",
    tags: ["1 saat", "Gerçek deri", "Koruyucu kılıf"],
    filterTags: ["kap-tekli"],
    description: "Tek kol saatini taşımak için kapaklı ve çıtçıtlı gerçek deri koruyucu kılıf tasarımıdır.",
  },
];

export const REAL_LEATHER_WATCH_PRODUCTS: LineItem[] = PRODUCTS.map((product) => {
  const asset = product.code.toLowerCase();
  return {
    id: `gercek-deri-${asset}`,
    name: product.name,
    image: `/gercek-deri-saat/${asset}-960.webp`,
    imageSrcSet: `/gercek-deri-saat/${asset}-480.webp 480w, /gercek-deri-saat/${asset}-960.webp 960w`,
    alt: `${product.name}, ${product.code}`,
    price: null,
    availability: "inquiry-only",
    code: product.code,
    kind: "Saat kutusu",
    tags: product.tags,
    note: "Gerçek deri saat ürünleri · fiyat, stok ve üretim süresi satış öncesi teyit edilir",
    filter: "saat",
    filterTags: ["gercek-deri", ...(product.filterTags ?? [])],
    teklifNot: `CLIK · ${product.code} · ${product.name} · fiyat, stok ve üretim bilgisi`,
    seoTitle: product.name,
    seoDescription: `${product.name}; gerçek deri saat aksesuarı. Güncel fiyat, stok ve üretim süresi satış öncesi teyit edilir.`,
    description: product.description,
    details: [
      { label: "Ürün kodu", value: product.code },
      { label: "Malzeme", value: "Gerçek deri" },
      { label: "Fiyat, stok ve üretim", value: "Satış öncesi teyit edilir" },
      { label: "Renk ve iç detay", value: "Görseldeki uygulama örnektir; üretim öncesi teyit edilir" },
    ],
  };
});
