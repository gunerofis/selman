@echo off
chcp 65001 >nul
cd /d "%~dp0"
rem Canli site: Cloudflare Pages "doku" (info@dokuduvar.com). Sayfalar dist'ten, hesap API'si pages\functions'tan.
rem scripts\deploy.mjs KULLANILMAZ. Ilk arguman "test" ise test.doku-9e5.pages.dev'e yayinlar.
set "BRANCH=main"
if /i "%~1"=="test" set "BRANCH=test"
node node_modules\wrangler\bin\wrangler.js whoami | findstr /C:"info@dokuduvar.com" >nul || (node node_modules\wrangler\bin\wrangler.js logout & node node_modules\wrangler\bin\wrangler.js login)
node scripts\build-runtime.mjs || goto :hata
if exist pages\out rmdir /s /q pages\out
robocopy dist pages\out /E /XD server client .openai .vite /NFL /NDL /NJH /NJS >nul
if exist .wrangler\deploy\config.json del /q .wrangler\deploy\config.json
pushd pages
node ..\node_modules\wrangler\bin\wrangler.js pages deploy --branch %BRANCH% --commit-dirty=true || (popd & goto :hata)
popd
echo.
echo Yayinda (%BRANCH%).
if /i not "%~1"=="test" pause
exit /b 0
:hata
echo HATA: yayin yapilmadi.
if /i not "%~1"=="test" pause
exit /b 1
