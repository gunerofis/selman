/**
 * Form doğrulama. Aynı kurallar hem istemcide hem API route'ta çalışsın diye
 * tek yerde; tarayıcı doğrulaması atlanabildiği için sunucu tarafı zorunlu.
 */

export type Hatalar = Record<string, string>

const EPOSTA = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
// TR cep: 5xx xxx xx xx, boşluk/tire/parantez serbest
const TELEFON = /^(\+?90)?0?5\d{9}$/

export function metin(deger: unknown, enAz = 2, enCok = 200): string | null {
  if (typeof deger !== 'string') return 'Bu alan gerekli.'
  const t = deger.trim()
  if (t.length < enAz) return 'Bu alan gerekli.'
  if (t.length > enCok) return `En çok ${enCok} karakter.`
  return null
}

export function eposta(deger: unknown): string | null {
  if (typeof deger !== 'string' || !EPOSTA.test(deger.trim())) return 'Geçerli e-posta girin.'
  return null
}

export function telefon(deger: unknown, zorunlu = false): string | null {
  if (typeof deger !== 'string' || deger.trim() === '') return zorunlu ? 'Telefon gerekli.' : null
  const temiz = deger.replace(/[\s()-]/g, '')
  return TELEFON.test(temiz) ? null : 'Geçerli telefon girin.'
}

export function sayi(deger: unknown, enAz = 1, enCok = 100000): string | null {
  const n = Number(deger)
  if (!Number.isFinite(n) || !Number.isInteger(n)) return 'Sayı girin.'
  if (n < enAz) return `En az ${enAz}.`
  if (n > enCok) return `En çok ${enCok}.`
  return null
}

/** Alan adı → doğrulayıcı. Boş nesne dönerse form geçerli. */
export function topla(kurallar: Record<string, string | null>): Hatalar {
  const h: Hatalar = {}
  for (const [alan, hata] of Object.entries(kurallar)) if (hata) h[alan] = hata
  return h
}
