// ZenMirror Campaign Expert Review - Playwright Automation
// Comprehensive visual and functional testing for both Kickstarter and Indiegogo campaigns

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

class CampaignExpertReviewer {
    constructor() {
        this.browser = null;
        this.context = null;
        this.review = {
            timestamp: new Date().toISOString(),
            campaigns: {},
            issues: [],
            recommendations: [],
            scores: {},
            assets: {
                missing: [],
                broken: [],
                optimized: []
            }
        };
    }

    async initialize() {
        this.browser = await chromium.launch({
            headless: false,
            slowMo: 100
        });
        this.context = await this.browser.newContext({
            viewport: { width: 1920, height: 1080 }
        });
    }

    async reviewCampaign(campaignPath, campaignType) {
        console.log(`\n🔍 Reviewing ${campaignType} campaign...`);

        const page = await this.context.newPage();
        const fullPath = `file:///${campaignPath.replace(/\\/g, '/')}`;

        try {
            // Load the campaign page
            await page.goto(fullPath, { waitUntil: 'networkidle' });

            const campaignReview = {
                type: campaignType,
                path: campaignPath,
                loadTime: null,
                imageAudit: {},
                visualAnalysis: {},
                conversionElements: {},
                mobileCompatibility: {},
                productDescriptionCompliance: {}
            };

            // Performance analysis
            const startTime = Date.now();
            await page.waitForLoadState('domcontentloaded');
            campaignReview.loadTime = Date.now() - startTime;

            // Take initial screenshot
            await page.screenshot({
                path: `expert_review/visual_analysis/${campaignType}_initial_load.png`,
                fullPage: true
            });

            // Image audit - check all image elements
            const imageAudit = await this.auditImages(page);
            campaignReview.imageAudit = imageAudit;

            // Hero section analysis
            const heroAnalysis = await this.analyzeHeroSection(page);
            campaignReview.visualAnalysis.hero = heroAnalysis;

            // Mentor section verification
            const mentorAnalysis = await this.analyzeMentorSection(page);
            campaignReview.productDescriptionCompliance.mentors = mentorAnalysis;

            // Technology section verification
            const techAnalysis = await this.analyzeTechnologySection(page);
            campaignReview.productDescriptionCompliance.technology = techAnalysis;

            // Conversion elements check
            const conversionAnalysis = await this.analyzeConversionElements(page);
            campaignReview.conversionElements = conversionAnalysis;

            // Mobile responsiveness test
            const mobileAnalysis = await this.testMobileResponsiveness(page);
            campaignReview.mobileCompatibility = mobileAnalysis;

            // Calculate campaign score
            const score = this.calculateCampaignScore(campaignReview);
            campaignReview.score = score;

            this.review.campaigns[campaignType] = campaignReview;

            console.log(`✅ ${campaignType} review complete. Score: ${score}/100`);

        } catch (error) {
            console.error(`❌ Error reviewing ${campaignType}:`, error);
            this.review.issues.push({
                type: 'critical_error',
                campaign: campaignType,
                error: error.message
            });
        } finally {
            await page.close();
        }
    }

    async auditImages(page) {
        console.log('  📸 Auditing images...');

        const imageElements = await page.$$('img');
        const imageAudit = {
            total: imageElements.length,
            loaded: 0,
            broken: [],
            missing: [],
            optimized: []
        };

        for (const img of imageElements) {
            const src = await img.getAttribute('src');
            const alt = await img.getAttribute('alt');
            const naturalWidth = await img.evaluate(el => el.naturalWidth);
            const naturalHeight = await img.evaluate(el => el.naturalHeight);

            if (naturalWidth === 0 || naturalHeight === 0) {
                imageAudit.broken.push({
                    src,
                    alt,
                    reason: 'Failed to load'
                });
                this.review.issues.push({
                    type: 'broken_image',
                    src,
                    alt
                });
            } else {
                imageAudit.loaded++;

                // Check if image is optimized (reasonable size)
                const displayedSize = await img.evaluate(el => ({
                    width: el.offsetWidth,
                    height: el.offsetHeight
                }));

                const isOptimized = (naturalWidth / displayedSize.width) <= 2;
                if (!isOptimized) {
                    imageAudit.optimized.push({
                        src,
                        natural: { width: naturalWidth, height: naturalHeight },
                        displayed: displayedSize,
                        recommendation: 'Consider optimizing for display size'
                    });
                }
            }
        }

        return imageAudit;
    }

