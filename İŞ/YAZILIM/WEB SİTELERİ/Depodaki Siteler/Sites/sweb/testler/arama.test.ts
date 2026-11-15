import test from 'node:test'
import assert from 'node:assert/strict'
import { ara, kokle, kelimeler, kategoriOnerileri } from '../lib/arama'
import { URUNLER } from '../lib/urunler'

test('kökleme Türkçe ekleri atar', () => {
  assert.equal(kokle('kutular'), 'kutu')
  assert.equal(kokle('Kahvenin'), 'kahve')
  assert.equal(kokle('raf'), 'raf', '4 harf ve altı bozulmaz')
  assert.equal(kokle('Fırça,'), 'fırça')
})

test('durdurma kelimeleri elenir', () => {
  assert.deepEqual(kelimeler('bu ve bir kahve standı'), ['kahve', 'stand'])
})

test('kısa sorgu sonuç döndürmez', () => {
  assert.equal(ara('').length, 0)
  assert.equal(ara('a').length, 0)
})

test('ürün kodu tam yazılırsa o ürün başa gelir', () => {
  const s = ara('7054')
  assert.ok(s.length > 0)
  assert.equal(s[0].urun.kod, '7054')
})

test('ada göre eşleşme açıklamaya göre eşleşmeyi geçer', () => {
  const s = ara('baharatlık')
  assert.equal(s[0].urun.kod, '7042')
})

test('önek eşleşmesi çalışır ama tam eşleşmenin gerisinde kalır', () => {
  const onek = ara('kahv')
  assert.ok(onek.some((x) => x.urun.kategori === 'kahve'), 'yarım kelime bulmalı')
  const tam = ara('kahve')
  assert.ok(tam[0].puan >= onek[0].puan)
})

test('sonuç sırası kararlı', () => {
  assert.deepEqual(
    ara('kutu').map((x) => x.urun.kod),
    ara('kutu').map((x) => x.urun.kod),
  )
})

test('eşleşmeyen sorgu boş döner — uydurma sonuç yok', () => {
  assert.equal(ara('zzzzqqqq').length, 0)
})

test('kategori önerisi kategori adıyla eşleşir', () => {
  const k = kategoriOnerileri('banyo')
  assert.equal(k[0]?.slug, 'banyo')
})

test('her ürün kendi adıyla bulunabiliyor', () => {
  for (const u of URUNLER) {
    const s = ara(u.ad)
    assert.ok(
      s.some((x) => x.urun.kod === u.kod),
      `${u.kod} ${u.ad} kendi adıyla bulunamadı`,
    )
  }
})
