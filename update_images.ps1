# PowerShell script to update all image references in HTML files
$files = @(
    "D:\Projects\ZenMirror_20250916\final_campaigns\indiegogo\index.html",
    "D:\Projects\ZenMirror_20250916\final_campaigns\kickstarter\index.html",
    "D:\Projects\ZenMirror_20250916\outputs\ui-developer\indiegogo_mockups\index.html",
    "D:\Projects\ZenMirror_20250916\outputs\ui-developer\kickstarter_mockups\index.html"
)

# Define image mappings (old path -> new path)
$imageMappings = @{
    "./assets/zenmirror-logo.svg" = "../../assets/images/branding/zenmirror-logo.png"
    "./assets/zenmirror-main.jpg" = "../../assets/images/product/zenmirror-device.png"
    "./assets/zenmirror-hero.jpg" = "../../assets/images/product/zenmirror-device.png"
    "./assets/tech/radar-visualization.jpg" = "../../assets/images/technology/radar-visualization.png"
    "./assets/mentors/zen-master-detailed.jpg" = "../../assets/images/mentors/zen-master.png"
    "./assets/mentors/zen-master.jpg" = "../../assets/images/mentors/zen-master.png"
    "./assets/mentors/yogi-master.jpg" = "../../assets/images/mentors/yogi.png"
    "./assets/mentors/yogi.jpg" = "../../assets/images/mentors/yogi.png"
    "./assets/mentors/chaplain.jpg" = "../../assets/images/mentors/chaplain.png"
    "./assets/mentors/spiritual-guide.jpg" = "../../assets/images/mentors/spiritual-mentor.png"
    "./assets/mentors/spiritual-mentor.jpg" = "../../assets/images/mentors/spiritual-mentor.png"
    "./assets/mentors/stoic-philosopher.jpg" = "../../assets/images/mentors/stoic-philosopher.png"
    "./assets/mentors/stoic.jpg" = "../../assets/images/mentors/stoic-philosopher.png"
    "./assets/mentors/vedanta-acharya.jpg" = "../../assets/images/mentors/vedanta-acharya.png"
    "./assets/mentors/vedanta.jpg" = "../../assets/images/mentors/vedanta-acharya.png"
    "./assets/app-dashboard.jpg" = "../../assets/images/app/dashboard.png"
    "./assets/gallery/app-dashboard.jpg" = "../../assets/images/app/dashboard.png"
}

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Updating file: $file"
        $content = Get-Content $file -Raw

        foreach ($mapping in $imageMappings.GetEnumerator()) {
            $oldPath = $mapping.Key
            $newPath = $mapping.Value

            if ($content -match [regex]::Escape($oldPath)) {
                $content = $content -replace [regex]::Escape($oldPath), $newPath
                Write-Host "  Updated: $oldPath -> $newPath"
            }
        }

        $content | Set-Content $file -NoNewline
        Write-Host "  File updated successfully"
    } else {
        Write-Host "File not found: $file"
    }
}

Write-Host "Image reference updates completed!"