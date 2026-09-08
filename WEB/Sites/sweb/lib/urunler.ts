import type { RenkAnahtari } from './renkler'

/**
 * Ürün veri sözleşmesi.
 *
 * Ad, kod, kategori ve renk render'lardan okundu. Ölçü, ağırlık, fiyat,
 * teslim ve stok Faris'ten gelecek; uydurulmadı, `null` bırakıldı ve
 * arayüzde "—" olarak görünüyor. Faz 3'te bu dosyanın yerini CMS alacak;
 * alan adları o zaman da değişmeyecek.
 *
 * Ad kuralı: ürün adı işlevle başlar, sıfat taşımaz, küçük harfle yazılır.
 */
export type Urun = {
  /** Ürün kodu. URL'de ve her mono alanda görünür. */
  kod: string
  ad: string
  slug: string
  kategori: string
  /** Kuruş cinsinden. Biçimlendirme lib/bicim.ts içinde. */
  fiyatKurus: number | null
  /** [en, boy, yükseklik] mm */
  olcuMm: readonly [number, number, number] | null
  agirlikG: number | null
  /** [en az, en çok] iş günü */
  teslimIsGunu: readonly [number, number] | null
  renkler: readonly RenkAnahtari[]
  /** Bir cümle. Ne işe yaradığını söyler. */
  aciklama: string
  /** Ürün görseli, orijinal boyutunda. Kalıp: `<kod>.webp` */
  gorsel: string
  /**
   * Renge göre çekim. Kalıp: `<kod>-<renk>.webp`.
   *
   * Tanımlıysa renk seçimi görseli de değiştirir — duvardaki renk
   * noktaları, kategori listesi ve ürün sayfası aynı eşlemeyi kullanır.
   * Tanımsız üründe renk yalnız zemini değiştirir; `gorselFor` iki durumu
   * da tek yerden çözer.
   */
  renkGorselleri?: Partial<Record<RenkAnahtari, string>>
  /** null = stok bilgisi henüz girilmedi */
  stok: number | null
}

const g = (kod: string) => `/urunler/${kod}.webp`

/** Sekiz rengin tamamı çekilmiş ürünler için renk → görsel eşlemesi. */
const sekizRenk = (kod: string) =>
  Object.fromEntries(
    ['krem', 'taba', 'gri', 'lacivert', 'bordo', 'kahve', 'beyaz', 'siyah'].map((r) => [
      r,
      `/urunler/${kod}-${r}.webp`,
    ]),
  ) as Partial<Record<RenkAnahtari, string>>

/**
 * Ofis koleksiyonu tek kaplamayla çekildi: siyah gövde, kahve deri.
 * Başka renk render'ı gelene kadar liste tek renk — olmayan seçenek
 * gösterilmiyor.
 */
const OFIS_RENK: readonly RenkAnahtari[] = ['kahve']

/** Sekiz rengin tamamı. Ürüne göre daralabilir; Faris onaylayacak. */
const TUM: readonly RenkAnahtari[] = [
  'krem', 'taba', 'gri', 'lacivert', 'bordo', 'kahve', 'beyaz', 'siyah',
]

const bos = { fiyatKurus: null, olcuMm: null, agirlikG: null, teslimIsGunu: null, stok: null } as const

