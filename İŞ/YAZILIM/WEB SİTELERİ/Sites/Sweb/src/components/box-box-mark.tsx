import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { ArrowRight, ChevronDown, Gem, Menu, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSiteConfig } from "@/lib/site-config-context";

function isRouteActive(pathname: string, to: string) {
  if (to.startsWith("http")) return false;
  return to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(`${to}/`);
}

const REAL_LEATHER_URL = "/saat-mucevher-kutulari?tur=gercek-deri";

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

  const openLinks =
    openItem === null ? null : "links" in navItems[openItem] ? navItems[openItem].links : null;

  const desktopItemClass = (active: boolean) =>
    cn(
      "flex min-h-11 items-center justify-center gap-1.5 border-r border-b border-dashed border-fg-on-deep/20 px-3 py-2 text-center text-sm font-medium leading-tight transition-colors duration-150 hover:bg-fg-on-deep/8 focus-visible:bg-fg-on-deep/8 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring",
      active && "bg-fg-on-deep/10 text-fg-on-deep",
    );

  return (
    <div
      ref={rootRef}
      className="boxbox-bar relative border-b border-dashed border-border bg-bg-deep text-fg-on-deep"
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-stretch justify-between">
        <div className="flex shrink-0 items-center px-4 sm:px-5">{start}</div>
        <div className="flex shrink-0 items-center">
          <button
            type="button"
            className="flex size-11 items-center justify-center text-fg-on-deep/80 transition-colors duration-150 hover:text-fg-on-deep focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring md:hidden"
            aria-label={mobileOpen ? "Menüyü kapat" : "Menüyü aç"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-site-menu"
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <div className="flex items-center px-1 sm:px-2">{end}</div>
        </div>
      </div>

      <nav
        className="mx-auto hidden max-w-[1400px] grid-cols-4 border-t border-dashed border-fg-on-deep/25 md:grid "
        aria-label="Ana menü"
      >
        {navItems.map((item, index) => {
          const links = "links" in item ? item.links : null;
          const directTo = "to" in item ? item.to : null;
          const active = links
            ? links.some(({ to }) => isRouteActive(pathname, to))
            : directTo !== null && isRouteActive(pathname, directTo);

          if ("to" in item) {
            const isDesignAction = item.label === "Kendin Tasarla";
            const isLeatherAction = item.kind === "leather";
            return (
              <a
                key={item.label}
                href={item.to}
                aria-current={active ? "page" : undefined}
                className={cn(
                  desktopItemClass(active),
                  item.kind === "primary" && "col-span-2",
                  isDesignAction &&
                    "group  bg-bg-elevated text-accent hover:bg-bg focus-visible:bg-bg",
                  isLeatherAction &&
                    "group bg-taba text-fg-on-deep hover:bg-[#147344] focus-visible:bg-[#147344]",
                )}
              >
                {isLeatherAction ? (
                  <span className="flex items-center justify-center gap-2 font-display text-base leading-tight">
                    <Gem className="size-4 shrink-0" aria-hidden />
                    {item.label}
                  </span>
                ) : isDesignAction ? (
                  <span className="flex flex-col items-center justify-center gap-2 py-2 text-accent">
                    <Sparkles
                      className="size-5 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 motion-reduce:transition-none"
                      aria-hidden
                    />
                    <span className="font-display text-lg leading-tight tracking-tight sm:text-xl">
                      {item.label}
                    </span>
                    <span className="h-px w-8 bg-accent/40" aria-hidden />
                  </span>
                ) : (
                  item.label
                )}
              </a>
            );
          }

          const open = openItem === index;
          return (
            <button
              key={item.label}
              type="button"
              aria-expanded={open}
              aria-controls={`site-menu-${index}`}
              onClick={() => setOpenItem(open ? null : index)}
              className={cn(desktopItemClass(active), open && "bg-fg-on-deep/10")}
            >
              <span>{item.label}</span>
              <ChevronDown
                className={cn(
                  "size-4 shrink-0 transition-transform duration-150 motion-reduce:transition-none",
                  open && "rotate-180",
                )}
              />
            </button>
          );
        })}
      </nav>

      {openLinks ? (
        <div
          id={`site-menu-${openItem}`}
          className="absolute inset-x-0 top-full z-50 hidden border-y border-dashed border-fg-on-deep/25 bg-bg-deep shadow-2xl md:block"
        >
          <div className="mx-auto max-h-[58dvh] max-w-[1400px] overflow-y-auto p-4">
            <div className="grid gap-px overflow-hidden border border-fg-on-deep/15 bg-fg-on-deep/15 sm:grid-cols-2 lg:grid-cols-3">
              {openLinks.map((item) => {
                const active = isRouteActive(pathname, item.to);
                return (
                  <a
                    key={item.to}
                    href={item.to}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-12 items-center justify-between gap-3 bg-bg-deep px-4 py-3 text-sm transition-colors duration-150 hover:bg-fg-on-deep/10 focus-visible:bg-fg-on-deep/10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring",
                      active && "bg-fg-on-deep/10",
                    )}
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="size-4 shrink-0 text-fg-on-deep/45" aria-hidden />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}

      {mobileOpen ? (
        <nav
          id="mobile-site-menu"
          aria-label="Mobil menü"
          className="absolute inset-x-0 top-full z-50 max-h-[calc(100dvh-7rem)] overflow-y-auto border-y border-dashed border-fg-on-deep/25 bg-bg-deep p-4 md:hidden"
        >
          <div className="grid grid-cols-2 gap-px overflow-hidden border border-fg-on-deep/15 bg-fg-on-deep/15">
            {navItems.map((item) => {
              if (!("to" in item)) return null;
              const active = isRouteActive(pathname, item.to);
              const isDesignAction = item.label === "Kendin Tasarla";
              const isLeatherAction = item.kind === "leather";
              return (
                <a
                  key={item.to}
                  href={item.to}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-12 items-center bg-bg-deep px-3 py-3 text-sm font-medium leading-tight transition-colors duration-150 hover:bg-fg-on-deep/10 focus-visible:bg-fg-on-deep/10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring",
                    active && "bg-fg-on-deep/10",
                    isDesignAction &&
                      "justify-center gap-2 bg-bg-elevated font-display text-base text-accent hover:bg-bg focus-visible:bg-bg",
                    isLeatherAction &&
                      "col-span-2 justify-center gap-2 bg-taba font-display text-fg-on-deep hover:bg-[#147344] focus-visible:bg-[#147344]",
                  )}
                >
                  {isLeatherAction ? <Gem className="size-4" aria-hidden /> : null}
                  {item.label}
                </a>
              );
            })}
          </div>

          <div className="mt-5 space-y-5">
            {navItems.map((item) => {
              if (!("links" in item)) return null;
              return (
                <section key={item.label} aria-labelledby={`mobile-${item.label}`}>
                  <h2 id={`mobile-${item.label}`} className="mb-2 font-display text-base">
                    {item.label}
                  </h2>
                  <div className="grid grid-cols-2 gap-x-4 border-t border-dashed border-fg-on-deep/25">
                    {item.links.map((link) => (
                      <a
                        key={link.to}
                        href={link.to}
                        className="flex min-h-11 items-center border-b border-dashed border-fg-on-deep/20 py-2 text-sm text-fg-on-deep/80 transition-colors duration-150 hover:text-fg-on-deep focus-visible:text-fg-on-deep focus-visible:outline-2 focus-visible:outline-ring"
                      >
                        {link.label}
                      </a>
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

function buildNav(links: import("@/lib/site-config").ManagedLink[]) {
  const active = links.filter((item) => item.visible);
  const direct = active
    .filter(
      (item) =>
        item.menuGroup === "Ana" &&
        ["/saat-mucevher-kutulari", "/tasarla"].includes(item.path),
    )
    .map((item) => ({ label: item.label, to: item.path, kind: "primary" as const }));
  const grouped = (["Rehberler", "Destek", "Bilgi"] as const).flatMap((group) => {
    const children = active
      .filter((item) => item.menuGroup === group)
      .map((item) => ({ to: item.path, label: item.label }));
    return children.length ? [{ label: group, links: children }] : [];
  });
  return [
    ...direct,
    ...grouped,
    {
      label: "Gerçek Deri Saat Ürünleri",
      to: REAL_LEATHER_URL,
      kind: "leather" as const,
    },
  ];
}
