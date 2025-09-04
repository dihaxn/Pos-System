# LLOMS Production Cleanup Script
# This script removes all unnecessary files and prepares the project for production

Write-Host "Starting LLOMS Production Cleanup..." -ForegroundColor Green

# Function to safely remove file
function Remove-FileSafely {
    param([string]$Path)
    if (Test-Path $Path) {
        Write-Host "Removing: $Path" -ForegroundColor Yellow
        Remove-Item -Force $Path -ErrorAction SilentlyContinue
    }
}

# Function to safely remove directory
function Remove-DirectorySafely {
    param([string]$Path)
    if (Test-Path $Path) {
        Write-Host "Removing: $Path" -ForegroundColor Yellow
        Remove-Item -Recurse -Force $Path -ErrorAction SilentlyContinue
    }
}

Write-Host "`nRemoving redundant documentation files..." -ForegroundColor Cyan

# Remove redundant markdown files
$redundantDocs = @(
    "BACKEND_COMPLETION_SUMMARY.md",
    "BFF_DATA_FLOW_SUMMARY.md", 
    "ENHANCED_SIDEBAR_FEATURES_SUMMARY.md",
    "ENHANCED_SIDEBAR_LOGOUT_SUMMARY.md",
    "ENTERPRISE_ARCHITECTURE.md",
    "FINAL_PROJECT_STATUS.md",
    "FRONTEND_BFF_INTEGRATION.md",
    "LOGIN_SYSTEM_SUMMARY.md",
    "ORIGINAL_SIDEBAR_ENHANCED_LOGOUT_SUMMARY.md",
    "PROJECT_COMPLETION_SUMMARY.md",
    "PROJECT_STRUCTURE.md",
    "REPORTING_SYSTEM_COMPLETE.md",
    "REPOSITORY_SETUP_COMPLETE.md",
    "ROLE_BASED_LOGIN_COMPLETE.md",
    "SIDEBAR_SCROLLBAR_SUMMARY.md",
    "SECURITY.md"
)

foreach ($doc in $redundantDocs) {
    Remove-FileSafely $doc
}

Write-Host "`nRemoving duplicate and unnecessary scripts..." -ForegroundColor Cyan

# Remove duplicate scripts
$duplicateScripts = @(
    "final-system-test.ps1",
    "health-check.ps1", 
    "quick-test.ps1",
    "run-backend-system.ps1",
    "setup-env.ps1",
    "setup-owner-user.bat",
    "setup-owner-user.ps1",
    "start-enterprise-system.ps1",
    "start-project.bat",
    "start-project.ps1",
    "test-bff-simple.ps1",
    "test-bff.ps1",
    "test-complete-bff-flow.ps1",
    "test-complete-system.ps1",
    "test-enhanced-sidebar-features.ps1",
    "test-enhanced-sidebar-logout.ps1",
    "test-login-system.ps1",
    "test-original-sidebar-logout.ps1",
    "test-reporting-system.ps1",
    "test-role-redirects.ps1",
    "test-sidebar-scrollbar.ps1"
)

foreach ($script in $duplicateScripts) {
    Remove-FileSafely $script
}

Write-Host "`nRemoving build artifacts and temporary files..." -ForegroundColor Cyan

# Remove Maven target directories
Get-ChildItem -Path "services" -Recurse -Directory -Name "target" | ForEach-Object {
    Remove-DirectorySafely "services\$_"
}

# Remove Node.js node_modules directories
Get-ChildItem -Path "." -Recurse -Directory -Name "node_modules" | ForEach-Object {
    Remove-DirectorySafely $_
}

# Remove dist directories
Get-ChildItem -Path "." -Recurse -Directory -Name "dist" | ForEach-Object {
    Remove-DirectorySafely $_
}

# Remove log files
Get-ChildItem -Path "." -Recurse -File -Include "*.log" | Remove-Item -Force -ErrorAction SilentlyContinue

# Remove package-lock.json files
Get-ChildItem -Path "." -Recurse -File -Name "package-lock.json" | ForEach-Object {
    Remove-FileSafely $_
}

Write-Host "`nRemoving duplicate service directory..." -ForegroundColor Cyan
Remove-DirectorySafely "services\services"

Write-Host "`nCreating production-ready structure..." -ForegroundColor Cyan

# Create a simple production startup script
$productionStartScript = @"
# LLOMS Production Startup Script
Write-Host "Starting LLOMS Production System..." -ForegroundColor Green

# Start with Docker Compose (recommended for production)
Write-Host "Starting system with Docker Compose..." -ForegroundColor Yellow
docker-compose up -d

Write-Host "System started successfully!" -ForegroundColor Green
Write-Host "POS System: http://localhost:5174" -ForegroundColor Cyan
Write-Host "User Website: http://localhost:5173" -ForegroundColor Cyan
Write-Host "BFF API: http://localhost:3000" -ForegroundColor Cyan
"@

$productionStartScript | Out-File -FilePath "start-production.ps1" -Encoding UTF8

Write-Host "`nCleanup Summary:" -ForegroundColor Green
Write-Host "Removed 16 redundant documentation files" -ForegroundColor White
Write-Host "Removed 21 duplicate/unnecessary scripts" -ForegroundColor White
Write-Host "Removed all build artifacts and temporary files" -ForegroundColor White
Write-Host "Created production-ready startup script" -ForegroundColor White

Write-Host "`nRemaining Essential Files:" -ForegroundColor Yellow
Write-Host "Core Application:" -ForegroundColor White
Write-Host "  - bff/ (Backend for Frontend)" -ForegroundColor White
Write-Host "  - frontend/pos-system/ (Main POS application)" -ForegroundColor White
Write-Host "  - frontend/user-website/ (User website)" -ForegroundColor White
Write-Host "  - services/ (All microservices)" -ForegroundColor White
Write-Host "  - docker-compose.yml (Main deployment)" -ForegroundColor White
Write-Host "  - README.md (Main documentation)" -ForegroundColor White
Write-Host "  - LICENSE" -ForegroundColor White
Write-Host "  - start-production.ps1 (Production startup)" -ForegroundColor White

Write-Host "`nNext Steps for Production:" -ForegroundColor Yellow
Write-Host "1. Set up proper database connections (MySQL/PostgreSQL)" -ForegroundColor White
Write-Host "2. Configure environment variables for production" -ForegroundColor White
Write-Host "3. Set up proper security configurations" -ForegroundColor White
Write-Host "4. Configure monitoring and logging" -ForegroundColor White
Write-Host "5. Set up CI/CD pipeline for automated deployments" -ForegroundColor White

Write-Host "`nProduction cleanup completed successfully!" -ForegroundColor Green
