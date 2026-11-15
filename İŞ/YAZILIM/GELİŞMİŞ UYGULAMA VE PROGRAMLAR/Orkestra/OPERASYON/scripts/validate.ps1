param([switch]$WriteIndex)
$ErrorActionPreference='Stop'
$pythonExe=Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe'
if (-not (Test-Path -LiteralPath $pythonExe)) {
    $pythonCommand=Get-Command python3,python -ErrorAction SilentlyContinue | Where-Object { $_.Source -notlike '*WindowsApps*' } | Select-Object -First 1
    if (-not $pythonCommand) { throw 'Python 3.10 veya üzeri çalıştırılabilir dosyası bulunamadı.' }
    $pythonExe=$pythonCommand.Source
}
$env:PYTHONUTF8='1'
$arguments=@((Join-Path $PSScriptRoot 'validate_structure.py'))
if ($WriteIndex) { $arguments+='--write-index' }
& $pythonExe @arguments
if ($LASTEXITCODE -ne 0) { throw 'OPERASYON yapı kontrolü başarısız.' }