using System;
using System.IO;
using System.Collections.Generic;
using System.Globalization;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading;

namespace Siparisler {
 internal sealed class ApiException:Exception {
  internal readonly int Status;
  internal ApiException(int status,string message):base(message){Status=status;}
 }
 internal sealed class SourceResult {
  internal string Source;
  internal bool Ok;
  internal int Count;
  internal string Error;
  internal DateTime? WindowStart;
  internal DateTime? WindowEnd;
  internal List<OrderRow> Orders=new List<OrderRow>();
  internal static SourceResult Done(string source,List<OrderRow> orders) {
   var result=new SourceResult();
   result.Source=source;result.Ok=true;result.Orders=orders??new List<OrderRow>();result.Count=result.Orders.Count;
   return result;
  }
  internal static SourceResult Fail(string source,string error) {
   var result=new SourceResult();
   result.Source=source;result.Ok=false;result.Error=error??"Bağlantı kurulamadı.";
   return result;
  }
 }

 internal static class Catalog {
  internal static string City(object node) {
   if(node==null) return "";
   string[] direct=new[]{"shippingCity","receiverCity","city"};
   for(int i=0;i<direct.Length;i++) {
    string value=JsonMap.Text(JsonMap.Prop(node,direct[i]));
    if(value.Length>0) return value;
   }
   string[] parents=new[]{"shipmentAddress","shippingAddress","billingAddress","invoiceAddress"};
   for(int i=0;i<parents.Length;i++) {
    string value=JsonMap.Text(JsonMap.Prop(JsonMap.Prop(node,parents[i]),"city"));
    if(value.Length>0) return value;
   }
   return "";
  }
  internal static string ProductName(object line) {
   string name=JsonMap.Text(JsonMap.Prop(line,"productName"));
   if(name.Length==0) name=JsonMap.Text(JsonMap.Prop(line,"name"));
   if(name.Length==0) name=JsonMap.Text(JsonMap.Prop(line,"productTitle"));
   return name;
  }
  internal static List<OrderRow> Dedup(List<OrderRow> rows) {
   var index=new Dictionary<string,int>();
   var result=new List<OrderRow>();
   for(int i=0;i<rows.Count;i++) {
    string key=rows[i].Key??"";
    if(key.Length==0){result.Add(rows[i]);continue;}
    int at;
    if(index.TryGetValue(key,out at)) result[at]=rows[i];
    else { index[key]=result.Count; result.Add(rows[i]); }
   }
   return result;
  }
  internal static OrderRow Build(string source,string key,string orderNumber,DateTime when,string city,string status,IList<string> names,int quantity,decimal amount) {
   var row=new OrderRow();
   row.Source=source;row.Key=key;row.OrderNumber=orderNumber??"";row.WhenTurkey=when;row.City=city??"";
   row.Quantity=quantity<1?1:quantity;row.Amount=amount;
   row.Product=OrderText.Product(names,row.Quantity);
   OrderText.ApplyStatus(row,status);
   return row;
  }
 }

