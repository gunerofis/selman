/**
 * Dil kuralı — site-plani.md:
 * ölçü mm, ağırlık g, süre iş günü. Sayı biçimi tr-TR.
 * Bu dosyanın dışında elle sayı biçimlendirilmez.
 */

/**
 * Sembol elle eklenir. `style: 'currency'` sembolü ICU sürümüne göre başa
 * veya sona koyabiliyor; sunucu ile tarayıcı farklı yazınca hydration
 * uyuşmazlığı çıkar. Stil rehberindeki biçim: "1.450,00 ₺".
 */
const tutar = new Intl.NumberFormat('tr-TR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const sayi = new Intl.NumberFormat('tr-TR')

/** Veri henüz girilmemişse her alan bu işareti gösterir. */
export const YOK = '—'

/** 145000 → "1.450,00 ₺" · null → "—" */
export function fiyat(kurus: number | null): string {
  if (kurus == null) return YOK
  return `${tutar.format(kurus / 100)} ₺`
}

/** [240, 160, 90] → "240 × 160 × 90 mm" */
export function olcu(mm: readonly number[] | null): string {
  if (!mm) return YOK
  return `${mm.map((n) => sayi.format(n)).join(' × ')} mm`
}

/** 380 → "380 g" */
export function agirlik(g: number | null): string {
  if (g == null) return YOK
  return `${sayi.format(g)} g`
}

/** [3, 5] → "3-5 iş günü" · [2, 2] → "2 iş günü" */
export function teslim(aralik: readonly [number, number] | null): string {
  if (!aralik) return YOK
  const [en, cok] = aralik
  return en === cok ? `${en} iş günü` : `${en}-${cok} iş günü`
}
