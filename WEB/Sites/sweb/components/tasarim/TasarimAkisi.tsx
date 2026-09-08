'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Alan } from '@/components/ui/Alan'
import { Buton, ButonLink } from '@/components/ui/Buton'
import { MetinAlani } from '@/components/form/MetinAlani'
import { UrunKarti } from '@/components/kategori/UrunKarti'
import { RENKLER, type RenkAnahtari } from '@/lib/renkler'
import { benzerUrunler, type Brif } from '@/lib/tasarim'
import { FORMLAR, MALZEMELER, OZELLIKLER, OLCU_SINIRI, YAPILMAYANLAR, EN_AZ_ADET } from '@/lib/uretim'
import { TUZAK_ALANI } from '@/lib/istek-siniri'
import * as d from '@/lib/dogrula'

const SURE_SN = 30

export function TasarimAkisi() {
  const router = useRouter()
  const [adim, setAdim] = useState<'brif' | 'bekleme' | 'sonuc'>('brif')
  const [hatalar, setHatalar] = useState<d.Hatalar>({})
  const [sunucuHatasi, setSunucuHatasi] = useState('')
  const [gecen, setGecen] = useState(0)
  const [sonuc, setSonuc] = useState<{ durum: string; mesaj?: string } | null>(null)
  const [eslesme, setEslesme] = useState<ReturnType<typeof benzerUrunler>>([])

  const [form, setForm] = useState(FORMLAR[0].anahtar)
  const [malzemeler, setMalzemeler] = useState<string[]>(['deri'])
  const [ozellikler, setOzellikler] = useState<string[]>([])
  const [renk, setRenk] = useState<RenkAnahtari | null>(null)

  const sayac = useRef<number | null>(null)
  useEffect(() => () => { if (sayac.current) window.clearInterval(sayac.current) }, [])

  function cevir(liste: string[], yaz: (v: string[]) => void, anahtar: string) {
    yaz(liste.includes(anahtar) ? liste.filter((x) => x !== anahtar) : [...liste, anahtar])
  }

  async function gonder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSunucuHatasi('')
    const f = new FormData(e.currentTarget)
    const al = (k: string) => String(f.get(k) ?? '')
    const sayi = (k: string) => (al(k) ? Number(al(k)) : null)

    const yerel = d.topla({
      anlatim: d.metin(al('anlatim'), 20, 2000),
      eposta: d.eposta(al('eposta')),
      adet: d.sayi(al('adet'), EN_AZ_ADET, 100000),
    })
    setHatalar(yerel)
    if (Object.keys(yerel).length > 0) {
      document.getElementById(Object.keys(yerel)[0])?.focus()
      return
    }

    const brif: Brif = {
      anlatim: al('anlatim'),
      form,
      malzemeler,
      ozellikler,
      renk,
      enMm: sayi('enMm'),
      boyMm: sayi('boyMm'),
      yukseklikMm: sayi('yukseklikMm'),
      adet: Number(al('adet')),
      eposta: al('eposta'),
    }

    // Bekleme ekranı: sayaç ve katalog eşleşmesi hemen görünür.
    setEslesme(benzerUrunler(brif))
    setGecen(0)
    setAdim('bekleme')
    sayac.current = window.setInterval(() => setGecen((s) => s + 1), 1000)

    try {
      const y = await fetch('/api/tasarim', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...brif, [TUZAK_ALANI]: al(TUZAK_ALANI) }),
      })
      const c = await y.json()
      if (!y.ok) {
        setHatalar(c.hatalar ?? {})
        setSunucuHatasi(c.mesaj ?? 'Gönderilemedi.')
        setAdim('brif')
        return
      }
      // Talep kaydedildiyse kendi adresine geç: müşteri bağlantıyı
      // saklayabilsin, e-postadaki bağlantı da aynı sayfayı açsın.
      if (c.jeton) {
        router.push(`/tasarim/${c.jeton}`)
        return
      }
      setSonuc(c)
      setAdim('sonuc')
    } catch {
      setSunucuHatasi('Bağlantı kurulamadı. Tekrar deneyin.')
      setAdim('brif')
    } finally {
      if (sayac.current) window.clearInterval(sayac.current)
    }
  }

  if (adim === 'bekleme' || adim === 'sonuc') {
    const bitti = adim === 'sonuc'
    const oran = Math.min(100, Math.round((gecen / SURE_SN) * 100))
    return (
      <div className="dikis-ust mt-8 pt-8">
        <div className="max-w-[62ch]">
          <p className="yazi-mono">{bitti ? 'tamam' : 'tasarım hazırlanıyor'}</p>
          <h2 className="yazi-display mt-2 text-xl">
            {bitti ? 'Talebiniz alındı' : 'Anlattığınız ürün çiziliyor'}
          </h2>
          <p className="mt-3 text-ikincil">
            {bitti
              ? (sonuc?.mesaj ??
                'Tasarım ve fiyat hazırlanınca e-posta ile gönderilecek.')
              : `Bu genelde ${SURE_SN} saniye sürer. Beklerken aşağıda, anlattığınıza en yakın ürettiğimiz ürünler var.`}
          </p>

          {!bitti ? (
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={oran}
              aria-label="Tasarım hazırlanıyor"
              className="mt-5 h-1 w-full max-w-[380px] bg-dikis"
            >
              <div
                className="h-full bg-kahve transition-[width] duration-1000 ease-linear"
                style={{ width: `${oran}%` }}
              />
            </div>
          ) : null}
        </div>

        <section className="mt-12">
          <h3 className="yazi-display-orta text-lg">Anlattığınıza yakın ürettiklerimiz</h3>
          <p className="yazi-mono mt-2">bu ürünler hazır, hemen sipariş edilebilir</p>
          <ul className="mt-5 grid grid-cols-2 gap-6 lg:grid-cols-3">
            {eslesme.map((e) => (
              <li key={e.urun.kod}>
                <UrunKarti urun={e.urun} />
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButonLink href="/koleksiyon" tur="cerceve">
              Tüm koleksiyona bak
            </ButonLink>
            {bitti ? (
              <Buton tur="cerceve" onClick={() => setAdim('brif')}>
                Yeni tasarım anlat
              </Buton>
            ) : null}
          </div>
        </section>
      </div>
    )
  }

  return (
    <form onSubmit={gonder} className="dikis-ust mt-8 grid gap-10 pt-8 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="grid max-w-[560px] gap-8">
        <MetinAlani
          id="anlatim"
          name="anlatim"
          etiket="ne istiyorsunuz"
          rows={5}
          required
          minLength={20}
          placeholder="Ne işe yarayacağını, nerede duracağını ve içine ne konacağını yazın. Örnek: resepsiyon bankosunda duracak, kartvizit ve kalem için bölmeli bir tepsi."
          hata={hatalar.anlatim}
        />

        <fieldset>
          <legend className="yazi-mono">form</legend>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {FORMLAR.map((f) => (
              <li key={f.anahtar}>
                <label
                  className={`flex h-full cursor-pointer gap-3 border p-3 ${
                    form === f.anahtar ? 'border-kahve' : 'border-dikis-koyu'
                  }`}
                >
                  <input
                    type="radio"
                    name="form"
                    value={f.anahtar}
                    checked={form === f.anahtar}
                    onChange={() => setForm(f.anahtar)}
                    className="mt-1 accent-[var(--color-kahve)]"
                  />
                  <span>
                    <span className="block text-sm font-medium">{f.ad}</span>
                    <span className="block text-[13px] text-ikincil">{f.aciklama}</span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>

        <fieldset>
          <legend className="yazi-mono">malzeme</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {MALZEMELER.map((m) => (
              <label
                key={m.anahtar}
                className={`cursor-pointer border px-3 py-1.5 text-sm ${
                  malzemeler.includes(m.anahtar) ? 'border-kahve bg-sut' : 'border-dikis-koyu'
                }`}
              >
                <input
                  type="checkbox"
                  checked={malzemeler.includes(m.anahtar)}
                  onChange={() => cevir(malzemeler, setMalzemeler, m.anahtar)}
                  className="sr-only"
                />
                {m.ad}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="yazi-mono">özellik</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {OZELLIKLER.map((o) => (
              <label
                key={o.anahtar}
                className={`cursor-pointer border px-3 py-1.5 text-sm ${
                  ozellikler.includes(o.anahtar) ? 'border-kahve bg-sut' : 'border-dikis-koyu'
                }`}
              >
                <input
                  type="checkbox"
                  checked={ozellikler.includes(o.anahtar)}
                  onChange={() => cevir(ozellikler, setOzellikler, o.anahtar)}
                  className="sr-only"
                />
                {o.ad}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="yazi-mono">renk</legend>
          <div role="radiogroup" aria-label="Renk" className="mt-3 flex flex-wrap gap-[9px]">
            {RENKLER.map((r) => (
              <button
                key={r.anahtar}
                type="button"
                role="radio"
                aria-checked={renk === r.anahtar}
                aria-label={r.ad}
                title={r.ad}
                onClick={() => setRenk(renk === r.anahtar ? null : r.anahtar)}
                className={`h-[22px] w-[22px] border border-dikis-koyu ${
                  renk === r.anahtar ? 'outline outline-2 outline-offset-2 outline-taba-dolgu' : ''
                }`}
                style={{ background: r.hex }}
              />
            ))}
          </div>
          <p className="mt-2 text-[13px] text-ikincil">
            Seçmezseniz forma uygun rengi biz öneririz.
          </p>
        </fieldset>

        <fieldset>
          <legend className="yazi-mono">
            ölçü — mm, biliyorsanız ({OLCU_SINIRI.enAz}-{OLCU_SINIRI.enCok})
          </legend>
          <div className="mt-3 grid gap-4 sm:grid-cols-3">
            <Alan id="enMm" name="enMm" type="number" etiket="en" min={OLCU_SINIRI.enAz} max={OLCU_SINIRI.enCok} />
            <Alan id="boyMm" name="boyMm" type="number" etiket="boy" min={OLCU_SINIRI.enAz} max={OLCU_SINIRI.enCok} />
            <Alan id="yukseklikMm" name="yukseklikMm" type="number" etiket="yükseklik" min={OLCU_SINIRI.enAz} max={OLCU_SINIRI.enCok} />
          </div>
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <Alan
            id="adet"
            name="adet"
            type="number"
            etiket="adet"
            min={EN_AZ_ADET}
            defaultValue={EN_AZ_ADET}
            required
            ipucu={`en az ${EN_AZ_ADET}`}
            hata={hatalar.adet}
          />
          <Alan
            id="eposta"
            name="eposta"
            type="email"
            etiket="e-posta"
            ipucu="ad@firma.com"
            autoComplete="email"
            required
            hata={hatalar.eposta}
          />
        </div>

        <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
          <label htmlFor={TUZAK_ALANI}>Bu alanı boş bırakın</label>
          <input id={TUZAK_ALANI} name={TUZAK_ALANI} type="text" tabIndex={-1} autoComplete="off" />
        </div>

        {sunucuHatasi ? (
          <p role="alert" className="text-[13px] text-bordo">
            {sunucuHatasi}
          </p>
        ) : null}

        <Buton type="submit" className="justify-self-start">
          Tasarımı gönder
        </Buton>
      </div>

      <aside className="h-fit border border-dikis bg-kagit p-4">
        <h2 className="yazi-display-orta text-lg">Nasıl işliyor</h2>
        <ol className="mt-3 space-y-2 text-sm text-ikincil">
          <li>
            <span className="font-mono text-[13px] text-kahve">1.</span> Ne istediğinizi anlatın.
          </li>
          <li>
            <span className="font-mono text-[13px] text-kahve">2.</span> Yaklaşık {SURE_SN} saniyede
            tasarım ve fiyat çıkar.
          </li>
          <li>
            <span className="font-mono text-[13px] text-kahve">3.</span> Beklerken benzer
            ürettiklerimizi görürsünüz.
          </li>
          <li>
            <span className="font-mono text-[13px] text-kahve">4.</span> Onaylarsanız numune{' '}
            10-15 iş gününde çıkar.
          </li>
        </ol>

        <h3 className="yazi-display-orta mt-6 text-lg">Yapmadıklarımız</h3>
        <ul className="mt-3 space-y-1.5 text-[13px] text-ikincil">
          {YAPILMAYANLAR.map((y) => (
            <li key={y}>{y}</li>
          ))}
        </ul>

        <p className="mt-6 text-[13px] text-ikincil">
          Hazır ürün mü arıyorsunuz?{' '}
          <Link href="/koleksiyon" className="text-taba underline underline-offset-2">
            Koleksiyona bakın
          </Link>
          .
        </p>
      </aside>
    </form>
  )
}
