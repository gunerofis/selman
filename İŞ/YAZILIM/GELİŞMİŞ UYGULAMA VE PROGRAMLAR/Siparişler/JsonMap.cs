using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.Web.Script.Serialization;

namespace Siparisler {
 internal static class JsonMap {
  internal static object Parse(string json) {
   var serializer=new JavaScriptSerializer();
   serializer.MaxJsonLength=20*1024*1024;
   return serializer.DeserializeObject(json);
  }
  internal static string Write(object value) {
   var serializer=new JavaScriptSerializer();
   serializer.MaxJsonLength=20*1024*1024;
   return serializer.Serialize(value);
  }
  internal static object Prop(object node,string name) {
   var dict=node as Dictionary<string,object>;
   if(dict==null||name==null) return null;
   object value;
   if(dict.TryGetValue(name,out value)) return value;
   foreach(var pair in dict) {
    if(string.Equals(pair.Key,name,StringComparison.OrdinalIgnoreCase)) return pair.Value;
   }
   return null;
  }
  internal static List<object> Arr(object node) {
   var result=new List<object>();
   var list=node as IList;
   if(list==null) return result;
   foreach(var item in list) result.Add(item);
   return result;
  }
  internal static string Text(object node) {
   if(node==null) return "";
   if(node is string) return ((string)node).Trim();
   if(node is bool) return ((bool)node)?"true":"false";
   return Convert.ToString(node,CultureInfo.InvariantCulture)??"";
  }
  internal static decimal Num(object node) {
   if(node==null) return 0m;
   if(node is decimal) return (decimal)node;
   if(node is int) return (int)node;
   if(node is long) return (long)node;
   if(node is double) return Convert.ToDecimal((double)node,CultureInfo.InvariantCulture);
   if(node is float) return Convert.ToDecimal((float)node,CultureInfo.InvariantCulture);
   decimal parsed;
   if(decimal.TryParse(Text(node),NumberStyles.Any,CultureInfo.InvariantCulture,out parsed)) return parsed;
   if(decimal.TryParse(Text(node),NumberStyles.Any,CultureInfo.GetCultureInfo("tr-TR"),out parsed)) return parsed;
   return 0m;
  }
  internal static long Long(object node) {
   if(node==null) return 0L;
   if(node is long) return (long)node;
   if(node is int) return (int)node;
   if(node is decimal) return (long)(decimal)node;
   long parsed;
   if(long.TryParse(Text(node),NumberStyles.Any,CultureInfo.InvariantCulture,out parsed)) return parsed;
   return 0L;
  }
  internal static decimal MoneyOf(object node) {
   if(node==null) return 0m;
   if(node is Dictionary<string,object>) {
    var amount=Prop(node,"amount");
    if(amount==null) amount=Prop(node,"value");
    return Num(amount);
   }
   return Num(node);
  }
  internal static DateTime? When(object node) {
   if(node==null) return null;
   if(node is int||node is long||node is decimal||node is double) {
    long millis=Long(node);
    if(millis>1000000000000L) return Clock.UnixMillisToTurkey(millis);
    if(millis>1000000000L) return Clock.UnixMillisToTurkey(millis*1000L);
   }
   string text=Text(node);
   if(text.Length==0) return null;
   if(text.StartsWith("/Date(",StringComparison.Ordinal)) {
    int end=text.IndexOf(')');
    if(end>6) {
     string inner=text.Substring(6,end-6);
     int plus=inner.IndexOf('+');
     int minus=inner.IndexOf('-');
     int cut=plus>0?plus:(minus>0?minus:inner.Length);
     long millis;
     if(long.TryParse(inner.Substring(0,cut),out millis)) return Clock.UnixMillisToTurkey(millis);
    }
   }
   if(HasZone(text)) {
    DateTimeOffset offset;
    if(DateTimeOffset.TryParse(text,CultureInfo.InvariantCulture,DateTimeStyles.None,out offset)) return Clock.ToTurkey(offset.UtcDateTime);
   }
   string plain=text;
   int fraction=plain.IndexOf('.');
   if(fraction>0) plain=plain.Substring(0,fraction);
   DateTime local;
   string[] patterns=new[]{"yyyy-MM-ddTHH:mm:ss","yyyy-MM-dd HH:mm:ss","yyyy-MM-dd HH:mm","yyyy-MM-dd","dd.MM.yyyy HH:mm:ss","dd.MM.yyyy HH:mm","dd.MM.yyyy","dd/MM/yyyy HH:mm"};
   if(DateTime.TryParseExact(plain,patterns,CultureInfo.InvariantCulture,DateTimeStyles.None,out local)) return DateTime.SpecifyKind(local,DateTimeKind.Unspecified);
   if(DateTime.TryParse(plain,CultureInfo.GetCultureInfo("tr-TR"),DateTimeStyles.None,out local)) return DateTime.SpecifyKind(local,DateTimeKind.Unspecified);
   return null;
  }
  static bool HasZone(string text) {
   if(text.EndsWith("Z",StringComparison.OrdinalIgnoreCase)) return true;
   int time=text.IndexOf('T');
   if(time<0) time=text.IndexOf(' ');
   if(time<0) return false;
   if(text.IndexOf('+',time)>=0) return true;
   return text.LastIndexOf('-')>time+2;
  }
 }
}
