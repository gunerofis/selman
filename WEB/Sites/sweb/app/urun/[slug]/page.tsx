import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Kap } from '@/components/duzen/Kap'
import { UrunGorseli } from '@/components/ui/UrunGorseli'
import { SpecTablosu } from '@/components/ui/SpecTablosu'
import { ButonLink } from '@/components/ui/Buton'
import { Kirinti } from '@/components/kategori/Kirinti'
import { UrunKarti } from '@/components/kategori/UrunKarti'
import { SonBakilanlar } from '@/components/urun/SonBakilanlar'
import { UrunGorunumu } from '@/components/urun/UrunGorunumu'
import { agirlik, fiyat, olcu, teslim } from '@/lib/bicim'
import { URUNLER, urunBul } from '@/lib/urunler'
import { kategoriYolAdresi, kategoriYolu, sirala, tumUrunleri } from '@/lib/kategoriler'
import { site } from '@/lib/site'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return URUNLER.map((u) => ({ slug: u.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const urun = urunBul(slug)
  if (!urun) return {}
  return {
    title: `${urun.ad} ${urun.kod}`,
    description: urun.aciklama,
    alternates: { canonical: `/urun/${urun.slug}` },
    openGraph: { images: [{ url: urun.gorsel, width: 1536, height: 1536 }] },
  }
}

export default async function UrunSayfasi({ params }: Props) {
  const { slug } = await params
  const urun = urunBul(slug)
  if (!urun) notFound()

  const kardesler = sirala(tumUrunleri(urun.kategori), 'kod')
  const i = kardesler.findIndex((u) => u.kod === urun.kod)
  const onceki = i > 0 ? kardesler[i - 1] : null
  const sonraki = i >= 0 && i < kardesler.length - 1 ? kardesler[i + 1] : null
  const benzer = kardesler.filter((u) => u.kod !== urun.kod).slice(0, 4)

  const yol = kategoriYolu(urun.kategori)

  // Fiyat ve stok girilmeden Offer yayınlanmaz: eksik yerine uydurma veri
  // göndermek Merchant tarafında yanlış listeleme demek.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: urun.ad,
    sku: urun.kod,
    description: urun.aciklama,
    image: `${site.url}${urun.gorsel}`,
    ...(urun.agirlikG != null && {
      weight: { '@type': 'QuantitativeValue', value: urun.agirlikG, unitCode: 'GRM' },
    }),
    ...(urun.fiyatKurus != null && {
      offers: {
        '@type': 'Offer',
        price: (urun.fiyatKurus / 100).toFixed(2),
        priceCurrency: site.paraBirimi,
        availability:
          urun.stok == null || urun.stok > 0
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
        url: `${site.url}/urun/${urun.slug}`,
      },
    }),
  }

  return (
    <Kap className="py-8 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Kirinti
        ogeler={[
          { ad: 'Ürünler', yol: '/kategori' },
          ...yol.map((k) => ({ ad: k.ad, yol: kategoriYolAdresi(k.slug) })),
          { ad: urun.ad },
        ]}
      />

      <UrunGorunumu urun={urun}>
          <div className="mt-8 border-t border-dashed border-dikis pt-6">
            <h2 className="yazi-display-orta text-lg">Ölçü</h2>
            <div className="mt-3">
              <SpecTablosu
                satirlar={[
                  { etiket: 'Ürün kodu', deger: urun.kod },
                  { etiket: 'Dış ölçü', deger: olcu(urun.olcuMm) },
                  { etiket: 'Ağırlık', deger: agirlik(urun.agirlikG) },
                  { etiket: 'Renk', deger: `${urun.renkler.length} seçenek` },
                  { etiket: 'Teslim', deger: teslim(urun.teslimIsGunu) },
                ]}
              />
            </div>
          </div>

          <div className="mt-8 border-t border-dashed border-dikis pt-6">
            <p className="text-sm text-ikincil">
              Elli adet ve üzeri siparişte fiyat ve teslim planı ayrı çıkarılır.
            </p>
            <ButonLink href={`/kurumsal-teklif?kod=${urun.kod}`} tur="cerceve" className="mt-4">
              Bu ürün için teklif iste
            </ButonLink>
          </div>
      </UrunGorunumu>

      {onceki || sonraki ? (
        <nav
          aria-label="Kategoride gezinme"
          className="dikis-ust mt-16 flex items-center justify-between gap-4 pt-6"
        >
          {onceki ? (
            <Link href={`/urun/${onceki.slug}`} className="group max-w-[45%]">
              <span className="yazi-mono block">önceki</span>
              <span className="block truncate text-sm group-hover:text-taba">{onceki.ad}</span>
            </Link>
          ) : (
            <span />
          )}
          {sonraki ? (
            <Link href={`/urun/${sonraki.slug}`} className="group max-w-[45%] text-right">
              <span className="yazi-mono block">sonraki</span>
              <span className="block truncate text-sm group-hover:text-taba">{sonraki.ad}</span>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      ) : null}

      {benzer.length > 0 ? (
        <section className="dikis-ust mt-12 pt-8">
          <h2 className="yazi-display-orta text-lg">Aynı kategoride</h2>
          <ul className="mt-5 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {benzer.map((u) => (
              <li key={u.kod}>
                <UrunKarti urun={u} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <SonBakilanlar kaydet={urun.kod} />
    </Kap>
  )
}
