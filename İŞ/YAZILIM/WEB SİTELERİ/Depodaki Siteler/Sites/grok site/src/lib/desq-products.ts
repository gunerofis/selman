export type DesqTier = "set" | "aksesuar";

export type DesqProduct = {
  slug: string;
  name: string;
  tier: DesqTier;
  color: string;
  price: number;
  image: string;
};

export const DESQ_NOTE = "Deri kaplı premium ofis ürünleri. Renk ve logo baskısı size özel.";

export const DESQ_FEATURES = [
  "Premium deri kaplama",
  "Yönetici masası aksesuarları",
  "Modüler masa setleri",
  "Kurumsal & kişiye özel",
];

export const DESQ_TIERS: { id: DesqTier; label: string }[] = [
  { id: "set", label: "Masa setleri" },
  { id: "aksesuar", label: "Aksesuarlar" },
];

export const DESQ_PRODUCTS: DesqProduct[] = [
  { slug: "yirmi-parcali-koyu-kahverengi-ofis-koleksiyonu", name: "Kahverengi ofis takımı, 20 parça", tier: "set", color: "kahve", price: 9500, image: "/desq/yirmi-parcali-koyu-kahverengi-ofis-koleksiyonu.jpg" },
  { slug: "yirmi-parcalik-koyu-kahverengi-deri-ofis-seti", name: "Kahverengi masa takımı, 20 parça", tier: "set", color: "kahve", price: 9500, image: "/desq/yirmi-parcalik-koyu-kahverengi-deri-ofis-seti.jpg" },
  { slug: "minimalist-16-parcali-ofis-seti", name: "Siyah 16 parçalı masa seti", tier: "set", color: "siyah", price: 7500, image: "/desq/minimalist-16-parcali-ofis-seti.jpg" },
  { slug: "minimalist-kahverengi-deri-masa-duzenleyicileri", name: "Kahverengi deri masa düzenleyicileri", tier: "set", color: "kahve", price: 6900, image: "/desq/minimalist-kahverengi-deri-masa-duzenleyicileri.jpg" },
  { slug: "minimal-siyah-masa-duzeni", name: "Siyah masa seti, dizüstü sümenli", tier: "set", color: "siyah", price: 6900, image: "/desq/minimal-siyah-masa-duzeni.jpg" },
  { slug: "minimalist-charcoal-masa-duzeni", name: "Antrasit masa seti", tier: "set", color: "siyah", price: 6900, image: "/desq/minimalist-charcoal-masa-duzeni.jpg" },
  { slug: "minimalist-modern-yonetici-masasi", name: "Kahverengi yönetici masa seti", tier: "set", color: "kahve", price: 6900, image: "/desq/minimalist-modern-yonetici-masasi.jpg" },
  { slug: "minimalist-monokrom-calisma-masasi", name: "Siyah çalışma masası seti", tier: "set", color: "siyah", price: 6900, image: "/desq/minimalist-monokrom-calisma-masasi.jpg" },
  { slug: "minimalist-siyah-deri-masa-duzeni", name: "Siyah deri sümen, bölmeli", tier: "set", color: "siyah", price: 6900, image: "/desq/minimalist-siyah-deri-masa-duzeni.jpg" },
  { slug: "minimalist-siyah-masa-duzeni", name: "Siyah masa seti, monitör standlı", tier: "set", color: "siyah", price: 6900, image: "/desq/minimalist-siyah-masa-duzeni.jpg" },
  { slug: "minimalist-siyah-masa-duzenleyici-set", name: "Siyah 11 parçalı masa seti", tier: "set", color: "siyah", price: 6900, image: "/desq/minimalist-siyah-masa-duzenleyici-set.jpg" },
  { slug: "minimalist-siyah-masa-duzenleyici-seti", name: "Siyah masa seti, kalem yataklı", tier: "set", color: "siyah", price: 6900, image: "/desq/minimalist-siyah-masa-duzenleyici-seti.jpg" },
  { slug: "minimalist-siyah-ofis-masasi", name: "Siyah ofis masası seti", tier: "set", color: "siyah", price: 6900, image: "/desq/minimalist-siyah-ofis-masasi.jpg" },
  { slug: "modern-ofis-masasi-duzeni", name: "Kahverengi ofis masası seti", tier: "set", color: "kahve", price: 6900, image: "/desq/modern-ofis-masasi-duzeni.jpg" },
  { slug: "modern-ofis-masasinda-sik-duzen", name: "Siyah deri sümen", tier: "set", color: "siyah", price: 6900, image: "/desq/modern-ofis-masasinda-sik-duzen.jpg" },
  { slug: "modern-ofis-masasinda-siklik", name: "Vizon sümen ve evrak tepsisi", tier: "set", color: "kahve", price: 6900, image: "/desq/modern-ofis-masasinda-siklik.jpg" },
  { slug: "modern-siyah-deri-ofis-masasi", name: "Siyah deri ofis seti", tier: "set", color: "siyah", price: 6900, image: "/desq/modern-siyah-deri-ofis-masasi.jpg" },
  { slug: "modern-siyah-ofis-masasi-duzeni", name: "Siyah ofis masası düzeni", tier: "set", color: "siyah", price: 6900, image: "/desq/modern-siyah-ofis-masasi-duzeni.jpg" },
  { slug: "premium-guner-masa-duzeni", name: "Kahverengi masa seti, kablosuz şarjlı", tier: "set", color: "kahve", price: 6900, image: "/desq/premium-guner-masa-duzeni.jpg" },
  { slug: "zarif-ve-duzenli-calisma-masasi", name: "Kahverengi çalışma masası seti", tier: "set", color: "kahve", price: 6900, image: "/desq/zarif-ve-duzenli-calisma-masasi.jpg" },
  { slug: "sik-taupe-deri-masa-duzeni", name: "Vizon deri masa seti", tier: "set", color: "taupe", price: 6900, image: "/desq/sik-taupe-deri-masa-duzeni.jpg" },
  { slug: "numarali-12-parcali-deri-masa-seti", name: "12 parçalı deri masa seti", tier: "set", color: "kahve", price: 6500, image: "/desq/numarali-12-parcali-deri-masa-seti.jpg" },
  { slug: "premium-moduler-masaustu-aksesuar-koleksiyonu", name: "Modüler kahverengi masa seti", tier: "set", color: "kahve", price: 5900, image: "/desq/premium-moduler-masaustu-aksesuar-koleksiyonu.jpg" },
  { slug: "minimalist-siyah-masaustu-duzeni", name: "Siyah masaüstü seti", tier: "set", color: "siyah", price: 5900, image: "/desq/minimalist-siyah-masaustu-duzeni.jpg" },
  { slug: "modern-siyah-ofis-duzeni", name: "Siyah ofis seti", tier: "set", color: "siyah", price: 5900, image: "/desq/modern-siyah-ofis-duzeni.jpg" },
  { slug: "premium-kahverengi-deri-masa-organizer-seti", name: "Kahverengi deri masa seti", tier: "set", color: "kahve", price: 5900, image: "/desq/premium-kahverengi-deri-masa-organizer-seti.jpg" },
  { slug: "zarif-deri-masaustu-organizeri", name: "Kahverengi deri masaüstü seti", tier: "set", color: "kahve", price: 5900, image: "/desq/zarif-deri-masaustu-organizeri.jpg" },
  { slug: "premium-kahverengi-deri-masa-mati", name: "Kahverengi deri sümen", tier: "aksesuar", color: "kahve", price: 2500, image: "/desq/premium-kahverengi-deri-masa-mati.jpg" },
  { slug: "deri-kapli-kare-not-tepsisi", name: "Deri kare not tepsisi", tier: "aksesuar", color: "kahve", price: 2200, image: "/desq/deri-kapli-kare-not-tepsisi.jpg" },
  { slug: "deri-saat-tepsisi-ve-yastik", name: "Deri saat tepsisi ve yastık", tier: "aksesuar", color: "kahve", price: 2200, image: "/desq/deri-saat-tepsisi-ve-yastik.jpg" },
  { slug: "kahverengi-deri-airpods-tepsisi", name: "Kahverengi deri kulaklık tepsisi", tier: "aksesuar", color: "kahve", price: 2200, image: "/desq/kahverengi-deri-airpods-tepsisi.jpg" },
  { slug: "kahverengi-deri-kartvizit-tepsisi", name: "Kahverengi deri kartvizit tepsisi", tier: "aksesuar", color: "kahve", price: 2200, image: "/desq/kahverengi-deri-kartvizit-tepsisi.jpg" },
  { slug: "kahverengi-deri-masa-organizerleri", name: "Kahverengi deri masa aksesuarları", tier: "aksesuar", color: "kahve", price: 2200, image: "/desq/kahverengi-deri-masa-organizerleri.jpg" },
  { slug: "mini-uc-bolmeli-deri-organizer", name: "Mini üç bölmeli deri düzenleyici", tier: "aksesuar", color: "kahve", price: 2200, image: "/desq/mini-uc-bolmeli-deri-organizer.jpg" },
  { slug: "minimalist-deri-kapli-kalem-tepsisi", name: "Deri kalem tepsisi", tier: "aksesuar", color: "kahve", price: 2200, image: "/desq/minimalist-deri-kapli-kalem-tepsisi.jpg" },
  { slug: "3-katli-kahverengi-evrak-rafi", name: "Üç katlı kahverengi evrak rafı", tier: "aksesuar", color: "kahve", price: 1800, image: "/desq/3-katli-kahverengi-evrak-rafi.jpg" },
  { slug: "deri-kapakli-manyetik-kablo-tutucu", name: "Deri kapaklı kablo tutucu", tier: "aksesuar", color: "kahve", price: 1500, image: "/desq/deri-kapakli-manyetik-kablo-tutucu.jpg" },
  { slug: "deri-ustlu-minimal-kulaklik-standi", name: "Deri kulaklık standı", tier: "aksesuar", color: "kahve", price: 1500, image: "/desq/deri-ustlu-minimal-kulaklik-standi.jpg" },
  { slug: "ergonomik-kahverengi-deri-bilek-destegi", name: "Kahverengi deri bilek desteği", tier: "aksesuar", color: "kahve", price: 1500, image: "/desq/ergonomik-kahverengi-deri-bilek-destegi.jpg" },
  { slug: "premium-deri-telefon-ve-tablet-standi", name: "Deri telefon ve tablet standı", tier: "aksesuar", color: "kahve", price: 1500, image: "/desq/premium-deri-telefon-ve-tablet-standi.jpg" },
  { slug: "minimal-kahverengi-deri-bardak-altligi", name: "Kahverengi deri bardak altlığı", tier: "aksesuar", color: "kahve", price: 1200, image: "/desq/minimal-kahverengi-deri-bardak-altligi.jpg" },
];
