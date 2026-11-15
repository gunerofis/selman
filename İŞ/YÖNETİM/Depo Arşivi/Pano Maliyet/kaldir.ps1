$ErrorActionPreference = "Stop"

$appDir = Join-Path $env:LOCALAPPDATA "PanoMaliyet"
$desktopShortcut = Join-Path ([Environment]::GetFolderPath("Desktop")) "Pano Maliyet.lnk"
$startShortcut = Join-Path ([Environment]::GetFolderPath("Programs")) "Pano Maliyet.lnk"

Remove-Item -Path $desktopShortcut -Force -ErrorAction SilentlyContinue
Remove-Item -Path $startShortcut -Force -ErrorAction SilentlyContinue
Remove-Item -Path $appDir -Recurse -Force -ErrorAction SilentlyContinue
