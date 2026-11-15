import { rpc, yaz } from './depo'

export { depoAcik, yazmaAcik } from './depo'

/**
 * Siparişlerin kalıcı kaydı.
 *
 * Yalnız loga düşen sipariş kaybolur; bu yüzden ödeme sağlayıcısından
 * bağımsız olarak her sipariş önce veritabanına yazılır.
 *
 * Okuma jetonla yapılır ve **ad, telefon, açık adres döndürmez** —
 * yalnız il/ilçe. Sipariş bağlantısı sızsa bile müşterinin kimliği ve
 * adresi sızmaz; müşteri kendi siparişinin durumunu yine de görür.
 */
export type SiparisKalemi = {
  kod: string
  renk: string
  adet: number
  birimKurus: number | null
}

export type Siparis = {
  no: string
  olusturuldu: string
  durum: 'alindi' | 'odendi' | 'hazirlaniyor' | 'kargolandi' | 'teslim' | 'iptal'
  kalemler: readonly SiparisKalemi[]
  kargo: string
  odeme: string
  ara_toplam_kurus: number | null
  kargo_kurus: number | null
  toplam_kurus: number | null
  kargo_takip: string | null
  il: string | null
  ilce: string | null
}

export type Musteri = {
  ad: string
  eposta: string
  telefon: string
  adres: string
  il: string
  ilce: string
  postaKodu: string
  not?: string
}

/** Siparişi kaydeder, durum sayfasının adresinde kullanılacak jetonu döndürür. */
export async function siparisOlustur(girdi: {
  no: string
  musteri: Musteri
  kalemler: readonly SiparisKalemi[]
  kargo: string
  odeme: string
  araToplamKurus: number | null
  kargoKurus: number | null
  toplamKurus: number | null
}): Promise<string> {
  return yaz<string>('sweb_siparis_olustur', {
    p_no: girdi.no,
    p_eposta: girdi.musteri.eposta,
    p_musteri: girdi.musteri,
    p_kalemler: girdi.kalemler,
    p_kargo: girdi.kargo,
    p_odeme: girdi.odeme,
    p_ara_toplam_kurus: girdi.araToplamKurus,
    p_kargo_kurus: girdi.kargoKurus,
    p_toplam_kurus: girdi.toplamKurus,
  })
}

/** Jetonla okur. Bulunamazsa null. */
export async function siparisGetir(jeton: string): Promise<Siparis | null> {
  const satirlar = await rpc<Siparis[]>('sweb_siparis_getir', { p_jeton: jeton })
  return satirlar[0] ?? null
}

export const DURUM_ADI: Record<Siparis['durum'], string> = {
  alindi: 'Alındı',
  odendi: 'Ödendi',
  hazirlaniyor: 'Hazırlanıyor',
  kargolandi: 'Kargoya verildi',
  teslim: 'Teslim edildi',
  iptal: 'İptal',
}
