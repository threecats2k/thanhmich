// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    // Announcement bar
    if (!localStorage.getItem('announcementDismissed')) {
        const bar = document.createElement('div');
        bar.className = 'announcement-bar';
        bar.innerHTML = `
            <div class="container">
                <span>Classic GBA Emulator: Old Play is live on Google Play. <a href="https://play.google.com/store/apps/details?id=com.oldplay.gba.emulator.retro.games" target="_blank" rel="noopener">Get it now &rarr;</a></span>
                <button type="button" class="announcement-bar__close" aria-label="Dismiss">&times;</button>
            </div>
        `;
        document.body.prepend(bar);
        bar.querySelector('.announcement-bar__close').addEventListener('click', function() {
            bar.classList.add('is-dismissed');
            localStorage.setItem('announcementDismissed', '1');
        });
    }

    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });

        document.addEventListener('click', function(event) {
            if (!event.target.closest('.navbar')) {
                navMenu.classList.remove('active');
            }
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    if (navMenu) {
                        navMenu.classList.remove('active');
                    }
                }
            }
        });
    });

    // Form validation (skip contact form as it has its own handler)
    const forms = document.querySelectorAll('form:not(#contactForm)');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('field-error');
                } else {
                    field.classList.remove('field-error');
                }
            });

            const emailFields = form.querySelectorAll('input[type="email"]');
            emailFields.forEach(field => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (field.value && !emailRegex.test(field.value)) {
                    isValid = false;
                    field.classList.add('field-error');
                    alert('Please enter a valid email address.');
                }
            });

            const phoneFields = form.querySelectorAll('input[type="tel"]');
            phoneFields.forEach(field => {
                const phoneRegex = /^[+0-9 ()-]{8,17}$/;
                if (field.value && !phoneRegex.test(field.value.trim())) {
                    isValid = false;
                    field.classList.add('field-error');
                    alert('Please enter a valid phone number.');
                }
            });

            if (!isValid) {
                e.preventDefault();
                alert('Please fill in all required fields.');
            }
        });
    });

    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('field-error');
        });
    });

    // Scroll reveal
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Floating action buttons: scroll-to-top + email
    const fabStack = document.createElement('div');
    fabStack.className = 'fab-stack';
    fabStack.innerHTML = `
        <a href="mailto:contact@thanhmichltd.store" class="fab fab--accent is-visible" aria-label="Email us">&#9993;</a>
        <button type="button" class="fab" id="scrollTopFab" aria-label="Scroll to top">&#8593;</button>
    `;
    document.body.appendChild(fabStack);

    const scrollTopFab = document.getElementById('scrollTopFab');
    const topMarker = document.querySelector('.hero, .page-header');
    if (scrollTopFab) {
        scrollTopFab.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        if (topMarker) {
            const topObserver = new IntersectionObserver(function(entries) {
                scrollTopFab.classList.toggle('is-visible', !entries[0].isIntersecting);
            }, { threshold: 0 });
            topObserver.observe(topMarker);
        }
    }

    // Hero visual tilt (fine pointers only)
    const heroVisual = document.querySelector('.hero-visual');
    const heroTilt = document.getElementById('heroTilt');
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

    if (heroVisual && heroTilt && hasFinePointer) {
        const maxTilt = 10;

        heroVisual.addEventListener('mousemove', function(e) {
            const rect = heroVisual.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width - 0.5;
            const py = (e.clientY - rect.top) / rect.height - 0.5;
            heroTilt.style.transform = `rotateX(${(-py * maxTilt).toFixed(2)}deg) rotateY(${(px * maxTilt).toFixed(2)}deg)`;
        });

        heroVisual.addEventListener('mouseleave', function() {
            heroTilt.style.transform = 'rotateX(0deg) rotateY(0deg)';
        });
    }
});
