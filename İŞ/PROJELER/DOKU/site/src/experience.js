// Shared navigation, keyboard image selection and the accessible image viewer.
// Inline image feedback preserves the selected design and layout during recovery.
for (const image of document.querySelectorAll('#viewer-image, #main-image')) {
  const frame = image.parentElement;
  const feedback = document.createElement('div');
  feedback.className = 'inline-image-state';
  feedback.hidden = true;
  feedback.innerHTML = '<div><p role="status" aria-atomic="true"></p><button type="button" hidden>Yeniden dene</button></div>';
  frame.append(feedback);
  const text = feedback.querySelector('p');
  const retry = feedback.querySelector('button');
  let timer;
  const ready = () => {
    clearTimeout(timer);
    const restoreFocus = feedback.contains(document.activeElement);
    feedback.hidden = true;
    frame.setAttribute('aria-busy', 'false');
    delete frame.dataset.imageState;
    if (restoreFocus) frame.querySelector('[data-enlarge]')?.focus({preventScroll: true});
  };
  const failed = () => {
    clearTimeout(timer);
    frame.setAttribute('aria-busy', 'false');
    frame.dataset.imageState = 'error';
    text.textContent = 'Görsel yüklenemedi. Yeniden deneyin.';
    retry.hidden = false;
    feedback.hidden = false;
  };
  const loading = () => {
    clearTimeout(timer);
    if (image.complete && image.naturalWidth) { ready(); return; }
    frame.setAttribute('aria-busy', 'true');
    frame.dataset.imageState = 'loading';
    if (feedback.contains(document.activeElement)) frame.querySelector('[data-enlarge]')?.focus({preventScroll: true});
    feedback.hidden = true;
    retry.hidden = true;
    timer = setTimeout(() => {
      text.textContent = 'Görsel yükleniyor…';
      feedback.hidden = false;
    }, 450);
  };
  retry.addEventListener('click', () => {
    const fresh = value => {
      const url = new URL(value, location.href);
      url.searchParams.set('retry', Date.now());
      return url.pathname + url.search;
    };
    if (image.srcset) image.srcset = image.srcset.split(',').map(part => {
      const [url, descriptor] = part.trim().split(/\s+/);
      return [fresh(url), descriptor].filter(Boolean).join(' ');
    }).join(', ');
    image.src = fresh(image.src);
    loading();
  });
  image.addEventListener('load', ready);
  image.addEventListener('error', failed);
  new MutationObserver(loading).observe(image, {attributes: true, attributeFilter: ['src', 'srcset']});
  if (image.complete) image.naturalWidth ? ready() : failed();
  else if (image.loading !== 'lazy') loading();
  else if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { loading(); observer.disconnect(); }
    });
    observer.observe(image);
  }
}

for (const field of document.querySelectorAll('[data-character-count]')) {
  const count = document.getElementById(field.dataset.characterCount);
  const update = () => { count.textContent = `${field.value.length} / ${field.maxLength} karakter`; };
  field.addEventListener('input', update);
  field.form?.addEventListener('doku:messagechange', update);
  window.addEventListener('pageshow', update);
  update();
}
const header = document.querySelector('.site-header');
const menuButton = header?.querySelector('.menu-toggle');
const menu = header?.querySelector('.site-nav');
if (menuButton && menu) {
  header.dataset.navReady = '';
  const setHeaderHeight = () => document.documentElement.style.setProperty('--header-height', header.getBoundingClientRect().height + 'px');
  setHeaderHeight();
  if ('ResizeObserver' in window) new ResizeObserver(setHeaderHeight).observe(header);
  const closeMenu = (restoreFocus = false) => {
    delete header.dataset.menuOpen;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.querySelector('.menu-label').textContent = 'Menü';
    if (restoreFocus) menuButton.focus();
  };
  menuButton.addEventListener('click', () => {
    if (header.hasAttribute('data-menu-open')) closeMenu();
    else {
      header.dataset.menuOpen = '';
      menuButton.setAttribute('aria-expanded', 'true');
      menuButton.querySelector('.menu-label').textContent = 'Kapat';
    }
  });
  menu.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('click', event => { if (!header.contains(event.target)) closeMenu(); });
  header.addEventListener('keydown', event => {
    if (event.key === 'Escape' && header.hasAttribute('data-menu-open')) { event.preventDefault(); closeMenu(true); }
  });
  header.addEventListener('focusout', () => setTimeout(() => { if (!header.contains(document.activeElement)) closeMenu(); }, 0));
  window.matchMedia('(min-width:851px)').addEventListener('change', () => closeMenu());
}

