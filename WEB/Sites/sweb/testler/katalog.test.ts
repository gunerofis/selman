import test from 'node:test'
import assert from 'node:assert/strict'
import { URUNLER, gorselFor } from '../lib/urunler'
import { RENK_ANAHTARLARI } from '../lib/renkler'
import { DUVAR_TOPLAM, duvarSirasi } from '../lib/duvar'
import { fiyat, olcu, agirlik, teslim, YOK } from '../lib/bicim'

test('ürün kodu ve slug benzersiz', () => {
  const kod = new Set(URUNLER.map((u) => u.kod))
  const slug = new Set(URUNLER.map((u) => u.slug))
  assert.equal(kod.size, URUNLER.length, 'kod tekrarı var')
  assert.equal(slug.size, URUNLER.length, 'slug tekrarı var')
})

test('görsel yolu koddan türüyor', () => {
  for (const u of URUNLER) assert.equal(u.gorsel, `/urunler/${u.kod}.webp`)
})

test('ürün adı sıfat taşımaz ve küçük harfle başlar', () => {
  const yasak = ['eşsiz', 'muhteşem', 'premium', 'lüks', 'özel tasarım']
  for (const u of URUNLER) {
    assert.equal(u.ad, u.ad.toLocaleLowerCase('tr'), `${u.kod} büyük harf içeriyor`)
    for (const k of yasak) assert.ok(!u.ad.includes(k), `${u.kod} yasak kelime: ${k}`)
  }
})

test('renkler sabit listeden', () => {
  for (const u of URUNLER) {
    assert.ok(u.renkler.length > 0, `${u.kod} rengsiz`)
    for (const r of u.renkler) assert.ok(RENK_ANAHTARLARI.includes(r), `${u.kod}: ${r}`)
  }
})

test('duvar sırası deterministik ve tam', () => {
  const a = duvarSirasi()
  const b = duvarSirasi()
  assert.equal(a.length, DUVAR_TOPLAM)
  assert.deepEqual(a.map((u) => u?.kod ?? null), b.map((u) => u?.kod ?? null))
})

test('duvarda aynı ürün iki kez görünmez', () => {
  const kodlar = duvarSirasi().filter(Boolean).map((u) => u!.kod)
  assert.equal(new Set(kodlar).size, kodlar.length)
})

test('farklı tohum farklı sıra verir', () => {
  assert.notDeepEqual(
    duvarSirasi(1).map((u) => u?.kod),
    duvarSirasi(2).map((u) => u?.kod),
  )
})

test('girilmemiş veri uydurulmaz, işaretle gösterilir', () => {
  assert.equal(fiyat(null), YOK)
  assert.equal(olcu(null), YOK)
  assert.equal(agirlik(null), YOK)
  assert.equal(teslim(null), YOK)
})

test('biçimler tr-TR', () => {
  assert.equal(fiyat(145000), '1.450,00 ₺')
  assert.equal(olcu([240, 160, 90]), '240 × 160 × 90 mm')
  assert.equal(agirlik(1380), '1.380 g')
  assert.equal(teslim([3, 5]), '3-5 iş günü')
  assert.equal(teslim([2, 2]), '2 iş günü')
})

test('renk çekimi olan üründe her renk için dosya adı üretiliyor', () => {
  const renkli = URUNLER.filter((u) => u.renkGorselleri)
  assert.ok(renkli.length > 0, 'renk çekimi olan ürün yok')
  for (const u of renkli) {
    for (const r of u.renkler) {
      const yol = gorselFor(u, r)
      assert.equal(yol, `/urunler/${u.kod}-${r}.webp`, `${u.kod} ${r}`)
    }
  }
})

test('renk çekimi olmayan ürün ana görsele düşüyor', () => {
  const duz = URUNLER.find((u) => !u.renkGorselleri)!
  assert.equal(gorselFor(duz, 'lacivert'), duz.gorsel)
  assert.equal(gorselFor(duz, null), duz.gorsel)
})

test('renk seçilmemişse her ürün ana görselini verir', () => {
  for (const u of URUNLER) assert.equal(gorselFor(u, null), u.gorsel)
})

test('geçici kodlar gerçek katalog aralığına girmiyor', () => {
  // Gerçek katalog kodları 70xx aralığında; kodu bekleyen ürünler 79xx
  // bloğunda tutuluyor ki yeni sayfa geldiğinde çakışma olmasın.
  const gecici = URUNLER.filter((u) => u.kod.startsWith('79')).map((u) => u.kod)
  const gercek = URUNLER.filter((u) => u.kod.startsWith('70')).map((u) => u.kod)
  assert.ok(gecici.length > 0)
  for (const k of gecici) assert.ok(!gercek.includes(k), `çakışma: ${k}`)
})
