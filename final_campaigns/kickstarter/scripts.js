/* ZenMirror Kickstarter Campaign JavaScript - Interactive Implementation */

// Global configuration
const ZenMirror = {
    config: {
        smoothScrollDuration: 800,
        animationObserverThreshold: 0.1,
        lazyLoadThreshold: 0.1,
        autoPlayDelay: 3000,
        typewriterSpeed: 50
    },

    // State management
    state: {
        isLoaded: false,
        activeSection: 'hero',
        animatedElements: new Set(),
        scrollPosition: 0,
        isMobile: window.innerWidth <= 768
    },

    // Initialize the application
    init() {
        this.setupEventListeners();
        this.initAnimations();
        this.initScrollEffects();
        this.initLazyLoading();
        this.initProgressTracking();
        this.initMobileOptimizations();
        this.state.isLoaded = true;
        console.log('ZenMirror Kickstarter initialized successfully');
    }
};

// Event Listeners Setup
ZenMirror.setupEventListeners = function() {
    // DOM Content Loaded
    document.addEventListener('DOMContentLoaded', () => {
        this.initNavigation();
        this.initVideoPlayers();
        this.initRewardTiers();
        this.initFAQAccordion();
        this.initTestimonialCarousel();
    });

    // Window events
    window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 16));
    window.addEventListener('resize', this.throttle(this.handleResize.bind(this), 100));
    window.addEventListener('load', this.handlePageLoad.bind(this));

    // Performance optimization
    window.addEventListener('beforeunload', this.cleanup.bind(this));
};

// Navigation functionality
ZenMirror.initNavigation = function() {
    const nav = document.querySelector('.nav-header');
    const navLinks = document.querySelectorAll('.nav-links a');

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            this.smoothScrollTo(targetId);
            this.trackEvent('navigation_click', { target: targetId });
        });
    });

    // Sticky navigation with background change
    this.updateNavigation = () => {
        const scrolled = window.scrollY > 50;
        nav.style.background = scrolled
            ? 'rgba(253, 252, 248, 0.98)'
            : 'rgba(253, 252, 248, 0.95)';
        nav.style.boxShadow = scrolled
            ? '0 2px 20px rgba(45, 91, 62, 0.1)'
            : 'none';
    };
};

// Smooth scrolling implementation
ZenMirror.smoothScrollTo = function(targetId, offset = 80) {
    const target = document.getElementById(targetId);
    if (!target) return;

    const targetPosition = target.offsetTop - offset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = this.config.smoothScrollDuration;
    let start = null;

    const animation = (currentTime) => {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const progress = Math.min(timeElapsed / duration, 1);

        // Easing function for smooth animation
        const easeInOutCubic = progress => progress < 0.5
            ? 4 * progress * progress * progress
            : (progress - 1) * (2 * progress - 2) * (2 * progress - 2) + 1;

        window.scrollTo(0, startPosition + distance * easeInOutCubic(progress));

        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    };

    requestAnimationFrame(animation);
};