for (const selector of ['.viewer-options', '#thumbnails']) {
  const group = document.querySelector(selector);
  if (!group) continue;
  const buttons = [...group.querySelectorAll('button')];
  group.addEventListener('keydown', event => {
    const index = buttons.indexOf(document.activeElement);
    if (index < 0 || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (index + (['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1) + buttons.length) % buttons.length;
    buttons[next].focus({preventScroll: true});
    buttons[next].click();
    if (selector === '.viewer-options' && window.innerWidth <= 850) buttons[next].scrollIntoView({block: 'nearest', inline: 'nearest'});
  });
}

const triggers = [...document.querySelectorAll('[data-enlarge]')];
if (triggers.length && typeof HTMLDialogElement !== 'undefined') {
  const dialog = document.createElement('dialog');
  dialog.className = 'image-dialog';
  dialog.setAttribute('aria-label', 'Tasarımı yakından incele');
  dialog.innerHTML = '<div class="image-dialog-toolbar"><p>Konsept görünüm</p><button type="button" class="previous-image" hidden>Önceki</button><button type="button" class="next-image" hidden>Sonraki</button><button type="button" class="zoom-toggle" aria-pressed="false">Büyüt</button><button type="button" class="close-image" autofocus>Kapat</button></div><div class="image-dialog-canvas" tabindex="0" aria-label="Tasarım görseli; büyütülmüş görünümde ok tuşlarıyla kaydırın"><img alt=""><div class="image-dialog-status" role="status"><div><span></span><button type="button" hidden>Yeniden dene</button></div></div></div><p class="image-dialog-caption"></p>';
  document.body.append(dialog);
  const image = dialog.querySelector('img');
  const canvas = dialog.querySelector('.image-dialog-canvas');
  const status = dialog.querySelector('.image-dialog-status');
  const retry = status.querySelector('button');
  const zoom = dialog.querySelector('.zoom-toggle');
  const previous = dialog.querySelector('.previous-image');
  const next = dialog.querySelector('.next-image');
  const thumbs = [...document.querySelectorAll('#thumbnails button')];
  let opener, source, previousOverflow, request = 0;
  const resetZoom = () => {
    canvas.classList.remove('is-zoomed');
    canvas.scrollTo(0, 0);
    zoom.textContent = 'Büyüt';
    zoom.setAttribute('aria-pressed', 'false');
  };
  const load = async () => {
    const current = ++request;
    resetZoom();
    zoom.disabled = true;
    image.hidden = true;
    status.hidden = false;
    retry.hidden = true;
    status.querySelector('span').textContent = 'Görsel yükleniyor…';
    canvas.setAttribute('aria-busy', 'true');
    const full = source.srcset.split(',').map(s => s.trim().split(/\s+/)[0]).filter(Boolean).pop();
    image.src = full || source.src;
    image.alt = source.alt;
    const selected = thumbs.findIndex(t => t.getAttribute('aria-pressed') === 'true');
    dialog.querySelector('.image-dialog-toolbar p').textContent = source.dataset.previewLabel || (thumbs.length > 1 ? `Konsept görünüm · ${selected + 1} / ${thumbs.length}` : 'Konsept görünüm');
    dialog.querySelector('.image-dialog-caption').textContent = source.alt;
    try {
      await image.decode();
      if (current !== request || !dialog.open) return;
      image.hidden = false;
      status.hidden = true;
      zoom.disabled = false;
    } catch {
      if (current !== request || !dialog.open) return;
      status.querySelector('span').textContent = 'Görsel yüklenemedi. Bağlantınızı kontrol edip yeniden deneyin.';
      retry.hidden = false;
    } finally { if (current === request) canvas.setAttribute('aria-busy', 'false'); }
  };
  const move = direction => {
    if (thumbs.length < 2 || source.id !== 'main-image') return;
    const index = thumbs.findIndex(t => t.getAttribute('aria-pressed') === 'true');
    thumbs[(index + direction + thumbs.length) % thumbs.length].click();
    load();
  };
  triggers.forEach(button => button.addEventListener('click', () => {
    source = document.getElementById(button.dataset.enlarge);
    if (!source) return;
    opener = button;
    const multiple = source.id === 'main-image' && thumbs.length > 1;
    previous.hidden = next.hidden = !multiple;
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    load();
  }));
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  retry.addEventListener('click', load);
  zoom.addEventListener('click', () => {
    const expanded = canvas.classList.toggle('is-zoomed');
    zoom.setAttribute('aria-pressed', String(expanded));
    zoom.textContent = expanded ? 'Görsele sığdır' : 'Büyüt';
    canvas.scrollTo(0, 0);
  });
  dialog.querySelector('.close-image').addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', event => {
    if (!canvas.classList.contains('is-zoomed') && ['ArrowLeft', 'ArrowRight'].includes(event.key) && !next.hidden) {
      event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1);
    }
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    request++;
    document.body.style.overflow = previousOverflow;
    opener?.focus({preventScroll: true});
  });
} else triggers.forEach(button => { button.hidden = true; });
