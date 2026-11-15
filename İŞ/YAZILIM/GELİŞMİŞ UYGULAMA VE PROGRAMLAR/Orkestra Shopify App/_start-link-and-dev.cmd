@echo off
setlocal
cd /d "%~dp0"
title shopify-app — sumentakimi.com.tr
echo RUNNING> "%TEMP%\shopify-app-link.flag"

echo.
echo ============================================================
echo  HEDEF: www.sumentakimi.com.tr
echo  Shop:  b1zinb-wv.myshopify.com
echo  Org:   Sumen Takimi  233402705
echo.
echo  Iki tane "Sumen Takimi" org var. BUNU sec:
echo    233402705  = .com.tr  (b1zinb-wv)
echo    211426939  = .com     (k50ggb-0k)  SECMA
echo.
echo  Yeni uygulama sorulursa EVET / Create a new app.
echo  Isim: Sumen TR Admin  (veya istedigin isim)
echo ============================================================
echo.

set SHOPIFY_FLAG_ORGANIZATION_ID=233402705
set SHOPIFY_FLAG_STORE=b1zinb-wv.myshopify.com

echo [1/2] shopify app config link --reset
echo.
call npx.cmd shopify app config link --reset
if errorlevel 1 (
  echo.
  echo config:link basarisiz.
  pause
  exit /b 1
)

echo.
echo [2/2] shopify app dev --store b1zinb-wv.myshopify.com
echo Canli Basic magaza reddedilirse ekrandaki hatayi oku; kapatma.
echo.
call npx.cmd shopify app dev --store b1zinb-wv.myshopify.com
echo.
echo Dev durdu.
pause
endlocal
