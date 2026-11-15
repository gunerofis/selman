import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { getProduct, type Product } from "@/lib/products";
import { usePrefs } from "@/lib/prefs";
import { useHydrated } from "@/lib/use-hydrated";
import { pageHead } from "@/lib/seo";
import { ProductCard } from "@/components/product-card";
import { CategoryTiles } from "@/components/category-tiles";
import { EmptyHint } from "@/components/qty-control";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { COMPARE_MAX, useCompare } from "@/lib/compare";

export const Route = createFileRoute("/son")({
  component: RecentPage,
  head: () =>
    pageHead({
      title: "Son baktıklarınız",
      description: "Bu tarayıcıda görülen parçalar.",
      path: "/son",
      noindex: true,
    }),
});

function RecentPage() {
  const ready = useHydrated();
  const recent = usePrefs((s) => s.recent);
  const items = ready ? recent.map(getProduct).filter((p): p is Product => p != null) : [];
  const add = useCart((s) => s.add);
  const lastColor = usePrefs((s) => s.lastColor);
  const replaceCompare = useCompare((s) => s.replace);

  if (!ready) {
    return <div className="mx-auto max-w-6xl px-4 py-20 text-sm text-fg-muted">Yükleniyor…</div>;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <EmptyHint
          title="Henüz bakılan yok"
          body="Koleksiyondan bir parçaya girin — liste burada durur."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Link to="/koleksiyon">
                <Button>Ürünlere git</Button>
              </Link>
            </div>
          }
        />
        <CategoryTiles className="mx-auto mt-12 max-w-5xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10">
      <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">Tarayıcı</p>
      <h1 className="mt-2 font-display text-5xl">Son baktıklarınız</h1>
      <p className="mt-3 text-sm text-fg-muted">{items.length} ürün · bu cihazda tutulur</p>
      <div className="mt-5 flex flex-wrap gap-2">
        <Button
          onClick={() => {
            items.forEach((p, i) => add(p.sku, lastColor, 1, i === items.length - 1));
            toast.success(`${items.length} ürün sepete eklendi`);
          }}
        >
          Tümünü sepete
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            replaceCompare(items.slice(0, COMPARE_MAX).map((p) => p.sku));
            toast.success("Karşılaştırmaya alındı");
          }}
        >
          Karşılaştır
        </Button>
        <Link to="/karsilastir">
          <Button variant="outline">Karşılaştırma sayfası</Button>
        </Link>
        <Link to="/teklif" search={{ not: items.map((p) => p.sku).join(" "), renk: lastColor }}>
          <Button variant="outline">Ürün teklifi</Button>
        </Link>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={p.sku} product={p} />
        ))}
      </div>
    </div>
  );
}
