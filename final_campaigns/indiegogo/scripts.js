/* ZenMirror Indiegogo Campaign JavaScript - Advanced Multi-Tab Implementation */

// Global configuration
const ZenMirrorIndiegogo = {
    config: {
        smoothScrollDuration: 800,
        animationObserverThreshold: 0.1,
        lazyLoadThreshold: 0.1,
        autoPlayDelay: 4000,
        typewriterSpeed: 40,
        mentorSwitchDelay: 500,
        stickyCtaThreshold: 300
    },

    // State management
    state: {
        isLoaded: false,
        activeTab: 'story',
        activeMentor: 'zen',
        animatedElements: new Set(),
        scrollPosition: 0,
        isMobile: window.innerWidth <= 768,
        stickyCtaVisible: false,
        galleryItems: [],
        videoPlayers: new Map()
    },

    // Initialize the application
    init() {
        this.setupEventListeners();
        this.initTabSystem();
        this.initAnimations();
        this.initScrollEffects();
        this.initLazyLoading();
        this.initProgressTracking();
        this.initMobileOptimizations();
        this.initStickyElements();
        this.state.isLoaded = true;
        console.log('ZenMirror Indiegogo initialized successfully');
    }
};

// Event Listeners Setup
ZenMirrorIndiegogo.setupEventListeners = function() {
    // DOM Content Loaded
    document.addEventListener('DOMContentLoaded', () => {
        this.initNavigation();
        this.initVideoGallery();
        this.initImageGallery();
        this.initMentorSystem();
        this.initPerkCards();
        this.initUpdateSubscription();
    });

    // Window events
    window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 16));
    window.addEventListener('resize', this.throttle(this.handleResize.bind(this), 100));
    window.addEventListener('load', this.handlePageLoad.bind(this));

    // Performance optimization
    window.addEventListener('beforeunload', this.cleanup.bind(this));

    // Visibility change for performance
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
};

// Tab System Implementation
ZenMirrorIndiegogo.initTabSystem = function() {
    const navTabs = document.querySelectorAll('.nav-tab');
    const tabContents = document.querySelectorAll('.tab-content');

    navTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const targetTab = tab.getAttribute('href').substring(1);
            this.switchTab(targetTab);
            this.trackEvent('tab_switch', { from: this.state.activeTab, to: targetTab });
        });
    });

    // Initialize with default tab
    this.switchTab(this.state.activeTab);

    // URL hash handling
    if (window.location.hash) {
        const hashTab = window.location.hash.substring(1);
        if (document.getElementById(hashTab)) {
            this.switchTab(hashTab);
        }
    }
};

ZenMirrorIndiegogo.switchTab = function(targetTab) {
    // Update navigation
    const navTabs = document.querySelectorAll('.nav-tab');
    navTabs.forEach(tab => {
        const tabTarget = tab.getAttribute('href').substring(1);
        tab.classList.toggle('active', tabTarget === targetTab);
    });

    // Update content
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        const isTarget = content.id === targetTab;
        content.classList.toggle('active', isTarget);
        content.style.display = isTarget ? 'block' : 'none';
    });

    // Update state
    this.state.activeTab = targetTab;

    // Update URL without scrolling
    history.replaceState(null, null, `#${targetTab}`);

    // Initialize tab-specific functionality
    this.initTabSpecificFeatures(targetTab);

    // Animate tab transition
    this.animateTabTransition(targetTab);
};

ZenMirrorIndiegogo.initTabSpecificFeatures = function(tabName) {
    switch (tabName) {
        case 'gallery':
            this.initGalleryInteractions();
            break;
        case 'mentors':
            this.initMentorInteractions();
            break;
        case 'perks':
            this.updatePerksAnimations();
            break;
        case 'updates':
            this.initTimelineAnimations();
            break;
    }
};

ZenMirrorIndiegogo.animateTabTransition = function(tabName) {
    const activeContent = document.getElementById(tabName);
    if (activeContent) {
        activeContent.style.opacity = '0';
        activeContent.style.transform = 'translateY(20px)';

        requestAnimationFrame(() => {
            activeContent.style.transition = 'all 0.4s ease-out';
            activeContent.style.opacity = '1';
            activeContent.style.transform = 'translateY(0)';
        });
    }
};

// Navigation functionality
ZenMirrorIndiegogo.initNavigation = function() {
    const nav = document.querySelector('.nav-header');

    // Sticky navigation with enhanced effects
    this.updateNavigation = () => {
        const scrolled = window.scrollY > 50;
        nav.style.background = scrolled
            ? 'rgba(253, 252, 248, 0.98)'
            : 'rgba(253, 252, 248, 0.95)';
        nav.style.boxShadow = scrolled
            ? '0 4px 20px rgba(45, 91, 62, 0.12)'
            : 'none';
        nav.style.backdropFilter = scrolled ? 'blur(15px)' : 'blur(10px)';
    };
};

