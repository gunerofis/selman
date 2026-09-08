'use client'

import { RENKLER, type RenkAnahtari } from '@/lib/renkler'

/**
 * Sekiz renk noktası. Tek seçim, radiogroup semantiği.
 * Seçili nokta taba outline alır — aksanın izinli üç kullanımından biri.
 */
export function RenkNoktalari({
  secili,
  onSec,
  etiket = 'Renk',
}: {
  secili: RenkAnahtari | null
  onSec: (anahtar: RenkAnahtari) => void
  etiket?: string
}) {
  return (
    <div role="radiogroup" aria-label={etiket} className="flex flex-wrap gap-[9px]">
      {RENKLER.map((renk) => {
        const aktif = renk.anahtar === secili
        return (
          <button
            key={renk.anahtar}
            type="button"
            role="radio"
            aria-checked={aktif}
            aria-label={renk.ad}
            title={renk.ad}
            onClick={() => onSec(renk.anahtar)}
            className={`h-[22px] w-[22px] border border-dikis-koyu ${
              aktif ? 'outline outline-2 outline-offset-2 outline-taba-dolgu' : ''
            }`}
            style={{ background: renk.hex }}
          />
        )
      })}
    </div>
  )
}

export type { RenkAnahtari }
