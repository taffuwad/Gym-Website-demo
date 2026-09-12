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