// Scroll to perks functionality
window.scrollToPerks = function() {
    ZenMirrorIndiegogo.switchTab('perks');
    setTimeout(() => {
        const perksSection = document.getElementById('perks');
        if (perksSection) {
            perksSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }, 300);
    ZenMirrorIndiegogo.trackEvent('cta_click', { source: 'hero_button' });
};

// Video Gallery Implementation
ZenMirrorIndiegogo.initVideoGallery = function() {
    const videoItems = document.querySelectorAll('.video-item');

    videoItems.forEach((item, index) => {
        const playButton = item.querySelector('.play-button');
        const thumbnail = item.querySelector('.video-thumbnail img');

        if (playButton && thumbnail) {
            item.addEventListener('click', () => {
                this.playVideo(item, index);
                this.trackEvent('video_play', { video_index: index });
            });

            // Hover effects
            item.addEventListener('mouseenter', () => {
                this.animateVideoHover(item, true);
            });

            item.addEventListener('mouseleave', () => {
                this.animateVideoHover(item, false);
            });
        }
    });
};

ZenMirrorIndiegogo.animateVideoHover = function(item, isHovering) {
    const overlay = item.querySelector('.play-overlay');
    const playButton = item.querySelector('.play-button');

    if (overlay) {
        overlay.style.opacity = isHovering ? '1' : '0';
    }

    if (playButton) {
        playButton.style.transform = isHovering ? 'scale(1.1)' : 'scale(1)';
    }
};

ZenMirrorIndiegogo.playVideo = function(container, index) {
    // Create video element dynamically
    const videoElement = document.createElement('video');
    videoElement.controls = true;
    videoElement.autoplay = true;
    videoElement.style.width = '100%';
    videoElement.style.height = '100%';
    videoElement.style.objectFit = 'cover';
    videoElement.style.borderRadius = '12px';

    // Video sources (would be replaced with actual video URLs)
    const videoSources = [
        './assets/videos/zenmirror-hero-demo.mp4',
        './assets/videos/technology-deep-dive.mp4',
        './assets/videos/mentor-personalities.mp4',
        './assets/videos/setup-guide.mp4',
        './assets/videos/user-testimonials.mp4',
        './assets/videos/comparison-demo.mp4'
    ];

    videoElement.src = videoSources[index] || videoSources[0];

    // Replace thumbnail with video
    const thumbnail = container.querySelector('.video-thumbnail');
    if (thumbnail) {
        thumbnail.innerHTML = '';
        thumbnail.appendChild(videoElement);
    }

    // Store video reference
    this.state.videoPlayers.set(index, videoElement);

    // Add video event handlers
    videoElement.addEventListener('ended', () => {
        this.trackEvent('video_complete', { video_index: index });
    });

    videoElement.addEventListener('error', () => {
        this.handleVideoError(container, index);
    });
};

ZenMirrorIndiegogo.handleVideoError = function(container, index) {
    const errorMessage = document.createElement('div');
    errorMessage.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: center;
        height: 200px;
        background: var(--zen-gray-light);
        color: var(--zen-gray-dark);
        border-radius: 12px;
        font-weight: 500;
    `;
    errorMessage.textContent = 'Video temporarily unavailable';

    const thumbnail = container.querySelector('.video-thumbnail');
    if (thumbnail) {
        thumbnail.innerHTML = '';
        thumbnail.appendChild(errorMessage);
    }

    this.trackEvent('video_error', { video_index: index });
};

// Image Gallery Implementation
ZenMirrorIndiegogo.initImageGallery = function() {
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach((item, index) => {
        // Store gallery item data
        this.state.galleryItems.push({
            element: item,
            src: item.querySelector('img').src,
            title: item.querySelector('.item-overlay h4')?.textContent || '',
            description: item.querySelector('.item-overlay p')?.textContent || ''
        });

        item.addEventListener('click', () => {
            this.openLightbox(index);
            this.trackEvent('gallery_view', { image_index: index });
        });

        // Hover effects
        item.addEventListener('mouseenter', () => {
            this.animateGalleryHover(item, true);
        });

        item.addEventListener('mouseleave', () => {
            this.animateGalleryHover(item, false);
        });
    });
};

ZenMirrorIndiegogo.animateGalleryHover = function(item, isHovering) {
    const overlay = item.querySelector('.item-overlay');
    const img = item.querySelector('img');

    if (overlay) {
        overlay.style.transform = isHovering ? 'translateY(0)' : 'translateY(100%)';
    }

    if (img) {
        img.style.transform = isHovering ? 'scale(1.05)' : 'scale(1)';
    }
};

ZenMirrorIndiegogo.openLightbox = function(startIndex) {
    // Create lightbox
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.9);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease-out;
    `;

    // Create lightbox content
    const content = document.createElement('div');
    content.style.cssText = `
        max-width: 90vw;
        max-height: 90vh;
        position: relative;
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    `;

    // Add image
    const img = document.createElement('img');
    img.src = this.state.galleryItems[startIndex].src;
    img.style.cssText = `
        width: 100%;
        height: auto;
        display: block;
    `;

    // Add close button
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '×';
    closeButton.style.cssText = `
        position: absolute;
        top: 1rem;
        right: 1rem;
        width: 40px;
        height: 40px;
        border: none;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 50%;
        font-size: 24px;
        cursor: pointer;
        z-index: 2;
        transition: all 0.2s ease-out;
    `;

    closeButton.addEventListener('click', () => {
        this.closeLightbox(lightbox);
    });

    // Add navigation if multiple images
    if (this.state.galleryItems.length > 1) {
        this.addLightboxNavigation(content, startIndex);
    }

    // Assemble lightbox
    content.appendChild(img);
    content.appendChild(closeButton);
    lightbox.appendChild(content);
    document.body.appendChild(lightbox);

    // Animate in
    requestAnimationFrame(() => {
        lightbox.style.opacity = '1';
    });

    // Close on outside click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            this.closeLightbox(lightbox);
        }
    });

    // Close on escape key
    const escapeHandler = (e) => {
        if (e.key === 'Escape') {
            this.closeLightbox(lightbox);
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);
};

