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
  document.querySelectorAll('.search-trigger').forEach((button) => {
    button.addEventListener('click', () => {
      closeDialog(mobileMenu);
      searchDialog?.showModal();
      requestAnimationFrame(() => document.querySelector('#site-search')?.focus());
    });
  });

  const rail = document.querySelector('[data-product-rail]');
  const filterButtons = [...document.querySelectorAll('.filter-button')];
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

  const consentKey = 'pastel-atelier-consent-v1';
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
})();
