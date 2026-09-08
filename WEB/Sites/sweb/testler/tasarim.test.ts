import test from 'node:test'
import assert from 'node:assert/strict'
import { sistemTalimati, benzerUrunler } from '../lib/tasarim'
import { FORMLAR, YAPILMAYANLAR, EN_AZ_ADET, OLCU_SINIRI } from '../lib/uretim'
import { URUNLER } from '../lib/urunler'

test('sistem talimatı yetenek listesinden üretilir', () => {
  const t = sistemTalimati()
  for (const f of FORMLAR) assert.ok(t.includes(f.ad), `form eksik: ${f.ad}`)
  for (const y of YAPILMAYANLAR) assert.ok(t.includes(y), `sınır eksik: ${y}`)
  assert.ok(t.includes(String(EN_AZ_ADET)))
  assert.ok(t.includes(String(OLCU_SINIRI.enCok)))
})

test('form örnekleri katalogda var', () => {
  const kodlar = new Set(URUNLER.map((u) => u.kod))
  for (const f of FORMLAR) {
    for (const k of f.ornekler) assert.ok(kodlar.has(k), `${f.anahtar} örneği yok: ${k}`)
  }
})

test('brif eşleşmesi istenen sayıda ürün döndürür', () => {
  const e = benzerUrunler({ anlatim: 'kahve kapsülleri için döner stand', form: 'doner' }, 6)
  assert.equal(e.length, 6)
  assert.ok(e[0].puan > 0)
})

test('anlatım boşken bile liste boş kalmaz — müşteri boş ekran görmez', () => {
  const e = benzerUrunler({ anlatim: '', form: 'tepsi' }, 4)
  assert.equal(e.length, 4)
})

test('puan sırası azalan', () => {
  const e = benzerUrunler({ anlatim: 'banyo tezgâh organizeri', form: 'organizer' }, 8)
  for (let i = 1; i < e.length; i++) assert.ok(e[i - 1].puan >= e[i].puan)
})
