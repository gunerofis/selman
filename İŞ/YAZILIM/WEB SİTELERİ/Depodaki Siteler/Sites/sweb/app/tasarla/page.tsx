import type { Metadata } from 'next'
import { Kap } from '@/components/duzen/Kap'
import { TasarimAkisi } from '@/components/tasarim/TasarimAkisi'
import { EN_AZ_ADET } from '@/lib/uretim'

export const metadata: Metadata = {
  title: 'Tasarımınızı gönderin',
  description:
    'İstediğiniz düzen ürününü anlatın, tasarım ve fiyat çıksın. En az ' +
    EN_AZ_ADET +
    ' adet.',
  alternates: { canonical: '/tasarla' },
}

export default function TasarlaSayfasi() {
  return (
    <Kap className="py-8 md:py-12">
      <p className="yazi-mono">tasarımınızı gönderin</p>
      <h1 className="yazi-display mt-3 text-2xl">Anlatın, üretelim</h1>
      <p className="mt-3 max-w-[62ch] text-ikincil">
        Aklınızdaki düzen ürününü kendi cümlelerinizle yazın. Anlattığınızı üretim
        yeteneklerimiz içinde bir ürüne çevirip tasarımını ve fiyatını çıkarıyoruz.
      </p>
      <TasarimAkisi />
    </Kap>
  )
}
