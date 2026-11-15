const design = new URLSearchParams(location.search).get('tasarim');
if (design && /^[a-z0-9-]{1,100}$/.test(design)) {
  for (const link of document.querySelectorAll('[data-material-code]')) {
    link.href = `/tasarim/${design}/?kaplama=${encodeURIComponent(link.dataset.materialCode)}#request-form`;
    link.hidden = false;
  }
}
