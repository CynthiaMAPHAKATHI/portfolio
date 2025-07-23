// 🛠 CYNN's Portfolio JavaScript
// Fixed & Optimized for Mobile Menu, Animations, Form, and Scroll
document.addEventListener('DOMContentLoaded', function () {
    // ===== MOBILE AND DESKTOP NAVIGATION =====
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');
    let menuTimeout;
    let isMenuOpen = false;

    // Create mobile menu overlay
    function createMobileMenuOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 999;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        `;
        document.body.appendChild(overlay);
        return overlay;
    }

    const overlay = createMobileMenuOverlay();

    // Show menu function
    function showMenu() {
        clearTimeout(menuTimeout);
        isMenuOpen = true;
        navLinks.classList.add('active');
        hamburger.classList.add('active');
        if (window.innerWidth <= 768) {
            overlay.style.opacity = '1';
            overlay.style.visibility = 'visible';
            document.body.style.overflow = 'hidden';
        }
        hamburger.style.transform = 'rotate(90deg)';
    }

    // Hide menu function
    function hideMenu(immediate = false) {
        const delay = immediate ? 0 : 300;
        clearTimeout(menuTimeout);
        menuTimeout = setTimeout(() => {
            isMenuOpen = false;
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            overlay.style.opacity = '0';
            overlay.style.visibility = 'hidden';
            document.body.style.overflow = '';
            hamburger.style.transform = 'rotate(0deg)';
        }, delay);
    }

    // Toggle menu for click/tap
    function toggleMenu() {
        if (isMenuOpen) {
            hideMenu(true);
        } else {
            showMenu();
        }
    }

    // Desktop hover events
    function setupDesktopHover() {
        if (window.innerWidth > 768) {
            hamburger.addEventListener('mouseenter', showMenu);
            hamburger.addEventListener('mouseleave', hideMenu);
            navLinks.addEventListener('mouseenter', showMenu);
            navLinks.addEventListener('mouseleave', hideMenu);
        }
    }

    // Mobile/Desktop click events
    if (hamburger) {
        hamburger.addEventListener('click', toggleMenu);
    }

    // Close menu when clicking overlay
    overlay.addEventListener('click', () => hideMenu(true));

    // Close menu when nav link is clicked
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => hideMenu(true));
    });

    // Call setupDesktopHover on load
    setupDesktopHover();

    // Reattach on resize
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            if (window.innerWidth > 768) {
                hideMenu(true);
                setupDesktopHover();
            } else {
                // Remove desktop hover events
                hamburger.removeEventListener('mouseenter', showMenu);
                hamburger.removeEventListener('mouseleave', hideMenu);
                navLinks.removeEventListener('mouseenter', showMenu);
                navLinks.removeEventListener('mouseleave', hideMenu);
            }
        }, 250);
    });

    // ===== SMOOTH SCROLLING =====
    function smoothScrollTo(target, duration = 800) {
        const targetElement = document.querySelector(target);
        if (!targetElement) return;
        const targetPosition = targetElement.offsetTop - 70;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    }

    // Apply smooth scrolling to all navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            smoothScrollTo(target);
        });
    });

    // ===== SCROLL EFFECTS =====
    let lastScrollTop = 0;
    const navbarHeight = 60;
    const handleScroll = throttle(function () {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Navbar hide/show on scroll
        if (scrollTop > lastScrollTop && scrollTop > navbarHeight) {
            navbar.style.transform = 'translateY(-100%)';
            hideMenu(true);
        } else {
            navbar.style.transform = 'translateY(0)';
        }

        // Add background to navbar when scrolling
        if (scrollTop > 50) {
            navbar.style.background = 'rgba(17, 17, 17, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = '#111';
            navbar.style.backdropFilter = 'none';
        }

        lastScrollTop = scrollTop;

        // Parallax effect for floating elements
        const floatingFlowers = document.querySelector('.floating-flowers');
        const floatingSky = document.querySelector('.floating-sky');

        if (floatingFlowers) {
            floatingFlowers.style.transform = `translateY(${scrollTop * 0.3}px)`;
        }
        if (floatingSky) {
            floatingSky.style.transform = `translateY(${scrollTop * 0.2}px)`;
        }
    }, 16); // 60fps throttling

    window.addEventListener('scroll', handleScroll);

    // ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.project-card, .tech-block, .about-text, .contact-form');
    animateElements.forEach(el => observer.observe(el));

    // ===== DYNAMIC TYPING EFFECT =====
    function typeWriter(element, text, speed = 100) {
        if (!element) return;
        let i = 0;
        element.textContent = '';
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    // Apply typing effect to hero text after a delay
    setTimeout(() => {
        const heroSpan = document.querySelector('.dev-highlight');
        if (heroSpan) {
            typeWriter(heroSpan, 'Front-End Developer', 150);
        }
    }, 1000);

    // ===== FORM HANDLING =====
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');

            // Basic validation
            if (!name || !email || !message) {
                showNotification('Please fill in all fields!', 'error');
                return;
            }
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address!', 'error');
                return;
            }

            // Simulate form submission
            showNotification('Thank you! Your message has been received. I\'ll get back to you soon! 🚀', 'success');
            this.reset();
        });
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // ===== NOTIFICATION SYSTEM =====
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: bold;
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 300px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        `;

        const colors = {
            success: '#00fc00',
            error: '#ff4444',
            info: '#ee82ee'
        };
        notification.style.background = colors[type] || colors.info;
        notification.style.color = type === 'success' ? '#111' : '#fff';
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    // ===== PROJECT CARD INTERACTIONS =====
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // ===== TECH BLOCKS INTERACTION =====
    const techBlocks = document.querySelectorAll('.tech-block');
    techBlocks.forEach(block => {
        block.addEventListener('click', function () {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-5px)';
            }, 100);
        });
    });

    // ===== LOADING ANIMATION =====
    function createLoader() {
        const loader = document.createElement('div');
        loader.id = 'page-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="loader-spinner"></div>
                <p>Loading CYNN's Portfolio...</p>
            </div>
        `;
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(-45deg, #000, #ee82ee, #000);
            background-size: 400% 400%;
            animation: animatedGradient 3s ease infinite;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            color: white;
            font-family: 'Poppins', sans-serif;
        `;

        const loaderStyles = document.createElement('style');
        loaderStyles.textContent = `
            .loader-content {
                text-align: center;
            }
            .loader-spinner {
                width: 50px;
                height: 50px;
                border: 4px solid rgba(255, 255, 255, 0.3);
                border-top: 4px solid white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 20px;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(loaderStyles);
        document.body.appendChild(loader);
        return loader;
    }

    const loader = createLoader();

    window.addEventListener('load', function () {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                if (loader.parentNode) {
                    loader.parentNode.removeChild(loader);
                }
            }, 500);
        }, 1500);
    });

    // ===== EASTER EGG - KONAMI CODE =====
    const konamiCode = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'KeyB', 'KeyA'
    ];
    let konamiIndex = 0;

    document.addEventListener('keydown', function (e) {
        if (e.code === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateEasterEgg();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    function activateEasterEgg() {
        showNotification('🎉 You found the Easter Egg! CYNN sends her regards! 👑', 'success');
        document.body.style.animation = 'rainbow 2s ease infinite';
        const rainbowStyles = document.createElement('style');
        rainbowStyles.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(rainbowStyles);
        setTimeout(() => {
            document.body.style.animation = '';
            rainbowStyles.parentNode.removeChild(rainbowStyles);
        }, 4000);
    }

    // ===== RESIZE HANDLING =====
    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            if (window.innerWidth > 768) {
                hideMenu(true);
                setupDesktopHover();
            } else {
                hamburger.removeEventListener('mouseenter', showMenu);
                hamburger.removeEventListener('mouseleave', hideMenu);
                navLinks.removeEventListener('mouseenter', showMenu);
                navLinks.removeEventListener('mouseleave', hideMenu);
            }
            lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        }, 250);
    });

    // ===== ACCESSIBILITY IMPROVEMENTS =====
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            hideMenu(true);
        }
    });

    // Focus trap for mobile menu
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        element.addEventListener('keydown', function (e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }

    const navLinksContainer = document.querySelector('.nav-links');
    if (navLinksContainer) {
        trapFocus(navLinksContainer);
    }

    // ===== ANIMATION STYLES =====
    const animationStyles = document.createElement('style');
    animationStyles.textContent = `
        .animate-in {
            animation: slideInUp 0.6s ease forwards;
        }
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .hamburger {
            transition: transform 0.3s ease;
            cursor: pointer;
        }
        .hamburger.active {
            transform: rotate(90deg);
        }
        /* Hide nav links by default */
        .nav-links {
            transition: all 0.3s ease;
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
        }
        .nav-links.active {
            opacity: 1;
            visibility: visible;
            pointer-events: auto;
        }
    `;
    document.head.appendChild(animationStyles);

    // ===== SUCCESS MESSAGE =====
    console.log('🎉 CYNN\'s Portfolio JavaScript loaded successfully! Menu shows on hover/click only! 👑');
});

// Utility Functions
function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}