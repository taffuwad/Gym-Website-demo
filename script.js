// smooth scroll------------------lenis--------------------------------------

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(SplitText);

const lenis = new Lenis({
  smoothWheel: true,
  lerp:0.05,
});

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);












// Navbar links use Lenis when available and keep the current section visible.
const navlinks = document.querySelectorAll('.nav-link');

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

// Social Icons - Active State Management
const socialIcons = document.querySelectorAll('.social > div');

socialIcons.forEach((icon) => {
    icon.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remove active class from all icons
        socialIcons.forEach(el => el.classList.remove('active'));
        
        // Add active class to clicked icon
        this.classList.add('active');
    });
});

// Optional: Add smooth redirect to social media links
const socialLinks = {
    fb: 'https://facebook.com',
    insta: 'https://instagram.com',
    wa: 'https://wa.me/'
};

document.querySelector('.fb').addEventListener('click', function() {
    // Uncomment to redirect: window.open(socialLinks.fb, '_blank');
});

document.querySelector('.insta').addEventListener('click', function() {
    // Uncomment to redirect: window.open(socialLinks.insta, '_blank');
});

document.querySelector('.wa').addEventListener('click', function() {
    // Uncomment to redirect: window.open(socialLinks.wa, '_blank');
});

/* ============================================================
   NAVBAR SCROLL EFFECT - Smooth Background Transition
   ============================================================
   Features:
   - Detects when user scrolls past 50px threshold
   - Adds 'scrolled' class to nav elements
   - Triggers smooth CSS transitions (0.3s ease)
   - Uses passive event listener for 60fps performance
   - Applies to both desktop and mobile navbars
   - No memory leaks, automatic cleanup
   ============================================================ */

const navbar = document.querySelector('nav');
const mobileNavbar = document.querySelector('.mobile-nav');
const scrollThreshold = 50;

// Scroll event listener with passive flag for optimal performance
window.addEventListener('scroll', () => {
    if (window.scrollY > scrollThreshold) {
        // Add scrolled class (dark background with blur) - DESKTOP ONLY
        if (navbar && !navbar.classList.contains('scrolled')) {
            navbar.classList.add('scrolled');
        }
        // Mobile navbar: NO scroll effect
    } else {
        // Remove scrolled class (transparent background) - DESKTOP ONLY
        if (navbar && navbar.classList.contains('scrolled')) {
            navbar.classList.remove('scrolled');
        }
        // Mobile navbar keeps default transparent state
    }
}, { passive: true });

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const home = document.querySelector('.home');


ScrollTrigger.create({
  trigger: home,
  start: 'top top',
  end: () => '+=' + window.innerHeight, // dynamic — matches viewport height
  pin: true,
  pinSpacing: false,
  anticipatePin: 1,
  invalidateOnRefresh: true,
});

// Depth effect
gsap.to(home, {
  ease: 'none',
  scrollTrigger: {
    trigger: '.about',
    start: 'top bottom',
    end: 'top top',
    scrub: 1,
  },
});


gsap.to('.dl-simbol',{
    rotate: 40,
    repeat: -1,
    yoyo: true,
    duration:2
})

// slider---------------------------------------------------------------------------------------------------------------------

