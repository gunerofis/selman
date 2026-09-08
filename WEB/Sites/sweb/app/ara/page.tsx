import type { Metadata } from 'next'
import Link from 'next/link'
import { Kap } from '@/components/duzen/Kap'
import { UrunKarti } from '@/components/kategori/UrunKarti'
import { AramaAlani } from '@/components/arama/AramaAlani'
import { ara, kategoriOnerileri } from '@/lib/arama'
import { kategoriYolAdresi } from '@/lib/kategoriler'

type Props = { searchParams: Promise<{ s?: string }> }

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { s } = await searchParams
  const sorgu = (s ?? '').trim()
  return {
    title: sorgu ? `"${sorgu}" araması` : 'Arama',
    // Arama sonuç sayfaları dizine girmez: içerik zaten kategori ve ürün
    // sayfalarında, ikinci kez indekslenirse birbirini yer.
    robots: { index: false, follow: true },
  }
}

export default async function AramaSayfasi({ searchParams }: Props) {
  const { s } = await searchParams
  const sorgu = (s ?? '').trim().slice(0, 80)
  const sonuclar = sorgu ? ara(sorgu) : []
  const kategoriler = sorgu ? kategoriOnerileri(sorgu) : []

  return (
    <Kap className="py-8 md:py-12">
      <p className="yazi-mono">arama</p>
      <h1 className="yazi-display mt-3 text-2xl">
        {sorgu ? `"${sorgu}"` : 'Ne arıyorsunuz?'}
      </h1>

      <div className="mt-6 max-w-[520px]">
        <AramaAlani baslangic={sorgu} otomatikOdak={!sorgu} />
      </div>

      {kategoriler.length > 0 ? (
        <nav className="mt-8" aria-label="Eşleşen kategoriler">
          <p className="yazi-mono">kategori</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {kategoriler.map((k) => (
              <li key={k.slug}>
                <Link
                  href={kategoriYolAdresi(k.slug)}
                  className="inline-block border border-dikis-koyu px-3 py-1 text-sm hover:border-kahve"
                >
                  {k.ad}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}

      {sorgu ? (
        <section className="mt-8">
          <p className="yazi-mono" aria-live="polite">
            {sonuclar.length} sonuç
          </p>
          {sonuclar.length > 0 ? (
            <ul className="mt-4 grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
              {sonuclar.map(({ urun }, i) => (
                <li key={urun.kod}>
                  <UrunKarti urun={urun} oncelik={i < 4} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-4 max-w-[52ch] text-ikincil">
              <p>Bu aramaya karşılık gelen ürün yok.</p>
              <p className="mt-3">
                İstediğiniz ürün katalogda yoksa{' '}
                <Link href="/tasarla" className="text-kahve underline">
                  tasarımınızı gönderin
                </Link>
                , üretelim.
              </p>
            </div>
          )}
        </section>
      ) : null}
    </Kap>
  )
}
