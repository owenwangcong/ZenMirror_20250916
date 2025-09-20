# Image Audit Script for ZenMirror Project
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

foreach ($htmlFile in $htmlFiles) {
    if (Test-Path $htmlFile) {
        $content = Get-Content $htmlFile -Raw

        foreach ($pattern in $patterns) {
            $matches = [regex]::Matches($content, $pattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)

            foreach ($match in $matches) {
                $imagePath = $match.Groups[1].Value
                $imagePath = $imagePath -replace '"', '' -replace "'", ''

                # Convert relative paths to absolute
                $baseDir = Split-Path $htmlFile -Parent
                if ($imagePath.StartsWith('./')) {
                    $fullPath = Join-Path $baseDir ($imagePath.Substring(2))
                } elseif ($imagePath.StartsWith('../../')) {
                    $fullPath = Join-Path (Split-Path (Split-Path $baseDir -Parent) -Parent) ($imagePath.Substring(6))
                } elseif (-not $imagePath.StartsWith('http')) {
                    $fullPath = Join-Path $baseDir $imagePath
                } else {
                    $fullPath = $imagePath
                }

                $exists = if ($imagePath.StartsWith('http')) { "External URL" } else { Test-Path $fullPath }

                $imagePaths += [PSCustomObject]@{
                    HTMLFile = Split-Path $htmlFile -Leaf
                    RelativePath = $imagePath
                    FullPath = $fullPath
                    Exists = $exists
                    FileSize = if ($exists -eq $true) { (Get-Item $fullPath).Length } else { "N/A" }
                }
            }
        }
    }
}

# Export to CSV
$imagePaths | Export-Csv -Path "D:\Projects\ZenMirror_20250916\image_audit_report.csv" -NoTypeInformation

Write-Host "Image audit complete. Report saved to image_audit_report.csv"
Write-Host "Total images found: $($imagePaths.Count)"
Write-Host "Missing images: $(($imagePaths | Where-Object { $_.Exists -eq $false }).Count)"