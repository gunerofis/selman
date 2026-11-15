using System;using System.IO;using System.Diagnostics;using System.Linq;
namespace IsMerkezi {class QueueCli {
static string Q(string x){return "\""+x.Replace("\"","\\\"")+"\"";}
static int Main(string[] args){try{Console.OutputEncoding=System.Text.Encoding.UTF8;
 if(args.Length==0||!new[]{"list","claim-review","review","claim","complete","block"}.Contains(args[0]))throw new Exception("list | claim-review | review | claim | complete | block");
 var py=Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),@"Programs\Python\Python312\python.exe");
 var script=Path.Combine(AppDomain.CurrentDomain.BaseDirectory,"Ekip","server.py");
 var info=new ProcessStartInfo(py,"-X utf8 "+Q(script)+" "+string.Join(" ",args.Select(Q).ToArray())){UseShellExecute=false,CreateNoWindow=true,RedirectStandardOutput=true,RedirectStandardError=true,StandardOutputEncoding=System.Text.Encoding.UTF8,StandardErrorEncoding=System.Text.Encoding.UTF8};
 using(var p=Process.Start(info)){string output=p.StandardOutput.ReadToEnd();string error=p.StandardError.ReadToEnd();p.WaitForExit();Console.Write(output);Console.Error.Write(error);return p.ExitCode;}
}catch(Exception e){Console.Error.WriteLine(e.Message);return 1;}}}}
