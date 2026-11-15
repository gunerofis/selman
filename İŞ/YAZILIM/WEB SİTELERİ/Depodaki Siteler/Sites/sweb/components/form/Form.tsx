'use client'

import { useState, type ReactNode } from 'react'
import { Buton } from '@/components/ui/Buton'
import type { Hatalar } from '@/lib/dogrula'
import { TUZAK_ALANI } from '@/lib/istek-siniri'

/**
 * Ortak form kabuğu: gönderim, sunucu doğrulaması, başarı durumu.
 * Alanları `alanlar(hatalar)` ile veriyoruz ki sunucudan dönen hata
 * doğru alana düşsün.
 */
export function Form({
  uc,
  gonderEtiketi,
  basarili,
  dogrula,
  alanlar,
}: {
  /** API yolu, ör. /api/teklif */
  uc: string
  gonderEtiketi: string
  basarili: string
  /** İstemci tarafı ön kontrol. */
  dogrula: (veri: Record<string, string>) => Hatalar
  alanlar: (hatalar: Hatalar) => ReactNode
}) {
  const [hatalar, setHatalar] = useState<Hatalar>({})
  const [durum, setDurum] = useState<'bos' | 'gidiyor' | 'oldu'>('bos')
  const [sunucuHatasi, setSunucuHatasi] = useState('')

  if (durum === 'oldu') {
    return (
      <p role="status" className="border border-dikis bg-kagit p-4 text-sm">
        {basarili}
      </p>
    )
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        setSunucuHatasi('')
        const veri = Object.fromEntries(
          new FormData(e.currentTarget).entries(),
        ) as Record<string, string>

        const yerel = dogrula(veri)
        setHatalar(yerel)
        if (Object.keys(yerel).length > 0) {
          document.getElementById(Object.keys(yerel)[0])?.focus()
          return
        }

        setDurum('gidiyor')
        try {
          const y = await fetch(uc, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(veri),
          })
          const c = await y.json()
          if (!y.ok) {
            setHatalar(c.hatalar ?? {})
            setSunucuHatasi(c.mesaj ?? 'Gönderilemedi.')
            setDurum('bos')
            return
          }
          setDurum('oldu')
        } catch {
          setSunucuHatasi('Bağlantı kurulamadı. Tekrar deneyin.')
          setDurum('bos')
        }
      }}
      className="grid max-w-[420px] gap-5"
    >
      {alanlar(hatalar)}

      {/* Bot tuzağı: insan görmez, ekran okuyucu okumaz, sekme almaz.
          Doluysa sunucu isteği sessizce yutar. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={TUZAK_ALANI}>Bu alanı boş bırakın</label>
        <input id={TUZAK_ALANI} name={TUZAK_ALANI} type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {sunucuHatasi ? (
        <p role="alert" className="text-[13px] text-bordo">
          {sunucuHatasi}
        </p>
      ) : null}

      <Buton type="submit" disabled={durum === 'gidiyor'} className="justify-self-start">
        {durum === 'gidiyor' ? 'Gönderiliyor…' : gonderEtiketi}
      </Buton>
    </form>
  )
}
