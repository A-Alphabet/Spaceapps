// Dark Mode System
function enableDarkMode() {
    document.body.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
}

function disableDarkMode() {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('theme', 'light');
}

// Determines a new user's dark mode preferences
function detectColorScheme() {
    // Default to the light theme
    let theme = 'light';

    // Check localStorage for a saved 'theme' variable. If it's there, the user has visited before, so apply the necessary theme choices
    if (localStorage.getItem('theme')) {
        theme = localStorage.getItem('theme');
    }
    // If it's not there, check to see if the user has applied dark mode preferences themselves in the browser
    else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        theme = 'dark';
    }

    // If there is no preference set, the default of light will be used. Apply accordingly
    theme === 'dark' ? enableDarkMode() : disableDarkMode();
}

// Run on page load
detectColorScheme();

// SPA Navigation System
document.addEventListener('DOMContentLoaded', function() {
    // Debug: Confirm DOMContentLoaded fires
    console.log('DOMContentLoaded fired');

    const sections = document.querySelectorAll('.page-section');
    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    const buttons = document.querySelectorAll('[data-section]');

    // Function to show a specific section with true fade-out then fade-in
    function showSection(sectionId) {
        const currentSection = document.querySelector('.page-section.active');
        const targetSection = document.getElementById(sectionId);

        if (currentSection && currentSection !== targetSection) {
            currentSection.classList.remove('active');
            // Wait for fade-out to finish before fading in the new section
            setTimeout(() => {
                if (targetSection) {
                    targetSection.classList.add('active');
                }
            }, 500); // Match your CSS transition duration
        } else if (targetSection && !targetSection.classList.contains('active')) {
            targetSection.classList.add('active');
        }

        // Update URL without page reload
        history.pushState({ section: sectionId }, '', `#${sectionId}`);
    }

    // Function to handle navigation
    function handleNavigation(event) {
        event.preventDefault();
        const sectionId = event.target.getAttribute('data-section');
        showSection(sectionId);
    }

    // Add click event listeners to navigation links and buttons
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavigation);
    });

    buttons.forEach(button => {
        if (button.tagName === 'A' && button.getAttribute('data-section')) {
            button.addEventListener('click', handleNavigation);
        }
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', function(event) {
        if (event.state && event.state.section) {
            showSection(event.state.section);
        }
    });

    // Handle initial page load with hash
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        showSection(hash);
    } else {
        // Default to home section
        showSection('home');
    }

    // Add ripple effect to buttons
    function createRipple(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        button.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // Add ripple effect to all buttons
    const allButtons = document.querySelectorAll('.btn');
    allButtons.forEach(button => {
        button.addEventListener('click', createRipple);
    });

    // Add tilt effect to cards
    function addTiltEffect(card) {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', function() {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    }

    // Add tilt effect to product cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(addTiltEffect);

    // Add icon motion effect
    function addIconMotion(icon) {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(5deg)';
        });

        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    }

    // Add icon motion to product icons
    const productIcons = document.querySelectorAll('.product-icon');
    productIcons.forEach(addIconMotion);

    // Add feature icon motion
    const featureIcons = document.querySelectorAll('.feature-icon');
    featureIcons.forEach(addIconMotion);

    // Smooth scroll to products section on Start now
    const startNowBtnScroll = document.getElementById('start-now-btn');
    const productsSection = document.querySelector('.products-section');
    if (startNowBtnScroll && productsSection) {
        startNowBtnScroll.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Prevent ripple from triggering navigation
            productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    // Attach dark mode toggle event listener after DOM is loaded
    const darkModeToggleBtn = document.getElementById('dark-mode-toggle');
    if (darkModeToggleBtn) {
        console.log('Dark mode toggle button found');
        darkModeToggleBtn.addEventListener('click', () => {
            // Animate toggle button
            darkModeToggleBtn.classList.add('toggling');
            setTimeout(() => darkModeToggleBtn.classList.remove('toggling'), 400);
            // On click, check localStorage for the dark mode value, use to apply the opposite of what's saved
            localStorage.getItem('theme') === 'light' ? enableDarkMode() : disableDarkMode();
        });
    } else {
        console.log('Dark mode toggle button NOT found');
    }

    // SyncSpace Maintenance Modal Logic
    const syncspaceBtn = document.getElementById('syncspace-unavailable-btn');
    const modal = document.getElementById('syncspace-modal');
    const closeBtn = document.getElementById('syncspace-modal-close');
    const cancelBtn = document.getElementById('syncspace-modal-cancel');
    const continueBtn = document.getElementById('syncspace-modal-continue');

    if (syncspaceBtn && modal) {
      syncspaceBtn.addEventListener('click', function(e) {
        e.preventDefault();
        modal.style.display = 'flex';
      });
    }
    if (closeBtn) {
      closeBtn.onclick = function() {
        modal.style.display = 'none';
      };
    }
    if (cancelBtn) {
      cancelBtn.onclick = function() {
        modal.style.display = 'none';
      };
    }
    if (continueBtn) {
      continueBtn.onclick = function() {
        modal.style.display = 'none';
        // Open the actual SyncSpace link
        window.open('https://syncspace.spaceapp.rf.gd/', '_blank');
      };
    }
    // Optional: Close modal when clicking outside content
    window.onclick = function(event) {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    };

    // Smooth scroll for Upcoming Projects button in hero section
    const upcomingBtn = document.querySelector('a[href="#upcoming-projects"]');
    if (upcomingBtn) {
        upcomingBtn.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));
            const target = document.getElementById('upcoming-projects');
            if (target) {
                target.classList.add('active');
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // CashSpace Learn More button logic
    const learnMoreBtn = document.getElementById('cashspace-learnmore-btn');
    const cashspaceCard = document.getElementById('cashspace-card');
    const cashspaceDetails = document.getElementById('cashspace-details');
    if (learnMoreBtn && cashspaceCard && cashspaceDetails) {
        learnMoreBtn.addEventListener('click', function() {
            cashspaceCard.style.display = 'none';
            cashspaceDetails.style.display = 'block';
            cashspaceDetails.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Fix: Reset CashSpace card/details when navigating to Upcoming Projects
    const upcomingProjectsSection = document.getElementById('upcoming-projects');
    if (upcomingProjectsSection) {
      const observer = new MutationObserver(() => {
        const isActive = upcomingProjectsSection.classList.contains('active');
        const cashspaceCard = document.getElementById('cashspace-card');
        const cashspaceDetails = document.getElementById('cashspace-details');
        if (isActive && cashspaceCard && cashspaceDetails) {
          cashspaceCard.style.display = '';
          cashspaceDetails.style.display = 'none';
        }
      });
      observer.observe(upcomingProjectsSection, { attributes: true, attributeFilter: ['class'] });
    }

    const hamburger = document.querySelector('.nav-hamburger');
    const navLinksContainer = document.querySelector('.nav-links');
    if (hamburger && navLinksContainer) {
        console.log('Hamburger and nav-links found');
        hamburger.addEventListener('click', function() {
            navLinksContainer.classList.toggle('open');
        });

        // Auto-hide menu when a link is clicked (on mobile)
        navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('open');
            });
        });
    } else {
        console.log('Hamburger or nav-links NOT found');
    }

    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#') && href.length > 1) {
                const target = document.getElementById(href.substring(1));
                if (target) {
                    e.preventDefault();
                    smoothScrollTo(target);
                }
            }
        });
    });

    // Scroll-to-top button
    let scrollBtn = document.getElementById('scroll-to-top-btn');
    if (!scrollBtn) {
        scrollBtn = document.createElement('button');
        scrollBtn.id = 'scroll-to-top-btn';
        scrollBtn.innerHTML = '↑';
        scrollBtn.style.position = 'fixed';
        scrollBtn.style.bottom = '2rem';
        scrollBtn.style.right = '2rem';
        scrollBtn.style.display = 'none';
        scrollBtn.style.zIndex = '200';
        scrollBtn.style.background = '#6366f1';
        scrollBtn.style.color = '#fff';
        scrollBtn.style.border = 'none';
        scrollBtn.style.borderRadius = '50%';
        scrollBtn.style.width = '48px';
        scrollBtn.style.height = '48px';
        scrollBtn.style.fontSize = '2rem';
        scrollBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
        scrollBtn.style.cursor = 'pointer';
        scrollBtn.style.transition = 'opacity 0.3s';
        document.body.appendChild(scrollBtn);
    }
    window.addEventListener('scroll', function() {
        if (window.scrollY > 200) {
            scrollBtn.style.display = 'block';
            scrollBtn.style.opacity = '1';
        } else {
            scrollBtn.style.opacity = '0';
            setTimeout(() => { if (scrollBtn.style.opacity === '0') scrollBtn.style.display = 'none'; }, 300);
        }
    });
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Section reveal animations
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    function revealOnScroll() {
        const windowHeight = window.innerHeight;
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < windowHeight - 60) {
                el.classList.add('revealed');
            }
        });
    }
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // Touch-friendly improvements for mobile navigation
    if (navLinksContainer) {
        navLinksContainer.style.touchAction = 'manipulation';
        navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
            link.style.padding = '1rem';
            link.style.fontSize = '1.1rem';
        });
    }

    // Status link fade out and redirect
    const statusLink = document.querySelector('a.nav-link[href="https://status.spaceapp.rf.gd/"]');
    if (statusLink) {
        statusLink.addEventListener('click', function(e) {
            e.preventDefault();
            // Create overlay
            let overlay = document.getElementById('redirect-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = 'redirect-overlay';
                overlay.style.position = 'fixed';
                overlay.style.top = 0;
                overlay.style.left = 0;
                overlay.style.width = '100vw';
                overlay.style.height = '100vh';
                overlay.style.background = 'rgba(15,23,42,0.98)';
                overlay.style.display = 'flex';
                overlay.style.alignItems = 'center';
                overlay.style.justifyContent = 'center';
                overlay.style.zIndex = 9999;
                overlay.style.opacity = 0;
                overlay.style.transition = 'opacity 0.5s';
                overlay.innerHTML = '<div style="color:#fff;font-size:2rem;font-weight:600;text-align:center;">Redirecting to status.spaceapp.rf.gd...</div>';
                document.body.appendChild(overlay);
                // Force reflow for transition
                void overlay.offsetWidth;
            }
            overlay.style.opacity = 1;
            setTimeout(() => {
                window.location.href = statusLink.href;
            }, 1000);
        });
    }
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .product-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
    }
    
    .product-icon, .feature-icon {
        transition: transform 0.3s ease;
    }
