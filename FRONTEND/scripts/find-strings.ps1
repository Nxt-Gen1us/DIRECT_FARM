# PowerShell script to find hardcoded strings in DIRECT FARM frontend
Write-Host "Scanning DIRECT FARM frontend for hardcoded strings..." -ForegroundColor Green

$srcPath = "src"
$findings = @()

# Common hardcoded strings to look for
$commonStrings = @(
    "Loading", "Error", "Success", "Failed", "Pending", "Delivered", 
    "Cancel", "Save", "Delete", "Edit", "Add", "Remove", "Update", 
    "Create", "Submit", "Continue", "Back", "Next", "Previous",
    "Home", "Shop", "Products", "Cart", "Profile", "Dashboard", 
    "Orders", "Settings", "Login", "Register", "Logout", "Search",
    "Add to Cart", "Buy Now", "View Details", "Show more", "Show less",
    "See all", "Learn more", "Get started", "Sign up", "Log in", 
    "Log out", "Welcome", "Hello", "Thank you", "Please", "Sorry",
    "Warning", "Info", "Confirm", "OK", "Close", "Open", "Filter",
    "Sort", "All", "None", "Select", "Choose", "Upload", "Download",
    "Send", "Receive", "Buy", "Sell", "Order", "Checkout", "Payment",
    "Total", "Subtotal", "Delivery", "Address", "Name", "Email", 
    "Phone", "Message", "Description", "Title", "Category", "Price",
    "Quantity", "Stock", "Available", "Out of stock", "In stock",
    "Sold out", "Free", "Premium", "Basic", "Advanced", "Popular"
)

# Get all TypeScript/JSX files
$files = Get-ChildItem -Path $srcPath -Recurse -Include "*.ts","*.tsx","*.jsx","*.js" | Where-Object { 
    $_.FullName -notmatch "node_modules" -and 
    $_.FullName -notmatch "\.d\.ts$" -and
    $_.FullName -notmatch "test" 
}

Write-Host "Found $($files.Count) files to scan" -ForegroundColor Yellow

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $lines = Get-Content $file.FullName
    
    for ($i = 0; $i -lt $lines.Count; $i++) {
        $line = $lines[$i]
        
        # Skip lines with translation functions
        if ($line -match "t\(" -or $line -match "useTranslation" -or $line -match "^import" -or $line -match "^\s*//") {
            continue
        }
        
        # Look for hardcoded strings in quotes
        foreach ($str in $commonStrings) {
            if ($line -match "`"$str`"" -or $line -match "'$str'") {
                $findings += [PSCustomObject]@{
                    File = $file.FullName.Replace((Get-Location), "").TrimStart('\')
                    Line = $i + 1
                    Text = $str
                    Context = $line.Trim()
                }
            }
        }
        
        # Look for JSX text content
        if ($line -match '>([A-Z][^<>{}]*[a-z][^<>{}]*)<') {
            $match = $Matches[1]
            if ($match -and $match.Length -gt 2 -and $match -notmatch "^\s*$") {
                $findings += [PSCustomObject]@{
                    File = $file.FullName.Replace((Get-Location), "").TrimStart('\')
                    Line = $i + 1
                    Text = $match.Trim()
                    Context = $line.Trim()
                }
            }
        }
        
        # Look for placeholder attributes
        if ($line -match 'placeholder=["'']([^"'']+)["'']') {
            $findings += [PSCustomObject]@{
                File = $file.FullName.Replace((Get-Location), "").TrimStart('\')
                Line = $i + 1
                Text = $Matches[1]
                Context = $line.Trim()
            }
        }
        
        # Look for title attributes
        if ($line -match 'title=["'']([^"'']+)["'']') {
            $findings += [PSCustomObject]@{
                File = $file.FullName.Replace((Get-Location), "").TrimStart('\')
                Line = $i + 1
                Text = $Matches[1]
                Context = $line.Trim()
            }
        }
        
        # Look for label attributes
        if ($line -match 'label=["'']([^{][^"'']+)["'']') {
            $findings += [PSCustomObject]@{
                File = $file.FullName.Replace((Get-Location), "").TrimStart('\')
                Line = $i + 1
                Text = $Matches[1]
                Context = $line.Trim()
            }
        }
    }
}

Write-Host "`n" + "="*80 -ForegroundColor Green
Write-Host "HARDCODED STRINGS AUDIT RESULTS" -ForegroundColor Green  
Write-Host "="*80 -ForegroundColor Green

Write-Host "Total files scanned: $($files.Count)" -ForegroundColor Yellow
Write-Host "Total hardcoded strings found: $($findings.Count)" -ForegroundColor Yellow

if ($findings.Count -gt 0) {
    Write-Host "`nFiles with most issues:" -ForegroundColor Yellow
    $findings | Group-Object File | Sort-Object Count -Descending | Select-Object -First 10 | ForEach-Object {
        Write-Host "  $($_.Count.ToString().PadLeft(3)) issues - $($_.Name)" -ForegroundColor White
    }
    
    Write-Host "`nDetailed findings:" -ForegroundColor Yellow
    $findings | Sort-Object File, Line | ForEach-Object {
        Write-Host "📄 $($_.File):$($_.Line)" -ForegroundColor Cyan
        Write-Host "   Text: `"$($_.Text)`"" -ForegroundColor White
        Write-Host "   Context: $($_.Context)" -ForegroundColor Gray
        Write-Host ""
    }
}

Write-Host "Scan complete!" -ForegroundColor Green