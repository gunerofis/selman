'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { RenkAnahtari } from './renkler'
import { URUNLER, type Urun } from './urunler'

const ANAHTAR = 'sweb-sepet-v1'

/** Sepet satırı yalnız kimlik taşır; ad, fiyat, görsel her açılışta
 *  katalogdan tazelenir. Böylece eski fiyat sepette donup kalmaz. */
export type SepetSatiri = { kod: string; renk: RenkAnahtari; adet: number }

export type CozulmusSatir = SepetSatiri & { urun: Urun }

type SepetDurumu = {
  satirlar: readonly CozulmusSatir[]
  /** Toplam parça sayısı. */
  adet: number
  /** Kuruş. Kalemlerden biri bile fiyatsızsa null. */
  araToplamKurus: number | null
  hazir: boolean
  ekle: (kod: string, renk: RenkAnahtari, adet?: number) => void
  adetDegistir: (kod: string, renk: RenkAnahtari, adet: number) => void
  cikar: (kod: string, renk: RenkAnahtari) => void
  bosalt: () => void
}

const Baglam = createContext<SepetDurumu | null>(null)

function oku(): SepetSatiri[] {
  if (typeof window === 'undefined') return []
  try {
    const ham = window.localStorage.getItem(ANAHTAR)
    if (!ham) return []
    const veri = JSON.parse(ham)
    if (!Array.isArray(veri)) return []
    return veri.filter(
      (s) => s && typeof s.kod === 'string' && typeof s.renk === 'string' && s.adet > 0,
    )
  } catch {
    return []
  }
}

function yaz(satirlar: readonly SepetSatiri[]) {
  try {
    window.localStorage.setItem(ANAHTAR, JSON.stringify(satirlar))
  } catch {
    // özel sekme veya dolu depolama: sepet oturumluk kalır, akış durmaz
  }
}

export function SepetSaglayici({ children }: { children: ReactNode }) {
  const [satirlar, setSatirlar] = useState<SepetSatiri[]>([])
  // Sunucuda localStorage yok; ilk render boş sepetle eşleşsin diye
  // okuma mount sonrasına bırakılıyor.
  const [hazir, setHazir] = useState(false)

  useEffect(() => {
    setSatirlar(oku())
    setHazir(true)
  }, [])

  useEffect(() => {
    if (hazir) yaz(satirlar)
  }, [satirlar, hazir])

  // Aynı sitenin başka sekmesinde değişirse burada da güncellensin.
  useEffect(() => {
    const dinle = (e: StorageEvent) => {
      if (e.key === ANAHTAR) setSatirlar(oku())
    }
    window.addEventListener('storage', dinle)
    return () => window.removeEventListener('storage', dinle)
  }, [])

  const ekle = useCallback((kod: string, renk: RenkAnahtari, adet = 1) => {
    setSatirlar((o) => {
      const i = o.findIndex((s) => s.kod === kod && s.renk === renk)
      if (i === -1) return [...o, { kod, renk, adet }]
      const y = [...o]
      y[i] = { ...y[i], adet: Math.min(99, y[i].adet + adet) }
      return y
    })
  }, [])

  const adetDegistir = useCallback((kod: string, renk: RenkAnahtari, adet: number) => {
    setSatirlar((o) =>
      adet <= 0
        ? o.filter((s) => !(s.kod === kod && s.renk === renk))
        : o.map((s) =>
            s.kod === kod && s.renk === renk ? { ...s, adet: Math.min(99, adet) } : s,
          ),
    )
  }, [])

  const cikar = useCallback((kod: string, renk: RenkAnahtari) => {
    setSatirlar((o) => o.filter((s) => !(s.kod === kod && s.renk === renk)))
  }, [])

  const bosalt = useCallback(() => setSatirlar([]), [])

  const deger = useMemo<SepetDurumu>(() => {
    const cozulmus: CozulmusSatir[] = []
    for (const s of satirlar) {
      const urun = URUNLER.find((u) => u.kod === s.kod)
      // Katalogdan kalkmış ürün sepette görünmez.
      if (urun) cozulmus.push({ ...s, urun })
    }
    const eksikFiyat = cozulmus.some((s) => s.urun.fiyatKurus == null)
    return {
      satirlar: cozulmus,
      adet: cozulmus.reduce((t, s) => t + s.adet, 0),
      araToplamKurus: eksikFiyat
        ? null
        : cozulmus.reduce((t, s) => t + (s.urun.fiyatKurus ?? 0) * s.adet, 0),
      hazir,
      ekle,
      adetDegistir,
      cikar,
      bosalt,
    }
  }, [satirlar, hazir, ekle, adetDegistir, cikar, bosalt])

  return <Baglam.Provider value={deger}>{children}</Baglam.Provider>
}

export function useSepet(): SepetDurumu {
  const d = useContext(Baglam)
  if (!d) throw new Error('useSepet, SepetSaglayici içinde çağrılmalı')
  return d
}
