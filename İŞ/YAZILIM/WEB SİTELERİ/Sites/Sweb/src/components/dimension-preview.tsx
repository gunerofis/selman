import { COLORS, PASTEL, type ColorId } from "@/lib/products";
import { cn } from "@/lib/utils";

export function DimensionPreview({
  widthMm,
  depthMm,
  heightMm,
  color,
  note = "Oran canlıdır; fiyat tahmini gönderince çıkar.",
}: {
  widthMm: string;
  depthMm: string;
  heightMm: string;
  color: ColorId | "";
  note?: string;
}) {
  const w = clamp(Number(widthMm) || 280);
  const d = clamp(Number(depthMm) || 180);
  const h = clamp(Number(heightMm) || 90);
  const max = Math.max(w, d, h);
  const wash = color ? PASTEL[color] : "var(--color-bg-wash)";
  const edge = color ? COLORS.find((c) => c.id === color)?.swatch : "var(--color-border-strong)";

  return (
    <div className="border border-dashed border-border bg-bg-elevated p-5">
      <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">Ölçü taslağı</p>
      <p className="mt-1 font-mono text-sm">
        {w} × {d} × {h} mm
      </p>
      <div className="mt-4 flex h-40 items-end justify-center">
        <div className="relative">
          <div
            className="absolute border border-dashed border-border"
            style={{
              width: `${(w / max) * 180}px`,
              height: `${(h / max) * 140}px`,
              left: `${(d / max) * 14}px`,
              top: `${(d / max) * -10}px`,
            }}
            aria-hidden
          />
          <div
            className={cn("wash-shift relative border")}
            style={{
              width: `${(w / max) * 180}px`,
              height: `${(h / max) * 140}px`,
              backgroundColor: wash,
              borderColor: edge,
            }}
          />
        </div>
      </div>
      <p className="mt-3 text-xs text-fg-muted">{note}</p>
    </div>
  );
}

function clamp(n: number) {
  if (!Number.isFinite(n)) return 180;
  return Math.min(900, Math.max(80, Math.round(n)));
}
