export type PermissionScope =
  | "none"
  | "view_only"
  | "own"
  | "assigned"
  | "category"
  | "warehouse"
  | "brand"
  | "customer_group"
  | "sales_channel"
  | "all";

export type ApprovalMode = "allow" | "require_approval" | "deny";

export type PermissionRule = {
  permission: string;
  scope: PermissionScope;
  scopeValue?: string;
  approval: ApprovalMode;
};

export type PermissionDefinition = { key: string; label: string; risk?: boolean };
export type PermissionModule = { key: string; label: string; permissions: PermissionDefinition[] };

const p = (module: string, actions: Array<string | [string, string] | [string, string, boolean]>) =>
  actions.map((entry): PermissionDefinition => {
    const [key, label, risk] = typeof entry === "string" ? [entry, entry, false] : entry;
    return { key: `${module}.${key}`, label, risk };
  });

export const PERMISSION_MODULES: PermissionModule[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    permissions: p("dashboard", [
      ["view", "Dashboard görüntüle"],
      ["sales", "Satış özetini görüntüle"],
      ["orders", "Sipariş özetini görüntüle"],
      ["customers", "Müşteri özetini görüntüle"],
      ["quotes", "Teklif özetini görüntüle"],
      ["stock_alerts", "Stok uyarılarını görüntüle"],
      ["activity", "Son aktiviteleri görüntüle"],
    ]),
  },
  {
    key: "products",
    label: "Ürünler",
    permissions: p("products", [
      ["view", "Ürünleri görüntüle"],
      ["create", "Ürün oluştur"],
      ["edit", "Ürün düzenle"],
      ["copy", "Ürün kopyala"],
      ["publish", "Yayınla / yayından kaldır"],
      ["archive", "Ürün arşivle"],
      ["delete", "Ürün sil", true],
      ["bulk_edit", "Toplu ürün düzenle", true],
      ["import", "İçe aktar"],
      ["export", "Dışa aktar"],
      ["change_price", "Fiyat değiştir", true],
      ["view_cost", "Maliyet görüntüle"],
      ["change_cost", "Maliyet değiştir", true],
      ["change_sku", "SKU değiştir"],
      ["change_barcode", "Barkod değiştir"],
      ["change_stock", "Stok değiştir", true],
      ["manage_images", "Görsel ekle / sil"],
      ["edit_seo", "SEO alanlarını değiştir"],
      ["change_slug", "URL / slug değiştir", true],
      ["manage_variants", "Varyant yönet"],
      ["manage_colors", "Renk yönet"],
      ["manage_sizes", "Ölçü yönet"],
      ["manage_materials", "Malzeme yönet"],
      ["manage_attributes", "Ürün özellikleri yönet"],
    ]),
  },
  {
    key: "collections",
    label: "Kategoriler / Koleksiyonlar",
    permissions: p("collections", [
      ["view", "Görüntüle"],
      ["create", "Oluştur"],
      ["edit", "Düzenle"],
      ["sort", "Sırala"],
      ["assign_products", "Ürün ata"],
      ["edit_seo", "SEO düzenle"],
      ["publish", "Yayınla"],
      ["delete", "Sil", true],
    ]),
  },
  {
    key: "sets",
    label: "Setler",
    permissions: p("sets", [
      ["view", "Set görüntüle"],
      ["create", "Set oluştur"],
      ["edit", "Set düzenle"],
      ["manage_products", "Sete ürün ekle / çıkar"],
      ["change_price", "Set fiyatı değiştir", true],
      ["manage_images", "Set görsellerini değiştir"],
      ["manage_stock", "Set stok durumunu yönet"],
      ["publish", "Yayınla"],
      ["delete", "Sil", true],
    ]),
  },
  {
    key: "orders",
    label: "Siparişler",
    permissions: p("orders", [
      ["view", "Sipariş görüntüle"],
      ["create", "Sipariş oluştur"],
      ["edit", "Sipariş düzenle"],
      ["manage_products", "Ürün ekle / çıkar"],
      ["change_address", "Adres değiştir"],
      ["change_customer", "Müşteri değiştir"],
      ["add_note", "Sipariş notu ekle"],
      ["change_status", "Durum değiştir"],
      ["change_payment_status", "Ödeme durumu değiştir"],
      ["change_shipping_status", "Kargo durumu değiştir"],
      ["add_tracking", "Kargo takip kodu ekle"],
      ["complete", "Siparişi tamamla"],
      ["cancel", "Siparişi iptal et", true],
      ["create_return", "İade oluştur"],
      ["refund", "Para iadesi yap", true],
      ["delete", "Sipariş sil", true],
      ["export", "Sipariş dışa aktar"],
      ["view_invoice", "Fatura görüntüle"],
      ["create_invoice", "Fatura oluştur"],
    ]),
  },
  {
    key: "quotes",
    label: "Teklifler",
    permissions: p("quotes", [
      ["view", "Teklifleri görüntüle"],
      ["create", "Yeni teklif oluştur"],
      ["edit", "Teklif düzenle"],
      ["set_price", "Fiyat gir"],
      ["discount", "İskonto yap", true],
      ["change_quantity", "Miktar değiştir"],
      ["manage_products", "Ürün ekle / çıkar"],
      ["assign_customer", "Müşteri ata"],
      ["create_pdf", "PDF teklif oluştur"],
      ["send", "Teklif gönder"],
      ["change_status", "Teklif durumunu değiştir"],
      ["approve", "Teklifi onayla", true],
      ["convert_to_order", "Siparişe dönüştür"],
      ["delete", "Teklif sil", true],
    ]),
  },
  {
    key: "custom_production",
    label: "Özel Üretim / Kendin Tasarla",
    permissions: p("custom_production", [
      ["view", "Talepleri görüntüle"],
      ["view_detail", "Talep detayını görüntüle"],
      ["view_files", "Dosyaları görüntüle"],
      ["download_files", "Dosya indir"],
      ["add_measurement", "Ölçü ekle"],
      ["add_technical_note", "Teknik not ekle"],
      ["set_price", "Fiyat ekle", true],
      ["change_sample_status", "Numune durumu değiştir"],
      ["change_production_status", "Üretim durumu değiştir"],
      ["set_due_date", "Termin tarihi belirle"],
      ["message_customer", "Müşteriye mesaj gönder"],
      ["convert_to_quote", "Teklife dönüştür"],
      ["convert_to_order", "Siparişe dönüştür"],
      ["close", "Talebi kapat"],
      ["delete", "Talebi sil", true],
    ]),
  },
  {
    key: "customers",
    label: "Müşteriler",
    permissions: p("customers", [
      ["view", "Müşteri görüntüle"],
      ["create", "Müşteri oluştur"],
      ["edit", "Müşteri düzenle"],
      ["view_address", "Adres görüntüle"],
      ["change_address", "Adres değiştir"],
      ["view_phone", "Telefon görüntüle"],
      ["view_email", "E-posta görüntüle"],
      ["view_orders", "Sipariş geçmişini görüntüle"],
      ["view_quotes", "Teklif geçmişini görüntüle"],
      ["add_note", "Not ekle"],
      ["add_tag", "Etiket ekle"],
      ["change_group", "Müşteri grubu değiştir"],
      ["delete", "Müşteri sil", true],
      ["export", "Müşteri dışa aktar", true],
    ]),
  },
  {
    key: "companies",
    label: "Kurumsal Müşteriler",
    permissions: p("companies", [
      ["view", "Firma görüntüle"],
      ["create", "Firma oluştur"],
      ["edit", "Firma düzenle"],
      ["manage_contacts", "Yetkili kişi yönet"],
      ["manage_tax", "Vergi bilgileri yönet"],
      ["manage_billing", "Fatura bilgileri yönet"],
      ["set_special_price", "Özel fiyat tanımla", true],
      ["set_discount", "İskonto oranı tanımla", true],
      ["set_payment_term", "Ödeme vadesi tanımla"],
      ["view_quotes", "Teklifleri görüntüle"],
      ["view_orders", "Siparişleri görüntüle"],
      ["delete", "Firma sil", true],
    ]),
  },
  {
    key: "inventory",
    label: "Stok",
    permissions: p("inventory", [
      ["view", "Stok görüntüle"],
      ["adjust", "Stok değiştir", true],
      ["receive", "Stok giriş yap"],
      ["issue", "Stok çıkış yap"],
      ["count", "Sayım yap"],
      ["set_minimum", "Minimum stok seviyesi belirle"],
      ["view_movements", "Stok hareketlerini görüntüle"],
      ["transfer", "Depolar arası transfer", true],
      ["import", "CSV içe aktar", true],
      ["export", "CSV dışa aktar"],
    ]),
  },
  {
    key: "warehouses",
    label: "Depolar",
    permissions: p("warehouses", [
      ["view", "Depo görüntüle"],
      ["create", "Depo oluştur"],
      ["edit", "Depo düzenle"],
      ["delete", "Depo sil", true],
      ["assign_products", "Ürünleri depoya ata"],
      ["create_transfer", "Transfer oluştur"],
      ["approve_transfer", "Transfer onayla", true],
      ["cancel_transfer", "Transfer iptal et", true],
    ]),
  },
  {
    key: "production",
    label: "Üretim",
    permissions: p("production", [
      ["view", "Üretim emirlerini görüntüle"],
      ["create", "Üretim emri oluştur"],
      ["view_bom", "Ürün ağacını görüntüle"],
      ["change_quantity", "Üretim adedi değiştir"],
      ["start", "Üretime al"],
      ["change_operation", "Operasyon değiştir"],
      ["assign_staff", "Personel ata"],
      ["change_due_date", "Termin değiştir"],
      ["complete", "Üretimi tamamla"],
      ["record_waste", "Fire gir"],
      ["cancel", "Üretim iptal et", true],
    ]),
  },
  {
    key: "shipping",
    label: "Kargo",
    permissions: p("shipping", [
      ["view", "Kargoları görüntüle"],
      ["create", "Kargo oluştur"],
      ["select_carrier", "Kargo firması seç"],
      ["add_tracking", "Takip numarası gir"],
      ["create_label", "Etiket oluştur"],
      ["print_label", "Etiket yazdır"],
      ["mark_shipped", "Gönderildi yap"],
      ["mark_delivered", "Teslim edildi yap"],
      ["cancel", "Kargo iptal et", true],
    ]),
  },
  {
    key: "pricing",
    label: "Fiyatlandırma",
    permissions: p("pricing", [
      ["view_sale", "Satış fiyatı görüntüle"],
      ["change_sale", "Satış fiyatı değiştir", true],
      ["view_cost", "Maliyet görüntüle"],
      ["change_cost", "Maliyet değiştir", true],
      ["change_wholesale", "Toptan fiyat değiştir", true],
      ["change_corporate", "Kurumsal fiyat değiştir", true],
      ["change_campaign", "Kampanyalı fiyat değiştir", true],
      ["bulk_update", "Toplu fiyat güncelle", true],
      ["view_history", "Fiyat geçmişini görüntüle"],
    ]),
  },
  {
    key: "discounts",
    label: "İndirimler",
    permissions: p("discounts", [
      ["view", "Görüntüle"],
      ["create_code", "İndirim kodu oluştur"],
      ["create_automatic", "Otomatik indirim oluştur"],
      ["create_product", "Ürün indirimi oluştur"],
      ["create_category", "Kategori indirimi oluştur"],
      ["set_minimum", "Minimum sepet tutarı belirle"],
      ["set_dates", "Tarih belirle"],
      ["set_limit", "Kullanım limiti belirle"],
      ["edit", "Düzenle"],
      ["disable", "Pasifleştir"],
      ["delete", "Sil", true],
    ]),
  },
  {
    key: "content",
    label: "İçerik",
    permissions: p("content", [
      ["view", "Sayfa görüntüle"],
      ["create", "Sayfa oluştur"],
      ["edit", "Sayfa düzenle"],
      ["save_draft", "Taslak kaydet"],
      ["publish", "Yayınla"],
      ["unpublish", "Yayından kaldır"],
      ["delete", "Sil", true],
      ["manage_menu", "Menü yönet"],
      ["manage_guides", "Rehber yönet"],
      ["manage_faq", "SSS yönet"],
      ["manage_legal", "Hukuki metin yönet"],
    ]),
  },
  {
    key: "seo",
    label: "SEO",
    permissions: p("seo", [
      ["edit_title", "Meta title değiştir"],
      ["edit_description", "Meta description değiştir"],
      ["edit_slug", "URL / slug değiştir", true],
      ["edit_canonical", "Canonical değiştir"],
      ["edit_indexing", "Index / noindex değiştir"],
      ["manage_sitemap", "Sitemap ayarları"],
      ["create_redirect", "Redirect oluştur"],
      ["edit_redirect", "Redirect değiştir"],
      ["delete_redirect", "Redirect sil", true],
      ["manage_structured_data", "Structured Data yönet"],
      ["manage_open_graph", "Open Graph yönet"],
      ["edit_alt", "Görsel ALT metinleri değiştir"],
      ["manage_robots", "Robots ayarları", true],
      ["edit", "SEO düzenle"],
    ]),
  },
  {
    key: "media",
    label: "Görseller / Dosyalar",
    permissions: p("media", [
      ["view", "Görüntüle"],
      ["upload", "Yükle"],
      ["edit", "Düzenle"],
      ["rename", "Yeniden adlandır"],
      ["create_folder", "Klasör oluştur"],
      ["attach_product", "Ürüne bağla"],
      ["attach_content", "İçeriğe bağla"],
      ["download", "Dosya indir"],
      ["delete", "Dosya sil", true],
    ]),
  },
  {
    key: "theme",
    label: "Ana Sayfa / Site Tasarımı",
    permissions: p("theme", [
      ["edit_home", "Ana sayfayı düzenle"],
      ["edit_hero", "Hero düzenle"],
      ["edit_banner", "Banner düzenle"],
      ["edit_collection_showcase", "Koleksiyon vitrini düzenle"],
      ["sort_products", "Ürün sıralaması değiştir"],
      ["add_section", "Bölüm ekle"],
      ["remove_section", "Bölüm kaldır", true],
      ["edit_menu", "Menü düzenle"],
      ["edit_footer", "Footer düzenle"],
      ["edit_settings", "Tema ayarlarını değiştir"],
      ["edit_css", "Özel CSS değiştir", true],
      ["edit_js", "Özel JS değiştir", true],
      ["edit_code", "Kod düzenle", true],
      ["publish", "Yayına al", true],
      ["edit", "Tema düzenle"],
    ]),
  },
  {
    key: "blog",
    label: "Blog / Rehber",
    permissions: p("blog", [
      ["view", "Yazıları görüntüle"],
      ["create", "Yazı oluştur"],
      ["edit", "Yazı düzenle"],
      ["change_image", "Görsel değiştir"],
      ["change_category", "Kategori değiştir"],
      ["edit_seo", "SEO değiştir"],
      ["publish", "Yayınla"],
      ["delete", "Sil", true],
    ]),
  },
  {
    key: "reviews",
    label: "Yorumlar / Değerlendirmeler",
    permissions: p("reviews", [
      ["view", "Görüntüle"],
      ["approve", "Onayla"],
      ["reject", "Reddet"],
      ["reply", "Yanıtla"],
      ["edit", "Düzenle"],
      ["delete", "Sil", true],
    ]),
  },
  {
    key: "forms",
    label: "İletişim / Formlar",
    permissions: p("forms", [
      ["view_contact", "İletişim taleplerini görüntüle"],
      ["view_quotes", "Teklif formlarını görüntüle"],
      ["view_complaints", "Şikayetleri görüntüle"],
      ["view_design", "Tasarım taleplerini görüntüle"],
      ["reply", "Yanıtla"],
      ["assign_staff", "Personel ata"],
      ["change_status", "Durum değiştir"],
      ["add_note", "Not ekle"],
      ["delete", "Sil", true],
    ]),
  },
  {
    key: "newsletter",
    label: "Bülten",
    permissions: p("newsletter", [
      ["view_subscribers", "Aboneleri görüntüle"],
      ["add_subscriber", "Abone ekle"],
      ["delete_subscriber", "Abone sil", true],
      ["export", "Dışa aktar"],
      ["create_campaign", "Kampanya oluştur"],
      ["send_campaign", "Kampanya gönder", true],
    ]),
  },
  {
    key: "analytics",
    label: "Analitik",
    permissions: p("analytics", [
      ["view", "Dashboard görüntüle"],
      ["sales", "Satış raporları"],
      ["products", "Ürün raporları"],
      ["inventory", "Stok raporları"],
      ["customers", "Müşteri raporları"],
      ["quotes", "Teklif raporları"],
      ["conversion", "Dönüşüm raporları"],
      ["traffic", "Trafik raporları"],
      ["profit", "Kâr raporları"],
      ["cost", "Maliyet raporları"],
      ["export", "Dışa aktar"],
    ]),
  },
  {
    key: "finance",
    label: "Finans",
    permissions: p("finance", [
      ["view_revenue", "Ciro görüntüle"],
      ["view_cost", "Maliyet görüntüle"],
      ["view_profit", "Kâr görüntüle"],
      ["view_collections", "Tahsilat görüntüle"],
      ["record_payment", "Ödeme kaydet"],
      ["view_refunds", "İade görüntüle"],
      ["refund", "İade yap", true],
      ["view_invoice", "Fatura görüntüle"],
      ["export", "Finans raporu dışa aktar"],
      ["view", "Finans görüntüle"],
    ]),
  },
  {
    key: "payment_settings",
    label: "Ödeme Ayarları",
    permissions: p("payment_settings", [
      ["view", "Ödeme yöntemlerini görüntüle"],
      ["change_provider", "Ödeme sağlayıcısını değiştir", true],
      ["view_api", "API bilgilerini görüntüle", true],
      ["change_api", "API bilgilerini değiştir", true],
      ["change_bank_accounts", "Havale hesaplarını değiştir"],
      ["change_cod", "Kapıda ödeme ayarlarını değiştir"],
      ["change_installments", "Taksit ayarlarını değiştir"],
    ]),
  },
  {
    key: "delivery_settings",
    label: "Kargo / Teslimat Ayarları",
    permissions: p("delivery_settings", [
      ["manage_carriers", "Kargo firmalarını yönet"],
      ["change_fee", "Kargo ücretini değiştir"],
      ["change_free_limit", "Ücretsiz kargo limitini değiştir"],
      ["change_delivery_time", "Teslimat süresini değiştir"],
      ["regional_rules", "Bölgesel kargo kuralları"],
      ["product_rules", "Ürün bazlı kargo kuralı"],
    ]),
  },
  {
    key: "tax",
    label: "Vergi",
    permissions: p("tax", [
      ["view_rates", "KDV oranlarını görüntüle"],
      ["change_rates", "KDV oranlarını değiştir", true],
      ["change_product_class", "Ürün vergi sınıfını değiştir"],
      ["view_reports", "Vergi raporlarını görüntüle"],
    ]),
  },
  {
    key: "settings",
    label: "Site Ayarları",
    permissions: p("settings", [
      ["view", "Ayarları görüntüle"],
      ["edit", "Genel mağaza ayarları"],
      ["brand", "Marka adı"],
      ["logo", "Logo"],
      ["contact", "İletişim bilgileri"],
      ["currency", "Para birimi"],
      ["language", "Dil"],
      ["email", "E-posta ayarları"],
      ["order_numbering", "Sipariş numaralandırma"],
      ["minimum_order", "Minimum sipariş"],
      ["return_period", "İade süresi"],
      ["working_hours", "Çalışma saatleri"],
      ["maintenance", "Bakım modu", true],
    ]),
  },
  {
    key: "domain",
    label: "Domain",
    permissions: p("domain", [
      ["view", "Domain görüntüle"],
      ["add", "Domain ekle", true],
      ["change", "Domain değiştir", true],
      ["manage_redirect", "Redirect yönet", true],
      ["view_ssl", "SSL durumunu görüntüle"],
    ]),
  },
  {
    key: "integrations",
    label: "Entegrasyonlar",
    permissions: p("integrations", [
      ["view", "Entegrasyonları görüntüle"],
      ["add", "Entegrasyon ekle", true],
      ["edit", "Entegrasyon düzenle", true],
      ["delete", "Entegrasyon sil", true],
      ["create_api_key", "API anahtarı oluştur", true],
      ["view_api_key", "API anahtarı görüntüle", true],
      ["revoke_api_key", "API anahtarı iptal et", true],
      ["create_webhook", "Webhook oluştur", true],
      ["delete_webhook", "Webhook sil", true],
    ]),
  },
  {
    key: "pixels",
    label: "Piksel / Reklam",
    permissions: p("pixels", [
      "view",
      "add",
      "edit",
      ["delete", "Sil", true],
      ["google_analytics", "Google Analytics"],
      ["google_ads", "Google Ads"],
      ["meta", "Meta Pixel"],
      ["tiktok", "TikTok Pixel"],
      ["merchant_center", "Merchant Center"],
      ["search_console", "Search Console"],
      ["conversion_api", "Conversion API"],
      ["custom", "Özel script / pixel", true],
    ]),
  },
  {
    key: "users",
    label: "Kullanıcılar",
    permissions: p("users", [
      ["view", "Kullanıcıları görüntüle"],
      ["create", "Kullanıcı ekle", true],
      ["edit", "Kullanıcı düzenle"],
      ["disable", "Kullanıcı pasifleştir", true],
      ["delete", "Kullanıcı sil", true],
      ["reset_password", "Şifre sıfırla", true],
      ["revoke_sessions", "Oturumları kapat", true],
      ["view_logins", "Son girişleri görüntüle"],
    ]),
  },
  {
    key: "roles",
    label: "Roller",
    permissions: p("roles", [
      ["view", "Rol görüntüle"],
      ["create", "Rol oluştur", true],
      ["copy", "Rol kopyala"],
      ["edit", "Rol düzenle", true],
      ["delete", "Rol sil", true],
      ["assign", "Kullanıcıya rol ata", true],
      ["grant", "Yetki ekle", true],
      ["revoke", "Yetki kaldır", true],
    ]),
  },
  {
    key: "approvals",
    label: "İşlem Onayları",
    permissions: p("approvals", [
      ["view", "Onay taleplerini görüntüle"],
      ["request", "Onay talebi oluştur"],
      ["approve", "İşlemi onayla", true],
      ["reject", "İşlemi reddet"],
    ]),
  },
  {
    key: "logs",
    label: "Aktivite Logları",
    permissions: p("logs", [
      ["view", "Aktivite loglarını görüntüle"],
      ["export", "Logları dışa aktar"],
    ]),
  },
  {
    key: "security",
    label: "Güvenlik",
    permissions: p("security", [
      ["enforce_2fa", "2FA zorunlu yap", true],
      ["view_sessions", "Aktif oturumları görüntüle"],
      ["revoke_session", "Oturumu kapat", true],
      ["manage_ip", "IP kısıtlaması", true],
      ["view_logins", "Giriş geçmişi"],
      ["view_failures", "Başarısız girişler"],
      ["manage_alerts", "Şüpheli giriş bildirimi"],
      ["lock_user", "Kullanıcı kilitle", true],
      ["view_api_access", "API erişim geçmişi"],
    ]),
  },
];

