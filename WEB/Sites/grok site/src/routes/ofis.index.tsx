import { createFileRoute } from "@tanstack/react-router";
import { LineShop } from "@/components/line-catalog";
import { lineByPath } from "@/lib/line-items";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/ofis/")({
  component: Page,
  head: () =>
    pageHead({
      title: "DESQ · Lüks Ofis Ürünleri",
      description:
        "Deri kaplı lüks ofis ürünleri — masa setleri, organizer, sümen ve yönetici aksesuarları.",
      path: "/ofis",
    }),
});

function Page() {
  return <LineShop line={lineByPath("/ofis")} />;
}
