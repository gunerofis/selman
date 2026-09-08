'use client'

import { useEffect, useRef, useState } from 'react'
import { RENKLER, type RenkAnahtari } from '@/lib/renkler'
import { Buton } from '@/components/ui/Buton'
import { useSepet } from '@/lib/sepet'
import type { Urun } from '@/lib/urunler'

/**
 * Ürün sayfasındaki renk seçimi ve sepete ekleme.
 *
 * Renk durumu üstte (`UrunGorunumu`) duruyor: seçim hem burayı hem
 * görseli sürüyor, iki ayrı doğruluk kaynağı olmuyor.
 */
export function UrunSecim({
  urun,
  renk,
  onRenk,
}: {
  urun: Urun
  renk: RenkAnahtari
  onRenk: (r: RenkAnahtari) => void
}) {
  const [duyuru, setDuyuru] = useState('')
  const secili = RENKLER.find((r) => r.anahtar === renk)
  const { ekle } = useSepet()
  const zamanlayici = useRef<number | null>(null)

  useEffect(() => () => {
    if (zamanlayici.current) window.clearTimeout(zamanlayici.current)
  }, [])

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="yazi-mono">renk</span>
        <span className="yazi-mono">{secili?.ad.toLowerCase()}</span>
      </div>

      <div role="radiogroup" aria-label="Renk" className="mt-2 flex flex-wrap gap-[9px]">
        {RENKLER.filter((r) => urun.renkler.includes(r.anahtar)).map((r) => (
          <button
            key={r.anahtar}
            type="button"
            role="radio"
            aria-checked={r.anahtar === renk}
            aria-label={r.ad}
            title={r.ad}
            onClick={() => onRenk(r.anahtar)}
            className={`h-[22px] w-[22px] border border-dikis-koyu ${
              r.anahtar === renk ? 'outline outline-2 outline-offset-2 outline-taba-dolgu' : ''
            }`}
            style={{ background: r.hex }}
          />
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Buton
          disabled={urun.stok === 0}
          onClick={() => {
            ekle(urun.kod, renk)
            setDuyuru(`${urun.ad}, ${secili?.ad.toLowerCase()} sepete eklendi.`)
            if (zamanlayici.current) window.clearTimeout(zamanlayici.current)
            zamanlayici.current = window.setTimeout(() => setDuyuru(''), 4000)
          }}
        >
          Sepete ekle
        </Buton>
        {/* Stok girilmemişse durum yazılmaz; boş veri "stokta" diye okunmasın. */}
        {urun.stok == null ? null : urun.stok === 0 ? (
          <span className="text-sm text-bordo">Stokta yok</span>
        ) : urun.stok <= 10 ? (
          <span className="text-sm text-bordo">Son {urun.stok} adet</span>
        ) : (
          <span className="text-sm text-taba">Stokta</span>
        )}
      </div>

      <p aria-live="polite" className="mt-3 text-sm text-taba">
        {duyuru}
      </p>
    </div>
  )
}
