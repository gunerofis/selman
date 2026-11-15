import { toast } from "sonner";
import { getProduct, getSeries, productsBySeries } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { usePrefs } from "@/lib/prefs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SeriesFill({ compact = false }: { compact?: boolean }) {
  const lines = useCart((s) => s.lines);
  const addMany = useCart((s) => s.addMany);
  const lastColor = usePrefs((s) => s.lastColor);
  const inCart = new Set(lines.map((l) => l.sku));
  const fills = [
    ...new Set(
      lines
        .map((l) => getProduct(l.sku)?.series)
        .filter((id): id is NonNullable<typeof id> => Boolean(id)),
    ),
  ]
    .map((id) => {
      const series = getSeries(id);
      const missing = productsBySeries(id).filter((p) => !inCart.has(p.sku));
      return series && missing.length > 0 ? { series, missing } : null;
    })
    .filter((row): row is NonNullable<typeof row> => row != null);
  if (fills.length === 0) return null;

  return (
    <div
      className={cn(
        compact
          ? "border-t border-dashed border-border px-4 py-3"
          : "mt-10 border border-dashed border-border bg-bg-elevated p-5",
      )}
    >
      {compact ? null : (
        <>
          <p className="font-mono text-[11px] tracking-wide text-fg-muted uppercase">Set</p>
          <h2 className="mt-1 font-display text-2xl">Eksik parça</h2>
        </>
      )}
      {fills.map(({ series, missing }) => (
        <div
          key={series.id}
          className={compact ? "flex items-center justify-between gap-3 py-1" : "mt-4"}
        >
          <p className={cn("text-fg-muted", compact ? "text-xs" : "text-sm")}>
            {series.name}
            {compact ? `: ${missing.length} eksik` : ` kitinde ${missing.length} parça eksik.`}
          </p>
          <Button
            variant="outline"
            size={compact ? "sm" : "md"}
            className={compact ? "shrink-0" : "mt-3"}
            onClick={() => {
              addMany(
                missing.map((p) => p.sku),
                lastColor,
              );
              toast.success(`${missing.length} parça sepete eklendi`);
            }}
          >
            Kalanı ekle
          </Button>
        </div>
      ))}
    </div>
  );
}
