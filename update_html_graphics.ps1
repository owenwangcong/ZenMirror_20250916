# ZenMirror Graphics Update PowerShell Script
# This script systematically updates all HTML files to reference new nano-banana generated graphics

param(
    [string]$ProjectRoot = "D:\Projects\ZenMirror_20250916",
    [switch]$DryRun = $false,
    [switch]$Verbose = $false
)

# Function to log actions
function Write-UpdateLog {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] [$Level] $Message"
    Write-Host $logEntry
    Add-Content -Path "$ProjectRoot\graphics_update_log.txt" -Value $logEntry
}

# Function to backup original HTML files
function Backup-HTMLFiles {
    param([array]$FilePaths)

    $backupDir = "$ProjectRoot\backup_html_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

    foreach ($file in $FilePaths) {
        if (Test-Path $file) {
            $fileName = Split-Path $file -Leaf
            $relativePath = (Split-Path $file -Parent).Replace($ProjectRoot, "")
            $backupPath = "$backupDir$relativePath"
            New-Item -ItemType Directory -Path $backupPath -Force | Out-Null
            Copy-Item $file "$backupPath\$fileName"
            Write-UpdateLog "Backed up: $file"
        }
    }
    return $backupDir
}

# Function to validate image references
function Test-ImageExists {
    param([string]$ImagePath, [string]$BaseDir)
    $fullPath = Join-Path $BaseDir $ImagePath.TrimStart('.', '/')
    return Test-Path $fullPath
}

