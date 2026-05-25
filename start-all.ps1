# HMS - Start All Services Script
# Run this after Config Server, Eureka, and API Gateway are already up
# Usage: .\start-all.ps1

$services = @(
    "auth-service",
    "user-service",
    "hostel-service",
    "room-service",
    "allocation-service",
    "payment-service",
    "complaint-service",
    "attendance-service",
    "visitor-service",
    "notification-service"
)

Write-Host "Starting HMS Microservices..." -ForegroundColor Cyan

foreach ($svc in $services) {
    $path = Join-Path $PSScriptRoot "backend\$svc"
    if (Test-Path $path) {
        Write-Host "Starting $svc..." -ForegroundColor Green
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$path'; mvn spring-boot:run"
        Start-Sleep -Seconds 2
    } else {
        Write-Host "Directory not found: $path" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "All services started!" -ForegroundColor Cyan
Write-Host "Eureka Dashboard: http://localhost:8761" -ForegroundColor Yellow
Write-Host "API Gateway:      http://localhost:9090" -ForegroundColor Yellow
Write-Host "Frontend:         http://localhost:3000" -ForegroundColor Yellow
