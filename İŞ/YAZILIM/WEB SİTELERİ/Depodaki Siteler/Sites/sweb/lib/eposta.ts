import { site } from './site'
import { fiyat } from './bicim'
import { URUNLER } from './urunler'
import { renkBul } from './renkler'

/**
 * E-posta gönderimi.
 *
 * Sağlayıcı HTTP üzerinden çağrılıyor, paket eklenmedi. Anahtar tanımlı
 * değilse gönderim yapılmaz, yalnız log düşer — akış hiçbir yerde
 * e-postaya bağlı değil, gönderim başarısız olsa da sipariş veya talep
 * kaybolmaz.
 *
 * Ortam değişkenleri:
 *   EPOSTA_ANAHTARI   sağlayıcı API anahtarı (Resend)
 *   EPOSTA_GONDEREN   "Sweb <siparis@alanadi>" — doğrulanmış alan adı
 *   EPOSTA_BILDIRIM   atölyeye düşecek kopyanın adresi
 *
 * Metin düz; HTML şablonu yok. Sağlayıcı seçilince yalnız `gonder`
 * gövdesi değişir.
 */
const ANAHTAR = process.env.EPOSTA_ANAHTARI
const GONDEREN = process.env.EPOSTA_GONDEREN ?? 'Sweb <onboarding@resend.dev>'
const BILDIRIM = process.env.EPOSTA_BILDIRIM

export const epostaAcik = Boolean(ANAHTAR)

type Zarf = { kime: string; konu: string; metin: string }

async function gonder({ kime, konu, metin }: Zarf): Promise<boolean> {
  if (!ANAHTAR) {
    console.info('[eposta] sağlayıcı yok, gönderilmedi', { kime, konu })
    return false
  }
  try {
    const y = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${ANAHTAR}`,
      },
      body: JSON.stringify({ from: GONDEREN, to: [kime], subject: konu, text: metin }),
      signal: AbortSignal.timeout(8000),
    })
    if (!y.ok) throw new Error(`${y.status} ${await y.text()}`)
    return true
  } catch (e) {
    // Gönderim akışı durdurmaz: sipariş ve talep zaten kayıtlı.
    console.error('[eposta] gönderilemedi', { kime, konu }, e)
    return false
  }
}

/** Atölyeye kopya. Adres tanımlı değilse sessizce atlanır. */
async function bildir(konu: string, metin: string) {
  if (BILDIRIM) await gonder({ kime: BILDIRIM, konu, metin })
}

const imza = ['', '—', site.ad, site.url].join('\n')

function kalemSatiri(k: { kod: string; renk: string; adet: number; birimKurus: number | null }) {
  const urun = URUNLER.find((u) => u.kod === k.kod)
  const renk = renkBul(k.renk)?.ad ?? k.renk
  return `- ${k.kod} ${urun?.ad ?? ''} · ${renk} · ${k.adet} adet · ${fiyat(k.birimKurus)}`
}

/* ------------------------------------------------------------------ */

export async function siparisAlindiPostasi(girdi: {
  eposta: string
  siparisNo: string
  jeton: string | null
  kalemler: readonly { kod: string; renk: string; adet: number; birimKurus: number | null }[]
  toplamKurus: number | null
}) {
  const baglanti = girdi.jeton ? `${site.url}/siparis/${girdi.jeton}` : null
  const metin = [
    `Siparişiniz alındı. Sipariş numarası: ${girdi.siparisNo}`,
    '',
    ...girdi.kalemler.map(kalemSatiri),
    '',
    `Toplam: ${fiyat(girdi.toplamKurus)}`,
    ...(baglanti ? ['', `Durumu buradan görebilirsiniz: ${baglanti}`] : []),
    '',
    'Kargoya verildiğinde ayrıca haber vereceğiz.',
    imza,
  ].join('\n')

  await gonder({ kime: girdi.eposta, konu: `Sipariş alındı — ${girdi.siparisNo}`, metin })
  await bildir(`Yeni sipariş ${girdi.siparisNo}`, metin)
}

export async function tasarimTalebiPostasi(girdi: {
  eposta: string
  jeton: string | null
  anlatim: string
  form: string
  adet: number
}) {
  const baglanti = girdi.jeton ? `${site.url}/tasarim/${girdi.jeton}` : null
  const metin = [
    'Tasarım talebiniz alındı.',
    '',
    `Form: ${girdi.form}`,
    `Adet: ${girdi.adet}`,
    `Anlatım: ${girdi.anlatim}`,
    ...(baglanti
      ? ['', `Sonucu bu sayfadan göreceksiniz: ${baglanti}`, 'Bağlantıyı saklayın; size özel.']
      : []),
    imza,
  ].join('\n')

  await gonder({ kime: girdi.eposta, konu: 'Tasarım talebiniz alındı', metin })
  await bildir('Yeni tasarım talebi', `${girdi.eposta}\n\n${metin}`)
}

export async function formPostasi(girdi: {
  tur: 'teklif' | 'iletisim'
  eposta: string
  ad: string
  ozet: string
}) {
  const konu = girdi.tur === 'teklif' ? 'Teklif talebiniz alındı' : 'Mesajınız alındı'
  const metin = [
    girdi.tur === 'teklif'
      ? 'Teklif talebiniz alındı. İki iş günü içinde dönüş yapacağız.'
      : 'Mesajınız alındı. İki iş günü içinde dönüş yapacağız.',
    '',
    girdi.ozet,
    imza,
  ].join('\n')

  await gonder({ kime: girdi.eposta, konu, metin })
  await bildir(
    girdi.tur === 'teklif' ? 'Yeni teklif talebi' : 'Yeni iletişim mesajı',
    `${girdi.ad} <${girdi.eposta}>\n\n${girdi.ozet}`,
  )
}
