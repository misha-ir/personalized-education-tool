@echo off
setlocal enabledelayedexpansion

echo Stopping Personalized Education Tool Development Environment...
echo.

:: Check if we're in the project root directory
if not exist "backend" (
    echo ❌ Error: Please run this script from the project root directory
    echo    Expected directories: backend\ and frontend\
    pause
    exit /b 1
)
if not exist "frontend" (
    echo ❌ Error: Please run this script from the project root directory  
    echo    Expected directories: backend\ and frontend\
    pause
    exit /b 1
)

:: Stop any running Node.js processes (frontend and backend)
echo 🔄 Stopping Node.js processes...
taskkill /F /IM node.exe 2>nul
if errorlevel 1 (
    echo No Node.js processes found running
) else (
    echo ✅ Node.js processes stopped
)

:: Also stop tsx processes specifically
taskkill /F /IM tsx.exe 2>nul >nul

:: Stop MongoDB container
echo 🔄 Stopping MongoDB container...
cd backend
docker compose down
if errorlevel 1 (
    echo ⚠️  MongoDB container may not be running or failed to stop
) else (
    echo ✅ MongoDB container stopped
)

:: Clean up log files
cd ..
if exist "backend.log" (
    del "backend.log"
    echo ✅ Cleaned up log files
)

echo.
echo ✅ Development environment stopped successfully!
echo    All services have been shut down.
echo.
echo To restart, run: start-dev.bat
pause
