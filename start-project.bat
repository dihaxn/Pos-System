@echo off
echo Starting LLOMS Project...

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if Java is installed
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo Java is not installed. Please install Java 17+ first.
    pause
    exit /b 1
)

REM Check if Maven is installed
mvn --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Maven is not installed. Please install Maven 3.6+ first.
    pause
    exit /b 1
)

echo Starting database services...
call docker-compose up -d mysql redis

echo Waiting for database services to be ready...
timeout /t 10 /nobreak >nul

echo Installing dependencies...
call npm run install-all

echo Starting all services...
call npm run start-all

echo LLOMS Project started successfully!
echo Website: http://localhost:5173
echo POS System: http://localhost:5174
echo BFF: http://localhost:3000
echo Product Service: http://localhost:8087
echo User Service: http://localhost:8088
echo Outlet Service: http://localhost:8089
echo Reporting Service: http://localhost:8090

echo.
echo 🔑 Default Owner User Credentials:
echo   Username: owner
echo   Password: owner123
echo   Role: OWNER (Full permissions)
echo   Access: http://localhost:5174 (POS System)

echo.
echo 📋 Owner User Permissions:
echo   ✅ Full system access - All features available
echo   ✅ User, Role, and Permission management
echo   ✅ Product, Outlet, and Order management
echo   ✅ Reporting and analytics
echo   ✅ System configuration

echo.
echo 💡 Pro Tip:
echo   The owner user is automatically created when the user service starts.
echo   Use these credentials to access all system features.

pause
