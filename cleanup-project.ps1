# LLOMS Project Cleanup Script
# This script removes unwanted files and packages

Write-Host "Starting LLOMS Project Cleanup..." -ForegroundColor Green

# Function to safely remove directory
function Remove-DirectorySafely {
    param([string]$Path)
    if (Test-Path $Path) {
        Write-Host "Removing: $Path" -ForegroundColor Yellow
        Remove-Item -Recurse -Force $Path -ErrorAction SilentlyContinue
    }
}

# Function to safely remove file
function Remove-FileSafely {
    param([string]$Path)
    if (Test-Path $Path) {
        Write-Host "Removing: $Path" -ForegroundColor Yellow
        Remove-Item -Force $Path -ErrorAction SilentlyContinue
    }
}

Write-Host "`nRemoving build artifacts..." -ForegroundColor Cyan

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

Write-Host "`nRemoving temporary files..." -ForegroundColor Cyan

# Remove log files
Get-ChildItem -Path "." -Recurse -File -Include "*.log" | Remove-Item -Force -ErrorAction SilentlyContinue

# Remove temporary files
Get-ChildItem -Path "." -Recurse -File -Include "*.tmp", "*.temp" | Remove-Item -Force -ErrorAction SilentlyContinue

# Remove backup files
Get-ChildItem -Path "." -Recurse -File -Include "*.bak", "*.backup" | Remove-Item -Force -ErrorAction SilentlyContinue

Write-Host "`nRemoving specific unwanted files..." -ForegroundColor Cyan

# Remove specific unwanted files
Remove-FileSafely "bff-demo.js"

# Remove temp backup directories
Remove-DirectorySafely "services\product-service\temp_backup"
Remove-DirectorySafely "services\user-service\logs"

Write-Host "`nCleaning up package files..." -ForegroundColor Cyan

# Remove package-lock.json files (they will be regenerated)
Get-ChildItem -Path "." -Recurse -File -Name "package-lock.json" | ForEach-Object {
    Remove-FileSafely $_
}

Write-Host "`nCleanup Summary:" -ForegroundColor Green
Write-Host "Removed Maven target directories" -ForegroundColor White
Write-Host "Removed Node.js node_modules directories" -ForegroundColor White
Write-Host "Removed dist directories" -ForegroundColor White
Write-Host "Removed log and temporary files" -ForegroundColor White
Write-Host "Removed unwanted backup files" -ForegroundColor White
Write-Host "Removed package-lock.json files" -ForegroundColor White

Write-Host "`nNext Steps:" -ForegroundColor Yellow
Write-Host "1. Run npm install in each frontend directory to reinstall dependencies" -ForegroundColor White
Write-Host "2. Run mvn clean install in each service directory to rebuild" -ForegroundColor White
Write-Host "3. Run start-all-services.ps1 to start the complete system" -ForegroundColor White

Write-Host "`nCleanup completed successfully!" -ForegroundColor Green