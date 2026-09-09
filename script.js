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
