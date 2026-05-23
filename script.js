/* ==========================================================================
   IRONVAULT CORE INTERACTIVE JAVASCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Sticky Glass Navbar & Active Nav Links
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section, header');
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-links a');

    window.addEventListener('scroll', () => {
        // Sticky transition
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link highlighting on scroll
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id') || '';
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // 3. Fullscreen Mobile Navigation Menu
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuLinks = document.querySelectorAll('.mobile-links a, .mobile-cta .btn-premium');

    function toggleMobileMenu() {
        hamburger.classList.toggle('open');
        mobileMenu.classList.toggle('open');
        
        // Prevent body scroll behind menu overlay
        if (mobileMenu.classList.contains('open')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    hamburger.addEventListener('click', toggleMobileMenu);

    // Close menu when clicking on any links
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('open')) {
                toggleMobileMenu();
            }
        });
    });

    // 4. Parallax Hero Image Scroll Effect
    const heroBgImg = document.querySelector('.hero-bg img');
    if (heroBgImg) {
        window.addEventListener('scroll', () => {
            const scrollPos = window.scrollY;
            // Move background image slower than scroll speed
            heroBgImg.style.transform = `translateY(${scrollPos * 0.35}px) scale(1.05)`;
        });
    }

    // 5. Mouse Hover Parallax for Hero Widgets Panel (Desktop only)
    const heroWidgets = document.querySelector('.hero-widgets');
    const widgetCards = document.querySelectorAll('.widget-card');
    
    if (heroWidgets && window.innerWidth > 992) {
        heroWidgets.addEventListener('mousemove', (e) => {
            const rect = heroWidgets.getBoundingClientRect();
            const x = e.clientX - rect.left - (rect.width / 2);
            const y = e.clientY - rect.top - (rect.height / 2);
            
            widgetCards.forEach((card, index) => {
                // Different depth speeds
                const depth = (index + 1) * 0.05;
                const moveX = x * depth;
                const moveY = y * depth;
                card.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.01)`;
            });
        });

        heroWidgets.addEventListener('mouseleave', () => {
            widgetCards.forEach(card => {
                card.style.transform = 'translate(0, 0) scale(1)';
            });
        });
    }

    // 6. Interactive BMI Calculator
    const bmiHeight = document.getElementById('bmi-height');
    const bmiWeight = document.getElementById('bmi-weight');
    const bmiBtn = document.getElementById('bmi-calc-btn');
    const bmiResultBox = document.getElementById('bmi-result-box');
    const bmiValSpan = document.getElementById('bmi-val');
    const bmiLabelSpan = document.getElementById('bmi-label');

    if (bmiBtn) {
        bmiBtn.addEventListener('click', () => {
            const h = parseFloat(bmiHeight.value);
            const w = parseFloat(bmiWeight.value);

            if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) {
                alert('Please enter valid height and weight values.');
                return;
            }

            // Height converted from cm to meters
            const heightInMeters = h / 100;
            const bmi = w / (heightInMeters * heightInMeters);
            const bmiFormatted = bmi.toFixed(1);

            let category = '';
            let color = '';

            if (bmi < 18.5) {
                category = 'Underweight';
                color = '#3B82F6'; // Blue
            } else if (bmi >= 18.5 && bmi < 25) {
                category = 'Normal';
                color = '#4CD964'; // Green
            } else if (bmi >= 25 && bmi < 30) {
                category = 'Overweight';
                color = '#FF9500'; // Orange
            } else {
                category = 'Obese';
                color = '#FF3B30'; // Red
            }

            bmiValSpan.textContent = bmiFormatted;
            bmiLabelSpan.textContent = category;
            bmiLabelSpan.style.color = color;

            bmiResultBox.classList.add('active');
        });
    }

    // 7. Interactive Testimonials Carousel Slider
    const track = document.querySelector('.testimonials-wrapper');
    const slides = Array.from(document.querySelectorAll('.testimonial-slide'));
    const nextBtn = document.getElementById('testimonial-next');
    const prevBtn = document.getElementById('testimonial-prev');
    const dotsContainer = document.getElementById('testimonial-dots');
    
    let currentSlideIdx = 0;
    let autoPlayTimer = null;

    if (track && slides.length > 0) {
        // Create indicator dots dynamically
        slides.forEach((_, idx) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (idx === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                moveToSlide(idx);
                resetAutoPlay();
            });
            dotsContainer.appendChild(dot);
        });

        const dots = Array.from(dotsContainer.querySelectorAll('.dot'));

        function moveToSlide(index) {
            if (index < 0) index = slides.length - 1;
            if (index >= slides.length) index = 0;
            
            currentSlideIdx = index;
            track.style.transform = `translateX(-${index * 100}%)`;
            
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === index);
            });
        }

        nextBtn.addEventListener('click', () => {
            moveToSlide(currentSlideIdx + 1);
            resetAutoPlay();
        });

        prevBtn.addEventListener('click', () => {
            moveToSlide(currentSlideIdx - 1);
            resetAutoPlay();
        });

        // Autoplay logic
        function startAutoPlay() {
            autoPlayTimer = setInterval(() => {
                moveToSlide(currentSlideIdx + 1);
            }, 5500);
        }

        function resetAutoPlay() {
            clearInterval(autoPlayTimer);
            startAutoPlay();
        }

        startAutoPlay();

        // Pause autoplay on mouse hover
        const carouselContainer = document.querySelector('.testimonials-container');
        carouselContainer.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
        carouselContainer.addEventListener('mouseleave', startAutoPlay);
    }

    // 8. Intersection Observer for Scroll Reveals, Stats Counters, and Progress Bars
    
    // Custom Stats counter animation
    function animateCounter(element) {
        const target = parseFloat(element.getAttribute('data-target'));
        const isDecimal = element.getAttribute('data-decimal') === 'true';
        const speed = 200; // lower number = slower
        const inc = target / speed;
        
        let count = 0;
        
        const updateCount = () => {
            count += inc;
            if (count < target) {
                element.textContent = isDecimal ? count.toFixed(1) : Math.ceil(count);
                setTimeout(updateCount, 5);
            } else {
                element.textContent = isDecimal ? target.toFixed(1) : target;
            }
        };
        updateCount();
    }

    // Custom Progress bar animation trigger
    function animateProgressBar(bar) {
        const progress = bar.getAttribute('data-progress');
        bar.style.width = `${progress}%`;
    }

    // Setup Intersection Observer
    const revealOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const generalObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add active reveal states
                entry.target.classList.add('active');
                
                // If it is a stats counter, trigger animation
                const counters = entry.target.querySelectorAll('.counter-val');
                counters.forEach(counter => {
                    if (!counter.classList.contains('counted')) {
                        counter.classList.add('counted');
                        animateCounter(counter);
                    }
                });

                // If it is progress bar container, animate bars
                const progressBars = entry.target.querySelectorAll('.progress-bar-fill');
                progressBars.forEach(bar => {
                    animateProgressBar(bar);
                });

                // Unobserve since it is done revealing
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    // Register sections & revealable classes to observer
    document.querySelectorAll('.reveal-up, .reveal-scale, section, .hero-stats').forEach(el => {
        generalObserver.observe(el);
    });

    // 9. Interactive Contact Form Handler
    const contactForm = document.getElementById('contactForm');
    const successMsg = document.getElementById('formSuccessMsg');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Collect Form Values (Simulated send)
            const name = document.getElementById('form-name').value;
            const email = document.getElementById('form-email').value;
            
            if (name.trim() === '' || email.trim() === '') {
                alert('Please enter your name and email address.');
                return;
            }

            // Custom glowing success response
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'SECURED...';
            submitBtn.style.opacity = '0.7';

            setTimeout(() => {
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
                submitBtn.style.opacity = '1';

                successMsg.classList.add('show');

                // Hide message after 5 seconds
                setTimeout(() => {
                    successMsg.classList.remove('show');
                }, 5000);
            }, 1500);
        });
    }

    // 10. Interactive Footer Newsletter Simulation
    const newsForm = document.querySelector('.news-form');
    if (newsForm) {
        newsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsForm.querySelector('input');
            if (input.value.trim() === '') return;
            
            alert(`ACCESS GRANTED. Welcome to the Vault Elite Newsletter!`);
            input.value = '';
        });
    }
});
