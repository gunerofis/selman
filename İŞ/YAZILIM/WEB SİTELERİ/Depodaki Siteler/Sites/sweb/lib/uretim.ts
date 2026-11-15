/**
 * Üretim yetenekleri.
 *
 * Yapay zekâ müşterinin anlattığını yalnız BURADAKİ sınırlar içinde bir
 * ürüne çevirir. Liste dar tutulur: yapamadığımız bir şeyi vaat etmek,
 * yapabildiğimizi göstermemekten pahalıdır.
 *
 * Değerler Faris'in onayını bekliyor — şu an kataloğdaki 36 üründen
 * okunan aralıklar.
 */

export type Form = {
  anahtar: string
  ad: string
  aciklama: string
  /** Bu formda ürettiğimiz örnek kodlar; öneri eşleşmesinde kullanılır. */
  ornekler: readonly string[]
}

export const FORMLAR: readonly Form[] = [
  { anahtar: 'tepsi', ad: 'Tepsi ve bölmeli kutu', aciklama: 'Çekmeceye veya tezgâha oturur, bölmeleri ayarlanır.', ornekler: ['7034', '7046', '7018'] },
  { anahtar: 'organizer', ad: 'Tezgâh organizeri', aciklama: 'Ayakta durur, yuva ve bölme taşır.', ornekler: ['7005', '7030', '7041'] },
  { anahtar: 'doner', ad: 'Döner gövde', aciklama: 'Tabanı döner, dört yüzü de kullanılır.', ornekler: ['7042', '7048', '7055'] },
  { anahtar: 'duvar', ad: 'Duvar ünitesi', aciklama: 'Duvara asılır, raf ve cep taşır.', ornekler: ['7014', '7015', '7047'] },
  { anahtar: 'kapakli', ad: 'Kapaklı kutu', aciklama: 'Menteşeli veya sürgü kapak, iç bölme.', ornekler: ['7037', '7043', '7049'] },
  { anahtar: 'cekmeceli', ad: 'Çekmeceli gövde', aciklama: 'Bir veya iki çekmece, üstte açık alan.', ornekler: ['7026', '7033', '7036'] },
  { anahtar: 'stand', ad: 'Stand ve askı', aciklama: 'Dik tutar, yuvaya oturtur.', ornekler: ['7002', '7045', '7032'] },
  { anahtar: 'mobilya', ad: 'Küçük mobilya', aciklama: 'Bank, sehpa, dolap ölçeğinde.', ornekler: ['7010', '7012', '7024'] },
]

/** Milimetre. Bu aralığın dışına çıkan talep tekliflendirilir, üretilmez. */
export const OLCU_SINIRI = {
  enAz: 80,
  enCok: 900,
  /** Tek parçada en büyük hacim (litre); üstü çok parçalı olur. */
  enCokHacimL: 60,
} as const

export type Malzeme = { anahtar: string; ad: string; not: string }

export const MALZEMELER: readonly Malzeme[] = [
  { anahtar: 'deri', ad: 'Deri kaplama', not: 'Standart yüzey; sekiz rengin tamamı.' },
  { anahtar: 'keceli', ad: 'Keçe astar', not: 'İç yüzey; takı ve saat bölmelerinde.' },
  { anahtar: 'metal', ad: 'Metal detay', not: 'Askı, ayak, kanca ve tel elemanlar.' },
  { anahtar: 'ahsap', ad: 'Ahşap gövde', not: 'Taşıyıcı iskelet; deri altında kalır.' },
]

export type Ozellik = { anahtar: string; ad: string }

export const OZELLIKLER: readonly Ozellik[] = [
  { anahtar: 'cekmece', ad: 'Çekmece' },
  { anahtar: 'kapak', ad: 'Kapak' },
  { anahtar: 'ayna', ad: 'Ayna' },
  { anahtar: 'doner-taban', ad: 'Döner taban' },
  { anahtar: 'duvar-montaj', ad: 'Duvara montaj' },
  { anahtar: 'bolme', ad: 'Ayarlanır bölme' },
  { anahtar: 'kaymaz-taban', ad: 'Kaymaz taban' },
  { anahtar: 'logo', ad: 'Logo baskı' },
]

/** Yapamadıklarımız. Yapay zekâya açıkça verilir ki uydurmasın. */
export const YAPILMAYANLAR: readonly string[] = [
  'Elektrikli veya elektronik parça',
  'Cam ve seramik gövde',
  'Dış mekân ve suya dayanıklı ürün',
  'Tek parçada 900 mm üstü ölçü',
  'Gıdayla doğrudan temas eden yüzey',
]

export const TESLIM = { numuneIsGunu: [10, 15] as const, uretimIsGunu: [20, 30] as const }
export const EN_AZ_ADET = 50
