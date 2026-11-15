/**
 * Yayın öncesi kontrol.
 *
 *   npm run build && npm start        (ayrı terminalde)
 *   npm run qa                        (QA_URL ile port değiştirilebilir)
 *
 * Bakılanlar: her sayfa 200 mü, iç linkler kırık mı, axe ile WCAG 2.1 AA,
 * uçtan uca sipariş akışı, çerez izni davranışı, konsol hataları.
 */
import { chromium } from 'playwright'
import AxeBuilder from '@axe-core/playwright'

const B = process.env.QA_URL || 'http://localhost:3000'
const b = await chromium.launch({
  ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
  // Sandbox'ta dış bağlantılar askıda kalıp testi kilitliyor.
  args: [
    '--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE localhost',
    '--disable-background-networking',
    '--disable-features=AutofillServerCommunication,OptimizationHints,Translate',
    '--no-first-run',
  ],
})
const konsol = []

async function sayfa(viewport) {
  const ctx = await b.newContext(viewport ? { viewport } : {})
  ctx.setDefaultNavigationTimeout(20000)
  const p = await ctx.newPage()
  p.on('pageerror', (e) => konsol.push('pageerror: ' + e.message))
  // 404 sayfası bilerek açılıyor; tarayıcının kendi "Failed to load
  // resource" kaydı hata sayılmaz. Gerçek konsol hatası yine yakalanır.
  p.on('console', (m) => {
    if (m.type() !== 'error') return
    const bilerek = /\/yok(\b|-)/.test(p.url()) && m.text().includes('Failed to load resource')
    if (!bilerek) konsol.push('console: ' + m.text())
  })
  p.git = async (yol, bekle = 600) => {
    const r = await p.goto(B + yol, { waitUntil: 'commit' })
    await p.waitForLoadState('domcontentloaded')
    if (bekle) await p.waitForTimeout(bekle)
    return r
  }
  return p
}

