import { Link } from "@tanstack/react-router";
import { CATEGORIES, productsByCategory } from "@/lib/products";
import { CatalogImg } from "@/components/catalog-img";
import { cn } from "@/lib/utils";

export function CategoryTiles({ className }: { className?: string }) {
  return (
    <ul className={cn("grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5", className)}>
      {CATEGORIES.map((c) => {
        const shot = productsByCategory(c.id)[0];
        return (
          <li key={c.id}>
            <Link
              to="/kategori/$id"
              params={{ id: c.id }}
              className="how-step block overflow-hidden rounded-xl bg-bg-wash"
            >
              {shot ? (
                <CatalogImg src={shot.image} alt="" className="aspect-square w-full object-contain p-3" />
              ) : null}
              <span className="block px-3 pb-3 font-display text-lg leading-tight">{c.name}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
