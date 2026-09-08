import { Link } from "@tanstack/react-router";
import { PRODUCTS, productImageVariant, type CategoryId } from "@/lib/products";
import { cn } from "@/lib/utils";

export function RoomTile({
  id,
  name,
  blurb,
  wash,
  tall = false,
}: {
  id: CategoryId;
  name: string;
  blurb?: string;
  wash: string;
  tall?: boolean;
}) {
  const items = PRODUCTS.filter((p) => p.category === id);
  const first = items[0];
  const second = items[1];

  return (
    <Link
      to="/kategori/$id"
      params={{ id }}
      className={cn("group relative flex flex-col overflow-hidden", wash, tall ? "min-h-72 sm:min-h-80" : "min-h-56")}
    >
      <div className="relative min-h-0 flex-1">
        {second ? (
          <img
            src={productImageVariant(second.image, 320)}
            alt=""
            className="absolute top-6 right-3 w-[42%] object-contain opacity-80 transition-transform duration-300 group-hover:-translate-y-1"
          />
        ) : null}
        {first ? (
          <img
            src={productImageVariant(first.image, 800)}
            alt=""
            className={cn(
              "relative z-[1] object-contain p-4 transition-transform duration-300 group-hover:translate-x-1",
              second ? "w-[62%]" : "h-full w-full",
            )}
          />
        ) : null}
      </div>
      <div className="relative z-[1] flex items-end justify-between gap-3 px-4 pb-4">
        <div>
          <p className="font-display text-2xl sm:text-3xl">{name}</p>
          {blurb ? <p className="mt-1 text-sm text-fg-muted">{blurb}</p> : null}
        </div>
        <p className="font-mono text-xs text-fg-muted">{items.length}</p>
      </div>
    </Link>
  );
}
