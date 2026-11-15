import { COLORS, type ColorId } from "@/lib/products";
import { cn } from "@/lib/utils";

type Props = {
  value: ColorId | "";
  onChange: (id: ColorId) => void;
  named?: boolean;
};

export function ColorSwatches({ value, onChange, named = false }: Props) {
  return (
    <div className="flex flex-wrap" role="radiogroup" aria-label="Renk">
      {COLORS.map((c) => {
        const selected = c.id === value;
        return (
          <button
            key={c.id}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={c.name}
            title={c.name}
            onClick={() => onChange(c.id)}
            className={cn(
              "flex items-center justify-center",
              named ? "h-14 min-w-14 flex-col gap-1 px-1" : "size-11",
            )}
          >
            <span
              className={cn(
                "swatch-dot border border-border-strong",
                named ? "size-6" : "size-5",
                selected && "is-on outline-2 outline-offset-2 outline-taba",
              )}
              style={{ backgroundColor: c.swatch }}
            />
            {named ? (
              <span className={cn("font-mono text-xs", selected ? "text-fg" : "text-fg-muted")}>
                {c.name}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

export function ColorDot({ id, className }: { id: ColorId; className?: string }) {
  const c = COLORS.find((x) => x.id === id);
  return (
    <span
      className={cn("inline-block size-3 border border-border-strong", className)}
      style={{ backgroundColor: c?.swatch }}
      title={c?.name}
    />
  );
}
