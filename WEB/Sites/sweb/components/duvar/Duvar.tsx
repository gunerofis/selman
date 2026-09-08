'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useId, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { RENKLER, renkBul, type RenkAnahtari } from '@/lib/renkler'
import { fiyat } from '@/lib/bicim'
import { gorselFor, type Urun } from '@/lib/urunler'
import stil from './duvar.module.css'

/**
 * Duvar.
 *
 * - Merkezde en çok satan, çevrede diğerleri.
 * - Çevre karesine tıkla → merkezle yer değiştirir, bilgileri açılır;
 *   merkezdeki onun yerine gider, bilgileri kapanır.
 * - Çevre kareleri <button>, merkezdeki başlık <a href>.
 * - Yer değiştirme geçmişe yazılmaz.
 * - Enter ile değiştirir (native buton), aria-live duyurur.
 * - Üstteki 8 renk noktası duvarın tamamını o renge geçirir, seçim URL'e yazılır.
 *
 * Yer değiştirme View Transitions ile 320ms sürer. Merkez ve çevre karesi
 * boyut değiştirdiği için klasik transform-FLIP içeriği bulanıklaştırırdı;
 * View Transitions iki anlık görüntüyü aynı sürede morph eder. Desteklemeyen
 * tarayıcıda değişim anında olur, işlev korunur.
 */
export function Duvar({ urunler }: { urunler: readonly (Urun | null)[] }) {
  const [sira, setSira] = useState<readonly (Urun | null)[]>(urunler)
  const [duyuru, setDuyuru] = useState('')
  const [yerlesti, setYerlesti] = useState(false)
  const duyuruId = useId()

  const router = useRouter()
  const aramaParams = useSearchParams()

  const seciliRenk = renkBul(aramaParams.get('renk'))
  const zemin = seciliRenk?.zemin ?? 'var(--color-sut)'

  // Giriş animasyonu yalnız ilk yüklenişte çalışır; yer değiştirmede tekrarlamaz.
  useEffect(() => {
    const t = window.setTimeout(() => setYerlesti(true), 21 * 40 + 320)
    return () => window.clearTimeout(t)
  }, [])

  const degistir = useCallback(
    (indeks: number) => {
      const gelen = sira[indeks]
      const giden = sira[0]
      if (!gelen || !giden) return
      setDuyuru(`${gelen.ad} merkeze alındı. ${giden.ad} çevreye gitti.`)

      const uygula = () =>
        setSira((onceki) => {
          const yeni = [...onceki]
          ;[yeni[0], yeni[indeks]] = [yeni[indeks], yeni[0]]
          return yeni
        })

      if (typeof document !== 'undefined' && 'startViewTransition' in document) {
        document.startViewTransition(uygula)
      } else {
        uygula()
      }
    },
    [sira],
  )

  const renkSec = useCallback(
    (anahtar: RenkAnahtari) => {
      const params = new URLSearchParams(aramaParams.toString())
      if (seciliRenk?.anahtar === anahtar) params.delete('renk')
      else params.set('renk', anahtar)
      const sorgu = params.toString()
      router.push(sorgu ? `/?${sorgu}` : '/', { scroll: false })
    },
    [aramaParams, router, seciliRenk],
  )

  const merkez = sira[0]
  const cevre = sira.slice(1)

  if (!merkez) return null
  const girisSinifi = yerlesti ? '' : ` ${stil.giris}`

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-4">
        <div role="radiogroup" aria-label="Duvar rengi" className="flex flex-wrap gap-[9px]">
          {RENKLER.map((renk) => {
            const aktif = renk.anahtar === seciliRenk?.anahtar
            return (
              <button
                key={renk.anahtar}
                type="button"
                role="radio"
                aria-checked={aktif}
                aria-label={renk.ad}
                title={renk.ad}
                onClick={() => renkSec(renk.anahtar)}
                className={`h-[22px] w-[22px] border border-dikis-koyu ${
                  aktif ? 'outline outline-2 outline-offset-2 outline-taba-dolgu' : ''
                }`}
                style={{ background: renk.hex }}
              />
            )
          })}
        </div>
        <span className="yazi-mono shrink-0">
          {seciliRenk
            ? `seçili: ${seciliRenk.ad.toLowerCase()}`
            : `${sira.filter(Boolean).length} ürün`}
        </span>
      </div>

      <div className={stil.izgara}>
        <div className={stil.merkez}>
          <div
            className={stil.kare + girisSinifi}
            style={{ background: zemin, viewTransitionName: `kare-${merkez.kod}` }}
          >
            <div className={stil.gorselAlani}>
              <Image
                src={gorselFor(merkez, seciliRenk?.anahtar)}
                alt={merkez.ad}
                fill
                priority
                sizes="(max-width: 767px) 50vw, (max-width: 1439px) 60vw, 66vw"
                className={stil.gorsel}
              />
            </div>
            <div className={stil.merkezIcerik}>
              <span className="yazi-mono">{merkez.kod}</span>
              <h2 className="yazi-display text-base md:text-xl">
                <Link href={`/urun/${merkez.slug}`} className="text-kahve hover:text-taba">
                  {merkez.ad}
                </Link>
              </h2>
              <p className={`${stil.merkezAciklama} max-w-[46ch] text-sm text-ikincil`}>{merkez.aciklama}</p>
              <span className="font-mono text-sm text-kahve">{fiyat(merkez.fiyatKurus)}</span>
            </div>
          </div>
        </div>

        {cevre.map((urun, i) => {
          // Katalog 21'e tamamlanana kadar boş hücreler düz zemin durur:
          // tıklanmaz, odak almaz, ekran okuyucuya görünmez.
          if (!urun) {
            return (
              <div key={`bos-${i}`} className={stil.cevre} aria-hidden="true">
                <div className={stil.kare} style={{ background: zemin }}>
                <span className={stil.gorselAlani} />
                <span className={stil.bant} />
              </div>
              </div>
            )
          }
          return (
            <div key={urun.kod} className={stil.cevre}>
              <button
                type="button"
                onClick={() => degistir(i + 1)}
                className={stil.kare + girisSinifi}
                style={
                  {
                    background: zemin,
                    viewTransitionName: `kare-${urun.kod}`,
                    '--gecikme': `${(i + 1) * 40}ms`,
                  } as React.CSSProperties
                }
              >
                <span className={stil.gorselAlani}>
                  <Image
                    src={gorselFor(urun, seciliRenk?.anahtar)}
                    alt=""
                    fill
                    sizes="(max-width: 767px) 25vw, (max-width: 1439px) 20vw, 17vw"
                    className={stil.gorsel}
                  />
                </span>
                <span className={stil.bant}>
                  <span className={stil.ad}>{urun.ad}</span>
                  <span className={stil.kod}>{urun.kod}</span>
                </span>
              </button>
            </div>
          )
        })}
      </div>

      <p id={duyuruId} aria-live="polite" className="sr-only">
        {duyuru}
      </p>
    </div>
  )
}