// Scroll to rewards functionality
window.scrollToRewards = function() {
    const rewardsSection = document.querySelector('.rewards-sidebar');
    if (rewardsSection) {
        rewardsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
    ZenMirror.trackEvent('cta_click', { source: 'hero_button' });
};

// Video player functionality
ZenMirror.initVideoPlayers = function() {
    const videoContainers = document.querySelectorAll('.video-container');

    videoContainers.forEach(container => {
        const placeholder = container.querySelector('.video-placeholder');
        const playButton = container.querySelector('.play-button');

        if (placeholder && playButton) {
            placeholder.addEventListener('click', () => {
                this.playVideo(container);
                this.trackEvent('video_play', { source: 'hero_video' });
            });
        }
    });
};

ZenMirror.playVideo = function(container) {
    // Show message that video will be available soon
    const placeholder = container.querySelector('.video-placeholder');
    if (placeholder) {
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, var(--zen-forest-dark), var(--zen-sage));
            color: white;
            font-size: 1.2rem;
            text-align: center;
            padding: 2rem;
            border-radius: 12px;
        `;
        messageDiv.innerHTML = `
            <div>
                <div style="font-size: 3rem; margin-bottom: 1rem;">🎬</div>
                <div>Demo video coming soon!</div>
                <div style="font-size: 0.9rem; margin-top: 0.5rem; opacity: 0.8;">
                    We're putting the finishing touches on our demonstration video.
                </div>
            </div>
        `;
        container.replaceChild(messageDiv, placeholder);
    }

    this.trackEvent('video_placeholder_clicked', { source: 'hero_video' });
};

// Reward tiers interaction
ZenMirror.initRewardTiers = function() {
    const rewardTiers = document.querySelectorAll('.reward-tier');

    rewardTiers.forEach((tier, index) => {
        const button = tier.querySelector('.btn-primary, .btn-secondary');

        if (button) {
            button.addEventListener('click', () => {
                this.selectRewardTier(index);
                this.trackEvent('reward_select', { tier_index: index });
            });
        }

        // Hover effects for reward tiers
        tier.addEventListener('mouseenter', () => {
            tier.style.transform = 'translateY(-4px)';
            tier.style.boxShadow = '0 8px 40px rgba(45, 91, 62, 0.16)';
        });

        tier.addEventListener('mouseleave', () => {
            tier.style.transform = 'translateY(0)';
            tier.style.boxShadow = '0 4px 24px rgba(45, 91, 62, 0.12)';
        });
    });
};

ZenMirror.selectRewardTier = function(tierIndex) {
    // Highlight selected tier
    const tiers = document.querySelectorAll('.reward-tier');
    tiers.forEach((tier, index) => {
        tier.classList.toggle('selected', index === tierIndex);
    });

    // Show selection feedback
    this.showNotification('Reward tier selected! Redirecting to checkout...', 'success');

    // Simulate checkout redirect (would integrate with actual payment system)
    setTimeout(() => {
        console.log(`Redirecting to checkout for tier ${tierIndex}`);
        // window.location.href = `/checkout?tier=${tierIndex}`;
    }, 1500);
};

// Animation system
ZenMirror.initAnimations = function() {
    // Intersection Observer for scroll animations
    this.animationObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.state.animatedElements.has(entry.target)) {
                    this.animateElement(entry.target);
                    this.state.animatedElements.add(entry.target);
                }
            });
        },
        { threshold: this.config.animationObserverThreshold }
    );

    // Observe animation targets
    const animationTargets = document.querySelectorAll(
        '.hero-content, .product-showcase, .comparison-item, .tech-feature, ' +
        '.mentor-card, .feature-card, .timeline-item, .testimonial'
    );

    animationTargets.forEach(target => {
        this.animationObserver.observe(target);
    });

    // Initialize special animations
    this.initRadarAnimation();
    this.initCounterAnimations();
    this.initProgressBarAnimations();
};

ZenMirror.animateElement = function(element) {
    const animationType = element.dataset.animation || 'fade-in';

    switch (animationType) {
        case 'slide-up':
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'all 0.6s ease-out';

            requestAnimationFrame(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            });
            break;

        case 'fade-in':
        default:
            element.style.opacity = '0';
            element.style.transition = 'opacity 0.8s ease-out';

            requestAnimationFrame(() => {
                element.style.opacity = '1';
            });
            break;
    }
};

// Radar animation
ZenMirror.initRadarAnimation = function() {
    const radarElement = document.querySelector('.radar-animation');
    if (!radarElement) return;

    // Enhanced radar pulse animation
    const pulseInterval = setInterval(() => {
        if (!this.isElementVisible(radarElement)) return;

        radarElement.style.animation = 'none';
        requestAnimationFrame(() => {
            radarElement.style.animation = 'radarPulse 3s ease-in-out';
        });
    }, 3000);

    // Cleanup interval when element is no longer visible
    this.cleanupTasks = this.cleanupTasks || [];
    this.cleanupTasks.push(() => clearInterval(pulseInterval));
};

// Counter animations
ZenMirror.initCounterAnimations = function() {
    const counters = document.querySelectorAll('.stat strong, .metric-value, .stretch-amount');

    counters.forEach(counter => {
        this.animationObserver.observe(counter);
        counter.addEventListener('animationstart', () => {
            this.animateCounter(counter);
        });
    });
};

ZenMirror.animateCounter = function(element) {
    const text = element.textContent;
    const number = parseInt(text.replace(/[^\d]/g, ''));

    if (isNaN(number)) return;

    const duration = 2000;
    const increment = number / (duration / 16);
    let current = 0;

    const updateCounter = () => {
        current += increment;
        if (current >= number) {
            element.textContent = text;
        } else {
            const displayValue = Math.floor(current);
            element.textContent = text.replace(number.toString(), displayValue.toString());
            requestAnimationFrame(updateCounter);
        }
    };

    updateCounter();
};

// Progress bar animations
ZenMirror.initProgressBarAnimations = function() {
    const progressBars = document.querySelectorAll('.progress-fill');

    progressBars.forEach(bar => {
        const targetWidth = bar.style.width;
        bar.style.width = '0%';

        this.animationObserver.observe(bar);

        const animateProgress = () => {
            bar.style.transition = 'width 2s ease-out';
            bar.style.width = targetWidth;
        };

        // Trigger animation when visible
        setTimeout(animateProgress, 500);
    });
};

// Scroll effects
ZenMirror.initScrollEffects = function() {
    // Parallax effects for hero background
    this.initParallaxEffects();

    // Section tracking for navigation
    this.initSectionTracking();

    // Progress indicator
    this.initScrollProgress();
};

ZenMirror.initParallaxEffects = function() {
    const parallaxElements = document.querySelectorAll('.hero-background, .radar-animation');

    this.updateParallax = () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;

        parallaxElements.forEach(element => {
            element.style.transform = `translate3d(0, ${rate}px, 0)`;
        });
    };
};

ZenMirror.initSectionTracking = function() {
    const sections = document.querySelectorAll('section[id]');

    this.trackSections = () => {
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                if (this.state.activeSection !== sectionId) {
                    this.state.activeSection = sectionId;
                    this.updateActiveNavLink(sectionId);
                }
            }
        });
    };
};

ZenMirror.updateActiveNavLink = function(sectionId) {
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href').substring(1);
        link.classList.toggle('active', href === sectionId);
    });
};

ZenMirror.initScrollProgress = function() {
    // Create progress indicator
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 70px;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--zen-orange-accent), var(--zen-orange-warm));
        z-index: 999;
        transition: width 0.1s ease-out;
    `;
    document.body.appendChild(progressBar);

    this.updateScrollProgress = () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
    };
};

