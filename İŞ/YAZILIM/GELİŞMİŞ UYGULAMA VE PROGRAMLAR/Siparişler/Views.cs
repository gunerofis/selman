using System;
using System.Collections.Generic;
using System.Threading;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Threading;

namespace Siparisler {
 internal sealed class Shell:Window {
  static readonly SolidColorBrush CanvasBrush=Make(244,246,244);
  static readonly SolidColorBrush White=Make(255,255,255);
  static readonly SolidColorBrush Ink=Make(35,57,50);
  static readonly SolidColorBrush Muted=Make(100,118,107);
  static readonly SolidColorBrush Dim=Make(82,96,113);
  static readonly SolidColorBrush Line=Make(220,228,223);
  static readonly SolidColorBrush Blue=Make(35,99,79);
  static readonly SolidColorBrush BlueHover=Make(23,75,59);
  static readonly SolidColorBrush Danger=Make(159,45,45);
  static readonly FontFamily Face=new FontFamily("Segoe UI");
  readonly Desk desk;
  readonly Grid mainView;
  readonly Grid settingsView;
  readonly TextBlock dateText;
  readonly TextBlock countText;
  readonly TextBlock amountText;
  readonly TextBlock caption;
  readonly TextBlock noteText;
  readonly StackPanel filters;
  readonly List<Button> sourceButtons=new List<Button>();
  TextBox orderSearch;
  TextBlock syncSummary;
  readonly Grid columns;
  readonly StackPanel rows;
  readonly StackPanel empty;
  readonly TextBlock emptyTitle;
  readonly TextBlock emptyBody;
  readonly Button emptyAction;
  readonly Button backButton;
  readonly Button forwardButton;
  readonly Button todayButton;
  readonly Button getirButton;
  readonly Button ayarlarButton;
  readonly TextBlock settingsNote;
  readonly TextBox trendyolId;
  readonly PasswordBox trendyolKey;
  readonly PasswordBox trendyolSecret;
  readonly TextBlock trendyolSaved;
  readonly Button trendyolRemove;
  readonly TextBox hbId;
  readonly TextBox hbUser;
  readonly PasswordBox hbSecret;
  readonly TextBlock hbSaved;
  readonly Button hbRemove;
  readonly PasswordBox n11Key;
  readonly PasswordBox n11Secret;
  readonly TextBlock n11Saved;
  readonly Button n11Remove;
  readonly TextBox csId;
  readonly TextBox csIntegrator;
  readonly PasswordBox csKey;
  readonly TextBlock csSaved;
  readonly Button csRemove;
  ScrollViewer settingsScroll;
  internal Shell(Desk desk) {
   this.desk=desk;
   Title="Siparişler";
   Width=1120;Height=760;MinWidth=920;MinHeight=640;
   WindowStartupLocation=WindowStartupLocation.CenterScreen;
   Background=CanvasBrush;
   FontFamily=Face;
   Foreground=Ink;
   UseLayoutRounding=true;
   SnapsToDevicePixels=true;
   TextOptions.SetTextFormattingMode(this,TextFormattingMode.Display);
   RenderOptions.SetClearTypeHint(this,ClearTypeHint.Enabled);
   var root=new Grid();
   Content=root;
   mainView=BuildMain(out dateText,out countText,out amountText,out caption,out noteText,out filters,out columns,out rows,out empty,out emptyTitle,out emptyBody,out emptyAction,out backButton,out forwardButton,out todayButton,out getirButton,out ayarlarButton);
   settingsView=BuildSettings(out settingsNote,out trendyolId,out trendyolKey,out trendyolSecret,out trendyolSaved,out trendyolRemove,out hbId,out hbUser,out hbSecret,out hbSaved,out hbRemove,out n11Key,out n11Secret,out n11Saved,out n11Remove,out csId,out csIntegrator,out csKey,out csSaved,out csRemove);
   settingsView.Visibility=Visibility.Collapsed;
   root.Children.Add(mainView);
   root.Children.Add(settingsView);
   PreviewKeyDown+=OnKey;
   RenderMain();
  }
  Grid BuildMain(out TextBlock date,out TextBlock count,out TextBlock amount,out TextBlock cap,out TextBlock note,out StackPanel filterRow,out Grid header,out StackPanel list,out StackPanel blank,out TextBlock blankTitle,out TextBlock blankBody,out Button blankAction,out Button back,out Button forward,out Button today,out Button getir,out Button ayarlar) {
   var view=Page();
   var top=new Grid();
   top.ColumnDefinitions.Add(new ColumnDefinition{Width=GridLength.Auto});
   top.ColumnDefinitions.Add(new ColumnDefinition());
   top.ColumnDefinitions.Add(new ColumnDefinition{Width=GridLength.Auto});
   var title=Label("Siparişler",28,FontWeights.SemiBold,Ink);
   top.Children.Add(title);
   var actions=new StackPanel{Orientation=Orientation.Horizontal,VerticalAlignment=VerticalAlignment.Center};
   ayarlar=Quiet("Pazaryeri ayarları",OpenSettings);
   var websitesButton=Quiet("Web siteleri",OpenWebSites);websitesButton.Margin=new Thickness(0,0,20,0);actions.Children.Add(websitesButton);
   ayarlar.Margin=new Thickness(0,0,18,0);
   getir=Fill("Yenile",StartSync);
   
   actions.Children.Add(ayarlar);
   actions.Children.Add(getir);
   Grid.SetColumn(actions,2);
   top.Children.Add(actions);
   var dateRow=new StackPanel{Orientation=Orientation.Horizontal,Margin=new Thickness(14,0,14,0),VerticalAlignment=VerticalAlignment.Center};
   back=Quiet("‹",delegate{desk.Shift(-1);RenderMain();});
   back.FontSize=22;back.Width=40;back.Height=40;back.ToolTip="Önceki gün";System.Windows.Automation.AutomationProperties.SetName(back,"Önceki gün");
   date=Label("",16,FontWeights.SemiBold,Ink);
   date.Margin=new Thickness(8,0,8,0);date.VerticalAlignment=VerticalAlignment.Center;
   forward=Quiet("›",delegate{desk.Shift(1);RenderMain();});
   forward.FontSize=22;forward.Width=40;forward.Height=40;forward.ToolTip="Sonraki gün";System.Windows.Automation.AutomationProperties.SetName(forward,"Sonraki gün");
   today=Quiet("Bugün",delegate{desk.GoToday();RenderMain();});
   today.Margin=new Thickness(16,0,0,0);
   dateRow.Children.Add(back);dateRow.Children.Add(date);dateRow.Children.Add(forward);dateRow.Children.Add(today);
   count=Label("0",26,FontWeights.SemiBold,Ink);
   amount=Label("0 TL",26,FontWeights.SemiBold,Ink);
   var numbers=new StackPanel{Orientation=Orientation.Horizontal,Margin=new Thickness(0,18,0,0)};
   numbers.Children.Add(Metric(count,"satışa dahil sipariş"));
   var money=Metric(amount,"satış tutarı");
   money.Margin=new Thickness(72,0,0,0);
   numbers.Children.Add(money);
   cap=Label("",13,FontWeights.Normal,Muted);
   cap.Visibility=Visibility.Collapsed;
   cap.Margin=new Thickness(0,12,0,0);
   filterRow=new StackPanel{Margin=new Thickness(0,12,0,0)};
   AddBrandRow(filterRow,"Güner Ofis");
   AddBrandRow(filterRow,"Makro Ofis");
   orderSearch=Box();orderSearch.Width=280;
   var searchGroup=new StackPanel();var searchLabel=Label("Ürün veya sipariş no ara",12,FontWeights.Normal,Muted);searchLabel.Margin=new Thickness(0,0,0,5);searchGroup.Children.Add(searchLabel);searchGroup.Children.Add(Wrap(orderSearch));
   System.Windows.Automation.AutomationProperties.SetName(orderSearch,"Ürün veya sipariş numarası ara");
   orderSearch.TextChanged+=delegate{if(rows!=null)RenderMain();};
   searchGroup.Margin=new Thickness(40,0,0,0);searchGroup.VerticalAlignment=VerticalAlignment.Center;numbers.Children.Add(searchGroup);
   var card=new Border{Background=White,BorderBrush=Line,BorderThickness=new Thickness(1),CornerRadius=new CornerRadius(10),Margin=new Thickness(0,16,0,0),Padding=new Thickness(18,16,18,8)};
   var cardGrid=new Grid();
   cardGrid.RowDefinitions.Add(new RowDefinition{Height=GridLength.Auto});
   cardGrid.RowDefinitions.Add(new RowDefinition());
   header=Columns();
   header.Margin=new Thickness(0,0,0,6);
   Head(header,"Kaynak",0,false);
   Head(header,"Ürün",1,false);
   Head(header,"Şehir",2,false);
   Head(header,"Tutar",3,true);
   Head(header,"Saat",4,true);
   Grid.SetRow(header,0);
   var scroll=new ScrollViewer{VerticalScrollBarVisibility=ScrollBarVisibility.Auto,HorizontalScrollBarVisibility=ScrollBarVisibility.Disabled};
   list=new StackPanel();
   scroll.Content=list;
   Grid.SetRow(scroll,1);
   blank=new StackPanel{VerticalAlignment=VerticalAlignment.Center,HorizontalAlignment=HorizontalAlignment.Center,Margin=new Thickness(0,48,0,48)};
   blankTitle=Label("",22,FontWeights.SemiBold,Ink);
   blankTitle.HorizontalAlignment=HorizontalAlignment.Center;
   blankBody=Label("",14,FontWeights.Normal,Muted);
   blankBody.HorizontalAlignment=HorizontalAlignment.Center;
   blankBody.TextAlignment=TextAlignment.Center;
   blankBody.Margin=new Thickness(0,8,0,0);
   blankBody.MaxWidth=420;
   blankBody.TextWrapping=TextWrapping.Wrap;
   blankAction=Fill("Ayarları aç",OpenSettings);
   blankAction.Margin=new Thickness(0,18,0,0);
   blankAction.HorizontalAlignment=HorizontalAlignment.Center;
   blank.Children.Add(blankTitle);blank.Children.Add(blankBody);blank.Children.Add(blankAction);
   Grid.SetRow(blank,1);
   cardGrid.Children.Add(header);cardGrid.Children.Add(scroll);cardGrid.Children.Add(blank);
   card.Child=cardGrid;
   note=Label("",13,FontWeights.Normal,Muted);
   note.Margin=new Thickness(0,4,0,0);
   note.TextWrapping=TextWrapping.Wrap;
   view.RowDefinitions.Add(new RowDefinition{Height=GridLength.Auto});
   view.RowDefinitions.Add(new RowDefinition{Height=GridLength.Auto});
   view.RowDefinitions.Add(new RowDefinition{Height=GridLength.Auto});
   view.RowDefinitions.Add(new RowDefinition{Height=GridLength.Auto});
   view.RowDefinitions.Add(new RowDefinition());
   view.RowDefinitions.Add(new RowDefinition{Height=GridLength.Auto});
   var head=new StackPanel();
   Grid.SetColumn(dateRow,1);dateRow.HorizontalAlignment=HorizontalAlignment.Center;top.Children.Add(dateRow);head.Children.Add(top);
   view.Children.Add(head);
   Grid.SetRow(numbers,1);view.Children.Add(numbers);
   Grid.SetRow(cap,2);view.Children.Add(cap);
   Grid.SetRow(filterRow,3);view.Children.Add(filterRow);
   Grid.SetRow(card,4);view.Children.Add(card);
   syncSummary=Label("",12,FontWeights.Normal,Muted);
   var details=new StackPanel{Margin=new Thickness(0,8,0,0)};details.Children.Add(syncSummary);details.Children.Add(note);
   Grid.SetRow(details,5);view.Children.Add(details);
   return view;
  }
  Grid BuildSettings(out TextBlock warning,out TextBox tyId,out PasswordBox tyKey,out PasswordBox tySecret,out TextBlock tySaved,out Button tyRemove,out TextBox merchant,out TextBox user,out PasswordBox hbPassword,out TextBlock savedHb,out Button removeHb,out PasswordBox keyN11,out PasswordBox secretN11,out TextBlock savedN11,out Button removeN11,out TextBox seller,out TextBox integrator,out PasswordBox keyCs,out TextBlock savedCs,out Button removeCs) {
   var view=Page();
   var top=new Grid();
   top.ColumnDefinitions.Add(new ColumnDefinition());
   top.ColumnDefinitions.Add(new ColumnDefinition{Width=GridLength.Auto});
   top.Children.Add(Label("Ayarlar",28,FontWeights.SemiBold,Ink));
   var actions=new StackPanel{Orientation=Orientation.Horizontal,VerticalAlignment=VerticalAlignment.Center};
   var kaydet=Fill("Kaydet",SaveSettings);
   kaydet.Margin=new Thickness(0,0,18,0);
   var geri=Quiet("Geri",OpenMain);
   actions.Children.Add(kaydet);
   actions.Children.Add(geri);
   Grid.SetColumn(actions,1);
   top.Children.Add(actions);
   var introWrap=new StackPanel{Margin=new Thickness(0,12,0,0)};
   introWrap.Children.Add(Label("Satıcı panelindeki API bilgisi. Siteye giriş şifresi değil.",14,FontWeights.Normal,Muted));
   warning=Label("",13,FontWeights.Normal,Danger);
   warning.Margin=new Thickness(0,6,0,0);
   warning.Visibility=Visibility.Collapsed;
   warning.TextWrapping=TextWrapping.Wrap;
   introWrap.Children.Add(warning);
   tyId=Box();tyKey=Pass();tySecret=Pass();
   merchant=Box();user=Box();hbPassword=Pass();
   seller=Box();integrator=Box();keyCs=Pass();
   var form=new StackPanel{Margin=new Thickness(0,10,16,4)};
   form.Children.Add(Trio("Trendyol","Entegrasyon sayfasındaki satıcı no, API key ve API secret.",Sources.Trendyol,"Satıcı no",tyId,"API anahtarı",tyKey,"API şifresi",tySecret,out tySaved,out tyRemove));
   form.Children.Add(Trio("Hepsiburada","Mağaza numarası ve servis şifresi. Kullanıcı adı boşsa mağaza numarası kullanılır.",Sources.Hepsiburada,"Mağaza no",merchant,"Kullanıcı adı",user,"Servis şifresi",hbPassword,out savedHb,out removeHb));
   form.Children.Add(SecretPair("n11","API hesaplarındaki appkey ve appsecret.",out keyN11,out secretN11,out savedN11,out removeN11));
   form.Children.Add(Trio("Çiçeksepeti","Entegrasyon Bilgilerim ekranındaki satıcı no, entegratör adı ve API anahtarı.",Sources.Ciceksepeti,"Satıcı no",seller,"Entegratör adı",integrator,"API anahtarı",keyCs,out savedCs,out removeCs));
   var scroll=new ScrollViewer{VerticalScrollBarVisibility=ScrollBarVisibility.Auto,HorizontalScrollBarVisibility=ScrollBarVisibility.Disabled};
   scroll.Content=form;
   settingsScroll=scroll;
   view.RowDefinitions.Add(new RowDefinition{Height=GridLength.Auto});
   view.RowDefinitions.Add(new RowDefinition{Height=GridLength.Auto});
   view.RowDefinitions.Add(new RowDefinition());
   view.Children.Add(top);
   Grid.SetRow(introWrap,1);view.Children.Add(introWrap);
   Grid.SetRow(scroll,2);view.Children.Add(scroll);
   return view;
  }

