import { categoryPages, type CategoryPage } from "./category-pages";
import { getSupabaseConfig, supabaseRest } from "./supabase-server";

type CategoryRow={id:string;slug:string;name:string;short_description:string;description:string;guides:unknown;is_visible:boolean;sort_order:number};
export type ManagedPage={slug:string;title:string;kicker:string;summary:string;sections:Array<{title:string;text:string}>;seo_title:string|null;seo_description:string|null;is_published:boolean};

function sections(value:unknown){
  return Array.isArray(value)?value.filter((item):item is {title:string;text:string}=>Boolean(item&&typeof item==="object"&&typeof (item as {title?:unknown}).title==="string"&&typeof (item as {text?:unknown}).text==="string")).slice(0,30):[];
}

const managedPageFallbacks: Record<string, Omit<ManagedPage, "is_published">> = {
  "toptan-satis": {
    slug: "toptan-satis",
    title: "BÜCÜRÜKTOYS Toptan Satış ve Teklif Süreci",
    kicker: "Toptan Satış",
    summary: "Toptan alım, teklif ve teslimat sürecimizle ilgili temel bilgileri burada takip edebilirsiniz.",
    sections: [
      {
        title: "Nasıl Başlar?",
        text: "Üye bayi ve kurumsal alıcılar için ürün listesi ile birlikte güncel fiyat ve minimum sipariş bilgileri paylaşılır.",
      },
      {
        title: "Teklif Alın",
        text: "Ürün kartlarındaki \"Kampanya Listesi Oluştur\" akışıyla teklif talebi ve notlar ile birlikte hızlıca başvuru oluşturabilirsiniz.",
      },
    ],
    seo_title: "BÜCÜRÜKTOYS Toptan Satış ve Teklif Süreci",
    seo_description: "BÜCÜRÜKTOYS toptan satış ve teklif süreci hakkında kısa bilgi.",
  },
  "hakkimizda": {
    slug: "hakkimizda",
    title: "BÜCÜRÜKTOYS Hakkında",
    kicker: "Hakkımızda",
    summary: "BÜCÜRÜKTOYS markası, ürün portföyü ve tedarik yaklaşımı hakkında temel bilgiler.",
    sections: [
      {
        title: "Marka Felsefesi",
        text: "BÜCÜRÜKTOYS, toptan oyuncak alımında güvenli ve pratik bir teklif süreci sunmak için kurgulandı.",
      },
      {
        title: "Ne Sunuyoruz?",
        text: "Büyük stok seçimi, hızlı yanıt ve kampanya odaklı katalog yönetimi ile bayi ve mağaza ihtiyaçlarına odaklanıyoruz.",
      },
    ],
    seo_title: "BÜCÜRÜKTOYS Hakkında",
    seo_description: "BÜCÜRÜKTOYS marka ve çalışma modelimiz hakkında bilgiler.",
  },
  "gizlilik": {
    slug: "gizlilik",
    title: "Gizlilik ve Veri Kullanımı",
    kicker: "Gizlilik",
    summary: "Veri kullanımına ve kişisel bilgilere dair temel politikalarımız.",
    sections: [
      {
        title: "Toplanan Veriler",
        text: "Teklif ve bayi başvuru formlarında paylaşılan veriler yalnızca talep yönetimi için kullanılır.",
      },
      {
        title: "Güvenlik",
        text: "Tüm veriler güncel güvenlik ilkeleri çerçevesinde korunur ve yalnızca yetkilendirilmiş süreçlerde işlenir.",
      },
    ],
    seo_title: "Gizlilik ve Veri Kullanımı",
    seo_description: "BÜCÜRÜKTOYS gizlilik ve veri kullanım politikası.",
  },
  "toptan-oyuncak-rehberi": {
    slug: "toptan-oyuncak-rehberi",
    title: "Toptan Oyuncak Rehberi",
    kicker: "Kılavuz",
    summary: "Toptan oyuncak alımında dikkat edilmesi gereken noktalar.",
    sections: [
      {
        title: "Teklif İçin Hazırlık",
        text: "Ürün kodları, adet aralığı ve teslimat noktası gibi detaylar teklif kalitesini doğrudan etkiler.",
      },
      {
        title: "Sipariş ve Teslimat",
        text: "Onaylanan teklifler doğrultusunda teslimat ve paketleme süreçleri hızla başlatılır.",
      },
    ],
    seo_title: "Toptan Oyuncak Rehberi",
    seo_description: "Toptan oyuncak alımında toptan alıcılar için basit rehber.",
  },
  "sikca-sorulan-sorular": {
    slug: "sikca-sorulan-sorular",
    title: "Sık Sorulan Sorular",
    kicker: "Sık Sorulanlar",
    summary: "Teklif, ürün ve teslimat süreçlerine dair en çok sorulan konular.",
    sections: [
      {
        title: "Teklif Ne Zaman Hazırlanır?",
        text: "Formdaki ürün ve bayi bilgilerinin tamamlanmasının ardından ekip en kısa sürede size dönüş yapar.",
      },
      {
        title: "Minimum Paket",
        text: "Ürünlere göre minimum paket adedi farklıdır. Gerekli ürün kartından kontrol edebilirsiniz.",
      },
    ],
    seo_title: "Sık Sorulan Sorular",
    seo_description: "BÜCÜRÜKTOYS ile ilgili sık sorulan sorular.",
  },
  "kurumsal-bilgiler": {
    slug: "kurumsal-bilgiler",
    title: "Kurumsal Bilgiler",
    kicker: "Kurumsal",
    summary: "Kurumsal iletişim ve tedarik yaklaşımımıza dair detaylar.",
    sections: [
      {
        title: "İletişim",
        text: "Kurumsal destek ve satış ekibimizle iletişime geçmek için iletişim formunu kullanabilirsiniz.",
      },
      {
        title: "Satış Yaklaşımı",
        text: "Kurumsal alımlar için hızlı teklif, şeffaf süreç ve düzenli stok takibi önceliklidir.",
      },
    ],
    seo_title: "Kurumsal Bilgiler",
    seo_description: "Kurumsal iş akışı ve iletişim bilgileri.",
  },
};

