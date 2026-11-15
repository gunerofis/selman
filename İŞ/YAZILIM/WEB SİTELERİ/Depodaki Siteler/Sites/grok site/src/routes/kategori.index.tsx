import { createFileRoute, Link } from "@tanstack/react-router";
import { CATEGORIES, productSlug } from "@/lib/products";
import { pageHead } from "@/lib/seo";
import { RoomTile } from "@/components/room-tile";
import { RecentRail } from "@/components/recent-rail";
import { roomLook } from "@/lib/room-looks";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/kategori/")({
  component: Categories,
  head: () =>
    pageHead({
      title: "Odalar",
      description: "Ofis, banyo, makyaj, mutfak, gardırop, giriş, yaşam, araç.",
      path: "/kategori",
    }),
});

const WASH = [
  "bg-p-krem",
  "bg-p-taba",
  "bg-bg-wash",
  "bg-p-siyah",
  "bg-p-bordo",
  "bg-p-krem",
  "bg-p-taba",
  "bg-bg-wash",
];

function Categories() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10">
      <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">Odalar</p>
      <h1 className="mt-2 font-display text-5xl sm:text-6xl">Odalar</h1>
      <p className="mt-3 text-sm text-fg-muted">
        {CATEGORIES.length} oda. Tüm parçalar tek listede{" "}
        <Link to="/koleksiyon" className="text-taba hover:underline">
          Ürünler
        </Link>{" "}
        sayfasında. Araç dahil.
      </p>
      <ul className="mt-10 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
        {CATEGORIES.map((c, i) => (
          <li key={c.id}>
            <RoomTile
              id={c.id}
              name={c.name}
              blurb={c.blurb}
              wash={WASH[i % WASH.length]}
              tall
            />
          </li>
        ))}
      </ul>
      <section className="mt-16">
        <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">Lookbook</p>
        <h2 className="mt-2 font-display text-3xl">Odalarda birlikte</h2>
        <div className="mt-8 space-y-12">
          {CATEGORIES.map((c) => {
            const { products, note } = roomLook(c.id);
            if (products.length === 0) return null;
            return (
              <article key={c.id}>
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="font-display text-2xl">{c.name}</p>
                    <p className="mt-1 max-w-xl text-sm text-fg-muted">{note}</p>
                  </div>
                  <Link to="/kategori/$id" params={{ id: c.id }}>
                    <Button variant="outline" size="sm">
                      Odayı gör
                    </Button>
                  </Link>
                </div>
                <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {products.slice(0, 4).map((p) => (
                    <li key={p.sku}>
                      <Link
                        to="/urun/$sku"
                        params={{ sku: productSlug(p) }}
                        className="block border border-dashed border-border bg-bg-wash"
                      >
                        <img src={p.image} alt={p.name} className="aspect-square w-full object-contain p-2" />
                        <p className="truncate px-2 pb-2 font-display text-sm">{p.name}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>
      <RecentRail className="mt-16" />
    </div>
  );
}
