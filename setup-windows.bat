@echo off
setlocal
set "ROOT=%~dp0"

where python >nul 2>nul || (echo Python not found. Install Python and retry.& pause & exit /b 1)
where npm >nul 2>nul || (echo Node.js/npm not found. Install Node.js and retry.& pause & exit /b 1)

cd /d "%ROOT%backend"
if not exist ".venv\Scripts\python.exe" python -m venv .venv

".venv\Scripts\python.exe" -m pip install -r requirements.txt || goto :fail
".venv\Scripts\python.exe" manage.py migrate || goto :fail
".venv\Scripts\python.exe" manage.py ensure_seeded || goto :fail

cd /d "%ROOT%frontend"
if not exist "node_modules" npm install || goto :fail

echo.
echo Setup complete. Use start-windows.bat from now on.
pause
exit /b 0

:fail
echo.
echo Setup failed. See the error above.
pause
exit /b 1
