using System;
using System.Collections.Generic;
using System.Globalization;

namespace Siparisler {
 internal static class Sources {
  internal const string Trendyol="Trendyol";
  internal const string Hepsiburada="Hepsiburada";
  internal const string N11="n11";
  internal const string Ciceksepeti="Çiçeksepeti";
  internal static readonly string[] All=new[]{Trendyol,Hepsiburada,N11,Ciceksepeti};
 }

 internal static class Clock {
  internal static readonly TimeZoneInfo Turkey=TimeZoneInfo.FindSystemTimeZoneById("Turkey Standard Time");
  internal static Func<DateTime> NowTurkey=delegate { return TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow,Turkey); };
  internal static DateTime Today() { return NowTurkey().Date; }
  internal static DateTime ToTurkey(DateTime utc) {
   var specified=DateTime.SpecifyKind(utc,DateTimeKind.Utc);
   return TimeZoneInfo.ConvertTimeFromUtc(specified,Turkey);
  }
  internal static long TurkeyClockAsUnixMillis(DateTime turkeyLocal) {
   var asUtc=DateTime.SpecifyKind(turkeyLocal,DateTimeKind.Utc);
   return new DateTimeOffset(asUtc).ToUnixTimeMilliseconds();
  }
  internal static DateTime UnixMillisToTurkey(long millis) {
   var utc=DateTimeOffset.FromUnixTimeMilliseconds(millis).UtcDateTime;
   return ToTurkey(utc);
  }
  // Trendyol orderDate is a unix millisecond whose UTC clock face is already Turkey local time.
  internal static DateTime TrendyolMillisToTurkey(long millis) {
   return DateTime.SpecifyKind(DateTimeOffset.FromUnixTimeMilliseconds(millis).UtcDateTime,DateTimeKind.Unspecified);
  }
 }

 internal sealed class OrderRow {
  public string Key;
  public string Source;
  public string OrderNumber;
  public DateTime WhenTurkey;
  public string Product;
  public string City;
  public decimal Amount;
  public int Quantity;
  public string Status;
  public bool CountsAsSale;
 }

 internal static class Money {
  static readonly CultureInfo Turkish=CultureInfo.GetCultureInfo("tr-TR");
  internal static string Format(decimal value) {
   if(value==decimal.Truncate(value)) return value.ToString("N0",Turkish)+" TL";
   return value.ToString("N2",Turkish)+" TL";
  }
 }

 internal static class OrderText {
  internal static string Product(IList<string> names,int quantity) {
   if(names==null||names.Count==0) return "Ürün adı yok";
   string first=names[0];
   if(string.IsNullOrWhiteSpace(first)) first="Ürün adı yok";
   if(names.Count==1) {
    if(quantity>1) return first+" · "+quantity.ToString(CultureInfo.InvariantCulture)+" adet";
    return first;
   }
   return first+" +"+ (names.Count-1).ToString(CultureInfo.InvariantCulture);
  }
  internal static string DayTitle(DateTime day) {
   return day.ToString("d MMMM dddd",CultureInfo.GetCultureInfo("tr-TR"));
  }
  internal static void ApplyStatus(OrderRow row,string raw) {
   string key=(raw??"").Trim().ToLower(CultureInfo.GetCultureInfo("tr-TR"));
   row.CountsAsSale=true;
   if(key.Length==0){row.Status="";return;}
   if(Contains(key,"cancel")||Contains(key,"iptal")||key=="unsupplied"){row.Status="İptal";row.CountsAsSale=false;return;}
   if(Contains(key,"return")||Contains(key,"iade")){row.Status="İade";row.CountsAsSale=false;return;}
   if(Contains(key,"undeliver")||Contains(key,"teslim edilemedi")){row.Status="Teslim edilemedi";row.CountsAsSale=false;return;}
   if(Contains(key,"await")||Contains(key,"ödeme")){row.Status="Ödeme bekliyor";row.CountsAsSale=false;return;}
   if(Contains(key,"deliver")||Contains(key,"teslim")){row.Status="Teslim";return;}
   if(Contains(key,"ship")||Contains(key,"kargo")||Contains(key,"intransit")||Contains(key,"transit")){row.Status="Kargoda";return;}
   if(Contains(key,"pick")||Contains(key,"hazır")){row.Status="Hazırlanıyor";return;}
   if(Contains(key,"invoice")||Contains(key,"fatura")){row.Status="Faturalandı";return;}
   if(Contains(key,"created")||Contains(key,"open")||Contains(key,"yeni")||Contains(key,"unpack")){row.Status="Yeni";return;}
   row.Status=raw.Trim();
  }
  static bool Contains(string text,string part){return text.IndexOf(part,StringComparison.Ordinal)>=0;}
  internal static bool SkipPackage(string raw) {
   string key=(raw??"").Trim().ToLower(CultureInfo.GetCultureInfo("tr-TR"));
   return key=="unpacked";
  }
 }

 internal static class SyncLogic {
  internal static List<OrderRow> Replace(IList<OrderRow> existing,string source,DateTime windowStart,DateTime windowEnd,IList<OrderRow> incoming) {
   var next=new List<OrderRow>();
   if(existing!=null) {
    for(int i=0;i<existing.Count;i++) {
     var row=existing[i];
     bool inside=row.Source==source&&row.WhenTurkey.Date>=windowStart.Date&&row.WhenTurkey.Date<windowEnd.Date;
     if(!inside) next.Add(row);
    }
   }
   if(incoming!=null) {
    for(int i=0;i<incoming.Count;i++) next.Add(incoming[i]);
   }
   next.Sort(delegate(OrderRow a,OrderRow b){return b.WhenTurkey.CompareTo(a.WhenTurkey);});
   return next;
  }
  internal static void Summarize(IList<OrderRow> rows,out int count,out decimal amount) {
   count=0;amount=0m;
   if(rows==null) return;
   for(int i=0;i<rows.Count;i++) {
    if(!rows[i].CountsAsSale) continue;
    count++;
    amount+=rows[i].Amount;
   }
  }
 }
}
