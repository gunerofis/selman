import { Link } from "@tanstack/react-router";
import type { LineDef } from "@/lib/line-items";

const order: LineDef["key"][] = ["clik", "slac", "desq", "sweb"];

const copy: Record<LineDef["key"], { title: string; description: string }> = {
  clik: {
    title: "Saat ve mücevher kutuları",
    description: "Tekli sunum kutularından çok bölmeli koleksiyon kutularına.",
  },
  slac: {
    title: "Hediye kutuları",
    description: "Kurumsal ve kişisel sunumlar için hazır kutu ve setler.",
  },
  desq: {
    title: "Sümen ve ofis",
    description: "Masa setleri, sümen parçaları ve gerçek deri ofis ürünleri.",
  },
  sweb: {
    title: "Organizerler",
    description: "Ev ve çalışma alanları için deri kaplı düzen ürünleri.",
  },
};

export function ProductFamilyGrid({ lines }: { lines: LineDef[] }) {
  const families = order.flatMap((key) => {
    const line = lines.find((item) => item.key === key);
    if (!line) return [];
    const featured =
      key === "clik"
        ? (line.items.find((item) => item.filter === "saat") ?? line.items[0])
        : line.items[0];
    return featured ? [{ line, featured }] : [];
  });

  return (
    <ul className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
      {families.map(({ line, featured }) => (
        <li key={line.key} className="bg-bg">
          <Link to={line.to} className="group block h-full">
            <div className="overflow-hidden bg-bg-wash">
              <img
                src={featured.image}
                srcSet={featured.imageSrcSet}
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                alt={featured.alt}
                loading="lazy"
                className="aspect-[4/3] w-full object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none"
                width={1500}
                height={1500}
              />
            </div>
            <div className="p-5">
              <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">
                {line.kicker} serisi · {line.items.length} model
              </p>
              <h2 className="mt-2 font-display text-2xl leading-tight group-hover:text-taba">
                {copy[line.key].title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                {copy[line.key].description}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
