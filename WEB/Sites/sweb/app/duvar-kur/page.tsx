import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Kap } from '@/components/duzen/Kap'
import { DuvarKurucu } from '@/components/duvarkur/DuvarKurucu'

export const metadata: Metadata = {
  title: 'Duvarını kur',
  description: 'Ürünleri kendi ızgarana yerleştir, listeyi sepete aktar, bağlantıyı paylaş.',
  alternates: { canonical: '/duvar-kur' },
}

export default function DuvarKurSayfasi() {
  return (
    <Kap className="py-8 md:py-12">
      <p className="yazi-mono">duvarını kur</p>
      <h1 className="yazi-display mt-3 text-2xl">Kendi duvarını kur</h1>
      <p className="mt-3 max-w-[56ch] text-ikincil">
        Izgarayı seç, hücrelere ürün ve renk yerleştir. Liste sağda toplanır,
        tek adımda sepete geçer. Kurduğun duvar adres çubuğunda durur.
      </p>

      <div className="mt-10">
        <Suspense fallback={<p className="yazi-mono">yükleniyor</p>}>
          <DuvarKurucu />
        </Suspense>
      </div>
    </Kap>
  )
}
