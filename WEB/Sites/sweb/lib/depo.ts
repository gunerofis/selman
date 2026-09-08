/**
 * Supabase kapısı — tüm kalıcı kayıtların tek istemcisi.
 *
 * Tablolara doğrudan erişim RLS ile kapalı; tek kapı `security definer`
 * fonksiyonlar. Yazan fonksiyonlar ayrıca paylaşılan gizli anahtar ister,
 * böylece anon rolü doğrudan kayıt açıp sunucu doğrulamasını ve istek
 * frenini atlayamaz. Anahtar PostgREST'e açılmayan `sweb_gizli` şemasında.
 *
 * Ortam değişkenleri: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_ANON_KEY,
 * SWEB_YAZMA_ANAHTARI (eski ad: SWEB_TASARIM_YAZMA_ANAHTARI).
 * Eksikse depo kapalı sayılır; akışlar durmaz, kayıt yalnız loglanır.
 */
const URL_ADRESI = process.env.NEXT_PUBLIC_SUPABASE_URL
const ANAHTAR = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const YAZMA_ANAHTARI =
  process.env.SWEB_YAZMA_ANAHTARI ?? process.env.SWEB_TASARIM_YAZMA_ANAHTARI

export const depoAcik = Boolean(URL_ADRESI && ANAHTAR)
export const yazmaAcik = Boolean(depoAcik && YAZMA_ANAHTARI)

/** Zaman aşımı: sunucusuz istek, veritabanı yanıt vermezse asılı kalmasın. */
const SURE_MS = 8000

export async function rpc<T>(fonksiyon: string, govde: unknown): Promise<T> {
  if (!depoAcik) throw new Error('Depo yapılandırılmadı')

  const iptal = AbortSignal.timeout(SURE_MS)
  const y = await fetch(`${URL_ADRESI}/rest/v1/rpc/${fonksiyon}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      apikey: ANAHTAR!,
      authorization: `Bearer ${ANAHTAR}`,
    },
    body: JSON.stringify(govde),
    cache: 'no-store',
    signal: iptal,
  })

  if (!y.ok) throw new Error(`${fonksiyon}: ${y.status} ${await y.text()}`)
  return (await y.json()) as T
}

/** Yazan fonksiyonlar için: gizli anahtarı gövdeye ekler. */
export async function yaz<T>(fonksiyon: string, govde: Record<string, unknown>): Promise<T> {
  if (!YAZMA_ANAHTARI) throw new Error('Yazma anahtarı tanımlanmadı')
  return rpc<T>(fonksiyon, { p_gizli: YAZMA_ANAHTARI, ...govde })
}
