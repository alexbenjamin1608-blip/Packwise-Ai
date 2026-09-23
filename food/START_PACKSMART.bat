@echo off
TITLE PackWise AI / PackSmart - SIH 236 Runner
COLOR 0B

echo ===============================================================================
echo            PACKWISE AI / PACKSMART (SIH 236) - ONE-CLICK RUNNER
echo   AI-Based Intelligent Food Packaging Recommendation & TOPSIS Decision Engine
echo ===============================================================================
echo.

cd /d "%~dp0"

:: 1. Verify Python
echo [1/5] Checking Python environment...
python --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Python is not installed or not in PATH!
    echo Please install Python 3.10+ from python.org and add to PATH.
    pause
    exit /b 1
)
python --version

:: 2. Verify Node.js & npm
echo.
echo [2/5] Checking Node.js and npm...
call npm -v >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js / npm is not installed or not in PATH!
    echo Please install Node.js LTS from nodejs.org.
    pause
    exit /b 1
)
node -v
call npm -v

:: Check frontend dependencies
if not exist "%~dp0frontend\node_modules\" (
    echo [INFO] Installing frontend dependencies...
    cd /d "%~dp0frontend"
    call npm install
    cd /d "%~dp0"
)

:: 3. Database Initialization (100 Commodities & Materials Catalog)
echo.
echo [3/5] Initializing database (100 Commodities + Respiration Kinetics + Materials)...
python backend/data/init_db.py

:: 4. Start FastAPI Backend in background on Port 8080
echo.
echo [4/5] Starting FastAPI Backend on http://localhost:8080 ...
start "PackSmart Backend (FastAPI)" cmd /k "color 0A && cd /d %~dp0 && python -m uvicorn main:app --app-dir backend --host 127.0.0.1 --port 8080 --reload"

:: 5. Start Vite Frontend in background on Port 3000
echo.
echo [5/5] Starting Vite React Frontend on http://localhost:3000 ...
start "PackSmart Frontend (Vite React)" cmd /k "color 0E && cd /d %~dp0frontend && npm run dev -- --host 127.0.0.1 --port 3000"

echo.
echo ===============================================================================
echo Servers are launching on new ports!
echo Backend API Docs:   http://localhost:8080/docs
echo Frontend Dashboard: http://localhost:3000
echo ===============================================================================
echo.
echo Waiting 5 seconds before opening browser...
timeout /t 5 /nobreak >nul

start http://localhost:3000

echo.
echo [SUCCESS] PackSmart SIH 236 is active on http://localhost:3000!
echo Keep the backend and frontend terminal windows open.
echo To terminate the application cleanly, run stop.bat.
echo.
pause
