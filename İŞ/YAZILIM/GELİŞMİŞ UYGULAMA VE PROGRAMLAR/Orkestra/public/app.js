const state = {
  token: sessionStorage.getItem('orchestra.token') || '',
  passwordsDisabled: false,
  localUser: sessionStorage.getItem('orchestra.localUser')||'', runtimeUsers: [],
  identity: null,
  brand: sessionStorage.getItem('orchestra.brand') || '',
  access: new Map(),
  current: null,
  path: [],
  searchMode: 'google',
  orders: [], tasks: [], audit: [],
  settings: {accounts:[],integrations:[],rules:[],users:[],organization:null,system:null},
  preferences: new Map(), hiddenModules: new Set(), errors: [],
  calcExpression: '0', dialogTrigger: null, dialogDirty: false, dialogSubmitting: false
};

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
const dateTime = value => value ? new Intl.DateTimeFormat('tr-TR',{dateStyle:'medium',timeStyle:'short'}).format(new Date(value)) : '—';
const money = (value,currency='TRY') => new Intl.NumberFormat('tr-TR',{style:'currency',currency:/^[A-Z]{3}$/.test(currency)?currency:'TRY'}).format(Number(value) || 0);
const safeJson = value => { try { return value ? JSON.parse(value) : null; } catch { return null; } };
const shortId = value => value ? String(value).slice(0,8) : '—';
const labels = {
  pending:'Bekliyor', planned:'Planlandı', in_progress:'Devam ediyor', blocked:'Engelli', quality_check:'Kalite kontrol', completed:'Tamamlandı', done:'Tamamlandı', cancelled:'İptal', draft:'Taslak', submitted:'Onay bekliyor', approved:'Onaylandı', ordered:'Sipariş verildi', received:'Teslim alındı', released:'Bırakıldı', consumed:'Kullanıldı', low:'Düşük', normal:'Normal', high:'Yüksek', urgent:'Acil', count_adjustment:'Sayım düzeltmesi', recorded:'Kaydedildi', unmatched:'Eşleşmedi', matched:'Eşleşti', proposed:'Önerildi', awaiting_confirmation:'Onay bekliyor', queued:'Kuyrukta', executing:'İşleniyor', succeeded:'Tamamlandı', failed:'Hatalı',
  preparing:'Hazırlanıyor', shipped:'Kargoya verildi', in_transit:'Yolda', delivered:'Teslim edildi', exception:'Sorunlu', returned:'İade geldi', issued:'Kesildi', paid:'Ödendi', incoming:'Tahsilat', outgoing:'Ödeme',
  unknown:'Bilinmiyor', authorized:'Onaylandı', expired:'Süresi doldu', partially_paid:'Kısmi ödendi', partially_refunded:'Kısmi iade', refunded:'İade edildi', voided:'Geçersiz', unfulfilled:'Hazırlanmadı', partial:'Kısmi hazır', fulfilled:'Hazırlandı', on_hold:'Beklemede', scheduled:'Planlandı', none:'İade yok', requested:'İade istendi', active:'Aktif', archived:'Arşiv',
  awaiting_credentials:'Erişim bilgisi bekliyor', awaiting_api_credentials:'API yetkisi bekliyor', awaiting_installation:'Kurulum bekliyor', awaiting_license:'Lisans bekliyor', license_required:'API lisansı gerekli', identified:'Hesap bulundu', provider_required:'Sağlayıcı seçilmeli', connected:'Bağlı', syncing:'Eşitleniyor', error:'Hata', not_configured:'Yapılandırılmadı',
  orders:'Sipariş', customers:'Müşteri', products:'Ürün', inventory:'Stok', returns:'İade', marketplace_source:'Pazaryeri kaynağı',
  traffic:'Trafik', realtime:'Canlı veri', ecommerce:'E-ticaret', revenue:'Gelir', attribution:'Kanal katkısı', issues:'Ürün sorunları', performance:'Performans', competitive_visibility:'Rekabet görünümü',
  campaigns:'Kampanya', spend:'Harcama', conversions:'Dönüşüm', search_terms:'Arama terimleri', create_shipment:'Gönderi oluşturma', track_shipment:'Kargo takibi', cancel_shipment:'Gönderi iptali',
  payments:'Ödeme', expenses:'Gider', reconciliation:'Mutabakat', invoices:'Fatura',
  invoice:'Fatura kontrolü', production:'Üretim', 'shipping.domestic':'Yurt içi kargo', 'shipping.international':'Yurt dışı kargo',
  'order.created':'Sipariş oluşturuldu', 'order.duplicate':'Tekrar sipariş engellendi', 'task.status_changed':'Görev durumu değişti',
  'account.configured':'Hesap yapılandırıldı', 'rule.updated':'Atama kuralı güncellendi', 'user.created':'Kullanıcı oluşturuldu',
  'user.permissions_updated':'Kullanıcı yetkileri güncellendi', 'user.status_changed':'Kullanıcı durumu değişti', 'feature.unlocked':'Klasör açıldı', 'feature.locked':'Klasör kilitlendi',
  'order.updated':'Sipariş güncellendi','order.cancelled':'Sipariş iptal edildi','order.restarted':'Sipariş yeniden başlatıldı','order.stale_ignored':'Eski olay atlandı','task.created':'Görev oluşturuldu','task.restarted':'Görev yeniden başlatıldı','account.reconciled':'Hesap yeniden eşitlendi','demo_source.created':'Demo kaynak siparişi oluşturuldu','demo_source.changed':'Demo kaynak siparişi değişti',
  'customer.created':'Müşteri oluşturuldu','product.created':'Ürün oluşturuldu','inventory.count_approved':'Stok sayımı onaylandı','quote.created':'Teklif oluşturuldu','production.created':'Üretim işi oluşturuldu','production.status_changed':'Üretim durumu değişti',
  'shipment.created':'Gönderi oluşturuldu','shipment.status_changed':'Kargo durumu değişti','invoice.created':'Fatura oluşturuldu','invoice.status_changed':'Fatura durumu değişti','payment.created':'Ödeme kaydedildi','product.mapping_updated':'Ürün eşlemesi güncellendi'
};
const label = value => labels[value] || value || '—';

const icons = {
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/>',
  arrowRight:'<path d="m9 18 6-6-6-6"/>',
  cart:'<circle cx="9" cy="20" r="1"/><circle cx="19" cy="20" r="1"/><path d="M3 4h2l2.4 10.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L21 8H7"/>',
  workflow:'<rect x="3" y="3" width="6" height="6" rx="2"/><rect x="15" y="15" width="6" height="6" rx="2"/><path d="M9 6h4a4 4 0 0 1 4 4v5M15 18H9a4 4 0 0 1-4-4V9"/>',
  wallet:'<path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H19a1 1 0 0 1 1 1v15H6a2 2 0 0 1-2-2z"/><path d="M4 8h16M16 12h5v4h-5a2 2 0 0 1 0-4z"/>',
  folder:'<path d="M3 6a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v9a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3z"/>',
  home:'<path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10M9 20v-6h6v6"/>',
  receipt:'<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
  check:'<rect x="3" y="3" width="18" height="18" rx="4"/><path d="m8 12 3 3 6-7"/>',
  users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
  wrench:'<path d="M14.7 6.3a4 4 0 0 0-5-5L12 3.6 9.6 6 7.3 3.7a4 4 0 0 0 5 5L4 17a2.1 2.1 0 1 0 3 3z"/>',
  clipboard:'<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4a3 3 0 0 1 6 0v2H9zM9 11h6M9 15h6"/>',
  shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12h6M12 9v6"/>',
  help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.7 2.7 0 1 1 4.2 2.2c-1 .6-1.7 1.2-1.7 2.8M12 18h.01"/>',
  monitor:'<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
  chart:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  megaphone:'<path d="M3 11v2a2 2 0 0 0 2 2h3l8 4V5L8 9H5a2 2 0 0 0-2 2zM8 15l1 5h3"/><path d="M20 9a4 4 0 0 1 0 6"/>',
  store:'<path d="M3 9l2-5h14l2 5M5 13v8h14v-8M9 21v-6h6v6"/><path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/>',
  file:'<path d="M6 2h8l4 4v16H6z"/><path d="M14 2v5h5M9 13h6M9 17h6"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1z"/>',
  truck:'<path d="M3 5h11v11H3zM14 9h4l3 3v4h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>',
  boxes:'<path d="m5 8 7-4 7 4-7 4zM5 8v8l7 4 7-4V8M12 12v8"/>',
  calculator:'<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 19h.01M12 19h.01M16 19h.01"/>',
  coins:'<ellipse cx="8" cy="7" rx="5" ry="3"/><path d="M3 7v4c0 1.7 2.2 3 5 3M3 11v4c0 1.7 2.2 3 5 3"/><ellipse cx="16" cy="14" rx="5" ry="3"/><path d="M11 14v4c0 1.7 2.2 3 5 3s5-1.3 5-3v-4"/>',
  database:'<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  sparkles:'<path d="m12 3 1.1 3.2L16 8l-2.9 1.8L12 13l-1.1-3.2L8 8l2.9-1.8zM5 14l.8 2.2L8 17.5l-2.2 1.3L5 21l-.8-2.2L2 17.5l2.2-1.3zM19 13l.7 1.8 1.8.7-1.8.7L19 18l-.7-1.8-1.8-.7 1.8-.7z"/>',
  image:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m3 17 5-5 4 4 3-3 6 6"/>',
  play:'<rect x="3" y="5" width="18" height="14" rx="4"/><path d="m10 9 5 3-5 3z"/>',
  grid:'<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',
  link:'<path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1.1-1.1"/>',
  sliders:'<path d="M4 5h16M4 12h16M4 19h16"/><circle cx="9" cy="5" r="2"/><circle cx="15" cy="12" r="2"/><circle cx="7" cy="19" r="2"/>',
  lock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/>',
  arrowLeft:'<path d="m15 18-6-6 6-6"/>',
  plug:'<path d="M8 3v5M16 3v5M6 8h12v2a6 6 0 0 1-6 6v5M8 21h8"/>'
  ,bolt:'<path d="m13 2-9 12h7l-1 8 9-12h-7z"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/>',
  star:'<path d="m12 2 3 6 7 .9-5 4.8 1.3 6.8-6.3-3.3-6.3 3.3L7 13.7 2 8.9 9 8z"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/>'
};
const brandIcons = {
  google:`<svg class="brand-icon brand-google" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M21.6 12.23c0-.72-.06-1.4-.18-2.07H12v3.92h5.38a4.6 4.6 0 0 1-2 3.02v2.54h3.24c1.9-1.75 2.98-4.33 2.98-7.41Z"/><path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.62-2.36l-3.24-2.54c-.9.6-2.05.96-3.38.96-2.6 0-4.81-1.76-5.6-4.13H3.05v2.62A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.4 13.93A6 6 0 0 1 6.09 12c0-.67.12-1.32.31-1.93V7.45H3.05A10 10 0 0 0 2 12c0 1.61.39 3.14 1.05 4.55l3.35-2.62Z"/><path fill="#EA4335" d="M12 5.94c1.47 0 2.79.51 3.83 1.5l2.87-2.87A9.63 9.63 0 0 0 12 2a10 10 0 0 0-8.95 5.45l3.35 2.62C7.19 7.7 9.4 5.94 12 5.94Z"/></svg>`,
  openai:`<svg class="brand-icon brand-openai" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M22.282 9.821a6 6 0 0 0-.516-4.91 6.05 6.05 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a6 6 0 0 0-3.998 2.9 6.05 6.05 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.05 6.05 0 0 0 6.515 2.9A6 6 0 0 0 13.26 24a6.06 6.06 0 0 0 5.772-4.206 6 6 0 0 0 3.997-2.9 6.06 6.06 0 0 0-.747-7.073M13.26 22.43a4.48 4.48 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.8.8 0 0 0 .392-.681v-6.737l2.02 1.168a.07.07 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494M3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.77.77 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646M2.34 7.896a4.5 4.5 0 0 1 2.366-1.973V11.6a.77.77 0 0 0 .388.677l5.815 3.354-2.02 1.168a.08.08 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855-5.833-3.387L15.119 7.2a.08.08 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667m2.01-3.023-.141-.085-4.774-2.782a.78.78 0 0 0-.785 0L9.409 9.23V6.897a.07.07 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.8.8 0 0 0-.393.681zm1.097-2.365 2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5Z"/></svg>`,
  youtube:`<svg class="brand-icon brand-youtube" viewBox="0 0 24 24" aria-hidden="true"><path fill="#FF0033" d="M23.5 6.19a3 3 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3 3 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3 3 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3 3 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81Z"/><path fill="#fff" d="m9.55 15.57 6.27-3.57-6.27-3.57v7.14Z"/></svg>`,
  excel:`<svg class="brand-icon brand-excel" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="2" width="16" height="20" rx="2.3" fill="#107C41"/><path fill="#33C481" d="M14 5h5v3h-5zm0 5h5v3h-5zm0 5h5v3h-5z"/><rect x="2" y="5" width="13" height="14" rx="1.7" fill="#185C37"/><path fill="#fff" d="M5.15 8h2.2l1.35 2.37L10.1 8h2.1l-2.38 3.95L12.35 16h-2.23l-1.49-2.58L7.13 16H5l2.52-4.02L5.15 8Z"/></svg>`,
  visual:`<svg class="brand-icon brand-visual" viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="visual-gradient" x1="2" y1="22" x2="22" y2="2"><stop stop-color="#6C5CE7"/><stop offset=".52" stop-color="#B45FE7"/><stop offset="1" stop-color="#FF8A4C"/></linearGradient></defs><rect x="1" y="1" width="22" height="22" rx="6" fill="url(#visual-gradient)"/><circle cx="8" cy="8" r="2" fill="#FFE6A8"/><path fill="#fff" d="m4 18 5.1-5.6 3.15 3.15 2.15-2.25L20 18H4Z"/><path fill="#fff" d="m17.5 4 .55 1.45L19.5 6l-1.45.55L17.5 8l-.55-1.45L15.5 6l1.45-.55L17.5 4Z"/></svg>`,
  shopify:`<svg class="brand-icon brand-shopify" viewBox="0 0 24 24" aria-hidden="true"><path fill="#7AB55C" d="m15.34 23.98 7.21-1.56S19.95 4.81 19.93 4.69c-.02-.12-.12-.19-.22-.19l-1.92-.14-1.44-1.41-.12-.08-.92 21.11h.03ZM11.71 11.3s-.81-.42-1.77-.42c-1.45 0-1.51.91-1.51 1.14 0 1.23 3.24 1.72 3.24 4.63 0 2.3-1.44 3.76-3.4 3.76-2.36 0-3.54-1.46-3.54-1.46l.64-2.09s1.25 1.07 2.28 1.07c.68 0 .98-.55.98-.93 0-1.62-2.66-1.7-2.66-4.36-.03-2.24 1.57-4.42 4.83-4.42 1.26 0 1.88.36 1.88.36l-.95 2.72h-.02Z"/><path fill="#95BF47" d="M11.17.83c.14 0 .27.04.41.14-.99.46-2.07 1.64-2.51 3.99l-1.89.58C7.7 3.75 8.95.84 11.17.84Zm1.24 2.95v.13l-2.4.74c.47-1.78 1.34-2.65 2.09-2.97.19.5.31 1.17.31 2.1Zm3.53-.95-.08.02-.72.21C14.72 1.83 13.97.7 12.64.7h-.12C12.14.21 11.67 0 11.27 0 8.16 0 6.68 3.88 6.21 5.85l-2.16.67c-.68.21-.7.23-.77.87L1.45 21.45 15.01 24l.93-21.17Z"/></svg>`,
  analytics:`<svg class="brand-icon brand-analytics" viewBox="0 0 24 24" aria-hidden="true"><rect x="16.9" y="0" width="5.95" height="24" rx="2.98" fill="#E37400"/><rect x="9.05" y="9" width="5.94" height="15" rx="2.97" fill="#F9AB00"/><circle cx="4.13" cy="21.03" r="2.97" fill="#E37400"/></svg>`,
  googleAds:`<svg class="brand-icon brand-google-ads" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M9.99 1.61a4 4 0 0 1 5.47 1.46l8 13.86a4 4 0 1 1-6.93 4L8.53 7.07a4 4 0 0 1 1.46-5.46Z"/><path fill="#34A853" d="M7.52 4.84 1.56 15.15A4.5 4.5 0 0 1 8.5 19.14l3.21-5.57-3.61-6.25a4 4 0 0 1-.58-2.48Z"/><circle cx="4" cy="18.93" r="4" fill="#FBBC04"/></svg>`,
  meta:`<svg class="brand-icon brand-meta" viewBox="0 0 24 24" aria-hidden="true"><path fill="#0467DF" d="M6.92 4.03C3.04 4.03 0 9.36 0 14.45c0 3.2 1.17 5.52 4.44 5.52 2.39 0 3.72-1.71 6.63-6.76l.94-1.67.18.3 2.15 3.6c1.76 2.94 3.27 4.53 5.53 4.53 2.68 0 4.13-1.94 4.13-5.56 0-5.18-2.77-10.38-6.8-10.38-2.08 0-3.88 1.68-5.87 4.36-1.75-2.22-3.02-4.36-5.41-4.36Zm-.04 2.61c1.56 0 2.45 1.23 3.9 3.02l-1.02 1.57c-3.11 4.77-4.22 6.15-5.32 6.15-1.22 0-1.85-1.08-1.85-2.84 0-4.02 1.83-7.9 4.29-7.9Zm10.2-.56c2.64 0 4.64 4.04 4.64 8.4 0 1.97-.59 2.9-1.84 2.9-1.19 0-2.17-1.47-4.5-5.36l-1.87-3.01c1.2-1.88 2.28-2.93 3.57-2.93Z"/></svg>`
};
const nodeIcons = {
  web:'globe','work-management':'workflow','work-overview':'chart','pending-orders':'receipt','pending-tasks':'check','pending-payments':'wallet','pending-shipments':'truck',sales:'cart','customer-hub':'users',catalog:'boxes',production:'gear','inventory-hub':'database',supply:'receipt',shipping:'truck',finance:'wallet',reports:'chart',files:'folder',home:'home',orders:'receipt',tasks:'check',customers:'users',products:'boxes',inventory:'database','inventory-count':'clipboard',reservations:'lock','stock-movements':'workflow',quotes:'file','production-jobs':'gear',boms:'clipboard','material-needs':'boxes','purchase-requests':'receipt',returns:'arrowLeft',notifications:'megaphone',audit:'clipboard',errors:'help',preferences:'sliders',calculator:'calculator','product-cost':'coins',google:'search',ai:'sparkles',visual:'image',youtube:'play',excel:'grid',tools:'wrench',admin:'shield',help:'help',overview:'chart',packages:'boxes',shipments:'truck','delivery-tracking':'clock','returned-packages':'arrowLeft',payments:'coins',invoices:'receipt',
  'web-sites':'monitor','web-admins':'database',analytics:'chart',ads:'megaphone','web-content':'file','web-social':'users','web-email':'file','web-team':'users','site-guner':'store','site-teknik':'store','site-makro':'store','shopify-admin':'store','faprika-admin':'monitor','google-ads':'megaphone','meta-ads':'megaphone','merchant-center':'store','search-console':'search','tag-manager':'sliders',marketplaces:'store','market-shopify':'store','market-faprika':'store',quotations:'file',production:'gear',shipping:'truck',stock:'boxes',invoices:'receipt','finance-reports':'chart',drive:'folder',documents:'file',reports:'chart','admin-connections':'link','admin-users':'users','admin-rules':'sliders','channel-products':'store','channel-mappings':'link'
};
function icon(name,className='ui-icon') { return `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${icons[name]||icons.grid}</svg>`; }
const nodeBrands={google:'google',ai:'openai',visual:'visual',youtube:'youtube',excel:'excel','shopify-admin':'shopify','market-shopify':'shopify',analytics:'analytics','google-ads':'googleAds','meta-ads':'meta'};
function nodeIcon(node,className='ui-icon',override='') { const brand=nodeBrands[node.id]; return !override&&brand?brandIcons[brand]:icon(override||node.iconName||nodeIcons[node.id]||(node.type==='folder'?'folder':'grid'),className); }
const toneGroups={
  blue:new Set(['web','reports','overview','analytics','google','web-sites','web-admins','drive','documents']),
  green:new Set(['sales','orders','quotes','customers','customer-hub','shopify-admin','market-shopify','excel']),
  teal:new Set(['work-management','work-overview','pending-tasks','pending-shipments','inventory-hub','inventory','inventory-count','shipping','tasks']),
  orange:new Set(['pending-orders','pending-payments','production','production-jobs','supply','finance','calculator','product-cost','invoices']),
  purple:new Set(['ai','visual','files','catalog','products','designs','notifications']),
  rose:new Set(['ads','google-ads','meta-ads','web-social','web-content','errors'])
};
function nodeTone(node) { for(const [tone,ids] of Object.entries(toneGroups))if(ids.has(node.id))return tone; return 'sand'; }
const obviousBrandNodes=new Set(['google','ai','youtube','excel','shopify-admin','market-shopify','analytics','google-ads','meta-ads']);
const compactLabels={home:'Ana','work-management':'İş Yönetimi','pending-orders':'Sipariş','pending-tasks':'İşler','pending-payments':'Ödeme','pending-shipments':'Kargo','customer-hub':'Müşteri',catalog:'Ürün','inventory-hub':'Stok',supply:'Tedarik',shipping:'Kargo',finance:'Muhasebe',reports:'Rapor',files:'Dosya',tasks:'İşler',notifications:'Bildirim',audit:'Denetim',errors:'Hatalar',admin:'Yönetim','admin-connections':'Bağlantı',tools:'Araçlar',preferences:'Ayarlar','production-jobs':'İş emri','product-cost':'Maliyet',visual:'Görsel'};
function tileLabel(node,className='tile-label') { return `<span class="${className}">${escapeHtml(compactLabels[node.id]||node.label)}</span>`; }
function lockMark() { return `<span class="lock-mark" aria-hidden="true">${icon('lock')}</span>`; }
function buttonTip(node,override='') { const detail=override||node.description||''; return `<span class="button-tip" aria-hidden="true"><strong>${escapeHtml(node.label)}</strong>${detail?`<small>${escapeHtml(detail)}</small>`:''}</span>`; }

