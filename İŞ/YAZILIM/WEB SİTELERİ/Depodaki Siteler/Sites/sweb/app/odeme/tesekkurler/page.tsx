import type { Metadata } from 'next'
import { Kap } from '@/components/duzen/Kap'
import { ButonLink } from '@/components/ui/Buton'
import { SpecTablosu } from '@/components/ui/SpecTablosu'

export const metadata: Metadata = {
  title: 'Sipariş alındı',
  robots: { index: false, follow: false },
}

type Props = { searchParams: Promise<{ no?: string }> }

export default async function TesekkurlerSayfasi({ searchParams }: Props) {
  const { no } = await searchParams

  return (
    <Kap className="py-8 md:py-12">
      <p className="yazi-mono">sipariş alındı</p>
      <h1 className="yazi-display mt-3 text-2xl">Teşekkürler</h1>
      <p className="mt-3 max-w-[52ch] text-ikincil">
        Siparişiniz alındı. Onay ve kargo bilgisi e-posta ile gönderilecek.
      </p>

      {no ? (
        <div className="mt-8 max-w-[420px] border border-dikis bg-kagit p-4">
          <SpecTablosu satirlar={[{ etiket: 'Sipariş numarası', deger: no }]} />
        </div>
      ) : null}

      <div className="mt-8 flex flex-wrap gap-3">
        <ButonLink href="/">Anasayfaya dön</ButonLink>
        <ButonLink href="/koleksiyon" tur="cerceve">
          Ürünlere bak
        </ButonLink>
      </div>
    </Kap>
  )
}