// Lazy loading implementation
ZenMirror.initLazyLoading = function() {
    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading supported
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    } else {
        // Fallback intersection observer
        this.lazyLoadObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        this.lazyLoadObserver.unobserve(img);
                    }
                });
            },
            { threshold: this.config.lazyLoadThreshold }
        );

        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => this.lazyLoadObserver.observe(img));
    }
};

// Progress tracking
ZenMirror.initProgressTracking = function() {
    // Track user engagement
    this.engagementTimer = setInterval(() => {
        if (this.isPageVisible()) {
            this.trackEvent('engagement_30s', {
                section: this.state.activeSection,
                time_on_page: this.getTimeOnPage()
            });
        }
    }, 30000);

    // Track scroll depth
    this.maxScrollDepth = 0;
    this.trackScrollDepth = () => {
        const scrollPercent = Math.round(
            (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        );

        if (scrollPercent > this.maxScrollDepth) {
            this.maxScrollDepth = scrollPercent;

            // Track milestone scroll depths
            if ([25, 50, 75, 90].includes(scrollPercent)) {
                this.trackEvent('scroll_depth', { percent: scrollPercent });
            }
        }
    };
};

// FAQ Accordion
ZenMirror.initFAQAccordion = function() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('h3');
        const answer = item.querySelector('p');

        if (question && answer) {
            // Initially collapse answers
            answer.style.maxHeight = '0';
            answer.style.overflow = 'hidden';
            answer.style.transition = 'max-height 0.3s ease-out';
            item.style.cursor = 'pointer';

            item.addEventListener('click', () => {
                const isOpen = answer.style.maxHeight !== '0px';

                if (isOpen) {
                    answer.style.maxHeight = '0';
                    item.classList.remove('open');
                } else {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    item.classList.add('open');
                }

                this.trackEvent('faq_toggle', {
                    question: question.textContent,
                    action: isOpen ? 'close' : 'open'
                });
            });
        }
    });
};

// Testimonial carousel
ZenMirror.initTestimonialCarousel = function() {
    const testimonials = document.querySelectorAll('.testimonial');
    if (testimonials.length <= 1) return;

    let currentIndex = 0;
    const totalTestimonials = testimonials.length;

    // Auto-rotate testimonials
    const rotateTestimonials = () => {
        testimonials.forEach((testimonial, index) => {
            testimonial.style.opacity = index === currentIndex ? '1' : '0.5';
            testimonial.style.transform = index === currentIndex
                ? 'scale(1)'
                : 'scale(0.95)';
        });

        currentIndex = (currentIndex + 1) % totalTestimonials;
    };

    // Initial setup
    testimonials.forEach(testimonial => {
        testimonial.style.transition = 'all 0.5s ease-in-out';
    });

    // Start rotation
    rotateTestimonials();
    this.testimonialInterval = setInterval(rotateTestimonials, 5000);
};

