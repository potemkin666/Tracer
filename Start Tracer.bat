@echo off
setlocal
cd /d "%~dp0"
set "ROOT=%CD%"
set "STANDALONE_TARGET=%ROOT%\index.html"
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
call :wait_for_server 2>nul
if errorlevel 1 (
  call :open_standalone "Tracer server did not respond within %MAX_WAIT_SECONDS% seconds."
) else (
  start "" "http://localhost:%PORT%"
)
exit /b 0

:standalone
call :open_standalone "Node.js/npm not found or setup failed."
pause
exit /b 0

:open_standalone
echo %~1
echo Standalone mode is opening now from the repo root...
start "" "%STANDALONE_TARGET%"
echo.
echo You can use Tracer right away with the built-in open APIs.
echo Install Node.js 18+ later from https://nodejs.org if you want the 550+ engine local server.
exit /b 0

:wait_for_server
where powershell >nul 2>nul
if errorlevel 1 (
  echo PowerShell not found, so Tracer cannot auto-check the local server.
  exit /b 1
)
powershell -NoProfile ^
  -ExecutionPolicy Bypass ^
  -File "%ROOT%\Start Tracer.wait.ps1" ^
  -Port %PORT% ^
  -MaxWaitSeconds %MAX_WAIT_SECONDS%
exit /b %errorlevel%
