@echo off
title ASIF GK - Cyber Server (Port 5000)
color 0b
echo ==============================================================
echo             ASIF GK - CYBER BACKEND SERVER
echo         Architect: ASIF GK ^| Port 5000 ^| Local & LAN
echo ==============================================================
echo.
python server.py
if %ERRORLEVEL% NEQ 0 (
    "C:\Users\USER\Python310\python.exe" server.py
)
pause
