# Derz ve radius

En sık bozulan kural. Görseldeki her sınır bu dosyaya göre okunur.

## Terimler
| Terim | Anlamı |
|---|---|
| T | XPE kalınlığı (şu an 8 mm) |
| Kenar radiusu (R) | Kaplamanın XPE ön köşesinden arkaya dönerken oluşan yuvarlak omuz. Germeyle oluşur. R ≤ T |
| Plan yuvarlatması | CNC yolunun önden görünen köşe kavisi. Tasarım kararıdır; kenar radiusu değildir |
| Kesim genişliği | 3–4 mm bıçak izi. Kaplamada kapanır, bitmiş üründe görünmez |
| Derz | İki kaplı kenarın temasıyla oluşan sığ V oluk |

## Kesit
```
düz yüz ──╮   ╭── düz yüz
          R ∨ R
```
- Geniş ön yüz tamamen düz ve gergin. Yuvarlanma yalnız kenardaki dar bantta.
- **Her sınırın iki yanında da radius.** Tek taraflı radius hatadır.
- Oluk genişliği ≈ 2R, derinliği ≈ R. Sayısal değer numune ölçülmeden yazılmaz.
- Üçlü/dörtlü birleşimde oluk kesintisiz ve aynı incelikte sürer.

## Gerçek görünüm (04.11 fotoğrafları)
Faris'in gerçek kaplama fotoğraflarında (`Görseller\06 Kalibrasyon`) derz şöyle:
- Kılcal, ince, koyu bir temas çizgisi.
- Çizginin iki yanında dar, yumuşak bir **açık omuz**: radiusa vuran ışık.
- Koyu kaplamada omuzda hafif saten parlama; açık kaplamada hafif açık bant.
- Yüzeyler aynı seviyede. Bir parça diğerinin üstüne binmiş gibi değil.
- Oluk sığ. İçi karanlık bir yarık değil.

Bu fotoğraflar görsel üretiminde **kalibrasyon referansıdır**: yalnız derz, radius ve ışık için. Kompozisyon için kullanılmaz.

## Her sınırda aynı
Arka plan, figür, aynı renkli komşular, göz/iris/göz bebeği, burun, dudak, tüy, yele, harf, yaprak, zemin/tavan/yan duvar kenarı. İstisna yok.

## Yanlış görünümler
| Görülen | Neden yanlış |
|---|---|
| Siyah kontur, sabit kalın koyu çizgi | Derz geometriyle okunur, çizgiyle değil |
| Açık yarık, duvar görünen boşluk, siyah dolgu | Parçalar dayanır, boşluk kapanır |
| Beyaz/parlak şerit, fitil, biye, dikiş | Önde ek eleman yok |
| Tek tarafta yuvarlanma, diğer taraf keskin | Her parça kendi kenarını yuvarlar |
| Parça şişkin, yastık, kabartma, üst üste | Tek düzlem |
| Derz tamamen silinmiş, yüzey baskı gibi | Radius gölgesi kalmalı |
| Kalın, derin, gölgeli kanal | Oluk sığ ve ince |

Siyah kartela parçası serbesttir; siyah derz dolgusu değildir.

## Görsel ölçeği
- Oluk inceliği görselin her yerinde aynıdır.
- Yaklaşık oluk (px) ≈ 2R ÷ (duvar mm ÷ görsel px). Ölçü yoksa kalibrasyon fotoğrafının inceliği esas.

## İstem cümlesi (İngilizce)
```
Every seam is a hairline crease where two taut, wrapped edges meet: each edge rolls over a tiny radius, so both sides of the seam show a thin soft highlight and a faint shadow in a shallow V. Faces stay perfectly flat and flush; no gaps, no black lines, no raised pieces.
```
