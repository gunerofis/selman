import type { Metadata } from 'next'
import { Kap } from '@/components/duzen/Kap'
import { TalepGorunumu } from '@/components/tasarim/TalepGorunumu'

export const metadata: Metadata = {
  title: 'Tasarım talebiniz',
  // Jetonlu adres arama motoruna girmemeli.
  robots: { index: false, follow: false },
}

type Props = { params: Promise<{ jeton: string }> }

export default async function TalepSayfasi({ params }: Props) {
  const { jeton } = await params
  return (
    <Kap className="py-8 md:py-12">
      <p className="yazi-mono">tasarım talebi</p>
      <h1 className="yazi-display mt-3 text-2xl">Talebiniz</h1>
      <p className="mt-3 max-w-[62ch] text-ikincil">
        Bu sayfa size özel. Bağlantıyı e-posta ile de gönderiyoruz; kaydedin,
        tasarım hazır olunca buradan görürsünüz.
      </p>
      <TalepGorunumu jeton={jeton} />
    </Kap>
  )
}
