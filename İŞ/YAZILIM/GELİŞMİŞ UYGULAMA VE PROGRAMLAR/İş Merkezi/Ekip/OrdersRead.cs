using System;
using System.IO;
using System.Collections.Generic;
namespace Siparisler {
class OrdersRead {
static int Main(){try{
 var store=new Store(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),"Siparisler"));
 var saved=store.LoadOrders(); List<OrderRow> rows;string note;bool warn;
 if(!Syncer.Run(store.LoadSettings(),saved.Orders,out rows,out note,out warn,store.Folder))return 1;

 Console.Write(warn?"partial":"ok");return 0;
}catch{return 1;}}
}}
