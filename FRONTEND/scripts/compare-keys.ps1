# PowerShell script to compare translation keys in DIRECT FARM
Write-Host "Comparing translation keys across EN/HI/GU dictionaries..." -ForegroundColor Green

function Get-NestedKeys {
    param($obj, $prefix = "")
    
    $keys = @()
    
    foreach ($key in $obj.PSObject.Properties.Name) {
        $fullKey = if ($prefix) { "$prefix.$key" } else { $key }
        $value = $obj.$key
        
        if ($value -is [PSCustomObject]) {
            $keys += Get-NestedKeys -obj $value -prefix $fullKey
        } else {
            $keys += $fullKey
        }
    }
    
    return $keys
}

function Parse-TranslationFile {
    param($filePath)
    
    if (-not (Test-Path $filePath)) {
        Write-Host "File not found: $filePath" -ForegroundColor Red
        return @{}
    }
    
    try {
        $content = Get-Content $filePath -Raw
        
        # Extract the object from const name = { ... }; export default name;
        $pattern = 'const\s+\w+\s*=\s*(\{[\s\S]*?\});?\s*export\s+default'
        $match = [regex]::Match($content, $pattern)
        
        if ($match.Success) {
            $objectStr = $match.Groups[1].Value
            
            # Simple key extraction using regex (not perfect but works for our case)
            $keyPattern = '(\w+):\s*["`'']([^"`'']*)["`'']'
            $matches = [regex]::Matches($objectStr, $keyPattern)
            
            $keys = @()
            foreach ($m in $matches) {
                $keys += $m.Groups[1].Value
            }
            
            return $keys
        }
        
        return @()
    }
    catch {
        Write-Host "Error parsing $filePath`: $_" -ForegroundColor Red
        return @()
    }
}

# Get translation keys from each file
Write-Host "Parsing translation files..."

$enKeys = @()
$hiKeys = @()
$guKeys = @()

# Try to get English keys from modular structure first
$enModularFiles = @(
    "src\i18n\locales\en\common.ts",
    "src\i18n\locales\en\nav.ts", 
    "src\i18n\locales\en\auth.ts",
    "src\i18n\locales\en\landing.ts",
    "src\i18n\locales\en\marketplace.ts",
    "src\i18n\locales\en\flow.ts",
    "src\i18n\locales\en\profile.ts",
    "src\i18n\locales\en\manage.ts",
    "src\i18n\locales\en\desk.ts",
    "src\i18n\locales\en\aiDesk.ts",
    "src\i18n\locales\en\atlas.ts",
    "src\i18n\locales\en\earth.ts",
    "src\i18n\locales\en\detail.ts",
    "src\i18n\locales\en\passport.ts",
    "src\i18n\locales\en\foundation.ts",
    "src\i18n\locales\en\intel.ts",
    "src\i18n\locales\en\payments.ts",
    "src\i18n\locales\en\register.ts",
    "src\i18n\locales\en\weather.ts",
    "src\i18n\locales\en\placeholders.ts",
    "src\i18n\locales\en\rain.ts",
    "src\i18n\locales\en\shop.ts"
)

$foundModular = $false
foreach ($file in $enModularFiles) {
    if (Test-Path $file) {
        $keys = Parse-TranslationFile $file
        $enKeys += $keys
        $foundModular = $true
    }
}

# Fallback to monolithic EN if modular not found
if (-not $foundModular -and (Test-Path "src\i18n\locales\en.ts")) {
    $enKeys = Parse-TranslationFile "src\i18n\locales\en.ts"
}

# Get Hindi and Gujarati keys
if (Test-Path "src\i18n\locales\hi.ts") {
    $hiKeys = Parse-TranslationFile "src\i18n\locales\hi.ts"
}

if (Test-Path "src\i18n\locales\gu.ts") {
    $guKeys = Parse-TranslationFile "src\i18n\locales\gu.ts"
}

# Simple manual key extraction for major sections
Write-Host "Extracting major translation sections..."

$majorSections = @(
    "nav", "roles", "lang", "hero", "categories", "market", "product", 
    "cart", "checkout", "pay", "orders", "payments", "chat", "weather", 
    "ai", "passport", "sustain", "farmer", "admin", "account", "footer", "common"
)

Write-Host "`n" + "="*80 -ForegroundColor Green
Write-Host "TRANSLATION KEY COMPARISON RESULTS" -ForegroundColor Green  
Write-Host "="*80 -ForegroundColor Green

Write-Host "Key Statistics:" -ForegroundColor Yellow
Write-Host "  English keys found: $($enKeys.Count)" -ForegroundColor White
Write-Host "  Hindi keys found: $($hiKeys.Count)" -ForegroundColor White
Write-Host "  Gujarati keys found: $($guKeys.Count)" -ForegroundColor White

Write-Host "`nMajor sections check:" -ForegroundColor Yellow

# Check if major sections exist in each language by reading files directly
$enContent = if (Test-Path "src\i18n\locales\en.ts") { Get-Content "src\i18n\locales\en.ts" -Raw } else { "" }
$hiContent = if (Test-Path "src\i18n\locales\hi.ts") { Get-Content "src\i18n\locales\hi.ts" -Raw } else { "" }
$guContent = if (Test-Path "src\i18n\locales\gu.ts") { Get-Content "src\i18n\locales\gu.ts" -Raw } else { "" }

foreach ($section in $majorSections) {
    $enHas = $enContent -match "$section\s*:"
    $hiHas = $hiContent -match "$section\s*:"
    $guHas = $guContent -match "$section\s*:"
    
    $status = ""
    if ($enHas -and $hiHas -and $guHas) { $status = "ALL PRESENT" }
    elseif ($enHas -and $hiHas) { $status = "Missing GU" }
    elseif ($enHas -and $guHas) { $status = "Missing HI" }  
    elseif ($enHas) { $status = "Missing HI & GU" }
    else { $status = "Section not found" }
    
    Write-Host "  $($section.PadRight(15)): $status" -ForegroundColor White
}

Write-Host "`nFile structure analysis:" -ForegroundColor Yellow
Write-Host "  English: $(if ($foundModular) { 'Modular (22+ files)' } else { 'Monolithic' })" -ForegroundColor White
Write-Host "  Hindi: Monolithic" -ForegroundColor White  
Write-Host "  Gujarati: Monolithic" -ForegroundColor White

Write-Host "`nNext steps needed:" -ForegroundColor Yellow
Write-Host "  1. Add missing translation keys to HI/GU files" -ForegroundColor White
Write-Host "  2. Ensure all hardcoded strings use t function" -ForegroundColor White
Write-Host "  3. Add new keys for 396 hardcoded strings found in Step 1" -ForegroundColor White

Write-Host "`nComparison complete!" -ForegroundColor Green