ZenMirrorIndiegogo.closeLightbox = function(lightbox) {
    lightbox.style.opacity = '0';
    setTimeout(() => {
        document.body.removeChild(lightbox);
    }, 300);
};

// Mentor System Implementation
ZenMirrorIndiegogo.initMentorSystem = function() {
    const mentorTabs = document.querySelectorAll('.mentor-tab');
    const mentorProfiles = document.querySelectorAll('.mentor-profile');

    mentorTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const mentorId = tab.dataset.mentor;
            this.switchMentor(mentorId);
            this.trackEvent('mentor_select', { mentor: mentorId });
        });
    });

    // Initialize with default mentor
    this.switchMentor(this.state.activeMentor);
};

ZenMirrorIndiegogo.switchMentor = function(mentorId) {
    // Update tabs
    const mentorTabs = document.querySelectorAll('.mentor-tab');
    mentorTabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.mentor === mentorId);
    });

    // Update profiles with smooth transition
    const mentorProfiles = document.querySelectorAll('.mentor-profile');
    const targetProfile = document.getElementById(`${mentorId}-profile`);

    // Fade out current profile
    mentorProfiles.forEach(profile => {
        if (profile.classList.contains('active')) {
            profile.style.opacity = '0';
            setTimeout(() => {
                profile.classList.remove('active');
                profile.style.display = 'none';
            }, this.config.mentorSwitchDelay / 2);
        }
    });

    // Fade in target profile
    setTimeout(() => {
        if (targetProfile) {
            targetProfile.style.display = 'grid';
            targetProfile.classList.add('active');
            targetProfile.style.opacity = '0';

            requestAnimationFrame(() => {
                targetProfile.style.transition = 'opacity 0.3s ease-out';
                targetProfile.style.opacity = '1';
            });
        }
    }, this.config.mentorSwitchDelay / 2);

    this.state.activeMentor = mentorId;
};

// Play mentor audio sample
window.playMentorSample = function(mentorId) {
    const audioSources = {
        zen: './assets/audio/zen-master-sample.mp3',
        yogi: './assets/audio/yogi-sample.mp3',
        chaplain: './assets/audio/chaplain-sample.mp3',
        spiritual: './assets/audio/spiritual-mentor-sample.mp3',
        stoic: './assets/audio/stoic-sample.mp3',
        vedanta: './assets/audio/vedanta-sample.mp3'
    };

    const audio = new Audio(audioSources[mentorId]);
    audio.play().catch(err => {
        console.warn('Audio playback failed:', err);
        ZenMirrorIndiegogo.showNotification('Audio sample temporarily unavailable', 'warning');
    });

    ZenMirrorIndiegogo.trackEvent('mentor_audio_play', { mentor: mentorId });
};

// Perk Cards Implementation
ZenMirrorIndiegogo.initPerkCards = function() {
    const perkCards = document.querySelectorAll('.perk-card');

    perkCards.forEach((card, index) => {
        const button = card.querySelector('.btn-perk-select');

        if (button) {
            button.addEventListener('click', () => {
                this.selectPerk(index, card);
                this.trackEvent('perk_select', { perk_index: index });
            });
        }

        // Enhanced hover effects
        card.addEventListener('mouseenter', () => {
            this.animatePerkHover(card, true);
        });

        card.addEventListener('mouseleave', () => {
            this.animatePerkHover(card, false);
        });
    });

    // Auto-highlight featured perk
    const featuredPerk = document.querySelector('.perk-card.featured');
    if (featuredPerk) {
        this.addFeaturedPerkEffects(featuredPerk);
    }
};

ZenMirrorIndiegogo.animatePerkHover = function(card, isHovering) {
    if (isHovering) {
        card.style.transform = 'translateY(-8px) scale(1.02)';
        card.style.boxShadow = '0 12px 48px rgba(45, 91, 62, 0.2)';
    } else {
        card.style.transform = card.classList.contains('featured')
            ? 'translateY(-4px) scale(1.05)'
            : 'translateY(0) scale(1)';
        card.style.boxShadow = '0 4px 24px rgba(45, 91, 62, 0.12)';
    }
};

