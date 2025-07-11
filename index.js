document.addEventListener('DOMContentLoaded', function() {
    // Set initial hidden state for all animated elements
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.animation = 'none'; // Ensure no initial animation
    });

    function playAnimation(el) {
        // Reset animation to ensure it plays every time
        el.style.animation = 'none';
        void el.offsetWidth; // Trigger reflow
        el.style.animation = 'fadeInUp 1.5s ease-out forwards';
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
        threshold: 0.2,
        rootMargin: '0px 0px -150px 0px'
    });

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                updateActiveNav(entry.target.id);
                sessionStorage.setItem('lastActiveSection', entry.target.id);
            }
        });
    }, {
        threshold: [0.1, 0.9],
        rootMargin: '-100px 0px -100px 0px'
    });

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        animationObserver.observe(section);
        navObserver.observe(section);
    });

    // Handle page load
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
        // Don't play animations immediately - let the observer handle it
    }

    // Nav link handling
    document.querySelectorAll('.nav-links a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            
            if (!target) return;
            
            // Reset animations for target section
            target.querySelectorAll('.animate-on-scroll').forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.animation = 'none';
            });
            
            window.scrollTo({
                top: target.offsetTop - 60,
                behavior: 'smooth'
            });
        });
    });

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
    });
});