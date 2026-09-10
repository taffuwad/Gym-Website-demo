const navlinks = document.querySelectorAll('.nav-link');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let lenis;

function initLenis() {
    // Native scrolling is substantially smoother here than a second
    // requestAnimationFrame-driven scroll engine layered over video and GSAP.
    lenis = null;
}

function refreshScrollTriggersAfterImagesLoad() {
    const main = document.querySelector('main');
    if (!main) return;

    const refresh = () => {
        main.classList.add('media-ready');
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    };

    // A single layout measurement after load avoids recalculating every
    // ScrollTrigger once for each gallery image.
    if (document.readyState === 'complete') {
        refresh();
    } else {
        window.addEventListener('load', refresh, { once: true });
    }
}

    navlinks.forEach((navlink)=>{
        let innerText = navlink.innerText;
        navlink.innerHTML = '';

        let textContainer = document.createElement('div');
        textContainer.classList.add('block');

        for(let letter of innerText){
            let span = document.createElement('span');
            span.innerText = letter.trim() === '' ? '\xa0' : letter;
            span.classList.add('letter');
            textContainer.appendChild(span);
        }

        navlink.appendChild(textContainer);
    navlink.appendChild(textContainer.cloneNode(true));
});

const overviewThumbs = new Swiper('.overview-thumbs-slider', {
    spaceBetween: 12,
    slidesPerView: 4,
    freeMode: true,
    watchSlidesProgress: true,
    breakpoints: {
        640: { slidesPerView: 5 },
        900: { slidesPerView: 6 }
    }
});

new Swiper('.overview-main-slider', {
    loop: true,
    speed: 650,
    navigation: {
        nextEl: '.overview-slider-next',
        prevEl: '.overview-slider-prev'
    },
    thumbs: {
        swiper: overviewThumbs
    }
});

/* ==========================================================================
   PEAKEAS LOCATION & GALLERY MODULE
   ========================================================================== */

const locations = [
    {
        id: "canoga-park",
        name: "CANOGA PARK",
        displayName: "CANOGA<br>PARK",
        image: "Components/home-image/gym1.jpg",
        description: "High-intensity strength arena equipped with competition racks, custom turf zones, and dedicated recovery suites."
    },
    {
        id: "los-angeles",
        name: "LOS ANGELES",
        displayName: "LOS<br>ANGELES",
        image: "Components/home-image/gym2.jpg",
        description: "The flagship metropolitan training sanctuary. Cutting-edge biomechanical machinery and atmospheric training floors."
    },
    {
        id: "van-nuys",
        name: "VAN NUYS",
        displayName: "VAN<br>NUYS",
        image: "Components/home-image/gym3.jpg",
        description: "Raw, industrial powerhouse designed for athletic conditioning, powerlifting, and pure performance."
    },
    {
        id: "noho",
        displayName: "NOHO",
        name: "NOHO",
        image: "Components/home-image/gym4.jpg",
        description: "Editorial training environment featuring creative conditioning spaces, open movement yards, and elite strength gear."
    },
    {
        id: "sylmar",
        name: "SYLMAR",
        displayName: "SYLMAR",
        image: "Components/home-image/gym5.jpg",
        description: "Sprawling athletic complex combining heavyweight strength zones, endurance circuits, and outdoor functional bays."
    },
    {
        id: "pasadena",
        name: "PASADENA",
        displayName: "PASADENA",
        image: "Components/home-image/gym6.jpg",
        description: "Refined, architectural strength studio balancing heavy iron performance with elevated recovery amenities."
    }
];

