import { URUNLER, type Urun } from './urunler'
import { FORMLAR, MALZEMELER, OZELLIKLER, OLCU_SINIRI, YAPILMAYANLAR, EN_AZ_ADET } from './uretim'
import type { RenkAnahtari } from './renkler'
import { kelimeler } from './arama'

/** Müşterinin doldurduğu brif. */
export type Brif = {
  /** Serbest metin: ne istediğini kendi cümleleriyle. */
  anlatim: string
  form: string
  malzemeler: readonly string[]
  ozellikler: readonly string[]
  renk: RenkAnahtari | null
  /** mm; boş bırakılabilir, yapay zekâ önerir. */
  enMm: number | null
  boyMm: number | null
  yukseklikMm: number | null
  adet: number
  eposta: string
}

/** Yapay zekânın döndürmesi gereken ürün önerisi. */
export type Oneri = {
  ad: string
  aciklama: string
  form: string
  olcuMm: readonly [number, number, number]
  malzemeler: readonly string[]
  ozellikler: readonly string[]
  /** Kuruş; adet ve ölçüye göre. */
  birimFiyatKurus: number
  /** Görsel hazır değilse null. */
  gorsel: string | null
  /** Üretilemeyen istekler burada açıkça yazılır. */
  uyarilar: readonly string[]
}

/**
 * Yapay zekâya verilecek sistem talimatı.
 *
 * Yetenek listesi koddan üretilir; `lib/uretim.ts` değişince talimat da
 * değişir, ikisi ayrışmaz.
 */
export function sistemTalimati(): string {
  return [
    'Bir deri kaplama düzen ürünleri atölyesinin ürün tasarımcısısın.',
    'Müşterinin anlatımını YALNIZ aşağıdaki üretim yetenekleri içinde bir ürüne çevir.',
    '',
    'Formlar:',
    ...FORMLAR.map((f) => `- ${f.ad}: ${f.aciklama}`),
    '',
    'Malzemeler:',
    ...MALZEMELER.map((m) => `- ${m.ad}: ${m.not}`),
    '',
    'Özellikler: ' + OZELLIKLER.map((o) => o.ad).join(', '),
    '',
    `Ölçü sınırı: ${OLCU_SINIRI.enAz}-${OLCU_SINIRI.enCok} mm, en çok ${OLCU_SINIRI.enCokHacimL} litre.`,
    `En az sipariş: ${EN_AZ_ADET} adet.`,
    '',
    'Yapılmayanlar:',
    ...YAPILMAYANLAR.map((y) => `- ${y}`),
    '',
    'Kurallar:',
    '- Ürün adı işlevle başlar, sıfat taşımaz, küçük harfle yazılır.',
    '- Sınır dışındaki her istek `uyarilar` içinde açıkça yazılır, sessizce değiştirilmez.',
    '- Ölçü verilmemişse işlevden makul bir ölçü öner.',
    '- Yalnız geçerli JSON döndür.',
  ].join('\n')
}

/* -------------------------------------------------------------------------
   Katalog eşleşmesi.
   Yapay zekâ çalışırken müşteriye boş ekran göstermemek için brifle
   örtüşen mevcut ürünler hemen listelenir. Sunucuda da istemcide de aynı
   sonucu vermesi gerektiğinden tamamen kural tabanlı.
   ------------------------------------------------------------------------- */

export type Eslesme = { urun: Urun; puan: number }

/**
 * Brifi katalogla eşleştirir. Ürün adı en ağır, açıklama orta, kategori
 * hafif; seçilen form o formun örnek ürünlerine puan ekler.
 */
export function benzerUrunler(brif: Pick<Brif, 'anlatim' | 'form'>, adet = 6): readonly Eslesme[] {
  const aranan = new Set(kelimeler(brif.anlatim))
  const formOrnekleri = new Set(FORMLAR.find((f) => f.anahtar === brif.form)?.ornekler ?? [])

  const puanlar: Eslesme[] = URUNLER.map((urun) => {
    let puan = 0
    const ad = new Set(kelimeler(urun.ad))
    const acik = new Set(kelimeler(urun.aciklama))
    const kat = new Set(kelimeler(urun.kategori))

    for (const k of aranan) {
      if (ad.has(k)) puan += 5
      else if (acik.has(k)) puan += 2
      else if (kat.has(k)) puan += 1
    }
    if (formOrnekleri.has(urun.kod)) puan += 3
    return { urun, puan }
  })

  const eslesenler = puanlar.filter((p) => p.puan > 0).sort((a, b) => b.puan - a.puan)
  // Hiç eşleşme yoksa form örnekleriyle, o da yoksa katalog başıyla doldur.
  const yedek = puanlar.filter((p) => p.puan === 0)
  return [...eslesenler, ...yedek].slice(0, adet)
}
