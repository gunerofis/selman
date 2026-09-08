import { NextResponse } from 'next/server'
import { depoAcik, talepGetir } from '@/lib/talep-deposu'
import { istemciKimligi, sinirAsildi } from '@/lib/istek-siniri'

/** Talep sayfasının yoklama ucu. Jeton tek yetki. */
export async function GET(istek: Request) {
  const jeton = new URL(istek.url).searchParams.get('jeton')
  if (!jeton || jeton.length < 12) {
    return NextResponse.json({ mesaj: 'Geçersiz bağlantı.' }, { status: 400 })
  }
  if (sinirAsildi('durum:' + istemciKimligi(istek))) {
    return NextResponse.json({ mesaj: 'Çok fazla istek.' }, { status: 429 })
  }
  if (!depoAcik) return NextResponse.json({ mesaj: 'Kayıt kapalı.' }, { status: 503 })

  try {
    const talep = await talepGetir(jeton)
    if (!talep) return NextResponse.json({ mesaj: 'Talep bulunamadı.' }, { status: 404 })
    return NextResponse.json(talep)
  } catch (e) {
    console.error('[tasarim/durum]', e)
    return NextResponse.json({ mesaj: 'Talep okunamadı.' }, { status: 500 })
  }
}
