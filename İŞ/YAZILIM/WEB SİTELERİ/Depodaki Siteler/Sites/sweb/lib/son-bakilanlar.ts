import { URUNLER, type Urun } from './urunler'

/**
 * Son bakılan ürünler.
 *
 * Yalnız tarayıcıda duruyor; sunucuya gitmiyor, çerez gerektirmiyor,
 * bu yüzden izin bandına da girmiyor (KVKK/GDPR: işlevsel, kişi
 * tanımlamıyor). Satırda yalnız ürün kodu var; ad, fiyat ve görsel her
 * açılışta katalogdan tazeleniyor.
 */
const ANAHTAR = 'sweb-son-bakilan-v1'
const SINIR = 8

export function oku(): readonly Urun[] {
  if (typeof window === 'undefined') return []
  try {
    const ham = window.localStorage.getItem(ANAHTAR)
    if (!ham) return []
    const kodlar = JSON.parse(ham)
    if (!Array.isArray(kodlar)) return []
    return kodlar
      .map((k: unknown) => URUNLER.find((u) => u.kod === k))
      .filter((u): u is Urun => Boolean(u))
      .slice(0, SINIR)
  } catch {
    return []
  }
}

/** Ürünü başa alır; zaten listede varsa yukarı taşır, kopya oluşturmaz. */
export function ekle(kod: string) {
  if (typeof window === 'undefined') return
  try {
    const suan = oku().map((u) => u.kod)
    const yeni = [kod, ...suan.filter((k) => k !== kod)].slice(0, SINIR)
    window.localStorage.setItem(ANAHTAR, JSON.stringify(yeni))
  } catch {
    // özel sekme veya dolu depolama: iz tutulmaz, akış durmaz
  }
}
