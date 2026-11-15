import { URUNLER, type Urun } from './urunler'

/**
 * Duvar ızgarası — site-plani.md.
 *
 *   ekran      ızgara  merkez  ürün
 *   ≥1440      6×6     4×4     21   (1 merkez + 20 çevre)
 *   768–1439   5×5     3×3     17   (1 merkez + 16 çevre)
 *   <768       4×4     2×2     13   (1 merkez + 12 çevre)
 *
 * Tek sıralı liste; her kırılım listenin ilk 21/17/13 öğesini alır.
 * Kırılım geçişi CSS ile yapılır (duvar.module.css içindeki nth-child
 * kuralları), böylece JS resize dinleyicisi ve hydration uyuşmazlığı olmaz.
 */
export const DUVAR_TOPLAM = 21
export const CEVRE_ADEDI = DUVAR_TOPLAM - 1

/**
 * Başlangıç sırası.
 *
 * Plan: "Başlangıçta sıralama rastgele; admin panelinden sürükle-sırala ile
 * sabitlenir." Rastgelelik sunucu ve istemcide aynı sonucu vermek zorunda
 * olduğu için tohumlanmış bir karıştırma kullanılır. Faz 3'te bu fonksiyon
 * CMS'teki `sira` alanını okuyacak; imzası değişmeyecek.
 */
export function duvarSirasi(tohum = 20260829): readonly (Urun | null)[] {
  const liste = [...URUNLER]
  let s = tohum

  // mulberry32 — deterministik, sunucu/istemci aynı çıktı.
  const rastgele = () => {
    s |= 0
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }

  for (let i = liste.length - 1; i > 0; i--) {
    const j = Math.floor(rastgele() * (i + 1))
    ;[liste[i], liste[j]] = [liste[j], liste[i]]
  }

  // Ürün sayısı 21'in altındaysa kalan hücreler boş zemin olarak durur;
  // ızgara bozulmaz. Katalog tamamlandığında boşluk kalmaz.
  const secim: (Urun | null)[] = liste.slice(0, DUVAR_TOPLAM)
  while (secim.length < DUVAR_TOPLAM) secim.push(null)
  return secim
}
