using System;
using System.Collections.Generic;

namespace Siparisler {
 internal sealed class Desk {
  internal readonly Store Store;
  internal StoreSettings Settings;
  internal List<OrderRow> Orders=new List<OrderRow>();
  internal DateTime Selected;
  internal string Filter="Tümü";
  internal string Brand="Güner Ofis";
  internal string Note="";
  internal string LastSyncUtc="";
  internal bool NoteWarn;
  internal bool Busy;
  internal Desk(Store store) {
   Store=store;
   Settings=store.LoadSettings();
   var saved=store.LoadOrders();
   Orders=saved.Orders;
   Note=saved.Note;
   LastSyncUtc=saved.LastSyncUtc;
   Selected=Clock.Today();
  }
  internal bool CanBack(){return Selected.Date>Clock.Today().AddDays(-6);}
  internal bool CanForward(){return Selected.Date<Clock.Today();}
  internal void Shift(int days) {
   if(Busy) return;
   var next=Selected.Date.AddDays(days);
   if(next<Clock.Today().AddDays(-6)||next>Clock.Today()) return;
   Selected=next;
  }
  internal void GoToday(){if(!Busy) Selected=Clock.Today();}
  internal List<OrderRow> Visible() {
   var list=new List<OrderRow>();
   for(int i=0;i<Orders.Count;i++) {
    var row=Orders[i];
    if(row.WhenTurkey.Date!=Selected.Date) continue;
    if(BrandOf(row.Source)!=Brand)continue;
    if(Filter=="WEB SİTESİ"){if(row.Source.IndexOf('.')<0)continue;}
    else if(Filter!="Tümü"&&row.Source!=Filter) continue;
    list.Add(row);
   }
   list.Sort(delegate(OrderRow a,OrderRow b) {
    int time=b.WhenTurkey.CompareTo(a.WhenTurkey);
    if(time!=0) return time;
    return string.Compare(a.Source,b.Source,StringComparison.CurrentCulture);
   });
   return list;
  }
  internal static string BrandOf(string source){
   if(source=="sumentakimi.com"||source=="sumentakimi.com.tr")return "Makro Ofis";
   if(source=="imalattansumen.com"||Array.IndexOf(Sources.All,source)>=0)return "Güner Ofis";
   return "";
  }
  internal bool ChannelReady(){
   if(Filter=="Tümü")return true;
   if(Filter=="WEB SİTESİ")return true;
   if(Brand=="Makro Ofis")return false;
   if(Filter==Sources.Trendyol)return Settings.TrendyolReady();
   if(Filter==Sources.Hepsiburada)return Settings.HepsiburadaReady();
   if(Filter==Sources.N11)return Settings.N11Ready();
   if(Filter==Sources.Ciceksepeti)return Settings.CiceksepetiReady();
   return false;
  }
  internal void Summary(IList<OrderRow> rows,out int count,out decimal amount){SyncLogic.Summarize(rows,out count,out amount);}
  internal void Remember() {
   var saved=new SavedDay();
   saved.Orders=Orders;
   saved.Note=Note??"";
   saved.LastSyncUtc=LastSyncUtc??"";
   Store.SaveOrders(saved);
  }
  internal void DropSource(string source) {
   var next=new List<OrderRow>();
   for(int i=0;i<Orders.Count;i++) if(Orders[i].Source!=source) next.Add(Orders[i]);
   Orders=next;
  }
 }
}
