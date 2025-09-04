# Production Issues Fix Script
Write-Host "🔧 Fixing Critical Production Issues..." -ForegroundColor Green

# Function to fix frontend package-lock.json
function Fix-FrontendDependencies {
    param($serviceName, $servicePath)
    
    Write-Host "Fixing $serviceName dependencies..." -ForegroundColor Yellow
    
    try {
        Push-Location $servicePath
        
        # Remove existing node_modules and package-lock.json
        if (Test-Path "node_modules") {
            Remove-Item -Recurse -Force "node_modules"
        }
        if (Test-Path "package-lock.json") {
            Remove-Item -Force "package-lock.json"
        }
        
        # Install dependencies
        $result = npm install 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "SUCCESS ${serviceName}: Dependencies fixed successfully" -ForegroundColor Green
            return $true
        } else {
            Write-Host "FAILED ${serviceName}: Failed to install dependencies" -ForegroundColor Red
            Write-Host $result -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "ERROR ${serviceName}: Error - $($_.Exception.Message)" -ForegroundColor Red
        return $false
    } finally {
        Pop-Location
    }
}

# Function to fix Java service
function Fix-JavaService {
    param($serviceName, $servicePath)
    
    Write-Host "Fixing $serviceName..." -ForegroundColor Yellow
    
    try {
        Push-Location $servicePath
        
        # Clean and compile
        $result = mvn clean compile -q 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "SUCCESS ${serviceName}: Compilation successful" -ForegroundColor Green
            return $true
        } else {
            Write-Host "FAILED ${serviceName}: Compilation failed" -ForegroundColor Red
            Write-Host $result -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "ERROR ${serviceName}: Error - $($_.Exception.Message)" -ForegroundColor Red
        return $false
    } finally {
        Pop-Location
    }
}

# Fix Frontend Services
Write-Host "`n🎨 Fixing Frontend Services..." -ForegroundColor Cyan
$frontendResults = @{}

$frontendResults["pos-system"] = Fix-FrontendDependencies "pos-system" "frontend/pos-system"
$frontendResults["user-website"] = Fix-FrontendDependencies "user-website" "frontend/user-website"
$frontendResults["bff"] = Fix-FrontendDependencies "bff" "bff"

# Fix Java Services
Write-Host "`n☕ Fixing Java Services..." -ForegroundColor Cyan
$javaResults = @{}

# Fix user-service MySQL connector first
Write-Host "Fixing user-service MySQL connector..." -ForegroundColor Yellow
$javaResults["user-service"] = Fix-JavaService "user-service" "services/user-service"

# Test other services
$javaResults["outlet-service"] = Fix-JavaService "outlet-service" "services/outlet-service"
$javaResults["api-gateway"] = Fix-JavaService "api-gateway" "services/api-gateway"
$javaResults["discovery-service"] = Fix-JavaService "discovery-service" "services/discovery-service"
$javaResults["reporting-service"] = Fix-JavaService "reporting-service" "services/reporting-service"

# Summary
Write-Host "`n📊 FIX SUMMARY" -ForegroundColor Magenta
Write-Host "=" * 30 -ForegroundColor Magenta

Write-Host "`nFrontend Services:" -ForegroundColor Cyan
foreach ($service in $frontendResults.Keys) {
    $status = if ($frontendResults[$service]) { "✅ FIXED" } else { "❌ FAILED" }
    $color = if ($frontendResults[$service]) { "Green" } else { "Red" }
    Write-Host "  $service`: $status" -ForegroundColor $color
}

Write-Host "`nJava Services:" -ForegroundColor Cyan
foreach ($service in $javaResults.Keys) {
    $status = if ($javaResults[$service]) { "✅ WORKING" } else { "❌ FAILED" }
    $color = if ($javaResults[$service]) { "Green" } else { "Red" }
    Write-Host "  $service`: $status" -ForegroundColor $color
}

# Overall status
$totalFixed = ($frontendResults.Values | Where-Object { $_ -eq $true }).Count + ($javaResults.Values | Where-Object { $_ -eq $true }).Count
$totalServices = $frontendResults.Count + $javaResults.Count

Write-Host "`n🎯 OVERALL STATUS" -ForegroundColor Magenta
Write-Host "Fixed: $totalFixed/$totalServices services" -ForegroundColor White

if ($totalFixed -eq $totalServices) {
    Write-Host "`n🎉 ALL CRITICAL ISSUES FIXED! Project is production-ready!" -ForegroundColor Green
} else {
    Write-Host "`n⚠️ Some issues remain. Check the failed services above." -ForegroundColor Yellow
}

Write-Host "`nFix completed at $(Get-Date)" -ForegroundColor Gray
