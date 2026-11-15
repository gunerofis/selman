export const site = {
  ad: 'Sweb',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sweb-phi.vercel.app',
  dil: 'tr-TR',
  paraBirimi: 'TRY',
} as const

/** Ana gezinme. Buton/link metni fiille veya işlevle başlar, sıfat taşımaz. */
export const anaMenu = [
  { ad: 'Ürünler', yol: '/kategori' },
  { ad: 'Duvarını kur', yol: '/duvar-kur' },
  { ad: 'Tasarımınızı gönderin', yol: '/tasarla' },
  { ad: 'Koleksiyon', yol: '/koleksiyon' },
  { ad: 'Kurumsal teklif', yol: '/kurumsal-teklif' },
  { ad: 'Atölye', yol: '/atolye' },
  { ad: 'İletişim', yol: '/iletisim' },
] as const

export const hukukiSayfalar = [
  { ad: 'Mesafeli satış sözleşmesi', yol: '/mesafeli-satis-sozlesmesi' },
  { ad: 'Teslimat ve iade', yol: '/teslimat-ve-iade' },
  { ad: 'Gizlilik politikası', yol: '/gizlilik-politikasi' },
  { ad: 'Çerez politikası', yol: '/cerez-politikasi' },
  { ad: 'KVKK aydınlatma metni', yol: '/kvkk-aydinlatma-metni' },
] as const
