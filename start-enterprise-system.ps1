# Little Lanka Order Management System - Enterprise Startup Script
# This script starts the entire enterprise system with proper dependency management

param(
    [string]$Environment = "dev",
    [switch]$BuildImages = $false,
    [switch]$SkipTests = $false,
    [switch]$CleanStart = $false
)

Write-Host "🏢 Starting Little Lanka Order Management System - Enterprise Edition" -ForegroundColor Green
Write-Host "Environment: $Environment" -ForegroundColor Yellow

# Function to check if a command exists
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Check prerequisites
Write-Host "`n🔍 Checking prerequisites..." -ForegroundColor Blue

$prerequisites = @(
    @{Name = "Docker"; Command = "docker" },
    @{Name = "Docker Compose"; Command = "docker-compose" },
    @{Name = "Java"; Command = "java" },
    @{Name = "Maven"; Command = "mvn" },
    @{Name = "Node.js"; Command = "node" },
    @{Name = "npm"; Command = "npm" }
)

foreach ($prereq in $prerequisites) {
    if (Test-Command $prereq.Command) {
        Write-Host "✅ $($prereq.Name) is installed" -ForegroundColor Green
    }
    else {
        Write-Host "❌ $($prereq.Name) is not installed" -ForegroundColor Red
        Write-Host "Please install $($prereq.Name) and try again." -ForegroundColor Red
        exit 1
    }
}

# Clean start if requested
if ($CleanStart) {
    Write-Host "`n🧹 Cleaning up existing containers and volumes..." -ForegroundColor Yellow
    docker-compose -f docker-compose.enterprise.yml down -v
    docker system prune -f
}

# Build images if requested
if ($BuildImages) {
    Write-Host "`n🔨 Building Docker images..." -ForegroundColor Blue
    
    # Build backend services
    $services = @("product-service", "user-service", "outlet-service", "reporting-service", "api-gateway", "discovery-service")
    
    foreach ($service in $services) {
        Write-Host "Building $service..." -ForegroundColor Yellow
        Set-Location "services/$service"
        
        if ($SkipTests) {
            mvn clean package -DskipTests
        }
        else {
            mvn clean package
        }
        
        docker build -t "lloms/$service`:latest" .
        Set-Location "../.."
    }
    
    # Build frontend applications
    Write-Host "Building frontend applications..." -ForegroundColor Yellow
    
    # POS System
    Set-Location "frontend/pos-system"
    npm install
    npm run build
    docker build -t "lloms/pos-system`:latest" .
    Set-Location "../.."
    
    # User Website
    Set-Location "frontend/user-website"
    npm install
    npm run build
    docker build -t "lloms/user-website`:latest" .
    Set-Location "../.."
}

# Start infrastructure services first
Write-Host "`n🚀 Starting infrastructure services..." -ForegroundColor Blue
docker-compose -f docker-compose.enterprise.yml up -d postgres mysql mongodb redis kafka zookeeper

# Wait for infrastructure to be ready
Write-Host "⏳ Waiting for infrastructure services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Check infrastructure health
Write-Host "`n🔍 Checking infrastructure health..." -ForegroundColor Blue

$infrastructureServices = @(
    @{Name = "PostgreSQL"; Url = "http://localhost:5432"; Port = 5432 },
    @{Name = "MySQL"; Url = "http://localhost:3306"; Port = 3306 },
    @{Name = "MongoDB"; Url = "http://localhost:27017"; Port = 27017 },
    @{Name = "Redis"; Url = "http://localhost:6379"; Port = 6379 },
    @{Name = "Kafka"; Url = "http://localhost:9092"; Port = 9092 }
)

foreach ($service in $infrastructureServices) {
    try {
        $response = Test-NetConnection -ComputerName localhost -Port $service.Port -InformationLevel Quiet
        if ($response) {
            Write-Host "✅ $($service.Name) is ready" -ForegroundColor Green
        }
        else {
            Write-Host "❌ $($service.Name) is not ready" -ForegroundColor Red
        }
    }
    catch {
        Write-Host "❌ $($service.Name) health check failed" -ForegroundColor Red
    }
}

