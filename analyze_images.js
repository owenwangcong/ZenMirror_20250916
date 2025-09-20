const fs = require('fs');
const path = require('path');

function analyzeHTMLImages() {
    const results = {
        timestamp: new Date().toISOString(),
        pages: []
    };

    const filesToAnalyze = [
        {
            name: 'Indiegogo Final Campaign',
            filePath: 'D:/Projects/ZenMirror_20250916/final_campaigns/indiegogo/index.html',
            baseDir: 'D:/Projects/ZenMirror_20250916/final_campaigns/indiegogo/'
        },
        {
            name: 'Kickstarter Final Campaign',
            filePath: 'D:/Projects/ZenMirror_20250916/final_campaigns/kickstarter/index.html',
            baseDir: 'D:/Projects/ZenMirror_20250916/final_campaigns/kickstarter/'
        },
        {
            name: 'Indiegogo Mockups',
            filePath: 'D:/Projects/ZenMirror_20250916/outputs/ui-developer/indiegogo_mockups/index.html',
            baseDir: 'D:/Projects/ZenMirror_20250916/outputs/ui-developer/indiegogo_mockups/'
        },
        {
            name: 'Kickstarter Mockups',
            filePath: 'D:/Projects/ZenMirror_20250916/outputs/ui-developer/kickstarter_mockups/index.html',
            baseDir: 'D:/Projects/ZenMirror_20250916/outputs/ui-developer/kickstarter_mockups/'
        }
    ];

    console.log('🔍 Analyzing HTML files for image references...\n');

    filesToAnalyze.forEach(fileInfo => {
        console.log(`📄 Analyzing: ${fileInfo.name}`);

        try {
            const htmlContent = fs.readFileSync(fileInfo.filePath, 'utf8');

            // Extract all img tags using regex
            const imgRegex = /<img[^>]+src\s*=\s*["']([^"']+)["'][^>]*>/gi;
            const matches = [...htmlContent.matchAll(imgRegex)];

            const images = [];
            const missingImages = [];
            const workingImages = [];

            matches.forEach((match, index) => {
                const fullTag = match[0];
                const src = match[1];

                // Extract alt text
                const altMatch = fullTag.match(/alt\s*=\s*["']([^"']*)["']/i);
                const alt = altMatch ? altMatch[1] : 'No alt text';

                let fullPath = '';
                let exists = false;

                // Resolve relative paths
                if (src.startsWith('./')) {
                    fullPath = path.resolve(fileInfo.baseDir + src.substring(2));
                } else if (src.startsWith('../')) {
                    fullPath = path.resolve(fileInfo.baseDir + src);
                } else if (src.startsWith('../../')) {
                    fullPath = path.resolve(fileInfo.baseDir + src);
                } else if (!src.startsWith('http')) {
                    fullPath = path.resolve(fileInfo.baseDir + src);
                } else {
                    fullPath = src; // External URL
                    exists = true; // Can't check external URLs easily
                }

                // Check if file exists (for local files only)
                if (!src.startsWith('http')) {
                    try {
                        exists = fs.existsSync(fullPath);
                    } catch (error) {
                        exists = false;
                    }
                }

                const imageInfo = {
                    index: index + 1,
                    src: src,
                    alt: alt,
                    resolvedPath: fullPath,
                    exists: exists,
                    isExternal: src.startsWith('http')
                };

                images.push(imageInfo);

                if (!exists && !src.startsWith('http')) {
                    missingImages.push(imageInfo);
                } else {
                    workingImages.push(imageInfo);
                }
            });

            console.log(`   Total images found: ${images.length}`);
            console.log(`   Working/External: ${workingImages.length}`);
            console.log(`   Missing files: ${missingImages.length}`);

            if (missingImages.length > 0) {
                console.log('\n   🔴 MISSING IMAGE FILES:');
                missingImages.forEach(img => {
                    console.log(`      ${img.index}. ${img.src}`);
                    console.log(`         Alt: "${img.alt}"`);
                    console.log(`         Expected path: ${img.resolvedPath}`);
                    console.log('');
                });
            }

            results.pages.push({
                name: fileInfo.name,
                filePath: fileInfo.filePath,
                totalImages: images.length,
                workingImages: workingImages.length,
                missingImages: missingImages.length,
                allImages: images,
                missingImageDetails: missingImages
            });

        } catch (error) {
            console.log(`   ❌ Error reading file: ${error.message}`);
            results.pages.push({
                name: fileInfo.name,
                filePath: fileInfo.filePath,
                error: error.message
            });
        }

        console.log('   ' + '─'.repeat(50) + '\n');
    });

    // Save detailed report
    const reportPath = 'D:/Projects/ZenMirror_20250916/qa/image_analysis_report.json';
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));

    // Generate summary
    console.log('📊 ANALYSIS SUMMARY');
    console.log('===================');

    let totalImages = 0;
    let totalMissing = 0;

    results.pages.forEach(page => {
        if (!page.error) {
            totalImages += page.totalImages;
            totalMissing += page.missingImages;

            console.log(`${page.name}:`);
            console.log(`   Images: ${page.totalImages} | Working: ${page.workingImages} | Missing: ${page.missingImages}`);

            if (page.missingImages > 0) {
                console.log(`   ⚠️  NEEDS ATTENTION`);
            } else {
                console.log(`   ✅ ALL PATHS VALID`);
            }
        }
    });

    console.log(`\n🎯 OVERALL RESULTS:`);
    console.log(`   Total images: ${totalImages}`);
    console.log(`   Missing files: ${totalMissing}`);
    console.log(`   Success rate: ${totalImages > 0 ? ((totalImages - totalMissing) / totalImages * 100).toFixed(1) : 0}%`);

    if (totalMissing > 0) {
        console.log(`\n⚠️  ${totalMissing} image files missing`);
        console.log(`📄 Full report: ${reportPath}`);
    } else {
        console.log(`\n🎉 ALL IMAGE PATHS VALID!`);
    }

    return results;
}

// Create qa directory if it doesn't exist
const qaDir = 'D:/Projects/ZenMirror_20250916/qa';
if (!fs.existsSync(qaDir)) {
    fs.mkdirSync(qaDir, { recursive: true });
}

// Run the analysis
analyzeHTMLImages();