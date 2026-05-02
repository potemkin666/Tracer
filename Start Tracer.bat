@echo off
setlocal
cd /d "%~dp0"
set "ROOT=%CD%"
set "PORT=3000"
set "MAX_WAIT_SECONDS=20"

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
start "" "http://localhost:%PORT%"
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
powershell -NoProfile -Command "$port=$env:PORT; $maxWait=$env:MAX_WAIT_SECONDS; $deadline=(Get-Date).AddSeconds([int]$maxWait); while ((Get-Date) -lt $deadline) { try { $r=Invoke-WebRequest -UseBasicParsing ('http://localhost:' + $port + '/health') -TimeoutSec 2; if ($r.StatusCode -eq 200) { exit 0 } } catch {} Start-Sleep -Seconds 1 }; exit 1"
exit /b %errorlevel%
