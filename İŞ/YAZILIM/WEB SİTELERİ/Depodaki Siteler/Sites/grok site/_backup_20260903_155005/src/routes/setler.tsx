import { createFileRoute, Link } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { SeriesCards } from "@/components/series-cards";
import { Button } from "@/components/ui/button";
import { COLOR_WASH_HINT } from "@/lib/products";
import { usePrefs } from "@/lib/prefs";
import { ColorSwatches } from "@/components/color-swatch";
import { OpenBadge } from "@/components/open-badge";
import { KitBreakdown } from "@/components/kit-breakdown";
import { COLORS } from "@/lib/products";

export const Route = createFileRoute("/setler")({
  component: SetsPage,
  head: () =>
    pageHead({
      title: "Ofis setleri",
      description: "Kompakt, aksesuar, yönetici. Tek renk kit.",
      path: "/setler",
    }),
});

function SetsPage() {
  const lastColor = usePrefs((s) => s.lastColor);
  const rememberColor = usePrefs((s) => s.rememberColor);
  const colorName = COLORS.find((c) => c.id === lastColor)?.name;
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10">
      <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">Ofis</p>
      <h1 className="mt-2 font-display text-5xl sm:text-6xl">Ofis setleri</h1>
      <p className="mt-3 max-w-xl text-sm text-fg-muted">
        Üç kit. Aynı renk, tek sepet. Parçalar ayrı da satılır. {COLOR_WASH_HINT}
      </p>
      <div className="mt-3">
        <OpenBadge />
      </div>
      <div className="mt-6">
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <p className="text-sm">Kit rengi</p>
          <p className="font-mono text-sm text-fg-muted">{colorName}</p>
        </div>
        <ColorSwatches value={lastColor} onChange={rememberColor} />
      </div>
      <div className="mt-10">
        <SeriesCards color={lastColor} />
      </div>
      <KitBreakdown color={lastColor} />
      <div className="mt-10 flex flex-wrap gap-2">
        <Link to="/koleksiyon" search={{ kategori: "ofis" }}>
          <Button variant="outline">Tüm ofis parçaları</Button>
        </Link>
        <Link to="/tasarla" search={{ istek: "Ofis seti, ölçüye göre", renk: lastColor }}>
          <Button>Ölçüye göre tasarlayın</Button>
        </Link>
        <Link to="/teklif" search={{ not: "Ofis setleri", renk: lastColor }}>
          <Button variant="outline">Kurumsal teklif</Button>
        </Link>
      </div>
    </div>
  );
}
