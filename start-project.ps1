# Little Lanka Order Management System - Startup Script
# This script starts all services for the LLOMS project

Write-Host "Starting LLOMS Project..." -ForegroundColor Green

# Check if Docker is running
if (-not (Get-Process -Name "Docker Desktop" -ErrorAction SilentlyContinue)) {
    Write-Host "Docker Desktop is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
}
catch {
    Write-Host "Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if Java is installed
try {
    $javaVersion = java -version 2>&1 | Select-String "version"
    Write-Host "Java version: $javaVersion" -ForegroundColor Green
}
catch {
    Write-Host "Java is not installed. Please install Java 17+ first." -ForegroundColor Red
    exit 1
}

# Check if Maven is installed
try {
    $mavenVersion = mvn --version | Select-String "Apache Maven"
    Write-Host "Maven version: $mavenVersion" -ForegroundColor Green
}
catch {
    Write-Host "Maven is not installed. Please install Maven 3.6+ first." -ForegroundColor Red
    exit 1
}

Write-Host "Starting database services..." -ForegroundColor Yellow
docker-compose up -d mysql redis

Write-Host "Waiting for database services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm run install-all

Write-Host "Starting all services..." -ForegroundColor Yellow
npm run start-all

Write-Host "LLOMS Project started successfully!" -ForegroundColor Green
Write-Host "Website: http://localhost:5173" -ForegroundColor Cyan
Write-Host "POS System: http://localhost:5174" -ForegroundColor Cyan
Write-Host "BFF: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Product Service: http://localhost:8087" -ForegroundColor Cyan
Write-Host "User Service: http://localhost:8088" -ForegroundColor Cyan
Write-Host "Outlet Service: http://localhost:8089" -ForegroundColor Cyan
Write-Host "Reporting Service: http://localhost:8090" -ForegroundColor Cyan

Write-Host "`n🔑 Default Owner User Credentials:" -ForegroundColor Yellow
Write-Host "  Username: owner" -ForegroundColor White
Write-Host "  Password: owner123" -ForegroundColor White
Write-Host "  Role: OWNER (Full permissions)" -ForegroundColor White
Write-Host "  Access: http://localhost:5174 (POS System)" -ForegroundColor White

Write-Host "`n📋 Owner User Permissions:" -ForegroundColor Yellow
Write-Host "  ✅ Full system access - All features available" -ForegroundColor White
Write-Host "  ✅ User, Role, and Permission management" -ForegroundColor White
Write-Host "  ✅ Product, Outlet, and Order management" -ForegroundColor White
Write-Host "  ✅ Reporting and analytics" -ForegroundColor White
Write-Host "  ✅ System configuration" -ForegroundColor White

Write-Host "`n💡 Pro Tip:" -ForegroundColor Cyan
Write-Host "  The owner user is automatically created when the user service starts." -ForegroundColor White
Write-Host "  Use these credentials to access all system features." -ForegroundColor White
