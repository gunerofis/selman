$ErrorActionPreference = 'Stop'
$frameworkPath = Join-Path $env:WINDIR 'Microsoft.NET\Framework64\v4.0.30319'
$compilerPath = Join-Path $frameworkPath 'csc.exe'
$sources = Get-ChildItem -LiteralPath $PSScriptRoot -Filter '*.cs' | ForEach-Object FullName
$references = @(
  'System.dll',
  'System.Core.dll',
  'System.Net.Http.dll',
  'System.Web.Extensions.dll',
  'System.Security.dll',
  'System.Xaml.dll'
) | ForEach-Object { '/reference:' + (Join-Path $frameworkPath $_) }
$references += @('PresentationFramework.dll', 'PresentationCore.dll', 'WindowsBase.dll') | ForEach-Object { '/reference:' + (Join-Path $frameworkPath ('WPF\' + $_)) }
& $compilerPath /nologo /target:winexe /platform:x64 /langversion:5 /codepage:65001 ('/win32manifest:' + (Join-Path $PSScriptRoot 'app.manifest')) ('/out:' + (Join-Path $PSScriptRoot 'Siparisler.exe')) @references @sources
if ($LASTEXITCODE -ne 0) { throw 'Derleme başarısız.' }
