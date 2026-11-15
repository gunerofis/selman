import { Link } from "@tanstack/react-router";
import { CatalogImg } from "@/components/catalog-img";
import { minPrice, PRODUCTS, productSlug } from "@/lib/products";
import { cn, formatPrice } from "@/lib/utils";

/** Ad, fiyat ve şişe. Dar sayfaların boş kenarını doldurur. */
export function CatalogShelf({ className, limit = 6 }: { className?: string; limit?: number }) {
  const items = PRODUCTS.slice(0, limit);
  if (!items.length) return null;
  return (
    <ul className={cn("grid grid-cols-2 gap-2", className)}>
      {items.map((product) => (
        <li key={product.sku}>
          <Link
            to="/urun/$sku"
            params={{ sku: productSlug(product) }}
            className="block overflow-hidden rounded-xl bg-bg-wash"
          >
            <CatalogImg
              src={product.image}
              alt=""
              sizes="180px"
              className="aspect-square w-full object-contain p-2"
            />
            <span className="block truncate px-2 font-display text-base leading-tight">{product.name}</span>
            <span className="block px-2 pt-1 pb-2 font-mono text-xs">{formatPrice(minPrice(product))}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
