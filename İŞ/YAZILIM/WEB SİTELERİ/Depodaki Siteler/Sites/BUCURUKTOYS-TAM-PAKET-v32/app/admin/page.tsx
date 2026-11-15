"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CatalogProduct, ProductCategory } from "../../lib/products";

type Config = { configured: boolean; setupFields?: Array<{ key: string; value: string }> };
type ViewId = "products" | "inventory" | "quotes" | "dealers" | "print" | "analytics";
type QuoteItem = { id: number; sku: string; product_name: string; pack: string; package_quantity: number };
type Quote = { id: number; reference: string; customer_name: string | null; company_name: string | null; phone: string | null; note: string | null; internal_note?:string|null; status: string; total_lines: number; total_packages: number; created_at: string; quote_items: QuoteItem[] };
type Analytics = { counts: Record<string, number>; topProducts: Array<{ sku: string; views: number; adds: number }> };
type Dealer = { id:number; company_name:string; contact_name:string; phone:string; email:string|null; city:string|null; district:string|null; tax_office:string|null; tax_number:string|null; business_type:string|null; monthly_volume:string|null; note:string|null; internal_note?:string|null; status:string; created_at:string };
type PrintRequest = { id:number; reference:string; customer_name:string; company_name:string|null; phone:string; email:string|null; model_name:string; quantity:number; material:string|null; color:string|null; dimensions:string|null; model_url:string|null; selected_product_sku:string|null; selected_product_name:string|null; estimated_price:number|string|null; file_urls:Array<{name:string;url:string}>; note:string|null; internal_note?:string|null; status:string; created_at:string };
type InventoryMovement = { id:number; product_id:number; change:number; stock_before:number; stock_after:number; reason:string|null; actor_email:string|null; created_at:string; products?:{sku?:string;name?:string}|null };
type CategoryOption = { id:string; name:string; slug:string; is_visible:boolean; sort_order:number };
type FormState = {
  id?: number;
  sku: string;
  name: string;
  category: ProductCategory;
  pack: string;
  description: string;
  price: string;
  costPrice: string;
  stock: string;
  barcode: string;
  minOrderPackages: string;
  lowStockThreshold: string;
  supplier: string;
  ageGroup: string;
  conformityDeclaration: string;
  productDimensions: string;
  cartonDimensions: string;
  cartonDesi: string;
  cartonWeightKg: string;
  originCountry: string;
  safetyNote: string;
  licenseNote: string;
  imageUrl: string;
  gallery: string[];
  isPriceVisible: boolean;
  isPublished: boolean;
  sortOrder: string;
};

const categoryNames: Record<string, string> = {
  outdoor: "Dış Mekân",
  fun: "Şaka & Eğlence",
  skill: "Zekâ & Beceri",
  sensory: "Stres & Duyusal",
  stationery: "Kırtasiye & Sticker",
  accessory: "Anahtarlık & Aksesuar",
  "3d": "3D Baskı",
};

const emptyForm: FormState = {
  sku: "",
  name: "",
  category: "fun",
  pack: "",
  description: "",
  price: "",
  costPrice: "",
  stock: "0",
  barcode: "",
  minOrderPackages: "1",
  lowStockThreshold: "5",
  supplier: "",
  ageGroup: "",
  conformityDeclaration: "",
  productDimensions: "",
  cartonDimensions: "",
  cartonDesi: "",
  cartonWeightKg: "",
  originCountry: "",
  safetyNote: "",
  licenseNote: "",
  imageUrl: "",
  gallery: [],
  isPriceVisible: false,
  isPublished: true,
  sortOrder: "0",
};

const adminImage = (image: string) => !image ? "/assets/bucuruktoys-avatar.svg" : /^https?:\/\//i.test(image) ? image : `/products/${image}`;
const quoteStatusNames: Record<string, string> = { new: "Yeni", contacted: "İletişime geçildi", quoted: "Fiyat verildi", approved: "Onaylandı", completed: "Tamamlandı", cancelled: "İptal" };
const dealerStatusNames: Record<string,string> = { new:"Yeni", reviewing:"İnceleniyor", approved:"Onaylandı", rejected:"Reddedildi" };
const printStatusNames: Record<string,string> = { new:"Yeni", reviewing:"İnceleniyor", quoted:"Fiyat verildi", approved:"Onaylandı", production:"Üretimde", completed:"Tamamlandı", rejected:"Reddedildi" };
function csvCell(value: unknown) {
  const text = String(value ?? "");
  return /[";,\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function parseCsv(text: string) {
  const delimiter = (text.split("\n")[0]?.match(/;/g)?.length ?? 0) > (text.split("\n")[0]?.match(/,/g)?.length ?? 0) ? ";" : ",";
  const rows: string[][] = [];
  let row: string[] = [], cell = "", quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (character === '"') {
      if (quoted && text[index + 1] === '"') { cell += '"'; index += 1; }
      else quoted = !quoted;
    } else if (character === delimiter && !quoted) { row.push(cell); cell = ""; }
    else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && text[index + 1] === "\n") index += 1;
      row.push(cell); if (row.some((value) => value.trim())) rows.push(row); row = []; cell = "";
    } else cell += character;
  }
  row.push(cell); if (row.some((value) => value.trim())) rows.push(row);
  return rows;
}

function apiError(error: unknown) {
  return error instanceof Error ? error.message : "Beklenmeyen bir hata oluştu.";
}
function htmlEscape(value: unknown) { return String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[character] ?? character)); }
function editableValue(value: unknown) { return typeof value === "string" && !value.includes("DOLDURULACAK") ? value : ""; }
function displayValue(value: unknown, fallback = "Girilmedi") { return editableValue(value) || fallback; }

