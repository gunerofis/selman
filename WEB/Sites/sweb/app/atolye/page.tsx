import type { Metadata } from 'next'
import { Kap } from '@/components/duzen/Kap'
import { Bolum } from '@/components/ui/Bolum'

export const metadata: Metadata = {
  title: 'Atölye',
  description: 'Üretim yöntemi, malzeme ve süreç.',
  alternates: { canonical: '/atolye' },
}

export default function AtolyeSayfasi() {
  return (
    <Kap className="py-8 md:py-12">
      <h1 className="yazi-display text-2xl">Atölye</h1>
      <p className="mt-3 max-w-[62ch] text-ikincil">
        Ürünlerin nasıl yapıldığı, hangi malzemeden ve hangi sürede.
      </p>

      {/* Metin Faris'ten gelecek. Yapı hazır. */}
      <Bolum baslik="Malzeme">
        <p className="max-w-[62ch] text-ikincil">Metin bekleniyor.</p>
      </Bolum>

      <Bolum baslik="Üretim">
        <p className="max-w-[62ch] text-ikincil">Metin bekleniyor.</p>
      </Bolum>

      <Bolum baslik="Bakım">
        <p className="max-w-[62ch] text-ikincil">Metin bekleniyor.</p>
      </Bolum>
    </Kap>
  )
}
