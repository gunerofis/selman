using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading;
using System.Windows;

namespace Siparisler {
 internal static class Program {
  [STAThread]
  static void Main(string[] args) {
   if(args.Length>1&&args[0]=="--self-test") Environment.Exit(Tests.Run(args[1]));
   if(args.Length>0&&args[0]=="--sync") Environment.Exit(SyncNow());
   bool created;
   using(var mutex=new Mutex(true,@"Local\Siparisler.Single",out created)) {
    if(!created){MessageBox.Show("Siparişler zaten açık.");return;}
    var app=new Application();
    app.ShutdownMode=ShutdownMode.OnMainWindowClose;
    string folder=Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),"Siparisler");
    app.Run(new Shell(new Desk(new Store(folder))));
   }
  }
  static int SyncNow() {
   string folder=Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),"Siparisler");
   var store=new Store(folder);
   var settings=store.LoadSettings();
   var saved=store.LoadOrders();
   List<OrderRow> orders;
   string note;
   bool warn;
   bool ran=Syncer.Run(settings,saved.Orders,out orders,out note,out warn);
   if(ran) {
    saved.Orders=orders;
    saved.LastSyncUtc=DateTime.UtcNow.ToString("o");
    saved.Note=note??"";
    store.SaveOrders(saved);
   }
   File.WriteAllText(Path.Combine(Path.GetTempPath(),"siparisler-sync.txt"),((ran?"OK":"YOK")+(warn?" UYARI ":" ")+(note??"")),new UTF8Encoding(false));
   return ran&&!warn?0:1;
  }
 }
}
