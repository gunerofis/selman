import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { noteList, productSlug, productsByNote } from "@/lib/products";
import { pageHead } from "@/lib/seo";
import { ProductCard } from "@/components/product-card";
import { CatalogImg } from "@/components/catalog-img";

export const Route = createFileRoute("/nota/$slug")({
  beforeLoad: ({ params }) => {
    if (!noteList().some((n) => n.slug === params.slug)) throw notFound();
  },
  head: ({ params }) => {
    const n = noteList().find((x) => x.slug === params.slug);
    return pageHead({
      title: n ? `${n.name} notalı parfümler` : "Nota",
      description: n ? `İçinde ${n.name.toLocaleLowerCase("tr")} notası olan kadın, erkek ve unisex parfümler.` : undefined,
      path: `/nota/${params.slug}`,
    });
  },
  component: Note,
});

function Note() {
  const { slug } = Route.useParams();
  const note = noteList().find((n) => n.slug === slug);
  const items = productsByNote(slug);
  if (!note) throw notFound();
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10">
      <h1 className="font-display text-5xl sm:text-6xl">{note.name} notalı parfümler</h1>
      <p className="mt-3 font-mono text-sm text-fg-muted">{items.length} ürün</p>
      <ul className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(7.5rem,1fr))] gap-2">
        {items.map((p) => (
          <li key={p.sku}>
            <Link to="/urun/$sku" params={{ sku: productSlug(p) }} className="block overflow-hidden rounded-xl bg-bg-wash">
              <CatalogImg src={p.image} alt={p.name} sizes="12vw" className="aspect-square w-full object-contain p-1" />
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {items.map((p, i) => (
          <ProductCard key={p.sku} product={p} priority={i < 4} />
        ))}
      </div>
    </div>
  );
}
