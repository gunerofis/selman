// Ana sayfa ve iletişim sayfası: öne çıkan tasarım seçici (varsa) ve WhatsApp proje mesajı.
const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const viewerButtons = Array.from(document.querySelectorAll('[data-design]'));
const viewerImage = document.getElementById('viewer-image');
const viewerDetail = document.getElementById('viewer-detail');
let activeButton = viewerButtons.find(button => button.classList.contains('active')) || viewerButtons[0];
let imageRequest = 0;

if (viewerImage) viewerButtons.forEach((button, index) => button.addEventListener('click', () => {
  activeButton = button;
  const d = button.dataset;
  viewerButtons.forEach(item => {
    const active = item === button;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  viewerImage.srcset = d.srcset;
  viewerImage.src = d.src;
  viewerImage.width = Number(d.width);
  viewerImage.height = Number(d.height);
  viewerImage.alt = d.name + ' tasarımının konsept mekân görünümü';
  document.getElementById('viewer-name').textContent = d.name;
  document.getElementById('viewer-description').textContent = d.description;
  document.getElementById('viewer-counter').textContent = String(index + 1).padStart(2, '0') + ' / ' + String(viewerButtons.length).padStart(2, '0');
  viewerDetail.href = d.url;
  const figure = viewerImage.closest('figure');
  const request = ++imageRequest;
  figure.setAttribute('aria-busy', 'true');
  viewerImage.decode().catch(() => {}).finally(() => {
    if (request === imageRequest) figure.setAttribute('aria-busy', 'false');
  });
}));

const projectForm = document.getElementById('project-form');
const projectMessage = document.getElementById('project-message');
const designInput = document.getElementById('project-design');
const ideaInput = document.getElementById('project-idea');
const photoIntent = 'Kendi fotoğrafımdan bana özel bir duvar tasarımı istiyorum.';
let suggestedDesign = '';

let incomingSize = '';
function updateSize() {
  const w = document.getElementById('project-size-w'), h = document.getElementById('project-size-h');
  if (!w || !h) return;
  const num = el => { const v = parseFloat(String(el.value).replace(',', '.')); return v > 0 ? v : 0; };
  const m2 = Math.round(num(w) * num(h) * 100) / 100;
  document.getElementById('project-size-m2').textContent = m2 ? `${m2.toLocaleString('tr-TR')} m²` : '— m²';
  if (m2) document.getElementById('project-dimensions').value = `${num(w).toLocaleString('tr-TR')} × ${num(h).toLocaleString('tr-TR')} m (${m2.toLocaleString('tr-TR')} m²)`;
  else if (w.value || h.value || !incomingSize) document.getElementById('project-dimensions').value = '';
}

function updateProjectLink() {
  updateSize();
  const role = document.getElementById('project-role')?.value || '';
  const location = document.getElementById('project-location')?.value.trim() || '';
  const space = document.getElementById('project-space').value.trim();
  const design = designInput.value.trim();
  const application = document.getElementById('project-application').value;
  const material = document.getElementById('project-material').value;
  const materialCode = document.getElementById('project-material-code').value.trim();
  const dimensions = document.getElementById('project-dimensions').value.trim();
  const idea = ideaInput.value.trim();
  projectMessage.value = [
    'Merhaba DOKU, mekânıma özel bir duvar tasarımı hakkında görüşmek istiyorum.',
    role && role !== 'Mekân sahibi' ? 'Ben: ' + role : '',
    space ? 'Mekân: ' + space : '',
    location ? 'Konum: ' + location : '',
    application ? 'Uygulama: ' + application : '',
    material ? 'Kaplama tercihi: ' + material : '',
    materialCode ? 'Kartela renk kodu: ' + materialCode : '',
    design ? 'Beğendiğim tasarım: ' + design : '',
    dimensions ? 'Duvar ölçüsü: ' + dimensions : '',
    idea ? 'Fikrim: ' + idea : ''
  ].filter(Boolean).join('\n');
  const preview = document.getElementById('project-preview');
  if (preview) preview.textContent = projectMessage.value;
  projectForm.dispatchEvent(new Event('doku:messagechange'));
}

document.getElementById('viewer-inquire')?.addEventListener('click', () => {
  suggestedDesign = activeButton.dataset.name + ' (' + activeButton.dataset.id + ')';
  designInput.value = suggestedDesign;
  if (ideaInput.value.trim() === photoIntent) ideaInput.value = '';
  updateProjectLink();
  document.getElementById('proje').scrollIntoView({behavior: reduceMotion() ? 'auto' : 'smooth'});
  designInput.focus({preventScroll: true});
});
document.getElementById('photo-story-inquire')?.addEventListener('click', event => {
  event.preventDefault();
  if (designInput.value === suggestedDesign) designInput.value = '';
  if (!ideaInput.value.includes(photoIntent)) {
    ideaInput.value = [photoIntent, ideaInput.value.trim()].filter(Boolean).join('\n');
  }
  updateProjectLink();
  document.getElementById('proje').scrollIntoView({behavior: reduceMotion() ? 'auto' : 'smooth'});
  ideaInput.focus({preventScroll: true});
});
// Başka sayfadan gelen istek: /iletisim/?konu=fotograf veya ?tasarim=Ad%20(DK-001)
const incoming = new URLSearchParams(location.search);
if (incoming.get('konu') === 'fotograf') ideaInput.value = photoIntent;
const incomingSpace = incoming.get('mekan');
const spaceInput = document.getElementById('project-space');
if (Array.from(spaceInput.options).some(option => option.value === incomingSpace)) spaceInput.value = incomingSpace;
const roleInput = document.getElementById('project-role');
if (roleInput && incoming.get('rol') === 'mimar') roleInput.value = 'Mimar / iç mimar';
if (incoming.get('tasarim')) designInput.value = incoming.get('tasarim').slice(0, 100);
const incomingDimensions = incoming.get('olcu');
if (incomingDimensions && /^[\d., ×xcm²()]+$/.test(incomingDimensions)) { incomingSize = incomingDimensions.slice(0, 100); document.getElementById('project-dimensions').value = incomingSize; }
projectForm.addEventListener('input', updateProjectLink);
projectForm.addEventListener('change', updateProjectLink);
projectForm.addEventListener('submit', updateProjectLink);
updateProjectLink();
window.addEventListener('pageshow', updateProjectLink);
