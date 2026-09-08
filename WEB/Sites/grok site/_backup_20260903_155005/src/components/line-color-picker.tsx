import { COLORS, type ColorId } from "@/lib/products";
import { cn } from "@/lib/utils";

export function LineColorPicker({
  value,
  onChange,
  label,
}: {
  value: ColorId;
  onChange: (id: ColorId) => void;
  label?: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-0.5" role="radiogroup" aria-label={label ?? "Renk"}>
      {COLORS.map((c) => {
        const on = c.id === value;
        return (
          <button
            key={c.id}
            type="button"
            role="radio"
            aria-checked={on}
            aria-label={c.name}
            title={c.name}
            onClick={() => onChange(c.id)}
            className="flex size-7 items-center justify-center"
          >
            <span
              className={cn(
                "swatch-dot size-2.5 border border-border-strong",
                on && "is-on outline-1 outline-offset-1 outline-taba",
              )}
              style={{ backgroundColor: c.swatch }}
            />
          </button>
        );
      })}
    </div>
  );
}
