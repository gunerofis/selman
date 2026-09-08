import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { Toaster } from "sonner";
import { cartCount, useCart } from "@/lib/cart";
import { usePrefs } from "@/lib/prefs";
import { CATEGORIES, FREE_SHIPPING_FROM, PRODUCT_COUNT } from "@/lib/products";
import { BRAND } from "@/lib/brand";
import { useHydrated } from "@/lib/use-hydrated";
import { CartDrawer } from "@/components/cart-drawer";
import { SearchPanel } from "@/components/search-panel";
import { CookieBar } from "@/components/cookie-bar";
import { OpenBadge } from "@/components/open-badge";
import { Button } from "@/components/ui/button";
import { openCookiePrefs } from "@/lib/cookie-prefs";
import { CountBadge } from "@/components/count-badge";
import { ChromeExtras } from "@/components/chrome-extras";
import { QuickLook } from "@/components/quick-look";
import { useQuickLook } from "@/lib/quick-look";
import { cn, formatPrice } from "@/lib/utils";
import { RoomsPanel } from "@/components/rooms-panel";
import { NewsletterForm } from "@/components/newsletter-form";
import { CompareBar } from "@/components/compare-bar";
import { useCompare } from "@/lib/compare";
import { BoxBoxMark } from "@/components/box-box-mark";

const NAV = [
  { to: "/koleksiyon" as const, label: "Ürünler" },
  { to: "/kategori" as const, label: "Odalar" },
  { to: "/setler" as const, label: "Setler" },
  { to: "/tasarla" as const, label: "Tasarlayın" },
  { to: "/atolye" as const, label: "Atölye" },
  { to: "/iletisim" as const, label: "İletişim" },
];

const FOOTER_SHOP = [
  { to: "/koleksiyon" as const, label: "Ürünler" },
  { to: "/organizer" as const, label: "Deri organizer" },
  { to: "/hediye-setleri" as const, label: "Hediye setleri" },
  { to: "/saat-mucevher-kutulari" as const, label: "Saat & mücevher kutuları" },
  { to: "/ofis" as const, label: "Lüks ofis ürünleri" },
  { to: "/setler" as const, label: "Ofis setleri" },
  { to: "/tasarla" as const, label: "Tasarlayın" },
  { to: "/palet" as const, label: "Palet" },
  { to: "/malzeme" as const, label: "Malzeme" },
  { to: "/olcu" as const, label: "Ölçü rehberi" },
  { to: "/bakim" as const, label: "Bakım" },
  { to: "/hediye" as const, label: "Hediye" },
  { to: "/atolye" as const, label: "Atölye" },
  { to: "/ziyaret" as const, label: "Ziyaret" },
  { to: "/teklif" as const, label: "Kurumsal teklif" },
  { to: "/iletisim" as const, label: "İletişim" },
];

const FOOTER_HELP = [
  { to: "/sss" as const, label: "SSS" },
  { to: "/siparis-sorgu" as const, label: "Sipariş sorgula" },
  { to: "/odeme-yontemleri" as const, label: "Ödeme yöntemleri" },
  { to: "/garanti" as const, label: "Garanti" },
  { to: "/bulten" as const, label: "Bülten" },
];

