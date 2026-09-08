import type { Brif, Oneri } from './tasarim'
import { rpc, yaz } from './depo'

/**
 * Tasarım taleplerinin kalıcı kaydı.
 *
 * Okuma jeton ister ve e-posta döndürmez — bağlantıyı ele geçiren biri
 * müşterinin adresini görmesin. Bağlantı ve gizlilik kuralları
 * `lib/depo.ts` içinde.
 */
export { depoAcik, yazmaAcik } from './depo'

export type Talep = {
  jeton: string
  olusturuldu: string
  durum: 'sirada' | 'hazir' | 'iptal'
  brif: Brif
  oneri: Oneri | null
  hata: string | null
}

/**
 * Talebi kaydeder, sayfanın adresinde kullanılacak jetonu döndürür.
 *
 * E-posta yalnız `eposta` sütununa yazılır; brif kopyasından çıkarılır.
 * `sweb_tasarim_getir` o sütunu döndürmediği için bağlantı sızsa bile
 * müşterinin adresi sızmaz — brifte kalsaydı bu koruma boşa çıkardı.
 */
export async function talepOlustur(eposta: string, brif: Brif): Promise<string> {
  const { eposta: _atilan, ...brifAdressiz } = brif
  return yaz<string>('sweb_tasarim_olustur', { p_eposta: eposta, p_brif: brifAdressiz })
}

/** Jetonla okur. Bulunamazsa null. */
export async function talepGetir(jeton: string): Promise<Talep | null> {
  const satirlar = await rpc<Talep[]>('sweb_tasarim_getir', { p_jeton: jeton })
  return satirlar[0] ?? null
}
