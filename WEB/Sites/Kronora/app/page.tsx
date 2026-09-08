/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import ProductCard from "./product-card";
import ProductWall from "./product-wall";
import { getProducts, getSettings, type StoreProduct } from "./lib/store";
import { applyProductWallOrder, buildProductWallModels, parseProductWallOrder, randomizeProductWall, type WallColor } from "./lib/product-wall";

export const dynamic = "force-dynamic";

function normalize(value: string) {
  return value.toLocaleLowerCase("tr-TR");
}

function findProduct(products: StoreProduct[], terms: string[], fallback = 0) {
  return products.find((product) => {
    const identity = normalize(`${product.name} ${product.model} ${product.color}`);
    return terms.every((term) => identity.includes(normalize(term)));
  }) || products[fallback % Math.max(products.length, 1)];
}

export default async function Home({ searchParams }: { searchParams: Promise<{ duvar?: string }> }) {
  const [products, settings] = await Promise.all([getProducts(), getSettings()]);
  const params = await searchParams;
  const wallColor = (["krem", "kahve", "bordo", "taba", "siyah"].includes(params.duvar || "") ? params.duvar : "bordo") as WallColor;
  const wallModels = buildProductWallModels(products);
  const orderedWallModels = parseProductWallOrder(settings.productWallModelOrder).length
    ? applyProductWallOrder(wallModels, settings.productWallModelOrder)
    : randomizeProductWall(wallModels);
  const withImages = products.filter((product) => product.primaryImage);
  const heroProduct = findProduct(withImages, ["çekmeceli", "kahve"], 0);
  const craftProduct = findProduct(withImages, ["12'li", "siyah"], 1);
  const colorCount = new Set(products.map((product) => product.color).filter(Boolean)).size;

  const categories = [
    { href: "/koleksiyon", label: "Saat Kutuları", note: "6'lı ve 12'li modeller", image: "/category-cream-v2.webp", width: 1122, height: 1402 },
    { href: "/gozluk-airpods-kutusu", label: "Saat & Gözlük", note: "Kombine saklama çözümleri", image: "/category-burgundy-v2.webp", width: 1402, height: 1122 },
    { href: "/organizerler", label: "Organizerler", note: "Çok bölmeli günlük düzen", image: "/moneluks-hero-v2.webp", width: 1586, height: 992 },
    { href: "/tekli-saat-kutulari", label: "Tekli Kutular", note: "Kompakt ve kişisel seçenekler", image: "/category-black-v2.webp", width: 1402, height: 1122 },
  ];

  return (
    <main id="main-content">
      <section className="moneluks-hero">
        <div className="moneluks-hero-copy">
          <h1>{settings.heroTitle}</h1>
          <p>{settings.heroDescription}</p>
          <div className="hero-actions">
            <Link className="button primary" href="/koleksiyon">Koleksiyonu keşfet</Link>
            <Link className="text-link" href="/rehber">Ürün rehberi</Link>
          </div>
        </div>
        <div className="moneluks-hero-media">
          <img src="/moneluks-hero-v2.webp" width="1586" height="992" alt={`${heroProduct?.name || "Moneluks çekmeceli saat ve aksesuar kutusu"} yaşam alanında`} fetchPriority="high" />
        </div>
      </section>

      <section className="home-proof-strip" aria-label="Koleksiyon özellikleri">
        <div><b>{products.length} seçili ürün</b><span>Nitelikli koleksiyon</span></div>
        <div><b>{colorCount} renk seçeneği</b><span>Klasik ve zamansız tonlar</span></div>
        <div><b>Model ve kapasite filtresi</b><span>İhtiyacınıza en uygun seçim</span></div>
      </section>

      <ProductWall models={orderedWallModels} initialColor={wallColor} />

      <section className="category-rail-section" aria-labelledby="category-title">
        <div className="section-heading">
          <h2 id="category-title">Koleksiyonu keşfedin</h2>
          <Link className="text-link" href="/koleksiyon">Tüm ürünleri gör</Link>
        </div>
        <div className="category-rail">
          {categories.map((category) => (
            <Link href={category.href} key={category.href}>
              <div><img src={category.image} width={category.width} height={category.height} alt="" loading="lazy" /></div>
              <h3>{category.label}</h3>
              <p>{category.note}</p>
              <span aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-products" aria-labelledby="selected-products-title">
        <div className="section-heading">
          <div>
            <h2 id="selected-products-title">Seçili parçalar</h2>
            <p>Farklı kapasite, kullanım biçimi ve renklerde öne çıkan ürünler.</p>
          </div>
          <Link className="text-link" href="/koleksiyon">Koleksiyonun tamamı</Link>
        </div>
        <div className="product-grid">{products.slice(0, 8).map((product) => <ProductCard key={product.slug} product={product} />)}</div>
      </section>

      <section className="craft-editorial">
        <div className="craft-editorial-copy">
          <span>Malzeme, oran, düzen</span>
          <h2>Düzen, saklamanın ötesinde bir ritüeldir.</h2>
          <p>Koleksiyonunuzu görünür, erişilebilir ve korunmuş tutan dengeli iç düzenler. Her modelin kapasitesini ve kullanım biçimini ürün bilgilerinden karşılaştırın.</p>
          <Link className="text-link light" href="/rehber">Doğru modeli bulun</Link>
        </div>
        <div className="craft-editorial-media">
          <img src="/moneluks-hero-v2.webp" width="1586" height="992" alt={craftProduct?.name || "Moneluks saat ve aksesuar organizeri"} loading="lazy" />
        </div>
      </section>

      <section className="home-guide" aria-labelledby="guide-title">
        <h2 id="guide-title">Doğru kutuyu üç adımda bulun.</h2>
        <div>
          <span>01</span>
          <h3>Kapasiteyi belirleyin</h3>
          <p>Bugünkü koleksiyonunuzla birlikte büyüme payını da düşünün.</p>
        </div>
        <div>
          <span>02</span>
          <h3>Kullanımı düşünün</h3>
          <p>Saat, gözlük ve küçük parçalar için gereken bölmeleri karşılaştırın.</p>
        </div>
        <div>
          <span>03</span>
          <h3>Rengi seçin</h3>
          <p>Siyah, bordo, kahve, krem ve taba seçeneklerini yan yana inceleyin.</p>
        </div>
      </section>

      <section className="corporate-band">
        <div>
          <span>Kurumsal</span>
          <h2>Koleksiyonlara, ekiplere ve özel günlere.</h2>
          <p>Ürün, adet, renk ve teslimat ihtiyacınızı paylaşın; süreci birlikte netleştirelim.</p>
        </div>
        <div className="corporate-band-actions">
          <Link href="/toplu-siparis"><span>Toplu sipariş</span><b>Talep oluştur →</b></Link>
          <Link href="/bayilik"><span>Satış ortaklığı</span><b>Bayilik bilgileri →</b></Link>
          <Link href="/iletisim"><span>Doğrudan iletişim</span><b>{settings.contactPhone} →</b></Link>
        </div>
      </section>

      <section className="home-links" aria-label="Moneluks hakkında daha fazla bilgi">
        <Link href="/galeri"><span>Görsel seçki</span><h2>Galeri</h2><b>→</b></Link>
        <Link href="/hakkimizda"><span>Yaklaşımımız</span><h2>Hakkımızda</h2><b>→</b></Link>
        <Link href="/iletisim"><span>Ürün ve sipariş</span><h2>İletişim</h2><b>→</b></Link>
      </section>
    </main>
  );
}