  void OpenWebSites() {
   if(desk.Busy)return;
   string path=System.IO.Path.Combine(desk.Store.Folder,"web-siteleri.json");
   string original;
   var json=new System.Web.Script.Serialization.JavaScriptSerializer();
   List<string[]> saved;
   try {
    original=System.IO.File.Exists(path)?System.IO.File.ReadAllText(path):"";
    saved=original.Length==0?new List<string[]>():json.Deserialize<List<string[]>>(original);
    if(saved==null||saved.Count>5)throw new Exception();
    foreach(var row in saved)if(row==null||row.Length!=2)throw new Exception();
   } catch {MessageBox.Show("Site kayıtları okunamadı. Mevcut dosya korunuyor.","Web Siteleri");return;}
   var window=new Window{Title="Siparişler · Web Siteleri",Width=760,Height=610,MinWidth=640,MinHeight=480,Background=CanvasBrush,FontFamily=Face,Foreground=Ink,WindowStartupLocation=WindowStartupLocation.CenterOwner};
   window.Owner=Window.GetWindow(mainView);
   var panel=new DockPanel{Margin=new Thickness(24)};window.Content=panel;
   var head=new StackPanel();
   head.Children.Add(Label("Web Siteleri",26,FontWeights.SemiBold,Ink));
   head.Children.Add(Label("Siparişleri ana ekrandaki Yenile düğmesiyle yenileyin.",14,FontWeights.Normal,Muted));
   head.Margin=new Thickness(0,0,0,20);DockPanel.SetDock(head,Dock.Top);panel.Children.Add(head);
   var foot=new StackPanel();var status=Label("",13,FontWeights.Normal,Danger);status.TextWrapping=TextWrapping.Wrap;
   foot.Children.Add(status);var buttons=new StackPanel{Orientation=Orientation.Horizontal,HorizontalAlignment=HorizontalAlignment.Right,Margin=new Thickness(0,12,0,0)};
   foot.Children.Add(buttons);DockPanel.SetDock(foot,Dock.Bottom);panel.Children.Add(foot);
   var form=new StackPanel();panel.Children.Add(new ScrollViewer{Content=form,VerticalScrollBarVisibility=ScrollBarVisibility.Auto});
   var names=new List<TextBox>();var urls=new List<TextBox>();bool dirty=false;
   for(int i=0;i<5;i++) {
    var group=new StackPanel{Margin=new Thickness(0,0,10,16)};
    group.Children.Add(Label("Site "+(i+1),15,FontWeights.SemiBold,Ink));
    var grid=new Grid();grid.ColumnDefinitions.Add(new ColumnDefinition{Width=new GridLength(2,GridUnitType.Star)});grid.ColumnDefinitions.Add(new ColumnDefinition{Width=new GridLength(3,GridUnitType.Star)});
    var left=new StackPanel{Margin=new Thickness(0,6,12,0)};left.Children.Add(Label("Site adı",12,FontWeights.Normal,Muted));
    var name=Box();name.MaxLength=100;left.Children.Add(name);grid.Children.Add(left);
    var right=new StackPanel{Margin=new Thickness(0,6,0,0)};right.Children.Add(Label("Web adresi",12,FontWeights.Normal,Muted));
    var url=Box();url.MaxLength=500;right.Children.Add(url);Grid.SetColumn(right,1);grid.Children.Add(right);
    if(i<saved.Count){name.Text=saved[i][0];url.Text=saved[i][1];}
    names.Add(name);urls.Add(url);
    name.TextChanged+=delegate{dirty=true;};url.TextChanged+=delegate{dirty=true;};
    group.Children.Add(grid);
    var state=Label(i<saved.Count?Websites.Status(desk.Store.Folder,saved[i][1]):"",12,FontWeights.Normal,Muted);group.Children.Add(state);form.Children.Add(group);
   }
   buttons.Children.Add(Quiet("Kapat",delegate{window.Close();}));
   var save=Fill("Kaydet",delegate {
    var values=new List<string[]>();var hosts=new HashSet<string>(StringComparer.OrdinalIgnoreCase);
    for(int i=0;i<5;i++) {
     string name=names[i].Text.Trim(),url=urls[i].Text.Trim();
     if(name.Length==0&&url.Length==0)continue;
     Uri uri;
     if(!url.Contains("://"))url="https://"+url;
     if(name.Length==0||!Uri.TryCreate(url,UriKind.Absolute,out uri)||(uri.Scheme!="https"&&uri.Scheme!="http")||!uri.Host.Contains(".")||uri.UserInfo.Length>0||uri.Query.Length>0||uri.Fragment.Length>0) {status.Text="Site "+(i+1)+": site adı ve geçerli web adresi gerekli.";return;}
     if(!hosts.Add(uri.Host.TrimStart('.').Replace("www.",""))) {status.Text="Aynı siteyi birden fazla eklemeyin.";return;}
     values.Add(new[]{name,uri.GetLeftPart(UriPartial.Path).TrimEnd('/')});
    }
    try {
     string current=System.IO.File.Exists(path)?System.IO.File.ReadAllText(path):"";
     if(current!=original){status.Text="Kayıt başka yerde değişti. Kapatıp yeniden açın.";return;}
     string temp=path+"."+Guid.NewGuid().ToString("N")+".tmp";
     System.IO.File.WriteAllText(temp,json.Serialize(values),System.Text.Encoding.UTF8);
     if(System.IO.File.Exists(path))System.IO.File.Replace(temp,path,path+"."+DateTime.UtcNow.ToString("yyyyMMddHHmmssfff")+".bak");
     else System.IO.File.Move(temp,path);
     dirty=false;window.Close();
    }catch{status.Text="Kaydedilemedi. Girdiğiniz bilgiler bu pencerede korunuyor.";}
   });save.Margin=new Thickness(18,0,0,0);buttons.Children.Add(save);
   window.Closing+=delegate(object sender,System.ComponentModel.CancelEventArgs e){if(dirty&&MessageBox.Show(window,"Kaydedilmemiş değişiklikler bırakılsın mı?","Web Siteleri",MessageBoxButton.YesNo,MessageBoxImage.Question)!=MessageBoxResult.Yes)e.Cancel=true;};
   window.ShowDialog();
  }

