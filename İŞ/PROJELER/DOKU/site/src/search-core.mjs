// Etiket araması. Kısa kelimeler tam eşleşir; DK/G kodları bulanık eşleşmez.
const DokuSearch = (() => {
  const normalize = value => String(value).toLocaleLowerCase('tr-TR').normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i')
    .replace(/\b([a-z]{2}|g)[\s-]*0*(\d{1,3})([a-z]?)\b/g, (_, prefix, number, suffix) => prefix + String(Number(number)).padStart(3, '0') + suffix)
    .replace(/[^a-z0-9]+/g, ' ').trim();
  const groups = [
    ['daire', 'dairesel', 'daireler', 'yuvarlak', 'circle', 'round'],
    ['kemer', 'kemerli', 'kemerler', 'arch'], ['kavis', 'kavisli', 'kavisler'],
    ['dalga', 'dalgali', 'dalgalar', 'wave'], ['cizgi', 'cizgili', 'cizgiler'],
    ['geometrik', 'geometri', 'geometrical', 'geometry'], ['organik', 'organic'],
    ['ucgen', 'ucgenler', 'triangle'], ['dikdortgen', 'dikdortgenler', 'rectangle'],
    ['kare', 'kareler', 'square'], ['oval', 'ovaller'], ['halka', 'halkalar'],
    ['cocuk', 'cocuklar', 'kids', 'child'], ['bebek', 'bebekler', 'baby'],
    ['studyo', 'studio'], ['hastane', 'hastahane', 'hastahen'],
    ['tasarim', 'tassarim'], ['ofis', 'ofisler', 'office'],
    ['kres', 'anaokulu'], ['karsilama', 'resepsiyon', 'reception'],
    ['kafe', 'cafe', 'caffe'], ['restoran', 'restaurant'],
    ['mavi', 'mavisi', 'blue'], ['yesil', 'yesili', 'green'], ['pembe', 'pembesi', 'pink'],
    ['kirmizi', 'kirmizisi', 'red'], ['sari', 'sarisi', 'yellow'], ['mor', 'moru', 'purple'],
    ['siyah', 'siyahi', 'black'], ['beyaz', 'beyazi', 'white'], ['gri', 'grisi', 'gray', 'grey'],
    ['bej', 'beji', 'beige'], ['krem', 'kremi', 'cream'], ['kahverengi', 'kahverengisi', 'brown'],
    ['kiremit', 'terracotta'], ['bordo', 'burgundy'], ['lacivert', 'navy'],
    ['turuncu', 'orange'], ['altin', 'gold', 'golden'],
    ['yaprak', 'yapraklar', 'yaprakli', 'leaf', 'leaves'], ['cicek', 'cicekler', 'cicekli', 'flower'],
    ['agac', 'agaclar', 'agacli', 'tree'], ['kus', 'kuslar', 'kuslu', 'bird'], ['hayvan', 'hayvanlar'],
    ['dag', 'daglar'], ['yildiz', 'yildizlar', 'star'], ['bulut', 'bulutlar', 'cloud'],
    ['harf', 'harfler', 'harfli'], ['isim', 'isimler', 'ad', 'name'], ['logo', 'logolu'],
    ['figur', 'figurler'], ['panel', 'paneller', 'panelli'],
    ['uclu', 'uc', 'triptych'], ['botanik', 'botanical'], ['soyut', 'abstract'],
    ['minimal', 'minimalist', 'minimalizm'], ['modern', 'cagdas', 'contemporary'],
    ['sade', 'yalin'], ['bohem', 'bohemian'], ['kubist', 'kubizm', 'cubist'],
    ['acik', 'light'], ['koyu', 'dark'], ['notr', 'neutral'],
    ['ton', 'tonlar', 'tonlari', 'tones'],
    ['ayi', 'ayicik', 'ayicikli'], ['tilki', 'tilkili'], ['fil', 'filli'],
    ['aslan', 'aslanli'], ['kartal', 'kartalli'], ['meyve', 'meyveli']
  ];
  const aliases = new Map(groups.flatMap(group => group.map(word => [word, group[0]])));
  const canonical = word => aliases.get(word) || word;
  const ignored = new Set(['ve', 'ile', 'icin', 'bir', 'duvar', 'duvara', 'tasarim', 'tasarimi', 'tasarimlari', 'dekorasyon', 'renk', 'rengi', 'renkler', 'odasi', 'oda', 'kod', 'kodu', 'urun', 'gorsel', 'ton']);
  const tokens = value => normalize(value).split(/\s+/).filter(Boolean).map(canonical);
  const parseQuery = value => [...new Set(tokens(value).filter(word => !ignored.has(word)))];
  const makeEntry = record => ({...record, terms: new Set(tokens(record.keywords)), normalizedName: normalize(record.name), codes: new Set(tokens(record.designCode + ' ' + (record.legacyCode || '') + ' ' + record.imageCode))});
  const isCode = term => /^[a-z]{2}\d{3}[a-z]?$|^g\d{3}$/.test(term);
  function score(entry, terms) {
    let total = 0;
    let matched = 0;
    for (const term of terms) {
      if (isCode(term)) { if (!entry.codes.has(term)) return 0; total += 1000; matched++; }
      else if (entry.terms.has(term)) { total += 10; matched++; }
      else if (term.length >= 4 && [...entry.terms].some(word => !isCode(word) && word.startsWith(term))) { total += 3; matched++; }
    }
    return matched ? matched * 10000 + total : 0;
  }
  function search(entries, value) {
    const terms = parseQuery(value);
    if (!terms.length) return normalize(value) ? [] : entries;
    const results = entries.map(entry => {
      const wordScore = score(entry, terms);
      return {entry, score:wordScore + (wordScore && entry.normalizedName === normalize(value) ? 30 : 0)};
    }).filter(result => result.score > 0);
    return results.sort((a, b) => b.score - a.score || a.entry.imageCode.localeCompare(b.entry.imageCode)).map(result => result.entry);
  }
  const oneEditAway = (a, b) => {
    if (Math.abs(a.length - b.length) > 1) return false;
    let i = 0, j = 0, edits = 0;
    while (i < a.length && j < b.length) {
      if (a[i] === b[j]) { i++; j++; continue; }
      if (++edits > 1) return false;
      if (a.length <= b.length) j++;
      if (a.length >= b.length) i++;
    }
    return edits + Number(i < a.length || j < b.length) === 1;
  };
  function suggest(entries, value) {
    const terms = parseQuery(value);
    const vocabulary = [...new Set(entries.flatMap(entry => [...entry.terms]))];
    let changed = false;
    const display = {yesil:'yeşil', sari:'sarı', kirmizi:'kırmızı', cizgi:'çizgi', ucgen:'üçgen', dikdortgen:'dikdörtgen', cocuk:'çocuk', studyo:'stüdyo', kres:'kreş', karsilama:'karşılama', cicek:'çiçek', agac:'ağaç', kus:'kuş', dag:'dağ', yildiz:'yıldız', figur:'figür', uclu:'üçlü'};
    const corrected = terms.map(term => {
      if (term.length < 4 || isCode(term) || vocabulary.some(word => word === term || word.startsWith(term))) return term;
      const candidates = vocabulary.filter(word => !isCode(word) && oneEditAway(term, word));
      if (candidates.length !== 1) return term;
      changed = true;
      return candidates[0];
    }).map(term => display[term] || term).join(' ');
    return changed && search(entries, corrected).length ? corrected : '';
  }
  return {normalize, parseQuery, makeEntry, search, suggest};
})();
export default DokuSearch;

