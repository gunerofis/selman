'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Arama alanı.
 *
 * Gönderim `/ara?s=` adresine gider — sonuç sayfası sunucuda üretilir,
 * paylaşılabilir ve geri tuşuyla dönülür. Yazarken istek atılmaz; katalog
 * 36 ürün, öneri kutusu için ağ turu gerekmiyor.
 */
export function AramaAlani({
  baslangic = '',
  otomatikOdak = false,
  etiket = 'Katalogda ara',
  kisayol = false,
  className = '',
}: {
  baslangic?: string
  otomatikOdak?: boolean
  /** Sayfada birden çok arama alanı varsa ayırt etmek için. */
  etiket?: string
  /** Alanın içinde ⌘K ipucu gösterir. Yalnız klavyeli ekranlarda anlamlı. */
  kisayol?: boolean
  className?: string
}) {
  const router = useRouter()
  const [deger, setDeger] = useState(baslangic)
  const alan = useRef<HTMLInputElement>(null)

  // Başlıktaki alan bir kere basılıyor; başka sorguyla arama sayfasına
  // geçilince içeriği güncellensin.
  useEffect(() => setDeger(baslangic), [baslangic])

  return (
    <form
      role="search"
      aria-label={etiket}
      action="/ara"
      className={`flex gap-2 ${className}`}
      onSubmit={(e) => {
        e.preventDefault()
        const s = deger.trim()
        if (s.length < 2) {
          alan.current?.focus()
          return
        }
        router.push(`/ara?s=${encodeURIComponent(s)}`)
      }}
    >
      <span className="relative min-w-0 flex-1">
        <input
          ref={alan}
          type="search"
          name="s"
          value={deger}
          autoFocus={otomatikOdak}
          onChange={(e) => setDeger(e.target.value)}
          placeholder="ürün ya da kod"
          aria-label={etiket}
          className="w-full border border-dikis-koyu bg-kagit px-3 py-[9px] pr-12 text-sm text-kahve placeholder:text-ikincil"
        />
        {/* Komut paletinin varlığını duyuran ipucu. Ekran okuyucudan
            gizli: paletin kendi adı ve yönergesi kutunun içinde. */}
        {kisayol && deger === '' ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 border border-dikis px-1 font-mono text-[11px] text-ikincil"
          >
            ⌘K
          </span>
        ) : null}
      </span>
      {/* Klavye kısayolu yalnız işaret ediliyor; paleti layout'taki
          KomutPaleti açıyor. Dokunmatikte anlamsız olduğu için gizli. */}
      <button
        type="submit"
        className="shrink-0 border border-dikis-koyu px-4 py-[9px] text-sm text-kahve transition-colors duration-[320ms] ease-cikis hover:border-kahve"
      >
        Ara
      </button>
    </form>
  )
}
