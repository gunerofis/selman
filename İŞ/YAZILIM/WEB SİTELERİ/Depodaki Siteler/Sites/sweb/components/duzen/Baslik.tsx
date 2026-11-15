import Link from 'next/link'
import { Kap } from './Kap'
import { anaMenu, site } from '@/lib/site'
import { SepetSayaci } from '@/components/sepet/SepetSayaci'
import { AramaAlani } from '@/components/arama/AramaAlani'

export function Baslik() {
  return (
    <header className="border-b border-dashed border-dikis">
      <Kap className="flex h-16 items-center justify-between gap-6">
        <Link href="/" className="yazi-display text-lg text-kahve">
          {site.ad}
        </Link>

        <nav aria-label="Ana menü" className="hidden md:block">
          <ul className="flex items-center gap-6 text-sm">
            {anaMenu.map((oge) => (
              <li key={oge.yol}>
                <Link href={oge.yol} className="text-kahve hover:text-taba">
                  {oge.ad}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Dar ekranda menüyle aynı satıra sığmıyor; alttaki satıra iniyor. */}
        <AramaAlani etiket="Katalogda ara" kisayol className="hidden w-[240px] lg:flex" />

        <SepetSayaci />
      </Kap>

      <div className="border-t border-dashed border-dikis lg:hidden">
        <Kap className="py-3">
          <AramaAlani etiket="Katalogda ara (dar ekran)" />
        </Kap>
      </div>

      <nav aria-label="Ana menü (mobil)" className="border-t border-dashed border-dikis md:hidden">
        <Kap>
          <ul className="flex gap-5 overflow-x-auto py-3 text-sm">
            {anaMenu.map((oge) => (
              <li key={oge.yol} className="shrink-0">
                <Link href={oge.yol} className="text-kahve hover:text-taba">
                  {oge.ad}
                </Link>
              </li>
            ))}
          </ul>
        </Kap>
      </nav>
    </header>
  )
}
