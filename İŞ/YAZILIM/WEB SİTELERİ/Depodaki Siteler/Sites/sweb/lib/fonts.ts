import { Archivo, Instrument_Sans, JetBrains_Mono } from 'next/font/google'

/** Display — geniş eksen kullanıldığı için wdth ekseni açık. */
export const archivo = Archivo({
  subsets: ['latin', 'latin-ext'],
  axes: ['wdth'],
  variable: '--font-archivo',
  display: 'swap',
})

/** Gövde. */
export const instrument = Instrument_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500'],
  variable: '--font-instrument',
  display: 'swap',
})

/** Teknik: ürün kodu, ölçü, fiyat. */
export const jetbrains = JetBrains_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const fontDegiskenleri = `${archivo.variable} ${instrument.variable} ${jetbrains.variable}`
