// Müşteri hesabı: giriş/kayıt, müşteri paneli, yönetim paneli. API: pages/functions/api/[[path]].js
(() => {
  const $ = id => document.getElementById(id);
  const api = async (path, {method = 'GET', data, form} = {}) => {
    const init = {method, headers: {'x-doku': '1'}, credentials: 'same-origin'};
    if (data) { init.headers['content-type'] = 'application/json'; init.body = JSON.stringify(data); }
    if (form) init.body = form;
    const res = await fetch('/api/' + path, init);
    const out = await res.json().catch(() => ({}));
    if (!res.ok) throw Object.assign(new Error(out.error || 'Bir sorun oluştu.'), {status: res.status});
    return out;
  };
  const say = (el, text, ok = false) => { el.textContent = text; el.hidden = !text; el.classList.toggle('ok', ok); };
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
  const date = t => new Date(t * 1000).toLocaleDateString('tr-TR', {day: 'numeric', month: 'long', year: 'numeric'});
  const STATUS = {bekliyor: 'Onay bekliyor', onaylandi: 'Onaylandı', revize: 'Revize istendi'};
  const home = role => role === 'yonetici' ? '/hesap/yonetim/' : '/hesap/panel/';
  const busy = (button, on) => { button.disabled = on; button.setAttribute('aria-busy', String(on)); };
  const files = d => d.files.map(f => f.type.startsWith('image/')
    ? `<a href="/api/dosya/${f.id}" target="_blank" rel="noopener"><img src="/api/dosya/${f.id}" alt="${esc(f.name)}" loading="lazy"></a>`
    : `<a class="hesap-file" href="/api/dosya/${f.id}" target="_blank" rel="noopener">${esc(f.name)}</a>`).join('');

  async function logout() { await api('hesap/cikis', {method: 'POST'}).catch(() => {}); location.href = '/hesap/'; }
  function bindAccountTools() {
    $('logout')?.addEventListener('click', logout);
    const pf = $('password-form');
    pf?.addEventListener('submit', async e => {
      e.preventDefault();
      const msg = $('password-msg'), btn = pf.querySelector('button');
      busy(btn, true);
      try { await api('hesap/sifre', {method: 'POST', data: {old: pf.old.value, new: pf.new.value}}); pf.reset(); say(msg, 'Şifre değişti.', true); }
      catch (err) { say(msg, err.message); }
      busy(btn, false);
    });
  }

  // ---------- giriş / kayıt ----------
  const login = $('login-form'), register = $('register-form');
  if (login && register) {
    api('hesap/ben').then(r => location.replace(home(r.user.role))).catch(() => {});
    const show = which => {
      login.hidden = which !== 'login'; register.hidden = which !== 'register';
      document.querySelectorAll('[data-auth-tab]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.authTab === which)));
    };
    document.querySelectorAll('[data-auth-tab]').forEach(b => b.addEventListener('click', () => show(b.dataset.authTab)));
    if (location.hash === '#kayit') show('register');
    login.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = login.querySelector('button[type=submit]'); busy(btn, true);
      try { const r = await api('hesap/giris', {method: 'POST', data: {email: login.email.value, password: login.password.value}}); location.href = home(r.role); }
      catch (err) { say($('login-msg'), err.message); busy(btn, false); }
    });
    register.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = register.querySelector('button[type=submit]'); busy(btn, true);
      try {
        await api('hesap/kayit', {method: 'POST', data: {name: register.elements.name.value, email: register.email.value, phone: register.phone.value, password: register.password.value, kvkk: register.kvkk.checked}});
        location.href = '/hesap/panel/';
      } catch (err) { say($('register-msg'), err.message); busy(btn, false); }
    });
  }

  // ---------- müşteri paneli ----------
  const panel = $('customer-designs');
  if (panel) {
    const load = async () => {
      let me;
      try { me = await api('hesap/ben'); } catch { location.replace('/hesap/'); return; }
      if (me.user.role === 'yonetici') { location.replace('/hesap/yonetim/'); return; }
      $('account-name').textContent = me.user.name;
      const {designs} = await api('hesap/tasarimlar');
      $('customer-empty').hidden = designs.length > 0;
      panel.innerHTML = designs.map(d => `<li class="hesap-design" data-id="${d.id}">
        <div class="hesap-design-head"><h2>${esc(d.title)}</h2><span class="hesap-status s-${d.status}">${STATUS[d.status]}</span></div>
        <p class="hesap-date">${date(d.created_at)}</p>
        <div class="hesap-files">${files(d)}</div>
        ${d.note ? `<p class="hesap-note">${esc(d.note)}</p>` : ''}
        ${d.status === 'bekliyor' ? `<div class="hesap-decide">
          <button type="button" class="contact-link" data-decision="onay">Onayla</button>
          <details><summary>Revize iste</summary><label class="sr-only" for="rev-${d.id}">Revize notu</label><textarea id="rev-${d.id}" rows="3" maxlength="1000" placeholder="Neyi değiştirelim?"></textarea><button type="button" data-decision="revize">Gönder</button></details>
          <p class="hesap-msg" role="alert" hidden></p></div>`
        : d.customer_note ? `<p class="hesap-note"><strong>Notunuz:</strong> ${esc(d.customer_note)}</p>` : ''}
      </li>`).join('');
    };
    panel.addEventListener('click', async e => {
      const btn = e.target.closest('[data-decision]'); if (!btn) return;
      const li = btn.closest('.hesap-design'), msg = li.querySelector('.hesap-msg');
      const note = li.querySelector('textarea')?.value || '';
      if (btn.dataset.decision === 'onay' && !confirm('Tasarımı onaylıyor musunuz? Onaydan sonra üretime geçilir.')) return;
      busy(btn, true);
      try { await api(`hesap/tasarimlar/${li.dataset.id}/karar`, {method: 'POST', data: {decision: btn.dataset.decision, note}}); await load(); }
      catch (err) { say(msg, err.message); busy(btn, false); }
    });
    bindAccountTools();
    load();
  }

  // ---------- yönetim ----------
  const adminList = $('admin-designs');
  if (adminList) {
    const upload = $('upload-form');
    const load = async () => {
      let me;
      try { me = await api('hesap/ben'); } catch { location.replace('/hesap/'); return; }
      if (me.user.role !== 'yonetici') { location.replace('/hesap/panel/'); return; }
      const [{customers}, {designs}] = await Promise.all([api('yonetim/musteriler'), api('yonetim/tasarimlar')]);
      $('customer-list').innerHTML = customers.map(c => `<option value="${esc(c.email)}">${esc(c.name)}${c.phone ? ' · ' + esc(c.phone) : ''}</option>`).join('');
      $('customers').innerHTML = customers.map(c => `<li><strong>${esc(c.name)}</strong> <span>${esc(c.email)}${c.phone ? ' · ' + esc(c.phone) : ''} · ${c.designs} tasarım</span></li>`).join('') || '<li>Henüz müşteri yok.</li>';
      adminList.innerHTML = designs.map(d => `<li class="hesap-design" data-id="${d.id}">
        <div class="hesap-design-head"><h2>${esc(d.title)}</h2><span class="hesap-status s-${d.status}">${STATUS[d.status]}</span></div>
        <p class="hesap-date">${esc(d.customer)} · ${esc(d.customer_email)} · ${date(d.created_at)}</p>
        <div class="hesap-files">${files(d)}</div>
        ${d.customer_note ? `<p class="hesap-note"><strong>Müşteri notu:</strong> ${esc(d.customer_note)}</p>` : ''}
        ${d.status !== 'bekliyor' ? `<button type="button" class="hesap-link" data-reopen>Yeniden onaya aç</button>` : ''}
      </li>`).join('') || '<li>Henüz tasarım yok.</li>';
    };
    upload.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = upload.querySelector('button[type=submit]'), msg = $('upload-msg');
      busy(btn, true);
      try { await api('yonetim/tasarim', {method: 'POST', form: new FormData(upload)}); upload.reset(); say(msg, 'Yüklendi; müşteri panelinde görünüyor.', true); await load(); }
      catch (err) { say(msg, err.message); }
      busy(btn, false);
    });
    adminList.addEventListener('click', async e => {
      const btn = e.target.closest('[data-reopen]'); if (!btn) return;
      busy(btn, true);
      await api(`yonetim/tasarim/${btn.closest('.hesap-design').dataset.id}/durum`, {method: 'POST', data: {status: 'bekliyor'}}).catch(() => {});
      load();
    });
    bindAccountTools();
    load();
  }
})();