const FOOTER_LEGAL = [
  { to: "/teslimat" as const, label: "Teslimat" },
  { to: "/iade" as const, label: "İade" },
  { to: "/cayma" as const, label: "Cayma" },
  { to: "/on-bilgilendirme" as const, label: "Ön bilgilendirme" },
  { to: "/mesafeli" as const, label: "Mesafeli satış" },
  { to: "/kullanim" as const, label: "Kullanım" },
  { to: "/gizlilik" as const, label: "Gizlilik" },
  { to: "/kvkk" as const, label: "KVKK" },
  { to: "/cerez" as const, label: "Çerez politikası" },
  { to: "/satici" as const, label: "Satıcı" },
  { to: "/sikayet" as const, label: "Şikayet" },
];

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [menuOpen, setMenuOpen] = useState(false);
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
  const holdNav = menuOpen || searchOpen || drawerOpen || peekOpen;

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setNavHidden(false);
    lastY.current = window.scrollY;
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  useLayoutEffect(() => {
    const el = chromeRef.current;
    if (!el) return;
    const sync = () => setChromeH(el.offsetHeight);
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, [menuOpen, pathname]);

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
    document.documentElement.style.setProperty(
      "--nav-h",
      navHidden ? "0px" : `${chromeH}px`,
    );
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
          className: "!bg-bg-deep !text-fg-on-deep !border-none !rounded-none !font-sans",
        }}
      />
      <header
        ref={chromeRef}
        data-print-hide
        className={cn(
          "fixed inset-x-0 top-0 z-40 border-b border-dashed border-border bg-bg/95 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none print:hidden",
          navHidden ? "pointer-events-none -translate-y-full" : "translate-y-0",
        )}
      >
        <div className="border-b border-dashed border-border bg-bg-wash text-center font-mono text-xs tracking-wide text-fg">
          <p className="px-4 py-2">
            {formatPrice(FREE_SHIPPING_FROM)} üzeri kargo yok · 3–5 iş günü · 14 gün iade
          </p>
        </div>
        <BoxBoxMark compact={pathname !== "/"} />
        <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-3 px-4">
          <div className="flex min-w-0 shrink-0 items-center">
            <button
              type="button"
              className="flex size-11 items-center justify-center lg:hidden"
              aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
            <Link
              to="/"
              className="font-display text-2xl tracking-[0.08em] text-fg"
              aria-label={`${BRAND.name} ana sayfa`}
            >
              {BRAND.name}
            </Link>
          </div>
          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-6 lg:flex" aria-label="Ana menü">
            {NAV.map((item) => {
              const on = pathname === item.to || pathname.startsWith(`${item.to}/`);
              const rooms = item.to === "/kategori";
              return (
                <div key={item.label} className={cn("relative", rooms && "group")}>
                  <Link
                    to={item.to}
                    aria-current={on ? "page" : undefined}
                    className={cn(
                      "nav-link inline-flex h-16 items-center shrink-0 text-sm transition-colors duration-200 hover:text-fg",
                      on ? "text-fg" : "text-fg-muted",
                    )}
                  >
                    {item.label}
                  </Link>
                  {rooms ? <RoomsPanel /> : null}
                </div>
              );
            })}
          </nav>
          <div className="ml-auto flex shrink-0 items-center">
            <button
              type="button"
              className="flex size-11 items-center justify-center"
              aria-label="Ara"
              title="Ara (Ctrl+K)"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="size-5" />
            </button>
            <Link
              to="/favoriler"
              className="relative flex size-11 items-center justify-center"
              aria-label="Favoriler"
            >
              <Heart className="size-5" />
              <CountBadge value={wishes} />
            </Link>
            <button
              type="button"
              className="relative flex size-11 items-center justify-center"
              aria-label="Sepet"
              onClick={openDrawer}
            >
              <ShoppingBag className="size-5" />
              <CountBadge value={count} />
            </button>
          </div>
        </div>
        {menuOpen ? (
          <div className="border-t border-dashed border-border bg-bg px-4 py-2 lg:hidden">
            <nav className="flex flex-col" aria-label="Mobil menü">
              {NAV.map((item) => {
                const on = pathname === item.to || pathname.startsWith(`${item.to}/`);
                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    aria-current={on ? "page" : undefined}
                    className={cn(
                      "flex h-12 items-center text-base",
                      on ? "text-fg" : "text-fg-muted",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <Link to="/favoriler" className="flex h-12 items-center text-base text-fg-muted">
                Favoriler
              </Link>
            </nav>
          </div>
        ) : null}
      </header>
      <div className="shrink-0 print:hidden" style={{ height: chromeH }} aria-hidden />
      <main
        id="icerik"
        className={cn("flex-1", ready && compareN > 0 && !hideCompare && "pb-24")}
      >
        {children}
      </main>
      <CompareBar />
      <footer
        data-print-hide
        className="mt-auto border-t border-dashed border-border bg-bg-deep text-fg-on-deep print:hidden"
      >
        <div className="border-b border-fg-on-deep/10">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-5 px-4 py-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs tracking-widest text-fg-on-deep/60 uppercase">Atölye</p>
              <p className="mt-2 font-display text-3xl sm:text-4xl">Tasarımınızı gönderin, üretelim</p>
              <div className="mt-3">
                <OpenBadge tone="deep" />
              </div>
            </div>
            <Link to="/tasarla">
              <Button variant="inverse" size="lg">
                Anlatın
              </Button>
            </Link>
          </div>
        </div>
        <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <p className="font-display text-4xl tracking-[0.08em]">{BRAND.name}</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-fg-on-deep/70">
              {BRAND.tagline} {PRODUCT_COUNT} parça, sekiz renk. {BRAND.atelier}.
            </p>
            <p className="mt-6 font-mono text-xs tracking-widest uppercase text-fg-on-deep/70">
              Atölye notları
            </p>
            <div className="mt-3">
              <NewsletterForm tone="deep" />
            </div>
          </div>
          <div>
            <p className="font-mono text-xs tracking-widest uppercase text-fg-on-deep/70">
              <Link to="/kategori" className="hover:text-fg-on-deep">
                Oda
              </Link>
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {CATEGORIES.map((c) => (
                <li key={c.id}>
                  <Link
                    to="/kategori/$id"
                    params={{ id: c.id }}
                    className="text-fg-on-deep/80 hover:text-fg-on-deep"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-xs tracking-widest uppercase text-fg-on-deep/70">Mağaza</p>
            <ul className="mt-3 space-y-2 text-sm">
              {FOOTER_SHOP.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-fg-on-deep/80 hover:text-fg-on-deep">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-xs tracking-widest uppercase text-fg-on-deep/70">Yardım</p>
            <ul className="mt-3 space-y-2 text-sm">
              {FOOTER_HELP.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-fg-on-deep/80 hover:text-fg-on-deep">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-xs tracking-widest uppercase text-fg-on-deep/70">Hukuki</p>
            <ul className="mt-3 space-y-2 text-sm">
              {FOOTER_LEGAL.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-fg-on-deep/80 hover:text-fg-on-deep">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={openCookiePrefs}
                  className="text-fg-on-deep/80 hover:text-fg-on-deep"
                >
                  Çerez tercihleri
                </button>
              </li>
              <li>
                <a
                  href={`mailto:${BRAND.email}`}
                  className="text-fg-on-deep/80 hover:text-fg-on-deep"
                >
                  {BRAND.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-fg-on-deep/10 px-4 py-5 text-center font-mono text-xs text-fg-on-deep/70">
          © {new Date().getFullYear()} {BRAND.name} · İstanbul
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
