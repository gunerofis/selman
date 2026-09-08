import type { Metadata } from 'next'
import Link from 'next/link'
import { Kap } from '@/components/duzen/Kap'
import { UrunGorseli } from '@/components/ui/UrunGorseli'
import { Mono } from '@/components/ui/Mono'
import { KOK_KATEGORILER, cocuklar, kategoriYolAdresi, tumUrunleri } from '@/lib/kategoriler'
import { URUNLER } from '@/lib/urunler'

export const metadata: Metadata = {
  title: 'Ürünler',
  description: 'Tüm kategoriler.',
  alternates: { canonical: '/kategori' },
}

export default function KategoriDizini() {
  return (
    <Kap className="py-8 md:py-12">
      <h1 className="yazi-display text-2xl">Ürünler</h1>
      <p className="yazi-mono mt-2">
        {KOK_KATEGORILER.length} kategori · {URUNLER.length} ürün
      </p>

      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {KOK_KATEGORILER.map((k, i) => {
          const urunler = tumUrunleri(k.slug)
          const alt = cocuklar(k.slug)
          return (
            <li key={k.slug}>
              <Link href={kategoriYolAdresi(k.slug)} className="group block">
                {urunler[0] ? (
                  <UrunGorseli
                    kaynak={urunler[0].gorsel}
                    alt=""
                    oncelik={i < 3}
                    boyutlar="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                  />
                ) : (
                  <div className="aspect-square bg-sut" />
                )}
                <div className="mt-2 flex items-baseline justify-between gap-3">
                  <span className="yazi-display-orta text-lg group-hover:text-taba">{k.ad}</span>
                  <Mono>{urunler.length} ürün</Mono>
                </div>
              </Link>
              {alt.length > 0 ? (
                <ul className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
                  {alt.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={kategoriYolAdresi(c.slug)}
                        className="text-sm text-ikincil hover:text-taba"
                      >
                        {c.ad}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          )
        })}
      </ul>
    </Kap>
  )
}
