import { URUNLER, type Urun } from './urunler'

/**
 * Kategori ağacı.
 *
 * İki seviye destekleniyor: `ust` alanı olan kategori alt kategoridir.
 * Bir kategori hem kendi ürünlerini taşıyabilir hem alt kategorisi olabilir.
 * Şu an tek gerçek iç içe örnek `kahve`; ağaç Faris'in kararına göre
 * genişleyecek, kod tarafında başka değişiklik gerekmiyor.
 */
export type Kategori = {
  slug: string
  ad: string
  /** Üst kategorinin slug'ı. Yoksa kök kategoridir. */
  ust?: string
  /**
   * Kategori kapağı — sayfanın başında geniş görsel.
   *
   * Tanımlı olan kategoride basılır, olmayanda hiç yer kaplamaz. Ürün
   * çekimi değil, kurulum sahnesi: koleksiyonun bir arada nasıl durduğunu
   * gösteriyor. Kalıp: `/kategori/<slug>.webp`
   */
  kapak?: { yol: string; alt: string }
}

export const KATEGORILER: readonly Kategori[] = [
  { slug: 'banyo', ad: 'Banyo' },
  { slug: 'mutfak', ad: 'Mutfak' },
  { slug: 'kahve', ad: 'Kahve', ust: 'mutfak' },
  { slug: 'makyaj', ad: 'Makyaj' },
  { slug: 'giris', ad: 'Giriş' },
  { slug: 'calisma', ad: 'Çalışma' },
  { slug: 'yatak-odasi', ad: 'Yatak odası' },
  { slug: 'ev', ad: 'Ev' },
  {
    slug: 'ofis',
    ad: 'Ofis',
    kapak: {
      yol: '/kategori/ofis.webp',
      alt: 'Ofis koleksiyonu bir masanın üstünde: ped, tepsiler, telefon ve kulaklık standı.',
    },
  },
]

export const KOK_KATEGORILER = KATEGORILER.filter((k) => !k.ust)

export function kategoriBul(slug: string): Kategori | null {
  return KATEGORILER.find((k) => k.slug === slug) ?? null
}

export function kategoriAdi(slug: string): string {
  return kategoriBul(slug)?.ad ?? slug
}

export function cocuklar(slug: string): readonly Kategori[] {
  return KATEGORILER.filter((k) => k.ust === slug)
}

/** Kökten bu kategoriye kadar zincir. Kırıntı yolu bunu kullanır. */
export function kategoriYolu(slug: string): readonly Kategori[] {
  const zincir: Kategori[] = []
  let su = kategoriBul(slug)
  while (su) {
    zincir.unshift(su)
    su = su.ust ? kategoriBul(su.ust) : null
  }
  return zincir
}

/** URL dilimleri: ['mutfak','kahve'] → kategori. Yol yanlışsa null. */
export function dilimdenKategori(dilim: readonly string[]): Kategori | null {
  if (dilim.length === 0) return null
  const son = kategoriBul(dilim[dilim.length - 1])
  if (!son) return null
  const yol = kategoriYolu(son.slug).map((k) => k.slug)
  return yol.length === dilim.length && yol.every((s, i) => s === dilim[i]) ? son : null
}

/** Kategorinin kendi ürünleri (alt kategoriler hariç). */
export function kendiUrunleri(slug: string): readonly Urun[] {
  return URUNLER.filter((u) => u.kategori === slug)
}

/** Kategori ve tüm alt kategorilerindeki ürünler. */
export function tumUrunleri(slug: string): readonly Urun[] {
  const dahil = new Set([slug, ...cocuklar(slug).map((c) => c.slug)])
  return URUNLER.filter((u) => dahil.has(u.kategori))
}

/** Kategori sayfasının kanonik yolu. */
export function kategoriYolAdresi(slug: string): string {
  return '/kategori/' + kategoriYolu(slug).map((k) => k.slug).join('/')
}

export type Siralama = 'kod' | 'ad'

export function sirala(urunler: readonly Urun[], nasil: Siralama): readonly Urun[] {
  const l = [...urunler]
  if (nasil === 'ad') return l.sort((a, b) => a.ad.localeCompare(b.ad, 'tr'))
  return l.sort((a, b) => a.kod.localeCompare(b.kod, 'tr'))
}
