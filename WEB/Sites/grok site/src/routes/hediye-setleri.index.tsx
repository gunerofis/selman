import { createFileRoute } from "@tanstack/react-router";
import { LineShop } from "@/components/line-catalog";
import { lineByPath } from "@/lib/line-items";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/hediye-setleri/")({
  component: Page,
  head: () =>
    pageHead({
      title: "SLAC · Hediye Setleri",
      description:
        "İçi hediye dolu, deri kaplı MDF VIP giftbox'lar. Kurumsal ve özel gün için hazır hediye setleri ve tekli kutular.",
      path: "/hediye-setleri",
    }),
});

function Page() {
  return <LineShop line={lineByPath("/hediye-setleri")} />;
}
