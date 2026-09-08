'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import type { Siralama as SiralamaTuru } from '@/lib/kategoriler'

const SECENEKLER: { deger: SiralamaTuru; ad: string }[] = [
  { deger: 'kod', ad: 'koda göre' },
  { deger: 'ad', ad: 'ada göre' },
]

/** Sıralama URL'e yazılır; sayfa paylaşılınca aynı sırayla açılır. */
export function Siralama({ secili }: { secili: SiralamaTuru }) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()

  return (
    <div className="flex items-center gap-3">
      <label htmlFor="sirala" className="yazi-mono">
        sırala
      </label>
      <select
        id="sirala"
        value={secili}
        onChange={(e) => {
          const p = new URLSearchParams(params.toString())
          if (e.target.value === 'kod') p.delete('sirala')
          else p.set('sirala', e.target.value)
          const q = p.toString()
          router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false })
        }}
        className="border border-dikis-koyu bg-kagit px-2 py-1 text-sm text-kahve"
      >
        {SECENEKLER.map((s) => (
          <option key={s.deger} value={s.deger}>
            {s.ad}
          </option>
        ))}
      </select>
    </div>
  )
}
