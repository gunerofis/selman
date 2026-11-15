import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useCart, type CartCatalogItem } from "@/lib/cart";
import { toastAdded } from "@/lib/cart-toast";
import { cn, formatPrice } from "@/lib/utils";
import { lineDetailTo, type LineDef, type LineItem } from "@/lib/line-items";
import { LIST_STEP, listWindow } from "@/lib/list-window";
import { MoreList } from "@/components/more-list";
import { SITE_ORIGIN } from "@/lib/seo";
import { BuyAssurance } from "@/components/buy-assurance";

export function LineItemLink({
  line,
  id,
  className,
  ariaLabel,
  children,
}: {
  line: LineDef;
  id: string;
  className?: string;
  ariaLabel?: string;
  children: ReactNode;
}) {
  return (
    <Link to={lineDetailTo(line.to)} params={{ id }} className={className} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}

function requiresInquiry(item: Pick<LineItem, "availability">) {
  return item.availability === "out-of-stock" || item.availability === "inquiry-only";
}

export function LineGrid({
  items,
  line,
  mobileLimit,
}: {
  items: LineItem[];
  line: LineDef;
  /** Mobilde bu sayıdan sonraki kartlar gizlenir; sayfa boyunu kısaltır. */
  mobileLimit?: number;
}) {
  const addCatalog = useCart((state) => state.addCatalog);

  return (
    <ul className="mt-8 grid grid-cols-2 gap-px bg-border lg:grid-cols-3">
      {items.map((p, index) => (
        <li
          key={p.id}
          className={cn(
            "flex flex-col bg-bg",
            mobileLimit != null && index >= mobileLimit && "max-sm:hidden",
          )}
        >
          <LineItemLink
            line={line}
            id={p.id}
            className="img-zoom block bg-bg-wash"
            ariaLabel={p.name}
          >
            <img
              src={p.image}
              srcSet={p.imageSrcSet}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              alt={p.alt}
              width={1500}
              height={1125}
              loading="lazy"
              className={cn(
                "aspect-[4/3] w-full",
                p.filter === "mucevher" ? "object-contain" : "object-cover",
              )}
            />
          </LineItemLink>
          <div className="flex flex-1 flex-col p-3 sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs tracking-wide text-fg-muted uppercase">
                {p.code}
              </span>
              <span className="font-mono text-xs tracking-wide text-fg-subtle uppercase">
                {p.kind}
              </span>
            </div>
            <h2 className="mt-2 font-display text-base leading-snug sm:text-xl">
              <LineItemLink line={line} id={p.id} className="hover:text-taba">
                {p.name}
              </LineItemLink>
            </h2>
            {p.tags && p.tags.length > 0 ? (
              <ul className="mt-3 hidden flex-wrap gap-1.5 sm:flex">
                {p.tags.map((tag) => (
                  <li
                    key={tag}
                    className="border border-dashed border-border px-2 py-0.5 font-mono text-xs text-fg-muted"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            ) : null}
            {p.note ? (
              <p className="mt-3 hidden font-mono text-xs text-fg-subtle sm:block">{p.note}</p>
            ) : null}
            <div className="mt-auto flex flex-col gap-3 pt-5">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <span className="font-display text-lg sm:text-2xl">
                    {p.price == null ? "Fiyat teyidi bekliyor" : formatPrice(p.price)}
                  </span>
                  {p.oldPrice != null && p.price != null && p.oldPrice > p.price ? (
                    <span className="ml-2 font-mono text-xs text-fg-subtle line-through">
                      {formatPrice(p.oldPrice)}
                    </span>
                  ) : null}
                  {requiresInquiry(p) ? (
                    <p className="mt-1 font-mono text-xs text-fg-subtle">
                      {p.availability === "inquiry-only"
                        ? "Fiyat ve stok teyidi gerekiyor"
                        : "Stok teyidi gerekiyor"}
                    </p>
                  ) : null}
                </div>
              </div>
              {requiresInquiry(p) ? (
                <Link to="/teklif" search={{ not: p.teklifNot }}>
                  <Button size="sm" className="h-auto min-h-11 w-full px-2 py-2 leading-tight">
                    {p.availability === "inquiry-only"
                      ? "Fiyat ve üretim bilgisini sor"
                      : "Stok ve üretim bilgisini sor"}
                  </Button>
                </Link>
              ) : (
                <div className="grid grid-cols-2 gap-1.5">
                  <Button
                    size="sm"
                    className={cn(
                      "h-auto min-h-11 px-2 py-2 leading-tight",
                      !lineCustomization(line, p) && "col-span-2",
                    )}
                    onClick={() => {
                      addCatalog(toCartItem(line, p));
                      toastAdded(p.name);
                    }}
                  >
                    Sepete Ekle
                  </Button>
                  {lineCustomization(line, p) ? (
                    <Link to="/tasarla" search={{ istek: lineCustomization(line, p)?.brief }}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-auto min-h-11 w-full px-2 py-2 leading-tight"
                      >
                        {lineCustomization(line, p)?.label}
                      </Button>
                    </Link>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function LineShop({
  line,
  initialFilter = "hepsi",
  initialShown,
}: {
  line: LineDef;
  initialFilter?: string;
  initialShown?: number;
}) {
  const validInitialFilter = line.filters.some((item) => item.id === initialFilter)
    ? initialFilter
    : "hepsi";
  const [filter, setFilter] = useState(validInitialFilter);
  const [sort, setSort] = useState<"onerilen" | "fiyat-asc" | "fiyat-desc" | "ad">("onerilen");
  const [shown, setShown] = useState(() => listWindow(initialShown));
  const filtered = line.items.filter(
    (p) => filter === "hepsi" || p.filter === filter || p.filterTags?.includes(filter),
  );
  const list = [...filtered].sort((a, b) => {
    const featuredOrder = Number(b.price === 1850) - Number(a.price === 1850);
    if (featuredOrder !== 0) return featuredOrder;
    if (sort === "ad") return a.name.localeCompare(b.name, "tr");
    if (sort === "fiyat-asc")
      return (a.price ?? Number.POSITIVE_INFINITY) - (b.price ?? Number.POSITIVE_INFINITY);
    if (sort === "fiyat-desc")
      return (b.price ?? Number.NEGATIVE_INFINITY) - (a.price ?? Number.NEGATIVE_INFINITY);
    return 0;
  });
  const windowed = list.slice(0, listWindow(shown));
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: list.length,
    itemListElement: windowed.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: `${SITE_ORIGIN}${line.to}/${encodeURIComponent(item.id)}`,
    })),
  };

  useEffect(() => {
    setShown(listWindow(initialShown));
  }, [initialShown, line.to]);

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">{line.kicker}</p>
      <h1 className="mt-2 font-display text-5xl sm:text-6xl">{line.title}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fg-muted">{line.description}</p>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {line.filters.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setFilter(t.id);
                setShown(LIST_STEP);
              }}
              aria-pressed={filter === t.id}
              className={cn(
                "min-h-11 border border-dashed px-4 py-2 font-mono text-xs tracking-wide uppercase transition-colors",
                filter === t.id
                  ? "border-fg bg-bg-deep text-fg-on-deep"
                  : "border-border text-fg-muted hover:text-fg",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <label className="flex min-h-11 items-center gap-2 text-sm text-fg-muted">
          Sırala
          <select
            value={sort}
            onChange={(event) => {
              setSort(event.target.value as typeof sort);
              setShown(LIST_STEP);
            }}
            className="h-11 border border-border-strong bg-bg-elevated px-3 text-sm text-fg"
          >
            <option value="onerilen">Önerilen</option>
            <option value="fiyat-asc">Fiyat: artan</option>
            <option value="fiyat-desc">Fiyat: azalan</option>
            <option value="ad">İsim</option>
          </select>
        </label>
      </div>
      <p className="mt-6 font-mono text-sm text-fg-muted">{list.length} model</p>
      <LineGrid items={windowed} line={line} />
      <MoreList
        shown={Math.min(windowed.length, list.length)}
        total={list.length}
        onMore={() => setShown((current) => Math.min(current + LIST_STEP, list.length))}
      />
      <div className="mt-12 border border-dashed border-border bg-bg-wash px-6 py-10 text-center">
        <p className="font-display text-2xl sm:text-3xl">Özel üretim ve kurumsal sipariş</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-fg-muted">
          Ölçü, renk ve adet size özel hazırlanır. Kurumsal sipariş için teklif alın.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Link to="/teklif" search={{ not: line.kicker }}>
            <Button size="lg">Teklif alın</Button>
          </Link>
          <Link to="/iletisim">
            <Button variant="outline" size="lg">
              İletişim
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function LineHomeSection({ line }: { line: LineDef }) {
  const [shown, setShown] = useState(6);

  if (line.key === "slac") {
    return (
      <section className="border-t border-dashed border-border py-16">
        <div className="border border-dashed border-border bg-bg-wash px-6 py-12 text-center">
          <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">
            {line.kicker} · Hediye Setleri
          </p>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl">Hediye setleri yenileniyor</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-fg-muted">
            Yeni hediye seti koleksiyonunu hazırlıyoruz. Kurumsal ve özel hediye talepleriniz için
            teklif alın; ölçü, renk ve içerik size özel hazırlanır.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Link to="/teklif" search={{ not: line.kicker }}>
              <Button size="lg">Hediye seti teklifi al</Button>
            </Link>
            <Link to="/iletisim">
              <Button variant="outline" size="lg">
                İletişim
              </Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const items = [...line.items].sort(
    (a, b) => Number(b.price === 1850) - Number(a.price === 1850),
  );
  const windowed = items.slice(0, shown);

  return (
    <section className="border-t border-dashed border-border py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">{line.kicker}</p>
          <h2 className="mt-2 font-display text-4xl sm:text-5xl">{line.title}</h2>
          <p className="mt-2 max-w-2xl text-sm text-fg-muted">
            {line.key === "sweb" ? "Organizer ürün ailesi" : "Sweb ürün ailesi"} ·{" "}
            {line.items.length} model
          </p>
        </div>
        <Link to={line.to} className="text-sm text-fg-muted hover:text-taba">
          Tümü →
        </Link>
      </div>
      <LineGrid items={windowed} line={line} />
      <MoreList
        shown={Math.min(windowed.length, items.length)}
        total={items.length}
        onMore={() => setShown((current) => Math.min(current + LIST_STEP, items.length))}
      />
    </section>
  );
}

export function LineProduct({ line, item }: { line: LineDef; item: LineItem }) {
  const addCatalog = useCart((state) => state.addCatalog);
  const related = line.items
    .filter((p) => p.id !== item.id)
    .sort((a, b) => Number(b.filter === item.filter) - Number(a.filter === item.filter))
    .slice(0, 3);
  const customization = lineCustomization(line, item);
  const productUrl = `${SITE_ORIGIN}${line.to}/${encodeURIComponent(item.id)}`;
  const productDescription =
    item.description ??
    item.seoDescription ??
    `${item.name}, ${line.title.toLocaleLowerCase("tr-TR")} seçkisinde yer alan ${(item.kind ?? "ürün").toLocaleLowerCase("tr-TR")} modelidir.${
      item.tags?.length ? ` Öne çıkan ayrıntılar: ${item.tags.slice(0, 3).join(", ")}.` : ""
    }`;
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: item.name,
    image: new URL(item.image, SITE_ORIGIN).href,
    sku: item.code ?? item.id,
    description: productDescription,
    brand: { "@type": "Brand", name: "Sweb" },
    ...(item.price == null || item.availability === "inquiry-only"
      ? {}
      : {
          offers: {
            "@type": "Offer",
            price: item.price,
            priceCurrency: "TRY",
            availability:
              item.availability === "out-of-stock"
                ? "https://schema.org/OutOfStock"
                : "https://schema.org/InStock",
            url: productUrl,
          },
        }),
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">{line.kicker}</p>
      <h1 className="mt-2 font-display text-5xl sm:text-6xl">{item.name}</h1>
      <p className="mt-3 text-sm text-fg-muted">
        <Link to={line.to} className="text-taba hover:underline">
          {line.title}
        </Link>
        {item.kind ? ` · ${item.kind}` : ""}
        {item.code ? ` · ${item.code}` : ""}
      </p>
      <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="bg-bg-wash">
          <img
            src={item.image}
            srcSet={item.imageSrcSet}
            sizes="(min-width: 1024px) 55vw, 100vw"
            alt={item.alt}
            width={1500}
            height={1125}
            className={cn(
              "aspect-[4/3] w-full",
              item.filter === "mucevher" ? "object-contain" : "object-cover",
            )}
          />
        </div>
        <div className="flex flex-col">
          {item.tags && item.tags.length > 0 ? (
            <ul className="mt-6 flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <li
                  key={tag}
                  className="border border-dashed border-border px-2 py-0.5 font-mono text-xs text-fg-muted"
                >
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-fg-muted">
            {productDescription}
          </p>
          {item.note ? <p className="mt-4 font-mono text-sm text-fg-subtle">{item.note}</p> : null}
          {item.details?.length ? (
            <dl className="mt-6 grid gap-px bg-border">
              {item.details.map((detail) => (
                <div
                  key={detail.label}
                  className="grid gap-1 bg-bg-elevated px-4 py-3 sm:grid-cols-[10rem_1fr] sm:gap-4"
                >
                  <dt className="text-sm text-fg-muted">{detail.label}</dt>
                  <dd className="text-sm">{detail.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          <div className="mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <p className="font-display text-3xl">
              {item.price == null ? "Fiyat teyidi bekliyor" : formatPrice(item.price)}
            </p>
            {item.oldPrice != null && item.price != null && item.oldPrice > item.price ? (
              <p className="font-mono text-sm text-fg-subtle line-through">
                {formatPrice(item.oldPrice)}
              </p>
            ) : null}
          </div>
          {item.price != null ? <p className="mt-1 text-xs text-fg-muted">KDV dahil</p> : null}
          <div className="mt-6 flex flex-wrap gap-2">
            {requiresInquiry(item) ? (
              <Link to="/teklif" search={{ not: item.teklifNot }}>
                <Button size="lg">
                  {item.availability === "inquiry-only"
                    ? "Fiyat ve üretim bilgisini sor"
                    : "Stok ve üretim bilgisini sor"}
                </Button>
              </Link>
            ) : (
              <Button
                size="lg"
                onClick={() => {
                  addCatalog(toCartItem(line, item));
                  toastAdded(item.name);
                }}
              >
                Sepete Ekle
              </Button>
            )}
            {customization ? (
              <Link to="/tasarla" search={{ istek: customization.brief }}>
                <Button variant="outline" size="lg">
                  {customization.label}
                </Button>
              </Link>
            ) : null}
            <Link to={line.to}>
              <Button variant="outline" size="lg">
                Listeye dön
              </Button>
            </Link>
          </div>
          {line.key === "clik" ? (
            <div className="mt-6 border border-dashed border-border bg-bg-elevated p-4">
              <p className="font-display text-lg">Renk ve iç kumaş</p>
              <p className="mt-1 text-sm text-fg-muted">
                {item.color
                  ? `Bu karttaki ürün ${item.color.toLocaleLowerCase("tr-TR")} renk varyantıdır. İç kumaş, üretim imkânı ve farklı renk seçenekleri sipariş öncesi teyit edilir.`
                  : "Bu modelin dış rengi ve iç kumaşı siparişe özel üretilir. Tercihinizi teklif formundaki nota yazın; üretim öncesi yazılı olarak teyit edilir."}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  to="/teklif"
                  search={{ not: `${item.code ?? item.name} · renk ve iç kumaş tercihi: ` }}
                >
                  <Button variant="outline" size="sm">
                    Renk ve iç kumaş seç
                  </Button>
                </Link>
                <Link to="/palet">
                  <Button variant="outline" size="sm">
                    Renk paletini gör
                  </Button>
                </Link>
              </div>
            </div>
          ) : null}
          {!requiresInquiry(item) ? (
            <div className="mt-6">
              <BuyAssurance price={item.price ?? undefined} madeToOrder={line.key === "clik"} />
            </div>
          ) : (
            <p className="mt-6 border border-dashed border-border bg-bg-wash p-4 text-sm text-fg-muted">
              {item.availability === "inquiry-only"
                ? "Bu model için güncel fiyat, stok ve üretim süresi teklif aşamasında yazılı olarak teyit edilir."
                : "Bu model kaynak envanterde stok dışı görünüyor. Güncel stok veya yeniden üretim süresi teklif aşamasında yazılı olarak teyit edilir."}
            </p>
          )}
        </div>
      </div>
      {related.length > 0 ? (
        <div className="mt-16">
          <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">Aynı hattan</p>
          <h2 className="mt-2 font-display text-3xl">Yakın modeller</h2>
          <LineGrid items={related} line={line} />
        </div>
      ) : null}
      <div className="mt-12 border border-dashed border-border bg-bg-wash px-6 py-10 text-center">
        <p className="font-display text-2xl sm:text-3xl">Özel üretim ve kurumsal sipariş</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-fg-muted">
          Ölçü, renk ve adet size özel hazırlanır. Kurumsal sipariş için teklif alın.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Link to="/teklif" search={{ not: item.teklifNot }}>
            <Button size="lg">Teklif alın</Button>
          </Link>
          <Link to="/iletisim">
            <Button variant="outline" size="lg">
              İletişim
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function lineCustomization(line: LineDef, item: LineItem) {
  if (line.key === "sweb") {
    return {
      label: "Bu ürünü yeniden tasarla",
      brief: `Organizer yeniden tasarımı: ${item.name} (${item.code ?? item.id})`,
    };
  }
  if (line.key === "slac") {
    return {
      label: "Bu ürünü özelleştir",
      brief: `Hediye kutusu özelleştirmesi: ${item.name} (${item.code ?? item.id})`,
    };
  }
  return null;
}

function toCartItem(line: LineDef, item: LineItem): CartCatalogItem {
  return {
    lineKey: line.key,
    itemId: item.id,
    path: line.to,
    name: item.name,
    image: item.image,
    price: item.price,
    code: item.code,
    kind: item.kind,
  };
}