ZenMirrorIndiegogo.addFeaturedPerkEffects = function(featuredPerk) {
    // Subtle glow animation
    const glowKeyframes = `
        @keyframes featuredGlow {
            0%, 100% { box-shadow: 0 4px 24px rgba(217, 122, 52, 0.2); }
            50% { box-shadow: 0 8px 32px rgba(217, 122, 52, 0.4); }
        }
    `;

    const style = document.createElement('style');
    style.textContent = glowKeyframes;
    document.head.appendChild(style);

    featuredPerk.style.animation = 'featuredGlow 3s ease-in-out infinite';
};

ZenMirrorIndiegogo.selectPerk = function(perkIndex, perkCard) {
    // Add selection feedback
    const selectionRipple = document.createElement('div');
    selectionRipple.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        background: rgba(217, 122, 52, 0.3);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        animation: rippleEffect 0.6s ease-out;
        pointer-events: none;
        z-index: 1;
    `;

    const rippleKeyframes = `
        @keyframes rippleEffect {
            to {
                width: 300px;
                height: 300px;
                opacity: 0;
            }
        }
    `;

    if (!document.querySelector('#ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = rippleKeyframes;
        document.head.appendChild(style);
    }

    perkCard.style.position = 'relative';
    perkCard.appendChild(selectionRipple);

    // Remove ripple after animation
    setTimeout(() => {
        perkCard.removeChild(selectionRipple);
    }, 600);

    // Show selection feedback
    this.showNotification('Perk selected! Redirecting to secure checkout...', 'success');

    // Simulate checkout redirect
    setTimeout(() => {
        console.log(`Redirecting to checkout for perk ${perkIndex}`);
        // window.location.href = `/checkout?perk=${perkIndex}&platform=indiegogo`;
    }, 1500);
};

// Update Subscription Implementation
ZenMirrorIndiegogo.initUpdateSubscription = function() {
    const subscriptionForm = document.querySelector('.subscription-form');
    const emailInput = document.querySelector('.email-input');
    const subscribeButton = document.querySelector('.btn-subscribe');

    if (subscriptionForm && emailInput && subscribeButton) {
        subscriptionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubscription(emailInput.value);
        });

        // Real-time email validation
        emailInput.addEventListener('input', () => {
            this.validateEmail(emailInput);
        });

        // Enhanced input animations
        emailInput.addEventListener('focus', () => {
            subscriptionForm.style.transform = 'scale(1.02)';
            subscriptionForm.style.boxShadow = '0 8px 32px rgba(217, 122, 52, 0.2)';
        });

        emailInput.addEventListener('blur', () => {
            subscriptionForm.style.transform = 'scale(1)';
            subscriptionForm.style.boxShadow = '0 2px 12px rgba(45, 91, 62, 0.08)';
        });
    }
};

ZenMirrorIndiegogo.validateEmail = function(input) {
    const email = input.value;
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (email.length > 0) {
        input.style.borderColor = isValid
            ? 'var(--zen-success)'
            : 'var(--zen-error)';
    } else {
        input.style.borderColor = 'var(--zen-gray-light)';
    }

    return isValid;
};

ZenMirrorIndiegogo.handleSubscription = function(email) {
    if (!this.validateEmail(document.querySelector('.email-input'))) {
        this.showNotification('Please enter a valid email address', 'error');
        return;
    }

    // Show loading state
    const subscribeButton = document.querySelector('.btn-subscribe');
    const originalText = subscribeButton.textContent;
    subscribeButton.textContent = 'Subscribing...';
    subscribeButton.disabled = true;

    // Simulate subscription API call
    setTimeout(() => {
        this.showNotification('Successfully subscribed to updates!', 'success');
        document.querySelector('.email-input').value = '';

        subscribeButton.textContent = 'Subscribed ✓';
        subscribeButton.style.background = 'var(--zen-success)';

        setTimeout(() => {
            subscribeButton.textContent = originalText;
            subscribeButton.style.background = 'var(--zen-orange-accent)';
            subscribeButton.disabled = false;
        }, 3000);

        this.trackEvent('email_subscribe', { email: email });
    }, 1000);
};

// Sticky Elements Implementation
ZenMirrorIndiegogo.initStickyElements = function() {
    const stickyCta = document.querySelector('.sticky-cta');

    this.updateStickyElements = () => {
        const shouldShow = window.scrollY > this.config.stickyCtaThreshold;

        if (shouldShow !== this.state.stickyCtaVisible) {
            this.state.stickyCtaVisible = shouldShow;

            if (stickyCta) {
                stickyCta.classList.toggle('visible', shouldShow);
            }
        }
    };
};

// Animation system
ZenMirrorIndiegogo.initAnimations = function() {
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
        {
            threshold: this.config.animationObserverThreshold,
            rootMargin: '50px'
        }
    );

    // Observe animation targets
    const animationTargets = document.querySelectorAll(`
        .hero-content, .product-gallery, .story-block, .research-item,
        .video-item, .gallery-item, .tech-feature, .mentor-profile,
        .perk-card, .timeline-item, .update-item
    `);

    animationTargets.forEach(target => {
        this.animationObserver.observe(target);
    });

    // Initialize special animations
    this.initTechGridAnimation();
    this.initCounterAnimations();
    this.initProgressBarAnimations();
    this.initPulseAnimations();
};

ZenMirrorIndiegogo.animateElement = function(element) {
    const animationType = element.dataset.animation || 'fade-in';
    const delay = parseInt(element.dataset.delay) || 0;

    setTimeout(() => {
        switch (animationType) {
            case 'slide-up':
                element.style.opacity = '0';
                element.style.transform = 'translateY(40px)';
                element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

                requestAnimationFrame(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                });
                break;

            case 'scale-in':
                element.style.opacity = '0';
                element.style.transform = 'scale(0.8)';
                element.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';

                requestAnimationFrame(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'scale(1)';
                });
                break;

            case 'fade-in':
            default:
                element.style.opacity = '0';
                element.style.transition = 'opacity 1s ease-out';

                requestAnimationFrame(() => {
                    element.style.opacity = '1';
                });
                break;
        }
    }, delay);
};

// Tech grid animation
ZenMirrorIndiegogo.initTechGridAnimation = function() {
    const techGrid = document.querySelector('.tech-grid-animation');
    if (!techGrid) return;

    // Pause animation when not visible for performance
    this.animationObserver.observe(techGrid);

    let animationPaused = false;

    document.addEventListener('visibilitychange', () => {
        if (document.hidden && !animationPaused) {
            techGrid.style.animationPlayState = 'paused';
            animationPaused = true;
        } else if (!document.hidden && animationPaused) {
            techGrid.style.animationPlayState = 'running';
            animationPaused = false;
        }
    });
};

// Pulse animations for live elements
ZenMirrorIndiegogo.initPulseAnimations = function() {
    const pulseElements = document.querySelectorAll('.pulse-dot, .status-badge.live');

    pulseElements.forEach(element => {
        // Add slight randomization to prevent sync
        const delay = Math.random() * 1000;
        element.style.animationDelay = `${delay}ms`;
    });
};

// Counter animations
ZenMirrorIndiegogo.initCounterAnimations = function() {
    const counters = document.querySelectorAll('.metric-value, .current-price, .stretch-amount');

    counters.forEach(counter => {
        this.animationObserver.observe(counter);

        // Trigger animation when element becomes visible
        const originalObserver = this.animationObserver;
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.animated) {
                    this.animateCounter(entry.target);
                    entry.target.dataset.animated = 'true';
                }
            });
        }, { threshold: 0.5 });

        counterObserver.observe(counter);
    });
};

ZenMirrorIndiegogo.animateCounter = function(element) {
    const text = element.textContent;
    const number = parseInt(text.replace(/[^\d]/g, ''));
    const suffix = text.replace(/[\d,.$]/g, '');

    if (isNaN(number) || number === 0) return;

    const duration = 2000;
    const startTime = performance.now();

    const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(number * easeOutQuart);

        // Format number with commas if needed
        const formattedValue = currentValue.toLocaleString();
        element.textContent = text.replace(number.toString(), formattedValue);

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            element.textContent = text; // Ensure final value is exact
        }
    };

    requestAnimationFrame(animate);
};

// Progress bar animations
ZenMirrorIndiegogo.initProgressBarAnimations = function() {
    const progressBars = document.querySelectorAll('.progress-fill');

    progressBars.forEach(bar => {
        const targetWidth = bar.style.width;
        bar.style.width = '0%';

        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.animated) {
                    setTimeout(() => {
                        entry.target.style.transition = 'width 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                        entry.target.style.width = targetWidth;
                        entry.target.dataset.animated = 'true';
                    }, 500);
                }
            });
        }, { threshold: 0.3 });

        progressObserver.observe(bar);
    });
};

// Gallery interactions
ZenMirrorIndiegogo.initGalleryInteractions = function() {
    // Thumbnail gallery switching
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.querySelector('.main-image img');

    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            // Update active thumbnail
            thumbnails.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');

            // Switch main image with smooth transition
            if (mainImage) {
                mainImage.style.opacity = '0';
                setTimeout(() => {
                    mainImage.src = thumb.src.replace('60x60', '600x400'); // Placeholder logic
                    mainImage.style.opacity = '1';
                }, 200);
            }

            this.trackEvent('thumbnail_click', { index: index });
        });
    });
};

// Mentor interactions
ZenMirrorIndiegogo.initMentorInteractions = function() {
    // Auto-cycle through mentors for demo
    if (this.state.activeTab === 'mentors') {
        const mentors = ['zen', 'yogi', 'chaplain', 'spiritual', 'stoic', 'vedanta'];
        let currentIndex = mentors.indexOf(this.state.activeMentor);

        this.mentorCycleInterval = setInterval(() => {
            if (this.state.activeTab === 'mentors') {
                currentIndex = (currentIndex + 1) % mentors.length;
                this.switchMentor(mentors[currentIndex]);
            }
        }, 8000); // Auto-switch every 8 seconds
    }
};

// Timeline animations
ZenMirrorIndiegogo.initTimelineAnimations = function() {
    const timelineItems = document.querySelectorAll('.timeline-item');

    timelineItems.forEach((item, index) => {
        const delay = index * 150; // Stagger animations
        item.dataset.delay = delay.toString();
        item.dataset.animation = 'slide-up';

        this.animationObserver.observe(item);
    });
};

// Perks animations
ZenMirrorIndiegogo.updatePerksAnimations = function() {
    const perkCards = document.querySelectorAll('.perk-card');

    perkCards.forEach((card, index) => {
        const delay = index * 100;
        card.dataset.delay = delay.toString();
        card.dataset.animation = 'scale-in';

        // Re-trigger animation if switching to perks tab
        card.style.opacity = '0';
        card.style.transform = 'scale(0.8)';

        setTimeout(() => {
            this.animateElement(card);
        }, delay);
    });
};

// Scroll effects
ZenMirrorIndiegogo.initScrollEffects = function() {
    // Parallax effects
    this.initParallaxEffects();

    // Section tracking
    this.initSectionTracking();

    // Progress indicator
    this.initScrollProgress();
};

ZenMirrorIndiegogo.initParallaxEffects = function() {
    const parallaxElements = document.querySelectorAll('.tech-grid-animation');

    this.updateParallax = () => {
        if (this.state.isMobile) return; // Disable on mobile for performance

        const scrolled = window.pageYOffset;

        parallaxElements.forEach(element => {
            const rate = scrolled * -0.2;
            element.style.transform = `translate3d(0, ${rate}px, 0)`;
        });
    };
};

ZenMirrorIndiegogo.initSectionTracking = function() {
    const sections = document.querySelectorAll('section[id]');

    this.trackSections = () => {
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Update URL hash without triggering scroll
                if (window.location.hash !== `#${sectionId}`) {
                    history.replaceState(null, null, `#${sectionId}`);
                }
            }
        });
    };
};