function initLocationSection() {
    const grid = document.getElementById('loc-grid');
    if (!grid) return;

    // 1. Render location cards dynamically
    grid.innerHTML = locations.map((loc, idx) => {
        const num = String(idx + 1).padStart(2, '0');
        return `
            <a href="#${loc.id}" 
               class="loc-card" 
               data-loc-id="${loc.id}" 
               data-loc-index="${idx}"
               role="button"
               aria-haspopup="dialog"
               aria-label="View ${loc.name} location details">
                <div class="loc-card__img-wrap">
                    <img class="loc-card__img" 
                         src="${loc.image}" 
                         alt="PEAKEAS ${loc.name} gym interior" 
                         loading="eager"
                         decoding="async">
                </div>
                <div class="loc-card__overlay" aria-hidden="true"></div>
                <div class="loc-card__content">
                    <span class="loc-card__index">${num}</span>
                    <h3 class="loc-card__name">${loc.displayName}</h3>
                    <span class="loc-card__cta">
                        <span>EXPLORE LOCATION</span>
                        <i class="ri-arrow-right-line" aria-hidden="true"></i>
                    </span>
                </div>
            </a>
        `;
    }).join('');

    // 2. Modal Controller
    const modal = document.getElementById('loc-modal');
    const modalBackdrop = document.getElementById('loc-modal-backdrop');
    const modalClose = document.getElementById('loc-modal-close');
    const modalImg = document.getElementById('modal-loc-img');
    const modalIndex = document.getElementById('modal-loc-index');
    const modalName = document.getElementById('modal-loc-name');
    const modalDesc = document.getElementById('modal-loc-desc');
    const modalAddress = document.getElementById('modal-loc-address');
    const modalDirections = document.getElementById('modal-loc-directions');
    const modalViewBtn = document.getElementById('modal-loc-view');
    const modalJoinBtn = document.getElementById('modal-loc-join');
    let lastFocusedElement = null;

    function openModal(loc, index, triggerEl) {
        if (!modal) return;
        lastFocusedElement = triggerEl;

        modalImg.src = loc.image;
        modalImg.alt = `PEAKEAS ${loc.name} gym interior`;
        modalIndex.textContent = String(index + 1).padStart(2, '0');
        modalName.textContent = loc.name;
        modalDesc.textContent = loc.description;
        modalAddress.textContent = `[LOCATION ADDRESS]`;
        modalDirections.href = `https://www.google.com/maps/search/?api=1&query=PEAKEAS+${encodeURIComponent(loc.name)}`;

        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        if (lenis) lenis.stop();

        if (modalClose) {
            modalClose.focus();
        }
    }

    function closeModal() {
        if (!modal || !modal.classList.contains('is-open')) return;
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (lenis) lenis.start();

        if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
            lastFocusedElement.focus();
        }
    }

    // Bind card click events
    grid.querySelectorAll('.loc-card').forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const locIndex = parseInt(card.getAttribute('data-loc-index'), 10);
            const locData = locations[locIndex];
            if (locData) {
                openModal(locData, locIndex, card);
            }
        });

        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
    if (modalViewBtn) {
        modalViewBtn.addEventListener('click', () => {
            closeModal();
        });
    }
    if (modalJoinBtn) {
        modalJoinBtn.addEventListener('click', () => {
            closeModal();
            const joinBtn = document.querySelector('nav .join');
            if (joinBtn) joinBtn.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Modal keyboard trap and Escape key
    document.addEventListener('keydown', (e) => {
        if (!modal || !modal.classList.contains('is-open')) return;

        if (e.key === 'Escape') {
            e.preventDefault();
            closeModal();
            return;
        }

        if (e.key === 'Tab') {
            const focusables = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (focusables.length === 0) return;
            const firstEl = focusables[0];
            const lastEl = focusables[focusables.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === firstEl) {
                    e.preventDefault();
                    lastEl.focus();
                }
            } else {
                if (document.activeElement === lastEl) {
                    e.preventDefault();
                    firstEl.focus();
                }
            }
        }
    });

    // 3. Desktop Custom Cursor Interaction
    const cursor = document.getElementById('loc-cursor');
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;

    if (cursor && isFinePointer) {
        const cards = grid.querySelectorAll('.loc-card');

        window.addEventListener('mousemove', (e) => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
        }, { passive: true });

        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                cursor.classList.add('is-active');
            });
            card.addEventListener('mouseleave', () => {
                cursor.classList.remove('is-active');
            });
        });
    }

    // 4. GSAP + ScrollTrigger Entrance Animations
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !prefersReducedMotion) {
        gsap.registerPlugin(ScrollTrigger);

        const locSection = document.querySelector('.location-section');
        if (!locSection) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: locSection,
                start: 'top 75%',
                toggleActions: 'play none none none',
                once: true
            }
        });

        // Eyebrow
        tl.from('.loc-section-number', {
            opacity: 0,
            y: 20,
            duration: 0.6,
            ease: 'power3.out'
        }, 0)
        .from('.loc-kicker', {
            opacity: 0,
            y: 30,
            duration: 0.7,
            ease: 'power3.out'
        }, 0.1)
        // Heading line by line
        .from('.loc-heading__line', {
            opacity: 0,
            y: 50,
            duration: 0.85,
            stagger: 0.12,
            ease: 'power3.out'
        }, 0.2)
        // Description
        .from('.loc-desc', {
            opacity: 0,
            y: 25,
            duration: 0.75,
            ease: 'power3.out'
        }, 0.45);

        // One trigger for the entire gallery is far cheaper than four
        // triggers per card (reveal, mask, content, and scroll parallax).
        const cardElements = grid.querySelectorAll('.loc-card');
        if (cardElements.length) {
            gsap.from(cardElements, {
                opacity: 0,
                y: 32,
                duration: 0.65,
                stagger: 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: grid,
                    start: 'top 82%',
                    toggleActions: 'play none none none',
                    once: true
                }
            });
        }
    }
}