 internal static class TrendyolApi {
  internal static List<OrderRow> Parse(string json){return ParseRoot(JsonMap.Parse(json));}
  internal static List<OrderRow> ParseRoot(object root) {
   var rows=new List<OrderRow>();
   var content=JsonMap.Arr(JsonMap.Prop(root,"content"));
   for(int i=0;i<content.Count;i++) {
    var package=content[i];
    string status=JsonMap.Text(JsonMap.Prop(package,"shipmentPackageStatus"));
    if(status.Length==0) status=JsonMap.Text(JsonMap.Prop(package,"status"));
    if(OrderText.SkipPackage(status)) continue;
    long millis=JsonMap.Long(JsonMap.Prop(package,"orderDate"));
    if(millis<=0) continue;
    var names=new List<string>();
    int quantity=0;
    decimal lineAmount=0m;
    var lines=JsonMap.Arr(JsonMap.Prop(package,"lines"));
    for(int n=0;n<lines.Count;n++) {
     string name=Catalog.ProductName(lines[n]);
     if(name.Length>0) names.Add(name);
     int qty=(int)JsonMap.Long(JsonMap.Prop(lines[n],"quantity"));
     if(qty<1) qty=1;
     quantity+=qty;
     decimal unit=JsonMap.Num(JsonMap.Prop(lines[n],"lineUnitPrice"));
     if(unit==0m) unit=JsonMap.Num(JsonMap.Prop(lines[n],"lineGrossAmount"));
     lineAmount+=unit*qty;
    }
    decimal amount=JsonMap.Prop(package,"packageTotalPrice")==null?lineAmount:JsonMap.Num(JsonMap.Prop(package,"packageTotalPrice"));
    string id=JsonMap.Text(JsonMap.Prop(package,"shipmentPackageId"));
    if(id.Length==0) id=JsonMap.Text(JsonMap.Prop(package,"id"));
    string number=JsonMap.Text(JsonMap.Prop(package,"orderNumber"));
    rows.Add(Catalog.Build(Sources.Trendyol,"ty:"+id,number,Clock.TrendyolMillisToTurkey(millis),Catalog.City(package),status,names,quantity,amount));
   }
   return rows;
  }
  internal static SourceResult Pull(StoreSettings settings,DateTime start,DateTime end) {
   long seller;
   if(!long.TryParse((settings.TrendyolSellerId??"").Trim(),out seller)) throw new ApiException(0,"Trendyol satıcı no sayı olmalı.");
   long startMs=Clock.TurkeyClockAsUnixMillis(start.Date);
   long endMs=Clock.TurkeyClockAsUnixMillis(end.Date);
   string token=Convert.ToBase64String(Encoding.UTF8.GetBytes(settings.TrendyolApiKey.Trim()+":"+settings.TrendyolApiSecret.Trim()));
   var headers=new[]{new HttpHeader("Authorization","Basic "+token),new HttpHeader("User-Agent",seller.ToString(CultureInfo.InvariantCulture)+" - SelfIntegration")};
   var rows=new List<OrderRow>();
   for(int page=0;page<50;page++) {
    string url="https://apigw.trendyol.com/integration/order/sellers/"+seller.ToString(CultureInfo.InvariantCulture)+"/v2/orders?startDate="+startMs.ToString(CultureInfo.InvariantCulture)+"&endDate="+endMs.ToString(CultureInfo.InvariantCulture)+"&orderByField=PackageLastModifiedDate&orderByDirection=DESC&size=200&page="+page.ToString(CultureInfo.InvariantCulture);
    var reply=HttpJson.Send("GET",url,null,headers);
    HttpJson.Ensure(Sources.Trendyol,reply);
    var root=JsonMap.Parse(reply.Body);
    rows.AddRange(ParseRoot(root));
    int totalPages=(int)JsonMap.Long(JsonMap.Prop(root,"totalPages"));
    if(totalPages==0||page+1>=totalPages) break;
   }
   return SourceResult.Done(Sources.Trendyol,Catalog.Dedup(rows));
  }
 }

 internal static class N11Api {
  internal static readonly string[] Statuses=new[]{"Created","Picking","Shipped","Cancelled","Delivered","UnPacked","UnSupplied","UnDelivered"};
  internal static List<OrderRow> Parse(string json){return ParseRoot(JsonMap.Parse(json));}
  internal static List<OrderRow> ParseRoot(object root) {
   var rows=new List<OrderRow>();
   var content=JsonMap.Arr(JsonMap.Prop(root,"content"));
   for(int i=0;i<content.Count;i++) {
    var package=content[i];
    string status=JsonMap.Text(JsonMap.Prop(package,"shipmentPackageStatus"));
    if(OrderText.SkipPackage(status)) continue;
    DateTime? when=JsonMap.When(JsonMap.Prop(package,"orderDate"));
    if(when==null) when=JsonMap.When(JsonMap.Prop(package,"lastModifiedDate"));
    if(when==null) continue;
    var names=new List<string>();
    int quantity=0;
    decimal lineAmount=0m;
    var lines=JsonMap.Arr(JsonMap.Prop(package,"lines"));
    for(int n=0;n<lines.Count;n++) {
     string name=Catalog.ProductName(lines[n]);
     if(name.Length>0) names.Add(name);
     int qty=(int)JsonMap.Long(JsonMap.Prop(lines[n],"quantity"));
     if(qty<1) qty=1;
     quantity+=qty;
     decimal price=JsonMap.Num(JsonMap.Prop(lines[n],"dueAmount"));
     if(price==0m) price=JsonMap.Num(JsonMap.Prop(lines[n],"price"));
     lineAmount+=price*qty;
    }
    decimal amount=JsonMap.Prop(package,"totalAmount")==null?lineAmount:JsonMap.Num(JsonMap.Prop(package,"totalAmount"));
    string id=JsonMap.Text(JsonMap.Prop(package,"id"));
    rows.Add(Catalog.Build(Sources.N11,"n11:"+id,JsonMap.Text(JsonMap.Prop(package,"orderNumber")),when.Value,Catalog.City(package),status,names,quantity,amount));
   }
   return rows;
  }
  internal static SourceResult Pull(StoreSettings settings,DateTime start,DateTime end) {
   long startMs=new DateTimeOffset(start.Date,Clock.Turkey.GetUtcOffset(start.Date)).ToUnixTimeMilliseconds();
   long endMs=new DateTimeOffset(end.Date,Clock.Turkey.GetUtcOffset(end.Date)).ToUnixTimeMilliseconds();
   var headers=new[]{new HttpHeader("appkey",settings.N11Key.Trim()),new HttpHeader("appsecret",settings.N11Secret.Trim())};
   var rows=new List<OrderRow>();
   bool any=false;
   ApiException fatal=null;
   for(int s=0;s<Statuses.Length;s++) {
    try {
     for(int page=0;page<30;page++) {
      string url="https://api.n11.com/rest/delivery/v1/shipmentPackages?startDate="+startMs.ToString(CultureInfo.InvariantCulture)+"&endDate="+endMs.ToString(CultureInfo.InvariantCulture)+"&status="+Statuses[s]+"&orderByDirection=DESC&page="+page.ToString(CultureInfo.InvariantCulture)+"&size=100";
      var reply=HttpJson.Send("GET",url,null,headers);
      if(reply.Status==400||reply.Status==404) break;
      HttpJson.Ensure(Sources.N11,reply);
      var root=JsonMap.Parse(reply.Body);
      var batch=ParseRoot(root);
      rows.AddRange(batch);
      any=true;
      int totalPages=(int)JsonMap.Long(JsonMap.Prop(root,"totalPages"));
      if(totalPages==0) totalPages=(int)JsonMap.Long(JsonMap.Prop(root,"pageCount"));
      if(batch.Count==0||totalPages==0||page+1>=totalPages) break;
     }
    } catch(ApiException ex) {
     if(ex.Status==401||ex.Status==403||ex.Status==0) throw;
     fatal=ex;
    }
   }
   if(!any) {
    if(fatal!=null) throw fatal;
    return SourceResult.Done(Sources.N11,rows);
   }
   return SourceResult.Done(Sources.N11,Catalog.Dedup(rows));
  }
 }

