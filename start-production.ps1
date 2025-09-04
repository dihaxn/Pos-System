# LLOMS Production Startup Script
Write-Host "Starting LLOMS Production System..." -ForegroundColor Green

# Start with Docker Compose (recommended for production)
Write-Host "Starting system with Docker Compose..." -ForegroundColor Yellow
docker-compose up -d

Write-Host "System started successfully!" -ForegroundColor Green
Write-Host "POS System: http://localhost:5174" -ForegroundColor Cyan
Write-Host "User Website: http://localhost:5173" -ForegroundColor Cyan
Write-Host "BFF API: http://localhost:3000" -ForegroundColor Cyan
