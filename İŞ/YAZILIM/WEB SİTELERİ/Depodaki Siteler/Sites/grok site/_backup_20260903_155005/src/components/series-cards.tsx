import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  PASTEL,
  SERIES,
  productImageVariant,
  productSlug,
  productsBySeries,
  seriesTotal,
  type ColorId,
  type SeriesId,
} from "@/lib/products";
import { useCart } from "@/lib/cart";
import { usePrefs } from "@/lib/prefs";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function SeriesCards({ color }: { color?: ColorId }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {SERIES.map((s) => (
        <SeriesCard key={s.id} id={s.id} color={color} />
      ))}
    </div>
  );
}

export function SeriesCard({ id, color }: { id: SeriesId; color?: ColorId }) {
  const series = SERIES.find((s) => s.id === id);
  const items = productsBySeries(id);
  const total = seriesTotal(id);
  const addMany = useCart((s) => s.addMany);
  const lastColor = usePrefs((s) => s.lastColor);
  const rememberColor = usePrefs((s) => s.rememberColor);
  const chosen = color ?? lastColor ?? "espresso";
  if (!series) return null;

  return (
    <article className="group flex flex-col border border-dashed border-border bg-bg-elevated transition-colors hover:border-fg">
      <Link
        to="/koleksiyon"
        search={{ kategori: "ofis", seri: id }}
        className="block wash-shift"
        style={{ backgroundColor: PASTEL[chosen] }}
      >
        <img
          src={productImageVariant(series.image, 800)}
          alt={series.name}
          width={1500}
          height={1000}
          loading="lazy"
          decoding="async"
          className="aspect-[3/2] w-full object-contain p-3"
        />
      </Link>
      <div className="grid grid-cols-6 gap-px border-t border-dashed border-border bg-border">
        {items.slice(0, 6).map((p, i) => (
          <Link
            key={p.sku}
            to="/urun/$sku"
            params={{ sku: productSlug(p) }}
            search={{ renk: chosen }}
            className="relative aspect-square bg-bg-wash"
            title={p.name}
          >
            <img
              src={productImageVariant(p.image, 320)}
              alt={p.name}
              width={1500}
              height={1500}
              loading="lazy"
              decoding="async"
              className="size-full object-contain p-1"
            />
            {i === 5 && items.length > 6 ? (
              <span className="absolute inset-0 flex items-center justify-center bg-bg/80 font-mono text-xs">
                +{items.length - 6}
              </span>
            ) : null}
          </Link>
        ))}
      </div>
      <div className="flex flex-1 flex-col gap-2 px-4 pt-3 pb-4">
        <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">Ofis seti</p>
        <h3 className="font-display text-xl leading-snug">{series.name}</h3>
        <p className="text-sm text-fg-muted">
          {series.blurb} {items.length} parça, tek renk kit.
        </p>
        <p className="text-xs text-fg-muted">
          {items.map((p) => p.shortName).join(" · ")}
        </p>
        <p className="mt-auto font-mono text-sm tabular-nums">{formatPrice(total)}</p>
        <div className="mt-2 flex flex-col gap-2">
          <Button
            className="w-full"
            onClick={() => {
              rememberColor(chosen);
              addMany(
                items.map((p) => p.sku),
                chosen,
              );
              toast.success(`${items.length} parça sepete eklendi`);
            }}
          >
            Seti sepete ekle
          </Button>
          <Link to="/koleksiyon" search={{ kategori: "ofis", seri: id }} className="block">
            <Button variant="outline" className="w-full">
              Parçaları gör
            </Button>
          </Link>
          <Link to="/teklif" search={{ seri: id, renk: chosen }} className="block">
            <Button variant="outline" className="w-full">
              Kurumsal teklif
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
