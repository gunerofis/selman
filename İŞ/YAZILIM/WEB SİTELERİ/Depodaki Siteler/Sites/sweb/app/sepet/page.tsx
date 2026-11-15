import type { Metadata } from 'next'
import { Kap } from '@/components/duzen/Kap'
import { SepetListesi } from '@/components/sepet/SepetListesi'
import { SonBakilanlar } from '@/components/urun/SonBakilanlar'

export const metadata: Metadata = {
  title: 'Sepet',
  robots: { index: false, follow: true },
}

export default function SepetSayfasi() {
  return (
    <Kap className="py-8 md:py-12">
      <h1 className="yazi-display text-2xl">Sepet</h1>
      <SepetListesi />
      <SonBakilanlar />
    </Kap>
  )
}
