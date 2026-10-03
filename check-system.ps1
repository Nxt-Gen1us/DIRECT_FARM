# DIRECT FARM - System Status Checker
# Verifies that everything is properly configured

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   DIRECT FARM - System Status Check" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$allGood = $true

# Check Node.js
Write-Host "[1/8] Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    if ([version]($nodeVersion -replace 'v','') -ge [version]"18.0.0") {
        Write-Host "  [OK] Node.js $nodeVersion (OK)" -ForegroundColor Green
    } else {
        Write-Host "  [X] Node.js $nodeVersion (Need v18+)" -ForegroundColor Red
        $allGood = $false
    }
} catch {
    Write-Host "  [X] Node.js not installed" -ForegroundColor Red
    $allGood = $false
}

# Check npm
Write-Host "[2/8] Checking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "  [OK] npm $npmVersion (OK)" -ForegroundColor Green
} catch {
    Write-Host "  [X] npm not installed" -ForegroundColor Red
    $allGood = $false
}

# Check Backend dependencies
Write-Host "[3/8] Checking Backend dependencies..." -ForegroundColor Yellow
if (Test-Path "BACKEND\node_modules") {
    $packageCount = (Get-ChildItem "BACKEND\node_modules" -Directory).Count
    Write-Host "  [OK] Backend node_modules exists ($packageCount packages)" -ForegroundColor Green
} else {
    Write-Host "  [X] Backend dependencies not installed" -ForegroundColor Red
    Write-Host "    Run: cd BACKEND; npm install" -ForegroundColor Yellow
    $allGood = $false
}

# Check Frontend dependencies
Write-Host "[4/8] Checking Frontend dependencies..." -ForegroundColor Yellow
if (Test-Path "FRONTEND\node_modules") {
    $packageCount = (Get-ChildItem "FRONTEND\node_modules" -Directory).Count
    Write-Host "  [OK] Frontend node_modules exists ($packageCount packages)" -ForegroundColor Green
} else {
    Write-Host "  [X] Frontend dependencies not installed" -ForegroundColor Red
    Write-Host "    Run: cd FRONTEND; npm install" -ForegroundColor Yellow
    $allGood = $false
}

# Check Backend .env
Write-Host "[5/8] Checking Backend .env..." -ForegroundColor Yellow
if (Test-Path "BACKEND\.env") {
    $envContent = Get-Content "BACKEND\.env" -Raw
    $hasMongoUri = $envContent -match "MONGO_URI="
    $hasJwtSecret = $envContent -match "JWT_SECRET="
    $hasCorsOrigin = $envContent -match "CORS_ORIGIN="
    
    if ($hasMongoUri -and $hasJwtSecret -and $hasCorsOrigin) {
        Write-Host "  [OK] Backend .env configured" -ForegroundColor Green
        if ($envContent -match "RAZORPAY_KEY_ID=\w+") {
            Write-Host "    [OK] Razorpay configured" -ForegroundColor Green
        } else {
            Write-Host "    [i] Razorpay not configured (COD only)" -ForegroundColor Gray
        }
    } else {
        Write-Host "  [!] Backend .env incomplete" -ForegroundColor Yellow
        if (-not $hasMongoUri) { Write-Host "    Missing: MONGO_URI" -ForegroundColor Yellow }
        if (-not $hasJwtSecret) { Write-Host "    Missing: JWT_SECRET" -ForegroundColor Yellow }
        if (-not $hasCorsOrigin) { Write-Host "    Missing: CORS_ORIGIN" -ForegroundColor Yellow }
    }
} else {
    Write-Host "  [X] Backend .env not found" -ForegroundColor Red
    $allGood = $false
}

# Check Frontend .env
Write-Host "[6/8] Checking Frontend .env..." -ForegroundColor Yellow
if (Test-Path "FRONTEND\.env") {
    $envContent = Get-Content "FRONTEND\.env" -Raw
    $hasApiUrl = $envContent -match "VITE_API_URL="
    $hasWsUrl = $envContent -match "VITE_WS_URL="
    
    if ($hasApiUrl -and $hasWsUrl) {
        Write-Host "  [OK] Frontend .env configured" -ForegroundColor Green
    } else {
        Write-Host "  [!] Frontend .env incomplete" -ForegroundColor Yellow
        if (-not $hasApiUrl) { Write-Host "    Missing: VITE_API_URL" -ForegroundColor Yellow }
        if (-not $hasWsUrl) { Write-Host "    Missing: VITE_WS_URL" -ForegroundColor Yellow }
    }
} else {
    Write-Host "  [X] Frontend .env not found" -ForegroundColor Red
    $allGood = $false
}

# Check if ports are available
Write-Host "[7/8] Checking port availability..." -ForegroundColor Yellow
$port5000 = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
$port5173 = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue

if ($port5000) {
    Write-Host "  [!] Port 5000 is in use (Backend)" -ForegroundColor Yellow
    Write-Host "    You may need to stop existing backend server" -ForegroundColor Gray
} else {
    Write-Host "  [OK] Port 5000 available (Backend)" -ForegroundColor Green
}

if ($port5173) {
    Write-Host "  [!] Port 5173 is in use (Frontend)" -ForegroundColor Yellow
    Write-Host "    Vite will auto-assign new port" -ForegroundColor Gray
} else {
    Write-Host "  [OK] Port 5173 available (Frontend)" -ForegroundColor Green
}

# Check key files
Write-Host "[8/8] Checking project structure..." -ForegroundColor Yellow
$keyFiles = @(
    "BACKEND\src\server.js",
    "BACKEND\src\app.js",
    "BACKEND\package.json",
    "FRONTEND\src\main.tsx",
    "FRONTEND\package.json",
    "FRONTEND\index.html"
)

$allFilesExist = $true
foreach ($file in $keyFiles) {
    if (-not (Test-Path $file)) {
        Write-Host "  [X] Missing: $file" -ForegroundColor Red
        $allFilesExist = $false
        $allGood = $false
    }
}

if ($allFilesExist) {
    Write-Host "  [OK] All key files present" -ForegroundColor Green
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan

if ($allGood) {
    Write-Host "   [OK] System Ready!" -ForegroundColor Green
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Everything looks good! You can start the project:" -ForegroundColor White
    Write-Host ""
    Write-Host "  Option 1: Automatic start" -ForegroundColor Yellow
    Write-Host "  .\run.ps1" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  Option 2: Manual start" -ForegroundColor Yellow
    Write-Host "  Terminal 1: cd BACKEND; npm run dev" -ForegroundColor Gray
    Write-Host "  Terminal 2: cd FRONTEND; npm run dev" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Then visit: http://localhost:5173" -ForegroundColor Cyan
    Write-Host "Login: admin@directfarm.com / Admin@123" -ForegroundColor Gray
} else {
    Write-Host "   [X] Setup Incomplete" -ForegroundColor Red
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Please fix the issues above, then run:" -ForegroundColor Yellow
    Write-Host "  .\setup.ps1" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Or install dependencies manually:" -ForegroundColor Yellow
    Write-Host "  cd BACKEND; npm install" -ForegroundColor Gray
    Write-Host "  cd FRONTEND; npm install" -ForegroundColor Gray
}

Write-Host ""
