(() => {
  'use strict';

  document.documentElement.classList.remove('no-js');

  const closeDialog = (dialog) => {
    if (dialog && dialog.open) dialog.close();
  };

  document.querySelectorAll('dialog').forEach((dialog) => {
    dialog.querySelectorAll('.dialog-close').forEach((button) => {
      button.addEventListener('click', () => closeDialog(dialog));
    });
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) closeDialog(dialog);
    });
  });

  const mobileMenu = document.querySelector('#MobileMenu');
  const searchDialog = document.querySelector('#SiteSearch');

  document.querySelector('.menu-trigger')?.addEventListener('click', () => mobileMenu?.showModal());

  const navGroups = [...document.querySelectorAll('[data-nav-group]')];
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const setExpanded = (details) => {
    const summary = details.querySelector('summary');
    if (summary) summary.setAttribute('aria-expanded', details.open ? 'true' : 'false');
  };
  const closeNavGroups = (except) => {
    navGroups.forEach((details) => {
      if (details !== except && details.open) {
        details.removeAttribute('open');
        setExpanded(details);
      }
    });
  };
  navGroups.forEach((details) => {
    const summary = details.querySelector('summary');
    summary?.addEventListener('click', (event) => {
      if (finePointer.matches) {
        event.preventDefault();
        return;
      }
      requestAnimationFrame(() => {
        if (details.open) closeNavGroups(details);
        setExpanded(details);
      });
    });
    if (finePointer.matches) {
      let leaveTimer = 0;
      details.addEventListener('pointerenter', () => {
        window.clearTimeout(leaveTimer);
        closeNavGroups(details);
        details.setAttribute('open', '');
        setExpanded(details);
      });
      details.addEventListener('pointerleave', () => {
        leaveTimer = window.setTimeout(() => {
          details.removeAttribute('open');
          setExpanded(details);
        }, 160);
      });
    }
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('[data-nav-group]')) closeNavGroups();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeNavGroups();
  });
  const openSiteSearch = (preset) => {
    closeDialog(mobileMenu);
    searchDialog?.showModal();
    requestAnimationFrame(() => {
      const input = document.querySelector('#site-search');
      if (!input) return;
      if (preset) {
        input.value = preset;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
      input.focus();
    });
  };
  document.querySelectorAll('.search-trigger').forEach((button) => {
    button.addEventListener('click', () => openSiteSearch());
  });
  document.querySelector('.header-search')?.addEventListener('submit', (event) => {
    const value = event.target.querySelector('input[name="q"]')?.value.trim() || '';
    if (value.length < 2) return;
    event.preventDefault();
    openSiteSearch(value);
  });

  const rail = document.querySelector('[data-product-rail]');
  const filterButtons = [...document.querySelectorAll('.product-filters .filter-button')];
  const emptyState = document.querySelector('[data-empty-state]');

  const applyFilter = (filter) => {
    let visibleCount = 0;
    rail?.querySelectorAll('.product-card').forEach((card) => {
      const visible = filter === 'all'
        || card.dataset.type === filter
        || (filter === 'personalizable' && card.dataset.personalizable === 'true');
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });
    filterButtons.forEach((button) => {
      const active = button.dataset.filter === filter;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    if (emptyState) emptyState.hidden = visibleCount > 0;
  };

  filterButtons.forEach((button) => button.addEventListener('click', () => applyFilter(button.dataset.filter || 'all')));

  const consentKey = 'sumen-tr-consent-v1';
  const cookieBanner = document.querySelector('.cookie-banner');
  const cookieDialog = document.querySelector('.cookie-dialog');
  const analyticsConsent = document.querySelector('.analytics-consent');

  const readConsent = () => {
    try { return JSON.parse(localStorage.getItem(consentKey)); } catch { return null; }
  };

  const applyShopifyConsent = (analytics) => {
    if (window.Shopify?.customerPrivacy?.setTrackingConsent) {
      window.Shopify.customerPrivacy.setTrackingConsent(Boolean(analytics), () => {});
    }
  };

  const writeConsent = (analytics) => {
    const value = { necessary: true, analytics: Boolean(analytics), updatedAt: new Date().toISOString() };
    try { localStorage.setItem(consentKey, JSON.stringify(value)); } catch { /* Consent remains session-only. */ }
    applyShopifyConsent(value.analytics);
    if (cookieBanner) cookieBanner.hidden = true;
    closeDialog(cookieDialog);
  };

  const openConsentSettings = () => {
    const current = readConsent();
    if (analyticsConsent) analyticsConsent.checked = Boolean(current?.analytics);
    cookieDialog?.showModal();
  };

  document.querySelector('.cookie-reject')?.addEventListener('click', () => writeConsent(false));
  document.querySelector('.cookie-accept')?.addEventListener('click', () => writeConsent(true));
  document.querySelector('.cookie-save')?.addEventListener('click', () => writeConsent(analyticsConsent?.checked));
  document.querySelector('.cookie-customize')?.addEventListener('click', openConsentSettings);
  document.querySelector('.cookie-settings-trigger')?.addEventListener('click', openConsentSettings);

  const consent = readConsent();
  if (consent) applyShopifyConsent(consent.analytics);
  else if (cookieBanner) cookieBanner.hidden = false;

  const gallery = document.querySelector('[data-product-gallery]');
  const galleryStage = gallery?.querySelector('[data-gallery-stage]');
  const galleryZoom = document.querySelector('[data-gallery-zoom]');
  const galleryZoomImg = galleryZoom?.querySelector('[data-gallery-zoom-img]');
  const setGalleryImage = (thumb) => {
    const img = galleryStage?.querySelector('img');
    if (!img || !thumb) return;
    img.src = thumb.getAttribute('data-src') || img.src;
    const srcset = thumb.getAttribute('data-srcset');
    if (srcset) img.srcset = srcset;
    img.alt = thumb.getAttribute('data-alt') || img.alt;
    galleryStage.setAttribute('data-full', thumb.getAttribute('data-full') || '');
    gallery?.querySelectorAll('[data-gallery-thumb]').forEach((el) => {
      const active = el === thumb;
      el.classList.toggle('is-active', active);
      el.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  };
  gallery?.querySelectorAll('[data-gallery-thumb]').forEach((thumb) => {
    thumb.addEventListener('click', () => setGalleryImage(thumb));
  });
  galleryStage?.addEventListener('click', () => {
    if (!galleryZoom || !galleryZoomImg) return;
    const full = galleryStage.getAttribute('data-full');
    const img = galleryStage.querySelector('img');
    if (!full) return;
    galleryZoomImg.src = full;
    galleryZoomImg.alt = img?.alt || '';
    galleryZoom.showModal();
  });

  const atcButton = document.querySelector('[data-add-to-cart]');
  const stickyAtc = document.querySelector('[data-sticky-atc]');
  if (atcButton && stickyAtc && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      stickyAtc.hidden = entries[0].isIntersecting;
    }, { threshold: 0 });
    observer.observe(atcButton);
  }
  document.querySelector('[data-sticky-submit]')?.addEventListener('click', () => {
    const form = atcButton?.closest('form');
    if (form && typeof form.requestSubmit === 'function') form.requestSubmit(atcButton);
    else form?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
  });

  const searchInput = document.querySelector('#site-search');
  const suggestList = document.querySelector('[data-search-suggest]');
  const searchStatus = document.querySelector('[data-search-status]');
  const searchShortcuts = document.querySelector('[data-search-shortcuts]');
  let suggestTimer = 0;
  let suggestAbort = null;
  let suggestSeq = 0;
  const resetSuggest = (message) => {
    if (suggestList) {
      suggestList.hidden = true;
      suggestList.replaceChildren();
    }
    if (searchShortcuts) searchShortcuts.hidden = false;
    if (searchStatus) searchStatus.textContent = message;
  };
  const renderSuggest = (products) => {
    if (!suggestList) return;
    suggestList.replaceChildren();
    if (!products.length) {
      resetSuggest('Eşleşen ürün bulunamadı. Koleksiyonlardan devam edebilirsiniz.');
      return;
    }
    if (searchShortcuts) searchShortcuts.hidden = true;
    products.forEach((product) => {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.className = 'search-suggest__item';
      link.href = product.url;
      const imageUrl = product.featured_image?.url || product.image;
      if (imageUrl) {
        const img = document.createElement('img');
        img.src = imageUrl.indexOf('//') === 0 ? 'https:' + imageUrl : imageUrl;
        img.alt = '';
        link.append(img);
      }
      const text = document.createElement('span');
      text.textContent = product.title;
      link.append(text);
      item.append(link);
      suggestList.append(item);
    });
    suggestList.hidden = false;
    if (searchStatus) searchStatus.textContent = products.length + ' öneri';
  };
  searchInput?.addEventListener('input', () => {
    const query = searchInput.value.trim();
    window.clearTimeout(suggestTimer);
    if (suggestAbort) suggestAbort.abort();
    if (query.length < 2) {
      resetSuggest('Mağazadaki ürünler içinde arayın.');
      return;
    }
    suggestTimer = window.setTimeout(async () => {
      const seq = ++suggestSeq;
      suggestAbort = new AbortController();
      try {
        const url = '/search/suggest.json?q=' + encodeURIComponent(query) + '&resources[type]=product&resources[limit]=6';
        const response = await fetch(url, { signal: suggestAbort.signal, headers: { Accept: 'application/json' } });
        if (!response.ok) throw new Error('suggest');
        const data = await response.json();
        if (seq !== suggestSeq) return;
        renderSuggest(data.resources?.results?.products || []);
      } catch (error) {
        if (error.name === 'AbortError') return;
        if (searchStatus) searchStatus.textContent = 'Öneriler yüklenemedi. Enter ile aramayı tamamlayın.';
      }
    }, 280);
  });
  searchDialog?.addEventListener('close', () => {
    window.clearTimeout(suggestTimer);
    if (suggestAbort) suggestAbort.abort();
  });

  const cartDrawer = document.querySelector('#CartDrawer');
  const moneyFormat = cartDrawer?.getAttribute('data-money-format') || '{{amount}}';
  const cartLines = cartDrawer?.querySelector('[data-cart-lines]');
  const cartEmpty = cartDrawer?.querySelector('[data-cart-empty]');
  const cartEmptyLinks = cartDrawer?.querySelector('[data-cart-empty-links]');
  const cartFoot = cartDrawer?.querySelector('[data-cart-drawer-foot]');
  const cartSubtotal = cartDrawer?.querySelector('[data-cart-subtotal]');
  const cartStatus = document.querySelector('[data-cart-status]');
  const formatMoney = (cents) => {
    const number = Number(cents);
    if (!Number.isFinite(number)) return '';
    const negative = number < 0;
    const abs = Math.abs(number) / 100;
    const parts = abs.toFixed(2).split('.');
    const groupedDot = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    const groupedComma = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    let output = moneyFormat
      .replace(/\{\{\s*amount_with_comma_separator\s*\}\}/g, groupedDot + ',' + parts[1])
      .replace(/\{\{\s*amount_no_decimals_with_comma_separator\s*\}\}/g, groupedDot)
      .replace(/\{\{\s*amount_no_decimals\s*\}\}/g, groupedComma)
      .replace(/\{\{\s*amount_with_apostrophe_separator\s*\}\}/g, parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, "'") + '.' + parts[1])
      .replace(/\{\{\s*amount\s*\}\}/g, groupedComma + '.' + parts[1]);
    if (negative) output = '-' + output;
    return output;
  };
  const setCartStatus = (message, isError) => {
    if (!cartStatus) return;
    if (!message) {
      cartStatus.hidden = true;
      cartStatus.textContent = '';
      return;
    }
    cartStatus.hidden = false;
    cartStatus.textContent = message;
    cartStatus.style.color = isError ? '#7a2e24' : 'var(--muted)';
  };
  const updateCartCount = (count) => {
    document.querySelectorAll('[data-cart-count]').forEach((el) => {
      el.textContent = count > 0 ? '(' + count + ')' : '';
    });
  };
  const renderCart = (cart) => {
    if (!cartDrawer) return;
    updateCartCount(cart.item_count);
    const empty = !cart.item_count;
    if (cartEmpty) cartEmpty.hidden = !empty;
    if (cartEmptyLinks) cartEmptyLinks.hidden = !empty;
    if (cartLines) cartLines.hidden = empty;
    if (cartFoot) cartFoot.hidden = empty;
    if (cartSubtotal) cartSubtotal.textContent = formatMoney(cart.total_price);
    if (!cartLines) return;
    cartLines.replaceChildren();
    (cart.items || []).forEach((item) => {
      const article = document.createElement('article');
      article.className = 'cart-drawer__line';
      const imageLink = document.createElement('a');
      imageLink.href = item.url;
      if (item.image) {
        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.product_title || item.title || '';
        imageLink.append(img);
      }
      const body = document.createElement('div');
      const title = document.createElement('a');
      title.href = item.url;
      title.innerHTML = '<strong></strong>';
      title.querySelector('strong').textContent = item.product_title || item.title || '';
      body.append(title);
      if (item.variant_title && item.variant_title !== 'Default Title') {
        const variant = document.createElement('p');
        variant.textContent = item.variant_title;
        body.append(variant);
      }
      if (item.properties) {
        Object.keys(item.properties).forEach((key) => {
          if (!key || key.charAt(0) === '_' || !item.properties[key]) return;
          const prop = document.createElement('p');
          prop.textContent = key + ': ' + item.properties[key];
          body.append(prop);
        });
      }
      const price = document.createElement('p');
      price.textContent = formatMoney(item.final_line_price);
      body.append(price);
      const qty = document.createElement('div');
      qty.className = 'cart-drawer__qty';
      const minus = document.createElement('button');
      minus.type = 'button';
      minus.setAttribute('aria-label', 'Adeti azalt');
      minus.textContent = '−';
      minus.addEventListener('click', () => changeCart(item.key, item.quantity - 1));
      const count = document.createElement('span');
      count.textContent = String(item.quantity);
      const plus = document.createElement('button');
      plus.type = 'button';
      plus.setAttribute('aria-label', 'Adeti artır');
      plus.textContent = '+';
      plus.addEventListener('click', () => changeCart(item.key, item.quantity + 1));
      qty.append(minus, count, plus);
      body.append(qty);
      article.append(imageLink, body);
      cartLines.append(article);
    });
  };
  const fetchCart = async () => {
    const response = await fetch('/cart.js', { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('cart');
    return response.json();
  };
  const openCartDrawer = async () => {
    if (!cartDrawer) return;
    try {
      renderCart(await fetchCart());
    } catch {
      window.location.href = '/cart';
      return;
    }
    if (!cartDrawer.open) cartDrawer.showModal();
  };
  const changeCart = async (key, quantity) => {
    try {
      const response = await fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ id: key, quantity: Math.max(0, quantity) })
      });
      if (!response.ok) throw new Error('change');
      renderCart(await response.json());
    } catch {
      window.location.href = '/cart';
    }
  };
  document.querySelectorAll('[data-cart-open]').forEach((el) => {
    el.addEventListener('click', (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      closeDialog(mobileMenu);
      openCartDrawer();
    });
  });
  const faqRoot = document.querySelector('[data-faq-root]');
  const faqSearch = document.querySelector('[data-faq-search]');
  const faqStatus = document.querySelector('[data-faq-status]');
  if (faqRoot && faqSearch) {
    const items = [...faqRoot.querySelectorAll('.faq-item')];
    const sections = [...faqRoot.querySelectorAll('.faq-section')];
    const filterFaq = () => {
      const q = faqSearch.value.trim().toLocaleLowerCase('tr-TR');
      let visible = 0;
      items.forEach((item) => {
        const match = !q || item.textContent.toLocaleLowerCase('tr-TR').includes(q);
        item.classList.toggle('is-hidden', !match);
        if (match) visible += 1;
      });
      sections.forEach((section) => {
        const any = section.querySelector('.faq-item:not(.is-hidden)');
        section.classList.toggle('is-empty', Boolean(q) && !any);
      });
      if (faqStatus) faqStatus.hidden = visible !== 0;
    };
    faqSearch.addEventListener('input', filterFaq);
  }

  const moreGrid = document.querySelector('[data-more-grid]');
  const moreFeedEl = document.querySelector('[data-more-feed]');
  const moreBtn = document.querySelector('[data-more-load]');
  if (moreGrid && moreFeedEl) {
    let feed = [];
    try { feed = JSON.parse(moreFeedEl.textContent || '[]'); } catch { feed = []; }
    const seen = new Set([...moreGrid.querySelectorAll('.catalog-card__link')].map((a) => a.getAttribute('href')));
    let cursor = 0;
    const absImg = (src) => {
      if (!src) return '';
      if (src.indexOf('//') === 0) return 'https:' + src;
      return src;
    };
    const esc = (value) => String(value || '').replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
    const cardHtml = (item) => {
      const img = absImg(item.image);
      const spec = [item.pieces ? String(item.pieces).replace(/\D/g, '') + ' parça' : '', item.material || ''].filter(Boolean).join(' · ');
      const compare = item.compare ? '<s>' + esc(item.compare) + '</s>' : '';
      return '<article class="catalog-card"><a class="catalog-card__link" href="' + esc(item.url) + '">' +
        '<span class="catalog-card__media media-plate img-zoom">' +
        (img ? '<img src="' + esc(img) + '" alt="' + esc(item.title) + '" loading="lazy" width="900" height="1350">' : '') +
        '</span><span class="catalog-card__copy"><span class="catalog-card__title">' + esc(item.title) + '</span>' +
        (spec ? '<span class="catalog-card__spec">' + esc(spec) + '</span>' : '') +
        '<span class="catalog-card__price"><strong>' + esc(item.price) + '</strong>' + compare + '</span></span></a></article>';
    };
    const hasUnseen = () => {
      for (let i = cursor; i < feed.length; i += 1) {
        const item = feed[i];
        if (item && item.url && !seen.has(item.url)) return true;
      }
      return false;
    };
    const syncBtn = () => {
      if (moreBtn) moreBtn.hidden = !hasUnseen();
    };
    const loadMore = () => {
      let added = 0;
      while (cursor < feed.length && added < 4) {
        const item = feed[cursor];
        cursor += 1;
        if (!item || !item.url || seen.has(item.url)) continue;
        seen.add(item.url);
        moreGrid.insertAdjacentHTML('beforeend', cardHtml(item));
        added += 1;
      }
      syncBtn();
    };
    moreBtn?.addEventListener('click', loadMore);
    syncBtn();
  }

  document.querySelectorAll('form.product-form').forEach((form) => {
    form.addEventListener('submit', async (event) => {
      if (event.submitter && event.submitter.getAttribute('name') === 'checkout') return;
      event.preventDefault();
      const submit = form.querySelector('[data-add-to-cart]');
      const wasDisabled = Boolean(submit?.disabled);
      if (submit) submit.disabled = true;
      setCartStatus('Sepete ekleniyor…', false);
      try {
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: new FormData(form)
        });
        const data = await response.json();
        if (!response.ok) {
          setCartStatus(data.description || data.message || 'Ürün sepete eklenemedi.', true);
          return;
        }
        setCartStatus('Sepete eklendi.', false);
        await openCartDrawer();
      } catch {
        form.submit();
      } finally {
        if (submit) submit.disabled = wasDisabled;
      }
    });
  });
})();
