import './oyun.css';
import balance from './Baslangic_Dengesi.json';
import atlasManifest from './atlas_defs.json';
import files from './oyun-dosyalari.json';

// Görseller dosya olarak yüklenir; HTML/JS içine base64 gömülmez.
const imageUrls = import.meta.glob('/gorsel/**/*.{png,webp,jpg}', {
  eager: true, query: '?url', import: 'default',
});
const scriptUrls = import.meta.glob('./{oyun-verisi,ekonomi,engine,world,gear,art,minigames,systems,venues,rooms,rooms2,kanat,demirci,profil,canta,hub,kayit,magaza,ekranlar,paneller,alanlar,savasalanlari,arayuz,app}.js', {
  eager: true, query: '?url', import: 'default',
});
const ART = {};
for (const directory of ['hub', 'mekan', 'arayuz', 'savas', 'ikon']) {
 for (const [path, url] of Object.entries(imageUrls)) {
  const match = path.match(/^\/gorsel\/(hub|mekan|arayuz|savas|ikon)\/([^/]+)\.(png|webp|jpg)$/);
  if (match?.[1] === directory) ART[(match[1] === 'mekan' ? 'room_' : '') + match[2]] = url;
 }
}
ART.hub_reference = imageUrls['/gorsel/ref/Fantastik Türkçe RPG Hub Dünyası.png'];
for (const [name, atlas] of Object.entries(atlasManifest.atlases)) {
  const url = imageUrls['/' + atlas.src];
  if (!url) throw new Error('Atlas bulunamadı: ' + name);
  atlas.src = url;
}
document.getElementById('asset-manifest').textContent = JSON.stringify(atlasManifest);
window.KivilcimData = { ART, BALANCE: balance };

// Kayıt ve savaş motorunu değiştirmeden, mevcut dosyaları belirlenen sırada aç.
async function loadScript(url) {
  if (!url) throw new Error('Oyun dosyası bulunamadı.');
  await new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.async = false;
    script.onload = resolve;
    script.onerror = () => reject(new Error('Oyun dosyası açılamadı: ' + url));
    document.body.append(script);
  });
}
try {
  for (const file of files.scripts) await loadScript(scriptUrls['./' + file]);
} catch (error) {
  document.getElementById('main').textContent = 'Oyun yüklenemedi.';
  console.error(error);
}
