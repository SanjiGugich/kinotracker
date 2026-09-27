@echo off
setlocal
cd /d "%~dp0frontend"
if not exist "node_modules" (echo node_modules missing. Run setup-windows.bat first.& pause & exit /b 1)
echo Starting React at http://127.0.0.1:5173/
npm run dev -- --host 127.0.0.1
pause
