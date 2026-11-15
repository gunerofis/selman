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


// Live keyword search and stable deep links to individual images.
(() => {
  const form = document.getElementById('gallery-search');
  if (!form) return;
  const query = document.getElementById('gallery-query');
  const clear = document.getElementById('gallery-clear');
  const count = document.getElementById('gallery-count');
  const empty = document.getElementById('gallery-empty');
  const suggestion = document.getElementById('gallery-suggestion');
  const cards = new Map([...document.querySelectorAll('[data-gallery-item]')].map(element=>[element.dataset.designId,element]));
  const items = JSON.parse(document.getElementById('gallery-data').textContent).map(record=>DokuSearch.makeEntry(record));
  let timer;
  let cat = '';
  const catButtons = [...document.querySelectorAll('.gallery-cats [data-cat]')];
  const emptyHint = document.getElementById('gallery-empty-hint');
  const emptyHintDefault = emptyHint.textContent;
  const setCat = value => {
    cat = catButtons.some(b => b.dataset.cat === value) ? value : '';
    catButtons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.cat === cat)));
  };
  catButtons.forEach(b => b.addEventListener('click', () => { setCat(b.dataset.cat); apply(); }));
  const apply = ({focus = false} = {}) => {
    clearTimeout(timer);
    const matches = DokuSearch.search(items, query.value).filter(item => !cat || (item.cats || []).includes(cat));
    emptyHint.textContent = cat && !query.value.trim() ? 'Bu alan için tasarımı size özel çizelim; WhatsApp’tan yazın.' : emptyHintDefault;
    const selected = new Map();
    for (const item of matches) if(!selected.has(item.designCode)) selected.set(item.designCode,item);
    const list = document.getElementById('tasarimlar');
    for (const id of selected.keys()) if (cards.has(id)) list.append(cards.get(id));
    for (const [id,element] of cards) {
      const item=selected.get(id);element.hidden=!item;if(!item)continue;
      const link=element.querySelector('a'),image=link.querySelector('img');
      link.href=item.url;link.setAttribute('aria-label',`${item.name} · ${id} · ${item.imageCode}`);
      element.dataset.imageCode=item.imageCode;
      if(image.getAttribute('src')!==item.thumb){image.src=item.thumb;image.srcset=item.srcset;image.width=item.width;image.height=item.height;}
      element.querySelector('.gallery-code').textContent=`${id} · ${item.imageCode}`;
      element.querySelector('.gallery-meta').textContent=item.materialCatalogs?.length ? item.materialCatalogs.join(' · ') : `${item.colors.slice(0,2).join(' · ')} · ${item.form}`;
    }
    const visible=selected.size;
    count.textContent = `${visible} tasarım · ${matches.length} görsel`;
    empty.hidden = visible > 0;
    clear.hidden = !query.value.trim();
    const proposed = visible ? '' : DokuSearch.suggest(items, query.value);
    suggestion.hidden = !proposed;
    suggestion.textContent = proposed ? `Şunu ara: ${proposed}` : '';
    suggestion.dataset.query = proposed;
    const params = new URLSearchParams();
    if (query.value.trim()) params.set('q', query.value.trim());
    if (cat) params.set('kat', cat);
    history.replaceState(history.state, '', location.pathname + (params.size ? '?' + params : '') + location.hash);
    if (focus) (visible ? document.querySelector('[data-gallery-item]:not([hidden]) .gallery-card') : empty.querySelector('button')).focus();
  };
  const reset = () => { query.value = ''; setCat(''); apply(); query.focus(); };
  document.getElementById('tasarimlar').addEventListener('click', event => {
    const link = event.target.closest('.gallery-card');
    if (!link) return;
    if (timer) apply();
    const item = link.closest('[data-gallery-item]');
    try { sessionStorage.setItem('doku-gallery-return', JSON.stringify({designId: item.dataset.designId, url: location.pathname + location.search + '#' + item.id})); }
    catch { /* Browsing remains available when storage is restricted. */ }
  });
  const readUrl = () => {
    const params = new URLSearchParams(location.search);
    const legacy = [params.get('mekan') || '', (params.get('tema') || '').replaceAll('-', ' ')].filter(Boolean).join(' ');
    query.value = [params.get('q') || '', legacy].filter(Boolean).join(' ').slice(0, 100);
    setCat(params.get('kat') || '');
    apply();
  };
  readUrl();
  // Kaydedilmiş yönetim etiketleri aynı görselin başlangıç etiketlerini değiştirir.
  fetch('/api/keywords', {cache:'no-store'}).then(response => {
    if (!response.ok) throw Error('Etiket hizmeti kullanılamıyor.');
    return response.json();
  }).then(data => {
    const fields = ['colors','forms','subjects','styles','tones','keywords'];
    for (const item of items) {
      const tags = data.images?.[item.imageCode];
      if (!tags || !fields.every(field => Array.isArray(tags[field]) && tags[field].every(value => typeof value === 'string'))) continue;
      const keywords = [item.baseKeywords, ...fields.flatMap(field => tags[field])].join(' ');
      Object.assign(item, DokuSearch.makeEntry({...item, keywords, tones:tags.tones.join('|'), colors:tags.colors,form:tags.forms[0]}));
    }
    apply();
  }).catch(() => { /* Başlangıç kataloğuyla arama çalışmaya devam eder. */ });
  form.addEventListener('submit', event => { event.preventDefault(); apply({focus: true}); });
  form.addEventListener('reset', event => { event.preventDefault(); reset(); });
  query.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(apply, 180); });
  document.querySelector('[data-clear-gallery]').addEventListener('click', reset);
  suggestion.addEventListener('click', () => { query.value = suggestion.dataset.query; apply({focus: true}); });
  window.addEventListener('popstate', readUrl);
  window.addEventListener('pageshow', readUrl);
  window.addEventListener('pagehide', () => { if (timer) apply(); });
  // The return anchor identifies a visible image; leave filtered-out items alone.
  const anchor = document.getElementById(location.hash.slice(1));
  if (anchor?.matches('[data-gallery-item]:not([hidden])')) {
    requestAnimationFrame(() => anchor.querySelector('a').focus());
  }
})();
