import { Link } from "@tanstack/react-router";
import { CATEGORIES, PRODUCTS, type CategoryId } from "@/lib/products";

export function RoomsPanel() {
  return (
    <div className="absolute top-full left-1/2 z-50 hidden w-[min(36rem,calc(100vw-2rem))] -translate-x-1/2 border border-dashed border-border bg-bg pt-0 group-hover:block group-focus-within:block">
      <ul className="grid grid-cols-2 gap-px bg-border">
        {CATEGORIES.map((c) => {
          const n = PRODUCTS.filter((p) => p.category === c.id).length;
          return (
            <li key={c.id}>
              <Link
                to="/kategori/$id"
                params={{ id: c.id as CategoryId }}
                className="flex h-14 items-center justify-between bg-bg px-4 text-sm hover:bg-bg-wash"
              >
                <span>{c.name}</span>
                <span className="font-mono text-xs text-fg-muted">{n}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
