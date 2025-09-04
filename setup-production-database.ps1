# LLOMS Production Database Setup Script
# This script sets up the production database and makes the system production-ready

Write-Host "Setting up LLOMS Production Database..." -ForegroundColor Green

# Check if Docker is running
Write-Host "Checking Docker status..." -ForegroundColor Yellow
try {
    docker version | Out-Null
    Write-Host "Docker is running" -ForegroundColor Green
}
catch {
    Write-Host "Docker is not running. Starting Docker Desktop..." -ForegroundColor Yellow
    Start-Process "Docker Desktop" -WindowStyle Hidden
    Start-Sleep -Seconds 30
}

# Create production environment file
Write-Host "Creating production environment configuration..." -ForegroundColor Yellow

$productionEnv = @"
# LLOMS Production Environment Configuration

# Database Configuration
MYSQL_ROOT_PASSWORD=lloms_prod_password_2024
MYSQL_DATABASE=lloms_production
MYSQL_USER=lloms_user
MYSQL_PASSWORD=lloms_user_password_2024

# Redis Configuration
REDIS_PASSWORD=lloms_redis_password_2024

# JWT Configuration
JWT_SECRET=lloms_jwt_secret_key_2024_production_secure
JWT_EXPIRATION=86400

# Service Ports
DISCOVERY_SERVICE_PORT=8761
API_GATEWAY_PORT=8080
USER_SERVICE_PORT=8088
PRODUCT_SERVICE_PORT=8087
OUTLET_SERVICE_PORT=8089
REPORTING_SERVICE_PORT=8090
BFF_PORT=3000
POS_FRONTEND_PORT=5174
USER_WEBSITE_PORT=5173

# Database URLs
USER_SERVICE_DB_URL=jdbc:mysql://mysql:3306/userDb?useSSL=false&allowPublicKeyRetrieval=true
PRODUCT_SERVICE_DB_URL=jdbc:mysql://mysql:3306/productDb?useSSL=false&allowPublicKeyRetrieval=true
OUTLET_SERVICE_DB_URL=jdbc:mysql://mysql:3306/outletDb?useSSL=false&allowPublicKeyRetrieval=true
REPORTING_SERVICE_DB_URL=jdbc:mysql://mysql:3306/reportingDb?useSSL=false&allowPublicKeyRetrieval=true

# Redis URL
REDIS_URL=redis://redis:6379

# Production Settings
SPRING_PROFILES_ACTIVE=production
NODE_ENV=production
"@

$productionEnv | Out-File -FilePath ".env.production" -Encoding UTF8

# Create production docker-compose file
Write-Host "Creating production Docker Compose configuration..." -ForegroundColor Yellow

$productionDockerCompose = @"
version: '3.8'

