# Updated Image Audit Script for ZenMirror Project
$imagePaths = @()

# Define HTML files to check
$htmlFiles = @(
    "D:\Projects\ZenMirror_20250916\final_campaigns\kickstarter\index.html",
    "D:\Projects\ZenMirror_20250916\final_campaigns\indiegogo\index.html"
)

# Regex patterns to find image references
$patterns = @(
    'src="([^"]*\.(jpg|jpeg|png|svg|gif|webp|ico))"',
    'content="([^"]*\.(jpg|jpeg|png|svg|gif|webp|ico))"',
    'background[^:]*:\s*url\(([^)]*\.(jpg|jpeg|png|svg|gif|webp|ico))\)'
)

Write-Host "=== UPDATED IMAGE AUDIT REPORT ===" -ForegroundColor Green
Write-Host "Scanning HTML files for image references..." -ForegroundColor Yellow

foreach ($htmlFile in $htmlFiles) {
    if (Test-Path $htmlFile) {
        $content = Get-Content $htmlFile -Raw
        $fileName = Split-Path $htmlFile -Leaf

        Write-Host "`nProcessing: $fileName" -ForegroundColor Cyan

        foreach ($pattern in $patterns) {
            $matches = [regex]::Matches($content, $pattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)

            foreach ($match in $matches) {
                $imagePath = $match.Groups[1].Value
                $imagePath = $imagePath -replace '"', '' -replace "'", ''

                # Skip external URLs
                if ($imagePath.StartsWith('http')) {
                    continue
                }

                # Convert relative paths to absolute
                $baseDir = Split-Path $htmlFile -Parent
                if ($imagePath.StartsWith('./')) {
                    $fullPath = Join-Path $baseDir ($imagePath.Substring(2))
                } elseif ($imagePath.StartsWith('../../')) {
                    $fullPath = Join-Path (Split-Path (Split-Path $baseDir -Parent) -Parent) ($imagePath.Substring(6))
                } else {
                    $fullPath = Join-Path $baseDir $imagePath
                }

                # Normalize path
                $fullPath = [System.IO.Path]::GetFullPath($fullPath)
                $exists = Test-Path $fullPath

                # Get file info if exists
                $fileSize = "N/A"
                $fileType = "N/A"
                if ($exists) {
                    $fileInfo = Get-Item $fullPath
                    $fileSize = $fileInfo.Length
                    $fileType = $fileInfo.Extension
                }

                $imagePaths += [PSCustomObject]@{
                    HTMLFile = $fileName
                    RelativePath = $imagePath
                    FullPath = $fullPath
                    Exists = $exists
                    FileSize = $fileSize
                    FileType = $fileType
                    Category = if ($imagePath -match "branding|logo") { "Branding" }
                              elseif ($imagePath -match "product|device") { "Product" }
                              elseif ($imagePath -match "mentor") { "Mentors" }
                              elseif ($imagePath -match "icon") { "Icons" }
                              elseif ($imagePath -match "gallery") { "Gallery" }
                              elseif ($imagePath -match "team") { "Team" }
                              elseif ($imagePath -match "testimonial") { "Testimonials" }
                              elseif ($imagePath -match "video") { "Videos" }
                              elseif ($imagePath -match "story") { "Story" }
                              elseif ($imagePath -match "update") { "Updates" }
                              elseif ($imagePath -match "app|dashboard") { "App" }
                              elseif ($imagePath -match "tech|radar") { "Technology" }
                              else { "Other" }
                }
            }
        }
    }
}

# Remove duplicates based on FullPath
$imagePaths = $imagePaths | Sort-Object FullPath -Unique

# Export to CSV
$csvPath = "D:\Projects\ZenMirror_20250916\updated_image_audit_report.csv"
$imagePaths | Export-Csv -Path $csvPath -NoTypeInformation

# Generate summary statistics
$totalImages = $imagePaths.Count
$existingImages = ($imagePaths | Where-Object { $_.Exists -eq $true }).Count
$missingImages = $totalImages - $existingImages
$missingPercent = [math]::Round(($missingImages / $totalImages) * 100, 1)

Write-Host "`n=== AUDIT SUMMARY ===" -ForegroundColor Green
Write-Host "Total unique images found: $totalImages" -ForegroundColor White
Write-Host "Existing images: $existingImages" -ForegroundColor Green
Write-Host "Missing images: $missingImages ($missingPercent%)" -ForegroundColor Red

# Show missing images by category
Write-Host "`n=== MISSING IMAGES BY CATEGORY ===" -ForegroundColor Yellow
$missingByCategory = $imagePaths | Where-Object { $_.Exists -eq $false } | Group-Object Category
foreach ($category in $missingByCategory) {
    Write-Host "$($category.Name): $($category.Count) missing" -ForegroundColor Red
}

# Show detailed missing files
Write-Host "`n=== DETAILED MISSING FILES ===" -ForegroundColor Yellow
$imagePaths | Where-Object { $_.Exists -eq $false } | ForEach-Object {
    Write-Host "MISSING: $($_.RelativePath)" -ForegroundColor Red
    Write-Host "  Full path: $($_.FullPath)" -ForegroundColor DarkRed
    Write-Host "  Used in: $($_.HTMLFile)" -ForegroundColor DarkRed
    Write-Host ""
}

Write-Host "Updated audit complete! Report saved to: $csvPath" -ForegroundColor Green