import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Kap } from '@/components/duzen/Kap'
import { UrunKarti } from '@/components/kategori/UrunKarti'
import { RenkSuzgeci } from '@/components/kategori/RenkSuzgeci'
import { URUNLER } from '@/lib/urunler'
import { renkBul, type RenkAnahtari } from '@/lib/renkler'

export const metadata: Metadata = {
  title: 'Koleksiyon',
  description: 'Tüm ürünler tek listede.',
  alternates: { canonical: '/koleksiyon' },
}

type Props = { searchParams: Promise<{ renk?: string }> }

export default async function KoleksiyonSayfasi({ searchParams }: Props) {
  const { renk: r } = await searchParams
  const renk = renkBul(r ?? null)
  const renkAnahtari = (renk?.anahtar ?? null) as RenkAnahtari | null
  const izinliRenkler = [...new Set(URUNLER.flatMap((u) => u.renkler))]
  const urunler = renkAnahtari
    ? URUNLER.filter((u) => u.renkler.includes(renkAnahtari))
    : URUNLER

  return (
    <Kap className="py-8 md:py-12">
      <h1 className="yazi-display text-2xl">Koleksiyon</h1>
      <p className="yazi-mono mt-2">
        {urunler.length} ürün{renk ? ` · ${renk.ad}` : ''}
      </p>

      <div className="dikis-ust mt-6 pt-6">
        <Suspense fallback={null}>
          <RenkSuzgeci secili={renkAnahtari} izinli={izinliRenkler} />
        </Suspense>
      </div>

      {urunler.length > 0 ? (
        <ul className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {urunler.map((u, i) => (
            <li key={u.kod} className="gec-boya">
              <UrunKarti urun={u} oncelik={i < 4} zemin={renk?.zemin} renk={renkAnahtari} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="dikis-ust mt-8 pt-8 text-ikincil">Bu renk şu an üretilmiyor.</p>
      )}
    </Kap>
  )
}
