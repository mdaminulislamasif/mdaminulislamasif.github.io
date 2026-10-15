@echo off
title ASIFGKBD.COM - Deploy to GitHub Pages
color 0b
echo ==============================================================
echo        DEPLOY ASIFGKBD.COM TO LIVE INTERNET (GITHUB PAGES)
echo           Architect: ASIF GK ^| GitHub: mdaminulislamasif
echo ==============================================================
echo.
cd /d "%~dp0"

if not exist "CNAME" (
    echo asifgkbd.com > CNAME
)

git init
git branch -M main
git add .
git commit -m "Deploy ASIFGKBD.COM Official Portal"

echo.
set /p REPO_URL="[*] Paste your GitHub Repository URL (e.g. https://github.com/mdaminulislamasif/asifgkbd.git): "
if not "%REPO_URL%"=="" (
    git remote remove origin 2>nul
    git remote add origin %REPO_URL%
)

git push -u origin main
pause
