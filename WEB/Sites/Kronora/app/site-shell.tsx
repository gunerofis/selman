/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { StoreSettings } from "./lib/store";
import { getFavorites } from "./favorites-store";
import { CORPORATE_NAV_LINKS, PRODUCT_NAV_LINKS } from "./lib/site-content";

const SEARCH_DESTINATIONS = [
  ...PRODUCT_NAV_LINKS,
  ...CORPORATE_NAV_LINKS.map((item) => ({ ...item, note: "Kurumsal çözümler" })),
  { href: "/aksesuarlar", label: "Aksesuarlar", note: "Düzen fikirleri ve tamamlayıcı parçalar" },
  { href: "/firsatlar", label: "Fırsatlar", note: "Seçili ürünlerde güncel seçenekler" },
  { href: "/galeri", label: "Galeri", note: "Ürün detayları ve renkler" },
  { href: "/rehber", label: "Ürün Rehberi", note: "Doğru kapasite ve modeli bulun" },
  { href: "/iletisim", label: "İletişim", note: "Ürün ve sipariş soruları" },
] as const;

type SearchProduct = {
  slug: string;
  name: string;
  model: string;
  color: string;
  priceCents: number;
  primaryImage: string;
};

function cartCount() {
  try {
    const items = JSON.parse(localStorage.getItem("kronora-cart") || "[]") as Array<{ quantity: number }>;
    return items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  } catch {
    return 0;
  }
}

