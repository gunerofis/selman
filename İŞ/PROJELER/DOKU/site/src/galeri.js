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
