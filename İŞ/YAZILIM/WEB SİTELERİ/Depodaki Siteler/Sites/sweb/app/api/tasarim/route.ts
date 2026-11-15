import { NextResponse } from 'next/server'
import * as d from '@/lib/dogrula'
import { istemciKimligi, sinirAsildi, tuzagaDustu } from '@/lib/istek-siniri'
import { sistemTalimati, type Brif, type Oneri } from '@/lib/tasarim'
import { FORMLAR, MALZEMELER, OZELLIKLER, EN_AZ_ADET } from '@/lib/uretim'
import { RENK_ANAHTARLARI } from '@/lib/renkler'
import { talepOlustur, yazmaAcik } from '@/lib/talep-deposu'
import { tasarimTalebiPostasi } from '@/lib/eposta'

/**
 * Tasarım talebi.
 *
 * Akış: brif doğrulanır → yetenek listesinden sistem talimatı üretilir →
 * sağlayıcıya gönderilir → ürün önerisi ve fiyat döner.
 *
 * SAĞLAYICI HENÜZ BAĞLI DEĞİL. `TASARIM_SAGLAYICI_ANAHTARI` tanımlıysa
 * `oneriUret` çağrılır; değilse talep sıraya alınmış sayılır ve müşteriye
 * e-posta ile dönüleceği söylenir. Uydurma ürün ve uydurma fiyat
 * döndürülmez — yanlış fiyat, fiyat vermemekten pahalıdır.
 */
export async function POST(istek: Request) {
  if (sinirAsildi(istemciKimligi(istek))) {
    return NextResponse.json({ mesaj: 'Çok fazla deneme. Biraz bekleyin.' }, { status: 429 })
  }

  let g: any
  try {
    g = await istek.json()
  } catch {
    return NextResponse.json({ mesaj: 'Geçersiz istek.' }, { status: 400 })
  }

  if (tuzagaDustu(g)) return NextResponse.json({ durum: 'sirada' })

  const hatalar = d.topla({
    anlatim: d.metin(g?.anlatim, 20, 2000),
    eposta: d.eposta(g?.eposta),
    adet: d.sayi(g?.adet, EN_AZ_ADET, 100000),
    form: FORMLAR.some((f) => f.anahtar === g?.form) ? null : 'Bir form seçin.',
  })

  for (const [alan, izinli] of [
    ['malzemeler', MALZEMELER.map((m) => m.anahtar)],
    ['ozellikler', OZELLIKLER.map((o) => o.anahtar)],
  ] as const) {
    const deger = g?.[alan]
    if (deger != null && (!Array.isArray(deger) || deger.some((x: string) => !izinli.includes(x)))) {
      hatalar[alan] = 'Geçersiz seçim.'
    }
  }
  if (g?.renk != null && !RENK_ANAHTARLARI.includes(g.renk)) hatalar.renk = 'Geçersiz renk.'

  if (Object.keys(hatalar).length > 0) {
    return NextResponse.json({ mesaj: 'Formu kontrol edin.', hatalar }, { status: 422 })
  }

  const brif = g as Brif

  // Talep kalıcı kaydediliyor ve kendi adresini alıyor: müşteri hem
  // e-postadaki bağlantıdan hem site içinden aynı sayfayı açabilsin.
  let jeton: string | null = null
  if (yazmaAcik) {
    try {
      jeton = await talepOlustur(brif.eposta, brif)
    } catch (e) {
      // Kayıt tutulamazsa akış durmaz; talep en azından loga düşer.
      console.error('[tasarim] kayıt hatası', e)
    }
  }
  if (!jeton) console.info('[tasarim] kayıtsız talep', { eposta: brif.eposta, form: brif.form })

  // Bağlantıyı e-posta ile de gönderiyoruz: müşteri sekmeyi kapatsa da
  // sonucu bulabilsin.
  await tasarimTalebiPostasi({
    eposta: brif.eposta,
    jeton,
    anlatim: brif.anlatim,
    form: brif.form,
    adet: brif.adet,
  })

  const anahtar = process.env.TASARIM_SAGLAYICI_ANAHTARI
  if (!anahtar) {
    // TODO: sağlayıcı bağlanınca burada `oneriUret` çağrılıp sonuç
    // talebe yazılacak, durum 'hazir' olacak.
    return NextResponse.json({ durum: 'sirada', jeton })
  }

  try {
    const oneri = await oneriUret(brif, anahtar)
    return NextResponse.json({ durum: 'hazir', jeton, oneri })
  } catch (e) {
    console.error('[tasarim] sağlayıcı hatası', e)
    return NextResponse.json({ durum: 'sirada', jeton })
  }
}

/**
 * Sağlayıcı çağrısı. Şu an yalnız sözleşmeyi tanımlıyor; hangi model
 * kullanılacağı seçilince gövdesi yazılacak. Dönen JSON `Oneri` şemasına
 * uymazsa hata fırlatmalı ki müşteriye bozuk veri gitmesin.
 */
async function oneriUret(_brif: Brif, _anahtar: string): Promise<Oneri> {
  throw new Error('Sağlayıcı bağlanmadı')
}
