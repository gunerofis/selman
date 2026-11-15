import { URUNLER, type Urun } from './urunler'
import { KATEGORILER, kategoriAdi } from './kategoriler'
import { RENKLER } from './renkler'

/**
 * Metin eşleşmesi — arama ve tasarım brifi aynı kökten çalışır.
 *
 * Kural tabanlı: sunucuda ve istemcide aynı sonucu vermeli, dizin
 * kurmadan 36 ürün üzerinde çalışmalı. Katalog büyüyünce burası bir arama
 * servisine devredilir; çağıran taraf değişmez.
 */

/** Türkçe ekleri kabaca atar, karşılaştırma için sadeleştirir. */
export function kokle(kelime: string): string {
  const k = kelime
    .toLocaleLowerCase('tr')
    .normalize('NFC')
    .replace(/[^a-zçğıöşü0-9]/g, '')
  if (k.length <= 4) return k
  return k.replace(/(lari|leri|lar|ler|ini|ının|nin|nın|den|dan|tan|ten|ya|ye|si|sı|i|ı|u|ü)$/u, '')
}

const DURDURMA = new Set([
  've', 'ile', 'için', 'bir', 'bu', 'şu', 'olan', 'gibi', 'daha', 'çok', 'az',
  'var', 'yok', 'ama', 'veya', 'ki', 'de', 'da', 'en', 'her',
])

export function kelimeler(metin: string): string[] {
  return metin
    .split(/\s+/)
    .map(kokle)
    .filter((k) => k.length > 2 && !DURDURMA.has(k))
}

/**
 * Bir kök, alanın kökleri içinde geçiyor mu?
 *
 * Tam eşleşme ve önek eşleşmesi ayrı puan alır: "kah" yazan biri "kahve"yi
 * bulmalı ama tam yazana göre daha az puanla — yarım kelime tam kelimeyi
 * geçmesin.
 */
function esles(kok: string, kokler: ReadonlySet<string>): 'tam' | 'onek' | null {
  if (kokler.has(kok)) return 'tam'
  if (kok.length >= 3) {
    for (const k of kokler) if (k.startsWith(kok)) return 'onek'
  }
  return null
}

const PUAN = { ad: 5, aciklama: 2, kategori: 1, renk: 1 } as const
/** Önek eşleşmesi tam eşleşmenin yarısı kadar sayılır. */
const ONEK_ORANI = 0.5

type Dizin = {
  urun: Urun
  ad: Set<string>
  aciklama: Set<string>
  kategori: Set<string>
  renk: Set<string>
}

/** Modül ömrü boyunca bir kez kurulur; katalog derleme zamanında sabit. */
const DIZIN: readonly Dizin[] = URUNLER.map((urun) => ({
  urun,
  ad: new Set(kelimeler(urun.ad)),
  aciklama: new Set(kelimeler(urun.aciklama)),
  kategori: new Set(kelimeler(kategoriAdi(urun.kategori) + ' ' + urun.kategori)),
  renk: new Set(
    urun.renkler.flatMap((r) => kelimeler(RENKLER.find((x) => x.anahtar === r)?.ad ?? r)),
  ),
}))

export type Sonuc = { urun: Urun; puan: number }

/**
 * Katalog araması. Ürün kodu tam yazıldıysa o ürün her zaman başa gelir —
 * kod arayan biri listeye bakmak istemez.
 */
export function ara(sorgu: string, adet = 24): readonly Sonuc[] {
  const temiz = sorgu.trim()
  if (temiz.length < 2) return []

  const kod = temiz.replace(/\D/g, '')
  const kokler = kelimeler(temiz)
  if (kokler.length === 0 && !kod) return []

  const sonuclar: Sonuc[] = []
  for (const d of DIZIN) {
    let puan = 0
    if (kod.length >= 3 && d.urun.kod.includes(kod)) puan += d.urun.kod === kod ? 40 : 12

    for (const k of kokler) {
      for (const [alan, agirlik] of [
        ['ad', PUAN.ad],
        ['aciklama', PUAN.aciklama],
        ['kategori', PUAN.kategori],
        ['renk', PUAN.renk],
      ] as const) {
        const tur = esles(k, d[alan])
        if (tur) {
          puan += tur === 'tam' ? agirlik : agirlik * ONEK_ORANI
          break // Aynı kelime bir üründe en ağır alandan bir kez sayılır.
        }
      }
    }
    if (puan > 0) sonuclar.push({ urun: d.urun, puan })
  }

  // Eşit puanda kod sırası — sonuç sırası her istekte aynı olsun.
  return sonuclar
    .sort((a, b) => b.puan - a.puan || a.urun.kod.localeCompare(b.urun.kod))
    .slice(0, adet)
}

/** Sorguyla örtüşen kategoriler; arama sayfası ürünlerin üstünde gösterir. */
export function kategoriOnerileri(sorgu: string, adet = 4) {
  const kokler = kelimeler(sorgu)
  if (kokler.length === 0) return []
  return KATEGORILER.map((kat) => {
    const kokSeti = new Set(kelimeler(kat.ad + ' ' + kat.slug))
    const puan = kokler.reduce((t, k) => t + (esles(k, kokSeti) === 'tam' ? 2 : esles(k, kokSeti) ? 1 : 0), 0)
    return { kategori: kat, puan }
  })
    .filter((x) => x.puan > 0)
    .sort((a, b) => b.puan - a.puan)
    .slice(0, adet)
    .map((x) => x.kategori)
}
