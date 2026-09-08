/**
 * Kargo ve ödeme seçenekleri.
 *
 * Tutarlar ve sağlayıcı seçimi Faris'te; buradaki liste arayüzün beklediği
 * şekli tanımlıyor. `ucretKurus: null` → "—" görünür, hesaba katılmaz.
 */
export type KargoSecenegi = {
  anahtar: string
  ad: string
  sure: string
  ucretKurus: number | null
}

export const KARGO: readonly KargoSecenegi[] = [
  { anahtar: 'standart', ad: 'Standart kargo', sure: '3-5 iş günü', ucretKurus: null },
  { anahtar: 'hizli', ad: 'Hızlı kargo', sure: '1-2 iş günü', ucretKurus: null },
]

export type OdemeSecenegi = { anahtar: string; ad: string; not: string }

export const ODEME: readonly OdemeSecenegi[] = [
  { anahtar: 'kart', ad: 'Kredi kartı', not: 'Sağlayıcı bağlanacak' },
  { anahtar: 'havale', ad: 'Havale / EFT', not: 'Sipariş sonrası hesap bilgisi' },
]
