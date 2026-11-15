import { getProduct, type ColorId, type Product } from "@/lib/products";
import { usePrefs } from "@/lib/prefs";
import { useHydrated } from "@/lib/use-hydrated";
import { ProductCard } from "@/components/product-card";

export function RecentRail({
  exclude,
  heading = "Son baktıklarınız",
  className = "mt-16",
  color,
}: {
  exclude?: string;
  heading?: string;
  className?: string;
  color?: ColorId;
}) {
  const ready = useHydrated();
  const recent = usePrefs((s) => s.recent);
  if (!ready) return null;
  const items = recent
    .filter((sku) => sku !== exclude)
    .map(getProduct)
    .filter((p): p is Product => p != null)
    .slice(0, 4);
  if (items.length < 2) return null;

  return (
    <section className={className}>
      <h2 className="font-display text-3xl">{heading}</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={p.sku} product={p} color={color} />
        ))}
      </div>
    </section>
  );
}