const ordersNode = {id:'orders',label:'Siparişler',symbol:'S',type:'orders',permission:'orders.read',description:'Kaynak ve iç siparişler'};
const tasksNode = {id:'tasks',label:'İşlerim',symbol:'G',type:'tasks',permission:'tasks.read',description:'Bekleyen ve atanan işler'};
const customersNode = {id:'customers',label:'Müşteriler',symbol:'M',type:'resource',resource:'customers',permission:'customers.read',writePermission:'customers.write',description:'Müşteri ve bayi kayıtları'};
const productsNode = {id:'products',label:'Yerel ürünler',symbol:'Ü',type:'resource',resource:'products',permission:'products.read',writePermission:'products.write',description:'Sayımı bekleyen yerel ürün kayıtları'};
const channelProductsNode = {id:'channel-products',label:'Mağaza ürünleri',symbol:'M',type:'channel-products',permission:'products.read',writePermission:'products.write',description:'Satış kanallarındaki ürün ve varyantlar'};
const inventoryNode = {id:'inventory',label:'Stok görünümü',symbol:'S',type:'inventory',permission:'inventory.read',writePermission:'inventory.write',description:'Konum, rezervasyon ve doğrulama'};
const reservationsNode = {id:'reservations',label:'Rezervasyonlar',symbol:'R',type:'reservations',permission:'inventory.read',writePermission:'inventory.write',description:'Sipariş için ayrılan stok'};
const stockMovementsNode = {id:'stock-movements',label:'Depo hareketleri',symbol:'D',type:'stock-movements',permission:'inventory.read',description:'Stok hareket defteri'};
const quotesNode = {id:'quotes',label:'Teklifler',symbol:'T',type:'resource',resource:'quotes',permission:'quotes.read',writePermission:'quotes.write',description:'Sürümlü satış teklifleri'};
const productionNode = {id:'production-jobs',label:'İş emirleri',symbol:'İ',type:'production',permission:'production.read',writePermission:'production.write',description:'Üretim işleri ve kalite geçişleri'};
const bomsNode = {id:'boms',label:'Ürün reçeteleri',symbol:'R',type:'boms',permission:'production.read',writePermission:'production.write',description:'Malzeme reçeteleri ve revizyonlar'};
const materialNeedsNode = {id:'material-needs',label:'Malzeme ihtiyaçları',symbol:'M',type:'material-needs',permission:'production.read',description:'Üretim talebinden doğan açıklar'};
const purchaseRequestsNode = {id:'purchase-requests',label:'Satın alma',symbol:'S',type:'purchase-requests',permission:'inventory.read',writePermission:'inventory.write',description:'Satın alma talepleri'};
const returnsNode = {id:'returns',label:'İptal / iade',symbol:'İ',type:'returns',permission:'orders.write',writePermission:'orders.write',description:'Sipariş iade akışı'};
const notificationsNode = {id:'notifications',label:'Bildirimler',symbol:'B',type:'notifications',permission:'notifications.read',description:'Müdahale gerektiren durumlar'};
const auditNode = {id:'audit',label:'Denetim',symbol:'D',type:'audit',permission:'audit.read',description:'İşlem geçmişi'};
const errorsNode = {id:'errors',label:'Hatalar',symbol:'!',type:'errors',permission:'settings.write',description:'İşlenemeyen entegrasyon olayları'};
const preferencesNode = {id:'preferences',label:'Görünüm',symbol:'G',type:'preferences',permission:'preferences.write',description:'Kişisel gizle ve göster ayarları'};
const calculatorNode = {id:'calculator',label:'Hesap makinesi',symbol:'+',type:'calculator',description:'Hızlı hesap'};
const costNode = {id:'product-cost',label:'Ürün maliyeti',symbol:'₺',type:'cost',description:'Maliyet ve satış fiyatı'};
const googleNode = {id:'google',label:'Google',symbol:'G',type:'search',searchMode:'google',description:'Web araması'};
const aiNode = {id:'ai',label:'ChatGPT',symbol:'AI',type:'search',searchMode:'ai',description:'ChatGPT’ye sor',defaultLocked:true};
const visualNode = {id:'visual',label:'Görsel üret',symbol:'V',type:'search',searchMode:'visual',description:'Görsel fikri oluştur',defaultLocked:true};
const youtubeNode = {id:'youtube',label:'YouTube',symbol:'▶',type:'search',searchMode:'youtube',description:'YouTube’da ara'};
const excelNode = {id:'excel',label:'Excel',symbol:'X',type:'url',url:'https://www.office.com/launch/excel',description:'Excel Online'};
const searchNodes={google:googleNode,ai:aiNode,visual:visualNode,youtube:youtubeNode};
const packagesNode = {id:'packages',label:'Hazırlanacaklar',symbol:'H',type:'shipments',shipmentStatuses:['preparing'],permission:'shipping.read',writePermission:'shipping.write',description:'Paketleme bekleyen siparişler'};
const shipmentsNode = {id:'shipments',label:'Gönderiler',symbol:'G',type:'shipments',shipmentStatuses:[],permission:'shipping.read',writePermission:'shipping.write',description:'Tüm kargo kayıtları'};
const trackingNode = {id:'delivery-tracking',label:'Teslimat takibi',symbol:'T',type:'shipments',shipmentStatuses:['shipped','in_transit','exception'],permission:'shipping.read',writePermission:'shipping.write',description:'Yolda ve sorunlu gönderiler'};
const returnedPackagesNode = {id:'returned-packages',label:'Geri gelenler',symbol:'G',type:'shipments',shipmentStatuses:['returned'],permission:'shipping.read',writePermission:'shipping.write',description:'İade gelen paketler'};
const paymentsNode = {id:'payments',label:'Tahsilat / ödeme',symbol:'T',type:'payments',permission:'finance.read',writePermission:'finance.write',description:'Para giriş ve çıkışları'};
const invoicesNode = {id:'invoices',label:'Cari / faturalar',symbol:'F',type:'invoices',permission:'finance.read',writePermission:'finance.write',description:'Fatura ve tahsilat durumu'};
const expensesNode = {id:'expenses',label:'Giderler',symbol:'G',type:'expenses',permission:'finance.read',writePermission:'finance.write',description:'İşletme giderleri'};
const reconciliationNode = {id:'reconciliation',label:'Mutabakat',symbol:'M',type:'reconciliation',permission:'finance.read',writePermission:'finance.write',description:'Açık finans kayıtlarını eşleştir'};
const financeSummaryNode = {id:'finance-report',label:'Finans / operasyon',symbol:'F',type:'finance-summary',permission:'finance.summary',alsoPermissions:['finance.read'],description:'Tahsilat, gider ve alacak özeti'};
const salesReportNode = {id:'sales-report',label:'Satış',symbol:'S',type:'sales-report',permission:'orders.read',description:'Kanal ve ciro görünümü'};
const inventoryReportNode = {id:'inventory-report',label:'Üretim / stok',symbol:'Ü',type:'inventory-report',permission:'inventory.read',description:'Stok ve üretim görünümü'};
const externalOperationsNode = {id:'external-operations',label:'Dış işlem onayları',symbol:'D',type:'external-operations',permission:'settings.write',description:'Harici sistemlere gidecek işlemler'};
const pendingOrdersNode = {id:'pending-orders',label:'Bekleyen siparişler',symbol:'S',type:'orders',orderStatuses:['open'],permission:'orders.read',description:'İşlem bekleyen açık siparişler'};
const pendingTasksNode = {id:'pending-tasks',label:'Bekleyen işler',symbol:'İ',type:'tasks',taskStatuses:['pending','in_progress','blocked'],permission:'tasks.read',description:'Bekleyen, devam eden ve engelli görevler'};
const pendingPaymentsNode = {id:'pending-payments',label:'Bekleyen ödemeler',symbol:'Ö',type:'invoices',invoiceStatuses:['issued'],permission:'finance.read',writePermission:'finance.write',description:'Tahsilat bekleyen faturalar'};
const pendingShipmentsNode = {id:'pending-shipments',label:'Bekleyen kargolar',symbol:'K',type:'shipments',shipmentStatuses:['preparing','shipped','in_transit','exception'],permission:'shipping.read',writePermission:'shipping.write',description:'Hazırlanan, yoldaki ve sorunlu gönderiler'};

const moduleTree = [
  {id:'work-management',label:'İŞ YÖNETİMİ',symbol:'İ',type:'folder',description:'Günlük iş akışı ve görevler',children:[
    {id:'work-overview',label:'Genel durum',symbol:'G',type:'overview',description:'Canlı iş özeti'},tasksNode,notificationsNode
  ]},
  {id:'sales',label:'SATIŞ',symbol:'S',type:'folder',description:'Teklif, sipariş ve iade',children:[
    quotesNode,ordersNode,
    {id:'wholesale',label:'Toptan işler',symbol:'T',type:'unavailable',description:'Bağlantı gerekli'},
    returnsNode
  ]},
  {id:'customer-hub',label:'MÜŞTERİLER',symbol:'M',type:'folder',description:'Müşteri ilişkileri',children:[
    customersNode,
    {id:'messages',label:'Mesajlar',symbol:'M',type:'unavailable',description:'Bağlantı gerekli'},
    {id:'conversations',label:'Görüşmeler',symbol:'G',type:'unavailable',description:'Bağlantı gerekli'},
    {id:'customer-notes',label:'İç notlar',symbol:'N',type:'unavailable',description:'Bağlantı gerekli'}
  ]},
  {id:'catalog',label:'ÜRÜNLER',symbol:'Ü',type:'folder',description:'Ürün ve tasarım',children:[
    productsNode,channelProductsNode,inventoryNode,reservationsNode,stockMovementsNode,
    {id:'merchant-center',label:'Merchant Center',symbol:'M',type:'integration',providers:['google_merchant'],permission:'settings.write',description:'Ürün akışı ve sorunları'},
    {id:'designs',label:'Tasarımlar',symbol:'T',type:'unavailable',description:'Bağlantı gerekli'},
    {id:'design-revisions',label:'Revizyonlar',symbol:'R',type:'unavailable',description:'Bağlantı gerekli'}
  ]},
  {id:'production',label:'ÜRETİM',symbol:'Ü',type:'folder',description:'İş emirleri ve kalite',children:[
    productionNode,bomsNode,
    {id:'workshops',label:'Atölyeler',symbol:'A',type:'unavailable',description:'Bağlantı gerekli'},
    {id:'custom-production',label:'Özel üretim',symbol:'Ö',type:'unavailable',description:'Bağlantı gerekli'},
    {id:'quality',label:'Kalite kontrol',symbol:'K',type:'unavailable',description:'Bağlantı gerekli'}
  ]},
  {id:'supply',label:'TEDARİK',symbol:'T',type:'folder',description:'Malzeme ve dış işçilik',children:[
    materialNeedsNode,purchaseRequestsNode,
    {id:'suppliers',label:'Tedarikçiler',symbol:'T',type:'unavailable',description:'Bağlantı gerekli'},
    {id:'external-work',label:'Dış işçilik',symbol:'D',type:'unavailable',description:'Bağlantı gerekli'}
  ]},
  {id:'shipping',label:'KARGO',symbol:'K',type:'folder',description:'Paket ve teslimat',children:[
    packagesNode,shipmentsNode,trackingNode,returnedPackagesNode
  ]},
  {id:'finance',label:'MUHASEBE',symbol:'₺',type:'folder',defaultLocked:true,description:'Muhasebe ve finans',children:[
    costNode,calculatorNode,
    paymentsNode,invoicesNode,expensesNode,reconciliationNode,
    {id:'official-documents',label:'Resmî belgeler',symbol:'B',type:'unavailable',permission:'finance.read',description:'Bağlantı gerekli'}
  ]},
  {id:'web',label:'WEB',symbol:'W',type:'folder',defaultLocked:true,description:'Siteler ve dijital kanallar',children:[
    {id:'web-sites',label:'Web siteleri',symbol:'W',type:'folder',description:'Marka siteleri',children:[
      {id:'site-guner',label:'Güner Ofis',symbol:'G',type:'unavailable',description:'Site bağlantısı bekliyor'},
      {id:'site-teknik',label:'Teknik Kırtasiye',symbol:'T',type:'unavailable',description:'Site bağlantısı bekliyor'},
      {id:'site-makro',label:'Makro Ofis',symbol:'M',type:'unavailable',description:'Site bağlantısı bekliyor'}
    ]},
    {id:'web-admins',label:'Admin panelleri',symbol:'A',type:'folder',defaultLocked:true,description:'Site yönetimleri',children:[
      {id:'shopify-admin',label:'Shopify bağlantıları',symbol:'S',type:'settings',settingsView:'connections',permission:'settings.write',description:'Mağaza bağlantılarını yönet'},
      {id:'faprika-admin',label:'Faprika Panel',symbol:'F',type:'unavailable',description:'Bağlantı bekliyor'}
    ]},
    {id:'analytics',label:'Analiz',symbol:'A',type:'integration',providers:['google_analytics'],permission:'settings.write',description:'Google Analytics özeti'},
    {id:'search-console',label:'Arama görünümü',symbol:'A',type:'integration',providers:['google_search_console'],permission:'settings.write',description:'Search Console performansı'},
    {id:'tag-manager',label:'Etiketler',symbol:'E',type:'integration',providers:['google_tag_manager'],permission:'settings.write',description:'Tag Manager kapsayıcıları'},
    {id:'ads',label:'Reklam',symbol:'R',type:'folder',defaultLocked:true,description:'Reklam hesapları',children:[
      {id:'google-ads',label:'Google Ads',symbol:'G',type:'integration',providers:['google_ads'],permission:'settings.write',description:'Kampanya ve harcama bağlantısı'},
      {id:'meta-ads',label:'Meta Ads',symbol:'M',type:'url',url:'https://business.facebook.com/adsmanager/',description:'Meta reklamları'}
    ]},
    {id:'web-content',label:'İçerik',symbol:'İ',type:'unavailable',description:'İçerik çalışma alanı'},
    {id:'web-social',label:'Sosyal medya',symbol:'S',type:'unavailable',description:'Sosyal kanallar'},
    {id:'web-email',label:'E-posta',symbol:'E',type:'unavailable',description:'E-posta merkezi'},
    {id:'web-team',label:'Web ekibi',symbol:'K',type:'unavailable',defaultLocked:true,description:'Ekip erişimi'}
  ]},
  {id:'reports',label:'RAPORLAR',symbol:'R',type:'folder',description:'Satış ve operasyon özeti',children:[
    {id:'overview',label:'Genel durum',symbol:'G',type:'overview',description:'Canlı yerel özet'},
    salesReportNode,
    inventoryReportNode,
    financeSummaryNode
  ]}
];

const filesNode = {id:'files',label:'DOSYALAR',symbol:'D',type:'folder',defaultLocked:true,description:'Belgeler ve tablolar',children:[
  excelNode,{id:'drive',label:'Google Drive',symbol:'D',type:'url',url:'https://drive.google.com/',description:'Drive dosyaları'},{id:'documents',label:'Belgeler',symbol:'B',type:'unavailable',description:'Bağlantı gerekli'}
]};

const helpNode = {id:'help',label:'YARDIM',symbol:'?',type:'help',description:'Hızlı kullanım rehberi'};
const toolsNode = {id:'tools',label:'ARAÇLAR',symbol:'A',type:'folder',description:'Hızlı araçlar',children:[calculatorNode,costNode,googleNode,aiNode,visualNode,youtubeNode,excelNode,filesNode,helpNode]};
const connectionsNode = {id:'admin-connections',label:'BAĞLANTILAR',symbol:'B',type:'settings',settingsView:'connections',permission:'settings.write',description:'Hesap ve veri bağlantıları'};
const adminNode = {id:'admin',label:'YÖNETİM',symbol:'Y',type:'folder',permission:'settings.write',description:'Kullanıcı ve ayarlar',children:[
  {id:'admin-organization',label:'Organizasyon',symbol:'O',type:'settings',settingsView:'organization',permission:'settings.write',description:'Şirket, marka ve siteler'},
  {id:'admin-users',label:'Kullanıcılar',symbol:'K',type:'settings',settingsView:'users',permission:'settings.write',description:'Buton görünürlükleri'},
  {id:'admin-rules',label:'Atama kuralları',symbol:'A',type:'settings',settingsView:'rules',permission:'settings.write',description:'Yeni görev ataması'},
  externalOperationsNode
]};
const homeNode = {id:'home',label:'ANA EKRAN',symbol:'⌂',type:'home',description:'Hızlı başlangıç'};

const topNodes = moduleTree;
const leftNodes = [homeNode,pendingOrdersNode,pendingTasksNode,pendingPaymentsNode,pendingShipmentsNode];
const rightNodes = [adminNode,connectionsNode,auditNode,errorsNode,preferencesNode,toolsNode];
const nodeIndex = new Map();
function indexNode(node,parent=null) {
  if (!nodeIndex.has(node.id)) nodeIndex.set(node.id,{...node,parent});
  if (node.children) node.children.forEach(child => indexNode(child,node.id));
}
[...topNodes,...leftNodes,...rightNodes].forEach(node => indexNode(node));

const item = (node,iconName) => ({node,iconName});
const topRailItems = moduleTree.map(node=>item(node,nodeIcons[node.id]));
const leftRailItems = [item(homeNode,'home'),item(pendingOrdersNode,'receipt'),item(pendingTasksNode,'check'),item(pendingPaymentsNode,'wallet'),item(pendingShipmentsNode,'truck')];
const rightRailItems = [item(adminNode,'shield'),item(connectionsNode,'link'),item(auditNode,'clock'),item(errorsNode,'help'),item(preferencesNode,'sliders'),item(toolsNode,'bolt')];

const permissionLabels = {'orders.read':'Siparişler','orders.write':'Sipariş ve iade işlemleri','tasks.read':'Görevler','tasks.update':'Görev işlemleri','customers.read':'Müşteriler','customers.write':'Müşteri düzenleme','products.read':'Ürünler','products.write':'Ürün düzenleme','inventory.read':'Stok','inventory.write':'Stok ve satın alma işlemleri','production.read':'Üretim','production.write':'Üretim işlemleri','quotes.read':'Teklifler','quotes.write':'Teklif düzenleme','shipping.read':'Kargo','shipping.write':'Kargo işlemleri','finance.read':'Finans','finance.summary':'Muhasebe özeti','finance.write':'Finans işlemleri','audit.read':'Denetim','notifications.read':'Bildirimler','preferences.write':'Kişiselleştirme','settings.write':'Yönetim'};

function showToast(message,error=false) {
  const toast=$('#toast'); toast.textContent=message; toast.className=`toast show${error?' error':''}`;
  clearTimeout(showToast.timer); showToast.timer=setTimeout(()=>{toast.className='toast';},3200);
}

async function api(path,options={}) {
  const response=await fetch(path,{...options,headers:{...(state.token?{Authorization:`Bearer ${state.token}`}:{}) ,...(state.passwordsDisabled&&state.localUser?{'X-Local-User':state.localUser}:{}),...(options.body?{'Content-Type':'application/json'}:{}),...options.headers}});
  let result={}; try { result=await response.json(); } catch { result={error:'Sunucudan geçersiz yanıt alındı'}; }
  if (!response.ok) { if (response.status===401&&state.identity) logout('Oturumunuz sona erdi.'); throw Object.assign(new Error(result.error||'İşlem tamamlanamadı'),{status:response.status}); }
  return result;
}

function has(permission,brand=state.brand) {
  return !!state.identity?.grants.some(grant=>(grant.brand==='*'||grant.brand===brand)&&(grant.permission==='*'||grant.permission===permission));
}
function fullAccess() { return has('*'); }
function simpleDesk() { return !!state.identity && !fullAccess(); }
function permissionLocked(node) {
  if (!node.permission) return false;
  return ![node.permission, ...(node.alsoPermissions ?? [])].some(permission => has(permission));
}
function canSee(node) {
  if (!node) return false;
  if (fullAccess()) return hasUsableContent(node);
  if (node.type === 'folder') return (node.children || []).some(child => canSee(nodeIndex.get(child.id) || child));
  return !!node.permission && !permissionLocked(node);
}
function roleLabel() {
  if (fullAccess()) return 'Yönetici';
  const parts = [];
  if (has('orders.read')) parts.push('Siparişler');
  if (has('finance.summary') || has('finance.read')) parts.push('Muhasebe özeti');
  return parts.join(' · ') || 'Ekip üyesi';
}
function featureLocked(node) {
  if (state.passwordsDisabled) return false;
  if (node.id==='home') return false;
  if (state.access.has(node.id)) return !state.access.get(node.id);
  return !!node.defaultLocked;
}
function nodeLocked(node) { return permissionLocked(node)||featureLocked(node); }

function logout(message='') {
  if (state.passwordsDisabled) { showToast(message||'Yerel oturum kullanılamıyor.',true); return; }
  sessionStorage.removeItem('orchestra.token'); sessionStorage.removeItem('orchestra.brand');
  state.token=''; state.identity=null; state.brand=''; state.access=new Map();
  document.documentElement.dataset.desk='full';
  $('#app-shell').classList.add('hidden'); $('#login-screen').classList.remove('hidden'); $('#token').value=''; $('#login-error').textContent=message; $('#token').focus();
}

async function enterApp(token) {
  state.token=token;
  const [identity,access,preferences]=await Promise.all([api('/api/me'),api('/api/feature-access'),api('/api/preferences')]);
  state.identity=identity; state.access=new Map(access.items.map(item=>[item.feature,!!item.unlocked])); state.preferences=new Map(preferences.items.map(item=>[item.pref_key,item.value])); state.hiddenModules=new Set(state.preferences.get('hidden_modules')??[]); applyDensity();
  if (token) sessionStorage.setItem('orchestra.token',token); else sessionStorage.removeItem('orchestra.token');
  const hadBrand=!!state.brand&&identity.brands.includes(state.brand);
  if (!hadBrand) state.brand=identity.brands[0]||'';
  if (state.brand) sessionStorage.setItem('orchestra.brand',state.brand);
  $('#login-screen').classList.add('hidden'); $('#app-shell').classList.remove('hidden');
  document.documentElement.dataset.desk=simpleDesk()?'simple':'full';
  $('#user-name').textContent=identity.user.name; $('#user-avatar').textContent=identity.user.name.trim().charAt(0).toLocaleUpperCase('tr-TR')||'K';
  $('#user-role').textContent=roleLabel();
  renderBrandOptions(); await chooseSimpleBrand(hadBrand); renderRails(); goHome(); setTimeout(maybeShowWelcome,120);
}
async function chooseSimpleBrand(hadBrand) {
  if (!simpleDesk()||hadBrand) return;
  const brands=state.identity?.brands??[];
  let best=state.brand,bestTotal=-1;
  for (const brand of brands) {
    try {
      const items=(await api(`/api/orders?brand=${encodeURIComponent(brand)}&limit=100`)).items??[];
      const total=items.reduce((sum,order)=>order.status==='cancelled'?sum:sum+(Number(order.grand_total)||0),0);
      if (total>bestTotal) { bestTotal=total; best=brand; }
    } catch {}
  }
  if (!best) return;
  state.brand=best; sessionStorage.setItem('orchestra.brand',best); renderBrandOptions();
}

function renderBrandOptions() {
  const select=$('#brand-select');
  if (!state.identity.brands.length) { select.innerHTML='<option value="">Marka yok</option>'; select.disabled=true; return; }
  select.disabled=false; select.innerHTML=state.identity.brands.map(brand=>`<option value="${escapeHtml(brand)}"${brand===state.brand?' selected':''}>${escapeHtml(brand)}</option>`).join('');
}

function hasUsableContent(node) {
  if(node.type==='unavailable')return true;
  if(node.type!=='folder')return true;
  return (node.children||[]).some(child=>hasUsableContent(nodeIndex.get(child.id)||child));
}

function moduleButton(raw) {
  const node=raw.node||raw; const iconName=raw.iconName||'';
  const locked=nodeLocked(node); const active=state.current?.id===node.id||state.path.some(item=>item.id===node.id);
  return `<button class="module-button has-label${locked?' locked':''}${active?' active':''}" type="button" data-node="${escapeHtml(node.id)}" data-tone="${nodeTone(node)}" aria-label="${escapeHtml(node.label)}${locked?' — kilitli':''}"><span class="module-symbol">${nodeIcon(node,'ui-icon',iconName)}</span>${tileLabel(node)}${locked?lockMark():''}${buttonTip(node,permissionLocked(node)?'Yönetici yetkisi gerekli':node.description)}</button>`;
}
function renderRails() {
  const visible=items=>items.filter(raw=>{const node=raw.node||raw;return canSee(node)&&(!state.hiddenModules.has(node.id)||node.id==='home'||node.id==='tools');});
  $('#top-rail').innerHTML=visible(topRailItems).map(moduleButton).join('');
  $('#left-rail').innerHTML=visible(leftRailItems).map(moduleButton).join('');
  $('#right-rail').innerHTML=visible(rightRailItems).map(moduleButton).join('');
}

function brandLabel(brand) { return ({guner:'Güner Ofis',makro:'Sümen Takımı',kutu:'Kutu',teknik:'İmalattan Sümen'})[brand]||brand; }
function workspaceIdentityControls() {
  const name=state.identity?.user?.name??'—';
  const brands=state.identity?.brands??[];
  const options=brands.map(brand=>`<option value="${escapeHtml(brand)}"${brand===state.brand?' selected':''}>${escapeHtml(brandLabel(brand))}</option>`).join('');
  return `<div class="workspace-identity"><label class="active-brand"><span>Marka</span><select data-stage-brand-select aria-label="Marka seç">${options}</select></label><button class="active-user" type="button" data-profile title="Aktif kullanıcı${state.passwordsDisabled?' — değiştirmek için tıklayın':''}"><span>${escapeHtml(name.trim().charAt(0).toLocaleUpperCase('tr-TR')||'K')}</span><strong>${escapeHtml(name)}</strong></button></div>`;
}
function openProfileDialog() {
  if(!state.passwordsDisabled)return;
  const users=state.runtimeUsers.map(user=>`<button class="profile-choice${user.id===state.identity?.user?.id?' active':''}" type="button" data-local-user="${escapeHtml(user.id)}"><span>${escapeHtml(user.name.charAt(0).toLocaleUpperCase('tr-TR'))}</span><strong>${escapeHtml(user.name)}</strong></button>`).join('');
  openDialog('Aktif kullanıcı',`<div class="profile-grid">${users}</div>`);
}
function maybeShowWelcome() {
  if (simpleDesk()) return;
  const key=`orchestra.welcome.${state.identity?.user?.id||'local'}`;
  if(localStorage.getItem(key))return;
  localStorage.setItem(key,'1');
  openDialog('Hızlı başlangıç',helpContent(true));
}
async function switchLocalUser(id) { state.localUser=id;sessionStorage.setItem('orchestra.localUser',id);closeDialog();await enterApp('');showToast('Kişisel çalışma alanı açıldı.'); }

const quickNodes = [googleNode,aiNode,visualNode,youtubeNode,excelNode,calculatorNode,costNode];
function quickDock(className='') { if (!fullAccess()) return ''; return `<div class="quick-grid${className?` ${className}`:''}">${quickNodes.map(quickButton).join('')}</div>`; }

