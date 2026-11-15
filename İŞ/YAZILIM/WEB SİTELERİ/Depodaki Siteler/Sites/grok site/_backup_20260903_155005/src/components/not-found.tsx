import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { RecentRail } from "@/components/recent-rail";
import { SearchRecover } from "@/components/search-recover";

export function AppNotFound() {
  return (
    <>
      <title>Sayfa bulunamadı — Sweb</title>
      <meta name="robots" content="noindex, nofollow" />
      <div className="mx-auto flex min-h-80 max-w-lg flex-col items-center justify-center gap-4 px-4 py-20 text-center">
        <p className="font-mono text-[11px] tracking-wide text-fg-muted uppercase">404</p>
        <h1 className="font-display text-4xl">Bu parça yok</h1>
        <p className="text-sm text-fg-muted">Sayfa taşınmış ya da kod hatalı olabilir.</p>
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          <Link to="/koleksiyon">
            <Button>Ürünler</Button>
          </Link>
          <Link to="/kategori">
            <Button variant="outline">Odalar</Button>
          </Link>
          <Link to="/tasarla">
            <Button variant="outline">Tasarlayın</Button>
          </Link>
          <Link to="/son">
            <Button variant="outline">Son baktıklarınız</Button>
          </Link>
        </div>
        <SearchRecover />
      </div>
      <div className="mx-auto max-w-[1400px] px-4 pb-16">
        <RecentRail heading="Son baktıklarınız" />
      </div>
    </>
  );
}
