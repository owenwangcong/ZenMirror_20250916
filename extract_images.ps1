# Extract all image sources from HTML files and check if they exist
$htmlFiles = Get-ChildItem -Recurse -Path "D:\Projects\ZenMirror_20250916\final_campaigns" -Include "*.html"
$results = @()

foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw
    $matches = [regex]::Matches($content, 'src="([^"]+)"')

    foreach ($match in $matches) {
        $imagePath = $match.Groups[1].Value

        # Skip external URLs and non-image sources
        if ($imagePath -notmatch "^http" -and $imagePath -match "\.(jpg|jpeg|png|gif|svg|webp)$") {
            # Calculate full path
            $fullPath = ""
            if ($imagePath.StartsWith("./")) {
                $fullPath = Join-Path $file.Directory.FullName $imagePath.Substring(2)
            } elseif ($imagePath.StartsWith("../../")) {
                $fullPath = Join-Path $file.Directory.Parent.Parent.FullName $imagePath.Substring(6)
            } else {
                $fullPath = Join-Path $file.Directory.FullName $imagePath
            }

            $exists = Test-Path $fullPath

            $results += [PSCustomObject]@{
                HTMLFile = $file.Name
                ImagePath = $imagePath
                FullPath = $fullPath
                Exists = $exists
            }
        }
    }
}

# Export to CSV
$results | Export-Csv -Path "D:\Projects\ZenMirror_20250916\image_audit.csv" -NoTypeInformation

# Display summary
Write-Host "Image Audit Complete!"
Write-Host "Total images found: $($results.Count)"
Write-Host "Missing images: $(($results | Where-Object { -not $_.Exists }).Count)"
Write-Host "Results saved to: D:\Projects\ZenMirror_20250916\image_audit.csv"