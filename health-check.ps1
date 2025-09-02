# Little Lanka Order Management System - Health Check Script
# This script checks the health of all LLOMS services

Write-Host "LLOMS Project Health Check" -ForegroundColor Green
Write-Host "==========================" -ForegroundColor Cyan

# Function to test service health
function Test-ServiceHealth {
    param($ServiceName, $Port, $HealthEndpoint = $null)
    
    Write-Host "`nChecking $ServiceName..." -ForegroundColor Yellow
    
    # Check if port is open
    $portTest = Test-Port -Port $Port
    if ($portTest) {
        Write-Host "  ✅ Port $Port is open" -ForegroundColor Green
    }
    else {
        Write-Host "  ❌ Port $Port is closed" -ForegroundColor Red
    }
    
    # Test HTTP endpoint if provided
    if ($HealthEndpoint) {
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:$Port$HealthEndpoint" -TimeoutSec 5 -ErrorAction Stop
            if ($response.StatusCode -eq 200) {
                Write-Host "  ✅ Health endpoint responding" -ForegroundColor Green
            }
            else {
                Write-Host "  ⚠️ Health endpoint returned status $($response.StatusCode)" -ForegroundColor Yellow
            }
        }
        catch {
            Write-Host "  ❌ Health endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

# Function to test port connectivity
function Test-Port {
    param($Port)
    try {
        $tcp = New-Object System.Net.Sockets.TcpClient
        $tcp.Connect("localhost", $Port)
        $tcp.Close()
        return $true
    }
    catch {
        return $false
    }
}

# Check Docker containers
Write-Host "`n🐳 Docker Container Status:" -ForegroundColor Cyan
$containers = @(
    "lloms-mysql",
    "lloms-redis", 
    "lloms-website",
    "lloms-pos",
    "lloms-bff",
    "lloms-product-service",
    "lloms-user-service",
    "lloms-outlet-service",
    "lloms-reporting-service"
)

foreach ($container in $containers) {
    $status = docker ps --filter "name=$container" --format "{{.Status}}" 2>$null
    if ($status) {
        Write-Host "  ✅ $container : $status" -ForegroundColor Green
    }
    else {
        Write-Host "  ❌ $container : Not running" -ForegroundColor Red
    }
}

# Check service health
Write-Host "`n🔍 Service Health Check:" -ForegroundColor Cyan

Test-ServiceHealth -ServiceName "Website Frontend" -Port 5173
Test-ServiceHealth -ServiceName "POS Frontend" -Port 5174
Test-ServiceHealth -ServiceName "BFF Service" -Port 3000
Test-ServiceHealth -ServiceName "Product Service" -Port 8087 -HealthEndpoint "/actuator/health"
Test-ServiceHealth -ServiceName "User Service" -Port 8088 -HealthEndpoint "/actuator/health"
Test-ServiceHealth -ServiceName "Outlet Service" -Port 8089 -HealthEndpoint "/actuator/health"
Test-ServiceHealth -ServiceName "Reporting Service" -Port 8090 -HealthEndpoint "/actuator/health"

# Check database connectivity
Write-Host "`n🗄️ Database Connectivity:" -ForegroundColor Cyan

# Test MySQL
try {
    $mysqlTest = docker exec lloms-mysql mysql -uroot -p -e "SELECT 1;" 2>$null
    if ($mysqlTest) {
        Write-Host "  ✅ MySQL connection successful" -ForegroundColor Green
    }
    else {
        Write-Host "  ❌ MySQL connection failed" -ForegroundColor Red
    }
}
catch {
    Write-Host "  ❌ MySQL connection failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Redis
try {
    $redisTest = docker exec lloms-redis redis-cli ping 2>$null
    if ($redisTest -eq "PONG") {
        Write-Host "  ✅ Redis connection successful" -ForegroundColor Green
    }
    else {
        Write-Host "  ❌ Redis connection failed" -ForegroundColor Red
    }
}
catch {
    Write-Host "  ❌ Redis connection failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n📊 Summary:" -ForegroundColor Cyan
$runningContainers = docker ps --format "{{.Names}}" | Measure-Object | Select-Object -ExpandProperty Count
Write-Host "  Running containers: $runningContainers" -ForegroundColor White

Write-Host "`n💡 Troubleshooting Tips:" -ForegroundColor Yellow
Write-Host "  - If containers are not running, try: docker-compose up -d" -ForegroundColor White
Write-Host "  - If ports are closed, check if services are running" -ForegroundColor White
Write-Host "  - For health check failures, check service logs: docker-compose logs [service-name]" -ForegroundColor White
Write-Host "  - To restart all services: docker-compose restart" -ForegroundColor White