# Start microservices
Write-Host "`n🚀 Starting microservices..." -ForegroundColor Blue
docker-compose -f docker-compose.enterprise.yml up -d eureka

# Wait for Eureka to be ready
Write-Host "⏳ Waiting for Eureka to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 20

# Start other microservices
docker-compose -f docker-compose.enterprise.yml up -d api-gateway product-service user-service outlet-service reporting-service

# Wait for services to be ready
Write-Host "⏳ Waiting for microservices to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Start frontend applications
Write-Host "`n🚀 Starting frontend applications..." -ForegroundColor Blue
docker-compose -f docker-compose.enterprise.yml up -d pos-system user-website

# Start monitoring stack
Write-Host "`n🚀 Starting monitoring stack..." -ForegroundColor Blue
docker-compose -f docker-compose.enterprise.yml up -d prometheus grafana

# Start logging stack
Write-Host "`n🚀 Starting logging stack..." -ForegroundColor Blue
docker-compose -f docker-compose.enterprise.yml up -d elasticsearch kibana logstash

# Wait for all services to be ready
Write-Host "`n⏳ Waiting for all services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Display service status
Write-Host "`n📊 Service Status:" -ForegroundColor Green
docker-compose -f docker-compose.enterprise.yml ps

# Display access URLs
Write-Host "`n🌐 Access URLs:" -ForegroundColor Green
Write-Host "POS System: http://localhost:5174" -ForegroundColor Cyan
Write-Host "User Website: http://localhost:5173" -ForegroundColor Cyan
Write-Host "API Gateway: http://localhost:8080" -ForegroundColor Cyan
Write-Host "Eureka Dashboard: http://localhost:8761" -ForegroundColor Cyan
Write-Host "Swagger UI (Product Service): http://localhost:8087/api/v1/swagger-ui.html" -ForegroundColor Cyan
Write-Host "Grafana Dashboard: http://localhost:3000 (admin/admin)" -ForegroundColor Cyan
Write-Host "Kibana Dashboard: http://localhost:5601" -ForegroundColor Cyan
Write-Host "Prometheus: http://localhost:9090" -ForegroundColor Cyan

# Display health check commands
Write-Host "`n🔍 Health Check Commands:" -ForegroundColor Green
Write-Host "Check all services: docker-compose -f docker-compose.enterprise.yml ps" -ForegroundColor Cyan
Write-Host "View logs: docker-compose -f docker-compose.enterprise.yml logs -f [service-name]" -ForegroundColor Cyan
Write-Host "Stop all services: docker-compose -f docker-compose.enterprise.yml down" -ForegroundColor Cyan

# Run health checks
Write-Host "`n🔍 Running health checks..." -ForegroundColor Blue

$healthChecks = @(
    @{Name = "POS System"; Url = "http://localhost:5174" },
    @{Name = "User Website"; Url = "http://localhost:5173" },
    @{Name = "API Gateway"; Url = "http://localhost:8080/actuator/health" },
    @{Name = "Product Service"; Url = "http://localhost:8087/api/v1/actuator/health" },
    @{Name = "Eureka"; Url = "http://localhost:8761/actuator/health" }
)

foreach ($check in $healthChecks) {
    try {
        $response = Invoke-WebRequest -Uri $check.Url -Method GET -TimeoutSec 10
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ $($check.Name) is healthy" -ForegroundColor Green
        }
        else {
            Write-Host "⚠️ $($check.Name) returned status: $($response.StatusCode)" -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "❌ $($check.Name) health check failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n🎉 Enterprise system startup completed!" -ForegroundColor Green
Write-Host "The Little Lanka Order Management System is now running in enterprise mode." -ForegroundColor Green
Write-Host "`nFor more information, see ENTERPRISE_ARCHITECTURE.md" -ForegroundColor Yellow
