import type { ComponentProps } from "react";
import { Link } from "@tanstack/react-router";
import { parseOuterDims } from "@/lib/scale";
import type { ColorId, Product } from "@/lib/products";
import { Button } from "@/components/ui/button";

export function ProductRedesignButton({
  product,
  color,
  size = "sm",
  className,
  linkClassName,
  onClick,
}: {
  product: Product;
  color?: ColorId;
  size?: ComponentProps<typeof Button>["size"];
  className?: string;
  linkClassName?: string;
  onClick?: () => void;
}) {
  const dims = parseOuterDims(product);

  return (
    <Link
      to="/tasarla"
      search={{
        en: dims ? String(dims.w) : undefined,
        boy: dims?.d ? String(dims.d) : undefined,
        yuk: dims?.h ? String(dims.h) : undefined,
        renk: color,
        istek: `Organizer yeniden tasarımı: ${product.name} (${product.sku})`,
      }}
      className={linkClassName}
      onClick={onClick}
    >
      <Button variant="outline" size={size} className={className}>
        Bu ürünü yeniden tasarla
      </Button>
    </Link>
  );
}