function initGlobalScrollAnimations() {
    if (prefersReducedMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const aboutSection = document.querySelector('.about-section');
    if (aboutSection) {
        const aboutTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: aboutSection,
                start: 'top 72%',
                toggleActions: 'play none none none',
                once: true
            }
        });

        aboutTimeline
            .from('.about-img', { clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'power3.inOut' })
            .from('.about-experience', { opacity: 0, y: 28, duration: 0.65, ease: 'power3.out' }, '-=0.35')
            .from('.about-kicker, .about-right h2, .about-right .about-title > p:not(.about-kicker), .about-cta', {
                opacity: 0,
                y: 34,
                duration: 0.7,
                stagger: 0.12,
                ease: 'power3.out'
            }, '-=0.75');
    }

    const overviewSection = document.querySelector('.gym-over-view');
    if (overviewSection) {
        gsap.timeline({
            scrollTrigger: {
                trigger: overviewSection,
                start: 'top 72%',
                toggleActions: 'play none none none',
                once: true
            }
        })
            .from('.overview-kicker, .overview-heading h2, .overview-heading > p', {
                opacity: 0,
                y: 32,
                duration: 0.7,
                stagger: 0.1,
                ease: 'power3.out'
            })
            .from('.overview-gallery', { opacity: 0, y: 54, duration: 0.9, ease: 'power3.out' }, '-=0.25');
    }

    const contactSection = document.querySelector('.gym-contact');
    if (contactSection) {
        gsap.from('.contact-wrapper, .contact-form-wrapper', {
            opacity: 0,
            y: 44,
            duration: 0.85,
            stagger: 0.16,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: contactSection,
                start: 'top 78%',
                toggleActions: 'play none none none',
                once: true
            }
        });
    }
}

function initHeroVideoPerformance() {
    const heroVideo = document.querySelector('.main-hero-video');
    if (!heroVideo || !('IntersectionObserver' in window)) return;

    // Do not keep decoding the large background video after it has left view.
    const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
            heroVideo.play().catch(() => {});
        } else {
            heroVideo.pause();
        }
    }, { threshold: 0.02 });

    observer.observe(heroVideo);
}

function initSite() {
    initLenis();
    initLocationSection();
    initGlobalScrollAnimations();
    initHeroVideoPerformance();
    refreshScrollTriggersAfterImagesLoad();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSite, { once: true });
} else {
    initSite();
}

// Gym loader: keeps the first visit polished while assets finish loading.
(() => {
    const loader = document.getElementById('gymLoader');
    const percentage = document.getElementById('gymLoaderPercent');
    if (!loader) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const startedAt = performance.now();
    let completed = false;

    const setProgress = (value) => {
        const progress = Math.max(0, Math.min(100, Math.round(value)));
        loader.style.setProperty('--loader-progress', `${progress}%`);
        if (percentage) percentage.textContent = `${String(progress).padStart(2, '0')}%`;
    };

    const dismiss = () => {
        if (completed) return;
        completed = true;
        setProgress(100);
        const wait = reducedMotion ? 80 : Math.max(0, 1250 - (performance.now() - startedAt));
        window.setTimeout(() => {
            loader.classList.add('is-hidden');
            document.body.classList.remove('gym-loading');
            window.setTimeout(() => loader.remove(), 600);
        }, wait);
    };

    const waitForImages = () => {
        const images = [...document.images];
        const total = images.length;
        let ready = 0;

        const imageReady = () => {
            ready += 1;
            setProgress((ready / Math.max(total, 1)) * 100);
            if (ready === total) dismiss();
        };

        if (!total) {
            dismiss();
            return;
        }

        images.forEach((image) => {
            // complete also covers a failed request, so one broken image
            // cannot leave the visitor stuck on the loading screen.
            if (image.complete) {
                imageReady();
            } else {
                image.addEventListener('load', imageReady, { once: true });
                image.addEventListener('error', imageReady, { once: true });
            }
        });
    };

    setProgress(0);
    // initSite's DOMContentLoaded handler renders the location cards first;
    // this handler then waits for every image already on the page.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForImages, { once: true });
    } else {
        waitForImages();
    }
})();



// hero section animation--------------------------------------------------------------------
