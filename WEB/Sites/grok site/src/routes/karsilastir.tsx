import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { comparedProducts, COMPARE_MAX, useCompare } from "@/lib/compare";
import { CATEGORIES, getSeries, productSlug, specGrams, type Product } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { usePrefs } from "@/lib/prefs";
import { useHydrated } from "@/lib/use-hydrated";
import { pageHead } from "@/lib/seo";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EmptyHint } from "@/components/qty-control";
import { RecentRail } from "@/components/recent-rail";
import { ShareButton } from "@/components/share-button";
import { SITE_ORIGIN } from "@/lib/seo";

type Search = { sku?: string };

export const Route = createFileRoute("/karsilastir")({
  validateSearch: (raw: Record<string, unknown>): Search => ({
    sku: typeof raw.sku === "string" ? raw.sku : undefined,
  }),
  component: ComparePage,
  head: () =>
    pageHead({
      title: "Karşılaştır",
      description: "Ölçü, ağırlık ve fiyat yan yana. En fazla dört parça.",
      path: "/karsilastir",
      noindex: true,
    }),
});

function ComparePage() {
  const ready = useHydrated();
  const { sku: shared } = Route.useSearch();
  const skus = useCompare((s) => s.skus);
  const remove = useCompare((s) => s.remove);
  const replace = useCompare((s) => s.replace);
  const clear = useCompare((s) => s.clear);

  useEffect(() => {
    if (!ready || !shared) return;
    const list = shared.split(",").map((s) => s.trim()).filter(Boolean).slice(0, COMPARE_MAX);
    if (list.length) replace(list);
  }, [ready, shared, replace]);
  const add = useCart((s) => s.add);
  const lastColor = usePrefs((s) => s.lastColor);
  const items = ready ? comparedProducts(skus) : [];

  if (!ready) {
    return <div className="mx-auto max-w-6xl px-4 py-20 text-sm text-fg-muted">Yükleniyor…</div>;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4">
        <EmptyHint
          title="Karşılaştırma boş"
          body="Karttaki Karşılaştır ile en fazla dört parça seçin."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Link to="/koleksiyon">
                <Button>Ürünlere git</Button>
              </Link>
              <Link to="/tasarla">
                <Button variant="outline">Tasarlayın</Button>
              </Link>
            </div>
          }
        />
        <RecentRail heading="Son baktıklarınız" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 pb-28">
      <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">Ölçü</p>
      <h1 className="mt-2 font-display text-4xl sm:text-5xl">Karşılaştır</h1>
      <p className="mt-3 max-w-xl text-sm text-fg-muted">
        {items.length} parça. Aynı paletten ölçü ve fiyat.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          onClick={() => {
            items.forEach((p, i) => add(p.sku, lastColor, 1, i === items.length - 1));
            toast.success(`${items.length} parça sepete eklendi`);
          }}
        >
          Tümünü sepete
        </Button>
        <Button variant="outline" onClick={clear}>
          Listeyi sil
        </Button>
        <ShareButton
          title="Sweb karşılaştırma"
          url={`${SITE_ORIGIN}/karsilastir?sku=${items.map((p) => p.sku).join(",")}`}
          text={`${items.length} parça`}
        />
        <Link
          to="/teklif"
          search={{ not: items.map((p) => p.sku).join(" "), renk: lastColor }}
        >
          <Button variant="outline">50+ adet teklif</Button>
        </Link>
        <Link
          to="/tasarla"
          search={{
            istek: items.map((p) => p.shortName).join(", "),
            renk: lastColor,
          }}
        >
          <Button variant="outline">Ölçüye göre tasarlayın</Button>
        </Link>
      </div>
      <div className="mt-8 overflow-x-auto border border-dashed border-border">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr>
              <th className="w-32 px-3 py-3 font-mono text-[11px] font-normal text-fg-muted">Özellik</th>
              {items.map((p) => (
                <th key={p.sku} className="px-3 py-3 font-normal">
                  <Link to="/urun/$sku" params={{ sku: productSlug(p) }} className="block">
                    <img src={p.image} alt="" className="mb-2 h-24 w-full object-contain" />
                    <span className="font-display text-lg leading-tight">{p.name}</span>
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(
              [
                ["Kod", (p: Product) => p.sku],
                ["Oda", (p: Product) => CATEGORIES.find((c) => c.id === p.category)?.name ?? p.category],
                ["Set", (p: Product) => getSeries(p.series)?.name ?? "—"],
                ["Ölçü", (p: Product) => p.specs.find((s) => s.label === "Dış ölçü")?.value ?? "—"],
                ["Ağırlık", (p: Product) => specGrams(p)],
                ["Fiyat", (p: Product) => formatPrice(p.price)],
              ] as const
            ).map(([label, val]) => (
              <tr key={label} className="border-t border-dashed border-border">
                <th className="px-3 py-3 font-mono text-[11px] font-normal text-fg-muted">{label}</th>
                {items.map((p) => (
                  <td key={p.sku} className="px-3 py-3 font-mono text-[13px]">
                    {val(p)}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="border-t border-dashed border-border">
              <th className="px-3 py-3 font-mono text-[11px] font-normal text-fg-muted"> </th>
              {items.map((p) => (
                <td key={p.sku} className="px-3 py-3">
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        add(p.sku, lastColor, 1);
                        toast.success(`${p.name} sepete eklendi`);
                      }}
                    >
                      Sepete ekle
                    </Button>
                    <button
                      type="button"
                      className="text-left text-xs text-fg-muted hover:text-fg"
                      onClick={() => remove(p.sku)}
                    >
                      Çıkar
                    </button>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
