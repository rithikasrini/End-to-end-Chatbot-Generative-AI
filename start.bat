@echo off
echo Starting MediBot Development Environment...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo.

REM Check if we're in the right directory
if not exist "backend" (
    echo ERROR: backend directory not found
    echo Please run this script from the MediBot project root directory
    pause
    exit /b 1
)

if not exist "frontend" (
    echo ERROR: frontend directory not found
    echo Please run this script from the MediBot project root directory
    pause
    exit /b 1
)

REM Check if .env file exists in backend
if not exist "backend\.env" (
    echo WARNING: .env file not found in backend directory
    echo Please copy .env.example to .env and add your API key
    echo.
    if exist "backend\.env.example" (
        copy "backend\.env.example" "backend\.env"
        echo Created .env file from template
        echo Please edit backend\.env and add your GEMINI_API_KEY
        echo.
    )
)

REM Install backend dependencies if needed
if not exist "backend\node_modules" (
    echo Installing backend dependencies...
    cd backend
    npm install
    cd ..
    echo.
)

REM Install frontend dependencies if needed
if not exist "frontend\node_modules" (
    echo Installing frontend dependencies...
    cd frontend
    npm install
    cd ..
    echo.
)

echo.
echo Starting MediBot...
echo Backend will run on http://localhost:5000
echo Frontend will run on http://localhost:3000
echo.
echo Press Ctrl+C to stop the servers
echo.

REM Start both servers
start "MediBot Backend" cmd /k "cd backend && npm start"
timeout /t 3 /nobreak >nul
start "MediBot Frontend" cmd /k "cd frontend && npm start"

echo.
echo MediBot is starting...
echo Check the opened terminal windows for any errors
echo The application should open automatically in your browser
echo.
pause