  void AddBrandRow(Panel parent,string brand){
   var brandButton=new Button{Content=brand,Height=28,Padding=new Thickness(12,2,12,2),HorizontalAlignment=HorizontalAlignment.Left,FontFamily=Face,Cursor=Cursors.Hand};
   brandButton.Click+=delegate{if(desk.Busy)return;desk.Brand=brand;desk.Filter="Tümü";RenderMain();};
   brandButton.Tag=brand+"|Tümü";brandButton.FontSize=15;brandButton.FontWeight=FontWeights.SemiBold;brandButton.Margin=new Thickness(0,0,0,5);
   sourceButtons.Add(brandButton);parent.Children.Add(brandButton);
   var grid=new Grid{Margin=new Thickness(0,0,0,10)};
   string[] titles={"WEB SİTESİ","TRENDYOL","HEPSİBURADA","AMAZON","N11","ÇİÇEKSEPETİ"};
   string[] sources={"WEB SİTESİ",Sources.Trendyol,Sources.Hepsiburada,"Amazon",Sources.N11,Sources.Ciceksepeti};
   string[] icons={"web","trendyol","hepsiburada","amazon","n11","ciceksepeti"};
   for(int i=0;i<6;i++){
    grid.ColumnDefinitions.Add(new ColumnDefinition());
    string channel=sources[i];
    var content=new StackPanel{Orientation=Orientation.Vertical,HorizontalAlignment=HorizontalAlignment.Center};
    content.Children.Add(ChannelLogo(icons[i]));
    var label=Label(titles[i],11,FontWeights.SemiBold,Ink);label.Margin=new Thickness(0,5,0,0);label.HorizontalAlignment=HorizontalAlignment.Center;content.Children.Add(label);
    var button=new Button{Content=content,Tag=brand+"|"+channel,Height=58,Margin=new Thickness(0,0,i==5?0:8,0),Background=White,BorderBrush=Line,BorderThickness=new Thickness(1),Cursor=Cursors.Hand};
    System.Windows.Automation.AutomationProperties.SetName(button,brand+" · "+titles[i]);
    button.Click+=delegate{if(desk.Busy)return;desk.Brand=brand;desk.Filter=channel;RenderMain();};
    sourceButtons.Add(button);Grid.SetColumn(button,i);grid.Children.Add(button);
   }
   parent.Children.Add(grid);
  }
  UIElement ChannelLogo(string key){
   if(key=="web"){
    var globe=new Canvas{Width=26,Height=26};
    globe.Children.Add(new System.Windows.Shapes.Ellipse{Width=24,Height=24,Stroke=Blue,StrokeThickness=1.5,Margin=new Thickness(1)});
    globe.Children.Add(new System.Windows.Shapes.Ellipse{Width=10,Height=24,Stroke=Blue,StrokeThickness=1.2,Margin=new Thickness(8,1,0,0)});
    globe.Children.Add(new System.Windows.Shapes.Line{X1=2,Y1=13,X2=24,Y2=13,Stroke=Blue,StrokeThickness=1.2});return globe;
   }
   string root=System.IO.Path.Combine(AppDomain.CurrentDomain.BaseDirectory,"Logolar");
   foreach(string ext in new[]{".png",".ico"}){
    string path=System.IO.Path.Combine(root,key+ext);
    if(System.IO.File.Exists(path))try{return new Image{Source=new BitmapImage(new Uri(path)),Width=key=="n11"?44:26,Height=26,Stretch=Stretch.Uniform};}catch{}
   }
   var fallback=Label(key,24,FontWeights.SemiBold,Blue);fallback.Height=26;fallback.HorizontalAlignment=HorizontalAlignment.Center;return fallback;
  }
  internal void RenderMain() {
   dateText.Text=OrderText.DayTitle(desk.Selected);
   bool today=desk.Selected.Date==Clock.Today();
   todayButton.Visibility=today?Visibility.Collapsed:Visibility.Visible;
   backButton.IsEnabled=!desk.Busy&&desk.CanBack();
   forwardButton.IsEnabled=!desk.Busy&&desk.CanForward();
   ayarlarButton.IsEnabled=!desk.Busy;
   getirButton.IsEnabled=!desk.Busy;
   getirButton.Content=desk.Busy?"Yenileniyor…":"Yenile";
   foreach(var sourceButton in sourceButtons){
    bool selected=(string)sourceButton.Tag==desk.Brand+"|"+desk.Filter;
    sourceButton.IsEnabled=!desk.Busy;sourceButton.Background=selected?Make(220,238,228):White;sourceButton.BorderBrush=selected?Blue:Line;sourceButton.BorderThickness=new Thickness(selected?2:1);sourceButton.Foreground=Ink;sourceButton.FontWeight=selected?FontWeights.SemiBold:FontWeights.Normal;
    System.Windows.Automation.AutomationProperties.SetItemStatus(sourceButton,selected?"Seçili":"");
   }
   var visible=desk.Visible();
   string term=orderSearch.Text.Trim();
   if(term.Length>0)visible=visible.FindAll(delegate(OrderRow row){return ((row.Product??"")+" "+(row.OrderNumber??"")).IndexOf(term,StringComparison.CurrentCultureIgnoreCase)>=0;});
   int count;decimal amount;
   desk.Summary(visible,out count,out amount);
   countText.Text=count.ToString();
   amountText.Text=Money.Format(amount);
   noteText.Text=desk.Note??"";
   noteText.Foreground=desk.NoteWarn?Danger:Muted;
   DateTimeOffset updated;
   string last=DateTimeOffset.TryParse(desk.LastSyncUtc,out updated)?updated.ToOffset(TimeSpan.FromHours(3)).ToString("dd.MM HH:mm"):"";
   syncSummary.Text=desk.Busy?"Siparişler yenileniyor…":desk.NoteWarn?"Bazı kaynaklar yenilenemedi":last.Length>0?"Son yenileme "+last+"":"Bağlantı durumu";
   syncSummary.Foreground=desk.NoteWarn?Danger:Muted;
   rows.Children.Clear();
   bool showRows=visible.Count>0;
   columns.Visibility=showRows?Visibility.Visible:Visibility.Collapsed;
   empty.Visibility=showRows?Visibility.Collapsed:Visibility.Visible;
   if(!showRows){FillEmpty();if(term.Length>0){emptyTitle.Text="Eşleşen sipariş yok";emptyBody.Text="Aramayı değiştirin veya temizleyin.";emptyAction.Visibility=Visibility.Collapsed;}}
   for(int i=0;i<visible.Count;i++) rows.Children.Add(Row(visible[i],i==visible.Count-1));
  }
  void FillEmpty() {
   if(!desk.ChannelReady()){
    emptyTitle.Text="Bağlantı kurulmadı";emptyBody.Text=desk.Brand+" · "+desk.Filter;emptyAction.Visibility=Visibility.Collapsed;return;
   }
   if(Array.IndexOf(Websites.Domains,desk.Filter)>=0) {
    string state=Websites.Status(desk.Store.Folder,"https://"+desk.Filter);
    if(!state.StartsWith("Bağlı ·",StringComparison.Ordinal)) {
     emptyTitle.Text="Bağlantı tamamlanmadı";emptyBody.Text=state;emptyAction.Visibility=Visibility.Collapsed;return;
    }
   }
   bool configured=desk.Settings.AnyReady()||Websites.Any(desk.Store.Folder);
   bool fresh=string.IsNullOrEmpty(desk.LastSyncUtc)&&desk.Orders.Count==0;
   if(!configured) {
    emptyTitle.Text="Pazaryeri bağlayın";
    emptyBody.Text="Satıcı panelindeki API bilgisi yazılır. Site şifresi istenmez.";
    emptyAction.Visibility=Visibility.Visible;
   } else if(fresh) {
    emptyTitle.Text="Son 7 gün hazır";
    emptyBody.Text="Yenile ile siparişleri getirin.";
    emptyAction.Visibility=Visibility.Collapsed;
   } else if(desk.Filter!="Tümü") {
    emptyTitle.Text="Bu kaynakta sipariş yok";
    emptyBody.Text=OrderText.DayTitle(desk.Selected);
    emptyAction.Visibility=Visibility.Collapsed;
   } else {
    emptyTitle.Text="Bu günde sipariş yok";
    emptyBody.Text="";
    emptyAction.Visibility=Visibility.Collapsed;
   }
  }
  Grid Row(OrderRow row,bool last) {
   var grid=Columns();
   grid.MinHeight=68;
   var paint=row.CountsAsSale?Ink:Dim;
   var source=new StackPanel{Orientation=Orientation.Horizontal,VerticalAlignment=VerticalAlignment.Center};
   var dot=new System.Windows.Shapes.Ellipse{Width=8,Height=8,Fill=SourceColor(row.Source),VerticalAlignment=VerticalAlignment.Center,Margin=new Thickness(0,0,8,0)};
   var sourceText=Label(row.Source,13,FontWeights.Normal,Muted);sourceText.TextTrimming=TextTrimming.CharacterEllipsis;sourceText.ToolTip=row.Source;
   sourceText.VerticalAlignment=VerticalAlignment.Center;
   source.Children.Add(sourceText);
   var product=new StackPanel{VerticalAlignment=VerticalAlignment.Center};
   var name=Label(row.Product,15,FontWeights.Normal,paint);
   name.TextTrimming=TextTrimming.CharacterEllipsis;name.ToolTip=row.Product;
   product.Children.Add(name);
   string meta=row.OrderNumber??"";
   if(!string.IsNullOrEmpty(row.Status)) meta=meta.Length==0?row.Status:meta+" · "+row.Status;
   if(meta.Length>0) {
    var sub=Label(meta,12,FontWeights.Normal,Muted);
    sub.Margin=new Thickness(0,3,0,0);
    sub.TextTrimming=TextTrimming.CharacterEllipsis;
    product.Children.Add(sub);
   }
   var city=Label(string.IsNullOrWhiteSpace(row.City)?"—":row.City,14,FontWeights.Normal,paint);
   city.VerticalAlignment=VerticalAlignment.Center;
   city.TextTrimming=TextTrimming.CharacterEllipsis;
   var money=Label(Money.Format(row.Amount),14,FontWeights.SemiBold,paint);
   money.VerticalAlignment=VerticalAlignment.Center;
   money.HorizontalAlignment=HorizontalAlignment.Right;
   var time=Label(row.WhenTurkey.ToString("HH:mm"),14,FontWeights.Normal,Muted);
   time.VerticalAlignment=VerticalAlignment.Center;
   time.HorizontalAlignment=HorizontalAlignment.Right;
   grid.Children.Add(source);
   Grid.SetColumn(product,1);grid.Children.Add(product);
   Grid.SetColumn(city,2);grid.Children.Add(city);
   Grid.SetColumn(money,3);grid.Children.Add(money);
   Grid.SetColumn(time,4);grid.Children.Add(time);
   if(!last) grid.Children.Add(Rule());
   return grid;
  }
  static Border Rule() {
   var line=new Border{Height=1,Background=Line,VerticalAlignment=VerticalAlignment.Bottom,Margin=new Thickness(0,0,0,0)};
   Grid.SetColumnSpan(line,5);
   return line;
  }
  internal void OpenSettings() {
   if(desk.Busy) return;
   FillSettings();
   SetSettingsNote("");
   mainView.Visibility=Visibility.Collapsed;
   settingsView.Visibility=Visibility.Visible;
  }
  void OpenMain() {
   settingsView.Visibility=Visibility.Collapsed;
   mainView.Visibility=Visibility.Visible;
   RenderMain();
  }
  void FillSettings() {
   var s=desk.Settings;
   trendyolId.Text=s.TrendyolSellerId??"";
   trendyolKey.Password="";
   trendyolSecret.Password="";
   hbId.Text=s.HbMerchantId??"";
   hbUser.Text=s.HbUser??"";
   hbSecret.Password="";
   n11Key.Password="";
   n11Secret.Password="";
   csId.Text=s.CsSellerId??"";
   csIntegrator.Text=string.IsNullOrWhiteSpace(s.CsIntegrator)?"SelfIntegration":s.CsIntegrator;
   csKey.Password="";
   ShowSaved(trendyolSaved,trendyolRemove,!string.IsNullOrEmpty(s.TrendyolApiSecret));
   ShowSaved(hbSaved,hbRemove,!string.IsNullOrEmpty(s.HbPassword));
   ShowSaved(n11Saved,n11Remove,!string.IsNullOrEmpty(s.N11Secret));
   ShowSaved(csSaved,csRemove,!string.IsNullOrEmpty(s.CsApiKey));
  }
  static void ShowSaved(TextBlock saved,Button remove,bool on) {
   saved.Visibility=on?Visibility.Visible:Visibility.Collapsed;
   remove.Visibility=on?Visibility.Visible:Visibility.Collapsed;
  }
  internal void SaveSettings() {
   var previous=desk.Settings;
   var next=new StoreSettings();
   next.TrendyolSellerId=trendyolId.Text.Trim();
   next.HbMerchantId=hbId.Text.Trim();
   next.HbUser=hbUser.Text.Trim();
   next.CsSellerId=csId.Text.Trim();
   next.CsIntegrator=csIntegrator.Text.Trim();
   if(next.CsIntegrator.Length==0) next.CsIntegrator="SelfIntegration";
   if(next.TrendyolSellerId.Length==0){next.TrendyolApiKey="";next.TrendyolApiSecret="";}
   else { next.TrendyolApiKey=Keep(trendyolKey.Password,previous.TrendyolApiKey); next.TrendyolApiSecret=Keep(trendyolSecret.Password,previous.TrendyolApiSecret); }
   if(next.HbMerchantId.Length==0){next.HbPassword="";next.HbUser="";}
   else next.HbPassword=Keep(hbSecret.Password,previous.HbPassword);
   bool n11Touched=n11Key.Password.Length>0||n11Secret.Password.Length>0;
   if(n11Touched){next.N11Key=n11Key.Password.Trim();next.N11Secret=n11Secret.Password.Trim();}
   else { next.N11Key=previous.N11Key; next.N11Secret=previous.N11Secret; }
   if(next.CsSellerId.Length==0) next.CsApiKey="";
   else next.CsApiKey=Keep(csKey.Password,previous.CsApiKey);
   if(next.TrendyolSellerId.Length>0&&(next.TrendyolApiKey.Length==0||next.TrendyolApiSecret.Length==0)){SetSettingsNote("Trendyol için API anahtarı ve şifre de gerekli.");return;}
   if(next.HbMerchantId.Length>0&&next.HbPassword.Length==0){SetSettingsNote("Hepsiburada için servis şifresi de gerekli.");return;}
   if((next.N11Key.Length>0)!=(next.N11Secret.Length>0)){SetSettingsNote("n11 için anahtar ve şifre birlikte yazılır.");return;}
   if(next.CsSellerId.Length>0&&next.CsApiKey.Length==0){SetSettingsNote("Çiçeksepeti için API anahtarı da gerekli.");return;}
   desk.Settings=next;
   desk.Store.SaveSettings(next);
   if(!next.TrendyolReady()) desk.DropSource(Sources.Trendyol);
   if(!next.HepsiburadaReady()) desk.DropSource(Sources.Hepsiburada);
   if(!next.N11Ready()) desk.DropSource(Sources.N11);
   if(!next.CiceksepetiReady()) desk.DropSource(Sources.Ciceksepeti);
   desk.Note=next.AnyReady()?"Kaydedildi.":"";
   desk.NoteWarn=false;
   desk.Remember();
   OpenMain();
  }
  void Remove(string source) {
   var next=desk.Settings;
   if(source==Sources.Trendyol){next.TrendyolSellerId="";next.TrendyolApiKey="";next.TrendyolApiSecret="";}
   if(source==Sources.Hepsiburada){next.HbMerchantId="";next.HbUser="";next.HbPassword="";}
   if(source==Sources.N11){next.N11Key="";next.N11Secret="";}
   if(source==Sources.Ciceksepeti){next.CsSellerId="";next.CsApiKey="";}
   desk.Store.SaveSettings(next);
   desk.DropSource(source);
   desk.Remember();
   FillSettings();
   SetSettingsNote("Bağlantı kaldırıldı.");
  }
  void SetSettingsNote(string text) {
   settingsNote.Text=text??"";
   settingsNote.Visibility=settingsNote.Text.Length==0?Visibility.Collapsed:Visibility.Visible;
  }
  internal void ClearTrendyolAndSave() {
   trendyolId.Text="";
   SaveSettings();
  }
  internal bool SettingsOnScreen() {
   UpdateLayout();
   settingsScroll.UpdateLayout();
   var field=csId.TranslatePoint(new Point(0,csId.ActualHeight),settingsScroll);
   var remove=trendyolRemove.TranslatePoint(new Point(trendyolRemove.ActualWidth,0),settingsScroll);
   return field.Y>0&&field.Y<=settingsScroll.ViewportHeight+1&&remove.X<=settingsScroll.ViewportWidth+1;
  }
  void StartSync() {
   if(desk.Busy) return;
   if(!desk.Settings.AnyReady()&&!Websites.Any(desk.Store.Folder)){desk.Note="Önce ayarlardan API bilgisini girin.";desk.NoteWarn=true;RenderMain();return;}
   desk.Busy=true;
   desk.NoteWarn=false;
   desk.Note="Siparişler getiriliyor.";
   RenderMain();
   var settings=desk.Settings;
   var existing=desk.Orders;
   ThreadPool.QueueUserWorkItem(delegate {
    List<OrderRow> orders;string note;bool warn;
    bool ran=Syncer.Run(settings,existing,out orders,out note,out warn,desk.Store.Folder);
    Dispatcher.BeginInvoke((Action)delegate {
     desk.Busy=false;
     desk.Note=note;
     desk.NoteWarn=warn;
     if(ran){desk.Orders=orders;desk.LastSyncUtc=desk.Store.LoadOrders().LastSyncUtc;}
     RenderMain();
    });
   });
  }
  void OnKey(object sender,KeyEventArgs e) {
   if(Keyboard.FocusedElement is TextBox||Keyboard.FocusedElement is PasswordBox) return;
   if(settingsView.Visibility==Visibility.Visible){if(e.Key==Key.Escape){OpenMain();e.Handled=true;}return;}
   if(e.Key==Key.Left){desk.Shift(-1);RenderMain();e.Handled=true;}
   if(e.Key==Key.Right){desk.Shift(1);RenderMain();e.Handled=true;}
  }
  static string Keep(string typed,string previous){return string.IsNullOrEmpty(typed)?(previous??""):typed.Trim();}
  Grid Page() {
   var grid=new Grid{Margin=new Thickness(36,28,36,24)};
   return grid;
  }
  StackPanel Metric(TextBlock value,string caption) {
   var stack=new StackPanel();
   stack.Children.Add(value);
   var label=Label(caption,13,FontWeights.Normal,Muted);
   label.Margin=new Thickness(0,2,0,0);
   stack.Children.Add(label);
   return stack;
  }
  static void Head(Grid grid,string text,int column,bool right) {
   var label=Label(text,12,FontWeights.Normal,Muted);
   label.HorizontalAlignment=right?HorizontalAlignment.Right:HorizontalAlignment.Left;
   label.Margin=new Thickness(column==0?16:0,0,0,4);
   Grid.SetColumn(label,column);
   grid.Children.Add(label);
  }
  static Grid Columns() {
   var grid=new Grid();
   grid.ColumnDefinitions.Add(new ColumnDefinition{Width=new GridLength(148)});
   grid.ColumnDefinitions.Add(new ColumnDefinition());
   grid.ColumnDefinitions.Add(new ColumnDefinition{Width=new GridLength(130)});
   grid.ColumnDefinitions.Add(new ColumnDefinition{Width=new GridLength(120)});
   grid.ColumnDefinitions.Add(new ColumnDefinition{Width=new GridLength(64)});
   return grid;
  }
  UIElement Trio(string title,string hint,string source,string firstLabel,Control first,string secondLabel,Control second,string thirdLabel,Control third,out TextBlock saved,out Button remove) {
   var stack=new StackPanel{Margin=new Thickness(0,0,0,12)};
   var head=new Grid();
   head.ColumnDefinitions.Add(new ColumnDefinition());
   head.ColumnDefinitions.Add(new ColumnDefinition{Width=GridLength.Auto});
   head.Children.Add(Label(title,18,FontWeights.SemiBold,Ink));
   remove=Quiet("Kaldır",delegate{Remove(source);});
   Grid.SetColumn(remove,1);
   head.Children.Add(remove);
   stack.Children.Add(head);
   var help=Label(hint,13,FontWeights.Normal,Muted);
   help.Margin=new Thickness(0,2,0,6);
   help.TextWrapping=TextWrapping.Wrap;
   stack.Children.Add(help);
   var fields=new Grid();
   fields.ColumnDefinitions.Add(new ColumnDefinition());
   fields.ColumnDefinitions.Add(new ColumnDefinition());
   fields.ColumnDefinitions.Add(new ColumnDefinition());
   fields.Children.Add(Field(firstLabel,first,0));
   fields.Children.Add(Field(secondLabel,second,1));
   fields.Children.Add(Field(thirdLabel,third,2));
   stack.Children.Add(fields);
   saved=Label("Kayıtlı",12,FontWeights.Normal,Muted);
   saved.Margin=new Thickness(0,4,0,0);
   stack.Children.Add(saved);
   return stack;
  }
  UIElement SecretPair(string title,string hint,out PasswordBox key,out PasswordBox secret,out TextBlock saved,out Button remove) {
   var stack=new StackPanel{Margin=new Thickness(0,0,0,12)};
   var head=new Grid();
   head.ColumnDefinitions.Add(new ColumnDefinition());
   head.ColumnDefinitions.Add(new ColumnDefinition{Width=GridLength.Auto});
   head.Children.Add(Label(title,18,FontWeights.SemiBold,Ink));
   remove=Quiet("Kaldır",delegate{Remove(Sources.N11);});
   Grid.SetColumn(remove,1);
   head.Children.Add(remove);
   stack.Children.Add(head);
   var help=Label(hint,13,FontWeights.Normal,Muted);
   help.Margin=new Thickness(0,2,0,6);
   stack.Children.Add(help);
   var fields=new Grid();
   fields.ColumnDefinitions.Add(new ColumnDefinition());
   fields.ColumnDefinitions.Add(new ColumnDefinition());
   key=Pass();secret=Pass();
   fields.Children.Add(Field("API anahtarı",key,0));
   fields.Children.Add(Field("API şifresi",secret,1));
   stack.Children.Add(fields);
   saved=Label("Kayıtlı",12,FontWeights.Normal,Muted);
   saved.Margin=new Thickness(0,4,0,0);
   stack.Children.Add(saved);
   return stack;
  }
  static UIElement Field(string label,Control box,int column) {
   var stack=new StackPanel{Margin=new Thickness(column==0?0:12,0,0,0)};
   var caption=Label(label,12,FontWeights.Normal,Muted);
   caption.Margin=new Thickness(2,0,0,4);
   stack.Children.Add(caption);
   stack.Children.Add(Wrap(box));
   Grid.SetColumn(stack,column);
   return stack;
  }
  static Border Wrap(Control box) {
   box.BorderThickness=new Thickness(0);
   box.Background=Brushes.Transparent;
   var text=box as TextBox;
   if(text!=null){text.Padding=new Thickness(0,8,0,8);text.VerticalContentAlignment=VerticalAlignment.Center;}
   var pass=box as PasswordBox;
   if(pass!=null) pass.Padding=new Thickness(0,8,0,8);
   return new Border{Background=White,BorderBrush=Line,BorderThickness=new Thickness(1),CornerRadius=new CornerRadius(8),Padding=new Thickness(12,0,12,0),Height=40,Child=box};
  }
  static TextBox Box() {
   var box=new TextBox{FontFamily=Face,FontSize=14,Foreground=Ink,CaretBrush=Ink};
   return box;
  }
  static PasswordBox Pass() {
   return new PasswordBox{FontFamily=Face,FontSize=14,Foreground=Ink,CaretBrush=Ink};
  }
  Button Quiet(string text,Action click) {
   var button=new Button{Content=text,Foreground=Muted,Background=Brushes.Transparent,BorderThickness=new Thickness(0),FontFamily=Face,FontSize=14,Cursor=Cursors.Hand,Padding=new Thickness(0),Template=QuietTemplate(),HorizontalAlignment=HorizontalAlignment.Left,VerticalAlignment=VerticalAlignment.Center};
   button.Click+=delegate{click();};
   return button;
  }
  Button Fill(string text,Action click) {
   var button=new Button{Content=text,Foreground=White,Background=Brushes.Transparent,BorderThickness=new Thickness(0),FontFamily=Face,FontSize=14,FontWeight=FontWeights.SemiBold,Cursor=Cursors.Hand,Height=38,MinWidth=108,Padding=new Thickness(16,0,16,0),Template=FillTemplate()};
   button.Click+=delegate{click();};
   return button;
  }
  static ControlTemplate QuietTemplate() {
   var border=new FrameworkElementFactory(typeof(Border));
   border.Name="box";
   border.SetValue(Border.BackgroundProperty,Brushes.Transparent);
   border.SetValue(Border.PaddingProperty,new Thickness(0,4,0,4));
   var content=new FrameworkElementFactory(typeof(ContentPresenter));
   content.SetValue(FrameworkElement.HorizontalAlignmentProperty,HorizontalAlignment.Center);
   content.SetValue(FrameworkElement.VerticalAlignmentProperty,VerticalAlignment.Center);
   border.AppendChild(content);
   var template=new ControlTemplate(typeof(Button));
   template.VisualTree=border;
   var over=new Trigger{Property=UIElement.IsMouseOverProperty,Value=true};
   over.Setters.Add(new Setter(Control.ForegroundProperty,Ink));
   template.Triggers.Add(over);
   var off=new Trigger{Property=UIElement.IsEnabledProperty,Value=false};
   off.Setters.Add(new Setter(UIElement.OpacityProperty,0.35));
   template.Triggers.Add(off);
   return template;
  }
  static ControlTemplate FillTemplate() {
   var border=new FrameworkElementFactory(typeof(Border));
   border.Name="box";
   border.SetValue(Border.BackgroundProperty,Blue);
   border.SetValue(Border.CornerRadiusProperty,new CornerRadius(8));
   border.SetValue(Border.PaddingProperty,new Thickness(16,0,16,0));
   var content=new FrameworkElementFactory(typeof(ContentPresenter));
   content.SetValue(FrameworkElement.HorizontalAlignmentProperty,HorizontalAlignment.Center);
   content.SetValue(FrameworkElement.VerticalAlignmentProperty,VerticalAlignment.Center);
   border.AppendChild(content);
   var template=new ControlTemplate(typeof(Button));
   template.VisualTree=border;
   var over=new Trigger{Property=UIElement.IsMouseOverProperty,Value=true};
   over.Setters.Add(new Setter(Border.BackgroundProperty,BlueHover,"box"));
   template.Triggers.Add(over);
   var off=new Trigger{Property=UIElement.IsEnabledProperty,Value=false};
   off.Setters.Add(new Setter(UIElement.OpacityProperty,0.45));
   template.Triggers.Add(off);
   return template;
  }
  static TextBlock Label(string text,double size,FontWeight weight,Brush color) {
   return new TextBlock{Text=text,FontFamily=Face,FontSize=size,FontWeight=weight,Foreground=color};
  }
  static SolidColorBrush Make(byte r,byte g,byte b) {
   var brush=new SolidColorBrush(Color.FromRgb(r,g,b));
   brush.Freeze();
   return brush;
  }
  static Brush SourceColor(string source) {
   if(source==Sources.Trendyol) return Make(224,122,47);
   if(source==Sources.Hepsiburada) return Make(94,75,139);
   if(source==Sources.N11) return Make(62,58,140);
   return Make(46,125,79);
  }
  internal void Capture(string path,double width,double height) {
   Width=width;Height=height;
   Left=80;Top=40;
   Show();
   Pump();
   UpdateLayout();
   var source=PresentationSource.FromVisual(this);
   double scaleX=1,scaleY=1;
   if(source!=null){scaleX=source.CompositionTarget.TransformToDevice.M11;scaleY=source.CompositionTarget.TransformToDevice.M22;}
   int w=Math.Max(1,(int)Math.Round(ActualWidth*scaleX));
   int h=Math.Max(1,(int)Math.Round(ActualHeight*scaleY));
   var bitmap=new RenderTargetBitmap(w,h,96*scaleX,96*scaleY,PixelFormats.Pbgra32);
   bitmap.Render(this);
   var encoder=new PngBitmapEncoder();
   encoder.Frames.Add(BitmapFrame.Create(bitmap));
   using(var stream=System.IO.File.Create(path)) encoder.Save(stream);
  }
  static void Pump() {
   var frame=new DispatcherFrame();
   Dispatcher.CurrentDispatcher.BeginInvoke(DispatcherPriority.ApplicationIdle,new DispatcherOperationCallback(delegate(object arg){((DispatcherFrame)arg).Continue=false;return null;}),frame);
   Dispatcher.PushFrame(frame);
  }
 }
}
