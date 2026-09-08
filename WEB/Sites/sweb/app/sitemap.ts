import type { MetadataRoute } from 'next'
import { site, hukukiSayfalar } from '@/lib/site'
import { URUNLER } from '@/lib/urunler'
import { KATEGORILER, kategoriYolAdresi } from '@/lib/kategoriler'

export default function sitemap(): MetadataRoute.Sitemap {
  const simdi = new Date()
  const u = (yol: string) => `${site.url}${yol}`

  return [
    { url: u('/'), lastModified: simdi, priority: 1 },
    { url: u('/kategori'), lastModified: simdi, priority: 0.8 },
    { url: u('/koleksiyon'), lastModified: simdi, priority: 0.8 },
    { url: u('/tasarla'), lastModified: simdi, priority: 0.9 },
    { url: u('/duvar-kur'), lastModified: simdi, priority: 0.8 },
    { url: u('/kurumsal-teklif'), lastModified: simdi, priority: 0.6 },
    { url: u('/atolye'), lastModified: simdi, priority: 0.5 },
    { url: u('/iletisim'), lastModified: simdi, priority: 0.5 },
    ...KATEGORILER.map((k) => ({ url: u(kategoriYolAdresi(k.slug)), lastModified: simdi, priority: 0.7 })),
    ...URUNLER.map((p) => ({ url: u(`/urun/${p.slug}`), lastModified: simdi, priority: 0.7 })),
    ...hukukiSayfalar.map((s) => ({ url: u(s.yol), lastModified: simdi, priority: 0.2 })),
  ]
}
