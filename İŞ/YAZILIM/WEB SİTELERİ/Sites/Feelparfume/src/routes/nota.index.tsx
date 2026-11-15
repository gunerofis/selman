import { createFileRoute, Link } from "@tanstack/react-router";
import { noteList, productsByNote } from "@/lib/products";
import { pageHead } from "@/lib/seo";
import { CatalogImg } from "@/components/catalog-img";

export const Route = createFileRoute("/nota/")({
  head: () =>
    pageHead({ title: "Notalar", description: "Vanilya, gül, oud, misk… Notaya göre parfüm bulun.", path: "/nota" }),
  component: Notes,
});

function Notes() {
  const notes = noteList();
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10">
      <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">Koku notaları</p>
      <h1 className="mt-2 font-display text-5xl sm:text-6xl">Notalar</h1>
      {notes.length === 0 ? (
        <div className="mt-10 border border-solid border-border bg-bg-elevated px-6 py-16 text-center">
          <p className="font-display text-3xl">Henüz nota yok</p>
        </div>
      ) : (
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {notes.map((n) => {
            const shot = productsByNote(n.slug)[0];
            return (
              <li key={n.slug}>
                <Link
                  to="/nota/$slug"
                  params={{ slug: n.slug }}
                  className="how-step block overflow-hidden rounded-xl bg-bg-wash"
                >
                  {shot ? (
                    <CatalogImg
                      src={shot.image}
                      alt=""
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="aspect-square w-full object-contain p-4"
                    />
                  ) : (
                    <div className="aspect-square" />
                  )}
                  <p className="px-4 font-display text-2xl leading-tight">{n.name}</p>
                  <p className="px-4 pt-1 pb-4 font-mono text-xs text-fg-muted">{n.count}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
