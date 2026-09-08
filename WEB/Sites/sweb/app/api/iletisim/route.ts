import { NextResponse } from 'next/server'
import * as d from '@/lib/dogrula'
import { istemciKimligi, sinirAsildi, tuzagaDustu } from '@/lib/istek-siniri'
import { formPostasi } from '@/lib/eposta'

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
    ad: d.metin(g?.ad),
    eposta: d.eposta(g?.eposta),
    mesaj: d.metin(g?.mesaj, 10, 2000),
  })
  if (Object.keys(hatalar).length > 0) {
    return NextResponse.json({ mesaj: 'Formu kontrol edin.', hatalar }, { status: 422 })
  }

  await formPostasi({
    tur: 'iletisim',
    eposta: g.eposta,
    ad: g.ad,
    ozet: g.mesaj,
  })
  return NextResponse.json({ tamam: true })
}
