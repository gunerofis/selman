import { NextResponse } from 'next/server'
import * as d from '@/lib/dogrula'
import { istemciKimligi, sinirAsildi, tuzagaDustu } from '@/lib/istek-siniri'
import { formPostasi } from '@/lib/eposta'

/** Kurumsal teklif formu. E-posta servisi bağlanınca yalnız gönderim
 *  bloğu değişecek. */
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

  // Bot tuzağı doluysa istek sessizce başarılı sayılır.
  if (tuzagaDustu(g)) return NextResponse.json({ tamam: true })

  const hatalar = d.topla({
    firma: d.metin(g?.firma),
    kisi: d.metin(g?.kisi),
    eposta: d.eposta(g?.eposta),
    telefon: d.telefon(g?.telefon),
    adet: d.sayi(g?.adet, 1, 100000),
    not: g?.not ? d.metin(g.not, 0, 2000) : null,
  })
  if (Object.keys(hatalar).length > 0) {
    return NextResponse.json({ mesaj: 'Formu kontrol edin.', hatalar }, { status: 422 })
  }

  await formPostasi({
    tur: 'teklif',
    eposta: g.eposta,
    ad: g.kisi,
    ozet: [
      `Firma: ${g.firma}`,
      `Kişi: ${g.kisi}`,
      `Telefon: ${g.telefon}`,
      `Adet: ${g.adet}`,
      g.not ? `Not: ${g.not}` : null,
    ]
      .filter(Boolean)
      .join('\n'),
  })
  return NextResponse.json({ tamam: true })
}
