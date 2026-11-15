import { createFileRoute, Link } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { BRAND, hasBrandValue, sellerName } from "@/lib/brand";
import { Button } from "@/components/ui/button";
import { featuredProducts, PRODUCTS, productSlug } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { CatalogImg } from "@/components/catalog-img";

export const Route = createFileRoute("/hakkimizda")({
  component: About,
  head: () =>
    pageHead({
      title: "Hakkımızda",
      path: "/hakkimizda",
    }),
});

function About() {
  const bottles = featuredProducts().slice(0, 4);
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-14">
      <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">Kurumsal</p>
      <h1 className="mt-2 font-display text-5xl sm:text-6xl">Hakkımızda</h1>
      {bottles.length ? (
        <ul className="mt-8 grid grid-cols-4 gap-2">
          {bottles.map((p) => (
            <li key={p.sku}>
              <Link to="/urun/$sku" params={{ sku: productSlug(p) }} className="block overflow-hidden rounded-xl bg-bg-wash">
                <CatalogImg src={p.image} alt="" sizes="180px" className="aspect-square w-full object-contain p-2" />
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-fg-muted">
        <strong className="text-fg">{BRAND.name}</strong>, {sellerName()} bünyesinde yürütülen bir
        markadır. Satış, fatura ve kargo işlemleri aynı şirket üzerinden yapılır.
      </p>

      <section className="mt-12">
        <h2 className="font-display text-3xl">Künye</h2>
        <dl className="mt-6 grid gap-3 sm:grid-cols-2">
          {(
            [
              ["Marka", BRAND.name],
              ["Unvan", sellerName()],
              ["Adres", BRAND.legalAddress],
              ["E-posta", BRAND.email],
              ["Telefon", hasBrandValue(BRAND.phone) ? BRAND.phone : "Satıcı sayfasında"],
              ["Çalışma saatleri", `Hafta içi ${BRAND.hours}`],
            ] as const
          ).map(([k, v]) => (
            <div key={k} className="rounded-xl bg-bg-wash px-4 py-5">
              <dt className="font-mono text-[11px] tracking-wide text-fg-muted uppercase">{k}</dt>
              <dd className="mt-2 text-sm text-fg">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-sm text-fg-muted">
          MERSİS, vergi dairesi ve vergi numarası dahil tüm resmî künye{" "}
          <Link to="/satici" className="text-taba hover:underline">
            satıcı bilgileri
          </Link>{" "}
          sayfasındadır.
        </p>
      </section>

      <div className="mt-12 flex flex-wrap gap-2">
        <Link to="/koleksiyon">
          <Button variant="outline">Ürün kataloğu</Button>
        </Link>
        <Link to="/iletisim">
          <Button variant="outline">İletişim</Button>
        </Link>
      </div>
      {PRODUCTS.length ? (
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {PRODUCTS.slice(0, 8).map((p) => (
            <ProductCard key={p.sku} product={p} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
