@echo off
setlocal enabledelayedexpansion

echo Starting Personalized Education Tool Development Environment...
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

:: Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Docker is not running. Please start Docker first.
    pause
    exit /b 1
)

:: Check if Node.js is installed
where node >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

:: Start MongoDB with Docker Compose
echo 🔄 Starting MongoDB container...
cd backend
docker compose up -d
if errorlevel 1 (
    echo ❌ Failed to start MongoDB container
    pause
    exit /b 1
) else (
    echo ✅ MongoDB container started successfully
)

:: Wait for MongoDB to be ready
echo ⏳ Waiting for MongoDB to be ready...
timeout /t 3 /nobreak >nul

:: Start backend server in background
echo 🔄 Starting backend server...
start /B cmd /c "npm run dev > ../backend.log 2>&1"
if errorlevel 1 (
    echo ❌ Failed to start backend server
    docker compose down
    pause
    exit /b 1
) else (
    echo ✅ Backend server started
    echo    Backend running at: http://localhost:3001
    echo    Logs: type backend.log
)

:: Wait for backend to initialize
echo ⏳ Waiting for backend to initialize...
timeout /t 5 /nobreak >nul

:: Start frontend server
echo 🔄 Starting frontend server...
cd ../frontend

echo.
echo ✅ Development environment is ready!
echo.
echo 📡 Services:
echo    Frontend: http://localhost:5173
echo    Backend:  http://localhost:3001
echo    MongoDB:  mongodb://localhost:27017/pet_dev
echo.
echo 📝 To stop all services, run: stop-dev.bat
echo 🔄 To reset database, run: reset-dev.bat
echo.
echo 🖥️  Starting frontend server (Ctrl+C to stop all services)...

:: Start frontend in foreground so user can see logs and stop with Ctrl+C
npm run dev
if errorlevel 1 (
    echo ❌ Frontend server encountered an error
) else (
    echo Frontend server stopped.
)

:: Cleanup when frontend stops
echo.
echo 🔄 Cleaning up...

:: Stop backend processes (kill npm and tsx processes)
taskkill /F /IM node.exe 2>nul
taskkill /F /IM tsx.exe 2>nul
echo ✅ Backend server stopped

:: Stop MongoDB container
cd ../backend
docker compose down
if errorlevel 1 (
    echo ⚠️  MongoDB container may still be running
) else (
    echo ✅ MongoDB container stopped
)

:: Clean up log files
cd ..
if exist "backend.log" del "backend.log"

echo Development environment stopped
pause
