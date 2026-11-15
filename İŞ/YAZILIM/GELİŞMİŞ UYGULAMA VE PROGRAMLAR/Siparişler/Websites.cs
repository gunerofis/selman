using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading;

namespace Siparisler {
 internal static class Websites {
  internal static readonly string[] Domains={"gunerofis.com","sumentakimi.com.tr","sumentakimi.com","imalattansumen.com","derikutu.com"};
  static readonly string[] Keys={"","sumentakimi_com_tr","sumentakimi_com","imalattan_sumen","kutu"};
  static readonly string[] Shops={"","b1zinb-wv.myshopify.com","k50ggb-0k.myshopify.com","1v6xuj-hx.myshopify.com","t0ftz3-hc.myshopify.com"};
  static string Text(object x,string key){return JsonMap.Text(JsonMap.Prop(x,key));}
  internal static List<string[]> Config(string folder) {
   string path=Path.Combine(folder,"web-siteleri.json");
   if(!File.Exists(path))return new List<string[]>();
   var list=new System.Web.Script.Serialization.JavaScriptSerializer().Deserialize<List<string[]>>(File.ReadAllText(path));
   if(list==null||list.Count>5)throw new Exception("Site kayıtları okunamadı.");
   foreach(var x in list)if(x==null||x.Length!=2)throw new Exception("Site kayıtları okunamadı.");
   return list;
  }
  internal static string Domain(string address){Uri u;if(!Uri.TryCreate(address,UriKind.Absolute,out u))return "";var h=u.Host.ToLowerInvariant();return h.StartsWith("www.")?h.Substring(4):h;}
  internal static bool Any(string folder){try{return Config(folder).Count>0;}catch{return true;}}
  internal static string Status(string folder,string address){
   string domain=Domain(address);
   if(Array.IndexOf(Domains,domain)<0)return "Bu site için bağlantı kurulmadı";
   if(domain==Domains[0])return "Faprika sipariş servis bilgisi gerekli";
   try{string path=Path.Combine(folder,"web-baglanti-durumu.json");if(File.Exists(path)){string s=Text(JsonMap.Parse(File.ReadAllText(path)),domain);if(s.Length>0)return s;}}catch{}
   return "Bağlantı hazır · Getir ile kontrol edin";
  }
  internal static List<SourceResult> PullAll(string folder,DateTime start,DateTime end) {
   var results=new List<SourceResult>();List<string[]> config;
   try{config=Config(folder);}catch{results.Add(SourceResult.Fail("Web Siteleri","Site kayıtları okunamadı; önceki siparişler korundu."));return results;}
   object registry=null;
   try{registry=JsonMap.Parse(File.ReadAllText(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.DesktopDirectory),@"Güner Ofis\01 Yönetim\API ve Şifreler\API ve Erişim Bilgileri.json")));}catch{}
   var seen=new HashSet<string>();var states=new Dictionary<string,object>();
   foreach(var c in config){
    string domain=Domain(c[1]);if(!seen.Add(domain))continue;
    int index=Array.IndexOf(Domains,domain);SourceResult result;
    try{
     if(index<0)throw new Exception("Bu site için bağlantı kurulmadı.");
     if(index==0)throw new Exception("Faprika sipariş servis bilgisi gerekli.");
     if(registry==null)throw new Exception("Merkezi erişim kaydı okunamadı.");
     var credentials=JsonMap.Prop(JsonMap.Prop(registry,"shopify_apps"),Keys[index]);
     result=Pull(domain,Shops[index],credentials,start,end);
    }catch(Exception e){result=SourceResult.Fail(domain,e is SiteException?e.Message:(index==0?"Faprika sipariş servis bilgisi gerekli.":index<0?"Bu site için bağlantı kurulmadı.":"Bağlantı kurulamadı. Erişim ve interneti kontrol edin."));}
    results.Add(result);states[domain]=result.Ok?"Bağlı · "+result.Count+" sipariş · "+Clock.NowTurkey().ToString("dd.MM HH:mm"):result.Error;
   }
   try{string path=Path.Combine(folder,"web-baglanti-durumu.json"),temp=path+".tmp";File.WriteAllText(temp,JsonMap.Write(states));if(File.Exists(path))File.Replace(temp,path,null);else File.Move(temp,path);}catch{}
   return results;
  }
  sealed class SiteException:Exception{internal SiteException(string message):base(message){}}
  static object Send(HttpClient client,string url,HttpContent body,string token){
   for(int attempt=0;attempt<3;attempt++){
    using(var request=new HttpRequestMessage(HttpMethod.Post,url)){
     // A fresh content instance is needed on retry.
     string payload=body.ReadAsStringAsync().Result;
     request.Content=new StringContent(payload,Encoding.UTF8,body.Headers.ContentType.MediaType);
     if(token!=null)request.Headers.Add("X-Shopify-Access-Token",token);
     using(var response=client.SendAsync(request).Result){
      if((int)response.StatusCode==429||(int)response.StatusCode>=500){Thread.Sleep(1000*(attempt+1));continue;}
      if(!response.IsSuccessStatusCode)throw new SiteException("Shopify erişimi reddedildi ("+(int)response.StatusCode+").");
      var root=JsonMap.Parse(response.Content.ReadAsStringAsync().Result);
      var errors=JsonMap.Arr(JsonMap.Prop(root,"errors"));
      if(errors.Count>0){bool throttled=Text(JsonMap.Prop(errors[0],"extensions"),"code")=="THROTTLED";if(throttled){Thread.Sleep(1500);continue;}throw new SiteException("Shopify sipariş sorgusu reddedildi; sipariş okuma yetkisini kontrol edin.");}
      return root;
     }
    }
   }
   throw new SiteException("Shopify geçici olarak yanıt vermedi; önceki kayıtlar korundu.");
  }
  static SourceResult Pull(string domain,string host,object credentials,DateTime start,DateTime end){
   string id=Text(credentials,"SHOPIFY_API_KEY"),secret=Text(credentials,"SHOPIFY_API_SECRET");
   if(id.Length==0||secret.Length==0)throw new SiteException("Merkezi kayıtta Shopify erişim bilgisi eksik.");
   ServicePointManager.SecurityProtocol=SecurityProtocolType.Tls12;
   using(var handler=new HttpClientHandler{AllowAutoRedirect=false})using(var client=new HttpClient(handler)){client.Timeout=TimeSpan.FromSeconds(35);
    var auth=new Dictionary<string,string>{{"grant_type","client_credentials"},{"client_id",id},{"client_secret",secret}};
    string token=Text(Send(client,"https://"+host+"/admin/oauth/access_token",new FormUrlEncodedContent(auth),null),"access_token");
    if(token.Length==0)throw new SiteException("Shopify erişim anahtarı alınamadı.");
    var rows=new List<OrderRow>();string cursor=null;var cursors=new HashSet<string>();
    for(int page=0;page<100;page++){
     string query="query Orders($after:String,$filter:String!){shop{primaryDomain{host} currencyCode} orders(first:100,after:$after,sortKey:CREATED_AT,query:$filter){pageInfo{hasNextPage endCursor} nodes{id name createdAt cancelledAt test sourceName displayFinancialStatus displayFulfillmentStatus currentTotalPriceSet{shopMoney{amount currencyCode}} currentSubtotalLineItemsQuantity lineItems(first:1){nodes{name}}}}}";
     var variables=new Dictionary<string,object>{{"after",cursor},{"filter","created_at:>='"+start.ToString("yyyy-MM-dd")+"T00:00:00+03:00' created_at:<'"+end.ToString("yyyy-MM-dd")+"T00:00:00+03:00'"}};
     var root=Send(client,"https://"+host+"/admin/api/2026-07/graphql.json",new StringContent(JsonMap.Write(new Dictionary<string,object>{{"query",query},{"variables",variables}}),Encoding.UTF8,"application/json"),token);
     var data=JsonMap.Prop(root,"data");var shop=JsonMap.Prop(data,"shop");
     if(Domain("https://"+Text(JsonMap.Prop(shop,"primaryDomain"),"host"))!=domain)throw new SiteException("Mağaza alan adı eşleşmedi; bağlantı durduruldu.");
     var orders=JsonMap.Prop(data,"orders");if(orders==null)throw new SiteException("Sipariş yanıtı eksik; önceki kayıtlar korundu.");
     foreach(var node in JsonMap.Arr(JsonMap.Prop(orders,"nodes"))){var row=Parse(domain,node);if(row!=null&&row.WhenTurkey>=start&&row.WhenTurkey<end)rows.Add(row);}
     var info=JsonMap.Prop(orders,"pageInfo");if(info==null)throw new SiteException("Sayfalama yanıtı eksik.");
     if(Text(info,"hasNextPage").ToLowerInvariant()!="true")return SourceResult.Done(domain,Catalog.Dedup(rows));
     cursor=Text(info,"endCursor");if(cursor.Length==0||!cursors.Add(cursor))throw new SiteException("Sipariş sayfalaması tamamlanamadı.");
    }
    throw new SiteException("Sipariş sayfalama sınırına ulaşıldı; önceki kayıtlar korundu.");
   }
  }
  internal static OrderRow Parse(string domain,object node){
   if(Text(node,"test").ToLowerInvariant()=="true")return null;
   // Web checkout and manual store orders; imported marketplace copies are excluded.
   string source=Text(node,"sourceName");if(source!="web"&&source!="shopify_draft_order")return null;
   DateTimeOffset when;if(!DateTimeOffset.TryParse(Text(node,"createdAt"),CultureInfo.InvariantCulture,DateTimeStyles.None,out when))throw new SiteException("Sipariş tarihi okunamadı.");
   var money=JsonMap.Prop(JsonMap.Prop(node,"currentTotalPriceSet"),"shopMoney");
   if(Text(money,"currencyCode")!="TRY")throw new SiteException("TL dışındaki siparişler için para birimi desteği gerekli.");
   decimal amount;if(!decimal.TryParse(Text(money,"amount"),NumberStyles.Number,CultureInfo.InvariantCulture,out amount))throw new SiteException("Sipariş tutarı okunamadı.");
   string id=Text(node,"id");if(id.Length==0)throw new SiteException("Sipariş kimliği eksik.");
   var lines=JsonMap.Arr(JsonMap.Prop(JsonMap.Prop(node,"lineItems"),"nodes"));int qty=(int)JsonMap.Long(JsonMap.Prop(node,"currentSubtotalLineItemsQuantity"));
   string product=lines.Count==0?"Ürün bilgisi yok":Text(lines[0],"name");if(qty>1)product+=" · Toplam "+qty+" adet";
   string financial=Text(node,"displayFinancialStatus"),fulfillment=Text(node,"displayFulfillmentStatus");
   bool cancelled=Text(node,"cancelledAt").Length>0,refunded=financial=="REFUNDED"||financial=="VOIDED";
   bool sale=!cancelled&&!refunded&&(financial=="PAID"||financial=="PARTIALLY_REFUNDED"||financial=="PARTIALLY_PAID"||financial=="AUTHORIZED");
   string status=cancelled?"İptal":refunded?"İade":!sale?"Ödeme bekliyor":financial=="PARTIALLY_REFUNDED"?"Kısmi iade":fulfillment=="FULFILLED"?"Kargoya verildi":"Hazırlanıyor";
   return new OrderRow{Key="web|"+domain+"|"+id,Source=domain,OrderNumber=Text(node,"name"),WhenTurkey=when.ToOffset(TimeSpan.FromHours(3)).DateTime,Amount=amount,Quantity=qty,Product=product,City="",Status=status,CountsAsSale=sale};
  }
 }
}
