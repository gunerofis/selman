import { Link } from "@tanstack/react-router";
import { CATEGORIES, featuredProducts, productSlug } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { useCatalogLines } from "@/lib/catalog-context";

/** Baymard: zero-results is a recovery path, not a dead end. */
export function SearchRecover({ query, onNavigate }: { query?: string; onNavigate?: () => void }) {
  const lines = useCatalogLines();
  const featured = featuredProducts().slice(0, 4);
  return (
    <div className="py-4">
      {query ? (
        <p className="text-sm text-fg-muted">
          “{query}” eşleşmedi. Oda, tasarım veya hazır parçadan devam.
        </p>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2">
        {lines.map((l) => (
          <Link key={l.key} to={l.to} onClick={onNavigate}>
            <Button variant="outline" size="sm">
              {l.kicker}
            </Button>
          </Link>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <Link key={c.id} to="/kategori/$id" params={{ id: c.id }} onClick={onNavigate}>
            <Button variant="outline" size="sm">
              {c.name}
            </Button>
          </Link>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          to="/tasarla"
          search={query?.trim() ? { istek: query.trim() } : undefined}
          onClick={onNavigate}
        >
          <Button size="sm">Tasarlayın</Button>
        </Link>
        {query?.trim() ? (
          <Link to="/teklif" search={{ not: query.trim() }} onClick={onNavigate}>
            <Button variant="outline" size="sm">
              Kurumsal teklif
            </Button>
          </Link>
        ) : null}
        <Link to="/iletisim" onClick={onNavigate}>
          <Button variant="outline" size="sm">
            Yazın
          </Button>
        </Link>
      </div>
      {featured.length > 0 ? (
        <ul className="mt-4 divide-y divide-dashed divide-border border-t border-dashed border-border">
          {featured.map((p) => (
            <li key={p.sku}>
              <Link
                to="/urun/$sku"
                params={{ sku: productSlug(p) }}
                onClick={onNavigate}
                className="flex items-center gap-3 py-3"
              >
                <img
                  src={p.image}
                  alt=""
                  className="size-12 object-contain"
                  width={1500}
                  height={1500}
                />
                <span className="font-display">{p.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
