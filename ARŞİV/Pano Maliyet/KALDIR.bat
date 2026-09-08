@echo off
chcp 65001 >nul
title Pano Maliyet Kaldirma
setlocal

echo Pano Maliyet bu Windows kullanicisindan kaldirilacak.
choice /C EH /N /M "Devam etmek icin E, vazgecmek icin H tusuna basin: "
if errorlevel 2 exit /b 0

powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0kaldir.ps1"
if errorlevel 1 (
  echo Kaldirma tamamlanamadi.
  pause
  exit /b 1
)

echo Pano Maliyet kaldirildi.
timeout /t 3 >nul
exit /b 0
