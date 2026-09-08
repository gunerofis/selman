@echo off
chcp 65001 >nul
title Pano Maliyet Kurulumu
setlocal

powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0kurulum.ps1"
if errorlevel 1 (
  echo.
  echo Kurulum tamamlanamadi. Dosyalari ZIP icinden cikardiginizdan emin olun.
  echo.
  pause
  exit /b 1
)

echo.
echo Pano Maliyet basariyla kuruldu ve masaustu kisayolu olusturuldu.
timeout /t 3 >nul
exit /b 0
