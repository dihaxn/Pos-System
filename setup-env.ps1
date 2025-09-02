# Little Lanka Order Management System - Environment Setup Script
# This script sets up the environment for the LLOMS project

Write-Host "Setting up LLOMS Environment" -ForegroundColor Green
Write-Host "===============================" -ForegroundColor Cyan

# Check if .env files exist and create them if needed
Write-Host "`nSetting up environment files..." -ForegroundColor Yellow

# Root .env file
if (!(Test-Path ".env")) {
    Write-Host "Creating root .env file..." -ForegroundColor Yellow
    "NODE_ENV=development" | Out-File -FilePath ".env" -Encoding UTF8
    "PROJECT_ROOT=$(Get-Location)" | Add-Content -FilePath ".env" -Encoding UTF8
    Write-Host "Root .env created" -ForegroundColor Green
}
else {
    Write-Host "Root .env already exists" -ForegroundColor Green
}

# Frontend .env file
if (!(Test-Path "frontend\.env")) {
    Write-Host "Creating frontend .env file..." -ForegroundColor Yellow
    "VITE_API_BASE_URL=http://localhost:3000" | Out-File -FilePath "frontend\.env" -Encoding UTF8
    "VITE_APP_NAME=LLOMS" | Add-Content -FilePath "frontend\.env" -Encoding UTF8
    "VITE_APP_VERSION=1.0.0" | Add-Content -FilePath "frontend\.env" -Encoding UTF8
    Write-Host "Frontend .env created" -ForegroundColor Green
}
else {
    Write-Host "Frontend .env already exists" -ForegroundColor Green
}

# BFF .env file
if (!(Test-Path "bff\.env")) {
    Write-Host "Creating BFF .env file..." -ForegroundColor Yellow
    "NODE_ENV=development" | Out-File -FilePath "bff\.env" -Encoding UTF8
    "PORT=3000" | Add-Content -FilePath "bff\.env" -Encoding UTF8
    "JWT_SECRET=your-super-secret-jwt-key-change-in-production" | Add-Content -FilePath "bff\.env" -Encoding UTF8
    "PRODUCT_SERVICE_BASE_URL=http://localhost:8087" | Add-Content -FilePath "bff\.env" -Encoding UTF8
    "USER_SERVICE_BASE_URL=http://localhost:8088" | Add-Content -FilePath "bff\.env" -Encoding UTF8
    "OUTLET_SERVICE_BASE_URL=http://localhost:8089" | Add-Content -FilePath "bff\.env" -Encoding UTF8
    "MYSQL_HOST=localhost" | Add-Content -FilePath "bff\.env" -Encoding UTF8
    "MYSQL_PORT=3306" | Add-Content -FilePath "bff\.env" -Encoding UTF8
    "MYSQL_USER=root" | Add-Content -FilePath "bff\.env" -Encoding UTF8
    "MYSQL_PASSWORD=" | Add-Content -FilePath "bff\.env" -Encoding UTF8
    "MYSQL_DATABASE=lloms" | Add-Content -FilePath "bff\.env" -Encoding UTF8
    "REDIS_HOST=localhost" | Add-Content -FilePath "bff\.env" -Encoding UTF8
    "REDIS_PORT=6379" | Add-Content -FilePath "bff\.env" -Encoding UTF8
    Write-Host "BFF .env created" -ForegroundColor Green
}
else {
    Write-Host "BFF .env already exists" -ForegroundColor Green
}

# Product Service .env file
if (!(Test-Path "services\product-service\.env")) {
    Write-Host "Creating product service .env file..." -ForegroundColor Yellow
    "SPRING_PROFILES_ACTIVE=development" | Out-File -FilePath "services\product-service\.env" -Encoding UTF8
    "SERVER_PORT=8087" | Add-Content -FilePath "services\product-service\.env" -Encoding UTF8
    "SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/productDb" | Add-Content -FilePath "services\product-service\.env" -Encoding UTF8
    "SPRING_DATASOURCE_USERNAME=root" | Add-Content -FilePath "services\product-service\.env" -Encoding UTF8
    "SPRING_DATASOURCE_PASSWORD=" | Add-Content -FilePath "services\product-service\.env" -Encoding UTF8
    "SPRING_DATASOURCE_DRIVER_CLASS_NAME=com.mysql.cj.jdbc.Driver" | Add-Content -FilePath "services\product-service\.env" -Encoding UTF8
    Write-Host "Product service .env created" -ForegroundColor Green
}
else {
    Write-Host "Product service .env already exists" -ForegroundColor Green
}

# User Service .env file
if (!(Test-Path "services\user-service\.env")) {
    Write-Host "Creating user service .env file..." -ForegroundColor Yellow
    "SPRING_PROFILES_ACTIVE=development" | Out-File -FilePath "services\user-service\.env" -Encoding UTF8
    "SERVER_PORT=8088" | Add-Content -FilePath "services\user-service\.env" -Encoding UTF8
    "SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/userDb" | Add-Content -FilePath "services\user-service\.env" -Encoding UTF8
    "SPRING_DATASOURCE_USERNAME=root" | Add-Content -FilePath "services\user-service\.env" -Encoding UTF8
    "SPRING_DATASOURCE_PASSWORD=" | Add-Content -FilePath "services\user-service\.env" -Encoding UTF8
    "SPRING_DATASOURCE_DRIVER_CLASS_NAME=com.mysql.cj.jdbc.Driver" | Add-Content -FilePath "services\user-service\.env" -Encoding UTF8
    Write-Host "User service .env created" -ForegroundColor Green
}
else {
    Write-Host "User service .env already exists" -ForegroundColor Green
}

