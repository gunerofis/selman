import Link from 'next/link'
import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react'

type Tur = 'dolu' | 'cerceve'

const taban =
  'inline-flex items-center justify-center px-5 py-[11px] text-sm font-medium ' +
  'transition-colors duration-[320ms] ease-cikis ' +
  'disabled:opacity-45 disabled:pointer-events-none'

const turler: Record<Tur, string> = {
  // Buton dolgusu kahve — site-plani.md
  dolu: 'bg-kahve text-kagit hover:bg-[#3B2F24]',
  cerceve: 'bg-transparent text-kahve border border-dikis-koyu hover:border-kahve',
}

type ButonProps = ComponentPropsWithoutRef<'button'> & {
  tur?: Tur
  children: ReactNode
}

export const Buton = forwardRef<HTMLButtonElement, ButonProps>(function Buton(
  { tur = 'dolu', className = '', children, ...rest },
  ref,
) {
  return (
    <button ref={ref} type="button" className={`${taban} ${turler[tur]} ${className}`} {...rest}>
      {children}
    </button>
  )
})

type ButonLinkProps = {
  href: string
  tur?: Tur
  className?: string
  children: ReactNode
}

export function ButonLink({ href, tur = 'dolu', className = '', children }: ButonLinkProps) {
  return (
    <Link href={href} className={`${taban} ${turler[tur]} ${className}`}>
      {children}
    </Link>
  )
}