export default function SiteShell({ settings, products, children }: { settings: StoreSettings; products: SearchProduct[]; children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [count, setCount] = useState(0);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const searchPanelRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const openSearch = useCallback(() => {
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setSearchOpen(true);
    setMobileMenu(false);
  }, []);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    window.requestAnimationFrame(() => previousFocusRef.current?.focus());
  }, []);

  useEffect(() => {
    const update = () => setCount(cartCount());
    update();
    window.addEventListener("cart-updated", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("cart-updated", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  useEffect(() => {
    const update = () => setFavoriteCount(getFavorites().length);
    update();
    window.addEventListener("favorites-updated", update);
    window.addEventListener("storage", update);
    return () => { window.removeEventListener("favorites-updated", update); window.removeEventListener("storage", update); };
  }, []);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMobileMenu(false);
      if (searchOpen) closeSearch();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [closeSearch, searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !searchPanelRef.current) return;
      const focusable = [...searchPanelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])')];
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", trapFocus);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", trapFocus);
    };
  }, [searchOpen]);

  const searchResults = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("tr-TR");
    if (!normalized) return SEARCH_DESTINATIONS.slice(0, 7);
    return SEARCH_DESTINATIONS.filter((item) => `${item.label} ${item.note}`.toLocaleLowerCase("tr-TR").includes(normalized)).slice(0, 8);
  }, [query]);

  const productResults = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("tr-TR");
    if (!normalized) return products.slice(0, 5);
    return products.filter((product) => `${product.name} ${product.model} ${product.color}`.toLocaleLowerCase("tr-TR").includes(normalized)).slice(0, 6);
  }, [products, query]);

  const active = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  return (
    <>
      <header className="site-header" id="top">
        <button className={mobileMenu ? "menu-button active" : "menu-button"} type="button" onClick={() => setMobileMenu((value) => !value)} aria-label={mobileMenu ? "Menüyü kapat" : "Menüyü aç"} aria-expanded={mobileMenu}><span /><span /><span /></button>
        <Link className="brand" href="/" aria-label="Moneluks ana sayfa"><b>MONELUKS</b></Link>

        <nav className={mobileMenu ? "primary-nav open" : "primary-nav"} aria-label="Ana menü">
          <Link href="/koleksiyon" onClick={() => setMobileMenu(false)} className={active("/koleksiyon") ? "active" : ""}>Koleksiyon</Link>
          <Link href="/aksesuar-kutulari" onClick={() => setMobileMenu(false)} className={active("/aksesuar-kutulari") ? "active" : ""}>Saat Kutuları</Link>
          <Link href="/tekli-gozluk-kutulari" onClick={() => setMobileMenu(false)} className={active("/tekli-gozluk-kutulari") ? "active" : ""}>Gözlük Kutuları</Link>
          <Link href="/organizerler" onClick={() => setMobileMenu(false)} className={active("/organizerler") ? "active" : ""}>Organizerler</Link>
          <Link href="/toplu-siparis" onClick={() => setMobileMenu(false)} className={active("/toplu-siparis") ? "active" : ""}>Kurumsal</Link>
        </nav>

        <div className="header-actions">
          <button type="button" className="header-search-button" aria-label="Aramayı aç" aria-expanded={searchOpen} aria-controls="quick-search-panel" onClick={openSearch}><span className="search-icon" aria-hidden="true" /><b>Ara</b></button>
          <Link className="favorites-link" href="/favoriler" aria-label={`Favoriler, ${favoriteCount} ürün`}><span aria-hidden="true">♡</span><b>{favoriteCount}</b></Link>
          <Link className="cart-link" href="/sepet" aria-label={`Sepet, ${count} ürün`}><i className="cart-bag-icon" aria-hidden="true" /><span>Sepet</span><b>({count})</b></Link>
        </div>
      </header>

      {searchOpen && (
        <div className="quick-search-overlay">
          <button className="quick-search-backdrop" type="button" aria-label="Aramayı kapat" onClick={closeSearch} />
          <section className="quick-search-panel" id="quick-search-panel" ref={searchPanelRef} role="dialog" aria-modal="true" aria-label="Moneluks arama">
            <div className="quick-search-head"><div><small>Arama</small><strong>Ne arıyorsunuz?</strong></div><button type="button" onClick={closeSearch} aria-label="Aramayı kapat">×</button></div>
            <label className="quick-search-input"><span aria-hidden="true">⌕</span><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Saat kutusu, organizer, gözlük kutusu..." /></label>
            <div className="quick-search-product-results" aria-live="polite">
              <div className="quick-search-section-title"><b>Ürünler</b><span>{productResults.length} sonuç</span></div>
              {productResults.map((product) => <Link className="quick-search-product" href={`/urun/${product.slug}`} key={product.slug} onClick={closeSearch}><img src={product.primaryImage} width="68" height="62" alt="" /><div><b>{product.name}</b><small>{product.model} · {product.color}</small></div><strong>{(product.priceCents / 100).toLocaleString("tr-TR")} TL</strong></Link>)}
              {!productResults.length && <p className="search-empty">Bu aramayla eşleşen ürün bulunamadı.</p>}
            </div>
            <div className="quick-search-results">
              <div className="quick-search-section-title"><b>Bölümler</b></div>
              {searchResults.length ? searchResults.map((item) => <Link href={item.href} key={item.href} onClick={closeSearch}><div><b>{item.label}</b><small>{item.note}</small></div><span aria-hidden="true">→</span></Link>) : <p className="search-empty">Bu aramayla eşleşen bölüm bulunamadı.</p>}
            </div>
          </section>
        </div>
      )}

      {children}

      <nav className="mobile-dock" aria-label="Hızlı gezinme">
        <Link href="/" className={pathname === "/" ? "active" : ""}><span aria-hidden="true">⌂</span><b>Ana sayfa</b></Link>
        <Link href="/koleksiyon" className={active("/koleksiyon") ? "active" : ""}><span aria-hidden="true">◇</span><b>Koleksiyon</b></Link>
        <button type="button" aria-controls="quick-search-panel" aria-expanded={searchOpen} onClick={openSearch}><span aria-hidden="true">⌕</span><b>Ara</b></button>
        <Link href="/favoriler" className={active("/favoriler") ? "active" : ""}><span aria-hidden="true">♡</span><b>Favoriler {favoriteCount ? `(${favoriteCount})` : ""}</b></Link>
        <Link href="/sepet" className={active("/sepet") ? "active" : ""}><span aria-hidden="true">□</span><b>Sepet {count ? `(${count})` : ""}</b></Link>
      </nav>

      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-intro">
            <Link className="brand footer-brand" href="/"><b>MONELUKS</b></Link>
            <p>Saatler, gözlükler ve kişisel parçalar için düzenli saklama çözümleri.</p>
            <div className="footer-contact">
              <a href={`tel:${settings.contactPhone}`}>{settings.contactPhone}</a>
              <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>
            </div>
          </div>
          <div className="footer-column"><strong>Ürünler</strong><Link href="/koleksiyon">Koleksiyon</Link><Link href="/tekli-saat-kutulari">Tekli Saat Kutuları</Link><Link href="/gozluk-airpods-kutusu">Gözlük & AirPods</Link><Link href="/tekli-gozluk-kutulari">Gözlük Kutuları</Link><Link href="/organizerler">Organizerler</Link></div>
          <div className="footer-column"><strong>Keşfet</strong><Link href="/aksesuar-kutulari">Aksesuar Kutuları</Link><Link href="/aksesuarlar">Aksesuarlar</Link><Link href="/firsatlar">Fırsatlar</Link><Link href="/galeri">Galeri</Link><Link href="/rehber">Ürün Rehberi</Link></div>
          <div className="footer-column"><strong>Kurumsal</strong><Link href="/toplu-siparis">Toplu Sipariş</Link><Link href="/bayilik">Bayilik</Link><Link href="/hediye-karti">Hediye Kartı</Link><Link href="/hakkimizda">Hakkımızda</Link><Link href="/iletisim">İletişim</Link></div>
          <div className="footer-column"><strong>Destek</strong><Link href="/favoriler">Favorilerim</Link><Link href="/sepet">Sepet</Link><Link href="/gizlilik">Gizlilik ve KVKK</Link><a href="#top">Yukarı çık ↑</a></div>
        </div>
        <div className="footer-bottom"><small>© {new Date().getFullYear()} Moneluks. Tüm hakları saklıdır.</small><div><Link href="/gizlilik">Gizlilik</Link><Link href="/iletisim">Destek</Link></div></div>
      </footer>
    </>
  );
}
