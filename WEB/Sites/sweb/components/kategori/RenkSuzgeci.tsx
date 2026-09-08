'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { RENKLER, type RenkAnahtari } from '@/lib/renkler'

/**
 * Renk görünümü.
 *
 * Seçim URL'e yazılır (`?renk=lacivert`), böylece paylaşılan bağlantı aynı
 * görünümle açılır ve geri tuşu çalışır — duvardaki renk seçimiyle aynı
 * kural. Liste o renkte üretilen ürünlere daralır ve kartların zemini o
 * renge döner.
 */
export function RenkSuzgeci({
  secili,
  izinli,
}: {
  secili: RenkAnahtari | null
  /** Bu listede üretilen renkler. Verilmezse sekizi de gösterilir. */
  izinli?: readonly RenkAnahtari[]
}) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()

  function git(renk: RenkAnahtari | null) {
    const p = new URLSearchParams(params.toString())
    if (renk) p.set('renk', renk)
    else p.delete('renk')
    const q = p.toString()
    router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false })
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="yazi-mono" id="renk-etiketi">
        renk
      </span>
      <div role="radiogroup" aria-labelledby="renk-etiketi" className="flex flex-wrap gap-[9px]">
        {RENKLER.filter((r) => !izinli || izinli.includes(r.anahtar)).map((renk) => {
          const aktif = renk.anahtar === secili
          return (
            <button
              key={renk.anahtar}
              type="button"
              role="radio"
              aria-checked={aktif}
              aria-label={renk.ad}
              title={renk.ad}
              onClick={() => git(aktif ? null : renk.anahtar)}
              className={`h-[22px] w-[22px] border border-dikis-koyu ${
                aktif ? 'outline outline-2 outline-offset-2 outline-taba-dolgu' : ''
              }`}
              style={{ background: renk.hex }}
            />
          )
        })}
      </div>
      {secili ? (
        <button
          type="button"
          onClick={() => git(null)}
          className="text-sm text-kahve underline underline-offset-2"
        >
          temizle
        </button>
      ) : null}
    </div>
  )
}