function goHome() {
  if (!fullAccess() && has('orders.read')) {
    const orders=nodeIndex.get('orders');
    if (state.current?.id !== 'orders') return activateNode(orders);
    return loadOrders(state.current||orders);
  }
  state.current=homeNode; state.path=[]; $('#location-label').textContent='Ana ekran'; renderRails();
  $('#center-stage').innerHTML=`<div class="stage-surface home-surface">${workspaceIdentityControls()}
    <section class="home-priority" id="home-priority" aria-label="Bekleyen işler" aria-busy="true"><div class="pulse-skeleton">İş kuyruğu yükleniyor…</div></section>
    <form class="command-search" id="search-form"><div class="search-modes">${searchModeButton('google','Google’da ara',googleNode)}${searchModeButton('ai','Yapay zekâya sor',aiNode)}${searchModeButton('visual','Görsel üret',visualNode)}${searchModeButton('youtube','YouTube’da ara',youtubeNode)}${!state.passwordsDisabled&&state.searchMode!=='google'&&!featureLocked(searchNodes[state.searchMode])?`<button class="mode-button mode-lock" type="button" data-lock-node="${state.searchMode}" aria-label="Kilitle">${icon('lock')}${buttonTip({label:'Kilitle',description:'Bu aracı yeniden kilitle'})}</button>`:''}</div><div class="search-row"><input id="global-query" name="query" autocomplete="off" placeholder="${searchPlaceholder()}" required><button class="primary-button search-submit" type="submit" aria-label="Ara">${icon('search')}</button></div></form>
    ${quickDock()}
  </div>`;
  loadHomePriority();
}
async function loadHomePriority() {
  const target=$('#home-priority');
  if(!target)return;
  if(!state.brand){target.setAttribute('aria-busy','false');target.innerHTML='<div class="pulse-empty">Marka seçildiğinde iş kuyruğu burada görünür.</div>';return;}
  try {
    const {counts}=await api(`/api/overview?brand=${encodeURIComponent(state.brand)}`);
    if(state.current?.id!=='home'||target!==$('#home-priority'))return;
    const cards=[
      [pendingOrdersNode,counts.orders,'Açık sipariş'],
      [pendingTasksNode,counts.tasks,'Bekleyen iş'],
      [pendingPaymentsNode,counts.invoicesDue,'Bekleyen ödeme'],
      [pendingShipmentsNode,counts.shipping,'Bekleyen kargo']
    ].filter(([,count])=>count!==null);
    target.setAttribute('aria-busy','false');
    target.innerHTML=cards.map(([node,count,labelText])=>`<button class="priority-card" type="button" data-node="${escapeHtml(node.id)}"><span class="priority-icon">${nodeIcon(node)}</span><span><strong>${escapeHtml(count)}</strong><small>${escapeHtml(labelText)}</small></span>${icon('arrowRight')}</button>`).join('')||'<div class="pulse-empty">Görüntülenebilir iş kuyruğu yok.</div>';
  } catch(error) {
    if(target===document.querySelector('#home-priority')){target.setAttribute('aria-busy','false');target.innerHTML=`<div class="pulse-empty error">İş kuyruğu alınamadı: ${escapeHtml(error.message)}</div>`;}
  }
}
function searchModeButton(mode,text,node) { const locked=featureLocked(node); return `<button class="mode-button${state.searchMode===mode?' active':''}${locked?' locked':''}" type="button" data-node="${escapeHtml(node.id)}" data-tone="${nodeTone(node)}" data-search-mode="${mode}" aria-label="${escapeHtml(text)}${locked?' — kilitli':''}">${nodeIcon(node)}${locked?lockMark():''}${buttonTip({...node,label:text})}</button>`; }
function searchPlaceholder() { return {google:'Google’da ne arayalım?',ai:'ChatGPT’ye sorunuzu yazın',visual:'Üretmek istediğiniz görseli tarif edin',youtube:'YouTube’da ne arayalım?'}[state.searchMode]||'Ne arayalım?'; }
function quickButton(node) {
  const locked=nodeLocked(node),showLabel=!obviousBrandNodes.has(node.id); return `<button class="quick-button${showLabel?' has-label':''}${locked?' locked':''}" type="button" data-node="${escapeHtml(node.id)}" data-tone="${nodeTone(node)}" aria-label="${escapeHtml(node.label)}${locked?' — kilitli':''}"><span class="quick-symbol">${nodeIcon(node)}</span>${showLabel?tileLabel(node):''}${locked?lockMark():''}${buttonTip(node)}</button>`;
}

async function selectNode(id) {
  const node=nodeIndex.get(id); if (!node) return;
  if (permissionLocked(node)) { showToast('Bu alanı yönetici profil yetkilerinden açabilir.',true); return; }
  if (featureLocked(node)) { openUnlockDialog(node); return; }
  await activateNode(node);
}

async function activateNode(node) {
  if (node.type==='home') return goHome();
  if (node.type==='url') { window.open(node.url,'_blank','noopener'); return; }
  if (node.type==='search') { state.searchMode=node.searchMode; goHome(); $('#global-query').focus(); return; }
  if (node.type==='calculator') { openCalculator(); return; }
  if (node.type==='cost') { openCostTool(); return; }
  state.current=node; state.path=buildPath(node); $('#location-label').textContent=state.path.map(item=>item.label).join(' / '); renderRails();
  if (node.type==='folder') return renderFolder(node);
  if (node.type==='orders') return loadOrders(node);
  if (node.type==='tasks') return loadTasks(node);
  if (node.type==='resource') return loadResource(node);
  if (node.type==='channel-products') return loadChannelProducts(node);
  if (node.type==='inventory') return loadInventory(node);
  if (node.type==='reservations') return loadReservations(node);
  if (node.type==='stock-movements') return loadStockMovements(node);
  if (node.type==='returns') return loadReturns(node);
  if (node.type==='boms') return loadBoms(node);
  if (node.type==='material-needs') return loadMaterialNeeds(node);
  if (node.type==='purchase-requests') return loadPurchaseRequests(node);
  if (node.type==='shipments') return loadShipments(node);
  if (node.type==='invoices') return loadInvoices(node);
  if (node.type==='payments') return loadPayments(node);
  if (node.type==='expenses') return loadExpenses(node);
  if (node.type==='reconciliation') return loadReconciliation(node);
  if (node.type==='finance-summary') return loadFinanceSummary(node);
  if (node.type==='sales-report') return loadSalesReport(node);
  if (node.type==='inventory-report') return loadInventoryReport(node);
  if (node.type==='external-operations') return loadExternalOperations(node);
  if (node.type==='integration') return loadIntegrationDashboard(node);
  if (node.type==='production') return loadProduction(node);
  if (node.type==='overview') return loadOverview(node);
  if (node.type==='notifications') return loadNotifications(node);
  if (node.type==='audit') return loadAudit(node);
  if (node.type==='errors') return loadErrors(node);
  if (node.type==='preferences') return loadPreferences(node);
  if (node.type==='settings') return loadSettings(node);
  if (node.type==='help') return renderHelp(node);
  renderUnavailable(node);
}

function buildPath(node) {
  const result=[]; let current=node;
  while (current) { result.unshift(current); current=current.parent?nodeIndex.get(current.parent):null; }
  return result;
}
function stageHeader(node,subtitle='') {
  const back=node.parent?`data-node="${escapeHtml(node.parent)}"`:'data-home';
  const lockAction=state.passwordsDisabled?'':`<button class="stage-action lock-action" type="button" data-lock-node="${escapeHtml(node.id)}" aria-label="Klasörü kilitle">${icon('lock')}${buttonTip({label:'Kilitle',description:node.label})}</button>`;
  return `<div class="stage-header">${workspaceIdentityControls()}<div class="stage-title"><span class="stage-icon">${nodeIcon(node)}</span><h1>${escapeHtml(node.label)}</h1></div><div class="stage-actions"><button class="stage-action" type="button" ${back} aria-label="Geri">${icon('arrowLeft')}${buttonTip({label:'Geri',description:'Önceki klasör'})}</button>${lockAction}</div></div>`;
}
function renderFolder(node) {
  const children=(node.children||[]).filter(child=>canSee(nodeIndex.get(child.id)||child));
  $('#center-stage').innerHTML=`<div class="stage-surface">${stageHeader(node)}<div class="folder-grid">${children.map(folderTile).join('')}</div>${quickDock('folder-quick')}</div>`;
}
function folderTile(raw) {
  const node=nodeIndex.get(raw.id)||raw; const locked=nodeLocked(node);
  const detail=permissionLocked(node)?'Yönetici yetkisi gerekli':node.description||'Klasörü aç';
  return `<button class="folder-tile has-label${locked?' locked':''}${node.type==='unavailable'?' unavailable':''}" type="button" data-node="${escapeHtml(node.id)}" data-tone="${nodeTone(node)}" aria-label="${escapeHtml(node.label)}${locked?' — kilitli':''}"><span class="folder-icon">${nodeIcon(node)}</span>${tileLabel(node)}${node.type==='unavailable'?'<span class="availability-mark">Bağlantı</span>':''}${locked?lockMark():''}${buttonTip(node,detail)}</button>`;
}
function renderUnavailable(node) {
  $('#center-stage').innerHTML=`<div class="stage-surface">${stageHeader(node)}<div class="notice-card">${icon('plug','notice-icon')}<h2>Bağlantı gerekli</h2></div></div>`;
}
function helpContent(compact=false) {
  const cards=[
    ['grid','Bölüm seç','Üst ve yan karelerden çalışma alanını aç.'],
    ['folder','Alt klasöre gir','Ortadaki kareler ilgili işlemleri gösterir.'],
    ['users','Profilini kullan','Sol üstten kullanıcıyı değiştir; görünüm kişisel kalır.'],
    ['link','Bağlantıyı eşitle','Yönetim > Bağlantılar içinden bağlı hesabı yenile.']
  ];
  return `<div class="help-grid${compact?' compact':''}">${cards.map(([iconName,title,body])=>`<article class="help-card">${icon(iconName)}<div><strong>${title}</strong><small>${body}</small></div></article>`).join('')}</div>${compact?'<div class="welcome-action"><button class="primary-button" type="button" data-close-dialog>Başla</button></div>':''}`;
}
function renderHelp(node) {
  $('#center-stage').innerHTML=`<div class="stage-surface">${stageHeader(node)}${helpContent()}</div>`;
}

function openUnlockDialog(node) {
  openDialog('Klasör kilidi',`<p class="modal-note"><strong>${escapeHtml(node.label)}</strong> bu profilde kapalı. Ortak kilit kodunu girdiğinizde bu kullanıcı için açık kalır.</p><form id="unlock-form" class="form-grid"><input type="hidden" name="feature" value="${escapeHtml(node.id)}"><div class="full-row"><label for="unlock-pin">Kilit kodu</label><input class="pin-input" id="unlock-pin" name="pin" type="password" inputmode="numeric" maxlength="12" autocomplete="off" required></div><div class="full-row section-action"><button class="primary-button" type="submit">Kilidi aç</button></div></form>`);
  $('#unlock-pin').focus();
}
async function unlockFeature(form) {
  const data=new FormData(form); const feature=data.get('feature'); const node=nodeIndex.get(feature);
  await api(`/api/feature-access/${encodeURIComponent(feature)}/unlock`,{method:'POST',body:JSON.stringify({pin:data.get('pin')})});
  state.access.set(feature,true); closeDialog(); renderRails(); showToast(`${node?.label||'Klasör'} açıldı.`); if (node) await activateNode(node);
}
async function lockFeature(id) {
  const node=nodeIndex.get(id); await api(`/api/feature-access/${encodeURIComponent(id)}/lock`,{method:'POST'});
  state.access.set(id,false); if (state.searchMode===id) state.searchMode='google'; showToast(`${node?.label||'Klasör'} kilitlendi.`); goHome();
}

