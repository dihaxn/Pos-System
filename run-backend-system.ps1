# LLOMS Backend System Startup Script
# This script builds and runs all microservices

Write-Host "🚀 Starting LLOMS Backend System..." -ForegroundColor Green

# Check if Docker is running
Write-Host "📋 Checking Docker status..." -ForegroundColor Yellow
try {
    docker version | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
}
catch {
    Write-Host "❌ Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Check if required databases are available
Write-Host "📋 Checking database availability..." -ForegroundColor Yellow

# Check PostgreSQL
try {
    docker run --rm postgres:15 psql -h host.docker.internal -U postgres -c "SELECT 1;" 2>$null
    Write-Host "✅ PostgreSQL is accessible" -ForegroundColor Green
}
catch {
    Write-Host "⚠️  PostgreSQL not accessible - will be started with Docker Compose" -ForegroundColor Yellow
}

# Check MySQL
try {
    docker run --rm mysql:8.0 mysql -h host.docker.internal -u root -e "SELECT 1;" 2>$null
    Write-Host "✅ MySQL is accessible" -ForegroundColor Green
}
catch {
    Write-Host "⚠️  MySQL not accessible - will be started with Docker Compose" -ForegroundColor Yellow
}

# Check MongoDB
try {
    docker run --rm mongo:7.0 mongo --host host.docker.internal --eval "db.runCommand('ping')" 2>$null
    Write-Host "✅ MongoDB is accessible" -ForegroundColor Green
}
catch {
    Write-Host "⚠️  MongoDB not accessible - will be started with Docker Compose" -ForegroundColor Yellow
}

# Check Redis
try {
    docker run --rm redis:7.0 redis-cli -h host.docker.internal ping 2>$null
    Write-Host "✅ Redis is accessible" -ForegroundColor Green
}
catch {
    Write-Host "⚠️  Redis not accessible - will be started with Docker Compose" -ForegroundColor Yellow
}

# Build all services
Write-Host "🔨 Building all microservices..." -ForegroundColor Yellow

$services = @(
    "discovery-service",
    "user-service", 
    "product-service",
    "outlet-service",
    "api-gateway"
)

foreach ($service in $services) {
    Write-Host "Building $service..." -ForegroundColor Cyan
    Set-Location "services\$service"
    
    try {
        mvn clean package -DskipTests
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ $service built successfully" -ForegroundColor Green
        }
        else {
            Write-Host "❌ Failed to build $service" -ForegroundColor Red
            Set-Location "../.."
            exit 1
        }
    }
    catch {
        Write-Host "❌ Error building $service`: $_" -ForegroundColor Red
        Set-Location "../.."
        exit 1
    }
    
    Set-Location "../.."
}

# Start the system using Docker Compose
Write-Host "🐳 Starting system with Docker Compose..." -ForegroundColor Yellow

try {
    docker-compose -f docker-compose.enterprise.yml up -d
    Write-Host "✅ System started successfully!" -ForegroundColor Green
}
catch {
    Write-Host "❌ Failed to start system: $_" -ForegroundColor Red
    exit 1
}

# Wait for services to be ready
Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Check service health
Write-Host "🏥 Checking service health..." -ForegroundColor Yellow

$services = @(
    @{Name = "Discovery Service"; Url = "http://localhost:8761/actuator/health" },
    @{Name = "User Service"; Url = "http://localhost:8081/actuator/health" },
    @{Name = "Product Service"; Url = "http://localhost:8087/actuator/health" },
    @{Name = "Outlet Service"; Url = "http://localhost:8082/actuator/health" },
    @{Name = "API Gateway"; Url = "http://localhost:8080/actuator/health" }
)

foreach ($service in $services) {
    try {
        $response = Invoke-RestMethod -Uri $service.Url -TimeoutSec 10
        if ($response.status -eq "UP") {
            Write-Host "✅ $($service.Name) is healthy" -ForegroundColor Green
        }
        else {
            Write-Host "⚠️  $($service.Name) is not healthy: $($response.status)" -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "❌ $($service.Name) is not responding" -ForegroundColor Red
    }
}

# Display service URLs
Write-Host "`n🌐 Service URLs:" -ForegroundColor Green
Write-Host "Eureka Dashboard: http://localhost:8761" -ForegroundColor Cyan
Write-Host "API Gateway: http://localhost:8080" -ForegroundColor Cyan
Write-Host "User Service: http://localhost:8081" -ForegroundColor Cyan
Write-Host "Product Service: http://localhost:8087" -ForegroundColor Cyan
Write-Host "Outlet Service: http://localhost:8082" -ForegroundColor Cyan

Write-Host "`n📚 API Documentation:" -ForegroundColor Green
Write-Host "User Service Swagger: http://localhost:8081/swagger-ui.html" -ForegroundColor Cyan
Write-Host "Product Service Swagger: http://localhost:8087/swagger-ui.html" -ForegroundColor Cyan
Write-Host "Outlet Service Swagger: http://localhost:8082/swagger-ui.html" -ForegroundColor Cyan

Write-Host "`n🎉 Backend system is ready!" -ForegroundColor Green
Write-Host "Use 'docker-compose -f docker-compose.enterprise.yml logs -f' to view logs" -ForegroundColor Yellow
Write-Host "Use 'docker-compose -f docker-compose.enterprise.yml down' to stop the system" -ForegroundColor Yellow