// 1 — her sayfa açılıyor mu, kırık iç link var mı
const p0 = await sayfa()
await p0.git('/sitemap.xml', 0)
const yollar = [...(await p0.content()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname)
const durum = new Map()
for (const y of [...yollar, '/sepet', '/odeme', '/odeme/tesekkurler', '/ara',
  '/ara?s=kahve', '/koleksiyon?renk=lacivert', '/kategori/mutfak?renk=bordo', '/yok-boyle-sayfa'])
  durum.set(y, (await p0.git(y, 0)).status())
const beklenmeyen = [...durum].filter(([y, s]) => (y === '/yok-boyle-sayfa' ? s !== 404 : s !== 200))
console.log('sayfa:', durum.size, '· beklenmeyen durum:', beklenmeyen.length ? beklenmeyen : 'yok')

const linkler = new Set()
for (const y of yollar.slice(0, 14)) {
  await p0.git(y, 0)
  for (const h of await p0.$$eval('a[href^="/"]', (a) => a.map((x) => x.getAttribute('href'))))
    linkler.add(h.split('#')[0].split('?')[0])
}
const kirik = []
for (const l of linkler) {
  if (!durum.has(l)) durum.set(l, (await p0.git(l, 0)).status())
  if (durum.get(l) !== 200) kirik.push([l, durum.get(l)])
}
console.log('iç link:', linkler.size, '· kırık:', kirik.length ? kirik : 'yok')
await p0.context().close()

// 2 — erişilebilirlik
const orn = ['/', '/tasarla', '/kategori', '/kategori/mutfak', '/urun/kahve-karuseli', '/koleksiyon',
  '/ara?s=kahve', '/kategori/ofis', '/urun/masa-pedi', '/duvar-kur', '/duvar-kur?n=4&h=7042.taba,,7005.krem',
  '/sepet', '/odeme', '/kurumsal-teklif', '/iletisim', '/cerez-politikasi', '/yok']
const ihlal = []
for (const w of [1400, 390]) {
  const p = await sayfa({ width: w, height: 900 })
  for (const y of orn) {
    // Duvar 40ms arayla açılıyor; animasyon bitmeden ölçülürse yarı saydam
    // metin kontrast ihlali gibi görünür. Bitene kadar bekle.
    await p.git(y, y === '/' ? 1600 : 700)
    const s = await new AxeBuilder({ page: p })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
    for (const v of s.violations) ihlal.push(`${w}px ${y} · ${v.id} × ${v.nodes.length}`)
  }
  await p.context().close()
}
console.log('axe:', ihlal.length ? ihlal : 'ihlal yok')

// 3 — uçtan uca sipariş
const p = await sayfa({ width: 1400, height: 1000 })
await p.git('/urun/baharatlik')
await p.getByRole('button', { name: 'Sepete ekle' }).click()
await p.git('/odeme')
for (const [id, v] of [['ad', 'Faris K'], ['eposta', 'a@b.com'], ['telefon', '5551112233'],
  ['adres', 'Örnek mah. 12/3 daire 5'], ['il', 'İstanbul'], ['ilce', 'Kadıköy'], ['postaKodu', '34710']])
  await p.fill('#' + id, v)
await p.getByRole('button', { name: 'Siparişi tamamla' }).click()
// Kayıt açıkken kendi durum sayfasına, kapalıyken teşekkür sayfasına gider.
await p.waitForURL(/\/siparis\/|tesekkurler/, { timeout: 15000 })
const siparisYolu = new URL(p.url()).pathname
console.log('sipariş akışı: tamam ·', siparisYolu)
if (siparisYolu.startsWith('/siparis/')) {
  const bas = (await p.getByRole('heading', { level: 1 }).textContent()) ?? ''
  const govde = await p.textContent('body')
  console.log('sipariş durumu:', bas.trim())
  // Bağlantıyı ele geçiren biri müşterinin adını ve açık adresini görmemeli.
  const sizinti = ['Faris K', 'Örnek mah', '5551112233', 'a@b.com'].filter((x) => govde.includes(x))
  console.log('kişisel veri sızıntısı:', sizinti.length ? sizinti : 'yok')
}
await p.context().close()

// 4 — çerez bandı
const c = await sayfa({ width: 1400, height: 900 })
await c.git('/')
console.log('çerez bandı:', await c.getByRole('dialog').isVisible(), '· odak:',
  (await c.evaluate(() => document.activeElement?.textContent?.trim())))
await c.getByRole('button', { name: 'Zorunlu olanlar yeter' }).click()
await c.waitForTimeout(300)
console.log('kapandı:', (await c.getByRole('dialog').count()) === 0)
await c.git('/')
console.log('tekrar sormuyor:', (await c.getByRole('dialog').count()) === 0)
await c.context().close()

// 5 — arama
const a = await sayfa({ width: 1400, height: 900 })
await a.git('/')
await a.fill('input[type="search"]', '7042')
await a.getByRole('button', { name: 'Ara' }).first().click()
await a.waitForURL(/\/ara\?s=/, { timeout: 10000 })
console.log('arama:', new URL(a.url()).search, '·',
  (await a.locator('a[href^="/urun/"]').first().getAttribute('href')))
await a.git('/ara?s=zzzzqqqq')
console.log('sonuçsuz arama tasarıma yönlendiriyor:',
  (await a.locator('a[href="/tasarla"]').count()) > 0)
await a.context().close()

// 6 — duvar kurucu: yerleştir, adres güncellensin, sepete geçsin
const dk = await sayfa({ width: 1400, height: 1000 })
await dk.git('/duvar-kur?n=4')
await dk.locator('button[aria-label^="1. hücre"]').click()
await dk.locator('dialog[aria-label="1. hücre"] button[aria-pressed]').first().click()
await dk.waitForFunction(() => location.search.includes('h='), null, { timeout: 5000 })
console.log('duvar kurucu adresi:', new URL(dk.url()).search)
await dk.getByRole('button', { name: 'Duvarı sepete ekle' }).click()
await dk.waitForTimeout(400)
await dk.git('/sepet')
console.log('duvar sepete geçti:', (await dk.locator('a[href^="/urun/"]').count()) > 0)
await dk.context().close()

// 7 — komut paleti
const kp = await sayfa({ width: 1400, height: 900 })
await kp.git('/')
await kp.keyboard.press('Control+k')
await kp.waitForSelector('dialog[aria-label="Komut paleti"][open]', { timeout: 5000 })
await kp.keyboard.type('baharat')
await kp.waitForTimeout(200)
await kp.keyboard.press('Enter')
await kp.waitForURL(/\/urun\//, { timeout: 8000 })
console.log('komut paleti:', new URL(kp.url()).pathname)
await kp.keyboard.press('Control+k')
await kp.waitForSelector('dialog[aria-label="Komut paleti"][open]', { timeout: 5000 })
await kp.keyboard.press('Escape')
await kp.waitForTimeout(200)
console.log('esc kapatıyor:', (await kp.locator('dialog[aria-label="Komut paleti"][open]').count()) === 0)
await kp.git('/urun/baharatlik')
await kp.git('/urun/ekmek-kutusu')
console.log('son bakılanlar:', (await kp.locator('text=son bakılanlar').count()) > 0)
await kp.context().close()

console.log('konsol:', konsol.length ? [...new Set(konsol)] : 'temiz')
await b.close()
