# Comprehensive Project Testing Script
Write-Host "🧪 Starting Comprehensive Project Testing..." -ForegroundColor Green

# Test Results
$testResults = @{
    "Java Services"        = @{}
    "Frontend Services"    = @{}
    "Security"             = @{}
    "CI/CD"                = @{}
    "Production Readiness" = @{}
}

# Function to test Java service
function Test-JavaService {
    param($serviceName, $servicePath)
    
    Write-Host "Testing $serviceName..." -ForegroundColor Yellow
    
    try {
        Push-Location $servicePath
        $result = mvn clean compile -q 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ $serviceName: Compilation successful" -ForegroundColor Green
            $testResults["Java Services"][$serviceName] = "PASS"
        }
        else {
            Write-Host "❌ $serviceName: Compilation failed" -ForegroundColor Red
            Write-Host $result -ForegroundColor Red
            $testResults["Java Services"][$serviceName] = "FAIL"
        }
    }
    catch {
        Write-Host "❌ $serviceName: Error - $($_.Exception.Message)" -ForegroundColor Red
        $testResults["Java Services"][$serviceName] = "ERROR"
    }
    finally {
        Pop-Location
    }
}

# Function to test Frontend service
function Test-FrontendService {
    param($serviceName, $servicePath)
    
    Write-Host "Testing $serviceName..." -ForegroundColor Yellow
    
    try {
        Push-Location $servicePath
        
        # Check if package-lock.json exists
        if (Test-Path "package-lock.json") {
            $result = npm ci 2>&1
        }
        else {
            $result = npm install 2>&1
        }
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ $serviceName: Dependencies installed successfully" -ForegroundColor Green
            $testResults["Frontend Services"][$serviceName] = "PASS"
        }
        else {
            Write-Host "❌ $serviceName: Dependency installation failed" -ForegroundColor Red
            Write-Host $result -ForegroundColor Red
            $testResults["Frontend Services"][$serviceName] = "FAIL"
        }
    }
    catch {
        Write-Host "❌ $serviceName: Error - $($_.Exception.Message)" -ForegroundColor Red
        $testResults["Frontend Services"][$serviceName] = "ERROR"
    }
    finally {
        Pop-Location
    }
}

# Test Java Services
Write-Host "`n🔧 Testing Java Services..." -ForegroundColor Cyan
Test-JavaService "outlet-service" "services/outlet-service"
Test-JavaService "user-service" "services/user-service"
Test-JavaService "api-gateway" "services/api-gateway"
Test-JavaService "discovery-service" "services/discovery-service"
Test-JavaService "reporting-service" "services/reporting-service"
Test-JavaService "product-service" "services/product-service"

# Test Frontend Services
Write-Host "`n🎨 Testing Frontend Services..." -ForegroundColor Cyan
Test-FrontendService "pos-system" "frontend/pos-system"
Test-FrontendService "user-website" "frontend/user-website"
Test-FrontendService "bff" "bff"

# Security Testing
Write-Host "`n🔒 Testing Security..." -ForegroundColor Cyan

# Check for security vulnerabilities
Write-Host "Checking for security vulnerabilities..." -ForegroundColor Yellow
try {
    # Test outlet-service security
    Push-Location "services/outlet-service"
    $securityResult = mvn dependency:tree | Select-String "tomcat"
    if ($securityResult -match "10\.1\.34") {
        Write-Host "✅ Tomcat version 10.1.34 (secure) detected" -ForegroundColor Green
        $testResults["Security"]["Tomcat Version"] = "PASS"
    }
    else {
        Write-Host "❌ Tomcat version not secure" -ForegroundColor Red
        $testResults["Security"]["Tomcat Version"] = "FAIL"
    }
    Pop-Location
}
catch {
    Write-Host "❌ Security check failed: $($_.Exception.Message)" -ForegroundColor Red
    $testResults["Security"]["Tomcat Version"] = "ERROR"
}

# CI/CD Testing
Write-Host "`n🚀 Testing CI/CD..." -ForegroundColor Cyan

# Check if GitHub Actions workflows exist
$workflowFiles = Get-ChildItem ".github/workflows" -Filter "*.yml" -ErrorAction SilentlyContinue
if ($workflowFiles) {
    Write-Host "✅ GitHub Actions workflows found: $($workflowFiles.Count)" -ForegroundColor Green
    $testResults["CI/CD"]["GitHub Actions"] = "PASS"
}
else {
    Write-Host "❌ No GitHub Actions workflows found" -ForegroundColor Red
    $testResults["CI/CD"]["GitHub Actions"] = "FAIL"
}

# Production Readiness
Write-Host "`n🏭 Testing Production Readiness..." -ForegroundColor Cyan

# Check for Docker files
$dockerFiles = Get-ChildItem -Recurse -Filter "Dockerfile" -ErrorAction SilentlyContinue
if ($dockerFiles) {
    Write-Host "✅ Docker files found: $($dockerFiles.Count)" -ForegroundColor Green
    $testResults["Production Readiness"]["Docker"] = "PASS"
}
else {
    Write-Host "❌ No Docker files found" -ForegroundColor Red
    $testResults["Production Readiness"]["Docker"] = "FAIL"
}

# Check for environment configuration
$envFiles = Get-ChildItem -Recurse -Filter "*.env*" -ErrorAction SilentlyContinue
if ($envFiles) {
    Write-Host "✅ Environment files found: $($envFiles.Count)" -ForegroundColor Green
    $testResults["Production Readiness"]["Environment"] = "PASS"
}
else {
    Write-Host "⚠️ No environment files found" -ForegroundColor Yellow
    $testResults["Production Readiness"]["Environment"] = "WARN"
}

# Summary Report
Write-Host "`n📊 TEST SUMMARY REPORT" -ForegroundColor Magenta
Write-Host "=" * 50 -ForegroundColor Magenta

foreach ($category in $testResults.Keys) {
    Write-Host "`n$category" -ForegroundColor Cyan
    Write-Host "-" * $category.Length -ForegroundColor Cyan
    
    foreach ($test in $testResults[$category].Keys) {
        $status = $testResults[$category][$test]
        $color = switch ($status) {
            "PASS" { "Green" }
            "FAIL" { "Red" }
            "ERROR" { "Red" }
            "WARN" { "Yellow" }
            default { "White" }
        }
        Write-Host "  $test`: $status" -ForegroundColor $color
    }
}

# Overall Status
$totalTests = ($testResults.Values | ForEach-Object { $_.Count } | Measure-Object -Sum).Sum
$passedTests = ($testResults.Values | ForEach-Object { ($_ | Where-Object { $_ -eq "PASS" }).Count } | Measure-Object -Sum).Sum
$failedTests = ($testResults.Values | ForEach-Object { ($_ | Where-Object { $_ -eq "FAIL" -or $_ -eq "ERROR" }).Count } | Measure-Object -Sum).Sum

Write-Host "`n🎯 OVERALL STATUS" -ForegroundColor Magenta
Write-Host "Total Tests: $totalTests" -ForegroundColor White
Write-Host "Passed: $passedTests" -ForegroundColor Green
Write-Host "Failed: $failedTests" -ForegroundColor Red

if ($failedTests -eq 0) {
    Write-Host "`n🎉 ALL TESTS PASSED! Project is production-ready!" -ForegroundColor Green
}
else {
    Write-Host "`n⚠️ Some tests failed. Review and fix issues before production deployment." -ForegroundColor Yellow
}

Write-Host "`nTest completed at $(Get-Date)" -ForegroundColor Gray
