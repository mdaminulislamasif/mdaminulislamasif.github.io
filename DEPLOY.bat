@echo off
title ASIF GK Portfolio - Deploy to GitHub Pages
color 0b
echo ==============================================================
echo        DEPLOY ASIF GK OFFICIAL PORTAL (GITHUB PAGES)
echo           Architect: ASIF GK ^| Live: mdaminulislamasif.github.io
echo ==============================================================
echo.
cd /d "%~dp0"

REM Ensure NO conflicting CNAME file exists so GitHub Pages serves cleanly
if exist "CNAME" (
    del /f /q "CNAME" 2>nul
)

git init
git branch -M main
git add .
git commit -m "Deploy ASIF GK Official Portfolio (mdaminulislamasif.github.io)"

echo.
git push -u origin main
echo.
echo [OK] Deployed successfully to https://mdaminulislamasif.github.io/
pause