// Mobile optimizations
ZenMirror.initMobileOptimizations = function() {
    if (!this.state.isMobile) return;

    // Reduce animation complexity on mobile
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 768px) {
            .radar-animation,
            .wave,
            .parallax-element {
                animation: none !important;
                transform: none !important;
            }
        }
    `;
    document.head.appendChild(style);

    // Touch-friendly interactions
    this.initTouchGestures();
};

ZenMirror.initTouchGestures = function() {
    let touchStartX = 0;
    let touchStartY = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;

        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        // Detect swipe gestures
        if (Math.abs(deltaX) > 50 && Math.abs(deltaY) < 100) {
            if (deltaX > 0) {
                this.trackEvent('swipe', { direction: 'right' });
            } else {
                this.trackEvent('swipe', { direction: 'left' });
            }
        }
    }, { passive: true });
};

// Utility functions
ZenMirror.handleScroll = function() {
    this.state.scrollPosition = window.scrollY;

    // Execute scroll-related functions
    if (this.updateNavigation) this.updateNavigation();
    if (this.updateParallax) this.updateParallax();
    if (this.trackSections) this.trackSections();
    if (this.updateScrollProgress) this.updateScrollProgress();
    if (this.trackScrollDepth) this.trackScrollDepth();
};

ZenMirror.handleResize = function() {
    const wasMobile = this.state.isMobile;
    this.state.isMobile = window.innerWidth <= 768;

    if (wasMobile !== this.state.isMobile) {
        // Re-initialize mobile optimizations if needed
        this.initMobileOptimizations();
    }
};

ZenMirror.handlePageLoad = function() {
    // Page fully loaded - optimize performance
    this.preloadCriticalAssets();
    this.initPerformanceMonitoring();
};

ZenMirror.preloadCriticalAssets = function() {
    const criticalAssets = [
        '../../assets/images/product/zenmirror-device.png',
        './assets/video-thumbnail.jpg'
    ];

    criticalAssets.forEach(asset => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = asset;
        link.as = 'image';
        document.head.appendChild(link);
    });
};

ZenMirror.initPerformanceMonitoring = function() {
    // Monitor page performance
    if ('performance' in window) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        this.trackEvent('page_load_time', { duration: loadTime });

        // Monitor largest contentful paint
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.trackEvent('largest_contentful_paint', {
                    duration: lastEntry.startTime
                });
            });
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
        }
    }
};

// Analytics and tracking
ZenMirror.trackEvent = function(eventName, properties = {}) {
    const eventData = {
        event: eventName,
        timestamp: new Date().toISOString(),
        page: 'kickstarter_campaign',
        user_agent: navigator.userAgent,
        viewport: {
            width: window.innerWidth,
            height: window.innerHeight
        },
        ...properties
    };

    // Console logging for development
    console.log('Event tracked:', eventData);

    // Integration points for analytics services
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, properties);
    }

    if (typeof fbq !== 'undefined') {
        fbq('track', eventName, properties);
    }

    // Custom analytics endpoint
    if (this.config.analyticsEndpoint) {
        fetch(this.config.analyticsEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(eventData)
        }).catch(err => console.warn('Analytics error:', err));
    }
};

// Notification system
ZenMirror.showNotification = function(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease-out;
        max-width: 400px;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
    `;

    // Set background color based on type
    const colors = {
        success: 'linear-gradient(135deg, #4a7c59, #6b8e5a)',
        error: 'linear-gradient(135deg, #c65d21, #d97a34)',
        warning: 'linear-gradient(135deg, #d97a34, #e89851)',
        info: 'linear-gradient(135deg, #2d5b3e, #4a7c59)'
    };
    notification.style.background = colors[type] || colors.info;

    notification.textContent = message;
    document.body.appendChild(notification);

    // Animate in
    requestAnimationFrame(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    });

    // Auto remove
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => document.body.removeChild(notification), 300);
    }, duration);
};

// Helper utilities
ZenMirror.throttle = function(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

ZenMirror.debounce = function(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

ZenMirror.isElementVisible = function(element) {
    const rect = element.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
};

ZenMirror.isPageVisible = function() {
    return document.visibilityState === 'visible';
};

ZenMirror.getTimeOnPage = function() {
    return Date.now() - this.startTime;
};

// Cleanup function
ZenMirror.cleanup = function() {
    // Clear intervals and observers
    if (this.testimonialInterval) clearInterval(this.testimonialInterval);
    if (this.engagementTimer) clearInterval(this.engagementTimer);
    if (this.animationObserver) this.animationObserver.disconnect();
    if (this.lazyLoadObserver) this.lazyLoadObserver.disconnect();

    // Execute custom cleanup tasks
    if (this.cleanupTasks) {
        this.cleanupTasks.forEach(task => task());
    }
};

// Error handling
window.addEventListener('error', (event) => {
    ZenMirror.trackEvent('javascript_error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
    });
});

// Performance monitoring
ZenMirror.startTime = Date.now();

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ZenMirror.init());
} else {
    ZenMirror.init();
}

// Export for potential external use
window.ZenMirror = ZenMirror;