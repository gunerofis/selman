import { createFileRoute } from "@tanstack/react-router";
import { LineShop } from "@/components/line-catalog";
import { lineByPath } from "@/lib/line-items";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/saat-mucevher-kutulari/")({
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
  return <LineShop line={lineByPath("/saat-mucevher-kutulari")} />;
}