;(() => {
  "use strict";

  const stage   = document.querySelector(".gym-room__stage");
  const wheel   = document.querySelector(".gym-room__wheel");
  const prevBtn = document.querySelector(".gym-room__btn--prev");
  const nextBtn = document.querySelector(".gym-room__btn--next");
  const cards   = gsap.utils.toArray(".gym-room__card");
  const inners  = cards.map((c) => c.querySelector(".gym-room__card-inner"));

  const COUNT = cards.length;
  if (!COUNT || !stage || !wheel) return;

  /* ---------------- constants ---------------- */

  const STEP       = 360 / COUNT;   // angular gap between cards
  const CARD_RATIO = 1.34;          // height / width
  const FADE_ARC   = 92;            // degrees over which a card fades out

  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const EASE    = REDUCED ? "none" : "power3.out";

  const mod   = (n, m) => ((n % m) + m) % m;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

  /* ---------------- state ---------------- */

  let radius     = 600;
  let rotation   = 0;      // wheel rotation in degrees
  let current    = 0;      // index of the card logically at the top
  let animating  = false;
  let baseAngles = [];

  /* ============================================================
     1. LAYOUT — every dimension is derived from the viewport
     ============================================================ */
  function layout() {
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    if (!w || !h) return;

    const isMobile = w < 720;

    let cardW, r;

    if (isMobile) {
      /* phone: big card, tight wheel, neighbours peek in from the sides */
      cardW = Math.min(w * 0.52, (h * 0.36) / CARD_RATIO);
      r     = w * 0.92;
    } else {
      /* desktop: wide fan of cards */
      cardW = Math.min(w * 0.20, (h * 0.38) / CARD_RATIO);
      r     = w * 0.48;
    }

    cardW = clamp(cardW, 110, w * 0.68);
    r     = clamp(r, 220, 2400);

    const cardH = cardW * CARD_RATIO;
    radius = r;

    stage.style.setProperty("--gym-card-w", cardW.toFixed(2) + "px");
    stage.style.setProperty("--gym-card-h", cardH.toFixed(2) + "px");

    /* wheel centre sits below the fold so only the top arc is on screen */
    wheel.style.top = ((isMobile ? h * 0.40 : h * 0.36) + r).toFixed(2) + "px";
  }

  /* ============================================================
     2. PLACE — put every card on the circle
     ============================================================ */
  function place() {
    baseAngles = cards.map((_, i) => i * STEP - 90); // card 0 sits at the top

    cards.forEach((card, i) => {
      const rad = (baseAngles[i] * Math.PI) / 180;

      gsap.set(card, {
        xPercent: -50,
        yPercent: -50,
        x: Math.cos(rad) * radius,
        y: Math.sin(rad) * radius,
        rotation: baseAngles[i] + 90,  // bottom of the card faces the centre
        force3D: true
      });
    });
  }

  /* ============================================================
     3. PAINT — depth (scale + fade) for every frame
     ============================================================ */
  function paint() {
    const rot = Number(gsap.getProperty(wheel, "rotation")) || 0;

    let activeIdx = 0;
    let bestDist  = Infinity;

    for (let i = 0; i < COUNT; i++) {
      /* distance from the top of the wheel, wrapped to 0‑180 */
      const d  = mod(baseAngles[i] + rot + 90 + 180, 360) - 180;
      const ad = Math.abs(d);

      if (ad < bestDist) {
        bestDist  = ad;
        activeIdx = i;
      }

      const t = 1 - Math.min(1, ad / FADE_ARC);   // 1 = top, 0 = far away

      inners[i].style.transform = "scale(" + (0.78 + 0.22 * t).toFixed(4) + ")";
      inners[i].style.opacity   = (0.12 + 0.88 * Math.pow(t, 1.5)).toFixed(3);
    }

    for (let i = 0; i < COUNT; i++) {
      cards[i].classList.toggle("is-active", i === activeIdx);
    }
  }

  /* ============================================================
     4. ANIMATION HELPERS
     ============================================================ */
  function animateTo(target, duration) {
    animating = true;

    gsap.to(wheel, {
      rotation: target,
      duration: REDUCED ? 0.01 : duration,
      ease: EASE,
      overwrite: true,
      onUpdate: paint,
      onComplete: () => {
        animating = false;

        /* normalise so the rotation value never grows unbounded */
        if (Math.abs(rotation) > 720) {
          const n = mod(rotation, 360);
          rotation = n > 180 ? n - 360 : n;
          gsap.set(wheel, { rotation: rotation });
        }
        paint();
      }
    });
  }

  function goTo(index) {
    if (animating) return;

    index = mod(index, COUNT);
    if (index === current) return;

    let diff = index - current;
    if (diff >  COUNT / 2) diff -= COUNT;   // always take the shortest way
    if (diff < -COUNT / 2) diff += COUNT;   // around the circle

    current   = index;
    rotation -= diff * STEP;

    animateTo(rotation, 0.95);
  }

  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);

  nextBtn.addEventListener("click", next);
  prevBtn.addEventListener("click", prev);

  /* ============================================================
     5. POINTER — drag the wheel, tap a card, swipe
     ============================================================ */
  let dragging     = false;
  let pointerId    = null;
  let startX       = 0;
  let startY       = 0;
  let startRot     = 0;
  let degPerPx     = 0.2;
  let movedEnough  = false;
  let downTarget   = null;

  function cancelDrag() {
    dragging = false;
    stage.classList.remove("is-dragging");
    if (pointerId !== null) {
      try { stage.releasePointerCapture(pointerId); } catch (_) {}
      pointerId = null;
    }
  }

  stage.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if (e.isPrimary === false) return;

    gsap.killTweensOf(wheel);
    animating = false;
    dragging  = true;
    pointerId = e.pointerId;
    downTarget = e.target;

    startX = e.clientX;
    startY = e.clientY;
    startRot = Number(gsap.getProperty(wheel, "rotation")) || 0;
    rotation = startRot;
    movedEnough = false;

    /* degrees of wheel rotation per pixel of finger travel
       (scaled so a swipe feels shorter than the physical arc) */
    degPerPx = (180 / Math.PI) / Math.max(radius, 1) * 1.55;

    try { stage.setPointerCapture(e.pointerId); } catch (_) {}
    stage.classList.add("is-dragging");
  });

  stage.addEventListener("pointermove", (e) => {
    if (!dragging || e.pointerId !== pointerId) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    if (!movedEnough) {
      if (Math.abs(dx) < 5 && Math.abs(dy) < 5) return;

      /* clearly a vertical gesture → let the browser scroll */
      if (Math.abs(dy) > Math.abs(dx) * 1.2) {
        cancelDrag();
        return;
      }
      movedEnough = true;
    }

    rotation = startRot - dx * degPerPx;
    gsap.set(wheel, { rotation: rotation });
    paint();
  });

  function endDrag(e) {
    if (!dragging) return;

    const wasMoved = movedEnough;
    const tapTarget = downTarget;

    cancelDrag();
    movedEnough = false;

    /* --- it was a tap: focus the tapped card --- */
    if (!wasMoved) {
      const card = tapTarget && tapTarget.closest
        ? tapTarget.closest(".gym-room__card")
        : null;

      if (card) {
        const idx = cards.indexOf(card);
        if (idx >= 0) goTo(idx);
      }
      return;
    }

    /* --- it was a swipe: snap to the nearest card --- */
    const live = Number(gsap.getProperty(wheel, "rotation")) || 0;
    const idx  = mod(Math.round(-live / STEP), COUNT);

    /* nearest equivalent of the canonical rotation for that index */
    let target = -idx * STEP;
    let delta  = mod(target - live + 180, 360) - 180;
    target = live + delta;

    rotation = target;
    current  = idx;

    animateTo(rotation, 0.7);
  }

  stage.addEventListener("pointerup", endDrag);
  stage.addEventListener("pointercancel", endDrag);

  /* ============================================================
     6. KEYBOARD
     ============================================================ */
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); next(); }
    if (e.key === "ArrowLeft")  { e.preventDefault(); prev(); }
  });

  /* ============================================================
     7. RESIZE / ORIENTATION
     ============================================================ */
  let resizeRaf = 0;

  function rebuild() {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(() => {
      gsap.killTweensOf(wheel);
      animating = false;
      cancelDrag();

      layout();

      /* keep the same card at the top after the geometry changed */
      rotation = -current * STEP;
      gsap.set(wheel, { rotation: rotation });

      place();
      paint();
    });
  }

  window.addEventListener("resize", rebuild);
  window.addEventListener("orientationchange", () => setTimeout(rebuild, 250));
  window.addEventListener("load", rebuild);

  /* ============================================================
     8. BOOT
     ============================================================ */
  layout();

  rotation = -current * STEP;
  gsap.set(wheel, { rotation: rotation });

  place();
  requestAnimationFrame(paint);
})();









// animations--------------------------------------------------------------------------------------