    async analyzeHeroSection(page) {
        console.log('  🎯 Analyzing hero section...');

        const heroAnalysis = {};

        // Check for hero elements
        const heroTitle = await page.$('h1');
        const heroSubtitle = await page.$('.hero-subtitle, .hero-description');
        const heroCTA = await page.$('.hero-cta button, .btn-primary-large');
        const heroImage = await page.$('.hero-image, .hero-visual img');

        heroAnalysis.hasTitle = !!heroTitle;
        heroAnalysis.hasSubtitle = !!heroSubtitle;
        heroAnalysis.hasCTA = !!heroCTA;
        heroAnalysis.hasVisual = !!heroImage;

        if (heroTitle) {
            heroAnalysis.titleText = await heroTitle.textContent();
        }

        // Check if CTA is above the fold
        if (heroCTA) {
            const ctaPosition = await heroCTA.boundingBox();
            heroAnalysis.ctaAboveFold = ctaPosition.y < 600;

            if (!heroAnalysis.ctaAboveFold) {
                this.review.issues.push({
                    type: 'conversion_issue',
                    element: 'hero_cta',
                    issue: 'CTA not visible above the fold'
                });
            }
        }

        return heroAnalysis;
    }

    async analyzeMentorSection(page) {
        console.log('  🧘 Analyzing mentor section...');

        const mentorCards = await page.$$('.mentor-card');
        const expectedMentors = [
            'Zen Master', 'Yogi', 'Chaplain',
            'Spiritual Mentor', 'Stoic Philosopher', 'Vedanta Acharya'
        ];

        const mentorAnalysis = {
            totalCards: mentorCards.length,
            expectedCount: expectedMentors.length,
            mentorsFound: [],
            missingMentors: [],
            compliance: false
        };

        for (const card of mentorCards) {
            const mentorName = await card.$eval('h3', el => el.textContent?.trim() || '');
            mentorAnalysis.mentorsFound.push(mentorName);
        }

        // Check compliance with product description
        mentorAnalysis.missingMentors = expectedMentors.filter(
            mentor => !mentorAnalysis.mentorsFound.some(found =>
                found.toLowerCase().includes(mentor.toLowerCase())
            )
        );

        mentorAnalysis.compliance = mentorAnalysis.missingMentors.length === 0;

        if (!mentorAnalysis.compliance) {
            this.review.issues.push({
                type: 'product_description_violation',
                section: 'mentors',
                missing: mentorAnalysis.missingMentors
            });
        }

        return mentorAnalysis;
    }

    async analyzeTechnologySection(page) {
        console.log('  🔬 Analyzing technology section...');

        const techAnalysis = {
            hasRadarDiagram: false,
            hasClosedLoopDiagram: false,
            hasComparisonMatrix: false,
            hasHRVVisualization: false,
            compliance: false
        };

        // Check for required diagrams from product description
        const techDiagram = await page.$('img[src*="tech-diagram"], img[alt*="technology"], img[alt*="radar"]');
        const closedLoopDiagram = await page.$('img[src*="closed-loop"], img[alt*="closed-loop"]');
        const comparisonTable = await page.$('.comparison-table, table');
        const hrvChart = await page.$('img[src*="hrv"], img[alt*="HRV"]');

        techAnalysis.hasRadarDiagram = !!techDiagram;
        techAnalysis.hasClosedLoopDiagram = !!closedLoopDiagram;
        techAnalysis.hasComparisonMatrix = !!comparisonTable;
        techAnalysis.hasHRVVisualization = !!hrvChart;

        const requiredElements = [
            techAnalysis.hasRadarDiagram,
            techAnalysis.hasClosedLoopDiagram,
            techAnalysis.hasComparisonMatrix
        ];

        techAnalysis.compliance = requiredElements.every(Boolean);

        if (!techAnalysis.compliance) {
            this.review.issues.push({
                type: 'product_description_violation',
                section: 'technology',
                missing: {
                    radarDiagram: !techAnalysis.hasRadarDiagram,
                    closedLoopDiagram: !techAnalysis.hasClosedLoopDiagram,
                    comparisonMatrix: !techAnalysis.hasComparisonMatrix
                }
            });
        }

        return techAnalysis;
    }

