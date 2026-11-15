import { createFileRoute, Link } from "@tanstack/react-router";
import { usePrefs, wishedProducts } from "@/lib/prefs";
import { useHydrated } from "@/lib/use-hydrated";
import { specGrams, productSlug, getCategory } from "@/lib/products";
import { pageHead } from "@/lib/seo";
import { formatPrice } from "@/lib/utils";
import { ProductCard } from "@/components/product-card";
import { EmptyHint } from "@/components/qty-control";
import { RecentRail } from "@/components/recent-rail";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";
import { ShareButton } from "@/components/share-button";
import { SITE_ORIGIN } from "@/lib/seo";

type Search = { sku?: string };

export const Route = createFileRoute("/favoriler")({
  validateSearch: (raw: Record<string, unknown>): Search => ({
    sku: typeof raw.sku === "string" ? raw.sku : undefined,
  }),
  component: Favorites,
  head: () =>
    pageHead({
      title: "Favoriler",
      description: "Kayıtlı parçalar. Karşılaştırma listesi tarayıcıda.",
      path: "/favoriler",
      noindex: true,
    }),
});

function Favorites() {
  const ready = useHydrated();
  const { sku: shared } = Route.useSearch();
  const wishlist = usePrefs((s) => s.wishlist);
  const sharedItems = ready
    ? wishedProducts((shared ?? "").split(",").map((s) => s.trim()).filter(Boolean))
    : [];
  const items = ready ? wishedProducts(wishlist) : [];
  const shown = sharedItems.length > 0 ? sharedItems : items;
  const add = useCart((s) => s.add);
  const lastColor = usePrefs((s) => s.lastColor);
  const toggleWish = usePrefs((s) => s.toggleWish);

  if (!ready) {
    return <div className="mx-auto max-w-6xl px-4 py-20 text-sm text-fg-muted">Yükleniyor…</div>;
  }

  if (shown.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4">
        <EmptyHint
          title="Favori yok"
          body="Bir parçanın kalbine dokunun — listeniz burada durur."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Link to="/koleksiyon">
                <Button>Koleksiyona git</Button>
              </Link>
              <Link to="/tasarla">
                <Button variant="outline">Tasarlayın</Button>
              </Link>
              <Link to="/son">
                <Button variant="outline">Son baktıklarınız</Button>
              </Link>
            </div>
          }
        />
        <RecentRail heading="Son baktıklarınız" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-xs tracking-[0.28em] text-fg-muted uppercase">Kayıtlı</p>
      <h1 className="mt-2 font-display text-5xl">Favoriler</h1>
      <p className="mt-3 text-sm text-fg-muted">
        {shown.length} parça · {sharedItems.length > 0 ? "paylaşılan liste" : "tarayıcıda tutulur"}.
        Renk, ürün sayfasında seçilir.
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={() => {
            shown.forEach((p, i) => add(p.sku, lastColor, 1, i === shown.length - 1));
            toast.success(`${shown.length} parça sepete eklendi`);
          }}
        >
          Tümünü sepete ekle
        </Button>
        {sharedItems.length > 0 ? (
          <Button
            variant="outline"
            onClick={() => {
              sharedItems.forEach((p) => {
                if (!wishlist.includes(p.sku)) toggleWish(p.sku);
              });
              toast.success("Liste kaydedildi");
            }}
          >
            Listeyi kaydet
          </Button>
        ) : (
          <ShareButton
            title="Sweb favoriler"
            url={`${SITE_ORIGIN}/favoriler?sku=${shown.map((p) => p.sku).join(",")}`}
            text={`${shown.length} parça`}
          />
        )}
        <Link
          to="/teklif"
          search={{ not: shown.map((p) => p.sku).join(" "), renk: lastColor }}
        >
          <Button variant="outline">50+ adet teklif</Button>
        </Link>
        <Link
          to="/tasarla"
          search={{
            istek: shown.map((p) => p.shortName).join(", "),
            renk: lastColor,
          }}
        >
          <Button variant="outline">Ölçüye göre tasarlayın</Button>
        </Link>
      </div>
      {shown.length >= 2 ? (
        <div className="mt-8 overflow-x-auto border border-dashed border-border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-bg-wash font-mono text-[11px] tracking-wide text-fg-muted uppercase">
              <tr>
                <th className="px-3 py-2 font-normal">Parça</th>
                <th className="px-3 py-2 font-normal">Oda</th>
                <th className="px-3 py-2 font-normal">Ölçü</th>
                <th className="px-3 py-2 font-normal">Ağırlık</th>
                <th className="px-3 py-2 font-normal">Fiyat</th>
                <th className="px-3 py-2 font-normal" />
              </tr>
            </thead>
            <tbody>
              {shown.map((p) => {
                const olcu = p.specs.find((s) => s.label === "Dış ölçü")?.value ?? "—";
                return (
                  <tr key={p.sku} className="border-t border-dashed border-border">
                    <td className="px-3 py-3">
                      <Link
                        to="/urun/$sku"
                        params={{ sku: productSlug(p) }}
                        className="font-medium hover:text-taba"
                      >
                        {p.name}
                      </Link>
                      <span className="mt-0.5 block font-mono text-[11px] text-fg-muted">
                        {p.sku}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-fg-muted">
                      {getCategory(p.category)?.name ?? p.category}
                    </td>
                    <td className="px-3 py-3 font-mono text-[13px]">{olcu}</td>
                    <td className="px-3 py-3 font-mono text-[13px]">{specGrams(p)}</td>
                    <td className="px-3 py-3 tabular-nums">{formatPrice(p.price)}</td>
                    <td className="px-3 py-3 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => add(p.sku, lastColor, 1)}
                      >
                        Sepete ekle
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}
      <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => (
          <ProductCard key={p.sku} product={p} />
        ))}
      </div>
    </div>
  );
}
