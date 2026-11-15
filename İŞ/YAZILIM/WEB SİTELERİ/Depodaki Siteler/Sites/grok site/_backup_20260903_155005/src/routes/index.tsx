import { type FormEvent, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { HUB_CATEGORIES, COLORS, featuredProducts, type ColorId } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { pageHead } from "@/lib/seo";
import { SITE_ORIGIN } from "@/lib/seo";
import { BRAND } from "@/lib/brand";
import { ProductWall } from "@/components/product-wall";
import { RecentRail } from "@/components/recent-rail";
import { SeriesCards } from "@/components/series-cards";
import { RoomTile } from "@/components/room-tile";
import { usePrefs } from "@/lib/prefs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { atelierMailto, newsletterDraft, openAtelierMail } from "@/lib/leads";
import { LookStrip } from "@/components/look-strip";

type Search = { renk?: ColorId };

export const Route = createFileRoute("/")({
  validateSearch: (raw: Record<string, unknown>): Search => ({
    renk: COLORS.some((c) => c.id === raw.renk) ? (raw.renk as ColorId) : undefined,
  }),
  head: () =>
    pageHead({
      title: "Düzen ürünleri",
      description: "Ev ve çalışma alanı için düzen ürünleri. 8 deri renk, örnek fotoğraf.",
      path: "/",
    }),
  component: Home,
});

const WASH = [
  "bg-p-krem",
  "bg-p-taba",
  "bg-bg-wash",
  "bg-p-siyah",
  "bg-p-bordo",
  "bg-p-krem",
  "bg-p-taba",
  "bg-bg-wash",
];

function Home() {
  const { renk } = Route.useSearch();
  const navigate = Route.useNavigate();
  const rememberColor = usePrefs((s) => s.rememberColor);
  const [mail, setMail] = useState("");
  const [newsHref, setNewsHref] = useState("");
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_ORIGIN}/#organization`,
        name: BRAND.name,
        url: SITE_ORIGIN,
        email: BRAND.email,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Şişli",
          addressRegion: "İstanbul",
          addressCountry: "TR",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_ORIGIN}/#website`,
        url: SITE_ORIGIN,
        name: BRAND.name,
        inLanguage: "tr-TR",
        publisher: { "@id": `${SITE_ORIGIN}/#organization` },
      },
    ],
  };

  function onNews(e: FormEvent) {
    e.preventDefault();
    if (!mail.includes("@")) return;
    const href = atelierMailto(newsletterDraft(mail));
    setNewsHref(href);
    openAtelierMail(href);
    toast.success("E-posta uygulamanız açıldı.");
    setMail("");
  }

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="mx-auto max-w-[1400px] px-4">
        <Link
          to="/tasarla"
          className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-dashed border-border py-5 hover:text-taba"
        >
          <span className="font-display text-lg">Tasarımınızı gönderin, üretelim</span>
          <span className="text-sm text-fg-muted">Anlatın, tahmini ölçü ve fiyat çıksın →</span>
        </Link>
      </div>
      <ProductWall
        color={renk}
        onColor={(id) => {
          if (id) rememberColor(id);
          void navigate({
            search: { renk: id },
            replace: true,
          });
        }}
      />

      <section className="border-t border-dashed border-border">
        <div className="mx-auto grid max-w-[1400px] gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              ["Atölye", "İstanbul, Bomonti", "/atolye"],
              ["Teslim", "3–5 iş günü", "/teslimat"],
              ["Palet", "kahve · orman", "/palet"],
              ["İade", "14 gün", "/iade"],
            ] as const
          ).map(([k, v, href]) => (
            <Link key={k} to={href} className="how-step bg-bg px-5 py-6">
              <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">{k}</p>
              <p className="mt-1 text-sm">{v}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="deferred-section mx-auto max-w-[1400px] px-4 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">Seçme</p>
            <h2 className="mt-2 font-display text-4xl sm:text-5xl">Öne çıkan parçalar</h2>
          </div>
          <Link to="/koleksiyon" className="text-sm text-fg-muted hover:text-taba">
            Tüm ürünler →
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts()
            .slice(0, 8)
            .map((p) => (
              <ProductCard key={p.sku} product={p} color={renk} />
            ))}
        </div>
      </section>

      <LookStrip />

      <section className="deferred-section mx-auto max-w-[1400px] px-4 py-16">
        <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">Atölye</p>
        <h2 className="mt-2 font-display text-3xl">Nasıl işliyor</h2>
        <ol className="mt-8 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {[
            [
              "1",
              "Anlatın",
              "Aklınızdaki düzeni cümleyle yazın. Form, ölçü, renk — biliyorsanız ekleyin.",
            ],
            ["2", "Ölçü çıksın", "İlk fiyat tahmini. Form, milimetre ve birim fiyat döner."],
            [
              "3",
              "Yakın stok",
              "Beklerken katalogdaki benzer parçalar görünür. Hazır ürün de vardır.",
            ],
            [
              "4",
              "Numune",
              "Onaylarsanız numune 10–15 iş günü. Elli adet ve üzeri teklif sayfasından.",
            ],
          ].map(([n, t, b]) => (
            <li key={n}>
              <Link to="/tasarla" className="how-step block bg-bg-elevated px-5 py-8">
                <p className="font-display text-4xl text-taba">{n}</p>
                <p className="mt-3 font-display text-2xl">{t}</p>
                <p className="mt-2 text-sm text-fg-muted">{b}</p>
              </Link>
            </li>
          ))}
        </ol>
        <div className="mt-8">
          <Link to="/tasarla">
            <Button size="lg">Tasarımı gönder</Button>
          </Link>
        </div>
      </section>

      <section className="deferred-section mx-auto max-w-[1400px] px-4 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">Ofis</p>
            <h2 className="mt-2 font-display text-3xl">Masa setleri</h2>
            <p className="mt-2 max-w-xl text-sm text-fg-muted">
              Kompakt, aksesuar, yönetici. Tek renk, tek sepet.
            </p>
          </div>
          <Link to="/setler" className="text-sm text-fg-muted hover:text-taba">
            Tüm setler →
          </Link>
        </div>
        <div className="mt-8">
          <SeriesCards color={renk} />
        </div>
      </section>

      <section className="deferred-section mx-auto max-w-[1400px] px-4 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">Odalar</p>
            <h2 className="mt-2 font-display text-4xl sm:text-5xl">Odaya göre bakın</h2>
          </div>
          <Link to="/kategori" className="text-sm text-fg-muted hover:text-taba">
            Tüm odalar →
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-px bg-border lg:grid-cols-4">
          {HUB_CATEGORIES.map((c, i) => (
            <RoomTile
              key={c.id}
              id={c.id}
              name={c.name}
              wash={WASH[i % WASH.length]}
            />
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-4">
        <RecentRail color={renk} className="py-16" />
      </div>

      <section className="deferred-section border-t border-dashed border-border bg-bg-wash">
        <form onSubmit={onNews} className="mx-auto flex max-w-xl flex-col gap-4 px-4 py-20">
          <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">Atölye notları</p>
          <h2 className="font-display text-4xl sm:text-5xl">Yeni parça, yeni renk.</h2>
          <p className="text-sm text-fg-muted">
            Ayda bir. Fazla değil. Kayıt e-posta uygulamanızdan atölyeye gider.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              type="email"
              required
              value={mail}
              onChange={(e) => setMail(e.target.value)}
              placeholder="ad@firma.com"
              aria-label="E-posta"
              className="flex-1"
            />
            <Button type="submit" size="lg">
              Kaydol
            </Button>
          </div>
          {newsHref ? (
            <p className="text-sm text-fg-muted">
              Uygulama açılmazsa{" "}
              <a href={newsHref} className="text-taba hover:underline">
                bu bağlantıdan gönderin
              </a>
              .
            </p>
          ) : null}
        </form>
      </section>
    </div>
  );
}