export const PERMISSION_SCOPES: Array<{ value: PermissionScope; label: string }> = [
  { value: "none", label: "Yok" },
  { value: "view_only", label: "Sadece görüntüle" },
  { value: "own", label: "Kendisine ait kayıtlar" },
  { value: "assigned", label: "Kendisine atanmış kayıtlar" },
  { value: "category", label: "Belirli kategori" },
  { value: "warehouse", label: "Belirli depo" },
  { value: "brand", label: "Belirli marka" },
  { value: "customer_group", label: "Belirli müşteri grubu" },
  { value: "sales_channel", label: "Belirli satış kanalı" },
  { value: "all", label: "Tüm kayıtlar" },
];

export const APPROVAL_MODES: Array<{ value: ApprovalMode; label: string }> = [
  { value: "allow", label: "Yapabilir" },
  { value: "require_approval", label: "Yönetici onayı gerekir" },
  { value: "deny", label: "Yapamaz" },
];

export const ALL_PERMISSION_KEYS = PERMISSION_MODULES.flatMap((module) =>
  module.permissions.map((x) => x.key),
);
export const PERMISSION_KEYS = new Set(ALL_PERMISSION_KEYS);

export const STARTER_ROLES = [
  { key: "owner", name: "Super Admin / Sahip", modules: ["*"] },
  { key: "manager", name: "Yönetici", modules: ["*"] },
  {
    key: "product_manager",
    name: "Ürün Yöneticisi",
    modules: ["dashboard", "products", "collections", "sets", "inventory", "pricing", "media"],
  },
  {
    key: "order_staff",
    name: "Sipariş Personeli",
    modules: ["dashboard", "orders", "customers", "shipping"],
  },
  {
    key: "production_staff",
    name: "Üretim Personeli",
    modules: ["dashboard", "production", "inventory"],
  },
  {
    key: "sales",
    name: "Teklif / Satış",
    modules: ["dashboard", "customers", "companies", "quotes", "custom_production"],
  },
  {
    key: "content_seo",
    name: "İçerik / SEO",
    modules: ["dashboard", "content", "seo", "media", "blog", "reviews", "theme"],
  },
  {
    key: "marketing",
    name: "Reklam / Pazarlama",
    modules: ["dashboard", "discounts", "newsletter", "analytics", "pixels"],
  },
  { key: "accounting", name: "Muhasebe", modules: ["dashboard", "finance", "tax", "orders"] },
  {
    key: "developer",
    name: "Yazılımcı",
    modules: ["dashboard", "theme", "integrations", "domain", "pixels", "seo", "settings"],
  },
  { key: "warehouse", name: "Depo", modules: ["dashboard", "inventory", "warehouses", "shipping"] },
  { key: "viewer", name: "Sadece Görüntüleme", modules: ["view"] },
] as const;