function dataSurface(node,subtitle,body) { $('#center-stage').innerHTML=`<div class="stage-surface">${stageHeader(node,subtitle)}${body}</div>`; queueMicrotask(()=>enhanceDataTables($('#center-stage'))); }
async function loadOrders(node) {
  if (!state.brand) {
    if (simpleDesk()) return paintSimpleOrders(null);
    return dataSurface(node,'','<div class="empty-state"><div><h2>Marka yok</h2><p>Yönetim klasöründen ilk marka hesabını ekleyin.</p></div></div>');
  }
  if (simpleDesk()) $('#center-stage').innerHTML='<div class="stage-surface plain-desk"><p class="plain-empty">Yükleniyor…</p></div>';
  else dataSurface(node,'Kaynaklardan alınan sipariş kopyaları','<div class="empty-state">Yükleniyor…</div>');
  const brand=state.brand;
  try {
    const all=(await api(`/api/orders?brand=${encodeURIComponent(brand)}&limit=100`)).items;
    if (state.brand!==brand||state.current?.id!==node.id) return;
    state.orders=node.orderStatuses?.length?all.filter(item=>node.orderStatuses.includes(item.status)):all;
    if (simpleDesk()) return renderSimpleOrders(brand);
    renderOrders(node);
  } catch(error) {
    if (simpleDesk()) { $('#center-stage').innerHTML=`<div class="stage-surface plain-desk"><p class="plain-empty">${escapeHtml(error.message)}</p></div>`; return; }
    renderDataError(node,error);
  }
}
function orderAddress(order) {
  const address=safeJson(order.shipping_address_json);
  if (!address) return {short:'—',full:''};
  const full=[address.name,address.company,address.address1,address.address2,address.zip,address.city,address.province,address.country].filter(Boolean).join(' · ');
  const short=[address.address1,address.city||address.province].filter(Boolean).join(', ')||full||'—';
  return {short,full};
}
function plainDate(value) {
  if (!value) return 'Tarih yok';
  const date=new Date(value);
  if (Number.isNaN(date.getTime())) return 'Tarih yok';
  return new Intl.DateTimeFormat('tr-TR',{day:'numeric',month:'long',year:'numeric'}).format(date);
}
function plainAddress(order) {
  const address=safeJson(order.shipping_address_json);
  if (!address) return 'Adres yok';
  const country=String(address.country||'').trim();
  const showCountry=country&&!/^(tr|turkey|türkiye|turkiye)$/i.test(country);
  const parts=[address.address1,address.address2,address.zip,address.city,address.province,showCountry?country:''].map(part=>String(part||'').trim()).filter(Boolean);
  const seen=new Set();
  const line=parts.filter(part=>{
    if (/^[A-ZÇĞİÖŞÜ]{5,}$/.test(part)&&parts.some(other=>other!==part&&/[a-zçğıöşü]/.test(other))) return false;
    const key=part.toLocaleLowerCase('tr-TR');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).join(', ');
  return line||'Adres yok';
}
function plainOrderTotals(orders) {
  const groups=new Map(); let cancelled=0;
  for (const order of orders) {
    if (order.status==='cancelled') { cancelled+=1; continue; }
    const currency=/^[A-Z]{3}$/.test(order.currency)?order.currency:'TRY';
    const row=groups.get(currency)||{currency,total:0};
    row.total+=Number(order.grand_total)||0;
    groups.set(currency,row);
  }
  return {groups:[...groups.values()],cancelled};
}
function plainBrandSelect() {
  const brands=state.identity?.brands??[];
  return `<select data-stage-brand-select aria-label="Marka">${brands.map(brand=>`<option value="${escapeHtml(brand)}"${brand===state.brand?' selected':''}>${escapeHtml(brandLabel(brand))}</option>`).join('')}</select>`;
}
function paintSimpleOrders(summary) {
  const name=state.identity?.user?.name??'Kullanıcı';
  const totals=plainOrderTotals(state.orders);
  const amounts=totals.groups.length?totals.groups.map(group=>`<strong>${escapeHtml(money(group.total,group.currency))}</strong>`).join(''):`<strong>${escapeHtml(money(0))}</strong>`;
  const note=totals.cancelled?`<small>${totals.cancelled} iptal toplama dahil değil.</small>`:'';
  const ledgerOn=summary&&[summary.incoming,summary.outgoing,summary.expenses,summary.receivables,summary.cashNet].some(value=>Number(value));
  const ledger=ledgerOn?`<section class="plain-totals" aria-label="Kasa">${[['Tahsilat',summary.incoming],['Ödeme',summary.outgoing],['Gider',summary.expenses],['Açık alacak',summary.receivables],['Net',summary.cashNet]].map(([title,value])=>`<article class="plain-total"><span>${title}</span><strong>${escapeHtml(money(value))}</strong></article>`).join('')}</section>`:'';
  const sorted=[...state.orders].sort((a,b)=>String(b.placed_at||'0000').localeCompare(String(a.placed_at||'0000')));
  const cards=sorted.map(order=>`<button class="plain-order" type="button" data-order-detail="${escapeHtml(order.id)}" data-status="${escapeHtml(order.status)}"><span class="plain-main"><strong>${escapeHtml(order.customer_name||'İsimsiz')}</strong><em>${escapeHtml(money(order.grand_total,order.currency))}</em></span><span class="plain-meta"><span>${escapeHtml(plainDate(order.placed_at))}${order.status==='cancelled'?' · İptal':''}</span><span>${escapeHtml(plainAddress(order))}</span></span></button>`).join('');
  $('#center-stage').innerHTML=`<div class="stage-surface plain-desk"><header class="plain-head"><h1>Siparişler</h1><div class="plain-switch">${plainBrandSelect()}<button class="plain-user" type="button" data-profile aria-label="Kullanıcı değiştir">${escapeHtml(name)}</button></div></header><p class="plain-sum"><span>Toplam</span>${amounts}${note}</p>${ledger}<div class="plain-search"><input id="order-search" type="search" placeholder="Müşteri veya adres ara" data-local-filter><span class="result-count" data-unit="sipariş">${state.orders.length} sipariş</span></div>${cards?`<div class="plain-list" data-filter-body>${cards}</div>`:'<p class="plain-empty">Bu markada sipariş yok.</p>'}</div>`;
  $('#location-label').textContent=brandLabel(state.brand)||'Siparişler';
}
async function renderSimpleOrders(brand) {
  let summary=null;
  if (has('finance.summary')||has('finance.read')) {
    try { summary=await api(`/api/finance/summary?brand=${encodeURIComponent(brand)}`); } catch { summary=null; }
  }
  if (state.brand!==brand||state.current?.type!=='orders'||!simpleDesk()) return;
  paintSimpleOrders(summary);
}
function lineMapCell(item,orderId) {
  if (item.mapping_status==='mapped') return '<span class="status fresh">Eşleşti</span>';
  const button=has('products.write')?` <button class="small-button" type="button" data-map-line="${escapeHtml(item.id)}" data-order-id="${escapeHtml(orderId)}" data-map-title="${escapeHtml(item.title)}" data-map-sku="${escapeHtml(item.sku||'')}">Eşle</button>`:'';
  return `<span class="status pending">${item.sku?'Eşleşmedi':'SKU yok'}</span>${button}`;
}
function renderOrders(node) {
  const rows=state.orders.map(order=>{const address=orderAddress(order);const unmatched=Number(order.unmatched_count)||0;return `<tr data-status="${escapeHtml(order.status)}"><td><strong>${escapeHtml(order.order_number||order.external_id)}</strong><br><span class="mono">${escapeHtml(order.account)} · v${escapeHtml(order.source_version)}</span></td><td><strong>${escapeHtml(order.customer_name||'—')}</strong></td><td>${escapeHtml(dateTime(order.placed_at))}</td><td title="${escapeHtml(address.full)}">${escapeHtml(address.short)}</td><td><strong>${escapeHtml(money(order.grand_total,order.currency))}</strong><br><span class="status ${escapeHtml(order.payment_status)}">${escapeHtml(label(order.payment_status))}</span></td><td>${escapeHtml(order.line_count)} kalem${unmatched?`<br><span class="status pending">${escapeHtml(unmatched)} eşleşmedi</span>`:''}</td><td><span class="status ${escapeHtml(order.fulfillment_status)}">${escapeHtml(label(order.fulfillment_status))}</span><br><span class="muted">${escapeHtml(order.open_task_count)} açık iş</span></td><td>${order.shipment_status?`<span class="status ${escapeHtml(order.shipment_status)}">${escapeHtml(label(order.shipment_status))}</span>`:'—'}</td><td><span class="status ${order.status==='cancelled'?'cancelled':order.stale?'stale':'fresh'}">${order.status==='cancelled'?'İptal':order.stale?'Eski veri':'Açık'}</span></td><td><button class="small-button" type="button" data-order-detail="${escapeHtml(order.id)}">Ayrıntı</button></td></tr>`;}).join('');
  dataSurface(node,'Satış kanallarından gelen ortak operasyon görünümü',state.orders.length?`<div class="toolbar"><input id="order-search" type="search" placeholder="Sipariş, müşteri, adres veya hesap ara" data-local-filter><select data-status-filter><option value="">Tüm durumlar</option><option value="open">Açık</option><option value="cancelled">İptal</option></select><span class="result-count">${state.orders.length} kayıt</span></div><div class="data-panel"><table><thead><tr><th>Sipariş</th><th>Müşteri</th><th>Tarih</th><th>Adres</th><th>Tutar / ödeme</th><th>Kalemler</th><th>Hazırlama / iş</th><th>Kargo</th><th>Durum</th><th></th></tr></thead><tbody data-filter-body>${rows}</tbody></table></div>`:'<div class="empty-state"><div><h2>Sipariş yok</h2><p>Bağlı satış kanallarından alınan siparişler burada görünecek.</p></div></div>');
}
function openPlainOrder(detail) {
  const {order,lines}=detail;
  const items=(lines||[]).map(item=>`<li><strong>${escapeHtml(item.title||'Ürün')}</strong><span>${escapeHtml(item.quantity)} adet</span><em>${escapeHtml(money(item.line_total,item.currency))}</em></li>`).join('');
  const phone=order.customer_phone?`<div><dt>Telefon</dt><dd>${escapeHtml(order.customer_phone)}</dd></div>`:'';
  openDialog(order.customer_name||'Sipariş',`<p class="plain-amount">${escapeHtml(money(order.grand_total,order.currency))}</p><dl class="plain-facts"><div><dt>Tarih</dt><dd>${escapeHtml(plainDate(order.placed_at))}${order.status==='cancelled'?' · İptal':''}</dd></div><div><dt>Adres</dt><dd>${escapeHtml(plainAddress(order))}</dd></div>${phone}<div><dt>Sipariş no</dt><dd>${escapeHtml(order.order_number||order.external_id||'—')}</dd></div></dl><h3>Ürünler</h3><ul class="plain-lines">${items||'<li>Ürün yok</li>'}</ul>`);
}
async function openOrderDetail(id) {
  const detail=await api(`/api/orders/${encodeURIComponent(id)}`);
  if (simpleDesk()) return openPlainOrder(detail);
  const {order,lines,tasks,history,shipments=[],invoices=[]}=detail;
  const lineRows=lines.map(item=>`<tr><td>${escapeHtml(item.sku||'—')}</td><td>${escapeHtml(item.title)}</td><td>${escapeHtml(item.quantity)} ${escapeHtml(item.unit)}</td><td>${escapeHtml(money(item.line_total,item.currency))}</td><td>${lineMapCell(item,order.id)}</td></tr>`).join('');
  const taskRows=tasks.map(item=>`<tr><td>${escapeHtml(label(item.kind))}</td><td>${escapeHtml(item.assignee_name||'Atanmamış')}</td><td><span class="status ${escapeHtml(item.status)}">${escapeHtml(label(item.status))}</span></td></tr>`).join('');
  const historyRows=history.map(item=>`<div class="history-row"><strong>${escapeHtml(label(item.event_type))}</strong><span>v${escapeHtml(item.source_version)} · ${escapeHtml(dateTime(item.created_at))}</span></div>`).join('');
  const demoActions=order.platform==='demo'&&has('settings.write')?`<div class="row-actions detail-actions">${order.status==='cancelled'?`<button class="small-button" type="button" data-demo-event="order.restarted" data-account="${escapeHtml(order.account)}" data-external-order="${escapeHtml(order.external_id)}">Yeniden başlat</button>`:`<button class="small-button" type="button" data-demo-edit data-account="${escapeHtml(order.account)}" data-external-order="${escapeHtml(order.external_id)}" data-production="${order.needs_production?'true':'false'}" data-international="${order.international?'true':'false'}">Güncelle</button><button class="small-button danger" type="button" data-demo-event="order.cancelled" data-account="${escapeHtml(order.account)}" data-external-order="${escapeHtml(order.external_id)}">İptal et</button>`}</div>`:'';
  const shipmentRows=shipments.map(item=>`<tr><td>${escapeHtml(item.carrier)}</td><td class="mono">${escapeHtml(item.tracking_number||'—')}</td><td><span class="status ${escapeHtml(item.status)}">${escapeHtml(label(item.status))}</span></td></tr>`).join('');
  const invoiceRows=invoices.map(item=>`<tr><td>${escapeHtml(item.number)}</td><td>${escapeHtml(money(item.total))} ${item.currency==='TRY'?'':escapeHtml(item.currency)}</td><td><span class="status ${escapeHtml(item.status)}">${escapeHtml(label(item.status))}</span></td></tr>`).join('');
  const address=safeJson(order.shipping_address_json),addressText=address?[address.name,address.company,address.address1,address.address2,address.zip,address.city,address.province,address.country].filter(Boolean).join(' · '):'Adres alınmadı';
  openDialog(`Sipariş ${order.order_number||order.external_id}`,`<div class="detail-summary"><span class="status ${order.status==='cancelled'?'cancelled':'fresh'}">${order.status==='cancelled'?'İptal':'Açık'}</span><span>${escapeHtml(order.account)} · v${escapeHtml(order.source_version)}</span>${demoActions}</div><div class="detail-metrics"><article><small>Toplam</small><strong>${escapeHtml(money(order.grand_total,order.currency))}</strong></article><article><small>Ödeme</small><strong>${escapeHtml(label(order.payment_status))}</strong></article><article><small>Hazırlama</small><strong>${escapeHtml(label(order.fulfillment_status))}</strong></article><article><small>Sipariş tarihi</small><strong>${escapeHtml(dateTime(order.placed_at))}</strong></article></div><section class="detail-contact"><div><small>Müşteri</small><strong>${escapeHtml(order.customer_name||'—')}</strong><span>${escapeHtml(order.customer_email||order.customer_phone||'İletişim alınmadı')}</span></div><div><small>Teslimat</small><span>${escapeHtml(addressText)}</span></div></section><h3>Kalemler</h3><div class="data-panel compact"><table><thead><tr><th>SKU</th><th>Ürün</th><th>Miktar</th><th>Tutar</th><th>Eşleme</th></tr></thead><tbody>${lineRows||'<tr><td colspan="5">Kalem yok</td></tr>'}</tbody></table></div><h3>Görevler</h3><div class="data-panel compact"><table><thead><tr><th>İş</th><th>Atanan</th><th>Durum</th></tr></thead><tbody>${taskRows||'<tr><td colspan="3">Görev yok</td></tr>'}</tbody></table></div><h3>Kargo</h3><div class="data-panel compact"><table><thead><tr><th>Firma</th><th>Takip</th><th>Durum</th></tr></thead><tbody>${shipmentRows||'<tr><td colspan="3">Gönderi yok</td></tr>'}</tbody></table></div><h3>Finans</h3><div class="data-panel compact"><table><thead><tr><th>Fatura</th><th>Tutar</th><th>Durum</th></tr></thead><tbody>${invoiceRows||'<tr><td colspan="3">Fatura yok</td></tr>'}</tbody></table></div><h3>Geçmiş</h3><div class="history-list">${historyRows||'<p class="muted">Geçmiş yok.</p>'}</div>`);
}

let channelCatalog={brand:'',query:'',items:[],total:0},channelRequest=0,channelQueryTimer=0;
async function loadChannelProducts(node,options={}) {
  if(!state.brand)return dataSurface(node,'','<div class="empty-state">Marka seçin.</div>');
  const same=channelCatalog.brand===state.brand;
  const query=options.query!==undefined?options.query:(same?channelCatalog.query:'');
  const append=options.append===true&&same&&channelCatalog.query===query;
  const offset=append?channelCatalog.items.length:0;
  const request=++channelRequest;
  const brand=state.brand;
  if(!append&&!channelCatalog.items.length)dataSurface(node,'Satış kanallarındaki ürün ve varyantlar','<div class="empty-state">Yükleniyor…</div>');
  try {
    const page=await api(`/api/channel-products?brand=${encodeURIComponent(brand)}&limit=100&offset=${offset}&q=${encodeURIComponent(query)}`);
    if(request!==channelRequest||state.brand!==brand||state.current?.id!==node.id)return;
    const live=document.activeElement?.matches?.('[data-channel-search]')?document.activeElement:null;
    const items=append?channelCatalog.items.concat(page.items):page.items;
    const total=Number.isFinite(Number(page.total))?Number(page.total):items.length;
    channelCatalog={brand,query,items,total};
    const rows=items.map(item=>`<tr><td><strong>${escapeHtml(item.title)}</strong><br><span class="muted">${escapeHtml(item.vendor||item.product_type||'—')}</span></td><td>${escapeHtml(item.account_label)}<br><span class="status fresh">${escapeHtml(item.platform)}</span></td><td class="mono">${escapeHtml(item.skus||'—')}</td><td>${escapeHtml(item.variant_count)}</td><td>${escapeHtml(item.inventory_quantity)}</td><td><span class="status ${Number(item.mapped_variant_count)===Number(item.variant_count)&&Number(item.variant_count)>0?'fresh':'pending'}">${escapeHtml(Number(item.mapped_variant_count)||0)}/${escapeHtml(item.variant_count)}</span></td><td><button class="small-button" type="button" data-channel-product-detail="${escapeHtml(item.id)}">Varyantlar</button></td></tr>`).join('');
    const fieldValue=live?live.value:query;
    const caret=live?live.selectionStart:null;
    const more=items.length<total?'<button class="small-button" type="button" data-channel-more>Sonraki ürünler</button>':'';
    const table=rows?'<div class="data-panel"><table><thead><tr><th>Ürün</th><th>Kanal</th><th>SKU</th><th>Varyant</th><th>Mağaza stoğu</th><th>Eşleme</th><th></th></tr></thead><tbody data-filter-body>'+rows+'</tbody></table></div>':'<div class="empty-state"><div><h2>'+(query?'Sonuç yok':'Mağaza ürünü yok')+'</h2><p>'+(query?'Bu aramaya uyan mağaza ürünü yok.':'Shopify hesabı eşitlendiğinde ürün ve varyantlar burada görünür.')+'</p></div></div>';
    dataSurface(node,'Satış kanallarındaki ürün ve varyantlar','<div class="toolbar"><input type="search" placeholder="Ürün, SKU veya marka ara" data-channel-search value="'+escapeHtml(fieldValue)+'">'+more+'<span class="result-count">'+escapeHtml(items.length)+' / '+escapeHtml(total)+' ürün</span></div>'+table);
    if(live)queueMicrotask(()=>{const input=document.querySelector('[data-channel-search]');if(!input)return;input.focus();if(caret!=null)input.setSelectionRange(caret,caret);});
  } catch(error){if(request===channelRequest)renderDataError(node,error);}
}

async function openChannelProductDetail(id) {
  const {product,variants}=await api(`/api/channel-products/${encodeURIComponent(id)}`);
  const rows=variants.map(item=>`<tr><td><strong>${escapeHtml(item.title)}</strong></td><td class="mono">${escapeHtml(item.sku||'—')}</td><td>${escapeHtml(money(item.price,item.currency))}</td><td>${escapeHtml(item.inventory_quantity??'—')}</td><td>${item.local_product_id?`<span class="status fresh">${escapeHtml(item.local_product_sku)} · ${escapeHtml(item.local_product_name)}</span>`:has('products.write')?`<button class="small-button" type="button" data-map-variant="${escapeHtml(item.external_id)}" data-map-account="${escapeHtml(item.account_id)}" data-map-title="${escapeHtml(item.title)}" data-map-sku="${escapeHtml(item.sku||'')}">Eşle</button>`:'<span class="status pending">Eşleşmedi</span>'}</td></tr>`).join('');
  openDialog(product.title,`<div class="detail-summary"><span>${escapeHtml(product.account_label)} · ${escapeHtml(product.platform)}</span><span class="status fresh">${escapeHtml(label(product.status))}</span></div><div class="data-panel compact"><table><thead><tr><th>Varyant</th><th>SKU</th><th>Fiyat</th><th>Mağaza stoğu</th><th>Yerel ürün</th></tr></thead><tbody>${rows||'<tr><td colspan="5">Varyant yok</td></tr>'}</tbody></table></div>`);
}
async function openProductMappingDialog(button) {
  const products=(await api(`/api/products?brand=${encodeURIComponent(state.brand)}&limit=100`)).items;
  const title=`<p class="modal-note"><strong>${escapeHtml(button.dataset.mapTitle||'Kanal ürünü')}</strong>${button.dataset.mapSku?` · ${escapeHtml(button.dataset.mapSku)}`:''}</p>`;
  if(!products.length)return openDialog('Ürün eşle',`${title}<p>Bu markada yerel ürün yok. Eşleme için önce Yerel ürünler ekranından kayıt açın. Mağaza stoğu değişmez.</p>`);
  openDialog('Ürün eşle',`${title}<form id="product-mapping-form" class="form-grid"><input type="hidden" name="orderLineId" value="${escapeHtml(button.dataset.mapLine||'')}"><input type="hidden" name="orderId" value="${escapeHtml(button.dataset.orderId||'')}"><input type="hidden" name="accountId" value="${escapeHtml(button.dataset.mapAccount||'')}"><input type="hidden" name="externalVariantId" value="${escapeHtml(button.dataset.mapVariant||'')}"><div class="full-row"><label for="mapping-product">Yerel ürün</label><select id="mapping-product" name="productId" required><option value="">Seçin</option>${products.map(item=>`<option value="${escapeHtml(item.id)}" ${button.dataset.mapSku&&item.sku===button.dataset.mapSku?'selected':''}>${escapeHtml(item.sku)} — ${escapeHtml(item.name)}</option>`).join('')}</select></div><p class="full-row muted">Eşleme yalnız bu panelde kalır. Mağaza stoğu değişmez. Açılış stoğu sayım bekler.</p><div class="full-row section-action"><button class="primary-button" type="submit">Eşlemeyi kaydet</button></div></form>`);
}
function openDemoUpdateDialog(button) {
  openDialog('Demo siparişini güncelle',`<form id="demo-lifecycle-form" class="form-grid" data-requires-change><input type="hidden" name="account" value="${escapeHtml(button.dataset.account)}"><input type="hidden" name="orderId" value="${escapeHtml(button.dataset.externalOrder)}"><div class="full-row check-row"><label><input type="checkbox" name="needsProduction" ${button.dataset.production==='true'?'checked':''}> Üretim gerekiyor</label><label><input type="checkbox" name="international" ${button.dataset.international==='true'?'checked':''}> Yurt dışı</label></div><div class="full-row section-action"><button class="primary-button" type="submit">Güncellemeyi gönder</button></div></form>`);
}
async function sendDemoLifecycle(button) {
  button.disabled=true;
  try { const result=await api(`/api/admin/demo-orders/${encodeURIComponent(button.dataset.externalOrder)}`,{method:'PATCH',body:JSON.stringify({account:button.dataset.account,eventType:button.dataset.demoEvent})});await waitForInbox(result.inboxId);closeDialog();showToast('Sipariş olayı işlendi.');await loadOrders(ordersNode); }
  catch(error){showToast(error.message,true);button.disabled=false;}
}
async function loadResource(node) {
  if(!state.brand)return dataSurface(node,'','<div class="empty-state">Marka seçin.</div>');
  dataSurface(node,'','<div class="empty-state">Yükleniyor…</div>');
  try {
    const items=(await api(`/api/${node.resource}?brand=${encodeURIComponent(state.brand)}&limit=100`)).items;
    const add=has(node.writePermission)?`<button class="primary-button" type="button" data-domain-dialog="${escapeHtml(node.resource.slice(0,-1))}">${icon('plus')}<span>Yeni</span></button>`:'';
    let head='',rows='';
    if(node.resource==='customers') { head='<th>Ad</th><th>Tür</th><th>İletişim</th><th>Durum</th><th></th>'; rows=items.map(item=>`<tr><td><strong>${escapeHtml(item.name)}</strong></td><td>${escapeHtml(item.kind)}</td><td>${escapeHtml(item.email||item.phone||'—')}</td><td><span class="status fresh">${escapeHtml(item.status)}</span></td><td><button class="small-button" type="button" data-customer-detail="${escapeHtml(item.id)}">Ayrıntı</button></td></tr>`).join(''); }
    if(node.resource==='products') { head='<th>SKU</th><th>Ürün</th><th>Stok</th><th>Doğrulama</th>'; rows=items.map(item=>`<tr><td class="mono">${escapeHtml(item.sku)}</td><td><strong>${escapeHtml(item.name)}</strong></td><td>${escapeHtml(item.on_hand??'—')} ${escapeHtml(item.unit)}</td><td><span class="status ${item.verification_status==='verified'?'fresh':'pending'}">${item.verification_status==='verified'?'Doğrulandı':'Sayım bekliyor'}</span></td></tr>`).join(''); }
    if(node.resource==='quotes') { head='<th>Teklif</th><th>Müşteri</th><th>Tutar</th><th>Durum</th>'; rows=items.map(item=>`<tr><td><strong>${escapeHtml(item.number)}</strong><br><span class="mono">R${item.revision}</span></td><td>${escapeHtml(item.customer_name||'—')}</td><td>${escapeHtml(money(item.total))} ${item.currency==='TRY'?'':escapeHtml(item.currency)}</td><td><span class="status ${item.status==='draft'?'pending':'fresh'}">${escapeHtml(item.status)}</span></td></tr>`).join(''); }
    dataSurface(node,'',`<div class="toolbar"><input type="search" placeholder="Ara" data-local-filter><span class="result-count">${items.length} kayıt</span>${add}</div>${rows?`<div class="data-panel"><table><thead><tr>${head}</tr></thead><tbody data-filter-body>${rows}</tbody></table></div>`:'<div class="empty-state">Henüz kayıt yok.</div>'}`);
  } catch(error){renderDataError(node,error);}
}
async function openCustomerDetail(id){const {customer,identities,notes,interactions,orders}=await api(`/api/customers/${encodeURIComponent(id)}`);const orderRows=orders.map(item=>`<tr><td>${escapeHtml(item.order_number||item.external_id)}</td><td>${escapeHtml(item.account_id)}</td><td>${escapeHtml(money(item.grand_total,item.currency))}</td><td><span class="status ${item.status==='open'?'fresh':'cancelled'}">${escapeHtml(label(item.status))}</span></td></tr>`).join('');const timeline=[...notes.map(item=>({time:item.created_at,title:item.pinned?'Sabit not':'Not',body:item.body,who:item.created_by_name})),...interactions.map(item=>({time:item.occurred_at,title:`${label(item.kind)} · ${label(item.direction)}`,body:item.summary,who:item.created_by_name}))].sort((a,b)=>String(b.time).localeCompare(String(a.time))).map(item=>`<div class="history-row"><div><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.body)}</small></div><span>${escapeHtml(item.who||'—')} · ${escapeHtml(dateTime(item.time))}</span></div>`).join('');openDialog(customer.name,`<div class="detail-summary"><span class="status fresh">${escapeHtml(label(customer.kind))}</span><span>${escapeHtml(customer.email||'—')} · ${escapeHtml(customer.phone||'—')}</span></div>${has('customers.write')?`<div class="row-actions detail-actions"><button class="small-button" type="button" data-customer-note="${escapeHtml(customer.id)}">Not ekle</button><button class="small-button" type="button" data-customer-interaction="${escapeHtml(customer.id)}">Görüşme kaydet</button></div>`:''}<h3>Siparişler</h3><div class="data-panel compact"><table><thead><tr><th>Sipariş</th><th>Kanal</th><th>Tutar</th><th>Durum</th></tr></thead><tbody>${orderRows||'<tr><td colspan="4">Sipariş yok</td></tr>'}</tbody></table></div><h3>Geçmiş</h3><div class="history-list">${timeline||'<p class="muted">Müşteri geçmişi yok.</p>'}</div>${identities.length?`<p class="muted">${escapeHtml(identities.length)} bağlı kanal kimliği</p>`:''}`);}
function openCustomerNoteDialog(customerId){openDialog('Müşteri notu',`<form id="customer-note-form" class="form-grid"><input type="hidden" name="customerId" value="${escapeHtml(customerId)}"><div class="full-row"><label for="customer-note-body">Not</label><textarea id="customer-note-body" name="body" rows="4" maxlength="2000" required></textarea></div><div class="full-row check-row"><label><input type="checkbox" name="pinned"> Üstte tut</label></div><div class="full-row section-action"><button class="primary-button" type="submit">Notu kaydet</button></div></form>`);}
function openCustomerInteractionDialog(customerId){openDialog('Görüşme kaydet',`<form id="customer-interaction-form" class="form-grid"><input type="hidden" name="customerId" value="${escapeHtml(customerId)}"><div><label for="interaction-kind">Kanal</label><select id="interaction-kind" name="kind"><option value="call">Telefon</option><option value="email">E-posta</option><option value="message">Mesaj</option><option value="meeting">Toplantı</option><option value="note">İç kayıt</option></select></div><div><label for="interaction-direction">Yön</label><select id="interaction-direction" name="direction"><option value="outgoing">Giden</option><option value="incoming">Gelen</option><option value="internal">İç kayıt</option></select></div><div class="full-row"><label for="interaction-subject">Konu</label><input id="interaction-subject" name="subject" maxlength="200"></div><div class="full-row"><label for="interaction-summary">Özet</label><textarea id="interaction-summary" name="summary" rows="4" maxlength="2000" required></textarea></div><div class="full-row section-action"><button class="primary-button" type="submit">Görüşmeyi kaydet</button></div></form>`);}
async function loadInventory(node) {
  if(!state.brand)return dataSurface(node,'','<div class="empty-state">Marka seçin.</div>');
  dataSurface(node,'','<div class="empty-state">Yükleniyor…</div>');
  try {
    const items=(await api(`/api/inventory?brand=${encodeURIComponent(state.brand)}`)).items;
    const rows=items.map(item=>`<tr><td><strong>${escapeHtml(item.name)}</strong><br><span class="mono">${escapeHtml(item.sku)}</span></td><td>${escapeHtml(item.location)}</td><td>${escapeHtml(item.on_hand)} ${escapeHtml(item.unit)}</td><td>${escapeHtml(item.reserved)} ${escapeHtml(item.unit)}</td><td><strong>${escapeHtml(item.available)} ${escapeHtml(item.unit)}</strong></td><td><span class="status ${item.verification_status==='verified'?'fresh':'pending'}">${item.verification_status==='verified'?'Doğrulandı':'Sayım bekliyor'}</span></td><td>${has(node.writePermission)?`<button class="small-button" type="button" data-domain-dialog="count" data-position="${escapeHtml(item.id)}" data-product="${escapeHtml(item.name)}">Sayım</button>`:''}</td></tr>`).join('');
    dataSurface(node,'',rows?`<div class="toolbar"><input type="search" placeholder="Stok ara" data-local-filter><span class="result-count">${items.length} konum</span></div><div class="data-panel"><table><thead><tr><th>Ürün</th><th>Konum</th><th>Mevcut</th><th>Rezerve</th><th>Kullanılabilir</th><th>Durum</th><th></th></tr></thead><tbody data-filter-body>${rows}</tbody></table></div>`:'<div class="empty-state"><div><h2>Stok kaydı yok</h2><p>Ürün eklendiğinde 1000 adet sayım bekleyen açılış oluşur.</p></div></div>');
  } catch(error){renderDataError(node,error);}
}
async function loadReservations(node) {
  if(!state.brand)return dataSurface(node,'','<div class="empty-state">Marka seçin.</div>');
  dataSurface(node,'Siparişlere ayrılmış doğrulanmış stok','<div class="empty-state">Yükleniyor…</div>');
  try{const items=(await api(`/api/inventory/reservations?brand=${encodeURIComponent(state.brand)}`)).items;const add=has(node.writePermission)?`<button class="primary-button" type="button" data-domain-dialog="reservation">${icon('plus')}<span>Stok ayır</span></button>`:'';const rows=items.map(item=>`<tr data-status="${escapeHtml(item.status)}"><td><strong>${escapeHtml(item.name)}</strong><br><span class="mono">${escapeHtml(item.sku)}</span></td><td>${escapeHtml(item.external_order_id||'Siparişsiz')}</td><td>${escapeHtml(item.quantity)} ${escapeHtml(item.unit)}</td><td>${escapeHtml(item.location)}</td><td><span class="status ${item.status==='active'?'fresh':'unknown'}">${escapeHtml(label(item.status))}</span></td><td>${item.status==='active'&&has(node.writePermission)?`<button class="small-button danger" type="button" data-release-reservation="${escapeHtml(item.id)}">Bırak</button>`:''}</td></tr>`).join('');dataSurface(node,'Siparişlere ayrılmış doğrulanmış stok',`<div class="toolbar"><input type="search" placeholder="Ürün veya sipariş ara" data-local-filter><select data-status-filter><option value="">Tümü</option><option value="active">Aktif</option><option value="released">Bırakıldı</option></select><span class="result-count">${items.length} rezervasyon</span>${add}</div>${rows?`<div class="data-panel"><table><thead><tr><th>Ürün</th><th>Sipariş</th><th>Miktar</th><th>Konum</th><th>Durum</th><th></th></tr></thead><tbody data-filter-body>${rows}</tbody></table></div>`:'<div class="empty-state"><div><h2>Rezervasyon yok</h2><p>Doğrulanmış stok siparişlere buradan ayrılır.</p></div></div>'}`);}catch(error){renderDataError(node,error);}
}
async function releaseReservation(button){button.disabled=true;try{await api(`/api/inventory/reservations/${encodeURIComponent(button.dataset.releaseReservation)}/release`,{method:'POST',body:'{}'});showToast('Stok rezervasyonu bırakıldı.');await loadReservations(reservationsNode);}catch(error){showToast(error.message,true);button.disabled=false;}}

async function loadStockMovements(node) {
  if(!state.brand)return dataSurface(node,'','<div class="empty-state">Marka seçin.</div>');
  dataSurface(node,'Değiştirilemeyen stok hareket geçmişi','<div class="empty-state">Yükleniyor…</div>');
  try{const items=(await api(`/api/inventory/movements?brand=${encodeURIComponent(state.brand)}`)).items;const rows=items.map(item=>`<tr><td>${escapeHtml(dateTime(item.created_at))}</td><td><strong>${escapeHtml(item.name)}</strong><br><span class="mono">${escapeHtml(item.sku)}</span></td><td>${escapeHtml(item.location)}</td><td>${escapeHtml(label(item.kind))}</td><td><strong>${Number(item.quantity)>0?'+':''}${escapeHtml(item.quantity)}</strong></td><td>${escapeHtml(item.before_qty)} → ${escapeHtml(item.after_qty)}</td><td>${escapeHtml(item.actor_name||item.actor)}</td></tr>`).join('');dataSurface(node,'Değiştirilemeyen stok hareket geçmişi',`<div class="toolbar"><input type="search" placeholder="Ürün, işlem veya kullanıcı ara" data-local-filter><span class="result-count">${items.length} hareket</span></div>${rows?`<div class="data-panel"><table><thead><tr><th>Tarih</th><th>Ürün</th><th>Konum</th><th>İşlem</th><th>Miktar</th><th>Önce / sonra</th><th>Kullanıcı</th></tr></thead><tbody data-filter-body>${rows}</tbody></table></div>`:'<div class="empty-state">Stok hareketi yok.</div>'}`);}catch(error){renderDataError(node,error);}
}

async function loadReturns(node) {
  if(!state.brand)return dataSurface(node,'','<div class="empty-state">Marka seçin.</div>');
  dataSurface(node,'Sipariş iade ve geri ödeme akışı','<div class="empty-state">Yükleniyor…</div>');
  try{const items=(await api(`/api/returns?brand=${encodeURIComponent(state.brand)}`)).items;const add=has(node.writePermission)?`<button class="primary-button" type="button" data-domain-dialog="return">${icon('plus')}<span>İade aç</span></button>`:'';const rows=items.map(item=>`<tr data-status="${escapeHtml(item.status)}"><td><strong>${escapeHtml(item.order_number||item.external_id)}</strong><br><span class="mono">${escapeHtml(item.account_id)}</span></td><td>${escapeHtml(item.customer_name||'—')}</td><td>${escapeHtml(item.reason||'—')}</td><td>${escapeHtml(money(item.amount,item.currency))}</td><td><span class="status ${escapeHtml(item.status)}">${escapeHtml(label(item.status))}</span></td><td><div class="row-actions">${returnActions(item,node)}</div></td></tr>`).join('');dataSurface(node,'Sipariş iade ve geri ödeme akışı',`<div class="toolbar"><input type="search" placeholder="Sipariş veya müşteri ara" data-local-filter><select data-status-filter><option value="">Tümü</option><option value="requested">Talep</option><option value="in_progress">İşleniyor</option><option value="returned">Tamamlandı</option><option value="cancelled">İptal</option></select><span class="result-count">${items.length} iade</span>${add}</div>${rows?`<div class="data-panel"><table><thead><tr><th>Sipariş</th><th>Müşteri</th><th>Neden</th><th>Tutar</th><th>Durum</th><th></th></tr></thead><tbody data-filter-body>${rows}</tbody></table></div>`:'<div class="empty-state"><div><h2>İade yok</h2><p>İade talepleri siparişe bağlı olarak burada yönetilir.</p></div></div>'}`);}catch(error){renderDataError(node,error);}
}
function returnActions(item,node){if(!has(node.writePermission))return'';const next={requested:[['in_progress','İşleme al'],['cancelled','İptal']],in_progress:[['returned','Teslim al'],['cancelled','İptal']]}[item.status]||[];return next.map(([status,text])=>`<button class="small-button${status==='cancelled'?' danger':''}" type="button" data-return="${escapeHtml(item.id)}" data-status="${status}">${text}</button>`).join('');}
async function updateReturn(button){button.disabled=true;try{await api(`/api/returns/${encodeURIComponent(button.dataset.return)}`,{method:'PATCH',body:JSON.stringify({status:button.dataset.status})});showToast('İade durumu güncellendi.');await loadReturns(returnsNode);}catch(error){showToast(error.message,true);button.disabled=false;}}

async function loadBoms(node){if(!state.brand)return dataSurface(node,'','<div class="empty-state">Marka seçin.</div>');dataSurface(node,'Ürün ve malzeme reçeteleri','<div class="empty-state">Yükleniyor…</div>');try{const items=(await api(`/api/boms?brand=${encodeURIComponent(state.brand)}`)).items;const add=has(node.writePermission)?`<button class="primary-button" type="button" data-domain-dialog="bom">${icon('plus')}<span>Reçete ekle</span></button>`:'';const rows=items.map(item=>`<tr><td><strong>${escapeHtml(item.code)}</strong><br><span class="mono">R${escapeHtml(item.revision)}</span></td><td>${escapeHtml(item.sku)} · ${escapeHtml(item.name)}</td><td>${escapeHtml(item.quantity)}</td><td>${escapeHtml(item.line_count)} malzeme</td><td><span class="status ${escapeHtml(item.status)}">${escapeHtml(label(item.status))}</span></td></tr>`).join('');dataSurface(node,'Ürün ve malzeme reçeteleri',`<div class="toolbar"><input type="search" placeholder="Reçete veya ürün ara" data-local-filter><span class="result-count">${items.length} reçete</span>${add}</div>${rows?`<div class="data-panel"><table><thead><tr><th>Reçete</th><th>Mamul</th><th>Çıktı miktarı</th><th>İçerik</th><th>Durum</th></tr></thead><tbody data-filter-body>${rows}</tbody></table></div>`:'<div class="empty-state">Henüz ürün reçetesi yok.</div>'}`);}catch(error){renderDataError(node,error);}}

async function loadMaterialNeeds(node){if(!state.brand)return dataSurface(node,'','<div class="empty-state">Marka seçin.</div>');dataSurface(node,'Açık üretim işlerinden hesaplanan ihtiyaç','<div class="empty-state">Yükleniyor…</div>');try{const items=(await api(`/api/material-needs?brand=${encodeURIComponent(state.brand)}`)).items;const rows=items.map(item=>`<tr data-status="${Number(item.shortage)>0?'shortage':'ready'}"><td><strong>${escapeHtml(item.name)}</strong><br><span class="mono">${escapeHtml(item.sku)}</span></td><td>${escapeHtml(Number(item.required).toFixed(2))} ${escapeHtml(item.unit)}</td><td>${escapeHtml(Number(item.on_hand-item.reserved).toFixed(2))} ${escapeHtml(item.unit)}</td><td><span class="status ${Number(item.shortage)>0?'cancelled':'fresh'}">${Number(item.shortage)>0?`${escapeHtml(Number(item.shortage).toFixed(2))} eksik`:'Hazır'}</span></td></tr>`).join('');dataSurface(node,'Açık üretim işlerinden hesaplanan ihtiyaç',`<div class="toolbar"><input type="search" placeholder="Malzeme ara" data-local-filter><span class="result-count">${items.length} malzeme</span></div>${rows?`<div class="data-panel"><table><thead><tr><th>Malzeme</th><th>Gerekli</th><th>Kullanılabilir</th><th>Durum</th></tr></thead><tbody data-filter-body>${rows}</tbody></table></div>`:'<div class="empty-state"><div><h2>Açık ihtiyaç yok</h2><p>Aktif reçeteli üretim işi oluştuğunda ihtiyaçlar burada hesaplanır.</p></div></div>'}`);}catch(error){renderDataError(node,error);}}

async function loadPurchaseRequests(node){if(!state.brand)return dataSurface(node,'','<div class="empty-state">Marka seçin.</div>');dataSurface(node,'Malzeme ve tedarik talepleri','<div class="empty-state">Yükleniyor…</div>');try{const items=(await api(`/api/purchase-requests?brand=${encodeURIComponent(state.brand)}`)).items;const add=has(node.writePermission)?`<button class="primary-button" type="button" data-domain-dialog="purchase-request">${icon('plus')}<span>Talep oluştur</span></button>`:'';const rows=items.map(item=>`<tr data-status="${escapeHtml(item.status)}"><td><strong>${escapeHtml(item.number)}</strong><br><span class="muted">${escapeHtml(item.requested_by_name)}</span></td><td>${escapeHtml(item.supplier_name||'Belirtilmedi')}</td><td>${escapeHtml(item.line_count)} kalem</td><td>${escapeHtml(money(item.estimated_total))}</td><td><span class="status ${escapeHtml(item.priority)}">${escapeHtml(label(item.priority))}</span></td><td><span class="status ${escapeHtml(item.status)}">${escapeHtml(label(item.status))}</span></td><td><div class="row-actions">${purchaseActions(item,node)}</div></td></tr>`).join('');dataSurface(node,'Malzeme ve tedarik talepleri',`<div class="toolbar"><input type="search" placeholder="Talep veya tedarikçi ara" data-local-filter><span class="result-count">${items.length} talep</span>${add}</div>${rows?`<div class="data-panel"><table><thead><tr><th>Talep</th><th>Tedarikçi</th><th>Kalem</th><th>Tahmin</th><th>Öncelik</th><th>Durum</th><th></th></tr></thead><tbody data-filter-body>${rows}</tbody></table></div>`:'<div class="empty-state">Satın alma talebi yok.</div>'}`);}catch(error){renderDataError(node,error);}}
function purchaseActions(item,node){if(!has(node.writePermission))return'';const next={draft:['submitted','Onaya gönder'],submitted:['approved','Onayla'],approved:['ordered','Sipariş verildi'],ordered:['received','Teslim alındı']}[item.status];return next?`<button class="small-button" type="button" data-purchase="${escapeHtml(item.id)}" data-status="${next[0]}">${next[1]}</button>`:'';}
async function updatePurchase(button){button.disabled=true;try{await api(`/api/purchase-requests/${encodeURIComponent(button.dataset.purchase)}`,{method:'PATCH',body:JSON.stringify({status:button.dataset.status})});showToast('Satın alma durumu güncellendi.');await loadPurchaseRequests(purchaseRequestsNode);}catch(error){showToast(error.message,true);button.disabled=false;}}
async function loadShipments(node) {
  if(!state.brand)return dataSurface(node,'','<div class="empty-state">Marka seçin.</div>');
  dataSurface(node,'','<div class="empty-state">Yükleniyor…</div>');
  try {
    const all=(await api(`/api/shipments?brand=${encodeURIComponent(state.brand)}`)).items;
    const items=node.shipmentStatuses?.length?all.filter(item=>node.shipmentStatuses.includes(item.status)):all;
    const add=has(node.writePermission)?`<button class="primary-button" type="button" data-domain-dialog="shipment">${icon('plus')}<span>Yeni gönderi</span></button>`:'';
    const rows=items.map(item=>`<tr data-status="${escapeHtml(item.status)}"><td><strong>${escapeHtml(item.external_order_id||'Siparişsiz')}</strong><br><span class="mono">${escapeHtml(item.account_id||shortId(item.id))}</span></td><td>${escapeHtml(item.carrier)}</td><td class="mono">${escapeHtml(item.tracking_number||'—')}</td><td><span class="status ${escapeHtml(item.status)}">${escapeHtml(label(item.status))}</span></td><td>${escapeHtml(dateTime(item.updated_at))}</td><td><div class="row-actions">${shipmentActions(item,node)}</div></td></tr>`).join('');
    dataSurface(node,'',`<div class="toolbar"><input type="search" placeholder="Sipariş veya takip ara" data-local-filter><select data-status-filter><option value="">Tüm durumlar</option>${shipmentStatusesOptions()}</select><span class="result-count">${items.length} gönderi</span>${add}</div>${rows?`<div class="data-panel"><table><thead><tr><th>Sipariş</th><th>Kargo firması</th><th>Takip no</th><th>Durum</th><th>Güncelleme</th><th></th></tr></thead><tbody data-filter-body>${rows}</tbody></table></div>`:'<div class="empty-state"><div><h2>Gönderi yok</h2><p>Yeni gönderiyi bu ekrandan siparişe bağlayabilirsiniz.</p></div></div>'}`);
  } catch(error){renderDataError(node,error);}
}
function shipmentStatusesOptions(){return ['preparing','shipped','in_transit','delivered','exception','returned','cancelled'].map(value=>`<option value="${value}">${escapeHtml(label(value))}</option>`).join('');}
function shipmentActions(item,node){const detail=`<button class="small-button" type="button" data-shipment-detail="${escapeHtml(item.id)}">Ayrıntı</button>`;if(!has(node.writePermission))return detail;const next={preparing:[['shipped','Kargoya ver'],['cancelled','İptal']],shipped:[['in_transit','Yolda'],['delivered','Teslim'],['exception','Sorun']],in_transit:[['delivered','Teslim'],['exception','Sorun'],['returned','İade']],exception:[['in_transit','Devam'],['returned','İade']],delivered:[['returned','İade']]}[item.status]||[];return detail+next.map(([status,text])=>`<button class="small-button${['cancelled','returned'].includes(status)?' danger':''}" type="button" data-shipment="${escapeHtml(item.id)}" data-status="${status}">${text}</button>`).join('');}
async function updateShipment(button){button.disabled=true;try{await api(`/api/shipments/${encodeURIComponent(button.dataset.shipment)}`,{method:'PATCH',body:JSON.stringify({status:button.dataset.status})});showToast('Kargo durumu güncellendi.');await loadShipments(state.current?.type==='shipments'?state.current:shipmentsNode);}catch(error){showToast(error.message,true);button.disabled=false;}}
async function openShipmentDetail(id){const {shipment,packages,events,history}=await api(`/api/shipments/${encodeURIComponent(id)}`);const timeline=[...events.map(item=>({time:item.occurred_at,status:item.status,note:[item.description,item.location].filter(Boolean).join(' · '),source:'Taşıyıcı'})),...history.map(item=>({time:item.created_at,status:item.status,note:item.note,source:'Orkestra'}))].sort((a,b)=>String(b.time).localeCompare(String(a.time))).map(item=>`<div class="history-row"><div><strong>${escapeHtml(label(item.status))}</strong><small>${escapeHtml(item.note||item.source)}</small></div><span>${escapeHtml(item.source)} · ${escapeHtml(dateTime(item.time))}</span></div>`).join('');openDialog(`Gönderi ${shipment.tracking_number||shortId(shipment.id)}`,`<div class="detail-metrics"><article><small>Sipariş</small><strong>${escapeHtml(shipment.order_number||shipment.external_order_id||'—')}</strong></article><article><small>Taşıyıcı</small><strong>${escapeHtml(shipment.carrier)}</strong></article><article><small>Durum</small><strong>${escapeHtml(label(shipment.status))}</strong></article><article><small>Paket</small><strong>${escapeHtml(packages.length)}</strong></article></div>${has('shipping.write')?`<div class="row-actions detail-actions"><button class="small-button" type="button" data-shipment-event="${escapeHtml(shipment.id)}">Takip olayı ekle</button></div>`:''}<h3>Hareketler</h3><div class="history-list">${timeline||'<p class="muted">Henüz takip olayı yok.</p>'}</div>`);}
function openShipmentEventDialog(shipmentId){openDialog('Takip olayı ekle',`<form id="shipment-event-form" class="form-grid"><input type="hidden" name="shipmentId" value="${escapeHtml(shipmentId)}"><div><label for="shipment-event-status">Durum</label><select id="shipment-event-status" name="status">${shipmentStatusesOptions()}</select></div><div><label for="shipment-event-location">Konum</label><input id="shipment-event-location" name="location" maxlength="200"></div><div class="full-row"><label for="shipment-event-description">Açıklama</label><textarea id="shipment-event-description" name="description" rows="3" maxlength="500"></textarea></div><div class="full-row section-action"><button class="primary-button" type="submit">Olayı kaydet</button></div></form>`);}

async function loadInvoices(node) {
  if(!state.brand)return dataSurface(node,'','<div class="empty-state">Marka seçin.</div>');
  dataSurface(node,'','<div class="empty-state">Yükleniyor…</div>');
  try{const all=(await api(`/api/invoices?brand=${encodeURIComponent(state.brand)}`)).items;const items=node.invoiceStatuses?.length?all.filter(item=>node.invoiceStatuses.includes(item.status)):all;const add=has(node.writePermission)?`<button class="primary-button" type="button" data-domain-dialog="invoice">${icon('plus')}<span>Yeni fatura</span></button>`:'';const rows=items.map(item=>`<tr data-status="${escapeHtml(item.status)}"><td><strong>${escapeHtml(item.number)}</strong><br><span class="mono">${escapeHtml(item.external_order_id||'Siparişsiz')}</span></td><td>${escapeHtml(item.customer_name||'—')}</td><td>${escapeHtml(money(item.total))} ${item.currency==='TRY'?'':escapeHtml(item.currency)}</td><td>${escapeHtml(money(item.paid_total))}</td><td><span class="status ${escapeHtml(item.status)}">${escapeHtml(label(item.status))}</span></td><td>${escapeHtml(item.due_at?dateTime(item.due_at):'—')}</td><td><div class="row-actions">${invoiceActions(item,node)}</div></td></tr>`).join('');dataSurface(node,'',`<div class="toolbar"><input type="search" placeholder="Fatura, sipariş veya müşteri ara" data-local-filter><select data-status-filter><option value="">Tüm durumlar</option>${['draft','issued','paid','cancelled'].map(value=>`<option value="${value}">${escapeHtml(label(value))}</option>`).join('')}</select><span class="result-count">${items.length} fatura</span>${add}</div>${rows?`<div class="data-panel"><table><thead><tr><th>Fatura</th><th>Müşteri</th><th>Tutar</th><th>Tahsilat</th><th>Durum</th><th>Vade</th><th></th></tr></thead><tbody data-filter-body>${rows}</tbody></table></div>`:'<div class="empty-state"><div><h2>Fatura yok</h2><p>İlk faturayı bu ekrandan oluşturabilirsiniz.</p></div></div>'}`);}catch(error){renderDataError(node,error);}
}
function invoiceActions(item,node){if(!has(node.writePermission))return'';const next={draft:[['issued','Kes'],['cancelled','İptal']],issued:[['paid','Ödendi'],['cancelled','İptal']]}[item.status]||[];return next.map(([status,text])=>`<button class="small-button${status==='cancelled'?' danger':''}" type="button" data-invoice="${escapeHtml(item.id)}" data-status="${status}">${text}</button>`).join('');}
async function updateInvoice(button){button.disabled=true;try{await api(`/api/invoices/${encodeURIComponent(button.dataset.invoice)}`,{method:'PATCH',body:JSON.stringify({status:button.dataset.status})});showToast('Fatura durumu güncellendi.');await loadInvoices(state.current?.type==='invoices'?state.current:invoicesNode);}catch(error){showToast(error.message,true);button.disabled=false;}}

async function loadPayments(node) {
  if(!state.brand)return dataSurface(node,'','<div class="empty-state">Marka seçin.</div>');
  dataSurface(node,'','<div class="empty-state">Yükleniyor…</div>');
  try{const items=(await api(`/api/payments?brand=${encodeURIComponent(state.brand)}`)).items;const add=has(node.writePermission)?`<button class="primary-button" type="button" data-domain-dialog="payment">${icon('plus')}<span>Ödeme kaydet</span></button>`:'';const rows=items.map(item=>`<tr data-status="${escapeHtml(item.direction)}"><td><span class="status ${item.direction==='incoming'?'fresh':'pending'}">${escapeHtml(label(item.direction))}</span></td><td><strong>${escapeHtml(money(item.amount))}</strong> ${item.currency==='TRY'?'':escapeHtml(item.currency)}</td><td>${escapeHtml(item.invoice_number||'—')}</td><td>${escapeHtml(item.customer_name||'—')}</td><td>${escapeHtml(item.method)}</td><td>${escapeHtml(item.reference||'—')}</td><td>${escapeHtml(dateTime(item.paid_at))}</td></tr>`).join('');dataSurface(node,'',`<div class="toolbar"><input type="search" placeholder="Ödeme ara" data-local-filter><select data-status-filter><option value="">Tümü</option><option value="incoming">Tahsilat</option><option value="outgoing">Ödeme</option></select><span class="result-count">${items.length} hareket</span>${add}</div>${rows?`<div class="data-panel"><table><thead><tr><th>Tür</th><th>Tutar</th><th>Fatura</th><th>Müşteri</th><th>Yöntem</th><th>Referans</th><th>Tarih</th></tr></thead><tbody data-filter-body>${rows}</tbody></table></div>`:'<div class="empty-state"><div><h2>Finans hareketi yok</h2><p>Tahsilat ve ödemeleri bu ekrandan kaydedebilirsiniz.</p></div></div>'}`);}catch(error){renderDataError(node,error);}
}
async function loadExpenses(node){
  if(!state.brand)return dataSurface(node,'','<div class="empty-state">Marka seçin.</div>');dataSurface(node,'İşletme giderleri','<div class="empty-state">Yükleniyor…</div>');
  try{const items=(await api(`/api/expenses?brand=${encodeURIComponent(state.brand)}`)).items;const add=has(node.writePermission)?`<button class="primary-button" type="button" data-domain-dialog="expense">${icon('plus')}<span>Gider kaydet</span></button>`:'';const rows=items.map(item=>`<tr data-status="${escapeHtml(item.status)}"><td><strong>${escapeHtml(item.category)}</strong><br><span class="mono">${escapeHtml(item.number||'—')}</span></td><td>${escapeHtml(item.supplier_name||'—')}</td><td><strong>${escapeHtml(money(item.amount,item.currency))}</strong></td><td>${escapeHtml(money(item.tax_amount,item.currency))}</td><td>${escapeHtml(dateTime(item.expense_at))}</td><td><span class="status ${escapeHtml(item.status)}">${escapeHtml(label(item.status))}</span></td></tr>`).join('');dataSurface(node,'İşletme giderleri',`<div class="toolbar"><input type="search" placeholder="Kategori, belge veya tedarikçi ara" data-local-filter><span class="result-count">${items.length} gider</span>${add}</div>${rows?`<div class="data-panel"><table><thead><tr><th>Kategori / belge</th><th>Tedarikçi</th><th>Tutar</th><th>Vergi</th><th>Tarih</th><th>Durum</th></tr></thead><tbody data-filter-body>${rows}</tbody></table></div>`:'<div class="empty-state">Kayıtlı gider yok.</div>'}`);}catch(error){renderDataError(node,error);}
}
async function loadReconciliation(node){
  if(!state.brand)return dataSurface(node,'','<div class="empty-state">Marka seçin.</div>');dataSurface(node,'Finans kayıtlarını karşılaştır','<div class="empty-state">Yükleniyor…</div>');
  try{const {items,openInvoices}=await api(`/api/reconciliation?brand=${encodeURIComponent(state.brand)}`);const itemRows=items.map(item=>`<tr data-status="${escapeHtml(item.status)}"><td>${escapeHtml(item.source)}</td><td>${escapeHtml(item.external_id||'—')}</td><td>${escapeHtml(money(item.source_amount??item.local_amount,item.currency))}</td><td><span class="status ${escapeHtml(item.status)}">${escapeHtml(label(item.status))}</span></td><td>${item.status!=='matched'&&has(node.writePermission)?`<button class="small-button" type="button" data-reconciliation="${escapeHtml(item.id)}">Eşleşti işaretle</button>`:''}</td></tr>`).join('');const invoiceRows=openInvoices.map(item=>`<tr><td><strong>${escapeHtml(item.number)}</strong></td><td>${escapeHtml(item.customer_name||'—')}</td><td>${escapeHtml(money(item.total,item.currency))}</td><td>${escapeHtml(money(item.paid_total,item.currency))}</td><td><strong>${escapeHtml(money(Number(item.total)-Number(item.paid_total),item.currency))}</strong></td></tr>`).join('');dataSurface(node,'Finans kayıtlarını karşılaştır',`<h3>İçe aktarılan hareketler</h3>${itemRows?`<div class="data-panel compact"><table><thead><tr><th>Kaynak</th><th>Referans</th><th>Tutar</th><th>Durum</th><th></th></tr></thead><tbody>${itemRows}</tbody></table></div>`:'<p class="muted">İçe aktarılmış banka veya muhasebe hareketi yok.</p>'}<h3>Açık faturalar</h3>${invoiceRows?`<div class="data-panel compact"><table><thead><tr><th>Fatura</th><th>Müşteri</th><th>Tutar</th><th>Tahsilat</th><th>Kalan</th></tr></thead><tbody>${invoiceRows}</tbody></table></div>`:'<p class="muted">Açık fatura yok.</p>'}`);}catch(error){renderDataError(node,error);}
}
async function resolveReconciliation(button){button.disabled=true;try{await api(`/api/reconciliation/${encodeURIComponent(button.dataset.reconciliation)}/resolve`,{method:'POST',body:'{}'});showToast('Mutabakat kaydı eşleştirildi.');await loadReconciliation(reconciliationNode);}catch(error){showToast(error.message,true);button.disabled=false;}}
async function loadFinanceSummary(node){
  if(!state.brand)return dataSurface(node,'','<div class="empty-state">Marka seçin.</div>');dataSurface(node,'Finans görünümü','<div class="empty-state">Yükleniyor…</div>');
  try{const item=await api(`/api/finance/summary?brand=${encodeURIComponent(state.brand)}`);const cards=[['Tahsilat',item.incoming,'fresh'],['Ödemeler',item.outgoing,'pending'],['Giderler',item.expenses,'cancelled'],['Açık alacak',item.receivables,'pending'],['Net nakit',item.cashNet,item.cashNet>=0?'fresh':'cancelled']].map(([title,value,tone])=>`<article class="metric-card"><span class="status ${tone}">${escapeHtml(title)}</span><strong>${escapeHtml(money(value))}</strong></article>`).join('');dataSurface(node,'Finans görünümü',`<div class="metric-grid">${cards}</div>`);}catch(error){renderDataError(node,error);}
}
async function loadSalesReport(node){
  if(!state.brand)return dataSurface(node,'','<div class="empty-state">Marka seçin.</div>');dataSurface(node,'Satış kanallarının ortak görünümü','<div class="empty-state">Yükleniyor…</div>');
  try{const {summary,channels}=await api(`/api/reports/sales?brand=${encodeURIComponent(state.brand)}`);const cards=[['Sipariş',summary.order_count],['Brüt satış',money(summary.gross_total)],['Müşteri',summary.customer_count],['Ortalama sepet',money(summary.average_total)]].map(([title,value])=>`<article class="metric-card"><strong>${escapeHtml(value)}</strong><span>${escapeHtml(title)}</span></article>`).join('');const rows=channels.map(item=>`<tr><td><strong>${escapeHtml(item.account)}</strong><br><span class="muted">${escapeHtml(label(item.platform))}</span></td><td>${escapeHtml(item.order_count)}</td><td>${escapeHtml(money(item.gross_total))}</td><td>${escapeHtml(item.cancelled_count)}</td></tr>`).join('');dataSurface(node,'Satış kanallarının ortak görünümü',`<div class="metric-grid">${cards}</div><div class="data-panel compact"><table><thead><tr><th>Kanal</th><th>Sipariş</th><th>Satış</th><th>İptal</th></tr></thead><tbody>${rows||'<tr><td colspan="4">Satış kaydı yok</td></tr>'}</tbody></table></div>`);}catch(error){renderDataError(node,error);}
}
async function loadInventoryReport(node){
  if(!state.brand)return dataSurface(node,'','<div class="empty-state">Marka seçin.</div>');dataSurface(node,'Stok ve üretim riskleri','<div class="empty-state">Yükleniyor…</div>');
  try{const {summary,attention,production}=await api(`/api/reports/inventory?brand=${encodeURIComponent(state.brand)}`);const cards=[['Ürün',summary.product_count],['Eldeki',summary.on_hand],['Ayrılan',summary.reserved],['Kullanılabilir',summary.available],['Sayım bekleyen',summary.unverified_count]].map(([title,value])=>`<article class="metric-card"><strong>${escapeHtml(value)}</strong><span>${escapeHtml(title)}</span></article>`).join('');const rows=attention.map(item=>`<tr><td><strong>${escapeHtml(item.name)}</strong><br><span class="mono">${escapeHtml(item.sku)}</span></td><td>${escapeHtml(item.location)}</td><td>${escapeHtml(item.on_hand)}</td><td>${escapeHtml(item.reserved)}</td><td><span class="status ${item.verification_status==='verified'?'cancelled':'pending'}">${item.verification_status==='verified'?escapeHtml(item.available):'Sayım bekliyor'}</span></td></tr>`).join('');const productionPills=production.map(item=>`<span class="permission-pill">${escapeHtml(label(item.status))}: ${escapeHtml(item.count)}</span>`).join('');dataSurface(node,'Stok ve üretim riskleri',`<div class="metric-grid">${cards}</div><div class="permission-pills">${productionPills}</div><h3>Dikkat gereken stoklar</h3>${rows?`<div class="data-panel compact"><table><thead><tr><th>Ürün</th><th>Konum</th><th>Eldeki</th><th>Ayrılan</th><th>Durum</th></tr></thead><tbody>${rows}</tbody></table></div>`:'<p class="muted">Dikkat gereken stok yok.</p>'}`);}catch(error){renderDataError(node,error);}
}
async function loadExternalOperations(node){
  if(!state.brand)return dataSurface(node,'','<div class="empty-state">Marka seçin.</div>');dataSurface(node,'Harici yazma işlemleri kullanıcı onayı olmadan gönderilmez','<div class="empty-state">Yükleniyor…</div>');
  try{const items=(await api(`/api/external-operations?brand=${encodeURIComponent(state.brand)}`)).items;const rows=items.map(item=>`<tr data-status="${escapeHtml(item.status)}"><td><strong>${escapeHtml(label(item.kind))}</strong><br><span class="mono">${escapeHtml(item.target_account||'—')}</span></td><td>${escapeHtml(JSON.stringify(item.summary))}</td><td><span class="status ${escapeHtml(item.status)}">${escapeHtml(label(item.status))}</span></td><td>${escapeHtml(item.confirmed_by_name||'—')}</td><td>${escapeHtml(dateTime(item.updated_at))}</td><td><div class="row-actions">${item.status==='awaiting_confirmation'?`<button class="small-button" type="button" data-external-operation="${escapeHtml(item.id)}" data-action="confirm">Onayla</button><button class="small-button danger" type="button" data-external-operation="${escapeHtml(item.id)}" data-action="cancel">İptal</button>`:item.status==='queued'?`<button class="small-button danger" type="button" data-external-operation="${escapeHtml(item.id)}" data-action="cancel">İptal</button>`:''}</div></td></tr>`).join('');dataSurface(node,'Harici yazma işlemleri kullanıcı onayı olmadan gönderilmez',`<div class="toolbar"><input type="search" placeholder="İşlem veya hesap ara" data-local-filter><select data-status-filter><option value="">Tümü</option><option value="awaiting_confirmation">Onay bekliyor</option><option value="queued">Kuyrukta</option><option value="succeeded">Tamamlandı</option><option value="failed">Hatalı</option><option value="unknown">Belirsiz</option><option value="cancelled">İptal</option></select><span class="result-count">${items.length} işlem</span></div>${rows?`<div class="data-panel"><table><thead><tr><th>İşlem</th><th>Özet</th><th>Durum</th><th>Onaylayan</th><th>Güncelleme</th><th></th></tr></thead><tbody data-filter-body>${rows}</tbody></table></div>`:'<div class="empty-state">Bekleyen dış işlem yok.</div>'}`);}catch(error){renderDataError(node,error);}
}
async function updateExternalOperation(button){button.disabled=true;try{const action=button.dataset.action;await api(`/api/external-operations/${encodeURIComponent(button.dataset.externalOperation)}/${action}`,{method:'POST',body:'{}'});showToast(action==='confirm'?'İşlem kuyruğa alındı.':'İşlem iptal edildi.');await loadExternalOperations(externalOperationsNode);}catch(error){showToast(error.message,true);button.disabled=false;}}
async function loadIntegrationDashboard(node) {
  if(!state.brand)return dataSurface(node,'','<div class="empty-state">Marka seçin.</div>');
  dataSurface(node,'','<div class="empty-state">Yükleniyor…</div>');
  try{
    const all=(await api(`/api/admin/integrations?brand=${encodeURIComponent(state.brand)}`)).items;
    const items=all.filter(item=>(node.providers||[]).includes(item.provider));
    const cards=items.map(item=>`<article class="integration-card"><div class="integration-card-head"><span class="stage-icon">${nodeIcon(nodeIndex.get(node.id)||node)}</span><div><strong>${escapeHtml(item.label)}</strong><small>${escapeHtml(item.external_account_id||item.provider)}</small></div><span class="status ${item.status==='connected'?'fresh':item.status==='error'?'cancelled':'pending'}">${escapeHtml(label(item.status))}</span></div><p>${escapeHtml(integrationSummary(item))}</p>${['google_analytics','google_search_console','google_tag_manager'].includes(item.provider)&&['connected','error'].includes(item.status)?`<button class="small-button" data-integration-sync="${escapeHtml(item.id)}" type="button">Veriyi yenile</button>`:''}</article>`).join('');
    dataSurface(node,'',cards?`<div class="integration-grid">${cards}</div>`:'<div class="notice-card"><h2>Bağlantı gerekli</h2></div>');
  }catch(error){renderDataError(node,error);}
}
async function loadProduction(node) {
  if(!state.brand)return dataSurface(node,'','<div class="empty-state">Marka seçin.</div>');
  dataSurface(node,'','<div class="empty-state">Yükleniyor…</div>');
  try {
    const items=(await api(`/api/production?brand=${encodeURIComponent(state.brand)}&limit=100`)).items;
    const add=has(node.writePermission)?`<button class="primary-button" type="button" data-domain-dialog="production">${icon('plus')}<span>Yeni</span></button>`:'';
    const rows=items.map(item=>`<tr><td><strong>${escapeHtml(item.code)}</strong><br><span class="status ${escapeHtml(item.priority)}">${escapeHtml(label(item.priority))}</span></td><td>${escapeHtml(item.product_name||'—')}</td><td>${escapeHtml(item.quantity)}</td><td>${escapeHtml(item.assignee_name||'Atanmamış')}</td><td>${escapeHtml(item.due_at?dateTime(item.due_at):'—')}</td><td><span class="status ${item.status==='completed'?'fresh':item.status==='cancelled'?'cancelled':'pending'}">${escapeHtml(label(item.status))}</span></td><td><div class="row-actions"><button class="small-button" type="button" data-production-detail="${escapeHtml(item.id)}">Ayrıntı</button>${productionActions(item,node)}</div></td></tr>`).join('');
    dataSurface(node,'',`<div class="toolbar"><input type="search" placeholder="İş emri ara" data-local-filter><span class="result-count">${items.length} kayıt</span>${add}</div>${rows?`<div class="data-panel"><table><thead><tr><th>İş emri</th><th>Ürün</th><th>Miktar</th><th>Atanan</th><th>Termin</th><th>Durum</th><th></th></tr></thead><tbody data-filter-body>${rows}</tbody></table></div>`:'<div class="empty-state">Henüz iş emri yok.</div>'}`);
  } catch(error){renderDataError(node,error);}
}
function productionActions(item,node){if(!has(node.writePermission))return'';const next={planned:['in_progress','Başlat'],in_progress:['quality_check','Kaliteye gönder'],quality_check:['completed','Tamamla']}[item.status];return next?`<button class="small-button" data-production="${escapeHtml(item.id)}" data-status="${next[0]}">${next[1]}</button>`:'';}
async function updateProduction(button){button.disabled=true;try{await api(`/api/production/${encodeURIComponent(button.dataset.production)}`,{method:'PATCH',body:JSON.stringify({status:button.dataset.status})});showToast('Üretim durumu güncellendi.');await loadProduction(productionNode);}catch(error){showToast(error.message,true);button.disabled=false;}}
async function openProductionDetail(id){const {job,operations}=await api(`/api/production/${encodeURIComponent(id)}`);const rows=operations.map(item=>`<tr><td>${escapeHtml(item.sequence)}</td><td><strong>${escapeHtml(item.name)}</strong></td><td>${escapeHtml(item.assignee_name||'Atanmamış')}</td><td><span class="status ${escapeHtml(item.status)}">${escapeHtml(label(item.status))}</span></td><td>${escapeHtml(item.actual_minutes??item.planned_minutes??'—')}</td></tr>`).join('');openDialog(`İş emri ${job.code}`,`<div class="detail-metrics"><article><small>Ürün</small><strong>${escapeHtml(job.sku||'—')} · ${escapeHtml(job.product_name||'—')}</strong></article><article><small>Miktar</small><strong>${escapeHtml(job.quantity)}</strong></article><article><small>Öncelik</small><strong>${escapeHtml(label(job.priority))}</strong></article><article><small>Termin</small><strong>${escapeHtml(job.due_at?dateTime(job.due_at):'—')}</strong></article></div><div class="data-panel compact"><table><thead><tr><th>Sıra</th><th>Operasyon</th><th>Atanan</th><th>Durum</th><th>Dakika</th></tr></thead><tbody>${rows||'<tr><td colspan="5">Operasyon yok</td></tr>'}</tbody></table></div>`);}
async function loadOverview(node){
  if(!state.brand)return dataSurface(node,'','<div class="empty-state">Marka seçin.</div>');
  dataSurface(node,'','<div class="empty-state">Yükleniyor…</div>');
  try{const {counts}=await api(`/api/overview?brand=${encodeURIComponent(state.brand)}`);const cards=[['orders','Sipariş','receipt'],['tasks','Açık iş','check'],['shipping','Aktif kargo','truck'],['invoicesDue','Açık fatura','wallet'],['customers','Müşteri','users'],['production','Üretim işi','gear']].filter(([key])=>counts[key]!==null).map(([key,title,iconName])=>`<div class="metric-card">${icon(iconName)}<strong>${counts[key]}</strong><span>${title}</span></div>`).join('');dataSurface(node,'',`<div class="metric-grid">${cards}</div>`);}catch(error){renderDataError(node,error);}
}
async function loadNotifications(node){
  if(!state.brand)return dataSurface(node,'','<div class="empty-state">Marka seçin.</div>');
  dataSurface(node,'','<div class="empty-state">Yükleniyor…</div>');
  try{const items=(await api(`/api/notifications?brand=${encodeURIComponent(state.brand)}`)).items;const list=items.map(item=>`<div class="notification-row${item.read_at?' read':''}"><div>${icon('megaphone')}<span><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.body||'')}</small></span></div>${item.read_at?'':`<button class="small-button" data-notification="${escapeHtml(item.id)}">Okundu</button>`}</div>`).join('');dataSurface(node,'',list?`<div class="notification-list">${list}</div>`:'<div class="empty-state">Yeni bildirim yok.</div>');}catch(error){renderDataError(node,error);}
}
async function readNotification(button){button.disabled=true;try{await api(`/api/notifications/${encodeURIComponent(button.dataset.notification)}/read`,{method:'POST',body:'{}'});await loadNotifications(notificationsNode);}catch(error){showToast(error.message,true);button.disabled=false;}}
async function loadTasks(node) {
  if (!state.brand) return dataSurface(node,'','<div class="empty-state"><div><h2>Marka yok</h2><p>Önce bir marka hesabı ekleyin.</p></div></div>');
  dataSurface(node,'Açık ve tamamlanan işler','<div class="empty-state">Yükleniyor…</div>');
  try { const all=(await api(`/api/tasks?brand=${encodeURIComponent(state.brand)}&limit=100`)).items; state.tasks=node.taskStatuses?.length?all.filter(item=>node.taskStatuses.includes(item.status)):all; renderTasks(node); } catch(error) { renderDataError(node,error); }
}
function renderTasks(node) {
  const rows=state.tasks.map(task=>`<tr data-status="${escapeHtml(task.status)}"><td><strong>${escapeHtml(label(task.kind))}</strong>${task.blocked_reason?`<br><span class="muted">${escapeHtml(task.blocked_reason)}</span>`:''}</td><td><button class="link-button" type="button" data-order-detail="${escapeHtml(task.order_id)}">${escapeHtml(task.external_order_id||shortId(task.order_id))}</button></td><td>${escapeHtml(task.assignee_name||task.assignee||'Atanmamış')}</td><td><span class="status ${escapeHtml(task.priority)}">${escapeHtml(label(task.priority))}</span></td><td>${escapeHtml(task.due_at?dateTime(task.due_at):'—')}</td><td><span class="status ${escapeHtml(task.status)}">${escapeHtml(label(task.status))}</span></td><td><div class="row-actions">${taskActions(task)}</div></td></tr>`).join('');
  dataSurface(node,'Açık ve tamamlanan işler',state.tasks.length?`<div class="toolbar"><input id="task-search" type="search" placeholder="Görev ara" data-local-filter><select id="task-filter" data-status-filter><option value="">Tüm durumlar</option><option value="pending">Bekliyor</option><option value="in_progress">Devam ediyor</option><option value="blocked">Engelli</option><option value="done">Tamamlandı</option><option value="cancelled">İptal</option></select><span class="result-count">${state.tasks.length} kayıt</span></div><div class="data-panel"><table><thead><tr><th>İş</th><th>Sipariş</th><th>Atanan</th><th>Öncelik</th><th>Termin</th><th>Durum</th><th></th></tr></thead><tbody data-filter-body>${rows}</tbody></table></div>`:'<div class="empty-state"><div><h2>Görev yok</h2><p>Yeni siparişten üretilen görevler burada görünür.</p></div></div>');
}
function taskActions(task) {
  if (!has('tasks.update')) return '';
  if (task.status==='pending') return `<button class="small-button" data-task="${escapeHtml(task.id)}" data-status="in_progress">Başlat</button><button class="small-button" data-task-block="${escapeHtml(task.id)}">Engelle</button><button class="small-button danger" data-task="${escapeHtml(task.id)}" data-status="cancelled">İptal</button>`;
  if (task.status==='in_progress') return `<button class="small-button" data-task="${escapeHtml(task.id)}" data-status="done">Tamamla</button><button class="small-button" data-task-block="${escapeHtml(task.id)}">Engelle</button><button class="small-button danger" data-task="${escapeHtml(task.id)}" data-status="cancelled">İptal</button>`;
  if (task.status==='blocked') return `<button class="small-button" data-task="${escapeHtml(task.id)}" data-status="in_progress">Devam et</button><button class="small-button danger" data-task="${escapeHtml(task.id)}" data-status="cancelled">İptal</button>`;
  return '';
}
async function updateTask(button) {
  button.disabled=true; try { await api(`/api/tasks/${encodeURIComponent(button.dataset.task)}`,{method:'PATCH',body:JSON.stringify({status:button.dataset.status})}); showToast('Görev durumu güncellendi.'); await loadTasks(state.current?.type==='tasks'?state.current:tasksNode); } catch(error) { showToast(error.message,true); button.disabled=false; }
}
function openTaskBlockDialog(taskId){openDialog('Görevi engelle',`<form id="task-block-form" class="form-grid"><input type="hidden" name="taskId" value="${escapeHtml(taskId)}"><div class="full-row"><label for="task-block-reason">Engel nedeni</label><textarea id="task-block-reason" name="blockedReason" rows="4" maxlength="500" required></textarea></div><div class="full-row section-action"><button class="primary-button" type="submit">Engelli olarak işaretle</button></div></form>`);}
async function reconcileAccount(button) {
  button.disabled=true;
  try {
    const result=await api(`/api/admin/accounts/${encodeURIComponent(button.dataset.reconcile)}/reconcile`,{method:'POST',body:'{}'});
    const completed=result.jobId?await waitForSyncJob(result.jobId):result;
    await Promise.all((completed.inboxIds||completed.result?.inboxIds||[]).map(waitForInbox));
    const queued=completed.result?.queued??completed.queued??0;
    showToast(`${queued} eksik olay eşitlendi.`);
    await loadSettings(nodeIndex.get('admin-connections'));
  }
  catch(error){showToast(error.message,true);button.disabled=false;}
}
async function syncIntegration(button) {
  button.disabled=true;
  try {
    const queued=await api(`/api/admin/integrations/${encodeURIComponent(button.dataset.integrationSync)}/sync`,{method:'POST',body:'{}'});
    const completed=await waitForIntegrationSyncJob(queued.jobId);
    showToast(`${label(completed.result?.dataset||'Veri')} eşitlendi.`);
    if(state.current?.type==='integration')await loadIntegrationDashboard(state.current);else await loadSettings(nodeIndex.get('admin-connections'));
  } catch(error) { showToast(error.message,true);button.disabled=false; }
}
async function loadAudit(node) {
  if (!state.brand) return dataSurface(node,'','<div class="empty-state"><div><h2>Marka yok</h2><p>Önce bir marka hesabı ekleyin.</p></div></div>');
  dataSurface(node,'Önemli değişikliklerin kaydı','<div class="empty-state">Yükleniyor…</div>');
  try { state.audit=(await api(`/api/audit?brand=${encodeURIComponent(state.brand)}&limit=100`)).items; const rows=state.audit.map(item=>`<tr><td><strong>${escapeHtml(label(item.action))}</strong></td><td>${escapeHtml(item.actor)}</td><td>${escapeHtml(dateTime(item.created_at))}</td><td class="mono">${escapeHtml(item.after_json||'—')}</td></tr>`).join(''); dataSurface(node,'Önemli değişikliklerin kaydı',rows?`<div class="data-panel"><table><thead><tr><th>İşlem</th><th>Gerçekleştiren</th><th>Zaman</th><th>Değişiklik</th></tr></thead><tbody>${rows}</tbody></table></div>`:'<div class="empty-state">Henüz kayıt yok.</div>'); } catch(error) { renderDataError(node,error); }
}
async function loadErrors(node) {
  if(!state.brand)return dataSurface(node,'','<div class="empty-state">Marka seçin.</div>');
  dataSurface(node,'','<div class="empty-state">Yükleniyor…</div>');
  try { state.errors=(await api(`/api/errors?brand=${encodeURIComponent(state.brand)}&status=all`)).items; const rows=state.errors.map(item=>`<tr><td><strong>${escapeHtml(item.code)}</strong></td><td>${escapeHtml(item.account_id||'—')}</td><td>${escapeHtml(item.message)}</td><td><span class="status ${item.status==='open'?'cancelled':'fresh'}">${item.status==='open'?'Açık':'Çözüldü'}</span></td><td>${escapeHtml(dateTime(item.created_at))}</td></tr>`).join(''); dataSurface(node,'',rows?`<div class="toolbar"><input type="search" placeholder="Hata ara" data-local-filter><span class="result-count">${state.errors.length} kayıt</span></div><div class="data-panel"><table><thead><tr><th>Kod</th><th>Hesap</th><th>Hata</th><th>Durum</th><th>Zaman</th></tr></thead><tbody data-filter-body>${rows}</tbody></table></div>`:'<div class="empty-state"><div><h2>Açık hata yok</h2><p>İşlenemeyen worker olayları burada görünür.</p></div></div>'); } catch(error){renderDataError(node,error);}
}
function customizableModuleGroups() {
  const groups=[
    {label:'Ana alanlar',items:topRailItems},
    {label:'Günlük işlemler',items:leftRailItems},
    {label:'Araçlar ve yönetim',items:rightRailItems}
  ];
  const seen=new Set();
  return groups.map(group=>({...group,items:group.items.map(raw=>raw.node||raw).filter(node=>hasUsableContent(node)&&!seen.has(node.id)&&seen.add(node.id)&&!['home','tools'].includes(node.id))})).filter(group=>group.items.length);
}
function applyDensity() { document.documentElement.dataset.density=state.preferences.get('display_density')||'comfortable'; }
function loadPreferences(node) {
  const groups=customizableModuleGroups().map(group=>`<section class="visibility-group"><h3>${escapeHtml(group.label)}</h3>${group.items.map(item=>`<div class="visibility-row"><span>${nodeIcon(item)}<strong>${escapeHtml(item.label)}</strong></span><button class="small-button" type="button" data-visibility-node="${escapeHtml(item.id)}" data-visible="${state.hiddenModules.has(item.id)?'false':'true'}">${state.hiddenModules.has(item.id)?'Göster':'Gizle'}</button></div>`).join('')}</section>`).join('');
  const density=state.preferences.get('display_density')||'comfortable';
  dataSurface(node,'',`<div class="settings-card visibility-card"><header><h2>${escapeHtml(state.identity.user.name)} görünümü</h2></header><section class="density-setting" aria-labelledby="density-title"><div><strong id="density-title">Ekran yoğunluğu</strong><small>Liste ve yönetim yüzeylerindeki bilgi aralığı</small></div><div class="density-options" role="radiogroup" aria-label="Ekran yoğunluğu"><button class="density-option${density==='comfortable'?' active':''}" type="button" role="radio" aria-checked="${density==='comfortable'}" data-density="comfortable">Rahat</button><button class="density-option${density==='compact'?' active':''}" type="button" role="radio" aria-checked="${density==='compact'}" data-density="compact">Kompakt</button></div></section><p class="muted">Menü seçimleri ve yoğunluk yalnız bu kullanıcıda değişir; yetkileri ve arka plan işlemlerini etkilemez.</p><div class="settings-list">${groups}</div></div>`);
}
async function setDensity(button) {
  const value=button.dataset.density;
  if(value===state.preferences.get('display_density'))return;
  button.disabled=true;
  try { await api('/api/preferences',{method:'PUT',body:JSON.stringify({key:'display_density',value})});state.preferences.set('display_density',value);applyDensity();loadPreferences(preferencesNode);showToast('Ekran yoğunluğu kaydedildi.'); }
  catch(error){showToast(error.message,true);button.disabled=false;}
}
async function toggleModuleVisibility(button) {
  const id=button.dataset.visibilityNode;
  if(state.hiddenModules.has(id))state.hiddenModules.delete(id);else state.hiddenModules.add(id);
  const value=[...state.hiddenModules];
  try { await api('/api/preferences',{method:'PUT',body:JSON.stringify({key:'hidden_modules',value})});state.preferences.set('hidden_modules',value);renderRails();loadPreferences(preferencesNode);showToast('Kişisel görünüm kaydedildi.'); }
  catch(error){if(state.hiddenModules.has(id))state.hiddenModules.delete(id);else state.hiddenModules.add(id);showToast(error.message,true);}
}
function renderDataError(node,error) { dataSurface(node,'',`<div class="empty-state"><div><h2>Veri alınamadı</h2><p>${escapeHtml(error.message)}</p></div></div>`); }

async function loadSettings(node) {
  const canLoad=state.brand&&has('settings.write');
  try {
    const [accounts,integrations,rules,users,organization,system]=canLoad?await Promise.all([api(`/api/admin/accounts?brand=${encodeURIComponent(state.brand)}`),api(`/api/admin/integrations?brand=${encodeURIComponent(state.brand)}`),api(`/api/admin/rules?brand=${encodeURIComponent(state.brand)}`),api(`/api/admin/users?brand=${encodeURIComponent(state.brand)}`),node.settingsView==='organization'?api('/api/admin/organization'):Promise.resolve(null),node.settingsView==='connections'?api('/api/system/status'):Promise.resolve(null)]):[{items:[]},{items:[]},{items:[]},{items:[]},null,null];
    state.settings={accounts:accounts.items,integrations:integrations.items,rules:rules.items,users:users.items,organization,system}; renderSettings(node);
  } catch(error) { renderDataError(node,error); }
}
function renderSettings(node) {
  const view=node.settingsView; const {accounts,integrations,rules,users,organization,system}=state.settings;
  if(view==='organization') {
    const brands=(organization?.brands??[]).map(item=>`<div class="settings-row"><div><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.id)} · ${escapeHtml(item.company_name||'—')}</small></div><span class="status ${item.active?'fresh':'stale'}">${item.active?'Aktif':'Pasif'}</span></div>`).join('');
    const sites=(organization?.sites??[]).map(item=>`<div class="settings-row"><div><strong>${escapeHtml(item.host)}</strong><small>${escapeHtml(item.brand_name)} · ${escapeHtml(item.purpose)}</small></div><span class="status pending">${escapeHtml(item.status)}</span></div>`).join('');
    return dataSurface(node,'',`<div class="settings-board"><section class="settings-card"><header><h2>Markalar</h2></header><div class="settings-list">${brands||'<p class="muted">Marka yok.</p>'}</div></section><section class="settings-card"><header><h2>Siteler</h2></header><div class="settings-list">${sites||'<p class="muted">Site yok.</p>'}</div></section></div>`);
  }
  if (view==='connections') {
    const list=accounts.map(item=>`<div class="settings-row"><div><strong>${escapeHtml(item.id)}</strong><small>${escapeHtml(item.shop_domain||item.platform)} · ${item.last_sync_at?dateTime(item.last_sync_at):'Henüz eşitlenmedi'}</small></div><div class="row-actions"><span class="status ${item.connection_status==='connected'?'fresh':item.connection_status==='error'?'cancelled':'pending'}">${escapeHtml(label(item.connection_status))}</span>${item.platform==='demo'||(item.platform==='shopify'&&item.shop_domain)?`<button class="small-button" data-reconcile="${escapeHtml(item.id)}" type="button">Eşitle</button>`:''}</div></div>`).join('')||'<p class="muted">Hesap yok.</p>';
    const integrationList=integrations.map(item=>`<div class="settings-row"><div><strong>${escapeHtml(item.label)}</strong><small>${escapeHtml(integrationSummary(item))}</small></div><div class="row-actions"><span class="status ${item.status==='connected'?'fresh':item.status==='error'?'cancelled':'pending'}">${escapeHtml(label(item.status))}</span>${['google_analytics','google_search_console','google_tag_manager'].includes(item.provider)&&['connected','error'].includes(item.status)?`<button class="small-button" data-integration-sync="${escapeHtml(item.id)}" type="button">Yenile</button>`:''}</div></div>`).join('')||'<p class="muted">Entegrasyon yok.</p>';
    const workerFresh=system?.worker&&Date.now()-new Date(system.worker.last_seen_at).getTime()<5000;
    const technical=`<div class="settings-row"><div><strong>API / veritabanı</strong><small>${escapeHtml(system?.database?.engine||'—')} · ${system?.database?.persistent?'kalıcı':'durum bilinmiyor'}</small></div><span class="status fresh">Çalışıyor</span></div><div class="settings-row"><div><strong>Worker</strong><small>${escapeHtml(system?.worker?.last_seen_at?dateTime(system.worker.last_seen_at):'Kalp atışı yok')}</small></div><span class="status ${workerFresh?'fresh':'cancelled'}">${workerFresh?'Çalışıyor':'Durdu'}</span></div><div class="settings-row"><div><strong>Migration</strong><small>${escapeHtml(system?.migrations?.map(item=>item.id).join(', ')||'Yok')}</small></div><span class="status ${system?.migrations?.length?'fresh':'cancelled'}">${escapeHtml(system?.migrations?.length??0)}</span></div>`;
    return dataSurface(node,'Satış hesapları ve işletme servisleri',`<div class="settings-board"><section class="settings-card"><header><h2>Entegrasyon merkezi</h2></header><div class="settings-list">${integrationList}</div></section><section class="settings-card"><header><h2>Satış hesapları</h2><button class="primary-button" data-dialog="account" type="button">Hesap ekle</button></header><div class="settings-list">${list}</div></section><section class="settings-card"><header><h2>Akışı dene</h2><button class="secondary-button" data-dialog="demo" type="button" ${accounts.some(a=>a.platform==='demo')?'':'disabled'}>Demo siparişi</button></header><p class="muted">Harici sisteme veri göndermeden sipariş ve görev akışını worker üzerinden üretir.</p></section><section class="settings-card"><header><h2>Teknik durum</h2></header><div class="settings-list">${technical}</div></section></div>`);
  }
  if (view==='rules') {
    const list=rules.map(item=>`<div class="settings-row"><div><strong>${escapeHtml(label(item.kind))}</strong><small>${escapeHtml(item.assignee_name||'Atanmamış')}</small></div></div>`).join('')||'<p class="muted">Kural yok.</p>';
    return dataSurface(node,'Yeni görevlerin ataması',`<div class="settings-board"><section class="settings-card"><header><h2>Atama kuralları</h2><button class="primary-button" data-dialog="rule" type="button">Kural ekle</button></header><div class="settings-list">${list}</div></section></div>`);
  }
  const list=users.map(user=>`<div class="settings-row"><div><strong>${escapeHtml(user.name)}</strong><small>${escapeHtml(user.id)} · ${user.active?'Aktif':'Pasif'}</small><div class="permission-pills">${user.grants.map(grant=>`<span class="permission-pill">${escapeHtml(grant.permission==='*'?'Tüm yetkiler':permissionLabels[grant.permission]||grant.permission)}</span>`).join('')}</div></div>${user.id===state.identity.user.id?'<span class="status fresh">Siz</span>':`<button class="small-button" data-dialog="edit-user" data-user="${escapeHtml(user.id)}" type="button">Düzenle</button>`}</div>`).join('')||'<p class="muted">Kullanıcı yok.</p>';
  dataSurface(node,'Menü ve işlem görünürlükleri',`<div class="settings-board"><section class="settings-card"><header><h2>Kullanıcılar</h2><button class="primary-button" data-dialog="user" type="button">Kullanıcı ekle</button></header><div class="settings-list">${list}</div></section></div>`);
}
function integrationSummary(item) {
  const snapshot=item.latestSnapshot;
  if(!snapshot)return item.capabilities.map(capability=>label(capability)).join(' · ');
  if(item.provider==='google_analytics') {
    const names=snapshot.payload.metricHeaders?.map(header=>header.name)??[],values=snapshot.payload.rows?.[0]?.metricValues?.map(value=>value.value)??[];
    const metrics=Object.fromEntries(names.map((name,index)=>[name,values[index]??'0']));
    return `7 gün · ${metrics.activeUsers??0} kullanıcı · ${metrics.sessions??0} oturum · ${metrics.screenPageViews??0} görüntüleme`;
  }
  if(item.provider==='google_search_console') {
    const rows=snapshot.payload.rows??[],clicks=Math.round(rows.reduce((total,row)=>total+(Number(row.clicks)||0),0)),impressions=Math.round(rows.reduce((total,row)=>total+(Number(row.impressions)||0),0));
    return `7 gün · ${clicks} tıklama · ${impressions} gösterim`;
  }
  if(item.provider==='google_tag_manager')return `${snapshot.payload.container?.length??0} kapsayıcı · ${dateTime(snapshot.capturedAt)}`;
  return `${label(snapshot.dataset)} · ${dateTime(snapshot.capturedAt)}`;
}

function openDialog(title,html) {
  state.dialogTrigger=document.activeElement;state.dialogDirty=false;state.dialogSubmitting=false;
  $('#dialog-title').textContent=title;$('#dialog-body').innerHTML=html;$('#app-dialog').showModal();
  queueMicrotask(()=>{enhanceDataTables($('#dialog-body'));$('#dialog-body').querySelectorAll('form[data-requires-change] [type="submit"]').forEach(button=>button.disabled=true);$('#dialog-body').querySelector('input,select,textarea,button')?.focus();});
}
function closeDialog(force=false) {
  if(state.dialogDirty&&!state.dialogSubmitting&&!force&&!window.confirm('Kaydedilmemiş değişiklikler var. Pencere kapatılsın mı?'))return false;
  if($('#app-dialog').open)$('#app-dialog').close();const trigger=state.dialogTrigger;state.dialogTrigger=null;state.dialogDirty=false;state.dialogSubmitting=false;if(trigger?.isConnected)trigger.focus();return true;
}
function showFormError(form,message) {
  let summary=form.querySelector('.form-error-summary');
  if(!summary){summary=document.createElement('div');summary.className='form-error-summary full-row';summary.setAttribute('role','alert');summary.tabIndex=-1;form.prepend(summary);}
  summary.textContent=message;summary.focus();
}
function openCalculator() {
  state.calcExpression='0'; openDialog('Hesap makinesi',`<input class="calculator-display" id="calc-display" value="0" readonly aria-label="Hesaplama"><div class="calculator-grid">${['C','⌫','÷','×','7','8','9','-','4','5','6','+','1','2','3','=','0','.'].map(key=>`<button class="calc-key${['÷','×','-','+'].includes(key)?' operator':''}${key==='='?' equals':''}" type="button" data-calc="${key}">${key}</button>`).join('')}</div>`);
}
function calculatorKey(key) {
  if (key==='C') state.calcExpression='0';
  else if (key==='⌫') state.calcExpression=state.calcExpression.length>1?state.calcExpression.slice(0,-1):'0';
  else if (key==='=') { try { state.calcExpression=String(evaluateMath(state.calcExpression)); } catch { showToast('Hesaplama tamamlanamadı.',true); } }
  else { if (state.calcExpression==='0'&&!['.','+','-','×','÷'].includes(key)) state.calcExpression=key; else state.calcExpression+=key; }
  $('#calc-display').value=state.calcExpression;
}
function evaluateMath(expression) {
  const text=expression.replaceAll('×','*').replaceAll('÷','/').replace(/\s+/g,''); let index=0;
  const number=()=>{let start=index;if(text[index]==='-')index++;while(/[0-9.]/.test(text[index]||''))index++;const value=Number(text.slice(start,index));if(!Number.isFinite(value))throw new Error();return value;};
  const term=()=>{let value=number();while(text[index]==='*'||text[index]==='/'){const op=text[index++],right=number();value=op==='*'?value*right:value/right;}return value;};
  const expr=()=>{let value=term();while(text[index]==='+'||text[index]==='-'){const op=text[index++],right=term();value=op==='+'?value+right:value-right;}return value;};
  const result=expr(); if(index!==text.length||!Number.isFinite(result))throw new Error(); return Math.round((result+Number.EPSILON)*1e10)/1e10;
}
function openCostTool() {
  openDialog('Ürün maliyet aracı',`<form id="cost-form" class="form-grid"><div><label for="cost-material">Malzeme toplamı</label><input id="cost-material" name="material" type="number" min="0" step="0.01" value="0" required></div><div><label for="cost-labor">İşçilik</label><input id="cost-labor" name="labor" type="number" min="0" step="0.01" value="0" required></div><div><label for="cost-overhead">Genel gider</label><input id="cost-overhead" name="overhead" type="number" min="0" step="0.01" value="0" required></div><div><label for="cost-shipping">Kargo / paket</label><input id="cost-shipping" name="shipping" type="number" min="0" step="0.01" value="0" required></div><div><label for="cost-waste">Fire payı %</label><input id="cost-waste" name="waste" type="number" min="0" max="100" step="0.1" value="0" required></div><div><label for="cost-profit">Kâr eklemesi %</label><input id="cost-profit" name="profit" type="number" min="0" step="0.1" value="30" required></div><div class="full-row"><label for="cost-quantity">Ürün adedi</label><input id="cost-quantity" name="quantity" type="number" min="1" step="1" value="1" required></div><div class="full-row section-action"><button class="primary-button" type="submit">Hesapla</button></div></form><div id="cost-result" role="status"></div>`);
}
function calculateCost(form) {
  const data=Object.fromEntries(new FormData(form)); const quantity=Number(data.quantity); const base=Number(data.material)+Number(data.labor)+Number(data.overhead)+Number(data.shipping); const total=base*(1+Number(data.waste)/100); const unit=total/quantity; const sale=unit*(1+Number(data.profit)/100);
  $('#cost-result').innerHTML=`<div class="cost-result"><span>Toplam maliyet: ${escapeHtml(money(total))}</span><strong>Birim maliyet ${escapeHtml(money(unit))}</strong><span>Önerilen birim satış: ${escapeHtml(money(sale))}</span></div>`;
}

async function openDomainDialog(type,button) {
  if(type==='customer') return openDialog('Müşteri ekle',`<form id="customer-form" class="form-grid"><div class="full-row"><label for="customer-name">Ad / unvan</label><input id="customer-name" name="name" required maxlength="120"></div><div><label for="customer-kind">Tür</label><select id="customer-kind" name="kind"><option value="customer">Müşteri</option><option value="dealer">Bayi</option><option value="supplier">Tedarikçi</option></select></div><div><label for="customer-email">E-posta</label><input id="customer-email" name="email" type="email"></div><div><label for="customer-phone">Telefon</label><input id="customer-phone" name="phone"></div><div class="full-row"><label for="customer-notes">Not</label><textarea id="customer-notes" name="notes" rows="3"></textarea></div><div class="full-row section-action"><button class="primary-button" type="submit">Kaydet</button></div></form>`);
  if(type==='product') return openDialog('Ürün ekle',`<form id="product-form" class="form-grid"><div><label for="product-sku">SKU</label><input id="product-sku" name="sku" required maxlength="80"></div><div><label for="product-unit">Birim</label><input id="product-unit" name="unit" value="adet" required maxlength="30"></div><div class="full-row"><label for="product-name">Ürün adı</label><input id="product-name" name="name" required maxlength="120"></div><p class="modal-note full-row">Ürün 1000 adet “sayım bekliyor” açılışla oluşturulur; doğrulanmış stok sayılmaz.</p><div class="full-row section-action"><button class="primary-button" type="submit">Kaydet</button></div></form>`);
  if(type==='count') return openDialog('Stok sayımı',`<form id="count-form" class="form-grid"><input type="hidden" name="positionId" value="${escapeHtml(button.dataset.position)}"><div class="full-row"><label for="count-value">${escapeHtml(button.dataset.product||'Ürün')} — gerçek miktar</label><input id="count-value" name="count" type="number" min="0" step="0.001" required></div><div class="full-row"><label for="count-note">Sayım notu</label><input id="count-note" name="note" maxlength="500"></div><div class="full-row section-action"><button class="primary-button" type="submit">Sayımı onayla</button></div></form>`);
  if(type==='reservation') {
    const [inventory,orders]=await Promise.all([api(`/api/inventory?brand=${encodeURIComponent(state.brand)}`),api(`/api/orders?brand=${encodeURIComponent(state.brand)}&limit=100`)]);
    const positions=inventory.items.filter(item=>item.verification_status==='verified'&&Number(item.available)>0);
    return openDialog('Stok ayır',`<form id="reservation-form" class="form-grid"><div class="full-row"><label for="reservation-position">Ürün ve konum</label><select id="reservation-position" name="positionId" required><option value="">Seçin</option>${positions.map(item=>`<option value="${escapeHtml(item.id)}">${escapeHtml(item.sku)} — ${escapeHtml(item.name)} · ${escapeHtml(item.location)} · ${escapeHtml(item.available)} kullanılabilir</option>`).join('')}</select></div><div><label for="reservation-order">Sipariş</label><select id="reservation-order" name="orderId"><option value="">Siparişsiz</option>${orders.items.filter(item=>item.status==='open').map(item=>`<option value="${escapeHtml(item.id)}">${escapeHtml(item.order_number||item.external_id)} · ${escapeHtml(item.customer_name||item.account)}</option>`).join('')}</select></div><div><label for="reservation-quantity">Miktar</label><input id="reservation-quantity" name="quantity" type="number" min="0.001" step="0.001" required></div><div class="full-row section-action"><button class="primary-button" type="submit">Stoğu ayır</button></div></form>`);
  }
  if(type==='return') {
    const orders=(await api(`/api/orders?brand=${encodeURIComponent(state.brand)}&limit=100`)).items.filter(item=>item.status==='open');
    return openDialog('İade aç',`<form id="return-form" class="form-grid"><div class="full-row"><label for="return-order">Sipariş</label><select id="return-order" name="orderId" required><option value="">Seçin</option>${orders.map(item=>`<option value="${escapeHtml(item.id)}">${escapeHtml(item.order_number||item.external_id)} · ${escapeHtml(item.customer_name||item.account)} · ${escapeHtml(money(item.grand_total,item.currency))}</option>`).join('')}</select></div><div><label for="return-amount">İade tutarı</label><input id="return-amount" name="amount" type="number" min="0" step="0.01" value="0" required></div><div><label for="return-currency">Para birimi</label><select id="return-currency" name="currency"><option value="TRY">TRY</option><option value="EUR">EUR</option><option value="USD">USD</option></select></div><div class="full-row"><label for="return-reason">Neden</label><textarea id="return-reason" name="reason" rows="3" maxlength="500"></textarea></div><div class="full-row section-action"><button class="primary-button" type="submit">İade talebi oluştur</button></div></form>`);
  }
  if(type==='bom') {
    const products=(await api(`/api/products?brand=${encodeURIComponent(state.brand)}&limit=100`)).items;
    const options=products.map(item=>`<option value="${escapeHtml(item.id)}">${escapeHtml(item.sku)} — ${escapeHtml(item.name)}</option>`).join('');
    return openDialog('Ürün reçetesi oluştur',`<form id="bom-form" class="form-grid"><div><label for="bom-code">Reçete kodu</label><input id="bom-code" name="code" required maxlength="80"></div><div><label for="bom-quantity">Mamul miktarı</label><input id="bom-quantity" name="quantity" type="number" min="0.001" step="0.001" value="1" required></div><div class="full-row"><label for="bom-product">Üretilecek ürün</label><select id="bom-product" name="productId" required><option value="">Seçin</option>${options}</select></div><div class="full-row"><label for="bom-component">Malzeme</label><select id="bom-component" name="componentProductId" required><option value="">Seçin</option>${options}</select></div><div><label for="bom-component-quantity">Malzeme miktarı</label><input id="bom-component-quantity" name="componentQuantity" type="number" min="0.001" step="0.001" required></div><div><label for="bom-waste">Fire %</label><input id="bom-waste" name="wastePercent" type="number" min="0" max="100" step="0.1" value="0" required></div><div class="full-row"><label for="bom-notes">Not</label><textarea id="bom-notes" name="notes" rows="2"></textarea></div><div class="full-row section-action"><button class="primary-button" type="submit">Reçeteyi kaydet</button></div></form>`);
  }
  if(type==='purchase-request') {
    const [products,customers]=await Promise.all([api(`/api/products?brand=${encodeURIComponent(state.brand)}&limit=100`),api(`/api/customers?brand=${encodeURIComponent(state.brand)}&limit=100`)]);
    const suppliers=customers.items.filter(item=>item.kind==='supplier');
    return openDialog('Satın alma talebi',`<form id="purchase-request-form" class="form-grid"><div><label for="purchase-number">Talep no</label><input id="purchase-number" name="number" required maxlength="80"></div><div><label for="purchase-priority">Öncelik</label><select id="purchase-priority" name="priority"><option value="normal">Normal</option><option value="high">Yüksek</option><option value="urgent">Acil</option><option value="low">Düşük</option></select></div><div><label for="purchase-supplier">Tedarikçi</label><select id="purchase-supplier" name="supplierId"><option value="">Belirtilmedi</option>${suppliers.map(item=>`<option value="${escapeHtml(item.id)}">${escapeHtml(item.name)}</option>`).join('')}</select></div><div><label for="purchase-needed">Gerekli tarih</label><input id="purchase-needed" name="neededAt" type="date"></div><div class="full-row"><label for="purchase-product">Ürün / malzeme</label><select id="purchase-product" name="productId" required><option value="">Seçin</option>${products.items.map(item=>`<option value="${escapeHtml(item.id)}">${escapeHtml(item.sku)} — ${escapeHtml(item.name)}</option>`).join('')}</select></div><div><label for="purchase-quantity">Miktar</label><input id="purchase-quantity" name="quantity" type="number" min="0.001" step="0.001" required></div><div><label for="purchase-cost">Tahmini birim maliyet</label><input id="purchase-cost" name="estimatedUnitCost" type="number" min="0" step="0.01"></div><div class="full-row"><label for="purchase-notes">Not</label><textarea id="purchase-notes" name="notes" rows="2"></textarea></div><div class="full-row section-action"><button class="primary-button" type="submit">Talep oluştur</button></div></form>`);
  }
  if(type==='production') {
    const products=(await api(`/api/products?brand=${encodeURIComponent(state.brand)}&limit=100`)).items;
    return openDialog('İş emri oluştur',`<form id="production-form" class="form-grid"><div><label for="production-code">İş emri kodu</label><input id="production-code" name="code" required maxlength="80"></div><div><label for="production-quantity">Miktar</label><input id="production-quantity" name="quantity" type="number" min="0.001" step="0.001" required></div><div><label for="production-priority">Öncelik</label><select id="production-priority" name="priority"><option value="normal">Normal</option><option value="high">Yüksek</option><option value="urgent">Acil</option><option value="low">Düşük</option></select></div><div><label for="production-due">Termin</label><input id="production-due" name="dueAt" type="date"></div><div class="full-row"><label for="production-product">Ürün</label><select id="production-product" name="productId"><option value="">Belirtilmedi</option>${products.map(item=>`<option value="${escapeHtml(item.id)}">${escapeHtml(item.sku)} — ${escapeHtml(item.name)}</option>`).join('')}</select></div><div class="full-row"><label for="production-notes">Not</label><textarea id="production-notes" name="notes" rows="3"></textarea></div><div class="full-row section-action"><button class="primary-button" type="submit">Oluştur</button></div></form>`);
  }
  if(type==='quote') {
    const customers=(await api(`/api/customers?brand=${encodeURIComponent(state.brand)}&limit=100`)).items;
    return openDialog('Teklif oluştur',`<form id="quote-form" class="form-grid"><div><label for="quote-number">Teklif no</label><input id="quote-number" name="number" required maxlength="80"></div><div><label for="quote-total">Tutar</label><input id="quote-total" name="total" type="number" min="0" step="0.01" required></div><div><label for="quote-currency">Para birimi</label><select id="quote-currency" name="currency"><option value="TRY">TRY</option><option value="EUR">EUR</option><option value="USD">USD</option></select></div><div><label for="quote-customer">Müşteri</label><select id="quote-customer" name="customerId"><option value="">Seçilmedi</option>${customers.map(item=>`<option value="${escapeHtml(item.id)}">${escapeHtml(item.name)}</option>`).join('')}</select></div><div class="full-row section-action"><button class="primary-button" type="submit">Taslak oluştur</button></div></form>`);
  }
  if(type==='shipment') {
    const orders=(await api(`/api/orders?brand=${encodeURIComponent(state.brand)}&limit=100`)).items;
    return openDialog('Gönderi oluştur',`<form id="shipment-form" class="form-grid"><div class="full-row"><label for="shipment-order">Sipariş</label><select id="shipment-order" name="orderId"><option value="">Siparişsiz gönderi</option>${orders.filter(item=>item.status!=='cancelled').map(item=>`<option value="${escapeHtml(item.id)}">${escapeHtml(item.external_id)} · ${escapeHtml(item.account)}</option>`).join('')}</select></div><div><label for="shipment-carrier">Kargo firması</label><input id="shipment-carrier" name="carrier" value="Yurtiçi Kargo" required maxlength="80"></div><div><label for="shipment-service">Servis kodu</label><input id="shipment-service" name="serviceCode" maxlength="60"></div><div class="full-row"><label for="shipment-tracking">Takip numarası</label><input id="shipment-tracking" name="trackingNumber" maxlength="120"></div><div class="full-row"><label for="shipment-note">Not</label><textarea id="shipment-note" name="note" rows="3" maxlength="500"></textarea></div><div class="full-row section-action"><button class="primary-button" type="submit">Gönderiyi oluştur</button></div></form>`);
  }
  if(type==='invoice') {
    const [customers,orders]=await Promise.all([api(`/api/customers?brand=${encodeURIComponent(state.brand)}&limit=100`),api(`/api/orders?brand=${encodeURIComponent(state.brand)}&limit=100`)]);
    return openDialog('Fatura oluştur',`<form id="invoice-form" class="form-grid"><div><label for="invoice-number">Fatura no</label><input id="invoice-number" name="number" required maxlength="80"></div><div><label for="invoice-type">Belge türü</label><select id="invoice-type" name="documentType"><option value="invoice">Fatura</option><option value="e_invoice">E-Fatura</option><option value="e_archive">E-Arşiv</option><option value="credit_note">İade faturası</option></select></div><div><label for="invoice-total">Tutar</label><input id="invoice-total" name="total" type="number" min="0" step="0.01" required></div><div><label for="invoice-currency">Para birimi</label><select id="invoice-currency" name="currency"><option value="TRY">TRY</option><option value="EUR">EUR</option><option value="USD">USD</option></select></div><div><label for="invoice-due">Vade</label><input id="invoice-due" name="dueAt" type="date"></div><div><label for="invoice-customer">Müşteri</label><select id="invoice-customer" name="customerId"><option value="">Seçilmedi</option>${customers.items.map(item=>`<option value="${escapeHtml(item.id)}">${escapeHtml(item.name)}</option>`).join('')}</select></div><div><label for="invoice-order">Sipariş</label><select id="invoice-order" name="orderId"><option value="">Seçilmedi</option>${orders.items.filter(item=>item.status!=='cancelled').map(item=>`<option value="${escapeHtml(item.id)}">${escapeHtml(item.external_id)} · ${escapeHtml(item.account)}</option>`).join('')}</select></div><div class="full-row"><label for="invoice-note">Not</label><textarea id="invoice-note" name="note" rows="3" maxlength="500"></textarea></div><div class="full-row section-action"><button class="primary-button" type="submit">Taslak oluştur</button></div></form>`);
  }
  if(type==='payment') {
    const invoices=(await api(`/api/invoices?brand=${encodeURIComponent(state.brand)}`)).items.filter(item=>item.status!=='cancelled'&&item.status!=='paid');
    return openDialog('Ödeme kaydet',`<form id="payment-form" class="form-grid"><div><label for="payment-direction">Tür</label><select id="payment-direction" name="direction"><option value="incoming">Tahsilat</option><option value="outgoing">Ödeme</option></select></div><div><label for="payment-amount">Tutar</label><input id="payment-amount" name="amount" type="number" min="0.01" step="0.01" required></div><div><label for="payment-currency">Para birimi</label><select id="payment-currency" name="currency"><option value="TRY">TRY</option><option value="EUR">EUR</option><option value="USD">USD</option></select></div><div><label for="payment-method">Yöntem</label><select id="payment-method" name="method"><option value="Banka havalesi">Banka havalesi</option><option value="Kredi kartı">Kredi kartı</option><option value="Nakit">Nakit</option><option value="Diğer">Diğer</option></select></div><div class="full-row"><label for="payment-invoice">Fatura</label><select id="payment-invoice" name="invoiceId"><option value="">Faturasız hareket</option>${invoices.map(item=>`<option value="${escapeHtml(item.id)}">${escapeHtml(item.number)} · ${escapeHtml(item.customer_name||'—')} · ${escapeHtml(money(item.total-item.paid_total))}</option>`).join('')}</select></div><div class="full-row"><label for="payment-reference">Referans / açıklama</label><input id="payment-reference" name="reference" maxlength="120"></div><div class="full-row section-action"><button class="primary-button" type="submit">Ödemeyi kaydet</button></div></form>`);
  }
  if(type==='expense') {
    const customers=(await api(`/api/customers?brand=${encodeURIComponent(state.brand)}&limit=100`)).items.filter(item=>item.kind==='supplier');
    return openDialog('Gider kaydet',`<form id="expense-form" class="form-grid"><div><label for="expense-category">Kategori</label><input id="expense-category" name="category" required maxlength="80"></div><div><label for="expense-number">Belge no</label><input id="expense-number" name="number" maxlength="100"></div><div><label for="expense-amount">Tutar</label><input id="expense-amount" name="amount" type="number" min="0.01" step="0.01" required></div><div><label for="expense-tax">Vergi</label><input id="expense-tax" name="taxAmount" type="number" min="0" step="0.01" value="0" required></div><div><label for="expense-currency">Para birimi</label><select id="expense-currency" name="currency"><option value="TRY">TRY</option><option value="EUR">EUR</option><option value="USD">USD</option></select></div><div><label for="expense-date">Gider tarihi</label><input id="expense-date" name="expenseAt" type="date"></div><div class="full-row"><label for="expense-supplier">Tedarikçi</label><select id="expense-supplier" name="supplierId"><option value="">Seçilmedi</option>${customers.map(item=>`<option value="${escapeHtml(item.id)}">${escapeHtml(item.name)}</option>`).join('')}</select></div><div class="full-row"><label for="expense-note">Not</label><textarea id="expense-note" name="note" rows="3" maxlength="500"></textarea></div><div class="full-row section-action"><button class="primary-button" type="submit">Gideri kaydet</button></div></form>`);
  }
}

function permissionFields(selected=[]) { return Object.entries(permissionLabels).map(([value,text])=>`<label><input type="checkbox" name="permission" value="${value}" ${selected.includes(value)?'checked':''}> ${escapeHtml(text)}</label>`).join(''); }
function randomToken() { const bytes=crypto.getRandomValues(new Uint8Array(32)); return [...bytes].map(byte=>byte.toString(16).padStart(2,'0')).join(''); }
function openAdminDialog(type,userId='') {
  const {accounts,users}=state.settings; const demo=accounts.filter(a=>a.platform==='demo');
  if (type==='account') return openDialog('Hesap ekle',`<form id="account-form" class="form-grid"><div><label for="account-brand">Marka kodu</label><input id="account-brand" name="brand" value="${escapeHtml(state.brand)}" placeholder="guner" required></div><div><label for="account-id">Hesap kodu</label><input id="account-id" name="id" placeholder="guner-demo" required></div><div class="full-row"><label for="account-platform">Platform</label><select id="account-platform" name="platform"><option value="demo">Demo</option><option value="shopify">Shopify</option><option value="faprika">Faprika</option></select></div><div class="full-row"><label for="account-shop-domain">Shopify mağaza adresi</label><input id="account-shop-domain" name="shopDomain" placeholder="magaza.myshopify.com"></div><div class="full-row section-action"><button class="primary-button" type="submit">Hesabı ekle</button></div></form>`);
  if (type==='demo') return openDialog('Demo siparişi',`<p class="modal-note">Harici sisteme veri göndermez; kalıcı inbox ve worker akışını denemek içindir.</p><form id="demo-form" class="form-grid"><div class="full-row"><label for="demo-account">Demo hesabı</label><select id="demo-account" name="account">${demo.map(a=>`<option value="${escapeHtml(a.id)}">${escapeHtml(a.id)}</option>`).join('')}</select></div><div><label for="demo-order">Sipariş numarası</label><input id="demo-order" name="orderId" required></div><div><label for="demo-customer">Müşteri kodu</label><input id="demo-customer" name="customerId"></div><div><label for="demo-sku">Ürün SKU</label><input id="demo-sku" name="sku" value="DEMO-001" required></div><div><label for="demo-quantity">Miktar</label><input id="demo-quantity" name="quantity" type="number" min="0.001" step="0.001" value="1" required></div><div class="full-row check-row"><label><input type="checkbox" name="needsProduction"> Üretim gerekiyor</label><label><input type="checkbox" name="international"> Yurt dışı</label></div><div class="full-row section-action"><button class="primary-button" type="submit">Sipariş oluştur</button></div></form>`);
  if (type==='rule') return openDialog('Atama kuralı',`<form id="rule-form" class="form-grid"><div><label for="rule-kind">Görev türü</label><select id="rule-kind" name="kind"><option value="invoice">Fatura kontrolü</option><option value="production">Üretim</option><option value="shipping.domestic">Yurt içi kargo</option><option value="shipping.international">Yurt dışı kargo</option></select></div><div><label for="rule-user">Atanan kişi</label><select id="rule-user" name="assignee"><option value="">Atanmamış</option>${users.filter(u=>u.active&&u.grants.some(g=>(g.brand==='*'||g.brand===state.brand)&&(g.permission==='*'||g.permission==='tasks.read'))).map(u=>`<option value="${escapeHtml(u.id)}">${escapeHtml(u.name)}</option>`).join('')}</select></div><div class="full-row section-action"><button class="primary-button" type="submit">Kuralı kaydet</button></div></form>`);
  if (type==='user') return openDialog('Kullanıcı ekle',`<form id="user-form" class="form-grid"><div><label for="new-user-id">Kullanıcı kodu</label><input id="new-user-id" name="id" required></div><div><label for="new-user-name">Ad</label><input id="new-user-name" name="name" required></div><div class="full-row"><label for="new-user-token">Kişisel anahtar</label><div class="input-action"><input id="new-user-token" name="token" readonly required><button class="secondary-button" id="generate-token" type="button">Üret</button></div></div><fieldset class="full-row fieldset-reset"><legend>Görebileceği alanlar ve işlemler</legend><div class="check-row">${permissionFields()}</div></fieldset><div class="full-row section-action"><button class="primary-button" type="submit">Kullanıcı oluştur</button></div><p id="created-token" class="full-row muted" role="status"></p></form>`);
  if (type==='edit-user') { const target=users.find(u=>u.id===userId); if(!target)return; const selected=target.grants.filter(g=>g.brand==='*'||g.brand===state.brand).map(g=>g.permission); return openDialog(`${target.name} yetkileri`,`<form id="permission-form" class="form-grid" data-requires-change><input type="hidden" name="userId" value="${escapeHtml(target.id)}"><fieldset class="full-row fieldset-reset"><legend>Görebileceği alanlar ve işlemler</legend><div class="check-row">${permissionFields(selected)}</div></fieldset><div class="full-row section-action"><button class="primary-button" type="submit">Kaydet</button></div></form>`); }
}

async function refreshIdentity(preferredBrand) {
  state.identity=await api('/api/me'); if (preferredBrand&&state.identity.brands.includes(preferredBrand)) state.brand=preferredBrand; else if(!state.identity.brands.includes(state.brand)) state.brand=state.identity.brands[0]||''; if(state.brand)sessionStorage.setItem('orchestra.brand',state.brand); renderBrandOptions();
}
async function waitForInbox(inboxId) {
  if(!inboxId)return;
  for(let attempt=0;attempt<20;attempt++) {
    const item=await api(`/api/inbox/${encodeURIComponent(inboxId)}`);
    if(item.status==='processed')return item;
    if(item.status==='failed')throw new Error(item.error?.message||'Sipariş olayı işlenemedi.');
    await new Promise(resolve=>setTimeout(resolve,250));
  }
  throw new Error('Sipariş olayı hâlâ işleniyor.');
}
async function waitForSyncJob(jobId) {
  for(let attempt=0;attempt<120;attempt++) {
    const item=await api(`/api/sync-jobs/${encodeURIComponent(jobId)}`);
    if(item.status==='completed')return item;
    if(item.status==='failed')throw new Error(item.error?.message||'Eşitleme tamamlanamadı.');
    await new Promise(resolve=>setTimeout(resolve,500));
  }
  throw new Error('Eşitleme hâlâ devam ediyor.');
}
async function waitForIntegrationSyncJob(jobId) {
  for(let attempt=0;attempt<120;attempt++) {
    const item=await api(`/api/integration-sync-jobs/${encodeURIComponent(jobId)}`);
    if(item.status==='completed')return item;
    if(item.status==='failed')throw new Error(item.error?.message||'Entegrasyon eşitlemesi tamamlanamadı.');
    await new Promise(resolve=>setTimeout(resolve,500));
  }
  throw new Error('Entegrasyon eşitlemesi hâlâ devam ediyor.');
}
async function handleForm(form) {
  const formId=form.getAttribute('id'); const invalid=form.querySelector(':invalid'); if(invalid){showFormError(form,'Lütfen işaretlenen zorunlu alanı tamamlayın.');invalid.focus();return;} const submit=form.querySelector('[type="submit"]');const inDialog=$('#app-dialog').contains(form);if(inDialog)state.dialogSubmitting=true;if(submit){submit.dataset.idleLabel=submit.textContent;submit.textContent='İşleniyor…';submit.disabled=true;}
  try {
    if(formId==='login-form'){ $('#login-error').textContent=''; await enterApp(form.token.value.trim()); return; }
    if(formId==='search-form'){ const query=new FormData(form).get('query').trim(); const urls={google:`https://www.google.com/search?q=${encodeURIComponent(query)}`,ai:`https://chatgpt.com/?q=${encodeURIComponent(query)}`,visual:`https://chatgpt.com/?q=${encodeURIComponent(`Bu görseli üret: ${query}`)}`,youtube:`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`}; window.open(urls[state.searchMode],'_blank','noopener'); return; }
    if(formId==='unlock-form'){ await unlockFeature(form); return; }
    if(formId==='cost-form'){ calculateCost(form); return; }
    if(formId==='task-block-form'){const data=Object.fromEntries(new FormData(form));await api(`/api/tasks/${encodeURIComponent(data.taskId)}`,{method:'PATCH',body:JSON.stringify({status:'blocked',blockedReason:data.blockedReason})});closeDialog();showToast('Görev engelli olarak işaretlendi.');await loadTasks(state.current?.type==='tasks'?state.current:tasksNode);return;}
    if(formId==='customer-form'){const data=Object.fromEntries(new FormData(form));await api('/api/customers',{method:'POST',body:JSON.stringify({...data,brand:state.brand})});closeDialog();showToast('Müşteri kaydedildi.');await loadResource(customersNode);return;}
    if(formId==='customer-note-form'){const data=new FormData(form),customerId=data.get('customerId');await api(`/api/customers/${encodeURIComponent(customerId)}/notes`,{method:'POST',body:JSON.stringify({body:data.get('body'),pinned:data.has('pinned')})});closeDialog();showToast('Müşteri notu kaydedildi.');await openCustomerDetail(customerId);return;}
    if(formId==='customer-interaction-form'){const data=Object.fromEntries(new FormData(form)),customerId=data.customerId;await api(`/api/customers/${encodeURIComponent(customerId)}/interactions`,{method:'POST',body:JSON.stringify({kind:data.kind,direction:data.direction,subject:data.subject,summary:data.summary})});closeDialog();showToast('Görüşme kaydedildi.');await openCustomerDetail(customerId);return;}
    if(formId==='product-form'){const data=Object.fromEntries(new FormData(form));await api('/api/products',{method:'POST',body:JSON.stringify({...data,brand:state.brand})});closeDialog();showToast('Ürün ve sayım bekleyen açılış stoğu oluşturuldu.');await loadResource(productsNode);return;}
    if(formId==='product-mapping-form'){const data=Object.fromEntries(new FormData(form));const payload={brand:state.brand,productId:data.productId};if(data.orderLineId)payload.orderLineId=data.orderLineId;else{payload.accountId=data.accountId;payload.externalVariantId=data.externalVariantId;}await api('/api/product-mappings',{method:'POST',body:JSON.stringify(payload)});closeDialog(true);showToast('Ürün eşlemesi kaydedildi.');if(data.orderId)await openOrderDetail(data.orderId);else await loadChannelProducts(state.current?.type==='channel-products'?state.current:channelProductsNode);return;}
    if(formId==='count-form'){const data=Object.fromEntries(new FormData(form));await api('/api/inventory/counts',{method:'POST',body:JSON.stringify({brand:state.brand,positionId:data.positionId,count:Number(data.count),note:data.note})});closeDialog();showToast('Sayım onaylandı.');await loadInventory(inventoryNode);return;}
    if(formId==='reservation-form'){const data=Object.fromEntries(new FormData(form));await api('/api/inventory/reservations',{method:'POST',body:JSON.stringify({brand:state.brand,positionId:data.positionId,orderId:data.orderId||null,quantity:Number(data.quantity)})});closeDialog();showToast('Stok ayrıldı.');await loadReservations(reservationsNode);return;}
    if(formId==='return-form'){const data=Object.fromEntries(new FormData(form));await api('/api/returns',{method:'POST',body:JSON.stringify({brand:state.brand,orderId:data.orderId,amount:Number(data.amount),currency:data.currency,reason:data.reason})});closeDialog();showToast('İade talebi oluşturuldu.');await loadReturns(returnsNode);return;}
    if(formId==='bom-form'){const data=Object.fromEntries(new FormData(form));await api('/api/boms',{method:'POST',body:JSON.stringify({brand:state.brand,code:data.code,productId:data.productId,quantity:Number(data.quantity),notes:data.notes,lines:[{productId:data.componentProductId,quantity:Number(data.componentQuantity),unit:'adet',wastePercent:Number(data.wastePercent)}]})});closeDialog();showToast('Ürün reçetesi oluşturuldu.');await loadBoms(bomsNode);return;}
    if(formId==='purchase-request-form'){const data=Object.fromEntries(new FormData(form));await api('/api/purchase-requests',{method:'POST',body:JSON.stringify({brand:state.brand,number:data.number,supplierId:data.supplierId||null,priority:data.priority,neededAt:data.neededAt||null,notes:data.notes,lines:[{productId:data.productId,quantity:Number(data.quantity),unit:'adet',estimatedUnitCost:data.estimatedUnitCost===''?null:Number(data.estimatedUnitCost),currency:'TRY'}]})});closeDialog();showToast('Satın alma talebi oluşturuldu.');await loadPurchaseRequests(purchaseRequestsNode);return;}
    if(formId==='quote-form'){const data=Object.fromEntries(new FormData(form));await api('/api/quotes',{method:'POST',body:JSON.stringify({brand:state.brand,number:data.number,customerId:data.customerId||null,currency:data.currency,total:Number(data.total)})});closeDialog();showToast('Teklif taslağı oluşturuldu.');await loadResource(quotesNode);return;}
    if(formId==='production-form'){const data=Object.fromEntries(new FormData(form));await api('/api/production',{method:'POST',body:JSON.stringify({brand:state.brand,code:data.code,productId:data.productId||null,quantity:Number(data.quantity),priority:data.priority,dueAt:data.dueAt||null,notes:data.notes})});closeDialog();showToast('İş emri oluşturuldu.');await loadProduction(productionNode);return;}
    if(formId==='shipment-form'){const data=Object.fromEntries(new FormData(form));await api('/api/shipments',{method:'POST',body:JSON.stringify({brand:state.brand,orderId:data.orderId||null,carrier:data.carrier,serviceCode:data.serviceCode,trackingNumber:data.trackingNumber,note:data.note})});closeDialog();showToast('Gönderi oluşturuldu.');await loadShipments(shipmentsNode);return;}
    if(formId==='shipment-event-form'){const data=Object.fromEntries(new FormData(form)),shipmentId=data.shipmentId;await api(`/api/shipments/${encodeURIComponent(shipmentId)}/tracking-events`,{method:'POST',body:JSON.stringify({status:data.status,location:data.location,description:data.description})});closeDialog();showToast('Takip olayı kaydedildi.');await openShipmentDetail(shipmentId);return;}
    if(formId==='invoice-form'){const data=Object.fromEntries(new FormData(form));await api('/api/invoices',{method:'POST',body:JSON.stringify({brand:state.brand,number:data.number,documentType:data.documentType,orderId:data.orderId||null,customerId:data.customerId||null,currency:data.currency,total:Number(data.total),dueAt:data.dueAt||null,note:data.note})});closeDialog();showToast('Fatura taslağı oluşturuldu.');await loadInvoices(invoicesNode);return;}
    if(formId==='payment-form'){const data=Object.fromEntries(new FormData(form));await api('/api/payments',{method:'POST',body:JSON.stringify({brand:state.brand,invoiceId:data.invoiceId||null,direction:data.direction,currency:data.currency,amount:Number(data.amount),method:data.method,reference:data.reference})});closeDialog();showToast('Ödeme kaydedildi.');await loadPayments(paymentsNode);return;}
    if(formId==='expense-form'){const data=Object.fromEntries(new FormData(form));await api('/api/expenses',{method:'POST',body:JSON.stringify({brand:state.brand,category:data.category,number:data.number,supplierId:data.supplierId||null,currency:data.currency,amount:Number(data.amount),taxAmount:Number(data.taxAmount),expenseAt:data.expenseAt||null,note:data.note})});closeDialog();showToast('Gider kaydedildi.');await loadExpenses(expensesNode);return;}
    if(formId==='account-form'){ const data=Object.fromEntries(new FormData(form)); if(data.platform==='shopify'&&!data.shopDomain.trim())throw new Error('Shopify mağaza adresi gerekli.'); if(data.platform!=='shopify')delete data.shopDomain; await api('/api/admin/accounts',{method:'PUT',body:JSON.stringify(data)}); await refreshIdentity(data.brand); closeDialog(); showToast('Hesap eklendi.'); await loadSettings(nodeIndex.get('admin-connections')); }
    if(formId==='demo-form'){ const data=new FormData(form),sku=data.get('sku').trim(),quantity=Number(data.get('quantity')); const result=await api('/api/admin/demo-orders',{method:'POST',body:JSON.stringify({account:data.get('account'),orderId:data.get('orderId'),customerId:data.get('customerId'),needsProduction:data.has('needsProduction'),international:data.has('international'),lines:[{externalProductId:`demo-${sku}`,sku,title:sku,quantity,unit:'adet'}]})}); await waitForInbox(result.inboxId); closeDialog(); showToast('Demo siparişi işlendi.'); if(state.current?.type==='orders')await loadOrders(ordersNode);return; }
    if(formId==='demo-lifecycle-form'){const data=new FormData(form);const result=await api(`/api/admin/demo-orders/${encodeURIComponent(data.get('orderId'))}`,{method:'PATCH',body:JSON.stringify({account:data.get('account'),eventType:'order.updated',needsProduction:data.has('needsProduction'),international:data.has('international')})});await waitForInbox(result.inboxId);closeDialog();showToast('Sipariş güncellendi.');await loadOrders(ordersNode);return;}
    if(formId==='rule-form'){ const data=Object.fromEntries(new FormData(form)); await api('/api/admin/rules',{method:'PUT',body:JSON.stringify({id:`${state.brand}-${data.kind}`,brand:state.brand,kind:data.kind,assignee:data.assignee||null})}); closeDialog(); showToast('Atama kuralı kaydedildi.'); await loadSettings(nodeIndex.get('admin-rules')); }
    if(formId==='user-form'){ const data=new FormData(form),permissions=data.getAll('permission'),token=data.get('token'); if(!permissions.length)throw new Error('En az bir alan seçin.'); await api('/api/admin/users',{method:'POST',body:JSON.stringify({id:data.get('id'),name:data.get('name'),token,grants:permissions.map(permission=>({brand:state.brand,permission}))})}); state.dialogDirty=false;$('#created-token').textContent=`Anahtarı şimdi kopyalayın: ${token}`; showToast('Kullanıcı oluşturuldu.'); await loadSettings(nodeIndex.get('admin-users')); }
    if(formId==='permission-form'){ const data=new FormData(form); await api(`/api/admin/users/${encodeURIComponent(data.get('userId'))}`,{method:'PUT',body:JSON.stringify({brand:state.brand,permissions:data.getAll('permission')})}); closeDialog(); showToast('Kullanıcı görünürlüğü güncellendi.'); await loadSettings(nodeIndex.get('admin-users')); }
  } catch(error) { if(formId==='login-form')$('#login-error').textContent=error.message; else {if(inDialog)showFormError(form,error.message);showToast(error.message,true);} }
  finally { if(inDialog)state.dialogSubmitting=false;if(submit&&document.contains(submit)){submit.disabled=false;submit.textContent=submit.dataset.idleLabel||submit.textContent;delete submit.dataset.idleLabel;} }
}

document.addEventListener('submit',event=>{event.preventDefault();handleForm(event.target);});
document.addEventListener('click',async event=>{
  const target=event.target instanceof Element?event.target:event.target?.parentElement;if(!target)return;
  const closest=selector=>target.closest(selector);

  // Action controls must win over surrounding navigation containers. Keeping these
  // first also makes dynamically rendered toolbar and modal buttons deterministic.
  const domainDialog=closest('[data-domain-dialog]');if(domainDialog){event.preventDefault();return openDomainDialog(domainDialog.dataset.domainDialog,domainDialog).catch(error=>showToast(error.message,true));}
  const dialog=closest('[data-dialog]');if(dialog){event.preventDefault();return openAdminDialog(dialog.dataset.dialog,dialog.dataset.user||'');}
  if(closest('[data-close-dialog]')){event.preventDefault();return closeDialog();}

  const profile=closest('[data-profile]');if(profile)return openProfileDialog();
  const localUser=closest('[data-local-user]');if(localUser)return switchLocalUser(localUser.dataset.localUser).catch(error=>showToast(error.message,true));
  const sortHeader=closest('th[data-sort-index]');if(sortHeader)return sortTable(sortHeader);
  if(closest('[data-home]')||closest('#home-button'))return goHome();
  const lock=closest('[data-lock-node]'); if(lock)return lockFeature(lock.dataset.lockNode);
  const mode=closest('[data-search-mode]'); if(mode){const node=searchNodes[mode.dataset.searchMode]||googleNode;if(featureLocked(node))return selectNode(node.id);state.searchMode=mode.dataset.searchMode;goHome();$('#global-query').focus();return;}
  const calc=closest('[data-calc]'); if(calc)return calculatorKey(calc.dataset.calc);
  const task=closest('[data-task][data-status]'); if(task)return updateTask(task);
  const taskBlock=closest('[data-task-block]');if(taskBlock)return openTaskBlockDialog(taskBlock.dataset.taskBlock);
  const production=closest('[data-production][data-status]'); if(production)return updateProduction(production);
  const productionDetail=closest('[data-production-detail]');if(productionDetail)return openProductionDetail(productionDetail.dataset.productionDetail).catch(error=>showToast(error.message,true));
  const reservation=closest('[data-release-reservation]');if(reservation)return releaseReservation(reservation);
  const returnButton=closest('[data-return][data-status]');if(returnButton)return updateReturn(returnButton);
  const purchase=closest('[data-purchase][data-status]');if(purchase)return updatePurchase(purchase);
  const shipment=closest('[data-shipment][data-status]'); if(shipment)return updateShipment(shipment);
  const shipmentDetail=closest('[data-shipment-detail]');if(shipmentDetail)return openShipmentDetail(shipmentDetail.dataset.shipmentDetail).catch(error=>showToast(error.message,true));
  const shipmentEvent=closest('[data-shipment-event]');if(shipmentEvent)return openShipmentEventDialog(shipmentEvent.dataset.shipmentEvent);
  const invoice=closest('[data-invoice][data-status]'); if(invoice)return updateInvoice(invoice);
  const reconciliation=closest('[data-reconciliation]');if(reconciliation)return resolveReconciliation(reconciliation);
  const externalOperation=closest('[data-external-operation][data-action]');if(externalOperation)return updateExternalOperation(externalOperation);
  const mapping=closest('[data-map-line],[data-map-variant]');if(mapping)return openProductMappingDialog(mapping).catch(error=>showToast(error.message,true));
  const orderDetail=closest('[data-order-detail]'); if(orderDetail)return openOrderDetail(orderDetail.dataset.orderDetail).catch(error=>showToast(error.message,true));
  const customerDetail=closest('[data-customer-detail]');if(customerDetail)return openCustomerDetail(customerDetail.dataset.customerDetail).catch(error=>showToast(error.message,true));
  const customerNote=closest('[data-customer-note]');if(customerNote)return openCustomerNoteDialog(customerNote.dataset.customerNote);
  const customerInteraction=closest('[data-customer-interaction]');if(customerInteraction)return openCustomerInteractionDialog(customerInteraction.dataset.customerInteraction);
  const channelMore=closest('[data-channel-more]');if(channelMore)return loadChannelProducts(state.current?.type==='channel-products'?state.current:channelProductsNode,{append:true}).catch(error=>showToast(error.message,true));
  const channelProduct=closest('[data-channel-product-detail]');if(channelProduct)return openChannelProductDetail(channelProduct.dataset.channelProductDetail).catch(error=>showToast(error.message,true));
  const demoEdit=closest('[data-demo-edit]');if(demoEdit)return openDemoUpdateDialog(demoEdit);
  const demoEvent=closest('[data-demo-event]');if(demoEvent)return sendDemoLifecycle(demoEvent);
  const visibility=closest('[data-visibility-node]'); if(visibility)return toggleModuleVisibility(visibility);
  const density=closest('button[data-density]');if(density)return setDensity(density);
  const reconcile=closest('[data-reconcile]'); if(reconcile)return reconcileAccount(reconcile);
  const integrationSync=closest('[data-integration-sync]'); if(integrationSync)return syncIntegration(integrationSync);
  const notification=closest('[data-notification]'); if(notification)return readNotification(notification);
  if(closest('#toggle-token')){const input=$('#token');input.type=input.type==='password'?'text':'password';$('#toggle-token').textContent=input.type==='password'?'Göster':'Gizle';return;}
  if(closest('#generate-token')){$('#new-user-token').value=randomToken();state.dialogDirty=true;return;}
  if(closest('#logout'))return logout();

  const nodeButton=closest('[data-node]');if(nodeButton)return selectNode(nodeButton.dataset.node);
});
function enhanceDataTables(root=document) {
  root.querySelectorAll('.result-count').forEach(count=>{count.setAttribute('role','status');count.setAttribute('aria-live','polite');});
  root.querySelectorAll('table').forEach(table=>{
    if(table.dataset.enhanced)return;table.dataset.enhanced='true';
    [...table.querySelectorAll('thead th')].forEach((th,index)=>{if(!th.textContent.trim())return;th.dataset.sortIndex=index;th.tabIndex=0;th.setAttribute('aria-sort','none');th.title='Sırala';});
  });
}
function sortTable(th) {
  const table=th.closest('table'),tbody=table?.tBodies?.[0];if(!tbody)return;
  const index=Number(th.dataset.sortIndex),direction=th.getAttribute('aria-sort')==='ascending'?'descending':'ascending';
  table.querySelectorAll('thead th[aria-sort]').forEach(item=>item.setAttribute('aria-sort',item===th?direction:'none'));
  const collator=new Intl.Collator('tr',{numeric:true,sensitivity:'base'});
  [...tbody.rows].sort((a,b)=>{const left=a.cells[index]?.innerText.trim()||'',right=b.cells[index]?.innerText.trim()||'';return collator.compare(left,right)*(direction==='ascending'?1:-1);}).forEach(row=>tbody.append(row));
}
function applyLocalFilters(source) {
  const scope=source?.closest('.stage-surface,.modal-body')||$('#center-stage'),query=scope?.querySelector('[data-local-filter]')?.value.toLocaleLowerCase('tr-TR')||'',status=scope?.querySelector('[data-status-filter]')?.value||'',rows=[...(scope?.querySelectorAll('[data-filter-body] > *')||[])];
  rows.forEach(row=>{row.hidden=(!!query&&!row.textContent.toLocaleLowerCase('tr-TR').includes(query))||(!!status&&row.dataset.status!==status);});
  const count=scope?.querySelector('.result-count');
  if (!count) return;
  const shown=rows.filter(row=>!row.hidden).length;
  count.textContent=count.dataset.unit?`${shown} ${count.dataset.unit}`:`${shown} / ${rows.length} sonuç`;
}
function tracksUnsavedChanges(target){const form=target.closest('#app-dialog form');return !!form&&!['unlock-form','cost-form'].includes(form.id);}
function markDialogChanged(target){if(!tracksUnsavedChanges(target))return;state.dialogDirty=true;const form=target.closest('form[data-requires-change]');if(form)form.querySelector('[type="submit"]')?.removeAttribute('disabled');}
document.addEventListener('input',event=>{markDialogChanged(event.target);if(event.target.matches('[data-channel-search]')){const query=event.target.value;clearTimeout(channelQueryTimer);channelQueryTimer=setTimeout(()=>{if(state.current?.type==='channel-products')loadChannelProducts(state.current,{query}).catch(error=>showToast(error.message,true));},250);return;}if(event.target.matches('[data-local-filter],[data-status-filter]'))applyLocalFilters(event.target);});
document.addEventListener('change',event=>{const brandSelect=event.target.closest?.('[data-stage-brand-select]');if(brandSelect){state.brand=brandSelect.value;sessionStorage.setItem('orchestra.brand',state.brand);goHome();return;}markDialogChanged(event.target);if(event.target.matches('[data-status-filter]'))applyLocalFilters(event.target);});
document.addEventListener('keydown',event=>{const th=event.target.closest?.('th[data-sort-index]');if(th&&(event.key==='Enter'||event.key===' ')){event.preventDefault();sortTable(th);}});
$('#app-dialog').addEventListener('click',event=>{if(event.target===$('#app-dialog'))closeDialog();});
$('#app-dialog').addEventListener('cancel',event=>{event.preventDefault();closeDialog();});
$('#brand-select').addEventListener('change',async event=>{state.brand=event.target.value;sessionStorage.setItem('orchestra.brand',state.brand);goHome();});

async function initialize() {
  const response=await fetch('/api/runtime',{headers:{Accept:'application/json'}});
  if(!response.ok)throw new Error('Çalışma modu alınamadı.');
  const runtime=await response.json(); state.passwordsDisabled=!!runtime.passwordsDisabled;state.runtimeUsers=runtime.users??[];
  if(state.passwordsDisabled&&!state.localUser)state.localUser=state.runtimeUsers[0]?.id||'';
  if(state.passwordsDisabled){$('#logout').hidden=true;await enterApp('');return;}
  $('#logout').hidden=false;
  if(state.token)await enterApp(state.token); else $('#token').focus();
}
initialize().catch(()=>logout('Erişim anahtarı geçersiz veya sunucuya ulaşılamıyor.'));
