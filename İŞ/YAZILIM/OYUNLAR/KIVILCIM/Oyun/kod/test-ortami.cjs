// Vite ile aynı kaynak sırası; simülasyonda görüntüler yerel dosyadan çözülür.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const files = require('./oyun-dosyalari.json');
const ART = {};
for (const directory of ['hub', 'mekan', 'arayuz', 'savas', 'ikon']) {
  const folder = path.join(root, 'gorsel', directory);
  for (const file of fs.readdirSync(folder).sort()) {
    const ext = path.extname(file).slice(1);
    if (!['png', 'webp', 'jpg'].includes(ext)) continue;
    const key = (directory === 'mekan' ? 'room_' : '') + path.basename(file, '.' + ext);
    ART[key] = 'data:image/' + (ext === 'jpg' ? 'jpeg' : ext) + ';base64,' + fs.readFileSync(path.join(folder, file)).toString('base64');
  }
}
ART.hub_reference = 'data:image/png;base64,' + fs.readFileSync(path.join(root, 'gorsel/ref/Fantastik Türkçe RPG Hub Dünyası.png')).toString('base64');
const balance = fs.readFileSync(path.join(__dirname, 'Baslangic_Dengesi.json'), 'utf8');
exports.manifest = fs.readFileSync(path.join(__dirname, 'atlas_defs.json'), 'utf8');
exports.js = '"use strict";\nconst ART=' + JSON.stringify(ART) + ';\nconst BALANCE=' + balance + ';\n' + files.scripts.filter(file => file !== 'oyun-verisi.js').map(file => fs.readFileSync(path.join(__dirname, file), 'utf8')).join('\n');
