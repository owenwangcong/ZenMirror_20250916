@echo off
echo ZenMirror Asset Deployment Script
echo ==================================

:: Create comprehensive directory structure
echo Creating directory structure...

:: Kickstarter directories
mkdir "D:\Projects\ZenMirror_20250916\final_campaigns\kickstarter\assets" 2>nul
mkdir "D:\Projects\ZenMirror_20250916\final_campaigns\kickstarter\assets\tech" 2>nul
mkdir "D:\Projects\ZenMirror_20250916\final_campaigns\kickstarter\assets\mentors" 2>nul
mkdir "D:\Projects\ZenMirror_20250916\final_campaigns\kickstarter\assets\icons" 2>nul
mkdir "D:\Projects\ZenMirror_20250916\final_campaigns\kickstarter\assets\gallery" 2>nul

:: Indiegogo mockups directories
mkdir "D:\Projects\ZenMirror_20250916\outputs\ui-developer\indiegogo_mockups\assets" 2>nul
mkdir "D:\Projects\ZenMirror_20250916\outputs\ui-developer\indiegogo_mockups\assets\tech" 2>nul
mkdir "D:\Projects\ZenMirror_20250916\outputs\ui-developer\indiegogo_mockups\assets\mentors" 2>nul
mkdir "D:\Projects\ZenMirror_20250916\outputs\ui-developer\indiegogo_mockups\assets\icons" 2>nul
mkdir "D:\Projects\ZenMirror_20250916\outputs\ui-developer\indiegogo_mockups\assets\gallery" 2>nul

:: Kickstarter mockups directories
mkdir "D:\Projects\ZenMirror_20250916\outputs\ui-developer\kickstarter_mockups\assets" 2>nul
mkdir "D:\Projects\ZenMirror_20250916\outputs\ui-developer\kickstarter_mockups\assets\tech" 2>nul
mkdir "D:\Projects\ZenMirror_20250916\outputs\ui-developer\kickstarter_mockups\assets\mentors" 2>nul
mkdir "D:\Projects\ZenMirror_20250916\outputs\ui-developer\kickstarter_mockups\assets\icons" 2>nul
mkdir "D:\Projects\ZenMirror_20250916\outputs\ui-developer\kickstarter_mockups\assets\gallery" 2>nul

echo Copying all assets to target directories...

:: Define source directory
set SOURCE_DIR=D:\Projects\ZenMirror_20250916\final_campaigns\indiegogo\assets

:: Copy to Kickstarter campaign
echo Copying to Kickstarter...
copy "%SOURCE_DIR%\zenmirror-logo.svg" "D:\Projects\ZenMirror_20250916\final_campaigns\kickstarter\assets\"
copy "%SOURCE_DIR%\zenmirror-main.svg" "D:\Projects\ZenMirror_20250916\final_campaigns\kickstarter\assets\"
copy "%SOURCE_DIR%\closed-loop-diagram.svg" "D:\Projects\ZenMirror_20250916\final_campaigns\kickstarter\assets\"
copy "%SOURCE_DIR%\tech-diagram.svg" "D:\Projects\ZenMirror_20250916\final_campaigns\kickstarter\assets\"
copy "%SOURCE_DIR%\hrv-rsa-chart.svg" "D:\Projects\ZenMirror_20250916\final_campaigns\kickstarter\assets\"

:: Copy subdirectories to Kickstarter
if exist "%SOURCE_DIR%\tech\*.*" copy "%SOURCE_DIR%\tech\*.*" "D:\Projects\ZenMirror_20250916\final_campaigns\kickstarter\assets\tech\"
if exist "%SOURCE_DIR%\mentors\*.*" copy "%SOURCE_DIR%\mentors\*.*" "D:\Projects\ZenMirror_20250916\final_campaigns\kickstarter\assets\mentors\"
if exist "%SOURCE_DIR%\icons\*.*" copy "%SOURCE_DIR%\icons\*.*" "D:\Projects\ZenMirror_20250916\final_campaigns\kickstarter\assets\icons\"
if exist "%SOURCE_DIR%\gallery\*.*" copy "%SOURCE_DIR%\gallery\*.*" "D:\Projects\ZenMirror_20250916\final_campaigns\kickstarter\assets\gallery\"

