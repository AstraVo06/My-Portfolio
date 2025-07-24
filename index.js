document.addEventListener('DOMContentLoaded', function() {
    // Track animation state
    const animationStates = new WeakMap();

    // Enhanced reset function
    function resetAnimation(el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.animation = 'none';
        void el.offsetWidth; // Trigger reflow
        animationStates.set(el, false); // Mark as not animated
    }

    // Enhanced play function
    function playAnimation(el) {
        resetAnimation(el); // Always reset first
        el.style.animation = 'fadeInUp 1.2s ease-out forwards';
        animationStates.set(el, true); // Mark as animated
    }

    function playSectionAnimations(section) {
        section.querySelectorAll('.animate-on-scroll').forEach(playAnimation);
    }

    // Navigation active state
    function updateActiveNav(sectionId) {
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
                history.replaceState(null, null, `#${sectionId}`);
            }
        });
    }

    // Enhanced Intersection Observers
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                playSectionAnimations(entry.target);
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                updateActiveNav(entry.target.id);
                sessionStorage.setItem('lastActiveSection', entry.target.id);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '-50px 0px -50px 0px'
    });

    // Initialize all sections
    document.querySelectorAll('section').forEach(section => {
        section.querySelectorAll('.animate-on-scroll').forEach(resetAnimation);
        animationObserver.observe(section);
        navObserver.observe(section);
    });

    // Enhanced nav link handling
    document.querySelectorAll('.nav-links a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            
            if (!target) return;
            
            // Use requestAnimationFrame for smoother reset
            requestAnimationFrame(() => {
                // Reset all animations in target section
                target.querySelectorAll('.animate-on-scroll').forEach(resetAnimation);
                
                window.scrollTo({
                    top: target.offsetTop - 60,
                    behavior: 'smooth'
                });
                
                // Small delay to ensure scroll completes before animation
                setTimeout(() => {
                    playSectionAnimations(target);
                }, 300);
            });
        });
    });

    // Handle initial load
    const lastActiveSection = sessionStorage.getItem('lastActiveSection');
    const hashSection = window.location.hash.substring(1);
    const initialSectionId = hashSection || lastActiveSection || 'home';
    const initialSection = document.getElementById(initialSectionId);

    if (initialSection) {
        window.scrollTo({
            top: initialSection.offsetTop - 60,
            behavior: 'auto'
        });
        updateActiveNav(initialSectionId);
    }

    // Skills tab functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const skillGrids = document.querySelectorAll('.skills-grid');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            skillGrids.forEach(grid => grid.classList.remove('active'));
            
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    })});

   // BOOK OVERLAY FUNCTIONALITY
// BOOK OVERLAY FUNCTIONALITY
const books = document.querySelectorAll('.book');
const projectOverlays = document.querySelectorAll('.project-overlay');
const closeButtons = document.querySelectorAll('.close-btn');
const workSection = document.getElementById('work');

books.forEach(book => {
    book.addEventListener('click', async function() {
        const projectId = this.getAttribute('data-project');
        const overlay = document.getElementById(projectId);
        
        if (!overlay) return;

        // Show overlay
        projectOverlays.forEach(ov => ov.classList.remove('show'));
        overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Handle video
        const video = overlay.querySelector('video');
        if (video) {
            // Reset video state
            video.currentTime = 0;
            video.muted = true; // Start muted
            video.controls = true; // Show native controls
            
            try {
                await video.play();
            } catch (e) {
                console.log('Autoplay blocked:', e);
            }
        }
        
        // Center the overlay
        const workSectionTop = workSection.offsetTop;
        const workSectionHeight = workSection.offsetHeight;
        const viewportHeight = window.innerHeight;
        const targetScroll = workSectionTop + (workSectionHeight / 2) - (viewportHeight / 2);
        
        window.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
        });
    });
});

// Close handlers (reset video state)
closeButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.stopPropagation();
        const overlay = this.closest('.project-overlay');
        const video = overlay.querySelector('video');
        if (video) {
            video.pause();
            video.currentTime = 0;
            video.muted = true; // Reset to muted when closing
        }
        overlay.classList.remove('show');
        document.body.style.overflow = 'auto';
    });
});

// Close when clicking outside content
projectOverlays.forEach(overlay => {
    overlay.addEventListener('click', function(e) {
        if (e.target === this) {
            const video = this.querySelector('video');
            if (video) {
                video.pause();
                video.currentTime = 0;
                video.muted = true; // Reset to muted when closing
            }
            this.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });
});
if (window.innerWidth <= 600) {
  console.log("Likely a phone screen");
  document.body.classList.add('mobile-view');
}

// Check touch capability (additional phone indicator)
if ('ontouchstart' in window) {
  console.log("Touchscreen device detected");
}

