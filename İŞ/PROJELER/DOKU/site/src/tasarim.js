// Selected image, native WhatsApp form and the mobile request shortcut.
const root = document.getElementById('design');
const mainImage = document.getElementById('main-image');
const thumbs = [...document.querySelectorAll('#thumbnails button')];
const form = document.getElementById('request-form');
const messageInput = document.getElementById('design-message');
let selected = Math.max(0, thumbs.findIndex(button => button.getAttribute('aria-pressed') === 'true'));

// Return to the exact gallery filter and image, scoped to this selected design.
try {
  const context = JSON.parse(sessionStorage.getItem('doku-gallery-return') || 'null');
  if (context?.designId === root.dataset.id && typeof context.url === 'string') {
    const url = new URL(context.url, location.origin);
    if (url.origin === location.origin && url.pathname === '/galeri/' && /^(?:#g-G-\d{3}|#p-[A-Z]{2}-\d{3}[A-Z]?)$/.test(url.hash)) {
      const link = document.getElementById('gallery-return');
      link.href = url.pathname + url.search + url.hash;
      link.textContent = '← Galeride kaldığım yere dön';
    }
  }
} catch { /* Storage restrictions retain the ordinary gallery link. */ }

// Ölçü × kaplama fiyatı, montaj ve teslim süresi.
const price = (() => {
  const data = JSON.parse(document.getElementById('price-data')?.textContent || 'null');
  const w = document.getElementById('size-w'), h = document.getElementById('size-h');
  if (!data || !w || !h) return {update() {}, text: () => ''};
  const items = data.items.map(([name, family, m2]) => ({name, family, m2}));
  const min = items[0].m2, max = items.at(-1).m2;
  const tl = n => new Intl.NumberFormat('tr-TR').format(Math.round(n)) + ' TL';
  const num = el => { const v = parseFloat(String(el.value).replace(',', '.')); return v > 0 ? v : 0; };
  const m2Out = document.getElementById('size-m2'), range = document.getElementById('price-range'), extra = document.getElementById('price-extra');
  const hidden = document.getElementById('dimensions'), materialInput = document.getElementById('material-code');
  const norm = s => String(s).toLocaleLowerCase('tr-TR');
  const pick = () => { const v = norm(materialInput.value); return v ? items.find(x => v.startsWith(norm(x.name))) : null; };
  let summary = '';
  function update() {
    const m2 = Math.round(num(w) * num(h) * 100) / 100, chosen = pick();
    m2Out.textContent = m2 ? `${m2.toLocaleString('tr-TR')} m²` : '— m²';
    document.querySelectorAll('[data-price-pick]').forEach(b => b.setAttribute('aria-pressed', String(chosen?.name === b.dataset.pricePick)));
    if (!m2) {
      range.innerHTML = chosen ? `${tl(chosen.m2)} <small>/ m² · ${chosen.name}</small>` : `${tl(min)} – ${tl(max)} <small>/ m²</small>`;
      extra.hidden = true; hidden.value = ''; summary = ''; return;
    }
    range.innerHTML = chosen ? `${tl(chosen.m2 * m2)} <small>· ${chosen.name}</small>` : `${tl(min * m2)} – ${tl(max * m2)}`;
    const big = m2 > data.montaj.esik;
    extra.hidden = false;
    extra.textContent = big
      ? `Montaj: ${tl(data.montaj.m2 * m2)} (${tl(data.montaj.m2)}/m²) · Teslim: işe göre belirlenir`
      : 'Montaj yok, kolay takılır · Teslim: üretim 1–3 gün + kargo 1–3 gün';
    hidden.value = `${num(w).toLocaleString('tr-TR')} × ${num(h).toLocaleString('tr-TR')} m (${m2.toLocaleString('tr-TR')} m²)`;
    summary = chosen ? `Tahmini fiyat: ${tl(chosen.m2 * m2)} (${chosen.name})` : `Tahmini fiyat: ${tl(min * m2)} – ${tl(max * m2)}`;
    if (big) summary += ` + montaj ${tl(data.montaj.m2 * m2)}`;
  }
  document.querySelectorAll('[data-price-pick]').forEach(b => b.addEventListener('click', () => {
    materialInput.value = b.dataset.pricePick + ' ';
    form.dispatchEvent(new Event('input'));
    materialInput.focus();
  }));
  return {update, text: () => summary};
})();

function updateContact() {
  price.update();
  const dimensions = document.getElementById('dimensions').value.trim();
  const idea = document.getElementById('idea').value.trim();
  const materialCode = document.getElementById('material-code').value.trim();
  const imageCode = thumbs.length ? thumbs[selected].dataset.code : root.dataset.code;
  const url = new URL(root.dataset.url);
  url.searchParams.set('gorsel', imageCode);
  const message = [
    `Merhaba DOKU, ${root.dataset.name} (${root.dataset.id}) tasarımı için teklif görüşmesi başlatmak istiyorum.`,
    'Görsel: ' + imageCode,
    root.dataset.materialCodes ? 'Kaplama kodu: ' + root.dataset.materialCodes : '',
    'Sayfa: ' + url,
    materialCode ? 'Kaplama: ' + materialCode : '',
    dimensions ? 'Duvar ölçüsü: ' + dimensions : '',
    price.text(),
    idea ? 'Tasarım notu: ' + idea : ''
  ].filter(Boolean).join('\n');
  messageInput.value = message;
  form.dispatchEvent(new Event('doku:messagechange'));
}

function selectImage(index, updateUrl = true) {
  selected = index;
  const d = thumbs[index].dataset;
  mainImage.srcset = d.srcset;
  mainImage.src = d.src;
  mainImage.width = Number(d.width);
  mainImage.height = Number(d.height);
  mainImage.alt = d.alt;
  thumbs.forEach((item, i) => item.setAttribute('aria-pressed', String(i === index)));
  document.getElementById('image-position').textContent = `${d.label ? d.label + ' · ' : ''}Görsel ${index + 1} / ${thumbs.length}`;
  if (updateUrl) {
    const url = new URL(location.href);
    url.searchParams.set('gorsel', d.code);
    history.replaceState(history.state, '', url.pathname + url.search + url.hash);
  }
  updateContact();
}
thumbs.forEach((button, index) => button.addEventListener('click', () => selectImage(index)));
form.addEventListener('input', updateContact);
form.addEventListener('change', updateContact);
form.addEventListener('submit', updateContact);
const requested = new URLSearchParams(location.search).get('gorsel');
const chosenMaterial = new URLSearchParams(location.search).get('kaplama');
if (chosenMaterial && chosenMaterial.length <= 80) document.getElementById('material-code').value = chosenMaterial;
const index = thumbs.findIndex(button => button.dataset.code === requested);
if (index >= 0) selectImage(index, false);
else updateContact();
window.addEventListener('popstate', () => {
  const code = new URLSearchParams(location.search).get('gorsel');
  const i = thumbs.findIndex(t => t.dataset.code === code);
  if (thumbs.length) selectImage(Math.max(0, i), false);
});

const sticky = document.querySelector('.sticky-cta');
window.addEventListener('pageshow', updateContact);
if (sticky && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(([entry]) => {
    sticky.hidden = entry.isIntersecting || entry.boundingClientRect.top < 0;
  }, {rootMargin: '-92px 0px -72px 0px'});
  observer.observe(form);
  sticky.addEventListener('click', event => {
    event.preventDefault();
    sticky.hidden = true;
    form.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start'});
    document.getElementById('size-w').focus({preventScroll: true});
  });
}
