import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { cn, formatPrice } from "@/lib/utils";
import { lineDetailTo, type LineDef, type LineItem } from "@/lib/line-items";
import { LIST_STEP, listWindow } from "@/lib/list-window";
import { MoreList } from "@/components/more-list";

export function LineItemLink({
  line,
  id,
  className,
  children,
}: {
  line: LineDef;
  id: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link to={lineDetailTo(line.to)} params={{ id }} className={className}>
      {children}
    </Link>
  );
}

export function LineGrid({ items, line }: { items: LineItem[]; line: LineDef }) {
  return (
    <ul className="mt-8 grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p) => (
        <li key={p.id} className="flex flex-col bg-bg">
          <LineItemLink line={line} id={p.id} className="img-zoom block bg-bg-wash">
            <img
              src={p.image}
              alt={p.alt}
              loading="lazy"
              className="aspect-[4/3] w-full object-contain p-3"
            />
          </LineItemLink>
          <div className="flex flex-1 flex-col p-5">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs tracking-wide text-fg-muted uppercase">
                {p.code}
              </span>
              <span className="font-mono text-[11px] tracking-wide text-fg-subtle uppercase">
                {p.kind}
              </span>
            </div>
            <h2 className="mt-2 font-display text-xl leading-snug">
              <LineItemLink line={line} id={p.id} className="hover:text-taba">
                {p.name}
              </LineItemLink>
            </h2>
            {p.tags && p.tags.length > 0 ? (
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {p.tags.map((tag) => (
                  <li
                    key={tag}
                    className="border border-dashed border-border px-2 py-0.5 font-mono text-[11px] text-fg-muted"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            ) : null}
            {p.note ? (
              <p className="mt-3 font-mono text-xs text-fg-subtle">{p.note}</p>
            ) : null}
            <div className="mt-auto flex items-end justify-between gap-3 pt-5">
              <span className="font-display text-2xl">{formatPrice(p.price)}</span>
              <Link to="/teklif" search={{ not: p.teklifNot }}>
                <Button variant="outline" size="sm">
                  Teklif iste
                </Button>
              </Link>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function LineShop({ line }: { line: LineDef }) {
  const [filter, setFilter] = useState("hepsi");
  const [shown, setShown] = useState(LIST_STEP);
  const list = line.items.filter((p) => filter === "hepsi" || p.filter === filter);
  const windowed = list.slice(0, listWindow(shown));

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10">
      <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">{line.kicker}</p>
      <h1 className="mt-2 font-display text-5xl sm:text-6xl">{line.title}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fg-muted">{line.description}</p>
      <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
        {line.features.map((f) => (
          <span key={f} className="font-mono text-[11px] tracking-wide text-fg-subtle uppercase">
            · {f}
          </span>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
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
              "border border-dashed px-4 py-2 font-mono text-xs tracking-wide uppercase transition-colors",
              filter === t.id
                ? "border-fg bg-bg-deep text-fg-on-deep"
                : "border-border text-fg-muted hover:text-fg",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <p className="mt-6 font-mono text-sm text-fg-muted">{list.length} model</p>
      <LineGrid items={windowed} line={line} />
      <MoreList
        shown={Math.min(windowed.length, list.length)}
        total={list.length}
        onMore={() => setShown((n) => n + LIST_STEP)}
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
  const preview = line.items.slice(0, 6);
  return (
    <section className="border-t border-dashed border-border py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">{line.kicker}</p>
          <h2 className="mt-2 font-display text-4xl sm:text-5xl">{line.title}</h2>
          <p className="mt-2 max-w-2xl text-sm text-fg-muted">
            {line.items.length} model
          </p>
        </div>
        <Link to={line.to} className="text-sm text-fg-muted hover:text-taba">
          Tümü →
        </Link>
      </div>
      <LineGrid items={preview} line={line} />
    </section>
  );
}

export function LineProduct({ line, item }: { line: LineDef; item: LineItem }) {
  const related = line.items
    .filter((p) => p.id !== item.id)
    .sort((a, b) => Number(b.filter === item.filter) - Number(a.filter === item.filter))
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10">
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
            alt={item.alt}
            className="aspect-[4/3] w-full object-contain p-6"
          />
        </div>
        <div className="flex flex-col">
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            {line.features.map((f) => (
              <span key={f} className="font-mono text-[11px] tracking-wide text-fg-subtle uppercase">
                · {f}
              </span>
            ))}
          </div>
          {item.tags && item.tags.length > 0 ? (
            <ul className="mt-6 flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <li
                  key={tag}
                  className="border border-dashed border-border px-2 py-0.5 font-mono text-[11px] text-fg-muted"
                >
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
          {item.note ? (
            <p className="mt-4 font-mono text-sm text-fg-subtle">{item.note}</p>
          ) : null}
          <p className="mt-8 font-display text-3xl">{formatPrice(item.price)}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link to="/teklif" search={{ not: item.teklifNot }}>
              <Button size="lg">Teklif iste</Button>
            </Link>
            <Link to={line.to}>
              <Button variant="outline" size="lg">
                Listeye dön
              </Button>
            </Link>
          </div>
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
