# LLOMS Owner User Setup Script
# This script sets up the default owner user with all permissions

Write-Host "LLOMS Owner User Setup" -ForegroundColor Green
Write-Host "=======================" -ForegroundColor Cyan

Write-Host "`n🔧 Setting up default owner user with full permissions..." -ForegroundColor Yellow

# Check if Docker is running
if (-not (Get-Process -Name "Docker Desktop" -ErrorAction SilentlyContinue)) {
    Write-Host "Docker Desktop is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Check if MySQL container is running
$mysqlContainer = docker ps --filter "name=lloms-mysql" --format "{{.Names}}"
if (-not $mysqlContainer) {
    Write-Host "MySQL container is not running. Starting database services..." -ForegroundColor Yellow
    docker-compose up -d mysql redis
    Write-Host "Waiting for database to be ready..." -ForegroundColor Yellow
    Start-Sleep -Seconds 15
}
else {
    Write-Host "MySQL container is already running" -ForegroundColor Green
}

Write-Host "`n📊 Database Status:" -ForegroundColor Yellow
docker ps --filter "name=lloms-mysql" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

Write-Host "`n🔑 Default Owner User Credentials:" -ForegroundColor Yellow
Write-Host "  Username: owner" -ForegroundColor White
Write-Host "  Password: owner123" -ForegroundColor White
Write-Host "  Role: OWNER (Full permissions)" -ForegroundColor White

Write-Host "`n📋 Owner User Permissions:" -ForegroundColor Yellow
Write-Host "  ✅ User Management: Create, Read, Update, Delete" -ForegroundColor White
Write-Host "  ✅ Role Management: Create, Read, Update, Delete" -ForegroundColor White
Write-Host "  ✅ Permission Management: Create, Read, Update, Delete" -ForegroundColor White
Write-Host "  ✅ Product Management: Create, Read, Update, Delete" -ForegroundColor White
Write-Host "  ✅ Outlet Management: Create, Read, Update, Delete" -ForegroundColor White
Write-Host "  ✅ Order Management: Create, Read, Update, Delete" -ForegroundColor White
Write-Host "  ✅ Reporting: Create, Read, Update, Delete" -ForegroundColor White
Write-Host "  ✅ System Administration: Full access" -ForegroundColor White

Write-Host "`n🚀 Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Start the user service:" -ForegroundColor White
Write-Host "     npm run start:user" -ForegroundColor White
Write-Host "  " -ForegroundColor White
Write-Host "  2. The owner user will be automatically created with all permissions" -ForegroundColor White
Write-Host "  " -ForegroundColor White
Write-Host "  3. Login to the POS system at http://localhost:5174" -ForegroundColor White
Write-Host "     Use credentials: owner / owner123" -ForegroundColor White
Write-Host "  " -ForegroundColor White
Write-Host "  4. You'll have access to all system features as the owner" -ForegroundColor White

Write-Host "`n📁 Database Initialization Files:" -ForegroundColor Yellow
Write-Host "  ✅ mysql/init/01-init-databases.sql - Creates databases" -ForegroundColor White
Write-Host "  ✅ mysql/init/02-init-user-data.sql - Sets up roles and permissions" -ForegroundColor White

Write-Host "`n🎯 Benefits of Owner Role:" -ForegroundColor Yellow
Write-Host "  🔐 Full system access" -ForegroundColor White
Write-Host "  👥 Can create/manage all users" -ForegroundColor White
Write-Host "  🏪 Can manage all outlets and products" -ForegroundColor White
Write-Host "  📊 Can view all reports and analytics" -ForegroundColor White
Write-Host "  ⚙️ Can configure system settings" -ForegroundColor White

Write-Host "`n✅ Owner user setup configuration completed!" -ForegroundColor Green
Write-Host "The owner user will be created automatically when the user service starts." -ForegroundColor Cyan
