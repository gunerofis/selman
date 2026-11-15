"use client";

import { useEffect, useMemo, useState } from "react";
import { prepareUpload } from "../../../lib/image-upload";
import type { PrintProduct } from "../../../lib/print-products";
import { formatPrintTime, printProductImage } from "../../../lib/print-products";

type Config = { configured: boolean; authenticated?:boolean };

export default function PrintProductsAdminPage() {
  const [token, setToken] = useState("");
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [products, setProducts] = useState<PrintProduct[]>([]);
  const [editing, setEditing] = useState<PrintProduct | null>(null);
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("all");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/config", { cache: "no-store" })
      .then((response) => response.json())
      .then((value: Config) => {setConfigured(value.configured);setToken(value.authenticated?"session":"");})
      .catch(() => setConfigured(false));
  }, []);

  useEffect(() => {
    if (!token || !configured) {
      setLoading(false);
      return;
    }
    void loadProducts(token);
  }, [token, configured]);

  const groups = useMemo(() => Array.from(new Set(products.map((product) => product.group))), [products]);
  const visibleProducts = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("tr-TR");
    return products.filter((product) =>
      (group === "all" || product.group === group) &&
      (status === "all" || (status === "published" ? product.isPublished : !product.isPublished)) &&
      (!term || `${product.sku} ${product.name} ${product.details} ${product.description} ${product.material}`.toLocaleLowerCase("tr-TR").includes(term)),
    );
  }, [products, query, group, status]);

  async function loadProducts(accessToken = token) {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/print-products", {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      });
      const data = await response.json() as { products?: PrintProduct[]; error?: string };
      if (!response.ok) throw new Error(data.error || "3D ürünleri alınamadı.");
      setProducts(data.products ?? []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "3D ürünleri alınamadı.");
    } finally {
      setLoading(false);
    }
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (!editing) return;
    setBusy(true);
    setMessage("");
    try {
      const exists = products.some((product)=>product.id===editing.id);
      const response = await fetch("/api/admin/print-products", {
        method: exists ? "PATCH" : "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      const data = await response.json() as { product?: PrintProduct; error?: string };
      if (!response.ok || !data.product) throw new Error(data.error || "Ürün güncellenemedi.");
      setProducts((current) => exists ? current.map((product) => product.id === data.product?.id ? data.product : product) : [...current, data.product as PrintProduct].sort((a,b)=>a.sortOrder-b.sortOrder));
      setEditing(null);
      setMessage("3D ürün ve üretim verileri güncellendi.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Ürün güncellenemedi.");
    } finally {
      setBusy(false);
    }
  }

  function newProduct() {
    const id=Math.max(0,...products.map((item)=>item.id))+1;
    setEditing({id,sku:`3D-${String(id).padStart(3,"0")}`,name:"Yeni 3D Ürün",group:groups[0]||"Diğer 3D Ürünler",viralStrength:3,machineFit:"A",details:"",productionMinutesMin:60,productionMinutesMax:180,baseUnitPrice:0,minOrderQuantity:1,material:"PLA",imageKey:"flexi",gallery:[],description:"",standardDimensions:"",approximateWeight:"",printMethod:"FDM",layerHeightMm:.2,infillPercent:15,wallCount:3,nozzleMm:.4,supports:"",assembly:"",colorOptions:"",ageRecommendation:"",usageAreas:"",packaging:"",licenseNote:"",marketSignal:"",popularityRank:null,qualityNote:"",isFeatured:false,isPublished:false,sortOrder:products.length+1,updatedAt:new Date().toISOString()});
  }

  async function remove(product:PrintProduct){
    if(!confirm(`${product.sku} — ${product.name} kalıcı olarak silinsin mi?`))return;
    setBusy(true);setMessage("");
    try{const response=await fetch(`/api/admin/print-products?id=${product.id}`,{method:"DELETE",headers:{Authorization:`Bearer ${token}`}});const data=await response.json() as {error?:string};if(!response.ok)throw new Error(data.error||"Ürün silinemedi.");setProducts((current)=>current.filter((item)=>item.id!==product.id));setMessage("3D ürün silindi.");}catch(error){setMessage(error instanceof Error?error.message:"Ürün silinemedi.");}finally{setBusy(false);}
  }

  async function uploadImages(files:FileList,target:"cover"|"gallery"){
    if(!editing)return;
    const selected=Array.from(files).slice(0,target==="gallery"?Math.max(0,12-editing.gallery.length):1);
    if(selected.length===0){setMessage("Galeri en fazla 12 görsel içerebilir.");return;}
    setBusy(true);setMessage(`${selected.length} görsel yükleniyor…`);
    try{
      const uploaded:string[]=[];
      for(const file of selected){
        const body=new FormData();body.append("file",await prepareUpload(file));
        const response=await fetch("/api/admin/upload",{method:"POST",headers:{Authorization:`Bearer ${token}`},body});
        const data=await response.json() as {url?:string;error?:string};
        if(!response.ok||!data.url)throw new Error(data.error||"Görsel yüklenemedi.");
        uploaded.push(data.url);
      }
      setEditing((current)=>current ? target==="cover" ? {...current,imageKey:uploaded[0]} : {...current,gallery:Array.from(new Set([...current.gallery,...uploaded])).slice(0,12)} : current);
      setMessage("Görseller yüklendi; ürünü kaydedin.");
    }catch(error){setMessage(error instanceof Error?error.message:"Görsel yüklenemedi.");}finally{setBusy(false);}
  }

  if (configured === null) return <main className="admin-shell admin-center"><div className="admin-loader" /></main>;

  if (!configured || !token) {
    return <main className="admin-shell admin-center"><section className="setup-card"><img src="/assets/bucuruktoys-logo.svg" alt="BÜCÜRÜKTOYS" /><p className="kicker">3D üretim yönetimi</p><h1>Yönetici oturumu gerekli.</h1><p>Önce ana yönetim panelinden giriş yapın; ardından 3D ürün ve üretim sürelerini düzenleyebilirsiniz.</p><a className="setup-action" href="/admin">Yönetim paneline git</a></section></main>;
  }

  return <main className="admin-shell">
    <header className="admin-header"><a className="admin-brand" href="/admin"><img src="/assets/bucuruktoys-logo.svg" alt="BÜCÜRÜKTOYS" /></a><div><a href="/3d-baski" target="_blank">3D sayfasını aç ↗</a><a href="/admin">← Yönetim paneli</a></div></header>
    <div className="admin-content">
      <section className="admin-title"><div><p className="kicker">Üretim kataloğu</p><h1>3D ürün kontrol merkezi.</h1><p>Ürün havuzunu teknik föy, görsel, fiyat, minimum sipariş ve yayın durumuyla yönetin.</p></div><button className="new-product" onClick={newProduct}>+ Yeni 3D ürün</button></section>
      <section className="stat-grid"><div><span>Toplam ürün</span><strong>{products.length}</strong></div><div><span>Yayında</span><strong>{products.filter((item) => item.isPublished).length}</strong></div><div><span>Öne çıkan</span><strong>{products.filter((item) => item.isFeatured).length}</strong></div><div><span>Ürün grubu</span><strong>{groups.length}</strong></div></section>
      {message && <p className={`form-message ${message.includes("güncellendi") ? "success" : ""}`}>{message}</p>}
      <section className="product-panel">
        <div className="panel-tools"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Kod, ürün veya özellik ara…" /><select value={group} onChange={(event) => setGroup(event.target.value)}><option value="all">Tüm ürün grupları</option>{groups.map((name) => <option key={name} value={name}>{name}</option>)}</select><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">Tüm durumlar</option><option value="published">Yalnızca 30 aktif ürün</option><option value="draft">AR‑GE / taslak havuzu</option></select></div>
        <div className="admin-table-wrap">
          <table className="admin-table print-admin-table"><thead><tr><th>Ürün</th><th>Üretim süresi</th><th>Birim fiyat</th><th>Minimum</th><th>Durum</th><th /></tr></thead>
            <tbody>{visibleProducts.map((product) => <tr key={product.id}>
              <td><div className="product-cell"><img src={printProductImage(product)} alt="" /><span><strong>{product.name}</strong><small>{product.sku} · {product.popularityRank ? `piyasa #${product.popularityRank} · ` : ""}viral güç {product.viralStrength}/5 · uyum {product.machineFit}</small></span></div></td>
              <td>{formatPrintTime(product.productionMinutesMin)}–{formatPrintTime(product.productionMinutesMax)}</td>
              <td><strong>{product.baseUnitPrice.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺</strong><small className="hidden-label">1 adet liste fiyatı</small></td>
              <td>{product.minOrderQuantity} adet</td>
              <td><span className={product.isPublished ? "publish on" : "publish"}>{product.isPublished ? "Yayında" : "Taslak"}</span></td>
              <td><div className="row-actions"><button onClick={() => setEditing({ ...product })}>Düzenle</button><button className="danger" onClick={()=>void remove(product)}>Sil</button></div></td>
            </tr>)}</tbody>
          </table>
          {!loading && visibleProducts.length === 0 && <div className="admin-empty">Bu filtreye uygun 3D ürün bulunamadı.</div>}
          {loading && <div className="admin-empty">3D ürünleri yükleniyor…</div>}
        </div>
      </section>
    </div>

    {editing && <div className="form-layer" role="dialog" aria-modal="true" aria-label="3D ürünü düzenle">
      <button className="form-backdrop" onClick={() => !busy && setEditing(null)} aria-label="Formu kapat" />
      <form className="product-form" onSubmit={save}>
        <div className="form-header"><div><p>{editing.sku}</p><h2>{editing.name}</h2></div><button type="button" onClick={() => setEditing(null)} aria-label="Kapat">×</button></div>
        <div className="form-body"><div className="form-grid">
          <label>Ürün kodu<input value={editing.sku} onChange={(event) => setEditing({ ...editing, sku: event.target.value.toUpperCase() })} /></label>
          <label>Kimlik<input type="number" min="1" value={editing.id} onChange={(event) => setEditing({ ...editing, id: Number(event.target.value) })} /></label>
          <label className="wide">Ürün adı<input value={editing.name} onChange={(event) => setEditing({ ...editing, name: event.target.value })} /></label>
          <label className="wide">Ürün grubu<input value={editing.group} onChange={(event) => setEditing({ ...editing, group: event.target.value })} /></label>
          <label>Minimum üretim (dk)<input type="number" min="1" value={editing.productionMinutesMin} onChange={(event) => setEditing({ ...editing, productionMinutesMin: Number(event.target.value) })} /></label>
          <label>Maksimum üretim (dk)<input type="number" min={editing.productionMinutesMin} value={editing.productionMinutesMax} onChange={(event) => setEditing({ ...editing, productionMinutesMax: Number(event.target.value) })} /></label>
          <label>Birim fiyat (₺)<input type="number" min="0" step="0.01" value={editing.baseUnitPrice} onChange={(event) => setEditing({ ...editing, baseUnitPrice: Number(event.target.value) })} /></label>
          <label>Minimum sipariş (adet)<input type="number" min="1" value={editing.minOrderQuantity} onChange={(event) => setEditing({ ...editing, minOrderQuantity: Number(event.target.value) })} /></label>
          <label>Malzeme<input value={editing.material} onChange={(event) => setEditing({ ...editing, material: event.target.value })} /></label>
          <label>Görsel grubu<select value={editing.imageKey} onChange={(event) => setEditing({ ...editing, imageKey: event.target.value })}><option value="flexi">Flexi hayvanlar</option><option value="action">Figür & araç</option><option value="fidget">Fidget</option><option value="custom">Kişiselleştirme</option><option value="decor">Dekor & ışık</option><option value="collection">Koleksiyon & sezon</option></select></label>
          <label>Viral güç<input type="number" min="1" max="5" value={editing.viralStrength} onChange={(event)=>setEditing({...editing,viralStrength:Number(event.target.value)})}/></label>
          <label>Makine uyumu<select value={editing.machineFit} onChange={(event)=>setEditing({...editing,machineFit:event.target.value as "A"|"B"|"C"})}><option>A</option><option>B</option><option>C</option></select></label>
          <label>Sıralama<input type="number" min="0" value={editing.sortOrder} onChange={(event)=>setEditing({...editing,sortOrder:Number(event.target.value)})}/></label>
          <section className="image-manager wide">
            <div className="image-preview"><img src={printProductImage(editing)} alt={`${editing.name || editing.sku} kapak görseli`} /></div>
            <div><h3>Kapak görseli</h3><p>Ürün kartlarında ilk gösterilen görsel.</p><label className="file-button">Kapak yükle<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(event)=>event.target.files&&void uploadImages(event.target.files,"cover")}/></label><input value={editing.imageKey} onChange={(event)=>setEditing({...editing,imageKey:event.target.value})} placeholder="Görsel URL veya grup anahtarı"/></div>
          </section>
          <section className="gallery-manager wide">
            <h3>Ürün galerisi</h3><span>Tek seferde birden fazla görsel seçebilirsiniz. En fazla 12 görsel.</span>
            <label className="file-button secondary">Galeriye yükle<input type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif" onChange={(event)=>event.target.files&&void uploadImages(event.target.files,"gallery")}/></label>
            <div className="gallery-grid">{editing.gallery.map((url,index)=><div key={`${url}-${index}`}><img src={url} alt=""/><button type="button" onClick={()=>setEditing({...editing,gallery:editing.gallery.filter((_,itemIndex)=>itemIndex!==index)})} aria-label={`${index+1}. galeri görselini kaldır`}>×</button></div>)}</div>
          </section>
          <label>Popülerlik sırası<input type="number" min="1" max="999" value={editing.popularityRank ?? ""} onChange={(event) => setEditing({ ...editing, popularityRank: event.target.value ? Number(event.target.value) : null })} /></label>
          <label>Standart ölçü<input value={editing.standardDimensions} onChange={(event) => setEditing({ ...editing, standardDimensions: event.target.value })} /></label>
          <label>Yaklaşık ağırlık<input value={editing.approximateWeight} onChange={(event) => setEditing({ ...editing, approximateWeight: event.target.value })} /></label>
          <label>Baskı yöntemi<input value={editing.printMethod} onChange={(event) => setEditing({ ...editing, printMethod: event.target.value })} /></label>
          <label>Katman yüksekliği (mm)<input type="number" min="0.05" max="2" step="0.01" value={editing.layerHeightMm} onChange={(event) => setEditing({ ...editing, layerHeightMm: Number(event.target.value) })} /></label>
          <label>Nozzle (mm)<input type="number" min="0.1" max="2" step="0.01" value={editing.nozzleMm} onChange={(event) => setEditing({ ...editing, nozzleMm: Number(event.target.value) })} /></label>
          <label>Doluluk (%)<input type="number" min="0" max="100" value={editing.infillPercent} onChange={(event) => setEditing({ ...editing, infillPercent: Number(event.target.value) })} /></label>
          <label>Duvar sayısı<input type="number" min="1" max="20" value={editing.wallCount} onChange={(event) => setEditing({ ...editing, wallCount: Number(event.target.value) })} /></label>
          <label className="wide">Kısa ürün özelliği<textarea rows={3} value={editing.details} onChange={(event) => setEditing({ ...editing, details: event.target.value })} /></label>
          <label className="wide">Kapsamlı ürün açıklaması<textarea rows={6} value={editing.description} onChange={(event) => setEditing({ ...editing, description: event.target.value })} /></label>
          <label className="wide">Destek ihtiyacı<textarea rows={3} value={editing.supports} onChange={(event) => setEditing({ ...editing, supports: event.target.value })} /></label>
          <label className="wide">Montaj süreci<textarea rows={3} value={editing.assembly} onChange={(event) => setEditing({ ...editing, assembly: event.target.value })} /></label>
          <label className="wide">Renk seçenekleri<textarea rows={3} value={editing.colorOptions} onChange={(event) => setEditing({ ...editing, colorOptions: event.target.value })} /></label>
          <label className="wide">Yaş önerisi<textarea rows={2} value={editing.ageRecommendation} onChange={(event) => setEditing({ ...editing, ageRecommendation: event.target.value })} /></label>
          <label className="wide">Kullanım alanları<textarea rows={3} value={editing.usageAreas} onChange={(event) => setEditing({ ...editing, usageAreas: event.target.value })} /></label>
          <label className="wide">Paketleme<textarea rows={3} value={editing.packaging} onChange={(event) => setEditing({ ...editing, packaging: event.target.value })} /></label>
          <label className="wide">Kalite kontrol notu<textarea rows={3} value={editing.qualityNote} onChange={(event) => setEditing({ ...editing, qualityNote: event.target.value })} /></label>
          <label className="wide">Lisans notu<textarea rows={3} value={editing.licenseNote} onChange={(event) => setEditing({ ...editing, licenseNote: event.target.value })} /></label>
          <label className="wide">Piyasa sinyali<textarea rows={3} value={editing.marketSignal} onChange={(event) => setEditing({ ...editing, marketSignal: event.target.value })} /></label>
        </div>
        <p className="form-message">Tüm ayrıntılar opsiyoneldir. Boş bırakılan alanlar güvenli varsayılanlarla kaydedilir ve daha sonra tamamlanabilir.</p>
        <div className="switch-grid"><label><input type="checkbox" checked={editing.isPublished} onChange={(event) => setEditing({ ...editing, isPublished: event.target.checked })} /><span><strong>Katalogda yayınla</strong><small>Kapalıysa müşterilere görünmez.</small></span></label><label><input type="checkbox" checked={editing.isFeatured} onChange={(event) => setEditing({ ...editing, isFeatured: event.target.checked })} /><span><strong>Öne çıkan ürün</strong><small>Sayfanın ilk koleksiyonunda gösterilir.</small></span></label></div>
        </div>
        <div className="form-footer"><button type="button" onClick={() => setEditing(null)}>Vazgeç</button><button className="save-button" disabled={busy}>{busy ? "Kaydediliyor…" : "Değişiklikleri kaydet"}</button></div>
      </form>
    </div>}
  </main>;
}
