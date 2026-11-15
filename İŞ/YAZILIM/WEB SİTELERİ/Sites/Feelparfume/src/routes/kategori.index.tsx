import { createFileRoute, Link } from "@tanstack/react-router";
import { CATEGORIES, productsByCategory } from "@/lib/products";
import { pageHead } from "@/lib/seo";
import { RecentRail } from "@/components/recent-rail";
import { CatalogImg } from "@/components/catalog-img";

export const Route = createFileRoute("/kategori/")({
  component: Categories,
  head: () =>
    pageHead({
      title: "Kategoriler",
      path: "/kategori",
    }),
});

function Categories() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10">
      <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">Kategoriler</p>
      <h1 className="mt-2 font-display text-5xl sm:text-6xl">Tüm kategoriler</h1>
      {CATEGORIES.length === 0 ? (
        <div className="mt-10 border border-solid border-border bg-bg-elevated px-6 py-16 text-center">
          <p className="font-display text-3xl">Henüz kategori yok</p>
        </div>
      ) : (
        <ul className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-3">
          {CATEGORIES.map((c) => {
            const items = productsByCategory(c.id);
            const shot = items[0];
            return (
              <li key={c.id}>
                <Link
                  to="/kategori/$id"
                  params={{ id: c.id }}
                  className="how-step block overflow-hidden rounded-xl bg-bg-wash"
                >
                  {shot ? (
                    <CatalogImg
                      src={shot.image}
                      alt=""
                      sizes="(max-width: 1024px) 50vw, 33vw"
                      className="aspect-[4/3] w-full object-contain p-6"
                    />
                  ) : (
                    <div className="aspect-[4/3]" />
                  )}
                  <p className="px-4 font-display text-3xl leading-tight">{c.name}</p>
                  <p className="px-4 pt-1 pb-4 font-mono text-xs text-fg-muted">{items.length}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
      <RecentRail className="mt-16" />
    </div>
  );
}