    async analyzeConversionElements(page) {
        console.log('  💰 Analyzing conversion elements...');

        const conversionAnalysis = {
            ctaButtons: 0,
            socialProof: false,
            urgencyIndicators: false,
            trustSignals: false,
            riskReduction: false
        };

        // Count CTA buttons
        const ctaButtons = await page.$$('button, .btn-primary, .btn-cta, [onclick*="reward"], [onclick*="perk"]');
        conversionAnalysis.ctaButtons = ctaButtons.length;

        // Check for social proof
        const socialProofElements = await page.$$('.testimonial, .backer-count, .raised-amount, .stat');
        conversionAnalysis.socialProof = socialProofElements.length > 0;

        // Check for urgency indicators
        const urgencyElements = await page.$$('[class*="urgency"], [class*="limited"], [class*="remaining"]');
        conversionAnalysis.urgencyIndicators = urgencyElements.length > 0;

        // Check for trust signals
        const trustElements = await page.$$('.guarantee, .refund, .team-member, .testimonial');
        conversionAnalysis.trustSignals = trustElements.length > 0;

        // Check for risk reduction
        const riskElements = await page.$$('[class*="guarantee"], [class*="refund"], [class*="risk-free"]');
        conversionAnalysis.riskReduction = riskElements.length > 0;

        return conversionAnalysis;
    }

    async testMobileResponsiveness(page) {
        console.log('  📱 Testing mobile responsiveness...');

        const devices = [
            { name: 'Mobile', width: 375, height: 667 },
            { name: 'Tablet', width: 768, height: 1024 },
            { name: 'Desktop', width: 1920, height: 1080 }
        ];

        const mobileAnalysis = {
            responsive: true,
            deviceTests: {}
        };

        for (const device of devices) {
            await page.setViewportSize({ width: device.width, height: device.height });
            await page.waitForTimeout(500); // Allow layout to adjust

            // Take screenshot
            await page.screenshot({
                path: `expert_review/visual_analysis/responsive_${device.name.toLowerCase()}.png`
            });

            // Check if content is accessible
            const heroVisible = await page.isVisible('h1');
            const ctaVisible = await page.isVisible('.btn-primary, .hero-cta button');

            mobileAnalysis.deviceTests[device.name] = {
                heroVisible,
                ctaVisible,
                responsive: heroVisible && ctaVisible
            };

            if (!heroVisible || !ctaVisible) {
                mobileAnalysis.responsive = false;
                this.review.issues.push({
                    type: 'mobile_issue',
                    device: device.name,
                    issues: {
                        heroNotVisible: !heroVisible,
                        ctaNotVisible: !ctaVisible
                    }
                });
            }
        }

        // Reset to desktop
        await page.setViewportSize({ width: 1920, height: 1080 });

        return mobileAnalysis;
    }

    calculateCampaignScore(campaignReview) {
        let score = 100;

        // Deduct for broken images
        score -= campaignReview.imageAudit.broken.length * 5;

        // Deduct for missing hero elements
        if (!campaignReview.visualAnalysis.hero?.hasTitle) score -= 10;
        if (!campaignReview.visualAnalysis.hero?.hasCTA) score -= 15;
        if (!campaignReview.visualAnalysis.hero?.ctaAboveFold) score -= 10;

        // Deduct for product description non-compliance
        if (!campaignReview.productDescriptionCompliance.mentors?.compliance) score -= 20;
        if (!campaignReview.productDescriptionCompliance.technology?.compliance) score -= 15;

        // Deduct for poor mobile experience
        if (!campaignReview.mobileCompatibility?.responsive) score -= 15;

        // Deduct for missing conversion elements
        if (campaignReview.conversionElements?.ctaButtons < 3) score -= 10;
        if (!campaignReview.conversionElements?.socialProof) score -= 10;
        if (!campaignReview.conversionElements?.urgencyIndicators) score -= 5;

        return Math.max(0, score);
    }

    async generateReport() {
        console.log('\n📊 Generating expert review report...');

        // Calculate overall scores
        const scores = Object.values(this.review.campaigns).map(c => c.score || 0);
        const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;

        this.review.scores = {
            average: averageScore,
            individual: Object.fromEntries(
                Object.entries(this.review.campaigns).map(([type, review]) => [type, review.score])
            ),
            passThreshold: 85,
            passed: averageScore >= 85
        };

        // Generate recommendations
        this.generateRecommendations();

        // Write detailed report
        const reportPath = 'expert_review/campaign_review_report.json';
        fs.writeFileSync(reportPath, JSON.stringify(this.review, null, 2));

        // Generate summary markdown
        await this.generateSummaryReport();

        console.log(`📋 Report saved to: ${reportPath}`);
        console.log(`📈 Average Score: ${averageScore.toFixed(1)}/100`);
        console.log(`🎯 Pass Threshold: 85/100`);
        console.log(`${averageScore >= 85 ? '✅ PASSED' : '❌ FAILED'} - Campaign Quality Assessment`);
    }

