import test from 'node:test'
import assert from 'node:assert/strict'
import {
  adrestenDuvar,
  bosDuvar,
  doluSayisi,
  duvarAdresi,
  kalemler,
  kenarDegistir,
  toplamKurus,
} from '../lib/duvar-kur'

test('boş duvar doğru büyüklükte', () => {
  const d = bosDuvar(5)
  assert.equal(d.hucreler.length, 25)
  assert.equal(doluSayisi(d), 0)
})

test('adres gidiş dönüş korunuyor', () => {
  const d = adrestenDuvar('4', '7042.taba,,7005.krem')
  assert.equal(d.kenar, 4)
  assert.deepEqual(d.hucreler[0], { kod: '7042', renk: 'taba' })
  assert.equal(d.hucreler[1], null)
  assert.deepEqual(d.hucreler[2], { kod: '7005', renk: 'krem' })
  assert.equal(duvarAdresi(d), '?n=4&h=7042.taba,,7005.krem')
})

test('bozuk adres parçası boş hücreye düşer, sayfa patlamaz', () => {
  const d = adrestenDuvar('4', 'yokboyle.taba,7042.morumsu,,7042')
  assert.equal(doluSayisi(d), 0)
})

test('geçersiz kenar varsayılana döner', () => {
  assert.equal(adrestenDuvar('99', '').kenar, 4)
  assert.equal(adrestenDuvar(null, null).kenar, 4)
})

test('kenar değişince yerleşim satır satır korunur', () => {
  const d = adrestenDuvar('4', '7042.taba,,,,,,,,7005.krem')
  const buyuk = kenarDegistir(d, 6)
  assert.equal(buyuk.hucreler.length, 36)
  assert.deepEqual(buyuk.hucreler[0], { kod: '7042', renk: 'taba' })
  // 4×4'te 8. sıra = (2,0); 6×6'da (2,0) = 12. sıra
  assert.deepEqual(buyuk.hucreler[12], { kod: '7005', renk: 'krem' })
})

test('aynı ürün+renk tek kaleme toplanır', () => {
  const d = adrestenDuvar('4', '7042.taba,7042.taba,7042.krem')
  const k = kalemler(d)
  assert.equal(k.length, 2)
  assert.equal(k.find((x) => x.renk === 'taba')?.adet, 2)
})

test('fiyatı olmayan kalem varken toplam uydurulmaz', () => {
  assert.equal(toplamKurus(adrestenDuvar('4', '7042.taba')), null)
  assert.equal(toplamKurus(bosDuvar(4)), null)
})