 internal sealed class CsLine {
  internal string OrderId;
  internal string ItemId;
  internal string Name;
  internal int Quantity;
  internal decimal Amount;
  internal string City;
  internal DateTime WhenTurkey;
  internal string Status;
  internal bool KnownWhen;
 }

 internal static class CiceksepetiApi {
  static readonly object Gate=new object();
  static DateTime last=DateTime.MinValue;
  internal static List<CsLine> ReadLines(string json,bool forceCancel) {
   var root=JsonMap.Parse(json);
   var items=JsonMap.Arr(JsonMap.Prop(root,"supplierOrderListWithBranch"));
   if(items.Count==0) items=JsonMap.Arr(JsonMap.Prop(root,"orderItemsList"));
   if(items.Count==0) items=JsonMap.Arr(JsonMap.Prop(root,"orders"));
   var lines=new List<CsLine>();
   for(int i=0;i<items.Count;i++) {
    var item=items[i];
    var line=new CsLine();
    line.OrderId=JsonMap.Text(JsonMap.Prop(item,"orderId"));
    line.ItemId=JsonMap.Text(JsonMap.Prop(item,"orderItemId"));
    if(line.OrderId.Length==0) line.OrderId=JsonMap.Text(JsonMap.Prop(item,"orderNo"));
    if(line.OrderId.Length==0) line.OrderId=JsonMap.Text(JsonMap.Prop(item,"orderItemId"));
    line.Name=Catalog.ProductName(item);
    line.Quantity=(int)JsonMap.Long(JsonMap.Prop(item,"quantity"));
    if(line.Quantity<1) line.Quantity=1;
    if(JsonMap.Prop(item,"totalPrice")!=null) line.Amount=JsonMap.Num(JsonMap.Prop(item,"totalPrice"));
    else line.Amount=JsonMap.Num(JsonMap.Prop(item,"itemPrice"))*line.Quantity;
    line.City=Catalog.City(item);
    DateTime? when=JsonMap.When(JsonMap.Prop(item,"orderCreateDate"));
    if(when==null) when=JsonMap.When(JsonMap.Prop(item,"orderDate"));
    if(when!=null){line.WhenTurkey=when.Value;line.KnownWhen=true;}
    line.Status=forceCancel?"İptal":JsonMap.Text(JsonMap.Prop(item,"orderProductStatus"));
    if(!forceCancel&&line.Status.Length==0) line.Status=JsonMap.Text(JsonMap.Prop(item,"orderItemStatus"));
    lines.Add(line);
   }
   return lines;
  }
  internal static List<OrderRow> Group(List<CsLine> lines) {
   var map=new Dictionary<string,List<CsLine>>();
   var order=new List<string>();
   for(int i=0;i<lines.Count;i++) {
    string id=lines[i].OrderId.Length==0?"satir-"+i.ToString(CultureInfo.InvariantCulture):lines[i].OrderId;
    if(!map.ContainsKey(id)){map[id]=new List<CsLine>();order.Add(id);}
    map[id].Add(lines[i]);
   }
   var rows=new List<OrderRow>();
   for(int i=0;i<order.Count;i++) {
    var group=map[order[i]];
    var names=new List<string>();
    int quantity=0;
    decimal sale=0m;
    decimal all=0m;
    string city="";
    DateTime when=DateTime.MinValue;
    bool known=false;
    string status="";
    bool anySale=false;
    for(int n=0;n<group.Count;n++) {
     if(group[n].Name.Length>0) names.Add(group[n].Name);
     quantity+=group[n].Quantity;
     all+=group[n].Amount;
     if(city.Length==0) city=group[n].City;
     if(group[n].KnownWhen&&(!known||group[n].WhenTurkey<when)){when=group[n].WhenTurkey;known=true;}
     var probe=new OrderRow();
     OrderText.ApplyStatus(probe,group[n].Status);
     if(status.Length==0) status=group[n].Status;
     if(probe.CountsAsSale){sale+=group[n].Amount;anySale=true;status=group[n].Status;}
    }
    if(!known) continue;
    rows.Add(Catalog.Build(Sources.Ciceksepeti,"cs:"+order[i],order[i],when,city,anySale?status:"İptal",names,quantity,anySale?sale:all));
   }
   return rows;
  }
  internal static SourceResult Pull(StoreSettings settings,DateTime start,DateTime end) {
   string startText=start.ToString("yyyy-MM-dd")+"T00:00:00+03:00";
   string endText=end.AddDays(-1).ToString("yyyy-MM-dd")+"T23:59:59+03:00";
   string integrator=string.IsNullOrWhiteSpace(settings.CsIntegrator)?"SelfIntegration":settings.CsIntegrator.Trim();
   var headers=new[]{new HttpHeader("x-api-key",settings.CsApiKey.Trim()),new HttpHeader("User-Agent",(settings.CsSellerId??"").Trim()+" - "+integrator)};
   var lines=ReadPages("https://apis.ciceksepeti.com/api/v1/Order/GetOrders",startText,endText,headers,false);
   try { lines.AddRange(ReadPages("https://apis.ciceksepeti.com/api/v1/Order/GetCanceledOrders",startText,endText,headers,true)); }
   catch(ApiException ex) { if(ex.Status==401||ex.Status==403) throw; }
   return SourceResult.Done(Sources.Ciceksepeti,Catalog.Dedup(Group(DedupLines(lines))));
  }
  static List<CsLine> DedupLines(List<CsLine> lines) {
   var index=new Dictionary<string,int>();
   var result=new List<CsLine>();
   for(int i=0;i<lines.Count;i++) {
    string id=lines[i].ItemId??"";
    if(id.Length==0){result.Add(lines[i]);continue;}
    int at;
    if(index.TryGetValue(id,out at)) result[at]=lines[i];
    else { index[id]=result.Count; result.Add(lines[i]); }
   }
   return result;
  }
  static List<CsLine> ReadPages(string url,string startText,string endText,HttpHeader[] headers,bool forceCancel) {
   var lines=new List<CsLine>();
   int page=0;
   bool lifted=false;
   while(page<20) {
    Wait();
    string body="{\"startDate\":\""+startText+"\",\"endDate\":\""+endText+"\",\"pageSize\":100,\"page\":"+page.ToString(CultureInfo.InvariantCulture)+"}";
    var reply=HttpJson.Send("POST",url,body,headers);
    HttpJson.Ensure(Sources.Ciceksepeti,reply);
    var root=JsonMap.Parse(reply.Body);
    var batch=ReadLines(reply.Body,forceCancel);
    int listed=(int)JsonMap.Long(JsonMap.Prop(root,"orderListCount"));
    if(listed==0) listed=(int)JsonMap.Long(JsonMap.Prop(root,"totalCount"));
    if(batch.Count==0&&listed>0&&page==0&&!lifted){page=1;lifted=true;continue;}
    lines.AddRange(batch);
    int pageCount=(int)JsonMap.Long(JsonMap.Prop(root,"pageCount"));
    if(pageCount==0) pageCount=(int)JsonMap.Long(JsonMap.Prop(root,"totalPages"));
    if(batch.Count==0||batch.Count<100||(pageCount>0&&page+1>=pageCount)) break;
    page++;
   }
   return lines;
  }
  static void Wait() {
   lock(Gate) {
    if(last!=DateTime.MinValue) {
     int pause=5000-(int)(DateTime.UtcNow-last).TotalMilliseconds;
     if(pause>0) Thread.Sleep(pause);
    }
    last=DateTime.UtcNow;
   }
  }
 }

