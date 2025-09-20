/**
 * ZenMirror Kickstarter Campaign Interactive Scripts
 * Handles user interactions, animations, and dynamic content
 */

// Global configuration
const ZenMirror = {
    config: {
        animationSpeed: 300,
        scrollOffset: 80,
        autoplayInterval: 5000,
        radarPulseSpeed: 3000
    },

    // Initialize all functionality when DOM is loaded
    init() {
        this.setupNavigation();
        this.setupHeroAnimations();
        this.setupScrollEffects();
        this.setupRewardInteractions();
        this.setupVideoPlayer();
        this.setupMentorCards();
        this.setupCountdown();
        this.setupProgressTracking();
        this.setupAccessibility();
        this.setupPerformanceOptimizations();
    }
};

// Navigation functionality
ZenMirror.setupNavigation = function() {
    const nav = document.querySelector('.nav-header');
    const navLinks = document.querySelectorAll('.nav-links a');

    // Handle navigation background on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const offsetTop = targetElement.offsetTop - ZenMirror.config.scrollOffset;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile navigation toggle
    const createMobileNav = () => {
        const mobileToggle = document.createElement('button');
        mobileToggle.className = 'mobile-nav-toggle';
        mobileToggle.innerHTML = '☰';
        mobileToggle.setAttribute('aria-label', 'Toggle navigation');

        const navContainer = document.querySelector('.nav-container');
        navContainer.insertBefore(mobileToggle, document.querySelector('.nav-links'));

        mobileToggle.addEventListener('click', () => {
            const navLinks = document.querySelector('.nav-links');
            navLinks.classList.toggle('mobile-open');
            mobileToggle.innerHTML = navLinks.classList.contains('mobile-open') ? '✕' : '☰';
        });
    };

    if (window.innerWidth <= 768) {
        createMobileNav();
    }

    window.addEventListener('resize', () => {
        if (window.innerWidth <= 768 && !document.querySelector('.mobile-nav-toggle')) {
            createMobileNav();
        }
    });
};

// Hero section animations
ZenMirror.setupHeroAnimations = function() {
    const heroElements = {
        badge: document.querySelector('.hero-badge'),
        title: document.querySelector('.hero-title'),
        subtitle: document.querySelector('.hero-subtitle'),
        features: document.querySelector('.hero-features'),
        cta: document.querySelector('.hero-cta'),
        stats: document.querySelector('.hero-stats'),
        visual: document.querySelector('.hero-visual')
    };

    // Animate elements on load
    window.addEventListener('load', () => {
        Object.values(heroElements).forEach((element, index) => {
            if (element) {
                setTimeout(() => {
                    element.style.opacity = '0';
                    element.style.transform = 'translateY(30px)';
                    element.style.transition = 'all 0.8s ease';

                    requestAnimationFrame(() => {
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0)';
                    });
                }, index * 150);
            }
        });
    });

    // Enhanced radar animation
    const setupRadarEffect = () => {
        const radarWaves = document.querySelectorAll('.wave');
        let waveIndex = 0;

        const animateWave = () => {
            radarWaves.forEach((wave, index) => {
                wave.style.opacity = '0';
                wave.style.transform = 'scale(0.8)';

                setTimeout(() => {
                    wave.style.transition = 'all 2s ease-out';
                    wave.style.opacity = '0.6';
                    wave.style.transform = 'scale(1.4)';

                    setTimeout(() => {
                        wave.style.opacity = '0';
                    }, 1500);
                }, index * 500);
            });
        };

        setInterval(animateWave, ZenMirror.config.radarPulseSpeed);
        animateWave(); // Initial trigger
    };

    setupRadarEffect();

    // Live data simulation
    const simulateVitalSigns = () => {
        const heartRate = document.querySelector('.vital-signs .sign:nth-child(1) .value');
        const breathRate = document.querySelector('.vital-signs .sign:nth-child(2) .value');
        const hrvScore = document.querySelector('.vital-signs .sign:nth-child(3) .value');

        if (heartRate && breathRate && hrvScore) {
            setInterval(() => {
                // Simulate realistic meditation values
                const hr = Math.floor(Math.random() * 10) + 65; // 65-75 BPM
                const br = Math.floor(Math.random() * 3) + 5; // 5-8 breaths/min
                const hrv = Math.floor(Math.random() * 20) + 80; // 80-100 HRV

                heartRate.textContent = `${hr} BPM`;
                breathRate.textContent = `${br}/min`;
                hrvScore.textContent = hrv;
            }, 3000);
        }
    };

    simulateVitalSigns();
};

