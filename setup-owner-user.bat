@echo off
echo LLOMS Owner User Setup
echo =======================

echo.
echo 🔧 Setting up default owner user with full permissions...

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker Desktop is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)

REM Check if MySQL container is running
docker ps --filter "name=lloms-mysql" --format "{{.Names}}" | findstr "lloms-mysql" >nul
if %errorlevel% neq 0 (
    echo MySQL container is not running. Starting database services...
    docker-compose up -d mysql redis
    echo Waiting for database to be ready...
    timeout /t 15 /nobreak >nul
) else (
    echo MySQL container is already running
)

echo.
echo 📊 Database Status:
docker ps --filter "name=lloms-mysql" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo.
echo 🔑 Default Owner User Credentials:
echo   Username: owner
echo   Password: owner123
echo   Role: OWNER (Full permissions)

echo.
echo 📋 Owner User Permissions:
echo   ✅ User Management: Create, Read, Update, Delete
echo   ✅ Role Management: Create, Read, Update, Delete
echo   ✅ Permission Management: Create, Read, Update, Delete
echo   ✅ Product Management: Create, Read, Update, Delete
echo   ✅ Outlet Management: Create, Read, Update, Delete
echo   ✅ Order Management: Create, Read, Update, Delete
echo   ✅ Reporting: Create, Read, Update, Delete
echo   ✅ System Administration: Full access

echo.
echo 🚀 Next Steps:
echo   1. Start the user service:
echo      npm run start:user
echo.
echo   2. The owner user will be automatically created with all permissions
echo.
echo   3. Login to the POS system at http://localhost:5174
echo      Use credentials: owner / owner123
echo.
echo   4. You'll have access to all system features as the owner

echo.
echo 📁 Database Initialization Files:
echo   ✅ mysql/init/01-init-databases.sql - Creates databases
echo   ✅ mysql/init/02-init-user-data.sql - Sets up roles and permissions

echo.
echo 🎯 Benefits of Owner Role:
echo   🔐 Full system access
echo   👥 Can create/manage all users
echo   🏪 Can manage all outlets and products
echo   📊 Can view all reports and analytics
echo   ⚙️ Can configure system settings

echo.
echo ✅ Owner user setup configuration completed!
echo The owner user will be created automatically when the user service starts.

pause
