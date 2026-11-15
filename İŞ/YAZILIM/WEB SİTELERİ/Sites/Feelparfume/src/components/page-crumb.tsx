import { CATEGORIES, brandList, getProduct, noteList } from "@/lib/products";

const STATIC: Record<string, string> = {
  "/koleksiyon": "Tüm parfümler",
  "/kategori": "Kategoriler",
  "/marka": "Markalar",
  "/nota": "Notalar",
  "/koku-testi": "Koku testi",
  "/kesif-seti": "Keşif seti",
  "/hesap": "Hesap",
  "/favoriler": "Favoriler",
  "/sepet": "Sepet",
  "/karsilastir": "Karşılaştır",
  "/sss": "Sıkça sorulan sorular",
  "/siparis-sorgu": "Sipariş sorgula",
  "/odeme-yontemleri": "Ödeme yöntemleri",
  "/odeme": "Ödeme",
  "/teslimat": "Teslimat",
  "/iade": "İade",
  "/garanti": "Garanti",
  "/sikayet": "Şikayet ve öneri",
  "/teklif": "Ürün teklifi",
  "/kurumsal-teklif": "Kurumsal teklif",
  "/iletisim": "İletişim",
  "/hakkimizda": "Hakkımızda",
  "/bulten": "Bülten",
  "/kullanim": "Kullanım koşulları",
  "/gizlilik": "Gizlilik",
  "/kvkk": "KVKK",
  "/cerez": "Çerez politikası",
  "/cayma": "Cayma hakkı",
  "/on-bilgilendirme": "Ön bilgilendirme",
  "/mesafeli": "Mesafeli satış",
  "/satici": "Satıcı bilgileri",
  "/son": "Son baktıklarınız",
};

type Crumb = { href: string; label: string };

function trail(pathname: string): Crumb[] {
  const home: Crumb = { href: "/", label: "Ana sayfa" };
  if (pathname === "/" || pathname.startsWith("/yonetim") || pathname.startsWith("/admin")) return [];
  if (pathname.startsWith("/kategori/")) {
    const id = decodeURIComponent(pathname.split("/")[2] ?? "");
    const cat = CATEGORIES.find((item) => item.id === id);
    return [home, { href: "/kategori", label: "Kategoriler" }, { href: pathname, label: cat?.name ?? "Kategori" }];
  }
  if (pathname.startsWith("/urun/")) {
    const product = getProduct(decodeURIComponent(pathname.split("/")[2] ?? ""));
    const cat = CATEGORIES.find((item) => item.id === product?.category);
    const tail = { href: pathname, label: product?.name ?? "Ürün" };
    return cat
      ? [home, { href: `/kategori/${cat.id}`, label: cat.name }, tail]
      : [home, { href: "/koleksiyon", label: "Tüm parfümler" }, tail];
  }
  if (pathname.startsWith("/marka/")) {
    const slug = decodeURIComponent(pathname.split("/")[2] ?? "");
    const brand = brandList().find((item) => item.slug === slug);
    return [home, { href: "/marka", label: "Markalar" }, { href: pathname, label: brand?.name ?? "Marka" }];
  }
  if (pathname.startsWith("/nota/")) {
    const slug = decodeURIComponent(pathname.split("/")[2] ?? "");
    const note = noteList().find((item) => item.slug === slug);
    return [home, { href: "/nota", label: "Notalar" }, { href: pathname, label: note?.name ?? "Nota" }];
  }
  if (pathname.startsWith("/siparis/")) {
    return [home, { href: "/siparis-sorgu", label: "Sipariş sorgula" }, { href: pathname, label: "Sipariş" }];
  }
  const label = STATIC[pathname];
  return label ? [home, { href: pathname, label }] : [];
}

export function PageCrumb({ pathname }: { pathname: string }) {
  const items = trail(pathname);
  if (items.length < 2) return null;
  return (
    <nav aria-label="Sayfa yolu" className="mx-auto max-w-[1400px] px-4 pt-4 print:hidden">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-fg-muted">
        {items.map((item, index) => (
          <li key={`${item.href}-${index}`} className="flex items-center gap-2">
            {index > 0 ? <span aria-hidden="true">/</span> : null}
            {index === items.length - 1 ? (
              <span className="text-fg">{item.label}</span>
            ) : (
              <a href={item.href} className="hover:text-fg">
                {item.label}
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
