import { createFileRoute, notFound } from "@tanstack/react-router";
import { LineProduct } from "@/components/line-catalog";
import { findLineItem } from "@/lib/line-items";
import { useCatalogItem } from "@/lib/catalog-context";
import { pageHead } from "@/lib/seo";
import { getPublicLines } from "@/lib/catalog-admin";

const TO = "/urunler" as const;

export const Route = createFileRoute("/urunler/$id")({
  loader: async ({ params }) => {
    const item = (await getPublicLines())
      .find((line) => line.to === TO)
      ?.items.find((entry) => entry.id === params.id);
    if (!item) throw notFound();
    return item;
  },
  component: Page,
  head: ({ params, loaderData }) => {
    if (!loaderData) return {};
    const found = findLineItem(TO, params.id);
    return pageHead({
      title: loaderData?.seoTitle ?? found?.item.name ?? "Parça",
      description:
        loaderData?.seoDescription ??
        (found ? `${found.line.kicker} · ${found.item.name}` : undefined),
      image: loaderData?.image ?? found?.item.image,
      path: `${TO}/${params.id}`,
      noindex: params.id.startsWith("tas-") || loaderData.price == null,
    });
  },
});

function Page() {
  const { id } = Route.useParams();
  const found = useCatalogItem(TO, id);
  if (!found) throw notFound();
  return <LineProduct line={found.line} item={found.item} />;
}
