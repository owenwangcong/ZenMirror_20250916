const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function checkBrokenImages() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });

    const page = await context.newPage();

    const testResults = {
        timestamp: new Date().toISOString(),
        results: []
    };

    const pagesToTest = [
        {
            name: 'Indiegogo Final Campaign',
            path: 'file:///D:/Projects/ZenMirror_20250916/final_campaigns/indiegogo/index.html'
        },
        {
            name: 'Kickstarter Final Campaign',
            path: 'file:///D:/Projects/ZenMirror_20250916/final_campaigns/kickstarter/index.html'
        },
        {
            name: 'Indiegogo Mockups',
            path: 'file:///D:/Projects/ZenMirror_20250916/outputs/ui-developer/indiegogo_mockups/index.html'
        },
        {
            name: 'Kickstarter Mockups',
            path: 'file:///D:/Projects/ZenMirror_20250916/outputs/ui-developer/kickstarter_mockups/index.html'
        }
    ];

    console.log('🔍 Starting broken image link detection...\n');

    for (const pageInfo of pagesToTest) {
        console.log(`📄 Testing: ${pageInfo.name}`);
        console.log(`🔗 URL: ${pageInfo.path}\n`);

        try {
            // Navigate to page
            await page.goto(pageInfo.path);

            // Wait for page to load
            await page.waitForLoadState('networkidle');

            // Take a screenshot for visual verification
            const screenshotPath = `D:/Projects/ZenMirror_20250916/qa/screenshots/${pageInfo.name.replace(/\s+/g, '_').toLowerCase()}.png`;
            await page.screenshot({ path: screenshotPath, fullPage: true });

            // Get all images on the page
            const images = await page.$$('img');
            console.log(`   Found ${images.length} images on the page`);

            const brokenImages = [];
            const workingImages = [];

            for (let i = 0; i < images.length; i++) {
                const img = images[i];

                // Get image attributes
                const src = await img.getAttribute('src');
                const alt = await img.getAttribute('alt') || 'No alt text';

                if (!src) {
                    brokenImages.push({
                        index: i + 1,
                        src: 'No src attribute',
                        alt: alt,
                        issue: 'Missing src attribute'
                    });
                    continue;
                }

                // Check if image loaded successfully
                const isLoaded = await img.evaluate((element) => {
                    return element.complete && element.naturalHeight !== 0;
                });

                // Get computed dimensions
                const dimensions = await img.evaluate((element) => {
                    const rect = element.getBoundingClientRect();
                    return {
                        width: rect.width,
                        height: rect.height,
                        naturalWidth: element.naturalWidth,
                        naturalHeight: element.naturalHeight
                    };
                });

                if (!isLoaded || dimensions.naturalWidth === 0 || dimensions.naturalHeight === 0) {
                    brokenImages.push({
                        index: i + 1,
                        src: src,
                        alt: alt,
                        issue: 'Failed to load image',
                        dimensions: dimensions
                    });
                } else {
                    workingImages.push({
                        index: i + 1,
                        src: src,
                        alt: alt,
                        dimensions: dimensions
                    });
                }
            }

            // Log results for this page
            console.log(`   ✅ Working images: ${workingImages.length}`);
            console.log(`   ❌ Broken images: ${brokenImages.length}`);

            if (brokenImages.length > 0) {
                console.log('\n   🔴 BROKEN IMAGES FOUND:');
                brokenImages.forEach(img => {
                    console.log(`      ${img.index}. ${img.src}`);
                    console.log(`         Alt: "${img.alt}"`);
                    console.log(`         Issue: ${img.issue}`);
                    console.log('');
                });
            }

            // Store results
            testResults.results.push({
                page: pageInfo.name,
                url: pageInfo.path,
                screenshot: screenshotPath,
                totalImages: images.length,
                workingImages: workingImages.length,
                brokenImages: brokenImages.length,
                brokenImageDetails: brokenImages,
                workingImageDetails: workingImages
            });

        } catch (error) {
            console.log(`   ❌ Error testing page: ${error.message}`);
            testResults.results.push({
                page: pageInfo.name,
                url: pageInfo.path,
                error: error.message,
                totalImages: 0,
                workingImages: 0,
                brokenImages: 0,
                brokenImageDetails: [],
                workingImageDetails: []
            });
        }

        console.log('   ' + '─'.repeat(50) + '\n');
    }

    await browser.close();

    // Generate detailed report
    const reportPath = 'D:/Projects/ZenMirror_20250916/qa/broken_images_report.json';
    fs.writeFileSync(reportPath, JSON.stringify(testResults, null, 2));

    // Generate summary
    let totalBroken = 0;
    let totalImages = 0;

    console.log('📊 FINAL SUMMARY');
    console.log('================');

    testResults.results.forEach(result => {
        if (!result.error) {
            totalImages += result.totalImages;
            totalBroken += result.brokenImages;

            console.log(`${result.page}:`);
            console.log(`   Total images: ${result.totalImages}`);
            console.log(`   Working: ${result.workingImages}`);
            console.log(`   Broken: ${result.brokenImages}`);

            if (result.brokenImages > 0) {
                console.log(`   ⚠️  NEEDS ATTENTION`);
            } else {
                console.log(`   ✅ ALL IMAGES WORKING`);
            }
            console.log('');
        }
    });

    console.log(`🎯 OVERALL RESULTS:`);
    console.log(`   Total images across all pages: ${totalImages}`);
    console.log(`   Total broken images: ${totalBroken}`);
    console.log(`   Success rate: ${totalImages > 0 ? ((totalImages - totalBroken) / totalImages * 100).toFixed(1) : 0}%`);

    if (totalBroken > 0) {
        console.log(`\n⚠️  ACTION REQUIRED: ${totalBroken} broken images found`);
        console.log(`📄 Detailed report saved to: ${reportPath}`);
    } else {
        console.log(`\n🎉 ALL IMAGES WORKING PERFECTLY!`);
    }

    return testResults;
}

// Create qa directory if it doesn't exist
const qaDir = 'D:/Projects/ZenMirror_20250916/qa';
const screenshotsDir = 'D:/Projects/ZenMirror_20250916/qa/screenshots';

if (!fs.existsSync(qaDir)) {
    fs.mkdirSync(qaDir, { recursive: true });
}

if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Run the test
checkBrokenImages().catch(console.error);