import { createFileRoute } from "@tanstack/react-router";
import { LineShop } from "@/components/line-catalog";
import { lineByPath } from "@/lib/line-items";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/organizer/")({
  component: Page,
  head: () =>
    pageHead({
      title: "Deri Organizer Koleksiyonu",
      description:
        "Deri kaplı düzen ve organize gereçleri — ofis, banyo, mutfak, makyaj, giriş ve daha fazlası. Sekiz renk.",
      path: "/organizer",
    }),
});

function Page() {
  return <LineShop line={lineByPath("/organizer")} />;
}
