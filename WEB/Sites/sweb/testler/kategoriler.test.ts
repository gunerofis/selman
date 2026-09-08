import test from 'node:test'
import assert from 'node:assert/strict'
import {
  KATEGORILER,
  dilimdenKategori,
  kategoriYolAdresi,
  kategoriYolu,
  kendiUrunleri,
  tumUrunleri,
  sirala,
} from '../lib/kategoriler'
import { URUNLER } from '../lib/urunler'

test('yalnız kanonik yol kabul edilir', () => {
  assert.equal(dilimdenKategori(['mutfak', 'kahve'])?.slug, 'kahve')
  assert.equal(dilimdenKategori(['kahve']), null, 'kısayol aynı içeriği ikinci adreste açmamalı')
  assert.equal(dilimdenKategori(['banyo', 'kahve']), null)
  assert.equal(dilimdenKategori([]), null)
  assert.equal(dilimdenKategori(['yok-boyle']), null)
})

test('kategori yolu kökten yaprağa', () => {
  assert.deepEqual(
    kategoriYolu('kahve').map((k) => k.slug),
    ['mutfak', 'kahve'],
  )
  assert.equal(kategoriYolAdresi('kahve'), '/kategori/mutfak/kahve')
})

test('alt kategori ürünleri üstün toplamına girer, kendi listesine girmez', () => {
  const kendi = kendiUrunleri('mutfak').map((u) => u.kod)
  const tum = tumUrunleri('mutfak').map((u) => u.kod)
  assert.ok(!kendi.includes('7054'))
  assert.ok(tum.includes('7054'))
  assert.ok(tum.length > kendi.length)
})

test('her ürünün kategorisi ağaçta var', () => {
  const slugler = new Set(KATEGORILER.map((k) => k.slug))
  for (const u of URUNLER) assert.ok(slugler.has(u.kategori), `${u.kod}: ${u.kategori}`)
})

test('sıralama girdiyi değiştirmez', () => {
  const girdi = kendiUrunleri('banyo')
  const once = girdi.map((u) => u.kod)
  sirala(girdi, 'ad')
  assert.deepEqual(girdi.map((u) => u.kod), once)
})

test('ada göre sıralama Türkçe alfabeye uyar', () => {
  const adlar = sirala(URUNLER, 'ad').map((u) => u.ad)
  const beklenen = [...adlar].sort((a, b) => a.localeCompare(b, 'tr'))
  assert.deepEqual(adlar, beklenen)
})

test('ofis koleksiyonu kök kategori ve kapağı var', () => {
  const ofis = KATEGORILER.find((k) => k.slug === 'ofis')
  assert.ok(ofis, 'ofis kategorisi yok')
  assert.equal(ofis!.ust, undefined, 'ofis kök kategori olmalı')
  assert.ok(ofis!.kapak?.yol.endsWith('.webp'))
  assert.ok((ofis!.kapak?.alt.length ?? 0) > 10, 'kapak alt metni gerekli')
  assert.ok(kendiUrunleri('ofis').length >= 38, 'ofis koleksiyonu eksik')
})

test('kapak tanımlı her kategorinin alt metni var', () => {
  for (const k of KATEGORILER) {
    if (!k.kapak) continue
    assert.ok(k.kapak.alt.trim().length > 0, `${k.slug} kapak alt metni boş`)
  }
})
