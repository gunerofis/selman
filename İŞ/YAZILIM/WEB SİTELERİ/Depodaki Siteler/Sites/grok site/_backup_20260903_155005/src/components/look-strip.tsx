import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { CATEGORIES, productSlug, type CategoryId } from "@/lib/products";
import { roomLook } from "@/lib/room-looks";
import { useCart } from "@/lib/cart";
import { usePrefs } from "@/lib/prefs";
import { Button } from "@/components/ui/button";

const FEATURED: CategoryId[] = ["ofis", "giris", "mutfak"];

export function LookStrip() {
  const addMany = useCart((s) => s.addMany);
  const lastColor = usePrefs((s) => s.lastColor);

  return (
    <section className="deferred-section mx-auto max-w-[1400px] px-4 py-16">
      <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">Lookbook</p>
      <h2 className="mt-2 font-display text-4xl sm:text-5xl">Odaya yerleştirilmiş</h2>
      <p className="mt-3 max-w-xl text-sm text-fg-muted">
        Ev ürününde tek SKU yetmez. Aynı paletten, aynı odada.
      </p>
      <div className="mt-10 grid gap-10 lg:grid-cols-3">
        {FEATURED.map((id) => {
          const cat = CATEGORIES.find((c) => c.id === id);
          const { products, note } = roomLook(id);
          if (!cat || products.length === 0) return null;
          return (
            <article key={id} className="flex flex-col border border-dashed border-border">
              <div className="grid grid-cols-2 gap-px bg-border">
                {products.slice(0, 4).map((p) => (
                  <Link
                    key={p.sku}
                    to="/urun/$sku"
                    params={{ sku: productSlug(p) }}
                    className="aspect-square bg-bg-wash"
                  >
                    <img src={p.image} alt={p.name} className="size-full object-contain p-2" />
                  </Link>
                ))}
              </div>
              <div className="flex flex-1 flex-col gap-2 px-4 py-4">
                <p className="font-display text-2xl">{cat.name}</p>
                <p className="text-sm text-fg-muted">{note}</p>
                <div className="mt-auto flex flex-col gap-2">
                  <Button
                    onClick={() => {
                      addMany(
                        products.map((p) => p.sku),
                        lastColor,
                      );
                      toast.success(`${cat.name} look'u sepete eklendi`);
                    }}
                  >
                    Bu look'u sepete
                  </Button>
                  <Link to="/kategori/$id" params={{ id }}>
                    <Button variant="outline" className="w-full">
                      Odayı gör
                    </Button>
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