 internal static class HepsiburadaApi {
  internal static List<OrderRow> Parse(string json,string assumedStatus) {
   var root=JsonMap.Parse(json);
   var items=ItemsOf(root);
   var packages=new List<OrderRow>();
   var lines=new List<object>();
   for(int i=0;i<items.Count;i++) {
    bool nested=JsonMap.Arr(JsonMap.Prop(items[i],"items")).Count>0;
    bool package=nested||JsonMap.Text(JsonMap.Prop(items[i],"packageNumber")).Length>0;
    if(package) {
     var row=PackageRow(items[i],assumedStatus);
     if(row!=null) packages.Add(row);
    } else lines.Add(items[i]);
   }
   packages.AddRange(GroupLines(lines,assumedStatus));
   return packages;
  }
  internal static List<OrderRow> Combine(List<OrderRow> packages,List<OrderRow> openOrders,List<OrderRow> cancelled) {
   var taken=new Dictionary<string,bool>(StringComparer.OrdinalIgnoreCase);
   for(int i=0;i<packages.Count;i++) if((packages[i].OrderNumber??"").Length>0) taken[packages[i].OrderNumber]=true;
   var rows=new List<OrderRow>();
   rows.AddRange(packages);
   AddMissing(rows,taken,cancelled);
   AddMissing(rows,taken,openOrders);
   return Catalog.Dedup(rows);
  }
  static void AddMissing(List<OrderRow> rows,Dictionary<string,bool> taken,List<OrderRow> extra) {
   for(int i=0;i<extra.Count;i++) {
    string number=extra[i].OrderNumber??"";
    if(number.Length>0&&taken.ContainsKey(number)) continue;
    if(number.Length>0) taken[number]=true;
    rows.Add(extra[i]);
   }
  }
  static List<object> ItemsOf(object root) {
   if(!(root is Dictionary<string,object>)) return JsonMap.Arr(root);
   var items=JsonMap.Arr(JsonMap.Prop(root,"items"));
   if(items.Count==0) items=JsonMap.Arr(JsonMap.Prop(root,"data"));
   if(items.Count==0) items=JsonMap.Arr(JsonMap.Prop(root,"content"));
   return items;
  }
  static OrderRow PackageRow(object package,string assumedStatus) {
   DateTime? when=JsonMap.When(JsonMap.Prop(package,"orderDate"));
   var nested=JsonMap.Arr(JsonMap.Prop(package,"items"));
   if(when==null&&nested.Count>0) when=JsonMap.When(JsonMap.Prop(nested[0],"orderDate"));
   if(when==null) return null;
   var names=new List<string>();
   int quantity=0;
   decimal amount=0m;
   string number=JsonMap.Text(JsonMap.Prop(package,"orderNumber"));
   for(int i=0;i<nested.Count;i++) {
    string name=Catalog.ProductName(nested[i]);
    if(name.Length>0) names.Add(name);
    int qty=(int)JsonMap.Long(JsonMap.Prop(nested[i],"quantity"));
    if(qty<1) qty=1;
    quantity+=qty;
    amount+=JsonMap.MoneyOf(JsonMap.Prop(nested[i],"totalPrice"));
    if(number.Length==0) number=JsonMap.Text(JsonMap.Prop(nested[i],"orderNumber"));
   }
   if(nested.Count==0) {
    string name=Catalog.ProductName(package);
    if(name.Length>0) names.Add(name);
    quantity=1;
    amount=JsonMap.MoneyOf(JsonMap.Prop(package,"totalPrice"));
   }
   string status=JsonMap.Text(JsonMap.Prop(package,"status"));
   if(status.Length==0) status=assumedStatus??"";
   string id=JsonMap.Text(JsonMap.Prop(package,"packageNumber"));
   if(id.Length==0) id=JsonMap.Text(JsonMap.Prop(package,"id"));
   string city=Catalog.City(package);
   return Catalog.Build(Sources.Hepsiburada,"hb:pkg:"+id,number,when.Value,city,status,names,quantity,amount);
  }
  static List<OrderRow> GroupLines(List<object> lines,string assumedStatus) {
   var map=new Dictionary<string,List<object>>();
   var order=new List<string>();
   for(int i=0;i<lines.Count;i++) {
    string number=JsonMap.Text(JsonMap.Prop(lines[i],"orderNumber"));
    if(number.Length==0) number="satir-"+i.ToString(CultureInfo.InvariantCulture);
    if(!map.ContainsKey(number)){map[number]=new List<object>();order.Add(number);}
    map[number].Add(lines[i]);
   }
   var rows=new List<OrderRow>();
   for(int i=0;i<order.Count;i++) {
    var group=map[order[i]];
    var names=new List<string>();
    int quantity=0;
    decimal amount=0m;
    string city="";
    DateTime when=DateTime.MinValue;
    bool known=false;
    string status=assumedStatus??"";
    for(int n=0;n<group.Count;n++) {
     string name=Catalog.ProductName(group[n]);
     if(name.Length>0) names.Add(name);
     int qty=(int)JsonMap.Long(JsonMap.Prop(group[n],"quantity"));
     if(qty<1) qty=1;
     quantity+=qty;
     amount+=JsonMap.MoneyOf(JsonMap.Prop(group[n],"totalPrice"));
     if(city.Length==0) city=Catalog.City(group[n]);
     DateTime? itemWhen=JsonMap.When(JsonMap.Prop(group[n],"orderDate"));
     if(itemWhen!=null&&(!known||itemWhen.Value<when)){when=itemWhen.Value;known=true;}
     if(status.Length==0) status=JsonMap.Text(JsonMap.Prop(group[n],"status"));
    }
    if(!known) continue;
    string key=string.Equals(assumedStatus,"Cancelled",StringComparison.OrdinalIgnoreCase)?"hb:cancel:"+order[i]:"hb:order:"+order[i];
    rows.Add(Catalog.Build(Sources.Hepsiburada,key,order[i],when,city,status.Length==0?"Open":status,names,quantity,amount));
   }
   return rows;
  }
  internal static SourceResult Pull(StoreSettings settings,DateTime start,DateTime end) {
   string merchant=(settings.HbMerchantId??"").Trim();
   string token=Convert.ToBase64String(Encoding.UTF8.GetBytes(settings.HbUserOrMerchant()+":"+settings.HbPassword.Trim()));
   var headers=new[]{new HttpHeader("Authorization","Basic "+token),new HttpHeader("User-Agent","Siparisler")};
   string root="https://oms-external.hepsiburada.com";
   var packages=new List<OrderRow>();
   packages.AddRange(Fetch(root+"/packages/merchantid/"+Uri.EscapeDataString(merchant),headers,start,end,""));
   packages.AddRange(Fetch(root+"/packages/merchantid/"+Uri.EscapeDataString(merchant)+"/shipped",headers,start,end,"Shipped"));
   packages.AddRange(Fetch(root+"/packages/merchantid/"+Uri.EscapeDataString(merchant)+"/delivered",headers,start,end,"Delivered"));
   packages.AddRange(Fetch(root+"/packages/merchantid/"+Uri.EscapeDataString(merchant)+"/undelivered",headers,start,end,"Undelivered"));
   var cancelled=Fetch(root+"/orders/merchantid/"+Uri.EscapeDataString(merchant)+"/cancelled",headers,start,end,"Cancelled");
   var open=Fetch(root+"/orders/merchantid/"+Uri.EscapeDataString(merchant),headers,start,end,"");
   return SourceResult.Done(Sources.Hepsiburada,Combine(packages,open,cancelled));
  }
  static List<OrderRow> Fetch(string path,HttpHeader[] headers,DateTime start,DateTime end,string assumedStatus) {
   var rows=new List<OrderRow>();
   for(DateTime day=start.Date;day<end.Date;day=day.AddDays(1)) {
    string begin=day.ToString("yyyy-MM-dd")+" 00:00";
    string finish=day.ToString("yyyy-MM-dd")+" 23:59";
    int offset=0;
    while(offset<2000) {
     string url=path+"?offset="+offset.ToString(CultureInfo.InvariantCulture)+"&limit=100&begindate="+Uri.EscapeDataString(begin)+"&enddate="+Uri.EscapeDataString(finish);
     var reply=HttpJson.Send("GET",url,null,headers);
     if(reply.Status==404) return rows;
     HttpJson.Ensure(Sources.Hepsiburada,reply);
     if(string.IsNullOrWhiteSpace(reply.Body)) break;
     var root=JsonMap.Parse(reply.Body);
     var batch=Parse(reply.Body,assumedStatus);
     rows.AddRange(batch);
     int count=ItemsOf(root).Count;
     int total=(int)JsonMap.Long(JsonMap.Prop(root,"totalCount"));
     offset+=count==0?100:count;
     if(count==0||count<100||(total>0&&offset>=total)) break;
     Thread.Sleep(80);
    }
    Thread.Sleep(80);
   }
   return rows;
  }
 }

