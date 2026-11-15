using System;using System.IO;using System.Linq;using System.Text;using System.Collections.Generic;using System.Reflection;using System.Security.Cryptography;
namespace Siparisler {
class SettingsApi {
 static readonly string[] Public={"TrendyolSellerId","HbMerchantId","HbUser","CsSellerId","CsIntegrator"};
 static readonly string[] Secrets={"TrendyolApiKey","TrendyolApiSecret","HbPassword","N11Key","N11Secret","CsApiKey"};
 static string Revision(string folder){using(var hash=SHA256.Create()){var text=string.Join("|",new[]{"ayar.json","web-siteleri.json"}.Select(n=>File.Exists(Path.Combine(folder,n))?File.ReadAllText(Path.Combine(folder,n)):""));return BitConverter.ToString(hash.ComputeHash(Encoding.UTF8.GetBytes(text))).Replace("-","");}}
 static string Text(Dictionary<string,object> p,string k){object v;return p.TryGetValue(k,out v)?Convert.ToString(v):"";}
 static void Backup(string file){if(File.Exists(file))File.Copy(file,file+".previous",true);}
 static int Main(string[] args){Console.OutputEncoding=new UTF8Encoding(false);Console.InputEncoding=new UTF8Encoding(false);try{
  var folder=args.Length>1?args[1]:Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),"Siparisler");var store=new Store(folder);var settings=store.LoadSettings();var sitePath=Path.Combine(folder,"web-siteleri.json");
  if(args.Length>0&&args[0]=="save"){
   var p=JsonMap.Parse(Console.In.ReadToEnd()) as Dictionary<string,object>;if(p==null)throw new Exception("Geçersiz ayar.");
   if(Text(p,"revision")!=Revision(folder)){Console.Write("{\"conflict\":true}");return 2;}
   foreach(var k in Public)if(p.ContainsKey(k)){var value=Text(p,k).Trim();if(value.Length>300)throw new Exception("Ayar çok uzun.");typeof(StoreSettings).GetField(k).SetValue(settings,value);}
   foreach(var k in Secrets){var value=Text(p,k).Trim();if(value.Length>2000)throw new Exception("Anahtar çok uzun.");if(value.Length>0)typeof(StoreSettings).GetField(k).SetValue(settings,value);if(p.ContainsKey("clear"+k)&&(p["clear"+k] is bool)&&(bool)p["clear"+k])typeof(StoreSettings).GetField(k).SetValue(settings,"");}
   object web;if(p.TryGetValue("websites",out web)){
    var rows=JsonMap.Arr(web);if(rows.Count>5)throw new Exception("En fazla beş site olabilir.");var websites=new List<object>();var hosts=new HashSet<string>(StringComparer.OrdinalIgnoreCase);
    foreach(var row in rows){var values=JsonMap.Arr(row);if(values.Count!=2)throw new Exception("Site kaydı geçersiz.");string name=JsonMap.Text(values[0]).Trim(),address=JsonMap.Text(values[1]).Trim();if(name==""&&address=="")continue;if(!address.Contains("://"))address="https://"+address;Uri u;
     if(name.Length<1||name.Length>100||address.Length>500||!Uri.TryCreate(address,UriKind.Absolute,out u)||(u.Scheme!="https"&&u.Scheme!="http")||u.UserInfo!=""||u.Query!=""||u.Fragment!=""||!u.Host.Contains(".")||!hosts.Add(u.Host))throw new Exception("Site adı veya adresi geçersiz.");websites.Add(new[]{name,u.AbsoluteUri.TrimEnd('/')});}
    Backup(sitePath);File.WriteAllText(sitePath+".pending",JsonMap.Write(websites),new UTF8Encoding(false));if(File.Exists(sitePath))File.Replace(sitePath+".pending",sitePath,null);else File.Move(sitePath+".pending",sitePath);
   }
   Backup(Path.Combine(folder,"ayar.json"));store.SaveSettings(settings);
  }
  var output=new Dictionary<string,object>();foreach(var k in Public)output[k]=typeof(StoreSettings).GetField(k).GetValue(settings);
  foreach(var k in Secrets)output[k+"Saved"]=!string.IsNullOrWhiteSpace((string)typeof(StoreSettings).GetField(k).GetValue(settings));
  output["websites"]=File.Exists(sitePath)?JsonMap.Parse(File.ReadAllText(sitePath)):new List<object>();output["revision"]=Revision(folder);Console.Write(JsonMap.Write(output));return 0;
 }catch(Exception e){Console.Error.Write(e.Message);return 1;}}
}
}
