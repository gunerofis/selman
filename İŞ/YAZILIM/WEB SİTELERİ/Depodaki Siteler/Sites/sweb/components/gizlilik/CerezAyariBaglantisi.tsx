'use client'

import { useCerez } from '@/lib/cerez'

/** Etekte durur; kullanıcı iznini her an geri alabilmeli. */
export function CerezAyariBaglantisi() {
  const { sifirla } = useCerez()
  return (
    <button type="button" onClick={sifirla} className="text-kahve hover:text-taba">
      Çerez tercihleri
    </button>
  )
}
