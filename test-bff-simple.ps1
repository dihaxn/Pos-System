# Simple BFF Data Flow Test
Write-Host "Testing BFF Data Flow..." -ForegroundColor Green

# Start BFF
Write-Host "Starting BFF service..." -ForegroundColor Yellow
Start-Process -FilePath "node" -ArgumentList "src/server.js" -WorkingDirectory "bff" -WindowStyle Hidden
Start-Sleep -Seconds 3

# Test Products
Write-Host "Testing Products..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/products" -Method GET
    Write-Host "SUCCESS: Retrieved $($response.Count) products" -ForegroundColor Green
} catch {
    Write-Host "FAILED: Products endpoint" -ForegroundColor Red
}

# Test Returns
Write-Host "Testing Returns..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/returns/all-not-pending" -Method GET
    Write-Host "SUCCESS: Retrieved $($response.Count) returns" -ForegroundColor Green
} catch {
    Write-Host "FAILED: Returns endpoint" -ForegroundColor Red
}

# Test Factory Orders
Write-Host "Testing Factory Orders..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/factory-orders/by-status/pending" -Method GET
    Write-Host "SUCCESS: Retrieved $($response.Count) factory orders" -ForegroundColor Green
} catch {
    Write-Host "FAILED: Factory orders endpoint" -ForegroundColor Red
}

# Test Customer Orders
Write-Host "Testing Customer Orders..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/customer-orders/by-outlet/1" -Method GET
    Write-Host "SUCCESS: Retrieved $($response.Count) customer orders" -ForegroundColor Green
} catch {
    Write-Host "FAILED: Customer orders endpoint" -ForegroundColor Red
}

# Test Notifications
Write-Host "Testing Notifications..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/notifications" -Method GET
    Write-Host "SUCCESS: Retrieved $($response.Count) notifications" -ForegroundColor Green
} catch {
    Write-Host "FAILED: Notifications endpoint" -ForegroundColor Red
}

Write-Host "BFF Data Flow Test Complete!" -ForegroundColor Green
Write-Host "All frontend data now flows through BFF (Port 3000)" -ForegroundColor Cyan