 internal sealed class HttpHeader {
  internal readonly string Name;
  internal readonly string Value;
  internal HttpHeader(string name,string value){Name=name;Value=value;}
 }
 internal sealed class HttpReply {
  internal int Status;
  internal string Body;
 }
 internal static class HttpJson {
  static readonly HttpClient Client=Create();
  static HttpClient Create() {
   ServicePointManager.SecurityProtocol=SecurityProtocolType.Tls12;
   ServicePointManager.Expect100Continue=false;
   ServicePointManager.DefaultConnectionLimit=8;
   var handler=new HttpClientHandler();
   handler.AutomaticDecompression=DecompressionMethods.GZip|DecompressionMethods.Deflate;
   var client=new HttpClient(handler);
   client.Timeout=TimeSpan.FromSeconds(40);
   return client;
  }
  internal static HttpReply Send(string method,string url,string body,HttpHeader[] headers) {
   var reply=Once(method,url,body,headers);
   if(reply.Status==429) {
    Thread.Sleep(2000);
    reply=Once(method,url,body,headers);
   }
   return reply;
  }
  static HttpReply Once(string method,string url,string body,HttpHeader[] headers) {
   var request=new HttpRequestMessage(new HttpMethod(method),url);
   request.Headers.TryAddWithoutValidation("Accept","application/json");
   if(headers!=null) {
    for(int i=0;i<headers.Length;i++) {
     if(headers[i].Name=="Authorization") request.Headers.Authorization=AuthenticationHeaderValue.Parse(headers[i].Value);
     else request.Headers.TryAddWithoutValidation(headers[i].Name,headers[i].Value);
    }
   }
   if(body!=null) request.Content=new StringContent(body,Encoding.UTF8,"application/json");
   var response=Client.SendAsync(request).Result;
   var reply=new HttpReply();
   reply.Status=(int)response.StatusCode;
   reply.Body=response.Content.ReadAsStringAsync().Result??"";
   return reply;
  }
  internal static void Ensure(string source,HttpReply reply) {
   if(reply.Status>=200&&reply.Status<300) {
    string trimmed=(reply.Body??"").TrimStart();
    if(trimmed.StartsWith("<",StringComparison.Ordinal)) throw new ApiException(reply.Status,source+" yanıtı okunamadı.");
    return;
   }
   string detail=Detail(reply.Body);
   string message;
   if(reply.Status==401||reply.Status==403) message=source+" bilgileri kabul etmedi.";
   else if(reply.Status==429) message=source+" çok fazla istek aldı. Bir dakika sonra tekrar deneyin.";
   else if(detail.Length>0) message=source+": "+detail;
   else message=source+" yanıt vermedi.";
   throw new ApiException(reply.Status,message);
  }
  static string Detail(string body) {
   if(string.IsNullOrWhiteSpace(body)||body.TrimStart().StartsWith("<",StringComparison.Ordinal)) return "";
   try {
    var root=JsonMap.Parse(body);
    string message=JsonMap.Text(JsonMap.Prop(root,"message"));
    if(message.Length==0) message=JsonMap.Text(JsonMap.Prop(root,"exception"));
    if(message.Length>140) message=message.Substring(0,140);
    return message;
   } catch { return ""; }
  }
 }

