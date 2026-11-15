import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Heart, Search, ShoppingBag } from "lucide-react";
import { Toaster } from "sonner";
import { cartCount, useCart } from "@/lib/cart";
import { usePrefs } from "@/lib/prefs";
import { CATEGORIES } from "@/lib/products";
import { useHydrated } from "@/lib/use-hydrated";
import { CartDrawer } from "@/components/cart-drawer";
import { SearchPanel } from "@/components/search-panel";
import { CookieBar } from "@/components/cookie-bar";
import { openCookiePrefs } from "@/lib/cookie-prefs";
import { CountBadge } from "@/components/count-badge";
import { ChromeExtras } from "@/components/chrome-extras";
import { QuickLook } from "@/components/quick-look";
import { useQuickLook } from "@/lib/quick-look";
import { cn } from "@/lib/utils";
import { NewsletterForm } from "@/components/newsletter-form";
import { CompareBar } from "@/components/compare-bar";
import { useCompare } from "@/lib/compare";
import { BoxBoxMark } from "@/components/box-box-mark";
import { useSiteConfig } from "@/lib/site-config-context";
import { TrustStrip } from "@/components/trust-strip";
import { PageCrumb } from "@/components/page-crumb";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const siteConfig = useSiteConfig();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdminArea =
    pathname === "/yonetim" ||
    pathname.startsWith("/yonetim/") ||
    pathname === "/admin" ||
    pathname.startsWith("/admin/");
  const [searchOpen, setSearchOpen] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [chromeH, setChromeH] = useState(pathname === "/" ? 200 : 160);
  const lastY = useRef(0);
  const chromeRef = useRef<HTMLElement>(null);
  const ready = useHydrated();
  const lines = useCart((s) => s.lines);
  const openDrawer = useCart((s) => s.openDrawer);
  const drawerOpen = useCart((s) => s.drawerOpen);
  const peekOpen = useQuickLook((s) => s.product != null);
  const wishCount = usePrefs((s) => s.wishlist.length);
  const count = ready ? cartCount(lines) : 0;
  const wishes = ready ? wishCount : 0;
  const compareN = useCompare((s) => s.skus.length);
  const hideCompare =
    pathname.startsWith("/urun") ||
    pathname.startsWith("/odeme") ||
    pathname.startsWith("/siparis") ||
    pathname.startsWith("/sepet");
  const holdNav = searchOpen || drawerOpen || peekOpen;

  useEffect(() => {
    setSearchOpen(false);
    setNavHidden(false);
    lastY.current = window.scrollY;
  }, [pathname]);

  useLayoutEffect(() => {
    const el = chromeRef.current;
    if (!el) return;
    const sync = () => setChromeH(el.offsetHeight);
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, [pathname]);

  useEffect(() => {
    let ticking = false;
    const read = () => {
      ticking = false;
      const y = window.scrollY;
      const prev = lastY.current;
      lastY.current = y;
      if (holdNav || y < 72) {
        setNavHidden(false);
        return;
      }
      if (y > prev + 8) setNavHidden(true);
      else if (y < prev - 8) setNavHidden(false);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [holdNav]);

  useEffect(() => {
    document.documentElement.style.setProperty("--nav-h", navHidden ? "0px" : `${chromeH}px`);
  }, [navHidden, chromeH]);

  useEffect(() => {
    return () => {
      document.documentElement.style.removeProperty("--nav-h");
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const typing =
        el &&
        (el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          el.tagName === "SELECT" ||
          el.isContentEditable);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
        return;
      }
      if (!typing && e.key === "/") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (isAdminArea) {
    return (
      <div className="min-h-dvh bg-bg-wash text-fg">
        <Toaster
          position="top-center"
          toastOptions={{
            className: "!bg-bg-deep !text-fg-on-deep !border-none !rounded-lg !font-sans",
          }}
        />
        <main id="icerik">{children}</main>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-bg text-fg">
      <a
        href="#icerik"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-fg focus:px-4 focus:py-2 focus:text-bg-elevated print:hidden"
      >
        İçeriğe geç
      </a>
      <Toaster
        position="top-center"
        offset="calc(var(--nav-h, 6.5rem) + 0.75rem)"
        toastOptions={{
          className: "!bg-bg-deep !text-fg-on-deep !border-none !rounded-lg !font-sans",
        }}
      />
      <header
        ref={chromeRef}
        data-print-hide
        className={cn(
          "fixed inset-x-0 top-0 z-40 border-b border-solid border-border bg-bg/95 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none print:hidden",
          navHidden ? "pointer-events-none -translate-y-full" : "translate-y-0",
        )}
      >
        <BoxBoxMark
          start={
            <Link
              to="/"
              className="min-w-0 truncate font-display text-xl tracking-[0.04em] text-fg sm:text-3xl sm:tracking-[0.08em]"
              aria-label={`${siteConfig.identity.name} ana sayfa`}
            >
              {siteConfig.identity.name}
            </Link>
          }
          end={
            <>
              <button
                type="button"
                className="flex size-11 items-center justify-center rounded-full text-fg/80 transition-colors duration-150 hover:bg-bg-wash hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:size-12"
                aria-label="Ara"
                title="Ara (Ctrl+K)"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="size-6" />
              </button>
              <Link
                to="/favoriler"
                className="relative flex size-11 items-center justify-center rounded-full text-fg/80 transition-colors duration-150 hover:bg-bg-wash hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:size-12"
                aria-label="Favoriler"
              >
                <Heart className="size-6" />
                <CountBadge value={wishes} />
              </Link>
              <Link
                to="/hesap"
                className="flex h-11 items-center rounded-full px-1.5 text-sm text-fg/80 hover:bg-bg-wash hover:text-fg sm:h-12 sm:px-3"
              >
                Hesap
              </Link>
              <button
                type="button"
                className="relative flex size-11 items-center justify-center rounded-full text-fg/80 transition-colors duration-150 hover:bg-bg-wash hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:size-12"
                aria-label="Sepet"
                onClick={openDrawer}
              >
                <ShoppingBag className="size-6" />
                <CountBadge value={count} />
              </button>
            </>
          }
        />
      </header>
      <div className="shrink-0 print:hidden" style={{ height: chromeH }} aria-hidden />
      <main id="icerik" className={cn("flex-1", ready && compareN > 0 && !hideCompare && "pb-24")}>
        <PageCrumb pathname={pathname} />
        {children}
      </main>
      <CompareBar />
      {isAdminArea ? null : <TrustStrip />}
      <footer
        data-print-hide
        className="mt-auto border-t border-solid border-border bg-bg-deep text-fg-on-deep print:hidden"
      >
        <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <p className="font-display text-4xl tracking-[0.04em]">{siteConfig.identity.name}</p>
            <p className="mt-6 font-mono text-xs tracking-widest uppercase text-fg-on-deep/70">
              Bülten
            </p>
            <div className="mt-3">
              <NewsletterForm tone="deep" />
            </div>
          </div>
          {CATEGORIES.length > 0 ? (
          <div>
            <p className="font-mono text-xs tracking-widest uppercase text-fg-on-deep/70">
              <Link to="/kategori" className="hover:text-fg-on-deep">
                Kategoriler
              </Link>
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {CATEGORIES.map((c) => (
                <li key={c.id}>
                  <Link
                    to="/kategori/$id"
                    params={{ id: c.id }}
                    className="inline-flex min-h-11 items-center text-fg-on-deep/80 hover:text-fg-on-deep"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          ) : null}
          <div>
            <p className="font-mono text-xs tracking-widest uppercase text-fg-on-deep/70">Mağaza</p>
            <ul className="mt-3 space-y-2 text-sm">
              {siteConfig.links
                .filter((item) => item.visible && item.footerGroup === "Mağaza")
                .map((item) => (
                  <li key={item.path}>
                    <a href={item.path} className="inline-flex min-h-11 items-center text-fg-on-deep/80 hover:text-fg-on-deep">
                      {item.label}
                    </a>
                  </li>
                ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-xs tracking-widest uppercase text-fg-on-deep/70">Yardım</p>
            <ul className="mt-3 space-y-2 text-sm">
              {siteConfig.links
                .filter((item) => item.visible && item.footerGroup === "Yardım")
                .map((item) => (
                  <li key={item.path}>
                    <a href={item.path} className="inline-flex min-h-11 items-center text-fg-on-deep/80 hover:text-fg-on-deep">
                      {item.label}
                    </a>
                  </li>
                ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-xs tracking-widest uppercase text-fg-on-deep/70">Hukuki</p>
            <ul className="mt-3 space-y-2 text-sm">
              {siteConfig.links
                .filter((item) => item.visible && item.footerGroup === "Hukuki")
                .map((item) => (
                  <li key={item.path}>
                    <a href={item.path} className="inline-flex min-h-11 items-center text-fg-on-deep/80 hover:text-fg-on-deep">
                      {item.label}
                    </a>
                  </li>
                ))}
              <li>
                <button
                  type="button"
                  onClick={openCookiePrefs}
                  className="inline-flex min-h-11 items-center text-fg-on-deep/80 hover:text-fg-on-deep"
                >
                  Çerez tercihleri
                </button>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.identity.email}`}
                  className="inline-flex min-h-11 items-center text-fg-on-deep/80 hover:text-fg-on-deep"
                >
                  {siteConfig.identity.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-fg-on-deep/10 px-4 py-5 text-center font-mono text-xs text-fg-on-deep/70">
          © {new Date().getFullYear()} {siteConfig.identity.name}
        </div>
      </footer>
      <CartDrawer />
      <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} />
      <QuickLook />
      <ChromeExtras />
      <CookieBar />
    </div>
  );
}
