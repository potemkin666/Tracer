@echo off
setlocal
cd /d "%~dp0"
set "ROOT=%CD%"

echo Starting Tracer from "%ROOT%"
echo.

where node >nul 2>nul
if errorlevel 1 goto standalone
where npm >nul 2>nul
if errorlevel 1 goto standalone

if not exist "%ROOT%\node_modules" (
  echo First run detected. Installing dependencies...
  call npm install
  if errorlevel 1 goto standalone
)

echo Launching local Tracer server...
start "Tracer Server" cmd /k "cd /d ""%ROOT%"" && npm run serve"
timeout /t 3 >nul
start "" "http://localhost:3000"
exit /b 0

:standalone
echo Node.js/npm not found or setup failed.
echo Opening portable standalone mode instead...
start "" "%ROOT%\docs\index.html"
echo.
echo Standalone mode works without installs, but the local server needs Node.js.
pause
