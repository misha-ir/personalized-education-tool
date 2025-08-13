@echo off
setlocal enabledelayedexpansion

echo 🔄 Resetting Personalized Education Tool Development Environment...
echo.
echo ⚠️  This will:
echo    - Stop all running services
echo    - Clear uploaded files
echo    - Reset the database
echo    - Restart all services
echo.

set /p confirm="Are you sure you want to continue? (y/N): "
if /i not "%confirm%"=="y" (
    echo ❌ Reset cancelled
    pause
    exit /b 1
)

echo 🛑 Stopping current services...

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

:: Stop any running Node.js processes
taskkill /F /IM node.exe 2>nul >nul
taskkill /F /IM tsx.exe 2>nul >nul
echo ✅ Node.js processes stopped

:: Stop MongoDB container (but keep it for reset operations)
cd backend
echo 🔄 Preparing MongoDB for reset...
docker compose down >nul 2>&1

:: Start MongoDB for database operations
echo 🔄 Starting MongoDB for reset operations...
docker compose up -d
if errorlevel 1 (
    echo ❌ Failed to start MongoDB container for reset
    pause
    exit /b 1
)

:: Wait for MongoDB to be ready
echo ⏳ Waiting for MongoDB to be ready...
timeout /t 5 /nobreak >nul

:: Clear uploaded files
echo 🧹 Clearing uploaded files...
if exist "uploads" (
    del /Q uploads\* 2>nul
    for /d %%x in (uploads\*) do rmdir /s /q "%%x" 2>nul
    echo ✅ Uploaded files cleared
) else (
    echo No uploads directory found
)

:: Clear database
echo 🧹 Clearing database...
docker compose exec -T mongo mongosh --eval "db.files.deleteMany({})" pet_dev >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Database clear may have failed, but continuing...
) else (
    echo ✅ Database cleared successfully
)

:: Clean up log files
cd ..
if exist "backend.log" del "backend.log"

echo.
echo ✅ Reset completed! Starting fresh development environment...
echo.

:: Restart the development environment
call start-dev.bat
