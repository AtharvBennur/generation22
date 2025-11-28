@echo off
echo ========================================
echo    TechSphere - Starting Application
echo ========================================
echo.

REM Check if Firebase is configured
findstr /C:"your-project-id" backend\.env >nul
if %errorlevel% equ 0 (
    echo [ERROR] Firebase not configured!
    echo.
    echo Please follow these steps:
    echo 1. Go to https://console.firebase.google.com/
    echo 2. Create a project and enable Authentication, Firestore, Storage
    echo 3. Get your credentials and update:
    echo    - backend\.env with Firebase Admin credentials
    echo    - frontend\src\firebaseClient.js with Firebase config
    echo.
    echo See QUICKSTART.md for detailed instructions.
    echo.
    pause
    exit /b 1
)

echo [1/2] Starting Backend Server...
cd backend
start cmd /k "npm start"
timeout /t 3 /nobreak >nul

echo [2/2] Backend will auto-launch Frontend...
echo.
echo ========================================
echo   Servers Starting!
echo ========================================
echo   Backend:  http://localhost:5000
echo   Frontend: http://localhost:3000
echo ========================================
echo.
echo Press Ctrl+C in the backend window to stop both servers
echo.
