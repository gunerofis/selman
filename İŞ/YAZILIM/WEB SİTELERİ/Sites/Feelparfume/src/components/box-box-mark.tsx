import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { ChevronDown, Menu, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSiteConfig } from "@/lib/site-config-context";

const EXACT_NAV = new Set(["/kategori", "/marka", "/nota", "/koleksiyon"]);

function isRouteActive(pathname: string, to: string) {
  if (to === "/") return pathname === "/";
  if (pathname === to) return true;
  if (EXACT_NAV.has(to)) return false;
  return pathname.startsWith(`${to}/`);
}

export function BoxBoxMark({ start, end }: { start: ReactNode; end: ReactNode }) {
  const siteConfig = useSiteConfig();
  const navItems = buildNav(siteConfig.links);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [openItem, setOpenItem] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpenItem(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpenItem(null);
        setMobileOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenItem(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  const itemClass = (active: boolean, open = false) =>
    cn(
      "flex min-h-11 items-center gap-1 rounded-full px-3 text-sm text-fg/80 transition-colors duration-150 hover:bg-bg-wash hover:text-fg focus-visible:bg-bg-wash focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
      (active || open) && "bg-bg-wash text-fg",
      active && "text-accent",
    );

  return (
    <div ref={rootRef} className="boxbox-bar relative text-fg">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-3 px-2 sm:px-4">
        <div className="flex min-w-0 shrink-0 items-center">{start}</div>
        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex" aria-label="Ana menü">
          {navItems.map((item, index) => {
            const links = "links" in item ? item.links : null;
            const directTo = "to" in item ? item.to : null;
            const active = links
              ? links.some(({ to }) => isRouteActive(pathname, to))
              : directTo !== null && isRouteActive(pathname, directTo);

            if (directTo) {
              return (
                <a
                  key={item.label}
                  href={directTo}
                  aria-current={active ? "page" : undefined}
                  className={itemClass(active)}
                >
                  {item.label === "Kendin Tasarla" ? <Sparkles className="size-4" aria-hidden /> : null}
                  {item.label}
                </a>
              );
            }

            const open = openItem === index;
            const columns = open && links ? columnsFor(item.label, links) : null;
            return (
              <div key={item.label} className="relative">
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={`site-menu-${index}`}
                  onClick={() => setOpenItem(open ? null : index)}
                  className={itemClass(active, open)}
                >
                  <span>{item.label}</span>
                  <ChevronDown
                    className={cn(
                      "size-4 shrink-0 transition-transform duration-150 motion-reduce:transition-none",
                      open && "rotate-180",
                    )}
                  />
                </button>
                {columns ? (
                  <div
                    id={`site-menu-${index}`}
                    className={cn(
                      "absolute top-[calc(100%+0.35rem)] left-1/2 z-50 max-h-[70dvh] -translate-x-1/2 overflow-y-auto rounded-2xl border border-solid border-border bg-bg-elevated p-5 shadow-[0_18px_40px_rgba(35,30,26,0.08)]",
                      columns.length > 1 ? "w-[min(40rem,calc(100vw-2rem))]" : "w-64",
                    )}
                  >
                    <div
                      className="grid gap-6"
                      style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
                    >
                      {columns.map((column) => (
                        <div key={column.title || "links"}>
                          {column.title ? (
                            <p className="px-2 font-mono text-[11px] tracking-wide text-fg-muted uppercase">{column.title}</p>
                          ) : null}
                          <div className={column.title ? "mt-1" : undefined}>
                            {column.links.map((link) => {
                              const linkActive = isRouteActive(pathname, link.to);
                              return (
                                <a
                                  key={link.to}
                                  href={link.to}
                                  aria-current={linkActive ? "page" : undefined}
                                  className={cn(
                                    "flex min-h-11 items-center rounded-lg px-2 text-sm transition-colors duration-150 hover:bg-bg-wash focus-visible:bg-bg-wash focus-visible:outline-2 focus-visible:outline-ring",
                                    linkActive && "text-accent",
                                  )}
                                >
                                  {link.label}
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>
        <div className="flex shrink-0 items-center">
          <button
            type="button"
            className="flex size-11 items-center justify-center rounded-full text-fg/80 transition-colors duration-150 hover:bg-bg-wash hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring lg:hidden"
            aria-label={mobileOpen ? "Menüyü kapat" : "Menüyü aç"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-site-menu"
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <div className="flex items-center">{end}</div>
        </div>
      </div>

      {mobileOpen ? (
        <nav
          id="mobile-site-menu"
          aria-label="Mobil menü"
          className="absolute inset-x-0 top-full z-50 max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-b border-solid border-border bg-bg-elevated px-4 pt-4 pb-[calc(1rem+var(--cookie-h,0px))] shadow-[0_18px_40px_rgba(35,30,26,0.08)] lg:hidden"
        >
          <div className="space-y-5">
            {navItems.map((item) => {
              if ("to" in item && item.to) {
                const active = isRouteActive(pathname, item.to);
                return (
                  <a
                    key={item.to}
                    href={item.to}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-12 items-center rounded-lg px-2 font-display text-xl hover:bg-bg-wash",
                      active && "text-accent",
                    )}
                  >
                    {item.label}
                  </a>
                );
              }
              if (!("links" in item)) return null;
              const columns = columnsFor(item.label, item.links);
              return (
                <section key={item.label} aria-labelledby={`mobile-${item.label}`}>
                  <h2 id={`mobile-${item.label}`} className="px-2 font-display text-xl">
                    {item.label}
                  </h2>
                  <div className="mt-2 space-y-3">
                    {columns.map((column) => (
                      <div key={column.title || item.label}>
                        {column.title ? (
                          <p className="px-2 font-mono text-[11px] tracking-wide text-fg-muted uppercase">{column.title}</p>
                        ) : null}
                        {column.links.map((link) => (
                          <a
                            key={link.to}
                            href={link.to}
                            className="flex min-h-11 items-center rounded-lg px-2 text-sm text-fg/80 hover:bg-bg-wash hover:text-fg"
                          >
                            {link.label}
                          </a>
                        ))}
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </nav>
      ) : null}
    </div>
  );
}

type NavLink = { label: string; to: string };
type NavItem = NavLink | { label: string; links: NavLink[] };

const NAV_COLUMNS: Record<string, Record<string, string[]>> = {
  Mağaza: {
    Parfümler: ["/koleksiyon", "/kategori", "/kategori/kadin", "/kategori/erkek", "/kategori/unisex"],
    Setler: ["/kategori/deneme-boyu", "/kategori/hediye-seti"],
    Rehber: ["/marka", "/nota"],
  },
  Yardım: {
    Sipariş: ["/siparis-sorgu", "/odeme-yontemleri", "/teslimat", "/iade", "/garanti"],
    Yazışma: ["/iletisim", "/teklif", "/kurumsal-teklif", "/sikayet"],
    Bilgi: ["/sss", "/bulten"],
  },
};

function columnsFor(label: string, links: NavLink[]) {
  const plan = NAV_COLUMNS[label];
  if (!plan) return [{ title: "", links }];
  const used = new Set<string>();
  const columns = Object.entries(plan)
    .map(([title, paths]) => {
      const items = paths.flatMap((path) => {
        const link = links.find((item) => item.to === path);
        if (!link) return [];
        used.add(link.to);
        return [link];
      });
      return { title, links: items };
    })
    .filter((column) => column.links.length > 0);
  const rest = links.filter((link) => !used.has(link.to));
  if (rest.length) columns.push({ title: "Diğer", links: rest });
  return columns.length ? columns : [{ title: "", links }];
}

const HEADER_GROUPS = ["Mağaza", "Keşif", "Yardım", "Bilgi", "Teklif", "Rehberler", "Destek"] as const;

function buildNav(links: import("@/lib/site-config").ManagedLink[]): NavItem[] {
  const active = links.filter((item) => item.visible && item.menuGroup);
  const grouped: NavItem[] = [];
  for (const group of HEADER_GROUPS) {
    const children = active
      .filter((item) => item.menuGroup === group)
      .map((item) => ({ to: item.path, label: item.label }));
    if (children.length === 1 && children[0]) grouped.push(children[0]);
    else if (children.length) grouped.push({ label: group, links: children });
  }
  const direct = active
    .filter((item) => item.menuGroup === "Ana")
    .map((item) => ({ label: item.label, to: item.path }));
  return [...grouped, ...direct];
}
