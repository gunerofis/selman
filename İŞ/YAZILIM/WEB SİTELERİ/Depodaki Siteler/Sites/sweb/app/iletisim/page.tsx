import type { Metadata } from 'next'
import { Kap } from '@/components/duzen/Kap'
import { IletisimFormu } from '@/components/form/IletisimFormu'
import { SpecTablosu } from '@/components/ui/SpecTablosu'

export const metadata: Metadata = {
  title: 'İletişim',
  description: 'Soru, sipariş durumu ve iade için iletişim.',
  alternates: { canonical: '/iletisim' },
}

export default function IletisimSayfasi() {
  return (
    <Kap className="py-8 md:py-12">
      <h1 className="yazi-display text-2xl">İletişim</h1>

      <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
        <IletisimFormu />

        <aside className="border border-dikis bg-kagit p-4">
          <h2 className="yazi-display-orta text-lg">Bilgi</h2>
          <div className="mt-3">
            <SpecTablosu
              satirlar={[
                { etiket: 'Yanıt süresi', deger: '1 iş günü' },
                { etiket: 'Çalışma saati', deger: '09.00-18.00' },
              ]}
            />
          </div>
        </aside>
      </div>
    </Kap>
  )
}