:: Copy to Indiegogo UI mockups
echo Copying to Indiegogo mockups...
copy "%SOURCE_DIR%\zenmirror-logo.svg" "D:\Projects\ZenMirror_20250916\outputs\ui-developer\indiegogo_mockups\assets\"
copy "%SOURCE_DIR%\zenmirror-main.svg" "D:\Projects\ZenMirror_20250916\outputs\ui-developer\indiegogo_mockups\assets\"
copy "%SOURCE_DIR%\closed-loop-diagram.svg" "D:\Projects\ZenMirror_20250916\outputs\ui-developer\indiegogo_mockups\assets\"
copy "%SOURCE_DIR%\tech-diagram.svg" "D:\Projects\ZenMirror_20250916\outputs\ui-developer\indiegogo_mockups\assets\"
copy "%SOURCE_DIR%\hrv-rsa-chart.svg" "D:\Projects\ZenMirror_20250916\outputs\ui-developer\indiegogo_mockups\assets\"

if exist "%SOURCE_DIR%\tech\*.*" copy "%SOURCE_DIR%\tech\*.*" "D:\Projects\ZenMirror_20250916\outputs\ui-developer\indiegogo_mockups\assets\tech\"
if exist "%SOURCE_DIR%\mentors\*.*" copy "%SOURCE_DIR%\mentors\*.*" "D:\Projects\ZenMirror_20250916\outputs\ui-developer\indiegogo_mockups\assets\mentors\"
if exist "%SOURCE_DIR%\icons\*.*" copy "%SOURCE_DIR%\icons\*.*" "D:\Projects\ZenMirror_20250916\outputs\ui-developer\indiegogo_mockups\assets\icons\"
if exist "%SOURCE_DIR%\gallery\*.*" copy "%SOURCE_DIR%\gallery\*.*" "D:\Projects\ZenMirror_20250916\outputs\ui-developer\indiegogo_mockups\assets\gallery\"

:: Copy to Kickstarter UI mockups
echo Copying to Kickstarter mockups...
copy "%SOURCE_DIR%\zenmirror-logo.svg" "D:\Projects\ZenMirror_20250916\outputs\ui-developer\kickstarter_mockups\assets\"
copy "%SOURCE_DIR%\zenmirror-main.svg" "D:\Projects\ZenMirror_20250916\outputs\ui-developer\kickstarter_mockups\assets\"
copy "%SOURCE_DIR%\closed-loop-diagram.svg" "D:\Projects\ZenMirror_20250916\outputs\ui-developer\kickstarter_mockups\assets\"
copy "%SOURCE_DIR%\tech-diagram.svg" "D:\Projects\ZenMirror_20250916\outputs\ui-developer\kickstarter_mockups\assets\"
copy "%SOURCE_DIR%\hrv-rsa-chart.svg" "D:\Projects\ZenMirror_20250916\outputs\ui-developer\kickstarter_mockups\assets\"

if exist "%SOURCE_DIR%\tech\*.*" copy "%SOURCE_DIR%\tech\*.*" "D:\Projects\ZenMirror_20250916\outputs\ui-developer\kickstarter_mockups\assets\tech\"
if exist "%SOURCE_DIR%\mentors\*.*" copy "%SOURCE_DIR%\mentors\*.*" "D:\Projects\ZenMirror_20250916\outputs\ui-developer\kickstarter_mockups\assets\mentors\"
if exist "%SOURCE_DIR%\icons\*.*" copy "%SOURCE_DIR%\icons\*.*" "D:\Projects\ZenMirror_20250916\outputs\ui-developer\kickstarter_mockups\assets\icons\"
if exist "%SOURCE_DIR%\gallery\*.*" copy "%SOURCE_DIR%\gallery\*.*" "D:\Projects\ZenMirror_20250916\outputs\ui-developer\kickstarter_mockups\assets\gallery\"

echo.
echo Asset deployment complete!
echo All campaign directories now have matching assets.
echo.
pause