ZenMirrorIndiegogo.initScrollProgress = function() {
    // Create enhanced progress indicator
    const progressContainer = document.createElement('div');
    progressContainer.style.cssText = `
        position: fixed;
        top: 70px;
        left: 0;
        right: 0;
        height: 4px;
        background: rgba(217, 122, 52, 0.1);
        z-index: 999;
        pointer-events: none;
    `;

    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        width: 0%;
        height: 100%;
        background: linear-gradient(90deg, var(--zen-orange-accent), var(--zen-orange-warm));
        transition: width 0.1s ease-out;
        position: relative;
    `;

    const progressGlow = document.createElement('div');
    progressGlow.style.cssText = `
        position: absolute;
        top: 0;
        right: 0;
        width: 20px;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8));
        border-radius: 0 2px 2px 0;
    `;

    progressBar.appendChild(progressGlow);
    progressContainer.appendChild(progressBar);
    document.body.appendChild(progressContainer);

    this.updateScrollProgress = () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = Math.min((scrollTop / docHeight) * 100, 100);
        progressBar.style.width = `${scrollPercent}%`;
    };
};

// Lazy loading implementation
ZenMirrorIndiegogo.initLazyLoading = function() {
    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading supported
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    } else {
        // Intersection Observer fallback
        this.lazyLoadObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;

                        // Add loading animation
                        img.style.filter = 'blur(5px)';
                        img.style.transition = 'filter 0.3s ease-out';

                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');

                        img.onload = () => {
                            img.style.filter = 'none';
                        };

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
ZenMirrorIndiegogo.initProgressTracking = function() {
    // Enhanced engagement tracking
    this.engagementTimer = setInterval(() => {
        if (this.isPageVisible()) {
            this.trackEvent('engagement_30s', {
                tab: this.state.activeTab,
                mentor: this.state.activeMentor,
                time_on_page: this.getTimeOnPage(),
                scroll_depth: this.maxScrollDepth
            });
        }
    }, 30000);

    // Track tab engagement
    this.tabEngagement = {};
    this.trackTabTime();

    // Enhanced scroll depth tracking
    this.maxScrollDepth = 0;
    this.scrollMilestones = [10, 25, 50, 75, 90];

    this.trackScrollDepth = () => {
        const scrollPercent = Math.round(
            (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        );

        if (scrollPercent > this.maxScrollDepth) {
            this.maxScrollDepth = scrollPercent;

            // Track milestone scroll depths
            this.scrollMilestones.forEach(milestone => {
                if (scrollPercent >= milestone && !this.state[`milestone_${milestone}`]) {
                    this.state[`milestone_${milestone}`] = true;
                    this.trackEvent('scroll_milestone', {
                        percent: milestone,
                        tab: this.state.activeTab
                    });
                }
            });
        }
    };
};

ZenMirrorIndiegogo.trackTabTime = function() {
    if (!this.tabEngagement[this.state.activeTab]) {
        this.tabEngagement[this.state.activeTab] = {
            startTime: Date.now(),
            totalTime: 0
        };
    }
};

// Mobile optimizations
ZenMirrorIndiegogo.initMobileOptimizations = function() {
    if (!this.state.isMobile) return;

    // Reduce animation complexity
    const mobileStyles = document.createElement('style');
    mobileStyles.textContent = `
        @media (max-width: 768px) {
            .tech-grid-animation,
            .parallax-element {
                animation: none !important;
                transform: none !important;
            }

            .mentor-profile.active {
                grid-template-columns: 1fr !important;
            }

            .mentor-visual {
                height: 250px !important;
            }
        }
    `;
    document.head.appendChild(mobileStyles);

    // Touch gesture handling
    this.initTouchGestures();

    // Optimize scroll performance
    this.optimizeScrollPerformance();
};

ZenMirrorIndiegogo.initTouchGestures = function() {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const touchDuration = Date.now() - touchStartTime;

        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        // Detect swipe gestures
        if (Math.abs(deltaX) > 50 && Math.abs(deltaY) < 100 && touchDuration < 300) {
            if (deltaX > 0) {
                this.handleSwipeRight();
            } else {
                this.handleSwipeLeft();
            }
        }
    }, { passive: true });
};

ZenMirrorIndiegogo.handleSwipeRight = function() {
    // Navigate to previous tab
    const tabs = ['story', 'gallery', 'technology', 'mentors', 'perks', 'updates'];
    const currentIndex = tabs.indexOf(this.state.activeTab);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;

    this.switchTab(tabs[prevIndex]);
    this.trackEvent('swipe_navigation', { direction: 'right', to: tabs[prevIndex] });
};

ZenMirrorIndiegogo.handleSwipeLeft = function() {
    // Navigate to next tab
    const tabs = ['story', 'gallery', 'technology', 'mentors', 'perks', 'updates'];
    const currentIndex = tabs.indexOf(this.state.activeTab);
    const nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;

    this.switchTab(tabs[nextIndex]);
    this.trackEvent('swipe_navigation', { direction: 'left', to: tabs[nextIndex] });
};

ZenMirrorIndiegogo.optimizeScrollPerformance = function() {
    // Use passive listeners for scroll events
    const passiveEvents = ['scroll', 'touchstart', 'touchmove', 'touchend'];
    passiveEvents.forEach(event => {
        document.addEventListener(event, () => {}, { passive: true });
    });
};

// Utility functions
ZenMirrorIndiegogo.handleScroll = function() {
    this.state.scrollPosition = window.scrollY;

    // Execute scroll-related functions
    if (this.updateNavigation) this.updateNavigation();
    if (this.updateParallax) this.updateParallax();
    if (this.trackSections) this.trackSections();
    if (this.updateScrollProgress) this.updateScrollProgress();
    if (this.trackScrollDepth) this.trackScrollDepth();
    if (this.updateStickyElements) this.updateStickyElements();
};

ZenMirrorIndiegogo.handleResize = function() {
    const wasMobile = this.state.isMobile;
    this.state.isMobile = window.innerWidth <= 768;

    if (wasMobile !== this.state.isMobile) {
        this.initMobileOptimizations();
    }

    // Recalculate layout-dependent elements
    this.recalculateLayout();
};

ZenMirrorIndiegogo.recalculateLayout = function() {
    // Update lightbox positioning
    const lightbox = document.querySelector('.lightbox');
    if (lightbox) {
        const content = lightbox.querySelector('div');
        if (content) {
            content.style.maxWidth = '90vw';
            content.style.maxHeight = '90vh';
        }
    }
};

ZenMirrorIndiegogo.handlePageLoad = function() {
    this.preloadCriticalAssets();
    this.initPerformanceMonitoring();
    this.initAccessibilityFeatures();
};

ZenMirrorIndiegogo.preloadCriticalAssets = function() {
    const criticalAssets = [
        './assets/zenmirror-main.jpg',
        './assets/videos/zenmirror-hero-demo.mp4',
        './assets/mentors/zen-master-detailed.jpg'
    ];

    criticalAssets.forEach(asset => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = asset;
        link.as = asset.includes('.mp4') ? 'video' : 'image';
        document.head.appendChild(link);
    });
};

ZenMirrorIndiegogo.initAccessibilityFeatures = function() {
    // Enhanced keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });

    // Skip link for accessibility
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--zen-forest-dark);
        color: white;
        padding: 8px;
        border-radius: 4px;
        text-decoration: none;
        z-index: 10001;
        transition: top 0.3s;
    `;
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });

    document.body.prepend(skipLink);
};

