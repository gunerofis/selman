import test from 'node:test'
import assert from 'node:assert/strict'
import * as d from '../lib/dogrula'

test('metin — boşluk kırpılır, alt sınır uygulanır', () => {
  assert.equal(d.metin('Ali'), null)
  assert.notEqual(d.metin('  '), null)
  assert.notEqual(d.metin('a'), null)
  assert.notEqual(d.metin(undefined), null)
  assert.notEqual(d.metin('x'.repeat(201)), null)
})

test('eposta', () => {
  assert.equal(d.eposta('a@b.co'), null)
  assert.equal(d.eposta('  a@b.co  '), null)
  for (const kotu of ['a@b', 'a b@c.co', '@b.co', 'a@.co', '']) {
    assert.notEqual(d.eposta(kotu), null, kotu)
  }
})

test('telefon — TR cep, ayraçlar serbest', () => {
  for (const iyi of ['5551234567', '0555 123 45 67', '+90 (555) 123-45-67']) {
    assert.equal(d.telefon(iyi), null, iyi)
  }
  assert.notEqual(d.telefon('2121234567'), null, 'sabit hat kabul edilmemeli')
  assert.notEqual(d.telefon('555123456'), null, 'eksik hane')
  assert.equal(d.telefon(''), null, 'zorunlu değilse boş geçer')
  assert.notEqual(d.telefon('', true), null, 'zorunluysa boş geçmez')
})

test('sayı — tam sayı ve aralık', () => {
  assert.equal(d.sayi(5, 1, 10), null)
  assert.notEqual(d.sayi(5.5), null)
  assert.notEqual(d.sayi('abc'), null)
  assert.notEqual(d.sayi(0, 1), null)
  assert.notEqual(d.sayi(11, 1, 10), null)
})

test('topla yalnız hatalı alanları döndürür', () => {
  const h = d.topla({ ad: null, eposta: 'Geçerli e-posta girin.' })
  assert.deepEqual(h, { eposta: 'Geçerli e-posta girin.' })
})
