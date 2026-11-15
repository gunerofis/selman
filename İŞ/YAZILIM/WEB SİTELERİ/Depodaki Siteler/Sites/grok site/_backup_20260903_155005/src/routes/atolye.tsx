import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { OpenBadge } from "@/components/open-badge";
import { BRAND } from "@/lib/brand";
import { pageHead } from "@/lib/seo";
import { getProduct, productSlug } from "@/lib/products";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/atolye")({
  component: Atelier,
  head: () =>
    pageHead({
      title: "Atölye",
      description: "Üretim, malzeme ve teslim. 3–5 iş günü hazır stok.",
      path: "/atolye",
    }),
});

const SAMPLES = ["7043", "7012", "7080"] as const;
const TABS = ["Malzeme", "Üretim", "Bakım"] as const;

function Atelier() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Malzeme");
  const copy: Record<(typeof TABS)[number], string> = {
    Malzeme:
      "Dış deri kaplama, iç keçe veya süet. İstenirse ahşap gövde, metal menteşe ve vida görünmez kalır. Sekiz renk sabit liste.",
    Üretim:
      "Kalıp, kaplama, dikiş, montaj. Hazır stok 3–5 iş günü. Ölçüye göre parça 10–15 iş günü. Elli adet ve üzeri 10–20 iş günü.",
    Bakım:
      "Nemli bez. Yağ, çözücü, buhar yok. Güneşe uzun süre bırakmayın. Damlama tepsisi çıkarılıp yıkanır.",
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <p className="font-mono text-[11px] tracking-wide text-fg-muted uppercase">Atölye</p>
      <h1 className="mt-3 font-display text-5xl sm:text-6xl">
        Ürünlerin nasıl yapıldığı, hangi malzemeden ve hangi sürede.
      </h1>
      <div className="mt-4">
        <OpenBadge />
      </div>
      <div className="mt-8 grid grid-cols-3 gap-px border border-dashed border-border bg-border">
        {SAMPLES.map((sku) => {
          const p = getProduct(sku);
          if (!p) return null;
          return (
            <Link
              key={sku}
              to="/urun/$sku"
              params={{ sku: productSlug(p) }}
              className="bg-bg-wash transition-colors hover:bg-bg-elevated"
            >
              <img src={p.image} alt={p.name} className="aspect-square w-full object-contain p-2" />
              <p className="truncate px-2 pb-2 font-mono text-[11px] text-fg-muted">{p.name}</p>
            </Link>
          );
        })}
      </div>
      <div className="mt-10 space-y-5 text-base leading-relaxed text-fg-muted">
        <p>
          {BRAND.name}, evin ve masanın görünmeyen köşelerini — çekmeceyi, lavabo kenarını, giriş
          holünü — deriyle ele alan bir atölye. Parçalar 70xx ve 71xx stok kodlarıyla üretilir; her
          biri sekiz renkte: espresso, siyah, krem, orman, taş, beyaz, taba ve kestane.
        </p>
        <p>
          Gövdeler deri ile kaplanır, içler süet veya keçe ile yumuşatılır. Döner mekanizmalar,
          damlama tepsileri ve menteşeler görünmez kalır; elde kalan şey form ve renk olur.
        </p>
        <p>
          Koleksiyon banyo, makyaj, mutfak, gardırop, giriş, yaşam, araç ve ofis masası için aynı
          elden, aynı paletten.
        </p>
      </div>
      <div className="mt-10">
        <div className="flex flex-wrap gap-1" role="tablist" aria-label="Atölye">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={cn(
                "h-11 border px-4 text-sm",
                tab === t ? "border-fg bg-fg text-bg-elevated" : "border-border-strong text-fg-muted",
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="mt-4 border border-dashed border-border bg-bg-elevated p-5" role="tabpanel">
          <p className="text-sm leading-relaxed text-fg-muted">{copy[tab]}</p>
          {tab === "Malzeme" ? (
            <Link to="/malzeme" className="mt-3 inline-block text-sm text-taba hover:underline">
              Malzeme sayfası
            </Link>
          ) : null}
          {tab === "Bakım" ? (
            <Link to="/bakim" className="mt-3 inline-block text-sm text-taba hover:underline">
              Bakım sayfası
            </Link>
          ) : null}
        </div>
      </div>
      <div className="mt-10">
        <p className="font-mono text-[11px] tracking-wide text-fg-muted uppercase">Üretim</p>
        <ol className="mt-4 grid gap-px bg-border sm:grid-cols-5">
          {["Kalıp", "Kaplama", "Dikiş", "Montaj", "Kargo"].map((step, i) => (
            <li key={step} className="bg-bg-elevated px-4 py-5">
              <p className="font-display text-2xl text-taba">{i + 1}</p>
              <p className="mt-2 text-sm">{step}</p>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-sm text-fg-muted">
          70xx ev ve oda parçaları, 71xx masa seti. Aynı sekiz renk.
        </p>
      </div>
      <div className="mt-10 border border-dashed border-border bg-bg-elevated p-6">
        <p className="font-mono text-[11px] tracking-wide text-fg-muted uppercase">Süre</p>
        <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-3">
          {[
            ["Hazır stok", "3–5 iş günü"],
            ["Ölçüye göre", "10–15 iş günü"],
            ["Kurumsal", "10–20 iş günü"],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-fg-muted">{k}</dt>
              <dd className="mt-1 font-mono">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <p className="mt-8 text-sm text-fg-muted">
        {BRAND.atelier}.{" "}
        <Link to="/ziyaret" className="text-taba hover:underline">
          Ziyaret
        </Link>
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link to="/koleksiyon">
          <Button>Koleksiyona git</Button>
        </Link>
        <Link to="/tasarla">
          <Button variant="outline">Tasarımınızı gönderin</Button>
        </Link>
        <Link to="/ziyaret">
          <Button variant="outline">Randevu</Button>
        </Link>
      </div>
    </div>
  );
}
