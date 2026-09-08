/**
 * Sabit renk listesi — site-plani.md "Dil": renk adları sabit liste.
 * Sıra değişmez; duvar üstündeki 8 nokta bu sırayı kullanır.
 */
export const RENKLER = [
  { anahtar: 'krem', ad: 'Krem', hex: '#E9DCCB', zemin: 'var(--color-p-krem)' },
  { anahtar: 'taba', ad: 'Taba', hex: '#B9926A', zemin: 'var(--color-p-taba)' },
  { anahtar: 'gri', ad: 'Gri', hex: '#8C8F8B', zemin: 'var(--color-p-gri)' },
  { anahtar: 'lacivert', ad: 'Lacivert', hex: '#2C3542', zemin: 'var(--color-p-lacivert)' },
  { anahtar: 'bordo', ad: 'Bordo', hex: '#6B2D36', zemin: 'var(--color-p-bordo)' },
  { anahtar: 'kahve', ad: 'Kahve', hex: '#4A3B2E', zemin: 'var(--color-p-krem)' },
  { anahtar: 'beyaz', ad: 'Beyaz', hex: '#FDFAF6', zemin: 'var(--color-p-gri)' },
  { anahtar: 'siyah', ad: 'Siyah', hex: '#26241F', zemin: 'var(--color-p-siyah)' },
] as const

export type RenkAnahtari = (typeof RENKLER)[number]['anahtar']

export const RENK_ANAHTARLARI = RENKLER.map((r) => r.anahtar) as readonly RenkAnahtari[]

export function renkBul(anahtar: string | null | undefined) {
  if (!anahtar) return null
  return RENKLER.find((r) => r.anahtar === anahtar) ?? null
}
