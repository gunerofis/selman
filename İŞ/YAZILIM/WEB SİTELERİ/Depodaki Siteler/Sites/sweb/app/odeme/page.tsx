import type { Metadata } from 'next'
import { Kap } from '@/components/duzen/Kap'
import { OdemeAkisi } from '@/components/odeme/OdemeAkisi'

export const metadata: Metadata = {
  title: 'Ödeme',
  robots: { index: false, follow: false },
}

export default function OdemeSayfasi() {
  return (
    <Kap className="py-8 md:py-12">
      <h1 className="yazi-display text-2xl">Ödeme</h1>
      <OdemeAkisi />
    </Kap>
  )
}
