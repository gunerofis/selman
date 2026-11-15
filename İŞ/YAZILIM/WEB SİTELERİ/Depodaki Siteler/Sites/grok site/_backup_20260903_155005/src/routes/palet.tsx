import { createFileRoute, Link } from "@tanstack/react-router";
import { COLORS, COLOR_WASH_HINT, PASTEL, featuredProducts } from "@/lib/products";
import { pageHead } from "@/lib/seo";
import { ProductCard } from "@/components/product-card";

export const Route = createFileRoute("/palet")({
  component: PalettePage,
  head: () =>
    pageHead({
      title: "Palet",
      description: "Sekiz deri renk. Sitede zemin boyanır; fotoğraf örnek kalır.",
      path: "/palet",
    }),
});

function PalettePage() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10">
      <p className="font-mono text-[11px] tracking-wide text-fg-muted uppercase">Deri</p>
      <h1 className="mt-2 font-display text-5xl sm:text-6xl">Sekiz renk</h1>
      <p className="mt-3 max-w-xl text-sm text-fg-muted">
        Kahve, krem, orman. Vurgu orman yeşili; sayfa krem. {COLOR_WASH_HINT}
      </p>
      <ul className="mt-10 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
        {COLORS.map((c) => (
          <li key={c.id}>
            <Link
              to="/koleksiyon"
              search={{ renk: c.id }}
              className="group flex min-h-56 flex-col justify-between p-5"
              style={{ backgroundColor: PASTEL[c.id] }}
            >
              <span
                className="size-10 border border-border-strong"
                style={{ backgroundColor: c.swatch }}
              />
              <span>
                <span className="block font-display text-3xl">{c.name}</span>
                <span className="mt-1 block font-mono text-xs text-fg-muted">Ürünlerde gör →</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <section className="mt-16">
        <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">Zemin</p>
        <h2 className="mt-2 font-display text-3xl">Aynı parça, sekiz zemin</h2>
        <p className="mt-2 max-w-xl text-sm text-fg-muted">
          Fotoğraf değişmez. Seçilen renk kartın zeminini boyar.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {COLORS.map((c, i) => {
            const sample = featuredProducts()[i % Math.max(1, featuredProducts().length)];
            if (!sample) return null;
            return (
              <div key={c.id}>
                <p className="mb-3 font-display text-xl">{c.name}</p>
                <ProductCard product={sample} color={c.id} />
                <Link
                  to="/koleksiyon"
                  search={{ renk: c.id }}
                  className="mt-2 inline-block text-xs text-taba hover:underline"
                >
                  {c.name} zeminde koleksiyon
                </Link>
              </div>
            );
          })}
        </div>
      </section>
      <p className="mt-8 text-sm text-fg-muted">
        Bakım için{" "}
        <Link to="/bakim" className="text-taba hover:underline">
          bakım rehberi
        </Link>
        . Ölçü için{" "}
        <Link to="/olcu" className="text-taba hover:underline">
          ölçü rehberi
        </Link>
        .
      </p>
    </div>
  );
}
