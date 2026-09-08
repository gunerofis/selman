import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Kap } from '@/components/duzen/Kap'
import { ButonLink } from '@/components/ui/Buton'
import { SpecTablosu } from '@/components/ui/SpecTablosu'
import { UrunGorseli } from '@/components/ui/UrunGorseli'
import { siparisGetir, depoAcik, DURUM_ADI } from '@/lib/siparis-deposu'
import { URUNLER, gorselFor } from '@/lib/urunler'
import { renkBul } from '@/lib/renkler'
import { KARGO, ODEME } from '@/lib/teslimat'
import { fiyat, YOK } from '@/lib/bicim'

export const metadata: Metadata = {
  title: 'Sipariş durumu',
  robots: { index: false, follow: false },
}

/** Durum değişimi seyrek; her istekte tazeleniyor ama önbelleğe girmiyor. */
export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ jeton: string }> }

const ADIMLAR = ['alindi', 'odendi', 'hazirlaniyor', 'kargolandi', 'teslim'] as const

export default async function SiparisSayfasi({ params }: Props) {
  const { jeton } = await params
  if (!depoAcik) notFound()

  const siparis = await siparisGetir(jeton).catch(() => null)
  if (!siparis) notFound()

  const kargoAdi = KARGO.find((k) => k.anahtar === siparis.kargo)?.ad ?? siparis.kargo
  const odemeAdi = ODEME.find((o) => o.anahtar === siparis.odeme)?.ad ?? siparis.odeme
  const suAdim = ADIMLAR.indexOf(siparis.durum as (typeof ADIMLAR)[number])

  return (
    <Kap className="py-8 md:py-12">
      <p className="yazi-mono">sipariş {siparis.no}</p>
      <h1 className="yazi-display mt-3 text-2xl">{DURUM_ADI[siparis.durum]}</h1>
      <p className="mt-3 max-w-[52ch] text-ikincil">
        Bu sayfa size özel. Durum değiştikçe burada güncellenir; ayrıca e-posta göndeririz.
      </p>

      {/* Durum çizgisi. İptal edilen sipariş çizgide yer almaz. */}
      {siparis.durum === 'iptal' ? null : (
        <ol className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {ADIMLAR.map((adim, i) => (
            <li
              key={adim}
              className={i <= suAdim ? 'text-kahve' : 'text-ikincil opacity-60'}
              aria-current={i === suAdim ? 'step' : undefined}
            >
              <span className="font-mono text-[13px]">{i <= suAdim ? '■' : '□'}</span>{' '}
              {DURUM_ADI[adim]}
            </li>
          ))}
        </ol>
      )}

      <div className="mt-10 grid gap-10 md:grid-cols-[1fr_360px]">
        <section>
          <h2 className="yazi-mono">kalemler</h2>
          <ul className="mt-4 dikis-ust">
            {siparis.kalemler.map((k, i) => {
              const urun = URUNLER.find((u) => u.kod === k.kod)
              const renk = renkBul(k.renk)
              return (
                <li key={`${k.kod}-${k.renk}-${i}`} className="flex gap-4 py-4 dikis-alt">
                  <div className="w-[92px] shrink-0">
                    <UrunGorseli
                      kaynak={urun ? gorselFor(urun, renk?.anahtar) : '/urunler/7005.webp'}
                      alt={urun?.ad ?? k.kod}
                      zemin={renk?.zemin}
                      boyutlar="92px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="yazi-mono">{k.kod}</p>
                    {urun ? (
                      <Link href={`/urun/${urun.slug}`} className="mt-1 block hover:underline">
                        {urun.ad}
                      </Link>
                    ) : (
                      <p className="mt-1">{k.kod}</p>
                    )}
                    <p className="mt-1 text-sm text-ikincil">
                      {renk?.ad ?? k.renk} · {k.adet} adet
                    </p>
                  </div>
                  <p className="shrink-0 font-mono text-[13px]">{fiyat(k.birimKurus)}</p>
                </li>
              )
            })}
          </ul>
        </section>

        <aside className="border border-dikis bg-kagit p-4 md:self-start">
          <h2 className="yazi-mono">özet</h2>
          <div className="mt-3">
            <SpecTablosu
              satirlar={[
                { etiket: 'Sipariş numarası', deger: siparis.no },
                { etiket: 'Durum', deger: DURUM_ADI[siparis.durum] },
                { etiket: 'Kargo', deger: kargoAdi },
                { etiket: 'Ödeme', deger: odemeAdi },
                {
                  etiket: 'Teslimat',
                  deger: [siparis.ilce, siparis.il].filter(Boolean).join(' / ') || YOK,
                },
                { etiket: 'Ara toplam', deger: fiyat(siparis.ara_toplam_kurus) },
                { etiket: 'Kargo ücreti', deger: fiyat(siparis.kargo_kurus) },
                { etiket: 'Toplam', deger: fiyat(siparis.toplam_kurus) },
                ...(siparis.kargo_takip
                  ? [{ etiket: 'Takip no', deger: siparis.kargo_takip }]
                  : []),
              ]}
            />
          </div>
          <p className="mt-4 text-sm text-ikincil">
            Açık adres ve iletişim bilgileriniz bu sayfada gösterilmiyor.
          </p>
        </aside>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <ButonLink href="/kategori">Ürünlere bak</ButonLink>
        <ButonLink href="/iletisim" tur="cerceve">
          Sipariş hakkında yaz
        </ButonLink>
      </div>
    </Kap>
  )
}