function managedPageFallback(slug: string): ManagedPage | null {
  const fallback = managedPageFallbacks[slug];
  if (!fallback) return null;
  return {
    ...fallback,
    is_published: true,
  };
}

export async function getPublicCategories():Promise<CategoryPage[]>{
  const config=getSupabaseConfig();if(!config)return categoryPages;
  try{
    const rows=await supabaseRest<CategoryRow[]>(config,"/rest/v1/categories?select=*&is_visible=eq.true&order=sort_order.asc");
    if(!rows?.length)return categoryPages;
    return rows.map((row)=>{
      const fallback=categoryPages.find((item)=>item.id===row.id);
      return {id:row.id,slug:row.slug,name:row.name,shortDescription:row.short_description,description:row.description,guides:sections(row.guides).length?sections(row.guides):fallback?.guides??[]};
    });
  }catch{return categoryPages;}
}

export async function getPublicCategoryBySlug(slug:string){return (await getPublicCategories()).find((item)=>item.slug===slug);}
export async function getPublicCategoryById(id:string){return (await getPublicCategories()).find((item)=>item.id===id);}

export async function getPublicManagedPage(slug:string):Promise<ManagedPage|null>{
  const config=getSupabaseConfig();if(!config)return managedPageFallback(slug);
  try {
    const rows=await supabaseRest<Array<Record<string,unknown>>>(config,`/rest/v1/content_pages?slug=eq.${encodeURIComponent(slug)}&is_published=eq.true&select=*&limit=1`);
    const row=rows?.[0];
    if(!row)return managedPageFallback(slug);
    return {slug:String(row.slug),title:String(row.title),kicker:String(row.kicker??""),summary:String(row.summary??""),sections:sections(row.sections),seo_title:typeof row.seo_title==="string"?row.seo_title:null,seo_description:typeof row.seo_description==="string"?row.seo_description:null,is_published:true};
  } catch {
    return managedPageFallback(slug);
  }
}

export async function getPublicSettings(){
  const config=getSupabaseConfig();if(!config)return {} as Record<string,unknown>;
  try{const rows=await supabaseRest<Array<{key:string;value:unknown}>>(config,"/rest/v1/site_settings?is_public=eq.true&select=key,value");return Object.fromEntries((rows??[]).map((item)=>[item.key,item.value]));}catch{return {} as Record<string,unknown>;}
}
