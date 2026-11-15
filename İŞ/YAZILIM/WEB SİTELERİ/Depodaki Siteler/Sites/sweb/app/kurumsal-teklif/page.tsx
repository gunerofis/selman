import type { Metadata } from 'next'
import { Kap } from '@/components/duzen/Kap'
import { TeklifFormu } from '@/components/form/TeklifFormu'
import { SpecTablosu } from '@/components/ui/SpecTablosu'

export const metadata: Metadata = {
  title: 'Kurumsal teklif',
  description: 'Toplu sipariş ve kurumsal teklif için form.',
  alternates: { canonical: '/kurumsal-teklif' },
}

type Props = { searchParams: Promise<{ kod?: string }> }

export default async function KurumsalTeklifSayfasi({ searchParams }: Props) {
  // Ürün sayfasındaki "teklif iste" bağlantısı kodu buraya taşır.
  const { kod } = await searchParams
  return (
    <Kap className="py-8 md:py-12">
      <h1 className="yazi-display text-2xl">Kurumsal teklif</h1>
      <p className="mt-3 max-w-[62ch] text-ikincil">
        Adet, ürün ve teslim tarihini yazın; iki iş günü içinde fiyat ve teslim planıyla dönüş
        yapılır.
      </p>

      <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
        <TeklifFormu kod={kod} />

        <aside className="border border-dikis bg-kagit p-4">
          <h2 className="yazi-display-orta text-lg">Koşullar</h2>
          <div className="mt-3">
            <SpecTablosu
              satirlar={[
                { etiket: 'En az adet', deger: '50' },
                { etiket: 'Dönüş süresi', deger: '2 iş günü' },
                { etiket: 'Üretim', deger: '10-20 iş günü' },
                { etiket: 'Logo baskı', deger: 'Var' },
              ]}
            />
          </div>
        </aside>
      </div>
    </Kap>
  )
}
