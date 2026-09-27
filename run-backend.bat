@echo off
setlocal
cd /d "%~dp0backend"
if not exist ".venv\Scripts\python.exe" (echo Environment missing. Run setup-windows.bat first.& pause & exit /b 1)
call ".venv\Scripts\activate.bat"
python manage.py migrate || (echo Migration failed.& pause & exit /b 1)
python manage.py ensure_seeded || (echo Catalog check failed.& pause & exit /b 1)
echo Starting Django at http://127.0.0.1:8000/
python manage.py runserver 127.0.0.1:8000
pause