export default function AdminPage() {
  const [config, setConfig] = useState<Config | null>(null);
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [recoveryToken,setRecoveryToken]=useState("");
  const [newPassword,setNewPassword]=useState("");
  const [newPasswordAgain,setNewPasswordAgain]=useState("");
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [printRequests, setPrintRequests] = useState<PrintRequest[]>([]);
  const [inventory, setInventory] = useState<InventoryMovement[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [view, setView] = useState<ViewId>("products");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | ProductCategory>("all");
  const [form, setForm] = useState<FormState | null>(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [stockProduct, setStockProduct] = useState<CatalogProduct | null>(null);
  const [stockChange, setStockChange] = useState("");
  const [stockReason, setStockReason] = useState("");
  const importRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fragment=new URLSearchParams(window.location.hash.replace(/^#/,""));
    if(fragment.get("type")==="recovery"&&fragment.get("access_token")){
      setRecoveryToken(fragment.get("access_token")??"");
      window.history.replaceState(null,"",window.location.pathname);
    }else if(fragment.get("error_description")){
      setMessage(decodeURIComponent(fragment.get("error_description")??"Kurtarma bağlantısı geçersiz."));
      window.history.replaceState(null,"",window.location.pathname);
    }
    const savedToken = window.sessionStorage.getItem("bucuruktoys-admin-token") ?? "";
    setToken(savedToken);
    fetch("/api/admin/config", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: Config) => setConfig(data))
      .catch(() => setConfig({ configured: false }))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (token && config?.configured) void loadDashboard(token);
  }, [token, config?.configured]);

  const visibleProducts = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("tr-TR");
    return products.filter((product) =>
      (category === "all" || product.category === category) &&
      (!term || `${product.sku} ${product.name} ${product.pack}`.toLocaleLowerCase("tr-TR").includes(term)),
    );
  }, [products, query, category]);

  const stats = useMemo(() => ({
    total: products.length,
    published: products.filter((product) => product.isPublished).length,
    lowStock: products.filter((product) => product.stock <= product.lowStockThreshold).length,
    visiblePrices: products.filter((product) => product.isPriceVisible && product.price !== null).length,
  }), [products]);

  async function authorizedFetch(url: string, init: RequestInit = {}, accessToken = token) {
    const response = await fetch(url, {
      ...init,
      headers: { Authorization: `Bearer ${accessToken}`, ...(init.headers ?? {}) },
      cache: "no-store",
    });
    const data = await response.json().catch(() => ({})) as { error?: string; errors?: Array<{ row: number; message: string }> };
    if (response.status === 401 || response.status === 403) {
      window.sessionStorage.removeItem("bucuruktoys-admin-token");
      setToken("");
    }
    if (!response.ok) {
      const details = data.errors?.slice(0, 4).map((item) => `Satır ${item.row}: ${item.message}`).join(" · ");
      throw new Error([data.error || "İşlem tamamlanamadı.", details].filter(Boolean).join(" "));
    }
    return data as Record<string, unknown>;
  }

  async function loadProducts(accessToken = token) {
    setLoading(true);
    try {
      const data = await authorizedFetch("/api/admin/products", {}, accessToken);
      setProducts(data.products as CatalogProduct[]);
      setCategories((data.categories as CategoryOption[]) ?? []);
      setMessage("");
    } catch (error) {
      setMessage(apiError(error));
    } finally {
      setLoading(false);
    }
  }

  async function loadDashboard(accessToken = token) {
    setLoading(true);
    const [productResult, quoteResult, dealerResult, printResult, inventoryResult, analyticsResult] = await Promise.allSettled([
      authorizedFetch("/api/admin/products", {}, accessToken),
      authorizedFetch("/api/admin/quotes", {}, accessToken),
      authorizedFetch("/api/admin/dealers", {}, accessToken),
      authorizedFetch("/api/admin/print-requests", {}, accessToken),
      authorizedFetch("/api/admin/inventory", {}, accessToken),
      authorizedFetch("/api/admin/analytics", {}, accessToken),
    ]);
    if (productResult.status === "fulfilled") {
      setProducts(productResult.value.products as CatalogProduct[]);
      setCategories((productResult.value.categories as CategoryOption[]) ?? []);
    }
    else setMessage(apiError(productResult.reason));
    if (quoteResult.status === "fulfilled") setQuotes(quoteResult.value.quotes as Quote[]);
    if (dealerResult.status === "fulfilled") setDealers(dealerResult.value.applications as Dealer[]);
    if (printResult.status === "fulfilled") setPrintRequests(printResult.value.requests as PrintRequest[]);
    if (inventoryResult.status === "fulfilled") setInventory(inventoryResult.value.movements as InventoryMovement[]);
    if (analyticsResult.status === "fulfilled") setAnalytics(analyticsResult.value as unknown as Analytics);
    setLoading(false);
  }

  async function login(event: React.FormEvent) {
    event.preventDefault();
    if (!config?.configured) return;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: username.trim(), password }),
      });
      const data = await response.json().catch(() => ({})) as { accessToken?: string; error?: string };
      if (!response.ok || !data.accessToken) throw new Error(data.error || "Kullanıcı adı veya şifre hatalı.");
      window.sessionStorage.setItem("bucuruktoys-admin-token", data.accessToken);
      setToken(data.accessToken);
      setPassword("");
    } catch (error) {
      setMessage(apiError(error));
    } finally {
      setBusy(false);
    }
  }

  async function recoverPassword() {
    if (!username.trim()) { setMessage("Önce e-posta adresinizi yazın."); return; }
    setBusy(true);
    try {
      const response = await fetch("/api/admin/recover", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({email:username.trim()}) });
      const data = await response.json() as {message?:string};
      setMessage(data.message || "Hesap kayıtlıysa şifre bağlantısı gönderildi.");
    } catch { setMessage("Şifre bağlantısı gönderilemedi."); }
    finally { setBusy(false); }
  }

  async function resetPassword(event:React.FormEvent){
    event.preventDefault();
    if(newPassword!==newPasswordAgain){setMessage("Şifreler aynı değil.");return;}
    setBusy(true);setMessage("");
    try{const response=await fetch("/api/admin/reset-password",{method:"POST",headers:{Authorization:`Bearer ${recoveryToken}`,"Content-Type":"application/json"},body:JSON.stringify({password:newPassword})});const data=await response.json() as {message?:string;error?:string};if(!response.ok)throw new Error(data.error||"Şifre güncellenemedi.");setRecoveryToken("");setNewPassword("");setNewPasswordAgain("");setMessage(data.message||"Şifreniz oluşturuldu.");}catch(error){setMessage(apiError(error));}finally{setBusy(false);}
  }

  function logout() {
    window.sessionStorage.removeItem("bucuruktoys-admin-token");
    setToken("");
    setProducts([]);
  }

  function editProduct(product: CatalogProduct) {
    setForm({
      id: product.id,
      sku: product.sku,
      name: editableValue(product.name),
      category: product.category,
      pack: editableValue(product.pack),
      description: editableValue(product.note),
      price: product.price === null ? "" : String(product.price),
      costPrice: product.costPrice === null ? "" : String(product.costPrice),
      stock: String(product.stock),
      barcode: editableValue(product.barcode),
      minOrderPackages: String(product.minOrderPackages),
      lowStockThreshold: String(product.lowStockThreshold),
      supplier: editableValue(product.supplier),
      ageGroup: editableValue(product.ageGroup),
      conformityDeclaration: editableValue(product.conformityDeclaration),
      productDimensions: editableValue(product.productDimensions),
      cartonDimensions: editableValue(product.cartonDimensions),
      cartonDesi: product.cartonDesi === null ? "" : String(product.cartonDesi),
      cartonWeightKg: product.cartonWeightKg === null ? "" : String(product.cartonWeightKg),
      originCountry: editableValue(product.originCountry),
      safetyNote: editableValue(product.safetyNote),
      licenseNote: editableValue(product.licenseNote),
      imageUrl: product.image,
      gallery: product.gallery,
      isPriceVisible: product.isPriceVisible,
      isPublished: product.isPublished,
      sortOrder: String(product.sortOrder),
    });
  }

  function nextSku() {
    const highest = products.reduce((max, product) => {
      const match = product.sku.match(/BT-(\d+)/i);
      return match ? Math.max(max, Number(match[1])) : max;
    }, 0);
    return `BT-${String(highest + 1).padStart(3, "0")}`;
  }

  async function saveProduct(event: React.FormEvent) {
    event.preventDefault();
    if (!form) return;
    setBusy(true);
    setMessage("");
    try {
      const body = {
        ...(form.id ? { id: form.id } : {}),
        sku: form.sku,
        name: form.name,
        category: form.category,
        pack: form.pack,
        description: form.description,
        price: form.price,
        costPrice: form.costPrice,
        stock: form.stock,
        barcode: form.barcode,
        minOrderPackages: form.minOrderPackages,
        lowStockThreshold: form.lowStockThreshold,
        supplier: form.supplier,
        ageGroup: form.ageGroup,
        conformityDeclaration: form.conformityDeclaration,
        productDimensions: form.productDimensions,
        cartonDimensions: form.cartonDimensions,
        cartonDesi: form.cartonDesi,
        cartonWeightKg: form.cartonWeightKg,
        originCountry: form.originCountry,
        safetyNote: form.safetyNote,
        licenseNote: form.licenseNote,
        imageUrl: form.imageUrl,
        gallery: form.gallery,
        isPriceVisible: form.isPriceVisible,
        isPublished: form.isPublished,
        sortOrder: form.sortOrder,
      };
      await authorizedFetch("/api/admin/products", {
        method: form.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await loadProducts();
      setForm(null);
      setMessage(form.id ? "Ürün güncellendi." : "Ürün eklendi.");
    } catch (error) {
      setMessage(apiError(error));
    } finally {
      setBusy(false);
    }
  }

  async function deleteProduct(product: CatalogProduct) {
    if (!window.confirm(`${product.sku} — ${product.name} kalıcı olarak silinsin mi?`)) return;
    setBusy(true);
    try {
      await authorizedFetch(`/api/admin/products?id=${product.id}`, { method: "DELETE" });
      setProducts((current) => current.filter((item) => item.id !== product.id));
      setMessage("Ürün silindi.");
    } catch (error) {
      setMessage(apiError(error));
    } finally {
      setBusy(false);
    }
  }

  function downloadCsv(filename: string, rows: unknown[][]) {
    const content = `\uFEFF${rows.map((row) => row.map(csvCell).join(";")).join("\r\n")}`;
    const url = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url; anchor.download = filename; anchor.click();
    URL.revokeObjectURL(url);
  }

  function exportProducts() {
    downloadCsv(`bucuruktoys-urunler-${new Date().toISOString().slice(0, 10)}.csv`, [
      ["sku","name","category","pack","description","price","costPrice","stock","barcode","minOrderPackages","lowStockThreshold","supplier","ageGroup","conformityDeclaration","productDimensions","cartonDimensions","cartonDesi","cartonWeightKg","originCountry","safetyNote","licenseNote","imageUrl","isPriceVisible","isPublished","sortOrder"],
      ...products.map((product) => [product.sku, product.name, product.category, product.pack, product.note ?? "", product.price ?? "", product.costPrice ?? "", product.stock, product.barcode, product.minOrderPackages, product.lowStockThreshold, product.supplier, product.ageGroup, product.conformityDeclaration, product.productDimensions, product.cartonDimensions, product.cartonDesi ?? "", product.cartonWeightKg ?? "", product.originCountry, product.safetyNote, product.licenseNote, product.image, product.isPriceVisible, product.isPublished, product.sortOrder]),
    ]);
  }

  function downloadTemplate() {
    downloadCsv("bucuruktoys-urun-sablonu.csv", [
      ["sku","name","category","pack","description","price","costPrice","stock","barcode","minOrderPackages","lowStockThreshold","supplier","ageGroup","conformityDeclaration","productDimensions","cartonDimensions","cartonDesi","cartonWeightKg","originCountry","safetyNote","licenseNote","imageUrl","isPriceVisible","isPublished","sortOrder"],
      [nextSku(),"","fun","","","","","0","","1","5","","","","","","","","","","","","false","true",products.length + 1],
    ]);
  }

  async function importProducts(file: File) {
    setBusy(true); setMessage("Ürün dosyası kontrol ediliyor…");
    try {
      const rows = parseCsv(await file.text());
      const headers = rows[0]?.map((value) => value.replace(/^\uFEFF/, "").trim());
      const required = ["sku","name","category","pack"];
      if (!headers || required.some((header) => !headers.includes(header))) throw new Error("CSV başlıkları geçerli değil. Paneldeki örnek şablonu kullanın.");
      const values = rows.slice(1).map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ""]))).map((item, index) => ({
        sku: item.sku,
        name: item.name,
        category: item.category,
        pack: item.pack,
        description: item.description ?? "",
        price: item.price ?? "",
        costPrice: item.costPrice ?? "",
        stock: item.stock ?? "0",
        barcode: item.barcode ?? "",
        minOrderPackages: item.minOrderPackages ?? "1",
        lowStockThreshold: item.lowStockThreshold ?? "5",
        supplier: item.supplier ?? "",
        ageGroup: item.ageGroup ?? "",
        conformityDeclaration: item.conformityDeclaration ?? "",
        productDimensions: item.productDimensions ?? "",
        cartonDimensions: item.cartonDimensions ?? "",
        cartonDesi: item.cartonDesi ?? "",
        cartonWeightKg: item.cartonWeightKg ?? "",
        originCountry: item.originCountry ?? "",
        safetyNote: item.safetyNote ?? "",
        licenseNote: item.licenseNote ?? "",
        imageUrl: item.imageUrl ?? "",
        gallery: [],
        isPriceVisible: /^(true|1|evet)$/i.test(item.isPriceVisible ?? ""),
        isPublished: !/^(false|0|hayır|hayir)$/i.test(item.isPublished ?? ""),
        sortOrder: item.sortOrder || String(index + 1),
      }));
      const data = await authorizedFetch("/api/admin/products/bulk", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ products: values }) });
      await loadProducts();
      setMessage(`${Number(data.count ?? values.length)} ürün başarıyla aktarıldı/güncellendi.`);
    } catch (error) { setMessage(apiError(error)); }
    finally { setBusy(false); if (importRef.current) importRef.current.value = ""; }
  }

  async function adjustStock(event: React.FormEvent) {
    event.preventDefault();
    if (!stockProduct) return;
    setBusy(true);
    try {
      const data = await authorizedFetch("/api/admin/inventory", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId: stockProduct.id, change: stockChange, reason: stockReason }) });
      const updated = data.product as CatalogProduct;
      setProducts((current) => current.map((product) => product.id === updated.id ? updated : product));
      const history = await authorizedFetch("/api/admin/inventory");
      setInventory(history.movements as InventoryMovement[]);
      setStockProduct(null); setStockChange(""); setStockReason(""); setMessage("Stok hareketi kaydedildi.");
    } catch (error) { setMessage(apiError(error)); }
    finally { setBusy(false); }
  }

  async function updateQuoteStatus(id: number, status: string) {
    setBusy(true);
    try {
      await authorizedFetch("/api/admin/quotes", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
      setQuotes((current) => current.map((quote) => quote.id === id ? { ...quote, status } : quote));
      setMessage("Teklif durumu güncellendi.");
    } catch (error) { setMessage(apiError(error)); }
    finally { setBusy(false); }
  }

  async function updateDealerStatus(id: number, status: string) {
    setBusy(true);
    try {
      await authorizedFetch("/api/admin/dealers", { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({id,status}) });
      setDealers((current)=>current.map((item)=>item.id===id?{...item,status}:item)); setMessage("Bayilik başvurusu güncellendi.");
    } catch(error){setMessage(apiError(error));} finally{setBusy(false);}
  }

  async function updatePrintStatus(id: number, status: string) {
    setBusy(true);
    try {
      await authorizedFetch("/api/admin/print-requests", { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({id,status}) });
      setPrintRequests((current)=>current.map((item)=>item.id===id?{...item,status}:item)); setMessage("3D üretim talebi güncellendi.");
    } catch(error){setMessage(apiError(error));} finally{setBusy(false);}
  }

  async function manageRequest(kind:"quotes"|"dealers"|"print-requests",id:number,currentNote:string|null|undefined,action:"note"|"delete"){
    if(action==="delete"&&!window.confirm("Bu kayıt kalıcı olarak silinsin mi?"))return;
    const internalNote=action==="note"?window.prompt("Yalnızca yöneticilerin görebileceği iç not:",currentNote??""):null;
    if(action==="note"&&internalNote===null)return;
    setBusy(true);
    try{
      await authorizedFetch(`/api/admin/${kind}${action==="delete"?`?id=${id}`:""}`,action==="delete"?{method:"DELETE"}:{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id,internalNote})});
      const update=<T extends {id:number;internal_note?:string|null},>(items:T[])=>action==="delete"?items.filter((item)=>item.id!==id):items.map((item)=>item.id===id?{...item,internal_note:internalNote}:item);
      if(kind==="quotes")setQuotes((items)=>update(items));else if(kind==="dealers")setDealers((items)=>update(items));else setPrintRequests((items)=>update(items));
      setMessage(action==="delete"?"Kayıt silindi.":"İç not güncellendi.");
    }catch(error){setMessage(apiError(error));}finally{setBusy(false);}
  }

  function exportRequests(kind:"quotes"|"dealers"|"print"){
    if(kind==="quotes")downloadCsv("teklifler.csv",[["Referans","Müşteri","Firma","Telefon","Durum","Kalem","Adet","Not","İç not","Tarih"],...quotes.map((q)=>[q.reference,q.customer_name,q.company_name,q.phone,q.status,q.total_lines,q.total_packages,q.note,q.internal_note,q.created_at])]);
    else if(kind==="dealers")downloadCsv("bayilik-basvurulari.csv",[["Firma","Yetkili","Telefon","E-posta","Şehir","İlçe","Durum","Not","İç not","Tarih"],...dealers.map((d)=>[d.company_name,d.contact_name,d.phone,d.email,d.city,d.district,d.status,d.note,d.internal_note,d.created_at])]);
    else downloadCsv("3d-talepleri.csv",[["Referans","Model","Müşteri","Telefon","Adet","Durum","Not","İç not","Tarih"],...printRequests.map((p)=>[p.reference,p.model_name,p.customer_name,p.phone,p.quantity,p.status,p.note,p.internal_note,p.created_at])]);
  }

  function printQuote(quote: Quote) {
    const items = quote.quote_items.map((item)=>`<tr><td>${htmlEscape(item.sku)}</td><td>${htmlEscape(item.product_name)}</td><td>${htmlEscape(item.pack)}</td><td>${item.package_quantity}</td></tr>`).join("");
    const html = `<!doctype html><html lang="tr"><head><meta charset="utf-8"><title>${htmlEscape(quote.reference)}</title><style>body{font-family:Arial;color:#17352d;padding:40px;max-width:900px;margin:auto}header{display:flex;justify-content:space-between;border-bottom:2px solid #17352d;padding-bottom:18px}h1{font-size:26px}table{width:100%;border-collapse:collapse;margin:30px 0}th,td{text-align:left;padding:12px;border-bottom:1px solid #ddd}footer{display:flex;justify-content:flex-end;gap:30px;font-weight:bold}@media print{button{display:none}}</style></head><body><header><div><h1>BÜCÜRÜKTOYS</h1><p>Toptan oyuncak teklif listesi</p></div><div><b>${htmlEscape(quote.reference)}</b><p>${new Date(quote.created_at).toLocaleString("tr-TR")}</p></div></header><h2>${htmlEscape(quote.company_name || quote.customer_name || "Müşteri")}</h2><p>${htmlEscape(quote.phone || "")}</p><table><thead><tr><th>Stok kodu</th><th>Ürün</th><th>Paket / koli</th><th>Talep adedi</th></tr></thead><tbody>${items}</tbody></table><p>${htmlEscape(quote.note || "")}</p><footer><span>${quote.total_lines} kalem</span><span>${quote.total_packages} adet</span></footer><script>window.print()</script></body></html>`;
    const url = URL.createObjectURL(new Blob([html],{type:"text/html"})); window.open(url,"_blank","noopener,noreferrer"); window.setTimeout(()=>URL.revokeObjectURL(url),60_000);
  }

  async function uploadImage(file: File, target: "cover" | "gallery") {
    if (!form) return;
    setBusy(true);
    setMessage("Görsel yükleniyor…");
    try {
      const body = new FormData();
      body.append("file", file);
      const data = await authorizedFetch("/api/admin/upload", { method: "POST", body });
      const url = String(data.url ?? "");
      setForm((current) => current ? target === "cover"
        ? { ...current, imageUrl: url }
        : { ...current, gallery: [...current.gallery, url].slice(0, 12) }
        : current);
      setMessage("Görsel yüklendi. Ürünü kaydetmeyi unutmayın.");
    } catch (error) {
      setMessage(apiError(error));
    } finally {
      setBusy(false);
    }
  }

  if (loading && !config) return <main className="admin-shell admin-center"><div className="admin-loader" /><p>Yönetim paneli hazırlanıyor…</p></main>;

  if (config && !config.configured) {
    return (
      <main className="admin-shell admin-center">
        <section className="setup-card">
          <img src="/assets/bucuruktoys-logo.svg" alt="BÜCÜRÜKTOYS" width="1460" height="288" />
          <span className="status-pill">Altyapı hazır</span>
          <h1>Yönetim bağlantısı eksik.</h1>
          <p>Panel ve RLS korumalı ürün yönetimi hazır. Aşağıdaki bağlantı bilgilerinden biri veya daha fazlası henüz tanımlanmadı.</p>
          <ol className="setup-list setup-fields">{(config.setupFields ?? []).map((field, index) => <li key={field.key}><strong>{index + 1}</strong><span>{field.key}<b>{field.value}</b></span></li>)}</ol>
          <a className="setup-action" href="https://supabase.com/dashboard" target="_blank" rel="noreferrer">Supabase'i aç ↗</a>
          <a href="/">Kataloğa dön</a>
        </section>
      </main>
    );
  }

  if(recoveryToken){return <main className="admin-shell admin-center"><form className="login-card" onSubmit={resetPassword}><img src="/assets/bucuruktoys-logo.svg" alt="BÜCÜRÜKTOYS" width="1460" height="288"/><p className="kicker">Güvenli hesap kurtarma</p><h1>Yeni şifrenizi belirleyin.</h1><p className="login-note">En az 10 karakter, bir harf ve bir rakam kullanın.</p><label>Yeni şifre<input type="password" value={newPassword} onChange={(event)=>setNewPassword(event.target.value)} autoComplete="new-password" minLength={10} required/></label><label>Yeni şifre tekrar<input type="password" value={newPasswordAgain} onChange={(event)=>setNewPasswordAgain(event.target.value)} autoComplete="new-password" minLength={10} required/></label>{message&&<p className="form-message error">{message}</p>}<button type="submit" disabled={busy}>{busy?"Güncelleniyor…":"Şifreyi kaydet"}</button></form></main>;}

  if (!token) {
    return (
      <main className="admin-shell admin-center">
        <form className="login-card" onSubmit={login}>
          <img src="/assets/bucuruktoys-logo.svg" alt="BÜCÜRÜKTOYS" width="1460" height="288" />
          <p className="kicker">Yönetim paneli</p>
          <h1>Yönetici girişi.</h1>
          <p className="login-note">Yetkili yönetici hesabınızla devam edin.</p>
          <label>E-posta<input type="email" value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required /></label>
          <label>Şifre<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /></label>
          {message && <p className="form-message error">{message}</p>}
          <button type="submit" disabled={busy}>{busy ? "Giriş yapılıyor…" : "Giriş yap"}</button>
          <button type="button" className="auth-switch" onClick={() => void recoverPassword()} disabled={busy}>Şifremi oluştur / sıfırla</button>
          <a href="/">← Kataloğa dön</a>
        </form>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <a href="/" className="admin-brand"><img src="/assets/bucuruktoys-logo.svg" alt="BÜCÜRÜKTOYS" width="1460" height="288" /></a>
        <div><a href="/admin/yonetim">Site yönetimi</a><a href="/urunler" target="_blank">Canlı kataloğu aç ↗</a><button onClick={logout}>Çıkış</button></div>
      </header>

      <div className="admin-content">
        <nav className="admin-nav" aria-label="Yönetim bölümleri">
          <button className={view === "products" ? "active" : ""} onClick={() => setView("products")}>Ürünler <span>{products.length}</span></button>
          <button className={view === "inventory" ? "active" : ""} onClick={() => setView("inventory")}>Stok hareketleri <span>{inventory.length}</span></button>
          <button className={view === "quotes" ? "active" : ""} onClick={() => setView("quotes")}>Teklifler <span>{quotes.filter((quote) => quote.status === "new").length}</span></button>
          <button className={view === "dealers" ? "active" : ""} onClick={() => setView("dealers")}>Bayilik <span>{dealers.filter((item) => item.status === "new").length}</span></button>
          <button className={view === "print" ? "active" : ""} onClick={() => setView("print")}>3D talepler <span>{printRequests.filter((item) => item.status === "new").length}</span></button>
          <a href="/admin/3d-urunler">3D ürünler ↗</a>
          <a href="/admin/yonetim">İçerik ve ayarlar ↗</a>
          <button className={view === "analytics" ? "active" : ""} onClick={() => setView("analytics")}>Raporlar</button>
        </nav>

        <section className="admin-title">
          {view === "products" && <><div><p className="kicker">Ürün yönetimi</p><h1>Katalog kontrol merkezi.</h1><p>Ürün, stok, fiyat, yayın durumu ve görselleri tek yerden yönetin.</p></div><button className="new-product" onClick={() => setForm({ ...emptyForm, sku: nextSku(), sortOrder: String(products.length + 1) })}>+ Yeni ürün ekle</button></>}
          {view === "inventory" && <div><p className="kicker">Stok denetimi</p><h1>Stok hareket geçmişi.</h1><p>Giriş, çıkış ve düzeltmeleri ürün, önceki stok ve işlem notuyla izleyin.</p></div>}
          {view === "quotes" && <><div><p className="kicker">Satış takibi</p><h1>Teklif talepleri.</h1><p>Katalogdan gelen müşteri listelerini takip edin ve sonuçlandırın.</p></div><button className="new-product" onClick={()=>exportRequests("quotes")}>CSV indir</button></>}
          {view === "dealers" && <><div><p className="kicker">Kurumsal satış</p><h1>Bayilik başvuruları.</h1><p>Firma bilgilerini inceleyin, iletişime geçin ve durumu yönetin.</p></div><button className="new-product" onClick={()=>exportRequests("dealers")}>CSV indir</button></>}
          {view === "print" && <><div><p className="kicker">Özel üretim</p><h1>3D baskı talepleri.</h1><p>Model, adet ve üretim ayrıntılarını teklif sürecine taşıyın.</p></div><button className="new-product" onClick={()=>exportRequests("print")}>CSV indir</button></>}
          {view === "analytics" && <div><p className="kicker">Son 30 gün</p><h1>Katalog performansı.</h1><p>Ürün görüntüleme ve teklif dönüşüm hareketlerini izleyin.</p></div>}
        </section>

        {view === "products" && <section className="stat-grid" aria-label="Katalog özeti"><div><span>Toplam ürün</span><strong>{stats.total}</strong></div><div><span>Yayında</span><strong>{stats.published}</strong></div><div><span>Kritik stok</span><strong>{stats.lowStock}</strong></div><div><span>Fiyatı görünür</span><strong>{stats.visiblePrices}</strong></div></section>}
        {view === "inventory" && <section className="stat-grid" aria-label="Stok özeti"><div><span>Hareket kaydı</span><strong>{inventory.length}</strong></div><div><span>Stok girişi</span><strong>{inventory.filter((item)=>item.change>0).length}</strong></div><div><span>Stok çıkışı</span><strong>{inventory.filter((item)=>item.change<0).length}</strong></div><div><span>Kritik ürün</span><strong>{stats.lowStock}</strong></div></section>}
        {view === "quotes" && <section className="stat-grid" aria-label="Teklif özeti"><div><span>Toplam talep</span><strong>{quotes.length}</strong></div><div><span>Yeni</span><strong>{quotes.filter((quote) => quote.status === "new").length}</strong></div><div><span>Onaylanan</span><strong>{quotes.filter((quote) => quote.status === "approved").length}</strong></div><div><span>Tamamlanan</span><strong>{quotes.filter((quote) => quote.status === "completed").length}</strong></div></section>}
        {view === "analytics" && <section className="stat-grid" aria-label="Performans özeti"><div><span>Ürün görüntüleme</span><strong>{analytics?.counts.product_view ?? 0}</strong></div><div><span>Teklife ekleme</span><strong>{analytics?.counts.offer_add ?? 0}</strong></div><div><span>WhatsApp geçişi</span><strong>{analytics?.counts.whatsapp_click ?? 0}</strong></div><div><span>Arama</span><strong>{analytics?.counts.catalog_search ?? 0}</strong></div></section>}

        {message && <p className={`form-message ${message.includes("güncellendi") || message.includes("eklendi") || message.includes("silindi") ? "success" : ""}`}>{message}</p>}

        {view === "products" && <section className="product-panel">
          <div className="panel-tools">
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Kod veya ürün adı ara…" aria-label="Ürün ara" />
            <select value={category} onChange={(event) => setCategory(event.target.value as "all" | ProductCategory)} aria-label="Kategori filtrele">
              <option value="all">Tüm kategoriler</option>
              {(categories.length ? categories : Object.entries(categoryNames).map(([id,name])=>({id,name} as CategoryOption))).map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}
            </select>
            <div className="bulk-actions">
              <button type="button" onClick={downloadTemplate}>Şablon</button>
              <button type="button" onClick={() => importRef.current?.click()}>CSV yükle</button>
              <button type="button" onClick={exportProducts}>Dışa aktar</button>
              <input ref={importRef} type="file" accept=".csv,text/csv" hidden onChange={(event) => event.target.files?.[0] && void importProducts(event.target.files[0])} />
            </div>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Ürün</th><th>Kategori</th><th>Stok</th><th>Fiyat</th><th>Durum</th><th /></tr></thead>
              <tbody>
                {visibleProducts.map((product) => (
                  <tr key={product.id}>
                    <td><div className="product-cell"><img src={adminImage(product.image)} alt="" /><span><strong>{displayValue(product.name, "İsimsiz ürün")}</strong><small>{product.sku} · {displayValue(product.pack)}</small></span></div></td>
                    <td>{categories.find((item)=>item.id===product.category)?.name || categoryNames[product.category] || product.category}</td>
                    <td><span className={product.stock <= product.lowStockThreshold ? "stock-low" : ""}>{product.stock}</span><small className="hidden-label">eşik {product.lowStockThreshold}</small></td>
                    <td>{product.price === null ? "Girilmedi" : `${product.price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺`}{product.price !== null && !product.isPriceVisible && <small className="hidden-label">gizli</small>}{product.price !== null && product.costPrice !== null && product.price > 0 && <small className="margin-label">%{Math.round(((product.price-product.costPrice)/product.price)*100)} brüt marj</small>}</td>
                    <td><span className={product.isPublished ? "publish on" : "publish"}>{product.isPublished ? "Yayında" : "Taslak"}</span></td>
                    <td><div className="row-actions"><button onClick={() => { setStockProduct(product); setStockChange(""); setStockReason(""); }}>Stok</button><button onClick={() => editProduct(product)}>Düzenle</button><button className="danger" onClick={() => deleteProduct(product)} disabled={busy}>Sil</button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!loading && visibleProducts.length === 0 && <div className="admin-empty">Bu filtreye uygun ürün bulunamadı.</div>}
            {loading && <div className="admin-empty">Ürünler yükleniyor…</div>}
          </div>
        </section>}

        {view === "inventory" && <section className="product-panel"><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Tarih</th><th>Ürün</th><th>Hareket</th><th>Önce</th><th>Sonra</th><th>Açıklama</th><th>İşlemi yapan</th></tr></thead><tbody>{inventory.map((item)=><tr key={item.id}><td>{new Date(item.created_at).toLocaleString("tr-TR")}</td><td><strong>{item.products?.name||`Ürün #${item.product_id}`}</strong><small className="hidden-label">{item.products?.sku||""}</small></td><td><span className={item.change<0?"movement-out":"movement-in"}>{item.change>0?`+${item.change}`:item.change}</span></td><td>{item.stock_before}</td><td><strong>{item.stock_after}</strong></td><td>{item.reason||"Açıklama yok"}</td><td>{item.actor_email||"Sistem"}</td></tr>)}</tbody></table>{!loading&&inventory.length===0&&<div className="admin-empty">Henüz stok hareketi kaydedilmedi.</div>}</div></section>}

        {view === "quotes" && <section className="quote-grid">
          {quotes.map((quote) => <article className="quote-card" key={quote.id}>
            <header><div><span>{quote.reference}</span><time>{new Date(quote.created_at).toLocaleString("tr-TR")}</time></div><select value={quote.status} onChange={(event) => void updateQuoteStatus(quote.id, event.target.value)} disabled={busy}>{Object.entries(quoteStatusNames).map(([id, name]) => <option value={id} key={id}>{name}</option>)}</select></header>
            <div className="quote-customer"><strong>{quote.company_name || quote.customer_name || "İsimsiz müşteri"}</strong>{quote.company_name && quote.customer_name && <span>{quote.customer_name}</span>}{quote.phone && <a href={`https://wa.me/${quote.phone.replace(/\D/g, "")}`} target="_blank">{quote.phone} ↗</a>}{quote.note && <p>{quote.note}</p>}</div>
            <div className="quote-items">{quote.quote_items.map((item) => <div key={item.id}><span><strong>{item.sku}</strong>{item.product_name}<small>{item.pack}</small></span><b>{item.package_quantity} adet</b></div>)}</div>
            {quote.internal_note&&<p><strong>İç not:</strong> {quote.internal_note}</p>}<footer><span>{quote.total_lines} kalem</span><strong>{quote.total_packages} adet</strong><button className="quote-print" onClick={()=>printQuote(quote)}>PDF / Yazdır</button><button onClick={()=>void manageRequest("quotes",quote.id,quote.internal_note,"note")}>İç not</button><button className="danger" onClick={()=>void manageRequest("quotes",quote.id,quote.internal_note,"delete")}>Sil</button></footer>
          </article>)}
          {!loading && quotes.length === 0 && <div className="admin-empty quote-empty">Henüz kayıtlı teklif talebi yok.</div>}
        </section>}

        {view === "dealers" && <section className="request-grid">
          {dealers.map((item)=><article className="request-card" key={item.id}><header><div><strong>{item.company_name}</strong><time>{new Date(item.created_at).toLocaleString("tr-TR")}</time></div><select value={item.status} onChange={(event)=>void updateDealerStatus(item.id,event.target.value)} disabled={busy}>{Object.entries(dealerStatusNames).map(([id,name])=><option value={id} key={id}>{name}</option>)}</select></header><div className="request-body"><h3>{item.contact_name}</h3><a href={`https://wa.me/${item.phone.replace(/\D/g,"")}`} target="_blank">{item.phone} ↗</a>{item.email&&<a href={`mailto:${item.email}`}>{item.email}</a>}<dl><div><dt>Konum</dt><dd>{[item.district,item.city].filter(Boolean).join(" / ")||"—"}</dd></div><div><dt>İşletme</dt><dd>{item.business_type||"—"}</dd></div><div><dt>Aylık alım</dt><dd>{item.monthly_volume||"—"}</dd></div><div><dt>Vergi</dt><dd>{[item.tax_office,item.tax_number].filter(Boolean).join(" · ")||"—"}</dd></div></dl>{item.note&&<p>{item.note}</p>}{item.internal_note&&<p><strong>İç not:</strong> {item.internal_note}</p>}<div className="row-actions"><button onClick={()=>void manageRequest("dealers",item.id,item.internal_note,"note")}>İç not</button><button className="danger" onClick={()=>void manageRequest("dealers",item.id,item.internal_note,"delete")}>Sil</button></div></div></article>)}
          {!loading&&dealers.length===0&&<div className="admin-empty quote-empty">Henüz bayilik başvurusu yok.</div>}
        </section>}

        {view === "print" && <section className="request-grid">
          {printRequests.map((item)=><article className="request-card" key={item.id}><header><div><strong>{item.reference || item.model_name}</strong><time>{new Date(item.created_at).toLocaleString("tr-TR")}</time></div><select value={item.status} onChange={(event)=>void updatePrintStatus(item.id,event.target.value)} disabled={busy}>{Object.entries(printStatusNames).map(([id,name])=><option value={id} key={id}>{name}</option>)}</select></header><div className="request-body"><h3>{item.model_name}</h3><span>{item.company_name||item.customer_name}{item.company_name?` · ${item.customer_name}`:""}</span><a href={`https://wa.me/${item.phone.replace(/\D/g,"")}`} target="_blank">{item.phone} ↗</a>{item.email&&<a href={`mailto:${item.email}`}>{item.email}</a>}<dl><div><dt>Adet</dt><dd>{item.quantity}</dd></div><div><dt>Tahmini fiyat</dt><dd>{item.estimated_price?`${Number(item.estimated_price).toLocaleString("tr-TR",{minimumFractionDigits:2})} ₺`:"—"}</dd></div><div><dt>Malzeme</dt><dd>{item.material||"—"}</dd></div><div><dt>Renk / ölçü</dt><dd>{[item.color,item.dimensions].filter(Boolean).join(" · ")||"—"}</dd></div></dl>{item.selected_product_sku&&<span>Katalog ürünü: {item.selected_product_sku} · {item.selected_product_name}</span>}{item.file_urls?.map((file)=><a key={file.url} href={file.url} target="_blank" rel="noreferrer">Yüklenen dosya: {file.name} ↗</a>)}{item.model_url&&<a href={item.model_url} target="_blank" rel="noreferrer">Harici dosya bağlantısını aç ↗</a>}{item.note&&<p>{item.note}</p>}{item.internal_note&&<p><strong>İç not:</strong> {item.internal_note}</p>}<div className="row-actions"><button onClick={()=>void manageRequest("print-requests",item.id,item.internal_note,"note")}>İç not</button><button className="danger" onClick={()=>void manageRequest("print-requests",item.id,item.internal_note,"delete")}>Sil</button></div></div></article>)}
          {!loading&&printRequests.length===0&&<div className="admin-empty quote-empty">Henüz 3D üretim talebi yok.</div>}
        </section>}

        {view === "analytics" && <section className="analytics-grid">
          <article className="report-card"><h2>Etkinlik dağılımı</h2>{[["Ürün görüntüleme","product_view"],["Teklife ekleme","offer_add"],["Ürün paylaşma","product_share"],["WhatsApp geçişi","whatsapp_click"],["Katalog araması","catalog_search"],["Kategori filtresi","category_filter"],["PDF indirme","catalog_pdf_download"],["Yazdırma","catalog_print"]].map(([label, id]) => { const value = analytics?.counts[id] ?? 0; const maximum = Math.max(1, ...Object.values(analytics?.counts ?? {})); return <div className="report-row" key={id}><span>{label}</span><i><b style={{ width: `${(value / maximum) * 100}%` }} /></i><strong>{value}</strong></div>; })}</article>
          <article className="report-card"><h2>Öne çıkan ürünler</h2><div className="top-products">{analytics?.topProducts.map((product, index) => <div key={product.sku}><span>{String(index + 1).padStart(2, "0")}</span><strong>{product.sku}</strong><small>{product.views} görüntüleme · {product.adds} ekleme</small></div>)}{!analytics?.topProducts.length && <p>Analitik verisi henüz oluşmadı.</p>}</div></article>
        </section>}
      </div>

      {form && (
        <div className="form-layer" role="dialog" aria-modal="true" aria-label={form.id ? "Ürün düzenle" : "Yeni ürün ekle"}>
          <button className="form-backdrop" onClick={() => !busy && setForm(null)} aria-label="Formu kapat" />
          <form className="product-form" onSubmit={saveProduct}>
            <div className="form-header"><div><p>{form.id ? "Ürünü düzenle" : "Yeni ürün"}</p><h2>{form.name || "Ürün bilgileri"}</h2></div><button type="button" onClick={() => setForm(null)} aria-label="Kapat">×</button></div>
            <div className="form-body">
              <div className="form-grid">
                <label>Ürün kodu<input value={form.sku} onChange={(event) => setForm({ ...form, sku: event.target.value })} placeholder="BT-036" required /></label>
                <label>Sıra<input type="number" min="0" value={form.sortOrder} onChange={(event) => setForm({ ...form, sortOrder: event.target.value })} /></label>
                <label className="wide">Ürün adı<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></label>
                <label>Kategori<select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value as ProductCategory })}>{(categories.length ? categories : Object.entries(categoryNames).map(([id,name])=>({id,name} as CategoryOption))).map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label>
                <label>Paket / koli bilgisi<input value={form.pack} onChange={(event) => setForm({ ...form, pack: event.target.value })} placeholder="24'lü kutu" required /></label>
                <label>Stok adedi<input type="number" min="0" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} required /></label>
                <label>Fiyat (₺)<input type="number" min="0" step="0.01" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} placeholder="Boş bırakılabilir" /></label>
                <label>Maliyet (₺)<input type="number" min="0" step="0.01" value={form.costPrice} onChange={(event) => setForm({ ...form, costPrice: event.target.value })} placeholder="Yalnızca panelde" /></label>
                <label>Minimum sipariş<input type="number" min="1" value={form.minOrderPackages} onChange={(event) => setForm({ ...form, minOrderPackages: event.target.value })} required /></label>
                <label>Kritik stok eşiği<input type="number" min="0" value={form.lowStockThreshold} onChange={(event) => setForm({ ...form, lowStockThreshold: event.target.value })} required /></label>
                <label>Barkod<input value={form.barcode} onChange={(event) => setForm({ ...form, barcode: event.target.value })} /></label>
                <label>Tedarikçi<input value={form.supplier} onChange={(event) => setForm({ ...form, supplier: event.target.value })} /></label>
                <label className="wide">Kısa açıklama<textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} rows={3} /></label>
                <h3 className="form-section-title">Teknik ve uygunluk bilgileri</h3>
                <label>Yaş grubu<input value={form.ageGroup} onChange={(event) => setForm({ ...form, ageGroup: event.target.value })} /></label>
                <label>Menşe<input value={form.originCountry} onChange={(event) => setForm({ ...form, originCountry: event.target.value })} /></label>
                <label>Ürün ölçüsü<input value={form.productDimensions} onChange={(event) => setForm({ ...form, productDimensions: event.target.value })} placeholder="En × boy × yükseklik" /></label>
                <label>Koli ölçüsü<input value={form.cartonDimensions} onChange={(event) => setForm({ ...form, cartonDimensions: event.target.value })} placeholder="En × boy × yükseklik" /></label>
                <label>Koli desisi<input type="number" min="0" step="0.01" value={form.cartonDesi} onChange={(event) => setForm({ ...form, cartonDesi: event.target.value })} placeholder="Henüz girilmedi" /></label>
                <label>Koli ağırlığı (kg)<input type="number" min="0" step="0.001" value={form.cartonWeightKg} onChange={(event) => setForm({ ...form, cartonWeightKg: event.target.value })} placeholder="Henüz girilmedi" /></label>
                <label className="wide">CE / uygunluk beyanı<textarea value={form.conformityDeclaration} onChange={(event) => setForm({ ...form, conformityDeclaration: event.target.value })} rows={3} /></label>
                <label className="wide">Güvenlik notu<textarea value={form.safetyNote} onChange={(event) => setForm({ ...form, safetyNote: event.target.value })} rows={3} /></label>
                <label className="wide">Lisans / hak sahipliği notu<textarea value={form.licenseNote} onChange={(event) => setForm({ ...form, licenseNote: event.target.value })} rows={3} /></label>
              </div>

              <section className="image-manager">
                <div className="image-preview"><img src={adminImage(form.imageUrl)} alt="Ürün önizlemesi" /></div>
                <div><h3>Ana ürün görseli</h3><p>JPG, PNG, WebP veya AVIF; en fazla 8 MB.</p><label className="file-button">Görsel yükle<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(event) => event.target.files?.[0] && void uploadImage(event.target.files[0], "cover")} /></label><input className="url-input" value={form.imageUrl} onChange={(event) => setForm({ ...form, imageUrl: event.target.value })} placeholder="veya görsel URL'si" /></div>
              </section>

              <section className="gallery-manager">
                <div><h3>Galeri görselleri</h3><span>En fazla 12 ek görsel</span></div>
                <label className="file-button secondary">Galeriye yükle<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(event) => event.target.files?.[0] && void uploadImage(event.target.files[0], "gallery")} /></label>
                <div className="gallery-grid">{form.gallery.map((url, index) => <div key={`${url}-${index}`}><img src={url} alt="" /><button type="button" onClick={() => setForm({ ...form, gallery: form.gallery.filter((_, itemIndex) => itemIndex !== index) })}>×</button></div>)}</div>
              </section>

              <div className="switch-grid">
                <label><input type="checkbox" checked={form.isPublished} onChange={(event) => setForm({ ...form, isPublished: event.target.checked })} /><span><strong>Katalogda yayınla</strong><small>Kapalıysa sadece panelde görünür.</small></span></label>
                <label><input type="checkbox" checked={form.isPriceVisible} onChange={(event) => setForm({ ...form, isPriceVisible: event.target.checked })} /><span><strong>Fiyatı müşteriye göster</strong><small>Kapalıysa “Teklif alın” görünür.</small></span></label>
              </div>
            </div>
            <div className="form-footer"><button type="button" onClick={() => setForm(null)}>Vazgeç</button><button type="submit" className="save-button" disabled={busy}>{busy ? "Kaydediliyor…" : "Ürünü kaydet"}</button></div>
          </form>
        </div>
      )}

      {stockProduct && <div className="stock-layer" role="dialog" aria-modal="true" aria-label="Stok hareketi">
        <button className="form-backdrop" onClick={() => !busy && setStockProduct(null)} aria-label="Stok penceresini kapat" />
        <form className="stock-dialog" onSubmit={adjustStock}><p className="kicker">Stok hareketi</p><h2>{stockProduct.name}</h2><span>Mevcut stok: <strong>{stockProduct.stock}</strong></span><label>Değişim<input type="number" value={stockChange} onChange={(event) => setStockChange(event.target.value)} placeholder="Giriş için +24, çıkış için -6" required /></label><label>Açıklama<input value={stockReason} onChange={(event) => setStockReason(event.target.value)} placeholder="Mal kabul, satış, düzeltme…" /></label><div><button type="button" onClick={() => setStockProduct(null)}>Vazgeç</button><button type="submit" className="save-button" disabled={busy}>Kaydet</button></div></form>
      </div>}
    </main>
  );
}
