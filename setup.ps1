# DIRECT FARM - Automated Setup Script for Windows PowerShell
# This script will install all dependencies and set up the project

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   DIRECT FARM - Automated Setup" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js installation
Write-Host "[1/6] Checking prerequisites..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found! Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

try {
    $npmVersion = npm --version
    Write-Host "✓ npm installed: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ npm not found!" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Install Backend Dependencies
Write-Host "[2/6] Installing Backend dependencies..." -ForegroundColor Yellow
Set-Location -Path "BACKEND"
if (Test-Path "node_modules") {
    Write-Host "  → node_modules already exists, skipping..." -ForegroundColor Gray
} else {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Backend installation failed!" -ForegroundColor Red
        exit 1
    }
    Write-Host "✓ Backend dependencies installed" -ForegroundColor Green
}
Set-Location -Path ".."
Write-Host ""

# Install Frontend Dependencies
Write-Host "[3/6] Installing Frontend dependencies..." -ForegroundColor Yellow
Set-Location -Path "FRONTEND"
if (Test-Path "node_modules") {
    Write-Host "  → node_modules already exists, skipping..." -ForegroundColor Gray
} else {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Frontend installation failed!" -ForegroundColor Red
        exit 1
    }
    Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green
}
Set-Location -Path ".."
Write-Host ""

# Check .env files
Write-Host "[4/6] Checking environment files..." -ForegroundColor Yellow
if (Test-Path "BACKEND\.env") {
    Write-Host "✓ Backend .env exists" -ForegroundColor Green
} else {
    Write-Host "✗ Backend .env not found!" -ForegroundColor Red
    Write-Host "  Please create BACKEND\.env file" -ForegroundColor Red
    exit 1
}

if (Test-Path "FRONTEND\.env") {
    Write-Host "✓ Frontend .env exists" -ForegroundColor Green
} else {
    Write-Host "✗ Frontend .env not found!" -ForegroundColor Red
    Write-Host "  Please create FRONTEND\.env file" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Seed Database
Write-Host "[5/6] Seeding database..." -ForegroundColor Yellow
Write-Host "  This will create initial data (admin user, sample products, etc.)" -ForegroundColor Gray
$seed = Read-Host "  Do you want to seed the database? (y/n)"
if ($seed -eq "y" -or $seed -eq "Y") {
    Set-Location -Path "BACKEND"
    npm run seed
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Database seeded successfully" -ForegroundColor Green
    } else {
        Write-Host "✗ Database seeding failed (you can run 'npm run seed' manually later)" -ForegroundColor Yellow
    }
    Set-Location -Path ".."
} else {
    Write-Host "  → Skipping database seed" -ForegroundColor Gray
}
Write-Host ""

# Summary
Write-Host "[6/6] Setup Summary" -ForegroundColor Yellow
Write-Host "✓ All dependencies installed" -ForegroundColor Green
Write-Host "✓ Environment files configured" -ForegroundColor Green
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   Setup Complete! 🎉" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Start Backend Server:" -ForegroundColor White
Write-Host "   cd BACKEND" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Start Frontend Server (in new terminal):" -ForegroundColor White
Write-Host "   cd FRONTEND" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Access Application:" -ForegroundColor White
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor Gray
Write-Host "   Backend API: http://localhost:5000" -ForegroundColor Gray
Write-Host "   API Docs: http://localhost:5000/api-docs" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Login with Admin Account:" -ForegroundColor White
Write-Host "   Email: admin@directfarm.com" -ForegroundColor Gray
Write-Host "   Password: Admin@123" -ForegroundColor Gray
Write-Host ""
Write-Host "Or run: .\run.ps1 (to start both servers automatically)" -ForegroundColor Cyan
Write-Host ""