// Scroll-triggered animations and effects
ZenMirror.setupScrollEffects = function() {
    // Intersection Observer for reveal animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');

                // Special handling for counters
                if (entry.target.classList.contains('community-stats')) {
                    animateCounters(entry.target);
                }

                // Special handling for progress bars
                if (entry.target.classList.contains('comparison-table')) {
                    animateProgressBars(entry.target);
                }

                // Special handling for timeline
                if (entry.target.classList.contains('timeline-item')) {
                    animateTimelineItem(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe all animatable elements
    const animatableElements = document.querySelectorAll(`
        .tech-feature, .feature-card, .mentor-card, .research-item,
        .timeline-item, .stretch-goal, .team-member, .testimonial,
        .community-stats, .comparison-table, .loop-step
    `);

    animatableElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.8s ease';
        observer.observe(element);
    });

    // Parallax effects for hero background
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroBackground = document.querySelector('.hero-background');

        if (heroBackground) {
            const yPos = -(scrolled * 0.3);
            heroBackground.style.transform = `translateY(${yPos}px)`;
        }
    });

    // Add revealed class styles
    const style = document.createElement('style');
    style.textContent = `
        .revealed {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
};

// Counter animation for statistics
function animateCounters(container) {
    const counters = container.querySelectorAll('.stat-item strong, .stat strong');

    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/[^0-9]/g, ''));
        const increment = target / 100;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }

            // Format based on original text
            const originalText = counter.textContent;
            if (originalText.includes('K')) {
                counter.textContent = Math.floor(current / 1000) + 'K+';
            } else if (originalText.includes('%')) {
                counter.textContent = Math.floor(current) + '%';
            } else if (originalText.includes('$')) {
                counter.textContent = '$' + Math.floor(current) + 'K';
            } else {
                counter.textContent = Math.floor(current).toLocaleString();
            }
        }, 20);
    });
}

// Timeline animation
function animateTimelineItem(item) {
    const marker = item.querySelector('.timeline-marker');
    const content = item.querySelector('.timeline-content');

    setTimeout(() => {
        if (marker) marker.style.transform = 'scale(1.2)';
    }, 200);

    setTimeout(() => {
        if (marker) marker.style.transform = 'scale(1)';
    }, 400);
}

// Reward tier interactions
ZenMirror.setupRewardInteractions = function() {
    const rewardTiers = document.querySelectorAll('.reward-tier');
    const selectButtons = document.querySelectorAll('.reward-tier .btn-primary, .reward-tier .btn-secondary');

    // Tier selection handling
    selectButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            const tier = this.closest('.reward-tier');
            const tierTitle = tier.querySelector('h4').textContent;
            const tierPrice = tier.querySelector('.tier-price').textContent;

            // Remove previous selections
            rewardTiers.forEach(t => t.classList.remove('selected'));

            // Add selection to current tier
            tier.classList.add('selected');

            // Show selection feedback
            showSelectionFeedback(tierTitle, tierPrice);

            // Scroll to checkout or show modal
            showCheckoutModal(tier);
        });
    });

    // Hover effects for tiers
    rewardTiers.forEach(tier => {
        tier.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 15px 50px rgba(45,91,62,0.15)';
        });

        tier.addEventListener('mouseleave', function() {
            if (!this.classList.contains('selected')) {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 10px 40px rgba(45,91,62,0.08)';
            }
        });
    });

    // Update remaining quantities dynamically
    updateRemainingQuantities();
};

function showSelectionFeedback(title, price) {
    const feedback = document.createElement('div');
    feedback.className = 'selection-feedback';
    feedback.innerHTML = `
        <div class="feedback-content">
            <h4>Selected: ${title}</h4>
            <p>Price: ${price}</p>
            <button class="btn-primary" onclick="this.parentElement.parentElement.remove()">
                Continue to Checkout →
            </button>
        </div>
    `;

    feedback.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 2rem;
        border-radius: 15px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;

    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 9999;
        animation: fadeIn 0.3s ease;
    `;

    overlay.addEventListener('click', () => {
        document.body.removeChild(overlay);
        document.body.removeChild(feedback);
    });

    document.body.appendChild(overlay);
    document.body.appendChild(feedback);
}

