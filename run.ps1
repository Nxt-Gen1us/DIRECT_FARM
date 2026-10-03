# DIRECT FARM - Run Script for Windows PowerShell
# This script starts both Backend and Frontend servers

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   DIRECT FARM - Starting Servers" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check if node_modules exist
if (-not (Test-Path "BACKEND\node_modules")) {
    Write-Host "✗ Backend dependencies not installed!" -ForegroundColor Red
    Write-Host "  Please run: .\setup.ps1" -ForegroundColor Yellow
    exit 1
}

if (-not (Test-Path "FRONTEND\node_modules")) {
    Write-Host "✗ Frontend dependencies not installed!" -ForegroundColor Red
    Write-Host "  Please run: .\setup.ps1" -ForegroundColor Yellow
    exit 1
}

Write-Host "Starting servers..." -ForegroundColor Yellow
Write-Host ""

# Start Backend Server in new window
Write-Host "[1/2] Starting Backend Server (port 5000)..." -ForegroundColor Yellow
$backendPath = Join-Path $PSScriptRoot "BACKEND"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host 'DIRECT FARM - Backend Server' -ForegroundColor Cyan; Write-Host ''; npm run dev"
Write-Host "✓ Backend server starting in new window" -ForegroundColor Green
Write-Host ""

# Wait for backend to start
Write-Host "Waiting for backend to initialize..." -ForegroundColor Gray
Start-Sleep -Seconds 5

# Start Frontend Server in new window
Write-Host "[2/2] Starting Frontend Server (port 5173)..." -ForegroundColor Yellow
$frontendPath = Join-Path $PSScriptRoot "FRONTEND"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host 'DIRECT FARM - Frontend Server' -ForegroundColor Cyan; Write-Host ''; npm run dev"
Write-Host "✓ Frontend server starting in new window" -ForegroundColor Green
Write-Host ""

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   Servers Started! 🚀" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Access Points:" -ForegroundColor Yellow
Write-Host "  Frontend:  http://localhost:5173" -ForegroundColor White
Write-Host "  Backend:   http://localhost:5000" -ForegroundColor White
Write-Host "  API Docs:  http://localhost:5000/api-docs" -ForegroundColor White
Write-Host ""
Write-Host "Test Credentials:" -ForegroundColor Yellow
Write-Host "  Admin:     admin@directfarm.com / Admin@123" -ForegroundColor White
Write-Host ""
Write-Host "Note: Both servers are running in separate windows." -ForegroundColor Gray
Write-Host "      Press Ctrl+C in each window to stop them." -ForegroundColor Gray
Write-Host ""

# Wait a moment then open browser
Start-Sleep -Seconds 8
Write-Host "Opening browser..." -ForegroundColor Gray
Start-Process "http://localhost:5173"
