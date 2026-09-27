@echo off
setlocal
set "ROOT=%~dp0"
if not exist "%ROOT%backend\.venv\Scripts\python.exe" (echo First run detected. Run setup-windows.bat first.& pause & exit /b 1)
if not exist "%ROOT%frontend\node_modules" (echo First run detected. Run setup-windows.bat first.& pause & exit /b 1)

start "KinoTracker Backend" "%ComSpec%" /k call "%ROOT%run-backend.bat"

echo Waiting for backend...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$end=(Get-Date).AddSeconds(45); do { try { $r=Invoke-WebRequest -UseBasicParsing -TimeoutSec 2 http://127.0.0.1:8000/api/health/; if($r.StatusCode -eq 200){exit 0} } catch {} ; Start-Sleep -Seconds 1 } while((Get-Date) -lt $end); exit 1"
if errorlevel 1 (echo Backend did not start. Check the 'KinoTracker Backend' window.& pause & exit /b 1)

start "KinoTracker Frontend" "%ComSpec%" /k call "%ROOT%run-frontend.bat"
echo Waiting for frontend...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$end=(Get-Date).AddSeconds(45); do { try { $r=Invoke-WebRequest -UseBasicParsing -TimeoutSec 2 http://127.0.0.1:5173/; if($r.StatusCode -eq 200){exit 0} } catch {} ; Start-Sleep -Seconds 1 } while((Get-Date) -lt $end); exit 1"
if errorlevel 1 (echo Frontend did not start. Check the 'KinoTracker Frontend' window.& pause & exit /b 1)

start "" http://127.0.0.1:5173/
exit /b 0