 internal static class Syncer {
  internal static bool Run(StoreSettings settings,IList<OrderRow> existing,out List<OrderRow> orders,out string note,out bool warn,string siteFolder=null) {
   orders=existing==null?new List<OrderRow>():new List<OrderRow>(existing);note="";warn=true;
   if(siteFolder==null)return RunCore(settings,existing,out orders,out note,out warn,null,new Dictionary<string,object>());
   Directory.CreateDirectory(siteFolder);
   FileStream gate;
   try{gate=new FileStream(Path.Combine(siteFolder,"siparis-getirme.lock"),FileMode.OpenOrCreate,FileAccess.ReadWrite,FileShare.None);}catch(IOException){note="Siparişler başka ekranda getiriliyor. Bitince yenileyin.";return false;}
   using(gate){
    var store=new Store(siteFolder);var saved=store.LoadOrders();var states=saved.ConnectionStates;
    settings=store.LoadSettings();
    foreach(string source in Sources.All)states.Remove(source);
    var sites=new HashSet<string>();try{foreach(var c in Websites.Config(siteFolder))sites.Add(Websites.Domain(c[1]));}catch{}
    foreach(string source in new[]{"gunerofis.com","sumentakimi.com","sumentakimi.com.tr","imalattansumen.com"})SetReady(states,source,sites.Contains(source));
    bool ran=RunCore(settings,saved.Orders,out orders,out note,out warn,siteFolder,states);
    saved.Orders=orders;saved.Note=note;
    if(ran){bool success=false;foreach(var value in states.Values){var row=value as Dictionary<string,object>;if(row!=null&&JsonMap.Text(JsonMap.Prop(row,"state"))=="current")success=true;}if(success)saved.LastSyncUtc=DateTime.UtcNow.ToString("o");}
    store.SaveOrders(saved);return ran;
   }
  }
  static void SetReady(Dictionary<string,object> states,string source,bool ready){
   Dictionary<string,object> row=states.ContainsKey(source)?states[source] as Dictionary<string,object>:null;
   if(row==null)row=new Dictionary<string,object>();
   row["ready"]=ready;row["state"]=ready?"unchecked":"disconnected";row["error"]="";states[source]=row;
  }
  internal static void Record(Dictionary<string,object> states,SourceResult result,DateTime start,DateTime end){
   var row=states.ContainsKey(result.Source)?states[result.Source] as Dictionary<string,object>:null;
   if(row==null)row=new Dictionary<string,object>();
   row["ready"]=true;row["lastAttemptUtc"]=DateTime.UtcNow.ToString("o");row["state"]=result.Ok?"current":"error";
   row["error"]=result.Ok?"":"Kaynak yanıtı alınamadı. Önceki kayıtlar korundu.";
   if(result.Ok){row["lastSuccessUtc"]=row["lastAttemptUtc"];row["count"]=result.Count;row["from"]=start.ToString("yyyy-MM-dd");row["until"]=end.ToString("yyyy-MM-dd");}
   states[result.Source]=row;
  }
  static bool RunCore(StoreSettings settings,IList<OrderRow> existing,out List<OrderRow> orders,out string note,out bool warn,string siteFolder,Dictionary<string,object> states) {
   orders=existing==null?new List<OrderRow>():new List<OrderRow>(existing);
   if(settings==null||siteFolder==null||!Websites.Any(siteFolder)){note="Önce ayarlardan web sitesini girin.";warn=true;return false;}
   DateTime start=Clock.Today().AddDays(-6);
   DateTime end=Clock.Today().AddDays(1);
   var tasks=new List<System.Threading.Tasks.Task<SourceResult>>();
   // 30.10.2026: Pazaryerleri Siparişler'den kaldırıldı; yalnız web siteleri getirilir.
   System.Threading.Tasks.Task.WaitAll(tasks.ToArray());
   var results=new List<SourceResult>();
   for(int i=0;i<tasks.Count;i++) results.Add(tasks[i].Result);
   if(siteFolder!=null) results.AddRange(Websites.PullAll(siteFolder,start,end));
   for(int i=0;i<results.Count;i++) {
    DateTime sourceStart=results[i].WindowStart??(results[i].Source=="sumentakimi.com.tr"?new DateTime(1900,1,1):start);
    DateTime sourceEnd=results[i].WindowEnd??end;
    Record(states,results[i],sourceStart,sourceEnd);
    if(!results[i].Ok) continue;
    orders=SyncLogic.Replace(orders,results[i].Source,sourceStart,sourceEnd,results[i].Orders);
   }
   note=Compose(results,Clock.NowTurkey());
   warn=false;
   for(int i=0;i<results.Count;i++) if(!results[i].Ok) warn=true;
   return true;
  }
  static System.Threading.Tasks.Task<SourceResult> Start(string source,StoreSettings settings,Func<SourceResult> pull) {
   return System.Threading.Tasks.Task.Factory.StartNew(delegate {
    try { return pull(); }
    catch(ApiException ex){return SourceResult.Fail(source,Store.Scrub(ex.Message,settings));}
    catch(Exception ex){return SourceResult.Fail(source,Store.Scrub(string.IsNullOrWhiteSpace(ex.Message)?"Bağlantı kurulamadı.":ex.Message,settings));}
   });
  }
  internal static string Compose(IList<SourceResult> results,DateTime now) {
   var parts=new List<string>();
   for(int i=0;i<results.Count;i++) {
    if(results[i].Ok) parts.Add(results[i].Source+" "+results[i].Count.ToString(CultureInfo.InvariantCulture));
    else parts.Add(results[i].Source+": "+results[i].Error);
   }
   return "Son getirme "+now.ToString("HH:mm")+" · "+string.Join(" · ",parts.ToArray());
  }
 }
}
