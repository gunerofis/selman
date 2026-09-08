import { URUNLER, type Urun } from './urunler'
import { RENK_ANAHTARLARI, type RenkAnahtari } from './renkler'

/**
 * Duvar kurucu durumu ve adres kodlaması.
 *
 * Durum tamamen URL'de: kurulan duvar bir bağlantı olarak paylaşılabiliyor,
 * geri tuşu adımları geri alıyor, hesap gerekmiyor. Biçim kısa ve okunur
 * tutuldu — sıkıştırma kütüphanesi eklemeye değmez:
 *
 *   /duvar-kur?n=4&h=7042.taba,,7005.krem,...
 *
 * `n` ızgara kenarı, `h` hücreler; boş hücre boş dizeyle geçiliyor.
 */
export const KENARLAR = [3, 4, 5, 6] as const
export type Kenar = (typeof KENARLAR)[number]

export type Hucre = { kod: string; renk: RenkAnahtari } | null

export type Duvar = { kenar: Kenar; hucreler: readonly Hucre[] }

export const VARSAYILAN_KENAR: Kenar = 4

export function bosDuvar(kenar: Kenar = VARSAYILAN_KENAR): Duvar {
  return { kenar, hucreler: Array<Hucre>(kenar * kenar).fill(null) }
}

function kenarCoz(ham: string | null): Kenar {
  const n = Number(ham)
  return (KENARLAR as readonly number[]).includes(n) ? (n as Kenar) : VARSAYILAN_KENAR
}

/** Adresten duvarı çözer. Bozuk parça sessizce boş hücreye düşer. */
export function adrestenDuvar(n: string | null, h: string | null): Duvar {
  const kenar = kenarCoz(n)
  const boyut = kenar * kenar
  const parcalar = (h ?? '').split(',')
  const hucreler: Hucre[] = []

  for (let i = 0; i < boyut; i++) {
    const [kod, renk] = (parcalar[i] ?? '').split('.')
    const urun = URUNLER.find((u) => u.kod === kod)
    const gecerli =
      urun &&
      RENK_ANAHTARLARI.includes(renk as RenkAnahtari) &&
      urun.renkler.includes(renk as RenkAnahtari)
    hucreler.push(gecerli ? { kod: urun!.kod, renk: renk as RenkAnahtari } : null)
  }
  return { kenar, hucreler }
}

/** Duvarı adres parçasına çevirir. Sondaki boş hücreler kırpılır. */
export function duvarAdresi(duvar: Duvar): string {
  const parcalar = duvar.hucreler.map((c) => (c ? `${c.kod}.${c.renk}` : ''))
  while (parcalar.length > 0 && parcalar[parcalar.length - 1] === '') parcalar.pop()
  const h = parcalar.join(',')
  return h ? `?n=${duvar.kenar}&h=${h}` : `?n=${duvar.kenar}`
}

/** Izgara kenarı değişince mevcut yerleşim korunur, satır satır taşınır. */
export function kenarDegistir(duvar: Duvar, yeni: Kenar): Duvar {
  const hucreler: Hucre[] = Array<Hucre>(yeni * yeni).fill(null)
  for (let s = 0; s < Math.min(duvar.kenar, yeni); s++) {
    for (let k = 0; k < Math.min(duvar.kenar, yeni); k++) {
      hucreler[s * yeni + k] = duvar.hucreler[s * duvar.kenar + k] ?? null
    }
  }
  return { kenar: yeni, hucreler }
}

export type Kalem = { urun: Urun; renk: RenkAnahtari; adet: number }

/** Aynı ürün+renk hücreleri tek kaleme toplanır. */
export function kalemler(duvar: Duvar): readonly Kalem[] {
  const sayac = new Map<string, Kalem>()
  for (const h of duvar.hucreler) {
    if (!h) continue
    const anahtar = `${h.kod}.${h.renk}`
    const suan = sayac.get(anahtar)
    if (suan) suan.adet += 1
    else {
      const urun = URUNLER.find((u) => u.kod === h.kod)
      if (urun) sayac.set(anahtar, { urun, renk: h.renk, adet: 1 })
    }
  }
  return [...sayac.values()].sort((a, b) => a.urun.kod.localeCompare(b.urun.kod))
}

/** Kuruş. Kalemlerden biri bile fiyatsızsa null — eksik veri toplanmaz. */
export function toplamKurus(duvar: Duvar): number | null {
  const k = kalemler(duvar)
  if (k.length === 0) return null
  if (k.some((x) => x.urun.fiyatKurus == null)) return null
  return k.reduce((t, x) => t + (x.urun.fiyatKurus ?? 0) * x.adet, 0)
}

export function doluSayisi(duvar: Duvar): number {
  return duvar.hucreler.filter(Boolean).length
}
