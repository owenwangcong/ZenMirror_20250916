# Batch Image Generation Script for Missing ZenMirror Images

# List of critical missing images to generate (prioritized)
$criticalImages = @(
    @{
        Name = "og-image"
        Path = "D:\Projects\ZenMirror_20250916\final_campaigns\kickstarter\assets\og-image.jpg"
        CopyTo = @("D:\Projects\ZenMirror_20250916\final_campaigns\indiegogo\assets\og-image.jpg")
        Prompt = "ZenMirror Open Graph social media image: Professional banner showing ZenMirror device with meditation elements. Include logo, tagline 'World's First Contactless Meditation Monitoring', and key visual elements. 1200x630 aspect ratio for social sharing. Style: social media banner, professional, zen aesthetic"
    },
    @{
        Name = "traditional-wearables"
        Path = "D:\Projects\ZenMirror_20250916\final_campaigns\kickstarter\assets\traditional-wearables.jpg"
        Prompt = "Traditional meditation wearables comparison: Collection of uncomfortable meditation tracking devices - chest straps, smartwatches, EEG headbands. Show them as intrusive and distracting. Professional product photography style showing the problem ZenMirror solves. Style: product comparison, clinical, showing limitations"
    },
    @{
        Name = "video-thumbnail"
        Path = "D:\Projects\ZenMirror_20250916\final_campaigns\kickstarter\assets\video-thumbnail.jpg"
        Prompt = "Video thumbnail for ZenMirror demo: Person meditating peacefully with ZenMirror device nearby, subtle radar waves visualization, play button overlay. Professional video thumbnail design. Warm, inviting colors. Style: video thumbnail, professional, inviting"
    },
    @{
        Name = "zenmirror-setup"
        Path = "D:\Projects\ZenMirror_20250916\final_campaigns\kickstarter\assets\zenmirror-setup.jpg"
        Prompt = "ZenMirror contactless setup: Clean, modern meditation space showing ZenMirror device positioned discretely near meditation area. Person in meditation pose, device unobtrusive in background. Shows the contactless advantage. Style: lifestyle photography, zen, contactless"
    },
    @{
        Name = "closed-loop-diagram"
        Path = "D:\Projects\ZenMirror_20250916\final_campaigns\kickstarter\assets\closed-loop-diagram.jpg"
        CopyTo = @("D:\Projects\ZenMirror_20250916\final_campaigns\indiegogo\assets\closed-loop-diagram.jpg")
        Prompt = "Closed-loop system technical diagram: Circular flow diagram showing Monitor -> Analyze -> Feedback -> Learn cycle. Technical illustration with arrows, data points, and system components. Professional technical documentation style. Style: technical diagram, systematic, professional"
    }
)

Write-Host "=== BATCH IMAGE GENERATION ===" -ForegroundColor Green
Write-Host "Generating $($criticalImages.Count) critical missing images..." -ForegroundColor Yellow

foreach ($image in $criticalImages) {
    Write-Host "`nGenerating: $($image.Name)" -ForegroundColor Cyan
    Write-Host "Prompt: $($image.Prompt)" -ForegroundColor Gray

    # Note: This script creates the prompts and file paths
    # The actual nano-banana generation will be done manually
    Write-Host "Target path: $($image.Path)" -ForegroundColor Green

    if ($image.CopyTo) {
        Write-Host "Also copy to:" -ForegroundColor Green
        foreach ($copyPath in $image.CopyTo) {
            Write-Host "  - $copyPath" -ForegroundColor Green
        }
    }
    Write-Host "---"
}

Write-Host "`nBatch generation plan complete!" -ForegroundColor Green