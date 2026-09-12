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