# Outlet Service .env file
if (!(Test-Path "services\outlet-service\.env")) {
    Write-Host "Creating outlet service .env file..." -ForegroundColor Yellow
    "SPRING_PROFILES_ACTIVE=development" | Out-File -FilePath "services\outlet-service\.env" -Encoding UTF8
    "SERVER_PORT=8089" | Add-Content -FilePath "services\outlet-service\.env" -Encoding UTF8
    "SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/outletDb" | Add-Content -FilePath "services\outlet-service\.env" -Encoding UTF8
    "SPRING_DATASOURCE_USERNAME=root" | Add-Content -FilePath "services\outlet-service\.env" -Encoding UTF8
    "SPRING_DATASOURCE_PASSWORD=" | Add-Content -FilePath "services\outlet-service\.env" -Encoding UTF8
    "SPRING_DATASOURCE_DRIVER_CLASS_NAME=com.mysql.cj.jdbc.Driver" | Add-Content -FilePath "services\outlet-service\.env" -Encoding UTF8
    Write-Host "Outlet service .env created" -ForegroundColor Green
}
else {
    Write-Host "Outlet service .env already exists" -ForegroundColor Green
}

# Create mysql init directory
Write-Host "`nSetting up database initialization..." -ForegroundColor Yellow

if (!(Test-Path "mysql\init")) {
    New-Item -ItemType Directory -Path "mysql\init" -Force | Out-Null
    Write-Host "MySQL init directory created" -ForegroundColor Green
}

# Create sample database initialization SQL
$initSqlPath = "mysql\init\01-init-databases.sql"
if (!(Test-Path $initSqlPath)) {
    Write-Host "Creating database initialization SQL..." -ForegroundColor Yellow
    
    # Create simple SQL file
    "CREATE DATABASE IF NOT EXISTS productDb;" | Out-File -FilePath $initSqlPath -Encoding UTF8
    "CREATE DATABASE IF NOT EXISTS outletDb;" | Add-Content -FilePath $initSqlPath -Encoding UTF8
    "CREATE DATABASE IF NOT EXISTS userDb;" | Add-Content -FilePath $initSqlPath -Encoding UTF8
    
    Write-Host "Database initialization SQL created" -ForegroundColor Green
}
else {
    Write-Host "Database initialization SQL already exists" -ForegroundColor Green
}

# Create .gitignore file
Write-Host "`nSetting up .gitignore files..." -ForegroundColor Yellow

if (!(Test-Path ".gitignore")) {
    "node_modules/" | Out-File -FilePath ".gitignore" -Encoding UTF8
    "*/node_modules/" | Add-Content -FilePath ".gitignore" -Encoding UTF8
    ".env" | Add-Content -FilePath ".gitignore" -Encoding UTF8
    ".env.local" | Add-Content -FilePath ".gitignore" -Encoding UTF8
    "dist/" | Add-Content -FilePath ".gitignore" -Encoding UTF8
    "build/" | Add-Content -FilePath ".gitignore" -Encoding UTF8
    "target/" | Add-Content -FilePath ".gitignore" -Encoding UTF8
    "*.log" | Add-Content -FilePath ".gitignore" -Encoding UTF8
    ".vscode/" | Add-Content -FilePath ".gitignore" -Encoding UTF8
    ".idea/" | Add-Content -FilePath ".gitignore" -Encoding UTF8
    Write-Host "Root .gitignore created" -ForegroundColor Green
}
else {
    Write-Host "Root .gitignore already exists" -ForegroundColor Green
}

# Create build script
Write-Host "`nCreating build scripts..." -ForegroundColor Yellow

if (!(Test-Path "build.bat")) {
    "@echo off" | Out-File -FilePath "build.bat" -Encoding ASCII
    "REM LLOMS Build Script for Windows" | Add-Content -FilePath "build.bat" -Encoding ASCII
    "echo Building all services..." | Add-Content -FilePath "build.bat" -Encoding ASCII
    "call npm run build-all" | Add-Content -FilePath "build.bat" -Encoding ASCII
    "echo Build completed!" | Add-Content -FilePath "build.bat" -Encoding ASCII
    Write-Host "Build script created" -ForegroundColor Green
}
else {
    Write-Host "Build script already exists" -ForegroundColor Green
}

Write-Host "`nEnvironment setup completed!" -ForegroundColor Green
Write-Host "===============================" -ForegroundColor Cyan

Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Review and customize the .env files if needed" -ForegroundColor White
Write-Host "2. Run 'npm run install-all' to install dependencies" -ForegroundColor White
Write-Host "3. Run '.\start-project.ps1' to start all services" -ForegroundColor White
Write-Host "4. Run '.\health-check.ps1' to verify everything is working" -ForegroundColor White

Write-Host "`nFor more information, see README.md" -ForegroundColor Cyan
