import Link from 'next/link'
import { Kap } from './Kap'
import { anaMenu, hukukiSayfalar, site } from '@/lib/site'
import { KOK_KATEGORILER, kategoriYolAdresi } from '@/lib/kategoriler'
import { CerezAyariBaglantisi } from '@/components/gizlilik/CerezAyariBaglantisi'

export function Etek() {
  return (
    <footer className="mt-20 border-t border-dashed border-dikis py-12">
      <Kap>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="yazi-display text-lg">{site.ad}</p>
            <p className="mt-2 max-w-[36ch] text-sm text-ikincil">
              Ev ve çalışma alanı için düzen ürünleri.
            </p>
          </div>

          <nav aria-label="Kategoriler">
            <p className="yazi-mono">kategori</p>
            <ul className="mt-3 space-y-1.5 text-sm">
              {KOK_KATEGORILER.map((k) => (
                <li key={k.slug}>
                  <Link href={kategoriYolAdresi(k.slug)} className="text-kahve hover:text-taba">
                    {k.ad}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Kurumsal">
            <p className="yazi-mono">kurumsal</p>
            <ul className="mt-3 space-y-1.5 text-sm">
              {anaMenu.map((oge) => (
                <li key={oge.yol}>
                  <Link href={oge.yol} className="text-kahve hover:text-taba">
                    {oge.ad}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Hukuki">
            <p className="yazi-mono">hukuki</p>
            <ul className="mt-3 space-y-1.5 text-sm">
              {hukukiSayfalar.map((oge) => (
                <li key={oge.yol}>
                  <Link href={oge.yol} className="text-kahve hover:text-taba">
                    {oge.ad}
                  </Link>
                </li>
              ))}
              <li>
                <CerezAyariBaglantisi />
              </li>
            </ul>
          </nav>
        </div>

        <p className="yazi-mono mt-10 border-t border-dashed border-dikis pt-6">
          © {new Date().getFullYear()} {site.ad}
        </p>
      </Kap>
    </footer>
  )
}
