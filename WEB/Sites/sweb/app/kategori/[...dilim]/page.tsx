import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { Kap } from '@/components/duzen/Kap'
import Image from 'next/image'
import { Kirinti } from '@/components/kategori/Kirinti'
import { UrunKarti } from '@/components/kategori/UrunKarti'
import { Siralama } from '@/components/kategori/Siralama'
import { RenkSuzgeci } from '@/components/kategori/RenkSuzgeci'
import { renkBul, type RenkAnahtari } from '@/lib/renkler'
import {
  KATEGORILER,
  cocuklar,
  dilimdenKategori,
  kategoriYolAdresi,
  kategoriYolu,
  kendiUrunleri,
  sirala,
  tumUrunleri,
  type Siralama as SiralamaTuru,
} from '@/lib/kategoriler'

type Props = {
  params: Promise<{ dilim: string[] }>
  searchParams: Promise<{ sirala?: string; renk?: string }>
}

export function generateStaticParams() {
  return KATEGORILER.map((k) => ({ dilim: kategoriYolu(k.slug).map((x) => x.slug) }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { dilim } = await params
  const kategori = dilimdenKategori(dilim)
  if (!kategori) return {}
  const sayi = tumUrunleri(kategori.slug).length
  return {
    title: kategori.ad,
    description: `${kategori.ad} kategorisindeki ${sayi} ürün.`,
    alternates: { canonical: kategoriYolAdresi(kategori.slug) },
  }
}

export default async function KategoriSayfasi({ params, searchParams }: Props) {
  const { dilim } = await params
  const kategori = dilimdenKategori(dilim)
  if (!kategori) notFound()

  const { sirala: s, renk: r } = await searchParams
  const nasil: SiralamaTuru = s === 'ad' ? 'ad' : 'kod'
  const renk = renkBul(r ?? null)
  const renkAnahtari = (renk?.anahtar ?? null) as RenkAnahtari | null

  // Süzgeçte yalnız bu kategoride gerçekten üretilen renkler görünür;
  // olmayan rengi tıklatıp boş liste görmek kimseye bir şey anlatmıyor.
  const kategoriRenkleri = [...new Set(kendiUrunleri(kategori.slug).flatMap((u) => u.renkler))]

  const alt = cocuklar(kategori.slug)
  const hepsi = sirala(kendiUrunleri(kategori.slug), nasil)
  // Renk görünümü listeyi o renkte üretilen ürünlere daraltır.
  const urunler = renkAnahtari ? hepsi.filter((u) => u.renkler.includes(renkAnahtari)) : hepsi
  const toplam = tumUrunleri(kategori.slug).length

  const yol = kategoriYolu(kategori.slug)
  const kirinti = [
    { ad: 'Ürünler', yol: '/kategori' },
    ...yol.map((k, i) => ({
      ad: k.ad,
      yol: i < yol.length - 1 ? kategoriYolAdresi(k.slug) : undefined,
    })),
  ]

  return (
    <Kap className="py-8 md:py-12">
      <Kirinti ogeler={kirinti} />

      {/* Kapak yalnız tanımlı kategoride basılır; olmayanda yer kaplamaz. */}
      {kategori.kapak ? (
        <div className="relative mt-4 aspect-[16/9] max-h-[380px] w-full overflow-hidden bg-sut">
          <Image
            src={kategori.kapak.yol}
            alt={kategori.kapak.alt}
            fill
            priority
            sizes="(max-width: 1279px) 100vw, 1280px"
            className="object-cover"
          />
        </div>
      ) : null}

      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="yazi-display text-2xl">{kategori.ad}</h1>
          <p className="yazi-mono mt-2">{toplam} ürün</p>
        </div>
        {hepsi.length > 1 ? (
          <Suspense fallback={null}>
            <Siralama secili={nasil} />
          </Suspense>
        ) : null}
      </div>

      {hepsi.length > 0 ? (
        <div className="dikis-ust mt-6 pt-6">
          <Suspense fallback={null}>
            <RenkSuzgeci secili={renkAnahtari} izinli={kategoriRenkleri} />
          </Suspense>
        </div>
      ) : null}

      {alt.length > 0 ? (
        <nav aria-label="Alt kategoriler" className="dikis-ust mt-6 pt-6">
          <ul className="flex flex-wrap gap-3">
            {alt.map((c) => (
              <li key={c.slug}>
                <Link
                  href={kategoriYolAdresi(c.slug)}
                  className="inline-flex items-baseline gap-2 border border-dikis-koyu px-3 py-1.5 text-sm text-kahve hover:border-kahve"
                >
                  {c.ad}
                  <span className="yazi-mono">{tumUrunleri(c.slug).length}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}

      {urunler.length > 0 ? (
        <ul className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {urunler.map((u, i) => (
            <li key={u.kod} className="gec-boya">
              <UrunKarti urun={u} oncelik={i < 4} zemin={renk?.zemin} renk={renkAnahtari} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="dikis-ust mt-8 pt-8 text-ikincil">
          {hepsi.length > 0
            ? 'Bu renk bu kategoride üretilmiyor.'
            : 'Bu kategoride ürün alt başlıklarda toplandı.'}
        </p>
      )}
    </Kap>
  )
}
