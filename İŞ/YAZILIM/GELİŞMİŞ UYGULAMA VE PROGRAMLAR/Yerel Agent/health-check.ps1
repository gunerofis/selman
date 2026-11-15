# Health Check Script - Sadece kontrol, hiçbir ayar değiştirmez

$results = @()

# 1. Ollama çalışıyor mu
try {
    $ollamaCheck = Invoke-RestMethod -Uri "http://localhost:11434/api/version" -Method Get -TimeoutSec 5 -ErrorAction Stop
    $results += "Ollama: OK"
} catch {
    $results += "Ollama: FAIL"
}

# 2. OpenCode kurulu mu (Desktop app)
try {
    $opencodePath = "C:\Users\Guner Office\AppData\Local\Programs\@opencode-aidesktop\OpenCode.exe"
    if (Test-Path $opencodePath) {
        $results += "OpenCode: OK"
    } else {
        $results += "OpenCode: FAIL"
    }
} catch {
    $results += "OpenCode: FAIL"
}

# 3. Goose kurulu mu (CLI)
try {
    $goosePath = "C:\Users\Guner Office\.local\bin\goose.exe"
    if (Test-Path $goosePath) {
        $results += "Goose: OK"
    } else {
        $results += "Goose: FAIL"
    }
} catch {
    $results += "Goose: FAIL"
}

# 4. OpenClaw gateway çalışıyor mu
try {
    $gatewayStatus = & "C:\Users\Guner Office\AppData\Roaming\npm\openclaw.cmd" health 2>&1
    if ($gatewayStatus -like "*ok*") {
        $results += "OpenClaw Gateway: OK"
    } else {
        $results += "OpenClaw Gateway: FAIL"
    }
} catch {
    $results += "OpenClaw Gateway: FAIL"
}

# 5. Lemonade binary mevcut mu
try {
    $lemonadePath = "C:\Users\Guner Office\AppData\Local\Temp\lemonade-embeddable\lemonade-embeddable-11.9.0-windows-x64\lemonade.exe"
    if (Test-Path $lemonadePath) {
        $results += "Lemonade: OK"
    } else {
        $results += "Lemonade: FAIL"
    }
} catch {
    $results += "Lemonade: FAIL"
}

# 6. Git ve Playwright mevcut mu
try {
    $gitOk = (Get-Command git -ErrorAction SilentlyContinue) -ne $null
    $pwPath1 = "C:\Users\Guner Office\Desktop\selman\Programlar\Program Dosyaları\Yerel Agent\Test Agent\node_modules\playwright"
    $pwPath2 = "C:\Users\Guner Office\Desktop\selman\Programlar\Program Dosyaları\Yerel Agent\Test Agent\node_modules\@playwright"
    $playwrightOk = (Test-Path $pwPath1) -or (Test-Path $pwPath2)
    if ($gitOk) { $results += "Git: OK" } else { $results += "Git: FAIL" }
    if ($playwrightOk) { $results += "Playwright: OK" } else { $results += "Playwright: FAIL" }
} catch {
    $results += "Git: FAIL"
    $results += "Playwright: FAIL"
}

# Sonuçları yazdır
foreach ($r in $results) {
    Write-Host $r
}