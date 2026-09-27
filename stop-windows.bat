@echo off
setlocal
for /f "tokens=5" %%P in ('netstat -aon ^| findstr ":8000" ^| findstr "LISTENING"') do taskkill /PID %%P /T /F >nul 2>nul
for /f "tokens=5" %%P in ('netstat -aon ^| findstr ":5173" ^| findstr "LISTENING"') do taskkill /PID %%P /T /F >nul 2>nul
echo KinoTracker stopped.
pause