export function starterRules(key: string): PermissionRule[] {
  const role = STARTER_ROLES.find((x) => x.key === key);
  if (!role) return [];
  const selected =
    role.modules[0] === "*"
      ? PERMISSION_MODULES.flatMap((x) => x.permissions)
      : role.modules[0] === "view"
        ? PERMISSION_MODULES.flatMap((x) =>
            x.permissions.filter((permission) => {
              const action = permission.key.split(".")[1] ?? "";
              return (
                action === "view" ||
                action.startsWith("view_") ||
                x.key === "dashboard" ||
                (x.key === "analytics" && action !== "export")
              );
            }),
          )
        : PERMISSION_MODULES.filter((x) =>
            (role.modules as readonly string[]).includes(x.key),
          ).flatMap((x) => x.permissions);
  const filtered =
    key === "content_seo"
      ? selected.filter(
          (permission) =>
            ![
              "theme.edit_code",
              "theme.edit_js",
              "theme.edit_css",
              "theme.publish",
              "theme.remove_section",
            ].includes(permission.key),
        )
      : selected;
  return filtered.map((permission) => ({
    permission: permission.key,
    scope: key === "viewer" ? "view_only" : "all",
    approval: key === "manager" && permission.risk ? "require_approval" : "allow",
  }));
}

export function permissionLabel(key: string) {
  for (const module of PERMISSION_MODULES) {
    const permission = module.permissions.find((item) => item.key === key);
    if (permission) return `${module.label} · ${permission.label}`;
  }
  return key;
}
