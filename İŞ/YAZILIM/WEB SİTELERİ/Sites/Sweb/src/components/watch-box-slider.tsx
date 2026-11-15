import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCatalogLine } from "@/lib/catalog-context";

export function WatchBoxSlider() {
  const line = useCatalogLine("/saat-mucevher-kutulari");
  const featured =
    line.items.find((item) => item.price === 1850 && item.id === "gnrs06-bordo") ??
    line.items.find((item) => item.price === 1850);

  if (!featured) return null;

  return (
    <section className="border-b border-dashed border-border bg-bg-wash px-4 py-8 sm:py-12">
      <div className="mx-auto grid max-w-[1400px] overflow-hidden border border-dashed border-border bg-bg-elevated lg:grid-cols-[0.86fr_1.14fr]">
        <div className="flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-14 lg:px-14">
          <p className="font-mono text-xs tracking-wide text-taba uppercase">1850 TL özel seri</p>
          <h1 className="mt-3 max-w-xl font-display text-4xl leading-[0.96] sm:text-6xl">
            Saatlerinize düzenli bir vitrin
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-fg-muted sm:text-base">
            Cam kapaklı, kadife iç yüzeyli saat kutuları; koleksiyonunuzu düzenli tutmak ve
            görünür biçimde sergilemek için.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              to="/saat-mucevher-kutulari"
              search={{ tur: "saat" }}
              className="inline-flex min-h-11 items-center gap-2 bg-bg-deep px-5 py-3 text-sm font-medium text-fg-on-deep"
            >
              1850 TL ürünleri incele <ArrowRight className="size-4" aria-hidden />
            </Link>
            <p className="font-display text-2xl tabular-nums">{formatPrice(featured.price!)}</p>
          </div>
        </div>

        <Link
          to="/saat-mucevher-kutulari/$id"
          params={{ id: featured.id }}
          className="relative flex min-h-[20rem] items-center justify-center border-t border-dashed border-border bg-bg-wash p-4 sm:min-h-[30rem] sm:p-8 lg:border-t-0 lg:border-l"
          aria-label={`${featured.name} ürününü incele`}
        >
          <img
            src={featured.image}
            srcSet={featured.imageSrcSet}
            sizes="(min-width: 1024px) 58vw, 100vw"
            alt={featured.alt}
            width={960}
            height={720}
            fetchPriority="high"
            className="max-h-[34rem] w-full object-contain"
          />
        </Link>
      </div>
    </section>
  );
}
