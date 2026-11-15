using System;
using System.Collections.Generic;
using System.IO;
using System.Security.Cryptography;
using System.Text;

namespace Siparisler {
 internal sealed class StoreSettings {
  public string TrendyolSellerId="";
  public string TrendyolApiKey="";
  public string TrendyolApiSecret="";
  public string HbMerchantId="";
  public string HbUser="";
  public string HbPassword="";
  public string N11Key="";
  public string N11Secret="";
  public string CsSellerId="";
  public string CsIntegrator="SelfIntegration";
  public string CsApiKey="";
  internal bool TrendyolReady(){return Has(TrendyolSellerId)&&Has(TrendyolApiKey)&&Has(TrendyolApiSecret);}
  internal bool HepsiburadaReady(){return Has(HbMerchantId)&&Has(HbPassword);}
  internal bool N11Ready(){return Has(N11Key)&&Has(N11Secret);}
  internal bool CiceksepetiReady(){return Has(CsSellerId)&&Has(CsApiKey);}
  internal bool AnyReady(){return TrendyolReady()||HepsiburadaReady()||N11Ready()||CiceksepetiReady();}
  internal string HbUserOrMerchant(){return Has(HbUser)?HbUser.Trim():HbMerchantId.Trim();}
  static bool Has(string value){return !string.IsNullOrWhiteSpace(value);}
 }

 internal sealed class SavedDay {
  public List<OrderRow> Orders=new List<OrderRow>();
  public Dictionary<string,object> ConnectionStates=new Dictionary<string,object>();
  public string LastSyncUtc="";
  public string Note="";
 }

