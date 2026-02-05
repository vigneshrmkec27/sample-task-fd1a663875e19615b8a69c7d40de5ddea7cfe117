@echo off
echo ========================================
echo   Task Management System Startup
echo ========================================
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check Maven
where mvn >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Maven is not installed!
    echo Please install from: https://maven.apache.org/
    pause
    exit /b 1
)

REM Check Java
where java >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Java is not installed!
    echo Please install Java 17 or higher
    pause
    exit /b 1
)

echo [INFO] All prerequisites verified
echo.

REM Install root dependencies if needed
if not exist node_modules (
    echo [INFO] Installing root dependencies...
    call npm install
    echo.
)

REM Install frontend dependencies if needed
if not exist frontend\node_modules (
    echo [INFO] Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
    echo.
)

echo ========================================
echo   Starting Backend and Frontend
echo ========================================
echo Backend: http://localhost:8080
echo Frontend: http://localhost:3000
echo.
echo Press Ctrl+C to stop all servers
echo ========================================
echo.

REM Start both servers
call npm start

pause