'use client'

import { useEffect, useRef, useState } from 'react'
import { UrunGorseli } from '@/components/ui/UrunGorseli'
import { RENKLER, type RenkAnahtari } from '@/lib/renkler'
import { ara } from '@/lib/arama'
import { URUNLER, gorselFor, type Urun } from '@/lib/urunler'
import { kategoriAdi } from '@/lib/kategoriler'

/**
 * Hücreye ürün seçme kutusu.
 *
 * Yerleştirme "önce seç, sonra koy" biçiminde: sürükle-bırak yerine
 * hücreye basınca bu kutu açılıyor. Böylece dokunmatikte ve klavyeyle
 * aynı akış çalışıyor, ayrı bir erişilebilirlik yolu yazmak gerekmiyor.
 *
 * `closedby="any"` ile dışına basınca kapanıyor; desteklemeyen tarayıcı
 * için aşağıda yedek var. Esc her koşulda kapatıyor (showModal).
 */
export function UrunSecici({
  acik,
  baslik,
  seciliKod,
  seciliRenk,
  onSec,
  onKaldir,
  onKapat,
}: {
  acik: boolean
  baslik: string
  seciliKod: string | null
  seciliRenk: RenkAnahtari
  onSec: (kod: string, renk: RenkAnahtari) => void
  onKaldir: () => void
  onKapat: () => void
}) {
  const kutu = useRef<HTMLDialogElement>(null)
  const [sorgu, setSorgu] = useState('')
  const [renk, setRenk] = useState<RenkAnahtari>(seciliRenk)

  useEffect(() => {
    const d = kutu.current
    if (!d) return
    if (acik && !d.open) {
      setSorgu('')
      setRenk(seciliRenk)
      d.showModal()
    }
    if (!acik && d.open) d.close()
  }, [acik, seciliRenk])

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

  const sonuclar: readonly Urun[] =
    sorgu.trim().length >= 2 ? ara(sorgu, 24).map((s) => s.urun) : URUNLER

  return (
    <dialog
      ref={kutu}
      closedby="any"
      onClose={onKapat}
      aria-label={baslik}
      className="m-auto w-[min(720px,92vw)] max-h-[86dvh] overflow-auto border border-dikis-koyu bg-kagit p-0 text-kahve backdrop:bg-[rgba(38,36,31,0.45)]"
    >
      <div className="sticky top-0 z-10 border-b border-dashed border-dikis bg-kagit p-4">
        <div className="flex items-baseline justify-between gap-4">
          <p className="yazi-mono">{baslik}</p>
          <button
            type="button"
            onClick={() => kutu.current?.close()}
            className="text-sm underline underline-offset-2"
          >
            kapat
          </button>
        </div>

        <input
          type="search"
          value={sorgu}
          autoFocus
          onChange={(e) => setSorgu(e.target.value)}
          placeholder="ürün ya da kod"
          aria-label="Ürün ara"
          className="mt-3 w-full border border-dikis-koyu bg-kagit px-3 py-[9px] text-sm placeholder:text-ikincil"
        />

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span className="yazi-mono" id="secici-renk">
            renk
          </span>
          <div role="radiogroup" aria-labelledby="secici-renk" className="flex flex-wrap gap-[9px]">
            {RENKLER.map((r) => (
              <button
                key={r.anahtar}
                type="button"
                role="radio"
                aria-checked={r.anahtar === renk}
                aria-label={r.ad}
                title={r.ad}
                onClick={() => setRenk(r.anahtar)}
                className={`h-[22px] w-[22px] border border-dikis-koyu ${
                  r.anahtar === renk ? 'outline outline-2 outline-offset-2 outline-taba-dolgu' : ''
                }`}
                style={{ background: r.hex }}
              />
            ))}
          </div>
          {seciliKod ? (
            <button
              type="button"
              onClick={onKaldir}
              className="ml-auto text-sm underline underline-offset-2"
            >
              hücreyi boşalt
            </button>
          ) : null}
        </div>
      </div>

      {sonuclar.length > 0 ? (
        <ul className="grid grid-cols-3 gap-3 p-4 sm:grid-cols-4">
          {sonuclar.map((u) => {
            const secilebilir = u.renkler.includes(renk)
            return (
              <li key={u.kod}>
                <button
                  type="button"
                  disabled={!secilebilir}
                  onClick={() => onSec(u.kod, renk)}
                  aria-pressed={u.kod === seciliKod}
                  className={`block w-full border p-1 text-left disabled:opacity-40 ${
                    u.kod === seciliKod ? 'border-kahve' : 'border-dikis hover:border-dikis-koyu'
                  }`}
                >
                  <UrunGorseli
                    kaynak={gorselFor(u, renk)}
                    alt=""
                    zemin={
                      u.renkGorselleri?.[renk]
                        ? undefined
                        : RENKLER.find((r) => r.anahtar === renk)?.zemin
                    }
                    boyutlar="160px"
                  />
                  <span className="mt-1 block truncate text-[13px]">{u.ad}</span>
                  <span className="yazi-mono">
                    {u.kod} · {kategoriAdi(u.kategori)}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="p-4 text-ikincil">Bu aramaya karşılık gelen ürün yok.</p>
      )}
    </dialog>
  )
}