# Function to update image references in HTML
function Update-HTMLImageReferences {
    param(
        [string]$HTMLFile,
        [hashtable]$ImageMappings,
        [string]$BaseDir
    )

    if (-not (Test-Path $HTMLFile)) {
        Write-UpdateLog "HTML file not found: $HTMLFile" "ERROR"
        return $false
    }

    $content = Get-Content $HTMLFile -Raw
    $originalContent = $content
    $updatesCount = 0

    foreach ($category in $ImageMappings.Keys) {
        Write-UpdateLog "Processing category: $category" "DEBUG"

        foreach ($mapping in $ImageMappings[$category]) {
            $oldPath = $mapping.current_path
            $newPath = $mapping.new_path
            $altText = $mapping.alt_text

            # Check if new image exists
            if (-not (Test-ImageExists $newPath $BaseDir)) {
                Write-UpdateLog "New image not found: $newPath" "WARNING"
                continue
            }

            # Update src attributes
            $srcPattern = 'src\s*=\s*["\']' + [regex]::Escape($oldPath) + '["\']'
            if ($content -match $srcPattern) {
                $content = $content -replace $srcPattern, "src=`"$newPath`""
                $updatesCount++
                Write-UpdateLog "Updated src: $oldPath -> $newPath"
            }

            # Update alt attributes if specified
            if ($altText) {
                $altPattern = '(<img[^>]*src\s*=\s*["\']' + [regex]::Escape($newPath) + '["\'][^>]*alt\s*=\s*["\'])[^"\']*(["\'])'
                if ($content -match $altPattern) {
                    $content = $content -replace $altPattern, "`${1}$altText`${2}"
                    Write-UpdateLog "Updated alt text for: $newPath"
                }
            }
        }
    }

    # Write updated content if changes were made
    if ($content -ne $originalContent) {
        if (-not $DryRun) {
            Set-Content $HTMLFile -Value $content -Encoding UTF8
            Write-UpdateLog "Updated HTML file: $HTMLFile ($updatesCount changes)"
        } else {
            Write-UpdateLog "DRY RUN - Would update: $HTMLFile ($updatesCount changes)"
        }
        return $true
    } else {
        Write-UpdateLog "No changes needed for: $HTMLFile"
        return $false
    }
}

# Main execution
try {
    Write-UpdateLog "Starting ZenMirror graphics update process"
    Write-UpdateLog "Project root: $ProjectRoot"
    Write-UpdateLog "Dry run mode: $DryRun"

    # Load image mappings
    $mappingFile = "$ProjectRoot\html_image_mapping.json"
    if (-not (Test-Path $mappingFile)) {
        throw "Image mapping file not found: $mappingFile"
    }

    $mappingData = Get-Content $mappingFile | ConvertFrom-Json
    $imageMappings = @{}

    # Convert JSON to hashtable
    foreach ($property in $mappingData.html_image_mapping.image_references.PSObject.Properties) {
        $imageMappings[$property.Name] = $property.Value
    }

    # Define HTML files to update
    $htmlFiles = @(
        "$ProjectRoot\final_campaigns\indiegogo\index.html",
        "$ProjectRoot\final_campaigns\kickstarter\index.html",
        "$ProjectRoot\outputs\ui-developer\indiegogo_mockups\index.html",
        "$ProjectRoot\outputs\ui-developer\kickstarter_mockups\index.html"
    )

    # Backup original files
    $backupDir = Backup-HTMLFiles $htmlFiles
    Write-UpdateLog "Created backup directory: $backupDir"

    # Process each HTML file
    $totalUpdates = 0
    foreach ($htmlFile in $htmlFiles) {
        Write-UpdateLog "Processing: $htmlFile"

        # Determine base directory for asset paths
        $baseDir = Split-Path $htmlFile -Parent

        # Update the file
        $updated = Update-HTMLImageReferences $htmlFile $imageMappings $baseDir
        if ($updated) { $totalUpdates++ }
    }

    # Generate validation report
    $validationReport = @{
        timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        files_processed = $htmlFiles.Count
        files_updated = $totalUpdates
        dry_run = $DryRun
        backup_location = $backupDir
        status = "completed"
    }

    $reportFile = "$ProjectRoot\graphics_update_report.json"
    $validationReport | ConvertTo-Json -Depth 3 | Set-Content $reportFile

    Write-UpdateLog "Graphics update completed successfully"
    Write-UpdateLog "Files processed: $($htmlFiles.Count)"
    Write-UpdateLog "Files updated: $totalUpdates"
    Write-UpdateLog "Report saved: $reportFile"

} catch {
    Write-UpdateLog "ERROR: $($_.Exception.Message)" "ERROR"
    Write-UpdateLog "Stack trace: $($_.ScriptStackTrace)" "ERROR"
    exit 1
}

# Image validation function
function Test-AllImagesExist {
    param([array]$HTMLFiles)

    $missingImages = @()

    foreach ($htmlFile in $HTMLFiles) {
        if (-not (Test-Path $htmlFile)) { continue }

        $content = Get-Content $htmlFile -Raw
        $baseDir = Split-Path $htmlFile -Parent

        # Extract all image src attributes
        $imageMatches = [regex]::Matches($content, 'src\s*=\s*["\']([^"\']+\.(jpg|jpeg|png|gif|svg|webp))["\']', 'IgnoreCase')

        foreach ($match in $imageMatches) {
            $imagePath = $match.Groups[1].Value
            $fullPath = Join-Path $baseDir $imagePath.TrimStart('.', '/')

            if (-not (Test-Path $fullPath)) {
                $missingImages += @{
                    html_file = $htmlFile
                    image_path = $imagePath
                    full_path = $fullPath
                }
            }
        }
    }

    return $missingImages
}

# Additional validation
Write-UpdateLog "Running image validation check..."
$missingImages = Test-AllImagesExist $htmlFiles

if ($missingImages.Count -gt 0) {
    Write-UpdateLog "Found $($missingImages.Count) missing images:" "WARNING"
    foreach ($missing in $missingImages) {
        Write-UpdateLog "  $($missing.image_path) in $($missing.html_file)" "WARNING"
    }
} else {
    Write-UpdateLog "All image references validated successfully" "SUCCESS"
}

Write-UpdateLog "Graphics update orchestration completed"