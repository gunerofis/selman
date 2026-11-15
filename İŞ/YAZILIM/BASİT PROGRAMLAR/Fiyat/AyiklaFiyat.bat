@echo off
chcp 65001 >nul
cd /d "%~dp0"

set "PY="
where py >nul 2>nul && set "PY=py"
if not defined PY (where python >nul 2>nul && set "PY=python")
if not defined PY (
  echo Python bulunamadi. https://www.python.org/downloads/ adresinden kur ^("Add to PATH" isaretli^), sonra tekrar calistir.
  pause
  exit /b 1
)

%PY% -c "import PySide6" >nul 2>nul
if errorlevel 1 (
  echo Ilk calistirma: gerekli paketler kuruluyor...
  %PY% -m pip install --user PySide6
  if errorlevel 1 (
    echo Paket kurulumu basarisiz.
    pause
    exit /b 1
  )
)

if "%PY%"=="py" (
  start "" pyw "%~dp0fiyat.pyw" %*
) else (
  start "" pythonw "%~dp0fiyat.pyw" %*
)
