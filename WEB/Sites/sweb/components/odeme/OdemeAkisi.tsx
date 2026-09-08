'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Alan } from '@/components/ui/Alan'
import { Buton, ButonLink } from '@/components/ui/Buton'
import { useSepet } from '@/lib/sepet'
import { renkBul } from '@/lib/renkler'
import { fiyat } from '@/lib/bicim'
import { KARGO, ODEME } from '@/lib/teslimat'
import * as d from '@/lib/dogrula'

/**
 * Ödeme akışı. Sipariş oluşturma ve ödeme sağlayıcısı bağlanmadı; form
 * doğrulanıp `/api/siparis`'e gidiyor, orada sipariş numarası üretiliyor.
 * Sağlayıcı seçilince yalnız o route'un içi değişecek.
 */
export function OdemeAkisi() {
  const { satirlar, araToplamKurus, hazir, bosalt } = useSepet()
  const router = useRouter()
  const [kargo, setKargo] = useState(KARGO[0].anahtar)
  const [odeme, setOdeme] = useState(ODEME[0].anahtar)
  const [hatalar, setHatalar] = useState<d.Hatalar>({})
  const [gonderiliyor, setGonderiliyor] = useState(false)
  const [sunucuHatasi, setSunucuHatasi] = useState('')

  if (!hazir) return <p className="dikis-ust mt-8 pt-8 text-ikincil">Sepet açılıyor…</p>

  if (satirlar.length === 0) {
    return (
      <div className="dikis-ust mt-8 pt-8">
        <p className="text-ikincil">Sepetiniz boş olduğu için ödeme adımına geçilemiyor.</p>
        <ButonLink href="/koleksiyon" tur="cerceve" className="mt-6">
          Ürünlere bak
        </ButonLink>
      </div>
    )
  }

  async function gonder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSunucuHatasi('')
    const f = new FormData(e.currentTarget)
    const al = (k: string) => String(f.get(k) ?? '')

    const yerel = d.topla({
      ad: d.metin(al('ad')),
      eposta: d.eposta(al('eposta')),
      telefon: d.telefon(al('telefon'), true),
      adres: d.metin(al('adres'), 10, 400),
      il: d.metin(al('il')),
      ilce: d.metin(al('ilce')),
      postaKodu: d.metin(al('postaKodu'), 5, 10),
    })
    setHatalar(yerel)
    if (Object.keys(yerel).length > 0) {
      document.getElementById(Object.keys(yerel)[0])?.focus()
      return
    }

    setGonderiliyor(true)
    try {
      const y = await fetch('/api/siparis', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          musteri: Object.fromEntries(f.entries()),
          kargo,
          odeme,
          satirlar: satirlar.map((s) => ({ kod: s.kod, renk: s.renk, adet: s.adet })),
        }),
      })
      const veri = await y.json()
      if (!y.ok) {
        setHatalar(veri.hatalar ?? {})
        setSunucuHatasi(veri.mesaj ?? 'Sipariş oluşturulamadı.')
        return
      }
      bosalt()
      // Kayıt tutulabildiyse müşteri kendi durum sayfasına gider; depo
      // kapalıysa numarayı gösteren teşekkür sayfası yedek kalır.
      router.push(
        veri.jeton
          ? `/siparis/${encodeURIComponent(veri.jeton)}`
          : `/odeme/tesekkurler?no=${encodeURIComponent(veri.siparisNo)}`,
      )
    } catch {
      setSunucuHatasi('Bağlantı kurulamadı. Tekrar deneyin.')
    } finally {
      setGonderiliyor(false)
    }
  }

  const secilenKargo = KARGO.find((k) => k.anahtar === kargo)
  const toplamKurus =
    araToplamKurus == null || secilenKargo?.ucretKurus == null
      ? null
      : araToplamKurus + secilenKargo.ucretKurus

  return (
    <form onSubmit={gonder} noValidate={false} className="dikis-ust mt-8 grid gap-10 pt-8 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div>
        <section>
          <h2 className="yazi-display-orta text-lg">Teslimat</h2>
          <div className="mt-4 grid max-w-[520px] gap-5 sm:grid-cols-2">
            <Alan id="ad" name="ad" etiket="ad soyad" autoComplete="name" required hata={hatalar.ad} className="sm:col-span-2" />
            <Alan id="eposta" name="eposta" type="email" etiket="e-posta" ipucu="ad@firma.com" autoComplete="email" required hata={hatalar.eposta} />
            <Alan id="telefon" name="telefon" type="tel" etiket="telefon" ipucu="5xx xxx xx xx" autoComplete="tel" required hata={hatalar.telefon} />
            <div className="sm:col-span-2">
              <label htmlFor="adres" className="yazi-mono block">
                adres <span aria-hidden="true">*</span>
              </label>
              <textarea
                id="adres"
                name="adres"
                rows={3}
                required
                minLength={10}
                autoComplete="street-address"
                aria-errormessage="adres-hata"
                className="alan mt-1.5 w-full border border-dikis-koyu bg-kagit px-2.5 py-2.5 text-[15px] text-kahve"
              />
              <p id="adres-hata" className="alan-hata mt-1.5 text-[13px] text-bordo" data-gorunur={hatalar.adres ? '' : undefined}>
                {hatalar.adres ?? 'Açık adres girin.'}
              </p>
            </div>
            <Alan id="il" name="il" etiket="il" autoComplete="address-level1" required hata={hatalar.il} />
            <Alan id="ilce" name="ilce" etiket="ilçe" autoComplete="address-level2" required hata={hatalar.ilce} />
            <Alan id="postaKodu" name="postaKodu" etiket="posta kodu" inputMode="numeric" autoComplete="postal-code" required hata={hatalar.postaKodu} />
          </div>
        </section>

        <section className="dikis-ust mt-10 pt-8">
          <h2 className="yazi-display-orta text-lg">Kargo</h2>
          <ul className="mt-4 max-w-[520px]">
            {KARGO.map((k) => (
              <li key={k.anahtar}>
                <label className="flex cursor-pointer items-center justify-between gap-4 border-b border-dashed border-dikis py-3">
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="kargo"
                      value={k.anahtar}
                      checked={kargo === k.anahtar}
                      onChange={() => setKargo(k.anahtar)}
                      className="accent-[var(--color-kahve)]"
                    />
                    <span className="text-sm">{k.ad}</span>
                    <span className="yazi-mono">{k.sure}</span>
                  </span>
                  <span className="font-mono text-[13px]">{fiyat(k.ucretKurus)}</span>
                </label>
              </li>
            ))}
          </ul>
        </section>

        <section className="dikis-ust mt-10 pt-8">
          <h2 className="yazi-display-orta text-lg">Ödeme</h2>
          <ul className="mt-4 max-w-[520px]">
            {ODEME.map((o) => (
              <li key={o.anahtar}>
                <label className="flex cursor-pointer items-center justify-between gap-4 border-b border-dashed border-dikis py-3">
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="odeme"
                      value={o.anahtar}
                      checked={odeme === o.anahtar}
                      onChange={() => setOdeme(o.anahtar)}
                      className="accent-[var(--color-kahve)]"
                    />
                    <span className="text-sm">{o.ad}</span>
                  </span>
                  <span className="yazi-mono">{o.not}</span>
                </label>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <aside className="h-fit border border-dikis bg-kagit p-4">
        <h2 className="yazi-display-orta text-lg">Sipariş</h2>

        <ul className="mt-3">
          {satirlar.map((s) => (
            <li key={`${s.kod}-${s.renk}`} className="flex gap-3 border-b border-dashed border-dikis py-3">
              <div className="relative h-12 w-[72px] shrink-0 overflow-hidden bg-sut">
                <Image src={s.urun.gorsel} alt="" fill sizes="72px" className="object-contain" />
              </div>
              <div className="min-w-0 flex-1">
                <Link href={`/urun/${s.urun.slug}`} className="block truncate text-sm hover:text-taba">
                  {s.urun.ad}
                </Link>
                <span className="yazi-mono">
                  {s.kod} · {renkBul(s.renk)?.ad.toLowerCase()} · {s.adet} adet
                </span>
              </div>
              <span className="shrink-0 font-mono text-[13px]">{fiyat(s.urun.fiyatKurus)}</span>
            </li>
          ))}
        </ul>

        <dl className="mt-3 text-sm">
          <div className="flex justify-between py-[7px]">
            <dt>Ara toplam</dt>
            <dd className="font-mono text-[13px]">{fiyat(araToplamKurus)}</dd>
          </div>
          <div className="flex justify-between border-b border-dashed border-dikis py-[7px]">
            <dt>Kargo</dt>
            <dd className="font-mono text-[13px]">{fiyat(secilenKargo?.ucretKurus ?? null)}</dd>
          </div>
          <div className="flex justify-between py-[7px] font-medium">
            <dt>Toplam</dt>
            <dd className="font-mono text-[13px]">{fiyat(toplamKurus)}</dd>
          </div>
        </dl>

        {sunucuHatasi ? (
          <p role="alert" className="mt-3 text-[13px] text-bordo">
            {sunucuHatasi}
          </p>
        ) : null}

        <Buton type="submit" disabled={gonderiliyor} className="mt-5 w-full">
          {gonderiliyor ? 'Gönderiliyor…' : 'Siparişi tamamla'}
        </Buton>

        <p className="mt-3 text-[13px] text-ikincil">
          Siparişi tamamlayarak{' '}
          <Link href="/mesafeli-satis-sozlesmesi" className="text-taba underline underline-offset-2">
            mesafeli satış sözleşmesini
          </Link>{' '}
          kabul edersiniz.
        </p>
      </aside>
    </form>
  )
}