ZenMirrorIndiegogo.handleVisibilityChange = function() {
    if (document.hidden) {
        // Pause resource-intensive operations
        if (this.mentorCycleInterval) {
            clearInterval(this.mentorCycleInterval);
        }

        // Pause video players
        this.state.videoPlayers.forEach(video => {
            if (!video.paused) {
                video.pause();
                video.dataset.wasPlaying = 'true';
            }
        });
    } else {
        // Resume operations
        if (this.state.activeTab === 'mentors') {
            this.initMentorInteractions();
        }

        // Resume video players
        this.state.videoPlayers.forEach(video => {
            if (video.dataset.wasPlaying === 'true') {
                video.play();
                video.removeAttribute('data-was-playing');
            }
        });
    }
};

// Performance monitoring
ZenMirrorIndiegogo.initPerformanceMonitoring = function() {
    if ('performance' in window) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        this.trackEvent('page_load_time', {
            duration: loadTime,
            platform: 'indiegogo'
        });

        // Monitor Core Web Vitals
        if ('PerformanceObserver' in window) {
            // Largest Contentful Paint
            new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lcp = entries[entries.length - 1];
                this.trackEvent('largest_contentful_paint', {
                    duration: lcp.startTime,
                    element: lcp.element?.tagName
                });
            }).observe({ entryTypes: ['largest-contentful-paint'] });

            // First Input Delay
            new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    this.trackEvent('first_input_delay', {
                        duration: entry.processingStart - entry.startTime,
                        event_type: entry.name
                    });
                });
            }).observe({ entryTypes: ['first-input'] });

            // Cumulative Layout Shift
            new PerformanceObserver((list) => {
                const entries = list.getEntries();
                let cumulativeScore = 0;
                entries.forEach(entry => {
                    if (!entry.hadRecentInput) {
                        cumulativeScore += entry.value;
                    }
                });
                this.trackEvent('cumulative_layout_shift', { score: cumulativeScore });
            }).observe({ entryTypes: ['layout-shift'] });
        }
    }
};

