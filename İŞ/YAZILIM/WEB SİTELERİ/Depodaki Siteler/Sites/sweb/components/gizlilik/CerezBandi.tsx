'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Buton } from '@/components/ui/Buton'
import { useCerez } from '@/lib/cerez'

/** Karar verilmemişse görünen bant. Sayfayı kilitlemez, içerik okunabilir
 *  kalır; reddetmek kabul etmek kadar kolay. */
export function CerezBandi() {
  const { izinler, hazir, kaydet, hepsiniKabul, hepsiniReddet } = useCerez()
  const [ayrinti, setAyrinti] = useState(false)
  const [analitik, setAnalitik] = useState(false)
  const [pazarlama, setPazarlama] = useState(false)
  const ilkDugme = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (hazir && izinler === null) ilkDugme.current?.focus()
  }, [hazir, izinler])

  if (!hazir || izinler !== null) return null

  return (
    <div
      role="dialog"
      aria-labelledby="cerez-baslik"
      aria-describedby="cerez-metin"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-dikis-koyu bg-kagit"
    >
      <div className="mx-auto w-full max-w-[1280px] px-5 py-5 md:px-8">
        <h2 id="cerez-baslik" className="yazi-display-orta text-lg">
          Çerezler
        </h2>
        <p id="cerez-metin" className="mt-2 max-w-[70ch] text-sm text-ikincil">
          Sitenin çalışması için gereken çerezler her zaman açık. Ölçüm ve
          pazarlama çerezleri yalnız izin verirseniz yüklenir.{' '}
          <Link href="/cerez-politikasi" className="text-taba underline underline-offset-2">
            Çerez politikası
          </Link>
        </p>

        {ayrinti ? (
          <fieldset className="mt-4 max-w-[520px]">
            <legend className="sr-only">Çerez tercihleri</legend>
            <label className="flex items-center justify-between gap-4 border-b border-dashed border-dikis py-2.5">
              <span className="text-sm">Zorunlu çerezler</span>
              <input type="checkbox" checked disabled className="accent-[var(--color-kahve)]" />
            </label>
            <label className="flex cursor-pointer items-center justify-between gap-4 border-b border-dashed border-dikis py-2.5">
              <span className="text-sm">Ölçüm çerezleri</span>
              <input
                type="checkbox"
                checked={analitik}
                onChange={(e) => setAnalitik(e.target.checked)}
                className="accent-[var(--color-kahve)]"
              />
            </label>
            <label className="flex cursor-pointer items-center justify-between gap-4 border-b border-dashed border-dikis py-2.5">
              <span className="text-sm">Pazarlama çerezleri</span>
              <input
                type="checkbox"
                checked={pazarlama}
                onChange={(e) => setPazarlama(e.target.checked)}
                className="accent-[var(--color-kahve)]"
              />
            </label>
          </fieldset>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-3">
          {ayrinti ? (
            <Buton onClick={() => kaydet({ analitik, pazarlama })}>Seçimi kaydet</Buton>
          ) : (
            <Buton ref={ilkDugme} onClick={hepsiniKabul}>
              Hepsini kabul et
            </Buton>
          )}
          <Buton tur="cerceve" onClick={hepsiniReddet}>
            Zorunlu olanlar yeter
          </Buton>
          {!ayrinti ? (
            <Buton tur="cerceve" onClick={() => setAyrinti(true)}>
              Ayarla
            </Buton>
          ) : null}
        </div>
      </div>
    </div>
  )
}
