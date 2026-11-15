$ErrorActionPreference = "Stop"

$sourceDir = Join-Path $PSScriptRoot "uygulama"
$appDir = Join-Path $env:LOCALAPPDATA "PanoMaliyet"
$desktopDir = [Environment]::GetFolderPath("Desktop")
$programsDir = [Environment]::GetFolderPath("Programs")

if (-not (Test-Path (Join-Path $sourceDir "index.html"))) {
    throw "Uygulama dosyalari bulunamadi."
}

New-Item -ItemType Directory -Force -Path $appDir | Out-Null
Copy-Item -Path (Join-Path $sourceDir "*") -Destination $appDir -Recurse -Force

$edgeCandidates = @()
if (${env:ProgramFiles(x86)}) {
    $edgeCandidates += Join-Path ${env:ProgramFiles(x86)} "Microsoft\Edge\Application\msedge.exe"
}
if ($env:ProgramFiles) {
    $edgeCandidates += Join-Path $env:ProgramFiles "Microsoft\Edge\Application\msedge.exe"
}
if ($env:LOCALAPPDATA) {
    $edgeCandidates += Join-Path $env:LOCALAPPDATA "Microsoft\Edge\Application\msedge.exe"
}
$edgeCandidates = $edgeCandidates | Where-Object { Test-Path $_ }

$edgePath = $edgeCandidates | Select-Object -First 1
$indexPath = Join-Path $appDir "index.html"
$iconPath = Join-Path $appDir "app.ico"
$appUri = ([System.Uri]$indexPath).AbsoluteUri
$shell = New-Object -ComObject WScript.Shell

function New-AppShortcut([string]$shortcutPath) {
    $shortcut = $shell.CreateShortcut($shortcutPath)
    if ($edgePath) {
        $shortcut.TargetPath = $edgePath
        $shortcut.Arguments = "--app=`"$appUri`" --start-maximized"
    } else {
        $shortcut.TargetPath = $indexPath
    }
    $shortcut.WorkingDirectory = $appDir
    if (Test-Path $iconPath) {
        $shortcut.IconLocation = "$iconPath,0"
    }
    $shortcut.Description = "Pano uretim maliyeti hesaplama"
    $shortcut.Save()
}

New-AppShortcut (Join-Path $desktopDir "Pano Maliyet.lnk")
New-AppShortcut (Join-Path $programsDir "Pano Maliyet.lnk")

if ($edgePath) {
    Start-Process -FilePath $edgePath -ArgumentList "--app=`"$appUri`" --start-maximized"
} else {
    Start-Process -FilePath $indexPath
}
