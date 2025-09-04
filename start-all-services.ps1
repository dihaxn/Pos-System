# LLOMS Complete System Startup Script
# This script starts all services for the LLOMS project

Write-Host "Starting LLOMS Complete System..." -ForegroundColor Green

# Function to check if a port is in use
function Test-Port {
    param([int]$Port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("localhost", $Port)
        $connection.Close()
        return $true
    }
    catch {
        return $false
    }
}

# Function to start a service in a new window
function Start-ServiceInWindow {
    param(
        [string]$ServiceName,
        [string]$WorkingDirectory,
        [string]$Command
    )
    
    Write-Host "Starting $ServiceName..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$WorkingDirectory'; $Command"
    Start-Sleep -Seconds 2
}

# Check if required tools are installed
Write-Host "Checking prerequisites..." -ForegroundColor Yellow

# Check Java
try {
    $javaVersion = java -version 2>&1 | Select-String "version"
    Write-Host "Java: $javaVersion" -ForegroundColor Green
}
catch {
    Write-Host "Java is not installed. Please install Java 17+ first." -ForegroundColor Red
    exit 1
}

# Check Maven
try {
    $mavenVersion = mvn --version | Select-String "Apache Maven"
    Write-Host "Maven: $mavenVersion" -ForegroundColor Green
}
catch {
    Write-Host "Maven is not installed. Please install Maven 3.6+ first." -ForegroundColor Red
    exit 1
}

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "Node.js: $nodeVersion" -ForegroundColor Green
}
catch {
    Write-Host "Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Start Backend Services
Write-Host "`nStarting Backend Services..." -ForegroundColor Cyan

# Discovery Service
Start-ServiceInWindow "Discovery Service" "services\discovery-service" "mvn spring-boot:run"

# User Service
Start-ServiceInWindow "User Service" "services\user-service" "mvn spring-boot:run"

# Product Service
Start-ServiceInWindow "Product Service" "services\product-service" "mvn spring-boot:run"

# Outlet Service
Start-ServiceInWindow "Outlet Service" "services\outlet-service" "mvn spring-boot:run"

# Reporting Service
Start-ServiceInWindow "Reporting Service" "services\reporting-service" "mvn spring-boot:run"

# API Gateway
Start-ServiceInWindow "API Gateway" "services\api-gateway" "mvn spring-boot:run"

# Wait for backend services to start
Write-Host "`nWaiting for backend services to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Start BFF Service
Write-Host "`nStarting BFF Service..." -ForegroundColor Cyan
Start-ServiceInWindow "BFF Service" "bff" "npm start"

# Wait for BFF to start
Start-Sleep -Seconds 10

# Start Frontend Applications
Write-Host "`nStarting Frontend Applications..." -ForegroundColor Cyan

# POS System
Start-ServiceInWindow "POS System" "frontend\pos-system" "npm run dev"

# User Website
Start-ServiceInWindow "User Website" "frontend\user-website" "npm run dev"

# Wait for frontend to start
Write-Host "`nWaiting for frontend applications to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Display service information
Write-Host "`nService URLs:" -ForegroundColor Green
Write-Host "POS System: http://localhost:5174" -ForegroundColor Cyan
Write-Host "User Website: http://localhost:5173" -ForegroundColor Cyan
Write-Host "BFF API: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Discovery Service: http://localhost:8761" -ForegroundColor Cyan
Write-Host "API Gateway: http://localhost:8080" -ForegroundColor Cyan

Write-Host "`nDefault Credentials:" -ForegroundColor Yellow
Write-Host "Username: owner" -ForegroundColor White
Write-Host "Password: owner123" -ForegroundColor White
Write-Host "Role: OWNER (Full permissions)" -ForegroundColor White

Write-Host "`nAll services started successfully!" -ForegroundColor Green
Write-Host "Check the individual service windows for any errors." -ForegroundColor Yellow
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")