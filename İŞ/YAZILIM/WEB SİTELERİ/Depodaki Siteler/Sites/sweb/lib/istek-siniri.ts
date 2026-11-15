/**
 * Basit istek sınırı ve bot tuzağı.
 *
 * Sunucusuz ortamda her örnek kendi sayacını tutar, yani bu mutlak bir
 * koruma değil — kaba bir frenden ibaret. Gerçek koruma için Vercel
 * Firewall ya da Upstash gibi paylaşımlı bir sayaç gerekir; forma bir
 * sağlayıcı bağlanırken o da kurulmalı.
 */
const pencere = new Map<string, { sayi: number; sifirlama: number }>()

const PENCERE_MS = 60_000
const SINIR = 8

export function sinirAsildi(kimlik: string): boolean {
  const simdi = Date.now()
  const kayit = pencere.get(kimlik)

  if (!kayit || simdi > kayit.sifirlama) {
    pencere.set(kimlik, { sayi: 1, sifirlama: simdi + PENCERE_MS })
    // eski kayıtları ara sıra temizle, bellek şişmesin
    if (pencere.size > 5000) {
      for (const [k, v] of pencere) if (simdi > v.sifirlama) pencere.delete(k)
    }
    return false
  }

  kayit.sayi += 1
  return kayit.sayi > SINIR
}

/** Proxy arkasındaki gerçek istemci. Vercel `x-forwarded-for` yazar. */
export function istemciKimligi(istek: Request): string {
  const f = istek.headers.get('x-forwarded-for')
  return (f ? f.split(',')[0].trim() : null) ?? istek.headers.get('x-real-ip') ?? 'bilinmiyor'
}

/**
 * Bot tuzağı. Formda gizli, ekran okuyucudan da saklı bir alan var;
 * insan doldurmaz, otomatik doldurucu doldurur. Doluysa istek sessizce
 * başarılı sayılır — bot tekrar denemesin.
 */
export const TUZAK_ALANI = 'website'

export function tuzagaDustu(govde: Record<string, unknown>): boolean {
  const d = govde[TUZAK_ALANI]
  return typeof d === 'string' && d.trim() !== ''
}
