import { Kap } from '@/components/duzen/Kap'

/** Sunucuda hazırlanan sayfalar için ara durum. Düzen zıplamasın diye
 *  başlık yüksekliği kadar yer tutar. */
export default function Yukleniyor() {
  return (
    <Kap className="py-8 md:py-12">
      <p className="yazi-mono" role="status">
        yükleniyor…
      </p>
    </Kap>
  )
}
