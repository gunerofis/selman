import { NextResponse } from 'next/server'
import * as d from '@/lib/dogrula'
import { URUNLER } from '@/lib/urunler'
import { RENK_ANAHTARLARI } from '@/lib/renkler'
import { KARGO, ODEME } from '@/lib/teslimat'
import { istemciKimligi, sinirAsildi } from '@/lib/istek-siniri'
import { siparisOlustur, yazmaAcik } from '@/lib/siparis-deposu'
import { siparisAlindiPostasi } from '@/lib/eposta'

/**
 * Sipariş oluşturma.
 *
 * Sipariş ödeme sağlayıcısından bağımsız olarak önce kalıcı kaydedilir —
 * yalnız loga düşen sipariş kaybolur. Kayıt jeton döndürür; müşteri
 * `/siparis/<jeton>` adresinden durumunu görür, aynı bağlantı e-postaya
 * da girer.
 *
 * Ödeme sağlayıcısı hâlâ seçilmedi; `odendi: false` dönüyor.
 *
 * Fiyat istemciden ALINMAZ; her kalem katalogdan yeniden fiyatlanır.
 */
export async function POST(istek: Request) {
  if (sinirAsildi(istemciKimligi(istek))) {
    return NextResponse.json({ mesaj: 'Çok fazla deneme. Biraz bekleyin.' }, { status: 429 })
  }

  let govde: unknown
  try {
    govde = await istek.json()
  } catch {
    return NextResponse.json({ mesaj: 'Geçersiz istek.' }, { status: 400 })
  }

  const { musteri, satirlar, kargo, odeme } = (govde ?? {}) as Record<string, any>

  const hatalar = d.topla({
    ad: d.metin(musteri?.ad),
    eposta: d.eposta(musteri?.eposta),
    telefon: d.telefon(musteri?.telefon, true),
    adres: d.metin(musteri?.adres, 10, 400),
    il: d.metin(musteri?.il),
    ilce: d.metin(musteri?.ilce),
    postaKodu: d.metin(musteri?.postaKodu, 5, 10),
  })
  if (Object.keys(hatalar).length > 0) {
    return NextResponse.json({ mesaj: 'Formu kontrol edin.', hatalar }, { status: 422 })
  }

  if (!Array.isArray(satirlar) || satirlar.length === 0) {
    return NextResponse.json({ mesaj: 'Sepet boş.' }, { status: 422 })
  }
  if (!KARGO.some((k) => k.anahtar === kargo) || !ODEME.some((o) => o.anahtar === odeme)) {
    return NextResponse.json({ mesaj: 'Geçersiz kargo veya ödeme seçimi.' }, { status: 422 })
  }

  // Kalemleri katalogla eşle ve sunucu tarafında fiyatla.
  const kalemler = []
  for (const s of satirlar) {
    const urun = URUNLER.find((u) => u.kod === s?.kod)
    if (!urun) return NextResponse.json({ mesaj: `Bilinmeyen ürün: ${s?.kod}` }, { status: 422 })
    if (!RENK_ANAHTARLARI.includes(s?.renk) || !urun.renkler.includes(s.renk)) {
      return NextResponse.json({ mesaj: `Bu ürün için geçersiz renk: ${s?.kod}` }, { status: 422 })
    }
    const adetHatasi = d.sayi(s?.adet, 1, 99)
    if (adetHatasi) return NextResponse.json({ mesaj: adetHatasi }, { status: 422 })
    kalemler.push({ kod: urun.kod, renk: s.renk, adet: s.adet, birimKurus: urun.fiyatKurus })
  }

  const eksikFiyat = kalemler.some((k) => k.birimKurus == null)
  const araToplamKurus = eksikFiyat
    ? null
    : kalemler.reduce((t, k) => t + (k.birimKurus ?? 0) * k.adet, 0)

  const kargoSecenegi = KARGO.find((k) => k.anahtar === kargo)!
  const kargoKurus = kargoSecenegi.ucretKurus
  const toplamKurus =
    araToplamKurus == null || kargoKurus == null ? null : araToplamKurus + kargoKurus

  const siparisNo = `S${Date.now().toString(36).toUpperCase()}`

  const musteriKaydi = {
    ad: String(musteri.ad).trim(),
    eposta: String(musteri.eposta).trim(),
    telefon: String(musteri.telefon ?? '').trim(),
    adres: String(musteri.adres).trim(),
    il: String(musteri.il).trim(),
    ilce: String(musteri.ilce).trim(),
    postaKodu: String(musteri.postaKodu).trim(),
    not: typeof musteri.not === 'string' ? musteri.not.slice(0, 500) : undefined,
  }

  let jeton: string | null = null
  if (yazmaAcik) {
    try {
      jeton = await siparisOlustur({
        no: siparisNo,
        musteri: musteriKaydi,
        kalemler,
        kargo,
        odeme,
        araToplamKurus,
        kargoKurus,
        toplamKurus,
      })
    } catch (e) {
      // Kayıt tutulamazsa sipariş yine de alınır; en azından loga düşer.
      console.error('[siparis] kayıt hatası', e)
    }
  }
  if (!jeton) console.info('[siparis] kayıtsız', { siparisNo, kalemler, kargo, odeme })

  // TODO(faz 4b): ödeme sağlayıcısını burada başlat.
  await siparisAlindiPostasi({
    eposta: musteriKaydi.eposta,
    siparisNo,
    jeton,
    kalemler,
    toplamKurus,
  })

  return NextResponse.json({ siparisNo, jeton, araToplamKurus, toplamKurus, odendi: false })
}
