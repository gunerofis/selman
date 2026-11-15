'use client'

import Link from 'next/link'
import { useSepet } from '@/lib/sepet'

/** Başlıktaki sepet bağlantısı. Sayı yalnız mount sonrası görünür;
 *  sunucu çıktısıyla uyuşmazlık olmaz. */
export function SepetSayaci() {
  const { adet, hazir } = useSepet()
  return (
    <Link href="/sepet" className="text-sm text-kahve hover:text-taba">
      Sepet
      {hazir && adet > 0 ? <span className="ml-1.5 font-mono text-[13px]">{adet}</span> : null}
    </Link>
  )
}
