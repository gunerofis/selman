'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

const ANAHTAR = 'sweb-cerez-v1'

/**
 * Çerez izni.
 *
 * Zorunlu çerezler her zaman açık (sepet, oturum). Analytics ve reklam
 * kullanıcı açıkça kabul edene kadar YÜKLENMEZ — KVKK ve GDPR ikisi de
 * önceden izin istiyor. Karar verilene kadar durum `null`.
 */
export type Izinler = { analitik: boolean; pazarlama: boolean }

const VARSAYILAN: Izinler = { analitik: false, pazarlama: false }

type Durum = {
  izinler: Izinler | null
  hazir: boolean
  kaydet: (i: Izinler) => void
  hepsiniKabul: () => void
  hepsiniReddet: () => void
  sifirla: () => void
}

const Baglam = createContext<Durum | null>(null)

export function CerezSaglayici({ children }: { children: ReactNode }) {
  const [izinler, setIzinler] = useState<Izinler | null>(null)
  const [hazir, setHazir] = useState(false)

  useEffect(() => {
    try {
      const ham = window.localStorage.getItem(ANAHTAR)
      if (ham) {
        const v = JSON.parse(ham)
        setIzinler({ analitik: !!v.analitik, pazarlama: !!v.pazarlama })
      }
    } catch {
      // depolama kapalıysa izin sorulmuş sayılmaz; her açılışta sorulur
    }
    setHazir(true)
  }, [])

  const kaydet = useCallback((i: Izinler) => {
    setIzinler(i)
    try {
      window.localStorage.setItem(ANAHTAR, JSON.stringify(i))
    } catch {
      /* yoksay */
    }
  }, [])

  const deger = useMemo<Durum>(
    () => ({
      izinler,
      hazir,
      kaydet,
      hepsiniKabul: () => kaydet({ analitik: true, pazarlama: true }),
      hepsiniReddet: () => kaydet(VARSAYILAN),
      sifirla: () => {
        setIzinler(null)
        try {
          window.localStorage.removeItem(ANAHTAR)
        } catch {
          /* yoksay */
        }
      },
    }),
    [izinler, hazir, kaydet],
  )

  return <Baglam.Provider value={deger}>{children}</Baglam.Provider>
}

export function useCerez(): Durum {
  const d = useContext(Baglam)
  if (!d) throw new Error('useCerez, CerezSaglayici içinde çağrılmalı')
  return d
}
