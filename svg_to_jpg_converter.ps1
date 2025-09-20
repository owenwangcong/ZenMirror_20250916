# SVG to JPG Conversion Script for ZenMirror Campaign

# Define file paths
$kickstarterHtml = "D:\Projects\ZenMirror_20250916\final_campaigns\kickstarter\index.html"
$indiegogoHtml = "D:\Projects\ZenMirror_20250916\final_campaigns\indiegogo\index.html"

# Read both HTML files
$kickstarterContent = Get-Content $kickstarterHtml -Raw
$indiegogoContent = Get-Content $indiegogoHtml -Raw

Write-Host "Starting SVG to JPG conversion..."

# Define all SVG to JPG replacements
$replacements = @{
    "radar-waves.svg" = "radar-waves.jpg"
    "heart-monitoring.svg" = "heart-monitoring.jpg"
    "privacy-shield.svg" = "privacy-shield.jpg"
    "tech-diagram.svg" = "tech-diagram.jpg"
    "zen-circle.svg" = "zen-circle.jpg"
    "lotus.svg" = "lotus.jpg"
    "dove.svg" = "dove.jpg"
    "tree-of-life.svg" = "tree-of-life.jpg"
    "column.svg" = "column.jpg"
    "om-symbol.svg" = "om-symbol.jpg"
    "real-time.svg" = "real-time.jpg"
    "scoring.svg" = "scoring.jpg"
    "achievements.svg" = "achievements.jpg"
    "multi-mode.svg" = "multi-mode.jpg"
    "closed-loop.svg" = "closed-loop.jpg"
    "analytics.svg" = "analytics.jpg"
    "hrv-research.svg" = "hrv-research.jpg"
    "rsa-research.svg" = "rsa-research.jpg"
    "meditation-research.svg" = "meditation-research.jpg"
    "hrv-rsa-chart.svg" = "hrv-rsa-chart.jpg"
    "closed-loop-diagram.svg" = "closed-loop-diagram.jpg"
    "setup-view.svg" = "setup-view.jpg"
}

# Apply replacements to Kickstarter HTML
foreach ($svg in $replacements.Keys) {
    $jpg = $replacements[$svg]
    $kickstarterContent = $kickstarterContent -replace [regex]::Escape($svg), $jpg
    Write-Host "Replaced $svg with $jpg in Kickstarter HTML"
}

# Apply replacements to Indiegogo HTML
foreach ($svg in $replacements.Keys) {
    $jpg = $replacements[$svg]
    $indiegogoContent = $indiegogoContent -replace [regex]::Escape($svg), $jpg
    Write-Host "Replaced $svg with $jpg in Indiegogo HTML"
}

# Write updated content back to files
Set-Content -Path $kickstarterHtml -Value $kickstarterContent -Encoding UTF8
Set-Content -Path $indiegogoHtml -Value $indiegogoContent -Encoding UTF8

Write-Host "SVG to JPG conversion completed successfully!"
Write-Host "Updated files:"
Write-Host "- $kickstarterHtml"
Write-Host "- $indiegogoHtml"