@echo off
echo Starting broken image link detection...
echo.
cd /d "D:\Projects\ZenMirror_20250916"
node broken_images_test.js
echo.
echo Test complete. Check qa/broken_images_report.json for detailed results.
pause