import { Suspense } from 'react'
import Link from 'next/link'
import { Kap } from '@/components/duzen/Kap'
import { Duvar } from '@/components/duvar/Duvar'
import { duvarSirasi } from '@/lib/duvar'
import { KOK_KATEGORILER, kategoriYolAdresi } from '@/lib/kategoriler'

export default function Anasayfa() {
  const urunler = duvarSirasi()

  return (
    <Kap className="py-8 md:py-12">
      <h1 className="sr-only">Düzen ürünleri</h1>

      {/* Duvarın üstünde tek satır: hazır ürün yerine kendi tasarımını
          isteyen müşteri ilk ekranda yolunu bulsun. */}
      <Link
        href="/tasarla"
        className="dikis-alt mb-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 pb-5 hover:text-taba"
      >
        <span className="yazi-display-orta text-lg">Tasarımınızı gönderin, üretelim</span>
        <span className="text-sm text-ikincil">
          Anlatın, yaklaşık 30 saniyede tasarım ve fiyat çıksın →
        </span>
      </Link>

      <Suspense fallback={<div className="aspect-square w-full bg-sut" />}>
        <Duvar urunler={urunler} />
      </Suspense>

      {/* Duvarın hemen altında: burada gördüğü düzeni kendisi kurabilsin. */}
      <Link
        href="/duvar-kur"
        className="dikis-ust mt-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 pt-5 hover:text-taba"
      >
        <span className="yazi-display-orta text-lg">Kendi duvarını kur</span>
        <span className="text-sm text-ikincil">
          Izgaraya ürün yerleştir, listeyi sepete aktar, bağlantıyı paylaş →
        </span>
      </Link>

      <nav aria-label="Kategoriler" className="dikis-ust mt-12 pt-8">
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {KOK_KATEGORILER.map((k) => (
            <li key={k.slug}>
              <Link href={kategoriYolAdresi(k.slug)} className="text-kahve hover:text-taba">
                {k.ad}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </Kap>
  )
}
