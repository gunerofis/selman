import { createFileRoute } from "@tanstack/react-router";
import { LineShop } from "@/components/line-catalog";
import { useCatalogLine } from "@/lib/catalog-context";
import { pageHead } from "@/lib/seo";
import { parseListWindow } from "@/lib/list-window";

type Search = {
  tur?: "saat" | "mucevher" | "gercek-deri";
  goster?: number;
};

export const Route = createFileRoute("/saat-mucevher-kutulari/")({
  validateSearch: (raw: Record<string, unknown>): Search => ({
    tur:
      raw.tur === "saat" || raw.tur === "mucevher" || raw.tur === "gercek-deri"
        ? (raw.tur as Search["tur"])
        : undefined,
    goster: parseListWindow(raw.goster),
  }),
  component: Page,
  head: () =>
    pageHead({
      title: "CLIK · Saat ve Mücevher Kutuları",
      description:
        "MDF üzeri deri kaplama saat ve mücevher kutuları. Tekli saat sunum kutusundan çok bölmeli koleksiyon kutusuna.",
      path: "/saat-mucevher-kutulari",
    }),
});

function Page() {
  const { tur, goster } = Route.useSearch();
  return (
    <LineShop
      line={useCatalogLine("/saat-mucevher-kutulari")}
      initialFilter={tur}
      initialShown={goster}
    />
  );
}
