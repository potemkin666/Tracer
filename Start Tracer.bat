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
start "Tracer Server" /D "%ROOT%" cmd /k "npm run serve"
call :wait_for_server >nul 2>nul
start "" "http://localhost:3000"
exit /b 0

:standalone
echo Node.js/npm not found or setup failed.
echo Opening portable standalone mode instead...
start "" "%ROOT%\docs\index.html"
echo.
echo Standalone mode works without installs, but the local server needs Node.js.
pause
exit /b 0

:wait_for_server
where powershell >nul 2>nul
if errorlevel 1 exit /b 1
for /l %%I in (1,1,20) do (
  powershell -NoProfile -Command "try { $r=Invoke-WebRequest -UseBasicParsing 'http://localhost:3000/health' -TimeoutSec 2; if ($r.StatusCode -eq 200) { exit 0 } } catch { exit 1 }"
  if not errorlevel 1 exit /b 0
  timeout /t 1 >nul
)
exit /b 1
