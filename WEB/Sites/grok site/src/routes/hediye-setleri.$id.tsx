import { createFileRoute, notFound } from "@tanstack/react-router";
import { LineProduct } from "@/components/line-catalog";
import { findLineItem } from "@/lib/line-items";
import { pageHead } from "@/lib/seo";

const TO = "/hediye-setleri" as const;

export const Route = createFileRoute("/hediye-setleri/$id")({
  component: Page,
  head: ({ params }) => {
    const found = findLineItem(TO, params.id);
    return pageHead({
      title: found?.item.name ?? "Parça",
      description: found ? `${found.line.kicker} · ${found.item.name}` : undefined,
      path: `${TO}/${params.id}`,
    });
  },
});

function Page() {
  const { id } = Route.useParams();
  const found = findLineItem(TO, id);
  if (!found) throw notFound();
  return <LineProduct line={found.line} item={found.item} />;
}