 internal sealed class Store {
  internal readonly string Folder;
  internal Store(string folder){Folder=folder;Directory.CreateDirectory(folder);}
  string SettingsPath(){return Path.Combine(Folder,"ayar.json");}
  string OrdersPath(){return Path.Combine(Folder,"siparisler.json");}
  internal StoreSettings LoadSettings() {
   var settings=new StoreSettings();
   try {
   if(!File.Exists(SettingsPath())) return settings;
   var root=JsonMap.Parse(File.ReadAllText(SettingsPath())) as Dictionary<string,object>;
   if(root==null) return settings;
   settings.TrendyolSellerId=JsonMap.Text(JsonMap.Prop(root,"trendyolSellerId"));
   settings.TrendyolApiKey=Unprotect(JsonMap.Text(JsonMap.Prop(root,"trendyolApiKey")));
   settings.TrendyolApiSecret=Unprotect(JsonMap.Text(JsonMap.Prop(root,"trendyolApiSecret")));
   settings.HbMerchantId=JsonMap.Text(JsonMap.Prop(root,"hbMerchantId"));
   settings.HbUser=JsonMap.Text(JsonMap.Prop(root,"hbUser"));
   settings.HbPassword=Unprotect(JsonMap.Text(JsonMap.Prop(root,"hbPassword")));
   settings.N11Key=Unprotect(JsonMap.Text(JsonMap.Prop(root,"n11Key")));
   settings.N11Secret=Unprotect(JsonMap.Text(JsonMap.Prop(root,"n11Secret")));
   settings.CsSellerId=JsonMap.Text(JsonMap.Prop(root,"csSellerId"));
   settings.CsIntegrator=JsonMap.Text(JsonMap.Prop(root,"csIntegrator"));
   if(settings.CsIntegrator.Length==0) settings.CsIntegrator="SelfIntegration";
   settings.CsApiKey=Unprotect(JsonMap.Text(JsonMap.Prop(root,"csApiKey")));
   return settings;
   } catch { return new StoreSettings(); }
  }
  internal void SaveSettings(StoreSettings settings) {
   var root=new Dictionary<string,object>();
   root["trendyolSellerId"]=settings.TrendyolSellerId??"";
   root["trendyolApiKey"]=Protect(settings.TrendyolApiKey);
   root["trendyolApiSecret"]=Protect(settings.TrendyolApiSecret);
   root["hbMerchantId"]=settings.HbMerchantId??"";
   root["hbUser"]=settings.HbUser??"";
   root["hbPassword"]=Protect(settings.HbPassword);
   root["n11Key"]=Protect(settings.N11Key);
   root["n11Secret"]=Protect(settings.N11Secret);
   root["csSellerId"]=settings.CsSellerId??"";
   root["csIntegrator"]=string.IsNullOrWhiteSpace(settings.CsIntegrator)?"SelfIntegration":settings.CsIntegrator;
   root["csApiKey"]=Protect(settings.CsApiKey);
   AtomicWrite(SettingsPath(),JsonMap.Write(root));
  }
  internal SavedDay LoadOrders() {
   var saved=new SavedDay();
   try {
   if(!File.Exists(OrdersPath())) return saved;
   var root=JsonMap.Parse(File.ReadAllText(OrdersPath())) as Dictionary<string,object>;
   if(root==null) return saved;
   saved.ConnectionStates=JsonMap.Prop(root,"connectionStates") as Dictionary<string,object>??new Dictionary<string,object>();
   saved.LastSyncUtc=JsonMap.Text(JsonMap.Prop(root,"lastSyncUtc"));
   saved.Note=JsonMap.Text(JsonMap.Prop(root,"note"));
   var items=JsonMap.Arr(JsonMap.Prop(root,"orders"));
   for(int i=0;i<items.Count;i++) {
    var node=items[i];
    var when=JsonMap.When(JsonMap.Prop(node,"when"));
    if(when==null) continue;
    var row=new OrderRow();
    row.Key=JsonMap.Text(JsonMap.Prop(node,"key"));
    row.Source=JsonMap.Text(JsonMap.Prop(node,"source"));
    row.OrderNumber=JsonMap.Text(JsonMap.Prop(node,"orderNumber"));
    row.WhenTurkey=when.Value;
    row.Product=JsonMap.Text(JsonMap.Prop(node,"product"));
    row.City=JsonMap.Text(JsonMap.Prop(node,"city"));
    row.Amount=JsonMap.Num(JsonMap.Prop(node,"amount"));
    row.Quantity=(int)JsonMap.Long(JsonMap.Prop(node,"quantity"));
    row.Status=JsonMap.Text(JsonMap.Prop(node,"status"));
    row.CountsAsSale=JsonMap.Text(JsonMap.Prop(node,"countsAsSale"))!="false";
    if(row.Key.Length==0) row.Key=row.Source+"|"+row.OrderNumber+"|"+row.WhenTurkey.Ticks.ToString();
    saved.Orders.Add(row);
   }
   saved.Orders=SyncLogic.Clean(saved.Orders);
   return saved;
   } catch { return new SavedDay(); }
  }
  internal void SaveOrders(SavedDay saved) {
   var list=new List<object>();
   var cutoff=Clock.Today().AddDays(-45);
   for(int i=0;i<saved.Orders.Count;i++) {
    var row=saved.Orders[i];
    if(row.WhenTurkey.Date<cutoff&&row.Source!="sumentakimi.com.tr"&&row.Source!="gunerofis.com") continue;
    var node=new Dictionary<string,object>();
    node["key"]=row.Key??"";
    node["source"]=row.Source??"";
    node["orderNumber"]=row.OrderNumber??"";
    node["when"]=row.WhenTurkey.ToString("yyyy-MM-ddTHH:mm:ss");
    node["product"]=row.Product??"";
    node["city"]=row.City??"";
    node["amount"]=row.Amount;
    node["quantity"]=row.Quantity;
    node["status"]=row.Status??"";
    node["countsAsSale"]=row.CountsAsSale?"true":"false";
    list.Add(node);
   }
   var root=new Dictionary<string,object>();
   root["connectionStates"]=saved.ConnectionStates;
   root["lastSyncUtc"]=saved.LastSyncUtc??"";
   root["note"]=saved.Note??"";
   root["orders"]=list;
   AtomicWrite(OrdersPath(),JsonMap.Write(root));
  }
  internal static string Scrub(string text,StoreSettings settings) {
   if(string.IsNullOrEmpty(text)||settings==null) return text??"";
   string[] secrets=new[]{settings.TrendyolApiKey,settings.TrendyolApiSecret,settings.HbPassword,settings.N11Key,settings.N11Secret,settings.CsApiKey};
   for(int i=0;i<secrets.Length;i++) {
    if(!string.IsNullOrEmpty(secrets[i])&&secrets[i].Length>3) text=text.Replace(secrets[i],"***");
   }
   if(text.Length>180) text=text.Substring(0,180);
   return text;
  }
  static string Protect(string value) {
   if(string.IsNullOrEmpty(value)) return "";
   byte[] raw=Encoding.UTF8.GetBytes(value);
   byte[] locked=ProtectedData.Protect(raw,null,DataProtectionScope.CurrentUser);
   return "dpapi:"+Convert.ToBase64String(locked);
  }
  static string Unprotect(string value) {
   try {
    if(string.IsNullOrEmpty(value)) return "";
    if(!value.StartsWith("dpapi:",StringComparison.Ordinal)) return "";
    byte[] locked=Convert.FromBase64String(value.Substring(6));
    byte[] raw=ProtectedData.Unprotect(locked,null,DataProtectionScope.CurrentUser);
    return Encoding.UTF8.GetString(raw);
   } catch { return ""; }
  }
  static void AtomicWrite(string path,string content) {
   string temp=path+".tmp";
   File.WriteAllText(temp,content);
   if(File.Exists(path)) File.Replace(temp,path,null);
   else File.Move(temp,path);
  }
 }
}
