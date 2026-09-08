'use client'

import { useEffect } from 'react'
import { Kap } from '@/components/duzen/Kap'
import { Buton, ButonLink } from '@/components/ui/Buton'

/**
 * Sayfa düzeyinde hata sınırı. Kullanıcı boş ekranla kalmasın; teknik
 * ayrıntı gösterilmez, yalnız `digest` verilir — sunucu logunda o kodla
 * aranır.
 */
export default function Hata({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <Kap className="py-20">
      <p className="yazi-mono">hata</p>
      <h1 className="yazi-display mt-3 text-2xl">Bir şeyler ters gitti</h1>
      <p className="mt-3 max-w-[52ch] text-ikincil">
        Sayfa yüklenemedi. Tekrar deneyin; sorun sürerse iletişim sayfasından yazın.
      </p>
      {error.digest ? <p className="yazi-mono mt-3">kod: {error.digest}</p> : null}

      <div className="mt-8 flex flex-wrap gap-3">
        <Buton onClick={reset}>Tekrar dene</Buton>
        <ButonLink href="/" tur="cerceve">
          Anasayfaya dön
        </ButonLink>
        <ButonLink href="/iletisim" tur="cerceve">
          İletişime geç
        </ButonLink>
      </div>
    </Kap>
  )
}