export const URUNLER: readonly Urun[] = [
  // banyo
  { kod: '7005', ad: 'tezgâh organizeri', slug: 'tezgah-organizeri', kategori: 'banyo', renkler: TUM, aciklama: 'Fırça yuvası, şişe gözleri ve altta açık çekmece.', gorsel: g('7005'), ...bos },
  { kod: '7045', ad: 'saç aleti standı', slug: 'sac-aleti-standi', kategori: 'banyo', renkler: TUM, aciklama: 'Dört yuva; kurutma makinesi, maşa ve fırça dik durur.', gorsel: g('7045'), ...bos },
  { kod: '7046', ad: 'çekmece düzenleyici', slug: 'cekmece-duzenleyici', kategori: 'banyo', renkler: TUM, aciklama: 'Bölmeleri kaydırılır; çekmece derinliğine oturur.', gorsel: g('7046'), ...bos },
  { kod: '7047', ad: 'banyo duvar rafı', slug: 'banyo-duvar-rafi', kategori: 'banyo', renkler: TUM, aciklama: 'İki kat raf, diş fırçası yuvaları ve altta havlu askısı.', gorsel: g('7047'), ...bos },
  { kod: '7048', ad: 'banyo organizeri', slug: 'banyo-organizeri', kategori: 'banyo', renkler: TUM, aciklama: 'Döner gövde; şişe, tarak ve jilet için ayrı bölmeler.', gorsel: g('7048'), ...bos },
  { kod: '7049', ad: 'tuvalet kağıtlığı', slug: 'tuvalet-kagitligi', kategori: 'banyo', renkler: TUM, aciklama: 'Yandan rulo askısı, kapaklı yedek haznesi, üstte mendillik.', gorsel: g('7049'), ...bos },

  // mutfak
  { kod: '7041', ad: 'evye organizeri', slug: 'evye-organizeri', kategori: 'mutfak', renkler: TUM, aciklama: 'Üç bölme, havlu askısı ve altta süzdürme tepsisi.', gorsel: g('7041'), ...bos },
  { kod: '7042', ad: 'baharatlık', slug: 'baharatlik', kategori: 'mutfak', renkler: TUM, aciklama: 'Döner gövde; altı kavanoz, ölçü kaşıkları ve poşet bölmesi.', gorsel: g('7042'), ...bos },
  { kod: '7043', ad: 'ekmek kutusu', slug: 'ekmek-kutusu', kategori: 'mutfak', renkler: TUM, aciklama: 'Sürgü kapak, kırıntı tepsisi ve yanında meyve-reçel rafı.', gorsel: g('7043'), ...bos },
  { kod: '7044', ad: 'folyo düzenleyici', slug: 'folyo-duzenleyici', kategori: 'mutfak', renkler: TUM, aciklama: 'Dört rulo yuvası, kesme sürgüsü ve klips bölmesi.', gorsel: g('7044'), ...bos },
  { kod: '7054', ad: 'kahve istasyonu', slug: 'kahve-istasyonu', kategori: 'kahve', renkler: TUM, aciklama: 'Üstte fincan rafı, altta kapsül çekmecesi ve şeker bölmesi.', gorsel: g('7054'), ...bos },
  // Ölçüler ürün bilgi sayfasından okundu (36,0 × 27,5 × 2,5 cm).
  // Bilgi sayfasındaki dördüncü renk "antrasit"; palette karşılığı gri
  // olarak eşlendi — Faris onaylayınca palet ya da eşleme güncellenir.
  // KOD BEKLİYOR: sayfada ürün kodu yok, seride boş olan 7064 verildi.
  { kod: '7064', ad: 'laptop ve evrak folyosu', slug: 'laptop-ve-evrak-folyosu', kategori: 'calisma', renkler: ['kahve', 'gri', 'siyah', 'taba'], aciklama: '15,6 inçe kadar laptop bölmesi, A4 evrak cebi, dört kart yuvası ve kalem tutucu.', gorsel: g('7064'), olcuMm: [360, 275, 25], fiyatKurus: null, agirlikG: null, teslimIsGunu: null, stok: null },
  { kod: '7062', ad: 'şarj ve defter standı', slug: 'sarj-ve-defter-standi', kategori: 'calisma', renkler: TUM, renkGorselleri: sekizRenk('7062'), aciklama: 'Defter yuvası, gözlük bölmesi, kalemlik ve kablo çıkışlı telefon standı.', gorsel: g('7062'), ...bos },
  { kod: '7063', ad: 'duvar giriş rafı', slug: 'duvar-giris-rafi', kategori: 'giris', renkler: TUM, renkGorselleri: sekizRenk('7063'), aciklama: 'Üstte mektup ve cüzdan bölmesi, altta anahtar kanalı ve üç askı.', gorsel: g('7063'), ...bos },
  { kod: '7065', ad: 'banyo tezgâh seti', slug: 'banyo-tezgah-seti', kategori: 'banyo', renkler: TUM, renkGorselleri: sekizRenk('7065'), aciklama: 'İki şişe yuvası, kavanoz ve havlu bölmesi, yüksek fırçalık gözü.', gorsel: g('7065'), ...bos },
  { kod: '7066', ad: 'baharat ve yağ rafı', slug: 'baharat-ve-yag-rafi', kategori: 'mutfak', renkler: TUM, renkGorselleri: sekizRenk('7066'), aciklama: 'Yanda iki şişe yatağı, önde iki kademeli altı kavanozluk raf.', gorsel: g('7066'), ...bos },
  { kod: '7067', ad: 'takı ve saat tepsisi', slug: 'taki-ve-saat-tepsisi', kategori: 'yatak-odasi', renkler: TUM, renkGorselleri: sekizRenk('7067'), aciklama: 'Üç yastıklı saat yuvası, iki gözlük kanalı, kolye ve yüzük bölmesi.', gorsel: g('7067'), ...bos },


  // Ofis koleksiyonu — katalog kodları basılı sayfalardan okundu.
  // Sekiz rengin tamamı çekilmiş; renk seçimi görseli de değiştiriyor.
  { kod: '7085', ad: 'laptop standı', slug: 'laptop-standi', kategori: 'ofis', renkler: TUM, renkGorselleri: sekizRenk('7085'), aciklama: 'Eğik gövde laptopu göz hizasına çıkarır; ön eşik kaymayı keser.', gorsel: g('7085'), ...bos },
  { kod: '7086', ad: 'tablet standı', slug: 'tablet-standi', kategori: 'ofis', renkler: TUM, renkGorselleri: sekizRenk('7086'), aciklama: 'Üçgen gövde, önde kablo boşluğu; tablet dik durur, şarjda kalır.', gorsel: g('7086'), ...bos },
  { kod: '7087', ad: 'kulaklık standı', slug: 'kulaklik-standi', kategori: 'ofis', renkler: TUM, renkGorselleri: sekizRenk('7087'), aciklama: 'Üstte yastıklı bar bandı ezmez; tabanda kablo ve alıcı gözü.', gorsel: g('7087'), ...bos },
  { kod: '7088', ad: 'evrak rafı', slug: 'evrak-rafi', kategori: 'ofis', renkler: TUM, renkGorselleri: sekizRenk('7088'), aciklama: 'İki kat A4 tepsi; ön kenar oyuğundan deste tek hamlede alınır.', gorsel: g('7088'), ...bos },
  { kod: '7089', ad: 'dosya bölmelisi', slug: 'dosya-bolmelisi', kategori: 'ofis', renkler: TUM, renkGorselleri: sekizRenk('7089'), aciklama: 'Beş eğik bölme; klasör ve dosya sırtı görünür durur.', gorsel: g('7089'), ...bos },
  { kod: '7091', ad: 'not kağıtlığı', slug: 'not-kagitligi', kategori: 'ofis', renkler: TUM, renkGorselleri: sekizRenk('7091'), aciklama: 'Bloknot yuvası ve yanında kalem kanalı; ön oyuk sayfayı gösterir.', gorsel: g('7091'), ...bos },
  { kod: '7092', ad: 'kartvizit rafı', slug: 'kartvizit-rafi', kategori: 'ofis', renkler: TUM, renkGorselleri: sekizRenk('7092'), aciklama: 'Üç kademe; farklı kart ve broşür arka arkaya görünür.', gorsel: g('7092'), ...bos },
  { kod: '7093', ad: 'broşürlük', slug: 'brosurluk', kategori: 'ofis', renkler: TUM, renkGorselleri: sekizRenk('7093'), aciklama: 'İki kademeli eğik gövde; A4 arkada, küçük broşür önde durur.', gorsel: g('7093'), ...bos },
  { kod: '7094', ad: 'yaka kartı tepsisi', slug: 'yaka-karti-tepsisi', kategori: 'ofis', renkler: TUM, renkGorselleri: sekizRenk('7094'), aciklama: 'Kart gözleri önde, kordon haznesi arkada; dağıtım sırası bozulmaz.', gorsel: g('7094'), ...bos },
  { kod: '7095', ad: 'yazıcı standı', slug: 'yazici-standi', kategori: 'ofis', renkler: TUM, renkGorselleri: sekizRenk('7095'), aciklama: 'Yazıcıyı yükseltir; altta kağıt rafı ve kartuş gözü.', gorsel: g('7095'), ...bos },
  { kod: '7096', ad: 'duvar evrak cebi', slug: 'duvar-evrak-cebi', kategori: 'ofis', renkler: TUM, renkGorselleri: sekizRenk('7096'), aciklama: 'Üç cep, duvara asılır; masa yüzeyi boş kalır.', gorsel: g('7096'), ...bos },
  { kod: '7098', ad: 'kablo kanalı', slug: 'kablo-kanali', kategori: 'ofis', renkler: TUM, renkGorselleri: sekizRenk('7098'), aciklama: 'Masa altına vidalanır; kablolar görünmeden yatay durur.', gorsel: g('7098'), ...bos },
  { kod: '7099', ad: 'masa altı çanta rafı', slug: 'masa-alti-canta-rafi', kategori: 'ofis', renkler: TUM, renkGorselleri: sekizRenk('7099'), aciklama: 'Masa altına vidalanan açık gövde; çanta yerden kalkar.', gorsel: g('7099'), ...bos },
  { kod: '7100', ad: 'çöp kutusu', slug: 'cop-kutusu', kategori: 'ofis', renkler: TUM, renkGorselleri: sekizRenk('7100'), aciklama: 'Konik gövde, ağız kenarı katlamalı; torba dışarıdan görünmez.', gorsel: g('7100'), ...bos },
  { kod: '7102', ad: 'masa düzenleyici', slug: 'masa-duzenleyici', kategori: 'ofis', renkler: TUM, renkGorselleri: sekizRenk('7102'), aciklama: 'Arkada cetvel kanalı, önde makas ve kalem yatağı, yanda silgi ve ataş gözü.', gorsel: g('7102'), ...bos },
  { kod: '7103', ad: 'cihaz dokları', slug: 'cihaz-doklari', kategori: 'ofis', renkler: TUM, renkGorselleri: sekizRenk('7103'), aciklama: 'Dört dikey yuva; tablet ve telefon yan yana dik durur.', gorsel: g('7103'), ...bos },

  // Ofis koleksiyonu — kodu bekleyen seriler
  // ofis koleksiyonu — tek kaplama (siyah gövde + kahve deri) çekildi;
  // başka renk render'ı yok, o yüzden renk listesi tek.
  // KOD BEKLİYOR: bu serinin kodu verilmedi. Sette 1-12 numaralandırması
  // var; 7901'den başlayan blok o sıraya göre geçici verildi. 70xx aralığı
  // gerçek katalog kodlarına ait olduğu için geçici blok 79xx'e taşındı —
  // yeni sayfa geldiğinde çakışma olmasın.
  { kod: '7901', ad: 'masa pedi', slug: 'masa-pedi', kategori: 'ofis', renkler: OFIS_RENK, aciklama: 'Klavye ve fare için tek parça çalışma yüzeyi; kenarı sert çerçeveli.', gorsel: g('7901'), ...bos },
  { kod: '7902', ad: 'telefon standı', slug: 'telefon-standi', kategori: 'ofis', renkler: OFIS_RENK, aciklama: 'Eğimli sırt, altta kablo geçidi; telefon dik durur.', gorsel: g('7902'), ...bos },
  { kod: '7903', ad: 'bilek desteği', slug: 'bilek-destegi', kategori: 'ofis', renkler: OFIS_RENK, aciklama: 'Klavye önüne gelen dolgulu destek.', gorsel: g('7903'), ...bos },
  { kod: '7904', ad: 'kalem tepsisi', slug: 'kalem-tepsisi', kategori: 'ofis', renkler: OFIS_RENK, aciklama: 'Uzun ve sığ; kalem, makas ve cetvel yan yana durur.', gorsel: g('7904'), ...bos },
  { kod: '7905', ad: 'bardak altlığı', slug: 'bardak-altligi', kategori: 'ofis', renkler: OFIS_RENK, aciklama: 'Kare altlık; kupanın ısısını masaya geçirmez.', gorsel: g('7905'), ...bos },
  { kod: '7906', ad: 'kablo tutucu', slug: 'kablo-tutucu', kategori: 'ofis', renkler: OFIS_RENK, aciklama: 'Ağırlıklı taban ve tek yarık; kablo masadan kaymaz.', gorsel: g('7906'), ...bos },
  { kod: '7907', ad: 'saat yatağı', slug: 'saat-yatagi', kategori: 'ofis', renkler: OFIS_RENK, aciklama: 'Silindir yastıklı kare kutu; saat kayışı gerilmeden durur.', gorsel: g('7907'), ...bos },
  { kod: '7908', ad: 'kare tepsi', slug: 'kare-tepsi', kategori: 'ofis', renkler: OFIS_RENK, aciklama: 'Anahtar, yüzük ve bozuk para için sığ kare tepsi.', gorsel: g('7908'), ...bos },
  { kod: '7909', ad: 'kartvizitlik', slug: 'kartvizitlik', kategori: 'ofis', renkler: OFIS_RENK, aciklama: 'Ön kenarda parmak oyuğu; kart tek hamlede alınır.', gorsel: g('7909'), ...bos },
  { kod: '7910', ad: 'üç bölmeli tepsi', slug: 'uc-bolmeli-tepsi', kategori: 'ofis', renkler: OFIS_RENK, aciklama: 'Bir geniş bir de iki küçük göz; küçük eşya karışmaz.', gorsel: g('7910'), ...bos },
  { kod: '7911', ad: 'kulaklık askısı', slug: 'kulaklik-askisi', kategori: 'ofis', renkler: OFIS_RENK, aciklama: 'Kavisli üst yastık kulaklık bandını ezmeden taşır.', gorsel: g('7911'), ...bos },

  { kod: '7912', ad: 'kare saklama tepsisi', slug: 'kare-saklama-tepsisi', kategori: 'ofis', renkler: OFIS_RENK, aciklama: 'Kenarları yüksek kare tepsi; küçük eşya masaya dağılmaz.', gorsel: g('7912'), ...bos },

  // Ofis koleksiyonunun ikinci serisi: gövde de deri kaplı, siyah çerçeve
  // yok. Tekil çekimleri gelmedi; görseller set fotoğrafından kesildi.
  // KOD BEKLİYOR — 7913'ten başlayan blok geçici.
  { kod: '7913', ad: 'evrak tepsisi', slug: 'evrak-tepsisi', kategori: 'ofis', renkler: OFIS_RENK, aciklama: 'A4 evrak sığar; ön kenardaki oyuktan deste tek hamlede alınır.', gorsel: g('7913'), ...bos },
  { kod: '7914', ad: 'kare deri tepsi', slug: 'kare-deri-tepsi', kategori: 'ofis', renkler: OFIS_RENK, aciklama: 'Gövdesi de deri kaplı kare tepsi.', gorsel: g('7914'), ...bos },
  { kod: '7915', ad: 'dosya standı', slug: 'dosya-standi', kategori: 'ofis', renkler: OFIS_RENK, aciklama: 'Eğik ön yüz; dosya ve dergi dik durur, sırtı görünür.', gorsel: g('7915'), ...bos },
  { kod: '7916', ad: 'kağıtlık', slug: 'kagitlik', kategori: 'ofis', renkler: OFIS_RENK, aciklama: 'Üstü kapalı, önü boydan boya açık; not kağıdı yatay durur.', gorsel: g('7916'), ...bos },
  { kod: '7917', ad: 'tablet altlığı', slug: 'tablet-altligi', kategori: 'ofis', renkler: OFIS_RENK, aciklama: 'Eğik sırt ve ön eşik; tablet kaymadan durur.', gorsel: g('7917'), ...bos },
  { kod: '7918', ad: 'deri bölmeli tepsi', slug: 'deri-bolmeli-tepsi', kategori: 'ofis', renkler: OFIS_RENK, aciklama: 'Bir geniş, iki küçük göz; gövdesi de deri kaplı.', gorsel: g('7918'), ...bos },
  { kod: '7919', ad: 'okuma standı', slug: 'okuma-standi', kategori: 'ofis', renkler: OFIS_RENK, aciklama: 'Geniş eğik yüzey; defter ve kitap açık durur.', gorsel: g('7919'), ...bos },
  { kod: '7920', ad: 'kalemlik', slug: 'kalemlik', kategori: 'ofis', renkler: OFIS_RENK, aciklama: 'Kare gövde, ağırlıklı taban; kalem dik durur.', gorsel: g('7920'), ...bos },
  { kod: '7921', ad: 'mendillik', slug: 'mendillik', kategori: 'ofis', renkler: OFIS_RENK, aciklama: 'Standart mendil kutusunu örter; üstte oval çıkış.', gorsel: g('7921'), ...bos },
  { kod: '7922', ad: 'dikdörtgen tepsi', slug: 'dikdortgen-tepsi', kategori: 'ofis', renkler: OFIS_RENK, aciklama: 'Sığ ve uzun; kalem, kablo ve gözlük yan yana durur.', gorsel: g('7922'), ...bos },

  { kod: '7055', ad: 'kahve karuseli', slug: 'kahve-karuseli', kategori: 'kahve', renkler: TUM, aciklama: 'Döner gövde; fincan katları, kapsül yuvaları ve karıştırıcı cebi.', gorsel: g('7055'), ...bos },

  // makyaj
  { kod: '7035', ad: 'makyaj rafı', slug: 'makyaj-rafi', kategori: 'makyaj', renkler: TUM, aciklama: 'Kemerli ayna, iki yanda kademeli raf, önde ruj sırası.', gorsel: g('7035'), ...bos },
  { kod: '7036', ad: 'ruj kulesi', slug: 'ruj-kulesi', kategori: 'makyaj', renkler: TUM, aciklama: 'Döner gövde; ruj yuvaları, fırça bölmesi ve üstte ayna.', gorsel: g('7036'), ...bos },
  { kod: '7037', ad: 'makyaj kutusu', slug: 'makyaj-kutusu', kategori: 'makyaj', renkler: TUM, aciklama: 'Aynalı kapak, bölmeli üst tabla ve iki çekmece.', gorsel: g('7037'), ...bos },
  { kod: '7038', ad: 'duvar makyaj aynası', slug: 'duvar-makyaj-aynasi', kategori: 'makyaj', renkler: TUM, aciklama: 'Duvara asılır; kapak açılınca çalışma tablası olur.', gorsel: g('7038'), ...bos },

  // giriş
  { kod: '7007', ad: 'askılı konsol', slug: 'askili-konsol', kategori: 'giris', renkler: TUM, aciklama: 'Üstte iki askı, altta çekmece ve açık raf.', gorsel: g('7007'), ...bos },
  { kod: '7008', ad: 'duvar telefon cebi', slug: 'duvar-telefon-cebi', kategori: 'giris', renkler: TUM, aciklama: 'Telefon yuvası, altta kalem ve gözlük cebi.', gorsel: g('7008'), ...bos },
  { kod: '7012', ad: 'ayakkabı bankı', slug: 'ayakkabi-banki', kategori: 'giris', renkler: TUM, aciklama: 'Döşemeli oturma yüzeyi, altında iki çift ayakkabı rafı.', gorsel: g('7012'), ...bos },
  { kod: '7014', ad: 'mektupluk', slug: 'mektupluk', kategori: 'giris', renkler: TUM, aciklama: 'Duvara asılır; evrak cebi, kalemlik ve anahtar askısı.', gorsel: g('7014'), ...bos },
  { kod: '7015', ad: 'anahtarlık panosu', slug: 'anahtarlik-panosu', kategori: 'giris', renkler: TUM, aciklama: 'Beş kanca ve üstte isim plakası.', gorsel: g('7015'), ...bos },
  { kod: '7032', ad: 'şemsiyelik', slug: 'semsiyelik', kategori: 'giris', renkler: TUM, aciklama: 'Silindir gövde, tabanda çıkarılabilir su tepsisi.', gorsel: g('7032'), ...bos },
  { kod: '7051', ad: 'giriş panosu', slug: 'giris-panosu', kategori: 'giris', renkler: TUM, aciklama: 'Ayna, anahtar kancaları, mektup rafı ve gözlük cebi.', gorsel: g('7051'), ...bos },
  { kod: '7052', ad: 'giriş dolabı', slug: 'giris-dolabi', kategori: 'giris', renkler: TUM, aciklama: 'Üstte çanta rafı, altta ayakkabı bölmesi.', gorsel: g('7052'), ...bos },

  // çalışma
  { kod: '7002', ad: 'şarj standı', slug: 'sarj-standi', kategori: 'calisma', renkler: TUM, aciklama: 'Telefon yuvası, saat yatağı ve önde cep boşaltma tepsisi.', gorsel: g('7002'), ...bos },
  { kod: '7010', ad: 'koltuk yan sehpası', slug: 'koltuk-yan-sehpasi', kategori: 'calisma', renkler: TUM, aciklama: 'Koltuk koluna geçer; bardak yuvası, telefon standı ve dergi cebi.', gorsel: g('7010'), ...bos },
  { kod: '7030', ad: 'masa organizeri', slug: 'masa-organizeri', kategori: 'calisma', renkler: TUM, aciklama: 'Kalemlik, not bloğu yuvası ve altta çekmece.', gorsel: g('7030'), ...bos },
  { kod: '7033', ad: 'tablet ve saat standı', slug: 'tablet-ve-saat-standi', kategori: 'calisma', renkler: TUM, aciklama: 'Tablet ve telefon yuvaları, saat yastıkları ve çekmece.', gorsel: g('7033'), ...bos },

  // yatak odası
  { kod: '7011', ad: 'başucu valesi', slug: 'basucu-valesi', kategori: 'yatak-odasi', renkler: TUM, aciklama: 'Anahtar kancaları, saat rulosu ve gözlük tepsisi.', gorsel: g('7011'), ...bos },
  { kod: '7018', ad: 'saat kutusu', slug: 'saat-kutusu', kategori: 'yatak-odasi', renkler: TUM, aciklama: 'Camlı kapak, altı saat yastığı ve iç cep.', gorsel: g('7018'), ...bos },
  { kod: '7034', ad: 'saat ve kemer tepsisi', slug: 'saat-ve-kemer-tepsisi', kategori: 'yatak-odasi', renkler: TUM, aciklama: 'Çekmeceye oturur; kemer gözleri, saat yastıkları ve takı kanalı.', gorsel: g('7034'), ...bos },

  // ev
  { kod: '7003', ad: 'koltuk arkası organizeri', slug: 'koltuk-arkasi-organizeri', kategori: 'ev', renkler: TUM, aciklama: 'Araç koltuğuna geçer; katlanır tabla ve evrak cepleri.', gorsel: g('7003'), ...bos },
  { kod: '7004', ad: 'mama standı', slug: 'mama-standi', kategori: 'ev', renkler: TUM, aciklama: 'Yükseltilmiş iki çelik kâse, yanında tarak ve mama bölmesi.', gorsel: g('7004'), ...bos },
  { kod: '7024', ad: 'ütü masası dolabı', slug: 'utu-masasi-dolabi', kategori: 'ev', renkler: TUM, aciklama: 'Katlanır ütü masası, üstte havlu rafı, altta çamaşır bölmesi.', gorsel: g('7024'), ...bos },
  { kod: '7025', ad: 'model araba rafı', slug: 'model-araba-rafi', kategori: 'ev', renkler: TUM, aciklama: 'Üç kat, dokuz bölme; eğimli taban modeli öne bakar.', gorsel: g('7025'), ...bos },
  { kod: '7026', ad: 'robot süpürge altlığı', slug: 'robot-supurge-altligi', kategori: 'ev', renkler: TUM, aciklama: 'Süpürge üstte durur, altta yedek fırça çekmecesi.', gorsel: g('7026'), ...bos },
]

export function urunBul(slug: string) {
  return URUNLER.find((u) => u.slug === slug) ?? null
}

/**
 * Renge göre görsel.
 *
 * Ürünün o renk için ayrı çekimi varsa onu, yoksa ana çekimi döndürür.
 * Duvar, kategori kartı, ürün sayfası ve duvar kurucu aynı işlevi
 * kullanıyor; renk davranışı tek yerden değişiyor.
 */
export function gorselFor(urun: Urun, renk: RenkAnahtari | null | undefined): string {
  if (!renk) return urun.gorsel
  return urun.renkGorselleri?.[renk] ?? urun.gorsel
}