function showCheckoutModal(tier) {
    // Implement checkout modal functionality
    console.log('Checkout modal for tier:', tier.querySelector('h4').textContent);
}

function updateRemainingQuantities() {
    // Simulate real-time updates of remaining quantities
    const remainingElements = document.querySelectorAll('.tier-remaining');

    remainingElements.forEach(element => {
        const currentText = element.textContent;
        const match = currentText.match(/(\d+) of (\d+) remaining/);

        if (match) {
            let remaining = parseInt(match[1]);
            const total = parseInt(match[2]);

            setInterval(() => {
                if (remaining > 0 && Math.random() < 0.1) { // 10% chance per interval
                    remaining--;
                    element.textContent = `${remaining} of ${total} remaining`;

                    if (remaining <= 10) {
                        element.style.color = '#dc3545';
                        element.style.fontWeight = 'bold';
                    }
                }
            }, 30000); // Check every 30 seconds
        }
    });
}

// Video player functionality
ZenMirror.setupVideoPlayer = function() {
    const videoPlaceholder = document.querySelector('.video-placeholder');
    const playButton = videoPlaceholder?.querySelector('.play-button');

    if (playButton) {
        playButton.addEventListener('click', function() {
            // Create video element
            const video = document.createElement('video');
            video.src = './assets/zenmirror-demo.mp4';
            video.controls = true;
            video.autoplay = true;
            video.style.width = '100%';
            video.style.borderRadius = '20px';

            // Replace placeholder with video
            videoPlaceholder.innerHTML = '';
            videoPlaceholder.appendChild(video);

            // Track video interaction
            trackEvent('video_play', 'engagement', 'demo_video');
        });
    }
};

// Mentor card interactions
ZenMirror.setupMentorCards = function() {
    const mentorCards = document.querySelectorAll('.mentor-card');

    mentorCards.forEach(card => {
        card.addEventListener('click', function() {
            // Show detailed mentor information
            showMentorDetails(this);
        });

        // Add audio preview on hover
        card.addEventListener('mouseenter', function() {
            const mentorName = this.querySelector('h3').textContent;
            preloadAudioSample(mentorName);
        });
    });
};

