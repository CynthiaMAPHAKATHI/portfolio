/**
 * Cynthia Maphakathi - Portfolio Website Script
 * Fixed and optimized for better functionality
 * Features:
 * - Mobile Hamburger Menu (properly working)
 * - Dark Mode Toggle (with system preference detection)
 * - Smooth Scroll with Navbar Offset
 * - Contact Form Handling (improved error handling)
 * - Accessibility & Reduced Motion Support
 * - Better mobile responsiveness
 */

document.addEventListener("DOMContentLoaded", () => {
  // =======================
  // 1. MOBILE HAMBURGER MENU (FIXED)
  // =======================
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  if (hamburger && navMenu) {
    // Toggle menu on hamburger click
    hamburger.addEventListener("click", () => {
      const isActive = navMenu.classList.contains("active");
      
      // Toggle classes
      navMenu.classList.toggle("active");
      hamburger.classList.toggle("active");
      
      // Update accessibility attributes
      hamburger.setAttribute("aria-expanded", !isActive);
      hamburger.setAttribute("aria-label", isActive ? "Open navigation menu" : "Close navigation menu");
      
      // Prevent body scroll when menu is open on mobile
      document.body.style.overflow = isActive ? "auto" : "hidden";
    });

    // Close menu when clicking a nav link
    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        hamburger.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
        hamburger.setAttribute("aria-label", "Open navigation menu");
        document.body.style.overflow = "auto";
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        if (navMenu.classList.contains("active")) {
          navMenu.classList.remove("active");
          hamburger.classList.remove("active");
          hamburger.setAttribute("aria-expanded", "false");
          hamburger.setAttribute("aria-label", "Open navigation menu");
          document.body.style.overflow = "auto";
        }
      }
    });

    // Close menu on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navMenu.classList.contains("active")) {
        navMenu.classList.remove("active");
        hamburger.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
        hamburger.setAttribute("aria-label", "Open navigation menu");
        document.body.style.overflow = "auto";
      }
    });

    // Initialize accessibility attributes
    hamburger.setAttribute("aria-label", "Open navigation menu");
    hamburger.setAttribute("aria-expanded", "false");
  }

  // =======================
  // 2. DARK MODE TOGGLE (IMPROVED)
  // =======================
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  const icon = darkModeToggle?.querySelector("i");

  // Check for saved theme preference or default to system preference
  const savedTheme = localStorage.getItem("portfolio-theme");
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  
  // Set initial theme
  let currentTheme = savedTheme || (systemPrefersDark ? "dark" : "light");
  
  if (currentTheme === "dark") {
    document.documentElement.classList.add("dark-mode");
  }

  // Update toggle button appearance
  function updateDarkModeToggle() {
    const isDark = document.documentElement.classList.contains("dark-mode");
    
    if (icon) {
      if (isDark) {
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");
      } else {
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");
      }
    }
    
    if (darkModeToggle) {
      darkModeToggle.setAttribute("aria-label", 
        isDark ? "Switch to Light Mode" : "Switch to Dark Mode"
      );
    }
  }

  // Initial toggle update
  updateDarkModeToggle();

  // Toggle dark mode on click
  if (darkModeToggle) {
    darkModeToggle.addEventListener("click", () => {
      const isDark = document.documentElement.classList.toggle("dark-mode");
      
      // Save preference
      localStorage.setItem("portfolio-theme", isDark ? "dark" : "light");
      
      // Update button
      updateDarkModeToggle();
      
      // Optional: Add transition class for smooth color changes
      document.body.classList.add("theme-transitioning");
      setTimeout(() => {
        document.body.classList.remove("theme-transitioning");
      }, 300);
    });
  }

  // Listen for system theme changes
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    // Only update if user hasn't manually set a preference
    if (!localStorage.getItem("portfolio-theme")) {
      if (e.matches) {
        document.documentElement.classList.add("dark-mode");
      } else {
        document.documentElement.classList.remove("dark-mode");
      }
      updateDarkModeToggle();
    }
  });

  // =======================
  // 3. SMOOTH SCROLL (IMPROVED)
  // =======================
  function smoothScrollTo(targetElement, offset = 0) {
    const elementPosition = targetElement.offsetTop - offset;
    const startPosition = window.pageYOffset;
    const distance = elementPosition - startPosition;
    const duration = 800;
    let start = null;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    if (prefersReducedMotion) {
      window.scrollTo(0, elementPosition);
      return;
    }

    function animation(currentTime) {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    // Easing function
    function easeInOutQuad(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t + b;
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
  }

  // Handle smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      
      // Skip if href is just "#" or empty
      if (targetId === "#" || targetId === "") return;

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      e.preventDefault();

      // Calculate navbar height for offset
      const navbar = document.querySelector(".navbar");
      const navbarHeight = navbar ? navbar.offsetHeight + 20 : 20;

      // Smooth scroll to target
      smoothScrollTo(targetElement, navbarHeight);

      // Close mobile menu if open
      if (navMenu && navMenu.classList.contains("active")) {
        navMenu.classList.remove("active");
        hamburger.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "auto";
      }

      // Update URL without triggering scroll
      history.pushState(null, null, targetId);
    });
  });

  // =======================
  // 4. CONTACT FORM HANDLING (IMPROVED)
  // =======================
  const contactForm = document.querySelector(".contact-form");
  const formStatus = document.querySelector(".form-status");

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Get form data
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);

      // Validation
      const errors = [];
      
      if (!data.name || data.name.trim().length < 2) {
        errors.push("Please enter a valid name (at least 2 characters)");
      }
      
      if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.push("Please enter a valid email address");
      }
      
      if (!data.subject) {
        errors.push("Please select a subject");
      }
      
      if (!data.message || data.message.trim().length < 10) {
        errors.push("Please enter a message (at least 10 characters)");
      }

      // Display errors if any
      if (errors.length > 0) {
        showFormStatus(errors.join(". "), "error");
        return;
      }

      // Get submit button and show loading state
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      
      showFormStatus("Sending your message...", "info");

      try {
        // Submit to Formspree
        const response = await fetch(contactForm.action, {
          method: "POST",
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          // Success
          contactForm.reset();
          showFormStatus("✨ Message sent successfully! I'll get back to you within 24 hours.", "success");
          
          // Optional: Track form submission (if you have analytics)
          if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
              'event_category': 'Contact',
              'event_label': data.subject
            });
          }
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP ${response.status}`);
        }
      } catch (error) {
        console.error("Form submission error:", error);
        showFormStatus(
          `❌ Oops! Something went wrong: ${error.message}. Please try again or contact me directly.`, 
          "error"
        );
      } finally {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
        
        // Clear status after delay
        setTimeout(() => {
          if (formStatus && formStatus.classList.contains("success")) {
            showFormStatus("After submitting, I'll get back to you within 24 hours.", "default");
          }
        }, 8000);
      }
    });

    // Form status helper function
    function showFormStatus(message, type = "default") {
      if (!formStatus) return;
      
      formStatus.textContent = message;
      formStatus.className = `form-status ${type}`;
      
      // Add appropriate styling based on type
      switch (type) {
        case "success":
          formStatus.style.color = "#10b981";
          formStatus.style.fontWeight = "600";
          break;
        case "error":
          formStatus.style.color = "#ef4444";
          formStatus.style.fontWeight = "600";
          break;
        case "info":
          formStatus.style.color = "#3b82f6";
          formStatus.style.fontWeight = "500";
          break;
        default:
          formStatus.style.color = "var(--text-muted)";
          formStatus.style.fontWeight = "400";
      }
    }

    // Real-time form validation feedback
    const inputs = contactForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => clearFieldError(input));
    });

    function validateField(field) {
      const value = field.value.trim();
      let isValid = true;
      let message = "";

      switch (field.type) {
        case "email":
          if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            isValid = false;
            message = "Please enter a valid email address";
          }
          break;
        case "text":
          if (field.name === "name" && value && value.length < 2) {
            isValid = false;
            message = "Name should be at least 2 characters";
          }
          break;
        default:
          if (field.tagName === "TEXTAREA" && value && value.length < 10) {
            isValid = false;
            message = "Message should be at least 10 characters";
          }
      }

      // Visual feedback
      if (!isValid) {
        field.style.borderColor = "#ef4444";
        showFieldError(field, message);
      } else {
        field.style.borderColor = "var(--border-color)";
        clearFieldError(field);
      }
    }

    function showFieldError(field, message) {
      clearFieldError(field); // Clear any existing error
      
      const errorEl = document.createElement("span");
      errorEl.className = "field-error";
      errorEl.textContent = message;
      errorEl.style.color = "#ef4444";
      errorEl.style.fontSize = "0.875rem";
      errorEl.style.marginTop = "0.25rem";
      
      field.parentNode.appendChild(errorEl);
    }

    function clearFieldError(field) {
      const existingError = field.parentNode.querySelector(".field-error");
      if (existingError) {
        existingError.remove();
      }
      field.style.borderColor = "var(--border-color)";
    }
  }

  // =======================
  // 5. ENHANCED ACCESSIBILITY
  // =======================
  
  // Keyboard navigation tracking
  let isUsingKeyboard = false;

  document.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      isUsingKeyboard = true;
      document.body.classList.add("using-keyboard");
    }
  });

  document.addEventListener("mousedown", () => {
    isUsingKeyboard = false;
    document.body.classList.remove("using-keyboard");
  });

  // Skip to main content link (for screen readers)
  const skipLink = document.createElement("a");
  skipLink.href = "#home";
  skipLink.textContent = "Skip to main content";
  skipLink.className = "skip-link";
  skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 6px;
    background: var(--primary-blue);
    color: white;
    padding: 8px;
    text-decoration: none;
    border-radius: 4px;
    z-index: 10001;
    transition: top 0.3s ease;
  `;
  
  skipLink.addEventListener("focus", () => {
    skipLink.style.top = "6px";
  });
  
  skipLink.addEventListener("blur", () => {
    skipLink.style.top = "-40px";
  });
  
  document.body.insertBefore(skipLink, document.body.firstChild);

  // =======================
  // 6. SCROLL ANIMATIONS (PERFORMANCE OPTIMIZED)
  // =======================
  
  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
      }
    });
  }, observerOptions);

  // Add animation classes to elements
  const animatedElements = document.querySelectorAll(
    ".section-title, .about-description, .skill-category, .service-card, .project-card, .highlight-item"
  );
  
  animatedElements.forEach(el => {
    el.classList.add("animate-on-scroll");
    scrollObserver.observe(el);
  });

  // =======================
  // 7. PERFORMANCE OPTIMIZATIONS
  // =======================
  
  // Debounce scroll events
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Throttle resize events
  function throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  }

  // Handle window resize
  const handleResize = throttle(() => {
    // Close mobile menu on resize to larger screens
    if (window.innerWidth > 768 && navMenu && navMenu.classList.contains("active")) {
      navMenu.classList.remove("active");
      hamburger.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "auto";
    }
  }, 250);

  window.addEventListener("resize", handleResize);

  // =======================
  // 8. ERROR HANDLING & FALLBACKS
  // =======================
  
  window.addEventListener("error", (e) => {
    console.error("Portfolio error:", e.error);
    // Optionally send to analytics or error tracking service
  });

  // Fallback for browsers without Intersection Observer
  if (!("IntersectionObserver" in window)) {
    animatedElements.forEach(el => {
      el.classList.add("animate-in");
    });
  }

  // =======================
  // 9. INITIALIZATION COMPLETE
  // =======================
  
  console.log("🚀 Portfolio initialized successfully!");
  
  // Optional: Add loaded class to body for CSS transitions
  document.body.classList.add("loaded");
});