'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ara } from '@/lib/arama'
import { KATEGORILER, kategoriYolAdresi } from '@/lib/kategoriler'
import { anaMenu } from '@/lib/site'
import { fiyat } from '@/lib/bicim'

/**
 * Komut paleti — ⌘K / Ctrl+K.
 *
 * Katalog 36 ürün; eşleşme tarayıcıda, ağ turu olmadan yapılıyor.
 * Sunucudaki `/ara` sayfası kalıyor: palet klavyeyi kullananlar için
 * kısayol, arama sayfası paylaşılabilir adres. İkisi de `lib/arama.ts`
 * kullanıyor, sonuç sırası aynı.
 *
 * Kutu `showModal()` ile açılıyor — odak içeride kalıyor, Esc kapatıyor.
 */
type Satir = { ad: string; alt: string; yol: string }

const SAYFALAR: readonly Satir[] = [
  ...anaMenu.map((m) => ({ ad: m.ad, alt: 'sayfa', yol: m.yol })),
  { ad: 'Duvarını kur', alt: 'sayfa', yol: '/duvar-kur' },
  { ad: 'Sepet', alt: 'sayfa', yol: '/sepet' },
]

export function KomutPaleti() {
  const router = useRouter()
  const kutu = useRef<HTMLDialogElement>(null)
  const [acik, setAcik] = useState(false)
  const [sorgu, setSorgu] = useState('')
  const [secili, setSecili] = useState(0)

  const kapat = useCallback(() => kutu.current?.close(), [])

  useEffect(() => {
    const tus = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        const d = kutu.current
        if (!d) return
        if (d.open) d.close()
        else {
          setSorgu('')
          setSecili(0)
          setAcik(true)
          d.showModal()
        }
      }
    }
    window.addEventListener('keydown', tus)
    return () => window.removeEventListener('keydown', tus)
  }, [])

  // closedby desteklenmeyen tarayıcıda dışına basınca kapatma yedeği.
  useEffect(() => {
    const d = kutu.current
    if (!d || 'closedBy' in HTMLDialogElement.prototype) return
    const disari = (e: MouseEvent) => {
      if (e.target !== d) return
      const r = d.getBoundingClientRect()
      const icerde =
        r.top <= e.clientY && e.clientY <= r.bottom && r.left <= e.clientX && e.clientX <= r.right
      if (!icerde) d.close()
    }
    d.addEventListener('click', disari)
    return () => d.removeEventListener('click', disari)
  }, [])

  const t = sorgu.trim()
  const urunler: Satir[] =
    t.length >= 2
      ? ara(t, 8).map((s) => ({
          ad: s.urun.ad,
          alt: `${s.urun.kod} · ${fiyat(s.urun.fiyatKurus)}`,
          yol: `/urun/${s.urun.slug}`,
        }))
      : []
  const kategoriler: Satir[] =
    t.length >= 2
      ? KATEGORILER.filter((k) => k.ad.toLocaleLowerCase('tr').includes(t.toLocaleLowerCase('tr')))
          .slice(0, 4)
          .map((k) => ({ ad: k.ad, alt: 'kategori', yol: kategoriYolAdresi(k.slug) }))
      : []
  const sayfalar: Satir[] =
    t.length === 0
      ? [...SAYFALAR]
      : SAYFALAR.filter((s) => s.ad.toLocaleLowerCase('tr').includes(t.toLocaleLowerCase('tr')))

  const satirlar: Satir[] = [
    ...urunler,
    ...kategoriler,
    ...sayfalar,
    ...(t.length >= 2 ? [{ ad: `"${t}" için tüm sonuçlar`, alt: 'arama', yol: `/ara?s=${encodeURIComponent(t)}` }] : []),
  ]

  function git(yol: string) {
    kapat()
    router.push(yol)
  }

  return (
    <dialog
      ref={kutu}
      closedby="any"
      onClose={() => setAcik(false)}
      aria-label="Komut paleti"
      className="m-auto mt-[12vh] w-[min(560px,92vw)] border border-dikis-koyu bg-kagit p-0 text-kahve backdrop:bg-[rgba(38,36,31,0.45)]"
    >
      {acik ? (
        <div
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              setSecili((s) => (satirlar.length ? (s + 1) % satirlar.length : 0))
            } else if (e.key === 'ArrowUp') {
              e.preventDefault()
              setSecili((s) => (satirlar.length ? (s - 1 + satirlar.length) % satirlar.length : 0))
            } else if (e.key === 'Enter') {
              e.preventDefault()
              const s = satirlar[secili]
              if (s) git(s.yol)
            }
          }}
        >
          <input
            type="text"
            value={sorgu}
            autoFocus
            onChange={(e) => {
              setSorgu(e.target.value)
              setSecili(0)
            }}
            placeholder="ürün, kategori ya da sayfa"
            aria-label="Komut paleti araması"
            aria-controls="palet-liste"
            className="w-full border-b border-dashed border-dikis bg-kagit px-4 py-3 text-sm placeholder:text-ikincil"
          />

          <ul id="palet-liste" className="max-h-[52dvh] overflow-auto">
            {satirlar.map((s, i) => (
              <li key={`${s.yol}-${i}`}>
                <button
                  type="button"
                  onClick={() => git(s.yol)}
                  onMouseEnter={() => setSecili(i)}
                  aria-current={i === secili ? 'true' : undefined}
                  className={`flex w-full items-baseline justify-between gap-4 px-4 py-2 text-left text-sm ${
                    i === secili ? 'bg-sut' : ''
                  }`}
                >
                  <span className="min-w-0 truncate">{s.ad}</span>
                  <span className="yazi-mono shrink-0">{s.alt}</span>
                </button>
              </li>
            ))}
            {satirlar.length === 0 ? (
              <li className="px-4 py-3 text-sm text-ikincil">Sonuç yok.</li>
            ) : null}
          </ul>

          <p className="border-t border-dashed border-dikis px-4 py-2 yazi-mono">
            ↑↓ gez · ⏎ git · esc kapat
          </p>
        </div>
      ) : null}
    </dialog>
  )
}
