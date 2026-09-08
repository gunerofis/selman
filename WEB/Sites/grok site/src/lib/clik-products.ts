export type ClikKind = "saat" | "mucevher";

export type ClikProduct = {
  code: string;
  name: string;
  kind: ClikKind;
  color: string;
  price: number;
  image: string;
  specs: string[];
  dims?: string;
};

export const CLIK_MATERIAL = "MDF üzeri deri kaplama";

export const CLIK_FEATURES = [
  "MDF üzeri deri kaplama",
  "Talebe göre renk",
  "İç kumaş seçimi",
  "Kurumsal sipariş",
];

export const CLIK_KINDS: { id: ClikKind; label: string }[] = [
  { id: "saat", label: "Saat kutuları" },
  { id: "mucevher", label: "Mücevher kutuları" },
];

export const CLIK_PRODUCTS: ClikProduct[] = [
  { code: "MJX-001", name: "MJX-001 Mücevher Kutusu", kind: "mucevher", color: "kahve", price: 38000, image: "/clik/mjx-001.jpg", specs: ["18 yüzük", "12 küpe", "6 kolye", "3 saat", "4 bileklik", "Vitrinli kapak · kilit", "3 çekmece"], dims: "28 × 20 × 24 cm" },
  { code: "MJ-101", name: "MJ-101 Mücevher Kutusu", kind: "mucevher", color: "yeşil", price: 34000, image: "/clik/mj-101.jpg", specs: ["12 yüzük", "8 küpe", "4 bileklik", "4 kolye", "2 saat", "2 ekstra bölme"] },
  { code: "7109", name: "7109 Mücevher Kutusu", kind: "mucevher", color: "lacivert", price: 22000, image: "/clik/7109.jpg", specs: ["Yüzük bölmesi", "Kolye bölmesi", "4 çekmece", "Vitrinli kapak"] },
  { code: "7110", name: "7110 Mücevher Kutusu", kind: "mucevher", color: "kahve", price: 20000, image: "/clik/7110.jpg", specs: ["Yüzük bölmesi", "Saat bölmesi", "3 çekmece", "Vitrinli kapak"] },
  { code: "7101", name: "7101 Mücevher Kutusu", kind: "mucevher", color: "lacivert", price: 18000, image: "/clik/7101.jpg", specs: ["Yüzük bölmesi", "Kolye bölmesi", "3 çekmece", "Vitrinli kapak"] },
  { code: "7104", name: "7104 Mücevher Kutusu", kind: "mucevher", color: "yeşil", price: 18000, image: "/clik/7104.jpg", specs: ["Yüzük bölmesi", "Kolye bölmesi", "3 çekmece", "Vitrinli kapak"] },
  { code: "7102", name: "7102 Mücevher Kutusu", kind: "mucevher", color: "lacivert", price: 16000, image: "/clik/7102.jpg", specs: ["Yüzük bölmesi", "Saat bölmesi", "2 çekmece", "Vitrinli kapak"] },
  { code: "7105", name: "7105 Mücevher Kutusu", kind: "mucevher", color: "siyah", price: 15000, image: "/clik/7105.jpg", specs: ["Yüzük bölmesi", "Saat bölmesi", "2 çekmece", "Vitrinli kapak"] },
  { code: "7103", name: "7103 Mücevher Kutusu", kind: "mucevher", color: "yeşil", price: 14000, image: "/clik/7103.jpg", specs: ["Yüzük bölmesi", "Bileklik bölmesi", "2 çekmece"] },
  { code: "7106", name: "7106 Mücevher Kutusu", kind: "mucevher", color: "kahve", price: 14000, image: "/clik/7106.jpg", specs: ["Yüzük bölmesi", "Kolye bölmesi", "2 çekmece"] },
  { code: "7107", name: "7107 Mücevher Kutusu", kind: "mucevher", color: "beyaz", price: 12000, image: "/clik/7107.jpg", specs: ["Yüzük bölmesi", "Kolye bölmesi", "Çıkarılabilir tepsi"] },
  { code: "7108", name: "7108 Mücevher Kutusu", kind: "mucevher", color: "yeşil", price: 11000, image: "/clik/7108.jpg", specs: ["Yüzük bölmesi", "Küpe bölmesi", "1 çekmece"] },
  { code: "P-7001", name: "P-7001 Saat Kutusu", kind: "saat", color: "ceviz", price: 32000, image: "/clik/p-7001.jpg", specs: ["12 saat", "Masif ahşap", "Kilitli"] },
  { code: "S-8008", name: "S-8008 Saat Kutusu", kind: "saat", color: "siyah", price: 28000, image: "/clik/s-8008.jpg", specs: ["12 saat", "Fasetli gövde", "Camlı kapak"] },
  { code: "S-8004", name: "S-8004 Saat Kutusu", kind: "saat", color: "yeşil", price: 27000, image: "/clik/s-8004.jpg", specs: ["12 saat", "Ayaklı gövde", "Sekizgen form"] },
  { code: "S-7001", name: "S-7001 Saat Kutusu", kind: "saat", color: "yeşil", price: 26000, image: "/clik/s-7001.jpg", specs: ["12 saat", "Sekizgen form", "Toka kapak"] },
  { code: "S-8005", name: "S-8005 Saat Kutusu", kind: "saat", color: "beyaz", price: 24000, image: "/clik/s-8005.jpg", specs: ["10 saat", "Altın detay", "Vitrinli kapak"] },
  { code: "S-8001", name: "S-8001 Saat Kutusu", kind: "saat", color: "lacivert", price: 22000, image: "/clik/s-8001.jpg", specs: ["10 saat", "Vitrinli kapak", "Sekizgen form"] },
  { code: "S-7002", name: "S-7002 Saat Kutusu", kind: "saat", color: "siyah", price: 21000, image: "/clik/s-7002.jpg", specs: ["10 saat", "Kavisli vitrin kapak"] },
  { code: "S-7003", name: "S-7003 Saat Kutusu", kind: "saat", color: "taba", price: 21000, image: "/clik/s-7003.jpg", specs: ["10 saat", "Katlanır vitrin kapak"] },
  { code: "S-8006", name: "S-8006 Saat Kutusu", kind: "saat", color: "beyaz", price: 19000, image: "/clik/s-8006.jpg", specs: ["8 saat", "Altın detay", "Fasetli gövde"] },
  { code: "S-8002", name: "S-8002 Saat Kutusu", kind: "saat", color: "lacivert", price: 17000, image: "/clik/s-8002.jpg", specs: ["8 saat", "Vitrinli kapak", "Sekizgen form"] },
  { code: "S-8003", name: "S-8003 Saat Kutusu", kind: "saat", color: "yeşil", price: 16000, image: "/clik/s-8003.jpg", specs: ["8 saat", "Camlı kapak"] },
  { code: "S-8007", name: "S-8007 Saat Kutusu", kind: "saat", color: "turuncu", price: 14000, image: "/clik/s-8007.jpg", specs: ["6 saat", "Altıgen form", "Camlı kapak"] },
  { code: "S-8022", name: "S-8022 Saat Kutusu", kind: "saat", color: "beyaz", price: 12500, image: "/clik/s-8022.jpg", specs: ["4 saat", "Altın detay", "Vitrinli kapak"] },
  { code: "S-8023", name: "S-8023 Saat Kutusu", kind: "saat", color: "bordo", price: 12000, image: "/clik/s-8023.jpg", specs: ["4 saat", "Ahşap gövde", "Kilitli"] },
  { code: "S-8024", name: "S-8024 Saat Kutusu", kind: "saat", color: "yeşil", price: 11000, image: "/clik/s-8024.jpg", specs: ["4 saat", "Vitrinli stand"] },
  { code: "S-8021", name: "S-8021 Saat Kutusu", kind: "saat", color: "siyah", price: 10000, image: "/clik/s-8021.jpg", specs: ["4 saat", "Vitrinli tepsi"] },
  { code: "S-8019", name: "S-8019 Saat Kutusu", kind: "saat", color: "beyaz", price: 9000, image: "/clik/s-8019.jpg", specs: ["2 saat", "Altın detay", "Sekizgen form"] },
  { code: "S-8020", name: "S-8020 Saat Kutusu", kind: "saat", color: "taba", price: 8500, image: "/clik/s-8020.jpg", specs: ["2 saat", "Fasetli gövde"] },
  { code: "S-8017", name: "S-8017 Saat Kutusu", kind: "saat", color: "lacivert", price: 8000, image: "/clik/s-8017.jpg", specs: ["2 saat", "Sekizgen form"] },
  { code: "S-8018", name: "S-8018 Saat Kutusu", kind: "saat", color: "yeşil", price: 7500, image: "/clik/s-8018.jpg", specs: ["2 saat", "Stand form"] },
  { code: "S-8013", name: "S-8013 Saat Kutusu", kind: "saat", color: "beyaz", price: 6500, image: "/clik/s-8013.jpg", specs: ["1 saat", "Altın detay", "Sekizgen form"] },
  { code: "S-8014", name: "S-8014 Saat Kutusu", kind: "saat", color: "beyaz", price: 6500, image: "/clik/s-8014.jpg", specs: ["1 saat", "Altın detay", "Fasetli gövde"] },
  { code: "S-7011", name: "S-7011 Saat Kutusu", kind: "saat", color: "siyah", price: 5500, image: "/clik/s-7011.jpg", specs: ["1 saat", "Camlı kapak"] },
  { code: "S-7012", name: "S-7012 Saat Kutusu", kind: "saat", color: "bordo", price: 5500, image: "/clik/s-7012.jpg", specs: ["1 saat", "Sekizgen form"] },
  { code: "S-7017", name: "S-7017 Saat Kutusu", kind: "saat", color: "taba", price: 5500, image: "/clik/s-7017.jpg", specs: ["1 saat", "Sekizgen form"] },
  { code: "S-7018", name: "S-7018 Saat Kutusu", kind: "saat", color: "yeşil", price: 5500, image: "/clik/s-7018.jpg", specs: ["1 saat", "Sekizgen form"] },
  { code: "S-8010", name: "S-8010 Saat Kutusu", kind: "saat", color: "lacivert", price: 5500, image: "/clik/s-8010.jpg", specs: ["1 saat", "Fasetli gövde"] },
  { code: "S-8015", name: "S-8015 Saat Kutusu", kind: "saat", color: "taba", price: 5500, image: "/clik/s-8015.jpg", specs: ["1 saat", "Sekizgen form"] },
  { code: "S-7009", name: "S-7009 Saat Kutusu", kind: "saat", color: "krem", price: 5000, image: "/clik/s-7009.jpg", specs: ["1 saat", "Sunum kutusu"] },
  { code: "S-7010", name: "S-7010 Saat Kutusu", kind: "saat", color: "yeşil", price: 5000, image: "/clik/s-7010.jpg", specs: ["1 saat", "Sekizgen form"] },
  { code: "S-7013", name: "S-7013 Saat Kutusu", kind: "saat", color: "lacivert", price: 5000, image: "/clik/s-7013.jpg", specs: ["1 saat", "Kilitli kapak"] },
  { code: "S-7016", name: "S-7016 Saat Kutusu", kind: "saat", color: "siyah", price: 5000, image: "/clik/s-7016.jpg", specs: ["1 saat", "Fasetli gövde"] },
  { code: "S-8009", name: "S-8009 Saat Kutusu", kind: "saat", color: "lacivert", price: 5000, image: "/clik/s-8009.jpg", specs: ["1 saat", "Sekizgen form"] },
  { code: "S-8011", name: "S-8011 Saat Kutusu", kind: "saat", color: "yeşil", price: 5000, image: "/clik/s-8011.jpg", specs: ["1 saat", "Sekizgen form"] },
  { code: "S-8012", name: "S-8012 Saat Kutusu", kind: "saat", color: "yeşil", price: 5000, image: "/clik/s-8012.jpg", specs: ["1 saat", "Fasetli gövde"] },
  { code: "S-8016", name: "S-8016 Saat Kutusu", kind: "saat", color: "siyah", price: 5000, image: "/clik/s-8016.jpg", specs: ["1 saat", "Fasetli gövde"] },
  { code: "S-7008", name: "S-7008 Saat Kutusu", kind: "saat", color: "krem", price: 4500, image: "/clik/s-7008.jpg", specs: ["1 saat", "Fasetli gövde", "Sunum kutusu"] },
  { code: "S-7014", name: "S-7014 Saat Kutusu", kind: "saat", color: "taba", price: 4500, image: "/clik/s-7014.jpg", specs: ["1 saat", "Fasetli gövde"] },
  { code: "S-7015", name: "S-7015 Saat Kutusu", kind: "saat", color: "kahve", price: 4500, image: "/clik/s-7015.jpg", specs: ["1 saat", "Fasetli gövde"] },
];