// Analytics and tracking
ZenMirrorIndiegogo.trackEvent = function(eventName, properties = {}) {
    const eventData = {
        event: eventName,
        timestamp: new Date().toISOString(),
        page: 'indiegogo_campaign',
        platform: 'indiegogo',
        tab: this.state.activeTab,
        user_agent: navigator.userAgent,
        viewport: {
            width: window.innerWidth,
            height: window.innerHeight
        },
        session_data: {
            time_on_page: this.getTimeOnPage(),
            scroll_depth: this.maxScrollDepth,
            tab_engagement: this.tabEngagement
        },
        ...properties
    };

    console.log('Event tracked:', eventData);

    // Integration with analytics services
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
ZenMirrorIndiegogo.showNotification = function(message, type = 'info', duration = 4000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%) scale(0.9);
        transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        max-width: 400px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
        backdrop-filter: blur(10px);
    `;

    // Enhanced styling based on type
    const typeStyles = {
        success: {
            background: 'linear-gradient(135deg, #4a7c59, #6b8e5a)',
            border: '1px solid rgba(106, 142, 90, 0.3)'
        },
        error: {
            background: 'linear-gradient(135deg, #c65d21, #d97a34)',
            border: '1px solid rgba(217, 122, 52, 0.3)'
        },
        warning: {
            background: 'linear-gradient(135deg, #d97a34, #e89851)',
            border: '1px solid rgba(232, 152, 81, 0.3)'
        },
        info: {
            background: 'linear-gradient(135deg, #2d5b3e, #4a7c59)',
            border: '1px solid rgba(74, 124, 89, 0.3)'
        }
    };

    const style = typeStyles[type] || typeStyles.info;
    Object.assign(notification.style, style);

    // Add icon based on type
    const icons = {
        success: '✓',
        error: '✗',
        warning: '⚠',
        info: 'ℹ'
    };

    const icon = document.createElement('span');
    icon.textContent = icons[type] || icons.info;
    icon.style.marginRight = '0.5rem';

    notification.appendChild(icon);
    notification.appendChild(document.createTextNode(message));

    document.body.appendChild(notification);

    // Animate in
    requestAnimationFrame(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0) scale(1)';
    });

    // Auto remove with enhanced animation
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%) scale(0.9)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 400);
    }, duration);

    // Click to dismiss
    notification.addEventListener('click', () => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%) scale(0.9)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 400);
    });
};

// Helper utilities
ZenMirrorIndiegogo.throttle = function(func, limit) {
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

ZenMirrorIndiegogo.debounce = function(func, wait, immediate) {
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

ZenMirrorIndiegogo.isPageVisible = function() {
    return document.visibilityState === 'visible';
};

ZenMirrorIndiegogo.getTimeOnPage = function() {
    return Date.now() - this.startTime;
};

// Cleanup function
ZenMirrorIndiegogo.cleanup = function() {
    // Clear intervals and timers
    if (this.mentorCycleInterval) clearInterval(this.mentorCycleInterval);
    if (this.engagementTimer) clearInterval(this.engagementTimer);

    // Disconnect observers
    if (this.animationObserver) this.animationObserver.disconnect();
    if (this.lazyLoadObserver) this.lazyLoadObserver.disconnect();

    // Pause all videos
    this.state.videoPlayers.forEach(video => {
        video.pause();
        video.removeAttribute('src');
    });

    // Execute custom cleanup tasks
    if (this.cleanupTasks) {
        this.cleanupTasks.forEach(task => task());
    }

    // Track session end
    this.trackEvent('session_end', {
        duration: this.getTimeOnPage(),
        final_tab: this.state.activeTab,
        scroll_depth: this.maxScrollDepth
    });
};

// Error handling
window.addEventListener('error', (event) => {
    ZenMirrorIndiegogo.trackEvent('javascript_error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
    });
});

window.addEventListener('unhandledrejection', (event) => {
    ZenMirrorIndiegogo.trackEvent('promise_rejection', {
        reason: event.reason?.toString(),
        stack: event.reason?.stack
    });
});

// Performance monitoring
ZenMirrorIndiegogo.startTime = Date.now();

// Initialize application
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ZenMirrorIndiegogo.init());
} else {
    ZenMirrorIndiegogo.init();
}

// Export for external use
window.ZenMirrorIndiegogo = ZenMirrorIndiegogo;