services:
  # MySQL Database
  mysql:
    image: mysql:8.0
    container_name: lloms-mysql-prod
    environment:
      MYSQL_ROOT_PASSWORD: lloms_prod_password_2024
      MYSQL_DATABASE: lloms_production
      MYSQL_USER: lloms_user
      MYSQL_PASSWORD: lloms_user_password_2024
    ports:
      - "3306:3306"
    volumes:
      - mysql_prod_data:/var/lib/mysql
      - ./mysql/init:/docker-entrypoint-initdb.d
    networks:
      - lloms-prod-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u", "root", "-p$$MYSQL_ROOT_PASSWORD"]
      timeout: 20s
      retries: 10
      interval: 30s

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: lloms-redis-prod
    command: redis-server --requirepass lloms_redis_password_2024
    ports:
      - "6379:6379"
    volumes:
      - redis_prod_data:/data
    networks:
      - lloms-prod-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
      timeout: 20s
      retries: 10

  # Discovery Service
  discovery-service:
    build:
      context: ./services/discovery-service
      dockerfile: Dockerfile
    container_name: lloms-discovery-prod
    ports:
      - "8761:8761"
    networks:
      - lloms-prod-network
    depends_on:
      mysql:
        condition: service_healthy
    restart: unless-stopped
    environment:
      - SPRING_PROFILES_ACTIVE=production
      - EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://discovery-service:8761/eureka/

  # User Service
  user-service:
    build:
      context: ./services/user-service
      dockerfile: Dockerfile
    container_name: lloms-user-prod
    ports:
      - "8088:8088"
    networks:
      - lloms-prod-network
    depends_on:
      mysql:
        condition: service_healthy
      discovery-service:
        condition: service_started
    restart: unless-stopped
    environment:
      - SPRING_PROFILES_ACTIVE=production
      - SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/userDb?useSSL=false&allowPublicKeyRetrieval=true
      - SPRING_DATASOURCE_USERNAME=root
      - SPRING_DATASOURCE_PASSWORD=lloms_prod_password_2024
      - EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://discovery-service:8761/eureka/

  # Product Service
  product-service:
    build:
      context: ./services/product-service
      dockerfile: Dockerfile
    container_name: lloms-product-prod
    ports:
      - "8087:8087"
    networks:
      - lloms-prod-network
    depends_on:
      mysql:
        condition: service_healthy
      discovery-service:
        condition: service_started
    restart: unless-stopped
    environment:
      - SPRING_PROFILES_ACTIVE=production
      - SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/productDb?useSSL=false&allowPublicKeyRetrieval=true
      - SPRING_DATASOURCE_USERNAME=root
      - SPRING_DATASOURCE_PASSWORD=lloms_prod_password_2024
      - EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://discovery-service:8761/eureka/

  # Outlet Service
  outlet-service:
    build:
      context: ./services/outlet-service
      dockerfile: Dockerfile
    container_name: lloms-outlet-prod
    ports:
      - "8089:8089"
    networks:
      - lloms-prod-network
    depends_on:
      mysql:
        condition: service_healthy
      discovery-service:
        condition: service_started
    restart: unless-stopped
    environment:
      - SPRING_PROFILES_ACTIVE=production
      - SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/outletDb?useSSL=false&allowPublicKeyRetrieval=true
      - SPRING_DATASOURCE_USERNAME=root
      - SPRING_DATASOURCE_PASSWORD=lloms_prod_password_2024
      - EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://discovery-service:8761/eureka/

  # Reporting Service
  reporting-service:
    build:
      context: ./services/reporting-service
      dockerfile: Dockerfile
    container_name: lloms-reporting-prod
    ports:
      - "8090:8090"
    networks:
      - lloms-prod-network
    depends_on:
      mysql:
        condition: service_healthy
      discovery-service:
        condition: service_started
    restart: unless-stopped
    environment:
      - SPRING_PROFILES_ACTIVE=production
      - SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/reportingDb?useSSL=false&allowPublicKeyRetrieval=true
      - SPRING_DATASOURCE_USERNAME=root
      - SPRING_DATASOURCE_PASSWORD=lloms_prod_password_2024
      - EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://discovery-service:8761/eureka/

  # API Gateway
  api-gateway:
    build:
      context: ./services/api-gateway
      dockerfile: Dockerfile
    container_name: lloms-gateway-prod
    ports:
      - "8080:8080"
    networks:
      - lloms-prod-network
    depends_on:
      discovery-service:
        condition: service_started
    restart: unless-stopped
    environment:
      - SPRING_PROFILES_ACTIVE=production
      - EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://discovery-service:8761/eureka/

  # BFF Service
  bff:
    build:
      context: ./bff
      dockerfile: Dockerfile
    container_name: lloms-bff-prod
    ports:
      - "3000:3000"
    networks:
      - lloms-prod-network
    depends_on:
      - api-gateway
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - JWT_SECRET=lloms_jwt_secret_key_2024_production_secure
      - PRODUCT_SERVICE_BASE_URL=http://product-service:8087
      - USER_SERVICE_BASE_URL=http://user-service:8088
      - OUTLET_SERVICE_BASE_URL=http://outlet-service:8089
      - REPORTING_SERVICE_BASE_URL=http://reporting-service:8090

  # POS Frontend
  frontend-pos:
    build:
      context: ./frontend/pos-system
      dockerfile: Dockerfile
    container_name: lloms-pos-prod
    ports:
      - "5174:80"
    networks:
      - lloms-prod-network
    depends_on:
      - bff
    restart: unless-stopped
    environment:
      - NODE_ENV=production

  # User Website
  frontend-website:
    build:
      context: ./frontend/user-website
      dockerfile: Dockerfile
    container_name: lloms-website-prod
    ports:
      - "5173:80"
    networks:
      - lloms-prod-network
    depends_on:
      - bff
    restart: unless-stopped
    environment:
      - NODE_ENV=production

volumes:
  mysql_prod_data:
  redis_prod_data:

networks:
  lloms-prod-network:
    driver: bridge
"@

$productionDockerCompose | Out-File -FilePath "docker-compose.production.yml" -Encoding UTF8

# Create database initialization script
Write-Host "Creating database initialization script..." -ForegroundColor Yellow

$dbInitScript = @"
-- LLOMS Production Database Initialization
-- This script creates all necessary databases and tables

-- Create databases
CREATE DATABASE IF NOT EXISTS userDb;
CREATE DATABASE IF NOT EXISTS productDb;
CREATE DATABASE IF NOT EXISTS outletDb;
CREATE DATABASE IF NOT EXISTS reportingDb;

-- Use userDb
USE userDb;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    role ENUM('OWNER', 'MANAGER', 'CASHIER', 'CUSTOMER') DEFAULT 'CUSTOMER',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default owner user
INSERT IGNORE INTO users (username, email, password, first_name, last_name, role) 
VALUES ('owner', 'owner@lloms.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'System', 'Owner', 'OWNER');

-- Use productDb
USE productDb;

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100),
    stock_quantity INT DEFAULT 0,
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Use outletDb
USE outletDb;

-- Create outlets table
CREATE TABLE IF NOT EXISTS outlets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    manager_id BIGINT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Use reportingDb
USE reportingDb;

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    report_type VARCHAR(100) NOT NULL,
    report_data JSON,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT
);
"@

# Create mysql init directory
New-Item -ItemType Directory -Path "mysql\init" -Force | Out-Null
$dbInitScript | Out-File -FilePath "mysql\init\01-init-databases.sql" -Encoding UTF8

Write-Host "`nProduction database setup completed!" -ForegroundColor Green
Write-Host "`nTo start the production system:" -ForegroundColor Yellow
Write-Host "1. Run: docker-compose -f docker-compose.production.yml up -d" -ForegroundColor White
Write-Host "2. Wait for all services to be healthy" -ForegroundColor White
Write-Host "3. Access the applications:" -ForegroundColor White
Write-Host "   - POS System: http://localhost:5174" -ForegroundColor Cyan
Write-Host "   - User Website: http://localhost:5173" -ForegroundColor Cyan
Write-Host "   - API Gateway: http://localhost:8080" -ForegroundColor Cyan
Write-Host "   - Discovery Service: http://localhost:8761" -ForegroundColor Cyan

Write-Host "`nDefault Production Credentials:" -ForegroundColor Yellow
Write-Host "Username: owner" -ForegroundColor White
Write-Host "Password: owner123" -ForegroundColor White
Write-Host "Role: OWNER (Full permissions)" -ForegroundColor White
