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
  const selectedColor = COLORS.find((color) => color.id === value);

  return (
    <div>
      <div
        className="flex flex-wrap items-center gap-1"
        role="radiogroup"
        aria-label={label ?? "Renk"}
      >
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
              className={cn(
                "flex size-10 items-center justify-center border",
                on ? "border-taba bg-bg-wash" : "border-transparent hover:border-border",
              )}
            >
              <span
                className={cn(
                  "swatch-dot size-5 border border-border-strong",
                  on && "is-on outline-2 outline-offset-2 outline-taba",
                )}
                style={{ backgroundColor: c.swatch }}
              />
            </button>
          );
        })}
      </div>
      <p className="mt-1 font-mono text-xs text-fg-muted" aria-live="polite">
        Seçili renk: <span className="text-fg">{selectedColor?.name ?? value}</span>
      </p>
    </div>
  );
}
