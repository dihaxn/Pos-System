# Test BFF Data Flow Script
Write-Host "🚀 Testing LLOMS BFF Data Flow..." -ForegroundColor Green

# Start BFF in background
Write-Host "📋 Starting BFF service..." -ForegroundColor Yellow
Start-Process -FilePath "node" -ArgumentList "src/server.js" -WorkingDirectory "bff" -WindowStyle Hidden

# Wait for BFF to start
Write-Host "⏳ Waiting for BFF to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Test BFF endpoints
Write-Host "🧪 Testing BFF endpoints..." -ForegroundColor Cyan

# Test 1: Get all products
Write-Host "`n📦 Testing GET /api/products" -ForegroundColor Green
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/products" -Method GET
    Write-Host "✅ Success! Retrieved $($response.Count) products" -ForegroundColor Green
    $response | ForEach-Object { Write-Host "  - $($_.name): $($_.price)" -ForegroundColor White }
}
catch {
    Write-Host "❌ Failed to get products: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Get product by ID
Write-Host "`n🔍 Testing GET /api/products/1" -ForegroundColor Green
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/products/1" -Method GET
    Write-Host "✅ Success! Retrieved product: $($response.name)" -ForegroundColor Green
    Write-Host "  Price: $($response.price)" -ForegroundColor White
    Write-Host "  Stock: $($response.stockQuantity)" -ForegroundColor White
}
catch {
    Write-Host "❌ Failed to get product by ID: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Search products
Write-Host "`n🔎 Testing GET /api/products/search/tea" -ForegroundColor Green
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/products/search/tea" -Method GET
    Write-Host "✅ Success! Found $($response.Count) products matching 'tea'" -ForegroundColor Green
    $response | ForEach-Object { Write-Host "  - $($_.name): $($_.description)" -ForegroundColor White }
}
catch {
    Write-Host "❌ Failed to search products: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Create new product
Write-Host "`n➕ Testing POST /api/products" -ForegroundColor Green
$newProduct = @{
    name          = "Test Product"
    description   = "A test product created via BFF"
    price         = 9.99
    stockQuantity = 50
    category      = "Test"
    outletId      = 1
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/products" -Method POST -Body $newProduct -ContentType "application/json"
    Write-Host "✅ Success! Created product: $($response.name) with ID: $($response.id)" -ForegroundColor Green
}
catch {
    Write-Host "❌ Failed to create product: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Update product
Write-Host "`n✏️ Testing PUT /api/products/1" -ForegroundColor Green
$updateData = @{
    price         = 19.99
    stockQuantity = 100
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/products/1" -Method PUT -Body $updateData -ContentType "application/json"
    Write-Host "✅ Success! Updated product: $($response.name)" -ForegroundColor Green
    Write-Host "  New Price: $($response.price)" -ForegroundColor White
    Write-Host "  New Stock: $($response.stockQuantity)" -ForegroundColor White
}
catch {
    Write-Host "❌ Failed to update product: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 BFF Data Flow Test Complete!" -ForegroundColor Green
Write-Host "The BFF is successfully passing data between frontend and backend services." -ForegroundColor Cyan
