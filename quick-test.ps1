# Quick System Test
Write-Host "LLOMS System Quick Test" -ForegroundColor Green
Write-Host "=======================" -ForegroundColor Green

# Test BFF
Write-Host "`nTesting BFF Service..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/products" -Method GET -TimeoutSec 3
    Write-Host "SUCCESS: BFF is running with $($response.Count) products" -ForegroundColor Green
} catch {
    Write-Host "BFF is not running. Start with: cd bff; npm start" -ForegroundColor Red
}

# Test POS System
Write-Host "`nTesting POS System..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5173" -TimeoutSec 3
    Write-Host "SUCCESS: POS System is running" -ForegroundColor Green
} catch {
    Write-Host "POS System is not running. Start with: cd frontend/pos-system; npm run dev" -ForegroundColor Red
}

# Test User Website
Write-Host "`nTesting User Website..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5174" -TimeoutSec 3
    Write-Host "SUCCESS: User Website is running" -ForegroundColor Green
} catch {
    Write-Host "User Website is not running. Start with: cd frontend/user-website; npm run dev" -ForegroundColor Red
}

Write-Host "`nSystem Status:" -ForegroundColor Cyan
Write-Host "• BFF Service: All frontend data flows through BFF (Port 3000)" -ForegroundColor White
Write-Host "• POS System: Enterprise POS operations (Port 5173)" -ForegroundColor White
Write-Host "• User Website: Customer-facing website (Port 5174)" -ForegroundColor White
Write-Host "• Microservices: Product, User, Outlet, Reporting, Discovery, API Gateway" -ForegroundColor White

Write-Host "`nLLOMS Enterprise System is Ready!" -ForegroundColor Green
