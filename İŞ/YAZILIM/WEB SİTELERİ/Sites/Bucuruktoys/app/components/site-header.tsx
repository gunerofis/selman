import type { ReactNode } from "react";
import HeaderProductSearch from "./header-product-search";
import OfferHeaderAction from "./offer-header-action";

type SiteHeaderProps = {
  action?: ReactNode;
};

const navigation = [
  ["Ürünler", "/urunler"],
  ["Kategoriler", "/kategoriler"],
  ["Toptan satış", "/toptan-satis"],
  ["Bayilik", "/bayi"],
  ["Hakkımızda", "/hakkimizda"],
  ["3D baskı", "/3d-baski"],
] as const;

export default function SiteHeader({ action }: SiteHeaderProps) {
  return (
    <>
      <div className="global-topbar">
        <div className="global-shell global-topbar-inner">
          <span>Yalnızca toptan teklif · Türkiye geneli teslimat</span>
          <a href="tel:+905393468527">0539 346 85 27</a>
        </div>
      </div>
      <header className="global-header">
        <div className="global-shell global-header-inner">
          <a className="global-brand" href="/" aria-label="BÜCÜRÜKTOYS ana sayfa">
            <img src="/assets/bucuruktoys-logo.svg" alt="BÜCÜRÜKTOYS" width="1460" height="288" />
          </a>
          <input className="global-menu-toggle" id="global-menu-toggle" type="checkbox" aria-label="Ana menüyü aç veya kapat" aria-controls="global-navigation" />
          <label className="global-menu-button" htmlFor="global-menu-toggle" title="Ana menü">
            <span />
            <span />
            <span />
          </label>
          <nav id="global-navigation" className="global-navigation" aria-label="Ana menü">
            {navigation.map(([label, href]) => <a href={href} key={href}>{label}</a>)}
          </nav>
          <HeaderProductSearch />
          <div className="global-actions">
            {action ?? <OfferHeaderAction />}
            <a className="global-contact" href="/iletisim">İletişim <span aria-hidden="true">→</span></a>
          </div>
        </div>
      </header>
    </>
  );
}
