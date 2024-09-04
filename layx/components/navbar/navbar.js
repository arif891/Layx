const navbar = document.querySelector('navbar');
const navbarWarp = navbar.querySelector('.warp-able')
const navbarToggler = navbar.querySelector('.toggler');
const navbarCloseBtn = navbar.querySelector('.close');
let navbarBackdrop = navbar.querySelector('backdrop');

navbarToggler.addEventListener('click', () => {

    if (!navbarBackdrop && !navbarWarp.classList.contains('full')) {
        navbarBackdrop = document.createElement('backdrop');
        navbarBackdrop.classList.add('navbar-backdrop');

        navbarBackdrop.addEventListener('click', () => {
            toggleNavbar();
        });

        navbarWarp.insertAdjacentElement('afterend', navbarBackdrop);
    }

    toggleNavbar();
});

function toggleNavbar() {
    navbar.classList.toggle('open');
    navbarWarp.classList.toggle('open');

    if (!navbarWarp.classList.contains('full')) {
        navbarBackdrop.classList.toggle('open');
    }
    
    document.body.style.overflow = navbar.classList.contains('open') ? 'hidden' : '';
}

if (navbarCloseBtn) {
    navbarCloseBtn.addEventListener('click', () => {
        toggleNavbar();
    });
};

if (navbar.classList.contains('update-scroll-state')) {
    const scrollDistance = window.innerHeight * .2; 
    let previousScrollPosition = window.scrollY;
    
    function updateScrollState(element, distance) {
        const scrolledPastDistance = window.scrollY > distance;
        const scrollingDown = previousScrollPosition < window.scrollY && (distance * 3) < window.scrollY;
    
        element.classList.toggle('scrolled', scrolledPastDistance);
        element.classList.toggle('scrollingDown', scrollingDown);
        previousScrollPosition = window.scrollY;
    }
    
    window.addEventListener('scroll', function () {
        updateScrollState(navbar, scrollDistance);
    }, { passive: true });
};