`;
document.head.appendChild(style);

// Modal logic for Start now button
const startNowBtn = document.getElementById('start-now-btn');
const appModal = document.getElementById('app-modal');
const modalCloseBtn = appModal.querySelector('.modal-close');

function openModal() {
    appModal.classList.add('active');
    appModal.setAttribute('aria-hidden', 'false');
    // Trap focus
    const focusable = appModal.querySelectorAll('a, button:not([disabled]), [tabindex]:not([tabindex="-1"])');
    if (focusable.length) focusable[0].focus();
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    appModal.classList.remove('active');
    appModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    startNowBtn.focus();
}

startNowBtn.addEventListener('click', function(e) {
    e.preventDefault();
    openModal();
});

modalCloseBtn.addEventListener('click', closeModal);

// Close modal on overlay click
appModal.addEventListener('mousedown', function(e) {
    if (e.target === appModal) closeModal();
});

// Close modal on Esc key
window.addEventListener('keydown', function(e) {
    if (appModal.classList.contains('active') && e.key === 'Escape') {
        closeModal();
    }
});

// Trap focus inside modal
appModal.addEventListener('keydown', function(e) {
    if (!appModal.classList.contains('active')) return;
    if (e.key !== 'Tab') return;
    const focusable = appModal.querySelectorAll('a, button:not([disabled]), [tabindex]:not([tabindex="-1"])');
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
        if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
        }
    } else {
        if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }
});

// Smooth scroll for anchor links
function smoothScrollTo(target) {
    if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
} 