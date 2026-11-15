import { createFileRoute, Link } from "@tanstack/react-router";
import { COLORS, type ColorId } from "@/lib/products";
import { pageHead } from "@/lib/seo";
import { SITE_ORIGIN } from "@/lib/seo";
import { WatchBoxSlider } from "@/components/watch-box-slider";
import { RecentRail } from "@/components/recent-rail";
import { Button } from "@/components/ui/button";
import { LineHomeSection } from "@/components/line-catalog";
import { useCatalogLines } from "@/lib/catalog-context";
import { useSiteConfig } from "@/lib/site-config-context";
import { BRAND } from "@/lib/brand";

type Search = { renk?: ColorId };

export const Route = createFileRoute("/")({
  validateSearch: (raw: Record<string, unknown>): Search => ({
    renk: COLORS.some((c) => c.id === raw.renk) ? (raw.renk as ColorId) : undefined,
  }),
  head: () =>
    pageHead({
      title: "Saat ve Mücevher Kutuları",
      description:
        "Saat kutuları ve mücevher kutuları. Kapasite, model ve fiyata göre koleksiyonu keşfedin.",
      path: "/",
    }),
  component: Home,
});


function Home() {
  const lines = useCatalogLines();
  const homeLines = [...lines].sort(
    (a, b) =>
      ["clik", "slac", "desq", "sweb"].indexOf(a.key) -
      ["clik", "slac", "desq", "sweb"].indexOf(b.key),
  );
  const siteConfig = useSiteConfig();
  const { renk } = Route.useSearch();
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_ORIGIN}/#organization`,
        name: siteConfig.identity.name,
        url: SITE_ORIGIN,
        email: siteConfig.identity.email,
        address: {
          "@type": "PostalAddress",
          addressLocality: BRAND.district,
          addressRegion: BRAND.city,
          addressCountry: "TR",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_ORIGIN}/#website`,
        url: SITE_ORIGIN,
        name: siteConfig.identity.name,
        inLanguage: "tr-TR",
        publisher: { "@id": `${SITE_ORIGIN}/#organization` },
      },
    ],
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <WatchBoxSlider />

      <section className="border-t border-dashed border-border">
        <div className="mx-auto grid max-w-[1400px] gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              ["Atölye", `${siteConfig.identity.atelier}`, "/atolye"],
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

      <div className="mx-auto max-w-[1400px] px-4">
        {homeLines.map((line) => (
          <LineHomeSection key={line.key} line={line} />
        ))}
      </div>



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

      <div className="mx-auto max-w-[1400px] px-4">
        <RecentRail color={renk} className="py-16" />
      </div>

    </div>
  );
}
