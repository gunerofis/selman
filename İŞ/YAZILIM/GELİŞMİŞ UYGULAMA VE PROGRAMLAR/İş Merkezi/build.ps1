$ErrorActionPreference='Stop'
& (Join-Path $env:LOCALAPPDATA 'Programs\Python\Python312\python.exe') -X utf8 (Join-Path $PSScriptRoot 'Ekip\SyncRules.py')
if($LASTEXITCODE -ne 0){throw 'Kurallar eşitlenemedi.'}
$framework=Join-Path $env:WINDIR 'Microsoft.NET\Framework64\v4.0.30319'
$refs=@('System.dll','System.Core.dll','System.Net.Http.dll','System.Web.Extensions.dll','System.Security.dll') | ForEach-Object {'/reference:'+(Join-Path $framework $_)}
$orders=Join-Path $PSScriptRoot 'Moduller\Siparişler'
$sources=@('Orders.cs','Storage.cs','Marketplaces.cs','JsonMap.cs','Websites.cs') | ForEach-Object {Join-Path $orders $_}
foreach($helper in @('SettingsApi','OrdersRead')){
 & (Join-Path $framework 'csc.exe') /nologo /target:exe /platform:x64 /langversion:5 /codepage:65001 ('/out:'+(Join-Path $PSScriptRoot ('Ekip\'+$helper+'.exe'))) @refs (Join-Path $PSScriptRoot ('Ekip\'+$helper+'.cs')) @sources
 if($LASTEXITCODE -ne 0){throw "$helper derlenemedi."}
}
& (Join-Path $framework 'csc.exe') /nologo /target:exe /platform:x64 /langversion:5 /codepage:65001 ('/out:'+(Join-Path $PSScriptRoot 'IsKuyrugu.exe')) @refs (Join-Path $PSScriptRoot 'QueueCli.cs')
if($LASTEXITCODE -ne 0){throw 'İş kuyruğu derlenemedi.'}
$nodeExe=Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
$pluginRoot=Join-Path $env:USERPROFILE '.codex\plugins\cache\openai-curated-remote\data-analytics'
$plugin=Get-ChildItem -LiteralPath $pluginRoot -Directory | Sort-Object { [version]($_.Name.Split('-')[0]) } -Descending | ForEach-Object {
 foreach($relative in @('output_formats\html\scripts\data-app.mjs','scripts\data-app.mjs')){
  $candidate=Join-Path $_.FullName $relative
  if(Test-Path -LiteralPath $candidate){$candidate;break}
 }
} | Select-Object -First 1
if(-not $plugin){throw 'Kurulu Data derleme aracı bulunamadı.'}
if(-not (Test-Path -LiteralPath (Join-Path $PSScriptRoot 'node_modules\vite\bin\vite.js'))){throw 'Kaynak derlemesinin yerel bağımlılıkları eksik.'}
# Kullanıcının 30.10.2026 derleme düzeltmesi: programın doğrulanan kendi kaynakları.
& $nodeExe $plugin build --project-dir $PSScriptRoot --source
if($LASTEXITCODE -ne 0){throw 'ChatGPT uygulaması derlenemedi.'}
