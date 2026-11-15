import { Kap } from '@/components/duzen/Kap'
import { ButonLink } from '@/components/ui/Buton'

export default function BulunamadiSayfasi() {
  return (
    <Kap className="py-20">
      <p className="yazi-mono">404</p>
      <h1 className="yazi-display mt-3 text-2xl">Sayfa bulunamadı</h1>
      <p className="mt-3 max-w-[52ch] text-ikincil">
        Aradığınız sayfa taşınmış veya kaldırılmış olabilir.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButonLink href="/">Anasayfaya dön</ButonLink>
        <ButonLink href="/kategori" tur="cerceve">
          Ürünlere bak
        </ButonLink>
      </div>
    </Kap>
  )
}