function showMentorDetails(card) {
    const mentorName = card.querySelector('h3').textContent;
    const mentorPhilosophy = card.querySelector('.mentor-philosophy').textContent;
    const mentorDescription = card.querySelector('.mentor-description').textContent;

    const modal = document.createElement('div');
    modal.className = 'mentor-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            <div class="mentor-detail">
                <h2>${mentorName}</h2>
                <p class="philosophy">${mentorPhilosophy}</p>
                <p class="description">${mentorDescription}</p>
                <div class="audio-preview">
                    <button class="btn-primary play-sample">
                        🔊 Listen to Voice Sample
                    </button>
                </div>
                <div class="mentor-metrics">
                    <h3>Personalization Features</h3>
                    <ul>
                        <li>Adapts to your meditation style</li>
                        <li>Learns optimal feedback timing</li>
                        <li>Adjusts guidance intensity</li>
                        <li>Remembers your preferences</li>
                    </ul>
                </div>
            </div>
        </div>
    `;

    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    // Close modal functionality
    const closeModal = () => {
        document.body.removeChild(modal);
        document.body.style.overflow = 'auto';
    };

    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-overlay').addEventListener('click', closeModal);

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    trackEvent('mentor_details', 'engagement', mentorName);
}

function preloadAudioSample(mentorName) {
    // Preload audio sample for better UX
    const audio = new Audio(`./assets/audio/${mentorName.toLowerCase().replace(/\s+/g, '-')}-sample.mp3`);
    audio.preload = 'metadata';
}

// Countdown timer for campaign
ZenMirror.setupCountdown = function() {
    const countdownElement = document.querySelector('.hero-stats .stat:last-child strong');

    if (countdownElement) {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 18); // 18 days from now

        const updateCountdown = () => {
            const now = new Date();
            const timeLeft = endDate - now;

            if (timeLeft > 0) {
                const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
                const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

                if (days > 0) {
                    countdownElement.textContent = `${days}`;
                    countdownElement.nextElementSibling.textContent = 'days to go';
                } else {
                    countdownElement.textContent = `${hours}`;
                    countdownElement.nextElementSibling.textContent = 'hours left';
                }
            } else {
                countdownElement.textContent = 'Ended';
                countdownElement.nextElementSibling.textContent = '';
            }
        };

        updateCountdown();
        setInterval(updateCountdown, 60000); // Update every minute
    }
};

// Progress tracking and analytics
ZenMirror.setupProgressTracking = function() {
    // Track scroll depth
    let maxScroll = 0;

    window.addEventListener('scroll', () => {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);

        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;

            // Track milestone scroll depths
            if ([25, 50, 75, 90].includes(scrollPercent)) {
                trackEvent('scroll_depth', 'engagement', `${scrollPercent}%`);
            }
        }
    });

    // Track time on page
    const startTime = Date.now();

    window.addEventListener('beforeunload', () => {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        trackEvent('time_on_page', 'engagement', timeSpent);
    });

    // Track CTA clicks
    const ctaButtons = document.querySelectorAll('.btn-primary, .btn-primary-large');
    ctaButtons.forEach(button => {
        button.addEventListener('click', () => {
            trackEvent('cta_click', 'conversion', button.textContent.trim());
        });
    });
};

// Accessibility enhancements
ZenMirror.setupAccessibility = function() {
    // Enhanced keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });

    // Add skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--zen-green-primary);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 0 0 4px 4px;
        z-index: 10000;
        transition: top 0.3s;
    `;

    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '0';
    });

    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });

    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add main content ID
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.id = 'main-content';
    }

    // Enhanced focus indicators
    const style = document.createElement('style');
    style.textContent = `
        .keyboard-navigation *:focus {
            outline: 2px solid var(--zen-orange-accent);
            outline-offset: 2px;
        }

        .skip-link:focus {
            outline: none;
        }
    `;
    document.head.appendChild(style);
};

// Performance optimizations
ZenMirror.setupPerformanceOptimizations = function() {
    // Lazy load images
    const images = document.querySelectorAll('img[src]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        // Move src to data-src for lazy loading
        if (!img.dataset.src && !img.closest('.hero-section')) {
            img.dataset.src = img.src;
            img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlZWUiLz48L3N2Zz4=';
            img.classList.add('lazy');
            imageObserver.observe(img);
        }
    });

    // Debounce scroll events
    let scrollTimeout;
    const originalScrollEvents = [];

    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            originalScrollEvents.forEach(callback => callback());
        }, 10);
    });

    // Preload critical resources
    const preloadResources = [
        './assets/zenmirror-hero.jpg',
        './assets/zenmirror-logo.svg'
    ];

    preloadResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = resource.endsWith('.jpg') ? 'image' : 'image';
        link.href = resource;
        document.head.appendChild(link);
    });
};

// Utility functions
function scrollToRewards() {
    const rewardsSection = document.querySelector('.rewards-sidebar');
    if (rewardsSection) {
        rewardsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function trackEvent(action, category, label) {
    // Analytics tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label
        });
    }

    console.log(`Analytics: ${action} | ${category} | ${label}`);
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('ZenMirror script error:', e);
    trackEvent('javascript_error', 'error', e.message);
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ZenMirror.init());
} else {
    ZenMirror.init();
}

// Export for global access
window.ZenMirror = ZenMirror;