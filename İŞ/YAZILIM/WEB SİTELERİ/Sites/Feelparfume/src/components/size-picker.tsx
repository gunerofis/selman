import { productSizes, type Product } from "@/lib/products";
import { formatPrice, cn } from "@/lib/utils";

export function SizePicker({
  product,
  value,
  onChange,
}: {
  product: Product;
  value: string;
  onChange: (id: string) => void;
}) {
  const sizes = productSizes(product);
  if (sizes.length === 1 && sizes[0].id === "tek") return null;
  return (
    <div className="scroll-mb-[calc(6rem+var(--cookie-h,0px))]">
      <p className="mb-3 text-sm">Hacim</p>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Hacim">
        {sizes.map((s) => {
          const on = s.id === value;
          const out = s.stockStatus === "tukendi";
          return (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={on}
              aria-label={out ? `${s.ml} ml, tükendi` : `${s.ml} ml`}
              onClick={() => onChange(s.id)}
              className={cn(
                "flex min-h-14 min-w-24 flex-col items-start justify-center rounded-lg border px-3 py-2 text-left",
                on ? "border-fg bg-fg text-bg-elevated" : "border-border-strong hover:border-fg",
                out && "line-through",
              )}
            >
              <span className="font-mono text-sm">
                {s.ml} ml{s.sample ? " · deneme" : ""}
              </span>
              <span className={cn("font-mono text-xs", on ? "text-bg-elevated/80" : "text-fg-muted")}>
                {formatPrice(s.price)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
