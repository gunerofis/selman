import { Link } from "@tanstack/react-router";
import type { CategoryId, ColorId, Product } from "@/lib/products";
import { parseOuterDims, scaleShare } from "@/lib/scale";

const PLACE: Record<CategoryId, string> = {
  ofis: "Masa kenarı, monitör önü veya evrak sırası.",
  banyo: "Lavabo kenarı; ıslak yüzeyde damlama tepsisini kullanın.",
  makyaj: "Ayna önü veya çekmece içi.",
  mutfak: "Tezgâh sırası veya çekmece.",
  gardrop: "Komodin, bank üstü, raf.",
  giris: "Konsol, oturak yanı, anahtarlık.",
  cocuk: "Çocuk odası rafı, oyun köşesi veya kitaplık.",
  yasam: "Sehpa, vitrin, koltuk yanı.",
  arac: "Koltuk arkası cepleri.",
};

export function PlaceLine({ category }: { category: CategoryId }) {
  return <p className="text-sm text-fg-muted">{PLACE[category]}</p>;
}

/** Baymard furniture: measurements mapped onto a diagram, not a number list alone. */
export function DimDiagram({ product }: { product: Product }) {
  const dims = parseOuterDims(product);
  if (!dims) return null;
  const { w, d, h } = dims;
  const boxW = d ? Math.max(48, Math.min(160, Math.round((w / Math.max(w, d)) * 160))) : 120;
  const boxH = d ? Math.max(32, Math.min(100, Math.round((d / Math.max(w, d)) * 100))) : 56;

  return (
    <div className="mt-4">
      <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">G × D × Y</p>
      <div className="mt-3 flex flex-col items-center gap-1">
        {d ? <p className="font-mono text-xs text-fg-muted">D {d} mm</p> : null}
        <div
          className="border border-dashed border-border-strong bg-bg-wash"
          style={{ width: boxW, height: boxH }}
          aria-hidden
        />
        <p className="font-mono text-xs text-fg-muted">G {w} mm</p>
        {h ? <p className="font-mono text-xs text-fg-muted">Y {h} mm</p> : null}
      </div>
    </div>
  );
}

export function ScaleHint({ product, color }: { product: Product; color?: ColorId }) {
  const share = scaleShare(product);
  const dims = parseOuterDims(product);
  if (!share && !dims) return null;
  const pct = share ? Math.min(100, Math.max(8, Math.round(share.ratio * 100))) : 0;
  return (
    <div className="mt-4 border-t border-dashed border-border pt-4">
      {share ? (
        <>
          <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">Yerde kapladığı</p>
          <p className="mt-1 text-sm text-fg-muted">{share.text}</p>
          {share.ratio < 1 ? (
            <div className="mt-3 h-2 border border-dashed border-border" aria-hidden>
              <div className="h-full bg-taba" style={{ width: `${pct}%` }} />
            </div>
          ) : null}
        </>
      ) : null}
      <p className="mt-2 flex flex-wrap gap-x-3 text-xs">
        <Link to="/olcu" className="text-taba hover:underline">
          Ölçü rehberi
        </Link>
        <Link
          to="/tasarla"
          search={{
            en: dims ? String(dims.w) : undefined,
            boy: dims?.d ? String(dims.d) : undefined,
            yuk: dims?.h ? String(dims.h) : undefined,
            renk: color,
          }}
          className="text-taba hover:underline"
        >
          Bu ölçüyle tasarlayın
        </Link>
      </p>
    </div>
  );
}
