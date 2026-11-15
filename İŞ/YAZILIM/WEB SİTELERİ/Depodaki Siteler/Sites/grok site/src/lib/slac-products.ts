export type SlacTier = "set" | "tekli";

export type SlacProduct = {
  code: string;
  name: string;
  slug: string;
  tier: SlacTier;
  color: string;
  price: number;
  image: string;
  contents: string[];
};

export const SLAC_NOTE = "MDF üzeri deri kaplama, vanilya kadife iç. Gizli mıknatıslı kapak.";

export const SLAC_FEATURES = [
  "Premium deri kaplama",
  "Vanilya kadife iç",
  "Gizli mıknatıslı kapak",
  "Kurumsal & kişisel hediye",
];

export const SLAC_TIERS: { id: SlacTier; label: string }[] = [
  { id: "set", label: "Setler" },
  { id: "tekli", label: "Tekli kutular" },
];

export const SLAC_PRODUCTS: SlacProduct[] = [
  { code: "BOX-01-LN", name: "LUNA", slug: "luna", tier: "set", color: "lacivert", price: 3900, image: "/slac/luna.jpg", contents: ["Kartlık", "Kartvizitlik", "Anahtarlık", "Telefon standı", "Metal kalem"] },
  { code: "BOX-04-NR", name: "NERO", slug: "nero", tier: "set", color: "siyah", price: 6900, image: "/slac/nero.jpg", contents: ["Kartlık", "Saat kutusu", "Gözlük kutusu", "Anahtarlık", "Düz isimlik"] },
  { code: "BOX-06-SD", name: "SAND", slug: "sand", tier: "set", color: "bej", price: 5900, image: "/slac/sand.jpg", contents: ["Kartlık", "Gözlük kutusu", "Anahtarlık", "Deri kaplı parfüm şişesi", "Kartvizitlik"] },
  { code: "BOX-10-MC", name: "MOCHA", slug: "mocha", tier: "set", color: "kahve", price: 5500, image: "/slac/mocha.jpg", contents: ["Kartlık", "Kartvizitlik", "Anahtarlık", "Gözlük kutusu", "Deri kaplı zippo"] },
  { code: "BOX-03-TR", name: "TERRA", slug: "terra", tier: "set", color: "taba", price: 4900, image: "/slac/terra.jpg", contents: ["Kartlık", "Kartvizitlik", "Anahtarlık", "Telefon standı", "Deri kaplı parfüm şişesi"] },
  { code: "BOX-08-GR", name: "GRAPHITE", slug: "graphite", tier: "set", color: "antrasit", price: 4500, image: "/slac/graphite.jpg", contents: ["Kartlık", "Kartvizitlik", "Anahtarlık", "Düz isimlik", "Deri kaplı zippo"] },
  { code: "BOX-05-FR", name: "FOREST", slug: "forest", tier: "set", color: "yeşil", price: 4200, image: "/slac/forest.jpg", contents: ["Kartlık", "Kartvizitlik", "Anahtarlık", "Mini masa organizeri", "Tükenmez kalem"] },
  { code: "BOX-09-MR", name: "MARINE", slug: "marine", tier: "set", color: "lacivert", price: 4200, image: "/slac/marine.jpg", contents: ["Kartlık", "Kartvizitlik", "Anahtarlık", "Mini masa organizeri", "Metal kalem"] },
  { code: "BOX-07-BR", name: "BORDEAUX", slug: "bordeaux", tier: "set", color: "bordo", price: 3900, image: "/slac/bordeaux.jpg", contents: ["Kartlık", "Kartvizitlik", "Anahtarlık", "Telefon standı", "Roller kalem"] },
  { code: "BOX-02-VR", name: "VERDE", slug: "verde", tier: "set", color: "yeşil", price: 3500, image: "/slac/verde.jpg", contents: ["Kartlık", "Kartvizitlik", "Anahtarlık", "Düz isimlik", "Roller kalem"] },
  { code: "BX-P08", name: "PRESTİJ Vizon Saatli", slug: "p08", tier: "set", color: "vizon", price: 9500, image: "/slac/p08.jpg", contents: ["Saat", "Deri kaplı parfüm şişesi", "Kartlık", "Düz isimlik"] },
  { code: "BX-P04", name: "PRESTİJ Yeşil Saatli", slug: "p04", tier: "set", color: "yeşil", price: 8900, image: "/slac/p04.jpg", contents: ["Saat", "Deri kaplı parfüm şişesi", "Anahtarlık", "Metal kalem"] },
  { code: "BX-P02", name: "PRESTİJ Lacivert Plus", slug: "p02", tier: "set", color: "lacivert", price: 7900, image: "/slac/p02.jpg", contents: ["Ajanda", "Kartvizitlik", "Katlanır kartvizitlik", "Anahtarlık", "Deri kaplı parfüm şişesi", "Metal kalem"] },
  { code: "BX-P07", name: "PRESTİJ Bordo", slug: "p07", tier: "set", color: "bordo", price: 7500, image: "/slac/p07.jpg", contents: ["Ajanda", "Kartvizitlik", "Kartlık", "Düz isimlik", "Anahtarlık", "Metal kalem"] },
  { code: "BX-P09", name: "PRESTİJ Kahve", slug: "p09", tier: "set", color: "kahve", price: 6900, image: "/slac/p09.jpg", contents: ["Gözlük kutusu", "Kartvizitlik", "Anahtarlık", "Deri kaplı zippo", "Metal kalem"] },
  { code: "BX-P06", name: "PRESTİJ Siyah", slug: "p06", tier: "set", color: "siyah", price: 6500, image: "/slac/p06.jpg", contents: ["Cüzdan", "Kartlık", "Deri kaplı zippo", "Anahtarlık", "Metal kalem"] },
  { code: "BX-P03", name: "PRESTİJ Yeşil", slug: "p03", tier: "set", color: "yeşil", price: 5900, image: "/slac/p03.jpg", contents: ["Kartlık", "Kartvizitlik", "Mini masa organizeri", "Anahtarlık", "Metal kalem"] },
  { code: "BX-P10", name: "PRESTİJ Antrasit", slug: "p10", tier: "set", color: "antrasit", price: 5900, image: "/slac/p10.jpg", contents: ["Telefon standı", "Mini masa organizeri", "Düz isimlik", "Anahtarlık", "Metal kalem"] },
  { code: "BX-P01", name: "PRESTİJ Lacivert", slug: "p01", tier: "set", color: "lacivert", price: 5500, image: "/slac/p01.jpg", contents: ["Kartlık", "Kartvizitlik", "Anahtarlık", "Düz isimlik", "Metal kalem"] },
  { code: "BX-P05", name: "PRESTİJ Taba", slug: "p05", tier: "set", color: "taba", price: 5500, image: "/slac/p05.jpg", contents: ["Cüzdan", "Kartvizitlik", "Anahtarlık", "Düz isimlik", "Metal kalem"] },
  { code: "BX-T09", name: "Saat Kutusu", slug: "t-saat", tier: "tekli", color: "kahve", price: 2600, image: "/slac/t-saat.jpg", contents: ["Tekli saat kutusu"] },
  { code: "BX-T08", name: "Mini Masa Organizeri", slug: "t-organizer", tier: "tekli", color: "bej", price: 2400, image: "/slac/t-organizer.jpg", contents: ["Mini masa organizeri"] },
  { code: "BX-T04", name: "Deri Parfüm Şişesi", slug: "t-parfum", tier: "tekli", color: "yeşil", price: 2200, image: "/slac/t-parfum.jpg", contents: ["Deri kaplı parfüm şişesi"] },
  { code: "BX-T05", name: "Deri Zippo", slug: "t-zippo", tier: "tekli", color: "siyah", price: 1900, image: "/slac/t-zippo.jpg", contents: ["Deri kaplı zippo"] },
  { code: "BX-T06", name: "Telefon Standı", slug: "t-telefon", tier: "tekli", color: "taba", price: 1700, image: "/slac/t-telefon.jpg", contents: ["Telefon standı"] },
  { code: "BX-T02", name: "Kartvizitlik, lacivert", slug: "t-kartvizitlik", tier: "tekli", color: "lacivert", price: 1600, image: "/slac/t-kartvizitlik.jpg", contents: ["Kartvizitlik"] },
  { code: "BX-T07", name: "Kartvizitlik, bordo", slug: "t-kartvizitlik-bordo", tier: "tekli", color: "bordo", price: 1600, image: "/slac/t-kartvizitlik-bordo.jpg", contents: ["Kartvizitlik"] },
  { code: "BX-T01", name: "Kartlık", slug: "t-kartlik", tier: "tekli", color: "lacivert", price: 1500, image: "/slac/t-kartlik.jpg", contents: ["Kartlık"] },
  { code: "BX-T03", name: "Anahtarlık", slug: "t-anahtarlik", tier: "tekli", color: "yeşil", price: 1200, image: "/slac/t-anahtarlik.jpg", contents: ["Anahtarlık"] },
];
