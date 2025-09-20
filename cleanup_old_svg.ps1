# PowerShell script to clean up old SVGMaker graphics
$oldSvgFiles = @(
    "D:\Projects\ZenMirror_20250916\final_campaigns\indiegogo\assets\zenmirror-logo.svg",
    "D:\Projects\ZenMirror_20250916\final_campaigns\indiegogo\assets\zenmirror-main.svg",
    "D:\Projects\ZenMirror_20250916\final_campaigns\indiegogo\assets\zenmirror-hero.svg",
    "D:\Projects\ZenMirror_20250916\final_campaigns\indiegogo\assets\tech\radar-visualization.svg",
    "D:\Projects\ZenMirror_20250916\final_campaigns\indiegogo\assets\mentors\zen-master-detailed.svg",
    "D:\Projects\ZenMirror_20250916\final_campaigns\kickstarter\assets\zenmirror-logo.svg",
    "D:\Projects\ZenMirror_20250916\final_campaigns\kickstarter\assets\tech\radar-visualization.svg",
    "D:\Projects\ZenMirror_20250916\final_campaigns\kickstarter\assets\mentors\zen-master-detailed.svg",
    "D:\Projects\ZenMirror_20250916\outputs\ui-developer\indiegogo_mockups\assets\zenmirror-logo.svg",
    "D:\Projects\ZenMirror_20250916\outputs\ui-developer\indiegogo_mockups\assets\tech\radar-visualization.svg",
    "D:\Projects\ZenMirror_20250916\outputs\ui-developer\indiegogo_mockups\assets\mentors\zen-master-detailed.svg",
    "D:\Projects\ZenMirror_20250916\outputs\ui-developer\kickstarter_mockups\assets\zenmirror-logo.svg",
    "D:\Projects\ZenMirror_20250916\outputs\ui-developer\kickstarter_mockups\assets\tech\radar-visualization.svg",
    "D:\Projects\ZenMirror_20250916\outputs\ui-developer\kickstarter_mockups\assets\mentors\zen-master-detailed.svg"
)

Write-Host "Cleaning up old SVGMaker graphics files..."

foreach ($file in $oldSvgFiles) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "Deleted: $file"
    } else {
        Write-Host "File not found (already deleted): $file"
    }
}

Write-Host "SVG cleanup completed!"