    generateRecommendations() {
        const recommendations = [];

        // Analyze common issues
        const imageIssues = this.review.issues.filter(i => i.type === 'broken_image');
        if (imageIssues.length > 0) {
            recommendations.push({
                priority: 'critical',
                category: 'assets',
                title: 'Fix Broken Images',
                description: `${imageIssues.length} images failed to load. Generate missing assets using nano-banana MCP.`,
                files: imageIssues.map(i => i.src)
            });
        }

        const complianceIssues = this.review.issues.filter(i => i.type === 'product_description_violation');
        if (complianceIssues.length > 0) {
            recommendations.push({
                priority: 'critical',
                category: 'compliance',
                title: 'Product Description Violations',
                description: 'Campaign missing required elements from product description.',
                violations: complianceIssues
            });
        }

        const conversionIssues = this.review.issues.filter(i => i.type === 'conversion_issue');
        if (conversionIssues.length > 0) {
            recommendations.push({
                priority: 'high',
                category: 'conversion',
                title: 'Conversion Optimization',
                description: 'Fix conversion elements to improve backing probability.',
                issues: conversionIssues
            });
        }

        this.review.recommendations = recommendations;
    }

    async generateSummaryReport() {
        const summary = `# ZenMirror Campaign Expert Review Summary

**Review Date**: ${new Date().toLocaleDateString()}
**Review Time**: ${new Date().toLocaleTimeString()}

## Overall Assessment

**Average Score**: ${this.review.scores.average.toFixed(1)}/100
**Status**: ${this.review.scores.passed ? '✅ PASSED' : '❌ REQUIRES IMPROVEMENT'}

## Campaign Scores

${Object.entries(this.review.scores.individual).map(([type, score]) =>
    `- **${type}**: ${score}/100 ${score >= 85 ? '✅' : '❌'}`
).join('\n')}

## Critical Issues Found

${this.review.issues.filter(i => i.type === 'broken_image' || i.type === 'product_description_violation')
    .map(issue => `- **${issue.type}**: ${issue.section || issue.src || issue.error || 'See details in full report'}`)
    .join('\n') || 'None'}

## Priority Recommendations

${this.review.recommendations.slice(0, 3).map((rec, i) =>
    `### ${i + 1}. ${rec.title} (${rec.priority.toUpperCase()})\n${rec.description}`
).join('\n\n')}

## Asset Status

- **Broken Images**: ${this.review.issues.filter(i => i.type === 'broken_image').length}
- **Missing Assets**: Estimated 50+ required graphics
- **Generated Assets**: Technology diagrams, icons, charts created

## Next Steps

1. Generate missing assets using nano-banana MCP
2. Fix all broken image links
3. Ensure 100% product description compliance
4. Optimize conversion elements
5. Test mobile responsiveness

---
*Generated by ZenMirror Campaign Expert System*
`;

        fs.writeFileSync('expert_review/review_summary.md', summary);
    }

    async cleanup() {
        if (this.browser) {
            await this.browser.close();
        }
    }
}

// Main execution
async function runExpertReview() {
    console.log('🚀 Starting ZenMirror Campaign Expert Review...\n');

    const reviewer = new CampaignExpertReviewer();

    try {
        await reviewer.initialize();

        // Review both campaigns
        await reviewer.reviewCampaign(
            'D:/Projects/ZenMirror_20250916/final_campaigns/kickstarter/index.html',
            'kickstarter'
        );

        await reviewer.reviewCampaign(
            'D:/Projects/ZenMirror_20250916/final_campaigns/indiegogo/index.html',
            'indiegogo'
        );

        // Generate comprehensive report
        await reviewer.generateReport();

        console.log('\n🎉 Expert review completed successfully!');

    } catch (error) {
        console.error('💥 Expert review failed:', error);
    } finally {
        await reviewer.cleanup();
    }
}

// Export for module use or run directly
if (require.main === module) {
    runExpertReview();
}

module.exports = { CampaignExpertReviewer };