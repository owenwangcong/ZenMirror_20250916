@echo off
echo ================================================
echo ZenMirror Campaign - Complete Image QA Process
echo ================================================
echo.

cd /d "D:\Projects\ZenMirror_20250916"

echo STEP 1: Running initial image analysis...
echo --------------------------------------------------------
node analyze_images.js
echo.

echo STEP 2: Implementing automated fixes...
echo --------------------------------------------------------
node fix_broken_images.js
echo.

echo STEP 3: Running post-fix validation...
echo --------------------------------------------------------
node analyze_images.js
echo.

echo ================================================
echo QA PROCESS COMPLETE
echo ================================================
echo.
echo Reports generated:
echo   - qa/image_issues_report.md
echo   - qa/image_fix_plan.md
echo   - qa/final_image_review_report.md
echo   - qa/image_creation_checklist.md
echo   - qa/asset_creation_report.json
echo.
echo Next steps:
echo   1. Review the image creation checklist
echo   2. Create the missing image assets
echo   3. Run broken_images_test.js for browser testing
echo   4. Verify all images display correctly
echo.
pause