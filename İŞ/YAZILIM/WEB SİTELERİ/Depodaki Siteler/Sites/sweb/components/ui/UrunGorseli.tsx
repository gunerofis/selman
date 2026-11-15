import Image from 'next/image'

/**
 * Ürün görseli.
 *
 * Render'a dokunulmuyor: alan 3:2, `object-fit: contain`. 3:2 çekimler
 * alanı tam dolduruyor, farklı oranda olanlar (7024) kırpılmak yerine
 * zemine yaslanıyor. Ad ve kod bu alanın DIŞINDA, altındaki boşlukta.
 */
export function UrunGorseli({
  kaynak,
  alt,
  zemin = 'var(--color-sut)',
  oncelik = false,
  boyutlar = '(max-width: 767px) 50vw, (max-width: 1439px) 33vw, 25vw',
  className = '',
}: {
  kaynak: string
  alt: string
  zemin?: string
  oncelik?: boolean
  boyutlar?: string
  className?: string
}) {
  return (
    <div
      className={`relative aspect-3/2 w-full overflow-hidden ${className}`}
      style={{ background: zemin }}
    >
      <Image
        src={kaynak}
        alt={alt}
        fill
        sizes={boyutlar}
        priority={oncelik}
        className="object-contain"
      />
    </div>
  )
}
