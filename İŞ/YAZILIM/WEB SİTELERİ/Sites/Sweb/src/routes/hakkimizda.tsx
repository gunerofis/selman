import { createFileRoute, Link } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { BRAND, hasBrandValue, sellerName } from "@/lib/brand";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/hakkimizda")({
  component: About,
  head: () =>
    pageHead({
      title: "Hakkımızda",
      description:
        "Sweb saat ve mücevher kutuları; koleksiyon, atölye ve satıcı bilgileri.",
      path: "/hakkimizda",
    }),
});

const SERIES = [
{
    code: "CLIK",
    to: "/saat-mucevher-kutulari" as const,
    title: "Saat ve mücevher kutuları",
    body: "Tekli saat sunum kutusundan çok bölmeli, çekmeceli mücevher kutusuna kadar sunum kutuları.",
  }
];

function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">Kurumsal</p>
      <h1 className="mt-2 font-display text-5xl sm:text-6xl">Hakkımızda</h1>
      <p className="mt-4 text-sm leading-relaxed text-fg-muted">
        <strong className="text-fg">Sweb</strong>, {sellerName()} bünyesinde yürütülen saat ve
        mücevher kutuları markasıdır. Ürünler {BRAND.atelier} adresindeki atölyede üretilir; satış,
        fatura ve kargo işlemleri aynı şirket üzerinden yapılır. Sipariş yazışmalarında marka adı
        olarak “Sweb”, resmî belgelerde şirket unvanı görünür.
      </p>

      <section className="mt-12">
        <h2 className="font-display text-3xl">Saat ve mücevher kutuları</h2>
        <p className="mt-2 text-sm text-fg-muted">
          CLIK koleksiyonunda saat kutuları ve mücevher kutuları yer alır.
        </p>
        <ul className="mt-6 grid gap-px bg-border sm:grid-cols-2">
          {SERIES.map((s) => (
            <li key={s.code} className="bg-bg-elevated px-5 py-6">
              <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">{s.code}</p>
              <h3 className="mt-1 font-display text-xl">
                <Link to={s.to} className="hover:text-taba">
                  {s.title}
                </Link>
              </h3>
              <p className="mt-2 text-sm text-fg-muted">{s.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-3xl">Künye</h2>
        <dl className="mt-6 grid gap-px bg-border sm:grid-cols-2">
          {(
            [
              ["Marka", BRAND.name],
              ["Unvan", sellerName()],
              ["Atölye ve adres", BRAND.legalAddress],
              ["E-posta", BRAND.email],
              ["Telefon", hasBrandValue(BRAND.phone) ? BRAND.phone : "Satıcı sayfasında"],
              ["Çalışma saatleri", `Hafta içi ${BRAND.hours}`],
            ] as const
          ).map(([k, v]) => (
            <div key={k} className="bg-bg-elevated px-4 py-5">
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
        <Link to="/atolye">
          <Button>Atölye</Button>
        </Link>
        <Link to="/koleksiyon">
          <Button variant="outline">Ürün kataloğu</Button>
        </Link>
        <Link to="/iletisim">
          <Button variant="outline">İletişim</Button>
        </Link>
      </div>
    </div>
  );
}
