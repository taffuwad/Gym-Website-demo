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
